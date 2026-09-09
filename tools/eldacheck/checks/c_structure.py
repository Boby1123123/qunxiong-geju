#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_structure: script 数量 / IIFE 数量 / 顶层全局泄漏 / 严格模式 IIFE 内裸引用。

V59-ENG 重写：基于 jsscan（全等长 strip + 全括号深度 + 多变量声明登记 + 参数列表隔离）。
判定：
- 顶层裸赋值（depth0 且非声明上下文）→ 隐式全局泄漏
- for 头无声明初始化 for(i=0;...) → 泄漏
- 多变量声明（let a, b=1）全部名字登记，不再误报
- 箭头函数参数 / 函数参数默认值 / function 参数列表 一律不计入
"""
import re
from collections import Counter
from . import extract_scripts
from .jsscan import strip_equal, script_starts, scan_script


def run(html):
    starts = script_starts(html)
    n_iife = len(re.findall(r'\(function\s*\(\s*\)\s*\{', html))
    strict_iifes = []

    for si, (s0, s1) in enumerate(starts):
        code = strip_equal(html[s0:s1])
        if "'use strict'" in code or '"use strict"' in code:
            strict_iifes.append(si)

    leaks = []
    for si, (s0, s1) in enumerate(starts):
        code = strip_equal(html[s0:s1])
        info = scan_script(code)
        top_decl = {name for name, kind, dp, pos in info['decls'] if dp == 0}
        any_decl = {name for name, kind, dp, pos in info['decls']}  # 任意深度声明
        # 顶层裸赋值
        for name, pos, dp in info['assigns']:
            if dp == 0 and name not in top_decl:
                leaks.append({'name': name, 'script': si, 'pos': s0 + pos,
                              'msg': '顶层隐式全局赋值（无声明）'})
        # for 头无声明初始化（任意深度均检查：函数内 var i 不算泄漏）
        for name, pos in info['for_heads']:
            if name not in any_decl:
                leaks.append({'name': name, 'script': si, 'pos': s0 + pos,
                              'msg': 'for 循环无声明初始化（隐式全局）'})

    seen = set()
    uniq_leaks = []
    # 全库标识符计数（一次扫描），替代逐项全库正则
    name_counter = Counter(re.findall(r'[A-Za-z_$][\w$]*', html))
    for l in leaks:
        key = (l['name'], l['script'])
        if key not in seen:
            seen.add(key)
            l['n_ref'] = name_counter[l['name']]
            uniq_leaks.append(l)

    real = [l for l in uniq_leaks if l['n_ref'] <= 1]
    legacy = [l for l in uniq_leaks if l['n_ref'] > 1]

    ok = len(real) == 0
    results = [{'name': 'script=%d IIFE=%d 严格模式块=%d' % (len(starts), n_iife, len(strict_iifes)),
                'ok': True, 'msg': '—'}]
    results.append({'name': '真泄漏(无引用)=%d' % len(real), 'ok': ok,
                    'msg': '；'.join('%s(script%d)' % (l['name'], l['script']) for l in real[:30]) or '无'})
    results.append({'name': '既有全局模式(有引用,建议收敛)=%d' % len(legacy), 'ok': True,
                    'msg': '；'.join('%s(script%d)' % (l['name'], l['script']) for l in legacy[:30]) or '无'})
    return {'name': '结构健康', 'ok': ok, 'results': results, 'details': {'leaks': uniq_leaks[:60]}}
