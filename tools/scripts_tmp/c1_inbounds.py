# -*- coding: utf-8 -*-
import io, re, glob
root = r"D:\1pao tuan\群雄割据"
targets = ['anchor_finale_4','anchor_finale_5','seal_1','purge_1','silver_1','academy_1','orc_1','grad_ceremony','warphase_1',
           'i_war_battle_result','tm_frontline','church_entry','east_entry','desert_entry','west_entry','north_academy_gate']
files = glob.glob(root + r"\src\data_nodes\dn_*.js") + glob.glob(root + r"\src\script_0*.js")
N = {}
go_in = {}
for f in files:
    short = f.replace('\\', '/').split('/')[-1]
    t = io.open(f, encoding='utf-8').read()
    for m in re.finditer(r'N\["([^"]+)"\]', t):
        N.setdefault(m.group(1), short)
    for m in re.finditer(r'go:"([^"]+)"', t):
        go_in.setdefault(m.group(1), []).append(short)
for tg in targets:
    ins = go_in.get(tg, [])
    print(tg, '| file:', N.get(tg), '| in:', len(ins), '|', sorted(set(ins))[:8])
