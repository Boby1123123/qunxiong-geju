#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查有问题的节点"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 检查realm_4节点
for node_id in ['realm_4', 'realm_5', 'realm_6', 'slow_travel_start']:
    marker = f'N["{node_id}"]'
    pos = html.find(marker)
    if pos > 0:
        print(f"\n=== {node_id} at pos {pos} ===")
        # 读取节点内容（到下一个N[或5000字符）
        end = html.find('N["', pos + 10)
        if end == -1 or end - pos > 5000:
            end = pos + 3000
        content = html[pos:end]
        # 查找引用的属性
        for attr in ['titles', 'workDesc', 'companion', 'day', 'dest']:
            if attr in content:
                attr_pos = content.find(attr)
                print(f"  引用{attr} at 相对位置 {attr_pos}")
                print(f"    上下文: ...{content[max(0,attr_pos-50):attr_pos+50]}...")
    else:
        print(f"\n=== {node_id} 未找到 ===")
