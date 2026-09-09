#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查style标签中v35 CSS之前的内容"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到v35战斗系统CSS的位置
css_marker = '/* ===== v35 战斗系统样式 ===== */'
css_pos = html.find(css_marker)
print(f"v35 CSS位置: {css_pos}")

# 检查该位置之前的内容（在style标签内）
# 找到这个style标签的开始
style_start = html.rfind('<style>', 0, css_pos)
print(f"style开始位置: {style_start}")

# 检查style开始到CSS开始之间的内容
between = html[style_start:css_pos]
print(f"\nstyle开始到CSS开始之间的长度: {len(between)}")
print(f"最后500字符:")
print(between[-500:])
