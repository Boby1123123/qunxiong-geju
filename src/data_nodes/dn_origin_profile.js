/* ============================================================
   A-1 个性化开局系统（五维搭配专属剧情）
   - ORIGIN_PROFILE：五维映射文本库（homeland 身份 / job 见闻 / ideal 第一反应 / hobby 细节 / talent 天资评语 / subrace 血脉注脚）
   - IDEAL_GOALS：8 条理想目标线元数据（里程碑节点在 dn_ideal_goals.js）
   - window.v91_originBuild(S)：由注入钩子调用，按当前五维组装 3 段开场注入文本
   纯数据 + 只读函数；不触碰判定公式 / writeNext 核心语义 / choose / 存档语义
   saveVersion=48 不变；S.flags.origin_profile_done 为独立键
   ============================================================ */
window.ORIGIN_PROFILE = (function(){
  const identity = {
    /* 身份补白：按 homeland（故乡）——序章节点已自带 HOMELANDS.start，这里只补"你是谁"的骨相 */
    free: [
      "商路的十字路口养出来的孩子，见人三分笑，笑里藏着自己的账本。",
      "你记事起就认得三样东西：码头汽笛、银币的响声、还有讨价还价时对方眼里的那一点松动。"
    ],
    north: [
      "北境的雪教会你两件事：话要少说，路要踩实。",
      "铁门关的战火在你小时候烧过一回，你记得烟是怎么爬过山梁的。"
    ],
    south: [
      "南境的账本比摇篮曲更早进你的耳朵，你五岁就能听出秤杆上的门道。",
      "你在商船甲板上长大，海风里混着香料与铁器的气味，那是你最早的地图。"
    ],
    church: [
      "圣城的钟声敲了二十年，你听得懂每一声钟响之间的安静——那安静里藏着别的东西。",
      "你从小在圣徽的阴影下走路，白袍的边角、烛火的烟、还有祷告词里没说出口的那半句。"
    ],
    elf: [
      "半精灵的耳朵比人类尖，比精灵钝。你从小就在两边的视线夹缝里找自己的位置。",
      "迷雾森林的叶影落进你的梦里，醒来时你分不清那是乡愁，还是别的什么。"
    ],
    dwarf: [
      "山腹的锤声是你最早的语言，你认得铁的脾气比认得人的脾气早。",
      "矮人的炉火烤大了你的骨架子，你走路的步子沉，像带着一座山的底子。"
    ],
    orc: [
      "草原的风向你报信，战前的血味你隔着三里地就能闻见。",
      "兽人的血在你血管里烧，烧得比火旺，也比火难熄。"
    ],
    east: [
      "帝京的墨香在你指缝里留了多年，你背过圣贤书，也见过墨字底下的刀。",
      "东境的科举路你走了一半，另一半留给了更远的风沙。"
    ],
    desert: [
      "沙漠教会你水的分量，还有活人的话有多不可信。",
      "你舔过干裂的嘴唇长大，肺里记着那种又烫又渴的活法，一辈子忘不掉。"
    ]
  };
  const job_sight = {
    /* 见闻：按主修职业——初入世时，同一座城在你眼里是不同的 */
    魔法师: [
      "你第一眼看的不是街市，是屋顶与屋顶之间魔网的纹路——这座城的法术脉络，比它的街道更旧。",
      "你数得出城墙上附魔刻痕的年代，却数不清自己身上还剩几枚铜星。法师的路，从来是用卷轴铺出来的。"
    ],
    战士: [
      "你掂了掂背上的家伙，心里给这条街标好了退路——哪里能守，哪里能撤，这是刀口上练出来的眼睛。",
      "城门卫兵的枪尖在你面前晃过，你下意识就数出了他的破绽，随即又把这念头按了下去。"
    ],
    灵魂法师: [
      "街上来往的人在你眼里都有颜色：那个商人的魂光发灰，像压着什么事；乞丐的反而干净。你垂下眼，不去看太多。",
      "你闻得见这座城的心事——酒馆里的醉话、码头的旧怨、教堂尖顶下压着的恐惧。看多了，人容易累。"
    ],
    牧师: [
      "你摸到胸前圣徽的边角，心里默念了一句祷词。这座城的伤，比圣城的钟声还要多。",
      "有人在你面前跛着脚走过，你几乎是本能地想要伸手——又想起戒律里那句：不可轻易显露神迹。"
    ],
    盗贼: [
      "你扫了一眼人群，已经数出三个肥羊、两个同行、一个巡夜的暗桩。这是手艺，不是恶意。",
      "屋檐的影子比街道更让你安心，你走路时下意识贴着墙根，脚步比风声还轻。"
    ],
    商人: [
      "你一眼就看出码头那批货的成色，心里盘算着差价——这一路的风尘，都该折算成金币的声响。",
      "街上每张脸在你眼里都标着价：谁能打交道，谁是冤大头，谁背后有硬靠山。商人的眼睛，是天平做的。"
    ],
    术士: [
      "你摸了摸怀里那件半成品，指腹能感觉到符文里流动的暖意。这座城的炉火，没你家乡的旺。",
      "铁匠铺的风箱声让你耳朵一动——你听得出来，那炉温差了三分，打的铁不够韧。手艺人的耳朵，闲不住。"
    ],
    骑士: [
      "你把背上的剑正了正。这座城的乱象让你握紧了拳——有些东西，总得有人挡在前面。",
      "你记得誓约里的每一个字。街角那对被推搡的母子，让你的脚步停了一瞬。"
    ],
    游侠: [
      "你嗅得出风里的方向——灰港的潮气、北边的松脂味、还有远处山脊上若有若无的兽痕。",
      "你习惯先看树和屋顶，再看人。这座城的活物太多，反而让你觉得挤。"
    ]
  };
  const ideal_reaction = {
    /* 第一反应：按理想——同一幕景象，不同的心 */
    wealth: [
      "你看着满街的金币声响，心里盘算的是另一件事：总有一天，这条街的价码由我来定。",
      "穷过的人认得钱的气味。你闻得出来，这座城的富贵是浮的，站不稳——那正是你的机会。"
    ],
    might: [
      "你记下了这条街的名字。你告诉自己：总有一天，这个名字会因为你的拳头而发抖。",
      "强者的路从脚下开始。你捏了捏指节，把第一块砖踩实了。"
    ],
    guard: [
      "你看见码头上被推倒的老汉，下意识伸手扶了一把。路还长，能扶一个是一个。",
      "这世道吃人，总得有人挡在前面。你摸了摸怀里的干粮，分了半个给路边的孩子。"
    ],
    truth: [
      "这座城藏着太多没说出口的事。你天生对『答案』二字过敏——不知道的事，非要弄明白不可。",
      "你注意到钟楼墙根有块砖颜色不对，像是被人挪动过。你记住了，迟早要去看一眼。"
    ],
    free: [
      "风往哪儿吹，你就往哪儿走。这座城留不住你，就像云留不住雁。",
      "你看了看城门的方向，心里盘算着哪条路能最快出城——不是逃，是走。"
    ],
    god: [
      "你抬头看了看教堂尖顶，又看了看天上的云。你觉得，那上面该有你的位置。",
      "凡人的城再热闹，也装不下你的野心。你把这念头收进心底，像收一把还没开刃的刀。"
    ],
    fame: [
      "你走过城门时想：百年之后，这里的人会怎么讲我的故事？",
      "你把自己的名字在心里默念了一遍，像刻一块碑——故事，要从今天开始写。"
    ],
    revenge: [
      "你摸了摸身上的旧伤疤，那道疤还疼。欠你的，你记着，一个都不会漏。",
      "你认得那种眼神——当年毁了你家的人，眼睛里也带着它。你把它存进心里，等一个合适的时辰。"
    ]
  };
  const hobby_note = {
    /* 爱好细节：嵌入见闻的底色 */
    read: "路过旧书摊时，你停下翻了两页，直到摊主咳嗽才放下。",
    hunt: "你注意到墙角那只野猫的步子——它踩过的地方，和你老家猎物走过的痕迹一个样。",
    forge: "铁匠铺的炉火让你脚步慢了半拍，你隔着门闻了闻那铁水的味道。",
    herb: "你顺手在墙根掐了一片草叶，捻了捻，认得是止血的货色。",
    chess: "茶摊上有人下棋，你站着看了三步，心里已经替他走出了后手。",
    gamble: "酒馆里骰子响了一声，你的耳朵竖了起来——这声音，比乡音还熟。",
    music: "有人在巷口哼一支小调，你跟着在心底打了两拍，随即摇头：调子起高了。",
    cook: "你闻出这家馆子汤底放了几味料——少了一味，差一口气。",
    climb: "你抬头看了看城墙上那道裂缝，心里盘算着：手脚并用，约莫能上去。",
    fish: "码头的潮声让你想起蹲在河边等浮子的下午——你耐得住，一直如此。"
  };
  const talent_judge = {
    /* 天资评语 */
    mortal: "你知道自己天资平平。可你也知道，这条路上一刀一斧挣来的东西，谁都夺不走。",
    good: "你资质中上，够用，够拼。你把这点自知收好，不张扬，也不自卑。",
    gen: "你学什么都快，快得有些东西在你眼里反而显得慢。这份快，是把双刃剑。",
    prod: "你天赋异禀，百年一遇——也因此，你知道有些眼睛正隔着人群看你。"
  };
  const subrace_note = {
    /* 血脉注脚：按亚种种族族系 */
    human: "你身上流着人类的血——短命，也短见，却总能在绝处烧出火来。",
    half: "混血的路从来不好走。你比两边都懂，也比两边都硬。",
    elf: "精灵的血脉让你比旁人活得久，也让你比旁人看得远、记得多。",
    dwarf: "矮人的血脉给你一副铁打的筋骨，和一双认得火候的眼睛。",
    orc: "兽人的血在你血管里烧，烧得比火旺，也比火难熄。",
    halfling: "半身人的血脉给你一副好运气，和一张不惹人防的厚道脸。",
    dragon: "龙裔的血脉在你体内沉睡，鳞甲之下，藏着一口未燃的火。"
  };
  /* 30 亚种 → 族系映射（给注入钩子用） */
  const subrace_to_family = {
    nordic:"human", midland:"human", southland:"human", eastland:"human", westland:"human", plateau:"human", islander:"human",
    halfelf:"half", halforc:"half", halfdwarf:"half",
    highelf:"elf", woodelf:"elf", darkelf:"elf", seaelff:"elf", valelf:"elf",
    hilldwarf:"dwarf", vulcdwarf:"dwarf", valdwarf:"dwarf", grayelf:"dwarf", seadwarf:"dwarf",
    plainorc:"orc", mountorc:"orc", shadoworc:"orc", swamporc:"orc",
    hobfarm:"halfling", hobnomad:"halfling", hobcity:"halfling",
    reddra:"dragon", bluedra:"dragon", golddra:"dragon"
  };
  function pick(arr, n){ if(!arr||!arr.length) return ""; return arr[Math.abs(n||0)%arr.length]; }
  function build(S){
    try{
      if(!S) return [];
      const out=[];
      /* 段1：血脉注脚（subrace 族系 → 兜底 homeland 身份） */
      let f1 = "";
      if(S.subrace && subrace_to_family[S.subrace] && subrace_note[subrace_to_family[S.subrace]]) f1 = subrace_note[subrace_to_family[S.subrace]];
      if(!f1 && S.homeland && identity[S.homeland]) f1 = pick(identity[S.homeland], S.day||0);
      if(f1) out.push(f1);
      /* 段2：职业见闻 + 爱好细节 */
      let f2 = "";
      if(S.job && job_sight[S.job]) f2 = pick(job_sight[S.job], (S.day||0)+1);
      if(S.hobby && hobby_note[S.hobby]) f2 = f2 ? f2 + " " + hobby_note[S.hobby] : hobby_note[S.hobby];
      if(f2) out.push(f2);
      /* 段3：理想第一反应 + 天资评语 */
      let f3 = "";
      if(S.ideal && ideal_reaction[S.ideal]) f3 = pick(ideal_reaction[S.ideal], (S.day||0)+2);
      if(S.talent && talent_judge[S.talent]) f3 = f3 ? f3 + " " + talent_judge[S.talent] : talent_judge[S.talent];
      if(f3) out.push(f3);
      return out.length?out:[];
    }catch(e){ return []; }
  }
  return { identity, job_sight, ideal_reaction, hobby_note, talent_judge, subrace_note, subrace_to_family, _build: build };
})();

