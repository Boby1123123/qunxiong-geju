#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查模板字面量、字符串、注释的闭合情况"""

with open('_chk0.js','r',encoding='utf-8') as f:
    content = f.read()

# 统计各种引号
backticks = content.count('`')
single_quotes = content.count("'")
double_quotes = content.count('"')

print(f"反引号: {backticks} (应为偶数)")
print(f"单引号: {single_quotes}")
print(f"双引号: {double_quotes}")

# 检查最后100行
lines = content.split('\n')
print(f"\n最后20行:")
for i, line in enumerate(lines[-20:], len(lines)-19):
    print(f"  {i}: {line}")

# 检查是否有未闭合的模板字面量
in_template = False
template_start = 0
for i, ch in enumerate(content):
    if ch == '`' and (i == 0 or content[i-1] != '\\'):
        if in_template:
            in_template = False
        else:
            in_template = True
            template_start = i
if in_template:
    print(f"\n⚠ 未闭合的模板字面量，开始于位置 {template_start}")
    print(f"  附近内容: {content[template_start-50:template_start+100]}")
