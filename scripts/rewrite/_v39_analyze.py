#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""分析当前故事节点分布，找出薄弱环节"""

import re
from collections import Counter

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 提取所有节点ID
node_ids = re.findall(r'N\["([^"]+)"\]\s*=\s*function', html)
print('总节点数:', len(node_ids))

# 按前缀分类统计
prefix_counter = Counter()
for nid in node_ids:
    parts = nid.split('_')
    prefix = parts[0] if len(parts) > 1 else nid
    prefix_counter[prefix] += 1

print('\n=== 节点前缀分类统计（前60） ===')
for p, c in prefix_counter.most_common(60):
    print('  {}: {}个'.format(p, c))

# 关键故事线检查
print('\n=== 关键故事线节点统计 ===')
key_lines = ['origin', 'academy', 'city', 'travel', 'classmate', 'foreshadow', 'moral', 'hidden',
             'orientation', 'journey', 'prologue', 'ending', 'boss', 'dungeon', 'quest', 'event',
             'secret', 'politics', 'graduation', 'war', 'abyss', 'fc_', 'north_', 'south_', 'church_',
             'elf_', 'dwarf_', 'east_', 'west_', 'desert_', 'main_', 'time_', 'wait_', 'shop_', 'npc_']
for k in key_lines:
    count = sum(1 for nid in node_ids if k in nid)
    print('  {}: {}个'.format(k, count))

# 检查文本量分布
print('\n=== 文本量分布抽样 ===')
# 找几个代表性节点看文本长度
import random
samples = random.sample(node_ids, min(20, len(node_ids)))
for sid in samples:
    idx = html.find('N["{}"]'.format(sid))
    if idx > 0:
        seg = html[idx:idx+1500]
        text_len = len(seg)
        print('  {}: ~{}字符'.format(sid, text_len))
