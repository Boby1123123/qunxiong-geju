#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 战斗触发节点（战前/战后叙事+通用战斗结果处理）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v36_battle_nodes = r"""
/* ============================================================
   v36 战斗触发节点（战前/战后叙事）
   ============================================================ */

// 通用战斗结果处理：根据v35战斗结果跳转
function v36_battleResult(nextVictory, nextDefeat, nextFlee) {
  if (!V35_BATTLE.result) return nextDefeat;
  if (V35_BATTLE.result === "victory") return nextVictory;
  if (V35_BATTLE.result === "flee") return nextFlee || nextDefeat;
  return nextDefeat;
}

// ===== 七印线战斗 =====
N["battle_seal1_intro"] = function(){ return {
  text:function(){return [
    "第一印的封印之地在地下深处。当你踏入最内层的石室时，地面开始震动。",
    "石巨人从沉睡中苏醒。它的身体由千年的岩石和符文构成，每一步都让大地颤抖。",
    "「入侵者……封印……不可……触碰……」它的声音像是山石摩擦，缓慢而沉重。",
    "你握紧了武器。这一战，无法避免。"
  ];},
  place:"第一印封印地",
  options:[
    {t:"正面迎战", go:"battle_seal1_fight", effect:{}},
    {t:"尝试沟通（需高SPR）", go:"battle_seal1_talk", effect:{}},
    {t:"寻找弱点（需高INT）", go:"battle_seal1_analyze", effect:{}}
  ]
};}

N["battle_seal1_fight"] = function(){ return {
  text:function(){return ["你深吸一口气，向石巨人发起了冲锋！"];},
  options:[{t:"开始战斗", go:"battle_start_seal1_guardian", effect:{}}]
};}

N["battle_start_seal1_guardian"] = function(){
  v35_initBattle("seal_1_guardian");
  return {text:"战斗开始！", options:[]};
};

N["battle_seal1_victory"] = function(){ return {
  text:function(){return [
    "石巨人的身体出现了无数裂痕，符文一个个熄灭。",
    "它缓缓跪下，石头的脸上似乎露出了一丝解脱。",
    "「千年……的守护……终于……可以……休息了……」",
    "随着最后一声轰鸣，石巨人化为一堆碎石。第一印的封印完全暴露在你面前。",
    "◆获得经验+80，金币+50，土晶石×1"
  ];},
  place:"第一印封印地",
  options:[
    {t:"查看第一印", go:"seal_1_explore", effect:{exp:80, gold:50, time:1}},
    {t:"先恢复状态", go:"battle_seal1_rest", effect:{}}
  ]
};}

N["battle_seal1_defeat"] = function(){ return {
  text:function(){return [
    "石巨人的拳头砸在你身上，你感觉骨头都要碎了。",
    "意识模糊之际，你似乎看到一个身影冲了进来，将你拖离了战场。",
    "醒来时，你已经在封印地之外。身上的伤口被简单处理过，但第一印的探索不得不暂缓。",
    "◆HP降至10，损失部分金币"
  ];},
  place:"第一印封印地外",
  options:[
    {t:"养好伤再来", go:"city_free", effect:{hp:10, gold:-20, time:3}},
    {t:"不甘心，再试一次", go:"battle_seal1_intro", effect:{time:1}}
  ]
};}

N["battle_seal1_talk"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    if(spr >= 15){
      return [
        "你静下心来，用灵魂感知去触碰石巨人的意识。",
        "它不是敌人，而是一个被诅咒守护了千年的灵魂。它累了，却无法停止。",
        "「你……能听到……我？」它的声音里带着不可思议。",
        "你点头。石巨人沉默了很久。",
        "「那……帮我……解脱吧……但不是用战斗……用你的……灵魂之力……」",
        "◆石巨人愿意让开道路，无需战斗"
      ];
    }
    return [
      "你试图与石巨人沟通，但它的意识太过古老和混沌，你无法理解它在说什么。",
      "它把你的接近视为威胁，举起了拳头。"
    ];
  },
  options:[
    {t:"用灵魂之力帮它解脱（需灵魂魔法）", go:"seal_1_explore", effect:{san:-10, time:1}},
    {t:"还是战斗吧", go:"battle_seal1_fight", effect:{}}
  ]
};}

