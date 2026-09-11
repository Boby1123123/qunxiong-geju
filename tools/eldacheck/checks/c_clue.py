#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_clue: 贯穿线索检查（elda ci 第 39 检查器，N-3 新增）。

1. CLUE_TRACKS 必须存在（window.CLUE_TRACKS = [...]）
2. 每条线索 probes ≥ 3 个 flag
3. 每个 probe.flag 必须在 game.html 中被写入（flag: / eff.flag 置位），防孤儿 flag
4. ENDING_ECHO 必须存在且每条 pre 非空
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


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


def _parse_array(seg):
    try:
        seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
        return json.loads(seg2)
    except Exception:
        return None


def _flag_sets(html):
    return set(re.findall(r'flag:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'eff\.flag\s*=\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'flags\[["\']([^"\']+)["\']\]', html))


def run(html):
    results = []
    flags = _flag_sets(html)

    seg = _extract_js_array(html, 'CLUE_TRACKS')
    if seg is None:
        results.append({'name': '线索账', 'ok': False, 'msg': 'CLUE_TRACKS 缺失'})
        return {'name': '贯穿线索', 'ok': False, 'results': results}

    tracks = _parse_array(seg)
    if tracks is None:
        results.append({'name': '线索账', 'ok': False, 'msg': 'CLUE_TRACKS 解析失败'})
        return {'name': '贯穿线索', 'ok': False, 'results': results}

    results.append({'name': '线索账', 'ok': True, 'msg': '%d 条线索' % len(tracks)})
    if len(tracks) < 3:
        results.append({'name': '线索数量', 'ok': False, 'msg': '线索 < 3 条（%d）' % len(tracks)})

    for t in tracks:
        tid = t.get('id', '?')
        probes = t.get('probes', [])
        if len(probes) < 3:
            results.append({'name': '线索:' + tid, 'ok': False, 'msg': 'probes < 3（%d）' % len(probes)})
        for p in probes:
            f = p.get('flag', '')
            if not f:
                results.append({'name': '线索:' + tid, 'ok': False, 'msg': '空 flag'})
            elif f not in flags:
                results.append({'name': '线索:' + tid, 'ok': False, 'msg': '孤儿 flag: %s（节点中无置位）' % f})

    ese = _extract_js_array(html, 'ENDING_ECHO')
    if ese is None:
        results.append({'name': '结局回响', 'ok': False, 'msg': 'ENDING_ECHO 缺失'})
    else:
        echoes = _parse_array(ese)
        if echoes is None:
            results.append({'name': '结局回响', 'ok': False, 'msg': 'ENDING_ECHO 解析失败'})
        else:
            empty = [e.get('pre', '') for e in echoes if not e.get('pre')]
            if empty:
                results.append({'name': '结局回响', 'ok': False, 'msg': '存在空 pre 条目'})
            else:
                results.append({'name': '结局回响', 'ok': True, 'msg': '%d 条回响' % len(echoes)})

    return {'name': '贯穿线索', 'ok': all(r['ok'] for r in results), 'results': results}
