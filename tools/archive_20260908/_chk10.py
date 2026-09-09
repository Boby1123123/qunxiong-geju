# -*- coding: utf-8 -*-
"""确认 FACTION_PEERS_V53 anchor 与 STRONG 传奇 id"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

# 提取 STRONG 所有条目 id
ids = {}
for m in re.finditer(r'"id":"(lv_[^"]+)"', s):
    ids.setdefault(m.group(1), 0)
    ids[m.group(1)] += 1
print('lv ids:', sorted(ids.keys()))
print()
# FACTION_PEERS_V53 内容
i = s.find('FACTION_PEERS_V53 = {')
j = s.find('\n};', i)
print(s[i:j+3])
