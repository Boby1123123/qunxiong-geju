# -*- coding: utf-8 -*-
"""查找 NAME_GEN_V53 的使用与生成函数"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for m in re.finditer(r'NAME_GEN_V53', s):
    i = m.start()
    print('@', i, ':', repr(s[i-80:i+120]))
    print('---')
