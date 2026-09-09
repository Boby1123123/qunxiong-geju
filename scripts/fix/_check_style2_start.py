#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查第二个style标签的开头内容"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 第二个style标签开始于pos 110029
style2_start = 110029
print(f"第二个style标签开始位置: {style2_start}")
print(f"开头500字符:")
print(html[style2_start:style2_start+500])

# 检查第一个script标签的结尾（pos 110019）
script1_end = 110019
print(f"\n第一个script标签结尾附近:")
print(html[script1_end-100:script1_end+100])
