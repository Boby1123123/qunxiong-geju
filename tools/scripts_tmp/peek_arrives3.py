# -*- coding: utf-8 -*-
import io, re
ROOT = r"D:\1pao tuan\群雄割据"
t = io.open(ROOT + r"\src\script_02.js", encoding="utf-8").read()
for nid in ["arrive_south_huangjin", "arrive_south_moxie", "arrive_south_xueshu", "arrive_free_jiaohui"]:
    i = t.find('N["%s"]' % nid)
    seg = t[i:i+900]
    print("=" * 30, nid)
    print(seg[:850])
    print()
# 核对南境城市名
t1 = io.open(ROOT + r"\src\script_01.js", encoding="utf-8").read()
i = t1.find('"south"')
if i > 0:
    print("REGIONS south:", t1[max(0,i-100):i+400])
