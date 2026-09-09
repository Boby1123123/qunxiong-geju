#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""在学院枢纽添加魔法课程入口"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

old = '''      opts.push({t:"参加社团活动", go:"academy_elda_club", effect:{timeCost:"1period"}});
      opts.push({t:"查看学院排名/势力", go:"academy_rankings_view", effect:{}});
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});'''

new = '''      opts.push({t:"参加社团活动", go:"academy_elda_club", effect:{timeCost:"1period"}});
      opts.push({t:"元素塔·学习魔法", go:"academy_magic_class", effect:{timeCost:"1period"}});
      opts.push({t:"查看学院排名/势力", go:"academy_rankings_view", effect:{}});
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});'''

if old in html:
    html = html.replace(old, new)
    with open('game.html','w',encoding='utf-8') as f:
        f.write(html)
    print("✓ 已在学院枢纽添加魔法课程入口")
else:
    print("⚠ 未找到匹配文本")
