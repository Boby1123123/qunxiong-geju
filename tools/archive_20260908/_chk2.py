# -*- coding: utf-8 -*-
"""查看 v53 关键对象实际命名与结构"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for kw in ['PEERS_V53', 'STRONG_V53', 'WILL_TO_ASCEND_V53', 'RACE_MOD', 'v53_ensureDefaults', 'v53_strongBody', 'v53_genName', 'v53_rumorAfterWrite', 'case \'strong\'']:
    i = s.find(kw)
    print(kw, '@', i, ':', repr(s[i-40:i+60]))
    print('===')
