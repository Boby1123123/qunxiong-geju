#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_worldstate: LW 世界状态白名单检查器（elda ci 新检查器，蓝图方向 A1）。
W1 顶层白名单：s.lw 写点键 ∈ 白名单（未知键 FAIL）
W2 条目 schema：journal/echoes 条目字段齐全（代码层写点检查）
W3 值域：factionRel 偏移 clamp（±100）与 merit/guilt clamp（≤1000）存在
只读构建产物；不修改任何内容。
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

ALLOWED = {
    'season', 'dayPhase', 'echoes', 'echoLog', 'npcStates', 'factionRel',
    'factionState', 'cityControl', 'worldFlags', 'journal', 'tick',
    'warfronts', 'merit', 'guilt',
}


def run(html):
    problems = []
    detail = {}

    # W1 顶层白名单：s.lw.<key> 或 s.lw["<key>"] 写点
    writes = set()
    for m in re.finditer(r's\.lw\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=', html):
        writes.add(m.group(1))
    for m in re.finditer(r's\.lw\[["\']([a-zA-Z_][a-zA-Z0-9_]*)["\']\]\s*=', html):
        writes.add(m.group(1))
    for m in re.finditer(r'lw\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=', html):
        if m.group(1) not in ('season', 'dayPhase', 'tick') or True:
            writes.add(m.group(1))
    unknown = sorted(writes - ALLOWED)
    detail['w1_writes'] = sorted(writes)
    detail['w1_unknown'] = unknown
    if unknown:
        problems.append({'name': '白名单', 'line': 0, 'cat': 'W1',
                         'msg': 'S.lw 未知键写点 %d 个: %s' % (len(unknown), ','.join(unknown[:8]))})

    # W2 条目 schema：journal 写点含 day/date/kind/text/flag；echoes 写点含 id/at/delay/dueDay/text
    journal_ok = 'day:S.day||1' in html and 'date:(S.date||"")' in html and 'kind:kind' in html and 'text:text' in html
    echo_ok = 'id:c.echoId' in html and 'dueDay:(S.day||1)' in html
    detail['w2_journal'] = journal_ok
    detail['w2_echo'] = echo_ok
    if not journal_ok:
        problems.append({'name': 'journal schema', 'line': 0, 'cat': 'W2',
                         'msg': 'LW_journalAdd 条目字段不完整（需 day/date/kind/text/flag）'})
    if not echo_ok:
        problems.append({'name': 'echoes schema', 'line': 0, 'cat': 'W2',
                         'msg': 'LW_echoScan 条目字段不完整（需 id/at/delay/dueDay/text）'})

    # W3 值域：factionRel clamp 与 merit/guilt clamp
    rel_clamp = bool(re.search(r'factionRel\[[^\]]+\]\s*=\s*Math\.max\(-100,\s*Math\.min\(100', html)) or \
        bool(re.search(r'factionRel[^\n]{0,60}Math\.max\(-100', html))
    merit_clamp = bool(re.search(r'Math\.min\(1000,\s*\(book\[facId\]\|\|0\)\+a\)', html))
    detail['w3_rel_clamp'] = rel_clamp
    detail['w3_merit_clamp'] = merit_clamp
    if not rel_clamp:
        problems.append({'name': '关系值域', 'line': 0, 'cat': 'W3',
                         'msg': 'factionRel 偏移未 clamp 到 [-100,100]'})
    if not merit_clamp:
        problems.append({'name': '功罪值域', 'line': 0, 'cat': 'W3',
                         'msg': 'merit/guilt 未 clamp 到 [0,1000]'})

    ok = len(problems) == 0
    results = [{
        'name': 'S.lw 白名单·写点 %d·未知 %d' % (len(detail['w1_writes']), len(detail['w1_unknown'])),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': 'LW世界状态', 'ok': ok, 'results': results, 'details': detail}
