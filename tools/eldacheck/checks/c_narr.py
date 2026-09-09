#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_narr: v66 叙事连续性健康检查。
1. 引擎对象存在（window.v66_continuity / V66_BRIDGES / V66_ENTRY_CONT）
2. S.memories / S.npcLedger / S.loreDiscovered 兜底（v66_ensureDefaults）
3. v66 节点死链（go 目标 ∈ 主+片全集）
4. 入口接续映射目标合法（V66_ENTRY_CONT 的 key 必须存在于节点集）
5. writeNext 叙事包装挂载（v66_continuity 出现在 writeNext 定义附近）
"""
import io, os, re
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def run(html):
    problems = []
    detail = {}

    # 1) 引擎对象
    need_engine = ['v66_contFor', 'V66_BRIDGES', 'V66_ENTRY_CONT']
    missing = [k for k in need_engine if k not in html]
    detail['engine_ok'] = len(missing) == 0
    if missing:
        problems.append({'name': 'V66引擎', 'line': 0, 'cat': '缺失', 'msg': '未定义: %s' % ','.join(missing)})

    # 2) S 兜底
    for f in ['S.memories', 'S.npcLedger', 'S.loreDiscovered']:
        if re.search(r'%s\s*=' % re.escape(f), html) is None:
            problems.append({'name': '兜底', 'line': 0, 'cat': '缺失', 'msg': '%s 无兜底赋值' % f})

    # 3) v66 节点死链
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
    v66_go = set(re.findall(r'go:\s*"(v66_[^"]+)"', html))
    v66_ids = set(i for i in main_ids | chunk_ids if i.startswith('v66_'))
    detail['v66_nodes'] = len(v66_ids)
    detail['v66_go'] = len(v66_go)
    dead = sorted(v66_go - v66_ids)
    if dead:
        problems.append({'name': 'v66死链', 'line': 0, 'cat': '死链', 'msg': 'v66 go 目标缺失 %d 个（%s）' % (len(dead), ','.join(dead[:8]))})

    # 4) 入口接续映射目标合法
    cont_keys = set(re.findall(r"V66_ENTRY_CONT\s*=\s*\{(.*?)\};", html, re.S))
    mapped = set()
    for seg in cont_keys:
        mapped |= set(re.findall(r"['\"]([a-z0-9_]+)['\"]\s*:", seg))
    all_ids = main_ids | chunk_ids
    bad = sorted(m for m in mapped if m not in all_ids)
    detail['cont_mapped'] = len(mapped)
    if bad:
        problems.append({'name': '接续映射', 'line': 0, 'cat': '死链', 'msg': 'V66_ENTRY_CONT 目标缺失 %d 个（%s）' % (len(bad), ','.join(bad[:8]))})

    # 5) writeNext 包装挂载（引擎独立块在文件末尾，取最后一个定义，兼容有无空格）
    wnx_list = [m.start() for m in re.finditer(r'window\.writeNext\s*=\s*function', html)]
    if not wnx_list:
        problems.append({'name': '挂载', 'line': 0, 'cat': '缺失', 'msg': 'writeNext 定义未找到'})
    else:
        wnx = wnx_list[-1]
        seg = html[wnx:wnx + 4000]
        detail['wrapped'] = 'v66_contFor' in seg
        if 'v66_contFor' not in seg:
            problems.append({'name': '挂载', 'line': 0, 'cat': '缺失', 'msg': 'writeNext 包装未含 v66_contFor'})

    ok = len(problems) == 0
    results = [{
        'name': '叙事连续性(V66) 引擎=%(engine_ok)s 节点=%(v66_nodes)s 接续=%(cont_mapped)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '叙事连续性', 'ok': ok, 'results': results, 'details': detail}
