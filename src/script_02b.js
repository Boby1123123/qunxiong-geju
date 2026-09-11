/*v76mod*/

/* ============================================================
   v11 剧情节点：八大系统交互节点
   ============================================================ */

/* ---- 黄林晶遗产寻宝线 ---- */
N["hlj_clue_found"] = function(){ return {
  text:function(){var base=["你在旧书堆里翻到了一张泛黄的纸。纸上的字迹潦草，但你认出了一个名字——黄林晶。三千年前加固七印的法神。纸的边角画着一个符号，像是某种地图的标记。你把纸收好。这可能是某个大秘密的入口。"];
  if(S.flags.hlj_notes_found) base.push("你想起笔记里的内容，这个符号对应的是「断剑·诛邪」的位置——铁门关。");
  return base;},
  options:[
    {t:"仔细研究这张纸", check:{attr:"INT", label:"智力·解读", target:60},
      tier:{crit:function(){return[pickV(["你花了三个小时破译纸上的密文。这不是普通的纸，是用龙血写的——只有在月光下才会显现全部内容。你不仅读懂了地图，还发现了黄林晶留下的一句话：「找到十二件遗产，就能重铸七印。」你的手在抖。这是足以改变大陆命运的秘密。◆获得：黄林晶遗产线索×1，智力+2","你把纸对着光看，发现纸里夹着更薄的一层。第二层纸上画着十二件物品的草图，每件旁边都写着一个地名。你一一记下：断剑在铁门关，萨满鼓在兽人圣山。这是一份完整的遗产清单。◆获得：黄林晶遗产全线索，智力+3"],"hlj_clue_crit")]},
      ok:function(){return[pickV(["你读懂了大部分内容。这是一张藏宝图的残片，指向黄林晶的某件遗产。具体是哪一件，还需要更多线索。但至少你知道了方向——北方，铁门关。◆获得：黄林晶遗产线索×1","纸上的内容半懂不懂，但你确定了一件事：黄林晶把他的遗产分散藏在了大陆各处。这张纸指向其中一件。◆获得：黄林晶遗产线索×1"],"hlj_clue_ok")]},
      fail:function(){return[pickV(["你研究了半天，只认出了「黄林晶」三个字和一个模糊的方向。其余的字迹像是被故意涂掉了。也许需要特殊的方法才能显现。◆未获得有效线索，但记住了这个符号","纸上的字迹太潦草，你无法确定它在说什么。但你把纸收好了——直觉告诉你，这东西很重要。◆获得：神秘纸张"],"hlj_clue_fail")]},
      critfail:function(){return[pickV(["你太专注于研究，没注意到有人在盯着你。一个穿灰袍的人悄悄离开了书店。等你反应过来，他已经消失在人群中。你有种不好的预感——有人也在找黄林晶的遗产。◆暗蚀会开始关注你，业力+1","你不小心把纸撕破了。一半的内容永远消失了。但剩下的一半里，你看到了「铁门关」三个字。◆获得残缺线索，暗蚀会情报司+5关注"],"hlj_clue_cf")]}},
      go:"hlj_treasure_hunt", effect:{flag:"hlj_clue_found", time:1}},
    {t:"把纸放回去，假装没看到", go:"city_free", effect:{time:1}}
  ]
};}

N["hlj_treasure_hunt"] = function(){ return {
  text:function(){var base=["你开始了寻找黄林晶遗产的旅程。十二件遗产，分散在大陆的各个角落。每一件都有自己的故事，自己的守护者，自己的谜题。"];
  var found=0; for(var k in HLJ_TREASURES) if(S.flags["hlj_"+k+"_found"]) found++;
  base.push("已找到遗产："+found+"/12");
  if(found>=9) base.push("你已经找到了九件遗产。法神之冠的幻影开始在你梦中出现——它在第七印前等你。");
  if(found>=11) base.push("十一件遗产在手。铸印核心的位置已经清晰——时光神殿的最深处。");
  return base;},
  options:[
    {t:"前往铁门关寻找断剑·诛邪", go:"travel", effect:{flag:"hlj_target_sword", time:0}},
    {t:"前往兽人圣山寻找萨满鼓", go:"travel", effect:{flag:"hlj_target_drum", time:0}},
    {t:"前往精灵世界树根寻找徽章", go:"travel", effect:{flag:"hlj_target_badge", time:0}},
    {t:"前往矮人永恒熔炉寻找锻造锤", go:"travel", effect:{flag:"hlj_target_hammer", time:0}},
    {t:"前往南方沉船湾寻找航海罗盘", go:"travel", effect:{flag:"hlj_target_compass", time:0}},
    {t:"前往承天书院寻找时光沙漏", go:"travel", effect:{flag:"hlj_target_hourglass", time:0}},
    {t:"暂时放下，先处理其他事", go:"city_free", effect:{time:1}}
  ]
};}

/* ---- 信仰系统节点 ---- */
N["faith_shrine"] = function(){ return {tag:"branch",
  text:function(){var base=["你站在一座神庙前。香火缭绕，信徒们默祷。神庙的柱子上刻着神名，空气中弥漫着一种肃穆的气息。"];
  var f=S.flags.current_faith;
  if(f){var fd=FAITHS[f]; if(fd) base.push("你当前信仰："+fd.cn+"，供奉值："+(S.flags["piety_"+f]||0));}
  return base;},
  options:[
    {t:"供奉金龙（+10供奉值）", effect:{gold:-1, flag:"piety_donate"}, go:"faith_blessing"},
    {t:"供奉银月（+3供奉值）", effect:{silver:-10, flag:"piety_small"}, go:"faith_blessing"},
    {t:"虔诚祈祷（+1供奉值，可能获得神恩）", check:{attr:"SPR", label:"灵性·祈祷", target:40},
      tier:{crit:function(){return[pickV(["你闭上眼睛，诚心祈祷。忽然，一道温暖的光从神像上流淌下来，包裹住你。你听到了一个声音，很轻，像风吹过树叶：「你的诚心，我收到了。」你感到身体里充满了力量。◆供奉值+5，全属性临时+3，持续3天","你祈祷时，神像的眼睛似乎动了一下。然后你闻到了一股香味，不是香火，是某种古老的气息。你知道，神注意到了你。◆供奉值+5，获得一次神恩"],"faith_pray_crit")]},
      ok:function(){return[pickV(["你诚心祈祷，感到内心平静。神像没有显灵，但你觉得自己的信仰更坚定了。◆供奉值+2","你祈祷了一会儿，没有神迹发生。但你注意到旁边的老祭司对你点了点头。◆供奉值+2，老祭司好感+10"],"faith_pray_ok")]},
      fail:function(){return[pickV(["你祈祷了，但心不在焉。神像冷冷地看着你，什么也没发生。◆供奉值+0","你试着祈祷，但发现自己其实并不怎么信。旁边的信徒看了你的眼神，带着一丝不屑。◆供奉值+0，信徒好感-5"],"faith_pray_fail")]},
      critfail:function(){return[pickV(["你祈祷时不小心打了个喷嚏，喷在了前面的信徒身上。信徒大怒，认为你亵渎了神庙。祭司过来把你请了出去。◆被赶出神庙，该信仰供奉值-5","你祈祷时说错了神名——把战神说成了爱神。整个神庙的人都转过头来看你。◆供奉值-3，社交-10"],"faith_pray_cf")]}},
      go:"faith_blessing", effect:{time:1}},
    {t:"询问祭司关于信仰的事", go:"faith_info", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}

N["faith_blessing"] = function(){ return {tag:"branch",
  text:function(){var base=["你感到神的眷顾。供奉值的提升让你在这个信仰的区域内行动更加顺利。人们看你的眼神变了——带着尊敬，甚至敬畏。"];
  var f=S.flags.current_faith;
  if(f){var p=S.flags["piety_"+f]||0; var tier="无名";
    for(var i=0;i<PIETY_TIERS.length;i++){if(p>=PIETY_TIERS[i].min && p<=PIETY_TIERS[i].max){tier=PIETY_TIERS[i].name;}}
    base.push("当前供奉等级："+tier+"（"+p+"/100）");
    if(p>=60) base.push("你已经是狂信者。这个区域的信徒会主动帮助你。");
    if(p>=80) base.push("你是神眷者。神的力量在你身上流淌。");
  }
  return base;},
  options:[
    {t:"继续探索城市", go:"city_free", effect:{time:1}},
    {t:"查看所有信仰状态", go:"faith_overview", effect:{time:0}}
  ]
};}

N["faith_overview"] = function(){ return {tag:"branch",
  text:function(){var base=["【信仰总览】"];
  for(var k in FAITHS){var f=FAITHS[k]; var p=S.flags["piety_"+k]||0;
    if(p>0) base.push(f.cn+"：供奉值 "+p+"，信徒 "+(f.followers>=10000?Math.floor(f.followers/10000)+"万":f.followers));}
  base.push("提示：在对应信仰区域供奉可获得加成；信仰对立的神系会降低供奉值。");
  return base;},
  options:[{t:"返回", go:"city_free", effect:{time:0}}]
};}

N["faith_info"]={tag:"branch",
  text:["老祭司徐徐开口，给你讲述了这个神系的历史、教义和禁忌。他的声音低沉，像是在背诵一段古老的经文。你听得入了迷，对这个信仰有了更深的理解。"],pace:"light",
  options:[
    {t:"选择信仰这个神系", effect:{flag:"current_faith_set"}, go:"faith_blessing"},
    {t:"只是了解一下", go:"faith_shrine", effect:{time:1}}
  ]
}

/* ---- 家族政治节点 ---- */
N["noble_court"] = function(){ return {
  text:["你走进了贵族的社交场。丝绸、珠宝、香水、谎言——这里的每一句话都有三层意思，每一个微笑都藏着一把刀。你看到了几个大家族的成员在角落里密谈。"],pace:"light",
  options:[
    {t:"观察各家族的互动（洞察）", check:{attr:"INT", label:"智力·洞察", target:55},
      tier:{crit:function(){return[pickV(["你端着酒杯，在人群中穿梭，像一只隐形的猫。你看到了：铁拳家的人和金鳞家的人在角落里争吵；美第奇家的继承人和教会的红衣主教在阳台上密谈；丝织家的女主人悄悄塞给一个陌生人一张纸条。在贵族的棋盘上，信息就是最锋利的刀。◆获得：家族关系情报×3，智力+1","你注意到了一个细节：北风家的女伯爵奥尔加在和一个灵魂法师秘密会面。她手上戴着一枚戒指，戒指上的符号是灵魂法师协会的标志。这在北方公国是禁忌。你握住了这个秘密。◆获得：北风家秘密，洞察+2"],"noble_observe_crit")]},
      ok:function(){return[pickV(["你观察了一会儿，发现铁拳家和金鳞家的关系不太妙——他们的人碰面时连表面功夫都懒得做。◆获得：家族关系情报×1","你注意到美第奇家的继承人亚历山大最近和教会走得很近。这很奇怪。◆获得：美第奇家动向情报"],"noble_observe_ok")]},
      fail:function(){return[pickV(["你看了半天，只看到一群人在喝酒聊天。贵族的社交对你来说太复杂了。◆未获得有效情报","你试图偷听，但被一个贵族发现了。他用看苍蝇的眼神看了你一眼。◆社交-5"],"noble_observe_fail")]},
      critfail:function(){return[pickV(["你太专注于观察，没注意到自己撞到了一个端着酒杯的仆人。酒洒了一身，还溅到了旁边一位贵妇的裙子上。你成了今晚的笑柄。◆社交-15","你偷听时被当场抓住。一个铁拳家的武士抓住你的领子，把你拖到了外面。◆受伤，铁拳家好感-20"],"noble_observe_cf")]}},
      go:"noble_action", effect:{time:2}},
    {t:"主动与某家族搭话", go:"noble_choose_house", effect:{time:1}},
    {t:"离开社交场", go:"city_free", effect:{time:1}}
  ]
};}

N["noble_action"]={
  text:["你掌握了一些情报。在贵族的游戏里，情报可以换成金钱、盟友，或者一条人命。你打算怎么用这些情报？"],pace:"light",
  options:[
    {t:"用情报换取金钱", effect:{gold:3}, go:"city_free"},
    {t:"用情报换取某个家族的好感", go:"noble_choose_house", effect:{time:1}},
    {t:"暂时保留，以后再说", go:"city_free", effect:{time:1}}
  ]
}

N["noble_choose_house"]={
  text:["你想和哪个家族接触？"],pace:"light",
  options:[
    {t:"铁拳家族（北方军事强权）", go:"noble_ironfist", effect:{time:1}},
    {t:"美第奇家族（金融霸主）", go:"noble_medici", effect:{time:1}},
    {t:"金鳞家族（南方商业联盟）", go:"noble_goldscale", effect:{time:1}},
    {t:"教会神圣家族（神权）", go:"noble_church", effect:{time:1}},
    {t:"银叶王族（精灵）", go:"noble_elf", effect:{time:1}},
    {t:"熔炉家族（矮人）", go:"noble_dwarf", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
}

N["noble_ironfist"]={
  text:["铁拳家族的人围坐在壁炉旁，擦拭着武器。他们看你的眼神带着军人的审视——不是看你有没有钱，而是看你有没有骨气。守将格雷戈尔用独眼看了你一眼：「有话直说。我们不喜欢绕弯子。」"],pace:"light",
  options:[
    {t:"表达对铁门关战事的关切", check:{attr:"CHA", label:"魅力·交涉", target:50}, go:"city_free", effect:{flag:"ironfist_respect", time:1}},
    {t:"请求加入守军", go:"i_war_iron_gate", effect:{time:1}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

N["noble_medici"]={
  text:["美第奇家族的会客室富丽堂皇，墙上挂着历代家族成员的肖像。一个年轻人坐在书桌后，手指上戴着一枚金秤戒指——美第奇家的标志。他是亚历山大·美第奇，家族的养子和继承人。他看你的眼神很复杂，像是在评估一件商品。"],pace:"light",
  options:[
    {t:"谈论金融和贸易", check:{attr:"INT", label:"智力·商业", target:55}, go:"city_free", effect:{flag:"medici_interest", time:1}},
    {t:"询问关于洛伦佐的事", check:{attr:"CHA", label:"魅力·询问", target:60}, go:"city_free", effect:{flag:"medici_lorenzo", time:1}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

N["noble_goldscale"]={
  text:["金鳞家族的人穿着最时髦的丝绸，手里端着来自南方的美酒。族长马库斯·金鳞是城邦联盟的议长，他的笑容很标准，标准到你看不出他在想什么。「欢迎，远方的朋友。金鳞家的大门永远为有价值的人敞开。」"],pace:"light",
  options:[
    {t:"商谈商业合作", check:{attr:"CHA", label:"魅力·商业", target:55}, go:"city_free", effect:{gold:2, time:1}},
    {t:"打听南方城邦的局势", check:{attr:"INT", label:"智力·打探", target:50}, go:"city_free", effect:{time:1}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

N["noble_church"]={
  text:["教会的代表穿着洁白的法袍，胸前挂着圣光徽章。他看你的眼神带着审判的意味——不是看你是谁，而是看你有没有罪。「愿圣光保佑你。你来到这里，是寻求救赎，还是寻求力量？」"],pace:"light",
  options:[
    {t:"表达对光明神的虔诚", check:{attr:"SPR", label:"灵性·虔诚", target:50}, go:"faith_shrine", effect:{time:1}},
    {t:"询问关于深渊和封印的事", check:{attr:"INT", label:"智力·询问", target:60}, go:"city_free", effect:{time:1}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

N["noble_elf"]={
  text:["精灵贵族的美貌令人屏息，但他们的眼神里带着千年的傲慢。银叶王族的代表用精灵语说了句什么，然后才用通用语说：「人类，你找我们有什么事？我们的时间很宝贵。」"],pace:"light",
  options:[
    {t:"表达对自然和精灵文化的尊重", check:{attr:"CHA", label:"魅力·外交", target:55}, go:"city_free", effect:{flag:"elf_respect", time:1}},
    {t:"询问关于世界树的事", check:{attr:"INT", label:"智力·询问", target:55}, go:"city_free", effect:{time:1}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

N["noble_dwarf"]={
  text:["矮人贵族的胡子编得整整齐齐，上面挂着金环和银铃。熔炉家族的代表用洪亮的声音说：「人类！你找矮人有什么事？是来买武器的，还是来喝酒的？最好是两者都有！」他大笑着拍了拍你的肩膀，力气大得差点把你拍趴下。"],pace:"light",
  options:[
    {t:"商谈武器和锻造合作", check:{attr:"INT", label:"智力·工艺", target:50}, go:"city_free", effect:{flag:"dwarf_trade", time:1}},
    {t:"请矮人喝一杯（花费1银月）", effect:{silver:-12, flag:"dwarf_friend"}, go:"city_free", effect:{time:2}},
    {t:"离开", go:"noble_court", effect:{time:1}}
  ]
}

/* ---- 地下世界节点 ---- */
N["underworld_entrance"] = function(){ return {
  text:function(){var base=["你找到了地下世界的入口——一家看起来普普通通的酒馆。但酒馆的地下室里，是另一个世界。走私者、盗贼、杀手、情报贩子，每个人都有故事，每个人都有价格。"];
  var r=S.flags.crime_rank||0;
  if(r>0) base.push("你的地下身份："+CRIME_RANKS[r].name+"，声望："+(S.flags.crime_rep||0));
  return base;},
  options:[
    {t:"接一个地下委托", check:{attr:"CHA", label:"魅力·接头", target:50},
      tier:{ok:function(){return[pickV(["一个戴兜帽的人向你招手。他递给你一张纸条：「把东西拿回来，或者把人带回来。钱不是问题。」◆获得：地下委托×1","酒馆老板认识你。他扔给你一把钥匙：「三号房，有人等你。别问太多。」◆获得：地下委托×1"],"uw_job_ok")]},
      fail:function(){return[pickV(["你在地下室转了一圈，没人理你。这里的人都很警惕。◆未接到委托","你试图搭话，但对方只是冷冷地看了你一眼。◆未接到委托，地下声望-5"],"uw_job_fail")]}},
      go:"underworld_job", effect:{time:1}},
    {t:"购买情报（2金龙）", effect:{gold:-2}, go:"underworld_info", effect:{time:1}},
    {t:"出售赃物", go:"underworld_fence", effect:{time:1}},
    {t:"招募手下（需要头目以上）", go:"underworld_recruit", effect:{time:1}},
    {t:"离开地下世界", go:"city_free", effect:{time:1}}
  ]
};}

N["underworld_job"]={
  text:["你接下了地下委托。任务的内容很简单——也很危险。你需要在天亮之前完成，否则委托人会换人。你吸了口气，走进了夜色里。"],pace:"light",
  options:[
    {t:"执行委托（潜行）", check:{attr:"AGI", label:"敏捷·潜行", target:55}, go:"city_free", effect:{gold:3, time:2}},
    {t:"执行委托（暴力）", check:{attr:"STR", label:"力量·战斗", target:55}, go:"city_free", effect:{gold:3, time:2}},
    {t:"放弃委托", go:"underworld_entrance", effect:{flag:"uw_quit", time:1}}
  ]
}

N["underworld_info"]={
  text:["情报贩子是个干瘪的老头，眼睛像老鼠一样亮。他收了你的钱，压轻声音说：「你想知道什么？这个城市里没有我不知道的事——只要价钱合适。」"],pace:"light",
  options:[
    {t:"询问暗蚀会的动向", go:"city_free", effect:{flag:"eclipse_intel", time:1}},
    {t:"询问某个家族的秘密", go:"noble_court", effect:{time:1}},
    {t:"询问哪里有值钱的目标", go:"city_free", effect:{flag:"heist_target", time:1}}
  ]
}

N["underworld_fence"]={
  text:["销赃商是个胖子，脸上永远挂着笑。他看了一眼你带来的东西，摇了摇头：「这些东西来路不正，我得冒着风险收。这样吧，我给你原价的三成。不能再多了。」"],pace:"light",
  options:[
    {t:"接受三成价格出售", effect:{gold:1}, go:"city_free", effect:{time:1}},
    {t:"讨价还价", check:{attr:"CHA", label:"魅力·议价", target:50}, go:"city_free", effect:{gold:2, time:1}},
    {t:"不卖了，离开", go:"underworld_entrance", effect:{time:1}}
  ]
}

N["underworld_recruit"] = function(){ return {
  text:function(){var r=S.flags.crime_rank||0;
  if(r<2) return ["你的等级不够。在地下世界，只有头目以上才有资格招募手下。你现在只是个"+CRIME_RANKS[r].name+"。"];
  return ["你站在地下室的中央，拍了拍手。几个衣衫褴褛的人围了上来，眼神里带着渴望和警惕。「想跟着我干？」你问。他们点了点头。"];},
  options:[
    {t:"招募一个小偷（花费5银月）", effect:{silver:-60, flag:"crew_thief"}, go:"city_free", effect:{time:1}},
    {t:"招募一个打手（花费1金龙）", effect:{gold:-1, flag:"crew_fighter"}, go:"city_free", effect:{time:1}},
    {t:"暂时不招募", go:"underworld_entrance", effect:{time:1}}
  ]
};}

/* ---- 法律审判节点 ---- */
N["court_arrest"] = function(){ return {
  text:["执法者挡住了你的去路。「你被逮捕了。」他的手按在剑柄上，眼神冰冷。周围的行人纷纷避让。你闻到了金属和汗水的味道。"],pace:"light",
  options:[
    {t:"反抗（战斗）", check:{attr:"STR", label:"力量·反抗", target:65},
      tier:{ok:function(){return[pickV(["你一拳打倒了执法者，转身就跑。身后传来警报声，但你已经消失在巷子里。◆逃脱成功，通缉等级+1","你夺过执法者的剑，逼退了其他人，然后趁乱逃走。◆逃脱成功，通缉等级+1"],"arrest_fight_ok")]},
      fail:function(){return[pickV(["你反抗了，但执法者比你想象的强。三两下就把你按在了地上。◆被逮捕","你试图反抗，但周围又冲出来几个执法者。◆被逮捕，轻伤"],"arrest_fight_fail")]},
      critfail:function(){return[pickV(["你不仅没打过执法者，还在挣扎中误伤了一个路人。◆被逮捕，罪加一等","你的武器在反抗中脱手，正好砸在了执法队长的头上。◆被逮捕，重伤"],"arrest_fight_cf")]}},
      go:"court_detention", effect:{time:1}},
    {t:"逃跑（敏捷）", check:{attr:"AGI", label:"敏捷·逃跑", target:60},
      tier:{ok:function(){return[pickV(["你转身就跑，穿过小巷，翻过围墙。执法者在后面追，但你甩掉了他们。◆逃脱成功","你利用人群的掩护，钻进了一条窄巷，然后爬上了屋顶。◆逃脱成功"],"arrest_run_ok")]},
      fail:function(){return[pickV(["你跑了，但执法者吹了哨子，前面又有人堵你。◆被逮捕","你跑得不够快，执法者的马比你的腿快。◆被逮捕"],"arrest_run_fail")]}},
      go:"court_detention", effect:{time:1}},
    {t:"配合逮捕（保留辩护空间）", go:"court_detention", effect:{flag:"cooperated", time:1}}
  ]
};}

N["court_detention"] = function(){ return {
  text:function(){var base=["你被关在了牢房里。潮湿、阴暗、弥漫着霉味和尿骚味。隔壁牢房的人在哼歌，歌声跑调得让人想撞墙。"];
  if(S.flags.cooperated) base.push("因为你配合逮捕，执法者对你态度尚可。");
  return base;},
  options:[
    {t:"联系律师（需要5金龙）", effect:{gold:-5, flag:"has_lawyer"}, go:"court_trial", effect:{time:2}},
    {t:"在狱中收集情报", check:{attr:"CHA", label:"魅力·打探", target:50}, go:"court_trial", effect:{flag:"prison_info", time:2}},
    {t:"尝试越狱", check:{attr:"AGI", label:"敏捷·越狱", target:70},
      tier:{ok:function(){return[pickV(["你用藏在鞋跟里的细铁丝打开了牢门。狱卒在打盹，你像影子一样溜了出去。◆越狱成功，通缉等级+1","你买通了狱卒。他收了你的钱，假装没看见你离开。◆越狱成功，花费2金龙"],"jail_break_ok")]},
      fail:function(){return[pickV(["你试图撬锁，但铁丝断在了锁里。狱卒听到声音过来，把你揍了一顿。◆越狱失败，轻伤","你买通狱卒的钱不够，他直接举报了你。◆越狱失败，加刑15天"],"jail_break_fail")]}},
      go:"court_trial", effect:{time:1}},
    {t:"等待审判", go:"court_trial", effect:{time:3}}
  ]
};}

N["court_trial"] = function(){ return {
  text:["法庭上，法官坐在高高的椅子上，旁边是书记官和证人。检察官正在陈述对你的指控，他的声音铿锵有力，每一个字都像锤子一样敲在你心上。你感到了前所未有的压力。"],pace:"light",
  options:[
    {t:"自行辩护", check:{attr:"INT", label:"智力·辩护", target:55},
      tier:{crit:function(){return[pickV(["你用严密的逻辑和确凿的证据，逐条反驳了检察官的指控。你甚至反过来质疑了证人的可信度。法官点了点头，宣布你无罪释放。◆无罪释放，声望+10","你的辩护精彩绝伦，旁听席上有人开始鼓掌。检察官脸色铁青，法官宣布证据不足，无罪释放。◆无罪释放，获得「辩才」尊名"],"trial_self_crit")]},
      ok:function(){return[pickV(["你的辩护有一定效果，法官将信将疑。最终判决：罪名成立，但从轻发落。◆从轻判决，罚金减半","你找到了指控中的一些漏洞，虽然没能完全脱罪，但减轻了刑罚。◆减轻处罚"],"trial_self_ok")]},
      fail:function(){return[pickV(["你的辩护漏洞百出，检察官轻易就驳倒了你。法官宣判：罪名成立。◆按标准刑罚执行","你越说越乱，反而暴露了更多问题。法官认为你毫无悔意，从重判决。◆从重处罚"],"trial_self_fail")]},
      critfail:function(){return[pickV(["你在法庭上失言，承认了检方没有掌握的另一桩罪行。法官大怒，数罪并罚。◆加重处罚，追加罪名","你的辩护变成了对法官的攻击，被判定藐视法庭。◆加刑，声望-20"],"trial_self_cf")]}},
      go:"city_free", effect:{time:2}},
    {t:"律师辩护（如果已聘请）", check:{attr:"INT", label:"智力·律师辩护", target:45}, go:"city_free", effect:{time:2}},
    {t:"认罪求情", go:"city_free", effect:{flag:"guilty_plea", time:1}}
  ]
};}

/* ---- 疫病医疗节点 ---- */
N["plague_outbreak"] = function(){ return {
  text:["城市里出现了异常。街上的人少了，窗户都关着，空气中弥漫着醋和草药燃烧的味道。一个告示贴在城门口：「疫病流行，非必要不得外出。」"],pace:"light",
  options:[
    {t:"调查疫病源头", check:{attr:"INT", label:"智力·调查", target:55},
      tier:{crit:function(){return[pickV(["你走访了十几个病患家庭，发现了一个共同点——他们都在三天前去过同一个水井。井水已经发黑。你确定了疫病的传播途径和源头。◆获得：疫病源头情报，声望+10","你不仅找到了源头，还判断出了疫病类型——灰死病。你知道该用什么药。◆获得：疫病完整情报，医疗技能+5，声望+15"],"plague_invest_crit")]},
      ok:function(){return[pickV(["你调查了一番，发现疫病似乎是从城东的贫民区开始传播的。◆获得：疫病传播范围情报","你问了几个病人，判断这是一种接触传播的疫病。◆获得：疫病传播途径情报"],"plague_invest_ok")]},
      fail:function(){return[pickV(["你调查了半天，但病人和家属都不愿意多说。◆未获得有效情报","你去了疫区，但没做任何防护。回来后你开始咳嗽。◆可能感染疫病"],"plague_invest_fail")]},
      critfail:function(){return[pickV(["你在疫区调查时，不小心打碎了一个病人的药罐。当天晚上，你开始发烧。◆感染疫病（中期），SAN-5","你把病人集中起来问话，导致交叉感染。疫情加重了。◆声望-10，疫情恶化"],"plague_invest_cf")]}},
      go:"plague_response", effect:{time:2}},
    {t:"购买药品预防", effect:{gold:-3, flag:"medicine_ready"}, go:"city_free", effect:{time:1}},
    {t:"离开这座城市", go:"travel", effect:{time:1}},
    {t:"留下来帮助治疗", go:"plague_heal", effect:{time:1}}
  ]
};}

N["plague_heal"] = function(){ return {
  text:["你决定留下来帮助治疗病人。你穿上了用醋浸泡过的布罩，走进了临时隔离区。里面的景象让你心头一紧——几十个人躺在草席上，有的在呻吟，有的已经不动了。"],pace:"light",
  options:[
    {t:"用炼金术配药治疗", check:{attr:"INT", label:"智力·药剂", target:60},
      tier:{crit:function(){return[pickV(["你精确地调配了净化药剂，剂量分毫不差。三个小时后，隔离区里第一次有人笑了。◆治愈10名病人，炼金术+5，声望+20","你在配药时做了一个小改进——加入了银月草的提取物，效果比标准配方好三倍。◆治愈15名病人，获得独特配方，声望+25"],"plague_heal_crit")]},
      ok:function(){return[pickV(["你配的药剂有效果，几个病人的症状减轻了。但材料有限。◆治愈3名病人，声望+5","你的药剂缓解了病人的痛苦，虽然没有完全治愈。◆稳定5名病人病情，声望+3"],"plague_heal_ok")]},
      fail:function(){return[pickV(["你的药剂配错了剂量，病人喝了之后呕吐得更厉害了。◆治疗失败，声望-5","你配的药没有效果。病人的家属用失望的眼神看着你。◆治疗失败，声望-3"],"plague_heal_fail")]},
      critfail:function(){return[pickV(["你配的药剂出了严重问题——一个病人喝了之后当场抽搐，然后停止了呼吸。◆导致1人死亡，声望-20，SAN-10","你的药剂不仅没治好病，反而加速了疫病的传播。◆疫情加重，声望-25，被城市驱逐"],"plague_heal_cf")]}},
      go:"plague_response", effect:{time:3}},
    {t:"用牧师的神圣治愈", check:{attr:"SPR", label:"灵性·治愈", target:65}, go:"plague_response", effect:{time:2}},
    {t:"组织隔离防疫", check:{attr:"CHA", label:"魅力·组织", target:55}, go:"plague_response", effect:{time:2}},
    {t:"太累了，先休息", go:"city_free", effect:{time:1}}
  ]
};}

N["plague_response"]={
  text:["你的行动产生了影响。城市的官员开始注意到你，病人和家属也用不同的眼神看你。疫病还在蔓延，但你的努力让一些人看到了希望。"],pace:"light",
  options:[
    {t:"继续帮助治疗", go:"plague_heal", effect:{time:1}},
    {t:"向城市官员提出防疫建议", check:{attr:"CHA", label:"魅力·建议", target:55}, go:"city_free", effect:{flag:"plague_advisor", time:1}},
    {t:"离开疫区", go:"city_free", effect:{time:1}}
  ]
}

/* ---- 飞空艇航线节点 ---- */
N["airship_dock"] = function(){ return {
  text:function(){var base=["你站在飞空艇码头。巨大的飞艇停泊在高塔上，气囊在风中稍起伏，像沉睡的巨兽。码头上人来人往，你闻到了煤烟和香料混合的味道。"];
  if(S.flags.owns_airship) base.push("你拥有自己的飞空艇："+(S.flags.airship_name||"未命名"));
  return base;},
  options:[
    {t:"查看航班时刻表", go:"airship_routes", effect:{time:1}},
    {t:"购买机票前往目的地", go:"airship_book", effect:{time:1}},
    {t:"货运委托（运送货物赚钱）", go:"airship_cargo", effect:{time:1}},
    {t:"购买飞空艇（需要大量资金）", go:"airship_buy", effect:{time:1}},
    {t:"离开码头", go:"city_free", effect:{time:1}}
  ]
};}

N["airship_routes"] = function(){ return {
  text:function(){var base=["【飞空艇航线表】"];
  for(var k in AIRSHIP_ROUTES){var r=AIRSHIP_ROUTES[k];
    base.push(r.name+"："+r.from+"到"+r.to+"，票价"+r.basePrice+"银月，航程"+r.travelTime+"天，危险度"+r.danger+"%");}
  return base;},
  options:[
    {t:"乘坐交汇城-圣城线", effect:{silver:-15, flag:"route_1"}, go:"airship_travel", effect:{time:1}},
    {t:"乘坐交汇城-北境线", effect:{silver:-25, flag:"route_2"}, go:"airship_travel", effect:{time:2}},
    {t:"乘坐交汇城-金鳞城线", effect:{silver:-30, flag:"route_3"}, go:"airship_travel", effect:{time:2}},
    {t:"乘坐交汇城-承天书院线", effect:{silver:-35, flag:"route_7"}, go:"airship_travel", effect:{time:2}},
    {t:"返回", go:"airship_dock", effect:{time:1}}
  ]
};}

N["airship_book"]={
  text:["售票窗口后面是个打瞌睡的职员。你敲了敲柜台，他猛地惊醒，揉了揉眼睛：「去哪？今天还有几个航班有空位。现金优先，不赊账。」"],pace:"light",
  options:[
    {t:"购买交汇城-圣城线（15银月）", effect:{silver:-15}, go:"airship_travel", effect:{time:1}},
    {t:"购买交汇城-北境线（25银月）", effect:{silver:-25}, go:"airship_travel", effect:{time:2}},
    {t:"算了，不坐了", go:"airship_dock", effect:{time:1}}
  ]
}

N["airship_cargo"]={
  text:["货运代理是个精明的中年人，他翻看着账本：「你有货要运？还是想帮别人运货赚运费？最近银穗商路不太平，货运价格涨了不少。」"],pace:"light",
  options:[
    {t:"承接货运委托（需要飞空艇）", check:{attr:"INT", label:"智力·议价", target:50}, go:"city_free", effect:{gold:5, time:3}},
    {t:"托运自己的货物", effect:{gold:-1}, go:"city_free", effect:{time:1}},
    {t:"离开", go:"airship_dock", effect:{time:1}}
  ]
}

N["airship_buy"] = function(){ return {
  text:function(){var base=["造船厂的老板是个大胡子矮人，他拍了拍身边的飞空艇模型：「想买船？好眼光！从小型飞空艇到飞空巨舰，应有尽有。不过——」他压轻声音，「最便宜的也要500金龙。你有这个钱吗？」"];
  if(S.gold>=500) base.push("你摸了摸钱袋，似乎够买一艘最小的。");
  else base.push("你看了看自己的钱袋，还差得远呢。");
  return base;},
  options:[
    {t:"购买小型飞空艇（500金龙）", effect:{gold:-500, flag:"owns_airship"}, go:"airship_dock", effect:{time:3}},
    {t:"以后再说", go:"airship_dock", effect:{time:1}}
  ]
};}

N["airship_travel"] = function(){ return {
  text:["飞空艇徐徐升空。地面上的建筑越来越小，人像蚂蚁一样在街道上移动。你靠在舷窗边，看着云层在脚下翻涌。这是一种奇妙的感觉——像在飞翔，又像在漂浮。"],pace:"light",
  options:[
    {t:"享受旅程", check:{attr:"SPR", label:"灵性·感知", target:40},
      tier:{crit:function(){return[pickV(["你在飞行中感到了一种前所未有的宁静。高空中的空气清冽，阳光穿过云层洒在你身上。◆全属性+1，SAN恢复+10","你注意到了一种奇异的现象——在云层上方，你看到了远处有一座漂浮的岛屿。◆获得：天空之城线索，感知+2"],"airship_crit")]},
      ok:function(){return[pickV(["旅途平稳。你看了一会儿风景，然后打了个盹。◆旅途顺利","你和旁边的旅客聊了一会儿天，他是个走南闯北的商人。◆获得一些趣闻"],"airship_ok")]},
      fail:function(){return[pickV(["你有点晕艇。高空的颠簸让你胃里翻江倒海。◆体力-10","你在飞艇上被偷了钱包。◆损失2金龙"],"airship_fail")]}},
      go:"airship_arrive", effect:{time:0}},
    {t:"警惕地观察四周", check:{attr:"AGI", label:"敏捷·警觉", target:50}, go:"airship_event", effect:{time:0}}
  ]
};}

N["airship_event"] = function(){ return {tag:"event",
  text:function(){var base=["飞行途中，突然发生了意外！"];
  var evt=SKY_EVENTS_POOL[Math.floor(Math.random()*SKY_EVENTS_POOL.length)];
  var ed=AIRSHIP_EVENTS[evt];
  base.push(ed.name+"："+ed.desc);
  return base;},
  options:[
    {t:"冷静应对", check:{attr:"INT", label:"智力·应对", target:55},
      tier:{ok:function(){return[pickV(["你冷静地分析了情况，采取了正确的应对措施。危机解除了。◆化险为夷","你的应对让船长都刮目相看。◆危机解除，船长好感+20"],"airship_event_ok")]},
      fail:function(){return[pickV(["你的应对不够及时，飞艇受到了一些损伤。◆旅途延迟","情况比你想象的严重，你受了点伤。◆轻伤"],"airship_event_fail")]}},
      go:"airship_arrive", effect:{time:1}},
    {t:"躲起来等事件过去", go:"airship_arrive", effect:{time:1}}
  ]
};}

N["airship_arrive"]={
  text:["飞空艇徐徐降落。你踏上了目的地的土地。高空旅行的余韵还在，但你已经回到了地面。"],pace:"light",
  options:[{t:"继续旅程", go:"city_free", effect:{time:0}}]
}

/* ---- 综合：城市系统菜单 ---- */
/* /v62inj:chunk-city/ N["city_systems"] 已移入 chunks/v62_city.js */
/* ============================================================
   v12 学院线剧情节点
   ============================================================ */

/* ---- 入学考试 ---- */
/* /v62inj:chunk-academy/ N["academy_entrance"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exam_elda"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_practical"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission"] 已移入 chunks/v62_academy.js */
/* ---- 第一学年 ---- */
/* /v62inj:chunk-academy/ N["academy_year1_open"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_course_select"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_roommate"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_midterm"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_final"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_grades"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_vacation_y1"] 已移入 chunks/v62_academy.js */
/* ---- 第二学年 ---- */
/* /v62inj:chunk-academy/ N["academy_year2_open"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_major"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_faction_join"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_midterm"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_purge"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_final"] 已移入 chunks/v62_academy.js */
/* ---- 第三学年·学院暗流 ---- */
/* /v62inj:chunk-academy/ N["academy_year3_open"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_missing_investigate"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_missing_clue"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_mercury_report"] 已移入 chunks/v62_academy.js */
/* ---- 毕业与分流 ---- */


/* /v62inj:chunk-academy/ N["academy_career"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_farewell"] 已移入 chunks/v62_academy.js */
/* ============================================================
   v13 序章重制：11条序章线
   ============================================================ */



N["prologue_opportunity"] = function(){ return {
  text:function(){var base=["日子一天天过去。直到那一天——机遇降临了。"];
  var p=PROLOGUES[S.race+"_"+S.subrace]||PROLOGUES["human_mid"];
  if(p.id=="human_north") base.push("铁门关的军队来村里征兵了。同时，一个艾尔达魔法学院的招生使也来到了这里。");
  if(p.id=="human_mid") base.push("交汇城的学院招生开始了。你的父母拿出积蓄，希望你能去考一考。");
  if(p.id=="human_south") base.push("一艘商船带来了学院招生的消息。你的父亲说：「去试试，我们家需要一个有学问的人。」");
  if(p.id=="human_east") base.push("承天书院的山长路过你的家乡，看中了你的手艺。");
  if(p.id=="human_west") base.push("一艘远洋船带来了大陆各地学院的招生简章。");
  if(p.id=="elf") base.push("精灵女王宣布，今年将选派三名精灵去人类学院做交换生。");
  if(p.id=="dwarf") base.push("熔炉学院的招生官来到了你的锻造坊，看中了你的作品。");
  if(p.id=="orc") base.push("一个人类商人说，熔炉学院正在招收有战斗天赋的兽人学生。");
  if(p.id=="halfbreed") base.push("你收到了一封没有署名的信，信里是一张艾尔达魔法学院的报名表。");
  if(p.id=="halfling") base.push("一个旅行商人说，艾尔达魔法学院有半身人旁听生的名额。");
  if(p.id=="dragon") base.push("你的龙裔血脉引起了学院的注意，他们主动发来特招邀请。");
  return base;},
  options:[
    {t:"接受机遇，准备入学考试", go:"prologue_exam_prep", effect:{time:5}},
    {t:"拒绝，选择另一条路", go:"prologue_alternate", effect:{time:1}}
  ]
};}

N["prologue_exam_prep"] = function(){ return {
  text:["你开始为入学考试做准备。白天干活，晚上读书。日子辛苦但充实。考试的日子越来越近了。"],pace:"light",
  options:[
    {t:"拼命复习（智力）", check:{attr:"INT", label:"智力·备考", target:55},
      tier:{ok:function(){return[pickV(["你准备得很充分，心中有底。◆入学考试目标-10","你不仅复习了考试内容，还自学了一些超纲知识。◆入学考试目标-15，获得教授关注"],"prep_ok")]},
      fail:function(){return[pickV(["你努力了，但基础太差，很多东西看不懂。◆入学考试目标+5","你复习效率不高，时间都花在了不考的内容上。◆入学考试目标+10"],"prep_fail")]}},
      go:"prologue_exam", effect:{time:14}},
    {t:"找关系/走后门（魅力）", check:{attr:"CHA", label:"魅力·游说", target:60},
      go:"prologue_exam", effect:{time:7}},
    {t:"随便考考，听天由命", go:"prologue_exam", effect:{time:7}}
  ]
};}

N["prologue_exam"] = function(){ return {
  text:function(){var p=PROLOGUES[S.race+"_"+S.subrace]||PROLOGUES["human_mid"];
  return ["入学考试的日子到了。你站在"+(p.tag=="贫困生"?"破旧的":"整洁的")+"考场前，吸了口气。这是改变命运的一天。"];},
  options:[
    {t:"参加考试（综合判定）", check:{attr:"INT", label:"智力·入学考", target:50},
      tier:{crit:function(){return[pickV(["你以第一名的成绩通过了考试。招生官当场宣布：你获得了全额奖学金！◆入学标签：天才，金币+50，声望+10","你的表现太过出色，引起了多位教授的争抢。最后你选择了最适合自己的学院。◆入学标签：天才，获得教授推荐"],"exam_crit")]},
      ok:function(){return[pickV(["你顺利通过了考试。虽然不是第一名，但足够入学了。◆入学标签：普通生","你压线通过。好险——差点就落榜了。◆入学标签：压线生"],"exam_ok")]},
      fail:function(){return[pickV(["你落榜了。但招生官看你资质尚可，给了你一个旁听生名额。◆入学标签：旁听生，金币-10","你考试失败了。但一个教授看中了你的某项特长，特招你入学。◆入学标签：特招生"],"exam_fail")]},
      critfail:function(){return[pickV(["你不仅没考过，还在考场上出了丑。所有人都在嘲笑你。但——一个戴兜帽的人向你走来：「跟我来，也许还有别的路。」◆落榜，但触发守望者隐藏路线","你考试时发生了意外（魔法失控/打架/作弊被抓），被禁止入学。但你发现了另一条进入学院的路。◆入学标签：问题学生，走秘密入学路线"],"exam_cf")]}},
      go:"prologue_admission", effect:{time:3}},
    {t:"展示特殊天赋（灵性/力量）", check:{attr:"SPR", label:"灵性·天赋展示", target:55},
      go:"prologue_admission", effect:{time:1}}
  ]
};}





N["prologue_alternate"]={
  text:["你拒绝了学院的邀请。也许你觉得自己不是读书的料，也许你有别的打算。但命运有时候会绕个弯，再把你带回原点。"],pace:"light",
  options:[
    {t:"当冒险者（直接进入大陆线）", go:"city_free", effect:{flag:"skip_academy", time:1}},
    {t:"当学徒（学习一门手艺）", go:"prologue_apprentice", effect:{time:30}},
    {t:" reconsider（重新考虑入学）", go:"prologue_opportunity", effect:{time:1}}
  ]
}

/* ============================================================
   v13 LLM设置面板
   ============================================================ */
N["llm_settings"] = function(){ return {
  text:["LLM文笔增强设置。","点击顶部导航栏的「AI润色」按钮打开设置面板，配置API endpoint、API key和模型名称后即可开启。","开启后，判定文本将通过AI进行文学性润色，但不改变判定结果和事实要素。","支持火山引擎方舟、DeepSeek、OpenAI、本地Ollama等兼容OpenAI格式的API。"],pace:"normal",
  options:[
    {t:"打开AI润色设置面板", run:function(){openLLMSettings();}},
    {t:"返回", go:"city_free", effect:{time:0}}
  ]
};}

/* ============================================================
   v13 动态年度事件系统
   ============================================================ */
/* /v62inj:chunk-academy/ N["academy_year_events"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_event_detail"] 已移入 chunks/v62_academy.js */
/* ============================================================
   v13 学院设施系统
   ============================================================ */
/* /v62inj:chunk-academy/ N["academy_facilities"] 已移入 chunks/v62_academy.js */
N["facility_library"] = function(){ return {
  text:["图书馆里很安静。书架林立，空气中弥漫着旧纸和墨水的味道。你可以在这里借书、研究，或者……碰碰运气。"],pace:"light",
  options:[
    {t:"借阅专业书籍（智力）", check:{attr:"INT", label:"智力·研读", target:50},
      tier:{ok:function(){return[pickV(["你从书中学到了有用的知识。◆技能+1，智力+1","你发现了一本被人遗忘的笔记，里面有独特的见解。◆获得特殊知识"],"lib_ok")]},
      fail:function(){return[pickV(["你看了半天，什么都没看懂。◆无效果","你借的书太难了，越看越糊涂。◆无效果"],"lib_fail")]}},
      go:"academy_facilities", effect:{time:3}},
    {t:"尝试进入禁书区（敏捷）", check:{attr:"AGI", label:"敏捷·潜入", target:65},
      tier:{ok:function(){return[pickV(["你溜进了禁书区，看到了一些不该看的东西。◆获得禁忌知识，SAN-3","你在禁书区发现了一本有趣的书，但没来得及细看就被吓跑了。◆获得线索"],"forbidden_ok")]},
      fail:function(){return[pickV(["你被图书管理员发现了，被赶了出来。◆被警告","你触发了魔法警报，虽然跑掉了但禁书区加强了守卫。◆禁书区守卫+1"],"forbidden_fail")]}},
      go:"academy_facilities", effect:{time:1}},
    {t:"离开图书馆", go:"academy_facilities", effect:{time:0}}
  ]
};}

N["facility_arena"] = function(){ return {
  text:["竞技场里人声鼎沸。学生们在进行战斗训练和决斗。你可以在这里提升战斗技能，或者挑战别人。"],pace:"light",
  options:[
    {t:"参加训练（力量）", check:{attr:"STR", label:"力量·训练", target:50},
      tier:{ok:function(){return[pickV(["训练效果不错，你感到自己变强了。◆力量+1，战斗技能+1","你在训练中领悟了新的战斗技巧。◆获得战斗技巧"],"arena_ok")]},
      fail:function(){return[pickV(["训练中受了点伤，但没大碍。◆HP-5","你训练过度，筋疲力尽。◆疲劳，下次判定-5"],"arena_fail")]}},
      go:"academy_facilities", effect:{time:3}},
    {t:"挑战同学决斗（力量/敏捷）", check:{attr:"STR", label:"力量·决斗", target:55},
      tier:{crit:function(){return[pickV(["你轻松获胜，围观的学生欢呼起来。◆声望+10，金币+15（赌金）","你以一招之差险胜，对手对你刮目相看。◆声望+5，获得对手尊重"],"duel_crit")]},
      ok:function(){return[pickV(["经过一番苦战，你赢了。◆声望+5，金币+10","你赢得很艰难，但毕竟赢了。◆声望+3"],"duel_ok")]},
      fail:function(){return[pickV(["你输了，受了点伤。◆HP-10，声望-3","你被对手击败，围观的人发出嘘声。◆HP-15，声望-5"],"duel_fail")]}},
      go:"academy_facilities", effect:{time:1}},
    {t:"离开竞技场", go:"academy_facilities", effect:{time:0}}
  ]
};}

/* ============================================================
   v13 学院委托系统
   ============================================================ */
/* /v62inj:chunk-academy/ N["academy_quests"] 已移入 chunks/v62_academy.js */
N["quest_research"] = function(){ return {tag:"branch",
  text:["你帮一位教授整理研究资料。工作枯燥，但你在资料中发现了一些有趣的东西。"],pace:"light",
  options:[
    {t:"认真整理（智力）", check:{attr:"INT", label:"智力·整理", target:50},
      tier:{ok:function(){return[pickV(["你整理得又快又好，教授很满意。◆金币+10，教授好感+5","你在资料中发现了一个错误，教授对你刮目相看。◆金币+10，教授好感+10，获得知识"],"research_ok")]},
      fail:function(){return[pickV(["你整理得马马虎虎，教授不太满意。◆金币+5","你不小心弄丢了一份重要资料，教授很生气。◆金币+0，教授好感-5"],"research_fail")]}},
      go:"academy_quests", effect:{time:5}},
    {t:"偷懒应付", effect:{gold:5, flag:"quest_lazy"}, go:"academy_quests", effect:{time:2}}
  ]
};}

/* ============================================================
   v13 政治快照节点
   ============================================================ */
/* /v62inj:chunk-academy/ N["academy_political"] 已移入 chunks/v62_academy.js */
/* ============================================================
   v13 战争冲击节点
   ============================================================ */
N["war_impact"] = function(){ return {
  text:function(){var base=["大陆局势影响着学院。"];
  if(WAR_EFFECTS.iron_gate.active) base.push("铁门关战争持续中："+WAR_EFFECTS.iron_gate.effects.conscription);
  if(WAR_EFFECTS.silver_road.active) base.push("银穗商路危机："+WAR_EFFECTS.silver_road.effects.inflation);
  if(WAR_EFFECTS.seal_weak.active) base.push("深渊封印松动："+WAR_EFFECTS.seal_weak.effects.san_events);
  if(!WAR_EFFECTS.iron_gate.active&&!WAR_EFFECTS.silver_road.active&&!WAR_EFFECTS.seal_weak.active) base.push("目前大陆相对平静。");
  return base;},
  options:[
    {t:"了解详情", go:"war_detail", effect:{time:0}},
    {t:"返回", go:"academy_year1_open", effect:{time:0}}
  ]
};}

/* ============================================================
   v13 同学命运结算
   ============================================================ */
/* /v62inj:chunk-npc/ N["classmate_fates"] 已移入 chunks/v62_npc.js */
/* ============================================================
   v14 七印守护者节点
   ============================================================ */
N["seven_seals_intro"] = function(){ return {
  text:function(){var p=checkSealStatus();
  return ["七印的真相。","你终于知道了——大陆的存亡，系于七道封印。","当前深渊降临进度："+p+"%",
    "第一印（铁门关）已碎，第二印（兽人草原）正在松动，其余五印状态各异。","你要从哪道印开始？"];},
  options:[
    {t:"第一印·铁门关（已碎）", go:"seal_1_intro", effect:{time:1}},
    {t:"第二印·兽人草原（松动）", go:"seal_2_intro", effect:{time:1}},
    {t:"第三印·世界树根（稳定）", go:"seal_3_intro", effect:{time:1}},
    {t:"第四印·永恒熔炉心（稳定）", go:"seal_4_intro", effect:{time:1}},
    {t:"第五印·南方深海（未知）", go:"seal_5_intro", effect:{time:1}},
    {t:"第六印·时光裂隙（不稳定）", go:"seal_6_intro", effect:{time:1}},
    {t:"第七印·深渊神殿（核心）", go:"seal_7_intro", effect:{time:1}},
    {t:"暂时离开", go:"city_free", effect:{time:0}}
  ]
};}





/* /v62inj:chunk-seal/ N["seal_1_outcome"] 已移入 chunks/v62_seal.js */
/* 其他印的intro节点（框架） */














/* /v62inj:chunk-seal/ N["seal_5_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_5_outcome"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_outcome"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_7_intro"] 已移入 chunks/v62_seal.js */
/* ============================================================
   v14 暗蚀会组织线节点
   ============================================================ */


N["eclipse_join"] = function(){ return {
  text:function(){var base=["你加入了暗蚀会。"];
  if(S.flags.eclipse_infiltrator) base.push("当然，你是卧底——你要从内部瓦解这个组织。");
  else base.push("你不知道这是对是错，但你需要力量，需要真相。");
  base.push("你的等级：外围人员。你需要完成任务来提升等级，接触更多秘密。");
  return base;},
  options:[
    {t:"查看可接任务", go:"eclipse_missions", effect:{time:0}},
    {t:"了解组织架构", go:"eclipse_structure", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}

N["eclipse_structure"]={
  text:["暗蚀会五部门：",
    "情报司——渗透、间谍、密码。首脑：瓦伦丁·暗影（你在学院见过他）。",
    "行动司——暗杀、破坏、绑架。首脑：未知。",
    "研究司——深渊魔法、邪神仪式。首脑：未知。",
    "人事司——招募、洗脑、清除叛徒。首脑：未知。",
    "财务司——洗钱、黑市、走私。首脑：未知。",
    "教主之下，五司长分权。而教主……没有人见过他的真面目。"],pace:"normal",
  options:[
    {t:"接取任务", go:"eclipse_missions", effect:{time:0}},
    {t:"离开", go:"eclipse_join", effect:{time:0}}
  ]
}

N["eclipse_missions"] = function(){ return {
  text:function(){var rank=S.flags.eclipseRank||0;
  return ["你的等级："+ECLIPSE_RANKS[rank].name+"。可接任务："];},
  options:[
    {t:"情报司：渗透某势力（难度2）", check:{attr:"CHA", label:"魅力·渗透", target:55},
      tier:{ok:function(){return[pickV(["你成功渗透了目标，获得了有价值的情报。◆暗蚀会声望+10，金币+30","你完成了任务，虽然过程有些惊险。◆暗蚀会声望+5，金币+20"],"eclipse_m1_ok")]},
      fail:function(){return[pickV(["你被发现了，差点被抓。◆暗蚀会声望-5，HP-10","任务失败，你损失了一些资源。◆金币-15"],"eclipse_m1_fail")]}},
      go:"eclipse_rank_check", effect:{time:3}},
    {t:"行动司：破坏目标设施（难度3）", check:{attr:"AGI", label:"敏捷·破坏", target:60},
      go:"eclipse_rank_check", effect:{time:3}},
    {t:"研究司：协助禁忌实验（难度3）", check:{attr:"INT", label:"智力·实验", target:60},
      go:"eclipse_rank_check", effect:{time:3}},
    {t:"人事司：招募新成员（难度2）", check:{attr:"CHA", label:"魅力·招募", target:50},
      go:"eclipse_rank_check", effect:{time:3}},
    {t:"财务司：黑市交易（难度2）", check:{attr:"CHA", label:"魅力·交易", target:50},
      go:"eclipse_rank_check", effect:{time:3}},
    {t:"离开", go:"eclipse_join", effect:{time:0}}
  ]
};}

N["eclipse_rank_check"] = function(){ return {
  text:function(){var rank=S.flags.eclipseRank||0;
  var base=["任务完成。你在暗蚀会的声望提升了。"];
  if(rank>=5) base.push("你已经是教主候选——你接触到了最深的秘密。");
  else if(rank>=3) base.push("你成为了核心成员——你知道了大部分真相。");
  else if(rank>=1) base.push("你成为了正式成员——你开始接触真正的任务。");
  return base;},
  options:[
    {t:"继续接任务", go:"eclipse_missions", effect:{time:0}},
    {t:"（卧底）向守望者传递情报", go:"watcher_intro", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}

N["eclipse_kill"] = function(){ return {
  text:function(){var base=["你突袭了招募者。"];
  if(S.flags.eclipse_kill_success) base.push("你成功了——但暗蚀会不会善罢甘休。你成了他们的目标。");
  else base.push("你失败了——招募者轻易躲开了你的攻击，消失在阴影中。「你会后悔的。」");
  return base;},
  options:[
    {t:"离开", go:"city_free", effect:{flag:"eclipse_enemy", time:1}}
  ]
};}

/* ============================================================
   v14 大陆全面战争节点
   ============================================================ */
N["war_outbreak"] = function(){ return {
  text:function(){var stage=S.flags.warStage||0;
  return ["大陆局势："+WAR_STAGES[stage].name, WAR_STAGES[stage].desc,
    "八大势力各怀鬼胎，战争的阴云笼罩大陆。你要站在哪一边？"];},
  options:[
    {t:"查看各方势力状态", go:"war_factions", effect:{time:0}},
    {t:"接取战争任务", go:"war_missions", effect:{time:0}},
    {t:"选择阵营", go:"war_choose", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}

N["war_factions"] = function(){ return {
  text:function(){var base=["八大势力军力对比："];
  for(var k in WAR_FACTIONS) {
    var f=WAR_FACTIONS[k];
    base.push(f.name+"（"+f.leader+"）：军力"+f.strength+"，立场："+f.stance);
  }
  return base;},
  options:[
    {t:"接取战争任务", go:"war_missions", effect:{time:0}},
    {t:"选择阵营", go:"war_choose", effect:{time:0}},
    {t:"离开", go:"war_outbreak", effect:{time:0}}
  ]
};}

N["war_choose"]={
  text:["选择阵营是一个重大决定——它将影响你在大陆上的立场、可接任务、以及最终结局。",
    "你确定要选择吗？"],pace:"light",
  options:[
    {t:"加入北方公国联盟", effect:{flag:"war_faction_north", rep:10}, go:"war_missions", effect:{time:1}},
    {t:"加入南方商业城邦联盟", effect:{flag:"war_faction_south", gold:50}, go:"war_missions", effect:{time:1}},
    {t:"加入光明教会（圣战）", effect:{flag:"war_faction_church", sanRecovery:10}, go:"war_missions", effect:{time:1}},
    {t:"加入兽人部落", effect:{flag:"war_faction_orc", rep:15}, go:"war_missions", effect:{time:1}},
    {t:"保持中立", effect:{flag:"war_neutral"}, go:"war_missions", effect:{time:1}},
    {t:"再想想", go:"war_outbreak", effect:{time:0}}
  ]
}

N["war_missions"] = function(){ return {
  text:["战争任务。每一个任务都可能改变战局。"],pace:"light",
  options:[
    {t:"刺杀敌方将领（难度4）", check:{attr:"AGI", label:"敏捷·刺杀", target:65},
      tier:{crit:function(){return[pickV(["你成功刺杀了敌方将领！敌军陷入混乱。◆军功+30，金币+100，敌方军力-10","你不仅完成了刺杀，还伪造了现场，让敌方内讧。◆军功+40，金币+120"],"war_crit")]},
      ok:function(){return[pickV(["你完成了任务，顺利撤离。◆军功+20，金币+80","任务成功，但你受了点伤。◆军功+15，金币+60，HP-10"],"war_ok")]},
      fail:function(){return[pickV(["刺杀失败，你被发现了，勉强逃脱。◆军功-5，HP-20","任务失败，你损失了装备。◆金币-30"],"war_fail")]},
      critfail:function(){return[pickV(["你被俘虏了！◆被关押，需要逃脱","你误伤了无辜，声名狼藉。◆声望-20"],"war_cf")]}},
      go:"war_outcome", effect:{time:3}},
    {t:"破坏敌方补给线（难度3）", check:{attr:"AGI", label:"敏捷·破坏", target:60},
      go:"war_outcome", effect:{time:3}},
    {t:"外交谈判（难度3）", check:{attr:"CHA", label:"魅力·谈判", target:60},
      go:"war_outcome", effect:{time:3}},
    {t:"救援被困部队（难度4）", check:{attr:"STR", label:"力量·救援", target:65},
      go:"war_outcome", effect:{time:3}},
    {t:"侦察敌方阵地（难度2）", check:{attr:"AGI", label:"敏捷·侦察", target:55},
      go:"war_outcome", effect:{time:2}},
    {t:"参加主力会战（难度5）", check:{attr:"STR", label:"力量·会战", target:70},
      go:"war_outcome", effect:{time:5}},
    {t:"离开", go:"war_outbreak", effect:{time:0}}
  ]
};}

N["war_outcome"] = function(){ return {
  text:function(){var base=["战争任务结束。"];
  if(S.flags.warStage>=3) base.push("深渊势力开始介入——这场战争，已经不只是人类之间的争斗了。");
  return base;},
  options:[
    {t:"继续战斗", go:"war_missions", effect:{time:0}},
    {t:"查看战局", go:"war_factions", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}


/* ============================================================
   v14 黄林晶遗产节点
   ============================================================ */
/* /v62inj:chunk-relic/ N["relic_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_list"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_staff"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_memory"] 已移入 chunks/v62_relic.js */
/* ============================================================
   v14 神系博弈节点
   ============================================================ */
N["faith_intro"]={tag:"branch",
  text:["大陆十大神系。每一个都有自己的信徒、神殿、祭司和 agenda。",
    "你信仰哪位神？或者——你是无神论者？",
    "信仰不是装饰——它会影响你在神殿区域的待遇、可接的任务、以及最终的结局。"],pace:"light",
  options:[
    {t:"选择信仰光明神系", effect:{flag:"faith_light", faithLevel:1}, go:"faith_oracle", effect:{time:1}},
    {t:"选择信仰自然神系", effect:{flag:"faith_nature", faithLevel:1}, go:"faith_oracle", effect:{time:1}},
    {t:"选择信仰财富神系", effect:{flag:"faith_wealth", faithLevel:1}, go:"faith_oracle", effect:{time:1}},
    {t:"选择信仰知识神系", effect:{flag:"faith_knowledge", faithLevel:1}, go:"faith_oracle", effect:{time:1}},
    {t:"选择信仰死亡神系（异端）", effect:{flag:"faith_death", faithLevel:1, sanLoss:5}, go:"faith_oracle", effect:{time:1}},
    {t:"成为无神论者", effect:{flag:"atheist"}, go:"faith_atheist", effect:{time:1}},
    {t:"查看十大神系详情", go:"faith_list", effect:{time:0}}
  ]
}

N["faith_list"] = function(){ return {tag:"branch",
  text:function(){var base=["十大神系一览："];
  for(var k in PANTHEONS_FULL) {
    var p=PANTHEONS_FULL[k];
    base.push(p.name+"（"+p.leader+"）：信徒"+p.followers+" — "+p.desc);
  }
  return base;},
  options:[
    {t:"返回选择信仰", go:"faith_intro", effect:{time:0}}
  ]
};}

N["faith_oracle"] = function(){ return {tag:"branch",
  text:function(){var faith=S.flags.faith||"light";
  var p=PANTHEONS_FULL[faith]||PANTHEONS_FULL.light;
  return ["你成为了"+p.name+"的信徒。","神谕：「"+p.oracle+"」",
    "当前信仰等级："+(FAITH_LEVELS[S.flags.faithLevel||1].name),
    "你可以通过供奉、祈祷、完成神谕任务来提升信仰等级。"];},
  options:[
    {t:"完成神谕任务", go:"faith_mission", effect:{time:1}},
    {t:"在神殿祈祷（恢复SAN）", effect:{sanRecovery:10, time:1}, go:"faith_oracle", effect:{time:1}},
    {t:"供奉金币", effect:{gold:-20, faithLevel:1}, go:"faith_oracle", effect:{time:1}},
    {t:"离开神殿", go:"city_free", effect:{time:0}}
  ]
};}

N["faith_mission"] = function(){ return {tag:"branch",
  text:function(){var faith=S.flags.faith||"light";
  var p=PANTHEONS_FULL[faith]||PANTHEONS_FULL.light;
  return [p.name+"的神谕任务：", p.oracle+"——祭司给了你一个具体任务。"];},
  options:[
    {t:"接受任务", check:{attr:"CHA", label:"魅力·传教", target:55},
      tier:{ok:function(){return[pickV(["你完成了神谕任务，信仰等级提升！◆信仰等级+1，声望+10","任务完成，祭司对你刮目相看。◆信仰等级+1，金币+30"],"faith_ok")]},
      fail:function(){return[pickV(["任务失败，祭司很失望。◆信仰等级-1","你在任务中动摇了信仰。◆SAN-5"],"faith_fail")]}},
      go:"faith_oracle", effect:{time:5}},
    {t:"拒绝任务", effect:{faithLevel:-1}, go:"faith_oracle", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}

N["faith_atheist"]={tag:"branch",
  text:["你选择不信仰任何神。",
    "在这个神明真实存在的世界里，无神论者是少数派——但也是最自由的。",
    "你不会获得神术和神殿便利，但也不会被信仰束缚。",
    "有人说，无神论者是最接近真相的人——因为他们不接受任何既定的答案。"],pace:"light",
  options:[
    {t:"坚持无神论", effect:{flag:"confirmed_atheist", sanRecovery:5}, go:"city_free", effect:{time:1}},
    {t:"重新考虑信仰", go:"faith_intro", effect:{time:0}}
  ]
}

/* ============================================================
   v14 家族政治节点
   ============================================================ */
N["house_intro"]={
  text:["十二大家族。大陆的真正统治者——不是国王，不是教皇，而是这些血脉相连又互相倾轧的家族。",
    "你出身于哪个家族？或者——你与哪个家族有渊源？",
    "家族关系是一张网：联姻、血仇、密盟。每一步都可能让你崛起，也可能让你毁灭。"],pace:"light",
  options:[
    {t:"查看家族关系网", go:"house_relations", effect:{time:0}},
    {t:"接触美第奇家族（主角母族）", go:"house_medici", effect:{time:1}},
    {t:"接触金秤家族（主角外祖家）", go:"house_goldscale", effect:{time:1}},
    {t:"接触铁拳家族（北方霸主）", go:"house_ironfist", effect:{time:1}},
    {t:"接触圣光家族（教会权贵）", go:"house_holyorder", effect:{time:1}},
    {t:"接触暗影家族（地下势力）", go:"house_shadow", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
}

N["house_relations"] = function(){ return {
  text:function(){var base=["家族关系网："];
  base.push("【联姻】");
  for(var i=0;i<HOUSE_RELATIONS_FULL.marriages.length;i++){
    var m=HOUSE_RELATIONS_FULL.marriages[i];
    base.push(m.house1+"↔"+m.house2+"："+m.status+" — "+m.note);
  }
  base.push("【血仇】");
  for(var j=0;j<HOUSE_RELATIONS_FULL.blood_feuds.length;j++){
    var f=HOUSE_RELATIONS_FULL.blood_feuds[j];
    base.push(f.house1+"↔"+f.house2+"："+f.reason+"（烈度"+f.intensity+"/10）");
  }
  base.push("【密盟】");
  for(var k=0;k<HOUSE_RELATIONS_FULL.secret_alliances.length;k++){
    var a=HOUSE_RELATIONS_FULL.secret_alliances[k];
    base.push(a.house1+"↔"+a.house2+"："+a.reason+" — "+a.note);
  }
  return base;},
  options:[
    {t:"返回", go:"house_intro", effect:{time:0}}
  ]
};}

N["house_medici"] = function(){ return {
  text:["美第奇家族。南方商业城邦的无冕之王。",
    "你的母亲伊莎贝拉·金秤嫁入了这个家族——然后发生了一些事，让你被托孤到孤儿院。",
    "现在，你站在美第奇家族的大门前。你的哥哥亚历山大在里面——他知道你是谁吗？",
    "你要以什么身份进入？"],pace:"light",
  options:[
    {t:"以继承人身份回归（魅力）", check:{attr:"CHA", label:"魅力·回归", target:65},
      tier:{ok:function(){return[pickV(["你成功证明了自己的身份。亚历山大看着你，眼神复杂：「你终于回来了。」◆美第奇家族承认你的身份","家族长老会接受了你——但你感觉到，有人不希望你回来。◆身份确认，但有内鬼"],"medici_ok")]},
      fail:function(){return[pickV(["你被拒之门外——他们不相信你。◆身份未确认，声望-5","亚历山大私下见了你，但他说：「现在还不是时候。」◆获得哥哥的暗中支持"],"medici_fail")]}},
      go:"house_medici_meeting", effect:{time:2}},
    {t:"以冒险者身份接触", go:"house_medici_meeting", effect:{time:1}},
    {t:"暗中调查", check:{attr:"AGI", label:"敏捷·潜入", target:60},
      go:"house_medici_meeting", effect:{time:2}},
    {t:"离开", go:"house_intro", effect:{time:0}}
  ]
};}

N["house_medici_meeting"]={
  text:["你进入了美第奇家族的议事厅。",
    "亚历山大坐在主位上——他比你大五岁，眼神里有你看不懂的东西。",
    "「你来了。」他说，「我等这一天等了十五年。」",
    "「你想知道真相吗？关于父亲，关于母亲，关于你为什么被送走——」"],pace:"light",
  options:[
    {t:"询问真相", go:"origin_clue", effect:{time:1}},
    {t:"要求家族地位", effect:{flag:"medici_claim", rep:10}, go:"house_intro", effect:{time:1}},
    {t:"保持警惕，不表态", effect:{flag:"medici_cautious"}, go:"house_intro", effect:{time:1}},
    {t:"离开", go:"house_intro", effect:{time:0}}
  ]
}

N["house_goldscale"]={
  text:["金秤家族。自由城邦的老牌贵族，以公平和法律闻名。",
    "你的母亲伊莎贝拉是金秤家族的女儿——她嫁给美第奇家族后，发生了什么？",
    "金秤家族的人看你的眼神很复杂——他们知道你的身份，但似乎在害怕什么。"],pace:"light",
  options:[
    {t:"询问母亲的往事（魅力）", check:{attr:"CHA", label:"魅力·询问", target:60},
      go:"origin_clue", effect:{time:2}},
    {t:"寻求金秤家族支持", effect:{flag:"goldscale_support", rep:5}, go:"house_intro", effect:{time:1}},
    {t:"离开", go:"house_intro", effect:{time:0}}
  ]
}

N["house_ironfist"]={
  text:["铁拳家族。北方公国的实际统治者，铁门关战役的主导者。",
    "格雷戈尔·铁拳——这个名字在北方就是传奇。他的儿子小约翰是你的同学。",
    "铁拳家族正在备战——他们知道，兽人不会善罢甘休。"],pace:"light",
  options:[
    {t:"请求加入军队", effect:{flag:"ironfist_army", rep:10}, go:"war_outbreak", effect:{time:1}},
    {t:"询问铁门关真相（智力）", check:{attr:"INT", label:"智力·询问", target:55},
      go:"seal_1_intro", effect:{time:1}},
    {t:"离开", go:"house_intro", effect:{time:0}}
  ]
}

N["house_holyorder"]={
  text:["圣光家族。教会最有权势的家族，出了三任教皇。",
    "他们是净化令的坚定支持者——在他们眼里，灵魂法师、精灵、深渊接触者，都是异端。",
    "你站在圣光家族的大门前，能感受到里面传出的神圣气息——以及隐藏在神圣之下的冷酷。"],pace:"light",
  options:[
    {t:"寻求教会庇护", effect:{flag:"holyorder_protected", sanRecovery:5}, go:"faith_intro", effect:{time:1}},
    {t:"调查净化令真相（智力）", check:{attr:"INT", label:"智力·调查", target:60},
      go:"house_intro", effect:{time:2}},
    {t:"离开", go:"house_intro", effect:{time:0}}
  ]
}

N["house_shadow"]={
  text:["暗影家族。地下世界的隐秘势力，与暗蚀会有千丝万缕的联系。",
    "他们的据点不在地图上——你需要通过特殊渠道才能找到。",
    "现在，你站在一扇没有标记的门前。门开了，里面是一片黑暗。",
    "「欢迎。」一个声音从黑暗中传来，「我们等你很久了——黄林晶的后人。」"],pace:"light",
  options:[
    {t:"进入暗影家族据点", check:{attr:"SPR", label:"灵性·勇气", target:55},
      go:"eclipse_intro", effect:{time:1}},
    {t:"询问他们为什么知道你", check:{attr:"CHA", label:"魅力·询问", target:60},
      go:"origin_clue", effect:{time:1}},
    {t:"离开（这太危险了）", go:"house_intro", effect:{time:0}}
  ]
}


/* ============================================================
   v14 深渊降临终局节点
   ============================================================ */
/* /v62inj:chunk-abyss/ N["abyss_omen"] 已移入 chunks/v62_abyss.js */
N["messenger_fight"] = function(){ return {
  text:["深渊神殿。七使者之一挡在你面前。",
    "「凡人，你不该来这里。」它的声音像无数人同时低语。",
    "「但既然来了——就成为深渊的一部分吧。」"],pace:"light",
  options:[
    {t:"战斗（全属性判定）", check:{attr:"STR", label:"力量·战斗", target:70},
      tier:{crit:function(){return[pickV(["你一击击败了使者！它的身体化为黑烟消散。◆击败使者！深渊进度-15","你找到了使者的弱点，一击制胜。◆击败使者！获得使者核心"],"msg_crit")]},
      ok:function(){return[pickV(["经过苦战，你击败了使者。◆击败使者！HP-20，深渊进度-10","你赢了，但受了重伤。◆击败使者！HP-35，SAN-5"],"msg_ok")]},
      fail:function(){return[pickV(["你不是使者的对手，被击退了。◆HP-30，深渊进度+5","你勉强逃脱，但使者的力量影响了你。◆SAN-10"],"msg_fail")]},
      critfail:function(){return[pickV(["你被使者重创，差点死去。◆HP-50，SAN-15，深渊进度+10","你被使者的力量污染了——你感觉到深渊在你体内。◆获得深渊污染，SAN-20"],"msg_cf")]}},
      go:"god_arrival", effect:{time:3}},
    {t:"尝试谈判（魅力）", check:{attr:"CHA", label:"魅力·谈判", target:75},
      go:"god_arrival", effect:{time:2}},
    {t:"撤退", go:"abyss_omen", effect:{time:1}}
  ]
};}

N["god_arrival"]={
  text:["七使者被击败了——但这只是开始。",
    "天空裂开了。四邪神的化身从裂缝中降临。",
    "恐虐的战火在北方燃烧，纳垢的瘟疫在南方蔓延，奸奇的迷宫在东部扭曲，色孽的幻境在西部诱惑。",
    "大陆陷入了前所未有的危机。所有势力——人类、精灵、矮人、兽人——都必须做出选择。"],pace:"light",
  options:[
    {t:"联合所有势力对抗邪神", go:"final_battle", effect:{time:3}},
    {t:"利用邪神之间的矛盾", check:{attr:"INT", label:"智力·谋略", target:70},
      go:"final_battle", effect:{time:2}},
    {t:"寻找黄林晶的终极遗产（铸印）", go:"relic_intro", effect:{time:1}},
    {t:"直面深渊之主", go:"abyss_lord", effect:{time:1}}
  ]
}

/* /v62inj:chunk-abyss/ N["abyss_lord"] 已移入 chunks/v62_abyss.js */
N["final_battle"] = function(){ return {
  text:["决战前夜，你一个人坐在营火边。", "火光照着你的手。这双手，你看了很多年——小时候的冻疮疤，练剑磨出的茧，还有一道很淡的、不知道什么时候留下的旧伤。它们都在，像这双手写满的注脚。", "身后传来脚步声。你没有回头。来人在你旁边坐下，也看着火，很久没有说话。", "「紧张吗？」她问。", "你看着火，想了想：「紧张。但也不是很紧张。」", "「为什么？」", "「因为该做的都做了。」你说，「路走到这里，剩下的，就是走完它。」", "她没有接话。你们就这么坐着，看着火。火苗跳着，把你们俩的影子拉长又缩短。远处，营地里传来低低的说话声——是士兵们在互相打气。", "最终决战。", "你联合了所有能联合的势力——人类、精灵、矮人、兽人，甚至暗蚀会的叛徒。", "你的同学们都在：塞西莉亚在施放最强的魔法，亚历山大在指挥军队，耗子在敌后破坏，玛丽在治愈伤员，夜在守望者的位置上战斗。", "这是大陆的最后一战。你准备好了吗？", "天亮的时候，你醒了。", "你身上盖着一条毯子——不是你的。你坐起来，看见她站在营地边，正在系自己的剑带。她没有回头，说：「醒了？走吧。」", "你站起来，活动了一下手脚。晨光很亮，把整个营地照得清清楚楚——每一张脸都醒着，每一把剑都磨好了。", "你走到队伍前面。没有人喊口号，没有人说漂亮话。所有人都看着你，等你说出那一个字。", "你张了张嘴。你想说点什么——可最后，你只说了一句：「走吧。」", "没有人回答。但所有人，都站了起来。"],pace:"normal" /*v45inj:final_battle*/,
  options:[
    {t:"发起总攻（全属性最终判定）", check:{attr:"STR", label:"力量·总攻", target:75},
      tier:{crit:function(){return[pickV(["联军势如破竹！四邪神的化身被逐一击败。◆决战胜利！进入深渊之主战","你在战场上展现了传奇般的力量，所有人都在欢呼你的名字。◆决战胜利！声望+50"],"battle_crit")]},
      ok:function(){return[pickV(["经过惨烈的战斗，联军获胜了。但伤亡惨重。◆决战胜利！HP-30","你赢了——但你的一些同学永远留在了战场上。◆决战胜利！触发同学死亡剧情"],"battle_ok")]},
      fail:function(){return[pickV(["联军陷入劣势——你需要找到新的方法。◆决战僵持，需要新策略","你受了重伤，被迫撤退。◆HP-40，需要重新整备"],"battle_fail")]},
      critfail:function(){return[pickV(["联军溃败！大陆陷入绝望。◆决战失败，触发悲剧结局","你最亲密的同学战死了——你崩溃了。◆SAN-30，触发特殊剧情"],"battle_cf")]}},
      go:"abyss_lord", effect:{time:5}},
    {t:"使用谋略（智力）", check:{attr:"INT", label:"智力·谋略", target:70},
      go:"abyss_lord", effect:{time:3}},
    {t:"撤退整备", go:"city_free", effect:{time:1}}
  ]
};}

N["ending"] = function(){ return {tag:"ending",
  text:function(){var ending;
  if(S.flags.use_cast_seal) ending=ENDINGS_ABYSS[6];
  else if(S.flags.abyss_lord_crit) ending=ENDINGS_ABYSS[0];
  else if(S.flags.abyss_lord_cf) ending=ENDINGS_ABYSS[2];
  else ending=ENDINGS_ABYSS[Math.floor(Math.random()*ENDINGS_ABYSS.length)];
  /* v76 P2-2 周目记录（幂等：每局只记一次） */
  try{
    if(!S._endingRecorded){
      S._endingRecorded=true;
      var _eid = ending && ending.name || "未知结局";
      S.runHistory = S.runHistory||[];
      S.runHistory.push({ending:_eid, days:S.day||0, realm:S.realm||0, ng:S.ngPlus||1, ts:Date.now()});
      if(S.runHistory.length>50) S.runHistory=S.runHistory.slice(-50);
      S.endingsCollected = S.endingsCollected||[];
      if(S.endingsCollected.indexOf(_eid)<0) S.endingsCollected.push(_eid);
      try{ if(typeof saveGame==="function") saveGame(); }catch(_e){}
    }
  }catch(_e){}
  return["【结局："+ending.name+"】", ending.desc, "——"+ending.tone,
    "你的故事结束了。但大陆的故事，还在继续。", "故事走到这里，要说再见了。", "你从那个小地方出发，走了很远很远的路。你见过雪原上独行的旅人，见过深海里发光的符文，见过一座城在你面前醒来，见过一个人在你面前老去。", "你做过一些对的决定，也做过一些后来才知道不对的决定。你帮过一些人，也伤过一些人。你得到过一些东西，也弄丢过一些东西。", "可你还记得来时的路。你还记得，那个早晨，你锁上门，转身，走了。", "这一路上，你没有回头。", "——直到现在。现在，你可以回头看一眼了。", "看看你来时的路。看看那些你还记得的人。看看那个曾经站在路口，不知道往哪走的自己。", "然后，继续往前。"];} /*v45inj:ending*/,
  options:[{t:"查看后日谈", go:"epilogue", effect:{time:0}},
    {t:"重新开始（新周目）", effect:{flag:"new_playthrough"}, go:"prologue_start", effect:{time:1}}, {"t": "多年以后，回到守望者塔", "go": "ending_after_watcher"}]
} /*v45opt:ending*/;}

N["epilogue"] = function(){ return {tag:"ending",
  text:function(){var base=["后日谈。"];
  if(S.flags.classmate_cecilia_alive) base.push("塞西莉亚成为了大陆最伟大的魔法师，她在艾尔达魔法学院设立了以你命名的奖学金。");
  if(S.flags.classmate_alex_alive) base.push("亚历山大接管了美第奇家族，他用家族的财富资助了大陆的重建。");
  if(S.flags.classmate_mary_alive) base.push("玛丽成为了最年轻的圣女，她致力于治愈战争留下的创伤。");
  base.push("你的名字被铭刻在七印之下——后世的人会记得，曾经有一个人，拯救了大陆。");
  return base;},
  options:[
    {t:"完", go:"prologue_start", effect:{time:0}}
  ]
};}

/* ============================================================
   v14 守望者秘史节点
   ============================================================ */
N["watcher_intro"]={
  text:["守望者。",
    "一个存在了三千年的秘密组织。他们守护七印，监控深渊，在阴影中维持着大陆的平衡。",
    "奥雷利安·晨曦——半神，活了三千年，守望者的首席守护者。",
    "他站在你面前，眼神疲惫但坚定：「你终于来了。黄林晶预言过这一天。」"],pace:"light",
  options:[
    {t:"加入守望者", effect:{flag:"watcher_joined", watcherRank:1}, go:"watcher_missions", effect:{time:1}},
    {t:"询问守望者的历史", go:"watcher_history", effect:{time:1}},
    {t:"询问塞拉芬的真相", go:"seraph_truth", effect:{time:1}},
    {t:"询问奥雷利安的回忆", go:"aurelian_memory", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
}

N["watcher_history"] = function(){ return {
  text:function(){var base=["守望者三千年历史："];
  for(var i=0;i<WATCHERS_HISTORY.length;i++){
    var h=WATCHERS_HISTORY[i];
    base.push("【"+h.era+"】"+h.event+"（"+h.year+"）："+h.desc);
  }
  return base;},
  options:[
    {t:"了解第一次大分裂详情", go:"watcher_schism", effect:{time:1}},
    {t:"返回", go:"watcher_intro", effect:{time:0}}
  ]
};}



N["seraph_truth"]={tag:"branch",
  text:{default:["塞拉芬·深渊之花。","曾经的守望者高层，墨丘利的挚爱。","五百年前，她试图打开第七印——不是为了毁灭，而是为了「与深渊之主对话」。","她认为深渊不是纯粹的恶——它只是被误解的存在。","墨丘利阻止了她。塞拉芬被封印在地下图书馆最深层。","墨丘利因此离开了守望者——他至今不知道自己做对了没有。","「你想见她吗？」奥雷利安问，「她还在那里——活着，但永远醒不来。」"],ifRelation:{npc:"mentor_moritz",op:">=",val:80,yes:["他抓住你的手腕，老人的手竟很有力：“金秤的事，我查了大半辈子。”他声音发颤，“你……你是头一个，让我觉得这事能有个着落的人。”"],no:{ifRelation:{npc:"mentor_moritz",op:">=",val:60,yes:["藏书塔的密室里，老莫里茨先生借着烛火翻着那卷旧档，忽然笑了：“找到了。”他指着泛黄的页角，“三十年前，金秤行最后一笔账——记在晨天城。”"],no:{ifRelation:{npc:"mentor_moritz",op:"<=",val:-60,yes:["他把旧档合上，吹灭蜡烛：“这是教会的禁档。你我不该出现在这儿——今天的事，当没见过。”"],no:null}}}}}},pace:"normal",
  options:[
    {t:"想见塞拉芬", check:{attr:"SPR", label:"灵性·勇气", target:65},
      go:"seraph_visit", effect:{time:2}},
    {t:"这太危险了", go:"watcher_intro", effect:{time:0}}
  ]
}

N["seraph_visit"] = function(){ return {tag:"branch",
  text:["地下图书馆最深层。",
    "塞拉芬悬浮在封印中，像睡着了一样。她的美丽不属于人间——那是一种超越了生死的宁静。",
    "你靠近她，听到了她的梦呓：「深渊……不是敌人……它只是……孤独……」",
    "封印在轻震——她在试图醒来。"],pace:"light",
  options:[
    {t:"尝试唤醒她（灵性）", check:{attr:"SPR", label:"灵性·唤醒", target:75},
      tier:{ok:function(){return[pickV(["塞拉芬睁开了眼睛——她看着你，露出了一个跨越五百年的微笑。◆塞拉芬苏醒！获得深渊真相","你唤醒了她的意识——但她的身体还在封印中。她告诉你：「七印的本质不是封印，而是隔离。深渊之主……很孤独。」◆获得关键真相"],"seraph_ok")]},
      fail:function(){return[pickV(["你无法唤醒她——封印太强了。◆未唤醒，SAN-5","你被封印的力量反弹了。◆HP-15"],"seraph_fail")]}},
      go:"watcher_intro", effect:{time:2}},
    {t:"离开", go:"watcher_intro", effect:{time:0}}
  ]
};}

N["aurelian_memory"] = function(){ return {
  text:function(){var m=AURELIAN_MEMORIES[Math.floor(Math.random()*AURELIAN_MEMORIES.length)];
  return ["奥雷利安的回忆：", "「"+m+"」",
    "他的声音很轻，像是在说给风听。三千年的孤独，都浓缩在这一句话里。"];},
  options:[
    {t:"再听一段回忆", go:"aurelian_memory", effect:{time:1}},
    {t:"返回", go:"watcher_intro", effect:{time:0}}
  ]
};}

N["watcher_missions"] = function(){ return {
  text:function(){var rank=S.flags.watcherRank||0;
  return ["你的守望者等级："+WATCHER_RANKS[rank].name+"。可接任务："];},
  options:[
    {t:"监控异常（难度1）", check:{attr:"INT", label:"智力·调查", target:50},
      go:"watcher_mission_outcome", effect:{time:3}},
    {t:"检查封印（难度2）", check:{attr:"SPR", label:"灵性·检查", target:55},
      go:"watcher_mission_outcome", effect:{time:3}},
    {t:"渗透暗蚀会（难度4）", check:{attr:"CHA", label:"魅力·渗透", target:65},
      go:"watcher_mission_outcome", effect:{time:5}},
    {t:"保护关键人物（难度3）", check:{attr:"STR", label:"力量·保护", target:60},
      go:"watcher_mission_outcome", effect:{time:3}},
    {t:"寻找黄林晶遗产（难度3）", go:"relic_intro", effect:{time:0}},
    {t:"离开", go:"watcher_intro", effect:{time:0}}
  ]
};}

N["watcher_mission_outcome"] = function(){ return {
  text:function(){var rank=S.flags.watcherRank||0;
  var base=["任务完成。你的守望者声望提升了。"];
  if(rank>=2) base.push("你成为了守护者——你开始接触七印的全部真相。");
  return base;},
  options:[
    {t:"继续接任务", go:"watcher_missions", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}


/* ============================================================
   v14 主角身世节点
   ============================================================ */
/* /v62inj:chunk-origin/ N["origin_clue"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_generic_clue"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_medici_hint"] 已移入 chunks/v62_origin.js */
N["memory_view"] = function(){ return {
  text:function(){
    if(!S.flags.medici_heir) return ["你没有被封印的记忆。你的身世，需要用其他方式去寻找。"];
    var base=["已解锁的记忆碎片："];
    if(!S.flags.memories || S.flags.memories.length==0) base.push("（暂无）");
    else for(var i=0;i<S.flags.memories.length;i++){
      var m=MEDICI_MEMORY_FRAGMENTS[S.flags.memories[i]-1];
      if(m) base.push("【碎片"+m.id+"】"+m.content);
    }
    return base;},
  options:[
    {t:"返回", go:"origin_clue", effect:{time:0}}
  ]
};}

N["memory_unlock"] = function(){ return {
  text:function(){
    if(!S.flags.medici_heir) return ["你没有被封印的记忆。"];
    var next=(S.flags.memoryUnlocked||0)+1;
    if(next>MEDICI_MEMORY_FRAGMENTS.length) return ["你已经解锁了全部记忆碎片。你知道了全部真相。"];
    var m=MEDICI_MEMORY_FRAGMENTS[next-1];
    S.flags.memoryUnlocked=next;
    if(!S.flags.memories) S.flags.memories=[];
    S.flags.memories.push(next);
    return ["【记忆碎片 "+next+"】触发条件："+m.trigger, m.content,
      "这段记忆在你脑海中回荡——你离真相又近了一步。"];},
  options:[
    {t:"继续寻找记忆", go:"origin_clue", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}

N["mother_rescue"] = function(){ return {
  text:function(){
    if(!S.flags.medici_heir) return ["你没有需要救援的母亲。你的身世故事，走的是另一条路。"];
    return ["你找到了母亲的囚禁地——金秤家族的地下密室。",
    "伊莎贝拉·金秤，你的母亲，被囚禁在这里十五年了。",
    "她看到你，眼泪流了下来：「普路托斯……我的孩子……你终于来了……」",
    "「你父亲……他发现了美第奇家族和暗蚀会的交易……他被灭口了……」",
    "「我被金秤家族囚禁……因为我知道太多……」",
    "「孩子，你要小心……亚历山大……他不是你的敌人……但他也有自己的秘密……」"];},
  options:[
    {t:"救出母亲", check:{attr:"AGI", label:"敏捷·救援", target:65},
      tier:{ok:function(){return[pickV(["你成功救出了母亲！十五年的囚禁终于结束了。◆母亲获救！触发家族和解剧情","你带着母亲逃了出来——但金秤家族不会善罢甘休。◆母亲获救，但被金秤家族追杀"],"rescue_ok")]},
      fail:function(){return[pickV(["救援失败——你被发现了，母亲被转移到了更秘密的地方。◆救援失败，需要重新计划","你差点被抓——但你确认了母亲还活着。◆获得线索，需要更强的力量"],"rescue_fail")]}},
      go:"origin_choice", effect:{time:3}},
    {t:"先不救，收集更多证据", go:"origin_choice", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}

/* /v62inj:chunk-origin/ N["origin_choice"] 已移入 chunks/v62_origin.js */
/* ============================================================
   v14 灭族幸存者节点
   ============================================================ */
N["extinct_clue"]={
  text:["被遗忘的种族。",
    "大陆历史上，有六个种族被灭绝了。史书上写着他们是「邪恶的」「野蛮的」「该被消灭的」。",
    "但真相是什么？",
    "你可以去寻找他们的幸存者——如果还有的话。"],pace:"light",
  options:[
    {t:"古代龙族（龙裔）", go:"extinct_dragon", effect:{time:1}},
    {t:"巨人族", go:"extinct_giant", effect:{time:1}},
    {t:"翼人族", go:"extinct_winged", effect:{time:1}},
    {t:"水族", go:"extinct_aquan", effect:{time:1}},
    {t:"水晶族", go:"extinct_crystal", effect:{time:1}},
    {t:"回声族", go:"extinct_echo", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
}

N["extinct_dragon"] = function(){ return {
  text:["龙族。大陆曾经的守护者。",
    "神战中，他们被诸神联合灭绝——因为龙族知道了诸神的秘密。",
    "现在，只有龙裔体内还流淌着稀薄的龙族血脉。",
    "你在北方山脉深处找到了一个隐藏的龙裔部落——他们在等待龙族的复兴。"],pace:"light",
  options:[
    {t:"帮助龙裔复兴（需要龙裔身份或高声望）", check:{attr:"CHA", label:"魅力·说服", target:65},
      tier:{ok:function(){return[pickV(["你说服了龙裔部落——他们愿意加入你的阵营。◆获得龙裔盟友！复兴进度+1","龙裔长老认可了你——他传授了你失传的龙语魔法。◆获得龙语魔法！"],"dragon_ok")]},
      fail:function(){return[pickV(["龙裔部落不信任你——他们被人类背叛过太多次。◆未获得盟友","你被赶了出来——龙裔不欢迎外来者。◆声望-5"],"dragon_fail")]}},
      go:"race_choice", effect:{time:3}},
    {t:"调查龙族灭绝的真相", go:"genocide_truth", effect:{time:2}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
};}

N["extinct_giant"]={
  text:["巨人族。被人类和矮人联合灭绝的种族。",
    "史书说巨人是野蛮的怪物——但真相是，人类觊觎他们的矿脉。",
    "你在北方山脉深处找到了极少数巨人后裔——他们藏在山洞里，不敢见人。"],pace:"light",
  options:[
    {t:"帮助巨人后裔", check:{attr:"CHA", label:"魅力·帮助", target:60},
      go:"race_choice", effect:{time:3}},
    {t:"调查灭绝真相", go:"genocide_truth", effect:{time:2}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
}

N["extinct_aquan"]={
  text:["水族。南方深海的智慧种族。",
    "他们被人类渔民灭绝——但人类不知道，水族世代守护着第五印。",
    "水族的灭绝是暗蚀会策划的——他们需要第五印松动。",
    "你在深海遗迹中找到了水族最后的遗物——以及一个可能的混血后裔。"],pace:"light",
  options:[
    {t:"寻找水族后裔", check:{attr:"INT", label:"智力·寻找", target:60},
      go:"race_choice", effect:{time:3}},
    {t:"调查暗蚀会的阴谋", go:"eclipse_intro", effect:{time:1}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
}

N["genocide_truth"] = function(){ return {
  text:function(){var race=S.flags.currentExtinct||"dragon";
  return ["灭族真相：", GENOCIDE_TRUTHS[race]||"",
    "你发现了真相——史书上写的都是谎言。",
    "你要怎么做？把真相公之于众，还是让它继续被埋葬？"];},
  options:[
    {t:"公布真相", effect:{flag:"genocide_truth_public", rep:15, sanLoss:5, time:1}, go:"race_choice"},
    {t:"保持沉默", effect:{flag:"genocide_truth_hidden", time:1}, go:"race_choice"},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
};}

N["race_choice"] = function(){ return {
  text:function(){var revived=S.flags.racesRevived||0;
  return ["你已经帮助了 "+revived+" / 6 个灭族种族。",
    "如果所有六个种族都复兴——将触发「万族共存」隐藏结局。",
    "继续寻找其他种族吗？"];},
  options:[
    {t:"继续寻找", go:"extinct_clue", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}

/* 其他灭族节点框架 */
N["extinct_winged"]={
  text:["翼人族。神战中站错队的种族——不，他们只是想保持中立。",
    "传说有翼人后裔生活在最高的山峰上。你要去寻找吗？"],pace:"light",
  options:[
    {t:"攀登最高峰寻找翼人", check:{attr:"AGI", label:"敏捷·攀登", target:65},
      go:"race_choice", effect:{time:5}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
}

N["extinct_crystal"]={
  text:["水晶族。身体由水晶构成的种族。",
    "他们被大量开采作为魔法材料——美第奇家族主导了这场开采。",
    "传说有一颗水晶族的核心还在沉睡，在矮人王国最深处的矿洞。"],pace:"light",
  options:[
    {t:"深入矮人矿洞", check:{attr:"CON", label:"体质·探索", target:60},
      go:"race_choice", effect:{time:5}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
}

N["extinct_echo"]={
  text:["回声族。没有实体，只能通过声音存在的种族。",
    "教会用沉默咒术灭绝了他们——因为回声族能听到神的秘密。",
    "他们的声音还在承天书院后山的回音谷里回响。"],pace:"light",
  options:[
    {t:"去回音谷倾听", check:{attr:"SPR", label:"灵性·倾听", target:65},
      go:"race_choice", effect:{time:3}},
    {t:"离开", go:"extinct_clue", effect:{time:0}}
  ]
}

/* ============================================================
   v14 毕业后同学重逢节点
   ============================================================ */
N["reunion_intro"]={
  text:["毕业后的大陆。",
    "你的同学们各奔东西，在大陆各处扮演着不同的角色。",
    "你在冒险中会与他们重逢——每个人都有自己的故事和困境。",
    "你要去见谁？"],pace:"light",
  options:[
    {t:"塞西莉亚（艾尔达魔法学院）", go:"reunion_cecilia", effect:{time:1}},
    {t:"亚历山大（美第奇家族）", go:"reunion_alex", effect:{time:1}},
    {t:"耗子（地下世界）", go:"reunion_mouse", effect:{time:1}},
    {t:"玛丽（教会圣城）", go:"reunion_mary", effect:{time:1}},
    {t:"夜（守望者）", go:"reunion_night", effect:{time:1}},
    {t:"该隐（暗蚀会）", go:"reunion_cain", effect:{time:1}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
}



N["reunion_alex"] = function(){ return {
  text:function(){
    if(S.flags.medici_heir){
      return ["美第奇家族。亚历山大掌权了。",
        "但他正在被家族内部的人追杀——因为他发现了家族与暗蚀会的交易。",
        "他看到你，眼神复杂：「弟弟……不，普路托斯。我等这一天等了十五年。」",
        "「我知道你是谁。我一直在保护你——但现在，我需要你的帮助。」"];
    }
    return ["美第奇家族。亚历山大掌权了。",
      "但他正在被家族内部的人追杀——因为他发现了家族与暗蚀会的交易。",
      "他看到你，眼神警惕：「你是什么人？为什么来找我？」",
      "「如果你是来谈生意的，就直说。如果是来杀我的——那你找错人了。」"];
  },
  options:[
    {t:"相信他，帮助他", effect:{flag:"alex_alliance", rep:10, time:1}, go:"reunion_outcome"},
    {t:"质问他为什么隐瞒", check:{attr:"CHA", label:"魅力·质问", target:55},
      go:"reunion_outcome", effect:{time:2}},
    {t:"不相信他，离开", go:"reunion_intro", effect:{time:0}}
  ]
};}

N["reunion_mouse"]={
  text:["地下世界。耗子成了盗贼公会的头目。",
    "但他妹妹的病越来越重——普通的医术已经无能为力了。",
    "暗蚀会向他许诺：只要他加入，就能治好他妹妹。",
    "他看到你，苦笑了一下：「兄弟，我遇到了一个选择……你说，我该怎么办？」"],pace:"light",
  options:[
    {t:"帮他找其他治疗方法（炼金术/教会）", check:{attr:"INT", label:"智力·寻找", target:60},
      go:"reunion_outcome", effect:{time:3}},
    {t:"劝他不要加入暗蚀会", check:{attr:"CHA", label:"魅力·劝说", target:65},
      go:"reunion_outcome", effect:{time:2}},
    {t:"支持他的选择", effect:{flag:"mouse_eclipse", sanLoss:5, time:1}, go:"reunion_outcome"},
    {t:"离开", go:"reunion_intro", effect:{time:0}}
  ]
}

N["reunion_mary"]={
  text:["教会圣城。玛丽成了圣女候选人。",
    "但她发现了教会的黑暗面——净化令背后的真相。",
    "她看到你，眼泪流了下来：「我一直以为教会是正义的……但我看到了……他们在做什么……」",
    "「我不知道该怎么办了。我的信仰……崩塌了。」"],pace:"light",
  options:[
    {t:"安慰她，帮她找到新的信仰", check:{attr:"CHA", label:"魅力·安慰", target:60},
      go:"reunion_outcome", effect:{time:2}},
    {t:"和她一起调查教会的黑暗面", check:{attr:"INT", label:"智力·调查", target:65},
      go:"reunion_outcome", effect:{time:3}},
    {t:"劝她离开教会", effect:{flag:"mary_leave_church", time:1}, go:"reunion_outcome"},
    {t:"离开", go:"reunion_intro", effect:{time:0}}
  ]
}

N["reunion_night"]={
  text:["守望者据点。夜成了执灯人。",
    "但她发现了塞拉芬事件的真相——她在质疑守望者组织。",
    "她看到你，眼神里有疲惫，有挣扎：「你知道吗？守望者……并不像表面那么光明。」",
    "「塞拉芬……她不是被封印的——她是自愿的。因为她发现了……更可怕的东西。」"],pace:"light",
  options:[
    {t:"和她一起调查真相", go:"seraph_truth", effect:{time:1}},
    {t:"劝她相信组织", check:{attr:"CHA", label:"魅力·劝说", target:60},
      go:"reunion_outcome", effect:{time:2}},
    {t:"离开", go:"reunion_intro", effect:{time:0}}
  ]
}

N["reunion_cain"] = function(){ return {
  text:["暗蚀会据点。该隐成了情报司骨干。",
    "但他想脱离暗蚀会——组织不会让他走。",
    "他看到你，露出了一个苦涩的笑：「没想到会在这里见到你。」",
    "「我想离开……但我知道太多了。他们不会让我活着走的。」",
    "「你能帮我吗？——作为同学，而不是敌人。」"],pace:"light",
  options:[
    {t:"帮助他脱离暗蚀会", check:{attr:"AGI", label:"敏捷·营救", target:70},
      tier:{ok:function(){return[pickV(["你帮助该隐成功脱离了暗蚀会——他成了你的双面间谍。◆获得该隐作为盟友！暗蚀会声望-20","你们一起逃了出来——但暗蚀会在追杀你们。◆该隐加入，但被暗蚀会追杀"],"cain_ok")]},
      fail:function(){return[pickV(["营救失败——该隐被抓了。◆该隐被抓，需要再次救援","你差点被发现——该隐让你先走。◆该隐还在暗蚀会，但他记得你的恩情"],"cain_fail")]}},
      go:"reunion_outcome", effect:{time:3}},
    {t:"拒绝他（他是暗蚀会的人）", effect:{flag:"cain_enemy", time:1}, go:"reunion_outcome"},
    {t:"把他交给守望者", effect:{flag:"cain_captured", rep:10, time:1}, go:"reunion_outcome"},
    {t:"离开", go:"reunion_intro", effect:{time:0}}
  ]
};}

N["reunion_outcome"]={
  text:["你和同学的重逢结束了。",
    "你们都变了——但有些东西，还是和学院时一样。",
    "在最终决战中，你帮助过的同学会站在你身边。",
    "你伤害过的同学——可能会成为你的敌人。"],pace:"light",
  options:[
    {t:"继续见其他同学", go:"reunion_intro", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
}


/* ============================================================
   v15 序章数据层
   ============================================================ */

/* ===== 方向一：出身谱系 BACKGROUNDS_FULL ===== */
var BACKGROUNDS_FULL = {
  /* 人类出身 */
  human_orphan: {id:"human_orphan", race:"人类", cn:"贫民窟孤儿", icon:"👶",
    desc:"自由城邦交汇城贫民窟的孤儿，在孤儿院长大，不知道父母是谁。",
    gold:5, attrs:{STR:5,AGI:5,CON:3}, skills:{潜行:2,生存:2},
    label:"贫困生", hidden:"orphan_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  human_merchant_apprentice: {id:"human_merchant_apprentice", race:"人类", cn:"商会学徒", icon:"📜",
    desc:"美第奇商会下属商铺的学徒，从小耳濡目染商业之道。",
    gold:80, attrs:{CHA:5,INT:3}, skills:{交易:3,口才:2},
    label:"商会推荐生", hidden:"merchant_apprentice_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  human_fallen_noble: {id:"human_fallen_noble", race:"人类", cn:"没落贵族", icon:"🏰",
    desc:"家族曾经显赫，如今家道中落，只剩一个空有头衔的父亲和一屁股债。",
    gold:30, attrs:{CHA:3,INT:5}, skills:{礼仪:3,历史:2},
    label:"贵族子弟", hidden:"fallen_noble_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  human_soldier_orphan: {id:"human_soldier_orphan", race:"人类", cn:"军人遗孤", icon:"⚔",
    desc:"父亲战死在铁门关，母亲改嫁，你被老兵收养，在军营里长大。",
    gold:20, attrs:{STR:5,CON:5}, skills:{格斗:3,战术:2},
    label:"军人推荐生", hidden:"soldier_secret",
    startLoc:"north_tiemenguan", prologueDays:10},
  human_farmer: {id:"human_farmer", race:"人类", cn:"农夫之子", icon:"🌾",
    desc:"自由城邦郊外农户家的孩子，每天日出而作日落而息，直到那一天。",
    gold:15, attrs:{STR:3,CON:5}, skills:{生存:3,草药:2},
    label:"普通生", hidden:"farmer_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  human_church_adopted: {id:"human_church_adopted", race:"人类", cn:"教会养子", icon:"✝",
    desc:"被光明教会收养的孩子，在教堂里长大，听着圣经和祈祷声入眠。",
    gold:40, attrs:{SPR:5,CHA:3}, skills:{神学:3,治疗:2},
    label:"教会推荐生", hidden:"church_secret",
    startLoc:"church_holycity", prologueDays:10},
  human_drifter: {id:"human_drifter", race:"人类", cn:"游民", icon:"🎒",
    desc:"没有固定居所，跟着商队和流浪艺人走遍了半个大陆，见多识广。",
    gold:50, attrs:{AGI:5,CHA:3}, skills:{潜行:2,口才:3,生存:2},
    label:"特招生", hidden:"drifter_secret",
    startLoc:"free_jiaohui", prologueDays:12},
  /* 精灵出身 */
  elf_royal: {id:"elf_royal", race:"精灵", cn:"王族旁支", icon:"👑",
    desc:"精灵女王艾萨拉的远亲，虽然不是直系，但王族血脉依然清晰。",
    gold:200, attrs:{SPR:5,INT:3,CHA:3}, skills:{自然魔法:3,弓术:2},
    label:"王族保送生", hidden:"elf_royal_secret",
    startLoc:"elf_silverleaf", prologueDays:10},
  elf_wanderer: {id:"elf_wanderer", race:"精灵", cn:"森林流浪者", icon:"🍃",
    desc:"离开银叶学院保护的森林，独自在大陆上游历的年轻精灵。",
    gold:60, attrs:{AGI:5,SPR:3}, skills:{弓术:3,潜行:3,生存:2},
    label:"交换生", hidden:"elf_wanderer_secret",
    startLoc:"free_jiaohui", prologueDays:12},
  elf_exile: {id:"elf_exile", race:"精灵", cn:"被放逐者", icon:"🥀",
    desc:"因触犯长老会的律法被逐出精灵王国，带着耻辱和秘密来到人类世界。",
    gold:10, attrs:{AGI:3,INT:5}, skills:{暗影魔法:3,潜行:3},
    label:"问题学生", hidden:"elf_exile_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  elf_halfbreed: {id:"elf_halfbreed", race:"精灵", cn:"人类混血", icon:"🌙",
    desc:"人类父亲和精灵母亲的孩子，在两个世界都不被完全接纳。",
    gold:35, attrs:{SPR:3,CHA:3,AGI:3}, skills:{灵魂魔法:2,口才:2},
    label:"特招生", hidden:"halfbreed_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  /* 矮人出身 */
  dwarf_blacksmith: {id:"dwarf_blacksmith", race:"矮人", cn:"铁匠世家", icon:"🔨",
    desc:"矮人王国铁峰堡铁匠世家的孩子，从小在熔炉边长大，手上全是老茧。",
    gold:100, attrs:{STR:5,CON:5}, skills:{锻造:4,工程:2},
    label:"熔炉保送生", hidden:"blacksmith_secret",
    startLoc:"dwarf_ironpeak", prologueDays:10},
  dwarf_miner: {id:"dwarf_miner", race:"矮人", cn:"矿工之子", icon:"⛏",
    desc:"父亲是深层矿道的矿工，你从小就知道地下的路比地上的多。",
    gold:25, attrs:{STR:3,CON:5}, skills:{采矿:3,生存:3},
    label:"普通生", hidden:"miner_secret",
    startLoc:"dwarf_ironpeak", prologueDays:10},
  dwarf_mercenary: {id:"dwarf_mercenary", race:"矮人", cn:"商队护卫", icon:"🛡",
    desc:"跟着矮人商队走遍大陆的护卫，见过世面，也见过死人。",
    gold:70, attrs:{STR:5,CON:3}, skills:{格斗:3,战术:2,交易:2},
    label:"特招生", hidden:"mercenary_secret",
    startLoc:"free_jiaohui", prologueDays:12},
  /* 兽人出身 */
  orc_warrior: {id:"orc_warrior", race:"兽人", cn:"战族之子", icon:"🪓",
    desc:"兽人草原战族酋长的儿子，从小在战斗和狩猎中长大。",
    gold:15, attrs:{STR:5,CON:5,AGI:3}, skills:{格斗:4,战术:2},
    label:"战族推荐生", hidden:"warrior_secret",
    startLoc:"orc_grassland", prologueDays:10},
  orc_shaman: {id:"orc_shaman", race:"兽人", cn:"萨满学徒", icon:"🔮",
    desc:"兽人萨满的学徒，能听到祖先的声音，也能看到深渊的裂缝。",
    gold:20, attrs:{SPR:5,INT:3}, skills:{灵魂魔法:3,神学:2},
    label:"特招生", hidden:"shaman_secret",
    startLoc:"orc_grassland", prologueDays:10},
  orc_slave: {id:"orc_slave", race:"兽人", cn:"被俘虏的奴隶", icon:"⛓",
    desc:"在部落冲突中被俘虏，卖给人类奴隶商人，后来被好心人赎出。",
    gold:0, attrs:{STR:5,CON:3}, skills:{格斗:2,生存:3},
    label:"贫困生", hidden:"slave_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  orc_outcast: {id:"orc_outcast", race:"兽人", cn:"部落弃儿", icon:"🌵",
    desc:"因体弱被部落抛弃，在草原边缘独自活了下来，比谁都想证明自己。",
    gold:5, attrs:{AGI:5,INT:3}, skills:{生存:4,潜行:2},
    label:"问题学生", hidden:"outcast_secret",
    startLoc:"orc_grassland", prologueDays:12},
  /* 半身人/龙裔/混血 */
  halfling_inn: {id:"halfling_inn", race:"半身人", cn:"旅店老板之子", icon:"🍺",
    desc:"自由城邦最热闹旅店的少东家，听遍了天下旅人的故事。",
    gold:120, attrs:{CHA:5,AGI:3}, skills:{口才:4,潜行:2,烹饪:3},
    label:"商会推荐生", hidden:"inn_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  dragonborn_scaled: {id:"dragonborn_scaled", race:"龙裔", cn:"龙鳞战士", icon:"🐉",
    desc:"古代龙族后裔，身上覆着细密的鳞片，能感受到血脉中沉睡的力量。",
    gold:90, attrs:{STR:5,CON:5,SPR:3}, skills:{格斗:3,元素魔法:2},
    label:"特招生", hidden:"dragonborn_secret",
    startLoc:"free_jiaohui", prologueDays:10},
  mixed_outcast: {id:"mixed_outcast", race:"混血", cn:"被遗忘的混血", icon:"🌓",
    desc:"父母来自两个敌对种族，你在夹缝中长大，学会了察言观色。",
    gold:20, attrs:{CHA:5,INT:3,AGI:3}, skills:{口才:3,潜行:3},
    label:"问题学生", hidden:"mixed_secret",
    startLoc:"free_jiaohui", prologueDays:12}
};

/* ===== 方向二：天赋觉醒事件 AWAKENING_EVENTS ===== */
var AWAKENING_EVENTS = {
  mage: {job:"魔法师", nodes:["awaken_mage_1","awaken_mage_2","awaken_mage_3"],
    trigger:"第3天自动触发", desc:"元素共鸣"},
  warrior: {job:"战士", nodes:["awaken_warrior_1","awaken_warrior_2","awaken_warrior_3"],
    trigger:"危机事件中触发", desc:"生死爆发"},
  soulmage: {job:"灵魂法师", nodes:["awaken_soul_1","awaken_soul_2","awaken_soul_3"],
    trigger:"第2天噩梦触发", desc:"灵魂感知"},
  priest: {job:"牧师", nodes:["awaken_priest_1","awaken_priest_2","awaken_priest_3"],
    trigger:"教堂/治疗事件触发", desc:"神迹降临"},
  rogue: {job:"盗贼", nodes:["awaken_rogue_1","awaken_rogue_2","awaken_rogue_3"],
    trigger:"集市/偷窃事件触发", desc:"潜行天赋"},
  merchant: {job:"商人", nodes:["awaken_merchant_1","awaken_merchant_2","awaken_merchant_3"],
    trigger:"交易事件触发", desc:"商业直觉"},
  alchemist: {job:"术士", nodes:["awaken_alch_1","awaken_alch_2","awaken_alch_3"],
    trigger:"炼金工坊/意外事件触发", desc:"炼金觉醒"}
};

/* ===== 方向三：机遇事件池 OPPORTUNITY_POOL ===== */
var OPPORTUNITY_POOL = {
  traveling_professor: {id:"traveling_professor", cn:"旅行教授",
    desc:"一位旅行教授路过此地，偶然发现了你的天赋。",
    schools:["elda_academy","chengtian","holy_seminary"],
    nodes:["opp_professor_1","opp_professor_2"]},
  local_tournament: {id:"local_tournament", cn:"地方比武",
    desc:"城镇举办年度比武大会，冠军可获得学院推荐资格。",
    schools:["elda_academy","forge_academy"],
    nodes:["opp_tournament_1","opp_tournament_2"]},
  emergency_hero: {id:"emergency_hero", cn:"突发事件",
    desc:"一场火灾/强盗袭击/意外事故中，你展现了非凡能力。",
    schools:["elda_academy","chengtian","holy_seminary","silverleaf","forge_academy"],
    nodes:["opp_emergency_1","opp_emergency_2"]},
  family_recommendation: {id:"family_recommendation", cn:"家族推荐",
    desc:"你的家族恩人/敌人写了一封推荐信，把你送进了学院的视野。",
    schools:["elda_academy","holy_seminary"],
    nodes:["opp_family_1","opp_family_2"]},
  watcher_scout: {id:"watcher_scout", cn:"守望者密探",
    desc:"一个穿灰袍的人在暗中观察你很久了，他留下了一个符号。",
    schools:["watchers_secret"],
    nodes:["opp_watcher_1","opp_watcher_2"]},
  eclipse_recruit: {id:"eclipse_recruit", cn:"暗蚀会招募",
    desc:"有人在暗处接触你，声称能给你想要的力量。",
    schools:["elda_academy"],
    nodes:["opp_eclipse_1","opp_eclipse_2"]},
  purge_refugee: {id:"purge_refugee", cn:"净化令难民",
    desc:"教会净化令波及此地，你被迫逃亡，在路上遇到了学院的人。",
    schools:["elda_academy","silverleaf"],
    nodes:["opp_purge_1","opp_purge_2"]},
  trade_crisis: {id:"trade_crisis", cn:"商路危机",
    desc:"银穗商路断供，物价飞涨，你在危机中展现了商业/生存才能。",
    schools:["elda_academy","forge_academy"],
    nodes:["opp_trade_1","opp_trade_2"]},
  magic_item_resonance: {id:"magic_item_resonance", cn:"魔法物品共鸣",
    desc:"一件古老的魔法物品在你手中苏醒，引起了学院的注意。",
    schools:["elda_academy","chengtian"],
    nodes:["opp_item_1","opp_item_2"]},
  healing_miracle: {id:"healing_miracle", cn:"治愈奇迹",
    desc:"你意外治愈了一个不治之症的病人，消息传开了。",
    schools:["holy_seminary","elda_academy"],
    nodes:["opp_heal_1","opp_heal_2"]},
  underground_notice: {id:"underground_notice", cn:"地下世界 notice",
    desc:"你在地下世界的行动引起了某些人的注意，他们给你指了一条路。",
    schools:["elda_academy"],
    nodes:["opp_underground_1","opp_underground_2"]},
  old_soldier_mentor: {id:"old_soldier_mentor", cn:"老兵导师",
    desc:"一位退伍老兵看中了你的资质，愿意教你真本事，并写了推荐信。",
    schools:["elda_academy","forge_academy"],
    nodes:["opp_soldier_1","opp_soldier_2"]}
};

/* ===== 方向四：多学院录取 ADMISSION_LETTERS ===== */
var ADMISSION_LETTERS = {
  elda_academy: {id:"elda_academy", cn:"艾尔达魔法学院",
    location:"自由城邦交汇城", icon:"🏛",
    condition:"任意职业，INT≥40或机遇事件触发",
    scholarship:"基础奖学金50金龙/年",
    dorm:"标准双人间",
    mentor:"随机分配",
    label:"标准录取"},
  chengtian: {id:"chengtian", cn:"承天书院",
    location:"东部王国后山", icon:"📚",
    condition:"魔法师/炼金术师，INT≥50",
    scholarship:"东方风格奖学金80金龙/年",
    dorm:"独立小院",
    mentor:"儒道大师",
    label:"特招录取"},
  holy_seminary: {id:"holy_seminary", cn:"圣光神学院",
    location:"教会区圣城", icon:"✝",
    condition:"牧师/光明信仰，SPR≥45",
    scholarship:"教会全额资助",
    dorm:"神职人员宿舍",
    mentor:"红衣主教",
    label:"教会保送"},
  silverleaf: {id:"silverleaf", cn:"银叶学院",
    location:"精灵王国世界树下", icon:"🌿",
    condition:"精灵默认/人类交换生需CHA≥50",
    scholarship:"自然学院资助",
    dorm:"树屋",
    mentor:"精灵长老",
    label:"精灵保送/交换生"},
  forge_academy: {id:"forge_academy", cn:"熔炉学院",
    location:"矮人王国铁峰堡", icon:"🔥",
    condition:"矮人默认/人类需STR≥45或锻造技能",
    scholarship:"工匠公会资助",
    dorm:"熔炉旁宿舍",
    mentor:"锻造大师",
    label:"矮人保送/特招"},
  watchers_secret: {id:"watchers_secret", cn:"守望者秘密学院",
    location:"未知（地下）", icon:"👁",
    condition:"隐藏路线，守望者密探事件+特定属性组合",
    scholarship:"未知",
    dorm:"未知",
    mentor:"奥雷利安/墨丘利",
    label:"秘密邀请"}
};

/* ===== 方向五：序章自由探索地点 PROLOGUE_LOCATIONS ===== */
var PROLOGUE_LOCATIONS = {
  free_jiaohui: {
    home: {cn:"你的住处", desc:"贫民窟的阁楼/商会学徒房/贵族旧宅", events:["rest","memory"]},
    market: {cn:"集市", desc:"交汇城最热闹的地方，什么都能买到", events:["trade","gossip","opportunity"]},
    church: {cn:"教堂", desc:"光明教会的地方教堂，有神父听告解", events:["pray","heal","purge_hint"]},
    tavern: {cn:"酒馆", desc:"三教九流汇聚之地，消息最灵通", events:["gossip","drink","underground"]},
    wild: {cn:"郊外", desc:"交汇城外的田野和森林", events:["gather","encounter","awakening"]},
    mentor: {cn:"导师家", desc:"你师父/恩人/老师的住处", events:["train","advice","letter"]}
  },
  north_tiemenguan: {
    home: {cn:"军营宿舍", desc:"铁门关军营的士兵宿舍", events:["rest","memory"]},
    barracks: {cn:"演武场", desc:"士兵们日常训练的地方", events:["train","spar","officer"]},
    market: {cn:"军市", desc:"军营旁的随军集市", events:["trade","gossip"]},
    wall: {cn:"城墙", desc:"铁门关的巍峨城墙，能看到北方雪原", events:["watch","encounter","memory"]},
    tavern: {cn:"老兵酒馆", desc:"退伍老兵和伤兵聚集的酒馆", events:["gossip","mentor","story"]}
  },
  church_holycity: {
    home: {cn:"教会宿舍", desc:"教堂附属的孤儿宿舍", events:["rest","memory"]},
    cathedral: {cn:"大教堂", desc:"圣城的核心，光明神的殿堂", events:["pray","miracle","ceremony"]},
    seminary: {cn:"神学院", desc:"培养神职人员的学校", events:["study","teacher","library"]},
    clinic: {cn:"教会医院", desc:"免费为穷人治病的地方", events:["heal","patient","awakening"]},
    square: {cn:"圣城广场", desc:"信徒和游客聚集的广场", events:["gossip","preach","purge"]}
  },
  elf_silverleaf: {
    home: {cn:"树屋", desc:"世界树上的精灵树屋", events:["rest","memory"]},
    worldtree: {cn:"世界树", desc:"精灵王国的圣树，第三印所在", events:["meditate","nature","seal_hint"]},
    academy: {cn:"银叶学院", desc:"精灵的最高学府", events:["study","teacher","library"]},
    forest: {cn:"古老森林", desc:"精灵王国的原始森林", events:["gather","encounter","awakening"]},
    council: {cn:"长老会", desc:"精灵长老们议事的地方", events:["politics","banish","mission"]}
  },
  dwarf_ironpeak: {
    home: {cn:"熔炉旁宿舍", desc:"铁峰堡地下的矮人宿舍", events:["rest","memory"]},
    forge: {cn:"永恒熔炉", desc:"矮人王国的心脏，第四印所在", events:["forge","train","seal_hint"]},
    mine: {cn:"深层矿道", desc:"铁峰堡地下的矿脉", events:["mine","encounter","discovery"]},
    market: {cn:"矮人市集", desc:"矮人工匠们交易的地方", events:["trade","gossip","craft"]},
    hall: {cn:"战士大厅", desc:"矮人战士们聚会和比武的大厅", events:["spar","drink","mentor"]}
  },
  orc_grassland: {
    home: {cn:"帐篷", desc:"兽人部落的毛皮帐篷", events:["rest","memory"]},
    hunting: {cn:"猎场", desc:"部落周围的狩猎区域", events:["hunt","encounter","awakening"]},
    shaman: {cn:"萨满帐篷", desc:"部落萨满的居所，充满神秘气息", events:["ritual","spirit","seal_hint"]},
    camp: {cn:"部落营地", desc:"兽人部落的中心营地", events:["spar","gossip","council"]},
    trade: {cn:"商路驿站", desc:"草原上的商队驿站", events:["trade","gossip","capture"]}
  }
};

/* ===== 方向六：童年回忆碎片 MEMORY_FRAGMENTS_PROLOGUE ===== */
var MEMORY_FRAGMENTS_PROLOGUE = {
  human_orphan: [
    {id:"orphan_mem_1", trigger:"home", text:"孤儿院的院长是个胖女人，她总说你是被放在门口的篮子里送来的。篮子里有一块绣着天平与蛇的布。"},
    {id:"orphan_mem_2", trigger:"church", text:"你记得一个女人的歌声，很轻，很温柔。她唱的不是教会的圣歌，而是一首你从未在别处听过的摇篮曲。"},
    {id:"orphan_mem_3", trigger:"market", text:"六岁那年，你在集市上看到一个穿华贵衣服的男人盯着你看。他的眼睛是金色的。你告诉院长，院长说你做噩梦了。"}
  ],
  human_fallen_noble: [
    {id:"noble_mem_1", trigger:"home", text:"你记得家里曾经有很多仆人，有闪亮的银器，有墙上挂着的家族徽章。后来有一天，仆人们都走了，银器被卖了，徽章被摘了下来。"},
    {id:"noble_mem_2", trigger:"tavern", text:"父亲喝醉后会哭，说他对不起祖父，说家族的仇一定要报。你问他仇人是谁，他只是摇头。"},
    {id:"noble_mem_3", trigger:"mentor", text:"家里曾经有个老管家，他教你读书写字。有一天他留下一封信就走了，信上只有四个字：小心内贼。"}
  ],
  default: [
    {id:"default_mem_1", trigger:"home", text:"你记得小时候的天空，记得某种气味，记得一个模糊的身影。但你想不起来那是谁。"},
    {id:"default_mem_2", trigger:"wild", text:"你做过一个反复出现的梦：一片黑暗，一只眼睛，一个声音在叫你的名字。你醒来时总是满头冷汗。"},
    {id:"default_mem_3", trigger:"church", text:"你总觉得自己忘记了什么重要的事。那种感觉像一根刺，扎在心里，拔不出来。"}
  ]
};

/* ===== 方向七：序章NPC PROLOGUE_NPCS ===== */
var PROLOGUE_NPCS = {
  old_mentor: {id:"old_mentor", cn:"师父", role:"你的启蒙导师",
    future:"可能是学院教授/退休强者", desc:"教了你第一样本事的人",
    bond:0, flags:[]},
  rival_child: {id:"rival_child", cn:"发小/对手", role:"一起长大的同龄人",
    future:"学院同学/竞争对手", desc:"和你一起长大，既是朋友也是对手",
    bond:10, flags:[]},
  mysterious_traveler: {id:"mysterious_traveler", cn:"神秘旅人", role:"路过的陌生人",
    future:"守望者密探/暗蚀会外围/学院教授微服", desc:"在序章中出现的神秘人物",
    bond:0, flags:[]},
  tavern_owner: {id:"tavern_owner", cn:"酒馆老板", role:"消息灵通的本地人",
    future:"地下世界线联系人", desc:"知道很多秘密，但嘴很严",
    bond:5, flags:[]},
  village_child: {id:"village_child", cn:"邻家孩子", role:"你照顾过的小孩",
    future:"学院后辈/需要保护的人", desc:"你曾经帮助过的孩子，一直记着你的好",
    bond:15, flags:[]},
  debt_collector: {id:"debt_collector", cn:"债主/仇人", role:"找你麻烦的人",
    future:"学院线敌人/暗蚀会外围", desc:"和你有过节的人，可能在学院线重逢",
    bond:-10, flags:[]}
};

/* ===== 方向八：危机事件 CRISIS_EVENTS ===== */
var CRISIS_EVENTS = {
  human_orphan: {id:"crisis_orphan", cn:"孤儿院危机",
    trigger:"第6天", desc:"孤儿院要被拆了，孩子们无处可去。",
    nodes:["crisis_orphan_1","crisis_orphan_2","crisis_orphan_3"]},
  human_merchant_apprentice: {id:"crisis_merchant", cn:"商铺危机",
    trigger:"第6天", desc:"商铺被同行陷害，面临破产。",
    nodes:["crisis_merchant_1","crisis_merchant_2","crisis_merchant_3"]},
  human_fallen_noble: {id:"crisis_noble", cn:"家族危机",
    trigger:"第6天", desc:"债主上门，家族最后的房产要被没收。",
    nodes:["crisis_noble_1","crisis_noble_2","crisis_noble_3"]},
  human_soldier_orphan: {id:"crisis_soldier", cn:"军营危机",
    trigger:"第6天", desc:"老兵养父被卷入军内斗争。",
    nodes:["crisis_soldier_1","crisis_soldier_2","crisis_soldier_3"]},
  human_church_adopted: {id:"crisis_church", cn:"教会危机",
    trigger:"第6天", desc:"净化令波及教堂，有人被指控为异端。",
    nodes:["crisis_church_1","crisis_church_2","crisis_church_3"]},
  elf_exile: {id:"crisis_elf", cn:"放逐危机",
    trigger:"第6天", desc:"精灵长老会的追兵到了，要把你抓回去受审。",
    nodes:["crisis_elf_1","crisis_elf_2","crisis_elf_3"]},
  orc_slave: {id:"crisis_orc", cn:"奴隶危机",
    trigger:"第6天", desc:"前奴隶主找到了你，要把你抓回去。",
    nodes:["crisis_orc_1","crisis_orc_2","crisis_orc_3"]},
  default: {id:"crisis_default", cn:"地方危机",
    trigger:"第6天", desc:"一场意外的灾难降临到你所在的地方。",
    nodes:["crisis_default_1","crisis_default_2","crisis_default_3"]}
};

/* ===== 方向九：入学最后选择 FINAL_CHOICES ===== */
var FINAL_CHOICES = {
  normal: {id:"normal", cn:"正常入学",
    desc:"按照录取通知，按时前往学院报到。",
    effect:{}, go:"prologue_enroll_normal"},
  delay: {id:"delay", cn:"推迟入学",
    desc:"先处理未完之事，获得特殊物品但学院声望下降。",
    effect:{rep:-10, item:"prologue_special_item"}, go:"prologue_enroll_delay"},
  secret: {id:"secret", cn:"秘密路线",
    desc:"被守望者/暗蚀会半路截走，走隐藏入学路线。",
    condition:"S.flags.watcher_invited || S.flags.eclipse_contacted",
    effect:{flag:"secret_route"}, go:"prologue_enroll_secret"},
  skip: {id:"skip", cn:"放弃入学",
    desc:"不走学院路线，直接成为自由冒险者进入大陆。",
    effect:{flag:"skip_academy"}, go:"city_free"},
  companion: {id:"companion", cn:"结伴同行",
    desc:"与序章中建立关系的NPC约定同行/告别，影响后续重逢。",
    effect:{npc_bond:20}, go:"prologue_enroll_companion"}
};

/* ===== 方向十：序章物品 PROLOGUE_ITEMS ===== */
var PROLOGUE_ITEMS = {
  family_heirloom: {id:"family_heirloom", cn:"家族传家宝",
    desc:"一件代代相传的物品，似乎隐藏着秘密。",
    awaken:"在特定地点/境界觉醒真正力量",
    rarity:"稀有"},
  mentor_letter: {id:"mentor_letter", cn:"导师推荐信",
    desc:"启蒙导师写给学院的推荐信，分量很重。",
    awaken:"入学时获得导师指定待遇",
    rarity:"稀有"},
  mystery_key: {id:"mystery_key", cn:"神秘钥匙",
    desc:"一把不知道开什么锁的钥匙，材质古老。",
    awaken:"黄林晶遗产碎片的前置线索",
    rarity:"史诗"},
  crisis_memento: {id:"crisis_memento", cn:"危机纪念物",
    desc:"从危机事件中留下的物品，记录着你的选择。",
    awaken:"在后续剧情中触发回忆和加成",
    rarity:"普通"},
  old_map: {id:"old_map", cn:"古老地图",
    desc:"一张残缺的旧地图，标注着某个未知地点。",
    awaken:"解锁隐藏探索地点",
    rarity:"稀有"},
  strange_amulet: {id:"strange_amulet", cn:"奇异护符",
    desc:"一个会发烫的护符，上面刻着看不懂的符文。",
    awaken:"深渊相关物品，被暗蚀会/守望者追踪",
    rarity:"史诗"}
};

/* ===== 方向十一：序章世界暗线 PROLOGUE_WORLD_HINTS ===== */
var PROLOGUE_WORLD_HINTS = {
  purge: {event:"净化令", hints:[
    {loc:"church", text:"教堂的神父最近总是收到来自圣城的密信，看完后脸色很难看。"},
    {loc:"market", text:"集市上有人在议论隔壁镇有人被指控为异端，被烧死了。"},
    {loc:"tavern", text:"酒馆里有人轻声说，净化令要扩大范围了，灵魂法师首当其冲。"}
  ]},
  silver_road: {event:"银穗商路危机", hints:[
    {loc:"market", text:"集市上的粮食价格涨了三成，商人们说是商路断了。"},
    {loc:"tavern", text:"酒馆老板抱怨说，最近的商队比去年少了一半。"},
    {loc:"mentor", text:"导师告诉你，南方的商业城邦联盟和北方公国在商路问题上谈崩了。"}
  ]},
  abyss_seal: {event:"深渊封印松动", hints:[
    {loc:"wild", text:"郊外的野狗最近总是对着某个方向狂吠，那里什么都没有。"},
    {loc:"home", text:"你最近总是做同一个噩梦：黑暗中有一只眼睛在看着你。"},
    {loc:"tavern", text:"酒馆里有人说，北边铁门关外面的雪原上，出现了不该存在的东西。"}
  ]},
  academy_underground: {event:"学院暗流", hints:[
    {loc:"market", text:"集市上有个穿学院制服的人在打听什么，看起来不像学生。"},
    {loc:"tavern", text:"酒馆老板说，最近有学院的人在秘密调查一些失踪案。"},
    {loc:"church", text:"教堂里有人在议论，说学院里藏着一些不该存在的东西。"}
  ]}
};

/* ===== 方向十二：多周目随机种子 PROLOGUE_RANDOM_SEED ===== */
var PROLOGUE_RANDOM_SEED = {
  weather: ["晴","阴","小雨","大雾","反常炎热","反常寒冷"],
  npc_mood: ["友好","冷淡","警惕","热情","心事重重","醉酒"],
  opportunity_count: [3,4,5],
  crisis_intensity: [1,2,3],
  hidden_route_chance: 0.1
};

/* ============================================================
   v15 序章节点
   ============================================================ */

/* ===== 序章入口：出身选择后进入 ===== */
N["prologue_start"] = function(){ return {
  place:function(){var bg=BACKGROUNDS_FULL[S.background]; return bg?bg.startLoc:"自由城邦";},
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var day = S.day || 1;
    return ["艾尔达历4037年，春。",
      "你十六岁。或者十七。或者十八。在这个年纪，很多人已经死了，很多人已经改变了世界。",
      "而你，只是"+bg.cn+"。",
      bg.desc,
      "这是你的故事开始的地方。",
      "（序章共"+bg.prologueDays+"天，你可以自由探索，触发天赋觉醒、机遇事件和危机事件。第"+Math.floor(bg.prologueDays*0.6)+"天左右会触发危机事件。）"];
  },
  options:[
    {t:"回家休息", effect:{time:1}, go:"prologue_home"},
    {t:"去集市看看", effect:{time:1}, go:"prologue_market"},
    {t:"去酒馆听听消息", effect:{time:1}, go:"prologue_tavern"},
    {t:"去郊外走走", effect:{time:1}, go:"prologue_wild"},
    {t:"去找导师", effect:{time:1}, go:"prologue_mentor"},
    {t:"查看状态和目标", effect:{time:0}, go:"prologue_status"}
  ]
};}

/* ===== 自由探索：家 ===== */
N["prologue_home"] = function(){ return {
  place:"住处",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var locs = PROLOGUE_LOCATIONS[bg.startLoc] || PROLOGUE_LOCATIONS.free_jiaohui;
    var home = locs.home || {cn:"住处", desc:""};
    return["推开门，屋里光线昏暗，空气里浮着陈年的霉味和旧木头的潮气。", "炉膛里的灰是冷的。你蹲下身，扒开灰烬，露出几根没烧透的柴头，摸了摸——冰凉。灶台上的铁锅蒙着一层薄灰，已经好几天没人动过了。", "你放下背上的东西，走到墙边，指尖划过那些刻痕。每年生日，你都会在墙上刻一道。刻痕从矮到高，歪歪扭扭，像一列沉默的脚印。最上面那道，还是去年秋天刻的，那时候天已经凉了，木头里泛着霜。", "这里是你长大的地方。每一道划痕、每一片污渍，都有一段故事。", "你从墙角摸出火石，一下、两下，火星溅起来，落在干草上，窜起一小簇火苗。火光跳动着，把你的影子投在墙上，忽长忽短。", "就在这时，窗外传来一阵脚步声。很轻，像是刻意压着步子，走到窗前，停住了。", "你猛地转头。窗外什么都没有——巷子空荡荡的，只有风卷着一片枯叶，在地上打了两个旋。", "你盯着那片枯叶看了好一会儿，才慢慢移开视线。大概是错觉吧。你把窗栓插上，又往火堆里添了根柴。", "火苗舔着柴头，发出细碎的噼啪声。你抱着膝盖坐在火边，忽然想起许多年前，也是这样的炉火边，有人教你辨认每一颗星星的名字。那人的面容已经模糊了，只记得声音很轻，像怕惊扰了什么。", "你回到了"+home.cn+"。",
      home.desc,
      "这里是你长大的地方。每一道划痕、每一片污渍，都有一段故事。",
      "你可以在这里休息，恢复体力，也可能触发童年回忆。"];
  } /*v45inj:prologue_home*/,
  unlock:["reading_mother_letter"],
  options:[
    {t:"休息（恢复体力，推进1天）", effect:{time:1,sanRecovery:2}, go:"prologue_daily_check"},
    {t:"翻找旧物（可能触发回忆）", check:{a:"INT",sk:"调查",label:"智力·翻找",target:50},
      tier:{
        crit:function(){return[pickV(["你在箱底找到了一件被遗忘的旧物。上面的图案让你心头一震——你在哪里见过它？童年记忆碎片+1。","你找到了一封泛黄的信，字迹已经模糊，但你认出了那个签名。那是一个你以为已经忘记的人。童年记忆碎片+1。"],"home_search_crit")]},
        ok:function(){return[pickV(["你找到了一些没用的旧东西，但其中一件让你隐约觉得不简单。童年记忆碎片+1。","你翻到了一本旧日记，是你小时候写的。里面提到了一个你现在完全不记得的地方。"],"home_search_ok")]},
        fail:function(){return[pickV(["什么都没找到，只有灰尘和旧衣服。","你翻了半天，除了一身灰什么都没有。"],"home_search_fail")]},
        critfail:function(){return[pickV(["你打翻了一个旧箱子，里面的东西撒了一地。你在慌乱中踩到了什么东西，脚疼了半天。HP-5。","你找到了一个奇怪的盒子，打开的时候被里面的机关划伤了手。HP-5，但你记住了那个图案。童年记忆碎片+1。"],"home_search_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}

/* ===== 自由探索：集市 ===== */
N["prologue_market"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"集市",
  text:["天刚蒙蒙亮，集市就已经醒了。", "第一缕晨光从东边的屋檐缝里漏下来，照在湿漉漉的石板路上——昨夜下过雨，积水还没干透，被早起的人踩得噼啪作响。摊贩们一边打着哈欠，一边支起木架，油布哗啦一声抖开，遮住头顶还泛着青色的天。", "集市永远是最热闹的地方。", "叫卖声、讨价还价声、牲畜的叫声，混在一起，像一锅煮沸的粥。", "你挤过人群，鼻子里闯进各种气味——烤面包的焦香、咸鱼的腥味、新鞣皮革的涩、还有不知从哪个角落飘来的香料，辛辣又甜腻。它们搅在一起，并不好闻，却让人安心。这味道，是你从小闻到大的。", "你可以在这里交易、打听消息，或者只是看看。", "不过今天有点不一样。你蹲在一个卖菜的摊子前，听老妇人和旁边的菜农小声抱怨：", "「麦子又涨了三成。粮铺的老赵说，北边的商路断了，运粮的车队半个月没到。」", "「听说铁门关那边，深渊里的东西又出来闹了。军队封了路，商队进不去。」", "你心里一动。深渊……这两个字，最近总在耳边打转，像一只赶不走的苍蝇。", "你抬起头，视线扫过集市——就在这时，你注意到一个人。", "那人站在人群边缘，披着一件洗得发白的兜帽斗篷，脸藏在阴影里，看不清长相。他不像别的路人那样忙着买卖，只是站着，侧过身，朝你这边偏了偏头。", "见你抬头，那人顿了顿，转身走进了巷子，很快消失在晨雾里。", "你盯着他消失的方向看了很久，直到一个商贩不耐烦地喊：「买不买？不买别挡道！」", "你回过神，摇摇头。大概是错觉吧。", "但不知为什么，今天集市上那股熟悉的、让人安心的味道，忽然淡了一些。"],pace:"normal" /*v45inj:prologue_market*/,
  unlock:["reading_watcher_diary"],
  options:[
    {t:"打听消息（可能触发机遇事件）", check:{a:"CHA",sk:"口才",label:"魅力·打听",target:55},
      tier:{
        crit:function(){return[pickV(["你从一个商队队长嘴里套出了重要消息：艾尔达魔法学院的教授正在这一带物色有天赋的年轻人。机遇事件触发！","你听到了一个惊人的消息：承天书院的人在暗中调查本地的异常事件。如果你能引起他们的注意……机遇事件触发！"],"market_gossip_crit")]},
        ok:function(){return[pickV(["你听说最近有学院的人在附近活动，但不确定具体在哪。也许再打听打听会有更多线索。","你听到了一些关于物价上涨和商路断供的抱怨。银穗商路出了问题。"],"market_gossip_ok")]},
        fail:function(){return[pickV(["没人愿意跟你多说。一个小贩甚至对你翻了个白眼。","你问了几个人，他们都只是摇头，说不知道。"],"market_gossip_fail")]},
        critfail:function(){return[pickV(["你问错了人，被一个地痞盯上了。他敲诈了你几个铜币才放你走。金币-5。","你太大声了，引来了城卫的注意。他们警告你不要在集市上乱问。声望-2。"],"market_gossip_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"做点小生意/打零工（赚点钱）", check:{a:"CHA",sk:"交易",label:"魅力·交易",target:50},
      tier:{
        crit:function(){return[pickV(["你低买高卖，一笔就赚了20金龙。商人的直觉在你血液里流淌。金币+20。","你帮一个商队搬货，队长看你能干，多给了一倍工钱。金币+15，还获得了商队的好感。"],"market_work_crit")]},
        ok:function(){return[pickV(["你赚了10金龙，够吃几天了。金币+10。","你打了一天零工，赚了8金龙。虽然不多，但至少是自己挣的。金币+8。"],"market_work_ok")]},
        fail:function(){return[pickV(["你忙活了一天，只赚了3金龙。物价这么贵，这点钱什么都不够。金币+3。","你试图倒卖货物，结果亏了。金币-5。"],"market_work_fail")]},
        critfail:function(){return[pickV(["你被骗了，花高价买了假货。金币-10，但你记住了那个骗子的脸。","你和摊主发生了争执，被城卫赶走了。金币-3，声望-2。"],"market_work_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}

/* ===== 自由探索：酒馆 ===== */
N["prologue_tavern"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"酒馆",
  text:["酒馆里烟雾缭绕，酒味和汗味混在一起。","角落里有人在小声交谈，吧台前有人在喝醉了唱歌。","酒馆老板是个消息灵通的人，但他的消息不便宜。","你注意到角落里坐着一个穿灰袍的人，一直在喝麦酒，眼睛却在观察每一个人。"],pace:"light",
  options:[
    {t:"和酒馆老板聊天（花钱买消息）", check:{a:"CHA",sk:"口才",label:"魅力·套话",target:60},
      tier:{
        crit:function(){return[pickV(["老板压轻声音告诉你：最近有学院的人在秘密寻找有特殊天赋的年轻人。如果你够格，也许能被选中。机遇事件触发！","老板告诉你一个秘密：暗蚀会在这一带有活动，他们在招募年轻人。如果你不小心，可能会被盯上。但如果你主动接触……机遇事件触发！"],"tavern_owner_crit")]},
        ok:function(){return[pickV(["老板告诉你一些本地的八卦，虽然不是什么大秘密，但也挺有意思。你了解了本地的势力分布。","老板说最近不太平，让你晚上少出门。他提到了几个失踪者的名字。"],"tavern_owner_ok")]},
        fail:function(){return[pickV(["老板只是笑笑，说他什么都不知道。你花了钱却什么都没打听到。金币-3。","老板对你很冷淡，说他这里不欢迎问东问西的人。"],"tavern_owner_fail")]},
        critfail:function(){return[pickV(["你问了不该问的问题，老板叫人把你赶了出去。你在门口摔了一跤，HP-3。声望-3。","你喝醉了，在酒馆里大闹了一场。第二天醒来，金币少了一半，头很疼。金币-10，HP-5。"],"tavern_owner_critfail")]}
      },
      effect:{time:1,gold:-3}, go:"prologue_daily_check"},
    {t:"接近那个灰袍人", check:{a:"AGI",sk:"潜行",label:"敏捷·接近",target:55},
      tier:{
        crit:function(){return[pickV(["你悄无声息地坐到了灰袍人旁边。他看了你一眼，嘴角一翘：「你比我想象的要敏锐。」然后他递给你一张纸条，上面画着一只闭合的眼睛。守望者密探事件触发！","灰袍人早就注意到你了。他不等你开口就说：「我观察你三天了。你有一些……不寻常的特质。跟我来。」守望者密探事件触发！"],"tavern_gray_crit")]},
        ok:function(){return[pickV(["你靠近了灰袍人，但他没说话。他只是看了你一眼，放下一枚金币就走了。你注意到他的袖口有一个奇怪的标记。金币+1，线索+1。","灰袍人对你点了点头，然后离开了。你没来得及说上话，但你感觉他是故意让你看到他的。"],"tavern_gray_ok")]},
        fail:function(){return[pickV(["你还没靠近，灰袍人就消失在人群里了。你只看到他的背影。","灰袍人察觉了你的意图，他提前离开了。"],"tavern_gray_fail")]},
        critfail:function(){return[pickV(["你撞到了一个醉汉，引起了骚动。等你平息下来，灰袍人已经不见了。而且醉汉的朋友还想找你麻烦。HP-3。","你太紧张了，打翻了一个酒杯，酒洒了旁边的人一身。你不得不赔钱道歉。金币-5。"],"tavern_gray_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"喝一杯，听听周围人说什么", effect:{time:1,gold:-2,sanRecovery:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}

/* ===== 自由探索：郊外 ===== */
N["prologue_wild"] = function(){ return {
  place:"郊外",
  text:["郊外的空气比城里清新。","风吹过田野，带来泥土和青草的气息。","远处有树林，更远处是山脉。","你可以在这里采集草药、练习技能，或者只是发呆。","但你总觉得有什么东西在树林深处看着你。"],pace:"light",
  options:[
    {t:"采集草药/材料", check:{a:"INT",sk:"草药",label:"智力·采集",target:50},
      tier:{
        crit:function(){return[pickV(["你找到了一株罕见的草药，这种草药在市场上能卖不少钱。获得：稀有草药×1。","你发现了一个隐藏的矿脉，虽然不大，但足够你挖几块好矿石。获得：铁矿石×3。"],"wild_gather_crit")]},
        ok:function(){return[pickV(["你采到了一些普通草药，够用了。获得：草药×2。","你找到了一些可食用的野菜和蘑菇。获得：食物×3。"],"wild_gather_ok")]},
        fail:function(){return[pickV(["你找了半天，什么都没找到。","你采到了一些草药，但好像认错了，可能有毒。获得：可疑草药×1。"],"wild_gather_fail")]},
        critfail:function(){return[pickV(["你被毒蛇咬了一口！HP-10，你需要尽快处理伤口。","你迷路了，在郊外转了好几个小时才找到回来的路。疲劳+2，HP-3。"],"wild_gather_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"练习技能/修炼", check:{a:"SPR",sk:"修炼",label:"灵性·修炼",target:55},
      tier:{
        crit:function(){return[pickV(["你在修炼中感受到了某种共鸣——元素在你周围流动，灵魂在你体内苏醒。天赋觉醒事件触发！属性+2！","你进入了一种前所未有的状态，感觉自己的力量在增长。天赋觉醒事件触发！技能+1！"],"wild_train_crit")]},
        ok:function(){return[pickV(["你修炼了一会儿，感觉有所收获。属性+1。","你练习了基本技能，熟练度有所提升。技能+1。"],"wild_train_ok")]},
        fail:function(){return[pickV(["你心浮气躁，什么都没练成。","你试图修炼，但总是无法集中注意力。"],"wild_train_fail")]},
        critfail:function(){return[pickV(["你修炼出了偏差，灵力逆行！HP-8，SAN-3。需要休息。","你被自己的力量反噬了，受了点内伤。HP-5。"],"wild_train_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"探索树林深处（危险）", check:{a:"AGI",sk:"潜行",label:"敏捷·探索",target:60},
      tier:{
        crit:function(){return[pickV(["你在树林深处发现了一个古老的遗迹，里面有一件奇怪的物品。获得：神秘物品×1，线索+1。","你遇到了一个隐居的老者，他教了你一些东西。技能+2，还获得了他的推荐信。"],"wild_explore_crit")]},
        ok:function(){return[pickV(["你发现了一些有趣的痕迹，像是某种大型动物留下的。线索+1。","你找到了一个安静的修炼场所，以后可以常来。获得：秘密修炼点。"],"wild_explore_ok")]},
        fail:function(){return[pickV(["树林深处太暗了，你不敢再往里走。","你听到了奇怪的声音，决定先撤退。"],"wild_explore_fail")]},
        critfail:function(){return[pickV(["你遇到了野兽！在搏斗中受了伤。HP-12，但你成功逃脱了。","你掉进了一个陷阱！花了好几个小时才爬出来。HP-8，疲劳+3。"],"wild_explore_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}

/* ===== 自由探索：导师 ===== */
N["prologue_mentor"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"导师家",
  text:["你的导师是个沉默寡言的人。","他/她教了你第一样本事，从不问你的过去，也不说自己的过去。","但你知道，他/她不是普通人。一个普通人不会有那样的眼神——看过太多生死的眼神。","今天他/她有事要对你说。"],pace:"light",
  options:[
    {t:"请求指导（提升技能）", check:{a:"INT",sk:"学习",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["导师今天格外有耐心，教了你很多真本事。技能+2，属性+1。","你领悟了导师一直以来想教你的东西。技能+2，导师好感+10。"],"mentor_train_crit")]},
        ok:function(){return[pickV(["你学到了一些东西。技能+1。","导师给你讲了一些道理，虽然不完全懂，但感觉有所收获。属性+1。"],"mentor_train_ok")]},
        fail:function(){return[pickV(["你今天状态不好，什么都没学进去。","导师有心事，教得心不在焉。"],"mentor_train_fail")]},
        critfail:function(){return[pickV(["你练习时出了差错，伤到了自己。HP-5。导师叹了口气，让你休息。","你和导师发生了争执，他/她很生气。导师好感-5。"],"mentor_train_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"询问关于学院的事", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:50},
      tier:{
        crit:function(){return[pickV(["导师沉默了很久，然后从抽屉里拿出一封信：「我本来想等你再大一点给你。但现在看来，时候到了。」这是一封写给艾尔达魔法学院的推荐信。获得：导师推荐信！机遇事件触发！","导师告诉你，他/她曾经是学院的学生。他/她可以写推荐信，但你必须证明自己值得。获得：导师的考验任务。"],"mentor_academy_crit")]},
        ok:function(){return[pickV(["导师给你讲了一些学院的情况，包括五大学院的区别和入学条件。你对未来有了更清晰的认识。","导师建议你去艾尔达魔法学院，说那里最适合你。但他/她没有写推荐信，说要靠你自己。"],"mentor_academy_ok")]},
        fail:function(){return[pickV(["导师不愿多谈，只是说：「到时候你自然会知道。」","导师转移了话题，不想讨论学院的事。"],"mentor_academy_fail")]},
        critfail:function(){return[pickV(["你问得太急了，导师皱起了眉头：「有些事，不该问的时候不要问。」导师好感-3。","导师被你的问题触动了什么，他/她突然变得很冷淡，让你离开。"],"mentor_academy_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"询问导师的过去", effect:{time:1}, go:"prologue_mentor_past"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}

N["prologue_mentor_past"]={
  place:"导师家",
  text:["导师看了你很久。","「我的过去？」他/她笑了笑，那笑容里有太多东西。","「我曾经是个很有天赋的人。比你现在还有天赋。」","「后来发生了一些事。我失去了一些人，也失去了一些信念。」","「然后我就来到了这里，当了一个普通人的老师。」","他/她看着你：「你比我幸运。你还有选择的机会。」","「不要像我一样，等到失去了才知道珍惜。」"],pace:"normal",
  options:[
    {t:"「老师，你失去了谁？」", effect:{time:1,mentor_bond:5}, go:"prologue_daily_check"},
    {t:"「我不会让你失望的。」", effect:{time:1,mentor_bond:10,flag:"mentor_promise"}, go:"prologue_daily_check"},
    {t:"默默离开", effect:{time:1}, go:"prologue_start"}
  ]
}

/* ===== 每日检查：时间推进/事件触发 ===== */
N["prologue_daily_check"] = function(){ return {tag:"event",
  place:function(){return S.loc||"序章";},
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var crisisDay = Math.floor(bg.prologueDays * 0.6);
    var msg = [];
    msg.push("第"+S.day+"天。");
    if(S.day >= crisisDay && !S.flags.crisis_triggered){
      S.flags.crisis_triggered = true;
      msg.push("今天，你感觉到了空气中的异样。");
      msg.push("有什么事情要发生了。");
    }
    if(S.day >= bg.prologueDays && !S.flags.admission_time){
      S.flags.admission_time = true;
      msg.push("你收到了几封信。是学院的录取通知。");
    }
    if(S.day > bg.prologueDays + 3){
      msg.push("不能再拖了。你必须做出选择。");
    }
    return msg;
  },
  options:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var opts = [];
    if(S.flags.crisis_triggered && !S.flags.crisis_done){
      opts.push({t:"⚠ 面对危机事件", effect:{time:0}, go:"prologue_crisis"});
    }
    if(S.flags.admission_time && !S.flags.admission_done){
      opts.push({t:"📜 查看录取通知并选择学院", effect:{time:0}, go:"prologue_admission"});
    }
    if(S.flags.awakening_ready && !S.flags.awakening_done){
      opts.push({t:"✨ 天赋觉醒", effect:{time:0}, go:"prologue_awakening"});
    }
    if(S.day > bg.prologueDays + 3){
      opts.push({t:"做出最终选择", effect:{time:0}, go:"prologue_final"});
    }
    opts.push({t:"继续探索", effect:{time:0}, go:"prologue_start"});
    return opts;
  }
};}

/* ===== 天赋觉醒事件 ===== */
N["prologue_awakening"] = function(){ return {
  place:"觉醒之地",
  text:function(){
    var job = S.job || "魔法师";
    var jobNames = {mage:"魔法师",warrior:"战士",soulmage:"灵魂法师",priest:"牧师",rogue:"盗贼",merchant:"商人",alchemist:"炼金术师"};
    return ["你感觉到了。","那种感觉从体内涌上来，像一条沉睡的河流突然苏醒。","你是一个"+(jobNames[job]||job)+"。","不——你即将成为一个"+(jobNames[job]||job)+"。","天赋觉醒的时刻到了。"];
  },
  options:[
    {t:"主动拥抱这份力量", check:{a:"SPR",sk:"修炼",label:"灵性·觉醒",target:60},
      tier:{
        crit:function(){return[pickV(["你主动拥抱了那股力量。它在你体内流淌，你感觉到了前所未有的强大。觉醒完美！属性+3，技能+2，教授关注+高。","你引导着力量在体内运转，每一个经脉都被照亮。觉醒完美！你甚至隐约看到了未来的道路。属性+3，技能+2。"],"awaken_crit")]},
        ok:function(){return[pickV(["你接受了这份力量。虽然过程有些痛苦，但你成功了。属性+2，技能+1。","力量在你体内安顿下来。你感觉自己和以前不一样了。属性+2，技能+1。"],"awaken_ok")]},
        fail:function(){return[pickV(["你试图控制力量，但它太强大了。你只能勉强接纳一部分。属性+1。","力量在你体内横冲直撞，你花了很大力气才压制住。属性+1，HP-5。"],"awaken_fail")]},
        critfail:function(){return[pickV(["力量失控了！你被反噬，倒在地上。HP-15，SAN-5。但你至少活了下来，力量也勉强觉醒了。属性+1。","你拒绝了力量，但它强行涌入你的身体。你感觉自己被撕裂了。HP-20，SAN-8，属性+1。"],"awaken_critfail")]}
      },
      effect:{time:2,flag:"awakening_done"}, go:"prologue_after_awakening"},
    {t:"被动接受，顺其自然", check:{a:"CON",sk:"生存",label:"体质·承受",target:55},
      tier:{
        crit:function(){return[pickV(["你放松身心，让力量自然流淌。出乎意料地顺利。属性+2，技能+1，SAN+3。","你像一个容器，任由力量填满。过程平静而安详。属性+2，技能+1。"],"awaken_passive_crit")]},
        ok:function(){return[pickV(["你顺其自然，力量逐渐融入你的身体。属性+2。","你没有抗拒，也没有主动追求。力量就这样安顿了下来。属性+1，技能+1。"],"awaken_passive_ok")]},
        fail:function(){return[pickV(["你太被动了，力量只觉醒了一部分。属性+1。","力量在你体内徘徊，似乎不太愿意留下。属性+1。"],"awaken_passive_fail")]},
        critfail:function(){return[pickV(["你太放松了，力量差点溜走！你勉强抓住了一部分。属性+1，HP-8。","你在觉醒过程中睡着了，醒来时力量已经消散了大半。属性+1。"],"awaken_passive_critfail")]}
      },
      effect:{time:2,flag:"awakening_done"}, go:"prologue_after_awakening"},
    {t:"拒绝这份力量", effect:{time:1,sanLoss:3}, go:"prologue_refuse_awakening"}
  ]
};}

N["prologue_after_awakening"]={
  place:"觉醒之地",
  text:["觉醒之后，你感觉整个世界都不一样了。","颜色更鲜艳了，声音更清晰了，你甚至能感觉到空气中流动的某种东西。","你的导师听到消息后赶来了。他/她看着你，眼中有欣慰，也有忧虑。","「你觉醒了。」他/她说，「从今天起，你的人生会不一样。」","「学院会注意到你的。也许已经注意到了。」","他/她递给你一些东西：「拿着这些。你会需要的。」", "觉醒之地的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
  options:[
    {t:"感谢导师，继续准备", effect:{time:1,mentor_bond:5,item:"觉醒礼包"}, go:"prologue_daily_check"},
    {t:"询问觉醒的真相", effect:{time:1}, go:"prologue_awakening_truth"}
  ]
}

N["prologue_awakening_truth"]={
  place:"导师家",
  text:["导师沉默了很久。","「觉醒的真相？」他/她叹了口气，「这个世界上，大多数人终其一生都不会觉醒。」","「觉醒意味着你被某种更高的存在注意到了。可能是神明，可能是深渊，也可能是……别的什么。」","「每一个觉醒者，都是被命运选中的人。」","「但被选中不一定是好事。」他/她的声音低了下来，「很多觉醒者，最后都消失了。」","「所以你要小心。不要轻易暴露自己的力量。」","「尤其是——不要让教会的人知道你觉醒了什么。」"],pace:"normal",
  options:[
    {t:"「我明白了。」", effect:{time:1,flag:"awakening_truth_known"}, go:"prologue_daily_check"},
    {t:"「老师，你也是觉醒者吗？」", effect:{time:1,mentor_bond:3}, go:"prologue_daily_check"}
  ]
}

N["prologue_refuse_awakening"]={
  place:"觉醒之地",
  text:["你拒绝了。","你不想成为什么觉醒者，不想被命运选中，不想过那种危险的生活。","你只想做一个普通人。","但力量不会因为你的拒绝而消失。它退到了你灵魂的深处，沉睡着，等待着某一天再次涌上来。","「你拒绝了。」导师的声音从身后传来，「但命运不会因为你的拒绝而改变。」","「它只会换一种方式到来。」"],pace:"light",
  options:[
    {t:"「我不在乎。」", effect:{time:1,flag:"awakening_refused",sanRecovery:2}, go:"prologue_daily_check"},
    {t:"……也许我该重新考虑", effect:{time:1}, go:"prologue_awakening"}
  ]
}

/* ===== 危机事件 ===== */
N["prologue_crisis"] = function(){ return {
  place:"危机现场",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var crisis = CRISIS_EVENTS[bg.id] || CRISIS_EVENTS.default;
    return ["危机来了。",crisis.desc,"你必须做出选择。"];
  },
  options:[
    {t:"正面面对（战斗/对抗）", check:{a:"STR",sk:"格斗",label:"力量·对抗",target:55},
      tier:{
        crit:function(){return[pickV(["你挺身而出，以一己之力化解了危机！所有人都用敬佩的眼光看着你。声望+15，获得：危机英雄称号。","你不仅解决了危机，还揪出了幕后黑手。声望+20，获得：关键线索。"],"crisis_fight_crit")]},
        ok:function(){return[pickV(["你付出了一些代价，但最终解决了危机。声望+10，HP-5。","你勉强控制住了局面。声望+8，获得：当地人的感激。"],"crisis_fight_ok")]},
        fail:function(){return[pickV(["你尽力了，但危机没有完全解决。声望+3，HP-10。","你被击退了。虽然没有大碍，但危机还在继续。HP-8。"],"crisis_fight_fail")]},
        critfail:function(){return[pickV(["你惨败！不仅没解决危机，还把自己搭进去了。HP-20，声望-5，被当地人指责。","你犯了严重的错误，让情况变得更糟了。HP-15，声望-10，SAN-5。"],"crisis_fight_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"},
    {t:"用智慧/谈判解决", check:{a:"INT",sk:"口才",label:"智力·谈判",target:55},
      tier:{
        crit:function(){return[pickV(["你用智慧和口才完美解决了危机，没有人受伤。声望+12，获得：关键人物的友谊。","你找到了危机的根源，从根本上解决了问题。声望+15，获得：重要线索。"],"crisis_talk_crit")]},
        ok:function(){return[pickV(["你通过谈判达成了妥协，危机暂时解除。声望+8。","你说服了关键人物，危机得到缓解。声望+6。"],"crisis_talk_ok")]},
        fail:function(){return[pickV(["谈判破裂了。对方不听你的。声望+2，你需要想别的办法。","你的话没有说服力。对方只是冷笑。"],"crisis_talk_fail")]},
        critfail:function(){return[pickV(["你说错了话，激怒了对方，情况变得更糟！声望-8，HP-5。","你在谈判中暴露了自己的底牌，被对方利用了。声望-5，损失金币-10。"],"crisis_talk_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"},
    {t:"逃跑/躲避", check:{a:"AGI",sk:"潜行",label:"敏捷·逃跑",target:50},
      tier:{
        crit:function(){return[pickV(["你巧妙地避开了危机，没有受到任何影响。但你也知道，有些事躲得过初一躲不过十五。","你在危机中全身而退，还顺便带走了一些有用的东西。获得：意外收获。"],"crisis_run_crit")]},
        ok:function(){return[pickV(["你躲开了危机的主要冲击。虽然有些内疚，但至少你安全了。","你找到了一个安全的地方躲了起来，等危机过去。"],"crisis_run_ok")]},
        fail:function(){return[pickV(["你没能完全躲开，被波及了。HP-8。","你逃跑时被人看到了，有人说你是懦夫。声望-3。"],"crisis_run_fail")]},
        critfail:function(){return[pickV(["你逃跑时摔倒了，被危机追上。HP-15，还丢了一些东西。金币-10。","你不仅没跑掉，还把自己困在了更危险的境地。HP-12，SAN-3。"],"crisis_run_critfail")]}
      },
      effect:{time:2,flag:"crisis_done",flag2:"crisis_ran"}, go:"prologue_after_crisis"},
    {t:"求助他人", check:{a:"CHA",sk:"口才",label:"魅力·求助",target:50},
      tier:{
        crit:function(){return[pickV(["你找到了正确的人求助，危机被专业地解决了。你还因此结识了一个重要人物。获得：重要人脉。","你的求助感动了有能力的人，他/她出手帮你解决了危机。声望+10，获得：贵人相助。"],"crisis_help_crit")]},
        ok:function(){return[pickV(["有人愿意帮你，危机得到了缓解。声望+5。","你找到了帮手，虽然过程有些波折，但危机过去了。"],"crisis_help_ok")]},
        fail:function(){return[pickV(["你求助的人帮不上忙，或者不愿意帮。你只能自己想办法。","没有人愿意插手这件事。你被拒绝了。"],"crisis_help_fail")]},
        critfail:function(){return[pickV(["你求助的人反而利用了你的困境，趁火打劫。金币-15，声望-5。","你找错了人，被引向了更危险的处境。HP-10，SAN-5。"],"crisis_help_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"}
  ]
};}

N["prologue_after_crisis"]={
  place:"危机之后",
  text:["危机过去了。","不管你用什么方式度过的，它都在你身上留下了印记。","镇上的人看你的眼神变了。有人敬佩，有人畏惧，有人感激，有人怨恨。","你的导师找到你，说了一句话：「经此一事，你已经不是以前的你了。」","「学院会听到消息的。准备好迎接录取通知吧。」", "你收拾停当，离开危机之后，沿着来路踏上行程。"],pace:"light",
  options:[
    {t:"继续准备入学", effect:{time:1}, go:"prologue_daily_check"},
    {t:"查看危机带来的影响", effect:{time:0}, go:"prologue_status"}
  ]
}

/* ===== 多学院录取抉择 ===== */
N["prologue_admission"] = function(){ return {
  place:"住处",
  text:["你收到了几封信。","信封上印着不同的徽章——那是各大学院的标志。","你拆开信，一封一封地读。","每一封信都在邀请你加入他们的学院。","这是你人生中最重要的选择之一。"],pace:"light",
  options:function(){
    var opts = [];
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    // 根据出身和属性显示可用学院
    opts.push({t:"🏛 艾尔达魔法学院（自由城邦）—— 多元包容，七职业可入", effect:{time:1,flag:"admission_elda",school_rep:10}, go:"prologue_choose_elda"});
    if(S.attrs.INT >= 45 || S.job==="mage" || S.job==="alchemist"){
      opts.push({t:"📚 承天书院（东部王国）—— 东方儒道，魔法师/炼金术师", effect:{time:1,flag:"admission_chengtian",school_rep:10}, go:"prologue_choose_chengtian"});
    }
    if(S.attrs.SPR >= 40 || S.job==="priest" || S.background==="human_church_adopted"){
      opts.push({t:"✝ 圣光神学院（教会区）—— 教会正统，牧师/神圣学派", effect:{time:1,flag:"admission_holy",school_rep:10}, go:"prologue_choose_holy"});
    }
    if(S.race==="精灵" || (S.attrs.CHA >= 50 && S.attrs.SPR >= 40)){
      opts.push({t:"🌿 银叶学院（精灵王国）—— 自然魔法，世界树下", effect:{time:1,flag:"admission_silverleaf",school_rep:10}, go:"prologue_choose_silverleaf"});
    }
    if(S.race==="矮人" || S.attrs.STR >= 40 || S.skills && S.skills.锻造){
      opts.push({t:"🔥 熔炉学院（矮人王国）—— 锻造工程，永恒熔炉旁", effect:{time:1,flag:"admission_forge",school_rep:10}, go:"prologue_choose_forge"});
    }
    if(S.flags.watcher_invited){
      opts.push({t:"👁 守望者秘密学院（隐藏路线）—— 不公开招生", effect:{time:1,flag:"admission_watcher",school_rep:5}, go:"prologue_choose_watcher"});
    }
    opts.push({t:"再想想，暂时不决定", effect:{time:1}, go:"prologue_daily_check"});
    return opts;
  }
};}

N["prologue_choose_elda"]={
  place:"住处",
  text:["你选择了艾尔达魔法学院。","信上说，开学日在一个月后。你需要自行前往交汇城报到。","随信附上了一张地图和一份入学须知。","还有一张纸条，上面写着：「墨丘利教授期待见到你。」","墨丘利？你好像在哪里听过这个名字。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_elda"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

N["prologue_choose_chengtian"]={
  place:"住处",
  text:["你选择了承天书院。","信是用毛笔写的，字迹飘逸，带着一股墨香。","信上说，承天书院在东部王国的后山，需要通过一道特殊的阵法才能进入。","随信附上了一枚玉佩，说是入门的信物。","还有一句话：「后山有时光裂隙，望汝慎之。」","【承天城开局】东境的晨光，从宫墙的琉璃瓦上滑下来。你站在承天城的大街上，看这座帝京的繁华：商铺林立，车马如流，连空气里都飘着香料和丝绸的气味。","","你身上带着东境人的印记——说话的口音，走路的姿态，连揣手的样子，都透着这座城的讲究。你知道，在这座城里，脸面就是通行证。","","街角，一个穿官服的人正训斥挑夫，声音不大，却让满街的人都低了头。你看了看那座巍峨的宫城——从今天起，你要在这里，挣出自己的前程。","", "出了住处，风迎面扑来。你认了认方向，启程。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_chengtian"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

N["prologue_choose_holy"]={
  place:"住处",
  text:["你选择了圣光神学院。","信上印着教会的徽章，散发着淡淡的圣光气息。","信上说，神学院在教会区的圣城，入学前需要接受一次信仰检验。","随信附上了一枚圣徽和一本圣经。","信的末尾写着：「愿光明指引你的道路。」", "住处在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_holy"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

N["prologue_choose_silverleaf"]={
  place:"住处",
  text:["你选择了银叶学院。","信是用某种树叶做的，上面的文字像是自然生长出来的。","信上说，银叶学院在精灵王国的世界树下，人类学生需要由精灵向导带领才能进入。","随信附上了一片银色的树叶，说是联络的信物。","信的末尾用精灵语写了一句话，你看不懂，但感觉很温暖。", "你离了住处，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_silverleaf"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

N["prologue_choose_forge"]={
  place:"住处",
  text:["你选择了熔炉学院。","信是刻在一块薄铁片上的，字里行间都带着炉火的气息。","信上说，熔炉学院在矮人王国的铁峰堡地下，入学需要通过锻造考验。","随信附上了一把小型锻造锤和一张铁峰堡的通行证。","信的末尾写着：「熔炉不熄，战士不死。」", "你收拾停当，离开住处，沿着来路踏上行程。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_forge"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

N["prologue_choose_watcher"]={
  place:"住处",
  text:["你选择了守望者秘密学院。","这封信没有徽章，没有署名，只有一个符号——一只闭合的眼睛。","信上只有一句话：「午夜时分，到城北的废弃教堂来。一个人。」","你不知道等待你的是什么。","但你知道，这是一条与众不同的路。", "别过住处，你沿官道走出里许，回头已看不清来处。"],pace:"light",
  options:[
    {t:"确认选择，午夜赴约", effect:{time:1,flag:"admission_done",flag2:"school_watcher"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}

/* ===== 入学前最后选择 ===== */
N["prologue_final"]={
  place:"出发前",
  text:["出发的日子到了。","你收拾好行囊，站在门口，最后看了一眼这个你生活了十六七年的地方。","有很多人来送你——或者没有人来送你。","不管怎样，从今天起，你要离开这里了。","在出发之前，你还有最后一个选择。"],pace:"light",
  options:[
    {t:"正常出发，前往学院", effect:{time:1}, go:"prologue_enroll_normal"},
    {t:"推迟入学，先处理未完之事", effect:{time:3,rep:-10,item:"prologue_special_item"}, go:"prologue_enroll_delay"},
    {t:"与重要的人告别/约定", effect:{time:1,npc_bond:10}, go:"prologue_enroll_companion"},
    {t:"放弃入学，走自由冒险者路线", effect:{time:1,flag:"skip_academy"}, go:"city_free"}
  ]
}

N["prologue_enroll_normal"]={
  place:"前往学院的路上",
  text:["你出发了。","路很长，你有足够的时间思考未来。","你会在学院遇到什么人？学到什么本事？面临什么危险？","一切都是未知。","但你知道，从今天起，你不再是那个出身地的孩子了。","你是艾尔达大陆的一个新变量。","序章结束。学院线开始。"],pace:"light",
  options:[
    {t:"踏入学院", effect:{time:0,flag:"prologue_complete"}, go:"academy_start"}
  ]
}

N["prologue_enroll_delay"]={
  place:"未完之事",
  text:["你推迟了入学。","因为还有一件事你必须做——可能是为了某个人，可能是为了某个承诺，也可能是为了某个秘密。","你花了三天时间处理这件事。","最终，你得到了一件特殊的物品，也错过了学院的新生欢迎仪式。","但你不后悔。","有些事，比入学更重要。"],pace:"light",
  options:[
    {t:"带着收获前往学院", effect:{time:0,flag:"prologue_complete",flag2:"delayed_enrollment"}, go:"academy_start"}
  ]
}

N["prologue_enroll_companion"]={
  place:"告别",
  text:["你找到了那个对你重要的人。","可能是你的导师，可能是你的发小，可能是你在危机中认识的朋友。","你们说了很多话。关于过去，关于未来，关于重逢的约定。","「到了学院，别忘了写信。」他/她说。","「如果遇到麻烦，就回来找我。」","你点点头，把这份情谊记在心里。","然后你出发了。"],pace:"light",
  options:[
    {t:"带着祝福前往学院", effect:{time:0,flag:"prologue_complete",flag2:"companion_bond"}, go:"academy_start"}
  ]
}

/* ===== 序章状态面板 ===== */
N["prologue_status"] = function(){ return {
  place:"状态",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var msg = [];
    msg.push("=== 序章状态 ===");
    msg.push("出身："+bg.cn);
    msg.push("第"+S.day+"天 / 共"+bg.prologueDays+"天");
    msg.push("金币："+S.gold);
    msg.push("HP："+S.hp+"/"+S.maxHp);
    msg.push("SAN："+S.san);
    msg.push("天赋觉醒："+(S.flags.awakening_done?"已完成":"未触发"));
    msg.push("危机事件："+(S.flags.crisis_done?"已度过":"未触发"));
    msg.push("录取通知："+(S.flags.admission_time?"已收到":"未收到"));
    msg.push("已选学院："+(S.flags.admission_done?"已选择":"未选择"));
    msg.push("");
    msg.push("目标：触发天赋觉醒 → 度过危机事件 → 收到录取通知 → 选择学院 → 出发");
    return msg;
  },
  options:[
    {t:"返回", effect:{time:0}, go:"prologue_start"}
  ]
};}

/* ===== 序章衔接学院线 ===== */
/* /v62inj:chunk-academy/ N["academy_start"] 已移入 chunks/v62_academy.js */
/* ============================================================
   v16 方向一：八大势力完整剧情线
   ============================================================ */

N["faction_overview"]={tags:["faction:war"],pace:"normal",
  place:"势力总览",
  text:["八大势力。","艾尔达大陆的格局，由八根支柱撑起。每一根支柱，都有自己的历史、自己的利益、自己的秘密。","你站在交汇城的最高处，俯瞰着这座城市。街道如蛛网般向四面八方延伸，每一条路都通向一个不同的世界。","北方——七座公国组成的联盟，铁与血的国度。铁门关的废墟还在冒烟，兽人的战鼓依然在草原上回响。","南方——五座商业城邦的联合体，金与银的国度。商船扬帆四海，金币流淌如河，但水面下暗流汹涌。","自由城邦——交汇城为中心的自由贸易区，万族混居之地。没有国王，只有议会；没有军队，只有佣兵。","精灵王国——世界树下的古老国度，魔法与艺术的殿堂。长生种的傲慢与疲惫，都刻在他们银白色的眼睛里。","矮人王国——铁峰堡内的地下帝国，锻造与工程的圣地。锤击声日夜不停，那是矮人的心跳，也是他们的恐惧。","兽人草原——部落联盟的广袤原野，力量与荣耀的猎场。萨满的骨鼓敲响，祖先的灵魂在风中低语。","东部王国——承天山下的中央王朝，儒道与秩序的疆域。皇帝端坐九重，党争暗流涌动，时光裂隙在山巅闪烁。","光明教会——圣城为中心的神权国度，信仰与审判的堡垒。净化令的旗帜飘扬，审判骑士的铁靴踏遍大陆。","八大势力，八种意识形态，八种未来。","而你，将在这八根支柱之间行走。你的每一个选择，都可能让某根支柱倾斜，让整个大陆的格局改变。","风从北方吹来，带着铁锈和雪的味道。你拉紧斗篷，走进了城市的喧嚣里。","你的故事，才刚刚开始。但八大势力的故事，已经演了三千年。"],pace:"normal",
  options:[
    {t:"自由城邦", effect:{time:0}, go:"faction_free_intro"},
    {t:"北方公国联盟", effect:{time:0}, go:"faction_north_intro"},
    {t:"精灵王国", effect:{time:0}, go:"faction_elf_intro"},
    {t:"矮人王国", effect:{time:0}, go:"faction_dwarf_intro"},
    {t:"兽人草原", effect:{time:0}, go:"faction_orc_intro"},
    {t:"光明教会", effect:{time:0}, go:"faction_church_intro"},
    {t:"离开", effect:{time:0}, go:"echo_mercury_ally"}
  ]
}

N["faction_free_intro"] = function(){ return {
  place:"自由城邦·交汇城",
  text:["自由城邦。","没有国王，没有贵族，没有世袭的权力。","交汇城的议会广场上，十二根石柱围成一个圆，每根柱子代表一个家族。十二家族议会，是自由城邦的最高权力机构。","你走在交汇城的大街上，周围是熙熙攘攘的人群。人类、精灵、矮人、兽人、半身人——万族混居，摩肩接踵。","空气里有烤面包的香气，有马粪的臭味，有香水的甜腻，还有一种属于大城市的、说不清的味道。","自由城邦的自由，是金钱的自由。在这里，只要你有钱，你能买到任何东西——包括秘密，包括权力，包括人命。","但自由也是有代价的。没有国王意味着没有秩序的最终裁决者，议会的扯皮常常让紧急事务一拖再拖。","你注意到，街角站着两个穿灰袍的人。他们没有参与任何交易，只是静静地观察着人群。","其中一个转过头，看了你一眼。那道视线很冷，像是在看一件物品。","然后他转回头，继续观察。","你移开视线，假装没有看到。但你心里记下了——在自由城邦，不只有商人。","还有影子。", "离开交汇城时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"normal",
  options:[
    {t:"调查十二家族议会", check:{a:"INT",sk:"调查",label:"智力·调查",target:55},
      tier:{
        crit:function(){return[pickV(["你深入调查了十二家族议会，发现了一个惊人的秘密：其中三个家族已经被暗蚀会渗透了。线索+3，暗蚀会线索+1。","你找到了议会的内部记录，了解了各家族之间的利益纠葛和秘密联盟。线索+2。"],"free_council_crit")]},
        ok:function(){return[pickV(["你了解了十二家族的基本情况和他们之间的关系。线索+1。","你收集了一些关于议会的公开信息。知识+1。"],"free_council_ok")]},
        fail:function(){return[pickV(["议会的内部信息被严格保密，你什么都没查到。","你调查了半天，没有发现什么有用的东西。"],"free_council_fail")]},
        critfail:function(){return[pickV(["你的调查被发现了，有人警告你不要再查下去。声望-3，SAN-2。","你被当成了间谍，被城卫盘问了很久。声望-5，金币-10（贿赂）。"],"free_council_critfail")]}
      },
      effect:{time:2}, go:"faction_free_main"},
    {t:"去金秤家族拜访亚历山大", effect:{time:1}, go:"faction_free_medici"},
    {t:"在城里逛逛", effect:{time:1}, go:"city_jiaohui_deep"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_free_main"] = function(){ return {
  place:"自由城邦",
  text:["议会广场。","今天的议会特别热闹。十二家族的代表都到齐了，围坐在圆形的议事桌旁，争论声此起彼伏。","你站在旁听席的角落里，观察着这场权力的游戏。","美第奇家族的代表——一个头发花白的老商人——正在发言。他的声音不大，但每个字都像是经过了精打细算，「净化令已经影响到了我们的贸易。教会的审判骑士在商路上设卡，每一支商队都要被搜查。上个月，有三艘货船被扣押，理由是『装载异端物品』。」","「那里面确实有灵魂魔法的材料。」另一个家族的代表冷笑道，「美第奇家族的生意，一向是什么赚钱做什么。」","老商人的脸色不变：「自由城邦的法律没有禁止灵魂魔法材料的贸易。教会的手，伸得太长了。」","争论继续。你注意到，有几个家族的代表一直在沉默。他们不发言，但他们的眼睛在观察，在计算。","自由城邦的政治，不是在议事桌上决定的。是在议事桌下，在密室里，在酒杯的碰撞声中，在金币的流转中决定的。","你想起了亚历山大·金秤说过的话：「在交汇城，每一笔生意都是政治，每一次政治都是生意。」","议会的争论还在继续。窗外，太阳渐渐西斜，把议事厅染成了金红色。","你知道，今天的议会不会有任何结果。十二家族的利益太分散了，任何决议都需要至少八家同意，而要让八家达成一致，比让兽人吃素还难。","但这就是自由城邦。混乱，喧嚣，充满活力，也充满危险。","你吸了口气，走出了议事厅。走廊里很安静，只有你的脚步声在大理石地面上回响。","身后，争论声还在继续。"],pace:"normal",
  options:[
    {t:"支持金秤家族", effect:{time:1,自由城邦_rep:10,flag:"free_support_jincheng"}, go:"faction_free_ending"},
    {t:"支持其他家族", effect:{time:1,自由城邦_rep:5,flag:"free_support_other"}, go:"faction_free_ending"},
    {t:"暗中调查暗蚀会的渗透", check:{a:"INT",sk:"调查",label:"智力·调查",target:65},
      tier:{
        crit:function(){return[pickV(["你找到了暗蚀会渗透议会的证据，包括他们收买议员的记录。这是重大发现！线索+3，暗蚀会声望-10。","你不仅找到了证据，还发现了暗蚀会在自由城邦的负责人是谁。线索+3。"],"free_eclipse_crit")]},
        ok:function(){return[pickV(["你找到了一些线索，指向某个家族可能被暗蚀会渗透了。线索+2。","你收集了一些证据，但还不够确凿。线索+1。"],"free_eclipse_ok")]},
        fail:function(){return[pickV(["暗蚀会的人太狡猾了，你什么都没查到。","你的调查被暗蚀会发现了，他们销毁了证据。"],"free_eclipse_fail")]},
        critfail:function(){return[pickV(["你被暗蚀会的人发现了，他们试图灭口。你好不容易才逃脱。HP-15，SAN-5。","你中了暗蚀会的圈套，被他们反咬一口，说你是间谍。声望-10。"],"free_eclipse_critfail")]}
      },
      effect:{time:2}, go:"faction_free_ending"},
    {t:"不介入政治，做自由冒险者", effect:{time:1,flag:"free_neutral"}, go:"faction_free_ending"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_free_medici"] = function(){ return {
  place:"金秤家族府邸",
  text:["美第奇商会的密室。","亚历山大·金秤带你穿过大厅，走过一条狭窄的走廊，来到一扇没有任何标记的木门前。","他敲了三下门——两短一长。门从里面打开了，一个老妇人站在门口。她的头发全白了，眼睛却很亮，像是两颗黑曜石。","「这是洛伦佐夫人。」亚历山大介绍道，「美第奇家族的……管家。」","他说『管家』的时候，嘴角扬了扬，像是在说一个笑话。但你能感觉到，这个老妇人不简单。","密室不大，四壁都是书架，书架上摆满了账本和信件。房间中央有一张桌子，桌上铺着一张大陆地图，地图上插着许多小旗——红色的是美第奇的商路，蓝色的是竞争对手的，黑色的是……已经被毁掉的。","「坐吧。」洛伦佐夫人说，声音沙哑但有力，「亚历山大说，你对美第奇家族感兴趣。」","她看着你，黑曜石一样的眼睛里没有任何情绪：「你知道美第奇家族是怎么倒台的吗？」","不等你回答，她继续说：「不是因为异端。是因为我们知道了太多。」","她走到地图前，用手指点了点死亡沙漠的位置：「四十年前，美第奇家族的商队在这里发现了一座遗迹。遗迹里的东西……改变了一切。」","「教会知道了。然后，清洗就来了。」","她转过身，看着你：「你想知道遗迹里有什么吗？」","密室里很安静。你能听到自己的心跳声，还有从墙壁深处传来的、微弱的水滴声。","亚历山大站在门口，双手抱胸，看着你。他的表情很平静，但你注意到，他的右手一直在摩挲着无名指上的戒指。","那枚戒指上，天平的一端是空的。少了一条蛇。"],pace:"normal",
  options:[
    {t:"「我愿意帮你。」", effect:{time:1,亚历山大_bond:10,自由城邦_rep:10,flag:"ally_jincheng"}, go:"faction_free_ending"},
    {t:"「我需要考虑一下。」", effect:{time:1}, go:"faction_free_main"},
    {t:"「美第奇家族的事，你知道多少？」", check:{a:"CHA",sk:"口才",label:"魅力·试探",target:60},
      tier:{
        crit:function(){return[pickV(["亚历山大的表情变了。「美第奇家族……」他轻声说，「那是我母亲的家族。她是美第奇家族的人，嫁给了我父亲。」「教会清洗美第奇家族时，我母亲怀着我。她用金秤家族的名义保护了我。」线索+3，美第奇线索+2。","亚历山大告诉你一个秘密：他一直在暗中调查美第奇家族被清洗的真相。「教会说他们是异端，但我知道，那是一场政治谋杀。」线索+3。"],"free_medici_crit")]},
        ok:function(){return[pickV(["亚历山大告诉了你一些美第奇家族的历史，但他显然隐瞒了一些东西。线索+1。","亚历山大对美第奇家族的事讳莫如深，你只了解了一些皮毛。"],"free_medici_ok")]},
        fail:function(){return[pickV(["亚历山大不愿意谈论美第奇家族，他转移了话题。","亚历山大只是说：「那是过去的事了。」"],"free_medici_fail")]},
        critfail:function(){return[pickV(["你的问题让亚历山大警惕起来，他以为你是教会的探子。亚历山大好感-10。","你问得太直接了，亚历山大叫人送客。声望-3。"],"free_medici_critfail")]}
      },
      effect:{time:1}, go:"faction_free_ending"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_free_ending"]={tags:["faction:war"],tag:"ending",
  place:"自由城邦",
  text:["你离开了美第奇商会的密室。","外面的天已经黑了。交汇城的夜晚比白天更热闹——酒馆里坐满了人，夜市的摊位一个挨着一个，灯笼的光照亮了整条街。","但你没有心情欣赏夜景。","洛伦佐夫人的话还在你耳边回响：「不是因为异端。是因为我们知道了太多。」","美第奇家族的倒台，不是一场简单的宗教清洗。背后有更深的东西——死亡沙漠的遗迹，教会的恐惧，还有那些被抹去的真相。","你抬头看了一眼夜空。星星很亮，但你总觉得，有什么东西在星星后面看着你。","自由城邦的故事，比你想象的更复杂。十二家族的博弈，美第奇的遗产，教会的渗透，暗蚀会的阴影……","这些线交织在一起，构成了一张巨大的网。而你，刚刚触碰到了网的边缘。","风从北方吹来，带着铁锈和雪的味道。你拉紧斗篷，走进了夜色里。","你不知道的是，在你身后的屋顶上，一只乌鸦正歪着头看着你。它的眼睛是暗红色的。","然后它振翅飞走了，消失在夜空中。","自由城邦的故事，还在继续。而你的故事，已经和它纠缠在了一起。"],pace:"normal",
  options:[
    {t:"继续探索其他势力", effect:{time:1}, go:"faction_overview"},
    {t:"离开", effect:{time:0}, go:"echo_mercury_disappointed"}
  ]
}

N["faction_north_intro"] = function(){ return {tag:"branch",
  place:"北方公国联盟·铁门关",
  text:["北方公国联盟。","七座公国，七大家族，七面旗帜。","你站在北境的城墙上，看着眼前的景象。大地是灰白色的，远处的山脉覆盖着终年不化的积雪，风从北方吹来，像刀子一样割在脸上。","北方人的性格，就像这片土地——坚硬、冷峻、不擅言辞。但他们的忠诚，也像这片土地一样深厚。","铁门关就在南边。三年前，那里还是北方最坚固的关隘。现在，它只剩下断壁残垣。","你能看到，废墟上有黑烟在升起。不是战火——是有人在废墟里生火取暖。那些是无家可归的难民，铁门关破碎后，他们失去了家园，只能在废墟里苟延残喘。","北方公国联盟的首都在霜脊城。七大公的家族都在那里，联盟议会也在那里。","但你听说，最近联盟议会吵得很厉害。有人主张全力反攻，收复铁门关；有人主张和兽人谈判，划地而治；还有人……在暗中接触教会，希望借净化令的力量巩固自己的地位。","北方不冷。冷的是人心。","你拉紧了斗篷，走下了城墙。城墙根下，一个老兵正在磨刀。他的动作很慢，很专注，像是在进行某种仪式。","你注意到，他的磨刀石上，有暗红色的痕迹。那不是锈。","是血。", "你最后回望一眼铁门关，转身穿过街口，往下一程赶路。"],pace:"normal",
  options:[
    {t:"调查铁门关之战的真相", check:{a:"INT",sk:"调查",label:"智力·调查",target:60},
      tier:{
        crit:function(){return[pickV(["你找到了当年的守军幸存者，他告诉你一个惊人的真相：铁门关不是被兽人攻破的，是被内奸打开的城门。「那个内奸……是北方公国的人。」线索+3。","你在废墟里找到了一些证据，指向了某个公国的公爵。他可能和兽人有秘密交易。线索+3。"],"north_truth_crit")]},
        ok:function(){return[pickV(["你了解了铁门关之战的大致经过，但真相依然模糊。线索+1。","你收集了一些关于战争的信息。知识+1。"],"north_truth_ok")]},
        fail:function(){return[pickV(["战争的真相被刻意掩盖了，你什么都没查到。","你调查了半天，没有发现什么有用的东西。"],"north_truth_fail")]},
        critfail:function(){return[pickV(["你的调查引起了某些人的注意，他们警告你不要再查下去。声望-3，SAN-2。","你被当成了兽人的间谍，被北方联军抓了起来。HP-5，声望-5。"],"north_truth_critfail")]}
      },
      effect:{time:2}, go:"faction_north_main"},
    {t:"拜访北方联军的统帅", effect:{time:1}, go:"faction_north_commander"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_north_commander"] = function(){ return {tag:"branch",
  place:"北方联军大营",
  text:["霜脊城·军事统帅府。","你被带进了一间挂满武器的房间。墙上挂着各式兵器——长剑、战斧、长矛、弓弩，每一件都有使用过的痕迹。","房间的正中央，一个男人正在擦一把巨剑。","他很高，比你高出一个头，肩膀宽阔得像是一堵墙。他的头发是灰白色的，脸上有一道从额头延伸到下巴的伤疤，那道疤让他的脸看起来格外狰狞。","他就是北方公国联盟的军事统帅——格罗姆·铁拳。","「你就是那个到处打听铁门关的人？」他头也不抬地说，声音像是两块石头在撞击，「问吧。但我警告你——有些真相，知道了比不知道更痛苦。」","他终于抬起头，看着你。他的眼睛是冰蓝色的，像北方的冻土一样冷。但你在那双眼睛里，看到了更深的东西——不是愤怒，不是悲伤，而是一种被压抑了很久的、近乎疯狂的执念。","「铁门关不是被兽人打碎的。」他说，把巨剑插回剑鞘，金属碰撞的声音在房间里回荡，「是被我们自己人打碎的。」","他走到窗前，看着外面的雪景：「三年前，联盟议会收到密报，说铁门关守将通敌。议会没有核实，就派了刺客。刺客在守将的酒里下了毒。」","「守将死了，军心大乱。兽人趁机攻破了铁门关。然后，第一印就碎了。」","他转过身，看着你，冰蓝色的眼睛里有火焰在燃烧：「那个密报，是假的。是有人故意伪造的，为了除掉守将。」","「那个人，现在还坐在联盟议会里。」","房间里很安静。你能听到窗外的风声，还有远处军营里传来的号角声。","格罗姆·铁拳的手按在剑柄上，指节发白。","「我一直在查。」他说，声音低了下来，「查了三年。我快查到了。但每次快接近真相的时候，线索就断了。」","「因为有人在阻止我。」","他看着你，像是在审视，又像是在期待：「你愿意帮我吗？」"],pace:"normal",
  options:[
    {t:"「我愿意为北方效力。」", effect:{time:1,北方_rep:10,flag:"ally_north"}, go:"faction_north_mission"},
    {t:"「铁门关的真相到底是什么？」", check:{a:"CHA",sk:"口才",label:"魅力·追问",target:65},
      tier:{
        crit:function(){return[pickV(["格罗姆沉默了很久，然后说：「铁门关的事……是北方的耻辱。」「有人收了兽人的钱，打开了城门。我知道是谁，但我没有证据。」他的拳头握紧了，「总有一天，我会让他付出代价。」线索+3。","格罗姆告诉你一个秘密：当年打开城门的人，现在已经是某个公国的公爵了。「他隐藏得很好，但我一直在收集证据。」线索+3。"],"north_commander_truth_crit")]},
        ok:function(){return[pickV(["格罗姆告诉了你一些战争的细节，但关键部分他没有说。线索+1。","格罗姆对铁门关的事讳莫如深，你只了解了一些皮毛。"],"north_commander_truth_ok")]},
        fail:function(){return[pickV(["格罗姆不愿意谈论铁门关，他转移了话题。","格罗姆只是说：「那是一场悲剧。」"],"north_commander_truth_fail")]},
        critfail:function(){return[pickV(["你的追问激怒了格罗姆，他叫人把你赶了出去。北方声望-10。","你问得太直接了，格罗姆以为你是来挑拨离间的。北方声望-5。"],"north_commander_truth_critfail")]}
      },
      effect:{time:1}, go:"faction_north_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_north_mission"] = function(){ return {tag:"branch",
  place:"北方联军大营",
  text:["铁门关废墟·深夜。","格罗姆给了你一个任务——潜入铁门关废墟，找到当年守将的府邸，搜寻他被毒杀的证据。","你在夜色的掩护下，穿过了废墟。月光照在断壁残垣上，把影子拉得很长，像是无数只手在地面上摸索。","空气里有一股奇怪的味道——不是腐烂的臭味，而是一种更深层的、属于深渊的气息。第一印碎了之后，这种气息就一直在这里弥漫。","你找到了守将的府邸。说是府邸，其实只剩下了地基和几面墙。屋顶已经塌了，院子里长满了枯草。","你蹲下来，在废墟里翻找。手指触碰到冰冷的石头，还有一些已经发黑的木头。","然后，你在一个倒塌的书架下面，找到了一个铁盒。","铁盒已经生锈了，但锁还完好。你用匕首撬开了锁，里面是一叠信件和一个小瓶子。","信件是守将写的，收信人是格罗姆·铁拳。信里提到了联盟议会内部的阴谋——有人在和暗蚀会接触，有人在出卖北方的利益。","那个小瓶子里，是一些白色的粉末。你闻了闻——无味。但你知道，这很可能就是毒死守将的毒药。","你把东西收进怀里，正准备离开，突然听到了脚步声。","不止一个人。","你躲在一堵断墙后面，屏住呼吸。三个穿黑衣的人走进了院子，他们的手里握着短剑，剑身在月光下泛着冷光。","「有人来过。」其中一个说，声音很低，「脚印是新的。」","「搜。」另一个说，「格罗姆的人，一个都不能留。」","你的心跳加速了。你握紧了手里的武器，背靠墙壁，等待着。","风从废墟里吹过，发出呜呜的声响，像是谁在哭。"],pace:"normal",
  options:[
    {t:"去兽人草原侦察", check:{a:"AGI",sk:"潜行",label:"敏捷·侦察",target:60},
      tier:{
        crit:function(){return[pickV(["你深入兽人草原，发现了一个惊人的秘密：兽人正在集结大军，准备再次进攻北方。但他们的目标不是北方，而是……死亡沙漠。线索+3。","你不仅侦察到了兽人的军事部署，还发现了他们和暗蚀会的联系。线索+3，暗蚀会线索+1。"],"north_scout_crit")]},
        ok:function(){return[pickV(["你收集了一些兽人的军事情报，虽然不够详细。线索+1。","你了解了兽人草原的基本情况。知识+1。"],"north_scout_ok")]},
        fail:function(){return[pickV(["你被兽人发现了，不得不赶紧撤退。什么情报都没拿到。","你在草原上迷路了，转了半天才回来。"],"north_scout_fail")]},
        critfail:function(){return[pickV(["你被兽人抓住了！虽然你设法逃脱，但受了重伤。HP-20，北方声望-5。","你中了兽人的埋伏，差点死掉。HP-25，SAN-5。"],"north_scout_critfail")]}
      },
      effect:{time:3,北方_rep:5}, go:"faction_north_ending"},
    {t:"去铁门关清理深渊生物", check:{a:"STR",sk:"格斗",label:"力量·战斗",target:55},
      tier:{
        crit:function(){return[pickV(["你在铁门关废墟里斩杀了数十只深渊生物，还找到了一个深渊裂隙的入口。你暂时封印了它。北方声望+15，HP-10。","你不仅清理了深渊生物，还救出了几个被困的幸存者。他们对你感激不尽。北方声望+10，声望+5。"],"north_clean_crit")]},
        ok:function(){return[pickV(["你清理了一些深渊生物，虽然没有完全清除。北方声望+5，HP-5。","你完成了基本的清理任务。北方声望+3。"],"north_clean_ok")]},
        fail:function(){return[pickV(["深渊生物太多了，你不得不撤退。HP-10。","你打不过那些深渊生物，灰溜溜地回来了。"],"north_clean_fail")]},
        critfail:function(){return[pickV(["你被深渊生物围攻了，受了重伤。HP-25，SAN-10。","你触发了一个深渊陷阱，差点死掉。HP-30，SAN-15。"],"north_clean_critfail")]}
      },
      effect:{time:2}, go:"faction_north_ending"},
    {t:"去游说各个公国", check:{a:"CHA",sk:"口才",label:"魅力·游说",target:60},
      tier:{
        crit:function(){return[pickV(["你成功游说了三个公国增加军费，格罗姆对你刮目相看。北方声望+15，金币+30。","你不仅完成了游说任务，还促成了两个公国的结盟。北方声望+20。"],"north_lobby_crit")]},
        ok:function(){return[pickV(["你游说了一个公国增加军费。北方声望+5，金币+10。","你完成了基本的游说任务。北方声望+3。"],"north_lobby_ok")]},
        fail:function(){return[pickV(["你没能说服任何一个公国。","你的游说被拒绝了。"],"north_lobby_fail")]},
        critfail:function(){return[pickV(["你在游说时说错了话，引起了某个公爵的不满。北方声望-10。","你被某个公国当成了间谍，差点被抓。声望-5。"],"north_lobby_critfail")]}
      },
      effect:{time:3}, go:"faction_north_ending"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_north_main"]={tags:["faction:war"],pace:"normal",tag:"branch",
  place:"北方公国联盟",
  text:["你带着证据回到了霜脊城。","格罗姆看完那些信，沉默了很久。他的手在发抖——不是因为冷，而是因为愤怒。","「是他。」他终于开口了，声音沙哑，「是沃顿公爵。」","沃顿公爵——七大公之一，联盟议会里最有势力的人物。他一直主张和兽人谈判，甚至有人说，他的儿子在兽人部落里当人质。","「他通敌。」格罗姆把信拍在桌子上，「他和暗蚀会合作，除掉了守将，打碎了铁门关，然后……」","他没有说下去。但你明白了——沃顿公爵做的这一切，都是为了权力。铁门关碎了，守将死了，他就成了北方最有势力的人。","「我要在联盟议会上揭发他。」格罗姆说，眼里燃烧着复仇的火焰。","但你知道，这不容易。沃顿公爵在议会里经营了几十年，党羽众多。仅凭几封信，不一定能扳倒他。","而且，你在废墟里遇到的那三个黑衣人——他们是谁派来的？如果是沃顿公爵的人，那么他已经知道你在调查了。","你看着格罗姆。这个老兵的脸上，那道伤疤在烛光下格外明显。他的眼睛里，有复仇的执念，也有疲惫。","「你打算怎么做？」你问。","他沉默了一会儿，然后说：「我需要证据。更多的证据。还有……盟友。」","他看着你：「你愿意帮我吗？帮我扳倒沃顿公爵，还守将一个公道？」","窗外，北风呼啸。霜脊城的灯火在风中摇曳，像是随时会熄灭。","北方的雪，还在下。"],pace:"normal",
  options:[
    {t:"支持格罗姆，加强联军", effect:{time:1,北方_rep:10,flag:"support_grrom"}, go:"faction_north_ending"},
    {t:"调查内奸，找出真相", effect:{time:1,flag:"investigate_traitor"}, go:"seal_1_intro"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
}

N["faction_north_ending"]={tags:["faction:war"],tag:"branch",
  place:"北方公国联盟",
  text:["你离开了军事统帅府。","外面的雪更大了。鹅毛大的雪花从天上落下来，把整个霜脊城都染成了白色。","你走在雪地里，脚下发出咯吱咯吱的声响。街道上的行人很少，大家都躲在屋里取暖。","格罗姆的话还在你耳边回响：「是沃顿公爵。他通敌。」","北方公国联盟的内部，比你想象的更黑暗。七大家族之间的争斗，已经到了你死我活的地步。而铁门关的破碎，第一印的陨落，不过是这场权力游戏的牺牲品。","你抬头看了一眼天空。雪花落在你的脸上，冰凉的。你想起了铁门关废墟里的那些难民——他们失去了家园，失去了亲人，而这一切，只是因为一个公爵的野心。","你握紧了拳头。","远处，军营的号角声又响了。那是换岗的号角，低沉而悠长，在雪夜里传得很远。","你不知道格罗姆能不能成功。你也不知道，自己会不会被卷入这场权力的漩涡。","但你知道，北方的故事，才刚刚开始。沃顿公爵的阴谋，暗蚀会的渗透，兽人的威胁……这些线交织在一起，终将爆发。","你拉紧斗篷，继续往前走。雪越下越大，你的脚印很快就被覆盖了。","像是从来没有人来过一样。", "北方公国联盟的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
  options:[
    {t:"继续探索其他势力", effect:{time:1}, go:"faction_overview"},
    {t:"离开", effect:{time:0}, go:"echo_mercury_ally"}
  ]
}

N["faction_elf_council"] = function(){ return {
  place:"精灵王国·长老会",
  text:["银叶城·长老会。","长老会的议事厅在世界树的根部，是一个天然形成的巨大洞穴。洞穴的墙壁上嵌着发光的水晶，把整个空间照得如同白昼。","七位长老围坐在一张由树根编织成的圆桌旁。他们都很老了——最年轻的也有五百岁，最年长的已经超过了一千岁。","你站在旁听席上，观察着这场精灵族的最高权力会议。","「世界树的枯萎在加速。」大长老——一个头发全白、脸上皱纹深得像是树皮的老精灵——说，他的声音像是从很远的地方传来，「第三印的契约正在失效。如果我们不采取行动，五十年内，世界树就会彻底枯萎。」","「那就加固契约。」另一个长老说，他的语气很冲，「用更多的生命力，用更强的魔法。」","「我们已经没有更多的生命力了。」大长老叹了口气，「每一代女王注入的生命力都在减少。艾萨拉陛下已经守了八百年，她的力量……也快到极限了。」","议事厅里陷入了沉默。水晶的光映在长老们的脸上，把那些皱纹照得像是一道道伤疤。","你注意到，有一个长老一直没有发言。他坐在角落里，闭着眼睛，像是在打瞌睡。但你能感觉到，他的意识并不在这里——他在用某种方式，感知着更远的东西。","然后，他睁开了眼睛。他的眼睛是纯银色的，没有瞳孔，像是两汪月光。","「时间不多了。」他说，声音很轻，但每个字都像是一块石头砸在心上，「深渊在逼近。不只是第三印——所有的印，都在变弱。」","「我们需要外援。」他看着大长老，「人类，矮人，兽人……所有的种族。我们不能再独自承担了。」","「和人类合作？」另一个长老冷笑，「人类的寿命只有几十年，他们懂得什么叫永恒？」","争论又开始了。你站在旁听席上，看着这些活了几百年的精灵像孩子一样争吵，心里有一种说不出的感觉。","长生种的傲慢，长生种的疲惫，长生种的恐惧——都在这个洞穴里交织着。","而世界树，就在他们头顶，一片一片地，掉着枯黄的叶子。", "你最后回望一眼长老会，转身穿过街口，往下一程赶路。"],pace:"normal",
  options:[
    {t:"支持长老会", effect:{time:1,精灵_rep:5,flag:"support_elf_council"}, go:"faction_elf_main"},
    {t:"支持女王", effect:{time:1,精灵_rep:10,flag:"support_elf_queen"}, go:"faction_elf_main"},
    {t:"「我只是一个旅行者，不想介入政治。」", check:{a:"CHA",sk:"口才",label:"魅力·周旋",target:55},
      tier:{
        crit:function(){return[pickV(["你巧妙地周旋于两方之间，既没有得罪长老会，也保持了和女王的关系。精灵声望+5。","你的中立态度获得了双方的尊重，他们都认为你是一个可以信任的人。精灵声望+8。"],"elf_neutral_crit")]},
        ok:function(){return[pickV(["你保持了中立，虽然没有获得太多好处，但也没有得罪人。","你礼貌地告辞了。"],"elf_neutral_ok")]},
        fail:function(){return[pickV(["你的中立态度让长老会很不满，他们认为你在敷衍。精灵声望-3。","长老会对你的回答很不满意。"],"elf_neutral_fail")]},
        critfail:function(){return[pickV(["你说错了话，被长老会当成了女王的人。精灵声望-10。","长老会下令把你驱逐出精灵王国。精灵声望-15。"],"elf_neutral_critfail")]}
      },
      effect:{time:1}, go:"faction_elf_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_elf_main"]={tags:["faction:war"],pace:"deep",
  place:"精灵王国",
  text:["世界树下。","你独自走到了世界树的根部。这里很安静，没有其他精灵，只有风和树叶的沙沙声。","你蹲下来，触摸着世界树的树皮。冰凉，光滑，像是在触摸一块古老的玉石。","然后你感觉到了——一股强大而温和的力量，从树干里流淌出来，像是母亲的手在抚过你的脸。","但在这股力量的深处，你感觉到了一丝疼痛。","不是你的疼痛。是世界树的疼痛。","它在枯萎。从根部开始，一点一点地，被什么东西侵蚀着。那东西很暗，很冷，充满了恶意——是深渊的气息。","第三印就在世界树的根部。它镇压着深渊之主的『贪婪』之面。而现在，契约在失效，封印在变弱，贪婪之面正在一点一点地挣脱。","你想起了精灵女王艾萨拉说的话：「如果我打碎这道印，是不是就能自由了？」","八百年。她在世界树下守了八百年。看着朋友们一个个死去，看着孩子们一个个老去，而她只能坐在这里，守着这棵树，守着这道印。","你突然理解了她的疲惫。","不是身体上的疲惫。是灵魂上的。","风又吹过来了，世界树的叶子发出叮叮当当的声响。你听着那声音，突然觉得它不像是铃铛，更像是……叹息。","一片叶子落下来，飘在你的膝盖上。你拈起来，发现叶子的边缘已经枯黄了。","你把它放进口袋里。","身后传来脚步声。你回头，看到艾萨拉站在不远处。她的银白色长发在风中飘动，脸上没有表情，但她的眼睛里，有一种你看不懂的情绪。","「你感觉到了。」她说，不是问句。","你点了点头。","她走到你身边，也蹲下来，把手放在世界树的树皮上。过了很久，她才开口：「我已经在考虑了。」","「考虑什么？」","「考虑打碎这道印。」","她的声音很轻，轻得像是风一吹就散了。但你知道，这句话的重量，比整座世界树还重。"],pace:"normal",
  options:[
    {t:"帮助女王寻找修复第三印的方法", effect:{time:1,精灵_rep:10,flag:"help_elf_queen"}, go:"seal_3_outcome"},
    {t:"帮助长老会维护传统", effect:{time:1,精灵_rep:5,flag:"help_elf_council"}, go:"faction_elf_ending"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
}

N["faction_elf_ending"]={tags:["faction:war"],tag:"ending",
  place:"精灵王国",
  text:["你离开了银叶城。","走出城门的时候，你回头看了一眼。世界树依然高大，依然美丽，但你知道，在那银白色的树皮下面，有什么东西正在慢慢腐烂。","精灵王国的故事，是一个关于守护与自由的故事。","守护了一万年的世界树，守护了八百年的女王，守护了一千年的契约。但守护的代价是什么？是自由，是青春，是看着所爱之人一个个离去的痛苦。","艾萨拉的那句话还在你耳边回响：「考虑打碎这道印。」","如果她真的那么做了，第三印会碎，贪婪之面会苏醒，世界树会枯萎，精灵王国会灭亡。","但她会自由。","你拉紧了斗篷，走进了森林里。阳光透过树叶洒下来，在地面上投下斑驳的光影。","你不知道艾萨拉会做出什么选择。你也不知道，自己能不能改变什么。","但你知道，精灵王国的命运，已经和整个大陆的命运交织在了一起。第三印的存亡，关系到七印的存亡，关系到深渊是否会降临。","风吹过森林，树叶沙沙作响。你听着那声音，像是无数精灵在低语，又像是世界树在叹息。","你继续往前走。身后，银叶城的轮廓渐渐消失在了树林里。","口袋里，那片枯黄的叶子还在。你摸了摸它，然后加快了脚步。","你还有很多事要做。很多印要调查，很多真相要揭开。","而时间，已经不多了。"],pace:"normal",
  options:[
    {t:"继续探索其他势力", effect:{time:1}, go:"faction_overview"},
    {t:"离开", effect:{time:0}, go:"echo_mercury_disappointed"}
  ]
}

N["faction_dwarf_king"] = function(){ return {
  place:"矮人王国·王宫",
  text:["铁峰堡·王座厅。","王座厅是一个巨大的天然洞穴，穹顶高得看不见顶。洞穴的正中央，有一座由纯铁铸成的王座，王座上坐着矮人王索林。","索林是一个看起来五十多岁的矮人——但你知道，他已经活了三百多岁。他的胡子是火红色的，编成了无数条小辫子，每条辫子上都挂着一个金属戒指。他的脸上有一道从额头延伸到下巴的伤疤，那是年轻时和兽人战斗留下的。","他穿着一件黑色的铁甲，铁甲上刻着矮人的符文，在发光矿石的照耀下泛着冷光。他的手里握着一把战锤——那是矮人族的传国之宝，『碎山者』。","「人类。」索林的声音像是两块巨石在撞击，在洞穴里回荡，「你来铁峰堡，有何贵干？」","他的眼睛是深褐色的，像熔化的铁水。你能感觉到，他在审视你——不是用眼睛，而是用某种更深层的东西。","你说明了来意。索林沉默了一会儿，然后用战锤的柄敲了敲地面。","「第四印的事，我知道。」他说，声音低了下来，「永恒熔炉的心脏，就是第四印。我们矮人世世代代守着它，已经守了三千年。」","「但最近，熔炉下面的东西……越来越不安分了。」","他站起来，走到洞穴的边缘。那里有一个裂缝，从裂缝里能看到下面的蓝色火焰——永恒熔炉的火焰。","「三千年了。」他说，背对着你，「我们用锤击声掩盖下面的声音，用熔炉的火焰压制下面的寒冷。但最近，锤击声盖不住了。」","「我能听到它。每天晚上，我都能听到——心跳声，还有低语声。」","他转过身，看着你。他的眼睛里，有一种原始的恐惧——不是对死亡的恐惧，而是对某种无法理解的、巨大的存在的恐惧。","「你知道矮人族为什么这么喜欢锻造吗？」他问，嘴角扯出一个比哭还难看的笑容，「不是因为我们天生就会打铁。是因为只有锻造的声音，才能掩盖下面传来的声音。」","洞穴里很安静。你能听到永恒熔炉的咆哮声，还有从裂缝深处传来的、微弱的——心跳声。","一下。又一下。", "王宫的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
  options:[
    {t:"「我愿意帮忙。」", effect:{time:1,矮人_rep:10,flag:"help_dwarf"}, go:"seal_4_forge"},
    {t:"「永恒熔炉的问题，和第四印有关吗？」", check:{a:"INT",sk:"知识",label:"智力·试探",target:65},
      tier:{
        crit:function(){return[pickV(["索林的表情变了。「你知道第四印？」他轻声说，「看来你不是普通的旅行者。」「永恒熔炉就是第四印的载体。熔炉变弱，就是第四印在变弱。」线索+3。","索林告诉你一个秘密：第四印的污染，来自地心的黑暗。「我们矮人世世代代都在压制它，但最近，它越来越强了。」线索+3。"],"dwarf_king_truth_crit")]},
        ok:function(){return[pickV(["索林告诉了你一些永恒熔炉的情况，但关键部分他没有说。线索+1。","索林对第四印的事讳莫如深，你只了解了一些皮毛。"],"dwarf_king_truth_ok")]},
        fail:function(){return[pickV(["索林不愿意谈论第四印，他转移了话题。","索林只是说：「那是矮人的事。」"],"dwarf_king_truth_fail")]},
        critfail:function(){return[pickV(["你的问题让索林警惕起来，他以为你是来打探矮人秘密的。矮人声望-10。","索林叫人把你赶了出去。矮人声望-5。"],"dwarf_king_truth_critfail")]}
      },
      effect:{time:1}, go:"faction_dwarf_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_dwarf_main"]={tags:["faction:war"],pace:"deep",
  place:"矮人王国",
  text:["永恒熔炉·边缘。","索林带你来到了永恒熔炉的边缘。","那是一个巨大的圆形熔炉，直径有十丈，熔炉的墙壁是用黑色的火山岩砌成的，已经被烧得发红。熔炉里的火焰不是普通的橙红色，而是一种诡异的蓝白色，温度高得离谱——你站在十丈之外，依然能感觉到皮肤被灼烧的疼痛。","熔炉的中心，一个巨大的符文阵在徐徐旋转。那就是第四印。","但你注意到，符文阵的一部分——大约四分之一的区域——已经变成了黑色。那些黑色的符文不再发光，像是死了一样。而且黑色的区域还在缓慢地扩大。","「看到了吗？」索林说，他的声音在熔炉的咆哮声中几乎听不清，「污染在扩散。从下面，一点一点地往上爬。」","他指着熔炉中心那些黑色的符文：「那些黑色的东西，是深渊之力。它在侵蚀第四印的符文。按照这个速度，五十年内，第四印就会彻底失效。」","「第四印一碎，下面的东西就会出来。」","你看着熔炉里的蓝白色火焰，心里有一种说不出的恐惧。你能感觉到——在火焰的下面，在符文阵的下面，在整座铁峰堡的下面，有什么东西在呼吸。","一下。又一下。","「我们试过很多方法。」索林说，他的声音里带着疲惫，「用更强的火焰烧，用更多的符文加固，甚至用矮人战士的生命力去灌注。但都没用。」","「那东西……不是普通的力量能对抗的。」","他转过身，看着你。他的眼睛里，有恐惧，有不甘，还有一丝……期待。","「黄林晶留下的手札里，提到过一种方法。」他说，「集齐十二件神器，就能重新加固七印。但那只是传说。」","「你相信传说吗？」他问。","熔炉的火焰噼啪作响，蓝白色的光映在他的脸上，把那些皱纹照得像是一道道伤疤。","你没有回答。因为你也不知道答案。","但你知道，如果你不做些什么，五十年后——或者更早——铁峰堡下面的东西，就会出来。","到那时候，锤击声再也盖不住了。"],pace:"normal",
  options:[
    {t:"帮助矮人净化第四印", effect:{time:1,矮人_rep:10,flag:"purify_seal4"}, go:"seal_4_outcome"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
}

N["faction_orc_chief"] = function(){ return {
  place:"兽人王庭",
  text:["兽人部落·大帐。","大帐里挂满了骨头和羽毛，空气中弥漫着草药和熏香的味道，浓烈得几乎让人睁不开眼。","大萨满坐在火塘的对面。他很老了——老得你看不出他的年龄。他的皮肤是深绿色的，皱得像是干枯的树皮，脸上涂着白色的纹路，那些纹路在火光下像是活过来一样。","他的眼睛是浑浊的灰色，像是蒙了一层雾。但你能感觉到，那双眼睛正在仔细地打量你。","「外来者。」大萨满开口了，声音沙哑得像是砂纸在磨骨头，「你能感觉到，对吗？第二印……在哭泣。」","他的手从袍子里伸出来。那是一双苍老的手，骨节粗大，指甲缝里嵌着洗不掉的草药渍。他的手腕上戴着一串骨珠，每一颗骨珠上都刻着一个名字。","「我们兽人，守了第二印一千年。」他说，用手指摩挲着那些骨珠，一颗一颗地数过去，「每一代萨满，都要把生命力注入第二印。所以我们的寿命都很短。最多活到四十岁。」","「我的师父，三十八岁就死了。他死的时候，头发全白了，像个百岁老人。」","「他的师父，三十五岁。」","他停了下来，指腹停在一颗最新的骨珠上。那颗骨珠上的刻痕还很新，像是刚刻上去不久。","「这是我师兄的。去年死的。三十一岁。」","大帐里很安静。火塘里的火噼啪作响，骨珠在他的手指下发出细微的声响。","「但最近，第二印开始松动了。」他抬起头，浑浊的眼睛里闪过一丝痛苦，「不是因为我们失职。是因为……有人在从内部破坏它。」","「我怀疑，我们部落里有内奸。」","他看着你，眼中有一种超越年龄的沧桑和疲惫：「一个能接近第二印核心的人。一个我信任的人。」","火塘里的火跳了一下，大帐里的影子晃了晃。你注意到，大萨满的手一直在发抖——不只是因为愤怒，还有恐惧。","「你愿意帮我找出内奸吗？」他问，声音很轻，轻得几乎被火塘的噼啪声盖住。", "别过兽人王庭，你沿官道走出里许，回头已看不清来处。"],pace:"normal",
  options:[
    {t:"「是谁骗了你们？」", check:{a:"CHA",sk:"口才",label:"魅力·追问",target:60},
      tier:{
        crit:function(){return[pickV(["格罗玛什告诉你：「是一个穿黑袍的人。他说他代表深渊的意志，但后来我们才知道，他是暗蚀会的人。」「他们利用了我们。」线索+3，暗蚀会线索+2。","格罗玛什告诉你一个秘密：那个穿黑袍的人，现在还在兽人草原活动。他在试图拉拢一些年轻的兽人。线索+3。"],"orc_chief_truth_crit")]},
        ok:function(){return[pickV(["格罗玛什告诉了你一些情况，但关键信息他没有说。线索+1。","格罗玛什对暗蚀会的事讳莫如深。"],"orc_chief_truth_ok")]},
        fail:function(){return[pickV(["格罗玛什不愿意谈论那个人，他转移了话题。","格罗玛什只是说：「那是过去的事了。」"],"orc_chief_truth_fail")]},
        critfail:function(){return[pickV(["你的追问激怒了格罗玛什，他叫人把你赶了出去。兽人声望-10。","你问得太直接了，格罗玛什以为你是来挑事的。兽人声望-5。"],"orc_chief_truth_critfail")]}
      },
      effect:{time:1}, go:"faction_orc_main"},
    {t:"「我愿意帮你们对付暗蚀会。」", effect:{time:1,兽人_rep:15,flag:"help_orc"}, go:"faction_orc_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_orc_main"]={tags:["faction:war","main:orc"],pace:"deep",
  place:"兽人草原",
  text:["兽人草原·第二印所在地。","大萨满带你来到了营地最深处的一个洞穴。","洞穴的入口被兽皮帘子遮着，帘子上画着兽人的图腾——一只巨大的眼睛，瞳孔是螺旋状的。","你掀开帘子，走了进去。洞穴里很暗，只有墙壁上的几盏油灯发出微弱的光。空气里有一股潮湿的、属于地下的味道。","洞穴的正中央，有一个巨大的石头祭坛。祭坛上刻满了符文，那些符文在微弱的灯光下泛着暗红色的光。","第二印就在祭坛的下面。","你能感觉到——一股强大而古老的力量，从祭坛下面散发出来。那是第二印的力量，稳定、厚重，像是一座大山。","但在这股力量的缝隙里，你感觉到了另一种东西。","冰冷、黑暗、充满恶意。","那是被第二印镇压的东西。","「第二印下面，镇压着深渊之主的『愤怒』之面。」大萨满说，他的声音在洞穴里回荡，「那是深渊之主最暴烈的一面——它会摧毁一切，包括它自己。」","「黄林晶把它封印在这里，交给我们兽人守护。因为只有兽人的生命力，才能压制住愤怒之面的暴烈。」","他走到祭坛前，把手放在祭坛上。祭坛上的符文亮了一下，然后又暗了下去。","「但最近，愤怒之面越来越活跃了。」他说，「它在冲击封印。每天晚上，我都能听到它的咆哮——不是用耳朵听，是用灵魂听。」","「我的师兄，就是被它的咆哮逼疯的。他……他试图打碎第二印，说要『释放愤怒之面，让它净化这个腐朽的世界』。」","「我不得不杀了他。」","大萨满的声音颤抖了。他低下头，浑浊的眼睛里有泪光在闪。","「但我杀了他之后，才发现——他不是被愤怒之面逼疯的。是有人在他的茶里下了药。一种能让人接触深渊意识的药。」","「那个人，就是内奸。」","洞穴里很安静。你能听到自己的心跳声，还有从祭坛深处传来的、微弱的——咆哮声。","很微弱。但你能感觉到，那咆哮里充满了愤怒和毁灭的欲望。","大萨满抬起头，看着你：「帮我找出内奸。在他做出更可怕的事情之前。」","祭坛上的符文又闪了一下。这一次，你清楚地看到——有几个符文已经变成了黑色。"],pace:"normal",
  options:[
    {t:"帮助兽人对抗暗蚀会", effect:{time:1,兽人_rep:10,flag:"fight_eclipse_orc"}, go:"faction_orc_ending"},
    {t:"帮助兽人修复第二印", effect:{time:1,兽人_rep:10,flag:"repair_seal2"}, go:"seal_2_outcome"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
}

N["faction_orc_ending"]={tags:["faction:war","main:orc"],tag:"ending",
  place:"兽人草原",
  text:["你离开了兽人部落。","走出营地的时候，你回头看了一眼。大萨满的帐篷还在那里，门上的头骨在风里触碰撞，发出咔哒咔哒的声响。","兽人草原的故事，是一个关于牺牲与背叛的故事。","一千年的守护，一千年的牺牲。每一代萨满都活不过四十岁，用自己的生命力喂养一道封印。而他们守护的，不只是世界——还有一个秘密，一个关于黄林晶、关于七印、关于深渊的秘密。","但背叛就在身边。大萨满信任的人，可能就是毁掉一切的人。","你想起了大萨满师兄的那颗骨珠——三十一岁，死在自己师弟的手里。而他的死，不过是这场阴谋的开始。","风吹过草原，草浪起伏，发出沙沙的声响，像是无数人在低语。","你拉紧了斗篷，继续往前走。","你不知道内奸是谁。你也不知道，自己能不能在一切都太晚之前找到真相。","但你知道，第二印的松动，不只是兽人的危机——它是整个大陆的危机。如果第二印碎了，愤怒之面苏醒，那么草原会变成焦土，兽人会灭族，而深渊的气息会从这里蔓延到整个大陆。","远处，天空的颜色变了。不是夕阳的金红色，而是一种诡异的暗紫色——像是有什么东西，在天空的后面燃烧。","你知道那是什么。那是深渊的气息，从第二印的裂缝里渗出来，污染了天空。","你加快了脚步。","时间，已经不多了。", "你最后回望一眼兽人草原，转身穿过街口，往下一程赶路。"],pace:"normal",
  options:[
    {t:"继续探索其他势力", effect:{time:1}, go:"faction_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
}

N["faction_church_intro"] = function(){ return {tag:"branch",
  place:"光明教会·圣城",
  text:["光明教会。","圣城——大陆上最神圣的城市，光明神的人间居所。","你站在圣城的城门外，仰头看着这座白色的城市。整座城市都是用白色的大理石建成的，在阳光下泛着耀眼的光芒，像是一座用冰雪雕成的宫殿。","城门是拱形的，门上刻着光明神的徽记——一轮金色的太阳，太阳的中心是一只眼睛。城门两旁各有一名审判骑士，穿着银白色的全身甲，手里握着长剑，面容隐藏在面甲后面。","你走进城门，一股肃穆的气息扑面而来。街道很宽，很干净，两旁的建筑都是白色的，窗户上镶嵌着彩色玻璃，阳光透过玻璃洒下来，在地面上投下斑斓的光影。","空气里有熏香的味道——那是教会专用的熏香，据说能净化灵魂。街道上的行人都穿着朴素的衣服，走路时低着头，嘴里念念有词——他们在祈祷。","圣城的中心是光明大教堂。那是一座巨大的建筑，穹顶高得像是要触到天空，穹顶上画着一幅巨大的壁画——光明神降临人间，用光芒驱散黑暗。","你能感觉到，整座城市都笼罩在一种神圣的氛围里。但在这神圣之下，你隐约感觉到了另一种东西——压抑，紧张，还有……恐惧。","净化令已经颁布了三个月。在这三个月里，教会的审判骑士走遍了大陆，清查所谓的『异端』。灵魂法师首当其冲，然后是炼金术师、无神论者、甚至只是对教会表示过怀疑的人。","圣城的表面很平静。但你知道，在这座白色的城市下面，在那些华丽的教堂和修道院下面，有地牢，有刑讯室，有无数『异端』的惨叫。","你走在街道上，注意到几个穿黑袍的人。他们不是牧师——牧师穿白袍。他们是审判庭的人，专门负责追查异端。","其中一个转过头，看了你一眼。那道视线很冷，像是在看一个潜在的罪犯。","然后他转回头，继续往前走。","你移开视线，假装在看路边的雕像。但你心里记下了——在圣城，每一双眼睛都可能是审判庭的眼睛。","在这里，沉默是 safest 的选择。","但你不是来沉默的。你是来寻找真相的——关于净化令的真相，关于教会的真相，关于光明神的真相。","你吸了口气，空气中的熏香味更浓了。你朝大教堂的方向走去。","红衣主教本尼迪克特，就在那里。"],pace:"deep",
  options:[
    {t:"去圣殿参拜", effect:{time:1}, go:"faction_church_temple"},
    {t:"调查净化令的真相", check:{a:"INT",sk:"调查",label:"智力·调查",target:60},
      tier:{
        crit:function(){return[pickV(["你深入调查了净化令，发现了一个惊人的秘密：净化令的真正目的不是清除异端，而是为了收集灵魂法师的灵魂，用来做某种禁忌仪式。线索+3，SAN-5。","你发现净化令是由一个红衣主教推动的，而他和暗蚀会有秘密联系。线索+3，暗蚀会线索+1。"],"church_purge_crit")]},
        ok:function(){return[pickV(["你了解了净化令的一些情况，但核心秘密你没有查到。线索+1。","你收集了一些关于教会的信息。知识+1。"],"church_purge_ok")]},
        fail:function(){return[pickV(["教会的保密工作做得很好，你什么都没查到。","你调查了半天，没有发现什么。"],"church_purge_fail")]},
        critfail:function(){return[pickV(["你的调查被审判骑士团发现了，他们把你当成了异端。你不得不赶紧逃跑。教会声望-15，HP-5。","你被审判骑士团抓了起来，虽然你设法逃脱，但受了伤。HP-15，SAN-5。"],"church_purge_critfail")]}
      },
      effect:{time:2}, go:"faction_church_main"},
    {t:"拜访红衣主教本尼迪克特", effect:{time:1}, go:"faction_church_cardinal"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_church_temple"] = function(){ return {tag:"branch",
  place:"光明神殿",
  text:["光明大教堂·内部。","你走进大教堂，立刻被眼前的景象震住了。","大教堂的内部比外面看起来更加宏伟。穹顶高得像是天空，上面的壁画在烛火的照耀下泛着金色的光芒——光明神降临人间，用光芒驱散黑暗。壁画上的光明神是一个穿着金色长袍的人形，面容慈悲，双手张开，光芒从他的指尖流淌出来，照亮了整个世界。","大厅的两侧排列着一排排石柱，每根柱子上都雕刻着圣经故事——创世、洪水、救赎、审判。柱子之间是彩色玻璃窗，阳光透过玻璃洒下来，在地面上投下斑斓的光影，像是神的祝福。","大厅的正前方是祭坛。祭坛是用纯金铸成的，上面放着光明神的圣物——圣杯。据说，圣杯里装着光明神的血液，能治愈一切疾病，能净化一切邪恶。","祭坛前有几百个信徒，他们跪在地上，低着头，嘴里念念有词。他们的声音汇合在一起，形成一种低沉的、持续的嗡鸣，像是整个大教堂都在祈祷。","你站在大厅的后方，看着这一切。空气中的熏香味浓得几乎让人窒息，烛火的光芒在墙壁上投下摇曳的影子。","然后你注意到了——在祭坛的旁边，有一个侧门。侧门是关着的，门上刻着审判庭的徽记——一把剑，剑刃上滴着血。","那扇门后面，是审判庭的地牢。","你正在观察侧门，一个声音从身后传来。","「愿光明神的光芒照耀你。」","你转过身。一个年轻的神父站在你身后，穿着白色的长袍，手里拿着一本圣经。他的脸很干净，眼睛很亮，带着一种虔诚的、近乎狂热的光芒。","「你是来祈祷的吗？」他问，微笑着，「还是来忏悔的？」","他的笑容很温暖。但你注意到，他的眼睛一直在观察你——不是用虔诚的视线，而是用审视的视线。","在圣城，每一个微笑背后，都可能藏着审判庭的眼睛。", "光明神殿的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
  options:[
    {t:"祈祷", effect:{time:1,sanRecovery:3,教会_rep:5}, go:"faction_church_main"},
    {t:"忏悔", check:{a:"CHA",sk:"口才",label:"魅力·忏悔",target:50},
      tier:{
        crit:function(){return[pickV(["你向祭司忏悔了你的「罪行」，他被你的「真诚」打动了，告诉你一些教会的内部消息。线索+2。","你的忏悔让祭司认为你是一个虔诚的信徒，他给了你一个祝福。教会声望+10，SAN+3。"],"church_confess_crit")]},
        ok:function(){return[pickV(["祭司听了你的忏悔，给了你一些忠告。教会声望+3。","你完成了忏悔，感觉心里轻松了一些。SAN+1。"],"church_confess_ok")]},
        fail:function(){return[pickV(["祭司觉得你的忏悔不够真诚，只是敷衍了你几句。","祭司对你的忏悔不感兴趣。"],"church_confess_fail")]},
        critfail:function(){return[pickV(["你在忏悔时说错了话，祭司认为你是异端，叫来了审判骑士。你不得不赶紧逃跑。教会声望-10。","你的忏悔引起了祭司的怀疑，他开始调查你。声望-3。"],"church_confess_critfail")]}
      },
      effect:{time:1}, go:"faction_church_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_church_cardinal"] = function(){ return {tag:"branch",
  place:"红衣主教府",
  text:["光明大教堂·红衣主教厅。","年轻的神父带你穿过了几条走廊，来到了一扇厚重的木门前。他敲了敲门，然后退到了一旁。","门从里面打开了。你走进去，发现这是一间不大的书房。四壁都是书架，书架上摆满了圣经、神学著作和教会的历史文献。房间的中央有一张书桌，桌上摊着一本打开的书，旁边放着一个银质的烛台。","书桌后面坐着一个老人。","他就是红衣主教本尼迪克特——光明教会的实际掌权者，教皇之下的第一人。","他很老了——老得你看不出他的年龄。他的头发全白了，脸上的皱纹深得像是刀刻的。他穿着一件红色的长袍，袍子上绣着金色的太阳纹章。他的手里握着一串念珠，念珠的珠子是用某种红色的石头做成的，在烛光下泛着血一样的光。","「坐吧。」他说，声音很温和，像是一个慈祥的祖父。但你能感觉到，在这温和的声音下面，有一种钢铁般的意志。","你在他对面的椅子上坐下。他打量了你很久，然后开口了。","「你在调查净化令。」他说，不是问句。","你的心跳加速了。但你没有否认。","「很多人都在调查。」他继续说，用手指摩挲着念珠，「有人说净化令是错的，说教会在迫害无辜。有人说，灵魂法师不是异端，说我们在滥用权力。」","他放下念珠，看着你。他的眼睛是浅蓝色的，像天空一样。但那双眼睛里，没有天空的温柔——只有冰冷的、不容置疑的坚定。","「但他们不知道真相。」他说，声音低了下来，「他们不知道，深渊正在逼近。他们不知道，七印正在破碎。他们不知道，如果我们不采取行动，整个大陆都会被黑暗吞噬。」","「净化令，不是迫害。是预防。」","「灵魂法师的力量，来自于与死者的沟通。而死者的世界，和深渊只有一线之隔。每一个灵魂法师，都可能成为深渊进入这个世界的通道。」","「我们不是在迫害灵魂法师。我们是在……保护他们。也在保护整个世界。」","他的声音很平静，很诚恳。但你总觉得，他没有说出全部的真相。","你注意到，他的书桌下面，露出了一角文件。文件上盖着审判庭的印章——一把剑，剑刃上滴着血。","文件上的字你看不清，但你能看到几个关键词：『守望者』、『墨丘利』、『清除』。","你的心跳更快了。","本尼迪克特似乎注意到了你的视线。他不动声色地把文件推到了书桌下面，然后微笑着看着你。","「你还有什么问题吗？」他问，笑容温和得像是一个慈祥的祖父。","但你知道，那双浅蓝色的眼睛，已经把你从头到脚审视了一遍。","在圣城，在红衣主教面前，每一个问题都可能是陷阱。"],pace:"deep",
  options:[
    {t:"「我理解。我愿意为教会效力。」", effect:{time:1,教会_rep:15,flag:"ally_church",karma:-10}, go:"faction_church_main"},
    {t:"「这是不对的。你们在滥杀无辜。」", check:{a:"CHA",sk:"口才",label:"魅力·辩论",target:65},
      tier:{
        crit:function(){return[pickV(["你和本尼迪克特进行了一场激烈的辩论，虽然没有说服他，但他对你刮目相看。「你是一个有原则的人。」他说，「可惜，原则不能拯救世界。」教会声望+5，业力+10。","你的辩论让本尼迪克特动摇了，他承诺会重新考虑净化令的执行方式。教会声望+10，业力+15。"],"church_debate_crit")]},
        ok:function(){return[pickV(["你表达了你的观点，本尼迪克特虽然不赞同，但也没有生气。业力+5。","你和本尼迪克特讨论了很久，虽然谁也没有说服谁。"],"church_debate_ok")]},
        fail:function(){return[pickV(["本尼迪克特没有理会你的指责，他只是说：「你还太年轻。」","你的辩论没有任何效果。"],"church_debate_fail")]},
        critfail:function(){return[pickV(["你的话激怒了本尼迪克特，他认为你是异端的同情者。教会声望-15。","本尼迪克特叫来了审判骑士，你不得不赶紧逃跑。HP-5，教会声望-10。"],"church_debate_critfail")]}
      },
      effect:{time:1}, go:"faction_church_main"},
    {t:"「净化令背后，是不是有更深的阴谋？」", check:{a:"INT",sk:"调查",label:"智力·试探",target:70},
      tier:{
        crit:function(){return[pickV(["本尼迪克特的表情变了。「你知道得太多了。」他轻声说，「净化令……只是一个开始。我们真正的目的，是用收集到的灵魂，打开通往深渊的大门，然后……彻底消灭深渊。」「但这个计划，需要牺牲很多人。」线索+3，SAN-10。","本尼迪克特告诉你一个惊天秘密：教会的高层已经被暗蚀会渗透了。净化令是暗蚀会的阴谋，他们想用收集到的灵魂来召唤邪神。线索+3，暗蚀会线索+2。"],"church_conspiracy_crit")]},
        ok:function(){return[pickV(["本尼迪克特告诉了你一些净化令的背景，但核心秘密他没有说。线索+1。","本尼迪克特对净化令的深层目的讳莫如深。"],"church_conspiracy_ok")]},
        fail:function(){return[pickV(["本尼迪克特不愿意谈论这个话题，他转移了话题。","本尼迪克特只是说：「不要问不该问的问题。」"],"church_conspiracy_fail")]},
        critfail:function(){return[pickV(["你的问题让本尼迪克特起了杀心，他叫审判骑士来抓你。你好不容易才逃脱。HP-15，教会声望-20。","你被本尼迪克特下了诅咒，身体开始虚弱。HP-10，SAN-10。"],"church_conspiracy_critfail")]}
      },
      effect:{time:1}, go:"faction_church_main"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
};}

N["faction_church_main"]={tags:["faction:war"],pace:"deep",tag:"branch",
  place:"光明教会",
  text:["圣城·深夜。","你离开了红衣主教厅，走在圣城的街道上。","夜已经深了。街道上没有行人，只有巡逻的审判骑士。他们的银白色铠甲在月光下泛着冷光，铁靴踩在石板路上，发出整齐的声响。","你躲在一条小巷里，看着骑士们走过。他们的脸上没有表情，眼睛直视前方，像是一架架精密的机器。","本尼迪克特的话还在你耳边回响：「净化令，不是迫害。是预防。」","但你看到了那份文件——『守望者』、『墨丘利』、『清除』。","教会不只是在清查灵魂法师。他们在针对守望者。他们在针对墨丘利。","为什么？守望者是守护七印的组织，墨丘利是前守望者执灯人。教会为什么要清除他们？","你想起了墨丘利说过的话：「教会的净化令，不只是针对灵魂法师。它针对的是所有知道真相的人。」","真相。什么真相？","你正在思考，突然听到了脚步声。不是巡逻骑士的整齐步伐——而是很轻的、刻意压低的脚步声。","你屏住呼吸，贴在墙上。一个黑影从巷子的另一头走过。他穿着黑袍，不是审判骑士——审判骑士穿银甲。他是审判庭的密探。","黑影走到巷子尽头，敲了敲一扇门。门开了，他走了进去。","你认出了那扇门——那是审判庭地牢的侧门。","你犹豫了一下，然后跟了上去。","地牢里很暗，很潮湿。空气里有一股血腥味和霉味。你沿着走廊往前走，两边是一间间牢房，牢房里关着人——他们大多很虚弱，有的在呻吟，有的在祈祷，有的已经没有了声音。","然后你听到了一个声音。","「墨丘利·星辰之眼。你被指控为异端，与深渊勾结，背叛光明神。你认罪吗？」","你猛地停住了脚步。","墨丘利？他被抓了？","你贴着墙壁，朝声音传来的方向移动。走廊的尽头有一间审讯室，门虚掩着，里面透出烛光。","你从门缝里看进去。","审讯室的中央，一个人被绑在刑架上。他的头发散乱，脸上有伤痕，衣服被血浸透了。但你还是认出了他——墨丘利。","他的对面，坐着一个穿黑袍的审判官。审判官的手里拿着一根烧红的铁条，铁条在烛光下泛着暗红色的光。","「认罪吗？」审判官又问了一遍。","墨丘利抬起头，看着审判官。他的嘴角有血，但他的眼睛很亮，带着一丝嘲讽。","「你们教会，」他说，声音沙哑但清晰，「才是真正的异端。」","审判官的脸扭曲了。他举起了烧红的铁条——","你后退了一步，心跳如雷。","你必须做个决定。"],pace:"deep",
  options:[
    {t:"支持教会，为了大局牺牲少数", effect:{time:1,教会_rep:10,flag:"support_church",karma:-10}, go:"faction_church_ending"},
    {t:"反对净化令，保护无辜者", effect:{time:1,教会_rep:-10,karma:15,flag:"oppose_purge"}, go:"faction_church_ending"},
    {t:"暗中调查教会的阴谋", effect:{time:1,flag:"investigate_church"}, go:"faction_church_ending"},
    {t:"离开", effect:{time:0}, go:"faction_overview"}
  ]
}

N["faction_church_ending"]={tags:["faction:war"],pace:"deep",tag:"branch",
  place:"光明教会",
  text:["你离开了圣城。","走出城门的时候，天已经亮了。白色的城市在朝阳下泛着耀眼的光芒，像是一座用冰雪雕成的宫殿。","但你知道，在这白色的、神圣的表面下面，是地牢，是刑讯室，是无数『异端』的惨叫。","墨丘利还在审判庭的地牢里。你没有救他——至少，现在还没有。你知道，以你现在的力量，硬闯审判庭等于自杀。","但你记住了。你记住了他被绑在刑架上的样子，记住了他说的话：「你们教会，才是真正的异端。」","光明教会的故事，比你想象的更黑暗。","净化令不是简单的宗教迫害。它是一场有预谋的清洗——针对灵魂法师，针对守望者，针对所有知道七印真相的人。","红衣主教本尼迪克特说，净化令是『预防』。但预防什么？预防深渊？还是预防真相被揭露？","你想起了地牢里那些『异端』——他们大多是普通人，只是因为会一点灵魂魔法，或者只是因为对教会表示过怀疑，就被关了起来。","而墨丘利，前守望者执灯人，灵魂魔法教授——他被关在最深的牢房里，承受着最残酷的审讯。","为什么教会如此害怕守望者？为什么他们要清除知道真相的人？","你拉紧了斗篷，走进了晨光里。","远处，圣城的大教堂的穹顶在阳光下闪闪发光。那是光明神的人间居所，是整个大陆最神圣的地方。","但你知道，在那金色的穹顶下面，在那些华丽的祭坛和圣杯下面，有什么东西在腐烂。","光明的背面，总是黑暗。","你吸了口气，继续往前走。你有很多事要做——救墨丘利，揭露教会的真相，找到七印的秘密。","而时间，已经不多了。","因为你在地牢里听到的不只是审讯声。还有一种声音——从地牢的最深处传来的，低沉的、有节奏的声音。","像是心跳。","又像是……某种巨大的东西，在呼吸。"],pace:"normal",
  options:[
    {t:"继续探索其他势力", effect:{time:1}, go:"faction_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
}

/* ============================================================
   v16 方向二：七大职业专属剧情线（部分）
   ============================================================ */

N["job_overview"]={pace:"deep",
  place:"职业剧情",
  text:["七大职业。","艾尔达大陆的力量体系，由七条道路组成。每一条道路，都有自己的规则，自己的极限，自己的宿命。","你坐在油灯下，翻看着那本从学院图书馆里借来的《职业通鉴》。书页已经泛黄了，边角被反复摩挲得发毛。","魔法师——掌控元素，探索真理。火、水、风、土、雷、冰，六大元素在指尖流转。但魔法师的路，是用理性和疯狂铺成的——越接近真理，越接近疯狂。","战士——铁血荣耀，守护。剑与盾，血与火，在战场上证明自己的价值。战士的路，是用伤痕和荣耀铺成的——每一道伤疤，都是一枚勋章。","灵魂法师——沟通生死，触碰边界。看到死者，听到亡者，在生与死之间行走。灵魂法师的路，是用孤独和禁忌铺成的——教会视他们为异端，深渊视他们为通道。","牧师——神的仆人，信仰的化身。治愈伤痛，驱散黑暗，用神术守护信徒。牧师的路，是用虔诚和怀疑铺成的——越接近神，越怀疑神。","盗贼——暗影中的行者，规则的破坏者。潜行，开锁，偷窃，在阴影中生存。盗贼的路，是用机智和风险铺成的——每一次成功，都离死亡更近一步。","商人——财富的掌控者，秩序的建造者。买卖，谈判，投资，用金币改变世界。商人的路，是用算计和冒险铺成的——每一笔生意，都是一场赌博。","炼金术师——物质的解构者，真理的追寻者。炼药，锻造，分解，把普通的物质变成奇迹。炼金术师的路，是用实验和爆炸铺成的——每一次成功，都伴随着无数次失败。","七大职业，七条道路，七种宿命。","你合上书，吹灭了油灯。黑暗中，你能听到自己的心跳声。","你选择的道路，已经走了很远。但你知道，这条路还很长——长到你可能看不到尽头。","而在这条路的尽头，等待你的，可能是荣耀，可能是疯狂，可能是死亡，也可能是……超越凡人的力量。","窗外，夜风吹过，带来了远处的钟声。你拉紧被子，闭上了眼睛。","明天，又是新的一天。你的道路，还在继续。"],pace:"normal",
  options:[
    {t:"魔法师剧情", effect:{time:0}, go:"job_mage_intro"},
    {t:"战士剧情", effect:{time:0}, go:"job_warrior_intro"},
    {t:"灵魂法师剧情", effect:{time:0}, go:"job_soulmage_intro"},
    {t:"盗贼剧情", effect:{time:0}, go:"job_rogue_intro"},
    {t:"商人剧情", effect:{time:0}, go:"job_merchant_intro"},
    {t:"炼金术师剧情", effect:{time:0}, go:"job_alchemist_intro"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
}

N["job_mage_intro"] = function(){ return {
  place:"魔法师·入门篇",
  text:["魔法师。","你第一次感受到元素的呼唤，是在一个雷雨夜。","那天晚上，你只有七岁。你站在窗前，看着窗外的闪电划破夜空。雷声轰鸣，像是天神在发怒。","然后，你感觉到了——空气中有什么东西在流动。不是风，不是雨，而是一种更深层的、像是血液一样在流动的东西。","你伸出手，指向窗外。一道闪电从你的指尖射了出去，击中了院子里的老槐树。树被劈成了两半，燃烧起来。","你的父母冲进房间，看到你站在窗前，手指还在冒烟。他们的脸上，有震惊，有恐惧，还有一丝……骄傲。","「你是魔法师。」你的父亲说，他的声音在发抖，「真正的魔法师。」","从那天起，你的人生改变了。你被送进了艾尔达魔法学院，开始系统地学习魔法。","魔法学院的生活很苦。每天天不亮就要起床，背诵元素符文，练习基础咒文，在实验室里做各种危险的实验。你的同学中有天才，有贵族，有背景深厚的人——而你，只是一个普通人。","但你有一样东西是他们没有的——你对元素的感知，比任何人都敏锐。你能听到元素的低语，能看到元素的流动，能感觉到元素的情绪。","教授说，这是『元素共鸣』——万中无一的天赋。","你站在魔法学院的训练场上，看着眼前的元素傀儡。那是期末考试的内容——用魔法击败一个元素傀儡。","你吸了口气，闭上眼睛。你能感觉到——火元素在你右手边跳跃，水元素在你左手边流淌，风元素在你头顶盘旋，土元素在你脚下沉睡。","你睁开眼睛，嘴角扬了扬。","「来吧。」你说。","元素傀儡咆哮着冲了过来。"],pace:"normal",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_mage_awakening"},
    {t:"学习元素操控", check:{a:"INT",sk:"魔法",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["你很快就掌握了元素操控的基本技巧，老师对你刮目相看。魔法技能+2，知识+1。","你不仅学会了基本技巧，还创造了一个新的小法术。老师非常惊讶。魔法技能+3。"],"mage_learn_crit")]},
        ok:function(){return[pickV(["你学会了元素操控的基本技巧。魔法技能+1。","你完成了基本的学习。知识+1。"],"mage_learn_ok")]},
        fail:function(){return[pickV(["元素之力太难掌控了，你花了很多时间才勉强入门。","你学习得很吃力，进展缓慢。"],"mage_learn_fail")]},
        critfail:function(){return[pickV(["你在练习时失控了，元素之力反噬，你受了伤。HP-10，SAN-3。","你引发了一场小爆炸，把实验室炸了个稀巴烂。HP-5，金币-20（赔偿）。"],"mage_learn_critfail")]}
      },
      effect:{time:3}, go:"job_mage_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_mage_awakening"]={pace:"deep",
  place:"魔法师·觉醒回忆",
  text:["元素共鸣·觉醒。","那是你在魔法学院的第三年。","那天，你在禁书区找到了一本古老的手稿——《元素真义》。手稿的作者已经不可考了，但你能感觉到，手稿里蕴含着一种强大的力量。","你把手稿带回宿舍，在油灯下研读。手稿里写的东西，和学院教的完全不同——学院教你『控制』元素，而手稿教你『倾听』元素。","「元素不是工具。」手稿上写着，「元素是生命。它们有自己的意志，自己的情绪，自己的记忆。真正的魔法师，不是控制元素的人，而是能和元素对话的人。」","你按照手稿的方法，闭上眼睛，开始『倾听』。","一开始，什么都没有。只有寂静。","然后，你听到了——一个很细微的声音，像是很远的地方有人在说话。","你集中精神，那个声音越来越清晰。","「……火……燃烧……温暖……毁灭……」","那是火元素的声音。它在说话，在歌唱，在哭泣。","你伸出手，火元素从四面八方涌来，围绕着你旋转。它们不是被你『控制』的——它们是被你『吸引』的。","你的身体开始发光。不是普通的光，而是六种颜色的光——红、蓝、白、黄、紫、绿，分别对应火、水、风、土、雷、冰六大元素。","元素共鸣，觉醒了。","从那天起，你的魔法实力突飞猛进。你能同时操控多种元素，能创造出学院里从未教过的组合法术。教授们对你刮目相看，同学们对你既羡慕又嫉妒。","但你也付出了代价。","元素共鸣让你能听到元素的声音，但那些声音无时无刻不在你脑海里回响。白天还好，到了晚上，当一切都安静下来的时候，元素的低语就会变得格外清晰——像是有无数人在你耳边说话。","你开始失眠。你开始头痛。你开始分不清，哪些声音是元素的，哪些声音是你自己的。","教授警告你：「元素共鸣是双刃剑。它能让你成为最强大的魔法师，也能让你发疯。历史上，有三个元素共鸣者，最后都疯了。」","你站在学院的塔顶上，看着脚下的城市。夜风很冷，但你感觉不到——你的身体里，有六种元素在燃烧。","「我不会疯的。」你对自己说。","但你知道，你只是在骗自己。"],pace:"normal",
  options:[
    {t:"「跟我走吧。」魔法师说", effect:{time:1,flag:"mage_awakened"}, go:"job_mage_growth"},
    {t:"「我不想学魔法。」你说", effect:{time:1,flag:"mage_refused"}, go:"job_mage_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_mage_growth"]={pace:"deep",
  place:"魔法师·成长篇",
  text:["魔法师·成长篇。","毕业后，你离开了学院，开始在大陆上游历。","你见过很多事——北方的雪，南方的海，精灵的森林，矮人的山脉，兽人的草原，教会的圣城。你用魔法帮助过很多人，也用魔法伤害过很多人。","你的实力在增长。从启灵到凝元，从化意到宗师——每一次晋升，都伴随着痛苦和蜕变。元素在你体内流转，改造着你的身体，你的灵魂。","但你也越来越接近那个界限——魔法师的界限。","传说中，魔法师的极限是『半神』。达到半神的魔法师，能操控天地间的所有元素，能呼风唤雨，能移山填海。","但三千年了，艾尔达大陆上只出过八个半神。而其中，没有一个是纯粹的魔法师——他们都是在达到半神之前，就已经接触了某种禁忌的力量。","你站在一座山顶上，看着远处的雷云。雷元素在云里翻滚，发出震耳欲聋的轰鸣。","你伸出手，雷元素从云里涌来，围绕着你旋转。你能感觉到它们的力量——狂暴，强大，不受控制。","「如果我能完全掌控雷元素……」你喃喃道。","然后你想起了教授的警告：「历史上，有三个元素共鸣者，最后都疯了。」","你收回手，雷元素散去了。","你知道，你在害怕。不是害怕力量不够——而是害怕力量太强。害怕有一天，你会被元素吞噬，变成一个没有理智的怪物。","你坐在山顶上，看着太阳落山。天空被染成了金红色，然后是暗紫色，最后是深黑色。","星星出来了。你看着那些星星，想起了学院里学过的一句话：「魔法师的道路，是用理性和疯狂铺成的。越接近真理，越接近疯狂。」","你吸了口气，站了起来。","不管前方是真理还是疯狂，你都要走下去。","因为这是你选择的道路。", "你离了成长篇，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
  options:[
    {t:"元素学派", effect:{time:1,skillUp:"元素魔法",flag:"mage_element"}, go:"job_mage_turn"},
    {t:"灵魂学派", effect:{time:1,skillUp:"灵魂魔法",flag:"mage_soul"}, go:"job_mage_turn"},
    {t:"暗影学派", effect:{time:1,skillUp:"暗影魔法",flag:"mage_shadow"}, go:"job_mage_turn"},
    {t:"暂时不选择，继续学习基础", effect:{time:1}, go:"job_mage_turn"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_mage_turn"] = function(){ return {
  place:"魔法师·转折篇",
  text:["魔法师·转折篇。","那是你在大陆游历的第五年。","你在死亡沙漠的边缘，发现了一座古代遗迹。遗迹的入口被沙子埋了一半，门上刻着古老的符文——不是人类的文字，不是精灵的文字，也不是矮人的文字。","那是黄林晶时代的文字。","你用魔法清除了沙子，推开了石门。门轴发出刺耳的声响，在寂静的沙漠里格外清晰。","遗迹里很暗。你点亮了一个光球，让它悬浮在头顶。光球的光照亮了墙壁——墙壁上画满了壁画，描绘着三千年前的那场战争。","黄林晶，七印，深渊之主。","你沿着走廊往前走，最后来到了一个大厅。大厅的中央，有一个石台，石台上放着一本书。","书的封面是用某种兽皮做的，已经发黑了。你拿起书，翻开第一页。","书页上的文字，和门上的一样——黄林晶时代的文字。但你能看懂——因为你在学院里学过古文。","书的名字叫《元素的真相》。","你开始读。越读，你的手越抖。","书里写的东西，彻底颠覆了你对魔法的认知。","「元素不是自然存在的。」书上写着，「元素是深渊的产物。三千年前，深渊之主入侵这个世界，带来了六种元素——火、水、风、土、雷、冰。黄林晶击败深渊之主后，把六种元素留在了这个世界，作为『封印的钥匙』。」","「所有的魔法师，使用的都是深渊的力量。每一次施法，都是在和深渊建立联系。魔法师越强，和深渊的联系越深。」","「所谓的『元素共鸣者』，不过是和深渊联系最深的人。他们听到的『元素的低语』，其实是深渊的呼唤。」","你合上书，手在发抖。","原来如此。原来你听到的那些声音，不是元素的——是深渊的。","原来你越强，就越接近深渊。","原来教授说的『三个元素共鸣者都疯了』，不是因为他们的精神不够强大——而是因为深渊在呼唤他们，在侵蚀他们，在把他们变成自己的傀儡。","你站在大厅里，光球在头顶闪烁。你能感觉到——那些『元素的低语』又开始了。但这一次，你听清了。","那不是在说话。那是在……笑。","深渊在笑。","你冲出了遗迹，用魔法封住了入口。你跑了很远，直到沙漠的风把你脸上的汗吹干了，你才停下来。","你跪在沙子上，大口喘气。","你的道路，从一开始就是错的。","但你已经走了这么远了。你还能回头吗？","你看着自己的手。六种元素的光芒在指尖闪烁，美丽而危险。","「不。」你说，声音在发抖，但很坚定，「我不会被深渊吞噬。我会找到另一条路。」","你站起来，朝沙漠的边缘走去。","你的身后，遗迹被沙子重新掩埋了。但那本书里的真相，已经刻在了你的脑子里。","从今天起，你不再是一个普通的魔法师了。","你是一个知道真相的魔法师。而知道真相的人，往往比不知道的人，更危险。"],pace:"deep",
  options:[
    {t:"留在学院继续学习", effect:{time:3,skillUp:"魔法",INT:2}, go:"job_mage_legend"},
    {t:"走出学院去历练", check:{a:"CON",sk:"生存",label:"体质·历练",target:55},
      tier:{
        crit:function(){return[pickV(["你在大陆上历练了三年，经历了无数战斗和冒险。你的魔法水平突飞猛进，还找到了一本失传的魔法书。魔法技能+5，获得：失传魔法书。","你在历练中遇到了一位隐世的魔法大师，他指点了你几个月。你的魔法造诣有了质的飞跃。魔法技能+4，INT+3。"],"mage_adventure_crit")]},
        ok:function(){return[pickV(["你在历练中获得了很多实战经验。魔法技能+2，HP+5。","你完成了几次冒险任务，虽然没有什么大的收获，但也成长了不少。魔法技能+1。"],"mage_adventure_ok")]},
        fail:function(){return[pickV(["你在历练中遇到了危险，不得不提前返回。HP-10。","你的历练并不顺利，差点死掉。HP-15。"],"mage_adventure_fail")]},
        critfail:function(){return[pickV(["你在历练中走火入魔了，虽然被救了回来，但魔法能力受损。魔法技能-2，SAN-10。","你被一个强大的敌人打败了，不仅受了重伤，魔法书也被抢走了。HP-20，金币-30。"],"mage_adventure_critfail")]}
      },
      effect:{time:30}, go:"job_mage_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_mage_legend"] = function(){ return {
  place:"魔法师·传奇篇",
  text:["魔法师·传奇篇。","你站在大宗师的境界上，已经三年了。","三年来，你一直在寻找『另一条路』——一条不依赖深渊力量的魔法之路。你读遍了大陆上所有的图书馆，拜访了所有还活着的半神，甚至潜入了守望者的秘密图书馆。","但你没有找到答案。","直到那一天，你在承天山的时光裂隙旁边，遇到了一个人。","他穿着白色的长袍，长发散乱，脸上有一道从额头延伸到下巴的伤疤。他的眼睛是银白色的，像是两汪月光。","「你在找另一条路。」他说，不是问句。","你警惕地看着他：「你是谁？」","「我是玄机子。」他说，「黄林晶的隔代传人。」","你的心跳加速了。玄机子——传说中的半神，承天书院的创始人，黄林晶之后最接近神的人。","「另一条路，确实存在。」玄机子说，他走到时光裂隙旁边，看着那道巨大的裂缝，「黄林晶找到了它。但他没有走——因为那条路，需要付出太大的代价。」","「什么代价？」","「放弃元素。」玄机子转过身，看着你，「放弃所有的元素力量，从零开始，创造一种全新的魔法——不依赖深渊，不依赖神，只依赖自己的灵魂。」","「灵魂魔法？」你问。","「不。」玄机子摇头，「灵魂魔法依然在借用深渊的力量——只是借用的方式不同。我说的是……『真我魔法』。用自己的灵魂作为燃料，用自己的意志作为法则，创造出完全属于自己的力量。」","「这种力量，不受深渊影响，不受神的制约。它是真正的、属于人类的力量。」","你沉默了。放弃元素——意味着你要放弃这么多年来积累的一切。你的实力，你的修为，你的元素共鸣——全部归零。","「但如果你成功了，」玄机子说，他的眼睛里闪过一丝光芒，「你会超越半神。你会成为……神话。」","神话。九大境界的最高层。三千年了，没有人达到过。","你看着时光裂隙。裂缝的另一边，是一片混沌——时间的尽头。","然后你想起了那本《元素的真相》，想起了深渊的笑声，想起了那些疯掉的元素共鸣者。","「我愿意。」你说。","玄机子点了点头。他伸出手，按在你的额头上。","一股强大的力量涌入你的身体。你感觉到——元素在离开你。火、水、风、土、雷、冰，六种元素从你的体内抽离，像是有什么东西在把你的灵魂撕碎。","你惨叫着倒在地上。痛苦，比你经历过的任何一次晋升都要痛苦。","然后，痛苦消失了。","你躺在地上，大口喘气。你能感觉到——元素的声音消失了。深渊的笑声消失了。你的脑海里，第一次这么安静。","但同时，你也感觉到了——一种全新的力量，在你的灵魂深处萌芽。","很微弱。但很纯粹。","那是属于你自己的力量。","你站起来，看着自己的手。没有元素的光芒，但你的指尖，有一层淡淡的、银白色的光。","「这就是开始。」玄机子说，「接下来的路，要你自己走了。」","你看着远方。承天山的山顶，云雾缭绕。时光裂隙在你身后闪烁，像是一只眼睛。","你的道路，从今天起，重新开始了。","而这一次，你不会再被深渊吞噬了。","因为你走的，是自己的路。", "你收拾停当，离开传奇篇，沿着来路踏上行程。"],pace:"deep",
  options:[
    {t:"寻找贤者之石", effect:{time:1,flag:"seek_philosopher_stone"}, go:"relic_overview"},
    {t:"研究传奇法术", check:{a:"INT",sk:"魔法",label:"智力·研究",target:75},
      tier:{
        crit:function(){return[pickV(["你经过数年的研究，终于创造出了属于自己的传奇法术！这是一个能改变战局的强大法术。魔法技能+5，声望+20。","你不仅创造了传奇法术，还发现了魔法的新理论，震惊了整个魔法界。魔法技能+8，声望+30。"],"mage_legend_crit")]},
        ok:function(){return[pickV(["你在传奇法术的研究上取得了一些进展，但还没有完全成功。魔法技能+2。","你完成了初步的研究，但距离成功还有很长的路。"],"mage_legend_ok")]},
        fail:function(){return[pickV(["你的研究遇到了瓶颈，迟迟没有进展。","你尝试了很多次，但都失败了。"],"mage_legend_fail")]},
        critfail:function(){return[pickV(["你的研究出了差错，引发了一场大爆炸。HP-20，SAN-10。","你走火入魔了，差点死掉。HP-25，魔法技能-3。"],"mage_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_warrior_intro"] = function(){ return {
  place:"战士·入门篇",
  text:["战士。","你第一次拿起武器，是在父亲的葬礼上。","你的父亲是一个佣兵。他死在了北方的战场上，被兽人战斧劈中了胸口。他的尸体被运回来的时候，已经冻硬了，脸上还保持着战斗的表情——怒目圆睁，牙关紧咬。","你只有十岁。你站在父亲的棺材前，看着他那张被冻硬的脸，没有哭。","然后你拿起了父亲的剑。那是一把很普通的铁剑，剑身上有好几道缺口，剑柄被汗水浸得发黑。","「我要成为战士。」你说，声音还带着童音，但很坚定，「比父亲更强的战士。」","从那天起，你开始了训练。每天天不亮就起床，在院子里挥剑一千次。你的手磨出了水泡，水泡破了，流出脓水，然后结茧，然后再磨破。","你的母亲劝过你：「战士的路太苦了。你可以去学做生意，去学打铁，干什么都比当战士强。」","但你没有听。你只是挥剑，挥剑，挥剑。","十五岁那年，你加入了佣兵团。团长是一个满脸伤疤的老兵，他看了你一眼，说：「小鬼，你知道战士是什么吗？」","「战士就是用剑保护别人的人。」你说。","团长笑了，笑得很难看：「错了。战士就是用剑杀人的人。保护别人，不过是杀人的借口。」","你不相信。但你很快就明白了。","你的第一次战斗，是在一个小村庄。强盗袭击了村子，烧杀抢掠。你和佣兵团的人一起冲了上去。","你杀了第一个人。那是一个强盗，比你高大，比你强壮。但你的剑更快——你刺穿了他的喉咙。","热血喷在你的脸上，滚烫的。你看着他倒下去，眼睛还睁着，嘴里发出嗬嗬的声音。","你吐了。","团长拍了拍你的肩膀：「第一次都这样。习惯就好了。」","你没有习惯。但你继续战斗。因为你知道，如果你不杀他们，他们就会杀你，杀那些无辜的村民。","你的剑越来越快，你的心越来越硬。你从一个菜鸟变成了老兵，从一个佣兵变成了战士。","你站在战场上，脚下是尸体，手中是铁剑。风吹过，带着血腥味和硝烟味。","你想起了父亲。想起了他那张被冻硬的脸。","「我比你强了吗？」你喃喃道。","没有人回答你。只有风，在战场上呼啸。"],pace:"normal",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_warrior_awakening"},
    {t:"开始训练", check:{a:"STR",sk:"格斗",label:"力量·训练",target:50},
      tier:{
        crit:function(){return[pickV(["你的训练进展神速，教官说你是他见过的最有天赋的战士。格斗技能+3，STR+2。","你不仅完成了基本训练，还打败了教官！格斗技能+4，声望+5。"],"warrior_train_crit")]},
        ok:function(){return[pickV(["你完成了基本的战斗训练。格斗技能+1，STR+1。","你通过了训练考核。"],"warrior_train_ok")]},
        fail:function(){return[pickV(["训练太辛苦了，你花了比别人更多的时间才勉强通过。HP-5。","你的训练进展缓慢。"],"warrior_train_fail")]},
        critfail:function(){return[pickV(["你在训练中受了重伤，不得不休息很长时间。HP-15。","你和教官发生了冲突，被赶出了训练营。声望-5。"],"warrior_train_critfail")]}
      },
      effect:{time:7}, go:"job_warrior_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_warrior_awakening"]={pace:"deep",
  place:"战士·觉醒回忆",
  text:["战士·觉醒。","那是你在佣兵团的第五年。","你们接到了一个任务——护送一支商队穿过兽人草原。报酬很丰厚，但风险也很大——兽人草原不太平，最近有很多商队被劫。","商队走到草原深处的时候，出事了。","不是兽人。是比兽人更可怕的东西——一只深渊魔物。","那东西有三丈高，浑身覆盖着黑色的鳞片，头上长着三只角，眼睛是血红色的。它从地下钻出来，一口就吞了三个佣兵。","团长下令撤退。但你没有退——因为商队的人还在后面，有老人，有女人，有孩子。","你冲了上去。","你知道你打不过它。你的剑砍在它的鳞片上，只留下一道白印。它的爪子一挥，你就飞了出去，撞在一块石头上，吐出了一口血。","你躺在地上，看着那只魔物朝商队走去。老人在尖叫，女人在哭，孩子在喊妈妈。","你想起了父亲。想起了他说过的话：「战士，就是用剑保护别人的人。」","你想起了团长说过的话：「战士就是用剑杀人的人。保护别人，不过是杀人的借口。」","你笑了。笑得很苦涩。","然后你站了起来。","你的身体在发抖，你的伤口在流血，你的剑已经卷了刃。但你站了起来，挡在了魔物和商队之间。","「来吧。」你说，声音沙哑，但很坚定，「想过去，先从我身上踏过去。」","魔物咆哮着冲了过来。","你举起剑，迎了上去。","就在魔物的爪子要击中你的时候，你感觉到了——一股力量，从你的灵魂深处涌了出来。","那不是魔法，不是元素，不是任何你学过的东西。那是一种更原始、更强大的力量——战意。","你的身体开始发光。不是元素的光，而是一种金红色的、像是火焰一样的光。你的力量在暴涨，你的速度在提升，你的伤口在愈合。","战意觉醒。","你一剑劈了下去。这一剑，比你之前的任何一剑都要快，都要强。","剑刃劈在了魔物的头上。黑色的鳞片裂开了，黑色的血液喷了出来。魔物惨叫着，倒了下去。","你站在魔物的尸体上，大口喘气。金红色的光芒渐渐散去了。","商队的人围了上来，有人在哭，有人在笑，有人在感谢你。","但你没有听。你看着自己的手——那只握剑的手，还在泛着微光。","战意。战士的真正力量。","从那天起，你不再是一个普通的佣兵了。你是一个真正的战士——一个能用战意保护别人的战士。","团长看着你，眼神复杂：「你……觉醒了战意。」","「嗯。」你说。","「战意是战士的最高境界。」团长说，他的声音里有羡慕，也有感慨，「上一个觉醒战意的人，是三百年前的『武神』凯撒。他最后……成了半神。」","你看着远方。兽人草原的风吹过，草浪起伏。","半神。那是你从未想过的高度。","但现在，你觉得，也许有一天，你能达到。"],pace:"deep",
  options:[
    {t:"加入军队", effect:{time:1,flag:"warrior_army"}, go:"job_warrior_growth"},
    {t:"做一个佣兵", effect:{time:1,flag:"warrior_mercenary"}, go:"job_warrior_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_warrior_growth"] = function(){ return {
  place:"战士·成长篇",
  text:["战士·成长篇。","觉醒战意之后，你的实力飞速增长。","你离开了佣兵团，开始独自游历大陆。你用剑帮助过很多人——从强盗手中救下村庄，从魔物手中救下商队，从暴政手中救下平民。","你的名字开始在大陆上传开。有人叫你『剑圣』，有人叫你『守护者』，也有人叫你『疯子』——因为你总是不顾性命地冲在最前面。","你的境界在提升。启灵，凝元，化意，宗师——每一次晋升，都伴随着生死之间的顿悟。","但你也越来越孤独。","战士的路，是一条孤独的路。你越强，能和你并肩作战的人就越少。你的朋友们一个个离开了——有的死在了战场上，有的回了家乡，有的和你道不同不相为谋。","你站在一座山头上，看着脚下的万家灯火。那是一个小镇，你昨天刚从强盗手中救了它。镇上的人把你当成英雄，给你酒喝，给你肉吃，把你捧上天。","但你知道，明天你就要离开。然后去下一个地方，救下一个人，然后再离开。","你的剑越来越强，但你的心越来越空。","你想起了父亲。想起了团长。想起了那些死在你面前的人。","「战士的意义是什么？」你问自己。","是保护别人吗？但你保护不了所有人。你救下了这个小镇，但明天，另一个小镇可能会被毁灭。","是杀人吗？但杀了一个强盗，还有一百个强盗。杀了一只魔物，还有一千只魔物。","你坐在山头上，看着月亮升起来。月光洒在你的剑上，泛着冷光。","然后你听到了——一个声音，从你的灵魂深处传来。","「战士的意义，不是保护所有人。也不是杀尽所有敌人。」","那是战意的声音。金红色的光芒在你体内流转，温暖而强大。","「战士的意义，是站出来。在别人都退缩的时候，你站出来。在别人都害怕的时候，你不害怕。在别人都放弃的时候，你不放弃。」","「这就够了。」","你看着月亮，笑了。","是啊。这就够了。","你站起来，握紧了剑。山下的小镇里，灯火还亮着。你知道，因为你站在这里，那些人才能安睡。","这就够了。","你朝山下走去。明天，又是新的一天。又有新的人需要你去保护。","你的道路，还在继续。"],pace:"normal",
  options:[
    {t:"参加比武大会", check:{a:"STR",sk:"格斗",label:"力量·比武",target:60},
      tier:{
        crit:function(){return[pickV(["你在比武大会上一路过关斩将，最终夺得了冠军！声望+20，金币+100，获得：冠军勋章。","你不仅夺得了冠军，还在决赛中一招击败了上届冠军，震惊了所有人。声望+30，金币+150。"],"warrior_tournament_crit")]},
        ok:function(){return[pickV(["你在比武大会上取得了不错的成绩，虽然没有夺冠。声望+10，金币+30。","你打进了半决赛，虽然最后输了，但也证明了自己的实力。声望+5。"],"warrior_tournament_ok")]},
        fail:function(){return[pickV(["你在比武大会上早早被淘汰了。HP-10。","你的表现不佳，第一轮就输了。"],"warrior_tournament_fail")]},
        critfail:function(){return[pickV(["你在比武中受了重伤，不得不退出比赛。HP-20，声望-5。","你因为违规被取消了比赛资格。声望-10。"],"warrior_tournament_critfail")]}
      },
      effect:{time:3}, go:"job_warrior_turn"},
    {t:"去战场历练", effect:{time:1}, go:"faction_north_mission"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_warrior_turn"]={pace:"deep",
  place:"战士·转折篇",
  text:["战士·转折篇。","那是你在大陆游历的第八年。","铁门关战争爆发了。兽人联军攻破了铁门关，第一印破碎，深渊的气息从关隘里涌了出来。","你加入了北方公国的军队，成为了一名百夫长。你带着一百个士兵，守在铁门关的废墟上，抵挡兽人的进攻。","战斗很惨烈。你的士兵一个接一个地倒下——有的被兽人战斧劈中，有的被深渊魔物吞噬，有的被自己人的流箭射中。","你杀了很多兽人。很多魔物。你的剑已经卷了刃，你的铠甲已经破烂不堪，你的身上全是伤。","但你没有退。因为你知道，你身后就是北方公国的腹地。如果你退了，兽人和魔物就会长驱直入，屠杀更多的人。","然后，你遇到了他。","那是一个兽人战士。比普通兽人高出一个头，浑身覆盖着黑色的毛发，手里握着一把比人还高的战斧。他的眼睛是血红色的，里面没有理智，只有疯狂。","他是兽人部落的最强战士——『血斧』格罗玛什。","你们对视了一眼。然后同时冲了上去。","剑与斧碰撞，发出震耳欲聋的声响。你被震得手臂发麻，后退了三步。他也后退了两步。","「人类。」格罗玛什说，声音像是闷雷，「你很强。」","「你也不弱。」你说。","然后你们又冲了上去。","你们打了很久。从白天打到黑夜，从废墟的这头打到那头。你的剑断了，你就用拳头。他的斧柄断了，他就用手爪。","最后，你们都倒在了地上。你浑身是血，他也浑身是血。你们面对面躺着，大口喘气。","「为什么？」你问，「为什么要打碎铁门关？为什么要发动战争？」","格罗玛什沉默了一会儿，然后说：「因为我们被利用了。」","「有人告诉我们的大萨满，说打碎第一印，就能解放祖先的灵魂。大萨满信了。然后我们就来了。」","「但打碎了之后呢？」他的声音里有一丝痛苦，「祖先的灵魂没有解放。出来的是……那些东西。」","他看向废墟的深处。那里，深渊的气息还在往外涌。黑色的火焰在燃烧，魔物在咆哮。","「我们被骗了。」格罗玛什说，「但现在说什么都晚了。第一印已经碎了。」","你看着他。这个兽人战士，刚才还在和你生死相搏，现在却像一个迷路的孩子。","「不晚。」你说，「只要我们还活着，就不晚。」","他转过头，看着你。血红色的眼睛里，第一次出现了理智的光芒。","「你想干什么？」","「修复第一印。」你说，「然后，找出骗你们的人。」","格罗玛什沉默了很久。然后他笑了——笑得很粗犷，很真诚。","「好。」他说，「我跟你干。」","你们伸出手，握在了一起。一只人类的手，一只兽人的手。在铁门关的废墟上，在深渊的气息中，两个刚才还在生死相搏的战士，结成了同盟。","从那天起，你的道路改变了。","你不再只是一个保护别人的战士。你开始追寻真相——追寻是谁在背后操纵这一切，是谁打碎了第一印，是谁想让深渊降临。","你的剑，不再只是用来杀人。它是用来寻找真相的。", "你最后回望一眼转折篇，转身穿过街口，往下一程赶路。"],pace:"deep",
  options:[
    {t:"继续追求力量", effect:{time:1,STR:3,flag:"warrior_power"}, go:"job_warrior_legend"},
    {t:"思考战斗的意义", effect:{time:1,SPR:2,flag:"warrior_meaning"}, go:"job_warrior_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_warrior_legend"] = function(){ return {
  place:"战士·传奇篇",
  text:["战士·传奇篇。","你站在大宗师的境界上，已经两年了。","两年来，你和格罗玛什一起，走遍了大陆。你们调查了第一印破碎的真相，发现了暗蚀会的阴谋，揭露了教会的伪善。","你的名字，已经成了传奇。有人叫你『铁门关的守护者』，有人叫你『兽人之友』，也有人叫你『真相的追寻者』。","但你知道，这还不够。","深渊还在逼近。七印还在破碎。暗蚀会还在活动。教会还在清洗异端。","你需要更强的力量。强到能改变这一切的力量。","那天，你在铁门关的废墟上，遇到了一个人。","他穿着破旧的铠甲，脸上有一道从额头延伸到下巴的伤疤。他的手里握着一把断剑，剑身上全是缺口。","「你就是那个在找真相的战士？」他问，声音很苍老。","你点了点头。","「我是凯撒。」他说，「三百年前的『武神』。」","你的心跳加速了。凯撒——传说中的战士，三百年前觉醒战意，达到半神境界，然后消失了。","「你没有死？」你问。","「死了。」凯撒说，他笑了笑，「但又活了。因为我还有未完成的事。」","他走到废墟的边缘，看着下面的黑色火焰。","「三百年前，我也想修复七印。我也想阻止深渊降临。」他说，「但我失败了。因为我不够强。」","「半神不够？」","「半神不够。」凯撒转过身，看着你，「要阻止深渊，需要神话的力量。但神话，不是靠修炼就能达到的。」","「那要靠什么？」","「靠守护。」凯撒说，他的眼睛里闪过一丝光芒，「真正的守护——不是用剑保护别人，而是用自己的灵魂，为别人撑起一片天。」","「当你愿意为了保护别人，付出自己的一切——包括生命——的时候，神话的大门就会为你打开。」","你沉默了。你想起了很多人——你的父亲，你的团长，你的士兵，格罗玛什，还有那些你救下的人。","「我愿意。」你说。","凯撒点了点头。他伸出手，按在你的胸口。","一股金红色的力量涌入你的身体。那是战意——比你之前的战意强一百倍、一千倍的战意。","你感觉到，你的灵魂在燃烧。你的身体在蜕变。你的力量在暴涨。","武神之心——传说中战士的最高成就，在你的体内成型了。","你仰天长啸。金红色的光芒从你体内爆发出来，照亮了整个铁门关废墟。黑色的火焰在光芒中熄灭了，深渊的气息在光芒中消散了。","你达到了——半神。","凯撒看着你，笑了：「很好。接下来的路，要你自己走了。」","他的身体开始变得透明。「我的使命完成了。」他说，「接下来，就看你了。」","「等等！」你喊道，「你要去哪里？」","「去我该去的地方。」凯撒说，他的身体越来越透明，「记住——战士的意义，不是力量有多强。而是你愿意为了保护别人，付出多少。」","他消失了。只留下那把断剑，插在废墟的石头上。","你站在铁门关的废墟上，金红色的光芒渐渐散去。你看着远方——大陆的轮廓在晨光中显现。","你的道路，还没有结束。","但现在，你有了足够的力量，去走完它。","你握紧了拳头——武神之心在你的胸腔里跳动，温暖而强大。","「等着我。」你对远方说，「我会阻止深渊的。」","风吹过废墟，带来了远方的气息。你朝山下走去。","你的传奇，才刚刚开始。", "离开传奇篇时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"deep",
  options:[
    {t:"开始领悟武神之心", check:{a:"SPR",sk:"意志",label:"灵性·领悟",target:75},
      tier:{
        crit:function(){return[pickV(["你在一次生死之战中，终于领悟了武神之心的真谛！你的力量有了质的飞跃。STR+5，声望+30，获得：武神之心（境界）。","你不仅领悟了武神之心，还创造了属于自己的传奇武技！STR+8，声望+50。"],"warrior_legend_crit")]},
        ok:function(){return[pickV(["你在领悟上取得了一些进展，但还没有完全成功。STR+2。","你摸到了武神之心的门槛，但还差一点。"],"warrior_legend_ok")]},
        fail:function(){return[pickV(["你尝试了很多次，但始终无法领悟。","你的领悟遇到了瓶颈。"],"warrior_legend_fail")]},
        critfail:function(){return[pickV(["你在领悟时走火入魔了，受了重伤。HP-25，STR-2。","你差点死在领悟的过程中，虽然活了下来，但留下了后遗症。HP-20，SAN-10。"],"warrior_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_soulmage_intro"] = function(){ return {
  place:"灵魂法师·入门篇",
  text:["灵魂法师。","你第一次看到死者，是在母亲的葬礼上。","那天，下着小雨。母亲的棺材被放进墓穴里，牧师在念着祈祷文。你的父亲站在墓前，肩膀在发抖。","你只有八岁。你看着棺材被土掩埋，然后——你看到了。","一个透明的、半透明的人影，从棺材里飘了出来。那是你的母亲。她穿着生前最喜欢的蓝色裙子，脸上带着温柔的笑容。","「妈妈？」你小声说。","她转过头，看着你。她的嘴唇动了动，但你听不到声音。","你伸出手，想去碰她。但你的手穿过了她的身体——她是透明的，像是水中的倒影。","「妈妈，你要去哪里？」你问。","她指了指天空。然后她的身体开始变得透明，一点一点地，消失在了空气中。","你站在雨里，看着她消失的方向，哭了。","你的父亲以为你是在为母亲的死而哭。但你不是——你是在为她的离开而哭。因为你知道，她没有死。她只是去了另一个地方。","从那天起，你就能看到死者了。","一开始，你整夜点着灯睡。到处都是死人——街上、屋子里、医院里、战场上。他们有的在徘徊，有的在哭泣，有的在微笑，有的在愤怒。","你告诉了父亲。父亲带你去看了医生，医生说你是幻觉。你告诉了牧师，牧师说你被恶魔附身了。","直到你遇到了墨丘利。","那是你十二岁那年。墨丘利来到了你的小镇，在教堂里做了一场关于灵魂魔法的演讲。你坐在角落里，听着他的话——『灵魂法师不是异端。我们只是能看到别人看不到的东西。』","演讲结束后，你找到了他。","「你能看到死者。」墨丘利说，不是问句。他的眼睛很亮，像是看到了什么珍贵的东西，「你有灵魂法师的天赋。」","「我是异端吗？」你问。","墨丘利笑了。他蹲下来，和你平视：「不。你是特别的。跟我走吧，我教你如何控制这种力量。」","你跟他走了。从那天起，你成了墨丘利的学生，成了一名灵魂法师。","你学会了和死者对话，学会了引导灵魂前往死后的世界，学会了用灵魂的力量保护自己和别人。","但你也学会了——灵魂法师的路，是一条孤独的路。","因为你能看到别人看不到的东西，所以你永远无法和别人真正分享你的世界。","你站在学院的塔顶上，看着脚下的城市。夜风很冷，但你感觉不到——因为你的灵魂，总是在另一个世界里徘徊。","「妈妈。」你喃喃道，「你在那边，还好吗？」","没有人回答你。只有风，在塔顶呼啸。"],pace:"deep",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_soulmage_awakening"},
    {t:"学习灵魂魔法", check:{a:"SPR",sk:"灵魂魔法",label:"灵性·学习",target:60},
      tier:{
        crit:function(){return[pickV(["你很快就掌握了灵魂魔法的基本技巧，你的天赋让老师都感到惊讶。灵魂魔法+3，SAN-3。","你不仅学会了基本技巧，还看到了一些不该看到的东西。灵魂魔法+4，SAN-8。"],"soulmage_learn_crit")]},
        ok:function(){return[pickV(["你学会了灵魂魔法的基本技巧。灵魂魔法+1，SAN-2。","你完成了基本的学习。知识+1。"],"soulmage_learn_ok")]},
        fail:function(){return[pickV(["灵魂魔法太难了，你花了很多时间才勉强入门。SAN-5。","你的学习进展缓慢。"],"soulmage_learn_fail")]},
        critfail:function(){return[pickV(["你在练习时被灵魂反噬了，看到了可怕的东西。HP-10，SAN-15。","你引发了一场灵魂风暴，差点死掉。HP-15，SAN-20。"],"soulmage_learn_critfail")]}
      },
      effect:{time:7}, go:"job_soulmage_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_soulmage_awakening"]={pace:"deep",
  place:"灵魂法师·觉醒回忆",
  text:["灵魂法师·觉醒。","那是你跟着墨丘利学习的第三年。","那天晚上，墨丘利带你去了一个地方——交汇城的地下，守望者的秘密图书馆。","图书馆很大，书架一眼望不到头。书架上摆满了各种书籍——有魔法书，有历史书，有禁书，还有一些你看不懂的、用未知文字写的书。","「这里是守望者三千年的积累。」墨丘利说，他的声音在空旷的图书馆里回荡，「每一本书，都是一个守望者用生命换来的知识。」","他带你走到了图书馆的最深处。那里有一扇门，门上刻着灵魂法师的徽记——一只眼睛，瞳孔是螺旋状的。","「里面是灵魂魔法的最高机密。」墨丘利说，他的表情很严肃，「只有达到一定境界的灵魂法师，才能进去。」","他推开门。门里面是一个小房间，房间的中央有一个祭坛，祭坛上放着一个水晶球。","水晶球里，有什么东西在旋转。","「那是『灵魂之眼』。」墨丘利说，「黄林晶留下的神器。用它，能看到死者的世界，能和亡者对话，甚至能……短暂地复活死者。」","你走到祭坛前，看着水晶球。水晶球里的东西旋转得越来越快，然后——你看到了。","你看到了死者的世界。","那是一片灰色的荒原。天空是暗红色的，大地上到处都是灵魂——有的在徘徊，有的在哭泣，有的在沉睡。荒原的尽头，有一道巨大的门，门后面是一片白光——那是死后的世界，是灵魂最终的归宿。","然后，你看到了她。","你的母亲。她站在荒原上，穿着蓝色的裙子，正在看着你。","「妈妈！」你喊道。","她笑了。她的嘴唇动了动，这一次，你听到了她的声音。","「孩子。你长大了。」","你的眼泪流了下来。你伸出手，想碰她，但你的手穿过了水晶球——你碰不到她。","「妈妈，我好想你。」你哭着说。","「我知道。」母亲说，她的声音很温柔，「但你不能一直想着我。你要往前走，过好自己的生活。」","「可是——」","「听我说。」母亲的声音变得严肃了，「灵魂法师的力量，不是用来和死者纠缠的。是用来帮助死者安息，帮助生者活下去的。」","「你要记住——死者已经死了，生者还要活着。不要让过去的阴影，遮住了未来的光。」","她的身体开始变得透明。","「妈妈！」你喊道。","「再见了，孩子。」她微笑着说，「要好好活着。」","她消失了。水晶球里的旋转停止了，恢复了平静。","你跪在祭坛前，泪流满面。墨丘利站在你身后，没有说话。","过了很久，你站起来。你擦干了眼泪，看着墨丘利。","「我明白了。」你说，声音还有些哽咽，但很坚定，「灵魂法师的力量，是用来帮助别人的。不是用来满足自己的私欲的。」","墨丘利点了点头：「你觉醒了。灵魂法师的真正力量——『灵魂共鸣』。」","从那天起，你的灵魂魔法变得不一样了。你不再只是能看到死者——你能感受到他们的情绪，他们的记忆，他们的遗憾。你能帮助他们完成未竟的心愿，引导他们安息。","但你也付出了代价——每一次灵魂共鸣，你都会感受到死者的痛苦和悲伤。那些情绪会留在你的心里，像是一道道伤疤。","你站在学院的塔顶上，看着夜空。星星很亮，像是无数个灵魂在闪烁。","「妈妈。」你说，「我会好好活着的。」","风吹过塔顶，带来了远处的钟声。你闭上眼睛，感受着夜风中的灵魂——它们在低语，在歌唱，在等待着被引导安息。","你的道路，还在继续。而这一次，你不再孤独了——因为有无数的灵魂，在陪伴着你。"],pace:"deep",
  options:[
    {t:"跟墨丘利学习灵魂魔法", effect:{time:1,墨丘利_bond:10,flag:"soulmage_mercury"}, go:"job_soulmage_growth"},
    {t:"拒绝这种力量", effect:{time:1,SAN:5,flag:"soulmage_refused"}, go:"job_soulmage_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_soulmage_growth"] = function(){ return {
  place:"灵魂法师·成长篇",
  text:["灵魂法师·成长篇。","毕业后，你离开了学院，开始在大陆上游历。","你帮助过很多死者——有战死的士兵，有病逝的老人，有夭折的孩子，有含冤而死的无辜者。你倾听他们的遗言，完成他们的心愿，引导他们前往死后的世界。","你的名字在灵魂法师的圈子里传开了。有人叫你『灵魂的引路人』，有人叫你『死者的朋友』。","但教会不这么叫你。教会叫你『异端』。","净化令颁布后，灵魂法师成了教会的重点清查对象。你的几个同学被审判骑士抓走了，有的被烧死了，有的被关进了地牢，再也没有出来。","你不得不东躲西藏。你不能在一个地方待太久，不能暴露自己的身份，不能使用太明显的灵魂魔法。","那天，你在一个小镇上，遇到了一个小女孩。","小女孩只有六岁，瘦得只剩下一把骨头，眼睛很大，很亮。她的母亲刚死了——病死的，没钱治病。","小女孩蹲在母亲的尸体旁边，不哭也不闹，只是静静地看着。","你走过去，蹲在她身边。你能看到——她母亲的灵魂还在，站在小女孩的身后，用手抚摸着小女孩的头发，脸上满是悲伤和不舍。","「她能看到我吗？」母亲的灵魂问你。","你摇了摇头：「她还没有觉醒。她看不到你。」","母亲的灵魂哭了。透明的眼泪从她的脸上流下来，落在地上，消失了。","「我不想离开她。」母亲说，「她还这么小，我走了，她怎么办？」","你看着那个小女孩。她的眼睛里没有眼泪，但你能感觉到——她的灵魂在哭泣。","「我会照顾她。」你说。","母亲的灵魂看着你，眼中充满了感激：「谢谢你。」","你伸出手，放在母亲的灵魂上。温暖的灵魂力量涌入她的身体，她的身体开始发光。","「去吧。」你说，「你的女儿，我会照顾的。」","母亲的灵魂微笑着，一点一点地消失在了空气中。","小女孩抬起头，看着你：「姐姐，妈妈去哪里了？」","你抱起她，她很轻，轻得像是一片羽毛。","「妈妈去了一个很远的地方。」你说，「但她会一直看着你。」","小女孩点了点头，把脸埋在你的肩膀上。","你抱着她，走出了小镇。你不知道自己要去哪里，但你知道——你不能再只顾自己了。你有了要守护的人。","从那天起，你的道路改变了。你不再只是一个游荡的灵魂法师——你成了一个守护者。","你带着小女孩，走遍了大陆。你用灵魂魔法帮助别人，换取食物和住所。你教小女孩读书，教她认字，教她如何保护自己。","小女孩叫你『姐姐』。你叫她『小雨』——因为她出生的那天，下着小雨。","你站在山顶上，看着小雨在草地上追蝴蝶。阳光洒在她身上，金色的。","你想起了母亲。想起了她说的话：「不要让过去的阴影，遮住了未来的光。」","你笑了。","是啊。未来的光，就在眼前。","你的道路，还在继续。而这一次，你不再是一个人了。"],pace:"deep",
  options:[
    {t:"继续深入研究", check:{a:"SPR",sk:"灵魂魔法",label:"灵性·研究",target:65},
      tier:{
        crit:function(){return[pickV(["你在灵魂魔法的研究上取得了重大突破，学会了新的强大法术。灵魂魔法+4，SAN-10。","你不仅学会了新法术，还发现了灵魂的本质——那是一种超越生死的力量。灵魂魔法+6，SAN-15。"],"soulmage_research_crit")]},
        ok:function(){return[pickV(["你在研究上取得了一些进展。灵魂魔法+2，SAN-5。","你学会了一些新的灵魂法术。"],"soulmage_research_ok")]},
        fail:function(){return[pickV(["你的研究遇到了瓶颈，迟迟没有进展。SAN-3。","你尝试了很多次，但都失败了。"],"soulmage_research_fail")]},
        critfail:function(){return[pickV(["你在研究时被深渊的力量侵蚀了，产生了严重的幻觉。HP-15，SAN-25。","你差点被一个强大的灵魂吞噬，虽然逃脱了，但受了重伤。HP-20，SAN-20。"],"soulmage_research_critfail")]}
      },
      effect:{time:15}, go:"job_soulmage_turn"},
    {t:"寻找墨丘利的帮助", effect:{time:1}, go:"relic_soul_eye_mercury"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_soulmage_turn"]={pace:"deep",
  place:"灵魂法师·转折篇",
  text:["灵魂法师·转折篇。","那是你带着小雨游历的第三年。","你们在死亡沙漠的边缘，遇到了一个灵魂。","那不是普通的灵魂。它很大——有三丈高，浑身覆盖着黑色的火焰，眼睛是血红色的。它的身上缠绕着无数的锁链，锁链的另一端，消失在沙漠的深处。","那是一个被封印的灵魂。一个强大的、古老的、充满恶意的灵魂。","「你是谁？」你问，把小雨护在身后。","那个灵魂转过头，看着你。血红色的眼睛里，闪过一丝惊讶。","「你能看到我？」它说，声音像是从很深的地方传来，带着回音，「很久没有人能看到我了。」","「你是谁？」你又问了一遍。","「我是塞拉芬。」它说，「前守望者执灯人。灵魂法师。」","你的心跳加速了。塞拉芬——墨丘利曾经的挚爱，三百年前带着灵魂之眼走进地下图书馆最深处，然后再也没有出来。","「你没有死？」你问。","「死了。」塞拉芬说，她的声音里有一丝苦涩，「但我的灵魂被封印在这里了。被守望者封印的。」","「为什么？」","「因为我发现了真相。」塞拉芬说，她的身体开始颤抖，黑色的火焰跳动着，「守望者的真相。七印的真相。黄林晶的真相。」","「什么真相？」","塞拉芬沉默了一会儿，然后说：「七印不是用来封印深渊的。七印是用来封印……更可怕的东西的。」","「黄林晶不是英雄。他是一个……」她停了下来，黑色的火焰暴涨，锁链发出刺耳的声响，「我不能说。说了，封印会加强。」","「你想知道真相吗？」塞拉芬看着你，血红色的眼睛里有一丝期待，「帮我解开封印。我会告诉你一切。」","你犹豫了。你看了一眼身后的小雨——她正躲在你的身后，紧紧抓着你的衣服，眼睛里满是恐惧。","解开塞拉芬的封印，可能会释放出一个强大的灵魂。她可能是盟友，也可能是敌人。","但不解开，你就永远无法知道真相。","你吸了口气。","「我帮你。」你说。","你伸出手，放在塞拉芬的锁链上。灵魂力量涌入锁链，锁链开始发光，开始断裂。","一根。两根。三根。","当最后一根锁链断裂的时候，塞拉芬的身体爆发出耀眼的光芒。黑色的火焰消散了，取而代之的是一种银白色的、温暖的光。","塞拉芬的身体变了。她不再是那个三丈高的怪物——她变成了一个普通的女人，穿着银白色的长袍，长发飘逸，面容美丽而疲惫。","「谢谢你。」她说，声音不再有回音，而是温柔的、清晰的，「三百年了。终于自由了。」","她看着你，然后看向你身后的小雨。","「这是你的孩子？」她问。","「算是吧。」你说。","塞拉芬笑了。那笑容很美，很温柔。","「你是一个好灵魂法师。」她说，「墨丘利如果看到你，一定会很骄傲。」","「你认识墨丘利？」","「认识。」塞拉芬的眼神暗了下来，「他是我……曾经的挚爱。三百年了，不知道他现在怎么样了。」","她转过身，看着沙漠的深处。","「真相，我会告诉你的。但不是现在。」她说，「现在，你需要变得更强。强到能承受真相的重量。」","「等你准备好了，来死亡沙漠的深渊神殿找我。」","她的身体开始变得透明。","「等等！」你喊道，「真相到底是什么？」","塞拉芬回头看了你一眼，笑了笑：「等你准备好了，你自然会知道。」","她消失了。沙漠恢复了平静，仿佛什么都没有发生过。","小雨从你身后探出头：「姐姐，那个阿姨是谁？」","你看着塞拉芬消失的方向，心里有一种说不出的感觉。","「一个朋友。」你说。","你抱起小雨，朝沙漠的边缘走去。夕阳把你们的影子拉得很长。","你的道路，从今天起，和真相纠缠在了一起。","而真相，就在死亡沙漠的深处，在深渊神殿里，等待着你。", "你离了转折篇，脚步声在空旷处格外清晰。赶路要紧。"],pace:"deep",
  options:[
    {t:"追求贤者之魂", effect:{time:1,flag:"seek_sage_soul"}, go:"job_soulmage_legend"},
    {t:"拒绝，保持人的身份", effect:{time:1,SAN:10,flag:"reject_sage_soul"}, go:"job_soulmage_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_soulmage_legend"] = function(){ return {
  place:"灵魂法师·传奇篇",
  text:["灵魂法师·传奇篇。","你站在大宗师的境界上，已经一年了。","一年来，你带着小雨，走遍了大陆。你帮助了无数的灵魂，引导他们安息。你的灵魂魔法越来越强，强到能短暂地复活死者，强到能和深渊的灵魂对话。","但你知道，这还不够。","塞拉芬说的真相，一直在你脑海里回响。七印不是用来封印深渊的——那是用来封印什么的？黄林晶不是英雄——那他是什么？","那天，你带着小雨，来到了死亡沙漠的深渊神殿。","神殿很大，很古老。墙壁上刻满了符文，那些符文在黑暗中泛着暗红色的光。空气里有一股浓重的血腥味和硫磺味。","神殿的最深处，塞拉芬在等你。","「你来了。」她说，「你准备好了吗？」","你点了点头。","塞拉芬走到神殿的中央。那里有一个巨大的祭坛，祭坛上刻着七印的图案。","「三千年前。」塞拉芬说，她的声音在神殿里回荡，「黄林晶和深渊之主打了一场仗。所有人都以为，黄林晶赢了，把深渊之主封印在了七印里。」","「但真相是——黄林晶输了。」","你的心跳加速了。","「深渊之主太强大了。黄林晶根本打不过它。」塞拉芬说，「所以他做了一个交易。」","「什么交易？」","「他用七印，把深渊之主的力量分成了七份，分别封印在七个地方。但作为交换——他把自己的灵魂，献给了深渊之主。」","「黄林晶，成了深渊之主的容器。」","你愣住了。","「所以七印不是用来封印深渊的——是用来封印黄林晶的。因为黄林晶的身体里，装着深渊之主的灵魂。如果七印碎了，黄林晶就会苏醒，深渊之主就会降临。」","「那……守望者呢？守望者知道真相吗？」","「知道。」塞拉芬说，她的声音里有一丝痛苦，「守望者的使命，不是守护七印——是守护这个秘密。确保没有人知道真相，确保七印不会被破坏。」","「我就是因为发现了真相，才被守望者封印的。」","你站在祭坛前，脑子里一片混乱。黄林晶是英雄？不，他是深渊之主的容器。守望者是守护者？不，他们是真相的掩盖者。","「那我们该怎么办？」你问，「修复七印，让黄林晶继续沉睡？还是打碎七印，让深渊之主降临？」","「都不是。」塞拉芬说，她看着你，眼睛里有一丝光芒，「还有第三条路。」","「什么路？」","「贤者之魂。」塞拉芬说，「灵魂法师的最高成就——用自己的灵魂，净化深渊之主的灵魂。把黄林晶从深渊之主的控制中解放出来。」","「但这需要付出代价——你的灵魂，会和深渊之主的灵魂融合。你可能会消失，也可能会……成为新的存在。」","你沉默了。你看了一眼小雨——她站在神殿的门口，正看着你，眼睛里满是担忧。","「姐姐。」小雨说，「不要走。」","你走过去，蹲下来，抱住了她。","「小雨。」你说，「姐姐要去做一件很重要的事。」","「什么事？」","「拯救世界。」你说，笑了笑。","小雨抱紧了你：「那你要回来。」","「我会的。」你说。","你站起来，走到祭坛前。塞拉芬看着你，点了点头。","你伸出手，放在祭坛上。灵魂力量涌入祭坛，七印的图案开始发光。","你感觉到——一股强大的、黑暗的、充满恶意的力量，从祭坛里涌了出来。那是深渊之主的灵魂。","它在咆哮，在挣扎，在试图吞噬你。","但你没有退缩。你用自己的灵魂，包裹住了它。你感受到了它的痛苦，它的愤怒，它的孤独——还有，藏在最深处的，黄林晶的灵魂。","「黄林晶。」你在灵魂的深处呼唤，「我来带你回家。」","金白色的光芒从你体内爆发出来，照亮了整个神殿。深渊之主的灵魂在光芒中挣扎，然后——渐渐平静了下来。","贤者之魂，觉醒了。","你感觉到，你的灵魂在和深渊之主的灵魂融合。你能感受到它的力量，它的记忆，它的存在。","但你没有消失。你还是你——一个灵魂法师，一个守护者，一个姐姐。","光芒散去。你站在祭坛前，浑身散发着金白色的光芒。塞拉芬看着你，眼中满是震惊和敬佩。","「你做到了。」她说，「三千年了，终于有人做到了。」","你看着自己的手。金白色的光芒在指尖流转，温暖而强大。","你达到了——半神。","然后你转过身，看向神殿的门口。小雨站在那里，泪流满面，但在笑。","「姐姐！」她跑过来，抱住了你。","你抱起她，走出了神殿。沙漠的阳光洒在你们身上，温暖而明亮。","你的道路，还没有结束。但现在，你有了足够的力量，去走完它。","「小雨。」你说，「我们回家。」","「好。」小雨说，把脸埋在你的肩膀上。","风吹过沙漠，带来了远方的气息。你朝沙漠的边缘走去。","你的传奇，才刚刚开始。"],pace:"deep",
  options:[
    {t:"开始领悟贤者之魂", check:{a:"SPR",sk:"灵魂魔法",label:"灵性·领悟",target:80},
      tier:{
        crit:function(){return[pickV(["你在生死边缘徘徊了七天七夜，终于领悟了贤者之魂的真谛！你超越了生死的界限。SPR+5，声望+30，获得：贤者之魂（境界）。","你不仅领悟了贤者之魂，还创造了属于自己的灵魂法术！SPR+8，声望+50。"],"soulmage_legend_crit")]},
        ok:function(){return[pickV(["你在领悟上取得了一些进展，但还没有完全成功。SPR+2。","你摸到了贤者之魂的门槛，但还差一点。"],"soulmage_legend_ok")]},
        fail:function(){return[pickV(["你尝试了很多次，但始终无法领悟。","你的领悟遇到了瓶颈。"],"soulmage_legend_fail")]},
        critfail:function(){return[pickV(["你在领悟时差点被深渊吞噬，虽然活了下来，但灵魂受到了损伤。HP-25，SPR-3，SAN-20。","你差点死在领悟的过程中，虽然活了下来，但留下了严重的后遗症。HP-30，SAN-30。"],"soulmage_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_rogue_intro"] = function(){ return {
  place:"盗贼·入门篇",
  text:["盗贼。","你第一次偷东西，是为了一块面包。","那年你九岁。你已经三天没吃东西了。你的父母死于瘟疫，你成了孤儿，在交汇城的贫民窟里流浪。","你站在面包房的门口，看着橱窗里的面包——金黄的，酥脆的，散发着诱人的香气。你的肚子在叫，你的口水在流，你的腿在发抖。","你看了看四周。面包房的老板在柜台后面打盹，街上的行人匆匆走过，没有人注意你。","你吸了口气，推开门，走了进去。","你的心跳得很快，像是要从嗓子眼里跳出来。你走到橱窗前面，伸出手——","「喂！你干什么！」","老板醒了。他冲过来，一把抓住了你的手腕。他的手很有力，捏得你生疼。","「小偷！」老板喊道，「这么小就偷东西！」","你挣扎着，哭着喊着，但老板不放手。他把你拖到街上，当着所有人的面打了你一巴掌。","你的脸火辣辣的疼。你倒在地上，看着周围的人——他们在看你，有的在笑，有的在摇头，有的在骂你。","然后，一个人走了过来。","那是一个穿着灰色斗篷的人。他的脸藏在兜帽的阴影里，看不清表情。他递给老板几个铜币：「这块面包，我买了。」","老板接过钱，骂骂咧咧地回去了。","灰斗篷人蹲下来，把面包递给你。","「吃吧。」他说，声音很温和。","你接过面包，狼吞虎咽地吃了起来。面包很软，很甜，是你吃过的最好吃的东西。","「你叫什么名字？」灰斗篷人问。","你摇了摇头——你没有名字。孤儿院里的孩子都叫你『小鬼』。","「那以后，你就叫『影』吧。」灰斗篷人说，「跟我走。我教你怎么偷东西——但不是为了面包。是为了生存。」","你跟着他走了。从那天起，你成了一个盗贼。","灰斗篷人是盗贼公会的一名资深盗贼。他教你潜行，教你开锁，教你偷窃，教你如何在阴影中生存。","他告诉你：「盗贼不是坏人。盗贼只是用自己的方式，在这个不公平的世界里生存。富人有法律保护，穷人有什么？只有一双手。」","你记住了这句话。","你的天赋很高。三年后，你就成了盗贼公会里最出色的年轻盗贼。你能在守卫的眼皮底下偷走他们的钱包，能在十秒内打开最复杂的锁，能在黑暗中像猫一样行走。","你站在交汇城的屋顶上，看着脚下的城市。夜风吹过，你的斗篷在风中猎猎作响。","你的手里，握着一个钱袋——那是你今晚的『战利品』，从一个贪官的卧室里偷来的。","你笑了笑，把钱袋扔进了贫民窟的巷子里。明天，会有一个孤儿捡到它，用它买一块面包。","就像当年的你一样。","你的道路，是用阴影和机智铺成的。但你知道，在阴影的深处，有一束光——那是你永远不会忘记的，一块面包的温度。"],pace:"deep",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_rogue_awakening"},
    {t:"开始训练", check:{a:"AGI",sk:"潜行",label:"敏捷·训练",target:50},
      tier:{
        crit:function(){return[pickV(["你的训练进展神速，盗贼公会的长老说你是百年一遇的天才。潜行+3，AGI+2。","你不仅完成了基本训练，还从公会的宝库里偷了一件东西而没被发现！潜行+4，获得：盗贼公会徽章。"],"rogue_train_crit")]},
        ok:function(){return[pickV(["你完成了基本的盗贼训练。潜行+1，AGI+1。","你通过了训练考核。"],"rogue_train_ok")]},
        fail:function(){return[pickV(["训练太辛苦了，你花了比别人更多的时间才勉强通过。HP-5。","你的训练进展缓慢。"],"rogue_train_fail")]},
        critfail:function(){return[pickV(["你在训练中受了伤，不得不休息很长时间。HP-15。","你因为偷窃被抓住了，被公会赶了出来。声望-10。"],"rogue_train_critfail")]}
      },
      effect:{time:7}, go:"job_rogue_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_rogue_awakening"]={pace:"deep",
  place:"盗贼·觉醒回忆",
  text:["盗贼·觉醒。","那是你加入盗贼公会的第五年。","你接到了一个任务——从美第奇商会的金库偷一份文件。报酬很丰厚，足够你花三年。","你在一个月黑风高的夜晚，潜入了美第奇商会。你避开了巡逻的护卫，打开了金库的锁，找到了那份文件。","但就在你要离开的时候，你看到了——金库的角落里，有一个暗格。","你的直觉告诉你，那个暗格里有更重要的东西。","你打开了暗格。里面是一个小盒子，盒子里放着一枚徽章——天平与蛇，美第奇家族的徽章。","你拿起徽章，突然——一股力量涌入了你的身体。","那不是魔法，不是元素，而是一种更隐蔽的、更敏捷的力量。你感觉到，你的身体变得更轻了，你的感官变得更敏锐了，你的影子……好像活了过来。","暗影觉醒。","你能感觉到——你的影子在动。它不再是你身体的附属品，而是一个独立的存在。它能延伸，能变形，能帮你做很多事情。","你伸出手，影子从你的脚下延伸出去，绕过了护卫的巡逻路线，帮你探路。你闭上眼睛，能通过影子『看到』周围的一切。","「这就是……暗影的力量。」你喃喃道。","你带着文件和徽章，离开了美第奇商会。整个过程，没有一个人发现你。","从那天起，你的盗贼技术更上一层楼。你能在完全黑暗中行走，能在守卫的眼皮底下消失，能用影子完成各种不可思议的事情。","但你也发现了一个秘密——那枚徽章，不是普通的徽章。它是美第奇家族的传家宝，上面附着着美第奇先祖的灵魂。","「你是一个有天赋的盗贼。」徽章里的灵魂说，那是一个苍老的声音，「暗影的力量，是盗贼的最高境界。历史上，只有三个人觉醒过暗影——而他们，最后都成了传奇。」","「你是谁？」你问。","「我是乔瓦尼·德·美第奇。」灵魂说，「美第奇家族的创始人。三百年前，我也是一个盗贼。」","你愣住了。美第奇家族的创始人，是一个盗贼？","「没错。」乔瓦尼说，他的声音里有一丝笑意，「我从一个孤儿，偷成了大陆最富有的人。美第奇家族，就是靠偷窃起家的。」","「但后来，我的后代们忘记了这一点。他们成了商人，成了贵族，成了……体面人。他们忘记了，美第奇家族的根，在阴影里。」","「你拿着这枚徽章，就等于继承了美第奇家族的暗影传承。」乔瓦尼说，「用它，去做你认为对的事。」","你握着徽章，感受着里面的灵魂力量。暗影在你身边流转，像是有生命一样。","从那天起，你不再只是一个普通的盗贼了。你是美第奇暗影传承的继承者。","你站在交汇城的屋顶上，看着脚下的城市。夜风吹过，你的影子在月光下延伸，像是一条黑色的蛇。","「乔瓦尼。」你说，「我会用这股力量，做我认为对的事。」","「我知道。」乔瓦尼的声音在你脑海里响起，带着笑意，「我选的人，不会错。」","你笑了笑，从屋顶上跳了下去。影子在你脚下展开，像是一对翅膀，托着你无声地落在了地面上。","你的道路，从今天起，和阴影融为了一体。","而阴影里，有你从未想象过的力量。", "别过觉醒回忆，你沿官道走出里许，回头已看不清来处。"],pace:"deep",
  options:[
    {t:"加入盗贼公会", effect:{time:1,flag:"rogue_guild"}, go:"job_rogue_growth"},
    {t:"做一个独行者", effect:{time:1,flag:"rogue_solo"}, go:"job_rogue_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_rogue_growth"] = function(){ return {
  place:"盗贼·成长篇",
  text:["盗贼·成长篇。","觉醒暗影之后，你的名字在地下世界传开了。","有人叫你『影行者』，有人叫你『美第奇的幽灵』，也有人叫你『偷不走的影子』——因为从来没有人能抓住你。","你偷过很多东西——贪官的钱，贵族的珠宝，教会的秘密文件，暗蚀会的情报。你把偷来的钱，大部分都给了贫民窟的孤儿和穷人。","你成了地下世界的传奇。但你也成了很多人的眼中钉——贪官恨你，贵族恨你，教会恨你，暗蚀会更恨你。","那天，你接到了一个任务——从教会的圣库里，偷一份『净化令密档』。那份密档里，记录着教会清洗『异端』的真实名单和目的。","你潜入了圣城。你避开了审判骑士的巡逻，打开了圣库的锁，找到了那份密档。","但就在你要离开的时候，你触发了警报。","审判骑士从四面八方涌来，把你围在了圣库的大厅里。","「盗贼。」为首的审判骑士说，他的声音冰冷，「你以为你能从教会的圣库里偷走东西？」","你看了看四周。二十个审判骑士，全都穿着银甲，手持长剑。大厅的门已经被封死了，窗户也被铁栅栏挡住了。","看起来，你无路可逃。","但你笑了。","「你们抓不住我的。」你说。","你伸出手，暗影从你脚下爆发出来，填满了整个大厅。黑暗中，审判骑士们什么都看不到——除了你的声音。","「再见了。」你说。","你用影子包裹住自己，从墙壁的缝隙里滑了出去。整个过程，不到三秒。","当审判骑士们驱散黑暗的时候，你已经站在了圣城的城墙上，手里拿着那份密档。","你打开密档，看了一眼，然后你的脸色变了。","密档里记录的，不只是清洗异端的名单——还有教会和暗蚀会的秘密交易。教会在利用暗蚀会，制造『异端事件』，然后借净化令的名义，清除异己。","「原来如此。」你喃喃道。","你把密档收好，从城墙上跳了下去。影子在你脚下展开，托着你无声地落在了地面上。","你知道，这份密档会改变很多事情。它会揭露教会的伪善，会让很多人看清真相。","但你也知道，从今天起，教会会不惜一切代价追杀你。","你拉紧了斗篷，走进了夜色里。","你的道路，从今天起，和教会的阴谋纠缠在了一起。","而阴影，是你最好的武器。","你回头看了一眼圣城。白色的城市在月光下泛着冷光，像是一座坟墓。","「等着吧。」你说，「我会把你们的秘密，全都公之于众。」","你消失在了夜色里。只有影子，在月光下停留了一瞬，然后也消失了。"],pace:"deep",
  options:[
    {t:"去偷贵族的宝库", check:{a:"AGI",sk:"潜行",label:"敏捷·盗窃",target:65},
      tier:{
        crit:function(){return[pickV(["你成功潜入了贵族的宝库，偷走了大量财宝！金币+200，潜行+3，声望+10（地下世界）。","你不仅偷走了财宝，还留下了自己的标记——一朵黑色的玫瑰。从此，「黑玫瑰」的名号传遍了地下世界。金币+300，声望+20。"],"rogue_heist_crit")]},
        ok:function(){return[pickV(["你成功偷走了一些财宝，但没有被发现。金币+50，潜行+1。","你完成了盗窃，虽然收获不多。金币+30。"],"rogue_heist_ok")]},
        fail:function(){return[pickV(["你被发现了，不得不空手而逃。HP-10。","你差点被抓住，虽然逃脱了，但什么都没偷到。"],"rogue_heist_fail")]},
        critfail:function(){return[pickV(["你被抓住了！虽然你设法逃脱，但受了重伤，还被通缉了。HP-20，声望-15。","你中了陷阱，被关了起来，花了好几天才逃出来。HP-15，金币-50。"],"rogue_heist_critfail")]}
      },
      effect:{time:3}, go:"job_rogue_turn"},
    {t:"去偷教会的圣物", check:{a:"AGI",sk:"潜行",label:"敏捷·盗窃",target:75},
      tier:{
        crit:function(){return[pickV(["你成功潜入了教会的密室，偷走了一件圣物！教会声望-20，地下世界声望+30，获得：神秘圣物。","你不仅偷走了圣物，还发现了教会的一个大秘密。地下世界声望+40，线索+3。"],"rogue_church_crit")]},
        ok:function(){return[pickV(["你偷走了一些有价值的东西，但没有拿到圣物。金币+80，教会声望-10。","你完成了盗窃，虽然收获不如预期。金币+50。"],"rogue_church_ok")]},
        fail:function(){return[pickV(["教会的守卫太严了，你不得不撤退。HP-5。","你差点被审判骑士抓住。"],"rogue_church_fail")]},
        critfail:function(){return[pickV(["你被审判骑士抓住了！虽然你设法逃脱，但受了重伤，还被教会通缉了。HP-25，教会声望-30。","你中了教会的神圣陷阱，差点死掉。HP-30，SAN-10。"],"rogue_church_critfail")]}
      },
      effect:{time:3}, go:"job_rogue_turn"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_rogue_turn"]={pace:"deep",
  place:"盗贼·转折篇",
  text:["盗贼·转折篇。","那是你在地下世界的第七年。","你揭露了教会的伪善，成了很多人的英雄，也成了更多人的敌人。教会悬赏一万金龙要你的人头，暗蚀会派出了杀手，贵族们雇佣了佣兵。","你不得不东躲西藏。但你没有停止——你继续偷，继续揭露，继续帮助那些需要帮助的人。","那天，你在交汇城的贫民窟，遇到了一个人。","那是一个老人。他穿着破旧的衣服，脸上全是皱纹，眼睛却很亮。他蹲在巷子的角落里，看着你。","「影。」他说，「我等你很久了。」","你警惕地看着他：「你是谁？」","「我是『无面者』。」老人说，他的声音很苍老，但很清晰，「盗贼公会的创始人。三百年前，我创立了盗贼公会。」","你的心跳加速了。无面者——传说中的盗贼之神，三百年前消失了，没有人知道他去了哪里。","「你没有死？」","「死了。」无面者说，他笑了笑，「但又活了。因为我还有未完成的事。」","他站起来，走到你面前。他的身体开始变化——脸在变，身体在变，声音在变。几秒钟后，他变成了你的样子。","「这就是无面者的力量。」他说，用你的声音，「改变容貌，改变身份，变成任何人。」","「盗贼的最高境界，不是偷东西——是偷身份。偷一个人的脸，偷一个人的生活，偷一个人的命运。」","你看着『自己』站在你面前，心里有一种说不出的诡异感。","「你为什么找我？」你问。","「因为你是这一代最有天赋的盗贼。」无面者说，他变回了老人的样子，「我想把无面者的力量传给你。」","「为什么？」","「因为我需要你帮我做一件事。」无面者说，他的表情变得严肃，「一件我三百年前没有完成的事。」","「什么事？」","「偷一样东西。」无面者说，他的声音低了下来，「从黄林晶的坟墓里，偷一样东西。」","你的心跳加速了。黄林晶的坟墓——传说中，黄林晶消失后，他的坟墓成了大陆上最大的秘密。没有人知道它在哪里，也没有人知道里面有什么。","「坟墓在哪里？」你问。","「死亡沙漠。」无面者说，「深渊神殿的下面。」","「里面有什么？」","「真相。」无面者说，「关于七印的真相，关于黄林晶的真相，关于……这个世界的真相。」","你沉默了。你想起了很多事——教会的伪善，暗蚀会的阴谋，守望者的秘密，塞拉芬的话。","「好。」你说，「我帮你。」","无面者点了点头。他伸出手，按在你的脸上。","一股力量涌入你的身体。你感觉到——你的脸在变，你的身体在变，你的声音在变。你能感觉到，你可以变成任何人。","无面者的力量，觉醒了。","「从今天起，你就是新的无面者。」无面者说，他的身体开始变得透明，「我的使命完成了。接下来，就看你了。」","「等等！」你喊道，「你要去哪里？」","「去我该去的地方。」无面者说，他笑了笑，「记住——盗贼的最高境界，不是偷东西。是偷真相。」","他消失了。巷子里只剩下你一个人。","你摸了摸自己的脸——还是原来的样子。但你知道，只要你想，你可以变成任何人。","你拉紧了斗篷，走出了巷子。夜风吹过，带来了远方的气息。","你的道路，从今天起，指向了死亡沙漠，指向了深渊神殿，指向了黄林晶的坟墓。","而你，要去偷一样东西——真相。","你笑了笑，消失在了夜色里。","阴影，是你最好的伙伴。"],pace:"deep",
  options:[
    {t:"寻找贤者之影", effect:{time:1,flag:"seek_sage_shadow"}, go:"job_rogue_legend"},
    {t:"金盆洗手，过平凡生活", effect:{time:1,flag:"rogue_retire"}, go:"job_rogue_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_rogue_legend"] = function(){ return {
  place:"盗贼·传奇篇",
  text:["盗贼·传奇篇。","你站在大宗师的境界上，已经半年了。","半年来，你用无面者的力量，调查了黄林晶坟墓的位置。你变成过教会的牧师，变成过暗蚀会的成员，变成过守望者的执灯人——你偷了无数的身份，偷了无数的秘密。","最后，你找到了——黄林晶的坟墓，确实在死亡沙漠的深渊神殿下面。","你带着无面者的遗愿，来到了死亡沙漠。","沙漠很热，很干。你走了三天三夜，终于看到了深渊神殿——一座黑色的、巨大的建筑，矗立在沙漠的中央，像是一根插在大地上的钉子。","你潜入了神殿。你用暗影避开了守卫，用无面者的力量骗过了陷阱，终于来到了神殿的最深处。","那里有一扇门。门上刻着黄林晶的名字，还有一行字：『凡入此门者，当放弃一切希望。』","你推开门。","门后面是一个巨大的洞穴。洞穴的中央，有一个石棺。石棺上刻着七印的图案，图案在黑暗中泛着暗红色的光。","你走到石棺前，推开了盖子。","石棺里没有尸体。只有一面镜子。","镜子是圆形的，边框是用黄金做的，上面刻着古老的符文。镜面很光滑，能照出你的样子。","你看着镜子里的自己——然后，镜子里的你，动了。","不是跟着你动。是自己动了。","「你终于来了。」镜子里的你说，声音和你一模一样，但带着一种古老的、疲惫的语气。","「你是谁？」你问。","「我是黄林晶。」镜子里的你说，「或者说，是黄林晶残留的意识。」","你的心跳加速了。","「三千年了。」黄林晶说，他的声音里有一丝苦涩，「终于有人找到了这里。」","「真相是什么？」你问，「七印的真相，你的真相。」","黄林晶沉默了一会儿，然后说：「你真想知道？知道了，就再也回不去了。」","「我想知道。」","「好吧。」黄林晶说，「七印不是用来封印深渊的。是用来封印我的。」","「三千年前，我和深渊之主打了一场仗。我输了。为了不让深渊之主毁灭世界，我把它的灵魂吸入了自己的身体。然后，我用七印，把自己封印了起来。」","「我成了深渊之主的容器。七印碎了，我就会苏醒，深渊之主就会降临。」","「守望者知道真相。他们的使命，就是确保七印不被破坏，确保真相不被揭露。」","你站在石棺前，脑子里一片混乱。","「那……有办法阻止吗？」你问。","「有。」黄林晶说，「贤者之影。盗贼的最高成就——用暗影的力量，把深渊之主的灵魂从我的身体里抽出来，封印在镜子里。」","「但这需要付出代价——你的影子，会和深渊之主的灵魂永远绑定在一起。你会成为新的封印。」","你沉默了。你想起了很多人——贫民窟的孤儿，乔瓦尼，无面者，还有那些你帮助过的人。","「我愿意。」你说。","黄林晶点了点头。镜子开始发光——黑色的光，暗影的光。","你伸出手，放在镜子上。暗影从你体内涌出，涌入镜子，包裹住了深渊之主的灵魂。","你感觉到——一股强大的、黑暗的、充满恶意的力量，涌入了你的影子。它在咆哮，在挣扎，在试图吞噬你。","但你没有退缩。你用自己的意志，用暗影的力量，把它封印在了你的影子里。","贤者之影，觉醒了。","你达到了——半神。","镜子的光芒散去了。石棺里，只剩下一面普通的镜子。","你拿起镜子，放进了怀里。然后你走出了洞穴，走出了神殿，走出了死亡沙漠。","沙漠的阳光洒在你身上，温暖而明亮。你的影子在脚下延伸，比以前更长，更暗，但你能控制它。","你站在沙漠的边缘，看着远方。大陆的轮廓在晨光中显现。","你的道路，还没有结束。但现在，你有了足够的力量，去走完它。","「黄林晶。」你说，「我会替你守护这个世界的。」","风吹过沙漠，带来了远方的气息。你朝大陆的方向走去。","你的传奇，才刚刚开始。而阴影，永远与你同在。"],pace:"deep",
  options:[
    {t:"开始寻找贤者之影", check:{a:"AGI",sk:"潜行",label:"敏捷·寻找",target:80},
      tier:{
        crit:function(){return[pickV(["你经过无数次冒险，终于找到了贤者之影！你获得了隐身于因果之外的能力。AGI+5，声望+30，获得：贤者之影。","你不仅找到了贤者之影，还发现了它的真正用法——它可以让你穿越时间。AGI+8，声望+50。"],"rogue_legend_crit")]},
        ok:function(){return[pickV(["你在寻找上取得了一些进展，但还没有找到。AGI+2。","你找到了一些线索，但贤者之影的位置依然是谜。"],"rogue_legend_ok")]},
        fail:function(){return[pickV(["你找了很久，但始终没有线索。","你的寻找遇到了瓶颈。"],"rogue_legend_fail")]},
        critfail:function(){return[pickV(["你在寻找时触发了一个古老的陷阱，受了重伤。HP-25，AGI-2。","你差点死在寻找的过程中，虽然活了下来，但留下了后遗症。HP-30，SAN-10。"],"rogue_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_merchant_intro"] = function(){ return {
  place:"商人·入门篇",
  text:["商人。","你第一次做生意，是用一颗弹珠换了一块面包。","那年你十岁。你在集市上捡到了一颗漂亮的玻璃弹珠——蓝色的，透明的，在阳光下泛着七彩的光。你不知道它值多少钱，但你知道，有人会想要它。","你走到面包房前面，拦住了一个富家小姐。","「小姐，你想要这个吗？」你举起弹珠，让阳光照在上面，折射出七彩的光芒。","富家小姐的眼睛亮了。她是个爱美的女孩，这种漂亮的小玩意儿，她最喜欢了。","「多少钱？」她问。","「不要钱。」你说，「我只要一块面包。」","富家小姐愣了一下，然后笑了。她让仆人买了一块面包，换走了你的弹珠。","你拿着面包，蹲在角落里吃了起来。面包很软，很甜，是你吃过的最好吃的东西。","但你没有满足。你在想——那颗弹珠，你是在垃圾堆里捡到的，一分钱没花。而你用它换了一块面包，值三个铜币。","这就是生意。用没有价值的东西，换有价值的东西。","从那天起，你开始了你的商业生涯。你捡垃圾，换东西，低买高卖，从中赚取差价。","你的天赋很高。你能一眼看出一件东西的价值，能在三句话内说服别人买你的东西，能在别人还没反应过来的时候，就完成一笔交易。","十五岁那年，你用攒下的钱，租了一个小摊位，开始正式做生意。你卖过水果，卖过布料，卖过首饰，卖过魔法材料——什么赚钱卖什么。","二十岁那年，你有了自己的商铺。二十五岁那年，你有了自己的商队。三十岁那年，你的名字在交汇城的商业圈里，已经无人不知。","你站在自己商铺的门口，看着街上人来人往。你的商铺是交汇城最热闹的商铺之一，每天都有无数的客人进进出出。","但你没有满足。你知道，在这个大陆上，最大的生意不是卖东西——是卖信息，卖关系，卖未来。","你想起了美第奇家族。那个曾经掌控大陆经济的家族，在四十年前被教会清洗了。但他们的商业智慧，他们的商业帝国，他们的商业传奇——一直是你崇拜的对象。","「总有一天，」你对自己说，「我会建立一个比美第奇更强大的商业帝国。」","风吹过街道，带来了集市的喧嚣。你吸了口气，走进了商铺。","你的道路，是用金币和智慧铺成的。而你知道，在这条道路的尽头，等待你的，是整个大陆的财富。","或者，是整个大陆的毁灭。"],pace:"deep",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_merchant_awakening"},
    {t:"开始做生意", check:{a:"CHA",sk:"交易",label:"魅力·交易",target:50},
      tier:{
        crit:function(){return[pickV(["你的第一笔生意就大获成功，赚了一大笔钱！金币+50，交易+2。","你不仅赚了钱，还结识了一个重要的商业伙伴。金币+30，声望+5。"],"merchant_trade_crit")]},
        ok:function(){return[pickV(["你完成了第一笔生意，虽然利润不多。金币+20。","你赚到了第一桶金。"],"merchant_trade_ok")]},
        fail:function(){return[pickV(["你的第一笔生意就亏本了。金币-10。","你被人骗了，损失了一些钱。"],"merchant_trade_fail")]},
        critfail:function(){return[pickV(["你被骗光了所有的钱，还欠了债。金币-30，声望-5。","你的生意彻底失败了，还惹上了麻烦。HP-5，金币-20。"],"merchant_trade_critfail")]}
      },
      effect:{time:7}, go:"job_merchant_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_merchant_awakening"]={pace:"deep",
  place:"商人·觉醒回忆",
  text:["商人·觉醒。","那是你经商的第八年。","你接到了一笔大生意——南方商业城邦的一个商会，想要从你这里购买一批炼金术材料，总价十万金龙。","这是你做过的最大的一笔生意。如果你能做成，你的商会就能一跃成为交汇城最大的商会之一。","但问题是——你没有那么多炼金术材料。你的库存只有一半，另一半需要从矮人王国进口。而矮人王国的供应商，最近因为铁门关战事，提高了价格。","如果你按原价卖，你会亏本。如果你提高价格，南方商会可能会取消订单。","你坐在办公室里，看着账本，眉头紧锁。","然后，你想到了一个办法。","你没有从矮人王国进口材料——你从自由城邦的另一个商人那里，用更低的价格买了一批同样的材料。那个商人急需现金，所以愿意低价出售。","然后，你把这批材料，和你自己的库存混在一起，卖给了南方商会。","你赚了两万金龙的差价。","但这还不够。你在想——有没有办法，赚更多？","你注意到，南方商会之所以急着买炼金术材料，是因为他们在和另一个城邦打商业战争。他们需要材料来制造武器，武装自己的佣兵。","你找到了那个和南方商会打仗的城邦，把南方商会的采购计划告诉了他们。作为回报，他们给了你一笔情报费——五万金龙。","然后，你又找到了南方商会，告诉他们，对手已经知道了他们的采购计划，建议他们增加订单，提前备货。南方商会信了，又加了五万金龙的订单。","你两头吃，赚了十二万金龙。","从那天起，你明白了一个道理——最好的生意，不是卖东西。是卖信息。","你开始建立自己的情报网。你在每个城市都安插了眼线，在每个势力都收买了内线。你知道哪个贵族要结婚，哪个商会要破产，哪个国家要打仗。","你用这些信息，做了一笔又一笔的大生意。你的财富飞速增长，你的商会越来越大。","但你也树敌了。很多人恨你——因为你太精明了，精明到让他们觉得害怕。","那天，你在自己的书房里，遇到了一个人。","那是一个穿着华贵衣服的老人。他的头发全白了，脸上的皱纹很深，但眼睛很亮，像是两颗金币。","「你就是那个『两头吃』的商人？」老人问，声音里带着一丝欣赏。","「你是谁？」你问。","「我是洛伦佐·德·美第奇。」老人说，「美第奇家族的最后一任族长。」","你的心跳加速了。美第奇家族——四十年前被教会清洗的传奇商业家族。他们的族长，不是应该已经死了吗？","「我没有死。」洛伦佐说，他笑了笑，「我藏了起来。四十年了，我一直在等一个人——一个能继承美第奇商业智慧的人。」","「你就是那个人。」","他从怀里拿出一本书，递给你。书的封面是黑色的，上面写着四个字：『商道真经』。","「这是美第奇家族三百年的商业智慧。」洛伦佐说，「里面记录了我们所有的商业技巧、商业谋略、商业秘密。」","「读了它，你会成为大陆上最强大的商人。」","你接过书，手在发抖。你翻开第一页，上面写着：「商业的本质，不是买卖。是控制。控制货源，控制价格，控制信息，控制人心。」","你抬起头，想谢谢洛伦佐——但他已经不见了。书房里只剩下你一个人，还有那本《商道真经》。","你握着书，感觉到——一股力量，从书里涌入了你的身体。那不是魔法，不是元素，而是一种更实际的、更强大的力量——商业直觉。","商业直觉觉醒。","从那天起，你的商业能力更上一层楼。你能一眼看出一笔生意的利润，能在三句话内看穿对手的底线，能在别人还没反应过来的时候，就完成一笔大交易。","你站在商铺的顶楼，看着脚下的城市。夜风吹过，带来了集市的喧嚣。","「洛伦佐。」你说，「我不会让你失望的。」","你的道路，从今天起，和美第奇家族的传奇纠缠在了一起。","而金币，是你最好的武器。", "你离了觉醒回忆，脚步声在空旷处格外清晰。赶路要紧。"],pace:"deep",
  options:[
    {t:"加入大商会", effect:{time:1,flag:"merchant_guild"}, go:"job_merchant_growth"},
    {t:"自己单干", effect:{time:1,flag:"merchant_solo"}, go:"job_merchant_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_merchant_growth"] = function(){ return {
  place:"商人·成长篇",
  text:["商人·成长篇。","觉醒商业直觉之后，你的商会发展得更快了。","你用《商道真经》里的技巧，吞并了几个小商会，打垮了几个竞争对手，建立了一个覆盖半个大陆的商业网络。你的名字，在商业圈里成了传奇。","有人叫你『金币之王』，有人叫你『商业巨鳄』，也有人叫你『美第奇再世』。","但你知道，这还不够。你想要的，不只是财富。你想要的是——权力。","在这个大陆上，财富和权力是分不开的。有了财富，你就能影响政治；有了权力，你就能保护财富。","你开始介入政治。你给自由城邦的议员们送钱，给北方公国的贵族们送礼，给教会的牧师们捐香火钱。你用金币，在各大势力之间编织了一张关系网。","你的影响力越来越大。很多议员的选举，需要你的资金支持；很多贵族的债务，需要你来减免；很多牧师的升迁，需要你的推荐信。","你成了大陆上最有影响力的商人——不，是最有影响力的人之一。","但你也遇到了麻烦。","那天，你在自己的书房里，收到了一封信。信上没有署名，只有一行字：『停止你的扩张。否则，后果自负。』","你笑了。你做了这么多年生意，收到过无数次威胁。你从来没有怕过。","但第二天，你的一个商队被劫了。第三天，你的一个商铺被烧了。第四天，你的一个合伙人失踪了。","你知道，这不是普通的威胁。这是有人在警告你——而且，对方有足够的实力。","你开始调查。你用你的情报网，用你的关系网，用你的金币，终于查到了——是暗蚀会。","暗蚀会在控制大陆的地下经济。他们不允许任何人挑战他们的地位。而你的扩张，已经触动了他们的利益。","你坐在书房里，看着暗蚀会的资料，眉头紧锁。","暗蚀会——大陆上最神秘的组织，没有人知道他们的真正目的。有人说他们想解放深渊，有人说他们想推翻现有的秩序。","但你知道，不管他们的目的是什么，他们现在是你的敌人。","你不能退缩。因为你知道，在商业的世界里，退缩就等于死亡。","你拿起笔，写了几封信。一封给自由城邦的议长，一封给北方公国的大公，一封给教会的红衣主教。","你要联合所有的力量，对抗暗蚀会。","这不是生意。这是战争。一场用金币和情报打的战争。","你站在书房的窗前，看着外面的城市。夜色深沉，灯火通明。","「暗蚀会。」你说，「你们想跟我打？好。我奉陪到底。」","你的道路，从今天起，和暗蚀会的阴谋纠缠在了一起。","而金币，是你最好的武器。","你拿起桌上的金币，在手指间翻转。金币在灯光下泛着金色的光芒，像是一轮小太阳。","「等着吧。」你说，「我会用金币，把你们埋了。」"],pace:"deep",
  options:[
    {t:"垄断一种商品", check:{a:"CHA",sk:"交易",label:"魅力·垄断",target:65},
      tier:{
        crit:function(){return[pickV(["你成功垄断了一种商品的贸易，赚了大钱！金币+200，声望+15。","你不仅垄断了商品，还控制了整个商路！金币+400，声望+25。"],"merchant_monopoly_crit")]},
        ok:function(){return[pickV(["你在某种商品的贸易上占据了优势。金币+80。","你取得了一定的市场份额。"],"merchant_monopoly_ok")]},
        fail:function(){return[pickV(["你的垄断计划失败了，损失了一些钱。金币-50。","竞争对手太强了，你不得不放弃。"],"merchant_monopoly_fail")]},
        critfail:function(){return[pickV(["你的垄断计划引发了公愤，被其他商人联合抵制。金币-100，声望-10。","你因为垄断被商会罚款了。金币-150，声望-15。"],"merchant_monopoly_critfail")]}
      },
      effect:{time:15}, go:"job_merchant_turn"},
    {t:"和其他商会竞争", check:{a:"INT",sk:"谋略",label:"智力·商战",target:60},
      tier:{
        crit:function(){return[pickV(["你在商战中击败了竞争对手，吞并了他们的商会！金币+300，声望+20。","你用巧妙的策略，不战而屈人之兵，让竞争对手主动投降。金币+200，声望+15。"],"merchant_war_crit")]},
        ok:function(){return[pickV(["你在商战中取得了一些胜利。金币+100。","你和竞争对手达成了和解，瓜分了市场。金币+80。"],"merchant_war_ok")]},
        fail:function(){return[pickV(["你在商战中失利了，损失了一些钱。金币-80。","竞争对手太强了，你不得不撤退。"],"merchant_war_fail")]},
        critfail:function(){return[pickV(["你在商战中惨败，几乎破产。金币-200，声望-15。","你被竞争对手用不正当手段搞垮了。金币-300，声望-20。"],"merchant_war_critfail")]}
      },
      effect:{time:15}, go:"job_merchant_turn"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_merchant_turn"]={pace:"deep",
  place:"商人·转折篇",
  text:["商人·转折篇。","那是你和暗蚀会对抗的第三年。","三年来，你用金币和情报，和暗蚀会打了一场没有硝烟的战争。你破坏了他们的黑市交易，揭露了他们的洗钱渠道，策反了他们的外围成员。","但你也付出了代价——你的三个商队被劫，两个商铺被烧，一个合伙人被杀。","你知道，这样下去不是办法。你需要找到暗蚀会的弱点，给他们致命一击。","那天，你的情报网传来了一个消息——暗蚀会的财务司长，会在三天后，在交汇城的一个秘密地点，和一个神秘人会面。","你决定亲自去看看。","你变成了一个普通的商人，混进了那个秘密地点——交汇城地下的一个废弃仓库。","仓库里很暗，只有几盏油灯发出微弱的光。你躲在一堆货箱后面，看着仓库的中央。","一个穿黑袍的人站在那里。他的脸上戴着面具，看不清表情。他的手里拿着一个小盒子，盒子上刻着暗蚀会的徽记——一只眼睛，瞳孔是黑色的漩涡。","然后，另一个人走了进来。","你愣住了。","那个人，是亚历山大·金秤。美第奇商会的管事，你认识的人。","「东西带来了吗？」黑袍人问。","「带来了。」亚历山大说，他从怀里拿出一个卷轴，「这是自由城邦议会的秘密文件——关于净化令的真实目的。」","黑袍人接过卷轴，看了一眼，然后点了点头。他把手里的盒子递给亚历山大：「这是你的报酬。十万金龙的票据，还有……暗蚀会的友谊。」","亚历山大接过盒子，笑了笑：「合作愉快。」","然后他们各自离开了。","你躲在货箱后面，心跳如雷。","亚历山大·金秤——美第奇商会的管事，竟然在和暗蚀会做交易？他把自由城邦的秘密文件，卖给了暗蚀会？","你想起了很多事——美第奇家族的清洗，洛伦佐的出现，《商道真经》的传承。这一切，是不是都和暗蚀会有关？","你回到了自己的书房，坐在椅子上，思考了很久。","然后，你做了一个决定。","你要亲自去找亚历山大，问清楚这一切。","第二天，你来到了美第奇商会。亚历山大在他的办公室里，看到你来了，似乎并不意外。","「你都看到了。」他说，不是问句。","「为什么？」你问，「你为什么要和暗蚀会合作？」","亚历山大沉默了一会儿，然后说：「因为美第奇家族的复兴，需要暗蚀会的帮助。」","「四十年前，教会清洗了美第奇家族。我的父亲，我的叔叔，我的哥哥——都死了。只有我，被金秤家族收养，活了下来。」","「我等了四十年，就是为了复兴美第奇家族。而暗蚀会，能帮我做到这一点。」","「你疯了。」你说，「暗蚀会是在利用你。他们不会帮你复兴美第奇——他们只会利用你，然后毁掉你。」","「也许吧。」亚历山大说，他的眼神很复杂，「但我没有别的选择。」","你看着他。这个你曾经欣赏的商人，这个你曾经视为同行的人，现在站在你的对立面。","「你还有选择。」你说，「离开暗蚀会，和我合作。我们一起，复兴美第奇家族。」","亚历山大看着你，沉默了很久。","「你真的愿意帮我？」他问。","「真的。」你说。","亚历山大笑了。那笑容里，有释然，有感激，还有一丝……愧疚。","「好。」他说，「我和你合作。」","从那天起，你和亚历山大结成了同盟。你们一起，对抗暗蚀会，一起调查美第奇家族的真相，一起寻找复兴的道路。","你的道路，从今天起，和美第奇家族的命运纠缠在了一起。","而金币，依然是你最好的武器。","你站在书房的窗前，看着外面的城市。夜风吹过，带来了远方的气息。","「暗蚀会。」你说，「你们的末日，到了。」"],pace:"deep",
  options:[
    {t:"寻找贤者之金", effect:{time:1,flag:"seek_sage_gold"}, go:"job_merchant_legend"},
    {t:"用财富影响政治", effect:{time:1,flag:"merchant_politics"}, go:"job_merchant_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_merchant_legend"] = function(){ return {
  place:"商人·传奇篇",
  text:["商人·传奇篇。","你站在大宗师的境界上，已经一年了。","一年来，你和亚历山大一起，揭露了暗蚀会的经济网络，冻结了他们的资产，策反了他们的财务司成员。暗蚀会的经济实力，被你削弱了大半。","你的名字，已经成了大陆上最有影响力的名字。你控制着大陆上最大的商业网络，影响着八大势力的政治走向，掌握着无数人的命运。","有人叫你『无冕之王』，有人叫你『金币之神』，也有人叫你『大陆的真正主人』。","但你知道，这还不够。","暗蚀会还在。深渊还在逼近。七印还在破碎。","你需要更强的力量——强到能改变这一切的力量。","那天，你在自己的书房里，遇到了一个人。","那是一个穿着金色长袍的老人。他的头发是金色的，眼睛是金色的，连皮肤都泛着淡淡的金色光芒。","「你就是那个『无冕之王』？」老人问，声音里带着一丝欣赏。","「你是谁？」你问。","「我是财富之神。」老人说，「十大神系之一，财富与商业的守护神。」","你的心跳加速了。神——真正的神，出现在了你的书房里。","「我观察你很久了。」财富之神说，「你是我见过的最有天赋的商人。你的商业智慧，你的商业谋略，你的商业勇气——都让我欣赏。」","「所以，我想给你一个机会。」","「什么机会？」","「成为我的神选者。」财富之神说，「继承我的财富神力，成为大陆上最富有的人，最有权力的人。」","「作为交换——你要帮我，传播财富的信仰。让更多的人，信奉财富之神。」","你沉默了。你想起了很多事——你的商业帝国，你的金币，你的权力。你已经拥有了很多。但你还想要更多。","「我愿意。」你说。","财富之神点了点头。他伸出手，按在你的额头上。","一股金色的力量涌入你的身体。你感觉到——你的商业直觉在暴涨，你的财富在暴涨，你的影响力在暴涨。","贤者之金——商人的最高成就，在你的体内成型了。","你达到了——半神。","财富之神收回手，笑了笑：「很好。从今天起，你就是我的神选者。用你的财富，去改变这个世界吧。」","他的身体开始变得透明。","「等等！」你喊道，「深渊的事——你知道吗？」","财富之神停下了，他看着你，眼神复杂：「我知道。但神不能直接干涉世事。这是规则。」","「不过——」他说，嘴角扬了扬，「你可以。你是凡人，你不受规则的约束。用你的财富，去阻止深渊吧。」","「金币，能买到很多东西。包括——希望。」","他消失了。书房里只剩下你一个人，还有浑身散发的金色光芒。","你看着自己的手。金色的光芒在指尖流转，温暖而强大。","你走到窗前，看着外面的城市。夜色深沉，灯火通明。","「金币能买到希望。」你喃喃道。","然后你笑了。","「好。那我就用金币，买下整个大陆的希望。」","你拿起桌上的鹅毛笔，开始写一封信。一封给八大势力的领袖们的信。","你要联合所有的力量，对抗深渊。你要用你的财富，你的影响力，你的商业网络，为这场战争提供后勤，提供情报，提供希望。","你的道路，还没有结束。但现在，你有了足够的力量，去走完它。","风吹过书房，带来了远方的气息。你拿起写好的信，按响了铃铛。","「把这封信，送给八大势力的领袖。」你对仆人说，「另外，通知所有的商队——从今天起，所有的物资，优先供应军队。」","仆人接过信，退了出去。","你站在窗前，看着远方。大陆的轮廓在夜色中若隐若现。","「等着吧。」你说，「我会用金币，拯救这个世界。」","你的传奇，才刚刚开始。而金币，永远与你同在。"],pace:"deep",
  options:[
    {t:"开始寻找贤者之金", check:{a:"CHA",sk:"交易",label:"魅力·寻找",target:80},
      tier:{
        crit:function(){return[pickV(["你经过无数次商业冒险，终于找到了贤者之金！你获得了点石成金的能力。金币+1000，声望+30，获得：贤者之金。","你不仅找到了贤者之金，还发现了它的真正用法——它可以创造财富，也可以毁灭财富。金币+2000，声望+50。"],"merchant_legend_crit")]},
        ok:function(){return[pickV(["你在寻找上取得了一些进展，但还没有找到。金币+200。","你找到了一些线索，但贤者之金的位置依然是谜。"],"merchant_legend_ok")]},
        fail:function(){return[pickV(["你找了很久，但始终没有线索。金币-100。","你的寻找遇到了瓶颈。"],"merchant_legend_fail")]},
        critfail:function(){return[pickV(["你在寻找时被骗了，损失了大量财富。金币-500，声望-10。","你差点破产在寻找的过程中。金币-800，声望-15。"],"merchant_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_alchemist_intro"] = function(){ return {
  place:"炼金术师·入门篇",
  text:["炼金术师。","你第一次接触炼金术，是在一个废弃的实验室里。","那年你十一岁。你是一个孤儿，在交汇城的贫民窟里流浪。那天，你为了躲避一场雨，钻进了一间废弃的房子。","房子里很暗，很潮，到处都是灰尘和蜘蛛网。但你注意到，房子的角落里有一个地下室。","你打开地下室的门，走了下去。","地下室里摆满了各种奇怪的东西——烧瓶、试管、坩埚、天平、还有一些你叫不出名字的仪器。墙上的架子上摆满了瓶瓶罐罐，里面装着各种颜色的液体和粉末。","你走到一张桌子前，桌上有一本打开的书。书页已经泛黄了，但上面的字还能看清——《炼金术入门》。","你翻开书，读了起来。","「炼金术，是理解物质本质的艺术。通过分解、重组、转化，把普通的物质变成珍贵的物质。」","「炼金术的终极目标，是贤者之石——一种能把任何金属变成黄金，能治愈任何疾病，能延长寿命的神奇物质。」","你被吸引住了。你在地下室里待了整整一天，读那本书，做那些简单的实验。","当你终于成功地把一块铜变成了银色的时候，你哭了。","不是因为激动——是因为你知道，你找到了你的道路。","从那天起，你成了那个地下室的常客。你白天在贫民窟里捡垃圾换食物，晚上就回到地下室里研究炼金术。","你的天赋很高。三年后，你已经能做很多复杂的实验了——炼药，锻造，分解，转化。你的炼金术水平，已经超过了很多正规学院的学生。","但你也遇到了麻烦。","那天，你在地下室里做实验的时候，发生了爆炸。烧瓶碎了，有毒的气体充满了整个地下室。你晕了过去。","当你醒来的时候，你发现自己躺在一张床上。一个老人坐在你旁边，正在用一种奇怪的仪器检查你的身体。","「你醒了。」老人说，他的声音很温和，「我是炼金术师公会的会长。你的地下室，是我以前的实验室。」","「你很有天赋。」老人说，他的眼睛里闪着光，「比我见过的任何学生都有天赋。跟我走吧，我教你真正的炼金术。」","你跟他走了。从那天起，你成了炼金术师公会的正式成员，开始系统地学习炼金术。","你学得很快。你的实验总是能成功，你的配方总是比别人的好，你的理论总是比别人的深。","你站在实验室里，看着面前的烧瓶。烧瓶里的液体正在沸腾，冒出金色的烟雾。","「贤者之石。」你喃喃道，「总有一天，我会炼成它。」","你的道路，是用实验和爆炸铺成的。但你知道，在这条道路的尽头，等待你的，是炼金术的终极奥秘——贤者之石。","或者，是比贤者之石更可怕的东西。"],pace:"deep",
  options:[
    {t:"回忆你的觉醒", effect:{time:1}, go:"job_alchemist_awakening"},
    {t:"开始学习炼金术", check:{a:"INT",sk:"炼金术",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["你很快就掌握了炼金术的基本技巧，老师对你刮目相看。炼金术+3，获得：初级药剂×3。","你不仅学会了基本技巧，还意外炼出了一种新药剂！炼金术+4，获得：神秘药剂。"],"alchemist_learn_crit")]},
        ok:function(){return[pickV(["你学会了炼金术的基本技巧。炼金术+1，获得：初级药剂×1。","你完成了基本的学习。"],"alchemist_learn_ok")]},
        fail:function(){return[pickV(["炼金术太难了，你花了很多时间才勉强入门。","你的学习进展缓慢。"],"alchemist_learn_fail")]},
        critfail:function(){return[pickV(["你在实验时发生了爆炸，受了伤。HP-10，金币-20（赔偿）。","你炼出了一种有毒的气体，差点毒死自己。HP-15，SAN-5。"],"alchemist_learn_critfail")]}
      },
      effect:{time:7}, go:"job_alchemist_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_alchemist_awakening"]={pace:"deep",
  place:"炼金术师·觉醒回忆",
  text:["炼金术师·觉醒。","那是你加入炼金术师公会的第五年。","你已经是公会里最出色的年轻炼金术师了。你炼的药，效果比别人的好一倍；你锻造的武器，比别人的锋利一倍；你分解的物质，比别人的纯净一倍。","但你不满足。你想要的，是贤者之石。","你读遍了公会图书馆里所有关于贤者之石的书。你做了无数次实验，失败了无数次。你的实验室里，到处都是爆炸的痕迹和失败的产物。","那天，你在一本古老的手稿里，找到了一个线索。","手稿的作者是一个叫『尼古拉』的炼金术师，生活在两千年前。手稿里写着：「贤者之石的炼成，需要三种材料——灵魂之灰、深渊之血、黄林晶的眼泪。」","你愣住了。灵魂之灰——死者火化后的灰烬。深渊之血——深渊魔物的血液。黄林晶的眼泪——这是什么？","你开始调查。你用了三年时间，走遍了大陆，终于找到了这三种材料。","灵魂之灰——你在一个古战场上找到了。那里曾经发生过一场惨烈的战斗，无数人死去，他们的骨灰被风吹得到处都是。你收集了一小瓶。","深渊之血——你在铁门关的废墟里找到了。第一印破碎后，深渊的气息从那里涌出来，形成了一些深渊魔物。你杀了一只，取了它的血。","黄林晶的眼泪——你在承天山的时光裂隙旁边找到了。那是一颗水晶，透明的，里面有一滴液体。手稿里说，那是黄林晶在加固第六印的时候，流下的眼泪。","你带着三种材料，回到了你的实验室。","你把三种材料放进坩埚里，点燃了火焰。你按照手稿里的配方，一步一步地操作。","坩埚里的物质开始变化——先是变成了黑色，然后变成了红色，然后变成了金色，然后——","爆炸了。","你被冲击波击飞，撞在墙上，吐出了一口血。实验室里一片狼藉，到处都是玻璃碎片和黑色的粉末。","你躺在地上，看着天花板。你失败了。又一次失败了。","然后，你看到了——在坩埚的碎片中间，有一颗小小的、红色的石头。","你爬过去，拿起那颗石头。石头是温暖的，在你的手心里泛着微光。","贤者之石——虽然只有指甲盖大小，虽然只是半成品，但它确实是贤者之石。","你感觉到——一股力量，从石头里涌入了你的身体。那是炼金术的终极力量，是理解物质本质的力量。","物质理解觉醒。","从那天起，你的炼金术更上一层楼。你能看到物质的本质，能理解元素的构成，能创造出前所未有的物质。","但你也发现了一个秘密——贤者之石的炼成，不只是需要材料。还需要……代价。","你在炼成贤者之石的时候，失去了一些东西。你的头发，白了一缕。你的眼睛，变成了淡淡的金色。你的寿命，减少了十年。","「炼金术的本质，是等价交换。」你想起了师父说过的话，「想得到什么，就必须付出同等的代价。」","你握着贤者之石，感受着它的力量。你知道，这只是开始。真正的贤者之石，需要更大的代价。","你站在废墟一样的实验室里，看着手心里的红色石头。","「我会炼成真正的贤者之石的。」你说，「不管付出什么代价。」","你的道路，从今天起，和等价交换的法则纠缠在了一起。","而贤者之石，是你永远的追求。"],pace:"deep",
  options:[
    {t:"拜他为师", effect:{time:1,flag:"alchemist_master"}, go:"job_alchemist_growth"},
    {t:"自己摸索", effect:{time:1,flag:"alchemist_self"}, go:"job_alchemist_growth"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_alchemist_growth"] = function(){ return {
  place:"炼金术师·成长篇",
  text:["炼金术师·成长篇。","觉醒物质理解之后，你的炼金术水平飞速增长。","你炼成了很多前所未有的东西——能治愈任何疾病的万能药，能切割任何金属的炼金剑，能储存魔法的炼金水晶，能让人飞行的炼金羽翼。","你的名字在炼金术师的圈子里传开了。有人叫你『天才炼金术师』，有人叫你『贤者之石的追寻者』，也有人叫你『疯子』——因为你总是在做危险的实验。","但你不满足。你想要的，是真正的贤者之石——完整的、完美的、能改变世界的贤者之石。","你继续研究。你读了更多的古籍，做了更多的实验，付出了更多的代价。你的头发越来越白，你的眼睛越来越金，你的寿命越来越短。","那天，你在守望者的秘密图书馆里，找到了一本禁书——《深渊炼金术》。","书的作者不可考，但你能感觉到，书里蕴含着一种黑暗的、强大的力量。","书里写着：「普通的炼金术，是等价交换。想得到什么，就必须付出同等的代价。但深渊炼金术不同——它能从深渊里汲取力量，用极小的代价，得到极大的成果。」","「深渊炼金术的终极目标，不是贤者之石。而是——深渊之石。一种比贤者之石强大一百倍的物质。」","你合上书，心跳如雷。","深渊炼金术。这是禁忌。教会禁止它，炼金术师公会禁止它，守望者也禁止它。","但你知道，只有深渊炼金术，才能帮你炼成真正的贤者之石。","你犹豫了很久。然后，你把书藏在了怀里，离开了图书馆。","你开始秘密地研究深渊炼金术。你在实验室的地下室里，建了一个秘密的祭坛，按照书里的方法，从深渊里汲取力量。","你的实验越来越成功。你炼成了很多用普通炼金术无法炼成的东西。但你也付出了代价——你的SAN值在下降，你开始做噩梦，你开始看到幻觉。","那天，你在做实验的时候，出了意外。","深渊的力量失控了。黑色的火焰从祭坛里涌出来，吞噬了你的实验室。你被黑色的火焰包围，感觉到——有什么东西，在试图进入你的身体。","「不！」你喊道，「我不会让你控制我的！」","你用你所有的意志力，对抗着那股力量。你的身体在发光——金色的光，是贤者之石的力量。","两股力量在你体内碰撞，爆炸。","当你醒来的时候，你发现自己躺在废墟里。实验室全毁了，但你还活着。","而且，你感觉到——你的力量，比以前更强了。你成功地融合了深渊炼金术和普通炼金术，创造出了一种全新的炼金术。","你站在废墟里，看着自己的手。金色的光芒在指尖流转，黑色的火焰在掌心跳动。","「我做到了。」你说，「我创造了属于自己的炼金术。」","你的道路，从今天起，在光明和黑暗之间行走。","而贤者之石，依然是你永远的追求。","你走出废墟，看着天空。阳光洒在你身上，温暖而明亮。但你的影子，比以前更暗了。","「不管付出什么代价，」你说，「我都会炼成真正的贤者之石。」","风吹过废墟，带来了化学药品的味道。你朝远方走去。","你的传奇，才刚刚开始。"],pace:"deep",
  options:[
    {t:"研究贤者之石", check:{a:"INT",sk:"炼金术",label:"智力·研究",target:70},
      tier:{
        crit:function(){return[pickV(["你在贤者之石的研究上取得了重大突破！炼金术+4，获得：贤者之石碎片。","你不仅取得了突破，还发现了贤者之石的真正本质——它不是物质，而是一种境界。炼金术+6。"],"alchemist_research_crit")]},
        ok:function(){return[pickV(["你在研究上取得了一些进展。炼金术+2。","你学会了一些高级配方。"],"alchemist_research_ok")]},
        fail:function(){return[pickV(["你的研究遇到了瓶颈，迟迟没有进展。","你尝试了很多次，但都失败了。"],"alchemist_research_fail")]},
        critfail:function(){return[pickV(["你的实验发生了大爆炸，实验室都被炸了。HP-20，金币-100（重建）。","你在实验中被有毒气体伤到了，留下了后遗症。HP-15，INT-2。"],"alchemist_research_critfail")]}
      },
      effect:{time:15}, go:"job_alchemist_turn"},
    {t:"去寻找稀有材料", check:{a:"CON",sk:"生存",label:"体质·探索",target:55},
      tier:{
        crit:function(){return[pickV(["你在危险的地方找到了大量稀有材料！炼金术+3，获得：稀有材料×5。","你不仅找到了材料，还发现了一个古代炼金术师的遗迹。炼金术+5，获得：古代配方。"],"alchemist_material_crit")]},
        ok:function(){return[pickV(["你找到了一些稀有材料。炼金术+1，获得：稀有材料×2。","你完成了材料收集任务。"],"alchemist_material_ok")]},
        fail:function(){return[pickV(["你在寻找材料时遇到了危险，不得不撤退。HP-10。","你什么都没找到。"],"alchemist_material_fail")]},
        critfail:function(){return[pickV(["你在寻找材料时受了重伤，还弄丢了已有的材料。HP-20，金币-50。","你差点死在危险的地方。HP-25，SAN-10。"],"alchemist_material_critfail")]}
      },
      effect:{time:15}, go:"job_alchemist_turn"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

N["job_alchemist_turn"]={pace:"deep",
  place:"炼金术师·转折篇",
  text:["炼金术师·转折篇。","那是你研究深渊炼金术的第二年。","你的炼金术越来越强，但你的SAN值越来越低。你开始频繁地做噩梦——梦里有黑色的火焰，有无数的眼睛，有一个声音在呼唤你。","「来深渊吧。」那个声音说，「在这里，你能得到真正的力量。真正的贤者之石。」","你知道，那是深渊之主在呼唤你。你越使用深渊炼金术，和深渊的联系就越深，深渊之主就越能影响你。","你开始犹豫。你不知道，自己是不是应该继续走下去。","那天，你的师父——炼金术师公会的会长——找到了你。","「我知道你在研究深渊炼金术。」师父说，他的表情很严肃，「我劝你停下来。」","「为什么？」你问，「深渊炼金术能让我炼成真正的贤者之石。」","「真正的贤者之石？」师父苦笑了一下，「你知道贤者之石的真正代价吗？」","「什么代价？」","「灵魂。」师父说，他的声音里有一丝痛苦，「炼成真正的贤者之石，需要献祭一个灵魂。一个完整的、鲜活的灵魂。」","「历史上，所有炼成贤者之石的人，都献祭了自己最爱的人的灵魂。」","你愣住了。","「你的师祖——尼古拉，他炼成了贤者之石。但他献祭了他妻子的灵魂。」师父说，「他后来疯了，因为他无法原谅自己。」","「你想变成那样吗？」","你沉默了。你想起了很多事——你的师父，你的朋友，你在贫民窟里认识的那些人。你有想要保护的人。","「那……深渊之石呢？」你问，「深渊之石需要什么代价？」","「深渊之石不需要献祭灵魂。」师父说，「但它需要你把自己的灵魂，献给深渊。」","「炼成深渊之石的人，会变成深渊的傀儡。他们不再是人类，而是深渊的工具。」","你站在实验室里，看着面前的坩埚。坩埚里，黑色的火焰还在跳动。","你想起了那个声音——「来深渊吧。在这里，你能得到真正的力量。」","你想起了师父的话——「你想变成那样吗？」","你吸了口气。","「我不会献祭灵魂。」你说，「也不会把灵魂献给深渊。」","「我会找到第三条路。」","师父看着你，眼中闪过一丝欣慰：「第三条路？你确定？」","「确定。」你说，「普通炼金术需要等价交换，深渊炼金术需要献祭灵魂。但我相信，还有一种炼金术——不需要代价，不需要献祭，只需要……理解。」","「理解世界的本质，理解物质的本质，理解灵魂的本质。当你真正理解了一切，你就能创造一切——不需要付出任何代价。」","师父沉默了很久，然后笑了：「你比我想象的更有天赋。去吧，去找你的第三条路。」","你离开了公会，开始了新的研究。你走遍了大陆，拜访了所有的智者，阅读了所有的古籍。你在寻找——一种不需要代价的炼金术。","你的道路，从今天起，指向了一个前所未有的方向。","而贤者之石，依然是你永远的追求。但这一次，你要用自己的方式去得到它。","你站在山顶上，看着远方。风吹过，带来了远方的气息。","「等着吧。」你说，「我会找到第三条路的。」","你朝山下走去。你的影子在夕阳下拉得很长，但你的眼睛里，有金色的光芒在闪烁。", "转折篇已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"deep",
  options:[
    {t:"寻找贤者之石的配方", effect:{time:1,flag:"seek_philosopher_stone"}, go:"relic_overview"},
    {t:"用炼金术帮助他人", effect:{time:1,karma:10,flag:"alchemist_help"}, go:"job_alchemist_legend"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
}

N["job_alchemist_legend"] = function(){ return {
  place:"炼金术师·传奇篇",
  text:["炼金术师·传奇篇。","你站在大宗师的境界上，已经两年了。","两年来，你走遍了大陆，寻找第三条路。你读了无数的书，做了无数的实验，思考了无数个日夜。","终于，在承天山的时光裂隙旁边，你找到了答案。","那天，你坐在时光裂隙旁边，看着那道巨大的裂缝。裂缝的另一边，是一片混沌——时间的尽头。","你突然明白了。","炼金术的本质，不是等价交换，也不是献祭。而是——理解。","当你真正理解了物质的本质，理解了元素的本质，理解了灵魂的本质，理解了时间的本质——你就能创造一切，不需要付出任何代价。","因为你已经和世界融为一体了。世界就是你，你就是世界。你创造的东西，就是世界本身的一部分。","这就是第三条路——『真我炼金术』。","你闭上眼睛，开始感受。你感受着身边的风，脚下的土，头顶的云，远处的山。你感受着时间的流动，空间的延展，灵魂的呼吸。","然后，你伸出手。","在你的手心里，一颗石头开始成型——红色的，温暖的，散发着金色的光芒。","贤者之石。真正的贤者之石。完整的，完美的，不需要任何代价的贤者之石。","你睁开眼睛，看着手心里的石头。石头在阳光下泛着耀眼的光芒，照亮了整个山顶。","你做到了。你找到了第三条路。你炼成了真正的贤者之石。","贤者之石——炼金术师的最高成就，在你的手中成型了。","你达到了——半神。","就在这时，一个声音从时光裂隙里传了出来。","「你做到了。」那个声音说，古老而疲惫，「三千年了，终于有人做到了。」","你看向时光裂隙。裂缝的另一边，一个人影正在显现——穿着白色的长袍，长发散乱，脸上有一道伤疤。","「黄林晶？」你问。","「是我。」黄林晶说，他的声音里有一丝苦涩，「恭喜你，炼成了真正的贤者之石。」","「你知道吗？三千年前，我也差一点炼成了贤者之石。但我失败了——因为我选择了深渊炼金术。我把灵魂献给了深渊，换来了力量。」","「但你不同。你找到了第三条路。你没有付出任何代价，就炼成了贤者之石。」","「你比我强。」","你看着黄林晶的虚影，心里有一种说不出的感觉。","「七印的真相，我已经知道了。」你说，「你是深渊之主的容器。七印碎了，你就会苏醒。」","黄林晶沉默了一会儿，然后说：「是的。所以，我需要你的帮助。」","「什么帮助？」","「用贤者之石，净化我体内的深渊之主。」黄林晶说，「把深渊之主的灵魂，从我的身体里抽出来，封印在贤者之石里。」","「这样，七印就不需要了。深渊之主会被永远封印在贤者之石里，而我……终于可以安息了。」","你看着手心里的贤者之石。石头还在发光，温暖而强大。","「我愿意。」你说。","你举起贤者之石，对准了时光裂隙。金色的光芒从石头里爆发出来，涌入了裂缝，包裹住了黄林晶的虚影。","你感觉到——一股强大的、黑暗的、充满恶意的力量，从黄林晶的身体里被抽了出来，涌入了贤者之石。","贤者之石在你的手心里颤抖，黑色的纹路开始在红色的表面蔓延。但你用你的力量，用你的意志，用你对世界的理解，把它压制住了。","深渊之主，被封印在了贤者之石里。","黄林晶的虚影变得透明了。他看着你，笑了——那是三千年来，第一次真正的笑容。","「谢谢你。」他说，「终于……可以安息了。」","他消失了。时光裂隙开始愈合，最后变成了一道细小的裂缝，然后完全消失了。","你站在山顶上，手心里握着贤者之石。石头的表面，有黑色的纹路在游动，但被金色的光芒压制着。","你做到了。你拯救了黄林晶，你封印了深渊之主，你拯救了世界。","风吹过山顶，带来了远方的气息。你看着远方，大陆的轮廓在晨光中显现。","你的道路，还没有结束。但现在，你有了足够的力量，去走完它。","「贤者之石。」你说，「你会成为这个世界的守护者。」","你把贤者之石放进怀里，朝山下走去。阳光洒在你身上，温暖而明亮。","你的传奇，才刚刚开始。而炼金术，永远与你同在。", "你与传奇篇作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"deep",
  options:[
    {t:"开始炼制贤者之石", check:{a:"INT",sk:"炼金术",label:"智力·炼制",target:85},
      tier:{
        crit:function(){return[pickV(["你经过无数次实验，终于炼出了贤者之石！你成为了有史以来最伟大的炼金术师。INT+5，声望+50，获得：贤者之石。","你不仅炼出了贤者之石，还发现了它的真正用法——它可以让人永生。INT+8，声望+80。"],"alchemist_legend_crit")]},
        ok:function(){return[pickV(["你在炼制上取得了一些进展，但还没有完全成功。INT+2。","你炼出了贤者之石的半成品，但还差一点。"],"alchemist_legend_ok")]},
        fail:function(){return[pickV(["你尝试了很多次，但始终无法成功。","你的炼制遇到了瓶颈。"],"alchemist_legend_fail")]},
        critfail:function(){return[pickV(["你的炼制发生了灾难性的爆炸，差点死掉。HP-30，INT-3，SAN-15。","你在炼制中被深渊之力侵蚀了，产生了严重的幻觉。HP-25，SAN-30。"],"alchemist_legend_critfail")]}
      },
      effect:{time:30}, go:"job_overview"},
    {t:"离开", effect:{time:0}, go:"job_overview"}
  ]
};}

/* ============================================================
   v16 方向三：关键NPC个人剧情线（部分）
   ============================================================ */

/* /v62inj:chunk-npc/ N["npc_overview"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_mercury_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_mercury_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_mercury_climax"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_mercury_resolution"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_aurelian_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_aurelian_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_aurelian_climax"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_aurelian_resolution"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_alexander_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_alexander_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_alexander_climax"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_alexander_resolution"] 已移入 chunks/v62_npc.js */
/* ============================================================
   v16 方向四：城市深度剧情化
   ============================================================ */

/* ===== 交汇城深度剧情 ===== */
/* /v62inj:chunk-city/ N["city_jiaohui_deep"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_council"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_medici"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_medici_secret"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_tavern"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_bard"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_slum"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_slum_child"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_slum_deep"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_slum_mystery"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_harbor"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_ship"] 已移入 chunks/v62_city.js */
/* ============================================================
   v16 方向五：七印完整剧情章节化
   ============================================================ */

/* /v62inj:chunk-seal/ N["seal_overview"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_1_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_shaman"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_cost"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_outcome"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_queen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_contract"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_outcome"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_forge"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_deep"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_outcome"] 已移入 chunks/v62_seal.js */
/* ============================================================
   v16 方向六：黄林晶神器寻宝线（部分）
   ============================================================ */

/* /v62inj:chunk-relic/ N["relic_overview"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_hourglass"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_hourglass_memory"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_soul_eye"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_soul_eye_mercury"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_soul_eye_memory"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_heart"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_heart_memory"] 已移入 chunks/v62_relic.js */
/* ============================================================
   v16 方向七：暗蚀会任务线（部分）
   ============================================================ */

N["eclipse_intro"] = function( /*v58eng:aifresh:misc*/){ return {
  place:"暗蚀会·秘密据点",
  text:["暗蚀会。","这个名字，在艾尔达大陆上被轻声传颂了三千年。","有人说他们想解放深渊，让黑暗重临大地。有人说他们想推翻现有的秩序，建立一个由强者统治的世界。也有人说，他们只是一群追求禁忌力量的疯子，为了力量不惜出卖灵魂。","但没有人知道他们的真正目的。只有黑袍人偶尔会提起一个人名——腐光，暗蚀会黑教堂的掌灯人，传说里圣辉在他身上烂成了黑光的那位。","因为所有试图调查暗蚀会的人，都消失了。","你站在一个昏暗的地下室里。空气潮湿，墙壁上长满了青苔，角落里有老鼠在窸窸窣窣地跑。地下室的天花板很低，你不得不弯着腰。唯一的光源是一盏油灯，油灯的火苗很小，在风里摇摇晃晃，把你的影子投在墙上，像是一个巨大的怪物。","面前是一个穿黑袍的人。","他的袍子是纯黑色的，没有任何花纹和徽章。他的脸藏在兜帽的阴影里，你看不清他的五官，只能看到下巴——那是一张苍白的、没有血色的下巴，嘴唇很薄，像是用刀刻出来的。","「你想加入暗蚀会？」他说。声音沙哑，像是砂纸在磨铁，又像是从很深的地方传上来的。","他的手从袍子里伸出来。那是一只骨节分明的手，手指很长，指甲修剪得很整齐。但你注意到，他的手背上有一个纹身——一只眼睛，眼睛的瞳孔是黑色的漩涡。","「你知道这意味着什么吗？」","地下室里很安静。油灯的火苗跳了一下，他的影子在墙上晃了晃。你能听到自己的心跳声，还有从墙壁深处传来的、微弱的水滴声。","「意味着你将永远无法回头。」他说，「一旦加入暗蚀会，你的名字就会从这个世界上消失。你不再是某某某的儿子/女儿，不再是某某学院的学生，不再是某某势力的成员。」","「你只是暗蚀会的一枚棋子。」","「一枚随时可以被牺牲的棋子。」","他向前走了一步。油灯的光照到了他的脸——你终于看清了。那是一张很普通的脸，普通到你看过之后就会忘记。但他的眼睛不普通。他的眼睛是纯黑色的，没有眼白，没有瞳孔，只是两团深不见底的黑暗。","「当然，」他的嘴角一翘，露出一个没有温度的笑容，「作为回报，你会得到力量。超越凡人的力量。你会看到普通人看不到的东西，做到普通人做不到的事。」","「你会成为……超越者。」","他伸出手，掌心向上。掌心里有一个黑色的徽章，徽章上刻着那只眼睛——瞳孔是黑色的漩涡。","「那么，」他说，声音低了下来，像是在诱惑，又像是在威胁，「你的回答是？」","油灯的火苗又跳了一下。地下室里的温度降了几度。你看着那枚黑色的徽章，心里有一种说不清的感觉——像是恐惧，又像是渴望。","你知道，一旦接过那枚徽章，你的人生就会彻底改变。","但你也知道，有些真相，只有站在黑暗里才能看到。", "秘密据点的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"deep",
  options:[
    {t:"「我知道。我要加入。」", effect:{time:1,flag:"eclipse_join"}, go:"eclipse_rank_outer"},
    {t:"「我只是来了解一下。」", check:{a:"CHA",sk:"口才",label:"魅力·掩饰",target:60},
      tier:{
        crit:function(){return[pickV(["你巧妙地掩饰了自己的真实目的，黑袍人没有怀疑你。他给你讲了一些暗蚀会的基本情况。暗蚀会线索+2。","你的演技很好，黑袍人以为你是一个潜在的新成员，告诉了你不少内部消息。暗蚀会线索+2。"],"eclipse_investigate_crit")]},
        ok:function(){return[pickV(["黑袍人将信将疑地跟你说了一些暗蚀会的情况，但关键信息他没有透露。暗蚀会线索+1。","你了解了一些暗蚀会的基本运作方式。知识+1。"],"eclipse_investigate_ok")]},
        fail:function(){return[pickV(["黑袍人看穿了你的掩饰，冷冷地说：「不想加入就滚。」","黑袍人没有理会你，转身走了。"],"eclipse_investigate_fail")]},
        critfail:function(){return[pickV(["你的掩饰太拙劣了，黑袍人以为你是守望者的探子，叫人把你抓了起来。HP-10，SAN-5。","你引起了暗蚀会的警惕，他们开始跟踪你。声望-5，SAN-3。"],"eclipse_investigate_critfail")]}
      },
      effect:{time:1}, go:"fc_jiaohui_entry"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}

N["eclipse_rank_outer"] = function(){ return {
  place:"暗蚀会·外围据点",
  text:["「很好。」黑袍人说，「从今天起，你就是暗蚀会的外围成员了。」","「外围成员的任务很简单：传递消息、收集情报、做一些杂务。」","「做得好，就能晋升为正式成员。」","他递给你一个黑色的徽章：「这是你的身份凭证。不要弄丢了，也不要让外人看到。」","「你的第一个任务：去交汇城的码头，和一个穿红鞋的女人接头。」","「她会告诉你具体要做什么。」", "你与外围据点作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal",
  options:[
    {t:"接受任务，去码头接头", check:{a:"AGI",sk:"潜行",label:"敏捷·接头",target:55},
      tier:{
        crit:function(){return[pickV(["你准时到达码头，找到了穿红鞋的女人。她交给你一个包裹，贴着耳朵说了一句：「送到贫民窟的老教堂。」任务完成，暗蚀会声望+5。","你巧妙地避开了可能的跟踪，顺利完成了接头。女人对你很满意，额外给了你一些报酬。金币+10，暗蚀会声望+8。"],"eclipse_mission1_crit")]},
        ok:function(){return[pickV(["你完成了接头任务，虽然过程有些波折。暗蚀会声望+3。","你把包裹送到了指定地点，完成了任务。暗蚀会声望+3。"],"eclipse_mission1_ok")]},
        fail:function(){return[pickV(["你在接头时出了差错，女人没有出现。你不得不空手而归。暗蚀会声望-2。","你被人跟踪了，不得不放弃任务。暗蚀会声望-3。"],"eclipse_mission1_fail")]},
        critfail:function(){return[pickV(["你被城卫发现了，虽然你逃脱了，但暗蚀会认为你不可靠。暗蚀会声望-10，HP-5。","你在接头时中了埋伏，被人打了一顿，包裹也被抢走了。HP-15，暗蚀会声望-15。"],"eclipse_mission1_critfail")]}
      },
      effect:{time:1}, go:"eclipse_rank_member"},
    {t:"打开包裹看看", check:{a:"INT",sk:"调查",label:"智力·检查",target:50},
      tier:{
        crit:function(){return[pickV(["你小心翼翼地打开包裹，里面是一封信和一瓶奇怪的药水。信上写着一些暗蚀会的内部暗号。你记住了这些信息，然后重新封好包裹。暗蚀会线索+2。","你检查了包裹，发现里面的药水是一种深渊提取物。你偷偷留了一点样本，然后重新封好。暗蚀会线索+2，获得：深渊提取物样本。"],"eclipse_peek_crit")]},
        ok:function(){return[pickV(["你看了一眼包裹里的东西，然后重新封好。虽然不知道具体是什么，但你有了一些猜测。暗蚀会线索+1。","你检查了包裹，了解了一些暗蚀会的运作方式。知识+1。"],"eclipse_peek_ok")]},
        fail:function(){return[pickV(["你打不开包裹的封印，什么都没看到。","你尝试打开包裹，但触发了一个警报。你不得不赶紧离开。"],"eclipse_peek_fail")]},
        critfail:function(){return[pickV(["包裹里有陷阱！你被里面的毒针刺伤了。HP-10，SAN-3。","你打开包裹时触发了一个追踪法术，暗蚀会知道你偷看了。暗蚀会声望-10。"],"eclipse_peek_critfail")]}
      },
      effect:{time:1}, go:"eclipse_rank_member"},
    {t:"拒绝任务，离开", effect:{time:1,flag:"eclipse_left"}, go:"fc_jiaohui_entry"}
  ]
};}

N["eclipse_rank_member"]={
  place:"暗蚀会·正式成员据点",
  text:["你完成了几个任务，终于晋升为暗蚀会的正式成员。","正式成员可以接触到更多的秘密，也可以选择加入不同的部门。","黑袍人——现在你知道他叫「影」——告诉你暗蚀会有五个部门：","情报司、行动司、研究司、人事司、财务司。","「每个部门负责不同的工作。」他说，「你想加入哪个？」"],pace:"light",
  options:[
    {t:"加入情报司", effect:{time:1,flag:"eclipse_intel"}, go:"eclipse_intel_mission"},
    {t:"加入行动司", effect:{time:1,flag:"eclipse_action"}, go:"eclipse_action_mission"},
    {t:"加入研究司", effect:{time:1,flag:"eclipse_research"}, go:"eclipse_research_mission"},
    {t:"暂时不选择，先做普通任务", effect:{time:1}, go:"eclipse_general_mission"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
}

N["eclipse_intel_mission"] = function(){ return {
  place:"暗蚀会·情报司据点",
  text:["情报司。","暗蚀会的眼睛和耳朵，负责渗透、间谍、密码、双面间谍。","情报司的司长是一个戴面具的女人，大家都叫她「蛛后」。","「欢迎加入情报司。」她的声音很轻，但你能感觉到其中的危险，「你的第一个任务：渗透艾尔达魔法学院，收集墨丘利教授的情报。」","「他是守望者的前执灯人，我们需要知道他在研究什么。」","「你能做到吗？」", "情报司据点在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"normal",
  options:[
    {t:"接受任务", check:{a:"CHA",sk:"伪装",label:"魅力·渗透",target:65},
      tier:{
        crit:function(){return[pickV(["你成功渗透进了学院，接近了墨丘利。你收集到了一些重要情报，包括他在研究的一个秘密项目。暗蚀会声望+10，墨丘利好感-5（如果被发现）。","你不仅完成了任务，还发现了墨丘利和守望者之间的秘密联系。这是重大情报！暗蚀会声望+15，线索+3。"],"intel_mission_crit")]},
        ok:function(){return[pickV(["你完成了基本的渗透任务，收集到了一些情报。暗蚀会声望+5。","你在学院里待了几天，收集了一些基本情报。暗蚀会声望+3。"],"intel_mission_ok")]},
        fail:function(){return[pickV(["你的渗透被发现了，你不得不赶紧撤退。暗蚀会声望-3。","你没能接近墨丘利，什么情报都没收集到。"],"intel_mission_fail")]},
        critfail:function(){return[pickV(["你被墨丘利识破了，他没有揭穿你，但对你说了一句：「回去告诉影，别再来了。」你吓得赶紧跑了。暗蚀会声望-10，SAN-5。","你暴露了身份，被学院的人追了好几条街。HP-10，暗蚀会声望-15。"],"intel_mission_critfail")]}
      },
      effect:{time:3}, fail:"failpath_intel_1",go:"eclipse_rank_member"},
    {t:"「这个任务太危险了，我能不能换一个？」", effect:{time:1,暗蚀会_rep:-3}, go:"eclipse_rank_member"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}

N["eclipse_action_mission"] = function(){ return {
  place:"暗蚀会·行动司据点",
  text:["行动司。","暗蚀会的利刃，负责暗杀、破坏、绑架、武装行动。","行动司的司长是一个浑身伤疤的壮汉，大家叫他「屠夫」。","「欢迎加入行动司。」他的声音像磨刀一样刺耳，「你的第一个任务：去北方公国联盟，暗杀一个正在调查暗蚀会的官员。」","「做得干净点，不要留下痕迹。」","「能做到吗？」", "行动司据点的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"light",
  options:[
    {t:"接受任务", check:{a:"AGI",sk:"潜行",label:"敏捷·暗杀",target:70},
      tier:{
        crit:function(){return[pickV(["你潜入了官员的住所，干净利落地完成了任务。没有留下任何痕迹。暗蚀会声望+15，但你的手上沾了血。业力-20，SAN-5。","你完成了任务，但在最后一刻，你发现那个官员是个好人。你犹豫了，但最终还是完成了任务。暗蚀会声望+10，业力-15，SAN-10。"],"action_mission_crit")]},
        ok:function(){return[pickV(["你完成了任务，虽然过程有些波折。暗蚀会声望+8，业力-10。","你制造了一场意外，让官员的死看起来像是事故。暗蚀会声望+5，业力-8。"],"action_mission_ok")]},
        fail:function(){return[pickV(["你没能完成暗杀，官员发现了你的企图，你不得不逃跑。暗蚀会声望-5。","你在最后一刻犹豫了，没有下手。暗蚀会声望-10。"],"action_mission_fail")]},
        critfail:function(){return[pickV(["你被抓住了！虽然你设法逃脱，但受了重伤，而且暗蚀会认为你不可靠。HP-20，暗蚀会声望-20，业力+5（你没有下手）。","你杀错了人！你杀了官员的保镖，而不是官员本人。暗蚀会声望-25，业力-25，SAN-15。"],"action_mission_critfail")]}
      },
      effect:{time:3}, fail:"failpath_action_1",go:"eclipse_rank_member"},
    {t:"「我不做暗杀的事。」", effect:{time:1,暗蚀会_rep:-5,karma:10}, go:"eclipse_rank_member"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}

N["eclipse_research_mission"] = function(){ return {tag:"branch",
  place:"暗蚀会·研究司据点",
  text:["研究司。","暗蚀会的大脑，负责深渊魔法、邪神仪式、禁忌实验。","研究司的司长是一个看起来很斯文的中年人，大家叫他「博士」。","「欢迎加入研究司。」他推了推眼镜，「你的第一个任务：帮我完成一个深渊召唤仪式。」","「别担心，只是小规模的。」他笑了笑，「不会出什么问题的。」","实验室里，你看到了一些可怕的东西——浸泡在罐子里的器官，写满符文的墙壁，还有……一个正在蠕动的黑影。", "你离了研究司据点，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
  options:[
    {t:"帮忙完成仪式", check:{a:"SPR",sk:"深渊魔法",label:"灵性·仪式",target:65},
      tier:{
        crit:function(){return[pickV(["你协助博士完成了仪式，一个小型深渊生物被召唤了出来。博士对你很满意。暗蚀会声望+10，SAN-10，获得：深渊魔法知识。","你在仪式中发现了一些门道，甚至改进了博士的仪式。博士对你刮目相看，让你参与更高级的研究。暗蚀会声望+15，SAN-15，知识+3。"],"research_mission_crit")]},
        ok:function(){return[pickV(["你完成了基本的协助工作，仪式成功了。暗蚀会声望+5，SAN-5。","你帮忙准备了仪式材料，虽然没有参与核心部分。暗蚀会声望+3。"],"research_mission_ok")]},
        fail:function(){return[pickV(["你在仪式中出了差错，召唤失败了。博士很不高兴。暗蚀会声望-3。","你无法适应深渊的气息，在仪式中晕了过去。"],"research_mission_fail")]},
        critfail:function(){return[pickV(["仪式失控了！深渊生物暴走，你被它攻击了。HP-20，SAN-20，暗蚀会声望-10。","你被深渊的力量侵蚀了，产生了严重的幻觉。HP-15，SAN-25。"],"research_mission_critfail")]}
      },
      effect:{time:2}, go:"eclipse_rank_member"},
    {t:"「这些实验太危险了，我不想参与。」", effect:{time:1,暗蚀会_rep:-5,sanRecovery:5}, go:"eclipse_rank_member"},
    {t:"偷偷破坏仪式", check:{a:"INT",sk:"炼金术",label:"智力·破坏",target:70},
      tier:{
        crit:function(){return[pickV(["你偷偷调整了仪式的符文，让仪式失败了，但看起来像是意外。博士没有怀疑你。暗蚀会声望-2（任务失败），业力+10，SAN+3。","你在仪式材料里加了一些东西，让召唤出的深渊生物直接消散了。博士以为是自己的计算错误。业力+15，SAN+5。"],"research_sabotage_crit")]},
        ok:function(){return[pickV(["你做了一些小手脚，仪式的效果大打折扣。博士虽然不满意，但没有怀疑你。业力+5。","你偷偷记录了仪式的细节，准备以后用来对抗暗蚀会。线索+2。"],"research_sabotage_ok")]},
        fail:function(){return[pickV(["你的破坏被博士发现了，他冷冷地看着你：「你不是我们的人。」暗蚀会声望-15，你不得不赶紧逃跑。","你试图破坏，但什么都没改变。仪式照常进行了。"],"research_sabotage_fail")]},
        critfail:function(){return[pickV(["你的破坏引发了爆炸！你受了重伤，博士也发现了你的企图。HP-25，暗蚀会声望-25，你被暗蚀会追杀了。","你被深渊之力反噬了，差点死掉。HP-30，SAN-20。"],"research_sabotage_critfail")]}
      },
      effect:{time:2}, go:"fc_jiaohui_entry"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}

N["eclipse_general_mission"] = function(){ return {
  place:"暗蚀会·据点",
  text:["「不选部门也行。」影说，「你可以先做一些普通任务，了解一下暗蚀会的运作。」","「普通任务包括：传递消息、运送货物、收集情报、招募新人。」","「虽然不如部门任务有前途，但胜在安全。」","他递给你一张任务清单：「自己挑一个吧。」", "你离了据点，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",
  options:[
    {t:"传递消息任务", effect:{time:1,暗蚀会_rep:3,gold:10}, go:"eclipse_rank_member"},
    {t:"运送货物任务", effect:{time:2,暗蚀会_rep:5,gold:20}, go:"eclipse_rank_member"},
    {t:"招募新人任务", check:{a:"CHA",sk:"口才",label:"魅力·招募",target:55},
      tier:{
        crit:function(){return[pickV(["你成功招募了一个有天赋的年轻人加入暗蚀会。影对你很满意。暗蚀会声望+10，金币+30。","你不仅招募了新人，还发现了一个潜力很高的目标。影特别表扬了你。暗蚀会声望+15，金币+50。"],"recruit_crit")]},
        ok:function(){return[pickV(["你找到了一个愿意加入的人。暗蚀会声望+5，金币+15。","你完成了招募任务，虽然新人的资质一般。暗蚀会声望+3，金币+10。"],"recruit_ok")]},
        fail:function(){return[pickV(["你没能招募到任何人。","你找的人都不愿意加入暗蚀会。"],"recruit_fail")]},
        critfail:function(){return[pickV(["你招募的人是守望者的卧底！暗蚀会声望-20，你被影严厉批评了。","你在招募时暴露了暗蚀会的秘密，被城卫盯上了。声望-5，暗蚀会声望-10。"],"recruit_critfail")]}
      },
      effect:{time:2}, go:"eclipse_rank_member"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


/* ============================================================
   v16 方向八：学院线完整剧情化
   ============================================================ */

/* /v62inj:chunk-academy/ N["academy_year1_opening"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_explore"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_dorm"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_main"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_event"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_end"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_purge_intro"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_main"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_event"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_end"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_main"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_event"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_end"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_main"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_event"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_end"] 已移入 chunks/v62_academy.js */
// ============================================================
// v37 学院线连续化 - 11名同学个人故事线
// ============================================================

// ========== 同学1：塞西莉亚·星辰（学院首席·魔法师） ==========



/* /v62inj:chunk-npc/ N["classmate_cecilia_research"] 已移入 chunks/v62_npc.js */
// ========== 同学2：马库斯·铁壁（北方公国·战士） ==========



// ========== 同学3：亚历山大·美第奇（南方商业城邦·术士） ==========



// ========== 同学4：艾琳娜·风语（精灵·猎人） ==========

/* /v62inj:chunk-npc/ N["classmate_elena_intro"] 已移入 chunks/v62_npc.js */
// ========== 同学5：索林·铁锤（矮人·锻造师） ==========



// ========== 同学6：格罗玛什·战吼（兽人·战士） ==========

/* /v62inj:chunk-npc/ N["classmate_grommash_intro"] 已移入 chunks/v62_npc.js */
// ========== 同学7：莉莉丝·暗影（人类·盗贼） ==========



// ========== 同学8：薇薇安·圣光（人类·牧师） ==========

/* /v62inj:chunk-npc/ N["classmate_vivian_intro"] 已移入 chunks/v62_npc.js */
// ========== 同学9：亚瑟·王者（人类·战士） ==========

/* /v62inj:chunk-npc/ N["classmate_arthur_intro"] 已移入 chunks/v62_npc.js */
// ========== 同学10：神秘人·X（隐藏角色） ==========

/* /v62inj:chunk-npc/ N["classmate_mysterious_intro"] 已移入 chunks/v62_npc.js */
// ========== 同学11：墨丘利·星辰（教授·守望者） ==========



// ============================================================
// v37 大陆线扩充 - 8大城市故事
// ============================================================

// ========== 城市1：交汇城（自由城邦） ==========

/* /v62inj:chunk-city/ N["city_jiaohui_intro"] 已移入 chunks/v62_city.js */
// ========== 城市2：铁门关（北方公国） ==========

/* /v62inj:chunk-city/ N["city_tiemenguan_intro"] 已移入 chunks/v62_city.js */
// ========== 城市3：南方港城（南方商业城邦） ==========

/* /v62inj:chunk-city/ N["city_nanfang_intro"] 已移入 chunks/v62_city.js */
// ========== 城市4：圣城（光明教会） ==========



// ========== 城市5：银叶城（精灵王国） ==========

/* /v62inj:chunk-city/ N["city_yinye_intro"] 已移入 chunks/v62_city.js */
// ========== 城市6：铁峰堡（矮人王国） ==========

/* /v62inj:chunk-city/ N["city_tiefeng_intro"] 已移入 chunks/v62_city.js */
// ========== 城市7：承天城（东部王国） ==========

/* /v62inj:chunk-city/ N["city_chengtian_intro"] 已移入 chunks/v62_city.js */
// ========== 城市8：绿洲城（沙漠边境） ==========



// ============================================================
// v37 大陆线扩充 - 7段旅行路线
// ============================================================

// ========== 路线1：交汇城→铁门关（北方路线） ==========

N["travel_north_day1"]=function(){return{tag:"branch",
place:"北方平原 · 旅途中",
text:["你站在交汇城的北门外，看着远处的北方平原。", "清晨的风从北方吹来，带着青草和泥土的味道，也带着一丝说不清的凉意。天空很高，云被风推着走，在草地上投下大片移动的影子，明暗交替，像大地在呼吸。", "你背着行囊，踏上了前往铁门关的旅程。这是一段漫长的旅程，需要走七天七夜。", "第一天，你走在北方平原上。草原上的路是车辙压出来的，两道深深的车印，一直延伸到天际线。路边的草有一人多高，风一吹，像绿色的海浪，此起彼伏。", "你走了大半个上午，太阳升到头顶的时候，草原上忽然热闹起来——远远的，一群牛羊慢悠悠地横穿小路，牧人骑着马在后面赶，看见你，扬了扬鞭子算是打招呼。", "「喂，」一个声音在你身后响起，「你也是去铁门关的？」", "你转过头，看到了一个中年男人。他穿着一身皮甲，皮甲上沾着灰，手里拿着一根长矛，脸上有一道从眉骨划到下巴的旧伤疤。他的身后，跟着十几辆大车，车上的货用油布盖着，捆得结结实实。", "「我叫老张，是这个商队的队长。」中年男人说，「我们也是去铁门关的。要不要一起走？路上有个照应。」", "你看着老张，心里涌起了一股警惕。在旅途中，没有人会无缘无故地对你好。这个老张，肯定有什么目的。", "不过，你也知道，在旅途中，有一个同伴，比什么都重要。特别是在北方平原，这里虽然看起来平静，但实际上隐藏着很多危险——强盗，野兽，还有……深渊生物。", "你想起离开前，酒馆里那个醉醺醺的老兵说过的话：草原上那些草，有时候会无风自动。那不是风。", "「那就麻烦张队长了。」你说。", "老张大笑起来，拍了拍你的肩膀，力道大得让你一个趔趄。", "「好说，好说。」他说，「走吧，天黑前要赶到前面的驿站，不然夜里草原上可不太平。」", "你跟着老张的商队，继续向北走去。车轮吱呀吱呀地转，草浪在风里翻滚，你的影子被正午的太阳压得很短，贴在脚边，像个沉默的同伴。", "从今天起，你将在这片广袤的草原上，经历七天七夜的旅途。"],pace:"normal" /*v45inj:travel_north_day1*/,
options:[
{t:"跟着商队一起走", go:"travel_north_day2", effect:{flags:["north_caravan"]}},
{t:"自己一个人走", go:"travel_north_day2_solo", effect:{flags:["north_solo"]}},
{t:"先在草原上转转，看看风景", go:"travel_north_explore", effect:{flags:["north_explore"]}}
]}};

// ========== 路线2：交汇城→南方港城（南方路线） ==========

N["travel_south_day1"]=function(){return{tag:"branch",
place:"南方森林 · 旅途中",
text:[
"你站在交汇城的南门外，看着远处的南方森林。",
"南方森林是一片茂密的原始森林，树木高大，枝叶繁茂，遮天蔽日。森林里有各种各样的动植物，有美丽的蝴蝶，有可爱的小鹿，有凶猛的老虎，还有……一些你叫不出名字的神秘生物。",
"你背着行囊，踏上了前往南方港城的旅程。这是一段漫长的旅程，需要走五天五夜。",
"第一天，你走在南方森林里，看着周围的风景。阳光透过树叶的缝隙洒下来，在地上投下了斑驳的光影。空气中弥漫着花香和树叶的清香，还有一丝说不清的魔法气息。",
"「喂，」一个声音在你身后响起，「你也是去南方港城的？」",
"你转过头，看到了一个年轻的女人。她穿着一身绿色的猎人装，手里拿着一把弓，背上背着一壶箭。她的脸上带着一丝精明的笑容，看起来像是一个猎人。",
"「是的。」你说。",
"「我叫小丽，是这片森林的猎人。」年轻女人说，「我也是去南方港城的。要不要一起走？路上有个照应。」",
"你看着小丽，心里涌起了一股警惕。在旅途中，没有人会无缘无故地对你好。这个小丽，肯定有什么目的。",
"不过，你也知道，在南方森林里，有一个熟悉地形的猎人做同伴，比什么都重要。特别是在这片原始森林里，这里虽然看起来美丽，但实际上隐藏着很多危险——强盗，野兽，还有……一些神秘的生物。",
"「那就麻烦小丽了。」你说。",
"小丽笑了笑，然后说：「好说，好说。走吧，我们一起走。路上我给你讲讲南方森林的故事。」",
"你跟着小丽，继续向南走去。",
"从今天起，你将在这片茂密的森林里，经历五天五夜的旅途。"
],pace:"normal",
options:[
{t:"跟着猎人一起走", go:"travel_south_day2", effect:{flags:["south_hunter"]}},
{t:"自己一个人走", go:"travel_south_day2_solo", effect:{flags:["south_solo"]}},
{t:"先在森林里转转，看看风景", go:"travel_south_explore", effect:{flags:["south_explore"]}}
]}};

// ========== 路线3：交汇城→圣城（西方路线） ==========

N["travel_west_day1"]=function(){return{
place:"西方丘陵 · 旅途中",
text:[
"你站在交汇城的西门外，看着远处的西方丘陵。",
"西方丘陵是一片起伏的丘陵，山上种满了葡萄和橄榄，是大陆著名的葡萄酒产地。天空很蓝，云很白，风很轻，吹在脸上，带着一丝葡萄酒的香味。",
"你背着行囊，踏上了前往圣城的旅程。这是一段漫长的旅程，需要走六天六夜。",
"第一天，你走在西方丘陵上，看着周围的风景。丘陵上有一个个葡萄园，有采摘葡萄的农民，有酿酒的酒庄。空气中弥漫着葡萄和葡萄酒的味道，那是西方丘陵特有的味道。",
"「喂，」一个声音在你身后响起，「你也是去圣城的？」",
"你转过头，看到了一个年轻的牧师。他穿着一身白色的牧师袍，手里拿着一本圣经，脸上带着温和的笑容。他的身后，跟着几个朝圣者，看起来像是一个朝圣团。",
"「是的。」你说。",
"「我叫约翰，是这个朝圣团的领队。」年轻牧师说，「我们也是去圣城的。要不要一起走？路上有个照应。」",
"你看着约翰，心里涌起了一股警惕。在旅途中，没有人会无缘无故地对你好。这个约翰，肯定有什么目的。",
"不过，你也知道，在去圣城的路上，有一个朝圣团做同伴，比什么都重要。特别是在西方丘陵，这里虽然看起来平静，但实际上隐藏着很多危险——强盗，野兽，还有……一些异端分子。",
"「那就麻烦约翰牧师了。」你说。",
"约翰笑了笑，然后说：「好说，好说。走吧，我们一起走。路上我给你讲讲光明神的故事。」",
"你跟着约翰的朝圣团，继续向西走去。",
"从今天起，你将在这片美丽的丘陵上，经历六天六夜的旅途。"
],pace:"normal",
options:[
{t:"跟着朝圣团一起走", go:"travel_west_day2", effect:{flags:["west_pilgrimage"]}},
{t:"自己一个人走", go:"travel_west_day2_solo", effect:{flags:["west_solo"]}},
{t:"先在丘陵上转转，看看风景", go:"travel_west_explore", effect:{flags:["west_explore"]}}
]}};

// ========== 路线4：交汇城→银叶城（精灵路线） ==========

N["travel_elf_day1"]=function(){return{
place:"古老森林 · 旅途中",
text:[
"你站在交汇城的西北门外，看着远处的古老森林。",
"古老森林是一片神秘的原始森林，据说它已经存在了上万年。树木高大，枝叶繁茂，遮天蔽日。森林里有各种各样的神秘生物，有精灵，有树妖，有独角兽，还有……一些你叫不出名字的古老存在。",
"你背着行囊，踏上了前往银叶城的旅程。这是一段漫长的旅程，需要走八天八夜。",
"第一天，你走在古老森林里，看着周围的风景。阳光透过树叶的缝隙洒下来，在地上投下了斑驳的光影。空气中弥漫着花香和树叶的清香，还有一丝说不清的古老魔法气息。",
"「喂，」一个声音在你身后响起，「你也是去银叶城的？」",
"你转过头，看到了一个精灵。她有一头绿色的长发，像春天的嫩叶一样。她的眼睛是淡金色的，像阳光透过树叶洒下的光斑。她的耳朵尖尖的，是精灵特有的标志。她穿着一身用树叶和藤蔓编织的衣服，轻盈而美丽。",
"「是的。」你说。",
"「我叫艾露恩，是银叶城的守卫。」精灵说，「我也是回银叶城的。要不要一起走？路上有个照应。」",
"你看着艾露恩，心里涌起了一股惊讶。你没有想到，会在这里遇到一个精灵。",
"不过，你也知道，在古老森林里，有一个精灵做同伴，比什么都重要。特别是在这片神秘的森林里，这里虽然看起来美丽，但实际上隐藏着很多危险——强盗，野兽，还有……一些古老的存在。",
"「那就麻烦艾露恩了。」你说。",
"艾露恩笑了笑，然后说：「好说，好说。走吧，我们一起走。路上我给你讲讲古老森林的故事。」",
"你跟着艾露恩，继续向西北走去。",
"从今天起，你将在这片神秘的森林里，经历八天八夜的旅途。"
],pace:"normal",
options:[
{t:"跟着精灵一起走", go:"travel_elf_day2", effect:{flags:["elf_guide"]}},
{t:"自己一个人走", go:"travel_elf_day2_solo", effect:{flags:["elf_solo"]}},
{t:"先在森林里转转，看看风景", go:"travel_elf_explore", effect:{flags:["elf_explore"]}}
]}};

// ========== 路线5：交汇城→铁峰堡（矮人路线） ==========

N["travel_dwarf_day1"]=function(){return{
place:"北方山脉 · 旅途中",
text:[
"你站在交汇城的北门外，看着远处的北方山脉。",
"北方山脉是一片巍峨的山脉，山峰高耸入云，山上覆盖着皑皑白雪。山脉里有各种各样的矿藏，有金矿，有银矿，有铁矿，还有……一些你叫不出名字的神秘矿物。",
"你背着行囊，踏上了前往铁峰堡的旅程。这是一段漫长的旅程，需要走九天九夜。",
"第一天，你走在北方山脉的山脚下，看着周围的风景。山峰高耸入云，山上覆盖着皑皑白雪。空气中弥漫着矿石和煤炭的味道，还有一丝说不清的地下气息。",
"「喂，」一个声音在你身后响起，「你也是去铁峰堡的？」",
"你转过头，看到了一个矮人。他只有一米四高，但体重却有两百斤。他的胳膊比你的腿还粗，肌肉像铁块一样隆起。他的胡子是红色的，编成了两条粗辫子，垂在胸前。他的手里拿着一把比他还高的铁锤，正在上下打量着你。",
"「是的。」你说。",
"「我叫铜须，是铁峰堡的锻造师。」矮人说，「我也是回铁峰堡的。要不要一起走？路上有个照应。」",
"你看着铜须，心里涌起了一股惊讶。你没有想到，会在这里遇到一个矮人。",
"不过，你也知道，在北方山脉里，有一个矮人做同伴，比什么都重要。特别是在这片巍峨的山脉里，这里虽然看起来壮观，但实际上隐藏着很多危险——强盗，野兽，还有……一些地下的生物。",
"「那就麻烦铜须了。」你说。",
"铜须大笑起来，笑声像打雷。",
"「好说，好说。」他说，「走吧，我们一起走。路上我给你讲讲北方山脉的故事。」",
"你跟着铜须，继续向北走去。",
"从今天起，你将在这片巍峨的山脉里，经历九天九夜的旅途。"
],pace:"normal",
options:[
{t:"跟着矮人一起走", go:"travel_dwarf_day2", effect:{flags:["dwarf_guide"]}},
{t:"自己一个人走", go:"travel_dwarf_day2_solo", effect:{flags:["dwarf_solo"]}},
{t:"先在山脉里转转，看看风景", go:"travel_dwarf_explore", effect:{flags:["dwarf_explore"]}}
]}};

// ========== 路线6：交汇城→承天城（东方路线） ==========

N["travel_east_day1"]=function(){return{
place:"东部平原 · 旅途中",
text:[
"你站在交汇城的东门外，看着远处的东部平原。",
"东部平原是一片广袤的平原，一望无际，稻田连绵。天空很蓝，云很白，风很轻，吹在脸上，带着一丝稻花的香味。",
"你背着行囊，踏上了前往承天城的旅程。这是一段漫长的旅程，需要走七天七夜。",
"第一天，你走在东部平原上，看着周围的风景。平原上有一片片稻田，有插秧的农民，有灌溉的水渠。空气中弥漫着稻花和泥土的味道，那是东部平原特有的味道。",
"「喂，」一个声音在你身后响起，「你也是去承天城的？」",
"你转过头，看到了一个中年男人。他穿着一身青色的长袍，手里拿着一把折扇，脸上带着一丝精明的笑容。他的身后，跟着几个书生，看起来像是一个游学团。",
"「是的。」你说。",
"「我叫李秀才，是这个游学团的领队。」中年男人说，「我们也是去承天城的。要不要一起走？路上有个照应。」",
"你看着李秀才，心里涌起了一股警惕。在旅途中，没有人会无缘无故地对你好。这个李秀才，肯定有什么目的。",
"不过，你也知道，在去承天城的路上，有一个游学团做同伴，比什么都重要。特别是在东部平原，这里虽然看起来平静，但实际上隐藏着很多危险——强盗，野兽，还有……一些神秘的存在。",
"「那就麻烦李秀才了。」你说。",
"李秀才笑了笑，然后说：「好说，好说。走吧，我们一起走。路上我给你讲讲东部平原的故事。」",
"你跟着李秀才的游学团，继续向东走去。",
"从今天起，你将在这片广袤的平原上，经历七天七夜的旅途。"
],pace:"normal",
options:[
{t:"跟着游学团一起走", go:"travel_east_day2", effect:{flags:["east_study"]}},
{t:"自己一个人走", go:"travel_east_day2_solo", effect:{flags:["east_solo"]}},
{t:"先在平原上转转，看看风景", go:"travel_east_explore", effect:{flags:["east_explore"]}}
]}};

// ========== 路线7：交汇城→绿洲城（沙漠路线） ==========

N["travel_desert_day1"]=function(){return{
place:"沙漠边缘 · 旅途中",
text:[
"你站在交汇城的西南门外，看着远处的沙漠。",
"沙漠是一片广袤的黄沙，一望无际，沙丘连绵。天空很蓝，云很白，太阳很毒，照在身上，像火一样烤人。",
"你背着行囊，踏上了前往绿洲城的旅程。这是一段漫长的旅程，需要走十天十夜。",
"第一天，你走在沙漠的边缘，看着周围的风景。沙丘连绵，黄沙漫天。空气中弥漫着沙子和热浪的味道，那是沙漠特有的味道。",
"「喂，」一个声音在你身后响起，「你也是去绿洲城的？」",
"你转过头，看到了一个中年女人。她穿着一身彩色的长袍，头上戴着头巾，脸上带着一丝热情的笑容。她的身后，跟着几头骆驼和几个骆驼夫，看起来像是一个商队。",
"「是的。」你说。",
"「我叫胖婶，是这个商队的队长。」中年女人说，「我们也是去绿洲城的。要不要一起走？路上有个照应。」",
"你看着胖婶，心里涌起了一股警惕。在旅途中，没有人会无缘无故地对你好。这个胖婶，肯定有什么目的。",
"不过，你也知道，在沙漠里，有一个商队做同伴，比什么都重要。特别是在这片广袤的沙漠里，这里虽然看起来壮观，但实际上隐藏着很多危险——强盗，野兽，沙暴，还有……一些神秘的存在。",
"「那就麻烦胖婶了。」你说。",
"胖婶大笑起来，笑声像打雷。",
"「好说，好说。」她说，「走吧，我们一起走。路上我给你讲讲沙漠的故事。」",
"你跟着胖婶的商队，继续向西南走去。",
"从今天起，你将在这片广袤的沙漠里，经历十天十夜的旅途。"
],pace:"normal",
options:[
{t:"跟着商队一起走", go:"travel_desert_day2", effect:{flags:["desert_caravan"]}},
{t:"自己一个人走", go:"travel_desert_day2_solo", effect:{flags:["desert_solo"]}},
{t:"先在沙漠边缘转转，看看风景", go:"travel_desert_explore", effect:{flags:["desert_explore"]}}
]}};

// ============================================================
// v38 P1/P2死链批量自动修复：占位节点
// ============================================================

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

/* /v62inj:chunk-academy/ N["academy_main"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-seal/ N["seal2_act1_alone"] 已移入 chunks/v62_seal.js */
N["slow_travel_"]=function(){return{
place:"旅途·慢行",
text:["你选择了慢行。不赶路，不追逐，只是沿着大路，一步一步地走。", "慢下来的好处是，你终于看见了那些匆匆赶路时错过的风景——路边的野花在风里点头，一只獾从草丛里探出头，看了看你，又缩了回去；老农在田埂上歇脚，远远地朝你挥了挥手。", "你也在路边的小店里停下来，买了碗热汤，和店主聊了几句。店主说，今年的收成不错，就是粮价涨了些，「听说北边又不太平了」。他叹了口气，又笑着说，「不过，日子嘛，总得过。」", "你喝完汤，继续上路。夕阳把你的影子拉得很长。慢行的路上，你忽然觉得，这世界很大，也很小——大到你永远走不完，小到一碗热汤，就能让你觉得安稳。", "你选择了慢行。你不赶路，你让自己，慢慢地走。", "你发现，走得慢的时候，看得多。你会注意到，路边野花，什么时候开的；你会注意到，云，什么时候，从山那边飘过来。", "你在一座桥上，站了很久。桥下的水，流得很慢。你看着水，忽然想，这条河，已经这样，流了多少年了。", "你继续走。你走得慢，但你不觉得，是浪费时间。你只是觉得，有些路，值得，慢慢地走。", "你到达目的地的时候，比预计，晚了两天。但你一点也不后悔。你在想，那两天，你看到的风景，比你赶路那几天，加起来的，还要多。"],pace:"normal" /*v45inj:slow_travel_*/,
options:[
{t:"继续慢行", go:"world_continue"},
{t:"返回学院", go:"pol_hub"}
]
}};

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

/* /v62inj:chunk-academy/ N["academy_event_outcome"] 已移入 chunks/v62_academy.js */
N["title_screen"]=function(){return{
place:"启程",
text:["夜色将尽，晨光未明。你站在旅途的起点，行囊已备好，方向已定——剩下的，就是迈出那一步。", "这一路，你也许会遇见英雄与恶徒，会走进繁华与废墟，会在某个岔路口，做出改变一生的选择。", "但无论如何，故事是从这一步开始的。", "你抬起头，看向远方。天边，第一缕光正撕开夜幕——那是你的路，正在亮起来。", "『艾尔达大陆 · 群雄割据』", "古老的封印，在时间的深处，松动。七枚印记，散落于大陆的各个角落。", "人类的三大学院，鼎立而起；精灵、矮人、兽人，各有传承；乡村学院里，也藏着，不为人知的天才。", "而你——你从哪里来，要去哪里，会成为谁，都还没有定论。", "世界的帷幕，正徐徐拉开。你的故事，从这里，开始。"],pace:"normal" /*v45inj:title_screen*/,
options:[
{t:"开始旅程", go:"fc_jiaohui_entry"},
{t:"回顾行囊", go:"quest_hub"}
]
}};

/* /v62inj:chunk-seal/ N["seal2_act1_survivor"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_rescue"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_mine"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act4_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_dock_watch"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_rest"] 已移入 chunks/v62_seal.js */
N["primordial_hunger_choice"]=function(){return{
place:"原初·饥饿的低语",
text:["你独自站在夜色里，忽然听见那个声音——从很远的地方传来，又像是贴着你的耳根：「我……饿了。」", "那声音很低，很轻，却让你整个人僵住了。你环顾四周，没有人，没有风，什么都没有。但那声音还在，像一根细线，缠着你的心脏。", "你想起了那些传说：关于七个原初之物，关于它们如何蛰伏在大地的伤口里，等待被唤醒。你一直以为那些只是传说。", "你吸了口气，压下心头的悸动。那声音还在耳边盘旋，像一条饥饿的蛇。你握紧拳头，告诉自己：不管那是什么，它不该被喂饱。", "你面对了一个选择——一个，关于「原初之物」的选择。", "摆在你面前的，有两样东西。一样，能让你变强；另一样，能让你，保持清醒。你只能，选一样。", "你站在那里，看着那两样东西。你的手，伸向第一样，又停住。你缩回手，看着第二样。", "你想了很久。你想起，你这一路，见过的人，做过的事。你想起了，那些，因为「强」，而忘记了「自己」的人。", "你最终，选了第二样。你把它，握在手里。你感觉到，它很轻。但你知道，这个选择，很重。"],pace:"normal" /*v45inj:primordial_hunger_choice*/,
options:[
{t:"凝神对抗低语", go:"quest_hub"},
{t:"快步离开此地", go:"world_continue"}
]
}};

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

;

/* /v62inj:chunk-academy/ N["academy_exam_chengtian"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exam_holy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_silver_leaf"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_forge_peak"] 已移入 chunks/v62_academy.js */
N["watchers_offer"]=function(){return{
place:"守望者·邀约",
text:["你收到一封没有署名的信。信纸是深灰色的，字迹工整得像刻出来的一样，只在末尾画着一只睁开的眼睛——那是守望者的印记。", "信上只有一句话：「大陆需要更多看得清的人。若你有意，子时，北城门外的老榆树下，有人等你。」", "你放下信，盯着那只眼睛看了很久。守望者——这个在大陆上若隐若现的组织，有人说他们是预言者，有人说他们是多管闲事的疯子。但他们的眼睛，确实总是出现在大事发生之前。", "你收好信。去不去，你还没有决定。但你知道，这只眼睛已经记住了你的名字。", "守望者的人，找到了你。找到你的方式，很安静——你回到住处，他已经，坐在你的屋里了。", "你吓了一跳。他坐在那里，像一个，已经等了你很久的人：「别慌。」他说，「我来，是想给你一个选择。」", "他开出的条件，很优厚。他给出的理由，也很充分。你听着，没有打断。他说完，看着你：「怎么样？」", "你问他，为什么选你。他想了想：「因为，你看见了，别人没看见的东西。」他顿了顿，「这种眼睛，很贵。」", "你坐在他对面，想了很久。你最后，没有立刻答应。你说：「让我想想。」他点了点头，站起来：「想好了，你知道，去哪里找我。」他走出门，像一阵风，消失在了夜色里。"],pace:"normal" /*v45inj:watchers_offer*/,
options:[
{t:"赴约", go:"quest_hub"},
{t:"烧掉信，当作没看见", go:"act_rest"}
]
}};

/* /v62inj:chunk-academy/ N["academy_clubs"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_explore"] 已移入 chunks/v62_academy.js */
N["vacation_home"]=function(){return{
place:"假期·归家",
text:["假期到了，你收拾行囊，踏上了回家的路。一路上，风景从学院的青翠渐渐变回你熟悉的模样——村口的歪脖子树、路边的水井、还有那家总是飘着炊烟的小饭馆。", "推开家门时，母亲正在灶台前忙活，听见动静回头，愣了一瞬，然后眼眶就红了：「瘦了。学院里没吃好吧？」", "你笑了笑，把行囊放下，从里面掏出给家里人带的东西——一包学院的茶点，一卷画着学院景色的画，还有给弟弟妹妹的糖果。", "晚饭时，一家人围坐在一起，你讲学院的事，讲那些你见过的世面和交过的朋友。母亲听得入神，不时往你碗里夹菜。", "这一晚，你睡在自己从小睡到大的床上，枕头散发着阳光晒过的味道。你忽然觉得，走了再远，这里永远是能让心落下来的地方。", "假期里，你回了趟家。回家的路，你走了好几天。", "你到家的时候，天已经黑了。你站在门口，没有立刻敲门。你听见屋里，有你熟悉的声音——他们在说话，说的，都是些琐碎的事。", "你敲了门。门开了。他们看见你，愣了一下，然后，笑了。你也笑了。你发现，他们鬓角，多了几根白发。", "你住了一个假期。你陪他们，说了很多话。你走的时候，他们送你到村口。你走出去很远，回头，他们还站在那里，朝你挥手。", "你转回身，继续走。你的鼻子，有点酸。你抬起头，看了一会儿天，把眼泪，憋了回去。你告诉自己，下次，还要常回来。"],pace:"normal" /*v45inj:vacation_home*/,
options:[
{t:"好好休息几天", go:"act_rest"},
{t:"去找儿时的伙伴", go:"quest_hub"}
]
}};

N["vacation_research"]=function(){return{
place:"假期·研学",
text:["你放弃了回家的机会，留在学院里研究。假期里的图书馆格外安静，阳光从高窗斜斜照下来，光柱里的尘埃像一群金色的飞虫。", "你选了靠窗的位置，把一摞古籍摊开。管理员阿姨已经认识你了，每天来给你续一次茶，偶尔提醒你：「孩子，歇会儿，眼睛还要用几十年呢。」", "你在古籍里找到几处前人留下的批注，字迹潦草，像是匆忙写下的——有一条批注提到「第七印与月相的关联」，下面画了个问号。你盯着那个问号看了很久，仿佛能看见那个批注的人，也曾在这样的午后，为这个问题皱眉。", "假期结束时，你攒了厚厚一本笔记。学问这东西，急不来，但也不等人——你庆幸自己，把假期花在了这里。", "你用一个假期，做了一项小研究。研究不大，但你是真的，想做。", "你每天，都去图书馆，查同一个方向的资料。管理员都认识你了，看见你，会提前，把你要的那几本书，放在桌上。", "你查了一个多月，整理出厚厚一沓笔记。你看着那些笔记，觉得，收获比你想的多——但问题，也比你想的多。", "假期快结束的时候，你把笔记，分门别类，装订好。你在第一页，写了一个问题。你在问题下面，写了几个字：「待查。」", "你合上笔记。你看着窗外，天正慢慢黑下来。你忽然觉得，这个假期，没有白过。", "研学的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:vacation_research*/,
options:[
{t:"整理研究成果", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["vacation_travel"]=function(){return{
place:"假期·远行",
text:["假期，你背上行囊，踏上了一段说走就走的远行。没有目的地，只有方向——你朝着太阳升起的方向，一直走。", "你走过小镇、穿过田野、翻过矮山。在一个不知名的村庄里，你帮一个老农修好了水车，他留你吃了一顿粗茶淡饭；在一条河边，你遇到一个钓鱼的老头，他说他钓了三十年鱼，一条都没钓上来过，「但河边坐坐，什么烦心事都没了」。", "你把这些人和话都记在心里。旅途的意义，有时候不在终点，而在这些路边的、细碎的人和事。", "假期结束，你回到学院时，晒黑了一圈，行囊里多了一块老农塞给你的风干腊肉和一段河边捡的圆石头。室友笑你：「出去一趟，带回一堆破烂。」你也笑：「都是宝贝。」", "假期里，你出去走了一趟。没有目的，就是，想走走。", "你沿着一条河，走了几天。你路过村子，路过集市，路过麦田。你在一个村子，帮人修了一天的屋顶，人家管了你两顿饭。", "你在集市上，买了一双新鞋。你蹲下来，试鞋的时候，卖鞋的老汉说：「小兄弟，走远路，鞋要合脚。」你问他，怎么知道你要走远路。他说：「看你鞋底的磨痕，就知道。」", "你穿着新鞋，继续走。你走累了，就坐在路边，看着天。你忽然发现，你已经很久，没有这样，只是坐着，看天了。", "假期结束，你回到学院。你脱下那双新鞋，才发现，它已经磨薄了一层。你把它收好。你在想，明年的假期，你还要，出去走一趟。"],pace:"normal" /*v45inj:vacation_travel*/,
options:[
{t:"整理旅途见闻", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["vacation_work"]=function(){return{
place:"假期·做工",
text:["假期里，你找了份零工——在码头上扛货。工钱不高，但管饭，而且能锻炼筋骨。第一天干完，你浑身酸痛，连胳膊都抬不起来。", "工头是个黑脸大汉，看了你一眼，扔过来一瓶药酒：「擦上。明天接着干，三天就习惯了。」你擦上药酒，火辣辣的，但第二天确实好了些。", "你在码头上认识了不少人：有逃跑的贵族、有落魄的诗人、有攒钱想买条船的水手。他们每个人都有故事，每个故事都比书上的精彩。", "假期结束时，你攒了一笔钱，也晒成了和码头工人一样的肤色。你摸着口袋里那些铜板——每一枚都是实实在在的汗换来的，花起来，格外踏实。", "假期里，你找了份活干。活不轻松，但挣得实在。", "你在码头，扛了半个暑期的货。第一天，你的肩膀，磨破了皮。你咬着牙，没有歇。后来，你习惯了。你的肩膀，也厚了。", "码头的工头，是个粗嗓门的汉子。他一开始，嫌你瘦。后来，看你干活实在，他开始，多分你一些活——也，多给你一些钱。", "有一次，收工的时候，他递给你一壶水：「小子，干得不错。」他说，「假期完了，还来不？」你想了想，说：「来。」他笑了：「行。我记着你了。」", "假期结束，你收拾行李，回学院。你路过码头，工头正忙，远远地，朝你挥了挥手。你也挥了挥手。你走远了，还听见他在身后喊：「下回，还来啊！」", "别过做工，你沿官道走出里许，回头已看不清来处。"],pace:"normal" /*v45inj:vacation_work*/,
options:[
{t:"继续做工攒钱", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["vacation_friends"]=function(){return{
place:"假期·会友",
text:["假期里，你约了几个朋友聚了聚。酒馆的角落里，你们点了一桌子的菜，聊到半夜。", "有人讲他假期里的奇遇，有人吐槽家里的琐事，有人闷头喝酒，有人趴在桌上睡着了，被大家笑着摇醒。你看着这些熟悉的脸，忽然觉得，在学院里最珍贵的东西，除了学问，就是这些人了。", "「毕业以后，我们还会像这样聚吗？」有人问。酒桌上安静了一瞬，然后有人笑着说：「肯定会啊。到时候轮着请客，谁混得好谁多请。」", "大家笑着碰杯。你把这顿饭的味道记在心里——是麦酒、烤肉、还有朋友说话时的热乎气。有些日子，过了就不会再有，但记着，就是存着。", "假期里，你见了几个老朋友。他们有的，继续读书；有的，已经工作了。", "你们约在一间旧茶馆。坐下来的第一句话，是有人问：「你怎么瘦了？」你笑了笑，说：「扛货扛的。」他们笑起来。", "你听着他们说各自的近况。有人抱怨，有人吹牛，有人叹气。你听着，没有插话。你觉得，能坐在这里，听他们说这些，挺好的。", "散场的时候，有人拍着你的肩说：「下次，带上你那位啊。」你愣了一下，才反应过来，他说的是什么。你摇了摇头，笑了笑：「再说吧。」", "你走回家，路上，风凉凉的。你忽然想，朋友这种东西，大概就是这样——你不常想起他们，但一见面，就都回来了。", "会友的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal" /*v45inj:vacation_friends*/,
options:[
{t:"与朋友道别", go:"quest_hub"},
{t:"回学院", go:"pol_hub"}
]
}};

/* /v62inj:chunk-academy/ N["academy_election"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_vacation_y2"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_mentor"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_tournament"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_missing_report"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_eclipse_join"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_eclipse_exploit"] 已移入 chunks/v62_academy.js */
N["watchers_reveal"]=function(){return{
place:"守望者·揭面",
text:[
"那个总在远处看着你的人，终于现身了。他站在你面前，摘下了兜帽——是个面容普通的男人，普通到你见过他三次，都没记住他的长相。",
"「你比我想象的，更早注意到我。」他说，声音平淡，没有歉意，也没有解释，「守望者不轻易暴露身份。但有些事，你该知道了。」",
"他告诉你：你调查的线索，指向的黑暗比你想的更深；而守望者，已经观察你很久了——不是因为怀疑你，而是因为，你能看见别人看不见的东西。",
"「我们不是你的盟友，也不是你的敌人。」他重新戴上兜帽，「我们只是站在一边，看着。但如果你需要帮助——」他顿了顿，「你会知道怎么找我们。」",
"他转身走进人群，很快就消失了，像一滴水融进河里。你站在原地，过了很久才想起来，自己甚至忘了问他的名字。", "从揭面出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[
{t:"记下守望者的话", go:"quest_hub"},
{t:"继续自己的调查", go:"quest_hub"}
]
}};

N["post_academy_faction"]=function(){return{
place:"毕业·入世",
text:["毕业后的你，选择了投身势力。你走进那座组织的大门时，心里清楚：这条路没有退路。", "入职第一天，管事的人没有给你安排任何重要任务，只让你从抄写文书做起。你坐了一整天冷板凳，看着人来人往，听着各种消息在耳边流动。", "你发现，势力里最值钱的东西，不是金银，是消息。谁和谁有旧怨，谁欠谁人情，哪条线能走通——这些都写在那些看似枯燥的文书里。", "你认认真真地抄完了那摞文书。字迹工整，无一错漏。管事的人翻看时，眼里闪过一丝赞许：「不错。明天开始，跟着老周跑外勤。」", "你应了一声。门，已经推开了一条缝。", "毕业之后，你加入了一个势力。选择它，你权衡了很久。", "你考虑过很多：它的立场，它的手段，它在这片大陆上的位置。你想了很久，最终，还是选了它。", "你报到那天，负责接待你的人，把你领进了一间屋子。屋里，坐着几个人。他们打量着你，像打量一件货物。", "其中一个人开口：「说说看——你，能给我们带来什么。」你站在那里，把自己会的东西，一样一样，说了。他们听着，没有打断。", "你说完，屋里安静了一会儿。那个人点了点头：「行。留下吧。」他顿了顿，「记住——从今天起，你做的每一件事，都代表我们。」"],pace:"normal" /*v45inj:post_academy_faction*/,
options:[
{t:"开始外勤工作", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["post_academy_teacher"]=function(){return{
place:"毕业·任教",
text:["你回到学院，成了一名教员。站在讲台上的第一天，你看着台下那些年轻的脸，忽然想起自己当年坐在这里的样子。", "你讲的第一课，没有讲高深的理论，只讲了一个故事——你年轻时的一次失败。你讲得很平静，台下却很安静。", "「我讲这个，不是让你们记住失败有多丢人，」你合上教案，「是让你们记住：失败之后，还能站起来，往前走。这才是修行真正的意义。」", "下课后，一个学生追出来问你：「老师，如果一直站不起来呢？」你看了他一会儿，说：「那就先趴着歇会儿。歇够了，再站。」", "那个学生笑了。你看着他的背影，忽然觉得，当老师这件事，也许比你想象的有意思。", "你成了一名教师。这个结果，连你自己，都有些意外。", "你第一次站上讲台的时候，下面坐着一排年轻的脸。他们看着你，眼神里，有好奇，有紧张，也有不以为然。", "你开口，讲了你准备的第一课。你讲得很慢，讲几句，停一下，看看他们。你讲完的时候，有人举手，问了一个问题——一个，你准备了很久的问题。", "你回答了他。他点点头，在本子上，记了下来。你看着他记笔记的样子，忽然想起，很多年前，你自己，也是这样。", "你走下讲台的时候，一个学生追出来：「老师。」你回头。他问：「你为什么要当老师？」你想了想，说：「因为，」你说，「我欠一个人，一堂课。」"],pace:"normal" /*v45inj:post_academy_teacher*/,
options:[
{t:"继续授课", go:"quest_hub"},
{t:"批改作业", go:"act_rest"}
]
}};

N["post_academy_research"]=function(){return{
place:"毕业·研学",
text:["毕业后，你选择了留在学术的领域。你租下一间安静的屋子，把收集多年的古籍和笔记摊开，开始一项长期的研究。", "研究的内容，是你这些年旅行中积攒的疑问：七印的封印术，为什么在不同地区会呈现不同的形态？你翻遍手头的资料，发现前人的记载各执一词，相互矛盾。", "你花了一个月的时间，把那些矛盾整理成表。然后你发现，那些差异并非错误——它们对应着七印各自不同的「性格」。", "你把这一发现写进论文的草稿，又花了三个月反复推敲。窗外换了三个季节，你的稿纸堆了半人高。", "定稿那天，你站在窗前，看着夕阳把天空染成一片金红。你想起那些在路上遇到的、曾给你线索的人——这篇论文，是写给他们的。", "你后来，做起了研究。研究的方向，是你还在学院的时候，就感兴趣的。", "你租了一间小屋子，堆满了书。你每天，从早到晚，泡在里面。有时候，你一抬头，天已经黑了；有时候，你一抬头，天又亮了。", "你研究的那个题目，没有人做过。你查了很多资料，很多地方，都查不到。你只能，一点一点，自己摸索。", "有一次，你研究到深夜，累得趴在桌上。你迷迷糊糊，想起一句话——你老师说过的话：「坐得住的人，学得了真东西。」你睁开眼，又坐起来，继续翻书。", "你后来，写完了那篇研究。它没有引起什么轰动。但你把它，工工整整地，抄了一份，收在箱底。你知道，这是你的，一枚印记。", "你离了研学，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:post_academy_research*/,
options:[
{t:"发表研究成果", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["prologue_apprentice"]=function(){return{
place:"序章·学徒",
text:["你在出身地的一家铺子里，当过一阵子学徒。师傅的手艺很好，脾气也大，教东西全靠骂——骂完了，再手把手教你一遍。", "「记住了，」师傅把一块料子拍在你面前，「活儿不是给人看的，是给日子用的。你糊弄它，它就糊弄你。」", "你在铺子里学了不少东西：怎么挑料子，怎么看火候，怎么在别人看不见的地方下功夫。这些手艺，后来都用上了——只是用的地方，和师傅想的不太一样。", "离开那天，师傅没有送你，只在门口扔下一句话：「走了就别回头。回头，就不像样了。」你走出很远，还是忍不住回了一次头——铺子的门已经关上了，但灯还亮着。", "你当了一段时间的学徒。那段日子，你现在想起来，还是觉得很远。", "你的师父，是个话少的人。他教你的时候，说得最多的一句是：「看。」你看着，他做。你看不懂，他也不解释。等你做错了，他才开口。", "你学得很慢。你打坏过东西，弄砸过活。师父没有骂过你。他只是，让你把弄坏的东西，自己，重新做出来。", "你后来，做出了一件，像样的东西。你拿去给师父看。他接过来，翻来覆去，看了很久。他说：「还行。」他顿了顿，「下次，做快一点。」", "你到现在，还留着那件东西。它不贵重。但每次看到它，你都会想起，那个话少的人，说的那句「还行」。"],pace:"normal" /*v45inj:prologue_apprentice*/,
options:[
{t:"记下师傅的话", go:"quest_hub"},
{t:"继续旅程", go:"world_continue"}
]
}};

N["facility_classroom"]=function(){return{
place:"学院·教室",
text:["教室里的座位总是差不多的格局：前排坐着一心向学的，后排坐着打瞌睡的，中间是犹豫不决的。你找了个靠窗的位置坐下，窗外的光刚好落在书页上。", "教授夹着讲义走进来，把门带上，教室里瞬间安静下来。他扫视一圈，视线在你身上顿了顿——他认得你，你总在课后问些刁钻的问题。", "「今天我们讲封印术的历史。」他转身在黑板上写下课题，粉笔灰簌簌落下，「有人会问，学这个有什么用？——答案很简单：等你用上的那天，就晚了。」", "你在笔记本上记下这句话，笔尖划过纸面，发出沙沙的声响。窗外有鸟飞过，你抬头看了一眼，又低头继续听课。", "你走进教室的时候，里面已经坐了一半人。你找了个靠后的位子，坐下。", "窗外的树，正绿着。风吹进来，带着树叶的气味。前面的学生，有的在翻书，有的在打瞌睡，有的在聊天。", "教授走进来，教室里安静了一下。他没有点名，直接在黑板上，写了一行字：「今日，讲因果。」", "他放下粉笔，转过身：「你们有没有想过——你们今天坐在这里，是因为，很久以前，有人做了一件，和你们无关的事。」", "教室里，安静了一会儿。有人举手：「教授，那和我们有什么关系？」教授点了点头：「问得好。」他说，「等你们想明白这个，你们就，入门了。」", "教室的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:facility_classroom*/,
options:[
{t:"认真听课", go:"quest_hub"},
{t:"走神", go:"act_rest"}
]
}};

N["facility_dorm"]=function(){return{
place:"学院·宿舍",
text:["宿舍的夜谈，是学院生活里最放松的时刻。熄灯之后，黑暗里传来室友们压低的声音，聊八卦、聊理想、聊那些不敢白天说出口的事。", "「你们说，毕业以后，真能成为自己想成为的人吗？」上铺的声音闷闷的。", "「能吧。」对面床的接话，「就算成不了，也总比连试都不敢试强。」", "你躺在自己的床上，听着他们的话，看着天花板上跳动的月光。宿舍的床板很硬，被子有股淡淡的太阳味，但你知道，很多年后，你会怀念这个味道，怀念这些在黑夜里说着傻话的人。", "夜深了，声音渐渐低下去，只剩均匀的呼吸声。你翻了个身，也闭上眼睛——明天，又是新的一天。", "你的宿舍，在二楼，朝北。房间不大，四张床，一张桌子，一个柜子。", "你推门进去的时候，你的室友，已经到了两个。一个在整理床铺，一个坐在窗边，看着外面。", "整理床铺的，先开口：「你来了？我叫……」他报了名字。窗边的那个，回头，看了你一眼，点了点头，没说话。", "你放下行李，选了靠窗的那张床。你铺床的时候，窗边的室友，忽然说了一句：「窗台，是我的。」你愣了一下。他顿了顿，「开玩笑的。」", "你笑了。他也笑了。你铺好床，坐下来，看着窗外。窗外，学院的钟楼，正立在暮色里。你忽然觉得，这间小屋，会是你很长一段时间里，最常待的地方。", "你收拾停当，离开宿舍，沿着来路踏上行程。"],pace:"normal" /*v45inj:facility_dorm*/,
options:[
{t:"入睡", go:"act_rest"},
{t:"再想一会儿", go:"quest_hub"}
]
}};

N["facility_cafeteria"]=function(){return{
place:"学院·食堂",
text:["食堂的午饭时间，永远是最热闹的时候。打饭的窗口前排着长队，空气中飘着饭菜的香气——今天有红烧肉，这是学生们最期待的日子。", "你端着餐盘找了个位置坐下。同桌的人一边吃饭一边聊天，有人抱怨课业，有人分享八卦，有人狼吞虎咽，筷子舞得飞快。", "食堂阿姨打菜的手不抖的时候，就是好日子。你埋头吃了一口红烧肉，肥而不腻，酱香浓郁——你在心里默默给今天的食堂打了个高分。", "吃饱喝足，你靠在椅背上，看着食堂里熙熙攘攘的人。这一刻，没什么大事，但就是觉得，日子过得挺好的。", "食堂的饭点，是学院里最热闹的时候。你端着餐盘，在人堆里，挤来挤去。", "今天的菜，是炖菜和硬面包。你找了个位子坐下，咬了一口面包——硬得像石头。你掰成小块，泡在汤里，才咽得下去。", "对面坐着一个高年级学生，正埋头吃饭。他吃完，抬起头，看见你，咧嘴一笑：「新生吧？」你点头。他说：「习惯就好。」他站起来，端着盘子走了。", "你低头，继续吃。你忽然觉得，食堂的饭，虽然不好吃，但热腾腾的，有一种，说不出的踏实。", "你吃完，把盘子放回回收处。你走出食堂，天已经擦黑。你回头，看了一眼食堂的灯——它亮着，像这座学院里，无数盏亮着的灯之一。", "你与食堂作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal" /*v45inj:facility_cafeteria*/,
options:[
{t:"继续下午的日程", go:"quest_hub"},
{t:"回去午休", go:"act_rest"}
]
}};

N["facility_infirmary"]=function(){return{
place:"学院·医务室",
text:["医务室里弥漫着草药的味道。校医是个脾气很好的老妇人，正在给一个扭伤脚的学生缠绷带，动作又轻又稳。", "轮到你时，她看了看你的脸色，皱了皱眉：「年轻人，别仗着身体好就硬扛。坐，我看看。」她搭了搭你的脉，又让你张嘴看了看舌苔，最后给你包了一包药。", "「回去用温水冲服，一天两次。」她把药包塞进你手里，「还有——少熬夜。你们这些孩子，总觉得日子长着呢，其实身体这东西，最不经造。」", "你接过药包，道了谢。走出医务室时，阳光正好。你决定今晚早点睡——不为别的，就为对得起老校医这句话。", "医务室的药味，很重。你进去的时候，校医正坐在窗边，晒着太阳，打着盹。", "你咳了一声。她睁开眼：「哪里不舒服？」你说了。她指了指椅子：「坐。」她给你看了一会儿，说：「没事。歇两天就好。」", "她给你包了点药，包的时候，问了一句：「听说，你要参加院际大赛？」你点头。她「嗯」了一声：「那这两天，别练了。」她顿了顿，「伤没好透，上了场，是给人送菜。」", "你谢过她，拿着药，走了。你走到门口，她叫住你：「哎。」你回头。她说：「药，饭后吃。」她想了想，又补了一句，「要是疼得厉害，就别硬扛。来找我。」", "你点头，走了。你走出医务室，手里，攥着那包药。你忽然觉得，那句「来找我」，听着，挺暖的。", "你最后回望一眼医务室，转身穿过街口，往下一程赶路。"],pace:"normal" /*v45inj:facility_infirmary*/,
options:[
{t:"回去休息", go:"act_rest"},
{t:"去上课", go:"quest_hub"}
]
}};

N["facility_shop"]=function(){return{
place:"学院·小卖部",
text:["学院的小卖部，是学生们课后最爱的去处。老板是个笑眯眯的胖子，人称「老饕」，因为他除了文具，还偷偷卖些小零食——学院明令禁止，但他总有办法。", "「来啦？」老饕从柜台底下摸出一包肉脯，压轻声音，「新到的，别声张。」你接过肉脯，又买了一支笔、一本笔记本，算完账，老饕又塞给你一颗糖：「送的。」", "你咬着糖走出小卖部。糖是麦芽糖，甜得粘牙，但你就是觉得，比外面买的好吃。", "你回头看了一眼小卖部，老饕正笑眯眯地给下一个学生递东西，柜台底下藏着的，还是那包肉脯。你笑了笑——有些味道，是学院的专属。", "学院的小卖部，开在宿舍楼下。你走进去的时候，老板娘正坐在柜台后，织着毛线。", "她抬头，看了你一眼：「新来的？」你点头。她放下毛线，站起来：「要点什么？」你说，看看。她「嗯」了一声，又坐下了，继续织。", "你在货架前，转了一圈。货架上，东西不多：墨水、纸、蜡烛、干粮。你拿了一根蜡烛，一叠纸。你走到柜台前，问价。她报了数。你付了钱。", "她把纸和蜡烛，递给你。你转身要走。她叫住你：「等等。」她从柜台下，摸出一样东西，「送你的。」", "你低头，一看——是一块干饼。她说：「新来的，都有一块。」她顿了顿，「饿了，垫垫肚子。」你接过干饼，道了谢，走出门。饼还是温的。", "小卖部的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal" /*v45inj:facility_shop*/,
options:[
{t:"回宿舍", go:"act_rest"},
{t:"继续活动", go:"quest_hub"}
]
}};

N["facility_alchemy"]=function(){return{
place:"学院·炼金室",
text:["炼金室的空气里总是混合着各种气味——硫磺、薄荷、还有某种说不清的金属味。架子上摆满了瓶瓶罐罐，标签上的字迹五花八门，有的甚至画着骷髅头。", "你系上围裙，开始今天的分组实验。按照配方，你小心地把三种粉末混合，加入一滴催化剂——烧杯里的液体先是变蓝，然后徐徐变成紫色，最后稳定下来。", "「不错，色泽纯正。」导师走过来看了一眼，点点头，「下次试试在低温下操作，反应会更平稳。」", "你记下导师的话，把成果倒进样品瓶，贴上标签。炼金术这东西，讲究的是一分一毫的精准——差之毫厘，谬以千里。你越来越觉得，这和修行是一个道理。", "炼金教室里的味道，永远混着草药和硫磺。你走进去的时候，教授正站在讲台前，摆弄着一堆瓶瓶罐罐。", "「今天，我们炼一种简单的药剂。」教授说着，拿起一个瓶子，「但简单，不等于容易。」他顿了顿，「你们要记住：炼金，错一步，全盘皆输。」", "你跟着步骤，一步一步地做。你加药粉的时候，手抖了一下，多倒了一点。你赶紧，又用勺子，舀出去一点。", "教授走过来，看了一眼你的坩埚：「多了。」你说，你舀出去了。他摇摇头：「多了就是多了。药粉已经化了，舀不回去了。」", "你愣在那里。教授看着你：「记住这一课。」他说，「有些错，不是能补的。你只能，从头再来。」", "从炼金室出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal" /*v45inj:facility_alchemy*/,
options:[
{t:"继续实验", go:"quest_hub"},
{t:"收拾器材回去", go:"act_rest"}
]
}};

N["quest_classmate"]=function(){return{tag:"branch",
place:"委托·同窗",
text:["你答应帮同窗一个忙——他最近在整理一份旧档案，缺几卷资料，那些资料只有学院图书馆的深处才有。", "你来到图书馆的旧藏区，顺着索引找到那排书架。灰尘很厚，你抽出一卷，封面上印着泛黄的日期——那是很多年前的事了。", "你翻开卷宗，本想着快点找到需要的资料，却渐渐被内容吸引——上面记录着一些旧事，其中几页提到的人名和事件，你似乎在别的地方见过。", "你把那几页折了个角，记下位置，然后找到同窗要的资料，一并带了出来。有些忙，帮到最后，往往会帮出些意外收获。", "你帮同窗，做了一件，他自己做不了的事。这件事，你没有告诉他，全部的真相。", "他托你，去取一样东西。你去了。你取到东西，回来的路上，你发现，那样东西，比他想的多了一重——它背后，还连着另一件事。", "你站在路口，想了很久。你最终，没有告诉他那件事。你把东西，原样，交给了他。", "他接过东西，很高兴。他连声道谢。你看着他高兴的样子，笑了笑，说：「没什么。」", "你走出门，回头，看了一眼。他还在摆弄那样东西。你转回身，走了。你在想，那件没有说的事，你将来，会不会，后悔。", "出了同窗，风迎面扑来。你认了认方向，启程。"],pace:"normal" /*v45inj:quest_classmate*/,
options:[
{t:"把资料交给同窗", go:"quest_hub"},
{t:"先自己研究一下", go:"quest_hub"}
]
}};

N["quest_tutor"]=function(){return{tag:"branch",
place:"委托·师长",
text:["导师交给你一个任务：整理他手头一批散乱的笔记，把其中关于封印术的部分单独摘出来，编成一本小册子。", "你花了两天时间，把那些字迹潦草的笔记一页页梳理清楚。导师的字很难认，但内容却很有意思——有几段记录了他年轻时参与的一次封印行动，细节生动，像冒险小说。", "你在整理中发现，笔记里有一页被撕掉了，只剩半张残页，上面写着半句话：「如果封印再次松动，唯一的办法是——」后面的字被撕掉了。", "你犹豫了一下，把那半张残页的事记在心里，没有多问。有些事，导师不说，自然有他不说的理由。", "导师给你布置了一项任务。任务本身不难，难的是，完成它的方式。", "「去把这个东西，送到城南的旧书铺。」他递给你一个包裹，「记住——不要打听，不要拆开，送到就回。」", "你接过包裹，掂了掂，很轻。你问他，这是什么。他说：「你不用知道。」他顿了顿，「你只需要知道，它该到哪去。」", "你带着包裹，出了门。你走在路上，好几次，想拆开看看。你都忍住了。你把它送到城南旧书铺，交到那个老板手里。老板接过，没有问，只点了点头。", "你转身，走出书铺。你走在回去的路上，心里，忽然有一种很奇怪的感觉——不是好奇了，是踏实。你发现，有些事，不去知道答案，反而，是对的。"],pace:"normal" /*v45inj:quest_tutor*/,
options:[
{t:"把整理好的册子交给导师", go:"quest_hub"},
{t:"追问残页的事", go:"quest_hub"}
]
}};

N["quest_event"]=function(){return{tag:"branch",
place:"委托·事件",
text:["你接下的这个委托，比看上去要复杂得多。委托人说丢了件祖传的信物，求你帮忙找回来——但你调查后发现，那件信物牵涉的旧事，远比「祖传」两个字复杂。", "你顺着线索查下去，发现信物几经转手，每一任持有者都有一段故事：有商人，有盗贼，还有一个已经去世多年的老妇人。", "你在老妇人的旧居里，找到一封没有寄出的信。信里写着信物的来历——它确实珍贵，但珍贵的不是它的价值，而是它见证过的一段约定。", "你握着那封信，站在老妇人空荡荡的院子里，忽然觉得，这委托的答案，也许不在信物本身，而在这些被遗忘的人和事里。", "你赶上了一场，正在发生的事。事情不小，你正好，在场。", "你一开始，只是想看看。但事情的发展，比你预想的快。你还没来得及决定，你已经被卷进去了。", "你帮了一把手。你做的事，不大，但恰好，改变了一点什么。有人注意到你了。他朝你，点了点头。", "事后，他找到你：「你刚才，做得不错。」他说，「有没有兴趣，跟着我干？」你问他，干什么。他说：「干点，对的事。」", "你站在那里，想了很久。你最后，没有立刻答应。你说：「让我想想。」他点了点头：「行。想好了，来找我。」他走了。你站在原地，想了很久，很久。", "你离了事件，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:quest_event*/,
options:[
{t:"把信物交还委托人", go:"quest_hub"},
{t:"继续深挖旧事", go:"quest_hub"}
]
}};

N["quest_secret"]=function(){return{tag:"branch",
place:"委托·秘密",
text:["你在一次委托中，无意间触碰了一个秘密。那是一个尘封多年的名字，出现在一份不该存在的名单上。", "你盯着那个名字看了很久。它和某件你一直在调查的事，隐隐有着联系——但你还不确定，这联系是巧合，还是有人在刻意安排。", "你把名单抄了一份，原件放回原处。走出那间屋子时，你留心观察了四周——确认没有人跟踪，才松了口气。", "你走在夜色里，反复琢磨那个名字。有些秘密，知道了就是知道了，装不知道，反而更危险。你决定，把它查清楚。", "你接下了一件，不能说的差事。接下它的那一刻，你就知道，这件事，会改变一些什么。", "给你差事的人，只说了三句话。第一句：「这事，只有你能做。」第二句：「做了，别说。」第三句：「做完，忘了。」", "你问他，为什么是你。他说：「因为，你正好，出现在了，它该发生的时候。」你不太明白。他没有解释。", "你做了那件事。你做得，比你想的顺利。你做完，像他说的，没有说，也没有再想。", "但有些事，不是你说忘，就能忘的。那天夜里，你翻来覆去，睡不着。你在想，那三句话里的，每一个字。", "秘密在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"normal" /*v45inj:quest_secret*/,
options:[
{t:"追查名单上的名字", go:"quest_hub"},
{t:"暂时按兵不动", go:"act_rest"}
]
}};

N["war_detail"]=function(){return{
place:"战争·详情",
text:["你了解到更多关于战争的细节。这场战争的起因，远不是一纸檄文能说清的——有粮食的争夺，有商路的纠纷，有旧怨的积累，还有几只看不见的手，在幕后推动。", "你在一份缴获的战报上，看到这样一句话：「粮道中断，军心浮动。若十日无援，则……」后面被撕掉了。", "你翻看其他资料，发现双方都在隐瞒伤亡数字——因为他们都清楚，一旦真实数字公开，后方会先于前线崩溃。", "你合上战报，靠在椅背上。战争这头巨兽，吞噬的从来不只是士兵——它吞噬粮食、信任、还有那些被写在纸背面的真相。", "战争的细节，比你在战报上读到的，残酷得多。", "你路过一个村子。村子已经空了。墙上有火烧过的痕迹，地上，散落着一些，来不及带走的东西——一只鞋，一口锅，一张，被踩脏的全家福。", "你蹲下来，捡起那张全家福。照片上的人，笑着。你把它，翻过来，看见背面，写着一行字：「愿战火，永不到此。」", "你站在那里，看了很久。你把照片，小心地收好。你继续走。你走了一段路，把它拿出来，又看了一眼，然后，放回了原处——你怕，有人会回来找它。", "你继续赶路。你忽然觉得，你走的这条路，比来的时候，沉了许多。"],pace:"normal" /*v45inj:war_detail*/,
options:[
{t:"继续收集情报", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

/* /v62inj:chunk-relic/ N["relic_alchemy_furnace"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_holy_grail"] 已移入 chunks/v62_relic.js */
N["prologue_enroll_secret"]=function(){return{tag:"easter",
place:"序章·录取的真相",
text:["多年后你才明白，那份录取通知书的到来，从来不是偶然。", "你曾以为，是你出众的天赋引来了学院的注意。后来你发现，在你被注意到之前，就已经有人在暗中观察你——你帮过的某个人、你做过的一件小事、你随口说过的一句话，都成了他们判断你的依据。", "你甚至怀疑过，那些「偶然」的相遇——那个在你落难时出手相助的陌生人、那封恰好在关键时刻送达的信——是否都是安排好的。", "你把这份怀疑压在心里，没有告诉任何人。因为你知道，无论录取的真相是什么，你已经走出了那条路，也收不回脚了。", "你发现了一件，关于录取通知的怪事。这件怪事，你谁也没告诉。", "你的录取通知，是有人，悄悄放在你门口的。你没有看见，是谁放的。你问了邻居，都说，没注意。", "通知的信封上，没有邮戳，没有寄件人。你拆开，里面，除了录取文书，还夹着一张小纸条——「到学院后，去图书馆，第三排书架，最下面一层。」", "你看着那张纸条，想了很久。你最终，没有告诉任何人。你把纸条，小心地收好。", "你出发去学院的那天，把那张纸条，贴身带着。你摸着它，心里，隐隐觉得，这趟旅程，可能，不止是去上学。"],pace:"normal" /*v45inj:prologue_enroll_secret*/,
options:[
{t:"接受这份真相", go:"quest_hub"},
{t:"继续追查录取背后的安排", go:"quest_hub"}
]
}};

/* /v62inj:chunk-academy/ N["academy_library"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_arena"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_club"] 已移入 chunks/v62_academy.js */
N["guild_quest_easy_generic"]=function(){return{tag:"branch",
place:"公会·简单委托",
text:["你在公会的委托板上挑了一张简单的委托：帮城西的老妇人找回走失的猫。赏金不高，但胜在轻松。", "你找到那只猫时，它正蹲在隔壁院的墙头，居高临下地看着你，眼神里写满了「你奈我何」。你费了点功夫，才把它哄下来。", "老妇人接过猫，高兴得直抹眼泪，塞给你一枚铜板和一块烤饼：「拿着，辛苦你了。」你接过烤饼，咬了一口——味道不错。", "回去的路上，你嚼着烤饼，想着这个简单的委托。日子嘛，不全是打打杀杀，也有这样的小事——轻飘飘的，但让人心里踏实。", "你接的这件差事，不难。送一封，不太远的信。", "你拿着信，走了一天半的路，送到了。收信的人，拆开信，看了，点了点头，给了你，一笔不多不少的钱。", "你接过钱，道了谢，往回走。你走了一段路，忽然想，那封信里，写了什么。你想了想，又摇了摇头——不该知道的，别打听。", "你回到公会，交了差。办事员划掉了那条，说：「干得利索。」你点了点头，走出大厅。", "你摸了摸怀里的钱。不多，但够用。你决定，去酒馆，喝一杯。"],pace:"normal" /*v45inj:guild_quest_easy_generic*/,
options:[
{t:"再接委托", go:"quest_hub"},
{t:"休息", go:"act_rest"}
,
    {t:"（医务室的药典——你想再看一眼）",go:"combo_guard_01"}]
}};

N["guild_quest_hard_generic"]=function(){return{tag:"branch",
place:"公会·困难委托",
text:["这张委托挂在告示板最上面，纸边已经泛黄：护送一批货物穿过狼牙峡谷，赏金丰厚，伤亡自负。", "你揭下委托时，柜台后的老管事看了你一眼：「狼牙峡谷？上一个接这活儿的队伍，折了一半人。」他顿了顿，「你确定？」", "「确定。」你把委托折好，收进口袋。", "出发那天，你在峡谷口遇到了同行的商队。他们听说你要走狼牙峡谷，都露出复杂的表情——有人摇头，有人祝你好运，有人塞给你一包伤药。", "你收下伤药，朝峡谷深处走去。风从峡谷里灌出来，呜咽作响，像有什么东西在深处等着你。", "你接的这件差事，不简单。你知道它不简单，你还是接了。", "差事的内容，你心里，过了一遍。你发现，有几处，比布告上写的，复杂得多。", "你花了比预想多的时间，才办完。中间，还出了一点，小意外。你处理了。没有留下，什么麻烦。", "你回来交差的时候，办事员看了你一眼：「办得不错。」他顿了顿，「这活，之前两个人，都办砸了。」", "你拿了酬劳，走出大厅。你站在门口，吹着风。你忽然觉得，那笔钱，拿得，还算，踏实。"],pace:"normal" /*v45inj:guild_quest_hard_generic*/,
options:[
{t:"进入峡谷", go:"quest_hub"},
{t:"再准备些物资", go:"quest_hub"}
]
}};

N["fc_slums_help_generic"]=function(){return{tag:"main",
place:"自由城邦·贫民窟相助",
text:["贫民窟的巷子又窄又暗，污水顺着墙根流，气味刺鼻。你走进去时，几个蹲在墙边的孩子好奇地看着你，其中一个缩了缩，躲到大人身后。", "你帮一个独居的老人修好了漏水的屋顶。他颤巍巍地给你端来一碗水：「干净的，你喝。」你接过碗，喝了一口——水是凉的，但老人的眼神是热的。", "临走时，老人拉住你的袖子，塞给你一小包东西：「这是我自己晒的草药，治跌打损伤。外乡人，路上用得着。」", "你把草药收好。走出巷子时，阳光正好照在贫民窟的屋顶上——这里的人日子过得苦，但苦日子里，也有肯把好东西让给陌生人的人。", "你在旧城区，帮了一个人的忙。帮忙的原因，很简单——他开口了。", "他需要人，帮忙搬一样东西。你帮他，搬到了地方。他谢了你，问你，要不要，喝口水。你喝了。他家里的水，是凉的，带一股，铁锈味。", "他坐下来，跟你说了几句闲话。他问你，是哪里的。你说了。他点了点头：「城里人。」他顿了顿，「城里人，很少来这边。」", "你问他，为什么。他想了想：「因为，这边，没什么好图的。」他停了停，「但你——」他看了你一眼，「你不像来图什么的。」", "你喝完水，谢过他，走了。你走出巷子，回头，看了一眼。他已经，关上了门。你转回身，继续走。你忽然觉得，那一碗带铁锈味的水，比很多酒，都实在。", "贫民窟相助已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal" /*v45inj:fc_slums_help_generic*/,
options:[
{t:"继续在贫民窟帮忙", go:"quest_hub"},
{t:"离开", go:"academy_main"}
]
}};

N["fc_slums_explore_generic"]=function(){return{tag:"main",
place:"自由城邦·贫民窟探索",
text:["贫民窟的地下，远比地面上复杂。你顺着一条废弃的排水沟往里走，两侧的墙壁上长满青苔，水声在黑暗中回荡。", "你在一处拐角，发现墙上刻着几个符号——看起来像是某种记号，有人用它标记路线。你顺着记号走了一段，记号在一扇锈死的铁门前消失了。", "你蹲下来，检查铁门。门锁是新的，和周围的锈迹格格不入——最近有人来过这里。", "你没有贸然推门，而是记下位置，原路退回。贫民窟的地下藏着秘密，而你还不确定，这秘密属于谁。", "你去了旧城区。那里的房子，挤在一起，像一片，灰色的积木。", "你走进去，空气里，有一股潮湿和霉味。晾着的衣服，挂在窗户之间，像一面面，破旧的旗。", "你在一条巷子里，看见一个老人，坐在门口，晒着太阳。你经过的时候，他睁开眼，看了你一眼：「生面孔。」他说，「来这儿，做什么？」", "你说，随便看看。他哼了一声：「这地方，没什么好看的。」他顿了顿，「不过，你既然来了——」他指了指巷子深处，「那边，有一口老井。城里，知道它的人，不多了。」", "你谢过他，往巷子深处走去。你走了几步，回头，他还坐在门口，晒着太阳。你转回身，继续走。你心里，记下了那口井。", "贫民窟探索的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:fc_slums_explore_generic*/,
options:[
{t:"改天再来调查", go:"quest_hub"},
{t:"返回地面", go:"academy_main"}
]
}};

/* /v62inj:chunk-academy/ N["academy_classroom_generic"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_library_generic"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dorm_generic"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_playground_generic"] 已移入 chunks/v62_academy.js */
N["ending_check"]=function(){return{tag:"ending",
place:"结局·检查",
text:["七印的光在你心底依次亮起，又依次归于平静。你闭着眼，能感觉到每一道印的重量——它们压在大地的七个方位，像七根看不见的桩。", "你想起修复每一道印的路：铁门关外的雪，银叶城下的根，矮人炉膛里的蓝火，承天山上的灯。那些路你走得很远，可此刻，它们在你心里缩成了一张图。", "星光照在你脸上。你忽然觉得，你不再是那个从出身地出发的、什么都不知道的少年了。", "你睁开眼。风从远处来，带着七种不同的气息——雪、木、铁、盐、纸、火，还有一种，是你自己的。", "你走向第一个方向。身后，七道印的光，像七盏灯，替你照着你来时的路。", "你站在大陆的中枢，闭目感知七印的状态。七道封印的脉络，在你心底一一亮起。", "第一印——铁门关的深渊之门。你修复它时，老兵们站在你身后，握紧了生锈的武器。第二印——愤怒之颅。铁木真的儿子巴特尔，骑着枣红马，在雪原上跑了一整天。第三印——傲慢之心。女王黄林晶的「心」，重新跳动了。第四印——贪婪熔炉。矮人的炉火，重新燃起了纯净的蓝色。", "第五印——深渊之水。海族的女王珊拉，站在她新修的海港上，看着第一艘驶向大陆的船。第六印——时光裂隙。承天书院的学生们，挑灯夜读。第七印——你亲手写下最后一笔的地方。", "你睁开眼，星光落满衣襟。七印已全。但你知道，封印只是开始——真正的故事，在封印之后，才刚刚翻开。", "你走出几步，又停下来，回头看了一眼。", "这片大陆，你走过它的每一个角落。你认识它的山、它的河、它的城，认识那些在山里凿石头、在河边洗衣裳、在城里数铜板的人。", "你为他们修过印，也为他们流过血。可你知道，真正的故事不在印里，在他们身上。", "风又吹过来。你转身，朝前走去，没有再回头。", "七盏灯在你身后，静静地亮着。"],pace:"normal" /*v45inj:ending_check*/,
options:[
{t:"走向结局", go:"ending_v36_eclipse"},
{t:"回顾这一路", go:"seal1_transition"}
]
}};

/* /v62inj:chunk-relic/ N["relic_forge_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_cloak_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_key_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_shield_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_book_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_thread_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_seal_intro"] 已移入 chunks/v62_relic.js */
N["faction_free_tavern"]=function(){return{
place:"自由城邦·酒馆暗语",
text:["这家酒馆开在自由城邦的鱼龙混杂之地，白天卖酒，夜里传消息。你要了一杯麦酒，在角落坐下，观察着四周。", "你注意到，酒馆里有几桌客人说话的声音压得很低，偶尔有人起身，在吧台前敲三下，然后离开。这是某种暗号。", "你找机会和酒保搭话。酒保是个精瘦的中年人，擦着杯子，头也不抬：「外乡人？想打听什么？」", "你压轻声音问了一个名字。酒保的动作顿了一下，随即若无其事地继续擦杯子：「这杯算我请的。但你要找的人，不在这个城里——至少，不在白天。」", "你端着酒杯，若有所思。自由城邦的水，果然比看上去深得多。", "你在自由城邦的酒馆里，听到了一个消息。消息不大，但你可能，会用到。", "说消息的人，是个喝得半醉的商人。他拍着桌子，跟同桌的人说：「你们知道吗——北边，有人，在收一样东西。」他压轻声音，说了一个名字。", "同桌的人，有的不信，有的追问。商人摆摆手：「信不信随你们。反正，我是亲眼看见的。」他说完，又灌了一口酒。", "你坐在角落里，听着。你没有过去问。你只是，把那个名字，记在了心里。", "你走出酒馆的时候，夜风一吹，酒气散了。你站在街上，想了一会儿那个名字。你决定，明天，去打听打听。", "你最后回望一眼酒馆暗语，转身穿过街口，往下一程赶路。"],pace:"normal" /*v45inj:faction_free_tavern*/,
options:[
{t:"继续打听", go:"quest_hub"},
{t:"离开酒馆", go:"academy_main"}
]
}};

/* /v62inj:chunk-seal/ N["seal5_fisherman"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_research"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_town"] 已移入 chunks/v62_seal.js */
N["extinct_wing_intro"]=function(){return{
place:"遗物·断翼",
text:["这是一截断裂的翼骨，比任何鸟类的翅膀都大，骨质洁白如玉，断口处却泛着一层诡异的暗金色。", "你握住翼骨，能感到一股若有若无的脉动——像是什么东西还活着，还在骨血深处流淌。", "你想起龙语学院遗迹里看到过的壁画：那些长着巨翼的生灵，翱翔在天穹之上，连日月都为之让路。如今，那样的生灵已经绝迹，只剩这截断翼，安静地躺在你手中。", "你小心地把翼骨包好。它太重，重得像是背负着一整个已经消亡的时代的重量。", "你读到了一些，关于「翼族」的记载。这个种族，已经灭绝很久了。", "书里说，翼族曾经，生活在最高的山峰上。他们能飞，能看见，很远的风景。书上写：「翼族的眼睛，见过大陆的尽头。」", "你翻到后面，想找他们灭绝的原因。书上只写了几个字：「不详。」你翻遍那本书，也找不到更多。", "你又找了其他书。有一本旧书，只提了一句：「翼族的羽毛，能照亮黑夜。后来，夜就黑了。」", "你合上书，想了很久。你不确定那句话，是什么意思。但你觉得，那句话里，藏着一些，被抹掉的真相。", "你最后回望一眼断翼，转身穿过街口，往下一程赶路。"],pace:"normal" /*v45inj:extinct_wing_intro*/,
options:[
{t:"收好断翼", go:"quest_hub"},
{t:"研究它的来历", go:"quest_hub"}
]
}};

N["extinct_aqua_intro"]=function(){return{
place:"遗物·水之遗痕",
text:["你在遗迹深处发现了一方水池，池水清澈见底，却散发着不属于这个时代的气息。水面上，浮着一层淡淡的银光。", "你蹲下身，伸手探入水中——水是凉的，但你的指尖却感到一阵灼热，像是碰触到了某种古老的力量。", "池底刻着一圈符文，你认出了其中几个：与水元素有关的古老语言。传说在很久以前，有精通水之秘术的种族，能唤来滔天巨浪——如今，那力量只剩这一池静水。", "你取了一瓶水，收进行囊。水在瓶中稍晃动，银光依旧。你总觉得，这水会派上用场——只是时机未到。", "关于「水族」，你知道得不多。它们灭绝得更早，留下的痕迹，也更少。", "你在一本航海日志里，找到一段记录：「今日，见海底有光。光中有影，影有形，似人而非人。转瞬即逝，不可追。」", "那段记录的落款，是三百年前。你算了算——那时候，水族，应该已经灭绝了。但你不知道，那段记录里的人，看见的，是什么。", "你又翻了一些书。有一本，记着一种说法：「水族，不在地上建城。它们住在，海的最深最暗处。」", "你合上书，看着窗外。你忽然想，如果它们真的，住在海的最深处——那它们，到底，算不算，灭绝了。"],pace:"normal" /*v45inj:extinct_aqua_intro*/,
options:[
{t:"收好水样", go:"quest_hub"},
{t:"继续探索遗迹", go:"quest_hub"}
]
}};

/* /v62inj:chunk-seal/ N["seal1_act2_sneak"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_enter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_caravan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_trade_route"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_approach"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_anger_consequence"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_khan_military"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_khan_weakness"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_volunteer"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_grandma"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_wanderer_power"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_assassin_plan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_awaken_plan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_both_plan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_son_grave"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_road_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_hide"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_side_approach"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_throne"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_secret_path"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_injured_tent"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_khan_weakness"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_listen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_carry_shaman"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_vessel"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_force"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_guardian_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_caravan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_sneak_in"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_seal_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_hide"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_encounter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_why_not"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_hlj_reason"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_other_way"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_queen_joins"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_mercury_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_wait"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_mercury_story"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_seal_structure"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_prepare"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_runes"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_queen_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_next"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_attack"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_other_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_queen_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_become_god"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_queen_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_defeat_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_queen_future"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_emergency"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_retreat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_miner_entrance"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_location"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_miner_contact"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_abyss_entrance"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_thorin_state"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_resist_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_force_enter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_thorin_flatter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_thorin_confront"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_offer_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_miner_path"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_wait"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_why_not"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_scatter_route"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_heart_route"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_both_routes"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_copperbeard_more"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_scan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_alone"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_pull"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_purify"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_retreat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act3_seal_heart"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_will_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_thorin_choice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act3_scatter_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act3_give_thorin"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_throw_back"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_people_reaction"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_dark_ending"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_redemption"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_wait"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_location"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_contact"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_gear"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act2_wait_sea"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act2_sneak"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act2_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_deal"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act4_need_negotiate"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_apologize"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_repair_cure"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act4_other_seals"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_student"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_rift"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_why_lazy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_rift_use"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_other_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act3_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act3_return"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act4_return"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act3_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act1_rest"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act1_embrace"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act1_question"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act2_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act2_prepare"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_combat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_final_friend"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_coexist_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-evt/ N["evt_rockfall_retreat"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-seal/ N["seal5_exp_church"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_seen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_old_captain"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_magic_shop"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_pearl_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_queen_name"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_dive_tips"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_hesitate"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_sneak"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_escape"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_promise"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_seal_detail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_need_negotiate"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_apologize"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_repair_cure"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_queen_plan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_deal_weapon"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_deal_item"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_deal_name"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_leave"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_blood_unlock"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_kill_queen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_student"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_rift_direct"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_why_lazy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_rift_use"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_other_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_observe_past"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_return"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_return_new"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_truth_past"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_rest_oasis"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_embrace"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_question"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_observe_temple"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_prepare"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_combat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_coexist_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_final_friend"] 已移入 chunks/v62_seal.js */
N["eclipse_branch_warn"]=function(){return{tag:"branch",
place:"旧城区·警告",
text:["你找到那个即将被处决的暗蚀会成员——一个叫「鸦」的年轻人。他看起来不过二十岁，被绑在柱子上，眼神里没有恐惧，只有一种空洞的平静。", "你走近他，压轻声音：「有人要杀你。我可以放你走——但你要告诉我，暗蚀会为什么选中你。」", "他抬眼看你，笑了：「我这样的人，在暗蚀会里多的是。被世界踩在脚底、走投无路的人——我们凑在一起，只为了一个念头：让踩我们的人，也尝尝被踩的滋味。」", "你沉默了一会儿，割断了他的绳子。他愣住了：「你……真放我走？」", "「走吧。」你说，「但记住，你欠我一次。下次见面，我希望你不是以暗蚀会的身份。」他深深看了你一眼，转身消失在巷子里。你看着他的背影，不知道自己做得对不对。", "有人警告了你。警告你的人，没有现身——你回到住处，发现桌上，放着一张纸条。", "纸条上，只有一行字：「别查了。收手，还来得及。」", "你把纸条，看了好几遍。你认不出笔迹。你捏着纸条，想了很久。你在想，这张纸条，是真的为你好，还是，想让你停下来的另一种方式。", "你把纸条，折好，收了起来。你没有收手。但你开始，更小心了——你走路，会多看几眼身后；你说话，会多想一遍再说。", "那张纸条，你后来，又拿出来看过几次。每一次看，你都觉得，那行字里，藏着一种，说不上来的东西——像是，真的在劝你。"],pace:"normal" /*v45inj:eclipse_branch_warn*/,
options:[
{t:"目送他离开", go:"eclipse_branch_intro"},
{t:"跟踪他", go:"eclipse_branch_report"}
]
}};

N["eclipse_branch_report"]=function(){return{tag:"branch",
place:"旧城区·告密",
text:["你做出了选择：把暗蚀会的据点，报告给守望者。", "你走进守望者的据点，说明了来意。接待你的探员沉默地听完，问：「你确定？据点里的人，可能都是些走投无路的可怜人。」", "「我知道。」你说，「但放任他们，会有更多人走投无路。」", "探员点了点头，递给你一枚徽章：「如果消息属实，这枚徽章会记录你的功劳。守望者欠你一次人情。」", "你接过徽章，没有觉得轻松。你回到街上，夜风很冷。你想起鸦空洞的眼神——你救不了所有人，你只能选择保护更多的人。", "你捏紧徽章，走回住处。今晚，旧城区会有一场搜捕。你知道，但你拦不住。", "你决定，把日蚀会的事，上报。你连夜，把你知道的，写成了呈文。", "你写得很慢。每一条，你都想清楚，才落笔。写到一半，你停住，把写好的，又看了一遍。你删掉了几处——那些，只是你的猜测，没有证据。", "你写完的时候，天快亮了。你吹熄蜡烛，把呈文折好，放进怀里。你站在窗前，看着外面。晨雾里，学院的钟楼，若隐若现。", "你把呈文，交到了该交的地方。接待你的人，看得很仔细。看完，他抬起头，问你：「这些，都是真的？」你说：「我亲眼所见，亲耳所闻。」他看了你很久，点了点头。", "你走出那扇门的时候，天已经大亮。你站在太阳底下，忽然觉得，那封呈文，像一块石头，从你心上，搬走了。但你知道，这块石头，很快就会以另一种形式，落回来。"],pace:"normal" /*v45inj:eclipse_branch_report*/,
options:[
{t:"接受这份功劳", go:"eclipse_branch_test"},
{t:"折返回去", go:"eclipse_branch_warn"}
]
}};

N["eclipse_branch_alternative"]=function(){return{tag:"branch",
place:"旧城区·第三条路",
text:["你不杀他，也不告发他。你选了第三条路——说服他，离开暗蚀会。", "你找到鸦，在他藏身的破屋里，与他谈了一整夜。你给他讲海底女王的故事：一个被囚禁了一万年的种族，都没有放弃自由。", "「暗蚀会能给你什么？」你问他，「一场没有胜算的报复？」", "他低着头，很久没说话。最后他开口，声音沙哑：「可我不知道，除了这条路，我还能走哪条路。」", "你从怀里摸出一块干粮，递给他：「先去吃顿饱饭。然后，往北走。那里有一座学院——你这样的年轻人，该坐在学堂里，而不是蹲在阴沟里。」", "他接过干粮，手指在发抖。他没有答应，也没有拒绝。你离开时，他站在门口，目送你消失在夜色里。", "你发现了日蚀会的另一条路——一条，和他们一贯做法，不同的路。", "你知道这件事，是因为，你无意中，听见了两个人的对话。他们在说，一件旧事——一件，用温和的办法，解决的事。", "说话的人，语气里，带着怀念：「那时候，我们不是这样的。」他说，「那时候，我们还会，坐下来谈。」他顿了顿，「现在，不坐了。」", "你躲在暗处，听着。你忽然明白，日蚀会，不是铁板一块。它里面，也有人，记得另一条路。", "你从暗处走出来的时候，那两个人，已经走了。你站在月光下，想着那番话。你在想，那条「坐下来谈」的路，现在，还走不走得通。", "离开第三条路时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"normal" /*v45inj:eclipse_branch_alternative*/,
options:[
{t:"留下自己的信物", go:"eclipse_branch_mission1"},
{t:"转身离开", go:"eclipse_branch_intro"}
]
}};

N["eclipse_branch_mission1"]=function(){return{tag:"branch",
place:"暗蚀会·第一个任务",
text:["你通过了考验，正式成为暗蚀会的外围成员。你接到的第一个任务，简单得让你意外：「去城东的杂货铺，取一包货，送到码头。」", "你照做了。杂货铺老板看了你一眼，从柜台下摸出一个油纸包。你接过的时候，闻到一股淡淡的药味——不是药，更像某种毒。", "你犹豫了一下，还是把货送到了码头。交接的人没有看你，接过货就消失在雾里。", "回程的路上，你心里很沉。你知道自己在做什么——你正在一步步走进暗蚀会。但你也知道，只有走进去，才能看清它。", "你回到住处，在灯下摊开一张纸，写下今天看到的每一个细节。那是给守望者的报告——也是给自己的良心，留的底。", "日蚀会交给你一项任务。任务不大，但很敏感——监视一个人。", "你问，那个人是谁。对方没有正面回答：「你不需要知道他的名字。」他顿了顿，「你只需要，记住他长什么样，每天，去了哪里。」", "你问，为什么选你。对方看了你一眼：「因为，你还没有名字。」他顿了顿，「一个没有名字的人，才不会被人记住。」", "你接下了任务。你开始，每天远远地，跟着那个人。你跟了几天，发现他的作息，规律得，像一个钟摆。", "第五天，你跟着他的时候，他忽然停下来，转身，朝你的方向，看了一眼。你藏在墙后，心跳如鼓。他看了很久，又转回身，走了。你松了口气。但你心里清楚——他可能，早就发现你了。"],pace:"normal" /*v45inj:eclipse_branch_mission1*/,
options:[
{t:"继续做任务", go:"eclipse_branch_info"},
{t:"把发现记下来", go:"eclipse_branch_report"}
]
}};

N["eclipse_branch_info"]=function(){return{tag:"branch",
place:"暗蚀会·追问",
text:["你试探着，向接头人打听暗蚀会的底细。你问得很小心，像一个好奇的新人。", "「为什么组织叫『日蚀』？」你问。接头人沉默了一会儿：「因为太阳太亮的时候，影子无处可藏。只有日蚀的时候，阴影才敢走出来。」", "「我们到底要做什么？」你又问。", "他看了你一眼，那眼神让你后背发凉：「让那些站在太阳底下的人，也尝尝被影子吞没的滋味。」他没有再多说。但你从他的话里，听出了一种近乎虔诚的恨意。", "你不再追问。你知道，暗蚀会不是一个简单的犯罪组织——它是一群被世界碾碎的人，组成的伤口。伤口会腐烂，也会化脓——你不知道它会变成什么。", "你只能继续往下走，走进去，看清楚。", "你弄到了一些，关于日蚀会的情报。情报不多，但每一条，都很有分量。", "第一条：日蚀会，不是一个人说了算。它内部，分着好几派。第二条：他们最近，在找一样东西——具体是什么，你还没查到。第三条：有人在给日蚀会，递消息。递消息的人，你查不到，但他递的东西，总是比你们快一步。", "你看着那三条情报，想了很久。你最后，在那三条后面，各画了一个问号。", "你把情报收好。你走出门的时候，天正下着雨。你站在屋檐下，看着雨。你在想，那第三条——那个递消息的人，他到底，是谁。"],pace:"normal" /*v45inj:eclipse_branch_info*/,
options:[
{t:"继续深入", go:"eclipse_branch_test"},
{t:"向守望者汇报", go:"eclipse_branch_report"}
]
}};

N["eclipse_branch_fake_death"]=function(){return{tag:"branch",
place:"暗蚀会·假死",
text:["你决定用假死的方法通过考验。你让守望者配合，演了一出「你被暗蚀会仇家杀死」的戏。", "戏很逼真。你躺在血泊里（那其实是红颜料），听着暗蚀会的人查验你的「尸体」。有人踢了你一脚，有人轻声说：「可惜了，还挺能干的。」", "你一动不动，连呼吸都放轻了。直到脚步声远去，你才睁开眼，从地上爬起来。", "你回到暗蚀会据点时，负责人看了你很久，然后说：「你还活着。这很好——说明你比我想的，更值得信任。」", "你通过了考验。但你知道，从今天起，你成了一个「死过的人」。死过一次的人，在暗蚀会眼里，是最好的工具——因为他不怕死。", "你握了握拳。不怕死的人，才最怕活不明白。", "你知道了「假死」这条路。知道的那一刻，你没有立刻决定。", "告诉你这条路的人，说得很直白：「死一次，换个身份，重新开始。」他顿了顿，「以前，有人这么干过。干成了。」", "你问他，那个人，后来呢。他说：「后来——」他停住了，「没人知道。」他说，「这就是假死的好处。连你自己，都不知道，你后来，会变成什么样。」", "你坐在那里，想了很久。你问他，这条路，有没有代价。他想了想：「有。」他说，「你要放弃一样东西——一样，你现在，最舍不得的东西。」", "你走出那间屋子的时候，天已经黑了。你站在夜风里，把手伸进口袋，摸了摸那件，你最舍不得的东西。你把它，握紧了一点。"],pace:"normal" /*v45inj:eclipse_branch_fake_death*/,
options:[
{t:"接受新身份", go:"eclipse_branch_mission1"},
{t:"向守望者汇报进展", go:"eclipse_branch_report"}
]
}};

/* /v62inj:chunk-seal/ N["seal_2_aftermath"] 已移入 chunks/v62_seal.js */
N["past_era2_entry"]=function(){return{
place:"旧时代·残响",
text:["你踏入这片区域时，空气仿佛凝固了一瞬。眼前的景象，像是从某个早已逝去的时代里，硬生生截下来的一块。", "残破的石柱上，刻着你从未见过的文字；倒塌的雕像面容模糊，却仍然保持着某种庄严的姿态。这里的每一块石头，都在诉说着一段被遗忘的往事。", "你伸手抚过一根石柱，指尖传来粗糙的触感。你想象着很久以前，这里曾经是怎样一番景象——也许有人在此祈祷，也许有人在此加冕，也许有人在此流尽最后一滴血。", "风穿过废墟，发出呜咽般的声音。你站在时间的废墟上，忽然明白：所谓历史，就是无数个这样的「曾经」，一层一层地堆叠成现在。", "你看到了一个，很久以前的时代的记载。那些文字，读起来，像在听一个，很老的人，讲一件，很旧的事。", "记载里说，那个时代，天空是另一种颜色。那个时代的人，能看见，现在的人看不见的东西。他们管那叫——「真视」。", "记载里说，「真视」消失了。没有原因，没有征兆。它只是，慢慢地，从人们的眼睛里，退走了。", "你合上书，看着窗外的天空。天空是蓝的，普通的蓝。你忽然想，如果「真视」还在，你眼里的天空，会不会，是另一种样子。", "你把那本书，放回书架。你走出图书馆，抬头，又看了一眼天空。你看了很久。你什么，也没有看见。"],pace:"normal" /*v45inj:past_era2_entry*/,
options:[
{t:"探索废墟", go:"quest_hub"},
{t:"离开", go:"world_continue"}
]
}};

N["language_learn_dwarvish"]=function(){return{
place:"学习·矮人语",
text:["你决定学习矮人语。矮人的文字粗犷而方正，像他们开凿的石刻——每一笔都透着凿子和锤子的力道。", "你找了个懂矮人语的铁匠做老师。他不擅长教人，只会反复念同一个词，然后让你跟着念，念错了就瞪你。", "「不是那样念！」他把锤子往砧上一砸，震得你耳朵嗡嗡响，「矮人语是从嗓子眼里滚出来的，不是从牙缝里挤出来的！像这样——」他又念了一遍，声音浑厚得像石头滚过山涧。", "你学了一下午，嗓子都哑了，但终于能磕磕绊绊地念出几个词。铁匠满意地点点头：「还行。再练三个月，你就能跟矮人吵架了。」", "你揉着喉咙，哭笑不得。但你知道，这门语言，会在某些场合派上大用场。", "你开始学矮人语了。学它的原因，你自己也说不清——也许，只是觉得，该学。", "你跟着一本旧课本学。课本很旧，边角都卷了。你每天，学几个词。你学得慢，但你记牢。", "矮人语的发音，很硬。你练了很久，还是说得磕磕绊绊。有一次，你在铁匠铺，试着，跟一个矮人，打了个招呼。", "他愣了一下。然后，他咧嘴笑了：「说得不怎么样。」他说，「但我听懂了。」他顿了顿，「你，还算有心。」", "你后来，把矮人语，学了下去。你没有学得多好。但你会的那几句，在你需要的时候，帮了你，不止一次。", "你离了矮人语，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:language_learn_dwarvish*/,
options:[
{t:"继续练习", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};

N["disaster_blood_rain_source"]=function(){return{
place:"天灾·血雨之源",
text:["你顺着血雨的传闻，一路追查到它的源头。那是一个被云层遮蔽的山谷，空气中弥漫着浓重的铁锈味。", "你站在谷口，看到谷底有一汪暗红色的水洼，正不断蒸腾出赤色的雾气。雾气升上天空，凝结成暗红色的云——血雨，就是从那里来的。", "你蹲下身，小心翼翼地用指尖蘸了一点水洼里的水。那水黏稠而温热，像是……还带着某种生命的气息。", "你站起身，看着那片暗红色的水洼。你知道，这不是什么天灾——是有什么东西，在这山谷深处，流着不该流的血。", "血雨那件事，你终于，找到了一点源头。找到的过程，比你想的，曲折。", "你花了很多时间，把那些零零碎碎的线索，拼在一起。你发现，血雨出现的日子，都对应着一件事——某处，封印松动的日子。", "你把这个发现，拿给一个老学者看。他看完，沉默了很久，说：「你确定？」你说，你核过三遍。他放下纸，看着你：「这件事，别再查了。」", "你问他，为什么。他说：「因为，查下去，你会查到——」他停住了，没有说完。他站起来，背对着你：「你走吧。就当我，什么都没说。」", "你走出他的屋子，天正下着雨。不是血雨，是普通的雨。你站在雨里，把他说了一半的话，在心里，补完了。你忽然觉得，那场血雨，你迟早，还会再见到。"],pace:"normal" /*v45inj:disaster_blood_rain_source*/,
options:[
{t:"深入调查", go:"quest_hub"},
{t:"退出去找帮手", go:"quest_hub"}
]
}};

N["ending_v24_succession"]=function(){return{tag:"ending",
place:"结局·传承",
text:["你站在道路的尽头，回头看了一眼来时的路。那些走过的山川、遇过的人、做过的选择，像一幅长长的画卷，在眼前徐徐展开。", "你忽然想起，很久以前，也有人站在同样的地方，把一支火炬交到你手里。如今，轮到你了。", "你把火炬举起来。火光在风中摇曳，却始终没有熄灭。你把它交给了身后那个等待的年轻人——他接过火炬时，眼神里有和你当年一样的忐忑和决心。", "你退后一步，看着火光继续向前。故事没有结束，它只是换了个人，继续往下写。", "「继承」这两个字，落在你身上的时候，比想象中重。", "前任守望者把一枚旧徽章交到你手里。徽章很轻，但金属的边缘已经磨得发亮——它被很多人戴过，在很多的夜里，被人反复摩挲。", "「我不是选一个最强的人。」他说，「我是选一个，在最坏的时候，还愿意留下来的人。」他看着你，「你留下来过。我看见了。」", "你握着徽章，金属的凉意从掌心传上来。你没有说话。有些话，此刻说，显得轻了。", "他转身离开，走到门口，又停住：「从今天起，你守的不是一个位置。是那些在夜里赶路的人。」他没有回头，「他们不知道你的名字。但他们会知道，有人在守着。」", "你一个人站在空屋里，握着那枚徽章。窗外的天，正在变亮。"],pace:"normal" /*v45inj:ending_v24_succession*/,
options:[
{t:"目送火光远去", go:"ending_check"},
{t:"转身继续自己的路", go:"world_continue"}
]
}};

/* /v62inj:chunk-academy/ N["academy_elda_tournament_combat"] 已移入 chunks/v62_academy.js */
N["adventure_log"]=function(){return{
place:"冒险日志",
text:["你在灯下翻开冒险日志，补记这几天的见闻。笔尖划过纸面，发出沙沙的声响，像是给日子打上记号。", "你记下走过的地方、见过的人、还有那些让你睡不着的疑问。有些事写下来之后，再看一遍，思路会清晰很多。", "日志写了大半页，你停笔，看着窗外。夜色很静，远处传来几声犬吠。你合上日志，把它压在枕头底下——明天的事，明天再想。", "你吹熄了灯。黑暗里，你听见自己的心跳，平稳而有力。日子就是这样一天天过去的——只要你还在写，故事就还在继续。", "你翻开冒险日志。你走过的路，做过的事，一条一条，记在上面。", "你翻着那些记录。有些，你已经记不清了；有些，你还记得清清楚楚。你看到某一条，停住了——那是，一个让你，想了很久的选择。", "你合上日志。你坐在那里，想了一会儿。你忽然想，如果当时，选了另一条路，现在，会是什么样。", "你想了一会儿，没有答案。你摇了摇头，把日志，收好。", "你站起来，走出门。你知道，明天，还会有新的记录，写进这本日志。", "你收拾停当，离开冒险日志，沿着来路踏上行程。"],pace:"normal" /*v45inj:adventure_log*/,
options:[
{t:"合上日志休息", go:"act_rest"},
{t:"继续赶路", go:"world_continue"}
]
}};

/* /v62inj:chunk-academy/ N["academy_forbidden_section"] 已移入 chunks/v62_academy.js */
N["battle_start_orc_warrior"]=function(){return{
place:"战斗·兽人战士",
text:["一个兽人战士拦在你面前。他比你还高出一个头，肩宽体壮，手里握着把带着豁口的战斧，斧刃上还沾着干涸的血迹。", "「站住。」他的声音像石头滚过地面，「这片地界，归我们部落管。想过去，留下买路财——或者，留下你的一只手。」", "他上下打量你，眼神里没有恶意，只有一种纯粹的、打量猎物般的认真。看得出，他不怕你逃跑，也不怕你反抗——他只是在等一个回答。", "风从草原上吹过来，掀起他的鬃毛。你握紧了武器，心里飞快地盘算着：是讲道理，还是硬碰硬？", "你面对的是一个兽人战士。他比你高一个头，手里的战斧，泛着寒光。", "他没有立刻动手。他看着你，用兽人语，说了什么。你听不懂。你问旁边的翻译。翻译说：「他说，你太瘦了。他让你，先跑。」", "你站在那里，没有跑。你看着他的眼睛，用你会的兽人语，说了一句：「不跑。」", "他愣了一下。然后，他笑了。他笑的时候，露出一口白牙：「好。」他说，「那你，别后悔。」", "他抡起战斧，冲了过来。你侧身，躲过第一斧。你感觉到，斧刃带起的风，刮过你的脸。你握紧手里的武器，迎了上去。", "兽人战士的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:battle_start_orc_warrior*/,
options:[
{t:"尝试交涉", go:"quest_hub"},
{t:"直接战斗", go:"quest_hub"},
{t:"转身就跑", go:"quest_hub"}
]
}};

N["chronicle_main"]=function(){return{
place:"大陆编年史",
text:["你翻开编年史，泛黄的书页上，记载着这片大陆漫长的岁月。王朝兴衰、战争与和平、英雄与恶徒——都在这些密密麻麻的文字里。", "你找到近年来的条目，发现记载越来越简略。编年史官写道：「时局动荡，四方消息难通，是非曲直，恐待后人评说。」", "你合上书，心里忽然涌起一种奇异的感觉：也许有一天，你的名字也会被写进这些书页里——被后人用他们的笔，写成他们眼中的故事。", "你站起身，走出档案馆。阳光下，你的影子落在地上。历史很大，而你很小——但你正在走的路，也许就是未来的史书里，某一页的开头。", "你整理了一下，这段时间，发生的那些事。", "有些事，是大事——它们，改变了这片大陆的方向。有些事，是小事——它们，只改变了你一个人的心情。", "你把它们，一件一件，记下来。你记得很慢，像在给时间，打上印记。", "你合上本子，看着窗外。你忽然觉得，人活着，就是这样——一边经历，一边记录。", "你吹熄灯，躺下。你在想，将来，有人翻到这本册子的时候，会怎么想，你走过的这些日子。", "大陆编年史的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal" /*v45inj:chronicle_main*/,
options:[
{t:"合上编年史", go:"act_rest"},
{t:"继续旅程", go:"world_continue"}
]
}};



// ============================================================
// v38 P0高频死链修复
// ============================================================

// arrive_generic：通用到达节点，根据当前位置动态渲染


// fc_jiaohui_entry：交汇城入口节点
;

// 通用辅助节点
/* /v62inj:chunk-city/ N["city_explore_generic"] 已移入 chunks/v62_city.js */
N["tavern_generic"]=function(){return{
place:"酒馆",
text:["你走进了当地的酒馆。", "酒馆里很热闹，挤满了各种各样的人——商人、冒险者、旅人、佣兵。空气中弥漫着啤酒、烤肉和烟草的味道。酒馆老板在柜台后面忙碌着，酒保在桌子之间穿梭，给客人端酒送菜。", "你找了个空位坐下，点了一杯啤酒和一份烤肉。", "你一边吃，一边听着周围人的谈话。从他们的谈话中，你听到了很多有趣的消息——最近的商路情况、各地的传闻、冒险者的故事。", "（此节点为v38通用酒馆节点，后续将根据具体城市补充完整叙事内容。）", "酒馆里，永远热闹。你推开门，一股热气和酒气，扑面而来。", "有人在划拳，有人在说笑，有人在角落里，一个人，喝着闷酒。你穿过人群，走到柜台前。", "「喝什么？」掌柜的擦着杯子，问你。你点了一杯。他给你倒上，推过来。", "你端着杯子，找了个位子，坐下。你喝了一口，看着周围的人。你听着他们的说笑声，忽然觉得，一个人喝酒，也没那么，冷清。", "你喝完，放下杯子，起身。你走出门的时候，夜风一吹，酒意上头。你站在街上，呼出一口气。你决定，明天，还来。"],pace:"normal" /*v45inj:tavern_generic*/,
options:[
{t:"打听消息", go:"tavern_rumor_generic"},
{t:"和旁边的人聊天", go:"tavern_chat_generic"},
{t:"吃完就走", go:"arrive_generic"},
{t:"在酒馆住一晚", go:"tavern_sleep_generic"}
]}};

N["shop_generic"]=function(){return{
place:"商店",
text:["你走进了当地的商店。", "商店里摆满了各种各样的商品——武器、盔甲、药水、魔法物品、食物、日用品。店主是一个精明的中年人，看到你进来，脸上立刻堆起了笑容。", "「欢迎光临！」他说，「您需要点什么？我们这里什么都有，价格公道，童叟无欺！」", "你浏览了一下货架，看到了很多有趣的东西。", "（此节点为v38通用商店节点，后续将根据具体城市补充完整商品列表和叙事内容。）", "你走进铺子。门上挂着的铃铛，叮当一声，响了一下。", "掌柜的抬起头，打量了你一眼：「要点什么？」他放下手里的账本，走了过来。", "货架上，摆着一些常用的东西。你看着，盘算着，这一趟，该买些什么。", "你挑了几样，递过去。掌柜的接过来，称了称，报了价。你付了钱，他把东西，用纸包好，递给你。", "你接过东西，走出门。铃铛又在身后，叮当一声。你回头，看了一眼，他已经坐回柜台后，继续看账本了。"],pace:"normal" /*v45inj:shop_generic*/,
options:[
{t:"购买物品", go:"shop_buy_generic"},
{t:"出售物品", go:"shop_sell_generic"},
{t:"随便看看就走", go:"arrive_generic"}
]}};

N["world_map_generic"]=function(){return{
place:"世界地图",
text:["你打开了世界地图，查看当前的位置和可以前往的地方。", "地图上标注了大陆的主要城市和地点——交汇城、铁门关、南方港城、圣城、银叶城、铁峰堡、承天城、绿洲城，以及艾尔达大陆学院。", "你可以选择前往任何一个已经发现的地点。", "（此节点为v38通用世界地图节点，后续将补充完整的旅行路线和叙事内容。）", "你摊开地图。羊皮纸上，画着这片大陆的轮廓。", "你看着那些地名——交汇城，铁门关，圣城，银叶城，铁峰堡，承天城……每一个名字，都像一个人，在等你，去认识它。", "你的手指，沿着一条条路，慢慢地移动。你数着，你走过的，和没走过的。", "你看着那些还没去的地方，心里，隐隐地，有些期待。你知道，那些路上，会有人，会有事，会有故事。", "你合上地图，收好。你决定，下一段路，往那个方向，走。"],pace:"normal" /*v45inj:world_map_generic*/,
options:[
{t:"前往交汇城", go:"fc_jiaohui_entry"},
{t:"前往艾尔达大陆学院", go:"academy_main_generic"},
{t:"留在原地", go:"arrive_generic"}
]}};

// 交汇城各地点节点
N["fc_market"]=function(){return{tag:"main",
place:"交汇城 · 集市",
text:["你来到了交汇城的集市。", "集市是交汇城最热闹的地方，摆满了各种各样的摊位——水果摊、蔬菜摊、肉摊、鱼摊、香料摊、布料摊、珠宝摊、魔法物品摊，应有尽有。空气中弥漫着各种气味——水果的香甜、肉类的腥膻、香料的浓郁、鲜花的芬芳，混杂在一起，构成了集市特有的味道。", "你在集市里逛了一圈，看到了很多有趣的东西。", "（此节点为v38交汇城集市节点，后续将补充完整的商品列表和叙事内容。）", "交汇城的市场，永远嘈杂。你走进人群，各种声音，扑面而来。", "卖鱼的，卖布的，卖铁器的，卖吃食的，挤成一片。有人吆喝，有人讨价，有人站在摊前，挑挑拣拣。", "你被人群推着走。你在一间卖饼的摊子前，停下来。摊主是个胖妇人，正忙得满头汗：「热饼！热饼！刚出锅的！」", "你买了一块。饼是烫的，你两手倒换着，吹着气，咬了一口。饼皮脆，馅是咸的，带着一股葱香。你站在人群里，吃完了那块饼。", "你舔了舔手指，继续走。你穿过市场，走到另一头，回头，看了一眼。市场还是那样，吵吵嚷嚷的。你忽然觉得，这样的吵嚷，也，挺好的。"],pace:"normal" /*v45inj:fc_market*/,
options:[
{t:"购买物品", go:"shop_buy_generic"},
{t:"随便逛逛", go:"echo_watchmen_invited"},
{t:"回城门", go:"fc_jiaohui_entry"}
]}};

;

;

N["fc_streets"]=function(){return{tag:"main",
place:"交汇城 · 街道",
text:["你在交汇城的街道上漫步。", "交汇城的街道纵横交错，像一张巨大的蜘蛛网。街道两旁是各种各样的建筑——商店、酒馆、旅馆、赌场、妓院、工会、教堂、豪宅、贫民窟，应有尽有。", "你看到了很多有趣的景象——街头艺人在表演杂耍、小贩在叫卖商品、贵族的马车在街道上飞驰、乞丐在角落里乞讨、守卫在巡逻维持秩序。", "交汇城是一个充满活力的城市，也是一个充满危险的城市。在这里，财富和贫困并存，光明和黑暗交织。", "（此节点为v38交汇城街道节点，后续将补充完整的随机事件和叙事内容。）", "你走在交汇城的街上。石板路，被脚磨得发亮，像一面，旧镜子。", "你经过一间铁匠铺，炉火正红，叮叮当当的声音，从门里传出来。你经过一间酒馆，门口飘着酒香和笑声。你经过一间教堂，钟声正响，一下，一下。", "你在街角，看见一个孩子，蹲在地上，正专心致志地，拨弄着一只甲虫。你停下来，看了一会儿。他抬头，看了你一眼，又低下头，继续拨弄。", "你继续走。你走过桥，看见河水，在桥下，慢慢地流。你扶着栏杆，看了一会儿。你忽然想，这条河，见过多少，在这座城里，来来往往的人。", "你走回住处的时候，天已经黑了。城里的灯，一盏一盏地，亮了起来。你站在巷口，看着那些灯。你忽然觉得，这座城市，白天是白的，夜里，是黄的。"],pace:"normal" /*v45inj:fc_streets*/,
options:[
{t:"去集市", go:"fc_market"}, /* /p12inj:a-entry/ */
{t:"去金衡商会拜访总会长", go:"p12_a_enter"},

{t:"去酒馆", go:"fc_tavern"},
{t:"去工会", go:"fc_guild"},
{t:"去贫民窟看看", go:"echo_thieves_guild_member"},
{t:"回城门", go:"fc_jiaohui_entry"}
]}};

// 通用辅助节点（续）
N["tavern_rumor_generic"]=function(){return{
place:"酒馆 · 打听消息",
text:["你向酒馆老板打听最近的消息。", "酒馆老板是一个消息灵通的人，他擦着杯子，一边给你讲了很多最近的传闻——商路的情况、各地的新闻、冒险者的故事、贵族的绯闻。", "你从他的话中捕捉到了一些有用的信息。", "（此节点为v38通用打听消息节点，后续将补充完整的消息列表和叙事内容。）", "你坐在酒馆的角落里，听了一会儿，人们的闲谈。", "有人在说，北边打仗的事；有人在说，最近来了个奇怪的行商；有人说，城西的旧宅，夜里，有动静。", "说话的人，压低了声音。听的人，有的信，有的不信。你坐在那里，把那些话，一条一条，拣着听了。", "你分不清，哪些是真的，哪些是假的。但你记住了几条——记着，也许，哪天，用得上。", "你喝完杯里的酒，站起来。你走出酒馆的时候，那些闲谈，还在你耳边，嗡嗡地响着。你甩了甩头，把它们，甩到了脑后。", "你与打听消息作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal" /*v45inj:tavern_rumor_generic*/,
options:[
{t:"继续喝酒", go:"tavern_generic"},
{t:"离开酒馆", go:"arrive_generic"}
]}};

N["tavern_chat_generic"]=function(){return{
place:"酒馆 · 聊天",
text:["你和旁边桌的一个冒险者聊了起来。", "他是一个经验丰富的冒险者，去过很多地方，见过很多世面。他给你讲了很多他的冒险故事——讨伐怪物、寻找宝藏、探索遗迹、解救公主。", "你从他的故事中学到了很多有用的经验。", "（此节点为v38通用聊天节点，后续将补充完整的对话内容和叙事内容。）", "你找了个位子，坐下来。同桌的，是个话多的中年人。", "他看见你，便打开了话匣子：「小兄弟，面生啊。从哪来？」你说了。他点了点头：「那地方，我知道。」他说着，便开始，讲他年轻时，走过的那些地方。", "你听着。他讲得，有些夸张，但你听着，觉得，也有趣。他讲累了，喝一口酒，又继续讲。", "你陪他，坐了一会儿。你起身要走的时候，他叫住你：「小兄弟，听我一句——」他压轻声音，「这世上，路，是自己走的。别人说的，听听就行。」", "你谢过他，走出门。你走在街上，想着他最后那句话。你觉得，那句醉话，倒有几分，道理。", "你最后回望一眼聊天，转身穿过街口，往下一程赶路。"],pace:"normal" /*v45inj:tavern_chat_generic*/,
options:[
{t:"继续聊天", go:"tavern_generic"},
{t:"离开酒馆", go:"arrive_generic"}
]}};

N["tavern_sleep_generic"]=function(){return{
place:"酒馆 · 住宿",
text:["你在酒馆开了一间房，准备住一晚。", "房间不大，但很干净。床上铺着干净的床单，窗户上挂着窗帘。你把行囊放在桌上，然后躺在床上，闭上了眼睛。", "你很快就睡着了。在梦中，你看到了一些模糊的画面——古老的遗迹、神秘的符号、遥远的呼唤。", "第二天早上，你被窗外的鸟鸣声叫醒。你伸了个懒腰，感觉精神饱满。", "（此节点为v38通用住宿节点，后续将补充完整的梦境事件和叙事内容。）", "你在酒馆楼上，要了一间房。房间不大，但干净。", "你放下行李，推开窗。夜风，凉凉地，吹进来。你听见楼下，隐约的喧闹声——已经远了，像隔着一层水。", "你躺在床上，看着天花板。你翻了个身。你数着，楼下传来的，断断续续的笑声，慢慢地，困意上来了。", "你闭上眼。你睡着之前，忽然想：明天，又是新的一天。", "你睡得很沉。你醒来的时候，天已经大亮。楼下，酒馆已经开始，忙碌起来了。你起床，洗漱，下楼。新的一天，开始了。", "住宿在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"normal" /*v45inj:tavern_sleep_generic*/,
options:[
{t:"起床出发", go:"arrive_generic"},
{t:"再睡一会儿", go:"tavern_sleep_generic"}
]}};

N["shop_buy_generic"]=function(){return{
place:"商店 · 购买",
text:["你浏览了商店的商品，挑选了一些你需要的东西。", "店主笑眯眯地给你报价，你和他讨价还价了一番，最终以一个双方都满意的价格成交。", "你把买好的东西放进包里，然后离开了商店。", "（此节点为v38通用购买节点，后续将补充完整的商品列表和交易系统。）", "你挑好了东西，拿到柜台前。掌柜的看了一眼：「就这些？」你点了点头。", "他拿起算盘，噼里啪啦地，打了一阵，报了个数。你数出钱，递过去。他接过来，点了点，收进钱匣。", "他把东西，用纸，一件一件地，包好。他包得很仔细，像包一件，贵重的东西。", "「拿好。」他把纸包递给你，「回头客，下次，给你算便宜点。」", "你接过纸包，道了谢，走出门。你掂了掂手里的东西，觉得，这趟，没白来。", "购买的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:shop_buy_generic*/,
options:[
{t:"继续购物", go:"shop_generic"},
{t:"离开商店", go:"arrive_generic"}
]}};

N["shop_sell_generic"]=function(){return{
place:"商店 · 出售",
text:["你把一些不需要的东西拿出来，准备卖给店主。", "店主仔细检查了你的物品，然后给你报了一个价格。你和他讨价还价了一番，最终以一个双方都满意的价格成交。", "你把卖东西得来的钱放进包里，然后离开了商店。", "（此节点为v38通用出售节点，后续将补充完整的物品估价和交易系统。）", "你把手里的东西，放在柜台上。掌柜的拿起来，翻来覆去，看了看。", "「这东西，」他开口，「你想卖多少？」你说了个数。他想了想，摇了摇头：「高了。」", "你们来来回回，磨了一会儿。最后，以一个，你们都能接受的价格，成交了。", "他数了钱，递给你。你接过钱，数了数，收好。", "你走出门，回头，看了一眼。他已经把你的东西，摆到了货架上。你忽然觉得，有些东西，一旦卖了，就再也，拿不回来了。", "你离了出售，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:shop_sell_generic*/,
options:[
{t:"继续卖东西", go:"shop_generic"},
{t:"离开商店", go:"arrive_generic"}
]}};

N["guild_quests_generic"]=function(){return{
place:"冒险者工会 · 任务列表",
text:["你走到任务告示板前，查看当前可以接取的任务。", "告示板上贴满了各种各样的任务——从简单的「找猫」「送信」到困难的「讨伐怪物」「探索遗迹」，应有尽有。每个任务都标注了难度、报酬和发布者。", "你仔细浏览了任务列表，挑选了一些你感兴趣的任务。", "（此节点为v38通用任务列表节点，后续将补充完整的任务系统和叙事内容。）", "公会大厅的布告栏前，围了几个人。你凑过去，看那些悬赏。", "有送信的，有找东西的，有护卫商队的。每一张纸下面，都标着，酬劳。", "你一张一张地看。你挑了一张，揭了下来。你拿到柜台前，办事员看了一眼：「这个，有点远。」他顿了顿，「不过，酬劳不错。」", "你接了。你走出公会大厅的时候，把那张纸，折好，收进怀里。你决定，明天，就出发。"],pace:"normal" /*v45inj:guild_quests_generic*/,
options:[
{t:"接取一个简单任务", go:"guild_quest_easy_generic"},
{t:"接取一个困难任务", go:"guild_quest_hard_generic"},
{t:"离开工会", go:"echo_watchmen_invited"}
]}};

N["guild_register_generic"]=function(){return{
place:"冒险者工会 · 登记",
text:["你来到工会的登记处，准备登记成为一名冒险者。", "登记处的工作人员是一个年轻的女孩，她递给你一张登记表，让你填写个人信息——姓名、年龄、职业、专长、冒险经历。", "你认真填写了表格，然后交给了她。她仔细看了一遍，然后点了点头，从抽屉里拿出了一枚铜质的徽章递给你。", "「从今天起，你就是一名正式的冒险者了。」她说，「这是你的冒险者徽章，等级是F级（最低级）。你可以通过完成任务来提升等级。」", "你接过徽章，把它别在胸前。", "（此节点为v38通用登记节点，后续将补充完整的冒险者等级系统和叙事内容。）", "你走到柜台前，说要注册。办事员抬起头，打量了你一眼：「名字？」你说了。他低头，在本子上，记了下来。", "「职业？」你说了。「出身地？」你说了。他一条一条地记，记完，又问你：「有什么，特别擅长的？」你想了想，说了一两样。", "他合上本子：「行。从今天起，你就是公会的，注册冒险者了。」他顿了顿，递给你一枚，小小的铁牌，「拿着。接活，要验这个。」", "你接过铁牌。牌子上，刻着你的名字，和一个编号。你把它，翻来覆去，看了看。", "你把它，收好。你走出大厅的时候，把那枚铁牌，又拿出来，看了一眼。你忽然觉得，从这一刻起，你算是一个，正式的，冒险者了。"],pace:"normal" /*v45inj:guild_register_generic*/,
options:[
{t:"查看任务列表", go:"guild_quests_generic"},
{t:"离开工会", go:"fc_streets"}
]}};

N["guild_info_generic"]=function(){return{
place:"冒险者工会 · 情报",
text:["你来到工会的情报处，准备打听一些情报。", "情报处的工作人员是一个戴着眼镜的中年男人，他看起来很博学。他告诉你，工会可以提供各种各样的情报——怪物的弱点、遗迹的位置、商路的情况、势力的动态，只要你付钱，什么都可以告诉你。", "你付了一笔情报费，然后向他询问了你感兴趣的话题。他给你讲了很多有用的信息。", "（此节点为v38通用情报节点，后续将补充完整的情报列表和叙事内容。）", "你走进了公会大厅。大厅里，人来人往。", "你站在布告栏前，看了一会儿。有人从你身边，匆匆走过；有人蹲在角落，等着接活。", "你走到柜台前，问了问，最近，有什么差事。办事员翻了翻本子，说了几件。你听着，记下了。", "你谢过他，走出大厅。你站在门口，想了一会儿。你决定，先去看看，那几件差事里，最顺路的那件。"],pace:"normal" /*v45inj:guild_info_generic*/,
options:[
{t:"继续打听情报", go:"guild_info_generic"},
{t:"离开工会", go:"fc_streets"}
]}};

N["fc_slums_generic"]=function(){return{tag:"main",
place:"交汇城 · 贫民窟",
text:["你来到了交汇城的贫民窟。", "贫民窟是交汇城最贫穷的地区，位于城市的东南角。这里的街道狭窄而肮脏，房屋破旧而拥挤，空气中弥漫着垃圾和污水的味道。", "你看到了很多令人心酸的景象——骨瘦如柴的乞丐、面黄肌瘦的孩子、衣衫褴褛的老人、在垃圾堆里觅食的野狗。", "贫民窟是一个被遗忘的角落，也是一个充满危险的地方。在这里，犯罪率很高，治安很差，晚上甚至连守卫都不敢进来巡逻。", "但你也注意到，贫民窟里的人们虽然贫穷，却很团结。他们互相帮助，互相扶持，在艰难的环境中努力生存。", "（此节点为v38交汇城贫民窟节点，后续将补充完整的贫民窟事件和叙事内容。）", "旧城区的日子，和别处，不太一样。这里的时间，好像，走得慢一些。", "你坐在一条巷子的石阶上，看着来往的人。有人扛着东西，有人提着菜，有人蹲在墙角，抽着烟。没有人看你。", "一个小孩，跑过来，又跑过去。他跑第二趟的时候，停下来，看了你一眼：「你坐这儿，做什么？」你说，歇歇。他说：「哦。」他又跑了。", "你坐了一会儿，站起来。你拍了拍裤子上的灰，继续走。你经过一户人家，门口晾着衣服，你闻到，一股皂角的气味。", "你走出旧城区的时候，回头，看了一眼。那些灰色的房子，挤在一起，安安静静的。你忽然觉得，这个地方，虽然旧，但，是活的。"],pace:"normal" /*v45inj:fc_slums_generic*/,
options:[
{t:"帮助贫民窟的人", go:"fc_slums_help_generic"},
{t:"在贫民窟探索", go:"fc_slums_explore_generic"},
{t:"离开贫民窟", go:"fc_streets"}
]}};

/* /v62inj:chunk-academy/ N["academy_main_generic"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_class_choose"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year1_class_soul"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_audience"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_grades"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year2_tournament_signup"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_adventurer"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_aftermath"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_church"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_magic_tower"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_merchant"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_midterm"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year3_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_dorm"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_hide"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_library"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year4_mercury"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_adventurer"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_church"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_merchant"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_rest"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_year5_graduate_seals"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-city/ N["city_chengtian_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_chengtian_li_guide"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_chengtian_mountain"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_academy"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_forgiven"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_inn"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_inquisition_sneak"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_inquisition_talk"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_mass"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_buy"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_copper_lie"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_copper_truth"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_drink"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_furnace"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_learn"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_listen"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_palace"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_herb_quest"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_inn"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury_queen"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury_seals"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury_seraph"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury_soul"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mystery"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_scroll"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_suspicious"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_wang_guide"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_weapon"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_lvzhou_desert"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_lvzhou_elders"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_lvzhou_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_nanfang_chen_guide"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_nanfang_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_nanfang_tavern"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_shengcheng_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_shengcheng_john_guide"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_shengcheng_library"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiefeng_bottom"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiefeng_elders"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiefeng_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiemenguan_army"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiemenguan_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_tiemenguan_zhao_brothers"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_yinye_elders"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_yinye_explore"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_yinye_roots"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-npc/ N["classmate_alexander_family"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_alexander_friend"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_allen_duel"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_arthur_kingdom"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_arthur_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia_ask_mercury"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia_marcus_talk"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_elena_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_elena_worldtree"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_grommash_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_grommash_tribe"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_lilith_eclipse"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_lilith_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_marcus_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_marcus_sister"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_mercury_huang"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_mercury_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_mysterious_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_mysterious_war"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_thorin_father"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_thorin_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_vivian_church"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_vivian_promise"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-origin/ N["origin_church_abnormal_hide"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_abnormal_jump"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_abnormal_run"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_edge_explore"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_leave_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_leave_aunt"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_eternal_forge"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_leave_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_leave_friends"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_east_ancient_cave"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_east_leave_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_east_leave_master"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_leave_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_leave_friends"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_worldtree_root"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_abnormal_follow"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_abnormal_knock"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_abnormal_shout"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_choice_guard"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_choice_ignore"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_choice_li"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_choice_wait"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_choice_watcher"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_daily_3"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_leave_friends"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_leave_walk"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_sea_deck"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_north_abnormal_fight"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_north_abnormal_hide"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_north_choice_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_north_choice_flee"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_north_choice_heal"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_leave_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_leave_fight"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_leave_hide"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_south_abnormal_ask"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_south_abnormal_eavesdrop"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_south_daily_2"] 已移入 chunks/v62_origin.js */
N["travel_desert_day2"]=function(){return{
place:"沙漠路线·第二天",
text:["夜里，你在岩壁下露营。商队的人围着一小堆火，火光照着一张张被晒得通红的脸。", "一个老商贩拨着火，忽然开口：「你们知道，沙漠为什么要叫『死亡沙漠』吗？」", "没人接话。他自己接下去：「不是因为热，也不是因为渴。是因为——它太安静了。安静到，你会听见自己心里的话。」", "他往火里添了根柴：「一个人心里要是装着事，走这沙漠，最容易疯。疯的人，就走不出去了。」", "他说完，裹紧毯子，不再说话。火堆噼啪地响着。", "你躺在毯子上，看着满天的星星。沙漠的星，亮得不像话，像有人在天上撒了一把碎银子。你想起老商贩的话，忽然有点明白，为什么这条路上，很多人走着走着，就不见了。", "沙漠的第二天，你才真正见识了它的脾气。", "清晨还凉飕飕的，到了正午，太阳像烙铁一样烤着地面。空气在颤抖，远处的沙丘像在流动。你裹着防沙的布巾，一步一步地挪。", "午间，商队在一处岩壁下歇脚。岩壁投下窄窄的影子，所有人和牲口都挤在那片影子里，像一群快被晒干的鱼。", "黄昏，太阳终于斜下去。风开始变凉，你裹紧袍子。商队向导说：「沙漠里，最要命的不是热，是温差。白天晒掉皮，晚上冻掉牙。」你听着，把干粮又省下了一口。", "天还没亮，商队就出发了。", "清晨的沙漠，凉得像水。你裹着袍子，走在队伍中间，听着驼铃一声一声地响。", "你忽然发现，昨夜的星星，此刻还挂在西边，一颗一颗地淡下去，像被天亮一点点吃掉。", "老商贩走在前面，没有回头，声音却飘了过来：「小子，昨晚睡得着吗？」", "「睡得着。」你说。", "他笑了一声：「那就好。睡得着的人，走得出去。」", "你听着驼铃声，一步一步，踩着黎明前的沙，朝太阳升起的方向走去。"],pace:"normal" /*v45inj:travel_desert_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在岩壁附近看看", go:"travel_desert_explore"}
]
}};

N["travel_desert_day2_solo"]=function(){return{
place:"沙漠路线·独行·第二天",
text:["独行穿越沙漠的第二天，你尝到了绝望的滋味。", "水快喝完了。你的嘴唇干裂，喉咙像着火一样。太阳毒辣辣地挂着，连风都是烫的。你开始怀疑，自己是不是选错了路。", "你靠着最后一点意志，机械地迈着步子。忽然，你脚下踢到一个硬物——你低头，刨开沙子，是一只水囊。沉甸甸的，灌满了水。", "你愣了一会儿，拧开盖子，先抿了一小口，然后把水囊紧紧抱在怀里。沙漠里有人放水囊——这是给迷路的人留的活路。你记住了这个位置，心想：将来，我也要放一只。", "沙漠的第二天，你开始懂得，为什么这里的人话都少。因为说话要费水。", "太阳一升起来，沙地就变成了一片白花花的镜面，晃得人睁不开眼。你裹着头巾，只露出一双眼睛，跟着前面的驼队脚印走。", "你带的水平壶已经下去三分之一。你舔了舔嘴唇，嘴唇已经裂了。你不敢多喝，只抿一小口，含在嘴里，慢慢咽。", "午后，你看见远处有一片发亮的东西，像湖。你心里一紧——你知道那是海市蜃楼。但你还是看了很久，因为那湖太像真的了，像得让人想走过去。", "你想起老向导说的话：「沙漠里，最危险的不是渴，是希望。它给你看一个假的湖，你就忘了省水。」", "你低下头，不再看那个湖。你数着自己的步子，一步，两步，三步。沙在脚下陷下去，又弹起来。风把沙粒吹进领口，磨得皮肤生疼。", "黄昏的时候，你终于看见了那个真的驿站——灰扑扑的土墙，门口挂着半旧的灯笼。你走过去，拍开门，里面的人看了你一眼，什么也没问，给你倒了一碗水。", "那碗水，是你这辈子喝过最甜的。"],pace:"normal" /*v45inj:travel_desert_day2_solo*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在附近找找标记", go:"travel_desert_explore"}
]
}};

N["travel_desert_explore"]=function(){return{
place:"沙漠路线·探索",
text:["沙漠的白天，热得像一只扣过来的铁锅。", "你沿着商道的旧车辙走，脚下的沙是烫的，隔着靴底都能感觉到。风带着沙子，打在脸上，像细碎的针。", "你停下来喝水。水囊里的水已经不多了，你抿了一小口，润了润嘴唇，又拧紧盖子。", "前方，热浪把地面扭曲成一片晃动的湖。你盯着那片湖看了很久——它一直在那里，可你知道，走过去，什么都没有。", "你低下头，继续走。在这片沙漠里，幻觉比食物更危险。你记住了一个道理：看见水，先别跑；先看看，自己是不是渴了太久。", "你在一处沙丘的背风面，发现了一具骸骨。", "它半埋在沙里，身上还裹着破旧的袍子。你蹲下来，小心地翻看——骸骨旁边，散落着一卷羊皮纸。", "你捡起羊皮纸，拂去沙子。上面用褪色的墨水写着：「第二十七日，断水。往东走，有一座绿洲——但我走不动了。如果后人看到这个，把我的水囊带走，往东。」", "你按照羊皮纸的指引，向东走了半日，果然找到了一口枯井——井里没有水，但井壁上，有人刻着一个箭头，指向更深处的沙漠。你站在井边，望着箭头所指的方向，久久没有说话。", "入夜之后，沙漠忽然冷下来。", "你裹着毯子，坐在沙丘的背风面，看着头顶的星星。沙漠的星空，比任何地方的都近——星星密密麻麻，像有人打翻了一袋碎银子。", "风停了。静下来的沙漠，静得可怕。你能听见自己的心跳，能听见沙粒在极缓慢地流动，发出沙沙的、像时间本身在走的声音。", "你忽然听见，远处传来一声极轻的铃响。一下，又一下，像是有人在赶路，又像是风在作怪。", "你没有动。你等着。那铃声停了一会儿，又响了两下，然后消失了，再没有出现过。", "你守着火，直到天亮。那晚你睡得很少。但你知道，有些声音，不该追。"],pace:"normal" /*v45inj:travel_desert_explore*/,
options:[
{t:"沿箭头方向走", go:"travel_resolve"},
{t:"把骸骨埋了再走", go:"travel_desert_day2"}
]
}};

N["travel_dwarf_day2"]=function(){return{
place:"矮人路线·第二天",
text:["通往铁峰堡的路，第二天开始爬坡。官道变成了山道，商队的骡子喘着粗气，一步一步往上挪。", "风变冷了，夹着矿石和硫磺的气味。向导说，闻到这味儿，说明离矮人的地界不远了。山体开始裸露，露出深色的岩层，像巨兽的骨骼。", "午间，你们在一处山隘歇脚。隘口有一座石亭，亭柱上刻着矮人文。向导念道：「过客须知：山里有客人，也有强盗；锤子可以借，手艺不能丢。」你听着，觉得矮人真是有趣的种族。", "傍晚，你们终于看见了铁峰堡的影子——一座嵌在山腹里的城，烟囱冒着黑烟，把半边天都熏成了灰色。", "往矮人领地去的那条路，越走，山越多。你站在一处山脊上，看着前方连绵的、灰扑扑的山影，心里忽然有点发怵。", "你想起了铁峰堡——想起那里的炉火，想起那些矮人，想起他们递给你铁牌时，那种沉甸甸的、不说出口的情分。", "你继续走。山路的石头，越来越硌脚。你走一段，歇一段。你发现，山里的天黑得特别早，也冷得特别快。", "你扎营的时候，已经冷得手指发僵。你生起火，烤着手。火光里，你想起了那个挂在你脖子上的铁牌——你伸手，摸了摸。铁牌还带着你体温，不凉。", "你看着火，忽然觉得，这山里的夜，好像也没那么冷了。"],pace:"normal" /*v45inj:travel_dwarf_day2*/,
options:[
{t:"进城", go:"travel_resolve"},
{t:"在山隘看看", go:"travel_dwarf_explore"}
]
}};

N["travel_dwarf_day2_solo"]=function(){return{
place:"矮人路线·独行·第二天",
text:["独行的第二天，你走在山间的矮人古道。", "古道是石板铺的，被无数年月的脚步磨得光滑。石板缝里长着青苔，踩上去，稍发滑。你走得很慢，因为每一块石板上，都刻着一把锤子的图案。", "你蹲下来，摸了摸其中一块。锤子图案刻得很深，线条粗犷——那是矮人留下的记号，每一把锤子，代表一个走过这里的矮人匠人。", "你数了数，从古道这头到那头，锤子图案数不清。你忽然想，这条路，曾经有多少人走过，才磨出这样的光泽。", "你站起来，继续走。路过一块特别大的石板时，你发现它上面的锤子图案，比其他所有都大——旁边刻着一行矮人语，你认出了几个字：「第一把锤子，打在这里。」", "你在那块石板前站了一会儿，然后朝它弯了弯腰，才继续上路。", "独行翻山的第二天，你在一个岔路口犯了难。", "两条路：一条大路，绕远，但平坦；一条小路，近，但要穿过一段废弃的矿道。一个赶驴的矮人告诉你：「小路近，但矿道里黑。你要是怕黑，走大路。」", "你选了小路。你点起火把，走进矿道。矿道里很安静，只有你的脚步声和滴水声。墙上还有旧的挖痕，和一些看不懂的刻字。", "你走到一半，火把的光忽然跳了一下。你停下脚步，屏住呼吸——前方的黑暗里，有什么东西，正静静地看着你。你握紧了火把，又往前走了一步。", "傍晚，你在一个矮人的驿站歇脚。", "驿站很小，只有一张桌子和几条长凳。看店的矮人老头给你端来一碗热汤，汤里飘着蘑菇和野菜，喝下去，浑身都暖了。", "「一个人走山道？」他问。你点头。他哼了一声：「胆子不小。山道上的野物，专挑独行的人。」", "「可我一路走来，很平安。」你说。", "他看了你一眼，忽然笑了：「那你是运气好。或者——」他顿了顿，「这条路，认你。」", "「路还会认人？」你问。", "他没有回答，只是又给你盛了一碗汤：「喝了这碗，好好睡。明天天一亮，我带你走一段——山道上的第一块石板，我替你打过了。」"],pace:"normal" /*v45inj:travel_dwarf_day2_solo*/,
options:[
{t:"继续前进", go:"travel_resolve"},
{t:"退回大路", go:"travel_dwarf_day2"}
]
}};

N["travel_dwarf_explore"]=function(){return{
place:"矮人路线·探索",
text:["你在山道旁发现一处废弃的矿口。木支架已经腐朽，矿口黑洞洞的，像一只睁着的眼睛。", "你犹豫了一下，还是钻了进去。里面比想象中深。走了几十步，你发现墙上刻着一些图画——不是文字，是画：一群人，围着一团火，火里有一颗跳动的心。", "你在画前站了很久。那团火、那颗心——你忽然想起，矮人族流传的那句话：铁峰堡的熔炉里，跳动着大地的心脏。", "你没有再深入。你退出矿口，把洞口用碎石掩好——你不想让别的人，也看见这些画。有些秘密，知道的人越少越好。", "往矮人领地走的路上，山越来越多，路越来越窄。最后，路消失了——只剩下一条贴着悬崖的石阶，一级一级，往高处爬。", "你踩着石阶往上走，手扶着岩壁。岩壁上刻着许多符号，有的像字，有的像画。你认不出，但能感觉到，它们排得很密，像是有人刻了一辈子。", "你停下来，用指尖描了一个符号。笔画很深，边缘磨得光滑——刻它的人，一定回来摸过很多次。", "你继续往上走。风从崖底吹上来，呜呜地响。你听见身后有脚步声——回头，是一个矮人，背着一捆矿石，正不紧不慢地跟在你后面。", "他经过你身边的时候，看了你一眼：「外乡人，来铁峰堡？」你点头。他说：「那走快些。天黑前，得进堡门。」他顿了顿，「山里入夜，不太平。」", "他没有等你，自顾自地走了，脚步稳当，像走了一辈子这条路。你加快脚步跟上他。他走得快，你也得快。"],pace:"normal" /*v45inj:travel_dwarf_explore*/,
options:[
{t:"回到山道", go:"travel_resolve"},
{t:"继续赶路", go:"travel_dwarf_day2"}
]
}};

N["travel_east_day2"]=function(){return{
place:"东方路线·第二天",
text:["东方的路，第二天开始变得平坦。平原在眼前铺开，麦田一片连着一片，远处的村庄升起炊烟。", "你跟着商队走，路边的景色一成不变，又一直在变。你渐渐明白，东方是另一种富饶——不是北方的铁，不是南方的盐，是脚下的土地本身。", "午间，你们在一座驿站歇脚。驿站里贴着官府的告示：东边某个县，闹了「怪病」，来往行人绕行。你多看了那告示几眼，把路线记在心里。", "黄昏扎营时，你在营火边听商队的老人讲东边的传说：承天山下，埋着一道会发光的裂缝，谁靠近它，谁就会忘记时间。你没有接话，但心里咯噔了一下。", "往东走的第二天，你第一次，真正看清了承天山的轮廓。", "它不是你想象的那种尖顶的山。它像一堵巨大的、横亘天边的墙，灰蓝色的，在晨光里，显得又远又沉。你站在路上，看了它很久。", "你继续走。路两边的田地里，有人在劳作。你经过一个村子，村口的老人，正坐在石墩上，晒着太阳。他看见你，招招手：「赶路的？」你说是。他指了指前面的路：「沿着走，过了河，就是官道。」", "你谢过他，继续走。走了几步，他又喊住你：「哎，小伙子——」你回头。他说：「承天山上，有个庙。庙里有个老和尚，解签特别准。你要是有心事，去求一签。」", "你笑了笑，朝他挥挥手。你继续走。你看着远处那座山，心里，忽然多了点什么。你说不清那是什么。但你知道，你大概，会去那庙里，求一签。"],pace:"normal" /*v45inj:travel_east_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"打听怪病的传闻", go:"travel_east_explore"}
]
}};

N["travel_east_day2_solo"]=function(){return{
place:"东方路线·独行·第二天",
text:["独行的第二天，你在平原上走得很快。没有商队拖累，你的步子轻快得多。", "正午，你在一棵大槐树下歇脚。树下有块磨得发亮的石头——看来是路人们惯常歇脚的地方。你掏出干粮，就着凉水啃。", "忽然，一个赶路的老者在你旁边坐下，也掏出干粮啃了起来。他打量了你几眼：「小兄弟，一个人走东边？」「嗯。」「胆子不小。」他说，「东边地界大，人也杂。一个人走，小心些。」", "你谢过他的提醒。他摆摆手，啃完干粮，拍拍屁股走了。你看着他远去的背影，又看看自己面前的路，把行囊紧了紧。", "东行的第二天，你进入了一片丘陵地带。路在山坡之间蜿蜒，时上时下。", "你走上一道山脊，视野豁然开朗——远处，承天城的轮廓出现在天际线上，灰墙灰瓦，在暮色里像一头伏着的巨兽。", "你停下脚步，看了一会儿。那就是你此行的目的地。它比你想的远，也比你想的大。", "你继续走。下山的路不好走，石头松动，你得扶着路边的灌木。一只蜥蜴从你脚边窜过去，钻进石缝里，尾巴还露在外面，一晃，不见了。", "黄昏的时候，你在一处山坳里歇脚。你坐在石头上，吃干粮，看天边的晚霞一层一层地暗下去。", "你忽然想，明天进了城，你就是那个城里的人了。你在城外看它的时候，它在暮色里沉默着。等你进了城，它会变成什么样子呢？", "你把这个念头咽下去，和最后一口干粮一起。明天的事，明天再说。"],pace:"normal" /*v45inj:travel_east_day2_solo*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"追上去问路况", go:"travel_east_explore"}
]
}};

N["travel_east_explore"]=function(){return{
place:"东方路线·探索",
text:["东边的路，从一片古战场边穿过。", "你远远就看见了那些东西——断矛，残盾，半埋在土里的盔甲，锈得看不出原来的颜色。风一吹，沙土扬起，露出更多的碎片。", "你走进去，脚踩在松软的土上。你低头，看见土里露出一截白色的东西——是骨头。不知道是多少年前的，已经和泥土一个颜色了。", "你在那里站了一会儿。风把那些锈铁吹得呜呜响，像一群还不想走的人，在低低地说话。", "你没有久留。你走出那片战场的时候，太阳正从云层后面出来，把那片地照得发白。你回头看了一眼——那些断矛残盾，在光里，像一片沉默的碑林。", "你离开官道，去看传说中那道「会发光的裂缝」。你找到它时，天色将晚。", "它不在山脚，在一座矮丘的背面。一道裂缝，从地面裂开，不宽，但深不见底。裂缝边缘的石壁上，覆着一层淡蓝色的光，像霜，又像雾。", "你蹲在裂缝边，盯着那层光看了很久。你伸手想碰——手指刚靠近，一阵恍惚袭来，你觉得时间好像慢了半拍。你猛地缩回手，心跳如鼓。", "你后退几步，稳住心神。你想起那些传说，想起承天山。你决定把这个发现记在心里，然后快步离开——有些东西，不是现在的你该碰的。", "傍晚，你在一个破败的驿站歇脚。", "驿站早就没人了。屋顶塌了一角，门板歪着，风从各处漏进来。墙角有一张床，铺着发黑的稻草。", "你生了火，靠着墙坐下。火光里，你看见墙上有人用炭笔写了一行字，字迹歪歪扭扭：「走到这里的人，都累了。」", "下面还有一行，字不一样，像是另一个人写的：「累就歇。歇好了，再走。」", "你看着那两行字，坐了很久。然后你把火拨旺了些，靠着墙，闭了眼。那一夜，你睡得很沉。"],pace:"normal" /*v45inj:travel_east_explore*/,
options:[
{t:"回到官道", go:"travel_resolve"},
{t:"记住这个位置", go:"travel_east_day2"}
]
}};

;

N["travel_elf_day2"]=function(){return{
place:"精灵路线·第二天",
text:["通往银叶城的路，第二天就钻进了森林。树木越来越高，阳光越来越少，空气里弥漫着苔藓和树脂的气息。", "商队向导说，这条路是精灵们开辟的「静路」——路上的每一棵树，都是精灵种下的。你抬头，树枝在头顶交织成穹顶，偶尔有银色的光点从树缝漏下来。", "午间，你们在一处林间空地歇脚。空地上立着一块石碑，碑文是精灵文。向导说：「这是三百年前，一位精灵长老的墓。他在人类战争中救了一整队士兵。」", "你站在碑前，读了很久那看不懂的碑文。你想起精灵们常说的一句话：时间长河里的每一个善举，都会在某个时刻，开出花来。", "前往精灵领地的第二天。你一早醒来，发现营地里，多了一层薄霜。", "你呵着气，烤着手，看着远处的林子。那些树，比昨天，更高了，也更密了。你走在林间，脚下的落叶，很厚，踩上去，沙沙地响。", "你在一棵老树下，停下来。树干上，刻着一道一道的痕迹——像是什么人，用刀，一道一道，划上去的。你数了数，至少有几十道。", "你问向导，这些痕迹，是什么。向导看了一眼：「树的年记。」他说，「精灵们，每过一百年，会给老树，记一道。」他顿了顿，「这棵树，记了三十七道了。」", "你站在那里，看着那三十七道痕迹。你忽然觉得，这座林子，比你，老了太多。你伸出手，摸了摸树干。树皮很粗，很凉。"],pace:"normal" /*v45inj:travel_elf_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在森林里探索", go:"travel_elf_explore"}
]
}};

N["travel_elf_day2_solo"]=function(){return{
place:"精灵路线·独行·第二天",
text:["独行进入森林的第二天，你迷路了。", "不是那种彻底的迷失——你大概知道方向，但精灵的森林有自己的意志。你沿着直觉走了半日，发现又绕回了同一棵双生树前。", "你索性坐下来，靠着树干休息。你注意到，这棵树的树皮上，刻着一行小小的字——是人类文字：「第三十七次经过这里。精灵树，你真倔。」你笑了。", "你在树下歇够了，重新辨别方向。这一次，你选择跟着一只飞过的银色小鸟走。它带着你，七拐八绕，居然真的把你带出了林子，眼前豁然开朗——银叶城的树冠，正在远处闪光。", "独行的第二天，你走进了精灵的领地边缘。林子，从这时起，开始不一样了。", "树变高了，也变密了。阳光从树冠的缝隙里漏下来，在地面上，洒成一片一片的碎金。空气里，有一种淡淡的、潮湿的草木香。", "你走在林间的小路上，脚步放得很轻。你总觉得，有什么东西，在看着你——不是恶意的看，是那种，森林对陌生闯入者，本能的打量。", "你在一棵老树下，坐下来歇脚。你抬头，看着树冠。你发现，这棵树，比你想的，老得多——树干上，长满了青苔，像一件，穿了很久的旧衣裳。", "你伸手，摸了摸树皮。你忽然想起，银叶城那些精灵，他们看树的眼神，像看家人。你当时不懂。现在，你坐在树下，好像，懂了一点点。"],pace:"normal" /*v45inj:travel_elf_day2_solo*/,
options:[{t:"走向银叶城", go:"travel_resolve"},
{t:"回头看看森林", go:"travel_elf_explore"}, {"t": "停下脚步，听林道里的树歌", "go": "travel_elf_treesong"}]
} /*v45opt:travel_elf_day2_solo*/};

N["travel_elf_explore"]=function(){return{
place:"精灵路线·探索",
text:["那棵银树，你后来又去看了一次。", "这次你没有走近，只是远远地站着。暮色里，银树的光更亮了，像一盏沉在水底的灯。", "你想起小时候听过的一个精灵故事：银树是森林的眼睛，它记得每一个路过的人。你当时不信，可此刻，你总觉得，那棵树在看你。", "你蹲下来，在树洞边又放了一枚铜板——和昨天那枚叠在一起。", "你站起来，准备离开。风忽然吹过树梢，一片银叶子打着旋，落在你脚边。你捡起来，它的边缘依旧锋利，可这一次，你握在手里，觉得它是温的。", "你把叶子收进怀里。你忽然觉得，这趟路，值了。", "你在森林深处发现了一棵与众不同的树——它的树皮泛着淡淡的银光，像被月光浸过。", "你走近它。树下落着几片银色的叶子，你捡起一片，入手冰凉，边缘锋利得像薄刃。你把它收进怀里。", "你绕着树走了半圈，发现树根处有一个小小的树洞。洞里放着一只陶罐，罐口用蜡封着。你犹豫了一下，没有打开——那不是你的东西。", "你只在树洞边放了一枚铜板，当作「路过的礼物」。精灵们说，森林会记住每一次善意的触碰。你离开时，回头看了一眼，那棵银树在暮色里，静静地发着光。", "回到商队的营地，天已经黑了。", "精灵向导看见你，只问了一句：「你见到那棵树了？」你点头。他没有多问，只说了句：「它很少让人见第二次。」", "你问他那棵树是什么。他沉默了很久，久到你以为他不会回答了。然后他说：「那是一棵记得路的树。它替整片森林，记着所有来过的人。」", "「记着做什么？」你问。", "「等他们迷路的时候，好带他们回家。」他说完，起身走开了。", "你坐在火边，摸着怀里的银叶。你忽然明白，你捡到的，不是一片叶子——是这整片森林，给你的一张地图。"],pace:"normal" /*v45inj:travel_elf_explore*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"回到商队", go:"travel_elf_day2"}
]
}};

N["travel_north_day2"]=function(){return{tag:"branch",
place:"北方路线·第二天",
text:["第二天清晨，商队的铃铛把你叫醒。帐篷外的火堆还冒着青烟，霜冻的地面在脚下咯吱作响。", "队伍里的老马夫递给你一碗热粥：「喝吧。今天要翻两道丘陵，路不好走。」你接过碗，粥的热气扑在脸上。远处，官道像一条灰带子，伸向灰蒙蒙的天际。", "午间，你们路过一片烧焦的村庄。没有人说话。商队的护卫握紧了缰绳，老马夫叹了口气：「去年冬天的事。北边不太平，仗打了好几年了。」", "傍晚扎营时，你把随身带的干粮分了一半给路边一个逃难的孩子。他接过干粮，眼睛亮了一下，又警惕地缩回树后。你看着他，想起铁门关的那些日子。", "前往北境的第二天。你一早起来，掀开帐帘，发现外面，下雪了。", "雪下得不大，但地上，已经铺了薄薄一层。你踩着雪，走在路上，脚下咯吱咯吱地响。你呼出的气，在眼前，凝成白雾。", "你们走了一上午，雪一直没停。你裹紧领口，跟着队伍，一步一个脚印地走。你忽然想，北境的人，天天走这样的路，他们已经习惯了。", "中午，你们在一座废弃的驿站歇脚。你靠着墙，啃着干粮，看着外面的雪。你忽然觉得，雪天里，能有一面墙靠着，一件干粮啃着，已经很好了。", "下午，雪停了。太阳从云缝里，漏出来，照在雪地上，白得刺眼。你眯着眼，看着远方。你知道，离铁门关，还有好几天的路。"],pace:"normal" /*v45inj:travel_north_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"打听北方的局势", go:"travel_north_explore"}
]
}};

N["travel_north_day2_solo"]=function(){return{tag:"branch",
place:"北方路线·独行·第二天",
text:["独行的第二天，北方的风已经吹得你脸颊生疼。你裹紧袍子，沿着官道一步一步往前。", "正午，你在一棵枯树下歇脚。远处有军队调动的旗帜，一队骑兵从你身边驰过，扬起一阵尘土。你压低帽檐，等他们过去才继续走。", "黄昏，你找到一间废弃的猎屋过夜。屋里积着灰，但屋顶还算完整。你生起火，烤着硬邦邦的干粮。火光把你的影子投在墙上，一晃一晃的。", "夜里，风大了。你听见远处传来狼嚎，一声接一声。你往火堆里添了柴，把刀放在手边。这一夜，你没有睡得很沉。", "北行的第二天，风雪停了，但更冷。你呼出的气在面前凝成白雾，眉毛上结了一层霜。", "你跟着商队的车辙走。车辙在雪地里压出两道深沟，沟里的雪被压实了，踩上去咯吱作响。你走在沟里，风小一些，脚步也稳一些。", "路边的枯树上，停着一只乌鸦。它歪着头看你，叫了一声，拍着翅膀飞走了。你看着它飞远，忽然有点羡慕它——它不用在这雪地里一步一步地走。", "你摸出干粮，就着雪水咽了几口。干粮冻得梆硬，你咬了一口，牙硌得发酸。你把干粮揣回怀里，让它贴着胸口，捂软一点再吃。", "傍晚，你找到一处背风的石头窝，把雪铲开，铺上毯子。你缩在毯子里，听着风声呜呜地响，像是有什么东西在远处嚎。", "你握紧剑柄，没有睡死。风一整夜都在响。天亮的时候，你掀开毯子，看见石头上结了一层薄冰，在晨光里闪着细碎的光。"],pace:"normal" /*v45inj:travel_north_day2_solo*/,
options:[{t:"天亮继续赶路", go:"travel_resolve"},
{t:"在猎屋周围看看", go:"travel_north_explore"}, {"t": "在营地听老猎人讲北地的规矩", "go": "travel_north_campfire"}]
} /*v45opt:travel_north_day2_solo*/};

N["travel_north_explore"]=function(){return{tag:"branch",
place:"北方路线·探索",
text:["北方的路，越走越冷。", "草木渐渐矮下去，最后只剩下一些贴着地面长的灌木，叶子又小又硬，像一把把绿色的铁砂。风从北边来，带着雪的味道，灌进领口。", "你路过一个废弃的哨塔。塔身半塌，石头缝里长了草。你爬上去看了看——塔里空空的，只有一截烧过的木桩和几块啃过的骨头，不知是多少年前留下的。", "你站在塔顶，往北看。天地之间，是一片灰白色的荒原，看不见尽头。风吹过来，呜呜地响，像这塔在替你喊冷。", "你从塔上下来，继续赶路。走出很远，你回头看了一眼——那塔还立在那里，像一个站了很久的人，还在替你看着北方。", "你离开官道，去看了看路旁的遗迹——一座倒塌的瞭望塔。", "塔身歪斜，长满了青苔。你攀上去，发现塔内还留着旧的烽火台——那是不打仗的年月，用来传递消息的。你伸手摸了摸石壁，指尖触到一些刻痕。", "那是一些名字。密密麻麻的，刻满了半面墙。每个名字下面，都刻着一个日期。你数了数，最早的，是三十年前。", "你忽然明白这些名字是什么了——守卫这座塔的士兵。一代又一代，把名字留在这里，像一种沉默的誓言。你在最下面，也刻下了自己的名字。然后你转身，回到官道。", "傍晚，你找到一处避风的岩壁扎营。", "你生起火，火焰在风里抖得厉害，像随时会灭。你把背囊里的干粮拿出来，就着热水，一口一口地吃。", "夜色里，远处传来一声狼嚎。你握紧了手边的家伙。那狼嚎响了一会儿，然后远了——它没过来。你也不知道它为什么没过来。", "你往火里添了柴，靠着岩壁，看着火。火光照着你的手，你的影子在岩壁上晃。", "后半夜，风小了。你迷迷糊糊地睡着，做了一个很短的梦——梦里有人在雪地里走，脚印一串，通向看不见的远方。你醒过来的时候，天刚蒙蒙亮。火已经灭了，只剩一堆白灰。"],pace:"normal" /*v45inj:travel_north_explore*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"回到商队", go:"travel_north_day2"}
]
}};

;

N["travel_south_day2"]=function(){return{tag:"branch",
place:"南方路线·第二天",
text:["南方的路，第二天就换了颜色。北方的灰黄被抛在身后，路边的树开始变得高大茂密，空气里也多了潮湿的气息。", "商队的骡子走得慢，你有大把的时间看风景。路旁有农人在田里劳作，有孩子在溪边捉鱼——和北方完全不同，这里的日子，像是用另一种节奏过的。", "午间，你们在一个小镇歇脚。镇子不大，但热闹：卖糖人的、卖布匹的、耍把式的，挤挤挨挨。你用一枚铜板买了根糖葫芦，酸甜的滋味在嘴里化开。", "你忽然觉得，这一路向南，像是走进了另一个世界。北方的雪、铁与战争，被远远地留在了身后。", "往南走的第二天，路开始变了。平原渐渐退去，前方，出现了起伏的丘陵。", "你翻过一道丘陵，站住。风从南边吹来，带着一股淡淡的、咸腥的气息。你吸了吸鼻子——是海。你离海，近了。", "你继续走。丘陵之间，有浅浅的溪流，水很清。你蹲下来，掬了一捧，喝了一口。水是甜的，带着一点土腥味，但你觉得，比任何酒都好喝。", "傍晚，你在一处山坳里扎营。你生火的时候，听见远处，传来一声很长的、低沉的鸣叫——不是鸟，不是兽，是你没听过的声音。", "你握着火折子，蹲在那里，听了一会儿。声音又响了，这次，近了一些。你想起那些关于南方的传说，把火，添旺了一些。"],pace:"normal" /*v45inj:travel_south_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在小镇多待一会儿", go:"travel_south_explore"}
]
}};

N["travel_south_day2_solo"]=function(){return{tag:"branch",
place:"南方路线·独行·第二天",
text:["独行的第二天，你沿着海岸线走。", "海水拍着礁石，白沫在脚下散开又聚拢。你走了很久，一个人也没有遇到，只有海鸟在你头顶盘旋，发出尖利的叫声。", "你在一处断崖边停下来，望着海面。风很大，把你的头发吹得乱飞。你忽然想起，你第一次看见海底绿光的那一夜——你已经走了这么远，可那个画面，还在你心里亮着。", "你在断崖上坐了一会儿。海浪声很大，可你在那声音底下，隐约听见了另一种声音——很轻，很有节奏，像……呼吸。", "你站起来，沿着崖边继续走。你没有回头。你告诉自己，那是错觉。可你的脚步，不自觉地快了。", "独行的第二天，你走进了一片茂密的树林。阳光透过树叶，在地上洒下碎金。", "这条路比官道近，但难走。树根盘错，藤蔓横生。你拨开枝叶前行，忽然听见前方有流水声——一条小溪横在面前。", "你蹲下来，掬了一捧水洗脸。水很凉，带着草木的清香。你直起腰，忽然看见溪对岸的树丛动了一下。你屏住呼吸——一只鹿，正低头饮水。", "你站在原地，看着那只鹿。它抬起头，看了你一会儿，然后迈开步子，消失在林深处。你笑了笑，跳过小溪，继续赶路。", "黄昏时，你在一个小渔村落脚。", "渔村的房子矮矮的，烟囱里冒着炊烟。你在一户人家门口停下来，讨了碗水喝。", "一个老妇人递给你一碗水，看了看你：「赶路的？从哪来？」你说了一个方向。她点了点头：「往南走，海路不好走。前些日子，有船在雾里失踪了。」", "你问她什么雾。她压低了声音：「那雾，不是天气。是海底下有什么东西，在喘气。喘出来的气，就是雾。」", "你喝完水，谢过她，继续赶路。走出村口时，你回头看了一眼——老妇人还站在门口，望着你。", "你忽然觉得，她的话，和那晚的绿光，说的是同一件事。"],pace:"normal" /*v45inj:travel_south_day2_solo*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"沿着鹿的足迹看看", go:"travel_south_explore"}
]
}};

N["travel_south_explore"]=function(){return{tag:"branch",
place:"南方路线·探索",
text:["南边的路，是沿着海岸走的。", "海在右手边，一波一波地涌上来，又退下去，发出均匀的、像呼吸一样的声音。空气是咸的，带着海藻和鱼腥味，还有一股说不出的、湿润的清凉。", "你在一处礁石上坐下来，看着海。海很大，大得看不出它在动，可你看久了，就能看见——那些浪，一直在来，一直在退，从来没有停过。", "你捡起一块扁平的石头，打了个水漂。石头跳了五下，沉下去。你想起小时候，也干过同样的事——那时候，你打的水漂，能跳七下。", "你站起来，继续走。海的声音在你身后，一直跟着你，像一句没说完的话。", "你在路边发现一座废弃的神庙。石阶上长满了青苔，但庙门还完整。", "你推开庙门，灰尘扑簌簌落下来。庙里供着一尊神像——不是大陆常见的任何一位神。神像的手里，托着一枚贝壳。", "你在神像前的供桌上，发现一本泛黄的册子。翻开，里面记录着这座庙的历史：这里供奉的是「海之母」，曾经是沿海渔民出海前必拜的神。", "「如今，渔民们都去拜新神了。」册子最后一行写着，「但海之母，还在等着她的孩子们回来。」你合上册子，对着神像鞠了一躬，把册子放回原处。", "傍晚，你在一座小渔村借宿。", "渔村很小，只有十几户人家。你借宿的那家，主人是个老渔民，脸上晒得黑红，笑起来，眼角的皱纹挤成一团。", "他给你端来一碗鱼汤。汤很白，很浓，上面浮着葱花。你喝了一口——鲜得你差点把舌头吞下去。", "「这鱼，是今天下午打的。」他坐在门槛上，看着海，「打鱼这行，靠天吃饭。今天有，明天没有。谁也不知道。」", "「那你还打吗？」你问。", "他笑了：「打啊。不打，吃什么呢。」他顿了顿，「海这东西，你怕它，它也照样来。你不怕它，它也照样来。那还不如，高高兴兴地打。」", "你端着那碗鱼汤，觉得这话，比鱼汤还够味。", "离开探索时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"normal" /*v45inj:travel_south_explore*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"回到商队", go:"travel_south_day2"}
]
}};

;

;

N["travel_west_day2"]=function(){return{
place:"西方路线·第二天",
text:["西边的路，第二天就换了天地。平原被抛在身后，群山像巨墙一样横在眼前。", "商队在一条河谷里扎营歇脚。河水清澈见底，你蹲在河边洗了把脸，水凉得扎手——是雪山融水。", "午间，你们遇到一队下山的矮人商贩。他们背着大包小包，满载着矿石和铁器。两队人交换了消息，矮人商贩听说你们要去铁峰堡，咧嘴笑了：「那地方，好酒，好锤子，好客人。」", "黄昏，你坐在营火边，看着西边的山影一点点沉入暮色。你忽然觉得，这一路走下来，你遇见的每一个人，都在用自己的方式活着。", "西行的第二天，你进入了一片望不到边的草甸。草比人高，风一吹，整片草海起伏，像绿色的浪。", "你走在草海里，看不见路，只能顺着前人踩倒的草痕走。草痕断断续续，有时你以为走错了，绕回来，又找到了。", "你听见草丛里有动静——停下脚步，屏住呼吸。动静停了一下，又响起，窸窸窣窣的，像是什么东西在草根处钻。", "你慢慢蹲下，拨开草叶。是一只刺猬，正卷成一个球，一动不动。你用树枝碰了碰它，它缩得更紧了。", "你没有再打扰它，站起来继续走。走出几步，你回头看了一眼——那只刺猬已经展开身子，正窸窸窣窣地往草丛深处钻，像什么都没发生过。", "你忽然觉得，这条路也是这样。你走过，草丛合拢，像没人来过。只有走过的人，知道自己走了多远。"],pace:"normal" /*v45inj:travel_west_day2*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在河谷探索", go:"travel_west_explore"}
]
}};

N["travel_west_day2_solo"]=function(){return{
place:"西方路线·独行·第二天",
text:["独行的第二天，你走进一片雾林。", "树很高，遮天蔽日。雾从树根处漫上来，没过脚踝，像踩在一层凉凉的云上。你放慢脚步，听着自己的呼吸声在雾里回荡。", "雾林里很安静，安静到你能听见树皮剥落的声音。你走了一会儿，发现前面的树干上，刻着一个记号——一个箭头，指向左侧。", "你不确定那是谁留下的，也不确定该不该信。你在箭头前站了一会儿，决定——信它。", "你左转，沿着记号的方向走。雾渐渐淡了。前方隐约出现一座废弃的木屋，门半掩着，门口长满了青苔。", "你推开门。屋里没有人，桌上放着一盏没点亮的灯，和一封信。信上只写着一行字：「能走到这里的人，继续走。」", "独行西进的第二天，你在河谷里遇上一场暴雨。", "雨来得又快又急，你无处可躲，只能缩在一棵老树下，用袍子蒙住头。雨水顺着树干流下来，把地面冲出一条条小沟。", "雨下了半个时辰才停。你抖落袍子上的水，继续赶路。河谷被洗得干干净净，空气里全是泥土和草叶的气息。", "你踩着湿漉漉的石头过河，忽然发现河底有个东西在闪光。你蹲下去，捞起来一看——是一枚被水冲亮的铜币，已经锈得看不出年号。你把它揣进怀里，继续上路。", "你拿起那封信，翻来覆去看了几遍。纸很旧，边角卷起，像是放在这里很久了。", "你点亮桌上的灯。灯油还够，火光在屋里跳了跳，照亮了墙上的刻痕——密密麻麻的刻痕，像是有人在这里住过很久，用刀一下一下，记着日子。", "你在墙角找到一本湿了一半的日记。翻开，字迹已经晕开大半，只有几行还勉强认得：「第七十三天。雾还没有散。我开始记不清，自己是来找什么的。」", "你合上日记，把它放回原处。你没有带走它——那是别人的故事，不该被你带走。", "你吹灭灯，走出木屋。雾已经淡了很多，前方的路隐约可见。你朝那个方向走去，把那封「继续走」的信，收进了怀里。"],pace:"normal" /*v45inj:travel_west_day2_solo*/,
options:[
{t:"继续赶路", go:"travel_resolve"},
{t:"在河谷里再找找", go:"travel_west_explore"}
]
}};

N["travel_west_explore"]=function(){return{
place:"西方路线·探索",
text:["西边的路，沿着一条河走。", "河水不深，清澈见底，能看见水底的鹅卵石和游鱼。岸边是成片的芦苇，风一吹，白茫茫一片，像一层薄雪。", "你在一处浅滩停下来，脱了鞋，把脚伸进水里。水很凉，凉得人一激灵，可过了一会儿，就习惯了，反而觉得舒服。", "你坐在岸边，看着河水从脚边流过。水流得不快，可它一直在流。你忽然想，这条河，不知道流了多少年了——它见过多少人像你这样，坐在岸边，把脚伸进水里。", "你穿好鞋，继续上路。走出很远，你回头看了一眼，那处浅滩已经看不见了。可你知道，它还在那里，等着下一个过路人。", "你在河谷边发现一处塌陷的山洞。洞口堆着碎石，但缝隙里透出微弱的光。", "你搬开几块石头，钻了进去。洞里不大，但四壁都刻着画——和你在矮人矿道里看到的很像：火焰、锤子、一颗跳动的心。", "不同的是，这里的壁画更古老。画的边缘已经模糊，你凑近了才看清：那团火焰旁边，还画着一个人影。人影的手，正伸向火焰。", "你在洞里待了很久。你猜不出这壁画想说什么——是警告，还是指引？你退出山洞，把碎石重新堆好。有些问题，也许要等到铁峰堡，才有答案。", "傍晚的时候，你在一棵老树下扎了营。", "你生起火，烤着白天在河边采的蘑菇。蘑菇烤出来的汁水，滴在火上，发出滋滋的响，香味混着柴火味，在夜色里散开。", "你一边吃，一边听河水的声响。夜里的河声，和白天的不同——白天是潺潺的，晚上是哗哗的，像有什么东西在水底翻动。", "你往火堆里添了根柴。火苗跳了跳，照亮了周围一小圈地方。远处，河对岸的林子黑黢黢的，什么都看不清。", "你守了一会儿夜，换了个姿势靠着树，闭上了眼。风吹过芦苇，沙沙地响，像有人在很远的地方说话。你没有睁眼。你听了一会儿，慢慢睡过去了。"],pace:"normal" /*v45inj:travel_west_explore*/,
options:[
{t:"回到河谷", go:"travel_resolve"},
{t:"继续赶路", go:"travel_west_day2"}
]
}};

;


/* /v62inj:chunk-city/ N["city_lvzhou_intro"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_shengcheng_intro"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-npc/ N["classmate_mercury_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_lilith_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_alexander_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-academy/ N["academy_graduation_trial"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_choice"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_classmates"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-npc/ N["classmate_allen"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_rex"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-academy/ N["academy_classmates_final"] 已移入 chunks/v62_academy.js */
/* ============================================================
   v16 方向九：对话树系统（部分）
   ============================================================ */

N["dialogue_mercury_tree"] = function(){ return {
  place:"对话·墨丘利",
  text:["墨丘利·对话。","你坐在墨丘利的办公室里，喝着他泡的茶。","茶是用魔法草药泡的，有一种淡淡的、甜甜的味道。墨丘利说，这种茶能帮助灵魂法师稳定精神。","办公室在塔楼的最高层，窗户面对着整个交汇城。夕阳把城市染成了金红色，很美。","「教授。」你说，「我能问你一个问题吗？」","「问吧。」墨丘利说，他靠在椅子上，双手抱胸，浅灰色的眼睛看着你。","「你为什么要离开守望者？」","墨丘利沉默了很久。他看着窗外的夕阳，脸上的表情，变得复杂了起来。","「因为一个人。」他说，声音很低，「塞拉芬。」","「她是我……曾经的挚爱。三百年前，她发现了守望者的秘密，被封印在了地下图书馆的最深处。」","「我去找奥雷利安理论，他告诉我——这是必要的牺牲。」","「必要的牺牲？」墨丘利苦笑了一下，「她是我爱的人。她不是牺牲品。」","「所以我离开了守望者。我发誓，总有一天，我会救她出来。」","「三百年了。我一直在等。等一个能帮我救她出来的人。」","他转过头，看着你，眼中闪过一丝光芒：「那个人，就是你。」","你看着他。这个活了三百年的男人，这个你尊敬的导师——他的眼睛里，有三百年的痛苦和等待。","「我会帮你的。」你说。","墨丘利笑了——那是你第一次看到他真正地笑。","「谢谢你。」他说，声音在发抖，「三百年了。终于有人愿意帮我了。」","你们又聊了很多——关于灵魂魔法，关于守望者，关于七印，关于深渊。","墨丘利告诉你很多你不知道的事情——守望者的内部矛盾，七印的真正本质，深渊之主的计划。","你听得入了迷。直到天色完全暗了下来，你才意识到，已经聊了很久了。","「时间不早了。」墨丘利说，他站起来，走到窗前，「你回去休息吧。」","你站起来，走到门口。然后，你停了下来。","「教授。」你说，「塞拉芬……她还活着吗？」","墨丘利没有回头。他看着窗外的夜色，沉默了很久。","「她的灵魂还在。」他说，声音很轻，「但她的身体……已经不在了。」","「三百年了。她的身体，早就化为了尘土。只有她的灵魂，被封印在那里。」","你没有再问。你推开门，走了出去。","走廊里很暗，只有几盏魔法灯发出微弱的光。你走在回宿舍的路上，心里有一种说不出的感觉。","三百年的等待，三百年的痛苦。墨丘利为了塞拉芬，等了三百年。","而你，能帮他结束这等待吗？","你握紧了拳头，在心里暗暗发誓。","你会的。你一定会帮他救出塞拉芬。","风吹过走廊，带来了远处的钟声。你加快了脚步，朝宿舍走去。","你的冒险，才刚刚开始。而三百年的等待，即将在你的手中，画上句号。"],pace:"deep",
  options:[
    {t:"关于灵魂魔法", effect:{time:1}, go:"dialogue_mercury_soul"},
    {t:"关于守望者", effect:{time:1}, go:"dialogue_mercury_watcher"},
    {t:"关于塞拉芬", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:60},
      tier:{
        crit:function(){return[pickV(["墨丘利沉默了很久，然后开始讲述他和塞拉芬的故事。你了解了很多不为人知的秘密。墨丘利好感+10，线索+2。","墨丘利对你敞开心扉，告诉了你塞拉芬失踪的真相。墨丘利好感+15，SAN-5。"],"dialogue_seraph_crit")]},
        ok:function(){return[pickV(["墨丘利简单说了一些塞拉芬的事。墨丘利好感+5。","你了解了一些情况。"],"dialogue_seraph_ok")]},
        fail:function(){return[pickV(["墨丘利不愿意谈论塞拉芬。","他转移了话题。"],"dialogue_seraph_fail")]},
        critfail:function(){return[pickV(["你的问题让墨丘利非常生气，他叫你离开。墨丘利好感-15。","你被赶了出来。"],"dialogue_seraph_critfail")]}
      },
      effect:{time:1}, go:"dialogue_mercury_tree"},
    {t:"关于深渊", check:{a:"SPR",sk:"意志",label:"灵性·勇气",target:65},
      tier:{
        crit:function(){return[pickV(["墨丘利告诉你深渊的真相，包括四邪神和七使者的秘密。线索+3，SAN-10。","墨丘利告诉你他对深渊的研究成果，非常惊人。线索+3，知识+3。"],"dialogue_abyss_crit")]},
        ok:function(){return[pickV(["墨丘利告诉了你一些关于深渊的基本知识。线索+1。","你了解了一些情况。"],"dialogue_abyss_ok")]},
        fail:function(){return[pickV(["墨丘利认为你还不够资格知道这些。","他拒绝了。"],"dialogue_abyss_fail")]},
        critfail:function(){return[pickV(["墨丘利警告你不要深究深渊，否则会被它吞噬。SAN-5。","你被深渊的低语影响了。SAN-10。"],"dialogue_abyss_critfail")]}
      },
      effect:{time:1}, go:"dialogue_mercury_tree"},
    {t:"结束对话", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}

N["dialogue_mercury_soul"] = function(){ return {
  place:"对话·灵魂魔法",
  text:["墨丘利·灵魂。","「灵魂魔法的本质，是什么？」你问。","墨丘利坐在你对面，手里端着一杯茶。他想了想，然后说：「灵魂魔法的本质，是沟通。」","「沟通？」","「嗯。」墨丘利说，「和死者沟通，和灵魂沟通，和……另一个世界沟通。」","「很多人以为，灵魂魔法是操控死者。让死者为你战斗，为你做事。但那不是真正的灵魂魔法。那是……亵渎。」","「真正的灵魂魔法，是理解。理解死者的遗憾，理解死者的执念，理解死者……为什么不肯离开。」","「每一个徘徊在人间的灵魂，都有一个未完成的心愿。你的任务，就是帮他们完成心愿，引导他们安息。」","「这不是一件容易的事。因为有些灵魂的心愿，是复仇；有些灵魂的心愿，是赎罪；有些灵魂的心愿……是再看一眼自己爱的人。」","他放下茶杯，看着你，眼中闪过一丝复杂的情绪。","「你知道吗？我第一次使用灵魂魔法，是在我母亲的葬礼上。」","「那一年，我八岁。我看到了我母亲的灵魂，她站在棺材旁边，看着我，脸上带着温柔的笑容。」","「我伸出手，想碰她。但我的手穿过了她的身体——她是透明的。」","「从那天起，我就能看到死者了。」","「一开始，我很害怕。到处都是死人——街上，屋子里，医院里，战场上。他们有的在徘徊，有的在哭泣，有的在微笑，有的在愤怒。」","「直到我遇到了我的导师。他告诉我——灵魂法师不是异端。我们只是能看到别人看不到的东西。」","「他教我如何控制这种力量，如何和死者对话，如何引导灵魂安息。」","「从那天起，我不再害怕了。因为我知道，我看到的不是怪物，而是……和我们一样的，有感情，有遗憾，有爱的灵魂。」","你看着他。这个活了三百年的男人，这个强大的灵魂法师——他的眼睛里，有温柔，有悲伤，还有一丝……你看不懂的情绪。","「教授。」你说，「你有没有……后悔过成为灵魂法师？」","墨丘利沉默了很久。然后，他笑了——那笑容里，有苦涩，有释然。","「后悔过。」他说，「很多次。当我看到那些痛苦的灵魂，当我感受到他们的悲伤和绝望，当我……无能为力的时候。」","「但我从来没有真正后悔过。」","「因为灵魂魔法，让我看到了别人看不到的东西。让我理解了别人理解不了的东西。让我……和塞拉芬相遇了。」","「如果没有灵魂魔法，我不会遇到她。不会爱上她。不会……等她三百年。」","「所以，我不后悔。」","你看着他，心里有一种说不出的感动。","三百年的等待，三百年的痛苦。但他不后悔。因为这一切，都是为了爱。","窗外，夜色深沉。月光洒在办公室里，把一切都染成了银白色。","你站起来，朝门口走去。","「教授。」你说，「谢谢你告诉我这些。」","「不用谢。」墨丘利说，他看着你，眼中闪过一丝光芒，「你是一个好的灵魂法师。不……你会成为一个伟大的灵魂法师。」","你推开门，走了出去。","走廊里很暗，但你的心里，很亮。","你的道路，还在继续。而墨丘利的话，将永远陪伴着你。"],pace:"deep",
  options:[
    {t:"「我想学。」", effect:{time:1,skillUp:"灵魂魔法",墨丘利_bond:5}, go:"dialogue_mercury_tree"},
    {t:"「灵魂魔法的终极是什么？」", check:{a:"INT",sk:"知识",label:"智力·追问",target:65},
      tier:{
        crit:function(){return[pickV(["墨丘利告诉你，灵魂魔法的终极是「贤者之魂」——超越生死的境界。「但达到那个境界的人，都不再是人了。」线索+2，SAN-5。","墨丘利告诉你他对灵魂本质的研究成果，非常深刻。知识+3。"],"soul_ultimate_crit")]},
        ok:function(){return[pickV(["墨丘利告诉了你一些灵魂魔法的高级知识。知识+1。","你有了一些了解。"],"soul_ultimate_ok")]},
        fail:function(){return[pickV(["墨丘利认为你还不够资格了解这些。","他没有回答。"],"soul_ultimate_fail")]},
        critfail:function(){return[pickV(["墨丘利警告你不要追求终极，否则会失去自我。SAN-5。","你被灵魂之力影响了。SAN-8。"],"soul_ultimate_critfail")]}
      },
      effect:{time:1}, go:"dialogue_mercury_tree"},
    {t:"回到主话题", effect:{time:0}, go:"dialogue_mercury_tree"}
  ]
};}

N["dialogue_mercury_watcher"] = function(){ return {
  place:"对话·守望者",
  text:["墨丘利·守望者。","「守望者，到底是一个什么样的组织？」你问。","墨丘利坐在你对面，手里端着一杯已经凉了的茶。他沉默了很久，然后说：「守望者……是一个很复杂的组织。」","「三千年前，黄林晶加固七印后，成立了守望者。守望者的使命，是守护七印，确保七印不被破坏。」","「但后来，守望者的使命变了。」","「变成了什么？」","「变成了守护秘密。」墨丘利说，他的声音很低，「确保没有人知道七印的真相，确保没有人知道黄林晶的真相。」","「为什么？」","「因为真相太可怕了。」墨丘利说，他的眼睛里有一丝痛苦，「如果人们知道，七印不是用来封印深渊的，而是用来封印黄林晶的——如果人们知道，黄林晶不是英雄，而是深渊之主的容器——那整个大陆，都会陷入恐慌。」","「所以守望者选择了掩盖。他们把真相藏起来，让人们继续相信黄林晶是英雄，七印是守护世界的封印。」","「但这样做，对吗？」你问。","墨丘利沉默了很久。然后，他苦笑了一下：「我不知道。」","「三百年前，我是守望者的执灯人。我相信守望者的使命，相信我们做的是对的。」","「但塞拉芬的事，让我开始怀疑。」","「她发现了守望者的秘密——他们在用灵魂之眼和深渊沟通。不是为了消灭深渊，而是为了和深渊做交易。」","「她想阻止他们。但守望者把她封印了。」","「那时候我才明白——守望者，已经不是当年的守望者了。他们为了守护秘密，什么都做得出来。」","「所以我离开了。」","你看着他。这个活了三百年的男人，这个前守望者执灯人——他的眼睛里，有痛苦，有失望，还有一丝……希望。","「那现在的守望者，还可信吗？」你问。","「奥雷利安，是可信的。」墨丘利说，「他是一个真正的守护者。三千年了，他一直在为这个世界付出。」","「但守望者里的其他人……就不一定了。」","「守望者内部，有派系。有『守护派』，认为应该继续守护秘密；有『改革派』，认为应该公开真相；还有……『深渊派』，认为应该和深渊合作。」","「你要小心。不要轻易相信守望者里的任何人——除了奥雷利安。」","你点了点头，把这些话记在了心里。","「教授。」你说，「你以后，还会回望者吗？」","墨丘利看着窗外的夜色，沉默了很久。","「也许吧。」他说，「等救出了塞拉芬，等一切都结束了……也许，我会回去。」","「毕竟，那里是我的家。」","你站起来，朝门口走去。","「谢谢你，教授。」你说，「谢谢你告诉我这些。」","「不用谢。」墨丘利说，他看着你，眼中闪过一丝光芒，「你要走的路，比我想象的更艰难。但我相信，你能走下去。」","你推开门，走了出去。","走廊里很暗，但你的心里，很亮。","你的道路，还在继续。而守望者的秘密，正在一点一点地，被揭开。"],pace:"deep",
  options:[
    {t:"「守望者现在的领袖是谁？」", effect:{time:1}, go:"npc_aurelian_intro"},
    {t:"「守望者的内部有什么派系？」", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:60},
      tier:{
        crit:function(){return[pickV(["墨丘利告诉你守望者内部的派系斗争：主动出击派和只守护派之间的矛盾。线索+2。","墨丘利告诉你守望者历史上的几次大分裂，非常惊人。线索+3。"],"watcher_faction_crit")]},
        ok:function(){return[pickV(["墨丘利简单介绍了守望者的内部情况。线索+1。","你了解了一些。"],"watcher_faction_ok")]},
        fail:function(){return[pickV(["墨丘利不愿意谈论守望者的内部事务。","他转移了话题。"],"watcher_faction_fail")]},
        critfail:function(){return[pickV(["墨丘利警告你不要介入守望者的内部斗争。SAN-3。","你被警告了。"],"watcher_faction_critfail")]}
      },
      effect:{time:1}, go:"dialogue_mercury_tree"},
    {t:"回到主话题", effect:{time:0}, go:"dialogue_mercury_tree"}
  ]
};}

/* ============================================================
   v16 方向十：章节制主线重构
   ============================================================ */

N["chapter_1_title"]={
  place:"第一部·序章",
  text:["第一部·序章。","艾尔达历3024年，春。","你出生在艾尔达大陆的一个角落。你的出身，你的种族，你的职业，你的一切，都是你自己的选择。","你不知道，你的命运，已经和这个大陆的命运，纠缠在了一起。","你不知道，在你出生的那一刻，七印同时震动了一下——像是在回应你的到来。","你不知道，守望者的首席守护者奥雷利安，在那天晚上，睁开了眼睛，看着星空，喃喃道：「他来了。」","你不知道，暗蚀会的教主，在那天晚上，收到了一份密报，密报上只有四个字：「目标出现。」","你什么都不知道。","你只是一个普通的少年，在你的家乡，过着普通的生活。","直到那一天——你的天赋觉醒了。","那一天，你的人生，彻底改变了。","你离开了家乡，踏上了前往学院的道路。你不知道，前方有什么在等着你。你只知道，你的道路，从今天起，不再普通。","风吹过道路，带来了远方的气息。你吸了口气，朝远方走去。","你的故事，从这里开始。","而这个大陆的故事，也将因为你，而改变。","序章，开始。"],pace:"normal",
  options:[
    {t:"开始序章", effect:{time:0}, go:"prologue_start"}
  ]
}

N["chapter_2_title"]={
  place:"第二部·学院",
  text:["第二部·学院。","艾尔达魔法学院。","你站在学院的大门前，看着那扇白色的大理石门。门柱上刻着七职业的徽记，在阳光下泛着光。","你吸了口气，走了进去。","你不知道，这五年的学院生活，将是你人生中，最重要的五年。","你将在这里，学到知识，交到朋友，遇到敌人，发现秘密。","你将在这里，面对净化令的阴影，面对暗蚀会的威胁，面对深渊的逼近。","你将在这里，从一个懵懂的少年，变成一个能拯救世界的英雄。","学院的表面，是风平浪静的。因为有强者镇压——墨丘利，还有数位大宗师级的教授。","但水面下，暗流涌动。","暗蚀会支部，在地下进行着可怕的实验。学生失踪，黑袍人出没，禁书区的深夜灯光。","净化令监察处，在学院里设立了据点。灵魂法师被清查，被审判，被……烧死。","战争的阴影，从北方传来。铁门关的战事，影响着每一个人。","而你，将在这片暗流中，找到真相，找到盟友，找到……拯救世界的方法。","五年。说长不长，说短不短。","但这五年，将决定你的一生，也将决定这个大陆的命运。","风吹过学院的庭院，带来了喷泉的水声。你吸了口气，朝塔楼走去。","你的学院生活，从这里开始。","而真正的冒险，也将从这里，拉开序幕。","学院篇，开始。"],pace:"normal",
  options:[
    {t:"开始学院生活", effect:{time:0}, go:"academy_year1_intro"}
  ]
}

N["chapter_3_title"]={
  place:"第三部·大陆",
  text:["第三部·大陆。","毕业了。","你走出学院的大门，看着外面的世界。","道路在你面前延伸，通向远方。你不知道，这条路的尽头，有什么在等着你。","但你知道，你必须往前走。","因为七印正在破碎，深渊正在逼近，世界正在走向毁灭。","你必须找到铸印，找到黄林晶留下的后门，找到……拯救世界的方法。","你将走遍整个大陆——自由城邦，北方公国，南方城邦，精灵王国，矮人王国，兽人草原，东部王国，光明教会，死亡沙漠。","你将遇到各种各样的人——盟友，敌人，朋友，爱人。","你将经历各种各样的事——战斗，冒险，阴谋，背叛，救赎。","你将揭开各种各样的秘密——七印的真相，黄林晶的真相，守望者的真相，深渊的真相。","大陆很大，很危险。但你不怕。","因为你知道，你不是一个人。你有塞西莉亚，有艾伦，有蕾克斯，有影，有墨丘利，有所有你认识的人。","他们都在，以自己的方式，支持着你。","风吹过道路，带来了远方的气息。你吸了口气，朝远方走去。","你的大陆冒险，从这里开始。","而世界的命运，将在你的手中，被改写。","大陆篇，开始。", "你与大陆作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal",
  options:[
    {t:"开始大陆冒险", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
}

N["chapter_3_transition"]={pace:"normal",
  place:"过渡·从学院到大陆",
  text:["过渡·大陆。","从学院到大陆，是一段很长的路。","你和塞西莉亚，走在道路上。白天赶路，晚上休息。一路上，你们看到了很多——繁华的城市，荒凉的村庄，战争的废墟，难民的队伍。","你第一次如此真切地感受到——这个世界，正在走向毁灭。","铁门关的战事，还在继续。北方公国和兽人草原，都在这场战争中，付出了惨重的代价。","净化令的阴影，笼罩着整个大陆。灵魂法师被清查，被审判，被烧死。教会的权力，越来越大。","银穗商路的危机，让物价飞涨，民不聊生。很多人，因为饥饿，而走上了犯罪的道路。","深渊封印的松动，让各地出现了异常——人失踪，动物异变，噩梦传染。","这个世界，病了。","而你，是唯一能治好它的人。","你站在一座小山的山顶，看着远方。夕阳把天空染成了金红色，像是血。","「你在想什么？」塞西莉亚问，她走到你身边，和你并肩站着。","「我在想，」你说，「这个世界，还能撑多久。」","塞西莉亚沉默了一会儿，然后说：「只要我们能找到铸印，就能拯救它。」","「嗯。」你说，「我们一定能找到的。」","你们站在山顶，看着远方的夕阳，很久都没有说话。","风吹过山顶，带来了远方的战争气息。你吸了口气，朝山下走去。","「走吧。」你说，「别让世界等太久。」","「好。」塞西莉亚说，她跟上了你的脚步。","你们的身影，在夕阳下越拉越长，最后消失在了道路的尽头。","大陆篇，正式开始。","而你的传奇，将在这片大陆上，被书写。"],pace:"normal",
  options:[
    {t:"前往自由城邦", effect:{time:7}, go:"city_jiaohui_deep"},
    {t:"前往北方公国联盟", effect:{time:14}, go:"faction_north_intro"},
    {t:"前往精灵王国", effect:{time:21}, go:"faction_elf_intro"},
    {t:"前往矮人王国", effect:{time:14}, go:"faction_dwarf_intro"},
    {t:"前往兽人草原", effect:{time:14}, go:"faction_orc_intro"},
    {t:"前往光明教会圣城", effect:{time:7}, go:"faction_church_intro"},
    {t:"查看七印状态", effect:{time:0}, go:"seal_overview"},
    {t:"查看势力状态", effect:{time:0}, go:"faction_overview"}
  ]
}

N["chapter_4_title"]={
  place:"第四部·深渊",
  text:["第四部·深渊。","死亡沙漠。","你站在沙漠的边缘，看着前方。","一望无际的黄沙，在阳光下泛着刺眼的光。空气很热，很干，像是要把人烤熟。","沙漠的中央，有一座黑色的建筑——深渊神殿。","那是你的终点。也是……世界的终点。","七印，已经碎了六道。只剩下第七印——死亡沙漠的深渊神殿，还在勉强支撑着。","但你知道，它撑不了多久了。","深渊之主，即将降临。","而你，必须在它降临之前，阻止它。","你带着铸印，带着黄林晶留下的后门，带着所有你收集到的力量和盟友，来到了这里。","你的身边，站着塞西莉亚，站着艾伦，站着蕾克斯，站着影，站着墨丘利，站着奥雷利安，站着所有你认识的人。","你们将一起，面对最终的战斗。","「准备好了吗？」你问。","「准备好了。」他们说。","你吸了口气，朝沙漠深处走去。","风吹过沙漠，带来了深渊的气息。你的脚步，坚定而有力。","你的最终冒险，从这里开始。","而世界的命运，将在这场战斗中，被决定。","深渊篇，开始。","终战，即将到来。"],pace:"normal",
  options:[
    {t:"进入终局", effect:{time:0}, go:"abyss_omen"}
  ]
}

N["chapter_end_all"]={pace:"deep",
  place:"终章",
  text:["终章·新世界。","战斗结束了。","深渊之主，被消灭了。七印，被修复了。世界，被拯救了。","你站在深渊神殿的废墟上，看着远方。夕阳把天空染成了金红色，温暖而明亮。","你的身边，站着你的朋友们。他们有的受了伤，有的很疲惫，但他们都在笑。","因为他们赢了。","因为世界，得救了。","风吹过废墟，带来了远方的气息。你吸了口气，闭上了眼睛。","你想起了很多事——你的家乡，你的学院，你的同学，你的冒险，你的战斗。","你想起了墨丘利的教导，奥雷利安的期望，艾伦的友谊，塞西莉亚的陪伴。","你想起了那些为了拯救世界而牺牲的人。","你不会忘记他们。永远不会。","「接下来，你打算怎么办？」塞西莉亚问，她走到你身边，和你并肩站着。","你想了想，然后笑了：「回家。」","「回家？」","「嗯。」你说，「这个世界，已经不需要英雄了。我想做一个普通人。」","塞西莉亚笑了，她握住了你的手：「好。我们一起回家。」","你们站在废墟上，看着远方的夕阳，很久都没有说话。","风吹过废墟，带来了新生的气息。你吸了口气，朝山下走去。","你的传奇，结束了。","但你的生活，才刚刚开始。","这个世界，将在和平中，继续发展。而你，将作为一个普通人，享受这来之不易的和平。","也许，很多年以后，会有人记得你的名字。会有人把你的故事，写成歌，写成诗，写成传说。","但那都不重要了。","重要的是——你活着。你爱的人，都活着。这个世界，活着。","这就够了。","夕阳西下，把你们的影子拉得很长。你们的身影，在夕阳下，越走越远，最后消失在了道路的尽头。","全剧终。","——《艾尔达大陆：群雄割据》", "终章已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
  options:[
    {t:"查看结局", effect:{time:0}, go:"ending_check"},
    {t:"重新开始", effect:{time:0}, go:"title_screen"}
  ]
}


/* ============================================================
   v18 方向一：旅行随机事件池扩充（在已有15个基础上新增45个，总计60+）
   ============================================================ */

/* 新增旅行事件 - 恶劣天气类 */
TRAVEL_EVENTS.push(
  {cn:"冰雹突降",base:45,ok:"冰雹砸在斗笠上噼啪作响。你寻了处山岩下躲避，等冰雹过去，路面上白花花一层。你抖了抖身上的碎冰，继续赶路。",effOk:{fatigue:1},
   fail:"冰雹砸得你抬不起头。你抱着头蹲在野地里，等冰雹停了，肩膀上全是青紫的淤痕。",effFail:{hp:-8,fatigue:2}},
  {cn:"山崩落石",base:40,ok:"山道上方传来轰隆声。你反应极快，纵身跃出落石区。碎石从你身后滚落，烟尘弥漫。你拍了拍身上的灰，继续前行。",effOk:{xp:15,agility:1},
   fail:"落石比你预想的快。你被一块碎石砸中了腿，踉跄着逃出了危险区。腿肿了一大块，走路一瘸一拐。",effFail:{hp:-15,fatigue:2,wound:"腿伤"}},
  {cn:"暴雪封山",base:35,ok:"北风卷着雪片，天地一片白茫茫。你用围巾遮住口鼻，凭着经验辨明方向，硬是在风雪中走出了山口。",effOk:{fatigue:2,xp:10},
   fail:"风雪太大，你迷失了方向。在山里转了两天，才找到出路。干粮吃完了，人也冻得半死。",effFail:{hp:-12,fatigue:4,gold:-5}},
  {cn:"雷电交加",base:45,ok:"一道闪电劈在不远处的老树上，树燃起了火。你伏低身子，等雷雨过去，衣服湿透了，但人没事。",effOk:{san:-2},
   fail:"一道闪电劈在你身边，你被气浪掀翻在地，耳朵嗡嗡响了很久。你爬起来，发现眉毛被燎了一半。",effFail:{hp:-10,san:-6}},
  {cn:"浓雾锁路",base:40,ok:"浓雾漫过山谷，三步之外不见人影。你靠着指南针和记忆，慢慢摸索着走了出去。雾散的时候，你发现自己只多走了半个时辰。",effOk:{fatigue:1},
   fail:"浓雾里你走错了方向，等雾散了才发现，自己绕回了原地。一天的路，白走了。",effFail:{fatigue:3,hp:-4}},
  {cn:"酷暑难耐",base:50,ok:"日头毒得很，柏油路都被晒软了。你找了处树荫，歇到日头偏西，再趁凉赶路。虽然慢了些，但人没中暑。",effOk:{fatigue:1},
   fail:"你硬顶着日头赶路，走到半路就头晕眼花，差点中暑。不得不找了处水源，泡了半个时辰才缓过来。",effFail:{hp:-10,fatigue:2}},
  {cn:"寒潮突袭",base:40,ok:"气温骤降，呼出的气都成了白雾。你加了件衣服，生了堆火，熬过了最冷的那一夜。天亮后，气温回升了。",effOk:{fatigue:1},
   fail:"寒潮来得太突然，你没来得及准备。在野地里冻了一夜，手脚都生了冻疮，又痒又痛。",effFail:{hp:-8,fatigue:2,wound:"冻疮"}},
  {cn:"洪水断路",base:35,ok:"上游下了暴雨，河水暴涨，漫过了官道。你找了处水浅的地方，挽起裤腿蹚了过去。水虽然急，但你站稳了。",effOk:{fatigue:2},
   fail:"河水比你想象的深。你蹚到一半，被水流冲倒了，在水里扑腾了半天才爬上岸。行李湿了大半，有几样东西被冲走了。",effFail:{hp:-8,gold:-10,fatigue:3}},
  {cn:"龙卷风",base:30,ok:"远处的天际，一道黑色的风柱在移动。你及时找了处低洼地，趴在地上，等龙卷风过去。风柱离你不远，但没有扫到你。",effOk:{san:-4,xp:10},
   fail:"龙卷风比你预想的近。你被狂风卷着飞了几步，摔在地上，浑身是伤。等风停了，你发现自己的背包被吹走了。",effFail:{hp:-15,gold:-15,san:-6,fatigue:3}}
);

/* 新增旅行事件 - 人物遭遇类 */
TRAVEL_EVENTS.push(
  {cn:"逃犯求助",base:50,ok:"一个浑身是血的人从路边的林子里冲出来，跪在你面前求救。你给他包扎了伤口，给了他些干粮。他千恩万谢地走了，临走时塞给你一枚徽章。",effOk:{karma:3,gold:8,flag:"helped_fugitive"},
   fail:"你怕惹麻烦，拒绝了他。他失望地看了你一眼，转身跑进了林子里。你走了几步，心里有些不是滋味。",effFail:{karma:-2}},
  {cn:"吟游诗人",base:60,ok:"一个背着琴的吟游诗人坐在路边，看到你就弹唱了起来。他唱的是黄林晶的传说，歌声悠扬。你听了一曲，打赏了几个铜币，心情舒畅。",effOk:{san:4,gold:-3,xp:10},
   fail:"吟游诗人的琴走调了，唱的也都是些陈词滥调。你听了两句就走了，耳根子终于清净了。",effFail:{}},
  {cn:"行脚商人",base:55,ok:"一个行脚商人在路边摆摊，货物不多但很杂。你挑了几样合用的东西，价格比城里便宜不少。",effOk:{gold:-8,item:"旅行补给"},
   fail:"行脚商人的货物都是些残次品。你看了半天，什么都没买，白浪费了时间。",effFail:{fatigue:1}},
  {cn:"朝圣者队伍",base:55,ok:"一队朝圣者唱着圣歌，从你身边走过。他们的虔诚感染了你，你也跟着走了一段路，心里平静了许多。",effOk:{san:6,karma:1},
   fail:"朝圣者们走得很慢，还占了整条路。你等了半天，才找到机会超过他们。",effFail:{fatigue:1}},
  {cn:"江湖郎中",base:50,ok:"一个游方郎中在路边支了个摊子，号称包治百病。你让他给你号了号脉，他给你开了副草药，喝了之后，身体确实轻快了不少。",effOk:{hp:10,gold:-5},
   fail:"郎中的草药是假的。你喝了之后，拉了半天肚子。等你回去找他，他已经收摊跑了。",effFail:{hp:-8,gold:-5}},
  {cn:"孤儿乞讨",base:55,ok:"一个脏兮兮的小孩跪在路边乞讨，眼睛很大很亮。你给了他几个铜币，他磕了个头，跑开了。你看着他的背影，想起了自己的童年。",effOk:{karma:3,san:2,gold:-3},
   fail:"你摸了摸口袋，最终没有掏钱。小孩看着你走远，眼神里满是失望。你低着头，走得很快。",effFail:{karma:-2,san:-2}},
  {cn:"押送囚车",base:45,ok:"一队官兵押着囚车从你身边走过，囚车里关着一个人。你看了一眼，发现那个人竟然是你认识的。你不动声色，记下了囚车的去向。",effOk:{xp:15,flag:"prisoner_clue"},
   fail:"囚车从你身边走过，你没有在意。等你走远了，才想起刚才囚车里的人似乎有些眼熟。但已经来不及了。",effFail:{}},
  {cn:"私奔男女",base:50,ok:"一对年轻男女在路边的林子里私会，看到你就慌了。你笑了笑，假装没看见，继续赶路。他们在你身后，小声地道谢。",effOk:{karma:2,san:2},
   fail:"你多看了两眼，那对男女慌慌张张地跑了。你摇了摇头，继续赶路。",effFail:{}},
  {cn:"老兵问路",base:55,ok:"一个缺了条胳膊的老兵拦住你，问去附近城镇的路。你详细地告诉了他，他感激不尽，给你讲了很多战场上的故事。",effOk:{xp:20,karma:1},
   fail:"你指了个方向，其实你也不太确定。老兵道谢后走了。你希望他能走对路。",effFail:{karma:-1}},
  {cn:"神秘老者",base:40,ok:"一个白胡子老者坐在路边的石头上，看到你就招了招手。你走过去，他给你讲了一段大陆的秘辛，然后就消失了。你愣了半天，才发现他坐过的石头上，留着一枚古币。",effOk:{xp:30,gold:15,flag:"mysterious_elder"},
   fail:"你没有理会那个老者，继续赶路。走了很远，你才发现，那个老者似乎不是普通人——但已经来不及了。",effFail:{}}
);

/* 新增旅行事件 - 地形探索类 */
TRAVEL_EVENTS.push(
  {cn:"废弃矿洞",base:45,ok:"路边有一个废弃的矿洞，洞口长满了杂草。你进去看了看，在角落里找到了一些没被采完的矿石。",effOk:{gold:12,item:"矿石"},
   fail:"矿洞很深，你走了一段就迷路了。在里面转了半天，才找到出口。出来的时候，浑身都是煤灰。",effFail:{fatigue:3,hp:-4}},
  {cn:"古树神龛",base:50,ok:"一棵千年古树下，有一个小小的神龛。你上了柱香，许了个愿。香火烧得很旺，似乎是个好兆头。",effOk:{san:4,karma:2,flag:"shrine_blessing"},
   fail:"神龛已经破败了，香炉里全是灰。你看了看，没有上香，继续赶路。",effFail:{}},
  {cn:"瀑布深潭",base:50,ok:"一道瀑布从山崖上倾泻而下，下面是一个深潭。你在潭边洗了把脸，喝了几口山泉水，精神为之一振。",effOk:{fatigue:-2,hp:5},
   fail:"潭水太深太凉，你下去游泳差点抽筋。好不容易爬上岸，冻得瑟瑟发抖。",effFail:{hp:-6,fatigue:1}},
  {cn:"山涧栈道",base:45,ok:"一条栈道修在悬崖边上，下面是万丈深渊。你扶着岩壁，一步一步地走了过去。虽然腿有些软，但你没有往下看。",effOk:{san:-2,xp:10},
   fail:"栈道年久失修，你走到一半，脚下的木板断了。你抓住了一根绳子，悬在半空中，费了九牛二虎之力才爬上来。",effFail:{hp:-12,san:-8,fatigue:2}},
  {cn:"地下暗河",base:40,ok:"你发现了一个地下暗河的入口，河水清澈。你装了一壶水，还在河边捡到了几枚漂亮的石头。",effOk:{gold:5,item:"清泉水"},
   fail:"暗河里有什么东西拽了你的脚一下。你吓得连滚带爬地跑了出来，水壶都丢了。",effFail:{san:-6,hp:-4}},
  {cn:"古战场遗址",base:45,ok:"一片古战场的遗址，到处都是锈迹斑斑的兵器和铠甲。你翻找了一会儿，找到了一把还能用的短剑。",effOk:{gold:10,item:"古剑"},
   fail:"古战场里阴气很重，你走了一会儿就觉得浑身发冷。你赶紧离开了，什么都没找到。",effFail:{san:-5,fatigue:1}},
  {cn:"商路驿站",base:60,ok:"你找到了一个商路驿站，虽然简陋，但有热饭和热水。你饱餐了一顿，好好休息了一晚，第二天精神饱满地上路。",effOk:{fatigue:-3,gold:-5,hp:8},
   fail:"驿站已经废弃了，屋顶塌了一半。你在里面凑合了一夜，被蚊子咬了一身包。",effFail:{hp:-5,fatigue:1}},
  {cn:"渡口等待",base:50,ok:"渡口的船家正好要开船，你赶上了。船费不贵，还省了一天的脚程。",effOk:{gold:-3,fatigue:-1},
   fail:"渡口的船刚走，下一班要等三天。你在渡口等了三天，花了不少食宿费。",effFail:{gold:-10,fatigue:2}},
  {cn:"山路捷径",base:45,ok:"你发现了一条山路捷径，比官道近了不少。虽然路难走了些，但省了大半天的时间。",effOk:{fatigue:1,xp:5},
   fail:"所谓的捷径其实是条死路。你走到尽头才发现，不得不原路返回。白白浪费了半天。",effFail:{fatigue:3}}
);

/* 新增旅行事件 - 超自然/深渊类 */
TRAVEL_EVENTS.push(
  {cn:"夜半鬼哭",base:35,ok:"半夜里，你听到远处传来隐隐的哭声，像是女人在哭。你握紧武器，屏息听了一会儿。哭声渐渐远了，似乎没有靠近。你一夜没睡好，但人没事。",effOk:{san:-4,fatigue:1},
   fail:"哭声越来越近，最后就在你的帐篷外面。你不敢出去，缩在帐篷里抖了一夜。天亮之后，你发现帐篷外面，有一串小小的脚印。",effFail:{san:-12,hp:-5,fatigue:2}},
  {cn:"深渊裂隙",base:30,ok:"地面上有一道细小的裂缝，里面透出暗红色的光。你离得远远的，绕了过去。裂缝里似乎有什么东西在动，但你没有细看。",effOk:{san:-6,xp:15,flag:"abyss_rift_seen"},
   fail:"你好奇地凑近了裂缝，想看看里面有什么。突然，一只手从裂缝里伸了出来，抓向你的脸。你吓得连滚带爬地跑了，脸被抓伤了一道。",effFail:{san:-15,hp:-10,wound:"深渊抓伤"}},
  {cn:"亡灵夜行",base:35,ok:"你在夜里赶路，遇到了一队亡灵——它们排着队，默默地走在路上，似乎在重复着生前的行军。你屏住呼吸，躲在路边，等它们走过去。",effOk:{san:-8,xp:20},
   fail:"亡灵发现了你。它们转过头，空洞的眼眶盯着你。你转身就跑，跑了很远才甩掉它们。但你总觉得，背后有什么东西在跟着你。",effFail:{san:-15,hp:-8,fatigue:3}},
  {cn:"邪神祭坛",base:30,ok:"路边的林子里，有一个小小的祭坛，上面刻着你不认识的符号。你没有靠近，远远地绕了过去。祭坛上似乎有什么东西在动，但你没有细看。",effOk:{san:-5,flag:"evil_altar_seen"},
   fail:"你好奇地走近了祭坛，想看看上面刻的是什么。突然，祭坛上的符号亮了起来，一股黑暗的力量涌入你的身体。你感到一阵恶心，吐了半天。",effFail:{san:-12,hp:-8}},
  {cn:"时空错乱",base:25,ok:"你走着走着，突然觉得周围的一切都变慢了——树叶悬在半空中，鸟儿停在半空中。过了几息，一切恢复了正常。你摸了摸自己，发现没有异常。",effOk:{san:-8,xp:25,flag:"time_anomaly"},
   fail:"时空错乱持续了很久。你在错乱的时空中，看到了一些不该看到的东西——过去的影像，未来的碎片。等一切恢复正常，你已经精神恍惚了。",effFail:{san:-20,hp:-5}},
  {cn:"魔法风暴",base:35,ok:"天空中突然出现了彩色的漩涡，魔法元素狂暴地涌动。你找了处低洼地，用魔法护盾护住自己，等风暴过去。虽然护盾碎了，但人没事。",effOk:{xp:20,san:-4},
   fail:"魔法风暴比你预想的强。你的护盾被击碎，狂暴的魔法元素涌入你的身体，造成了内伤。你花了好几天才恢复。",effFail:{hp:-15,san:-8,fatigue:2}},
  {cn:"低语森林",base:35,ok:"你穿过一片森林，林子里到处都是低语声——像是有无数人在你耳边说话。你集中精神，屏蔽了那些声音，快步走出了森林。",effOk:{san:-6,xp:15},
   fail:"低语声钻进了你的脑子，你开始分不清哪些是真实的，哪些是幻觉。你在森林里转了很久，才走出来。出来的时候，你的眼睛里布满了血丝。",effFail:{san:-15,fatigue:3}},
  {cn:"诅咒之地",base:30,ok:"你进入了一片被诅咒的土地——草木枯黄，鸟兽绝迹，空气中弥漫着死亡的气息。你屏住呼吸，快步穿过了这片区域。虽然有些不适，但没有大碍。",effOk:{san:-6,hp:-5},
   fail:"诅咒之地的影响比你预想的强。你在里面走了一段，就觉得浑身无力，精神萎靡。你不得不退了回来，绕了很远的路。",effFail:{san:-10,hp:-12,fatigue:3}}
);

/* 新增旅行事件 - 机遇/宝藏类 */
TRAVEL_EVENTS.push(
  {cn:"藏宝图残片",base:35,ok:"你在一棵老树的树洞里，发现了一张泛黄的羊皮纸。上面画着地图的一部分，似乎是某个宝藏的位置。你小心地收好，也许以后有用。",effOk:{xp:15,item:"藏宝图残片",flag:"treasure_map_piece"},
   fail:"羊皮纸已经烂得不成样子了，上面的图案模糊不清。你看了半天，什么都没看出来，只好扔掉了。",effFail:{}},
  {cn:"落难贵族",base:45,ok:"一个穿着华贵但满身泥泞的人跪在路边，自称是落难的贵族，希望你能借他一些钱。你给了他一些钱，他千恩万谢，给了你一枚家族徽章作为信物。",effOk:{gold:-10,item:"贵族徽章",flag:"helped_noble",karma:2},
   fail:"你觉得他是个骗子，没有给钱。他失望地看了你一眼，转身走了。后来你听说，那个人真的是落难的贵族，已经被人救走了。",effFail:{karma:-1}},
  {cn:"魔法植物",base:45,ok:"你在路边发现了一株罕见的魔法植物，散发着淡淡的光芒。你小心地采了下来，这东西在炼金工坊里能卖个好价钱。",effOk:{gold:15,item:"魔法植物"},
   fail:"你采植物的时候，不小心被它的刺扎了一下。手指立刻肿了起来，又麻又痛。你赶紧把植物扔了，用草药敷了半天。",effFail:{hp:-6,gold:-3}},
  {cn:"废弃马车",base:50,ok:"路边有一辆废弃的马车，似乎是被遗弃的。你翻了翻，在车厢的暗格里找到了一些金币和一瓶好酒。",effOk:{gold:20,item:"陈年美酒"},
   fail:"马车里什么都没有，只有一些破布和发霉的食物。你白忙活了半天，还被跳蚤咬了一身包。",effFail:{hp:-3}},
  {cn:"流星坠落",base:30,ok:"夜空中，一颗流星划过天际，坠落在不远处。你赶过去看，发现是一块魔法陨石，散发着微弱的魔力。你把它收了起来。",effOk:{gold:25,item:"魔法陨石",xp:10},
   fail:"流星坠落的地方太远了，你赶过去的时候，已经被别人捡走了。你只看到了一个大坑，和一些烧焦的痕迹。",effFail:{}},
  {cn:"隐士赠礼",base:40,ok:"你在山里遇到了一个隐士，他住在一个山洞里，正在打坐。你没有打扰他，准备离开。他却叫住了你，给了你一颗丹药，说是能强身健体。你吃了，确实觉得精神了不少。",effOk:{hp:15,maxHp:5,flag:"hermit_gift"},
   fail:"你没有遇到什么隐士，山里只有风声和鸟鸣。你继续赶路。",effFail:{}},
  {cn:"古墓入口",base:35,ok:"你发现了一个古墓的入口，石门上刻着古老的符文。你没有进去，只是在门口看了看，记下了位置。也许以后，你会回来探索。",effOk:{xp:15,flag:"ancient_tomb_location"},
   fail:"你好奇地走进了古墓，里面机关重重。你触发了一个陷阱，被毒箭射中了肩膀。你赶紧退了出来，什么都没拿到。",effFail:{hp:-15,san:-5,wound:"毒箭伤"}}
);

/* ============================================================
   v18 方向二：城市日常事件池系统
   ============================================================ */
const CITY_DAILY_EVENTS = [
  {cn:"酒馆传闻",base:55,ok:"酒馆里人声鼎沸，你坐在角落里，听着周围人的议论。今天的话题是北方的战事——据说铁门关又打了一场大仗，双方死伤惨重。你默默记下了这些消息。",effOk:{xp:12,gold:-2},
   fail:"酒馆里都是些醉汉的胡言乱语，你听了半天，什么有用的消息都没听到。酒钱倒是花了不少。",effFail:{gold:-2}},
  {cn:"集市纠纷",base:50,ok:"集市上，一个商贩和顾客吵了起来，围了一圈人。你看了一会儿，弄清楚了事情的来龙去脉，还帮他们评了理。双方都服了气，散了。",effOk:{karma:2,rep:1,xp:8},
   fail:"集市上的纠纷和你无关，你看了两眼就走了。人太多，挤得你一身汗。",effFail:{}},
  {cn:"街头表演",base:60,ok:"街头有个艺人在表演杂耍，身手矫健，引来阵阵喝彩。你看了一会儿，心情不错，打赏了几个铜币。",effOk:{san:4,gold:-3},
   fail:"艺人的表演很无聊，看了两眼你就走了。",effFail:{}},
  {cn:"教堂告解",base:55,ok:"你走进教堂，在告解室里坐了一会儿。虽然你不是信徒，但那种宁静的氛围，让你的心情平静了不少。",effOk:{san:6,karma:1},
   fail:"教堂里的神父一直在劝你入教，你听得不耐烦，找了个借口走了。",effFail:{san:-2}},
  {cn:"夜间巡逻",base:45,ok:"你在夜里的街道上行走，遇到了一队巡逻的卫兵。他们盘问了你几句，你从容应对，他们放你走了。你还注意到，街角有个黑影一闪而过。",effOk:{xp:10,flag:"night_shadow"},
   fail:"你被巡逻的卫兵拦住了，他们怀疑你是小偷，把你带到了守卫室。你解释了半天，才被放出来。白白浪费了一个时辰。",effFail:{gold:-5,rep:-1}},
  {cn:"节日庆典",base:65,ok:"今天是城里的节日，到处张灯结彩，人们载歌载舞。你也加入了庆祝的队伍，吃了美食，看了表演，心情大好。",effOk:{san:8,gold:-5,karma:1},
   fail:"节日人太多了，你被挤得晕头转向，钱包还被人偷了。你懊恼不已。",effFail:{gold:-10,san:-4}},
  {cn:"乞丐纠缠",base:50,ok:"一个乞丐拦住了你，苦苦哀求。你给了他几个铜币，他千恩万谢地走了。你心里有些感慨——这个世界，贫富差距太大了。",effOk:{karma:2,gold:-3,san:2},
   fail:"你没有给乞丐钱，他纠缠了你半天，最后骂骂咧咧地走了。你心里有些不舒服。",effFail:{karma:-1}},
  {cn:"商铺打折",base:55,ok:"你路过一家商铺，正在打折促销。你进去看了看，买了几样合用的东西，比平时便宜了不少。",effOk:{gold:-10,item:"打折商品"},
   fail:"打折的都是些卖不出去的残次品，你看了半天，什么都没买。",effFail:{}},
  {cn:"街头斗殴",base:45,ok:"两伙人在街头打了起来，你绕路走了。远远地，你看到卫兵赶来，把他们都带走了。",effOk:{xp:5},
   fail:"你被卷入了街头斗殴，挨了几拳。好不容易才脱身，身上青一块紫一块的。",effFail:{hp:-8,rep:-1}},
  {cn:"告示板更新",base:60,ok:"你在告示板前看了看，发现了几条新的委托——有找人的，有找物的，还有悬赏的。你记下了几条感兴趣的。",effOk:{xp:8,flag:"new_quests"},
   fail:"告示板上都是些旧消息，没有什么新东西。你失望地走了。",effFail:{}},
  {cn:"偶遇熟人",base:50,ok:"你在街上遇到了一个熟人——可能是以前的同学，也可能是以前的雇主。你们聊了一会儿，交换了近况，还约了以后再聚。",effOk:{rep:2,xp:10,flag:"met_acquaintance"},
   fail:"街上人来人往，你没有遇到认识的人。",effFail:{}},
  {cn:"地下消息",base:40,ok:"你在城市的角落里，遇到了一个鬼鬼祟祟的人。他轻声问你要不要买消息。你花了点钱，买到了一条有用的情报。",effOk:{gold:-8,xp:15,flag:"underground_info"},
   fail:"那个人是个骗子，你花了钱，买到的都是些假消息。等你反应过来，他已经跑了。",effFail:{gold:-8,san:-3}},
  {cn:"贵族出行",base:55,ok:"一队贵族的马车从街上走过，行人纷纷避让。你站在路边，看着马车里的贵族——他们的表情冷漠，似乎对平民的生活毫不在意。",effOk:{xp:8},
   fail:"贵族的马车横冲直撞，你躲闪不及，被溅了一身泥。你骂了一句，但也无可奈何。",effFail:{san:-3,gold:-2}},
  {cn:"学术讲座",base:55,ok:"学院的教授在城里做公开讲座，你去听了。讲座的内容很精彩，你学到了不少东西。",effOk:{xp:20,int:1},
   fail:"讲座的内容太深奥了，你听了半天，什么都没听懂。白白浪费了时间。",effFail:{}},
  {cn:"医疗义诊",base:55,ok:"城里的医馆在做义诊，你去看了看。医生给你检查了身体，还免费给了你一些草药。",effOk:{hp:10,gold:-2},
   fail:"义诊的人太多了，你排了半天队，还没轮到你，义诊就结束了。",effFail:{fatigue:1}}
]; window.CITY_DAILY_EVENTS = CITY_DAILY_EVENTS; /* /v60inj:winx2:CITY_DAILY_EVENTS/ */

/* ============================================================
   v18 方向三：夜间梦境与SAN值事件
   ============================================================ */
const DREAM_EVENTS = [
  {cn:"深渊之梦",sanLoss:8,text:"你做了一个梦。梦里，你站在一片黑色的荒原上，天空是血红色的。荒原的尽头，有一道巨大的门，门后面是无尽的黑暗。你听到门后面，有什么东西在呼吸。低沉的，古老的，充满恶意的呼吸。你想跑，但腿像灌了铅一样。那呼吸声越来越近，越来越近——然后你醒了。浑身都是冷汗。",eff:{san:-8,hp:-4}},
  {cn:"故人之梦",sanLoss:4,text:"你梦到了一个故人——可能是你死去的亲人，也可能是你失散的朋友。他/她站在你面前，微笑着看着你，但不说话。你想抓住他/她，但你的手穿过了他/她的身体。他/她的身体开始变得透明，一点一点地消失了。你醒了，眼角有泪。",eff:{san:-4,hp:-2}},
  {cn:"坠落之梦",sanLoss:5,text:"你梦到自己在坠落。从很高很高的地方，一直往下掉。风在你耳边呼啸，地面越来越近。你想飞，但飞不起来。你想喊，但喊不出声。就在你要摔到地面的那一刻——你醒了。心脏狂跳不止。",eff:{san:-5,hp:-3}},
  {cn:"追逐之梦",sanLoss:6,text:"你梦到自己在被什么东西追逐。你不知道那是什么，只知道它很可怕。你跑啊跑，跑过了森林，跑过了沙漠，跑过了城市。但它一直跟在你后面，越来越近。你回头看了一眼——然后你醒了。你不记得它长什么样，只记得那种深入骨髓的恐惧。",eff:{san:-6,hp:-3}},
  {cn:"预知之梦",sanLoss:3,text:"你做了一个奇怪的梦。梦里，你看到了一些片段——一个城市，一场战争，一个人，一件事。这些片段很模糊，但你有一种感觉——它们会在未来发生。你醒了，心里有一种说不出的不安。",eff:{san:-3,xp:15,flag:"prophecy_dream"}},
  {cn:"黄林晶之梦",sanLoss:10,text:"你梦到了黄林晶。他穿着白色的长袍，站在七印的中央，看着你。他的眼睛里，有痛苦，有疲惫，还有一丝……求助。他张了张嘴，似乎想说什么，但你听不到声音。然后，他的身体开始裂开，黑色的液体从裂缝里涌出来——你醒了。大口大口地喘着气。",eff:{san:-10,hp:-5,flag:"huanglinjing_dream"}},
  {cn:"童年之梦",sanLoss:2,text:"你梦到了自己的童年。你回到了小时候，回到了你的家乡。一切都是那么熟悉——你的家，你的朋友，你熟悉的街道。你在梦里笑了，笑得很开心。然后，你醒了。发现自己躺在陌生的床上，周围是陌生的环境。你有些想家了。",eff:{san:-2,hp:2}},
  {cn:"战斗之梦",sanLoss:5,text:"你梦到自己在战斗。对手是一个你看不清脸的人，他/她的剑法很高超，你被打得节节败退。最后，他/她一剑刺向你的心脏——你醒了。胸口隐隐作痛，像是真的被刺中了一样。",eff:{san:-5,hp:-4}},
  {cn:"溺水之梦",sanLoss:6,text:"你梦到自己掉进了水里。水很深，很黑，你拼命地想游上去，但身体越来越沉。水灌进了你的鼻子和嘴巴，你无法呼吸。就在你要失去意识的时候——你醒了。浑身都是冷汗，喉咙里还有那种窒息的感觉。",eff:{san:-6,hp:-4}},
  {cn:"低语之梦",sanLoss:7,text:"你梦到自己站在一片虚空里，周围全是低语声。无数的声音在你耳边说话，有的在诱惑你，有的在威胁你，有的在哀求你。你捂住耳朵，但声音还是钻了进来。你想喊，但喊不出声。最后，你用尽全身力气，大喊了一声——你醒了。发现自己真的喊出了声，室友（如果有的话）被你吵醒了。",eff:{san:-7,hp:-3}},
  {cn:"美好之梦",sanLoss:0,text:"你做了一个美好的梦。梦里，世界和平，没有战争，没有痛苦，没有死亡。你和你爱的人在一起，过着平静幸福的生活。你笑了，笑得很开心。然后你醒了。虽然梦是假的，但你的心情很好。",eff:{san:6,hp:3}},
  {cn:"无梦之夜",sanLoss:0,text:"这一夜，你睡得很沉，没有做梦。醒来的时候，精神饱满，神清气爽。",eff:{san:2,hp:5,fatigue:-2}}
]; window.DREAM_EVENTS = DREAM_EVENTS; /* /v60inj:winx2:DREAM_EVENTS/ */

/* ============================================================
   v18 方向四：真·多周目世界生成器（数据结构）
   ============================================================ */
const WORLD_SEED = {
  generate: function(){
    const seed = S.worldSeed || Math.floor(Math.random()*100000);
    S.worldSeed = seed;
    // 根据种子生成世界初始状态
    S.worldState = {
      warIntensity: (seed % 5) + 1,           // 战争强度 1-5
      purgeLevel: ((seed >> 3) % 5) + 1,      // 净化令强度 1-5
      tradeCrisis: ((seed >> 6) % 4) + 1,     // 商路危机程度 1-4
      sealWeakness: ((seed >> 9) % 5) + 1,    // 七印松动程度 1-5
      academyPolitics: ((seed >> 12) % 4) + 1 // 学院政治格局 1-4
    };
    return S.worldState;
  }
};

/* ============================================================
   v18 事件枢纽节点
   ============================================================ */
N["event_hub"] = function(){
  const evType = S.flags.eventType || "travel";
  let pool, title;
  if(evType==="city"){ pool=CITY_DAILY_EVENTS; title="城市日常"; }
  else if(evType==="dream"){ pool=DREAM_EVENTS; title="夜间梦境"; }
  else { pool=TRAVEL_EVENTS; title="旅行事件"; }
  const ev = choice(pool);
  S.flags.currentEvent = ev.cn;
  const isDream = evType==="dream";
  return {place:title, where:"随机事件",
    text: isDream ? [ev.text] : [
      "【"+ev.cn+"】",
      ev.ok
    ],
    options:[
      {t:"继续旅程", effect:{time:1}, go:"arrive_generic"}
    ]};
};


/* ===== 同学个人剧情节点 ===== */
/* /v62inj:chunk-npc/ N["classmate_overview"] 已移入 chunks/v62_npc.js */
/* 艾伦 */
/* /v62inj:chunk-npc/ N["classmate_allen_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_allen_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_allen_climax"] 已移入 chunks/v62_npc.js */
/* 蕾克斯 */
/* /v62inj:chunk-npc/ N["classmate_rexa_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_rexa_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_rexa_climax"] 已移入 chunks/v62_npc.js */
/* 塞西莉亚 */
/* /v62inj:chunk-npc/ N["classmate_cecilia_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_cecilia_climax"] 已移入 chunks/v62_npc.js */
/* 马库斯 */
/* /v62inj:chunk-npc/ N["classmate_marcus_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_marcus_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_marcus_climax"] 已移入 chunks/v62_npc.js */
/* 艾拉拉 */
/* /v62inj:chunk-npc/ N["classmate_elara_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_elara_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_elara_climax"] 已移入 chunks/v62_npc.js */
/* 索林 */
/* /v62inj:chunk-npc/ N["classmate_thorin_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_thorin_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_thorin_climax"] 已移入 chunks/v62_npc.js */
/* 露娜 */
/* /v62inj:chunk-npc/ N["classmate_luna_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_luna_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_luna_climax"] 已移入 chunks/v62_npc.js */
/* 凯 */
/* /v62inj:chunk-npc/ N["classmate_kai_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_kai_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_kai_climax"] 已移入 chunks/v62_npc.js */
/* 索菲亚 */
/* /v62inj:chunk-npc/ N["classmate_sophia_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_sophia_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_sophia_climax"] 已移入 chunks/v62_npc.js */
/* 菲利克斯 */
/* /v62inj:chunk-npc/ N["classmate_felix_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_felix_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_felix_climax"] 已移入 chunks/v62_npc.js */
/* 艾莉亚 */
/* /v62inj:chunk-npc/ N["classmate_aria_intro"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_aria_story"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_aria_climax"] 已移入 chunks/v62_npc.js */
/* ===== 神器剩余9件寻宝线 ===== */
/* /v62inj:chunk-relic/ N["relic_overview2"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_search"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_puzzle"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_element_boss"] 已移入 chunks/v62_relic.js */
/* 神圣圣杯 */
/* /v62inj:chunk-relic/ N["relic_grail_intro"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_grail_search"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_grail_puzzle"] 已移入 chunks/v62_relic.js */
/* /v62inj:chunk-relic/ N["relic_grail_boss"] 已移入 chunks/v62_relic.js */
/* ===== 势力主线深化：自由城邦 ===== */
N["faction_free_deep"]=function(){return{place:"自由城邦·交汇城",text:function(){
  var t=[];
  t.push("交汇城的议会，最近不太平。");
  t.push("你在酒馆里听到了很多传闻——有人说，美第奇家族的家主洛伦佐，在跟暗蚀会做交易。有人说，议会里有三个议员，已经被南方城邦收买了。还有人说，自由城邦的军队，正在秘密调动。");
  t.push("这些传闻，真真假假，假假真真。但你知道——交汇城的平静，快要被打破了。");
  t.push("你决定去议会大厦看看。也许，你能在那里找到一些答案。");
  return t;
},options:[
  {t:"去议会大厦打探消息",check:{a:"CHA",sk:"persu",label:"打听"},go:"faction_free_council",tier:{crit:[{t:"你在议会大厦门口拦住了一个刚出来的书记员。你用了一点小钱，再加一点威胁，他就什么都说了——议会正在秘密讨论一项提案：对南方城邦加征关税。提案的发起人，是美第奇家族的人。",effect:{flag:"free_tariff",rep_free:5}}],ok:[{t:"你在议会大厦附近转了一圈，跟几个小贩聊了聊。他们说，最近议会的人进出得很频繁，而且都很紧张。「要出大事了。」一个卖面包的老头说，「我在这里卖了三十年面包，从来没见过议会这么忙。」",effect:{flag:"free_tension"}}],fail:[{t:"你在议会大厦门口转了很久，但没有人愿意跟你说话。议会的守卫看你的眼神很警惕，像是在看一个可疑分子。你不得不离开。",effect:{time:1}}],critfail:[{t:"你试图溜进议会大厦，但被守卫抓住了。他们把你关了一夜，第二天早上才把你放出来，还罚了你一笔钱。「下次再敢来，就不是关一夜这么简单了。」守卫说。",effect:{gold:-20,time:1,rep_free:-5}}]}},
  {t:"去美第奇家族的府邸看看",go:"faction_free_medici"},
  {t:"离开",go:"fc_jiaohui_entry"}
]}};

N["faction_free_council"]=function(){return{place:"自由城邦·议会大厦",text:function(){
  var t=[];
  if(S.flags.free_tariff){
    t.push("对南方城邦加征关税？");
    t.push("你觉得这很奇怪。自由城邦的根基，就是自由贸易。对南方城邦加征关税，等于自断臂膀。");
    t.push("除非——美第奇家族有别的目的。");
    t.push("你想起了在酒馆里听到的传闻——美第奇家族在跟暗蚀会做交易。如果是真的，那加征关税，可能是为了——给暗蚀会筹集资金？");
    t.push("或者，更复杂——美第奇家族想借关税之争，打击议会里的对手，独揽大权？");
    t.push("你觉得，你需要去美第奇家族的府邸看看。");
  } else if(S.flags.free_tension){
    t.push("议会确实很紧张。");
    t.push("你看到很多议员进进出出，每个人的脸上都写着焦虑。有人在争吵，有人在密谈，有人在——偷偷摸摸地往袖子里塞信封。");
    t.push("你拦住了一个看起来比较好说话的议员助手，问他发生了什么。他看了看四周，压轻声音说，「议会要分裂了。有人主战，有人主和。有人想跟南方城邦开战，有人想跟他们和解。」");
    t.push("「开战？」你问，「为什么？」「银穗商路。」他说，「南方城邦控制了银穗商路的南段，自由城邦的商人被卡了脖子。有人说，要打。」");
  }
  arr.push("你最后回望一眼议会大厦，转身穿过街口，往下一程赶路。");
      return t;
},options:[
  {t:"去美第奇家族的府邸",go:"faction_free_medici"},
  {t:"去酒馆听听更多消息",go:"faction_free_tavern",effect:{time:1}}
]}};

;

N["faction_free_eclipse"]=function(){return{place:"自由城邦·美第奇府邸地下室",text:function(){
  var t=[];
  if(S.flags.medici_eclipse_proof){
    t.push("你趴在门缝上，屏住了呼吸。");
    t.push("地下室里，洛伦佐·德·美第奇坐在一张桌子的主位。他的对面，坐着一个穿着黑袍的人——你认出了他，暗蚀会行动司的司长，「血手」哈根。");
    t.push("「资金已经准备好了。」洛伦佐说，「下个月，关税一提，钱就会源源不断地进来。」");
    t.push("「很好。」哈根说，他的声音像砂纸磨过铁皮，「教主很满意。等深渊降临的时候，美第奇家族——会是新秩序的第一家族。」");
    t.push("洛伦佐笑了。那笑容很冷，很贪婪。「我等这一天，等了二十年。」");
    t.push("你觉得脊背发凉。美第奇家族——自由城邦最有权势的家族，居然在跟暗蚀会合作，为深渊降临筹集资金。");
    t.push("你悄悄地退了出去。你知道，你掌握了一个天大的秘密。但这个秘密，也可能给你招来杀身之祸。");
  } else if(S.flags.medici_eclipse_suspect){
    t.push("你站在地下室的门外，听着里面传来的只言片语。");
    t.push("「……资金……下个月……」「……教主很满意……」「……新秩序……」");
    t.push("你听不太清楚，但你能感觉到——地下室里在进行一场很危险的交易。");
    t.push("你想再靠近一点，但门突然开了。你赶紧躲到了一个花瓶后面。一个灰斗篷的人走了出来，左右看了看，然后离开了。");
    t.push("你松了一口气。虽然没有听到完整的对话，但你已经确定了——美第奇家族，确实在跟暗蚀会有来往。");
  }
  return t;
},options:[
  {t:"把这个消息告诉议会的反对派",go:"faction_free_reveal",effect:{flag:"free_reveal"}},
  {t:"用这个秘密勒索洛伦佐",go:"faction_free_blackmail",effect:{flag:"free_blackmail"}},
  {t:"先藏好这个秘密，静观其变",go:"fc_jiaohui_entry",effect:{karma:1}}
]}};

N["faction_free_reveal"]=function(){return{place:"自由城邦·议会大厦",text:function(){
  var t=[];
  t.push("你找到了议会里的反对派领袖——一个叫马基雅维利的老议员。");
  t.push("他听了你的话，脸色越来越凝重。「你确定？」他问，「你确定洛伦佐在跟暗蚀会合作？」");
  t.push("你点了点头，把你看到的、听到的，都告诉了他。");
  t.push("老议员沉默了很久。然后他说，「这件事，不能声张。美第奇家族的势力太大了，如果没有确凿的证据，我们扳不倒他。反而会被他反咬一口。」");
  t.push("「但你给了我们一个方向。」他说，「谢谢你。从今天起，你是自由城邦的朋友。」");
  t.push("他给了你一袋金币，还有一封信——一封可以在自由城邦任何地方通行的介绍信。");
  t.push("「去吧。」他说，「继续查。我们需要更多的证据。」");
  arr.push("离开议会大厦时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return t;
},options:[
  {t:"继续调查",go:"fc_jiaohui_entry",effect:{gold:50,rep_free:20,item:"议会介绍信"}}
]}};

N["faction_free_blackmail"]=function(){return{place:"自由城邦·美第奇府邸",text:function(){
  var t=[];
  t.push("你给洛伦佐写了一封信。");
  t.push("信里只有一句话——「我知道你跟哈根在地下室里谈了什么。」");
  t.push("第二天，你就收到了回信。信里也只有一句话——「开个价。」");
  t.push("你去了美第奇府邸。洛伦佐亲自接见了你。他看起来很平静，但你能看到，他的眼睛里有杀意。");
  t.push("「你想要什么？」他问，「钱？权力？还是——」他笑了笑，「你想要美第奇家族的庇护？」");
  t.push("你知道，这是一场赌博。如果你要得太多，他会杀了你。如果你要得太少，他会看不起你。");
  arr.push("你与美第奇府邸作别，踏上旅途。尘土扑上靴面，像旧识。");
      return t;
},options:[
  {t:"「我要一千金龙。」",check:{a:"CHA",sk:"persu",label:"谈判"},go:"faction_free_blackmail_result",tier:{crit:[{t:"洛伦佐盯着你看了很久，然后笑了。「聪明人。」他说，「不多不少，刚好是我能接受的价格。」他拍了拍手，一个仆人端上来一个箱子——里面装满了金币。「拿去吧。」他说，「但我警告你——这是第一次，也是最后一次。」",effect:{gold:1000,karma:-5,flag:"medici_blackmailed"}}],ok:[{t:"洛伦佐盯着你看了很久。「一千金龙？」他说，「你胃口不小。」他想了想，「五百。」「八百。」你说。「六百。」「成交。」他拍了拍手，仆人端上来六百金币。「拿去吧。」他说，「记住，管好你的嘴。」",effect:{gold:600,karma:-3,flag:"medici_blackmailed"}}],fail:[{t:"「一千金龙？」洛伦佐笑了，「你凭什么觉得你值这个价？」他拍了拍手，两个守卫走了进来。「给你一百金龙，滚。」他说，「不然——你就别想走出这个门。」你不得不拿了一百金龙，灰溜溜地走了。",effect:{gold:100,karma:-2,flag:"medici_blackmailed"}}],critfail:[{t:"「一千金龙？」洛伦佐的脸瞬间沉了下来，「你在威胁我？」他拍了拍手，四个守卫冲了进来，把你按在地上。「你知道得太多了。」他说，「本来想给你一条活路，但你自己不要。」他示意守卫把你拖出去——你被打了一顿，扔在了贫民窟的巷子里。身上的钱也被搜走了。",effect:{gold:-50,hp:-30,karma:-5,flag:"medici_enemy"}}]}},
  {t:"「我要美第奇家族的庇护。」",go:"faction_free_blackmail_result",effect:{flag:"medici_protege",karma:-3}}
]}};

N["faction_free_blackmail_result"]=function(){return{place:"自由城邦",text:function(){
  var t=[];
  if(S.flags.medici_protege){
    t.push("洛伦佐看着你，然后笑了。");
    t.push("「有意思。」他说，「你不要钱，要庇护？」");
    t.push("「你是个聪明人。」他说，「钱会花完，但美第奇家族的庇护——能保你一辈子。」");
    t.push("他从手指上摘下一枚戒指，递给你。戒指上刻着美第奇家族的徽记——六颗金球。");
    t.push("「从今天起，你是美第奇家族的人。」他说，「在自由城邦，没有人敢动你。但——」他的眼神变冷了，「你也要为美第奇家族做事。明白吗？」");
    t.push("你接过戒指。它很沉，像是一个承诺，也像是一个枷锁。");
  } else {
    t.push("你拿着钱，走出了美第奇府邸。");
    t.push("阳光照在你身上，但你觉得很冷。你知道，你做了一件不光彩的事——你用一个秘密，换了一笔钱。");
    t.push("但你也知道，在这个世界上，活着比什么都重要。");
    t.push("你把钱袋系在腰上，走进了交汇城的人群里。身后，美第奇府邸的金色屋顶，在阳光下闪闪发光，像是一个巨大的、金色的陷阱。");
  }
  return t;
},options:[
  {t:"继续",go:"fc_jiaohui_entry"}
]}};



/* ===== 七印第5印：南方深海 ===== */
/* /v62inj:chunk-seal/ N["seal5_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_hire"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_dive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_puzzle"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_outcome"] 已移入 chunks/v62_seal.js */
/* ===== 七印第6印：东部时光裂隙 ===== */
/* /v62inj:chunk-seal/ N["seal6_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_enter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_choice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_outcome"] 已移入 chunks/v62_seal.js */
/* ===== 七印第7印：死亡沙漠深渊神殿 ===== */
/* /v62inj:chunk-seal/ N["seal7_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_desert"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_approach"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_puzzle"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_outcome"] 已移入 chunks/v62_seal.js */
/* ===== 灭族幸存者：龙族 ===== */
N["extinct_overview"]=function(){return{place:"大陆",text:function(){
  var t=[];
  t.push("大陆的历史上，有很多种族消失了。");
  t.push("龙族、巨人族、翼人族、水族——他们曾经是大陆的主宰，但现在，只剩下传说和遗迹。");
  t.push("但传说不一定是真的。有些种族——也许并没有完全灭绝。也许，还有幸存者，藏在大陆的某个角落。");
  t.push("你决定去寻找他们。");
  return t;
},options:[
  {t:"寻找龙族幸存者",go:"extinct_dragon_intro"},
  {t:"寻找巨人族幸存者",go:"extinct_giant_intro"},
  {t:"寻找翼人族幸存者",go:"extinct_wing_intro"},
  {t:"寻找水族幸存者",go:"extinct_aqua_intro"},
  {t:"离开",go:"fc_jiaohui_entry"}
]}};

N["extinct_dragon_intro"]=function(){return{place:"北方公国·龙脊山",text:function(){
  var t=[];
  t.push("龙脊山，因龙族而得名。");
  t.push("传说，三千年前，这里是龙族的巢穴。成千上万的龙，在这里栖息、繁衍。但后来——龙族灭绝了。有人说，是黄林晶灭了龙族。有人说，是龙族自己内斗，同归于尽。");
  t.push("你站在龙脊山的山脚下，看着高耸入云的山峰。山上到处都是洞穴——那些曾经是龙的巢穴。");
  t.push("你听说，最近有人在山里看到了——龙。");
  t.push("不是传说中的巨龙，而是——一条很小的龙。只有狗那么大，鳞片是金色的，在山洞里飞来飞去。");
  t.push("你决定上山看看。");
  arr.push("你与龙脊山作别，踏上旅途。尘土扑上靴面，像旧识。");
      return t;
},options:[
  {t:"上山寻找龙的踪迹",check:{a:"AGI",sk:"survive",label:"生存"},go:"extinct_dragon_search",tier:{crit:[{t:"你沿着山洞一个一个找。终于，在一个很深的洞穴里，你看到了——一条小龙。它只有你的手臂那么长，鳞片是金色的，翅膀还没长全，正在啃一块石头。它看到你，吓了一跳，躲到了石头后面。",effect:{flag:"dragon_found"}}],ok:[{t:"你在山上找了很久，终于在一个山洞里，发现了一些鳞片——金色的鳞片，还带着温度。龙就在附近。",effect:{flag:"dragon_near",time:1}}],fail:[{t:"你在山上找了很久，但什么都没找到。只有空荡荡的山洞，和一些已经石化的龙骨。",effect:{time:2}}],critfail:[{t:"你在山上找的时候，不小心踩到了一块松动的石头——你从山坡上滚了下去，摔得鼻青脸肿。等你爬起来，天已经黑了。你不得不下山，明天再来。",effect:{hp:-15,time:1}}]}},
  {t:"在山脚下的村子打听",go:"extinct_dragon_search",effect:{time:1}}
]}};

N["extinct_dragon_search"]=function(){return{place:"北方公国·龙脊山洞穴",text:function(){
  var t=[];
  if(S.flags.dragon_found){
    t.push("你慢慢走近那条小龙。");
    t.push("它从石头后面探出头，警惕地看着你。它的眼睛是红色的——像两颗红宝石。它的嘴里，冒着淡淡的烟。");
    t.push("「别怕。」你说，「我不会伤害你。」");
    t.push("它歪了歪头，像是在听懂了你的话。然后，它从石头后面走出来，小心翼翼地靠近你。它用鼻子嗅了嗅你的手，然后——用头蹭了蹭你的手心。");
    t.push("它的鳞片很凉，像玉石一样光滑。");
    t.push("你注意到，它的脖子上，有一个项圈——一个很旧的项圈，上面刻着一个名字。「小金。」");
    t.push("这条龙，有名字。它不是野生的——它是有人养的。");
  } else if(S.flags.dragon_near){
    t.push("你循着鳞片的方向，找到了一个很深的洞穴。");
    t.push("洞穴里，有一堆金币——不多，只有几十枚。金币的旁边，有一些骨头——不是人的骨头，是羊的骨头。");
    t.push("龙就在附近。你能听到——从洞穴深处传来的，轻微的呼吸声。");
    t.push("你屏住呼吸，往深处走。然后，你看到了——一条小龙，蜷缩在角落里，正在睡觉。");
  } else {
    t.push("你在山脚下的村子里，找到了一个老人。");
    t.push("「龙？」老人说，「我见过。」");
    t.push("「三年前，我上山砍柴，看到了一条小龙。它只有猫那么大，在天上飞。我以为我眼花了——但后来，村里的羊丢了好几只。」");
    t.push("「它就在山上。」老人说，「但你别去惹它。龙——哪怕是小龙，也不是好惹的。」");
  }
  return t;
},options:[
  {t:"尝试跟小龙建立联系",check:{a:"CHA",sk:"animal",label:"驯兽"},go:"extinct_dragon_bond",tier:{crit:[{t:"你伸出手，让小龙嗅你的气味。它犹豫了一下，然后——它跳到了你的肩膀上，用头蹭你的脸。它的尾巴卷住了你的脖子，像是在拥抱。你感觉到了——它的意识。它很孤独，它很害怕，它——在找它的母亲。",effect:{flag:"dragon_bonded",item:"小金（龙）"}}],ok:[{t:"你伸出手，小龙嗅了嗅，然后——它让你摸了它的头。它的鳞片很凉，很光滑。它没有完全信任你，但至少——它不害怕你了。",effect:{flag:"dragon_trust"}}],fail:[{t:"你伸出手，但小龙后退了。它张开嘴，喷出了一口小火——没有烧到你，但把你的眉毛烤焦了。你不得不退回来。",effect:{hp:-5,time:1}}],critfail:[{t:"你伸出手，但小龙以为你要攻击它——它一口咬在了你的手上。你疼得大叫，把手缩了回来。手上有两个牙印，在流血。小龙躲回了石头后面，再也不出来了。",effect:{hp:-15,time:1}}]}},
  {t:"观察小龙的行为",go:"extinct_dragon_bond",effect:{time:1}}
]}};

N["extinct_dragon_bond"]=function(){return{place:"北方公国·龙脊山洞穴",text:function(){
  var t=[];
  if(S.flags.dragon_bonded){
    t.push("小龙在你的肩膀上，发出了呜呜的声音。");
    t.push("你感觉到了它的意识——它在找它的母亲。它的母亲，是一条巨大的金龙。三年前，她把小金藏在这个洞穴里，然后——飞走了，再也没有回来。");
    t.push("「她去了哪里？」你问。");
    t.push("小金的意识里，出现了一个画面——南方，大海，一个黑色的岛屿。它的母亲，飞向了那个岛屿。然后——画面断了。");
    t.push("你想起了第五印——南方深海。也许，龙族的幸存者，就在那里。也许，小金的母亲，还活着。");
    t.push("小金用头蹭了蹭你的脸。它决定——跟着你。");
    t.push("你有了一个同伴——一条真正的龙。虽然它现在还很小，但总有一天，它会长大，变成一条真正的巨龙。");
  } else if(S.flags.dragon_trust){
    t.push("你观察了小龙很久。");
    t.push("它很聪明——会用石头砸开坚果，会用尾巴卷住树枝荡秋千，会——在你不注意的时候，偷你的食物。");
    t.push("你发现，它的脖子上有一个项圈。项圈上刻着一个名字——「小金」。");
    t.push("这条龙，是有人养的。但它的主人——去了哪里？");
    t.push("你决定，先不打扰它。你把一些食物放在洞口，然后离开了。");
    t.push("你走的时候，回头看了一眼——小龙站在洞口，看着你。它的眼睛里，有一丝——不舍。");
  }
  return t;
},options:[
  {t:"带着小金离开",go:"extinct_overview",effect:{flag:"dragon_companion",karma:2}},
  {t:"离开，让小金自由生活",go:"extinct_overview",effect:{karma:1}}
]}};

/* ===== 灭族幸存者：巨人族 ===== */
N["extinct_giant_intro"]=function(){return{place:"北方公国·巨人谷",text:function(){
  var t=[];
  t.push("巨人谷，因巨人而得名。");
  t.push("传说，巨人族曾经是大陆上最强大的种族之一。他们有三丈高，能徒手撕碎巨龙。但后来——巨人族灭绝了。有人说，是黄林晶灭了巨人族。有人说，是巨人族跟龙族开战，同归于尽。");
  t.push("你站在巨人谷的入口，看着眼前的巨大石柱——每一根都有十丈高，上面刻着巨人族的符文。");
  t.push("你听说，最近有人在谷里看到了——巨人。");
  t.push("不是传说中的三丈巨人，而是——一个只有一丈高的巨人。他在谷里游荡，捡石头，堆石头，像是在建造什么。");
  arr.push("你与巨人谷作别，踏上旅途。尘土扑上靴面，像旧识。");
      return t;
},options:[
  {t:"进入巨人谷",check:{a:"CON",sk:"survive",label:"生存"},go:"extinct_giant_search",tier:{crit:[{t:"你沿着巨大的石柱往里走。谷里很安静，只有风声。你走了大约一个时辰，终于看到了——一个巨人。他只有一丈高，比传说中的巨人矮很多，但还是比你高出两倍。他正在搬石头——一块比他还大的石头，他轻而易举地举了起来。",effect:{flag:"giant_found"}}],ok:[{t:"你走进巨人谷。谷里到处都是巨大的石柱和石像——都是巨人族的遗迹。你走了很久，终于在谷的深处，看到了一个巨大的脚印——很新的脚印。巨人就在附近。",effect:{flag:"giant_near",time:1}}],fail:[{t:"你走进巨人谷，但谷太大了——你走了很久，什么都没找到。只有巨大的石柱，和一些已经风化的巨人骸骨。",effect:{time:2}}],critfail:[{t:"你走进巨人谷，但你迷路了。谷里的石柱都长得一样，你分不清方向。你转了很久，才找到出口。等你出来的时候，天已经黑了。",effect:{time:1,hp:-5}}]}},
  {t:"在谷口观察",go:"extinct_giant_search",effect:{time:1}}
]}};

N["extinct_giant_search"]=function(){return{place:"北方公国·巨人谷深处",text:function(){
  var t=[];
  if(S.flags.giant_found){
    t.push("你躲在一根石柱后面，观察着那个巨人。");
    t.push("他在搬石头——一块接一块，把它们堆成一个台子。台子已经有三丈高了，他还在往上堆。");
    t.push("他的皮肤是灰色的，像石头一样。他的头发是白色的，很长，披在肩上。他只穿了一条兽皮裙，露出了满是伤疤的身体。");
    t.push("你注意到，他在唱歌——用一种很古老的语言，声音很低沉，像闷雷。你听不懂歌词，但你能感觉到——那是一首很悲伤的歌。");
    t.push("突然，他停了下来。他转过头，看向你藏身的方向。");
    t.push("「出来。」他说，声音像打雷，「我闻到你的味道了。」");
  } else if(S.flags.giant_near){
    t.push("你循着脚印，往谷的深处走。");
    t.push("脚印越来越大，越来越深。你走到了一个巨大的石台前——石台是用整块的石头雕成的，上面刻着巨人族的符文。");
    t.push("石台的旁边，有一个山洞。洞口很大——足够一个三丈高的巨人走进去。");
    t.push("你听到了——从山洞里传来的，沉重的呼吸声。");
  }
  return t;
},options:[
  {t:"走出去，跟巨人对话",check:{a:"CHA",sk:"persu",label:"沟通"},go:"extinct_giant_talk",tier:{crit:[{t:"你走了出去，举起双手，表示你没有恶意。巨人看着你，他的眼睛像两块巨石。「人类。」他说，「很久没有人类敢来这里了。」他放下了手里的石头，「你不怕我？」「不怕。」你说。他沉默了很久，然后——他笑了。那笑容很笨拙，但很真诚。「坐吧。」他说，「我叫石心。是这个世界上，最后一个巨人。」",effect:{flag:"giant_friend",giant_bond:2}}],ok:[{t:"你走了出去，举起双手。巨人看着你，没有攻击。「人类。」他说，「你来干什么？」「我来找巨人族。」你说。他沉默了，「巨人族……已经没有了。」",effect:{giant_bond:1}}],fail:[{t:"你走了出去，但巨人以为你要攻击他——他举起了石头。「滚！」他吼道，「人类都该死！」你不得不赶紧跑了。",effect:{hp:-10,time:1}}],critfail:[{t:"你走了出去，但你不小心踩到了一根骨头——「咔嚓」一声。巨人瞬间转过身，一拳砸了过来。你赶紧躲开，拳头砸在地上，砸出了一个大坑。你转身就跑，跑了很久才停下来。",effect:{hp:-20,time:1}}]}},
  {t:"继续观察",go:"extinct_giant_talk",effect:{time:1}}
]}};

N["extinct_giant_talk"]=function(){return{place:"北方公国·巨人谷",text:function(){
  var t=[];
  if(S.flags.giant_friend){
    t.push("你坐在石心的旁边——他坐着，你也坐着，但你还是得仰着头看他。");
    t.push("「巨人族，是怎么灭绝的？」你问。");
    t.push("石心沉默了很久。然后他说，「不是灭绝。是——牺牲。」");
    t.push("「三千年前，深渊降临。巨人族是第一个冲上去的。我们用身体挡住了深渊的怪物，给黄林晶争取了时间。」");
    t.push("「我们族里有三千个战士。最后——只剩下了我。」");
    t.push("「黄林晶说，巨人族是英雄。他说，他会永远记住我们。」石心苦笑了一下，「但他忘了。所有人都忘了。现在，巨人族只是传说里的怪物。」");
    t.push("「我在这里堆石头，是因为——我想建一个纪念碑。纪念我的族人。」他说，「但我一个人，建不完。」");
    t.push("你看着他——这个三丈高的巨人，这个孤独的幸存者，心里涌起了一股说不出的感觉。");
  } else {
    t.push("你观察了巨人很久。");
    t.push("他在堆石头——一块接一块，把它们堆成一个台子。台子已经有三丈高了，但他还在往上堆。");
    t.push("你注意到，他的动作很慢，很笨拙——像是一个不习惯精细活的人，在做一件需要耐心的事。");
    t.push("他在唱歌——用一种很古老的语言。你听不懂歌词，但你能感觉到——那是一首很悲伤的歌。");
    t.push("你决定，不打扰他。你悄悄地离开了。");
    t.push("但你知道——巨人族，还没有完全灭绝。至少，还有一个人，在守护着他们的记忆。");
  }
  arr.push("别过巨人谷，你沿官道走出里许，回头已看不清来处。");
      return t;
},options:[
  {t:"「我帮你建纪念碑。」",go:"extinct_giant_end",effect:{giant_bond:2,karma:3,flag:"giant_helper"}},
  {t:"离开",go:"extinct_overview",effect:{time:1}}
]}};

N["extinct_giant_end"]=function(){return{place:"北方公国·巨人谷",text:function(){
  var t=[];
  t.push("你帮石心搬石头。");
  t.push("他搬大的，你搬小的。你们一起，把台子越堆越高。");
  t.push("石心给你讲了很多巨人族的故事——他们的文化，他们的信仰，他们的战斗。你第一次知道，巨人族不是传说中的怪物——他们是一个有感情、有文化、有尊严的种族。");
  t.push("三天后，纪念碑建好了。");
  t.push("那是一个五丈高的石台，上面刻着三千个名字——巨人族三千个战士的名字。石心用他的手指，一个一个刻上去的。刻到最后一个名字的时候，他哭了。");
  t.push("巨人的眼泪，像拳头那么大，砸在地上，砸出了小坑。");
  t.push("「谢谢你。」他说，「三千年了，终于有人——愿意帮我。」");
  t.push("他从脖子上摘下一个吊坠，递给你。吊坠是用石头做的，上面刻着巨人族的徽记。");
  t.push("「这是巨人族的信物。」他说，「拿着它，如果你遇到了危险——就喊我的名字。不管你在哪里，我都会来。」");
  t.push("你接过吊坠。它很沉，像是一个承诺，也像是——一段被遗忘的历史，终于有人记住了。");
  return t;
},options:[
  {t:"离开巨人谷",go:"extinct_overview",effect:{item:"巨人族信物",giant_bond:3,time:3}}
]}};

/* ===== NPC并行行动系统 ===== */
const NPC_PARALLEL = {
  mercury:{cn:"墨丘利",actions:["在学院教授灵魂魔法","在地下图书馆研究塞拉芬的资料","秘密跟守望者联络","在实验室做禁忌实验","在城市里暗查暗蚀会"],location:"艾尔达魔法学院"},
  aurelian:{cn:"奥雷利安",actions:["在守望者总部审阅情报","在大陆各地巡视七印状态","跟其他半神会面","回忆三千年的往事","训练新的守望者候选"],location:"守望者总部"},
  allen:{cn:"艾伦",actions:["在训练场练剑","在图书馆读军事书籍","跟同学切磋","给家里写信","在酒馆喝酒"],location:"艾尔达魔法学院"},
  rexa:{cn:"蕾克斯",actions:["在城里偷东西","在调查妹妹的下落","在黑市打探消息","在屋顶看月亮","在宿舍睡觉"],location:"交汇城"},
  cecilia:{cn:"塞西莉亚",actions:["在图书馆研究上古符文","在实验室做魔法实验","在花园里散步","在宿舍写日记","在教堂祈祷"],location:"艾尔达魔法学院"},
  marcus:{cn:"马库斯",actions:["在商店街做生意","在跟商会联络","在调查暗蚀会","在跟父亲通信","在数钱"],location:"交汇城"},
  elara:{cn:"艾拉拉",actions:["在花园跟树说话","在教堂祈祷","在图书馆读自然魔法","给精灵王国写信","在宿舍练魔法"],location:"艾尔达魔法学院"},
  thorin:{cn:"索林",actions:["在实验室锻造","在研究新合金","在图书馆读锻造书籍","在酒馆喝酒","在给家里写信"],location:"艾尔达魔法学院"},
  luna:{cn:"露娜",actions:["在医务室跟灵魂说话","在墨丘利的办公室上课","在宿舍发呆","在花园散步","在图书馆读灵魂魔法书籍"],location:"艾尔达魔法学院"},
  kai:{cn:"凯",actions:["在竞技场打沙袋","在宿舍发呆","在城里打工","在图书馆读兽人历史","在操场跑步"],location:"艾尔达魔法学院"},
  sophia:{cn:"索菲亚",actions:["在教堂祈祷","在图书馆读神学书籍","在跟父亲通信","在做慈善","在宿舍写日记"],location:"艾尔达魔法学院"},
  felix:{cn:"菲利克斯",actions:["在天台喝酒","在跟暗蚀会联络","在调查教会的秘密","在城里打探消息","在宿舍睡觉"],location:"艾尔达魔法学院"},
  aria:{cn:"艾莉亚",actions:["在食堂唱歌","在收集歌谣","在城里表演","在写歌","在宿舍练琴"],location:"艾尔达魔法学院"}
};

/* NPC并行行动结算节点 */
/* /v62inj:chunk-npc/ N["npc_parallel_hub"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_parallel_view"] 已移入 chunks/v62_npc.js */
/* ===== 因果链伏笔回收 ===== */
N["causality_hub"]=function(){return{place:"大陆",text:function(){
  var t=[];
  t.push("你做过的每一个选择，都会在未来的某一天，结出果实。");
  t.push("有些果实是甜的，有些是苦的。但不管是甜是苦——都是你自己种的。");
  t.push("你想看看，你之前种下的那些种子，现在怎么样了吗？");
  t.push("【因果账本】你翻开账本，一页一页看过去。那些种下的因、结出的果，在你眼前排成一条清晰的线。");t.push("");t.push("有些事，是你主动做的；有些，是命运推着走的。可无论哪一种，都在这本账上记着——谁帮过你，你欠了谁；谁伤过你，你记着谁。");t.push("");t.push("你合上账本。因果这东西，看不见摸不着，可它比任何锁链都结实。你知道，你走的每一步，都在给自己铺路——也给自己挖坑。");t.push("");arr.push("从大陆出来，路上行人渐稀。你脚步不停，一路向前。");
      return t;
},options:[
  {t:"查看你的选择带来的后果",go:"causality_review"},
  {t:"离开",go:"fc_jiaohui_entry"}
]}};

N["causality_review"]=function(){return{place:"大陆",text:function(){
  var t=[];
  t.push("你闭上眼睛，回忆你走过的路。");
  if(S.flags.medici_eclipse_proof){
    t.push("── 美第奇家族的秘密 ──");
    t.push("你在美第奇府邸的地下室里，听到了洛伦佐跟暗蚀会的对话。你把这个秘密告诉了议会的反对派。现在，议会正在秘密调查美第奇家族。");
    t.push("洛伦佐似乎察觉到了什么——他最近很少在公开场合露面。有人说，他在准备逃跑。也有人说，他在准备——鱼死网破。");
    t.push("你的那个选择，改变了自由城邦的政治格局。");
  }
  if(S.flags.rexa_vow){
    t.push("── 蕾克斯的誓言 ──");
    t.push("你答应过蕾克斯，要帮她找她的妹妹。她一直在等你——等你变强，等你毕业，等你跟她一起去查暗蚀会。");
    t.push("她最近给你写了一封信。信里只有一句话——「我等你。」");
  }
  if(S.flags.cecilia_secret){
    t.push("── 塞西莉亚的血脉 ──");
    t.push("塞西莉亚告诉了你她的秘密——黄林晶的后裔。她最近开始做那个梦了——七道光，其中一道在叫她的名字。");
    t.push("她很害怕。但她也说——因为有你在，她没那么害怕了。");
  }
  if(S.flags.elara_ally){
    t.push("── 艾拉拉的银叶 ──");
    t.push("艾拉拉给了你一片银叶树的叶子。她说，只要你拿着它，在任何一棵银叶树下呼唤她的名字，她都会听到。");
    t.push("你把叶子收在了行囊的最深处。它很轻，但你觉得——它比你想象的要重得多。");
  }
  if(S.flags.thorin_ally){
    t.push("── 索林的护身符 ──");
    t.push("索林把他父亲的护身符给了你。那是铁拳家的信物——一把锤子和一把钥匙交叉的图案。");
    t.push("他说，矮人说过的话，比铁还硬。他会帮你查他父亲的事——不管需要多久。");
  }
  if(S.flags.luna_accepted){
    t.push("── 露娜的眼泪 ──");
    t.push("你告诉露娜，她不是怪物。她哭了——那是她第一次在别人面前哭。");
    t.push("从那以后，她每天都会在医务室等你。她给你讲她看到的故事——老格雷的等待，走廊里的学者，操场上的小男孩。");
    t.push("你第一次觉得，死者并不可怕。他们只是——还没来得及离开的人。");
  }
  if(S.flags.kai_accepted){
    t.push("── 凯的兄弟 ──");
    t.push("你告诉凯，他不是怪物，他是凯。他跟你做了兄弟。");
    t.push("他最近在竞技场里，再也不一个人躲在角落了。他开始跟其他同学一起训练，一起吃饭，一起——笑。");
    t.push("有人说，凯变了。但你知道——他没有变。他只是——终于有人把他当人看了。");
  }
  if(S.flags.sophia_awakened){
    t.push("── 索菲亚的觉醒 ──");
    t.push("你告诉索菲亚，信仰不是别人给的，是自己找的。她开始重新思考她的信仰。");
    t.push("她最近在教堂里，不再念那些刻板的祷文了。她开始——自己写祷文。用她自己的话，跟她自己的光明神对话。");
    t.push("她的父亲——红衣主教，似乎察觉到了什么。他给她写了一封信，信里只有一句话——「不要走歪路。」");
  }
  if(S.flags.felix_ally){
    t.push("── 菲利克斯的同伙 ──");
    t.push("你答应帮菲利克斯报仇。他给了你一个暗蚀会的徽章。");
    t.push("他最近在暗蚀会里，地位越来越高了。但你知道——他在走钢丝。一步走错，就会万劫不复。");
    t.push("他给你写了一封信。信里只有一句话——「如果我回不来了，记得拉我一把。」");
  }
  if(S.flags.aria_fear){
    t.push("── 艾莉亚的记忆 ──");
    t.push("你告诉艾莉亚，你会帮她记着。她哭了——哭得像个孩子。");
    t.push("她最近唱歌的时候，开始用一个小本子记录——她怕自己忘了。她把每一首歌的故事，都写在本子上，然后——把本子交给你保管。");
    t.push("「你是我的记忆。」她说，「如果有一天我忘了自己——你要提醒我，我是谁。」");
  }
  if(S.flags.dragon_companion){
    t.push("── 小金 ──");
    t.push("你带着小金离开了龙脊山。它现在在你的肩膀上，像一只金色的大猫。");
    t.push("它每天都在长大——鳞片越来越亮，翅膀越来越有力。你知道，总有一天，它会变成一条真正的巨龙。");
    t.push("它每天都在问你——「我们什么时候去找妈妈？」");
  }
  if(S.flags.giant_helper){
    t.push("── 石心的纪念碑 ──");
    t.push("你帮石心建好了纪念碑。他给了你一个巨人族的信物。");
    t.push("你走的时候，他站在谷口，看着你离开。他没有说话，但你知道——他在说谢谢。");
    t.push("巨人族三千个战士的名字，终于被刻在了石头上。三千年后，终于有人——记住了他们。");
  }
  if(S.flags.seal5_fixed){
    t.push("── 第五印 ──");
    t.push("你修复了第五印。深渊之水，不会淹没大陆了。");
    t.push("但你也知道了真相——水族的灭族，跟黄林晶有关。那个已经消失的种族，是被黄林晶牺牲的。");
  }
  if(S.flags.seal6_sacrifice){
    t.push("── 第六印的真相 ──");
    t.push("你穿越了时光，看到了三千年前的真相——七印的本质，是牺牲九个半神。其中一个，不是自愿的。");
    t.push("黄林晶不是英雄。至少，不完全是。");
    t.push("你把这个真相藏在了心里。你知道——总有一天，它会改变一切。");
  }
  if(!S.flags.medici_eclipse_proof && !S.flags.rexa_vow && !S.flags.cecilia_secret && !S.flags.elara_ally && !S.flags.thorin_ally && !S.flags.luna_accepted && !S.flags.kai_accepted && !S.flags.sophia_awakened && !S.flags.felix_ally && !S.flags.aria_fear && !S.flags.dragon_companion && !S.flags.giant_helper && !S.flags.seal5_fixed && !S.flags.seal6_sacrifice){
    t.push("你还没有做出足够多的选择。你的故事——才刚刚开始。");
    t.push("继续往前走吧。你做的每一个选择，都会在未来的某一天，结出果实。");
  }
  t.push("");
  t.push("你睁开眼睛。太阳还在天上，风还在吹，世界还在转。");
  t.push("你的故事——还在继续。");
  arr.push("你与大陆作别，踏上旅途。尘土扑上靴面，像旧识。");
      return t;
},options:[
  {t:"继续",go:"fc_jiaohui_entry"}
]}};



/* ================================================================
   第一印 · 铁门关（已碎）— 四幕完整章节
   ================================================================ */

/* ---- 第一幕：线索追寻 ---- */
/* /v62inj:chunk-seal/ N["seal1_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_vet"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_vet_detail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_vet_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_vet_wound"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_soul_read"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_soul_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_archive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_letter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_hidden"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_archive_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_mercury"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_mercury_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_mercury_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_clue_gathered"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_supply"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act1_road_info"] 已移入 chunks/v62_seal.js */
/* ---- 第二幕：抵达与探索 ---- */
/* /v62inj:chunk-seal/ N["seal1_act2_journey"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_journey_road"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_journey_mountain"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_horse_panic"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_observe"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_track"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_combat_win"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_combat_lose"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_arrive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_runes"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_runes_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_runes_repair"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_notes"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_dungeon"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_painting"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_painting_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_cells"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_spotted"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_side_enter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_maintenance_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_loot"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_night"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_arrested"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_escape_combat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_captured"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act2_knight"] 已移入 chunks/v62_seal.js */
/* ---- 第三幕：真相与抉择 ---- */
/* /v62inj:chunk-seal/ N["seal1_act3_pit"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_madness"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_core_runes"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_disarm"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_core_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_attack"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_attack_more"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_attack_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_caught"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act3_choice"] 已移入 chunks/v62_seal.js */
/* ---- 第四幕：后果与余波 ---- */
/* /v62inj:chunk-seal/ N["seal1_act4_repair"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_destroy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_destroy_win"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_destroy_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_self_destruct"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_exploit"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_regret"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_retreat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_clue"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_emily_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_emily_scared"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_emily_listen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_vet_return"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal1_act4_mercury_return"] 已移入 chunks/v62_seal.js */
/* ---- 第一印过渡到第二印 ---- */
/* /v62inj:chunk-seal/ N["seal1_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第二印 · 兽人草原（松动）— 四幕完整章节
   ================================================================ */

/* ---- 第一幕：线索追寻 ---- */
/* /v62inj:chunk-seal/ N["seal2_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_tavern"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_tavern_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_merchant"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_khan_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_shaman_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_seal_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_ritual"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_guide"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_wanderers"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_wanderer_camp"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_wanderer_trap"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_stop_khan"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_repair_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act1_clue_gathered"] 已移入 chunks/v62_seal.js */
/* ---- 第二幕：抵达与探索 ---- */
/* /v62inj:chunk-seal/ N["seal2_act2_journey"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_spotted"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_fight_patrol"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_fight_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_track_patrol"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_arrive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_loot"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_observe_camp"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_infiltrate"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_climb"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_cave"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_old_shaman"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act2_summit"] 已移入 chunks/v62_seal.js */
/* ---- 第三幕：真相与抉择 ---- */
/* /v62inj:chunk-seal/ N["seal2_act3_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_awaken"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_why"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_skull_attack"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_skull_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_combat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_combat_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_ritual"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_ritual_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_khan_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_khan_alone"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_khan_choice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act3_other_way"] 已移入 chunks/v62_seal.js */
/* ---- 第四幕：后果与余波 ---- */
/* /v62inj:chunk-seal/ N["seal2_act4_repair"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_repair_no_sacrifice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_khan_sacrifice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_sacrifice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_partial"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_vessel_sacrifice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_grub"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal2_act4_grandma"] 已移入 chunks/v62_seal.js */
/* ---- 第二印过渡到第三印 ---- */
/* /v62inj:chunk-seal/ N["seal2_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第三印 · 精灵王国世界树根（傲慢）— 四幕完整章节
   ================================================================ */

/* ---- 第一幕：线索追寻 ---- */
/* /v62inj:chunk-seal/ N["seal3_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_guardian"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_guardian_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_letter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_mercury_past"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_sneak"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_captured"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_queen"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_huanglinjing"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_request"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_mercury_name"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_offer_help"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act1_clue_gathered"] 已移入 chunks/v62_seal.js */
/* ---- 第二幕：抵达与探索 ---- */
/* /v62inj:chunk-seal/ N["seal3_act2_root"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_mirror"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_mirror_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_resist"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_fall"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_recover"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act2_queen_kill"] 已移入 chunks/v62_seal.js */
/* ---- 第三幕：真相与抉择 ---- */
/* /v62inj:chunk-seal/ N["seal3_act3_repair"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_talk_pride"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_agreement"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act3_hlj_truth"] 已移入 chunks/v62_seal.js */
/* ---- 第四幕：后果与余波 ---- */
/* /v62inj:chunk-seal/ N["seal3_act4_repair_success"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_repair_fail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_together"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_queen_freed"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal3_act4_other_seals"] 已移入 chunks/v62_seal.js */
/* ---- 第三印过渡到第四印 ---- */
/* /v62inj:chunk-seal/ N["seal3_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第四印 · 矮人王国永恒熔炉心（贪婪）— 四幕完整章节
   ================================================================ */

/* ---- 第一幕：线索追寻 ---- */
/* /v62inj:chunk-seal/ N["seal4_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_enter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_merchant_info"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_tavern"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_old_miner"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_palace"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_audience"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_thorin_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_thorin_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_seal_location"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_repair_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act1_clue_gathered"] 已移入 chunks/v62_seal.js */
/* ---- 第二幕：抵达与探索 ---- */
/* /v62inj:chunk-seal/ N["seal4_act2_abyss"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_lakeside"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_tempted"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_dive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_dive_fail"] 已移入 chunks/v62_seal.js */
/* ---- 散财路线 ---- */
/* /v62inj:chunk-seal/ N["seal4_act2_scatter"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act2_scatter_plan"] 已移入 chunks/v62_seal.js */
/* ---- 第三幕：真相与抉择 ---- */
/* /v62inj:chunk-seal/ N["seal4_act3_heart_obtained"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act3_exploit"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act3_scatter_execution"] 已移入 chunks/v62_seal.js */
/* ---- 第四幕：后果与余波 ---- */
/* /v62inj:chunk-seal/ N["seal4_act4_seal_success"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_scatter_success"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_become_greedy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal4_act4_other_seals"] 已移入 chunks/v62_seal.js */
/* ---- 第四印过渡到第五印 ---- */
/* /v62inj:chunk-seal/ N["seal4_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第五印 · 南方深海（嫉妒）— 四幕完整章节
   ================================================================ */
/* /v62inj:chunk-seal/ N["seal5_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_sea_people"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act1_boat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act2_dive"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act2_meet"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_persuade"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act3_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act4_deal_made"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第六印 · 东部时光裂隙（懒惰）— 四幕完整章节
   ================================================================ */
/* /v62inj:chunk-seal/ N["seal6_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_academy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_xuanji"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act1_repair_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act2_rift"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act3_find_hlj"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act4_change_past"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act4_new_world"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_act4_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第七印 · 死亡沙漠深渊神殿（色欲）— 四幕完整章节
   ================================================================ */
/* /v62inj:chunk-seal/ N["seal7_act1_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act1_oasis"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act1_trapped"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act2_desert"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_temple"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_accept"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_why"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act3_final_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_final"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_coexist"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_ending"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_act4_ending_coexist"] 已移入 chunks/v62_seal.js */
/* ================================================================
   v20 方向一：旅行事件链式化（触发→判定→后果，三节点链）
   ================================================================ */

/* ---- 事件链：山崩落石 ---- */
/* /v62inj:chunk-evt/ N["evt_rockfall_trigger"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_rockfall_check"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_rockfall_hug"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_rockfall_fail"] 已移入 chunks/v62_evt.js */
/* ---- 事件链：暴雪封山 ---- */
/* /v62inj:chunk-evt/ N["evt_blizzard_trigger"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_blizzard_push"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_blizzard_lost"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_blizzard_camp"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_blizzard_cold"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_blizzard_return"] 已移入 chunks/v62_evt.js */
/* ---- 事件链：逃犯求助 ---- */
/* /v62inj:chunk-evt/ N["evt_fugitive_trigger"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_help"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_lie"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_misdirect"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_suspected"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_help_fail"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_refuse"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_capture"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_fugitive_escape"] 已移入 chunks/v62_evt.js */
/* ---- 事件链：神秘老者 ---- */
/* /v62inj:chunk-evt/ N["evt_elder_trigger"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_elder_listen"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_elder_more"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_elder_observe"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_elder_refuse"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_elder_leave"] 已移入 chunks/v62_evt.js */
/* ---- 事件链：古战场遗址 ---- */
/* /v62inj:chunk-evt/ N["evt_battlefield_trigger"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_battlefield_search"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_battlefield_voice"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_battlefield_curse"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_battlefield_avoid"] 已移入 chunks/v62_evt.js */
/* /v62inj:chunk-evt/ N["evt_battlefield_mourn"] 已移入 chunks/v62_evt.js */
/* ================================================================
   v20 方向六：过渡与余波节点（全局连贯性补全）
   ================================================================ */

/* ---- 通用过渡节点 ---- */
N["transition_three_days"]=function(){return{place:"旅途中",text:function(){
  var t=[];
  t.push("三天过去了。");
  t.push("这三天很平静。没有遇到强盗，没有遇到野兽，甚至连恶劣天气都没有。你每天日出而行，日落而息，在路边的客栈或者野外的篝火旁过夜。");
  t.push("你利用这段时间，整理了一下之前收集的线索和物品。有些事情，你需要好好想想。");
  if(S.flags.seal1_repaired) t.push("· 第一印已经修复，但铁门关的局势还不稳定。霍夫曼的女儿艾米丽还在圣城，她体内的饥饿碎片——是个隐患。");
  if(S.flags.seal2_repaired) t.push("· 第二印修复了。大汗铁木真——不管是死是活，草原上的局势正在慢慢恢复。");
  if(S.flags.seal3_repaired) t.push("· 第三印修复了。精灵女王自由了，但她和墨丘利之间的事——还没有了结。");
  if(S.flags.helped_fugitive) t.push("· 你救了一个逃犯，得到了一枚银鹰徽章。他说去自由城邦的银鹰酒馆会有人帮你。");
  if(S.flags.mysterious_elder) t.push("· 你遇到了一个神秘的老者，得到了一枚古币。他知道七印的真相——但他到底是谁？");
  t.push("");
  t.push("路还很长。你吸了口气，继续往前走。");
  return t;
},options:[
  {t:"继续前进",go:"travel_resolve",effect:{time:3,fatigue:-2,hp:5}},
  {t:"在最近的城镇停留一天",go:"travel_resolve",effect:{time:1,gold:-5,fatigue:-3,hp:10}}
]}};

N["transition_after_battle"]=function(){return{place:"战斗后",text:function(){
  var t=[];
  t.push("战斗结束了。");
  t.push("你站在原地，大口喘气。身上的伤口在疼，手里的武器在发抖——不是因为冷，是因为刚才的战斗太激烈了。");
  t.push("你低头看了看自己。衣服破了好几处，血浸透了绷带。但至少——你还活着。");
  t.push("你开始打扫战场。检查敌人的尸体，看有没有有用的东西。然后——处理自己的伤口。");
  t.push("这种事，经历多了就麻木了。但每一次，你都会在心里问自己：这样的日子，什么时候是个头？");
  t.push("没有答案。你只能——继续走。");
  arr.push("你与战斗后作别，踏上旅途。尘土扑上靴面，像旧识。");
      return t;
},options:[
  {t:"包扎伤口，继续前进",go:"travel_resolve",effect:{time:1,hp:-5,fatigue:2}},
  {t:"找个安全的地方休息一天",go:"travel_resolve",effect:{time:2,hp:15,fatigue:-3,gold:-5}}
]}};

N["transition_night_camp"]=function(){return{place:"野外营地",where:"夜晚",text:function(){
  var t=[];
  t.push("天黑了。");
  t.push("你在路边找了个背风的地方，生了堆火。火不大，但够暖和。你坐在火边，烤了点干粮，喝了口水。");
  t.push("夜很静。只有柴火噼啪的声音，和远处偶尔传来的虫鸣。");
  t.push("你抬头看天。星星很亮，密密麻麻地铺在天上。你想起了小时候——那时候你也喜欢看星星，觉得每一颗星星都是一个故事。");
  t.push("现在你知道了——有些星星，可能真的是故事。比如黄林晶，比如那些半神，比如——你正在经历的这一切。");
  t.push("你往火里添了根柴，然后躺下来，裹紧毯子。");
  t.push("明天，又是新的一天。");
  arr.push("野外营地已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return t;
},options:[
  {t:"睡觉，明天继续赶路",go:"travel_resolve",effect:{time:1,fatigue:-3,hp:8,san:3}},
  {t:"守夜，想想接下来的计划",go:"travel_resolve",effect:{time:1,fatigue:-1,san:5,xp:5}}
]}};

/* ---- 余波节点：第一印修复后 ---- */
N["aftermath_seal1"]=function(){return{tag:"branch",place:"交汇城",text:function(){
  var t=[];
  t.push("铁门关的事，在交汇城传开了。");
  t.push("有人说你是英雄，独自深入铁门关，修复了第一道印。有人说你是疯子，居然敢靠近那种地方。还有人说——你是教会的人，或者守望者的人。");
  t.push("你走在街上，能感受到别人的视线。有好奇的，有敬畏的，也有——警惕的。");
  t.push("你在酒馆里听到了一些消息：");
  t.push("· 教会已经派人去铁门关调查了。他们对『修复封印』这件事，态度很微妙——既不承认，也不否认。");
  t.push("· 北方公国在铁门关增兵了。他们担心封印修复后，兽人会再次南下。");
  t.push("· 艾米丽——霍夫曼的女儿——被送到了圣城的圣光神学院。据说她体内的饥饿碎片，正在被教会研究。");
  t.push("这些消息，不知道是真是假。但你知道——你的行动，已经开始影响这个世界了。");
  return t;
},options:[
  {t:"去酒馆打听更多消息",go:"fc_jiaohui_entry",effect:{time:1,flag:"seal1_aftermath"}},
  {t:"低调行事，准备下一段旅程",go:"fc_jiaohui_entry",effect:{time:1,flag:"seal1_aftermath"}}
]}};

/* ---- 余波节点：第二印修复后 ---- */
N["aftermath_seal2"]=function(){return{tag:"branch",place:"兽人草原边缘",text:function(){
  var t=[];
  t.push("草原上的风，变了。");
  t.push("不再是灼热的、带着杀意的风，而是——清凉的、带着草香的风。愤怒消退了，草原上的兽人开始恢复理智。");
  t.push("你听说了一些消息：");
  if(S.flags.seal2_khan_dead) {
    t.push("· 大汗铁木真死了。他的死讯传开后，草原上出现了权力真空。各个部落开始争夺大汗的位置，小规模的冲突不断。");
    t.push("· 但没有大规模的战争——愤怒消退之后，兽人们也不想打了。他们更想——回家。");
  }
  if(S.flags.seal2_khan_alive || S.flags.seal2_khan_guardian) {
    t.push("· 大汗铁木真还活着。他解散了军队，向被他伤害过的部落道歉，然后回到圣山，继续守护第二印。");
    t.push("· 草原上的兽人们对他的态度很复杂——有人恨他，有人原谅他，有人——尊敬他的赎罪。");
  }
  t.push("· 白发婆婆的流浪者部落走出了草原深处。他们开始和其他部落接触，试图建立新的秩序。");
  t.push("· 铜须——那个带你进入深渊矿层的老矿工——回到了铁峰堡。他把你的故事告诉了每一个愿意听的人。");
  t.push("草原正在慢慢恢复。但伤口还在，需要时间来愈合。");
  return t;
},options:[
  {t:"继续你的旅程",go:"fc_jiaohui_entry",effect:{time:1,flag:"seal2_aftermath"}},
  {t:"在草原多待几天，看看情况",go:"fc_jiaohui_entry",effect:{time:3,flag:"seal2_aftermath",karma:2}}
]}};

/* ---- 余波节点：第三印修复后 ---- */
N["aftermath_seal3"]=function(){return{tag:"branch",place:"精灵王国边境",text:function(){
  var t=[];
  t.push("精灵王国变了。");
  t.push("世界树不再散发那种压抑的、傲慢的气息。森林里的树开始唱歌——欢快的歌。精灵们的脸上，有了笑容。");
  if(S.flags.seal3_queen_freed) {
    t.push("· 女王艾萨拉自由了。她不再是半神，不再是第三印的锚点。她变成了一个普通的精灵——虽然依然强大，但寿命只有几百年了。");
    t.push("· 她宣布退位，将王位传给了长老会推选的新王。然后——她离开了精灵王国。没有人知道她去了哪里。");
    t.push("· 有人说她去了交汇城，去找一个人。一个叫墨丘利的人。");
  }
  if(S.flags.seal3_pride_ally) {
    t.push("· 你吸收了傲慢——不是被吞噬，是达成了协议。傲慢成为了你的动力，你成为了它的方向。");
    t.push("· 你能感受到它的存在。在你想要放弃的时候，它会推你一把。在你骄傲自满的时候，它会——提醒你。");
  }
  t.push("· 精灵长老会开始重新评估和人类的关系。三千年的傲慢，在女王自由之后，开始松动了。");
  t.push("· 银叶学院宣布，将招收更多的人类学生。这在以前——是不可想象的。");
  t.push("精灵王国正在打开国门。慢慢地，但确实在打开。");
  arr.push("离开精灵王国边境时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return t;
},options:[
  {t:"继续你的旅程",go:"fc_jiaohui_entry",effect:{time:1,flag:"seal3_aftermath"}},
  {t:"在精灵王国多待几天",go:"fc_jiaohui_entry",effect:{time:3,flag:"seal3_aftermath",elf_rep:5}}
]}};

/* ---- 旅行结算节点（通用） ---- */
N["travel_resolve"]=function(){return{place:"旅途中",text:function(){
  var t=[];
  t.push("你继续赶路。");
  t.push("经过刚才的事，你对这段路有了更深的认识。旅行不只是从A点到B点——路上遇到的每一个人、每一件事，都在改变你。");
  t.push("你看了看前方的路。还很长。但你已经准备好了。");
  return t;
},options:[
  {t:"继续前进",go:"fc_jiaohui_entry",effect:{time:1}},
  {t:"查看地图，确认方向",go:"fc_jiaohui_entry",effect:{time:1}}
]}};



/* ================================================================
   第五印 · 南方深海（嫉妒）— 扩充完整版
   入口：seal5_exp_intro（从seal4_transition进入）
   ================================================================ */

/* ---- 第一幕：线索追寻 ---- */
/* /v62inj:chunk-seal/ N["seal5_exp_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_tavern_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_tavern_none"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_location"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_find_boat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_old_haiguai_story"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_sail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_dive"] 已移入 chunks/v62_seal.js */
/* ---- 第二幕：抵达与探索 ---- */
/* /v62inj:chunk-seal/ N["seal5_exp_meet"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_captured"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_xiaolan_story"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_persuade"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_deal"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_warn"] 已移入 chunks/v62_seal.js */
/* ---- 第三幕：真相与抉择 ---- */
/* /v62inj:chunk-seal/ N["seal5_exp_deal_made"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_combat"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_mercy"] 已移入 chunks/v62_seal.js */
/* ---- 第四幕：后果与余波 ---- */
/* /v62inj:chunk-seal/ N["seal5_exp_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal5_exp_other_seals"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第六印 · 东部时光裂隙（懒惰）— 扩充完整版
   ================================================================ */
/* /v62inj:chunk-seal/ N["seal6_exp_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_academy"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_xuanji_detail"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_repair_method"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_rift"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_find_hlj"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_change_past"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_new_world"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_aftermath"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal6_exp_transition"] 已移入 chunks/v62_seal.js */
/* ================================================================
   第七印 · 死亡沙漠（色欲）— 扩充完整版
   ================================================================ */
/* /v62inj:chunk-seal/ N["seal7_exp_intro"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_oasis"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_trapped"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_desert"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_temple"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_refuse"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_accept"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_talk"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_why"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_final"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_coexist"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_ending"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal7_exp_ending_coexist"] 已移入 chunks/v62_seal.js */
/* ================================================================
   城市一：交汇城（自由城邦）— 深度剧情
   ================================================================ */

/* /v62inj:chunk-city/ N["city_jiaohui_entry"] 已移入 chunks/v62_city.js */
/* ---- 交汇城 · 银鹰酒馆 ---- */
;

/* /v62inj:chunk-city/ N["city_jiaohui_tavern_rumor"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_eclipse_hint"] 已移入 chunks/v62_city.js */
/* ---- 交汇城 · 集市 ---- */
/* /v62inj:chunk-city/ N["city_jiaohui_market"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_herb"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_herb_secret"] 已移入 chunks/v62_city.js */
/* ---- 交汇城 · 议会大厦 ---- */
;

/* /v62inj:chunk-city/ N["city_jiaohui_speech"] 已移入 chunks/v62_city.js */
/* ---- 交汇城 · 墨丘利研究室 ---- */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_jiaohui_mercury_watcher"] 已移入 chunks/v62_city.js */
/* ================================================================
   城市二：圣城（光明教会）— 深度剧情
   ================================================================ */

/* /v62inj:chunk-city/ N["city_holy_entry"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_cathedral"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_confession"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_holy_inquisition"] 已移入 chunks/v62_city.js */
/* ================================================================
   城市三：铁峰堡（矮人王国）— 深度剧情
   ================================================================ */

/* /v62inj:chunk-city/ N["city_ironpeak_entry"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_forge"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_tavern"] 已移入 chunks/v62_city.js */
/* /v62inj:chunk-city/ N["city_ironpeak_lonely"] 已移入 chunks/v62_city.js */
/* ================================================================
   方向四：多分支树 — 暗蚀会分支树（忠诚vs卧底）
   ================================================================ */

N["eclipse_branch_intro"]=function(){return{tag:"branch",place:"暗蚀会 · 交汇城分部",text:function(){
  var t=[];
  t.push("你找到了暗蚀会的分部。");
  t.push("在旧城区的『黑猫杂货铺』后面，有一个地下室。地下室的门是用魔法封印的——但你用了从老灰那里得到的方法，打开了它。");
  t.push("地下室里，有十几个人。他们穿着黑色的长袍，脸上戴着面具。看到你，他们都转过头来。");
  t.push("一个看起来是头目的人走过来。「你是谁？怎么找到这里的？」");
  t.push("「我想加入。」你说。");
  t.push("他上下打量了你一番。「加入暗蚀会？你知道我们是干什么的吗？」");
  t.push("「知道。」你说，「你们想——让深渊降临。」");
  t.push("他笑了。「有意思。」他说，「但加入不是嘴上说说的。你需要——证明自己。」");
  arr.push("交汇城分部在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return t;
},options:[
  {t:"接受考验——真正加入暗蚀会",go:"eclipse_branch_test",effect:{time:1,flag:"eclipse_joined"}},
  {t:"假装加入——为守望者当卧底",go:"eclipse_branch_infiltrate",effect:{time:1,flag:"eclipse_infiltrator"}},
  {t:" reconsider — 离开",go:"city_jiaohui_entry",effect:{time:1}}
]}};

N["eclipse_branch_test"]=function(){return{tag:"branch",place:"暗蚀会分部",text:function(){
  var t=[];
  t.push("「好。」头目说，「第一个考验——去杀一个人。」");
  t.push("他递给你一张纸条。上面写着一个名字和地址。「这个人是教会的线人。他在调查我们。杀了他，就是投名状。」");
  t.push("你接过纸条。名字是——托马斯。一个普通的名字。地址在交汇城的平民区。");
  t.push("「你有三天时间。」头目说，「三天后，带着他的手指回来。」");
  t.push("你走出了地下室。手里攥着那张纸条。");
  t.push("杀人。你杀过人——在战斗中，在自卫中。但——暗杀一个手无寸铁的人？");
  t.push("这是一个选择。真正的选择。");
  return t;
},options:[
  {t:"去杀了他——完成投名状",check:{a:"AGI",sk:"stealth",label:"潜行"},go:"eclipse_branch_kill",fail:"eclipse_branch_kill_fail"},
  {t:"去警告他——让他逃走",go:"eclipse_branch_warn",effect:{time:1,karma:5,flag:"eclipse_test_warned"}},
  {t:"去找守望者——告诉他们暗蚀会的位置",go:"eclipse_branch_report",effect:{time:1,karma:3,flag:"eclipse_reported"}}
]}};

N["eclipse_branch_kill"]=function(){return{tag:"branch",place:"平民区",text:function(){
  var t=[];
  t.push("你找到了托马斯的家。");
  t.push("一间小房子，在平民区的角落里。你从窗户看进去——一个中年男人，正在和他的女儿吃饭。小女孩大约七八岁，笑得很开心。");
  t.push("你握紧了武器。然后——你犹豫了。");
  t.push("杀了他。他的女儿怎么办？她会变成孤儿。就像——你可能曾经是一样。");
  t.push("但如果你不杀他，暗蚀会不会信任你。你就无法——进入他们的核心。");
  t.push("这是一个艰难的选择。");
  arr.push("出了平民区，风迎面扑来。你认了认方向，启程。");
      return t;
},options:[
  {t:"还是杀了他——为了更大的目标",go:"eclipse_branch_kill_done",effect:{time:1,karma:-10,sanLoss:15,flag:"eclipse_killed_thomas"}},
  {t:"不杀——离开，另想办法",go:"eclipse_branch_alternative",effect:{time:1,karma:2,sanLoss:5}}
]}};

N["eclipse_branch_kill_done"]=function(){return{tag:"branch",place:"暗蚀会分部",text:function(){
  var t=[];
  t.push("你回到了暗蚀会分部，带着——证据。");
  t.push("头目看了看，点了点头。「很好。」他说，「从今天起，你就是暗蚀会的——外围成员。」");
  t.push("他给了你一件黑色长袍和一个面具。「穿上它。从今天起，你不再是你自己。你是——暗蚀会的一员。」");
  t.push("你穿上了长袍。面具戴上的那一刻，你感到——一种奇怪的感觉。像是——你真的变成了另一个人。");
  t.push("「接下来，」头目说，「你需要完成更多的任务。每完成一个，你的等级就会提升。外围→成员→骨干→核心→五司长→教主候选。」");
  t.push("「好好干。」他拍了拍你的肩膀，「暗蚀会——会给你想要的一切。」");
  return t;
},options:[
  {t:"接受第一个正式任务",go:"eclipse_branch_mission1",effect:{time:1,flag:"eclipse_rank_peripheral"}},
  {t:"问他更多关于暗蚀会的事",go:"eclipse_branch_info",effect:{time:1,flag:"eclipse_rank_peripheral"}}
]}};

N["eclipse_branch_infiltrate"]=function(){return{tag:"branch",place:"暗蚀会分部",text:function(){
  var t=[];
  t.push("你决定——卧底。");
  t.push("表面上，你接受了暗蚀会的考验。但实际上——你是在为守望者收集情报。");
  t.push("你需要先联系守望者。墨丘利知道怎么联系他们。或者——你可以直接去地下图书馆。");
  t.push("但首先，你需要通过暗蚀会的考验。杀了托马斯——或者，想办法让他『消失』，而不是真的死。");
  t.push("这是一条危险的路。双面间谍。一旦暴露——暗蚀会不会放过你，守望者也未必能救你。");
  t.push("但——如果成功了，你就能从内部瓦解暗蚀会。");
  arr.push("暗蚀会分部的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return t;
},options:[
  {t:"先联系守望者",go:"city_jiaohui_mercury",effect:{time:1,flag:"eclipse_infiltrator"}},
  {t:"先通过考验——用假死的方法",go:"eclipse_branch_fake_death",effect:{time:1,flag:"eclipse_infiltrator"}},
  {t:" reconsider — 这条路太危险了",go:"city_jiaohui_entry",effect:{time:1}}
]}};

/* ================================================================
   方向五：选项后果展开 — 通用后果节点
   ================================================================ */

N["consequence_generic_success"]=function(){return{place:"",text:function(){
  var t=[];
  t.push("你成功了。");
  t.push("不是侥幸的成功——是你用实力、用智慧、用意志，换来的成功。");
  t.push("你吸了口气，感受着胜利的滋味。但你也知道——这只是开始。更大的挑战，还在后面。");
  t.push("你整理了一下装备，继续前进。");
  return t;
},options:[
  {t:"继续",go:"fc_jiaohui_entry",effect:{time:1}}
]}};

N["consequence_generic_fail"]=function(){return{place:"",text:function(){
  var t=[];
  t.push("你失败了。");
  t.push("不是因为你不够努力——而是因为，有些事，不是努力就能成功的。");
  t.push("你坐在地上，喘着粗气。身上的伤口在疼，心里的挫败感更疼。");
  t.push("但——失败不是终点。是教训。你从这次失败中学到了什么？");
  t.push("你站起来，拍了拍身上的灰。下次——你会做得更好。");
  t.push("你站在原地，把刚才发生的事，在脑子里，过了一遍。你找到那个，出错的环节。");t.push("你没有找借口。你把错，认下了。你发现，认错，比你想的，容易一些。");t.push("你抬起头，看了看前方的路。路还在。你拍了拍衣摆，把散乱的心，收拢起来。");t.push("你往前走了一步。这一步，和刚才那一步，一样大。但你心里知道——这一步，不一样了。");return t;
} /*v45inj:consequence_generic_fail*/,options:[
  {t:"总结教训，继续前进",go:"fc_jiaohui_entry",effect:{time:1,hp:-10,sanLoss:5}},
  {t:"找个地方休息一下",go:"fc_jiaohui_entry",effect:{time:2,hp:5,gold:-5}}
]}};

N["consequence_generic_critfail"]=function(){return{place:"",text:function(){
  var t=[];
  t.push("大失败。");
  t.push("你犯了一个——致命的错误。不是判断失误，不是运气不好——是你，在最关键的时刻，搞砸了。");
  t.push("后果很严重。你失去了一些东西——可能是物品，可能是金钱，可能是——信任。");
  t.push("但——你还活着。只要还活着，就有机会。");
  t.push("你需要——补救。找到弥补的方法。这条路，虽然难，但不是——走不通。");
  t.push("事情，以最坏的方式，收场了。你站在那里，看着眼前的局面，一时，说不出话。");t.push("你吸了口气。你没有怪别人。你一件一件地，收拾残局。你收拾得很慢，但手，没有抖。");t.push("收拾完，你坐了下来。你把自己犯的错，一条一条，写在纸上。你写得很仔细，像给另一个人，留一张地图。");t.push("你把纸折好，收进怀里。你没有丢掉它。你知道，这张纸，比你丢掉的任何东西，都值钱。");return t;
} /*v45inj:consequence_generic_critfail*/,options:[
  {t:"寻找补救的方法",go:"fc_jiaohui_entry",effect:{time:1,hp:-20,sanLoss:10,gold:-20}},
  {t:"先疗伤，再做打算",go:"fc_jiaohui_entry",effect:{time:3,hp:10,gold:-10}}
]}};


