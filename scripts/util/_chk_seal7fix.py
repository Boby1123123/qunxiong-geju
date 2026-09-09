# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
for nid in ['seal7_outcome','seal7_act4_ending','seal7_transition']:
    print(nid, '存在' if nid in ids else '缺失')
m = re.search(r'N\["seal7_outcome"\]', html)
if m:
    seg = html[m.start():m.start()+400]
    print(re.findall(r't\.push\("([^"]+)"\)', seg)[:2])
