#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具8：自动化节点遍历测试（简化版）
功能：
1. 从game.html提取所有节点ID
2. 静态分析：检查每个节点的基本结构（place/text/options）
3. 检查所有go:目标是否存在（引用检查）
4. 检查选项格式是否正确（t/go/effect）
5. 检查tier选项格式
6. 生成测试报告
7. 支持快速模式：--quick（只检查结构，不深入）
8. 支持详细模式：--verbose（显示每个节点的检查结果）
用法：
  python tools/traverse_test.py              # 完整测试
  python tools/traverse_test.py --quick      # 快速测试
  python tools/traverse_test.py --verbose    # 详细输出
  python tools/traverse_test.py --node "seal1_intro"  # 测试单个节点
"""
import json, os, re, sys, time

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

def extract_script_blocks(html_path):
    """从HTML提取所有script块"""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    return scripts

def collect_all_nodes(js_code):
    """收集所有节点ID及其位置"""
    nodes = {}
    for match in re.finditer(r'N\["([^"]+)"\]\s*=\s*function', js_code):
        node_id = match.group(1)
        if node_id not in nodes:
            nodes[node_id] = []
        nodes[node_id].append(match.start())
    return nodes

def collect_all_go_targets(js_code):
    """收集所有go:目标"""
    goes = []
    for match in re.finditer(r'go:\s*"([^"]+)"', js_code):
        goes.append(match.group(1))
    return goes

def check_node_structure(js_code, node_id, node_pos):
    """检查单个节点的结构"""
    issues = []
    
    # 提取节点代码（到下一个N[或文件末尾）
    next_node = js_code.find('N["', node_pos + 10)
    if next_node == -1:
        node_code = js_code[node_pos:]
    else:
        node_code = js_code[node_pos:next_node]
    
    # 检查place
    if not re.search(r'place:\s*"', node_code):
        issues.append(('warning', '缺少place字段'))
    
    # 检查text
    if not re.search(r'text:\s*(function|"|\')', node_code):
        issues.append(('error', '缺少text字段'))
    
    # 检查options
    if not re.search(r'options:\s*\[', node_code):
        issues.append(('error', '缺少options字段'))
    else:
        # 检查选项格式
        opt_count = len(re.findall(r'\{t:\s*"', node_code))
        if opt_count == 0:
            issues.append(('warning', 'options为空'))
        
        # 检查每个选项是否有go
        opts = re.findall(r'\{t:\s*"[^"]*"(.*?)\}(?=\s*,|\s*\])', node_code, re.DOTALL)
        for i, opt in enumerate(opts):
            if not re.search(r'go:\s*"', opt):
                issues.append(('warning', f'选项{i+1}缺少go字段'))
            
            # 检查tier格式
            if 'tier:' in opt:
                if not re.search(r'tier:\s*\{', opt):
                    issues.append(('error', f'选项{i+1}tier格式错误'))
    
    # 检查括号匹配（简单检查）
    open_braces = node_code.count('{')
    close_braces = node_code.count('}')
    if abs(open_braces - close_braces) > 2:
        issues.append(('error', f'括号不匹配（{{:{open_braces}, }}:{close_braces}）'))
    
    return issues

def run_full_test(quick=False, verbose=False, single_node=None):
    """运行完整测试"""
    cprint("=" * 70, Color.BOLD)
    cprint("v29 自动化节点遍历测试", Color.CYAN + Color.BOLD)
    cprint("=" * 70, Color.BOLD)
    
    html_path = os.path.join(HERE, 'game.html')
    if not os.path.exists(html_path):
        cprint(f"\n✗ game.html 不存在，请先构建", Color.RED)
        return False
    
    file_size = os.path.getsize(html_path)
    cprint(f"\n[1/5] 加载 game.html ({file_size:,} 字节)...", Color.CYAN)
    
    scripts = extract_script_blocks(html_path)
    cprint(f"  发现 {len(scripts)} 个script块", Color.GREEN)
    
    # 合并所有script块（主要是第2个，节点块）
    all_js = '\n'.join(scripts)
    
    cprint(f"\n[2/5] 收集节点...", Color.CYAN)
    nodes = collect_all_nodes(all_js)
    cprint(f"  发现 {len(nodes)} 个唯一节点ID", Color.GREEN)
    
    # 检查重复定义
    duplicates = {k: v for k, v in nodes.items() if len(v) > 1}
    if duplicates:
        cprint(f"  ⚠ 发现 {len(duplicates)} 个重复定义的节点", Color.YELLOW)
        if verbose:
            for node_id, positions in list(duplicates.items())[:5]:
                cprint(f"    - {node_id}: {len(positions)}次定义", Color.YELLOW)
    
    cprint(f"\n[3/5] 收集go:引用...", Color.CYAN)
    goes = collect_all_go_targets(all_js)
    cprint(f"  发现 {len(goes)} 个go:引用", Color.GREEN)
    
    cprint(f"\n[4/5] 检查死链...", Color.CYAN)
    node_ids = set(nodes.keys())
    # 预存例外
    exceptions = {'city_free', 'travel', 'arrive_generic', 'act_rest', 
                  'title_screen', 'ending_check', 'ending_choose'}
    broken = [g for g in goes if g not in node_ids and g not in exceptions]
    broken_unique = list(set(broken))
    
    if broken_unique:
        cprint(f"  ✗ 发现 {len(broken_unique)} 个唯一死链（共{len(broken)}次引用）", Color.RED)
        if verbose:
            for target in broken_unique[:10]:
                count = broken.count(target)
                cprint(f"    - {target}: {count}次引用", Color.RED)
            if len(broken_unique) > 10:
                cprint(f"    ... 还有 {len(broken_unique) - 10} 个", Color.YELLOW)
    else:
        cprint(f"  ✓ 无死链！", Color.GREEN)
    
    cprint(f"\n[5/5] 检查节点结构...", Color.CYAN)
    
    if single_node:
        # 只测试单个节点
        if single_node not in nodes:
            cprint(f"  ✗ 节点 {single_node} 不存在", Color.RED)
            return False
        
        cprint(f"  测试节点: {single_node}", Color.CYAN)
        issues = check_node_structure(all_js, single_node, nodes[single_node][0])
        if issues:
            for level, msg in issues:
                color = Color.RED if level == 'error' else Color.YELLOW
                cprint(f"    [{level}] {msg}", color)
        else:
            cprint(f"  ✓ 节点结构正常", Color.GREEN)
        return len([i for i in issues if i[0] == 'error']) == 0
    
    if quick:
        # 快速模式：只统计
        cprint(f"  快速模式：跳过详细结构检查", Color.YELLOW)
        total_errors = len(broken_unique)
        total_warnings = len(duplicates)
    else:
        # 完整模式：检查每个节点
        total_errors = 0
        total_warnings = 0
        error_nodes = []
        
        for i, (node_id, positions) in enumerate(nodes.items()):
            if verbose and i % 100 == 0:
                cprint(f"  检查进度: {i}/{len(nodes)}...", Color.CYAN)
            
            issues = check_node_structure(all_js, node_id, positions[0])
            errors = [i for i in issues if i[0] == 'error']
            warnings = [i for i in issues if i[0] == 'warning']
            
            total_errors += len(errors)
            total_warnings += len(warnings)
            
            if errors and len(error_nodes) < 10:
                error_nodes.append((node_id, errors))
        
        if error_nodes:
            cprint(f"\n  有错误的节点（前10个）:", Color.RED)
            for node_id, errors in error_nodes:
                cprint(f"    - {node_id}: {errors[0][1]}", Color.RED)
    
    # 生成报告
    cprint("\n" + "=" * 70, Color.BOLD)
    cprint("测试报告", Color.BOLD)
    cprint("=" * 70, Color.BOLD)
    cprint(f"  节点总数: {len(nodes)}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"  go:引用数: {len(goes)}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"  重复定义: {len(duplicates)}", Color.YELLOW if duplicates else Color.GREEN)
    cprint(f"  死链数: {len(broken_unique)}", Color.RED if broken_unique else Color.GREEN)
    cprint(f"  结构错误: {total_errors}", Color.RED if total_errors else Color.GREEN)
    cprint(f"  结构警告: {total_warnings}", Color.YELLOW if total_warnings else Color.GREEN)
    
    # 保存报告
    report = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'total_nodes': len(nodes),
        'total_goes': len(goes),
        'duplicates': len(duplicates),
        'broken_links': len(broken_unique),
        'structure_errors': total_errors,
        'structure_warnings': total_warnings,
        'passed': total_errors == 0 and len(broken_unique) == 0
    }
    report_path = os.path.join(HERE, 'docs', 'TEST_REPORT_v29.json')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    cprint(f"\n  报告已保存: {report_path}", Color.CYAN)
    
    if report['passed']:
        cprint("\n✓ 全部测试通过！", Color.GREEN + Color.BOLD)
        return True
    else:
        cprint("\n✗ 测试未通过，请修复上述问题", Color.RED + Color.BOLD)
        return False

def main():
    quick = '--quick' in sys.argv
    verbose = '--verbose' in sys.argv
    single_node = None
    
    if '--node' in sys.argv:
        idx = sys.argv.index('--node')
        if idx + 1 < len(sys.argv):
            single_node = sys.argv[idx + 1]
    
    success = run_full_test(quick=quick, verbose=verbose, single_node=single_node)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
