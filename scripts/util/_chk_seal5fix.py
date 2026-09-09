# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
# 找 seal5 修复/成功相关
cand = [i for i in ids if ('seal5' in i and ('repair' in i or 'success' in i or 'fix' in i or 'seal' in i))]
print('seal5 修复相关:', sorted(cand))
# 也看看引用 seal5_outcome 的是谁
for m in re.finditer(r'\{"t":"[^"]*","go":"seal5_outcome"', html):
    pass
print('seal5_outcome 存在:', 'seal5_outcome' in ids)
# seal5_act4 有哪些
act4 = sorted([i for i in ids if i.startswith('seal5_act4')])
print('seal5_act4:', act4)
