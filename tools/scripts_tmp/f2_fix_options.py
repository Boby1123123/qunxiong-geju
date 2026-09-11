# -*- coding: utf-8 -*-
"""Fix quayside_3 missing options + verify every node has options."""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
p = r'D:\1pao tuan\群雄割据\src\data_nodes\dn_failpath2.js'
t = open(p, encoding='utf-8').read()

# 1) fix quayside_3
old = 'N["failpath_quayside_3"] = {tag:"branch", place:"\u6e21\u53e3 \u00b7 \u4e1c\u4ed3\u6697\u5904", where:"\u9ed1\u591c", pace:"normal",\n text:[\n  "\u8fdb\u6765\u7684\u662f\u4e2a\u7a7f\u9ed1\u6597\u7bf7\u7684\u4eba'
i = t.find('N["failpath_quayside_3"]')
seg_end = t.find('\nN["', i+10)
seg_end = seg_end if seg_end > 0 else len(t)
seg = t[i:seg_end]
print('seg head:', repr(seg[:80]))
if 'options:' not in seg:
    # append options before closing };
    seg_new = seg.replace('\n};', ',\n options:[\n  {t:"\uff08\u542c\u8001\u90ed\u8bf4\u5b8c\uff09",effects:{flag:"f_f2_quay_goldscale"},go:"failpath_quayside_4"}\n ]\n};', 1)
    t = t[:i] + seg_new + t[seg_end:]
    print('quayside_3 options added')

# 2) verify every node has options
ids = re.findall(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t)
missing = []
for m in re.finditer(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t):
    nid = m.group(1)
    s = m.start()
    e = re.search(r'\nN\["', t[s+5:])
    e = s + 5 + e.start() if e else len(t)
    seg = t[s:e]
    if 'options:' not in seg:
        missing.append(nid)
print('nodes:', len(ids), 'missing options:', missing)
open(p, 'w', encoding='utf-8', newline='\n').write(t)
print('written')
