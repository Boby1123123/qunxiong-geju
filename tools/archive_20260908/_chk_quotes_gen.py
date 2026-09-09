# -*- coding: utf-8 -*-
import sys
src = open(sys.argv[1], encoding='utf-8').read()
bad = 0
for i, line in enumerate(src.split(chr(10)), 1):
    if line.lstrip().startswith('["「'):
        print(i, line[:50])
        bad += 1
print(sys.argv[1], '笔误:', bad)
