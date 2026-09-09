# -*- coding: utf-8 -*-
"""探查 style 区内嵌 JS"""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

for m in re.finditer(r'<style>|</style>', html):
    print('@%d %s' % (m.start(), m.group()))

m2 = re.search(r'id="btn-settings"[^>]*', html)
print('设置按钮:', html[m2.start()-60:m2.start()+140].replace('\n',' | ') if m2 else '未找到')

s_style = html.find('<style>')
e_style = html.find('</style>')
print('style 区: %d - %d (长 %d)' % (s_style, e_style, e_style-s_style))
sty = html[s_style:e_style]
cnt = 0
for m in re.finditer(r'\bfunction\s+', sty):
    cnt += 1
    if cnt <= 12:
        print('  style内 function @%d: %s' % (m.start(), sty[m.start():m.start()+55].replace('\n',' ')))
print('style 区内 function 总数:', cnt)
# const/var 在 style 区（排除 CSS 变量 :root 里）
cnt2 = 0
for m in re.finditer(r'^\s*(const|var|let)\s+', sty, re.M):
    cnt2 += 1
    if cnt2 <= 10:
        print('  style内声明 @%d: %s' % (m.start(), sty[m.start():m.start()+60].replace('\n',' ')))
print('style 区内 const/var/let 声明总数:', cnt2)
