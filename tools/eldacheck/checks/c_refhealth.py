#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_refhealth: 全局对象引用健康审计（V59-ENG 重写，基于 jsscan）。

判定矩阵（针对 v57 三 bug 类别）：
  e. window.X= 写 + window.X 读                     → PASS（健康窗口模式）
  e2. 顶层 var/function X + window.X 读             → PASS（顶层声明挂 window）
  a. 顶层 const/let X + window.X 读                 → FAIL（不挂 window，恒 undefined）
  c/d. 非顶层声明 + window.X 读                     → FAIL（IIFE 内不挂 window）
  f. 无声明无写 + window.X 读（非白名单）            → FAIL（恒 undefined）
  b. 裸引用且无声明（隐式全局）                      → WARN
  g. window.X 读 + 隐式全局赋值                     → PASS（非严格模式有效）
  h/h2. const/let/IIFE 声明 + 裸引用兜底 + window 读 → PASS
  k. 跨 script 裸引用其它 script 顶层 let/const       → FAIL（ReferenceError 风险）
  k2. 同上但本 script 有隐式全局赋值                 → WARN（读走 window，泄漏源头已归 c_structure）
"""
import re
from . import line_of
from .jsscan import strip_equal, script_starts, scan_script

# 浏览器/宿主内置（window 属性存在但本库未赋值），不做审计
BUILTIN = set('''window document localStorage sessionStorage location navigator history
console setTimeout setInterval clearTimeout clearInterval requestAnimationFrame
cancelAnimationFrame Math JSON Object Array String Number Boolean Date RegExp
Promise Error TypeError SyntaxError RangeError ReferenceError EvalError URIError
parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent
alert confirm prompt fetch Blob File FileReader Image Audio AudioContext URL
FormData Node Text HTMLElement Element CustomEvent Event KeyboardEvent
MouseEvent PointerEvent Uint8Array Uint16Array Uint32Array Int8Array Int16Array
Int32Array Float32Array Float64Array ArrayBuffer DataView Map Set WeakMap
WeakSet Symbol Proxy Reflect structuredClone queueMicrotask crypto caches
getComputedStyle matchMedia scrollTo scrollBy focus blur open close print
addEventListener removeEventListener dispatchEvent indexedDB innerWidth innerHeight
devicePixelRatio screen origin performance atob btoa Error Toast Center EventSource
WebSocket Worker localStorageCache customElements CSS fonts DOMParser XMLSerializer
MutationObserver IntersectionObserver ResizeObserver globalThis self top parent frames
webkitAudioContext webkitRequestAnimationFrame webkitURL msIndexedDB
showDirectoryPicker showOpenFilePicker showSaveFilePicker
'''.split())


def run(html):
    starts = script_starts(html)
    info = {}
    scripts_decl = []  # 每 script 顶层 let/const 名字集合

    for si, (s0, s1) in enumerate(starts):
        code = strip_equal(html[s0:s1])
        sc = scan_script(code)
        top_let_const = {name for name, kind, dp, pos in sc['decls']
                         if kind in ('let', 'const') and dp == 0}
        scripts_decl.append(top_let_const)
        for name, kind, dp, pos in sc['decls']:
            if name in BUILTIN:
                continue
            d = info.setdefault(name, {'win_write': [], 'win_read': [], 'decl': [],
                                       'bare': [], 'assign': []})
            d['decl'].append((kind, s0 + pos, dp, si))
        for name, pos, is_write in sc['wins']:
            if name in BUILTIN:
                continue
            d = info.setdefault(name, {'win_write': [], 'win_read': [], 'decl': [],
                                       'bare': [], 'assign': []})
            (d['win_write'] if is_write else d['win_read']).append(s0 + pos)
        for name, pos, dp in sc['bares']:
            if name in BUILTIN:
                continue
            d = info.setdefault(name, {'win_write': [], 'win_read': [], 'decl': [],
                                       'bare': [], 'assign': []})
            d['bare'].append((s0 + pos, dp, si))
        for name, pos, dp in sc['assigns']:
            if name in BUILTIN:
                continue
            d = info.setdefault(name, {'win_write': [], 'win_read': [], 'decl': [],
                                       'bare': [], 'assign': []})
            d['assign'].append((s0 + pos, dp))

    fails, warns, passes, specials = [], [], [], []
    n_scripts = len(starts)

    for name in sorted(info.keys()):
        d = info[name]
        n_ww, n_wr = len(d['win_write']), len(d['win_read'])
        decls, n_bare, n_assign = d['decl'], len(d['bare']), len(d['assign'])
        if n_ww == 0 and n_wr == 0 and not decls and n_bare == 0:
            continue

        top_var_fn = any(k in ('var', 'function') and dp == 0 for k, _, dp, _ in decls)
        any_decl = bool(decls)
        has_let_const = any(k in ('let', 'const') for k, _, _, _ in decls)
        # 跨 script 裸引用检查：其它 script 顶层 let/const + 本 script 裸引用
        # → 潜在 ReferenceError（运行时才暴露）。作专项报告，不阻断主验证链。
        cross_scripts = set()
        for _, si in ((b[0], b[2]) for b in d['bare']):
            for sj in range(n_scripts):
                if sj != si and name in scripts_decl[sj]:
                    cross_scripts.add(si)
        if cross_scripts:
            # V60-ENG：显式 window.X= 导出后，裸引用回退解析到 window 属性（无 TDZ）→ 健康
            # U2-A6：顶层 var 声明同样挂 window（显式全局接口）→ 健康
            if n_ww > 0 or top_var_fn:
                passes.append({'name': name,
                               'rule': 'k3' if n_ww > 0 else 'k4',
                               'msg': ('跨 script 裸引用 + 显式 window.%s= 导出 ×%d（导出后回退 window，健康）' % (name, n_ww))
                               if n_ww > 0 else
                               '跨 script 裸引用 + 顶层 var %s 声明（挂 window，显式全局接口，健康）' % name})
                continue
            kind = 'k' if not n_assign else 'k2'
            loc = line_of(html, d['bare'][0][0])
            specials.append({'name': name, 'rule': kind,
                             'msg': '跨 script 裸引用顶层 let/const（引用 script%s 声明；%s）' % (
                                 sorted(cross_scripts),
                                 '无隐式全局兜底 → 运行时 ReferenceError 风险' if not n_assign
                                 else '存在隐式全局赋值 %d 次兜底' % n_assign),
                             'line': loc, 'n': n_bare})
            continue

        # --- window.X 读的判定 ---
        if n_wr > 0:
            if n_ww > 0:
                passes.append({'name': name, 'rule': 'e',
                               'msg': 'window.%s= ×%d + window.%s 读 ×%d（健康）' % (name, n_ww, name, n_wr)})
            elif top_var_fn:
                passes.append({'name': name, 'rule': 'e2',
                               'msg': '顶层 %s 声明 + window.%s 读 ×%d（挂 window，健康）' % (
                                   '/'.join(sorted(set(k for k, _, dp, _ in decls if dp == 0))), name, n_wr)})
            elif has_let_const:
                if d['bare']:
                    passes.append({'name': name, 'rule': 'h',
                                   'msg': 'const/let 声明 + window.%s 读 ×%d（存在裸引用 ×%d → window 为兜底，健康）' % (name, n_wr, n_bare)})
                else:
                    loc = line_of(html, d['win_read'][0])
                    fails.append({'name': name, 'rule': 'a',
                                  'msg': 'const/let 声明 + window.%s 读 ×%d（不挂 window → 恒 undefined）' % (name, n_wr),
                                  'line': loc})
            elif any_decl:
                if d['bare']:
                    passes.append({'name': name, 'rule': 'h2',
                                   'msg': 'IIFE/函数内声明 %s + window.%s 读 ×%d（存在裸引用 → window 为兜底，健康）' % (
                                       '/'.join(sorted(set(k for k, _, _, _ in decls))), name, n_wr)})
                else:
                    loc = line_of(html, d['win_read'][0])
                    fails.append({'name': name, 'rule': 'c/d',
                                  'msg': 'IIFE/函数内声明 %s + window.%s 读 ×%d（作用域外 → 恒 undefined）' % (
                                      '/'.join(sorted(set(k for k, _, _, _ in decls))), name, n_wr),
                                  'line': loc})
            else:
                if d['assign']:
                    passes.append({'name': name, 'rule': 'g',
                                   'msg': 'window.%s 读 ×%d（隐式全局赋值 ×%d → 非严格模式有效）' % (name, n_wr, len(d['assign']))})
                else:
                    loc = line_of(html, d['win_read'][0])
                    fails.append({'name': name, 'rule': 'f',
                                  'msg': 'window.%s 读 ×%d 但全文无声明无 window= 写（恒 undefined）' % (name, n_wr),
                                  'line': loc})
            continue

        # --- 无 window 读：顶层隐式全局裸引用 WARN ---
        # 仅顶层裸引用算隐式全局；函数内闭包参数（ELDA 库 fn/context/args 等）不算
        top_bare = [b for b in d['bare'] if b[1] == 0]
        if n_ww == 0 and not decls and top_bare and len(name) >= 2 and not n_assign:
            warns.append({'name': name, 'rule': 'b',
                          'msg': '无声明无 window 写但顶层裸引用 %d 次（隐式全局）' % len(top_bare)})
            continue

        # window.X= 写但无读：记录 PASS（可能仅为导出）
        if n_ww > 0 and n_wr == 0:
            passes.append({'name': name, 'rule': 'exp',
                           'msg': 'window.%s= ×%d（仅导出，未读）' % (name, n_ww)})

    ok = len(fails) == 0
    results = [
        {'name': 'FAIL %d 项' % len(fails), 'ok': ok,
         'msg': '；'.join('[%s] %s (行%s)' % (f['name'], f['msg'], f['line']) for f in fails[:30]) or '无 FAIL'},
        {'name': 'WARN %d 项' % len(warns), 'ok': True,
         'msg': '；'.join('[%s] %s' % (w['name'], w['msg']) for w in warns[:20]) or '无 WARN'},
        {'name': 'PASS %d 项' % len(passes), 'ok': True,
         'msg': '；'.join('[%s] %s' % (p['name'], p['msg']) for p in passes[:15]) or '无'},
        {'name': '专项:跨 script 引用 %d 项(潜在运行时风险,不阻断)' % len(specials), 'ok': True,
         'msg': '；'.join('[%s] %s (行%s)' % (s['name'], s['msg'], s['line']) for s in specials[:25]) or '无'},
    ]
    return {'name': '引用健康审计', 'ok': ok, 'results': results,
            'details': {'fails': fails, 'warns': warns, 'passes': passes, 'specials': specials}}
