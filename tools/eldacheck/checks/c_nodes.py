#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_nodes: N[id] 节点格式校验。"""
import re
from . import line_of


def run(html):
    problems = []
    counts = {'nodes': 0}

    # 1) 全部节点定义 + 重复 id
    defs = {}
    for m in re.finditer(r'N\["([^"]+)"\]\s*=\s*function\s*\(', html):
        nid = m.group(1)
        counts['nodes'] += 1
        defs.setdefault(nid, []).append(m.start())

    for nid, offsets in defs.items():
        if len(offsets) > 1:
            problems.append({'name': nid, 'line': line_of(html, offsets[0]),
                             'cat': '重复定义', 'msg': '节点 %s 定义 %d 次（%s）' % (
                                 nid, len(offsets), '，'.join(str(line_of(html, o)) for o in offsets))})

    # 2) 逐节点括号配平 + 必含 text / options 字段
    PAT = re.compile(r'N\["([^"]+)"\]\s*=\s*function\s*\([^)]*\)\s*\{')
    checked = 0
    for m in PAT.finditer(html):
        nid = m.group(1)
        start = m.end() - 1  # 函数体 '{' 位置
        # 括号配平找节点体结尾（depth 从 1 起算，函数体 '{' 计入）
        depth = 1
        i = start + 1
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
        body = html[start:i + 1] if i < n else ''
        if not body:
            problems.append({'name': nid, 'line': line_of(html, m.start()),
                             'cat': '括号未闭合', 'msg': '节点 %s 无法配平括号' % nid})
            continue
        checked += 1
        # text 字段存在（任意值形态：function/数组/三元/变量/字符串）
        has_text = re.search(r'\btext\s*:', body)
        if not has_text:
            problems.append({'name': nid, 'line': line_of(html, m.start()),
                             'cat': '缺 text', 'msg': '节点 %s 缺少 text 字段' % nid})
        # options 字段存在（部分节点可无 options，仅 WARN）
        has_opts = re.search(r'\boptions\s*:\s*(function\s*\(|\[)', body)
        # 选项误用 text:（在 options 块内 {text: 开头的选项对象）
        opt_start = None
        om = re.search(r'\boptions\s*:\s*(function\s*\([^)]*\)\s*\{)', body)
        if om:
            opt_start = om.end()
        elif re.search(r'\boptions\s*:\s*\[', body):
            opt_start = re.search(r'\boptions\s*:\s*\[', body).end()
        if opt_start:
            seg = body[opt_start:opt_start + 4000]
            for bad in re.finditer(r'\{\s*text\s*:', seg):
                problems.append({'name': nid, 'line': line_of(html, m.start() + opt_start + bad.start()),
                                 'cat': '选项误用text:', 'msg': '节点 %s 选项对象用了 text:（应为 t:）' % nid})
        if not has_opts:
            # 检查是否确实无任何出口（终局节点允许）
            pass

    ok = len(problems) == 0
    results = [{'name': '节点=%d 已配平=%d 问题=%d' % (counts['nodes'], checked, len(problems)),
                'ok': ok, 'msg': '；'.join('[%s] %s (行%s)' % (p['name'], p['msg'], p['line']) for p in problems[:40]) or '无问题'}]
    return {'name': '节点格式校验', 'ok': ok, 'results': results, 'details': problems}
