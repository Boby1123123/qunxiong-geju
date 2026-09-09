# -*- coding: utf-8 -*-
import re, sys

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 1) 检查需要确认的引用目标是否存在
targets = ['west_return','fsh_eclipse2','dun_tree_enter','dun_books_enter','quest_rescue_action','west_warehouse','west_white_cliff']
for t in targets:
    if ('N["%s"]' % t) in html:
        print('OK  存在: %s' % t)
    else:
        print('MISS 缺失: %s' % t)

# 2) 修改 pol_rest_politics 的 options：在「去探索地下城」后插入新枢纽入口
old_opts = '{t:"夜里做了一个奇怪的梦", go:"fsh_dream_gate"},\n{t:"继续查学院政治", go:"pol_faction_map2"},\n{t:"去探索地下城", go:"dungeon_intro"}'
new_opts = ('{t:"夜里做了一个奇怪的梦", go:"fsh_dream_gate"},\n'
            '{t:"继续查学院政治", go:"pol_faction_map2"},\n'
            '{t:"去探索地下城", go:"dungeon_intro"},\n'
            '{t:"去见见学院里的人", go:"npc_rel_hub"},\n'
            '{t:"整理随身行囊", go:"item_hub"},\n'
            '{t:"翻看夜读笔记", go:"hook_hub"},\n'
            '{t:"梳理任务清单", go:"quest_hub"},\n'
            '{t:"想想毕业后的打算", go:"grad_hub"}')

cnt = html.count(old_opts)
if cnt == 1:
    html = html.replace(old_opts, new_opts)
    print('\n✓ pol_rest_politics 已挂接5个新枢纽')
else:
    print('\n✗ pol_rest_politics 匹配 %d 次，未修改' % cnt)

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print('已保存')
