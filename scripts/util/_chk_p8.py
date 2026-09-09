# -*- coding: utf-8 -*-
src = open('_v40_rewrite_p8.py', encoding='utf-8').read()
bad = 0
for i, line in enumerate(src.split(chr(10)), 1):
    ls = line.lstrip()
    if ls.startswith('["「'):
        print(i, ls[:60])
        bad += 1
print('共', bad, '处笔误')
