# -*- coding: utf-8 -*-
import io, re, glob
root = r"D:\1pao tuan\群雄割据"
# 各区域文件首节点（入口）
for f in ['dn_west.js','dn_desert.js','dn_church.js','dn_east.js','dn_seal.js','dn_orc_deep.js','dn_acad_road.js','dn_frontier.js']:
    p = root + r"\src\data_nodes\\" + f
    try:
        t = io.open(p, encoding='utf-8').read()
    except Exception as e:
        print(f, 'ERR', e); continue
    ids = re.findall(r'N\["([^"]+)"\]', t)
    print(f, '->', ids[:4] if ids else 'NONE')
# 谁引用 west_entry 类（go 与 travelTo）
allt = ""
for fp in glob.glob(root + r"\src\data_nodes\dn_*.js") + glob.glob(root + r"\src\script_0*.js"):
    allt += io.open(fp, encoding='utf-8').read()
for kw in ['west_entry','desert_entry','church_entry','east_entry','seal1_irongate','world_purge_m1','world_seal_m1','world_silver','world_orc']:
    print(kw, '引用次数:', allt.count(kw))
