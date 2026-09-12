# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

EDITS = [
 ("src/data_nodes/dn_expand_church.js","church_deep_01","你随着人流进城","[[if:world.city=='abyss'|长街上的白袍圣战军不见了，换成了穿黑袍的巡街人。|]]"),
 ("src/data_nodes/dn_expand_church.js","church_deep_03","看得出。他笑了笑","[[if:world.city=='abyss'|朝圣者绕开了城中心，走路都贴着墙根。|]]"),
 ("src/data_nodes/dn_camp.js","fc_camp_market","集市","[[if:world.city=='church'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]"),
 ("src/data_nodes/dn_expand_south.js","south_deep_01","他在你的路引上盖了个章","[[if:world.city=='east'|税关挂上了东部王国的蓝鹰旗，过港的商船排成长队。|]]"),
 ("src/data_nodes/dn_expand_south.js","south_deep_02","阿翠看见你站在摊前","[[if:world.city=='east'|渔行里多了一队东军的采买，给价压得死低。|]]"),
 ("src/data_nodes/dn_alumni2.js","alumni_tie_2","钟楼的风灌进来","[[if:world.city=='orc'|哨塔上换成了兽人的狼旗，烽火台上堆着干柴。|]]"),
]

def insert_after_string(t, anchor, suffix):
    i = t.find(anchor)
    if i < 0: return t, False
    # 从 anchor 起点开始找字符串结束引号（anchor 前必是 " 或 \\" 开头）
    # 找 anchor 前的引号（锚点作为文本内容，前面应有未转义双引号开头）
    q = t.rfind('"', 0, i)
    if q < 0: return t, False
    # 确认 q 是字符串开头（前面是 : [ , 或 空白）
    j = q
    in_str = False; esc = False
    for k in range(q+1, len(t)):
        c = t[k]
        if esc: esc = False
        elif c == "\\": esc = True
        elif c == '"':
            # 字符串结束
            j = k
            break
    # 插入
    t = t[:j] + '",\n    "' + suffix + t[j+1:]
    # 上面破坏了原引号结构，改用标准做法：
    return t, True

report = []
for fn, nid, anchor, suffix in EDITS:
    t = open(fn, encoding="utf-8").read()
    i = t.find(anchor)
    if i < 0:
        report.append(("MISS-ANCHOR", fn, nid)); continue
    # 找到 anchor 所在字符串的结束引号（anchor 后最近的未转义 "，且之后是 , 或 ] 或 空白）
    esc = False
    endq = -1
    for k in range(i+len(anchor), len(t)):
        c = t[k]
        if esc: esc = False
        elif c == "\\": esc = True
        elif c == '"':
            endq = k; break
    if endq < 0:
        report.append(("MISS-ENDQ", fn, nid)); continue
    t = t[:endq] + '",\n    "' + suffix + t[endq+1:]
    open(fn, "w", encoding="utf-8", newline="").write(t)
    report.append(("OK", fn, nid))
for r in report:
    print(r)
