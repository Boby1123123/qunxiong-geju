#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查style标签内的JS代码"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到style开始和结束
style_start = html.find('<style>')
style_end = html.find('</style>')
print(f"<style> at pos {style_start}")
print(f"</style> at pos {style_end}")
print(f"style内容长度: {style_end - style_start}")

# 检查style内容中的JS代码
style_content = html[style_start:style_end]
js_keywords = ['const ', 'var ', 'function ', 'N[', 'V35_', 'V34_', 'console.log', 'V35_ModuleManager']
for kw in js_keywords:
    count = style_content.count(kw)
    if count > 0:
        print(f"  '{kw}': {count}次")

# 找到JS代码开始的位置（在style内）
# 查找第一个const或function或V35_
js_start = min(
    style_content.find('const V35_'),
    style_content.find('function v35_'),
    style_content.find('V35_EventBus'),
    style_content.find('// ==========')
)
# 过滤-1
valid_positions = [p for p in [
    style_content.find('const V35_'),
    style_content.find('function v35_'),
    style_content.find('V35_EventBus'),
] if p >= 0]
if valid_positions:
    js_start = min(valid_positions)
    print(f"\nJS代码在style内的起始位置(相对): {js_start}")
    print(f"绝对位置: {style_start + js_start}")
    print(f"附近内容:")
    print(style_content[max(0,js_start-100):js_start+200])
