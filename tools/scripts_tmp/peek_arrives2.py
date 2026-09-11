# -*- coding: utf-8 -*-
import io, re
ROOT = r"D:\1pao tuan\群雄割据"
t = io.open(ROOT + r"\src\script_02.js", encoding="utf-8").read()
# 找所有 arrive_ 节点及其 place/options
for m in re.finditer(r'N\["(arrive_[a-z_]+)"\]', t):
    nid = m.group(1)
    if any(k in nid for k in ("south", "gold", "mill", "acad", "jiaohui", "hub", "free")):
        i = m.end()
        seg = t[i:i+300]
        # place 与 options 首项
        pm = re.search(r'place:"([^"]*)"', seg)
        om = re.search(r't:"([^"]*)"', seg)
        print(nid, "|", pm.group(1) if pm else "?", "| opt0:", om.group(1) if om else "?")
