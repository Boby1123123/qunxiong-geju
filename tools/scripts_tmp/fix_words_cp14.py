# -*- coding: utf-8 -*-
import io
ROOT = r"D:\1pao tuan\群雄割据"
fixes = {
 "dn_expand_gold.js": [
   ("秤杆微微发亮——像是新擦过的", "秤杆泛着光——像是新擦过的"),
   ("铜秤轻轻晃了晃", "铜秤晃了晃"),
   ("听见前面两个掌柜在低声议论", "听见前面两个掌柜凑在一起咬耳朵"),
   ("弯腰低声道：“贵客", "弯腰压着嗓门说：“贵客"),
   ("陆先生眼镜片后的目光动了动", "陆先生眼镜片后的视线动了动"),
   ("{t:\"（不动声色，只问收秤的人是谁）", "{t:\"（不接他的话，只问收秤的人是谁）"),
 ],
 "dn_expand_moxie.js": [
   ("气囊在风里微微鼓起", "气囊在风里鼓起来"),
   ("在铭文的‘称’字上，轻轻刮了几下", "在铭文的‘称’字上，刮了几下"),
   ("退后两步，端详片刻", "退后两步，端详了一阵"),
 ],
}
for fn, pairs in fixes.items():
    p = ROOT + r"\src\data_nodes" + "\\" + fn
    t = io.open(p, encoding="utf-8").read()
    for a, b in pairs:
        if a not in t:
            print("NOT FOUND in", fn, ":", a[:40])
        t = t.replace(a, b)
    io.open(p, "w", encoding="utf-8", newline="").write(t)
print("done")
