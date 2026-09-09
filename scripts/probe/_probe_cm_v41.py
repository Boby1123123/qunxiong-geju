# -*- coding: utf-8 -*-
"""v41：探查 classmate 线占位"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
pat = re.compile(r'N\["(classmate_[^"]+)"\]')
ids = sorted(set(pat.findall(html)))
ph = []
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    seg = html[m.start():m.start()+400]
    if 'v37占位' in seg or '待补充' in seg:
        ph.append(nid)
print('classmate 总数 %d, 占位 %d:' % (len(ids), len(ph)))
for nid in ph:
    print('  ', nid)
