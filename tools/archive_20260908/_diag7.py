# -*- coding: utf-8 -*-
"""检查 content1.py 中 STRONG/WILL trigger 文本的确切字符"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\_v53_content1.py', encoding='utf-8').read()

# 找 lv_mage5 在 STRONG 三引号里的出现
idx = s.find('七印若稳，他一生不叩神座；七印若崩，他第一个去填那个坑')
print('found at', idx)
if idx > 0:
    tail = s[idx:idx+120]
    for k, ch in enumerate(tail):
        print(repr(ch), hex(ord(ch)))
