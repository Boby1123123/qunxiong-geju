# -*- coding: utf-8 -*-
import re
html = open('game.html', encoding='utf-8').read()

def show_defs(nid):
    print('='*60)
    print('节点:', nid)
    for m in re.finditer(r'N\["%s"\]\s*(=|\w*\s*=\s*function\()' % nid, html):
        pos = m.start()
        seg = html[pos:pos+350].replace('\n',' ')
        tag = '占位' if 'v38自动生成的占位节点' in html[pos:pos+800] else '未知'
        kind = 'function格式' if 'function' in m.group(0) else '= { 格式'
        print('  @%d [%s][%s]: %s...' % (pos, kind, tag, seg[:280]))

for nid in ['fc_jiaohui_entry', 'fc_guild', 'fc_tavern', 'north_tavern', 'board_free']:
    show_defs(nid)
