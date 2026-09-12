#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_faction: LW 势力矩阵检查器（elda ci 新检查器，蓝图方向 A1）。
F1 基线一致：LW_DATA.factions 各 base == 设定基线（free=10 / abyss=-40 / 其余 0）
F2 状态机值域：factionState 初值 ∈ {稳定,备战,战争,衰落,重整,潜伏}
F3 转移合法性：LW_factionTick 赋值目标 ∈ 合法状态集合
F4 势力覆盖：factions 键集 == 设定 8 势力 + abyss（9 键）
只读构建产物；不修改任何内容。
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

BASE = {'free': 10, 'north': 0, 'south': 0, 'church': 0, 'elf': 0,
        'dwarf': 0, 'orc': 0, 'east': 0, 'abyss': -40}
STATES = {'稳定', '备战', '战争', '衰落', '重整', '潜伏'}
REQUIRED = set(BASE.keys())



def _extract_js_object(html, var_name):
    """提取 window.VAR = { ... };（括号配平，兼容数组/对象）"""
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

def _extract_js_array(html, var_name):
    m = re.search(r'window\.%s\s*=\s*\[' % re.escape(var_name), html)
    if not m:
        return None
    i = m.end() - 1
    depth = 0
    in_str = False
    esc = False
    j = i
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
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return html[i:j + 1]
        j += 1
    return None


def _js_to_json(seg):
    seg = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)
    seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
    return json.loads(seg2)


def run(html):
    problems = []
    detail = {}

    seg = _extract_js_object(html, 'LW_DATA')
    data = _js_to_json(seg) if seg else None
    factions = (data or {}).get('factions') or {}
    fstate = (data or {}).get('factionState') or {}

    detail['faction_keys'] = sorted(factions.keys())

    # F1 基线一致
    f1 = []
    for k, v in factions.items():
        base = v.get('base') if isinstance(v, dict) else None
        if k in BASE and base != BASE[k]:
            f1.append('%s base=%s≠%s' % (k, base, BASE[k]))
    detail['f1'] = f1
    if f1:
        problems.append({'name': '基线', 'line': 0, 'cat': 'F1', 'msg': '; '.join(f1[:6])})

    # F4 势力覆盖
    missing = sorted(REQUIRED - set(factions.keys()))
    extra = sorted(set(factions.keys()) - REQUIRED)
    detail['f4_missing'] = missing
    detail['f4_extra'] = extra
    if missing or extra:
        problems.append({'name': '覆盖', 'line': 0, 'cat': 'F4',
                         'msg': '势力键缺失 %s / 多余 %s' % (','.join(missing) or '无', ','.join(extra) or '无')})

    # F2 状态机值域
    f2 = []
    for k, v in fstate.items():
        if v not in STATES:
            f2.append('%s=%s' % (k, v))
    detail['f2'] = f2
    if f2:
        problems.append({'name': '状态值域', 'line': 0, 'cat': 'F2', 'msg': '非法状态: ' + '; '.join(f2[:6])})

    # F3 转移合法性：LW_factionTick 的赋值目标
    f3 = []
    for m in re.finditer(r'lw\.factionState\.([a-zA-Z_]+)\s*=\s*["\']([^"\']+)["\']', html):
        fid, st = m.group(1), m.group(2)
        if st not in STATES:
            f3.append('%s→%s' % (fid, st))
    detail['f3'] = f3
    if f3:
        problems.append({'name': '状态转移', 'line': 0, 'cat': 'F3',
                         'msg': '非法转移: ' + '; '.join(f3[:6])})

    ok = len(problems) == 0
    results = [{
        'name': '势力 %d 家·基线漂移 %d·非法状态 %d' % (
            len(factions), len(f1), len(f2)),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': 'LW势力矩阵', 'ok': ok, 'results': results, 'details': detail}
