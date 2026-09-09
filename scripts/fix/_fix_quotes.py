#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复中文文本中的嵌套ASCII双引号"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 搜索所有可能的问题：中文文本中嵌套的ASCII双引号
# 已知问题：守护世界平衡
import re

# 找到所有包含中文和ASCII双引号的行
lines = html.split('\n')
issues = []
for i, line in enumerate(lines):
    # 检查行中是否有中文和嵌套的双引号
    if '守护世界平衡' in line:
        issues.append((i, line[:200]))
    if '眼睛在看着' in line:
        issues.append((i, line[:200]))

print(f"找到 {len(issues)} 个可能的问题行")
for i, line in issues:
    print(f"行 {i}: {line}")

# 修复：把中文文本中的"守护世界平衡"改成「守护世界平衡」
# 用更精确的方式查找
old_pattern = '自称"守护世界平衡"'
new_pattern = '自称「守护世界平衡」'

count = html.count(old_pattern)
print(f"\n找到 {count} 个 '自称\"守护世界平衡\"'")

if count > 0:
    html = html.replace(old_pattern, new_pattern)
    print("✓ 已修复")

# 检查其他可能的嵌套引号问题
# 搜索中文上下文中的双引号
potential_issues = []
for match in re.finditer(r'[\u4e00-\u9fff]"[\u4e00-\u9fff]', html):
    start = max(0, match.start()-20)
    end = min(len(html), match.end()+20)
    context = html[start:end]
    potential_issues.append(context)

print(f"\n找到 {len(potential_issues)} 个中文嵌套双引号的潜在问题")
for i, ctx in enumerate(potential_issues[:10]):
    print(f"  {i+1}: ...{ctx}...")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print("\n✓ 修复完成")
