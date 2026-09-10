# -*- coding: utf-8 -*-
"""elda test —— UPG-11 Quicktest/Randomtest 自动化质检（路径覆盖）

子命令：
  elda test static   —— 静态分析器：go 目标存在 / flag 引用声明检查 / 不可达节点 / 选项条件变量声明
  elda test random   —— 动态随机游走 N 局，输出节点/选项命中报告，标记 0 命中死代码
  elda test all      —— static + random 一次跑

纯工具链：不改运行时、不改节点、不改存档。基于 game.html（最终节点全集）。
"""
import io, os, random, re, sys

PROJ = os.path.dirname(os.path.abspath(__file__)) + os.sep + '..' + os.sep + '..'
SRC = os.path.join(PROJ, 'src')
CHUNKS = os.path.join(PROJ, 'chunks')


def read_sources():
    """节点全集 = game.html（唯一内容权威源，内联全部）+ chunks/*.js（运行时按需分片）。
    渐进式分片架构下，单文件版运行时可经 NODE_MAP 加载分片补节点，故并集才是玩家可用全集。"""
    parts = []
    try:
        parts.append(io.open(os.path.join(PROJ, 'game.html'), encoding='utf-8', errors='replace').read())
    except Exception:
        pass
    if os.path.isdir(CHUNKS):
        for f in sorted(os.listdir(CHUNKS)):
            if f.endswith('.js'):
                try:
                    parts.append(io.open(os.path.join(CHUNKS, f), encoding='utf-8', errors='replace').read())
                except Exception:
                    pass
    return '\n'.join(parts)

ENTRY_HINTS = [
    'fc_jiaohui_entry', 'prologue_start', 'origin_free_city_1', 'origin_northern_1',
    'origin_southern_1', 'origin_church_1', 'origin_elf_1', 'origin_dwarf_1',
    'origin_orc_1', 'origin_eastern_1', 'origin_desert_1', 'ending_choose',
    'chapter_end_all', 'ending_prelude_hub',
]

NODE_DEF = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=')
GO_RX = re.compile(r'\bgo\s*:\s*["\']([A-Za-z0-9_]+)["\']')
FLAG_RX = re.compile(r'S\.flags\.([A-Za-z0-9_]+)')
FLAG_BRACKET_RX = re.compile(r'S\.flags\[["\']([A-Za-z0-9_]+)["\']\]')
FLAG_SET_RX = re.compile(r'flags\.([A-Za-z0-9_]+)\s*=\s*true')
FLAG_SET_BRACKET_RX = re.compile(r'flags\[["\']([A-Za-z0-9_]+)["\']\]\s*=\s*true')
SETFLAG_RX = re.compile(r'setflag\s*:\s*["\']([A-Za-z0-9_]+)["\']')
EFFECT_FLAG_RX = re.compile(r'effects?[^}]*?flag\s*:\s*["\']([A-Za-z0-9_]+)["\']')
EFFECT_FLAG_ARRAY_RX = re.compile(r'effects?[^}]*?flag\s*:\s*\[([^\]]*)\]')


def read_game():
    return read_sources()


def _obj_body(text, brace_i):
    """从 { 位置做深度匹配，返回对象体"""
    depth, j = 0, brace_i
    while j < len(text):
        c = text[j]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                break
        j += 1
    return text[brace_i:j]


def extract_nodes(text):
    """提取 {id: body}——对象式（N["id"]={...}）与函数式（N["id"]=function(){...return {...}}）兼容"""
    nodes = {}
    for m in NODE_DEF.finditer(text):
        nid = m.group(1)
        eq = text.find('=', m.start(), m.end())
        rest = text[eq + 1:]
        k = 0
        while k < len(rest) and rest[k] in ' \t\r\n':
            k += 1
        if rest.startswith('{', k):
            body = _obj_body(rest, k)
            nodes[nid] = body
        elif rest.startswith('function', k):
            # 找 return { 的 {（函数体内）
            ri = rest.find('return', k)
            if ri >= 0:
                bi = rest.find('{', ri)
                if bi >= 0:
                    body = _obj_body(rest, bi)
                    nodes[nid] = body
    return nodes


def collect_go(nodes):
    edges = {}
    for nid, body in nodes.items():
        gos = set(GO_RX.findall(body))
        if gos:
            edges[nid] = gos
    return edges


