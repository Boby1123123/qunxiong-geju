# -*- coding: utf-8 -*-
"""P2 剩余项（v90）：内容工具生态完善 + 文本治理自动化

命令族：
  elda content event   --id x --day 40 --cls 天灾 --text "..." [--commit]   事件模板生成/插入 EVENT_POOL_EXT
  elda content quest   --id u9_x --npc lv_mage1 --slot d --entry arrive_x [--commit]  支线骨架（4 节点 65 挚友 + 入口）
  elda content dup                                                         节点 id 跨源重复检测
  elda content chain   [--npc id]                                          支线好感链校验（changeRelation 次数/终值）
  elda text freq       [--top 30]                                          高频词/AI 腔检测
  elda text dup        [--threshold 0.85]                                  相似文本段落检测
  elda text norm                                                           中文标点/全半角规范检查
  elda text len        [--min 1000]                                        节点字数分布 + 超长清单
  elda text names                                                          专名一致性（强者/城市/势力零出现清单）
  elda text all                                                            全部文本治理，输出 docs\\p2_text_report.md

铁律：不触碰引擎/判定/存档；event/quest 仅 --commit 才写 src，写前自动备份。
"""
import io, os, re, sys, glob, json, argparse, time, subprocess

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(PROJ, 'src')
DATA_NODES = os.path.join(SRC, 'data_nodes')
BACKUP = os.path.join(PROJ, 'backup', 'P2_20260909')

AI_WORDS = [
    '微微', '轻轻', '缓缓', '低声', '嘴角', '目光', '片刻', '仿佛', '似乎', '眼底',
    '心头', '喃喃', '沉吟', '皱眉', '深吸', '良久', '微叹', '眸光', '身形一闪', '不由',
    '下意识', '微微一怔', '淡淡道', '沉声道', '轻声道', '若有所思', '不动声色', '隐隐', '隐约', '些许',
]

# 专名表（强者/城市/势力，来自 STRONG_V53 + 地图）
NAMES = [
    # 强者
    '奥薇恩', '洛·晨雾', '凯·青焰', '瑟琳·银冠', '伊尔·灰书', '格罗', '喀兰', '秦·长风', '叶·孤山',
    '罗·断江', '克莱门', '杜·夜枭', '薇·灰雾', '艾琳', '罗兰', '伊莎·晨辉', '格朗', '文森', '洛佩斯',
    '澜·梦墟', '奥雷利安', '寂光', '鬃吼', '腐光', '北境王',
    # 城市/地域
    '艾尔达', '帝京', '河湾城', '铁门关', '赤峰', '自由港', '晨天', '星落海', '黄金城', '学术城',
    '圣辉教堂', '藏书塔', '圣盾广场', '夜枭巷', '观星台', '王庭', '执政厅', '深渊神殿',
    # 势力
    '金衡商会', '圣辉教廷', '学院联邦', '骑士团', '暗蚀会', '冒险者工会', '北方公国',
]


def _read(p):
    return io.open(p, encoding='utf-8', errors='replace').read()


def _write(p, s):
    io.open(p, 'w', encoding='utf-8', newline='').write(s)


def _src_files():
    out = []
    for f in sorted(glob.glob(os.path.join(SRC, '*.js'))):
        out.append(f)
    for f in sorted(glob.glob(os.path.join(DATA_NODES, '*.js'))):
        out.append(f)
    return out


def _all_src_text():
    """全部权威源文本拼接（含 data_nodes），返回 (paths, text)。"""
    paths = _src_files()
    buf = []
    for p in paths:
        buf.append(_read(p))
    return paths, '\n'.join(buf)


def _extract_arrays_deep(text):
    """深度匹配提取 text: [...]（处理嵌套对象/函数），返回原始数组段列表。"""
    out = []
    for m in re.finditer(r'text\s*:\s*\[', text):
        i = m.end() - 1
        depth = 0
        j = i
        instr = None
        while j < len(text):
            c = text[j]
            if instr:
                if c == '\\':
                    j += 2
                    continue
                if c == instr:
                    instr = None
            else:
                if c in '"\'':
                    instr = c
                elif c == '[':
                    depth += 1
                elif c == ']':
                    depth -= 1
                    if depth == 0:
                        break
            j += 1
        out.append(text[i:j + 1])
    return out


def _extract_text_values(text):
    """提取全部 text: "..." / '...' / [ "...", ... ] 的值（含函数式 return 内）。"""
    vals = []
    # 字符串型
    for m in re.finditer(r'text\s*:\s*["\']((?:[^"\'\\]|\\.){8,})["\']', text):
        vals.append(m.group(1).replace('\\n', '\n'))
    # 数组型（深度匹配，不截断）
    for arr in _extract_arrays_deep(text):
        for sm in re.finditer(r'"((?:[^"\\]|\\.){8,})"|\'((?:[^\'\\]|\\.){8,})\'', arr):
            v = sm.group(1) if sm.group(1) is not None else sm.group(2)
            vals.append(v.replace('\\n', '\n'))
    return vals


def _extract_text_units(text):
    """引号配对用单元：text 数组整体合并为 1 个单元，字符串型独立单元。
    对话跨数组元素闭合属合理用法，单元级配对避免误报。"""
    units = []
    for m in re.finditer(r'text\s*:\s*["\']((?:[^"\'\\]|\\.){8,})["\']', text):
        units.append(m.group(1).replace('\\n', '\n'))
    for arr in _extract_arrays_deep(text):
        parts = []
        for sm in re.finditer(r'"((?:[^"\\]|\\.){8,})"|\'((?:[^\'\\]|\\.){8,})\'', arr):
            v = sm.group(1) if sm.group(1) is not None else sm.group(2)
            parts.append(v.replace('\\n', '\n'))
        if parts:
            units.append(' '.join(parts))
    return units


