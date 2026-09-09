# -*- coding: utf-8 -*-
for fn in ['_v40_rewrite_p0.py','_v40_rewrite_p1.py']:
    print('=== %s ===' % fn)
    src = open(fn, encoding='utf-8').read()
    for i, line in enumerate(src.split('\n'), 1):
        n = line.count('"')
        if n >= 4 and i > 3:
            print(i, line.strip()[:130])
