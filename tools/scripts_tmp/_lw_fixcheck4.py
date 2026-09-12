# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
fn = "tools/eldacheck/checks/c_worldstate.py"
t = open(fn, encoding="utf-8").read()
old = "    merit_clamp = bool(re.search(r'Math\\.min\\(1000,\\s*\\(book\\[facId\\]\\|0\\)\\+a\\)', html))"
new = "    merit_clamp = bool(re.search(r'Math\\.min\\(1000,\\s*\\(book\\[facId\\]\\|\\|0\\)\\+a\\)', html))"
assert old in t, "pattern not found"
t = t.replace(old, new, 1)
open(fn, "w", encoding="utf-8", newline="").write(t)
print("merit_clamp regex fixed")
