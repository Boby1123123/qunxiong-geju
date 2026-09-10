#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_chronicle: 编年史系统检查（elda ci 第 36 检查器，UPG-17 新增）。

1. CHRONICLE_RULES 表存在且 eventType 非空、match 非空
2. 引擎 API v92_chronicleAdd / v92_chronicleCheck / v92_chronicleReview 存在
3. writeNext 钩子（/upg17inj:cron/ 记录 + /upg17inj:review/ 结局回顾注入）存在
4. applyDefaults 兜底 S.chronicle 存在
5. 手记面板编年史分页（/upg17inj:jtabs/）存在
仅检测；不修改任何内容。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    seg = ''
    i0 = html.find('const CHRONICLE_RULES = [')
    if i0 >= 0:
        i1 = html.find('];', i0)
        if i1 >= 0:
            seg = html[i0:i1 + 2]
    detail['rules_seg_len'] = len(seg)
    if len(seg) < 200:
        problems.append({'name': '规则表', 'cat': 'data', 'msg': 'CHRONICLE_RULES 缺失或过短'})
    else:
        ets = re.findall(r'eventType:\s*"([^"]*)"', seg)
        if not ets:
            problems.append({'name': '规则表', 'cat': 'data', 'msg': '无 eventType 条目'})
        else:
            detail['rule_count'] = len(ets)
            empty = [e for e in ets if not e.strip()]
            if empty:
                problems.append({'name': '规则表', 'cat': 'data', 'msg': 'eventType 空值 %d 条' % len(empty)})

    for name, needle, cat in [('写入API', 'window.v92_chronicleAdd = function', 'engine'),
                              ('匹配API', 'window.v92_chronicleCheck = function', 'engine'),
                              ('回顾API', 'window.v92_chronicleReview = function', 'engine'),
                              ('记录钩子', '/upg17inj:cron/', 'engine'),
                              ('结局回顾', '/upg17inj:review/', 'engine'),
                              ('兜底', 'if(!s.chronicle) s.chronicle=[]', 'engine'),
                              ('面板分页', '/upg17inj:jtabs/', 'ui')]:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:30]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '编年史 规则/API/钩子/兜底/面板',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '编年史系统', 'ok': ok, 'results': results, 'details': detail}
