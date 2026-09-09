# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for mk in ['/v48inj:know', '/v57inj:fix']:
    print('=' * 10, mk, '=' * 10)
    for m in re.finditer(re.escape(mk), d):
        seg = d[max(0, m.start() - 60):m.end() + 100].replace('\n', ' ')
        print('  ...', seg[:180])
        print()
