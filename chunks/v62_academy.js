/* /v62inj:chunk-academy/ 学院线分片（自动生成，勿手改） */
(function(){
  var nodes = {};
  nodes["academy_entrance"] = function(){ return {
  text:function(){var base=["序章结束了。你站在人生的十字路口。十六岁，或者十八岁——正是离开庇护、踏入广阔世界的年纪。面前有几条路，但最稳妥的一条，是上学。大陆上有五所顶级学院，每一所都有自己的风格和秘密。你需要选择一所，然后通过入学考试。"];
  if(S.race=="精灵") base.push("作为精灵，你默认被银叶学院录取，但也可以申请人类学院的交换生名额。");
  if(S.race=="矮人") base.push("作为矮人，熔炉学院向你敞开大门，但你也可以选择其他学院。");
  return base;},
  options:[
    {t:"艾尔达魔法学院（自由城邦·交汇城）", go:"academy_exam_elda", effect:{flag:"academy_choice_elda", time:7}},
    {t:"承天书院（东部王国·后山）", go:"academy_exam_chengtian", effect:{flag:"academy_choice_chengtian", time:10}},
    {t:"圣光神学院（教会区·圣城）", go:"academy_exam_holy", effect:{flag:"academy_choice_holy", time:14}},
    {t:"银叶学院（精灵王国·世界树下）", go:"academy_silver_leaf", effect:{flag:"academy_choice_silver", time:20}},
    {t:"熔炉学院（矮人王国·铁峰堡）", go:"academy_forge_peak", effect:{flag:"academy_choice_forge", time:18}}
  ]
};}


  nodes["academy_exam_elda"] = function(){ return {
  text:["交汇城的夏天很热。艾尔达魔法学院的大门前挤满了来自大陆各地的考生。你看到了精灵、矮人、兽人，甚至有几个穿着黑袍的神秘人。一个戴着眼镜的老教授站在门口，用洪亮的声音说：「入学考试只有一场——笔试加实操。今天，你们要证明自己有资格坐进这间教室。」"],
  options:[
    {t:"参加笔试（智力）", check:{attr:"INT", label:"智力·笔试", target:50},
      tier:{crit:function(){return[pickV(["你提笔如飞，每一道题都像是在等你写出答案。老教授走过你身边时停了下来，看了一眼你的卷子，推了推眼镜：「有意思。」你是第一个交卷的，而且全对。◆笔试S级，智力+2，教授关注+1","你不仅答完了所有题，还在最后一道附加题上写出了三种解法。监考教授低声对旁边的人说：「这个学生，墨丘利会感兴趣的。」◆笔试S级，获得墨丘利关注，智力+1"],"exam_crit")]},
      ok:function(){return[pickV(["你稳稳地答完了所有题目，虽然有几道不太确定，但整体感觉不错。◆笔试A级","你写完了大部分题目，有几道难题空着，但基础题全对。◆笔试B级"],"exam_ok")]},
      fail:function(){return[pickV(["你被几道难题卡住了，时间不够用。交卷时还有两页没写。◆笔试C级，需要实操扳回","你太紧张了，手心出汗，连笔都握不稳。很多会的题都写错了。◆笔试D级，实操必须拿高分"],"exam_fail")]},
      critfail:function(){return[pickV(["你在考场上睡着了。醒来时考试已经结束，卷子上只写了名字。◆笔试F级，几乎不可能入学，但也许有别的办法","你不小心把墨水洒在了卷子上，大半答案都看不清了。监考老师摇了摇头。◆笔试F级，需要特殊途径入学"],"exam_cf")]}},
      go:"academy_practical", effect:{time:3}},
    {t:"直接找教授求情（魅力）", check:{attr:"CHA", label:"魅力·游说", target:65},
      tier:{ok:function(){return[pickV(["你找到老教授，用三寸不烂之舌说服了他。他叹了口气：「好吧，给你一个旁听名额。但期末考试不过关，照样滚蛋。」◆特殊入学，旁听生身份","你展示了一个独特的天赋，老教授眼前一亮：「这种资质……行，你被录取了。」◆特招入学，获得教授推荐"],"plead_ok")]},
      fail:function(){return[pickV(["老教授根本不听你说话，挥手让你去排队。◆必须参加考试","你的游说太拙劣，老教授反而更怀疑你的人品了。◆考试目标+10"],"plead_fail")]}},
      go:"academy_practical", effect:{time:1}},
    {t:"放弃入学，直接闯荡大陆", go:"city_free", effect:{flag:"skip_academy", time:1}}
  ]
};}


  nodes["academy_practical"] = function(){ return {
  text:["实操考试在竞技场进行。每个考生要面对一个魔法傀儡，用自己的方式击败它。傀儡不会杀人，但会毫不留情地把你打飞。你活动了一下手腕，走上了竞技场。"],
  options:[
    {t:"正面战斗（力量/敏捷）", check:{attr:"STR", label:"力量·战斗", target:50},
      tier:{crit:function(){return[pickV(["你一拳打碎了傀儡的核心。整个竞技场安静了一秒，然后爆发出欢呼。老教授站起来鼓掌：「这个学生，战斗系要定了！」◆实操S级，力量+2","你用一套流畅的连击把傀儡拆成了零件。战斗系教官眼睛都直了。◆实操S级，获得战斗系教官赏识"],"prac_crit")]},
      ok:function(){return[pickV(["你经过一番苦战，终于击败了傀儡。虽然受了点伤，但表现可圈可点。◆实操A级","你用技巧和耐心消耗了傀儡，最后一击制胜。◆实操B级"],"prac_ok")]},
      fail:function(){return[pickV(["你被傀儡打飞了三次，最后靠时间耗尽才勉强过关。◆实操C级","你和傀儡僵持了很久，最后被判平局。◆实操C级"],"prac_fail")]},
      critfail:function(){return[pickV(["你被傀儡一拳打晕，被抬出了竞技场。◆实操F级，入学希望渺茫","你误伤了旁边的考生，被取消了考试资格。◆被取消资格，但也许有别的路"],"prac_cf")]}},
      go:"academy_admission", effect:{time:1}},
    {t:"用魔法/技能智取（智力/灵性）", check:{attr:"INT", label:"智力·智取", target:55},
      tier:{crit:function(){return[pickV(["你没有硬拼，而是用一个巧妙的魔法让傀儡自己短路了。老教授眼睛一亮：「这才是魔法师的思路。」◆实操S级，智力+2","你用环境和战术轻松解决了傀儡，连汗都没出。◆实操S级，获得墨丘利关注"],"prac_magic_crit")]},
      ok:function(){return[pickV(["你用魔法和技巧结合，顺利解决了傀儡。◆实操A级","你找到了傀儡的弱点，一击制胜。◆实操B级"],"prac_magic_ok")]},
      fail:function(){return[pickV(["你的魔法被傀儡反弹了，差点伤到自己。◆实操C级","你的策略太复杂，执行时出了纰漏。◆实操C级"],"prac_magic_fail")]}},
      go:"academy_admission", effect:{time:1}}
  ]
};}


  nodes["academy_admission"] = function(){ return {
  text:function(){var base=["考试结束了。你在公告栏前等待结果。人群挤来挤去，有人欢呼，有人哭泣。你的名字——"];
  var total=(S.flags.exam_written||0)+(S.flags.exam_practical||0);
  if(total>=16) base.push("在最上面。S级录取。你获得了全额奖学金。");
  else if(total>=12) base.push("在前列。A级录取。");
  else if(total>=8) base.push("在中间。B级录取。");
  else if(total>=4) base.push("在最后。C级录取，勉强通过。");
  else base.push("不在榜上。你落榜了。但——一个戴兜帽的人向你走来，低声说：「跟我来。也许还有别的路。」");
  base.push("报到那天的清晨，艾尔达学院的大门还没开，门前已经排起了长队。");base.push("你站在队伍里，能听见此起彼伏的窃窃私语——有人在打听学费，有人在炫耀家族，还有人一言不发，只是攥紧了自己的行囊。");base.push("大门缓缓打开。门楣上那行古老的铭文在晨光里亮了一下：「知识不设门槛，但只向配得上它的人敞开。」");base.push("你跨过门槛时，忽然回头看了一眼来路。那条你走了很多天的路，此刻隐在晨雾里，像一段刚刚翻过去的篇章。");base.push("前面有人在喊你的名字。你转过头，踏进这片新天地。");return base;} /*v45inj:academy_admission*/,
  options:[
    {t:"入学，开始学院生活", go:"academy_year1_open", effect:{flag:"academy_enrolled", time:1}},
    {t:"（落榜时）跟随兜帽人", go:"watchers_offer", effect:{flag:"watcher_recruit", time:1}}
  ]
};}


  nodes["academy_year1_open"] = function(){ return {
  text:function(){var base=["第一学年·基础年。你拖着行李走进了宿舍。房间不大，两张床，两张桌子，一扇窗。你的室友还没来。窗外是学院的钟楼，钟声悠悠地响着。你深吸一口气——这是你新生活的开始。"];
  base.push("你需要：选课、认识同学、参加社团招新、准备第一次期中考试。");
  base.push("宿舍的窗开着，风把灰尘吹起来，在光柱里打转。你放下行李，床板硬得硌手，但被褥是新的，有一股晒过太阳的味道。");base.push("室友的桌上摆着一只旧木杯，杯沿缺了个口。窗台上有人刻了一行小字，笔画很浅：「此间一住，莫问来处。」");base.push("钟楼的钟响了九下。你站在窗前，看见楼下的广场上，新生们三三两两地走，有人迷路，有人张望，有人已经勾肩搭背地笑起来。");base.push("你忽然想起出发那天的清晨——村口的雾、母亲塞给你的那包干粮，还有你回头时，她站在门口的样子。");base.push("你把干粮收进柜子最里面。以后的事，以后再说。眼下，先活着把第一年过完。");return base;} /*v45inj:academy_year1_open*/,
  options:[
    {t:"查看课程表并选课", go:"academy_course_select", effect:{time:1}},
    {t:"等室友来（认识同学）", go:"academy_roommate", effect:{time:2}},
    {t:"去社团招新现场", go:"academy_clubs", effect:{time:1}},
    {t:"在学院里逛逛（探索）", go:"academy_explore", effect:{time:1}}
  ]
};}


  nodes["academy_course_select"] = function(){ return {
  text:["选课大厅在学院东翼，是一间穹顶极高的大厅。清晨的阳光从高窗斜斜落下来，在光洁的石板地上切出一道道金色的光柱，灰尘在光柱里缓缓浮动。", "大厅里人头攒动。老生们三五成群地挤在各块课程板前，指指点点，议论纷纷。新生们则大多攥着刚发的课程手册，像一群迷路的雏鸟，东张西望。", "每门课前面都排着长队。你看着课程表，思考着自己的选择。必修课已经定好了，但选修课需要你自己决定。选什么课，可能会影响你接下来几年的走向。", "排在你前面的两个学生正在聊天，声音不大，但你听得清楚：", "「《高等炼金术》好过，就是烧钱，材料贵得吓人。」", "「《外交与谈判》学分稳，克劳迪娅教授打分松。不过嘛……听说她上届的学生，一半进了教会。」", "你低头看着手里的课程表。目光在几个名字上停驻——《灵魂魔法入门》，授课人：墨丘利。", "这个名字，你在序章里听过不止一次。传闻他不常亲自授课，只在心情好的时候挑几个学生。又有人说，他讲课的风格很怪，第一节课就敢当着全教室的面拆穿你所有的伪装。", "另一栏，《古代史与遗迹》，旁边的备注写着：学期末有一次实地考察。去年这门课的学生，有人从某处遗迹里带回了一件东西——具体是什么，没人说清，只听说那位学生后来退学了，去向不明。", "你捏着课程表，指腹压出浅浅的印子。选安稳的，还是选冒险的？选有用的，还是选想学的？", "「同学，」一个温和的声音在耳边响起，「考虑好了吗？后面还有人排着呢。」", "你抬起头，看见登记处的老管理员正笑眯眯地看着你，他花白的眉毛下面，一双眼睛却精明得很。", "你深吸一口气。这个决定，将跟着你很久。你终于向前迈出一步——"] /*v45inj:academy_course_select*/,
  unlock:["reading_tome_primordial"],
  options:[
    {t:"选《灵魂魔法入门》（墨丘利亲授）", effect:{flag:"course_soul", skillUp:"灵魂魔法"}, go:"academy_year1_midterm", effect:{time:30}},
    {t:"选《高等炼金术》", effect:{flag:"course_alch", skillUp:"炼金术"}, go:"academy_year1_midterm", effect:{time:30}},
    {t:"选《剑道精义》", effect:{flag:"course_sword", skillUp:"剑术"}, go:"academy_year1_midterm", effect:{time:30}},
    {t:"选《外交与谈判》", effect:{flag:"course_diplomacy", skillUp:"辩才"}, go:"academy_year1_midterm", effect:{time:30}},
    {t:"选《古代史与遗迹》", effect:{flag:"course_history", skillUp:"古代知识"}, go:"academy_year1_midterm", effect:{time:30}}
  ]
};}


  nodes["academy_roommate"] = function(){ return {
  text:function(){var base=["宿舍门被推开了。你的室友走了进来——"];
  var roommates=["塞西莉亚·星辉（天才魔法师，表情冷淡）","耗子（贫民窟出身的盗贼，笑嘻嘻的）","玛丽·虔诚（善良的牧师，抱着一堆圣典）","亚瑟·龙裔（沉默的战士，背着一把大剑）"];
  var r=roommates[Math.floor(Math.random()*roommates.length)];
  base.push(r+"。你们对视了一眼，然后各自开始收拾东西。");
  base.push("接下来的几年，你们将住在同一个房间。这个人，可能会成为你最好的朋友，也可能成为最大的对手。");
  base.unshift("宿舍在学院西楼三层，走廊尽头倒数第二间。钥匙有些锈，你拧了两下，锁舌才不甘心地缩回去。");base.unshift("门开了。屋子不大：两张床，两扇窗，一个掉了漆的旧衣柜，窗台上摆着一盆快枯萎的绿萝。空气里有木蜡油和旧书页的味道，混着一股淡淡的、说不清来处的气息。");base.unshift("你放下行李，往床上一坐，床板立刻发出一声悠长的吱呀。窗外是学院的操场，几名学生正在晨跑，再远处，钟楼的尖顶刺破晨雾，一群白鸽绕着钟楼盘旋。");base.unshift("你看着窗外，忽然有些恍惚。从今天起，这里就是你的家了——至少是接下来好几年的落脚处。");base.unshift("你想起离开家乡那天，亲人在城门口对你挥手，风把他们的呼喊声撕得支离破碎。你当时没有回头，现在却忽然有些后悔，想再听一声那样的呼喊。");base.unshift("走廊里传来脚步声，还有压低的说话声和笑声。越来越近，越来越响。");base.unshift("你站起身，整了整衣领，又摸了摸别在胸口的旧物——那是离家时带着的，贴身放着，谁都没告诉。");base.unshift("脚步声在门口停住了。门把手发出转动的轻响。");base.unshift("你深吸一口气，露出一个尽量自然的微笑，抬头看向门口——");return base;} /*v45inj:academy_roommate*/,
  options:[
    {t:"主动打招呼（魅力）", check:{attr:"CHA", label:"魅力·社交", target:50},
      tier:{ok:function(){return[pickV(["你主动打招呼，室友的表情缓和了一些。你们聊了一会儿，发现彼此有不少共同点。◆室友好感+20","你用一个幽默的笑话打破了僵局，室友笑了。◆室友好感+15"],"roommate_ok")]},
      fail:function(){return[pickV(["你的搭讪太尴尬了，室友只是点了点头就继续收拾东西。◆室友好感+0","你说错了话，室友皱了皱眉。◆室友好感-5"],"roommate_fail")]}},
      go:"academy_year1_midterm", effect:{time:7}},
    {t:"默默收拾，保持距离", go:"academy_year1_midterm", effect:{flag:"roommate_distant", time:7}}
  ]
};}


  nodes["academy_year1_midterm"] = function(){ return {
  text:["时间过得很快。期中考试来了。图书馆里座无虚席，每个人都在临时抱佛脚。你也不例外——面前堆着半人高的书，你叹了口气，开始复习。", "考前一晚的图书馆，灯亮到很晚。你坐在角落，面前摊着三本书，一本都没看进去。对面的姑娘已经趴在桌上睡着了，笔还握在手里。", "有人端着热茶走过，杯底在桌面上磕出轻响。角落里有人在背咒文，声音压得很低，像在念给谁听。你听见窗外的巡夜教授咳嗽了一声，脚步声由远及近，又由近及远。", "你翻了翻笔记，发现白天划的重点，有一半你根本不记得。你盯着那几行字，忽然觉得它们变成了陌生的符号。", "你没有慌。你只是把笔记合上，去窗边站了一会儿。月亮很圆，照在钟楼的尖顶上，像镀了一层霜。", "你回座位，重新翻开第一页。这一次，你一个字一个字地读。窗外，巡夜教授的脚步声又响起来，这一次，你没有抬头。"] /*v45inj:academy_year1_midterm*/,
  options:[
    {t:"认真复习（智力）", check:{attr:"INT", label:"智力·复习", target:55},
      tier:{crit:function(){return[pickV(["你过目不忘，所有知识点都刻在了脑子里。考试对你来说像散步一样轻松。◆期中S级，智力+1","你不仅复习完了所有内容，还自己推导了几个新的公式。◆期中S级，获得教授赞赏"],"mid_crit")]},
      ok:function(){return[pickV(["你复习得很扎实，大部分内容都掌握了。◆期中A级","你抓住了重点，虽然有些细节不太清楚。◆期中B级"],"mid_ok")]},
      fail:function(){return[pickV(["你复习了，但效率不高。很多内容还是模模糊糊。◆期中C级","你大部分时间都在走神，书翻了几页就看不进去了。◆期中D级"],"mid_fail")]},
      critfail:function(){return[pickV(["你根本没复习，一直在玩。考试时一道题都不会。◆期中F级，警告一次","你复习错了范围，考的全没看，看的全没考。◆期中F级，需要期末扳回"],"mid_cf")]}},
      go:"academy_year1_final", effect:{time:30}},
    {t:"找同学帮忙补习（魅力）", check:{attr:"CHA", label:"魅力·求助", target:50},
      go:"academy_year1_final", effect:{time:30}},
    {t:"熬夜突击（体力）", check:{attr:"CON", label:"体质·熬夜", target:45},
      go:"academy_year1_final", effect:{time:30}}
  ]
};}


  nodes["academy_year1_final"] = function(){ return {
  text:["期末考试结束了。你走出考场，阳光刺眼。一个学期就这样过去了。成绩几天后出来——但现在，你只想好好睡一觉。", "走出考场的时候，阳光刺眼。有人在楼梯口对答案，争得面红耳赤；有人蹲在花坛边，一脸空白；还有人在笑——笑得很大声，像是要把整个学期的紧张都笑出去。", "你穿过人群，听见食堂那边传来饭香。萝卜炖肉的味，混着一点焦糊。你忽然觉得饿，饿得厉害。", "你排在打饭的队伍里，前面的人回过头，是你室友。他冲你晃了晃饭盒：「考完了？走走走，今天加个菜。」", "你端着饭，坐在他旁边。食堂的窗开着，风从外面灌进来，吹得他额前的头发乱飞。他扒了一口饭，含含糊糊地说：「下学期……我可能得住远点了。」", "你没有问他为什么。他也没有再说。你们低头吃饭，钟楼的钟响了一下，又一下。日子就是这样，一学期一学期地过去，有人走，有人留，饭还是要吃。"] /*v45inj:academy_year1_final*/,
  options:[
    {t:"查看期末成绩", go:"academy_year1_grades", effect:{time:3}},
    {t:"直接去享受假期", go:"academy_vacation_y1", effect:{time:1}}
  ]
};}


  nodes["academy_year1_grades"] = function(){ return {
  text:function(){var base=["你在公告栏找到了自己的成绩。"];
  var g=S.flags.year1_grade||"B";
  base.push("第一学年综合评价："+g+"级。");
  if(g=="S") base.push("你是年级第一！奖学金到账，教授们都在讨论你。");
  if(g=="A") base.push("优秀。你获得了小额奖学金。");
  if(g=="D") base.push("及格线边缘。你被警告了——再这样下去要留级。");
  if(g=="F") base.push("不及格。你必须在暑期补课，否则留级。");
  base.push("公告栏的木框上钉着一排成绩单，风一吹，纸角轻轻翻动。你的名字印在中间偏上的位置——第一学年综合评价：B级。");base.push("");base.push("你站在公告栏前，把那个字母看了三遍。旁边贴着一张旧告示，边角已经卷起，是上学期末的奖学金名单。你想起这一年的日子：图书馆闭馆的钟声、宿舍夜谈的笑声、还有那些熬夜背咒文的夜晚。");base.push("");return base;},
  options:[
    {t:"开始暑假", go:"academy_vacation_y1", effect:{time:1}}
  ]
};}


  nodes["academy_vacation_y1"] = function(){ return {
  text:["暑假来了。两个月的自由时间。你可以选择怎么度过——这会影响你的属性、关系和接下来的剧情。", "放假那天，宿舍空得不像话。室友的床已经空了，桌上那只缺口的木杯还留着。他走得急，连窗台上的小字都没来得及擦。", "你收拾行李的时候，在床缝里摸出一封信——是母亲寄来的，压在枕头底下，你一直没拆。你拆开，纸很薄，字很小，写的是家里的收成，和村口新开了一家杂货铺。", "最后一行字，墨迹有点晕：「路远，多吃饭。别太省钱。」你把信折好，收进怀里。", "你站在窗前，看了一会儿空荡荡的广场。蝉在叫，叫得人心烦。学院像一个暂时睡着的人，你不想打扰它。", "你拎起行李，锁上门。走到楼下，又回头看了一眼那扇窗。窗台上，那行小字在阳光里若隐若现：「此间一住，莫问来处。」"] /*v45inj:academy_vacation_y1*/,
  options:[
    {t:"回家探亲", go:"vacation_home", effect:{time:30}},
    {t:"留校研究（跟教授做课题）", check:{attr:"INT", label:"智力·研究", target:50},
      go:"vacation_research", effect:{time:30}},
    {t:"去旅行（初步体验大陆）", go:"vacation_travel", effect:{time:30}},
    {t:"打工赚钱", go:"vacation_work", effect:{time:30}},
    {t:"和同学一起度假", go:"vacation_friends", effect:{time:30}}
  ]
};}


  nodes["academy_year2_open"] = function(){ return {
  text:["第二学年·专业年。你回到了学院，感觉自己不一样了——不再是那个懵懂的新生。你有了选课的经验，有了认识的同学，有了属于自己的位置。但这一年，事情开始变得复杂。派系斗争浮出水面，净化令的阴影正在逼近。", "回到学院的那天，城门外的老槐树落了满地的黄叶。你拖着行李走过广场，门房的老头抬头看你一眼，又低下头：「回来了？长高了。」", "宿舍还是老样子。窗台上那行小字还在，你伸手摸了摸，笔画比去年深了些——像是被人描过。室友的床上摊着一件新袍子，学院发的，袖口绣着银线。", "你把行李放下，推开窗。钟楼还在，广场还在，只是楼下走过的人，换了一批生面孔。去年的几个熟脸，不知去了哪里。", "课表发下来了。专业课多了三门，名字一个比一个长。你在「灵魂魔法通论」下面划了一道线——这门课的老师，据说是个很难缠的老头。", "你把课表折好，收进怀里。新的一学年，新的麻烦。你站在窗前，看了一会儿，转身收拾床铺。"] /*v45inj:academy_year2_open*/,
  options:[
    {t:"选择专业方向", go:"academy_major", effect:{time:1}},
    {t:"加入一个派系", go:"academy_faction_join", effect:{time:1}},
    {t:"参加学生会选举", go:"academy_election", effect:{time:1}},
    {t:"继续正常上课", go:"academy_year2_midterm", effect:{time:30}}
  ]
};}


  nodes["academy_major"] = function(){ return {
  text:["专业方向选择。这决定了你未来两年的课程重点和毕业去向。你站在选择面前，认真思考。","选专业的表就摆在教务处桌上，纸张厚实，抬头印着学院的纹章。教务长把笔递给你时，眼神里带着点说不清的东西：“想好了再填。这一笔下去，你未来两年的课程、导师、甚至毕业去向，都在上面了。”","","你握着笔，笔尖悬在纸面上方。窗外，操场上传来训练的口号声；走廊里，几个高年级生正抱着厚厚的研究资料走过。你听见自己的心跳。","","第一栏写着：战斗专精——战士/盗贼，适合刀口舔血的人。第二栏：魔法研究——魔法师/灵魂法师，适合在书斋里泡一辈子的人。你想起自己这些年的路，想起那些为你挡过刀、递过书的人。笔尖落了下去。",""],
  options:[
    {t:"战斗专精（战士/盗贼）", effect:{flag:"major_combat", skillUp:"战斗"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"魔法研究（魔法师/灵魂法师）", effect:{flag:"major_magic", skillUp:"魔法"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"神圣之道（牧师）", effect:{flag:"major_holy", skillUp:"神圣"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"商业与贸易（商人）", effect:{flag:"major_trade", skillUp:"商业"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"炼金与工艺（术士）", effect:{flag:"major_alch", skillUp:"炼金"}, go:"academy_year2_midterm", effect:{time:1}}
  ]
};}


  nodes["academy_faction_join"] = function(){ return {
  text:["学院里有六大派系，每一个都在招募新人。他们在食堂、在宿舍、在课堂后拦住你，用各种方式游说。加入一个派系，意味着获得资源和保护，但也意味着选边站。"],
  options:[
    {t:"加入光明派（教会支持）", effect:{flag:"faction_light", rep:10}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"加入自由派（学术自由）", effect:{flag:"faction_freedom", rep:5}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"加入保守派（传统维护）", effect:{flag:"faction_conservative"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"加入革新派（改革派）", effect:{flag:"faction_reform"}, go:"academy_year2_midterm", effect:{time:1}},
    {t:"不加入任何派系（中立）", effect:{flag:"faction_neutral"}, go:"academy_year2_midterm", effect:{time:1}}
  ]
};}


  nodes["academy_year2_midterm"] = function(){ return {
  text:function(){var base=["第二学年期中考试。难度明显提升了——不再是基础题，而是需要真正的理解和应用。你感到了压力。"];
  if(S.flags.faction_light) base.push("光明派的人在看你——他们希望你在考试中证明自己的价值。");
  if(S.flags.faction_freedom) base.push("自由派的同学给你递了小抄——用不用，你自己决定。");
  return base;},
  options:[
    {t:"认真考试（智力）", check:{attr:"INT", label:"智力·考试", target:55},
      tier:{crit:function(){return[pickV(["你下笔如有神助，每一道题都答得完美。监考教授都忍不住多看了你几眼。◆期中S级","你不仅答完了题，还指出了题目中的一个错误。教授又惊又喜。◆期中S级，智力+1"],"y2mid_crit")]},
      ok:function(){return[pickV(["你稳扎稳打，大部分题都答对了。◆期中A级","你发挥正常，成绩不错。◆期中B级"],"y2mid_ok")]},
      fail:function(){return[pickV(["题目太难了，你有一半都不确定。◆期中C级","你复习偏了方向，很多题都不会。◆期中D级"],"y2mid_fail")]}},
      go:"academy_year2_purge", effect:{time:30}},
    {t:"用小抄作弊（敏捷）", check:{attr:"AGI", label:"敏捷·作弊", target:60},
      tier:{ok:function(){return[pickV(["你小心翼翼地翻着小抄，没有被发现。成绩应该不错。◆期中A级，但有被发现的风险","你作弊技术高超，连监考教授都没察觉。◆期中S级，但良心不安"],"cheat_ok")]},
      fail:function(){return[pickV(["你被抓了。小抄被没收，成绩作废，还被记了大过。◆期中F级，记过一次","你紧张得手发抖，小抄掉在了地上。◆期中F级，光明派开始关注你"],"cheat_fail")]}},
      go:"academy_year2_purge", effect:{time:30}}
  ]
};}


  nodes["academy_year2_purge"] = function(){ return {
  text:["净化令来了。教会的审判骑士团进驻了学院，开始清查「异端」。灵魂魔法、深渊研究、古代禁忌——一切被教会视为危险的知识都在清查之列。你的同学一个个被带走审问。空气里弥漫着恐惧。你该怎么办？"],
  options:[
    {t:"保护被清查的同学（魅力/勇气）", check:{attr:"CHA", label:"魅力·庇护", target:60},
      tier:{crit:function(){return[pickV(["你站了出来，用严密的逻辑和雄辩的口才说服了审判骑士。他们放过了你的同学，甚至对你刮目相看。◆保护成功，同学好感+30，教会关注+10","你用一个巧妙的计策把同学藏了起来，审判骑士扑了个空。◆保护成功，获得地下声望"],"purge_crit")]},
      ok:function(){return[pickV(["你尽力周旋，虽然没能完全保护同学，但减轻了他的处罚。◆部分成功，同学好感+15","你提供了不在场证明，同学被释放了。◆保护成功"],"purge_ok")]},
      fail:function(){return[pickV(["你的努力没有用，同学还是被带走了。他看你的眼神里带着失望。◆保护失败，同学好感-10","你反而被怀疑了，审判骑士开始调查你。◆被怀疑，教会关注+15"],"purge_fail")]},
      critfail:function(){return[pickV(["你不仅没保护同学，还因为言辞不当被一起带走审问。◆被拘留3天，SAN-5","你的庇护行为被揭发，你被列为「异端同情者」。◆净化令黑名单，后续剧情恶化"],"purge_cf")]}},
      go:"academy_year2_final", effect:{time:15}},
    {t:"配合教会清查（安全但失去朋友）", effect:{flag:"purge_cooperate", rep:-10}, go:"academy_year2_final", effect:{time:15}},
    {t:"暗中反抗（加入地下组织）", check:{attr:"AGI", label:"敏捷·潜入", target:55},
      go:"academy_year2_final", effect:{flag:"purge_resist", time:15}},
    {t:"明哲保身，什么都不做", go:"academy_year2_final", effect:{time:15}}
  ]
};}


  nodes["academy_year2_final"] = function(){ return {
  text:["第二学年结束了。净化令的阴影还没散去，但至少期末考试结束了。你看着成绩单，思考着这一年的得失。明年，事情会更复杂。","第二学年的最后一天，教室里空了大半。考试早散了，学生们三三两两收拾东西，商量着暑假的去向。你站在窗边，看楼下的梧桐被风吹得沙沙响。","","净化令的阴影还没散——食堂里有人压低声音议论北边的消息，说着说着，又都住了口。你把这些话听进耳朵，没有接茬。","","成绩单已经发下来了。你把它叠好，收进怀里。明年，事情会更复杂——你心里清楚，这座学院的平静，是借来的。",""],
  options:[
    {t:"查看成绩", go:"academy_year2_grades", effect:{time:2}},
    {t:"开始暑假", go:"academy_vacation_y2", effect:{time:1}}
  ]
};}


  nodes["academy_year3_open"] = function(){ return {
  text:["第三学年·实践年。你已经是学院里的老人了。但这一年，学院里发生了一件大事——一个学生失踪了。最后一次有人看到他，是在禁书区附近。官方说是「私自离校」，但你知道事情没那么简单。学院暗流，开始涌动。", "失踪学生的告示，贴在布告栏最中间。纸角被风掀起一角，又被人用钉子重新钉好。路过的人看一眼，摇摇头，走开。", "食堂里，有人在低声议论：「禁书区那扇门，锁了两道铁链，他怎么进去的？」「谁知道呢。听说连教授都不愿提。」", "你端着饭坐下，邻桌的人立刻住了嘴。你看他们一眼，没说话。有些话，听到就行，不必追问。", "下午你去图书馆，路过禁书区。铁链还在，锁是新的。你站在门口，没有停留太久——但你把那扇门的样子，记在了心里。", "走廊尽头，你看见寻人启事上那个学生的脸。他还那么年轻，照片里的笑，像是下一秒就要开口说话。", "你把目光移开。有些事，不是你现在能碰的。但你在心里记下了一个日期，和一条走廊。"] /*v45inj:academy_year3_open*/,
  options:[
    {t:"调查学生失踪案（主线）", go:"academy_missing_investigate", effect:{time:3}},
    {t:"选择导师，开始独立研究", go:"academy_mentor", effect:{time:1}},
    {t:"参加五院对抗赛", go:"academy_tournament", effect:{time:1}},
    {t:"正常上课，不惹麻烦", go:"academy_year3_midterm", effect:{time:30}}
  ]
};}


  nodes["academy_missing_investigate"] = function(){ return {
  text:["你开始调查失踪案。失踪的学生叫该隐·暗月——一个优雅迷人的高年级学生，是很多人的偶像。但你在调查中发现，他的身份远比表面复杂。你来到了禁书区门口。"],
  options:[
    {t:"潜入禁书区（敏捷）", check:{attr:"AGI", label:"敏捷·潜入", target:60},
      tier:{crit:function(){return[pickV(["你像影子一样溜进了禁书区。在最里面的书架上，你发现了一本被翻动过的书——《深渊召唤术》。书页里夹着一张纸条，上面写着一个地址和一个时间。◆获得关键线索：暗蚀会支部地址","你不仅找到了线索，还发现了一个隐藏的地下室入口。地下室里有祭坛和仪式痕迹。◆获得关键线索：暗蚀会在学院有支部"],"missing_crit")]},
      ok:function(){return[pickV(["你找到了一些线索——失踪学生的借书记录显示他最近在研究深渊相关的书籍。◆获得线索：深渊研究","你发现了一些可疑的痕迹，但没有确凿证据。◆获得部分线索"],"missing_ok")]},
      fail:function(){return[pickV(["你差点被图书管理员发现，只好撤退。什么都没找到。◆未获得线索","你找到了禁书区，但里面的东西都被人提前清理了。◆线索被销毁"],"missing_fail")]},
      critfail:function(){return[pickV(["你被发现了！图书管理员吹响了哨子，你被记了大过。◆记过一次，禁书区被加强守卫","你触发了禁书区的魔法陷阱，受了伤还被发现。◆受伤，被审问"],"missing_cf")]}},
      go:"academy_missing_clue", effect:{time:1}},
    {t:"询问失踪学生的朋友（魅力）", check:{attr:"CHA", label:"魅力·询问", target:55},
      go:"academy_missing_clue", effect:{time:2}},
    {t:"报告教授（安全但可能被灭口）", go:"academy_missing_report", effect:{time:1}}
  ]
};}


  nodes["academy_missing_clue"] = function(){ return {
  text:function(){var base=["你掌握了一些线索。所有的证据都指向一个方向——暗蚀会。他们在学院里有一个秘密支部，招募有才华但不满现状的学生。失踪的学生该隐，就是支部的负责人。但你还不确定该怎么做——揭发？加入？还是利用？"];
  if(S.flags.eclipse_evidence) base.push("你有确凿的证据。是时候做决定了。");
  return base;},
  options:[
    {t:"揭发暗蚀会支部（光明派/教会路线）", check:{attr:"CHA", label:"魅力·揭发", target:60},
      tier:{ok:function(){return[pickV(["你把证据交给了教会审判骑士。他们连夜行动，端掉了暗蚀会支部。该隐被逮捕，你成了学院的英雄。◆揭发成功，教会声望+30，暗蚀会敌意+50","你的揭发引起了重视，但暗蚀会提前得到风声，大部分人都跑了。该隐失踪。◆部分成功，暗蚀会敌意+30"],"expose_ok")]},
      fail:function(){return[pickV(["你的证据不够充分，反而被暗蚀会反咬一口。你被怀疑是在诬陷同学。◆揭发失败，声望-10","教会不相信你，认为你是在搞派系斗争。◆揭发失败"],"expose_fail")]}},
      go:"academy_year3_aftermath", effect:{time:7}},
    {t:"加入暗蚀会支部（地下/反派路线）", check:{attr:"SPR", label:"灵性·意志", target:50},
      go:"academy_eclipse_join", effect:{time:3}},
    {t:"利用暗蚀会为自己谋利（灰色路线）", go:"academy_eclipse_exploit", effect:{time:3}},
    {t:"把证据交给墨丘利（守望者路线）", go:"academy_mercury_report", effect:{time:1}}
  ]
};}


  nodes["academy_mercury_report"] = function(){ return {
  text:["你敲开了墨丘利研究室的门。他听你说完，沉默了很久。然后他摘下眼镜，擦了擦，轻声说：「你比我想象的要勇敢。」他走到书架前，按了一下——书架移开了，露出一扇暗门。「跟我来。有些事，你该知道了。」","墨丘利教授的书房里堆满了书，从地板摞到天花板，只在窗边留出一张窄桌。他听你说完，摘下眼镜，用袖子擦了擦，又戴上，来回擦了三遍。","","“你比我想象的要勇敢。”他说。窗外有风，吹得书页哗哗响。他走到书架前，手指在一本书的背脊上停了停——那里有一道几乎看不出的划痕。他按下去，书架无声地滑开，露出后面一道窄门。","","门里透出昏黄的光。他侧身让开，看着你：“进来吧。有些事，你迟早要知道——早一天知道，你就能多活一天。”",""],
  options:[
    {t:"跟随墨丘利进入暗门", go:"watchers_reveal", effect:{flag:"watcher_path", time:1}},
    {t:"太危险了，先离开", go:"academy_year3_aftermath", effect:{time:1}}
  ]
};}


  nodes["academy_career"] = function(){ return {
  text:function(){var base=["根据你的成绩、派系、关系和境界，你有以下毕业去向："];
  if(S.flags.final_grade=="S") base.push("【优秀毕业生】各大势力争相招揽你。");
  if(S.flags.faction_light) base.push("→ 教会审判骑士团（光明派推荐）");
  if(S.flags.faction_freedom) base.push("→ 自由冒险者/学院留校（自由派推荐）");
  if(S.flags.watcher_path) base.push("→ 守望者正式成员（墨丘利推荐）");
  if(S.flags.eclipse_path) base.push("→ 暗蚀会正式成员（该隐推荐）");
  base.push("→ 自由冒险者（默认）");
  base.push("→ 留校任教/继续研究（学术路线）");
  base.push("职业选择的那天，你坐在一间小教室里，面前摊着七份卷轴。");base.push("每一份卷轴上都写着一条路的名字，和这条路将通向的地方。你一个一个看过去，看得很慢。");base.push("你知道，选了剑，就要习惯握剑的手上永远有茧；选了法杖，就要习惯一个人面对那些常人看不见的东西；选了医术，就要习惯看着有些人离开，而你无能为力。");base.push("门外传来其他学生讨论的声音，笑闹着，很轻松。可你知道，这份卷轴，不轻松。");base.push("你把手放在其中一份卷轴上。羊皮纸凉凉的，像水，像一条等你踏入的河。");base.push("你展开它。然后你走出去，对等在门外的教授说：「我选好了。」");base.push("你走出教学楼的时候，天正好放晴。阳光落下来，你忽然觉得，脚下的路，前所未有的清晰。");return base;} /*v45inj:academy_career*/,
  options:[
    {t:"加入大势力（根据推荐）", go:"post_academy_faction", effect:{time:1}},
    {t:"成为自由冒险者", go:"city_free", effect:{flag:"graduate_adventurer", time:1}},
    {t:"留校任教", go:"post_academy_teacher", effect:{time:1}},
    {t:"继续深入研究（学术路线）", go:"post_academy_research", effect:{time:1}}
  ]
};}


  nodes["academy_farewell"] = function(){ return {
  text:["你和同学们一一告别。塞西莉亚骄傲地说要成为大陆最伟大的魔法师。耗子攥着你的手说以后在道上混报他的名字。玛丽含着泪给了你一个祝福。亚瑟拍了拍你的肩膀，什么都没说。这些人，你以后还会再见到——也许是盟友，也许是敌人。","学院大门外，梧桐正落着叶子。塞西莉亚先走的，她头也没回，只把手举过头顶挥了挥——可你知道，她眼眶红过。","","耗子磨蹭到最后，把一块磨得发亮的木牌塞进你手里：“道上要是有难处，报我的名。报不上也没事，提一嘴‘学院那帮人’也行。”说完他笑着跑了，跑出老远才回头看你一眼。","","你站在原地，看他们的背影一个个消失在路尽头。风把地上的梧桐叶卷起来，又放下。你忽然明白，这五年是真的结束了——从今天起，你要一个人走进这个大陆了。",""],
  options:[
    {t:"离开学院，踏入大陆", go:"city_free", effect:{flag:"academy_complete", time:1}}
  ]
};}



  nodes["academy_year_events"] = function(){ return {
  text:function(){var base=["本学年学院事件："];
  if(!S.flags.year_events) {
    // 随机抽取3-5个事件
    var pool=[];
    for(var k in ACADEMY_EVENTS_POOL) {
      var e=ACADEMY_EVENTS_POOL[k];
      if(e.year.indexOf(S.flags.academic_year||1)>=0) pool.push(e);
    }
    var shuffled=pool.sort(function(){return Math.random()-0.5;});
    var count=3+Math.floor(Math.random()*3);
    S.flags.year_events=[];
    for(var i=0;i<Math.min(count,shuffled.length);i++) {
      S.flags.year_events.push(shuffled[i].id);
      base.push("· "+shuffled[i].name+"："+shuffled[i].desc);
    }
  } else {
    for(var j=0;j<S.flags.year_events.length;j++) {
      var ev=ACADEMY_EVENTS_POOL[S.flags.year_events[j]];
      if(ev) base.push("· "+ev.name+"："+ev.desc);
    }
  }
  base.push("你可以选择关注哪个事件。");
  base.push("学院大厅的告示栏前围了一圈人。你挤进去，看到本学年的几件大事被红笔圈了出来：学术竞赛、社团招新、还有一条措辞含糊的“区域异常通报”。");base.push("");base.push("旁边贴着一张小字条，不知是谁写的：“禁书区附近最近不太平，晚上别一个人走那边。”字迹潦草，落款处只有一朵画得很丑的小花。");base.push("");base.push("你撕下字条，折好收进口袋。告示栏的风又吹过来，纸页哗啦啦响——这座学院，从来不缺热闹，也从来不缺秘密。");base.push("");return base;},
  options:[
    {t:"查看事件详情", go:"academy_event_detail", effect:{time:0}},
    {t:"继续正常学习", go:"academy_year1_midterm", effect:{time:30}}
  ]
};}


  nodes["academy_event_detail"] = function(){ return {
  text:function(){var ev=ACADEMY_EVENTS_POOL[S.flags.year_events[0]];
  if(!ev) return ["没有活跃事件。","布告栏上，最新的告示被红漆笔圈了出来。你凑近看——是关于学院里最近发生的异事的通报，措辞含糊，只说“正在调查，请同学们保持秩序”。","","你站在告示前，听见身后两个学生在低声说话：“听说禁区那扇门，半夜自己开了。”“嘘——别乱说，当心被记过。”他们看见你，立刻住口，快步走开了。","","你再次看向那则告示。纸角被风吹起又落下，像有什么话，想说又没说出口。",""];
  return ["【"+ev.name+"】", ev.desc, "你打算怎么做？"];},
  options:[
    {t:"介入事件", check:{attr:"CHA", label:"魅力·介入", target:55},
      tier:{ok:function(){return[pickV(["你成功介入了事件，获得了关键信息。◆获得事件线索，声望+5","你的介入改变了事件走向，有人感激你，有人怨恨你。◆事件走向改变"],"event_ok")]},
      fail:function(){return[pickV(["你的介入没有起到作用，事件继续发展。◆无明显效果","你越帮越忙，事件恶化了。◆事件恶化，声望-5"],"event_fail")]}},
      go:"academy_event_outcome", effect:{time:3}},
    {t:"暗中观察", effect:{flag:"event_observe"}, go:"academy_event_outcome", effect:{time:3}},
    {t:"无视事件", go:"academy_year1_midterm", effect:{time:30}}
  ]
};}


  nodes["academy_facilities"] = function(){ return {
  text:["学院设施一览。你可以去不同的设施，触发不同的功能和事件。","学院的设施分布图挂在主楼大厅的墙上，用不同颜色的图钉标着。你站在图前，盘算着今天去哪里。","","教学楼的方向传来下课的钟声，学生们鱼贯而出，走廊里一下子热闹起来；图书馆的尖顶在树梢间露出，那里永远安静；竞技场那边，隐约有兵刃碰撞的脆响。","","你伸手，在图上的几处点了点。每一点，都是一扇门——门后面，是不同的路。",""],
  options:[
    {t:"教学楼（上课）", go:"facility_classroom", effect:{time:1}},
    {t:"图书馆（借书/研究）", go:"facility_library", effect:{time:1}},
    {t:"竞技场（决斗/训练）", go:"facility_arena", effect:{time:1}},
    {t:"宿舍（休息/室友）", go:"facility_dorm", effect:{time:1}},
    {t:"食堂（吃饭/社交）", go:"facility_cafeteria", effect:{time:1}},
    {t:"医务室（治疗）", go:"facility_infirmary", effect:{time:1}},
    {t:"商店街（购物）", go:"facility_shop", effect:{time:1}},
    {t:"炼金实验室（炼药）", go:"facility_alchemy", effect:{time:1}},
    {t:"返回", go:"academy_year1_open", effect:{time:0}}
  ]
};}


  nodes["academy_quests"] = function(){ return {
  text:["学院告示板上贴着各种委托。你可以接取任务赚取金钱和声望。","学院告示板上贴满了委托，层层叠叠，风一吹就哗哗响。你挤进人群，一张一张看过去。","","第一张：“教授研究助手——整理文献，抄写资料。报酬：银币若干，附赠一顿食堂餐。”落款是元素塔的某个教授。旁边一张：“同学求助——搬运教材，打扫实验室。报酬：一顿烤肉。”还有一张，字迹潦草：“寻找丢失的宠物猫——它叫‘陛下’，见到请送到宿舍区。”","","你撕下一张，折好收进口袋。告示板上空了一块，很快又被新的贴上。这座学院，每天都有干不完的活计，和用不完的琐碎日子。",""],
  options:[
    {t:"教授研究助手（难度1）", effect:{gold:10, flag:"quest_research"}, go:"quest_research", effect:{time:5}},
    {t:"同学求助（难度1）", effect:{gold:5, flag:"quest_classmate"}, go:"quest_classmate", effect:{time:3}},
    {t:"辅导低年级（难度1）", effect:{gold:5, flag:"quest_tutor"}, go:"quest_tutor", effect:{time:3}},
    {t:"活动工作人员（难度1）", effect:{gold:10, flag:"quest_event"}, go:"quest_event", effect:{time:3}},
    {t:"秘密调查（难度3，需特定条件）", effect:{gold:30, flag:"quest_secret"}, go:"quest_secret", effect:{time:5}},
    {t:"离开告示板", go:"academy_year1_open", effect:{time:0}}
  ]
};}


  nodes["academy_political"] = function(){ return {
  text:function(){var base=["当前学院政治格局："];
  var snaps=POLITICAL_SNAPSHOTS[S.flags.academy_choice]||POLITICAL_SNAPSHOTS.elda_magic;
  var idx=Math.floor(Math.random()*snaps.length);
  if(!S.flags.political_state) S.flags.political_state=snaps[idx].state;
  var snap=null;
  for(var i=0;i<snaps.length;i++){if(snaps[i].state==S.flags.political_state){snap=snaps[i];break;}}
  if(snap){base.push(snap.state+"："+snap.effect);}
  base.push("你可以选择介入政治，或者保持中立。");
  base.push("学院的权力棋盘上，各方势力犬牙交错。院长一系的保守派主张维持现状，教授会里的改革派想动一动旧规矩，学生自治会的新生力量则在一旁虎视眈眈。");base.push("");base.push("你站在走廊里，看两边的人各自聚集，低声交谈。有人看见你，点了点头，又别过头去。你知道，在这张棋盘上，站队要趁早，可站错队的代价也最重。");base.push("");return base;},
  options:[
    {t:"支持当前格局", effect:{flag:"political_support", rep:5}, go:"academy_year1_open", effect:{time:1}},
    {t:"暗中活动，试图改变格局", check:{attr:"CHA", label:"魅力·政治", target:60},
      go:"academy_year1_open", effect:{time:3}},
    {t:"保持中立", go:"academy_year1_open", effect:{time:0}}
  ]
};}


  nodes["academy_start"] = function(){ return {
  place:"学院门口",
  text:function(){
    var school = S.flags.school_elda ? "艾尔达魔法学院" :
                 S.flags.school_chengtian ? "承天书院" :
                 S.flags.school_holy ? "圣光神学院" :
                 S.flags.school_silverleaf ? "银叶学院" :
                 S.flags.school_forge ? "熔炉学院" :
                 S.flags.school_watcher ? "守望者秘密学院" : "艾尔达魔法学院";
    return ["你终于到了。",school+"的大门就在眼前。","你深吸一口气，走了进去。","新的生活开始了。","（学院线开发中，敬请期待。当前可通过城市自由探索继续游戏。）"];
  },
  options:[
    {t:"进入学院", effect:{time:1}, go:"city_free"},
    {t:"先在城里逛逛", effect:{time:0}, go:"city_free"}
  ]
};}



  nodes["academy_year1_opening"] = function(){ return {
  place:"学院礼堂",
  text:["开学典礼。","学院的大礼堂里，坐满了人。五百多名新生，穿着统一的白色长袍，坐在长椅上，叽叽喳喳地聊着天。","你坐在第三排，艾伦坐在你旁边。他正在和旁边的一个红发女孩聊天，笑得很开心。","你环顾四周。大礼堂的天花板很高，上面画着一幅巨大的壁画——黄林晶加固七印的场景。壁画上的黄林晶，穿着白色的长袍，手里举着一盏灯，脚下是七道封印。","「肃静！」一个声音从讲台上传来。","礼堂里瞬间安静了下来。一个老人站在讲台上，他穿着深红色的长袍，头发全白了，脸上的皱纹很深。他的眼睛很亮，像是两颗星星。","「我是院长，西奥多。」他说，声音在礼堂里回荡，「欢迎来到艾尔达魔法学院。」","「在这里，你们将学习魔法，学习知识，学习如何成为一个对社会有用的人。」","「但我要先告诉你们——学院不是天堂。在这里，你们会遇到困难，会遇到挫折，会遇到你们想象不到的危险。」","「学院的表面，是风平浪静的。因为有强者镇压。但水面下，暗流涌动。」","「你们要学会保护自己，学会辨别是非，学会……在这个复杂的世界里，找到自己的位置。」","他的目光扫过全场，最后停在了你的身上。他的眼睛里，闪过一丝意味深长的光芒。","「现在，我宣布——艾尔达魔法学院，新学年，正式开始！」","掌声雷动。","典礼结束后，你和艾伦一起走出了大礼堂。阳光洒在你们身上，温暖而明亮。","「院长说的『暗流涌动』是什么意思？」你问艾伦。","艾伦耸了耸肩：「谁知道呢。也许是吓唬我们的吧。」","但你知道，不是。你能感觉到——学院里，确实有一些不对劲的地方。比如，有些教授的眼神，总是在躲闪；比如，有些学生，总是在深夜里偷偷摸摸地出门；比如，图书馆的禁书区，总是有灯光亮着。","这些细节，别人可能不会注意。但你注意到了。","「走吧。」艾伦拍了拍你的肩膀，「去吃饭。我听说食堂的烤鸡特别好吃。」","你点了点头，跟着他朝食堂走去。","但你心里知道，这五年的学院生活，不会像表面看起来那么平静。","而你，已经被卷入了水面下的暗流。"],
  options:[
    {t:"记住校长的话", effect:{time:1,flag:"academy_warning"}, go:"academy_year1_main"},
    {t:"观察周围的同学", check:{a:"INT",sk:"观察",label:"智力·观察",target:50},
      tier:{
        crit:function(){return[pickV(["你仔细观察了周围的同学，发现了一些有趣的人：一个眼神锐利的贵族少年，一个沉默寡言的精灵女孩，一个看起来很紧张的平民男孩，还有一个一直在笑的胖子。线索+2。","你注意到角落里有一个穿黑袍的人，他不像学生，倒像是……某种监视者。线索+2，SAN-1。"],"opening_observe_crit")]},
        ok:function(){return[pickV(["你观察了一下周围的同学，记住了几个面孔。线索+1。","你对新同学们有了一个大致的印象。"],"opening_observe_ok")]},
        fail:function(){return[pickV(["人太多了，你什么都没看出来。","你观察了半天，没有发现什么特别的。"],"opening_observe_fail")]},
        critfail:function(){return[pickV(["你盯着一个人看太久了，他发现了，恶狠狠地瞪了你一眼。声望-2。","你在观察时被人撞了一下，差点摔倒。"],"opening_observe_critfail")]}
      },
      effect:{time:1}, go:"academy_year1_main"},
    {t:"和旁边的同学搭话", check:{a:"CHA",sk:"口才",label:"魅力·社交",target:50},
      tier:{
        crit:function(){return[pickV(["你和旁边的同学聊得很投缘，他叫艾伦，是一个商人的儿子。他告诉你很多学院的八卦。同学好感+10，线索+1。","你认识了一个叫塞西莉亚的贵族女孩，她对你印象不错。同学好感+15。"],"opening_talk_crit")]},
        ok:function(){return[pickV(["你和旁边的同学简单聊了几句，交换了名字。同学好感+5。","你认识了一个新同学。"],"opening_talk_ok")]},
        fail:function(){return[pickV(["旁边的同学不太爱说话，只是敷衍了你几句。","你的搭讪失败了。"],"opening_talk_fail")]},
        critfail:function(){return[pickV(["你说错了话，得罪了旁边的同学，他冷冷地看了你一眼就不再理你了。同学好感-5。","你在搭话时被人嘲笑了。声望-3。"],"opening_talk_critfail")]}
      },
      effect:{time:1}, go:"academy_year1_main"}
  ]
};}


  nodes["academy_year1_explore"] = function(){ return {
  place:"学院校园",
  text:["学院探索。","开学第一周，没有课。你可以自由地探索学院。","你站在学院的地图前，看着上面标注的各个地点——教学楼，图书馆，竞技场，宿舍，食堂，医务室，商店街，炼金实验室，魔法训练场，还有……禁书区。","禁书区在图书馆的最底层，地图上用红色的字标注着：『未经许可，禁止入内。』","你决定先去图书馆。","图书馆很大，有五层。第一层是普通书籍，第二层是魔法书籍，第三层是历史书籍，第四层是禁书，第五层是……院长的私人藏书。","你在第一层逛了逛，拿了一本《艾尔达大陆通史》，找了个靠窗的位置坐了下来。","阳光从窗户照进来，洒在书页上。你翻开书，读了起来。","书里记录了艾尔达大陆三千年的历史——黄林晶时代，七印的建立，守望者的成立，八大势力的兴衰，种族的融合与冲突。","你读得入了迷。直到一个声音打断了你。","「你也喜欢历史？」","你抬起头。一个黑发的女孩站在你面前，她穿着一件绿色的长袍，手里拿着一摞书。她的眼睛是深绿色的，像是两片森林。","「嗯。」你说，「我觉得历史很有意思。」","「我也是。」女孩笑了笑，在你对面坐了下来，「我是塞西莉亚。历史系的。」","「你呢？你是哪个系的？」","你告诉了她你的职业和系别。塞西莉亚听着，时不时地点点头。","「原来如此。」她说，「那你应该去看看第三层的历史书籍。那里有很多关于七印和黄林晶的资料。」","「不过——」她压低了声音，「有些资料，被院长锁起来了。在第四层的禁书区。」","「为什么？」","「因为那些资料里，记录了一些……不该被人知道的东西。」塞西莉亚说，她的眼睛里闪过一丝好奇，「我一直想进去看看，但没有许可。」","你看着她。这个女孩，对禁书区的兴趣，似乎不只是好奇那么简单。","「你为什么想进去？」你问。","塞西莉亚沉默了一会儿，然后说：「因为我在调查一件事。一件……关于我家族的事。」","她没有再说下去。你也没有追问。","你们又聊了一会儿，然后塞西莉亚抱着书离开了。你看着她远去的背影，心里有一种说不出的感觉。","这个学院里，每个人都有自己的秘密。艾伦有，塞西莉亚有，你也有。","而这些秘密，终将在未来的某一天，被揭开。","你合上书，站了起来。你决定，去禁书区看看。","不是现在。但总有一天，你会进去的。","窗外，阳光正好。你走出图书馆，朝竞技场走去。","你的学院生活，才刚刚开始。而秘密，已经在你身边蔓延。"],
  options:[
    {t:"去图书馆看看", effect:{time:1}, go:"academy_library"},
    {t:"去竞技场看看", effect:{time:1}, go:"academy_arena"},
    {t:"偷偷观察禁书区", check:{a:"AGI",sk:"潜行",label:"敏捷·窥探",target:60},
      tier:{
        crit:function(){return[pickV(["你偷偷靠近禁书区，看到了一些不寻常的东西：深夜里，有几个穿黑袍的人在禁书区门口进进出出。线索+3，SAN-2。","你发现禁书区的守卫似乎在故意放某些人进去。你记下了那些人的特征。线索+2。"],"forbidden_observe_crit")]},
        ok:function(){return[pickV(["你观察了一下禁书区，发现守卫很森严。线索+1。","你了解了禁书区的基本布局。"],"forbidden_observe_ok")]},
        fail:function(){return[pickV(["守卫太严了，你什么都没看到。","你没能靠近禁书区。"],"forbidden_observe_fail")]},
        critfail:function(){return[pickV(["你被守卫发现了，被警告了一顿。声望-5。","你在窥探时被人发现了，他们开始跟踪你。SAN-3。"],"forbidden_observe_critfail")]}
      },
      effect:{time:1}, go:"academy_year1_main"},
    {t:"去礼堂参加开学典礼", effect:{time:1}, go:"academy_year1_opening"}
  ]
};}


  nodes["academy_year1_dorm"] = function(){ return {
  place:"学院宿舍",
  text:["宿舍生活。","307室。","你的宿舍在塔楼的三层，有两个房间——你和艾伦各一间，中间是一个共用的客厅和卫生间。","客厅里有一张桌子，两把椅子，一个书架，还有一个壁炉。壁炉里的火总是烧着的，不管春夏秋冬。据说是魔法壁炉，自动调节温度。","你的房间很简单——一张床，一个衣柜，一张书桌，一把椅子。书桌上有一盏台灯，是用魔法水晶做的，发出柔和的白光。","艾伦的房间和你的差不多，但他的书桌上摆满了各种东西——剑的模型，盾牌的徽章，还有一些你叫不出名字的武器零件。","「我是战士系的。」艾伦说，看到你在看他的东西，「我喜欢收集武器。」","他拿起一把剑的模型，递给你。模型很精致，剑柄上刻着花纹，剑刃是用银色的金属做的，在灯光下泛着冷光。","「这是『龙牙剑』的模型。」他说，「传说中，屠龙勇士用的剑。」","你接过模型，仔细看了看。确实很精致。","「你呢？」艾伦问，「你有什么爱好？」","你想了想，告诉了他你的爱好。艾伦听着，时不时地点点头。","「不错。」他说，「以后我们可以一起——」","他的话还没说完，门被敲响了。","艾伦走过去开门。门外站着一个红发的女孩——就是开学典礼上和艾伦聊天的那个。","「艾伦！」女孩说，她的声音很大，很活泼，「走啦，去食堂吃饭！我快饿死了！」","「来了来了。」艾伦说，他转过头，「一起去吗？」","你点了点头，跟着他们出了门。","红发女孩叫蕾克斯，是战士系的，和艾伦同班。她很活泼，很健谈，一路上叽叽喳喳地说个不停。","「你们知道吗？」蕾克斯说，压低了声音，「我听说，学院里有一个秘密组织。专门在深夜里活动。」","「什么秘密组织？」艾伦问。","「不知道。」蕾克斯说，「但我听说，有学生在深夜里看到过——有人穿着黑袍，在图书馆附近出没。」","你心里一动。黑袍——你想起了开学典礼上院长说的『暗流涌动』。","「也许是教授吧。」艾伦说，「教授们有时候会在深夜里做研究。」","「也许吧。」蕾克斯说，但她的眼睛里，有一丝怀疑。","你们来到了食堂。食堂很大，能容纳上千人。你们找了个位置坐下，打了饭。","食堂的菜确实不错——烤鸡，土豆泥，蔬菜汤，还有甜点。你吃得很满足。","吃饭的时候，蕾克斯还在说那个秘密组织的事。艾伦半信半疑，你则在心里默默记着。","你知道，那个秘密组织，可能和禁书区有关，和院长说的『暗流』有关。","而你，迟早会卷入其中。","窗外，天色渐渐暗了下来。学院的灯火，一盏一盏地亮了起来。","你的宿舍生活，从今天开始了。而秘密，已经在你身边蔓延。"],
  options:[
    {t:"和艾伦聊天", effect:{time:1,艾伦_bond:5}, go:"academy_year1_main"},
    {t:"和雷克斯搭话", check:{a:"CHA",sk:"口才",label:"魅力·社交",target:55},
      tier:{
        crit:function(){return[pickV(["你和雷克斯聊了起来，发现他虽然看起来冷漠，但其实是个很有想法的人。他告诉你一些学院内部的派系斗争。雷克斯好感+10，线索+2。","雷克斯对你刮目相看，他认为你是一个值得交往的人。雷克斯好感+15。"],"rex_talk_crit")]},
        ok:function(){return[pickV(["雷克斯和你简单聊了几句，态度有所缓和。雷克斯好感+5。","你和雷克斯建立了基本的关系。"],"rex_talk_ok")]},
        fail:function(){return[pickV(["雷克斯只是嗯了一声，继续看书。","你的搭讪没有效果。"],"rex_talk_fail")]},
        critfail:function(){return[pickV(["你说错了话，雷克斯皱了皱眉，对你的印象变差了。雷克斯好感-5。","你在搭话时提到了雷克斯的禁忌话题，他冷冷地看了你一眼。雷克斯好感-10。"],"rex_talk_critfail")]}
      },
      effect:{time:1}, go:"academy_year1_main"},
    {t:"收拾完就去礼堂", effect:{time:1}, go:"academy_year1_opening"}
  ]
};}


  nodes["academy_year1_main"] = function(){ return {
  place:"第一学年·日常",
  text:["第一学年·主线。","开学一个月后，课程正式开始了。","你的课表排得很满——上午是必修课，下午是选修课，晚上是自习和实践。","必修课包括：《魔法基础》《大陆历史》《种族与文化》《战斗理论》。选修课则根据你的职业不同而不同——魔法师有《元素操控》，战士有《战术学》，灵魂法师有《灵魂感知》，等等。","你最喜欢的课，是墨丘利的《灵魂魔法入门》。","墨丘利的课，总是在下午的最后一节。他的讲课方式很特别——不是照本宣科，而是用故事和案例来讲解。他会讲他三百年前的经历，讲他遇到的各种灵魂，讲灵魂魔法的本质。","「灵魂魔法，不是操控死者。」墨丘利说，他站在讲台上，浅灰色的眼睛扫过全班，「是理解死者。理解他们的遗憾，理解他们的执念，理解他们……为什么不肯离开。」","「每一个徘徊在人间的灵魂，都有一个未完成的心愿。你的任务，就是帮他们完成心愿，引导他们安息。」","「这不是一件容易的事。因为有些灵魂的心愿，是复仇；有些灵魂的心愿，是赎罪；有些灵魂的心愿……是再看一眼自己爱的人。」","他的目光，在你身上停留了一瞬。","你低下头，假装在记笔记。但你知道，他在看你。","下课后，你像往常一样，最后一个离开教室。墨丘利叫住了你。","「你最近的进步很快。」他说，靠在讲台上，双手抱胸，「灵魂感知的能力，已经超过了很多三年级的学生。」","「谢谢教授。」你说。","「但我要提醒你。」墨丘利的表情变得严肃了，「灵魂魔法是一把双刃剑。你能看到别人看不到的东西，也会被别人看不到的东西看到。」","「最近，学院里有些不对劲。」他压低了声音，「有几个学生，在深夜里失踪了。学院对外说是『退学』，但我知道，不是。」","「你要小心。不要在深夜里独自外出，不要去禁书区，不要……和穿黑袍的人说话。」","你看着他。他的眼睛里，有担忧，有警告，还有一丝……你看不懂的情绪。","「我知道了。」你说。","墨丘利点了点头，拍了拍你的肩膀，然后走出了教室。","你站在空荡荡的教室里，心里有一种说不出的感觉。","学生失踪。黑袍人。禁书区。","这些线索，在你的脑海里交织在一起，形成了一个模糊的轮廓。","你知道，学院的水面下，有什么东西在蠢蠢欲动。而你，已经被卷入了其中。","窗外，夕阳西下，把教室染成了金红色。你收拾好东西，走出了教室。","你的第一学年，才刚刚开始。而暗流，已经在你脚下涌动。"],
  options:[
    {t:"认真上课", check:{a:"INT",sk:"学习",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["你学习非常刻苦，成绩名列前茅，教授们都对你印象深刻。知识+3，声望+5。","你不仅成绩好，还在课堂上提出了独到的见解，教授们非常欣赏你。知识+5，声望+10。"],"study_crit")]},
        ok:function(){return[pickV(["你认真学习，成绩中上。知识+1。","你完成了基本的学习任务。"],"study_ok")]},
        fail:function(){return[pickV(["课程太难了，你学得很吃力。","你的成绩一般。"],"study_fail")]},
        critfail:function(){return[pickV(["你在课堂上走神了，被教授点名批评。声望-3。","你考试不及格，需要补考。"],"study_critfail")]}
      },
      effect:{time:7}, go:"academy_year1_event"},
    {t:"参加社团活动", effect:{time:3}, go:"academy_club"},
    {t:"调查学院的秘密", check:{a:"INT",sk:"调查",label:"智力·调查",target:60},
      tier:{
        crit:function(){return[pickV(["你深入调查了学院的秘密，发现了一个惊人的事实：学院里有一个暗蚀会的支部！线索+3，SAN-5。","你发现了学院地下的一个秘密实验室，里面在进行禁忌实验。线索+3。"],"investigate_crit")]},
        ok:function(){return[pickV(["你找到了一些线索，指向学院的某个秘密。线索+1。","你了解了一些学院的内部情况。"],"investigate_ok")]},
        fail:function(){return[pickV(["你调查了半天，什么都没发现。","学院的保密工作做得很好。"],"investigate_fail")]},
        critfail:function(){return[pickV(["你的调查被发现了，有人警告你不要再查下去。声望-5，SAN-3。","你被学院的纪律委员会传唤了。声望-10。"],"investigate_critfail")]}
      },
      effect:{time:7}, go:"academy_year1_event"},
    {t:"和同学增进关系", effect:{time:3}, go:"academy_classmates"},
    {t:"去墨丘利教授的研究室", effect:{time:1}, go:"npc_mercury_intro"}
  ]
};}


  nodes["academy_year1_event"] = function(){ return {
  place:"第一学年·事件",
  text:["第一学年·事件。","那是第一学期的期中。","那天晚上，你正在宿舍里看书。突然，走廊里传来了嘈杂的声音——有人在跑，有人在喊，还有人在哭。","你放下书，走出房间。艾伦也从他的房间里出来了，脸上满是疑惑。","「发生什么了？」他问。","你摇了摇头。你们走到走廊上，看到很多学生都出来了，三三两两地聚在一起，议论纷纷。","「听说了吗？」一个学生说，「又有人失踪了。」","「又？」另一个学生问，「之前不是已经失踪了三个吗？」","「这是第四个了。」第一个学生说，声音在发抖，「是二年级的一个女生。昨天晚上还在，今天早上就不见了。」","「学院怎么说？」","「还能怎么说？『退学』呗。」第一个学生冷笑了一声，「但谁信啊？退学的人，会连行李都不带走？」","你和艾伦对视了一眼。艾伦的脸色变了。","「走。」你说，「去看看。」","你们跟着人群，来到了二年级女生的宿舍区。那里已经围了很多人，几个教授在维持秩序。","你挤到前面，看到了那个失踪女生的房间。房间的门开着，里面的东西整整齐齐——书桌上的书还摊开着，床上的被子还叠着，衣柜里的衣服还挂着。","就像是……她只是暂时离开了，马上就会回来。","但你知道，她不会回来了。","因为你能感觉到——房间里，有一股淡淡的、黑暗的气息。那是深渊的气息。","你的心跳加速了。深渊——为什么学院里会有深渊的气息？","「你在看什么？」艾伦问。","「没什么。」你说，收回了目光。","就在这时，一个穿黑袍的人从人群的边缘走过。他的动作很快，几乎没有人注意到他。","但你注意到了。因为他的身上，有和房间里一样的——深渊的气息。","「艾伦。」你说，「你先回去。我有点事。」","「什么事？」艾伦问，但你已经转身，朝那个黑袍人追了过去。","黑袍人走得很快，穿过了庭院，绕过了教学楼，朝图书馆的方向走去。你跟在他后面，保持着距离。","最后，他走进了图书馆。你在图书馆门口停了下来，看着他的背影消失在楼梯间——他去了第四层，禁书区。","你站在图书馆门口，心跳如雷。","禁书区。黑袍人。深渊气息。失踪的学生。","这些线索，终于连在了一起。","你知道，你发现了一个大秘密。但你也知道，这个秘密，可能会让你陷入危险。","你深吸一口气，走进了图书馆。","你要去禁书区。不是现在——但总有一天，你会进去的。","而那一天，可能比你想象的，来得更早。"],
  options:[
    {t:"调查汤姆的失踪", check:{a:"INT",sk:"调查",label:"智力·调查",target:60},
      tier:{
        crit:function(){return[pickV(["你深入调查了汤姆的失踪，发现他是因为发现了学院的秘密而被「处理」了。线索+3，SAN-5。","你找到了汤姆留下的日记，里面记录了他发现的一切。线索+3。"],"tom_investigate_crit")]},
        ok:function(){return[pickV(["你找到了一些线索，但真相依然模糊。线索+1。","你了解了一些情况。"],"tom_investigate_ok")]},
        fail:function(){return[pickV(["你调查了半天，什么都没发现。","线索太少了。"],"tom_investigate_fail")]},
        critfail:function(){return[pickV(["你的调查被发现了，有人威胁你不要再查下去。SAN-5，声望-5。","你被人偷袭了，虽然没有受重伤，但你的调查材料被抢走了。HP-10。"],"tom_investigate_critfail")]}
      },
      effect:{time:7}, go:"academy_year1_end"},
    {t:"告诉教授你知道的情况", check:{a:"CHA",sk:"口才",label:"魅力·报告",target:55},
      tier:{
        crit:function(){return[pickV(["你告诉了墨丘利教授你知道的情况，他非常重视，承诺会调查。墨丘利好感+10，线索+1。","你向校长报告了情况，她虽然表面上不动声色，但你能感觉到她很在意。声望+5。"],"report_crit")]},
        ok:function(){return[pickV(["你告诉了教授，他说会注意的。声望+3。","你报告了情况。"],"report_ok")]},
        fail:function(){return[pickV(["教授认为你在胡思乱想，没有理会。","你的报告没有引起重视。"],"report_fail")]},
        critfail:function(){return[pickV(["你报告错了人，那个教授本身就有问题！你被他盯上了。SAN-5。","你的报告被当成了谣言，你被同学嘲笑了。声望-5。"],"report_critfail")]}
      },
      effect:{time:1}, go:"academy_year1_end"},
    {t:"不管这件事", effect:{time:1,karma:-5}, go:"academy_year1_end"}
  ]
};}


  nodes["academy_year1_end"] = function(){ return {
  place:"第一学年·期末",
  text:["第一学年·结束。","期末考试结束了。","你站在成绩单前，看着上面的分数——《魔法基础》A，《大陆历史》S，《种族与文化》A，《战斗理论》B，你的职业必修课S。","成绩不错。尤其是《大陆历史》的S，让你获得了院长奖学金。","艾伦的成绩也不错——战士系的课程全是A，只有《大陆历史》是C。他对历史完全不感兴趣。","「历史有什么好学的。」艾伦说，看着你的成绩单，一脸羡慕，「都是过去的事了。」","「过去的事，能告诉我们未来。」你说。","艾伦耸了耸肩，不置可否。","暑假到了。学院里的学生，大部分都回家了。只有少数人，选择留校。","你站在学院的大门口，看着学生们三三两两地离开。有的坐上了马车，有的骑上了马，有的步行——他们的脸上，都带着回家的喜悦。","「你不回家吗？」艾伦问。他已经收拾好了行李，准备回北方公国的家。","你摇了摇头。你没有家——或者说，你的家，已经不在了。","「那你暑假打算干什么？」艾伦问。","「在学院里待着。」你说，「看看书，练练魔法。」","「好吧。」艾伦说，他拍了拍你的肩膀，「那我走了。下学期见。」","「下学期见。」你说。","艾伦走了。他的背影消失在人群中。你站在原地，看着他远去的方向，心里有一种说不出的感觉。","暑假的学院，很安静。大部分学生都走了，只有少数教授和留校的学生。庭院里的喷泉，还在喷着水，发出哗哗的声音。","你走在空荡荡的走廊里，听着自己的脚步声。阳光从窗户照进来，在地板上投下斑驳的光影。","你知道，这个暑假，你不会闲着。","因为你要调查——学生失踪的真相，黑袍人的身份，禁书区的秘密。","你走到图书馆的门口，推开门。图书馆里很安静，只有图书管理员一个人在前台打盹。","你走上楼梯，一层，两层，三层——然后，你在第四层的楼梯口停了下来。","禁书区的门，就在你面前。门上着锁，锁上刻着魔法符文。","你看着那扇门，心里有一种说不出的冲动。","但你知道，现在还不是时候。你还没有足够的力量，去面对门后面的东西。","你转身，走下了楼梯。","但你在心里，暗暗发誓——总有一天，你会打开那扇门。","而那一天，可能就在这个暑假。","窗外，阳光正好。你走出图书馆，朝塔楼走去。","你的第一学年，结束了。但真正的故事，才刚刚开始。"],
  options:[
    {t:"回家过暑假", effect:{time:30,sanRecovery:5}, go:"academy_year2_intro"},
    {t:"留校继续调查", check:{a:"INT",sk:"调查",label:"智力·调查",target:65},
      tier:{
        crit:function(){return[pickV(["你利用暑假继续调查，终于找到了汤姆失踪的真相——他被暗蚀会的人带走了。线索+3，SAN-8。","你在暑假里发现了学院地下的一个秘密通道，通向一个可怕的地方。线索+3。"],"summer_investigate_crit")]},
        ok:function(){return[pickV(["你在暑假里找到了一些新线索。线索+1。","你继续调查，有了一些进展。"],"summer_investigate_ok")]},
        fail:function(){return[pickV(["暑假里学院人太少了，你什么都没查到。","你的调查没有进展。"],"summer_investigate_fail")]},
        critfail:function(){return[pickV(["你在暑假里被人偷袭了，虽然没有受重伤，但你知道有人不想让你继续查。HP-15，SAN-5。","你触发了一个陷阱，被困在地下通道里好几天才被发现。HP-20，SAN-10。"],"summer_investigate_critfail")]}
      },
      effect:{time:30}, go:"academy_year2_intro"},
    {t:"去旅行", effect:{time:30}, go:"fc_jiaohui_entry"}
  ]
};}


  nodes["academy_purge_intro"] = function(){ return {
  place:"学院·净化令",
  text:["净化令·降临。","净化令监察处设立的第三天，第一个被清查的学生出现了。","那是一个三年级的灵魂法师，叫托马斯。他在课堂上使用灵魂魔法的时候，被监察处的人当场带走了。","你亲眼看到了那一幕。","当时，你正在走廊里走路。突然，一群穿银甲的审判骑士冲了过来，推开了挡路的学生，直奔托马斯的教室。","他们冲进教室，把托马斯拖了出来。托马斯在挣扎，在喊叫，但审判骑士们不为所动。","「我没有做错什么！」托马斯喊道，他的眼睛里满是恐惧，「我只是在上课！我只是在使用灵魂魔法！」","「灵魂魔法就是异端。」为首的审判骑士冷冷地说，「带走。」","托马斯被拖走了。他的尖叫声，在走廊里回荡，久久不散。","学生们站在走廊两侧，看着这一幕，没有人敢说话。有的在发抖，有的在愤怒，有的在……冷漠。","你站在人群中，握紧了拳头。","你知道，这只是开始。","从那天起，学院里的气氛变了。学生们不再敢公开讨论灵魂魔法，不再敢和灵魂法师走得太近，不再敢……做任何可能被认为是『异端』的事。","灵魂法系的学生，成了学院里的『贱民』。他们走在路上，会被人指指点点；他们去食堂吃饭，会被人排挤；他们去上课，会被人用异样的眼光看着。","墨丘利的课，也受到了影响。监察处的人，会坐在教室的最后一排，监视着他的一举一动。他的讲课内容，被严格限制——不能讲灵魂沟通，不能讲灵魂操控，不能讲……任何可能被认为是『异端』的东西。","「灵魂魔法，不是异端。」墨丘利在课上说，他的声音很平静，但你能听出里面的压抑，「它只是一种魔法。和元素魔法，和神圣魔法，没有本质的区别。」","「但有些人，不这么认为。」","他的目光，扫过了教室最后一排的监察处人员。","下课后，你找到了墨丘利。他正在办公室里，看着窗外，手里端着一杯已经凉了的茶。","「教授。」你说，「你还好吗？」","墨丘利转过头，看着你，笑了笑——那笑容很苦涩。","「我还好。」他说，「但托马斯……可能不太好。」","「他会怎么样？」","「被审判。」墨丘利说，他的声音很低，「如果被认定为异端，就会被烧死。」","你的心沉了下去。","「我们不能救他吗？」","墨丘利沉默了很久，然后说：「能。但需要代价。」","「什么代价？」","「暴露我们自己。」墨丘利说，他看着你，眼中满是复杂的情绪，「如果我们出手救他，教会就会注意到我们。到时候，不只是托马斯，我们都会有危险。」","你看着他。这个活了三百年的男人，这个你尊敬的导师——他的眼睛里，有痛苦，有挣扎，还有一丝……无力。","「那我们就眼睁睁地看着他被烧死？」你问。","墨丘利没有回答。他转过身，继续看着窗外。","窗外，天空阴沉沉的，下着小雨。雨水打在窗户上，发出噼里啪啦的声音。","你站在办公室里，心里有一种说不出的愤怒和无力。","净化令的阴影，已经笼罩了整个学院。而你，能做什么？","你握紧了拳头。","总有一天，你会改变这一切。","但不是现在。现在，你还太弱了。"],
  options:[
    {t:"帮助被清查的同学", check:{a:"AGI",sk:"潜行",label:"敏捷·帮助",target:65},
      tier:{
        crit:function(){return[pickV(["你帮助几个被清查的同学藏了起来，还帮他们伪造了不在场证明。同学好感+15，业力+10。","你不仅帮助了同学，还收集了教会滥用权力的证据。线索+2，声望+5。"],"help_students_crit")]},
        ok:function(){return[pickV(["你帮助了一个同学躲过了搜查。同学好感+5，业力+5。","你做了一些力所能及的事。"],"help_students_ok")]},
        fail:function(){return[pickV(["你想帮忙，但被教会的人发现了，差点被一起带走。HP-5。","你的帮助没有成功。"],"help_students_fail")]},
        critfail:function(){return[pickV(["你被教会的人当成了异端，差点被带走！虽然你设法逃脱了，但你被列入了监视名单。声望-10，SAN-5。","你帮助的同学被发现了，他供出了你。你被教会传唤了。HP-10，声望-15。"],"help_students_critfail")]}
      },
      effect:{time:3}, go:"academy_year2_main"},
    {t:"保护墨丘利教授", check:{a:"CHA",sk:"口才",label:"魅力·保护",target:70},
      tier:{
        crit:function(){return[pickV(["你用巧妙的言辞帮助墨丘利教授躲过了教会的审查。墨丘利好感+20，业力+10。","你不仅保护了墨丘利，还揭露了教会的一个阴谋。声望+10，线索+2。"],"protect_mercury_crit")]},
        ok:function(){return[pickV(["你帮墨丘利教授做了一些掩护。墨丘利好感+10。","你做了一些力所能及的事。"],"protect_mercury_ok")]},
        fail:function(){return[pickV(["你的努力没有效果，墨丘利教授还是被调查了。墨丘利好感+5。","你没能帮上忙。"],"protect_mercury_fail")]},
        critfail:function(){return[pickV(["你的行为引起了教会的怀疑，你被当成了墨丘利的同党。声望-15，HP-5。","墨丘利教授为了保护你，主动向教会「自首」了。墨丘利好感+30，但他被带走了。SAN-10。"],"protect_mercury_critfail")]}
      },
      effect:{time:3}, go:"academy_year2_main"},
    {t:"明哲保身，不介入", effect:{time:1,karma:-10}, go:"academy_year2_main"},
    {t:"加入教会的清查", effect:{time:1,教会_rep:10,karma:-15,flag:"join_purge"}, go:"academy_year2_main"}
  ]
};}


  nodes["academy_year2_main"] = function(){ return {
  place:"第二学年·日常",
  text:["第二学年·主线。","净化令的阴影下，学院的生活变得压抑而紧张。","但你没有停下调查。你利用课余时间，继续调查学生失踪的真相，黑袍人的身份，禁书区的秘密。","你发现了一些线索。","首先，失踪的四个学生，都是灵魂法师。而且，他们都是在深夜里失踪的，失踪的地点，都在图书馆附近。","其次，那个黑袍人，你又看到了几次。他总是在深夜里出现，走进图书馆，去禁书区。他的身上，总是有一股淡淡的深渊气息。","最后，你在图书馆的第三层，找到了一本旧书——《学院秘史》。书里记录了学院成立三百年以来的各种秘密事件。其中，有一段引起了你的注意。","「艾尔达历2847年，学院地下发现了一处古代遗迹。经考察，该遗迹为黄林晶时代所建，内有大量关于七印的资料。学院将其封存，列为最高机密。」","「同年，学院成立『暗蚀会支部』，负责研究遗迹中的资料。支部成员由院长亲自挑选，身份保密。」","你的心跳加速了。","暗蚀会支部——学院里竟然有暗蚀会的支部？而且，是院长亲自成立的？","你继续往下读。","「艾尔达历2890年，暗蚀会支部发生叛乱。部分成员试图将遗迹中的资料泄露给外部暗蚀会。院长镇压了叛乱，将叛乱者处死。但支部保留了下来，继续研究遗迹。」","「艾尔达历2950年，暗蚀会支部开始进行『灵魂实验』。实验对象为……自愿的灵魂法师学生。」","你合上书，手在发抖。","自愿的灵魂法师学生？还是……被强迫的？","那些失踪的学生，是不是就是被暗蚀会支部抓走，做了『灵魂实验』？","你把书放回原处，走出了图书馆。","外面，阳光明媚。但你觉得，有一股寒意，从脚底一直升到了头顶。","学院的水面下，比你想象的更深，更暗。","暗蚀会支部。灵魂实验。失踪的学生。","这些线索，终于连在了一起。","你知道，你必须做点什么。但你也知道，现在的你，还没有足够的力量，去对抗暗蚀会支部。","你需要更强的力量，更多的盟友，更周密的计划。","你走在学院的庭院里，看着来来往往的学生。他们有的在笑，有的在闹，有的在认真地看书。他们不知道，在他们脚下，在学院的地下，有什么可怕的东西在蠢蠢欲动。","你深吸一口气，朝塔楼走去。","你的第二学年，在净化令的阴影下，在暗蚀会的威胁下，继续着。","而你，已经做好了准备。准备在合适的时候，揭开这一切。"],
  options:[
    {t:"认真上课", check:{a:"INT",sk:"学习",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["你学习刻苦，成绩优异。知识+3，声望+5。","你在课堂上表现出色，教授们很欣赏你。知识+5。"],"y2_study_crit")]},
        ok:function(){return[pickV(["你认真学习，成绩中上。知识+1。","你完成了学习任务。"],"y2_study_ok")]},
        fail:function(){return[pickV(["你学得很吃力。","成绩一般。"],"y2_study_fail")]},
        critfail:function(){return[pickV(["你被教授批评了。声望-3。","考试不及格。"],"y2_study_critfail")]}
      },
      effect:{time:7}, go:"academy_year2_event"},
    {t:"秘密学习灵魂魔法", check:{a:"SPR",sk:"灵魂魔法",label:"灵性·学习",target:65},
      tier:{
        crit:function(){return[pickV(["你在秘密学习中取得了很大进步，还得到了墨丘利的暗中指导。灵魂魔法+3，SAN-5。","你不仅学会了灵魂魔法，还发现了它的真正奥秘。灵魂魔法+5，SAN-10。"],"secret_soul_crit")]},
        ok:function(){return[pickV(["你学会了一些基础的灵魂魔法。灵魂魔法+1，SAN-3。","你有了一些进步。"],"secret_soul_ok")]},
        fail:function(){return[pickV(["灵魂魔法太难了，你进展缓慢。SAN-2。","你没能学会。"],"secret_soul_fail")]},
        critfail:function(){return[pickV(["你在练习时被教会的人发现了！虽然你设法逃脱，但你被列入了异端名单。声望-20，SAN-10。","你被灵魂之力反噬了，受了重伤。HP-20，SAN-15。"],"secret_soul_critfail")]}
      },
      effect:{time:7}, go:"academy_year2_event"},
    {t:"调查净化令背后的阴谋", check:{a:"INT",sk:"调查",label:"智力·调查",target:65},
      tier:{
        crit:function(){return[pickV(["你发现了净化令的真正目的——教会在用被抓的灵魂法师做禁忌实验！线索+3，SAN-10。","你发现教会的清查队伍里有暗蚀会的卧底！线索+3。"],"purge_conspiracy_crit")]},
        ok:function(){return[pickV(["你找到了一些可疑的线索。线索+1。","你有了一些发现。"],"purge_conspiracy_ok")]},
        fail:function(){return[pickV(["你调查了半天，什么都没发现。","线索太少。"],"purge_conspiracy_fail")]},
        critfail:function(){return[pickV(["你的调查被发现了，教会的人开始监视你。SAN-5，声望-10。","你被人偷袭了，调查材料被抢走。HP-15。"],"purge_conspiracy_critfail")]}
      },
      effect:{time:7}, go:"academy_year2_event"},
    {t:"和同学增进关系", effect:{time:3}, go:"academy_classmates"}
  ]
};}


  nodes["academy_year2_event"] = function(){ return {
  place:"第二学年·事件",
  text:["第二学年·事件。","那是第二学期的期中。","那天晚上，你正在宿舍里看书。突然，你听到了一声尖叫——从图书馆的方向传来。","你放下书，冲出了宿舍。艾伦也从他的房间里出来了，脸上满是疑惑。","「怎么了？」他问。","「不知道。」你说，「去看看。」","你们朝图书馆跑去。一路上，你看到很多学生也在朝图书馆跑，议论纷纷。","图书馆的门口，已经围了很多人。几个教授在维持秩序，审判骑士也来了——他们是净化令监察处的人。","你挤到前面，看到了——图书馆的门口，躺着一个人。","是一个学生。他穿着二年级的制服，脸上全是血，眼睛瞪得很大，像是看到了什么可怕的东西。他的胸口，有一个巨大的伤口，黑色的血液从伤口里流出来，散发着一股恶臭。","深渊的气息。","你的心跳加速了。","「让开让开！」一个教授喊道，他蹲下来，检查了一下那个学生的伤势，然后摇了摇头，「死了。」","人群里发出了一阵惊呼。","「怎么死的？」有人问。","「不知道。」教授说，他的脸色很难看，「伤口……不是普通的武器造成的。像是……被什么东西抓伤的。」","审判骑士们走了过来，检查了一下尸体，然后互相交换了一个眼神。","「带走。」为首的审判骑士说，「这件事，由监察处处理。」","学生们被驱散了。你和艾伦，跟着人群，慢慢往回走。","「你觉得，是谁干的？」艾伦问，他的声音在发抖。","你沉默了一会儿，然后说：「不是人。」","「什么意思？」","「那个伤口。」你说，「黑色的血，深渊的气息。那是……深渊魔物干的。」","艾伦愣住了：「深渊魔物？学院里怎么会有深渊魔物？」","你没有回答。因为你知道答案——学院的地下，有暗蚀会支部，有古代遗迹，有……深渊的裂缝。","那个学生，可能是无意中发现了什么，被深渊魔物杀了。","或者，他是被暗蚀会支部灭口的。","你回到宿舍，坐在窗前，看着外面的夜色。","月亮很圆，很亮，把学院的庭院照得像是白天。但你知道，在这片光明之下，有黑暗在涌动。","你握紧了拳头。","你不能再等了。你必须行动了。","明天，你要去禁书区。不管有什么危险，你都要进去看看。","因为你知道，如果再等下去，还会有更多的人死去。","窗外，夜风吹过，带来了远处的钟声。你闭上眼睛，在心里暗暗发誓。","这一切，必须结束。"],
  options:[
    {t:"策划营救墨丘利", check:{a:"INT",sk:"谋略",label:"智力·策划",target:75},
      tier:{
        crit:function(){return[pickV(["你制定了一个完美的营救计划，成功救出了墨丘利！墨丘利好感+30，声望+20，但你被教会通缉了。","你不仅救出了墨丘利，还揭露了教会的阴谋，让公众舆论倒向了你这边。声望+30，教会声望-30。"],"rescue_crit")]},
        ok:function(){return[pickV(["你成功救出了墨丘利，但过程很惊险。墨丘利好感+20，声望+10。","你完成了营救。"],"rescue_ok")]},
        fail:function(){return[pickV(["你的营救计划失败了，墨丘利被转移到了更安全的地方。声望-5。","你没能救出他。"],"rescue_fail")]},
        critfail:function(){return[pickV(["你的营救计划被发现了，你被教会抓了起来！HP-20，声望-30，你差点被一起「净化」。","营救过程中出了意外，墨丘利为了保护你受了重伤。墨丘利好感+10，HP-25，SAN-15。"],"rescue_critfail")]}
      },
      effect:{time:3}, go:"academy_year2_end"},
    {t:"收集证据证明墨丘利清白", check:{a:"INT",sk:"调查",label:"智力·调查",target:70},
      tier:{
        crit:function(){return[pickV(["你找到了关键证据，证明墨丘利是被冤枉的！教会不得不释放了他。墨丘利好感+25，声望+15。","你不仅证明了墨丘利的清白，还揭露了真正的异端——一个教会的红衣主教！声望+25。"],"evidence_crit")]},
        ok:function(){return[pickV(["你找到了一些证据，虽然不够充分，但为墨丘利争取了时间。墨丘利好感+10。","你有了一些发现。"],"evidence_ok")]},
        fail:function(){return[pickV(["你没能找到足够的证据。","时间不够了。"],"evidence_fail")]},
        critfail:function(){return[pickV(["你找证据时被人发现了，证据被销毁，你还被警告了。声望-10，SAN-5。","你被人陷害了，反而成了墨丘利的「同党」。HP-15，声望-20。"],"evidence_critfail")]}
      },
      effect:{time:3}, go:"academy_year2_end"},
    {t:"无能为力，看着他被带走", effect:{time:1,墨丘利_bond:-10,karma:-15,sanLoss:5}, go:"academy_year2_end"}
  ]
};}


  nodes["academy_year2_end"] = function(){ return {
  place:"第二学年·期末",
  text:["第二学年·结束。","期末考试结束了。但这一次，没有人有心情庆祝。","因为那个被深渊魔物杀死的学生，学院里的气氛变得更加紧张了。审判骑士增加了巡逻的力度，禁书区的守卫也加强了。学生们不再敢在深夜里外出，不再敢讨论任何『敏感』的话题。","你站在成绩单前，看着上面的分数——全部是A和S。你的成绩，比去年更好了。","但你没有心情高兴。","艾伦走了过来，拍了拍你的肩膀：「暑假有什么打算？」","「留在学院。」你说。","「又留？」艾伦皱了皱眉，「你去年就留了。今年不回家看看？」","你摇了摇头。","「好吧。」艾伦说，「那你自己小心。我总觉得，学院里最近不太对劲。」","「我知道。」你说。","艾伦走了。学生们陆续离开了学院，庭院里又变得空荡荡的。","你站在学院的大门口，看着最后一辆马车消失在道路的尽头。然后，你转过身，朝图书馆走去。","暑假的图书馆，几乎没有人。图书管理员看到你，点了点头，继续打盹。","你走上楼梯，一层，两层，三层——然后，你在第四层的楼梯口停了下来。","禁书区的门，就在你面前。门上着锁，锁上刻着魔法符文。","但这一次，你有准备。","你从怀里拿出一把钥匙——那是你在暑假里，花了整整一个月时间，复制出来的万能钥匙。","你把钥匙插进锁孔，轻轻一转。","『咔哒。』","锁开了。","你推开门，走了进去。","禁书区里很暗，只有几盏魔法灯发出微弱的光。空气里有一股陈旧的、发霉的味道，还有一丝……淡淡的深渊气息。","你沿着书架往前走，看着上面的书——《深渊生物学》《七印秘史》《黄林晶日记》《暗蚀会全录》……","每一本书，都是禁忌。每一本书，都记录着不该被人知道的秘密。","你走到书架的尽头，看到了一扇门。门上刻着暗蚀会的徽记——一只眼睛，瞳孔是黑色的漩涡。","你知道，门后面，就是暗蚀会支部的入口。","你深吸一口气，伸出手，推开了门。","门后面，是一条向下的楼梯。楼梯的尽头，有微弱的光，还有……低沉的嗡鸣声。","你走下楼梯。","你的第二学年，结束了。但真正的冒险，才刚刚开始。","而你即将看到的东西，将改变你对这个世界的一切认知。"],
  options:[
    {t:"回家过暑假", effect:{time:30,sanRecovery:5}, go:"academy_year3_intro"},
    {t:"留校继续调查", effect:{time:30}, go:"academy_year3_intro"},
    {t:"去大陆旅行", effect:{time:30}, go:"fc_jiaohui_entry"}
  ]
};}


  nodes["academy_year3_main"] = function(){ return {
  place:"第三学年·实践年",
  text:["第三学年·主线。","第三学年，是实践年。","按照学院的规定，第三学年的学生，需要参加实践课——实地训练，遗迹考察，战斗模拟，魔药炼制。","你的实践课，是『遗迹考察』。带队的教授，是墨丘利。","考察的地点，是学院地下的古代遗迹——就是暗蚀会支部所在的那个遗迹。","你不知道，这是巧合，还是墨丘利故意安排的。","考察的那天，墨丘利带着你们十几个学生，走进了地下遗迹。","遗迹很大，很古老。墙壁上刻满了符文，符文在黑暗中泛着微弱的光。空气里有一股潮湿的、发霉的味道，还有一丝……淡淡的深渊气息。","「这里是黄林晶时代的遗迹。」墨丘利说，他举着一盏魔法灯，走在最前面，「三千年前，黄林晶在这里建立了一个秘密的研究基地，研究七印和深渊。」","「后来，黄林晶消失了，这个基地就被废弃了。直到三百年前，学院成立的时候，才被重新发现。」","他带着你们，穿过了一条又一条走廊，经过了一个又一个房间。有的房间里摆满了仪器，有的房间里堆满了书籍，有的房间里……有战斗的痕迹。","「大家注意。」墨丘利说，他的表情变得严肃了，「遗迹的深处，有一些危险的东西。不要掉队，不要乱碰东西。」","你跟在队伍的最后面，仔细观察着周围的一切。你注意到——有些房间的门，是关着的，门上刻着暗蚀会的徽记。","那些门后面，就是暗蚀会支部的实验室。","你想过去看看，但墨丘利一直在注意着你。他的目光，时不时地扫过你，像是在警告你。","最后，你们来到了遗迹的中央——一个巨大的圆形大厅。","大厅的中央，有一个祭坛。祭坛上刻着七印的图案，图案在黑暗中泛着暗红色的光。","「这是七印的原型。」墨丘利说，他走到祭坛前，伸手摸了摸上面的符文，「黄林晶就是在这里，研究出了七印的封印方法。」","「大家可以看看，但不要碰祭坛。」","学生们四散开来，有的在看墙壁上的符文，有的在看角落里的仪器。","你走到祭坛前，仔细看着上面的图案。七印的图案，和你在书上看到的一样——但你注意到，图案的中央，有一个小小的、不显眼的符号。","那个符号，你见过——在禁书区的那本《黄林晶日记》里。","那是……后门的符号。","你的心跳加速了。黄林晶在七印里，留了一个后门。一个能让他彻底消亡，也能让深渊之主彻底消亡的后门。","你抬起头，看了一眼墨丘利。他正看着你，眼中闪过一丝意味深长的光芒。","他知道。他知道你发现了什么。","你移开目光，假装在看别的东西。","考察结束了。你们离开了遗迹，回到了地面。","走在回宿舍的路上，墨丘利叫住了你。","「你看到了。」他说，不是问句。","「看到了什么？」你装傻。","墨丘利笑了笑：「别装傻。我知道你看到了祭坛中央的符号。」","他左右看了一眼，然后压低声音：「那个符号，是黄林晶留下的后门。但现在，还不是打开它的时候。」","「什么时候才是时候？」","「等你足够强的时候。」墨丘利说，他拍了拍你的肩膀，「等你能承受真相的重量的时候。」","他转身走了。你站在原地，看着他远去的背影，心里有一种说不出的感觉。","你的第三学年，在遗迹的秘密中，继续着。而你离真相，又近了一步。"],
  options:[
    {t:"认真完成任务", check:{a:"INT",sk:"知识",label:"智力·考察",target:60},
      tier:{
        crit:function(){return[pickV(["你们在遗迹里有了重大发现，找到了一个古代的封印装置。知识+3，线索+2。","你的考察报告被评为优秀，教授们非常赞赏。声望+10。"],"mission_crit")]},
        ok:function(){return[pickV(["你们完成了考察任务，有一些发现。知识+1。","任务完成。"],"mission_ok")]},
        fail:function(){return[pickV(["你们的考察没有什么发现。","任务完成得很一般。"],"mission_fail")]},
        critfail:function(){return[pickV(["你们在遗迹里触发了陷阱，受了伤。HP-15，队员受伤。","你们迷路了，在遗迹里转了好几天才出来。HP-10，SAN-5。"],"mission_critfail")]}
      },
      effect:{time:7}, go:"academy_year3_event"},
    {t:"在遗迹里偷偷探索", check:{a:"AGI",sk:"潜行",label:"敏捷·探索",target:65},
      tier:{
        crit:function(){return[pickV(["你在遗迹深处发现了一个秘密房间，里面有一本古代的魔法书！获得：古代魔法书，线索+2。","你发现了遗迹的真正用途——它是一个深渊封印的节点。线索+3，SAN-10。"],"secret_explore_crit")]},
        ok:function(){return[pickV(["你找到了一些有价值的东西。获得：魔法材料，线索+1。","你有了一些发现。"],"secret_explore_ok")]},
        fail:function(){return[pickV(["你什么都没找到。","探索没有结果。"],"secret_explore_fail")]},
        critfail:function(){return[pickV(["你被遗迹里的怪物攻击了，受了重伤。HP-20，SAN-10。","你触发了陷阱，差点死掉。HP-25。"],"secret_explore_critfail")]}
      },
      effect:{time:7}, go:"academy_year3_event"},
    {t:"和队员增进感情", effect:{time:3}, go:"academy_classmates"}
  ]
};}


  nodes["academy_year3_event"] = function(){ return {
  place:"第三学年·事件",
  text:["第三学年·事件。","那是第二学期的期中。","那天晚上，你正在宿舍里看书。突然，整个学院震动了一下——像是地震，但又不是地震。","你放下书，冲出了房间。艾伦也从他的房间里出来了，脸上满是惊恐。","「怎么了？」他问。","「不知道。」你说，「去看看。」","你们冲出宿舍，看到庭院里已经站满了人。学生们三三两两地聚在一起，议论纷纷。教授们也出来了，他们的脸色都很难看。","你顺着他们的目光看去——图书馆的方向，有一道黑色的光柱，直冲云霄。","那道光柱，你很熟悉——是深渊的气息。","「发生什么了？」你问旁边的一个教授。","教授的脸色苍白：「地下遗迹……封印松动了。」","你的心跳加速了。封印松动——深渊的力量，正在从地下遗迹里涌出来。","就在这时，你听到了一声尖叫——从图书馆的方向传来。","然后，你看到了——一个黑色的、巨大的、有很多触手的东西，从图书馆的屋顶上冒了出来。","深渊魔物。","人群里发出了一阵惊呼。学生们四散奔逃，教授们开始组织防御。","「大家不要慌！」一个教授喊道，「战斗系的学生，跟我来！其他学生，回宿舍！」","艾伦拔出了剑，朝那个教授跑了过去。","「你呢？」他回头问你。","「我去看看。」你说，朝图书馆的方向跑去。","「等等！」艾伦喊道，但你已经跑远了。","你跑到图书馆的门口，看到了——暗蚀会支部的成员，正在和深渊魔物战斗。他们穿着黑袍，手里拿着各种武器，有的在施法，有的在近战。","但他们不是深渊魔物的对手。一个接一个的黑袍人被触手卷走，被撕碎，被吞噬。","你躲在一根柱子后面，看着这一切，心里有一种说不出的感觉。","暗蚀会支部——他们做了那么多坏事，抓了那么多学生做实验。但现在，他们在保护学院。","这就是……复杂的人性吗？","就在这时，你看到了——一个黑袍人，被触手卷住了，正在被拖向魔物的嘴。","你认出了他——是那个你跟踪过很多次的黑袍人。他的面具掉了，露出了一张年轻的脸。","他看起来，和你差不多大。","你没有多想。你冲了出去，用你最强的攻击，打在了触手上面。","触手吃痛，松开了那个黑袍人。他摔在地上，大口大口地喘着气。","「你……」他看着你，眼中满是惊讶，「为什么救我？」","「因为你还不该死。」你说，「起来，我们一起打。」","他愣了一下，然后笑了——那笑容里，有感激，有释然，还有一丝……你看不懂的情绪。","「好。」他说，捡起了地上的武器，「一起打。」","你们并肩作战，对抗着深渊魔物。你的魔法，他的武器，配合得天衣无缝。","最后，在教授们的支援下，深渊魔物被打退了。黑色的光柱消失了，地下遗迹的封印，重新稳定了下来。","你坐在图书馆的台阶上，大口大口地喘着气。那个黑袍人坐在你旁边，也在喘气。","「谢谢你。」他说，「我叫……你可以叫我『影』。」","「影？」你问。","「嗯。」他说，「暗蚀会支部的……一个普通成员。」","你看着他。这个你曾经跟踪过的黑袍人，这个你曾经视为敌人的人——现在，他是你的战友。","「你为什么加入暗蚀会？」你问。","影沉默了很久，然后说：「因为我想知道真相。关于七印的真相，关于黄林晶的真相，关于……这个世界的真相。」","「暗蚀会支部，是唯一在研究这些的地方。」","你看着他，心里有一种说不出的感觉。","原来，暗蚀会支部的成员，不都是坏人。他们中的有些人，和你一样——只是想知道真相。","「以后，我们可以合作。」你说。","影看着你，眼中闪过一丝光芒：「好。合作。」","你们伸出手，握了握。","你的第三学年，在深渊魔物的袭击中，在和暗蚀会成员的合作中，继续着。","而你知道，从今天起，你不再是一个人在战斗了。"],
  options:[
    {t:"奋勇作战", check:{a:"STR",sk:"格斗",label:"力量·战斗",target:60},
      tier:{
        crit:function(){return[pickV(["你在战斗中表现英勇，斩杀了数十只深渊生物，还救下了几个同学。声望+20，获得：战斗经验。","你不仅守住了阵地，还发现了深渊生物的弱点，帮助大家扭转了战局。声望+30，知识+2。"],"battle_crit")]},
        ok:function(){return[pickV(["你完成了防守任务，虽然受了点伤。HP-5，声望+5。","你表现中规中矩。"],"battle_ok")]},
        fail:function(){return[pickV(["你在战斗中受了伤，不得不撤退。HP-15。","你没能守住阵地。"],"battle_fail")]},
        critfail:function(){return[pickV(["你被深渊生物围攻了，受了重伤，还被深渊之力侵蚀了。HP-30，SAN-20。","你在战斗中犯了错误，导致一个同学受伤了。声望-10，HP-10，SAN-10。"],"battle_critfail")]}
      },
      effect:{time:1}, go:"academy_year3_end"},
    {t:"用智慧解决问题", check:{a:"INT",sk:"谋略",label:"智力·谋略",target:65},
      tier:{
        crit:function(){return[pickV(["你找到了封印裂隙的方法，暂时阻止了深渊生物的涌出。声望+25，知识+3。","你用巧妙的战术，以最小的代价击退了深渊生物。声望+20。"],"wisdom_crit")]},
        ok:function(){return[pickV(["你想出了一个办法，帮助大家减轻了压力。声望+10。","你的策略有一定效果。"],"wisdom_ok")]},
        fail:function(){return[pickV(["你的策略没有奏效。","你想不出办法。"],"wisdom_fail")]},
        critfail:function(){return[pickV(["你的策略出了差错，导致防线崩溃，很多人受了伤。声望-15，HP-10。","你被深渊生物的幻象迷惑了，差点攻击了自己人。SAN-15，声望-10。"],"wisdom_critfail")]}
      },
      effect:{time:1}, go:"academy_year3_end"},
    {t:"保护同学撤退", check:{a:"CHA",sk:"领导力",label:"魅力·领导",target:60},
      tier:{
        crit:function(){return[pickV(["你组织同学有序撤退，没有一个人受伤。声望+20，同学好感+15。","你不仅保护了同学撤退，还回去救了几个被困的人。声望+30，业力+15。"],"protect_crit")]},
        ok:function(){return[pickV(["你帮助同学撤退了，没有人受重伤。声望+10，同学好感+5。","你完成了任务。"],"protect_ok")]},
        fail:function(){return[pickV(["撤退过程中有人受了伤。同学受伤，声望+3。","你的组织能力一般。"],"protect_fail")]},
        critfail:function(){return[pickV(["撤退时出了意外，一个同学失踪了。声望-10，SAN-10。","你在混乱中走散了，差点死掉。HP-20，SAN-5。"],"protect_critfail")]}
      },
      effect:{time:1}, go:"academy_year3_end"}
  ]
};}


  nodes["academy_year3_end"] = function(){ return {
  place:"第三学年·期末",
  text:["第三学年·结束。","期末考试结束了。但这一次，没有人有心情庆祝。","深渊魔物的袭击，让学院里的每个人都心有余悸。虽然封印重新稳定了，但大家都知道——这只是暂时的。封印还在松动，深渊还在逼近。","你站在成绩单前，看着上面的分数——全部是S。你的成绩，是全院最好的。","但你没有心情高兴。","艾伦走了过来，他的胳膊上缠着绷带——在和深渊魔物的战斗中受的伤。","「暑假有什么打算？」他问。","「留在学院。」你说。","「又留？」艾伦皱了皱眉，「你每年都留。不腻吗？」","「不腻。」你说。","艾伦耸了耸肩，没有追问。他拍了拍你的肩膀，然后走了。","学生们陆续离开了学院。庭院里又变得空荡荡的。","你站在学院的大门口，看着最后一辆马车消失在道路的尽头。然后，你转过身，朝图书馆走去。","影在图书馆的门口等你。他已经脱下了黑袍，穿着一件普通的学生制服。如果不仔细看，你根本看不出他是暗蚀会支部的成员。","「准备好了吗？」他问。","「准备好了。」你说。","你们走进了图书馆，走上了四楼，打开了禁书区的门，然后走进了暗蚀会支部的入口。","地下实验室里，已经没有多少人了。大部分成员，在深渊魔物的袭击中死了。剩下的，也都离开了。","影带着你，走到了实验室的最深处。那里有一扇门，门上刻着七印的图案。","「这是支部长的房间。」影说，「他在袭击中死了。里面，应该有很多秘密资料。」","你推开门。","房间里很暗，只有一盏魔法灯发出微弱的光。房间的中央，有一张书桌，书桌上堆满了文件和书籍。","你走到书桌前，拿起最上面的一份文件。","文件的标题是：『七印封印状态报告·最新』。","你翻开文件，读了起来。越读，你的脸色越难看。","第一印：已碎。","第二印：松动，预计三年内破碎。","第三印：变弱，预计五年内破碎。","第四印：变弱，预计五年内破碎。","第五印：异常，原因不明。","第六印：异常，原因不明。","第七印：稳定，但正在被深渊之主的力量侵蚀。","你合上书，手在发抖。","七印，正在一个接一个地破碎。而你，还没有准备好。","「怎么了？」影问。","你把文件递给他。他看了一眼，脸色也变了。","「我们……还有多少时间？」他问。","「最多五年。」你说，「五年内，七印会全部破碎。深渊之主，会降临。」","房间里沉默了很久。","「那我们该怎么办？」影问。","你想了想，然后说：「变强。我们要在五年内，变得足够强。强到能阻止深渊之主。」","「还有——」你说，「找到黄林晶留下的后门。用后门，彻底消灭深渊之主。」","影点了点头：「好。我跟你一起。」","你们走出了暗蚀会支部，走出了禁书区，走出了图书馆。","外面，夕阳西下，把学院染成了金红色。","你的第三学年，结束了。但真正的战斗，才刚刚开始。","你只有五年时间。五年内，你必须变得足够强，找到后门，阻止深渊之主。","否则，这个世界，就会毁灭。","你握紧了拳头，朝塔楼走去。","你的传奇，才刚刚开始。而时间，已经不多了。"],
  options:[
    {t:"回家过暑假", effect:{time:30,sanRecovery:5}, go:"academy_year4_intro"},
    {t:"留校养伤并研究", effect:{time:30}, go:"academy_year4_intro"},
    {t:"去大陆旅行", effect:{time:30}, go:"fc_jiaohui_entry"}
  ]
};}


  nodes["academy_year4_main"] = function(){ return {
  place:"第四学年·研究",
  text:["第四学年·主线。","第四学年，是研究年。","按照学院的规定，第四学年的学生，可以选择一位导师，做独立研究。研究的成果，将影响毕业评价。","你选择的导师，是墨丘利。","你的研究课题是——『七印的本质与修复方法』。","墨丘利看到你的课题时，沉默了很久。","「你确定要研究这个？」他问，「这个课题，很危险。」","「我确定。」你说，「我想知道，七印到底是什么，能不能修复。」","墨丘利看着你，眼中闪过一丝复杂的情绪。然后，他点了点头：「好。我做你的导师。」","从那天起，你每天都泡在墨丘利的办公室里，和他一起研究七印。","你们读了无数的古籍，做了无数的实验，讨论了无数个日夜。","你发现了很多东西——七印的本质，不是封印，而是『容器』。每个印，都是一个容器，装着深渊之主的一部分力量。","七印破碎，深渊之主的力量就会释放出来。当七印全部破碎，深渊之主就会完全苏醒。","「那七印能修复吗？」你问。","墨丘利沉默了很久，然后说：「能。但需要……代价。」","「什么代价？」","「一个灵魂。」墨丘利说，他的声音很低，「一个强大的、完整的灵魂。用灵魂的力量，重新封印深渊之主的力量。」","「也就是说——每修复一个印，就要牺牲一个人？」","「是的。」墨丘利说，他的眼睛里有一丝痛苦，「三千年前，黄林晶就是用自己的灵魂，封印了深渊之主。」","你沉默了。","修复七印，需要牺牲。而你，愿意牺牲吗？","「还有别的办法吗？」你问。","「有。」墨丘利说，他看着你，眼中闪过一丝光芒，「黄林晶留下的后门。用后门，不需要牺牲，就能彻底消灭深渊之主。」","「但后门的钥匙——铸印，没有人知道在哪里。」","你想起了暗蚀会支部的那份文件——『第十二件神器：铸印，位置不明。』","「铸印。」你喃喃道，「我会找到它的。」","墨丘利看着你，眼中满是复杂的情绪：「你知道吗？你越来越像一个人了。」","「谁？」","「黄林晶。」墨丘利说，「一样的执着，一样的勇敢，一样的……想拯救世界。」","你没有说话。你不知道，这是夸奖，还是警告。","你的研究，继续着。你离真相，越来越近。但你也知道，真相的背后，是更大的危险。","窗外，天色渐渐暗了下来。学院的灯火，一盏一盏地亮了起来。","你坐在墨丘利的办公室里，看着面前的古籍，心里有一种说不出的感觉。","你的第四学年，在研究中，在战争的阴影下，继续着。","而你离铸印，离后门，离拯救世界的方法，又近了一步。"],
  options:[
    {t:"专注于研究", check:{a:"INT",sk:"研究",label:"智力·研究",target:65},
      tier:{
        crit:function(){return[pickV(["你的研究取得了重大突破，论文被评为优秀！知识+5，声望+15。","你不仅完成了研究，还创造了一个新的法术/配方！知识+8，声望+20。"],"research_crit")]},
        ok:function(){return[pickV(["你完成了研究，虽然没有重大突破。知识+2。","研究完成。"],"research_ok")]},
        fail:function(){return[pickV(["你的研究遇到了瓶颈，迟迟没有进展。","研究不顺利。"],"research_fail")]},
        critfail:function(){return[pickV(["你的实验发生了爆炸，实验室被炸了，你受了重伤。HP-20，声望-10。","你在实验中被禁忌之力侵蚀了。HP-15，SAN-15。"],"research_critfail")]}
      },
      effect:{time:30}, go:"academy_year4_event"},
    {t:"调查导师的秘密", check:{a:"AGI",sk:"潜行",label:"敏捷·调查",target:70},
      tier:{
        crit:function(){return[pickV(["你发现了导师的秘密——他在进行禁忌实验，用学生做材料！线索+3，SAN-15。","你发现导师是暗蚀会的卧底！线索+3，SAN-10。"],"mentor_secret_crit")]},
        ok:function(){return[pickV(["你找到了一些可疑的线索。线索+1。","你有了一些发现。"],"mentor_secret_ok")]},
        fail:function(){return[pickV(["你什么都没发现。","导师太谨慎了。"],"mentor_secret_fail")]},
        critfail:function(){return[pickV(["你被导师发现了，他威胁你不要说出去。SAN-10，声望-5。","你被导师的实验困住了，差点死掉。HP-25，SAN-20。"],"mentor_secret_critfail")]}
      },
      effect:{time:15}, go:"academy_year4_event"},
    {t:"和同学一起研究", effect:{time:15}, go:"academy_classmates"}
  ]
};}


  nodes["academy_year4_event"] = function(){ return {
  place:"第四学年·事件",
  text:["第四学年·事件。","那是第二学期的期中。","那天，学院里来了一群人——穿着银甲的审判骑士，还有几个穿黑袍的人。","他们是净化令监察处的人。但这一次，他们的人数比以前多了很多，而且，他们的脸上，带着一种……杀气。","院长亲自接待了他们。你站在教学楼的窗户后面，看着他们在院长办公室里谈了很久。","最后，院长送他们出来。院长的脸色很难看，而审判骑士们的脸上，带着得意的笑容。","你有一种不好的预感。","果然，第二天，学院里贴出了告示——","「净化令升级。即日起，学院内所有灵魂法师，必须接受『神圣审查』。审查不合格者，将被带走。」","告示一出，学院里炸开了锅。","灵魂法系的学生，人人自危。有的躲在宿舍里不敢出来，有的在收拾行李准备逃跑，有的……在哭。","墨丘利的课，被暂停了。监察处的人说，他是『重点审查对象』。","你找到了墨丘利。他正在办公室里，收拾东西。","「教授！」你说，「他们要把你怎么样？」","墨丘利转过头，看着你，笑了笑——那笑容很平静，但你能看出里面的苦涩。","「没什么。」他说，「只是审查而已。」","「审查？」你说，「他们会把你带走的！会把你烧死的！」","「不会的。」墨丘利说，他放下手里的东西，走到你面前，「我活了三百年，什么场面没见过？他们奈何不了我。」","「但——」","「听我说。」墨丘利说，他的表情变得严肃了，「我走了以后，你要继续你的研究。七印的事，铸印的事，都要继续。」","「还有——」他从怀里拿出一个东西，递给你，「这是守望者的联络方式。如果遇到了危险，就联系他们。」","你接过那个东西——是一枚小小的徽章，上面刻着一盏灯。","「教授。」你说，你的眼睛红了，「你一定要回来。」","墨丘利笑了，他拍了拍你的肩膀：「放心。我还没看到你拯救世界呢，怎么舍得死？」","他拿起行李，走出了办公室。","你站在原地，看着他远去的背影，眼泪流了下来。","你知道，墨丘利此去，凶多吉少。但你也知道，他不是一个普通人——他是活了三百年的灵魂法师，他是前守望者执灯人，他有自己的办法。","你擦干眼泪，握紧了手里的徽章。","你要继续研究。你要找到铸印。你要拯救世界。","为了墨丘利，为了所有被净化令迫害的人，为了……这个世界。","窗外，天空阴沉沉的，下着小雨。雨水打在窗户上，发出噼里啪啦的声音。","你的第四学年，在净化令的升级中，在墨丘利的离去中，继续着。","而你知道，从今天起，你必须独自面对这一切了。"],
  options:[{t:"继续导师的研究", check:{a:"INT",sk:"研究",label:"智力·研究",target:65},
      tier:{
        crit:function(){return[pickV(["你完成了导师的研究，取得了重大成果！知识+5，声望+10。","你不仅完成了研究，还改进了导师的方法。知识+8。"],"continue_research_crit")]},
        ok:function(){return[pickV(["你继续了研究，有了一些进展。知识+2。","研究继续。"],"continue_research_ok")]},
        fail:function(){return[pickV(["研究遇到了困难。","进展缓慢。"],"continue_research_fail")]},
        critfail:function(){return[pickV(["实验出了差错，你受了伤。HP-15。","你在研究中发现了可怕的真相，精神受到了冲击。SAN-15。"],"continue_research_critfail")]}
      },
      effect:{time:15}, go:"academy_year4_end"},
    {t:"应征入伍", effect:{time:1,flag:"join_army",北方_rep:10}, go:"faction_north_mission"},
    {t:"继续学院生活", effect:{time:15}, go:"academy_year4_end"}, {"t": "赴一场秘密集会", "go": "academy_y4_hidden_meeting"}]
} /*v45opt:academy_year4_event*/;}


  nodes["academy_year4_end"] = function(){ return {
  place:"第四学年·期末",
  text:["第四学年·结束。","期末考试结束了。但这一次，没有人有心情庆祝。","墨丘利被带走后，学院里的气氛变得更加压抑了。灵魂法系的课程，几乎全部停了。很多灵魂法师的学生，都被『审查』了，有的被放了回来，有的……再也没有回来。","你站在成绩单前，看着上面的分数——全部是S。你的成绩，依然是全院最好的。","但你没有心情高兴。","艾伦走了过来，他的脸色很不好。","「我收到了家里的信。」他说，声音很低，「我爸……去世了。」","你的心沉了下去。","「什么时候的事？」","「上个月。」艾伦说，他的眼睛红了，「铁门关的战斗中，他为了掩护部队撤退，战死了。」","你拍了拍他的肩膀，没有说话。","「暑假，我要回去。」艾伦说，「我要回去参加葬礼。然后……我可能要参军了。」","「参军？」","「嗯。」艾伦说，他的眼神变得坚定了，「我爸是将军，我不能给他丢脸。我要继承他的位置，继续战斗。」","你看着他。这个你最好的朋友，这个总是笑嘻嘻的少年——现在，他的脸上，有了一种你从未见过的成熟和坚定。","「我陪你回去。」你说。","艾伦看着你，眼中闪过一丝感激：「谢谢。」","学生们陆续离开了学院。庭院里又变得空荡荡的。","你和艾伦，一起坐上了前往北方公国的马车。","马车在道路上颠簸着。你看着窗外的风景——从繁华的城市，到荒凉的战场。越往北走，越能看到战争的痕迹——烧毁的村庄，废弃的农田，路边的白骨。","艾伦坐在你旁边，看着窗外，一言不发。他的手里，握着一封信——他父亲写给他的最后一封信。","你没有打扰他。你知道，他需要时间。","马车走了三天三夜，终于到了艾伦的家——北方公国的一个小城。","城里，到处都是白色的幡布。人们穿着黑色的衣服，脸上满是悲伤。","艾伦的父亲，是这个小城的英雄。他的葬礼，全城的人都来了。","你站在人群中，看着艾伦跪在灵前，一言不发。他的背很直，他的眼睛很红，但他没有哭。","葬礼结束后，艾伦找到了你。","「我决定了。」他说，「我要参军。」","「我支持你。」你说。","「那你呢？」艾伦问，「你打算怎么办？」","你想了想，然后说：「我要去找铸印。」","「铸印？」","「嗯。」你说，「一件能拯救世界的神器。」","艾伦看着你，眼中闪过一丝惊讶，然后笑了：「你总是在做一些了不起的事。」","「你也是。」你说。","你们站在小城的城墙上，看着远方。夕阳把天空染成了金红色，像是血。","「等战争结束了，」艾伦说，「我们再见面。」","「好。」你说，「到时候，我们一起喝酒。」","「一言为定。」","你的第四学年，结束了。但真正的冒险，才刚刚开始。","你将踏上寻找铸印的旅程，而艾伦，将踏上战场。","你们的道路，从今天起，分开了。但你们知道，总有一天，你们会再见面的。","风吹过城墙，带来了远方的战争气息。你深吸一口气，朝南方走去。","你的传奇，才刚刚开始。而时间，已经不多了。"],
  options:[
    {t:"回家过暑假", effect:{time:30,sanRecovery:5}, go:"academy_year5_intro"},
    {t:"留校准备毕业", effect:{time:30}, go:"academy_year5_intro"},
    {t:"去大陆旅行", effect:{time:30}, go:"fc_jiaohui_entry"}
  ]
};}




  nodes["academy_main"] = function(){return{
place:"学院·中央广场",
text:[
"学院的中央广场永远热闹。喷泉的水珠在阳光下碎成彩虹，鸽子绕着钟楼盘旋，三五成群的学生抱着书本匆匆走过，衣袍带起一阵风。",
"你站在喷泉边，看着这一切。阳光很好，空气里有青草和旧书页的味道。这里和外面的世界像是隔着一层看不见的纱——外面的战火、瘟疫、饥荒，到了这里，都变成了教授口中轻描淡写的「局势」二字。",
"但你见过真正的局势。你见过被烧毁的村庄，见过流离失所的人。你低头看着自己磨旧的靴子，想起那些你走过的路。",
"学院还在转。课还是照上，食堂还是照开，学生们还是为考试和恋爱发愁。而你站在这热闹的中央，忽然觉得，自己已经不属于这种热闹了。",
"但你还是得回去——回去上课、查资料、准备下一次出发。有些路，得从学院的门里，走出去。"
],
options:[
{t:"去学院各处转转", go:"pol_hub"},
{t:"去地下城入口", go:"dungeon_intro"},
{t:"回宿舍休息", go:"pol_rest_politics"}
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


  nodes["academy_event_outcome"] = function(){return{
place:"学院·事件落幕",
text:["学院的事件落下了帷幕。你站在走廊里，看着学生们三三两两地散去，议论声像退潮一样渐渐平息。", "有人感激你，有人警惕你，有人装作什么都没发生。你不在意这些——你只是做了自己认为该做的事。", "窗外，黄昏的光把走廊染成暖橙色。你靠着墙，慢慢吐出一口气，绷了一整天的肩膀终于松了下来。", "远处传来钟声，是晚课的铃。学生们抱着书匆匆走过，脚步声在空旷的走廊里回荡。你也该走了——日子还在继续，而你已经比昨天，更清楚自己要什么。", "那件事的结果，比所有人预想的都平淡。没有惊动全院，没有大张旗鼓，只是一纸通知，贴在公告栏的角落，两天就被新告示盖住了。", "你站在公告栏前，看着那张已经被风掀起的纸。上面写着：经查，无异常，望诸位安心学业。", "你当然知道，不是无异常。但你没有说。你发现，很多事都是这样——查了，写了，盖了章，就「无异常」了。", "你走回宿舍的路上，看见一个教授正站在花园里，背对着你，一动不动。你走过去的时候，他回过头，脸上是寻常的神情：「下课了？」你点头。他说：「早点回去。天要变了。」", "你抬头看天。天上没有云，太阳还好好的。你看着他的背影，慢慢走远了。那天晚上，真的下雨了。"] /*v45inj:academy_event_outcome*/,
options:[
{t:"回宿舍休息", go:"pol_rest_politics"},
{t:"继续活动", go:"pol_hub"}
]
}};


  nodes["academy_exam_chengtian"] = function(){return{
place:"承天学院·入学试",
text:["承天学院的入学试，设在文渊阁前。主考官是个蓄着山羊胡的老学士，面前摆着一摞卷子，看人的眼神像在掂量一篇文章的分量。", "「人间文章三千卷，卷卷都有题眼。你来说说，治学之道，首重什么？」他问得随意，指尖却轻轻敲着桌面，显然在听你的答案。", "你沉吟片刻，答道：「重在不欺。不欺书，不欺人，不欺己。」", "老学士的眼睛亮了一下，捋着胡子点了点头：「好一个不欺己。坐吧——你这份卷子，值得仔细看看。」他提笔在你名字上画了个圈，墨迹饱满。", "帝国军事学院的入学测试，在演武场举行。你到的时候，场上已经站了几排人，个个站得笔直。", "测试很简单：先考射箭，再考负重跑，最后是两人一组对练。考官站在高台上，手里拿着一本册子，偶尔记一笔。", "射箭的时候，你射了七箭，中靶五箭。考官看了你一眼，没有表情。负重跑，你跑完了全程，最后一百步，几乎是拖着自己过的线。", "对练的时候，你的对手是个比你高半头的人。你们打了三个回合，你输了。你坐在地上喘气，他把你拉起来，说：「你脚步不错，就是力气差了点。」", "考官在高台上开口：「报名字。」你报了。他记下，合上册子：「回去等消息吧。」", "你走出演武场，阳光晒得后背发烫。你不知道自己算不算过了关。但你记住了一件事——最后把你拉起来的那个人，他手上有一道很深的旧伤。"] /*v45inj:academy_exam_chengtian*/,
options:[
{t:"完成考试", go:"quest_hub"},
{t:"告退", go:"east_city"}
]
}};


  nodes["academy_exam_holy"] = function(){return{
place:"圣光学院·圣考",
text:["圣光学院的入学圣考，在礼拜堂举行。穹顶的彩窗漏下斑斓的光，把一切都染上一层圣洁的色泽。你站在祭坛前，一位白发主教缓缓开口：", "「孩子，圣光照耀之处，必有阴影。你愿意成为那道阴影中的守夜人吗？」他的声音很轻，却在整个礼拜堂里回荡。", "你抬起头，迎着他的目光：「我愿意守护值得守护的光。」", "主教注视你良久，忽然笑了：「好答案。不是每个来应试的人，都敢直视主教的眼睛。」他伸出手，在你额前画了个十字，「你通过了。」", "圣光神学院的入学考试，和你听说的一样严。笔试之后是面试，面试之后，还有一场「信仰测试」。", "测试的房间很安静，只有一张桌子和两把椅子。对面坐着一个穿白袍的考官，声音平和：「你信什么？」", "你答了。他点点头，又问：「如果有一天，你信的，和教义说的，不一样了。你信哪个？」", "你沉默了一会儿，说：「我信我自己看见的。」", "他看了你很久。房间里安静得能听见墙上钟摆的声音。最后，他站起来，朝你微微欠身：「你的答案，我们会考虑。」他顿了顿，「但我要提醒你——进了圣光的门，这句话，就不能再说了。」", "你走出房间的时候，走廊里阳光很好。你回头看了一眼那扇门，门已经关上了。"] /*v45inj:academy_exam_holy*/,
options:[
{t:"进入圣光学院", go:"quest_hub"},
{t:"离开", go:"church_city"}
]
}};


  nodes["academy_silver_leaf"] = function(){return{
place:"银叶学院·古试",
text:["银叶学院的入学仪式，在一棵古树下进行。精灵导师递给你一片银色的树叶：「握住它，听它说话。」", "你握住那片叶子。起初什么也没有，渐渐地，你感到叶脉在掌心里微微搏动，像一扇被敲响的门——然后，你听见了风的声音，不是耳边的风，是树冠深处的风，穿过千百年的叶隙，向你涌来。", "你睁开眼时，精灵导师正静静看着你：「你听见了。」她的语气里带着一丝意外，「人类的孩子，已经很久没有人能听见古树的低语了。」", "她把一片新叶别在你衣襟上：「欢迎来到银叶学院。记住，你听见的，是树的记忆——它会陪你走完在这里的每一天。」", "银叶学院的交换生，来了三个。他们走进礼堂的时候，整个礼堂，安静了一下。", "他们的穿着，和这边不一样——银灰色的长袍，领口别着银叶徽章。他们走路很轻，像一阵风，从你身边经过的时候，带着一股淡淡的草木香。", "他们被安排坐在前面。你注意到，他们坐得很端正，但眼神，一直在四处看着——像在打量一个陌生的世界。", "散会后，你在一棵树下，遇到其中一个。她正抬头，看着树冠，看得入神。你走过去，问她看什么。她说：「这棵树，一百二十岁了。」你愣了一下。她说：「我看得出来。」", "她转头看你，笑了笑：「在我们那儿，这样的树，还算年轻的。」你看着她，忽然觉得，她们的时间，和你们的时间，是不一样的。"] /*v45inj:academy_silver_leaf*/,
options:[
{t:"开始银叶的学习", go:"quest_hub"},
{t:"告辞", go:"elf_first"}
]
}};


  nodes["academy_forge_peak"] = function(){return{
place:"铁峰学院·匠试",
text:["铁峰学院的入学试，就是一块铁坯。主考的老匠师把一块烧红的铁坯放到你面前：「三个时辰，打成一件东西。形状、用途，你自己定。」", "你盯着那块铁坯，炉火的热浪扑在脸上。你想起矮人说的：铁打坏了可以回炉，人不行。你握起锤子，先绕着铁坯走了一圈，看清它的纹路，才落下第一锤。", "炉火映着你的影子，锤声在工坊里回荡。老匠师站在旁边，一言不发地看着，偶尔微微点头。", "三个时辰后，你放下的不是一件巧器，而是一柄朴素但重心极稳的短铁钎——老匠师拿起来掂了掂，破天荒地说了句：「不错。知道铁该往哪使劲的人，不多。」", "你又一次经过学院的钟楼。钟楼很高，尖顶在暮色里，像一根刺向天空的针。", "你绕着钟楼走了一圈。基座的石墙上，刻满了名字——一代一代，从这里毕业的人，把自己的名字，留在了这里。", "你伸手，摸了摸那些刻痕。有的深，有的浅，有的已经被风雨磨平了，只剩下一个模糊的轮廓。你忽然想，那些名字的主人，现在都在哪里。", "你在一处新刻的痕迹前，停下来。那名字，你认识——是今年春天，毕业的一位学长。你想起他走的那天，站在学院门口，回头看了一眼，然后，头也不回地，走了。", "你站在那里，看着那个名字。风从钟楼上吹下来，带着铜钟的气味。你忽然想，五年后，你的名字，也会刻在这里。你到时候，会回头，看几眼呢。"] /*v45inj:academy_forge_peak*/,
options:[
{t:"进入铁峰学院", go:"quest_hub"},
{t:"离开", go:"dwarf_city"}
]
}};


  nodes["academy_clubs"] = function(){return{
place:"学院·社团招新",
text:["学院广场的社团招新，比集市还热闹。各社团的摊位一字排开，横幅招展，学长学姐们使出浑身解数拉人——辩论社的现场唇枪舌剑，剑术社的木剑舞得虎虎生风，占星社摆了一架黄铜望远镜，据说能看到「命运的轨迹」。", "你被人群裹着走了一趟，手上塞满了传单。一个戴眼镜的学姐拦住你：「学弟，加入我们考古社吧！我们社的宗旨是——把挖出来的东西，重新埋回去。」她说完自己先笑了，「开玩笑的。我们真挖。」", "你笑着接过她的传单，没有立刻决定。社团这东西，选对了是助力，选错了是麻烦。你打算再逛逛，看看哪个社团，真正合你的脾气。", "学院的社团招新，在礼堂前摆了一排桌子。你走过去，各种声音，一起涌过来。", "「魔法研究社！研究古代术式，包教包会！」「棋艺社！以棋会友，以棋明理！」「远足社！走遍大陆，看遍风景！」", "你在一排桌子前，慢慢地走着。有人拉住你，热情地介绍。你听着，没有立刻决定。你走到最后一排，看见一张桌子前，坐着一个人，正低头看书，没有吆喝。", "你走过去，看了一眼他的牌子——「历史考据社」。你问他，你们社，做什么。他抬头，看了你一眼：「翻旧纸堆。」他顿了顿，「有时候，能翻出，有意思的东西。」", "你在他桌子前，站了一会儿。你问他：「我能看看你们翻出来的东西吗？」他放下书，说：「跟我来。」"] /*v45inj:academy_clubs*/,
options:[
{t:"报名一个社团", go:"quest_hub"},
{t:"再考虑考虑", go:"pol_hub"}
]
}};


  nodes["academy_explore"] = function(){return{
place:"学院·探索",
text:["学院里总有些角落，连在这里待了多年的教授都不常去。你顺着一条荒草丛生的小路，绕到了旧钟楼的背面。", "钟楼已经废弃很久了，铁门锈得发红，门缝里漏出潮湿的风。你推了推门，居然开了——铰链发出刺耳的呻吟，像在抗议这久违的打扰。", "你走进去，借着漏进来的光，看见墙角堆着几个落满灰的木箱。箱子上贴着封条，墨迹已经褪色，依稀能辨认出「勿动」两个字和一枚模糊的印章。", "你蹲下来，没有急着打开。有些东西，封着，是因为打开它的人，要付代价。你记下这个位置，轻轻带上门，退了出去。", "你花了几个下午，把学院的每个角落，都走了一遍。", "你走过操场，走过花园，走过食堂后面那条总飘着油烟味的小路。你走过教学楼顶层的走廊，那里有一扇窗，能看见整座学院。你站在那里，看了很久。", "你发现了一些别人不注意的地方：图书馆后面，有一道小门，常年锁着；花园的假山下面，有一块石头，磨得特别光滑，像被人坐了很多年。", "你在那块石头上，坐了一会儿。你低头，看见石头的缝隙里，刻着一行小字，被青苔盖住了大半。你拨开青苔，辨认了很久：「……此间岁月静好，愿君勿扰。」", "你看着那行字，笑了。你站起来，拍了拍衣服，把青苔，又轻轻盖了回去。你走的时候，回头看了一眼。那块石头，安安静静地，在假山下面。你决定，替那个刻字的人，守着这个秘密。"] /*v45inj:academy_explore*/,
options:[
{t:"改天带齐工具再来", go:"quest_hub"},
{t:"返回学院主区", go:"academy_main"}
]
}};


  nodes["academy_election"] = function(){return{
place:"学院·学生会选举",
text:["学院的学生会选举，是每年最热闹的角力场。公告栏前围满了人，候选人的宣言贴了一墙，字字铿锵，句句许诺。", "你站在人群外看了一会儿。两个主要候选人的风格截然不同——一个许诺改革课程、扩招平民；一个主张维护传统、严明纪律。支持者们各执一词，吵得面红耳赤。", "一个学长凑过来问你：「你打算投谁？」你摇摇头，没有回答。投票这种事，想清楚比投出去更重要。", "你记下两人的主张，转身离开。选举的走向，会影响学院接下来一年的风向——值得观察，但不必急着站队。", "学院的学生会选举，比你想的热闹。候选人要在礼堂前演讲，还要回答学生的提问。", "你站在人群里，听一个候选人讲他的施政纲领——无非是改善伙食、增加借书额度、争取活动经费。底下有人鼓掌，有人打哈欠。", "但有一个候选人不一样。她上台，没有讲这些。她说：「我来问你们一个问题——图书馆顶楼，到底锁着什么？」", "台下一片安静。她继续说：「你们不觉得奇怪吗？一所学院，为什么要锁着一层楼？」她看着台下，「我想查清楚。这就是我要竞选的。」", "她的话音落下，有人鼓掌，有人窃窃私语。最后，她当选了。你后来在食堂见过她，她端着餐盘，一个人坐着，面前摊着一本笔记。"] /*v45inj:academy_election*/,
options:[
{t:"继续观察选举", go:"quest_hub"},
{t:"回宿舍", go:"act_rest"}
]
}};


  nodes["academy_vacation_y2"] = function(){return{
place:"学院·第二年假期",
text:["第二学年的假期，你比第一年更知道自己想要什么。没有急着回家，也没有漫无目的地闲逛——你给自己列了一份清单。", "清单上有三件事：把上学期没啃完的那本古籍读完；去一趟城里的旧书店，找一本绝版的封印术手稿；还有，给家里写一封长信。", "你按部就班地做完了前两件。最后一封家书，你写了一个下午——写学院的见闻，写自己的成长，写那些报喜不报忧的琐事。写到一半，你停下来，看着窗外的夕阳，忽然想起离家时母亲站在门口的样子。", "你把信折好，贴上封蜡。第二天一早寄出时，你在信尾添了一行字：「一切都好，勿念。等假期结束，我回去看你们。」", "第二年的暑假，你没有回家。", "不是不想回。是手头的事，放不下——那个失踪的学生，那扇锁着铁链的门，还有你无意间翻到的那半页旧账。", "宿舍里只剩你一个人。夜里，钟楼的钟响过之后，整栋楼安静得像一座空城。你坐在灯下，把那半页旧账又看了一遍。", "你本来打算假期开始就动身，结果拖了一天，又一天。后来你索性不数日子了——事情没有办完之前，走到哪里，都是赶路。", "有一天夜里，你从图书馆回来，看见宿舍楼下站着一个人。那人抬头看了你一眼，又低下头，走了。你站在原地，站了很久。", "那个人的脸，你在哪里见过。可你想不起来。你上楼，锁好门，把灯挑亮。这一夜，你没有睡。"] /*v45inj:academy_vacation_y2*/,
options:[
{t:"继续假期计划", go:"quest_hub"},
{t:"休息", go:"act_rest"}
]
}};


  nodes["academy_mentor"] = function(){return{
place:"学院·导师",
text:["你的导师是个沉默寡言的中年人，讲课从不看讲义，却总能讲到最要紧的地方。他找你谈话的次数不多，但每一次，都像在点一盏灯。", "这一次，他把你叫到办公室，递给你一沓手写的笔记：「这是我年轻时整理的封印术心得，你拿去看。看不懂的地方，先记下来，别急着问。」", "你接过笔记，纸页已经泛黄，边角卷起，但字迹依然工整。你翻了翻，里面密密麻麻写满了批注，有些地方还画着示意图。", "你道了谢，转身要走。导师叫住你，顿了顿，说：「笔记里有一页，被我撕掉了。等你看完剩下的，如果还找得到那页的内容，再来找我。」", "你愣了一下，点了点头。这句话，你记下了。", "你的导师，是个话不多的人。你们第一次见面的时候，他只问了你一个问题。", "「你为什么来学院？」他问。你说了你的答案。他听完，没有评价，只说：「记住你今天的答案。」他顿了顿，「五年后，我再问你一次。」", "你们每隔一段时间，见一次面。他从不问你功课，只问你最近在想什么。有时候，你们一坐就是一个下午，大部分时间，都在沉默。", "有一次，你问他，为什么不教你点什么。他说：「我在教你。」你问，教了什么。他看着你：「教你怎么坐得住。」他顿了顿，「坐不住的人，学不了真东西。」", "你后来才明白，他说的「坐得住」，不是坐在椅子上。是坐在你自己的选择上，坐得住。"] /*v45inj:academy_mentor*/,
options:[
{t:"研读导师的笔记", go:"quest_hub"},
{t:"先问清楚撕掉的页", go:"quest_hub"}
]
}};


  nodes["academy_tournament"] = function(){return{
place:"学院·校际比武",
text:["校际比武的擂台搭在学院广场中央，围栏外三层里三层全是人。各学院的代表队陆续入场，旌旗猎猎，口号声此起彼伏。", "你作为观战者，挤在人群里。台上，两个选手已经交手——剑光交错，法术的光芒炸开，激起一阵阵惊呼。", "你注意到，比武不只是比武力：有选手在赛前调查对手的习惯，有选手在台上用言语激怒对方，还有选手故意示弱，诱敌深入。", "你看完一轮，若有所思。比武如用兵，台上的胜负，往往在台下就已经分出了。你把几处细节记在心里——这些经验，未必只在擂台上用得上。", "院际大赛的日子，越来越近了。学院的氛围，一天比一天热。", "公告栏前，围满了人。有人看赛程，有人打听对手，有人已经开始压注——哪个学院，今年能赢。", "你的同窗们，也在议论。有人摩拳擦掌，有人唉声叹气。有人问你：「你报名了吗？」你说，还没有。他瞪大了眼：「还没报？名额都快没了！」", "你走到报名处，看着那张名单——上面，已经写满了名字。你找了一圈，在名单末尾，看到了几个熟悉的名字。", "你站在那里，想了很久。你最后，拿起笔，在名单上，写下了你的名字。你放下笔的时候，觉得纸上的墨，好像特别重。"] /*v45inj:academy_tournament*/,
options:[
{t:"继续观战", go:"quest_hub"},
{t:"离开", go:"pol_hub"}
]
}};


  nodes["academy_missing_report"] = function(){return{
place:"学院·失踪报告",
text:["学院的一份旧档案里，夹着一份失踪报告。日期是多年前，失踪者是一名学生，原因栏写着四个字：外出未归。", "你翻到报告的附页，上面有几行补充记录：该生失踪前，曾多次出入禁书区；有同学称，他最后出现的夜晚，曾提起「图书馆地下有什么东西」。", "报告到这里就断了，没有结案记录，也没有后续调查。你合上档案，把那份报告的内容记在心里。", "你走出档案室时，回头看了一眼那排架子。有些失踪案，不是没有答案，而是没有人愿意去找答案。", "失踪学生的事，学院压了很久。但你还是在一次整理档案的间隙，看见了那份报告。", "报告很简短：某年某月某日，某生未归，宿舍无异常，随身物品俱在。最后一行是结论：「暂按外出未归处理。」", "你注意到，报告的边角，有一道折痕，像是被反复翻开过。纸面上还有几处很淡的水渍，不知是水，还是别的什么。", "你合上报告，放回原处。你后来问过一个老校工，那个学生后来找到没有。老校工擦着窗台，头也没抬：「找什么。人没了，就是没了。」他顿了顿，「学院这么大，每年走丢一两个，不算稀奇。」", "他说的轻描淡写，但你注意到，他说完那句话之后，把窗台来回擦了三遍。", "你后来经过那间宿舍，门锁着。你透过门缝看了一眼——里面的东西还在，桌上还放着一本翻开的书，像是主人只是出去买了个饭，马上就会回来。"] /*v45inj:academy_missing_report*/,
options:[
{t:"调查失踪案", go:"quest_hub"},
{t:"放下档案", go:"act_rest"}
]
}};


  nodes["academy_eclipse_join"] = function(){return{
place:"学院·日蚀的邀请",
text:["你在宿舍的门缝下，发现一张没有署名的纸条：「听说你对学院的一些『传统』有所怀疑。如果你想知道真相，午夜，旧钟楼，一个人来。」", "纸条上的字迹很工整，没有指纹，没有落款。你翻来覆去看了几遍，把它夹进书里。", "日蚀——这是学院里一个若隐若现的组织的名字。有人说它研究禁忌知识，有人说它只是几个叛逆学生的秘密读书会。但没有一个人，能说清它的全貌。", "你站在窗边，看着夜色里的旧钟楼轮廓。去，还是不去？这个选择，可能比你想的更重。", "日蚀会的招新，是在一个晚上。你收到一张纸条，上面写着一个时间和一个地点。", "你去了。地点是图书馆地下的一间旧阅览室，灯很暗，坐了一圈人，都看不清脸。", "「你来了。」为首的人声音很轻，「我们看了你很久。」他顿了顿，「你好奇的事，比别的学生多。这很好。」", "他讲了日蚀会的来历——一群研究「被学院搁置的问题」的人。他说：「学院教的是已知的。我们想弄明白的，是已知背后的东西。」", "你听着，没有立刻表态。他也没有逼你：「不急。你可以先回去想想。」他递给你一枚小小的黑色徽章，「想好了，戴上它，再来。」", "你握着那枚徽章，走出图书馆。夜色里，徽章在你手心，微微发凉。你没有戴它，但你也没有扔掉。你把它收进了贴身的口袋里。"] /*v45inj:academy_eclipse_join*/,
options:[
{t:"赴约", go:"quest_hub"},
{t:"烧掉纸条", go:"act_rest"}
]
}};


  nodes["academy_eclipse_exploit"] = function(){return{
place:"学院·利用日蚀",
text:[
"你决定接触日蚀组织——不是为了加入，而是为了利用它。他们手里掌握的情报，值得你冒一次险。",
"你按照纸条上的提示，在旧钟楼见到了联系人。对方披着深色斗篷，看不清面容，声音压得很低：「你比约定的时间晚了三分钟。这说明你犹豫过——我喜欢犹豫的人，他们通常更谨慎。」",
"你没有寒暄，直接说出你的条件：用情报交换情报。对方沉默了一会儿，轻笑一声：「可以。但我们给出的情报，从来不是免费的——你要拿什么来换？」",
"你报出一个名字。对方的动作顿了一下：「有意思。成交。」他递给你一枚刻着日蚀纹样的铜币，「拿着它，下次见面，我会知道是你。」",
"你接过铜币，收进贴身的口袋。这场交易，你占了先手——但你清楚，和这样的人物打交道，每一分便宜，都标着价。"
],
options:[
{t:"继续与日蚀周旋", go:"quest_hub"},
{t:"就此收手", go:"act_rest"}
]
}};


  nodes["academy_library"] = function(){return{
place:"学院·图书馆",
text:["学院的图书馆是一座穹顶高耸的建筑，阳光透过彩窗洒下来，在书架间投下斑斓的光影。空气里弥漫着纸墨和旧皮革的味道。", "你穿过一排排书架，手指拂过书脊。这里的藏书浩如烟海——从魔法理论到大陆史，从炼金术到航海志，应有尽有。", "你在一处角落停下，抽出一本封面磨损严重的书。翻开扉页，上面有一行泛黄的题字：「致后来者：读书如行路，莫问前程，只管低头走。」", "你抱着书，在窗边找了个位置坐下。阳光正好，书页沙沙作响。这一刻，你忽然觉得，学院最珍贵的地方，不是那些宏大的殿堂，而是这样的角落——安静，充实，像一个可以永远待下去的梦。", "学院的图书馆，是你待得最久的地方。你找到了一张靠窗的桌子，窗外是一棵老树。", "你每天来，坐同一个位子。管理员从一开始的陌生，到后来，会朝你点点头。有一次，他路过你的桌子，放下一样东西——一块干饼。「看书别饿着。」他说完就走了，没等你道谢。", "你咬了一口干饼。饼是凉的，但有一股淡淡的麦香。你吃着饼，翻着书，窗外，树叶沙沙地响。你忽然觉得，这样的日子，也不错。", "你在这里，读过很多书。有些书，你读完了，就忘了；有些书，你合上的时候，会在心里，留很久。", "你合上今天这一本，看着窗外的树。太阳正从树梢往下落。你收拾好东西，站起来。你走的时候，又看了一眼那张桌子——那是你的位子。明天，你还会来。"] /*v45inj:academy_library*/,
options:[{t:"借阅书籍", go:"quest_hub"},
{t:"回宿舍", go:"act_rest"}, {"t": "在图书馆留到深夜（触发：深夜书页）", "go": "academy_y1_night_library"}]
} /*v45opt:academy_library*/};


  nodes["academy_arena"] = function(){return{
place:"学院·竞技场",
text:["竞技场里，尘土飞扬。两个学生对练的呼喝声和武器碰撞声，在圆形场地上空回荡。", "你靠在看台栏杆上，看了一会儿。场上一个高年级学长正在指导新生——他的动作不花哨，但每一招都稳、准、狠，让新生疲于招架。", "「看明白了吗？」学长收起武器，对气喘吁吁的新生说，「打架不是比谁的花样多，是比谁先犯错。你刚才犯了三个错——第一个，出招太急；第二个，脚步太散；第三个，打完不知道退。」", "新生连连点头。你也在心里记下了这三句话。走出竞技场时，夕阳正好，你的影子被拉得很长。", "学院的演武场，平日就有人练武。大赛将近，人更多了。", "你走进去，空气里，是汗味和尘土味。场边，有人在练剑，剑光在日光里，一闪一闪。有人在练拳，拳风呼呼。还有人对练，兵器相击，叮叮当当。", "你找了个角落，练了一会儿。你停下来的时候，发现旁边有个高年级的学生，正看着你。你问他，看什么。他说：「你脚步不错。」他顿了顿，「但你的下盘，太浮了。」", "他给你示范了一下——站桩，半蹲，腰沉下去。你照着他的样子，试了试。不到一盏茶的功夫，你的腿，开始发抖。", "他拍了拍你的肩：「练吧。练到不抖了，你就能上场了。」他走了。你站在那里，咬着牙，继续蹲着。"] /*v45inj:academy_arena*/,
options:[{t:"下场对练", go:"quest_hub"},
{t:"离开", go:"pol_hub"}, {"t": "挑战剑术学长（黎明决斗）", "go": "academy_y2_dawn_duel"}]
} /*v45opt:academy_arena*/};


  nodes["academy_club"] = function(){return{
place:"学院·社团活动",
text:["社团的活动室里，几个人正围着桌子争论。你在门口站了一会儿，听出他们在讨论一个方案——关于如何向学院申请经费。", "「写得太正式，学院那帮老古板不会看。」「那写活泼点？不行，太轻浮。」争论半天，谁也没说服谁。", "你走进去，拿起那张草稿看了一遍，指着中间一段说：「这里，把『有利于学术发展』改成『有利于提升学院排名』。他们看得懂这个。」", "社团的人愣了一瞬，然后哈哈大笑：「高！还是你懂怎么跟老古板打交道。」", "那天晚上，你们一边改方案一边闲聊，直到熄灯。你忽然觉得，社团这东西，有意思的不在活动本身，而在这些一起为一件小事较真的人。", "你加入的那个社团，人不多，但每个人都很有意思。", "社长是个沉默寡言的人，但一说到旧纸堆，眼睛就亮。副社长是个话痨，负责对外联络——虽然，他们社，也没多少外可联。", "你第一次参加他们的活动，是在一间堆满旧书的房间里。有人翻出一卷旧地图，有人照着地图，念上面的地名。念到一个名字，大家都安静了一下。", "「这地方，现在还在吗？」有人问。没有人回答。社长拿起地图，看了很久：「我不知道。」他顿了顿，「但这名字，我见过三次了。三次，都在不同的地方。」", "你坐在窗边，听着他们说话。窗外，天正慢慢黑下来。你忽然觉得，这个社团，藏的，可能不止是旧纸堆。"] /*v45inj:academy_club*/,
options:[
{t:"继续社团活动", go:"quest_hub"},
{t:"回宿舍", go:"act_rest"}
]
}};


  nodes["academy_classroom_generic"] = function(){return{
place:"学院·教室日常",
text:["又是一堂普通的课。教授在讲台上讲着理论，你在台下记着笔记，窗外的光从左边移到右边，又慢慢变暗。", "你偶尔抬头，看见前排的同学在打瞌睡，后排的有人在偷偷看小说。这些都是学院的日常——平凡、琐碎、日复一日。", "但你知道，正是这些平凡的日子里，藏着以后会发光的时刻。你低头，把教授讲的重点又誊了一遍，字迹比上一次更工整。", "下课的钟声响了。你合上笔记，走出教室。夕阳把走廊染成金色，你的影子跟在身后，一步一步，走向明天。", "阶梯教室的窗开着，风把讲台上的讲义吹得哗哗响。教授用戒尺压住纸角，继续讲课，头也不抬。", "你坐在倒数第二排，阳光正好斜在你桌上。前排的人在抄笔记，笔尖沙沙地响；后排有人趴着睡，鼾声很轻，混在讲课声里，竟然不突兀。", "教授讲到一处，忽然停下来，问了个问题。教室里静了一瞬，然后有人举手，答错了，教授没生气，反而笑了一声：「错得有意思。比答对强。」", "你低头看了看自己的笔记——前半页工整，后半页开始画小人。你把那页撕下来，团了团，塞进口袋。", "下课铃响，教授收拾讲义，走到门口，又回过头：「下节课，带你们的脑子来。别的不用带。」教室里一阵哄笑。你也笑了。"] /*v45inj:academy_classroom_generic*/,
options:[
{t:"继续上课", go:"quest_hub"},
{t:"下课休息", go:"act_rest"}
]
}};


  nodes["academy_library_generic"] = function(){return{
place:"学院·图书馆日常",
text:["你在图书馆找了个靠窗的位置。桌上摊着几本书，一杯茶，一支笔。阳光从窗外洒进来，在书页上投下暖融融的光。", "你读了一会儿书，抬头揉了揉眼睛。图书馆里很安静，只有翻书声和笔尖划过纸面的沙沙声，偶尔有人轻声咳嗽。", "你忽然想起导师说过的话：「读书不是往脑子里塞东西，是让东西在脑子里长根。」你放下书，看着窗外的树影，若有所思。", "茶凉了。你又续了一杯，继续低头读书。这样的下午，平淡得像一杯温水，但你愿意用很多个这样的下午，去换一个真正明白的瞬间。", "图书馆里，书比人多。你穿过一排排书架，指尖划过书脊，灰尘在光柱里飘。", "你找了一下午的书，最后在顶楼角落里，找到一本没有编号的旧册子。封面磨损得厉害，字迹褪成了淡褐色。你翻开一页，上面画着一些看不懂的符号。", "管理员老头从你身后经过，看了一眼，没说话，走开了。他什么都没说——但你知道，那一眼里，有东西。", "你借了那本册子，登记的时候，老头的笔顿了一下：「这书，上次有人借，是二十年前。」他没有抬头，声音很平，「那学生后来没还。」", "你抱着册子走出图书馆，阳光刺眼。你把册子收进怀里。有些书，借出来，就还不回去了。"] /*v45inj:academy_library_generic*/,
options:[
{t:"继续读书", go:"quest_hub"},
{t:"回宿舍", go:"act_rest"}
]
}};


  nodes["academy_dorm_generic"] = function(){return{
place:"学院·宿舍日常",
text:["宿舍的清晨，总是从室友的闹钟声开始。有人翻身蒙住头，有人嘟囔着爬起来，有人已经抱着书出了门。", "你洗漱完，整理好床铺，看了一眼窗外的天气——今天有课，还有社团活动，晚上打算去图书馆还书。", "你出门时，室友朝你喊：「帮我带个早饭！」你应了一声，带上门。走廊里传来脚步声和说笑声，阳光从窗口斜斜照进来，把一切镀成暖色。", "学院的日子，大多是这样平平常常的。但你忽然觉得，这样的平常，也许正是许多年后，你会想念的东西。", "宿舍的夜谈，从一盏灯开始。", "不知是谁先提起的，话题从食堂的菜价，跳到某教授的怪癖，又跳到学院地下的传说。有人信誓旦旦地说，半夜钟楼会多敲一下，有人接嘴，说是鬼在捣乱。", "你靠在床头，听他们吵。窗户开着，夜风灌进来，把灯焰吹得摇摇晃晃。谁都没有去关窗。", "吵到后来，声音渐渐小了。有人打了个哈欠，有人翻了个身。灯还亮着，但没人再说话。", "你最后一个睡。你把灯吹熄，黑暗里，钟楼的钟声远远地传来，一下，两下。你数着，数到十二，没有第十三下。你闭上眼。"] /*v45inj:academy_dorm_generic*/,
options:[{t:"开始今天的日程", go:"quest_hub"},
{t:"再睡一会儿", go:"act_rest"}, {"t": "睡不着，上屋顶坐坐", "go": "academy_y1_rooftop"}, {"t": "深夜难眠，和马库斯在黑暗中说话", "go": "academy_y1_dorm_night"}]
} /*v45opt:academy_dorm_generic*/ /*v45opt:academy_dorm_generic*/};


  nodes["academy_playground_generic"] = function(){return{
place:"学院·操场日常",
text:["操场边的老树下，几个学生正围坐在一起，不知在聊什么，笑声一阵一阵地传来。远处的跑道上，有人在跑步，一圈又一圈，不知疲倦。", "你靠着树干坐下，看着这一切。风把树叶吹得沙沙响，阳光从叶隙间漏下来，在草地上洒下一片碎金。", "一个同学跑过来，递给你一颗糖：「社团新买的，尝尝。」你剥开糖纸，含进嘴里——是水果糖，甜得直冲脑门。", "你含着糖，看着操场上奔跑的身影，忽然觉得，这样的日子真好——年轻，明亮，还有大把的时间可以浪费。", "黄昏的操场上，有人在练剑，有人绕着跑道慢跑，有人坐在看台上发呆。天边烧着大片的晚霞，把每个人的影子都拉得很长。", "你沿着跑道走了一圈。风里有草的味道，混着一点点尘土。练剑的人收了剑势，冲你点了点头——你不认识他，他也只是路过。", "看台上坐着一个女生，抱着一本书，却没有翻。她望着天边，不知道在想什么。你走过去的时候，她看了你一眼，又低下头。", "你在操场的角落坐下。晚霞一点点暗下去，钟楼的轮廓在暮色里变得模糊。远处有人喊了一句什么，听不清，声音顺着风飘过来，像一声很远的问候。", "天黑了。你站起来，拍了拍裤子。操场上的人陆续散了，灯一盏盏亮起来。你往回走，身后是空荡荡的操场，和渐渐安静下来的夜。"] /*v45inj:academy_playground_generic*/,
options:[
{t:"加入他们", go:"quest_hub"},
{t:"散步", go:"act_rest"}
]
}};


  nodes["academy_elda_tournament_combat"] = function(){return{
place:"学院·比武决胜",
text:["最后的比试开始了。对手站在你对面，摆出架势，眼神专注而锐利。周围的观众屏住呼吸，整个场地安静得能听见旗帜翻动的声音。", "你深吸一口气，握紧武器。这些天的训练、那些深夜的思考、一次次失败后爬起来——都是为了此刻。", "你率先出手。第一招试探，第二招虚晃，第三招才是真正的杀招。对手反应极快，堪堪格开，但已经乱了节奏。", "你来我往几个回合，你终于找到了破绽——一记干净利落的击打，对手的武器脱手飞出，落在尘土里。", "全场爆发出欢呼声。你站在原地，胸膛起伏，汗水顺着额角滑落。你赢了——但你知道，这只是个开始。", "大赛的对战，终于轮到你了。你站在演武场上，对面的对手，比你高半个头。", "裁判一声令下，他先动了。他的攻势很猛，你连着退了几步，才稳住。你试着反击，他的防守很严，你的剑，几次都被他格开。", "你喘着气，心里在盘算。你想起那个高年级学生说的话——你的下盘，太浮了。你沉下腰，稳住脚步，不再抢攻，等他露出破绽。", "他果然急了。他一个前冲，用力过猛，中门大开。你侧身，一剑，点在他的手腕上。他的剑，脱了手。", "场边，响起一片呼声。他愣在原地，看着你。你朝他，伸出手。他看了你一会儿，也伸出手，握了握。你们互相，点了点头。"] /*v45inj:academy_elda_tournament_combat*/,
options:[
{t:"接受欢呼", go:"quest_hub"},
{t:"下场休息", go:"act_rest"}
]
}};

;

;

;


  nodes["academy_forbidden_section"] = function(){return{
place:"学院·禁书区",
text:["禁书区在图书馆的最深处，一道铁栅栏把书架和普通阅览区隔开。栅栏上挂着一块铜牌：「本院重地，非授权者严禁入内。」", "你站在栅栏外，看着里面那些暗色的书脊。透过缝隙，能闻到一股陈年的纸墨味——那里的书，大多已经很久没人碰过了。", "一个管理员经过，看了你一眼：「想进去？得有教授的批条。」你问什么书需要这么严的看管。他顿了顿，说：「知道得太多的书。」", "你记下这句话，转身离开。禁书区的秘密，不是靠硬闯能得到的——你得先找到那扇门的钥匙。", "禁书区在三楼最里面，门是铁制的，上了三道锁。你第一次靠近它，是在一个雨天的下午。", "你只是路过。但经过那扇门的时候，你听见里面有什么声音——很轻，像是有人在翻书页。你站住，又听了听。声音没有了。", "你试着推了推门。门纹丝不动。你把耳朵贴在门上，听了很久，只听见自己的心跳。", "你离开的时候，回头看了一眼。那扇铁门在昏暗的走廊尽头，像一堵沉默的墙。", "后来你问过一个整理图书的老管理员，禁书区里到底有什么。他看了你一眼：「有书。」他说，「也有别的。」他没有再解释，低头继续理他那摞书，一本一本，码得很齐。"] /*v45inj:academy_forbidden_section*/,
options:[
{t:"寻找进入的许可", go:"quest_hub"},
{t:"先回宿舍", go:"act_rest"}
]
}};


  nodes["academy_main_generic"] = function(){return{
place:"艾尔达大陆学院 · 校门",
text:["你站在艾尔达大陆学院的校门前，抬头看着这座传说中的学院。", "学院建在一座小山的山顶上，四周被古老的橡树环绕着。校门是用白色的大理石建造的，上面刻着学院的校训——「知识即力量，真理即自由」。", "你深吸一口气，然后走进了学院的大门。", "从今天起，你的学院生活，正式开始了。", "（此节点为v38学院入口节点，后续将补充完整的学院系统和叙事内容。）", "你走在学院的主道上。两旁的梧桐树已经落了叶，光秃秃的枝丫伸向天空，像一幅简笔画。", "主道上有来来往往的学生：抱着书的、聊着天的、小跑着赶课的。你从他们中间穿过，有人朝你点头，有人没看见你。", "你路过公告栏，看了一眼。上面贴着几张新的告示：一张是关于图书馆顶楼检修的通知，一张是社团招新的海报，还有一张，边角卷起，只露出一行字——「寻人：……」后面的字被人撕掉了。", "你停下，想把那张告示揭下来看个究竟。手指刚碰到纸边，一个声音从你身后传来：「别看了。看了，晚上睡不着。」", "你回头，是一个不认识的高年级学生。他抱着书，没有停步，边走边说：「那告示贴了三天了。没人知道是谁贴的，也没人知道找谁。」他走远了，「反正，别看了。」", "你站在原地，看着那张告示。纸边被风掀起来，又落下。你最后还是收回了手，继续往教室走。但那张告示的边角，印在你脑子里了。"] /*v45inj:academy_main_generic*/,
options:[
{t:"去教学楼", go:"academy_classroom_generic"},
{t:"去图书馆", go:"academy_library_generic"},
{t:"去宿舍", go:"academy_dorm_generic"},
{t:"去操场", go:"academy_playground_generic"},
{t:"离开学院", go:"world_map_generic"}
]}};



  nodes["academy_year1_class_choose"] = function(){return{
place:"学院·选课",
text:["开学第一周，你要决定第一年的选修课。课程表贴在教学楼门口，被围得水泄不通。", "你挤进人群，看见课表上有三门课最抢手：灵魂魔法导论（墨丘利教授）、古代符文学（一位从东方来的客座教授）、以及战场急救术（退役军医主讲）。", "你还在犹豫，旁边的同学塞西莉亚看了你一眼：「选灵魂魔法吧。墨丘利教授虽然怪，但他教的，是真东西。」", "你问：「你怎么知道？」她笑了笑：「因为我表哥在图书馆当管理员。他说，每年只有最有天分的学生，才会被墨丘利教授单独指导。」", "选课的那天，礼堂里摆了一排桌子，每张桌子后面坐着一个教授，面前放着课程表。", "你在一排桌子之间走着，犹豫不决。有人拉你袖子——是学长，他压低声音说：「别选那个，作业多。」又有人拽你：「这个老师好说话。」", "你最后停在一张桌子前。桌子后的教授看了你一眼，没有推销自己的课，只说了一句：「坐下吧。」", "你坐下了。他翻出一本薄薄的小册子，推到你面前：「先看看这个。看完了，你再决定选不选。」", "你翻开册子。里面不是课程介绍，是几页手抄的笔记，字迹工整，内容讲的是一个古代术式的推演过程。你看了几行，就移不开眼睛了。", "你抬起头，教授正看着你。他问：「看懂了？」你点头，又摇头。他笑了：「看不懂就对了。看得懂，我就不教这门课了。」他拿起笔，在你的选课表上，盖了一个章。"] /*v45inj:academy_year1_class_choose*/,
options:[
{t:"选灵魂魔法", go:"academy_year1_class_soul"},
{t:"选古代符文学", go:"academy_year1_open"}
]
}};


  nodes["academy_year1_class_soul"] = function(){return{
place:"学院·灵魂魔法课",
text:["你选了墨丘利教授的灵魂魔法导论。第一堂课，他没有讲课，只是让学生们围坐成一圈。", "「灵魂魔法不是咒语。」墨丘利开口，「它是倾听。倾听你自己心里，那些你不敢面对的声音。」", "他让每个学生说出自己最深的恐惧。轮到你时，你沉默了很久，说：「我怕……怕自己做的选择，会害了别人。」", "墨丘利看着你，微微点头：「那你已经比大多数人，更接近灵魂魔法的门了。」那堂课结束，他单独留住了你：「放学后来图书馆。我有些东西，想给你看。」", "灵魂魔法课的第一堂，教授没有讲课，只让所有人围坐成一圈，闭上眼。", "教室里很安静。你闭着眼，能听见自己的呼吸，能听见窗外的鸟叫，能听见有人忍不住咽了咽口水。", "「不要睁眼。」教授的声音从某个方向传来，「听。你们心里，有什么在动。」", "你听了很久。一开始什么都没有。然后，你感觉到一种很轻的、几乎察觉不到的震动——不是心跳，不是呼吸，像是更深的地方，有什么东西，在缓慢地翻身。", "你睁开眼。教室里，其他人也陆续睁开眼，脸上表情各异。有人疑惑，有人害怕，有人装作什么都没发生。", "教授看着所有人，说：「感觉到了的，和没感觉到的，都没有关系。」他顿了顿，「但感觉到了的人，从今天起，你们要学的东西，和别人不一样。」", "你坐在那里，心跳得有点快。你知道，他说的「不一样」，是什么意思。"] /*v45inj:academy_year1_class_soul*/,
options:[
{t:"去图书馆", go:"academy_year1_main"},
{t:"先问问同学", go:"academy_year2_audience"}
]
}};


  nodes["academy_year2_audience"] = function(){return{
place:"学院·大赛观众席",
text:["院际大赛的看台上，你坐在观众席里，看着场上的比赛。", "今年是圣光神学院对帝国军事学院。两边的选手你来我往，魔法与剑术齐飞，看台上喝彩声震天。", "你旁边坐着一个圣光学院的学生，他看得紧张，攥着拳头：「加油……加油啊……」你问他：「你们学院，今年能赢吗？」", "他摇摇头：「不知道。但不管输赢，我们都会记住这场比赛。」他顿了顿，「明年，就轮到我们上场了。」", "你第一次旁听高年级的课，是在第二年的秋天。阶梯教室坐满了人，你只能坐在最后排，贴着墙。", "讲课的教授头发花白，声音不大，但教室里很安静。他没有讲课本上的东西，讲的是他自己年轻时的一段经历——在一座塌了半边的古城里，发现了一本被火烧了一半的书。", "「书的前半本，记的是这座城的账目。」他说，「后半本，记的是这座城的人。谁生的，谁死的，谁欠谁的。」他顿了顿，「你们猜，哪半本，更值钱？」", "台下没有人回答。他等了一会儿，自己说：「账目可以重算。人，算不回来。」", "下课的时候，你站起来，发现腿坐麻了。你扶着墙，慢慢往外走。那个教授收拾讲义，抬头看了你一眼，没有说什么，又低下了头。", "你走出教室，秋风吹过来，你打了个激灵。那半本书的事，你记了很久。"] /*v45inj:academy_year2_audience*/,
options:[
{t:"记住他的话", go:"academy_year2_grades"},
{t:"打听大赛内幕", go:"academy_year2_tournament_signup"}
]
}};


  nodes["academy_year2_grades"] = function(){return{
place:"学院·成绩公布",
text:["期末成绩公布了。你站在布告栏前，人群挤挤挨挨，有人欢呼，有人垂头丧气。", "你在名单上找到自己的名字——中等偏上，不算差，也不算好。旁边的同学马库斯拍了拍你的肩：「别灰心，还有明年。」", "你问他考得怎么样。他咧嘴一笑：「差点被踢出学院。我爹要是知道了，能把我吊起来打。」你被他逗笑了。", "你看着布告栏上的名字，忽然想起墨丘利的话：成绩只是尺子，不是方向。你转身离开，心想：明年，要学点真正的东西。", "第二年的成绩单，是在一个阴天发下来的。你拿着它，站在走廊里，看了很久。", "成绩不算差，但你盯着一门课的分数，看了好一会儿。那门课，你觉得自己应该考得更好。", "你去找授课教授。他正在改论文，听你说明来意，放下笔：「你觉得你该得多少？」你说了一个数。他点点头：「我也觉得你该得这个数。」他顿了顿，「但你交上来的，不是这个水平。」", "你愣住了。他把你的卷子从一沓纸里抽出来，放在你面前：「你看你第三题。你明明会，但你写的时候，绕开了最直接的做法。」他看着你，「你在怕什么？」", "你没有回答。他也没有追问：「回去想想。想明白了，那道题，比这个分数值钱。」", "你拿着卷子走出办公室。走廊里光线很暗，你走到窗边，看了一眼窗外。阴天，云压得很低。你把卷子折好，收进怀里。你在想，他问的那个问题。"] /*v45inj:academy_year2_grades*/,
options:[
{t:"去找墨丘利", go:"academy_year4_mercury"},
{t:"去图书馆", go:"academy_year4_library"}
]
}};


  nodes["academy_year2_tournament_signup"] = function(){return{
place:"学院·大赛报名",
text:["院际大赛的报名处，排着长长的队伍。你也在其中。", "轮到你时，负责报名的老师看了你一眼：「什么项目？」「剑术。」你说。「单人还是团体？」「……单人。」", "他填好表格，递给你一枚号牌：「三天后初赛。记住，比赛可以输，但别丢学院的『剑』。」", "你捏着号牌，走出报名处。阳光正好。你忽然有点紧张——但更多的，是期待。", "院际大赛的报名处，设在礼堂门口。你到的时候，已经排了长队。", "你看见有人在队伍里低声讨论：「听说今年圣光学院也来？」「来。还有军事学院——他们的人，去年把艾尔达的选手打得很惨。」", "前面一个高年级学生转过头，接了一句：「惨是惨，但那是去年。」他笑了笑，「今年，我们这边有新面孔。」他看了你一眼，没说下去。", "队伍慢慢往前挪。你听见有人在背后拍你肩膀——回头，是艾伦。他手里拿着一张报名表，已经填好了名字：「你报了没？」你摇头。他咧嘴笑：「一起。输了不丢人，不敢报才丢人。」", "你接过他递来的表。笔尖落在纸上的时候，你听见礼堂里有人在敲鼓，咚咚咚，一声比一声急。像是替所有人，把心跳敲了出来。"] /*v45inj:academy_year2_tournament_signup*/,
options:[
{t:"回去备战", go:"academy_year3_midterm"},
{t:"找同学切磋", go:"academy_year2_audience"}
]
}};


  nodes["academy_year3_adventurer"] = function(){return{
place:"学院·冒险者实习",
text:["第三年的实习，你选择了冒险者路线——加入一支冒险队，去大陆各地历练。", "领队是个独眼的老冒险者，他打量了你一番：「学院来的？能吃苦吗？」「能。」「能杀人吗？」你犹豫了一下。他笑了：「犹豫得好。一上来就说能杀的，多半是吹牛。」", "接下来的日子，你跟着队伍翻山越岭，剿过盗匪，探过遗迹。你渐渐明白，冒险者不是靠热血活命的——靠的是谨慎和同伴。", "实习结束那天，老领队拍着你的肩：「你不错。虽然嫩了点，但骨头硬。以后要是有缘，再一起走。」", "第三年假期，你接了第一趟冒险者公会的委托。", "委托很简单：去城外的林子里，找一匹走失的马。你接了。到了地方你才发现，林子比你想的大，马比你想的难找。", "你找了半天，最后在一处溪边找到了它。马鞍上还有马主人的名字，是城里的一个老皮匠。你把马牵回去，老皮匠千恩万谢，硬塞给你一袋铜币。", "你捏着那袋铜币，忽然觉得，这比在教室里背下来的任何一条知识，都更实在。", "你把铜币分了一半，在酒馆里请同行的几个冒险者喝了顿酒。一个老冒险者举着杯子说：「小子，记住了：委托这东西，小的不丢人，接不住才丢人。」", "你举杯，跟他碰了一下。那顿酒，你喝得很畅快。"] /*v45inj:academy_year3_adventurer*/,
options:[
{t:"回学院", go:"academy_year3_aftermath"},
{t:"继续留在冒险队", go:"academy_year4_dorm"}
]
}};


  nodes["academy_year3_aftermath"] = function(){return{
place:"学院·实习归来",
text:["实习归来，你变了不少。同学说你晒黑了，也沉稳了。你坐在宿舍里，整理着冒险队带回的东西。", "你带回来一块在遗迹里捡到的旧徽章、一卷残缺的地图，还有一身的伤疤。你把这些一样样收好——它们不是战利品，是这一年的答案。", "夜里，你躺在床上，想起冒险队的老领队说的话：「世界比书上写的，复杂得多。」你翻了个身，看着窗外的月光。", "你忽然明白，学院的围墙，挡不住世界的风。而你已经尝过那风的滋味了。", "第三年那场变故之后，学院安静了很久。走廊里说话的人少了，脚步快了。", "你走在主道上，看见有人围在公告栏前，又散开，没有人说话。你走近看了一眼——是讣告。一个名字，一个日期，几句客套话。", "你认识那个名字。虽然不熟，但你记得他在食堂总坐同一个位子，记得他笑起来的时候，嘴角会先动。", "你站在公告栏前，看了很久。有人从你身边走过，轻声说了一句：「节哀。」你没有回头。你不知道该说什么。", "那天傍晚，你一个人去了一趟那个学生常坐的位子。位子是空的。食堂的灯亮着，照在那张空桌子上，像一个没有填完的格子。", "你坐在那里，吃了一顿饭。饭是什么味道的，你后来不记得了。你只记得，那天食堂的灯，特别亮。"] /*v45inj:academy_year3_aftermath*/,
options:[
{t:"去找墨丘利聊聊", go:"academy_year4_mercury"},
{t:"去图书馆沉淀", go:"academy_year4_library"}
]
}};


  nodes["academy_year3_church"] = function(){return{
place:"学院·教会实习",
text:["你选择了去圣城教会实习。你在那里，见到了圣城最真实的一面。", "你被安排在一间救济所帮忙。每天，你给穷人发粥、给病人换药。你发现，救济所里的修士们，是圣城少数真心做事的人。", "但你也看到，审判所的阴影无处不在。一个被「净化」过的老人，每天坐在救济所门口，眼神空洞。你问他怎么了，他只是摇头。", "实习结束时，救济所的老修士对你说：「圣城有两种光：一种照亮人，一种烧毁人。你要分清楚。」你记住了这句话。", "第三年，教会的代表来学院做了一次布道。礼堂坐满了人，连走廊都站了。", "布道者是个年轻的教士，声音温和。他讲了一个故事：一个在荒漠里迷路的人，靠着一盏灯，走回了家。", "「那盏灯，不是他自己带的。」教士说，「是他路过一座小屋时，屋里的人借给他的。」他环视全场，「你们在学院里，学的就是那盏灯。」", "你坐在人群中，听着。你注意到，前排有几个学生听得很认真，一直在记笔记。你身边有人低声说：「又来招人了。」另一个声音说：「小声点。」", "布道结束的时候，教士请大家站起来，合十。大多数人站了，少数人没动。你站在人群里，没有合十，也没有离开。", "你走出礼堂，阳光照在脸上，有点晃。你回头看了一眼礼堂的门，里面传来唱诗声，低低的，像一条安静流淌的河。"] /*v45inj:academy_year3_church*/,
options:[
{t:"回学院", go:"academy_year3_aftermath"},
{t:"多待几天", go:"city_shengcheng_explore"}
]
}};


  nodes["academy_year3_magic_tower"] = function(){return{
place:"学院·魔法塔实习",
text:["你选择了魔法塔实习。塔里的气氛，和学院完全不同——严谨、沉默、充满公式和烧瓶的气味。", "你的导师是个不苟言笑的女法师。她让你从最基础的魔力提纯做起，一遍，又一遍。你问她为什么，她说：「魔法塔不需要天才，需要不出错的人。」", "你在塔里待了三个月，学会了克制、精确、和耐心。你终于明白，魔法不是浪漫的烟花——它是一门需要敬畏的手艺。", "离开那天，导师难得地笑了笑：「你是我带过的实习生里，第三个没把塔烧了的人。」你受宠若惊：「前两个是谁？」「我，和我师父。」", "学院的魔法塔，第七层常年锁着。你问过很多人，答案都不一样。", "有说塔顶住着一位老法师的，有说塔顶封着一件危险物品的，还有一个高年级学生，压低声音跟你说：「塔顶，能看到整座学院的过去。」", "你问他是怎么知道的。他神秘地笑了笑：「我在梦里看到的。」你觉得他在开玩笑。但他又说了一句：「那个梦，我连着做了三年。每次，都到同一扇门就醒了。」", "你绕着塔走了一圈。塔身爬满藤蔓，最上面的窗子，积着厚厚的灰，看不清里面。你伸手摸了摸塔壁，石头是凉的。", "你抬头，看着那扇积灰的窗。你在想，那个做了三年梦的学长，后来怎么样了。"] /*v45inj:academy_year3_magic_tower*/,
options:[
{t:"回学院", go:"academy_year3_aftermath"},
{t:"问导师封印的事", go:"academy_year4_library"}
]
}};


  nodes["academy_year3_merchant"] = function(){return{
place:"学院·商人实习",
text:["你选择了商人路线，跟着商队走了一趟南北商路。", "你学会了看货、算账、讨价还价。你在自由城邦卖过香料，在南方港城收过海货，在北境换过毛皮。你渐渐发现，生意场上的人情，比刀剑更锋利。", "有一次，你差点被一个老商人坑了——他在货里掺了假。你识破后，他没有恼，反而笑了：「小子，眼神够毒。留下来跟我干？」你拒绝了。", "你带着一路学来的东西回到学院。你终于明白，金钱不是目的，但它能让你看清很多人——包括你自己。", "第三年的假期，你跟着商队走了一趟南边。这是你第一次，用自己的眼睛看学院外面的世界。", "商队的老把头姓周，说话带口音。一路上，他教你认路、认货、认人：「货好认，路也好认。难认的是人。」他说，「你看一个人，别听他怎么说，看他怎么对货。」", "你问他：「怎么对货？」", "他指着一匹马：「好把式，上马之前，先看马的蹄子。蹄子干净，说明主家养得仔细，人差不离。」他顿了顿，「蹄子脏的，马再好看，也别骑。」", "你把这个记下了。后来你发现，这条规矩，不只在马身上管用。", "商队到了南边港城，卸了货，又装了新货。你在码头站了一会儿，看着船来船往，忽然想：这条路上，有多少人，像他一样，看了一辈子货，也看了一辈子人。"] /*v45inj:academy_year3_merchant*/,
options:[
{t:"回学院", go:"academy_year3_aftermath"},
{t:"写实习报告", go:"academy_year2_grades"}
]
}};


  nodes["academy_year3_midterm"] = function(){return{
place:"学院·期中考核",
text:["第三年的期中考核，比往年都难。教授们像是商量好了，要给实习归来的学生一个下马威。", "你拿到考卷，题目刁钻得离谱。你咬着笔杆，把实习中学到的东西，一点点写进答案。你发现，这一年的经历，真的让你的答案有了厚度。", "考完出来，同学们在走廊里对答案，有人哀嚎，有人庆幸。马库斯凑过来：「怎么样？」「还行。」你笑了笑，「至少，每一道题，我都见过类似的。」", "你忽然明白，所谓成长，就是在考卷之外的地方，把答案写进骨子里。", "第三年的期中考试，比前两年都难。发卷子那天，教室里安静得能听见笔尖划过纸面的声音。", "你答到一半，卡在一道题上——不是不会，是你想起了别的事情。那道题讲的是一个古代术式的演变，而你昨天，刚在图书馆顶楼的书里，看见过相关的记载。", "你握着笔，停了很久。你最终没有写那个答案。你写了自己推演出来的版本，虽然你知道，它不如书里那个完备。", "交卷的时候，监考教授看了你一眼。他没有说什么。", "成绩出来那天，你拿了中上。你把卷子折好，收进抽屉里。你告诉自己，那道题，以后会解出来的。不是从书里，是从你自己的手上。"] /*v45inj:academy_year3_midterm*/,
options:[
{t:"等成绩", go:"academy_year2_grades"},
{t:"去找教授", go:"academy_year4_mercury"}
]
}};


  nodes["academy_year3_military"] = function(){return{
place:"学院·军事实习",
text:["你选择了军事实习，去了北方边境的军营。", "你跟着士兵们操练、巡逻、守夜。北境的夜风像刀子，刮在脸上生疼。你很快学会了裹紧军毯睡觉，学会了从脚步声分辨敌我。", "有一次夜哨，你在城墙上看见远处有火光。老兵告诉你：「那是深渊的边界。每年冬天，它们都会试探。」他语气平淡，像在说天气。", "实习结束，军官在你的评语上写：「可堪一用。」你看着那四个字，心里说不出是高兴还是沉重。", "第三年，学院的课程里多了一门选修——军略。你选了。", "上课的地方不在教室，在操场边上的一间旧库房。推开门的瞬间，一股皮革和铁锈的味道扑面而来。", "讲课的老军官是军部派来的，脸上有一道从左眉到下巴的旧疤。他第一堂课，什么也没讲，只让所有人站着，看了半个时辰的沙盘。", "「都看清楚了。」他终于开口，「这个沙盘，是我们花三个月做的。做的不是地形，是你们以后可能站在的地方。」他用教鞭敲了敲沙盘边缘，「你们谁要是想走这条路，就先把这个沙盘，看进脑子里。」", "你看着沙盘。山川、河流、关隘，缩成一掌大的模型。你忽然明白，他为什么让所有人站着看——因为走上这条路的人，站的时间，会比坐的时间长。", "下课的时候，他叫住你：「你刚才一直在看西边那条河谷。」你点头。他说：「那条河谷，冬天下雪，人马都过不去。但夏天——」他顿了顿，「夏天，是最好走的路，也是最容易设伏的路。」", "他走回沙盘边，把那座河谷的模型转了个方向：「记住。最好走的路，往往最险。」"] /*v45inj:academy_year3_military*/,
options:[
{t:"回学院", go:"academy_year3_aftermath"},
{t:"多留几天", go:"city_tiemenguan_explore"}
]
}};


  nodes["academy_year4_dorm"] = function(){return{
place:"学院·宿舍夜谈",
text:["第四年的一个冬夜，你和室友们围坐在宿舍的火炉边。窗外下着雪，屋里炉火通红。", "马库斯在讲他老家铁门关的事，讲他爹的刀，讲他娘的炖菜。塞西莉亚听着，忽然说：「我小时候，也想过当冒险者。」", "「现在呢？」你问。她笑了笑：「现在也想。只是——」她没有说完，只是看着炉火。", "夜深了，室友们一个个睡去。你躺在铺上，听着窗外风雪的声音，想着他们每个人说过的梦。四年了，你们都在变，但有些东西，没变。", "第四年的宿舍，比前几年安静。室友们各有各的事，回来的越来越晚，说话越来越少。", "你常常是最后一个熄灯的人。你躺在床上，听着走廊里的脚步声由远及近，又由近及远。有时候你会想，这条走廊，到底住着多少个睡不着的人。", "有一夜，你半夜醒来，看见隔壁床的室友坐在窗边，没有睡。你问他怎么了。他沉默了很久，说：「没事。」又沉默了一会儿，他说，「我只是在想，毕业以后，去哪。」", "你说：「想好了吗？」", "他说：「没有。」他转过头，看着窗外的月亮：「以前觉得，日子还长。现在一算，就剩一年了。」", "你们都没有再说话。月光从窗子里照进来，在地上铺了一层白。你在那个月光里，第一次觉得，时间真的在走。"] /*v45inj:academy_year4_dorm*/,
options:[
{t:"睡吧", go:"academy_year5_graduate_seals"},
{t:"再坐一会儿", go:"academy_year4_library"}
]
}};


  nodes["academy_year4_hide"] = function(){return{
place:"学院·躲藏",
text:["第四年，学院里不太平。你发现，有人一直在暗中盯着你。", "你开始躲藏——换了宿舍，改了路线，连吃饭都挑人少的时候。你像一只警觉的猫，在学院里无声地移动。", "有一天，你在图书馆的旧书堆里，发现一张纸条：「别躲了。我们找你，不是因为你做错了什么——是因为你知道得太多了。」", "你捏着纸条，指尖发凉。你知道得太多了——你想起那些封印、那些信、那些一路上的秘密。你烧掉纸条，看着它变成灰烬。你决定，不再躲了。", "第四年，你学会了一件事：有些东西，要藏起来。", "不是藏东西，是藏事。你发现，学院里有些事，知道的越多，越不能说。说了，轻则招人侧目，重则……你不愿去想那个重则。", "你开始习惯，在走廊里遇见熟人的时候，先看一眼四周。你开始习惯，把一些话咽回去，换成别的话说。", "你把这些变化，归结为「长大」。但有一次，你夜里经过禁书区门口，看见两个黑衣人抬着一口箱子，往地下室的方向走。你停住脚步，站在阴影里，等他们过去。", "他们走远之后，你才慢慢走出来。你低头看了看自己的手——手很稳，但你心里知道，你刚才心跳得很快。", "你回到宿舍，锁上门。你坐在床边，发了很久的呆。你忽然想，自己是从什么时候开始，变成这样的。"] /*v45inj:academy_year4_hide*/,
options:[
{t:"正面应对", go:"academy_year4_mercury"},
{t:"去找墨丘利", go:"academy_year4_mercury"}
]
}};


  nodes["academy_year4_library"] = function(){return{
place:"学院·图书馆",
text:["第四年，你大部分时间泡在图书馆。你在一楼读完了战争史，在二楼读完了七印考，在三楼——你找到了一本没有封面的旧书。", "书里夹着一张纸条：「如果你读到了这里，说明你已经走得很远了。去找墨丘利。他知道剩下的路。」", "你拿着书，在图书馆里坐了很久。你想起黄林晶的信、承天山的裂隙、沙漠里的传说——所有的线，似乎都在指向同一个方向。", "你合上书，站起来。你决定，去找墨丘利。", "第四年，你在图书馆的时间越来越长。你几乎知道每一本书的位置，包括那些不该被看见的。", "顶楼的那间屋子，门一直是锁着的。但你注意到，锁芯上有新的划痕——像是最近被人开过。", "你没有声张。你只是换了个位子，坐到了能看到那扇门的角落。你带了一本书，一坐就是一下午。", "第三天下午，你看见一个穿灰袍的人，沿着楼梯走上去。他没有拿钥匙，在门前站了一会儿，门就开了。他闪身进去，门又关上。", "你坐在角落，手里的书一直没有翻页。你等了一个时辰，那个人没有出来。", "你离开图书馆的时候，天已经黑了。你回头看了一眼那扇窗——顶楼的窗户，透出一点微光，很快又灭了。"] /*v45inj:academy_year4_library*/,
options:[
{t:"去找墨丘利", go:"academy_year4_mercury"},
{t:"继续读下去", go:"academy_year5_graduate_seals"}
]
}};


  nodes["academy_year4_mercury"] = function(){return{
place:"学院·墨丘利的办公室",
text:["你敲响了墨丘利办公室的门。他像是早就料到你会来，桌上放着两杯热茶。", "「坐吧。」他说，「你走到这里，说明该知道的，你已经知道了大半。」他推给你一卷旧地图，「剩下的路，在这上面。」", "你展开地图——上面画着七道封印的位置。前四道，你已经在心里默默标上了印记。", "「第五道，在海底。」墨丘利说，「海族的女王，等一个替大陆还债的人，等了三千年。」他抬头看着你，「你，准备好了吗？」", "第四年，你注意到墨丘利教授的异常。他上课时，会突然停下来，看着窗外，像在听什么。", "有一次，你留在教室没走，等他收拾完讲义，鼓起勇气问他：「教授，你听见什么了？」", "他看了你一会儿，然后说：「你也听见了？」他没有等你回答，走到窗边，推开窗。窗外的院子里，风正吹着那棵老树，树叶沙沙地响。", "「树叶的声音。」他说，「我小的时候，以为那是风。后来我发现——」他停住了，「有时候，那不是风。」", "他关上窗：「回去吧。天不早了。」你走出教室，回头看了一眼。他还站在窗边，没有动。", "那天夜里，你躺在床上，想起他的话。你竖起耳朵，听了一会儿——窗外只有风声。但你知道，从那天起，你听风声的时候，会多听一会儿了。"] /*v45inj:academy_year4_mercury*/,
options:[
{t:"准备好了", go:"academy_year5_graduate_seals"},
{t:"还需要时间", go:"academy_year5_graduate_rest"}
]
}};


  nodes["academy_year5_graduate_adventurer"] = function(){return{
place:"学院·毕业去向·冒险者",
text:["毕业分配时，你选择了冒险者路线。", "「想好了？」导师问你。「想好了。」你说，「世界那么大，我想亲眼去看看。」", "导师没有挽留。他递给你一枚学院的徽章：「带着它。走到哪，它都会提醒你，你曾是这里的学生。」", "你接过徽章，走出校门。晨光正好。你回头看了一眼学院的大门，然后转回身，大步走向世界。冒险者——这个头衔，你决定用一辈子去填满它。", "选择成为冒险者的那天，你把写好的申请信又改了三遍。最后，你只留了一行字：「愿以所学，行走大陆。」", "冒险者公会的代表是个矮人，胡子花白，眼睛却很亮。他看了你的信，又看了你，说：「学院出来的人，肯写『行走』两个字的，不多。」他问你，「你知道行走是什么意思吗？」", "你摇头。他笑了：「行走就是——没有地图，没有补给，没有人在你身后。」他把一枚铜质徽章推到你面前，「拿上这个。遇见难处，去任何一座城的公会，报我的名字。」", "你收下徽章。他站起来，拍拍你的肩：「小子，大陆很大。别急着证明什么，先活着。」", "你走出公会的时候，天正下着细雨。你摸了摸怀里的徽章，没有撑伞，走进雨里。"] /*v45inj:academy_year5_graduate_adventurer*/,
options:[
{t:"出发", go:"academy_year5_graduate_seals"},
{t:"再和同学告别", go:"academy_year4_dorm"}
]
}};


  nodes["academy_year5_graduate_church"] = function(){return{
place:"学院·毕业去向·教会",
text:["毕业分配时，你选择了教会路线。", "「你要去圣城？」墨丘利听到你的选择，沉默了一会儿，「那地方，水很深。」「我知道。」你说，「所以，我更要去看一看。」", "你收拾行囊时，塞西莉亚来找你：「圣城的人，不太喜欢我们学院的毕业生。」「我知道。」「那你为什么还要去？」你想了想：「因为有些问题，只有走进去，才有答案。」", "她看着你，最终点了点头：「那……一路小心。」你挥挥手，踏上前往圣城的路。", "教会的招募书，是贴在你的宿舍门上的。纸很白，字很正，落款处盖着圣城的火漆印。", "你揭下那张纸，看了两遍。上面说，教会愿意为「资质出众的毕业生」提供圣职培养，条件只有一条：宣誓服从教义。", "你拿着那张纸，去问墨丘利教授。他看了一眼，放在桌上，没有碰：「你自己想清楚。」他说，「教会的路，走上去容易，退下来难。」他顿了顿，「但他们能给你别处给不了的东西——庇护，地位，还有……一种确定。」", "你问他：「那你觉得，我该走吗？」", "他看着你，很久，说：「不是我该不该觉得。是你信不信。」他站起来，「你信他们说的，就走吧。你要是心里还有一丁点犹豫——」他把那张纸推回你面前，「就先留着。」", "你把那张纸收进抽屉里。纸很白，很干净，像什么都没写。但你每天打开抽屉，都能看见它。"] /*v45inj:academy_year5_graduate_church*/,
options:[
{t:"出发", go:"academy_year5_graduate_seals"},
{t:"去见墨丘利", go:"academy_year4_mercury"}
]
}};


  nodes["academy_year5_graduate_merchant"] = function(){return{
place:"学院·毕业去向·商人",
text:["毕业分配时，你选择了商人路线。", "「商人？」马库斯瞪大了眼睛，「你不是要当冒险者吗？」「改主意了。」你笑着说，「这一路走来，我发现，做生意也是一种冒险。」", "你跟着商队出发，从自由城邦开始。你学着看货、算账、和人打交道。你发现，商路上的人情冷暖，和战场上的刀光剑影，一样惊心动魄。", "半年后，你有了自己的第一支小商队。你站在码头，看着自己的船装满货物——你忽然明白，所谓成长，就是找到一条适合自己的路，然后走到底。", "商会的招募代表，是个说话很快的中年人。他把一沓账目推到你面前，语速比翻页还快：「学院教你的那套，在商场上不够用。但我们看重的不是那个——是你能在学院里待满五年，说明你扛得住事。」", "你听着他说商会怎么运作、货怎么走、价怎么谈，忽然问了一句：「如果有一天，货和人只能保一个，你保哪个？」", "他愣了一下，然后笑了：「你问到点子上了。」他压低声音，「商会里，答案分两种。保货的，现在都富了；保人的，现在都还活着。」他靠回椅背，「你猜，商会最后会留哪种人？」", "你没有回答。他把账目收起来：「不急着答复。想清楚了再来。」他站起来，走到门口，「对了——你要是来了，记住一句话：商会可以没有钱，但不能没有路。」", "你坐在空荡荡的会客室里，想着他那句话。路。商会的路，是谁走出来的？"] /*v45inj:academy_year5_graduate_merchant*/,
options:[
{t:"继续经商", go:"academy_year5_graduate_seals"},
{t:"回学院看看", go:"academy_year3_aftermath"}
]
}};


  nodes["academy_year5_graduate_military"] = function(){return{
place:"学院·毕业去向·军方",
text:["毕业分配时，你选择了军方。", "「军方？」导师看了你一眼，「以你的成绩，可以留校。」「我知道。」你说，「但北边的仗，总得有人去打。」", "你去了铁门关。军营里的日子，比学院苦得多——但你在训练场上流汗时，心里反而踏实。", "入伍第三个月，你跟着队伍出了一次巡逻任务。北风刮得脸疼，你握着武器，走在雪地里，忽然觉得，这就是你该在的地方。", "毕业在即，你面前的路，终于到了要选的时候。这一条，通往军营。", "征兵官坐在学院会客室里，军装笔挺。他把一份文书推到你面前：「艾尔达学院的毕业生，我们一直是想要的。」他看着你，「你在学院练的那些东西，在战场上，都能用上。」", "你翻着文书。条款很多，但核心就一条：签了，你就是军部的人，去向由军部分配。", "「我可以问，会把我派到哪吗？」你问。", "他想了想，说：「北边。铁门关。」他顿了顿，「那边一直缺人。尤其是，能看懂地图、能带小队的人。」他合上文件夹，「你要是去了，从你到的那天起，你就是北边的人了。」", "你没有立刻签字。你走到窗边，看着外面。学院的钟楼在夕阳里，投下长长的影子。你在想，铁门关的风，和这里的，有什么不一样。"] /*v45inj:academy_year5_graduate_military*/,
options:[
{t:"继续服役", go:"academy_year5_graduate_seals"},
{t:"写信回学院", go:"academy_year4_dorm"}
]
}};


  nodes["academy_year5_graduate_rest"] = function(){return{
place:"学院·毕业去向·休息",
text:["毕业分配时，你选择了暂时休息。", "「不急着定去向？」导师问。你点点头：「走了太远的路，想停下来，想一想。」", "导师没有反对。他给你安排了一间安静的宿舍，让你安心休整。你在学院里住了下来，每天读书、散步、想事情。", "一个月后，你想清楚了。你收拾好行囊，去找导师：「我想去大陆走走——不是为了任务，只是想亲眼看看，这个世界，值得不值得。」导师笑了：「去吧。想清楚了，就出发。」", "毕业前的一个黄昏，你一个人坐在学院后山的山坡上，看着下面的校园。", "钟楼在夕阳里，楼顶的旗子被风吹得猎猎作响。食堂的烟囱冒着烟，操场上有人在跑步，图书馆的灯，一盏一盏地亮起来。", "你忽然意识到，这些你每天看见的东西，很快就要看不到了。不是它不见了，是你不在这里了。", "你想起入学第一天的自己——背着行囊，站在校门口，不知道该往哪走。现在你认得这里的每一条路，知道哪条路什么时候人多，哪个角落适合一个人待着。", "你坐了很久，坐到夕阳完全落下，坐到操场上的人走光，坐到图书馆的灯也灭了大半。", "你站起来，拍拍裤子上的草屑，往宿舍走。走到半路，你停下来，回头看了一眼。钟楼的轮廓在夜色里，安静地立着，像在等你道别。"] /*v45inj:academy_year5_graduate_rest*/,
options:[
{t:"出发", go:"academy_year5_graduate_seals"},
{t:"再住几天", go:"academy_year4_library"}
]
}};


  nodes["academy_year5_graduate_seals"] = function(){return{
place:"学院·毕业去向·七印",
text:["毕业分配时，你选择了追寻七印。", "墨丘利听到你的选择，沉默了很久。然后他说：「这条路，可能没有尽头。」「我知道。」「也可能，走不到终点。」「我也知道。」「那你还要去？」", "你看着他，说：「我不去，谁去？」墨丘利看着你，很久，然后笑了——那是你第一次见他笑得这么舒展。", "他从抽屉里拿出一卷旧地图，递给你：「拿去吧。这是我毕生收集的，关于七印的全部线索。」你接过地图，郑重地收好。走出办公室时，墨丘利在你身后说：「活着回来。」", "关于封印的研究，你写了三年。毕业前，导师把你的论文放在桌上，厚厚一沓，纸边都卷了。", "「写完了。」他说。你点头。他翻开第一页，又合上：「你想过没有，这篇论文写出去，会怎么样？」", "你摇头。他说：「会有人来找你。各种人。想研究的，想利用的，想让你闭嘴的。」他顿了顿，「你真的想好了？」", "你看着那沓纸。你知道他问的是什么——不是论文写得怎么样，是你愿不愿意，从此跟这件事绑在一起。", "你伸手，把论文拿起来，抱在怀里：「写都写了。总不能，让它烂在抽屉里。」", "他看了你很久，然后笑了：「那好。」他把自己的印章推过来，「盖上。从今以后，你的名字，跟这沓纸，是一体的了。」", "你盖上印章。墨迹慢慢干了。你看着那个印，忽然觉得，它像一个小小的、烧红的烙铁，落下来，就不动了。"] /*v45inj:academy_year5_graduate_seals*/,
options:[
{t:"出发", go:"seal1_act1_intro"},
{t:"最后看一次学院", go:"academy_year4_dorm"}
]
}};


  nodes["academy_graduation_trial"] = function(){ return {
  place:"毕业试炼",
  text:["毕业试炼。","年底，毕业试炼开始了。","每个毕业班的学生，都被带到了学院的地下——一个巨大的、迷宫一样的空间。","「毕业试炼的内容，每个人都不同。」院长说，他站在迷宫的入口，「你们将进入迷宫，面对你们内心最深处的恐惧和渴望。」","「通过试炼的人，可以顺利毕业。通不过的人……会被困在迷宫里，直到你们想通为止。」","「祝你们好运。」","你走进了迷宫。","迷宫里很暗，只有墙壁上的符文发出微弱的光。你走了很久，经过了一个又一个岔路口，最后，你来到了一个房间。","房间的中央，有一面镜子。","你走到镜子前，看着镜子里的自己。","然后，镜子里的你，动了。","不是跟着你动。是自己动了。","「你终于来了。」镜子里的你说，声音和你一模一样，但带着一种……冰冷的语气。","「你是谁？」你问。","「我是你。」镜子里的你说，「或者说，我是你的另一面。你内心深处，那个被你压抑的、黑暗的一面。」","「你害怕的，不是深渊，不是死亡，不是失败。你害怕的是——你自己。」","「你害怕自己会变成黄林晶那样的人，为了拯救世界，牺牲自己；你害怕自己会变成暗蚀会那样的人，为了真相，不择手段；你害怕自己会变成……你最讨厌的那种人。」","你看着镜子里的自己，心里有一种说不出的震撼。","「你说得对。」你说，「我确实害怕。」","「但害怕，不代表退缩。」你说，「我害怕变成那样的人，所以我会时刻提醒自己，不要变成那样的人。」","「我会用我的方式，拯救世界。不需要牺牲，不需要不择手段。」","镜子里的你，沉默了很久。然后，笑了——那笑容里，有释然，有欣慰。","「你通过了。」镜子里的你说，「你接受了自己的黑暗面，也坚持了自己的光明。」","「你毕业了。」","镜子碎了。房间的墙壁开始消失，你发现自己站在了迷宫的出口。","阳光洒在你身上，温暖而明亮。院长站在出口，看着你，点了点头。","「恭喜你。」他说，「你通过了毕业试炼。」","你走出迷宫，看到了其他同学——有的已经出来了，有的还在里面。塞西莉亚已经出来了，她站在一旁，看着你，笑了笑。","「你也通过了？」她问。","「嗯。」你说，「你呢？」","「我也通过了。」塞西莉亚说，她的眼睛里，有一丝你看不懂的情绪，「我的试炼，是面对我家族的真相。」","「你呢？你的试炼是什么？」","「面对我自己。」你说。","塞西莉亚点了点头，没有再问。","你站在阳光下，看着迷宫的入口。你的毕业试炼，结束了。","你的学院生活，也即将结束了。","五年了。你从一个懵懂的新生，变成了一个即将毕业的学生。你经历了很多，学到了很多，也失去了很多。","但你知道，这不是结束。这是开始。","毕业后，你将踏上真正的旅程——寻找铸印，修复七印，阻止深渊之主。","你的传奇，才刚刚开始。"],
  options:[
    {t:"小心探索", check:{a:"AGI",sk:"潜行",label:"敏捷·探索",target:65},
      tier:{
        crit:function(){return[pickV(["你巧妙地避开了所有陷阱和怪物，顺利取回了物品，还发现了一些额外的宝藏。获得：毕业物品+宝藏，声望+10。","你不仅完成了试炼，还解开了遗迹里的一个古代谜题！获得：毕业物品+古代知识，声望+15。"],"trial_careful_crit")]},
        ok:function(){return[pickV(["你完成了试炼，取回了物品。获得：毕业物品。","试炼完成。"],"trial_careful_ok")]},
        fail:function(){return[pickV(["你在遗迹里遇到了麻烦，虽然完成了试炼，但受了伤。HP-10。","试炼很艰难。"],"trial_careful_fail")]},
        critfail:function(){return[pickV(["你在遗迹里被深渊生物围攻了，受了重伤，虽然逃了出来，但物品丢了。HP-25，试炼失败。","你触发了遗迹的自毁机制，差点死掉。HP-30，SAN-15。"],"trial_careful_critfail")]}
      },
      effect:{time:3}, go:"academy_graduation"},
    {t:"正面突破", check:{a:"STR",sk:"格斗",label:"力量·战斗",target:60},
      tier:{
        crit:function(){return[pickV(["你一路斩杀，所向披靡，顺利取回了物品！获得：毕业物品，声望+15。","你在战斗中突破了自己的极限，境界提升了！获得：毕业物品，境界+1。"],"trial_force_crit")]},
        ok:function(){return[pickV(["你完成了试炼，虽然受了点伤。获得：毕业物品，HP-5。","试炼完成。"],"trial_force_ok")]},
        fail:function(){return[pickV(["你在战斗中受了伤，不得不撤退。HP-15。","试炼失败。"],"trial_force_fail")]},
        critfail:function(){return[pickV(["你被强大的怪物打败了，差点死掉。HP-30，试炼失败。","你在战斗中被深渊之力侵蚀了。HP-20，SAN-20。"],"trial_force_critfail")]}
      },
      effect:{time:3}, go:"academy_graduation"},
    {t:"用智慧解谜", check:{a:"INT",sk:"知识",label:"智力·解谜",target:65},
      tier:{
        crit:function(){return[pickV(["你用智慧解开了遗迹里的所有谜题，不战而屈人之兵，顺利取回了物品。获得：毕业物品，知识+3。","你不仅解开了谜题，还发现了遗迹的秘密通道！获得：毕业物品+隐藏宝藏。"],"trial_wisdom_crit")]},
        ok:function(){return[pickV(["你解开了大部分谜题，完成了试炼。获得：毕业物品。","试炼完成。"],"trial_wisdom_ok")]},
        fail:function(){return[pickV(["你在一个谜题上卡住了，花了很多时间才解开。","试炼很艰难。"],"trial_wisdom_fail")]},
        critfail:function(){return[pickV(["你解错了谜题，触发了陷阱，受了重伤。HP-20。","你被谜题困住了，三天时间到了还没出来，试炼失败。"],"trial_wisdom_critfail")]}
      },
      effect:{time:3}, go:"academy_graduation"}
  ]
};}


  nodes["academy_graduation"] = function(){ return {
  place:"毕业典礼",
  text:["毕业典礼。","毕业典礼，在大礼堂举行。","毕业班的学生，穿着黑色的学士袍，坐在长椅上。教授们坐在讲台上，院长站在最前面。","你坐在第一排，手里拿着你的毕业证书——金色的边框，上面写着你的名字，还有院长的签名。","「同学们。」院长说，他的声音在礼堂里回荡，「今天，是你们毕业的日子。」","「五年前，你们走进这扇门，还是一群懵懂的少年。五年后，你们走出这扇门，将成为大陆的栋梁。」","「我希望你们，不管走到哪里，都不要忘记在学院里学到的东西——知识，技能，还有……做人的道理。」","「这个世界，现在很不安稳。战争，净化令，深渊的威胁……每一样，都在考验着我们。」","「但我相信，你们有能力，去面对这一切。」","「因为你们，是艾尔达魔法学院的毕业生。」","掌声雷动。","典礼结束后，你和同学们一起，走出了大礼堂。","阳光洒在你们身上，温暖而明亮。庭院里，很多家长在等着他们的孩子。欢声笑语，充满了整个学院。","你站在人群中，看着这一切，心里有一种说不出的感慨。","塞西莉亚走了过来，她的手里拿着一杯酒。","「毕业了。」她说，举起酒杯，「恭喜。」","「恭喜。」你说，也举起了酒杯。","你们碰了碰杯，喝了一口。","「毕业后，你打算怎么办？」塞西莉亚问。","「去旅行。」你说，「去找一样东西。」","「什么东西？」","「铸印。」你说。","塞西莉亚的眼睛亮了：「铸印？黄林晶的第十二件神器？」","「你知道？」","「我研究了很久。」塞西莉亚说，她的眼睛里闪着兴奋的光芒，「我一直在找它。」","「那……一起？」你问。","塞西莉亚笑了：「好。一起。」","你们站在庭院里，喝着酒，聊着未来。阳光洒在你们身上，温暖而明亮。","你的学院生活，结束了。但你的冒险，才刚刚开始。","你将和塞西莉亚一起，踏上寻找铸印的旅程。你将走遍大陆，经历无数的冒险，面对无数的危险。","但你不怕。因为你知道，你不是一个人。","风吹过庭院，带来了远方的气息。你深吸一口气，朝学院的大门走去。","再见了，艾尔达魔法学院。","你将带着在这里学到的一切，去拯救这个世界。","你的传奇，才刚刚开始。"],
  options:[
    {t:"选择毕业去向", effect:{time:1}, go:"academy_graduation_choice"},
    {t:"和同学们告别", effect:{time:1}, go:"academy_classmates_final"}
  ]
};}


  nodes["academy_graduation_choice"] = function(){ return {
  place:"毕业去向",
  text:["毕业抉择。","毕业典礼结束后，你站在学院的大门口，看着外面的世界。","道路在你面前延伸，通向远方。你不知道，这条路的尽头，有什么在等着你。","塞西莉亚站在你旁边，她已经收拾好了行李，准备和你一起出发。","「你真的想好了？」她问，「去找铸印，很危险。」","「想好了。」你说，「我必须找到它。」","就在这时，一个声音从你身后传来。","「等等。」","你转过身。院长站在你身后，他的手里拿着一个东西。","「院长？」你说。","院长走到你面前，把手里的东西递给你。那是一封信，信封上写着你的名字。","「这是墨丘利让我交给你的。」院长说，「他说，等你毕业的时候，再给你。」","你接过信，手在发抖。墨丘利——他被带走已经一年了。你一直没有他的消息。","「他……还好吗？」你问。","院长沉默了一会儿，然后说：「他还活着。但具体情况，我也不知道。」","「他在信里，应该写了些什么。」","你拆开信，读了起来。","信很短，只有几行字：","「我的学生：","当你读到这封信的时候，你应该已经毕业了。恭喜你。","我被教会关在圣城的地牢里。但你不用担心，我有办法出来。","我要告诉你一件事——铸印，不在死亡沙漠。它在……守望者的秘密基地里。","奥雷利安知道它在哪里。去找他。","还有，小心守望者。他们……不完全可信。","保重。","——墨丘利」","你合上书，手在发抖。","铸印在守望者的秘密基地里。奥雷利安知道它在哪里。","「怎么了？」塞西莉亚问。","你把信递给她。她看了一眼，脸色也变了。","「守望者？」她说，「我们要去守望者的秘密基地？」","「嗯。」你说，「我们要去找奥雷利安。」","你转过身，看着院长。","「院长，你知道守望者的秘密基地在哪里吗？」","院长沉默了很久，然后说：「知道。但我不能告诉你。」","「为什么？」","「因为守望者的秘密基地，是大陆上最大的秘密。」院长说，他的眼睛里有一丝复杂的情绪，「如果我告诉了你，我就背叛了守望者。」","「但——」他说，从怀里拿出一枚徽章，递给你，「你可以用这个，联系守望者。他们会带你去的。」","你接过徽章——和墨丘利给你的那枚，一模一样。","「谢谢你。」你说。","院长点了点头，转身走了。他的背影，在夕阳下显得很孤独。","你看着手里的徽章，又看了看塞西莉亚。","「走吧。」你说，「去找守望者。」","「好。」塞西莉亚说。","你们转身，朝远方走去。","你的学院生活，彻底结束了。但你的冒险，才刚刚开始。","你将去守望者的秘密基地，找奥雷利安，找铸印，找拯救世界的方法。","风吹过道路，带来了远方的气息。你深吸一口气，加快了脚步。","你的传奇，才刚刚开始。而世界，正在等待着你。"],
  options:[
    {t:"加入自由城邦", effect:{time:1,自由城邦_rep:15,flag:"graduate_free"}, go:"chapter_3_transition"},
    {t:"加入北方公国联盟", effect:{time:1,北方_rep:15,flag:"graduate_north"}, go:"chapter_3_transition"},
    {t:"加入光明教会", effect:{time:1,教会_rep:15,flag:"graduate_church"}, go:"chapter_3_transition"},
    {t:"加入精灵王国", effect:{time:1,精灵_rep:15,flag:"graduate_elf"}, go:"chapter_3_transition"},
    {t:"加入矮人王国", effect:{time:1,矮人_rep:15,flag:"graduate_dwarf"}, go:"chapter_3_transition"},
    {t:"做自由冒险者", effect:{time:1,flag:"graduate_adventurer"}, go:"chapter_3_transition"},
    {t:"留校任教", effect:{time:1,flag:"graduate_teacher"}, go:"chapter_3_transition"},
    {t:"加入守望者", check:{a:"SPR",sk:"意志",label:"灵性·考验",target:70},
      tier:{
        crit:function(){return[pickV(["你通过了守望者的考验，成为了一名候选执灯人！声望+20，获得：守望者徽章。","奥雷利安亲自接见了你，他认为你是一个可造之材。声望+30，奥雷利安好感+20。"],"graduate_watcher_crit")]},
        ok:function(){return[pickV(["你通过了基本考验，成为了守望者的外围成员。声望+10。","你获得了候选资格。"],"graduate_watcher_ok")]},
        fail:function(){return[pickV(["你没能通过考验。","守望者认为你还不够资格。"],"graduate_watcher_fail")]},
        critfail:function(){return[pickV(["你在考验中受了重伤，还被深渊之力侵蚀了。HP-20，SAN-15。","你失败了，还被守望者列入了观察名单。声望-5。"],"graduate_watcher_critfail")]}
      },
      effect:{time:1}, go:"chapter_3_transition"}
  ]
};}


  nodes["academy_classmates"] = function(){ return {
  place:"同学互动",
  text:["同学群像。","五年的学院生活，你认识了很多人。","他们有的成了你的朋友，有的成了你的对手，有的成了你的敌人，有的……成了你生命中最重要的人。","你坐在学院的庭院里，看着来来往往的学生，回忆着这五年来遇到的每一个人。","艾伦——你的室友，你最好的朋友。他是北方公国的贵族子弟，战士系的天才。他总是笑嘻嘻的，看起来没心没肺，但在关键时刻，他永远是最可靠的那个。","蕾克斯——红发的女孩，战士系的，和艾伦同班。她很活泼，很健谈，总是叽叽喳喳地说个不停。她喜欢艾伦，但艾伦似乎没有察觉。","塞西莉亚——黑发的女孩，历史系的。她很安静，很聪明，总是泡在图书馆里。她的家族，有一个不为人知的秘密。而她，一直在调查那个秘密。","影——暗蚀会支部的成员，守望者的卧底。他穿着黑袍，戴着面具，总是在深夜里出没。他和你一样，在寻找真相。","托马斯——三年级的灵魂法师，被净化令监察处带走了。你不知道他现在怎么样了，是死是活。","还有很多很多人——你的教授，你的同学，你的对手，你的盟友。","他们每个人，都有自己的故事，自己的秘密，自己的命运。","而你的故事，已经和他们的故事，纠缠在了一起。","风吹过庭院，带来了远处的钟声。你站起来，拍了拍身上的灰尘。","毕业了。你要离开学院了。但这些人，这些事，这些回忆，你永远不会忘记。","你朝学院的大门走去。阳光洒在你身上，温暖而明亮。","你的同学们，有的已经离开了，有的还在学院里。但你知道，总有一天，你们会再见面的。","在大陆的某个地方，在某个意想不到的时刻。","而那时候，你们的身份，可能已经完全不同了。","你深吸一口气，走出了学院的大门。","你的学院生活，结束了。但你的冒险，才刚刚开始。","而你的同学们，将在未来的某一天，以你意想不到的方式，重新出现在你的生命中。"],
  options:[
    {t:"和艾伦聊天", effect:{time:1,艾伦_bond:5}, go:"classmate_allen"},
    {t:"和雷克斯聊天", effect:{time:1}, go:"classmate_rex"},
    {t:"和塞西莉亚聊天", effect:{time:1}, go:"classmate_cecilia"},
    {t:"参加同学聚会", check:{a:"CHA",sk:"社交",label:"魅力·社交",target:55},
      tier:{
        crit:function(){return[pickV(["你在聚会上表现出色，和同学们的关系都变好了。同学好感+10，声望+5。","你在聚会上认识了很多新朋友，还得到了一些有用的情报。线索+1。"],"party_crit")]},
        ok:function(){return[pickV(["你和同学们度过了愉快的时光。同学好感+5。","聚会很开心。"],"party_ok")]},
        fail:function(){return[pickV(["你在聚会上不太合群。","聚会一般。"],"party_fail")]},
        critfail:function(){return[pickV(["你在聚会上说错了话，得罪了人。同学好感-5，声望-3。","你喝多了，出了洋相。声望-5。"],"party_critfail")]}
      },
      effect:{time:3}, go:"academy_year1_main"},
    {t:"离开", effect:{time:0}, go:"academy_year1_main"}
  ]
};}


  nodes["academy_classmates_final"] = function(){ return {
  place:"最后的告别",
  text:["同学·终章。","五年的学院生活，结束了。","你的同学们，各奔东西。有的参了军，有的回了家，有的继续深造，有的……踏上了和你一样的冒险旅程。","你站在学院的大门口，最后看了一眼这座你生活了五年的地方。","白色的大理石门柱，刻着七职业的徽记。庭院里的喷泉，还在喷着蓝色的水。大礼堂的壁画，还在讲述着黄林晶的故事。塔楼的窗户，还在阳光下泛着光。","这里，有你五年的回忆。有欢笑，有泪水，有冒险，有成长。","你深吸一口气，转身，朝远方走去。","塞西莉亚跟在你身边，她的手里，握着那个黄林晶留下的玉佩。","「我们接下来去哪里？」她问。","「去找守望者。」你说，「找奥雷利安。他知道铸印在哪里。」","「好。」塞西莉亚说。","你们走在大陆的道路上，阳光洒在你们身上，温暖而明亮。","你不知道，前方有什么在等着你。你不知道，你能不能找到铸印，能不能拯救世界。","但你知道，你不是一个人。你有塞西莉亚，有艾伦，有蕾克斯，有影，有墨丘利，有所有你认识的人。","他们都在，以自己的方式，支持着你。","风吹过道路，带来了远方的气息。你深吸一口气，加快了脚步。","你的学院生活，结束了。但你的传奇，才刚刚开始。","而你的同学们，将在未来的某一天，以你意想不到的方式，重新出现在你的生命中。","有的会成为你的盟友，有的会成为你的敌人，有的会成为你的爱人，有的会……为你牺牲。","但那都是以后的事了。","现在，你只需要往前走。","「走吧。」你说，「别让世界等太久。」","「好。」塞西莉亚说，她笑了笑，跟上了你的脚步。","你们的身影，在夕阳下越拉越长，最后消失在了道路的尽头。","而学院的钟声，在你们身后，悠悠地响着。","像是在告别，又像是在祝福。","再见了，艾尔达魔法学院。","你将带着在这里学到的一切，去拯救这个世界。"],
  options:[
    {t:"和大家约定以后再见", effect:{time:1,flag:"classmate_promise"}, go:"academy_graduation_choice"},
    {t:"默默离开", effect:{time:1,sanLoss:3}, go:"academy_graduation_choice"}
  ]
};}


  nodes["academy_seal_lesson"] = function(){
  return {
    place: "学院 · 历史课",
    text: function(){
      const arr = [];
      arr.push("历史课的教室在二楼，窗户对着操场。");
      arr.push("老教授在黑板上画了一张大陆地图，然后在七个位置画了圈。");
      arr.push("「七印。」教授敲了敲黑板，粉笔灰落下来。「黄林晶大人三千年前建造的七道封印，将深渊之物挡在世界之外。第一印在铁门关——可惜，已经碎了。」");
      arr.push("教室里一阵低语。教授等声音平息，继续说：「其余六印仍然稳定。兽人草原、精灵世界树、矮人熔炉心、南方深海、东部时光裂隙、死亡沙漠。每一道印都有守护者。」");
      arr.push("你举手问：「教授，第一印碎了，为什么世界没有毁灭？」");
      arr.push("教授看了你一眼。那眼神很复杂——像是赞赏，又像是警惕。");
      arr.push("「好问题。」他说，然后转身继续讲课，没有回答。");
      arr.push("下课后，你在走廊里被叫住了。是墨丘利教授。他靠在墙上，手里把玩着一枚银币。");
      arr.push("「你问了一个不该在课堂上问的问题。」墨丘利说，嘴角似笑非笑。「想知道答案吗？今晚来我的研究室。」");
      return arr;
    },
    options: [
      { t:"今晚去墨丘利研究室", go:"academy_seal_mercury", effect:{time:1, flag:"mercury_seal_invite"} },
      { t:"不去，自己去图书馆查", check:"INT", go:"academy_seal_research", effect:{time:2} },
      { t:"把问题埋在心里，专心上课", go:"academy_seal_underground", effect:{time:1} }
    ]
  };
};


  nodes["academy_seal_mercury"] = function(){
  return {
    place: "墨丘利研究室 · 深夜",
    text: function(){
      const arr = [];
      arr.push("墨丘利的研究室在教学楼地下室最深处。门是铁的，上面刻着灵魂魔法的封印符文。");
      arr.push("你敲门，门自己开了。里面点着七根蜡烛，每根蜡烛的火焰颜色都不同。");
      arr.push("墨丘利坐在桌后，面前摊着一张古老的羊皮纸。纸上画的也是七印——但和课堂上的版本不一样。");
      arr.push("「坐。」他指了指对面的椅子。「你问第一印碎了为什么世界没毁灭。答案是——因为七印封印的不是深渊。」");
      arr.push("你愣住了。");
      arr.push("「官方说七印封印深渊，那是给普通人听的。」墨丘利的手指在羊皮纸上划过。「真相是，七印分割了某种更古老的东西。比深渊更古老。比神明更古老。」");
      arr.push("「黄林晶用七道印把它切成七块，分别封印在大陆七个位置。每一块对应一种原初的情感——饥饿、愤怒、傲慢、贪婪、嫉妒、懒惰、色欲。」");
      arr.push("「第一印碎了，只是饥饿那一块逃了出来。世界不会毁灭，但会……越来越饿。」");
      arr.push("他抬起头，眼睛在烛光下显得很深。「你那个梦，看到的就是饥饿。它在找你。或者说，它在找所有能看到符文的人。」");
      return arr;
    },
    options: [
      { t:"问他为什么告诉我这些", check:"SPR", go:"academy_seal_underground", effect:{flag:"mercury_trust_1"} },
      { t:"问守望者和七印的关系", go:"academy_seal_underground", effect:{flag:"watcher_seal_knowledge", knowledge:10} },
      { t:"感到害怕，想离开", check:"CON", go:"academy_seal_underground", effect:{sanLoss:5} }
    ]
  };
};


  nodes["academy_seal_underground"] = function(){
  return {
    place: "学院地下遗迹 · 探索",
    text: function(){
      const arr = [];
      arr.push("墨丘利告诉你，学院建在一处古代遗迹之上。");
      arr.push("「这所学院的地基下面，有一条通道。」他在地图上指了一个位置。「通向某个和七印有关的东西。我查了三十年，还没找到入口。」");
      arr.push("你花了三个晚上在图书馆翻找学院的建筑图纸。终于在一份三百年前的修缮记录里发现了线索——旧教堂的告解室下面，有一个被封死的地下室。");
      arr.push("你在一个无月的夜晚撬开了告解室的地板。下面确实有台阶，向下延伸进黑暗。");
      arr.push("你举着火把走下去。墙壁上刻满了符文——和你梦里的一模一样。");
      arr.push("台阶尽头是一个圆形的房间，中央有一座石台。石台上空无一物，但石台周围的地面上有一个巨大的、被磨平的印记。");
      arr.push("你认出了那个印记——是七印之一的徽记。具体是哪一道，你说不上来，但你的后脑勺在发麻。");
      arr.push("石台后面的墙上刻着一行字，被岁月磨得模糊了。你凑近看，勉强辨认出几个字：「……此为备份……若七印皆碎……以此重启……」");
      arr.push("火把突然灭了。你在黑暗中站了很久，听到自己的心跳声。然后你转身跑了上去。");
      return arr;
    },
    options: [
      { t:"告诉墨丘利你的发现", go:"academy_seal_research", effect:{flag:"underground_found", mercury_bond:5} },
      { t:"自己继续研究，不告诉任何人", check:"INT", go:"academy_seal_research", effect:{flag:"underground_secret", knowledge:15, sanLoss:3} },
      { t:"把入口重新封死，当作没看见", go:"academy_seal_research", effect:{flag:"underground_sealed", sanRecovery:5} }
    ]
  };
};


  nodes["academy_seal_research"] = function(){
  return {
    place: "学院 · 独立研究",
    text: function(){
      const arr = [];
      arr.push("你开始系统地研究七印。");
      arr.push("图书馆里关于七印的书有十七本，但十五本是官方版本——内容大同小异，都是「黄林晶英雄建造七印封印深渊」的叙事。");
      arr.push("另外两本是禁书，需要教授签字才能借阅。一本叫《封印之外》，作者是三百年前的一位学者，后来被教会烧死了。另一本没有书名，只有一个符号——和你梦里的符文一样。");
      arr.push("你花了一个月读完这两本书。");
      arr.push("《封印之外》的作者认为，七印不是防御工事，而是牢笼。牢笼里关的不是敌人，是「世界的一部分」。黄林晶切掉了世界的七种情感，把它们封印起来，让剩下的世界得以「正常」运转。");
      arr.push("那本无名书更奇怪。它没有文字，只有图——七道印的结构图，每一道印都画了内部的纹路。你看不懂那些纹路，但你发现，每一道印的中心都有一个极小的、相同的符号。");
      arr.push("你把那个符号描下来，拿给墨丘利看。他看了很久，然后说：「这是黄林晶的签名。他在每一道印里都留了后门。」");
      arr.push("「为什么？」你问。");
      arr.push("墨丘利沉默了一会儿。「因为他不确定自己做的是对的。」");
      return arr;
    },
    options: [
      { t:"继续深入研究黄林晶的动机", check:"INT", go:"seal_1_arrival", effect:{knowledge:20, flag:"hlj_motive_research"} },
      { t:"开始调查第一印铁门关的真相", go:"seal_1_arrival", effect:{flag:"seal_1_investigate", knowledge:10} },
      { t:"暂停研究，专注学业和生活", go:"fc_jiaohui_entry", effect:{time:30, sanRecovery:10} }
    ]
  };
};


  nodes["academy_choice_intro"] = function(){
  initAcademyV28();
  return {
    place:"学院选择",
    text:function(){
      const arr=[];
      arr.push("【选择你的学院】");
      arr.push("");
      arr.push("艾尔达大陆上有十几所学院，每一所都有自己的传统、强项和秘密。");
      arr.push("");
      arr.push("你报考哪所学院，将决定你未来五年的人生——你的同学、你的教授、你的秘密、你的毕业去向。");
      arr.push("");
      arr.push("三大顶尖学院竞争激烈，种族学院各有特色，普通学院也有隐藏的天才。");
      arr.push("");
      arr.push("出身决定起点，但不决定终点。乡村学院的天才，也可能一鸣惊人。");
      arr.push("");
      arr.push("（每所学院都有不同的入学考试、课程、同学、秘密和毕业去向。多周目可以体验不同学院。）");
      arr.push("烛火把你的影子投在墙上，拉得很长。你面前摊着一份职业名录，纸张泛黄，边角卷起，上面密密麻麻写满了前人的批注。");arr.push("有的批注是刚劲的楷书：「选了它，一辈子就是它了。」有的批注潦草得几乎认不出：「别学我，我后悔了。」还有的，只在名字旁边画了一枚小小的、褪色的徽记。");arr.push("你想起了出身地。想起了那些教过你、帮过你、也骗过你的人。你走到这里，带着他们的痕迹——而现在，你要选一条属于自己的路。");arr.push("烛芯爆了一下，火光跳了跳。你伸出手，指尖在几个名字上方停住，迟迟没有落下。");arr.push("有些选择，选了就是一生。你知道的。可你也知道，不选，也是一种选。");return arr;
    } /*v45inj:academy_choice_intro*/,
    options:[
      {t:"艾尔达大陆学院（交汇城·综合中立）", go:"academy_admission_elda", effect:{}},
      {t:"圣光神学院（圣城·教会控制）", go:"academy_admission_holy", effect:{}},
      {t:"帝国军事学院（承天山·军方控制）", go:"academy_admission_military", effect:{}},
      {t:"查看更多学院（种族学院/普通学院）", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_choice_more"] = function(){
  return {
    place:"更多学院",
    text:function(){
      const arr=[];
      arr.push("【更多学院】");
      arr.push("");
      arr.push("除了人类三大顶尖学院，大陆上还有种族学院和普通学院。");
      arr.push("");
      arr.push("种族学院入学难度高，但有独特的传承和秘密。普通学院条件差，但也有隐藏的天才。");
      arr.push("");
      arr.push("龙语学院已毁千年，但遗迹中可能藏着龙族的传承。");
      return arr;
    },
    options:[
      {t:"银叶学院（精灵·自然魔法）", go:"academy_admission_elf", effect:{}},
      {t:"铁峰锻造学院（矮人·锻造工程）", go:"academy_admission_dwarf", effect:{}},
      {t:"战神学院（兽人·战斗萨满）", go:"academy_admission_orc", effect:{}},
      {t:"绿野学院（半身人·农业烹饪）", go:"academy_admission_halfling", effect:{}},
      {t:"普通学院（8所，查看详情）", go:"academy_choice_normal", effect:{}},
      {t:"返回顶尖学院", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_choice_normal"] = function(){
  return {
    place:"普通学院",
    text:function(){
      const arr=[];
      arr.push("【普通学院】");
      arr.push("");
      arr.push("普通学院遍布大陆各大城市，条件参差不齐，但每所都有自己的特色。");
      arr.push("");
      arr.push("自由城邦商学院（商业贸易）/ 北方战士学院（边防战斗）/ 南方航海学院（航海海洋魔法）");
      arr.push("东部文学院（文学历史）/ 西部游侠学院（游侠探险）/ 教会法学院（教会法审判）");
      arr.push("矮人工程学院（工程建筑）/ 精灵艺术学院（艺术音乐）");
      arr.push("");
      arr.push("乡村学院（私塾/教堂学堂/铁匠学徒/萨满传承）——条件最差，但可能有隐藏的古老传承。");
      return arr;
    },
    options:[
      {t:"自由城邦商学院", go:"academy_admission_business", effect:{}},
      {t:"北方战士学院", go:"academy_admission_northern", effect:{}},
      {t:"南方航海学院", go:"academy_admission_southern", effect:{}},
      {t:"东部文学院", go:"academy_admission_eastern", effect:{}},
      {t:"西部游侠学院", go:"academy_admission_western", effect:{}},
      {t:"教会法学院", go:"academy_admission_law", effect:{}},
      {t:"矮人工程学院", go:"academy_admission_dwarfeng", effect:{}},
      {t:"精灵艺术学院", go:"academy_admission_elfart", effect:{}},
      {t:"乡村学院（私塾/学徒制）", go:"academy_admission_village", effect:{}},
      {t:"返回", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_admission_elda"] = function(){
  return {
    place:"艾尔达大陆学院·入学考试",
    text:function(){
      const arr=[];
      arr.push("艾尔达大陆学院的入学考试在交汇城举行。");
      arr.push("");
      arr.push("考试分为三部分：基础魔法理论、属性测评、面试。");
      arr.push("");
      arr.push("你站在考场外，看着来自大陆各地的考生。有人紧张，有人自信，有人在低声背诵咒语。");
      arr.push("");
      arr.push("一个穿灰袍的教授走出来：「下一批，跟我来。」");
      arr.push("艾尔达学院的入学考试，藏在一条回廊里。");arr.push("考官领你穿过七道门，每一道门后都有一道考题——不是书本上的题，是活题。第七道门前，考官停下来，看着你：「最后一道题，在这里等你。」");arr.push("你推开门。门后是一间空房间，只有一张桌子，桌上放着一盏灯，灯下压着一张纸。");arr.push("纸上只有一句话：「你为什么要来？」");arr.push("你站在灯前，想了很久。你可以说为了知识，为了力量，为了改变命运。可你最后拿起笔，写下的是另一个答案。");arr.push("你放下笔，走出门。考官接过纸看了一眼，沉默了很长时间，然后说：「欢迎你，新同学。」");arr.push("你没有问他那答案合格在哪。你只是知道，那一刻，你写的是真话。");return arr;
    } /*v45inj:academy_admission_elda*/,
    options:[
      {t:"参加入学考试", go:"academy_elda_exam", effect:{}},
      {t:"查看学院详情", go:"academy_elda_detail", effect:{}},
      {t:"返回选择其他学院", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_elda_exam"] = function(){
  return {
    place:"艾尔达·考试中",
    text:function(){
      const arr=[];
      arr.push("考试开始了。");
      arr.push("");
      arr.push("第一部分是基础魔法理论——你在纸上写下你对魔法的理解。");
      arr.push("第二部分是属性测评——水晶球亮起，显示你的各项属性。");
      arr.push("第三部分是面试——一个老教授问了你几个问题，关于你的出身、你的理想、你对灵魂魔法的看法。");
      arr.push("");
      arr.push("考试结束后，你在考场外等待结果。");
      return arr;
    },
    options:[
      {t:"等待结果", go:"academy_elda_admitted", effect:{check:"INT", tier:{
        crit:{t:"你以第一名的成绩通过了入学考试！院长亲自接见了你，说你是「百年一遇的天才」。你获得了全额奖学金和优先选课权。", effect:{flag:"elda_top_student", gold:100, reputation:10}},
        ok:{t:"你通过了入学考试。成绩中上，获得了入学资格。", effect:{flag:"elda_admitted", gold:20}},
        fail:{t:"你的成绩勉强及格。虽然通过了，但被分到了普通班。教授说你「还有很大的进步空间」。", effect:{flag:"elda_admitted", reputation:-5}},
        critfail:{t:"你没有通过入学考试。但一个穿灰袍的教授（墨丘利）走过来，低声说：「我看到了你的潜力。跟我来，我有别的安排。」", effect:{flag:"elda_mercury_recruit", san:-3}}
      }}}
    ]
  };
};


  nodes["academy_elda_admitted"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "elda_main";
  return {
    place:"艾尔达·录取",
    text:function(){
      const arr=[];
      arr.push("你被艾尔达大陆学院录取了！");
      arr.push("");
      arr.push("录取通知书上写着你的名字、你的院系、你的宿舍号。");
      arr.push("");
      arr.push("你站在学院的大门前，看着那巨大的石门和上面古老的符文。");
      arr.push("");
      arr.push("从今天起，你是艾尔达大陆学院的学生了。");
      arr.push("");
      arr.push("你的学院生活，即将开始。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      plantForeshadowV27('watcher_spy');
      arr.push("（你不知道的是，墨丘利教授已经在你的档案上做了一个标记。）");
      arr.push("你推开学院的大门，脚步声在门廊里荡开，空旷得像走进一座巨大的钟。");arr.push("门廊两侧的墙上挂着历代院长的画像，画像的眼睛似乎都在看着你。你从第一幅走到最后一幅——他们的脸各不相同，可眼底那种神情，是一样的：像看过太多东西的人。");arr.push("一个高年级学生从楼梯上下来，看了你一眼，吹了声口哨：「新生？西楼三零四，对吧？你室友已经在了，人不错，就是话多。」");arr.push("你谢过他，沿着走廊往里走。阳光从彩窗落进来，在地板上投下一大片斑斓的光影。你踩过那片光影，忽然觉得，自己正踩在一条很长的路的开头。");arr.push("走廊尽头，有人叫你的名字。你回头——是墨丘利。他站在光与影交界的地方，朝你点了点头，没有走近，也没有说话。");arr.push("你转回身，继续往前走。身后的脚步声，与你的脚步声叠在一起，像两个人在同一条路上走。");return arr;
    } /*v45inj:academy_elda_admitted*/,
    options:[
      {t:"进入学院（开始第一年）", go:"orientation_day1", effect:{flag:"academy_elda_start"}}
    ]
  };
};


  nodes["academy_elda_detail"] = function(){
  return {
    place:"艾尔达·学院详情",
    text:function(){
      const a = ACADEMIES_V28.elda_main;
      const arr=[];
      arr.push("【" + a.name + "】");
      arr.push("位置：" + a.location);
      arr.push("类型：人类顶尖综合学院");
      arr.push("声望：" + a.prestige + " / 排名：第" + a.ranking + "名");
      arr.push("强项：" + a.strengths.join("、"));
      arr.push("派系：" + a.factions.join("、"));
      arr.push("学费：" + a.tuition + "金龙/年");
      arr.push("");
      arr.push(a.desc);
      arr.push("");
      arr.push("【日程】清晨：早课 / 正午：午饭 / 午后：实验选修 / 黄昏：自由活动 / 深夜：宵禁");
      arr.push("艾尔达大陆学院的资料摊在你面前：位置、规模、历史、声望，一行一行，像一份完备的档案。");arr.push("");arr.push("人类顶尖综合学院——灵魂魔法和七印研究独步大陆。你念着这两行字，想起入学那天礼堂里的壁画：黄林晶加固七印的场景。");arr.push("");arr.push("你合上档案。这座学院的名字里带着‘大陆’二字，而它藏着的秘密，似乎也真的和整个大陆有关。");arr.push("");return arr;
    },
    options:[
      {t:"参加入学考试", go:"academy_elda_exam", effect:{}},
      {t:"返回选择", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_admission_holy"] = function(){
  return {
    place:"圣光神学院·入学考试",
    text:function(){
      const arr=[];
      arr.push("圣光神学院的入学考试在圣城举行。");
      arr.push("");
      arr.push("考试分为三部分：信仰测试、神圣魔法天赋、教会法基础。");
      arr.push("");
      arr.push("你注意到考场门口有审判骑士在巡逻——他们在检查每个考生是否有「灵魂魔法天赋」。");
      arr.push("");
      arr.push("如果你有灵魂魔法天赋，这里不欢迎你。");
      arr.push("圣光神学院的入学考核，从一炷香开始。");arr.push("你跪在圣像前，面前是一盏长明灯。监考的红袍主教站在你身后，声音平稳：「光明不问你的出身，只问你的心。你心里有光吗？」");arr.push("你闭上眼。你想起老托马斯被带走的那天，想起唱诗班的歌声，想起圣城那些低着头走路的人。");arr.push("你睁开眼，说：「我心里有疑问。」");arr.push("主教沉默了一会儿。你以为考核要失败了。他却说：「有疑问的人，才会去寻找光。把香点完，你就算过了。」");arr.push("你点完那炷香。走出考核厅时，阳光照在你脸上，你忽然觉得，这座学院，也许比圣城本身，要更接近「光」这个字的真义。");return arr;
    } /*v45inj:academy_admission_holy*/,
    options:[
      {t:"参加信仰测试", go:"academy_holy_exam", effect:{}},
      {t:"返回选择其他学院", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_holy_exam"] = function(){
  return {
    place:"圣光·考试中",
    text:function(){
      const arr=[];
      arr.push("信仰测试开始了。");
      arr.push("");
      arr.push("一个主教把手放在你的头上，感受你的「信仰纯度」。");
      arr.push("");
      arr.push("然后是神圣魔法天赋测试——圣水杯在你面前，如果你有天赋，水会发光。");
      arr.push("");
      arr.push("最后是教会法基础——你在纸上写下你对教会法的理解。");
      return arr;
    },
    options:[
      {t:"等待结果", go:"academy_holy_admitted", effect:{check:"SPR", tier:{
        crit:{t:"你的信仰纯度极高，圣水杯发出耀眼的光芒！主教说你是「被神选中的人」。你获得了全额奖学金和直接进入圣术精英班的资格。", effect:{flag:"holy_elite", gold:80, reputation:15}},
        ok:{t:"你通过了信仰测试。圣水杯微微发光，说明你有一定的神圣魔法天赋。你获得了入学资格。", effect:{flag:"holy_admitted", gold:15}},
        fail:{t:"你的信仰测试勉强通过。圣水杯没有发光——主教说你「信仰不够坚定，但可以培养」。你被分到了普通班。", effect:{flag:"holy_admitted", reputation:-5}},
        critfail:{t:"圣水杯在你手中变成了黑色！主教大惊失色：「你……你有灵魂魔法天赋！来人！把他带走！」你被审判骑士带走了——但一个穿灰袍的人悄悄帮你逃了出来。", effect:{flag:"holy_rejected", san:-10, reputation:-20}}
      }}}
    ]
  };
};


  nodes["academy_holy_admitted"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "holy_seminary";
  return {
    place:"圣光·录取",
    text:function(){
      const arr=[];
      arr.push("你被圣光神学院录取了！");
      arr.push("");
      arr.push("白袍、圣歌、钟声——这是圣光神学院的日常。");
      arr.push("");
      arr.push("你站在神学院的大门前，看着那巨大的圣光徽章。");
      arr.push("");
      arr.push("从今天起，你是圣光神学院的学生了。愿圣光指引你的道路。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（你不知道的是，神学院的地下审讯室里，关着一些「不虔诚」的人。）");
      arr.push("圣光神学院的录取函是厚实的羊皮纸，印着烫金的圣徽。信里引用了一段祷文，末尾写着：“愿圣光指引你的路。”");arr.push("");arr.push("报到那天，钟声在圣城的白墙间回荡。你穿着新发的白袍，走在石阶上，神学生们的脚步都很轻，像怕惊动什么。");arr.push("");arr.push("接引你的修士一路无话，直到教堂门口才开口：“圣光之下，人人平等——只要你不说谎，不欺瞒，不藏污。记住了，圣光看得见一切。”他推开门，阳光倾泻而入。");arr.push("");return arr;
    },
    options:[
      {t:"进入神学院（开始第一年）", go:"academy_holy_year1", effect:{flag:"academy_holy_start"}}
    ]
  };
};


  nodes["academy_admission_military"] = function(){
  return {
    place:"帝国军事学院·入学考试",
    text:function(){
      const arr=[];
      arr.push("帝国军事学院的入学考试在承天山举行。");
      arr.push("");
      arr.push("考试分为三部分：武力测试、战略笔试、体能长跑。");
      arr.push("");
      arr.push("你站在操场上，看着其他考生——大多是贵族子弟，穿着精良的铠甲。");
      arr.push("");
      arr.push("一个穿军装的教官走出来：「小子们，准备好了吗？考试开始！」");
      arr.push("帝国军事学院的门口，立着一柄巨大的石剑。");arr.push("剑身插在基座里，露在外面的部分足有两层楼高。剑刃上刻满了名字——历届阵亡学员的名字，一排一排，密得像字书。");arr.push("你到的时候，正赶上一队学员在操场上跑圈。他们的脚步声很整齐，咚、咚、咚，像一面鼓。旁边有个教官在吼：「你们不是在为自己跑！你们在为身后的人跑！」");arr.push("接待你的军官看了你一眼，没有多余的客套：「考武艺，考胆识，考服从。三项全过，你就是帝国军校的人。过不了——从哪里来，回哪里去。」");arr.push("他说完，把一份表格推到你面前：「签了它。签了，就没有回头路了。」");return arr;
    } /*v45inj:academy_admission_military*/,
    options:[
      {t:"参加武力测试", go:"academy_military_exam", effect:{}},
      {t:"返回选择其他学院", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_military_exam"] = function(){
  return {
    place:"军事·考试中",
    text:function(){
      const arr=[];
      arr.push("武力测试开始了。");
      arr.push("");
      arr.push("你和一个教官对打——他只用了三成力，但你已经很吃力了。");
      arr.push("");
      arr.push("然后是战略笔试——你在纸上写下你对一场战役的分析。");
      arr.push("");
      arr.push("最后是体能长跑——背着20公斤的装备跑10公里。");
      return arr;
    },
    options:[
      {t:"等待结果", go:"academy_military_admitted", effect:{check:"STR", tier:{
        crit:{t:"你在武力测试中击败了教官！全场震惊。院长亲自接见了你，说你是「天生的战士」。你获得了全额奖学金和直接进入精英突击队的资格。", effect:{flag:"military_elite", gold:60, reputation:20}},
        ok:{t:"你通过了所有测试。武力中上，战略分析得到了教官的认可。你获得了入学资格。", effect:{flag:"military_admitted", gold:10}},
        fail:{t:"你勉强通过了体能测试，但武力测试被教官三招击败。战略笔试还行。你被分到了普通步兵班。", effect:{flag:"military_admitted", reputation:-3}},
        critfail:{t:"你在武力测试中被教官一拳打晕了。醒来时，你被告知没有通过。但一个老教官走过来：「小子，你有股狠劲。来后勤班吧，我教你。」", effect:{flag:"military_logistics", san:-5}}
      }}}
    ]
  };
};


  nodes["academy_military_admitted"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "imperial_military";
  return {
    place:"军事·录取",
    text:function(){
      const arr=[];
      arr.push("你被帝国军事学院录取了！");
      arr.push("");
      arr.push("铁血、纪律、战友情——这是军事学院的日常。");
      arr.push("");
      arr.push("你站在学院的操场上，看着那巨大的军旗。");
      arr.push("");
      arr.push("从今天起，你是帝国军事学院的学生了。服从命令，完成任务。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你不知道的是，军事学院的秘密研究派，在研究一些不该研究的东西。）");
      arr.push("帝国军事学院的录取函是盖着军徽的硬纸，措辞像命令：“准予入学。报到时间：下月初一。携带：行李一件，兵器自备。”");arr.push("");arr.push("报到那天，操场上已站满了新生，个个站得笔直，像一排木桩。教官挨个走过，偶尔停下来，捏捏你的肩膀，掰掰你的手腕。");arr.push("");arr.push("走到你面前时，他多看了你两眼：“底子还行。记住——军事学院不看嘴皮子，看拳头和脑子。在这里，睡懒觉是死罪，退缩也是。”");arr.push("");return arr;
    },
    options:[
      {t:"进入军事学院（开始第一年）", go:"academy_military_year1", effect:{flag:"academy_military_start"}}
    ]
  };
};


  nodes["academy_admission_elf"] = function(){
  return {
    place:"银叶学院·入学",
    text:function(){
      const arr=[];
      arr.push("银叶学院的入学需要精灵王室的特批。");
      arr.push("");
      arr.push("你站在银叶城的城门前，精灵守卫用古老的精灵语问了你几个问题。");
      arr.push("");
      arr.push("如果你是精灵，他们会让你进去。如果你是人类，你需要一封王室的推荐信。");
      arr.push("");
      arr.push("（详细入学流程在精灵学院线中实现。）");
      arr.push("银叶学院的入口，在一棵巨大的古树下面。");arr.push("树根拱起，形成一道天然的拱门。你走进去，头顶是交错的枝叶，光从缝隙里漏下来，碎成一地金色的斑点。空气里有树皮、苔藓和花的味道，清得让人不敢大声呼吸。");arr.push("一个精灵女子站在树影里等你。她看起来不过三十岁，但你后来才知道，她已经活了两百多年。");arr.push("「人类。」她开口，声音很轻，像树叶摩擦，「你确定要来银叶？」她顿了顿，「在这里，你会活得比你的同族慢很多。你会看着你的朋友们老去，而你还像今天一样年轻。」");arr.push("她没有等你的回答，只是侧身让开：「想清楚了，就进来。想不清楚，现在转身，还来得及。」");return arr;
    } /*v45inj:academy_admission_elf*/,
    options:[
      {t:"尝试入学（需精灵血统或王室推荐）", go:"academy_elf_year1", effect:{check:"SPR", tier:{
        crit:{t:"精灵守卫感受到了你身上的自然魔法天赋，放你进去了。一个精灵长老走过来：「欢迎来到银叶学院，孩子。」", effect:{flag:"elf_admitted"}},
        ok:{t:"精灵守卫犹豫了一下，最终让你进去了——但你需要在一年内证明自己的价值。", effect:{flag:"elf_probation"}},
        fail:{t:"精灵守卫不让你进去：「人类，银叶学院不欢迎外人。」你被拒绝了。", effect:{flag:"elf_rejected", san:-3}},
        critfail:{t:"精灵守卫把你当成了间谍，差点把你抓起来。你好不容易才逃了出来。", effect:{san:-8, reputation:-10}}
      }}},
      {t:"返回选择其他学院", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_admission_dwarf"] = function(){
  return {
    place:"铁峰锻造学院·入学",
    text:function(){
      const arr=[];
      arr.push("铁峰锻造学院的入学需要矮人匠会的推荐。");
      arr.push("");
      arr.push("你站在铁峰堡的大门前，矮人守卫用锤子敲了敲你的膝盖——这是矮人的入学测试。");
      arr.push("");
      arr.push("（详细入学流程在矮人学院线中实现。）");
      arr.push("铁峰锻造学院，建在山肚子里。");arr.push("入口是一道巨大的石门，门楣上刻着一柄锤子和一个砧板。门开着，热浪从里面涌出来，带着铁锈和炭火的味道，像一只巨兽的呼吸。");arr.push("一个矮人老头坐在门口的石墩上，手里敲着一块铁皮，咚咚咚，敲得不紧不慢。他头也不抬：「来学锻造的？」");arr.push("「是。」你说。");arr.push("「好。」他放下锤子，抬起头，眼睛在火光里亮得像两颗炭，「先跟我打三天的下手。烧火，搬铁，扫地。干得了，留下。干不了——」他摆摆手，「趁早回家种地。」");arr.push("他说完，又低头敲他的铁皮了。咚咚咚，像一记又一记的鼓点。");return arr;
    } /*v45inj:academy_admission_dwarf*/,
    options:[
      {t:"尝试入学（需锻造天赋或匠会推荐）", go:"academy_dwarf_year1", effect:{check:"STR", tier:{
        crit:{t:"矮人守卫感受到了你身上的锻造天赋，大笑：「好小子！有打铁的料！进去吧！」", effect:{flag:"dwarf_admitted"}},
        ok:{t:"矮人守卫点了点头：「还行。进去吧，但别给我丢人。」", effect:{flag:"dwarf_admitted"}},
        fail:{t:"矮人守卫摇了摇头：「细皮嫩肉的，不是打铁的料。」你被拒绝了。", effect:{flag:"dwarf_rejected"}},
        critfail:{t:"矮人守卫把你当成了小偷，差点把你扔进熔炉。你好不容易才跑了出来。", effect:{san:-5, hp:-10}}
      }}},
      {t:"返回选择其他学院", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_admission_orc"] = function(){
  return {
    place:"战神学院·入学",
    text:function(){
      const arr=[];
      arr.push("战神学院的入学需要通过生死试炼。");
      arr.push("");
      arr.push("你站在兽人王庭的试炼场上，周围是围观的兽人战士。");
      arr.push("");
      arr.push("试炼很简单：在竞技场里活过一炷香的时间。你的对手是一只成年的草原狼。");
      arr.push("");
      arr.push("（详细入学流程在兽人学院线中实现。）");
      return arr;
    },
    options:[
      {t:"参加生死试炼", go:"academy_orc_year1", effect:{check:"STR", tier:{
        crit:{t:"你赤手空拳杀死了草原狼！全场兽人战士起立欢呼。兽人萨满走过来：「你有战士的灵魂。欢迎来到战神学院。」", effect:{flag:"orc_admitted", reputation:15}},
        ok:{t:"你受了伤，但最终活了下来。兽人萨满点了点头：「还行。进去吧。」", effect:{flag:"orc_admitted", hp:-15}},
        fail:{t:"你被草原狼咬伤了，但一个兽人战士扔了一把刀给你，你最终活了下来。「勉强通过。」萨满说。", effect:{flag:"orc_probation", hp:-25}},
        critfail:{t:"你差点被草原狼杀死。是一个老兽人救了你。「你太弱了。」他说，「但你有股狠劲。留下来打杂吧。」", effect:{flag:"orc_servant", hp:-35, san:-5}}
      }}},
      {t:"返回选择其他学院", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_admission_halfling"] = function(){
  return {
    place:"绿野学院·入学",
    text:function(){
      const arr=[];
      arr.push("绿野学院的入学很简单——只要你愿意来。");
      arr.push("");
      arr.push("你站在半身人领地的入口，一个半身人老太太给了你一块刚烤好的面包。");
      arr.push("");
      arr.push("「欢迎来到绿野学院，孩子。」她笑着说，「先吃点东西吧。」");
      arr.push("");
      arr.push("（详细入学流程在半身人学院线中实现。）");
      arr.push("绿野学院没有围墙。");arr.push("它是一大片农田、果园和木屋。远远看去，像一个小村子，炊烟袅袅，还有孩子的笑声传过来。你几乎以为自己走错了地方。");arr.push("一个圆脸的半身人迎上来，笑得眼睛眯成一条缝：「新来的？欢迎欢迎！先吃饭，先吃饭——考核的事，不急。」");arr.push("他拉着你往屋里走，一边走一边念叨：「咱们学院啊，学问在锅里，在田里，在每一棵草里。你先吃顿饱饭，再想别的。」");arr.push("你被按在桌边坐下，面前很快堆满了食物。他坐在你对面，笑眯眯地看着你吃。你忽然觉得，这地方，好像没那么紧张。");arr.push("可你注意到，他笑归笑，眼神一直很清醒。他一直在看你的手——看你拿筷子、看你的握力、看你吃东西的习惯。");return arr;
    } /*v45inj:academy_admission_halfling*/,
    options:[
      {t:"进入绿野学院", go:"academy_halfling_year1", effect:{flag:"halfling_admitted", hp:10, san:5}},
      {t:"返回选择其他学院", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_admission_business"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "free_city_business";
  return {
    place:"自由城邦商学院·录取",
    text:function(){
      const arr=[];
      arr.push("你被自由城邦商学院录取了！");
      arr.push("");
      arr.push("交了学费，你就是商学院的学生了。这里的一切都和钱有关——课程、人脉、甚至友谊。");
      arr.push("");
      arr.push("（详细学院线在后续扩展中实现。）");
      arr.push("自由城邦商学院的入学考核，不在教室里。");arr.push("你被扔进市场，口袋里有十个铜币，手里有一张货物清单。考官的话很简单：「日落之前，把这张单子上的东西买齐。多花的每一个铜币，都会记在你的分上。」");arr.push("市场很大，人声鼎沸。卖鱼的、卖布的、卖香料的，吆喝声此起彼伏。你捏着那张清单，站在人流里，第一次发现，十个铜币，原来这么不经花。");arr.push("你开始一家一家地讲价。有人不耐烦，有人跟你磨，有个卖布的老妇人看了你一眼，说：「小子，你先去东边那个摊子问价，再回来跟我谈。货比三家，不吃亏。」");arr.push("你道了谢，转身往东走。走了两步，你忽然回头，看见那老妇人在冲你笑。那笑容里，有一丝你后来才懂的东西——她在教你，怎么在江湖里活下去。");return arr;
    } /*v45inj:academy_admission_business*/,
    options:[
      {t:"进入商学院", go:"fc_jiaohui_entry", effect:{flag:"academy_business_start", gold:-80}}
    ]
  };
};


  nodes["academy_admission_northern"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "northern_warrior";
  return {
    place:"北方战士学院·录取",
    text:function(){
      const arr=[];
      arr.push("你被北方战士学院录取了！");
      arr.push("");
      arr.push("铁门关的风像刀一样刮在脸上。这里的学生都是硬汉——条件艰苦，但实战经验丰富。");
      arr.push("");
      arr.push("（详细学院线在后续扩展中实现。）");
      arr.push("北方的录取信是随一柄短刀一起送到的。刀鞘是铁皮打的，磨得发亮。信上只写着一行字：“北方战士学院。带刀来，别带眼泪。”");arr.push("");arr.push("铁门关的风像刀一样刮在脸上。你站在学院门前，看操场上学生们正对着木桩练劈砍，呼喝声混着风声，在关隘里来回撞。");arr.push("");arr.push("一个黑脸教官走过来，上下打量你两眼：“瘦了点。不过不要紧——在这里待三年，石头都能给你磨出锋来。”他扔过来一件皮甲：“穿上。从今天起，你就是这里的人了。”");arr.push("");return arr;
    },
    options:[
      {t:"进入战士学院", go:"fc_jiaohui_entry", effect:{flag:"academy_northern_start", gold:-20}}
    ]
  };
};


  nodes["academy_admission_southern"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "southern_navigation";
  return {
    place:"南方航海学院·录取", text:function(){return ["你被南方航海学院录取了！","","海风、咸腥味、桅杆——这是航海学院的日常。","","（详细学院线在后续扩展中实现。）","南方的录取信里夹着一小袋海盐，粗粝发白，闻着有股咸腥。信上写着：“南方航海学院。怕晕船就趁早另寻出路。”","","报到那天，你站在港口边看船——桅杆像一片树林，缆绳叮叮当当地响。水手们赤着脚在甲板上跑，喊着听不懂的号子。","","来接你的学长是个晒成铜色的汉子，他咧嘴一笑，露出一口白牙：“新来的？先跟你打个赌——三天之内，你能分清东南西北风，我请你喝酒。分不清，你请我。”",""];},
    options:[{t:"进入航海学院", go:"fc_jiaohui_entry", effect:{flag:"academy_southern_start", gold:-40}}]
  };
};


  nodes["academy_admission_eastern"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "eastern_literature";
  return {
    place:"东部文学院·录取", text:function(){return["你被东部文学院录取了！","","书香、墨香、诗词——这是文学院的日常。","","（详细学院线在后续扩展中实现。）", "东部文学院的门口，立着两排石碑。", "碑上刻的不是人名，是诗句。年代久远的，字迹已经模糊；新刻的，还泛着石头的青白色。风从碑林间穿过，像有人在低声吟哦。", "一个穿青衫的老先生站在碑林尽头，负着手，看着你走近。他没有问你的名字，只是说：「老朽考你一题。」", "「你从何处来，往何处去？」他问，「用一句话答我。」", "你愣了一下。这个问题，听起来简单，可你忽然觉得，怎么答都不对。他也没有催你，就站在那里，等着。风把碑上的灰尘吹起来，又落下。"];} /*v45inj:academy_admission_eastern*/,
    options:[{t:"进入文学院", go:"fc_jiaohui_entry", effect:{flag:"academy_eastern_start", gold:-35}}]
  };
};


  nodes["academy_admission_western"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "western_ranger";
  return {
    place:"西部游侠学院·录取", text:function(){return ["你被西部游侠学院录取了！","","自由、冒险、远方——这是游侠学院的日常。","","（详细学院线在后续扩展中实现。）","西部的录取信是托驿马送来的，信纸上还带着一路的风尘。拆开时，一枚枯黄的针叶从信封里落出来——那是西境荒原上特有的植物，硬得像铁片。","","报到那天，风谷口的风几乎把你掀个跟头。游侠学院的旗子在风里猎猎作响，旗上的图案是一只展翅的鹰。","","教官站在旗杆下，看了你一眼：“西境的风一年刮到头，刮不跑的都是自己人。站稳了——站稳了，你就是游侠学院的学生。”",""];},
    options:[{t:"进入游侠学院", go:"fc_jiaohui_entry", effect:{flag:"academy_western_start", gold:-25}}]
  };
};


  nodes["academy_admission_law"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "church_law";
  return {
    place:"教会法学院·录取", text:function(){return["你被教会法学院录取了！","","法条、审判、祷告——这是法学院的日常。","","（详细学院线在后续扩展中实现。）", "教会法学院的走廊，比圣光神学院安静得多。", "这里没有圣像，没有祈祷声，只有一摞一摞的法典，从地板堆到天花板。空气里有墨水和陈年纸张的味道，沉甸甸的。", "一个穿着黑袍的修士领你进去，声音平板：「教会法，讲究三样：条文，先例，良心。前两样可以学，第三样——得看你有没有。」", "他把你带到一间空屋子。屋子正中摆着一张桌子，桌上放着一卷羊皮纸。", "「这是三年前的一桩案子。」他说，「一个农夫偷了教会的一块面包，喂给快要饿死的孩子。依律，当断手。依情，当无罪。」他敲了敲桌子，「你的判决是什么？」", "他看着你，等你的答案。屋子里很静，你听见自己的心跳。"];} /*v45inj:academy_admission_law*/,
    options:[{t:"进入法学院", go:"fc_jiaohui_entry", effect:{flag:"academy_law_start", gold:-30}}]
  };
};


  nodes["academy_admission_dwarfeng"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "dwarf_engineering";
  return {
    place:"矮人工程学院·录取", text:function(){return["你被矮人工程学院录取了！","","图纸、锤子、工地——这是工程学院的日常。","","（详细学院线在后续扩展中实现。）", "矮人工程学院的招牌，是一块钉在门上的铁板。", "铁板上用铆钉敲出一行字：「工匠不问出身，只看手艺。」字是歪的，但每一个铆钉都敲得很实，像钉进石头里。", "负责考核的矮人技师上下打量你：「学过工程吗？」", "「没有。」你老实说。", "「好。」他点点头，「没学过的最好教。学过歪门邪道的，最难掰回来。」他递给你一把扳手和一堆零件，「把这堆东西，装成一个能动的东西。零件不够，那边有废料堆，自己拆。」", "你蹲在地上，看着那堆零件，有点无从下手。他也不催你，搬了把椅子坐在旁边，翘着腿看你。过了一会儿，他说了一句：「记住，工程不是把东西拼起来。是让它们各归其位。」"];} /*v45inj:academy_admission_dwarfeng*/,
    options:[{t:"进入工程学院", go:"fc_jiaohui_entry", effect:{flag:"academy_dwarfeng_start"}}]
  };
};


  nodes["academy_admission_elfart"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "elf_art";
  return {
    place:"精灵艺术学院·录取", text:function(){return["你被精灵艺术学院录取了！","","音乐、绘画、诗歌——这是艺术学院的日常。","","（详细学院线在后续扩展中实现。）", "精灵艺术学院的校舍，藏在银叶城的一片花林里。", "你到的时候，正赶上一群学生在林间写生。没有人抬头看你，所有人都沉浸在各自的画里。一个银发的精灵导师走过来，声音温和：「你带来了什么？」", "你一时没听懂。他补充：「入学考核只有一题——你带来了什么。一件作品，一个故事，或者一种感受。什么都行，只要它真的属于你。」", "你站在花林里，想了很久。你带来的东西不多：一个包袱，一双旧鞋，和这几年攒下的一肚子心事。", "他看出你的窘迫，笑了：「不急。先在这里住两天，听听花落的声音。等你觉得可以了，再来找我。」", "他转身走了，留下你一个人站在花林里。风一吹，花瓣落了你一身。"];} /*v45inj:academy_admission_elfart*/,
    options:[{t:"进入艺术学院", go:"fc_jiaohui_entry", effect:{flag:"academy_elfart_start"}}]
  };
};


  nodes["academy_admission_village"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "village_school";
  return {
    place:"乡村学院·入学",
    text:function(){
      const arr=[];
      arr.push("你选择了乡村学院。");
      arr.push("");
      arr.push("没有高大的校门，没有精良的设备，只有一个老秀才/老牧师/老铁匠/老萨满，和几个学生。");
      arr.push("");
      arr.push("条件很差，但这里可能藏着古老的传承——老秀才的书柜里可能有孤本，老牧师可能知道教会的秘密，老铁匠可能是隐退的大师，老萨满可能和原初之物有联系。");
      arr.push("");
      arr.push("出身决定起点，但不决定终点。乡村学院的天才，也可能一鸣惊人。");
      arr.push("");
      plantForeshadowV27('origin_clue');
      plantForeshadowV27('karma_seed');
      arr.push("（你的老师看着你，眼神很深——他好像知道一些你不知道的事。）");
      return arr;
    },
    options:[
      {t:"在乡村学院学习（隐藏传承线）", go:"fc_jiaohui_entry", effect:{flag:"village_school_start", reputation:-10, knowledge:1}},
      {t:"通过考试进入顶尖学院（后续可转校）", go:"academy_choice_intro", effect:{}}
    ]
  };
};


  nodes["academy_rankings_view"] = function(){
  initAcademyV28();
  return {
    place:"学院排名",
    text:function(){
      const arr=[];
      arr.push("【大陆学院排名】");
      arr.push("");
      arr.push("（排名每年更新，影响学院声望和资源分配。你的行为可以影响母校排名。）");
      arr.push("");
      for(const r of S.academy.ranking){
        const a = ACADEMIES_V28[r.id];
        if(a){
          const trend = r.trend === "up" ? "↑" : r.trend === "down" ? "↓" : "—";
          arr.push("第" + r.rank + "名：" + a.name + "（" + a.location + "） 声望:" + r.score + " " + trend);
        }
      }
      arr.push("大陆学院排名的榜单在眼前展开，各大学院的名字从上到下排列。你一行行看过去，目光在最熟悉的几个名字上停留。");arr.push("");arr.push("艾尔达大陆学院排在中游，比去年升了两名；圣光神学院稳居前列；银叶学院今年势头很猛。排名每年更新，影响学院声望和资源分配。");arr.push("");arr.push("你注意到，榜单末尾有一行小字注释：“排名受各学院在校生表现影响——你的行为，可以改变你母校的位次。”你合上榜单，忽然觉得，这座学院的名字，也有你的一份。");arr.push("");return arr;
    },
    options:[
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_elda_hub"] = function(){
  initAcademyV28();
  if(!S.academy.year) S.academy.year = 1;
  return {
    place:"艾尔达大陆学院",
    text:function(){
      const arr=[];
      arr.push("【艾尔达大陆学院 · 第" + S.academy.year + "年 · " + TIME_PERIODS_V26[S.time.period].name + "】");
      arr.push("");
      arr.push("你站在学院的林荫大道上。两边是教学楼、宿舍、图书馆、训练场。学生们来来往往，有的在背书，有的在练习魔法，有的在匆匆赶去上课。");
      arr.push("");
      arr.push("今天你可以做很多事——上课、去图书馆、找同学、探索秘密、或者只是在校园里闲逛。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("");
      if(S.academy.year === 1) arr.push("【第一年】你刚入学，一切都很新鲜。但你已经注意到——学院的水下，有暗流。");
      else if(S.academy.year === 2) arr.push("【第二年】你已经熟悉了学院的生活。院际大赛即将开始。");
      else if(S.academy.year === 3) arr.push("【第三年】实习期到了。你将第一次离开学院，去大陆上实习。");
      else if(S.academy.year === 4) arr.push("【第四年】政治风暴来临。教会加强了对学院的控制。");
      else if(S.academy.year === 5) arr.push("【第五年】毕业季。你需要选择你的未来。");
      return arr;
    },
    options:function(){
      const opts=[];
      opts.push({t:"去上课（今日课程）", go:"academy_elda_class", effect:{timeCost:"1period"}});
      opts.push({t:"去图书馆", go:"academy_elda_library", effect:{timeCost:"1period"}});
      opts.push({t:"找同学/教授", go:"academy_elda_social", effect:{timeCost:"1period"}});
      opts.push({t:"探索学院（秘密区域）", go:"academy_elda_explore", effect:{timeCost:"1period"}});
      opts.push({t:"参加社团活动", go:"academy_elda_club", effect:{timeCost:"1period"}});
      opts.push({t:"元素塔·学习魔法", go:"academy_magic_class", effect:{timeCost:"1period"}});
      opts.push({t:"查看学院排名/势力", go:"academy_rankings_view", effect:{}});
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});
      return opts;
    }
  };
};


  nodes["academy_elda_class"] = function(){
  return {
    place:"教室",
    text:function(){
      const arr=[];
      arr.push("你走进教室。");
      arr.push("");
      arr.push("今天的课程是——");
      arr.push("");
      const courses = ["元素魔法理论（墨丘利）","战术理论（雷蒙德）","灵魂感知（索菲亚）","神学基础（格雷戈里）","商业理论（洛伦佐）","符文研究（维多利亚）","历史（老陈）","战场急救（安娜）"];
      const course = courses[Math.floor(Math.random()*courses.length)];
      arr.push("【" + course + "】");
      arr.push("");
      arr.push("教授在讲台上讲课，学生们在下面记笔记。你可以认真听讲，也可以走神，或者和旁边的同学说话。");
      return arr;
    },
    options:[
      {t:"认真听讲", go:"academy_elda_hub", effect:{check:"INT", tier:{
        crit:{t:"你完全理解了教授讲的内容，甚至提出了一个让教授眼前一亮的问题。教授记住了你。", effect:{knowledge:2, reputation:5, exp:15}},
        ok:{t:"你认真听讲，学到了一些东西。", effect:{knowledge:1, exp:10}},
        fail:{t:"你努力想听懂，但教授讲的内容太深奥了。你只记住了一部分。", effect:{knowledge:1, exp:5}},
        critfail:{t:"你听着听着就睡着了。教授叫醒了你，全班都在看你。你很尴尬。", effect:{san:-3, reputation:-5}}
      }}, timeCost:"1period"},
      {t:"和旁边的同学说话", go:"academy_elda_hub", effect:{relation:"classmate:+10", knowledge:0, timeCost:"1period"}},
      {t:"走神/看窗外", go:"academy_elda_hub", effect:{san:2, knowledge:0, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_library"] = function(){
  return {
    place:"图书馆",
    text:function(){
      const arr=[];
      arr.push("学院图书馆很大——三层地上，三层地下。");
      arr.push("");
      arr.push("地上三层是普通书籍，任何学生都可以借阅。地下一层是禁书区，需要教授批准。地下二层需要院长批准。地下三层——没人知道怎么进。");
      arr.push("");
      arr.push("你可以在普通区看书，也可以尝试进入禁书区。");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      arr.push("（你听说，禁书区第三层有黄林晶的亲笔笔记——但没人能证明。）");
      return arr;
    },
    options:[
      {t:"在普通区看书", go:"academy_elda_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"尝试进入禁书区（第一层）", go:"academy_elda_forbidden_1", effect:{check:"AGI", tier:{
        crit:{t:"你避开了图书管理员的视线，悄悄进入了禁书区第一层。里面的书都很古老——你找到了一本关于七印的书。", effect:{knowledge:2, flag:"entered_forbidden_1", item:"seven_seals_book"}},
        ok:{t:"你找到了一个教授的签名，混了进去。禁书区第一层有很多禁忌书籍，你匆匆看了几本。", effect:{knowledge:1, flag:"entered_forbidden_1"}},
        fail:{t:"你试图溜进去，但被图书管理员发现了。「这里需要教授批准。」他说。你只好出来了。", effect:{reputation:-3}},
        critfail:{t:"你试图溜进去，不仅被发现了，还被格雷戈里教授看到了。他看你的眼神很警惕——「你为什么要进禁书区？」", effect:{reputation:-10, flag:"gregory_suspicious"}}
      }}, timeCost:"1period"},
      {t:"找图书管理员聊天", go:"academy_elda_hub", effect:{relation:"librarian:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_forbidden_1"] = function(){
  return {
    place:"禁书区·第一层",
    text:function(){
      const arr=[];
      arr.push("禁书区第一层很暗，只有几盏油灯。");
      arr.push("");
      arr.push("书架上摆满了古老的书籍——灵魂魔法、禁忌仪式、古代历史。");
      arr.push("");
      arr.push("你在书架间走动，手指划过书脊。然后你看到了一本书——《七印：完整的真相》。");
      arr.push("");
      arr.push("作者：黄林晶。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('hlj_letter');
      arr.push("（你的手在发抖。你知道，这本书会改变你对这个世界的认知。）");
      return arr;
    },
    options:[
      {t:"打开书阅读", go:"academy_elda_hub", effect:{check:"INT", tier:{
        crit:{t:"你读了这本书。七印的真相让你震惊——七印不是封印深渊，是喂养原初之物。你合上书本，发现自己泪流满面。", effect:{knowledge:3, san:-10, flag:"knows_seal_truth"}},
        ok:{t:"你读了一部分。七印的真相让你不安，但你还没完全理解。你决定以后再读。", effect:{knowledge:2, san:-5}},
        fail:{t:"书里的内容太深奥了，你看不懂。但你记住了几个关键词——原初之物、情感之灾、黄林晶的罪。", effect:{knowledge:1, san:-3}},
        critfail:{t:"你刚打开书，就听到了脚步声。你赶紧把书放回去，溜了出来。但你感觉——有什么东西跟着你出来了。", effect:{san:-8, flag:"followed_by_something"}}
      }}, timeCost:"1period"},
      {t:"不看了，赶紧离开", go:"academy_elda_hub", effect:{san:-2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_social"] = function(){
  return {
    place:"学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在学院里走动，遇到了一些人。");
      arr.push("");
      arr.push("你可以找同学聊天，找教授请教，或者去食堂/酒馆社交。");
      arr.push("");
      arr.push("学院里的每一个人都有自己的故事——你越了解他们，就越能发现这个学院的秘密。");
      arr.push("你在学院里走动，遇到了一些人。走廊里，抱着书的同学和你擦肩而过；食堂门口，几个学生正围着讨论一张海报。");arr.push("");arr.push("你找了个空位坐下，邻桌的人抬头冲你点点头。你们聊了几句——他来自东境，家里做茶叶生意，说起家乡的茶园，眼睛发亮。");arr.push("");arr.push("你发现，学院里的每一个人都有自己的故事。你越了解他们，就越能发现这个学院的秘密——也越明白，这座学院的水，比看起来深得多。");arr.push("");return arr;
    },
    options:[
      {t:"找墨丘利教授", go:"academy_elda_mercury", effect:{timeCost:"1period"}},
      {t:"找同学聊天", go:"academy_elda_classmate", effect:{timeCost:"1period"}},
      {t:"去食堂/酒馆", go:"academy_elda_tavern", effect:{timeCost:"1period"}},
      {t:"返回", go:"academy_elda_hub", effect:{}}
    ]
  };
};


  nodes["academy_elda_mercury"] = function(){
  return {
    place:"墨丘利的办公室",
    text:function(){
      const arr=[];
      arr.push("墨丘利的办公室在灵魂魔法塔的顶层。");
      arr.push("");
      arr.push("你敲了敲门，里面传来一个年轻的声音：「进来。」");
      arr.push("");
      arr.push("墨丘利坐在书桌后面，看起来只有二十多岁——但你知道，他至少三百岁了。他的眼睛很深，像能看穿你的灵魂。");
      arr.push("");
      arr.push("「你来了。」他说，「我等你很久了。」");
      arr.push("");
      plantForeshadowV27('watcher_spy');
      plantForeshadowV27('origin_clue');
      arr.push("（他知道你的名字。他知道你从哪里来。他甚至知道——你在序章做了什么。）");
      return arr;
    },
    options:[
      {t:"问他为什么等我", go:"academy_elda_hub", effect:{check:"SPR", tier:{
        crit:{t:"墨丘利看了你很久，然后说：「因为你能看到符文。这是一种很罕见的天赋——守望者需要这样的人。」他告诉你一些关于守望者的事，但没有说全。", effect:{knowledge:2, flag:"watcher_hint", relation:"mercury:+15"}},
        ok:{t:"墨丘利笑了笑：「因为你是个有趣的学生。」他没有多说，但你感觉他在隐瞒什么。", effect:{relation:"mercury:+10"}},
        fail:{t:"墨丘利没有回答你的问题。他只是给了你一本书：「先看看这个。有问题再来找我。」", effect:{item:"mercury_book", relation:"mercury:+5"}},
        critfail:{t:"墨丘利看了你一眼，眼神突然变得警惕：「你问太多了。」他让你离开了。你感觉他在怀疑你。", effect:{relation:"mercury:-10", san:-3}}
      }}, timeCost:"1period"},
      {t:"请教灵魂魔法", go:"academy_elda_hub", effect:{knowledge:1, relation:"mercury:+5", timeCost:"1period"}},
      {t:"离开", go:"academy_elda_hub", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_classmate"] = function(){
  const classmates = ["塞西莉亚","马库斯","艾尔文","莉莉安","艾兰迪尔","格林","古拉格","陈","莎拉","无名","林"];
  const classmate = classmates[Math.floor(Math.random()*classmates.length)];
  return {
    place:"同学·" + classmate,
    text:function(){
      const arr=[];
      arr.push("你找到了" + classmate + "。");
      arr.push("");
      arr.push("他/她正在做自己的事——看书/练习魔法/和别人聊天/独自发呆。");
      arr.push("");
      arr.push("你可以和他/她聊天，增进关系，或者只是打个招呼。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      arr.push("（每一个同学都有自己的秘密。你越了解他们，就越能发现——他们中的一些人，并不像表面看起来那样。）");
      return arr;
    },
    options:[
      {t:"深入聊天", go:"academy_elda_hub", effect:{check:"CHA", tier:{
        crit:{t:"你和" + classmate + "聊了很久。他/她告诉了你一些私人的事——关于家庭，关于过去，关于恐惧。你们的关系加深了。", effect:{relation:"classmate:+20", knowledge:1}},
        ok:{t:"你和" + classmate + "聊了一会儿。关系有所增进。", effect:{relation:"classmate:+10"}},
        fail:{t:"你试图聊天，但" + classmate + "似乎不太想说话。你只好离开了。", effect:{relation:"classmate:+2"}},
        critfail:{t:"你问了不该问的问题，" + classmate + "生气了。「这不关你的事！」他/她走开了。", effect:{relation:"classmate:-10", san:-2}}
      }}, timeCost:"1period"},
      {t:"打个招呼就走", go:"academy_elda_hub", effect:{relation:"classmate:+3", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_explore"] = function(){
  return {
    place:"学院·探索",
    text:function(){
      const arr=[];
      arr.push("你决定探索学院的秘密。");
      arr.push("");
      arr.push("艾尔达学院有很多不为人知的地方——禁书区、地下遗迹、灵魂魔法塔、秘密通道。");
      arr.push("");
      arr.push("每一个秘密区域都有它的故事，也有它的危险。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（你听说，学院建在古代遗迹之上。最深处，有第一印的碎片。）");
      arr.push("艾尔达学院的历史写在每一块石头上。走廊的砖缝里嵌着旧世纪的贝壳化石，穹顶的壁画褪了色，却还能看出七印的轮廓。");arr.push("");arr.push("你白天走遍了图书馆、元素塔和礼堂；到了夜里，你顺着一条不起眼的走廊往深处走。油灯的光在墙上投下摇晃的影子——禁书区的铁门、地下遗迹的入口、灵魂魔法塔的旋梯，都在这一带。");arr.push("");arr.push("你在禁书区的铁门前停下来。门上挂着一块铜牌，刻着几行字，被岁月磨得模糊：“非经特许，不得入内。求知者当知敬畏。”你站了很久，把那行字读了三遍。");arr.push("");return arr;
    },
    options:[
      {t:"探索地下遗迹入口", go:"academy_elda_ruins", effect:{timeCost:"1period"}},
      {t:"寻找秘密通道", go:"academy_elda_passage", effect:{timeCost:"1period"}},
      {t:"去灵魂魔法塔", go:"academy_elda_soul_tower", effect:{timeCost:"1period"}},
      {t:"返回", go:"academy_elda_hub", effect:{}}
    ]
  };
};


  nodes["academy_elda_ruins"] = function(){
  return {
    place:"地下遗迹·入口",
    text:function(){
      const arr=[];
      arr.push("你在图书馆后面找到了一个不起眼的门——上面刻着古老的符文。");
      arr.push("");
      arr.push("门后面是一段向下的石阶，通向黑暗的深处。");
      arr.push("");
      arr.push("你能感觉到——下面有什么东西在呼吸。不是活物的呼吸，是更古老、更庞大的存在。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（第一印的碎片就在下面。它在沉睡，但它能感觉到你。）");
      return arr;
    },
    options:[
      {t:"下去探索", go:"academy_elda_hub", effect:{check:"SPR", tier:{
        crit:{t:"你走下石阶，进入了地下遗迹。你看到了第一印的碎片——它在发光，在跳动，像一颗心脏。你听到了一个声音——「你终于来了。」你赶紧退了回来，但你已经看到了太多。", effect:{knowledge:3, san:-15, flag:"saw_seal_fragment"}},
        ok:{t:"你走下了几层石阶，看到了一些古老的壁画——描绘着七印的建造过程。你不敢再深入，退了回来。", effect:{knowledge:2, san:-5}},
        fail:{t:"你刚走下几层石阶，就听到了奇怪的声音。你害怕了，赶紧退了回来。", effect:{san:-3}},
        critfail:{t:"你走下石阶，然后——你迷路了。你在黑暗中走了很久，才找到回来的路。但你感觉，有什么东西跟着你上来了。", effect:{san:-10, flag:"followed_by_ruin"}}
      }}, timeCost:"1period"},
      {t:"不下去了", go:"academy_elda_hub", effect:{san:-1, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_passage"] = function(){
  return {
    place:"秘密通道",
    text:function(){
      const arr=[];
      arr.push("你在教学楼的墙上找到了一个机关——按下去，墙上出现了一个暗门。");
      arr.push("");
      arr.push("暗门后面是一条狭窄的通道，通向学院的各个建筑。");
      arr.push("");
      arr.push("通道里有脚印——很多脚印。有人经常使用这些通道。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（你在墙上看到了一个标记——暗蚀会的标记。他们在使用这些通道。）");
      return arr;
    },
    options:[
      {t:"沿着通道走", go:"academy_elda_hub", effect:{check:"AGI", tier:{
        crit:{t:"你沿着通道走，发现了暗蚀会支部的秘密会议室。你听到了他们的对话——关于七印，关于原初之物，关于一个叫「解放」的计划。你悄悄退了回来，但你已经知道了太多。", effect:{knowledge:3, flag:"eclipse_meeting_overheard", san:-8}},
        ok:{t:"你沿着通道走了一段，发现了一些暗蚀会的标记和留下的物品。你不敢再深入，退了回来。", effect:{knowledge:1, flag:"found_eclipse_passage"}},
        fail:{t:"你在通道里迷路了，转了很久才找到出口。你什么都没发现。", effect:{san:-2}},
        critfail:{t:"你在通道里遇到了一个穿黑袍的人——暗蚀会的成员。他看了你一眼，然后消失在黑暗中。你不知道他有没有认出你。", effect:{san:-10, flag:"seen_by_eclipse"}}
      }}, timeCost:"1period"},
      {t:"不进去了", go:"academy_elda_hub", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_soul_tower"] = function(){
  return {
    place:"灵魂魔法塔",
    text:function(){
      const arr=[];
      arr.push("灵魂魔法塔是学院最高的建筑——七层，塔顶是墨丘利的住所。");
      arr.push("");
      arr.push("塔的每一层都有不同的灵魂魔法实验。你能感觉到——塔里有很多灵魂，有的在哭泣，有的在低语，有的在沉睡。");
      arr.push("");
      arr.push("塔顶的门是锁着的——只有墨丘利能打开。");
      arr.push("");
      plantForeshadowV27('watcher_spy');
      plantForeshadowV27('origin_clue');
      arr.push("（你听说，塔顶封印着什么东西——或者什么人。）");
      return arr;
    },
    options:[
      {t:"在塔的低层参观", go:"academy_elda_hub", effect:{knowledge:1, san:-2, timeCost:"1period"}},
      {t:"尝试上塔顶", go:"academy_elda_hub", effect:{check:"SPR", tier:{
        crit:{t:"你感觉到了塔顶的存在——一个女性的灵魂，在沉睡。她很强大，也很悲伤。你不知道她是谁，但你感觉她在等你。", effect:{knowledge:2, san:-10, flag:"felt_seraphim"}},
        ok:{t:"你尝试上塔顶，但门是锁着的。你只感觉到了塔顶有强大的灵魂波动。", effect:{san:-5}},
        fail:{t:"你尝试上塔顶，但被一层灵魂屏障挡住了。你无法通过。", effect:{san:-2}},
        critfail:{t:"你尝试上塔顶，被灵魂屏障反弹了回来。你受了点伤，而且——你感觉塔顶的东西注意到了你。", effect:{hp:-10, san:-8}}
      }}, timeCost:"1period"},
      {t:"离开", go:"academy_elda_hub", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_year1_crisis"] = function(){
  return {
    place:"第一年·入学危机",
    text:function(){
      const arr=[];
      arr.push("【第一年·入学危机】");
      arr.push("");
      arr.push("入学一个月后，学院发生了一件大事——一个学生失踪了。");
      arr.push("");
      arr.push("他叫艾伦，是魔法院的新生。最后一次有人看到他，是在图书馆的禁书区门口。");
      arr.push("");
      arr.push("学院展开了调查，但没有结果。教会派了人来——格雷戈里教授声称这是「灵魂魔法的副作用」，要求加强对灵魂院的监控。");
      arr.push("");
      arr.push("但你知道——事情没那么简单。你在艾伦失踪的那天晚上，看到了一个穿黑袍的人，在图书馆后面徘徊。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('npc_lie');
      arr.push("（格雷戈里教授在撒谎。他知道艾伦去了哪里——但他不会说。）");
      return arr;
    },
    options:[
      {t:"调查艾伦的失踪", go:"academy_elda_year1_investigate", effect:{timeCost:"1period"}},
      {t:"告诉墨丘利教授", go:"academy_elda_hub", effect:{relation:"mercury:+10", flag:"told_mercury_about_allen"}},
      {t:"不管，专注学习", go:"academy_elda_hub", effect:{knowledge:1, san:-2}}
    ]
  };
};


  nodes["academy_elda_year1_investigate"] = function(){
  return {
    place:"调查·艾伦失踪",
    text:function(){
      const arr=[];
      arr.push("你开始调查艾伦的失踪。");
      arr.push("");
      arr.push("你问了他的室友——他说艾伦最近一直在研究「七印」，还说要去禁书区找一本书。");
      arr.push("");
      arr.push("你去了禁书区——图书管理员说艾伦那天确实来了，但他没有进禁书区，而是去了图书馆后面的小巷。");
      arr.push("");
      arr.push("你去了小巷——在地上发现了一些东西：黑袍的碎片、一瓶灵魂药剂、还有一个暗蚀会的标记。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（艾伦不是失踪了——他是被暗蚀会带走了。或者，他自愿加入了暗蚀会。）");
      return arr;
    },
    options:[
      {t:"把发现告诉墨丘利", go:"academy_elda_hub", effect:{relation:"mercury:+15", flag:"allen_clue_to_mercury", reputation:5}},
      {t:"自己继续调查", go:"academy_elda_hub", effect:{check:"INT", tier:{
        crit:{t:"你深入调查，发现了暗蚀会支部在学院的秘密据点。你还发现了艾伦——他还活着，但他已经加入了暗蚀会。「这是我自己的选择。」他说。你没有揭穿他——但你记住了他的脸。", effect:{knowledge:3, flag:"found_allen_eclipse", san:-5}},
        ok:{t:"你调查了一段时间，发现了一些线索，但没有找到艾伦。你决定先把线索整理好，以后再继续。", effect:{knowledge:1, flag:"allen_clues_collected"}},
        fail:{t:"你调查了很久，但没有找到更多线索。你感觉有人在监视你——你决定暂时停止调查。", effect:{san:-3}},
        critfail:{t:"你调查的时候被发现了——一个穿黑袍的人警告你：「别多管闲事。」你很害怕，但你也更好奇了。", effect:{san:-8, flag:"threatened_by_eclipse"}}
      }}},
      {t:"告诉格雷戈里教授", go:"academy_elda_hub", effect:{relation:"gregory:+5", flag:"allen_clue_to_gregory", san:-3}}
    ]
  };
};


  nodes["academy_elda_year2_tournament"] = function(){
  return {
    place:"第二年·院际大赛",
    text:function(){
      const arr=[];
      arr.push("【第二年·院际大赛】");
      arr.push("");
      arr.push("第二年的院际大赛开始了。五大学院系各派出代表队，在魔法、战斗、辩论、艺术四个项目中竞争。");
      arr.push("");
      arr.push("你可以选择代表你的院系参赛，也可以作为观众观看。");
      arr.push("");
      arr.push("大赛不仅是荣誉的竞争——也是派系政治的舞台。光明派想借大赛展示神圣魔法的「优越性」，自由派想证明学术自由的价值，暗蚀会支部想借机招募新人。");
      arr.push("");
      arr.push("你的表现，将影响你的声望、派系关系和未来的机会。");
      return arr;
    },
    options:[
      {t:"报名参赛（魔法项目）", go:"academy_elda_tournament_magic", effect:{timeCost:"1day"}},
      {t:"报名参赛（战斗项目）", go:"academy_elda_tournament_combat", effect:{timeCost:"1day"}},
      {t:"作为观众观看", go:"academy_elda_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"利用大赛进行秘密活动", go:"academy_elda_hub", effect:{check:"AGI", tier:{
        crit:{t:"大赛期间所有人都在关注比赛，你趁机进入了禁书区第二层。你找到了更多关于七印的资料。", effect:{knowledge:3, flag:"forbidden_level_2", san:-5}},
        ok:{t:"大赛期间你趁机做了一些平时不能做的事——比如进入一些平时有人看守的区域。", effect:{knowledge:1}},
        fail:{t:"你想趁机做秘密活动，但被发现了。你只好放弃。", effect:{reputation:-3}},
        critfail:{t:"你趁机做秘密活动，被格雷戈里教授抓住了。他没有惩罚你，但他看你的眼神更警惕了。", effect:{reputation:-10, flag:"gregory_more_suspicious"}}
      }}}
    ]
  };
};


  nodes["academy_elda_tournament_magic"] = function(){
  return {
    place:"院际大赛·魔法项目",
    text:function(){
      const arr=[];
      arr.push("魔法项目的比赛在竞技场举行。");
      arr.push("");
      arr.push("你的对手是神学院的学生——他使用神圣魔法，你使用你的职业魔法。");
      arr.push("");
      arr.push("观众席上坐满了人，教授们在评委席上观察。格雷戈里教授在微笑，墨丘利教授面无表情。");
      return arr;
    },
    options:[
      {t:"全力比赛", go:"academy_elda_hub", effect:{check:"INT", tier:{
        crit:{t:"你以压倒性的优势赢得了比赛！全场欢呼。墨丘利教授微微点头，格雷戈里教授的笑容消失了。你获得了院际大赛的冠军，声望大增。", effect:{reputation:20, gold:50, flag:"tournament_champion"}},
        ok:{t:"你赢得了比赛，但过程很艰难。对手很强，你勉强获胜。观众为你鼓掌。", effect:{reputation:10, gold:20}},
        fail:{t:"你输了比赛。对手的神圣魔法克制了你的技能。你很失望，但观众还是为你鼓掌。", effect:{reputation:-5, san:-3}},
        critfail:{t:"你在比赛中出了丑——魔法失控，差点伤到观众。格雷戈里教授趁机说：「看到了吗？这就是不规范的魔法研究的后果。」你成了学院的笑柄。", effect:{reputation:-20, san:-10, flag:"tournament_disaster"}}
      }}, timeCost:"1period"},
      {t:"故意输掉", go:"academy_elda_hub", effect:{reputation:-5, flag:"tournament_threw", relation:"gregory:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_year3_internship"] = function(){
  return {
    place:"第三年·实习",
    text:function(){
      const arr=[];
      arr.push("【第三年·实习期】");
      arr.push("");
      arr.push("第三年，学生们要离开学院，去大陆各地实习。");
      arr.push("");
      arr.push("实习地点有很多选择——教会/商会/军队/守望者（秘密）/自由探索。");
      arr.push("");
      arr.push("你的实习经历，将影响你的毕业去向、势力关系和未来的剧情线。");
      arr.push("");
      arr.push("这是你第一次真正离开学院，接触大陆的真实面貌。");
      return arr;
    },
    options:[
      {t:"去教会实习", go:"fc_jiaohui_entry", effect:{flag:"internship_church", reputation:10, timeCost:"30days"}},
      {t:"去商会实习", go:"fc_jiaohui_entry", effect:{flag:"internship_merchant", gold:30, timeCost:"30days"}},
      {t:"去军队实习", go:"fc_jiaohui_entry", effect:{flag:"internship_military", exp:30, timeCost:"30days"}},
      {t:"自由探索（去你想去的地方）", go:"fc_jiaohui_entry", effect:{flag:"internship_free", timeCost:"30days"}}
    ]
  };
};


  nodes["academy_elda_year4_storm"] = function(){
  return {
    place:"第四年·政治风暴",
    text:function(){
      const arr=[];
      arr.push("【第四年·政治风暴】");
      arr.push("");
      arr.push("第四年，教会加强了对学院的控制。");
      arr.push("");
      arr.push("净化令升级了——教会要求学院交出所有灵魂魔法的研究资料，驱逐所有有「异端倾向」的教授和学生。");
      arr.push("");
      arr.push("墨丘利教授被教会传唤，灵魂院面临被关闭的危险。学生们分成了两派——支持教会的，和支持墨丘利的。");
      arr.push("");
      arr.push("你必须选择立场。你的选择，将决定你在学院的未来，也将影响大陆的政治格局。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('watcher_spy');
      arr.push("（暗蚀会支部在趁机招募对教会不满的学生。守望者在暗中保护墨丘利。）");
      return arr;
    },
    options:[
      {t:"支持墨丘利/自由派", go:"academy_elda_hub", effect:{flag:"support_freedom", relation:"mercury:+20", relation:"gregory:-30", reputation:10, timeCost:"1period"}},
      {t:"支持教会/光明派", go:"academy_elda_hub", effect:{flag:"support_church", relation:"gregory:+20", relation:"mercury:-20", reputation:10, timeCost:"1period"}},
      {t:"保持中立", go:"academy_elda_hub", effect:{flag:"neutral_storm", san:-5, timeCost:"1period"}},
      {t:"加入暗蚀会（秘密）", go:"academy_elda_hub", effect:{flag:"join_eclipse_year4", san:-10, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elda_year5_graduation"] = function(){
  return {
    place:"第五年·毕业抉择",
    text:function(){
      const arr=[];
      arr.push("【第五年·毕业季】");
      arr.push("");
      arr.push("五年的学院生活即将结束。");
      arr.push("");
      arr.push("你需要选择你的未来——加入哪个势力？走哪条路？");
      arr.push("");
      arr.push("各大势力都来学院招募人才——教会/商会/军队/守望者（秘密）/暗蚀会（秘密）/自由探索。");
      arr.push("");
      arr.push("你的选择，将决定大陆章的起点、初始势力关系和主线剧情线。");
      arr.push("");
      arr.push("毕业不是结束——是你真正踏入大陆的开始。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      plantForeshadowV27('karma_seed');
      arr.push("（你的同学们也在选择他们的未来。你们将在大陆上重逢——也许是盟友，也许是敌人。）");
      return arr;
    },
    options:[
      {t:"加入教会", go:"academy_graduation_church", effect:{flag:"join_church", timeCost:"1period"}},
      {t:"加入商会", go:"academy_graduation_merchant", effect:{flag:"join_merchant", timeCost:"1period"}},
      {t:"加入军队", go:"academy_graduation_military", effect:{flag:"join_military", timeCost:"1period"}},
      {t:"自由探索（不加入任何势力）", go:"academy_graduation_free", effect:{flag:"join_free", timeCost:"1period"}},
      {t:"加入守望者（秘密）", go:"academy_graduation_watcher", effect:{flag:"join_watcher", timeCost:"1period"}},
      {t:"加入暗蚀会（秘密）", go:"academy_graduation_eclipse", effect:{flag:"join_eclipse", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_graduation_church"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "church";
  return {
    place:"毕业·加入教会",
    text:function(){
      const arr=[];
      arr.push("你选择了加入教会。");
      arr.push("");
      arr.push("格雷戈里教授很高兴——他亲自为你写了推荐信。你将前往圣城，开始你的教会生涯。");
      arr.push("");
      arr.push("毕业仪式上，你和同学们告别。有些人你以后还会见到，有些人——也许永远不会了。");
      arr.push("");
      arr.push("你站在学院的大门前，最后看了一眼这个你生活了五年的地方。");
      arr.push("");
      arr.push("然后你转身，走向了圣城的方向。");
      arr.push("格雷戈里教授把你叫到小教堂，亲手把推荐信放进你手里。信纸是羊皮的，封着教会的蜡印：“圣城那边，主教大人亲自过目。”");arr.push("");arr.push("他拍了拍你的肩膀，难得地露出笑意：“你在这五年，我没看错人。教会需要你这样的年轻人——虔诚，但不迂腐。”");arr.push("");arr.push("你走出教堂，钟声正响。圣城的白墙、彩窗、唱诗班——那些画面在远处等着你。可你心里清楚，教会的水，比圣水要深得多。");arr.push("");return arr;
    },
    options:[
      {t:"前往圣城（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_church", reputation:20}}
    ]
  };
};


  nodes["academy_graduation_merchant"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "merchant";
  return {
    place:"毕业·加入商会", text:function(){return ["你选择了加入商会。","","洛伦佐教授为你写了推荐信。你将前往交汇城，开始你的商业生涯。","","（大陆章起点：交汇城/商会势力）","洛伦佐教授把推荐信递给你时，正在算账。他头也不抬：“商会那帮人认纸不认人——这封信，比你的毕业证值钱。”","","信纸是上好的羊皮纸，墨迹工整，落款处盖着商会的火漆印。你接过来，能闻到淡淡的墨水味和一点烟草味。","","你走出教授办公室，走廊里阳光正好。从明天起，你就是商会的人了——交汇城的账本、算盘、谈判桌，在等着你。",""];},
    options:[{t:"前往交汇城（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_merchant", gold:50, reputation:15}}]
  };
};


  nodes["academy_graduation_military"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "military";
  return {
    place:"毕业·加入军队", text:function(){return ["你选择了加入军队。","","雷蒙德将军为你写了推荐信。你将前往铁门关，开始你的军人生涯。","","（大陆章起点：铁门关/军方势力）","雷蒙德将军的推荐信写在军用的信笺上，纸张厚实，边角印着军徽。他的笔迹像刀刻的：“此学员，可战。”五个字，没有多余的。","","你把信贴身收好。铁门关的风已经吹过来了——那里有边墙、烽燧、和你以后要并肩的袍泽。","","临出门，将军又叫住你，扔过来一块军牌：“戴着。到了那边，先学会听命令，再学会活命。”",""];},
    options:[{t:"前往铁门关（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_military", exp:30, reputation:15}}]
  };
};


  nodes["academy_graduation_free"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "free";
  return {
    place:"毕业·自由探索", text:function(){return ["你选择了自由探索。","","你不加入任何势力——你要自己去看看这个大陆。","","墨丘利教授给了你一个指南针：「去你想去的地方。但记住——有些地方，去了就回不来了。」","","（大陆章起点：自由/无势力绑定）","你不加入任何势力——这个决定让不少教授意外。西奥多院长没有劝你，只说了句：“自由要付的代价，往往比束缚更重。”","","你收拾好行囊，把五年的课本一摞一摞码在门口，留给下届新生。窗台上那盆枯死的薄荷，你浇了最后一次水。","","走出校门时，你没有回头。你要自己去看看这个大陆——用你自己的眼睛，走你自己的路。",""];},
    options:[{t:"开始自由探索（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_free", item:"mercury_compass"}}]
  };
};


  nodes["academy_graduation_watcher"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "watcher";
  return {
    place:"毕业·加入守望者", text:function(){return ["你选择了加入守望者。","","墨丘利教授带你去了学院地下的一个秘密房间——守望者的秘密据点。奥雷利安在那里等你。","","「欢迎加入守望者。」他说，「你的训练，从今天开始。」","","（大陆章起点：守望者秘密据点/七印主线）","墨丘利教授带你走过一条从没见过的走廊——它在图书馆的地基下面，灯是法术点亮的，苍白的光照在石墙上。他一路没有说话。","","走到一扇铁门前，他停下来，看了你很久：“守望者不是组织，是一种义务。现在反悔，还来得及。”","","你摇头。他推开门——门里，奥雷利安坐在一张长桌边，面前摊着一幅大陆地图，桌上烛火摇曳。他抬起头，朝你伸出手：“欢迎。从今天起，你看见的东西，要比别人多一层。”",""];},
    options:[{t:"开始守望者训练（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_watcher", knowledge:3, san:-5}}]
  };
};


  nodes["academy_graduation_eclipse"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "eclipse";
  return {
    place:"毕业·加入暗蚀会", text:function(){return ["你选择了加入暗蚀会。","","艾琳娜教授带你去了学院地下的秘密会议室——暗蚀会支部的据点。一个穿黑袍的人在等你。","","「欢迎加入暗蚀会。」他说，「我们的目标是——解放原初之物，让这个世界回归真实。」","","（大陆章起点：暗蚀会秘密据点/反派主线）","艾琳娜教授在深夜把你叫到学院后山。她披着斗篷，火光在斗篷边缘跳动：“你考虑好了？暗蚀会一旦入会，就没有退路。”","","她带你走了一条地下通道，弯弯绕绕，最后来到一间密室。一个穿黑袍的人坐在阴影里，声音听不出年纪：“艾琳娜推荐的人，不多。说说看——你为什么要来。”","","你把话说完了。黑袍人沉默片刻，从怀里取出一枚漆黑的水晶，放在桌上：“握着它。若它发烫，你就留下；若它冰冷，你就离开，今晚的事当作没发生。”",""];},
    options:[{t:"开始暗蚀会任务（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_eclipse", gold:30, san:-10}}]
  };
};


  nodes["academy_elda_club"] = function(){
  return {
    place:"社团活动",
    text:function(){
      const arr=[];
      arr.push("【学院社团】");
      arr.push("");
      arr.push("艾尔达学院有很多社团——战斗社、魔法社、炼金社、文学社、真相社、教会青年团、还有一些秘密社团。");
      arr.push("");
      arr.push("每个社团都有自己的活动、人脉和秘密。加入社团可以获得独特的剧情线和资源。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（真相社在调查学院的秘密。暗蚀会有一个秘密社团，在招募对教会不满的学生。）");
      return arr;
    },
    options:[
      {t:"战斗社", go:"academy_elda_hub", effect:{flag:"join_combat_club", exp:10, timeCost:"1period"}},
      {t:"魔法社", go:"academy_elda_hub", effect:{flag:"join_magic_club", knowledge:1, timeCost:"1period"}},
      {t:"真相社（调查学院秘密）", go:"academy_elda_hub", effect:{check:"CHA", tier:{
        crit:{t:"你加入了真相社。社长塞西莉亚很高兴——她正在调查艾伦失踪的案子，需要帮手。", effect:{flag:"join_truth_society", relation:"cecilia:+20", knowledge:1}},
        ok:{t:"你参加了真相社的活动。他们讨论了一些学院的秘密——半真半假，但很有趣。", effect:{flag:"truth_society_member"}},
        fail:{t:"你想加入真相社，但他们对新生很警惕。你只能先作为旁听者。", effect:{flag:"truth_society_observer"}},
        critfail:{t:"你问了太多问题，真相社以为你是教会的卧底。「离我们远点。」塞西莉亚冷冷地说。", effect:{relation:"cecilia:-10"}}
      }}, timeCost:"1period"},
      {t:"教会青年团", go:"academy_elda_hub", effect:{flag:"join_church_youth", relation:"gregory:+10", timeCost:"1period"}},
      {t:"返回", go:"academy_elda_hub", effect:{}}
    ]
  };
};


  nodes["academy_elda_tavern"] = function(){
  return {
    place:"学院酒馆",
    text:function(){
      const arr=[];
      arr.push("学院门口的酒馆是学生们最喜欢去的地方。");
      arr.push("");
      arr.push("这里有酒、有食物、有八卦，还有各种传闻。");
      arr.push("");
      arr.push("你可以在这里听到很多消息——关于教授的秘密、关于学院的暗流、关于大陆的新闻。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('classmate_seed');
      arr.push("（酒馆的角落里，总有几个穿黑袍的人在低声交谈。）");
      return arr;
    },
    options:[{t:"喝酒听传闻", go:"academy_elda_hub", effect:{gold:-5, knowledge:1, san:2, timeCost:"1period"}},
      {t:"和同学一起喝酒", go:"academy_elda_hub", effect:{gold:-10, relation:"classmates:+15", timeCost:"1period"}},
      {t:"偷听黑袍人的对话", go:"academy_elda_hub", effect:{check:"AGI", tier:{
        crit:{t:"你悄悄靠近，听到了他们的对话——关于七印，关于原初之物，关于一个叫「解放日」的计划。你记住了每一个字。", effect:{knowledge:3, flag:"eclipse_plan_overheard", san:-8}},
        ok:{t:"你听到了一些片段——他们在讨论某个秘密计划，但你没听全。", effect:{knowledge:1, san:-3}},
        fail:{t:"你试图偷听，但被发现了。他们冷冷地看了你一眼，然后换了个话题。", effect:{san:-2}},
        critfail:{t:"你偷听的时候被发现了，他们把你围住了。「你听到了什么？」一个人问。你赶紧说什么都没听到，他们才放你走。", effect:{san:-10, flag:"eclipse_noticed_you"}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_elda_hub", effect:{}}, {"t": "听一听角落里那两个高年级学生的低语", "go": "academy_y2_tavern_rumor"}]
  } /*v45opt:academy_elda_tavern*/;
};


  nodes["academy_holy_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "holy_seminary";
  S.academy.year = 1;
  return {
    place:"圣光神学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【圣光神学院 · 第一年】");
      arr.push("");
      arr.push("白袍、圣歌、钟声——这是圣光神学院的日常。");
      arr.push("");
      arr.push("你站在神学院的大门前，看着那巨大的圣光徽章。阳光照在上面，反射出耀眼的光芒。");
      arr.push("");
      arr.push("从今天起，你是圣光神学院的学生了。愿圣光指引你的道路。");
      arr.push("");
      arr.push("但你很快就会发现——神圣的外表下，隐藏着黑暗的秘密。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('npc_lie');
      arr.push("（地下审讯室里，有人在哭泣。但没有人敢提。）");
      return arr;
    },
    options:[
      {t:"开始第一天（晨祷+课程）", go:"academy_holy_hub", effect:{flag:"holy_year1_start"}},
      {t:"先探索一下学院", go:"academy_holy_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_holy_hub"] = function(){
  initAcademyV28();
  return {
    place:"圣光神学院",
    text:function(){
      const arr=[];
      arr.push("【圣光神学院 · 第" + S.academy.year + "年 · " + TIME_PERIODS_V26[S.time.period].name + "】");
      arr.push("");
      arr.push("神学院的生活很规律——晨祷、上课、午祷、上课、晚祷、禁足。");
      arr.push("");
      arr.push("你可以去上课、去图书馆、找教授、参加社团，或者——在深夜偷偷探索神学院的秘密。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("");
      arr.push("（注意：深夜禁足。被抓到会被处分。但深夜是探索秘密的最好时机。）");
      return arr;
    },
    options:function(){
      const opts=[];
      opts.push({t:"去上课", go:"academy_holy_class", effect:{timeCost:"1period"}});
      opts.push({t:"去图书馆", go:"academy_holy_library", effect:{timeCost:"1period"}});
      opts.push({t:"找教授/同学", go:"academy_holy_social", effect:{timeCost:"1period"}});
      opts.push({t:"参加社团/祷告", go:"academy_holy_club", effect:{timeCost:"1period"}});
      if(S.time.period === "night"){
        opts.push({t:"【深夜】偷偷探索", go:"academy_holy_secret_explore", effect:{timeCost:"1period"}});
      }
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});
      return opts;
    }
  };
};


  nodes["academy_holy_class"] = function(){
  const courses = ["神学基础（本尼迪克特）","神圣魔法（塞拉芬娜）","教会法（卢克）","治疗术（玛丽）","异端识别（马库斯）","追踪术（保罗）"];
  const course = courses[Math.floor(Math.random()*courses.length)];
  return {
    place:"教室·" + course,
    text:function(){
      const arr=[];
      arr.push("【" + course + "】");
      arr.push("");
      arr.push("教授在讲台上讲课。学生们穿着白袍，认真记笔记。");
      arr.push("");
      arr.push("你可以认真听讲，也可以走神，或者——思考教授话里的漏洞。");
      return arr;
    },
    options:[
      {t:"认真听讲", go:"academy_holy_hub", effect:{check:"INT", tier:{
        crit:{t:"你完全理解了教授讲的内容，甚至提出了一个让教授惊讶的问题。教授记住了你——但有些教授的眼神里，多了一丝警惕。", effect:{knowledge:2, reputation:5, exp:15}},
        ok:{t:"你认真听讲，学到了一些东西。", effect:{knowledge:1, exp:10}},
        fail:{t:"你努力想听懂，但神学内容太抽象了。你只记住了一部分。", effect:{knowledge:1, exp:5}},
        critfail:{t:"你听着听着就睡着了。教授叫醒了你，全班都在看你。「愿圣光宽恕你的懒惰。」教授说。", effect:{reputation:-5, san:-2}}
      }}, timeCost:"1period"},
      {t:"质疑教授的观点", go:"academy_holy_hub", effect:{check:"CHA", tier:{
        crit:{t:"你提出了一个尖锐的问题——关于净化令的合理性。教授沉默了很久，然后说：「你的问题很好。但有些问题，不适合在课堂上讨论。」下课后，教授悄悄给了你一本书。", effect:{knowledge:2, flag:"holy_question_asked", item:"forbidden_book"}},
        ok:{t:"你提出了一个问题，教授回答了——但你感觉他在回避什么。", effect:{knowledge:1}},
        fail:{t:"你提出了一个问题，教授用标准答案打发了你。", effect:{knowledge:0}},
        critfail:{t:"你提出了一个「异端」问题。教授的脸色变了：「这个问题，你以后不要再问了。」你感觉裁判所的人注意到了你。", effect:{reputation:-10, flag:"holy_suspected", san:-5}}
      }}, timeCost:"1period"},
      {t:"走神", go:"academy_holy_hub", effect:{san:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_holy_library"] = function(){
  return {
    place:"神学院图书馆",
    text:function(){
      const arr=[];
      arr.push("神学院的图书馆很安静——太安静了。");
      arr.push("");
      arr.push("书架上摆满了神学书籍、圣徒传记、教会法典。但你注意到——有一些书架是空的，上面贴着「已封存」的标签。");
      arr.push("");
      arr.push("图书管理员是一个老修女，她的眼睛很尖——你感觉她在监视每一个借书的学生。");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      arr.push("（你听说，图书馆的地下室有一个「异端档案库」——里面收藏着被教会封禁的书籍。）");
      return arr;
    },
    options:[
      {t:"借阅普通神学书籍", go:"academy_holy_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"询问「已封存」的书籍", go:"academy_holy_hub", effect:{check:"CHA", tier:{
        crit:{t:"老修女看了你很久，然后悄悄说：「跟我来。」她带你去了一个隐藏的房间——里面是一些「不适合普通学生阅读」的书。你在里面找到了一本关于七印的书。", effect:{knowledge:3, flag:"holy_secret_books", san:-5}},
        ok:{t:"老修女说：「那些书已经封存了，不能借阅。」但她悄悄告诉你，哪些书可以在教授批准后阅读。", effect:{knowledge:1}},
        fail:{t:"老修女冷冷地说：「那些书不适合你。」她不再理你了。", effect:{reputation:-2}},
        critfail:{t:"你追问得太紧，老修女叫来了裁判所的人。「这个学生在打听禁书。」你被警告了。", effect:{reputation:-10, flag:"holy_warned"}}
      }}, timeCost:"1period"},
      {t:"离开", go:"academy_holy_hub", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_holy_social"] = function(){
  return {
    place:"神学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在神学院里走动，遇到了一些人。");
      arr.push("");
      arr.push("神学院的学生大多很虔诚——但也有一些人，眼神里藏着别的东西。");
      arr.push("");
      arr.push("你可以找教授请教，找同学聊天，或者去教堂祷告。");
      return arr;
    },
    options:[
      {t:"找大主教本尼迪克特", go:"academy_holy_hub", effect:{check:"SPR", tier:{
        crit:{t:"大主教和你聊了很久。他问了你对净化令的看法——你说了实话。他沉默了，然后说：「你是个诚实的孩子。但在这个地方，诚实可能会害了你。」他悄悄告诉你一些教会的秘密。", effect:{knowledge:3, flag:"benedict_trust", relation:"benedict:+20", san:-5}},
        ok:{t:"大主教和你聊了一会儿。他给了你一些神学上的指导。", effect:{knowledge:1, relation:"benedict:+10"}},
        fail:{t:"大主教很忙，只和你说了几句话。", effect:{relation:"benedict:+3"}},
        critfail:{t:"你问了不该问的问题。大主教的脸色变了：「有些问题，不要问。」他让你离开了。", effect:{relation:"benedict:-10", san:-3}}
      }}, timeCost:"1period"},
      {t:"找圣女塞拉芬娜", go:"academy_holy_hub", effect:{check:"SPR", tier:{
        crit:{t:"圣女塞拉芬娜看着你，眼神很深。「你……能听到吗？」她问。你不知道她在说什么，但你感觉——她身上有什么东西，和你很像。", effect:{knowledge:2, flag:"seraphina_connection", relation:"seraphina:+15", san:-8}},
        ok:{t:"圣女塞拉芬娜为你祈福。你感觉心里平静了一些。", effect:{san:5, relation:"seraphina:+10"}},
        fail:{t:"圣女塞拉芬娜在祈祷，你没有打扰她。", effect:{san:2}},
        critfail:{t:"你靠近圣女的时候，突然听到了一个声音——不是圣女的，是别的什么。你吓坏了，赶紧离开了。", effect:{san:-10}}
      }}, timeCost:"1period"},
      {t:"找同学聊天", go:"academy_holy_hub", effect:{relation:"classmate:+10", timeCost:"1period"}},
      {t:"返回", go:"academy_holy_hub", effect:{}}
    ]
  };
};


  nodes["academy_holy_club"] = function(){
  return {
    place:"神学院·社团/祷告",
    text:function(){
      const arr=[];
      arr.push("【神学院社团】");
      arr.push("");
      arr.push("神学院的「社团」不多——唱诗班、慈善团、圣术研究社、还有一个秘密的「改革读书会」。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（改革读书会在私下讨论教会的改革。暗蚀会在其中发展成员。）");
      return arr;
    },
    options:[
      {t:"参加唱诗班", go:"academy_holy_hub", effect:{flag:"join_choir", san:3, timeCost:"1period"}},
      {t:"参加慈善团", go:"academy_holy_hub", effect:{flag:"join_charity", reputation:5, timeCost:"1period"}},
      {t:"参加圣术研究社", go:"academy_holy_hub", effect:{flag:"join_holy_magic_club", knowledge:1, timeCost:"1period"}},
      {t:"【秘密】加入改革读书会", go:"academy_holy_hub", effect:{check:"CHA", tier:{
        crit:{t:"你被邀请加入了改革读书会。成员们在私下讨论教会的改革——有些人甚至在讨论「净化令的合法性」。你认识了一些有趣的人。", effect:{flag:"join_reform_group", knowledge:2, relation:"reform_group:+15"}},
        ok:{t:"你参加了一次改革读书会的活动。他们讨论了一些教会的问题，但很谨慎。", effect:{flag:"reform_observer"}},
        fail:{t:"你想加入改革读书会，但他们对你很警惕。你只能先作为旁听者。", effect:{flag:"reform_observer"}},
        critfail:{t:"你打听改革读书会的事被裁判所知道了。「你在打听什么？」一个审判官问你。你赶紧说什么都不知道。", effect:{reputation:-10, flag:"holy_investigated"}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_holy_hub", effect:{}}
    ]
  };
};


  nodes["academy_holy_secret_explore"] = function(){
  return {
    place:"【深夜】神学院秘密探索",
    text:function(){
      const arr=[];
      arr.push("深夜的神学院很安静——只有巡逻的审判官的脚步声。");
      arr.push("");
      arr.push("你可以偷偷探索神学院的秘密区域——地下审讯室、圣物库、异端档案库、圣女密室。");
      arr.push("");
      arr.push("但被抓到的后果很严重——可能被开除，甚至被当成异端。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('seal_omen');
      arr.push("（地下深处，有什么东西在呼吸。不是人类的呼吸——是更古老、更庞大的存在。）");
      return arr;
    },
    options:[
      {t:"探索地下审讯室", go:"academy_holy_hub", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了地下审讯室。你看到了一些被关押的人——有些是异端，有些只是知道了教会秘密的普通人。你还看到了一些审讯记录——关于七印，关于原初之物。你悄悄退了出来，但你已经知道了太多。", effect:{knowledge:3, flag:"holy_prison_seen", san:-15}},
        ok:{t:"你偷偷进入了地下审讯室的外围。你看到了一些牢房和审讯记录，但没有深入。", effect:{knowledge:1, san:-5}},
        fail:{t:"你试图进入地下审讯室，但被巡逻的审判官发现了。你赶紧跑了，没有被抓到。", effect:{san:-3}},
        critfail:{t:"你被审判官抓住了！「深夜在这里做什么？」你被带到了裁判所。经过一番解释，你才被放出来——但你被标记为「可疑人员」。", effect:{reputation:-15, flag:"holy_suspect", san:-8}}
      }}, timeCost:"1period"},
      {t:"探索异端档案库", go:"academy_holy_hub", effect:{check:"INT", tier:{
        crit:{t:"你找到了异端档案库的入口。里面收藏着大量被封禁的书籍——你在里面找到了《七印：完整的真相》和黄林晶的笔记。你读了一部分，世界观被颠覆了。", effect:{knowledge:3, flag:"holy_heretic_books", san:-10}},
        ok:{t:"你找到了一些被封禁的书籍，匆匆看了几本。", effect:{knowledge:1, san:-3}},
        fail:{t:"你没有找到异端档案库的入口。", effect:{san:-1}},
        critfail:{t:"你在寻找异端档案库的时候被发现了。「你在找什么？」一个审判官问。你赶紧说迷路了，才蒙混过关。", effect:{reputation:-8, san:-5}}
      }}, timeCost:"1period"},
      {t:"回去睡觉", go:"academy_holy_hub", effect:{san:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_holy_explore"] = function(){
  return {
    place:"神学院·探索",
    text:function(){
      const arr=[];
      arr.push("你在神学院里探索。");
      arr.push("");
      arr.push("教堂、图书馆、宿舍、训练场——一切都很神圣，很整洁。");
      arr.push("");
      arr.push("但你注意到——有些地方，是禁止学生进入的。");
      arr.push("");
      arr.push("地下审讯室、圣物库、异端档案库、圣女密室——这些地方，都藏着教会的秘密。");
      arr.push("圣光神学院的走廊一尘不染，白墙上挂着历代圣徒的画像。你走过时，脚步在石板地上回响，显得格外响。");arr.push("");arr.push("教堂里传来唱诗班的歌声，低低的，像水流过鹅卵石。图书馆里，白袍的修士伏在案上抄经，笔尖沙沙。训练场边，神官们正在练习光系神术，指尖亮起柔和的白光。");arr.push("");arr.push("但你注意到，有一座侧楼的窗户钉着铁条，门上一把大锁，锁孔里塞着蜡。你路过时，一个路过的修士停下脚步，看了你一眼，又走开了。那一眼的意思，你没能读懂。");arr.push("");return arr;
    },
    options:[
      {t:"参观教堂", go:"academy_holy_hub", effect:{san:3, timeCost:"1period"}},
      {t:"参观训练场", go:"academy_holy_hub", effect:{exp:5, timeCost:"1period"}},
      {t:"注意禁止进入的区域", go:"academy_holy_hub", effect:{knowledge:1, flag:"holy_secrets_noticed", timeCost:"1period"}},
      {t:"返回", go:"academy_holy_year1", effect:{}}
    ]
  };
};


  nodes["academy_holy_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "church";
  return {
    place:"圣光神学院·毕业",
    text:function(){
      const arr=[];
      arr.push("【圣光神学院·毕业】");
      arr.push("");
      arr.push("五年的神学院生活结束了。");
      arr.push("");
      arr.push("你可以选择成为主教、审判官、圣术师、传教士——或者，离开教会，走自己的路。");
      arr.push("");
      arr.push("你在神学院知道的秘密，将决定你未来的路。");
      arr.push("毕业弥撒上，唱诗班的歌声在穹顶下回荡。格雷戈里教授为你行完祝福礼，把一枚圣徽别在你衣领上：“圣光神学院五年，你学的不只是祷文和神术——你要记住，神爱世人，也要你学会爱具体的人。”");arr.push("");arr.push("你站在教堂门口，回头最后看了一眼彩窗上的圣像。阳光透过彩窗，在地面上投下五彩的光斑。五年，你在这里学会祈祷，也学会怀疑。");arr.push("");arr.push("你走出教堂，钟声在身后响起。圣城的街道上，白袍的神官来来往往。你摸了摸胸前的圣徽——它的温度，比想象中要凉。");arr.push("");return arr;
    },
    options:[
      {t:"成为审判官（教会精英）", go:"fc_jiaohui_entry", effect:{flag:"holy_judge", reputation:20, timeCost:"1period"}},
      {t:"成为圣术师（治疗/驱魔）", go:"fc_jiaohui_entry", effect:{flag:"holy_mage", reputation:15, timeCost:"1period"}},
      {t:"成为传教士（自由探索）", go:"fc_jiaohui_entry", effect:{flag:"holy_missionary", timeCost:"1period"}},
      {t:"离开教会（秘密路线）", go:"fc_jiaohui_entry", effect:{flag:"holy_leave", san:-5, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "imperial_military";
  S.academy.year = 1;
  return {
    place:"帝国军事学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【帝国军事学院 · 第一年】");
      arr.push("");
      arr.push("「起床！！！」");
      arr.push("");
      arr.push("军士长汉斯的吼声把你从床上拽了起来。天还没亮，你就要开始晨练了。");
      arr.push("");
      arr.push("铁血、纪律、战友情——这是军事学院的日常。");
      arr.push("");
      arr.push("从今天起，你是帝国军事学院的学生了。服从命令，完成任务。");
      arr.push("");
      arr.push("但你很快就会发现——军事学院的水下，也有暗流。秘密研究派在用活人做实验，主战派和主和派在明争暗斗。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('karma_seed');
      arr.push("（地下实验场里，传来了惨叫声。但没有人敢提。）");
      return arr;
    },
    options:[
      {t:"开始第一天（晨练+课程）", go:"academy_military_hub", effect:{flag:"military_year1_start"}},
      {t:"先观察一下环境", go:"academy_military_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_hub"] = function(){
  initAcademyV28();
  return {
    place:"帝国军事学院",
    text:function(){
      const arr=[];
      arr.push("【帝国军事学院 · 第" + S.academy.year + "年 · " + TIME_PERIODS_V26[S.time.period].name + "】");
      arr.push("");
      arr.push("军事学院的生活很严格——晨练、上课、实战演练、军事会议、巡逻。");
      arr.push("");
      arr.push("你可以去训练、去上课、找教官、参加战术讨论，或者——在深夜偷偷探索军事学院的秘密。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options:function(){
      const opts=[];
      opts.push({t:"去训练", go:"academy_military_training", effect:{timeCost:"1period"}});
      opts.push({t:"去上课", go:"academy_military_class", effect:{timeCost:"1period"}});
      opts.push({t:"找教官/同学", go:"academy_military_social", effect:{timeCost:"1period"}});
      opts.push({t:"参加战术讨论", go:"academy_military_strategy", effect:{timeCost:"1period"}});
      if(S.time.period === "night"){
        opts.push({t:"【深夜】偷偷探索", go:"academy_military_secret_explore", effect:{timeCost:"1period"}});
      }
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});
      return opts;
    }
  };
};


  nodes["academy_military_training"] = function(){
  return {
    place:"训练场",
    text:function(){
      const arr=[];
      arr.push("训练场尘土飞扬。");
      arr.push("");
      arr.push("军士长汉斯在监督训练——他的眼睛很尖，任何偷懒都会被他发现。");
      arr.push("");
      arr.push("你可以选择训练剑术、格斗、骑术，或者——和同学对练。");
      return arr;
    },
    options:[
      {t:"训练剑术", go:"academy_military_hub", effect:{check:"STR", tier:{
        crit:{t:"你的剑术进步神速！军士长汉斯点了点头：「不错。你有成为精锐的潜力。」", effect:{exp:20, flag:"sword_prodigy", relation:"hans:+10"}},
        ok:{t:"你认真训练，剑术有所进步。", effect:{exp:10}},
        fail:{t:"你训练得很辛苦，但进步不大。汉斯说：「再努力点！」", effect:{exp:5, hp:-5}},
        critfail:{t:"你训练的时候受伤了——剑不小心划到了自己。汉斯骂了你一顿。", effect:{hp:-15, reputation:-5}}
      }}, timeCost:"1period"},
      {t:"训练格斗", go:"academy_military_hub", effect:{exp:10, hp:-5, timeCost:"1period"}},
      {t:"和同学对练", go:"academy_military_hub", effect:{check:"STR", tier:{
        crit:{t:"你击败了所有对练的同学！全场震惊。你成了新生中的名人。", effect:{exp:15, reputation:15}},
        ok:{t:"你和同学对练，互有胜负。关系增进了。", effect:{exp:10, relation:"classmate:+10"}},
        fail:{t:"你输给了同学。但他说：「没关系，下次再来。」", effect:{exp:5, relation:"classmate:+5"}},
        critfail:{t:"你在对练中受了伤，还输了。同学们有点看不起你。", effect:{hp:-10, reputation:-5}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_military_class"] = function(){
  const courses = ["军团战术（卡拉德）","骑术（伊莎贝拉）","战略理论（克劳塞维茨）","战斗魔法（梅林）","战场急救（艾尔莎）","战争史（克劳塞维茨）"];
  const course = courses[Math.floor(Math.random()*courses.length)];
  return {
    place:"教室·" + course,
    text:function(){
      const arr=[];
      arr.push("【" + course + "】");
      arr.push("");
      arr.push("教授在讲台上讲课。军事学院的课程很实用——都是战场上能用的东西。");
      return arr;
    },
    options:[
      {t:"认真听讲", go:"academy_military_hub", effect:{knowledge:1, exp:10, timeCost:"1period"}},
      {t:"提问/讨论", go:"academy_military_hub", effect:{check:"INT", tier:{
        crit:{t:"你提出了一个很有深度的战术问题。教授很欣赏你——克劳塞维茨元帅甚至邀请你加入他的战略研讨小组。", effect:{knowledge:2, flag:"strategy_group", relation:"clausewitz:+15"}},
        ok:{t:"你提出了一个问题，教授认真回答了。", effect:{knowledge:1}},
        fail:{t:"你提出了一个问题，但教授觉得太幼稚了。", effect:{reputation:-2}},
        critfail:{t:"你问了一个「不该问」的问题——关于秘密研究派的实验。教授的脸色变了：「这个问题，以后不要问了。」", effect:{flag:"military_suspected", san:-3}}
      }}, timeCost:"1period"},
      {t:"走神", go:"academy_military_hub", effect:{san:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_social"] = function(){
  return {
    place:"军事学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在军事学院里走动，遇到了一些人。");
      arr.push("");
      arr.push("军事学院的学生大多是贵族子弟——但也有一些平民出身的天才。");
      arr.push("");
      arr.push("你可以找教官请教，找同学聊天，或者去军营酒吧喝一杯。");
      return arr;
    },
    options:[
      {t:"找克劳塞维茨元帅", go:"academy_military_hub", effect:{check:"INT", tier:{
        crit:{t:"克劳塞维茨元帅和你聊了很久。他问了你对战争的看法——你说了实话。他沉默了，然后说：「你是个有头脑的孩子。但在这个地方，有头脑可能会害了你。」他悄悄告诉你一些关于战争的真相。", effect:{knowledge:3, flag:"clausewitz_trust", relation:"clausewitz:+20", san:-5}},
        ok:{t:"克劳塞维茨元帅和你聊了一会儿。他给了你一些战略上的指导。", effect:{knowledge:1, relation:"clausewitz:+10"}},
        fail:{t:"克劳塞维茨元帅很忙，只和你说了几句话。", effect:{relation:"clausewitz:+3"}},
        critfail:{t:"你问了不该问的问题。克劳塞维茨元帅的脸色变了：「有些事情，不要问。」他让你离开了。", effect:{relation:"clausewitz:-10", san:-3}}
      }}, timeCost:"1period"},
      {t:"找梅林大法师", go:"academy_military_hub", effect:{check:"SPR", tier:{
        crit:{t:"梅林大法师看着你，眼神很深。「你……能看到符文吗？」他问。你不知道他在说什么，但你感觉——他在观察你。", effect:{knowledge:2, flag:"merlin_watching", relation:"merlin:+15", san:-5}},
        ok:{t:"梅林大法师和你聊了一会儿魔法。他给了你一些指导。", effect:{knowledge:1, relation:"merlin:+10"}},
        fail:{t:"梅林大法师很神秘，没有多说什么。", effect:{relation:"merlin:+3"}},
        critfail:{t:"你问了不该问的问题。梅林大法师的眼神变了：「你知道得太多了。」他让你离开了。", effect:{relation:"merlin:-10", san:-5}}
      }}, timeCost:"1period"},
      {t:"找同学聊天", go:"academy_military_hub", effect:{relation:"classmate:+10", timeCost:"1period"}},
      {t:"去军营酒吧", go:"academy_military_hub", effect:{gold:-5, relation:"classmates:+15", san:3, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_strategy"] = function(){
  return {
    place:"战术讨论室",
    text:function(){
      const arr=[];
      arr.push("战术讨论室里，学生们在讨论一场虚构的战役。");
      arr.push("");
      arr.push("你可以加入讨论，展示你的战略头脑。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（讨论的战役中，有一个「神秘武器」的设定——你感觉，那不是虚构的。）");
      arr.push("战术讨论室里，一张巨大的沙盘摆在中央，山川河流城池，做得惟妙惟肖。十几个学生围在四周，各执一词。");arr.push("");arr.push("沙盘上正演示一场围攻战：蓝军据城而守，红军断其粮道。一个学生指着东面的山道：“从这里分兵，绕到城后，前后夹击。”另一个立刻反驳：“分兵是大忌——城还没破，粮道先被截了。”");arr.push("");arr.push("教官坐在角落，一言不发地听着，偶尔在纸上记几笔。你站在人群外围，看着沙盘上的局势，忽然想：如果是你指挥，你会怎么打？");arr.push("");return arr;
    },
    options:[
      {t:"加入讨论", go:"academy_military_hub", effect:{check:"INT", tier:{
        crit:{t:"你提出了一个绝妙的战术方案！全场震惊。克劳塞维茨元帅亲自表扬了你。", effect:{knowledge:2, reputation:15, flag:"strategy_genius"}},
        ok:{t:"你提出了一个不错的方案，得到了一些认可。", effect:{knowledge:1, reputation:5}},
        fail:{t:"你的方案被批评了——有很多漏洞。", effect:{reputation:-3}},
        critfail:{t:"你的方案被嘲笑了。「这是什么乱七八糟的？」一个贵族学生说。你很尴尬。", effect:{reputation:-10, san:-3}}
      }}, timeCost:"1period"},
      {t:"旁听", go:"academy_military_hub", effect:{knowledge:1, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_secret_explore"] = function(){
  return {
    place:"【深夜】军事学院秘密探索",
    text:function(){
      const arr=[];
      arr.push("深夜的军事学院很安静——只有巡逻的哨兵。");
      arr.push("");
      arr.push("你可以偷偷探索军事学院的秘密区域——秘密武器库、战略室、秘密实验场、军事监狱。");
      arr.push("");
      arr.push("但被抓到的后果很严重——可能被开除，甚至被当成间谍。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（地下实验场里，有什么东西在尖叫。不是人类的尖叫——是更古老、更痛苦的存在。）");
      return arr;
    },
    options:[
      {t:"探索秘密实验场", go:"academy_military_hub", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了秘密实验场。你看到了——他们在用活人实验七印的力量。那些实验体，有些已经不像人了。你还看到了一件用原初之物碎片打造的武器。你悄悄退了出来，但你已经知道了太多。", effect:{knowledge:3, flag:"military_experiment_seen", san:-15}},
        ok:{t:"你偷偷进入了实验场的外围。你看到了一些实验设备和记录，但没有深入。", effect:{knowledge:1, san:-5}},
        fail:{t:"你试图进入实验场，但被哨兵发现了。你赶紧跑了，没有被抓到。", effect:{san:-3}},
        critfail:{t:"你被哨兵抓住了！「深夜在这里做什么？」你被带到了警卫室。经过一番解释，你才被放出来——但你被标记为「可疑人员」。", effect:{reputation:-15, flag:"military_suspect", san:-8}}
      }}, timeCost:"1period"},
      {t:"探索军事监狱", go:"academy_military_hub", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了军事监狱。你看到了一些「战俘」——有些根本不是军人，是知道了秘密的平民。你还听到了一些对话——关于七印，关于原初之物。你悄悄退了出来。", effect:{knowledge:2, flag:"military_prison_seen", san:-10}},
        ok:{t:"你看到了一些牢房和囚犯，但没有深入。", effect:{knowledge:1, san:-3}},
        fail:{t:"你没有找到监狱的入口。", effect:{san:-1}},
        critfail:{t:"你被发现了！你赶紧跑了，但你感觉——有人在追你。", effect:{san:-8, flag:"military_chased"}}
      }}, timeCost:"1period"},
      {t:"回去睡觉", go:"academy_military_hub", effect:{san:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_military_explore"] = function(){
  return {
    place:"军事学院·探索",
    text:function(){
      const arr=[];
      arr.push("你在军事学院里探索。");
      arr.push("");
      arr.push("训练场、教室、宿舍、军营——一切都很整齐，很军事化。");
      arr.push("");
      arr.push("但你注意到——有些地方，是禁止学生进入的。");
      arr.push("");
      arr.push("秘密武器库、战略室、秘密实验场、军事监狱——这些地方，都藏着军事学院的秘密。");
      arr.push("你在军事学院里探索。训练场上，学生正对着木桩练劈砍，呼喝声整齐划一；教室里，教官在黑板前讲解攻城器械的结构图；宿舍区，被子叠得方方正正，像豆腐块。");arr.push("");arr.push("一切都很整齐，很军事化——连脚步声都像踩着同一个节拍。你走了一会儿，就明白这里的规矩：纪律是第一位的。");arr.push("");arr.push("但你注意到，营房尽头有一扇铁门，挂着‘禁止入内’的牌子。门缝里透出一点灯光，还有低沉的机器声。你站了一会儿，没有靠近。");arr.push("");return arr;
    },
    options:[
      {t:"参观训练场", go:"academy_military_hub", effect:{exp:5, timeCost:"1period"}},
      {t:"参观武器库（普通区域）", go:"academy_military_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"注意禁止进入的区域", go:"academy_military_hub", effect:{knowledge:1, flag:"military_secrets_noticed", timeCost:"1period"}},
      {t:"返回", go:"academy_military_year1", effect:{}}
    ]
  };
};


  nodes["academy_military_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "military";
  return {
    place:"帝国军事学院·毕业",
    text:function(){
      const arr=[];
      arr.push("【帝国军事学院·毕业】");
      arr.push("");
      arr.push("五年的军事学院生活结束了。");
      arr.push("");
      arr.push("你可以选择成为军官、参谋、战斗法师——或者，离开军队，走自己的路。");
      arr.push("");
      arr.push("你在军事学院知道的秘密，将决定你未来的路。");
      arr.push("结业检阅那天，雷蒙德将军亲自为你授衔。他把肩章拍在你肩上，拍得你肩膀一沉：“帝国军事学院五年——从现在起，你是个真正的兵了。”");arr.push("");arr.push("操场上，方阵踏着正步走过，扬起的尘土遮天蔽日。你想起五年前自己在这里被晒晕的狼狈样子，想起夜里的紧急集合、战术沙盘、和那些被罚跑的黄昏。");arr.push("");arr.push("军号响起，方阵解散。你站在原地，摸了摸肩章。铁门关的风从远处吹来，带着铁锈和硝烟的味道——那里，才是你真正的战场。");arr.push("");return arr;
    },
    options:[
      {t:"成为军官（前线指挥官）", go:"fc_jiaohui_entry", effect:{flag:"military_officer", reputation:20, timeCost:"1period"}},
      {t:"成为参谋（战略/情报）", go:"fc_jiaohui_entry", effect:{flag:"military_staff", reputation:15, knowledge:2, timeCost:"1period"}},
      {t:"成为战斗法师", go:"fc_jiaohui_entry", effect:{flag:"military_battle_mage", reputation:10, exp:20, timeCost:"1period"}},
      {t:"离开军队（秘密路线）", go:"fc_jiaohui_entry", effect:{flag:"military_leave", san:-5, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "silver_leaf";
  S.academy.year = 1;
  return {
    place:"银叶学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【银叶学院 · 第一年】");
      arr.push("");
      arr.push("你站在世界树的枝干上，看着脚下的云海。");
      arr.push("");
      arr.push("银叶学院建在世界树之上——这里没有教室，只有在树枝间的平台；没有铃声，只有鸟鸣和风声。");
      arr.push("");
      arr.push("精灵的时间感和人类不同——对他们来说，五年只是一瞬间。但对你来说，这是你的青春。");
      arr.push("");
      arr.push("古老、优雅、神秘——这是银叶学院的日常。");
      arr.push("");
      arr.push("但你很快就会发现——精灵的优雅下，隐藏着古老的秘密和沉重的宿命。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（世界树的根系深处，有什么东西在沉睡。它已经睡了三千年。）");
      return arr;
    },
    options:[
      {t:"开始第一天（冥想+课程）", go:"academy_elf_hub", effect:{flag:"elf_year1_start"}},
      {t:"先探索一下世界树", go:"academy_elf_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_hub"] = function(){
  initAcademyV28();
  return {
    place:"银叶学院",
    text:function(){
      const arr=[];
      arr.push("【银叶学院 · 第" + S.academy.year + "年 · " + TIME_PERIODS_V26[S.time.period].name + "】");
      arr.push("");
      arr.push("世界树的枝叶在风中沙沙作响。精灵学生们在树枝间轻盈地跳跃，像鸟儿一样。");
      arr.push("");
      arr.push("你可以去上课、去图书馆、找长老请教、在森林中冥想，或者——探索世界树的秘密。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("");
      arr.push("（精灵的时间感和你不同——他们觉得一天很短，你觉得一天很长。）");
      arr.push("世界树的枝叶在风中沙沙作响，像一场听不清的低语。精灵学生们在树枝间轻盈地跳跃，衣袍翻飞，像一群白色的鸟。");arr.push("");arr.push("你顺着树干上的阶梯往上走，路过一间间悬在枝桠间的教室。一间教室里，长老正在讲古代文字，声音轻得像流水；另一间里，几个精灵围着一幅星图，低声争论着什么。");arr.push("");arr.push("你站在这座活的学院里，第一次理解了精灵们为什么总说“时间很慢”——在这棵树下，连风都走得比别处从容。");arr.push("");return arr;
    },
    options:function(){
      const opts=[];
      opts.push({t:"去上课", go:"academy_elf_class", effect:{timeCost:"1period"}});
      opts.push({t:"去古代图书馆", go:"academy_elf_library", effect:{timeCost:"1period"}});
      opts.push({t:"找长老/同学", go:"academy_elf_social", effect:{timeCost:"1period"}});
      opts.push({t:"在森林中冥想", go:"academy_elf_meditate", effect:{timeCost:"1period"}});
      opts.push({t:"探索世界树秘密", go:"academy_elf_secret", effect:{timeCost:"1period"}});
      opts.push({t:"等待/休息", go:"wait_1period", effect:{}});
      return opts;
    }
  };
};


  nodes["academy_elf_class"] = function(){
  const courses = ["自然魔法（艾莉娅）","古代史（塞拉芬）","音乐（露娜）","星象学（诺娃）","植物学","精灵语"];
  const course = courses[Math.floor(Math.random()*courses.length)];
  return {
    place:"课堂·" + course,
    text:function(){
      const arr=[];
      arr.push("【" + course + "】");
      arr.push("");
      arr.push("精灵的课堂和人类完全不同——没有固定的教室，教授在森林中边走边讲，学生们跟在后面。");
      arr.push("");
      arr.push("知识不是被「教」的，是被「感受」的。");
      return arr;
    },
    options:[
      {t:"用心感受", go:"academy_elf_hub", effect:{check:"SPR", tier:{
        crit:{t:"你完全沉浸在了自然之中。你感受到了世界树的脉搏——它在呼吸，在思考，在记忆。长老惊讶地看着你：「你有精灵的天赋。」", effect:{knowledge:2, san:5, exp:15, flag:"elf_talent"}},
        ok:{t:"你感受到了一些自然的力量。有所收获。", effect:{knowledge:1, san:3, exp:10}},
        fail:{t:"你努力想感受，但什么都没感受到。精灵同学看你的眼神有点怜悯。", effect:{knowledge:1, exp:5}},
        critfail:{t:"你不仅没感受到，还被一只精灵鸟拉了一头。同学们笑了。", effect:{reputation:-5, san:-2}}
      }}, timeCost:"1period"},
      {t:"提问/讨论", go:"academy_elf_hub", effect:{knowledge:1, relation:"elf_classmate:+5", timeCost:"1period"}},
      {t:"走神/看风景", go:"academy_elf_hub", effect:{san:3, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_library"] = function(){
  return {
    place:"古代图书馆",
    text:function(){
      const arr=[];
      arr.push("古代图书馆在世界树的一个巨大树洞里。");
      arr.push("");
      arr.push("书架是用活的树枝做成的，书籍是用树叶和树皮做的。这里收藏着精灵文明五千年的文献。");
      arr.push("");
      arr.push("你可以在这里找到很多人类学院没有的知识——关于七印、关于原初之物、关于情感之灾。");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      plantForeshadowV27('seal_omen');
      arr.push("（最深处的书架，有黄林晶时代的完整记录。但精灵长老不允许人类阅读。）");
      return arr;
    },
    options:[
      {t:"阅读普通书籍", go:"academy_elf_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"尝试阅读禁书（七印相关）", go:"academy_elf_hub", effect:{check:"INT", tier:{
        crit:{t:"你找到了一本关于七印的古籍——上面记载着七印建造的完整过程，和黄林晶的真实动机。你读了一部分，世界观被颠覆了。", effect:{knowledge:3, san:-10, flag:"elf_seal_truth"}},
        ok:{t:"你找到了一些关于七印的记载，但被长老发现了。「这些书不适合人类阅读。」他说。你只记住了一部分。", effect:{knowledge:1, san:-3}},
        fail:{t:"你没有找到禁书区的入口。", effect:{knowledge:0}},
        critfail:{t:"你被长老抓住了！「人类，你在找什么？」经过一番解释，你才被放出来——但你被标记为「可疑人员」。", effect:{reputation:-10, flag:"elf_suspect"}}
      }}, timeCost:"1period"},
      {t:"和图书管理员聊天", go:"academy_elf_hub", effect:{relation:"elf_librarian:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_social"] = function(){
  return {
    place:"银叶学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在世界树的枝干上走动，遇到了一些精灵。");
      arr.push("");
      arr.push("精灵们很美，很优雅——但也很冷漠。他们看人类的眼神，像看一个短命的孩子。");
      arr.push("");
      arr.push("但有些精灵，对你很好奇——他们很少见到人类。");
      return arr;
    },
    options:[
      {t:"找长老艾莉娅", go:"academy_elf_hub", effect:{check:"SPR", tier:{
        crit:{t:"长老艾莉娅和你聊了很久。她告诉你一些关于世界树和第三印的秘密——但她要求你发誓，不告诉任何人。", effect:{knowledge:3, flag:"arya_trust", relation:"arya:+20", san:-5}},
        ok:{t:"长老艾莉娅和你聊了一会儿自然魔法。", effect:{knowledge:1, relation:"arya:+10"}},
        fail:{t:"长老艾莉娅很忙，只和你说了几句话。", effect:{relation:"arya:+3"}},
        critfail:{t:"你问了不该问的问题。长老的脸色变了：「人类，有些事情不是你该知道的。」她让你离开了。", effect:{relation:"arya:-10", san:-3}}
      }}, timeCost:"1period"},
      {t:"找精灵同学聊天", go:"academy_elf_hub", effect:{relation:"elf_classmate:+10", timeCost:"1period"}},
      {t:"参加精灵的音乐会", go:"academy_elf_hub", effect:{san:5, relation:"elf_classmates:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_meditate"] = function(){
  return {
    place:"森林冥想",
    text:function(){
      const arr=[];
      arr.push("你在森林中找了一个安静的地方，开始冥想。");
      arr.push("");
      arr.push("世界树的能量包围着你。你能感受到——生命的流动，时间的流逝，还有……一些更古老的东西。");
      arr.push("");
      plantForeshadowV27('primordial_whisper');
      arr.push("（你听到了一个声音——很古老，很疲惫，像是在沉睡中呢喃。）");
      return arr;
    },
    options:[
      {t:"深入冥想", go:"academy_elf_hub", effect:{check:"SPR", tier:{
        crit:{t:"你深入冥想，感受到了第三印的存在——它在世界树的根系深处，在沉睡。你还感受到了原初之物「傲慢」的气息——它被封印在第三印中。你赶紧退出了冥想，但你已经感受到了太多。", effect:{knowledge:3, san:-15, flag:"felt_third_seal"}},
        ok:{t:"你感受到了一些自然的力量，内心平静了。", effect:{san:5, knowledge:1}},
        fail:{t:"你冥想了很久，但什么都没感受到。", effect:{san:2}},
        critfail:{t:"你冥想的时候被什么东西「触碰」了——不是恶意，但很古老，很强大。你吓坏了，赶紧退出了冥想。", effect:{san:-10, flag:"touched_by_ancient"}}
      }}, timeCost:"1period"},
      {t:"停止冥想", go:"academy_elf_hub", effect:{san:3, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_elf_secret"] = function(){
  return {
    place:"世界树·秘密探索",
    text:function(){
      const arr=[];
      arr.push("你决定探索世界树的秘密。");
      arr.push("");
      arr.push("世界树很大——比你想象的大得多。它的根系延伸到地下深处，它的枝干触及云层。");
      arr.push("");
      arr.push("有很多地方是禁止人类进入的——世界树根系、古代图书馆深处、星象塔顶层、隐秘林地。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（第三印的入口，就在世界树根系深处。）");
      return arr;
    },
    options:[
      {t:"探索世界树根系", go:"academy_elf_hub", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了世界树根系。你看到了——第三印的入口。它在发光，在跳动，像一颗心脏。你还看到了精灵长老们在进行某种仪式——他们在「喂养」第三印。你悄悄退了出来，但你已经知道了太多。", effect:{knowledge:3, flag:"elf_third_seal_seen", san:-15}},
        ok:{t:"你进入了根系的外围，看到了一些古老的符文和壁画。", effect:{knowledge:1, san:-3}},
        fail:{t:"你没有找到根系的入口。", effect:{san:-1}},
        critfail:{t:"你被精灵守卫发现了！「人类，这里禁止进入。」你被赶了出来，还被警告了。", effect:{reputation:-10, flag:"elf_warned"}}
      }}, timeCost:"1period"},
      {t:"探索星象塔", go:"academy_elf_hub", effect:{check:"SPR", tier:{
        crit:{t:"你爬上了星象塔顶层。你看到了——未来。不是清晰的画面，是碎片：战争、深渊、七印破碎、还有……你的脸。你赶紧下来了，但你已经看到了不该看的东西。", effect:{knowledge:2, san:-20, flag:"elf_future_seen"}},
        ok:{t:"你爬上了星象塔，看到了美丽的星空。", effect:{san:5}},
        fail:{t:"你没有找到星象塔的入口。", effect:{san:-1}},
        critfail:{t:"你在星象塔上迷路了，转了很久才下来。你感觉——有什么东西在看着你。", effect:{san:-8}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_elf_hub", effect:{}}
    ]
  };
};


  nodes["academy_elf_explore"] = function(){
  return {
    place:"世界树·探索",
    text:function(){
      const arr=[];
      arr.push("你在世界树上探索。");
      arr.push("");
      arr.push("这里太美了——阳光透过树叶洒下斑驳的光影，精灵们在树枝间歌唱，空气中弥漫着花香。");
      arr.push("");
      arr.push("但你注意到——有些地方，精灵们不去。那些地方的树叶是黑色的，空气是冷的。");
      arr.push("世界树的枝干宽阔得像道路，你在上面走了大半个时辰，也不觉得累。阳光透过层层叠叠的树叶，在树皮上投下碎金一样的光斑。");arr.push("");arr.push("精灵们在树枝间来往，有的背着书卷，有的提着小篮，篮子里装着发光的果子。他们从你身边走过，带着一股草木的清气，脚步轻得像没有重量。");arr.push("");arr.push("你注意到，有几条枝干通向的地方，精灵们从不靠近。那些地方的叶子是黑色的，空气是冷的——连鸟都不从那里飞过。你站在分岔口，看了很久。");arr.push("");return arr;
    },
    options:[
      {t:"欣赏风景", go:"academy_elf_hub", effect:{san:5, timeCost:"1period"}},
      {t:"注意黑色树叶的区域", go:"academy_elf_hub", effect:{knowledge:1, flag:"elf_black_leaves_noticed", timeCost:"1period"}},
      {t:"返回", go:"academy_elf_year1", effect:{}}
    ]
  };
};


  nodes["academy_elf_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "elf";
  return {
    place:"银叶学院·毕业",
    text:function(){
      const arr=[];
      arr.push("【银叶学院·毕业】");
      arr.push("");
      arr.push("五年——对精灵来说只是一瞬间，但对你来说，是整个青春。");
      arr.push("");
      arr.push("长老艾莉娅给了你一个礼物——一片世界树的叶子。「它会在你需要的时候指引你。」她说。");
      arr.push("");
      arr.push("你站在世界树的顶端，最后看了一眼这片云海。然后你转身，走向了人类的世界。");
      arr.push("精灵长老在你的毕业文书上系了一根银线：“五年——对精灵来说只是一瞬间。可你在这五年里长的本事，够你用一辈子。”");arr.push("");arr.push("你站在世界树的枝干上，看阳光穿过层层叠叠的树叶，在树皮上落下斑驳的光影。五年了，你终于能像精灵一样在树枝间自如行走——可你知道，你终究不是他们。");arr.push("");arr.push("你沿着树干缓缓走下，脚下是坚实的土地。你回头看了一眼——世界树静静立着，像一位沉默的长辈，目送远行的人。");arr.push("");return arr;
    },
    options:[
      {t:"带着精灵的祝福离开（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_elf", item:"world_tree_leaf", san:10}}
    ]
  };
};


  nodes["academy_dwarf_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "ironpeak_forge";
  S.academy.year = 1;
  return {
    place:"铁峰锻造学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【铁峰锻造学院 · 第一年】");
      arr.push("");
      arr.push("「哐——！哐——！」");
      arr.push("");
      arr.push("铁锤敲击铁砧的声音从四面八方传来。这里是地下——没有天空，没有阳光，只有炉火的光芒和金属的碰撞声。");
      arr.push("");
      arr.push("矮人没有昼夜概念——熔炉永不熄灭，工匠们轮班工作。对你来说，这是全新的体验。");
      arr.push("");
      arr.push("炉火、铁锤、啤酒——这是矮人学院的日常。");
      arr.push("");
      arr.push("但你很快就会发现——矮人的熔炉下，隐藏着更古老的秘密。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（永恒熔炉的深处，有什么东西在呼吸。它的呼吸，让熔炉永不熄灭。）");
      return arr;
    },
    options:[
      {t:"开始第一天（锻造+课程）", go:"academy_dwarf_hub", effect:{flag:"dwarf_year1_start"}},
      {t:"先参观一下熔炉", go:"academy_dwarf_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_dwarf_hub"] = function(){
  initAcademyV28();
  return {
    place:"铁峰锻造学院",
    text:function(){
      const arr=[];
      arr.push("【铁峰锻造学院 · 第" + S.academy.year + "年】");
      arr.push("");
      arr.push("炉火通明，铁锤声声。矮人学生们在锻造台前忙碌，汗水和火星一起飞舞。");
      arr.push("");
      arr.push("你可以去锻造、去上课、找大师请教、喝啤酒社交，或者——探索矮人王国的秘密。");
      arr.push("");
      arr.push("（矮人没有昼夜概念——熔炉永不熄灭。你需要自己安排休息时间。）");
      arr.push("铁峰锻造学院的空气，永远是热的。");arr.push("你站在工坊门口，看着矮人学生们抡着锤子，汗水从下巴滴到铁砧上，滋地冒起一缕白烟。没有人抬头看你——在这里，锤声就是语言，铁花就是问候。");arr.push("你找到一个空着的锻造台，拿起一把旧锤子。锤柄被无数只手磨得发亮，握着它，你能感觉到一种说不清的踏实——像握着一个承诺。");arr.push("旁边一个矮人学徒瞥了你一眼：「人类？头回来？」你点头。他哼了一声：「砸铁三下，让我看看。」");arr.push("你抡起锤子，砸了三下。铁花四溅，声音清脆。他眯着眼看了你一会儿，忽然笑了：「行。比上回那个只会甩笔杆子的强。」他拍了拍身边的凳子，「坐，歇会儿。一会儿我教你认炉火。」");arr.push("你坐下。炉火在眼前跳动，热浪扑面。你忽然觉得，这个地方虽然粗粝，可每一寸空气里，都盛着一种干干净净的认真。");return arr;
    } /*v45inj:academy_dwarf_hub*/,
    options:function(){
      const opts=[];
      opts.push({t:"去锻造", go:"academy_dwarf_forge", effect:{timeCost:"1period"}});
      opts.push({t:"去上课", go:"academy_dwarf_class", effect:{timeCost:"1period"}});
      opts.push({t:"找大师/同学", go:"academy_dwarf_social", effect:{timeCost:"1period"}});
      opts.push({t:"去酒馆喝啤酒", go:"academy_dwarf_tavern", effect:{timeCost:"1period"}});
      opts.push({t:"探索深层矿洞", go:"academy_dwarf_secret", effect:{timeCost:"1period"}});
      opts.push({t:"休息", go:"wait_1period", effect:{}});
      return opts;
    }
  };
};


  nodes["academy_dwarf_forge"] = function(){
  return {
    place:"锻造台",
    text:function(){
      const arr=[];
      arr.push("你站在锻造台前，炉火正旺。");
      arr.push("");
      arr.push("矮人大师索林在旁边监督——他的眼睛很尖，任何锻造失误都会被他发现。");
      arr.push("");
      arr.push("你可以选择锻造一把武器、一件护甲，或者——尝试符文锻造。");
      return arr;
    },
    options:[
      {t:"锻造武器", go:"academy_dwarf_hub", effect:{check:"STR", tier:{
        crit:{t:"你锻造出了一把精良的武器！大师索林点了点头：「不错。你有锻造的天赋。」", effect:{item:"crafted_weapon", exp:15, relation:"thorin:+10"}},
        ok:{t:"你锻造出了一把合格的武器。", effect:{item:"basic_weapon", exp:10}},
        fail:{t:"你锻造的武器质量一般。索林说：「再练练。」", effect:{exp:5}},
        critfail:{t:"你锻造的时候受伤了——火星溅到了手上。索林骂了你一顿。", effect:{hp:-10, reputation:-5}}
      }}, timeCost:"1period"},
      {t:"尝试符文锻造", go:"academy_dwarf_hub", effect:{check:"INT", tier:{
        crit:{t:"你成功在武器上刻入了符文！大师都灵很惊讶：「你有符文的天赋。来符文院吧。」", effect:{item:"rune_weapon", knowledge:2, flag:"rune_talent"}},
        ok:{t:"你刻入了一个简单的符文。武器有了微弱的魔力。", effect:{item:"basic_rune_weapon", knowledge:1}},
        fail:{t:"符文刻错了，武器报废了。", effect:{exp:3}},
        critfail:{t:"符文失控了！爆炸把你炸飞了。你受了伤，还被都灵骂了一顿。", effect:{hp:-15, san:-5}}
      }}, timeCost:"1period"},
      {t:"看大师锻造（学习）", go:"academy_dwarf_hub", effect:{knowledge:1, exp:5, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_dwarf_class"] = function(){
  const courses = ["锻造学（索林）","工程学（格罗因）","炼金术（巴林）","符文学（都灵）","矿物学","矮人历史"];
  const course = courses[Math.floor(Math.random()*courses.length)];
  return {
    place:"课堂·" + course,
    text:function(){
      const arr=[];
      arr.push("【" + course + "】");
      arr.push("");
      arr.push("矮人的课堂很实用——没有太多理论，大部分时间在实践。");
      arr.push("");
      arr.push("教授边做边讲，学生们边看边学。");
      return arr;
    },
    options:[
      {t:"认真学习", go:"academy_dwarf_hub", effect:{knowledge:1, exp:10, timeCost:"1period"}},
      {t:"提问/讨论", go:"academy_dwarf_hub", effect:{knowledge:1, relation:"dwarf_professor:+5", timeCost:"1period"}},
      {t:"走神", go:"academy_dwarf_hub", effect:{san:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_dwarf_social"] = function(){
  return {
    place:"矮人学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在矮人王国里走动，遇到了一些矮人。");
      arr.push("");
      arr.push("矮人们很豪爽——他们喜欢啤酒、锻造和讲故事。");
      arr.push("");
      arr.push("但有些矮人，对人类很警惕——他们记得人类曾经背叛过他们。");
      return arr;
    },
    options:[
      {t:"找大师索林", go:"academy_dwarf_hub", effect:{check:"STR", tier:{
        crit:{t:"索林和你比了一次腕力——你赢了！他大笑：「好小子！有矮人的力气！来，喝一杯！」你们成了朋友。", effect:{relation:"thorin:+20", san:5, flag:"thorin_friend"}},
        ok:{t:"索林和你聊了一会儿锻造。", effect:{knowledge:1, relation:"thorin:+10"}},
        fail:{t:"索林很忙，只和你说了几句话。", effect:{relation:"thorin:+3"}},
        critfail:{t:"你说了不该说的话——关于永恒熔炉。索林的脸色变了：「人类，有些事情不要问。」", effect:{relation:"thorin:-10", san:-3}}
      }}, timeCost:"1period"},
      {t:"找符文师都灵", go:"academy_dwarf_hub", effect:{check:"INT", tier:{
        crit:{t:"都灵和你聊了很久符文。他告诉你一些关于永恒熔炉和第四印的秘密——但他要求你发誓保密。", effect:{knowledge:3, flag:"durin_trust", relation:"durin:+20", san:-5}},
        ok:{t:"都灵教了你一些基础符文。", effect:{knowledge:1, relation:"durin:+10"}},
        fail:{t:"都灵很神秘，没有多说什么。", effect:{relation:"durin:+3"}},
        critfail:{t:"你问了不该问的问题。都灵的眼神变了：「你知道得太多了。」", effect:{relation:"durin:-10", san:-5}}
      }}, timeCost:"1period"},
      {t:"找矮人同学聊天", go:"academy_dwarf_hub", effect:{relation:"dwarf_classmate:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_dwarf_tavern"] = function(){
  return {
    place:"矮人酒馆",
    text:function(){
      const arr=[];
      arr.push("矮人酒馆里人声鼎沸。");
      arr.push("");
      arr.push("矮人们喝着啤酒，唱着战歌，讲着故事。空气中弥漫着麦酒和烤肉的香味。");
      arr.push("");
      arr.push("你可以在这里听到很多矮人故事——关于古代战争、关于宝藏、关于永恒熔炉。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（一个喝醉的老矮人在嘟囔：「熔炉下面……有东西……它在饿……」）");
      return arr;
    },
    options:[
      {t:"喝啤酒听故事", go:"academy_dwarf_hub", effect:{gold:-3, knowledge:1, san:5, timeCost:"1period"}},
      {t:"和矮人一起唱歌", go:"academy_dwarf_hub", effect:{gold:-5, relation:"dwarf_classmates:+15", san:5, timeCost:"1period"}},
      {t:"偷听老矮人的嘟囔", go:"academy_dwarf_hub", effect:{check:"AGI", tier:{
        crit:{t:"你凑近听，听到了老矮人的故事——他年轻时曾经下到永恒熔炉的最深处，看到了「第四印」和一个「永远在饿的东西」。你记住了每一个字。", effect:{knowledge:3, flag:"dwarf_forge_story", san:-8}},
        ok:{t:"你听到了一些片段——关于熔炉深处的秘密。", effect:{knowledge:1, san:-3}},
        fail:{t:"老矮人喝醉了，说的话含糊不清。", effect:{knowledge:0}},
        critfail:{t:"你被发现了！「人类，你在偷听什么？」矮人们很不高兴。你赶紧道歉。", effect:{reputation:-5, san:-2}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_dwarf_secret"] = function(){
  return {
    place:"深层矿洞·探索",
    text:function(){
      const arr=[];
      arr.push("你决定探索深层矿洞。");
      arr.push("");
      arr.push("矿洞越深，温度越高，光线越暗。只有熔炉的光芒照亮着道路。");
      arr.push("");
      arr.push("有很多区域是禁止学生进入的——永恒熔炉深处、符文宝库、隐秘锻造场。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（第四印的核心，就在永恒熔炉深处。原初之物「贪婪」被封印在那里——它永远在饿。）");
      return arr;
    },
    options:[
      {t:"探索永恒熔炉深处", go:"academy_dwarf_hub", effect:{check:"CON", tier:{
        crit:{t:"你偷偷进入了永恒熔炉的最深处。你看到了——第四印。它在熔炉的中心，在发光，在跳动。你还感受到了原初之物「贪婪」的气息——它在饿，永远在饿。你赶紧退了出来，但你已经感受到了太多。", effect:{knowledge:3, flag:"dwarf_fourth_seal_seen", san:-15, hp:-10}},
        ok:{t:"你进入了熔炉的外围，感受到了惊人的热量和魔力。", effect:{knowledge:1, san:-3, hp:-5}},
        fail:{t:"太热了，你无法深入。", effect:{hp:-3}},
        critfail:{t:"你被矮人守卫发现了！「人类，这里禁止进入！」你被赶了出来，还被烫伤了。", effect:{hp:-15, reputation:-10}}
      }}, timeCost:"1period"},
      {t:"探索符文宝库", go:"academy_dwarf_hub", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了符文宝库。你看到了——矮人最珍贵的符文武器，其中有一件，是用原初之物的碎片打造的。你不敢碰，悄悄退了出来。", effect:{knowledge:2, flag:"dwarf_rune_vault_seen", san:-8}},
        ok:{t:"你看到了一些符文武器，但没有深入。", effect:{knowledge:1, san:-2}},
        fail:{t:"你没有找到宝库的入口。", effect:{san:-1}},
        critfail:{t:"你被发现了！你赶紧跑了，但你感觉——有什么东西在追你。", effect:{san:-8, flag:"dwarf_chased"}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_dwarf_hub", effect:{}}
    ]
  };
};


  nodes["academy_dwarf_explore"] = function(){
  return {
    place:"铁峰堡·探索",
    text:function(){
      const arr=[];
      arr.push("你在铁峰堡里探索。");
      arr.push("");
      arr.push("这里是地下王国——巨大的洞穴、闪烁的矿脉、永不熄灭的熔炉。");
      arr.push("");
      arr.push("矮人们在这里生活了五千年——每一条隧道，每一座桥梁，都有故事。");
      return arr;
    },
    options:[
      {t:"参观主熔炉", go:"academy_dwarf_hub", effect:{knowledge:1, timeCost:"1period"}},
      {t:"注意禁止进入的区域", go:"academy_dwarf_hub", effect:{knowledge:1, flag:"dwarf_secrets_noticed", timeCost:"1period"}},
      {t:"返回", go:"academy_dwarf_year1", effect:{}}
    ]
  };
};


  nodes["academy_dwarf_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "dwarf";
  return {
    place:"铁峰锻造学院·毕业",
    text:function(){
      const arr=[];
      arr.push("【铁峰锻造学院·毕业】");
      arr.push("");
      arr.push("五年的锻造生涯结束了。");
      arr.push("");
      arr.push("大师索林给了你一把他亲手锻造的锤子——「用它，锻造你自己的路。」");
      arr.push("");
      arr.push("你站在铁峰堡的出口，最后看了一眼这片地下的灯火。然后你转身，走向了地面的世界。");
      arr.push("索林把一柄短锤交给你——锤柄是黑铁木的，握在手里沉甸甸，锤面锃亮，能照出人影：“铁峰锻造学院毕业的，手里没家伙，说出去丢人。拿着。”");arr.push("");arr.push("地下王国的灯火在身后连成一片，熔炉的轰鸣声顺着隧道传来。你在这里打了五年铁，手上磨出厚厚的茧，也学会了听铁的呼吸。");arr.push("");arr.push("你背着锤子，踩着石阶往上走。光从洞口漏进来——外面是真正的世界。矮人的话还响在耳边：“铁是凉的，可打铁的人心是热的。别丢了这口气。”");arr.push("");return arr;
    },
    options:[
      {t:"带着矮人的祝福离开（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_dwarf", item:"master_hammer", reputation:10}}
    ]
  };
};


  nodes["academy_orc_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "war_god";
  S.academy.year = 1;
  return {
    place:"战神学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【战神学院 · 第一年】");
      arr.push("");
      arr.push("「吼——！！！」");
      arr.push("");
      arr.push("兽人的战吼响彻草原。这里没有教室，只有训练场；没有课本，只有武器和伤疤。");
      arr.push("");
      arr.push("实战为主，每年有试炼仪式——死亡率很高。但活下来的，都是真正的战士。");
      arr.push("");
      arr.push("草原、战鼓、篝火——这是兽人学院的日常。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（第二印就在兽人草原深处。萨满们知道它的存在，但他们不说。）");
      return arr;
    },
    options:[
      {t:"开始第一天（战斗训练）", go:"academy_orc_hub", effect:{flag:"orc_year1_start"}},
      {t:"先看看草原", go:"academy_orc_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_orc_hub"] = function(){
  initAcademyV28();
  return {
    place:"战神学院",
    text:function(){
      const arr=[];
      arr.push("【战神学院 · 第" + S.academy.year + "年】");
      arr.push("");
      arr.push("草原辽阔，战鼓声声。兽人学生们在训练场上厮杀，汗水和鲜血一起挥洒。");
      arr.push("");
      arr.push("你可以去训练、去狩猎、找萨满请教、参加篝火故事，或者——探索草原的秘密。");
      arr.push("战鼓声从训练场那边传来，一下一下，敲得地面都跟着震。战神学院的操场上，兽人学生们正捉对厮杀——没有护具，只有木制的兵器，和越打越响的吼声。");arr.push("");arr.push("你站在场边，看一个新生被摔了个跟头，爬起来拍拍土，又冲了上去。教官站在高处，抱着胳膊，面无表情地看，偶尔吼一声：“腿！腿！别拿脸接！”");arr.push("");arr.push("风从草原上吹来，带着青草和血汗的气味。你忽然觉得，这座学院虽然粗野，却有一种坦荡——喜欢就是喜欢，讨厌就是讨厌，从不藏着掖着。");arr.push("");return arr;
    },
    options:[
      {t:"去战斗训练", go:"academy_orc_training", effect:{timeCost:"1period"}},
      {t:"去狩猎", go:"academy_orc_hunt", effect:{timeCost:"1period"}},
      {t:"找萨满/同学", go:"academy_orc_social", effect:{timeCost:"1period"}},
      {t:"参加篝火故事", go:"academy_orc_bonfire", effect:{timeCost:"1period"}},
      {t:"探索草原秘密", go:"academy_orc_secret", effect:{timeCost:"1period"}},
      {t:"休息", go:"wait_1period", effect:{}}
    ]
  };
};


  nodes["academy_orc_training"] = function(){
  return {
    place:"训练场",
    text:function(){
      const arr=[];
      arr.push("训练场上尘土飞扬。");
      arr.push("");
      arr.push("兽人教官在监督训练——他的方式很简单：打，直到你学会为止。");
      arr.push("训练场上尘土飞扬，兽人教官站在场中央，抱着一根粗木棒。他看了你一眼，把木棒往地上一顿：“新来的？先绕着场子跑二十圈——跑完再说。”");arr.push("");arr.push("你跑完二十圈，撑着膝盖喘气。教官走过来，绕着你转了一圈：“还行，没趴下。接下来练格挡——我用棒子打，你用盾挡。挡不住，挨一下，长记性。”");arr.push("");arr.push("他挥棒打来，你举起盾。棒子砸在盾上，震得你虎口发麻，后退三步。教官却笑了：“不错，没扔盾。明天这个时候，还在这。”");arr.push("");return arr;
    },
    options:[
      {t:"全力训练", go:"academy_orc_hub", effect:{check:"STR", tier:{
        crit:{t:"你在训练中击败了所有对手！兽人教官大笑：「好！有战士的灵魂！」", effect:{exp:20, reputation:15, flag:"orc_prodigy"}},
        ok:{t:"你认真训练，有所进步。", effect:{exp:10}},
        fail:{t:"你训练得很辛苦，但被兽人同学打败了。", effect:{exp:5, hp:-10}},
        critfail:{t:"你在训练中受了重伤。教官说：「弱者，不配当战士。」", effect:{hp:-20, reputation:-10}}
      }}, timeCost:"1period"},
      {t:"和兽人对练", go:"academy_orc_hub", effect:{exp:10, hp:-5, relation:"orc_classmate:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_orc_hunt"] = function(){
  return {
    place:"草原狩猎",
    text:function(){
      const arr=[];
      arr.push("你和兽人同学一起去草原狩猎。");
      arr.push("");
      arr.push("草原上有很多猎物——野兔、羚羊、甚至草原狼。");
      arr.push("");
      arr.push("狩猎不仅是获取食物，也是兽人证明自己的方式。");
      arr.push("你和兽人同学一起去草原狩猎。他给你一把弓，拍拍你的肩：“别紧张。草原上的猎物，跑不过你的箭——只要你不先手抖。”");arr.push("");arr.push("你们伏在草丛里等了一刻钟。他忽然压低声音：“三点钟方向，野兔。”你顺着他的目光看过去，一只灰兔正在啃草，耳朵竖得老高。");arr.push("");arr.push("你张弓搭箭，屏住呼吸。箭离弦的一瞬，野兔惊起——箭擦着它的耳朵钉进土里。兽人同学拍了拍你的肩：“不错了。我第一次打猎，射中的是我自己的靴子。”");arr.push("");return arr;
    },
    options:[
      {t:"全力狩猎", go:"academy_orc_hub", effect:{check:"AGI", tier:{
        crit:{t:"你独自猎杀了一头草原狼！兽人们对你刮目相看。", effect:{item:"wolf_pelt", reputation:15, exp:10}},
        ok:{t:"你猎到了一些猎物。", effect:{gold:5, exp:5}},
        fail:{t:"你什么都没猎到。兽人们有点看不起你。", effect:{reputation:-3}},
        critfail:{t:"你被草原狼袭击了！受了伤，还差点死掉。", effect:{hp:-25, san:-5}}
      }}, timeCost:"1period"},
      {t:"和兽人一起狩猎", go:"academy_orc_hub", effect:{gold:3, relation:"orc_classmates:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_orc_social"] = function(){
  return {
    place:"兽人学院·社交",
    text:function(){
      const arr=[];
      arr.push("你在兽人王庭里走动。");
      arr.push("");
      arr.push("兽人们很直接——他们喜欢就喜欢你，讨厌就讨厌你，没有中间地带。");
      arr.push("你在兽人王庭里走动，这里的一切都比学院粗粝得多——石墙、兽皮、火盆，连空气里都飘着烤肉和皮革的味道。");arr.push("");arr.push("兽人们很直接。你帮一个老兽人搬了桶水，他二话不说塞给你一块熏肉：“拿着。你不错。”几个年轻兽人在摔跤，输了的一方爬起来，拍拍土，哈哈大笑。");arr.push("");arr.push("你站在火盆边，看火光把每个人的脸照得忽明忽暗。在这里，没有那么多弯弯绕绕——喜欢就是喜欢，讨厌就是讨厌。你忽然觉得，这样也挺好。");arr.push("");return arr;
    },
    options:[
      {t:"找萨满请教", go:"academy_orc_hub", effect:{check:"SPR", tier:{
        crit:{t:"萨满和你聊了很久。他告诉你一些关于第二印和原初之物「愤怒」的秘密——但他说，这些知识有代价。", effect:{knowledge:3, flag:"orc_shaman_trust", san:-10}},
        ok:{t:"萨满教了你一些基础的萨满术。", effect:{knowledge:1, san:3}},
        fail:{t:"萨满很神秘，没有多说什么。", effect:{san:2}},
        critfail:{t:"你问了不该问的问题。萨满的眼神变了：「人类，有些知识会杀了你。」", effect:{san:-8}}
      }}, timeCost:"1period"},
      {t:"找兽人同学聊天", go:"academy_orc_hub", effect:{relation:"orc_classmate:+10", timeCost:"1period"}}
    ]
  };
};


  nodes["academy_orc_bonfire"] = function(){
  return {
    place:"篝火晚会",
    text:function(){
      const arr=[];
      arr.push("夜晚，兽人们围坐在篝火旁，唱着战歌，讲着祖先的故事。");
      arr.push("");
      arr.push("你可以在这里听到很多兽人历史——关于古代战争、关于英雄、关于第二印。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（一个老萨满在讲一个故事——关于「愤怒的封印」和「永远在燃烧的战士」。）");
      return arr;
    },
    options:[
      {t:"听故事", go:"academy_orc_hub", effect:{knowledge:1, san:3, timeCost:"1period"}},
      {t:"和兽人一起唱歌", go:"academy_orc_hub", effect:{relation:"orc_classmates:+15", san:5, timeCost:"1period"}},
      {t:"偷听老萨满的故事", go:"academy_orc_hub", effect:{check:"AGI", tier:{
        crit:{t:"你听到了老萨满的完整故事——关于第二印，关于原初之物「愤怒」，关于兽人祖先和它的契约。你记住了每一个字。", effect:{knowledge:3, flag:"orc_second_seal_story", san:-8}},
        ok:{t:"你听到了一些片段。", effect:{knowledge:1, san:-3}},
        fail:{t:"老萨满的话含糊不清。", effect:{knowledge:0}},
        critfail:{t:"你被发现了！兽人们很不高兴。", effect:{reputation:-5}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_orc_secret"] = function(){
  return {
    place:"草原·秘密探索",
    text:function(){
      const arr=[];
      arr.push("你决定探索草原的秘密。");
      arr.push("");
      arr.push("草原很大——比你想象的大得多。有些地方，兽人们不去。那些地方的草是黑色的，空气是热的。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（第二印就在草原深处。它在松动——原初之物「愤怒」在挣扎。）");
      return arr;
    },
    options:[
      {t:"探索黑色草地", go:"academy_orc_hub", effect:{check:"CON", tier:{
        crit:{t:"你走到了黑色草地的中心。你看到了——第二印的裂缝。它在发光，在震动。你还感受到了原初之物「愤怒」的气息——它在燃烧，永远在燃烧。你赶紧退了出来。", effect:{knowledge:3, flag:"orc_second_seal_seen", san:-15}},
        ok:{t:"你看到了一些奇怪的现象——草在自燃，石头在震动。", effect:{knowledge:1, san:-3}},
        fail:{t:"太热了，你无法深入。", effect:{hp:-5}},
        critfail:{t:"你被兽人守卫发现了！「人类，这里是圣地！」你被赶了出来。", effect:{reputation:-10}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_orc_hub", effect:{}}
    ]
  };
};


  nodes["academy_orc_explore"] = function(){
  return {
    place:"草原·探索",
    text:function(){return ["你在草原上探索。","","风吹草低见牛羊。兽人们在远处放牧。","","这里很辽阔，很自由。","草原的风带着草籽和泥土的气味。你踩过的地方，蚱蜢从脚边弹开，惊起一小片灰雀。远处兽人的毡帐冒着炊烟，几匹矮壮的草原马在河边低头饮水。","","一个披着狼皮的老萨满坐在帐外，用骨针缝着什么东西。他抬头看了你一眼，没有开口，只把一根骨头扔进火堆——火苗蹿高了一瞬，又落回原样。","","你忽然明白，这片辽阔不是用来欣赏的。它每一寸都住着人，住着故事。",""];},
    options:[
      {t:"欣赏风景", go:"academy_orc_hub", effect:{san:5, timeCost:"1period"}},
      {t:"注意黑色草地", go:"academy_orc_hub", effect:{knowledge:1, flag:"orc_black_grass_noticed", timeCost:"1period"}},
      {t:"返回", go:"academy_orc_year1", effect:{}}
    ]
  };
};


  nodes["academy_orc_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "orc";
  return {
    place:"战神学院·毕业",
    text:function(){return ["【战神学院·毕业】","","五年的战斗生涯结束了。","","萨满给了你一个图腾——「它会在你需要的时候给你力量。」","","你站在草原上，最后看了一眼这片天空。然后你转身，走向了远方。","萨满把图腾递给你时，草原上正起风。图腾是兽骨雕的，刻着一只仰头长啸的狼，边缘被岁月磨得温润。他握着你的手，让你把图腾握紧：“它会记住你的心跳。你在哪里，它就在哪里醒着。”","","你站在草原上，最后看了一眼这片天空。远处毡帐的炊烟直直升起，风一过，就散了。你想起第一次在这里摔下马背，想起教官的呵斥，想起篝火边分食的烤肉。","","你转身，走向远方。风把你的影子卷在身后，像是这片草原在送你。",""];},
    options:[{t:"带着兽人的祝福离开（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_orc", item:"orc_totem", exp:20}}]
  };
};


  nodes["academy_halfling_year1"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "green_field";
  S.academy.year = 1;
  return {
    place:"绿野学院·第一年",
    text:function(){
      const arr=[];
      arr.push("【绿野学院 · 第一年】");
      arr.push("");
      arr.push("「欢迎来到绿野学院！先吃点东西吧！」");
      arr.push("");
      arr.push("半身人老太太给了你一块刚烤好的面包。这里没有严格的课程，没有考试，只有——吃、喝、睡、享受生活。");
      arr.push("");
      arr.push("但你很快就会发现——半身人的轻松下，隐藏着古老的幸运魔法传承。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（半身人的幸运魔法，可能和因果有关。他们说——「善有善报，恶有恶报。」）");
      return arr;
    },
    options:[
      {t:"开始第一天（吃+学）", go:"academy_halfling_hub", effect:{flag:"halfling_year1_start"}},
      {t:"先看看田园风光", go:"academy_halfling_explore", effect:{timeCost:"1period"}}
    ]
  };
};


  nodes["academy_halfling_hub"] = function(){
  initAcademyV28();
  return {
    place:"绿野学院",
    text:function(){
      const arr=[];
      arr.push("【绿野学院 · 第" + S.academy.year + "年】");
      arr.push("");
      arr.push("阳光明媚，鸟语花香。半身人学生们在田野里劳作，在厨房里烹饪，在树下打盹。");
      arr.push("");
      arr.push("你可以去学烹饪、学农业、学草药、参加聚餐，或者——探索半身人的秘密。");
      return arr;
    },
    options:[
      {t:"学烹饪", go:"academy_halfling_hub", effect:{check:"INT", tier:{
        crit:{t:"你做的菜太好吃了！半身人们都围过来抢着吃。老太太说：「你有烹饪的天赋！」", effect:{flag:"cooking_prodigy", reputation:15, san:5}},
        ok:{t:"你做了一顿不错的饭。", effect:{san:3, gold:5}},
        fail:{t:"你做的菜一般般。", effect:{san:1}},
        critfail:{t:"你把厨房烧了！半身人们很心疼，但没有怪你——「没关系，再做一次就好。」", effect:{reputation:-5, san:-2}}
      }}, timeCost:"1period"},
      {t:"学农业/草药", go:"academy_halfling_hub", effect:{knowledge:1, san:3, timeCost:"1period"}},
      {t:"参加聚餐", go:"academy_halfling_hub", effect:{san:5, relation:"halfling_classmates:+15", timeCost:"1period"}},
      {t:"探索幸运魔法秘密", go:"academy_halfling_secret", effect:{timeCost:"1period"}},
      {t:"休息/打盹", go:"wait_1period", effect:{san:5}}
    ]
  };
};


  nodes["academy_halfling_secret"] = function(){
  return {
    place:"绿野·秘密探索",
    text:function(){
      const arr=[];
      arr.push("你决定探索半身人的秘密。");
      arr.push("");
      arr.push("半身人看起来很轻松，但他们的幸运魔法——真的只是「运气好」吗？");
      arr.push("");
      arr.push("你听说，绿野学院的地下有一个「幸运室」——半身人的长老在那里进行某种仪式。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（半身人的幸运魔法，可能是在「借用」未来的因果。）");
      return arr;
    },
    options:[
      {t:"探索幸运室", go:"academy_halfling_hub", effect:{check:"SPR", tier:{
        crit:{t:"你找到了幸运室。你看到了——半身人的长老在进行一个古老的仪式，他们在「平衡」因果。你明白了——半身人的幸运不是天生的，是他们一代代积累的「善因」。", effect:{knowledge:3, flag:"halfling_luck_truth", san:-5}},
        ok:{t:"你看到了一些奇怪的符文和仪式用品。", effect:{knowledge:1, san:-2}},
        fail:{t:"你没有找到幸运室。", effect:{san:-1}},
        critfail:{t:"你被半身人老太太发现了！「孩子，有些事情不是你该知道的。」她笑着说，但你感觉她的眼神很深。", effect:{san:-5}}
      }}, timeCost:"1period"},
      {t:"返回", go:"academy_halfling_hub", effect:{}}
    ]
  };
};


  nodes["academy_halfling_explore"] = function(){
  return {
    place:"绿野·探索",
    text:function(){return ["你在田野里探索。","","麦田、果园、小溪——这里太美了。","","半身人们在远处劳作，歌声随风飘来。","麦田的香气混着泥土和肥料的味道。你顺着田埂走，脚边是不时窜过的田鼠和蚱蜢。远处的半身人正弯着腰割麦子，镰刀起落，麦秆齐刷刷地倒下。","","有人直起腰来，摘下草帽擦了把汗，朝你喊：“外来的学生？渴了就去井台，瓢挂在绳上，自己舀。”他的口音很软，像在唱歌。","","你走到果园边，几个半身人孩子正踮脚够树上的苹果。一个见你走近，大方地递来一个：“给你——今天摘的，还带着露水呢。”苹果红得发亮，咬一口，汁水顺着下巴淌下来。",""];},
    options:[
      {t:"欣赏风景", go:"academy_halfling_hub", effect:{san:5, timeCost:"1period"}},
      {t:"返回", go:"academy_halfling_year1", effect:{}}
    ]
  };
};


  nodes["academy_halfling_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "halfling";
  return {
    place:"绿野学院·毕业",
    text:function(){return ["【绿野学院·毕业】","","五年的田园生活结束了。","","老太太给了你一个幸运符——「它会给你带来好运。但记住，运气是会用完的。」","","你站在田野边，最后看了一眼这片金色的麦浪。然后你转身，走向了远方。","老太太把幸运符放进你手心时，麦田正泛着金光。幸运符是一枚磨圆的铜币，穿着红绳，边缘已经磨得发亮：“它会给你带来好运。但记住——运气是会用完的。用完之前，把该学的本事学到手。”","","你站在田野边，最后看了一眼这片金色的麦浪。绿野学院的五年，是你在整个大陆最安稳的五年——没有战争，没有阴谋，只有麦子、果园和热腾腾的烤饼。","","你捏了捏那枚铜币，转身走向远方。麦浪在身后起伏，像在跟你道别。",""];},
    options:[{t:"带着半身人的祝福离开（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start_halfling", item:"lucky_charm", san:10}}]
  };
};


  nodes["academy_business_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "free_city_business";
  return {
    place:"自由城邦商学院",
    text:function(){
      const arr=[];
      arr.push("【自由城邦商学院】");
      arr.push("");
      arr.push("这里的一切都和钱有关——课程、人脉、甚至友谊。");
      arr.push("");
      arr.push("你可以去上课、去市场实习、找教授请教，或者——探索美第奇家族的秘密。");
      return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"去市场实习", go:"fc_jiaohui_entry", effect:{gold:10, timeCost:"1period"}},
      {t:"探索美第奇秘密", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"你发现了美第奇家族在学院中的秘密网络——他们在培养未来的商业人才，为某个大计划做准备。", effect:{knowledge:3, flag:"medici_business_secret", san:-5}},
        ok:{t:"你发现了一些线索，但没有拼出完整的图景。", effect:{knowledge:1}},
        fail:{t:"你什么都没发现。", effect:{knowledge:0}},
        critfail:{t:"你被发现了！美第奇的人警告你：「别多管闲事。」", effect:{reputation:-10, san:-5}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_northern_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "northern_warrior";
  return {
    place:"北方战士学院",
    text:function(){
      const arr=[];
      arr.push("【北方战士学院】");
      arr.push("");
      arr.push("铁门关的风像刀一样刮在脸上。这里的学生都是硬汉——条件艰苦，但实战经验丰富。");
      arr.push("");
      arr.push("你可以去训练、去巡逻、找教官请教，或者——探索学院地下的古代战场遗迹。");
      return arr;
    },
    options:[
      {t:"去训练", go:"fc_jiaohui_entry", effect:{exp:10, timeCost:"1period"}},
      {t:"去边境巡逻", go:"fc_jiaohui_entry", effect:{exp:15, hp:-5, timeCost:"1period"}},
      {t:"探索地下遗迹", go:"fc_jiaohui_entry", effect:{check:"CON", tier:{
        crit:{t:"你在地下遗迹中发现了第一印的碎片！它在发光，在跳动。你感受到了原初之物「饥饿」的气息。", effect:{knowledge:3, flag:"northern_seal_fragment", san:-10}},
        ok:{t:"你发现了一些古代武器和盔甲。", effect:{item:"ancient_weapon", knowledge:1}},
        fail:{t:"地下遗迹太危险了，你退了回来。", effect:{hp:-5}},
        critfail:{t:"你在遗迹中遇到了深渊生物！你好不容易才逃了出来。", effect:{hp:-20, san:-10}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_southern_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "southern_navigation";
  return {
    place:"南方航海学院",
    text:function(){
      const arr=[];
      arr.push("【南方航海学院】");
      arr.push("");
      arr.push("海风、咸腥味、桅杆——这是航海学院的日常。");
      arr.push("");
      arr.push("你可以去上课、去船上实习、找教授请教，或者——寻找创始人的宝藏。");
      arr.push("南方航海学院就建在港口边，潮水涨落的声音日夜不停。桅杆的森林从校门口一直延伸到海边，风一吹，缆绳叮叮当当地响。");arr.push("");arr.push("水手模样的教官站在船头，正教新生打水手结：“手要稳，眼要活——海上可没重来一次的机会。”他的嗓门很大，压过了海浪。");arr.push("");arr.push("你站在码头边，看一艘训练船缓缓驶出港。海风带着咸腥味灌进鼻子。你知道，这座学院教的不是纸上的学问，是浪里求生的本事。");arr.push("");return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"去船上实习", go:"fc_jiaohui_entry", effect:{gold:10, exp:5, timeCost:"1period"}},
      {t:"寻找海盗宝藏", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"你找到了创始人的宝藏线索——一张古老的海图，标记着第五印附近的一个岛屿。", effect:{knowledge:2, flag:"pirate_treasure_clue", item:"ancient_map"}},
        ok:{t:"你找到了一些金币和旧物。", effect:{gold:30}},
        fail:{t:"你什么都没找到。", effect:{gold:0}},
        critfail:{t:"你被其他寻宝者抢劫了！", effect:{gold:-20, hp:-10}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_eastern_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "eastern_literature";
  return {
    place:"东部文学院",
    text:function(){
      const arr=[];
      arr.push("【东部文学院】");
      arr.push("");
      arr.push("书香、墨香、诗词——这是文学院的日常。");
      arr.push("");
      arr.push("你可以去上课、去图书馆、找教授请教，或者——寻找那本「预言书」。");
      return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"去图书馆", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"寻找预言书", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"你找到了那本预言书！上面预言了七印的破碎、深渊的降临、还有——你的名字。你合上书，手在发抖。", effect:{knowledge:3, flag:"prophecy_book_found", san:-15}},
        ok:{t:"你找到了一些预言相关的书籍，但没有找到那本「预言书」。", effect:{knowledge:1, san:-3}},
        fail:{t:"你什么都没找到。", effect:{knowledge:0}},
        critfail:{t:"你被图书馆管理员抓住了！「禁书区不能进。」你被赶了出来。", effect:{reputation:-5}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_western_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "western_ranger";
  return {
    place:"西部游侠学院",
    text:function(){
      const arr=[];
      arr.push("【西部游侠学院】");
      arr.push("");
      arr.push("自由、冒险、远方——这是游侠学院的日常。");
      arr.push("");
      arr.push("你可以去训练、去探险、找教官请教，或者——探索守望者的秘密。");
      arr.push("西部游侠学院建在风谷口，三面是赭红色的岩壁，一面对着开阔的荒原。风从谷口灌进来，终年不停，把院墙打磨得光滑。");arr.push("");arr.push("操场上，游侠学生们在练骑射。马蹄踏起的尘土被风卷走，箭矢钉在靶心，发出沉闷的声响。一个披风衣的教官站在高处，眯着眼看了一会儿，点了点头。");arr.push("");arr.push("你站在风里，把衣领紧了紧。自由、冒险、远方——这座学院的每一块石头，都在说这三个词。");arr.push("");return arr;
    },
    options:[
      {t:"去训练", go:"fc_jiaohui_entry", effect:{exp:10, timeCost:"1period"}},
      {t:"去野外探险", go:"fc_jiaohui_entry", effect:{exp:15, timeCost:"1period"}},
      {t:"探索守望者秘密", go:"fc_jiaohui_entry", effect:{check:"SPR", tier:{
        crit:{t:"你发现了学院创始人的秘密——他是一个守望者，在西海岸监视深渊的动向。他留下了一些守望者的档案。", effect:{knowledge:3, flag:"wester_watcher_secret", san:-5}},
        ok:{t:"你发现了一些守望者的线索。", effect:{knowledge:1}},
        fail:{t:"你什么都没发现。", effect:{knowledge:0}},
        critfail:{t:"你被一个神秘人警告了：「别再查了。这对你没好处。」", effect:{san:-8}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_law_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "church_law";
  return {
    place:"教会法学院",
    text:function(){
      const arr=[];
      arr.push("【教会法学院】");
      arr.push("");
      arr.push("法条、审判、祷告——这是法学院的日常。");
      arr.push("");
      arr.push("你可以去上课、去旁听审判、找教授请教，或者——探索地下室的秘密。");
      return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"旁听审判", go:"fc_jiaohui_entry", effect:{knowledge:1, san:-3, timeCost:"1period"}},
      {t:"探索地下室", go:"fc_jiaohui_entry", effect:{check:"AGI", tier:{
        crit:{t:"你偷偷进入了地下室。你看到了一些被关押的人——有些根本不是异端，是知道了教会秘密的平民。你还看到了一些审讯记录。", effect:{knowledge:2, flag:"law_prison_seen", san:-10}},
        ok:{t:"你看到了一些牢房，但没有深入。", effect:{knowledge:1, san:-3}},
        fail:{t:"你没有找到地下室的入口。", effect:{san:-1}},
        critfail:{t:"你被审判官抓住了！「你在做什么？」你赶紧解释，才被放出来。", effect:{reputation:-10}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_dwarfeng_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "dwarf_engineering";
  return {
    place:"矮人工程学院",
    text:function(){
      const arr=[];
      arr.push("【矮人工程学院】");
      arr.push("");
      arr.push("图纸、锤子、工地——这是工程学院的日常。");
      arr.push("");
      arr.push("你可以去上课、去工地实习、找教授请教，或者——探索「永动机」的秘密。");
      return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, timeCost:"1period"}},
      {t:"去工地实习", go:"fc_jiaohui_entry", effect:{gold:10, exp:5, timeCost:"1period"}},
      {t:"探索永动机秘密", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"你发现了那个教授的研究——他已经接近成功了！但「永动机」的能量来源，是原初之物的碎片。你明白了——这不是发明，是禁忌。", effect:{knowledge:3, flag:"perpetual_motion_secret", san:-8}},
        ok:{t:"你看到了一些奇怪的设计图。", effect:{knowledge:1}},
        fail:{t:"你什么都没看懂。", effect:{knowledge:0}},
        critfail:{t:"你被教授发现了！「这是我的研究！别碰！」他很生气。", effect:{reputation:-5}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_elfart_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "elf_art";
  return {
    place:"精灵艺术学院",
    text:function(){
      const arr=[];
      arr.push("【精灵艺术学院】");
      arr.push("");
      arr.push("音乐、绘画、诗歌——这是艺术学院的日常。");
      arr.push("");
      arr.push("你可以去上课、去创作、找教授请教，或者——听那首「禁曲」。");
      return arr;
    },
    options:[
      {t:"去上课", go:"fc_jiaohui_entry", effect:{knowledge:1, san:3, timeCost:"1period"}},
      {t:"去创作", go:"fc_jiaohui_entry", effect:{san:5, reputation:5, timeCost:"1period"}},
      {t:"听禁曲", go:"fc_jiaohui_entry", effect:{check:"SPR", tier:{
        crit:{t:"你听到了那首禁曲——你看到了未来。不是清晰的画面，是碎片：战争、深渊、七印破碎、还有……你的脸。你赶紧停止了聆听，但你已经看到了太多。", effect:{knowledge:2, san:-20, flag:"forbidden_song_heard"}},
        ok:{t:"你听到了一些旋律，但没有看到未来。", effect:{san:-5}},
        fail:{t:"你什么都没听到。", effect:{san:-1}},
        critfail:{t:"禁曲的力量太强了！你晕倒了，醒来时什么都不记得——但你感觉，有什么东西改变了。", effect:{san:-15, hp:-10}}
      }}, timeCost:"1period"},
      {t:"返回大陆", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_village_hub"] = function(){
  initAcademyV28();
  S.academy.currentAcademy = "village_school";
  return {
    place:"乡村学院",
    text:function(){
      const arr=[];
      arr.push("【乡村学院】");
      arr.push("");
      arr.push("没有高大的校门，没有精良的设备，只有一个老师和几个学生。");
      arr.push("");
      arr.push("条件很差——但你的老师，可能不简单。");
      arr.push("");
      arr.push("你可以选择学习方向：私塾/教堂学堂/铁匠学徒/萨满传承/草药师学徒/游学者。");
      arr.push("");
      plantForeshadowV27('origin_clue');
      plantForeshadowV27('karma_seed');
      arr.push("（出身决定起点，但不决定终点。乡村学院的天才，也可能一鸣惊人。）");
      return arr;
    },
    options:[
      {t:"私塾（老秀才）", go:"academy_village_private", effect:{flag:"village_private"}},
      {t:"教堂学堂（老牧师）", go:"academy_village_church", effect:{flag:"village_church"}},
      {t:"铁匠学徒（老铁匠）", go:"academy_village_blacksmith", effect:{flag:"village_blacksmith"}},
      {t:"萨满传承（老萨满）", go:"academy_village_shaman", effect:{flag:"village_shaman"}},
      {t:"草药师学徒（老草药师）", go:"academy_village_herbalist", effect:{flag:"village_herbalist"}},
      {t:"游学者（来自远方）", go:"academy_village_scholar", effect:{flag:"village_scholar"}}
    ]
  };
};


  nodes["academy_village_private"] = function(){
  return {
    place:"私塾",
    text:function(){
      const arr=[];
      arr.push("老秀才的私塾很简陋——一间茅屋，几张桌椅，一个书柜。");
      arr.push("");
      arr.push("老秀才教你读书、写字、作诗。但你注意到——他的书柜里，有一些「不该出现在乡村」的书。");
      arr.push("");
      arr.push("那些书的封面很古老，上面的文字你看不懂。");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      arr.push("（老秀才可能不是普通的秀才。他的过去，是一个谜。）");
      return arr;
    },
    options:[
      {t:"认真读书", go:"fc_jiaohui_entry", effect:{knowledge:2, timeCost:"1period"}},
      {t:"询问老秀才的过去", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"老秀才沉默了很久，然后说：「我曾经在朝廷做官。后来……我看到了不该看的东西，就逃到了这里。」他给了你一本古代文献——上面记载着七印的真相。", effect:{knowledge:3, flag:"village_scholar_secret", item:"ancient_document", san:-5}},
        ok:{t:"老秀才说：「过去的事，不提了。」但他给了你一些书。", effect:{knowledge:1}},
        fail:{t:"老秀才不愿意说。", effect:{knowledge:0}},
        critfail:{t:"老秀才生气了：「小孩子问那么多做什么！」你被赶了出来。", effect:{reputation:-5}}
      }}, timeCost:"1period"},
      {t:"偷偷看书柜里的古书", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"你找到了一本黄林晶的笔记——上面记载着七印的建造过程和原初之物的真相。你读了一部分，世界观被颠覆了。", effect:{knowledge:3, san:-10, flag:"village_hlj_notes"}},
        ok:{t:"你找到了一些古代文献，但看不懂。", effect:{knowledge:1}},
        fail:{t:"书柜锁着，你打不开。", effect:{knowledge:0}},
        critfail:{t:"你被老秀才抓住了！「别碰那些书！」他很生气。", effect:{reputation:-10}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_church"] = function(){
  return {
    place:"教堂学堂",
    text:function(){
      const arr=[];
      arr.push("老牧师的教堂很小——只能容纳十几个人。");
      arr.push("");
      arr.push("老牧师教你神学、读书、写字。但你注意到——他在祷告的时候，有时候会说一些「不该说的话」。");
      arr.push("");
      arr.push("他提到「净化令的代价」，提到「教会的黑暗」，提到「那些被冤枉的人」。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（老牧师可能是教会的改革派——或者，他是暗蚀会的外围成员。）");
      return arr;
    },
    options:[
      {t:"认真学习神学", go:"fc_jiaohui_entry", effect:{knowledge:1, san:3, timeCost:"1period"}},
      {t:"询问净化令的真相", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"老牧师看了你很久，然后说：「净化令……是教会的罪。他们以神的名义，杀害了无数无辜的人。」他告诉你一些教会的秘密，还给了你一份内部档案。", effect:{knowledge:3, flag:"village_church_secret", san:-8}},
        ok:{t:"老牧师说：「净化令……有些地方是对的，有些地方是错的。」他没有多说。", effect:{knowledge:1}},
        fail:{t:"老牧师不愿意说。", effect:{knowledge:0}},
        critfail:{t:"老牧师生气了：「小孩子不要问政治！」你被赶了出来。", effect:{reputation:-5}}
      }}, timeCost:"1period"},
      {t:"探索教堂地下室", go:"fc_jiaohui_entry", effect:{check:"AGI", tier:{
        crit:{t:"你在教堂地下室找到了一些教会的内部档案——关于净化令的真相，关于那些被「误判」的人。你还找到了一封暗蚀会的信——老牧师和他们有联系。", effect:{knowledge:3, flag:"village_church_basement", san:-10}},
        ok:{t:"你找到了一些旧文件，但看不懂。", effect:{knowledge:1}},
        fail:{t:"地下室锁着。", effect:{knowledge:0}},
        critfail:{t:"你被老牧师抓住了！「别下去！」他很紧张。", effect:{reputation:-10, san:-3}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_blacksmith"] = function(){
  return {
    place:"铁匠铺",
    text:function(){
      const arr=[];
      arr.push("老铁匠的铺子很热闹——炉火通明，铁锤声声。");
      arr.push("");
      arr.push("老铁匠教你锻造、修理、制作工具。但你注意到——他锻造的技术，不是普通的乡村铁匠能有的。");
      arr.push("");
      arr.push("他能在武器上刻入符文——那是矮人符文锻造术。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（老铁匠可能是隐退的锻造大师——或者，他有矮人血统。）");
      return arr;
    },
    options:[
      {t:"认真学锻造", go:"fc_jiaohui_entry", effect:{exp:10, timeCost:"1period"}},
      {t:"学习符文锻造", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"老铁匠很惊讶：「你有符文的天赋！」他教了你一些基础的符文锻造术，还告诉你——他曾经是矮人铁峰堡的大师傅。", effect:{knowledge:2, flag:"village_rune_master", item:"rune_hammer"}},
        ok:{t:"你学了一些基础的符文锻造。", effect:{knowledge:1}},
        fail:{t:"你学不会。", effect:{knowledge:0}},
        critfail:{t:"符文失控了！你受了点伤。", effect:{hp:-10}}
      }}, timeCost:"1period"},
      {t:"询问老铁匠的过去", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"老铁匠沉默了很久，然后说：「我曾经是铁峰堡的大师傅。后来……我发现了永恒熔炉的秘密，就逃了出来。」他告诉你一些关于第四印的事。", effect:{knowledge:3, flag:"village_blacksmith_secret", san:-5}},
        ok:{t:"老铁匠说：「过去的事，不提了。」", effect:{knowledge:0}},
        fail:{t:"老铁匠不愿意说。", effect:{knowledge:0}},
        critfail:{t:"老铁匠生气了：「小孩子问那么多做什么！」", effect:{reputation:-5}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_shaman"] = function(){
  return {
    place:"萨满帐篷",
    text:function(){
      const arr=[];
      arr.push("老萨满的帐篷在村子边缘——里面挂满了骨头、羽毛和图腾。");
      arr.push("");
      arr.push("老萨满教你草药、仪式、和「灵」沟通。但你注意到——他有时候会和「看不见的东西」说话。");
      arr.push("");
      arr.push("他说那是「祖先的灵」。但你感觉——那不是祖先。");
      arr.push("");
      plantForeshadowV27('primordial_whisper');
      plantForeshadowV27('seal_omen');
      arr.push("（老萨满可能和原初之物有联系——他知道第二印的秘密。）");
      return arr;
    },
    options:[
      {t:"认真学萨满术", go:"fc_jiaohui_entry", effect:{knowledge:1, san:3, timeCost:"1period"}},
      {t:"尝试和「灵」沟通", go:"fc_jiaohui_entry", effect:{check:"SPR", tier:{
        crit:{t:"你进入了冥想——你感受到了。不是祖先的灵，是更古老、更强大的存在。原初之物「愤怒」。它在燃烧，永远在燃烧。老萨满赶紧把你拉了回来。「你还太年轻，不能接触那个。」", effect:{knowledge:3, flag:"village_shaman_contact", san:-15}},
        ok:{t:"你感受到了一些模糊的存在。", effect:{knowledge:1, san:-3}},
        fail:{t:"你什么都没感受到。", effect:{san:2}},
        critfail:{t:"你被什么东西「触碰」了——不是恶意，但很古老，很强大。你吓坏了。", effect:{san:-10}}
      }}, timeCost:"1period"},
      {t:"询问第二印的秘密", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"老萨满看了你很久，然后说：「第二印……在草原深处。它封印着「愤怒」——一个永远在燃烧的战士。我们萨满，世代监视着它。」他告诉你一些关于第二印的事。", effect:{knowledge:3, flag:"village_shaman_secret", san:-8}},
        ok:{t:"老萨满说：「有些事情，你以后会知道的。」", effect:{knowledge:1}},
        fail:{t:"老萨满不愿意说。", effect:{knowledge:0}},
        critfail:{t:"老萨满生气了：「有些知识会杀了你！」", effect:{san:-5}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_herbalist"] = function(){
  return {
    place:"草药师小屋",
    text:function(){
      const arr=[];
      arr.push("老草药师的小屋充满了草药的香味。");
      arr.push("");
      arr.push("老草药师教你认草药、制药、治病。但你注意到——她的有些「草药」，不是普通的草药。");
      arr.push("");
      arr.push("那些草药能影响人的灵魂——能让人看到亡者，能让人遗忘记忆，能让人……听到别的声音。");
      arr.push("");
      plantForeshadowV27('origin_clue');
      arr.push("（老草药师可能是隐退的灵魂法师——她知道灵魂魔法的秘密。）");
      return arr;
    },
    options:[
      {t:"认真学草药", go:"fc_jiaohui_entry", effect:{knowledge:1, san:2, timeCost:"1period"}},
      {t:"学习灵魂草药", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"老草药师很惊讶：「你有灵魂魔法的天赋！」她教了你一些基础的灵魂草药术，还告诉你——她曾经是艾尔达学院的灵魂魔法教授。", effect:{knowledge:2, flag:"village_soul_mage", item:"soul_herb_book"}},
        ok:{t:"你学了一些基础的灵魂草药。", effect:{knowledge:1}},
        fail:{t:"你学不会。", effect:{knowledge:0}},
        critfail:{t:"灵魂草药的副作用太强了！你产生了幻觉。", effect:{san:-10}}
      }}, timeCost:"1period"},
      {t:"询问老草药师的过去", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"老草药师沉默了很久，然后说：「我曾经是艾尔达学院的灵魂魔法教授。后来……我发现了灵魂魔法的代价，就逃到了这里。」她告诉你一些关于灵魂魔法和塞拉芬的事。", effect:{knowledge:3, flag:"village_herbalist_secret", san:-8}},
        ok:{t:"老草药师说：「过去的事，不提了。」", effect:{knowledge:0}},
        fail:{t:"老草药师不愿意说。", effect:{knowledge:0}},
        critfail:{t:"老草药师生气了：「小孩子不要问这些！」", effect:{reputation:-5}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_scholar"] = function(){
  return {
    place:"游学者营地",
    text:function(){
      const arr=[];
      arr.push("游学者的营地在村外的大树下——他是一个来自远方的旅人。");
      arr.push("");
      arr.push("游学者教你大陆的地理、历史、传说。但你注意到——他知道一些「不该知道的事」。");
      arr.push("");
      arr.push("他知道七印的位置，知道原初之物的名字，知道……你的未来。");
      arr.push("");
      plantForeshadowV27('origin_clue');
      plantForeshadowV27('watcher_spy');
      arr.push("（游学者可能是守望者——或者，他来自更远的地方。）");
      return arr;
    },
    options:[
      {t:"认真学地理历史", go:"fc_jiaohui_entry", effect:{knowledge:2, timeCost:"1period"}},
      {t:"询问七印的秘密", go:"fc_jiaohui_entry", effect:{check:"INT", tier:{
        crit:{t:"游学者看了你很久，然后说：「七印……不是封印深渊，是喂养原初之物。黄林晶建造七印，是为了让它们沉睡——但这不是长久之计。」他告诉了你七印的完整真相。", effect:{knowledge:3, flag:"village_scholar_seal_truth", san:-10}},
        ok:{t:"游学者告诉了你一些七印的知识。", effect:{knowledge:1}},
        fail:{t:"游学者不愿意说。", effect:{knowledge:0}},
        critfail:{t:"游学者生气了：「有些知识，你还没准备好接受。」", effect:{san:-5}}
      }}, timeCost:"1period"},
      {t:"询问游学者的来历", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"游学者笑了：「我来自……很远的地方。比你想象的更远。」他给了你一张古代地图——上面标记着七印的位置和一些隐藏的道路。", effect:{knowledge:2, flag:"village_scholar_origin", item:"ancient_map_full"}},
        ok:{t:"游学者说：「我只是一个旅人。」", effect:{knowledge:0}},
        fail:{t:"游学者不愿意说。", effect:{knowledge:0}},
        critfail:{t:"游学者的眼神变了：「你问太多了。」他突然消失了——只留下一张地图。", effect:{san:-8, item:"mysterious_map"}}
      }}, timeCost:"1period"}
    ]
  };
};


  nodes["academy_village_graduation"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  S.graduation.destination = "village_to_top";
  return {
    place:"乡村学院·毕业",
    text:function(){
      const arr=[];
      arr.push("【乡村学院·毕业】");
      arr.push("");
      arr.push("你的老师看着你，眼神很复杂。");
      arr.push("");
      arr.push("「你是个有天赋的孩子。」他/她说，「乡村太小了，你应该去更大的地方。」");
      arr.push("");
      arr.push("他/她给了你一封推荐信——你可以用它进入大陆的顶尖学院。");
      arr.push("");
      arr.push("出身决定起点，但不决定终点。你从乡村出发，走向了更广阔的世界。");
      return arr;
    },
    options:[
      {t:"带着推荐信去艾尔达大陆学院", go:"academy_admission_elda", effect:{flag:"village_to_elda", item:"recommendation_letter"}},
      {t:"带着推荐信去圣光神学院", go:"academy_admission_holy", effect:{flag:"village_to_holy", item:"recommendation_letter"}},
      {t:"带着推荐信去帝国军事学院", go:"academy_admission_military", effect:{flag:"village_to_military", item:"recommendation_letter"}},
      {t:"留在乡村（隐藏路线）", go:"fc_jiaohui_entry", effect:{flag:"village_stay", knowledge:1}}
    ]
  };
};


  nodes["academy_foreshadow_review"] = function(){
  initAcademyV28();
  return {
    place:"学院伏笔回顾",
    text:function(){
      const arr=[];
      arr.push("【你在学院发现的秘密】");
      arr.push("");
      let count = 0;
      for(const key in ACADEMY_FORESHADOWING_V28){
        const f = ACADEMY_FORESHADOWING_V28[key];
        if(S.flags && S.flags["foreshadow_"+key]){
          count++;
          arr.push("【" + f.name + "】");
          arr.push(f.desc);
          arr.push("（回收时机：" + f.harvest + "）");
          arr.push("");
        }
      }
      if(count === 0){
        arr.push("你还没有发现学院的秘密。继续探索吧——每所学院都有不为人知的一面。");
      } else {
        arr.push("你已经发现了 " + count + " 个秘密。它们将在大陆章和终局中回收。");
      }
      arr.push("你在学院里发现的秘密，此刻像散落的线头，被一张看不见的网串在一起。");arr.push("");arr.push("禁书区的铁链、失踪学生的告示、墨丘利教授书柜后的暗门、地下遗迹的回廊——你把这些线索在脑中过了一遍。");arr.push("");arr.push("有些线头还悬着，有些已经连上了。你隐约觉得，这些秘密的线头，正指向一个你还没看清的方向。");arr.push("");return arr;
    },
    options:[
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_graduation_season"] = function(){
  initAcademyV28();
  return {
    place:"毕业季",
    text:function(){
      const arr=[];
      arr.push("【毕业季】");
      arr.push("");
      arr.push("五年的学院生活即将结束。");
      arr.push("");
      arr.push("校园里弥漫着一种复杂的气氛——有兴奋，有不舍，有对未来的期待，也有对过去的怀念。");
      arr.push("");
      arr.push("你需要做几件事：");
      arr.push("1. 参加最终考试/答辩");
      arr.push("2. 和同学们告别");
      arr.push("3. 选择你的毕业去向");
      arr.push("4. 准备出发");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      plantForeshadowV27('karma_seed');
      arr.push("（你的同学们也在选择他们的未来。你们将在大陆上重逢——也许是盟友，也许是敌人。）");
      return arr;
    },
    options:[
      {t:"参加最终考试", go:"academy_final_exam", effect:{timeCost:"1period"}},
      {t:"和同学们告别", go:"academy_graduation_farewell", effect:{timeCost:"1period"}},
      {t:"选择毕业去向", go:"academy_graduation_choice", effect:{timeCost:"1period"}},
      {t:"查看学院伏笔回顾", go:"academy_foreshadow_review", effect:{}}
    ]
  };
};


  nodes["academy_final_exam"] = function(){
  return {
    place:"最终考试",
    text:function(){
      const arr=[];
      arr.push("最终考试开始了。");
      arr.push("");
      arr.push("这是你五年学院生活的总结——笔试、实战、答辩。");
      arr.push("");
      arr.push("教授们在观察你的每一个表现。你的成绩将决定你的毕业评级和去向。");
      return arr;
    },
    options:[
      {t:"全力考试", go:"academy_graduation_season", effect:{check:"INT", tier:{
        crit:{t:"你以第一名的成绩通过了最终考试！院长亲自表扬了你。你获得了「优秀毕业生」称号，所有势力都向你伸出了橄榄枝。", effect:{flag:"top_graduate", reputation:30, gold:100}},
        ok:{t:"你以良好的成绩通过了最终考试。获得了「良好毕业生」称号，有几个势力向你发出了邀请。", effect:{flag:"good_graduate", reputation:15, gold:30}},
        fail:{t:"你勉强通过了最终考试。获得了「合格毕业生」称号，选择不多。", effect:{flag:"pass_graduate", reputation:5}},
        critfail:{t:"你没有通过最终考试！你需要补考——或者，选择不毕业，直接离开学院。", effect:{flag:"failed_graduate", reputation:-10, san:-5}}
      }}, timeCost:"1period"},
      {t:"故意考砸（隐藏路线）", go:"academy_graduation_season", effect:{flag:"failed_on_purpose", reputation:-5, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_graduation_farewell"] = function(){
  return {
    place:"毕业告别",
    text:function(){
      const arr=[];
      arr.push("你在校园里走着，和同学们一一道别。");
      arr.push("");
      arr.push("有些人你以后还会见到——有些人，也许永远不会了。");
      arr.push("");
      arr.push("你在学院的这五年，有过欢笑，有过泪水，有过秘密，有过遗憾。");
      arr.push("");
      arr.push("但现在，是时候说再见了。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      arr.push("（每个同学都有自己的未来。他们的选择，将在大陆章中与你交汇。）");
      return arr;
    },
    options:[
      {t:"和最好的朋友告别", go:"academy_graduation_season", effect:{relation:"best_friend:+20", san:3, timeCost:"1period"}},
      {t:"和有矛盾的同学和解", go:"academy_graduation_season", effect:{relation:"rival:+15", san:5, timeCost:"1period"}},
      {t:"和喜欢的人表白", go:"academy_graduation_season", effect:{check:"CHA", tier:{
        crit:{t:"你表白了——对方也喜欢你！你们决定一起面对未来。", effect:{flag:"romance_confirmed", relation:"love:+30", san:10}},
        ok:{t:"你表白了——对方说需要时间考虑。但你们保持了联系。", effect:{relation:"love:+15", san:3}},
        fail:{t:"你表白了——对方拒绝了。但你们还是朋友。", effect:{san:-5, relation:"love:+5"}},
        critfail:{t:"你表白了——对方已经有喜欢的人了。你很尴尬，但还是祝对方幸福。", effect:{san:-10, reputation:-3}}
      }}, timeCost:"1period"},
      {t:"默默离开（不告别）", go:"academy_graduation_season", effect:{san:-3, flag:"quiet_leave", timeCost:"1period"}}
    ]
  };
};

;


  nodes["academy_graduation_final"] = function(){
  initAcademyV28();
  S.graduation.graduated = true;
  return {
    place:"毕业·出发",
    text:function(){
      const arr=[];
      arr.push("【毕业·出发】");
      arr.push("");
      arr.push("你站在学院的大门前，最后看了一眼这个你生活了五年的地方。");
      arr.push("");
      arr.push("阳光照在你的脸上，风带着远方的气息。");
      arr.push("");
      arr.push("你的学院生活结束了——但你的大陆冒险，才刚刚开始。");
      arr.push("");
      arr.push("你转身，走向了远方。");
      arr.push("");
      arr.push("（大陆章开始。你在学院的所有选择、所有秘密、所有人际关系，都将在大陆上产生后果。）");
      arr.push("五年，一千八百多个日夜，在这一步里被压缩成一瞬。你站在学院大门前，脚下是磨得光滑的石阶——你第一天来时，就在这里绊了一跤。");arr.push("");arr.push("回头看，钟楼上的指针正指向九点。西奥多院长站在窗边，隔着玻璃朝你点了点头。你没有看清他是不是在笑。");arr.push("");arr.push("阳光很亮，照得石阶发白。风从远处来，带着大陆的气息——自由城邦的面包香、铁门关的铁锈味、草原的青草气，它们混在一起，向你招手。你握紧了行囊的带子，迈出第一步。");arr.push("");return arr;
    },
    options:[
      {t:"前往目的地（大陆章开始）", go:"fc_jiaohui_entry", effect:{flag:"continent_start", reputation:5}}
    ]
  };
};


  nodes["academy_graduation_journey"] = function(){
  return {
    place:"毕业旅程",
    text:function(){
      const arr=[];
      arr.push("【毕业旅程】");
      arr.push("");
      arr.push("你离开了学院，踏上了前往大陆的旅程。");
      arr.push("");
      arr.push("这是你第一次真正以「成年人」的身份面对这个世界。");
      arr.push("");
      arr.push("路上有风景，有遭遇，有回忆，也有新的开始。");
      arr.push("毕业典礼散场时，天正黄昏。你手里攥着毕业文书，纸卷被礼堂的烛火烤得微热。西奥多院长在台上讲的话已经散在风里，只剩一句还响在耳边：“出校门后，没人再替你兜底。”");arr.push("");arr.push("你站在学院大门外，第一次以“成年人”的身份打量这条通往大陆的路。路边的野草齐腰高，风一吹，哗啦啦往一个方向倒——那方向，正是自由城邦。");arr.push("");arr.push("你低头看了看自己的影子，被夕阳拉得很长。你知道，从这一刻起，脚下的每一步，都要自己负责了。");arr.push("");return arr;
    },
    options:[
      {t:"和同学一起出发", go:"academy_journey_with_classmates", effect:{timeCost:"5days"}},
      {t:"独自出发", go:"academy_journey_solo", effect:{timeCost:"3days"}},
      {t:"坐商队出发", go:"academy_journey_caravan", effect:{timeCost:"5days"}},
      {t:"被势力护送出发", go:"academy_journey_escorted", effect:{timeCost:"4days"}}
    ]
  };
};


  nodes["academy_journey_with_classmates"] = function(){
  return {
    place:"旅程·和同学一起",
    text:function(){
      const arr=[];
      arr.push("你和几个同学一起出发了。");
      arr.push("");
      arr.push("路上，你们聊起了学院的往事——那些好笑的、难过的、秘密的事。");
      arr.push("");
      arr.push("晚上，你们围坐在篝火旁，喝着酒，唱着歌。");
      arr.push("");
      arr.push("「以后我们还会再见吗？」一个同学问。");
      arr.push("");
      arr.push("「会的。」你说。");
      arr.push("");
      arr.push("但你不知道——你们下次见面，可能是在战场上。");
      arr.push("出发那天早晨，你们在校门口碰头。耗子背了个快有他人高的包袱，被众人笑了一路；塞西莉亚则只带了一只小皮箱，说“本事在脑子里，不在行李里”。");arr.push("");arr.push("晚上扎营，你们围着篝火分吃一条烤鱼。鱼是亚瑟在河里摸的，他卷起裤腿站了半个时辰，上来时冻得直哆嗦，却把鱼先递给你。");arr.push("");arr.push("酒是耗子从他爹铺子里偷来的，度数不高，喝下去暖洋洋的。有人唱起学院的歌，跑调跑得厉害，可谁也没笑话。火光映在每个人脸上，连平时最沉默的亚瑟，嘴角都松了。");arr.push("");return arr;
    },
    options:[
      {t:"继续旅程", go:"fc_jiaohui_entry", effect:{relation:"classmates:+15", san:5, flag:"journey_with_classmates"}}
    ]
  };
};


  nodes["academy_journey_solo"] = function(){
  return {
    place:"旅程·独自",
    text:function(){
      const arr=[];
      arr.push("你独自出发了。");
      arr.push("");
      arr.push("路上很安静——只有风声、脚步声，和你自己的思绪。");
      arr.push("");
      arr.push("你回想着学院的五年——那些选择，那些秘密，那些人。");
      arr.push("");
      arr.push("你不知道前方等待你的是什么——但你知道，你已经准备好了。");
      arr.push("路是土路，被前几日的雨泡软了，脚印一个叠一个。你独自走在上面，只有自己的影子陪着。风从田埂上滚过来，带起一阵土腥气，又滚向更远的地方。");arr.push("");arr.push("日头偏西的时候，你在路边一棵歪脖子树下歇脚，掏出干粮啃。干粮是昨晚食堂大妈塞给你的，还带着葱油味。你忽然想起她每次多给你打一勺菜的样子，鼻子有点酸。");arr.push("");arr.push("你把这些念头咽下去，继续赶路。天边的云烧成一片，路还长。");arr.push("");return arr;
    },
    options:[
      {t:"继续旅程", go:"fc_jiaohui_entry", effect:{san:3, flag:"journey_solo"}}
    ]
  };
};


  nodes["academy_journey_caravan"] = function(){
  return {
    place:"旅程·商队",
    text:function(){
      const arr=[];
      arr.push("你加入了一个商队。");
      arr.push("");
      arr.push("商队里有各种各样的人——商人、护卫、旅人、还有一些神秘的乘客。");
      arr.push("");
      arr.push("路上，你听到了很多大陆的新闻——战争、净化令、深渊的征兆。");
      arr.push("");
      arr.push("你还遇到了一些有趣的人——也许他们会在未来与你再次相遇。");
      arr.push("商队走得慢，车辙在土路上压出深深的两道。你坐在粮袋上，听着车轮吱呀，看赶车的老把式甩着鞭子，嘴里哼着不知名的调子。");arr.push("");arr.push("傍晚扎营，商人们升起篝火，架起铁锅煮肉汤。一个戴皮帽的护卫递给你一碗：“新来的？喝了暖和。”汤很咸，飘着几片干菜，可你喝得浑身发热。");arr.push("");arr.push("夜里你裹着毯子躺在车底，听见护卫们低声说话：“北边又不太平了。”“净化令那事……别提。”你闭上眼，把那些话记在心里。");arr.push("");return arr;
    },
    options:[
      {t:"继续旅程", go:"fc_jiaohui_entry", effect:{knowledge:2, gold:10, flag:"journey_caravan"}}
    ]
  };
};


  nodes["academy_journey_escorted"] = function(){
  return {
    place:"旅程·被护送",
    text:function(){
      const arr=[];
      arr.push("你加入的势力派了人来护送你。");
      arr.push("");
      arr.push("一路上，他们告诉你一些势力内部的消息——关于大陆的局势，关于你的任务。");
      arr.push("");
      arr.push("你感觉——你已经不再是一个学生了。你是这个势力的一员。");
      arr.push("");
      arr.push("而这个身份，将给你带来机会，也带来危险。");
      arr.push("护送你的两名骑士骑术精熟，一路几乎不说话。他们把盾牌扣在鞍侧，铁靴踏在土路上，发出整齐的声响。你走在他们中间，感觉自己像一件要被移交的货物。");arr.push("");arr.push("第三天，年长的那名骑士终于开口。他指着远处山脊上的一道烽燧：“看见没有？点起来，就是北境全线告急。你既然要入伙，先把这片天认熟。”");arr.push("");arr.push("他教你在野外找水、看星、辨方向，也告诉你哪个渡口商人可信、哪个关卡的税吏吃回扣。你把这些话一一记下——它们比课本上写的有用得多。");arr.push("");return arr;
    },
    options:[
      {t:"继续旅程", go:"fc_jiaohui_entry", effect:{reputation:10, knowledge:1, flag:"journey_escorted"}}
    ]
  };
};


  nodes["academy_inter_event_hub"] = function(){
  initAcademyV28();
  return {
    place:"校际活动",
    text:function(){
      const arr=[];
      arr.push("【校际活动】");
      arr.push("");
      arr.push("大陆的学院之间有很多互动——比赛、辩论、艺术节、联合研究。");
      arr.push("");
      arr.push("参加校际活动可以获得声望、道具、人脉，还能了解其他学院的秘密。");
      arr.push("");
      arr.push("（校际活动是收集跨学院伏笔的好机会。）");
      return arr;
    },
    options:[
      {t:"参加大陆魔法大赛", go:"academy_magic_tournament", effect:{timeCost:"3days"}},
      {t:"参加大陆武道大会", go:"academy_combat_tournament", effect:{timeCost:"3days"}},
      {t:"参加学术辩论会", go:"academy_debate", effect:{timeCost:"2days"}},
      {t:"参加联合研究项目", go:"academy_joint_research", effect:{timeCost:"7days"}},
      {t:"申请交换生", go:"academy_exchange_apply", effect:{timeCost:"1period"}},
      {t:"申请转校", go:"academy_transfer_apply", effect:{timeCost:"1period"}},
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_magic_tournament"] = function(){
  return {
    place:"大陆魔法大赛",
    text:function(){
      const arr=[];
      arr.push("【大陆魔法大赛】");
      arr.push("");
      arr.push("交汇城的竞技场座无虚席。各学院的魔法选手都在摩拳擦掌。");
      arr.push("");
      arr.push("你的对手来自不同学院——圣光神学院的神圣魔法、帝国军事学院的战斗魔法、精灵银叶学院的自然魔法。");
      arr.push("");
      arr.push("这是你展示实力的机会——也是了解其他学院秘密的机会。");
      return arr;
    },
    options:[
      {t:"全力比赛", go:"academy_inter_event_hub", effect:{check:"INT", tier:{
        crit:{t:"你一路过关斩将，最终获得了冠军！全场欢呼。你还在比赛中发现了圣光神学院选手的「神圣魔法」有些不对劲——那不是神圣魔法，是别的什么。", effect:{reputation:30, gold:100, flag:"magic_champion", knowledge:2}},
        ok:{t:"你进入了半决赛，但最终输给了精灵选手。不过你表现不错，获得了一些声望。", effect:{reputation:15, gold:30}},
        fail:{t:"你在第一轮就输了。对手的魔法太强了。", effect:{reputation:-5, san:-3}},
        critfail:{t:"你的魔法在比赛中失控了！差点伤到观众。你被取消了资格，还成了笑柄。", effect:{reputation:-20, san:-10}}
      }}, timeCost:"1period"},
      {t:"观察其他学院选手", go:"academy_inter_event_hub", effect:{knowledge:2, timeCost:"1period"}},
      {t:"和其他学院选手交流", go:"academy_inter_event_hub", effect:{relation:"other_academy:+10", knowledge:1, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_combat_tournament"] = function(){
  return {
    place:"大陆武道大会",
    text:function(){
      const arr=[];
      arr.push("【大陆武道大会】");
      arr.push("");
      arr.push("承天山的竞技场充满了肃杀的气氛。这是实战——没有规则，只有胜负。");
      arr.push("");
      arr.push("你的对手来自帝国军事学院、兽人战神学院、北方战士学院——都是真正的战士。");
      arr.push("竞技场的沙地踩上去是软的，可你知道，那下面是夯实了千年的土。");arr.push("看台上的呼声像浪一样，一阵接一阵。你站在场中，对面是帝国军事学院的选手——他比你高半个头，铠甲擦得锃亮，眼神像两把出鞘的刀。");arr.push("裁判宣布开始的那一瞬，世界忽然安静下来。你只能听见自己的心跳，还有对方靴子碾过沙地的声音。");arr.push("你们交手了。拳脚、格挡、闪避，每一次接触都实打实。你能感觉到，这个对手的每一击里都带着学院教出来的骄傲。你也在用你的方式回应——用你在出身地学到的、那些教科书上没有的东西。");arr.push("当裁判举起你的手时，看台上爆发出海啸一样的呼声。你站在原地，喘着气，看着对面那个选手——他朝你伸出了手。");arr.push("你握住他的手。他低声说：「好身手。毕业了，来帝国军，我给你留位置。」");arr.push("你笑了笑，没有回答。你知道，这句话，也许是你今天赢得的最重要的东西。");return arr;
    } /*v45inj:academy_combat_tournament*/,
    options:[
      {t:"全力比赛", go:"academy_inter_event_hub", effect:{check:"STR", tier:{
        crit:{t:"你击败了所有对手，获得了冠军！兽人战士向你致敬，军事学院的将军向你伸出了橄榄枝。", effect:{reputation:30, gold:80, flag:"combat_champion", item:"champion_weapon"}},
        ok:{t:"你进入了半决赛，但输给了兽人选手。不过你表现不错。", effect:{reputation:15, gold:20}},
        fail:{t:"你在第一轮就输了。对手的战斗力太强了。", effect:{reputation:-5, hp:-10}},
        critfail:{t:"你在比赛中受了重伤！被抬下了场。", effect:{hp:-30, reputation:-10, san:-5}}
      }}, timeCost:"1period"},
      {t:"观察其他学院选手", go:"academy_inter_event_hub", effect:{knowledge:1, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_debate"] = function(){
  return {
    place:"学术辩论会",
    text:function(){
      const arr=[];
      arr.push("【大陆学术辩论会】");
      arr.push("");
      arr.push("圣城的大礼堂里，各学院的学者和学生在辩论大陆的重大问题。");
      arr.push("");
      arr.push("今天的辩题是：「净化令是否合理？」");
      arr.push("");
      arr.push("教会的学者主张净化令是必要的，艾尔达和精灵的学者主张净化令需要改革。");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      arr.push("（你注意到——暗蚀会的人也在听众中。他们在收集信息。）");
      arr.push("辩论厅的穹顶很高，回声很大。");arr.push("你站在讲台一侧，对面是圣光神学院的辩手——一个口才极好的女生，她引经据典，把每一个论点都钉得死死的，像在钉棺材。");arr.push("轮到你发言的时候，厅里安静下来。你握着讲台边缘，感觉到木头的纹理，粗糙而真实。");arr.push("你没有用她那种滴水不漏的方式。你只是讲了一个故事——你在出身地见过的、一个被所谓「真理」碾过的普通人。");arr.push("你讲完的时候，厅里静得能听见灯花爆开的声音。然后，掌声从后排响起，先是零星，最后连成一片。");arr.push("走下讲台时，那个女生拦住你，眼神复杂：「你赢了。可你用的不是辩论。」她顿了顿，「你用的是……真东西。」");arr.push("你点了点头。你知道，这比赢一场辩论，重要得多。");return arr;
    } /*v45inj:academy_debate*/,
    options:[
      {t:"发言支持改革", go:"academy_inter_event_hub", effect:{check:"CHA", tier:{
        crit:{t:"你的发言精彩绝伦！全场掌声雷动。教会的学者脸色铁青，但很多人开始思考净化令的合理性。你获得了巨大的声望。", effect:{reputation:25, flag:"debate_reform", relation:"reformers:+20"}},
        ok:{t:"你的发言得到了一些认可。", effect:{reputation:10}},
        fail:{t:"你的发言被教会学者驳倒了。", effect:{reputation:-3}},
        critfail:{t:"你的发言被教会视为「异端言论」！你被标记了。", effect:{reputation:-15, flag:"church_marked", san:-5}}
      }}, timeCost:"1period"},
      {t:"发言支持净化令", go:"academy_inter_event_hub", effect:{reputation:10, relation:"church:+15", timeCost:"1period"}},
      {t:"旁听", go:"academy_inter_event_hub", effect:{knowledge:2, timeCost:"1period"}}
    ]
  };
};


  nodes["academy_joint_research"] = function(){
  return {
    place:"联合研究项目",
    text:function(){
      const arr=[];
      arr.push("【联合研究项目】");
      arr.push("");
      arr.push("多所学院联合进行的研究项目——通常涉及七印、古代史、禁忌知识。");
      arr.push("");
      arr.push("你可以申请加入——这是接触核心秘密的好机会。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（当前的联合研究项目是：「七印的历史与现状」。参与的学院有艾尔达、精灵、矮人。）");
      return arr;
    },
    options:[
      {t:"申请加入研究", go:"academy_inter_event_hub", effect:{check:"INT", tier:{
        crit:{t:"你被接受加入了研究项目！你接触到了七印的核心资料——包括一些从未公开的信息。", effect:{knowledge:3, flag:"joint_research_member", san:-5}},
        ok:{t:"你被接受为研究助理。可以接触一些资料。", effect:{knowledge:1, flag:"joint_research_assistant"}},
        fail:{t:"你的申请被拒绝了。", effect:{knowledge:0}},
        critfail:{t:"你的申请被拒绝了——而且他们开始怀疑你的动机。", effect:{reputation:-5, flag:"research_suspected"}}
      }}, timeCost:"7days"},
      {t:"返回", go:"academy_inter_event_hub", effect:{}}
    ]
  };
};


  nodes["academy_exchange_apply"] = function(){
  return {
    place:"交换生申请",
    text:function(){
      const arr=[];
      arr.push("【交换生项目】");
      arr.push("");
      arr.push("你可以申请作为交换生去其他学院学习1学期。");
      arr.push("");
      arr.push("交换生可以体验其他学院的课程、教授、同学、秘密——这是收集跨学院伏笔的好机会。");
      arr.push("");
      arr.push("但交换生也有代价——你会错过原学院的一些事件，关系可能会衰减。");
      return arr;
    },
    options:[
      {t:"申请去艾尔达大陆学院", go:"academy_exchange_elda", effect:{timeCost:"1period"}},
      {t:"申请去圣光神学院", go:"academy_exchange_holy", effect:{timeCost:"1period"}},
      {t:"申请去帝国军事学院", go:"academy_exchange_military", effect:{timeCost:"1period"}},
      {t:"申请去精灵银叶学院", go:"academy_exchange_elf", effect:{timeCost:"1period"}},
      {t:"申请去矮人铁峰学院", go:"academy_exchange_dwarf", effect:{timeCost:"1period"}},
      {t:"返回", go:"academy_inter_event_hub", effect:{}}
    ]
  };
};


  nodes["academy_exchange_elda"] = function(){
  return {
    place:"交换生·艾尔达",
    text:function(){
      const arr=[];
      arr.push("你申请去艾尔达大陆学院做交换生。");
      arr.push("");
      arr.push("艾尔达大陆学院是综合型学院——灵魂魔法和七印研究独步大陆。");
      arr.push("");
      arr.push("在这里，你可以接触到墨丘利教授、禁书区、地下遗迹——这些都是其他学院没有的。");
      arr.push("墨丘利教授亲手批了你的交换申请。他把回执递给你时，镜片后的眼睛很亮：“艾尔达大陆学院——灵魂魔法和七印研究，整个大陆没有第二家。”");arr.push("");arr.push("他顿了顿，声音低了些：“禁书区、地下遗迹，那些地方连本院学生都未必进得去。你要是真想去看看，记住——看到了什么，别乱说。”");arr.push("");arr.push("你接过回执，纸很轻，可你知道这张纸有多重。艾尔达学院的门，正在为你打开。");arr.push("");return arr;
    },
    options:[
      {t:"开始交换生生活", go:"academy_elda_hub", effect:{flag:"exchange_elda", timeCost:"1semester"}},
      {t:"返回", go:"academy_exchange_apply", effect:{}}
    ]
  };
};


  nodes["academy_exchange_holy"] = function(){
  return {
    place:"交换生·圣光",
    text:function(){
      const arr=[];
      arr.push("你申请去圣光神学院做交换生。");
      arr.push("");
      arr.push("圣光神学院是教会的核心——神圣魔法和神学的最高学府。");
      arr.push("");
      arr.push("在这里，你可以接触到教会的秘密——地下审讯室、圣物库、异端档案。");
      arr.push("");
      arr.push("但圣光神学院对灵魂魔法天赋者很警惕——你需要隐藏自己的天赋。");
      arr.push("圣光神学院的复函厚重得像一本经书，封面压着烫金的圣徽。信里没有多余的话，只有一段祷文，和一句：“愿圣光照亮你的路。”");arr.push("");arr.push("圣城在山上。你沿着石阶往上走，钟声一下一下，敲得人心头静下来。白袍的神学生列队走过，脚步很轻，像踩在云上。");arr.push("");arr.push("可你注意到，教堂的阴影里，有一扇从不打开的铁门。地下的审讯室、圣物库、异端档案——这座学院藏着的东西，比它展示的要多得多。");arr.push("");return arr;
    },
    options:[
      {t:"开始交换生生活", go:"academy_holy_hub", effect:{flag:"exchange_holy", timeCost:"1semester"}},
      {t:"返回", go:"academy_exchange_apply", effect:{}}
    ]
  };
};


  nodes["academy_exchange_military"] = function(){
  return {
    place:"交换生·军事",
    text:function(){
      const arr=[];
      arr.push("你申请去帝国军事学院做交换生。");
      arr.push("");
      arr.push("帝国军事学院是军方的核心——战斗和战略的最高学府。");
      arr.push("");
      arr.push("在这里，你可以接触到军事学院的秘密——秘密武器库、战略室、秘密实验场。");
      arr.push("交换批复得很快——帝国军事学院的公函像军令一样简洁，只有一行字：“准。报到时着便装，勿带私物。”");arr.push("");arr.push("报到那天，哨兵盘查了你三遍，连鞋底都要翻过来看。穿过三重铁门，你才看见军营的真容：操场上几百人列队，吼声震天，踏起的尘土遮了半边天。");arr.push("");arr.push("领你入营的军官拍拍你肩膀：“军事学院是军方的核心——秘密武器库、战略室、秘密实验场，都在里面。能不能摸到，看你本事。”");arr.push("");return arr;
    },
    options:[
      {t:"开始交换生生活", go:"academy_military_hub", effect:{flag:"exchange_military", timeCost:"1semester"}},
      {t:"返回", go:"academy_exchange_apply", effect:{}}
    ]
  };
};


  nodes["academy_exchange_elf"] = function(){
  return {
    place:"交换生·精灵",
    text:function(){
      const arr=[];
      arr.push("你申请去精灵银叶学院做交换生。");
      arr.push("");
      arr.push("精灵银叶学院建在世界树之上——自然魔法和古代史的圣地。");
      arr.push("");
      arr.push("在这里，你可以接触到第三印的入口、古代图书馆、星象塔。");
      arr.push("");
      arr.push("但精灵对人类很警惕——你需要证明自己的价值。");
      arr.push("精灵的复函用银线扎着，打开时散出一股草木香。信纸是薄薄的树皮做的，上面的字迹细得像蛛丝：“银叶学院欢迎你。来时请带一捧你家乡的土。”");arr.push("");arr.push("世界树——精灵们叫它‘母树’。银叶学院就建在它的枝干上，自然魔法和古代史的圣地。你想象着那里的图书馆：书页间夹着干花，连灰尘都带着青草味。");arr.push("");arr.push("你把信小心收好。第三印的入口、星象塔——那些名字，光是念着，就让人心跳。");arr.push("");return arr;
    },
    options:[
      {t:"开始交换生生活", go:"academy_elf_hub", effect:{flag:"exchange_elf", timeCost:"1semester"}},
      {t:"返回", go:"academy_exchange_apply", effect:{}}
    ]
  };
};


  nodes["academy_exchange_dwarf"] = function(){
  return {
    place:"交换生·矮人",
    text:function(){
      const arr=[];
      arr.push("你申请去矮人铁峰锻造学院做交换生。");
      arr.push("");
      arr.push("矮人铁峰锻造学院在地下——锻造和工程的最高学府。");
      arr.push("");
      arr.push("在这里，你可以接触到第四印的核心、永恒熔炉、符文宝库。");
      arr.push("交换生批复下来那天，矮人导师索林把你叫到工坊。他正在打一柄短锤，锤声咚咚，震得桌上铁屑跳动：“小子，铁峰锻造学院在地下——下去之前，先把你这双嫩手练出茧子。”");arr.push("");arr.push("他递给你一副皮手套，内衬是羊毛的：“地底冷。别学那些外行，冻掉了指头，一辈子打不了铁。”");arr.push("");arr.push("你接过手套。工坊里炉火正旺，火光把他的络腮胡子照得发红。你知道，这趟交换不只是学锻造——永恒熔炉、符文宝库，那些东西都在地底等着你。");arr.push("");return arr;
    },
    options:[
      {t:"开始交换生生活", go:"academy_dwarf_hub", effect:{flag:"exchange_dwarf", timeCost:"1semester"}},
      {t:"返回", go:"academy_exchange_apply", effect:{}}
    ]
  };
};


  nodes["academy_transfer_apply"] = function(){
  return {
    place:"转校申请",
    text:function(){
      const arr=[];
      arr.push("【转校申请】");
      arr.push("");
      arr.push("你可以申请转校——但转校有代价：");
      arr.push("");
      arr.push("1. 原学院的关系会衰减");
      arr.push("2. 你会错过原学院的一些事件");
      arr.push("3. 新学院的入学考试可能很难");
      arr.push("4. 有些学院不接受转校生（精灵/兽人）");
      arr.push("");
      arr.push("但转校也有好处——你可以体验完全不同的学院生活，收集不同的伏笔。");
      arr.push("转校申请的表格摆在教务长桌上，边角压着一枚镇纸。教务长摘下眼镜，把它放在表格旁边：“想清楚了？转校不是小事——手续、学籍、档案，层层要盖章。”");arr.push("");arr.push("他翻开一本厚厚的册子，指着其中一页：“三条规矩你记住。一，原学院的关系会衰减——你走了，这边的导师、同窗，不会再为你说话。二，转校考试有淘汰率，考不过，两边都回不去。三，学费要翻倍。”");arr.push("");arr.push("他把册子合上，看着你：“如果你只是好奇别的学院什么样，我劝你趁早打消念头。如果非去不可——那就把这条路上所有的代价，都算清楚。”");arr.push("");return arr;
    },
    options:[
      {t:"申请转校到艾尔达大陆学院", go:"academy_transfer_elda", effect:{timeCost:"1period"}},
      {t:"申请转校到圣光神学院", go:"academy_transfer_holy", effect:{timeCost:"1period"}},
      {t:"申请转校到帝国军事学院", go:"academy_transfer_military", effect:{timeCost:"1period"}},
      {t:"取消转校", go:"academy_inter_event_hub", effect:{}}
    ]
  };
};


  nodes["academy_transfer_elda"] = function(){
  return {
    place:"转校·艾尔达",
    text:function(){
      const arr=[];
      arr.push("你申请转校到艾尔达大陆学院。");
      arr.push("");
      arr.push("转校需要通过入学考试——艾尔达的入学考试很严格。");
      arr.push("");
      arr.push("如果你通过了，你将成为艾尔达的学生——但你原学院的关系会衰减。");
      return arr;
    },
    options:[
      {t:"参加转校考试", go:"academy_elda_hub", effect:{check:"INT", tier:{
        crit:{t:"你以优异的成绩通过了转校考试！艾尔达学院欢迎你。你原学院的关系有所衰减，但你获得了新的机会。", effect:{flag:"transferred_to_elda", reputation:10, relation:"old_academy:-15"}},
        ok:{t:"你通过了转校考试。欢迎来到艾尔达。", effect:{flag:"transferred_to_elda", relation:"old_academy:-10"}},
        fail:{t:"你没有通过转校考试。你只能留在原学院。", effect:{reputation:-5}},
        critfail:{t:"你不仅没通过考试，还被原学院发现了你想转校——他们对你的态度变了。", effect:{reputation:-10, relation:"old_academy:-20"}}
      }}, timeCost:"1period"},
      {t:"取消", go:"academy_transfer_apply", effect:{}}
    ]
  };
};


  nodes["academy_transfer_holy"] = function(){
  return {
    place:"转校·圣光",
    text:function(){
      const arr=[];
      arr.push("你申请转校到圣光神学院。");
      arr.push("");
      arr.push("圣光神学院的转校考试包括信仰测试——如果你有灵魂魔法天赋，会被拒绝。");
      arr.push("圣光神学院的转校考试在一间白室里进行。对面坐着三位神官，中间那位手里托着一盏灯，灯光是暖白色的。");arr.push("");arr.push("“先做信仰测试。”中间的神官开口，“闭上眼睛，放空心神——如果你体内有灵魂魔法的天赋，这盏灯会变暗。”");arr.push("");arr.push("你闭上眼。白室里安静得能听见自己的心跳。灯的光在你眼皮上映出一片暖色——你感觉到那光轻轻晃了一下。等你睁开眼，三位神官的表情看不出变化。中间那位开口：“测试结束。你回去等消息吧。”你走出白室，却总觉得那盏灯，晃得不太对劲。");arr.push("");return arr;
    },
    options:[
      {t:"参加转校考试", go:"academy_holy_hub", effect:{check:"SPR", tier:{
        crit:{t:"你通过了信仰测试！圣光神学院欢迎你。", effect:{flag:"transferred_to_holy", relation:"old_academy:-15"}},
        ok:{t:"你通过了考试。欢迎来到圣光神学院。", effect:{flag:"transferred_to_holy", relation:"old_academy:-10"}},
        fail:{t:"你没有通过信仰测试。", effect:{reputation:-5}},
        critfail:{t:"你的灵魂魔法天赋被发现了！你被教会标记为「异端嫌疑人」。", effect:{reputation:-20, flag:"church_heretic_suspect", san:-10}}
      }}, timeCost:"1period"},
      {t:"取消", go:"academy_transfer_apply", effect:{}}
    ]
  };
};


  nodes["academy_transfer_military"] = function(){
  return {
    place:"转校·军事",
    text:function(){
      const arr=[];
      arr.push("你申请转校到帝国军事学院。");
      arr.push("");
      arr.push("军事学院的转校考试包括武力测试——贵族出身优先。");
      arr.push("军事学院的转校考试设在操场上，铁面教官抱臂站在一边。第一项是武装长跑，绕着操场跑十圈，中途不许停。");arr.push("");arr.push("跑完后，你撑着膝盖喘气，教官走过来，踢了踢你放下的盾牌：“力气还行。接下来考兵器——刀、枪、盾，挑一样，和我过三招。”");arr.push("");arr.push("你挑了盾。三招过后，你手臂发麻，虎口裂了条小口子，但你没退。教官盯着你看了两秒，忽然咧嘴：“行。贵族那套走后门的说法，在你身上不适用。回去等通知吧。”");arr.push("");return arr;
    },
    options:[
      {t:"参加转校考试", go:"academy_military_hub", effect:{check:"STR", tier:{
        crit:{t:"你在武力测试中击败了教官！军事学院欢迎你。", effect:{flag:"transferred_to_military", reputation:15, relation:"old_academy:-15"}},
        ok:{t:"你通过了考试。欢迎来到军事学院。", effect:{flag:"transferred_to_military", relation:"old_academy:-10"}},
        fail:{t:"你没有通过武力测试。", effect:{reputation:-5}},
        critfail:{t:"你在测试中受了重伤！军事学院拒绝了你。", effect:{hp:-20, reputation:-10}}
      }}, timeCost:"1period"},
      {t:"取消", go:"academy_transfer_apply", effect:{}}
    ]
  };
};


  nodes["academy_multi_perspective"] = function(){
  return {
    place:"多视角叙事",
    text:function(){
      const arr=[];
      arr.push("【多视角叙事】");
      arr.push("");
      arr.push("某些重要事件后，你可以解锁「其他学院视角」——以其他学院学生的身份重走一段故事。");
      arr.push("");
      arr.push("每个视角都有偏见和隐瞒——你需要自己判断真相。");
      arr.push("");
      arr.push("（多视角叙事是收集跨学院伏笔的重要方式。）");
      arr.push("某些重要事件后，学院会开放‘多视角回看’——你可以以其他学院学生的身份，重走一段故事。");arr.push("");arr.push("你第一次试的时候，感觉很奇怪：同一件事，从圣光学院学生的眼里看，是圣光净化异端；从暗蚀会学生的眼里看，是猎杀自由灵魂；从你的同学嘴里听，又是另一个版本。");arr.push("");arr.push("每个视角都有偏见和隐瞒——他们说的都是自己相信的‘真相’。你慢慢学会了一件事：真相，常常不在任何单一视角里，而在它们之间。");arr.push("");return arr;
    },
    options:[
      {t:"以圣光学院学生的视角看「净化令升级」", go:"academy_perspective_holy", effect:{timeCost:"1period"}},
      {t:"以军事学院学生的视角看「秘密实验」", go:"academy_perspective_military", effect:{timeCost:"1period"}},
      {t:"以精灵学院学生的视角看「第三印松动」", go:"academy_perspective_elf", effect:{timeCost:"1period"}},
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_perspective_holy"] = function(){
  return {
    place:"【圣光学院视角】净化令升级",
    text:function(){
      const arr=[];
      arr.push("（你以圣光神学院学生的视角，看到了净化令升级的另一面。）");
      arr.push("");
      arr.push("「净化令必须升级！」审判长马库斯在会议上大声说。");
      arr.push("");
      arr.push("「异端越来越多了——灵魂法师、暗蚀会、还有那些「能看到符文的人」。我们必须加强控制！」");
      arr.push("");
      arr.push("大主教本尼迪克特沉默着。他想说什么，但最终没有说。");
      arr.push("");
      arr.push("圣女塞拉芬娜在角落祈祷。她的脸色很苍白——她「听到」了什么，但她不敢说。");
      arr.push("");
      arr.push("（你明白了——净化令的升级，不只是教会的决定。还有别的力量在推动它。）");
      arr.push("你以圣光神学院学生的身份，坐在大教堂偏厅的会议室外。门虚掩着，里面传来拍桌子的声音。");arr.push("");arr.push("“净化令必须升级！”审判长马库斯的嗓门很大，“异端越来越多了——灵魂法师、暗蚀会、还有那些‘能看到符文的人’。他们藏在平民堆里，藏在学院里，藏在我们眼皮底下！”");arr.push("");arr.push("一个苍老的声音不紧不慢地接话：“升级净化令，就得扩编审判庭。经费从哪来？教区今年的捐税已经收到三年后了。”");arr.push("");arr.push("门里沉默了一会儿。马库斯的声音又响起来，这次低了些：“总会有办法的。神的事情，神会安排；人的事情——我们来。”你坐在门外，把这句话一字不落地记在心里。");arr.push("");return arr;
    },
    options:[
      {t:"继续", go:"academy_multi_perspective", effect:{knowledge:2, san:-5, flag:"perspective_holy"}}
    ]
  };
};


  nodes["academy_perspective_military"] = function(){
  return {
    place:"【军事学院视角】秘密实验",
    text:function(){
      const arr=[];
      arr.push("（你以军事学院学生的视角，看到了秘密实验的另一面。）");
      arr.push("");
      arr.push("「实验体7号又失控了。」一个研究员说。");
      arr.push("");
      arr.push("「没关系。」大法师梅林说，「我们需要更多的数据。七印的力量，必须被人类掌握。」");
      arr.push("");
      arr.push("你看着实验体——那曾经是一个人。现在，他/她已经不像人了。");
      arr.push("");
      arr.push("梅林注意到了你。「别担心，」他说，「这都是为了更大的善。」");
      arr.push("");
      arr.push("（你明白了——军事学院的秘密实验，比你想象的更黑暗。而梅林，可能不是你以为的那个人。）");
      arr.push("深夜，你以军事学院学生的身份，站在地下实验室的观察窗前。玻璃那一侧，研究员们围着一个巨大的符文笼——笼子里，一个年轻人蜷缩着，额头上浮现出淡蓝色的纹路，一闪一闪。");arr.push("");arr.push("“实验体7号又失控了。”一个研究员说，声音里有掩饰不住的疲惫，“第四印的碎片嵌入后，意志再强的人也会被撑裂。”");arr.push("");arr.push("大法师梅林站在最前面，袍子在灯光下泛着银边。他看着笼子里的人，声音平得像在念一份报告：“没关系。我们需要更多的数据——七印的力量，必须被人类掌握。代价，从来都有人愿意付。”");arr.push("");arr.push("笼子里的人抬起头，隔着玻璃看了你一眼。他的眼神很清醒——清醒得让你后脊发凉。");arr.push("");return arr;
    },
    options:[
      {t:"继续", go:"academy_multi_perspective", effect:{knowledge:2, san:-10, flag:"perspective_military"}}
    ]
  };
};


  nodes["academy_perspective_elf"] = function(){
  return {
    place:"【精灵学院视角】第三印松动",
    text:function(){
      const arr=[];
      arr.push("（你以精灵银叶学院学生的视角，看到了第三印松动的另一面。）");
      arr.push("");
      arr.push("「第三印又松动了。」长老艾莉娅说。");
      arr.push("");
      arr.push("「我们需要更多的「祭品」。」另一个长老说。");
      arr.push("");
      arr.push("「不。」艾莉娅说，「我们不能再这样下去了。喂养它，不是长久之计。」");
      arr.push("");
      arr.push("「那你有什么办法？」另一个长老反问，「黄林晶的方法，已经用了三千年。你有更好的吗？」");
      arr.push("");
      arr.push("艾莉娅沉默了。她看向世界树的深处——那里，第三印在跳动。");
      arr.push("");
      arr.push("（你明白了——精灵长老们在「喂养」第三印。而他们，已经没有别的办法了。）");
      arr.push("你以精灵银叶学院学生的视角，看到了第三印松动的另一面。");arr.push("");arr.push("长老艾莉娅的声音在树屋里回响：“第三印又松动了。地脉的震动比去年频繁了十倍。”她摊开一幅树皮地图，指尖沿着一条红线缓缓移动：“封印一旦破碎，深渊的气息会从这条裂缝涌向整片大陆。”");arr.push("");arr.push("另一个长老叹了口气：“我们需要更多的‘祭品’——不是血肉，是失传的符文、古老的歌谣、沉睡在地下的器物。第三印需要它们来镇定。”");arr.push("");arr.push("你站在长老们身后，看着地图上那条蜿蜒的红线。它从世界树出发，一路向北，穿过草原、沙漠、群山——尽头，是封印所在的方向。");arr.push("");return arr;
    },
    options:[
      {t:"继续", go:"academy_multi_perspective", effect:{knowledge:3, san:-8, flag:"perspective_elf"}}
    ]
  };
};


  nodes["academy_12_directions_review"] = function(){
  initAcademyV28();
  return {
    place:"学院章12方向回顾",
    text:function(){
      const arr=[];
      arr.push("【学院章12大方向】");
      arr.push("");
      let totalNodes = 0;
      for(const key in ACADEMY_12_DIRECTIONS_V28){
        const d = ACADEMY_12_DIRECTIONS_V28[key];
        totalNodes += d.nodes;
        arr.push("【" + d.name + "】" + d.desc + "（约" + d.nodes + "节点）");
        arr.push("");
      }
      arr.push("总计约 " + totalNodes + " 节点（含预留扩展位）。");
      arr.push("");
      arr.push("所有方向均预留至少50%扩展节点位，方便后续持续扩充。");
      arr.push("学院章十二大方向的回顾页在你眼前展开。每一行文字，都是一条走过的路、一个做过的选择。");arr.push("");arr.push("你逐行看过去，有些方向你走得深，有些只是擦肩。但每一条，都在你身上留下了痕迹——技能、关系、或者一句还没兑现的话。");arr.push("");arr.push("你合上回顾页。路还长，方向也还多——重要的不是走过多少条，而是接下来，你想往哪走。");arr.push("");return arr;
    },
    options:[
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_chapter_summary"] = function(){
  initAcademyV28();
  return {
    place:"学院章总结",
    text:function(){
      const arr=[];
      arr.push("【学院章总结】");
      arr.push("");
      arr.push("你的学院生活结束了。");
      arr.push("");
      arr.push("在这五年里——");
      arr.push("");
      // 统计
      let secretsFound = 0;
      for(const key in ACADEMY_FORESHADOWING_V28){
        if(S.flags && S.flags["foreshadow_"+key]) secretsFound++;
      }
      arr.push("你发现了 " + secretsFound + " 个学院秘密。");
      arr.push("");
      arr.push("你选择了 " + (S.graduation.destination || "自由") + " 作为你的毕业去向。");
      arr.push("");
      arr.push("你的学院是：" + getCurrentAcademyV28().name);
      arr.push("");
      arr.push("你在学院的所有选择、所有秘密、所有人际关系，都将在大陆章中产生后果。");
      arr.push("");
      arr.push("学院不是等待毕业的过渡章——是你在这个世界最温暖、最危险、最难忘的一段时光。");
      arr.push("");
      arr.push("而现在，是时候踏入更广阔的世界了。");
      arr.push("又一年过去了。");arr.push("你坐在宿舍的窗台上，翻着这一年的笔记。纸页已经卷边，墨迹褪了些颜色，可那些字，每一笔都还记得当时写下它的温度。");arr.push("你数了数这一年认识的人：室友、同窗、教授、还有那个总在图书馆角落看你的人。有些人走近了，有些人还隔着雾。");arr.push("窗外，学院的钟楼在暮色里立着，像一根定海神针。你忽然想起去年刚来时，站在门廊下看那些院长画像的自己——那已经是另一个你了。");arr.push("风从窗缝里灌进来，带着初春泥土的气息。你把笔记合上，放进箱子最上层。");arr.push("你知道，新的学期，还会有新的故事。有些故事会甜，有些会苦。可你已经不像去年那样，害怕它们了。");return arr;
    } /*v45inj:academy_chapter_summary*/,
    options:[
      {t:"进入大陆章", go:"continent_start_variation", effect:{flag:"academy_chapter_complete"}}
    ]
  };
};


  nodes["academy_choice_entry"] = function(){
  initAcademyV28();
  academyV28IntegrationCheck();
  return {
    place:"选择学院",
    text:function(){
      const arr=[];
      arr.push("【选择你的学院】");
      arr.push("");
      arr.push("艾尔达大陆上有十几所学院——人类三大顶尖学院鼎力，种族学院各有特色，普通学院遍布各地，乡村学院也有天才。");
      arr.push("");
      arr.push("你报考哪所学院，将决定你未来五年的人生——你的同学、你的教授、你的秘密、你的毕业去向。");
      arr.push("");
      arr.push("出身决定起点，但不决定终点。乡村学院的天才，也可能一鸣惊人。");
      arr.push("");
      arr.push("（每所学院都有不同的入学考试、课程、同学、秘密和毕业去向。多周目可以体验不同学院。）");
      return arr;
    },
    options:[
      {t:"艾尔达大陆学院（交汇城·综合中立）", go:"academy_admission_elda", effect:{}},
      {t:"圣光神学院（圣城·教会控制）", go:"academy_admission_holy", effect:{}},
      {t:"帝国军事学院（承天山·军方控制）", go:"academy_admission_military", effect:{}},
      {t:"查看更多学院（种族/普通/乡村）", go:"academy_choice_more", effect:{}}
    ]
  };
};


  nodes["academy_quick_jump"] = function(){
  return {
    place:"学院快速跳转",
    text:function(){
      const arr=[];
      arr.push("【学院快速跳转】");
      arr.push("");
      arr.push("选择你想进入的学院：");
      arr.push("学院的大厅里立着一块传送牌，木牌上刻着各大学院的名字。你伸手按在牌面上，能感觉到符文在指尖下微微发烫。");arr.push("");arr.push("牌面亮起不同颜色的光——艾尔达大陆学院的蓝、圣光神学院的白、战神学院的红、银叶学院的绿。每一道颜色，都是一条不同的路。");arr.push("");arr.push("你收回手。传送牌的光渐渐暗下去。你还没决定要去哪——但你知道，选择权在你手里。");arr.push("");return arr;
    },
    options:[
      {t:"艾尔达大陆学院", go:"academy_elda_hub", effect:{}},
      {t:"圣光神学院", go:"academy_holy_hub", effect:{}},
      {t:"帝国军事学院", go:"academy_military_hub", effect:{}},
      {t:"精灵银叶学院", go:"academy_elf_hub", effect:{}},
      {t:"矮人铁峰学院", go:"academy_dwarf_hub", effect:{}},
      {t:"兽人战神学院", go:"academy_orc_hub", effect:{}},
      {t:"半身人绿野学院", go:"academy_halfling_hub", effect:{}},
      {t:"乡村学院", go:"academy_village_hub", effect:{}},
      {t:"返回", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_system_hub"] = function(){
  initAcademyV28();
  return {
    place:"学院系统",
    text:function(){
      const arr=[];
      arr.push("【学院系统】");
      arr.push("");
      arr.push("当前学院：" + getCurrentAcademyV28().name);
      arr.push("当前年份：第" + (S.academy.year || 1) + "年");
      arr.push("");
      arr.push("你可以：");
      arr.push("1. 进入当前学院");
      arr.push("2. 查看学院排名");
      arr.push("3. 参加校际活动");
      arr.push("4. 查看发现的秘密");
      arr.push("5. 查看12方向回顾");
      arr.push("学院系统的面板在眼前展开，各项功能排列得清清楚楚。你伸手点了点，面板上的文字随着你的动作逐一亮起。");arr.push("");arr.push("当前学院、当前年份、课程进度、人际关系——每一项都是你这几年在学院里攒下的家当。你看着这些数字，想起它们背后那些具体的人和事。");arr.push("");arr.push("你关上面板，深吸一口气。日子还得一天一天过，路还得一步一步走。");arr.push("");return arr;
    },
    options:[
      {t:"进入当前学院", go:"academy_elda_hub", effect:{}},
      {t:"查看学院排名", go:"academy_rankings_view", effect:{}},
      {t:"参加校际活动", go:"academy_inter_event_hub", effect:{}},
      {t:"查看发现的秘密", go:"academy_foreshadow_review", effect:{}},
      {t:"查看12方向回顾", go:"academy_12_directions_review", effect:{}},
      {t:"返回主枢纽", go:"fc_jiaohui_entry", effect:{}}
    ]
  };
};


  nodes["academy_y1_night_library"] = function(){
return {
  place:"学院图书馆·深夜",
  text:[
    "临近闭馆，图书馆里的人陆续走了。管理员老头抱着钥匙串，一间间熄灯。你没有走——你躲进了顶楼书架后面的死角，等他锁门。",
    "灯灭之后，黑暗从四面八方涌上来。你借着窗外月光，抽出一本书，正要翻开，忽然听见楼下传来脚步声。",
    "不是管理员的脚步。那人走得很慢，很轻，像在找什么。脚步声在书架间穿行，停了一会儿，又继续走。你屏住呼吸，一动不动。",
    "脚步声停在你楼下的那排书架前。你听见一声极轻的抽气声，然后是一阵翻书的沙沙声。过了一会儿，脚步声又响起来，渐渐远去，最终消失。",
    "你等了很久，才敢动。你走到栏杆边往下看——楼下那排书架前，一本书被抽出来，摊开着，放在地上。你下楼，蹲下去看。",
    "那是一本关于封印术的旧书，翻开的那页，画着一道复杂的符文。书页的空白处，有人用很细的笔迹写着一行字：「第七印。它不是锁，是门。」",
    "你把书放回原位，像从没动过。你走出图书馆的时候，天边已经泛白。你记住了那行字，也记住了那个脚步声。",
  ],
  options:[
    {t:"回宿舍", go:"academy_dorm_generic", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y1_rooftop"] = function(){
return {
  place:"宿舍屋顶·夜",
  text:[
    "睡不着的时候，你爬上宿舍楼顶。屋顶的风很大，吹得衣摆猎猎作响。你坐在瓦片上，看着学院的灯火一盏盏熄灭。",
    "钟楼的轮廓立在夜色里，像一个沉默的巨人。你看着它，忽然觉得，这座学院白天是活的，到了夜里，它才露出另一张脸。",
    "你听见身后传来声响——有人也爬了上来。是个女生，抱着一条毯子。她看见你，愣了一下，然后在你旁边坐下，隔着一块瓦的距离。",
    "「睡不着？」她问。你点点头。她说：「我也是。」她没有再说话，把毯子裹紧，看着远处。",
    "你们坐了很久，谁都没有开口。夜风很大，吹得人说话都得提高嗓门，所以干脆不说。后来她站起来，拍了拍裙子：「走了。明天还有课。」",
    "她走后，你又坐了一会儿。钟楼的钟敲了两下。你忽然觉得，这个夜晚，会记很久。",
  ],
  options:[
    {t:"回宿舍睡觉", go:"academy_dorm_generic", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y2_dawn_duel"] = function(){
return {
  place:"学院后山·黎明",
  text:[
    "决斗约在黎明。你到的时候，天边刚露出一线白。后山空地上，对方已经站在那儿了——是上一届的学长，据说剑术排前三。",
    "他看见你，没有废话，拔出剑：「规矩你懂。倒地认输，或者，认输认输。」他笑了一下，「你也可以现在走。」",
    "你拔出剑。晨风从山谷里灌上来，吹得剑穗乱飞。你听见自己的心跳，一下，一下，很稳。",
    "他先动了。剑光快得像一道白线，你侧身避开，剑锋擦着你的衣摆划过去，带起一声轻响。你反手一剑，他格开，退后半步，眼睛亮了一下：「有意思。」",
    "你们来回了七八个回合。他的剑越来越快，你的呼吸越来越沉。又一次交锋时，你没有躲，硬接了他一剑，虎口震得发麻——但你的剑，也指到了他的喉咙前。",
    "剑尖相抵。他低头看了看抵在喉前的剑尖，又看了看自己抵在你胸前的剑，忽然笑了：「平手。」他把剑收回去，「下次，我不会留手。」",
    "他走了。你站在原地，喘着气，看着天边彻底亮起来。你低头看自己的手——虎口裂了，渗着血。你握了握拳，转身下山。",
  ],
  options:[
    {t:"回学院处理伤口", go:"academy_arena", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y3_road_letter"] = function(){
return {
  place:"实习路上·驿站",
  text:[
    "驿站的信箱里，躺着一封给你的信。信封被雨水打湿过，边角皱成一团，但封口的蜡印还完整。",
    "你拆开信。纸很薄，字很小，是母亲的手笔。信上说，家里的老槐树今年开花了，结的槐花比往年多，她腌了一罐，等你回去吃。",
    "信的最后，她问你在外面好不好，说如果累了，就回家。「路远，别硬撑。」她写。字有点歪，像是写的时候手在抖。",
    "你坐在驿站的门槛上，把信看了两遍。风从旷野里吹过来，带着草和泥土的味道。驿站的人进进出出，没有人注意你。",
    "你把信折好，收进怀里，贴着胸口。然后你站起来，拍了拍裤子，继续赶路。你走了一段，又回头看了一眼驿站——它已经小成一个黑点了。",
    "你摸了摸怀里的信，继续往前走。太阳很高，路很长。",
  ],
  options:[
    {t:"继续赶路", go:"academy_year3_intro", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y4_hidden_meeting"] = function(){
return {
  place:"学院地窖·秘密集会",
  text:[
    "地窖的门是一道暗门，藏在储物间最里面的一排酒架后面。你按约定的节奏敲了三下，门开了一条缝，一只手把你拉了进去。",
    "里面点着一盏油灯，围坐着五六个人。你认识其中两个——一个是高年级的学长，一个是图书管理员的小徒弟。其他人，面孔陌生。",
    "学长开口，声音压得很低：「教会的人，下个月要来查。查到什么，谁也不知道。」他环顾四周，「今天请你们来，是想问一句——如果查到你头上，你站哪边？」",
    "地窖里安静下来。油灯的火苗晃了一下，每个人的影子都跟着晃。有人低头，有人看天，没有人先开口。",
    "你看着那盏灯。灯光照不到的地方，黑得像一团浓墨。你知道，今晚坐在这里的人，走出这扇门，就可能再也不会坐在一起了。",
    "学长等了一会儿，说：「不用现在回答。回去想想。但别想太久——日子不等人。」他把灯芯挑亮了一些，「散了吧。一个个走，间隔久一点。」",
    "你是最后一个离开的。走出地窖的时候，夜风很凉。你站在储物间门口，回头看了一眼那排酒架，然后把它关严，像什么都没发生过。",
  ],
  options:[
    {t:"回宿舍", go:"academy_year4_event", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y5_last_class"] = function(){
return {
  place:"学院教室·最后一课",
  text:[
    "最后一堂课，来的人比平时多。平时逃课的人，今天都来了，教室里坐得满满当当。教授站在讲台上，看了所有人一眼，没有点卯。",
    "他像往常一样讲课，只是语速慢了一些。讲到一半，他忽然停下来，说：「这堂课，我讲了几十年。每年都一样，又每年都不一样。」",
    "他顿了顿：「我不教你们怎么活成谁。我只教你们，别活成自己讨厌的样子。」教室里很安静，没有人笑，也没有人接话。",
    "下课铃响的时候，没有人站起来。教授把讲义合上，夹在腋下，走到门口，又回过头：「散了吧。以后的路，自己走。」",
    "他走了。教室里的人陆续站起来，有人走得很慢，有人站着没动。你坐在座位上，看着黑板上的粉笔字——那是教授最后写的，一行公式，你们学过的第一个公式。",
    "你最后走。你擦掉了那行公式，像擦掉一个时代。走出教室的时候，阳光正好，走廊里空荡荡的，只有你的脚步声。",
  ],
  options:[
    {t:"去毕业典礼", go:"academy_year5_intro", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y2_tavern_rumor"] = function(){
return {
  place:"学院酒馆·午后",
  text:[
    "午后的酒馆人少，角落里坐着两个高年级学生，声音压得很低。你坐在邻桌，要了一杯麦酒，没有刻意去听，但话还是飘了过来。",
    "「……听说了吗？图书馆顶楼那间屋子，昨天夜里亮着灯。」「顶楼不是早就锁了吗？」「锁是锁着，灯是真亮着。有人看见窗户里有个人影，晃了一下就不见了。」",
    "「别瞎说。」「我瞎说什么？巡逻的老林都说了，他巡到楼下，听见上面有翻书的声音，哗啦哗啦的，可楼上明明没人。」",
    "两个人沉默了一会儿。一个说：「你说，会不会跟去年那个失踪的学生有关？」另一个没有接话，只把杯子里的酒喝干了。",
    "你喝完麦酒，把杯子放回柜台。老板擦着杯子，眼皮也不抬：「听见了？」你没说话。他笑了笑：「听见就听见。这学院里，听见的事，比看见的多。」",
    "你走出酒馆，午后阳光正好。你回头看了一眼酒馆的门帘，心里记下了：图书馆顶楼，夜里，有人翻书。",
  ],
  options:[
    {t:"回学院", go:"academy_elda_tavern", effect:{time:1}}
  ]
};
}; 
  nodes["academy_y1_dorm_night"] = function(){
return {
  place:"学院·宿舍深夜",
  text:[
    "宿舍的灯熄了。走廊里安静下来，只剩下窗外虫鸣，和隔壁床翻身的窸窣声。",
    "你在黑暗里睁着眼，看着天花板。白天的事还在脑子里转：那本旧笔记、图书馆顶楼的翻书声、还有教授看你时那种若有所思的眼神。",
    "对面上铺，有人轻轻咳了一声。是马库斯。他翻了个身，说：「睡不着？」",
    "你嗯了一声。他没有再说话。过了一会儿，他说：「我头三个月也睡不着。」顿了顿，「后来习惯了。这地方，夜里比白天想得多。」",
    "「你习惯了吗？」你问。",
    "他沉默了很久：「没有。只是习惯了睡不着。」",
    "黑暗里，你们都安静下来。窗外，虫鸣一声接一声。你闭上眼睛，慢慢数着那些声音，数着数着，不知道什么时候睡着了。",
    "第二天早上，你醒来的时候，马库斯已经走了。他的床铺叠得整整齐齐，像没睡过人一样。",
  ],
  options:[
    {t:"起床，开始新的一天", go:"academy_dorm_generic", effect:{time:1}}
  ]
};
}; 
  nodes["academy_magic_class"] = function(){ return {
  text:function(){return [
    "学院的魔法课程在元素塔中进行。七系魔法各有专属的教室，每间教室都配备了防护结界和练习用的假人。",
    "你站在元素塔的大厅里，看着各系教室的门牌。今天可以选择旁听或正式上课。"
  ,"元素塔的走廊里，七扇门排成一排，每扇门上的符文颜色都不同。你站在火系教室门口，能听见门后传来低沉的轰鸣——像有火在墙内流动。","","推开门，热气扑面。教室里摆着十几个石制假人，表面被烧得发黑开裂。一个穿红袍的教授正往假人身上画符文，头也不抬：“新来的？找地方坐。今天练火球——先学会让它不炸在自己手上。”","","你学着其他学生的样子，把双手放在面前的符文石上。掌心的魔力像被什么牵住了，一跳一跳的。窗外的天空很蓝，塔下的学院像一幅画。你深吸一口气，把注意收回到掌心里。",""];},
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


  nodes["academy_year1_intro"] = function(){return{
place:"艾尔达大陆学院 · 校门",
text:[
"你站在艾尔达大陆学院的校门前，抬头看着这座传说中的学院。",
"学院建在一座小山的山顶上，四周被古老的橡树环绕着。校门是用白色的大理石建造的，上面刻着学院的校训——「知识即力量，真理即自由」。校门的两侧各有一座雕像，左边是光明神的雕像，右边是智慧女神的雕像。",
"校门前面是一个巨大的广场，广场上挤满了人。有和你一样的新生，有送孩子上学的家长，有来做生意的小贩，还有维持秩序的学院守卫。空气里弥漫着各种气味——香水、汗味、烤面包的香味、马粪的臭味，混杂在一起，构成了学院开学日特有的味道。",
"你深吸一口气，感觉心里既兴奋又紧张。",
"兴奋的是，你终于来到了这座大陆最顶尖的学院。从今天起，你将在这里学习魔法、历史、哲学、战斗，以及一切你想学习的东西。",
"紧张的是，你不知道自己能不能在这里生存下去。学院里的学生都是从大陆各地选拔出来的天才，而你……你只是一个普通的孩子，没有显赫的家世，没有惊人的天赋，甚至连学费都是别人替你交的。",
"「发什么呆？」一个声音在你身边响起。",
"你转过头，看到了一个和你差不多大的少年。他穿着一件崭新的学院制服，脸上带着一丝傲慢的笑容。",
"「你也是新生？」少年上下打量了你一眼，看到你身上那件打了补丁的旧衣服，眼里闪过一丝轻蔑，「哪个出身的？」",
"「自由城邦。」你老实说。",
"「自由城邦？」少年挑了挑眉，「贫民窟出来的？」",
"你没说话，但你的拳头握紧了。",
"少年看到你的反应，笑了。",
"「别紧张，我没有恶意。」他说，「我叫亚历山大·美第奇，来自南方商业城邦。我父亲是美第奇商会的会长。」",
"美第奇！你心里一惊。美第奇商会是大陆最大的商会，据说他们的财富可以买下整个自由城邦。而亚历山大·美第奇，就是美第奇商会的继承人。",
"「你……你好。」你有些不知所措地说。",
"亚历山大笑了，拍了拍你的肩膀。",
"「别这么拘束。」他说，「从今天起，我们就是同学了。走吧，一起进去报到。」",
"你看着亚历山大的背影，心里涌起了一股奇怪的感觉。",
"这个美第奇家的继承人，看起来并不像你想象中的那么傲慢。但你总觉得，他的笑容背后，藏着什么你看不透的东西。",
"你摇了摇头，把这些想法抛到脑后，跟着亚历山大走进了学院的大门。",
"从今天起，你的学院生活，正式开始了。"
],
options:[
{t:"跟着亚历山大去报到", go:"academy_year1_registration"},
{t:"自己一个人去报到", go:"academy_year1_registration", effect:{flags:["alone_registration"]}},
{t:"先在学院里转转，熟悉环境", go:"academy_year1_explore"}
]}};


  nodes["academy_year1_registration"] = function(){return{
place:"艾尔达大陆学院 · 报到处",
text:[
"报到处设在学院的主教学楼——智慧塔的一楼大厅里。",
"大厅里挤满了新生，大家排着长长的队伍，等待着办理入学手续。大厅的天花板很高，上面画着一幅巨大的壁画——描绘的是三千年前，光明神和深渊之主的最终决战。壁画的色彩很鲜艳，即使过了三千年，依然栩栩如生。",
"你排了大约半个时辰的队，终于轮到了你。",
"办理入学手续的是一个戴着眼镜的中年女人，她看起来很疲惫，面前堆着厚厚的一摞文件。",
"「名字？」她头也不抬地问。",
"你告诉了她你的名字。",
"「出身？」",
"「自由城邦。」",
"「职业倾向？」",
"你愣住了。职业倾向？你还没有想过这个问题。",
"「我……我还不确定。」你老实说。",
"女人抬起头，看了你一眼，眼里闪过一丝不耐烦。",
"「不确定？」她说，「每个人都必须选择一个职业。这是学院的规定。职业一旦选定，终身不可更改。你明白吗？」",
"你点了点头。你当然明白。在这个世界上，职业决定了一个人的命运。战士、法师、牧师、盗贼、猎人、术士、灵魂法师——七大职业，每一个都有自己的道路和规则。",
"「那……我可以都了解一下吗？」你问。",
"女人叹了口气，从抽屉里拿出一本小册子，递给你。",
"「这是职业指南。」她说，「你可以看看，但要快点决定。后面还有很多人在排队。」",
"你接过小册子，走到一边，开始翻阅。",
"小册子里详细介绍了七大职业的特点、优势、劣势，以及未来的发展方向。你看得很认真，因为你知道，这个选择将决定你的一生。",
"战士：近战物理攻击，高血量，高防御，适合喜欢正面战斗的人。",
"法师：远程魔法攻击，高伤害，低血量，适合喜欢远程输出的人。",
"牧师：治疗和辅助，可以治愈伤口，增强队友，适合喜欢支援的人。",
"盗贼：潜行和暗杀，高敏捷，高暴击，适合喜欢偷袭的人。",
"猎人：远程物理攻击，可以驯服野兽，适合喜欢远程和宠物的人。",
"术士：诅咒和召唤，可以诅咒敌人，召唤恶魔，适合喜欢黑暗魔法的人。",
"灵魂法师：最神秘的职业，可以操纵灵魂，读取记忆，甚至……复活死者。但这个职业被教会视为异端，学习灵魂魔法的人，会被教会追杀。",
"你看着灵魂法师的介绍，心里涌起了一股奇怪的冲动。",
"你想起了序章中发生的事情——暗蚀会、守望者、七道封印、深渊之主。你总觉得，这些事情和灵魂魔法有着某种联系。",
"但你也知道，选择灵魂法师，意味着你将成为教会的敌人，意味着你将走上一条危险而孤独的道路。",
"你合上小册子，深吸了一口气。",
"是时候做出选择了。"
],
options:[
{t:"选择战士", go:"academy_year1_class_choose", effect:{job:"warrior"}},
{t:"选择法师", go:"academy_year1_class_choose", effect:{job:"mage"}},
{t:"选择牧师", go:"academy_year1_class_choose", effect:{job:"priest"}},
{t:"选择盗贼", go:"academy_year1_class_choose", effect:{job:"rogue"}},
{t:"选择猎人", go:"academy_year1_class_choose", effect:{job:"hunter"}},
{t:"选择术士", go:"academy_year1_class_choose", effect:{job:"warlock"}},
{t:"选择灵魂法师（危险）", go:"academy_year1_class_soul", effect:{job:"soul_mage", flags:["soul_mage_chosen"]}}
]}};


  nodes["academy_year2_intro"] = function(){return{
place:"艾尔达大陆学院 · 大礼堂",
text:[
"第二年的开学日，学院的大礼堂里座无虚席。",
"你坐在人群中，看着台上的校长——一个白发苍苍的老人，名叫奥古斯都。他已经当了三十年的校长，据说他年轻的时候是大陆最强大的法师之一。",
"「同学们，」奥古斯都校长的声音在大礼堂里回荡，「新的一年开始了。在过去的一年里，你们学习了基础知识，掌握了基本技能。但在新的一年里，你们将面临更大的挑战。」",
"他顿了顿，环视了一下全场。",
"「我宣布，第二十七届院际大赛，正式开始！」",
"大礼堂里爆发出雷鸣般的掌声和欢呼声。",
"院际大赛，是学院每年最重要的活动。五大学院——战士学院、法师学院、牧师学院、盗贼学院、综合学院——各自派出代表队，进行为期一个月的比赛。比赛项目包括个人战斗、团队战斗、魔法竞赛、知识竞赛、生存挑战等等。",
"获得冠军的学院，将获得一年的资源优先权，以及学院最高荣誉——「金杯」。",
"你坐在人群中，心里涌起了一股强烈的兴奋感。",
"去年一年，你努力学习，刻苦训练，实力已经有了很大的提升。你渴望在院际大赛上证明自己，让所有人都看到你的实力。",
"「喂，」一个声音在你身边响起，「你觉得我们学院今年能拿冠军吗？」",
"你转过头，看到了你的室友——一个叫马库斯的北方公国少年。他是战士学院的学生，性格豪爽，力大无穷，是你在学院里最好的朋友。",
"「当然能。」你笑着说，「有你在，我们肯定能赢。」",
"马库斯挠了挠头，有些不好意思地笑了。",
"「别这么说。」他说，「我只是力气大而已。真正的主力，还是你啊。」",
"你正想说话，突然感觉到一道目光落在了你身上。",
"你转过头，看到了坐在不远处的一个少年——亚历山大·美第奇。他正看着你，脸上带着一丝意味深长的笑容。",
"你心里一动。去年一年，你和亚历山大的关系很微妙。你们有时候是朋友，有时候是对手。他总是在你需要帮助的时候出现，但你总觉得，他的帮助背后，藏着什么目的。",
"亚历山大看到你在看他，举起手中的酒杯，对你示意了一下，然后一饮而尽。",
"你皱了皱眉，转过头，没有理他。",
"「怎么了？」马库斯注意到了你的反应，「你和亚历山大又闹矛盾了？」",
"「没有。」你说，「只是觉得他这个人，看不透。」",
"马库斯耸了耸肩。",
"「美第奇家的人，都是这样的。」他说，「他们的脑子里，永远在盘算着什么。不过，只要他不害我们，就随他去吧。」",
"你点了点头，但心里的不安，却越来越强烈了。",
"你有一种预感——今年的院际大赛，不会那么平静。"
],
options:[
{t:"报名参加个人战斗比赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_individual_tournament"]}},
{t:"报名参加团队战斗比赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_team_tournament"]}},
{t:"报名参加知识竞赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_knowledge_tournament"]}},
{t:"不参加比赛，当观众", go:"academy_year2_audience", effect:{flags:["tournament_audience"]}} /*v489inj:y2*/,{t:"夜里翻来覆去，想听一听职业的低语", go:"sub_path_hub"}
]}};


  nodes["academy_year3_intro"] = function(){return{
place:"艾尔达大陆学院 · 教务处",
text:[
"第三年的开学日，你站在教务处的门口，手里拿着一张实习分配表。",
"按照学院的规定，第三年的学生，必须进行为期一年的外出实习。实习的地点有很多选择——可以去军队，可以去教会，可以去商会，可以去冒险者公会，也可以去大陆各地的魔法塔。",
"不同的实习地点，有不同的收获。去军队，可以学习战斗技巧和军团指挥；去教会，可以学习神术和教会的运作方式；去商会，可以学习商业和人脉；去冒险者公会，可以积累实战经验和声望；去魔法塔，可以深入研究魔法理论。",
"你看着实习分配表，心里犹豫不决。",
"这一年的实习，将对你未来的发展产生深远的影响。你必须慎重选择。",
"「想好了吗？」教务处的老师——一个戴着眼镜的中年男人——不耐烦地问，「后面还有很多人在等着。」",
"你深吸一口气，做出了选择。"
],
options:[{t:"选择去军队实习", go:"academy_year3_military", effect:{flags:["military_internship"]}},
{t:"选择去教会实习", go:"academy_year3_church", effect:{flags:["church_internship"]}},
{t:"选择去商会实习", go:"academy_year3_merchant", effect:{flags:["merchant_internship"]}},
{t:"选择去冒险者公会实习", go:"academy_year3_adventurer", effect:{flags:["adventurer_internship"]}},
{t:"选择去魔法塔实习", go:"academy_year3_magic_tower", effect:{flags:["magic_tower_internship"]}}, {"t": "驿站收到一封家书", "go": "academy_y3_road_letter"}]} /*v45opt:academy_year3_intro*/};


  nodes["academy_year4_intro"] = function(){return{
place:"艾尔达大陆学院 · 学院广场",
text:["第四年的开学日，学院的气氛和往年完全不同。", "你站在学院广场上，看着周围来来往往的学生，感觉到了一股压抑的氛围。每个人的脸上都写满了紧张和不安，没有人像往年那样嬉笑打闹。", "广场的中央，站着一群穿着白色长袍的人——那是光明教会的审判骑士。他们正在检查每一个进出学院的人，眼神锐利得像鹰一样。", "「发生什么事了？」你拉住一个路过的同学，低声问。", "那个同学看了一眼不远处的审判骑士，压低了声音。", "「你还不知道？」他说，「三天前，教会发布了「净化令」。他们说，学院里有暗蚀会的卧底，要进行全面搜查。」", "「暗蚀会的卧底？」你心里一惊，「在我们学院？」", "「没错。」同学点了点头，「据说，已经有三个教授被带走了。还有十几个学生，被怀疑是暗蚀会的成员，现在正在接受审讯。」", "你倒吸了一口凉气。", "暗蚀会——这个名字你并不陌生。序章的时候，你就和他们打过交道。你知道，他们是一群危险的人，为了获得深渊的力量，不惜一切代价。", "但你没有想到，他们竟然渗透到了学院里，而且还渗透得这么深。", "「那……学院是什么态度？」你问。", "「学院？」同学苦笑了一下，「学院能有什么态度？教会的势力那么大，学院敢说什么？校长虽然表面上在抗议，但实际上，也只能配合搜查。」", "你沉默了。", "你有一种预感——今年，将是你在学院里最不平静的一年。", "就在这时，你看到了一个熟悉的身影。", "是墨丘利教授。他站在教学楼的角落里，看着广场上的审判骑士，脸色凝重。", "你心里一动。墨丘利教授——你知道，他是守望者的一员。也许，他知道一些别人不知道的事情。", "你犹豫了一下，然后朝着墨丘利教授走了过去。", "第四年开学，学院的气氛不太一样了。布告栏上多了几张告示：净化令的通告、学生会的声明、一封措辞含糊的致家长信。", "广场上，有人戴着教会的银徽章，站成一排。他们不拦人，也不说话，只是站着。路过的人绕开他们走，像绕开几根柱子。", "宿舍里，室友把窗帘拉了一半。他压低声音说：「今年不太平。听说教会要派人来查。」他说完，又补了一句：「你说话小心点。」", "你坐在床边，看着窗帘缝里漏进来的光。去年你还会为了一门课熬夜，今年，你开始数日子了。", "窗外，钟楼的钟照常响起。钟声还是那个钟声，但听在耳朵里，分量不一样了。", "你从柜子里翻出那本旧笔记，翻到中间某一页，看了很久。然后你合上，把它放回原处。有些东西，该收起来了。"] /*v45inj:academy_year4_intro*/,
options:[
{t:"去找墨丘利教授，问问情况", go:"academy_year4_mercury", effect:{flags:["asked_mercury_about_purge"]}},
{t:"先回宿舍，看看室友们怎么样了", go:"academy_year4_dorm", effect:{flags:["checked_on_roommates"]}},
{t:"去图书馆，查查暗蚀会的资料", go:"academy_year4_library", effect:{flags:["researched_eclipse"]}},
{t:"躲起来，不要惹麻烦", go:"academy_year4_hide", effect:{flags:["hid_during_purge"]}}
]}};


  nodes["academy_year5_intro"] = function(){return{
place:"艾尔达大陆学院 · 毕业礼堂",
text:[
"第五年的毕业日，学院的毕业礼堂里弥漫着一股离别的伤感。",
"你坐在毕业生的席位上，看着台上的校长，心里百感交集。",
"五年了。你在这座学院里度过了五年的时光。五年里，你学习了知识，掌握了技能，结交了朋友，也树立了敌人。你经历了入学的兴奋，院际大赛的热血，实习的艰辛，政治风暴的考验。",
"现在，你终于要毕业了。",
"「同学们，」奥古斯都校长的声音在毕业礼堂里回荡，「五年前，你们还是一群懵懂的少年。五年后的今天，你们已经成长为大陆的栋梁。在未来的日子里，你们将走向大陆的各个角落，用你们所学的知识和技能，去改变这个世界。」",
"他顿了顿，环视了一下全场。",
"「但我也要提醒你们——这个世界，并不太平。七道封印正在松动，深渊之主正在苏醒。暗蚀会在暗中活动，守望者在默默守护。大陆的局势，越来越紧张了。」",
"全场安静了下来。",
"「你们是大陆的希望。」奥古斯都校长说，「我希望，你们能够记住学院的校训——知识即力量，真理即自由。无论你们将来走到哪里，无论你们将来做什么，都不要忘记，你们是艾尔达大陆学院的毕业生。」",
"他举起手中的酒杯。",
"「为了学院！为了真理！为了自由！」",
"全场的毕业生都举起了酒杯。",
"「为了学院！为了真理！为了自由！」",
"你也举起了酒杯，但你的心里，却在想着别的事情。",
"五年的学院生活结束了。但你知道，这不是结束，而是开始。",
"真正的挑战，还在后面。",
"「喂，」一个声音在你身边响起，「在想什么？」",
"你转过头，看到了马库斯。他穿着毕业礼服，脸上带着一丝离别的伤感。",
"「没什么。」你说，「只是觉得，时间过得真快。」",
"「是啊。」马库斯叹了口气，「五年，就这么过去了。」",
"他沉默了一会儿，然后说：「你毕业后，打算去哪里？」",
"你愣住了。",
"是啊，毕业后，你打算去哪里？",
"这五年里，你学习了很多，成长了很多。但你从来没有认真想过，毕业后，你要做什么。",
"是去军队，成为一名将军？",
"是去教会，成为一名牧师？",
"是去商会，成为一名商人？",
"是去冒险者公会，成为一名冒险者？",
"还是……去寻找七道封印的真相，去阻止深渊之主的苏醒？",
"你看着窗外的天空，心里涌起了一股强烈的冲动。",
"你知道，你应该选择后者。",
"因为，从序章开始，你的命运，就已经和这个世界的命运，紧紧地联系在一起了。"
],
options:[{t:"选择去军队，成为一名将军", go:"academy_year5_graduate_military", effect:{flags:["graduate_military"]}},
{t:"选择去教会，成为一名牧师", go:"academy_year5_graduate_church", effect:{flags:["graduate_church"]}},
{t:"选择去商会，成为一名商人", go:"academy_year5_graduate_merchant", effect:{flags:["graduate_merchant"]}},
{t:"选择去冒险者公会，成为一名冒险者", go:"academy_year5_graduate_adventurer", effect:{flags:["graduate_adventurer"]}},
{t:"选择去寻找七道封印的真相", go:"academy_year5_graduate_seals", effect:{flags:["graduate_seals"]}},
{t:"还没有想好，先休息一段时间", go:"academy_year5_graduate_rest", effect:{flags:["graduate_rest"]}}, {"t": "去上最后一堂课", "go": "academy_y5_last_class"}]} /*v45opt:academy_year5_intro*/};


  Object.assign(window.N || {}, nodes);
  if (window.v62_chunk_loader) window.v62_chunk_loader.mark("academy");
})();