def collect_flag_refs(nodes):
    refs = {}
    for nid, body in nodes.items():
        f = set(FLAG_RX.findall(body)) | set(FLAG_BRACKET_RX.findall(body))
        if f:
            refs[nid] = f
    return refs


def collect_flag_decls(text):
    decl = set(FLAG_SET_RX.findall(text)) | set(FLAG_SET_BRACKET_RX.findall(text))
    decl |= set(SETFLAG_RX.findall(text))
    for m in EFFECT_FLAG_RX.finditer(text):
        decl.add(m.group(1))
    for m in EFFECT_FLAG_ARRAY_RX.finditer(text):
        for g in re.findall(r'["\']([A-Za-z0-9_]+)["\']', m.group(1)):
            decl.add(g)
    # S.flags 默认初始化（emptyState/applyDefaults 中 S.flags:{...} 或 .flags.x=）
    return decl


# 运行时动态生成的节点前缀（模板/建号/面板，静态全集不含但运行时会构造；go 指向它们不算死链）
DYNAMIC_PREFIXES = ('origin_', 'echo_', 'v65_war', 'v655_', 'v34_', 'ending_', 'mem_', 'dyn_', 'panel_', 'v69_')


def cmd_static():
    text = read_game()
    nodes = extract_nodes(text)
    edges = collect_go(nodes)
    flag_refs = collect_flag_refs(nodes)
    flag_decl = collect_flag_decls(text)

    problems = []
    stats = {}

    # ① go 目标存在（真死链：目标在全集不存在，且非动态生成前缀）
    missing_go = []
    missing_dyn = []
    for nid, gos in edges.items():
        for g in gos:
            if g not in nodes:
                if g.startswith(DYNAMIC_PREFIXES):
                    missing_dyn.append('%s -> %s' % (nid, g))
                else:
                    missing_go.append('%s -> %s' % (nid, g))
    stats['go_edges'] = sum(len(v) for v in edges.values())
    stats['go_missing'] = len(missing_go)
    stats['go_dynamic'] = len(missing_dyn)
    if missing_go:
        problems.append('死链 go(%d): ' % len(missing_go) + '; '.join(missing_go[:12]))
    if missing_dyn:
        print('  [WARN] 动态生成目标 %d（模板/建号节点，运行时构造，不列死链）: ' % len(missing_dyn) + '; '.join(missing_dyn[:12]))

    # ② flag 引用声明检查（warn：动态 flag 合法）
    undecl = []
    for nid, fs in flag_refs.items():
        for f in fs:
            if f not in flag_decl:
                undecl.append('%s:%s' % (nid, f))
    stats['flag_refs'] = sum(len(v) for v in flag_refs.values())
    stats['flag_undecl'] = len(undecl)
    if undecl:
        print('  [WARN] 未声明 flag 引用 %d（动态 flag 合法，仅登记）: ' % len(undecl) + '; '.join(undecl[:12]))

    # ③ 不可达：完全无引用（真死代码）FAIL；其余（动态入口）warn
    reachable = set()
    for gos in edges.values():
        reachable |= gos
    for rx in [r"travelTo\(\s*['\"]([A-Za-z0-9_]+)['\"]", r"writeNext\(\s*['\"]([A-Za-z0-9_]+)['\"]",
               r"curNode\s*=\s*['\"]([A-Za-z0-9_]+)['\"]", r"maybeMissed\(\s*['\"]([A-Za-z0-9_]+)['\"]"]:
        for m in re.finditer(rx, text):
            reachable.add(m.group(1))
    unreachable = sorted(nid for nid in nodes if nid not in reachable and nid not in ENTRY_HINTS)
    truly_dead = [nid for nid in unreachable if text.count(nid) <= 1]
    stats['nodes'] = len(nodes)
    stats['unreachable'] = len(unreachable)
    stats['truly_dead'] = len(truly_dead)
    if truly_dead:
        problems.append('完全无引用节点 %d: ' % len(truly_dead) + '; '.join(truly_dead[:12]))
    if unreachable:
        print('  [WARN] 无静态入边节点 %d（动态入口/条件解锁，静态无法建模，仅登记）: ' % len(unreachable) + '; '.join(unreachable[:12]))

    # ④ S 键引用（warn 仅登记）
    known = {'day', 'date', 'loc', 'curCity', 'home', 'name', 'job', 'subrace', 'ideal', 'hobby',
             'talent', 'realm', 'xp', 'gold', 'hp', 'maxHp', 'san', 'maxSan', 'fatigue', 'wound',
             'karma', 'rep', 'attrs', 'skills', 'infl', 'items', 'mats', 'books', 'flags',
             'npcRelations', 'settings', 'visited', 'world', 'worldState', 'slotId', 'saveVersion',
             'playerId', 'gradPath', 'anchors', 'worldWar', 'readings', 'choices', 'curNode',
             'homeland', 'faction', 'season', 'weather', 'wealth', 'estate', 'followers', 'troops',
             'y', 'm', 'titles', 'reputation', 'fame', 'achievements', 'unlockedEndings',
             'sessionId', 'inCombat', 'fled', 'equip', 'quests', 'loans', 'contracts', 'soul',
             'element', 'cult', 'sect', 'family', 'lineage', 'luck', 'time', 'ended', 'ending'}
    s_refs = set(re.findall(r'\bS\.([a-zA-Z_][a-zA-Z0-9_]*)\b', text))
    weird = sorted(s_refs - known)
    stats['s_refs'] = len(s_refs)
    stats['s_unknown'] = len(weird)
    if weird:
        print('  [WARN] S 未知键 %d（登记）: ' % len(weird) + '; '.join(weird[:12]))

    ok = not missing_go and stats['truly_dead'] == 0
    print('[UPG-11 static] 节点=%d go边=%d 死链=%d 动态目标=%d 完全无引用=%d 无静态入边=%d' % (
        stats['nodes'], stats['go_edges'], stats['go_missing'], stats['go_dynamic'],
        stats['truly_dead'], stats['unreachable']))
    for p in problems:
        print('  [WARN] ' + p)
    print('[UPG-11 static] ' + ('PASS' if ok else 'FAIL（死链或完全无引用节点需修复）'))
    return 0 if ok else 1


