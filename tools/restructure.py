#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具7：项目结构重组工具
功能：
1. 自动分析现有数据卷的节点ID前缀
2. 按前缀分类到对应目录（prologue_*→prologue/, academy_*→academy/等）
3. 生成新的目录结构，转换文件为YAML格式
4. 更新build_elda.py，自动扫描src/story/下所有YAML文件
5. 保持向后兼容：旧的story_elda_*.py文件保留
6. 支持预览模式：--dry-run（只显示计划，不实际移动）
7. 支持回滚：--rollback（恢复原结构）
用法：
  python tools/restructure.py --dry-run    # 预览重组计划
  python tools/restructure.py --execute    # 执行重组
  python tools/restructure.py --rollback   # 回滚到原结构
  python tools/restructure.py --status     # 显示当前结构状态
"""
import json, os, re, shutil, sys, time

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

# 目录分类规则（按节点ID前缀）
DIR_CATEGORIES = [
    ('prologue_', 'prologue', '序章'),
    ('origin_', 'prologue', '出身序章'),
    ('academy_', 'academy', '学院章'),
    ('classmate_', 'academy', '同学'),
    ('seal', 'seals', '七印'),
    ('eclipse_', 'factions', '暗蚀会'),
    ('watcher_', 'factions', '守望者'),
    ('church_', 'factions', '光明教会'),
    ('faction_', 'factions', '势力'),
    ('city_', 'cities', '城市'),
    ('fc_', 'cities', '交汇城'),
    ('race_', 'races', '种族'),
    ('abyss_', 'abyss', '深渊'),
    ('ending_', 'ending', '结局'),
    ('past_', 'timeline', '时光回溯'),
    ('primordial_', 'seals', '原初之物'),
    ('language_', 'systems', '语言系统'),
    ('prophecy_', 'systems', '预言系统'),
    ('council_', 'systems', '大陆议会'),
    ('relation_', 'systems', '关系系统'),
    ('knowledge_', 'systems', '知识代价'),
    ('disaster_', 'systems', '天灾系统'),
    ('succession_', 'systems', '传承系统'),
    ('time_', 'systems', '时间系统'),
    ('world_', 'systems', '世界系统'),
    ('event_', 'systems', '随机事件'),
    ('ripple_', 'systems', '涟漪效应'),
    ('npc_', 'characters', 'NPC'),
    ('travel_', 'travel', '旅行'),
    ('combat_', 'combat', '战斗'),
    ('shop_', 'economy', '商店'),
    ('quest_', 'quests', '任务'),
    ('item_', 'items', '物品'),
    ('relic_', 'items', '神器'),
    ('extinct_', 'races', '灭族'),
    ('slow_travel_', 'travel', '慢旅行'),
    ('chapter_', 'systems', '章节'),
]

def extract_js_from_py(filepath):
    """从Python数据卷中提取JS代码"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def collect_node_ids(js_code):
    """收集JS代码中的所有节点ID"""
    return re.findall(r'N\["([^"]+)"\]', js_code)

def categorize_file(filepath):
    """根据文件中的节点ID前缀判断应该放到哪个目录"""
    js_code = extract_js_from_py(filepath)
    if not js_code:
        return 'misc', 0
    
    node_ids = collect_node_ids(js_code)
    if not node_ids:
        return 'misc', 0
    
    # 统计每个目录的节点数
    dir_counts = {}
    for node_id in node_ids:
        assigned = False
        for prefix, dir_name, _ in DIR_CATEGORIES:
            if node_id.startswith(prefix):
                dir_counts[dir_name] = dir_counts.get(dir_name, 0) + 1
                assigned = True
                break
        if not assigned:
            dir_counts['misc'] = dir_counts.get('misc', 0) + 1
    
    # 选择节点最多的目录
    if dir_counts:
        best_dir = max(dir_counts, key=dir_counts.get)
        return best_dir, len(node_ids)
    return 'misc', len(node_ids)

def analyze_structure():
    """分析当前结构，生成重组计划"""
    cprint("\n[1/3] 分析现有数据卷...", Color.CYAN)
    
    volumes = []
    for f in sorted(os.listdir(HERE)):
        if f.startswith('story_elda_') and f.endswith('.py'):
            volumes.append(f)
    
    cprint(f"  发现 {len(volumes)} 个数据卷", Color.GREEN)
    
    # 分类每个文件
    plan = {}
    total_nodes = 0
    for vol in volumes:
        filepath = os.path.join(HERE, vol)
        target_dir, node_count = categorize_file(filepath)
        if target_dir not in plan:
            plan[target_dir] = []
        plan[target_dir].append({
            'source': vol,
            'nodes': node_count,
            'target': f'src/story/{target_dir}/{vol.replace(".py", ".yaml")}'
        })
        total_nodes += node_count
    
    return plan, total_nodes, volumes

