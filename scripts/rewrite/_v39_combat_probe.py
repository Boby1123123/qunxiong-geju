#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探查现有战斗节点写法，确保新BOSS节点接入战斗系统"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 查找战斗相关引擎函数
for kw in ['startCombat', 'beginCombat', 'doCombat', 'combatState', 'C.combat', 'S.combat', 'enterCombat', 'startBattle', '战斗']:
    idx = html.find(kw)
    if idx > 0:
        print('=== {} @ {} ==='.format(kw, idx))
        print(html[idx-150:idx+250].replace('\n',' '))
        print()

# 查找战斗类型节点（options里带combat标记的）
import re
# 找 fight/battle 出现在 options 里的节点
for m in re.finditer(r'N\["([^"]+)"\]=function', html):
    nid = m.group(1)
    seg_start = m.end()
    seg_end = html.find('}};', seg_start)
    if seg_end == -1: continue
    seg = html[seg_start:seg_end]
    if '战斗' in seg or 'combat' in seg or 'battle' in seg or 'fight' in seg:
        if len(seg) < 3000:
            print('==== 战斗节点示例: {} ===='.format(nid))
            print(seg[:2000])
            print()
            break
