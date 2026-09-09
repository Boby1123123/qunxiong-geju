#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_markers: 注入 marker 台账扫描。"""
import re
from . import line_of


def run(html):
    markers = {}
    for m in re.finditer(r'(/v\d+inj:[A-Za-z0-9_]+(?:[-:][A-Za-z0-9_-]+)?)', html):
        mk = m.group(1)
        markers.setdefault(mk, []).append(m.start())

    entries = []
    dup = []
    # 多实例合法 marker（v62 内容分片：批量替换注释，每节点一个；loader 块注释双写）
    def _batch_ok(mk):
        # /v62inj:chunk-* 批量替换注释：每片每节点一个，数量应与片节点数一致
        return mk.startswith('/v62inj:chunk-')
    MAX_OK = {'/v62inj:loader': 2}
    for mk, offs in sorted(markers.items()):
        entries.append({'marker': mk, 'count': len(offs), 'lines': [line_of(html, o) for o in offs]})
        if len(offs) > 1:
            if _batch_ok(mk):
                continue
            if mk in MAX_OK and len(offs) <= MAX_OK[mk]:
                continue
            dup.append(mk)

    # 悬挂 marker：marker 后紧跟注释结束或空白且无实质内容（近似：后 60 字符内无 JS 语义）
    hang = []
    for mk, offs in markers.items():
        for o in offs:
            seg = html[o:o + 80]
            tail = seg[len(mk):]
            if re.match(r'^[\s*/]*(-->)?\s*$', tail) and '*/' in tail[:10]:
                hang.append({'marker': mk, 'line': line_of(html, o)})

    ok = len(dup) == 0
    results = [{'name': 'marker=%d 种' % len(markers), 'ok': True,
                'msg': '；'.join('%s×%d' % (e['marker'], e['count']) for e in entries[:25]) or '无 marker'}]
    results.append({'name': '重复 marker=%d' % len(dup), 'ok': ok,
                    'msg': '；'.join(dup[:20]) or '无'})
    results.append({'name': '悬挂 marker=%d' % len(hang), 'ok': len(hang) == 0,
                    'msg': '；'.join('%s(行%s)' % (h['marker'], h['line']) for h in hang[:20]) or '无'})
    return {'name': 'marker 台账', 'ok': ok and len(hang) == 0, 'results': results,
            'details': {'entries': entries, 'dup': dup, 'hang': hang}}
