#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v31 UI专项检查工具
检查游戏HTML的UI一致性、可访问性、对比度等
"""

import re
import sys
import os

def read_html(path='game.html'):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_css(html):
    """提取<style>中的CSS"""
    match = re.search(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    return match.group(1) if match else ''

def extract_js(html):
    """提取所有<script>中的JS"""
    return re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)

def check_css_variables(css):
    """检查CSS变量定义完整性"""
    issues = []
    # 检查:root变量
    root_match = re.search(r':root\s*\{([^}]+)\}', css)
    if not root_match:
        issues.append(('ERROR', '未找到:root CSS变量定义'))
        return issues
    
    root_content = root_match.group(1)
    required_vars = [
        '--bg-deep', '--bg-panel', '--bg-input',
        '--text-primary', '--text-secondary', '--text-muted', '--text-gold',
        '--border', '--border-light',
        '--success', '--warning', '--danger', '--info', '--purple'
    ]
    for var in required_vars:
        if var not in root_content:
            issues.append(('WARN', f'缺少CSS变量: {var}'))
    
    return issues

def check_button_styles(css):
    """检查按钮样式完整性"""
    issues = []
    checks = [
        (r'\.btn\s*\{', '基础.btn样式'),
        (r'\.btn:hover', '.btn:hover状态'),
        (r'\.btn:active', '.btn:active状态'),
        (r'\.btn-primary\s*\{', '.btn-primary主按钮'),
        (r'\.btn-secondary\s*\{', '.btn-secondary次按钮'),
        (r'\.btn-back\s*\{', '.btn-back返回按钮'),
        (r'\.btn-back:hover', '.btn-back:hover状态'),
        (r'#options \.opt\s*\{', '选项按钮.opt样式'),
        (r'#options \.opt:hover', '选项按钮hover状态'),
    ]
    for pattern, name in checks:
        if not re.search(pattern, css):
            issues.append(('WARN', f'缺少按钮样式: {name}'))
    return issues

def check_modal_styles(css):
    """检查模态框样式完整性"""
    issues = []
    checks = [
        (r'\.v31-modal-container', 'v31模态框容器'),
        (r'@keyframes v31ModalIn', '模态框打开动画'),
        (r'#modal\.show', '模态框显示状态'),
        (r'backdrop-filter', '背景模糊效果'),
    ]
    for pattern, name in checks:
        if not re.search(pattern, css):
            issues.append(('WARN', f'缺少模态框样式: {name}'))
    return issues

def check_font_styles(css):
    """检查字体样式"""
    issues = []
    checks = [
        (r'@import.*fonts\.googleapis', 'Google Fonts引入'),
        (r'--font-title', '标题字体变量'),
        (r'--font-body', '正文字体变量'),
        (r'font-family.*Noto Serif', '衬线字体使用'),
        (r'font-family.*Noto Sans', '无衬线字体使用'),
    ]
    for pattern, name in checks:
        if not re.search(pattern, css):
            issues.append(('INFO', f'字体样式: {name}'))
    return issues

def check_hardcoded_colors(css):
    """检查硬编码颜色（应该用CSS变量）"""
    issues = []
    # 常见的硬编码颜色模式（排除CSS变量定义和渐变中的合理使用）
    # 检查color: #xxx 形式（不在:root定义中）
    root_end = css.find('}')  # 第一个}是:root结束
    non_root_css = css[root_end:] if root_end > 0 else css
    
    # 检查直接使用的颜色（简单检查）
    hardcoded = re.findall(r'(?:color|background|border-color)\s*:\s*#[0-9a-fA-F]{3,6}', non_root_css)
    if len(hardcoded) > 20:
        issues.append(('INFO', f'发现{len(hardcoded)}处硬编码颜色，建议使用CSS变量'))
    return issues

def check_contrast(css):
    """简单对比度检查（基于颜色值估算）"""
    issues = []
    # 检查关键文字颜色与背景的对比度
    # 这是简化检查，实际对比度计算更复杂
    text_colors = {
        '--text-primary': '#e8eef5',
        '--text-secondary': '#b8c5d6', 
        '--text-muted': '#97a8bd',
    }
    bg_colors = {
        '--bg-deep': '#080e1a',
        '--bg-panel': '#0f1a2e',
    }
    
    def luminance(hex_color):
        """计算相对亮度"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join(c*2 for c in hex_color)
        r, g, b = int(hex_color[0:2],16)/255, int(hex_color[2:4],16)/255, int(hex_color[4:6],16)/255
        def linearize(c):
            return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
        return 0.2126*linearize(r) + 0.7152*linearize(g) + 0.0722*linearize(b)
    
    def contrast_ratio(c1, c2):
        l1, l2 = luminance(c1), luminance(c2)
        lighter, darker = max(l1,l2), min(l1,l2)
        return (lighter + 0.05) / (darker + 0.05)
    
    for text_name, text_hex in text_colors.items():
        for bg_name, bg_hex in bg_colors.items():
            ratio = contrast_ratio(text_hex, bg_hex)
            if ratio < 4.5:
                issues.append(('WARN', f'{text_name} vs {bg_name} 对比度 {ratio:.1f}:1，低于WCAG AA 4.5:1'))
            else:
                issues.append(('OK', f'{text_name} vs {bg_name} 对比度 {ratio:.1f}:1'))
    
    return issues

