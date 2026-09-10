#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_memorybank: 记忆注入 v3 双层加权检索检查（elda ci 第 28 检查器，UPG-02 新增）。

1. 事件记忆层：CAUSALITY_LEDGER 全部条目必须含 importance(1-5)/keywords 非空
2. 世界规则层：LOREBOOK constant=true 条目数量 >= 8（世界规则不被事件覆盖）
3. 引擎钩子：v92_memoryBank 与 writeNext 内 /v92inj:mem2hook/ 钩子必须存在
4. 开关：S.settings.memoryBank 兜底必须存在
"""
import io, os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')


def _extract_js_array(html, var_name):
    m = re.search(r'window\.%s\s*=\s*\[' % re.escape(var_name), html)
    if not m:
        return None
    i = m.end() - 1
    depth = 0
    in_str = esc = False
    j = i
    while j < len(html):
        c = html[j]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return html[i:j + 1]
        j += 1
    return None


def _parse_ledger(seg):
    try:
        return json.loads(seg)
    except Exception:
        return []


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    seg = _extract_js_array(html, 'CAUSALITY_LEDGER')
    items = _parse_ledger(seg) if seg else []
    detail['ledger'] = len(items)
    bad_field = 0
    for it in items:
        if not isinstance(it.get('importance'), int) or not (1 <= it['importance'] <= 5):
            bad_field += 1
            problems.append({'name': '账本记忆', 'cat': 'importance', 'msg': '%s importance 缺失或越界' % it.get('id')})
        if not (it.get('keywords') and len(it['keywords']) > 0):
            bad_field += 1
            problems.append({'name': '账本记忆', 'cat': 'keywords', 'msg': '%s keywords 为空' % it.get('id')})
    detail['ledger_bad'] = bad_field

    # 世界规则层：LOREBOOK constant 数量
    lseg = _extract_js_array(html, 'LOREBOOK')
    consts = 0
    if lseg:
        consts = len(re.findall(r'constant\s*:\s*true', lseg))
    detail['lore_const'] = consts
    if consts < 8:
        problems.append({'name': '世界规则层', 'cat': '常驻不足', 'msg': 'LOREBOOK constant 条目=%d < 8' % consts})

    # 引擎钩子与开关
    if 'v92_memoryBank = function' not in html and 'window.v92_memoryBank' not in html:
        problems.append({'name': '引擎钩子', 'cat': '缺失', 'msg': 'v92_memoryBank 未定义'})
    if '/v92inj:mem2hook/' not in html:
        problems.append({'name': '引擎钩子', 'cat': '未接入', 'msg': 'writeNext 内 mem2hook 未挂载'})
    if 's.settings.memoryBank===undefined' not in html:
        problems.append({'name': '开关兜底', 'cat': '缺失', 'msg': 'S.settings.memoryBank 兜底缺失'})

    ok = len(problems) == 0
    results = [{
        'name': '记忆库 账本=%(ledger)d 常驻=%(lore_const)d' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '记忆注入v3', 'ok': ok, 'results': results, 'details': detail}
