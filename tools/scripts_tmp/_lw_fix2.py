# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
FIXES = [
 ("src/data_nodes/dn_expand_church.js", '"[[if:world.city==\'abyss\'|长街上的白袍圣战军不见了，换成了穿黑袍的巡街人。|]]', '"[[if:world.city==\'abyss\'|长街上的白袍圣战军不见了，换成了穿黑袍的巡街人。|]]"'),
 ("src/data_nodes/dn_expand_church.js", '"[[if:world.city==\'abyss\'|朝圣者绕开了城中心，走路都贴着墙根。|]]', '"[[if:world.city==\'abyss\'|朝圣者绕开了城中心，走路都贴着墙根。|]]"'),
 ("src/data_nodes/dn_camp.js", '"[[if:world.city==\'church\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]', '"[[if:world.city==\'church\'|集市上多了穿灰袍的审判官，摊贩们话都少了许多。|]]"'),
 ("src/data_nodes/dn_expand_south.js", '"[[if:world.city==\'east\'|税关挂上了东部王国的蓝鹰旗，过港的商船排成长队。|]]', '"[[if:world.city==\'east\'|税关挂上了东部王国的蓝鹰旗，过港的商船排成长队。|]]"'),
 ("src/data_nodes/dn_expand_south.js", '"[[if:world.city==\'east\'|渔行里多了一队东军的采买，给价压得死低。|]]', '"[[if:world.city==\'east\'|渔行里多了一队东军的采买，给价压得死低。|]]"'),
 ("src/data_nodes/dn_alumni2.js", '"[[if:world.city==\'orc\'|哨塔上换成了兽人的狼旗，烽火台上堆着干柴。|]]', '"[[if:world.city==\'orc\'|哨塔上换成了兽人的狼旗，烽火台上堆着干柴。|]]"'),
]
for fn, bad, good in FIXES:
    t = open(fn, encoding="utf-8").read()
    n = t.count(bad)
    t = t.replace(bad, good)
    open(fn, "w", encoding="utf-8", newline="").write(t)
    print(fn, "fixed", n)
