#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 docs/版本发布记录.md 生成 docs/release.html 发布页（CI 自动调用）。
纯标准库，无外部依赖；HTML 无脚本依赖，可在 GitHub Pages 直接访问。
"""
import io, os, re, datetime, html as H

PROJ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(PROJ, 'docs', '版本发布记录.md')
DST = os.path.join(PROJ, 'docs', 'release.html')


def parse_versions(text):
    """解析 '## vXX（YYYY-MM-DD HH:MM）' 段，返回 [{ver, date, note, items}]（新的在前）。"""
    blocks = re.split(r'\n(?=## )', text)
    out = []
    for b in blocks:
        m = re.match(r'##\s*(v[\d.]+)[（(]([^）)]+)[)）]\s*', b)
        if not m:
            continue
        body = b[m.end():]
        note = ''
        mn = re.search(r'-\s*说明[：:]\s*(.+)', body)
        if mn:
            note = mn.group(1).strip()
        items = []
        for line in body.splitlines():
            line = line.strip()
            if line.startswith('- ') and '——' in line and 'docs/' not in line:
                items.append(line[2:].strip())
        out.append({'ver': m.group(1), 'date': m.group(2).strip(),
                    'note': note, 'items': items[:12]})
    return out


def build_html(versions):
    cards = []
    for v in versions:
        items = ''.join('<li>%s</li>' % H.escape(i) for i in v['items'])
        note = ('<p class="note">%s</p>' % H.escape(v['note'])) if v['note'] else ''
        cards.append(
            '<section class="card">'
            '<header><span class="ver">%s</span><span class="date">%s</span></header>'
            '%s<ul>%s</ul></section>'
            % (H.escape(v['ver']), H.escape(v['date']), note, items or '<li>（本版无批次记录）</li>'))
    total = len(versions)
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    return """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>艾尔达大陆 · 群雄割据 — 版本发布记录</title>
<style>
  body{margin:0;padding:32px 16px;background:#12141c;color:#d8dae2;
       font-family:"PingFang SC","Microsoft YaHei",Segoe UI,Arial,sans-serif;line-height:1.7}
  .wrap{max-width:860px;margin:0 auto}
  h1{font-size:24px;margin:0 0 6px;color:#f0f1f6}
  .sub{color:#8b90a5;font-size:13px;margin-bottom:24px}
  a{color:#94b8f0;text-decoration:none}
  .play{display:inline-block;margin:8px 0 20px;padding:8px 18px;border:1px solid #3a4157;
        border-radius:8px;font-size:14px;color:#cfe0ff}
  .card{background:#1a1e2b;border:1px solid #2a3042;border-radius:12px;
        padding:16px 20px;margin-bottom:16px}
  .card header{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}
  .ver{font-size:18px;font-weight:600;color:#e8c56a}
  .date{color:#8b90a5;font-size:12px}
  .note{color:#aab0c8;font-size:13px;margin:4px 0 8px}
  ul{margin:6px 0 0;padding-left:20px;color:#c6cadd;font-size:14px}
  li{margin:3px 0}
  footer{margin-top:28px;color:#5d6378;font-size:12px;text-align:center}
</style>
</head>
<body><div class="wrap">
<h1>艾尔达大陆 · 群雄割据</h1>
<div class="sub">超大型文字 MUD · 版本发布记录 · 自动生成于 %s · 共 %d 个版本</div>
<a class="play" href="../index.html">▶ 在线游玩（分片版）</a>
%s
<footer>由 elda-ci 自动生成 · docs/版本发布记录.md → docs/release.html</footer>
</div></body></html>""" % (now, total, ''.join(cards))


def main():
    if not os.path.exists(SRC):
        print('[FAIL] 缺 docs/版本发布记录.md')
        return 1
    text = io.open(SRC, encoding='utf-8').read()
    versions = parse_versions(text)
    if not versions:
        print('[FAIL] 未解析到任何版本条目')
        return 1
    html = build_html(versions)
    io.open(DST, 'w', encoding='utf-8', newline='\n').write(html)
    print('[OK] 发布页已生成: docs/release.html（%d 个版本，%d 字节）' % (len(versions), len(html)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
