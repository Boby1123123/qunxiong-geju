import sys, io, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
pats = {"王都":"wf_tiebigate", "商会":"wf_silverroad", "银穗":"wf_silverroad"}
hits = {}
for fn in glob.glob("src/data_nodes/*.js"):
    t = open(fn, encoding="utf-8", errors="replace").read()
    for m in re.finditer(r'N\[["\']([a-zA-Z0-9_]+)["\']\]\s*=\s*\{[^{}]*?place:\s*["\']([^"\']*?)["\']', t):
        nid, place = m.group(1), m.group(2)
        for p, wf in pats.items():
            if p in place and len(place) < 34:
                key = wf+"|"+p
                if key not in hits:
                    hits[key] = []
                if len(hits[key]) < 4:
                    hits[key].append((nid, place, fn.split("\\")[-1]))
for k, v in hits.items():
    print(k, "::", v)
