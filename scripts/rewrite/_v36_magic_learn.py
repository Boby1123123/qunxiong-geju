#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向二：魔法学习途径（学院课程/导师传授/秘籍遗迹）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v36_magic_learn = r"""
/* ============================================================
   v36 魔法学习途径节点
   ============================================================ */

// ===== 学院魔法课程枢纽 =====
N["academy_magic_class"] = function(){ return {
  text:function(){return [
    "学院的魔法课程在元素塔中进行。七系魔法各有专属的教室，每间教室都配备了防护结界和练习用的假人。",
    "你站在元素塔的大厅里，看着各系教室的门牌。今天可以选择旁听或正式上课。"
  ];},
  place:"艾尔达大陆学院·元素塔",
  options:[
    {t:"火系魔法教室", go:"class_fire_intro", effect:{time:1}},
    {t:"水系魔法教室", go:"class_water_intro", effect:{time:1}},
    {t:"风系魔法教室", go:"class_wind_intro", effect:{time:1}},
    {t:"土系魔法教室", go:"class_earth_intro", effect:{time:1}},
    {t:"光系神学教室", go:"class_light_intro", effect:{time:1}},
    {t:"暗系理论教室（禁书区旁）", go:"class_dark_intro", effect:{time:1, san:-5}},
    {t:"灵魂魔法研究室（墨丘利专属）", go:"class_soul_intro", effect:{time:1}},
    {t:"离开元素塔", go:"academy_main", effect:{}}
  ]
};}