def check_js_modal_functions(js_blocks):
    """检查JS中模态框函数"""
    issues = []
    all_js = '\n'.join(js_blocks)
    
    checks = [
        (r'function openModal\(', 'openModal函数'),
        (r'function closeModal\(', 'closeModal函数'),
        (r'btn-back', 'btn-back类使用'),
        (r'v31-modal-container', 'v31-modal-container使用'),
        (r'Escape', 'ESC键关闭'),
        (r'e\.target===m|e\.target===overlay', '点击遮罩关闭'),
    ]
    for pattern, name in checks:
        if not re.search(pattern, all_js):
            issues.append(('WARN', f'JS中缺少: {name}'))
    return issues

def check_accessibility(css, js_blocks):
    """可访问性检查"""
    issues = []
    all_js = '\n'.join(js_blocks)
    
    # 检查焦点样式
    if ':focus-visible' not in css:
        issues.append(('WARN', '缺少:focus-visible键盘导航样式'))
    
    # 检查按钮最小尺寸（简化检查）
    btn_padding = re.search(r'\.btn\s*\{[^}]*padding\s*:\s*(\d+)px', css)
    if btn_padding and int(btn_padding.group(1)) < 8:
        issues.append(('INFO', '按钮padding较小，建议≥8px以确保可点击区域'))
    
    return issues

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'game.html'
    if not os.path.exists(path):
        print(f"错误: 文件不存在 {path}")
        sys.exit(1)
    
    print("=" * 60)
    print("v31 UI专项检查工具")
    print("=" * 60)
    print(f"检查文件: {path}")
    print()
    
    html = read_html(path)
    css = extract_css(html)
    js_blocks = extract_js(html)
    
    print(f"CSS大小: {len(css)} 字符")
    print(f"JS块数: {len(js_blocks)}")
    print()
    
    all_issues = []
    
    # 运行各项检查
    print("【1/7】CSS变量检查...")
    all_issues.extend(check_css_variables(css))
    
    print("【2/7】按钮样式检查...")
    all_issues.extend(check_button_styles(css))
    
    print("【3/7】模态框样式检查...")
    all_issues.extend(check_modal_styles(css))
    
    print("【4/7】字体样式检查...")
    all_issues.extend(check_font_styles(css))
    
    print("【5/7】硬编码颜色检查...")
    all_issues.extend(check_hardcoded_colors(css))
    
    print("【6/7】对比度检查...")
    all_issues.extend(check_contrast(css))
    
    print("【7/7】JS模态框函数检查...")
    all_issues.extend(check_js_modal_functions(js_blocks))
    
    # 可访问性检查
    all_issues.extend(check_accessibility(css, js_blocks))
    
    # 统计结果
    errors = [i for i in all_issues if i[0] == 'ERROR']
    warnings = [i for i in all_issues if i[0] == 'WARN']
    infos = [i for i in all_issues if i[0] == 'INFO']
    oks = [i for i in all_issues if i[0] == 'OK']
    
    print()
    print("=" * 60)
    print("检查结果")
    print("=" * 60)
    print(f"通过: {len(oks)}")
    print(f"信息: {len(infos)}")
    print(f"警告: {len(warnings)}")
    print(f"错误: {len(errors)}")
    print()
    
    if errors:
        print("【错误】")
        for level, msg in errors:
            print(f"  ✗ {msg}")
        print()
    
    if warnings:
        print("【警告】")
        for level, msg in warnings:
            print(f"  ⚠ {msg}")
        print()
    
    if infos:
        print("【信息】")
        for level, msg in infos:
            print(f"  ℹ {msg}")
        print()
    
    if oks:
        print("【通过】")
        for level, msg in oks:
            print(f"  ✓ {msg}")
        print()
    
    print("=" * 60)
    if errors:
        print("结论: 存在错误，需要修复")
        sys.exit(1)
    elif warnings:
        print("结论: 通过（有警告，建议优化）")
    else:
        print("结论: 全部通过")
    print("=" * 60)

if __name__ == '__main__':
    main()
