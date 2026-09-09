# -*- coding: utf-8 -*-
"""测试 replace 模式匹配"""
import io
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

pat1 = 'catch(e){}return false;"}}'
print('pat1 count:', s.count(pat1))
pat2 = 'catch(e){return false;"}}'
print('pat2 count:', s.count(pat2))
pat6 = '"trigger":"function('
print('pat6 count:', s.count(pat6))

# 也检查脚本源码里的模式
src = io.open(r'D:\1pao tuan\群雄割据\_v53_content1.py', encoding='utf-8').read()
print('src pat1 count:', src.count(pat1))
