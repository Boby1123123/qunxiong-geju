import sys, io, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
pats = {"铁门关":"wf_tiebigate", "北境王都":"wf_tiebigate", "圣辉城":"wf_abyss", "交汇城":"wf_purge", "灰港":"wf_purge", "商会城":"wf_silverroad", "港口城":"wf_silverroad", "承天城":"wf_silverroad", "黑石":"wf_orc"}
hits = {}
for fn in glob.glob("src/data_nodes/*.js"):
    t = open(fn, encoding="utf-8", errors="replace").read()
    for m in re.finditer(r'N\[["\']([a-zA-Z0-9_]+)["\']\]\s*=\s*\{[^{}]*?place:\s*["\']([^"\']*?)["\']', t):
        nid, place = m.group(1), m.group(2)
        for p, wf in pats.items():
            if p in place and len(place) < 30:
                key = wf+"|"+p
                if key not in hits:
                    hits[key] = []
                if len(hits[key]) < 3:
                    hits[key].append((nid, place, fn.split("\\")[-1]))
for k, v in hits.items():
    print(k, "::", v)
