#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查当前文件的style/script结构"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到所有style和script标签的位置
tags = []
for m in re.finditer(r'<(/?)(style|script)[^>]*>', html, re.IGNORECASE):
    tags.append((m.start(), m.group()))

tags.sort()
print("标签顺序:")
for pos, tag in tags:
    print(f"  pos={pos}: {tag[:60]}")

# 检查每个script标签内是否有CSS代码
print("\n检查script标签内容:")
for i in range(len(tags)):
    if tags[i][1].lower().startswith('<script'):
        start = tags[i][0]
        # 找到对应的结束标签
        end = None
        for j in range(i+1, len(tags)):
            if tags[j][1].lower().startswith('</script'):
                end = tags[j][0]
                break
        if end:
            content = html[start:end]
            has_css = '.battle-overlay' in content or '.faction-' in content
            has_js = 'function ' in content or 'const ' in content
            print(f"  script at {start}: len={end-start}, has_css={has_css}, has_js={has_js}")
