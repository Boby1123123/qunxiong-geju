#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_lorebook: 世界书 Lorebook 检查（elda ci 第 27 检查器，UPG-01 新增）。

1. 每条 entry 必须含 id/title/constant/depth/text 字段
2. constant=false 的条目 triggers 必须非空且可独立成义（每条 trigger 长度 >= 2）
3. 核心设定词（金秤/七锚/铁牌/神谕/净化令/晨天）必须存在对应 constant=true 条目
4. recursive 链引用必须指向存在的 entry id（无悬空）
5. depth 只允许 0/1/2
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')


def _extract_lorebook(html):
    m = re.search(r'window\.LOREBOOK\s*=\s*\[', html)
    if not m:
        return None
    i = m.end() - 1
    depth = 0
    in_str = esc = False
    j = i
    while j < len(html):
        c = html[j]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return html[i:j + 1]
        j += 1
    return None


def _parse_entries(seg):
    if not seg:
        return []
    seg = re.sub(r'/\*.*?\*/', '', seg, flags=re.S)
    try:
        import json
        # 条目是 JS 对象字面量数组，key 无引号——用正则逐条提取
        pat = re.compile(r'\{([^{}]*)\}')
        out = []
        for m in pat.finditer(seg):
            body = m.group(1)
            d = {}
            for km in re.finditer(r'(\w+)\s*:\s*("(?:\\.|[^"\\])*"|\[[^\]]*\]|true|false|\d+)', body):
                key, val = km.group(1), km.group(2)
                if val.startswith('"'):
                    d[key] = json.loads(val)
                elif val.startswith('['):
                    d[key] = re.findall(r'"([^"]*)"', val)
                elif val == 'true':
                    d[key] = True
                elif val == 'false':
                    d[key] = False
                else:
                    d[key] = int(val)
            out.append(d)
        return out
    except Exception:
        return []


CORE = [('金秤', 'lb_goldscale'), ('七锚', 'lb_anchor_seven'), ('铁牌', 'lb_iron_token'),
        ('神谕', 'lb_oracle'), ('净化令', 'lb_purge_order'), ('晨天', 'lb_chengtian')]


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = ''
    seg = _extract_lorebook(html)
    entries = _parse_entries(seg)
    problems = []
    detail = {'entries': len(entries)}

    if entries is None:
        problems.append({'name': '世界书', 'cat': '缺失', 'msg': 'LOREBOOK 缺失'})
        detail['lorebook'] = '缺失'
    else:
        ids = set()
        for e in entries:
            if 'id' in e:
                ids.add(e['id'])
        for e in entries:
            if not e.get('id') or not e.get('title'):
                problems.append({'name': '世界书条目', 'cat': '缺字段', 'msg': '条目缺 id/title'})
                continue
            if 'constant' not in e or 'depth' not in e or 'text' not in e:
                problems.append({'name': '世界书条目', 'cat': '缺字段', 'msg': '%s 缺 constant/depth/text' % e['id']})
            if e.get('constant') is False and not (e.get('triggers') and len(e['triggers']) > 0):
                problems.append({'name': '世界书条目', 'cat': '触发缺失', 'msg': '%s 非常驻但 triggers 为空' % e['id']})
            if e.get('triggers'):
                for tr in e['triggers']:
                    if len(tr) < 2:
                        problems.append({'name': '世界书条目', 'cat': '触发过短', 'msg': '%s trigger 过短: %s' % (e['id'], tr)})
            if e.get('depth') not in (0, 1, 2):
                problems.append({'name': '世界书条目', 'cat': 'depth非法', 'msg': '%s depth=%s' % (e['id'], e.get('depth'))})
            for rc in (e.get('recursive') or []):
                if rc not in ids:
                    problems.append({'name': '世界书条目', 'cat': '递归悬空', 'msg': '%s recursive 指向不存在: %s' % (e['id'], rc)})

        # 核心设定词必须有 constant 条目
        for word, eid in CORE:
            found = [e for e in entries if e.get('id') == eid and e.get('constant') is True]
            if not found:
                problems.append({'name': '核心设定', 'cat': '非常驻', 'msg': '%s(%s) 必须为 constant=true' % (word, eid)})
        detail['core_words'] = len([e for e in entries if e.get('constant') is True])

    ok = len(problems) == 0
    results = [{
        'name': '世界书 %(entries)d 条 常驻=%(core_words)s' % detail,
        'ok': ok,
        'msg': ('全部通过' if ok else '问题: ' + '; '.join(p['msg'][:120] for p in problems[:5])),
    }]
    return {'name': '世界书Lorebook', 'ok': ok, 'results': results, 'details': detail}
