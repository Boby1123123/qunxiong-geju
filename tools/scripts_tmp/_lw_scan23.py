import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
nodes = [("dn_acad_outside.js","acad_home_6"),("dn_acad_outside.js","acad_home_7"),("dn_expand_church.js","church_deep_01"),("dn_expand_church.js","church_deep_03"),("dn_acad_outside.js","acad_home_2"),("dn_camp.js","fc_camp_market"),("dn_expand_south.js","south_deep_01"),("dn_expand_south.js","south_deep_02"),("dn_alumni2.js","alumni_tie_2"),("dn_desert.js","arrive_desert_lvzhou")]
for fn, nid in nodes:
    t = open("src/data_nodes/"+fn, encoding="utf-8", errors="replace").read()
    m = re.search(r'N\[["\']'+nid+r'["\']\]\s*=\s*\{', t)
    if not m: print("MISS", fn, nid); continue
    seg = t[m.end():m.end()+1200]
    # 找 text 数组尾：text: [ ... ] 或 text: "..."
    tm = re.search(r'text:\s*\[', seg)
    if not tm:
        tm2 = re.search(r'text:\s*["\']', seg)
        print("TXT-KIND", fn, nid, "string" if tm2 else "obj?", seg[:100].replace(chr(10)," "))
        continue
    # 截到 options 前
    end = seg.find("options:")
    chunk = seg[tm.end():end if end>0 else len(seg)]
    # 数组最后元素（引号内）
    items = re.findall(r'["\']((?:[^"\'\\]|\\.)*)["\']', chunk)
    print(fn, nid, "| 段数", len(items), "| 末段:", (items[-1][:40]+"..." if items else "NONE"))
