# -*- coding: utf-8 -*-
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

old = 'ENEMIES = Object.assign({}, ENEMIES, {'
new = 'Object.assign(ENEMIES, {'
cnt = html.count(old)
if cnt == 1:
    html = html.replace(old, new)
    with open('game.html','w',encoding='utf-8') as f:
        f.write(html)
    print('✓ 已修复 ENEMIES 重新赋值（const 冲突）')
else:
    print('✗ 匹配 %d 次' % cnt)
