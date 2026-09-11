# -*- coding: utf-8 -*-
"""查看 goal_* 节点在蓝图中的 arc/vol 值，并登记 21 个新理想线节点（尾部锚点法）。"""
import io, re

ROOT = r'D:\1pao tuan\群雄割据'
p = ROOT + r'\src\data_nodes\dn_story_blueprint.js'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

m = re.search(r'nodeIndex\s*[:=]\s*(\{.*?\});', src, re.S)
ni = m.group(1)

# 取 goal_intro_wealth 的完整条目看 arc
for key in ['goal_intro_wealth', 'goal_wealth_3']:
    mm = re.search(r'"' + key + r'"\s*:\s*(\{[^}]*\})', ni)
    print(key, '->', mm.group(1) if mm else 'MISSING')

# 新节点登记（沿用 arc_ideal 或既有 arc？先用 goal 既有 arc 值）
arc_val = None
mm = re.search(r'"goal_intro_wealth"\s*:\s*\{([^}]*)\}', ni)
if mm:
    a = re.search(r'arc:"([^"]+)"', mm.group(1))
    v = re.search(r'vol:"([^"]+)"', mm.group(1))
    arc_val = a.group(1) if a else None
    vol_val = v.group(1) if v else None
    print('既有 arc/vol:', arc_val, vol_val)
else:
    # 未找到则默认
    arc_val, vol_val = 'arc_ideal', 'vol_ideal'
    print('未找到既有条目，用默认 arc_ideal/vol_ideal')

new_ids = []
for ide in ['wealth', 'might', 'guard']:
    for suf in ['trip_1', 'trip_2', 'p1', 'p2', 'p3', 'trial', 'done']:
        new_ids.append('goal_%s_%s' % (ide, suf))

print('待登记节点数:', len(new_ids))
# 检查是否已存在
dup = [k for k in new_ids if re.search(r'"' + k + r'"\s*:', ni)]
print('已存在(应空):', dup)

# 生成登记块
entries = []
for k in new_ids:
    tag = 'main' if k.endswith(('trial', 'done')) else 'branch'
    pace = 'deep' if k.endswith('trial') else 'normal'
    entries.append('  "%s": {tag:"%s", vol:"%s", arc:"%s", pace:"%s"}' % (k, tag, vol_val, arc_val, pace))
block = ',\n' + ',\n'.join(entries) + '};\n'

# 尾部锚点替换：最后 "hub_deep_20": {...}};
old_tail = '"hub_deep_20": {tag:"main", vol:"vol_free", arc:"arc_cp14_hub", pace:"normal"}};'
assert old_tail in src, '锚点未找到'
src2 = src.replace(old_tail, '"hub_deep_20": {tag:"main", vol:"vol_free", arc:"arc_cp14_hub", pace:"normal"}' + block, 1)
with io.open(p, 'w', encoding='utf-8', newline='') as f:
    f.write(src2)
print('蓝图登记完成')

# 校验：nodeIndex 仍可解析
m3 = re.search(r'nodeIndex\s*[:=]\s*(\{.*?\});', src2, re.S)
import json
try:
    json.loads(m3.group(1))
    print('nodeIndex JSON 解析 OK')
except Exception as e:
    print('nodeIndex 解析失败:', e)
