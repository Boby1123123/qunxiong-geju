# -*- coding: utf-8 -*-
"""v41：探查 academy_year 线占位 + 已写锚点"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
pat = re.compile(r'N\["(academy_year[^"]+)"\]')
ids = sorted(set(pat.findall(html)))
ph = []
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    seg = html[m.start():m.start()+400]
    if 'v37占位' in seg or '待补充' in seg:
        ph.append(nid)
print('academy_year 总数 %d, 占位 %d:' % (len(ids), len(ph)))
for nid in ph:
    print('  ', nid)
# 已写锚点
for a in ['academy_year1_open','academy_year1_main','academy_year2_open','academy_year3_open','academy_year4_open','academy_year5_main']:
    m = re.search(r'N\["%s"\]' % a, html)
    if m:
        seg = html[m.start():m.start()+250]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg) or re.findall(r'text\s*:\s*\[\s*"([^"]+)"', seg)
        print('%s: %s' % (a, (txts[0][:44] if txts else '?')))
