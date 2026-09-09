# -*- coding: utf-8 -*-
"""逐步测试 count 匹配"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

tests = [
    'false;"}}',
    'return false;"}}',
    'catch(e){}return false;"}}',
    ';}"}}',
]
for t in tests:
    print(repr(t), '->', s.count(t))

# 用行提取再 count
i = s.find('lv_mage5')
j = s.find('\n', i)
line = s[i:j]
for t in tests:
    print('in-line', repr(t), '->', line.count(t))
