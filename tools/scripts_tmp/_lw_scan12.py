import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("game.html", encoding="utf-8", errors="replace").read()
# 找 market 初始化
for pat in [r"market\s*=\s*\{", r"market:\s*\{"]:
    m = re.search(pat, t)
    if m:
        i = m.start()
        print("### market init @", i)
        print(t[i:i+800])
        break
