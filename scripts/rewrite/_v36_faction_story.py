#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向三：9大势力加入剧情线（每势力4节点）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v36_faction_story = r"""
/* ============================================================
   v36 9大势力加入剧情线
   ============================================================ */

// ===== 势力招募枢纽 =====
N["faction_recruit_hub"] = function(){ return {
  text:function(){return [
    "大陆上的各大势力都在招募有天赋的年轻人。你可以选择加入其中一个，为自己的未来铺路。",
    "但要记住——加入一个势力，就意味着与它的敌人为敌。"
  ];},
  options:[
    {t:"光明教会（圣城）", go:"faction_lc_intro", effect:{}},
    {t:"暗蚀会（秘密）", go:"faction_es_intro", effect:{}},
    {t:"守望者（神秘）", go:"faction_wt_intro", effect:{}},
    {t:"东部王国（承天山）", go:"faction_em_intro", effect:{}},
    {t:"自由城邦（交汇城）", go:"faction_fc_intro", effect:{}},
    {t:"精灵王国（银叶城）", go:"faction_elf_intro", effect:{}},
    {t:"矮人王国（铁峰堡）", go:"faction_dwarf_intro", effect:{}},
    {t:"兽人王庭（草原）", go:"faction_orc_intro", effect:{}},
    {t:"深渊教派（隐藏）", go:"faction_abyss_intro", effect:{san:-10}},
    {t:"离开", go:"city_free", effect:{}}
  ]
};}

// ===== 光明教会 =====
N["faction_lc_intro"] = function(){ return {
  text:function(){return [
    "圣城的大教堂巍峨耸立，金色的穹顶在阳光下闪闪发光。",
    "一位身穿白袍的神父向你走来，他的眼神温和而锐利。",
    "「年轻人，我感受到了你身上的光明气息。你愿意为光明神效力吗？教会需要像你这样有天赋的人。」",
    "他递过来一份招募文书：「加入教会，你将获得神的庇佑，以及在大陆上最强大的后盾。」"
  ];},
  options:[
    {t:"我愿意加入", go:"faction_lc_test", effect:{}},
    {t:"我需要考虑一下", go:"faction_recruit_hub", effect:{}},
    {t:"教会的净化令害了不少人，我不感兴趣", go:"faction_lc_refuse", effect:{}}
  ]
};}

N["faction_lc_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      return [
        "神父带你进入大教堂的内殿，让你跪在圣像前祈祷。",
        "你闭上眼睛，一股温暖的力量从上方注入你的身体。圣像的眼睛似乎亮了一下。",
        "神父露出了微笑：「光明神认可了你。你的信仰是真诚的。」"
      ];
    }
    return [
      "神父让你祈祷，但你什么也没感受到。",
      "神父皱了皱眉：「你的信仰还不够坚定。不过，教会也需要能战斗的人。你可以从助祭做起。」"
    ];
  },
  options:[{t:"进行宣誓仪式", go:"faction_lc_oath", effect:{time:1}}]
};}

N["faction_lc_oath"] = function(){ return {
  text:function(){return [
    "大教堂内，烛光摇曳。你跪在圣像前，手按圣经。",
    "「我宣誓，效忠光明神，效忠教会，驱逐黑暗，净化邪恶，保护无辜。」",
    "神父将一枚银色的徽章别在你胸前：「从今天起，你就是光明教会的助祭了。」",
    "「愿光明神保佑你。」",
    "◆加入光明教会，获得教会徽章，教会声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_lc_joined", effect:{}}]
};}

N["faction_lc_joined"] = function(){
  v35_joinFaction("light_church");
  return {
    text:function(){return [
      "你走出大教堂，胸前的徽章在阳光下闪烁。",
      "路过的信徒向你点头致意。一个修女递给你一本祈祷书和一套教会法袍。",
      "「欢迎加入教会，助祭。明天清晨来大教堂报到，你的第一个任务在等你。」",
      "◆获得：教会法袍、祈祷书、初始教会任务"
    ];},
    options:[{t:"开始教会生活", go:"city_free", effect:{flag:"joined_light_church", time:1}}]
  };
}

