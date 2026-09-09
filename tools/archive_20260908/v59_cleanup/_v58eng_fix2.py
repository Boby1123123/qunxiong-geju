#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_v58eng_fix2.py — saveVersion 写死 46 → 48（4 处，幂等 /v58eng:savever/）。"""
import io

GAME = r'D:\1pao tuan\群雄割据\game.html'
MARK = '/v58eng:savever/'


def main():
    with io.open(GAME, encoding='utf-8') as f:
        d = f.read()
    if MARK in d:
        print('已存在 marker，跳过（幂等）')
        return
    old = 'S.saveVersion = 46;'
    new = 'S.saveVersion = 48; /* ' + MARK + ' */'
    cnt = d.count(old)
    if cnt != 4:
        print('中止: saveVersion=46 预期 4 次，实际 %d 次' % cnt)
        return
    d = d.replace(old, new)
    with io.open(GAME, 'w', encoding='utf-8') as f:
        f.write(d)
    print('OK: saveVersion 46→48 ×4，marker=%s' % MARK)


if __name__ == '__main__':
    main()
