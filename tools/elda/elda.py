#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""elda — 群雄割据工具链统一入口（V59-ENG）。

子命令：
  elda quick | full     一键体检（调 eldacheck）
  elda chunks           分片构建 + 完整性 + 语法（收编 _v42_*）
  elda sync             四路同步 + 字节校验
  elda audit            按 audit_registry.json 顺序跑全部注册审计
  elda stale            过时文件检测（候选清理清单）
  elda doctor           环境自检
  elda ledger           自动生成结构台账 docs\\结构台账_<日期>.md
  elda registry         打印工具注册表
  elda regress          浏览器回归 bu cell 模板（V60-ENG，含 dialog 分支处理）
  elda ci               发布门禁：语法→幂等→四路字节→full（只读，一条命令）
  elda serve [--port N] 本地 HTTP 服务（V63.5：http://127.0.0.1:N/index.html）
"""
import io, json, os, re, shutil, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..'))
ELDACHECK = os.path.join(PROJ, 'tools', 'eldacheck', 'eldacheck.py')
GAME = os.path.join(PROJ, 'game.html')
AUDIT_REG = os.path.join(PROJ, 'tools', 'audit_registry.json')
TOOL_REG = os.path.join(PROJ, 'tools', 'registry.json')
DOCS = os.path.join(PROJ, 'docs')
BACKUP = os.path.join(PROJ, 'backup')

PY = sys.executable


def _run(cmd, cwd=PROJ, env=None):
    """跑外部命令，透传输出，返回 returncode。"""
    return subprocess.call(cmd, cwd=cwd, shell=True, env=env)


def cmd_quick_full(full):
    return _run('"%s" "%s" %s' % (PY, ELDACHECK, '--full' if full else '--quick'))


def cmd_chunks():
    """分片构建（批 P0-1 收编）：合并视图 -> 分片构建 -> 合并验证 -> 语法检查。
    不再调用根目录历史脚本（_v62_merge/_v42_*），逻辑内联于 tools/elda/chunks_impl.py。
    """
    try:
        import sys as _sys
        _sys.path.insert(0, os.path.join(PROJ, 'tools', 'elda'))
        import chunks_impl
    except Exception as e:
        print('[FAIL] 无法导入 chunks_impl:', e)
        return 1
    full_tmp = os.path.join(PROJ, 'game_v62_full.html')
    ok = True
    print('---- 分片合并视图 ----')
    if chunks_impl.merge_v62(PROJ) != 0:
        ok = False
    src = full_tmp if os.path.exists(full_tmp) else 'game.html'
    print('---- 分片构建（src=%s）----' % src)
    if chunks_impl.build_chunks(PROJ, src) != 0:
        ok = False
    print('---- 分片合并验证 ----')
    if chunks_impl.verify_chunks(PROJ) != 0:
        ok = False
    print('---- 分片语法检查 ----')
    if chunks_impl.chk_syntax(PROJ) != 0:
        ok = False
    if os.path.exists(full_tmp):
        try:
            os.remove(full_tmp)
            print('临时合并视图已清理')
        except OSError:
            pass
    return 0 if ok else 1


def cmd_sync():
    files = ['game.html', 'game_check.html', 'game_chunked.html', 'index.html']
    shutil.copyfile(os.path.join(PROJ, 'game.html'), os.path.join(PROJ, 'game_check.html'))
    shutil.copyfile(os.path.join(PROJ, 'game_chunked.html'), os.path.join(PROJ, 'index.html'))
    sizes = {f: os.path.getsize(os.path.join(PROJ, f)) for f in files}
    print('四路同步完成:')
    for f in files:
        print('  %-18s %d 字节' % (f, sizes[f]))
    ok = sizes['game.html'] == sizes['game_check.html'] and sizes['game_chunked.html'] == sizes['index.html']
    print('字节校验: %s' % ('一致' if ok else '不一致!'))
    return 0 if ok else 1


def cmd_audit():
    if not os.path.exists(AUDIT_REG):
        print('缺少 %s' % AUDIT_REG)
        return 1
    with io.open(AUDIT_REG, encoding='utf-8') as f:
        reg = json.load(f)
    print('按注册表运行 %d 个审计:' % len(reg))
    all_ok = True
    for item in reg:
        if item.get('status') == 'placeholder' or not item.get('path'):
            print('  [SKIP] %s（扩展位，未注册脚本）' % item.get('auditId', '?'))
            continue
        path = os.path.join(PROJ, item['path'])
        if not os.path.exists(path):
            print('  [SKIP] %s（缺失 %s）' % (item['auditId'], item['path']))
            continue
        print('── %s: %s ──' % (item['auditId'], item.get('desc', '')))
        args = item.get('args', '')
        rc = _run('"%s" "%s" %s' % (PY, path, args))
        if rc != 0:
            all_ok = False
    return 0 if all_ok else 1


def cmd_stale():
    now = time.time()
    cands = []
    # 根目录一次性脚本：_*.py 不在 registry active
    active = set()
    if os.path.exists(TOOL_REG):
        with io.open(TOOL_REG, encoding='utf-8') as f:
            for it in json.load(f):
                if it.get('status') == 'active':
                    active.add(os.path.basename(it['path']))
    for fn in sorted(os.listdir(PROJ)):
        if fn.startswith('_') and fn.endswith('.py'):
            p = os.path.join(PROJ, fn)
            age = (now - os.path.getmtime(p)) / 86400
            if fn not in active:
                cands.append((fn, '根目录未注册脚本', '%.1f 天' % age))
        if fn.startswith('_probe') or fn.startswith('_seg') or fn.startswith('old_chk'):
            cands.append((fn, '临时/中间产物', ''))
    for fn in sorted(os.listdir(PROJ)):
        if fn.endswith('.tmp') or fn in ('__pycache__',) or fn.endswith('.pyc'):
            cands.append((fn, '缓存/临时', ''))
    # backup 超龄（保留 5）
    if os.path.exists(BACKUP):
        bks = sorted(os.listdir(BACKUP))
        for fn in bks[:-5]:
            cands.append((fn, '超龄备份（保留5）', os.path.join('backup', fn)))
    # __pycache__ 递归
    for root, dirs, files in os.walk(PROJ):
        if '__pycache__' in dirs:
            cands.append((os.path.relpath(os.path.join(root, '__pycache__'), PROJ), '缓存目录', ''))
        for f in files:
            if f.endswith('.pyc'):
                cands.append((os.path.relpath(os.path.join(root, f), PROJ), 'pyc 缓存', ''))
    print('过时候选清单（%d 项，入 docs\\清理清单_v59.md）:' % len(cands))
    for fn, why, extra in cands[:60]:
        print('  %-30s %s %s' % (fn, why, extra))
    if len(cands) > 60:
        print('  … 共 %d 项' % len(cands))
    return 0


def cmd_doctor():
    checks = [
        ('Python 版本', sys.version.split()[0]),
    ]
    try:
        r = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=10)
        checks.append(('Node 版本', r.stdout.strip()))
    except Exception as e:
        checks.append(('Node 版本', '不可用: %s' % e))
    for f, label in [(ELDACHECK, 'eldacheck'), (os.path.join(PROJ, 'tools', 'elda', 'chunks_impl.py'), '分片实现(收编)'),
                     (GAME, 'game.html'), (os.path.join(PROJ, 'game_check.html'), 'game_check'),
                     (os.path.join(PROJ, 'game_chunked.html'), 'game_chunked'),
                     (os.path.join(PROJ, 'index.html'), 'index')]:
        checks.append((label, '存在' if os.path.exists(f) else '缺失!'))
    # 四路一致性
    sizes = {}
    for f in ['game.html', 'game_check.html', 'game_chunked.html', 'index.html']:
        p = os.path.join(PROJ, f)
        sizes[f] = os.path.getsize(p) if os.path.exists(p) else -1
    ok = sizes['game.html'] == sizes['game_check.html'] and sizes['game_chunked.html'] == sizes['index.html']
    checks.append(('四路字节一致', '是' if ok else '否!'))
    for k, v in checks:
        print('  %-16s %s' % (k, v))
    return 0 if ok else 1


def cmd_ledger():
    import re as _re
    html = io.open(GAME, encoding='utf-8').read()
    sys.path.insert(0, os.path.join(PROJ, 'tools', 'eldacheck'))
    from checks import find_node_ids
    from checks.jsscan import script_starts
    nodes = find_node_ids(html)
    starts = script_starts(html)
    markers = _re.findall(r'/v\d+inj:[A-Za-z0-9_-]+', html)
    iifes = len(_re.findall(r'\(function\s*\(\s*\)\s*\{', html))
    globs = sorted(set(_re.findall(r'window\.([A-Za-z_$][\w$]*)\s*=', html)))
    ts = time.strftime('%Y%m%d_%H%M%S')
    lines = ['# 结构台账 %s（elda ledger 自动生成）' % ts, '',
             '| 项 | 值 |', '|---|---|',
             '| 文件 | game.html |',
             '| 字节 | %d |' % len(html),
             '| script 数 | %d |' % len(starts),
             '| IIFE 数 | %d |' % iifes,
             '| 节点数 | %d |' % len(nodes),
             '| marker 种数 | %d |' % len(set(markers)),
             '| window 全局导出 | %d |' % len(globs), '',
             '## marker 分布', '']
    from collections import Counter
    mc = Counter(markers)
    for m, c in sorted(mc.items()):
        lines.append('- %s ×%d' % (m, c))
    lines += ['', '## window 全局导出', '']
    lines += ['- ' + g for g in globs[:80]]
    p = os.path.join(DOCS, '结构台账_%s.md' % ts)
    io.open(p, 'w', encoding='utf-8').write('\n'.join(lines))
    print('已生成 %s（节点 %d / marker %d / 全局 %d）' % (p, len(nodes), len(set(markers)), len(globs)))
    return 0


def cmd_registry():
    if not os.path.exists(TOOL_REG):
        print('缺少 %s' % TOOL_REG)
        return 1
    with io.open(TOOL_REG, encoding='utf-8') as f:
        reg = json.load(f)
    print('工具注册表（%d 项）:' % len(reg))
    for it in reg:
        print('  [%s] %-28s %s — %s' % (it.get('status', '?'), it['name'], it.get('category', ''),
                                         it.get('desc', '')))
    return 0


def cmd_regress():
    tpl = os.path.join(HERE, 'regression_template.py')
    return _run('"%s" "%s"' % (PY, tpl))


def cmd_serve(args):
    """elda serve [--port N] [--open]：本地 HTTP 服务（V63.5 网络化地基）。
    http://127.0.0.1:PORT/index.html 与 file:// 双击双轨并存；Ctrl+C 退出。"""
    port = 8000
    do_open = False
    i = 0
    while i < len(args):
        if args[i] == '--port' and i + 1 < len(args):
            try:
                port = int(args[i + 1])
            except ValueError:
                print('无效端口: %s' % args[i + 1])
                return 1
            i += 2
        elif args[i] == '--open':
            do_open = True
            i += 1
        else:
            print('未知参数: %s（用法：elda serve [--port N] [--open]）' % args[i])
            return 1
    try:
        import http.server, socketserver
        handler = http.server.SimpleHTTPRequestHandler
        for _ in range(10):
            try:
                httpd = socketserver.TCPServer(('127.0.0.1', port), handler)
                break
            except OSError:
                port += 1
        else:
            print('[serve] 端口 %d-%d 均被占用' % (port - 9, port))
            return 1
    except Exception as e:
        print('[serve] 启动失败: %s' % e)
        return 1
    os.chdir(PROJ)
    url = 'http://127.0.0.1:%d/index.html' % port
    print('=' * 52)
    print('群雄割据 本地服务已启动')
    print('  访问: ' + url)
    print('  file:// 双击 game.html 仍可玩（双轨并存）')
    print('  Ctrl+C 退出')
    print('=' * 52)
    if do_open:
        try:
            import webbrowser
            webbrowser.open(url)
        except Exception:
            pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n[serve] 已退出')
    return 0


