#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""eldacheck 公共工具：读取 game.html、提取 script、定位行号。"""
import io, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(ROOT, '..', '..'))  # 群雄割据根目录
GAME = os.path.join(PROJ, 'game.html')


def read_game(path=None):
    p = path or GAME
    with io.open(p, encoding='utf-8') as f:
        return f.read()


def extract_scripts(html):
    """提取全部 <script> 内联内容（含属性形式 <script ...>）。"""
    scripts = []
    pos = 0
    while True:
        m = re.search(r'<script[^>]*>', html[pos:])
        if not m:
            break
        start = pos + m.end()
        end = html.find('</script>', start)
        if end == -1:
            break
        scripts.append(html[start:end])
        pos = end + 9
    return scripts


def line_of(html, offset):
    """把字符偏移换算为行号（1 起）。"""
    return html.count('\n', 0, offset) + 1


def find_node_ids(html):
    """提取全部 N[id] 定义。返回 dict: id -> (offset, kind)"""
    ids = {}
    for m in re.finditer(r'N\["([^"]+)"\]\s*=\s*(function|\{)', html):
        ids[m.group(1)] = (m.start(), m.group(2))
    return ids
