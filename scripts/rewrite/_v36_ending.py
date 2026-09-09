#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向八：结局线联动补充（势力/伏笔/选择影响结局）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v36_ending = r"""
/* ============================================================
   v36 结局线联动补充
   ============================================================ */

// ===== 终局前·选择回顾（确保所有选择影响结局）=====
N["ending_v36_review"] = function(){ return {
  text:function(){
    var arr = [];
    arr.push("【终局将至】");
    arr.push("");
    arr.push("你站在命运的十字路口。回望过去，你做过的每一个选择，都在塑造这个结局。");
    arr.push("");
    
    // 势力回顾
    if(S.flags && S.flags.joined_light_church) arr.push("◆你加入了光明教会——教会将在终局中为你提供审判骑士的支援。");
    if(S.flags && S.flags.joined_eclipse_society) arr.push("◆你加入了暗蚀会——暗蚀会将在终局中成为你的盟友或敌人。");
    if(S.flags && S.flags.joined_watchers) arr.push("◆你加入了守望者——守望者将在终局中为你提供真相和情报。");
    if(S.flags && S.flags.joined_empire) arr.push("◆你加入了东部王国——帝国军队将在终局中支援你。");
    if(S.flags && S.flags.joined_free_cities) arr.push("◆你加入了自由城邦——商会将在终局中为你提供资金和物资。");
    if(S.flags && S.flags.joined_elf_kingdom) arr.push("◆你加入了精灵王国——精灵弓箭手将在终局中支援你。");
    if(S.flags && S.flags.joined_dwarf_kingdom) arr.push("◆你加入了矮人王国——矮人战士和锻造师将在终局中支援你。");
    if(S.flags && S.flags.joined_orc_horde) arr.push("◆你加入了兽人王庭——兽人战士将在终局中与你并肩作战。");
    if(S.flags && S.flags.joined_abyss_cult) arr.push("◆你加入了深渊教派——深渊的力量将在终局中流淌在你的血脉中。");
    
    arr.push("");
    
    // 伏笔回顾
    if(S.foreshadowing && S.foreshadowing.hlj_letter) arr.push("◆黄林晶的信——你知道了七印的真相。");
    if(S.foreshadowing && S.foreshadowing.watcher_spy) arr.push("◆守望者的观察——你被守望者标记为关键人物。");
    if(S.foreshadowing && S.foreshadowing.seal_fragment) arr.push("◆第一印的碎块——你与七印有了特殊的联系。");
    
    arr.push("");
    arr.push("你的选择，决定了这个世界的未来。");
    arr.push("");
    arr.push("你准备好了吗？");
    
    return arr;
  },
  options:[
    {t:"我准备好了，迎接终局", go:"final_battle", effect:{}},
    {t:"再看一眼这个世界", go:"city_free", effect:{}}
  ]
};}

// ===== 势力结局·光明教会 =====
N["ending_v36_church"] = function(){ return {
  text:function(){return [
    "【结局：圣光永存】",
    "",
    "你带领光明教会的审判骑士，净化了深渊的侵蚀。七印被修复，原初之物重新沉睡。",
    "教会将你封为圣徒，你的事迹被写入圣经。每年的这一天，信徒们都会点燃蜡烛，纪念你的功绩。",
    "但你知道——光明的背后，总有阴影。而你，将永远守护这道光。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入光明教会：审判骑士在终战中发挥了关键作用",
    "◆信仰坚定：你的祈祷在最黑暗的时刻带来了光明",
    "",
    "【世界状态】",
    "七印：修复 ✓",
    "深渊：被净化 ✓",
    "教会：成为大陆最强大的势力",
    "你的名声：圣徒，永远被铭记"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 势力结局·暗蚀会 =====
N["ending_v36_eclipse"] = function(){ return {
  text:function(){return [
    "【结局：暗蚀降临】",
    "",
    "你和暗蚀会一起，打破了七印的枷锁。原初之物苏醒了——它们不是恶魔，是被囚禁了万年的古神。",
    "世界陷入了混乱，但也获得了真正的自由。教会的统治崩塌了，新的时代开始了。",
    "你成为了暗蚀会的领袖，站在原初之物的身旁。有人说你是救世主，有人说你是灭世者。",
    "但你知道——你只是给了这个世界一个选择的机会。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入暗蚀会：你获得了打破七印的力量和情报",
    "◆接受深渊之力：你能与原初之物沟通",
    "",
    "【世界状态】",
    "七印：破碎 ✓",
    "原初之物：苏醒 ✓",
    "教会：衰落",
    "你的名声：暗蚀之主，争议中的救世主"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 势力结局·守望者 =====
N["ending_v36_watcher"] = function(){ return {
  text:function(){return [
    "【结局：永恒的观察者】",
    "",
    "你没有选择封印，也没有选择解放。你选择了第三条路——理解。",
    "你理解了七印的真相，理解了原初之物的悲哀，理解了教会的虚伪和暗蚀会的极端。",
    "你成为了新的守望者领袖，在光明与黑暗之间维持平衡。世界没有完美的结局，但你让它避免了最坏的结局。",
    "你将继续观察、记录、守护——直到时间的尽头。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入守望者：你获得了三千年的真相和智慧",
    "◆拒绝极端：你在所有势力之间保持了独立",
    "",
    "【世界状态】",
    "七印：维持现状（缓慢修复）",
    "深渊：被监控",
    "所有势力：平衡共存",
    "你的名声：守望者之主，被遗忘的守护者"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 游戏结束 =====
N["game_over"] = function(){ return {
  text:function(){return [
    "【游戏结束】",
    "",
    "感谢你游玩《艾尔达大陆：群雄割据》。",
    "",
    "你的故事已经结束，但这个世界还在继续。也许，在另一个平行世界里，另一个你会做出不同的选择，经历不同的故事。",
    "",
    "【你可以】",
    "◆开始新游戏，体验不同的出身、不同的选择、不同的结局",
    "◆查看编年史，回顾你在这个世界留下的痕迹",
    "",
    "——艾尔达大陆，永远等待着新的冒险者。"
  ];},
  options:[
    {t:"开始新游戏", go:"title_screen", effect:{}},
    {t:"查看编年史", go:"chronicle_main", effect:{}}
  ]
};}

console.log('[V36] 结局线联动补充已加载（选择回顾+3势力结局+游戏结束）');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_ending + '\n' + html[script_end:]
    print("✓ v36结局线联动补充已插入（选择回顾+3势力结局+游戏结束）")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
