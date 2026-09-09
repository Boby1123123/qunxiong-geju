# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()
ids = set(re.findall(r'N\["([^"]+)"\]', html))
seal1 = sorted([i for i in ids if i.startswith('seal1')])
print('seal1 节点:', ', '.join(seal1))
for nid in ['seal1_act1_intro','seal1_act1_entry','seal1_outcome','ending_check']:
    m = re.search(r'N\["%s"\]' % nid, html)
    if m:
        seg = html[m.start():m.start()+600]
        txts = re.findall(r't\.push\("([^"]+)"\)', seg)
        print('## %s' % nid)
        for t in txts[:3]:
            print('   ', t[:70])
        print()
# ending_check 被谁引用
for m in re.finditer(r'\{"t:"([^"]+)"\s*,\s*go:"ending_check"', html):
    print('引用 ending_check <-', m.group(1)[:30])
# seal1_act2_sneak/enter 的引用者
for m in re.finditer(r'\{"t:"([^"]+)"\s*,\s*go:"seal1_act2_(sneak|enter)"', html):
    print('引用 seal1_act2_%s <- %s' % (m.group(2), m.group(1)[:30]))
