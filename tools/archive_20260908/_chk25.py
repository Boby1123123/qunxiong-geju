# -*- coding: utf-8 -*-
"""检查 master/raceSp/abyss 块是否还在"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for kw in ['/*v53inj:master*/', '.master = [', '.raceSp = [', 'STRONG_V53["暗蚀会"]', '"id":"m_mage', '"id":"r_druid', '"id":"ab_priest1']:
    print(kw, '->', s.count(kw))
