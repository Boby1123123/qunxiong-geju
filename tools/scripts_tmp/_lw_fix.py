# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# 1) 修复 fc_camp_market 错误插入
fn = "src/data_nodes/dn_camp.js"
t = open(fn, encoding="utf-8").read()
bad = '",\n    "[[if:world.city==\'\'\'church\'\'\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]'
# 实际坏串（含中文）：{ t: "（去集市看看行情）",     "[[if...]]", go: ... }
bad_full = '  { t: "（去集市看看行情）",     "[[if:world.city==\'church\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]", go: "fc_camp_market" }'
good_full = '  { t: "（去集市看看行情）", go: "fc_camp_market" }'
if bad_full in t:
    t = t.replace(bad_full, good_full)
    print("FIX-OPTIONS OK")
else:
    # 宽松修复：去掉 ", go 前的错误插串
    m = re.search(r'\{\s*t:\s*"（去集市看看行情）",\s*"\[\[if:world\.city==\'church\'\|[^"|]+\|[^"|]+\|\]\]",\s*go:', t)
    if m:
        seg = m.group(0)
        fixed = seg.replace('",\n    "[[if:world.city==\'church\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]"', '')
        t = t.replace(seg, fixed)
        print("FIX-OPTIONS-REGEX OK")
    else:
        # 直接按锚点修
        i = t.find("[[if:world.city=='church'|集市上多了")
        if i>=0:
            # 找到这段开始的 \"[[if 和结束的 ]]\"
            j = t.rfind('"', 0, i)  # 错误插入的起始引号
            k = t.find(']]', i) + 2
            # 移除 t[j:k+1]（含错误串及尾引号），并修复其后残留
            t = t[:j] + t[k+1:]
            print("FIX-ANCHOR OK")
        else:
            print("FIX FAIL - not found")
# 在 default 数组末尾正确插入（末段锚点：你在街角停下）
anchor = "你在街角停下，把兜帽压了压。这座城市记得你做过的事"
i = t.find(anchor)
if i >= 0:
    # 找该字符串结束引号
    endq = -1; esc = False
    for k in range(i+len(anchor), len(t)):
        c = t[k]
        if esc: esc = False
        elif c == "\\": esc = True
        elif c == '"': endq = k; break
    if endq >= 0:
        t = t[:endq] + '",\n        "[[if:world.city==\'church\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]' + t[endq+1:]
        print("INSERT-OK")
open(fn, "w", encoding="utf-8", newline="").write(t)

# 2) 补插 church_deep_03
fn2 = "src/data_nodes/dn_expand_church.js"
t2 = open(fn2, encoding="utf-8").read()
anchor2 = "就是圣像底下的影子，也分长短"
i2 = t2.find(anchor2)
if i2 >= 0:
    endq = -1; esc = False
    for k in range(i2+len(anchor2), len(t2)):
        c = t2[k]
        if esc: esc = False
        elif c == "\\": esc = True
        elif c == '"': endq = k; break
    if endq >= 0:
        t2 = t2[:endq] + '",\n    "[[if:world.city==\'abyss\'|朝圣者绕开了城中心，走路都贴着墙根。|]]' + t2[endq+1:]
        print("INSERT2-OK")
open(fn2, "w", encoding="utf-8", newline="").write(t2)
