# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()
ids = re.findall(r'N\["([^"]+)"\]=function', html)

print('=== 占位节点排查（含"占位/待补充/后续将/自动生成"） ===')
placeholder = []
for i in ids:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % i, html, re.S)
    if m:
        seg = m.group(1)
        if ('占位' in seg or '自动生成' in seg or '待补充' in seg or '后续将补充' in seg):
            placeholder.append(i)
            # 找出被谁引用
            refs = re.findall(r'go:"%s"' % i, html)
            refs2 = re.findall(r'"%s"' % i, html)
            print('  %-24s 引用go:%d 总出现:%d' % (i, len(refs), len(refs2)))
print('占位节点总数:', len(placeholder))

print('\n=== 统计哪些节点文本极短（可能未完成） ===')
short = []
for i in ids:
    m = re.search(r'N\["%s"\]=function\(\)\{return\{(.*?)\n\}\};' % i, html, re.S)
    if m:
        seg = m.group(1)
        # 提取文本长度
        tm = re.search(r'text:(.*?)(?:,options|\n\})', seg, re.S)
        if tm:
            tlen = len(tm.group(1))
            if tlen < 60:
                short.append((i, tlen))
short.sort(key=lambda x: x[1])
print('极短文本节点（<60字符）:', len(short))
for i, l in short[:40]:
    print('  %-28s %d' % (i, l))
