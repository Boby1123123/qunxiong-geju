#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_anchor: 七锚之约终局检查（elda ci 第 25 检查器，M7 新增）。

1. 七锚账本：led_anchor_01~07 必须全部登记在 CAUSALITY_LEDGER
2. 七锚 flag：anchor_1~7 必须都在 effects 中被写入（S.flags 置位）
3. 终局可达：goldscale_10 → anchor_finale_1 的 go 必须存在；anchor_finale_1 节点存在
4. 线索链无死链：七锚线首节点（anchor_tower_1/mine_1/grave_1/vault_1/chen_1/church_1/oracle_1）
   必须全部存在且被 go/then 引用
5. 事件联动：事件池含 anchor_* 前缀事件（锚点异动播报）≥3 则
"""
import io, os, re, json
from . import find_node_ids

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


def _parse_ledger(html):
    seg = _extract_js_array(html, 'CAUSALITY_LEDGER')
    if not seg:
        return None
    try:
        seg2 = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', seg)
        return json.loads(seg2)
    except Exception:
        return None


def _flag_sets(html):
    return set(re.findall(r'flag:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'eff\.flag\s*=\s*["\']([^"\']+)["\']', html))


def _go_targets(html):
    return set(re.findall(r'go:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'then:\s*["\']([^"\']+)["\']', html)) | \
        set(re.findall(r'\.go\s*=\s*["\']([^"\']+)["\']', html))


def run(html):
    problems = []
    detail = {}
    ids = set(find_node_ids(html).keys())
    gos = _go_targets(html)
    flags = _flag_sets(html)

    # 1) 七锚账本登记
    ledger = _parse_ledger(html)
    if ledger is None:
        problems.append({'name': '锚账本', 'cat': '缺失', 'msg': 'CAUSALITY_LEDGER 缺失'})
        detail['anchor_ledger'] = '缺失'
    else:
        anchor_ids = [it['id'] for it in ledger if str(it.get('id', '')).startswith('led_anchor_')]
        missing = [('led_anchor_%02d' % i) for i in range(1, 8) if ('led_anchor_%02d' % i) not in anchor_ids]
        detail['anchor_ledger'] = '%d/7' % (7 - len(missing))
        if missing:
            problems.append({'name': '锚账本', 'cat': '缺失', 'msg': '账本缺 %s' % ','.join(missing)})

    # 2) 七锚 flag
    anchor_flags = ['anchor_%d' % i for i in range(1, 8)]
    miss_flags = [f for f in anchor_flags if f not in flags]
    detail['anchor_flags'] = '%d/7' % (7 - len(miss_flags))
    if miss_flags:
        problems.append({'name': '锚flag', 'cat': '缺失', 'msg': 'effects 未写入 %s' % ','.join(miss_flags)})

    # 3) 终局入口可达：goldscale_10 存在且其选项 go 指向 anchor_finale_1
    finale_link = 'anchor_finale_1' in ids and 'anchor_finale_1' in gos
    gs10 = 'goldscale_10' in ids
    # goldscale_10 → anchor_finale_1 的具体 go 检查
    m = re.search(r'N\["goldscale_10"\].{0,6000}?go:\s*["\'](anchor_finale_1)["\']', html, re.S)
    final_go_ok = bool(m)
    detail['finale_gate'] = 'goldscale_10=%s final_go=%s' % ('OK' if gs10 else '缺', 'OK' if final_go_ok else '未直连')
    if not gs10:
        problems.append({'name': '终局门', 'cat': '缺失', 'msg': 'goldscale_10 节点缺失'})
    if not finale_link:
        problems.append({'name': '终局门', 'cat': '缺失', 'msg': 'anchor_finale_1 缺失或未被引用'})
    if not final_go_ok:
        problems.append({'name': '终局门', 'cat': '未直连', 'msg': 'goldscale_10 未直接 go 到 anchor_finale_1（M7 应改回）'})

    # 4) 线索链无死链：七锚线首节点存在且被引用
    heads = ['anchor_tower_1', 'anchor_mine_1', 'anchor_grave_1', 'anchor_vault_1',
             'anchor_chen_1', 'anchor_church_1', 'anchor_oracle_1']
    dead_heads = [h for h in heads if h not in ids or h not in gos]
    detail['anchor_heads'] = '%d/7' % (7 - len(dead_heads))
    if dead_heads:
        problems.append({'name': '线索链', 'cat': '死链', 'msg': '锚线首节点缺失/无入边: %s' % ','.join(dead_heads)})

    # 5) 事件联动：anchor_* 前缀事件 ≥3 则（构建后 EVENT_POOL_EXT 为变量引用，直接按事件 id 正则匹配）
    anchor_events = len(re.findall(r'\bid:\s*"anchor_[a-z_]+"', html))
    detail['anchor_events'] = anchor_events
    if anchor_events < 3:
        problems.append({'name': '锚事件', 'cat': '缺失', 'msg': 'anchor_* 事件仅 %d 则（需 ≥3）' % anchor_events})

    ok = len(problems) == 0
    results = [{
        'name': '七锚终局 账本=%(anchor_ledger)s flag=%(anchor_flags)s 头=%(anchor_heads)s 事件=%(anchor_events)s 门=%(finale_gate)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:140] for p in problems[:5])),
    }]
    return {'name': '七锚终局', 'ok': ok, 'results': results, 'details': detail}