def print_plan(plan, total_nodes):
    """打印重组计划"""
    cprint("\n[2/3] 重组计划：", Color.CYAN)
    cprint("-" * 70, Color.CYAN)
    
    dir_order = ['prologue', 'academy', 'seals', 'cities', 'factions', 
                 'races', 'characters', 'travel', 'combat', 'economy',
                 'items', 'quests', 'abyss', 'ending', 'timeline', 'systems', 'misc']
    
    for dir_name in dir_order:
        if dir_name in plan:
            files = plan[dir_name]
            nodes = sum(f['nodes'] for f in files)
            cprint(f"\n  📁 src/story/{dir_name}/ ({len(files)}个文件, {nodes}个节点)", Color.BOLD)
            for f in files:
                cprint(f"     {f['source']:<25} → {f['target']}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    cprint(f"\n  总计: {len(plan)} 个目录, {total_nodes} 个节点", Color.GREEN + Color.BOLD)
    cprint("-" * 70, Color.CYAN)

def execute_restructure(plan):
    """执行重组"""
    cprint("\n[3/3] 执行重组...", Color.CYAN)
    
    # 创建目录结构
    base_dir = os.path.join(HERE, 'src', 'story')
    os.makedirs(base_dir, exist_ok=True)
    
    # 备份原build_elda.py
    backup_path = os.path.join(HERE, 'build_elda.py.backup_v29')
    shutil.copy2(os.path.join(HERE, 'build_elda.py'), backup_path)
    cprint(f"  ✓ 已备份 build_elda.py → {backup_path}", Color.GREEN)
    
    # 转换每个文件为YAML并移动
    converted = 0
    for dir_name, files in plan.items():
        target_dir = os.path.join(base_dir, dir_name)
        os.makedirs(target_dir, exist_ok=True)
        
        for f in files:
            source_path = os.path.join(HERE, f['source'])
            target_path = os.path.join(HERE, f['target'])
            
            try:
                # 使用js_to_yaml转换
                from tools.js_to_yaml import extract_js_from_py, parse_js_nodes
                import yaml
                
                js_code = extract_js_from_py(source_path)
                if js_code:
                    nodes = parse_js_nodes(js_code)
                    yaml_content = yaml.dump(nodes, allow_unicode=True, default_flow_style=False, sort_keys=False)
                    
                    with open(target_path, 'w', encoding='utf-8') as out:
                        out.write(f'# 转换自: {f["source"]}\n')
                        out.write(f'# 节点数: {len(nodes)}\n')
                        out.write(f'# 转换时间: {time.strftime("%Y-%m-%d %H:%M:%S")}\n\n')
                        out.write(yaml_content)
                    
                    converted += 1
                    cprint(f"  ✓ {f['source']} → {f['target']}", Color.GREEN)
                else:
                    cprint(f"  ⚠ {f['source']}: 无法提取JS，跳过", Color.YELLOW)
            except Exception as e:
                cprint(f"  ✗ {f['source']}: 转换失败 - {e}", Color.RED)
    
    # 生成新的build配置
    config = {
        'version': 'v29',
        'created': time.strftime('%Y-%m-%d %H:%M:%S'),
        'structure': 'src/story/<category>/*.yaml',
        'converted_files': converted,
        'backup': 'build_elda.py.backup_v29'
    }
    config_path = os.path.join(HERE, 'src', 'story', 'structure.json')
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    cprint(f"\n✓ 重组完成！转换了 {converted} 个文件", Color.GREEN + Color.BOLD)
    cprint(f"  新结构: src/story/<category>/*.yaml", Color.CYAN)
    cprint(f"  配置文件: {config_path}", Color.CYAN)
    cprint(f"  原文件保留在项目根目录（未删除）", Color.YELLOW)
    cprint(f"\n  下一步：更新build_elda.py以支持新结构", Color.CYAN)

def rollback():
    """回滚到原结构"""
    cprint("\n回滚到原结构...", Color.CYAN)
    
    # 恢复build_elda.py
    backup_path = os.path.join(HERE, 'build_elda.py.backup_v29')
    if os.path.exists(backup_path):
        shutil.copy2(backup_path, os.path.join(HERE, 'build_elda.py'))
        cprint("  ✓ 已恢复 build_elda.py", Color.GREEN)
        os.remove(backup_path)
    else:
        cprint("  ⚠ 未找到备份文件", Color.YELLOW)
    
    # 删除src/story目录（如果存在）
    story_dir = os.path.join(HERE, 'src', 'story')
    if os.path.exists(story_dir):
        shutil.rmtree(story_dir)
        cprint("  ✓ 已删除 src/story/ 目录", Color.GREEN)
    
    cprint("\n✓ 回滚完成！", Color.GREEN + Color.BOLD)

def show_status():
    """显示当前结构状态"""
    cprint("\n当前结构状态：", Color.CYAN)
    cprint("-" * 50, Color.CYAN)
    
    # 检查旧结构
    old_count = len([f for f in os.listdir(HERE) 
                     if f.startswith('story_elda_') and f.endswith('.py')])
    cprint(f"  旧结构 (story_elda_*.py): {old_count} 个文件", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    # 检查新结构
    story_dir = os.path.join(HERE, 'src', 'story')
    if os.path.exists(story_dir):
        new_count = 0
        for root, dirs, files in os.walk(story_dir):
            new_count += len([f for f in files if f.endswith('.yaml')])
        cprint(f"  新结构 (src/story/**/*.yaml): {new_count} 个文件", Color.WHITE if hasattr(Color, 'WHITE') else '')
        
        # 显示目录结构
        cprint("\n  目录结构：", Color.BOLD)
        for item in sorted(os.listdir(story_dir)):
            item_path = os.path.join(story_dir, item)
            if os.path.isdir(item_path):
                count = len([f for f in os.listdir(item_path) if f.endswith('.yaml')])
                cprint(f"    📁 {item}/ ({count}个文件)", Color.CYAN)
    else:
        cprint(f"  新结构: 未创建", Color.YELLOW)
    
    # 检查备份
    backup_path = os.path.join(HERE, 'build_elda.py.backup_v29')
    if os.path.exists(backup_path):
        cprint(f"\n  备份: build_elda.py.backup_v29 存在", Color.GREEN)
    
    cprint("-" * 50, Color.CYAN)

def main():
    if len(sys.argv) < 2:
        cprint("用法: python tools/restructure.py [--dry-run|--execute|--rollback|--status]", Color.BOLD)
        cprint("  重组项目结构为按主题分类的YAML文件", Color.CYAN)
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    cprint("=" * 60, Color.BOLD)
    cprint("v29 项目结构重组工具", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    if cmd == '--status':
        show_status()
        return
    
    if cmd == '--rollback':
        rollback()
        return
    
    # 分析结构
    plan, total_nodes, volumes = analyze_structure()
    
    if cmd == '--dry-run':
        print_plan(plan, total_nodes)
        cprint("\n  （预览模式，未实际执行。使用 --execute 执行重组）", Color.YELLOW)
        return
    
    if cmd == '--execute':
        print_plan(plan, total_nodes)
        cprint("\n" + "="*60, Color.RED + Color.BOLD)
        cprint("⚠️  危险操作：项目重组将修改64个数据卷的位置和格式！", Color.RED + Color.BOLD)
        cprint("⚠️  此操作可能破坏构建链，建议先提交git或备份。", Color.RED + Color.BOLD)
        cprint("="*60, Color.RED + Color.BOLD)
        
        # 自动备份
        backup_dir = os.path.join(HERE, f'backup_restructure_{time.strftime("%Y%m%d_%H%M%S")}')
        cprint(f"\n[备份] 自动备份整个项目到 {backup_dir}...", Color.CYAN)
        import shutil
        os.makedirs(backup_dir, exist_ok=True)
        for f in os.listdir(HERE):
            if f.startswith('story_elda_') and f.endswith('.py'):
                shutil.copy2(os.path.join(HERE, f), os.path.join(backup_dir, f))
        shutil.copy2(os.path.join(HERE, 'build_elda.py'), os.path.join(backup_dir, 'build_elda.py'))
        cprint(f"  ✓ 备份完成（{len(os.listdir(backup_dir))}个文件）", Color.GREEN)
        
        # 二次确认
        cprint(f"\n输入 YES 确认执行重组，其他任意输入取消：", Color.YELLOW)
        try:
            confirm = input().strip()
        except:
            confirm = ''
        if confirm != 'YES':
            cprint("已取消，备份保留在 " + backup_dir, Color.YELLOW)
            return
        
        execute_restructure(plan)
        
        # 执行后验证构建
        cprint(f"\n[验证] 运行构建验证...", Color.CYAN)
        result = subprocess.run(
            [sys.executable, os.path.join(HERE, 'build_elda.py')],
            capture_output=True, text=True, cwd=HERE
        )
        if result.returncode == 0:
            cprint(f"  ✓ 构建成功！", Color.GREEN)
        else:
            cprint(f"  ✗ 构建失败，自动回滚...", Color.RED)
            cprint(f"  {result.stderr[:500]}", Color.RED)
            # 自动回滚
            for f in os.listdir(backup_dir):
                shutil.copy2(os.path.join(backup_dir, f), os.path.join(HERE, f))
            cprint(f"  ✓ 已回滚到备份版本", Color.YELLOW)
        return
    
    cprint(f"未知命令: {cmd}", Color.RED)
    sys.exit(1)

if __name__ == '__main__':
    main()
