import sys, io, re, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# 在城市关键节点找入口节点：搜 loc 或节点 id
targets = {"tiebi":"铁门关", "beijing":"北境王都", "shengcheng":"圣城", "jiaohui":"交汇城", "huigang":"灰港", "shangzhan":"商会城", "gangkou":"港口城", "chengtian":"承天城", "heishi":"黑石", "shendian":"神殿"}
for root in ["src/data_nodes"]:
    for fn in glob.glob(root+"/*.js"):
        t = open(fn, encoding="utf-8", errors="replace").read()
        for city, cn in targets.items():
            if ('"' + city + '"' in t or "'" + city + "'" in t) and cn in t:
                # 找该城市的入口节点 id（N["xxx_yyy"] 或 "xxx_city"）
                ids = re.findall(r'N\[["\']([a-z0-9_]*'+city+r'[a-z0-9_]*|'+city+r'[a-z0-9_]*)["\']\]', t)
                if ids:
                    print(fn, city, cn, "->", list(dict.fromkeys(ids))[:6])
