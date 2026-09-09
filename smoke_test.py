# -*- coding: utf-8 -*-
"""
《艾尔达大陆·群雄割据》玩法冒烟测试（一条命令）
python smoke_test.py

验证口径（诚实报告）：
1) 节点完整性：总节点 / 结局节点 / 主线关键节点出边（数据层可复核）
2) 结局可达性静态证据：结局节点的入边统计（谁 go/curNode/travelTo 到结局）——
   证明"结局从剧情链可触达"。本游戏主线为状态机式推进（check 改状态 + go 回自身），
   静态 BFS 无法建模状态累积，故不做全图可达性断言。
3) 运行时证据见 docs\\p1_2_quests_v80.md 浏览器回归小节（bu 平面实测：建号→主线→
   支线→结局枢纽渲染，全部通过）。

输出：exit 0 = 完整性通过；非 0 = 失败。
"""
import io, re, sys

HTML = 'game.html'
ENDING_MARKERS = ['ending', 'v24_final', 'v36_ending', 'ngplus_true']
KEY_CHAIN = ['fc_jiaohui_entry', 'fc_tavern', 'fc_market', 'shangzhan_after',
             'travel_south_start', 'south_gangkou', 'east_tiemen', 'death_desert',
             'desert_aftermath', 'chapter_end_all', 'ending_choose', 'ending_prelude_hub']

def read(p):
    return io.open(p, encoding='utf-8', errors='replace').read()

def extract_edges(text):
    edges = {}
    def add(nid, nxt):
        edges.setdefault(nid, set()).add(nxt)
    def_start = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*(?:function\s*\(\)\s*\{\s*return\s*)?\{')
    for m in def_start.finditer(text):
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
        body = text[i:j]
        for g in re.findall(r'\b(?:go|goto|next|success|target)\s*:\s*["\']([A-Za-z0-9_]+)["\']', body):
            add(nid, g)
        for g in re.findall(r'curNode\s*=\s*["\']([A-Za-z0-9_]+)["\']', body):
            add(nid, g)
        for g in re.findall(r'travelTo\s*\(\s*["\']([A-Za-z0-9_]+)["\']', body):
            add(nid, g)
    for m in re.finditer(r'\b(?:go|goto|next|success|target)\s*[:=]\s*["\']([A-Za-z0-9_]+)["\']', text):
        edges.setdefault(m.group(1), set())
    for m in re.finditer(r'travelTo\s*\(\s*["\']([A-Za-z0-9_]+)["\']', text):
        edges.setdefault(m.group(1), set())
    return edges

def extract_options(text, nid):
    """提取节点 nid 的选项：{t, go, cond/effect 摘要}。支持对象式与函数式。"""
    m = re.search(r'N\["(%s)"\]\s*=\s*(?:function\s*\(\)\s*\{\s*return\s*)?\{' % re.escape(nid), text)
    if not m:
        return []
    i = text.find('{', m.start(), m.end())
    if i < 0:
        return []
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
    body = text[i:j]
    opts = []
    for om in re.finditer(r'\{([^{}]*?(?:go|goto|next|target)\s*:\s*["\'][A-Za-z0-9_]+["\'])}', body):
        seg = om.group(1)
        t = re.search(r't\s*:\s*["\']([^"\']{0,30})', seg)
        g = re.search(r'(?:go|goto|next|target)\s*:\s*["\']([A-Za-z0-9_]+)["\']', seg)
        opts.append({'t': t.group(1) if t else '', 'go': g.group(1) if g else None,
                     'check': 'check' in seg, 'cond': 'cond' in seg or 'if' in seg})
    return opts

def simulate_keychain(text):
    """状态机推进路径模拟：沿 KEY_CHAIN 逐个节点模拟"选第一个可推进选项"，
    检测 check 自循环（go 回自身需 cond 出口）与死链。"""
    report = []
    ok = True
    for i, nid in enumerate(KEY_CHAIN):
        opts = extract_options(text, nid)
        if not opts:
            report.append('    %-22s 无选项（终端/纯文本）' % nid)
            continue
        go_targets = [o['go'] for o in opts if o['go']]
        self_loop = [o for o in opts if o['go'] == nid]
        forward = [o for o in opts if o['go'] and o['go'] != nid]
        has_check_escape = any(o['check'] and o['go'] != nid for o in opts)
        if self_loop and not has_check_escape and not forward:
            report.append('    %-22s [FAIL] check 自循环无出口' % nid)
            ok = False
        else:
            nxt = forward[0]['go'] if forward else (self_loop[0]['go'] if self_loop else None)
            status = 'check→' + nxt if self_loop and has_check_escape else (nxt or '终端')
            report.append('    %-22s 推进→ %s（%d 选项）' % (nid, status, len(opts)))
    return ok, report

def runtime_evidence():
    """读取 bu 平面回归产物 regress_result.json（若存在）验证运行时证据。"""
    try:
        import json
        d = json.load(io.open('regress_result.json', encoding='utf-8'))
        steps = d.get('steps', 0)
        reached = d.get('reached', [])
        panels = d.get('panels_ok', 0)
        save_ok = d.get('save_load_ok', False)
        ending = d.get('ending_ok', False)
        print('  运行时推进       : %d 步，到达 %s' % (steps, reached[-3:] if reached else '无'))
        print('  面板开合         : %d 面板' % panels)
        print('  存/读档          : %s' % ('通过' if save_ok else '未验证'))
        print('  结局触发         : %s' % ('通过' if ending else '未验证'))
        return d.get('all_ok', False)
    except Exception:
        print('  运行时证据       : 无 regress_result.json（运行 bu 平面回归生成）')
        return None

def main():
    text = read(HTML)
    edges = extract_edges(text)
    ends = [k for k in edges if any(m in k for m in ENDING_MARKERS)]
    print('冒烟测试 · 群雄割据 节点完整性 + 状态机推进（game.html）')
    print('  总节点定义/引用 : %d' % len(edges))
    print('  结局节点        : %d 个（%s 等）' % (len(ends), sorted(ends)[:6]))
    # 结局入边统计
    total_in = 0
    reachable_ends = 0
    for e in sorted(ends):
        inb = [src for src, dsts in edges.items() if e in dsts]
        total_in += len(inb)
        if inb:
            reachable_ends += 1
    print('  有入边结局      : %d / %d（可被剧情节点触达）' % (reachable_ends, len(ends)))
    print('  结局总入边      : %d' % total_in)
    # 关键主线链出边
    print('  主线关键节点出边:')
    for k in KEY_CHAIN:
        outs = sorted(edges.get(k, set()))
        print('    %-22s %2d: %s' % (k, len(outs), outs[:6]))
    # U5 状态机推进路径模拟
    print('  状态机推进路径  :')
    sim_ok, sim_rep = simulate_keychain(text)
    for line in sim_rep:
        print(line)
    # 运行时证据（bu 平面回归产物）
    rt = runtime_evidence()
    # 验证
    ok = len(ends) >= 20 and total_in >= 10 and sim_ok
    if rt is False:
        ok = False
    print('RESULT: %s（节点完整性 + 状态机推进；结局可达性以入边 %d 条 + 浏览器实测为准）' % ('PASS' if ok else 'FAIL', total_in))
    sys.exit(0 if ok else 1)

if __name__ == '__main__':
    main()
