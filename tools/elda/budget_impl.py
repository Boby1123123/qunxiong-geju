#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""U9 预算自动化（D3）：elda budget —— 内容量 -> 预算自动估算。
用法：python -X utf8 tools\\elda\\elda.py budget [--reason "说明"]
- 读取当前 game.html / game_chunked.html 字节 + 节点数
- 自动更新 budget.json：limits（上限=当前值+余量）、baseline（当前值）、node_total_min（当前值-安全余量）
- 自动记录 meta.last_updated / meta.reason（追加到 history）
- 校验：全链路一条命令可跑，不改引擎/存档/判定。
"""
import io, json, os, sys, re, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..'))
BUDGET = os.path.join(PROJ, 'budget.json')
GAME = os.path.join(PROJ, 'game.html')
CHUNKED = os.path.join(PROJ, 'game_chunked.html')

# 安全余量（字节 / 节点）
GAME_MARGIN = 50000        # 上限 = 当前 + 50KB 余量
CHUNKED_MARGIN = 100000    # 上限 = 当前 + 100KB 余量
NODE_MARGIN = 50           # 下限 = 当前 - 50 节点


def node_count():
    """与 eldacheck 口径一致：单文件 N[id] 定义 + chunks v62 分片定义。"""
    import re as _re
    ids = set()
    if os.path.isfile(GAME):
        t = io.open(GAME, encoding='utf-8', errors='replace').read()
        ids |= set(_re.findall(r'N\["([^"]+)"\]\s*=\s*(?:function|\{)', t))
    d = os.path.join(PROJ, 'chunks')
    if os.path.isdir(d):
        for fn in os.listdir(d):
            if fn.startswith('v62_') and fn.endswith('.js'):
                try:
                    text = io.open(os.path.join(d, fn), encoding='utf-8', errors='replace').read()
                except Exception:
                    continue
                ids |= set(_re.findall(r'nodes\["([^"]+)"\]\s*=\s*function', text))
    return len(ids)


def main(argv):
    ap = argparse.ArgumentParser()
    ap.add_argument('--reason', default='', help='本次预算调整理由')
    ap.add_argument('--print', action='store_true', help='仅打印当前预算，不修改')
    args = ap.parse_args(argv)

    gb = os.path.getsize(GAME) if os.path.isfile(GAME) else -1
    cb = os.path.getsize(CHUNKED) if os.path.isfile(CHUNKED) else -1
    n = node_count()

    cfg = json.load(io.open(BUDGET, encoding='utf-8'))
    budgets = cfg.setdefault('budgets', {})
    baseline = cfg.setdefault('baseline', {})
    meta = cfg.setdefault('meta', {})

    old = {
        'game_max': budgets.get('game_html_bytes_max'),
        'chunked_max': budgets.get('chunked_html_bytes_max'),
        'node_min': budgets.get('node_total_min'),
        'game_base': baseline.get('game_html_bytes'),
        'node_base': baseline.get('node_total'),
    }
    if args.print:
        print('当前预算：')
        print('  game.html      %s 字节（上限 %s / baseline %s）' % (gb, old['game_max'], old['game_base']))
        print('  game_chunked   %s 字节（上限 %s）' % (cb, old['chunked_max']))
        print('  节点数         %s（下限 %s / baseline %s）' % (n, old['node_min'], old['node_base']))
        print('  meta: %s' % json.dumps(meta, ensure_ascii=False))
        return 0

    # 自动估算：上限 = 当前 + 余量；baseline = 当前
    budgets['game_html_bytes_max'] = gb + GAME_MARGIN
    budgets['chunked_html_bytes_max'] = max(budgets.get('chunked_html_bytes_max', cb + CHUNKED_MARGIN), cb + CHUNKED_MARGIN)
    budgets['node_total_min'] = max(2618, n - NODE_MARGIN)
    baseline['game_html_bytes'] = gb
    baseline['chunked_html_bytes'] = cb
    baseline['node_total'] = n

    hist = meta.setdefault('history', [])
    hist.append({
        'date': '2026-09-09',
        'game_bytes': gb,
        'chunked_bytes': cb,
        'nodes': n,
        'reason': args.reason or 'elda budget 自动估算',
    })
    meta['last_updated'] = '2026-09-09'
    meta['reason'] = args.reason or 'elda budget 自动估算'

    io.open(BUDGET, 'w', encoding='utf-8', newline='').write(json.dumps(cfg, ensure_ascii=False, indent=2))
    print('预算已自动更新：')
    print('  game_html_bytes_max    %s -> %s' % (old['game_max'], budgets['game_html_bytes_max']))
    print('  chunked_html_bytes_max %s -> %s' % (old['chunked_max'], budgets['chunked_html_bytes_max']))
    print('  node_total_min         %s -> %s' % (old['node_min'], budgets['node_total_min']))
    print('  baseline.game_html     %s -> %s' % (old['game_base'], baseline['game_html_bytes']))
    print('  reason: %s' % meta['reason'])
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
