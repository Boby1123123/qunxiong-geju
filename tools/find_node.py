#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ELDA节点搜索工具
用法: python tools/find_node.py <关键词> [game.html路径]
"""

import re
import sys

def find_node(keyword, html_path='game.html'):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 搜索节点定义
    pattern = rf'N\["([^"]*{re.escape(keyword)}[^"]*)"\]\s*=\s*function'
    matches = re.findall(pattern, html)
    
    print(f"搜索关键词: {keyword}")
    print(f"找到 {len(matches)} 个匹配节点:")
    for m in sorted(matches):
        print(f"  - {m}")
    
    # 搜索go引用
    go_pattern = rf'go:\s*"([^"]*{re.escape(keyword)}[^"]*)"'
    go_matches = re.findall(go_pattern, html)
    go_counter = {}
    for m in go_matches:
        go_counter[m] = go_counter.get(m, 0) + 1
    
    if go_counter:
        print(f"\n相关go引用（前20个）:")
        for ref, count in sorted(go_counter.items(), key=lambda x: -x[1])[:20]:
            print(f"  - {ref}: {count}次")
    
    return matches

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python tools/find_node.py <关键词> [game.html路径]")
        sys.exit(1)
    keyword = sys.argv[1]
    path = sys.argv[2] if len(sys.argv) > 2 else 'game.html'
    find_node(keyword, path)
