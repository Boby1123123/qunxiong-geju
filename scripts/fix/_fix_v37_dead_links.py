#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量创建v37死链占位节点"""

import re
from collections import Counter

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 提取所有节点ID
node_ids = set(re.findall(r'N\["([^"]+)"\]\s*=\s*function', html))

# 提取所有go引用
go_refs = re.findall(r'go:\s*"([^"]+)"', html)

# 检查死链
dead_links = []
for ref in go_refs:
    if ref not in node_ids:
        dead_links.append(ref)

counter = Counter(dead_links)

# v37前缀
v37_prefixes = ['origin_', 'academy_year', 'classmate_', 'city_', 'travel_']

# 收集需要创建的v37占位节点
v37_dead = set()
for ref in dead_links:
    for prefix in v37_prefixes:
        if ref.startswith(prefix):
            v37_dead.add(ref)
            break

print(f'需要创建的v37占位节点数: {len(v37_dead)}')

# 生成占位节点
placeholder_nodes = ''
for node_id in sorted(v37_dead):
    # 根据节点ID生成描述
    if 'class_choose' in node_id:
        desc = '职业选择完成，开始学院生活'
    elif 'tournament_signup' in node_id:
        desc = '报名完成，等待比赛开始'
    elif 'day2' in node_id or 'day3' in node_id:
        desc = '旅途中的一天'
    elif 'start' in node_id:
        desc = '旅程开始'
    elif 'promise' in node_id:
        desc = '你做出了承诺，这个承诺将在未来兑现'
    elif 'explore' in node_id:
        desc = '你开始探索这个地方'
    elif 'elders' in node_id:
        desc = '你去见了长老们'
    elif 'solo' in node_id:
        desc = '你独自踏上了旅程'
    elif 'aftermath' in node_id or 'midterm' in node_id or 'grades' in node_id:
        desc = '事件结束后的余波'
    elif 'father' in node_id or 'mother' in node_id or 'sister' in node_id:
        desc = '你了解了更多关于家人的故事'
    elif 'worldtree' in node_id:
        desc = '你查看了世界树的情况'
    elif 'church' in node_id:
        desc = '你了解了更多关于教会的事'
    elif 'kingdom' in node_id:
        desc = '你了解了更多关于王国的事'
    elif 'war' in node_id:
        desc = '你了解了更多关于战争的事'
    elif 'huang' in node_id:
        desc = '你了解了更多关于黄林晶的事'
    elif 'eclipse' in node_id:
        desc = '你了解了更多关于暗蚀会的事'
    elif 'inquisition' in node_id:
        desc = '你潜入了异端审判所'
    elif 'roots' in node_id or 'bottom' in node_id:
        desc = '你深入了这个地方的深处'
    elif 'mountain' in node_id:
        desc = '你登上了山'
    elif 'desert' in node_id and 'travel' not in node_id:
        desc = '你进入了沙漠'
    elif 'guide' in node_id:
        desc = '向导带你游览了这座城市'
    elif 'tavern' in node_id:
        desc = '你去了酒馆，听到了很多消息'
    elif 'army' in node_id:
        desc = '你去了军营'
    elif 'library' in node_id:
        desc = '你去了图书馆，查阅了很多资料'
    elif 'brothers' in node_id:
        desc = '你见到了老兵的兄弟们'
    elif 'family' in node_id:
        desc = '你了解了更多关于家族的事'
    elif 'tribe' in node_id:
        desc = '你了解了更多关于部落的事'
    elif 'friend' in node_id:
        desc = '你们成为了朋友'
    elif 'neutral' in node_id:
        desc = '你保持了中立'
    elif 'gave_up' in node_id or 'ignored' in node_id or 'avoided' in node_id or 'refused' in node_id or 'forgot' in node_id:
        desc = '你选择了不去管这件事'
    elif 'encouraged' in node_id:
        desc = '你鼓励了他'
    elif 'wang_guide' in node_id or 'chen_guide' in node_id or 'john_guide' in node_id or 'li_guide' in node_id:
        desc = '向导带你游览了这座城市'
    elif 'north_caravan' in node_id or 'south_hunter' in node_id or 'west_pilgrimage' in node_id or 'elf_guide' in node_id or 'dwarf_guide' in node_id or 'east_study' in node_id or 'desert_caravan' in node_id:
        desc = '你跟着队伍一起旅行'
    elif 'north_solo' in node_id or 'south_solo' in node_id or 'west_solo' in node_id or 'elf_solo' in node_id or 'dwarf_solo' in node_id or 'east_solo' in node_id or 'desert_solo' in node_id:
        desc = '你独自旅行'
    elif 'north_explore' in node_id or 'south_explore' in node_id or 'west_explore' in node_id or 'elf_explore' in node_id or 'dwarf_explore' in node_id or 'east_explore' in node_id or 'desert_explore' in node_id:
        desc = '你在旅途中探索了周围的风景'
    elif 'jiaohui' in node_id or 'wang' in node_id:
        desc = '你在交汇城的冒险'
    elif 'tiemenguan' in node_id or 'zhao' in node_id:
        desc = '你在铁门关的冒险'
    elif 'nanfang' in node_id or 'chen' in node_id:
        desc = '你在南方港城的冒险'
    elif 'shengcheng' in node_id or 'john' in node_id:
        desc = '你在圣城的冒险'
    elif 'yinye' in node_id or 'elune' in node_id:
        desc = '你在银叶城的冒险'
    elif 'tiefeng' in node_id or 'tongxu' in node_id:
        desc = '你在铁峰堡的冒险'
    elif 'chengtian' in node_id or 'li' in node_id:
        desc = '你在承天城的冒险'
    elif 'lvzhou' in node_id or 'pang' in node_id:
        desc = '你在绿洲城的冒险'
    else:
        desc = '（待补充内容）'

    placeholder_nodes += f'''
N["{node_id}"]=function(){{return{{
place:"{node_id}",
text:[
"{desc}。",
"（此节点为v37占位节点，后续将补充完整的连续叙事内容。）"
],
options:[
{{t:"返回主界面", go:"academy_elda_hub"}},
{{t:"继续探索", go:"world_map"}}
]
}}}};
'''

# 插入占位节点
marker = 'N["travel_desert_day1"]'
insert_pos = html.find(marker)
if insert_pos > 0:
    # 找到这个节点的结束位置
    end_pos = html.find('}};', insert_pos)
    if end_pos > 0:
        end_pos += 3
        html = html[:end_pos] + placeholder_nodes + html[end_pos:]
        print(f'✓ 已插入 {len(v37_dead)} 个v37占位节点')
    else:
        print('⚠ 未找到节点结束位置')
else:
    print('⚠ 未找到插入位置')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print(f'文件大小: {len(html)} 字符')
