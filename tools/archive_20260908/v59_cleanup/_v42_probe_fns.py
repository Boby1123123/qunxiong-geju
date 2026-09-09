# -*- coding: utf-8 -*-
"""提取 game.html 关键函数完整实现"""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

def show(fn, span):
    m = re.search(r'(?:function\s+%s\b|%s\s*=\s*(?:function|\())' % (fn, fn), html)
    if not m:
        print('--- %s 未找到 ---' % fn); return
    seg = html[m.start():m.start()+span]
    print('=== %s @%d ===' % (fn, m.start()))
    print(seg)
    print()

for fn, span in [('saveGame', 900), ('loadGame', 900), ('writePar', 800), ('writeNext', 1600), ('choose', 1200)]:
    show(fn, span)

# setInterval 位置
print('=== setInterval 出现 ===')
for m in re.finditer(r'setInterval', html):
    print('  @%d: %s' % (m.start(), html[max(0,m.start()-80):m.start()+120].replace('\n',' ')))

# btn-save 绑定
print('=== btn-save 相关 ===')
for m in re.finditer(r'btn-save|btnSave|saveGame\(\)|saveGame\b', html):
    s = max(0, m.start()-60)
    print('  @%d: %s' % (m.start(), html[s:m.start()+90].replace('\n',' ')[:150]))
