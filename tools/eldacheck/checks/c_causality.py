#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_causality: CM-3 因果/伏笔账本 + 设定词冻结检查（elda ci 第 19 检查器）。
1. 账本解析：window.CAUSALITY_LEDGER（≥30 条）必须存在且字段合法
2. 自动核销：plant 埋设成立 && reap 回收成立 → closed；plant 成立但 reap 未达 → open（未回收伏笔清单）
3. 设定词冻结：CAUSALITY_WORDS 每词必须在 game.html 中出现（所属卷节点域已并入单文件）
4. 锚点规则：flag:<name> = effects 中写入过该 flag；node:<id> = 节点存在且被 go/then 引用；关键词 = 词频>0
"""
import io, os, re, json
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def _extract_js_array(html, var_name):
    """提取 window.VAR = [ ... ]; 的数组文本（配平方括号）"""
    m = re.search(r'window\.%s\s*=\s*\[' % re.escape(var_name), html)
    if not m:
        return None
    i = m.end() - 1  # 指向 '['
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


def _parse_ledger(html):
    seg = _extract_js_array(html, 'CAUSALITY_LEDGER')
    if not seg:
        return None
    try:
        # 用 json 解析：JS 数组/对象字面量接近 JSON，但键未加引号——先做简单规整
        # 正则把 {id: 转 {"id":，字段: 转 "字段":
        seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
        return json.loads(seg2)
    except Exception:
        return None


def _parse_words(html):
    seg = _extract_js_array(html, 'CAUSALITY_WORDS')
    if not seg:
        return None
    try:
        seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
        return json.loads(seg2)
    except Exception:
        return None


def _flag_sets(html):
    """effects 中 flag 写入点：flag:"x" 与 flag:'x'（不含读取处的 flags 判断）"""
    return set(re.findall(r'flag:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'eff\.flag\s*=\s*["\']([^"\']+)["\']', html))


def _go_targets(html):
    return set(re.findall(r'go:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'then:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'\.go\s*=\s*["\']([^"\']+)["\']', html))


def run(html):
    problems = []
    detail = {}
    ledger = _parse_ledger(html)
    words = _parse_words(html)

    if ledger is None or len(ledger) < 30:
        problems.append({'name': '账本', 'line': 0, 'cat': '缺失', 'msg': 'CAUSALITY_LEDGER 缺失或 <30 条'})
        detail['ledger_count'] = 0
    else:
        detail['ledger_count'] = len(ledger)
        ids = set(find_node_ids(html).keys())
        gos = _go_targets(html)
        flags = _flag_sets(html)

        def anchor_ok(anchor):
            if not anchor:
                return False
            if anchor.startswith('flag:'):
                return anchor[5:] in flags
            if anchor.startswith('node:'):
                nid = anchor[5:]
                # 静态 go/then 或运行时 curNode='x' 动态跳转均可视为可达
                dyn = ('curNode=%s' % nid) in html.replace('"', '').replace("'", '')
                return nid in ids and (nid in gos or dyn)
            return html.count(anchor) > 0

        open_items, closed_items = [], []
        overdue = []
        high_open = []
        for it in ledger:
            plant_ok = anchor_ok(it.get('plant'))
            reap_ok = anchor_ok(it.get('reap'))
            if plant_ok and reap_ok:
                it['status'] = 'closed'
                closed_items.append(it['id'])
            elif plant_ok:
                open_items.append((it['id'], it.get('world', '?'), it.get('desc', '')[:30]))
                # UPG-05 伏笔超期提醒：importance>=4 且回收点失踪（reap node: 不存在或未被引用）
                imp = it.get('importance', 1)
                reap = it.get('reap', '')
                if imp >= 4:
                    high_open.append(it['id'])
                if imp >= 4 and isinstance(reap, str) and reap.startswith('node:'):
                    nid2 = reap[5:]
                    dyn = ('curNode=%s' % nid2) in html.replace('"', '').replace("'", '')
                    reachable = nid2 in ids and (nid2 in gos or dyn)
                    if not reachable:
                        overdue.append({'id': it['id'], 'reap': nid2, 'desc': (it.get('desc') or '')[:40]})
        detail['closed'] = len(closed_items)
        detail['open'] = len(open_items)
        detail['unreaped'] = open_items
        detail['overdue'] = overdue
        detail['high_open'] = high_open
        # open 伏笔为叙事待回收项，输出清单但不拦发布（FAIL 仅限账本/设定词缺失/超期回收点失踪）
        if overdue:
            problems.append({'name': '伏笔超期', 'line': 0, 'cat': '超期',
                             'msg': '高优伏笔回收点失踪 %d 项: %s'
                             % (len(overdue), ','.join(o['id'] + '→' + o['reap'] for o in overdue[:6]))})

    if words is None or len(words) < 20:
        problems.append({'name': '设定词', 'line': 0, 'cat': '缺失', 'msg': 'CAUSALITY_WORDS 缺失或 <20 词'})
        detail['words_total'] = 0
        detail['words_cover'] = 0
    else:
        missing = [w.get('word') for w in words if html.count(w.get('word', '')) == 0]
        detail['words_total'] = len(words)
        detail['words_cover'] = len(words) - len(missing)
        if missing:
            problems.append({'name': '设定词冻结', 'line': 0, 'cat': '缺失', 'msg': '缺失 %d 词: %s'
                             % (len(missing), ','.join(missing[:8]))})

    ok = len(problems) == 0
    results = [{
        'name': '因果账本 %(ledger_count)s 项·核销 closed=%(closed)s open=%(open)s·超期=%(overdue_count)s·设定词 %(words_cover)s/%(words_total)s' % dict(
            ledger_count=detail.get('ledger_count', 0), closed=detail.get('closed', 0),
            open=detail.get('open', 0), overdue_count=len(detail.get('overdue', [])),
            words_cover=detail.get('words_cover', 0), words_total=detail.get('words_total', 0)),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': '因果/伏笔账本', 'ok': ok, 'results': results, 'details': detail}
