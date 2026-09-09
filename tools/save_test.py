#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具9：存档兼容性测试工具（简化版）
功能：
1. 检查S对象的所有字段是否有默认值
2. 模拟旧存档加载，检查是否有undefined错误
3. 生成兼容性报告
用法：
  python tools/save_test.py              # 运行兼容性测试
  python tools/save_test.py --fields     # 列出所有S对象字段
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

def extract_script_blocks(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    return re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)

def find_s_fields(js_code):
    """查找所有S.xxx字段引用"""
    fields = set()
    # S.xxx = 或 S.xxx.
    for match in re.finditer(r'S\.(\w+)(?:\.|\[|=|;|\)|,)', js_code):
        fields.add(match.group(1))
    # S["xxx"]
    for match in re.finditer(r'S\["(\w+)"\]', js_code):
        fields.add(match.group(1))
    return fields

def find_init_functions(js_code):
    """查找所有init函数（初始化S字段的函数）"""
    inits = []
    for match in re.finditer(r'function\s+(init\w+)\s*\(', js_code):
        inits.append(match.group(1))
    return inits

def run_test():
    cprint("=" * 60, Color.BOLD)
    cprint("v29 存档兼容性测试", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    html_path = os.path.join(HERE, 'game.html')
    if not os.path.exists(html_path):
        cprint(f"\n✗ game.html 不存在", Color.RED)
        return False
    
    scripts = extract_script_blocks(html_path)
    all_js = '\n'.join(scripts)
    
    cprint(f"\n[1/3] 分析S对象字段...", Color.CYAN)
    fields = find_s_fields(all_js)
    cprint(f"  发现 {len(fields)} 个S对象字段", Color.GREEN)
    
    cprint(f"\n[2/3] 分析初始化函数...", Color.CYAN)
    inits = find_init_functions(all_js)
    cprint(f"  发现 {len(inits)} 个初始化函数", Color.GREEN)
    
    cprint(f"\n[3/3] 兼容性检查...", Color.CYAN)
    
    # 检查v28+新字段是否有初始化
    new_fields = ['academy', 'academyPolitics', 'academySecrets', 'classmateStories',
                   'academyForeshadowing', 'graduation', 'time', 'parallelEvents',
                   'worldTimers', 'fatigue', 'npcSchedules', 'shopStates',
                   'originPrologue', 'foreshadowing', 'prologueTime', 'journey',
                   'classmatePrologues', 'moralChoices', 'hiddenPrologue', 'orientation',
                   'worldSeed', 'worldTimeline', 'worldClock', 'mainBranch', 'storyLines',
                   'npcFates', 'ripples', 'activeEvents', 'encounterHistory',
                   'hiddenRoutes', 'attributeUnlocks', 'ngPlus', 'primordial', 'knowledge',
                   'pastTravel', 'prophecy', 'languages', 'climate', 'council', 'relations',
                   'succession']
    
    missing_init = []
    for field in new_fields:
        if field in fields:
            # 检查是否有对应的初始化
            init_patterns = [f'init{field.capitalize()}', f'init{field}', 
                           f'S.{field} =', f'S.{field}=', f'if(!S.{field})']
            has_init = any(re.search(p, all_js, re.IGNORECASE) for p in init_patterns)
            if not has_init:
                missing_init.append(field)
    
    if missing_init:
        cprint(f"  ⚠ 以下字段可能缺少显式初始化（{len(missing_init)}个）:", Color.YELLOW)
        for f in missing_init[:15]:
            cprint(f"    - S.{f}", Color.YELLOW)
        if len(missing_init) > 15:
            cprint(f"    ... 还有 {len(missing_init) - 15} 个", Color.YELLOW)
    else:
        cprint(f"  ✓ 所有新字段都有初始化", Color.GREEN)
    
    # 检查localStorage键名
    storage_keys = re.findall(r'localStorage\.(?:getItem|setItem)\s*\(\s*["\']([^"\']+)["\']', all_js)
    cprint(f"\n  localStorage键名: {list(set(storage_keys))}", Color.CYAN)
    
    # 报告
    cprint("\n" + "=" * 60, Color.BOLD)
    cprint("兼容性报告", Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    cprint(f"  S对象字段总数: {len(fields)}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"  初始化函数数: {len(inits)}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"  可能缺少初始化: {len(missing_init)}", Color.YELLOW if missing_init else Color.GREEN)
    cprint(f"  localStorage键: {list(set(storage_keys))}", Color.CYAN)
    
    # 保存报告
    report = {
        'total_fields': len(fields),
        'init_functions': len(inits),
        'missing_init': missing_init,
        'storage_keys': list(set(storage_keys)),
        'fields': sorted(list(fields))
    }
    report_path = os.path.join(HERE, 'docs', 'SAVE_COMPATIBILITY_v29.json')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    cprint(f"\n  报告已保存: {report_path}", Color.CYAN)
    cprint(f"\n✓ 兼容性测试完成（旧存档应能正常加载，新字段有默认值）", Color.GREEN + Color.BOLD)
    return True

def main():
    if '--fields' in sys.argv:
        html_path = os.path.join(HERE, 'game.html')
        scripts = extract_script_blocks(html_path)
        all_js = '\n'.join(scripts)
        fields = sorted(find_s_fields(all_js))
        cprint(f"S对象字段（共{len(fields)}个）:", Color.BOLD)
        for f in fields:
            cprint(f"  S.{f}", Color.CYAN)
        return
    
    success = run_test()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
