# -*- coding: utf-8 -*-
"""v41：探查 origin 各线已有节点（对齐剧情）"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

# 列出所有 origin 节点（非占位的已存在节点，取文本首段）
pat = re.compile(r'N\["(origin_[^"]+)"\]')
ids = sorted(set(pat.findall(html)))
print('origin 节点总数: %d' % len(ids))
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    seg = html[m.start():m.start()+900]
    if 'v37占位' in seg or '待补充' in seg:
        tag = '【占位】'
    else:
        tag = ''
    txts = re.findall(r't\.push\("([^"]+)"\)', seg) or re.findall(r'text\s*:\s*\[\s*"([^"]+)"', seg)
    first = txts[0][:42] if txts else '?'
    print('  %-38s %s %s' % (nid, tag, first))
