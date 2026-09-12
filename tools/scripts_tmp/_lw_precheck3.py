import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, "tools/eldacheck")
import importlib, checks
import checks.c_echo as ce, checks.c_worldstate as cw, checks.c_faction as cf, checks.c_warfront as cwf
html = open("game.html", encoding="utf-8", errors="replace").read()
for name, m in [("c_echo",ce),("c_worldstate",cw),("c_faction",cf),("c_warfront",cwf)]:
    r = m.run(html)
    print(name, "ok=", r["ok"], "|", r["results"][0]["msg"][:140])
    if not r["ok"]:
        for p in r["results"]: print("   >", p["msg"][:220])
