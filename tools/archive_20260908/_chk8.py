# -*- coding: utf-8 -*-
"""查看 NAME_GEN_V53 与生成函数"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('NAME_GEN_V53 = {')
print('@', i)
print(s[i:i+2000])
print('==========')
for kw in ['genName', 'genTitle', 'NAME_GEN']:
    print(kw, '->', s.count(kw))
