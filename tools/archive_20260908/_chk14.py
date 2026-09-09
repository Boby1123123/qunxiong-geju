# -*- coding: utf-8 -*-
"""查找 READINGS_V45 定义位置与词条 id"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

print('count:', s.count('READINGS_V45'))
# 找定义
i = s.find('READINGS_V45')
while i >= 0:
    ctx = s[max(0,i-50):i+120]
    if '=' in ctx[i-50:]:
        print('DEF?', repr(ctx[:170]))
        print('---')
    i = s.find('READINGS_V45', i+1)
# 找词条 id 模式
for m in re.finditer(r'READINGS_V45\["([^"]+)"\]', s):
    print('entry:', m.group(1))
