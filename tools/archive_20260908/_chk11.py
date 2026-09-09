# -*- coding: utf-8 -*-
"""查看 v53_rumorAfterWrite 与 STRONG_RUMOR_V53 结构"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('window.v53_rumorAfterWrite')
print(s[i-600:i+1800])
