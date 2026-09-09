# -*- coding: utf-8 -*-
"""v41 深查：重名/重复定义/script标签/占位字样上下文/eval/存档键/choose实现/实际入口"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('='*70)
print('【A】重名残留 arrive_generic：两处定义内容对比')
idx = [m.start() for m in re.finditer(r'N\["arrive_generic"\]', html)]
for i, p in enumerate(idx):
    seg = html[p:p+300]
    head = seg[:150].replace('\n',' ')
    print('  定义[%d] @%d: %s' % (i, p, head))

print()
print('='*70)
print('【B】function 格式内部重复 11 个：各两处定义，比较文本长度')
for nid in ['faction_elf_intro','faction_dwarf_intro','faction_orc_intro','academy_year1_intro','academy_year2_intro','academy_year3_intro','academy_year4_intro','classmate_cecilia_intro','classmate_marcus_intro','classmate_thorin_intro']:
    pat = re.compile(r'N\["%s"\]\s*=\s*function\s*\(' % nid)
    poss = [m.start() for m in pat.finditer(html)]
    lens = []
    for p in poss:
        # 向后取 2000 字符看文本量
        seg = html[p:p+2500]
        tlen = len(re.findall(r't\.push\(', seg))
        lens.append(tlen)
    print('  %-28s 定义数:%d 每段t.push数:%s' % (nid, len(poss), lens))

print()
print('='*70)
print('【C】script 开标签6 vs 闭合5：定位第6个开标签')
for m in re.finditer(r'<script', html):
    p = m.start()
    ctx = html[p-80:p+60].replace('\n',' ')
    print('  @%d: %s' % (p, ctx))
