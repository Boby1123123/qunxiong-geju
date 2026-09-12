#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_warfront: LW 战争引擎检查器（elda ci 新检查器，蓝图方向 B1/B3）。
BF1 战场表合法：WARFRONTS atk/def ∈ factions / cities ∈ 城市表 / winAt>0 / weight>0
BF2 战局状态机：warfronts phase 取值 ∈ {僵持,推进,易主,停战}（引擎写点）
BF3 城市控制：cityControl 写点 city ∈ 城市表 / owner ∈ factions
BF4 功罪值域：merit/guilt clamp ≤1000（代码层）
BF5 增强不覆盖：无改写 WORLD_EVENTS 固定日程（红线守护）
BF6 引用健康：cond.deed / eff.war 引用的 warfront id 存在
只读构建产物；不修改任何内容。
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

PHASES = {'僵持', '推进', '易主', '停战'}



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
    factions = set((data or {}).get('factions') or {})
    warfronts = (data or {}).get('warfronts') or []
    city_own = (data or {}).get('cityOwn') or {}
    cities = set()
    for r, arr in city_own.items():
        if r == 'special':
            for k in arr:
                cities.add(k)
        elif isinstance(arr, list):
            for c in arr:
                cities.add(c)

    detail['warfront_total'] = len(warfronts)
    detail['warfront_ids'] = [f.get('id') for f in warfronts if f and f.get('id')]

    # BF1 战场表合法
    bf1 = []
    if not warfronts:
        bf1.append('WARFRONTS 为空')
    for f in warfronts:
        if not isinstance(f, dict):
            bf1.append('非对象')
            continue
        if not f.get('id'):
            bf1.append('缺 id')
        if f.get('atk') not in factions:
            bf1.append('%s atk=%s 非势力' % (f.get('id'), f.get('atk')))
        if f.get('def') not in factions:
            bf1.append('%s def=%s 非势力' % (f.get('id'), f.get('def')))
        for c in f.get('cities') or []:
            if c not in cities:
                bf1.append('%s 城市 %s 不在城市表' % (f.get('id'), c))
        if not f.get('winAt') or f.get('winAt') <= 0:
            bf1.append('%s winAt 非法' % f.get('id'))
        if not f.get('weight') or f.get('weight') <= 0:
            bf1.append('%s weight 非法' % f.get('id'))
    detail['bf1'] = bf1
    if bf1:
        problems.append({'name': '战场表', 'line': 0, 'cat': 'BF1', 'msg': '; '.join(bf1[:6])})

    # BF2 战局状态机（引擎写点 phase）
    bf2 = []
    for m in re.finditer(r'w\.phase\s*=\s*["\']([^"\']+)["\']', html):
        if m.group(1) not in PHASES:
            bf2.append('phase=%s' % m.group(1))
    detail['bf2'] = bf2
    if bf2:
        problems.append({'name': '战局状态', 'line': 0, 'cat': 'BF2', 'msg': '; '.join(bf2[:6])})

    # BF3 城市控制：cityControl 写点
    bf3 = []
    for m in re.finditer(r'lw\.cityControl\[["\']([^"\']+)["\']\]\s*=\s*["\']([^"\']+)["\']', html):
        city, owner = m.group(1), m.group(2)
        if city not in cities:
            bf3.append('cityControl.%s 非城市' % city)
        if owner not in factions:
            bf3.append('cityControl.%s owner=%s 非势力' % (city, owner))
    detail['bf3'] = bf3
    if bf3:
        problems.append({'name': '城市控制', 'line': 0, 'cat': 'BF3', 'msg': '; '.join(bf3[:6])})

    # BF4 功罪值域（clamp 存在）
    bf4 = 'Math.min(1000' in html and 'Math.max(1' in html
    detail['bf4'] = bf4
    if not bf4:
        problems.append({'name': '功罪值域', 'line': 0, 'cat': 'BF4',
                         'msg': 'merit/guilt clamp（[1,1000]）缺失'})

    # BF5 增强不覆盖：不改写 WORLD_EVENTS 固定日程
    bf5 = re.findall(r'WORLD_EVENTS\[[a-zA-Z_]+\]\.day\s*=', html)
    detail['bf5'] = bf5
    if bf5:
        problems.append({'name': '红线守护', 'line': 0, 'cat': 'BF5',
                         'msg': '存在改写 WORLD_EVENTS.day 的代码 %d 处' % len(bf5)})

    # BF6 引用健康：eff.war / cond.deed 引用的 id
    known = set(detail['warfront_ids'])
    refs = set(re.findall(r'eff\.war\s*=\s*\[\s*\{\s*id:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'\{\s*id:\s*["\'](wf_[a-z_]+)["\']', html))
    dangling = sorted(r for r in refs if r and r not in known)
    detail['bf6'] = dangling
    if dangling:
        problems.append({'name': '悬空战场', 'line': 0, 'cat': 'BF6',
                         'msg': '引用不存在的 warfront %d 个: %s' % (len(dangling), ','.join(dangling[:6]))})

    ok = len(problems) == 0
    results = [{
        'name': '战场 %d 条·表合法 %s·红线 %s' % (
            len(warfronts), '是' if not bf1 else '否', '守' if not bf5 else '破'),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': 'LW战争引擎', 'ok': ok, 'results': results, 'details': detail}
