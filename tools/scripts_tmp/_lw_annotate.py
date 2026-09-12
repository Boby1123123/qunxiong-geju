# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

EDITS = [
 ("src/data_nodes/dn_acad_outside.js","acad_home_6","[[if:world.city=='east'|城楼箭垛上，插的已是东军的黑底金鹰旗。|]]"),
 ("src/data_nodes/dn_acad_outside.js","acad_home_7","[[if:world.city=='east'|墙外东军的营帐连到天边，炊烟压着城墙走。|]]"),
 ("src/data_nodes/dn_expand_church.js","church_deep_01","[[if:world.city=='abyss'|长街上的白袍圣战军不见了，换成了穿黑袍的巡街人。|]]"),
 ("src/data_nodes/dn_expand_church.js","church_deep_03","[[if:world.city=='abyss'|朝圣者绕开了城中心，走路都贴着墙根。|]]"),
 ("src/data_nodes/dn_acad_outside.js","acad_home_2","[[if:world.city=='church'|城门口盘查的是白袍的圣战军，腰刀比话还多。|]]"),
 ("src/data_nodes/dn_camp.js","fc_camp_market","[[if:world.city=='church'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]"),
 ("src/data_nodes/dn_expand_south.js","south_deep_01","[[if:world.city=='east'|税关挂上了东部王国的蓝鹰旗，过港的商船排成长队。|]]"),
 ("src/data_nodes/dn_expand_south.js","south_deep_02","[[if:world.city=='east'|渔行里多了一队东军的采买，给价压得死低。|]]"),
 ("src/data_nodes/dn_alumni2.js","alumni_tie_2","[[if:world.city=='orc'|哨塔上换成了兽人的狼旗，烽火台上堆着干柴。|]]"),
 ("src/data_nodes/dn_desert.js","arrive_desert_lvzhou","[[if:world.city=='church'|集市城门口立着教会的圣徽旗，进城要先过一道白袍的盘查。|]]"),
]

def find_array_end(txt, start):
    """从 start（'[' 后一位）括号配平到数组结束下标（']'）"""
    depth = 0; in_str = False; esc = False
    for j in range(start, len(txt)):
        c = txt[j]
        if in_str:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': in_str = False
        else:
            if c == '"': in_str = True
            elif c == "[": depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0: return j
    return -1

report = []
for fn, nid, suffix in EDITS:
    t = open(fn, encoding="utf-8").read()
    m = re.search(r'N\[["\']'+nid+r'["\']\]\s*=\s*\{', t)
    if not m:
        report.append(("MISS-NODE", fn, nid)); continue
    body_start = m.end()
    # 找 text 数组：text:[ 或 default:[（在 body 内第一个 options: 之前）
    opts = t.find("options:", body_start)
    opts = opts if opts > 0 else len(t)
    tm = re.search(r'(?:text|default)\s*:\s*\[', t[body_start:opts])
    if not tm:
        report.append(("MISS-ARR", fn, nid)); continue
    arr_start = body_start + tm.end() - 1  # 指向 '['
    arr_end = find_array_end(t, arr_start + 1)
    if arr_end < 0:
        report.append(("MISS-END", fn, nid)); continue
    # 数组内容（arr_start+1 到 arr_end）
    inner = t[arr_start + 1:arr_end].strip()
    if inner:
        insert = ',\n    "' + suffix + '"'
    else:
        insert = '"' + suffix + '"'
    t = t[:arr_end] + insert + t[arr_end:]
    open(fn, "w", encoding="utf-8", newline="").write(t)
    report.append(("OK", fn, nid))
for r in report:
    print(r)
