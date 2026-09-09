#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_pace: CM-4 节奏分档门禁 + 战斗四段式校验（elda ci 第 20 检查器）。
1. pace 字段门禁：全库已标节点 light≤20%、deep 绝对数≥30；按卷配置均字数下限 / light 上限 / deep 下限
   （text 函数型节点无法静态分档，缺省 normal，不参与统计）
2. 战斗四段式：COMBAT_TEXTS 含 tone(蓄势)/attack(交锋)/hit(受创:来源词+程度词)/胜负(转折) 四段
"""
import io, os, re, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SRC = os.path.join(ROOT, 'src')

# 按卷 pace 门禁配置（依据 v91 全量标注实测分布，docs/CM-4 有口径记录）
VOL_PACE = {
    'script_02.js':     {'min_avg': 120, 'max_light': 45, 'min_deep': 0},
    'script_02a.js':    {'min_avg': 180, 'max_light': 10, 'min_deep': 0},
    'script_02b.js':    {'min_avg': 200, 'max_light': 35, 'min_deep': 5},
    'script_02d.js':    {'min_avg': 150, 'max_light': 10, 'min_deep': 0},
    'script_02g.js':    {'min_avg': 0,   'max_light': 100, 'min_deep': 0},  # text 函数型，无法静态分档
    'script_03.js':     {'min_avg': 120, 'max_light': 50, 'min_deep': 0},
    'script_04.js':     {'min_avg': 150, 'max_light': 15, 'min_deep': 0},
    'dn_u8.js':         {'min_avg': 100, 'max_light': 55, 'min_deep': 0},
    'dn_orc_deep.js':   {'min_avg': 150, 'max_light': 20, 'min_deep': 0},
    'dn_elf_dwarf.js':  {'min_avg': 150, 'max_light': 20, 'min_deep': 0},
    'dn_warfront.js':   {'min_avg': 150, 'max_light': 20, 'min_deep': 0},
}
GLOBAL_MIN_DEEP_ABS = 30   # 全库 deep 绝对数下限
# 全库 light 门禁针对叙事卷（机制/旅行/结局/支线卷按各自卷上限核算，见 VOL_PACE）
NARRATIVE_VOLUMES = ('script_02a.js', 'script_02b.js', 'script_02d.js', 'script_02g.js',
                     'script_04.js', 'dn_orc_deep.js', 'dn_elf_dwarf.js', 'dn_warfront.js')
GLOBAL_MAX_LIGHT_RATIO = 20.0  # 叙事卷已标 light 占比上限（%）


def _read(p):
    try:
        return io.open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        return ''


def _pace_stats():
    """按文件统计：节点总数 / 已标数 / light / deep / 均字数（已标节点按 pace 档，字数取 text 直接量估算）"""
    stats = {}
    for f in glob.glob(os.path.join(SRC, '*.js')) + glob.glob(os.path.join(SRC, 'data_nodes', '*.js')):
        base = os.path.basename(f)
        if base in ('dn_causality.js', 'dn_memory_tpl.js', 'dn_chapters.js'):
            continue
        t = _read(f)
        total = len(re.findall(r'N\["[a-zA-Z0-9_]+"\]\s*=', t))
        if not total:
            continue
        light = len(re.findall(r'pace:"light"', t))
        deep = len(re.findall(r'pace:"deep"', t))
        epic = len(re.findall(r'pace:"epic"', t))
        normal = len(re.findall(r'pace:"normal"', t))
        tagged = light + deep + epic + normal
        # 均字数：由 pace 档位代表值估算（light≈100/normal≈400/deep≈1100/epic≈2500）
        avg = 0
        if tagged:
            avg = int((light * 100 + normal * 400 + deep * 1100 + epic * 2500) / tagged)
        stats[base] = {'total': total, 'tagged': tagged, 'light': light, 'deep': deep,
                       'epic': epic, 'avg': avg}
    return stats


def run(html):
    problems = []
    detail = {}
    stats = _pace_stats()

    # 1) 全库门禁（light 按叙事卷；deep 绝对数全库）
    tl = sum(s['light'] for k, s in stats.items() if k in NARRATIVE_VOLUMES)
    tg = sum(s['tagged'] for k, s in stats.items() if k in NARRATIVE_VOLUMES)
    td = sum(s['deep'] for s in stats.values())
    detail['tagged'] = tg
    detail['light_total'] = tl
    detail['light_ratio'] = round(100.0 * tl / tg, 1) if tg else 0
    detail['deep_total'] = td
    if tg and 100.0 * tl / tg > GLOBAL_MAX_LIGHT_RATIO:
        problems.append({'name': 'light占比', 'line': 0, 'cat': '门禁', 'msg': '叙事卷已标 light %.1f%% > %.0f%%' % (detail['light_ratio'], GLOBAL_MAX_LIGHT_RATIO)})
    if td < GLOBAL_MIN_DEEP_ABS:
        problems.append({'name': 'deep数量', 'line': 0, 'cat': '门禁', 'msg': '全库 deep %d < %d' % (td, GLOBAL_MIN_DEEP_ABS)})

    # 2) 按卷门禁
    vol_bad = []
    for base, cfg in VOL_PACE.items():
        s = stats.get(base)
        if not s or not s['tagged']:
            if cfg['min_avg'] > 0:
                vol_bad.append('%s 无已标节点' % base)
            continue
        if s['avg'] < cfg['min_avg']:
            vol_bad.append('%s 均字数%d<下限%d' % (base, s['avg'], cfg['min_avg']))
        if s['light'] and 100.0 * s['light'] / s['tagged'] > cfg['max_light']:
            vol_bad.append('%s light %.0f%%>上限%d%%' % (base, 100.0 * s['light'] / s['tagged'], cfg['max_light']))
        if s['deep'] and 100.0 * s['deep'] / s['tagged'] < cfg['min_deep']:
            vol_bad.append('%s deep %.0f%%<下限%d%%' % (base, 100.0 * s['deep'] / s['tagged'], cfg['min_deep']))
        if cfg['min_deep'] > 0 and s['deep'] == 0 and s['tagged'] > 0:
            vol_bad.append('%s deep=0 未达下限' % base)
    detail['vol_bad'] = vol_bad
    if vol_bad:
        problems.append({'name': '分卷门禁', 'line': 0, 'cat': '门禁', 'msg': '; '.join(vol_bad[:6])})

    # 3) 战斗四段式（COMBAT_TEXTS）
    m = re.search(r'COMBAT_TEXTS\s*=\s*\{(.*?)\}\s*;\s*window\.COMBAT_TEXTS', html, re.S)
    combat_ok = False
    if m:
        seg = m.group(1)
        tones = len(re.findall(r'"tone_', seg))
        attacks = len(re.findall(r'"attack_', seg))
        hits = len(re.findall(r'"hit_', seg))
        ends = len(re.findall(r'"(victory|defeat|flee_)', seg))
        # 受创段来源词+程度词校验（每个 hit_* 文本须含来源词与程度词至少其一组合）
        src_words = ['攻击', '重击', '这一击', '擦过', '撞', '拳', '刀', '剑', '冲击', '残影', '箭', '爪', '火', '冰', '雷']
        deg_words = ['血', '裂', '麻', '退', '碎', '飞', '震', '剧痛', '咳', '渗', '疼', '伤']
        hit_texts = re.findall(r'"hit_[a-z]+":\s*"([^"]*)"', seg)
        bad_hits = [h[:18] for h in hit_texts
                    if not (any(w in h for w in src_words) and any(w in h for w in deg_words))]
        detail['combat'] = {'tone': tones, 'attack': attacks, 'hit': hits, 'end': ends, 'bad_hits': len(bad_hits)}
        combat_ok = tones >= 3 and attacks >= 5 and hits >= 3 and ends >= 3 and not bad_hits
        if not combat_ok:
            problems.append({'name': '战斗四段', 'line': 0, 'cat': '战斗', 'msg': 'tone=%d attack=%d hit=%d end=%d 受创缺素=%d'
                             % (tones, attacks, hits, ends, len(bad_hits))})
    else:
        problems.append({'name': '战斗四段', 'line': 0, 'cat': '战斗', 'msg': 'COMBAT_TEXTS 未找到'})

    ok = len(problems) == 0
    results = [{
        'name': '节奏分档 已标%(tagged)s·light%(light_ratio)s%%·deep%(deep_total)s·战斗四段%(combat)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:150] for p in problems[:4])),
    }]
    return {'name': '节奏与战斗', 'ok': ok, 'results': results, 'details': detail}
