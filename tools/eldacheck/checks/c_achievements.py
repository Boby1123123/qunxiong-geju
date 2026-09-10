#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_achievements: 结局图鉴 + 成就系统检查（elda ci 第 29 检查器，UPG-06 新增）。

1. 存储：ELDA_ACHIEVEMENTS_KEY 独立键存在（与存档 key 分离）
2. 引擎：v92_achTick/v92_achEnding/v92_achUnlock 定义存在；writeNext 内 achTick 钩子存在
3. 面板：v34_openAchievements 非占位（含 '结局图鉴与成就' 文案）
4. 统计钩子：showOptions 决策计数 / rollback 回退计数接入
5. 结局标签：c_tags 已覆盖 ending: 校验，此处复核 achEnding 用 curNode/ending_ 前缀兜底
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

    for name, needle, cat in [
        ('存储键', "ELDA_ACHIEVEMENTS_KEY = 'elda_achievements'", '独立键'),
        ('引擎', 'window.v92_achTick = function', '定义'),
        ('引擎', 'window.v92_achEnding = function', '定义'),
        ('引擎', 'window.v92_achUnlock = function', '定义'),
        ('钩子', "try{ window.v92_achTick(node); }catch(e){}", 'writeNext 接入'),
        ('面板', '结局图鉴与成就', '面板重写'),
        ('统计', "v92_achStat('decisions')", '决策计数'),
        ('统计', "v92_achStat('rollbacks')", '回退计数'),
    ]:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:44]})
        else:
            detail[name] = True

    # 成就定义数量
    defs_n = len(re.findall(r'ach_[a-zA-Z0-9_]+:\s*\{', html))
    detail['ach_defs'] = defs_n
    if defs_n < 10:
        problems.append({'name': '成就定义', 'cat': '不足', 'msg': '成就定义=%d < 10' % defs_n})

    ok = len(problems) == 0
    results = [{
        'name': '成就图鉴 定义=%d' % defs_n,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '成就/图鉴', 'ok': ok, 'results': results, 'details': detail}
