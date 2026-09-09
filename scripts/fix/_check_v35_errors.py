#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查v35_initMagic和模块注册的问题"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到v35_initMagic函数
marker = 'function v35_initMagic'
pos = html.find(marker)
if pos > 0:
    print(f"v35_initMagic at pos {pos}")
    # 读取函数内容
    func_end = html.find('}', pos)
    # 找到函数的真正结束（可能有多个}）
    depth = 0
    end_pos = pos
    for i in range(pos, min(pos+5000, len(html))):
        if html[i] == '{':
            depth += 1
        elif html[i] == '}':
            depth -= 1
            if depth == 0:
                end_pos = i
                break
    func_content = html[pos:end_pos+1]
    print(f"函数长度: {len(func_content)}")
    # 查找.magic的引用
    magic_pos = func_content.find('.magic')
    if magic_pos > 0:
        print(f".magic引用 at 相对位置 {magic_pos}")
        print(f"附近内容: {func_content[max(0,magic_pos-100):magic_pos+100]}")

# 检查模块注册和加载的顺序
print("\n\n检查模块注册/加载顺序:")
register_pos = html.find("V35_ModuleManager.register('core'")
load_pos = html.find("V35_ModuleManager.load('core'")
print(f"register('core') at pos {register_pos}")
print(f"load('core') at pos {load_pos}")
if register_pos > 0 and load_pos > 0:
    print(f"注册在加载之前: {register_pos < load_pos}")
