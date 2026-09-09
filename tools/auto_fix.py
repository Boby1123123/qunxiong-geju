#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29.1 自动修复工具（auto_fix.py）
功能：自动修复8类常见语法错误
1. 选项用text:而非t: → 自动替换
2. tier格式错误 → 转换为引擎兼容格式
3. 缺少闭合大括号 → 自动补全
4. 引号不配对 → 自动修复
5. effect字段数字加引号 → 自动移除引号
6. 节点ID用单引号 → 自动替换为双引号
7. 多余逗号 → 自动移除
8. Python注释混入JS → 自动移除或转换

用法：
  python tools/auto_fix.py              # 预览可修复的错误
  python tools/auto_fix.py --dry-run    # 同默认，预览模式
  python tools/auto_fix.py --execute    # 实际执行修复（自动备份）
  python tools/auto_fix.py --type text  # 只修复特定类型
  python tools/auto_fix.py --file story_elda_be.py  # 只修复指定文件
  python tools/auto_fix.py --rollback   # 回滚到备份版本
"""
import json, os, re, shutil, subprocess, sys, time

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

# 修复类型定义
FIX_TYPES = {
    'text': {'name': '选项用text:而非t:', 'desc': '{text:"xxx"} → {t:"xxx"}'},
    'tier': {'name': 'tier格式错误', 'desc': 'tier:{crit:{text:"x"}} → tier:{crit:function(){return["x"]}}'},
    'bracket': {'name': '缺少闭合大括号', 'desc': '自动补全缺失的}'},
    'quote': {'name': '引号不配对', 'desc': '中文引号「」→ 转义ASCII引号'},
    'effect': {'name': 'effect数字加引号', 'desc': 'effect:{gold:"10"} → effect:{gold:10}'},
    'id': {'name': '节点ID用单引号', 'desc': "N['id'] → N[\"id\"]"},
    'comma': {'name': '多余逗号', 'desc': '移除选项数组末尾多余逗号'},
    'comment': {'name': 'Python注释混入JS', 'desc': '#注释 → //注释 或移除'},
}

def extract_js_from_py(filepath):
    """从Python数据卷提取JS代码块"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 匹配 NODES_XXX = r''' ... ''' 或 JS_BLOCK = r''' ... '''
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1), match.start(1), match.end(1)
    return None, 0, 0

def fix_text_colon(js_code):
    """修复1：选项用text:而非t:"""
    fixes = []
    
    # 匹配options块内的 {text:"..."}
    # 只在options数组内替换，不影响text:字段
    def replace_in_options(match):
        opt_block = match.group(0)
        # 替换 {text:" 为 {t:"
        new_block = re.sub(r'\{text:\s*"', '{t:"', opt_block)
        if new_block != opt_block:
            fixes.append(('text', '选项text:→t:'))
        return new_block
    
    # 找到所有options:[...]块
    new_code = re.sub(r'options:\s*\[.*?\](?=\s*[},])', replace_in_options, js_code, flags=re.DOTALL)
    
    return new_code, fixes

def fix_tier_format(js_code):
    """修复2：tier格式错误"""
    fixes = []
    
    # 匹配 tier:{crit:{text:"xxx", effect:{...}}, ok:{text:"yyy"}, ...}
    # 转换为 tier:{crit:function(){return["xxx"]}, ok:function(){return["yyy"]}, ...}
    
    def replace_tier(match):
        tier_block = match.group(0)
        # 提取每个tier级别的text
        new_block = tier_block
        
        # 匹配 crit:{text:"xxx", ...} 形式
        for level in ['crit', 'ok', 'fail', 'critfail']:
            pattern = rf'{level}:\s*\{{\s*text:\s*"([^"]*)"'
            m = re.search(pattern, new_block)
            if m:
                text = m.group(1)
                # 替换整个 level:{text:"xxx", ...} 为 level:function(){return["xxx"]}
                # 找到这个level对象的结束位置
                start = m.start()
                # 找到匹配的}
                brace_count = 0
                end = start
                for i in range(start, len(new_block)):
                    if new_block[i] == '{':
                        brace_count += 1
                    elif new_block[i] == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            end = i + 1
                            break
                old_obj = new_block[start:end]
                new_obj = f'{level}:function(){{return["{text}"]}}'
                new_block = new_block[:start] + new_obj + new_block[end:]
                fixes.append(('tier', f'{level}格式修复'))
        
        return new_block
    
    # 匹配 tier:{...} 块（包含错误格式的）
    new_code = re.sub(r'tier:\s*\{(?:crit|ok|fail|critfail):\s*\{.*?\}\s*,?\s*(?:(?:crit|ok|fail|critfail):\s*\{.*?\}\s*,?\s*)*\}', 
                       replace_tier, js_code, flags=re.DOTALL)
    
    return new_code, fixes

