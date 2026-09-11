# -*- coding: utf-8 -*-
import io, glob, os
ROOT = r"D:\1pao tuan\群雄割据"
keys = ["fc_road_north","north_academy_gate","board_south","south_silver_front",
        "south_goldscale","moxie_guild","moxie_workshop","xueshu_mill",
        "xueshu_bookshop","fc_tavern","fc_guild","act_rest"]
# 扫全部 src（含 data_nodes）
for f in glob.glob(ROOT + r"\src\**\*.js", recursive=True):
    t = io.open(f, encoding="utf-8").read()
    for k in keys:
        if ('N["' + k + '"]') in t:
            print(k, "FOUND in", os.path.relpath(f, ROOT))
