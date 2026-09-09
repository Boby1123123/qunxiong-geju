# -*- coding: utf-8 -*-
"""v41：孤立节点精确入边核查（函数调用形式）"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

ids = set(re.findall(r'N\["([^"]+)"\]', html))

# 各种入边形式
gos = re.findall(r'go\s*:\s*"([^"]+)"', html)
run_t = re.findall(r'run\s*:\s*"([^"]+)"', html)
eng_t = re.findall(r'(?:curNode|jumpTo|goTo|startNode)\s*=\s*["\']([^"\']+)', html)
call_t = re.findall(r'N\[["\']([^"\']+)["\']\]\s*\(', html)
ref = set(g for g in gos if g in ids) | set(r for r in run_t if r in ids) | set(eng_t) | set(call_t)

isolated = sorted(ids - ref)
print('精确孤立节点: %d 个' % len(isolated))

# 查找节点跳转函数名
funcs = set(re.findall(r'function\s+(\w+)', html))
jumpish = sorted(f for f in funcs if re.search(r'jump|goto|open|play|start|switch|nav', f, re.I))
print('可能的跳转函数:', [f for f in jumpish if f in ['openNode','gotoNode','jumpTo','goNode','playNode','startNode','openPanel','openModal','switchNode','showNode','enterNode']])

# 在跳转函数内引用的节点
for fn in ['openNode','gotoNode','jumpTo','goNode','playNode','startNode','switchNode','showNode','enterNode','openPanel','openModal']:
    m = re.search(r'function\s+%s\b' % fn, html)
    if m:
        seg = html[m.start():m.start()+600]
        refs = set(re.findall(r'["\']([a-z_]{3,50})["\']', seg))
        hit = refs & (ids - ref)
        if hit:
            print('  %s 函数内引用孤立节点: %d个（前10: %s）' % (fn, len(hit), sorted(hit)[:10]))

# 面板打开：openPanel("academy") 之类 + S.academy 驱动的学院节点
print()
print('openPanel 调用样本:')
for m in list(re.finditer(r'openPanel\(\s*["\']([^"\']+)', html))[:25]:
    print('  openPanel("%s")' % m.group(1))
