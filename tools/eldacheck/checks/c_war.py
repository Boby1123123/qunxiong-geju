#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_war: v65 战争与战斗健康检查。
检查项：
1. v65 引擎对象存在（W65_WAR 定义 + 关键函数导出）
2. S 新字段兜底（militaryCareer/warGrudges/army/warFame/warScars/mercenary）
3. tick 挂载（v65_tick 在链内至少 1 次）
4. v65 节点死链（go 目标 ∈ 主+片全集）
5. 军衔表 8 级 + 兵种表 ≥9 + 阵型 4
6. 恩怨账本函数（grudgeAdd/grudgeLevel）存在
"""
import io, os, re
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def run(html):
    problems = []
    detail = {}

    # 1) 引擎对象
    has_engine = 'var W65_WAR=(function()' in html
    detail['engine'] = has_engine
    if not has_engine:
        problems.append({'name': 'v65引擎', 'line': 0, 'cat': '缺失', 'msg': 'W65_WAR 未定义'})
    need_fn = ['v65_ensureDefaults', 'v65_tick', 'v65_grudgeAdd', 'v65_grudgeLevel',
               'v65_joinArmy', 'v65_armyBonus', 'v65_warPanel', 'v65_mercPanel',
               'v65_acadPanel', 'v65_exchange', 'v65_scar', 'v65_promote', 'v65_finishJob']
    missing_fn = [f for f in need_fn if ('window.%s' % f) not in html]
    detail['missing_fn'] = missing_fn
    if missing_fn:
        problems.append({'name': '引擎函数', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(missing_fn[:6])})

    # 2) S 兜底字段
    need = ['militaryCareer', 'warGrudges', 'warFame', 'warScars', 'mercenary']
    missing = [f for f in need if re.search(r'S\.%s' % f, html) is None]
    detail['defaults_missing'] = missing
    if missing:
        problems.append({'name': '兜底', 'line': 0, 'cat': '缺失', 'msg': 'S 字段兜底缺失: %s' % ','.join(missing)})

    # 3) tick 挂载
    tick_count = len(re.findall(r'v65_tick\(\)', html))
    detail['tick_hooks'] = tick_count
    if tick_count == 0:
        problems.append({'name': 'tick挂载', 'line': 0, 'cat': '缺失', 'msg': 'v65_tick() 挂载 0 次'})

    # 4) v65 节点死链
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
    v65_go = set(re.findall(r'go:\s*"(v65_[^"]+)"', html))
    v65_ids = set(i for i in main_ids | chunk_ids if i.startswith('v65_'))
    detail['v65_nodes'] = len(v65_ids)
    detail['v65_go'] = len(v65_go)
    dead = sorted(v65_go - v65_ids)
    if dead:
        problems.append({'name': 'v65死链', 'line': 0, 'cat': '死链', 'msg': 'v65 go 目标缺失 %d 个（%s）' % (len(dead), ','.join(dead[:8]))})

    # 5) 军衔/兵种/阵型表
    rank_n = len(re.findall(r"{id:'(recruit|veteran|squad|cent|chiliarch|colonel|general|marshal)'", html))
    detail['ranks'] = rank_n
    if rank_n < 8:
        problems.append({'name': '军衔表', 'line': 0, 'cat': '数值', 'msg': '军衔 %d/8' % rank_n})
    troop_n = len(re.findall(r"{id:'(inf|arc|cav|mage|cleric|dwarf_heavy|elf_archer|orc_berserk|half_foot)'", html))
    detail['troops'] = troop_n
    if troop_n < 9:
        problems.append({'name': '兵种表', 'line': 0, 'cat': '数值', 'msg': '兵种 %d/9' % troop_n})
    form_n = len(re.findall(r"{id:'(phalanx|skirmish|ambush|hold)'", html))
    detail['formations'] = form_n
    if form_n < 4:
        problems.append({'name': '阵型表', 'line': 0, 'cat': '数值', 'msg': '阵型 %d/4' % form_n})

    # 6) v65.2 随军强者/攻城扩展（generals/siege 兜底 + 新节点 go 合法）
    if 'S.militaryCareer&&!S.militaryCareer.generals' in html:
        detail['v652_generals_default'] = True
    else:
        problems.append({'name': 'v652generals', 'line': 0, 'cat': '缺失', 'msg': 'generals 兜底缺失'})
    if 'S.militaryCareer&&!S.militaryCareer.siege' in html or 'S.militaryCareer&&!S.militaryCareer.captives' in html:
        detail['v652_siege_default'] = True
    else:
        problems.append({'name': 'v652siege', 'line': 0, 'cat': '缺失', 'msg': 'siege/captives 兜底缺失'})
    need_652 = ['v652_generalBonus', 'v652_generalRecruit', 'v652_duelRoll',
                'v652_siegeStart', 'v652_siegeTick', 'v652_siegeStorm']
    missing_652 = [f for f in need_652 if ('window.%s' % f) not in html]
    detail['v652_missing_fn'] = missing_652
    if missing_652:
        problems.append({'name': 'v652引擎', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(missing_652)})
    # v652 节点死链（go 目标 ∈ 全集）
    v652_go = set(re.findall(r'go:\s*"(v65[0-9]+_[^"]+)"', html))
    all_ids = set(find_node_ids(html).keys()) | chunk_ids
    dead652 = sorted(v652_go - all_ids)
    detail['v652_dead'] = dead652
    if dead652:
        problems.append({'name': 'v652死链', 'line': 0, 'cat': '死链', 'msg': 'v652 go 目标缺失 %d 个（%s）' % (len(dead652), ','.join(dead652[:8]))})

    # 7) v65.3 佣兵/创伤扩展（mercenary 扩展 + militaryCareer.trauma/postWar + v653 死链 + 悬赏表）
    merc_ok = all(k in html for k in [
        'S.mercenary&&S.mercenary.contracts===undefined',
        'S.mercenary&&S.mercenary.deals===undefined',
        'S.mercenary&&S.mercenary.bountyList===undefined'])
    detail['v653_merc_default'] = merc_ok
    if not merc_ok:
        problems.append({'name': 'v653merc兜底', 'line': 0, 'cat': '缺失', 'msg': 'mercenary 扩展兜底缺失'})
    trauma_ok = all(k in html for k in [
        'S.militaryCareer&&!S.militaryCareer.trauma',
        'S.militaryCareer&&!S.militaryCareer.postWar'])
    detail['v653_trauma_default'] = trauma_ok
    if not trauma_ok:
        problems.append({'name': 'v653trauma兜底', 'line': 0, 'cat': '缺失', 'msg': 'trauma/postWar 兜底缺失'})
    need_653 = ['v653_bountyTake', 'v653_bountyFinish', 'v653_marketCheck', 'v653_dealSettle',
                'v653_mercBonus', 'v653_traumaLevel', 'v653_battleBonus', 'v653_scarHeal',
                'v653_tick', 'v653_chronicle', 'v653_epithet', 'v653_karmaTick']
    missing_653 = [f for f in need_653 if ('window.%s' % f) not in html]
    detail['v653_missing_fn'] = missing_653
    if missing_653:
        problems.append({'name': 'v653引擎', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(missing_653[:6])})
    bounty_n = len(re.findall(r'\n  (garrison|escort|raid|kill|ruin|arms|scout|assassin|rescue|intel):\{id:', html))
    detail['v653_bounty'] = bounty_n
    if bounty_n < 10:
        problems.append({'name': '悬赏表', 'line': 0, 'cat': '数值', 'msg': 'W653_BOUNTY %d/10' % bounty_n})
    # v653 节点死链（go 目标 ∈ 全集）
    v653_go = set(re.findall(r'go:\s*"(v653_[^"]+)"', html))
    all_ids2 = set(find_node_ids(html).keys()) | chunk_ids
    dead653 = sorted(v653_go - all_ids2)
    detail['v653_dead'] = dead653
    if dead653:
        problems.append({'name': 'v653死链', 'line': 0, 'cat': '死链', 'msg': 'v653 go 目标缺失 %d 个（%s）' % (len(dead653), ','.join(dead653[:8]))})

    # 5) v654 战略层（v65.4）
    v654_fn = ['v654_frontsInit', 'v654_warscore', 'v654_goalPick', 'v654_goalCheck',
               'v654_alliesCheck', 'v654_treatyGen', 'v654_reparTick', 'v654_tickWars']
    detail['v654_fn_missing'] = [f for f in v654_fn if ('window.%s' % f) not in html]
    if detail['v654_fn_missing']:
        problems.append({'name': 'v654引擎', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(detail['v654_fn_missing'][:6])})
    # 目标表/条款表/战线种子
    detail['v654_tables'] = (('W654_GOALS' in html) and ('W654_TERMS' in html) and ('W654_FRONTSEEDS' in html))
    if not detail['v654_tables']:
        problems.append({'name': 'v654表', 'line': 0, 'cat': '缺失', 'msg': 'W654_GOALS/TERMS/FRONTSEEDS 缺失'})
    # v654 节点计数（含片）
    all_ids4 = set(find_node_ids(html).keys()) | chunk_ids
    v654_nodes = sorted(i for i in all_ids4 if i.startswith('v654_'))
    detail['v654_nodes'] = len(v654_nodes)
    if len(v654_nodes) < 40:
        problems.append({'name': 'v654节点', 'line': 0, 'cat': '数量', 'msg': 'v654 节点 %d/40' % len(v654_nodes)})
    # v654 go 死链
    v654_go = set(re.findall(r'go:\s*"(v654_[^"]+)"', html))
    dead654 = sorted(v654_go - all_ids4)
    detail['v654_dead'] = dead654
    if dead654:
        problems.append({'name': 'v654死链', 'line': 0, 'cat': '死链', 'msg': 'v654 go 目标缺失 %d 个（%s）' % (len(dead654), ','.join(dead654[:8]))})
    # tick 挂载
    detail['v654_tick_hook'] = ('v654_tickWars(d)' in html)
    if not detail['v654_tick_hook']:
        problems.append({'name': 'v654挂载', 'line': 0, 'cat': '缺失', 'msg': 'v654_tickWars(d) 未挂周结算'})
    # 面板入口
    detail['v654_panel_entry'] = ("'v654_strategy_panel'" in html)
    if not detail['v654_panel_entry']:
        problems.append({'name': 'v654入口', 'line': 0, 'cat': '缺失', 'msg': '战争面板战略地图入口缺失'})

    # 6) v655 战略层交互（v65.5：SVG 战线图 + 谈判 UI + 赔款闭环）
    v655_fn = ['v655_mapSvg', 'v655_mapPanel', 'v655_negotiateOptions', 'v655_negotiateRoll',
               'v655_applyTreaty', 'v655_negotiatePanel', 'v655_debtTick', 'v655_mediatorRoll',
               'v655_debtLevel', 'v655_curWar']
    detail['v655_fn_missing'] = [f for f in v655_fn if ('window.%s' % f) not in html]
    if detail['v655_fn_missing']:
        problems.append({'name': 'v655引擎', 'line': 0, 'cat': '缺失', 'msg': '缺失: %s' % ','.join(detail['v655_fn_missing'][:6])})
    # 表格
    detail['v655_tables'] = (('V655_POS' in html) and ('V655_TERMS' in html))
    if not detail['v655_tables']:
        problems.append({'name': 'v655表', 'line': 0, 'cat': '缺失', 'msg': 'V655_POS/TERMS 缺失'})
    # v655 节点计数（含片）
    all_ids5 = set(find_node_ids(html).keys()) | chunk_ids
    v655_nodes = sorted(i for i in all_ids5 if i.startswith('v655_'))
    detail['v655_nodes'] = len(v655_nodes)
    if len(v655_nodes) < 14:
        problems.append({'name': 'v655节点', 'line': 0, 'cat': '数量', 'msg': 'v655 节点 %d/14' % len(v655_nodes)})
    # v655 go 死链
    v655_go = set(re.findall(r'go:\s*"(v655_[^"]+)"', html))
    dead655 = sorted(v655_go - all_ids5)
    detail['v655_dead'] = dead655
    if dead655:
        problems.append({'name': 'v655死链', 'line': 0, 'cat': '死链', 'msg': 'v655 go 目标缺失 %d 个（%s）' % (len(dead655), ','.join(dead655[:8]))})
    # 挂载 + 入口
    detail['v655_debt_hook'] = ('v655_debtTick(d)' in html)
    if not detail['v655_debt_hook']:
        problems.append({'name': 'v655挂载', 'line': 0, 'cat': '缺失', 'msg': 'v655_debtTick(d) 未挂周结算'})
    detail['v655_map_entry'] = ('v655_mapPanel()' in html and '战线地图' in html)
    if not detail['v655_map_entry']:
        problems.append({'name': 'v655入口', 'line': 0, 'cat': '缺失', 'msg': '战争面板战线地图入口缺失'})

    ok = len(problems) == 0
    results = [{
        'name': '战争与战斗(W65) 引擎=%(engine)s tick=%(tick_hooks)s 节点=%(v65_nodes)s 军衔=%(ranks)s 兵种=%(troops)s v652=OK v653=OK v654=%(v654_nodes)s节点/死链%(v654_dead)s v655=%(v655_nodes)s节点/死链%(v655_dead)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '战争与战斗', 'ok': ok, 'results': results, 'details': detail}
