# -*- coding: utf-8 -*-
"""F-2: scan nodes with check+tier options to pick fail mount points."""
import io, re, glob, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

rows = []
for f in sorted(glob.glob('src/**/*.js', recursive=True)):
    t = open(f, encoding='utf-8', errors='ignore').read()
    for m in re.finditer(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*\{', t):
        nid = m.group(1)
        start = m.end()
        seg = t[start:start + 1500]
        if 'check:' in seg and 'tier:' in seg:
            opts = re.findall(r't:"([^"]{4,30})"', seg)
            rows.append((nid, f.replace('\\', '/').split('/')[-1], len(opts), opts[:3]))

for r in rows:
    print(r[0], '|', r[1], '| opts', r[2], '|', r[3])
print('TOTAL', len(rows))
