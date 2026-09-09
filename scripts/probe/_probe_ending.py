# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()

def show(nid, maxlen=1800):
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if not m:
        print('=== %s NOT FOUND ===' % nid); return
    print('=== %s ===' % nid)
    print(m.group(1)[:maxlen])
    print()

show('ending_choose')
show('ending_check')
show('seal7_act4_final')
