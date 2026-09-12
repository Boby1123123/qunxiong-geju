import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/data_nodes/dn_alumni2.js", encoding="utf-8", errors="replace").read()
m = re.search(r'N\[["\']alumni_tie_2["\']\]\s*=\s*\{', t)
print(t[m.end():m.end()+700])
