#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复world_map死链"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 把占位节点中的world_map替换成academy_elda_hub
old = 'go:"world_map"'
new = 'go:"academy_elda_hub"'
count = html.count(old)
html = html.replace(old, new)
print(f'替换了 {count} 个 world_map 引用')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print('修复完成')
