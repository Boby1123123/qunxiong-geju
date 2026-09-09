/* /v62inj:chunk-narr/ 叙事连续性(v66)分片（自动生成，勿手改） */
(function(){
  var nodes = {};
  nodes["v66_news_panel"] = function(){
var arr=['【打听见闻】'];
  var rq=(window.v66_rumorQueue? v66_rumorQueue():[]);
  var news=(rq&&rq.length)?rq.length:0;
  arr.push('城里的消息像水，沿着酒馆、告示板、墙角的下水道流。你今天站在这条水边，想听哪一段。');
  if(news>0) arr.push('（街头有新风声：'+news+' 条未听）');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'去酒馆听传闻（'+(news>0?news+' 条新':'暂无')+'）',go:'v66_rumor_board'},
    {t:'找说书人听一段古',go:'v66_lore_storyteller'},
    {t:'去碑林看旧刻',go:'v66_lore_stele'},
    {t:'进藏书阁翻旧档',go:'v66_lore_archive'},
    {t:'打听战况',go:'v66_war_report'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_war_report"] = function(){
var arr=['【战况】'];
  var fl=(window.v66_battleFlavor? v66_battleFlavor():'');
  if(fl){ arr.push(fl); arr.push('茶摊上有人压着声音议论，谁也不敢说太大声——怕被当成通敌。'); }
  else{ arr.push('这两天没有新的战火。告示板上贴的还是上个月的募兵令，边角卷了起来。'); }
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_rumor_board"] = function(){
var arr=['【酒馆·传闻】'];
  var rq=(window.v66_rumorQueue? v66_rumorQueue():[]);
  if(!rq.length){ arr.push('邻桌聊的都是陈年旧事。掌柜擦着杯子，眼皮都没抬。'); }
  else{
    for(var i=0;i<rq.length;i++){
      var d=rq[i];
      arr.push('· '+(d.desc||'（有人低声说了句什么，没听清）'));
      if(window.v66_rumorMark) v66_rumorMark(d.key||('m'+i));
    }
    arr.push('你把这些话记在心上。说的人散了，话还在酒气里打转。');
  }
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听点别的',go:'v66_rumor_board'},
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_storyteller"] = function(){
var arr=['【说书人·老周】'];
  arr.push('老周把惊堂木在手里转了一圈，没拍下去。他说：今日不讲武松打虎。讲几段你们这地方的老话。');
  arr.push('他压低声音：有些话，碑上不写，书上不印，只在酒里传。听不听，在你。');
  var tales=[['v66_lore_t1','太吾剑谱的下落'],['v66_lore_t2','教皇为何沉睡'],['v66_lore_t3','裂隙从哪来'],['v66_lore_t4','北境的世仇'],['v66_lore_t5','学院的禁书'],['v66_lore_t6','城邦的密约'],['v66_lore_t7','失踪的那层楼'],['v66_lore_t8','焚书广场的灰']];
  var known=[];
  for(var i=0;i<tales.length;i++){
    var lid=tales[i][0];
    var done=(S.loreDiscovered&&S.loreDiscovered[lid])?true:false;
    known.push({t:(done?'（已听）':'')+tales[i][1],go:lid});
  }
  return {place:'酒馆', text:function(){return arr;}, options:known.concat([
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ])};
  };

  
  nodes["v66_lore_t1"] = function(){
var arr=['【说书人·老周：太吾剑谱的下落】'];
  arr.push('表层：三年前，自由城邦的拍卖场里流出过半页残谱。买家戴着面具，散场后没人再见过他。');
  arr.push('中层：那半页不是真迹。真迹在剑客徐远舟身上——他带着它流浪，从不在一个地方睡两晚。');
  arr.push('深层：徐远舟不卖，是因为谱里夹着一封信。信上写着七个字：“剑谱可丢，人别死。”');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t1');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t2"] = function(){
var arr=['【说书人·老周：教皇为何沉睡】'];
  arr.push('表层：教廷说，教皇在与深渊的搏斗中耗尽了神性，陷入了沉眠，等圣光再度垂怜。');
  arr.push('中层：老周摇头：“他是被自己压着的封印困住的。”教皇醒着，封印就弱一分；他睡死过去，封印才稳。');
  arr.push('深层：所以没有人敢叫醒他。连他最信任的枢机，夜里都守在门外，怕他忽然睁眼。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t2');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t3"] = function(){
var arr=['【说书人·老周：裂隙从哪来】'];
  arr.push('表层：深渊裂隙是上古大战留下的伤疤，几千年没长好。');
  arr.push('中层：第一个封印者不是英雄，是个逃兵。他用自己的身体堵住了裂口，从此再没站起来。');
  arr.push('深层：裂隙不是裂开的地，是那人的脊梁弯下去的地方。每多一道裂隙，就多一个弯下去的人。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t3');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t4"] = function(){
var arr=['【说书人·老周：北境的世仇】'];
  arr.push('表层：北境与南方世代结仇，因为百年前一场边境屠城。');
  arr.push('中层：那场屠城不是仇杀，是断粮。城里的粮官把粮卖给了南方商人，城里人饿到吃树皮，城破时连抵抗的力气都没有。');
  arr.push('深层：北境王室里有一份名单——不是仇人的名单，是当年饿死的人的名单。他每次议事前都看一遍。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t4');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t5"] = function(){
var arr=['【说书人·老周：学院的禁书】'];
  arr.push('表层：学院禁书库锁着不该让人看见的魔法，三层铁门，钥匙在院长身上。');
  arr.push('中层：锁的不是魔法，是一个结论——“元素平衡被打破时，魔法本身会开始吃人。”');
  arr.push('深层：院长每天都会去禁书库坐一会儿。他不看书，只坐着。老周说：他在等那个结论自己站起来走掉。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t5');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t6"] = function(){
var arr=['【说书人·老周：城邦的密约】'];
  arr.push('表层：自由城邦谁都不得罪，谁都讨好，靠的是左右逢源。');
  arr.push('中层：三十年前，城邦与暗蚀会签过一份十年密约——暗蚀会不碰商路，城邦不过问深渊的事。');
  arr.push('深层：密约的墨迹还在，纸已经烧了。烧纸那天，城主的茶凉了半盏，他没让人续。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t6');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t7"] = function(){
var arr=['【说书人·老周：失踪的那层楼】'];
  arr.push('表层：学院的主塔图纸上有九层，实际只有八层。第九层在图纸上，不在楼里。');
  arr.push('中层：第九层不是拆了，是“挪”走了——用一次失败的时空实验，整层楼连着里面的书和人都搬去了“别处”。');
  arr.push('深层：有人偶尔会在深夜听见头顶有脚步声。抬头，天花板干干净净。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t7');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_t8"] = function(){
var arr=['【说书人·老周：焚书广场的灰】'];
  arr.push('表层：焚书广场是教廷净化异端书籍的地方，每月烧一次。');
  arr.push('中层：烧的不是书，是“记载”。有些事写下来就有人会去查，查了就会出事。');
  arr.push('深层：广场地砖缝里，灰烬长年不扫。老周说：那灰底下压着的，才是教廷真正怕的东西。');
  if(window.v66_loreFlash) v66_loreFlash('v66_lore_t8');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'再听一段',go:'v66_lore_storyteller'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_stele"] = function(){
var arr=['【碑林】'];
  arr.push('城外的碑林立着历代战死的名字。风从碑缝里过，呜呜的，像有人在念。');
  arr.push('最老的一块碑没有名字，只刻了一行字：此地埋过一支军队。后来，这块地学会了长草。');
  return {place:'碑林', text:function(){return arr;}, options:[
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_lore_archive"] = function(){
var arr=['【藏书阁】'];
  arr.push('阁里的旧档按年份堆着，最下面一层已经发了霉。守阁的老人说，没人记得底下压着什么。');
  arr.push('你翻到一卷编号模糊的账册，页角被人撕过。能看清的字只剩一行：“……故支白银三百，名目：抚恤。经手人：无。”');
  return {place:'藏书阁', text:function(){return arr;}, options:[
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_cast_warroom"] = function(){
var arr=['【帅帐·战前会议】'];
  arr.push('沙盘四周站着几个人。你不必问名字，听他们说话就分得清。');
  arr.push('老将把手指按在河湾上，说：渡口是死地，绕。声音不高，没人接话——他年轻时在那儿丢过一个团。');
  arr.push('书记官搓着炭笔：粮道还能撑七天。七天之后，要么赢，要么撤。他说完把笔放下，像放下一个坏消息。');
  arr.push('最年轻的校尉憋了半天，说：我可以带斥候先过河。老将看了他一眼，没接话，把手指从河湾移开了。');
  return {place:'帅帐', text:function(){return arr;}, options:[
    {t:'离开',go:'v66_news_panel'}
  ]};
  };

  
  nodes["v66_cast_tavern"] = function(){
var arr=['【酒馆·夜谈】'];
  arr.push('邻桌三个人，各喝各的。');
  arr.push('猎人用刀尖剔着指甲：林子里死人了，衙门说是野兽。他顿了一下，又补了一句：野兽不吃那么整齐。');
  arr.push('商人不接话，把酒钱压在杯底，起身走了。他怕听这些。');
  arr.push('角落里坐着的巡林者一直没抬头，直到猎人说完，才问了一句：死的那个，是不是走古道来的？');
  arr.push('猎人没答。巡林者又低下头去，把杯里的酒喝干了。');
  return {place:'酒馆', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_cast_gate"] = function(){
var arr=['【城门·赈灾】'];
  arr.push('粥棚前排着队。秩序比想象中好，因为所有人都饿得没力气插队。');
  arr.push('管粥的汉子每舀一勺，都要把勺子在锅沿刮一下——怕多给。刮完他自己愣了一下，又往碗里添了半勺。');
  arr.push('旁边的小孩没接碗，盯着锅里看。他娘把他拽回来，轻声说：看也没用，看能看饱么。');
  arr.push('小孩还是盯着。锅里的粥白得晃眼，像一面镜子，照见每个人脸上的灰。');
  return {place:'城门', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_obs_city"] = function(){
var arr=['【观察·城中】'];
  arr.push('你放慢脚步，听了一耳朵街上的动静。');
  arr.push('墙根下晒着半筐菜干，主家忘了收。收摊的菜贩子路过，看了一眼，没碰。');
  arr.push('日子还过得下去——城里人心照不宣的活法，就是谁也别说破谁。');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_obs_camp"] = function(){
var arr=['【观察·军营】'];
  arr.push('入夜前你在营里转了一圈。');
  arr.push('新兵在火堆边补靴子，针脚歪歪扭扭。老兵靠着营柱抽旱烟，看了一会儿，把自己的针线包扔了过去，没说话。');
  arr.push('靴子补好了。新兵把针线包还回来的时候，腰杆挺直了些。');
  return {place:'军营', text:function(){return arr;}, options:[
    {t:'离开',go:'v66_news_panel'}
  ]};
  };

  
  nodes["v66_obs_road"] = function(){
var arr=['【观察·官道】'];
  arr.push('你在道边的茶棚歇脚。');
  arr.push('赶车的老把式说：这路今年补了三次。他敲了敲车辕，又补了一句：补路的钱，比路值钱。');
  arr.push('棚外的风把茶旗吹得猎猎响。他眯着眼看了一会儿，又说：要变天了。');
  return {place:'路上', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_evt_r1"] = function(){
var arr=['【战后·收尸】'];
  arr.push('战场刚静下来，天上还挂着烟。');
  arr.push('你在尸堆里认出一个面熟的——昨天还分过你半个馍的伙夫。他怀里护着个铁盒，盒子压扁了，里面的军饷散了一地。');
  arr.push('你把铁盒捡起来，放在他胸口。风一吹，铜钱哗啦啦响，像替他数了一遍。');
  return {place:'战场', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_evt_r2"] = function(){
var arr=['【战后·老兵】'];
  arr.push('城里多了个断了一条胳膊的老兵，在城墙根下给人写家书。');
  arr.push('他握笔的手很稳。写一封，收三个铜板，封口前总要再念一遍。');
  arr.push('有个人问：你自己不写一封？他笑了：没人可寄。手里的笔顿了顿，又蘸了墨。');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_evt_r3"] = function(){
var arr=['【战后·流言】'];
  arr.push('茶摊上有人低声说：听说打胜的那边，把俘虏卖了。');
  arr.push('没人接话。卖茶的把壶续上水，动作很轻，像怕惊着什么。');
  arr.push('过了一会儿，角落里有人闷声说了一句：我兄弟也在那边。茶摊安静下来，只有水汽往上飘。');
  return {place:'茶摊', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_ripple_battle"] = function(){
var arr=['【余波·战后】'];
  arr.push('那场仗打完第十天，城外的土地还没缓过来。');
  arr.push('田埂上立着几根新十字，木头还是白的。种地的人绕过它们下地，谁也没说话。');
  arr.push('傍晚有人在那几根十字前放了一碗饭。第二天碗空了——也许是鸟吃的，也许是别的。');
  return {place:'城外', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_ripple_siege"] = function(){
var arr=['【余波·围城】'];
  arr.push('围城解了，城墙上的弹孔还没来得及补。');
  arr.push('城里的猫都瘦了一圈，见人不躲，蹲在墙根晒太阳，像在替整座城歇一口气。');
  arr.push('有人开始往城外寄信。第一封信是写给母亲的，只写了一句：我还活着。');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_ripple_plague"] = function(){
var arr=['【余波·疫后】'];
  arr.push('疫病退了，城里的门才敢一扇扇打开。');
  arr.push('药铺门口晒着一排旧口罩，像一排洗过的旗。掌柜坐在门槛上，数着剩下的药材，数到一半就停了。');
  arr.push('他把账本合上，说：这账，先不记了。');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_ripple_fall"] = function(){
var arr=['【余波·城破】'];
  arr.push('城破了，日子还得过。');
  arr.push('断墙下有人支起了摊子，卖的还是原来那几样吃食。买家少了，他煮得也少了，但锅一直没空过。');
  arr.push('有人问他怎么不走。他往灶膛里添了根柴，说：火不灭，城就还在。');
  return {place:'城里', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_bridge_t1"] = function(){
var arr=['【三日之后】'];
  arr.push(window.v66_bridgeText? v66_bridgeText('time'):'');
  arr.push('该办的事办完了。你站在路口，想下一步去哪。');
  return {place:'路口', text:function(){return arr;}, options:[
    {t:'回见闻处',go:'v66_news_panel'},
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_bridge_t2"] = function(){
var arr=['【途中】'];
  arr.push(window.v66_bridgeText? v66_bridgeText('travel'):'');
  arr.push('路还长。你在马背上把这几日的经过捋了一遍，发现有些事，越想越不对。');
  return {place:'路上', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };

  
  nodes["v66_bridge_t3"] = function(){
var arr=['【推门】'];
  arr.push(window.v66_bridgeText? v66_bridgeText('scene'):'');
  arr.push('你定了定神，往里走。');
  return {place:'门内', text:function(){return arr;}, options:[
    {t:'离开',go:'arrive_generic'}
  ]};
  };
  
  Object.assign(window.N || {}, nodes);
  if (window.v62_chunk_loader) window.v62_chunk_loader.mark("narr");
})();
