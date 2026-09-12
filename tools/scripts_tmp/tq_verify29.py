# -*- coding: utf-8 -*-
"""TQ-2/3 b29：初验（字数/段间重复 LCS/治理词）"""
import io, re, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
ROOT = r"D:\1pao tuan\群雄割据\src"
TARGETS = ["ending_anchor_seal_1","ending_anchor_goldscale_3","ending_anchor_open_1","grad_stay_1","grad_army_6","grad_home_7","grad_y1_end_4","grad_y2_end_3","alumni_cecy_2","world_academy_m2","war_after_35","goal_fame_p3","goal_intro_guard","goal_revenge_p1","acad_apothecary_3","acad_hometown_2","east_chengtian_old","failpath_winter_2","hub_deep_10","desert_deep_32","west_life2_05","south_deep_12","church_deep_24","north_aierda_deep_25","gangkou_deep_25","acad_tie_3"]
BAD = ["微微","轻轻","缓缓","低声","嘴角","目光","片刻","仿佛","似乎","眼底","心头","喃喃","沉吟","皱眉","深吸","良久","微叹","眸光","身形一闪","不由","下意识","微微一怔","淡淡道","沉声道","轻声道","若有所思","不动声色","隐隐","隐约","些许"]
def block(t, nid):
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
def lcs(a, b):
    la, lb = len(a), len(b)
    dp = [[0]*(lb+1) for _ in range(la+1)]
    best = 0; pos = 0
    for i in range(1, la+1):
        for j in range(1, lb+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > best:
                    best = dp[i][j]; pos = i
            else:
                dp[i][j] = 0
    return best, a[pos-best:pos]
idx = {}
for root, dirs, fns in os.walk(ROOT):
    for fn in fns:
        p = os.path.join(root, fn)
        t = io.open(p, encoding="utf-8").read()
        for nid in TARGETS:
            if nid not in idx and re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*\{', t):
                idx[nid] = (fn, t)
issues = 0; total = 0
for nid in TARGETS:
    fn, t = idx[nid]
    blk = block(t, nid)
    tm = re.search(r'text\s*:\s*\[', blk)
    t0 = tm.end()
    tail = re.search(r'\](?=\s*,?\s*(?:options|pace))', blk[t0:])
    arr = blk[t0:t0+tail.start()]
    strs = [s[1:-1] for s in re.findall(r'"(?:[^"\\]|\\.)*"', arr)]
    n = sum(len(s) for s in strs); total += n
    bad_pair = None
    for i in range(len(strs)):
        for j in range(i+1, len(strs)):
            b, sub = lcs(strs[i], strs[j])
            if b >= 14:
                bad_pair = (i, j, b, sub)
    w = [x for x in BAD if x in "".join(strs)]
    flag = "OK" if (n >= 300 and not bad_pair and not w) else "CHECK"
    if flag == "CHECK": issues += 1
    extra = ""
    if bad_pair: extra += f" REPEAT{str(bad_pair)}"
    if w: extra += f" WORDS{w}"
    print(f"{nid} [{fn}]: {len(strs)}段 {n}字 {flag}{extra}")
print(f"== total chars: {total}, issues: {issues} ==")
