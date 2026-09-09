#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查S对象定义位置和v35_arch_init调用位置"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到S对象的定义
s_defs = []
for marker in ['var S =', 'let S =', 'const S =', 'S = {', 'window.S =']:
    pos = 0
    while True:
        pos = html.find(marker, pos)
        if pos == -1:
            break
        s_defs.append((pos, marker))
        pos += 1

print("S对象定义:")
for pos, marker in s_defs[:5]:
    line = html[:pos].count('\n') + 1
    print(f"  pos={pos}, line={line}: {marker}")

# 找到v35_arch_init的调用
arch_calls = []
pos = 0
while True:
    pos = html.find('v35_arch_init()', pos)
    if pos == -1:
        break
    arch_calls.append(pos)
    pos += 1

print(f"\nv35_arch_init()调用次数: {len(arch_calls)}")
for pos in arch_calls:
    line = html[:pos].count('\n') + 1
    context = html[max(0,pos-50):pos+50].replace('\n', ' ')
    print(f"  pos={pos}, line={line}: ...{context}...")

# 检查script标签的顺序
print("\nScript标签顺序:")
pos = 0
script_num = 0
while True:
    start = html.find('<script>', pos)
    if start == -1:
        break
    end = html.find('</script>', start)
    content = html[start:end]
    has_s = 'S =' in content or 'var S' in content
    has_arch = 'v35_arch_init' in content
    has_init_magic = 'v35_initMagic' in content
    print(f"  script {script_num}: pos={start}, len={end-start}, has_S={has_s}, has_arch={has_arch}, has_initMagic={has_init_magic}")
    pos = end + 9
    script_num += 1