def _extract_nodes(text):
    pat = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*(?:function\s*\([^)]*\)\s*)?\{')
    nodes = {}
    for m in pat.finditer(text):
        nid = m.group(1)
        i = text.find('{', m.start(), m.end())
        if i < 0:
            continue
        depth = 0
        j = i
        while j < len(text):
            c = text[j]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        if nid not in nodes:
            nodes[nid] = {'body': text[i:j], 'line': text.count('\n', 0, m.start()) + 1,
                          'file': None}
    return nodes


# ---------------- content: event ----------------

def cmd_content_event(args):
    ap = argparse.ArgumentParser(prog='elda content event')
    ap.add_argument('--id', required=True)
    ap.add_argument('--day', type=int, default=40)
    ap.add_argument('--cls', default='奇遇', choices=['天灾', '奇遇', '商机', '人祸'])
    ap.add_argument('--text', default='（请填写事件播报文本，50 字以上，符合世界观。）')
    ap.add_argument('--commit', action='store_true')
    a = ap.parse_args(args)
    if not re.match(r'^[A-Za-z0-9_]{3,40}$', a.id):
        print('id 必须为 3-40 位字母数字下划线'); return 1
    tpl = '  { id: "%s", day: %d, cls: "%s", text: "%s" }' % (a.id, a.day, a.cls, a.text)
    p = os.path.join(SRC, 'script_01.js')
    t = _read(p)
    anchor = ']; window.EVENT_POOL_EXT = EVENT_POOL_EXT;'
    if a.commit:
        if anchor not in t:
            print('未找到 EVENT_POOL_EXT 数组收尾锚点，中止（避免误插）'); return 1
        os.makedirs(BACKUP, exist_ok=True)
        io.open(os.path.join(BACKUP, 'script_01.js'), 'w', encoding='utf-8', newline='').write(t)
        # 在 ] 前插入（前一条保留尾逗号）
        t2 = t.replace(anchor, ',' + tpl.replace('  {', '  ', 1) + '\n' + anchor, 1)
        # 若数组原为空则去掉多余前导逗号——本游戏事件池非空，直接写入
        _write(p, t2)
        print('[OK] 事件已插入 script_01.js EVENT_POOL_EXT：id=%s day=%d cls=%s' % (a.id, a.day, a.cls))
        print('  验证：node --check script_01.js 后再 build/sync/ci')
    else:
        print('事件模板（dry-run，加 --commit 插入）：')
        print('  插入点: script_01.js  →  ' + anchor)
        print(tpl)
    return 0


# ---------------- content: quest ----------------

def cmd_content_quest(args):
    ap = argparse.ArgumentParser(prog='elda content quest')
    ap.add_argument('--id', required=True)
    ap.add_argument('--npc', required=True, help='好感 npc id（如 lv_mage1 / north_king）')
    ap.add_argument('--slot', default='d', help='p12Quest 槽位 a-i（默认 d）')
    ap.add_argument('--entry', required=True, help='入口节点 id（对象式，options 数组头部注入）')
    ap.add_argument('--title', default='支线标题')
    ap.add_argument('--commit', action='store_true')
    a = ap.parse_args(args)
    if not re.match(r'^[A-Za-z0-9_]{3,40}$', a.id) or not re.match(r'^[A-Za-z0-9_]{3,40}$', a.npc):
        print('id/npc 必须为 3-40 位字母数字下划线'); return 1
    if a.slot not in 'abcdefghi':
        print('slot 必须为 a-i'); return 1
    nid = a.id
    npc = a.npc
    D = dict(nid=nid, title=a.title, npc=npc, slot=a.slot, entry=a.entry)
    tpl = """// P2 内容工具生成：支线 %(nid)s（%(title)s，npc=%(npc)s，slot=%(slot)s，4 节点 65 挚友）
// 对象式纯数据；run 回调 = changeRelation(好感) + curNode/writeNext(跳转)
N["%(nid)s_enter"] = {
  place: "（入口地点）",
  where: "白日",
  text: [ "（%(title)s —— 请扩写开场：与 %(npc)s 相遇的场景。）" ],
  options: [
    { t: "（上前攀谈）", run: function(){ changeRelation('%(npc)s',10,'初识'); curNode='%(nid)s_step1'; writeNext(); } }
  ]
};
N["%(nid)s_step1"] = {
  place: "（地点）",
  where: "白日",
  text: [ "（请扩写：%(npc)s 的第一件请求/试探。）" ],
  options: [
    { t: "（答应他）", run: function(){ changeRelation('%(npc)s',15,'相助'); curNode='%(nid)s_step2'; writeNext(); } }
  ]
};
N["%(nid)s_step2"] = {
  place: "（地点）",
  where: "白日",
  text: [ "（请扩写：%(npc)s 的第二件请求/考验。）" ],
  options: [
    { t: "（继续相助）", run: function(){ changeRelation('%(npc)s',20,'共历患难'); curNode='%(nid)s_end'; writeNext(); } }
  ]
};
N["%(nid)s_end"] = {
  place: "（地点）",
  where: "白日",
  text: [ "（请扩写：支线结局，%(npc)s 道出心意。奖励：物品/金/历练，S.p12Quest.%(slot)s=4。）" ],
  options: [
    { t: "（郑重收下）", run: function(){
        S.p12Quest.%(slot)s = 4;
        S.gold = (S.gold||0) + 50;
        S.exp = (S.exp||0) + 40;
        // 示例奖励物品：S.items.xxx = 1;
        changeRelation('%(npc)s',20,'挚友');
        curNode='%(nid)s_end_back'; writeNext();
      } }
  ]
};
N["%(nid)s_end_back"] = {
  place: "（返回地点）",
  where: "白日",
  text: [ "（支线 %(nid)s 完成：与 %(npc)s 的羁绊达到挚友。返回原城市。）" ],
  options: [ { t: "（离开）", go: "%(entry)s" } ]
};
/* /p2inj:quest:%(nid)s/ */
""" % D

    if a.commit:
        os.makedirs(DATA_NODES, exist_ok=True)
        outpath = os.path.join(DATA_NODES, 'dn_%s.js' % nid)
        _write(outpath, tpl)
        print('[OK] 支线骨架已生成: %s' % outpath)
        print('  验证：node --check dn_%s.js 后再 build/sync/ci；入口若未注入请按 /p2inj: 标记手动接入' % nid)
        # 入口注入
        p2 = os.path.join(SRC, 'script_02.js')
        t2 = _read(p2)
        m = re.search(r'N\["%s"\]\s*=\s*\{' % re.escape(a.entry), t2)
        if m:
            opts = t2.find('options: [', m.start())
            if opts > 0:
                inject = '  { t: "（%s）", go: "%s_enter" },\n' % (a.title, nid)
                os.makedirs(BACKUP, exist_ok=True)
                io.open(os.path.join(BACKUP, 'script_02.js'), 'w', encoding='utf-8', newline='').write(t2)
                t3 = t2[:opts + len('options: [')] + '\n/* /p2inj:entry:%s/ */\n' % nid + inject + t2[opts + len('options: ['):]
                _write(p2, t3)
                print('[OK] 入口已注入 %s 的 options 头部（/p2inj:entry:%s/ 标记）' % (a.entry, nid))
            else:
                print('[WARN] 入口 %s 无 options: [ 数组，请手动注入' % a.entry)
        else:
            print('[WARN] script_02.js 未找到入口 %s（对象式），请手动注入' % a.entry)
    else:
        print('支线骨架（dry-run，加 --commit 写入）：')
        print('  目标: src/data_nodes/dn_%s.js（4 节点 65 挚友 + 返回节点）' % nid)
        print('  入口: %s.options 头部 → { t:"（%s）", go:"%s_enter" }' % (a.entry, a.title, nid))
        print('  好感链: +10 → +15 → +20 → +20 = 65（与 P1-2/U8 同阈值）')
        print('  奖励: 金+50 / 历练+40 / 物品 / S.p12Quest.%s=4' % a.slot)
    return 0


def cmd_content_causality(args):
    """因果/伏笔账本核销 + 设定词冻结（CM-3；与 eldacheck 第 19 检查器同源逻辑）。
    读取 src 权威源（含 data_nodes 账本），自动核销 open→closed，输出未回收伏笔清单与设定词覆盖率。"""
    import json as _json
    _ep = os.path.join(PROJ, 'tools', 'eldacheck')
    if _ep not in sys.path:
        sys.path.insert(0, _ep)
    from checks import find_node_ids

    text = _all_src_text()[1]
    # 提取账本
    def grab(var):
        m = re.search(r'window\.%s\s*=\s*\[' % var, text)
        if not m:
            return None
        i = m.end() - 1
        depth = 0
        in_str = esc = False
        j = i
        while j < len(text):
            c = text[j]
            if in_str:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': in_str = False
            else:
                if c == '"': in_str = True
                elif c == '[': depth += 1
                elif c == ']':
                    depth -= 1
                    if depth == 0:
                        seg = text[i:j + 1]
                        seg = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
                        return _json.loads(seg)
            j += 1
        return None

    ledger = grab('CAUSALITY_LEDGER')
    words = grab('CAUSALITY_WORDS')
    if ledger is None or words is None:
        print('[FAIL] 账本解析失败（CAUSALITY_LEDGER / CAUSALITY_WORDS 缺失）')
        return 1

    ids = set(find_node_ids(text).keys())
    gos = set(re.findall(r'go:\s*["\']([^"\']+)["\']', text)) | set(re.findall(r'then:\s*["\']([^"\']+)["\']', text))
    flags = set(re.findall(r'flag:\s*["\']([^"\']+)["\']', text)) | set(re.findall(r'eff\.flag\s*=\s*["\']([^"\']+)["\']', text))

    def anchor_ok(anchor):
        if not anchor:
            return False
        if anchor.startswith('flag:'):
            return anchor[5:] in flags
        if anchor.startswith('node:'):
            nid = anchor[5:]
            dyn = ('curNode=%s' % nid) in text.replace('"', '').replace("'", '')
            return nid in ids and (nid in gos or dyn)
        return text.count(anchor) > 0

    open_items, closed = [], 0
    for it in ledger:
        if anchor_ok(it.get('plant')) and anchor_ok(it.get('reap')):
            closed += 1
        elif anchor_ok(it.get('plant')):
            open_items.append((it['id'], it.get('world', '?'), it.get('desc', '')[:36]))

    missing = [w.get('word') for w in words if text.count(w.get('word', '')) == 0]
    print('因果/伏笔账本：共 %d 项，核销 closed=%d，未回收 open=%d' % (len(ledger), closed, len(open_items)))
    print('设定词冻结：%d/%d 覆盖' % (len(words) - len(missing), len(words)))
    if open_items:
        print('── 未回收伏笔清单 ──')
        for i, w, d in open_items:
            print('  [OPEN] %s (%s) %s' % (i, w, d))
    if missing:
        print('[FAIL] 设定词缺失: %s' % ','.join(missing))
        return 1
    print('[OK] 账本核销与设定词冻结全部通过')
    return 0


# ---------------- content: dup / chain ----------------

def cmd_content_dup():
    """跨权威源文件（src/*.js + data_nodes/*.js）节点 id 重复检测。
    game.html 是构建产物（含全部源定义），不参与比对。"""
    all_nodes = {}
    dups = []
    for p in _src_files():
        for nid, nd in _extract_nodes(_read(p)).items():
            if nid in all_nodes:
                dups.append((nid, all_nodes[nid]['file'], all_nodes[nid]['line'], p, nd['line']))
            else:
                nd['file'] = p
                all_nodes[nid] = nd
    if dups:
        for nid, f1, l1, f2, l2 in dups[:30]:
            print('DUP %s  (%s L%d 与 %s L%d)' % (nid, os.path.basename(f1), l1, os.path.basename(f2), l2))
    print('节点 id 唯一性：检查 %d 个源定义（%d 个文件），重复 %d 处' % (len(all_nodes), len(_src_files()), len(dups)))
    return 1 if dups else 0


def cmd_content_chain(args):
    ap = argparse.ArgumentParser(prog='elda content chain')
    ap.add_argument('--npc', default=None)
    a = ap.parse_args(args)
    _, text = _all_src_text()
    calls = re.findall(r"changeRelation\(\s*'([^']+)'\s*,\s*(-?\d+)\s*,", text)
    by = {}
    for npc, d in calls:
        by.setdefault(npc, []).append(int(d))
    rows = []
    for npc, ds in sorted(by.items()):
        if a.npc and npc != a.npc:
            continue
        s = sum(ds)
        mark = '挚友达标' if len(ds) >= 4 and s >= 60 else ('--' if len(ds) < 2 else '不足')
        rows.append((npc, len(ds), s, mark))
    if not rows:
        print('未找到 changeRelation 调用（npc=%s）' % (a.npc or '全部'))
        return 1
    print('好感链校验（changeRelation 统计）')
    print('  %-22s %8s %8s  %s' % ('npc', '次数', '终值', '状态'))
    for npc, c, s, mark in rows:
        print('  %-22s %8d %8d  %s' % (npc, c, s, mark))
    bad = [r for r in rows if r[3] == '不足']
    print('RESULT: %s' % ('存在好感不足支线' if bad else '全部达标（或次新线）'))
    return 1 if bad else 0


# ---------------- text: freq ----------------

def cmd_text_freq(args):
    ap = argparse.ArgumentParser(prog='elda text freq')
    ap.add_argument('--top', type=int, default=30)
    a = ap.parse_args(args)
    _, text = _all_src_text()
    vals = _extract_text_values(text)
    joined = ' '.join(vals)
    print('文本治理 · 高频词/AI 腔检测（正文 %d 段，%d 字）' % (len(vals), len(joined)))
    counts = []
    for w in AI_WORDS:
        c = joined.count(w)
        if c:
            counts.append((w, c))
    counts.sort(key=lambda x: -x[1])
    if counts:
        print('  命中（AI 高频词表）：')
        for w, c in counts[:a.top]:
            print('    %-10s %d' % (w, c))
        print('  处理建议：出现 >30 次的词应抽样改写（参照 v66 文风规范）；目标为单个词 ≤0.5 次/千字。')
    else:
        print('  无命中')
    return 0


# ---------------- text: dup ----------------

def cmd_text_dup(args):
    ap = argparse.ArgumentParser(prog='elda text dup')
    ap.add_argument('--threshold', type=float, default=0.85)
    a = ap.parse_args(args)
    _, text = _all_src_text()
    vals = _extract_text_values(text)
    # 只比较 ≥50 字段落；按长度桶（±10%）内两两 Jaccard
    long = [(v, set(re.findall(r'[\u4e00-\u9fa5]{2,4}', v))) for v in vals if len(v) >= 50]
    buckets = {}
    for v, s in long:
        buckets.setdefault(len(v) // 10, []).append((v, s))
    pairs = []
    for b in buckets.values():
        for i in range(len(b)):
            for j in range(i + 1, len(b)):
                v1, s1 = b[i]
                v2, s2 = b[j]
                if abs(len(v1) - len(v2)) / max(len(v1), len(v2)) > 0.15:
                    continue
                inter = len(s1 & s2)
                uni = len(s1 | s2)
                if uni and inter / uni >= a.threshold:
                    pairs.append((v1, v2, inter / uni))
    pairs.sort(key=lambda x: -x[2])
    print('文本治理 · 相似段落检测（正文 %d 段，阈值 %.2f）' % (len(vals), a.threshold))
    if pairs:
        for v1, v2, sim in pairs[:15]:
            print('  相似度 %.2f' % sim)
            print('    A: %s' % v1[:80])
            print('    B: %s' % v2[:80])
    else:
        print('  无相似段落（良好）')
    return 0


# ---------------- text: norm ----------------

def cmd_text_norm():
    _, text = _all_src_text()
    vals = _extract_text_values(text)
    joined = ' '.join(vals)
    probs = []
    # 中文语境半角标点
    for m in re.finditer(r'[\u4e00-\u9fa5][,.;:!?][\u4e00-\u9fa5]', joined):
        probs.append('半角标点: %s' % m.group(0))
    # 全角空格
    for m in re.finditer(r'\u3000', joined):
        probs.append('全角空格')
        break
    # 连续标点（豁免"？！"组合：中文合理反问语气，不误报）
    masked = joined.replace('？！', 'XX')
    for m in re.finditer(r'[，。、！？；：]{2,}', masked):
        probs.append('连续标点: %s' % m.group(0))
    # 英文引号内中文（双引号与单引号两种形式）
    for m in re.finditer(r'"[^"\n]{2,}"|\'[^\'\n]{2,}\'', joined):
        if re.search(r'[\u4e00-\u9fa5]', m.group(0)):
            probs.append('英文引号包中文: %s' % m.group(0)[:30])
    # 中文引号配对：按"数组整体/字符串值"单元检查（对话跨元素闭合为合理用法）
    for v in _extract_text_units(text):
        if (v.count('“') + v.count('”')) % 2 == 1:
            probs.append('中文引号单元内不配对: %s' % v[:50])
    print('文本治理 · 标点/全半角规范（正文 %d 字）' % len(joined))
    if probs:
        from collections import Counter
        c = Counter(p.split(':')[0] for p in probs)
        for k, v in c.most_common():
            print('  %-12s %d' % (k, v))
        for p in probs[:20]:
            print('    !', p)
    else:
        print('  无规范问题（良好）')
    return 0


# ---------------- text: len ----------------

def cmd_text_len(args):
    ap = argparse.ArgumentParser(prog='elda text len')
    ap.add_argument('--min', type=int, default=1000)
    a = ap.parse_args(args)
    _, text = _all_src_text()
    vals = _extract_text_values(text)
    buckets = {'<100': 0, '100-300': 0, '300-600': 0, '600-1000': 0, '>1000': 0}
    total = 0
    for v in vals:
        n = len(v)
        total += n
        if n < 100: buckets['<100'] += 1
        elif n < 300: buckets['100-300'] += 1
        elif n < 600: buckets['300-600'] += 1
        elif n < 1000: buckets['600-1000'] += 1
        else: buckets['>1000'] += 1
    print('文本治理 · 节点字数分布（正文 %d 段，共 %d 字）' % (len(vals), total))
    for k in ['<100', '100-300', '300-600', '600-1000', '>1000']:
        print('  %-9s %d 段' % (k, buckets[k]))
    # 超长清单
    big = [(v, len(v)) for v in vals if len(v) >= a.min]
    big.sort(key=lambda x: -x[1])
    print('  超长段落（≥%d 字）：%d 段' % (a.min, len(big)))
    for v, n in big[:10]:
        print('    %4d 字  %s' % (n, v[:60]))
    print('  提示：>600 字建议拆段（配合分段阅读渲染）；平均 %.0f 字/段' % (total / max(1, len(vals))))
    # CM-4: 按卷统计 + pace 分布（节奏分档审计）
    print('── 按卷统计（CM-4 节奏分档）──')
    print('  %-20s %-6s %-6s %-6s %-6s %-6s %-8s' % ('卷', '节点', '已标', 'light', 'deep', 'epic', '均字/段'))
    all_tag = all_l = all_d = 0
    for f in _src_files():
        base = os.path.basename(f)
        t = _read(f)
        nid = len(re.findall(r'N\["[a-zA-Z0-9_]+"\]\s*=', t))
        if not nid:
            continue
        light = len(re.findall(r'pace:"light"', t))
        deep = len(re.findall(r'pace:"deep"', t))
        epic = len(re.findall(r'pace:"epic"', t))
        normal = len(re.findall(r'pace:"normal"', t))
        tag = light + deep + epic + normal
        vals_f = _extract_text_values(t)
        avg = (sum(len(v) for v in vals_f) / max(1, len(vals_f))) if vals_f else 0
        all_tag += tag; all_l += light; all_d += deep
        print('  %-20s %-6d %-6d %-6d %-6d %-6d %-8.0f' % (base, nid, tag, light, deep, epic, avg))
    print('  合计 已标 %d · light %d (%.1f%%) · deep %d' % (all_tag, all_l, 100.0*all_l/max(1,all_tag), all_d))
    return 0


# ---------------- text: guard（CT-3 文本治理持续门禁） ----------------

# CT-3 门禁词表（v91 实测阈值：每词 ≤30 处；与 AI_WORDS 同源，guard 只盯正文直接量文本）
GUARD_WORDS = AI_WORDS
GUARD_MAX_PER_WORD = 30  # 每词阈值（v91 最高 22，留 8 处余量；>30 触发 FAIL）
GUARD_QUOTE_PAIR_MSG = '中文引号配对（左=右）'
GUARD_PUNCT_MSG = '连续标点（豁免？！组合）'

def _guard_scan_text(text):
    """从正文直接量文本扫描：返回 (word_hits, quote_bad, punct_bad)"""
    vals = _extract_text_values(text)
    joined = ' '.join(vals)
    word_hits = {}
    for w in GUARD_WORDS:
        c = joined.count(w)
        if c > GUARD_MAX_PER_WORD:
            word_hits[w] = c
    # 中文引号配对：左=右（全库）
    lq = joined.count('“')
    rq = joined.count('”')
    quote_bad = lq != rq
    # 连续标点（豁免？！）
    masked = joined.replace('？！', 'XX')
    punct_bad = []
    for m in re.finditer(r'[，。、！？；：]{2,}', masked):
        punct_bad.append(m.group(0))
    return word_hits, quote_bad, (lq, rq), punct_bad

def cmd_text_guard(args):
    """elda text guard：文本治理持续门禁——AI 高频词防回潮（每词≤30）+ 中文引号配对 + 连续标点。
    输出逐词/逐条定位清单；接入 elda ci（第 21 检查器 c_textguard，扫 game.html 同口径）。"""
    print('== elda text guard：文本治理持续门禁 ==')
    _, text = _all_src_text()
    word_hits, quote_bad, (lq, rq), punct_bad = _guard_scan_text(text)
    problems = 0
    # 1) 高频词
    if word_hits:
        problems += len(word_hits)
        print('  [FAIL] AI 高频词超阈值（>%d 处）:' % GUARD_MAX_PER_WORD)
        for w, c in sorted(word_hits.items(), key=lambda x: -x[1]):
            print('    %-6s %d 处' % (w, c))
    else:
        print('  [PASS] AI 高频词：30 词全 ≤%d 处' % GUARD_MAX_PER_WORD)
    # 2) 引号配对
    if quote_bad:
        problems += 1
        print('  [FAIL] 中文引号不配对：左=%d 右=%d' % (lq, rq))
    else:
        print('  [PASS] 中文引号配对：左=%d 右=%d' % (lq, rq))
    # 3) 连续标点
    if punct_bad:
        problems += len(punct_bad)
        print('  [FAIL] 连续标点 %d 处:' % len(punct_bad))
        for p in punct_bad[:10]:
            print('    ! %s' % p)
    else:
        print('  [PASS] 连续标点：0 处')
    if problems:
        print('  结果：%d 个问题（修正后重跑；禁止为凑数改写已合规文本）' % problems)
        return 1
    print('  结果：全部通过（防回潮基线保持）')
    return 0


# ---------------- text: names ----------------

def cmd_text_names():
    _, text = _all_src_text()
    joined = ' '.join(_extract_text_values(text))
    print('文本治理 · 专名一致性（强者/城市/势力，零出现清单）')
    zero = []
    for n in NAMES:
        c = joined.count(n)
        if c == 0:
            zero.append(n)
    for n in NAMES:
        if n not in zero:
            pass
    if zero:
        print('  零出现专名（%d 个，提示可能漏写/写错）：' % len(zero))
        print('    ' + ' / '.join(zero))
        print('  提示：核心角色/城市应出现在正文中；零出现可能为拼写变体（请用 grep 核实）。')
    else:
        print('  全部专名均有出现（良好）')
    return 0


# ---------------- text: all ----------------

def cmd_text_all():
    print('== elda text all：全部文本治理 ==')
    out = []
    def run(title, fn):
        print('\n--- %s ---' % title)
        r = fn()
        return r
    r1 = run('高频词/AI 腔', lambda: cmd_text_freq([]))
    r2 = run('相似段落', lambda: cmd_text_dup([]))
    r3 = run('标点规范', lambda: cmd_text_norm())
    r4 = run('字数分布', lambda: cmd_text_len([]))
    r5 = run('专名一致性', lambda: cmd_text_names())
    # 写报告
    _, text = _all_src_text()
    vals = _extract_text_values(text)
    lines = [
        '# P2 文本治理报告（elda text all）',
        '',
        '> 生成时间：%s | 来源：src 权威源（%d 个文件）' % (time.strftime('%Y-%m-%d %H:%M'), len(_src_files())),
        '',
        '## 规模',
        '',
        '- 正文段落：%d 段' % len(vals),
        '- 总字数：%d' % sum(len(v) for v in vals),
        '',
        '## 结果',
        '',
        '- 高频词：见上方命令输出（cmd_text_freq）',
        '- 相似段落：见 cmd_text_dup 输出',
        '- 标点规范：见 cmd_text_norm 输出',
        '- 字数分布：见 cmd_text_len 输出',
        '- 专名零出现：见 cmd_text_names 输出',
        '',
        '## 处理基线（v66 文风规范）',
        '',
        '- 单个 AI 高频词 ≤ 0.5 次/千字；>30 次需抽样改写',
        '- 无相似段落（阈值 0.85）',
        '- 中文语境禁用半角标点/全角空格/连续标点',
        '- 正文平均 150-400 字/段，>600 字拆段',
        '',
    ]
    rp = os.path.join(PROJ, 'docs', 'p2_text_report.md')
    _write(rp, '\n'.join(lines))
    print('\n[OK] 报告已写入 docs\\p2_text_report.md')
    return 0


# ---------------- dispatch ----------------

# CT-1：tag/卷/pace 汇总表 + 薄域识别
TAG_RULES = [
    ('main', ['pro_', 'main_', 'fc_', 'city_', 'arrive_']),
    ('branch', ['arc_', 'quest_', 'npc_', 'side_', 'h_', 'combat_']),
    ('event', ['event', 'rand_', 'daily_']),
    ('ending', ['ending', 'epilogue', 'aftermath']),
    ('easter', ['easter', 'hidden', 'secret']),
]

def _tag_of(nid, body):
    m = re.search(r'tag\s*:\s*"([^"]+)"', body)
    if m:
        return m.group(1)
    for tag, prefs in TAG_RULES:
        for pre in prefs:
            if nid.startswith(pre) or pre in nid:
                return tag
    return 'other'

def _vol_nodes():
    """返回 {vol: [ {id, tag, pace} ]}，口径与 budget node_count 一致（主文件+分片）"""
    vols = {}
    files = _src_files()
    CH = os.path.join(PROJ, 'chunks')
    if os.path.isdir(CH):
        files += sorted(glob.glob(os.path.join(CH, 'v62_*.js')))
    for p in files:
        base = os.path.basename(p)
        if base in ('dn_causality.js', 'dn_memory_tpl.js', 'dn_chapters.js'):
            continue
        vol = base[:-3]
        if os.path.dirname(p).endswith('chunks'):
            vol = 'chunk_' + (vol[4:] if vol.startswith('v62_') else vol)
        t = _read(p)
        pat = re.compile(r'(?:N|nodes)\["([^"]+)"\]\s*=\s*')
        items = []
        for m in pat.finditer(t):
            nid = m.group(1)
            line_start = t.rfind('\n', 0, m.start()) + 1
            if '//' in t[line_start:m.start()]:
                continue
            i = t.find('{', m.end())
            if i < 0:
                continue
            depth = 0
            j = i
            in_str = esc = False
            while j < len(t):
                c = t[j]
                if in_str:
                    if esc: esc = False
                    elif c == '\\': esc = True
                    elif c == '"': in_str = False
                else:
                    if c == '"': in_str = True
                    elif c == '{': depth += 1
                    elif c == '}':
                        depth -= 1
                        if depth == 0: break
                j += 1
            body = t[i:j + 1]
            pace = 'normal'
            pm = re.search(r'pace\s*:\s*"([^"]+)"', body)
            if pm:
                pace = pm.group(1)
            items.append({'id': nid, 'tag': _tag_of(nid, body), 'pace': pace})
        if items:
            vols[vol] = items
    return vols

# CT-2：新增节点脚手架（elda content new）
_TAG_BY_TYPE = {'main': 'main', 'ending': 'ending', 'event': 'event', 'branch': 'branch'}

def cmd_content_new(args):
    """elda content new --type main|ending|event|branch [--tpl <模板类>] --id <id> [--vol <卷>] [--arc <弧id>]
    SP-4 模板工厂：读取 src/data_nodes/dn_node_templates.js（NODE_TEMPLATES 12 类）生成脚手架；
    生成即过 node --check；--arc/--vol 时读蓝图校验并写入标注注释。"""
    import argparse as _ap
    ap = _ap.ArgumentParser(description='节点脚手架（模板工厂）')
    ap.add_argument('--type', required=True, help='main|ending|event|branch')
    ap.add_argument('--tpl', default=None, help='模板类键（见 NODE_TEMPLATES；缺省按 type 推断）')
    ap.add_argument('--id', required=True, help='节点 id（如 bd1_west_entry）')
    ap.add_argument('--vol', default='unassigned', help='目标卷（用于注释与账本）')
    ap.add_argument('--arc', default=None, help='所属弧 id（蓝图校验，如 arc_fsh_primal1）')
    a = ap.parse_args(args)
    if a.type not in _TAG_BY_TYPE:
        print('[FAIL] --type 必须为 main|ending|event|branch')
        return 1
    if not re.match(r'^[A-Za-z0-9_]+$', a.id):
        print('[FAIL] --id 仅允许字母数字下划线（中文 id 建议改用拼音/英文前缀）')
        return 1
    # 读模板工厂（单一权威源）
    tpls = _load_node_templates()
    if a.tpl is None:
        a.tpl = {'main': 'main_advance', 'ending': 'ending', 'event': 'event_world', 'branch': 'branch_quest'}[a.type]
    if a.tpl not in tpls:
        print('[FAIL] --tpl %s 不存在；可用模板：%s' % (a.tpl, ', '.join(sorted(tpls.keys()))))
        return 1
    tpl = tpls[a.tpl]
    tag = tpl.get('tag') or _TAG_BY_TYPE[a.type]
    # 蓝图校验（--arc/--vol）
    arc_note = ''
    if a.arc:
        bp = _load_blueprint()
        arcs = bp.get('arcs', []) if bp else []
        found = [x for x in arcs if x.get('id') == a.arc]
        if not found:
            print('[WARN] 蓝图无弧 %s（仅写入注释，不阻塞）' % a.arc)
        else:
            ar = found[0]
            vol = a.vol if a.vol != 'unassigned' else ar.get('vol', 'unassigned')
            a.vol = vol
            arc_note = '  所属弧：%s（%s · 幕%s · %s）\n' % (a.arc, ar.get('name', ''), ar.get('act', '?'), vol)
    body = _tpl_to_node(a.id, tag, a.vol, tpl)
    header = u"// SP-4 节点脚手架（elda content new --type %(type)s --tpl %(tpl)s --id %(id)s --vol %(vol)s，%(ts)s 生成）\n" % {
        'type': a.type, 'tpl': a.tpl, 'id': a.id, 'vol': a.vol, 'ts': time.strftime('%Y-%m-%d')}
    if arc_note:
        header += '// ' + arc_note
    header += u"// 铁律：本文件只含节点数据（N[\"id\"]=对象），不含引擎逻辑；判定公式/writeNext/choose/存档语义不可触碰。\n"
    header += u"// CM-3 账本登记提示：埋设/回收伏笔请同步 dn_causality.js；设定词须出现在所属卷域（elda content causality 校验）。\n"
    header += u"// 注意：dn_scaffold.js 不进构建——填写完成后另存为正式 dn_<主题>.js 文件。\n"
    out = header + 'N["%s"]=%s;\n' % (a.id, body)
    p = os.path.join(DATA_NODES, 'dn_scaffold.js')
    _write(p, out)
    rc = subprocess.call(['node', '--check', p], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if rc != 0:
        print('[FAIL] 脚手架生成后 node --check 未通过（%s）' % p)
        return 1
    print('[OK] 脚手架已生成: %s' % p)
    print('    节点 %s（tag=%s, tpl=%s, 卷=%s%s）——填写【】占位后：node --check → elda ci → 浏览器回归'
          % (a.id, tag, a.tpl, a.vol, ('，弧=' + a.arc) if a.arc else ''))
    return 0


def _load_node_templates():
    """从 src/data_nodes/dn_node_templates.js 读取 NODE_TEMPLATES（单一权威源）。"""
    p = os.path.join(DATA_NODES, 'dn_node_templates.js')
    if not os.path.exists(p):
        print('[WARN] 模板工厂缺失：%s（请先确认 SP-4 已落地）' % p)
        return {}
    try:
        txt = io.open(p, encoding='utf-8').read()
        # JS 对象（键可无引号）→ 用 node 求值提取，避免 json.loads 严格模式失败
        code = ("var window={};eval(require('fs').readFileSync(process.argv[1],'utf8'));"
                "if(!window.NODE_TEMPLATES){process.exit(2);}"
                "console.log(JSON.stringify(window.NODE_TEMPLATES));")
        out = subprocess.check_output(['node', '-e', code, p], shell=True, text=True, encoding='utf-8', errors='replace', timeout=60)
        import json
        obj = json.loads(out.strip().split('\n')[-1])
        return obj if isinstance(obj, dict) else {}
    except Exception as e:
        print('[WARN] 模板读取异常：%s' % e)
        return {}


def _tpl_to_node(nid, tag, vol, tpl):
    """把模板对象转成节点 JS 字面量（id 替换；正文保持占位）。"""
    import json as _j
    node = {}
    node['tag'] = tpl.get('tag', tag)
    if 'place' in tpl:
        node['place'] = tpl['place']
    node['pace'] = tpl.get('pace', 'normal')
    node['text'] = tpl.get('text', ['【正文】'])
    node['options'] = tpl.get('options', [])
    return _j.dumps(node, ensure_ascii=False, indent=2)


_SCAFFOLD_TMPL = u"""// CT-2 节点脚手架（elda content new --type %(type)s --id %(id)s --vol %(vol)s，%(ts)s 生成）
// 铁律：本文件只含节点数据（N["id"]=对象），不含引擎逻辑；判定公式/writeNext/choose/存档语义不可触碰。
// CM-3 账本登记提示：若本节点埋设/回收伏笔（plant/reap），请同步在 dn_causality.js 补记账本项；
//   elif 涉及设定词（金秤/晨天/鬃吼/腐光/秦·长风 等），确保词出现在本节点所属卷域内（elda content causality 校验）。
// 变体注释：下方模板已含 ifFlag / ifRelation 状态感知变体示例（CM-2 v91_resolveText 三形态），
//   不需要时整段删除；需要时把 text 替换为 {default:[...], ifFlag:{...}} 结构。
N["%(id)s"]={
  tag:"%(tag)s",           // 标签：main|branch|event|ending（引擎忽略未知字段，安全）
  place:"填写地点（如：西境 · 元素荒原）",
  where:"白昼|黑夜|任意",
  pace:"normal",           // 节奏档：light 50-150字 / normal 300-500 / deep 800-1500 / epic 2000-3000（CM-4）
  text:[
    "（正文第一段——按 V66 文风书写；禁用 T0-2 治理词：目光/低声/轻轻/微微/缓缓/深吸 每词全书≤30 处）",
    "（正文第二段——战斗节点须按 docs\\战斗节点模板.md 四段式：蓄势/交锋/受创（来源+部位+程度）/转折）"
    // 状态感知变体示例（CM-2）——需要时替换上方 text 数组为：
    // {default:["（默认正文）"],
    //  ifFlag:{"已完成_某主线":["（持有该 flag 时看到的正文）"]},
    //  ifRelation:{npc:"npc_id", op:">=", val:60, yes:["（好感≥60 时正文）"], no:["（好感不足时正文）"]}}
  ],
  options:[
    {t:"（选项A文案）",go:"填写_下一节点id"},
    {t:"（选项B文案）",go:"填写_下一节点id"}
  ]
};
"""


def cmd_content_stat(args):
    """elda content stat [--all]：按 tag×卷×pace 汇总 + 薄域识别（每卷节点/事件/支线密度最低三域）"""
    show_all = '--all' in args
    vols = _vol_nodes()
    total = sum(len(v) for v in vols.values())
    tags = ['main', 'branch', 'event', 'ending', 'easter', 'other']
    paces = ['light', 'normal', 'deep', 'epic']
    print('== elda content stat：内容分布汇总（%d 节点 / %d 卷，口径=主文件+分片，与 budget 一致）==' % (total, len(vols)))
    # 1) tag × 卷 矩阵（节点数）
    print('\n--- 节点数：tag × 卷 ---')
    header = '%-24s' % '卷/tag'
    for tg in tags:
        header += ' | %8s' % tg
    header += ' | %8s' % '合计'
    print(header)
    print('-' * len(header))
    for vol, items in sorted(vols.items()):
        row = '%-24s' % vol
        for tg in tags:
            row += ' | %8d' % sum(1 for it in items if it['tag'] == tg)
        row += ' | %8d' % len(items)
        print(row)
    total_row = '%-24s' % '合计'
    for tg in tags:
        total_row += ' | %8d' % sum(1 for v in vols.values() for it in v if it['tag'] == tg)
    total_row += ' | %8d' % total
    print(total_row)
    # 2) tag × pace 汇总
    print('\n--- 节点数：tag × pace ---')
    h = '%-10s' % 'tag/pace'
    for pc in paces:
        h += ' | %7s' % pc
    h += ' | %8s' % '合计'
    print(h)
    print('-' * len(h))
    for tg in tags:
        r = '%-10s' % tg
        for pc in paces:
            r += ' | %7d' % sum(1 for v in vols.values() for it in v if it['tag'] == tg and it['pace'] == pc)
        r += ' | %8d' % sum(1 for v in vols.values() for it in v if it['tag'] == tg)
        print(r)
    # 3) 事件池与支线规模（薄域识别数据）
    evt_count = 0
    evt_cls = {}
    for p in _src_files():
        t = _read(p)
        m = re.search(r'EVENT_POOL_EXT\s*=\s*\[(.*?)\]\s*;\s*window\.EVENT_POOL_EXT', t, re.S)
        if m:
            seg = m.group(1)
            evt_count = len(re.findall(r'\{', seg))
            for cm in re.finditer(r'cls\s*:\s*"([^"]+)"', seg):
                evt_cls[cm.group(1)] = evt_cls.get(cm.group(1), 0) + 1
    # 支线数：changeRelation 调用涉及 npc（按卷粗分）
    rel_counts = {}
    for p in _src_files():
        t = _read(p)
        rel_counts[os.path.basename(p)[:-3]] = len(re.findall(r'changeRelation\s*\(', t))
    # 4) 薄域识别
    print('\n--- 薄域识别（密度最低三域，为内容包选址） ---')
    thin = []
    for vol, items in vols.items():
        rels = sum(v for k, v in rel_counts.items() if k.startswith(vol) or k == vol)
        thin.append({'vol': vol, 'nodes': len(items), 'events': 0, 'rels': rels,
                     'main': sum(1 for it in items if it['tag'] == 'main'),
                     'branch': sum(1 for it in items if it['tag'] == 'branch'),
                     'ending': sum(1 for it in items if it['tag'] == 'ending')})
    thin_sorted = sorted(thin, key=lambda x: x['nodes'])
    for x in thin_sorted[:3]:
        print('  [薄] %-24s 节点%3d 主线%3d 支线%3d 结局%3d 好感调用%3d' %
              (x['vol'], x['nodes'], x['main'], x['branch'], x['ending'], x['rels']))
    if len(thin_sorted) > 3 and show_all:
        print('  （--all：完整密度排行）')
        for x in thin_sorted[3:]:
            print('  [%s] %-24s 节点%3d 主线%3d 支线%3d 结局%3d 好感调用%3d' %
                  ('低' if x['nodes'] < 80 else '中', x['vol'], x['nodes'], x['main'], x['branch'], x['ending'], x['rels']))
    print('\n事件池: %d 则（%s）｜ 支线好感调用分布: %s' %
          (evt_count, ' '.join('%s×%d' % (k, v) for k, v in sorted(evt_cls.items())),
           ' '.join('%s×%d' % (k, v) for k, v in sorted(rel_counts.items(), key=lambda x: -x[1])[:6])))
    return 0


def _load_blueprint():
    """用 node 加载 dn_story_blueprint.js 并返回 dict；失败返回 None。"""
    p = os.path.join(DATA_NODES, 'dn_story_blueprint.js')
    if not os.path.isfile(p):
        return None
    code = (
        "global.window={};require(%r);"
        "process.stdout.write(JSON.stringify(window.STORY_BLUEPRINT||{}));"
    ) % p.replace('\\', '\\\\')
    try:
        r = subprocess.run(['node', '-e', code], capture_output=True, text=True,
                           encoding='utf-8', errors='replace', timeout=60)
    except Exception as e:
        print('[ERR] node 不可用: %s' % e)
        return None
    if r.returncode != 0:
        print('[ERR] 蓝图加载失败: %s' % (r.stderr or r.stdout)[-300:])
        return None
    try:
        return json.loads(r.stdout)
    except Exception as e:
        print('[ERR] 蓝图 JSON 解析失败: %s' % e)
        return None


def _collect_node_ids():
    """全部节点 id（主文件+分片），与 _vol_nodes 同口径。"""
    ids = set()
    vols = _vol_nodes()
    for items in vols.values():
        for it in items:
            ids.add(it['id'])
    return ids


def cmd_content_skeleton(args):
    """elda content skeleton v1 —— 叙事蓝图结构检查器（SP-1）
    校验：蓝图语法 / 幕≥5 卷≥9 章≥30 弧≥60 / id 唯一 / 锚点与引用节点存在 / 弧 vol·act 引用有效。"""
    print('== elda content skeleton v1：叙事蓝图结构检查 ==')
    bp = _load_blueprint()
    if bp is None:
        print('[FAIL] 蓝图不可用（dn_story_blueprint.js 缺失或加载失败）')
        return 1
    node_ids = _collect_node_ids()
    errs = []
    warns = []

    def uniq(seq, kind):
        seen, dup = set(), []
        for x in seq:
            if x['id'] in seen:
                dup.append(x['id'])
            seen.add(x['id'])
        if dup:
            errs.append('%s id 重复: %s' % (kind, ', '.join(dup[:5])))

    acts = bp.get('acts', [])
    vols = bp.get('volumes', [])
    chs = bp.get('chapters', [])
    arcs = bp.get('arcs', [])
    uniq(acts, '幕'); uniq(vols, '卷'); uniq(chs, '章'); uniq(arcs, '弧')

    if len(acts) < 5: errs.append('幕 %d < 5' % len(acts))
    if len(vols) < 9: errs.append('卷 %d < 9' % len(vols))
    if len(chs) < 30: errs.append('章 %d < 30' % len(chs))
    if len(arcs) < 60: errs.append('弧 %d < 60' % len(arcs))

    vol_ids = {v['id'] for v in vols}
    act_ids = {a['id'] for a in acts}
    # 卷/幕引用有效
    for v in vols:
        if v.get('act') and v['act'] not in act_ids:
            errs.append('卷 %s 引用未定义幕 %s' % (v['id'], v['act']))
    # 章锚点存在
    for ch in chs:
        a = ch.get('anchor')
        if a and a not in node_ids:
            errs.append('章 %s 锚点节点不存在: %s' % (ch['id'], a))
        if ch.get('vol') and ch['vol'] not in vol_ids:
            errs.append('章 %s 引用未定义卷 %s' % (ch['id'], ch['vol']))
    # 弧校验：prefixes 非空 / vol·act 有效 / stages 锚点存在
    arc_types = {}
    for ar in arcs:
        arc_types[ar.get('type', 'other')] = arc_types.get(ar.get('type', 'other'), 0) + 1
        if not ar.get('prefixes'):
            errs.append('弧 %s 无 prefixes' % ar['id'])
        if ar.get('vol') and ar['vol'] not in vol_ids:
            errs.append('弧 %s 引用未定义卷 %s' % (ar['id'], ar['vol']))
        if ar.get('act') and ar['act'] not in act_ids:
            errs.append('弧 %s 引用未定义幕 %s' % (ar['id'], ar['act']))
        st = ar.get('stages', {})
        for stage in ('setup', 'rising', 'climax', 'resolution'):
            for nid in st.get(stage, []) or []:
                if nid not in node_ids:
                    errs.append('弧 %s %s 阶段锚点不存在: %s' % (ar['id'], stage, nid))
    # 前缀命中率（信息性）
    hit = miss = 0
    miss_list = []
    for ar in arcs:
        ok = False
        for pre in ar.get('prefixes', []):
            if any(i.startswith(pre) for i in node_ids):
                ok = True
                hit += 1
                break
        if not ok:
            miss += 1
            miss_list.append(ar['id'])
    if miss_list:
        warns.append('前缀零命中的弧(%d): %s' % (len(miss_list), ', '.join(miss_list[:8])))

    print('  蓝图规模: 幕%d 卷%d 章%d 弧%d（类型分布 %s）' %
          (len(acts), len(vols), len(chs), len(arcs),
           ' '.join('%s×%d' % (k, v) for k, v in sorted(arc_types.items()))))
    print('  节点集: %d；弧前缀命中 %d 条，零命中 %d 条' % (len(node_ids), hit, miss))
    for w in warns:
        print('  [WARN] %s' % w)
    if errs:
        print('[FAIL] skeleton v1 未通过（%d 项）:' % len(errs))
        for e in errs[:15]:
            print('   - %s' % e)
        return 1
    print('[OK] skeleton v1 全绿 —— 蓝图结构完整，可进入 SP-2 标注')
    return 0


def cmd_content_chapter(args):
    """elda content chapter --vol <卷id> [--ch <章id>] [--count N] [--prefix p] [--anchor x] [--exit y] [--arc a]
    SP-5 章节批量生产线：读叙事蓝图，生成"入边锚点 → N 个链式骨架节点 → 出口锚点"的整章骨架，
    写 src/data_nodes/dn_scaffold_chapter.js（不进构建）；生成即过 node --check。"""
    import argparse as _ap
    ap = _ap.ArgumentParser(description='章节批量生产线')
    ap.add_argument('--vol', required=True, help='目标卷 id（如 vol_west）')
    ap.add_argument('--ch', default=None, help='章 id（如 ch_free_jiaohui；缺省取该卷第一章）')
    ap.add_argument('--count', type=int, default=8, help='生成节点数（默认 8）')
    ap.add_argument('--prefix', default=None, help='节点前缀（默认 bd_<vol>）')
    ap.add_argument('--anchor', default=None, help='入边锚点节点 id（缺省取章 anchor 或卷首章 anchor）')
    ap.add_argument('--exit', default=None, help='出口锚点节点 id（缺省取下一卷首章 anchor 或本卷末章 anchor）')
    ap.add_argument('--arc', default=None, help='所属弧 id（蓝图校验，注释标注）')
    a = ap.parse_args(args)
    if a.count < 2 or a.count > 60:
        print('[FAIL] --count 须在 2-60 之间')
        return 1
    bp = _load_blueprint()
    vols = bp.get('volumes', []) if bp else []
    chs = bp.get('chapters', []) if bp else []
    vol = None
    for v in vols:
        if v.get('id') == a.vol:
            vol = v
            break
    if not vol:
        print('[FAIL] 蓝图无卷 %s；可用卷：%s' % (a.vol, ', '.join(v.get('id', '') for v in vols)))
        return 1
    chs_of_vol = [c for c in chs if c.get('vol') == a.vol]
    ch = None
    if a.ch:
        for c in chs_of_vol:
            if c.get('id') == a.ch:
                ch = c
                break
        if not ch:
            print('[FAIL] 卷 %s 内无章 %s；可用章：%s' % (a.vol, a.ch, ', '.join(c.get('id', '') for c in chs_of_vol)))
            return 1
    else:
        ch = chs_of_vol[0] if chs_of_vol else {'id': 'ch_%s' % a.vol, 'name': vol.get('name', a.vol), 'anchor': None}
    # 出口：下一卷首章 anchor；无则本卷末章 anchor；再无则弧 resolution 首锚点
    exit_anchor = a.exit
    if not exit_anchor:
        vidx = None
        for i, v in enumerate(vols):
            if v.get('id') == a.vol:
                vidx = i
                break
        nxt_vol = vols[vidx + 1] if vidx is not None and vidx + 1 < len(vols) else None
        if nxt_vol:
            nxt_chs = [c for c in chs if c.get('vol') == nxt_vol.get('id')]
            if nxt_chs and nxt_chs[0].get('anchor'):
                exit_anchor = nxt_chs[0]['anchor']
        if not exit_anchor and chs_of_vol and chs_of_vol[-1].get('anchor'):
            exit_anchor = chs_of_vol[-1]['anchor']
        if not exit_anchor and a.arc:
            ar = None
            for x in (bp.get('arcs', []) or []):
                if x.get('id') == a.arc:
                    ar = x
                    break
            if ar and ar.get('stages', {}).get('resolution'):
                exit_anchor = ar['stages']['resolution'][0]
    if not exit_anchor:
        exit_anchor = 'prologue_start'
    anchor = a.anchor or ch.get('anchor') or exit_anchor
    prefix = a.prefix or ('bd_' + a.vol)
    if not re.match(r'^[A-Za-z0-9_]+$', prefix):
        print('[FAIL] --prefix 仅允许字母数字下划线')
        return 1
    # 生成链式骨架
    ids = ['%s_%d' % (prefix, i) for i in range(a.count)]
    lines = []
    for i, nid in enumerate(ids):
        nxt = exit_anchor if i == a.count - 1 else ids[i + 1]
        if i == 0:
            tag, pace = 'main', 'deep'
        elif i == a.count - 1:
            tag, pace = 'main', 'deep'
        elif i % 3 == 2:
            tag, pace = 'branch', 'normal'
        elif i % 3 == 1:
            tag, pace = 'branch', 'combat'.replace('combat', 'normal')
        else:
            tag, pace = 'branch', 'normal'
        if i == 1 and a.count >= 3:
            tag, pace = 'branch', 'normal'
        lines.append('N["%s"]={' % nid)
        lines.append('  tag:"%s",' % tag)
        lines.append('  place:"%s",' % vol.get('name', a.vol))
        lines.append('  pace:"%s",' % pace)
        lines.append('  text:[')
        lines.append('    "【%s：正文第一段，%d-%d 字，按 V66 文风白描】",' % ('章内第 %d 步' % (i + 1), 60, 140))
        lines.append('    "【正文第二段，%d-%d 字】"' % (80, 200))
        lines.append('  ],')
        lines.append('  options:[')
        lines.append('    {t:"【选项A】",go:"%s"}' % nxt)
        if i == 0 and anchor and anchor not in ids:
            lines.append('    ,{t:"【选项B：折返 %s】",go:"%s"}' % (anchor, anchor))
        lines.append('  ]')
        lines.append('};')
    body = '\n'.join(lines)
    header = []
    header.append('// SP-5 章节批量生产线（elda content chapter --vol %s%s%s，%s 生成）' % (
        a.vol, (' --ch ' + a.ch) if a.ch else '', (' --arc ' + a.arc) if a.arc else '', time.strftime('%Y-%m-%d')))
    header.append('// 卷：%s ｜ 章：%s（%s）' % (vol.get('name', a.vol), ch.get('id', '?'), ch.get('name', '?')))
    header.append('// 入边锚点：%s ｜ 出口锚点：%s' % (anchor, exit_anchor))
    if a.arc:
        header.append('// 所属弧：%s（建议提交时登记账本/标注 nodeIndex 归属）' % a.arc)
    header.append('// 铁律：dn_scaffold_chapter.js 不进构建——填写【】占位后按节点拆分另存为正式 dn_<主题>.js 文件。')
    header.append('// 填写后验证链：node --check → elda ci（死链 0 → 入边闭环）→ 浏览器回归。')
    out = '\n'.join(header) + '\n' + body + '\n'
    p = os.path.join(DATA_NODES, 'dn_scaffold_chapter.js')
    _write(p, out)
    rc = subprocess.call(['node', '--check', p], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if rc != 0:
        print('[FAIL] 章节骨架生成后 node --check 未通过（%s）' % p)
        return 1
    print('[OK] 章节骨架已生成: %s' % p)
    print('    卷=%s 章=%s 节点=%d 链：%s → … → %s' % (a.vol, ch.get('id', '?'), a.count, anchor, exit_anchor))
    print('    下一步：拆分节点 → 填正文 → 入边锚点接入（anchor 节点 options 补 go）→ elda ci')
    return 0


def cmd_content_blueprint(args):
    """elda content blueprint [--json] —— 导出叙事蓝图汇总（幕/卷/章/弧 + 卷密度）"""
    as_json = '--json' in args
    bp = _load_blueprint()
    if bp is None:
        return 1
    if as_json:
        print(json.dumps(bp, ensure_ascii=False, indent=1))
        return 0
    vols = bp.get('volumes', [])
    chs = bp.get('chapters', [])
    arcs = bp.get('arcs', [])
    print('== elda content blueprint：叙事蓝图导出（v%d）==' % bp.get('meta', {}).get('version', 1))
    for act in bp.get('acts', []):
        sub = [v['name'] for v in vols if v.get('act') == act['id']]
        print('\n[%s] %s' % (act['id'], act['name']))
        print('  卷: %s' % (' / '.join(sub) if sub else '(无)'))
    print('\n--- 章（%d）---' % len(chs))
    cur = None
    for ch in chs:
        if ch['vol'] != cur:
            cur = ch['vol']
            vn = next((v['name'] for v in vols if v['id'] == cur), cur)
            print('  %s' % vn)
        print('    %-24s %s' % (ch['name'], ch['anchor']))
    print('\n--- 弧（%d，按类型）---' % len(arcs))
    by_type = {}
    for ar in arcs:
        by_type.setdefault(ar.get('type', 'other'), []).append(ar)
    for t, lst in sorted(by_type.items()):
        print('  [%s × %d]' % (t, len(lst)))
        for ar in lst:
            st = ar.get('stages', {})
            filled = sum(1 for k in ('setup', 'rising', 'climax', 'resolution') if st.get(k))
            print('    %-24s %-16s act=%s vol=%s stages=%d/4' %
                  (ar['id'], ar.get('name', ''), ar.get('act', '-'), ar.get('vol', '-'), filled))
    return 0


def cmd_content(args):
    if not args:
        print('elda content 子命令: event | quest | dup | chain | causality | stat | new | skeleton | blueprint')
        return 1
    sub = args[0]
    if sub == 'event': return cmd_content_event(args[1:])
    if sub == 'quest': return cmd_content_quest(args[1:])
    if sub == 'dup': return cmd_content_dup()
    if sub == 'chain': return cmd_content_chain(args[1:])
    if sub == 'causality': return cmd_content_causality(args[1:])
    if sub == 'stat': return cmd_content_stat(args[1:])
    if sub == 'new': return cmd_content_new(args[1:])
    if sub == 'skeleton': return cmd_content_skeleton(args[1:])
    if sub == 'blueprint': return cmd_content_blueprint(args[1:])
    if sub == 'chapter': return cmd_content_chapter(args[1:])
    print('未知 content 子命令: %s' % sub)
    return 1


def cmd_text(args):
    if not args:
        print('elda text 子命令: freq | dup | norm | len | names | all')
        return 1
    sub = args[0]
    if sub == 'freq': return cmd_text_freq(args[1:])
    if sub == 'dup': return cmd_text_dup(args[1:])
    if sub == 'norm': return cmd_text_norm()
    if sub == 'len': return cmd_text_len(args[1:])
    if sub == 'names': return cmd_text_names()
    if sub == 'guard': return cmd_text_guard(args[1:])
    if sub == 'all': return cmd_text_all()
    print('未知 text 子命令: %s' % sub)
    return 1
