#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V59: 跨 script 顶层引用顺序仿真——提取 6 script 按页面顺序在 Node 中执行，
抓取 ReferenceError（TDZ / 未声明）与顶层立即执行错误，验证 52 项专项的真实运行时风险。"""
import io, re, subprocess, sys, os, tempfile

html = io.open('game.html', encoding='utf-8').read()
scripts = re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', html, re.S)
print('提取 script 数:', len(scripts))

stub_js = r"""
// ---- 最小 DOM stub（仅够顶层代码不崩） ----
const _noop = () => {};
globalThis.window = globalThis;
globalThis.document = { getElementById: () => null, querySelector: () => null,
  querySelectorAll: () => [], createElement: () => ({ style: {}, setAttribute: _noop }),
  addEventListener: _noop, body: { appendChild: _noop, style: {} },
  head: { appendChild: _noop }, documentElement: { style: {} } };
globalThis.localStorage = { getItem: () => null, setItem: _noop, removeItem: _noop };
globalThis.alert = _noop; globalThis.confirm = () => true; globalThis.prompt = () => '';
globalThis.addEventListener = _noop;
globalThis.requestAnimationFrame = (f) => setTimeout(f, 16);
globalThis.navigator = { userAgent: 'stub' };
const __errs = [];
"""

def run_in_order(scripts):
    code = 'const vm = require("vm");\n' + stub_js + """
const ctx = vm.createContext(globalThis);
"""
    # 每个 script 独立编译单元（vm.runInContext），共享 ctx 全局 → 精确复现浏览器多 script 语义
    for i, s in enumerate(scripts):
        s_repr = repr(s)
        code += 'try { vm.runInContext(%s, ctx, {filename: "script%d.js"}); } catch (e) { __errs.push("script%d THROW: " + (e && e.message || e)); }\n' % (s_repr, i, i)
    code += 'console.log("__ERRCOUNT__=" + __errs.length);\n__errs.slice(0, 50).forEach(x => console.log("__ERR__ " + x));\n'
    with tempfile.NamedTemporaryFile('w', suffix='.js', encoding='utf-8', delete=False) as f:
        f.write(code)
        tmp = f.name
    try:
        r = subprocess.run(['node', tmp], capture_output=True, text=True, timeout=180, cwd='.')
        return r
    finally:
        os.unlink(tmp)

r = run_in_order(scripts)
print('---- 页面顺序执行结果 ----')
for line in (r.stdout or '').splitlines():
    if line.startswith('__ERR'):
        print(line)
print('returncode:', r.returncode)
print('stderr(前600):', (r.stderr or '')[:600])
