# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
for m in re.finditer(r'askConfirm\s*\(', html):
    start = max(0, m.start()-400)
    ctx = html[start:m.start()+150]
    print('='*60)
    print(ctx[-520:])
    print()
