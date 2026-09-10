#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_map: 九域地图可视化检查（elda ci 第 33 检查器，UPG-09 新增）。

1. 地图 SVG 渲染（v67_map + REGIONS 全量）
2. 区域解锁条件提示（HINTS 数据表 + 未解锁标签 + 城市卡线索）
3. 已触发事件计数（_eventCount + 工具栏展示）
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
        ('地图渲染', 'v67_map = MAP', '单例'),
        ('地图渲染', "<svg viewBox='", 'SVG'),
        ('解锁提示', 'HINTS: {', '条件表'),
        ('解锁提示', '🔒 区域未解锁', '卡片提示'),
        ('解锁提示', '解锁线索：', '卡片线索'),
        ('解锁提示', '/upg09inj:locklabel/', '地图标签'),
        ('事件计数', '_eventCount: function', '计数函数'),
        ('事件计数', "MAP._eventCount() + \" 事件", '工具栏'),
    ]
    for name, needle, cat in checks:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:40]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '地图可视化 覆盖=10',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '九域地图', 'ok': ok, 'results': results, 'details': detail}
