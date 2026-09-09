# -*- coding: utf-8 -*-
"""gen_graph.py — CT-1：从 src 权威源再生成 node_graph.html（标签化节点关系图）。

v91 前 node_graph.html 为 2026-09-06 静态导出（仅 1219 节点，无 tag）。本脚本：
1. 提取 src 全部节点（id/tag/卷/pace/字数）与边（go/then/curNode 静态引用）
2. 生成 vis.js 网络图：按标签过滤（五类下拉）、按卷着色、节点密度热区（节点尺寸按卷密度）
3. 输出 tools/content_tools/node_graph.html（可再生成，不再硬编码过时数据）

用法: python -X utf8 tools/content_tools/gen_graph.py
"""
import io, os, re, glob, json, time

PROJ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(PROJ, 'src')
OUT = os.path.join(PROJ, 'tools', 'content_tools', 'node_graph.html')

PREFIX_RULES = [
    ('main', ['pro_', 'main_', 'fc_', 'city_', 'arrive_']),
    ('branch', ['arc_', 'quest_', 'npc_', 'side_', 'h_', 'combat_']),
    ('event', ['event', 'rand_', 'daily_']),
    ('ending', ['ending', 'epilogue', 'aftermath']),
    ('easter', ['easter', 'hidden', 'secret']),
]

def classify(nid):
    for tag, prefs in PREFIX_RULES:
        for pre in prefs:
            if nid.startswith(pre) or pre in nid:
                return tag
    return None

VOL_COLORS = [
    '#7fb4d6', '#d6a88f', '#8fd6a8', '#d6c48f', '#c9a7e8', '#94d8c3',
    '#e8c49a', '#9bbbf4', '#e4b08f', '#a3d5e8', '#bde09a', '#debef8',
    '#f4b393', '#94d4d0', '#eaa7b2', '#e4d48f', '#8bc8ea', '#c8b6e8',
    '#a2ddaa', '#f8e7b1', '#d6a8a8', '#9eacea', '#e1b98f', '#8fb4d6',
    '#f4c88a', '#b8cfe8', '#d8b8d8', '#a8d8b8',
]
TAG_SHAPE = {'main': 'dot', 'branch': 'square', 'event': 'triangle', 'ending': 'diamond', 'easter': 'star'}

def _read(p):
    try:
        return io.open(p, encoding='utf-8', errors='replace').read()
    except Exception:
        return ''

def extract_nodes(text, vol):
    """提取 N["id"] = {...} 或 N["id"] = function(){ return {...} }（从 '=' 后第一个 '{' 括号匹配）
    兼容分片前缀 nodes["id"] = function"""
    pat = re.compile(r'(?:N|nodes)\["([^"]+)"\]\s*=\s*')
    out = {}
    for m in pat.finditer(text):
        nid = m.group(1)
        line_start = text.rfind('\n', 0, m.start()) + 1
        if '//' in text[line_start:m.start()]:
            continue  # 注释行误配（如 dn_demo.js 注释样例）
        i = text.find('{', m.end())
        if i < 0:
            continue
        depth = 0
        j = i
        in_str = esc = False
        while j < len(text):
            c = text[j]
            if in_str:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': in_str = False
            else:
                if c == '"': in_str = True
                elif c == '{': depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0: break
            j += 1
        body = text[i:j + 1]
        out[nid] = body
    return out

def node_meta(body, nid, vol):
    """提取 tag/pace/字数/出边"""
    tag = None
    m = re.search(r'tag\s*:\s*"([^"]+)"', body)
    if m:
        tag = m.group(1)
    if not tag:
        tag = classify(nid)
    pace = None
    m = re.search(r'pace\s*:\s*"([^"]+)"', body)
    if m:
        pace = m.group(1)
    # 字数：text 数组直接量
    chars = 0
    for tm in re.finditer(r'text\s*:\s*\[', body):
        i = tm.end() - 1
        depth = 0
        j = i
        in_str = esc = False
        while j < len(body):
            c = body[j]
            if in_str:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': in_str = False
            else:
                if c == '"': in_str = True
                elif c == '[': depth += 1
                elif c == ']':
                    depth -= 1
                    if depth == 0: break
            j += 1
        chars += len(re.sub(r'"[^"]*"|\s', '', body[i:j + 1]))
    # 出边
    outs = []
    for gm in re.finditer(r'go\s*:\s*["\']([A-Za-z0-9_]+)["\']', body):
        outs.append(gm.group(1))
    for tm in re.finditer(r'then\s*:\s*["\']([A-Za-z0-9_]+)["\']', body):
        outs.append(tm.group(1))
    return {'tag': tag, 'pace': pace, 'chars': chars, 'outs': outs}

