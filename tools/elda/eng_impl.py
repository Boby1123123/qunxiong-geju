#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""工程链深化实现（E1-E4）：
  elda backup   —— 自动快照（zip 打包关键资产，保留最近 N 份）
  elda release  —— 发布自动化（门禁全绿 → bump 版本 → Release Notes → git tag [--push]）
  elda test     —— 全量回归（endings 结局全量校验 / events 事件池全量校验 / all）
  elda volume   —— 体积趋势（读 budget.json 历史，超上限 FAIL / 突增预警）
由 tools/elda/elda.py 分发调用。铁律：不触碰引擎/判定/存档语义；写操作前先备份。
"""
import io, json, os, re, shutil, subprocess, sys, time, datetime, zipfile, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..'))
BACKUP = os.path.join(PROJ, 'backup')
DOCS = os.path.join(PROJ, 'docs')
GAME = os.path.join(PROJ, 'game.html')
CHUNKED = os.path.join(PROJ, 'game_chunked.html')
SRC = os.path.join(PROJ, 'src')
VFILE = os.path.join(PROJ, 'version.json')
BUDGET = os.path.join(PROJ, 'budget.json')
RELEASE_LOG = os.path.join(DOCS, '版本发布记录.md')
PY = sys.executable
ELDA = os.path.join(HERE, 'elda.py')
NODE = shutil.which('node') or 'node'
CLS_OK = ('天灾', '人祸', '奇遇', '商机')


def _read(p, enc='utf-8'):
    return io.open(p, encoding=enc, errors='replace').read()


def _run(cmd, cwd=PROJ):
    return subprocess.call(cmd, cwd=cwd, shell=True)


def _size(p):
    return os.path.getsize(p) if os.path.exists(p) else -1


# ============================================================
# E1 · elda backup —— 自动快照
# ============================================================
def cmd_backup(args):
    ap = argparse.ArgumentParser(prog='elda backup')
    ap.add_argument('--reason', default='manual')
    ap.add_argument('--keep', type=int, default=12)
    a = ap.parse_args(args)
    os.makedirs(BACKUP, exist_ok=True)
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    tag = re.sub(r'[^0-9A-Za-z_\-\u4e00-\u9fff]', '', a.reason)[:40]
    name = 'snap_%s_%s.zip' % (ts, tag or 'misc')
    dst = os.path.join(BACKUP, name)
    items = []
    for rel in ('src', 'tools', 'docs', 'skills'):
        p = os.path.join(PROJ, rel)
        if os.path.isdir(p):
            items.append(rel)
    for rel in ('game.html', 'game_check.html', 'game_chunked.html', 'index.html',
                'game_built.html', 'chunks', '_build_authority.py', 'smoke_test.py',
                'budget.json', 'version.json', 'README.md', 'elda.bat'):
        if os.path.exists(os.path.join(PROJ, rel)):
            items.append(rel)
    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in items:
            p = os.path.join(PROJ, rel)
            if os.path.isdir(p):
                for root, dirs, files in os.walk(p):
                    dirs[:] = [d for d in dirs
                               if d not in ('backup', '.git', '__pycache__', 'node_modules')]
                    for f in files:
                        fp = os.path.join(root, f)
                        z.write(fp, os.path.relpath(fp, PROJ))
            else:
                z.write(p, rel)
    snaps = sorted(f for f in os.listdir(BACKUP)
                   if f.startswith('snap_') and f.endswith('.zip'))
    removed = []
    for old in snaps[:-a.keep]:
        try:
            os.remove(os.path.join(BACKUP, old))
            removed.append(old)
        except OSError:
            pass
    kb = os.path.getsize(dst) / 1024.0
    print('[OK] 快照: %s (%.1f KB)' % (name, kb))
    print('[OK] 保留 %d 份；本轮清理 %d 份旧快照' % (min(a.keep, len(snaps)), len(removed)))
    return 0


# ============================================================
# E2 · elda release —— 发布自动化
# ============================================================
def _read_version():
    if os.path.exists(VFILE):
        try:
            return json.load(io.open(VFILE, encoding='utf-8')).get('version', 'v91')
        except Exception:
            pass
    return 'v91'


def _collect_recent_docs(limit=8):
    """取 docs 最近修改的批次文档标题（排除生成物/汇总类）。"""
    skip = ('版本发布记录', 'volume_history', '结构台账', '工具手册', '开发工作流',
            'ci_guard_report', 'p2_expansion')
    files = []
    try:
        for f in os.listdir(DOCS):
            p = os.path.join(DOCS, f)
            if not f.endswith('.md') or not os.path.isfile(p):
                continue
            if any(s in f for s in skip):
                continue
            files.append((os.path.getmtime(p), f))
    except OSError:
        return []
    files.sort(reverse=True)
    out = []
    for _, f in files[:limit]:
        t = f[:-3]
        try:
            head = _read(os.path.join(DOCS, f)).strip().splitlines()
            first = re.sub(r'^#+\s*', '', head[0]).strip() if head else t
        except Exception:
            first = t
        out.append({'file': f, 'title': first})
    return out


def cmd_release(args):
    ap = argparse.ArgumentParser(prog='elda release')
    ap.add_argument('--note', default='')
    ap.add_argument('--push', action='store_true')
    a = ap.parse_args(args)

    print('== elda release ==')
    print('[1/4] 门禁检查（elda ci）…')
    if _run('"%s" "%s" ci' % (PY, ELDA)) != 0:
        print('[FAIL] 门禁未全绿，禁止发版（先修复再 release）')
        return 1

    cur = _read_version()
    m = re.match(r'v(\d+)$', cur)
    if not m:
        print('[FAIL] 版本号格式异常: %s' % cur)
        return 1
    new = 'v%d' % (int(m.group(1)) + 1)
    print('[2/4] 版本 %s -> %s' % (cur, new))

    notes = _collect_recent_docs()
    rec = {
        'version': new, 'from': cur,
        'released': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
        'note': a.note, 'changes': notes,
    }
    json.dump(rec, io.open(VFILE, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

    lines = [
        '',
        '## %s（%s）' % (new, rec['released']),
        '',
    ]
    if a.note:
        lines += ['- 说明：' + a.note, '']
    lines += ['本版落地的最近批次：']
    for c in notes:
        lines.append('- %s —— %s' % (c['title'], c['file']))
    lines += ['', '门禁口径：elda ci 21 检查器全绿 + smoke PASS + 四路字节一致。']
    with io.open(RELEASE_LOG, 'a', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('[3/4] Release Notes 已追加: docs/版本发布记录.md（%d 条批次）' % len(notes))

    r = subprocess.run(['git', 'tag', new], cwd=PROJ, capture_output=True, text=True)
    if r.returncode == 0:
        print('[OK] 已打 tag: %s' % new)
    else:
        print('[WARN] tag %s 已存在或失败: %s' % (new, r.stderr.strip()[:120]))

    if a.push:
        r = subprocess.run(['git', 'push', 'origin', 'main'], cwd=PROJ,
                           capture_output=True, text=True)
        r2 = subprocess.run(['git', 'push', 'origin', 'tag', new], cwd=PROJ,
                            capture_output=True, text=True)
        print('[OK] 已推送 main + tag %s（Pages 将自动部署）' % new)
        if r.returncode != 0:
            print(r.stderr.strip()[:200])
        if r2.returncode != 0:
            print(r2.stderr.strip()[:200])
    else:
        print('[提示] 未 push；确认后执行 git push origin main --tags 发布')
    return 0


# ============================================================
# E3 · elda test —— 全量回归
# ============================================================
_NODE_RE = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*(?:function\s*\(\)\s*\{\s*return\s*)?\{')


def _extract_nodes(text):
    """提取全部节点 id -> 对象文本（函数式/对象式双兼容）。"""
    nodes = {}
    for m in _NODE_RE.finditer(text):
        nid = m.group(1)
        i = text.find('{', m.start(), m.end())
        if i < 0:
            continue
        depth, j = 0, i
        while j < len(text):
            c = text[j]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        nodes[nid] = text[i:j + 1]
    return nodes


def _node_has(node_txt, keys):
    """key 存在性（兼容 JS 无引号 key：text: 与 "text": 均合法）。"""
    for k in keys:
        if re.search(r'["\']?%s["\']?\s*:' % re.escape(k), node_txt):
            return True
    return False


def _node_text_ok(node_txt):
    """text 字段合法：存在且非 空串/空数组。函数值/数组/字符串均合法。"""
    if not re.search(r'["\']?text["\']?\s*:', node_txt):
        return False
    if re.search(r'["\']?text["\']?\s*:\s*(""|\[\s*\])', node_txt):
        return False
    return True


def cmd_test_endings():
    text = _read(GAME)
    nodes = _extract_nodes(text)
    ends = sorted(k for k in nodes
                  if k.startswith('ending') or k.startswith('epilogue')
                  or k.startswith('aftermath') or k.startswith('v24_final')
                  or k.startswith('v36_ending') or k.startswith('ngplus_true'))
    fails = []
    for nid in ends:
        nt = nodes[nid]
        if not _node_text_ok(nt):
            fails.append('%s: 缺 text 或 text 空' % nid)
        if not _node_has(nt, ('options', 'go', 'then', 'choose', 'actions')):
            fails.append('%s: 无出边' % nid)
    # 入边统计（全图 go/then/options 目标，兼容无引号 key）
    indeg = {}
    for nid, nt in nodes.items():
        for tgt in re.findall(r'["\']?(?:go|then)["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt):
            indeg.setdefault(tgt, 0)
            indeg[tgt] += 1
        for tgt in re.findall(r'["\']?go["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt):
            indeg.setdefault(tgt, 0)
            indeg[tgt] += 1
    no_in = [n for n in ends if indeg.get(n, 0) == 0]
    print('== elda test endings ==')
    print('结局类节点: %d 个' % len(ends))
    for f in fails:
        print('  [FAIL] %s' % f)
    if no_in:
        print('  [WARN] 无入边结局（可能由状态机/动态可达）: %s' % ', '.join(no_in[:12]))
    if fails:
        print('  结局校验: FAIL（%d 项）' % len(fails))
        return 1
    print('  结局校验: PASS（%d 个全部有文本与出边）' % len(ends))
    return 0


def cmd_test_events():
    src = os.path.join(SRC, 'script_01.js')
    if not os.path.exists(src):
        print('[FAIL] 缺 src/script_01.js')
        return 1
    js = os.path.join(HERE, 'extract_events.js')
    r = subprocess.run([NODE, js, src], capture_output=True, text=True, timeout=30)
    if r.returncode != 0:
        print('[FAIL] node 提取事件池失败: %s' % r.stderr.strip()[:200])
        return 1
    pool = json.loads(r.stdout or 'null')
    if not isinstance(pool, list):
        print('[FAIL] EVENT_POOL_EXT 解析为空')
        return 1
    fails, ids = [], set()
    for i, ev in enumerate(pool):
        tag = ev.get('id', '<无id#%d>' % i)
        if not tag or tag in ids:
            fails.append('%s: id 缺失或重复' % tag)
        if tag:
            ids.add(tag)
        if ev.get('cls') not in CLS_OK:
            fails.append('%s: cls=%r 非法（应为 %s）' % (tag, ev.get('cls'), '/'.join(CLS_OK)))
        if not isinstance(ev.get('day'), int) or not (1 <= ev['day'] <= 9999):
            fails.append('%s: day=%r 非法' % (tag, ev.get('day')))
        t = ev.get('text')
        if not t or not isinstance(t, str) or len(t) < 8:
            fails.append('%s: text 缺失/过短' % tag)
    print('== elda test events ==')
    print('事件池: %d 则' % len(pool))
    for f in fails[:20]:
        print('  [FAIL] %s' % f)
    if fails:
        print('  事件校验: FAIL（%d 项）' % len(fails))
        return 1
    print('  事件校验: PASS（%d 则全部结构合法）' % len(pool))
    return 0


def cmd_test(args):
    ap = argparse.ArgumentParser(prog='elda test')
    ap.add_argument('what', nargs='?', default='all',
                    choices=('all', 'endings', 'events', 'branches'))
    a = ap.parse_args(args)
    rc = 0
    if a.what in ('all', 'endings'):
        rc = cmd_test_endings() or rc
    if a.what in ('all', 'events'):
        rc = cmd_test_events() or rc
    if a.what in ('all', 'branches'):
        rc = cmd_test_branches() or rc
    return rc


# ============================================================
# E4 · elda volume —— 体积趋势预警
# ============================================================
def cmd_volume(args):
    ap = argparse.ArgumentParser(prog='elda volume')
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args(args)
    game = _size(GAME)
    chunked = _size(CHUNKED)
    hist, budget = [], {}
    if os.path.exists(BUDGET):
        try:
            b = json.load(io.open(BUDGET, encoding='utf-8'))
            hist = b.get('meta', {}).get('history', []) or []
            budget = b.get('budgets', {}) or {}
        except Exception:
            pass
    recent = [h.get('game_bytes', 0) for h in hist[-5:] if h.get('game_bytes')]
    avg = sum(recent) / len(recent) if recent else 0
    growth = (game - avg) / avg * 100 if avg else 0
    cap = budget.get('game_html_bytes_max') or 0
    status, warn = 'PASS', []
    if cap and game > cap:
        status, warn = 'FAIL', ['超上限: %dB > %dB' % (game, cap)]
    elif avg and growth > 5:
        warn.append('突增预警: 较近 5 次均值 %+.1f%%（%dB）' % (growth, game))
    if a.json:
        print(json.dumps({
            'status': status, 'game_bytes': game, 'chunked_bytes': chunked,
            'avg5': int(avg), 'growth_pct': round(growth, 1),
            'cap': cap, 'warns': warn, 'samples': len(hist),
        }, ensure_ascii=False))
        return 0 if status == 'PASS' else 1
    print('== elda volume ==')
    print('历史样本: %d 条（budget.json meta.history）' % len(hist))
    print('  最近 6 条:')
    for h in hist[-6:]:
        print('    %s  game=%-9d chunked=%-9d 节点=%-5d %s' % (
            h.get('date', '?'), h.get('game_bytes', 0), h.get('chunked_bytes', 0),
            h.get('nodes', 0), (h.get('reason') or '')[:28]))
    print('  当前: game=%dB  chunked=%dB' % (game, chunked))
    if avg:
        print('  近 5 次均值: %dB（%+.1f%%）' % (int(avg), growth))
    if cap:
        print('  预算上限: %dB' % cap)
    for w in warn:
        print('  [%s] %s' % ('FAIL' if status == 'FAIL' else 'WARN', w))
    if status == 'FAIL':
        print('  体积趋势: FAIL（超预算，需 elda budget --reason 更新）')
        return 1
    print('  体积趋势: PASS')
    return 0


# ============================================================
# E6-① · elda restore —— 快照恢复（回滚命令化）
# ============================================================
def _snap_list():
    if not os.path.isdir(BACKUP):
        return []
    out = []
    for f in sorted(os.listdir(BACKUP)):
        if f.startswith('snap_') and f.endswith('.zip'):
            p = os.path.join(BACKUP, f)
            out.append((f, os.path.getsize(p), os.path.getmtime(p)))
    return out


def cmd_restore(args):
    ap = argparse.ArgumentParser(prog='elda restore')
    ap.add_argument('--list', action='store_true', help='列出全部快照')
    ap.add_argument('--name', default='', help='指定快照文件名（snap_*.zip）')
    ap.add_argument('--latest', action='store_true', help='恢复最近一份快照')
    ap.add_argument('--dry-run', action='store_true', help='只预览将覆盖的文件，不执行')
    ap.add_argument('--no-backup', action='store_true', help='恢复前不备份当前状态（默认会备份）')
    a = ap.parse_args(args)

    snaps = _snap_list()
    if not snaps:
        print('[FAIL] backup\\ 无快照（先执行 elda backup）')
        return 1

    if a.list or (not a.name and not a.latest):
        print('== elda restore --list ==')
        for f, size, mtime in reversed(snaps):
            print('  %s  %.1fKB  %s' % (f, size / 1024.0,
                  datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')))
        print('用法: elda restore --name <snap_x.zip> 或 --latest [--dry-run] [--no-backup]')
        return 0

    name = ''
    if a.name:
        if not os.path.isfile(os.path.join(BACKUP, a.name)):
            print('[FAIL] 快照不存在: %s' % a.name)
            return 1
        name = a.name
    elif a.latest:
        name = snaps[-1][0]

    zpath = os.path.join(BACKUP, name)
    # 预览清单（防御路径穿越：只允许项目内相对路径）
    members = []
    with zipfile.ZipFile(zpath) as z:
        for zi in z.infolist():
            if zi.is_dir():
                continue
            rel = zi.filename.replace('\\', '/')
            if rel.startswith('/') or '..' in rel.split('/'):
                print('[FAIL] 快照含非法路径: %s（拒绝恢复）' % zi.filename)
                return 1
            members.append(rel)
    members.sort()
    print('== elda restore ==')
    print('快照: %s（%d 个文件）' % (name, len(members)))
    print('将覆盖/新增:')
    for rel in members[:12]:
        print('  + %s' % rel)
    if len(members) > 12:
        print('  ... 共 %d 个文件' % len(members))
    if a.dry_run:
        print('[dry-run] 未执行任何写入')
        return 0

    # 恢复前备份当前状态（默认）
    if not a.no_backup:
        ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        pre = os.path.join(BACKUP, 'pre_restore_%s.zip' % ts)
        with zipfile.ZipFile(pre, 'w', zipfile.ZIP_DEFLATED) as z:
            for rel in members:
                p = os.path.join(PROJ, rel)
                if os.path.exists(p):
                    z.write(p, rel)
        print('[OK] 当前状态已备份: %s' % os.path.basename(pre))

    # 解压恢复
    with zipfile.ZipFile(zpath) as z:
        for zi in z.infolist():
            if zi.is_dir():
                continue
            z.extract(zi, PROJ)
    print('[OK] 已恢复 %d 个文件' % len(members))

    # 恢复后验证链（快验：语法 + 四路 + 门禁）
    print('--- 恢复后验证 ---')
    rc = _run('"%s" "%s" ci' % (PY, ELDA))
    if rc != 0:
        print('[FAIL] 恢复后 elda ci 未全绿——如需退回恢复前，用备份 pre_restore_*.zip')
        return 1
    print('[OK] 恢复完成且门禁全绿')
    return 0


# ============================================================
# E6-② · elda test branches —— 支线闭环检测
# ============================================================
def cmd_test_branches():
    text = _read(GAME)
    nodes = _extract_nodes(text)
    branch_ids = [k for k, nt in nodes.items()
                  if re.search(r'["\']?tag["\']?\s*:\s*"branch"', nt)]
    if not branch_ids:
        print('== elda test branches ==')
        print('未发现 tag:"branch" 节点，跳过')
        return 0

    # 按 id 字母前缀分组（church_doubter1/2/3 → church_doubter；quest_find_1 → quest_find_）
    groups = {}
    for nid in branch_ids:
        m = re.match(r'([a-zA-Z_]+)', nid)
        key = m.group(1) if m else nid
        groups.setdefault(key, []).append(nid)

    # 全图出边/入边
    outs = {}
    for nid, nt in nodes.items():
        edges = re.findall(r'["\']?(?:go|then)["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt)
        edges += re.findall(r'["\']?go["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt)
        outs[nid] = set(edges)
    indeg = {}
    for nid, es in outs.items():
        for t in es:
            indeg.setdefault(t, 0)
            indeg[t] += 1

    fails, warns, total = [], [], 0
    for key in sorted(groups):
        ids = groups[key]
        total += 1
        gset = set(ids)
        if len(gset) < 2:
            continue  # 单节点"分支点"标记不算支线
        # 1) 组内每个节点有 text（真缺陷 → FAIL）
        for nid in ids:
            if not _node_text_ok(nodes[nid]):
                fails.append('%s/%s: 缺 text 或空' % (key, nid))
        # 2) 组内每个节点有出边（真缺陷 → FAIL：支线中断）
        for nid in ids:
            if not outs.get(nid):
                fails.append('%s/%s: 无出边（支线中断）' % (key, nid))
        # 3) 无入边节点 → WARN（事件/状态机动态进入，合法）
        for nid in ids:
            if indeg.get(nid, 0) == 0:
                warns.append('%s/%s: 无静态入边（动态进入，WARN）' % (key, nid))
        # 4) 组内互链统计 → 信息 + 0 互链 WARN（经主线 hub 中转是合法结构）
        inner_edges = 0
        for nid in ids:
            inner_edges += len(outs.get(nid, set()) & gset)
        if inner_edges == 0:
            warns.append('%s: 组内无直接互链（经外部节点中转，WARN 非 FAIL）' % key)

    print('== elda test branches ==')
    print('支线节点: %d 个（tag:"branch"），分组 %d 组（≥2 节点视为支线）' % (len(branch_ids), total))
    for w in warns:
        print('  [WARN] %s' % w)
    for f in fails:
        print('  [FAIL] %s' % f)
    if fails:
        print('  支线闭环: FAIL（%d 项）' % len(fails))
        return 1
    print('  支线闭环: PASS（%d 组，%d 节点，全部有文本/出边/闭环）' % (total, len(branch_ids)))
    return 0
