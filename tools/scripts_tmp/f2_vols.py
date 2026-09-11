# -*- coding: utf-8 -*-
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
t = open(r'D:\1pao tuan\群雄割据\src\data_nodes\dn_story_blueprint.js', encoding='utf-8').read()
m = re.search(r'nodeIndex:\s*(\{.*?\})\s*,\s*\n?\s*arcs', t, re.S)
print('nodeIndex found:', bool(m))
if m:
    s = m.group(1)
    for k in ['east_exam','desert_caravan2','west_ranger3','elf_deep_mist','dwarf_deep_mine2','fc_sewer2','tm_courier','pro_realm1','world_bandit','world_sflood','arrive_church_tribunal']:
        mm = re.search(r'"'+k+r'"\s*:\s*\{[^}]*\}', s)
        print(k, '->', mm.group(0)[:110] if mm else 'NOT IN nodeIndex')
vols = set(re.findall(r'vol:\s*"(vol_[a-z_]+)"', t))
print('vols:', sorted(vols))
