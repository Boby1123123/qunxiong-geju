#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查script 0的括号匹配"""

with open('_chk0.js','r',encoding='utf-8') as f:
    content = f.read()

# 检查括号匹配
opens = {'(': 0, '{': 0, '[': 0}
closes = {')': 0, '}': 0, ']': 0}
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
    if ch in ['"', "'", '`']:
        in_string = True
        string_char = ch
        continue
    if ch in opens:
        opens[ch] += 1
    if ch in closes:
        closes[ch] += 1

print("括号统计:")
print(f"  (: {opens['(']}, ): {closes[')']}, 差: {opens['('] - closes[')']}")
print(f"  {{: {opens['{']}, }}: {closes['}']}, 差: {opens['{'] - closes['}']}")
print(f"  [: {opens['[']}, ]: {closes[']']}, 差: {opens['['] - closes[']']}")

# 检查最后200行
lines = content.split('\n')
print(f"\n总行数: {len(lines)}")
print(f"最后10行:")
for i, line in enumerate(lines[-10:]):
    print(f"  {len(lines)-10+i}: {line}")
