# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()

# 精确匹配：节点 text 直接包含"此节点为v38自动生成的占位节点"
# 用节点级切分定位
pat = re.compile(r'N\["([^"]+)"\]=function\(\)\{return\{')
nodes = list(pat.finditer(html))
placeholder_ids = []
for i, m in enumerate(nodes):
    end = nodes[i+1].start() if i+1 < len(nodes) else len(html)
    seg = html[m.start():end]
    # 只检查 text 段（从 text: 到 options: 或节点结束）
    tm = re.search(r'text:(\[.*?\]|\w+\(\))', seg, re.S)
    if tm and '自动生成的占位节点' in tm.group(1):
        placeholder_ids.append(m.group(1))

print('=== 真正文本为占位的节点数: %d ===' % len(placeholder_ids))
for nid in placeholder_ids:
    refs = len(re.findall(r'go:"%s"' % nid, html))
    print('  %-30s go引用:%d' % (nid, refs))