N["battle_seal1_analyze"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    if(int >= 15){
      return [
        "你仔细观察石巨人的行动模式。它的力量虽然强大，但动作缓慢。",
        "更重要的是，你发现它胸口的符文是力量核心——如果能击中那里……",
        "◆发现弱点：下次战斗伤害+50%"
      ];
    }
    return ["你观察了半天，但没发现什么明显的弱点。"];
  },
  options:[{t:"开始战斗", go:"battle_seal1_fight", effect:{}}]
};}

N["battle_seal1_rest"] = function(){ return {
  text:function(){return [
    "你靠在石壁上，服用了恢复药剂。伤口慢慢愈合，体力逐渐恢复。",
    "石室里很安静，只有符文微弱的光芒在闪烁。"
  ];},
  options:[{t:"继续探索第一印", go:"seal_1_explore", effect:{hp:30, mp:20, time:1}}]
};}

// ===== 暗蚀会战斗 =====
N["battle_eclipse_intro"] = function(){ return {
  text:function(){return [
    "暗巷里，三个身影拦住了你的去路。",
    "灰袍，面具，腰间的短刀泛着幽光——暗蚀会的人。",
    "「有人出了大价钱要买你的消息。」为首的人声音沙哑，「乖乖跟我们走，或者……」",
    "他亮出了刀。"
  ];},
  place:"暗巷",
  options:[
    {t:"拔刀迎战", go:"battle_eclipse_fight", effect:{}},
    {t:"试图谈判（需高CHA）", go:"battle_eclipse_talk", effect:{}},
    {t:"转身逃跑", go:"battle_eclipse_flee", effect:{}}
  ]
};}

N["battle_eclipse_fight"] = function(){ return {
  text:function(){return ["你拔出武器，三个暗蚀会成员同时扑了上来！"];},
  options:[{t:"开始战斗", go:"battle_start_eclipse_thug", effect:{}}]
};}

N["battle_start_eclipse_thug"] = function(){
  v35_initBattle("eclipse_thug");
  return {text:"战斗开始！", options:[]};
};

N["battle_eclipse_victory"] = function(){ return {
  text:function(){return [
    "三个暗蚀会成员倒在地上，两个昏了过去，一个捂着伤口瞪着你。",
    "「你等着……暗蚀会不会放过你……」他撂下狠话，连滚带爬地跑了。",
    "你搜了搜昏倒两人的身，找到了一些金币和一封密信。",
    "◆获得经验+20，金币+15，暗蚀会密信×1"
  ];},
  options:[
    {t:"查看密信", go:"eclipse_intro", effect:{exp:20, gold:15, flag:"eclipse_encountered", time:1}},
    {t:"离开这里", go:"city_free", effect:{exp:20, gold:15, time:1}}
  ]
};}

N["battle_eclipse_defeat"] = function(){ return {
  text:function(){return [
    "寡不敌众，你被击倒在地。",
    "他们搜走了你身上的金币，又打了你一顿，才扬长而去。",
    "「算你命大。下次就不是这么简单了。」",
    "你躺在冰冷的巷子里，过了很久才勉强爬起来。",
    "◆HP降至5，金币-30，暗蚀会声望-10"
  ];},
  options:[{t:"艰难地离开", go:"city_free", effect:{hp:5, gold:-30, time:2}}]
};}

N["battle_eclipse_talk"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    if(cha >= 15){
      return [
        "你举起双手，表示没有敌意。",
        "「各位，我们或许可以谈谈。你们要的是钱，我这里有比金币更有价值的东西。」",
        "你抛出了一些半真半假的情报。为首的人犹豫了。",
        "「……你很聪明。这次算了，但下次——」他挥了挥手，三人消失在暗处。",
        "◆避免了战斗，暗蚀会对你产生了兴趣"
      ];
    }
    return ["你的谈判没有奏效，他们只认刀子。"];
  },
  options:[
    {t:"趁机离开", go:"city_free", effect:{flag:"eclipse_interested", time:1}},
    {t:"还是打吧", go:"battle_eclipse_fight", effect:{}}
  ]
};}

N["battle_eclipse_flee"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    if(agi >= 14){
      return ["你转身就跑，凭借敏捷的身手甩掉了追兵。虽然有些狼狈，但至少没受伤。"];
    }
    return ["你试图逃跑，但他们比你想象的更快。一把刀架在了你的脖子上。"];
  },
  options:[
    {t:"甩掉了追兵（成功）", go:"city_free", effect:{time:1}},
    {t:"被抓住了", go:"battle_eclipse_fight", effect:{}}
  ]
};}

