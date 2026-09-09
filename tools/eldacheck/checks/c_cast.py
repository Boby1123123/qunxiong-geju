#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_cast: v66 群像记忆健康检查。
1. W66_PROFILES 存在且每条四件套齐全（habit/tagline/desire/goal）
2. v66_castProfile 函数存在
3. S.npcLedger / S.memories 兜底
4. 账本/物件 API 存在（v66_ledgerAdd / v66_ledgerRecall / v66_objectMemory / v66_objectRecall）
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))


def run(html):
    problems = []
    detail = {}

    # 1) 档案四件套
    if "W66_PROFILES" not in html:
        problems.append({'name': '档案', 'line': 0, 'cat': '缺失', 'msg': 'W66_PROFILES 未定义'})
        detail['profiles'] = 0
    else:
        entries = re.findall(r"(?:window\.)?W66_PROFILES\['([^']+)'\]=\{ *habit:'([^']*)', *tagline:'([^']*)', *desire:'([^']*)', *goal:'([^']*)'\s*\}", html)
        detail['profiles'] = len(entries)
        empty = [e[0] for e in entries if not (e[1] and e[2] and e[3] and e[4])]
        if len(entries) < 16:
            problems.append({'name': '档案', 'line': 0, 'cat': '数量', 'msg': 'W66_PROFILES 仅 %d 条（要求 ≥16）' % len(entries)})
        if empty:
            problems.append({'name': '档案', 'line': 0, 'cat': '缺字段', 'msg': '四件套有空项: %s' % ','.join(empty[:6])})
        # id 必须在 STRONG_V53 或剧情常驻内
        for sid, *_ in entries:
            if sid not in html:
                problems.append({'name': '档案', 'line': 0, 'cat': '来源', 'msg': '档案 id %s 在 STRONG 中不可考（非剧情常驻需确认）' % sid})

    # 2) castProfile
    if 'v66_castProfile' not in html:
        problems.append({'name': 'API', 'line': 0, 'cat': '缺失', 'msg': 'v66_castProfile 未定义'})

    # 3) S 兜底
    for f in ['S.npcLedger', 'S.memories']:
        if re.search(r'%s\s*=' % re.escape(f), html) is None:
            problems.append({'name': '兜底', 'line': 0, 'cat': '缺失', 'msg': '%s 无兜底赋值' % f})

    # 4) 账本/物件 API
    for api in ['v66_ledgerAdd', 'v66_ledgerRecall', 'v66_objectMemory', 'v66_objectRecall']:
        if api not in html:
            problems.append({'name': 'API', 'line': 0, 'cat': '缺失', 'msg': '%s 未定义' % api})

    ok = len(problems) == 0
    results = [{
        'name': '群像记忆(V66) 档案=%d 条' % detail.get('profiles', 0),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '群像记忆', 'ok': ok, 'results': results, 'details': detail}
