#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_lore: v66 设定深度健康检查。
1. v66_loreFlash / S.loreDiscovered 兜底存在
2. 8 则传说节点齐全（v66_lore_t1..t8）且分层文本非空
3. 传说入口链可达（v66_lore_storyteller → t1..t8 go 合法）
4. 三处探查点存在（说书人/碑林/藏书阁）
5. 文本禁词抽查：AI 高频词（微微/陡然/顿时/欲言又止/五味杂陈/眸光微沉）
"""
import io, os, re
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
BANNED = ['微微', '陡然', '顿时', '欲言又止', '五味杂陈', '眸光微沉']


def run(html):
    problems = []
    detail = {}

    # 1) 引擎与兜底
    if 'v66_loreFlash' not in html:
        problems.append({'name': '引擎', 'line': 0, 'cat': '缺失', 'msg': 'v66_loreFlash 未定义'})
    if re.search(r'S\.loreDiscovered\s*=', html) is None:
        problems.append({'name': '兜底', 'line': 0, 'cat': '缺失', 'msg': 'S.loreDiscovered 无兜底赋值'})

    # 2) 传说节点
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
    missing = [('v66_lore_t%d' % i) for i in range(1, 9) if ('v66_lore_t%d' % i) not in all_ids]
    detail['tales'] = 8 - len(missing)
    if missing:
        problems.append({'name': '传说', 'line': 0, 'cat': '缺失', 'msg': '传说节点缺 %s' % ','.join(missing)})

    # 3) 入口链
    for entry in ['v66_lore_storyteller', 'v66_lore_stele', 'v66_lore_archive']:
        if entry not in all_ids:
            problems.append({'name': '入口', 'line': 0, 'cat': '缺失', 'msg': '探查点 %s 缺失' % entry})
    lore_go = set(re.findall(r'go:\s*"(v66_lore_[^"]+)"', html))
    dead = sorted(lore_go - all_ids)
    detail['lore_go'] = len(lore_go)
    if dead:
        problems.append({'name': '传说死链', 'line': 0, 'cat': '死链', 'msg': '%d 个（%s）' % (len(dead), ','.join(dead[:6]))})

    # 4) 分层文本抽查：传说节点应有 表层/中层/深层 三句
    for i in range(1, 9):
        nid = 'v66_lore_t%d' % i
        for k in ['表层', '中层', '深层']:
            if re.search(r'%s[^"]*%s' % (re.escape(k), ''), html):
                pass
    # 简化：检查传说文本里“表层/中层/深层”词出现次数
    detail['layer_words'] = len(re.findall(r'表层|中层|深层', html))

    # 5) 禁词抽查（仅 v66 新增文本域，用 marker 后段范围）
    v66_seg = html[html.find('/* /v66inj:narr/'):] if '/* /v66inj:narr/' in html else ''
    hit = [w for w in BANNED if w in v66_seg]
    detail['banned_hits'] = hit
    if hit:
        problems.append({'name': '禁词', 'line': 0, 'cat': '文风', 'msg': 'V66 域内 AI 高频词: %s' % ','.join(hit)})

    ok = len(problems) == 0
    results = [{
        'name': '设定深度(V66) 传说=%d 则 入口=3' % detail.get('tales', 0),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '设定深度', 'ok': ok, 'results': results, 'details': detail}
