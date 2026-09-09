#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查序章节点和伏笔回收"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 搜索prologue相关节点
prologue_nodes = set(re.findall(r'N\["(prologue[^"]*)"\]', html))
print("=== 序章节点 ===")
for n in sorted(prologue_nodes):
    print(f"  {n}")

# 搜索origin相关节点
origin_nodes = set(re.findall(r'N\["(origin[^"]*)"\]', html))
print(f"\n=== 出身节点 ({len(origin_nodes)}) ===")
for n in sorted(origin_nodes):
    print(f"  {n}")

# 搜索foreshadow相关节点
foreshadow_nodes = set(re.findall(r'N\["(foreshadow[^"]*)"\]', html))
print(f"\n=== 伏笔节点 ({len(foreshadow_nodes)}) ===")
for n in sorted(foreshadow_nodes):
    print(f"  {n}")

# 搜索v27相关节点
v27_nodes = set(re.findall(r'N\["([^"]*v27[^"]*)"\]', html))
print(f"\n=== v27节点 ({len(v27_nodes)}) ===")
for n in sorted(v27_nodes):
    print(f"  {n}")
