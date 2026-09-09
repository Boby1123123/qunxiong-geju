# -*- coding: utf-8 -*-
"""列出 game.html 中所有 v53 相关标识符"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

names = set()
for m in re.finditer(r'window\.(v53\w+)\s*=', s):
    names.add(m.group(1))
for m in re.finditer(r'(?:function|const|var)\s+(v53\w+)', s):
    names.add(m.group(1))
print('v53 names:', sorted(names))

# 检查 atlasTab 的 strong 分支写法
i = s.find('atlasTab')
print('atlasTab @', i)
seg = s[i:i+2600]
print(seg[:2600])