// ===== 火系课程 =====
N["class_fire_intro"] = function(){ return {
  text:function(){return [
    "火系教室像一个巨大的壁炉。墙壁上刻满了火焰符文，温度比外面高了不少。",
    "授课的是一位头发花白的老教授，他的指尖跳动着一团火焰。",
    "「火系魔法的核心，是让你的魔力与火焰共鸣。感受它的热情，它的毁灭欲——然后控制它。」",
    "他看向你：「新来的？上来试试。」"
  ];},
  options:[
    {t:"尝试凝聚火球（INT×3判定）", go:"class_fire_learn", effect:{}},
    {t:"认真听讲，做笔记", go:"class_fire_study", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_fire_learn"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    var target = int*3;
    if(roll <= target){
      v35_learnSpell("fire_spark");
      v35_learnSpell("fire_fireball");
      return [
        "你闭上眼睛，感受体内的魔力。它像一股暖流，顺着手臂涌向指尖。",
        "「就是这样！」教授喊道。",
        "一团火焰在你掌心绽放，虽然不大，但确实是真正的火焰。",
        "教授满意地点头：「不错，不错。你已经掌握了火花术和火球术的基础。」",
        "◆学会魔法：火花术、火球术",
        "◆火系魔法经验+10"
      ];
    } else if(roll <= target+20){
      return [
        "你努力尝试，但魔力总是在最后一刻散开。",
        "教授皱了皱眉：「魔力控制还不够。多练习，下次再来。」",
        "虽然没学会，但你对火系魔法有了更深的理解。",
        "◆火系魔法经验+5"
      ];
    } else {
      return [
        "你太急躁了，魔力失控，一团黑烟从你指尖冒出，呛得你直咳嗽。",
        "同学们发出笑声。教授无奈地摇头：「控制，控制！火系魔法最忌急躁。」",
        "◆HP-5，SAN-3"
      ];
    }
  },
  options:[
    {t:"继续练习", go:"class_fire_study", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{time:1}}
  ]
};}

N["class_fire_study"] = function(){ return {
  text:function(){return [
    "你认真地听教授讲解火系魔法的原理，做了满满几页笔记。",
    "「火焰的本质是能量的释放。每一个火球术，都是将魔力转化为热能的过程……」",
    "下课后，你感觉对火系魔法的理解加深了。",
    "◆火系魔法经验+10"
  ];},
  options:[{t:"返回元素塔大厅", go:"academy_magic_class", effect:{}}]
};}

// ===== 水系课程 =====
N["class_water_intro"] = function(){ return {
  text:function(){return [
    "水系教室弥漫着潮湿的气息。墙壁上有水流顺着符文缓缓流动，形成了一个微型瀑布。",
    "授课的是一位气质温和的女教授，她的声音像溪水一样清澈。",
    "「水系魔法的核心，是柔韧。水可以滋养万物，也可以穿透岩石。不要抗拒，要引导。」"
  ];},
  options:[
    {t:"尝试凝聚水弹（INT×3判定）", go:"class_water_learn", effect:{}},
    {t:"学习治疗术", go:"class_water_heal", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_water_learn"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= int*3){
      v35_learnSpell("water_bolt");
      v35_learnSpell("water_heal");
      return [
        "你将魔力注入空气中的水分子，它们开始聚集，在你掌心形成了一个水球。",
        "「很好！」女教授微笑，「你已经掌握了水弹术。再试试将水注入伤口——这就是治疗术的基础。」",
        "你试着将水球贴在手上的小伤口上，清凉的感觉传来，伤口真的在愈合。",
        "◆学会魔法：水弹术、治疗术",
        "◆水系魔法经验+10"
      ];
    }
    return ["你尝试了很久，但水分子总是不听话。教授说：「别急，水系魔法需要耐心。」", "◆水系魔法经验+5"];
  },
  options:[{t:"返回元素塔大厅", go:"academy_magic_class", effect:{time:1}}]
};}

N["class_water_heal"] = function(){ return {
  text:function(){return [
    "教授详细讲解了治疗术的原理：将水属性魔力注入伤口，加速细胞再生。",
    "「记住，治疗术不能治愈一切。灵魂的创伤、诅咒、深渊侵蚀——这些都需要更高级的魔法。」",
    "你认真练习，感觉治疗术的掌握更熟练了。",
    "◆水系魔法经验+10"
  ];},
  options:[{t:"返回", go:"academy_magic_class", effect:{}}]
};}

// ===== 风系课程 =====
N["class_wind_intro"] = function(){ return {
  text:function(){return [
    "风系教室在元素塔的最高层，窗户大开，风呼呼地吹进来。",
    "授课的是一位身形瘦削的教授，他说话时语速极快，像风一样。",
    "「风系魔法的核心，是速度。风无处不在，你要做的就是成为风的一部分。」"
  ];},
  options:[
    {t:"尝试风刃术（AGI×3判定）", go:"class_wind_learn", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_wind_learn"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= agi*3){
      v35_learnSpell("wind_gust");
      v35_learnSpell("wind_lightning");
      return [
        "你深吸一口气，将魔力与周围的风融合。",
        "几道风刃从你掌心射出，在墙壁上留下了浅浅的刻痕。",
        "教授吹了声口哨：「不错！风刃术已经成型了。再试试引动雷元素——风与雷本是一家。」",
        "一道细小的闪电在你指尖跳跃。",
        "◆学会魔法：风刃术、闪电术",
        "◆风系魔法经验+10"
      ];
    }
    return ["风吹得你睁不开眼，魔力完全无法凝聚。教授说：「感受风，不要对抗风。」", "◆风系魔法经验+5"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 土系课程 =====
N["class_earth_intro"] = function(){ return {
  text:function(){return [
    "土系教室在地下一层，墙壁是裸露的岩石，地面上散落着各种矿石。",
    "授课的是一位身材魁梧的教授，声音像石头一样厚重。",
    "「土系魔法的核心，是稳固。脚下的大地永远不会欺骗你——只要你足够坚定。」"
  ];},
  options:[
    {t:"尝试石弹术（CON×3判定）", go:"class_earth_learn", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_earth_learn"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= con*3){
      v35_learnSpell("earth_shot");
      v35_learnSpell("earth_wall");
      return [
        "你将手按在地面上，感受大地的脉动。",
        "一颗石弹从地面升起，悬浮在你面前。你一挥手，它飞了出去，砸在墙上碎成粉末。",
        "教授点头：「很好。再试试土墙——防御是土系的根本。」",
        "一面石墙从地面升起，虽然粗糙，但确实挡住了教授的测试攻击。",
        "◆学会魔法：石弹术、土墙术",
        "◆土系魔法经验+10"
      ];
    }
    return ["大地的脉动太沉重了，你无法跟上。教授说：「站稳，深呼吸，感受大地。」", "◆土系魔法经验+5"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 光系课程 =====
N["class_light_intro"] = function(){ return {
  text:function(){return [
    "光系教室充满了柔和的金色光芒。墙上挂着光明神的圣像，空气中弥漫着焚香的味道。",
    "授课的是一位教会派来的神父教授，他的态度庄重而严格。",
    "「光系魔法的核心，是信仰。只有内心纯净之人，才能引导光明的力量。」",
    "他看了看你：「你……有信仰吗？」"
  ];},
  options:[
    {t:"我信仰光明神（SPR×3判定）", go:"class_light_learn", effect:{}},
    {t:"我只是来学魔法的", go:"class_light_skeptic", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_light_learn"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      v35_learnSpell("light_ray");
      v35_learnSpell("light_blessing");
      return [
        "你闭上眼睛祈祷。一股温暖的力量从上方注入你的身体。",
        "金色的光芒在你掌心凝聚，圣洁而温暖。",
        "神父教授露出了微笑：「光明神眷顾你。你已经掌握了光线术和祝福术。」",
        "◆学会魔法：光线术、祝福术",
        "◆光系魔法经验+10，教会声望+5"
      ];
    }
    return ["你的祈祷没有得到回应。神父教授摇头：「信仰不够坚定。」", "◆光系魔法经验+3"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

N["class_light_skeptic"] = function(){ return {
  text:function(){return [
    "神父教授的脸色沉了下来。",
    "「没有信仰，就没有光明。你走吧，这里不欢迎无神论者。」",
    "他挥了挥手，示意你离开。虽然被赶了出来，但你注意到他的书桌上有一本被锁起来的古籍——封面上写着《光与暗的真相》。",
    "◆光系魔法学习被拒绝，但发现了可疑的古籍"
  ];},
  options:[
    {t:"找机会偷那本古籍", go:"academy_forbidden_section", effect:{time:1, flag:"light_secret_found"}},
    {t:"离开", go:"academy_magic_class", effect:{}}
  ]
};}

// ===== 暗系课程 =====
N["class_dark_intro"] = function(){ return {
  text:function(){return [
    "暗系教室在禁书区旁边，门是黑色的，上面刻着各种诡异的符文。",
    "教室里没有点灯，只有几支蜡烛发出幽绿的光。",
    "授课的是一位总是戴着兜帽的教授，你看不清他的脸。",
    "「暗系魔法……不被教会认可，但它是最真实的魔法。光明会撒谎，黑暗不会。」",
    "他的声音低沉而沙哑：「想学？做好付出代价的准备了吗？」"
  ];},
  options:[
    {t:"我准备好了（SPR×3判定，有SAN代价）", go:"class_dark_learn", effect:{}},
    {t:"这太危险了，离开", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_dark_learn"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      v35_learnSpell("dark_bolt");
      v35_learnSpell("dark_curse");
      return [
        "你将魔力注入黑暗。黑暗开始蠕动，像活物一样缠绕上你的手臂。",
        "一股寒意从脊椎升起。你看到了……一些不该看到的东西。",
        "兜帽教授点头：「很好。暗影弹和诅咒术——这只是开始。」",
        "「记住，暗系魔法的代价是你的理智。每一次使用，都在向深渊靠近一步。」",
        "◆学会魔法：暗影弹、诅咒术",
        "◆暗系魔法经验+10，SAN-10，暗蚀会声望+5"
      ];
    }
    return ["黑暗吞噬了你的魔力，你感到一阵眩晕。教授说：「意志不够坚定。下次再来。」", "◆SAN-5，暗系魔法经验+3"];
  },
  options:[{t:"离开（需要新鲜空气）", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 灵魂魔法（墨丘利私授）=====
N["class_soul_intro"] = function(){ return {
  text:function(){return [
    "灵魂魔法研究室在元素塔的最顶层，门上刻着墨丘利的私人印记。",
    "你敲了敲门。门开了，墨丘利站在里面，手里拿着一本古老的书籍。",
    "「你来了。」他推了推眼镜，「灵魂魔法是最危险也最强大的魔法。它不操控元素，它操控——灵魂本身。」",
    "「你确定要学吗？这不是普通学生能接触的东西。」"
  ];},
  options:[
    {t:"我确定（需墨丘利好感≥50）", go:"class_soul_learn", effect:{}},
    {t:"我再想想", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_soul_learn"] = function(){ return {
  text:function(){
    var mercuryRel = S.relations ? (S.relations.mercury || 0) : 0;
    if(mercuryRel < 50){
      return [
        "墨丘利看了你一眼，摇了摇头。",
        "「我们还不够熟。灵魂魔法需要绝对的信任——我不能把这么危险的东西交给一个不够了解的人。」",
        "「先多来聊聊，等我们更熟悉了再说。」",
        "◆墨丘利好感不足（需要≥50）"
      ];
    }
    v35_learnSpell("soul_sight");
    return [
      "墨丘利沉默了片刻，然后点了点头。",
      "「好。我教你最基础的——灵魂视觉。它能让你看到事物的灵魂本质。」",
      "他将手按在你的额头上。一股清凉的力量注入你的意识。",
      "世界在你眼中变了。你看到了墨丘利的灵魂——它被层层迷雾包裹，深处有什么东西在闪烁。",
      "「不要看得太深。」他收回手，「有些真相，知道了就无法回头。」",
      "◆学会魔法：灵魂视觉",
      "◆灵魂系魔法经验+10，SAN-5"
    ];
  },
  options:[{t:"离开研究室", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 秘籍学习 =====
N["magic_scroll_study"] = function(){ return {
  text:function(){return [
    "你展开了一张古老的魔法卷轴。羊皮纸上的符文闪烁着微光，散发着古老的魔力。",
    "卷轴上记载着一个失传的魔法。你需要集中精神，解读这些符文。"
  ];},
  options:[
    {t:"专注解读（INT×4判定）", go:"magic_scroll_result", effect:{time:2}},
    {t:"放弃，太难了", go:"city_free", effect:{}}
  ]
};}

N["magic_scroll_result"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= int*4){
      v35_learnSpell("fire_meteor");
      return [
        "符文在你眼前重组，它们的含义逐渐清晰。",
        "这是一个高阶火系魔法——陨石术。你将魔力按照符文的引导释放，天空中真的出现了一颗燃烧的陨石！",
        "虽然只是小型的，但这确实是陨石术的雏形。",
        "◆学会魔法：陨石术",
        "◆卷轴化为灰烬"
      ];
    }
    return ["符文太复杂了，你解读了两天也只看懂了三分之一。卷轴的魔力正在消散。", "◆卷轴失效，INT经验+5"];
  },
  options:[{t:"继续", go:"city_free", effect:{time:1}}]
};}

console.log('[V36] 魔法学习途径节点已加载（学院七系课程+导师+秘籍）');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_magic_learn + '\n' + html[script_end:]
    print("✓ v36魔法学习途径节点已插入")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
