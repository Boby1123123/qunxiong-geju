# -*- coding: utf-8 -*-
import io, re
t = io.open(r"D:\1pao tuan\群雄割据\src\script_02.js", encoding='utf-8').read()
for kw in ['west','desert','church','east','seal','purge','silver','orc','academy','north']:
    ids = re.findall(r'N\["(' + kw + r'[^"]*)\"\]', t)
    cand = [x for x in ids if any(k in x for k in ['entry','start','begin','road','arrive','gate','main'])]
    print(kw, '->', sorted(set(cand))[:8])
