# -*- coding: utf-8 -*-
"""v41：探查 city 线占位节点 + 各城主线锚点"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
pat = re.compile(r'N\["(city_[^"]+)"\]')
ids = sorted(set(pat.findall(html)))
placeholders = []
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    seg = html[m.start():m.start()+450]
    if 'v37占位' in seg or '待补充' in seg:
        placeholders.append(nid)
print('city 总数 %d, 占位 %d:' % (len(ids), len(placeholders)))
for nid in placeholders:
    print('  ', nid)
print()
# 各城主线入口首段
for anchor in ['city_jiaohui_intro','city_tiemenguan_intro','city_nanfang_intro','city_holy_intro','city_yinye_intro','city_tiefeng_intro','city_shengcheng_intro','city_lvzhou_intro','city_chengtian_intro','city_ironpeak_intro']:
    m = re.search(r'N\["%s"\]' % anchor, html)
    if m:
        seg = html[m.start():m.start()+300]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg) or re.findall(r'text\s*:\s*\[\s*"([^"]+)"', seg)
        print('%s: %s' % (anchor, (txts[0][:40] if txts else '?')))
