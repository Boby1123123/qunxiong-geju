#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向一：战斗触发集成（敌人数据补充+战前战后节点+剧情接入）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ========== 补充敌人数据 ==========
v36_enemies_js = r"""
/* ============================================================
   v36 补充敌人数据（七印守护者/暗蚀会/学院/势力/随机遭遇/终局BOSS）
   ============================================================ */
const V36_ENEMIES = {
  // ===== 七印守护者 =====
  seal_1_guardian: {id:"seal_1_guardian", name:"第一印守护者·石巨人", hp:120, maxHp:120, mp:30, atk:18, def:15, spd:8, skills:["heavy_smash","earth_quake","stone_skin"], status:[], aiType:"balanced", expReward:80, goldReward:50, loot:["earth_crystal"], desc:"沉睡千年的石巨人，守护着第一印的封印"},
  seal_2_corruptor: {id:"seal_2_corruptor", name:"第二印·深渊侵蚀者", hp:100, maxHp:100, mp:60, atk:22, def:10, spd:14, skills:["corruption_blast","dark_curse","life_drain"], status:[], aiType:"aggressive", expReward:90, goldReward:60, loot:["dark_crystal"], desc:"被深渊侵蚀的存在，身体不断扭曲变形"},
  seal_3_renegade: {id:"seal_3_renegade", name:"第三印·精灵叛逃者", hp:90, maxHp:90, mp:80, atk:16, def:12, spd:20, skills:["wind_blade","nature_wrath","heal_self"], status:[], aiType:"strategic", expReward:100, goldReward:70, loot:["wind_crystal","water_crystal"], desc:"背叛精灵族的古老法师，掌握着自然与风的力量"},
  seal_4_golem: {id:"seal_4_golem", name:"第四印·熔炉魔像", hp:150, maxHp:150, mp:20, atk:25, def:25, spd:5, skills:["lava_spew","molten_fist","overheat"], status:[], aiType:"aggressive", expReward:110, goldReward:80, loot:["fire_crystal","earth_essence"], desc:"永恒熔炉中诞生的魔像，全身流淌着岩浆"},
  seal_5_kraken: {id:"seal_5_kraken", name:"第五印·深海巨妖", hp:140, maxHp:140, mp:50, atk:20, def:18, spd:10, skills:["tentacle_whip","water_cannon","ink_cloud"], status:[], aiType:"balanced", expReward:120, goldReward:90, loot:["water_crystal","water_essence"], desc:"从深海苏醒的巨妖，触手足以撕裂战船"},
  seal_6_guardian: {id:"seal_6_guardian", name:"第六印·时光守卫", hp:110, maxHp:110, mp:100, atk:15, def:14, spd:25, skills:["time_stop","temporal_blade","rewind"], status:[], aiType:"strategic", expReward:130, goldReward:100, loot:["soul_crystal"], desc:"存在于时间夹缝中的守卫，能操控时间流速"},
  seal_7_projection: {id:"seal_7_projection", name:"第七印·原初之物投影", hp:200, maxHp:200, mp:150, atk:30, def:20, spd:15, skills:["primal_blast","reality_warp","cosmic_horror","annihilation"], status:[], aiType:"desperate", expReward:200, goldReward:200, loot:["soul_essence","light_essence","dark_essence"], desc:"原初之物在世间的投影，仅仅是存在就足以扭曲现实"},
  // ===== 暗蚀会敌人 =====
  eclipse_thug: {id:"eclipse_thug", name:"暗蚀会外围成员", hp:50, maxHp:50, mp:10, atk:12, def:8, spd:10, skills:["basic_attack","dirty_fight"], status:[], aiType:"aggressive", expReward:20, goldReward:15, loot:[], desc:"暗蚀会的底层打手，手段肮脏"},
  eclipse_officer: {id:"eclipse_officer", name:"暗蚀会骨干", hp:70, maxHp:70, mp:30, atk:16, def:10, spd:14, skills:["shadow_strike","dark_bolt","smoke_bomb"], status:[], aiType:"balanced", expReward:40, goldReward:30, loot:["dark_crystal"], desc:"暗蚀会的中层骨干，精通暗影魔法"},
  eclipse_director: {id:"eclipse_director", name:"暗蚀会司长", hp:100, maxHp:100, mp:60, atk:20, def:14, spd:16, skills:["shadow_assault","soul_drain","dark_nightmare","escape"], status:[], aiType:"strategic", expReward:80, goldReward:60, loot:["dark_crystal","dark_essence"], desc:"暗蚀会五司长之一，每一位都有着恐怖的实力"},
  eclipse_traitor: {id:"eclipse_traitor", name:"背叛者", hp:80, maxHp:80, mp:40, atk:18, def:12, spd:18, skills:["backstab","poison_blade","vanish"], status:[], aiType:"aggressive", expReward:60, goldReward:50, loot:[], desc:"曾经的同伴，如今刀刃相向"},
  eclipse_pope: {id:"eclipse_pope", name:"暗蚀之主", hp:250, maxHp:250, mp:200, atk:35, def:22, spd:18, skills:["abyss_gate","soul_destroy","dark_wave","eclipse_final"], status:[], aiType:"desperate", expReward:300, goldReward:500, loot:["dark_essence","soul_essence"], desc:"暗蚀会的创立者，追求深渊力量的极致"},
  // ===== 学院敌人 =====
  academy_duel: {id:"academy_duel", name:"同学（决斗）", hp:60, maxHp:60, mp:20, atk:14, def:10, spd:12, skills:["basic_attack","student_spell"], status:[], aiType:"balanced", expReward:15, goldReward:0, loot:[], desc:"学院中的同学，因矛盾而决斗"},
  library_guard: {id:"library_guard", name:"禁书区守卫", hp:80, maxHp:80, mp:10, atk:16, def:18, spd:8, skills:["heavy_smash","guard_stance"], status:[], aiType:"balanced", expReward:30, goldReward:20, loot:[], desc:"禁书区的魔法守卫，忠诚地执行着守护职责"},
  spy_professor: {id:"spy_professor", name:"卧底教授", hp:90, maxHp:90, mp:70, atk:18, def:14, spd:14, skills:["dark_bolt","shadow_strike","teleport","counter_spell"], status:[], aiType:"strategic", expReward:70, goldReward:80, loot:["dark_crystal"], desc:"隐藏在学院中的暗蚀会卧底，暴露后孤注一掷"},
  graduation_boss: {id:"graduation_boss", name:"毕业试炼·幻象", hp:120, maxHp:120, mp:80, atk:22, def:16, spd:16, skills:["illusion_strike","mind_break","reality_shatter"], status:[], aiType:"desperate", expReward:100, goldReward:100, loot:["soul_crystal"], desc:"毕业试炼中的终极幻象，考验学生的全部实力"},
  // ===== 势力敌人 =====
  inquisitor: {id:"inquisitor", name:"审判骑士", hp:90, maxHp:90, mp:30, atk:20, def:16, spd:12, skills:["holy_smite","shield_bash","purify"], status:[], aiType:"aggressive", expReward:50, goldReward:40, loot:["light_crystal"], desc:"教会的审判骑士，执行净化令的执行者"},
  orc_warrior: {id:"orc_warrior", name:"兽人战士", hp:100, maxHp:100, mp:5, atk:24, def:12, spd:10, skills:["war_cry","heavy_axe","berserk"], status:[], aiType:"aggressive", expReward:40, goldReward:25, loot:[], desc:"草原上的兽人战士，力量惊人"},
  empire_soldier: {id:"empire_soldier", name:"帝国士兵", hp:70, maxHp:70, mp:5, atk:15, def:14, spd:10, skills:["spear_thrust","shield_wall","formation"], status:[], aiType:"balanced", expReward:25, goldReward:20, loot:[], desc:"东部王国的正规军，训练有素"},
  dwarf_guard: {id:"dwarf_guard", name:"矮人守卫", hp:110, maxHp:110, mp:5, atk:18, def:22, spd:6, skills:["hammer_smash","stone_stance","defend"], status:[], aiType:"balanced", expReward:35, goldReward:30, loot:["earth_crystal"], desc:"铁峰堡的矮人守卫，坚不可摧"},
  elf_ranger: {id:"elf_ranger", name:"精灵游侠", hp:65, maxHp:65, mp:30, atk:17, def:10, spd:22, skills:["arrow_shot","wind_step","entangle"], status:[], aiType:"strategic", expReward:45, goldReward:35, loot:["wind_crystal"], desc:"银叶城的精灵游侠，箭无虚发"},
  abyss_cultist: {id:"abyss_cultist", name:"深渊狂信徒", hp:60, maxHp:60, mp:50, atk:14, def:8, spd:14, skills:["abyss_blast","mad_laughter","self_mutilate"], status:[], aiType:"desperate", expReward:35, goldReward:20, loot:["dark_crystal"], desc:"崇拜深渊的狂信徒，不惜以自身为祭品"},
  // ===== 随机遭遇敌人 =====
  bandit: {id:"bandit", name:"强盗", hp:45, maxHp:45, mp:0, atk:12, def:7, spd:12, skills:["basic_attack","steal"], status:[], aiType:"aggressive", expReward:15, goldReward:20, loot:[], desc:"拦路抢劫的强盗"},
  wolf: {id:"wolf", name:"野狼", hp:35, maxHp:35, mp:0, atk:10, def:5, spd:18, skills:["bite","howl"], status:[], aiType:"aggressive", expReward:10, goldReward:0, loot:[], desc:"荒野中的野狼"},
  giant_spider: {id:"giant_spider", name:"巨型蜘蛛", hp:50, maxHp:50, mp:10, atk:14, def:8, spd:16, skills:["poison_bite","web_shot"], status:[], aiType:"aggressive", expReward:20, goldReward:5, loot:[], desc:"洞穴中的巨型蜘蛛，带有剧毒"},
  skeleton: {id:"skeleton", name:"骷髅兵", hp:40, maxHp:40, mp:0, atk:11, def:10, spd:8, skills:["bone_strike","rusty_sword"], status:[], aiType:"balanced", expReward:15, goldReward:10, loot:[], desc:"古墓中复活的骷髅兵"},
  ghost: {id:"ghost", name:"怨灵", hp:55, maxHp:55, mp:40, atk:13, def:6, spd:20, skills:["soul_drain","haunt","phase"], status:[], aiType:"strategic", expReward:25, goldReward:15, loot:["soul_crystal"], desc:"徘徊不去的怨灵"},
  goblin: {id:"goblin", name:"哥布林", hp:30, maxHp:30, mp:5, atk:9, def:5, spd:14, skills:["basic_attack","sneak_attack"], status:[], aiType:"aggressive", expReward:8, goldReward:10, loot:[], desc:"狡猾的小型生物"},
  troll: {id:"troll", name:"巨魔", hp:120, maxHp:120, mp:0, atk:22, def:14, spd:6, skills:["smash","regenerate"], status:[], aiType:"aggressive", expReward:50, goldReward:30, loot:[], desc:"拥有再生能力的巨魔"},
  dark_knight: {id:"dark_knight", name:"暗黑骑士", hp:100, maxHp:100, mp:20, atk:22, def:18, spd:12, skills:["dark_slash","aura_of_dread","lifesteal"], status:[], aiType:"balanced", expReward:60, goldReward:50, loot:["dark_crystal"], desc:"堕落的骑士，被黑暗吞噬"},
  mimic: {id:"mimic", name:"宝箱怪", hp:70, maxHp:70, mp:10, atk:18, def:20, spd:4, skills:["bite","trap","treasure_lure"], status:[], aiType:"strategic", expReward:40, goldReward:80, loot:[], desc:"伪装成宝箱的怪物"},
  slime: {id:"slime", name:"史莱姆", hp:25, maxHp:25, mp:5, atk:6, def:8, spd:5, skills:["acid_splash","divide"], status:[], aiType:"balanced", expReward:5, goldReward:3, loot:[], desc:"最常见的低级怪物"},
  // ===== 终局BOSS =====
  final_boss_seal: {id:"final_boss_seal", name:"七印崩坏·混沌之主", hp:300, maxHp:300, mp:200, atk:40, def:25, spd:18, skills:["chaos_blast","seal_break","reality_collapse","final_judgment"], status:[], aiType:"desperate", expReward:500, goldReward:1000, loot:["soul_essence","light_essence","dark_essence"], desc:"七印全部崩坏后诞生的混沌之主"},
  final_boss_eclipse: {id:"final_boss_eclipse", name:"暗蚀之主·完全体", hp:280, maxHp:280, mp:250, atk:38, def:22, spd:20, skills:["abyss_empowered","soul_annihilate","dark_dimension","eclipse_end"], status:[], aiType:"desperate", expReward:500, goldReward:800, loot:["dark_essence","soul_essence"], desc:"与深渊完全融合的暗蚀之主"},
  final_boss_coexist: {id:"final_boss_coexist", name:"共存试炼·自我", hp:250, maxHp:250, mp:200, atk:35, def:24, spd:22, skills:["mirror_strike","self_doubt","inner_demon","transcendence"], status:[], aiType:"strategic", expReward:500, goldReward:600, loot:["soul_essence"], desc:"共存路线的最终试炼——战胜另一个自己"}
};

// 合并到v35敌人池
for (const eid in V36_ENEMIES) {
  if (!V35_ENEMIES[eid]) V35_ENEMIES[eid] = V36_ENEMIES[eid];
}
console.log('[V36] 补充敌人数据: ' + Object.keys(V36_ENEMIES).length + ' 个');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_enemies_js + '\n' + html[script_end:]
    print("✓ v36补充敌人数据已插入（35个新敌人）")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
