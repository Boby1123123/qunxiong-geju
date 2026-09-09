#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""定位script外JS代码的起始位置"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 查找style结束标签
style_end = html.find('</style>')
print(f"</style> at pos {style_end}")

# 查找第一个script开始
script_start = html.find('<script>')
print(f"<script> at pos {script_start}")

# 检查style结束到script开始之间的内容
between = html[style_end:script_start]
print(f"\n</style>到<script>之间的内容长度: {len(between)}")
print(f"前500字符:")
print(between[:500])
print(f"\n后500字符:")
print(between[-500:])

# 检查这段内容中有多少JS代码
js_keywords = ['const ', 'var ', 'function ', 'N[', 'V35_', 'V34_', 'console.log']
for kw in js_keywords:
    count = between.count(kw)
    if count > 0:
        print(f"  '{kw}': {count}次")
