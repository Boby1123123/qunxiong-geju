# -*- coding: utf-8 -*-
"""检查剩余 v53inj anchor"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for m in ['v53inj:strong', 'v53inj:will', 'v53inj:rumor', 'v53inj:will2', 'v53inj:special2', 'v53inj:genfunc', 'v53inj:genfunc_end']:
    print(m, '->', s.count(m))