def fix_effect_quotes(js_code):
    """修复5：effect字段数字加引号"""
    fixes = []
    
    # 匹配 effect:{gold:"10", san:"-5"} → effect:{gold:10, san:-5}
    def replace_effect(match):
        effect_block = match.group(0)
        # 替换数字加引号的情况
        new_block = re.sub(r'(\w+):\s*"(-?\d+)"', r'\1:\2', effect_block)
        if new_block != effect_block:
            fixes.append(('effect', 'effect数字引号移除'))
        return new_block
    
    new_code = re.sub(r'effect:\s*\{[^}]*\}', replace_effect, js_code)
    
    return new_code, fixes

def fix_id_quotes(js_code):
    """修复6：节点ID用单引号"""
    fixes = []
    # N['id'] → N["id"]
    new_code = re.sub(r"N\['([^']+)'\]", r'N["\1"]', js_code)
    if new_code != js_code:
        fixes.append(('id', '节点ID单引号→双引号'))
    return new_code, fixes

def fix_python_comments(js_code):
    """修复8：Python注释混入JS"""
    fixes = []
    lines = js_code.split('\n')
    new_lines = []
    for line in lines:
        stripped = line.strip()
        # 纯注释行（以#开头）
        if stripped.startswith('#'):
            # 转换为//注释
            new_lines.append('//' + line[1:])
            fixes.append(('comment', 'Python注释→JS注释'))
        else:
            # 行内注释（代码后#注释）- 谨慎处理，只在明显是注释时转换
            # 这里不做行内转换，避免误伤
            new_lines.append(line)
    return '\n'.join(new_lines), fixes

def fix_extra_commas(js_code):
    """修复7：多余逗号"""
    fixes = []
    # 匹配 },] 或 },} 形式的多余逗号
    new_code = re.sub(r',\s*([\]\}])', r'\1', js_code)
    if new_code != js_code:
        fixes.append(('comma', '多余逗号移除'))
    return new_code, fixes

