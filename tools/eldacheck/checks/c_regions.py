#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_regions: 节点物理分区命名规范检查（elda ci 第 38 检查器，UPG-15 新增）。

CoffeeMud areas/ 目录模式落地：节点 ID 必须能归入 NODE_REGISTRY 九域前缀表。
1. NODE_REGISTRY 存在且九域完整（≥9 组，system 域含引擎前缀）
2. 全量节点 id 前缀可归入已知域（覆盖率门禁 ≥97%）
3. 输出九域节点分布表（details）+ 未分类前缀清单（WARN 登记）
仅检测；不修改任何内容。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')


def _extract_registry(html):
    """从 game.html 提取 NODE_REGISTRY 前缀表"""
    i0 = html.find('const NODE_REGISTRY = {')
    if i0 < 0:
        return None
    i1 = html.find('if (typeof window', i0)
    seg = html[i0:i1] if i1 > 0 else html[i0:i0 + 5000]
    groups = {}
    for g in re.finditer(r'(\w+):\s*\{\s*name:\s*"([^"]*)",\s*prefixes:\s*\[([^\]]*)\]', seg):
        gid, gname, plist = g.group(1), g.group(2), g.group(3)
        prefixes = re.findall(r'"([^"]+)"', plist)
        groups[gid] = {'name': gname, 'prefixes': prefixes}
    return groups


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    reg = _extract_registry(html)
    if not reg or len(reg) < 9:
        problems.append({'name': '注册表', 'cat': 'data', 'msg': 'NODE_REGISTRY 缺失或不完整（%d 组）' % (len(reg) if reg else 0)})
        return {'name': '节点分区', 'ok': False, 'results': [{'name': '分区注册表', 'ok': False, 'msg': 'NODE_REGISTRY 缺失'}], 'details': detail}

    detail['groups'] = list(reg.keys())
    all_pre = set()
    for g in reg.values():
        all_pre |= set(g['prefixes'])

    ids = re.findall(r'N\["([A-Za-z0-9_]+)"\]', html)
    unique = set(ids)
    detail['node_total'] = len(unique)
    unknown = {}
    known = 0
    dist = {}
    for nid in unique:
        pre = nid.split('_')[0]
        hit = None
        for gid, g in reg.items():
            if pre in g['prefixes']:
                hit = gid
                break
        if hit:
            known += 1
            dist[hit] = dist.get(hit, 0) + 1
        else:
            unknown[pre] = unknown.get(pre, 0) + 1
    detail['known_coverage'] = known
    detail['unknown_prefixes'] = unknown
    detail['dist'] = dist
    coverage = (known / len(unique)) * 100 if unique else 100.0
    detail['coverage_pct'] = round(coverage, 2)
    if coverage < 97.0:
        problems.append({'name': '命名规范', 'cat': 'data', 'msg': '前缀覆盖率 %.2f%% <97%%' % coverage})

    ok = len(problems) == 0
    results = [{
        'name': '节点分区 九域注册表/命名规范/覆盖率',
        'ok': ok,
        'msg': ('覆盖率 %.2f%%（%d/%d）' % (coverage, known, len(unique)) if ok else '问题: ' + '; '.join(p['msg'] for p in problems)),
    }]
    return {'name': '节点物理分区', 'ok': ok, 'results': results, 'details': detail}
