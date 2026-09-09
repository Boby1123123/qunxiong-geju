# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
ids = ['realm_godfavor','event_hub','letter_read','disaster_trigger_blood_rain']
for nid in ids:
    m = re.search(r'N\["%s"\]\s*=\s*function\s*\(' % nid, d)
    print('='*12, nid, '='*12)
    if not m: print('未找到'); continue
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
    body = d[m.start():i+1]
    # 找 text 相关行
    print('总长', len(body))
    for mm in re.finditer(r'text\s*:', body):
        print('  text at', mm.start(), ':', body[mm.start():mm.start()+80].replace('\n',' '))
    for mm in re.finditer(r'options\s*:', body):
        print('  options at', mm.start(), ':', body[mm.start():mm.start()+60].replace('\n',' '))
    # 打印 return 段
    rm = re.search(r'return\s*\{', body)
    if rm:
        print('  return段:', body[rm.start():rm.start()+300].replace('\n',' '))
    print()
