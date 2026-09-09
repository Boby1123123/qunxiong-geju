#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_ui: v67 UI 系统健康检查。
检查项：
1. v67_ui 单例存在（window.v67_ui + stack/openDepth）
2. #modal 唯一（id="modal" DOM 定义 = 1）
3. 兼容别名：closePanel/closeModal 指向 v67_ui.close
4. 选项锁：choose 入口 __v67Busy + showOptions 尾部解锁
5. 门禁表 V67_GATES 完整 + passNode 存在于节点集
6. 成本器 v67_costTrain/v67_costExplore/v67_trainSite 存在 + trainStreak 兜底
7. 地图 v67_map 存在（open/zoom/travel 方法）+ v34_travelTo 转发 travelTo
8. 令牌层 primitive/semantic 引用无悬空（var(--text-primary) 有定义）
9. v67 死链：v67_gate passNode 目标 ∈ 主+片全集
"""
import io, os, re
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def run(html):
    problems = []
    detail = {}

    # 1) v67_ui 单例
    has_ui = 'window.v67_ui' in html and 'stack' in html
    detail['ui'] = has_ui
    if not has_ui:
        problems.append({'name': 'v67_ui单例', 'line': 0, 'cat': '缺失', 'msg': 'window.v67_ui 未定义'})

    # 2) #modal 唯一
    modal_cnt = len(re.findall(r'id=["\']modal["\']', html))
    detail['modal_cnt'] = modal_cnt
    if modal_cnt != 1:
        problems.append({'name': '#modal唯一', 'line': 0, 'cat': '重复', 'msg': 'id="modal" 出现 %d 次（需 1）' % modal_cnt})

    # 3) 兼容别名（函数体转发 v67_ui.close）
    close_modal_fwd = re.search(r'function closeModal\(\)\{[^}]*v67_ui\.close\(\)', html) is not None
    close_panel_fwd = re.search(r'function closePanel\(\)\{[^}]*v67_ui\.close\(\)', html) is not None
    detail['alias'] = close_modal_fwd and close_panel_fwd
    if not (close_modal_fwd and close_panel_fwd):
        problems.append({'name': '关闭别名', 'line': 0, 'cat': '缺失', 'msg': 'closePanel/closeModal 未统一指向 v67_ui.close'})

    # 4) 选项锁
    busy_check = re.search(r'if\s*\(\s*window\.__v67Busy\s*\)', html) is not None
    unlock_in_show = re.search(r'showOptions[^}]*__v67Busy\s*=\s*false', html, re.S) is not None or \
                     'function showOptions' in html and html.count('__v67Busy = false') >= 2
    detail['busy'] = busy_check
    detail['unlock'] = unlock_in_show
    if not busy_check:
        problems.append({'name': '选项锁', 'line': 0, 'cat': '缺失', 'msg': 'choose 入口无 __v67Busy 检查'})
    if not unlock_in_show:
        problems.append({'name': '解锁路径', 'line': 0, 'cat': '缺失', 'msg': 'showOptions 尾部未见解锁'})

    # 5) 门禁表
    gate_table = html.count('window.V67_GATES') > 0 or html.count('V67_GATES') > 0
    gate_fn = 'function v67_gate' in html
    detail['gate_table'] = gate_table
    detail['gate_fn'] = gate_fn
    if not (gate_table and gate_fn):
        problems.append({'name': '门禁系统', 'line': 0, 'cat': '缺失', 'msg': 'V67_GATES/v67_gate 缺失'})
    # passNode 存在性
    main_ids = set(find_node_ids(html).keys())
    chunk_ids = set()
    d = os.path.join(ROOT, 'chunks')
    if os.path.isdir(d):
        for fn in os.listdir(d):
            if fn.startswith('v62_') and fn.endswith('.js'):
                try:
                    t = io.open(os.path.join(d, fn), encoding='utf-8').read()
                except Exception:
                    t = ''
                chunk_ids |= set(re.findall(r'nodes\["([^"]+)"\]\s*=\s*function', t))
    all_ids = main_ids | chunk_ids
    gate_go = set(re.findall(r'passNode\s*:\s*"([^"]+)"', html))
    dead_gate = sorted(g for g in gate_go if g not in all_ids)
    detail['gate_go'] = len(gate_go)
    detail['gate_dead'] = dead_gate
    if dead_gate:
        problems.append({'name': '门禁死链', 'line': 0, 'cat': '死链', 'msg': 'passNode 不存在: %s' % ','.join(dead_gate[:5])})

    # 6) 成本器
    cost_fn = ['v67_costTrain', 'v67_costExplore', 'v67_trainSite', 'v67_ensureDefaults']
    missing_cost = [f for f in cost_fn if ('window.%s' % f) not in html]
    detail['cost_missing'] = missing_cost
    if missing_cost:
        problems.append({'name': '成本器', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(missing_cost)})
    if 'trainStreak' not in html:
        problems.append({'name': '疲劳字段', 'line': 0, 'cat': '缺失', 'msg': 'S.trainStreak 兜底缺失'})

    # 7) 地图
    map_fn = ['v67_map.open', 'v67_map.zoom', 'v67_map.travel']
    missing_map = [f for f in map_fn if f not in html]
    detail['map_missing'] = missing_map
    if missing_map:
        problems.append({'name': '地图单例', 'line': 0, 'cat': '缺失', 'msg': 'v67_map 方法缺失: %s' % ','.join(missing_map)})
    if 'window.travelTo){ travelTo(id)' not in html and 'if(window.travelTo)' not in html:
        problems.append({'name': '旅行转发', 'line': 0, 'cat': '缺失', 'msg': 'v34_travelTo 未转发 travelTo'})

    # 8) 令牌悬空
    used = set(re.findall(r'var\((--[a-z0-9-]+)\)', html))
    defined = set(re.findall(r'(--[a-z0-9-]+)\s*:', html))
    dangling = sorted(u for u in used if u not in defined)
    detail['dangling_tokens'] = dangling[:10]
    if dangling:
        problems.append({'name': '令牌悬空', 'line': 0, 'cat': '缺失', 'msg': '未定义: %s' % ','.join(dangling[:8])})

    # 9) v67 死链
    v67_go = set(re.findall(r'go:\s*"(v67_[^"]+)"', html))
    v67_ids = set(i for i in all_ids if i.startswith('v67_'))
    dead_v67 = sorted(v67_go - v67_ids)
    detail['v67_go'] = len(v67_go)
    detail['v67_dead'] = dead_v67
    if dead_v67:
        problems.append({'name': 'v67死链', 'line': 0, 'cat': '死链', 'msg': 'go 目标不存在: %s' % ','.join(dead_v67[:5])})

    ok = not problems
    results = [
        {'name': p['name'], 'ok': False, 'msg': p['msg']}
        for p in problems
    ]
    if ok:
        results.append({'name': 'UI系统', 'ok': True, 'msg': 'v67_ui 单例/#modal 唯一/选项锁/门禁/成本/地图/令牌/死链 全部健康'})
    return {
        'name': 'UI系统检查',
        'ok': ok,
        'results': results,
        'detail': detail,
    }
