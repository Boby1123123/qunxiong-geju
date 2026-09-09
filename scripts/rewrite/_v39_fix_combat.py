# -*- coding: utf-8 -*-
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

fixes = [
    ('startCombat("dun_books_3","未知敌人","dungeon_hub")',
     'startCombat("dun_books_boss","墨噬","dun_books_treasure")'),
    ('startCombat("dun_ruins_1","未知敌人","dungeon_hub")',
     'startCombat("dun_ruins_boss","石魇","dun_ruins_treasure")'),
    ('startCombat("dun_ruins_2","未知敌人","dungeon_hub")',
     'startCombat("dun_ruins_boss","石魇","dun_ruins_treasure")'),
    ('startCombat("dun_mine_1","未知敌人","dungeon_hub")',
     'startCombat("dun_mine_boss","熔岩之心","dun_mine_3")'),
    ('startCombat("dun_tree_3","未知敌人","dungeon_hub")',
     'startCombat("dun_tree_boss","腐根精","dun_tree_treasure")'),
    ('startCombat("dun_tree_3b","未知敌人","dungeon_hub")',
     'startCombat("dun_tree_boss","腐根精","dun_tree_treasure")'),
]

for old, new in fixes:
    cnt = html.count(old)
    if cnt == 1:
        html = html.replace(old, new)
        print('✓ 修复: %s' % new[:60])
    else:
        print('✗ 匹配 %d 次: %s' % (cnt, old[:60]))

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print('已保存')
