#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""找到完整文件中未闭合的反引号"""

with open('_chk0_full.js','r',encoding='utf-8') as f:
    content = f.read()

# 找到所有反引号的位置（排除转义的）
backticks = []
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
        backticks.append(i)

print(f"找到 {len(backticks)} 个反引号")
for i, pos in enumerate(backticks):
    line_num = content[:pos].count('\n') + 1
    context = content[max(0,pos-40):pos+60].replace('\n', ' ')
    print(f"  #{i+1} line={line_num}: ...{context}...")

# 检查最后一个反引号之后的内容
if len(backticks) % 2 == 1:
    last_pos = backticks[-1]
    print(f"\n最后一个反引号（可能未闭合）在 line={content[:last_pos].count(chr(10))+1}")
    print(f"  之后的内容: {repr(content[last_pos:last_pos+200])}")
