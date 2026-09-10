#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_dead: 死代码候选检测（V59-ENG 新增）。

输出候选清单（不阻断验证链，供 docs\死代码清单_v59.md 人工确认）：
- 孤岛节点：无 go 引用、无 writeNext/curNode 硬编码引用的 N[id] 节点
- 无调用函数：window.X= / 顶层 X=function 定义但全文无调用点
- 未用 S 字段：ensureDefaults / initState 声明但全文无读写
"""
import re
from collections import Counter
from . import find_node_ids
from .jsscan import strip_equal, script_starts

_FN_DEF = re.compile(r'(?:window\.)?([A-Za-z_$][\w$]*)\s*=\s*function\b|\bfunction\s+([A-Za-z_$][\w$]*)\b')


def run(html):
    node_ids = set(find_node_ids(html).keys())
    go_counter = Counter(re.findall(r'go:\s*["\']([^"\']+)["\']', html))
    # 硬编码入口引用：writeNext("id") / curNode="id" / startNode
    entry_refs = set(re.findall(r'writeNext\s*\(\s*["\']([^"\']+)["\']', html))
    entry_refs |= set(re.findall(r'curNode\s*=\s*["\']([^"\']+)["\']', html))
    entry_refs |= set(re.findall(r'startNode\s*[:=]\s*["\']([^"\']+)["\']', html))

    # U2-A5 升级：动态机制引用（函数调用 + 前缀拼接 + 字符串级引用）
    dyn_calls = set(re.findall(r'(?:travelTo|openModal|openNode|gotoNode|setNode|v66_contFor|startTravel)\s*\(\s*["\']([^"\']+)["\']', html))
    # U2-A5 升级2：判定/推进字段引用（passNode/failNode/successNode/nextNode/entryNode）
    field_refs = set(re.findall(r'(?:passNode|failNode|successNode|failNode|nextNode|entryNode|returnNode)\s*:\s*["\']([^"\']+)["\']', html))
    # U2-A5 升级3：分片版运行时加载清单 NODE_MAP（chunks/NODE_MAP.js 中的节点 = 分片运行时入口）
    node_map_refs = set()
    try:
        import io as _io
        nmap_text = _io.open('chunks/NODE_MAP.js', encoding='utf-8', errors='replace').read()
        node_map_refs = set(re.findall(r'["\']([^"\']+)["\']\s*:', nmap_text))
    except Exception:
        pass
    # 前缀拼接动态引用："arrive_"+x / 'battle_'+id 等（travel/battle/attr 机制按前缀拼节点 id）
    pref_pat = re.compile(r'["\']((?:arrive|travel|journey|battle|combat|attr|npc|evt|quest|item|hub|entry|common|create|start|pro_|fc_|v\d+[a-z]*)_)["\']\s*\+')
    pref_joined = set()
    for m in pref_pat.finditer(html):
        p = m.group(1)
        for nid in node_ids:
            if nid.startswith(p):
                pref_joined.add(nid)

    # 字符串级引用：节点 id 作为字符串在全文出现次数 > 定义处次数 → 有非定义引用（隐藏入口/条件/存档恢复点）
    # 性能优化（G-CI1）：逐节点 html.count 为 4637×4 次全文件扫描（~158GB）；改为一次正则 Counter（O(文件)）
    _quote_ids = Counter(re.findall(r'"([A-Za-z_$][\w$]*)"', html))
    _quote_ids.update(re.findall(r"'([A-Za-z_$][\w$]*)'", html))
    _n_defs = Counter(re.findall(r'N\["([A-Za-z_$][\w$]*)"\]', html))
    _n_defs.update(re.findall(r"N\['([A-Za-z_$][\w$]*)'\]", html))
    islands = []
    for nid in sorted(node_ids):
        if go_counter.get(nid, 0) > 0 or nid in entry_refs or nid in dyn_calls or nid in pref_joined \
           or nid in field_refs or nid in node_map_refs:
            continue
        # 字符串出现次数（含双/单引号包裹）
        n_quote = _quote_ids.get(nid, 0)
        n_def = _n_defs.get(nid, 0)
        if n_quote > n_def:
            continue
        islands.append(nid)

    # 无调用函数：全库标识符一次计数（含成员/字符串，保守少报不误报）
    fn_names = []
    for m in _FN_DEF.finditer(html):
        fn_names.append(m.group(1) or m.group(2))
    fn_counter = Counter(fn_names)
    # 性能优化（G-CI1）：逐名 html.count(name) 多次全文件扫描；改为一次标识符 token 统计（定义处与调用处均为 token，判定等价且更抗词根误报）
    _fn_tokens = Counter(re.findall(r'[A-Za-z_$][\w$]*', html))
    uncalled = []
    for name, ndef in fn_counter.items():
        if ndef > 1 or len(name) < 3:
            continue
        # token 计数：定义处 1 + 任何调用处 >1 → 有调用（原子串计数会把 run 计入 running，此处更保守少误报）
        n_total = _fn_tokens.get(name, 0)
        if n_total <= ndef:
            uncalled.append((name, n_total))

    # 未用 S 字段：ensureDefaults 块键 / S 初始键 → 全文 S.name 出现数
    s_fields = set(re.findall(r'\b(?:S|e\.)\s*\.\s*ensureDefaults\s*=\s*\{([^}]*)\}', html))
    s_keys = set()
    for block in s_fields:
        s_keys |= set(re.findall(r'([A-Za-z_$][\w$]*)\s*:', block))
    # 兜底：找 v5x_ensureDefaults 函数体里的键
    if not s_keys:
        for m in re.finditer(r'ensureDefaults\s*=\s*\{', html):
            j = html.find('}', m.end())
            if j != -1:
                s_keys |= set(re.findall(r'([A-Za-z_$][\w$]*)\s*:', html[m.end():j]))
    # 性能优化（G-CI1）：逐键 count('S.'+k) 多次全文件扫描；改为一次 \bS\. 引用统计
    _s_refs = Counter(re.findall(r'\bS\.([A-Za-z_$][\w$]*)', html))
    unused_s = []
    for k in sorted(s_keys):
        if k in ('id', 'type', 'version', 'saveVersion'):
            continue
        n_use = _s_refs.get(k, 0)
        if n_use == 0:
            unused_s.append(k)

    results = [
        {'name': '孤岛节点=%d（无 go/入口引用）' % len(islands), 'ok': True,
         'msg': '；'.join(islands[:20]) or '无'},
        {'name': '无调用函数=%d（候选）' % len(uncalled), 'ok': True,
         'msg': '；'.join('%s(%d)' % (n, t) for n, t in uncalled[:20]) or '无'},
        {'name': '未用 S 字段=%d（候选）' % len(unused_s), 'ok': True,
         'msg': '；'.join(unused_s[:20]) or '无'},
    ]
    return {'name': '死代码检测', 'ok': True, 'results': results,
            'details': {'islands': islands, 'uncalled': uncalled, 'unused_s': unused_s}}
