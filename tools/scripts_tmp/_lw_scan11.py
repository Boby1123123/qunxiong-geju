import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("game.html", encoding="utf-8", errors="replace").read()
i = t.find("W64_WorldState")
print("### W64_WorldState 定义 @", i)
if i>=0: print(t[i:i+900])
print()
# 市场对象
j = t.find("market:")
while j>=0:
    seg = t[max(0,j-120):j+400]
    if "base:" in seg:
        print("### market: @", j)
        print(seg[:500])
        break
    j = t.find("market:", j+1)
# w64 市场 API
for api in ["w64_marketPrice","w64_price","marketPrice","W64_market"]:
    k = t.find(api)
    print("###", api, "@", k, (t[max(0,k-100):k+260] if k>=0 else ""))
