# -*- coding: utf-8 -*-
"""v41：writeNext 内 options 渲染循环"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

# writeNext @2825112，取 9000 字符覆盖整个函数
seg = html[2825112:2825112+9000]
lines = seg.split('\n')
# 找 options 渲染：包含 node.options 或 opts 或 for(...options
for i, line in enumerate(lines):
    if re.search(r'options|opts\b|opt\b|\.t\b|\.text\b', line) and re.search(r'for|innerHTML|textContent|createElement|map\(|\.join', line):
        print('  %d: %s' % (i, line.strip()[:120]))
print()
print('--- 找 renderOptions / drawOptions 函数 ---')
for m in list(re.finditer(r'function\s+(\w*[Oo]ption\w*)', html))[:10]:
    print('  @%d: %s' % (m.start(), m.group(0)))
# 找选项渲染里读取 o.t 的地方
for m in list(re.finditer(r'\.t\s*\|\||\.text\s*\|\||o\.t\b|opt\.t\b|op\.t\b', html))[:12]:
    p = m.start()
    print('  @%d: %s' % (p, html[p-70:p+50].replace('\n',' ')))
