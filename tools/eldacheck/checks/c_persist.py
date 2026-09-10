#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_persist: 三级持久化 + 会话恢复检查（elda ci 第 32 检查器，UPG-10 新增）。

1. sessionStorage 快照：v92_sessionSave/Key/Clear 定义 + flush 钩子调用
2. 自动存档：v92_autoTick 定义 + 每 10 节点计数 + autosave 槽读写
3. 会话恢复：v92_sessionRestore 定义 + init 内优先调用 + 建号清除
4. 面板：autosave 槽 + 恢复会话按钮 + 读取/删除函数
5. saveVersion=48 不被改动（抽查定义处）
"""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    problems = []
    detail = {}

    checks = [
        ('会话快照', 'window.v92_sessionSave = function', '定义'),
        ('会话快照', "sessionStorage.setItem(window.v92_sessionKey(), enc)", '写入'),
        ('flush钩子', "if(typeof v92_sessionSave === 'function') v92_sessionSave();", '每节点'),
        ('自动存档', 'window.v92_autoTick = function', '定义'),
        ('自动存档', "window.__v92nodeCount % 10 !== 0", '每10节点'),
        ('自动存档', "'autosave'", '槽位'),
        ('恢复', 'window.v92_sessionRestore = function', '定义'),
        ('恢复', "v92_sessionRestore()) return;", 'init优先'),
        ('新档清除', "if(typeof v92_sessionClear === 'function') v92_sessionClear();", '建号清除'),
        ('面板', 'v34_loadAutosave', 'autosave读取'),
        ('面板', 'v34_deleteAutosave', 'autosave删除'),
        ('面板', '恢复会话', '会话恢复按钮'),
        ('版本', "S.saveVersion = 48;", 'saveVersion'),
    ]
    for name, needle, cat in checks:
        if needle not in html:
            problems.append({'name': name, 'cat': cat, 'msg': '%s 缺失' % needle[:40]})
        else:
            detail[name] = True

    ok = len(problems) == 0
    results = [{
        'name': '持久化 覆盖=13',
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:110] for p in problems[:6])),
    }]
    return {'name': '三级持久化', 'ok': ok, 'results': results, 'details': detail}
