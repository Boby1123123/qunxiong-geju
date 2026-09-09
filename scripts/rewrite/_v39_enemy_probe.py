#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探查startCombat敌人ID定义"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

import re

# 找 startCombat 调用示例（收集所有敌人ID）
ids = set()
for m in re.finditer(r'startCombat\("([^"]+)"', html):
    ids.add(m.group(1))
print('startCombat 引用到的敌人ID（{}个）:'.format(len(ids)))
for i in sorted(ids):
    print('  ', i)

# 找敌人定义位置
for kw in ['ENEMIES', 'enemies', 'MOBS', 'mobs', 'MONSTERS']:
    idx = html.find(kw)
    if idx > 0:
        print('\n=== {} @ {} ==='.format(kw, idx))
        print(html[idx:idx+800].replace('\n',' '))
        break

# 找 combat 敌人属性定义（例如 "hp" 在敌人定义里的写法）
idx = html.find('boss')
if idx > 0:
    print('\n=== boss 首次出现 @ {} ==='.format(idx))
    print(html[idx-200:idx+400].replace('\n',' '))
