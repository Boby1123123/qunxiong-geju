# -*- coding: utf-8 -*-
"""提取目标节点 text 数组最后一段，作为插入锚点（只读）"""
import os, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = r"D:\1pao tuan\群雄割据"
FILE = os.path.join(ROOT, r"src\data_nodes\dn_acad_life.js")
txt = io.open(FILE, encoding="utf-8", errors="replace").read()

targets = [
    "acad_life_y1_dorm","acad_life_y1_friend","acad_life_y1_mid","acad_life_y1_final",
    "acad_life_y2_dorm","acad_life_y2_friend","acad_life_y2_mid","acad_life_y2_final",
    "acad_life_y3_dorm","acad_life_y3_friend","acad_life_y3_mid","acad_life_y3_final",
    "acad_life_y4_dorm","acad_life_y4_friend","acad_life_y4_mid","acad_life_y4_final",
    "acad_life_y5_dorm","acad_life_y5_friend","acad_life_y5_mid",
]

for tid in targets:
    m = re.search(r'N\["'+tid+r'"\]=[^;]+;', txt, re.S)
    if not m:
        print(f"{tid}: NOT FOUND")
        continue
    blk = m.group(0)
    # 找 text:[ ... ] 数组
    tm = re.search(r'text\s*:\s*(\[.*?\])\s*,?\s*options', blk, re.S)
    if not tm:
        print(f"{tid}: no text array")
        continue
    arr = tm.group(1)
    # 提取所有字符串段
    segs = re.findall(r'"(?:[^"\\]|\\.)*"', arr)
    # 段长
    lens = [len(s) for s in segs]
    print(f"{tid}: {len(segs)}段 总{sum(lens)} 各段:{lens}")
    if segs:
        print(f"   末段: {segs[-1][:60]}")
