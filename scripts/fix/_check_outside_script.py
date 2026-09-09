#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查script标签外的JS代码"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 第一个script开始于pos=127480
# 检查pos=0到127480之间的内容
before_script = html[:127480]
print(f"第一个script前的内容长度: {len(before_script)}")

# 检查其中是否有JS代码特征
js_patterns = ['const ', 'var ', 'function ', 'N[', 'console.log', 'V35_', 'V34_', 'S.']
for pattern in js_patterns:
    count = before_script.count(pattern)
    if count > 0:
        print(f"  '{pattern}': {count}次")

# 检查HTML结构
print(f"\n前500字符:")
print(before_script[:500])

print(f"\npos 94000-94500 (V35_ModuleManager附近):")
print(before_script[94000:94500])
