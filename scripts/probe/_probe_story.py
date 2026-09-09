# -*- coding: utf-8 -*-
import re
from collections import Counter

html = open('game.html', encoding='utf-8').read()
ids = re.findall(r'N\["([^"]+)"\]=function', html)
print('节点总数:', len(ids))

prefixes = Counter()
for i in ids:
    p = i.split('_')[0] if '_' in i else i
    prefixes[p] += 1

print('\n--- 前缀分布 ---')
for p, c in prefixes.most_common(50):
    print('%-16s %d' % (p, c))
