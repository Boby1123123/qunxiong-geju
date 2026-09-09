#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""elda regress 模板（V60-ENG）—— 浏览器回归 bu cell 生成器。

用法:
  python tools/elda/regression_template.py            # 打印完整模板
  python tools/elda/regression_template.py --brief    # 只打印分步清单

结论依据（V60 实测）:
  - 存档恢复 dialog: accept -> 读档; cancel -> showCreation() 新游戏
  - 原生 confirm 8 处去重 4 签名（c_dialog 白名单），全部需 bu 侧处理
  - 单 cell 单动作 + 超时先 Wait + dialog 前缀检查 为强制规范
"""
import sys

BRIEF = [
    '段1 探测: bu.page_info() 短 timeout(20s) → 判 daemon 死活',
    '段2 dialog: 有存档框则 handle_dialog(accept=False) 进新游戏（旧档验证用 accept=True）',
    '段3 建号: 创建角色 → 职业选择 → 进入学院',
    '段4 序章: 走 2-3 个节点，观察文本渲染与选项',
    '段5 行动面板: 检查职业之路七轨渲染（CareerHub）',
    '段6 V35 抽查: typeof choose/writeNext/v57_flowCheck/COMBAT_TEXTS',
    '段7 存档/读档: 存档一次 → reload → 处理恢复 dialog → 读档成功',
    '全程: 单 cell 单动作; 超时先 Wait 10-20s 不连环重试; console 定期 drain',
]

CELL1 = """import seed_browser_use as bu
# 段1：探测（短 timeout，单命令）——超时则 Wait 15s 后重试一次，再超时走环境级恢复
p = bu.page_info()
print('dialog:', p.get('dialog'))
print('url:', str(p.get('url', ''))[:80])
"""

CELL2 = """import seed_browser_use as bu
# 段2：处理存档恢复 dialog（V60 实测：cancel -> 新游戏 showCreation / accept -> 读档）
# 新游戏回归：accept=False；旧档兼容验证：accept=True
tabs = bu.list_tabs()
target = next(t for t in tabs if 'game.html' in str(t.get('url', '')))
print('switch:', bu.switch_tab(target))
import time; time.sleep(1)
try:
    print('handle:', bu.handle_dialog(accept=False))
except Exception as e:
    print('handle err:', str(e)[:120])
import time; time.sleep(1.5)
p = bu.page_info()
print('dialog now:', p.get('dialog'))
"""

CELL3 = """import seed_browser_use as bu
# 段3-7：分步回归（每段单独 cell；以下为段3 建号示例，后续段按清单推进）
# 进入创建界面后，观察角色创建面板并完成建号
p = bu.page_info()
print('title:', p.get('title'))
import time; time.sleep(2)
print(bu.get_page_text()[:600])
"""

TEMPLATE = """# 浏览器回归 bu 模板（V60-ENG · elda regress）

> 复制以下 cell 依次执行；每段单独一个 computer_use_tool(plane="bu") 调用。
> 铁律：单 cell 单动作；COMMAND_TIMEOUT 后先 Wait 10-20s 再继续；dialog 未处理前不 navigate/resync。

## 段1 探测 daemon 状态
```python
%s```

## 段2 处理存档恢复 dialog（必须最先处理）
```python
%s```

## 段3 建号 / 进入游戏（后续每段一个 cell，按清单推进）
```python
%s```

## 分步清单
%s

## 备注
- 原生 confirm 8 处（c_dialog 白名单 4 签名）：删档/覆盖档/新游戏/askConfirm，
  触发时一律先 handle_dialog(accept=True/False) 再继续，不得跳过。
- console 缓冲定期 bu.console_messages() drain。
- bu 无法自愈（resync 挂起/session 失效）时：环境重启 → 用户接管 → 降级命令行验证。
""" % (CELL1, CELL2, CELL3, '\n'.join('- ' + b for b in BRIEF))


def main():
    brief = '--brief' in sys.argv
    if brief:
        print('\n'.join('- ' + b for b in BRIEF))
    else:
        print(TEMPLATE)
    return 0


if __name__ == '__main__':
    sys.exit(main())
