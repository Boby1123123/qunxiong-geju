# -*- coding: utf-8 -*-
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 1. 找出所有 ENEMIES 中定义的敌人 ID
enemies = set()
m = re.search(r'Object\.assign\(ENEMIES, \{(.*?)\n\}\);', html, re.S)
if m:
    for line in m.group(1).split('\n'):
        mm = re.match(r'\s*"([^"]+)"\s*:', line)
        if mm:
            enemies.add(mm.group(1))
print('ENEMIES 中定义的敌人ID:', sorted(enemies))

# 2. 找出所有 startCombat 调用
calls = re.findall(r'startCombat\("([^"]+)",\s*"([^"]*)",\s*"([^"]*)"\)', html)
print('\nstartCombat 调用总数:', len(calls))
bad = []
for eid, cn, after in calls:
    if eid not in enemies:
        bad.append((eid, cn, after))
if bad:
    print('✗ 敌人ID不在ENEMIES中的调用:')
    for b in bad:
        print('  ', b)
else:
    print('✓ 所有 startCombat 敌人ID均在 ENEMIES 中')

# 3. 检查战后节点是否存在
print('\n战后节点检查:')
for eid, cn, after in calls:
    ok = ('N["%s"]' % after) in html
    if not ok:
        print('  ✗ 战后节点缺失: %s -> %s' % (eid, after))
print('完成')
