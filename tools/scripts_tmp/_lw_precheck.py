import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, "tools/eldacheck")
import importlib
for mod in ["c_echo","c_worldstate","c_faction","c_warfront"]:
    m = importlib.import_module(mod)
    html = open("game.html", encoding="utf-8", errors="replace").read()
    r = m.run(html)
    print(mod, "ok=", r["ok"], "|", r["results"][0]["msg"][:120])
    if not r["ok"]:
        for p in r["results"]: print("   ", p["msg"][:200])
