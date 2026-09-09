# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()
ids = re.findall(r'N\["([^"]+)"\]=function', html)

print('=== 精确：text 中含"占位/待补充/后续将补充/自动生成"的节点 ===')
found = []
for i in ids:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % i, html, re.S)
    if not m:
        continue
    seg = m.group(1)
    tm = re.search(r'text:(.*?)(?:,options|\n\})', seg, re.S)
    if tm and ('占位' in tm.group(1) or '待补充' in tm.group(1) or '后续将补充' in tm.group(1) or '自动生成' in tm.group(1)):
        refs = re.findall(r'go:"%s"' % i, html)
        found.append((i, len(refs)))
        print('  %-28s go引用:%d' % (i, len(refs)))
print('共', len(found), '个')

print('\n=== 检查谁引用了这些占位节点 ===')
for i, _ in found:
    for m in re.finditer(r'\{t:"([^"]{0,40})", go:"%s"\}' % i, html):
        print('  %s <- %s' % (i, m.group(1)))
    for m in re.finditer(r'go:"%s"' % i, html):
        start = max(0, m.start()-80)
        ctx = html[start:m.start()]
        line = ctx.split('\n')[-1].strip()
        print('  %s <- ctx: %s' % (i, line[-60:]))

print('\n=== arrive_generic 定义 ===')
m = re.search(r'N\["arrive_generic"\]=function\(\)\{return\{(.*?)\n\}\};', html, re.S)
print(m.group(1)[:400] if m else 'NOT FOUND')
