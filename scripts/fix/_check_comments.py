#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查多行注释配对和其他语法问题"""

with open('_chk0.js','r',encoding='utf-8') as f:
    content = f.read()

# 检查多行注释
comment_start = content.count('/*')
comment_end = content.count('*/')
print(f"多行注释开始: {comment_start}, 结束: {comment_end}")

# 检查是否有未闭合的注释
in_comment = False
comment_start_pos = 0
for i in range(len(content)):
    if not in_comment and content[i:i+2] == '/*':
        in_comment = True
        comment_start_pos = i
    elif in_comment and content[i:i+2] == '*/':
        in_comment = False
if in_comment:
    print(f"⚠ 未闭合的多行注释，开始于位置 {comment_start_pos}")
    line_num = content[:comment_start_pos].count('\n') + 1
    print(f"  行号: {line_num}")
    print(f"  附近内容: {content[comment_start_pos:comment_start_pos+200]}")

# 尝试用node的vm模块来检查，获取更详细的错误
import subprocess
result = subprocess.run(['node','-e', '''
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('_chk0.js', 'utf8');
try {
  new vm.Script(code);
  console.log('Syntax OK');
} catch(e) {
  console.log('Error:', e.message);
  console.log('Stack:', e.stack);
}
'''], capture_output=True, text=True)
print(f"\nNode vm检查:")
print(result.stdout)
print(result.stderr)