N["faction_lc_refuse"] = function(){ return {
  text:function(){return [
    "神父的脸色沉了下来。",
    "「净化令是为了保护无辜者。灵魂法师的力量太危险了——你以后会明白的。」",
    "他转身离开，但你注意到他在离开前看了你的档案一眼。",
    "◆教会对你产生了戒心"
  ];},
  options:[{t:"离开", go:"faction_recruit_hub", effect:{rep_light_church:-10}}]
};}

// ===== 暗蚀会 =====
N["faction_es_intro"] = function(){ return {
  text:function(){return [
    "深夜，你在小巷里被一个戴面具的人拦住了去路。",
    "「别紧张。」他的声音经过伪装，「我是暗蚀会的人。我们注意你很久了——你有天赋，也有野心。」",
    "「教会说我们是邪教，但他们才是真正的压迫者。七印是枷锁，原初之物应该被解放。」",
    "他递过来一枚黑色的徽章：「加入我们，你将获得真正的力量——以及自由。」"
  ];},
  options:[
    {t:"我加入", go:"faction_es_test", effect:{}},
    {t:"你们是邪教，我要举报你", go:"faction_es_report", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_test"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    return [
      "面具人带你来到一个地下室。里面坐着几个同样戴面具的人。",
      "「想加入暗蚀会，需要证明你的忠诚。」为首的人说，「看到那边那个商人了吗？他欠了我们一大笔钱。去，把他的手指砍下来一根。」",
      "他递给你一把刀。",
      "这是一个测试——你愿意为了力量做到什么程度？"
    ];
  },
  options:[
    {t:"照做（砍手指）", go:"faction_es_oath", effect:{san:-15, karma:-10}},
    {t:"拒绝，但表示愿意用其他方式证明", go:"faction_es_alt_test", effect:{}},
    {t:"转身离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_alt_test"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= cha*3){
      return [
        "你放下刀，直视为首的人：「我不需要用这种方式证明忠诚。我可以为你们做更有价值的事——情报、谈判、潜入。」",
        "房间里沉默了几秒。然后为首的人笑了：「有意思。你比我想的聪明。」",
        "「好，我们给你一个机会。」"
      ];
    }
    return ["为首的人冷哼一声：「不够狠，也不够聪明。滚吧。」", "你被赶出了地下室。"];
  },
  options:[
    {t:"进行入会仪式", go:"faction_es_oath", effect:{}},
    {t:"离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_oath"] = function(){ return {
  text:function(){return [
    "地下室里，蜡烛排成了一个诡异的阵法。你站在阵中，面具人围在四周。",
    "「以深渊之名，以原初之物之名，你愿意将灵魂的一部分献给暗蚀会吗？」",
    "你点头。一阵寒意从脚底升起，你感觉有什么东西进入了你的身体。",
    "「欢迎加入暗蚀会。」为首的人将一枚黑色徽章递给你，「从今天起，你是我们的一员了。」",
    "◆加入暗蚀会，获得暗蚀会徽章，暗蚀会声望+20，SAN-10"
  ];},
  options:[{t:"接受徽章", go:"faction_es_joined", effect:{}}]
};}

N["faction_es_joined"] = function(){
  v35_joinFaction("eclipse_society");
  return {
    text:function(){return [
      "你走出地下室，夜风吹过。你摸了摸胸前的黑色徽章，它微微发热。",
      "一个声音在你脑海深处响起——也许是错觉，也许不是。",
      "「你的第一个任务：去交汇城的商会，找一个叫老约翰的人。他知道太多了。」",
      "◆获得：暗蚀会法袍、第一个暗杀任务"
    ];},
    options:[{t:"开始暗蚀会生活", go:"city_free", effect:{flag:"joined_eclipse_society", time:1}}]
  };
}

N["faction_es_report"] = function(){ return {
  text:function(){return [
    "你转身跑向最近的教会哨所，报告了暗蚀会的据点。",
    "但当审判骑士赶到时，地下室已经空了。他们只找到了一些来不及带走的文件。",
    "「干得好，年轻人。」审判骑士队长拍了拍你的肩，「教会会记住你的贡献。」",
    "但你知道——暗蚀会不会忘记这件事。",
    "◆教会声望+15，暗蚀会声望-30，被暗蚀会标记为敌人"
  ];},
  options:[{t:"离开", go:"city_free", effect:{rep_light_church:15, rep_eclipse_society:-30}}]
};}

// ===== 守望者 =====
N["faction_wt_intro"] = function(){ return {
  text:function(){return [
    "你总觉得有人在看你。",
    "今天，那种感觉特别强烈。你回头，看到一个穿灰袍的人站在街角。他的脸藏在兜帽里，但你能感觉到他在注视你。",
    "你走过去。他没有逃。",
    "「你终于注意到我了。」他的声音很平静，「我是守望者。我们观察、记录、维护平衡。我们已经观察你一段时间了。」",
    "「你有天赋，也有选择的权利。我们想邀请你——成为守望者的一员。」"
  ];},
  options:[
    {t:"守望者是什么？", go:"faction_wt_explain", effect:{}},
    {t:"我加入", go:"faction_wt_test", effect:{}},
    {t:"我不喜欢被监视，离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_wt_explain"] = function(){ return {
  text:function(){return [
    "灰袍人缓缓道来：",
    "「守望者是大陆上最古老的组织之一。我们不效忠任何势力，只效忠真相和平衡。」",
    "「我们记录历史，监测七印，在光明与黑暗之间维持天平。教会说我们是异端，暗蚀会说我们是叛徒——但我们只是旁观者。」",
    "「加入我们，你将获得接触真相的权利。但你也必须承诺：永不将记录用于私利。」",
    "他看着你：「你愿意吗？」"
  ];},
  options:[
    {t:"我愿意", go:"faction_wt_test", effect:{}},
    {t:"这太沉重了，我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_wt_test"] = function(){ return {
  text:function(){
    return [
      "灰袍人带你来到一个隐秘的房间。房间里有一张桌子，桌上放着一个袋子。",
      "「袋子里有一千金币。」他说，「现在，房间里只有你和我。如果你拿走这些金币，我不会阻止你，也不会告诉任何人。」",
      "「但如果你拿走了，你就不能成为守望者。」",
      "「这是测试——不是测试你的诚实，是测试你对真相的渴望是否超过了对利益的渴望。」"
    ];
  },
  options:[
    {t:"不拿金币，选择真相", go:"faction_wt_oath", effect:{}},
    {t:"拿走金币", go:"faction_wt_fail", effect:{gold:1000}}
  ]
};}

N["faction_wt_oath"] = function(){ return {
  text:function(){return [
    "灰袍人点了点头。他从怀里取出一枚银色的眼睛形状的徽章。",
    "「守望者的誓言：我将观察，不干预；我将记录，不篡改；我将守护平衡，不偏向任何一方。」",
    "你复述了誓言。他将徽章别在你胸前。",
    "「欢迎加入守望者。你的编号是第7342位。从今天起，你将看到一个不同的世界。」",
    "◆加入守望者，获得守望者徽章，守望者声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_wt_joined", effect:{}}]
};}

N["faction_wt_joined"] = function(){
  v35_joinFaction("watchers");
  return {
    text:function(){return [
      "你走出房间，世界似乎变得清晰了一些。",
      "灰袍人递给你一本空白的笔记本和一支特殊的笔。",
      "「记录你看到的一切。每个月，将你的记录送到交汇城的老书店。店主会知道该怎么做。」",
      "「你的第一个观察任务：暗蚀会最近在交汇城活动频繁。去调查一下。」",
      "◆获得：守望者笔记本、观察任务"
    ];},
    options:[{t:"开始守望者生活", go:"city_free", effect:{flag:"joined_watchers", time:1}}]
  };
}

N["faction_wt_fail"] = function(){ return {
  text:function(){return [
    "你拿起了金币袋。灰袍人没有阻止你。",
    "「我理解。」他的声音里没有失望，只有平静，「每个人都有选择的权利。」",
    "「但记住——你今天拿走的，将来可能会以另一种方式还回来。」",
    "他转身消失在街角。你手里握着金币袋，但心里有种说不出的滋味。",
    "◆获得1000金币，守望者声望-20"
  ];},
  options:[{t:"离开", go:"city_free", effect:{gold:1000, rep_watchers:-20}}]
};}

// ===== 东部王国 =====
N["faction_em_intro"] = function(){ return {
  text:function(){return [
    "承天山的军营里，士兵们正在操练。口号声震天动地。",
    "一个穿铠甲的军官向你走来，胸前的勋章显示他是个千夫长。",
    "「年轻人，看你的身板，是块当兵的料！」他声音洪亮，「东部王国的军队是大陆上最精锐的！加入我们，军功、爵位、土地——应有尽有！」",
    "他拍了拍你的肩膀：「怎么样，要不要为皇帝陛下效力？」"
  ];},
  options:[
    {t:"我愿意参军", go:"faction_em_test", effect:{}},
    {t:"军队太苦了，我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_em_test"] = function(){ return {
  text:function(){
    var str = S.attrs ? S.attrs.STR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= str*3){
      return [
        "千夫长带你来到校场，让你和一个新兵对练。",
        "你三下五除二就把对手放倒了。围观的士兵们发出叫好声。",
        "千夫长哈哈大笑：「好！好身手！就你了！」"
      ];
    }
    return [
      "你和新兵对练，虽然赢了，但打得很艰难。",
      "千夫长摸了摸下巴：「身手一般，但意志不错。军队需要各种人才——你可以做个文书或者后勤。」"
    ];
  },
  options:[{t:"进行入伍宣誓", go:"faction_em_oath", effect:{time:1}}]
};}

N["faction_em_oath"] = function(){ return {
  text:function(){return [
    "军营的广场上，你和其他新兵一起列队。千夫长站在前面。",
    "「我宣誓，效忠东部王国皇帝陛下，服从军令，守卫疆土，奋勇杀敌！」",
    "你跟着复述。千夫长将一枚军衔徽章别在你胸前。",
    "「从今天起，你是东部王国陆军的一名士兵了！明天开始训练！」",
    "◆加入东部王国，获得士兵徽章，帝国声望+20"
  ];},
  options:[{t:"接受军衔", go:"faction_em_joined", effect:{}}]
};}

N["faction_em_joined"] = function(){
  v35_joinFaction("empire");
  return {
    text:function(){return [
      "你领到了一套军装和一把制式长剑。",
      "同队的老兵拍了拍你的肩：「新兵，好好干。跟着我，保你不死。」",
      "「你的第一个任务：跟着小队去边境巡逻。兽人最近不老实。」",
      "◆获得：帝国军装、制式长剑、巡逻任务"
    ];},
    options:[{t:"开始军旅生活", go:"city_free", effect:{flag:"joined_empire", time:1}}]
  };
}

// ===== 自由城邦 =====
N["faction_fc_intro"] = function(){ return {
  text:function(){return [
    "交汇城的商会大楼里，商人们忙碌地穿梭。空气中弥漫着金币和账本的味道。",
    "一个穿丝绸长袍的胖子向你走来，他的手指上戴满了宝石戒指。",
    "「年轻人，我观察你很久了。」他笑眯眯地说，「你有商业头脑，也有行动力。加入自由城邦商会吧——我们给你资源，你给我们利润。」",
    "「在自由城邦，金币就是力量。你说呢？」"
  ];},
  options:[
    {t:"我加入商会", go:"faction_fc_test", effect:{}},
    {t:"我没有本金", go:"faction_fc_poor", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_fc_test"] = function(){ return {
  text:function(){
    return [
      "胖子商人带你来到一个房间，桌上放着三样东西：一把剑、一袋金币、一封信。",
      "「商会的入会测试很简单。」他说，「这三样东西，你只能选一样。选完之后告诉我为什么。」",
      "「剑代表武力，金币代表资本，信代表人脉。你选哪个？」"
    ];
  },
  options:[
    {t:"选剑（武力）", go:"faction_fc_oath", effect:{}},
    {t:"选金币（资本）", go:"faction_fc_oath", effect:{}},
    {t:"选信（人脉）", go:"faction_fc_oath", effect:{}}
  ]
};}

N["faction_fc_oath"] = function(){ return {
  text:function(){return [
    "胖子商人听了你的理由，哈哈大笑。",
    "「好！不管选哪个，只要你知道自己为什么选，就是商会需要的人才！」",
    "他在一份契约上盖了章：「从今天起，你是自由城邦商会的正式成员了。做生意，我们五五分成——当然，本钱我出。」",
    "◆加入自由城邦，获得商会徽章，自由城邦声望+20"
  ];},
  options:[{t:"接受契约", go:"faction_fc_joined", effect:{}}]
};}

N["faction_fc_joined"] = function(){
  v35_joinFaction("free_cities");
  return {
    text:function(){return [
      "你拿到了商会的徽章和第一笔启动资金。",
      "胖子商人递给你一份商路图：「你的第一个任务：把这批货运到铁门关，卖掉之后把利润带回来。」",
      "「路上小心，强盗最近很猖獗。」",
      "◆获得：商会徽章、启动资金100金币、商路图"
    ];},
    options:[{t:"开始商会生活", go:"city_free", effect:{flag:"joined_free_cities", gold:100, time:1}}]
  };
}

N["faction_fc_poor"] = function(){ return {
  text:function(){return [
    "胖子商人摆摆手：「没钱不要紧，商会给你本钱！我们看中的是你的能力，不是你的口袋。」",
    "「怎么样，现在愿意加入了吗？」"
  ];},
  options:[
    {t:"愿意", go:"faction_fc_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 精灵王国 =====
N["faction_elf_intro"] = function(){ return {
  text:function(){return [
    "银叶城的世界树高耸入云，阳光透过树叶洒下斑驳的光影。",
    "一个精灵长老向你走来，他的面容年轻，但眼睛里透着千年的沧桑。",
    "「外族的年轻人。」他的声音像风吹过树叶，「精灵王国很少接纳外族。但你身上……有自然的气息。」",
    "「世界树在低语，说你是可以信任的人。你愿意为精灵王国效力吗？」"
  ];},
  options:[
    {t:"我愿意", go:"faction_elf_test", effect:{}},
    {t:"外族在精灵王国不会被歧视吗？", go:"faction_elf_doubt", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_elf_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      return [
        "长老带你来到世界树下，让你把手放在树干上。",
        "你闭上眼睛，感受到了一股古老而温暖的力量。世界树的低语在你脑海中响起。",
        "长老露出了微笑：「世界树认可了你。很少有外族能做到这一点。」"
      ];
    }
    return [
      "你把手放在世界树上，但什么也没感受到。",
      "长老微微皱眉：「你的心还不够平静。不过，精灵王国也需要能战斗的盟友。你可以作为客卿加入。」"
    ];
  },
  options:[{t:"进行效忠仪式", go:"faction_elf_oath", effect:{time:1}}]
};}

N["faction_elf_oath"] = function(){ return {
  text:function(){return [
    "世界树下，长老用精灵语念诵着古老的誓言。你跟着复述，虽然不太懂意思，但能感受到其中的庄严。",
    "长老将一枚用树叶和银丝编织的徽章别在你胸前。",
    "「从今天起，你是精灵王国的朋友和盟友。世界树会保佑你。」",
    "◆加入精灵王国，获得精灵徽章，精灵声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_elf_joined", effect:{}}]
};}

N["faction_elf_joined"] = function(){
  v35_joinFaction("elf_kingdom");
  return {
    text:function(){return [
      "你走出世界树的阴影，几个精灵孩子好奇地看着你。",
      "长老递给你一把精灵短弓和一瓶治疗药水：「你的第一个任务：去调查世界树边缘的异常——最近有黑暗的气息在蔓延。」",
      "「小心，外族的朋友。」",
      "◆获得：精灵短弓、治疗药水、调查任务"
    ];},
    options:[{t:"开始精灵盟友生活", go:"city_free", effect:{flag:"joined_elf_kingdom", time:1}}]
  };
}

N["faction_elf_doubt"] = function(){ return {
  text:function(){return [
    "长老沉默了片刻。",
    "「歧视？不，我们只是谨慎。精灵寿命很长，我们见过太多外族的背叛。」",
    "「但如果你能用行动证明自己，精灵会是你最忠诚的朋友。」",
    "他看着你：「你愿意试试吗？」"
  ];},
  options:[
    {t:"我愿意试试", go:"faction_elf_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 矮人王国 =====
N["faction_dwarf_intro"] = function(){ return {
  text:function(){return [
    "铁峰堡的地下大厅里，炉火熊熊，铁锤声不绝于耳。",
    "一个留着大胡子的矮人向你走来，他的胳膊比你的腰还粗。",
    "「外族的！」他声音像打雷，「看你的手，是干过活的人！矮人王国最看重手艺和勇气！」",
    "「加入我们！有酒喝，有肉吃，有锻造炉用！怎么样？」"
  ];},
  options:[
    {t:"我加入", go:"faction_dwarf_test", effect:{}},
    {t:"我不会锻造", go:"faction_dwarf_cant", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_dwarf_test"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    return [
      "矮人带你来到一个锻造炉前，递给你一把铁锤和一块生铁。",
      "「入会测试很简单！」他大吼，「把这块铁打成一把匕首！三个小时内完成！」",
      "炉火烤得你满脸通红。你深吸一口气，举起了铁锤。"
    ];
  },
  options:[{t:"开始锻造（CON判定）", go:"faction_dwarf_oath", effect:{time:3}}]
};}

N["faction_dwarf_oath"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= con*3){
      return [
        "三个小时后，你将一把虽然粗糙但确实成型的匕首放在矮人面前。",
        "他拿起匕首看了看，然后哈哈大笑：「好！虽然丑了点，但结实！矮人就喜欢结实的东西！」",
        "「通过了！」"
      ];
    }
    return [
      "三个小时后，你只打出了一块歪歪扭扭的铁疙瘩。",
      "矮人看了看，叹了口气：「手艺不行……但你没放弃，这很矮人！」",
      "「算了，你可以做个战士或者矿工！通过了！」"
    ];
  },
  options:[{t:"进行入会仪式", go:"faction_dwarf_joined", effect:{}}]
};}

N["faction_dwarf_joined"] = function(){
  v35_joinFaction("dwarf_kingdom");
  return {
    text:function(){return [
      "矮人带你去了地下酒馆，给你倒了一大杯麦酒。",
      "「欢迎加入矮人王国！」他举杯，「从今天起，你是我们的兄弟！有困难找矮人，矮人一定帮！」",
      "他递给你一把矮人战斧和一个酒壶：「你的第一个任务：去矿洞深处清理一批钻出来的地底生物。」",
      "◆加入矮人王国，获得矮人战斧、麦酒壶，矮人声望+20"
    ];},
    options:[{t:"喝了这杯酒", go:"city_free", effect:{flag:"joined_dwarf_kingdom", time:1}}]
  };
}

N["faction_dwarf_cant"] = function(){ return {
  text:function(){return [
    "矮人摆摆手：「不会锻造不要紧！矮人王国也需要战士、矿工、商人！」",
    "「只要你诚实、勇敢，矮人就欢迎你！怎么样？」"
  ];},
  options:[
    {t:"那我加入", go:"faction_dwarf_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 兽人王庭 =====
N["faction_orc_intro"] = function(){ return {
  text:function(){return [
    "兽人王庭的帐篷里，篝火熊熊，兽人们围坐在一起喝酒吃肉。",
    "一个浑身伤疤的兽人战士向你走来，他的左眼上有一道深深的刀疤。",
    "「外族的。」他的声音低沉，「你看起来能打。兽人王庭只尊重力量。」",
    "「想加入？先证明你有资格坐在我们的篝火旁。」",
    "他指了指帐篷中央的格斗场：「打赢我的战士，你就是兄弟。打输了，就滚。」"
  ];},
  options:[
    {t:"接受挑战", go:"faction_orc_test", effect:{}},
    {t:"兽人都是野蛮人，我走了", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_orc_test"] = function(){ return {
  text:function(){return [
    "你走进格斗场。一个比你高两个头的兽人战士咆哮着冲了过来。",
    "周围的兽人们疯狂地呐喊，敲打着盾牌。",
    "这是一场纯粹的力量对决——没有魔法，没有诡计，只有拳头和意志。"
  ];},
  options:[{t:"开始战斗", go:"battle_start_orc_warrior", effect:{}}]
};}

N["faction_orc_oath"] = function(){ return {
  text:function(){return [
    "你击败了兽人战士。他倒在地上，喘着粗气，然后突然大笑起来。",
    "「好！好样的！」他爬起来，拍了拍你的背，差点把你拍趴下，「你是个真正的战士！」",
    "疤脸兽人站起来，将一个用狼牙和皮革制作的项链戴在你脖子上。",
    "「从今天起，你是兽人王庭的战士！血为盟，骨为证！」",
    "◆加入兽人王庭，获得兽人项链，兽人声望+20"
  ];},
  options:[{t:"接受项链", go:"faction_orc_joined", effect:{}}]
};}

N["faction_orc_joined"] = function(){
  v35_joinFaction("orc_horde");
  return {
    text:function(){return [
      "兽人们给你端来一大块烤肉和一碗发酵马奶酒。",
      "「你的第一个任务！」疤脸兽人说，「跟着狩猎队去草原深处猎一头巨狼！」",
      "「记住，在草原上，只有强者能活下去。但我们是兄弟——兄弟不会让兄弟死。」",
      "◆获得：兽人战斧、烤肉、狩猎任务"
    ];},
    options:[{t:"开始兽人战士生活", go:"city_free", effect:{flag:"joined_orc_horde", time:1}}]
  };
}

// ===== 深渊教派 =====
N["faction_abyss_intro"] = function(){ return {
  text:function(){return [
    "你在死亡沙漠的边缘迷路了。夜幕降临时，你看到远处有诡异的绿光在闪烁。",
    "你走过去，发现是一个地下洞穴的入口。洞穴里传来低沉的吟唱声。",
    "一个穿黑袍的人从洞穴里走出来，他的眼睛是纯黑色的，没有眼白。",
    "「你来了。」他的声音像是从地底传来，「深渊在呼唤你。你听到了吗？」",
    "你的头开始疼。某种东西确实在呼唤你——来自地底深处。",
    "「加入深渊教派，你将获得超越凡人的力量。代价是……你的一部分人性。」"
  ];},
  options:[
    {t:"我愿意付出代价", go:"faction_abyss_test", effect:{san:-15}},
    {t:"这太危险了，离开", go:"faction_recruit_hub", effect:{san:-5}}
  ]
};}

N["faction_abyss_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*2){
      return [
        "黑袍人带你进入洞穴深处。一个巨大的深渊裂缝在洞底张开，紫色的能量从中涌出。",
        "「将手伸入裂缝。」他说，「让深渊进入你的身体。如果你的意志足够强，你将获得力量。如果不够……你将成为深渊的一部分。」",
        "你颤抖着将手伸入裂缝。剧痛传来，但你咬紧牙关，没有尖叫。",
        "「你的意志很强。」黑袍人点头，「通过了。」"
      ];
    }
    return [
      "你将手伸入裂缝，剧痛让你几乎昏厥。你抽回手，发现手背上多了一个紫色的印记。",
      "「虽然不够强，但深渊已经标记了你。」黑袍人说，「你可以加入——但要小心，深渊的呼唤会越来越强。」"
    ];
  },
  options:[{t:"进行深渊契约", go:"faction_abyss_oath", effect:{san:-20}}]
};}

N["faction_abyss_oath"] = function(){ return {
  text:function(){return [
    "黑袍人用一把黑曜石匕首在你手心划了一道口子，将你的血滴入深渊裂缝。",
    "「以深渊之名，以原初之物之名，你愿意将灵魂的一部分献给深渊吗？」",
    "你点头。裂缝中涌出一股能量，注入你的身体。你感觉自己变得更强了，但也……更空了。",
    "「欢迎加入深渊教派。」黑袍人递给你一枚紫色的徽章，「从今天起，深渊与你同在。」",
    "◆加入深渊教派，获得深渊徽章，深渊侵蚀+10%，SAN-20"
  ];},
  options:[{t:"接受徽章", go:"faction_abyss_joined", effect:{}}]
};}

N["faction_abyss_joined"] = function(){
  v35_joinFaction("abyss_cult");
  return {
    text:function(){return [
      "你走出洞穴，夜空似乎比平时更暗了。",
      "黑袍人递给你一本用人皮装订的书：「你的第一个任务：去交汇城传播深渊的福音。找到那些对现实绝望的人，让他们听到深渊的呼唤。」",
      "「记住——深渊终将吞噬一切。而我们，将是新世界的主人。」",
      "◆获得：深渊教义、传教任务"
    ];},
    options:[{t:"开始深渊教派生活", go:"city_free", effect:{flag:"joined_abyss_cult", abyss_corruption:10, time:1}}]
  };
}

console.log('[V36] 9大势力加入剧情线已加载');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_faction_story + '\n' + html[script_end:]
    print("✓ v36势力加入剧情线已插入（9势力×4节点=36节点）")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
