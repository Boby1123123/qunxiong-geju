# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# 校验插入结果
files = ["dn_acad_outside.js","dn_expand_church.js","dn_camp.js","dn_expand_south.js","dn_alumni2.js","dn_desert.js"]
total = 0
for fn in files:
    t = open("src/data_nodes/"+fn, encoding="utf-8").read()
    n = len(re.findall(r"\[\[if:world\.city==", t))
    total += n
    print(fn, "->", n, "处")
print("TOTAL", total)
# 检查 fc_camp_market 插入位置
t = open("src/data_nodes/dn_camp.js", encoding="utf-8").read()
i = t.find("[[if:world.city=='church'|集市上多了")
print("fc_camp_market 上下文:", t[max(0,i-200):i+80].replace(chr(10)," ")[:280] if i>=0 else "NOT FOUND")
# church_deep_03 真实文本
t = open("src/data_nodes/dn_expand_church.js", encoding="utf-8").read()
i = t.find("他笑了笑")
print("church_deep_03 上下文:", t[max(0,i-60):i+60].replace(chr(10)," ") if i>=0 else "NOT FOUND")
