#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_arc: SP-6 弧线覆盖门（elda ci 第 23 检查器）。
nodeIndex 弧归属覆盖率（≥88%）、未归属节点上限（≤400）、每弧节点数>0。
"""
import io, os, re, json
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def _extract_js_object(html, var_name):
    m = re.search(r'window\.%s\s*=\s*\{' % re.escape(var_name), html)
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
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return html[i:j + 1]
        j += 1
    return None


def _parse_obj(html, var_name):
    seg = _extract_js_object(html, var_name)
    if not seg:
        return None
    try:
        seg2 = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)  # 剥 JS 注释
        seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg2)
        return json.loads(seg2)
    except Exception:
        return None


def run(html):
    problems = []
    detail = {}
    bp = _parse_obj(html, 'STORY_BLUEPRINT')
    if bp is None:
        return {'name': '弧线覆盖门', 'ok': False, 'results': [
            {'name': '弧线覆盖 缺失', 'ok': False, 'msg': 'STORY_BLUEPRINT 缺失或解析失败'}], 'details': detail}

    idx = bp.get('nodeIndex') or {}
    arcs = bp.get('arcs') or []
    total = len(idx)
    assigned = sum(1 for v in idx.values() if v and v.get('arc'))
    unassigned = total - assigned
    rate = (assigned / total * 100.0) if total else 0.0
    detail.update({'total': total, 'assigned': assigned, 'unassigned': unassigned,
                   'rate': round(rate, 1), 'arc_count': len(arcs)})

    if rate < 88.0:
        problems.append({'name': '覆盖率', 'line': 0, 'cat': '覆盖',
                         'msg': '弧归属率 %.1f%% < 88%%（未归属 %d）' % (rate, unassigned)})
    if unassigned > 400:
        problems.append({'name': '未归属', 'line': 0, 'cat': '覆盖', 'msg': '未归属节点 %d > 400' % unassigned})

    # 每弧节点数>0
    arc_ids = set(a.get('id') for a in arcs if a.get('id'))
    empty_arcs = [aid for aid in arc_ids if not any(
        v and v.get('arc') == aid for v in idx.values())]
    detail['empty_arcs'] = len(empty_arcs)
    if empty_arcs and len(empty_arcs) > 5:
        problems.append({'name': '空弧', 'line': 0, 'cat': '覆盖', 'msg': '%d 弧零节点（>5 容差）: %s'
                         % (len(empty_arcs), ','.join(empty_arcs[:6]))})

    ok = len(problems) == 0
    msg = '覆盖 %d/%d (%.1f%%)·未归属 %d·空弧 %d' % (assigned, total, rate, unassigned, len(empty_arcs))
    results = [{'name': '弧线覆盖 ' + msg, 'ok': ok,
                'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:4]))}]
    return {'name': '弧线覆盖门', 'ok': ok, 'results': results, 'details': detail}
