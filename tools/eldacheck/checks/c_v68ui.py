#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_v68ui: V68 西幻手抄圣典界面检查。
检查项：
1. V68_UI 引擎存在（window.V68_UI + announceHistory/statusBar/sideWrap/openPanel）
2. 世界旁白栏 #v68-announce 唯一且位于 #topbar 之后
3. 底部状态行 #v68-status 存在
4. 双排导航：btn-task/btn-strong/btn-chronicle 存在 + 10 主键齐
5. top-bar-extra 退役（renderTopBar 无 top-btn-row 创建）
6. V35 控制台生产隐藏（window.v67Debug + init 条件化）
7. 行动点唯一（#stats 内无"行动点"行）
8. 角色面板无头像（v68-side-head 无 <img> 头像）
9. v68 CSS 令牌无悬空（--c-parch-50/--c-ink-900/--c-gold-600 定义）
"""
import re

def run(html):
    problems = []
    detail = {}

    # 1) 引擎
    engine = 'window.V68_UI' in html and 'UI.announceHistory' in html
    detail['engine'] = engine
    if not engine:
        problems.append({'name': 'V68_UI引擎', 'line': 0, 'cat': '缺失', 'msg': 'window.V68_UI 未注入'})
    for f in ['UI.statusBar', 'UI.sideWrap', 'UI.openPanel', 'UI.announceRefresh', 'UI.bindNav']:
        if f not in html:
            problems.append({'name': '引擎方法', 'line': 0, 'cat': '缺失', 'msg': '%s 缺失' % f})

    # 2) 旁白栏
    ann_cnt = html.count('id="v68-announce"')
    detail['announce_cnt'] = ann_cnt
    if ann_cnt != 1:
        problems.append({'name': '旁白栏', 'line': 0, 'cat': '重复', 'msg': 'id="v68-announce" 出现 %d 次（需 1）' % ann_cnt})
    if html.find('id="v68-announce"') < html.find('id="topbar"'):
        problems.append({'name': '旁白栏位置', 'line': 0, 'cat': '错位', 'msg': '旁白栏应在 #topbar 之后'})

    # 3) 状态行
    if 'id="v68-status"' not in html:
        problems.append({'name': '状态行', 'line': 0, 'cat': '缺失', 'msg': '#v68-status 缺失'})

    # 4) 导航键
    nav_keys = ['btn-map', 'btn-pack', 'btn-realm', 'btn-log', 'btn-faction', 'btn-task', 'btn-strong', 'btn-chronicle', 'btn-save', 'btn-settings']
    miss = [k for k in nav_keys if 'id="%s"' % k not in html]
    detail['nav_missing'] = miss
    if miss:
        problems.append({'name': '导航键', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(miss)})

    # 5) top-bar-extra 退役
    if 'top-btn-row' in html:
        problems.append({'name': '旧导航', 'line': 0, 'cat': '残留', 'msg': 'top-bar-extra 的 top-btn-row 仍在渲染'})
    if 'top-bar-extra' in html and 'removeChild(_old)' not in html:
        problems.append({'name': '旧导航清理', 'line': 0, 'cat': '残留', 'msg': 'top-bar-extra 无退役清理逻辑'})

    # 6) V35 控制台
    if 'window.v67Debug' not in html:
        problems.append({'name': '控制台开关', 'line': 0, 'cat': '缺失', 'msg': 'window.v67Debug 未定义'})
    if 'if(window.v67Debug) V35_DevConsole.init();' not in html:
        problems.append({'name': '控制台条件化', 'line': 0, 'cat': '缺失', 'msg': 'V35_DevConsole.init 未按 v67Debug 条件化'})

    # 7) 行动点唯一
    stats_ap = re.search(r'renderStats[^#]{0,400}行动点</span>', html, re.S)
    detail['stats_ap'] = stats_ap is not None
    if stats_ap:
        problems.append({'name': '行动点唯一', 'line': 0, 'cat': '重复', 'msg': '#stats 渲染仍含行动点行'})
    if 'id="v68-status"' not in html:
        problems.append({'name': '行动点落点', 'line': 0, 'cat': '缺失', 'msg': '行动点应在底部状态行'})

    # 8) 无头像
    avatar_in_head = re.search(r'v68-side-head[^#]{0,300}<img', html, re.S)
    if avatar_in_head:
        problems.append({'name': '无头像', 'line': 0, 'cat': '违规', 'msg': 'v68-side-head 出现头像 img'})

    # 9) 令牌
    tokens = ['--c-parch-50', '--c-ink-900', '--c-gold-600']
    missing_tok = [t for t in tokens if t + ':' not in html]
    detail['tokens_missing'] = missing_tok
    if missing_tok:
        problems.append({'name': '令牌定义', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(missing_tok)})

    ok = not problems
    results = [{'name': p['name'], 'ok': False, 'msg': p['msg']} for p in problems]
    if ok:
        results.append({'name': 'V68-UI', 'ok': True, 'msg': '引擎/旁白栏/状态行/导航/退役/控制台/行动点唯一/无头像/令牌 全部健康'})
    return {
        'name': 'V68-UI西幻界面检查',
        'ok': ok,
        'results': results,
        'detail': detail,
    }
