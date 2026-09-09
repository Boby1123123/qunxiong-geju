# -*- coding: utf-8 -*-
"""v41：探查 travel 线已有节点"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
pat = re.compile(r'N\["(travel_[^"]+)"\]')
ids = sorted(set(pat.findall(html)))
print('travel 节点: %d' % len(ids))
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    seg = html[m.start():m.start()+500]
    if 'v37占位' in seg or '待补充' in seg: tag='【占位】'
    else: tag=''
    txts = re.findall(r't\.push\("([^"]+)"\)', seg) or re.findall(r'text\s*:\s*\[\s*"([^"]+)"', seg)
    first = txts[0][:36] if txts else '?'
    print('  %-34s %s %s' % (nid, tag, first))
