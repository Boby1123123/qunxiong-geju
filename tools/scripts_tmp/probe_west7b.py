# -*- coding: utf-8 -*-
import io, re
t = io.open('src/data_nodes/dn_west.js', encoding='utf-8').read()
for nid in ['arrive_west_huangyuan', 'west_market', 'west_leave']:
    i = t.find('N["' + nid + '"]')
    if i < 0:
        print('!!', nid, 'not found')
        continue
    e = t.find('};', i)
    seg = t[i:e + 2]
    print('===' + nid + '===')
    print(seg[:1600])
    print()
