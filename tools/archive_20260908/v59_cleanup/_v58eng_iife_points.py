# -*- coding: utf-8 -*-
"""V58-ENG 任务二：精确顶层赋值点定位（原始 html 扫描，跳过字符串/注释，depth 跟踪）"""
import io
import re
import sys

NAMES = ['COMBAT_TEXTS', 'ENDINGS', 'COMBAT', 'renderStats', 'writePar',
         'sfxOn', 'ambNodes', 'curNode', 'effTarget', 'applyEffects',
         'advanceDays', 'choose', 'writeNext', 'renderTop', 'showEnding',
         'newGame', 'loadGame']


def script_starts(html):
    out = []
    pos = 0
    while True:
        m = re.search(r'<script[^>]*>', html[pos:])
        if not m:
            break
        start = pos + m.end()
        end = html.find('</script>', start)
        if end == -1:
            break
        out.append((start, end))
        pos = end + 9
    return out


def scan(code, base, names):
    """返回 [(name, abs_pos)]：base=code 在 html 中的起始偏移"""
    i, n = 0, len(code)
    depth = 0
    in_str = None
    points = []
    while i < n:
        c = code[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c == '/' and code[i + 1:i + 2] == '/':
            j = code.find('\n', i)
            if j == -1:
                break
            i = j
            continue
        if c == '/' and code[i + 1:i + 2] == '*':
            j = code.find('*/', i + 2)
            i = (j + 2) if j != -1 else n
            continue
        if c in ('"', "'", '`'):
            in_str = c
            i += 1
            continue
        if c in '({[':
            depth += 1
            i += 1
            continue
        if c in ')}]':
            depth = max(0, depth - 1)
            i += 1
            continue
        if depth == 0:
            prev_ok = (i == 0) or not (code[i - 1].isalnum() or code[i - 1] in '_$.')
            if prev_ok:
                for name in names:
                    if code.startswith(name, i):
                        j = i + len(name)
                        k = j
                        while k < n and code[k] in ' \t':
                            k += 1
                        if k < n and code[k] == '=' and code[k + 1:k + 2] != '=':
                            # 排除 var/let/const/function 前缀
                            pre = code[max(0, i - 20):i]
                            if not re.search(r'\b(const|var|let|function|class)\s*$', pre):
                                points.append((name, base + i))
                            break
        i += 1
    return points


def main():
    html = io.open('game.html', encoding='utf-8').read()
    starts = script_starts(html)
    all_points = []
    for s0, s1 in starts:
        all_points.extend(scan(html[s0:s1], s0, NAMES))
    for name, pos in sorted(all_points, key=lambda p: p[1]):
        ln = html.count('\n', 0, pos) + 1
        print('%s | 行%d: ...%s' % (name, ln, html[pos:pos + 70].replace('\n', '⏎')))
    print('--- 共 %d 个包裹点' % len(all_points))


if __name__ == '__main__':
    main()
