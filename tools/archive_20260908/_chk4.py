# -*- coding: utf-8 -*-
"""查看 v53_peekStrong 与 v53_strongBody 中占位 id 处理"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.v53_peekStrong')
seg = s[i:i+3000]
print(seg)
