# -*- coding: utf-8 -*-
"""b32 读 26 节点全文（含上下文）"""
import io, re, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = r"D:\1pao tuan\群雄割据"
SRC = os.path.join(ROOT, "src")
TARGETS = ["war_epilogue_3","war_after_15","war_after_33","war_after_6","war_after_26",
"world_f1_after_purge","world_f1_after_silver","world_f1_after_orc","world_f4_blood_2",
"orc_ayan_1","orc_deep_witch","orc_deep_leave","orc_deep_hunt",
"dwarf_bronze_6","dwarf_bronze_1","dwarf_deep_mine2","dwarf_deep_bard",
"elf_leaf_1","elf_leaf_3","elf_deep_mist","elf_deep_grove",
"alumni_hub","alumni_kain_3","world_f3_fat_4","world_f3_qingwu_5","sp8_ranger_00c"]

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

files = {}
for root, dirs, fns in os.walk(SRC):
    for fn in fns:
        if fn.endswith('.js'):
            files[fn] = io.open(os.path.join(root, fn), encoding="utf-8").read()

for nid in TARGETS:
    blk = None; fn = None
    for f, t in files.items():
        b = get_block(t, nid)
        if b:
            blk, fn = b, f; break
    if not blk:
        print(f"===== {nid} : NOT FOUND"); continue
    print(f"===== {nid} [{fn}] =====")
    print(blk)
    print()
