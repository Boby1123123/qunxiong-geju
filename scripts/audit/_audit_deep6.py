# -*- coding: utf-8 -*-
"""v41：writeNext 选项渲染细节 + newGame 定义对比"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('【K3】writeNext @2825112 全段（选项渲染相关行）')
seg = html[2825112:2825112+6500]
lines = seg.split('\n')
for i, line in enumerate(lines):
    if re.search(r'option|\.t\b|\.text\b|options|btn|label', line):
        print('  %d: %s' % (i, line.strip()[:120]))

print()
print('【L3】newGame 三处定义开头')
for p in [2747619, 2822981, 2826991]:
    print('  @%d: %s' % (p, html[p:p+120].replace('\n',' ')))
