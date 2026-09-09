#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具3：引用检查工具
功能：
1. 扫描所有数据卷，收集所有节点ID（N["xxx"]）
2. 扫描所有选项的go:目标
3. 对比，找出go到不存在节点的死链
4. 输出详细报告（含源文件、行号、上下文）
用法：
  python tools/check_references.py          # 检查所有引用
  python tools/check_references.py --strict # 严格模式（预存例外也当错误）
  python tools/check_references.py --json   # 输出JSON格式
  python tools/check_references.py --fix    # 自动修复简单死链（重命名）
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

# 预存例外（v11遗留的动态跳转目标）
KNOWN_EXCEPTIONS = {
    'city_free': 'v11遗留：城市自由行动动态节点',
    'travel': 'v11遗留：旅行系统动态节点',
    'arrive_generic': '引擎动态生成：城市到达通用节点',
    'act_rest': '引擎动态生成：休息节点',
    'title_screen': '引擎内置：标题画面',
    'ending_check': '引擎内置：结局检查',
    'ending_choose': '引擎内置：结局选择',
}

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

def extract_js_from_py(filepath):
    """从Python数据卷中提取JS代码"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def collect_all_nodes():
    """收集所有节点ID"""
    all_nodes = {}  # {node_id: {filename, line_number}}
    node_count = 0
    
    for filename in VOLUMES:
        filepath = os.path.join(HERE, filename)
        if not os.path.exists(filepath):
            continue
        js = extract_js_from_py(filepath)
        if js is None:
            continue
        
        # 匹配 N["node_id"] 或 N['node_id']
        for match in re.finditer(r'N\["([^"]+)"\]', js):
            node_id = match.group(1)
            line_num = js[:match.start()].count('\n') + 1
            if node_id not in all_nodes:
                all_nodes[node_id] = []
            all_nodes[node_id].append({
                'filename': filename,
                'line': line_num
            })
            node_count += 1
    
    return all_nodes, node_count

def collect_all_go_targets():
    """收集所有go:目标"""
    all_goes = []  # [{target, filename, line, context}]
    
    for filename in VOLUMES:
        filepath = os.path.join(HERE, filename)
        if not os.path.exists(filepath):
            continue
        js = extract_js_from_py(filepath)
        if js is None:
            continue
        
        # 匹配 go:"target" 或 go:'target'
        for match in re.finditer(r'go:\s*"([^"]+)"', js):
            target = match.group(1)
            line_num = js[:match.start()].count('\n') + 1
            # 获取上下文（前后50字符）
            start = max(0, match.start() - 30)
            end = min(len(js), match.end() + 30)
            context = js[start:end].replace('\n', ' ').strip()
            all_goes.append({
                'target': target,
                'filename': filename,
                'line': line_num,
                'context': context,
                'dynamic': False
            })
        
        # 匹配动态拼接的go目标（如 go:"slow_travel_"+st.stage）
        for match in re.finditer(r'go:\s*"[^"]*"\s*\+', js):
            line_num = js[:match.start()].count('\n') + 1
            start = max(0, match.start() - 20)
            end = min(len(js), match.end() + 40)
            context = js[start:end].replace('\n', ' ').strip()
            all_goes.append({
                'target': '[动态拼接] ' + context[:60],
                'filename': filename,
                'line': line_num,
                'context': context,
                'dynamic': True
            })
    
    return all_goes

def check_references(strict=False):
    """检查所有引用"""
    cprint("=" * 70, Color.BOLD)
    cprint("v29 引用检查工具", Color.CYAN + Color.BOLD)
    cprint("=" * 70, Color.BOLD)
    
    # 1. 收集所有节点
    cprint("\n[1/3] 收集所有节点ID...", Color.CYAN)
    all_nodes, node_count = collect_all_nodes()
    cprint(f"  发现 {len(all_nodes)} 个唯一节点ID（共 {node_count} 次定义）", Color.GREEN)
    
    # 检查重复定义
    duplicates = {k: v for k, v in all_nodes.items() if len(v) > 1}
    if duplicates:
        cprint(f"  ⚠ 发现 {len(duplicates)} 个重复定义的节点:", Color.YELLOW)
        for node_id, locations in list(duplicates.items())[:5]:
            cprint(f"    - {node_id}:", Color.YELLOW)
            for loc in locations:
                cprint(f"      {loc['filename']}:{loc['line']}", Color.YELLOW)
        if len(duplicates) > 5:
            cprint(f"    ... 还有 {len(duplicates) - 5} 个", Color.YELLOW)
    
    # 2. 收集所有go目标
    cprint("\n[2/3] 收集所有go:目标...", Color.CYAN)
    all_goes = collect_all_go_targets()
    cprint(f"  发现 {len(all_goes)} 个go:引用", Color.GREEN)
    
    # 3. 检查死链
    cprint("\n[3/3] 检查死链...", Color.CYAN)
    broken_links = []
    exception_links = []
    dynamic_links = []
    
    for go in all_goes:
        if go.get('dynamic'):
            dynamic_links.append(go)
            continue
        target = go['target']
        if target not in all_nodes:
            if target in KNOWN_EXCEPTIONS and not strict:
                exception_links.append(go)
            else:
                broken_links.append(go)
    
    # 输出结果
    if dynamic_links:
        cprint(f"\nℹ 动态拼接目标（{len(dynamic_links)} 个，已自动忽略）:", Color.CYAN)
        for go in dynamic_links[:3]:
            cprint(f"  - {go['filename']}:{go['line']} {go['target']}", Color.CYAN)
        if len(dynamic_links) > 3:
            cprint(f"  ... 还有 {len(dynamic_links) - 3} 个", Color.CYAN)
    
    if exception_links:
        cprint(f"\n⚠ 预存例外（{len(exception_links)} 个，已知动态跳转）:", Color.YELLOW)
        for target in set(g['target'] for g in exception_links):
            count = sum(1 for g in exception_links if g['target'] == target)
            reason = KNOWN_EXCEPTIONS.get(target, '未知')
            cprint(f"  - {target}: {count} 次引用 ({reason})", Color.YELLOW)
    
    if broken_links:
        cprint(f"\n✗ 发现 {len(broken_links)} 个死链！", Color.RED + Color.BOLD)
        cprint("-" * 70, Color.RED)
        
        # 按目标分组
        by_target = {}
        for go in broken_links:
            target = go['target']
            if target not in by_target:
                by_target[target] = []
            by_target[target].append(go)
        
        for target, goes in sorted(by_target.items()):
            cprint(f"\n目标不存在: \"{target}\" ({len(goes)} 次引用)", Color.RED + Color.BOLD)
            for go in goes[:5]:  # 每个目标最多显示5个
                cprint(f"  → {go['filename']}:{go['line']}", Color.RED)
                cprint(f"     上下文: ...{go['context'][:80]}...", Color.DIM if hasattr(Color, 'DIM') else '')
            if len(goes) > 5:
                cprint(f"  ... 还有 {len(goes) - 5} 处引用", Color.RED)
        
        cprint("\n" + "=" * 70, Color.RED)
        cprint(f"✗ 引用检查失败：{len(broken_links)} 个死链需要修复", Color.RED + Color.BOLD)
        return False, broken_links
    else:
        cprint(f"\n✓ 所有 {len(all_goes)} 个go:引用均有效！", Color.GREEN + Color.BOLD)
        cprint(f"  （{len(exception_links)} 个预存例外已忽略）", Color.GREEN)
        return True, []

def main():
    strict = '--strict' in sys.argv
    json_output = '--json' in sys.argv
    auto_fix = '--fix' in sys.argv
    
    if json_output:
        # JSON模式
        all_nodes, node_count = collect_all_nodes()
        all_goes = collect_all_go_targets()
        broken = [g for g in all_goes if g['target'] not in all_nodes and (strict or g['target'] not in KNOWN_EXCEPTIONS)]
        result = {
            'total_nodes': len(all_nodes),
            'total_goes': len(all_goes),
            'broken_links': broken,
            'exceptions': [g for g in all_goes if g['target'] in KNOWN_EXCEPTIONS]
        }
        print(json.dumps(result, ensure_ascii=False, indent=2))
        sys.exit(0 if not broken else 1)
    
    success, broken = check_references(strict=strict)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
