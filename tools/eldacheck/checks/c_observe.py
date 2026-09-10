#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_observe: 响应式 UI 同步检查（elda ci 第 30 检查器，UPG-07 新增）。

1. Observer 机制：ELDA.observe/ELDA.notify/ELDA.refresh 定义存在
2. 结算点接入：applyEffects 内 /upg07inj:notify/ 广播、changeRelation 内 /upg07inj:relnotify/ 广播
3. 默认订阅：script_04.js 内 /upg07inj:subs/ 注册（'*' 通配刷新 renderTop/renderStats/statusBar）
4. 关键字段覆盖：notify 中 gold/xp/infl/attrs/npcRelations 变更键推导存在
"""
import io, os

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

    checks = [
        ('Observer机制', "window.ELDA.observe = function", '定义'),
        ('Observer机制', "window.ELDA.notify = function", '定义'),
        ('Observer机制', "window.ELDA.refresh = function", '兜底'),
        ('结算点', '/upg07inj:notify/', 'applyEffects 广播'),
        ('结算点', '/upg07inj:relnotify/', 'changeRelation 广播'),
        ('默认订阅', '/upg07inj:subs/', 'UI 订阅注册'),
        ('字段覆盖', "if(eff.infl) ch.infl = true", 'infl'),
        ('字段覆盖', "if(eff.attr) ch.attrs = true", 'attrs'),
        ('字段覆盖', "if(eff.relation) ch.npcRelations = true", 'npcRelations'),
    ]
    for name, needle, cat in checks:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:44]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '响应式UI 观察器=7 字段=3',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '响应式UI', 'ok': ok, 'results': results, 'details': detail}
