# -*- coding: utf-8 -*-
"""V58-ENG 任务二：28 项精确甄别——把 c_structure 报告的名字映射回 html 原文位置，输出上下文"""
import io
import re
import sys
sys.path.insert(0, 'tools/eldacheck')
from checks import extract_scripts
from checks.c_refhealth import strip_strings_comments


def script_starts(html):
    """返回 [(start, end), ...] script 内容在 html 中的偏移"""
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


def main():
    html = io.open('game.html', encoding='utf-8').read()
    starts = script_starts(html)
    # 对每个 script 用 c_structure 逻辑找出 depth0 裸赋值
    candidates = []  # (name, si, abs_pos)
    for si, (s0, s1) in enumerate(starts):
        code = strip_strings_comments(html[s0:s1])
        opens = [i for i, ch in enumerate(code) if ch == '{']
        closes = [i for i, ch in enumerate(code) if ch == '}']
        top_decl = set()
        for m in re.finditer(r'\b(const|var|let|function|class)\s+([A-Za-z_$][\w$]*)\b', code):
            if _depth(opens, closes, m.start()) == 0:
                top_decl.add(m.group(2))
        for m in re.finditer(r'(?<![.\w$])([A-Za-z_$][\w$]*)\s*=\s*(?![=])', code):
            if _depth(opens, closes, m.start()) != 0:
                continue
            name = m.group(1)
            if name in ('return', 'typeof', 'new', 'else', 'this', 'true', 'false', 'null',
                        'undefined', 'var', 'let', 'const', 'function', 'class', 'delete',
                        'void', 'in', 'of', 'instanceof'):
                continue
            prev = code[max(0, m.start() - 20):m.start()]
            if re.search(r'\b(const|var|let|function|class)\s*$', prev):
                continue
            prev2 = code[max(0, m.start() - 6):m.start()]
            if re.search(r'\b(for|if|while|switch)\s*\(\s*$', prev2):
                continue
            if name not in top_decl:
                candidates.append((name, si, s0 + m.start()))

    # 去重（name,si）
    seen = {}
    for name, si, pos in candidates:
        key = (name, si)
        if key not in seen:
            seen[key] = pos

    for (name, si), pos in sorted(seen.items(), key=lambda kv: (kv[0][1], kv[0][0])):
        ln = html.count('\n', 0, pos) + 1
        ctx = html[max(0, pos - 50):pos + 90].replace('\n', '⏎')
        print('%s | script%d | 行%d: ...%s' % (name, si, ln, ctx))
    print('--- 共 %d 项' % len(seen))


def _depth(opens, closes, pos):
    import bisect
    return bisect.bisect_right(opens, pos) - bisect.bisect_right(closes, pos)


if __name__ == '__main__':
    main()
