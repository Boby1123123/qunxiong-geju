# -*- coding: utf-8 -*-
import io, json, sys, collections
sys.path.insert(0, r"D:\1pao tuan\群雄割据\tools\scripts_tmp")
from w2_events import EVENTS_W2

def to_js(ev):
    return '  {id:"%s",day:%d,cls:%s,text:%s}' % (
        ev["id"], ev["day"], json.dumps(ev["cls"], ensure_ascii=False),
        json.dumps(ev["text"], ensure_ascii=False))

lines = [to_js(ev) for ev in EVENTS_W2]

p = r"D:\1pao tuan\群雄割据\src\script_01.js"
t = io.open(p, encoding="utf-8").read()
import re
mm = re.search(r'EVENT_POOL_EXT\s*=\s*\[', t)
arr_start = mm.end()
close_idx = t.index("\n];", arr_start)
tail = t[close_idx:]
before = t[:close_idx].rstrip()
if not before.endswith(","):
    before += ","
block = ",\n".join(lines)
t = before + "\n" + block + tail
io.open(p, "w", encoding="utf-8", newline="").write(t)
print("W-2 injected:", len(lines), "events")

MAIN = [60,120,200,250,280]
bad = [(e["id"], e["day"]) for e in EVENTS_W2 if any(abs(e["day"]-m) < 15 for m in MAIN)]
print("day conflicts:", bad if bad else "none")
print("cls:", dict(collections.Counter(e["cls"] for e in EVENTS_W2)))

# 复核总数
t2 = io.open(p, encoding="utf-8").read()
m2 = re.search(r'EVENT_POOL_EXT\s*=\s*\[(.*?)\n\];', t2, re.S)
evs = re.findall(r'\{id:"[\w]+",day:\d+,cls:"[^"]+",text:"', m2.group(1))
print("total single-line events:", len(evs))
