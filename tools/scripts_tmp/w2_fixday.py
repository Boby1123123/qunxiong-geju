# -*- coding: utf-8 -*-
import io
p = r"D:\1pao tuan\群雄割据\tools\scripts_tmp\w2_events.py"
t = io.open(p, encoding="utf-8").read()
t = t.replace('{"id":"w2_acad_quiz","day":212', '{"id":"w2_acad_quiz","day":302')
io.open(p, "w", encoding="utf-8", newline="").write(t)
print("w2 day fixed:", "day\":302" in t)
