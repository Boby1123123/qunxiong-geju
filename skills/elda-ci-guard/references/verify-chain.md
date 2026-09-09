# 验证链详解（手动分步执行时用）

> 一键版：`python ci_guard.py --quick / --build`。本文件说明每一步的语义、预期输出与失败处理。

## 步骤 0：改动前备份（铁律）

```bat
mkdir backup\<批次>_<日期>
copy 将被改动的文件 backup\<批次>_<日期>\
```

批次命名示例：`P0-1_20260909`、`UI-1_20260909`、`BD1_20260909`、`CM-1_20260909`。

## 步骤 1：重建权威源 → 发布版

```bat
python -X utf8 _build_authority.py build
```

- 输入：`src\`（26 块：script_01~12 + data_nodes）
- 输出：`game_built.html`
- 然后必须 `copy /Y game_built.html game.html` —— game.html 才是实际发布文件（game_check/chunked/index 都以它为准）。

**失败处理**：读报错文件+行号，修复 src 后重跑；未成功重建前不得声称构建完成。

## 步骤 2：分片版

```bat
python -X utf8 tools\elda\elda.py chunks
```

- 生成 `index.html` + `chunks\`（默认入口为分片版）。
- **跳过此步 = 分片版缺新代码**（玩家走 index.html 就玩不到新内容）。

## 步骤 3：四路同步

```bat
python -X utf8 tools\elda\elda.py sync
```

- 目标：`game.html == game_check.html`、`game_chunked.html == index.html`（字节级）。

## 步骤 4：全量门禁

```bat
python -X utf8 tools\elda\elda.py ci
```

- 21 检查器：src 语法 / 节点去重 / 死链 / 事件触发 / 因果账本 / 节奏字数 / 文本治理（引号·高频词·专名）/ 性能预算 / 四路一致 等。
- 超预算：`python -X utf8 tools\elda\elda.py budget --reason "真实原因"` 后重跑 ci。
- **预期**：全 PASS。任何 FAIL → 停止、报告、修复后重跑。

## 步骤 5：冒烟测试

```bat
python -X utf8 smoke_test.py
```

- headless 建号 → 走主线 → 触发结局，验证"能玩通"。
- 耗时较长（数分钟），不要中断。

## 步骤 6：发布

```bat
git add -A
git commit -m "<批次>：<改动摘要>"
git push origin main
```

- push 后 GitHub Pages（https://boby1123123.github.io/qunxiong-geju/）自动部署，5-15 分钟后线上生效。
- PowerShell 下 git 可能显示红色 stderr 但实际成功——以输出含 `main -> main` 判断。

## 偏差处理

任何一步 FAIL 或数字低于基线（见 baselines.md）：**立即停止 → 报告差异与可能原因 → 修复或等待指示**。不绕行、不降级、不静默通过。
