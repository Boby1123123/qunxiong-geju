# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
ecl = sorted([i for i in ids if 'eclipse' in i.lower() or 'solar' in i.lower() or 'lunar' in i.lower() or 'moon' in i.lower()])
print('日蚀相关:', ', '.join(ecl))
# 谁引用了 eclipse_branch 节点
for m in re.finditer(r'\{t:"([^"]+)"\s*,\s*go:"(eclipse_branch_\w+)"', html):
    print('引用:', m.group(2), '<-', m.group(1)[:30])
# 探查 eclipse_intro / eclipse_seal 等核心节点
for nid in [i for i in ecl if 'branch' not in i][:8]:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+700]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:3]:
            print('   ', t[:70])
        print()
