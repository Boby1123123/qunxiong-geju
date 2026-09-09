#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具5：YAML→JS节点编译器
功能：
1. 读取YAML文件，解析节点列表
2. 每个节点生成标准JS格式：N["id"]=function(){return{...}};
3. 自动处理text字段：简单文本生成arr.push，复杂文本保留函数
4. 自动处理tier选项：生成正确的嵌套结构
5. 自动处理effect字段：数字不加引号，字符串加引号
6. 自动处理timeCost：放在effect外面
7. 输出JS代码，可直接写入数据卷
8. 支持批量编译：python tools/yaml_to_js.py src/story/*.yaml -o output.js
9. 支持watch模式：--watch（文件变化自动重新编译）
用法：
  python tools/yaml_to_js.py input.yaml -o output.js
  python tools/yaml_to_js.py src/story/academy/*.yaml -o story_elda_academy.js
  python tools/yaml_to_js.py input.yaml --watch
  python tools/yaml_to_js.py input.yaml --check  # 只检查YAML语法，不输出
YAML格式示例：
- id: node_id
  place: 地点名
  text: |
    第一行文本
    第二行文本
  text_func: |  # 复杂文本用函数（优先级高于text）
    const arr=[];
    if(S.flags.xxx) arr.push("条件文本");
    return arr;
  options:
    - t: 选项文本
      go: 目标节点
      effect: {gold: 10, san: -5}
      timeCost: 1period
      check: INT
      effect: {xp: 20}  # effect写在选项级别，tier里只写文本
      tier:
        crit: 大成功文本  # 简单字符串格式
        ok: 成功文本
        fail: 失败文本
        critfail: 大失败文本
      # 也可以用对象格式（text字段会被转为函数）：
      # tier:
      #   crit: {text: "大成功文本"}
      #   ok: {text: "成功文本"}
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

def js_escape(text):
    """转义JavaScript字符串中的特殊字符"""
    if text is None:
        return ''
    text = str(text)
    text = text.replace('\\', '\\\\')
    text = text.replace('"', '\\"')
    text = text.replace('\n', '\\n')
    text = text.replace('\r', '\\r')
    text = text.replace('\t', '\\t')
    return text

def format_effect(effect):
    """格式化effect对象为JS代码
    数字不加引号，字符串加引号，布尔值小写
    """
    if effect is None:
        return '{}'
    if isinstance(effect, str):
        # 已经是JS代码字符串，直接返回
        return effect
    if not isinstance(effect, dict):
        return str(effect)
    
    parts = []
    for key, value in effect.items():
        if isinstance(value, bool):
            js_val = 'true' if value else 'false'
        elif isinstance(value, (int, float)):
            js_val = str(value)
        elif isinstance(value, str):
            # 检查是否是JS表达式（以{开头或包含函数）
            if value.startswith('{') and value.endswith('}'):
                js_val = value
            elif 'function' in value or '=>' in value:
                js_val = value
            else:
                js_val = f'"{js_escape(value)}"'
        elif isinstance(value, list):
            js_val = json.dumps(value, ensure_ascii=False)
        elif isinstance(value, dict):
            js_val = format_effect(value)
        else:
            js_val = f'"{js_escape(str(value))}"'
        parts.append(f'{key}:{js_val}')
    
    return '{' + ','.join(parts) + '}'

def format_text(node):
    """格式化text字段为JS函数代码"""
    # 如果有text_func，直接使用
    if node.get('text_func'):
        func_body = node['text_func'].strip()
        # 确保有return语句
        if 'return' not in func_body:
            func_body += '\nreturn arr;'
        return f'function(){{\n{func_body}\n}}'
    
    # 如果有text，生成arr.push形式
    if node.get('text'):
        text = node['text']
        if isinstance(text, list):
            lines = text
        else:
            lines = str(text).split('\n')
        
        parts = ['function(){', 'const arr=[];']
        for line in lines:
            if line.strip() == '':
                parts.append('arr.push("");')
            else:
                parts.append(f'arr.push("{js_escape(line)}");')
        parts.append('return arr;')
        parts.append('}')
        return '\n'.join(parts)
    
    # 默认空文本
    return 'function(){const arr=[];arr.push("");return arr;}'

def format_option(opt, indent='    '):
    """格式化单个选项为JS代码"""
    parts = []
    
    # t（选项文本）- 必填
    if 't' in opt:
        parts.append(f't:"{js_escape(opt["t"])}"')
    elif 'text' in opt:
        parts.append(f't:"{js_escape(opt["text"])}"')
    
    # go（目标节点）
    if 'go' in opt:
        parts.append(f'go:"{js_escape(opt["go"])}"')
    
    # check（判定属性）
    if 'check' in opt:
        check = opt['check']
        if isinstance(check, str):
            parts.append(f'check:"{check}"')
        elif isinstance(check, dict):
            parts.append(f'check:{format_effect(check)}')
    
    # effect（效果）
    if 'effect' in opt:
        parts.append(f'effect:{format_effect(opt["effect"])}')
    
    # timeCost（时间消耗）- 放在effect外面
    if 'timeCost' in opt:
        parts.append(f'timeCost:"{opt["timeCost"]}"')
    
    # tier（分级判定）- 引擎兼容格式：crit:function(){return["文本"]}
    if 'tier' in opt:
        tier = opt['tier']
        tier_parts = []
        for tier_key in ['crit', 'ok', 'fail', 'critfail']:
            if tier_key in tier:
                tier_data = tier[tier_key]
                if isinstance(tier_data, str):
                    # 简单字符串：crit: "文本" → crit:function(){return["文本"]}
                    tier_parts.append(f'{tier_key}:function(){{return["{js_escape(tier_data)}"]}}')
                elif isinstance(tier_data, dict):
                    # 对象格式：crit: {text: "文本", effect: {...}}
                    # 引擎tier只接受文本函数，effect放在选项级别
                    if 'text' in tier_data:
                        tier_parts.append(f'{tier_key}:function(){{return["{js_escape(tier_data["text"])}"]}}')
                    elif 'text_func' in tier_data:
                        # 自定义函数
                        tier_parts.append(f'{tier_key}:{tier_data["text_func"]}')
                    if 'effect' in tier_data:
                        # 警告：tier中的effect会被忽略，应放在选项级别
                        pass
                elif isinstance(tier_data, list):
                    # 数组形式（如crit:[{t:"...",go:"..."}]）- 用于tier后出现新选项
                    arr_parts = []
                    for item in tier_data:
                        if isinstance(item, dict):
                            ip = []
                            if 't' in item:
                                ip.append(f't:"{js_escape(item["t"])}"')
                            if 'go' in item:
                                ip.append(f'go:"{js_escape(item["go"])}"')
                            if 'effect' in item:
                                ip.append(f'effect:{format_effect(item["effect"])}')
                            arr_parts.append('{' + ','.join(ip) + '}')
                    tier_parts.append(f'{tier_key}:[{",".join(arr_parts)}]')
                else:
                    tier_parts.append(f'{tier_key}:function(){{return["{js_escape(str(tier_data))}"]}}')
        parts.append(f'tier:{{{",".join(tier_parts)}}}')
    
    # 其他字段（run, skip, fail等）
    for key in ['run', 'skip', 'fail', 'label', 'disabled', 'hidden']:
        if key in opt:
            value = opt[key]
            if isinstance(value, str) and ('function' in value or '=>' in value or value.startswith('{')):
                parts.append(f'{key}:{value}')
            elif isinstance(value, bool):
                parts.append(f'{key}:{"true" if value else "false"}')
            else:
                parts.append(f'{key}:"{js_escape(str(value))}"')
    
    return '{' + ','.join(parts) + '}'

def compile_node(node):
    """编译单个节点为JS代码"""
    if 'id' not in node:
        raise ValueError("节点缺少id字段")
    
    node_id = node['id']
    lines = []
    lines.append(f'N["{js_escape(node_id)}"]=function(){{')
    lines.append('  return {')
    
    # place（地点）
    if 'place' in node:
        lines.append(f'    place:"{js_escape(node["place"])}",')
    
    # text（文本）
    text_js = format_text(node)
    lines.append(f'    text:{text_js},')
    
    # options（选项）
    if 'options' in node and node['options']:
        lines.append('    options:[')
        for i, opt in enumerate(node['options']):
            opt_js = format_option(opt, indent='      ')
            comma = ',' if i < len(node['options']) - 1 else ''
            lines.append(f'      {opt_js}{comma}')
        lines.append('    ]')
    else:
        lines.append('    options:[]')
    
    # 其他节点级字段
    for key in ['flags', 'onEnter', 'onExit', 'meta']:
        if key in node:
            lines.append(f'    ,{key}:{format_effect(node[key])}')
    
    lines.append('  };')
    lines.append('};')
    lines.append('')
    
    return '\n'.join(lines)

def compile_yaml(yaml_content, source_file=''):
    """编译YAML内容为JS代码"""
    try:
        data = yaml.safe_load(yaml_content)
    except yaml.YAMLError as e:
        raise ValueError(f"YAML解析错误: {e}")
    
    if data is None:
        return '// 空文件\n'
    
    if not isinstance(data, list):
        raise ValueError("YAML根元素必须是节点列表（数组）")
    
    lines = []
    lines.append(f'// ============================================================')
    lines.append(f'// 自动生成自: {source_file or "YAML"}')
    lines.append(f'// 节点数: {len(data)}')
    lines.append(f'// 生成时间: {time.strftime("%Y-%m-%d %H:%M:%S")}')
    lines.append(f'// ============================================================')
    lines.append('')
    
    for i, node in enumerate(data):
        try:
            node_js = compile_node(node)
            lines.append(node_js)
        except Exception as e:
            cprint(f"  ✗ 节点[{i}]编译失败: {e}", Color.RED)
            lines.append(f'// 节点[{i}]编译失败: {e}')
            lines.append('')
    
    return '\n'.join(lines)

def compile_file(input_path, output_path=None):
    """编译单个YAML文件"""
    cprint(f"  编译: {input_path}", Color.CYAN)
    
    with open(input_path, 'r', encoding='utf-8') as f:
        yaml_content = f.read()
    
    js_content = compile_yaml(yaml_content, os.path.basename(input_path))
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        cprint(f"  ✓ 输出: {output_path} ({len(js_content)} 字节)", Color.GREEN)
    
    return js_content

def compile_files(input_paths, output_path=None):
    """编译多个YAML文件到一个输出文件"""
    all_js = []
    
    for input_path in input_paths:
        if not os.path.exists(input_path):
            cprint(f"  ✗ 文件不存在: {input_path}", Color.RED)
            continue
        js = compile_file(input_path)
        all_js.append(js)
    
    combined = '\n'.join(all_js)
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(combined)
        cprint(f"\n✓ 合并输出: {output_path} ({len(combined)} 字节)", Color.GREEN)
    
    return combined

def watch_mode(input_paths, output_path):
    """watch模式：文件变化自动重新编译"""
    cprint(f"\n👁 Watch模式启动，监听 {len(input_paths)} 个文件...", Color.CYAN)
    cprint(f"输出: {output_path}", Color.CYAN)
    cprint("按 Ctrl+C 退出\n", Color.CYAN)
    
    last_mtimes = {}
    
    try:
        while True:
            changed = False
            for path in input_paths:
                if os.path.exists(path):
                    mtime = os.path.getmtime(path)
                    if path not in last_mtimes or last_mtimes[path] != mtime:
                        last_mtimes[path] = mtime
                        changed = True
            
            if changed:
                cprint(f"\n[{time.strftime('%H:%M:%S')}] 检测到文件变化，重新编译...", Color.YELLOW)
                try:
                    compile_files(input_paths, output_path)
                    cprint("✓ 编译完成", Color.GREEN)
                except Exception as e:
                    cprint(f"✗ 编译失败: {e}", Color.RED)
            
            time.sleep(1)
    except KeyboardInterrupt:
        cprint("\n\nWatch模式已退出", Color.CYAN)

def main():
    if len(sys.argv) < 2:
        cprint("用法: python tools/yaml_to_js.py <input.yaml> [-o output.js] [--watch] [--check]", Color.BOLD)
        cprint("  编译YAML节点定义为JS代码", Color.CYAN)
        sys.exit(1)
    
    input_paths = []
    output_path = None
    watch = False
    check_only = False
    
    i = 1
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg == '-o' and i + 1 < len(sys.argv):
            output_path = sys.argv[i + 1]
            i += 2
        elif arg == '--watch':
            watch = True
            i += 1
        elif arg == '--check':
            check_only = True
            i += 1
        elif arg.startswith('-'):
            cprint(f"未知参数: {arg}", Color.RED)
            i += 1
        else:
            # 支持通配符
            import glob
            matched = glob.glob(arg)
            if matched:
                input_paths.extend(matched)
            else:
                input_paths.append(arg)
            i += 1
    
    if not input_paths:
        cprint("错误：未指定输入文件", Color.RED)
        sys.exit(1)
    
    cprint("=" * 60, Color.BOLD)
    cprint("v29 YAML→JS节点编译器", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    cprint(f"\n输入文件: {len(input_paths)} 个", Color.CYAN)
    for p in input_paths:
        exists = "✓" if os.path.exists(p) else "✗"
        cprint(f"  {exists} {p}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    if check_only:
        # 只检查YAML语法
        cprint("\n[检查模式] 验证YAML语法...", Color.CYAN)
        all_ok = True
        for path in input_paths:
            if not os.path.exists(path):
                continue
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                if isinstance(data, list):
                    cprint(f"  ✓ {path}: {len(data)} 个节点", Color.GREEN)
                else:
                    cprint(f"  ✗ {path}: 根元素不是数组", Color.RED)
                    all_ok = False
            except yaml.YAMLError as e:
                cprint(f"  ✗ {path}: YAML语法错误 - {e}", Color.RED)
                all_ok = False
        sys.exit(0 if all_ok else 1)
    
    if watch:
        if not output_path:
            cprint("错误：watch模式需要指定输出文件 (-o)", Color.RED)
            sys.exit(1)
        watch_mode(input_paths, output_path)
        return
    
    # 正常编译
    cprint("\n[编译] 开始编译...", Color.CYAN)
    try:
        if len(input_paths) > 1 or output_path:
            compile_files(input_paths, output_path)
        else:
            compile_file(input_paths[0], output_path)
        cprint("\n✓ 编译完成！", Color.GREEN + Color.BOLD)
    except Exception as e:
        cprint(f"\n✗ 编译失败: {e}", Color.RED)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
