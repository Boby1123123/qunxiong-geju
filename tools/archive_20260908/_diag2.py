# -*- coding: utf-8 -*-
"""定位 lv_mage5 / theo_mage 行尾原始内容"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for key in ['lv_mage5', 'theo_mage']:
    i = s.find(key)
    # 找该行结尾（最近的 }}\n 或 }}\n）
    j = s.find('\n', i)
    line = s[i:j]
    print(key, 'line tail:', repr(line[-70:]))
    print('===')
