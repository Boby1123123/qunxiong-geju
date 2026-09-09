#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""jsscan: 共享 JS 静态扫描器（V59-ENG 精确化地基）

提供：
- strip_equal(code)  全等长 strip（// 行注释也替换为等长占位，位置与原文一一对应）
- script_starts(html) <script> 内容在 html 中的偏移
- scan_script(code)  单 script 结构化扫描：
    decls   [(name, kind, depth, pos)]   顶层声明（含多变量 let a, b=1 全收集）
    wins    [(name, pos, is_write)]      window.X 读写
    bares   [(name, pos, depth)]         裸引用（排除声明词/typeof/new/参数/箭头）
    assigns [(name, pos, depth)]         裸赋值（隐式全局创建候选）
    fn_zones[(start, end)]               function 参数列表区域（该区名字不判定）

位置 = 在 code（strip 后，与原文等长）中的字符偏移，可经 script_starts 映射到 html 绝对偏移。
"""
import re
from functools import lru_cache

_RE_EQ = re.compile(r'\s*=')
_RE_COLON = re.compile(r'\s*:')
_RE_ARROW = re.compile(r'\s*=>')

_KEYWORDS = set('''const var let function class return typeof new delete void in of
instanceof extends import export default this true false null undefined if else for
while switch case break continue do try catch finally throw async await yield
super static get set'''.split())


@lru_cache(maxsize=8)
def strip_equal(code):
    """全等长 strip：字符串/注释替换为等长空格，字符偏移与原文一一对应。"""
    out = []
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        nxt = code[i + 1] if i + 1 < n else ''
        if c == '/' and nxt == '/':
            j = code.find('\n', i)
            if j == -1:
                out.append(' ' * (n - i))
                break
            out.append(' ' * (j - i + 1))   # 含 \n，等长
            i = j + 1
            continue
        if c == '/' and nxt == '*':
            j = code.find('*/', i + 2)
            if j == -1:
                out.append(' ' * (n - i))
                break
            out.append(' ' * (j - i + 2))   # 含 */，等长
            i = j + 2
            continue
        if c == '`':
            j = i + 1
            while j < n:
                if code[j] == '\\':
                    j += 2
                    continue
                if code[j] == '`':
                    break
                j += 1
            out.append(' ' * (j - i + 1))
            i = j + 1
            continue
        if c in ('"', "'"):
            j = i + 1
            while j < n:
                if code[j] == '\\':
                    j += 2
                    continue
                if code[j] == c:
                    break
                j += 1
            out.append(' ' * (j - i + 1))
            i = j + 1
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def script_starts(html):
    """返回 [(start, end), ...] 各 <script> 内联内容在 html 中的偏移。"""
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


def _brace_arrays(code):
    """全括号 ( ) [ ] { } 位置列表。"""
    opens = [i for i, ch in enumerate(code) if ch in '([{']
    closes = [i for i, ch in enumerate(code) if ch in ')]}']
    return opens, closes


def _depth_at(opens, closes, pos):
    import bisect
    return bisect.bisect_right(opens, pos) - bisect.bisect_right(closes, pos)


def _collect_decls(code, opens, closes):
    """声明收集：const/var/let/function/class + 多变量声明补充登记。"""
    decls = []
    for m in re.finditer(r'\b(const|var|let|function|class)\s+([A-Za-z_$][\w$]*)\b', code):
        kind = m.group(1)
        name = m.group(2)
        dp = _depth_at(opens, closes, m.start())
        decls.append((name, kind, dp, m.start()))
        # 多变量声明：let a, b=1, c; —— 从声明名后到本行/本深度第一个 ';' 找 ', name'
        # 限行内扫描（多变量声明极少跨行），避免 for/函数体长扫描性能爆炸
        if kind in ('let', 'var', 'const'):
            nl = code.find('\n', m.end())
            limit = min(nl if nl != -1 else len(code), m.end() + 300)
            j = m.end()
            while j < limit:
                ch = code[j]
                if ch == ';':
                    break
                if ch in '([{' and _depth_at(opens, closes, j) > dp:
                    j = _skip_nested(code, j, limit)
                    continue
                if ch == ',' and _depth_at(opens, closes, j) == dp:
                    k = j + 1
                    while k < len(code) and code[k] in ' \t':
                        k += 1
                    nm = re.match(r'[A-Za-z_$][\w$]*', code[k:])
                    if nm:
                        nxt = code[k + nm.end():k + nm.end() + 1]
                        if nxt in ('=', ',', ';'):
                            decls.append((nm.group(0), kind, dp, k))
                            j = k
                            continue
                j += 1
    return decls


def _skip_nested(code, pos, limit=None):
    """从 pos 处的开括号起，跳过配平区域，返回闭合后位置（不超过 limit）。"""
    n = len(code)
    if limit is None:
        limit = n
    depth = 0
    i = pos
    pairs = {'(': ')', '[': ']', '{': '}'}
    while i < limit:
        c = code[i]
        if c in pairs:
            depth += 1
        elif c in ')]}':
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return limit


def _fn_param_zones(code):
    """function 关键字后的参数列表区域 [start, end)（到第一个 '{'）。"""
    zones = []
    for m in re.finditer(r'\bfunction\b', code):
        j = code.find('{', m.end())
        if j != -1:
            zones.append((m.start(), j))
    return zones


@lru_cache(maxsize=8)
def scan_script(code):
    """扫描单个 script（strip 后代码），返回结构信息。"""
    import bisect
    opens, closes = _brace_arrays(code)
    decls = _collect_decls(code, opens, closes)
    fn_zones = _fn_param_zones(code)
    fn_starts = [s for s, e in fn_zones]
    fn_ends = [e for s, e in fn_zones]

    def in_zone(pos):
        i = bisect.bisect_right(fn_starts, pos) - 1
        return i >= 0 and pos < fn_ends[i]

    ident_prev = frozenset('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_$.')
    NAME = r'[A-Za-z_$][\w$]*'

    # window.X 读写
    wins = []
    for m in re.finditer(r'window\.([A-Za-z_$][\w$]*)(?![\w$])', code):
        name = m.group(1)
        is_write = bool(_RE_EQ.match(code, m.end()))
        wins.append((name, m.start(), is_write))

    # 裸引用（无负向后视：手动检查前一字符）
    bares = []
    for m in re.finditer(r'(%s)(?![\w$])' % NAME, code):
        name = m.group(1)
        if m.start() > 0 and code[m.start() - 1] in ident_prev:
            continue
        if name in _KEYWORDS:
            continue
        prev = code[max(0, m.start() - 14):m.start()]
        if re.search(r'\b(const|var|let|function|class|return|typeof|new|delete|void|in|of|instanceof|extends|import|export|default|case|throw|yield|await|do|else)\s*$', prev):
            continue
        if in_zone(m.start()):
            continue
        # 对象字面量键：{AGI: 1} / { AGI: 1} / {a:1, b:2} —— 向前跳过空白看 '{' 或 ',' 且后跟 ':'
        j = m.start() - 1
        while j >= 0 and code[j] in ' \t\r\n':
            j -= 1
        if j >= 0 and code[j] in '{,' and _RE_COLON.match(code, m.end()):
            continue
        # 箭头函数单参数：name => 
        if _RE_ARROW.match(code, m.end()):
            continue
        dp = _depth_at(opens, closes, m.start())
        bares.append((name, m.start(), dp))

    # 裸赋值（隐式全局创建候选）
    assigns = []
    for m in re.finditer(r'(%s)\s*=\s*(?![=>])' % NAME, code):
        name = m.group(1)
        if m.start() > 0 and code[m.start() - 1] in ident_prev:
            continue
        if name in _KEYWORDS:
            continue
        prev = code[max(0, m.start() - 14):m.start()]
        if re.search(r'\b(const|var|let|function|class)\s*$', prev):
            continue
        if in_zone(m.start()):
            continue
        dp = _depth_at(opens, closes, m.start())
        assigns.append((name, m.start(), dp))

    # for 头无声明初始化：for(i=0; ...) 隐式全局
    for_heads = []
    for m in re.finditer(r'\bfor\s*\(\s*([A-Za-z_$][\w$]*)\s*=', code):
        for_heads.append((m.group(1), m.start()))

    return {'decls': decls, 'wins': wins, 'bares': bares, 'assigns': assigns,
            'fn_zones': fn_zones, 'for_heads': for_heads}
