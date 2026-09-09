#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""schema_elda.py — S 状态 Schema 提取与审计（批 2 / P0-4 状态 Schema 化）

只读分析器：不修改游戏任何文件，只扫描 src\\ 提取 S 顶层字段引用并做静态比对。
用法:
  python schema_elda.py extract   # 提取 S 顶层字段引用统计（stdout JSON）
  python schema_elda.py audit     # 静态比对：裸引用风险清单（无默认值且无初始化）
  python schema_elda.py report    # 生成 docs\\状态Schema_v70.md
"""
import io, os, sys, re, glob, json
from collections import Counter, defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(ROOT, 'src')
DOCS = os.path.join(ROOT, 'docs')

FIELD_RE = re.compile(r'\bS\.([A-Za-z_$][\w$]*)')
# 赋值/初始化形态：S.X = ... 、S.X ||= ... 、S.X = S.X || ... 、S.X += ...
ASSIGN_RE = re.compile(r'\bS\.([A-Za-z_$][\w$]*)\s*(\|\|=|=[^=]|\+=|-=)')
# 防御式读：if(S.X) / if(!S.X) / S.X && / S.X || / S.X ? / !S.X
GUARD_RE = re.compile(r'[\(!&|?]\s*!?S\.([A-Za-z_$][\w$]*)')
# 带默认值的引用：S.X || <默认>
DEFAULTED_RE = re.compile(r'\bS\.([A-Za-z_$][\w$]*)\s*\|\|')


def read_scripts():
    """返回 [(filename, text)]，按 script_00..18 排序。"""
    files = sorted(glob.glob(os.path.join(SRC, 'script_*.js')),
                   key=lambda p: int(re.search(r'script_(\d+)\.js$', p).group(1)))
    out = []
    for p in files:
        out.append((os.path.basename(p), io.open(p, encoding='utf-8').read()))
    return out


def parse_empty_state():
    """从 script_03.js 的 emptyState 字面量提取顶层字段（括号深度法）。
    返回 (set, body)。"""
    p = os.path.join(SRC, 'script_03.js')
    txt = io.open(p, encoding='utf-8').read()
    m = re.search(r'const emptyState\s*=\s*\(\)\s*=>\s*\(\s*(.*?)\s*\)\s*;', txt, re.S)
    if not m:
        return set(), ''
    body = m.group(1)
    keys = set()
    for line in body.splitlines():
        # 去掉字符串字面量，避免误判
        line2 = re.sub(r'"[^"]*"', '""', line)
        depth = 0
        i = 0
        n = len(line2)
        while i < n:
            ch = line2[i]
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth = max(0, depth - 1)
            elif ch == ':' and depth == 0:
                j = i - 1
                while j >= 0 and (line2[j].isalnum() or line2[j] in '_$'):
                    j -= 1
                key = line2[j + 1:i]
                if re.match(r'[A-Za-z_$][\w$]*$', key):
                    keys.add(key)
            i += 1
    return keys, body


def analyze():
    """全量扫描：字段 -> {refs: 引用次数, assign: 赋值次数, files: [(file,line)], init: bool}"""
    empty, _ = parse_empty_state()
    fields = defaultdict(lambda: {'ref': 0, 'assign': 0, 'files': []})
    init_fields = set()      # 出现赋值/守卫的字段（有初始化）
    defaulted_fields = set()  # 带 `S.X || 默认` 兜底的字段
    for fname, txt in read_scripts():
        for i, line in enumerate(txt.splitlines(), 1):
            for m in FIELD_RE.finditer(line):
                f = m.group(1)
                fields[f]['ref'] += 1
                if len(fields[f]['files']) < 40:
                    fields[f]['files'].append((fname, i, line.strip()[:80]))
            for m in ASSIGN_RE.finditer(line):
                f = m.group(1)
                fields[f]['assign'] += 1
                init_fields.add(f)
            for m in GUARD_RE.finditer(line):
                init_fields.add(m.group(1))
            for m in DEFAULTED_RE.finditer(line):
                defaulted_fields.add(m.group(1))
    # 嵌套访问 S.a.b 的首层字段已含；S?.a 可选链也覆盖（\bS\b 后 .）
    return empty, fields, init_fields, defaulted_fields


def extract_json():
    empty, fields, _, _ = analyze()
    return json.dumps({
        'empty_state_fields': sorted(empty),
        'all_top_fields': len(fields),
        'fields': {k: {'ref': v['ref'], 'assign': v['assign']} for k, v in sorted(fields.items())}
    }, ensure_ascii=False, indent=1)


def audit_text():
    """静态比对：风险字段 = 有引用但既不在 emptyState 也无初始化（区分真裸引用与 || 兜底）。"""
    empty, fields, init_fields, defaulted = analyze()
    real_risks, soft_risks = [], []
    for f in sorted(fields):
        if f in empty or f in init_fields:
            continue
        if fields[f]['assign'] == 0:
            item = (f, fields[f]['ref'], fields[f]['files'][:6])
            (soft_risks if f in defaulted else real_risks).append(item)
    lines = []
    lines.append('S 顶层字段统计: 共 %d 个字段（emptyState 基础 %d 个，有初始化 %d 个，含||兜底 %d 个）' % (
        len(fields), len(empty), len(init_fields & set(fields)), len(defaulted & set(fields))))
    lines.append('')
    lines.append('=== 真裸引用风险（无默认值、无初始化、无 || 兜底） ===')
    if not real_risks:
        lines.append('无 — 所有被引用字段均有默认值/初始化/|| 兜底。')
    for f, ref, files in real_risks:
        lines.append('[%s] ref=%d' % (f, ref))
        for fn, ln, ctx in files:
            lines.append('    %s:%d  %s' % (fn, ln, ctx))
    lines.append('')
    lines.append('=== 带 || 默认值的防御引用（可接受，需人工确认） ===')
    if not soft_risks:
        lines.append('无。')
    for f, ref, files in soft_risks:
        lines.append('[%s] ref=%d' % (f, ref))
        for fn, ln, ctx in files:
            lines.append('    %s:%d  %s' % (fn, ln, ctx))
    lines.append('')
    lines.append('=== emptyState 基础字段（%d）===' % len(empty))
    lines.append(', '.join(sorted(empty)))
    lines.append('')
    lines.append('=== 动态初始化字段（含守卫，%d）===' % len(init_fields & set(fields)))
    lines.append(', '.join(sorted(init_fields & set(fields))))
    return '\n'.join(lines)


def write_report():
    """生成 docs\\状态Schema_v70.md（自动部分 + 综述）。"""
    empty, fields, init_fields, defaulted = analyze()
    risk = [(f, fields[f]['ref']) for f in sorted(fields)
            if f not in empty and f not in init_fields and fields[f]['assign'] == 0 and f not in defaulted]
    soft = [(f, fields[f]['ref']) for f in sorted(fields)
            if f not in empty and f not in init_fields and fields[f]['assign'] == 0 and f in defaulted]
    dyn = sorted(init_fields & set(fields))
    base = sorted(empty)
    allf = sorted(fields)

    L = []
    A = L.append
    A('# S 状态 Schema（批 2 / P0-4）— 自动生成于 %s' % 'elda schema report')
    A('')
    A('> 本文件由 `schema_elda.py report` 自动生成 + 手工综述两部分构成。')
    A('> 统计口径：扫描 `src\\script_00..18.js` 中所有 `S.<field>` 顶层引用。')
    A('')
    A('## 一、统计概览')
    A('')
    A('| 指标 | 数值 |')
    A('|---|---|')
    A('| S 顶层字段总数 | %d |' % len(allf))
    A('| emptyState 基础字段 | %d |' % len(base))
    A('| 动态初始化字段（含守卫） | %d |' % len(dyn))
    A('| 真裸引用风险字段 | %d |' % len(risk))
    A('| 带 || 兜底字段 | %d |' % len(soft))
    A('')
    A('## 二、基础字段（emptyState，script_03.js:5-24）')
    A('')
    A('| 字段 | 说明 |')
    A('|---|---|')
    base_desc = {
        'v': '存档结构版本（2）', 'ruleset': '规则集 ID（elda-qunxiong-v3）',
        'name': '角色名', 'gender': '性别', 'homeland': '出生地', 'race': '种族',
        'subrace': '亚种/出身', 'background': '背景（可空）', 'job': '职业（可空）',
        'talent': '天赋', 'hobby': '爱好（可空）', 'ideal': '理想（可空）',
        'attrs': '六维属性 {SPR,STR,AGI,INT,CHA,CON}', 'realm': '境界 0=凡人境',
        'xp': '经验', 'gold': '金币', 'silver': '银币', 'hp': '生命', 'san': '理智',
        'maxSan': '理智上限', 'rep': '名望', 'karma': '业力', 'aura': '气质',
        'infl': '九地影响力 {free,north,south,church,elf,dwarf,orc,east,abyss}',
        'fatigue': '疲劳', 'travelFatigue': '旅途疲劳', 'wound': '伤势', 'disease': '疾病标记',
        'job2': '副职（可空）', 'day': '天数（第 N 日）', 'date': '日期文本',
        'loc': '地点 ID', 'region': '区域 ID', 'visited': '已访问地点集合',
        'flags': '剧情标记集合', 'items': '背包物品', 'mats': '材料', 'books': '书籍',
        'skills': '技能', 'conds': '修行条件 {mat,kno,pra,rit,anc,work}',
        'choices': '选择历史（存读档时清空防超限）', 'dice': '骰子记录',
        'world': '世界事件标记 {purge,silver,seal,academy,orc}', 'ending': '结局（可空）',
        'dead': '死亡标记',
    }
    for f in base:
        A('| `%s` | %s |' % (f, base_desc.get(f, '')))
    A('')
    A('## 三、动态初始化字段（ensureDefaults 系 / 运行时守卫）')
    A('')
    A('| 字段 | 首次出现 |')
    A('|---|---|')
    first_loc = {}
    for fname, txt in read_scripts():
        for i, line in enumerate(txt.splitlines(), 1):
            for m in FIELD_RE.finditer(line):
                f = m.group(1)
                if f in dyn and f not in first_loc:
                    first_loc[f] = '%s:%d' % (fname, i)
    for f in dyn:
        A('| `%s` | %s |' % (f, first_loc.get(f, '')))
    A('')
    A('## 四、真裸引用风险字段（audit 结果）')
    A('')
    if not risk:
        A('无 — 所有被引用字段均有默认值或初始化点。')
    else:
        A('| 字段 | 引用次数 |')
        A('|---|---|')
        for f, r in risk:
            A('| `%s` | %d |' % (f, r))
        A('')
        A('> 处理原则：逐项人工确认。若为真实裸引用（读到未初始化字段），属待修复项；')
        A('> 若为防御式引用（引用前必有初始化），标记为可接受。**本批不修改任何运行逻辑。**')
    A('')
    A('## 四·补、带 || 兜底的防御引用（可接受）')
    A('')
    if not soft:
        A('无。')
    else:
        A('| 字段 | 引用次数 |')
        A('|---|---|')
        for f, r in soft:
            A('| `%s` | %d |' % (f, r))
    A('')
    A('## 五、保存/读档链路（现状，v64 铁律语义未动）')
    A('')
    A('```text')
    A('保存: saveGame() script_03:3464')
    A('  S.choices=[] (防超限) → S.curNode → S.saveVersion=48 → S.slotId')
    A('  → S.saveTime → StorageKit.save(S) script_04:8298')
    A('  → saveToLS(slot, data) 多槽位 localStorage')
    A('')
    A('读档: init() script_03:4430（启动探测 v61_lzstring.sniffRaw）')
    A('  → loadGame() script_03:38（StorageKit.load(slotId)）')
    A('  → applyDefaults(d) script_03:25（补默认字段）')
    A('  → S.readings / v46/v55/v56/v57/w64 ensureDefaults')
    A('  → S.saveVersion ||= 48 → 渲染')
    A('```')
    A('')
    A('## 六、校验命令')
    A('')
    A('```text')
    A('python tools\\elda\\schema_elda.py audit   # 裸引用风险清单')
    A('python tools\\elda\\schema_elda.py extract # 全字段统计 JSON')
    A('elda schema                                # 同上（统一入口）')
    A('```')
    A('')
    A('---')
    A('## 七、手工综述')
    A('')
    A('### 7.1 字段治理结论')
    A('- 基础字段 45 个 + 动态字段（ensureDefaults 体系）共同构成 S 的全集。')
    A('- 动态字段按版本分批注入：v46/v51/v52/v53/v54/v55/v56/v57/w64/v65/v66，'
      '读档时按 `if(window.X_ensureDefaults)` 防御式串联调用。')
    A('- 存档语义（saveVersion=48、choices 清空、StorageKit 多槽位）完全沿用 v64 铁律，未作任何改动。')
    A('')
    A('### 7.2 本批改动面')
    A('- 新增 `tools\\elda\\schema_elda.py`（只读分析器）。')
    A('- 新增 `elda schema` 命令（统一入口）。')
    A('- 新增本 Schema 文档。')
    A('- **未修改** game.html / src\\ / 存档逻辑 / 判定公式。')
    A('')
    A('### 7.3 后续批衔接')
    A('- 批 3（存档层 SaveStore）将以此 Schema 为字段白名单，实现导出/导入与 IndexedDB 迁移时的字段校验。')
    A('- 批 4（节点数据化）不改 S 结构，S 字段保持现状。')
    out = os.path.join(DOCS, '状态Schema_v70.md')
    io.open(out, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    return out


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'audit'
    if cmd == 'extract':
        sys.stdout.buffer.write(extract_json().encode('utf-8'))
    elif cmd == 'audit':
        sys.stdout.buffer.write(('\n' + audit_text() + '\n').encode('utf-8'))
    elif cmd == 'report':
        out = write_report()
        sys.stdout.buffer.write(('report written: %s\n' % out).encode('utf-8'))
    else:
        sys.stdout.buffer.write(('unknown cmd: %s\n' % cmd).encode('utf-8'))
        sys.exit(1)
