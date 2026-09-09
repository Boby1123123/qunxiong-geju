# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal6 = sorted([i for i in ids if i.startswith('seal6')])
print('seal6 节点:', ', '.join(seal6))
print()
for nid in ['seal6_act1_intro','seal6_act2_intro','seal6_act3_intro','seal6_act4_intro','seal6_transition','seal6_act1_rift_direct']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+1000]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:5]:
            print('   ', t[:80])
        print()
