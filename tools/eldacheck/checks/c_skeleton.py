#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_skeleton: SP-6 叙事骨架门（elda ci 第 22 检查器）。
校验叙事蓝图（STORY_BLUEPRINT）完整性：幕/卷/章/弧/节点索引规模下限 + 章锚点可达。
"""
import io, os, re, json
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def _extract_js_object(html, var_name):
    """提取 window.VAR = { ... }; 的对象文本（配平花括号，跳过字符串）"""
    m = re.search(r'window\.%s\s*=\s*\{' % re.escape(var_name), html)
    if not m:
        return None
    i = m.end() - 1  # 指向 '{'
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
        problems.append({'name': '蓝图', 'line': 0, 'cat': '缺失', 'msg': 'STORY_BLUEPRINT 缺失或解析失败'})
        detail.update({'acts': 0, 'vols': 0, 'chs': 0, 'arcs': 0, 'idx': 0, 'anchors': 0})
        return {'name': '叙事骨架门', 'ok': False, 'results': [
            {'name': '叙事骨架 缺失', 'ok': False, 'msg': 'STORY_BLUEPRINT 缺失或解析失败'}], 'details': detail}

    acts = bp.get('acts') or []
    vols = bp.get('volumes') or []
    chs = bp.get('chapters') or []
    arcs = bp.get('arcs') or []
    idx = bp.get('nodeIndex') or {}
    detail.update({'acts': len(acts), 'vols': len(vols), 'chs': len(chs),
                   'arcs': len(arcs), 'idx': len(idx)})

    # 规模下限（基线：5/10/36/79/3877）
    limits = [('幕', len(acts), 5), ('卷', len(vols), 10), ('章', len(chs), 36),
              ('弧', len(arcs), 79), ('节点索引', len(idx), 3877)]
    for name, cur, lo in limits:
        if cur < lo:
            problems.append({'name': name, 'line': 0, 'cat': '规模', 'msg': '%s=%d < 下限 %d' % (name, cur, lo)})

    # 章锚点可达
    ids = set(find_node_ids(html).keys())
    anchor_miss = [c.get('anchor') for c in chs if c.get('anchor') and c['anchor'] not in ids]
    detail['anchors'] = len(chs) - len(anchor_miss)
    if len(anchor_miss) > 3:
        problems.append({'name': '章锚点', 'line': 0, 'cat': '可达', 'msg': '锚点缺失 %d 个（超限 3）: %s'
                         % (len(anchor_miss), ','.join(anchor_miss[:5]))})

    ok = len(problems) == 0
    msg = '幕%d 卷%d 章%d 弧%d 索引%d 锚点%d/%d' % (
        len(acts), len(vols), len(chs), len(arcs), len(idx),
        detail['anchors'], len(chs))
    results = [{'name': '叙事骨架 ' + msg, 'ok': ok,
                'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:4]))}]
    return {'name': '叙事骨架门', 'ok': ok, 'results': results, 'details': detail}
