#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复缺少结尾引号和逗号的文本行"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到问题行并修复
old = '船帆上印着艾尔达大陆学院的校徽。\n"船边站着一个穿着学院制服的男人'
new = '船帆上印着艾尔达大陆学院的校徽。",\n"船边站着一个穿着学院制服的男人'

if old in html:
    html = html.replace(old, new)
    print('✓ 已修复结尾引号和逗号')
else:
    print('未找到匹配，尝试其他方式...')
    idx = html.find('船帆上印着艾尔达大陆学院的校徽。')
    if idx > 0:
        print(f'找到位置: {idx}')
        print(f'后50字符: {html[idx:idx+50]}')
        # 检查后面是否有引号和逗号
        after = html[idx+len('船帆上印着艾尔达大陆学院的校徽。'):idx+len('船帆上印着艾尔达大陆学院的校徽。')+5]
        print(f'校徽。后面的字符: [{after}]')
        if after != '",\n"':
            # 在后面添加引号和逗号
            insert_pos = idx + len('船帆上印着艾尔达大陆学院的校徽。')
            html = html[:insert_pos] + '",' + html[insert_pos:]
            print('✓ 已在后面添加引号和逗号')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print('修复完成')
