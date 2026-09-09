# -*- coding: utf-8 -*-
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

for nid in ['dun_books_3','dun_ruins_1','dun_ruins_2','dun_mine_1','dun_tree_3','dun_tree_3b','dun_mine_3']:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if m:
        seg = m.group(1)
        # 只打印 options 部分
        opt = re.search(r'options:\[(.*?)\]', seg, re.S)
        print('=== %s ===' % nid)
        if opt:
            print(opt.group(1).strip()[:600])
        print()
