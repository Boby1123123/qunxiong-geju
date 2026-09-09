#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_links: go 引用死链检查（v62+：并入内容分片节点）。"""
import io, os, re
from collections import Counter
from . import find_node_ids

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.abspath(os.path.join(_HERE, '..', '..', '..'))


def _chunk_ids():
    """读取 chunks/v62_*.js 的节点 id 集合（分片感知）。"""
    ids = set()
    d = os.path.join(_ROOT, 'chunks')
    if not os.path.isdir(d):
        return ids
    for fn in os.listdir(d):
        if fn.startswith('v62_') and fn.endswith('.js'):
            try:
                text = io.open(os.path.join(d, fn), encoding='utf-8').read()
            except Exception:
                continue
            ids |= set(re.findall(r'nodes\["([^"]+)"\]\s*=\s*(?:function\b|\{)', text))
    return ids


def run(html):
    node_ids = set(find_node_ids(html).keys()) | _chunk_ids()
    go_refs = re.findall(r'go:\s*"([^"]+)"', html)
    dead = []
    for ref in go_refs:
        if ref not in node_ids:
            dead.append(ref)
    ok = len(dead) == 0
    counter = Counter(dead)
    details = {
        'nodes': len(node_ids),
        'go_refs': len(go_refs),
        'dead_count': len(dead),
        'dead_top': counter.most_common(30),
    }
    return {'name': '死链检查', 'ok': ok, 'results': [{
        'name': 'go引用=%d 节点=%d(含分片) 死链=%d' % (len(go_refs), len(node_ids), len(dead)),
        'ok': ok, 'msg': ('0 死链' if ok else '死链详情: ' + ', '.join('%s×%d' % (k, v) for k, v in counter.most_common(30))),
    }], 'details': details}
