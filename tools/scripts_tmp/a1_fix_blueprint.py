# -*- coding: utf-8 -*-
"""修复蓝图登记：arc:"None" -> arc:null（与既有 goal 节点一致）；校验插入块完整性。"""
import io, re

ROOT = r'D:\1pao tuan\群雄割据'
p = ROOT + r'\src\data_nodes\dn_story_blueprint.js'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

n = src.count('arc:"None"')
print('arc:"None" 出现次数:', n)
src2 = src.replace('arc:"None"', 'arc:null')
with io.open(p, 'w', encoding='utf-8', newline='') as f:
    f.write(src2)

# 校验插入块（goal_wealth_trip_1 .. goal_guard_done 连续出现）
block_ok = ('"goal_wealth_trip_1"' in src2) and ('"goal_guard_done"' in src2)
print('插入块存在:', block_ok)

# 验证 nodeIndex 结构：nodeIndex 开始到 }; 结束，括号配平（JS 对象字面量用简单计数）
m = re.search(r'nodeIndex\s*[:=]\s*(\{.*?\});', src2, re.S)
ni = m.group(1)
opens = ni.count('{')
closes = ni.count('}')
print('nodeIndex 花括号配平: open=%d close=%d %s' % (opens, closes, 'OK' if opens == closes else 'FAIL'))
# 检查插入块内 21 条
ids = re.findall(r'"(goal_(?:wealth|might|guard)_(?:trip_1|trip_2|p1|p2|p3|trial|done))"\s*:\s*\{', ni)
print('登记的 21 条确认:', len(ids))
