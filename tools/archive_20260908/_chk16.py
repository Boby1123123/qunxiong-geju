# -*- coding: utf-8 -*-
"""查找所有 READINGS 相关定义"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for m in re.finditer(r'READINGS\w*\s*=', s):
    i = m.start()
    print('@', i, ':', repr(s[max(0,i-60):i+160]))
    print('---')
print('=== total READINGS refs:', s.count('READINGS'))
