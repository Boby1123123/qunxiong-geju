# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal5 = sorted([i for i in ids if i.startswith('seal5') and 'exp' not in i])
print('seal5 act 节点:', ', '.join(seal5))
print()
# 看关键节点
for nid in ['seal5_act1_tavern','seal5_act2_harbor','seal5_act3_pearl','seal5_act4_repair_success','seal5_act4_repair_fail','seal5_transition','seal5_act1_harbor']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+900]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:5]:
            print('   ', t[:75])
        print()
