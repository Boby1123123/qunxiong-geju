import sys, io, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# 找入口文本节点：搜“来到铁门关”“铁门关”在 N[ 节点 text 中
pats = ["铁门关", "北境王都", "圣辉城", "交汇城", "灰港", "商会城", "港口城", "承天城", "黑石", "神殿"]
for fn in glob.glob("src/data_nodes/*.js"):
    t = open(fn, encoding="utf-8", errors="replace").read()
    # 找 N[ "id" ] = { ... text:"...铁门关..."
    for m in re.finditer(r'N\[["\']([a-zA-Z0-9_]+)["\']\]\s*=\s*\{', t):
        nid = m.group(1)
        seg = t[m.end():m.end()+900]
        for p in pats:
            if p in seg and ("text:" in seg[:200]):
                print(fn.split("\\")[-1], nid, "::", p, "::", seg[:80].replace(chr(10)," "))
                break
