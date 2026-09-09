#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 统一CLI入口 - 艾尔达大陆开发工具链
所有工具整合为一个命令，无需记住12个不同的脚本名。

用法:
  python tools/elda.py build              # 构建+语法检查+错误定位
  python tools/elda.py check              # 完整检查（引用+结构+语法+重复+tier）
  python tools/elda.py check --quick      # 快速检查
  python tools/elda.py fix                # 扫描可自动修复的错误（预览）
  python tools/elda.py fix --execute      # 执行自动修复（自动备份）
  python tools/elda.py compile <yaml>     # YAML→JS编译
  python tools/elda.py decompile <py>     # JS→YAML反向转换
  python tools/elda.py index              # 生成节点索引
  python tools/elda.py graph              # 生成节点关系图
  python tools/elda.py test               # 自动化遍历测试
  python tools/elda.py save-test          # 存档兼容性测试
  python tools/elda.py devpanel           # 注入开发者面板到game.html
  python tools/elda.py release            # 一键发布
  python tools/elda.py release --quick    # 快速发布
  python tools/elda.py restructure --dry-run  # 项目结构重组（预览）
  python tools/elda.py info               # 显示项目信息
"""
import os, sys, subprocess, time

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(HERE, 'tools')

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

def run_tool(script, args=None):
    """运行一个工具脚本"""
    cmd = [sys.executable, os.path.join(TOOLS, script)]
    if args:
        cmd.extend(args)
    result = subprocess.run(cmd, cwd=HERE)
    return result.returncode == 0

def cmd_build(args):
    """构建+语法检查+错误定位"""
    cprint("🔨 构建 game.html...", Color.CYAN + Color.BOLD)
    return run_tool('build_enhanced.py')

def cmd_check(args):
    """完整检查（统一检查工具：引用+结构+语法+重复+tier+存档兼容）"""
    quick = '--quick' in args
    cprint(f"🔍 运行{'快速' if quick else '完整'}检查（统一检查工具）...", Color.CYAN + Color.BOLD)
    check_args = []
    if quick:
        check_args.append('--quick')
    if '--verbose' in args:
        check_args.append('--verbose')
    if '--json' in args:
        check_args.append('--json')
    result = run_tool('check_unified.py', check_args)
    
    # 非快速模式下增加存档兼容性检查
    if not quick:
        cprint(f"\n[6/6] 存档兼容性检查...", Color.CYAN)
        run_tool('save_test.py')
    
    return result

def cmd_compile(args):
    """YAML→JS编译"""
    if not args:
        cprint("用法: python tools/elda.py compile <input.yaml> [-o output.js]", Color.RED)
        return False
    cprint("📝 编译 YAML → JS...", Color.CYAN + Color.BOLD)
    return run_tool('yaml_to_js.py', args)

def cmd_decompile(args):
    """JS→YAML反向转换"""
    if not args:
        cprint("用法: python tools/elda.py decompile <story_elda_xx.py> [-o output.yaml]", Color.RED)
        return False
    cprint("📝 反编译 JS → YAML...", Color.CYAN + Color.BOLD)
    return run_tool('js_to_yaml.py', args)

def cmd_index(args):
    """生成节点索引"""
    cprint("📋 生成节点索引...", Color.CYAN + Color.BOLD)
    return run_tool('generate_index.py', args)

def cmd_graph(args):
    """生成节点关系图"""
    cprint("🕸️  生成节点关系图...", Color.CYAN + Color.BOLD)
    return run_tool('visualize.py', args)

def cmd_test(args):
    """自动化遍历测试"""
    cprint("🧪 运行自动化测试...", Color.CYAN + Color.BOLD)
    return run_tool('traverse_test.py', args)

def cmd_save_test(args):
    """存档兼容性测试"""
    cprint("💾 存档兼容性测试...", Color.CYAN + Color.BOLD)
    return run_tool('save_test.py', args)

def cmd_devpanel(args):
    """开发者面板"""
    if '--remove' in args:
        cprint("🗑️  移除开发者面板...", Color.CYAN + Color.BOLD)
        return run_tool('dev_panel.py', ['--remove'])
    else:
        cprint("🛠️  注入开发者面板到 game.html...", Color.CYAN + Color.BOLD)
        cprint("  激活方式：游戏中按 F12 或输入 devmode", Color.YELLOW)
        return run_tool('dev_panel.py', ['--inject'])

def cmd_release(args):
    """一键发布"""
    cprint("🚀 一键发布...", Color.CYAN + Color.BOLD)
    return run_tool('release.py', args)

def cmd_fix(args):
    """自动修复常见语法错误"""
    if '--execute' in args:
        cprint("🔧 执行自动修复（将修改文件，自动备份）...", Color.RED + Color.BOLD)
    else:
        cprint("🔍 扫描可自动修复的错误（预览模式，不修改文件）...", Color.CYAN + Color.BOLD)
    return run_tool('auto_fix.py', args)

def cmd_restructure(args):
    """项目结构重组"""
    cprint("📂 项目结构重组...", Color.CYAN + Color.BOLD)
    return run_tool('restructure.py', args)

def cmd_info(args):
    """显示项目信息"""
    cprint("="*60, Color.BOLD)
    cprint("  艾尔达大陆：群雄割据 - 项目信息", Color.CYAN + Color.BOLD)
    cprint("="*60, Color.BOLD)
    
    # game.html信息
    game_path = os.path.join(HERE, 'game.html')
    if os.path.exists(game_path):
        size = os.path.getsize(game_path)
        cprint(f"\n  📄 game.html: {size:,} 字节 ({size/1024/1024:.2f} MB)", Color.WHITE if hasattr(Color, 'WHITE') else '')
        
        # 统计节点数
        with open(game_path, 'r', encoding='utf-8') as f:
            html = f.read()
        import re
        nodes = len(set(re.findall(r'N\["([^"]+)"\]', html)))
        goes = len(re.findall(r'go:\s*"([^"]+)"', html))
        cprint(f"  📍 节点数: {nodes}", Color.WHITE if hasattr(Color, 'WHITE') else '')
        cprint(f"  🔗 go引用: {goes}", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    # 数据卷
    vols = [f for f in os.listdir(HERE) if f.startswith('story_elda_') and f.endswith('.py')]
    cprint(f"\n  📚 数据卷: {len(vols)} 个", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    # 工具
    tools = [f for f in os.listdir(TOOLS) if f.endswith('.py') and f != 'elda.py']
    cprint(f"  🛠️  工具: {len(tools)} 个", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    # 文档
    docs_dir = os.path.join(HERE, 'docs')
    if os.path.exists(docs_dir):
        docs = [f for f in os.listdir(docs_dir) if f.endswith('.md')]
        cprint(f"  📖 文档: {len(docs)} 个", Color.WHITE if hasattr(Color, 'WHITE') else '')
    
    cprint(f"\n  💡 常用命令:", Color.CYAN)
    cprint(f"    python tools/elda.py build       # 构建", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    python tools/elda.py check       # 检查", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    python tools/elda.py release     # 发布", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint(f"    python tools/elda.py compile x.yaml  # 编译YAML", Color.WHITE if hasattr(Color, 'WHITE') else '')
    cprint("="*60, Color.BOLD)
    return True

def cmd_help(args):
    """显示帮助"""
    print(__doc__)
    return True

COMMANDS = {
    'build': cmd_build,
    'check': cmd_check,
    'fix': cmd_fix,
    'compile': cmd_compile,
    'decompile': cmd_decompile,
    'index': cmd_index,
    'graph': cmd_graph,
    'test': cmd_test,
    'save-test': cmd_save_test,
    'devpanel': cmd_devpanel,
    'release': cmd_release,
    'restructure': cmd_restructure,
    'info': cmd_info,
    'help': cmd_help,
}

def main():
    if len(sys.argv) < 2:
        cmd_info([])
        print("\n用法: python tools/elda.py <命令> [参数]")
        print("命令: build, check, compile, decompile, index, graph, test, release, info, help")
        sys.exit(0)
    
    cmd = sys.argv[1]
    args = sys.argv[2:]
    
    if cmd in COMMANDS:
        start = time.time()
        success = COMMANDS[cmd](args)
        elapsed = time.time() - start
        if cmd not in ['help', 'info']:
            cprint(f"\n⏱️  耗时: {elapsed:.1f}秒", Color.CYAN)
        sys.exit(0 if success else 1)
    else:
        cprint(f"未知命令: {cmd}", Color.RED)
        cprint("可用命令: " + ", ".join(COMMANDS.keys()), Color.YELLOW)
        sys.exit(1)

if __name__ == '__main__':
    main()
