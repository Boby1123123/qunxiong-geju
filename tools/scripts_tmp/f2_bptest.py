# -*- coding: utf-8 -*-
import io, sys, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
h = open(r'D:\1pao tuan\群雄割据\game_built.html', encoding='utf-8', errors='replace').read()
m = re.search(r'window\.STORY_BLUEPRINT', h)
print('window.STORY_BLUEPRINT found at:', m.start() if m else None)
if m:
    print('context:', h[m.start()-60:m.start()+90].replace('\n', ' ')[:150])
    i = h.index('{', m.start())
    depth = 0; in_str = False; esc = False; j = i
    while j < len(h):
        c = h[j]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
        j += 1
    print('balanced end at:', j, 'seg len:', j - i + 1)
    seg = h[i:j+1]
    seg2 = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)
    seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg2)
    try:
        json.loads(seg2)
        print('JSON parse OK')
    except Exception as e:
        print('JSON parse FAIL:', str(e)[:300])
        # find the offending area
        bad = str(e)
        mm = re.search(r'line (\d+) column (\d+)', bad)
        if mm:
            ln = int(mm.group(1)); col = int(mm.group(2))
            lines = seg2.split('\n')
            if ln-2 <= len(lines):
                print('around line %d:' % ln)
                for k in range(max(0,ln-2), min(len(lines), ln+1)):
                    print('  %d: %s' % (k+1, lines[k][:160]))
