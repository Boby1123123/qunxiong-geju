# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()

for nid in ['act_rest', 'ending_choose', 'world_continue', 'academy_main']:
    occurrences = [m.start() for m in re.finditer(r'N\["%s"\]' % nid, html)]
    print('%s: %d 处定义' % (nid, len(occurrences)))
    for pos in occurrences:
        seg = html[pos:pos+220].replace('\n',' ')
        print('  @%d: %s' % (pos, seg[:200]))
