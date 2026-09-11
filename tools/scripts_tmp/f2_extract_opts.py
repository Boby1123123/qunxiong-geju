# -*- coding: utf-8 -*-
"""F-2: extract option structure of chosen mount nodes (which options have check)."""
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TARGETS = [
    ('world_purge_m2', 'src/data_nodes/dn_f_mainline.js'),
    ('world_seal_m1', 'src/data_nodes/dn_f_mainline.js'),
    ('world_silver_m2', 'src/data_nodes/dn_f_mainline.js'),
    ('world_orc_m1', 'src/data_nodes/dn_f_mainline.js'),
    ('arrive_church_tribunal', 'src/data_nodes/dn_church.js'),
    ('desert_caravan2', 'src/data_nodes/dn_desert.js'),
    ('east_exam', 'src/data_nodes/dn_east.js'),
    ('west_ranger3', 'src/data_nodes/dn_west.js'),
    ('elf_deep_mist', 'src/data_nodes/dn_elf_dwarf.js'),
    ('dwarf_deep_mine2', 'src/data_nodes/dn_elf_dwarf.js'),
    ('tm_courier', 'src/data_nodes/dn_warfront.js'),
    ('fc_sewer2', 'src/script_02.js'),
    ('world_bandit', 'src/script_02.js'),
    ('pro_realm1', 'src/script_02.js'),
    ('acad_story_vault', 'src/data_nodes/dn_acad_story.js'),
    ('world_sflood', 'src/script_02.js'),
]

for nid, f in TARGETS:
    t = open(f, encoding='utf-8', errors='ignore').read()
    i = t.find('N["' + nid + '"]')
    if i < 0:
        print('=== %s NOT FOUND in %s' % (nid, f))
        continue
    seg = t[i:i + 2600]
    # 找 options 段
    oi = seg.find('options:')
    if oi < 0:
        print('=== %s: no options (maybe function node?)' % nid)
        continue
    optseg = seg[oi:oi + 2400]
    # 粗略按 {t: 分割
    print('=== %s (%s)' % (nid, f))
    for m in re.finditer(r'\{t:"([^"]{2,34})"(.*?)\}', optseg, re.S):
        ttxt = m.group(1)
        rest = m.group(2)
        has_check = 'check:' in rest
        tier_kinds = re.findall(r'(ok|fail|crit|critfail|hard|extreme)\s*:', rest)
        go = re.search(r'go:"([A-Za-z0-9_]+)"', rest)
        fail = re.search(r'fail:"([A-Za-z0-9_]+)"', rest)
        print('   t=%-32s check=%-5s tiers=%-18s go=%-22s fail=%s' % (
            ttxt[:32], has_check, ','.join(sorted(set(tier_kinds)))[:18],
            go.group(1) if go else '?', fail.group(1) if fail else '-'))
    print()
