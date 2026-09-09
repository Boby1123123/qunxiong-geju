#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""查找学院主界面节点"""
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

idx = html.find('N["academy_main"]')
if idx > 0:
    print('找到academy_main节点')
    print(html[idx:idx+600])
else:
    print('未找到academy_main，搜索类似节点:')
    nodes = set(re.findall(r'N\["(academy[^"]*)"\]', html))
    for n in sorted(nodes):
        print(f'  {n}')
