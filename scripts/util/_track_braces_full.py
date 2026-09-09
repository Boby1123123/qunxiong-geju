#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""精确跟踪花括号深度，找到未闭合的花括号"""

with open('_chk0_full.js','r',encoding='utf-8') as f:
    content = f.read()

depth = 0
max_depth = 0
in_string = False
string_char = None
in_comment = False
in_line_comment = False
in_template = False
brace_stack = []

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
    if in_template:
        if ch == '`' and content[i-1] != '\\':
            in_template = False
        # 模板字面量中的${...}里的花括号需要跟踪
        elif ch == '$' and i+1 < len(content) and content[i+1] == '{':
            depth += 1
            brace_stack.append(('template_expr', i))
        elif ch == '}' and brace_stack and brace_stack[-1][0] == 'template_expr':
            depth -= 1
            brace_stack.pop()
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
        in_template = True
        continue
    if ch == '{':
        depth += 1
        line_num = content[:i].count('\n') + 1
        brace_stack.append(('code', i, line_num))
        if depth > max_depth:
            max_depth = depth
    elif ch == '}':
        depth -= 1
        if brace_stack and brace_stack[-1][0] == 'code':
            brace_stack.pop()
        elif depth < 0:
            line_num = content[:i].count('\n') + 1
            print(f"警告：第{line_num}行花括号深度变为负数: {depth}")
            depth = 0

print(f"最终深度: {depth}")
print(f"最大深度: {max_depth}")
print(f"未闭合的花括号数: {len(brace_stack)}")

if brace_stack:
    print("\n未闭合的花括号:")
    for item in brace_stack[-5:]:
        if item[0] == 'code':
            pos, line = item[1], item[2]
            context = content[max(0,pos-50):pos+50].replace('\n', ' ')
            print(f"  line={line}, pos={pos}: ...{context}...")
        else:
            print(f"  {item[0]} at pos={item[1]}")
