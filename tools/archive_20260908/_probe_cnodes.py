# -*- coding: utf-8 -*-
import io, re, sys
sys.path.insert(0, r'D:\1pao tuan\群雄割据\tools\eldacheck')
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
PAT = re.compile(r'N\["([^"]+)"\]\s*=\s*function\s*\([^)]*\)\s*\{')
targets = ('realm_godfavor', 'event_hub', 'letter_read', 'disaster_trigger_blood_rain')
for m in PAT.finditer(d):
    nid = m.group(1)
    if nid not in targets:
        continue
    start = m.end()
    depth = 0; i = start; n = len(d); in_str = None
    while i < n:
        c = d[i]
        if in_str:
            if c == '\\': i += 2; continue
            if c == in_str: in_str = None
            i += 1; continue
        if c in ('"', "'", '`'): in_str = c
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: break
        i += 1
    body = d[start:i]
    has = re.search(r'\btext\s*:\s*(function\s*\(|\[)', body)
    mm = re.search(r'\btext\s*:', body)
    print(nid, '| 正则命中:', bool(has), '| body长', len(body))
    print('   text段:', body[mm.start():mm.start()+50].replace('\n', ' ') if mm else '无')
