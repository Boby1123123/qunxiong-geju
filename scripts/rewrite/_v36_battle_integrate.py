#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 战斗结束跳转集成：修改v35_initBattle支持战后节点跳转"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 修改v35_initBattle函数，支持传入战后节点
old_init = "function v35_initBattle(enemyId) {"
new_init = """function v35_initBattle(enemyId, nextVictory, nextDefeat, nextFlee) {
  V35_BATTLE.nextVictory = nextVictory || "battle_generic_victory";
  V35_BATTLE.nextDefeat = nextDefeat || "battle_generic_defeat";
  V35_BATTLE.nextFlee = nextFlee || nextDefeat || "battle_generic_defeat";"""

if old_init in html:
    html = html.replace(old_init, new_init)
    print("✓ v35_initBattle已支持战后节点跳转")
else:
    print("⚠ 未找到v35_initBattle函数定义")

# 修改v35_closeBattleResult函数，关闭后跳转
old_close = "function v35_closeBattleResult() {"
# 找到这个函数并修改它的内容
if old_close in html:
    # 找到函数体
    start = html.find(old_close)
    # 找到函数结束（下一个function或console.log）
    next_func = html.find("function ", start + 10)
    if next_func < 0:
        next_func = html.find("console.log", start + 10)
    old_func_body = html[start:next_func]
    
    new_func_body = """function v35_closeBattleResult() {
  const overlay = document.getElementById('v35-battle-result');
  if (overlay) overlay.classList.remove('active');
  v35_hideBattleUI();
  // 跳转到战后节点
  var nextNode = V35_BATTLE.nextVictory;
  if (V35_BATTLE.result === "defeat") nextNode = V35_BATTLE.nextDefeat;
  if (V35_BATTLE.result === "flee") nextNode = V35_BATTLE.nextFlee;
  if (nextNode && N[nextNode]) {
    curNode = nextNode;
    document.getElementById('story').innerHTML = '';
    writeNext();
  }
}

"""
    html = html[:start] + new_func_body + html[next_func:]
    print("✓ v35_closeBattleResult已添加战后跳转逻辑")
else:
    print("⚠ 未找到v35_closeBattleResult函数")

# 修改战斗开始节点，传入战后节点
replacements = [
    ('v35_initBattle("seal_1_guardian")', 'v35_initBattle("seal_1_guardian","battle_seal1_victory","battle_seal1_defeat","battle_seal1_defeat")'),
    ('v35_initBattle("eclipse_thug")', 'v35_initBattle("eclipse_thug","battle_eclipse_victory","battle_eclipse_defeat","battle_eclipse_defeat")'),
    ('v35_initBattle("academy_duel")', 'v35_initBattle("academy_duel","battle_academy_duel_victory","battle_academy_duel_defeat","battle_academy_duel_defeat")'),
    ('v35_initBattle("bandit")', 'v35_initBattle("bandit","battle_generic_victory","battle_generic_defeat","city_free")'),
]

for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
        print(f"✓ 已更新: {old[:40]}...")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n文件大小: {len(html)} 字符")
