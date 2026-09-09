# -*- coding: utf-8 -*-
"""查看 tavern_rumor_generic 的 place 与 STRONG 各条目 rumor 提取测试"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

i = s.find('tavern_rumor_generic')
print('node @', i)
print(s[i-200:i+800])
print('======')
# 测试提取 rumor
pats = re.findall(r'"id":"(lv_[^"]+)"[^}]{0,2000}?"rumor":"([^"]{10,200})"', s)
print('legend rumor pairs:', len(pats))
for pid, pr in pats[:5]:
    print(pid, ':', pr[:40])
