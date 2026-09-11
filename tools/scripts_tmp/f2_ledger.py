# -*- coding: utf-8 -*-
"""F-2: append 19 ledger entries to dn_causality.js"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
p = r'D:\1pao tuan\群雄割据\src\data_nodes\dn_causality.js'
t = open(p, encoding='utf-8').read()

entries = [
 ("led_f2_purge", "圣痕司追查的牛皮账旁叠出费尔曼名录“7”（F-2 failpath_purge）", "flag:f_f2_purge_ferman", "vol_church"),
 ("led_f2_seal", "封印台基被挖动时，深处另有一双“记忆”（F-2 failpath_seal）", "flag:f_f2_seal_touched", "vol_abyss"),
 ("led_f2_silver", "柳巷七号货单：灰袍胖子的货线连着北境（F-2 failpath_silver）", "node:failpath_silver_3", "vol_north"),
 ("led_f2_orc", "兽人渡口老兵的“狼语”：灰鬃旧部的信物（F-2 failpath_orc）", "flag:f_f2_orc_wolfword", "vol_race"),
 ("led_f2_tribunal", "大审判长书案第三格的旧案卷：异端地窖闻姓档案吏手里的金秤家谱抄本（F-2 failpath_tribunal/支线B）", "flag:f_f2_heretic_ledger", "vol_church"),
 ("led_f2_caravan", "沙盗抢货中丢的一只箱子：里头是给北境的信（F-2 failpath_caravan）", "flag:f_f2_caravan_market", "vol_desert"),
 ("led_f2_keju", "灰袍考生袖口的东境官印：晨天旧族后人迹象（F-2 failpath_keju）", "flag:f_f2_keju_chen", "vol_east"),
 ("led_f2_westranger", "若耶追查的红绳线：西境私线贩货（F-2 failpath_westranger）", "flag:f_f2_west_ruoye", "vol_war"),
 ("led_f2_elftower", "精灵塔门结界反噬时的“第七枚锚”传闻（F-2 failpath_elftower）", "flag:f_f2_elf_seven", "vol_elf"),
 ("led_f2_dwarfmine", "矿道深处的“凿痕”：矮人祖先离开前的标记（F-2 failpath_dwarfmine）", "flag:f_f2_dwarf_mine", "vol_dwarf"),
 ("led_f2_courier", "第三哨换防名单里夹的密条（F-2 failpath_courier）", "flag:f_f2_courier_mark", "vol_north"),
 ("led_f2_sewer", "下水道阵纹下的旧渠：金秤家旧账的走私通道（F-2 failpath_sewer）", "flag:f_f2_sewer_goldscale", "vol_free"),
 ("led_f2_bandit", "雷击木里的钱庄火漆：弹益盗贼背后的钱路（F-2 failpath_bandit）", "flag:f_f2_bandit_badge", "vol_free"),
 ("led_f2_realm", "破境失败后的丹田旧伤：修行线后续（F-2 failpath_realm）", "flag:f_f2_realm_fail", "vol_free"),
 ("led_f2_vault", "学院金库失窃的铁牌：莫里茨临终托付的入口（F-2 failpath_vault）", "flag:f_f2_vault_mori", "vol_academy"),
 ("led_f2_flood", "洪水冲出的上游铁箱：渡口老郭的“第一次送货”（F-2 failpath_flood）", "node:failpath_flood_3", "vol_free"),
 ("led_f2_market", "黑市独眼的“金秤旧货”：七锚线索（F-2 支线A）", "flag:f_f2_market_anchor", "vol_free"),
 ("led_f2_heretic", "异端地窖的闻姓档案吏：金秤家谱抄本（F-2 支线B）", "flag:f_f2_heretic_ledger", "vol_church"),
 ("led_f2_quay", "老郭的黑箱货单：“金秤旧账，故都卷，七页，送北境”（F-2 支线C）", "flag:f_f2_quay_goldscale", "vol_free"),
]

def make_entry(eid, desc, plant, world):
    return ('  {\n'
            '    "id": "%s",\n'
            '    "type": "伏笔",\n'
            '    "desc": "%s",\n'
            '    "plant": "%s",\n'
            '    "reap": "",\n'
            '    "status": "open",\n'
            '    "world": "%s",\n'
            '    "importance": 3,\n'
            '    "keywords": ["%s"],\n'
            '    "irreversible": false\n'
            '  }') % (eid, desc, plant, world, desc[:12])

anchor = '  }\n];\n\n/* ===== /v91inj:ledger:end/ ===== */'
assert anchor in t, 'ledger tail anchor not found'
block = [make_entry(*e) for e in entries]
insert = '  },\n' + ',\n'.join(block) + '\n];\n\n/* ===== /v91inj:ledger:end/ ===== */'
new = t.replace(anchor, insert, 1)
open(p, 'w', encoding='utf-8').write(new)
print('appended entries:', len(entries))
