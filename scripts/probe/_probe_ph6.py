# -*- coding: utf-8 -*-
import re

html = open('game.html', encoding='utf-8').read()

# 1. arrive_generic / academy_elda_hub 是否存在
for t in ['arrive_generic', 'academy_elda_hub', 'academy_hub', 'pol_hub']:
    print('%s: %s' % (t, ('N["%s"]' % t) in html))

# 2. 死链检查工具如何统计——直接运行检查逻辑
print('\n--- 死链检查逻辑探查 ---')
go_targets = re.findall(r'go:"([^"]+)"', html)
defined = set(re.findall(r'N\["([^"]+)"\]', html))
missing = [g for g in go_targets if g not in defined]
print('go引用总数:', len(go_targets))
print('go目标去重:', len(set(go_targets)))
print('缺失目标(死链):', len(missing))
print('缺失样例:', missing[:20])

# 3. 占位节点引用的上下文（world_continue 被谁引用）
print('\n--- world_continue 引用上下文 ---')
for m in re.finditer(r'go:"world_continue"', html):
    start = max(0, m.start()-200)
    ctx = html[start:m.start()]
    line = ctx.split('\n')[-1].strip()
    print('  ...%s' % line[-100:])
