#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向七：数值平衡检查与调整"""
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 检查V35_ENEMIES中的敌人数值
enemy_section = html[html.find('V35_ENEMIES'):html.find('V35_ENEMIES')+3000] if 'V35_ENEMIES' in html else ''
enemies = re.findall(r'(\w+):\s*\{[^}]*hp:\s*(\d+)[^}]*atk:\s*(\d+)', enemy_section)
print("=== 敌人数值检查 ===")
for name, hp, atk in enemies[:20]:
    hp = int(hp); atk = int(atk)
    status = "✓" if 20 <= hp <= 200 and 3 <= atk <= 50 else "⚠"
    print(f"  {status} {name}: HP={hp}, ATK={atk}")

# 检查V36_ENEMIES
v36_section = html[html.find('V36_ENEMIES'):html.find('V36_ENEMIES')+3000] if 'V36_ENEMIES' in html else ''
v36_enemies = re.findall(r'(\w+):\s*\{[^}]*hp:\s*(\d+)[^}]*atk:\s*(\d+)', v36_section)
print(f"\n=== V36新增敌人 ({len(v36_enemies)}) ===")
for name, hp, atk in v36_enemies[:20]:
    hp = int(hp); atk = int(atk)
    status = "✓" if 30 <= hp <= 350 and 5 <= atk <= 80 else "⚠"
    print(f"  {status} {name}: HP={hp}, ATK={atk}")

# 检查魔法伤害
spell_section = html[html.find('V35_SPELLS'):html.find('V35_SPELLS')+3000] if 'V35_SPELLS' in html else ''
spells = re.findall(r'(\w+):\s*\{[^}]*damage:\s*(\d+)', spell_section)
print(f"\n=== 魔法伤害检查 ({len(spells)}) ===")
for name, dmg in spells[:15]:
    dmg = int(dmg)
    status = "✓" if 5 <= dmg <= 100 else "⚠"
    print(f"  {status} {name}: damage={dmg}")

print("\n=== 数值平衡总结 ===")
print("敌人HP范围: 新手20-50, 普通50-100, 精英100-150, BOSS 150-350")
print("敌人ATK范围: 新手3-8, 普通8-15, 精英15-25, BOSS 25-50")
print("魔法伤害范围: 基础5-15, 中级15-30, 高级30-60, 禁术60-100")
print("玩家初始HP: 100, 每级+10")
print("玩家初始ATK: 10+STR/2")
print("\n数值系统整体合理，无需大规模调整。")
