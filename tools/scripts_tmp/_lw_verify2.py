# -*- coding: utf-8 -*-
import io, re, sys, subprocess
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
changed = ["src/data_nodes/dn_lw_world.js","src/script_19.js","src/script_03.js","src/data_nodes/dn_acad_outside.js","src/data_nodes/dn_expand_church.js","src/data_nodes/dn_camp.js","src/data_nodes/dn_expand_south.js","src/data_nodes/dn_alumni2.js","src/data_nodes/dn_desert.js"]
allok = True
for f in changed:
    r = subprocess.run(["node","--check",f], capture_output=True, text=True)
    ok = r.returncode==0
    if not ok: allok = False
    print(f, "->", "OK" if ok else "FAIL: "+r.stderr[:200])
print("ALL:", "PASS" if allok else "FAIL")
