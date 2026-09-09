# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
targets = ['seal4_act1_enter','seal4_act1_merchant_info','seal4_act2_next','seal4_act3_seal_heart','seal4_act4_redemption','seal4_act2_recover','seal4_act3_repair','seal4_act4_aftermath','seal4_act1_clue_gathered','seal4_transition','seal4_act1_captured']
for t in targets:
    print('%s: %s' % (t, 'N["%s"]' % t in html))
