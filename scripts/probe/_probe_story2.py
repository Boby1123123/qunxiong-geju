# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()
ids = re.findall(r'N\["([^"]+)"\]=function', html)

print('=== 1. ending 节点 ===')
for i in ids:
    if i.startswith('ending') or i.startswith('final') or i.startswith('end_'):
        print(' ', i)

print('\n=== 2. seal 主线各段节点数 ===')
from collections import Counter
c = Counter()
for i in ids:
    if i.startswith('seal'):
        c[i.split('_')[0] + '_' + i.split('_')[1] if len(i.split('_'))>1 else i] += 1
for k, v in sorted(c.items()):
    print(' ', k, v)

print('\n=== 3. seal 主线节点ID样例（seal1前20个） ===')
s1 = [i for i in ids if i.startswith('seal1')]
print(s1[:20])

print('\n=== 4. 检查各主线是否有"汇聚/终局"类节点 ===')
for kw in ['final', 'end', 'climax', 'truth', 'reveal', 'boss_', 'finale']:
    hits = [i for i in ids if kw in i.lower()]
    if hits:
        print(' ', kw, ':', hits[:12])

print('\n=== 5. 各区域枢纽(hub)节点 ===')
for i in ids:
    if 'hub' in i:
        print(' ', i)
