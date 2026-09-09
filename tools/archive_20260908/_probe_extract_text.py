# -*- coding: utf-8 -*-
"""临时：提取 Top17 节点完整 text 段落原文（供设计替换对照）"""
import io, re

TARGETS = ['prologue_market', 'prologue_tavern', 'prologue_mentor',
           'seal_3_intro', 'seal_3_queen', 'seal_3_contract', 'seal7_exp_coexist_method',
           'city_jiaohui_medici', 'city_jiaohui_medici_secret', 'city_jiaohui_slum',
           'relic_hourglass', 'eclipse_intro', 'relic_grail_boss', 'pol_guardian',
           'dun_ruins_treasure', 'dun_tower_treasure', 'dun_arena_1']

with io.open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

for nid in TARGETS:
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        print('### %s — 未找到' % nid)
        continue
    start = m.start()
    ln = html.count('\n', 0, start) + 1
    # 找 text 数组
    body = html[start:start + 6000]
    print('### %s (行%d)' % (nid, ln))
    # 提取 text 后第一个 [ 到配平 ]
    tm = re.search(r'text\s*:\s*function\s*\(\s*\)\s*\{\s*return\s*\[', body)
    if not tm:
        tm = re.search(r'text\s*:\s*\[', body)
    if tm:
        # 找到 [ 配平 ]
        bstart = body.find('[', tm.end() - 1)
        depth = 0
        i = bstart
        in_str = None
        n = len(body)
        while i < n:
            c = body[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
                i += 1
                continue
            if c in ('"', "'"):
                in_str = c
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        print(body[tm.start():i + 1][:4500])
    else:
        print('  (未找到 text 数组)')
    print()
