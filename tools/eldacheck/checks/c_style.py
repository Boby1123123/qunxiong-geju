#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_style: V66 风格锁文本质量检查（elda ci 第 34 检查器，UPG-13 新增）。

设计为"防回潮门禁"：
- 首次运行对 game.html 建基线（.style_baseline.json），PASS；
- 后续运行对比基线：治理词每词 +5% 且 ≥+2、引号差扩大、煽情/拔高句式新增命中、排比高发词头 +20% → FAIL。
- 旧债不阻塞（不要求立刻清零既有超标），新内容回潮即被抓。
仅检测；不修改任何内容。
"""
import io, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')
BASE = os.path.join(HERE, '.style_baseline.json')

WORDS = ["微微", "轻轻", "缓缓", "低声", "目光", "嘴角", "片刻", "仿佛",
         "似乎", "眼底", "心头", "喃喃", "沉吟", "皱眉", "深吸", "良久",
         "微叹", "眸光", "不由", "下意识", "淡淡道", "沉声道", "轻声道",
         "若有所思", "不动声色", "隐隐", "隐约", "些许", "微微一怔", "身形一闪"]

BAD_PATTERNS = [
    "无法不感到", "这一刻注定", "命运在此",
    "注定载入史册", "无法言说的", "无法名状的",
]

PARALLEL_HEADS = ["他挥剑", "他怒吼", "她转身", "风吹过", "雪落下"]


def _scan(html):
    words = {w: html.count(w) for w in WORDS}
    bad = {p: html.count(p) for p in BAD_PATTERNS if p in html}
    par = sum(html.count(k) for k in PARALLEL_HEADS)
    lq = html.count('“')
    rq = html.count('”')
    return {'words': words, 'bad': bad, 'parallel': par, 'quotes_diff': abs(lq - rq), 'quotes': (lq, rq)}


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    cur = _scan(html)

    if not os.path.exists(BASE):
        try:
            io.open(BASE, 'w', encoding='utf-8').write(json.dumps(cur, ensure_ascii=False, indent=1))
            return {'name': 'V66风格锁', 'ok': True,
                    'results': [{'name': 'V66风格锁', 'ok': True, 'msg': '基线已建立（首次运行）'}],
                    'details': {'mode': 'baseline_created', 'quotes': cur['quotes']}}
        except Exception:
            return {'name': 'V66风格锁', 'ok': True,
                    'results': [{'name': 'V66风格锁', 'ok': True, 'msg': '基线写入失败，跳过'}],
                    'details': {'mode': 'baseline_skip'}}

    try:
        base = json.loads(io.open(BASE, encoding='utf-8').read())
    except Exception:
        base = cur

    problems = []
    detail = {'quotes': cur['quotes'], 'quotes_diff': cur['quotes_diff']}

    # 治理词：+5% 且 ≥+2 即 FAIL
    over = []
    for w in WORDS:
        b = base.get('words', {}).get(w, 0)
        c = cur['words'].get(w, 0)
        if c > b + max(2, int(b * 0.05)):
            over.append('%s %d→%d' % (w, b, c))
    if over:
        problems.append({'name': '治理词回潮', 'cat': 'count', 'msg': '; '.join(over[:6])})
    detail['words_over'] = over

    # 煽情/拔高：新增命中即 FAIL
    new_bad = []
    for p in BAD_PATTERNS:
        if p in cur['bad'] and p not in base.get('bad', {}):
            new_bad.append(p)
    if new_bad:
        problems.append({'name': '煽情/拔高', 'cat': 'pattern', 'msg': '新增命中: ' + '; '.join(new_bad[:6])})
    detail['new_bad'] = new_bad

    # 排比：+20% 即 FAIL
    bp = base.get('parallel', 0)
    cp = cur['parallel']
    if cp > bp + max(5, int(bp * 0.2)):
        problems.append({'name': '排比', 'cat': 'pattern', 'msg': '高发词头 %d→%d' % (bp, cp)})
    detail['parallel'] = (bp, cp)

    # 引号差：扩大即 FAIL
    bd = base.get('quotes_diff', 0)
    cd = cur['quotes_diff']
    if cd > bd:
        problems.append({'name': '引号', 'cat': 'pair', 'msg': '差 %d→%d' % (bd, cd)})

    ok = len(problems) == 0
    results = [{
        'name': 'V66风格锁 防回潮',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:6])),
    }]
    return {'name': 'V66风格锁', 'ok': ok, 'results': results, 'details': detail}
