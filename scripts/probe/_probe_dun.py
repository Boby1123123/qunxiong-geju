# -*- coding: utf-8 -*-
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

for nid in ['dun_books_3','dun_books_boss_treasure']:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if m:
        print('=== %s ===' % nid)
        print(m.group(1)[:1500])
        print()
    else:
        print('=== %s NOT FOUND ===' % nid)
