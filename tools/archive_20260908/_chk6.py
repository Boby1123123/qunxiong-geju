# -*- coding: utf-8 -*-
"""查看 v53_findStrong / NAME_GEN_V53 / PEERS 结构"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.v53_findStrong')
print(s[i:i+1200])
print('==========')
# PEERS 兽王/隐世/散人条目
j = s.find('PEERS_V53["兽王"]')
print(s[j-200:j+900])
