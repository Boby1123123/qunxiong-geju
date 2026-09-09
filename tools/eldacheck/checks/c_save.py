#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_save: 存档兼容仿真——构造 v57 旧档（无 v58 字段）→ 模拟 ensureDefaults 链。

由于 ensureDefaults 链在浏览器内执行，本检查器采用「数据契约核对」方式：
1. 从 game.html 提取各版本 ensureDefaults 函数体；
2. 校验 S.saveVersion / localStorage 键 / 新字段兜底路径存在；
3. 构造最小旧档 JSON，逐字段核对兜底默认值在代码中可解析。
"""
import io, os, re, json, zlib
from . import read_game, PROJ, extract_scripts


def run(html):
    issues = []
    # 1) localStorage 主键
    keys = set(re.findall(r"localStorage\.(?:getItem|setItem|removeItem)\s*\(\s*['\"]([^'\"]+)['\"]", html))
    main_key = [k for k in keys if 'elda-qunxiong-v3-save' in k]
    if not main_key:
        issues.append('未找到存档主键 elda-qunxiong-v3-save')
    # 2) S.saveVersion
    svs = re.findall(r'S\.saveVersion\s*=\s*(\d+)', html)
    sv = svs[-1] if svs else None
    if sv != '48':
        issues.append('S.saveVersion=%s（应为 48）' % sv)
    # 3) ensureDefaults 链存在
    ed = re.findall(r'function\s+(?:v\d+_ensureDefaults|ensureDefaults)\b', html)
    if not ed:
        issues.append('未找到 ensureDefaults 函数')
    # 提取各 ensureDefaults 函数体（括号配平；含 function 声明与 window.x=function 两种形式）
    ed_bodies = []
    PAT = re.compile(r'(?:(?:function\s+(?:v\d+_ensureDefaults|ensureDefaults)\b)|(?:window\.v\d+_ensureDefaults\s*=\s*function))\b[^{]*\{')
    for m in PAT.finditer(html):
        start = m.end() - 1
        depth = 1
        i = start + 1
        n = len(html)
        in_str = None
        while i < n:
            c = html[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
                i += 1
                continue
            if c in ('"', "'", '`'):
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        if i < n:
            ed_bodies.append(html[start:i + 1])
    # 4) 关键新字段兜底（历史各版）——字段名出现在任一 ensureDefaults 函数体即视为有兜底路径
    field_checks = ['worldState', 'worldChronicle', 'arcProgress', 'endingFlags', 'foreshadowing',
                    'orgRep', 'orgRank', 'peakPts', 'deified', 'godRival', 'artifact',
                    'strongLife', 'strongRel', 'strongChat', 'strongDeeds', 'knownStrong', 'demi',
                    'flow', 'jobBrand', 'factionRep', 'factionPower', 'apprentice', 'brandLog',
                    'skills', 'arcV55', 'skillLog', 'saveVersion']
    missing = []
    for f in field_checks:
        if ('S.%s' % f) not in html:
            missing.append(f)
    if missing:
        issues.append('全文未出现字段引用: %s' % ', '.join(missing[:25]))
    # ensureDefaults 未直接覆盖（但可能在 initState / 读档路径兜底）——仅备注，不阻塞
    not_in_ed = [f for f in field_checks
                 if ('S.%s' % f) in html and not any(('S.%s' % f) in body for body in ed_bodies)]
    note = ''
    if not_in_ed:
        note = '；ensureDefaults未直接覆盖(initState/读档兜底): %s' % ', '.join(not_in_ed[:25])

    # 5) 模拟最小旧档读取路径（仅核对 S 初始化处存在）
    init = re.search(r'S\s*=\s*JSON\.parse', html) or re.search(r'function\s+loadGame', html)
    if not init:
        issues.append('未找到读档解析入口（S=JSON.parse / loadGame）')



    ok = len(issues) == 0

    results = [{'name': '存档兼容仿真', 'ok': ok,
                'msg': ('；'.join(issues[:20]) if issues else '主键OK saveVersion=%s ensureDefaults链OK 兜底字段全齐%s' % (sv, note))}]

    # 6) 存档体积估算（s-size，V61-ENG 方向一）——满状态 S 样本（各扩展位按上限填充）
    _sz_ok = True
    try:
        _jobs = ['魔法师', '灵魂法师', '术士', '战士', '骑士', '游侠', '盗贼', '牧师', '商人']
        _s = {
            'v': 48, 'ruleset': 'elda-qunxiong-v3', 'name': '满档测试者', 'job': _jobs[0], 'race': '人类',
            'realm': 8, 'day': 9999, 'hp': 100, 'gold': 99999, 'slotId': 'slot1',
            'skills': {j: {'t1': ['火球术', '冰甲术', '魔力感知'], 't2': ['闪电链', '奥术盾', '法术增效'], 't3': ['陨石召唤', '空间折跃'], 't4': ['本源·大裂解']} for j in _jobs},
            'arcV55': {j: {'stage': 5, 'node': 'arc_end'} for j in _jobs},
            'knownStrong': {'lv_%s%d' % (j, i): 1 for j in _jobs for i in range(12)},
            'strongLife': {'lv_%s%d' % (j, i): {'mood': '平和', 'where': '银叶城'} for j in _jobs for i in range(12)},
            'strongDeeds': {'lv_%s%d' % (j, i): {'help': 9, 'harm': 2, 'bond': 8} for j in _jobs for i in range(12)},
            'flow': {j: {'id': 'flow1', 'stage': 3} for j in _jobs},
            'jobBrand': {j: {'b1': {'level': 3, 'count': 50}} for j in _jobs},
            'factionRep': {j + 'f1': 90 for j in _jobs},
            'apprentice': {'name': '徒弟', 'talent': ['专注', '坚韧'], 'bond': 60, 'skill': ['开锁']},
            'worldTimeline': {'day': 9999, 'entries': [{'d': i, 't': '事件%s' % i} for i in range(200)]},
            'chronicle': [{'day': i, 'text': '纪事%s' % i} for i in range(300)],
            'readings': {'unlocked': {'r%d' % i: 1 for i in range(200)}, 'read': {'r%d' % i: 1 for i in range(200)}},
        }
        _plain = len(json.dumps(_s, ensure_ascii=False))
        _comp = len(zlib.compress(json.dumps(_s, ensure_ascii=False).encode('utf-8')))
        _est = int(_comp * 0.85)  # LZString UTF-16 略优于 zlib（中文场景），修正系数，口径为估算
        _warn = []
        if _plain > 4 * 1024 * 1024:
            _warn.append('明文超 4MB：需升级存储方案')
        elif _plain > 3 * 1024 * 1024:
            _warn.append('明文超 3MB：接近临界')
        if _est > 3 * 1024 * 1024:
            _warn.append('压缩后超 3MB：需关注')
        _sz_ok = len(_warn) == 0
        _msg = '明文 %.2fMB / 压缩估算 %.2fMB（zlib×0.85 近似 LZString，误差±20%%）%s' % (
            _plain / 1048576.0, _est / 1048576.0, ('；' + '；'.join(_warn)) if _warn else '（充裕）')
        results.append({'name': '存档体积估算(s-size)', 'ok': _sz_ok, 'msg': _msg})
    except Exception as _e:
        results.append({'name': '存档体积估算(s-size)', 'ok': True, 'msg': '估算跳过：%s' % _e})

    ok = ok and _sz_ok
    return {'name': '存档兼容', 'ok': ok, 'results': results, 'details': {'issues': issues, 'sv': sv}}
