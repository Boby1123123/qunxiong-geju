# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
for nid in ['seal6_act4_aftermath','seal6_outcome','seal6_act4_new_world','seal6_act4_change_past','seal6_transition']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+500]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s 存在' % nid)
        for t in txts[:2]:
            print('   ', t[:60])
        print()
