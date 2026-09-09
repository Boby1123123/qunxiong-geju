# -*- coding: utf-8 -*-
"""查找 v53_findStrong 定义与 PEERS 结构"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('v53_findStrong = function')
if i < 0:
    i = s.find('function v53_findStrong')
print('@', i)
print(s[i:i+1500])
print('==========')
j = s.find('兽王')
print('兽王 first @', j)
k = s.find('"兽王":')
print('兽王 key @', k)
if k > 0:
    print(s[k:k+700])
