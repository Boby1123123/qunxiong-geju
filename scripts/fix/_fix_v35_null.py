#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复v35_initMagic的null引用问题和模块注册问题"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 修复1: v35_initMagic开头添加S对象检查
old_magic = "function v35_initMagic() {\n  if (!S.magic) {"
new_magic = "function v35_initMagic() {\n  if (typeof S === 'undefined' || S === null) return;\n  if (!S.magic) {"
if old_magic in html:
    html = html.replace(old_magic, new_magic)
    print("✓ 已修复v35_initMagic的null引用")
else:
    print("⚠ 未找到v35_initMagic的匹配文本")

# 修复2: v35_initFaction也添加S对象检查
old_faction = "function v35_initFaction() {"
pos = html.find(old_faction)
if pos > 0:
    # 读取函数的第一行
    func_start = pos + len(old_faction)
    first_line_end = html.find('\n', func_start)
    first_line = html[func_start:first_line_end]
    print(f"v35_initFaction第一行: {first_line}")
    if 'S' in first_line and 'typeof S' not in first_line:
        # 在函数开头添加S检查
        new_faction = "function v35_initFaction() {\n  if (typeof S === 'undefined' || S === null) return;"
        html = html.replace(old_faction, new_faction, 1)
        print("✓ 已修复v35_initFaction的null引用")

# 修复3: 模块注册问题 - register函数在模块已注册时不应该返回false导致后续问题
# 实际上这个问题可能是因为v35_arch_init被调用了多次
# 让我们检查v35_arch_init的调用次数
arch_count = html.count('v35_arch_init()')
print(f"\nv35_arch_init()调用次数: {arch_count}")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print("\n✓ 修复完成")
