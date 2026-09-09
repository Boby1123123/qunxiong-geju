# -*- coding: utf-8 -*-
"""v41：writeNext选项渲染 + newGame/saveGame/loadGame 实际实现"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('【K2】writeNext 定义与选项渲染')
# 找 writeNext 赋值/定义位置
cands = [m.start() for m in re.finditer(r'writeNext\s*=\s*function', html)] or \
        [m.start() for m in re.finditer(r'function\s+writeNext', html)]
print('writeNext 定义位置:', cands)
if cands:
    seg = html[cands[0]:cands[0]+5000]
    # 打印包含 options/opt 渲染的部分
    lines = seg.split('\n')
    for i, line in enumerate(lines):
        if re.search(r'opt\.t\b|opt\.text\b|o\.t\b|o\.text\b|\.t\s*\|\||\.text\s*\|\||innerHTML.*opt|btn\.textContent|appendChild', line):
            print('  %d: %s' % (i, line.strip()[:110]))

print()
print('【L2】newGame / saveGame / loadGame / autoSave 定位')
for fn in ['newGame','saveGame','loadGame']:
    poss = [m.start() for m in re.finditer(r'(?:function\s+%s|%s\s*=)' % (fn, fn), html)]
    print('%s 定义候选: %s' % (fn, poss[:5]))
# 用更宽的方式找存档代码
print()
print('存档写入代码片段:')
for m in list(re.finditer(r'localStorage\.setItem', html))[:8]:
    p = m.start()
    print('  @%d: %s' % (p, html[p-80:p+60].replace('\n',' ')))
print()
print('存档读取代码片段:')
for m in list(re.finditer(r'localStorage\.getItem', html))[:8]:
    p = m.start()
    print('  @%d: %s' % (p, html[p-80:p+60].replace('\n',' ')))
