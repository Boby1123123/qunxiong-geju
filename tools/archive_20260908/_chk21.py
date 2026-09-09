# -*- coding: utf-8 -*-
"""打印 rumor 数组 id 列表"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

# 找到第二个（真正的数组赋值）
idx = s.rfind('window.STRONG_RUMOR_V53 = [')
j = s.find('];', idx)
block = s[idx:j]
ids = re.findall(r'"id":"(rm_[^"]+)"', block)
print('total:', len(ids))
from collections import Counter
c = Counter(x for x in ids)
dups = {k: v for k, v in c.items() if v > 1}
print('unique:', len(c), 'dups:', len(dups))
for k, v in list(dups.items())[:15]:
    print('DUP', k, v)
print('sample first 12:')
for x in ids[:12]:
    print(' ', x)
