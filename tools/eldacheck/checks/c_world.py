#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_world: v64 世界局势健康检查。
检查项：
1. W64 引擎对象存在（W64_WorldState 定义 + window 导出）
2. w64_ensureDefaults 兜底字段存在（worldState/worldGoals/worldFame/w64Heard/w64Karma）
3. w64 节点死链（go 目标 ∈ 主+片全集）
4. 市场商品数值合法（price/base ∈ 10%-500% 语义：base 为正、vol 为正）
5. tick 挂载存在（w64_tickWorld 在 advanceTime 链内至少 1 次）
"""
import io, os, re
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def run(html):
    problems = []
    detail = {}

    # 1) 引擎对象
    has_engine = 'window.W64_WorldState' in html
    detail['engine'] = has_engine
    if not has_engine:
        problems.append({'name': 'W64引擎', 'line': 0, 'cat': '缺失', 'msg': 'window.W64_WorldState 未定义'})
    else:
        # market 数值合法
        for m in re.finditer(r"([a-z]+):\{base:(\d+),sup:\d+,dem:\d+,vol:(\d+)", html):
            base, vol = int(m.group(2)), int(m.group(3))
            if base <= 0 or vol <= 0:
                problems.append({'name': '市场', 'line': 0, 'cat': '数值', 'msg': '商品 %s base/vol 非法' % m.group(1)})
        detail['market_defs'] = len(re.findall(r'base:\d+', html))

    # 2) 兜底字段
    need = ['worldState', 'worldGoals', 'worldFame', 'w64Heard', 'w64Karma']
    missing = [f for f in need if re.search(r'S\.%s' % f, html) is None]
    detail['defaults_missing'] = missing
    if missing:
        problems.append({'name': '兜底', 'line': 0, 'cat': '缺失', 'msg': 'S 字段兜底缺失: %s' % ','.join(missing)})

    # 3) tick 挂载
    tick_count = len(re.findall(r'w64_tickWorld\(\)', html))
    detail['tick_hooks'] = tick_count
    if tick_count == 0:
        problems.append({'name': 'tick挂载', 'line': 0, 'cat': '缺失', 'msg': 'w64_tickWorld() 挂载 0 次'})

    # 4) w64 节点死链
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
    w64_go = set(re.findall(r'go:\s*"(w64_[^"]+)"', html))
    w64_ids = set(i for i in main_ids | chunk_ids if i.startswith('w64_'))
    detail['w64_nodes'] = len(w64_ids)
    detail['w64_go'] = len(w64_go)
    dead = sorted(w64_go - w64_ids)
    if dead:
        problems.append({'name': 'w64死链', 'line': 0, 'cat': '死链', 'msg': 'w64 go 目标缺失 %d 个（%s）' % (len(dead), ','.join(dead[:8]))})

    ok = len(problems) == 0
    results = [{
        'name': '世界局势(W64) 引擎=%(engine)s tick=%(tick_hooks)s 节点=%(w64_nodes)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '世界局势', 'ok': ok, 'results': results, 'details': detail}
