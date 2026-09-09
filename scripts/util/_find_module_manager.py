#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""定位V35_ModuleManager问题"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 查找V35_ModuleManager的所有出现位置
positions = []
start = 0
while True:
    idx = html.find('V35_ModuleManager', start)
    if idx < 0:
        break
    # 找到所在行
    line_start = html.rfind('\n', 0, idx) + 1
    line_end = html.find('\n', idx)
    line = html[line_start:line_end].strip()
    positions.append((idx, line[:120]))
    start = idx + 1

print(f"V35_ModuleManager出现 {len(positions)} 次:")
for i, (pos, line) in enumerate(positions):
    print(f"  {i+1}. pos={pos}: {line}")

# 检查是否有定义
print("\n检查定义:")
for pattern in ['var V35_ModuleManager', 'const V35_ModuleManager', 'let V35_ModuleManager', 'V35_ModuleManager =', 'V35_ModuleManager=']:
    count = html.count(pattern)
    if count > 0:
        print(f"  '{pattern}': {count}次")
