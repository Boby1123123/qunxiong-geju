# -*- coding: utf-8 -*-
"""收集已重写节点ID列表（从5个脚本中提取）"""
import re

ids = []
for fn in ['_v40_rewrite_p0.py','_v40_rewrite_p1.py','_v40_rewrite_p2.py','_v40_rewrite_p3.py','_v40_rewrite_p4.py']:
    src = open(fn, encoding='utf-8').read()
    for m in re.finditer(r'^\("([^"]+)",', src, re.M):
        ids.append(m.group(1))
ids = list(dict.fromkeys(ids))
print(len(ids))
print('\n'.join(ids))
