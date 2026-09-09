#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探查现有伏笔相关节点"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

import re

# 找含 foreshadow 或伏笔 的节点ID
print('=== 含 foreshadow 的节点 ===')
count = 0
for m in re.finditer(r'N\["([^"]*foreshadow[^"]*)"\]=function', html):
    print(' ', m.group(1))
    count += 1
print('共{}个'.format(count))

# 找含伏笔/seed/hint 关键字的节点
print('\n=== 含 fushi/seed/clue/hint 的节点 ===')
count = 0
for m in re.finditer(r'N\["([^"]*)"\]=function', html):
    nid = m.group(1)
    if any(k in nid for k in ['seed','clue','hint','fushi','huanglin','hlj','watcher','prophecy','omen','anomaly']):
        print(' ', nid)
        count += 1
print('共{}个'.format(count))

# 找 S.foreshadowing 相关代码
idx = html.find('foreshadowing')
print('\nS.foreshadowing 首次出现:', idx)
if idx > 0:
    print(html[idx-300:idx+300].replace('\n',' '))
