#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具6：JS→YAML反向转换器
功能：
1. 读取现有数据卷（story_elda_*.py），提取NODES_XX中的JS代码
2. 解析每个N["id"]=function(){return{...}}节点
3. 提取place/text/options等字段
4. 转换成YAML格式
5. 简单text（只有arr.push）转换成纯文本
6. 复杂text（有条件判断/循环）保留为text_func
7. 选项的effect/tier正确解析
8. 输出YAML文件
9. 支持批量转换：python tools/js_to_yaml.py story_elda_be.py -o output.yaml
10. 支持全量转换：--all（把所有数据卷转成YAML）
用法：
  python tools/js_to_yaml.py story_elda_be.py -o story/academy/elda.yaml
  python tools/js_to_yaml.py --all --output-dir src/story/
  python tools/js_to_yaml.py story_elda_be.py --check  # 只检查解析，不输出
"""
import json, os, re, sys, time

try:
    import yaml
except ImportError:
    print("错误：未安装PyYAML，请运行: python -m pip install pyyaml")
    sys.exit(1)

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

def extract_js_from_py(filepath):
    """从Python数据卷中提取JS代码"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def find_matching_brace(text, start):
    """找到与start位置的{匹配的}"""
    depth = 0
    i = start
    in_string = False
    string_char = None
    
    while i < len(text):
        c = text[i]
        if in_string:
            if c == '\\':
                i += 2
                continue
            if c == string_char:
                in_string = False
        else:
            if c in ('"', "'", '`'):
                in_string = True
                string_char = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    return -1

def parse_node(node_text, node_id):
    """解析单个节点的JS代码为字典"""
    node = {'id': node_id}
    
    # 提取place
    place_match = re.search(r'place:\s*"([^"]*)"', node_text)
    if place_match:
        node['place'] = place_match.group(1)
    
    # 提取text函数
    text_match = re.search(r'text:\s*function\s*\(\s*\)\s*\{(.*?)\n\s*\}', node_text, re.DOTALL)
    if text_match:
        text_body = text_match.group(1).strip()
        # 判断是简单text还是复杂text_func
        # 简单text：只有arr.push("...")和return arr
        push_lines = re.findall(r'arr\.push\("((?:[^"\\]|\\.)*)"\)', text_body)
        has_complex_logic = bool(re.search(r'\b(if|else|for|while|switch|var|let|const)\b', text_body))
        has_dynamic = bool(re.search(r'arr\.push\([^"]', text_body))
        
        if push_lines and not has_complex_logic and not has_dynamic:
            # 简单text：转换为纯文本
            lines = []
            for push in push_lines:
                # 反转义
                line = push.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
                lines.append(line)
            # 去掉末尾的空行
            while lines and lines[-1] == '':
                lines.pop()
            node['text'] = '\n'.join(lines)
        else:
            # 复杂text：保留为text_func
            node['text_func'] = text_body
    
    # 提取options
    options = []
    # 匹配options数组
    opts_match = re.search(r'options:\s*\[(.*?)\n\s*\]', node_text, re.DOTALL)
    if opts_match:
        opts_text = opts_match.group(1)
        # 分割每个选项（匹配{t:...}结构）
        opt_pattern = re.compile(r'\{t:\s*"([^"]*)"(.*?)\}(?=\s*,|\s*$)', re.DOTALL)
        for opt_match in opt_pattern.finditer(opts_text):
            opt = {'t': opt_match.group(1)}
            opt_rest = opt_match.group(2)
            
            # go
            go_match = re.search(r'go:\s*"([^"]*)"', opt_rest)
            if go_match:
                opt['go'] = go_match.group(1)
            
            # check
            check_match = re.search(r'check:\s*"([^"]*)"', opt_rest)
            if check_match:
                opt['check'] = check_match.group(1)
            
            # effect
            effect_match = re.search(r'eff(?:ect|ects)?:\s*\{([^}]*)\}', opt_rest)
            if effect_match:
                effect_str = effect_match.group(1)
                effect = {}
                for kv in re.finditer(r'(\w+):\s*([^,}]+)', effect_str):
                    key = kv.group(1)
                    val = kv.group(2).strip()
                    # 尝试转换为数字
                    try:
                        if '.' in val:
                            effect[key] = float(val)
                        else:
                            effect[key] = int(val)
                    except ValueError:
                        # 字符串，去掉引号
                        if val.startswith('"') and val.endswith('"'):
                            effect[key] = val[1:-1]
                        else:
                            effect[key] = val
                if effect:
                    opt['effect'] = effect
            
            # timeCost
            time_match = re.search(r'timeCost:\s*"([^"]*)"', opt_rest)
            if time_match:
                opt['timeCost'] = time_match.group(1)
            
            # tier
            tier_match = re.search(r'tier:\s*\{(.*?)\}(?=\s*,|\s*$)', opt_rest, re.DOTALL)
            if tier_match:
                tier_text = tier_match.group(1)
                tier = {}
                for tier_key in ['crit', 'ok', 'fail', 'critfail']:
                    tier_item_match = re.search(rf'{tier_key}:\s*\{{(.*?)\}}(?=\s*,|\s*$|\s*[}}])', tier_text, re.DOTALL)
                    if tier_item_match:
                        tier_item = {}
                        item_text = tier_item_match.group(1)
                        
                        # tier text
                        t_text_match = re.search(r'text:\s*"([^"]*)"', item_text)
                        if t_text_match:
                            tier_item['text'] = t_text_match.group(1)
                        
                        # tier effect
                        t_effect_match = re.search(r'eff(?:ect|ects)?:\s*\{([^}]*)\}', item_text)
                        if t_effect_match:
                            t_effect_str = t_effect_match.group(1)
                            t_effect = {}
                            for kv in re.finditer(r'(\w+):\s*([^,}]+)', t_effect_str):
                                key = kv.group(1)
                                val = kv.group(2).strip()
                                try:
                                    if '.' in val:
                                        t_effect[key] = float(val)
                                    else:
                                        t_effect[key] = int(val)
                                except ValueError:
                                    if val.startswith('"') and val.endswith('"'):
                                        t_effect[key] = val[1:-1]
                                    else:
                                        t_effect[key] = val
                            if t_effect:
                                tier_item['effect'] = t_effect
                        
                        if tier_item:
                            tier[tier_key] = tier_item
                
                if tier:
                    opt['tier'] = tier
            
            options.append(opt)
    
    if options:
        node['options'] = options
    
    return node

