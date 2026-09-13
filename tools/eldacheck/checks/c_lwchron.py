#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_lwchron: LW 世界编年史检查器（elda ci 新检查器，蓝图方向 C1-C6）。
C1 规则表合法：LW_DATA.chronAuto 每条 match/kind/tag/tpl 齐备且 tpl 非空
C2 worldChron schema：LW_chronAdd 写入字段（day/season/phase/kind/tag/text）且上限 300 滚动
C3 引擎存在：LW_chronAdd / LW_chronTick / LW_chronUI / LW_chronFilter 均定义
C4 覆盖 WARN：自动成册触发点覆盖 major 类型（season/main/war/echo/omen 至少 4 类）
C5 上限 300：LW_chronAdd 内含 >300 截断逻辑
C6 双册不混：LW_chronAdd 只写 lw.worldChron；v92_chronicleAdd 只写 S.chronicle（不交叉）
只读构建产物；不修改任何内容。
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def _extract_js_object(html, var_name):
    m = re.search(r'window\.%s\s*=\s*(\[|\{)' % re.escape(var_name), html)
    if not m:
        return None
    opener = m.group(1)
    closer = ']' if opener == '[' else '}'
    depth = 0
    in_str = False
    esc = False
    j = m.end() - 1
    while j < len(html):
        c = html[j]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == opener:
                depth += 1
            elif c == closer:
                depth -= 1
                if depth == 0:
                    return html[m.end() - 1:j + 1]
        j += 1
    return None


def _js_to_json(seg):
    seg = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)
    seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
    return json.loads(seg2)


def run(html):
    problems = []
    detail = {}

    # C1 规则表合法
    seg = _extract_js_object(html, 'LW_DATA')
    data = _js_to_json(seg) if seg else None
    chron_auto = (data or {}).get('chronAuto') or []
    detail['chronAuto_total'] = len(chron_auto)
    c1 = []
    seen_match = set()
    for i, r in enumerate(chron_auto):
        if not isinstance(r, dict):
            c1.append('chronAuto[%d] 非对象' % i)
            continue
        for f in ('match', 'kind', 'tag', 'tpl'):
            if not r.get(f):
                c1.append('chronAuto[%d] 缺 %s' % (i, f))
        if r.get('match') in seen_match:
            c1.append('match 重复: %s' % r.get('match'))
        else:
            seen_match.add(r.get('match'))
    detail['c1'] = c1
    if c1:
        problems.append({'name': '成册规则', 'line': 0, 'cat': 'C1', 'msg': '; '.join(c1[:6])})

    # C2 worldChron schema + 上限（LW_chronAdd 内）
    add_fn = None
    m = re.search(r'window\.LW_chronAdd\s*=\s*function.*?\n\s*\};', html, flags=re.S)
    if m:
        add_fn = m.group(0)
    fields_ok = all(f in (add_fn or '') for f in ['day:', 'season:', 'phase:', 'kind:', 'tag:', 'text:'])
    detail['c2_fields'] = fields_ok
    cap_ok = ('> 300' in (add_fn or '')) or ('>300' in (add_fn or '')) or ('length-300' in (add_fn or ''))
    detail['c2_cap'] = cap_ok
    if not add_fn:
        problems.append({'name': '世界册写入', 'line': 0, 'cat': 'C2', 'msg': 'LW_chronAdd 未定义'})
    else:
        if not fields_ok:
            problems.append({'name': '世界册写入', 'line': 0, 'cat': 'C2', 'msg': 'LW_chronAdd 缺 schema 字段'})
        if not cap_ok:
            problems.append({'name': '世界册写入', 'line': 0, 'cat': 'C2', 'msg': 'LW_chronAdd 缺 300 上限滚动'})

    # C3 引擎存在
    c3 = []
    for fn in ('LW_chronAdd', 'LW_chronTick', 'LW_chronUI', 'LW_chronFilter'):
        if ('window.%s' % fn) not in html:
            c3.append('%s 未定义' % fn)
    detail['c3'] = c3
    if c3:
        problems.append({'name': '引擎存在', 'line': 0, 'cat': 'C3', 'msg': '; '.join(c3)})

    # C4 自动成册触发点覆盖（WARN 不阻断）
    hooks = {
        'season': 'LW_chronAdd("season"' in html or 'LW_chronAdd(\'season\'' in html or 'chronAdd("season"' in html,
        'main': 'chronSnap["main_' in html or 'chronSnap[\'main_' in html,
        'war': 'chronAdd("war"' in html,
        'echo': 'chronAdd("echo"' in html,
        'omen': 'chronAdd("omen"' in html,
        'festival': 'chronAdd("festival"' in html or 'chronSnap["fest_' in html,
    }
    hit = [k for k, v in hooks.items() if v]
    detail['c4_hooks'] = hit
    if len(hit) < 4:
        problems.append({'name': '自动成册覆盖', 'line': 0, 'cat': 'C4',
                         'msg': '触发点仅 %d/6 类（%s），建议覆盖 season/main/war/echo/omen' % (len(hit), ','.join(hit))})

    # C5 上限 300（兜底在 LW_chronAdd 之外再扫全文）
    c5_ok = cap_ok or ('> 300' in html and 'worldChron' in html)
    detail['c5'] = c5_ok
    if not c5_ok:
        problems.append({'name': '容量上限', 'line': 0, 'cat': 'C5', 'msg': 'worldChron 缺 300 滚动上限'})

    # C6 双册不混：世界册函数不得写 S.chronicle；玩家册函数不得写 lw.worldChron
    c6 = []
    if add_fn and re.search(r'S\.chronicle', add_fn):
        c6.append('LW_chronAdd 误写 S.chronicle')
    p_fn = None
    mp = re.search(r'window\.v92_chronicleAdd\s*=\s*function.*?\n\s*\};', html, flags=re.S)
    if mp:
        p_fn = mp.group(0)
        if 'worldChron' in p_fn:
            c6.append('v92_chronicleAdd 误写 lw.worldChron')
    detail['c6'] = c6
    if c6:
        problems.append({'name': '双册隔离', 'line': 0, 'cat': 'C6', 'msg': '; '.join(c6)})

    ok = len(problems) == 0
    results = [{
        'name': '世界编年史·规则%d条·触发%d类·上限%s·隔离%s' % (
            len(chron_auto), len(hit), '有' if c5_ok else '无', 'OK' if not c6 else 'FAIL'),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:5])),
    }]
    return {'name': 'LW世界编年史', 'ok': ok, 'results': results, 'details': detail}
