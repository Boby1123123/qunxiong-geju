#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_fantasy: 西幻体系深化检查（elda ci 第 37 检查器，UPG-16 新增）。

1. RACE_TRAITS 种族表存在且含 traits（≥6 族）
2. MAGIC_SPELLS 法术表存在且四系齐全（≥12 条）
3. JOB_EVENTS 职业事件表存在（≥15 条）且 day 与五主线错开
4. dn_camp 阵营变体节点存在（fc_camp_* ≥6）且入口（fc_tavern 选项）存在
5. 引擎钩子 v92_raceShown / v92_campFlags / v92_scanJobEvents / v92_openSpellbook 存在
仅检测；不修改任何内容。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')

MAIN_DAYS = [60, 120, 200, 250, 280]


def _seg(html, marker):
    i0 = html.find(marker)
    if i0 < 0:
        return ''
    i1 = html.find('];', i0)
    return html[i0:i1 + 2] if i1 >= 0 else html[i0:i0 + 4000]


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    races = _seg(html, 'const RACE_TRAITS = {')
    n_race = len(re.findall(r'\bname:\s*"', races))
    detail['race_count'] = n_race
    if n_race < 6:
        problems.append({'name': '种族表', 'cat': 'data', 'msg': 'RACE_TRAITS 种族 <6（%d）' % n_race})
    if 'traits: [' not in races:
        problems.append({'name': '种族表', 'cat': 'data', 'msg': 'RACE_TRAITS 缺 traits'})

    spells = _seg(html, 'const MAGIC_SPELLS = [')
    n_sp = len(re.findall(r'\bid:\s*"sp_', spells))
    detail['spell_count'] = n_sp
    if n_sp < 12:
        problems.append({'name': '法术表', 'cat': 'data', 'msg': 'MAGIC_SPELLS 法术 <12（%d）' % n_sp})
    for s in ['元素', '神圣', '深渊', '秘术']:
        if ('school: "' + s + '"') not in spells:
            problems.append({'name': '法术表', 'cat': 'data', 'msg': '缺 %s 系' % s})

    jobs = _seg(html, 'const JOB_EVENTS = [')
    n_je = len(re.findall(r'\bid:\s*"je_', jobs))
    detail['job_event_count'] = n_je
    if n_je < 15:
        problems.append({'name': '职业事件', 'cat': 'data', 'msg': 'JOB_EVENTS <15（%d）' % n_je})
    days = [int(m) for m in re.findall(r'day:\s*(\d+)', jobs)]
    bad = [d for d in days if any(abs(d - m) <= 5 for m in MAIN_DAYS)]
    detail['job_event_bad_days'] = bad
    if bad:
        problems.append({'name': '职业事件', 'cat': 'data', 'msg': 'day 与五主线冲突: ' + str(bad[:6])})

    for nid in ['fc_camp_street', 'fc_camp_tavern', 'fc_camp_market', 'fc_camp_temple', 'fc_camp_guild', 'fc_camp_night']:
        if ('N["' + nid + '"]') not in html:
            problems.append({'name': '阵营节点', 'cat': 'data', 'msg': nid + ' 缺失'})
    if '/upg16inj:camp/' not in html:
        problems.append({'name': '阵营入口', 'cat': 'data', 'msg': 'fc_tavern 阵营入口缺失'})

    for name, needle, cat in [('种族首播', 'window.v92_raceShown = function', 'engine'),
                              ('阵营flag', 'window.v92_campFlags = function', 'engine'),
                              ('职业事件扫描', 'window.v92_scanJobEvents = function', 'engine'),
                              ('法术书面板', 'window.v92_openSpellbook = function', 'engine'),
                              ('法术书按钮', '/upg16inj:spellbtn/', 'ui')]:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:30]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '西幻体系 种族/法术/职业事件/阵营/引擎',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '西幻体系深化', 'ok': ok, 'results': results, 'details': detail}
