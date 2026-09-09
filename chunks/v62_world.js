/* /v62inj:chunk-world/ 世界局势(v64)分片（自动生成，勿手改） */
(function(){
  var nodes = {};
  nodes["w64_election_node"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var pol=(ws.politics&&ws.politics.papacy)||{};
  var arr=[];
  arr.push("使徒宫的侧门开着。枢机们刚从晨祷出来，袍角还带着香灰。");
  if(pol.electedCn){
    arr.push("教皇的位子有了主。新任教皇是「"+pol.electedCn+"」，他主张"+(pol.electedStance||"平和")+"。");
    arr.push("走廊里的人在议论：教廷的风向，要变了。");
    if(pol.elected==='cand_strict'){ arr.push("对魔法师和异端来说，这不是个好消息。"); }
    else { arr.push("有人松了口气，也有人皱起眉——太软了，软得不像教廷。"); }
    return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
      { t:"记下这个风向", go:"w64_election_leave" },
      { t:"离开使徒宫", go:"w64_war_return" }
    ]};
  }
  if(!pol.candidates||!pol.candidates.length){
    arr.push("选举还没开始。枢机团在等一个时机。");
    return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[{t:"离开",go:"w64_war_return"}]};
  }
  arr.push("两位候选人的名字，被写在同一块告示板上：");
  arr.push("「枢机·克莱门特」——严守教条。他主张深渊零容忍，魔法典籍统统封禁。");
  arr.push("「枢机·奥黛拉」——开明宽恕。她主张魔法可以教，深渊可以审，不必一棍子打死。");
  arr.push("一个老枢机经过你身边，压低声音：「外乡人，你站哪边？」");
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"为克莱门特助选", go:"w64_election_act_strict" },
    { t:"为奥黛拉助选", go:"w64_election_act_open" },
    { t:"立下目标：影响教廷选举", go:"w64_election_goal" },
    { t:"先观望，退出去", go:"w64_election_leave" }
  ]};
};

  nodes["w64_election_act_strict"] = function(){
  var arr=["你走到克莱门特一系的枢机面前，欠了欠身。","他的随从接过话头：「阁下的意思，您带来了什么？」"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"奉上 200 金资助", go:"w64_election_give_strict" },
    { t:"以组织身份游说（需 rank≥2）", go:"w64_election_lobby_strict" },
    { t:"告辞，退回会场", go:"w64_election_node" }
  ]};
};

  nodes["w64_election_act_open"] = function(){
  var arr=["你走到奥黛拉一系的枢机面前，行了礼。","她身边的年轻修士笑了笑：「您也是来为宽恕说话的？」"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"奉上 200 金资助", go:"w64_election_give_open" },
    { t:"以组织身份游说（需 rank≥2）", go:"w64_election_lobby_open" },
    { t:"告辞，退回会场", go:"w64_election_node" }
  ]};
};

  nodes["w64_election_give_strict"] = function(){
  var ok=window.w64_vote?w64_vote('cand_strict'):false;
  var arr=ok?
    ["钱袋轻了。那边有人朝你点头，把名字记进一本厚册子。","「教廷记得你。」他说。"]:
    ["你摸遍口袋——不够。","随从的目光冷了下来：「下次带够了再来。」"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"退回会场", go:"w64_election_node" },
    { t:"离开使徒宫", go:"w64_war_return" }
  ]};
};

  nodes["w64_election_give_open"] = function(){
  var ok=window.w64_vote?w64_vote('cand_open'):false;
  var arr=ok?
    ["钱袋轻了。年轻修士接过钱袋，认真道了谢。","「奥黛拉阁下会记得这份心意。」"]:
    ["你摸遍口袋——不够。","年轻修士没说什么，只是把空碗往你面前推了推。"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"退回会场", go:"w64_election_node" },
    { t:"离开使徒宫", go:"w64_war_return" }
  ]};
};

  nodes["w64_election_lobby_strict"] = function(){
  var ok=window.w64_electionLobby?w64_electionLobby('cand_strict'):false;
  var arr=ok?
    ["你报了组织的名号。老枢机抬起眼皮看了你很久。","「后生可畏。」他合上名录，「克莱门特阁下会见的。」"]:
    ["你刚要开口，卫兵伸手拦住：「闲人免进。」","你看了看自己的身份——还不够格。"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"退回会场", go:"w64_election_node" },
    { t:"离开使徒宫", go:"w64_war_return" }
  ]};
};

  nodes["w64_election_lobby_open"] = function(){
  var ok=window.w64_electionLobby?w64_electionLobby('cand_open'):false;
  var arr=ok?
    ["你报了组织的名号。年轻修士的眼睛亮了。","「奥黛拉阁下正好想见见学院的人。」他引你往里走。"]:
    ["你刚要开口，门口修士摇头：「没有名帖，恕不接待。」","你看了看自己的身份——还不够格。"];
  return {place:"圣辉城·使徒宫", text:function(){return arr;}, options:[
    { t:"退回会场", go:"w64_election_node" },
    { t:"离开使徒宫", go:"w64_war_return" }
  ]};
};

  nodes["w64_election_goal"] = function(){
  var d=(typeof S!=='undefined'&&S&&S.day)?S.day:0;
  if(window.w64_addGoal) w64_addGoal('goal_election','影响教廷选举',d+40);
  return {place:"圣辉城·使徒宫", text:function(){return ["你当着枢机们的面，立了誓：这一任教皇，得按你的意思来。","说完你自己先笑了——口气不小。可话已出口，收不回来了。"];}, options:[
    { t:"回去会场", go:"w64_election_node" },
    { t:"离开使徒宫", go:"w64_war_return" }
  ]};
};

  nodes["w64_election_leave"] = function(){
  return {place:"圣辉城·使徒宫", text:function(){return ["你退出了使徒宫。门在身后合上，枢机们的低语被隔断。","石板路上有人卖新烤的面包，热气扑了满脸。你买了一个，边走边吃。"];}, options:[
    { t:"回圣辉城", go:"w64_war_return" }
  ]};
};

  nodes["w64_goal_node"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  var dis=(ws.disasters||[]);
  var pap=(ws.politics&&ws.politics.papacy)||{};
  var arr=["你站在世界地图前。蜡烛把大陆的影子投在墙上。","立下一个目标，就是把一条路钉进土里。"];
  var opts=[];
  if(wars.length){ opts.push({t:"立誓：见证战事终结",go:"w64_goal_pledge_war"}); }
  if(dis.length){ opts.push({t:"立誓：阻止天灾蔓延",go:"w64_goal_pledge_dis"}); }
  if(pap.candidates&&pap.candidates.length){ opts.push({t:"立誓：影响教廷选举",go:"w64_goal_pledge_ele"}); }
  if(!opts.length){ arr.push("你看了很久——大陆暂时没有值得立约的大事。"); }
  opts.push({t:"收起地图",go:"w64_war_return"});
  return {place:"旅途", text:function(){return arr;}, options:opts};
};

  nodes["w64_goal_pledge_war"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  var w=wars[wars.length-1];
  var d=(typeof S!=='undefined'&&S&&S.day)?S.day:0;
  if(w&&window.w64_addGoal) w64_addGoal('goal_war_'+w.id,'见证战事终结',d+90);
  return {place:"旅途", text:function(){return ["你在地图上按住了"+((w&&w.front)||'战场')+"的位置。","「这场仗打完之前，我不走远。」你说。","蜡烛晃了一下，像有人应了你。"];}, options:[
    { t:"收起地图", go:"w64_war_return" }
  ]};
};

  nodes["w64_goal_pledge_dis"] = function(){
  var d=(typeof S!=='undefined'&&S&&S.day)?S.day:0;
  if(window.w64_addGoal) w64_addGoal('goal_disaster_end','阻止天灾蔓延',d+40);
  return {place:"旅途", text:function(){return ["你在地图上画了个圈，圈住那片正被天灾啃咬的地方。","「等它过去，不算本事。得让它在人手里停下来。」"];}, options:[
    { t:"收起地图", go:"w64_war_return" }
  ]};
};

  nodes["w64_goal_pledge_ele"] = function(){
  var d=(typeof S!=='undefined'&&S&&S.day)?S.day:0;
  if(window.w64_addGoal) w64_addGoal('goal_election','影响教廷选举',d+40);
  return {place:"旅途", text:function(){return ["你把「教廷」两个字写在地图边角，圈了三道。","「教皇的位子空着，就是留给敢坐的人。」"];}, options:[
    { t:"收起地图", go:"w64_war_return" }
  ]};
};

  nodes["w64_war_aftermath"] = function(){
  var am=(typeof S!=='undefined'&&S&&S.w64Aftermath)?S.w64Aftermath:null;
  var arr=[];
  if(!am){ arr.push("没有待结算的战事。你的伤已经好了，或者还没好透。"); }
  else{
    arr.push("战事已经结束。"+(am.text||""));
    if(am.type==='annihilate'||am.type==='triumph'){ arr.push("论功行赏，你领了一笔钱。名字写进战报，被人念了几遍。"); }
    else if(am.type==='win'){ arr.push("你活着回来了，带着赏钱和一条还没长好的疤。"); }
    else { arr.push("你活着回来了。只是夜里常被号角声惊醒。"); }
    if(typeof S!=='undefined'&&S) S.w64Aftermath=null;
  }
  return {place:"旅途", text:function(){return arr;}, options:[
    { t:"继续赶路", go:"w64_war_return" }
  ]};
};


  nodes["w64_war_join"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  var war=wars[wars.length-1]||null;
  var arr=[];
  if(!war){
    arr.push("你赶到前线，战事已经结束了。");
    arr.push("战旗还插在城头，风一吹，猎猎作响。");
    return {place:"前线", text:function(){return arr;}, options:[{t:"返回", go:"w64_war_return"}]};
  }
  var aN=window.w64_fname?w64_fname(war.a):war.a;
  var bN=window.w64_fname?w64_fname(war.b):war.b;
  arr.push("你到了"+war.front+"。");
  arr.push(aN+"和"+bN+"的兵隔着壕沟对峙，炊烟从两边营地里升起来——仗没打完，饭照吃。");
  var h=war.history||[];
  if(h.length){ var last=h[h.length-1]; arr.push("上一场，是"+last.result+"。斥候说，下一场快了。"); }
  if(S.w64Side===war.id){ arr.push("你腰上别着"+aN+"的军牌。下一场战役，你在前锋队里。"); }
  else{ arr.push("你站在壕沟中间，两边都在看你。"); }
  return {
    place:"前线 · "+war.front,
    text:function(){return arr;},
    options:[
      { t:"领"+aN+"的军牌，加入战事", go:"w64_war_sideA", check:"STR",
        tier:{ crit:function(){return["你握住长枪，往"+aN+"营里一站。老兵们互相看了一眼，没拦你——你身上那股杀过人的味道，骗不了人。"]; },
               ok:function(){return["你领了军牌。发牌的老兵打量你一眼：「够胆。」"]; },
               fail:function(){return["你领了军牌，但握枪的手还有点生。老兵没说什么，只是多看了你一眼。"]; },
               critfail:function(){return["你走到营门口，被拦住了。哨兵皱眉：「你这种身板，上去是添乱。」——你只能先在辎重队待着。"]; }} },
      { t:"领"+bN+"的军牌，加入战事", go:"w64_war_sideB", check:"STR",
        tier:{ crit:function(){return["你在"+bN+"营里领了军牌。他们的将军听说来了个强援，亲自出来看了一眼。"]; },
               ok:function(){return["你领了"+bN+"的军牌。待遇还行，至少晚饭是热的。"]; },
               fail:function(){return[""+bN+"的军需官犹豫了一下，还是把军牌给了你。"]; },
               critfail:function(){return[""+bN+"的人以为你是奸细，盘问了一炷香。最后放你进去了，但看你的眼神还是不对。"]; }} },
      { t:"在壕沟边观战", go:"w64_war_observe" },
      { t:"离开前线", go:"w64_war_return" }
    ]
  };
};

  nodes["w64_war_sideA"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  var war=wars[wars.length-1];
  if(war){ S.w64Side=war.id; if(window.w64_addGoal) w64_addGoal('goal_war_'+war.id, '见证战事终结', (S.day||0)+90); }
  var arr=["你站在"+((war&&war.front)||'前线')+"的城头，风灌进领口。"];
  arr.push("下一场仗，你在前锋队里。剑在鞘里，鞘在腰间——你忽然想起，自己第一次握剑是什么时候。");
  arr.push("旁边的新兵问你：「你是哪里人？」");
  arr.push("你还没来得及答，号角响了。");
  return {place:"前线", text:function(){return arr;}, options:[
    { t:"握紧武器，走向战场", go:"w64_war_join" },
    { t:"临阵退缩，退回后方", go:"w64_war_observe" }
  ]};
};

  nodes["w64_war_sideB"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  var war=wars[wars.length-1];
  if(war){ S.w64Side=war.id; if(window.w64_addGoal) w64_addGoal('goal_war_'+war.id, '见证战事终结', (S.day||0)+90); }
  var arr=["你加入了"+((war&&window.w64_fname)?w64_fname(war.b):'另一方')+"的营。"];
  arr.push("他们的伙食比对面好一点，但士气也谈不上高。有人在火堆边补靴子，补得很慢。");
  arr.push("你坐下来，火光把你的影子拉得很长。");
  return {place:"前线营地", text:function(){return arr;}, options:[
    { t:"同袍同泽，共赴战阵", go:"w64_war_join" },
    { t:"这仗与我何干，走吧", go:"w64_war_return" }
  ]};
};

  nodes["w64_war_observe"] = function(){
  if(typeof S!=='undefined') S.w64Side=null;
  var arr=["你站在壕沟边的高坡上，看着两边的旗子来回移。"];
  arr.push("一场仗打完，留下几十具尸体。收尸的人抬得很慢，像怕惊醒谁。");
  arr.push("你在想：这些名字，会写进编年史吗。");
  return {place:"前线高坡", text:function(){return arr;}, options:[
    { t:"看够了，离开", go:"w64_war_return" }
  ]};
};

  nodes["w64_war_return"] = function(){
  var arr=["你离开了前线。"];
  arr.push("身后的战场越来越远，远到只剩下天边一缕烟。");
  return {place:"回程路上", text:function(){return arr;}, options:[
    { t:"继续赶路", go:"fc_jiaohui_entry" }
  ]};
};

  nodes["w64_dis_respond"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var ds=ws.disasters||[];
  var cur=ds[ds.length-1];
  var arr=[];
  if(!cur){
    arr.push("传闻里的天灾，已经过去了。");
    arr.push("地上还留着痕迹，但日子还得过。");
    return {place:"野外", text:function(){return arr;}, options:[{t:"返回", go:"w64_war_return"}]};
  }
  arr.push(cur.region+"正闹"+cur.cn+"。");
  arr.push("烟火是灰的，水是浑的。有人背着孩子往高处走，有人蹲在自家门口，不肯走。");
  return {
    place:cur.region,
    text:function(){return arr;},
    options:[
      { t:"下去救人", go:"w64_dis_rescue", check:"CHA",
        tier:{ crit:function(){return["你冲进烟里，一趟一趟往外背人。有个老人攥着你的袖子，半天没松——他把你看成他儿子了。"]; },
               ok:function(){return["你救了几个人。他们没说什么，只是把仅有的干粮塞给你。"]; },
               fail:function(){return["你尽力了，但天灾面前，一个人太薄。救出来的人不多。"]; },
               critfail:function(){return["你被倒塌的梁压住了腿，最后是自己爬出来的。没人注意到你。"]; }} },
      { t:"趁乱搜刮", go:"w64_dis_loot", check:"AGI",
        tier:{ crit:function(){return["你摸走了几户人家压箱底的东西，没人看见。风一吹，你忽然觉得后颈有点凉。"]; },
               ok:function(){return["你捡了些散落的东西。这年头，活着的人顾不上财物。"]; },
               fail:function(){return["你翻了半天，只找到几块发霉的饼。还差点被人撞见。"]; },
               critfail:function(){return["你被一群人围住了。他们以为你是来抢粮的，你只好扔下东西跑了。"]; }} },
      { t:"观察记录这一切", go:"w64_dis_study" },
      { t:"转身离开", go:"w64_dis_leave" }
    ]
  };
};

  nodes["w64_dis_rescue"] = function(){
  if(window.w64_disRespond) w64_disRespond('rescue');
  if(window.w64_karma) w64_karma('karma_rescued',14);
  var arr=["你从天灾里救出的人，后来在村口给你立了块牌子。"];
  arr.push("牌子上没有字，只刻了一双手——捧着东西的手。");
  arr.push("你没有留下名字。但从此，这一带有个人，逢人便说你的好话。");
  return {place:curRegionName()+" · 灾后", text:function(){return arr;}, options:[
    { t:"继续你的路", go:"w64_war_return" }
  ]};
};

  nodes["w64_dis_loot"] = function(){
  if(window.w64_disRespond) w64_disRespond('loot');
  if(window.w64_karma) w64_karma('karma_looted',21);
  var arr=["你趁乱拿到的东西，换成了钱。"];
  arr.push("钱在袋子里，沉甸甸的。");
  arr.push("夜里你听见风声，像是有人在哭。你翻了个身，告诉自己：那是风声。");
  return {place:curRegionName()+" · 集市", text:function(){return arr;}, options:[
    { t:"把袋子系紧，继续赶路", go:"w64_war_return" }
  ]};
};

  nodes["w64_dis_study"] = function(){
  if(window.w64_disRespond) w64_disRespond('study');
  var arr=["你蹲在灾后的废墟边，把痕迹一条一条记进本子。"];
  arr.push("火从哪来，水往哪去，土里埋着什么——你记得很细。");
  arr.push("末了你在本子背面写了一句：天灾之前，总有些征兆。下一次，要能提前看见。");
  return {place:curRegionName()+" · 废墟", text:function(){return arr;}, options:[
    { t:"合上本子，离开", go:"w64_war_return" }
  ]};
};

  nodes["w64_dis_leave"] = function(){
  if(window.w64_disRespond) w64_disRespond('leave');
  var arr=["你转身离开了"+curRegionName()+"。"];
  arr.push("身后的哭声被风送过来，又很快听不见。");
  arr.push("路上你走得很快。不知道为什么，你不想回头。");
  return {place:"路上", text:function(){return arr;}, options:[
    { t:"继续走", go:"w64_war_return" }
  ]};
};

  nodes["w64_sit_node"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var s=null;
  var list=ws.activeSituations||[];
  if(list.length) s=list[0];
  var arr=[];
  if(!s){
    arr.push("你赶到传闻里的地方，只看到太平无事。");
    arr.push("消息有时候跑得比马还快，却不一定比人真。");
    return {place:"路上", text:function(){return arr;}, options:[{t:"返回", go:"w64_war_return"}]};
  }
  var aN=window.w64_fname?w64_fname(s.factions[0]):s.factions[0];
  var bN=window.w64_fname?w64_fname(s.factions[1]):s.factions[1];
  arr.push(s.text);
  arr.push("传闻说："+aN+"和"+bN+"都在等一个台阶。");
  arr.push("你站到了这个节骨眼上。");
  var opts=[];
  if(s.kind==='border'){
    opts.push({ t:"劝双方各退一步", go:"w64_sit_done", effect:{flag:"w64_sit_border_peace"}, tier:{ ok:function(){return["你站在两军之间，把话摊开说了。北境人退了半步，南境人也退了半步——这半步，就够今晚不流血。"]; }, fail:function(){return["你的话被风吹散了。两边都不肯先动，但也没人肯先撤。"]; }} });
    opts.push({ t:"添一把火，让摩擦烧成战火", go:"w64_sit_done", effect:{flag:"w64_sit_border_war"}, tier:{ ok:function(){return["你在夜里放了一封信在两边哨所，内容只有一句话：对方今晚要偷袭。第二天，仗打起来了。"]; }, fail:function(){return["你的挑拨没起效——两边都太谨慎了。"]; }} });
  } else if(s.kind==='famine'){
    opts.push({ t:"出钱赈济，平价卖粮", go:"w64_sit_done", effect:{flag:"w64_sit_famine_relief"}, tier:{ ok:function(){return["你开仓放粮。粮价被压下来了，有人远远朝你作揖。"]; }, fail:function(){return["你的粮车在半路被劫了。赈济没成，还折了本钱。"]; }} });
    opts.push({ t:"囤积居奇，等粮价再涨", go:"w64_sit_done", effect:{flag:"w64_sit_famine_hoard"}, tier:{ ok:function(){return["你压着粮不出手。十天后，粮价翻了一倍——你赚了，但集市上骂你的声音也起来了。"]; }, fail:function(){return["你囤的粮发了霉。这波，你赔了。"]; }} });
  } else if(s.kind==='marriage'){
    opts.push({ t:"撮合这桩婚事", go:"w64_sit_done", effect:{flag:"w64_sit_marriage_yes"}, tier:{ ok:function(){return["你两头传话，把该说的好话都说了。婚事定下来了——一条新的纽带，把两家拴在一起。"]; }, fail:function(){return["两边都不太信你这个外人。婚事黄了。"]; }} });
    opts.push({ t:"搅黄这门亲事", go:"w64_sit_done", effect:{flag:"w64_sit_marriage_no"}, tier:{ ok:function(){return["你放出风声：女方家底早空了。男方一查，果然。婚事散了，两家从此生分。"]; }, fail:function(){return["你的谣言被拆穿了。两家联姻照旧，但你从此上了两家的黑名单。"]; }} });
  } else if(s.kind==='doctrine'){
    opts.push({ t:"主持一场公开辩论", go:"w64_sit_done", effect:{flag:"w64_sit_doctrine_debate"}, tier:{ ok:function(){return["你把两边请到一张桌子前。辩论没分出胜负，但至少没打起来——这在当下，已经算赢了。"]; }, fail:function(){return["辩论变成了对骂，最后动了手。你被夹在中间，挨了两下。"]; }} });
    opts.push({ t:"烧掉那卷引起争议的古籍", go:"w64_sit_done", effect:{flag:"w64_sit_doctrine_burn"}, tier:{ ok:function(){return["火堆烧了一夜。争议的来源没了，但有人记住了你烧书的样子。"]; }, fail:function(){return["那卷古籍是赝品。你烧了个寂寞，还落了个暴虐的名声。"]; }} });
  } else if(s.kind==='treasure'){
    opts.push({ t:"自己带队进旧林寻宝", go:"w64_sit_done", effect:{flag:"w64_sit_treasure_self"}, tier:{ ok:function(){return["你在旧林深处找到了那处遗迹。值钱的东西不多，但有一块刻着旧文的石板——你把它带了出来。"]; }, fail:function(){return["旧林的雾太大，你转了一整天，只找到几根兽骨。"]; }} });
    opts.push({ t:"把消息卖给自由港的商会", go:"w64_sit_done", effect:{flag:"w64_sit_treasure_sell"}, tier:{ ok:function(){return["商会买走了你的地图。三天后，他们的人进了旧林——这是他们的事了。"]; }, fail:function(){return["商会的账房压了价，你只拿到一顿饭钱。"]; }} });
  } else if(s.kind==='omen'){
    opts.push({ t:"循着低语，深入裂隙调查", go:"w64_sit_done", effect:{flag:"w64_sit_omen_investigate"}, tier:{ ok:function(){return["裂隙深处有什么东西在等你。你记下了它的样子，然后退了出来——有些答案，知道就够了。"]; }, fail:function(){return["你走得太深，差点没回来。出来的时候，耳鸣了一整夜。"]; }} });
    opts.push({ t:"出面安抚民心，说那只是风声", go:"w64_sit_done", effect:{flag:"w64_sit_omen_soothe"}, tier:{ ok:function(){return["你站在人群前面，告诉他们裂隙只是旧事重提。信不信是一回事，至少今晚没人连夜逃了。"]; }, fail:function(){return["你刚说完，裂隙那边就亮了一下。人群更慌了。"]; }} });
  }
  opts.push({ t:"不趟这浑水，抽身离开", go:"w64_war_return" });
  return {place:s.cn+" · 事发地", text:function(){return arr;}, options:opts};
};

  nodes["w64_sit_done"] = function(){
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var s=null;
  var list=ws.activeSituations||[];
  if(list.length) s=list[0];
  if(s&&window.w64_sitResolve) w64_sitResolve(s.id, '你介入了这场'+s.cn+'。');
  /* 按 flag 手动结算数值效果（effect 系统白名单外字段） */
  try{
    if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
    var F=S.flags||{};
    if(F.w64_sit_famine_relief){ if(S.gold!==undefined) S.gold=Math.max(0,(S.gold||0)-50); S.worldFame.mercy=Math.min(100,S.worldFame.mercy+5); }
    if(F.w64_sit_famine_hoard){ if(S.gold!==undefined) S.gold=(S.gold||0)+80; S.worldFame.terror=Math.min(100,S.worldFame.terror+3); }
    if(F.w64_sit_border_peace){ S.worldFame.mercy=Math.min(100,S.worldFame.mercy+3); }
    if(F.w64_sit_border_war){ S.worldFame.terror=Math.min(100,S.worldFame.terror+5); }
    if(F.w64_sit_marriage_yes){ S.worldFame.mercy=Math.min(100,S.worldFame.mercy+2); }
    if(F.w64_sit_marriage_no){ S.worldFame.terror=Math.min(100,S.worldFame.terror+2); }
    if(F.w64_sit_doctrine_debate){ S.worldFame.scholar=Math.min(100,S.worldFame.scholar+5); }
    if(F.w64_sit_doctrine_burn){ if(typeof S.corruption==='number') S.corruption=Math.min(100,S.corruption+3); S.worldFame.terror=Math.min(100,S.worldFame.terror+4); }
    if(F.w64_sit_treasure_self){ if(S.gold!==undefined) S.gold=(S.gold||0)+100; S.worldFame.legend=Math.min(100,S.worldFame.legend+4); }
    if(F.w64_sit_treasure_sell){ if(S.gold!==undefined) S.gold=(S.gold||0)+60; }
    if(F.w64_sit_omen_investigate){ if(typeof S.corruption==='number') S.corruption=Math.min(100,S.corruption+2); S.worldFame.scholar=Math.min(100,S.worldFame.scholar+3); }
    if(F.w64_sit_omen_soothe){ S.worldFame.mercy=Math.min(100,S.worldFame.mercy+3); }
  }catch(e){}
  var arr=["这件事，到此为止了。"];
  arr.push("至于后来人们怎么传，那是后来的事。你只知道，你当时在场。");
  return {place:"路上", text:function(){return arr;}, options:[
    { t:"继续你的路", go:"w64_war_return" }
  ]};
};












  Object.assign(window.N || {}, nodes);
  if (window.v62_chunk_loader) window.v62_chunk_loader.mark("world");
})();
