# -*- coding: utf-8 -*-
import re
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 列出 v39 dungeon 部分的所有节点ID
seg_start = html.find('// v39 方向二')
seg = html[seg_start:]
ids = re.findall(r'N\["([^"]+)"\]=function', seg)
print('v39 dungeon 段节点:', ids)
