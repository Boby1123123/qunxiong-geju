#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查结局节点完整性"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 搜索ending相关节点
ending_nodes = set(re.findall(r'N\["(ending[^"]*)"\]', html))
print(f"=== 结局节点 ({len(ending_nodes)}) ===")
for n in sorted(ending_nodes):
    print(f"  {n}")

# 搜索final相关节点
final_nodes = set(re.findall(r'N\["(final[^"]*)"\]', html))
print(f"\n=== 终局节点 ({len(final_nodes)}) ===")
for n in sorted(final_nodes):
    print(f"  {n}")

# 搜索结局相关的其他命名
end_nodes = set(re.findall(r'N\["([^"]*end[^"]*)"\]', html))
print(f"\n=== 其他end节点 ({len(end_nodes)}) ===")
for n in sorted(end_nodes)[:30]:
    print(f"  {n}")
