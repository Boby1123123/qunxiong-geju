# -*- coding: utf-8 -*-
"""c_speed V75：检查器耗时计时 + 性能预算门（budget.json，FAIL 级）。

- 耗时项（原有）：超阈值（默认 5s）慢检查器 WARN
- 预算门（V75 新增，FAIL 级）：读根目录 budget.json，逐项核验
  · game.html 字节 ≤ budget.game_html_bytes_max 且 ≤ baseline.game_html_bytes（逐版防膨胀）
  · game_chunked 字节 ≤ budget.chunked_html_bytes_max
  · 节点数 ≥ budget.node_total_min（内容零损失红线 2618）
  · 静态 go 死链 = 0（动态拼接 go 不计入）
  · elda full 总耗时 ≤ budget.full_seconds_max
  任一 FAIL → 本检查器 ok=False → elda full / elda ci 拦截发布。
"""
import io, os, re, sys, json, time

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
THRESHOLD = 5.0  # 秒（慢检查器）

_BUDGET_PATH = os.path.join(PROJ, 'budget.json')


def _node_count(html):
    """节点口径与 c_links/c_chunks 一致：单文件 N[id] 定义 + chunks 分片定义。"""
    from . import find_node_ids
    ids = set(find_node_ids(html).keys())
    d = os.path.join(PROJ, 'chunks')
    if os.path.isdir(d):
        for fn in os.listdir(d):
            if fn.startswith('v62_') and fn.endswith('.js'):
                try:
                    text = io.open(os.path.join(d, fn), encoding='utf-8').read()
                except Exception:
                    continue
                ids |= set(re.findall(r'nodes\["([^"]+)"\]\s*=\s*function', text))
    return len(ids)


def _go_refs(html):
    return re.findall(r'go:\s*"([^"]+)"', html)


def run(html=None, timings=None):
    """timings: {检查器名: 耗时秒}（由 eldacheck 主程序传入）；html: game.html 全文"""
    timings = timings or {}
    slow = [(name, t) for name, t in sorted(timings.items(), key=lambda x: -x[1]) if t >= THRESHOLD]
    total = sum(timings.values())
    top = [(name, t) for name, t in sorted(timings.items(), key=lambda x: -x[1])[:5]]
    lines = ['总耗时 %.2fs' % total]
    lines += ['%s %.2fs' % (n, t) for n, t in top]
    results = [
        {'name': '总耗时 %.2fs（%d 个检查器）' % (total, len(timings)), 'ok': True,
         'msg': '；'.join(lines)},
        {'name': '超阈值慢检查器=%d（>%.0fs）' % (len(slow), THRESHOLD), 'ok': len(slow) == 0,
         'msg': '；'.join('%s(%.1fs)' % (n, t) for n, t in slow[:10]) or '无'},
    ]
    ok = len(slow) == 0

    # ===== V75 预算门 =====
    if not os.path.exists(_BUDGET_PATH):
        results.append({'name': '性能预算门', 'ok': True,
                        'msg': '未配置 budget.json（%s），跳过预算检查' % _BUDGET_PATH})
        return {'name': '性能计时', 'ok': ok, 'results': results,
                'details': {'timings': timings, 'budget': None}}
    try:
        with io.open(_BUDGET_PATH, encoding='utf-8') as f:
            cfg = json.load(f)
        budgets = cfg.get('budgets', {})
        baseline = cfg.get('baseline', {})
    except Exception as e:
        results.append({'name': '性能预算门', 'ok': False,
                        'msg': 'budget.json 解析失败：%s' % e})
        return {'name': '性能计时', 'ok': False, 'results': results,
                'details': {'timings': timings, 'budget': 'parse-error'}}

    b_ok = True
    b_lines = []

    def _chk(name, passed, msg):
        nonlocal b_ok
        b_ok = b_ok and passed
        b_lines.append('[%s] %s' % ('PASS' if passed else 'FAIL', msg))

    try:
        gb = os.path.getsize(os.path.join(PROJ, 'game.html'))
    except OSError:
        gb = -1
    try:
        cb = os.path.getsize(os.path.join(PROJ, 'game_chunked.html'))
    except OSError:
        cb = -1

    gmax = budgets.get('game_html_bytes_max', 6000000)
    cmax = budgets.get('chunked_html_bytes_max', 3500000)
    nmin = budgets.get('node_total_min', 2618)
    dmax = budgets.get('dead_links_max', 0)
    fmax = budgets.get('full_seconds_max', 20.0)
    gbl = baseline.get('game_html_bytes')

    _chk('主文件大小', gb > 0 and gb <= gmax,
         'game.html=%sB ≤ 上限 %dB' % (gb, gmax))
    if gbl and gb > 0:
        _chk('主文件逐版防膨胀', gb <= gbl,
             'game.html=%sB ≤ baseline %dB（合法增长请更新 budget.json）' % (gb, gbl))
    _chk('分片文件大小', cb > 0 and cb <= cmax,
         'game_chunked=%sB ≤ 上限 %dB' % (cb, cmax))

    node_total = -1
    dead = -1
    if html:
        nids = _node_count(html)
        node_total = nids
        grefs = _go_refs(html)
        # 节点全集（同口径）
        from . import find_node_ids
        ids = set(find_node_ids(html).keys())
        d = os.path.join(PROJ, 'chunks')
        if os.path.isdir(d):
            for fn in os.listdir(d):
                if fn.startswith('v62_') and fn.endswith('.js'):
                    try:
                        text = io.open(os.path.join(d, fn), encoding='utf-8').read()
                    except Exception:
                        continue
                    ids |= set(re.findall(r'nodes\["([^"]+)"\]\s*=\s*(?:function\b|\{)', text))
        dead = len([g for g in grefs if g not in ids])
    _chk('节点数下限', node_total >= nmin,
         '节点=%d ≥ 下限 %d（内容零损失红线）' % (node_total, nmin) if node_total >= 0
         else '节点数不可用（html 未传入）')
    if dead >= 0:
        _chk('静态死链', dead <= dmax, '静态 go 死链=%d ≤ %d' % (dead, dmax))
    _chk('full 总耗时', total <= fmax, '总耗时=%.2fs ≤ %.1fs' % (total, fmax))

    results.append({'name': '性能预算门（budget.json %d 项）' % len(b_lines),
                    'ok': b_ok, 'msg': '；'.join(b_lines) or '（无预算项）'})
    ok = ok and b_ok

    return {'name': '性能计时', 'ok': ok, 'results': results,
            'details': {'timings': timings, 'budget': {
                'game_html_bytes': gb, 'chunked_html_bytes': cb,
                'node_total': node_total, 'dead_links': dead, 'full_seconds': round(total, 2)}}}