def cmd_schema(args):
    """S 状态 Schema 提取与审计（批2/P0-4）。用法：elda schema [extract|audit|report]"""
    mode = args[0] if args else 'audit'
    sub = os.path.join(PROJ, 'tools', 'elda', 'schema_elda.py')
    if not os.path.exists(sub):
        print('[FAIL] 缺少 %s' % sub)
        return 1
    if mode in ('extract', 'audit', 'report'):
        return _run('"%s" -X utf8 "%s" %s' % (PY, sub, mode))
    print('用法: elda schema [extract|audit|report]（audit=真裸引用风险，report=生成文档）')
    return 1



def cmd_build(args):
    """权威源构建闭环：verify（幂等）/ sync（四路同步）。用法：elda build [verify|sync]"""
    mode = args[0] if args else 'verify'
    sub = os.path.join(PROJ, '_build_authority.py')
    if not os.path.exists(sub):
        print('[FAIL] 缺少 %s' % sub)
        return 1
    if mode in ('verify', 'extract', 'build', 'sync'):
        return _run('"%s" -X utf8 "%s" %s' % (PY, sub, mode))
    print('用法: elda build [verify|sync]（verify=幂等校验；sync=四路同步）')
    return 1




def cmd_ci():
    """发布门禁：src 语法 → 权威源幂等 verify → 四路字节一致 → elda full。只读，不写文件。"""
    import glob
    print('=' * 62)
    print('  elda ci — 发布门禁（只读校验链）')
    print('=' * 62)
    ok = True

    # 1. src 语法
    srcs = sorted(glob.glob(os.path.join(PROJ, 'src', 'script_*.js')))
    bad = []
    for s in srcs:
        rc = subprocess.call(['node', '--check', s], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if rc != 0:
            bad.append(os.path.basename(s))
    st1 = ('src 语法 node --check（%d 块）' % len(srcs), not bad)
    ok = ok and st1[1]

    # 2. 权威源幂等 verify（只读：src build 产物 == game.html）
    rc = cmd_build(['verify'])
    st2 = ('权威源幂等 verify（src→game.html 闭环）', rc == 0)
    ok = ok and st2[1]

    # 3. 四路字节一致
    files = ['game.html', 'game_check.html', 'game_chunked.html', 'index.html']
    sizes = {}
    for f in files:
        p0 = os.path.join(PROJ, f)
        sizes[f] = os.path.getsize(p0) if os.path.exists(p0) else -1
    ok4 = sizes['game.html'] > 0 and sizes['game.html'] == sizes['game_check.html'] \
        and sizes['game_chunked.html'] > 0 and sizes['game_chunked.html'] == sizes['index.html']
    st3 = ('四路字节一致（game=%dB game_check=%dB / chunked=%dB index=%dB）'
           % (sizes['game.html'], sizes['game_check.html'], sizes['game_chunked.html'], sizes['index.html']), ok4)
    ok = ok and st3[1]

    # 4. elda full（21 检查器：死链/分片/存档/marker/UI/因果账本/节奏战斗/文本治理门禁…）
    rc = cmd_quick_full(True)
    st4 = ('elda full 21 检查器', rc == 0)
    ok = ok and st4[1]

    print('-' * 62)
    for name, passed in [st1, st2, st3, st4]:
        print('  [%s] %s' % ('PASS' if passed else 'FAIL', name))
    print('=' * 62)
    if ok:
        print('  门禁结果：全部通过（可发布）')
    else:
        print('  门禁结果：存在失败项（禁止发布，先修复再重跑）')
    return 0 if ok else 1


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    cmd = sys.argv[1]
    if cmd == 'quick':
        return cmd_quick_full(False)
    if cmd == 'full':
        return cmd_quick_full(True)
    if cmd == 'chunks':
        return cmd_chunks()
    if cmd == 'sync':
        return cmd_sync()
    if cmd == 'audit':
        return cmd_audit()
    if cmd == 'stale':
        return cmd_stale()
    if cmd == 'doctor':
        return cmd_doctor()
    if cmd == 'ledger':
        return cmd_ledger()
    if cmd == 'registry':
        return cmd_registry()
    if cmd == 'snapshot':
        return _run('"%s" "%s" --snapshot' % (PY, ELDACHECK))
    if cmd == 'diff':
        return _run('"%s" "%s" --diff' % (PY, ELDACHECK))
    if cmd == 'build':
        return cmd_build(sys.argv[2:])
    if cmd == 'ci':
        return cmd_ci()
    if cmd == 'schema':
        return cmd_schema(sys.argv[2:])
    if cmd == 'node':
        import nodes_impl
        return nodes_impl.cmd_node(sys.argv[2:])
    if cmd == 'budget':
        import budget_impl
        return budget_impl.main(sys.argv[2:])
    if cmd == 'content' or cmd == 'text':
        import p2tools_impl
        if cmd == 'content':
            return p2tools_impl.cmd_content(sys.argv[2:])
        return p2tools_impl.cmd_text(sys.argv[2:])
    if cmd == 'regress':
        return cmd_regress()
    if cmd == 'serve':
        return cmd_serve(sys.argv[2:])
    print('未知子命令: %s' % cmd)
    print(__doc__)
    return 1


if __name__ == '__main__':
    sys.exit(main())
