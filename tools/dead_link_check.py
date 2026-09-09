#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ELDA死链检测工具
用法: python tools/dead_link_check.py [game.html路径]
"""

import re
import sys
from collections import Counter

def check_dead_links(html_path='game.html'):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 提取所有节点ID
    node_ids = set(re.findall(r'N\["([^"]+)"\]\s*=\s*function', html))
    
    # 提取所有go引用
    go_refs = re.findall(r'go:\s*"([^"]+)"', html)
    
    # 检查死链
    dead_links = []
    for ref in go_refs:
        if ref not in node_ids:
            dead_links.append(ref)
    
    counter = Counter(dead_links)
    
    print(f"节点总数: {len(node_ids)}")
    print(f"go引用总数: {len(go_refs)}")
    print(f"死链数: {len(dead_links)}")
    print(f"唯一死链数: {len(counter)}")
    
    if counter:
        print("\n死链详情（前30个）:")
        for ref, count in counter.most_common(30):
            print(f"  {ref}: {count}次")
    
    return len(dead_links)

if __name__ == '__main__':
    path = sys.argv[1] if len(sys.argv) > 1 else 'game.html'
    dead = check_dead_links(path)
    sys.exit(0 if dead == 0 else 1)
