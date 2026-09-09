#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""在city_free添加势力招募入口"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

old = '''    {t:"查看冒险日志", go:"adventure_log", effect:{time:0}},
    {t:"离开交汇城", go:"slow_travel_start", effect:{time:0}}'''

new = '''    {t:"查看冒险日志", go:"adventure_log", effect:{time:0}},
    {t:"势力招募（加入各大势力）", go:"faction_recruit_hub", effect:{time:0}},
    {t:"离开交汇城", go:"slow_travel_start", effect:{time:0}}'''

if old in html:
    html = html.replace(old, new)
    print("✓ 已在city_free添加势力招募入口")
else:
    print("⚠ 未找到匹配文本，尝试其他方式")
    # 找city_free节点
    idx = html.find('N["city_free"]')
    if idx > 0:
        print(html[idx:idx+600])

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
