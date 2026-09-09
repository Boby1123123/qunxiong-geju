#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具10：节点关系可视化器
功能：
1. 扫描所有节点，收集go:跳转关系
2. 生成交互式HTML关系图（使用vis.js）
3. 支持按主题筛选、搜索、高亮
用法：
  python tools/visualize.py              # 生成关系图
  python tools/visualize.py --output graph.html  # 指定输出
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

# 节点主题颜色
THEME_COLORS = {
    'prologue': '#FF9F40', 'origin': '#FF9F40',
    'academy': '#4FC3F7', 'classmate': '#4FC3F7',
    'seal': '#FF6B6B', 'primordial': '#FF6B6B',
    'eclipse': '#9C27B0', 'watcher': '#9C27B0', 'church': '#9C27B0', 'faction': '#9C27B0',
    'city': '#66BB6A', 'fc': '#66BB6A',
    'race': '#FFA726', 'extinct': '#FFA726',
    'abyss': '#7B1FA2',
    'ending': '#EF5350',
    'past': '#26A69A', 'timeline': '#26A69A',
    'time': '#26A69A', 'world': '#78909C',
    'npc': '#EC407A', 'travel': '#5C6BC0',
    'combat': '#F44336', 'shop': '#8BC34A',
    'item': '#FFC107', 'relic': '#FFC107',
    'quest': '#00BCD4', 'event': '#78909C',
    'language': '#7E57C2', 'prophecy': '#AB47BC',
    'council': '#5D4037', 'relation': '#E91E63',
    'knowledge': '#3F51B5', 'disaster': '#FF5722',
    'succession': '#009688', 'ripple': '#00ACC1',
    'slow_travel': '#5C6BC0', 'chapter': '#78909C',
}

def get_theme(node_id):
    for prefix, color in THEME_COLORS.items():
        if node_id.startswith(prefix):
            return color
    return '#90A4AE'

