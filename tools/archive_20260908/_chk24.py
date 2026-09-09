# -*- coding: utf-8 -*-
"""测试 master rumor 提取"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
i = s.find('"id":"m_mage1"')
print('m_mage1 @', i)
if i > 0:
    print(s[i:i+600])
print('======')
m = re.search(r'"id":"(m_mage\d+)"[^}]{0,2500}?"rumor":"([^"]{10,300})"', s)
print('match:', bool(m))
if m:
    print(m.group(1), m.group(2)[:50])