def parse_js_nodes(js_code):
    """解析JS代码中的所有节点"""
    nodes = []
    
    # 匹配 N["id"] = function() { return { ... } };
    # 使用更宽松的匹配，支持空格、换行、不同格式
    node_pattern = re.compile(r'N\["([^"]+)"\]\s*=\s*function\s*\(\s*\)\s*\{', re.DOTALL)
    
    for match in node_pattern.finditer(js_code):
        node_id = match.group(1)
        # 在函数体内找到 return { 的位置
        func_body_start = match.end()
        return_match = re.search(r'return\s*\{', js_code[func_body_start:func_body_start+500])
        if not return_match:
            cprint(f"  ⚠ 节点 {node_id}: 无法找到return {{，跳过", Color.YELLOW)
            continue
        return_brace_start = func_body_start + return_match.end() - 1  # { 的位置
        end_pos = find_matching_brace(js_code, return_brace_start)
        if end_pos == -1:
            cprint(f"  ⚠ 节点 {node_id}: 无法找到闭合括号，跳过", Color.YELLOW)
            continue
        
        node_text = js_code[match.start():end_pos + 1]
        try:
            node = parse_node(node_text, node_id)
            nodes.append(node)
        except Exception as e:
            cprint(f"  ⚠ 节点 {node_id}: 解析失败 - {e}", Color.YELLOW)
    
    return nodes

