# -*- coding: utf-8 -*-
html = open('game.html', encoding='utf-8').read()
n = html.count('go:"seal3_act4_final"')
html = html.replace('go:"seal3_act4_final"', 'go:"seal3_act4_repair_success"')
open('game.html','w',encoding='utf-8').write(html)
print('替换处数:', n)
