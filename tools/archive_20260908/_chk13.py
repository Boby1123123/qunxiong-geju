# -*- coding: utf-8 -*-
"""查找 READINGS_V45 定义与词条结构"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for kw in ['READINGS_V45', '"type":"letter"', '"type":"tome"', 'r_letter1', 'r_tome1']:
    i = s.find(kw)
    print(kw, '@', i, ':', repr(s[max(0,i-60):i+200]) if i>=0 else 'N/A')
    print('---')
