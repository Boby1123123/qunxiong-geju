# -*- coding: utf-8 -*-
"""V58-ENG 任务二 v2：原地 IIFE 包裹 + window 显式导出
- 修复 } 语句结束判断
- 排除 let 多变量声明（curNode/sfxOn/ambNodes 经确认是 let 声明，非隐式全局）
用法：python _v58eng_iife01.py --dry | 不带参数执行"""
import io
import re
import sys

sys.path.insert(0, '.')
from _v58eng_iife_points import scan, script_starts

NAMES = ['COMBAT_TEXTS', 'ENDINGS', 'COMBAT', 'renderStats', 'writePar',
         'effTarget', 'applyEffects', 'advanceDays', 'choose', 'writeNext',
         'renderTop', 'showEnding', 'newGame', 'loadGame']

DRY = '--dry' in sys.argv


def find_statement(code, name_pos):
    i = name_pos
    n = len(code)
    start = code.rfind('\n', 0, i) + 1
    while start < n and code[start] in ' \t':
        start += 1
    j = i
    while j < n and code[j] not in '=\t ':
        j += 1
    while j < n and (code[j] in ' \t' or code[j] == '='):
        j += 1
    depth = 0
    in_str = None
    end = -1
    while j < n:
        c = code[j]
        if in_str:
            if c == '\\':
                j += 2
                continue
            if c == in_str:
                in_str = None
            j += 1
            continue
        if c == '/' and code[j + 1:j + 2] == '/':
            nl = code.find('\n', j)
            if nl == -1:
                break
            j = nl
            continue
        if c == '/' and code[j + 1:j + 2] == '*':
            k = code.find('*/', j + 2)
            if k == -1:
                break
            j = k + 2
            continue
        if c in ('"', "'", '`'):
            in_str = c
            j += 1
            continue
        if c in '({[':
            depth += 1
            j += 1
            continue
        if c in ')}]':
            depth -= 1
            if depth < 0:
                depth = 0
            if c == '}' and depth == 0:
                # 语句以 } 结束：后跟 换行/回车/EOF/空格后换行/分号
                nxt = code[j + 1:j + 2]
                if nxt in ('\n', '\r', '') or (nxt in (' ', '\t') and code[j + 2:j + 3] == '\n'):
                    end = j + 1
                    break
            j += 1
            continue
        if depth == 0 and c == ';':
            end = j
            break
        j += 1
    if end == -1:
        raise SystemExit('找不到语句终点 @ %d: %s' % (name_pos, code[name_pos:name_pos + 60]))
    stmt = code[start:end]
    core = stmt[:-1] if stmt.endswith(';') else stmt
    return start, end, core.strip()


def main():
    html = io.open('game.html', encoding='utf-8').read()
    starts = script_starts(html)
    all_points = []
    for s0, s1 in starts:
        all_points.extend(scan(html[s0:s1], s0, NAMES))
    # 过滤掉 let 多变量声明内的命中：检查语句起点前 30 字符是否有 'let '/'var '/'const '（多变量）
    filtered = []
    for name, pos in all_points:
        line_start = html.rfind('\n', 0, pos) + 1
        prefix = html[line_start:pos]
        if re.match(r'^\s*(let|var|const)\s+\w[\w$]*\s*,', prefix):
            print('跳过 let/var 多变量声明内命中: %s @ 行%d' % (name, html.count('\n', 0, pos) + 1))
            continue
        filtered.append((name, pos))
    groups = {}
    for name, pos in filtered:
        groups.setdefault(pos, []).append(name)
    if html.count('/*v58eng:iife*/') > 0:
        print('已有 marker %d 处——视为已包裹，跳过' % html.count('/*v58eng:iife*/'))
        return
    edits = []
    for pos in sorted(groups):
        names = groups[pos]
        st, en, core = find_statement(html, pos)
        if not core:
            print('跳过空语句 @ %d' % pos)
            continue
        exports = ' '.join('window.%s = %s;' % (nm, nm) for nm in names)
        wrap = '(function(){ /*v58eng:iife*/ ' + core + '; ' + exports + ' })();'
        edits.append((st, en, wrap, names, pos))
    if DRY:
        for st, en, wrap, names, pos in edits:
            ln = html.count('\n', 0, st) + 1
            print('=== 行%d %s ===' % (ln, '+'.join(names)))
            print(' 原: %s' % html[st:en][:100].replace('\n', '⏎'))
            print(' 尾: ...%s' % html[en - 30:en].replace('\n', '⏎'))
            print(' 新: %s' % wrap[:140].replace('\n', '⏎'))
        print('--- 共 %d 个 IIFE' % len(edits))
        return
    buf = html
    for st, en, wrap, names, pos in sorted(edits, key=lambda e: -e[0]):
        buf = buf[:st] + wrap + buf[en:]
    io.open('game.html', 'w', encoding='utf-8').write(buf)
    print('完成：包裹 %d 处，写入 game.html' % len(edits))


if __name__ == '__main__':
    main()
