#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具4：节点ID索引生成器
功能：
1. 扫描所有数据卷，收集所有节点ID
2. 按节点ID前缀分类（prologue_*/academy_*/seal_*/eclipse_*等）
3. 生成索引文件 docs/NODE_INDEX.md
4. 每个分类下列出所有节点ID，带简短描述（从place字段提取）
5. 支持搜索：python tools/generate_index.py --search "academy"
6. 支持按文件分类：--by-file
用法：
  python tools/generate_index.py              # 生成索引文件
  python tools/generate_index.py --search "seal"  # 搜索节点
  python tools/generate_index.py --by-file    # 按文件分类显示
  python tools/generate_index.py --stats      # 只显示统计信息
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

# 所有数据卷列表
VOLUMES = [
    'story_elda_b.py', 'story_elda_c.py', 'story_elda_d.py', 'story_elda_e.py',
    'story_elda_f.py', 'story_elda_g.py', 'story_elda_h.py', 'story_elda_i.py',
    'story_elda_j.py', 'story_elda_k.py', 'story_elda_l.py', 'story_elda_m.py',
    'story_elda_n.py', 'story_elda_o.py', 'story_elda_p.py', 'story_elda_q.py',
    'story_elda_r.py', 'story_elda_s.py', 'story_elda_t.py', 'story_elda_u.py',
    'story_elda_v.py', 'story_elda_w.py', 'story_elda_y.py', 'story_elda_x.py',
    'story_elda_y2.py', 'story_elda_z.py',
    'story_elda_aa.py', 'story_elda_ab.py', 'story_elda_ac.py', 'story_elda_ad.py',
    'story_elda_ae.py', 'story_elda_af.py', 'story_elda_ag.py', 'story_elda_ah.py',
    'story_elda_ai.py', 'story_elda_aj.py', 'story_elda_ak.py', 'story_elda_al.py',
    'story_elda_am.py', 'story_elda_an.py', 'story_elda_ao.py', 'story_elda_ap.py',
    'story_elda_aq.py', 'story_elda_ar.py', 'story_elda_as.py', 'story_elda_at.py',
    'story_elda_au.py', 'story_elda_av.py', 'story_elda_aw.py', 'story_elda_ax.py',
    'story_elda_ay.py', 'story_elda_az.py',
    'story_elda_ba.py', 'story_elda_bb.py', 'story_elda_bc.py', 'story_elda_bd.py',
    'story_elda_be.py', 'story_elda_bf.py', 'story_elda_bg.py', 'story_elda_bh.py',
    'story_elda_bi.py', 'story_elda_bj.py', 'story_elda_bk.py',
]

# 节点分类规则（按前缀）
CATEGORIES = [
    ('prologue_', '序章'),
    ('origin_', '出身序章'),
    ('academy_', '学院章'),
    ('classmate_', '同学'),
    ('seal', '七印'),
    ('seal1_', '第一印（饥饿）'),
    ('seal2_', '第二印（愤怒）'),
    ('seal3_', '第三印（傲慢）'),
    ('seal4_', '第四印（贪婪）'),
    ('seal5_', '第五印（嫉妒）'),
    ('seal6_', '第六印（懒惰）'),
    ('seal7_', '第七印（色欲）'),
    ('eclipse_', '暗蚀会'),
    ('watcher_', '守望者'),
    ('church_', '光明教会'),
    ('city_', '城市'),
    ('fc_', '交汇城'),
    ('faction_', '势力'),
    ('race_', '种族'),
    ('abyss_', '深渊'),
    ('ending_', '结局'),
    ('past_', '时光回溯'),
    ('primordial_', '原初之物'),
    ('language_', '语言系统'),
    ('prophecy_', '预言系统'),
    ('council_', '大陆议会'),
    ('relation_', '关系系统'),
    ('knowledge_', '知识代价'),
    ('disaster_', '天灾系统'),
    ('succession_', '传承系统'),
    ('time_', '时间系统'),
    ('world_', '世界系统'),
    ('event_', '随机事件'),
    ('ripple_', '涟漪效应'),
    ('npc_', 'NPC'),
    ('travel_', '旅行'),
    ('combat_', '战斗'),
    ('shop_', '商店'),
    ('quest_', '任务'),
    ('item_', '物品'),
    ('relic_', '神器'),
    ('extinct_', '灭族'),
    ('slow_travel_', '慢旅行'),
    ('chapter_', '章节'),
    ('title_', '标题'),
    ('skip', '跳过'),
]

