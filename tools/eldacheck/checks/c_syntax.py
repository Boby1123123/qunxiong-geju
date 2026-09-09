#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_syntax: 提取 6 个 script → node --check 语法检查（V59-ENG：并发执行）。"""
import io, os, subprocess, tempfile
from concurrent.futures import ThreadPoolExecutor
from . import extract_scripts, PROJ


def _check_one(i, s):
    with tempfile.NamedTemporaryFile('w', suffix='.js', encoding='utf-8', delete=False) as f:
        f.write(s)
        tmp = f.name
    try:
        r = subprocess.run(['node', '--check', tmp],
                           capture_output=True, text=True,
                           cwd=PROJ, timeout=60)
        if r.returncode == 0:
            return {'name': 'script%d' % i, 'chars': len(s), 'ok': True, 'msg': 'PASS'}
        return {'name': 'script%d' % i, 'chars': len(s), 'ok': False,
                'msg': 'FAIL: ' + (r.stderr or r.stdout)[:500]}
    except Exception as e:
        return {'name': 'script%d' % i, 'chars': len(s), 'ok': False, 'msg': 'EXC: %s' % e}
    finally:
        try:
            os.unlink(tmp)
        except OSError:
            pass


def run(html):
    scripts = extract_scripts(html)
    results = []
    ok = True
    with ThreadPoolExecutor(max_workers=6) as ex:
        for r in ex.map(lambda p: _check_one(*p), enumerate(scripts)):
            results.append(r)
            if not r['ok']:
                ok = False
    return {'name': '语法检查 (node --check ×%d 并发)' % len(scripts), 'ok': ok, 'results': results}
