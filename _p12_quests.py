# -*- coding: utf-8 -*-
"""P1-2 生成器：NPC 好感度驱动支线（金秤账本 / 木臂藏信 / 断江旧枪）
幂等：锚点标记已存在则跳过插入；节点块整体替换。
不触碰判定公式 / writeNext 核心语义 / choose / 存档语义；saveVersion=48 不变。
"""
import io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')

def read(p):
    return io.open(p, encoding='utf-8', newline='').read()

def write(p, s):
    io.open(p, 'w', encoding='utf-8', newline='').write(s)

def insert_after(text, anchor, block, marker):
    """在 anchor 之后插入 block（若 marker 已存在则跳过），返回新文本。"""
    if marker in text:
        return text, False
    i = text.find(anchor)
    if i < 0:
        return text, False
    j = i + len(anchor)
    return text[:j] + block + text[j:], True

# ============ 支线节点（对象式，追加到 script_02.js 末尾） ============
QUESTS = '''
/* /p12inj:quests/ P1-2 NPC 好感度支线（金秤账本 / 木臂藏信 / 断江旧枪） */
N["p12_a_enter"]={place:"自由城邦 · 金衡商会",where:"白昼",text:[
"金衡商会的门面不显眼。金字招牌擦得锃亮，门楣上刻着一杆铜秤，秤盘一高一低，像在称一件永远称不完的东西。",
"大厅里没有柜台，只有一张长案。文森·金秤坐在案后，左手翻账本，右手打算盘。你进门，他头也不抬：“买货往左，出货往右。找人，坐下说。”",
"你在他对面坐下。他合上账本，抬眼打量你，目光像在过秤：“你不是来买货的。”",
"“金衡商会认名不认面。”他忽然笑了，“你既然坐下来，我记你一笔。说吧，什么事？”"
],options:[
{t:"报上名号，说想结识金衡总会长",run:function(){
  changeRelation('lv_trade1',10,'结识金衡总会长文森·金秤');
  S.p12Quest=S.p12Quest||{a:0,b:0,c:0}; if(S.p12Quest.a<1) S.p12Quest.a=1;
  writePar("你报了名号。文森没有寒暄，只把账本翻到某一页，提笔写下一行字。","res");
  writePar("“名字记下了。”他搁笔，“这一页，从今天起记你。”","res");
  curNode='p12_a_talk'; writeNext();
}}
]};
N["p12_a_talk"]={place:"自由城邦 · 金衡商会",where:"白昼",text:[
"“商会的事，说穿了就三件：进、出、欠。”文森给你倒了杯茶，“进出的账，天天有人对。欠的账，没人对。”",
"“十年前，河湾城闹饥荒。粮价我压着没涨，铺子关了三个月，免了三百户的债。”他指头敲了敲账本，“后来，有人还清了，有人搬走了，有人——忘了。”",
"“账本分两本。一本记钱，一本记人情。”他看了你一眼，“钱那本，总会长随时能看。人情这本，我只给信得过的人翻。”",
"他推过一页纸。纸上只有一行字：河湾城，城东船坞，韩姓老铁匠，欠一船修船的钱。"
],options:[
{t:"接下这页纸，代他去河湾城走一趟",run:function(){
  changeRelation('lv_trade1',15,'接下金秤的人情账');
  S.p12Quest.a=2;
  writePar("你收下那页纸。文森点了点头：“韩老铁匠，手艺是河湾城头一份。那年他修船修到一半，饥荒来了，船主跑了，他欠下料钱。”","res");
  writePar("“我不要他还钱。”文森合上账本，“我要他记得——这世上，有人在他最难的时候，没逼过他。”","res");
  writePar("你走出金衡商会时，天正下雨。那页纸被你贴身收着，字迹洇开一点，仍能看清。","res");
  curNode='p12_a_debtor'; writeNext();
}},
{t:"问他为什么信得过一个陌生人",check:{a:"CHA",sk:"persu",label:"问账"},tier:{
  ok:["文森笑了：“金衡商会记的账，从来不看人来的是哪一面。你进门不问价，不问货，先问人——这一条，够我记你一笔了。”","他把那页纸也推过来：顺路的话，替我走一趟。”"],
  fail:["文森摇了摇头：“想套金衡商会的账，你找错人了。”他把那页纸收回去，“这笔账，我另找人走。”","你没能接下这份人情账——但至少，他记住了你这个问过账的人。"],
  crit:["文森盯着你看了很久，忽然把账本合上：“有意思。”他重新推过那页纸，“十年了，你是第一个问我'为什么信'的。”","“冲这句话，这页纸给你。走不走，随你。”"]
},go:"p12_a_debtor"}
]};
N["p12_a_debtor"]={place:"河湾城 · 城东船坞",where:"白昼",text:[
"河湾城的城东船坞，比十年前败落了许多。船台上只有一条修补过半的旧船，龙骨上钉着新木，颜色深浅不一。",
"韩老铁匠蹲在船台下，拿锉刀修一枚旧铆钉。他头发花白，手上的茧子厚得像树皮。你递上那页纸，他看了很久。",
"“文森……”他念了一遍这个名字，忽然不说话了。半晌，他哑着嗓子说：“那年饥荒，我家六个孩子，饿哭了五个。文森让人送来的粮，够吃到开春。”",
"“这条船，是给他修的。”老铁匠摸着船板，“修了十年，修修停停——我怕修好了，他还记着这事，我就欠不起了。”"
],options:[
{t:"替文森垫上这笔修船钱，让老铁匠把船修完",run:function(){
  S.gold=(S.gold||0)-30; if(S.gold<0) S.gold=0;
  changeRelation('lv_trade1',20,'代金秤垫付修船钱');
  S.p12Quest.a=3;
  writePar("你把钱袋放在船台上：“文森总会长说，这船，该修完了。”","res");
  writePar("老铁匠看着那袋钱，嘴唇动了动，没说出话来。他蹲下去，把脸埋进船板里，肩膀一耸一耸的。","res");
  writePar("你走出船坞时，身后传来锉刀的声音——比先前，有力多了。","res");
  curNode='p12_a_end'; writeNext();
}},
{t:"只替文森传话，不垫钱",run:function(){
  changeRelation('lv_trade1',10,'替金秤传话');
  S.p12Quest.a=3;
  writePar("你把话带到：文森不要他还钱，只要他记得。","res");
  writePar("老铁匠点了点头，看着船，很久没说话。末了他低声说：“记得的。这条船修完，我给它起个名字，叫……记恩。”","res");
  curNode='p12_a_end'; writeNext();
}}
]};
N["p12_a_end"]={place:"自由城邦 · 金衡商会",where:"白昼",text:[
"你回到金衡商会时，文森正在给一杆新秤校星。他听你讲完河湾城的事，手里的活没停，过了好一会儿，才开口。",
"“十年前，我免那三百户的债，没想过要他们还。”他搁下秤，“但今天，你替我把这页账，翻过去了。”",
"他拉开抽屉，取出一枚铜秤坠，递给你：“金衡商会，认秤不认人。这枚坠子，是从第一杆总秤上拆下来的。”",
"“拿着。以后在金衡商会的地界，你说话，跟我说话，一样。”"
],options:[
{t:"接过铜秤坠，道谢",run:function(){
  changeRelation('lv_trade1',20,'金秤人情账结清');
  S.p12Quest.a=4;
  S.gold=(S.gold||0)+50; S.exp=(S.exp||0)+30;
  if(!S.items) S.items={}; S.items['jinheng_mark']=(S.items['jinheng_mark']||0)+1;
  var rel=S.npcRelations&&S.npcRelations['lv_trade1']||0;
  var lvlTxt=rel>=60?'挚友':rel>=40?'朋友':'熟人';
  if(rel>=60){ try{ triggerRelationEvent('lv_trade1','close_friend'); }catch(e){} }
  writePar("你接过那枚铜秤坠。入手微沉，坠子上刻着一杆极小的秤，秤盘上，一边是“进”，一边是“出”。","res");
  writePar("文森看着你，忽然说：“人情这本账，我记了你十年后这一笔。”他顿了顿，“值。”","res");
  writePar("你与文森·金秤的关系，如今已是"+lvlTxt+"。金衡商会的大门，为你敞开。","res");
  writePar("（获得：金秤铜坠 · 50 金币 · 30 历练）","res");
  curNode='fc_streets'; writeNext();
}}
]};
N["p12_b_enter"]={place:"铁门关 · 城头",where:"暮色",text:[
"你花了半天工夫，才说动城门校尉替你传话。日落时分，你被领上城头——秦·长风正在那儿，单手扶枪，望着关外的暮色。",
"他的左臂是一截乌沉沉的木臂，接在断口处，打磨得很光滑。你说明来意，他转过来看你，目光像关外的风，冷，但不伤人。",
"“找我的人不多。”他说，“找我的，要么想借镇北军的名头，要么想打听东军的动向。你是哪一种？”",
"他说话时，右手一直没离开枪杆。城头的风，把他鬓角的白发吹起来，又落下。"
],options:[
{t:"说明来意：久闻铁门关七日之名，特来结识",run:function(){
  changeRelation('lv_war3',10,'结识镇北军统领秦·长风');
  S.p12Quest=S.p12Quest||{a:0,b:0,c:0}; if(S.p12Quest.b<1) S.p12Quest.b=1;
  writePar("你提起铁门关七日。秦·长风沉默了一会儿，说：“那七天，是城里的老兵替我记着的。”","res");
  writePar("“我记性不好。”他低头看了一眼木臂，“该记的事，得找个地方，记下来。”","res");
  writePar("他请你下城头喝碗热汤——城头风大，不是说话的地方。","res");
  curNode='p12_b_arm'; writeNext();
}}
]};
N["p12_b_arm"]={place:"铁门关 · 营房",where:"夜",text:[
"秦·长风的营房很简陋。一张行军床，一张桌子，墙上挂着一杆旧枪。他给你盛了碗热汤，汤里浮着几片干菜叶。",
"他坐下时，木臂磕在桌沿上，发出一声闷响。你注意到，木臂肘部的衬垫磨薄了，露出下面的木纹。",
"“断了左臂那年，我二十五岁。”他忽然说，“铁门关七日，我拿右手使枪，守到第七天，东军退了。”",
"“后来军里的匠人给我打了这条木臂。”他动了动左手，“好用，就是到冬天，冷。”"
],options:[
{t:"提出帮他换一截新的衬垫",run:function(){
  S.gold=(S.gold||0)-15; if(S.gold<0) S.gold=0;
  changeRelation('lv_war3',15,'为秦·长风换木臂衬垫');
  S.p12Quest.b=2;
  writePar("你从行囊里翻出一块皮料，替他裁了一截衬垫。秦·长风看着你忙活，没有拒绝。","res");
  writePar("换好后，他活动了一下左臂，忽然说：“上次有人替我收拾这条木臂，还是三年前，军里的老匠人。”","res");
  writePar("他顿了顿：“他那年，殁在铁门关外。”","res");
  curNode='p12_b_name'; writeNext();
}},
{t:"问他木臂里藏着什么",check:{a:"CHA",sk:"detect",label:"探问"},tier:{
  ok:["秦·长风看了你一眼，没有否认：“你眼睛尖。”他低头看着木臂，“里面是有一张纸——写着一个人的名字。”","“我欠她的，这辈子还不清了。”"],
  fail:["秦·长风摇了摇头：“镇北军的统领，没什么藏得住的东西。你看错了。”他岔开话头，谈起了关外的天气。"],
  crit:["你不但问出了那张纸，还从他话里听出了更多：那个名字的主人，是北方军当年的一名军医——城破那夜，她没能撤出来。","秦·长风说完，很久没有说话。"]
},go:"p12_b_name"}
]};
N["p12_b_name"]={place:"铁门关 · 城头夜",where:"夜",text:[
"夜里，秦·长风又上了城头。你跟着上去。关外的旷野黑沉沉的，偶尔有狼嚎远远传来。",
"他站在垛口边，很久才开口：“她叫素云。北方军的军医，手很稳，包扎从来不疼。”",
"“城破那夜，她本该随老弱先撤。”他的声音平得像在说别人的事，“她没走。她说，伤兵还躺在城下，她走了，谁管他们。”",
"“后来，东军破城，她没出来。”他低头看自己的木臂，“我这条命，是她换的。”"
],options:[
{t:"问他可要替她带句话",run:function(){
  changeRelation('lv_war3',20,'替秦·长风了却一桩心事');
  S.p12Quest.b=3;
  writePar("你问他要不要带句话。秦·长风看着关外的夜色，想了很久。","res");
  writePar("“不用带。”他最后说，“她要是还在，就知道我守在这儿。她要是……不在了，也该知道，我守着她守过的城。”","res");
  writePar("他抬手，从木臂里取出那张折得整整齐齐的纸，递给你：“你看一眼。就一眼。”","res");
  curNode='p12_b_end'; writeNext();
}},
{t:"告诉他：素云当年救过的伤兵，有人还活着，在城东开了间药铺",run:function(){
  changeRelation('lv_war3',20,'告知素云旧部下落');
  S.p12Quest.b=3;
  writePar("秦·长风猛地转过头看你，木臂磕在城砖上，发出一声脆响。","res");
  writePar("你告诉他，城东药铺的坐堂大夫，是素云当年亲手从死人堆里拖出来的伤兵。他每年清明，都往北烧一沓纸钱。","res");
  writePar("秦·长风沉默了很久。风从关外吹来，他忽然说：“她救的人，还记着她。”","res");
  writePar("他抬手指了指自己的左胸：“我也记着。”","res");
  curNode='p12_b_end'; writeNext();
}}
]};
N["p12_b_end"]={place:"铁门关 · 关下",where:"黎明",text:[
"天快亮的时候，你准备动身离开铁门关。秦·长风送至关下，手里提着一坛酒。",
"“铁门关没什么好东西。”他把酒递给你，“这一坛，是去年老兵们凑的，埋在城根下三年。你带着，路上喝。”",
"他站在晨光里，木臂垂在身侧。你忽然觉得，这座城之所以叫“铁门关”，不是因为城门是铁的，是因为守城的人，是铁的。",
"“走吧。”他说，“城在，我在。你什么时候路过，上来喝碗热汤。”"
],options:[
{t:"接过酒坛，与他道别",run:function(){
  changeRelation('lv_war3',20,'铁门关之约');
  S.p12Quest.b=4;
  S.gold=(S.gold||0)+40; S.exp=(S.exp||0)+30;
  if(!S.items) S.items={}; S.items['tiemen_wine']=(S.items['tiemen_wine']||0)+1;
  var rel=S.npcRelations&&S.npcRelations['lv_war3']||0;
  var lvlTxt=rel>=60?'挚友':rel>=40?'朋友':'熟人';
  if(rel>=60){ try{ triggerRelationEvent('lv_war3','close_friend'); }catch(e){} }
  writePar("你接过酒坛，入手很沉。坛身粗糙，没有标签，像这城里的每一个人——不讲究，但实在。","res");
  writePar("秦·长风目送你走远。晨光把他和身后的铁门关，镀成一个颜色。","res");
  writePar("你与秦·长风的关系，如今已是"+lvlTxt+"。铁门关的城门，认得你的脸。","res");
  writePar("（获得：铁门关陈酿 · 40 金币 · 30 历练）","res");
  curNode='east_tiemen_after'; writeNext();
}}
]};
N["p12_c_enter"]={place:"港口城 · 断江酒馆",where:"黄昏",text:[
"断江酒馆在港口城的老码头边上。招牌是一块旧船板，上面用火烙着两个字：断江。",
"你推门进去。酒馆不大，几张桌子，靠海的窗边坐着一排水手。柜台后站着一个壮汉，正拿抹布擦一只杯子——擦得很慢，很仔细，像在擦一件兵器。",
"他看见你，放下杯子：“生面孔。喝什么？”",
"他说话的时候，你看见酒馆的房梁上，插着一杆旧枪。枪尖朝海，擦得锃亮。"
],options:[
{t:"在柜台前坐下，点一杯酒",run:function(){
  changeRelation('lv_war5',10,'结识断江酒馆老板罗·断江');
  S.p12Quest=S.p12Quest||{a:0,b:0,c:0}; if(S.p12Quest.c<1) S.p12Quest.c=1;
  writePar("你点了杯酒。他给你倒满，自己也不闲着，又擦起另一只杯子。","res");
  writePar("“我叫罗·断江。”他说，“这间酒馆，是我退役后开的。”","res");
  writePar("他朝房梁上的旧枪努了努嘴：“那杆枪，跟了我半辈子。现在挂在那儿，看海。”","res");
  curNode='p12_c_tale'; writeNext();
}}
]};
N["p12_c_tale"]={place:"港口城 · 断江酒馆",where:"夜",text:[
"入夜后，酒馆里的水手渐渐散了。罗·断江给自己倒了一杯，在你对面坐下。",
"“年轻的时候，我在南方当海卫。”他说，“有一年，一条满装的江船被海盗劫了，船上三十七口人，绑在桅杆上。”",
"“我一人一枪，拦在江面上。”他抿了一口酒，“那一仗打完，我身上添了七道疤，船上三十七口人，一个不少。”",
"“后来，封侯拜将的文书送到我手上。”他把杯子放下，“我没接。我打够了——这条江，我守过，就够了。”"
],options:[
{t:"敬他一杯，听他讲完",run:function(){
  changeRelation('lv_war5',15,'听断江讲守江旧事');
  S.p12Quest.c=2;
  writePar("你举起杯，敬他。他愣了一下，也举起来，跟你碰了一下。","res");
  writePar("“这么多年，你是第一个听完不劝我'该回去领那份富贵'的人。”他说，“就冲这个，这杯酒，我请你。”","res");
  writePar("窗外传来海浪声。他朝房梁上的旧枪看了一眼：“那枪，我留着——留给将来守海的人。”","res");
  curNode='p12_c_watch'; writeNext();
}},
{t:"问那把枪为什么枪尖朝海",check:{a:"INT",sk:"lore",label:"问枪"},tier:{
  ok:["罗·断江笑了：“枪尖朝海，是告诉海里的东西——这杆枪，还没锈。”","“我在等一个能接枪的人。等不到，枪就挂那儿，替我守着这片海。”"],
  fail:["罗·断江摇了摇头：“枪的事，说来话长。今晚海风好，喝酒。”"],
  crit:["你看出那杆枪的来历：枪杆上的缠绳，是海卫军的制式——而那磨损的护手，至少经历了二十年的握持。","“好眼力。”罗·断江第一次露出认真的神色，“这枪，等它真正的主人，等了五年了。”"]
},go:"p12_c_watch"}
]};
N["p12_c_watch"]={place:"港口城 · 老码头",where:"深夜",text:[
"后半夜，酒馆快打烊时，码头方向传来一阵喧哗。一个水手连滚带爬地冲进来：“断江！码头来了帮人，正砸咱们的船！”",
"罗·断江放下杯子，起身。他朝房梁上看了一眼——那杆旧枪静静地躺着，没有动。",
"“走，看看去。”他说。你站起来，跟在他身后。"
],options:[
{t:"陪他一起去码头守到天亮",run:function(){
  changeRelation('lv_war5',20,'陪断江守码头');
  S.p12Quest.c=3;
  writePar("码头上，七八个泼皮正围着一条渔船，砸舱板、掀渔网。罗·断江没有用枪——他空着手，三拳两脚，把领头的撂翻在船板上，剩下的夺路而逃。","res");
  writePar("你帮着船家把舱板钉回去，把渔网拢好。罗·断江揉着肩膀，忽然笑了：“能动手的，不用动枪。”","res");
  writePar("这一夜，你们并肩站在老码头上，直到天亮。海平线泛起鱼肚白时，他望着海面，轻声说：“这么多年，还是第一次有人，跟我一起守夜。”","res");
  curNode='p12_c_end'; writeNext();
}}
]};
N["p12_c_end"]={place:"港口城 · 断江酒馆",where:"黎明",text:[
"天亮后，你们回到酒馆。罗·断江烧了壶水，给你倒了杯茶。他坐在柜台后，看了你很久。",
"“昨天你说，我讲完那仗，你是第一个不劝我回去领富贵的。”他说，“今天你陪我在码头上站了一夜，你是第一个跟我一起守夜的人。”",
"他站起来，走到房梁下。那杆旧枪静静地躺了五年。他伸手，把它取了下来。",
"“枪是死的，人是活的。”他把枪横在你面前，“我守了它半辈子，它该换个主人了。”"
],options:[
{t:"郑重接过旧枪",run:function(){
  changeRelation('lv_war5',20,'接掌断江旧枪');
  S.p12Quest.c=4;
  S.gold=(S.gold||0)+30; S.exp=(S.exp||0)+40;
  if(!S.items) S.items={}; S.items['duanjiang_spear']=(S.items['duanjiang_spear']||0)+1;
  var rel=S.npcRelations&&S.npcRelations['lv_war5']||0;
  var lvlTxt=rel>=60?'挚友':rel>=40?'朋友':'熟人';
  if(rel>=60){ try{ triggerRelationEvent('lv_war5','close_friend'); }catch(e){} }
  writePar("你双手接过那杆枪。入手比想象中沉，枪杆上的缠绳，被汗浸透又风干，硬得像铁。","res");
  writePar("罗·断江看着你把枪握稳，点了点头：“从今天起，海上有事，你替我看一眼。”","res");
  writePar("你与罗·断江的关系，如今已是"+lvlTxt+"。断江酒馆的房梁上，从此少了一杆枪，多了一个念想。","res");
  writePar("（获得：断江旧枪 · 30 金币 · 40 历练）","res");
  curNode='gangkou_ships'; writeNext();
}}
]};
/* /p12inj:quests-end/ */
'''

