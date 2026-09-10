# -*- coding: utf-8 -*-
# /user-instr:mobile-purge/ 按用户最新指令删除全部移动端适配残留
# 1) 根目录 gap_00.html（旧遗留，不在构建链）：删除 2 处 @media (max-width:768px) 块
import io, sys, re

P = r"D:\1pao tuan\群雄割据\gap_00.html"
with io.open(P, "r", encoding="utf-8", newline="") as f:
    src = f.read()

orig = src

# 块1：557-572 v42 移动端适配（<768px 竖屏）
pat1 = re.compile(
    r"/\* ===== v42 移动端适配（<768px 竖屏） ===== \*/\n"
    r"@media \(max-width:768px\)\{[^}]*\}\n",
    re.S
)
# 块2：853-855 v68-panel-box 94vw
pat2 = re.compile(
    r"@media \(max-width:768px\)\{\n"
    r"  \.v68-panel-box\{width:94vw;max-height:86vh\}\n"
    r"\}\n",
    re.S
)

n1 = len(pat1.findall(src))
n2 = len(pat2.findall(src))
print("found media blocks: v42 =", n1, ", v68 =", n2)
src = pat1.sub("", src, count=1)
src = pat2.sub("", src, count=1)

# 残余 @media 检查
residual = re.findall(r"@media[^{]*\{", src)
print("residual @media:", residual if residual else "无")

with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(src)
print("OK: gap_00.html", len(orig), "->", len(src), "bytes")
