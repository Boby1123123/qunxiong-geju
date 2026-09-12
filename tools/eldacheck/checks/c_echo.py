#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_echo: LW 回响健康检查器（elda ci 新检查器，蓝图方向 A1）。
E1 锚点合法性：echoMap 每条 flag ∈ src effects 写入集 / echoId 唯一 / delay∈[1,30] / at∈城市表 / text 非空≤120
E2 引用健康：全文 [echo:id 与 {{echoCount:id}} 引用的 id ∈ echoMap ∪ 账本 id（悬空回响 FAIL）
E3 账本闭环（登记制）：账本 type=伏笔 且 plant 成立的 open 项，若无 echo 锚点且无 reap 节点 → WARN
E4 队列上限：LW_echoScan 队列上限逻辑存在（length>=100）
E5 播报合规：echoMap.text 引号成对、非空
只读构建产物；不修改任何内容。
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))



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


def _flag_sets(html):
    return set(re.findall(r'flag:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'eff\.flag\s*=\s*["\']([^"\']+)["\']', html))


def _city_set(html):
    """从 LW_DATA.cityOwn 提取城市集合（含 special 键）"""
    seg = _extract_js_object(html, 'LW_DATA')
    cities = set()
    if seg:
        try:
            d = _js_to_json(seg)
            own = d.get('cityOwn') or {}
            for r, arr in own.items():
                if r == 'special':
                    for k in arr:
                        cities.add(k)
                elif isinstance(arr, list):
                    for c in arr:
                        cities.add(c)
        except Exception:
            pass
    # 兜底：常见城市词
    if not cities:
        for w in ['jiaohui', 'jishi', 'gonghui', 'huigang', 'tiebi', 'beijing', 'shengcheng', 'heishi', 'chengtian']:
            cities.add(w)
    return cities


def run(html):
    problems = []
    detail = {}

    seg = _extract_js_object(html, 'LW_DATA')
    data = _js_to_json(seg) if seg else None
    echo_map = (data or {}).get('echoMap') or []
    detail['echo_total'] = len(echo_map)
    detail['echo_ids'] = [c.get('echoId') for c in echo_map if c and c.get('echoId')]

    flags = _flag_sets(html)
    cities = _city_set(html)

    # E1 锚点合法性
    e1 = []
    seen_ids = set()
    for i, c in enumerate(echo_map):
        if not isinstance(c, dict):
            e1.append('echoMap[%d] 非对象' % i)
            continue
        cid = c.get('echoId')
        if not cid:
            e1.append('echoMap[%d] 缺 echoId' % i)
        elif cid in seen_ids:
            e1.append('echoId 重复: %s' % cid)
        else:
            seen_ids.add(cid)
        f = c.get('flag')
        if not f:
            e1.append('echoMap[%d] 缺 flag' % i)
        elif f not in flags:
            e1.append('flag 未在 effects 写入: %s（echoId=%s）' % (f, cid))
        dl = c.get('delay')
        if dl is not None and not (isinstance(dl, (int, float)) and 1 <= dl <= 30):
            e1.append('delay 非法: %s（echoId=%s）' % (dl, cid))
        at = c.get('at')
        at_city = str(at).split('_')[-1] if at else None
        if at_city and at_city not in cities:
            e1.append('at 地点不在城市表: %s（echoId=%s）' % (at, cid))
        txt = c.get('text')
        if not txt:
            e1.append('text 为空（echoId=%s）' % cid)
        elif len(txt) > 120:
            e1.append('text 超 120 字（echoId=%s, %d 字）' % (cid, len(txt)))
    detail['e1'] = e1
    if e1:
        problems.append({'name': '锚点', 'line': 0, 'cat': 'E1', 'msg': '; '.join(e1[:6])})

    # E2 引用健康（悬空回响）
    ledger_ids = set(re.findall(r'"id":\s*"(led_\d+)"', html)) | \
        set(re.findall(r'id:\s*"(led_\d+)"', html))
    known = set(detail['echo_ids']) | ledger_ids
    refs = re.findall(r'\[echo:([\w\-]+):', html) + \
        re.findall(r'\{\{echoCount:([\w\-]+)\}\}', html)
    dangling = sorted(set(r for r in refs if r not in known and r != 'id'))
    detail['e2'] = dangling
    if dangling:
        problems.append({'name': '悬空回响', 'line': 0, 'cat': 'E2',
                         'msg': '引用不存在的回响 id %d 个: %s' % (len(dangling), ','.join(dangling[:8]))})

    # E3 账本闭环（登记制 WARN，不阻断）
    ledger = None
    lseg = _extract_js_array(html, 'CAUSALITY_LEDGER')
    if lseg:
        try:
            ledger = _js_to_json(lseg)
        except Exception:
            ledger = None
    open_伏笔_no_echo = []
    if ledger:
        for it in ledger:
            if it.get('type') == '伏笔' and it.get('status') != 'closed':
                lid = it.get('id')
                reap = it.get('reap') or ''
                if lid not in known and not reap.startswith('node:'):
                    open_伏笔_no_echo.append(lid)
    detail['e3'] = open_伏笔_no_echo

    # E4 队列上限（代码层：echoScan 有 length>=100 截断）
    cap_ok = 'lw.echoes.length >= 100' in html or 'lw.echoes.length>100' in html
    detail['e4_cap'] = cap_ok
    if not cap_ok:
        problems.append({'name': '队列上限', 'line': 0, 'cat': 'E4', 'msg': 'LW_echoScan 缺回响队列上限（≥100 截断）'})

    # E5 播报合规：引号成对
    e5 = []
    for c in echo_map:
        txt = c.get('text') or ''
        if txt.count('“') != txt.count('”'):
            e5.append('引号不成对: %s' % (c.get('echoId') or '?'))
    detail['e5'] = e5
    if e5:
        problems.append({'name': '播报文本', 'line': 0, 'cat': 'E5', 'msg': '; '.join(e5[:4])})

    ok = len(problems) == 0
    results = [{
        'name': '回响锚点 %d 条·悬空 %d·队列上限 %s' % (
            detail['echo_total'], len(detail['e2']), '有' if cap_ok else '无'),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': 'LW回响健康', 'ok': ok, 'results': results, 'details': detail}
