# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal7 = sorted([i for i in ids if i.startswith('seal7')])
print('seal7 节点:', ', '.join(seal7))
print()
for nid in ['seal7_act1_intro','seal7_act4_final','seal7_act4_coexist','seal7_transition','seal7_act2_intro','seal7_act3_intro']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+900]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:5]:
            print('   ', t[:80])
        print()