def extract_js_from_py(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    return match.group(1) if match else None

def generate_graph(output_path, theme=None):
    cprint("=" * 60, Color.BOLD)
    cprint("v29.1 节点关系可视化器（优化版）", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    cprint("\n[1/3] 收集节点和关系...", Color.CYAN)
    
    all_nodes = set()
    all_edges = []
    node_places = {}
    
    for f in sorted(os.listdir(HERE)):
        if f.startswith('story_elda_') and f.endswith('.py'):
            js = extract_js_from_py(os.path.join(HERE, f))
            if not js:
                continue
            
            for match in re.finditer(r'N\["([^"]+)"\]', js):
                node_id = match.group(1)
                all_nodes.add(node_id)
                after = js[match.start():match.start()+300]
                place_match = re.search(r'place:\s*"([^"]*)"', after)
                if place_match:
                    node_places[node_id] = place_match.group(1)
            
            node_pattern = re.compile(r'N\["([^"]+)"\]')
            matches = list(node_pattern.finditer(js))
            for i, match in enumerate(matches):
                source = match.group(1)
                start = match.end()
                end = matches[i+1].start() if i+1 < len(matches) else len(js)
                node_code = js[start:end]
                
                for go_match in re.finditer(r'go:\s*"([^"]+)"', node_code):
                    target = go_match.group(1)
                    all_edges.append((source, target))
    
    # 主题筛选
    if theme:
        theme_prefixes = [k for k, v in THEME_COLORS.items() if theme.lower() in k.lower() or k.lower().startswith(theme.lower())]
        if theme_prefixes:
            filtered_nodes = set()
            for node_id in all_nodes:
                for prefix in theme_prefixes:
                    if node_id.startswith(prefix):
                        filtered_nodes.add(node_id)
                        break
            # 也包含与这些节点相连的节点
            for source, target in all_edges:
                if source in filtered_nodes or target in filtered_nodes:
                    filtered_nodes.add(source)
                    filtered_nodes.add(target)
            all_nodes = filtered_nodes
            cprint(f"  主题筛选: {theme} → {len(theme_prefixes)}个前缀, {len(all_nodes)}个节点", Color.YELLOW)
    
    cprint(f"  节点: {len(all_nodes)}", Color.GREEN)
    cprint(f"  关系: {len(all_edges)}", Color.GREEN)
    
    cprint("\n[2/3] 生成HTML...", Color.CYAN)
    
    # 生成节点数据
    nodes_data = []
    for node_id in sorted(all_nodes):
        nodes_data.append({
            'id': node_id,
            'label': node_id[:20] + '...' if len(node_id) > 20 else node_id,
            'title': f"{node_id}\n{node_places.get(node_id, '')}",
            'color': get_theme(node_id),
            'shape': 'dot',
            'size': 10
        })
    
    # 生成边数据
    edges_data = []
    for source, target in all_edges:
        if source in all_nodes and target in all_nodes:
            edges_data.append({'from': source, 'to': target, 'arrows': 'to'})
    
    cprint(f"  有效节点: {len(nodes_data)}", Color.GREEN)
    cprint(f"  有效边: {len(edges_data)}", Color.GREEN)
    
    # 生成HTML
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>艾尔达大陆 - 节点关系图</title>
<script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<style>
body {{ margin:0; padding:0; font-family:"Microsoft YaHei",sans-serif; background:#0a1220; color:#d7e0ea; }}
#header {{ padding:12px 20px; background:#101c30; border-bottom:1px solid #243a5a; }}
#header h1 {{ margin:0; font-size:18px; color:#e8cf9a; }}
#header .stats {{ font-size:12px; color:#8fa3b8; margin-top:4px; }}
#controls {{ padding:10px 20px; background:#0d1830; border-bottom:1px solid #243a5a; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }}
#controls input {{ padding:6px 10px; background:#152642; border:1px solid #243a5a; color:#d7e0ea; border-radius:4px; width:200px; }}
#controls button {{ padding:6px 14px; background:#1a2540; border:1px solid #3b6ea5; color:#c8d6e8; border-radius:4px; cursor:pointer; }}
#controls button:hover {{ background:#2a4a7a; }}
#network {{ width:100%; height:calc(100vh - 100px); background:#0a1220; }}
#legend {{ position:fixed; bottom:20px; right:20px; background:rgba(16,28,48,.95); border:1px solid #243a5a; border-radius:8px; padding:12px; max-height:300px; overflow-y:auto; font-size:11px; }}
#legend .item {{ display:flex; align-items:center; gap:6px; margin:3px 0; }}
#legend .dot {{ width:10px; height:10px; border-radius:50%; }}
</style>
</head>
<body>
<div id="header">
  <h1>艾尔达大陆：群雄割据 - 节点关系图</h1>
  <div class="stats">节点: {len(nodes_data)} | 关系: {len(edges_data)} | 生成时间: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
</div>
<div id="controls">
  <select id="themeFilter" onchange="filterTheme()" style="padding:6px 10px;background:#152642;border:1px solid #243a5a;color:#d7e0ea;border-radius:4px;">
    <option value="all">全部主题</option>
    <option value="seal">七印线</option>
    <option value="academy">学院线</option>
    <option value="prologue">序章</option>
    <option value="eclipse">暗蚀会</option>
    <option value="watcher">守望者</option>
    <option value="city">城市</option>
    <option value="race">种族</option>
    <option value="abyss">深渊</option>
    <option value="ending">结局</option>
    <option value="npc">NPC</option>
    <option value="travel">旅行</option>
    <option value="combat">战斗</option>
    <option value="item">物品</option>
    <option value="quest">任务</option>
  </select>
  <input type="text" id="search" placeholder="搜索节点ID..." onkeyup="searchNode()">
  <button onclick="resetView()">重置视图</button>
  <button onclick="toggleLabels()">显示/隐藏标签</button>
  <span id="selected-info" style="font-size:12px;color:#8fa3b8;"></span>
</div>
<div id="network"></div>
<div id="legend">
  <div style="font-weight:bold;margin-bottom:6px;color:#e8cf9a;">图例</div>
  {''.join(f'<div class="item"><div class="dot" style="background:{color};"></div>{name}</div>' for name, color in list(THEME_COLORS.items())[:15])}
</div>

<script>
var nodes = new vis.DataSet({json.dumps(nodes_data, ensure_ascii=False)});
var edges = new vis.DataSet({json.dumps(edges_data, ensure_ascii=False)});

var container = document.getElementById('network');
var data = {{ nodes: nodes, edges: edges }};
var options = {{
  nodes: {{ font: {{ color: '#d7e0ea', size: 10, face: 'Microsoft YaHei' }}, shadow: false, scaling: {{ min: 8, max: 20 }} }},
  edges: {{ color: {{ color: '#2a4a7a', highlight: '#c9a15a', hover: '#5a8aba' }}, smooth: false, arrows: {{ to: {{ enabled: true, scaleFactor: 0.5 }} }} }},
  physics: {{ enabled: false, stabilization: {{ iterations: 50 }} }},
  interaction: {{ hover: true, tooltipDelay: 100, hideEdgesOnDrag: true, hideNodesOnDrag: false }}
}};
var network = new vis.Network(container, data, options);

// 标签默认隐藏
var labelsVisible = false;
network.on('afterDrawing', function() {{
  if(!labelsVisible) {{
    network.setOptions({{ nodes: {{ font: {{ color: 'transparent' }} }} }});
  }}
}});

function toggleLabels() {{
  labelsVisible = !labelsVisible;
  if(labelsVisible) {{
    network.setOptions({{ nodes: {{ font: {{ color: '#d7e0ea' }} }} }});
  }} else {{
    network.setOptions({{ nodes: {{ font: {{ color: 'transparent' }} }} }});
  }}
}}

function filterTheme() {{
  var theme = document.getElementById('themeFilter').value;
  if(theme === 'all') {{
    network.setData(data);
    return;
  }}
  var filteredNodes = new vis.DataSet();
  var filteredEdges = new vis.DataSet();
  var nodeIds = [];
  nodes.forEach(function(n) {{
    if(n.id.indexOf(theme) === 0 || n.id.indexOf(theme + '_') === 0) {{
      filteredNodes.add(n);
      nodeIds.push(n.id);
    }}
  }});
  edges.forEach(function(e) {{
    if(nodeIds.indexOf(e.from) >= 0 || nodeIds.indexOf(e.to) >= 0) {{
      filteredEdges.add(e);
    }}
  }});
  network.setData({{ nodes: filteredNodes, edges: filteredEdges }});
  network.fit({{ animation: true }});
}}

network.on('click', function(params) {{
  if (params.nodes.length > 0) {{
    var nodeId = params.nodes[0];
    document.getElementById('selected-info').textContent = '已选中: ' + nodeId;
  }}
}});

function searchNode() {{
  var query = document.getElementById('search').value.toLowerCase();
  if (!query) {{ resetView(); return; }}
  var matched = nodes.get().filter(function(n) {{ return n.id.toLowerCase().indexOf(query) >= 0; }});
  if (matched.length > 0) {{
    network.selectNodes([matched[0].id]);
    network.focus(matched[0].id, {{ scale: 1.5, animation: true }});
    document.getElementById('selected-info').textContent = '找到 ' + matched.length + ' 个匹配，已定位: ' + matched[0].id;
  }} else {{
    document.getElementById('selected-info').textContent = '未找到匹配节点';
  }}
}}

function resetView() {{
  network.fit({{ animation: true }});
  document.getElementById('selected-info').textContent = '';
}}

var physicsEnabled = true;
function togglePhysics() {{
  physicsEnabled = !physicsEnabled;
  network.setOptions({{ physics: physicsEnabled }});
}}
</script>
</body>
</html>'''
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    cprint(f"\n[3/3] 完成！", Color.CYAN)
    cprint(f"  ✓ 关系图已生成: {output_path}", Color.GREEN)
    cprint(f"  文件大小: {os.path.getsize(output_path):,} 字节", Color.GREEN)
    cprint(f"\n  用浏览器打开即可查看交互式关系图", Color.CYAN)
    return True

def main():
    output = 'docs/node_graph.html'
    theme = None
    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        if idx + 1 < len(sys.argv):
            output = sys.argv[idx + 1]
    if '--theme' in sys.argv:
        idx = sys.argv.index('--theme')
        if idx + 1 < len(sys.argv):
            theme = sys.argv[idx + 1]
            cprint(f"主题筛选: {theme}", Color.YELLOW)
    
    output_path = os.path.join(HERE, output)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    generate_graph(output_path, theme)

if __name__ == '__main__':
    main()
