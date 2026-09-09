# -*- coding: utf-8 -*-
"""诊断 game.html 中 STRONG/WILL 的 trigger 行现状"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

# 找所有 trigger 行尾
import re
for m in re.finditer(r'"trigger":function\([^}]*?\}[^}]*?\}\}*', s):
    seg = s[m.start():m.start()+120]
    tail = seg[-45:]
    print(repr(tail))
    print('---')