def cmd_random(n=200, steps=400, seed=7):
    """随机游走命中报告（报告性质；FAIL 门禁由 static 承担）。
    多种子：入口 + 无静态入边节点（内容包种子），随机重启，避免 hub 回环偏置。"""
    text = read_game()
    nodes = extract_nodes(text)
    edges = collect_go(nodes)
    rnd = random.Random(seed)
    # 种子池：入口 + 无入边节点
    reachable = set()
    for gos in edges.values():
        reachable |= gos
    seeds = [nid for nid in ENTRY_HINTS if nid in nodes]
    seeds += [nid for nid in nodes if nid not in reachable]
    if not seeds:
        seeds = list(nodes)
    hit = {nid: 0 for nid in nodes}
    for _ in range(n):
        cur = seeds[rnd.randrange(len(seeds))]
        for _s in range(steps):
            hit[cur] = hit.get(cur, 0) + 1
            if cur not in edges or not edges[cur]:
                if rnd.random() < 0.6:
                    break
                cur = seeds[rnd.randrange(len(seeds))]
                continue
            gos = list(edges[cur])
            if rnd.random() < 0.1:
                cur = seeds[rnd.randrange(len(seeds))]
            else:
                cur = gos[rnd.randrange(len(gos))]
    zero = [nid for nid in sorted(nodes) if hit.get(nid, 0) == 0]
    top = sorted(nodes, key=lambda k: -hit[k])[:12]
    print('[UPG-11 random] 局数=%d 步数上限=%d 种子=%d 命中节点=%d/%d 0命中=%d' % (
        n, steps, len(seeds), len(hit) - len(zero), len(nodes), len(zero)))
    if zero:
        print('  0命中节点（死代码候选，供人工复核）: ' + '; '.join(zero[:40]))
    print('  命中 TOP12: ' + '; '.join('%s(%d)' % (k, hit[k]) for k in top))
    dead_ratio = len(zero) / max(1, len(nodes))
    print('[UPG-11 random] 0命中率=%.1f%%（报告性质；门禁见 static 完全无引用）' % (dead_ratio * 100))
    return 0


def cmd_test(args):
    sub = args[0] if args else 'all'
    rc = 0
    if sub in ('static', 'all'):
        rc |= cmd_static()
    if sub in ('random', 'all'):
        n, steps = 50, 300
        if len(args) > 1:
            try:
                n = int(args[1])
            except Exception:
                pass
        if len(args) > 2:
            try:
                steps = int(args[2])
            except Exception:
                pass
        rc |= cmd_random(n, steps)
    return rc
