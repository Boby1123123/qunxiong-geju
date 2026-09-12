# -*- coding: utf-8 -*-
"""b32 选区：扫描 src/data_nodes/chunks 三目录，找 <300 字未扩节点候选（排除 b29-b31 已扩）"""
import io, re, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = r"D:\1pao tuan\群雄割据"
DIRS = [os.path.join(ROOT, "src"), os.path.join(ROOT, "src", "data_nodes"), os.path.join(ROOT, "chunks")]

DONE = set()  # b29-b31 已扩
for f in [r"backup\scripts_archive\tmp\tq31_20260912", r"backup\scripts_archive\tmp\tq30_20260912", r"backup\scripts_archive\tmp\tq29_20260912"]:
    for fn in os.listdir(f) if os.path.isdir(f) else []:
        if fn.startswith("tq_read3") and fn.endswith(".out.txt"):
            try:
                for line in io.open(os.path.join(f, fn), encoding="utf-8"):
                    m = re.match(r'==+\s*(\S+)', line)
                    if m: DONE.add(m.group(1))
            except Exception:
                pass

def get_block(t, nid):
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

def seg_chars(blk):
    tm = re.search(r'text\s*:\s*\[', blk)
    if not tm: return None, None
    seg_txt = blk[tm.end():]
    endm = seg_txt.find(']')
    segs = []
    for s in re.findall(r'"((?:[^"\\]|\\.)*)"', seg_txt[:endm]):
        segs.append(s)
    if not segs: return None, None
    return len(segs), sum(len(re.sub(r'\s', '', s)) for s in segs)

cands = []
files = {}
for d in DIRS:
    for root, dirs, fns in os.walk(d):
        for fn in fns:
            if fn.endswith('.js'):
                files[fn] = os.path.join(root, fn)

for fn, p in files.items():
    t = io.open(p, encoding="utf-8").read()
    for m in re.finditer(r'N\["([a-z0-9_]+)"\]\s*=\s*\{', t):
        nid = m.group(1)
        if nid in DONE: continue
        if not re.match(r'^(acad_|arrive_|desert_|east_|fc_|frontier_|grad_|goal_|north_|west_|church_|tm_|i_watchmen_|i_bond_|world_|war_|alumni_|anchor_|ending_|purge_|silver_|seal_|elf_|dwarf_|orc_|sp8_|free_|city_|combat_|dungeon_)', nid): continue
        blk = get_block(t, nid)
        if not blk: continue
        n, c = seg_chars(blk)
        if n is None or n < 3: continue
        if c >= 300: continue
        cands.append((c, nid, fn))

cands.sort()
print(f"candidates <300字: {len(cands)}")
for c, nid, fn in cands[:200]:
    print(f"{c:4d}  {nid:32s} {fn}")
