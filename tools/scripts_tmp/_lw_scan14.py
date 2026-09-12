import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("game.html", encoding="utf-8", errors="replace").read()
for m in re.finditer(r"base:\s*\d+", t):
    i = m.start()
    print("@", i, "::", t[max(0,i-160):i+120].replace(chr(10)," ")[:280])
    if i > 2100000: break
