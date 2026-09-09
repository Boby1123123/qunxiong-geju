# -*- coding: utf-8 -*-
"""查看 tavern_rumor_generic 定义节点 place"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

# 找 N["tavern_rumor_generic"]=function
i = s.find('N["tavern_rumor_generic"]')
print('@', i)
print(s[i:i+700])
