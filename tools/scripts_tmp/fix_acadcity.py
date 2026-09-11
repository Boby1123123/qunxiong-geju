# -*- coding: utf-8 -*-
import io
ROOT = r"D:\1pao tuan\群雄割据"
p = ROOT + r"\src\data_nodes\dn_expand_acadcity.js"
t = io.open(p, encoding="utf-8").read()
# 语法修复
t = t.replace("],options[", "],options:[")
# 治理词修复
fixes = [
  ("他喃喃，随即皱眉，这个图样……我在星图里见过", "他自言自语，眉心拧成一个结：“这个图样……我在星图里见过"),
  ("他见你看他，微微摇了摇头", "他见你看他，摇了摇头"),
  ("你不由得加快脚步", "你的脚步紧了一紧，快了起来"),
]
for a, b in fixes:
    if a in t:
        t = t.replace(a, b)
    else:
        print("NOT FOUND:", a[:40])
io.open(p, "w", encoding="utf-8", newline="").write(t)
# 验证
WORDS = ["微微","轻轻","缓缓","低声","嘴角","目光","片刻","仿佛","似乎","眼底","心头",
         "喃喃","沉吟","皱眉","深吸","良久","微叹","眸光","身形一闪","不由","下意识",
         "微微一怔","淡淡道","沉声道","轻声道","若有所思","不动声色","隐隐","隐约","些许"]
for w in WORDS:
    n = t.count(w)
    if n:
        for i, line in enumerate(t.splitlines(), 1):
            if w in line:
                print("WORD", w, "line", i, ":", line.strip()[:70])
print("done")
