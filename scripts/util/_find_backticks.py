#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""定位未闭合的模板字面量"""

with open('_chk0.js','r',encoding='utf-8') as f:
    content = f.read()

# 找到所有反引号的位置
backtick_positions = []
in_string = False
string_char = None
in_comment = False
in_line_comment = False

for i, ch in enumerate(content):
    if in_line_comment:
        if ch == '\n':
            in_line_comment = False
        continue
    if in_comment:
        if ch == '*' and i+1 < len(content) and content[i+1] == '/':
            in_comment = False
        continue
    if in_string:
        if ch == string_char and content[i-1] != '\\':
            in_string = False
        continue
    if ch == '/' and i+1 < len(content) and content[i+1] == '/':
        in_line_comment = True
        continue
    if ch == '/' and i+1 < len(content) and content[i+1] == '*':
        in_comment = True
        continue
    if ch in ['"', "'"]:
        in_string = True
        string_char = ch
        continue
    if ch == '`' and content[i-1] != '\\':
        backtick_positions.append(i)

print(f"找到 {len(backtick_positions)} 个反引号")
for i, pos in enumerate(backtick_positions):
    line_num = content[:pos].count('\n') + 1
    context = content[max(0,pos-30):pos+50].replace('\n', ' ')
    print(f"  #{i+1} pos={pos} line={line_num}: ...{context}...")