def convert_file(input_path, output_path=None):
    """转换单个文件"""
    cprint(f"  转换: {input_path}", Color.CYAN)
    
    js_code = extract_js_from_py(input_path)
    if js_code is None:
        cprint(f"  ✗ 无法提取JS代码", Color.RED)
        return None
    
    nodes = parse_js_nodes(js_code)
    cprint(f"  解析到 {len(nodes)} 个节点", Color.GREEN)
    
    if output_path:
        # 生成YAML
        yaml_content = yaml.dump(nodes, allow_unicode=True, default_flow_style=False, sort_keys=False)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f'# 自动转换自: {os.path.basename(input_path)}\n')
            f.write(f'# 节点数: {len(nodes)}\n')
            f.write(f'# 转换时间: {time.strftime("%Y-%m-%d %H:%M:%S")}\n')
            f.write('\n')
            f.write(yaml_content)
        cprint(f"  ✓ 输出: {output_path} ({len(yaml_content)} 字节)", Color.GREEN)
    
    return nodes

def convert_all(output_dir):
    """转换所有数据卷"""
    cprint(f"\n全量转换模式，输出目录: {output_dir}", Color.CYAN)
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 所有数据卷
    volumes = []
    for f in sorted(os.listdir(HERE)):
        if f.startswith('story_elda_') and f.endswith('.py'):
            volumes.append(f)
    
    cprint(f"发现 {len(volumes)} 个数据卷", Color.CYAN)
    
    total_nodes = 0
    for vol in volumes:
        input_path = os.path.join(HERE, vol)
        output_name = vol.replace('.py', '.yaml')
        output_path = os.path.join(output_dir, output_name)
        try:
            nodes = convert_file(input_path, output_path)
            if nodes:
                total_nodes += len(nodes)
        except Exception as e:
            cprint(f"  ✗ {vol}: 转换失败 - {e}", Color.RED)
    
    cprint(f"\n✓ 全量转换完成！共 {total_nodes} 个节点", Color.GREEN + Color.BOLD)

def main():
    if len(sys.argv) < 2:
        cprint("用法: python tools/js_to_yaml.py <input.py> [-o output.yaml] [--all] [--check]", Color.BOLD)
        cprint("  将JS节点代码转换为YAML格式", Color.CYAN)
        sys.exit(1)
    
    input_path = None
    output_path = None
    all_mode = False
    check_only = False
    output_dir = None
    
    i = 1
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == '-o' and i + 1 < len(sys.argv):
            output_path = sys.argv[i + 1]
            i += 2
        elif arg == '--all':
            all_mode = True
            i += 1
        elif arg == '--output-dir' and i + 1 < len(sys.argv):
            output_dir = sys.argv[i + 1]
            i += 2
        elif arg == '--check':
            check_only = True
            i += 1
        elif arg.startswith('-'):
            cprint(f"未知参数: {arg}", Color.RED)
            i += 1
        else:
            input_path = arg
            i += 1
    
    cprint("=" * 60, Color.BOLD)
    cprint("v29 JS→YAML反向转换器", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    if all_mode:
        out_dir = output_dir or os.path.join(HERE, 'src', 'story', 'converted')
        convert_all(out_dir)
        return
    
    if not input_path:
        cprint("错误：未指定输入文件", Color.RED)
        sys.exit(1)
    
    if not os.path.exists(input_path):
        # 尝试在项目根目录查找
        input_path = os.path.join(HERE, input_path)
    
    if not os.path.exists(input_path):
        cprint(f"错误：文件不存在 - {input_path}", Color.RED)
        sys.exit(1)
    
    if check_only:
        cprint("\n[检查模式] 验证解析...", Color.CYAN)
        js_code = extract_js_from_py(input_path)
        if js_code:
            nodes = parse_js_nodes(js_code)
            cprint(f"  ✓ 解析到 {len(nodes)} 个节点", Color.GREEN)
            # 显示前3个节点的摘要
            for node in nodes[:3]:
                cprint(f"    - {node['id']}: {node.get('place', '')[:30]} ({len(node.get('options', []))}个选项)", Color.WHITE if hasattr(Color, 'WHITE') else '')
            if len(nodes) > 3:
                cprint(f"    ... 还有 {len(nodes) - 3} 个", Color.YELLOW)
        return
    
    # 正常转换
    cprint(f"\n输入: {input_path}", Color.CYAN)
    try:
        nodes = convert_file(input_path, output_path)
        if nodes:
            cprint(f"\n✓ 转换完成！共 {len(nodes)} 个节点", Color.GREEN + Color.BOLD)
    except Exception as e:
        cprint(f"\n✗ 转换失败: {e}", Color.RED)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
