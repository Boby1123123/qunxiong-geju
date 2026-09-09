#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V59: 生成死代码清单文档。"""
import io, sys, time
sys.path.insert(0, 'tools/eldacheck')
from checks import c_dead

html = io.open('game.html', encoding='utf-8').read()
r = c_dead.run(html)
d = r['details']
L = []
L.append('# 死代码清单 v59（V59-ENG 方向一・死代码检测）')
L.append('')
L.append('生成：%s　检测器：c_dead（候选清单制，不阻断验证链）' % time.strftime('%Y-%m-%d %H:%M'))
L.append('')
L.append('> 说明：本清单为候选，需人工确认。孤岛节点可能由动态拼接 go（如 go:"seal_"+n）造成误报；')
L.append('> 无调用函数可能为成员调用（ELDA.utils.x）或仅运行时字符串引用；未用 S 字段可能由动态键访问造成。')
L.append('')
L.append('## 一、孤岛节点 %d（无静态 go/入口引用）' % len(d['islands']))
L.append('')
for x in d['islands'][:120]:
    L.append('- `%s`' % x)
if len(d['islands']) > 120:
    L.append('- … 共 %d 项' % len(d['islands']))
L.append('')
L.append('## 二、无调用函数 %d（候选）' % len(d['uncalled']))
L.append('')
for n, t in d['uncalled'][:80]:
    L.append('- `%s`（全文出现 %d 次）' % (n, t))
if len(d['uncalled']) > 80:
    L.append('- … 共 %d 项' % len(d['uncalled']))
L.append('')
L.append('## 三、未用 S 字段 %d' % len(d['unused_s']))
L.append('')
L += ['- %s' % x for x in d['unused_s']] or ['- 无']
io.open('docs\\死代码清单_v59.md', 'w', encoding='utf-8').write('\n'.join(L))
print('死代码清单已写入 docs\\死代码清单_v59.md（孤岛 %d / 函数 %d / S字段 %d）'
      % (len(d['islands']), len(d['uncalled']), len(d['unused_s'])))
