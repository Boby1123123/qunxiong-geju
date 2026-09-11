# -*- coding: utf-8 -*-
import io, re
ROOT = r"D:\1pao tuan\群雄割据"
t = io.open(ROOT + r"\src\data_nodes\dn_story_blueprint.js", encoding="utf-8").read()
vols = set(re.findall(r'vol:"([^"]+)"', t))
print("vols:", sorted(vols))
arcs = set(re.findall(r'arc:"([^"]+)"', t))
print("arc sample:", sorted(arcs)[:20])
# 南境既有 arc/vol
south_arcs = sorted(a for a in arcs if "south" in a or "gold" in a or "moxie" in a or "acad" in a)
print("south-ish arcs:", south_arcs)
# 修 CP-13 事件 磨心城 -> 魔械城
p = ROOT + r"\src\script_01.js"
t1 = io.open(p, encoding="utf-8").read()
n = t1.count("磨心城")
t1 = t1.replace("磨心城", "魔械城")
io.open(p, "w", encoding="utf-8", newline="").write(t1)
print("fixed 磨心城 -> 魔械城:", n)
# 检查 dn_expand_south.js 是否也有
ps = ROOT + r"\src\data_nodes\dn_expand_south.js"
ts = io.open(ps, encoding="utf-8").read()
print("dn_expand_south 磨心城:", ts.count("磨心城"))
