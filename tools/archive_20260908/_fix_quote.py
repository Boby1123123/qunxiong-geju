# -*- coding: utf-8 -*-
import io
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
old = 'typeof S!=="undefined"&&S&&S.worldState'
new = "typeof S!=='undefined'&&S&&S.worldState"
n = d.count(old)
print('替换前计数:', n)
d2 = d.replace(old, new)
n2 = d2.count(new)
print('替换后计数:', n2)
io.open(r'D:\1pao tuan\群雄割据\game.html', 'w', encoding='utf-8').write(d2)
