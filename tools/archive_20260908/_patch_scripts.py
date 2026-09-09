# -*- coding: utf-8 -*-
import io
for f in ['_v58eng_aifresh03.py', '_v58eng_aifresh04.py']:
    s = io.open(f, encoding='utf-8').read()
    old = """        for old, new in items:
            c = blk.count(old)
            if c != 1:
                raise SystemExit('块内锚点不唯一或缺失 (%d处) @ %s: %s' % (c, nid, old[:40]))
            blk = blk.replace(old, new, 1)
            cnt += 1"""
    new = """        for old, new in items:
            c = blk.count(old)
            if c == 0:
                continue  # 已在前次执行中替换（marker被剥离后重跑）
            if c > 1:
                raise SystemExit('块内锚点不唯一 (%d处) @ %s: %s' % (c, nid, old[:40]))
            blk = blk.replace(old, new, 1)
            cnt += 1"""
    assert old in s, f
    s = s.replace(old, new)
    io.open(f, 'w', encoding='utf-8').write(s)
    print(f, '已更新')
