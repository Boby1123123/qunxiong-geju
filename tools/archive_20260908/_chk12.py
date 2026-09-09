# -*- coding: utf-8 -*-
"""查看 READINGS_V45 结构与 unlockReading 签名"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.READINGS_V45 = {}')
print('READINGS @', i)
# 找一个现有词条看结构
j = s.find('"id":"r_letter')
if j < 0:
    j = s.find('READINGS_V45["')
print('sample @', j)
print(s[j:j+500])
print('======')
k = s.find('function unlockReading')
print(s[k:k+600])
