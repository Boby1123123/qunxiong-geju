# -*- coding: utf-8 -*-
"""检查注入的 rumor 块实际内容"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.STRONG_RUMOR_V53 = [')
print('idx:', i)
print(repr(s[i:i+500]))
print('......')
cnt = s.count('"id":"rm_')
print('rm_ count:', cnt)
