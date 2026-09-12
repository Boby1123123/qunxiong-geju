# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
fn = "tools/eldacheck/checks/c_echo.py"
t = open(fn, encoding="utf-8").read()
old = """        at = c.get('at')
        if at and at not in cities:
            e1.append('at 地点不在城市表: %s（echoId=%s）' % (at, cid))"""
new = """        at = c.get('at')
        at_city = str(at).split('_')[-1] if at else None
        if at_city and at_city not in cities:
            e1.append('at 地点不在城市表: %s（echoId=%s）' % (at, cid))"""
assert old in t
t = t.replace(old, new, 1)
open(fn, "w", encoding="utf-8", newline="").write(t)
print("c_echo at-fix OK")
