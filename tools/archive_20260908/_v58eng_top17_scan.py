# -*- coding: utf-8 -*-
"""临时：对 Top17 节点逐节点精确扫描 AI 味词命中句（含 options），输出 节点|词|句 清单"""
import io, re

WORDS = ['仿佛', '似乎', '然而', '悄然', '缓缓', '微微', '目光一凝', '眼眸', '不知不觉',
         '莫名', '隐隐', '微微一愣', '心头一紧', '望向远方']

TARGETS = ['prologue_market', 'prologue_tavern', 'prologue_mentor',
           'seal_3_intro', 'seal_3_queen', 'seal_3_contract', 'seal7_exp_coexist_method',
           'city_jiaohui_medici', 'city_jiaohui_medici_secret', 'city_jiaohui_slum',
           'relic_hourglass', 'eclipse_intro', 'relic_grail_boss', 'pol_guardian',
           'dun_ruins_treasure', 'dun_tower_treasure', 'dun_arena_1']


def extract_block(html, nid):
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        return None, None
    start = m.start()
    ln = html.count('\n', 0, start) + 1
    depth = 0
    in_str = None
    i = start
    n = len(html)
    while i < n:
        c = html[i]
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
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    return html[start:i + 1], ln


with io.open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

out = []
for nid in TARGETS:
    block, ln = extract_block(html, nid)
    if block is None:
        out.append('### %s 未找到' % nid)
        continue
    # 逐句切分：把字符串字面量拆成行
    lines = block.split('\n')
    hits = []  # (词, 句子, 行号)
    for j, line in enumerate(lines, start=ln):
        for w in WORDS:
            if w in line:
                s = line.strip()
                if len(s) > 160:
                    s = s[:160] + '…'
                hits.append((w, s, j))
    if hits:
        out.append('### %s (块起行%d)' % (nid, ln))
        for w, s, j in hits:
            out.append('  [%s] 行%d: %s' % (w, j, s))
        out.append('')
    else:
        out.append('### %s — 块内无命中' % nid)

with io.open('docs\\v58eng_top17_hits.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print('\n'.join(out))
