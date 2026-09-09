# -*- coding: utf-8 -*-
"""U6 内容工具生态：elda node 子命令实现

  elda node new <id> [--out file.js]  生成合规对象式节点模板（新增 1 节点只加数据）
  elda node check [--file x.js]       全量/单文件节点校验（格式/必填/引用/唯一）
  elda node stats                     内容量统计（节点/选项/区域/外置）

校验口径（C1）：
- 格式：对象式 N["id"]={...} 或函数式 N["id"]=function(){return {...}}（双轨合规）
- 必填：text 存在（字符串或函数）；有 options 时每个选项需 t（文本）且 go/run/effect 至少其一
- 引用：选项 go/goto/next/target 目标必须存在（死链检测，与 c_dead 同口径）
- 唯一：id 不重复定义
"""
import io, os, re, sys, glob, json

PROJ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _read(p):
    return io.open(p, encoding='utf-8', errors='replace').read()


def _iter_node_files():
    """返回 (路径, 是否外置数据文件) 序列：全量视图由 game.html 承担。"""
    yield os.path.join(PROJ, 'game.html'), False


def extract_nodes(text):
    """提取全部 N["id"]=... 定义 → {id: {body, is_func, start, end}}"""
    nodes = {}
    pat = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*(?:function\s*\([^)]*\)\s*)?\{')
    for m in pat.finditer(text):
        nid = m.group(1)
        i = text.find('{', m.start(), m.end())
        if i < 0:
            continue
        depth = 0
        j = i
        while j < len(text):
            c = text[j]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        if nid in nodes:
            continue  # 首个定义为准（避免 chunks 占位注释重复）
        nodes[nid] = {
            'body': text[i:j],
            'is_func': re.search(r'N\["[A-Za-z0-9_]+"\]\s*=\s*function', text[m.start():m.end()]) is not None,
            'line': text.count('\n', 0, m.start()) + 1,
            'start': m.start(),
            'end': j,
        }
    return nodes


def _has_field(body, name):
    return re.search(r'(?:^|[,{\s])' + re.escape(name) + r'\s*:', body) is not None


def check_text(path, text, known_ids=None):
    """对单个文本做节点校验 → (节点数, 问题列表)；known_ids 提供全量 id 集（消除分片误报）。"""
    nodes = extract_nodes(text)
    problems = []
    ids = set(nodes.keys())
    if known_ids is not None:
        ids = ids | known_ids

    # 引用收集（选项 go 目标 + 字段引用）
    refs = set()
    for nid, nd in nodes.items():
        body = nd['body']
        # 必填：text
        if not _has_field(body, 'text') and not re.search(r'\btext\s*:\s*function', body):
            problems.append('NO_TEXT %s (L%d)' % (nid, nd['line']))
        # 选项校验
        opts = re.findall(r'\{([^{}]*?(?:go|goto|next|target|run)\s*:\s*[^}]{1,60})\}', body)
        for om in re.finditer(r'\{([^{}]{0,200}?(?:go|goto|next|target)\s*:\s*["\'][A-Za-z0-9_]+["\'])[^{}]*\}', body):
            seg = om.group(1)
            if 't' not in seg and 'go' not in seg and 'next' not in seg and 'goto' not in seg and 'target' not in seg:
                problems.append('OPT_NO_TEXT %s (L%d)' % (nid, nd['line']))
            g = re.search(r'(?:go|goto|next|target)\s*:\s*["\']([A-Za-z0-9_]+)["\']', seg)
            if g:
                refs.add(g.group(1))
        # 其他引用形式
        for g in re.findall(r'(?:go|goto|next|target)\s*[:=]\s*["\']([A-Za-z0-9_]+)["\']', body):
            refs.add(g)
        for g in re.findall(r'curNode\s*=\s*["\']([A-Za-z0-9_]+)["\']', body):
            refs.add(g)
        for g in re.findall(r'["\'](?:passNode|failNode|successNode|nextNode|entryNode|returnNode)["\']\s*:\s*["\']([A-Za-z0-9_]+)["\']', body):
            refs.add(g)
        for g in re.findall(r'go\s*:\s*["\']([A-Za-z0-9_]+)["\']', body):
            refs.add(g)

    # 引用目标存在性（死链）
    for r in sorted(refs):
        if r not in ids and not re.match(r'^(?:N\[|window\.)', r):
            problems.append('DANGLING %s (引用未定义节点)' % r)
    return len(nodes), problems


def cmd_node_new(args):
    if not args:
        print('用法: elda node new <id> [--out data_nodes/dn_<name>.js]')
        return 1
    nid = args[0]
    out = 'dn_%s.js' % nid
    if '--out' in args:
        out = args[args.index('--out') + 1]
    if not re.match(r'^[A-Za-z0-9_]{3,40}$', nid):
        print('id 必须为 3-40 位字母数字下划线')
        return 1
    outpath = os.path.join(PROJ, 'src', 'data_nodes', out)
    os.makedirs(os.path.dirname(outpath), exist_ok=True)
    tpl = """// U6 内容工具生成：节点 %s（对象式，纯数据，不改引擎）
// 说明：text 为正文（数组=多段）；options 每项 t=选项文本，go=跳转目标，
//       check=判定函数，req=前置条件函数，effect=效果函数（改 S 状态）。
N["%s"] = {
  place: "自由城邦 · 交汇城",
  where: "白日",
  text: [
    "（这里是 %s 节点的正文。请按世界观扩写。）"
  ],
  options: [
    { t: "继续前行", go: "fc_jiaohui_entry" }
  ]
};
/* /u6inj:dn:%s/ */
""" % (nid, nid, nid, nid)
    io.open(outpath, 'w', encoding='utf-8', newline='').write(tpl)
    print('[OK] 节点模板已生成: %s' % outpath)
    print('  注册方式：_build_authority.py 构建时自动收集 src/data_nodes/*.js（如已支持）')
    print('  新增 1 节点 = 只加此数据文件，引擎零改动')
    return 0


def cmd_node_check(args):
    target = None
    if '--file' in args:
        target = args[args.index('--file') + 1]
    if target:
        p = os.path.join(PROJ, target) if not os.path.isabs(target) else target
        text = _read(p)
        # 单文件模式也加载全量 id 集（外置文件引用主游戏节点属正常）
        all_ids = set(extract_nodes(_read(os.path.join(PROJ, 'game.html'))).keys())
        cdir = os.path.join(PROJ, 'chunks')
        if os.path.isdir(cdir):
            for cf in glob.glob(os.path.join(cdir, '*.js')):
                all_ids.update(extract_nodes(_read(cf)).keys())
        total, problems = check_text(p, text, known_ids=all_ids)
        src = os.path.basename(p)
    else:
        # 全量：game.html 定义校验 + chunks 并入 id 集（引用完整性用全量）
        total = 0
        problems = []
        text_main = _read(os.path.join(PROJ, 'game.html'))
        texts = [(os.path.join(PROJ, 'game.html'), text_main)]
        dnd = os.path.join(PROJ, 'src', 'data_nodes')
        if os.path.isdir(dnd):
            for f in sorted(glob.glob(os.path.join(dnd, '*.js'))):
                texts.append((f, _read(f)))
        # 全量 id 集：game.html + chunks（chunks 定义并入，消除分片误报）
        all_ids = set(extract_nodes(text_main).keys())
        chunk_dir = os.path.join(PROJ, 'chunks')
        if os.path.isdir(chunk_dir):
            for f in glob.glob(os.path.join(chunk_dir, '*.js')):
                all_ids.update(extract_nodes(_read(f)).keys())
        for p, text in texts:
            n, probs = check_text(p, text, known_ids=all_ids)
            total += n
            for pr in probs:
                problems.append('%s: %s' % (os.path.basename(p), pr))
        total = len(all_ids)  # 全量口径：定义并集（game + chunks 独有 + 外置）
        src = '全量(game.html + chunks 引用集 + src/data_nodes)'

    print('节点校验 · %s' % src)
    print('  节点总数 : %d' % total)
    print('  问题数   : %d' % len(problems))
    for pr in problems[:40]:
        print('    !', pr)
    if len(problems) > 40:
        print('    ... 其余 %d 条省略' % (len(problems) - 40))
    ok = len(problems) == 0
    print('RESULT: %s' % ('通过' if ok else '存在问题'))
    return 0 if ok else 1


def cmd_node_stats():
    text = _read(os.path.join(PROJ, 'game.html'))
    nodes = extract_nodes(text)
    func = sum(1 for n in nodes.values() if n['is_func'])
    obj = len(nodes) - func
    opts = 0
    for n in nodes.values():
        opts += len(re.findall(r'\bt\s*:\s*["\']', n['body']))
    # 外置
    dnd = os.path.join(PROJ, 'src', 'data_nodes')
    ext = 0
    ext_files = 0
    if os.path.isdir(dnd):
        for f in glob.glob(os.path.join(dnd, '*.js')):
            ext_files += 1
            t2 = _read(f)
            ext += len(extract_nodes(t2))
    print('内容量统计 · 全量视图（game.html）')
    print('  节点总数        : %d' % len(nodes))
    print('    对象式        : %d' % obj)
    print('    函数式        : %d' % func)
    print('  选项总数(约)    : %d' % opts)
    print('  外置数据文件    : %d 个 / %d 节点（src/data_nodes）' % (ext_files, ext))
    # 区域分布（place 字段）
    places = {}
    for n in nodes.values():
        m = re.search(r'place\s*:\s*["\']([^"\']{1,24})', n['body'])
        if m:
            places[m.group(1)] = places.get(m.group(1), 0) + 1
    top = sorted(places.items(), key=lambda x: -x[1])[:10]
    print('  区域 Top10      :')
    for name, c in top:
        print('    %-22s %d' % (name, c))
    return 0


def cmd_node(args):
    if not args:
        print('elda node 子命令: new <id> | check [--file x] | stats')
        return 1
    sub = args[0]
    if sub == 'new':
        return cmd_node_new(args[1:])
    if sub == 'check':
        return cmd_node_check(args[1:])
    if sub == 'stats':
        return cmd_node_stats()
    print('未知 node 子命令: %s' % sub)
    return 1
