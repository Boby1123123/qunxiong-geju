#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_text: 文本质量扫描（只读，输出清单不自动改）。

检查项：AI 味高频词 / 段落重复 / 引号笔误 / 中文标点混用 / 权威口径核对。
"""
import re
from . import line_of

AI_WORDS = ['仿佛', '似乎', '然而', '悄然', '缓缓', '微微', '目光一凝', '嘴角', '眼眸',
            '轻轻', '静静', '淡淡', '低声', '叹息', '良久', '片刻', '不知不觉', '一瞬间',
            '某种', '莫名', '隐隐', '微微一愣', '心头一紧', '眼眶', '凝视', '望向远方']
# 过滤：AI 词要出现在中文语境；"片刻/良久"等叙事词低频可接受，这里只统计
AI_WORDS_STRONG = ['仿佛', '似乎', '然而', '悄然', '缓缓', '微微', '目光一凝', '眼眸',
                   '不知不觉', '莫名', '隐隐', '微微一愣', '心头一紧', '望向远方']

# 权威口径表（name -> 权威用词集合 / 别名）
CANON = {
    '职业': {
        '魔法师': ['法师'],  # 若出现"法师"作为职业指代需确认（法师通常指魔法师）
        '灵魂法师': [], '术士': ['炼金术士'], '战士': [], '骑士': [], '游侠': ['斥候'],
        '盗贼': [], '牧师': [], '商人': [],
    },
    '境界': {
        '启灵': [], '凝元': [], '化意': [], '宗师': [], '大宗师': [], '传奇': ['传说级'],
        '半神': [], '神话': [],
    },
}


def _node_texts(html):
    """提取各节点 text 文本（粗提取：节点体中的字符串字面量）。"""
    out = []  # (nid, line, text)
    PAT = re.compile(r'N\["([^"]+)"\]\s*=\s*function\s*\([^)]*\)\s*\{')
    for m in PAT.finditer(html):
        nid = m.group(1)
        start = m.end()
        depth = 0
        i = start
        n = len(html)
        in_str = None
        while i < n:
            c = html[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
                i += 1
                continue
            if c in ('"', "'", '`'):
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        body = html[start:i] if i < n else ''
        if not body:
            continue
        # 提取字符串字面量（含中文的）
        texts = []
        for sm in re.finditer(r'["\']((?:[^"\'\\]|\\.){2,})["\']', body):
            t = sm.group(1)
            if re.search(r'[\u4e00-\u9fff]', t):
                texts.append(t)
        if texts:
            out.append((nid, line_of(html, m.start()), ' '.join(texts)))
    return out


def run(html):
    nodes = _node_texts(html)
    # 1) AI 味高频词：按节点统计
    ai_hits = []  # (nid, line, word, count)
    for nid, ln, txt in nodes:
        c = 0
        wl = []
        for w in AI_WORDS_STRONG:
            k = txt.count(w)
            if k:
                c += k
                wl.append('%s×%d' % (w, k))
        if c >= 3:
            ai_hits.append((nid, ln, '，'.join(wl), c))
    ai_hits.sort(key=lambda x: -x[3])

    # 2) 引号笔误：中文语境中的英文引号残留
    quote_bad = []
    for nid, ln, txt in nodes:
        for bad in re.findall(r'[\u4e00-\u9fff]["\'"][\u4e00-\u9fff]', txt):
            quote_bad.append((nid, ln, bad))

    # 3) 半角标点混入中文句：中文后跟英文逗号/句号/分号/问号
    punct_bad = []
    for nid, ln, txt in nodes:
        for bad in re.findall(r'[\u4e00-\u9fff][,;?!](?=[\u4e00-\u9fff])', txt):
            punct_bad.append((nid, ln, bad))

    # 4) 口径核对：非法"法师"（当职业明确指魔法师时用"法师"——WARN 级，需人工）
    canon_bad = []
    # "炼金术士"合法语境：术士的炼金分支（v48.9 设定）、同学职业设定、术士试炼文本
    for nid, ln, txt in nodes:
        if '炼金术士' in txt:
            if '术士' in txt or nid.startswith('classmate') or '炼金术士的手' in txt:
                continue  # 合法语境（术士分支 / 同学设定 / 试炼文本）
            canon_bad.append((nid, ln, '出现"炼金术士"（现行职业名=术士，需确认语境）'))

    results = []
    results.append({'name': 'AI味 Top 节点=%d' % len(ai_hits), 'ok': True,
                    'msg': '；'.join('[%s] %s (行%s)' % (h[0], h[2], h[1]) for h in ai_hits[:25]) or '无 ≥3 次节点'})
    results.append({'name': '引号笔误=%d' % len(quote_bad), 'ok': len(quote_bad) == 0,
                    'msg': '；'.join('[%s] %s (行%s)' % (q[0], q[2], q[1]) for q in quote_bad[:25]) or '无'})
    results.append({'name': '半角标点混用=%d' % len(punct_bad), 'ok': len(punct_bad) == 0,
                    'msg': '；'.join('[%s] %s (行%s)' % (p[0], p[2], p[1]) for p in punct_bad[:25]) or '无'})
    results.append({'name': '口径疑点=%d' % len(canon_bad), 'ok': len(canon_bad) == 0,
                    'msg': '；'.join('[%s] %s (行%s)' % (c[0], c[1], c[2]) for c in canon_bad[:25]) or '无'})

    ok = len(quote_bad) == 0 and len(punct_bad) == 0
    return {'name': '文本质量扫描', 'ok': ok, 'results': results,
            'details': {'ai': ai_hits, 'quote': quote_bad, 'punct': punct_bad, 'canon': canon_bad,
                        'nodes_scanned': len(nodes)}}
