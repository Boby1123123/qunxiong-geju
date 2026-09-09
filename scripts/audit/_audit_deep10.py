# -*- coding: utf-8 -*-
"""v41：孤立节点入边核实 + 主线入口节点名"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

# 节点全集
ids = set(re.findall(r'N\["([^"]+)"\]', html))
# 显式 go 引用
gos = re.findall(r'go\s*:\s*"([^"]+)"', html)
referenced = set(g for g in gos if g in ids)
# run: 引用
run_t = set(re.findall(r'run\s*:\s*"([^"]+)"', html))
referenced |= run_t
# 引擎赋值
engine_t = set(re.findall(r'(?:curNode|jumpTo|goTo|startNode)\s*=\s*["\']([^"\']+)', html))
referenced |= engine_t
# N[...]() 直接调用
call_t = set(re.findall(r'N\[["\']([^"\']+)["\']\]\s*\(', html))
referenced |= call_t

isolated = sorted(ids - referenced)
print('【Q】孤立节点: %d 个' % len(isolated))
print()
# 抽样10个，看它们的名字是否出现在其他上下文（动态拼接/字符串/注释）
for nid in isolated[:25]:
    # 在 html 中该 nid 出现的次数（定义1次 + 其他引用）
    cnt = len(re.findall(re.escape(nid), html))
    # 非定义引用
    print('  %-40s 出现%d次' % (nid, cnt))

print()
print('【R】主线入口：建号完成后进入的节点')
# 找 showCreation 或建号相关
m = re.search(r'function\s+showCreation', html)
if not m:
    m = re.search(r'showCreation\s*=\s*function', html)
if m:
    seg = html[m.start():m.start()+3000]
    calls = re.findall(r'curNode\s*=\s*["\']([^"\']+)', seg)
    gos = re.findall(r'go\s*:\s*["\']([^"\']+)', seg)
    n_calls = re.findall(r'N\[["\']([^"\']+)["\']\]\s*\(', seg)
    print('  showCreation 内 curNode/go/N调用:', calls, gos[:5], n_calls[:5])
# 找建号确认（创建完成）
for m in re.finditer(r'createCharacter|finishCreation|confirmCreate|startGame', html):
    p = m.start()
    seg = html[p:p+800]
    t = re.findall(r'curNode\s*=\s*["\']([^"\']+)', seg)
    if t:
        print('  @%d %s -> %s' % (p, html[p:p+40].replace('\n',' ')[:40], t[:3]))
