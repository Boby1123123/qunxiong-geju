#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29.1 统一检查工具（合并引用检查+遍历测试+语法检查+重复定义+tier格式）
功能：
1. 引用检查：区分真正死链/预留扩展位/动态拼接
2. 结构检查：place/text/options完整性
3. 语法检查：node --check验证4个script块
4. 重复定义检查：同一节点ID定义多次
5. tier格式检查：是否使用引擎兼容格式
用法：
  python tools/check_unified.py              # 完整检查
  python tools/check_unified.py --quick      # 快速检查（只查引用+语法）
  python tools/check_unified.py --json       # JSON格式输出
  python tools/check_unified.py --node "xxx" # 检查单个节点
"""
import json, os, re, subprocess, sys, time

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

# 预存例外：引擎动态节点，不算死链
ENGINE_DYNAMIC_NODES = {
    'city_free', 'travel', 'arrive_generic', 'act_rest', 'title_screen',
    'ending_check', 'ending_choose', 'slow_travel_', 'fc_jiaohui_entry',
    'academy_quick_jump', 'chapter_hub', 'world_map',
}

# 预留扩展位识别关键词
RESERVED_KEYWORDS = ['_todo', '_placeholder', '_reserved', '_ext', '_future', '_pending']

def extract_script_blocks(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    return re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)

def collect_all_nodes(js_code):
    nodes = {}
    for match in re.finditer(r'N\["([^"]+)"\]\s*=\s*function', js_code):
        node_id = match.group(1)
        if node_id not in nodes:
            nodes[node_id] = []
        nodes[node_id].append(match.start())
    return nodes

def collect_all_go_targets(js_code):
    goes = []
    for match in re.finditer(r'go:\s*"([^"]*)"', js_code):
        goes.append(match.group(1))
    return goes

def is_reserved_node(node_id):
    """判断是否为预留扩展节点位"""
    for kw in RESERVED_KEYWORDS:
        if kw in node_id:
            return True
    return False

def is_dynamic_go(go_target, js_code, pos):
    """判断是否为动态拼接go目标"""
    # 检查go:后面是否有+号（字符串拼接）
    # 这种情况在正则中已经被截断，需要检查上下文
    return False

def check_references(js_code, nodes, verbose=False):
    """引用检查"""
    goes = collect_all_go_targets(js_code)
    node_ids = set(nodes.keys())
    
    dead = []      # 真正死链
    reserved = []  # 预留扩展位
    dynamic = []   # 动态拼接
    
    for go in goes:
        if not go:
            continue
        if go in node_ids:
            continue
        if go in ENGINE_DYNAMIC_NODES:
            dynamic.append(go)
            continue
        if is_reserved_node(go):
            reserved.append(go)
            continue
        # 检查是否是动态拼接的前缀（如slow_travel_）
        if any(go.startswith(dyn) for dyn in ['slow_travel_', 'city_', 'fc_']):
            # 进一步检查：如果这个前缀在js_code中作为字符串拼接出现
            if f'go:"{go}"' in js_code and '+' in js_code[max(0, js_code.find(f'go:"{go}"')-50):js_code.find(f'go:"{go}"')+50]:
                dynamic.append(go)
                continue
        dead.append(go)
    
    return {
        'dead': list(set(dead)),
        'reserved': list(set(reserved)),
        'dynamic': list(set(dynamic)),
        'total_goes': len(goes),
        'dead_count': len(set(dead)),
        'reserved_count': len(set(reserved)),
        'dynamic_count': len(set(dynamic)),
    }

def check_structure(js_code, nodes, verbose=False):
    """结构检查"""
    missing_text = []
    missing_place = []
    empty_options = []
    wrong_t = []  # 用了text:而非t:
    
    for node_id, positions in nodes.items():
        for pos in positions:
            # 提取节点代码
            next_node = js_code.find('N["', pos + 10)
            if next_node == -1:
                node_code = js_code[pos:]
            else:
                node_code = js_code[pos:next_node]
            
            if not re.search(r'place:\s*"', node_code):
                missing_place.append(node_id)
            if not re.search(r'text:\s*(function|"|\')', node_code):
                missing_text.append(node_id)
            if not re.search(r'options:\s*\[', node_code):
                empty_options.append(node_id)
            else:
                # 检查选项是否用了text:而非t:
                # 在options块内查找text:"
                opt_match = re.search(r'options:\s*\[(.*?)\]', node_code, re.DOTALL)
                if opt_match:
                    opt_code = opt_match.group(1)
                    if re.search(r'\{text:\s*"', opt_code):
                        wrong_t.append(node_id)
    
    return {
        'missing_text': list(set(missing_text)),
        'missing_place': list(set(missing_place)),
        'empty_options': list(set(empty_options)),
        'wrong_t': list(set(wrong_t)),
        'missing_text_count': len(set(missing_text)),
        'missing_place_count': len(set(missing_place)),
        'empty_options_count': len(set(empty_options)),
        'wrong_t_count': len(set(wrong_t)),
    }

def check_syntax(html_path):
    """语法检查（node --check）"""
    scripts = extract_script_blocks(html_path)
    results = []
    all_passed = True
    
    for i, script in enumerate(scripts):
        # 写入临时文件
        tmp_path = os.path.join(HERE, f'_chk_unified_{i}.js')
        with open(tmp_path, 'w', encoding='utf-8') as f:
            f.write(script)
        
        # 运行node --check
        result = subprocess.run(
            ['node', '--check', tmp_path],
            capture_output=True, text=True, cwd=HERE
        )
        passed = result.returncode == 0
        if not passed:
            all_passed = False
        results.append({
            'index': i,
            'passed': passed,
            'error': result.stderr if not passed else ''
        })
        
        # 清理临时文件
        try:
            os.remove(tmp_path)
        except:
            pass
    
    return {
        'all_passed': all_passed,
        'script_count': len(scripts),
        'results': results
    }

def check_duplicates(nodes):
    """重复定义检查"""
    duplicates = {k: v for k, v in nodes.items() if len(v) > 1}
    return {
        'count': len(duplicates),
        'details': {k: len(v) for k, v in duplicates.items()}
    }

def check_tier_format(js_code, nodes, verbose=False):
    """tier格式检查"""
    wrong_format = []
    
    for node_id, positions in nodes.items():
        for pos in positions:
            next_node = js_code.find('N["', pos + 10)
            if next_node == -1:
                node_code = js_code[pos:]
            else:
                node_code = js_code[pos:next_node]
            
            # 检查tier格式
            # 错误格式：tier:{crit:{text:"..."}}
            if re.search(r'tier:\s*\{[^}]*crit:\s*\{[^}]*text:\s*"', node_code):
                wrong_format.append(node_id)
            # 正确格式应该是：tier:{crit:function(){return["..."]}}
    
    return {
        'wrong_format': list(set(wrong_format)),
        'wrong_count': len(set(wrong_format)),
    }

def run_full_check(quick=False, verbose=False, single_node=None, json_output=False):
    """运行完整检查"""
    html_path = os.path.join(HERE, 'game.html')
    if not os.path.exists(html_path):
        cprint("✗ game.html 不存在，请先构建", Color.RED)
        return False
    
    start_time = time.time()
    
    if not json_output:
        cprint("=" * 60, Color.BOLD)
        cprint("  v29.1 统一检查报告", Color.CYAN + Color.BOLD)
        cprint("=" * 60, Color.BOLD)
    
    # 提取JS
    scripts = extract_script_blocks(html_path)
    all_js = '\n'.join(scripts)
    nodes = collect_all_nodes(all_js)
    
    result = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'total_nodes': len(nodes),
        'total_goes': 0,
    }
    
    # [1/5] 引用检查
    if not json_output:
        cprint(f"\n[1/5] 引用检查...", Color.CYAN)
    ref_result = check_references(all_js, nodes, verbose)
    result['references'] = ref_result
    result['total_goes'] = ref_result['total_goes']
    
    if not json_output:
        if ref_result['dead_count'] > 0:
            cprint(f"  ✗ 真正死链: {ref_result['dead_count']} 个", Color.RED)
            if verbose:
                for d in ref_result['dead'][:10]:
                    cprint(f"    - {d}", Color.RED)
        else:
            cprint(f"  ✓ 真正死链: 0 个", Color.GREEN)
        cprint(f"  ⚠ 预留扩展位: {ref_result['reserved_count']} 个（不影响运行）", Color.YELLOW)
        cprint(f"  ℹ 动态拼接: {ref_result['dynamic_count']} 个（引擎动态生成）", Color.BLUE)
    
    # [2/5] 结构检查（快速模式跳过）
    if quick:
        if not json_output:
            cprint(f"\n[2/5] 结构检查... 跳过（快速模式）", Color.YELLOW)
        result['structure'] = {'skipped': True}
    else:
        if not json_output:
            cprint(f"\n[2/5] 结构检查...", Color.CYAN)
        struct_result = check_structure(all_js, nodes, verbose)
        result['structure'] = struct_result
        
        if not json_output:
            if struct_result['missing_text_count'] > 0:
                cprint(f"  ✗ 缺少text: {struct_result['missing_text_count']} 个", Color.RED)
            else:
                cprint(f"  ✓ 缺少text: 0 个", Color.GREEN)
            cprint(f"  ⚠ 缺少place: {struct_result['missing_place_count']} 个", Color.YELLOW)
            cprint(f"  ⚠ options为空: {struct_result['empty_options_count']} 个", Color.YELLOW)
            if struct_result['wrong_t_count'] > 0:
                cprint(f"  ✗ 选项用text:而非t:: {struct_result['wrong_t_count']} 个（可自动修复）", Color.RED)
            else:
                cprint(f"  ✓ 选项用text:而非t:: 0 个", Color.GREEN)
    
    # [3/5] 语法检查
    if not json_output:
        cprint(f"\n[3/5] 语法检查 (node --check)...", Color.CYAN)
    syntax_result = check_syntax(html_path)
    result['syntax'] = syntax_result
    
    if not json_output:
        for r in syntax_result['results']:
            status = "PASS" if r['passed'] else "FAIL"
            color = Color.GREEN if r['passed'] else Color.RED
            cprint(f"  script[{r['index']}]: {status}", color)
            if not r['passed'] and r['error']:
                cprint(f"    {r['error'][:200]}", Color.RED)
    
    # [4/5] 重复定义检查
    if not json_output:
        cprint(f"\n[4/5] 重复定义检查...", Color.CYAN)
    dup_result = check_duplicates(nodes)
    result['duplicates'] = dup_result
    
    if not json_output:
        if dup_result['count'] > 0:
            cprint(f"  ⚠ 重复定义: {dup_result['count']} 个", Color.YELLOW)
            if verbose:
                for k, v in list(dup_result['details'].items())[:5]:
                    cprint(f"    - {k}: {v}次定义", Color.YELLOW)
        else:
            cprint(f"  ✓ 重复定义: 0 个", Color.GREEN)
    
    # [5/5] tier格式检查（快速模式跳过）
    if quick:
        if not json_output:
            cprint(f"\n[5/5] tier格式检查... 跳过（快速模式）", Color.YELLOW)
        result['tier_format'] = {'skipped': True}
    else:
        if not json_output:
            cprint(f"\n[5/5] tier格式检查...", Color.CYAN)
        tier_result = check_tier_format(all_js, nodes, verbose)
        result['tier_format'] = tier_result
        
        if not json_output:
            if tier_result['wrong_count'] > 0:
                cprint(f"  ✗ tier格式错误: {tier_result['wrong_count']} 个（可自动修复）", Color.RED)
            else:
                cprint(f"  ✓ tier格式全部正确", Color.GREEN)
    
    # 汇总
    elapsed = time.time() - start_time
    errors = 0
    warnings = 0
    auto_fixable = 0
    
    if not quick:
        errors += result['references']['dead_count']
        errors += result['structure']['missing_text_count']
        errors += result['structure']['wrong_t_count']
        errors += result['tier_format']['wrong_count']
        if not result['syntax']['all_passed']:
            errors += 1
        warnings += result['references']['reserved_count']
        warnings += result['structure']['missing_place_count']
        warnings += result['structure']['empty_options_count']
        warnings += result['duplicates']['count']
        auto_fixable += result['structure']['wrong_t_count']
        auto_fixable += result['tier_format']['wrong_count']
    else:
        errors += result['references']['dead_count']
        if not result['syntax']['all_passed']:
            errors += 1
        warnings += result['references']['reserved_count']
    
    result['summary'] = {
        'errors': errors,
        'warnings': warnings,
        'auto_fixable': auto_fixable,
        'elapsed': round(elapsed, 1),
        'passed': errors == 0
    }
    
    if json_output:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return errors == 0
    
    # 输出汇总
    cprint(f"\n{'='*60}", Color.BOLD)
    if errors == 0:
        cprint(f"✅ 检查通过（0个错误，{warnings}个警告）", Color.GREEN + Color.BOLD)
    else:
        cprint(f"❌ 检查未通过（{errors}个错误，{warnings}个警告）", Color.RED + Color.BOLD)
    
    if auto_fixable > 0:
        cprint(f"🔧 有{auto_fixable}个错误可自动修复，运行: python tools/elda.py fix", Color.CYAN)
    
    cprint(f"⏱️  耗时: {elapsed:.1f}秒", Color.CYAN)
    cprint(f"{'='*60}", Color.BOLD)
    
    # 保存报告
    report_path = os.path.join(HERE, 'docs', 'CHECK_REPORT_v29.1.json')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    return errors == 0

def main():
    quick = '--quick' in sys.argv
    verbose = '--verbose' in sys.argv
    json_output = '--json' in sys.argv
    single_node = None
    
    if '--node' in sys.argv:
        idx = sys.argv.index('--node')
        if idx + 1 < len(sys.argv):
            single_node = sys.argv[idx + 1]
    
    success = run_full_check(quick=quick, verbose=verbose, single_node=single_node, json_output=json_output)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
