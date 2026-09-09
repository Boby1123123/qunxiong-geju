#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查HTML中的script标签格式"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 查找所有script标签（不区分大小写）
script_starts = [(m.start(), m.group()) for m in re.finditer(r'<script[^>]*>', html, re.IGNORECASE)]
script_ends = [(m.start(), m.group()) for m in re.finditer(r'</script>', html, re.IGNORECASE)]

print(f"找到 {len(script_starts)} 个<script开始标签:")
for pos, tag in script_starts:
    print(f"  pos={pos}: {tag[:80]}")

print(f"\n找到 {len(script_ends)} 个</script>结束标签:")
for pos, tag in script_ends:
    print(f"  pos={pos}")

# 检查V35_ModuleManager在哪个script中
mm_pos = html.find('const V35_ModuleManager')
print(f"\nV35_ModuleManager at pos {mm_pos}")
for i, (start, _) in enumerate(script_starts):
    end = script_ends[i][0] if i < len(script_ends) else len(html)
    if start < mm_pos < end:
        print(f"  -> 在 script {i} 中 (pos {start}-{end})")
        break
