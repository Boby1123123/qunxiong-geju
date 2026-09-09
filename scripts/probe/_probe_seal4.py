# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()

def show(nid, maxlen=900):
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % nid, html, re.S)
    if not m:
        print('=== %s NOT FOUND ===' % nid); return
    seg = m.group(1)
    print('=== %s ===' % nid)
    print(seg[:maxlen])
    print()

# seal4 主线骨架：intro 与各 act 的衔接节点
for nid in ['seal4_act1_intro', 'seal4_act2_purify', 'seal4_act3_seal_heart', 'seal4_act4_redemption']:
    show(nid)
