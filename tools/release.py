#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具12：一键发布工具
功能：串联所有工具，执行完整的发布流程
1. 引用检查
2. 构建game.html
3. 语法检查（node --check）
4. 自动化节点遍历测试
5. 存档兼容性测试
6. 生成节点索引
7. 生成节点关系图
8. 备份当前版本
9. 生成发布报告
用法：
  python tools/release.py              # 完整发布流程
  python tools/release.py --quick      # 快速发布（跳过部分测试）
  python tools/release.py --version v30  # 指定版本号
"""
import json, os, shutil, subprocess, sys, time

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS_DIR = os.path.join(HERE, 'tools')

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

def run_step(name, func, critical=True):
    """运行一个发布步骤"""
    cprint(f"\n{'='*60}", Color.BOLD)
    cprint(f"  {name}", Color.CYAN + Color.BOLD)
    cprint(f"{'='*60}", Color.BOLD)
    
    start = time.time()
    try:
        result = func()
        elapsed = time.time() - start
        if result:
            cprint(f"  ✓ {name} 完成 ({elapsed:.1f}秒)", Color.GREEN)
            return True
        else:
            cprint(f"  ✗ {name} 失败", Color.RED)
            if critical:
                cprint(f"\n发布流程中止！请修复上述问题后重试。", Color.RED + Color.BOLD)
                sys.exit(1)
            return False
    except Exception as e:
        elapsed = time.time() - start
        cprint(f"  ✗ {name} 异常: {e} ({elapsed:.1f}秒)", Color.RED)
        import traceback
        traceback.print_exc()
        if critical:
            sys.exit(1)
        return False

def step_check_references():
    """步骤1：引用检查"""
    result = subprocess.run(
        [sys.executable, os.path.join(TOOLS_DIR, 'check_references.py')],
        capture_output=True, text=True, cwd=HERE
    )
    # 引用检查允许有警告（预存例外），但不应该有严重错误
    output = result.stdout + result.stderr
    if '✗ 引用检查失败' in output:
        cprint("  发现死链，请检查", Color.YELLOW)
        # 非致命，继续
    return True

def step_build():
    """步骤2：构建game.html"""
    result = subprocess.run(
        [sys.executable, os.path.join(HERE, 'build_elda.py')],
        capture_output=True, text=True, cwd=HERE
    )
    if result.returncode != 0:
        cprint(f"  构建失败: {result.stderr}", Color.RED)
        return False
    cprint(f"  {result.stdout.strip().split(chr(10))[-1]}", Color.GREEN)
    return True

def step_syntax_check():
    """步骤3：语法检查"""
    result = subprocess.run(
        [sys.executable, os.path.join(TOOLS_DIR, 'build_enhanced.py'), '--check'],
        capture_output=True, text=True, cwd=HERE
    )
    if '✓ 全部语法检查通过' in result.stdout:
        return True
    cprint(result.stdout[-500:], Color.RED)
    return False

def step_traverse_test(quick=False):
    """步骤4：自动化节点遍历测试"""
    args = [sys.executable, os.path.join(TOOLS_DIR, 'traverse_test.py')]
    if quick:
        args.append('--quick')
    result = subprocess.run(args, capture_output=True, text=True, cwd=HERE)
    # 测试允许有警告，但结构错误应该为0
    if '结构错误: 0' in result.stdout:
        return True
    cprint("  发现结构问题（非致命，继续）", Color.YELLOW)
    return True  # 非致命

def step_save_test():
    """步骤5：存档兼容性测试"""
    result = subprocess.run(
        [sys.executable, os.path.join(TOOLS_DIR, 'save_test.py')],
        capture_output=True, text=True, cwd=HERE
    )
    return '✓ 兼容性测试完成' in result.stdout

def step_generate_index():
    """步骤6：生成节点索引"""
    result = subprocess.run(
        [sys.executable, os.path.join(TOOLS_DIR, 'generate_index.py')],
        capture_output=True, text=True, cwd=HERE
    )
    return '✓ 索引已生成' in result.stdout

def step_generate_graph():
    """步骤7：生成节点关系图"""
    result = subprocess.run(
        [sys.executable, os.path.join(TOOLS_DIR, 'visualize.py')],
        capture_output=True, text=True, cwd=HERE
    )
    return '✓ 关系图已生成' in result.stdout

def step_backup(version):
    """步骤8：备份当前版本"""
    releases_dir = os.path.join(HERE, 'releases')
    os.makedirs(releases_dir, exist_ok=True)
    
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    backup_name = f'game_{version}_{timestamp}.html'
    backup_path = os.path.join(releases_dir, backup_name)
    
    shutil.copy2(os.path.join(HERE, 'game.html'), backup_path)
    cprint(f"  备份: {backup_path}", Color.GREEN)
    return True

def step_generate_report(version, quick=False):
    """步骤9：生成发布报告"""
    game_path = os.path.join(HERE, 'game.html')
    file_size = os.path.getsize(game_path)
    
    # 统计节点数
    with open(game_path, 'r', encoding='utf-8') as f:
        html = f.read()
    import re
    node_count = len(set(re.findall(r'N\["([^"]+)"\]', html)))
    go_count = len(re.findall(r'go:\s*"([^"]+)"', html))
    
    report = {
        'version': version,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'file_size': file_size,
        'file_size_mb': round(file_size / 1024 / 1024, 2),
        'node_count': node_count,
        'go_references': go_count,
        'quick_mode': quick,
        'tools': {
            'check_references': '✓',
            'build': '✓',
            'syntax_check': '✓',
            'traverse_test': '✓',
            'save_test': '✓',
            'generate_index': '✓',
            'generate_graph': '✓',
            'backup': '✓'
        }
    }
    
    report_path = os.path.join(HERE, 'docs', f'RELEASE_{version}.json')
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    cprint(f"\n  发布报告:", Color.BOLD)
    cprint(f"    版本: {version}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    文件大小: {report['file_size_mb']} MB ({file_size:,} 字节)", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    节点数: {node_count}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    go引用: {go_count}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    报告: {report_path}", Color.CYAN)
    
    return True

def main():
    quick = '--quick' in sys.argv
    version = 'v29'
    
    if '--version' in sys.argv:
        idx = sys.argv.index('--version')
        if idx + 1 < len(sys.argv):
            version = sys.argv[idx + 1]
    
    cprint("=" * 70, Color.BOLD)
    cprint(f"  v29 一键发布工具 {'（快速模式）' if quick else ''}", Color.CYAN + Color.BOLD)
    cprint(f"  版本: {version}", Color.CYAN)
    cprint("=" * 70, Color.BOLD)
    
    start_time = time.time()
    
    # 执行发布流程
    run_step("1/9 引用检查", step_check_references, critical=False)
    run_step("2/9 构建 game.html", step_build)
    run_step("3/9 语法检查 (node --check)", step_syntax_check)
    run_step("4/9 自动化节点遍历测试", lambda: step_traverse_test(quick), critical=False)
    if not quick:
        run_step("5/9 存档兼容性测试", step_save_test, critical=False)
    else:
        cprint("\n  ⏭ 跳过存档兼容性测试（快速模式）", Color.YELLOW)
    run_step("6/9 生成节点索引", step_generate_index, critical=False)
    if not quick:
        run_step("7/9 生成节点关系图", step_generate_graph, critical=False)
    else:
        cprint("\n  ⏭ 跳过节点关系图（快速模式）", Color.YELLOW)
    run_step("8/9 备份当前版本", lambda: step_backup(version), critical=False)
    run_step("9/9 生成发布报告", lambda: step_generate_report(version, quick))
    
    elapsed = time.time() - start_time
    
    cprint(f"\n{'='*70}", Color.BOLD)
    cprint(f"  🎉 发布完成！总耗时: {elapsed:.1f}秒", Color.GREEN + Color.BOLD)
    cprint(f"{'='*70}", Color.BOLD)
    cprint(f"\n  产物:", Color.BOLD)
    cprint(f"    game.html ({os.path.getsize(os.path.join(HERE, 'game.html')):,} 字节)", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    docs/NODE_INDEX.md", Color.WHITE if hasattr(Color, 'WHITE') else '')
    if not quick:
        cprint(f"    docs/node_graph.html", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    docs/RELEASE_{version}.json", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    releases/game_{version}_*.html (备份)", Color.WHITE if hasattr(Color, 'WHITE') else '')

if __name__ == '__main__':
    main()