def extract_js_from_py(filepath):
    """从Python数据卷中提取JS代码"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def collect_all_nodes():
    """收集所有节点信息"""
    all_nodes = []  # [{id, filename, line, place, options_count}]
    
    for filename in VOLUMES:
        filepath = os.path.join(HERE, filename)
        if not os.path.exists(filepath):
            continue
        js = extract_js_from_py(filepath)
        if js is None:
            continue
        
        # 匹配每个节点 N["id"] = function(){ return { place:"...", ... } };
        # 用更简单的方式：匹配 N["id"] 然后提取后面的place
        for match in re.finditer(r'N\["([^"]+)"\]\s*=\s*function', js):
            node_id = match.group(1)
            line_num = js[:match.start()].count('\n') + 1
            
            # 提取place（在节点定义后的200字符内）
            after = js[match.start():match.start()+500]
            place_match = re.search(r'place:\s*"([^"]*)"', after)
            place = place_match.group(1) if place_match else ''
            
            # 统计选项数
            options_count = len(re.findall(r'\{t:\s*"', after))
            
            all_nodes.append({
                'id': node_id,
                'filename': filename,
                'line': line_num,
                'place': place,
                'options': options_count
            })
    
    return all_nodes

def categorize_node(node_id):
    """根据节点ID判断分类"""
    for prefix, category in CATEGORIES:
        if node_id.startswith(prefix):
            return category
    return '其他'

def generate_index(nodes, output_path=None):
    """生成索引文件"""
    # 按分类组织
    by_category = {}
    for node in nodes:
        cat = categorize_node(node['id'])
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(node)
    
    # 按文件组织
    by_file = {}
    for node in nodes:
        if node['filename'] not in by_file:
            by_file[node['filename']] = []
        by_file[node['filename']].append(node)
    
    # 生成Markdown
    lines = []
    lines.append('# 艾尔达大陆：群雄割据 - 节点索引')
    lines.append('')
    lines.append(f'> 自动生成，共 {len(nodes)} 个节点，{len(by_category)} 个分类，{len(by_file)} 个数据卷')
    lines.append('')
    
    # 统计信息
    lines.append('## 统计信息')
    lines.append('')
    lines.append('| 分类 | 节点数 |')
    lines.append('|------|--------|')
    for cat in sorted(by_category.keys(), key=lambda x: -len(by_category[x])):
        lines.append(f'| {cat} | {len(by_category[cat])} |')
    lines.append('')
    
    # 按分类的节点列表
    lines.append('## 按分类索引')
    lines.append('')
    for cat in sorted(by_category.keys()):
        cat_nodes = sorted(by_category[cat], key=lambda x: x['id'])
        lines.append(f'### {cat}（{len(cat_nodes)}个）')
        lines.append('')
        lines.append('| 节点ID | 地点 | 选项数 | 源文件 |')
        lines.append('|--------|------|--------|--------|')
        for node in cat_nodes:
            place_short = node['place'][:20] + '...' if len(node['place']) > 20 else node['place']
            lines.append(f'| `{node["id"]}` | {place_short} | {node["options"]} | {node["filename"]}:{node["line"]} |')
        lines.append('')
    
    # 按文件的节点列表
    lines.append('## 按文件索引')
    lines.append('')
    for filename in sorted(by_file.keys()):
        file_nodes = sorted(by_file[filename], key=lambda x: x['line'])
        lines.append(f'### {filename}（{len(file_nodes)}个）')
        lines.append('')
        lines.append('| 行号 | 节点ID | 地点 |')
        lines.append('|------|--------|------|')
        for node in file_nodes:
            place_short = node['place'][:25] + '...' if len(node['place']) > 25 else node['place']
            lines.append(f'| {node["line"]} | `{node["id"]}` | {place_short} |')
        lines.append('')
    
    content = '\n'.join(lines)
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        cprint(f"✓ 索引已生成: {output_path}", Color.GREEN)
        cprint(f"  共 {len(nodes)} 个节点，{len(by_category)} 个分类", Color.GREEN)
    
    return content, by_category, by_file

def search_nodes(nodes, keyword):
    """搜索节点"""
    keyword_lower = keyword.lower()
    results = [n for n in nodes if keyword_lower in n['id'].lower() or keyword_lower in n['place'].lower()]
    return results

def main():
    search_keyword = None
    by_file_mode = False
    stats_only = False
    no_output = False
    
    for arg in sys.argv[1:]:
        if arg == '--search' and len(sys.argv) > sys.argv.index(arg) + 1:
            search_keyword = sys.argv[sys.argv.index(arg) + 1]
        elif arg == '--by-file':
            by_file_mode = True
        elif arg == '--stats':
            stats_only = True
        elif arg == '--no-output':
            no_output = True
    
    cprint("=" * 60, Color.BOLD)
    cprint("v29 节点ID索引生成器", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    # 收集节点
    cprint("\n[1/2] 收集所有节点...", Color.CYAN)
    nodes = collect_all_nodes()
    cprint(f"  发现 {len(nodes)} 个节点", Color.GREEN)
    
    if search_keyword:
        # 搜索模式
        cprint(f"\n[2/2] 搜索关键词: \"{search_keyword}\"", Color.CYAN)
        results = search_nodes(nodes, search_keyword)
        cprint(f"  找到 {len(results)} 个匹配节点:", Color.GREEN)
        cprint("-" * 70, Color.CYAN)
        for node in results[:50]:
            cprint(f"  {node['filename']}:{node['line']:4d}  {node['id']:<40} {node['place'][:30]}", Color.WHITE if hasattr(Color, 'WHITE') else '')
        if len(results) > 50:
            cprint(f"  ... 还有 {len(results) - 50} 个结果", Color.YELLOW)
        return
    
    if stats_only:
        # 只显示统计
        _, by_category, by_file = generate_index(nodes)
        cprint("\n[2/2] 统计信息", Color.CYAN)
        cprint(f"\n按分类（前15）:", Color.BOLD)
        for cat in sorted(by_category.keys(), key=lambda x: -len(by_category[x]))[:15]:
            cprint(f"  {cat:<20} {len(by_category[cat]):4d} 个", Color.WHITE if hasattr(Color, 'WHITE') else '')
        cprint(f"\n按文件（前15）:", Color.BOLD)
        for f in sorted(by_file.keys(), key=lambda x: -len(by_file[x]))[:15]:
            cprint(f"  {f:<30} {len(by_file[f]):4d} 个", Color.WHITE if hasattr(Color, 'WHITE') else '')
        return
    
    # 生成索引文件
    output_path = os.path.join(HERE, 'docs', 'NODE_INDEX.md')
    if not no_output:
        cprint("\n[2/2] 生成索引文件...", Color.CYAN)
        generate_index(nodes, output_path)
    else:
        generate_index(nodes)
        cprint("\n[2/2] 索引已生成（未写入文件）", Color.CYAN)

if __name__ == '__main__':
    main()