// ===== 学院决斗 =====
N["battle_academy_duel_intro"] = function(){ return {
  text:function(){return [
    "学院的决斗场上，围满了看热闹的学生。",
    "你的对手是一个高年级学生，因为一些矛盾向你发起了决斗挑战。",
    "「新生，别以为有点天赋就可以嚣张。今天我就让你知道什么叫规矩。」",
    "他活动着手腕，魔力在掌心凝聚。"
  ];},
  place:"学院决斗场",
  options:[
    {t:"接受决斗", go:"battle_academy_duel_fight", effect:{}},
    {t:"道歉认输", go:"battle_academy_duel_lose", effect:{}}
  ]
};}

N["battle_academy_duel_fight"] = function(){ return {
  text:function(){return ["裁判举起了手——「决斗开始！」"];},
  options:[{t:"开始战斗", go:"battle_start_academy_duel", effect:{}}]
};}

N["battle_start_academy_duel"] = function(){
  v35_initBattle("academy_duel");
  return {text:"战斗开始！", options:[]};
};

N["battle_academy_duel_victory"] = function(){ return {
  text:function(){return [
    "你的对手倒在决斗场上，难以置信地看着你。",
    "围观的学生爆发出欢呼声。一个新生击败了高年级学生——这在学院可不常见。",
    "「……你赢了。」他爬起来，拍了拍身上的灰，「我记住你了。」",
    "他的语气里没有怨恨，反而有一丝认可。",
    "◆获得经验+15，学院声望+10"
  ];},
  options:[{t:"离开决斗场", go:"academy_main", effect:{exp:15, rep_academy:10, time:1}}]
};}

N["battle_academy_duel_defeat"] = function(){ return {
  text:function(){return [
    "你被击倒在地，对手的魔法在你面前停下。",
    "「差远了，新生。」他转身离开，围观的学生发出嘘声。",
    "虽然输了，但你从这场战斗中学到了不少。",
    "◆获得经验+5，学院声望-5"
  ];},
  options:[{t:"离开决斗场", go:"academy_main", effect:{exp:5, rep_academy:-5, hp:20, time:1}}]
};}

N["battle_academy_duel_lose"] = function(){ return {
  text:function(){return [
    "你选择了道歉。对手冷哼一声，觉得没意思，带着人走了。",
    "围观的学生有些失望地散开了。虽然没丢面子，但也没赢得尊重。",
    "◆学院声望-3"
  ];},
  options:[{t:"离开", go:"academy_main", effect:{rep_academy:-3, time:0}}]
};}

// ===== 通用战斗入口（从剧情节点调用） =====
N["battle_encounter_bandit"] = function(){ return {
  text:function(){return [
    "路边的树丛里突然跳出几个强盗，挥舞着武器拦住了你的去路。",
    "「此路是我开！留下买路财！」"
  ];},
  options:[
    {t:"战斗", go:"battle_start_bandit", effect:{}},
    {t:"给钱消灾（-20金币）", go:"city_free", effect:{gold:-20, time:1}},
    {t:"试图逃跑", go:"battle_flee_check", effect:{}}
  ]
};}

N["battle_start_bandit"] = function(){
  v35_initBattle("bandit");
  return {text:"战斗开始！", options:[]};
};

N["battle_flee_check"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    if(Math.random()*100 < agi*3){
      return ["你凭借敏捷的身手甩掉了强盗，虽然跑得有些气喘。"];
    }
    return ["你没跑掉，强盗追上了你！"];
  },
  options:[
    {t:"成功逃脱", go:"city_free", effect:{time:1}},
    {t:"被迫战斗", go:"battle_start_bandit", effect:{}}
  ]
};}

N["battle_generic_victory"] = function(){ return {
  text:function(){return [
    "敌人倒下了。你喘着粗气，检查了一下自己的伤势。",
    "战斗结束，世界重新安静下来。"
  ];},
  options:[{t:"继续", go:"city_free", effect:{time:1}}]
};}

N["battle_generic_defeat"] = function(){ return {
  text:function(){return [
    "你被击败了。意识模糊之际，似乎有人把你拖到了安全的地方。",
    "醒来时，你发现自己躺在路边，身上的金币少了一些。",
    "◆HP降至10，金币-15"
  ];},
  options:[{t:"继续前行", go:"city_free", effect:{hp:10, gold:-15, time:2}}]
};}

console.log('[V36] 战斗触发节点已加载（七印/暗蚀会/学院/随机遭遇）');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_battle_nodes + '\n' + html[script_end:]
    print("✓ v36战斗触发节点已插入")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
