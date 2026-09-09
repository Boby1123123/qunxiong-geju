# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = ['seal2_act1_intro','seal2_act1_guide','seal2_act1_khan_info','seal2_act3_talk','seal2_act4_aftermath','seal2_transition']
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        start = m.start()
        end = html.find('\n};', start)
        seg = html[start:end+3][:1000]
        print('#'*30, nid)
        print(seg[:950])
        print()
