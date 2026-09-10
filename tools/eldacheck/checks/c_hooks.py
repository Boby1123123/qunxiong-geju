#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_hooks: 事件池全局钩子检查（elda ci 第 35 检查器，UPG-14 新增）。

1. GLOBAL_HOOKS 表存在且 id 唯一
2. condition 引用的 S.xxx 键已声明（S schema 白名单）
3. eventId 去重键（S.world['ev_'+id]）使用规范
4. cooldown/maxTriggers 为正整数
5. 引擎钩子扫描器（v92_scanHooks）与开关兜底（settings.globalHooks）存在
仅检测；不修改任何内容。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')

# S schema 白名单（与 S 状态键一致；钩子 condition 只读这些键）
KNOWN_S = {'day', 'date', 'loc', 'curCity', 'home', 'name', 'job', 'subrace', 'ideal', 'hobby',
           'talent', 'realm', 'xp', 'gold', 'hp', 'maxHp', 'san', 'maxSan', 'fatigue', 'wound',
           'karma', 'rep', 'attrs', 'skills', 'infl', 'items', 'mats', 'books', 'flags',
           'npcRelations', 'settings', 'visited', 'world', 'worldState', 'slotId', 'saveVersion',
           'playerId', 'gradPath', 'anchors', 'worldWar', 'readings', 'choices', 'curNode',
           'homeland', 'faction', 'season', 'weather', 'wealth', 'estate', 'followers', 'troops',
           'y', 'm', 'titles', 'reputation', 'fame', 'achievements', 'unlockedEndings',
           'sessionId', 'inCombat', 'fled', 'equip', 'quests', 'loans', 'contracts', 'soul',
           'element', 'cult', 'sect', 'family', 'lineage', 'luck', 'time', 'ended', 'ending',
           'abyssCorruption', 'hooksState', 'dayStart', 'maxFatigue'}


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    # 0) 切出 GLOBAL_HOOKS 数据段（只在该段内做数据检查，避免误抓其他 cooldown/condition）
    seg = ''
    i0 = html.find('const GLOBAL_HOOKS = [')
    if i0 >= 0:
        i1 = html.find('];', i0)
        if i1 >= 0:
            seg = html[i0:i1 + 2]
    detail['hooks_seg_len'] = len(seg)

    # 1) 钩子表 + id 唯一
    ids = re.findall(r'\bid:\s*"hook_[A-Za-z0-9_]+"', seg)
    unique = len(set(ids)) == len(ids)
    detail['hook_ids'] = len(ids)
    if len(ids) == 0:
        problems.append({'name': '钩子表', 'cat': 'data', 'msg': 'GLOBAL_HOOKS 无 hook_ id'})
    elif not unique:
        problems.append({'name': '钩子表', 'cat': 'data', 'msg': 'hook id 重复'})

    # 2) condition 引用的 S 键已声明
    conds = re.findall(r'condition:\s*"([^"]*)"', seg)
    undecl = []
    for c in conds:
        for m in re.finditer(r'S\.([a-zA-Z_][a-zA-Z0-9_]*)', c):
            if m.group(1) not in KNOWN_S:
                undecl.append(m.group(1))
    detail['cond_s_undecl'] = sorted(set(undecl))
    detail['cond_count'] = len(conds)
    if undecl:
        problems.append({'name': 'condition', 'cat': 'decl', 'msg': 'S 未知键: ' + '; '.join(sorted(set(undecl))[:6])})

    # 3) eventId 去重键使用（引擎触发段）
    ev_uses = len(re.findall(r"['\"]ev_['\"]\s*\+\s*[A-Za-z_]+", html))
    detail['ev_key_uses'] = ev_uses
    if ev_uses < 3:
        problems.append({'name': '去重键', 'cat': 'data', 'msg': 'ev_ 去重键用法不足（%d）' % ev_uses})

    # 4) cooldown/maxTriggers 为正整数（仅钩子段）
    bad_num = []
    for m in re.finditer(r'(cooldown|maxTriggers):\s*(-?\d+)', seg):
        if int(m.group(2)) <= 0:
            bad_num.append(m.group(0))
    detail['bad_num'] = bad_num
    if bad_num:
        problems.append({'name': '数值', 'cat': 'data', 'msg': '非正整数: ' + '; '.join(bad_num[:6])})

    # 5) 引擎扫描器 + 开关兜底
    for name, needle, cat in [('扫描器', 'window.v92_scanHooks = function', 'engine'),
                              ('开关', 'settings.globalHooks===undefined', 'engine'),
                              ('调用点', '/upg14inj:hookscan/', 'engine')]:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:30]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '全局钩子 表/condition/去重/数值/引擎',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '事件全局钩子', 'ok': ok, 'results': results, 'details': detail}