def main():
    nodes, edges = [], []
    edge_seen = set()
    vol_stats = {}
    vol_color = {}
    files = sorted(glob.glob(os.path.join(SRC, '*.js'))) + sorted(glob.glob(os.path.join(SRC, 'data_nodes', '*.js')))
    # 分片节点（chunks/v62_*.js，nodes["x"] = function 前缀）——与 budget node_count 口径一致
    CHUNKS = os.path.join(PROJ, 'chunks')
    chunk_files = sorted(glob.glob(os.path.join(CHUNKS, 'v62_*.js'))) if os.path.isdir(CHUNKS) else []
    ci = 0
    for p in files + chunk_files:
        base = os.path.basename(p)
        if base in ('dn_causality.js', 'dn_memory_tpl.js', 'dn_chapters.js'):
            continue  # 纯数据文件，不构成可游玩节点
        vol = base[:-3]
        if p in chunk_files:
            vol = 'chunk_' + (vol[4:] if vol.startswith('v62_') else vol)
        if vol not in vol_color:
            vol_color[vol] = VOL_COLORS[len(vol_color) % len(VOL_COLORS)]
        t = _read(p)
        found = extract_nodes(t, vol)
        vol_stats[vol] = vol_stats.get(vol, 0) + len(found)
        for nid, body in found.items():
            meta = node_meta(body, nid, vol)
            size = 8
            if meta['chars'] > 800: size = 12
            elif meta['chars'] > 300: size = 10
            nodes.append({
                'id': nid, 'label': nid, 'tag': meta['tag'] or 'other',
                'vol': vol, 'pace': meta['pace'] or 'normal', 'chars': meta['chars'],
                'color': vol_color[vol], 'shape': TAG_SHAPE.get(meta['tag'], 'dot'),
                'size': size,
                'title': '%s\n卷: %s | tag: %s | pace: %s | %d 字' % (nid, vol, meta['tag'] or '-', meta['pace'] or '-', meta['chars']),
            })
            for o in meta['outs']:
                key = nid + '>' + o
                if key not in edge_seen:
                    edge_seen.add(key)
                    edges.append({'from': nid, 'to': o, 'arrows': 'to'})
        ci += 1
    # 密度热区：每卷密度分档（按节点数排序）
    vol_density = sorted(vol_stats.items(), key=lambda x: -x[1])
    dense_map = {}
    for rank, (vol, n) in enumerate(vol_density):
        if n >= 200: dense_map[vol] = '高'
        elif n >= 80: dense_map[vol] = '中'
        else: dense_map[vol] = '低'
    # 节点尺寸按卷密度微调（热区可视化）
    for nd in nodes:
        d = dense_map.get(nd['vol'], '低')
        nd['size'] = nd['size'] + ({'高': 3, '中': 1, '低': 0}[d])
    nodes_json = json.dumps(nodes, ensure_ascii=False)
    edges_json = json.dumps(edges, ensure_ascii=False)
    legend_html = ''
    for vol, color in vol_color.items():
        legend_html += '<div class="item"><span class="dot" style="background:%s"></span>%s · %d 节点 · 密度%s</div>' % (
            color, vol, vol_stats.get(vol, 0), dense_map.get(vol, '低'))
    html = u"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>艾尔达大陆：群雄割据 - 节点关系图（v91 标签化）</title>
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<style>
body { margin:0; padding:0; font-family:"Microsoft YaHei",sans-serif; background:#0a1220; color:#d7e0ea; }
#header { padding:12px 20px; background:#101c30; border-bottom:1px solid #243a5a; }
#header h1 { margin:0; font-size:18px; color:#e8cf9a; }
#header .stats { font-size:12px; color:#8fa3b8; margin-top:4px; }
#controls { padding:10px 20px; background:#0d1830; border-bottom:1px solid #243a5a; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
#controls select, #controls input { padding:6px 10px; background:#152642; border:1px solid #243a5a; color:#d7e0ea; border-radius:4px; }
#controls button { padding:6px 14px; background:#1a2540; border:1px solid #3b6ea5; color:#c8d6e8; border-radius:4px; cursor:pointer; }
#controls button:hover { background:#2a4a7a; }
#network { width:100%%; height:calc(100vh - 110px); background:#0a1220; }
#legend { position:fixed; bottom:20px; right:20px; background:rgba(16,28,48,.95); border:1px solid #243a5a; border-radius:8px; padding:12px; max-height:300px; overflow-y:auto; font-size:11px; }
#legend .item { display:flex; align-items:center; gap:6px; margin:3px 0; }
#legend .dot { width:10px; height:10px; border-radius:50%%; flex-shrink:0; }
#density { position:fixed; bottom:20px; left:20px; background:rgba(16,28,48,.95); border:1px solid #243a5a; border-radius:8px; padding:10px 14px; font-size:11px; color:#8fa3b8; }
</style>
</head>
<body>
<div id="header">
  <h1>艾尔达大陆：群雄割据 - 节点关系图（标签化）</h1>
  <div class="stats">节点: %(nn)d | 关系: %(en)d | 卷: %(vn)d | 生成时间: %(ts)s（由 tools/content_tools/gen_graph.py 从 src 权威源再生成）</div>
</div>
<div id="controls">
  <select id="tagFilter" onchange="filterTag()">
    <option value="all">全部标签</option>
    <option value="main">主线 (dot)</option>
    <option value="branch">支线/任务 (square)</option>
    <option value="event">事件 (triangle)</option>
    <option value="ending">结局 (diamond)</option>
    <option value="easter">彩蛋 (star)</option>
    <option value="other">其他</option>
  </select>
  <select id="volFilter" onchange="filterTag()">
    <option value="all">全部卷</option>
%(volopts)s
  </select>
  <input type="text" id="search" placeholder="搜索节点ID..." onkeyup="searchNode()">
  <button onclick="resetView()">重置视图</button>
  <span id="selected-info" style="font-size:12px;color:#8fa3b8;"></span>
</div>
<div id="legend">%(legend)s</div>
<div id="density">密度热区：大节点=高密度卷 · 颜色=卷 · 形状=标签</div>
<div id="network"></div>
<script>
var nodes = new vis.DataSet(%(nodes)s);
var edges = new vis.DataSet(%(edges)s);
var data = { nodes: nodes, edges: edges };
var container = document.getElementById('network');
var options = {
  nodes: { font: { color: '#d7e0ea', size: 10, face: 'Microsoft YaHei' }, shadow: true, scaling: { min: 6, max: 18 } },
  edges: { color: { color: 'rgba(100,140,190,.35)', highlight: '#e8cf9a' }, width: 0.6, arrows: { to: { enabled: true, scaleFactor: 0.4 } } },
  physics: { solver: 'forceAtlas2Based', stabilization: { iterations: 200 } },
  interaction: { hover: true, tooltipDelay: 100, hideEdgesOnDrag: true }
};
var network = new vis.Network(container, data, options);
function filterTag() {
  var tag = document.getElementById('tagFilter').value;
  var vol = document.getElementById('volFilter').value;
  var filtered = nodes.get().filter(function(n) {
    var okTag = (tag === 'all') || (n.tag === tag);
    var okVol = (vol === 'all') || (n.vol === vol);
    return okTag && okVol;
  });
  var ids = {};
  filtered.forEach(function(n) { ids[n.id] = true; });
  var fEdges = edges.get().filter(function(e) { return ids[e.from] && ids[e.to]; });
  network.setData({ nodes: new vis.DataSet(filtered), edges: new vis.DataSet(fEdges) });
  document.getElementById('selected-info').textContent = '过滤后: ' + filtered.length + ' 节点 / ' + fEdges.length + ' 关系';
}
function resetView() {
  network.setData(data);
  document.getElementById('selected-info').textContent = '已重置全量视图';
}
function searchNode() {
  var q = document.getElementById('search').value.toLowerCase();
  if (!q) return;
  var hit = nodes.get().filter(function(n) { return n.id.toLowerCase().indexOf(q) >= 0; });
  if (hit.length) {
    network.focus(hit[0].id, { scale: 1.2, animation: true });
    document.getElementById('selected-info').textContent = '找到 ' + hit.length + ' 个，已定位: ' + hit[0].id;
  } else {
    document.getElementById('selected-info').textContent = '未找到匹配节点';
  }
}
network.on('click', function(params) {
  if (params.nodes.length > 0) {
    var nid = params.nodes[0];
    var n = nodes.get(nid);
    document.getElementById('selected-info').textContent = nid + ' | 卷:' + n.vol + ' | tag:' + n.tag + ' | pace:' + n.pace + ' | ' + n.chars + '字';
  }
});
</script>
</body>
</html>
""" % {
        'nn': len(nodes), 'en': len(edges), 'vn': len(vol_color),
        'ts': time.strftime('%Y-%m-%d %H:%M:%S'),
        'nodes': nodes_json, 'edges': edges_json, 'legend': legend_html,
        'volopts': '\n'.join('    <option value="%s">%s (%d)</option>' % (v, v, vol_stats[v]) for v in vol_color),
    }
    io.open(OUT, 'w', encoding='utf-8', newline='').write(html)
    print('[OK] node_graph.html 已再生成: %s' % OUT)
    print('  节点 %d · 关系 %d · 卷 %d · 文件大小 %.1f KB' % (len(nodes), len(edges), len(vol_color), os.path.getsize(OUT) / 1024.0))
    print('  密度分档（高/中/低）：')
    for vol, n in vol_density:
        print('    %-22s %4d 节点  密度%s' % (vol, n, dense_map[vol]))

if __name__ == '__main__':
    main()
