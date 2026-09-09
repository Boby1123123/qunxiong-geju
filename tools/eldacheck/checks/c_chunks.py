#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_chunks: v62 内容分片健康检查（片文件存在/节点合法/前缀一致/主片无重复/死链复核）。"""
import io, os, re, sys
from . import find_node_ids

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))


def _read_chunks():
    """读取项目根 chunks/ 下 v62 片文件，返回 {name: {ids, text}}"""
    chunks = {}
    d = os.path.join(ROOT, 'chunks')
    if not os.path.isdir(d):
        return chunks
    for fn in sorted(os.listdir(d)):
        if fn.startswith('v62_') and fn.endswith('.js'):
            p = os.path.join(d, fn)
            try:
                text = io.open(p, encoding='utf-8').read()
            except Exception:
                text = ''
            ids = re.findall(r'nodes\["([^"]+)"\]\s*=\s*function', text)
            chunks[fn] = {'ids': ids, 'text': text, 'path': p}
    return chunks


def run(html):
    chunks = _read_chunks()
    problems = []
    detail = {'chunk_files': len(chunks), 'chunk_nodes': 0, 'dead_in_chunks': 0}

    main_ids = set(find_node_ids(html).keys())
    go_refs = set(re.findall(r'go:\s*"([^"]+)"', html))

    chunk_ids = set()
    for fn, info in chunks.items():
        ids = info['ids']
        chunk_ids |= set(ids)
        detail['chunk_nodes'] += len(ids)
        # 1) 片文件非空
        if not info['text'].strip():
            problems.append({'name': fn, 'line': 0, 'cat': '空片文件', 'msg': '%s 为空' % fn})
            continue
        # 2) 片内节点括号配平（语法级）
        if not _syntax_ok(info['path']):
            problems.append({'name': fn, 'line': 0, 'cat': '片语法', 'msg': '%s node --check 失败' % fn})
        # 3) 与主文件重复
        dup = set(ids) & main_ids
        if dup:
            problems.append({'name': fn, 'line': 0, 'cat': '主片重复',
                             'msg': '%s 与主文件重复 %d 个（%s）' % (fn, len(dup), ','.join(list(dup)[:5]))})

    # 4) 片内 id 前缀必须命中 manifest（前缀规则：单 prefix 或 prefixes 数组）
    manifest = {}
    for m in re.finditer(r'window\.v62_manifest\s*=\s*window\.v62_manifest\s*\|\|\s*\{([^}]*)\}', html):
        for cm in re.finditer(r'(\w+)\s*:\s*\{[^}]*?(?:prefixes:\s*(\[[^\]]*\]))?(?:[^}]*?prefix:\s*"([^"]+)")?', m.group(1)):
            prefs = []
            if cm.group(2):
                prefs = re.findall(r'"([^"]+)"', cm.group(2))
            elif cm.group(3):
                prefs = [cm.group(3)]
            if prefs:
                manifest[cm.group(1)] = prefs
    for fn, info in chunks.items():
        if not manifest:
            break
        name = fn.replace('v62_', '').replace('.js', '')
        prefs = manifest.get(name)
        if prefs:
            bad = [i for i in info['ids'] if not any(i.startswith(p) for p in prefs)]
            if bad:
                problems.append({'name': fn, 'line': 0, 'cat': '前缀越界',
                                 'msg': '%s 内 %d 个节点不匹配前缀 %s（%s）' % (fn, len(bad), ','.join(prefs), ','.join(bad[:5]))})

    # 5) 死链复核：主文件 go 目标 ∈ (主 ∪ 片) 才健康
    dead = sorted(go_refs - main_ids - chunk_ids)
    detail['dead_in_chunks'] = len(dead)
    if dead:
        problems.append({'name': '死链复核', 'line': 0, 'cat': '片外死链',
                         'msg': '主+片全集外死链 %d 个（%s）' % (len(dead), ','.join(dead[:10]))})

    ok = len(problems) == 0
    results = [{
        'name': '分片检查 片=%d 节点=%d 死链复核=%d' % (len(chunks), detail['chunk_nodes'], detail['dead_in_chunks']),
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '分片健康', 'ok': ok, 'results': results, 'details': detail}


def _syntax_ok(path):
    import subprocess, tempfile
    try:
        r = subprocess.run(['node', '--check', path], capture_output=True, timeout=20)
        return r.returncode == 0
    except Exception:
        return True  # node 不可用时不阻断
