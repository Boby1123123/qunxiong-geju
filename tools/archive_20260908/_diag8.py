# -*- coding: utf-8 -*-
"""查看 content1.py 中所有 'return false;' 后的字符序列"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\_v53_content1.py', encoding='utf-8').read()

pos = 0
while True:
    i = s.find('return false;', pos)
    if i < 0:
        break
    tail = s[i:i+25]
    print('@', i, repr(tail))
    pos = i + 1
