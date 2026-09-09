# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal5 = sorted([i for i in ids if i.startswith('seal5')])
print('seal5 全部节点(%d):' % len(seal5))
# 找已存在非占位节点的开头文本
for nid in ['seal5_act1_intro','seal5_act1_harbor','seal5_act2_intro','seal5_act3_intro','seal5_act4_intro','seal5_act4_repair_success','seal5_transition']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+800]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        if not txts:
            txts = re.findall(r'"([^"]{8,})"', seg)[:5]
        print('## %s' % nid)
        for t in txts[:4]:
            print('   ', t[:75])
        print()
