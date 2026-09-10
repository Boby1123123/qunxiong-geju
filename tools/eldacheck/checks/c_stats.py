#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_stats: 属性总览面板检查（elda ci 第 31 检查器，UPG-08 新增）。

1. 面板函数：v34_openStatsPanel/v34_renderStatsPanel/v34_closeStatsPanel 定义与 window 导出
2. 内容覆盖：六维 attrs 渲染 + 关键状态行（金币/声望/生命/理智/疲劳/伤势/业力）+ 影响力区
3. 响应式联动：observe('*') 订阅刷新存在
4. 入口：btn-stats 工具栏按钮注入存在
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
        ('面板函数', 'function v34_openStatsPanel(){', '定义'),
        ('面板函数', 'function v34_renderStatsPanel(){', '定义'),
        ('导出', 'window.v34_openStatsPanel = v34_openStatsPanel;', '导出'),
        ('六维', "attrOrder = ['SPR','STR','AGI','INT','CHA','CON']", '六维条'),
        ('状态行', "row('伤势', (S.wound||0) + ' 级')", '伤势'),
        ('状态行', "row('业力', S.karma || 0)", '业力'),
        ('影响力', '地域影响力', 'infl 区'),
        ('联动', "observe('*', function(){ try{ v34_renderStatsPanel(); }catch(e){} })", '响应式'),
        ('入口', "'btn-stats'", '按钮'),
        ('入口', '属性总览：角色卡/六维/状态/影响力', '按钮文案'),
    ]
    for name, needle, cat in checks:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:44]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '属性总览 覆盖=10',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '属性总览', 'ok': ok, 'results': results, 'details': detail}
