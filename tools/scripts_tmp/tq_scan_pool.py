# -*- coding: utf-8 -*-
"""扫描全部节点字数，输出 <300 字薄节点清单（按文件分组）"""
import io, re, os, sys, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
SRC = r"D:\1pao tuan\群雄割据\src"

def extract_text_array(blk):
    tm = re.search(r'text\s*:\s*\[', blk)
    if not tm: return None, None
    i = tm.end(); depth = 1; segs = []
    while i < len(blk):
        c = blk[i]
        if c == '"':
            i += 1; s = []
            while i < len(blk):
                if blk[i] == '\\': i += 2; continue
                if blk[i] == '"': break
                s.append(blk[i]); i += 1
            segs.append(''.join(s)); i += 1; continue
        elif c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0: break
        i += 1
    return segs, tm.group(0)

def find_block(t, nid):
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*\{', t)
    if not m: return None
    start = m.start(); d = 0; i = m.end() - 1
    while i < len(t):
        if t[i] == '{': d += 1
        elif t[i] == '}':
            d -= 1
            if d == 0:
                end = t.find(';', i); break
        i += 1
    return t[start:end]

def node_len(blk):
    segs, _ = extract_text_array(blk)
    if segs is None: return -1
    return sum(len(s) for s in segs)

nodes = []
for root, dirs, fns in os.walk(SRC):
    for f in sorted(fns):
        if not f.endswith('.js') or not f.startswith('dn_'): continue
        p = os.path.join(root, f)
        t = io.open(p, encoding="utf-8").read()
        for m in re.finditer(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t):
            nid = m.group(1)
            blk = find_block(t, nid)
            if not blk: continue
            n = node_len(blk)
            if n >= 0:
                nodes.append((nid, n, f))

thin = [x for x in nodes if x[1] < 300]
thin.sort(key=lambda x: (x[1], x[0]))
print(f"总节点: {len(nodes)} | 薄节点(<300字): {len(thin)}")
print()
# 按文件分组
byfile = {}
for nid, n, f in thin:
    byfile.setdefault(f, []).append((nid, n))
for f in sorted(byfile, key=lambda k: -len(byfile[k])):
    print(f"{f}: {len(byfile[f])} 个")
    for nid, n in byfile[f]:
        print(f"  {nid} ({n}字)")
print()
# 输出完整清单供脚本使用
json.dump(thin, open(r"D:\1pao tuan\群雄割据\tools\scripts_tmp\thin_pool.json", "w", encoding="utf-8"), ensure_ascii=False)
print("saved: thin_pool.json")
