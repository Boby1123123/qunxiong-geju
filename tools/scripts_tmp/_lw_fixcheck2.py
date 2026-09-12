# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
for fn in ["tools/eldacheck/checks/c_echo.py","tools/eldacheck/checks/c_faction.py","tools/eldacheck/checks/c_warfront.py"]:
    t = open(fn, encoding="utf-8").read()
    old = "def _js_to_json(seg):\n    seg2 = re.sub"
    new = "def _js_to_json(seg):\n    seg = re.sub(r'/\\*.*?\\*/', '', seg, flags=re.S)\n    seg2 = re.sub"
    if old in t:
        t = t.replace(old, new, 1)
        open(fn, "w", encoding="utf-8", newline="").write(t)
        print("fixed", fn)
    else:
        print("PATTERN NOT FOUND", fn)
