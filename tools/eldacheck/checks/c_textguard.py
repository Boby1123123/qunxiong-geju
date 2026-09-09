#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_textguard: CT-3 文本治理持续门禁（elda ci 第 21 检查器）。
与 tools/elda/p2tools_impl.py cmd_text_guard 同口径（扫 game.html）：
1. AI 高频词防回潮：GUARD_WORDS 每词 ≤ 30 处（v91 实测最高 22）
2. 中文引号配对：全库左=右
3. 连续标点：豁免"？！"组合
现有内容必须全绿（现状已达标），超阈值 FAIL 并输出逐词定位清单。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')

GUARD_WORDS = [
    '微微', '轻轻', '缓缓', '低声', '嘴角', '目光', '片刻', '仿佛', '似乎', '眼底',
    '心头', '喃喃', '沉吟', '皱眉', '深吸', '良久', '微叹', '眸光', '身形一闪', '不由',
    '下意识', '微微一怔', '淡淡道', '沉声道', '轻声道', '若有所思', '不动声色', '隐隐', '隐约', '些许',
]
GUARD_MAX_PER_WORD = 30


def _extract_text_values(text):
    """提取正文直接量（text:[...] 数组 / text:"..."），与 p2tools_impl 一致。"""
    vals = []
    pat = re.compile(r'text\s*:\s*(\[.*?\]|"[^"]*")', re.S)
    for m in pat.finditer(text):
        seg = m.group(1)
        if seg.startswith('['):
            for sm in re.finditer(r'"((?:[^"\\]|\\.)*)"', seg):
                vals.append(sm.group(1))
        else:
            vals.append(seg[1:-1])
    return vals


def run(html):
    problems = []
    vals = _extract_text_values(html)
    joined = ' '.join(vals)
    detail = {}
    # 1) 高频词
    word_hits = {}
    for w in GUARD_WORDS:
        c = joined.count(w)
        if c > GUARD_MAX_PER_WORD:
            word_hits[w] = c
    detail['word_hits'] = word_hits
    if word_hits:
        problems.append({'name': 'AI高频词', 'line': 0, 'cat': '文本',
                         'msg': '; '.join('%s×%d' % (k, v) for k, v in sorted(word_hits.items(), key=lambda x: -x[1]))})
    # 2) 引号配对
    lq = joined.count('“')
    rq = joined.count('”')
    detail['quotes'] = (lq, rq)
    if lq != rq:
        problems.append({'name': '引号配对', 'line': 0, 'cat': '文本', 'msg': '左=%d 右=%d' % (lq, rq)})
    # 3) 连续标点
    masked = joined.replace('？！', 'XX')
    punct = re.findall(r'[，。、！？；：]{2,}', masked)
    detail['punct'] = punct
    if punct:
        problems.append({'name': '连续标点', 'line': 0, 'cat': '文本', 'msg': '%d 处，如 %s' % (len(punct), ' / '.join(punct[:5]))})

    ok = len(problems) == 0
    results = [{
        'name': '文本治理 高频词=%d超标 引号配对=%s 连续标点=%d' % (
            len(word_hits), '是' if lq == rq else '否', len(punct)),
        'ok': ok,
        'msg': ('全部通过（防回潮基线保持）' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:4])),
    }]
    return {'name': '文本治理门禁', 'ok': ok, 'results': results, 'details': detail}
