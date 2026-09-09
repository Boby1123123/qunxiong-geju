# -*- coding: utf-8 -*-
"""查找 READINGS_V45 定义文本"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for m in re.finditer(r'READINGS_V45\s*=\s*\{', s):
    i = m.start()
    print('DEF @', i, ':', repr(s[i:i+300]))
    print('---')
# 也看 unlock 相关
for m in re.finditer(r'"r_[a-z]+[0-9]*":\s*\{', s):
    print('r_ entry:', m.group(0), '@', m.start())
