# -*- coding: utf-8 -*-
"""打印 lv_mage5 行尾字符码"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('lv_mage5')
# STRONG 块里的 lv_mage5（第一个）
j = s.find('\n', i)
line = s[i:j]
print('line len:', len(line))
tail = line[-40:]
for k, ch in enumerate(tail):
    print(repr(ch), hex(ord(ch)))
