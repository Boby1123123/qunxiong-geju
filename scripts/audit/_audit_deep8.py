# -*- coding: utf-8 -*-
"""v41：292处 text: 选项上下文抽样 + showOptions 兼容性"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('【N】{text: 出现上下文抽样（20处）')
cnt = 0
for m in re.finditer(r'\{text:', html):
    p = m.start()
    ctx = html[p-60:p+60].replace('\n',' ')
    print('  @%d: %s' % (p, ctx))
    cnt += 1
    if cnt >= 20: break
print('总出现: %d' % html.count('{text:'))

print()
print('【O】showOptions @2720806 关键行')
seg = html[2720806:2720806+2500]
lines = seg.split('\n')
for i, line in enumerate(lines):
    if re.search(r'o\.t\b|o\.text|rich\(|textContent|innerHTML|btn|classList', line):
        print('  %d: %s' % (i, line.strip()[:120]))
