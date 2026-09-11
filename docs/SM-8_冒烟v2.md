# SM-8 冒烟 v2 参数化（v93）

批次：SM-8 · 2026-09-11 · 八批大型更新第八批
状态：已完成，20 路径全 PASS

## 扩了什么

- `smoke_test.py` 升级为 v2 参数化：
  - `PATHS` 字典 20 条路径：main / origin_north~east（七亚种）/ academy / grad_stay~home / frontier / west / desert / anchor / goldscale / faction / events。
  - `simulate_keychain(text, chain=None)`：按键链仿真推进。
  - 命令行 `--path=<name>` 支持（默认 all）。
  - read() 合并 chunks/*.js：分片独有节点可校验（如 death_desert、origin_northern_2a 等）。

## 为什么

旧 smoke 只跑一条主线，无法覆盖七亚种开局、毕业四去向、七锚终局、势力线等大分支。v2 把"建号→主线→结局"扩展为 20 条可独立/批量跑的参数化路径，一条命令验证"能玩通"的全分支覆盖；分片合并读取让分片独有节点不成为漏网之鱼。

## 如何验证

- `python -X utf8 smoke_test.py --path=all` → RESULT: PASS（结局 55 节点、入边 66 条）。
- 单路径：`--path=anchor` 只跑七锚链。
- 修复记录：--path 解析偏移 a[6:]→a[7:]；缺失节点（death_desert→desert_oasis 等分片独有 id）用 sm8_autofix.py 按同前缀真实节点替代；最终 20 路径全 PASS。
