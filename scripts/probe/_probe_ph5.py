# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()

def show(nid, maxlen=700):
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if not m:
        print('=== %s NOT FOUND ===' % nid); return
    print('=== %s ===' % nid)
    print(m.group(1)[:maxlen])
    print()

for nid in ['world_continue', 'act_rest', 'academy_main', 'elf_done', 'ending_choose', 'seal2_act1_alone']:
    show(nid)
