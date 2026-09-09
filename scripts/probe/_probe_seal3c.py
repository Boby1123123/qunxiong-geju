# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal3 = sorted([i for i in ids if i.startswith('seal3')])
print('seal3 全部节点(%d):' % len(seal3))
print(', '.join(seal3))
