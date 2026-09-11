# -*- coding: utf-8 -*-
"""查蓝图 nodeIndex 中 goal_ 前缀条目 + arcs 数组内容，为理想线登记做准备。"""
import io, re

ROOT = r'D:\1pao tuan\群雄割据'
p = ROOT + r'\src\data_nodes\dn_story_blueprint.js'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

# nodeIndex 段
m = re.search(r'nodeIndex\s*[:=]\s*(\{.*?\});', src, re.S)
ni = m.group(1)
# 找 goal_ 前缀
goals = re.findall(r'"((?:goal|fc_ideal)[^"]*)"\s*:\s*\{[^}]*\}', ni)
print('nodeIndex 中 goal/fc_ideal 条目数:', len(goals))
for g in goals[:10]:
    print('  ', g)

# arcs 数组
m2 = re.search(r'arcs\s*[:=]\s*\[(.*?)\];', src, re.S)
if m2:
    arcs = m2.group(1)
    ids = re.findall(r'"id"\s*:\s*"([^"]+)"', arcs)
    print('\narcs 数量:', len(ids))
    for a in ids[:30]:
        print('  ', a)
else:
    print('\n未找到 arcs 数组')

# nodeIndex 结尾 200 字符（确认插入点）
tail = ni[-200:]
print('\nnodeIndex 尾部:', tail)
