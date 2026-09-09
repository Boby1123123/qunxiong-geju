#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""探查game.html插入锚点"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 确认锚点存在
for anchor in ['N["travel_desert_day1"]', 'N["academy_elda_hub"]', 'N["fc_jiaohui_entry"]']:
    pos = html.find(anchor)
    print(anchor, '位置:', pos)

# 找到所有script的边界
scripts = []
pos = 0
while True:
    start = html.find('<script>', pos)
    if start == -1: break
    end = html.find('</script>', start)
    if end == -1: break
    scripts.append((start, end))
    pos = end + 9

print('script数量:', len(scripts))
for i, (s, e) in enumerate(scripts):
    seg_len = e - s
    print('  script{}: {}-{} ({}字符)'.format(i, s, e, seg_len))

# 在script2内找最后一个节点定义
s2_start, s2_end = scripts[2]
last_node = html.rfind('N["', s2_start, s2_end)
print('\nscript2内最后一个节点定义位置:', last_node)
# 找该节点定义的结尾
end_marker = html.find('}};', last_node)
print('该节点结尾位置:', end_marker)
print('结尾后内容预览:', repr(html[end_marker:end_marker+50]))
