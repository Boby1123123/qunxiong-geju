# -*- coding: utf-8 -*-
"""检查 content3 提取的 rumors 数组 id 分布"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.STRONG_RUMOR_V53 = [')
j = s.find('\n];', i)
block = s[i:j]
ids = re.findall(r'"id":"(rm_[^"]+)"', block)
print('total:', len(ids))
from collections import Counter
c = Counter(x.split('_')[1] for x in ids)
print(c.most_common(20))
# 看是否有重复 id
dup = [k for k, v in Counter(ids).items() if v > 1]
print('dup ids:', len(dup), dup[:10])
