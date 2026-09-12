import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("game.html", encoding="utf-8", errors="replace").read()
m = re.search(r"base:\d+,sup:\d+,dem:\d+,vol:\d+", t)
print("### 首个商品定义 @", m.start() if m else -1)
if m:
    print(t[max(0,m.start()-500):m.start()+400])
