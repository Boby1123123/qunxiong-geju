# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()

# 直接找所有包含"自动生成的占位节点"的行，以及其所属节点
print('=== 含"自动生成的占位节点"的节点 ===')
pat = re.compile(r'N\["([^"]+)"\]=function\(\)\{return\{')
# 找每个节点的位置，然后检查节点段内是否含占位文本
nodes = list(pat.finditer(html))
for i, m in enumerate(nodes):
    end = nodes[i+1].start() if i+1 < len(nodes) else len(html)
    seg = html[m.start():end]
    if '自动生成的占位节点' in seg or '占位节点' in seg:
        nid = m.group(1)
        refs = len(re.findall(r'go:"%s"' % nid, html))
        print('  %-26s go引用:%d' % (nid, refs))

print('\n=== 全部含"占位"的文本行（grep风格） ===')
for line in html.split('\n'):
    if '占位' in line and '自动生成' in line:
        # 找所属节点（前100行内最近的 N["..."]）
        print('  ', line.strip()[:100])