/* ===== A-1 八条理想目标线元数据（里程碑节点见 dn_ideal_goals.js） ===== */
window.IDEAL_GOALS = {
  wealth:  { cn:"富甲天下", intro:"goal_intro_wealth",  steps:["goal_wealth_1","goal_wealth_2","goal_wealth_3"] },
  might:   { cn:"威震四海", intro:"goal_intro_might",   steps:["goal_might_1","goal_might_2","goal_might_3"] },
  guard:   { cn:"守护苍生", intro:"goal_intro_guard",   steps:["goal_guard_1","goal_guard_2","goal_guard_3"] },
  truth:   { cn:"探寻真相", intro:"goal_intro_truth",   steps:["goal_truth_1","goal_truth_2","goal_truth_3"] },
  free:    { cn:"自由自在", intro:"goal_intro_free",    steps:["goal_free_1","goal_free_2","goal_free_3"] },
  god:     { cn:"登临神座", intro:"goal_intro_god",     steps:["goal_god_1","goal_god_2","goal_god_3"] },
  fame:    { cn:"名留青史", intro:"goal_intro_fame",    steps:["goal_fame_1","goal_fame_2","goal_fame_3"] },
  revenge: { cn:"以血还血", intro:"goal_intro_revenge", steps:["goal_revenge_1","goal_revenge_2","goal_revenge_3"] }
};
