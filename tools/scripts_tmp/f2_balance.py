# -*- coding: utf-8 -*-
"""Locate node-segment brace imbalance in dn_failpath2.js"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
t = open(r'D:\1pao tuan\群雄割据\src\data_nodes\dn_failpath2.js', encoding='utf-8').read()
ids = re.findall(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t)
print('node count:', len(ids))
for m in re.finditer(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t):
    nid = m.group(1)
    seg_start = m.start()
    nm = re.search(r'\nN\["', t[seg_start+5:])
    seg_end = seg_start + 5 + nm.start() if nm else len(t)
    seg = t[seg_start:seg_end]
    seg2 = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)
    if seg2.count('{') != seg2.count('}'):
        print('IMBALANCE in', nid, seg2.count('{'), seg2.count('}'))
print('done')
