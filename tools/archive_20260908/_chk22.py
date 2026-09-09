# -*- coding: utf-8 -*-
"""统计当前 rumor 数组 id 分布"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
idx = s.rfind('window.STRONG_RUMOR_V53 = [')
j = s.find('];', idx)
block = s[idx:j]
ids = re.findall(r'"id":"(rm_[^"]+)"', block)
print('total:', len(ids))
pref = {}
for x in ids:
    p = x[3:4]
    pref[p] = pref.get(p, 0) + 1
print('prefix dist:', pref)
# 前 30 个
print(ids[:30])
