# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
for nid in ['seal5_act2_dive','seal5_act3_truth','seal5_act4_deal_made','seal5_puzzle','seal5_act3_persuade','seal5_outcome','seal5_act4_aftermath']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+1000]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:5]:
            print('   ', t[:80])
        print()
