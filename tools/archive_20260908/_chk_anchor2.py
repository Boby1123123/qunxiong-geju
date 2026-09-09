# -*- coding: utf-8 -*-
"""定位剩余 anchor 位置"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for m in ['v53inj:strong', 'v53inj:will', 'v53inj:rumor']:
    i = s.find(m)
    print(m, '@', i, ':', repr(s[i-80:i+80]))
    print('---')
