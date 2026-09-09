#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v38 P1/P2死链批量自动修复：为所有死链创建占位节点"""

import re
from collections import Counter

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 提取所有节点ID
node_ids = set(re.findall(r'N\["([^"]+)"\]\s*=\s*function', html))
print(f'现有节点数: {len(node_ids)}')

# 提取所有go引用
go_refs = re.findall(r'go:\s*"([^"]+)"', html)
print(f'go引用总数: {len(go_refs)}')

# 检查死链
dead_links = []
for ref in go_refs:
    if ref not in node_ids:
        dead_links.append(ref)

counter = Counter(dead_links)
print(f'死链数: {len(dead_links)}')
print(f'唯一死链数: {len(counter)}')

# 为每个唯一死链创建占位节点
placeholder_nodes = '\n\n// ============================================================\n'
placeholder_nodes += '// v38 P1/P2死链批量自动修复：占位节点\n'
placeholder_nodes += '// ============================================================\n\n'

created = 0
for node_id, count in counter.most_common():
    # 生成节点描述
    if 'sewer' in node_id:
        desc = '你来到了下水道区域'
    elif 'library' in node_id:
        desc = '你来到了图书馆'
    elif 'academy' in node_id:
        desc = '你来到了学院'
    elif 'city' in node_id:
        desc = '你来到了城市'
    elif 'after' in node_id:
        desc = '事件结束后的余波'
    elif 'leave' in node_id:
        desc = '你离开了这里'
    elif 'stay' in node_id:
        desc = '你决定留在这里'
    elif 'rest' in node_id:
        desc = '你休息了一会儿'
    elif 'warfield' in node_id:
        desc = '你来到了战场'
    elif 'mine' in node_id:
        desc = '你来到了矿洞'
    elif 'goldscale' in node_id:
        desc = '你来到了金鳞区'
    elif 'moxie' in node_id:
        desc = '你来到了墨邪区'
    elif 'xueshu' in node_id:
        desc = '你来到了学术区'
    elif 'beijing' in node_id:
        desc = '你来到了北京（旧地名）'
    elif 'shangzhan' in node_id:
        desc = '你来到了商站'
    elif 'elf' in node_id:
        desc = '你来到了精灵区域'
    elif 'dwarf' in node_id:
        desc = '你来到了矮人区域'
    elif 'church' in node_id:
        desc = '你来到了教会区域'
    elif 'north' in node_id:
        desc = '你来到了北方区域'
    elif 'south' in node_id:
        desc = '你来到了南方区域'
    elif 'east' in node_id:
        desc = '你来到了东方区域'
    elif 'west' in node_id:
        desc = '你来到了西方区域'
    elif 'gangkou' in node_id:
        desc = '你来到了港口'
    elif 'report' in node_id:
        desc = '你提交了报告'
    elif 'archive' in node_id:
        desc = '你来到了档案室'
    elif 'continue' in node_id:
        desc = '你继续前进'
    elif 'gate' in node_id:
        desc = '你来到了大门'
    elif 'inside' in node_id:
        desc = '你进入了内部'
    elif 'done' in node_id:
        desc = '任务完成'
    elif 'first' in node_id:
        desc = '你来到了第一个区域'
    else:
        desc = '你来到了一个新的地方'

    placeholder_nodes += f'''N["{node_id}"]=function(){{return{{
place:"{node_id}",
text:[
"{desc}。",
"（此节点为v38自动生成的占位节点，被引用{count}次。后续将补充完整叙事内容。）"
],
options:[
{{t:"继续探索", go:"arrive_generic"}},
{{t:"返回主界面", go:"academy_elda_hub"}}
]
}}}};

'''
    created += 1

print(f'已生成 {created} 个占位节点')

# 插入占位节点
marker = 'N["travel_desert_day1"]'
insert_pos = html.find(marker)
if insert_pos > 0:
    end_pos = html.find('}};', insert_pos)
    if end_pos > 0:
        end_pos += 3
        html = html[:end_pos] + placeholder_nodes + html[end_pos:]
        print(f'✓ 已插入 {created} 个占位节点')
    else:
        print('⚠ 未找到节点结束位置')
else:
    print('⚠ 未找到插入位置')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print(f'文件大小: {len(html)} 字符')
