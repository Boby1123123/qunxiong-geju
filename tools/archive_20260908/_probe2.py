# -*- coding: utf-8 -*-
import io, re
html = io.open('game.html', encoding='utf-8').read()
for nid in ['prologue_tavern','relic_grail_boss']:
    m = re.search(r'N\["' + nid + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        print('### %s 未找到' % nid); continue
    ln = html.count('\n', 0, m.start()) + 1
    print('### %s (行%d)' % (nid, ln))
    print(html[m.start():m.start()+1800])
    print()