# ============ 入口选项 ============
# A 入口：fc_streets（script_02b.js）——options 数组开头
A_ENTRY_ANCHOR = 'options:[\n{t:"去集市", go:"fc_market"},'
A_ENTRY = '{t:"去金衡商会拜访总会长", go:"p12_a_enter"},\n'

# B 入口：arrive_east_tiemen（script_02.js）——options 数组开头
B_ENTRY_ANCHOR = 'options:[\n    {t:"趁夜靠近那段'
B_ENTRY = '{t:"设法进城，求见镇北军统领秦·长风", go:"p12_b_enter"},\n    '

# C 入口：gangkou_ships（script_02.js）
C_ENTRY_ANCHOR = 'options:['
C_ENTRY = '{t:"去断江酒馆坐坐", go:"p12_c_enter"},'

# ============ applyDefaults 兜底 ============
DEFAULTS_ANCHOR = 'if(!s._endingRecorded) s._endingRecorded=false;'
DEFAULTS_ADD = '\n  /* /p12inj:defaults/ P1-2 好感支线进度兜底（旧档兼容） */\n  if(!s.p12Quest) s.p12Quest={a:0,b:0,c:0};'

def main():
    changed = []
    # 1) script_02.js：追加支线节点块（幂等：锚点已有则跳过）
    p = os.path.join(SRC, 'script_02.js')
    t = read(p)
    if '/p12inj:quests/' in t:
        print('script_02.js: 支线节点块已存在，跳过')
    else:
        t = t.rstrip() + '\n' + QUESTS + '\n'
        write(p, t)
        changed.append('script_02.js +12 节点')

    # 2) script_02b.js：fc_streets 入口
    p = os.path.join(SRC, 'script_02b.js')
    t = read(p)
    if '/p12inj:a-entry/' in t:
        print('script_02b.js: A 入口已存在，跳过')
    else:
        t2, ok = insert_after(t, A_ENTRY_ANCHOR, ' /* /p12inj:a-entry/ */\n' + A_ENTRY, '/p12inj:a-entry/')
        if ok:
            write(p, t2); changed.append('script_02b.js fc_streets +金衡商会入口')
        else:
            print('!! A 入口锚点未命中')

    # 3) script_02.js：arrive_east_tiemen 入口（限定节点内第一个 options:[）
    p = os.path.join(SRC, 'script_02.js')
    t = read(p)
    if '/p12inj:b-entry/' in t:
        print('script_02.js: B 入口已存在，跳过')
    else:
        i = t.find('N["arrive_east_tiemen"]')
        if i >= 0:
            j = t.find('options:[', i)
            if j >= 0:
                k = j + len('options:[')
                t2 = t[:k] + ' /* /p12inj:b-entry/ */\n    {t:"设法进城，求见镇北军统领秦·长风", go:"p12_b_enter"},\n    ' + t[k:]
                write(p, t2); changed.append('script_02.js arrive_east_tiemen +秦长风入口')
            else:
                print('!! arrive_east_tiemen options 未命中')
        else:
            print('!! arrive_east_tiemen 节点未找到')

    # 4) script_02.js：gangkou_ships 入口（用唯一锚点）
    p = os.path.join(SRC, 'script_02.js')
    t = read(p)
    if '/p12inj:c-entry/' in t:
        print('script_02.js: C 入口已存在，跳过')
    else:
        # gangkou_ships 的 options 数组——找该节点内第一个 options:[
        i = t.find('N["gangkou_ships"]')
        if i >= 0:
            j = t.find('options:[', i)
            if j >= 0:
                k = j + len('options:[')
                t2 = t[:k] + ' /* /p12inj:c-entry/ */\n    ' + C_ENTRY + '\n    ' + t[k:]
                write(p, t2); changed.append('script_02.js gangkou_ships +断江酒馆入口')
            else:
                print('!! gangkou_ships options 未命中')
        else:
            print('!! gangkou_ships 节点未找到')

    # 5) script_03.js：applyDefaults 兜底
    p = os.path.join(SRC, 'script_03.js')
    t = read(p)
    if '/p12inj:defaults/' in t:
        print('script_03.js: 兜底已存在，跳过')
    else:
        t2, ok = insert_after(t, DEFAULTS_ANCHOR, DEFAULTS_ADD, '/p12inj:defaults/')
        if ok:
            write(p, t2); changed.append('script_03.js applyDefaults +p12Quest')
        else:
            print('!! defaults 锚点未命中')

    print('\n改动：', changed if changed else '无')

if __name__ == '__main__':
    main()
