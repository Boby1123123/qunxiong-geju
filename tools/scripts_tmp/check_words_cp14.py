# -*- coding: utf-8 -*-
import io
ROOT = r"D:\1pao tuan\群雄割据"
WORDS = ["微微","轻轻","缓缓","低声","嘴角","目光","片刻","仿佛","似乎","眼底","心头",
         "喃喃","沉吟","皱眉","深吸","良久","微叹","眸光","身形一闪","不由","下意识",
         "微微一怔","淡淡道","沉声道","轻声道","若有所思","不动声色","隐隐","隐约","些许"]
for fn in ["dn_expand_gold.js", "dn_expand_moxie.js"]:
    p = ROOT + r"\src\data_nodes" + "\\" + fn
    t = io.open(p, encoding="utf-8").read()
    for w in WORDS:
        n = t.count(w)
        if n:
            # 定位行
            for i, line in enumerate(t.splitlines(), 1):
                if w in line:
                    print(fn, w, n, "line", i, ":", line.strip()[:60])
