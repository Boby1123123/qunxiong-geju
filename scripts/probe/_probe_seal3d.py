# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = ['seal3_act2_root','seal3_act2_mirror','seal3_act3_repair','seal3_act3_talk_pride','seal3_act3_agreement','seal3_act3_hlj_truth','seal3_act4_aftermath','seal3_transition','seal3_act2_rest','seal3_act2_recover']
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        start = m.start()
        end = html.find('\n};', start)
        seg = html[start:end+3][:900]
        tm = re.search(r'text:\s*function\(\)\{[^}]*t\.push\("([^"]+)"\)', seg)
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:4]:
            print('   ', t[:70])
        print()
