#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_report: SP-6 生产报表（elda ci 第 24 检查器，PASS 型）。
输出每卷节点数 / 每弧节点数 Top / pace 分布（light≤20%、deep≥5%），供内容选址与节奏健康。
"""
import io, os, re, json
from collections import Counter
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
        return {'name': '生产报表', 'ok': True, 'results': [
            {'name': '生产报表 缺失', 'ok': True, 'msg': 'STORY_BLUEPRINT 缺失（跳过报表）'}], 'details': detail}

    idx = bp.get('nodeIndex') or {}
    vols = bp.get('volumes') or []
    vol_names = {v.get('id'): v.get('name', v.get('id')) for v in vols}

    vol_count = Counter()
    arc_count = Counter()
    pace_count = Counter()
    for nid, v in idx.items():
        if not v:
            continue
        if v.get('vol'):
            vol_count[v['vol']] += 1
        if v.get('arc'):
            arc_count[v['arc']] += 1
    # pace 分布：一次 finditer 扫全部节点（pace 在 tag/place 之后、text 数组之前，用 [^{}] 限域防跨节点）
    for m in re.finditer(r'N\["[^"]+"\]\s*=\s*\{[^{}]*?pace\s*:\s*"([^"]+)"', html):
        pace_count[m.group(1)] += 1

    total = sum(pace_count.values()) or 1
    light_ratio = pace_count.get('light', 0) / total * 100.0
    deep_ratio = pace_count.get('deep', 0) / total * 100.0
    detail.update({
        'vol_stats': [{'vol': k, 'name': vol_names.get(k, k), 'nodes': c}
                      for k, c in vol_count.most_common()],
        'arc_top': [{'arc': k, 'nodes': c} for k, c in arc_count.most_common(10)],
        'pace': dict(pace_count),
        'light_ratio': round(light_ratio, 1),
        'deep_ratio': round(deep_ratio, 1),
    })

    # 节奏阈值仅信息提示（硬门禁由 c_pace 负责，避免口径重复/打架）
    notes = []
    if light_ratio > 20.0:
        notes.append('light 占比 %.1f%% > 20%%（参考 c_pace 口径）' % light_ratio)
    if deep_ratio < 5.0:
        notes.append('deep 占比 %.1f%% < 5%%（参考 c_pace 口径）' % deep_ratio)

    ok = len(problems) == 0
    vol_line = '卷 ' + ','.join('%s=%d' % (k, c) for k, c in vol_count.most_common(5))
    msg = 'light %.1f%% deep %.1f%% · ' % (light_ratio, deep_ratio) + vol_line + ' …' + (' [提示] ' + '; '.join(notes) if notes else '')
    results = [{'name': '生产报表 ' + msg, 'ok': ok,
                'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:3]))}]
    return {'name': '生产报表', 'ok': ok, 'results': results, 'details': detail}
