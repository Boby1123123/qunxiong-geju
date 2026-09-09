# -*- coding: utf-8 -*-
"""全面诊断当前 game.html 的 v53 trigger 状态"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

# 1. STRONG 魔法师块范围与括号配平
i = s.find('window.STRONG_V53 = {}')
j = s.find('/*v53inj:strong*/')
k = s.find('STRONG_V53["战士"] = {', j)
seg = s[j:k]
depth = 0
for ch in seg:
    if ch in '([{': depth += 1
    elif ch in ')]}': depth -= 1
print('STRONG mage block depth:', depth)

# 2. 所有 trigger 行开头/结尾
rows = []
for m in re.finditer(r'"trigger":(function|"function)', s):
    line_start = s.rfind('\n', 0, m.start()) + 1
    line_end = s.find('\n', m.start())
    line = s[line_start:line_end]
    rows.append((m.start(), line[-45:]))
for pos, tail in rows:
    print('@', pos, repr(tail))
