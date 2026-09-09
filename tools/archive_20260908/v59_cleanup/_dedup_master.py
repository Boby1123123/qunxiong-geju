# -*- coding: utf-8 -*-
"""把 game.html 回退到 content2 完成态（删除 content2b 注入的块）"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

marker = '/*v53inj:master*/'
cnt = s.count(marker)
print('master marker count:', cnt)
if cnt > 1:
    # 保留第一块，删除后续重复块
    first = s.find(marker)
    parts = []
    idx = first
    while True:
        nxt = s.find(marker, idx + len(marker))
        if nxt < 0:
            break
        parts.append((idx, nxt))
        idx = nxt
    # 从后往前删重复段（每段从 marker 到下一 marker 前）
    for a, b in reversed(parts):
        # 删除从 a 到 b 的内容（保留 b 的 marker 作为后续锚点）
        s = s[:a] + s[b:]
    print('after dedup count:', s.count(marker))
    io.open(r'D:\1pao tuan\群雄割据\game.html', 'w', encoding='utf-8').write(s)
else:
    print('no dup, nothing to do')
