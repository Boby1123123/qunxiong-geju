# -*- coding: utf-8 -*-
"""TQ-2/3 b29：读取 26 节点现状全文"""
import io, re, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = r"D:\1pao tuan\群雄割据\src"
TARGETS = [
"ending_anchor_seal_1","ending_anchor_goldscale_3","ending_anchor_open_1","ending_anchor_transcend_2",
"grad_stay_1","grad_roam_4","grad_army_6","grad_home_7","grad_y1_end_4","grad_y2_end_3",
"alumni_kain_5","alumni_alice_3","alumni_cecy_2",
"world_academy_m2","war_after_35","war_epilogue_10",
"goal_fame_p3","goal_free_2","goal_intro_guard","goal_revenge_p1",
"acad_visit_east","acad_apothecary_3","acad_hometown_2",
"east_chengtian_old","failpath_winter_2","hub_deep_10",
]
idx = {}
for root, dirs, fns in os.walk(ROOT):
    for fn in fns:
        if not fn.endswith(".js"): continue
        p = os.path.join(root, fn)
        t = io.open(p, encoding="utf-8").read()
        for nid in TARGETS:
            if nid not in idx and re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*\{', t):
                idx[nid] = (fn, t)
for nid in TARGETS:
    if nid not in idx:
        print(f"!!!! {nid} NOT FOUND"); continue
    fn, t = idx[nid]
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*\{', t)
    d = 0; i = m.end() - 1
    while i < len(t):
        if t[i] == '{': d += 1
        elif t[i] == '}':
            d -= 1
            if d == 0:
                e = t.find(';', i); break
        i += 1
    blk = t[m.start():e]
    tm = re.search(r'text\s*:\s*\[', blk)
    t0 = tm.end()
    tail = re.search(r'\](?=\s*,?\s*(?:options|pace))', blk[t0:])
    arr = blk[t0:t0+tail.start()]
    strs = [s[1:-1] for s in re.findall(r'"(?:[^"\\]|\\.)*"', arr)]
    print(f"===== {nid} [{fn}] {len(strs)}段 {sum(len(s) for s in strs)}字 =====")
    for i, s in enumerate(strs):
        print(f"  [{i}] {s}")
    print()
