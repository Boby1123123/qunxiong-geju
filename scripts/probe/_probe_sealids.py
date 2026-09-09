# -*- coding: utf-8 -*-
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
ids = sorted(set(re.findall(r'N\["(seal[^"]*)"\]', html)))
print(len(ids), '个')
for i in ids[:50]: print(' ', i)
