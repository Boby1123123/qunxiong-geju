# -*- coding: utf-8 -*-
"""临时：输出 c_text 的 AI 味 Top 节点完整名单（details['ai']）"""
import io, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools', 'eldacheck'))
from checks import c_text

with io.open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()
res = c_text.run(html)
print('AI 味 Top 节点（累计>=3）共 %d 个：' % len(res['details']['ai']))
for nid, ln, wl, c in res['details']['ai']:
    print('  %s | 行%s | %s | 合计%s' % (nid, ln, wl, c))
