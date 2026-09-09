#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_dialog: 原生 dialog 调用扫描（V60-ENG）。

基线白名单（已知 bu 阻塞风险点，INFO）：
  1. v34_deleteSlot      -> confirm("确定删除槽位"
  2. 覆盖存档流程        -> confirm("将用存档文件覆盖当前进度，确定？")
  3. confirmNewGame      -> confirm("确定要开始新游戏吗？当前存档将被清除。")
  4. askConfirm 包装     -> window.confirm(msg)   （游戏统一包装器，间接调用源）

规则：命中白名单 → INFO（回归前需处理）；非白名单原生 confirm/alert/prompt → WARN（疑似新增）。
不设 FAIL —— 基线 8 处合法保留（V60-ENG 红线：不改核心流程）。
"""
import re
from . import line_of

WHITELIST = [
    (r'confirm\("确定删除槽位"', 'v34_deleteSlot 删档确认'),
    (r'confirm\("将用存档文件覆盖当前进度，确定？"\)', '覆盖存档确认'),
    (r'confirm\("确定要开始新游戏吗？当前存档将被清除。"\)', 'confirmNewGame 新游戏确认'),
    (r'window\.confirm\(msg\)', 'askConfirm 包装器'),
]


def run(html):
    hits = []          # (line, kind, label, sig)
    for m in re.finditer(r'(?:window\.)?\b(confirm|alert|prompt)\s*\(', html):
        sig = html[m.start():m.start() + 60].replace('\n', ' ')
        ln = line_of(html, m.start())
        kind = m.group(1)
        label = None
        for pat, lab in WHITELIST:
            if re.search(pat, sig):
                label = lab
                break
        hits.append((ln, kind, label, sig[:58]))

    known = [h for h in hits if h[2]]
    suspect = [h for h in hits if not h[2]]

    info = [';'.join('行%s: %s(%s)' % (h[0], h[2], h[1]) for h in known) or '无'] if known else ['无']
    warn_msg = '；'.join('行%s: %s %s' % (h[0], h[1], h[3]) for h in suspect) or '无'
    results = [
        {'name': '原生 dialog 调用 %d 处' % len(hits), 'ok': True,
         'msg': '；'.join('行%s %s(%s)' % (h[0], h[1], h[2] or '未白名单') for h in hits[:20]) or '无'},
        {'name': '已知风险点(白名单) %d 处' % len(known), 'ok': True,
         'msg': info[0]},
        {'name': '疑似新增原生 dialog %d 处' % len(suspect), 'ok': True,
         'msg': warn_msg},
    ]
    return {'name': '原生 dialog 扫描', 'ok': True, 'results': results,
            'details': {'hits': hits, 'known': known, 'suspect': suspect}}
