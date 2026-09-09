# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = ['seal3_act2_intro','seal3_act3_intro','seal3_act4_intro','seal3_act2_enter','seal3_act3_enter','seal3_act4_final','seal3_act4_repair_success']
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        start = m.start()
        end = html.find('\n};', start)
        seg = html[start:end+3][:1100]
        print('#'*30, nid)
        print(seg[:1000])
        print()
