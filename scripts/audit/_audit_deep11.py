# -*- coding: utf-8 -*-
"""v41：孤立节点引用形式核查（动态拼接判断）"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('【S】出现多次的孤立节点，其非定义引用形式')
for nid in ['abyss_infiltration_tavern','abyss_infiltration_after','academy_business_hub','academy_dwarfeng_hub','academy_entrance']:
    print('='*60)
    print('## %s' % nid)
    poss = [m.start() for m in re.finditer(re.escape(nid), html)]
    for p in poss[1:6]:
        print('  @%d: %s' % (p, html[max(0,p-90):p+30].replace('\n',' ')))

print()
print('【T】动态 go 拼接模式统计')
# go: "xxx_"+ 变量 或 go: xxx 变量
dyn = re.findall(r'go\s*:\s*([A-Za-z_][A-Za-z0-9_.\[\]]*|\"[^\"]*\"\s*\+)', html)
print('  动态go样本: %d 处' % len(dyn))
for d in dyn[:20]:
    print('    ~', d[:60])
# 变量 + 节点名拼接（含节点名前缀字符串）
concat = re.findall(r'go\s*:\s*"([^"]+)"\s*\+', html)
print('  go:"前缀"+ 拼接: %d 处' % len(concat))
for c in concat[:15]:
    print('    ~', c[:50])
