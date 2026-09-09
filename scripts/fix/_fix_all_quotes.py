#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复所有中文文本中的嵌套ASCII双引号"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 修复1: 大声喊"有人吗？我是商会送货的！"
old1 = 't:"大声喊"有人吗？我是商会送货的！""'
new1 = 't:"大声喊「有人吗？我是商会送货的！」"'
if old1 in html:
    html = html.replace(old1, new1)
    print("✓ 修复大声喊的引号")
else:
    print("未找到大声喊的匹配，尝试搜索...")
    idx = html.find('大声喊')
    if idx > 0:
        print(f"找到位置: {idx}")
        print(f"上下文: ...{html[idx:idx+80]}...")

# 修复2: 检查所有t:选项中的嵌套引号
import re
# 找到所有 t:"..." 中的嵌套双引号
pattern = r't:"([^"]*"[^"]*"[^"]*)"'
matches = re.findall(pattern, html)
print(f"\n找到 {len(matches)} 个t:选项中的嵌套双引号")
for i, m in enumerate(matches[:5]):
    print(f"  {i+1}: {m[:80]}...")

# 修复3: 更广泛的搜索 - 中文文本中的 "中文" 模式
# 这种模式通常是嵌套引号问题
chinese_quotes = re.findall(r'[\u4e00-\u9fff]"[\u4e00-\u9fff][^"]*"[\u4e00-\u9fff]', html)
print(f"\n找到 {len(chinese_quotes)} 个中文嵌套双引号模式")
for i, m in enumerate(chinese_quotes[:5]):
    print(f"  {i+1}: {m[:80]}")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print("\n✓ 修复完成")
