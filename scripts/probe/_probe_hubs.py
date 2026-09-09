# -*- coding: utf-8 -*-
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

for nid in ['pol_rest_politics','dungeon_hub','west_hub']:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if m:
        seg = m.group(1)
        print('=== %s ===' % nid)
        print(seg[:2000])
        print()
    else:
        print('=== %s NOT FOUND ===' % nid)
