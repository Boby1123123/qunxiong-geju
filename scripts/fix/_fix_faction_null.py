#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复v35_initFaction的null引用"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到v35_initFaction函数
old = "function v35_initFaction() {\n"
new = "function v35_initFaction() {\n  if (typeof S === 'undefined' || S === null) return;\n"
if old in html:
    html = html.replace(old, new, 1)
    print("✓ 已修复v35_initFaction的null引用")
else:
    print("⚠ 未找到匹配文本")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
