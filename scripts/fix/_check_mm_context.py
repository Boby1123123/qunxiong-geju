#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查V35_ModuleManager定义的上下文"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到const V35_ModuleManager的位置
idx = html.find('const V35_ModuleManager')
print(f"const V35_ModuleManager at pos {idx}")

# 检查前后500字符
context_start = max(0, idx - 200)
context_end = min(len(html), idx + 500)
context = html[context_start:context_end]
print(f"\n上下文 (pos {context_start}-{context_end}):")
print(context)

# 检查这个位置在哪个script标签内
# 找到最近的<script开始标签
script_start = html.rfind('<script', 0, idx)
script_end = html.find('</script>', idx)
print(f"\n最近的<script开始标签 at pos {script_start}")
print(f"最近的</script>结束标签 at pos {script_end}")

# 检查script标签的属性
if script_start > 0:
    tag_end = html.find('>', script_start)
    print(f"script标签: {html[script_start:tag_end+1]}")
