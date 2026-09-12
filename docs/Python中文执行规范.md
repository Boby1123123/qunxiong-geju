# Python 中文执行规范（群雄割据 · 工程铁律）

> 状态：2026-09-12 固化。适用于本机（中文 Windows + PowerShell 5.1）所有 Python 调用。
> 一句话规则：**凡是要处理中文的 Python 逻辑，先 `Write` 成 `.py` 文件，再经 `tools\runpy.ps1` 执行——没有例外。**

## 一、为什么会炸（三座山）

1. **代码页**：中文 Windows 下 PowerShell 5.1 默认按 GBK/CP936 把整条命令字符串传给 `python.exe`。`-X utf8` 救的是 Python 的 stdio，救不了 `-c` 这段命令行参数的编码错位 → 中文字节变乱码 → SyntaxError。
2. **引号/反斜杠嵌套**：`-c` 里既有 PS 外层双引号、又有 Python 字符串引号、还要写 `\\`、`\"`。每多一层 shell，反斜杠被剥一层，最后字符串断裂。事故实例：tq35c 内联中 `'\"'` 被剥到只剩 `\`，PS 当续行符直接断行。
3. **PS 特殊字符提前解释**：`;` `$` 反引号 `&` `|` 在 `-c` 字符串里被 PS 先吃掉一层，逻辑被截断或改写。

## 二、标准流程（方案 A · 首选）

```powershell
# 1. 用 Write 工具落文件（Write 保证 UTF-8 + LF）
# 2. 模板：tools\scripts_tmp\_py_template.py（开头两行 stdio 包装）
# 3. 执行（两种等价入口）：
.\tools\runpy.ps1 tools\scripts_tmp\xxx.py
# 或直接：
python -X utf8 tools\scripts_tmp\xxx.py
```

脚本开头固定两行（防 print 中文乱码）：

```python
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
```

读写文件一律显式 `encoding="utf-8", newline="\n"`（防 CRLF 污染发布文件）。

**适用判定**：代码里只要出现一个中文字符（中文判断、中文替换文案、中文正则、docstring 中文）→ 直接走本流程。

## 三、方案 B · `-c` 只写纯 ASCII

仅适合"读文件 / 算数字 / 查数量"类零中文逻辑：

```powershell
python -X utf8 -c "import json,io;d=json.load(io.open('thin_pool.json',encoding='utf-8'));print(len(d))"
```

一旦 `-c` 里要出现中文字面量 → 立即转方案 A。

## 四、方案 C · base64 内联（临时救急）

含中文的代码段先 base64 编码（纯 ASCII 安全字符，绕开 PS 传参编码问题）：

```powershell
python -c "import base64;exec(base64.b64decode('5L2g5aW9...'))"
```

定位是救急；长期仍是方案 A。

## 五、方案 D · 切代码页（治标）

```powershell
chcp 65001 ; $env:PYTHONIOENCODING='utf-8'
```

只能缓解**输出**乱码，救不了传参与转义断裂，不要依赖它。

## 六、配套工具

| 文件 | 作用 |
|---|---|
| `tools\runpy.ps1` | 标准执行入口：校验脚本存在/扩展名 → chcp 65001 + PYTHONIOENCODING → `python -X utf8 <file>`；PS 侧零中文传参 |
| `tools\scripts_tmp\_py_template.py` | 新临时脚本模板（stdio 包装 + 读写规范 + 归档提醒） |

## 七、历史事故（防回潮）

- tq35c / tq36 内联炸：`'\"'` 剥皮断行 → 改 Write `.py` 后一次通过。
- 本规范编写过程中的实证：PS 命令里写引号嵌套模式扫描，PS 自己先炸 → 换 .py 文件扫描一次通过。
- 全仓扫描（tools/.githooks/.github/scripts）：当前活动脚本 0 处 `python -c` 内联，仓库已处于规范状态。
