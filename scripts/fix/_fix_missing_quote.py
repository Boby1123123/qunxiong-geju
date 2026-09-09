#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复缺少引号的文本行"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

idx = html.find('你找到了学院的接待船')
if idx > 0:
    print(f'找到位置: {idx}')
    print(f'前50字符: ...{html[idx-50:idx]}')
    # 检查前面是否有引号
    if html[idx-1] != '"':
        html = html[:idx] + '"' + html[idx:]
        print('✓ 已在前面添加双引号')
    else:
        print('前面已经有引号了')
else:
    print('未找到匹配文本')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print('修复完成')
