# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = ['seal2_act1_intro','seal2_act1_guide','seal2_act1_khan_info','seal2_act1_shaman_info','seal2_act2_arrive','seal2_act2_old_shaman','seal2_act3_talk','seal2_act3_why','seal2_act4_aftermath','seal2_transition','seal2_act1_tavern','seal2_act1_wanderers','seal2_act1_survivor','seal2_act1_ritual']
for nid in ids:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+700]
        # 提取 text 数组内容
        tm = re.search(r'text:\s*\[(.*?)\]', seg, re.S)
        if tm:
            txt = re.findall(r'"([^"]+)"', tm.group(1))
            print('## %s:' % nid)
            for t in txt[:3]:
                print('   ', t[:80])
            print()
