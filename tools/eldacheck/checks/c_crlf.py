#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_crlf: 发布文件行尾门（elda ci 第 40 检查器，GR-3 新增）。

扫描 5 个发布文件，检出 CRLF（\\r\\n）即 FAIL——发布文件必须 LF。
"""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))

FILES = ['game.html', 'game_check.html', 'game_built.html', 'game_chunked.html', 'index.html']


def run(html=None):
    problems = []
    counts = {}
    for f in FILES:
        p = os.path.join(ROOT, f)
        try:
            with open(p, 'rb') as fh:
                data = fh.read()
            n = data.count(b'\r\n')
            counts[f] = n
            if n:
                problems.append({'name': f, 'line': 0, 'cat': '行尾',
                                 'msg': '%s CRLF %d 处（发布文件必须 LF）' % (f, n)})
        except Exception as e:
            problems.append({'name': f, 'line': 0, 'cat': '读取',
                             'msg': '%s 读取失败: %s' % (f, e)})

    ok = len(problems) == 0
    results = [{
        'name': 'CRLF行尾门（5 发布文件）',
        'ok': ok,
        'msg': ('全部 LF（%s）' % ' / '.join('%s=%d' % (k, v) for k, v in counts.items())
                if ok else '问题: ' + '; '.join(p['msg'] for p in problems[:6])),
    }]
    return {'name': 'CRLF行尾门', 'ok': ok, 'results': results,
            'details': {'counts': counts, 'problems': problems}}