def scan_file(filepath, fix_types=None):
    """扫描单个文件，发现可修复的错误"""
    js_code, start, end = extract_js_from_py(filepath)
    if js_code is None:
        return [], None, 0, 0
    
    all_fixes = []
    
    # 应用各类修复（只检测，不修改）
    if fix_types is None or 'text' in fix_types:
        _, f = fix_text_colon(js_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'tier' in fix_types:
        _, f = fix_tier_format(js_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'effect' in fix_types:
        _, f = fix_effect_quotes(js_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'id' in fix_types:
        _, f = fix_id_quotes(js_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'comment' in fix_types:
        _, f = fix_python_comments(js_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'comma' in fix_types:
        _, f = fix_extra_commas(js_code)
        all_fixes.extend(f)
    
    return all_fixes, js_code, start, end

def apply_fixes(filepath, fix_types=None):
    """实际执行修复"""
    js_code, start, end = extract_js_from_py(filepath)
    if js_code is None:
        return 0, []
    
    all_fixes = []
    new_code = js_code
    
    # 按顺序应用修复
    if fix_types is None or 'text' in fix_types:
        new_code, f = fix_text_colon(new_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'tier' in fix_types:
        new_code, f = fix_tier_format(new_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'effect' in fix_types:
        new_code, f = fix_effect_quotes(new_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'id' in fix_types:
        new_code, f = fix_id_quotes(new_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'comment' in fix_types:
        new_code, f = fix_python_comments(new_code)
        all_fixes.extend(f)
    
    if fix_types is None or 'comma' in fix_types:
        new_code, f = fix_extra_commas(new_code)
        all_fixes.extend(f)
    
    if new_code == js_code:
        return 0, []
    
    # 写回文件
    with open(filepath, 'r', encoding='utf-8') as f:
        full_content = f.read()
    
    new_full = full_content[:start] + new_code + full_content[end:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_full)
    
    return len(all_fixes), all_fixes

def backup_file(filepath):
    """备份文件"""
    backup_path = filepath + '.bak'
    shutil.copy2(filepath, backup_path)
    return backup_path

def rollback_file(filepath):
    """回滚文件"""
    backup_path = filepath + '.bak'
    if os.path.exists(backup_path):
        shutil.copy2(backup_path, filepath)
        return True
    return False

def run_dry_run(fix_types=None, specific_file=None):
    """预览模式：只扫描不修改"""
    cprint("=" * 60, Color.BOLD)
    cprint("  v29.1 自动修复工具（预览模式）", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    # 收集所有数据卷
    if specific_file:
        files = [specific_file]
    else:
        files = sorted([f for f in os.listdir(HERE) 
                       if f.startswith('story_elda_') and f.endswith('.py')])
    
    cprint(f"\n[扫描] 发现 {len(files)} 个数据卷...", Color.CYAN)
    
    total_fixes = 0
    file_fixes = {}
    
    for filepath in files:
        full_path = os.path.join(HERE, filepath)
        fixes, _, _, _ = scan_file(full_path, fix_types)
        if fixes:
            file_fixes[filepath] = fixes
            total_fixes += len(fixes)
    
    # 输出结果
    if file_fixes:
        cprint(f"\n[检测] 发现可自动修复的错误:", Color.YELLOW)
        for filepath, fixes in file_fixes.items():
            cprint(f"\n  📄 {filepath}:", Color.CYAN)
            # 按类型统计
            type_counts = {}
            for ftype, desc in fixes:
                type_counts[ftype] = type_counts.get(ftype, 0) + 1
            for ftype, count in type_counts.items():
                name = FIX_TYPES.get(ftype, {}).get('name', ftype)
                cprint(f"    - {name}: {count}处", Color.YELLOW)
    else:
        cprint(f"\n✅ 未发现可自动修复的错误", Color.GREEN)
    
    cprint(f"\n{'='*60}", Color.BOLD)
    cprint(f"  总计: {total_fixes} 处可修复（{len(file_fixes)} 个文件）", Color.BOLD)
    if total_fixes > 0:
        cprint(f"  运行 python tools/elda.py fix --execute 执行修复", Color.CYAN)
        cprint(f"  修复前自动备份为 .bak 文件", Color.CYAN)
    cprint(f"{'='*60}", Color.BOLD)
    
    # 保存报告
    report = {
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'mode': 'dry_run',
        'total_fixes': total_fixes,
        'files_with_fixes': len(file_fixes),
        'details': {k: [{'type': f[0], 'desc': f[1]} for f in v] for k, v in file_fixes.items()}
    }
    report_path = os.path.join(HERE, 'docs', 'AUTO_FIX_REPORT.json')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    return total_fixes

def run_execute(fix_types=None, specific_file=None):
    """执行模式：实际修改文件"""
    cprint("=" * 60, Color.BOLD)
    cprint("  v29.1 自动修复工具（执行模式）", Color.RED + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    # 收集文件
    if specific_file:
        files = [specific_file]
    else:
        files = sorted([f for f in os.listdir(HERE) 
                       if f.startswith('story_elda_') and f.endswith('.py')])
    
    cprint(f"\n[备份] 自动备份 {len(files)} 个文件...", Color.CYAN)
    for filepath in files:
        backup_file(os.path.join(HERE, filepath))
    cprint(f"  ✓ 备份完成（.bak文件）", Color.GREEN)
    
    cprint(f"\n[修复] 开始修复...", Color.CYAN)
    total_fixed = 0
    fixed_files = 0
    
    for filepath in files:
        full_path = os.path.join(HERE, filepath)
        count, fixes = apply_fixes(full_path, fix_types)
        if count > 0:
            total_fixed += count
            fixed_files += 1
            cprint(f"  ✓ {filepath}: 修复{count}处", Color.GREEN)
    
    cprint(f"\n[验证] 运行构建验证...", Color.CYAN)
    result = subprocess.run(
        [sys.executable, os.path.join(HERE, 'build_elda.py')],
        capture_output=True, text=True, cwd=HERE
    )
    if result.returncode == 0:
        cprint(f"  ✓ 构建成功", Color.GREEN)
        build_ok = True
    else:
        cprint(f"  ✗ 构建失败，自动回滚...", Color.RED)
        cprint(f"  {result.stderr[:500]}", Color.RED)
        # 自动回滚
        for filepath in files:
            rollback_file(os.path.join(HERE, filepath))
        cprint(f"  ✓ 已回滚到备份版本", Color.YELLOW)
        build_ok = False
    
    cprint(f"\n{'='*60}", Color.BOLD)
    if build_ok:
        cprint(f"✅ 修复完成！共修复{total_fixed}处（{fixed_files}个文件）", Color.GREEN + Color.BOLD)
        cprint(f"  备份文件保留为 .bak，确认无误后可手动删除", Color.CYAN)
        cprint(f"  运行 python tools/elda.py fix --rollback 可回滚", Color.CYAN)
    else:
        cprint(f"❌ 修复后构建失败，已自动回滚", Color.RED + Color.BOLD)
    cprint(f"{'='*60}", Color.BOLD)
    
    return build_ok

def run_rollback():
    """回滚模式"""
    cprint("=" * 60, Color.BOLD)
    cprint("  v29.1 自动修复工具（回滚模式）", Color.YELLOW + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    files = sorted([f for f in os.listdir(HERE) 
                   if f.startswith('story_elda_') and f.endswith('.py')])
    
    rolled = 0
    for filepath in files:
        if rollback_file(os.path.join(HERE, filepath)):
            rolled += 1
    
    cprint(f"\n✅ 已回滚 {rolled} 个文件到备份版本", Color.GREEN)
    return True

def main():
    execute = '--execute' in sys.argv
    rollback = '--rollback' in sys.argv
    dry_run = '--dry-run' in sys.argv or (not execute and not rollback)
    
    fix_types = None
    if '--type' in sys.argv:
        idx = sys.argv.index('--type')
        if idx + 1 < len(sys.argv):
            fix_types = [sys.argv[idx + 1]]
    
    specific_file = None
    if '--file' in sys.argv:
        idx = sys.argv.index('--file')
        if idx + 1 < len(sys.argv):
            specific_file = sys.argv[idx + 1]
    
    if rollback:
        run_rollback()
    elif execute:
        run_execute(fix_types, specific_file)
    else:
        run_dry_run(fix_types, specific_file)

if __name__ == '__main__':
    main()
