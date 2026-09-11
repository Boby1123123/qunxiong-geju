# -*- coding: utf-8 -*-
import io, re
for f in [r"dn_finale.js", r"dn_warphase.js"]:
    p = r"D:\1pao tuan\群雄割据\src\data_nodes\\" + f
    t = io.open(p, encoding='utf-8').read()
    ids = re.findall(r'N\["([^"]+)"\]', t)
    print(f, 'nodes:', len(ids))
    print(ids)
