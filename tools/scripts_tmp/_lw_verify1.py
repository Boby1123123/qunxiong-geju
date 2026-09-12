# -*- coding: utf-8 -*-
import io, re, sys, subprocess, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# 1. 校验 10 处标注
files = ["dn_acad_outside.js","dn_expand_church.js","dn_camp.js","dn_expand_south.js","dn_alumni2.js","dn_desert.js"]
total = 0
for fn in files:
    t = open("src/data_nodes/"+fn, encoding="utf-8").read()
    n = len(re.findall(r"\[\[if:world\.city==", t))
    total += n
    print(fn, "->", n)
print("TOTAL", total)
# 2. 校验 dn_camp 语法（刚才修过 options）
for f in ["src/data_nodes/dn_camp.js"]:
    r = subprocess.run(["node","--check",f], capture_output=True, text=True)
    print(f, "node --check:", "OK" if r.returncode==0 else "FAIL "+r.stderr[:200])
# 3. 校验改过的全部文件 node --check
changed = ["src/data_nodes/dn_lw_world.js","src/script_19.js","src/script_03.js","src/data_nodes/dn_acad_outside.js","src/data_nodes/dn_expand_church.js","src/data_nodes/dn_camp.js","src/data_nodes/dn_expand_south.js","src/data_nodes/dn_alumni2.js","src/data_nodes/dn_desert.js"]
for f in changed:
    r = subprocess.run(["node","--check",f], capture_output=True, text=True)
    print(f, "->", "OK" if r.returncode==0 else "FAIL: "+r.stderr[:160])
