# -*- coding: utf-8 -*-
import io, re, sys
sys.path.insert(0, r'D:\1pao tuan\群雄割据\tools\eldacheck')
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
# 1) 精确找 function 声明形式
for m in re.finditer(r'function\s+(v\d+_ensureDefaults)\b', d):
    print('声明形式:', m.group(1), 'at', m.start(), ':', d[m.start():m.start()+60].replace('\n',' '))
# 2) window. 赋值形式
for m in re.finditer(r'window\.(v\d+_ensureDefaults)\s*=', d):
    print('window赋值形式:', m.group(1), 'at', m.start(), ':', d[m.start():m.start()+70].replace('\n',' '))
# 3) 裸赋值形式
for m in re.finditer(r'(?<![.\w$])(v\d+_ensureDefaults)\s*=', d):
    print('裸赋值形式:', m.group(1), 'at', m.start(), ':', d[m.start():m.start()+70].replace('\n',' '))
