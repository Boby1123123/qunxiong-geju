#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""精确跟踪花括号深度，找到未闭合的位置"""

with open('_chk0.js','r',encoding='utf-8') as f:
    lines = f.readlines()

depth = 0
max_depth = 0
in_string = False
string_char = None
in_comment = False
in_line_comment = False

for line_num, line in enumerate(lines, 1):
    i = 0
    while i < len(line):
        ch = line[i]
        if in_line_comment:
            break
        if in_comment:
            if ch == '*' and i+1 < len(line) and line[i+1] == '/':
                in_comment = False
                i += 2
                continue
            i += 1
            continue
        if in_string:
            if ch == string_char and (i == 0 or line[i-1] != '\\'):
                in_string = False
            i += 1
            continue
        if ch == '/' and i+1 < len(line) and line[i+1] == '/':
            in_line_comment = True
            break
        if ch == '/' and i+1 < len(line) and line[i+1] == '*':
            in_comment = True
            i += 2
            continue
        if ch in ['"', "'", '`']:
            in_string = True
            string_char = ch
            i += 1
            continue
        if ch == '{':
            depth += 1
            if depth > max_depth:
                max_depth = depth
        elif ch == '}':
            depth -= 1
            if depth < 0:
                print(f"警告：第{line_num}行花括号深度变为负数: {depth}")
                depth = 0
        i += 1
    if line_num % 50 == 0 or depth != 0 and line_num > 500:
        print(f"第{line_num}行后深度: {depth}, 行内容: {line[:60].strip()}")

print(f"\n最终深度: {depth}")
print(f"最大深度: {max_depth}")
print(f"总行数: {len(lines)}")
