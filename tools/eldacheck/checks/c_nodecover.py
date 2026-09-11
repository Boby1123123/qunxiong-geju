#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_nodecover: 单文件版/分片版节点覆盖门（elda ci 第 41 检查器，GR-3 新增）。

统计单文件版 game.html 与分片版 game_chunked.html（含其引用的 chunks/*.js）
的节点键数，要求单文件版 ≥ 分片版且差 ≤1%——保证两版节点覆盖一致
（GR-1 后两版均应含全量节点含 v62 序章分片）。
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')
CHUNKED = os.path.join(ROOT, 'game_chunked.html')
CHUNKS_DIR = os.path.join(ROOT, 'chunks')

_NODE_PAT = re.compile(r'(?:N|nodes)\[["\']([^"\']+)["\']\]\s*=\s*(?:function|{)')


def _node_ids(text):
    return set(_NODE_PAT.findall(text))


def _read(p):
    try:
        with io.open(p, encoding='utf-8') as f:
            return f.read()
    except Exception:
        return ''


def run(html=None):
    problems = []
    detail = {}

    single_ids = _node_ids(_read(GAME))

    # 分片版 = game_chunked.html 内联 + 引用的 chunks/*.js（含 v62_origin 等全部）
    chunk_ids = _node_ids(_read(CHUNKED))
    if os.path.isdir(CHUNKS_DIR):
        for fn in sorted(os.listdir(CHUNKS_DIR)):
            if fn.endswith('.js'):
                chunk_ids |= _node_ids(_read(os.path.join(CHUNKS_DIR, fn)))

    n_single = len(single_ids)
    n_chunk = len(chunk_ids)
    detail = {'n_single': n_single, 'n_chunked': n_chunk,
              'diff': n_single - n_chunk}

    if n_chunk <= 0:
        problems.append({'name': '分片版', 'line': 0, 'cat': '覆盖',
                         'msg': '分片版节点数 0，无法比对'})
    elif n_single < n_chunk:
        problems.append({'name': '覆盖', 'line': 0, 'cat': '覆盖',
                         'msg': '单文件版节点 %d < 分片版 %d（单文件必须为超集）' % (n_single, n_chunk)})
    else:
        diff = n_single - n_chunk
        pct = diff * 100.0 / n_chunk
        detail['diff_pct'] = round(pct, 2)
        if pct > 1.0:
            problems.append({'name': '覆盖', 'line': 0, 'cat': '覆盖',
                             'msg': '单文件版节点 %d 与分片版 %d 差 %d（%.2f%% > 1%%）' % (n_single, n_chunk, diff, pct)})

    ok = len(problems) == 0
    results = [{
        'name': '节点覆盖（单文件=%d / 分片=%d）' % (n_single, n_chunk),
        'ok': ok,
        'msg': ('覆盖一致（差 %d）' % detail.get('diff', 0)
                if ok else '问题: ' + '; '.join(p['msg'] for p in problems[:4])),
    }]
    return {'name': '节点覆盖门', 'ok': ok, 'results': results, 'details': detail}
