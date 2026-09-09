#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""直接找到所有反引号的位置"""

with open('_chk0_full.js','r',encoding='utf-8') as f:
    content = f.read()

# 直接找到所有反引号
positions = []
start = 0
while True:
    pos = content.find('`', start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 1

print(f"找到 {len(positions)} 个反引号")
for i, pos in enumerate(positions):
    line_num = content[:pos].count('\n') + 1
    context = content[max(0,pos-30):pos+50].replace('\n', ' ')
    print(f"  #{i+1} pos={pos} line={line_num}: ...{context}...")

# 如果是奇数，最后一个可能未闭合
if len(positions) % 2 == 1:
    last = positions[-1]
    print(f"\n最后一个反引号（奇数，可能未闭合）: pos={last}, line={content[:last].count(chr(10))+1}")
    print(f"  之后200字符: {repr(content[last:last+200])}")
