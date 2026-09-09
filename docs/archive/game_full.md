Read "D:\1pao tuan\群雄割据\game.html":

   156	/* ==================================================================
   157	   艾尔达大陆：群雄割据 —— 单文件文字MUD
   158	   世界观依据：D:\1pao tuan\gushi\ 艾尔达大陆设定库
   159	   规则：d100 六档判定（大成功01 / 极成功≤目标1/5 / 困难成功≤目标1/2 / 普通成功≤目标 / 失败 / 大失败=100或目标<50时≥96）
   160	   ruleset_id：elda-qunxiong-v1
   161	   ================================================================== */
   162	const RULESET_ID = "elda-qunxiong-v1";
   163	const ATTRS = ["SPR","STR","AGI","INT","CHA","CON"];
   164	const ATTR_CN = {SPR:"灵魂强度",STR:"力量",AGI:"敏捷",INT:"智力",CHA:"魅力",CON:"体质"};
   165	const ATTR_DESC = {SPR:"灵魂感知·精神抵抗·SAN上限",STR:"近战·负重·破门·攀爬",AGI:"闪避·潜行·盗窃·反应",INT:"学识·法术·推理·鉴定",CHA:"说服·欺骗·表演·交易",CON:"生命·毒抗·疾病·耐力"};
   166	
   167	const SKILLS = {
   168	  magic:{cn:"法术"},martial:{cn:"武技"},soul:{cn:"灵魂"},divine:{cn:"神术"},
   169	  stealth:{cn:"潜行"},trade:{cn:"商术"},alchemy:{cn:"炼金"},
   170	  persu:{cn:"说服"},detect:{cn:"侦查"},lore:{cn:"学识"},bargain:{cn:"交易"},
   171	  survive:{cn:"生存"},athletic:{cn:"运动"},heal:{cn:"医疗"},will:{cn:"意志"}
   172	};
   173	const SKILL_LEVELS = [["未受训",0],["入门",10],["熟练",20],["精通",30],["大师",40],["传奇",50]];
   174	
   175	/* ============ 七大职业（47号·30号权威数据） ============ */
   176	const JOBS = {
   177	  "魔法师":{
   178	    cn:"魔法师",deity:"魔法·奥术神系（魔法之神约2000年前陨落）",
   179	    criterion:"知识即力量",vow:"戒律：求知求真、不得垄断知识、魔法须可验证",
   180	    domain:"元素 / 奥术 / 召唤",power:"艾尔达魔法学院 · 元素学派",
   181	    skill:"magic",attr:"INT",
   182	    anchor:"锚点：将一条元素法则刻入魔网某一层，使它在你不存在时依旧自行运转",
   183	    desc:"操纵风火水土与奥术之力。追求真理，以论证撼动世界。弱者握卷，强者握法，最强者握法则。",
   184	    titles:["魔法学徒","初阶法师","中阶法师","高阶法师","大法师","元素领主","元素贤者","元素神祇","元素创世神"],
   185	    mats:["初级元素结晶","中级元素结晶","高级元素结晶","大师级元素结晶","领主级元素核心","贤者之石","元素神格雏形","完整元素神格"],
   186	    potions:["元素亲和药剂","元素之心","元素法则碎片","元素法则结晶","完整元素法则","信仰之力结晶","世界本源"],
   187	    books:[["《元素魔法基础》","《魔法理论入门》"],["《元素融合理论》","《高级魔法应用》"],["《元素领域导论》","《魔法本质研究》"],["《元素法则初探》","《魔网深层结构》"],["《元素法则精通》","《位面元素理论》"],["《元素法则本源》","《创世元素理论》"],["《神格基础》","《信仰之力运用》"],["《创世法则》","《世界本质》"]],
   188	    workDesc:"贤者之石：将一条完整的元素法则炼成一颗可视之石。石中流转的，是你毕生证明过的真理。"
   189	  },
   190	  "战士":{
   191	    cn:"战士",deity:"战士·战神神系（战神约3000年前陨落）",
   192	    criterion:"勇气与荣誉",vow:"戒律：直面强敌、守护弱小、战场之上不退缩",
   193	    domain:"力量 / 狂怒 / 战争",power:"铁壁武道院 · 圣光骑士团 · 战士公会",
   194	    skill:"martial",attr:"STR",
   195	    anchor:"锚点：以一面万人阵前立誓的战旗为锚，让荣辱与一场战争同沉浮",
   196	    desc:"以血气淬体，以斗气破敌。战场是唯一的道场，刀锋是唯一的语言。荣誉即生命。",
   197	    titles:["壮丁","战士","精锐战士","武道大师","武道宗师","武圣","武神","战神","战争创世神"],
   198	    mats:["低级兽血","中级兽核","高级兽核","大师级兽核","圣级兽核","武神之心","战争神格雏形","完整战争神格"],
   199	    potions:["斗气修炼药剂","武道意志结晶","武道法则碎片","武道法则结晶","完整力量法则","信仰之力结晶","世界本源"],
   200	    books:[["《基础武道》","《武器使用入门》"],["《斗气基础》","《战术入门》"],["《武道意志》","《高级战术》"],["《武道法则初探》","《战争艺术》"],["《武道法则精通》","《生命之力运用》"],["《力量法则本源》","《武道极致》"],["《神格基础》","《战争法则》"],["《创世法则》","《战争本质》"]],
   201	    workDesc:"武神之心：将万千战场的杀气与荣誉凝成一颗跳动的心。每一次搏动，都是你直面强敌的证明。"
   202	  },
   203	  "灵魂法师":{
   204	    cn:"灵魂法师",deity:"灵魂·心灵神系（无神明，自创半神奥雷利安·晨曦）",
   205	    criterion:"先识己，后识人",vow:"戒律：不窥无心之秘、不触灵魂禁忌（复活/夺舍）",
   206	    domain:"灵魂 / 催眠 / 通灵",power:"灵法学派 · 美第奇家族",
   207	    skill:"soul",attr:"SPR",
   208	    anchor:"锚点：以灵魂深处一处无人触碰的记忆为锚，永不向任何人吐露",
   209	    desc:"禁忌之道。看见人心最深处的真相，也因此被教会与世人畏惧。修道者皆短寿，因灵魂之力以生命为薪。",
   210	    titles:["灵魂感知者","灵魂学徒","灵魂术士","灵魂法师","灵魂大师","灵魂领主","灵魂贤者","灵魂神祇","灵魂创世神"],
   211	    mats:["低级灵魂结晶","中级灵魂结晶","高级灵魂结晶","大师级灵魂结晶","领主级灵魂核心","贤者之魂","灵魂神格雏形","完整灵魂神格"],
   212	    potions:["精神力增强药剂","灵魂之心","灵魂法则碎片","灵魂法则结晶","完整意识法则","信仰之力结晶","世界本源"],
   213	    books:[["《灵魂魔法基础》","《精神力运用入门》"],["《灵魂结构理论》","《精神攻击入门》"],["《灵魂深层结构》","《精神控制理论》"],["《灵魂法则初探》","《亡灵世界导论》"],["《灵魂法则精通》","《灵界深层结构》"],["《意识法则本源》","《灵魂终极奥秘》"],["《神格基础》","《灵魂网络运用》"],["《创世法则》","《灵魂本质》"]],
   214	    workDesc:"贤者之魂：在灵魂层面完成对自我的彻底超越，凝出一点不灭的魂光。它比血肉更接近永恒。"
   215	  },
   216	  "牧师":{
   217	    cn:"牧师",deity:"圣职·光明神系（太阳神在位）",
   218	    criterion:"信仰与牺牲",vow:"戒律：不质疑神谕、不见死不救、不与堕落者为伍",
   219	    domain:"光明 / 生命 / 秩序",power:"圣光教会 · 财富之神教",
   220	    skill:"divine",attr:"SPR",
   221	    anchor:"锚点：以一座亲手奠基的教堂为锚，让圣光在你不念诵时也自行流淌",
   222	    desc:"以圣光净化污秽，以神术治愈创伤。力量源于信仰，代价是交出质疑的权利。",
   223	    titles:["信徒","见习牧师","正式牧师","高阶牧师","主教","大主教","圣者","圣徒","神祇"],
   224	    mats:["低级神圣结晶","中级神圣结晶","高级神圣结晶","大师级神圣结晶","大主教级神圣核心","圣者之心","圣徒神格雏形","完整神圣神格"],
   225	    potions:["圣水","神恩药剂","神圣之心","神圣法则碎片","神圣法则结晶","完整信仰法则","信仰之力结晶","世界本源"],
   226	    books:[["《神圣圣经》","《基础神术理论》"],["《中级神术理论》","《诅咒学入门》"],["《高级神术理论》","《神圣领域导论》"],["《神圣法则初探》","《生死边界研究》"],["《神圣法则精通》","《神术运用》"],["《信仰法则本源》","《神圣极致》"],["《神格基础》","《神圣国度建立》"],["《创世法则》","《信仰本质》"]],
   227	    workDesc:"圣者之心：以一桩无人能证伪的大圣迹，在人间留下属于你的神之印记。"
   228	  },
   229	  "盗贼":{
   230	    cn:"盗贼",deity:"暗影·隐秘神系（神位空缺）",
   231	    criterion:"存在即隐匿",vow:"戒律：事成拂衣去、不暴露身份、守口如瓶",
   232	    domain:"暗杀 / 窃取 / 伪装",power:"暗影阁 · 盗贼公会 · 黑蔷薇骑士团",
   233	    skill:"stealth",attr:"AGI",
   234	    anchor:"锚点：以一场无人知晓的完美隐匿为锚，让“不存在”本身成为你的名字",
   235	    desc:"行走于阴影与人间缝隙。大宗师已是暗影之巅，暗影无神庇佑，却也因此无人能束缚。",
   236	    titles:["小偷","盗贼","大盗","盗贼大师","盗圣","暗影领主","暗影贤者","暗影神祇","暗影创世神"],
   237	    mats:["低级暗影结晶","中级暗影结晶","高级暗影结晶","大师级暗影结晶","领主级暗影核心","贤者之影","暗影神格雏形","完整暗影神格"],
   238	    potions:["潜行药剂","暗影亲和药剂","暗影之心","暗影法则碎片","暗影法则结晶","完整隐匿法则","信仰之力结晶","世界本源"],
   239	    books:[["《潜行基础》","《暗杀入门》"],["《暗影融入理论》","《灵魂暗杀入门》"],["《暗影穿梭理论》","《精神暗杀入门》"],["《暗影法则初探》","《暗影空间理论》"],["《暗影法则精通》","《暗影化身理论》"],["《隐匿法则本源》","《暗影极致》"],["《神格基础》","《暗杀网络运用》"],["《创世法则》","《暗影本质》"]],
   240	    workDesc:"贤者之影：完成一场无人知晓的完美消失。从此你可以在所有人的记忆里隐去。"
   241	  },
   242	  "商人":{
   243	    cn:"商人",deity:"财富·商业神系（财富之神在位）",
   244	    criterion:"等价交换",vow:"戒律：契约必守、明码标价、不恃强夺（可智取）",
   245	    domain:"契约 / 黄金 / 门路",power:"金秤家族 · 财富之神教 · 商人公会",
   246	    skill:"trade",attr:"CHA",
   247	    anchor:"锚点：以一条亲手贯通的商路为锚，让等价交换在你不经手时也自动运转",
   248	    desc:"以契约丈量人心，以黄金撬动国运。不义之财终遭反噬，等价交换才是万物的天平。",
   249	    titles:["小贩","商人","富商","商业大师","商业宗师","财富领主","财富贤者","财富神祇","财富创世神"],
   250	    mats:["低级财富结晶","中级财富结晶","高级财富结晶","大师级财富结晶","领主级财富核心","贤者之金","财富神格雏形","完整财富神格"],
   251	    potions:["金秤药剂","财富增强药剂","财富之心","财富法则碎片","财富法则结晶","完整等价法则","信仰之力结晶","世界本源"],
   252	    books:[["《商业基础》","《等价交换理论入门》"],["《不等价交换理论》","《财富祝福入门》"],["《强制交换理论》","《财富诅咒入门》"],["《财富法则初探》","《商业空间理论》"],["《财富法则精通》","《经济操控理论》"],["《等价法则本源》","《财富极致》"],["《神格基础》","《商业神国建立》"],["《创世法则》","《财富本质》"]],
   253	    workDesc:"贤者之金：完成一桩以概念为代价的交易，让契约本身成为法则的锚点。"
   254	  },
   255	  "炼金术师":{
   256	    cn:"炼金术师",deity:"锻造·工匠神系（锻造之神陨落，传承半神矮人王索林·铁须）",
   257	    criterion:"创造与完美",vow:"戒律：技艺精益求精、所铸须可堪其用、不铸邪器",
   258	    domain:"锻造 / 炼金 / 魔械",power:"炼金学派 · 魔械学院 · 发明家协会",
   259	    skill:"alchemy",attr:"INT",
   260	    anchor:"锚点：以一件会自行运转的作品为锚，让“创造”脱离你的手也能活着",
   261	    desc:"把凡铁炼成神兵，把物质转化为真理。万物的本质皆可被理解，理解之后，皆可被重塑。",
   262	    titles:["学徒","炼金术师","中级炼金术师","高级炼金术师","炼金大师","炼金领主","知识贤者","知识神祇","知识创世神"],
   263	    mats:["低级炼金结晶","中级炼金结晶","高级炼金结晶","大师级炼金结晶","领主级炼金核心","贤者之石","知识神格雏形","完整知识神格"],
   264	    potions:["基础工具","中级工具","炼金之心","炼金法则碎片","炼金法则结晶","完整真理法则","信仰之力结晶","世界本源"],
   265	    books:[["《炼金术基础》","《物质转化入门》"],["《中级炼金术》","《复杂魔法物品制作》"],["《高级炼金术》","《精密魔法物品制作》"],["《炼金法则初探》","《新符文创造》"],["《炼金法则精通》","《认知改变理论》"],["《真理法则本源》","《知识极致》"],["《神格基础》","《知识神国建立》"],["《创世法则》","《知识本质》"]],
   266	    workDesc:"贤者之石：揭示一条从未有人证明的世界真相，并以实物将其固定为永恒。"
   267	  }
   268	};
   269	
   270	/* ============ 九大境界（30号权威数据） ============ */
   271	const REALMS = [
   272	  {cn:"凡人境",xp:0,hp:100,desc:"凡人。一介草芥，命如纸薄，也如纸韧。"},
   273	  {cn:"启灵境",xp:100,hp:120,desc:"初阶。第一次感应到职业的力量，世界的门开了一条缝。"},
   274	  {cn:"凝元境",xp:300,hp:150,desc:"中阶。领悟职业真意，力量成形，可独立行走于险地。"},
   275	  {cn:"化意境",xp:800,hp:190,desc:"高阶。知行合一，个人风格成型，地方上已有你的名字。"},
   276	  {cn:"宗师境",xp:2000,hp:240,desc:"大师。领域独立，一方人物，举手投足皆是道。"},
   277	  {cn:"大宗师境",xp:5000,hp:300,desc:"大宗师。国之重器，大陆名人，一言可动国策。"},
   278	  {cn:"传奇境",xp:12000,hp:380,desc:"传奇。历史留名，大陆顶尖，你的传说开始被吟游诗人传唱。"},
   279	  {cn:"半神境",xp:30000,hp:500,desc:"半神。超然于国度之上，一怒而山河变色，屈指可数。"},
   280	  {cn:"神话境",xp:80000,hp:700,desc:"神话。取代或继承神位，你即是法则本身。"}
   281	];
   282	/* 名额机制（45号）：宗师300-500 / 大宗师60-80 / 传奇20-25 / 半神8-9 */
   283	
   284	/* ============ 大陆地图（3号·50号·51号权威坐标） ============ */
   285	const REGIONS = {
   286	  free:{cn:"自由城邦",x:0,y:0,color:"#7fb4d6",desc:"大陆正中的中立地带。法律宽松，金币至上，冒险者与阴谋家的天堂。",terrain:"平原",unlock:true,cities:{
   287	    jiaohui:{cn:"交汇城",x:0,y:0,desc:"大陆十字路口。商队、难民、冒险者在此交汇，也在此失散。"},
   288	    jishi:{cn:"集市城",x:0,y:-50,desc:"自由城邦的商业心脏，白昼是集市，入夜是另一种集市。"},
   289	    gonghui:{cn:"冒险者之城",x:80,y:0,desc:"联合冒险者公会的总部所在，刀口舔血者的圣城。"},
   290	    huigang:{cn:"灰港",x:0,y:-150,desc:"内河港。船帆如林，走私与正经生意共用同一条水道。"}
   291	  }},
   292	  north:{cn:"北方公国联盟",x:0,y:350,color:"#8fb4d6",desc:"七公国共治的联邦。冰原、铁甲与魔法学院，正被东方的兵锋与草原的蹄声夹击。",terrain:"平原",unlock:true,cities:{
   293	    aierda:{cn:"艾尔达城",x:0,y:350,desc:"联盟盟主之都。艾尔达魔法学院高踞山丘，是大陆最古老的知识圣地。"},
   294	    tiebi:{cn:"铁壁城",x:200,y:550,desc:"军事最强公国。城墙三重，兵甲如林，直面东方威胁的第一道防线。"},
   295	    beijing:{cn:"北境城",x:100,y:900,desc:"大陆最北的雄城。终年积雪，冰狼出没，是兽人南下的首当其冲。"},
   296	    kuangshan:{cn:"矿山城",x:-450,y:550,desc:"矿业中心。铁与煤从地底涌出，铸成联盟的筋骨。"},
   297	    hewan:{cn:"河湾城",x:-250,y:400,desc:"联盟粮仓。三河交汇，麦浪千里。"},
   298	    senlin:{cn:"森林城",x:400,y:500,desc:"半精灵聚集地。箭术与自然魔法在此生根。"},
   299	    haigang:{cn:"海港城",x:500,y:350,desc:"联盟出海口。海军旗舰停泊于此，桅杆刺破海雾。"}
   300	  }},
   301	  south:{cn:"南方商业城邦联盟",x:100,y:-400,color:"#d6b48f",desc:"十二城邦的金钱联邦。金币是唯一通用语，商路是命脉，银月商会的影子在账本间游动。",terrain:"平原",unlock:true,cities:{
   302	    huangjin:{cn:"黄金城",x:100,y:-400,desc:"联盟首府，金融中心。金秤家族的账房亮到子夜。"},
   303	    moxie:{cn:"魔械城",x:350,y:-450,desc:"魔械中心。蒸汽与符文同炉，飞空艇在此升空。"},
   304	    xueshu:{cn:"学术城",x:150,y:-250,desc:"教育中心。思想在此碰撞，也在此被净化令窥视。"},
   305	    shangzhan:{cn:"商栈城",x:-150,y:-350,desc:"大陆最大集市。没有买不到的东西，只有出不起的价。"},
   306	    gangkou:{cn:"港口城",x:200,y:-700,desc:"最大海港。帆樯如林，海盗与商会共享蔚蓝。"}
   307	  }},
   308	  elf:{cn:"精灵王国",x:650,y:650,color:"#8fd6a8",desc:"幽闭的森林国度。迷雾封锁边界三百年，世界树的根须深及深渊边缘。",terrain:"森林",unlock:false,cities:{
   309	    wangting:{cn:"精灵王庭",x:650,y:650,desc:"世界树下的王庭。银月与叶影之间，精灵女王垂帘而坐。"}
   310	  }},
   311	  dwarf:{cn:"矮人王国",x:-650,y:550,color:"#d6a88f",desc:"山腹中的古国。石门沉重，熔炉不熄，矿脉却一日日枯竭。",terrain:"山地",unlock:false,cities:{
   312	    wangdu:{cn:"矮人王都",x:-650,y:550,desc:"熔铁神殿所在。锻锤声千年未绝，回荡在日渐空寂的矿道里。"}
   313	  }},
   314	  orc:{cn:"兽人草原",x:300,y:1000,color:"#d6c48f",desc:"游牧部族的辽阔草原。马蹄与战鼓声中，一个统一的大汗正在崛起。",terrain:"草原",unlock:false,cities:{
   315	    heishi:{cn:"黑石部族营地",x:350,y:1050,desc:"最强部族的营地。黑石大汗的狼旗在风中猎猎。"},
   316	    shengshan:{cn:"兽人圣山",x:300,y:1100,desc:"祖灵洞所在。大萨满在此聆听先祖与深渊的低语。"}
   317	  }},
   318	  east:{cn:"东部王国",x:800,y:200,color:"#d6a8a8",desc:"大陆东端的庞大帝国。皇帝御极，科举取士，铁门关外兵甲森森。",terrain:"平原",unlock:false,cities:{
   319	    chengtian:{cn:"承天城",x:800,y:200,desc:"东部王国的都城。宫阙巍峨，特科科举网罗天下超凡者。"},
   320	    tiemen:{cn:"铁门关",x:300,y:800,desc:"北方与东方的雄关。东军已越关而据，两军对垒，战云压顶。"}
   321	  }},
   322	  church:{cn:"光明教会",x:0,y:200,color:"#e8d6a8",desc:"圣城所在的神权国度。太阳神的圣光笼罩大陆，净化令的阴影也一同落下。",terrain:"平原",unlock:false,cities:{
   323	    shengcheng:{cn:"圣城",x:0,y:200,desc:"光明大教堂与教皇光明塔耸立之地，千万信徒的朝圣终点。"}
   324	  }},
   325	  desert:{cn:"死亡沙漠",x:0,y:-1000,color:"#c89f6a",desc:"大陆南端的死地。黄沙之下埋着古代文明的废墟与深渊的七号封印。",terrain:"沙漠",unlock:false,cities:{
   326	    bianyuan:{cn:"沙漠边缘",x:100,y:-850,desc:"绿洲与黄沙交界处。商队止步于此，再往南，只有疯子和圣徒。"},
   327	    shendian:{cn:"深渊神殿",x:0,y:-1200,desc:"七号封印节点。古代文明的坟场，如今是深渊教团的巢穴。"}
   328	  }}
   329	};
   330	
   331	/* ============ 旅行方式（3号权威速度） ============ */
   332	const TRAVEL = {
   333	  walk:{cn:"步行",cost:0,flat:30,rough:20,wild:15,desert:15,desc:"最基础。慢，稳，省钱，也最暴露在荒野里。"},
   334	  horse:{cn:"骑马",cost:2,flat:80,rough:60,wild:40,desert:25,desc:"日行八十里。马会累，会病，也会在沙漠里渴死。"},
   335	  cart:{cn:"马车",cost:1,flat:50,rough:35,wild:0,desert:0,desc:"只能走有路的地方。舒适，安全，慢半拍。"},
   336	  camel:{cn:"骆驼",cost:1,flat:40,rough:30,wild:25,desert:40,desc:"沙漠之王。在沙海里日行四十里不饮不食。"},
   337	  boat:{cn:"内河船",cost:0.5,flat:100,rough:0,wild:0,desert:0,desc:"沿河而下，日行百里，顺风更疾。仅限水网区域。"},
   338	  ship:{cn:"远洋船",cost:2,flat:120,rough:0,wild:0,desert:0,desc:"沿海航线。快，但风暴与海盗是家常便饭。"},
   339	  airship:{cn:"飞空艇",cost:10,flat:200,rough:200,wild:200,desert:200,desc:"魔械城的奇迹。日行二百里，凌驾一切地形。需先到访魔械城。"}
   340	};
   341	
   342	/* ============ 世界事件（52号五级体系） ============ */
   343	const WORLD_EVENTS = {
   344	  purge:{cn:"净化令",lvl:"二级·多国级",day:60,text:"圣痕司的审判官开始在各城邦搜查奥术与灵魂魔法的痕迹。'异端'一词，如今能烧死任何人。"},
   345	  silver:{cn:"银穗商路危机",lvl:"二级·多国级",day:120,text:"东部王国提高银穗商路税收，铁门关方向战云密布，北方的麦价一夜涨了三成。"},
   346	  seal:{cn:"深渊封印松动",lvl:"一级·大陆级",day:200,text:"七处封印节点的深渊气息渐浓。有占星师说，某个被遗忘的封印正在哭。"},
   347	  academy:{cn:"学院暗流",lvl:"三级·两国级",day:250,text:"艾尔达魔法学院的访问学者中，有人深夜出入禁书区。学院的风向开始变得危险。"},
   348	  orc:{cn:"兽人南下",lvl:"二级·多国级",day:280,text:"黑石大汗整合了半数部族，狼旗南指。北境烽火已燃。"}
   349	};
   350	
   351	/* ============ 游戏状态 ============ */
   352	let S = null;
   353	const emptyState = () => ({
   354	  v:1, ruleset:RULESET_ID,
   355	  name:"无名旅者", job:null,
   356	  attrs:{SPR:20,STR:20,AGI:20,INT:20,CHA:20,CON:20},
   357	  realm:0, xp:0,
   358	  gold:100, hp:100, san:0, maxSan:0,
   359	  rep:0, karma:0, aura:10,
   360	  infl:{free:10,north:0,south:0,church:0,elf:0,dwarf:0,orc:0,east:0,abyss:0},
   361	  fatigue:0, wound:0, disease:false,
   362	  day:1, date:"4037年 · 春一月 · 一日",
   363	  loc:"free_jiaohui", region:"free",
   364	  visited:{}, flags:{}, items:[], mats:{}, books:{}, skills:{},
   365	  conds:{mat:false,kno:false,pra:false,rit:false,anc:false,work:false},
   366	  choices:[], dice:[],
   367	  world:{purge:false,silver:false,seal:false,academy:false,orc:false},
   368	  ending:null, dead:false
   369	});
   370	
   371	/* ============ 工具函数 ============ */
   372	const $ = id => document.getElementById(id);
   373	const rnd = n => Math.floor(Math.random()*n);
   374	const choice = arr => arr[rnd(arr.length)];
   375	function money(n){return Math.round(n*10)/10;}
   376	function fmtDate(day){
   377	  const m = Math.floor((day-1)/30)+1, d = (day-1)%30+1;
   378	  const months = ["春一月","春二月","春三月","夏四月","夏五月","夏六月","秋七月","秋八月","秋九月","冬十月","冬十一月","冬十二月"];
   379	  return "4037年 · "+months[m-1]+" · "+(["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"][d-1])+"日";
   380	}
   381	function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
   382	function rich(s){
   383	  return esc(s)
   384	    .replace(/\*\*(.+?)\*\*/g,"<b style='color:var(--gold2)'>$1</b>")
   385	    .replace(/%%(.+?)%%/g,"<span class='item'>$1</span>")
   386	    .replace(/##(.+?)##/g,"<span style='color:var(--ok)'>$1</span>");
   387	}
   388	
   389	/* ============ 判定引擎（81号 d100 六档） ============ */
   390	function rollD100(){return Math.floor(Math.random()*100)+1;}
   391	function tierOf(roll,target){
   392	  if(roll===1) return "crit";
   393	  if(roll<=Math.floor(target/5)) return "extreme";
   394	  if(roll<=Math.floor(target/2)) return "hard";
   395	  if(roll<=target) return "normal";
   396	  if(roll===100 || (target<50 && roll>=96)) return "critfail";
   397	  return "fail";
   398	}
   399	const TIER_CN = {crit:"大成功",extreme:"极成功",hard:"困难成功",normal:"普通成功",fail:"失败",critfail:"大失败"};
   400	function globalMods(){
   401	  let m = 0;
   402	  if(S.fatigue>=10) m-=30; else if(S.fatigue>=7) m-=20; else if(S.fatigue>=4) m-=10;
   403	  if(S.wound>0) m-=15;
   404	  if(S.disease) m-=20;
   405	  if(S.san>0 && S.san<=S.maxSan*0.25) m-=20;
   406	  else if(S.san>0 && S.san<=S.maxSan*0.5) m-=10;
   407	  return m;
   408	}
   409	function effTarget(opt){
   410	  let t = 50;
   411	  const c = opt.check;
   412	  if(c.a) t = S.attrs[c.a]||50;
   413	  if(c.sk && S.skills[c.sk]) t += S.skills[c.sk];
   414	  t += (globalMods()||0);
   415	  if(c.mods) for(const k in c.mods) t += c.mods[k];
   416	  if(opt.selfMod) t += opt.selfMod();   // 动态修正（境界压制等）
   417	  return Math.max(5,Math.min(98,t));
   418	}
   419	function skillBonusOf(sk){
   420	  if(!sk) return 0;
   421	  if(!(sk in S.skills)) S.skills[sk]=0;
   422	  return S.skills[sk];
   423	}
   424	
   425	/* ============ 属性与技能 ============ */
   426	function jobSkill(){ return S.job ? JOBS[S.job].skill : null; }
   427	function skillCn(sk){ return (SKILLS[sk]||{cn:sk}).cn; }
   428	function repLevel(rep){
   429	  if(rep>=80) return "大陆闻名"; if(rep>=50) return "一方名人";
   430	  if(rep>=25) return "声名鹊起"; if(rep>=10) return "小有名气"; return "无名旅者";
   431	}
   432	function realmModStr(){ // 境界压制说明
   433	  return "";
   434	}
   435	
   436	/* ============ 效果执行 ============ */
   437	function applyEffects(eff,label){
   438	  if(!eff) return null;
   439	  const lines = [];
   440	  // 函数式材料/典籍：延迟求值，拿到当前职业的真实数据（避免存成 [object Object]）
   441	  if(typeof eff.mat==="function") eff.mat = eff.mat() || null;
   442	  if(typeof eff.book==="function") eff.book = eff.book() || null;
   443	  const add = (v,unit,pos) => { if(v!==0) lines.push((v>0?"+":"")+v+unit); };
   444	  if(eff.gold){S.gold+=eff.gold; add(eff.gold,"金币",eff.gold>0);}
   445	  if(eff.xp){S.xp=Math.max(0,S.xp+eff.xp); add(eff.xp,"修为");}
   446	  if(eff.hp){S.hp=Math.max(0,Math.min(maxHp(),S.hp+eff.hp)); add(eff.hp,"生命",eff.hp>0);}
   447	  if(eff.san){S.san=Math.max(0,Math.min(S.maxSan,S.san+eff.san)); add(eff.san,"SAN",eff.san>0);}
   448	  if(eff.rep){S.rep=Math.max(0,S.rep+eff.rep); add(eff.rep,"声望",eff.rep>0);}
   449	  if(eff.karma){S.karma=Math.max(-100,Math.min(100,S.karma+eff.karma)); add(eff.karma,"业力",eff.karma>0);}
   450	  if(eff.aura){S.aura=Math.max(0,Math.min(100,S.aura+eff.aura)); add(eff.aura,"气质",eff.aura>0);}
   451	  if(eff.infl){for(const k in eff.infl){S.infl[k]=(S.infl[k]||0)+eff.infl[k]; lines.push((eff.infl[k]>0?"+":"")+eff.infl[k]+" "+regionCn(k)+"好感");}}
   452	  if(eff.fatigue){S.fatigue=Math.max(0,S.fatigue+eff.fatigue);}
   453	  if(eff.wound){S.wound=Math.min(3,S.wound+eff.wound); lines.push((eff.wound>0?"受":"")+Math.abs(eff.wound)+"级伤"+(eff.wound>0?"":"愈"));}
   454	  if(eff.disease){S.disease=!!eff.disease;}
   455	  if(eff.item){S.items.push(eff.item); lines.push("获得：%%"+eff.item+"%%");}
   456	  if(eff.mat){S.mats[eff.mat]=(S.mats[eff.mat]||0)+1; lines.push("获得材料：%%"+eff.mat+"%%");}
   457	  if(eff.book){S.books[eff.book]=true; lines.push("获得典籍：%%"+eff.book+"%%");}
   458	  if(eff.skill){S.skills[eff.skill.s]=(S.skills[eff.skill.s]||0)+(eff.skill.v||10); lines.push("技能提升："+skillCn(eff.skill.s)+" +"+(eff.skill.v||10));}
   459	  if(eff.flag){S.flags[eff.flag]=true;}
   460	  if(eff.setflag){for(const k in eff.setflag){S.flags[k]=!!eff.setflag[k];}}
   461	  if(eff.cond){S.conds[eff.cond]=true; lines.push("进阶条件达成："+condCn(eff.cond));}
   462	  if(eff.loseItem){S.items=S.items.filter(x=>x!==eff.loseItem); lines.push("失去：%%"+eff.loseItem+"%%");}
   463	  if(eff.loseMat){S.mats[eff.loseMat]=Math.max(0,(S.mats[eff.loseMat]||0)-(eff.n||1)); lines.push("消耗材料：%%"+eff.loseMat+"%%");}
   464	  if(eff.loseGold){S.gold=Math.max(0,S.gold-eff.loseGold); lines.push("失去金币："+eff.loseGold);}
   465	  if(eff.heal){S.hp=Math.min(maxHp(),S.hp+eff.heal); lines.push("恢复生命："+eff.heal);}
   466	  if(eff.sanmax){S.maxSan+=eff.sanmax; if(!S.san) S.san=S.maxSan; lines.push("SAN上限 +"+eff.sanmax);}
   467	  if(eff.attr){for(const k in eff.attr){S.attrs[k]=Math.min(80,S.attrs[k]+eff.attr[k]); lines.push(ATTR_CN[k]+" +"+eff.attr[k]);}}
   468	  if(lines.length) return "◆ 结果："+lines.join("，")+"。";
   469	  return null;
   470	}
   471	function condCn(c){
   472	  return {mat:"材料",kno:"知识",pra:"实践",rit:"仪式",anc:"锚点",work:"传奇作品"}[c]||c;
   473	}
   474	function regionCn(k){return ({free:"自由城邦",north:"北方联盟",south:"南方城邦",church:"光明教会",elf:"精灵王国",dwarf:"矮人王国",orc:"兽人草原",east:"东部王国",abyss:"深渊"})[k]||k;}
   475	function maxHp(){ return REALMS[S.realm].hp + (S.attrs.CON-20)*2; }
   476	
   477	/* ============ 渲染 ============ */
   478	function curCity(){
   479	  const [r,c] = S.loc.split("_");
   480	  const city = REGIONS[r] ? REGIONS[r].cities[c] : null;
   481	  return {r,c,region:REGIONS[r],city};
   482	}
   483	function curLocName(){
   484	  const cc = curCity();
   485	  if(!cc.region) return "未知之地";
   486	  return cc.city ? cc.region.cn+" · "+cc.city.cn : cc.region.cn;
   487	}
   488	function renderTop(){
   489	  $("tb-date").textContent = fmtDate(S.day);
   490	  $("tb-place").textContent = curLocName();
   491	  $("tb-gold").textContent = money(S.gold);
   492	  $("tb-day").textContent = S.day;
   493	}
   494	function renderStats(){
   495	  const j = S.job?JOBS[S.job]:null;
   496	  const maxh = maxHp();
   497	  let h = "";
   498	  h += "<div class='row'><span>名讳</span><b>"+esc(S.name)+"</b></div>";
   499	  h += "<div class='row'><span>职业</span><b>"+(j?j.cn:"未定")+"</b></div>";
   500	  h += "<div class='row'><span>境界</span><b style='color:var(--gold2)'>"+REALMS[S.realm].cn+" · "+(j?j.titles[S.realm]:"—")+"</b></div>";
   501	  h += "<div class='row'><span>名望</span><b>"+repLevel(S.rep)+"（"+S.rep+"）</b></div>";
   502	  h += "<div class='row'><span>业力</span><b style='color:"+(S.karma<0?"var(--bad)":S.karma>0?"var(--ok)":"var(--text)")+"'>"+S.karma+"</b></div>";
   503	  h += "<div class='row'><span>气质</span><b>"+S.aura+"</b></div>";
   504	  h += "<div class='bar'><i class='b-hp' style='width:"+Math.max(0,Math.round(S.hp/maxh*100))+"%'></i></div>";
   505	  h += "<div class='row'><span>生命</span><b>"+S.hp+" / "+maxh+"</b></div>";
   506	  h += "<div class='bar'><i class='b-san' style='width:"+Math.max(0,Math.round(S.san/S.maxSan*100))+"%'></i></div>";
   507	  h += "<div class='row'><span>神智 SAN</span><b>"+S.san+" / "+S.maxSan+"</b></div>";
   508	  const nextXp = S.realm<8 ? REALMS[S.realm+1].xp : REALMS[8].xp;
   509	  const curXp = REALMS[S.realm].xp;
   510	  const pct = Math.min(100,Math.round((S.xp-curXp)/(nextXp-curXp)*100));
   511	  h += "<div class='bar'><i class='b-xp' style='width:"+pct+"%'></i></div>";
   512	  h += "<div class='row'><span>修为</span><b>"+S.xp+" / "+nextXp+"</b></div>";
   513	  h += "<div class='row'><span>日期</span><b>"+S.day+" 日</b></div>";
   514	  const st = [];
   515	  if(S.fatigue>=10) st.push("极度疲惫"); else if(S.fatigue>=7) st.push("疲惫"); else if(S.fatigue>=4) st.push("劳累");
   516	  if(S.wound>=2) st.push("重伤"); else if(S.wound>=1) st.push("轻伤");
   517	  if(S.disease) st.push("患病");
   518	  if(st.length) h += "<div class='row'><span>状态</span><b style='color:var(--bad)'>"+st.join("·")+"</b></div>";
   519	  h += "<div class='kv mt10'>";
   520	  for(const a of ATTRS) h += "<span>"+ATTR_CN[a]+" "+S.attrs[a]+"</span>";
   521	  h += "</div>";
   522	  $("stats").innerHTML = h;
   523	}
   524	
   525	/* ============ 叙事渲染 ============ */
   526	let storyEl, optEl, curNode=null;
   527	function jobMat(i){
   528	  try{ if(S && S.job && JOBS[S.job].mats) return JOBS[S.job].mats[i]||"材料"; }catch(e){}
   529	  return "材料";
   530	}
   531	function jobTitle(i){
   532	  try{ if(S && S.job && JOBS[S.job].titles) return JOBS[S.job].titles[i]||"你"; }catch(e){}
   533	  return "你";
   534	}
   535	function mercuryNote(){
   536	  try{ if(S && S.job==="灵魂法师") return "灵魂魔法的基础"; }catch(e){}
   537	  return "修行之道";
   538	}
   539	function jobBook(i){
   540	  try{ if(S && S.job && JOBS[S.job].books && JOBS[S.job].books[0]) return JOBS[S.job].books[0][i]||"某本典籍"; }catch(e){}
   541	  return "某本典籍";
   542	}
   543	function writePar(p,cls){
   544	  if(typeof p==="string") p = p.replace(/\[\[JB0\]\]/g, jobBook(0)).replace(/\[\[JB1\]\]/g, jobBook(1)).replace(/\[\[JM0\]\]/g, jobMat(0)).replace(/\[\[JT1\]\]/g, jobTitle(1)).replace(/\[\[MERC\]\]/g, mercuryNote());
   545	
   546	  const d = document.createElement("p");
   547	  if(cls) d.className=cls;
   548	  d.innerHTML = rich(p);
   549	  storyEl.appendChild(d);
   550	  storyEl.scrollTop = storyEl.scrollHeight;
   551	}
   552	function writeDice(roll,target,tierLabel){
   553	  const d = document.createElement("div");
   554	  d.className = "dice "+tierLabel;
   555	  d.innerHTML = "<span class='dlabel'>判定 · d100 = <b>"+roll+"</b> / 目标 "+target+" → "+tierLabel+"</span>";
   556	  storyEl.appendChild(d);
   557	  storyEl.scrollTop = storyEl.scrollHeight;
   558	}
   559	function clearOptions(){ $("options").innerHTML=""; }
   560	function showOptions(node){
   561	  clearOptions();
   562	  if(!node || !node.options) return;
   563	  for(let i=0;i<node.options.length;i++){
   564	    const o = node.options[i];
   565	    if(o.req && !o.req()) continue;
   566	    const b = document.createElement("button");
   567	    b.className="opt";
   568	    let html = "<span class='od'>◆</span> "+rich(o.t);
   569	    if(o.check){
   570	      const t = effTarget(o);
   571	      html += "<span class='oh'>（"+ (o.check.label||skillCn(o.check.sk)||ATTR_CN[o.check.a]) +" · 成功率约 "+(t>=98?">98":t<=5?"<5":t)+"%"+ (o.check.note?" · "+o.check.note:"") +"）</span>";
   572	    } else if(o.note){
   573	      html += "<span class='oh'>（"+o.note+"）</span>";
   574	    }
   575	    b.innerHTML = html;
   576	    b.onclick = ()=>choose(o);
   577	    $("options").appendChild(b);
   578	  }
   579	}
   580	function writeNext(){
   581	  renderTop(); renderStats();
   582	  const node = (typeof N[curNode]==="function") ? N[curNode]() : N[curNode];
   583	  if(!node){ writePar("【此处剧情尚未展开。存档编号："+curNode+"】","noind flagline"); return; }
   584	  if(node.place) writePar("「"+node.place+"」","place");
   585	  if(node.where) writePar(node.where,"where");
   586	  for(const t of node.text) writePar(t);
   587	  if(node.auto){ // 自动跳转
   588	    const a = node.auto;
   589	    setTimeout(()=>{ if(a.go){curNode=a.go; writeNext();} }, a.delay||900);
   590	    return;
   591	  }
   592	  showOptions(node);
   593	}
   594	function choose(opt){
   595	  if(opt.run){ opt.run(); return; }
   596	  S.choices.push(curNode);
   597	  const node = N[curNode];
   598	  let isOk = true; // 无判定选项默认视为成功路径
   599	  if(opt.time) advanceDays(opt.time);
   600	  if(opt.check){
   601	    const t = effTarget(opt);
   602	    const roll = rollD100();
   603	    const lvl = tierOf(roll,t);
   604	    S.dice.push({node:curNode,opt:opt.t,roll,target:t,lvl});
   605	    writeDice(roll,t,lvl);
   606	    const tier = opt.tier||{};
   607	    if(lvl==="crit" && tier.crit) tier.crit.forEach(p=>writePar(p));
   608	    else if((lvl==="extreme"||lvl==="hard"||lvl==="normal") && tier.ok) {
   609	      if(lvl!=="normal" && tier.okLead) writePar(tier.okLead(lvl));
   610	      tier.ok.forEach(p=>writePar(p));
   611	    }
   612	    else if(lvl==="fail" && tier.fail) tier.fail.forEach(p=>writePar(p));
   613	    else if(lvl==="critfail" && tier.critfail) tier.critfail.forEach(p=>writePar(p));
   614	    else if(tier.ok) tier.ok.forEach(p=>writePar(p));
   615	    // 判定余波
   616	    let res = applyEffects(opt.effects||{},null);
   617	    if(lvl==="crit" && opt.onCrit) res = (res?res+"<br>":"")+applyEffects(opt.onCrit||{},null);
   618	    if(lvl==="critfail" && opt.onCritFail) res = (res?res+"<br>":"")+applyEffects(opt.onCritFail||{},null);
   619	    if(lvl==="normal"||lvl==="hard"||lvl==="extreme") if(opt.onOk) res = (res?res+"<br>":"")+applyEffects(opt.onOk||{},null);
   620	    if(lvl==="fail" && opt.onFail) res = (res?res+"<br>":"")+applyEffects(opt.onFail||{},null);
   621	    if(res) writePar(res,"res");
   622	    // 成功等级→分支
   623	    const isOk = (lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal");
   624	    const goId = isOk ? (opt.go||(opt.fail||null)) : (opt.fail||opt.go||null);
   625	    if(opt.loseIfFail && !isOk){ S.gold=Math.max(0,S.gold-opt.loseIfFail); }
   626	    curNode = goId;
   627	  } else {
   628	    if(opt.effects){ const res = applyEffects(opt.effects,null); if(res) writePar(res,"res"); }
   629	    if(opt.tier && opt.tier.ok) opt.tier.ok.forEach(p=>writePar(p)); // 无判定选项也有叙事
   630	    curNode = opt.go;
   631	  }
   632	  if(opt.after) opt.after();
   633	  if(opt.afterOk && isOk) opt.afterOk();
   634	  if(opt.afterFail && !isOk) opt.afterFail();
   635	  renderTop(); renderStats();
   636	  if(S.hp<=0 && !S.ending){ handleDeath(); return; }
   637	  if(S.san<=0 && !S.ending){ showEnding("madness"); return; }
   638	  writeNext();
   639	}
   640	function handleDeath(){
   641	  writePar("黑暗漫上来。马蹄声、风声、远处的钟声，都远了。");
   642	  writePar("……再醒来时，你躺在某个小镇的医馆里。药味呛鼻，伤口被粗糙地包扎过。守夜的老医者说，是好心人把你从路边捡回来的。","noind");
   643	  const lose = Math.floor(S.gold*0.3);
   644	  S.gold-=lose;
   645	  for(const k in S.mats) S.mats[k]=Math.floor(S.mats[k]/2);
   646	  S.hp = Math.round(maxHp()*0.5);
   647	  S.wound=1;
   648	  S.day+=10; S.date=fmtDate(S.day);
   649	  writePar("（损失金币 "+lose+"，材料折半，修养十日。）","noind flagline");
   650	  const vis = Object.keys(S.visited).filter(k=>k.includes("_"));
   651	  const dest = vis.length? vis[vis.length-1] : "free_jiaohui";
   652	  S.loc=dest; S.region=dest.split("_")[0];
   653	  S.fatigue=Math.max(S.fatigue,6);
   654	  curNode = "arrive_generic";
   655	  renderTop(); renderStats(); renderMapPanel();
   656	  writeNext();
   657	}
   658	function advanceDays(n){
   659	  S.day += n; S.date = fmtDate(S.day);
   660	  // 疲劳恢复/累积
   661	  if(n>=4 && S.fatigue<4) S.fatigue=4;
   662	  S.fatigue = Math.max(0, S.fatigue - (n>=2?1:0));
   663	  if(S.wound>0 && n>=2) S.wound=0;
   664	  if(S.disease && n>=4) S.disease=false;
   665	  checkWorldEvents();
   666	}
   667	function checkWorldEvents(){
   668	  const w = S.world;
   669	  S.worldQueue = S.worldQueue||[];
   670	  if(!w.purge && S.day>=WORLD_EVENTS.purge.day){
   671	    w.purge=true; S.worldQueue.push("purge"); logMsg("世界事件：净化令扩散（第"+S.day+"日）");
   672	  }
   673	  if(!w.silver && S.day>=WORLD_EVENTS.silver.day){
   674	    w.silver=true; S.worldQueue.push("silver"); logMsg("世界事件：银穗商路危机（第"+S.day+"日）");
   675	  }
   676	  if(!w.seal && S.day>=WORLD_EVENTS.seal.day){
   677	    w.seal=true; S.worldQueue.push("seal"); logMsg("世界事件：深渊封印松动（第"+S.day+"日）");
   678	  }
   679	  if(!w.academy && S.day>=WORLD_EVENTS.academy.day){
   680	    w.academy=true; S.worldQueue.push("academy"); logMsg("世界事件：学院暗流（第"+S.day+"日）");
   681	  }
   682	  if(!w.orc && S.day>=WORLD_EVENTS.orc.day){
   683	    w.orc=true; S.worldQueue.push("orc"); logMsg("世界事件：兽人南下（第"+S.day+"日）");
   684	  }
   685	}
   686	
   687	/* ============ 日志 ============ */
   688	const logs=[];
   689	function logMsg(m,cls){ logs.unshift({m,cls}); }
   690	function renderLog(){
   691	  let h="";
   692	  for(const l of logs.slice(0,80)) h += "<div class='"+ (l.cls||"") +"'>"+esc(l.m)+"</div>";
   693	  $("log").innerHTML=h;
   694	}
   695	
   696	/* ============ 存档 ============ */
   697	function saveGame(){
   698	  try{
   699	    S.choices=[]; // 不存冗长历史，防超限
   700	    S.curNode = curNode;
   701	    localStorage.setItem(RULESET_ID+"-save",JSON.stringify(S));
   702	    logMsg("已存档（第"+S.day+"日）","g");
   703	    flashMsg("已存档");
   704	  }catch(e){ flashMsg("存档失败："+e.message); }
   705	}
   706	function loadGame(){
   707	  try{
   708	    const raw = localStorage.getItem(RULESET_ID+"-save");
   709	    if(!raw){ flashMsg("没有找到存档"); return; }
   710	    const d = JSON.parse(raw);
   711	    if(d.ruleset!==RULESET_ID){ flashMsg("存档版本不匹配"); return; }
   712	    S = d;
   713	    logMsg("已读档（第"+S.day+"日）","g");
   714	    flashMsg("已读档");
   715	    if(S.ending){ showEnding(S.ending); return; }
   716	    curNode = S.curNode || "fc_jiaohui_entry";
   717	    renderTop(); renderStats(); writeNext();
   718	  }catch(e){ flashMsg("读档失败："+e.message); }
   719	}
   720	function newGame(){
   721	  if(!askConfirm("确定开始新的旅程？当前进度将被覆盖。")) return;
   722	  S = emptyState();
   723	  curNode=null;
   724	  showCreation();
   725	}
   726	function flashMsg(m){ /* 简单提示 */ }
   727	function askConfirm(x){ return window.confirm(x); }
   728	
   729	/* ============ 地图 ============ */
   730	function renderMapPanel(){
   731	  const P = $("map");
   732	  if(!P) return;
   733	  let svg = "<svg viewBox='-800 -1300 1700 2600' xmlns='http://www.w3.org/2000/svg'>";
   734	  // 简化网格
   735	  for(let gx=-600;gx<=600;gx+=200){ svg += "<line x1='"+gx+"' y1='-1250' x2='"+gx+"' y2='1250' class='route'/>"; }
   736	  for(let gy=-1200;gy<=1200;gy+=200){ svg += "<line x1='-750' y1='"+gy+"' x2='750' y2='"+gy+"' class='route'/>"; }
   737	  for(const rk in REGIONS){
   738	    const R = REGIONS[rk];
   739	    for(const ck in R.cities){
   740	      const C = R.cities[ck];
   741	      const id = rk+"_"+ck;
   742	      const now = S.loc===id;
   743	      const visited = S.visited[id];
   744	      const cls = now?"now":(visited?"":"un");
   745	      svg += "<g class='city "+cls+"' onclick='travelTo(\""+id+"\")'>";
   746	      svg += "<circle cx='"+C.x+"' cy='"+(-C.y)+"' r='"+(now?7:5)+"'/>";
   747	      svg += "<text x='"+(C.x+10)+"' y='"+(C.y? -C.y-6 : -C.y+16)+"' class='city'>"+C.cn+"</text>";
   748	      svg += "</g>";
   749	    }
   750	  }
   751	  svg += "</svg>";
   752	  P.innerHTML = svg;
   753	}
   754	
   755	/* ============ 旅行 ============ */
   756	function travelTo(id){
   757	  const [r,c] = id.split("_");
   758	  if(!REGIONS[r]||!REGIONS[r].cities[c]) return;
   759	  if(S.loc===id){ flashMsg("你已在此地"); return; }
   760	  const from = curCity();
   761	  const toR = REGIONS[r], toC = toR.cities[c];
   762	  // 距离
   763	  const dx = toC.x - (from.city?from.city.x:0);
   764	  const dy = toC.y - (from.city?from.city.y:0);
   765	  const dist = Math.round(Math.sqrt(dx*dx+dy*dy));
   766	  // 选择交通方式
   767	  const dst = r;
   768	  const modes = [];
   769	  for(const mk in TRAVEL){
   770	    const M = TRAVEL[mk];
   771	    if(mk==="airship" && !S.flags.moxie_visited) continue;
   772	    if(M.flat===0 && !isWaterRoute(from.region.terrain,dst,toR.terrain)) continue;
   773	    modes.push(mk);
   774	  }
   775	  // 展示交通选择
   776	  const box = document.createElement("div");
   777	  box.className="box";
   778	  let h="<h2>前往 "+toR.cn+" · "+toC.cn+"</h2><p class='sub'>距离约 "+dist+" 公里。当前地点："+curLocName()+"。</p>";
   779	  for(const mk of modes){
   780	    const M = TRAVEL[mk];
   781	    const speed = speedFor(M,dst);
   782	    if(!speed) continue;
   783	    const days = Math.max(1,Math.ceil(dist/speed));
   784	    h += "<button class='opt' onclick='startTravel(\""+id+"\",\""+mk+"\","+dist+")'>"+
   785	         "<span class='od'>◆</span> "+M.cn+"　约 "+days+" 日到达　费用 "+M.cost+" 金/日"+
   786	         "<span class='or'>"+M.desc+"</span></button>";
   787	  }
   788	  h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 算了，原地不动</button>";
   789	  box.innerHTML=h;
   790	  openModal(box);
   791	}
   792	function isWaterRoute(fr,to,tr){ return fr==="平原"&&tr==="平原"; }
   793	function speedFor(M,dst){
   794	  const terrain = REGIONS[dst].terrain;
   795	  if(terrain==="沙漠") return M.desert||0;
   796	  if(terrain==="山地"||terrain==="森林") return M.rough||M.wild||0;
   797	  return M.flat||0;
   798	}
   799	function startTravel(dstId,mode,dist){
   800	  closeModal();
   801	  const M = TRAVEL[mode];
   802	  const speed = speedFor(M,dstId.split("_")[0]);
   803	  const days = Math.max(1,Math.ceil(dist/speed));
   804	  const cost = days*M.cost;
   805	  if(S.gold<cost && mode!=="walk"){ writePar("你的钱袋不够支付这趟旅费。马夫的眼神冷下来。你只能另想办法。","noind"); return; }
   806	  S.gold -= cost;
   807	  // 途中事件
   808	  let eventTexts = [];
   809	  const rolls = Math.min(3,Math.max(1,Math.floor(days/3)));
   810	  for(let i=0;i<rolls;i++){
   811	    const ev = rollTravelEvent();
   812	    if(ev) eventTexts.push(ev);
   813	  }
   814	  advanceDays(days);
   815	  S.fatigue = Math.min(12,S.fatigue+Math.min(days,6));
   816	  S.loc = dstId; S.region = dstId.split("_")[0];
   817	  S.visited[S.loc]=true; S.visited[S.region]=true;
   818	  S.flags["visited_"+S.region]=true;
   819	  S.flags.arrived = dstId;
   820	  logMsg("抵达 "+REGIONS[S.region].cn+" · "+REGIONS[S.region].cities[S.loc.split("_")[1]].cn,"l");
   821	  renderMapPanel();
   822	  const destNode = "arrive_"+dstId;
   823	  // 世界事件优先落地：抵城时先见天下大势，再见眼前人事
   824	  if(S.worldQueue && S.worldQueue.length && N["world_"+S.worldQueue[0]]){
   825	    S.afterWorld = destNode;
   826	    curNode = "world_"+S.worldQueue.shift();
   827	  } else if(N[destNode]) curNode = destNode;
   828	  else curNode = "arrive_generic";
   829	  // 渲染旅途叙事
   830	  writePar("── 旅途 · "+M.cn+" · "+days+" 日 ──","noind flagline");
   831	  writePar("黄尘在身后卷起。马蹄声、车轮声、风穿过荒野的声音，日复一日。");
   832	  writePar("钱袋轻了 "+money(cost)+" 枚金币。第 "+S.day+" 日，你终于望见了目的地。");
   833	  if(eventTexts.length){ writePar("途中并非太平。","noind"); eventTexts.forEach(t=>writePar(t)); }
   834	  writeNext();
   835	}
   836	function rollTravelEvent(){
   837	  const r = rnd(100);
   838	  if(r<12) return null; // 无事发生
   839	  const ev = choice(TRAVEL_EVENTS);
   840	  const roll = rollD100();
   841	  const t = ev.base||50;
   842	  const lvl = tierOf(roll,t);
   843	  S.dice.push({node:"travel",opt:ev.cn,roll,target:t,lvl});
   844	  writeDice(roll,t,lvl);
   845	  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
   846	    writePar(ev.ok);
   847	    const res = applyEffects(ev.effOk||{},null);
   848	    if(res) writePar(res,"res");
   849	    return ev.ok;
   850	  } else {
   851	    writePar(ev.fail);
   852	    const res = applyEffects(ev.effFail||{},null);
   853	    if(res) writePar(res,"res");
   854	    return ev.fail;
   855	  }
   856	}
   857	
   858	/* ============ 模态框 ============ */
   859	function openModal(el){ const m=$("modal"); m.innerHTML=""; m.appendChild(el); m.classList.add("show"); }
   860	function closeModal(){ $("modal").classList.remove("show"); $("modal").innerHTML=""; }
   861	
   862	/* ============ 建号 ============ */
   863	let pool=300;
   864	function showCreation(){
   865	  pool = 300 - (S.attrs.SPR+S.attrs.STR+S.attrs.AGI+S.attrs.INT+S.attrs.CHA+S.attrs.CON);
   866	  const box = document.createElement("div");
   867	  box.className="box";
   868	  box.innerHTML = creationHTML();
   869	  openModal(box);
   870	  bindCreation();
   871	}
   872	function creationHTML(){
   873	  let h="<h2>无名旅者 · 建号</h2>";
   874	  h+="<p class='sub'>艾尔达历4037年，群雄割据之世。你从灰港的渡船上走下来，身无长物，唯有一身尚未定型的天资。你叫——</p>";
   875	  h+="<div class='mt10'><input type='text' id='in-name' maxlength='12' placeholder='输入你的名讳' value='"+esc(S.name||"")+"'></div>";
   876	  h+="<h3 class='mt10' style='color:var(--gold2)'>主修职业（七选一）</h3>";
   877	  for(const jk in JOBS){
   878	    const j = JOBS[jk];
   879	    h+="<button class='job-card' data-job='"+jk+"' "+(S.job===jk?"style='border-color:var(--gold)'":"")+">"+
   880	       "<span class='jc'>"+j.cn+"　·　"+j.deity.split("（")[0]+"</span>"+
   881	       "<span class='jd'>"+j.desc+"<br><b style='color:var(--cyan)'>准则：</b>"+j.criterion+"　"+j.vow+"</span></button>";
   882	  }
   883	  h+="<h3 class='mt10' style='color:var(--gold2)'>六大属性分配　<span style='color:var(--dim);font-size:12px'>余"+pool+" 点（每项20-80）</span></h3>";
   884	  for(const a of ATTRS){
   885	    h+="<div class='attr-row' data-a='"+a+"'>"+
   886	       "<span class='nm'>"+ATTR_CN[a]+"</span>"+
   887	       "<span class='val' id='val-"+a+"'>"+S.attrs[a]+"</span>"+
   888	       "<span class='btns'>"+
   889	       "<button class='btn ab' data-a='"+a+"' data-d='1'>+1</button>"+
   890	       "<button class='btn ab' data-a='"+a+"' data-d='5'>+5</button>"+
   891	       "<button class='btn' data-a='"+a+"' data-d='-1'>−1</button>"+
   892	       "<button class='btn' data-a='"+a+"' data-d='-5'>−5</button>"+
   893	       "</span><span class='note'>"+ATTR_DESC[a]+"</span></div>";
   894	  }
   895	  h+="<div class='mt10' style='text-align:center'><button class='btn gold' id='btn-start' style='padding:10px 40px;font-size:16px'>开始旅程</button></div>";
   896	  h+="<p class='sub center mt10'>d100 六档判定 · 大成功01 / 极成功≤目标1/5 / 困难成功≤目标1/2 / 普通成功≤目标 / 失败 / 大失败=100或目标<50时≥96</p>";
   897	  return h;
   898	}
   899	function bindCreation(){
   900	  document.querySelectorAll(".job-card").forEach(b=>{
   901	    b.onclick=()=>{
   902	      S.job = b.dataset.job;
   903	      document.querySelectorAll(".job-card").forEach(x=>x.style.borderColor="");
   904	      b.style.borderColor="var(--gold)";
   905	      // 职业特长技能+15
   906	      const sk = JOBS[S.job].skill;
   907	      S.skills[sk]=15;
   908	    };
   909	  });
   910	  document.querySelectorAll(".ab").forEach(b=>{
   911	    b.onclick=()=>{
   912	      const a=b.dataset.a, d=parseInt(b.dataset.d);
   913	      const old=S.attrs[a];
   914	      const np = pool - d;
   915	      const nv = old + d;
   916	      if(nv<20||nv>80){ flashMsg("超出范围（20-80）"); return; }
   917	      if(np<0){ flashMsg("点数不足"); return; }
   918	      S.attrs[a]=nv; pool=np;
   919	      $("val-"+a).textContent=nv;
   920	      document.querySelectorAll("h3")[1].innerHTML = "六大属性分配　<span style='color:var(--dim);font-size:12px'>余"+pool+" 点（每项20-80）</span>";
   921	    };
   922	  });
   923	  $("btn-start").onclick=()=>{
   924	    const name = $("in-name").value.trim();
   925	    if(!name){ flashMsg("请先写下你的名讳"); return; }
   926	    if(!S.job){ flashMsg("请选择主修职业"); return; }
   927	    if(pool<0){ flashMsg("点数分配有误"); return; }
   928	    S.name = name.slice(0,12);
   929	    S.maxSan = Math.round(S.attrs.SPR*1.5);
   930	    S.san = S.maxSan;
   931	    S.hp = maxHp();
   932	    // 职业初始特性
   933	    const j = JOBS[S.job];
   934	    if(j.attr) S.attrs[j.attr]=Math.min(80,S.attrs[j.attr]); // 保持
   935	    S.flags.job_chosen=true;
   936	    logMsg("旅者 "+S.name+" 诞生 · 主修："+j.cn,"l");
   937	    closeModal();
   938	    curNode = "pro_arrive";
   939	    renderTop(); renderStats();
   940	    writeNext();
   941	  };
   942	}
   943	
   944	/* ============ 侧栏面板 ============ */
   945	let curPanel=null;
   946	function togglePanel(name){
   947	  const P=$("panels");
   948	  if(curPanel===name){ P.classList.remove("show"); curPanel=null; return; }
   949	  curPanel=name;
   950	  P.classList.add("show");
   951	  if(name==="map") renderMapPanel();
   952	  if(name==="pack") renderPack();
   953	  if(name==="realm") renderRealm();
   954	  if(name==="log") renderLog();
   955	}
   956	function renderPack(){
   957	  let h="<h3>行囊</h3>";
   958	  h+="<div class='row'><span>金币</span><b>"+money(S.gold)+"</b></div>";
   959	  h+="<div class='mini'>道具："+(S.items.length?S.items.map(x=>"%%"+x+"%%").join("、"):"无")+"</div>";
   960	  const mats = Object.keys(S.mats).filter(k=>S.mats[k]>0);
   961	  h+="<div class='mini'>材料："+(mats.length?mats.map(k=>"%%"+k+"%%×"+S.mats[k]).join("、"):"无")+"</div>";
   962	  const books = Object.keys(S.books);
   963	  h+="<div class='mini'>典籍："+(books.length?books.join("、"):"无")+"</div>";
   964	  h+="<h3>游历足迹</h3>";
   965	  const vis = Object.keys(S.visited).filter(k=>k.includes("_"));
   966	  h+="<div class='mini'>"+(vis.length?vis.map(v=>{const[r,c]=v.split("_");return REGIONS[r]?REGIONS[r].cities[c]?REGIONS[r].cities[c].cn:REGIONS[r].cn:"";}).filter(Boolean).join("、"):"尚未远行")+"</div>";
   967	  h+="<div class='mini'>到访地区 "+Object.keys(S.visited).filter(k=>!k.includes("_")).length+" / 9</div>";
   968	  $("pack").innerHTML=h;
   969	}
   970	function realmCondList(){
   971	  const j = JOBS[S.job];
   972	  const r = S.realm; // 当前境界，下一境用 r
   973	  const next = r<8?r:8;
   974	  const matNeed = j.mats[next];
   975	  const bookNeed = j.books[next]||[];
   976	  let h="";
   977	  h+="<div class='row'><span>当前境界</span><b style='color:var(--gold2)'>"+REALMS[S.realm].cn+" · "+j.titles[S.realm]+"</b></div>";
   978	  if(S.realm>=8){ h+="<div class='mini'>九境已至绝巅。神位唯一，剩下的路，是取代神明。</div>"; return h; }
   979	  h+="<div class='mini'>晋升下一境需同时满足：材料 · 知识 · 实践"+(S.realm>=3?" · 仪式":"")+(S.realm>=4?" · 锚点":"")+(S.realm>=5?" · 传奇作品":"")+"</div>";
   980	  const mk = n=>{ const has=(S.mats[n]||0)>=1; return "<div class='row'><span>"+n+"</span><b class='"+(has?"g":"b")+"'>"+(has?"已得":"缺")+"</b></div>"; };
   981	  h+="<div class='mini' style='color:var(--warn)'>所需材料：</div>"+mk(matNeed);
   982	  for(const b of bookNeed){ const has=S.books[b]; h+="<div class='row'><span>"+b+"</span><b class='"+(has?"g":"b")+"'>"+(has?"已读":"缺")+"</b></div>"; }
   983	  const conds = [["pra","完成修行实践"],["rit","完成晋升仪式"],["anc","立下认知锚点"],["work","完成传奇作品"]].filter(c=>{
   984	    if(c[0]==="rit") return S.realm>=3;
   985	    if(c[0]==="anc") return S.realm>=4;
   986	    if(c[0]==="work") return S.realm>=5;
   987	    return true;
   988	  });
   989	  for(const c of conds){
   990	    const done = S.conds[c[0]];
   991	    h+="<div class='row'><span>"+c[1]+"</span><b class='"+(done?"g":"b")+"'>"+(done?"完成":"未")+"</b></div>";
   992	  }
   993	  const canTry = S.xp>=REALMS[next].xp && S.mats[matNeed]>=1 && bookNeed.every(b=>S.books[b]) && conds.every(c=>c[0]==="rit"||c[0]==="anc"||c[0]==="work"||S.conds[c[0]]);
   994	  h+="<div class='row'><span>尝试晋升</span><b>"+(canTry?"<button class='btn gold' onclick='tryAdvance()'>点燃薪火，冲击境界</button>":"条件未足，尚不可晋升")+"</b></div>";
   995	  h+="<div class='mini' style='color:var(--dim)'>"+REALMS[next].desc+"</div>";
   996	  return h;
   997	}
   998	function renderRealm(){
   999	  let h="<h3>修炼</h3>";
  1000	  if(!S.job){ $("realm").innerHTML=h+"<div class='mini'>尚未选择职业。</div>"; return; }
  1001	  h += realmCondList();
  1002	  h += "<h3>技能</h3>";
  1003	  for(const sk in S.skills){
  1004	    const v=S.skills[sk];
  1005	    if(v>0){
  1006	      const lv = SKILL_LEVELS.filter(x=>x[1]<=v).pop();
  1007	      h+="<div class='row'><span>"+skillCn(sk)+"</span><b>"+(lv?lv[0]+" (+"+v+")":"+"+v)+"</b></div>";
  1008	    }
  1009	  }
  1010	  h+="<div class='mini'>职业特长技能自动 +15。技能随剧情与修行提升。</div>";
  1011	  $("realm").innerHTML=h;
  1012	}
  1013	function tryAdvance(){
  1014	  const j = JOBS[S.job];
  1015	  const next = S.realm+1;
  1016	  // 晋升仪式判定
  1017	  const t = 40 + Math.floor((S.attrs[j.attr]||50)/2) + (S.realm*5);
  1018	  writePar("你盘膝而坐，让"+j.criterion+"的准则在心头流过。这一次冲击"+REALMS[next].cn+"，成则天高地阔，败则前功尽弃。","noind");
  1019	  const roll = rollD100(); const lvl = tierOf(roll,t);
  1020	  writeDice(roll,t,lvl);
  1021	  const ok = lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal";
  1022	  if(ok){
  1023	    S.mats[j.mats[S.realm]]--; if(S.mats[j.mats[S.realm]]<0) S.mats[j.mats[S.realm]]=0;
  1024	    S.realm = next;
  1025	    S.maxSan += 5;
  1026	    S.san = S.maxSan;
  1027	    if(next>=5) S.conds.rit=true; if(next>=6) S.conds.anc=true;
  1028	    S.hp = maxHp();
  1029	    writePar("轰——力量在体内炸开。旧的躯壳碎裂，新的感知漫过全身。你低头看自己的手，掌纹里流转着新的光。");
  1030	    writePar("**破境。"+REALMS[next].cn+"。**从此世间有你"+j.titles[next]+"之名。","noind");
  1031	    const res = applyEffects({attr:j.attr?{[j.attr]:2}:{SPR:2}},null);
  1032	    if(res) writePar(res,"res");
  1033	    logMsg("破境！"+REALMS[next].cn+" · "+j.titles[next],"l");
  1034	    // 宗师以上争位提示
  1035	    if(next>=6){ writePar("你隐约感到，这个境界在世间是有数的。高处的位置，每一个都有人坐着。","noind flagline"); }
  1036	    renderTop(); renderStats(); renderRealm();
  1037	    // 境界里程碑叙事（宗师/大宗师/传奇/半神/神话）
  1038	    if(N["realm_"+next]){ curNode="realm_"+next; writeNext(); }
  1039	  } else {
  1040	    S.san = Math.max(0,S.san-5);
  1041	    const lose = Math.max(10,Math.floor(S.gold*0.15));
  1042	    S.gold-=lose;
  1043	    writePar("反噬。胸口一闷，刚聚起的力量像受惊的兽群四散奔逃。你咳出一口血，地上溅开暗红。");
  1044	    writePar("钱袋轻了，气机也乱了。这一境，还差一口气。","noind");
  1045	    const res = applyEffects({san:0,hp:-Math.round(maxHp()*0.2)},null);
  1046	    if(res) writePar(res,"res");
  1047	    writePar("（损失金币 "+lose+"。可再积攒修为后重新冲击。）","noind flagline");
  1048	    renderTop(); renderStats();
  1049	  }
  1050	}
  1051	
  1052	/* ============ 结局 ============ */
  1053	function checkDeath(){
  1054	  if(S.hp<=0 && !S.ending){
  1055	    S.hp=0;
  1056	    // 濒死：不结束，损失后回城
  1057	    writePar("黑暗漫上来。马蹄声、风声、远处的钟声，都远了。");
  1058	    writePar("……再醒来时，你躺在某个小镇的医馆里。药味呛鼻，伤口被粗糙地包扎过。守夜的老医者说，是好心人把你从路边捡回来的。","noind");
  1059	    const lose = Math.floor(S.gold*0.3);
  1060	    S.gold-=lose;
  1061	    for(const k in S.mats) S.mats[k]=Math.floor(S.mats[k]/2);
  1062	    S.hp = Math.round(maxHp()*0.5);
  1063	    S.wound=1;
  1064	    S.day+=10; S.date=fmtDate(S.day);
  1065	    writePar("（损失金币 "+lose+"，材料折半，修养十日。）","noind flagline");
  1066	    // 送回最近已访问城市
  1067	    const vis = Object.keys(S.visited).filter(k=>k.includes("_"));
  1068	    const dest = vis.length? vis[vis.length-1] : "free_jiaohui";
  1069	    S.loc=dest; S.region=dest.split("_")[0];
  1070	    curNode = "arrive_generic";
  1071	    renderTop(); renderStats(); renderMapPanel();
  1072	    writeNext();
  1073	  }
  1074	  if(S.san<=0 && !S.ending){
  1075	    S.san=0;
  1076	    showEnding("madness");
  1077	  }
  1078	}
  1079	
  1080	/* ============ 故事节点容器 ============ */
  1081	const N = {};
  1082	/* ================================================================
  1083	   序章 · 自由城邦（4037年春一月）
  1084	   ================================================================ */
  1085	N["pro_arrive"] = {
  1086	  place:"灰港 · 内河码头", where:"4037年 · 春一月 · 一日 · 晨",
  1087	  text:[
  1088	    "船靠岸时，天还没全亮。",
  1089	    "雾从河面压过来，把码头的桅杆一根根吞进去，又吐出来。你从底舱爬上来，混在难民堆里。北边在打仗，铁门关方向的风声一路传到了这里，船上的人十个里有七个是逃出来的。",
  1090	    "一个妇人抱着空米袋，站在跳板上，看着岸上发呆。她的男人去打听粮价，半个时辰没回来。",
  1091	    "你踩着湿漉漉的跳板上了岸。脚底是石头的，灰港的石板路被千万双鞋磨得发亮。",
  1092	    "身后，一艘挂着银月纹章的商船正在卸货。木箱沉得很，搬运工压弯了腰。箱角露出的不是布匹，是铁器。船头有个穿灰袍的账房，正一箱一箱地记数，笔尖在账本上沙沙地响。",
  1093	    "码头的税吏拎着铜秤走过来，目光在难民堆里扫了一圈，停在你身上。",
  1094	    "“站住。哪来的？干什么的？”"
  1095	  ],
  1096	  options:[
  1097	    {t:"镇定答话，说是行商学徒，来做生意",check:{a:"CHA",sk:"persu",label:"说服"},tier:{
  1098	      ok:["你拍了拍沾灰的衣襟，报了个城里老字号学徒的名头，又把袖口里那点碎银晃给他看。税吏的铜秤在手里掂了掂，眼光从你脸上滑过去。“这年头，做生意的不如逃难的骨头硬。”他摆摆手，放行了。"],
  1099	      fail:["你话说得急，漏了怯。税吏眯起眼，让你多交两个铜子的'人头税'，又把你那点行李翻了个底朝天。没翻出什么，才悻悻地放你过去。"],
  1100	      crit:["你笑着递上半句行话，又顺手帮他把歪了的铜秤扶正。税吏一怔，随即笑起来：“是个懂事的。”他不但放行，还压低声音提点你：'城西的酒馆别去，昨夜死过人；要打听事，去跛脚酒桶找蜜尔娜。'"],
  1101	      critfail:["你越描越黑。税吏盯着你看了三息，忽然伸手——从你领口里扯出一截路上用来保暖的旧围巾。他狐疑地翻看着，最终没找到想找的东西，才黑着脸放行，却把你的名字记在了哨簿上。","你回头看了一眼那本哨簿。你的名字落在纸面上，像一颗扎进皮肉里的刺。"]
  1102	    },effects:{gold:-2},onCrit:{flag:"tax_favor"},onCritFail:{flag:"tax_record"},go:"fc_jiaohui_entry"},
  1103	    {t:"沉默地递上两个铜子，不废话",effects:{gold:-2},tier:{
  1104	      ok:["你把铜子放在他手心。税吏掂了掂，目光在你脸上停了一瞬，侧身让开。","沉默在这个年头是最便宜的通行证。"],
  1105	      crit:["你递铜子时，指腹在铜面上一抹，露出底下银色的边。那是南境的银币，掺在铜子里。税吏眼皮一跳，什么也没说，放你过去时，看你的眼神已经不一样了。"]
  1106	    },go:"fc_jiaohui_entry"},
  1107	    {t:"绕开税吏，从码头边的货道翻墙进城",check:{a:"AGI",sk:"stealth",label:"潜行"},tier:{
  1108	      ok:["你贴着货箱的阴影走，等搬运工的号子声盖过脚步声，一翻身，从货道尽头钻进了城里。没人看见你。或者说，没人愿意看见你。"],
  1109	      fail:["你刚爬上货垛，一箱铁器滑下来，砸在脚边，哐当一声。税吏和两个搬运工齐齐回头。你赔着笑说是帮工，被骂骂咧咧地撵回了正路。"],
  1110	      crit:["你像一片影子滑过货道。路过那艘银月商船时，你瞥见账房的灰袍下露出一角皮绳，绳上拴着一枚乌黑的牌子，牌面刻着七道细纹。你把这个细节刻进记忆里，头也不回地进了城。"],
  1111	      critfail:["你翻到一半，脚下一滑，整个人摔进货垛里，铁器稀里哗啦滚了一地。税吏吹响了哨子。你被扣下盘问了半个时辰，罚了两枚银币，才带着一身淤青进了城。","城门口的巡兵看了你很久，像在记你的脸。"]
  1112	    },effects:{gold:-2},onCrit:{flag:"silver_ship"},onCritFail:{flag:"tax_record"},go:"fc_jiaohui_entry"}
  1113	  ]
  1114	};
  1115	N["fc_jiaohui_entry"] = {
  1116	  place:"自由城邦 · 交汇城", where:"春一月 · 白日",
  1117	  text:[
  1118	    "交汇城很大。大到能同时容下十个王朝的亡命徒和十个商会的账房。",
  1119	    "正午的广场上，人潮像河一样流。东边一队圣光教会的传教士在布道，白袍上绣着燃烧的太阳，声音洪亮：“主的圣光即将净化这片堕落的土地！”西边一个掮客在袖口里跟人讨价还价，说的是一种你把耳朵贴过去才能听清的语言。",
  1120	    "一个戴着旧皮帽的老头蹲在墙角，面前摆着三枚骰子和一只豁口的碗。他抬头看你，咧嘴一笑，露出缺了半边的牙：",
  1121	    "“新来的？交汇城有规矩：问路要钱，问命要命。你打听什么？”",
  1122	    "远处，一道人影从酒馆的阴影里走出来，又消失在人群里。半精灵的尖耳朵，左手上缠着渗血的绷带。她走得很快，像在躲什么。",
  1123	    "广场中央的布告栏前挤满了人。有人念着公告：“……北方公国联盟征兵，铁门关告急……”“……圣痕司通告：凡窝藏奥术师、灵魂法师者，同罪……”",
  1124	    "这就是交汇城。4037年的交汇城。"
  1125	  ],
  1126	  options:[
  1127	    {t:"先去跛脚酒桶，找蜜尔娜打听消息",go:"fc_tavern"},
  1128	    {t:"去联合冒险者公会，看看有什么活计",go:"fc_guild"},
  1129	    {t:"跟上前方那个半精灵的身影",check:{a:"AGI",sk:"detect",label:"跟踪"},tier:{
  1130	      ok:["你隔着人群缀住那抹身影。她拐进一条窄巷，在一扇钉着铁皮的门前停住，回头——你及时把脸转开。她推门进去了。门缝里飘出一缕烛火和药草的气味。"],
  1131	      fail:["你跟得太近。她骤然停步，转身，目光像刀一样钉在你脸上。你装成问路的，她看了你三息，没说话，走了。那扇铁皮门终究没让你看见。"],
  1132	      crit:["你绕了半条街，从屋顶另一侧看见了她的去向。铁皮门后的窗纸上，映出两个人影，其中一个背着手，身形笔直，像军人。你听见半句被风切断的话：'……银月商会的账，对不上……'"],
  1133	      critfail:["你踩到了一根枯枝。咔。她瞬间回身，左手一扬，一柄匕首抵住你的咽喉。冰冷的刀尖贴着皮肤，她说：'再跟一步，让你躺进下水道。'","你举着手后退，看着她消失在巷子里。左手的绷带渗出血来，她自己也受了伤。"],
  1134	      critfailCon:true
  1135	    },go:"fc_tavern",after:function(){ if(S.flags.ivy_seen) return; S.flags.ivy_seen=true; }},
  1136	    {t:"去城西看看昨夜死了人的酒馆是怎么回事",check:{a:"INT",sk:"detect",label:"探访"},tier:{
  1137	      ok:["城西的酒馆挂着歇业的白布。酒保蹲在门口，说死的是个跑商的老客，死在二楼客房，身上没有伤口，脸上却凝固着极度惊恐的表情。'像是看见了什么不该看的东西。'酒保说着，打了个寒颤。"],
  1138	      fail:["你被拦在门外。伙计说掌柜下了死命令，闲人免进。你只远远看见，有个穿黑袍的人从后门出来，上了马车，车帘上绣着银色的新月。","银月纹章。今天第二次见了。"],
  1139	      crit:["你从后巷翻窗进去。二楼客房已经空了，但墙角留下一道极浅的划痕，像是某种仪式阵残留的刻线。你用指尖描了一遍，线是向外扩张的。有人在屋子里举行过某种'召唤'。","楼下传来脚步声，你从原路翻出去。手指在怀里攥紧，那道阵的轮廓已经刻进脑子里。"],
  1140	      critfail:["你刚凑近门口，就被一只大手按住肩膀。回过头，是两个穿黑衣的壮汉，腰间别着圣痕司的牌子。'异端嫌疑，跟我们走一趟。'","你被关了一夜，第二天一早才被放出来。罪名没坐实，但你的脸，圣痕司的人记住了。"],
  1141	      critfailCon:true
  1142	    },effects:{},onCrit:{flag:"sewer_ritual"},onCritFail:{flag:"tax_record"},go:"fc_tavern"},
  1143	    {t:"在广场上多听听，收集各方向的消息",check:{a:"INT",sk:"lore",label:"打探"},tier:{
  1144	      ok:["你在布告栏前站了一炷香，把各色消息听了个七七八八：北方的铁门关丢了，东军占了关城，北方联盟在征兵；南方的银穗商路税又涨了；教会的净化令从圣城一路烧过来，奥术师和灵魂法师都成了过街老鼠；还有人说，死亡沙漠的商队最近总丢人。"],
  1145	      fail:["你站了半天，只听见些零碎：粮价、房租、哪个码头招短工。乱世的消息传得快，也藏得深。"],
  1146	      crit:["一个货郎压着嗓子告诉你三件事：其一，城西的酒馆昨夜死过人，死相古怪；其二，银月商会的船这几天夜夜卸货，从不点灯；其三，下水道里近来有人听见'念经声'，夜里巡城的卫兵都绕着那段走。","你谢过货郎。这三件事，像三根线头，垂在你面前。"]
  1147	    },effects:{},onCrit:{flag:"rumor_three"},go:"fc_tavern"}
  1148	  ]
  1149	};
  1150	N["fc_tavern"] = {
  1151	  place:"自由城邦 · 交汇城 · 跛脚酒桶", where:"春一月 · 午后",
  1152	  text:[
  1153	    "跛脚酒桶藏在两条街的夹角里，招牌是一只歪倒的木桶，桶口伸出一只男人的脚。据说那是老板年轻时欠的赌债，被债主画上去的。",
  1154	    "门一推，暖气和酒气一起涌出来。柜台后站着蜜尔娜，四十来岁，风韵犹存，一只眼睛上盖着旧伤疤，另一只眼睛亮得像铜板。她擦着杯子，眼皮都没抬：",
  1155	    "“新面孔。喝什么？先说好，赊账免谈。”",
  1156	    "酒馆里人不多。角落里坐着一个半精灵女子，左手的绷带换了新的，面前一杯麦酒几乎没动。她抬眼看你一眼，又垂下眼帘。",
  1157	    "靠窗的桌上，一个灰袍老者正就着烛火看书，书皮上没有字。他翻页的动作很慢，像在咀嚼每一个字。"
  1158	  ],
  1159	  options:[
  1160	    {t:"要一杯麦酒，跟蜜尔娜套话",check:{a:"CHA",sk:"persu",label:"套话",mods:{酒水:5}},tier:{
  1161	      ok:["蜜尔娜收了你的酒钱，话匣子就开了一半。她告诉你：城西那家酒馆死的人，是银月商会的常客，死前最后一晚，有人看见他进了下水道；最近城里查得紧，圣痕司的探子比老鼠还多；还有，北边逃来的难民里，混着不该混的东西，'有人在找一本旧书，出的价，够买一条街。'" ],
  1162	      fail:["蜜尔娜擦着杯子，不接你的话。你用三杯酒也没撬开她的嘴，她只扔给你一句：'想打听事，先有让人值得开口的价。'","倒是墙角那个半精灵，听见你们的对话，目光在你身上停了一瞬。"],
  1163	      crit:["蜜尔娜压低声音，像老朋友一样告诉你三件事：其一，银月商会近半年忽然阔了起来，账目做得天衣无缝，但'阔得不正常'；其二，下水道里那个'念经声'，她派人听过，不是人类的语言；其三，她把你从头到脚看了一遍，说：'你身上有股子味道——要么是快饿死的人，要么是快发迹的人。我赌后者。'","她推过一杯没算钱的酒。”这杯算我请的。别死在下水道里。”"],
  1164	      critfail:["你话太多，问得太密。蜜尔娜脸上的笑慢慢收起来，最后她放下杯子，声音冷下来：'你是圣痕司的人？'","你矢口否认，但她的眼神已经不信了。你结了账，灰溜溜地回到座位上。身后，蜜尔娜朝角落里的半精灵使了个眼色。"]
  1165	    },effects:{gold:-3},onCrit:{flag:"mielna_favor"},onCritFail:{flag:"tax_record"},go:"fc_tavern"},
  1166	    {t:"走向角落的半精灵女子，搭话",check:{a:"CHA",sk:"persu",label:"搭话"},tier:{
  1167	      ok:["你坐到她对面，只说了一句：'你左手的伤，是刀伤。刀刃上抹了东西。'她抬眼，目光锐利起来。片刻后，她缓缓开口：'伊芙琳。你眼神不错。'","伊芙琳告诉你，她在追一条线：有人在这座城里拐走奥术师和灵魂法师的苗子，卖给'某个教会不承认的组织'。她父亲就死在这条线上。'我在找他们运货的入口。有人说，在下水道里。'"],
  1168	      fail:["你刚坐下，她就把麦酒往旁边一推，起身要走。'我不跟陌生人同桌。'你拦了一下，她看你一眼，那目光让你把话咽了回去。她走了两步，又停住，回头扔下一句：'想活得久，夜里别去城南的下水道。'" ],
  1169	      crit:["你提了一句刚才听到的银月商会账目的事。伊芙琳的眼睛亮了一下，她沉默片刻，说：'你也看见了那艘船。'","她告诉你更多：银月商会明面上是南方的大商会，但她查到，近半年所有失踪案的发货地，都指向同一个码头仓库。'我今晚要去查。你要是够胆，码头见。'"],
  1170	      critfail:["你开口就问她的来历。伊芙琳眼神一冷：'查户口的？'她手指在桌上一叩，你面前那杯酒忽然泛起涟漪——你惊觉她的左手按着桌面，而你的腿已经麻了半边。'别再打听我。'她起身离开，步伐稳当，只有你看见她左手的绷带渗出了新血。"]
  1171	    },effects:{},onCrit:{flag:"ivy_ally"},onOk:{flag:"ivy_meet"},go:"fc_guild"},
  1172	    {t:"走向看书的灰袍老者，请教一二",check:{a:"INT",sk:"lore",label:"请教"},tier:{
  1173	      ok:["老者合上书，看了你一眼：'年轻人，是想问路，还是想问命？'你答：'问路，也问这一路的规矩。'他笑了，枯瘦的手指在桌上画了个圈：'这个年头，路是用钱铺的，命是用胆换的。你两样都有几分，'他顿了顿，'就是还缺一样东西——'他点了点自己的太阳穴：'这里。'","他送了你一句话：'深渊最喜欢找的，不是恶人，是走投无路的好人。'说完，他重新翻开书，不再理会你。"],
  1174	      fail:["老者头也不抬：'老朽不教无名之人。'你说了名字，他抬眼看了看，又低头看书：'去冒险者公会挂个号吧。有了名号，再来谈'请教'二字。'"],
  1175	      crit:["老者审视你良久，忽然问：'你可知这大陆上有多少超凡者？'你摇头。他竖起两根手指：'五十万到八十万。一百人里，只有一两个。'又竖起一根：'大师以上，全大陆只有二百五到四百人。'他意味深长地看着你：'稀缺的东西，要么被供奉，要么被猎杀。你想当哪一种？'","临走时，他塞给你一本薄薄的册子。封皮无字，翻开是《[[JB0]]》。'拿去看。看不看得懂，看你造化。'"]
  1176	    },effects:{},onCrit:{book:function(){const j=JOBS[S.job]; return j.books[0][0];}},onOk:{flag:"scholar_met"},go:"fc_guild"},
  1177	    {t:"什么也不做，静静喝酒，听四面八方的谈话",check:{a:"SPR",sk:"detect",label:"聆听"},tier:{
  1178	      ok:["你竖着耳朵，把酒馆里的谈话滤了一遍：桌角两个佣兵在争论铁门关的战局，'东军那帮人，邪门得很，听说阵前有黑烟'；柜台边一个账房抱怨银月商会抢生意，'他们的价，低得不像做生意，像在做局'；最里面一桌，一个醉汉反复念叨：'下水道……有门……有门……'","你把这些记在心里。"],
  1179	      fail:["酒馆太吵。你听了半天，只记住隔壁桌划拳的吆喝和麦酒的味道。"],
  1180	      crit:["你从嘈杂中捕捉到最关键的一句。角落里那个醉汉被同伴架走前，含糊地说：'……那门后面有人说话，说的是……话，不是人话……'你追出去，醉汉已经消失在巷子里。但你记住了：下水道，有一扇门。"]
  1181	    },effects:{},onCrit:{flag:"sewer_door"},go:"fc_guild"}
  1182	  ]
  1183	};
  1184	N["fc_guild"] = {
  1185	  place:"自由城邦 · 冒险者之城 · 联合冒险者公会", where:"春一月 · 傍晚",
  1186	  text:[
  1187	    "冒险者公会的大厅比酒馆大三倍，也吵三倍。布告板上钉满委托：护送商队、猎杀魔兽、清理地窖、找猫。一只猫的委托后面画着三个感叹号，赏金比护送商队还高。",
  1188	    "柜台后坐着一个铁塔般的汉子，右眼上有一道旧疤，左臂是铁的。他是公会在这里的分会长，霍根。他上下打量你，咧开嘴：",
  1189	    "“新人？公会规矩：先注册，再接活。注册费五银币。没钱的，先去跑腿。”",
  1190	    "他的目光扫过你，落在你腰间的旧武器上（或者你空荡荡的手上），补了一句：",
  1191	    "“不过今天有一桩急活，正缺人手。城南下水道，昨夜有一队巡夜卫兵没出来。赏金不错，就是晦气。你要接，注册费免了。”",
  1192	    "角落里，伊芙琳背靠柱子站着，听见'下水道'三个字，抬起了眼。"
  1193	  ],
  1194	  options:[
  1195	    {t:"接下下水道的委托（注册费免了）",effects:{gold:5},tier:{
  1196	      ok:["霍根把一张皱巴巴的委托单推给你：'找到失踪的巡夜卫兵，活要见人，死要见尸。赏金五十银币，带回线索再加。'他顿了顿：'不过小子，我劝你买根火把。那段下水道，最近有点不对劲。'","你在注册簿上按下手印。从此，冒险者公会多了一个名字。"]
  1197	    },flag:"guild_member",go:"fc_sewer"},
  1198	    {t:"先接几个跑腿小活，攒点家底",check:{a:"AGI",sk:"athletic",label:"跑腿"},tier:{
  1199	      ok:["你跑了三趟腿：送信、搬货、替一位炼金师取药。日落时，你手里多了十二枚银币，也混了个脸熟。霍根看在眼里：'还行，不是娇气的。那下水道的活，我给你留着。'"],
  1200	      fail:["你送错了一封信，被货主追骂了半条街。好在还是赚了五枚银币。霍根在旁边看得直摇头。"],
  1201	      crit:["你不但跑完了活，还顺手帮炼金师修好了他卡住的蒸馏器。他多给了你五枚银币，还塞给你一瓶'闻着像药、其实是酒'的东西：'路上用的。'" ],
  1202	      critfail:["你撞翻了一筐鸡蛋，又踩了货主的脚。赔了钱，还被记了个'毛手毛脚'。霍根把那皱巴巴的下水道委托单拍在你面前：'明天之前，把这单接了吧。你这样的，跑腿会饿死。'"]
  1203	    },effects:{gold:12},onCrit:{item:"炼金师赠酒"},go:"fc_guild"},
  1204	    {t:"私下问霍根，这桩委托背后有什么说法",check:{a:"INT",sk:"detect",label:"盘问"},tier:{
  1205	      ok:["霍根压低声音：'失踪的巡夜卫兵是三个老兵，下水道那段路他们闭着眼都能走。能让他们出不来的，不是野兽。'他顿了顿：'前天，有个跑商的老客，也死在那附近，死相难看，被教会的人连夜收走了。'","他看了你一眼：'你要查，就查到底。别查一半，把自己搭进去。'"],
  1206	      fail:["霍根闭口不谈：'打听太多的人，活不长。接活就干活，别问东问西。'"],
  1207	      crit:["霍根沉默片刻，把一条更深的线递给你：'那三个卫兵失踪前一晚，有人看见银月商会的马车停在井盖边上。三更天。'他说完就不肯再多讲，只叮嘱你：'小心银月商会。他们近半年的账，干净得像假的一样。'"]
  1208	    },effects:{},onCrit:{flag:"silver_suspect"},go:"fc_guild"}
  1209	  ]
  1210	};
  1211	N["fc_sewer"] = {
  1212	  place:"自由城邦 · 城南下水道", where:"春一月 · 入夜",
  1213	  text:[
  1214	    "下水道比你想的宽敞，也比你想的脏。水没到小腿肚，泛着铁锈与腐物的气味。火把的光在石壁上晃出巨大的影子。",
  1215	    "走了一刻钟，你看到了第一具尸体。巡夜卫兵的制服，胸口被什么东西剖开，脸朝下趴在水里。脸上没有血，惨白，五官扭曲——像是死前看见了什么。",
  1216	    "你蹲下来查看。伤口整齐，边缘发黑，不是野兽咬的。",
  1217	    "更深处，隐隐传来声音。断断续续，像是有人在唱歌，又像是在念经。那声音钻进耳朵里，让你的头皮一阵发麻。",
  1218	    "路在前方分岔。左，声音传来的方向；右，一扇虚掩的铁门，门缝里透出微光。"
  1219	  ],
  1220	  options:[
  1221	    {t:"循着声音，往左边深处走",check:{a:"SPR",sk:"will",label:"意志",note:"对抗异常之声"},tier:{
  1222	      ok:["你握紧武器（或者握紧拳头），顶着那声音往里走。声音越来越近，你渐渐听清——不是歌，也不是经，是一串你从未听过的音节，重复、规律，像某种召唤。","拐过最后一个弯，你看见：三个黑袍人围着一具尸体，正在低诵。尸体的胸口，同样有一道发黑的伤口。他们脚下画着繁复的阵纹，阵纹的边缘，正缓缓渗出水银般的光。"],
  1223	      fail:["那声音钻进脑子，你的脚步慢了下来。一阵眩晕，你扶住墙壁，指尖碰到湿冷的青苔。好一会儿，声音才轻了些。你咬着牙继续走，但刚才那一下，已经让你后背全是冷汗。"],
  1224	      crit:["你压下心头的不适，反而借那声音辨认方位——你曾在某本旧书上见过类似的音节，是'引导'类仪式的咒文。你不动声色地靠近，数清了人数：三个。阵纹的走向：向外，朝地面扩张。','他们在给什么东西'开门'。'这个念头让你手心的汗凉了下来。"],
  1225	      critfail:["那声音忽然在你脑子里炸开。你眼前一黑，扶墙的指尖掐进青苔里。再睁眼时，你发现自己已经站在那三个黑袍人身后三丈处，他们正缓缓回头。","你暴露了。"],
  1226	      critfailCon:true
  1227	    },onCrit:{flag:"ritual_seen"},go:"fc_sewer2"},
  1228	    {t:"推开右边虚掩的铁门，先看微光处",check:{a:"AGI",sk:"stealth",label:"潜行"},tier:{
  1229	      ok:["你无声地推开门。门后是一间干燥的密室，堆着木箱。你翻开来——一半是粮食和药品，另一半，是符文武器和铁器。箱底压着一叠文书，你抽出一张：抬头是银月商会的印鉴，落款处却盖着一个陌生的纹章：七道细纹，环绕一只竖瞳。","你把文书塞回原处，退出密室，心跳如鼓。银月商会，和下水道里的黑袍人，是同一条线。"],
  1230	      fail:["铁门锈蚀，发出刺耳的呻吟。你刚进去，就听见深处传来脚步声。你闪身躲到箱后，等那脚步声过去，才发现自己掌心全是汗。箱里的东西来不及细看，你只记下了银月商会的印鉴。"],
  1231	      crit:["你不但看清了箱里的东西，还在墙角发现一本薄薄的账册。你飞快地翻了几页：日期、数量、去向——'运往死亡沙漠'。最后一页只写着一个地址，地址下压着半枚乌黑的牌子，与你在码头那艘银月船上见过的，一模一样。","你把账册放回原处，只记住了该记住的。"],
  1232	      critfail:["你刚碰到铁门，门后突然传来一声干咳。一个沙哑的声音说：'既然来了，就进来吧。'你僵在原地，门从里面被拉开，一个灰袍人站在门后，脸上挂着一个没有温度的笑。","'别紧张。我们等的人，正好到了。'"]
  1233	    },effects:{},onCrit:{flag:"silver_ledger"},onCritFail:{flag:"caught_sewer"},go:"fc_sewer2"},
  1234	    {t:"先把卫兵的尸体拖到安全处，检查他身上的遗物",check:{a:"INT",sk:"detect",label:"勘查"},tier:{
  1235	      ok:["你翻遍了卫兵的口袋。找到一块浸水的巡夜令牌、半截断刃，和一张叠得整整齐齐的纸条。纸条上的字迹潦草：'第三班，井盖五号，戌时。勿带火把。'","戌时。今晚。井盖五号。你默默记下时间。"],
  1236	      fail:["你翻找时，尸体口袋里涌出一股水流，什么也没翻出来。倒是你沾了一手的污秽。"],
  1237	      crit:["你在卫兵靴底的夹层里，摸出一枚乌黑的铁牌。牌面刻着七道细纹，环绕一只竖瞳——与银月商会账房身上露出的那枚，一模一样。卫兵的死，果然不是意外。","你把铁牌收进怀里。它很凉，像一块刚从冰水里捞出来的石头。"],
  1238	      critfail:["你翻找的动作惊动了水下的东西。尸体忽然'咯'地响了一声，你猛地后退，火把一照——只是水泡破裂。但你的心跳久久不能平复，总觉得暗处有什么在看着你。"]
  1239	    },effects:{},onCrit:{item:"乌黑铁牌（七纹竖瞳）"},go:"fc_sewer2"}
  1240	  ]
  1241	};
  1242	N["fc_sewer2"] = {
  1243	  place:"自由城邦 · 城南下水道 · 深处", where:"春一月 · 入夜",
  1244	  text:[
  1245	    "你最终站在了那间密室门口。",
  1246	    "烛火摇曳。三个黑袍人围着一具尸体，低诵着那串音节。尸体是第二个失踪的卫兵。阵纹已经画完，水银般的光在纹路里流动，像血管。",
  1247	    "为首的黑袍人抬起头。兜帽下是一张瘦削的脸，颧骨很高，眼睛深陷。他看着你，没有惊慌，甚至笑了一下：",
  1248	    "“冒险者？来得正好。这个阵，还缺一点'活气'。”",
  1249	    "他手一抬，你脚下的石板忽然亮起微光——你踏进了阵法的边缘。那声音瞬间放大，钻进你的脑子，像无数根针。",
  1250	    "战斗。或者说，求生。"
  1251	  ],
  1252	  options:[
  1253	    {t:"不退反进，先发制人",check:{a:"STR",sk:"martial",label:"强攻",mods:{}},tier:{
  1254	      ok:["你顶着头痛冲上去。黑袍人显然没想到一个'冒险者'会这么果断，他仓促抬手，一道黑光打来——你侧身避开，武器已经递到他面前。他后退，阵纹的光一滞。","第一个黑袍人倒下。剩下两个，阵势已乱。"],
  1255	      fail:["你刚冲两步，头痛炸开，脚下一软。黑光擦着你的肩膀过去，火辣辣地疼。你被迫后撤，撞在石壁上。为首的黑袍人笑了：'凡人，就是凡人的打法。'"],
  1256	      crit:["你像一头被逼到墙角的野兽，出手又快又狠。黑袍人连退三步，他的咒文被你的节奏打断，阵纹的光芒忽明忽灭。你听见他低骂了一声：'废物教的废物。'","一记重击，他倒撞在墙上，手里的仪式器皿摔成碎片。水银般的光骤然熄灭。"],
  1257	      critfail:["你冲得太急，踩进阵纹的亮光里。一瞬间，那声音在你脑子里轰然炸开，你看见无数张扭曲的脸——然后，你的身体僵住了。黑袍人的手按上你的额头，冰冷的声音在你耳边响起：'这个，倒是个不错的材料。'","你拼尽全力挣开，喉头一甜，吐出一口血。你退到墙角，视线模糊。"],
  1258	      critfailCon:true
  1259	    },effects:{xp:30},onFail:{hp:-15},onCritFail:{hp:-25,san:-8,flag:"marked_sewer"},go:"fc_sewer3"},
  1260	    {t:"先稳住心神，找机会破坏阵纹",check:{a:"SPR",sk:"will",label:"意志",note:"抵抗精神侵蚀"},tier:{
  1261	      ok:["你咬着牙，把脑子里那声音压下去。视线重新清晰。你盯住阵纹的源头——那具尸体胸口插着的黑曜石刀。只要拔出它，阵就废了。","你猛地扑向尸体，在黑袍人反应过来之前，拔出了那把刀。阵纹的光像被抽走了血，瞬间暗淡。"],
  1262	      fail:["你努力稳住心神，但那声音太强了。你晃了晃，扶住墙。黑袍人趁机念完了最后一个音节，阵纹猛地一亮——尸体'睁'开了眼睛。","那不是活人的眼睛。是两团黑火。"],
  1263	      crit:["你不仅稳住了心神，还借着阵光看清了更多：阵纹的走向、黑袍人的站位、还有角落里的一个铁笼——笼子里蜷着一个人，穿着巡夜卫兵的制服，还活着！","你拔出黑曜石刀，阵灭。笼子里的卫兵剧烈地咳嗽起来。"],
  1264	      critfail:["你试图稳住心神，但那声音找到了一条裂缝。你眼前一黑，再回过神时，你已经跪在地上，双手掐着自己的脖子。黑袍人的笑声从头顶传来：'好苗子。可惜，来得太晚了。'","你拼着最后一点力气咬破舌尖，腥甜的味道让你清醒过来。你连滚带爬地退开。"],
  1265	      critfailCon:true
  1266	    },effects:{xp:25},onOk:{flag:"prisoner_alive"},onFail:{hp:-20,san:-5},onCritFail:{hp:-20,san:-10,flag:"marked_sewer"},go:"fc_sewer3"},
  1267	    {t:"虚晃一枪，诈作逃窜，诱敌深入再反杀",check:{a:"INT",sk:"persu",label:"诈术",note:"智斗"},tier:{
  1268	      ok:["你惨叫一声，转身就跑，跑得踉踉跄跄，像一只丧家之犬。黑袍人不疑有他，追了出来——他刚迈出阵纹，你回身就是一记。","他脸上的错愕还没来得及展开，就已经挨了实实在在的一下。阵纹失去主阵者，光芒大乱。你趁乱补刀，第一个黑袍人倒地。"],
  1269	      fail:["你演得不像。黑袍人站在原地，阴恻恻地笑：'省省吧。见过太多想跑的了。'他手一抬，你脚下石板发烫，你被迫跳开，阵纹的光又亮了几分。"],
  1270	      crit:["你的演技骗过了所有人。黑袍人追出三步，你回身一击正中要害，同时一脚踢翻那具'睁眼'的尸体，黑曜石刀脱手飞出——钉在阵纹的正中心。","光，灭了。密室陷入死寂。你听见自己粗重的喘息，和铁笼里卫兵喜极而泣的呜咽。"],
  1271	      critfail:["你转身逃跑的瞬间，脚踝一紧——一根黑线不知何时缠住了你。你被拖倒在地，拽回阵纹中央。黑袍人的声音从头顶传来：'聪明的猎物，通常死得最快。'","你拼命挣扎，挣开了那根线，代价是脚踝一片血肉模糊。你瘸着腿退到墙边，退无可退。"],
  1272	      critfailCon:true
  1273	    },effects:{xp:25},onFail:{hp:-15},onCritFail:{hp:-20,san:-5,flag:"marked_sewer"},go:"fc_sewer3"}
  1274	  ]
  1275	};
  1276	N["fc_sewer3"] = {
  1277	  place:"自由城邦 · 城南下水道 · 密室", where:"春一月 · 深夜",
  1278	  text:[
  1279	    "最后一个黑袍人倒在你面前时，密室安静得能听见烛芯燃烧的噼啪声。",
  1280	    "你赢了。但赢得不轻松。",
  1281	    "阵纹已经熄灭。尸体躺回冰冷的地上，那两团'黑火'的眼睛缓缓合上。铁笼里的卫兵蜷缩着，浑身发抖，嘴里反复念叨着一句话：",
  1282	    "“它们……它们在找……一扇门……门后面……有人说话……”",
  1283	    "你蹲下来检查黑袍人的遗物。为首的灰袍人袖中掉出一封信，火漆是陌生的纹章——七道细纹，环绕竖瞳。你拆开，字迹潦草：",
  1284	    "“……第七节点松动在即。圣城那边，继续放'净化令'的火。让他们忙着烧异端，没人会注意……深渊的脚步……”",
  1285	    "信纸在你手里微微发凉。你抬起头，看见密室角落的墙上，刻着一道浅浅的划痕——与城西酒馆二楼那道'召唤阵'的残留，一模一样。",
  1286	    "你终于明白了一件事：这座自由城邦的地下，盘着一条远比失踪案粗的蛇。"
  1287	  ],
  1288	  options:[
  1289	    {t:"搜走值钱的东西和信物，救出卫兵，撤离下水道",check:{a:"INT",sk:"detect",label:"搜查"},tier:{
  1290	      ok:["你在黑袍人身上搜出三十五枚银币、一柄做工精良的仪式短刀，还有一枚与银月商会账房身上相同的乌黑铁牌。你把铁牌收好，扶起卫兵，一步一步走出下水道。","身后的黑暗里，那声音还在响。但这一次，它没有追上来。"],
  1291	      fail:["你搜得仓促，只摸到十几枚银币。卫兵受惊过度，你费了很大劲才把他拖出来。"],
  1292	      crit:["你搜得极仔细。除了银币和铁牌，你还在灰袍人的靴底夹层里发现一张薄纸：一张地图，标注着大陆上的七个点——其中六个画着圆圈，第七个，在死亡沙漠深处，画着一只竖瞳。","你默默记下地图，然后把它放回原处。有些东西，看了就要负责。"]
  1293	    },effects:{gold:35,xp:40,rep:5},onCrit:{flag:"seven_nodes_map"},go:"fc_report"},
  1294	    {t:"先审问还能说话的俘虏（若有）",check:{a:"CHA",sk:"persu",label:"审讯"},tier:{
  1295	      ok:["第二个黑袍人还吊着一口气。你用刀尖在他面前晃了晃，他供得很快：'我们是……教团的……外围。收人，运货，都听……'他指了指胸口：'……使者的安排。银月商会……是钱袋子……'","'你们收什么人？''有资质的……奥术师、灵魂法师……还有……'他忽然哆嗦起来：'还有……不肯卖的……就做成……材料……'","他没能说完。最后一个字变成一口血，他头一歪，死了。你站在原地，手指攥紧了刀柄。"],
  1296	      fail:["俘虏只剩一口气，你问什么他都只是抖。最后他咽了气，你什么也没问出来。"],
  1297	      crit:["你撬开了他的嘴，还撬出了更深的东西：'……使者……七位……每个管一桩……罪……'他眼神涣散地笑：'我们不是最大的……最大的，在圣城的光明里……'","'圣城的光明里。'你把这个细节记在心里。他随即咽气，脸上还挂着那个诡异的笑。"]
  1298	    },effects:{xp:30},onCrit:{flag:"seven_apostles"},go:"fc_report"},
  1299	    {t:"把那封信收好，不多停留，立刻撤离",effects:{xp:20,rep:3},tier:{
  1300	      ok:["你果断离开。信在怀里，沉甸甸的。你知道，从今晚起，你手里握着的东西，会让很多人睡不着觉。","走出下水道时，晨光刚刚爬上城墙。你眯着眼适应光线，看见远处布告栏前，又围了一圈人。"]
  1301	    },go:"fc_report"}
  1302	  ]
  1303	};
  1304	N["fc_report"] = {
  1305	  place:"自由城邦 · 冒险者公会", where:"春一月 · 次日清晨",
  1306	  text:[
  1307	    "你把卫兵交给公会的医者。霍根看着你一身狼狈，又看了看你带回来的东西，沉默了很久。",
  1308	    "“小子，你这一趟，值五十银币。但你带回来的消息，值五十条命。”",
  1309	    "他把赏金推给你，又加了一倍：“这是买你闭嘴的钱。今晚的事，出了这扇门，就当没发生过。”",
  1310	    "你点头。你当然不会说。但你也知道，有些东西，看见了就是看见了，捂不住。",
  1311	    "角落里，伊芙琳靠在柱子上，目光落在你身上。你走过去，把一枚乌黑铁牌放在她面前的桌上。",
  1312	    "她的瞳孔猛地一缩。"
  1313	  ],
  1314	  options:[
  1315	    {t:"把铁牌的事告诉伊芙琳，交换情报",check:{a:"CHA",sk:"persu",label:"坦诚"},tier:{
  1316	      ok:["伊芙琳盯着那枚铁牌看了很久，才开口：'……这个纹章，我找了一年。'她把自己的情报推给你：银月商会的账目、失踪者的名单、还有一条她追到半路断掉的线。'教团的钱，最终都流向死亡沙漠。但我进不去。'","她看着你：'你帮我到这一步，我欠你一次。'她留下一个地址：'在圣城，有一个我的人。报我的名字。'"],
  1317	      fail:["伊芙琳看了你一眼，把铁牌推回来：'我不跟刚认识的人谈这个。'但她还是多说了半句：'……你查到了这一步，就查到底吧。查到底的人，要么封神，要么下地狱。'"],
  1318	      crit:["你把下水道里的一切都告诉了她，包括那封信、那张地图、还有'圣城的光明里'那句话。伊芙琳的脸色第一次变了。她沉默了很久，说：'……你比我想的，陷得深。'","她给了你两样东西：一枚刻着她名字的信物，和一个忠告：'圣城的人，未必都是圣徒。你到了那里，去找一个叫'烛台'的旧书店。'"]
  1319	    },effects:{rep:3},onCrit:{flag:"ivy_token"},go:"fc_archive"},
  1320	    {t:"只交差，不多说。铁牌的事，自己留着",effects:{xp:25,gold:25},tier:{
  1321	      ok:["你只交了任务，领了赏金。铁牌、信、地图，都留在你的行囊里。","有些秘密，知道的人越少，越安全。你决定自己先捂着。","不过你留意到，伊芙琳的目光一直跟着你走出大门。"]
  1322	    },go:"fc_archive"},
  1323	    {t:"向霍根打听，城里哪里能学东西、买书",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  1324	      ok:["霍根大手一挥：'学东西？城北有个老学究，收过路费教'杂学'；买书去'默页书肆'，掌柜是个怪人，只卖他看得上的书。'他顿了顿：'不过小子，你要真想学本事，这条路长着呢。'","你按他说的，找到了默页书肆。掌柜是个白发老头，听说你要买[[JB1]]，从柜台底下摸出那本书，拍在你面前：'十枚银币。爱买不买。'"],
  1325	      fail:["霍根懒得细说：'自己打听去。公会这么多人，别逮着我一个问。'你碰了个软钉子。"],
  1326	      crit:["霍根不但指了路，还给你写了封荐书：'拿去给默页书肆的老许，就说霍根介绍的，能给你打个折。'你谢过他。这年头，一封荐书，抵得上十枚银币。"]
  1327	    },effects:{gold:-10},onCrit:{flag:"guild_rec"},onOk:{book:function(){const j=JOBS[S.job]; return j.books[0][1];}},onFail:{},go:"fc_archive"}
  1328	  ]
  1329	};
  1330	N["fc_archive"] = {
  1331	  place:"自由城邦 · 交汇城 · 默页书肆", where:"春一月 · 午后",
  1332	  text:[
  1333	    "默页书肆在一条安静的死胡同尽头。门上挂着风铃，你一推门，铃声响得清脆。",
  1334	    "白发掌柜老许从书堆后探出头，上上下下打量你：",
  1335	    "“买书？还是躲雨？”",
  1336	    "你没答，先把（你从霍根或老者处得来的）基础典籍放在柜台上，又说了说你的来历。老许的眼睛慢慢亮起来：",
  1337	    "“哦？识字？这年头，会看字的比会打仗的稀罕。”",
  1338	    "他从书架深处抽出一本皮面旧书，掸了掸灰，递给你。书脊上没有字，翻开来，扉页上只有一行手写的字：",
  1339	    "“知识是阶梯，也是火。爬上去，或者被烧死。”",
  1340	    "你翻开书页。墨香混着旧纸的气息扑面而来。这是你职业道路上的第一本书——[[JB1]]。"
  1341	  ],
  1342	  options:[
  1343	    {t:"买下这本书，好好研读（完成入门知识）",check:{a:"INT",sk:"lore",label:"研读"},tier:{
  1344	      ok:["你在书肆的角落读了一下午。老许给你续了三次茶，一句话也没多问。等你合上书时，窗外的光已经斜了。","那些字句在你脑子里扎了根。你合上书，长出一口气——入门的知识，已经有了。"],
  1345	      fail:["你读得头昏脑涨，字都认识，连起来就不懂。老许在旁边嗤笑：'急什么。路是一步一步走的，书是一页一页翻的。'你只得把书买回去，慢慢啃。"],
  1346	      crit:["你不但读懂了，还读出了字里行间的东西。你在页边发现一行极淡的铅笔小字，是前人批注，写的是一句口诀式的总结。你看了三遍，记下了。","老许看着你的眼神变了变，咕哝了一句：'……倒是个有慧根的。'"],
  1347	      critfail:["你读着读着，忽然一阵心悸。书页上的字像活了一样扭动起来，你眼前发黑，耳边响起下水道里那种声音。你猛地合上书，冷汗直流。","老许从柜台后探出头，意味深长地看了你一眼：'……书有书的脾气。你心里装着的东西，会影响你读到的字。'"]
  1348	    },effects:{xp:20},onOk:{book:function(){const j=JOBS[S.job]; return j.books[0][1];}},onCrit:{flag:"margin_note"},go:"pro_realm1"},
  1349	    {t:"先不买书，向老许打听城里的门道",check:{a:"CHA",sk:"persu",label:"攀谈"},tier:{
  1350	      ok:["老许一边理书一边跟你聊：'城里现在的门道？一，别碰教会的东西，净化令烧起来六亲不认；二，银月商会的买卖，看着便宜，后面有钩子；三——'他压低声音：'下水道的事，昨晚过后，少管。'","他顿了顿：'不过你要真想在这乱世活下去，先把本事练起来。书，还是要读的。'"],
  1351	      fail:["老许话不多：'买书就买书，打听事去酒馆。'你碰了个冷脸。"],
  1352	      crit:["老许看出你眼里的东西，破例多说了一句：'……你知道这大陆为什么乱吗？'你没答。他自顾自说下去：'因为能镇住场子的人，一个接一个地老了、死了、失踪了。'他指了指窗外：'你看，太阳照样升。但有些地方，太阳已经不亮了。'"]
  1353	    },effects:{},onCrit:{flag:"old_xu_wisdom"},go:"pro_realm1"}
  1354	  ]
  1355	};
  1356	N["pro_realm1"] = {
  1357	  place:"自由城邦 · 交汇城 · 城北空地", where:"春一月 · 夜",
  1358	  text:[
  1359	    "夜深了。城北的空地上一片寂静，只有风在瓦片间穿行。",
  1360	    "你盘膝坐在一块石板上。面前摊着那本入门典籍，还有你从下水道带回来的[[JM0]]。",
  1361	    "书里的字句在你脑中流转。下水道里的搏杀、黑袍人的咒文、那枚乌黑的铁牌、还有你自己——这一切混在一起，在某个瞬间，忽然通了。",
  1362	    "你感到一股陌生的力量从丹田深处升起，像第一簇火苗，舔舐着你的经脉。",
  1363	    "这是你的职业之道。这是你叩响的第一扇门。",
  1364	    "现在，推开它。"
  1365	  ],
  1366	  options:[
  1367	    {t:"凝神静气，冲击启灵境（完成首次破境）",check:{a:"SPR",sk:"will",label:"破境",note:"职业入门"},
  1368	     after:function(){
  1369	       const j=JOBS[S.job];
  1370	       if(!S.mats[j.mats[0]]) S.mats[j.mats[0]]=1;
  1371	       j.books[0].forEach(b=>{ if(!S.books[b]) S.books[b]=true; });
  1372	     },
  1373	     afterOk:function(){
  1374	       if(S.realm===0){
  1375	         S.realm=1; S.maxSan+=5; S.san=S.maxSan; S.hp=maxHp();
  1376	         writePar("（境界晋升：凡人境 → 启灵境 · "+JOBS[S.job].titles[1]+"。此后可在『修炼』面板查看后续晋升路径。）","noind flagline");
  1377	         logMsg("破境！启灵境 · "+JOBS[S.job].titles[1],"l");
  1378	       }
  1379	     },
  1380	     tier:{
  1381	      ok:["你闭上眼，让那股力量沿着书里描述的路走。一开始很痛，像有人在你骨头缝里刮。你咬紧牙关，想起灰港的雾、交汇城的灯火、下水道里的黑火，还有那封火漆信。","'我要走下去。'","轰。一声轻响，像有什么东西在体内碎了，又有什么东西长了出来。你睁开眼，世界不一样了——你能看见风，能听见灯火，能感觉到脚下石板深处，一条暗河在缓缓流淌。","**破境。启灵境。**从今往后，世间有[[JT1]]之名。你的职业之道，正式启程。"],
  1382	      fail:["那簇火苗在你体内跳了跳，又熄了。你睁开眼，满身是汗。力量退回丹田深处，像一条不肯出洞的蛇。","你低头看那本典籍。还差一点。火候，还差一点。","（条件已备。修为与心境再沉淀，即可再次冲击。）"],
  1383	      crit:["你不仅破了境，还在那一瞬间看清了自己的道。典籍上的字句、下水道的搏杀、老许说的那句话，在你脑中串成一条线。你忽然明白，这一境，你走得比别人快。","**破境。启灵境。**不仅如此——你隐约感到，自己的根基比寻常人扎实一分。","（首次破境奖励：核心属性 +2）"],
  1384	      critfail:["你强行冲击，力量在体内乱窜。胸口剧痛，你哇地吐出一口血。那簇火苗非但没燃起来，反而烫伤了你。","你扶着石板喘了很久。耳边隐约响起下水道里那种声音——它在笑。","（破境失败：受创，SAN-5。勿强行冲关，先稳固心境。）"]
  1385	    },effects:{xp:20},onOk:{cond:"pra",attr:{SPR:2}},onCrit:{attr:{SPR:2,INT:2}},onFail:{hp:-10},onCritFail:{hp:-15,san:-5},go:"pro_after"}
  1386	  ]
  1387	};
  1388	N["pro_after"] = {
  1389	  place:"自由城邦 · 交汇城", where:"春一月 · 晨",
  1390	  text:[
  1391	    "第二天清晨，你被窗外的马蹄声吵醒。",
  1392	    "街上比往常热闹。一支车队正从东门进城，车上插着北方的旗帜——蓝色盾牌，七颗星。那是北方公国联盟的使团。车旁跟着武装骑兵，铠甲上的铁锈味隔着半条街都能闻到。",
  1393	    "布告栏前又围满了人。你挤进去，看见最新的公告：",
  1394	    "“铁门关失守。东军三万已越关，北方公国联盟宣布动员。凡超凡者，可应征入伍，赏金从优。”",
  1395	    "另一张告示上，圣痕司的黑色印章赫然在目：“净化令扩展。凡窝藏奥术师、灵魂法师、归墟教徒者，同罪。”",
  1396	    "人群里有人骂，有人哭，有人匆匆离开。",
  1397	    "你站在布告栏前，阳光落在你脸上。你已经不是三天前那个从灰港下船的难民了。你有了名字，有了职业，有了一枚乌黑的铁牌，和一条通向大陆深处的线。",
  1398	    "世界很大。九大势力，二十二座名城，无数地标与秘密，都在等着你。"
  1399	  ],
  1400	  options:[
  1401	    {t:"向北——去北方公国联盟，铁门关在打仗，战场最养人",go:"pro_choose_north"},
  1402	    {t:"向南——去南方商业城邦联盟，金币与消息都流经那里",go:"pro_choose_south"},
  1403	    {t:"向东——去精灵森林与东部王国，看看迷雾与帝京",go:"pro_choose_east"},
  1404	    {t:"先向西——矮人王国的矿脉与圣光教会的圣城，一探究竟",go:"pro_choose_west"},
  1405	    {t:"留在自由城邦，把下水道的线再挖深一层",go:"fc_stay"}
  1406	  ]
  1407	};
  1408	N["pro_choose_north"] = {
  1409	  place:"自由城邦 · 交汇城 · 北门", where:"春一月 · 晨",
  1410	  text:[
  1411	    "你选了北方。铁门关的战鼓、艾尔达城的魔法学院、北境的雪——都在等你。",
  1412	    "出城时，守门的税吏——就是你第一天遇见的那位——看着你，居然认出了你：",
  1413	    "“哟，小子的气色不一样了。有奇遇？”",
  1414	    "你没答，只笑了笑。他也不再问，摆摆手：",
  1415	    "“走吧。往北，小心铁门关的方向。东军那帮人，邪门。”",
  1416	    "你翻身上了雇来的马（或者背上行囊，迈开腿）。晨光在身后铺开，自由城邦的轮廓渐渐变小。",
  1417	    "前方，大陆在展开。"
  1418	  ],
  1419	  options:[
  1420	    {t:"出发，前往艾尔达城",go:"travel_north_start"},
  1421	    {t:"先去铁壁城，看看前线",go:"travel_tiebi_start"},
  1422	    {t:"先折返，把城里的支线办完再说",go:"fc_stay"}
  1423	  ]
  1424	};
  1425	N["pro_choose_south"] = {
  1426	  place:"自由城邦 · 交汇城 · 南门", where:"春一月 · 晨",
  1427	  text:[
  1428	    "你选了南方。黄金城的账房、魔械城的飞空艇、港口城的帆——都在等你。",
  1429	    "南门外，一支商队正在整装。商队的掌柜听说你要去南方，上下打量你一番，说：",
  1430	    "“搭个伴？到商栈城，收你两枚银币。路上有个会点拳脚的，总比没有强。”",
  1431	    "你看见商队的旗子上，绣着一弯银色的新月。",
  1432	    "银月商会。"
  1433	  ],
  1434	  options:[
  1435	    {t:"婉拒，独自上路",go:"travel_south_start"},
  1436	    {t:"答应搭伴，正好探探银月商会的底",check:{a:"CHA",sk:"persu",label:"攀谈"},tier:{
  1437	      ok:["你一路和商队的伙计搭话，套出不少东西：这支商队运的是粮，账房是个寡言的年轻人，掌柜姓周，据说是南方人。只是说到货物去向，人人都含糊其辞。","到商栈城时，你除了知道银月商会的账房先生记性极好，别的没问出来。但你已经记住了那面旗。"]
  1438	    },go:"travel_south_start"},
  1439	    {t:"不急着走，先在城里办完事",go:"fc_stay"}
  1440	  ]
  1441	};
  1442	N["pro_choose_east"] = {
  1443	  place:"自由城邦 · 交汇城 · 东门", where:"春一月 · 晨",
  1444	  text:[
  1445	    "你选了东方。精灵森林的迷雾、东部王国的帝京、铁门关的古战场——都在等你。",
  1446	    "东门外，官道笔直地伸向远方。一个旅行的吟游诗人坐在路边的石头上，正拨着琴弦。他看见你，咧嘴一笑：",
  1447	    "“往东走？那可得听一首《铁门关谣》。”",
  1448	    "他的琴声苍凉：",
  1449	    "“铁门关外铁衣寒，白骨成山血未干。十年征夫十年泪，不见故人见孤烟。”",
  1450	    "“新来的旅者，东边，可不比自由城邦太平。”"
  1451	  ],
  1452	  options:[
  1453	    {t:"谢过吟游诗人，继续上路",go:"travel_east_start"},
  1454	    {t:"向吟游诗人打听东边的情报",check:{a:"INT",sk:"lore",label:"打听"},tier:{
  1455	      ok:["吟游诗人拨着琴弦，把东边的事倒了个干净：东部王国的皇帝励精图治，特科科举网罗天下超凡者，'考上了，就是官；考不上，就是草'；精灵森林闭关三百年，外人进不去；铁门关现在是东军的地盘，'夜里能听见关城里有哭声，据说不是人哭的'。"],
  1456	      crit:["诗人压低声音：'我去年在承天城待过。帝京的宫墙，比你说的还高。但高墙里面，也不太平。'他唱了半句，又停住：'大皇子与二皇子，斗得正凶。皇帝的身子骨，据说也不如从前了。'"]
  1457	    },go:"travel_east_start"},
  1458	    {t:"不急着走，先回城办完事",go:"fc_stay"}
  1459	  ]
  1460	};
  1461	N["pro_choose_west"] = {
  1462	  place:"自由城邦 · 交汇城 · 西门", where:"春一月 · 晨",
  1463	  text:[
  1464	    "你选了西边。矮人王国的熔炉、圣城的尖塔——都在等你。",
  1465	    "西门外，一支朝圣者的队伍正缓缓前行，白袍上绣着燃烧的太阳。他们唱着圣歌，声音在旷野上飘荡。",
  1466	    "队伍末尾，一个老妇人拉住你的袖子，浑浊的眼睛里闪着光：",
  1467	    "“孩子，跟我去圣城吧。主的圣光会庇佑你。”",
  1468	    "她身后，一个穿黑袍的执灯人正远远地看着这边。他的目光在你身上停了一瞬，又移开。",
  1469	    "圣光。净化令。还有那封信里说的——'圣城的光明里'。"
  1470	  ],
  1471	  options:[
  1472	    {t:"婉拒老妇人，独自上路",go:"travel_west_start"},
  1473	    {t:"跟着朝圣队伍走一段，看看教会的水",check:{a:"CHA",sk:"persu",label:"探听"},tier:{
  1474	      ok:["你混在朝圣者中间走了一天，听他们唱圣歌、讲神迹，也听他们私下抱怨：净化令烧死了隔壁村的药师，'他治好了我儿子的热病，可圣痕司说他是异端'。","日落时，你已经对教会的光与影，有了自己的判断。"]
  1475	    },go:"travel_west_start"},
  1476	    {t:"不急着走，先回城办完事",go:"fc_stay"}
  1477	  ]
  1478	};
  1479	N["fc_stay"] = {
  1480	  place:"自由城邦 · 交汇城", where:"春一月 · 数日后",
  1481	  text:[
  1482	    "你决定在自由城邦再留几日。城里的门道，你还没摸透。",
  1483	    "这几日，你跑了几趟活，也去默页书肆坐了几回。老许的话不多，但每一句都有分量。",
  1484	    "有一天傍晚，你在城墙上看见一支商队正连夜出城，旗帜是银色的新月。车辙很深，压着重货。",
  1485	    "你望着那支商队消失在夜色里，心里盘算着：它们往南，往黄金城的方向。",
  1486	    "这个世界，不会因为你在一个地方多停几天就停下来。"
  1487	  ],
  1488	  options:[
  1489	    {t:"办完城里的杂事，准备动身",check:{a:"INT",sk:"bargain",label:"盘点"},tier:{
  1490	      ok:["你盘了盘自己的家底：几枚金币、一本典籍、[[JM0]]、一枚乌黑的铁牌。够了。","你最后看了一眼交汇城的方向，转身踏上旅途。"],
  1491	      crit:["你不但盘了家底，还从老许那里学了一句真话：'乱世里，最值钱的不是金币，是'别人不知道你知道什么'。'你深以为然。"],
  1492	      fail:["你盘了盘，发现自己比想象的穷。也罢，穷有穷的活法。"]
  1493	    },effects:{xp:10},go:"pro_after_leave"}
  1494	  ]
  1495	};
  1496	N["pro_after_leave"] = {
  1497	  place:"旅途", text:["你踏上了旅途。大陆在你的脚下展开。","往北，是铁与雪的北方公国联盟；往南，是金与帆的南方城邦；往东，是雾与剑的东方大地；往西，是锤与光的矮人圣山。","世界很大。而你的故事，才刚刚开始。"],
  1498	  options:[
  1499	    {t:"打开世界地图，选择你的下一站",go:"open_map"}
  1500	  ]
  1501	};
  1502	N["open_map"] = {
  1503	  place:"世界地图", text:["你摊开一张旧地图。线条已经模糊，但你记得住每一个名字。","选择你的目的地。旅途，会给你答案。"],
  1504	  options:[
  1505	    {t:"打开地图面板（点击顶栏『世界地图』）",go:"open_map"}
  1506	  ]
  1507	};
  1508	/* 旅途引导 */
  1509	N["travel_north_start"] = {
  1510	  place:"北向官道", text:["北方的风，带着铁与雪的味道。你站在路口，官道向北延伸，消失在丘陵后面。","此去北方，第一站是艾尔达城。联盟的都城，魔法学院所在。"],
  1511	  options:[
  1512	    {t:"出发，前往艾尔达城",run:function(){ travelTo("north_aierda"); }},
  1513	    {t:"先去前线铁壁城看看",run:function(){ travelTo("north_tiebi"); }},
  1514	    {t:"稍等，先打开地图看看全局",run:function(){ togglePanel("map"); }}
  1515	  ]
  1516	};
  1517	N["travel_tiebi_start"] = {
  1518	  place:"北向官道", text:["铁壁城在前线方向。一路北上，你能感觉到空气里的紧绷——逃难的人流，与调动的军队，在同一条路上擦肩而过。"],
  1519	  options:[
  1520	    {t:"出发，前往铁壁城",run:function(){ travelTo("north_tiebi"); }},
  1521	    {t:"先折返，好好规划路线",run:function(){ togglePanel("map"); }}
  1522	  ]
  1523	};
  1524	N["travel_south_start"] = {
  1525	  place:"南向官道", text:["南方的风，带着潮湿的盐味与铜臭味。黄金城的账房、魔械城的齿轮，在南方的艳阳下等着你。"],
  1526	  options:[
  1527	    {t:"出发，前往黄金城",run:function(){ travelTo("south_huangjin"); }},
  1528	    {t:"先打开地图看看南方全貌",run:function(){ togglePanel("map"); }}
  1529	  ]
  1530	};
  1531	N["travel_east_start"] = {
  1532	  place:"东向官道", text:["东方的路，穿过平原，穿过森林边缘，通向精灵的迷雾与帝京的宫墙。","这条路，一分为二：精灵森林在东北，东部王国的承天城在正东。"],
  1533	  options:[
  1534	    {t:"先往精灵森林边缘看看",run:function(){ travelTo("elf_wangting"); }},
  1535	    {t:"直接东行，去东部王国",run:function(){ travelTo("east_chengtian"); }},
  1536	    {t:"先打开地图",run:function(){ togglePanel("map"); }}
  1537	  ]
  1538	};
  1539	N["travel_west_start"] = {
  1540	  place:"西向官道", text:["西边的群山在暮色里像一排沉默的巨兽。矮人王国的石门，就在山腹之间。","西南方向上，圣城的尖塔若隐若现。"],
  1541	  options:[
  1542	    {t:"往西，去矮人王都",run:function(){ travelTo("dwarf_wangdu"); }},
  1543	    {t:"往西南，去圣城",run:function(){ travelTo("church_shengcheng"); }},
  1544	    {t:"先打开地图",run:function(){ togglePanel("map"); }}
  1545	  ]
  1546	};
  1547	/*==STORY_PRO==*/
  1548	/*==STORY_FC==*/
  1549	/* ================================================================
  1550	   北方公国联盟
  1551	   ================================================================ */
  1552	N["arrive_north_aierda"] = {
  1553	  place:"北方公国联盟 · 艾尔达城", where:"艾尔达历 4037年 · 途中",
  1554	  text:[
  1555	    "艾尔达城比交汇城规矩。街道横平竖直，铁皮灯罩里的灯火压得低，像这座城一样内敛。",
  1556	    "城北的山丘上，艾尔达魔法学院的白墙高踞天际，塔尖刺破云层。那是法神黄林晶一千二百年前创办的地方，大陆最古老的知识圣地。",
  1557	    "城门处排着队。你前面是一队应征的年轻人，胸口别着联盟的蓝色盾徽，一个个绷着脸，像赴约一样紧张。",
  1558	    "守门军官看了你的冒险者凭证，放行时多问了一句：",
  1559	    "“会点拳脚？还是懂点术法？”",
  1560	    "“会一点。”你说。",
  1561	    "“那可以去学院碰碰运气。今年破例，学院对外招生——不限出身，只问资质。”"
  1562	  ],
  1563	  options:[
  1564	    {t:"先去艾尔达魔法学院看看",go:"north_academy_gate"},
  1565	    {t:"先找地方落脚，听听城里的风声",go:"north_tavern"},
  1566	    {t:"去冒险者公会分会接点活",go:"board_north"}
  1567	  ]
  1568	};
  1569	N["arrive_north_tiebi"] = {
  1570	  place:"北方公国联盟 · 铁壁城", where:"途中",
  1571	  text:[
  1572	    "铁壁城没有城墙之外的赘余。三重城墙，一道比一道高，城砖被刀兵磨出铁色。",
  1573	    "你进城时，正赶上预备役点名。一队队青壮年列队走过，铠甲叮当，尘土飞扬。人群中，一个年近半百的老兵格外显眼——他的甲比别人旧，背却挺得比别人直。",
  1574	    "有人喊他：“老莱昂！你儿子不是考上学院了吗？怎么你还来吃这份苦！”",
  1575	    "老兵头也不回：“儿子是儿子的路。老子有老子的仗。”",
  1576	    "城门洞的阴影里，你听见士兵们压低声音议论：铁门关丢了，东军的前锋，已经推进到关外三十里。"
  1577	  ],
  1578	  options:[
  1579	    {t:"去军营方向看看战事安排",go:"tiebi_camp"},
  1580	    {t:"打听铁门关古战场的事",go:"tiebi_warfield"},
  1581	    {t:"先落脚，接点军需活计",go:"board_north"}
  1582	  ]
  1583	};
  1584	N["arrive_north_beijing"] = {
  1585	  place:"北方公国联盟 · 北境城", where:"途中",
  1586	  text:[
  1587	    "北境城的气温比南方低了一大截。呼出的气凝成白雾，城头的冰棱在日光里闪着冷光。",
  1588	    "这里的士兵皮肤粗糙，眼睛却亮。城墙上，一排弩手正盯着北方的地平线。",
  1589	    "酒馆里，一个猎人模样的汉子压着嗓子说：“草原上不对劲。黑石部族三个月前就开始集结，狼旗连成片，望不到头。”",
  1590	    "另一个老兵嗤笑：“怕什么，铁门关那边才要命。兽人？翻不过霜狼山脉，就算翻过来，咱们的冰狼盟誓也不是摆设。”",
  1591	    "窗外的风呜咽着，把最后半句吹散在雪里。"
  1592	  ],
  1593	  options:[
  1594	    {t:"去城头看看冰狼盟誓的营寨",go:"beijing_wolf"},
  1595	    {t:"打听草原上的消息",go:"beijing_rumor"},
  1596	    {t:"先落脚，接点活计",go:"board_north"}
  1597	  ]
  1598	};
  1599	N["arrive_north_kuangshan"] = {
  1600	  place:"北方公国联盟 · 矿山城", where:"途中",
  1601	  text:[
  1602	    "矿山城的空气里飘着煤灰。整座城建在一座大矿脉上，地面被矿车轨道切成棋盘。",
  1603	    "矮人的锻造技艺在这里扎了根。铁匠铺的锤声从早响到晚，淬火的白汽在街巷里弥漫。",
  1604	    "你路过一家兵器铺，掌柜的正在磨一把双手剑，见你停下，头也不抬：",
  1605	    "“联盟征购军械，铁价翻了倍。你要是手头有闲钱，囤点铁料，比存钱划算。”",
  1606	    "他顿了顿，又补了一句：“不过，别碰南边来的便宜铁。来路不正的东西，淬出来的刃也歪。”"
  1607	  ],
  1608	  options:[
  1609	    {t:"进铺子看看，打听行情",go:"kuangshan_forge"},
  1610	    {t:"去矿口转转，看看能不能捞点材料",go:"kuangshan_mine"},
  1611	    {t:"先落脚",go:"board_north"}
  1612	  ]
  1613	};
  1614	N["arrive_north_hewan"] = {
  1615	  place:"北方公国联盟 · 河湾城", where:"途中",
  1616	  text:[
  1617	    "河湾城是联盟的粮仓。三河在此交汇，麦田铺到天边，谷仓的尖顶比教堂还多。",
  1618	    "这里的日子比别处安稳些。集市上，农妇挎着篮子讨价还价，孩子们在粮袋间捉迷藏。",
  1619	    "但安稳之下有暗流。粮行掌柜压低声音告诉你：东军占了铁门关，北方的粮道要是断了，河湾的麦子，就是会走路的金子。",
  1620	    "“联盟已经开始征购军粮。今年的麦价，怕是要翻番。”"
  1621	  ],
  1622	  options:[
  1623	    {t:"在集市上逛逛，看看有没有便宜货",go:"hewan_market"},
  1624	    {t:"打听商路的消息",go:"hewan_road"},
  1625	    {t:"先落脚",go:"board_north"}
  1626	  ]
  1627	};
  1628	N["arrive_north_senlin"] = {
  1629	  place:"北方公国联盟 · 森林城", where:"途中",
  1630	  text:[
  1631	    "森林城建在密林边缘，半精灵的尖耳朵在人群里此起彼伏。这里的房子用整根原木搭成，屋顶长着青苔。",
  1632	    "弓箭是这里的第一语言。城头的靶场里，一个半精灵少女一箭射穿百步外的铜钱，赢得一片喝彩。",
  1633	    "她跳下靶台，看了你一眼，爽朗一笑：",
  1634	    "“外乡人？进城别惹巡林的——他们的箭，比圣痕司的鼻子还灵。”",
  1635	    "远处，森林的深处，隐约有银色的光在雾中闪烁。有人说是精灵王国的边界结界，也有人说是别的什么。"
  1636	  ],
  1637	  options:[
  1638	    {t:"去靶场练练箭术，结识当地猎手",go:"senlin_archery"},
  1639	    {t:"打听森林深处的传说",go:"senlin_legend"},
  1640	    {t:"先落脚",go:"board_north"}
  1641	  ]
  1642	};
  1643	N["arrive_north_haigang"] = {
  1644	  place:"北方公国联盟 · 海港城", where:"途中",
  1645	  text:[
  1646	    "海港城的风带着咸味。巨大的石堤伸进海里，战舰的桅杆在雾中如林。",
  1647	    "这里是联盟的海上门户。海军提督府的白墙上，贴着征募水手的告示，赏金不低。",
  1648	    "码头边，一个老水手正修补渔网，见你驻足，咧嘴一笑，露出被海风啃得发白的牙齿：",
  1649	    "“往南的船，明早有一趟。你要搭，三枚银币，包一顿干粮。”",
  1650	    "他顿了顿，压低声音：“不过最近海上不太平。有条船，前些日子在近海失踪了，连块木板都没漂回来。”"
  1651	  ],
  1652	  options:[
  1653	    {t:"打听失踪船只的事",go:"haigang_ship"},
  1654	    {t:"看看有没有顺路的活计",go:"board_north"},
  1655	    {t:"先落脚",go:"board_north"}
  1656	  ]
  1657	};
  1658	/* 艾尔达城 · 学院线 */
  1659	N["north_academy_gate"] = {
  1660	  place:"艾尔达魔法学院 · 大门", where:"白昼",
  1661	  text:[
  1662	    "学院的大门是一道刻满符文的石拱门。守门的执事看了你的凭证，又看了看你的眼睛：",
  1663	    "“求学，还是寻事？”",
  1664	    "你还没答，队伍前面忽然骚动起来。一个年轻人被两个灰袍执事架着拖出来，他挣扎着喊：",
  1665	    "“我不是异端！我只是研究元素共鸣！圣痕司凭什么抓我！”",
  1666	    "灰袍执事面无表情：“净化令。奥术系谱涉疑。跟我们走。”",
  1667	    "围观的人群静了一瞬，又继续流动。那个年轻人被拖走了，他的书箱散落一地，几本旧书被踩进泥里。",
  1668	    "你弯腰，捡起一本没被踩烂的。封皮上写着：《[[JB0]]》。扉页上有一行稚嫩的签名，和一行字：",
  1669	    "“知识是阶梯，也是火。”",
  1670	    "墨迹已经干了很久。"
  1671	  ],
  1672	  options:[
  1673	    {t:"把书收好，进学院",effects:{book:function(){const j=JOBS[S.job]; return j.books[0][0];}},tier:{ok:["你把书收进行囊，迈进那道石拱门。门后的庭院里，喷泉的细流在阳光下闪成一道彩虹。","学院内部，比外面安静，也比外面冷。"]},go:"north_academy_inside"},
  1674	    {t:"追上那个被抓走的年轻人问问情况",check:{a:"AGI",sk:"stealth",label:"追踪"},tier:{
  1675	      ok:["你远远缀着那两个灰袍执事，看他们把年轻人带进学院西侧的一栋灰楼。灰楼的门楣上刻着三个字：'审问室'。门关上之前，你看见里面还有几个穿黑袍的人——圣痕司的。","你记住了这栋楼的位置。"],
  1676	      fail:["学院内禁止喧哗，你追到拐角就被一个执事拦下，盘问了几句。等你脱身，人已经不见了。"],
  1677	      crit:["你不但跟到了灰楼，还在侧墙的排水管边看见一个人影——一个戴眼镜的中年学者，正隔着窗子注视着审问室里的动静。他看得很专注，连你经过都没发现。","你记住了这张脸。后来你才知道，他叫墨丘利，学院灵魂魔法教授。"]
  1678	    },effects:{},onCrit:{flag:"mercury_seen"},go:"north_academy_inside"},
  1679	    {t:"先不进去，在学院外墙转一圈",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  1680	      ok:["你绕着学院走了一圈。外墙的符文阵每隔十步就有一个节点，层层叠叠，气象森严——这是传说中星辉院长布下的半神级结界。","结界之下，学院固若金汤。但也正因为如此，进来的人，更难出去。"],
  1681	      fail:["你转了一圈，只记住了围墙很高。"],
  1682	      crit:["你在学院后山发现一条废弃的排水暗道，入口被藤蔓遮着，通向学院地下。出口的方向，正对那栋灰楼。","你默默记下这条道。有些门，正门进不去，总有别的路。"]
  1683	    },effects:{},onCrit:{flag:"academy_secret_pass"},go:"north_academy_inside"}
  1684	  ]
  1685	};
  1686	N["north_academy_inside"] = {
  1687	  place:"艾尔达魔法学院 · 内院", where:"白昼",
  1688	  text:[
  1689	    "学院内院是一座巨大的环形广场，中央立着一座石像：法神黄林晶，负手而立，目光望向北方。",
  1690	    "石像底座上刻着一行字：“知识为火，照彻长夜。”",
  1691	    "广场上，学生们三三两两地走过。你听见他们议论：",
  1692	    "“……净化令又抓人了。奥术系这次被查了三个。”",
  1693	    "“听说有个访问学者，叫奥利弗的，精通灵魂与梦境，圣痕司都想请他去做顾问。”",
  1694	    "“嘘，别乱说。圣痕司的耳朵比狗还灵。”",
  1695	    "一个火红色头发的少女抱着一摞书从你身边跑过，差点撞到你。她回头吐了吐舌头：",
  1696	    "“对不起对不起！要迟到了！教授最恨迟到！”",
  1697	    "她跑远了，留下一串清脆的脚步声。那是艾莉丝，火系魔法师，学院有名的急性子。"
  1698	  ],
  1699	  options:[
  1700	    {t:"去图书馆，办一张借阅证",go:"north_library"},
  1701	    {t:"打听那位叫奥利弗的访问学者",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  1702	      ok:["学生们你一言我一语：奥利弗·深思，南方来的访问学者，精通灵魂魔法与梦境研究，温和、博学、风度翩翩，'是学院近十年最受欢迎的学者'。","只是有个学生压低声音补了一句：'……但他讲课时，我总觉得他看人的眼神，像在称量什么东西。'"],
  1703	      fail:["学生们警惕地看着你，谁也不肯多说。'打听访问学者干什么？你是圣痕司的？'你只得作罢。"],
  1704	      crit:["你从图书馆管理员那里套出更多：奥利弗每周三深夜都在禁书区借阅，借的全是'灵魂、封印、深渊'类目的书。管理员咕哝着：'一个研究梦境的学者，读那么多封印的书做什么？'","你把这个细节记下。"]
  1705	    },effects:{},onCrit:{flag:"oliver_books"},go:"north_academy_inside"},
  1706	    {t:"去教学区旁听一节课",check:{a:"INT",sk:"lore",label:"旁听"},tier:{
  1707	      ok:["你混进阶梯教室，旁听了一节元素理论课。白发教授讲得深入浅出，你听懂了大半，也记了不少笔记。","下课时，教授看了你一眼：“旁听的？不错，听得认真。有不懂的，随时来问。”"],
  1708	      fail:["课程内容高深，你听得云里雾里。旁边一个学生好心给你划了几个重点：“入门先看《[[JB1]]》，别好高骛远。”"],
  1709	      crit:["你不但听懂了，还在提问环节问了一个让教授都顿了顿的问题。教授看了你良久，说：'……这个问题，四十年前也有人问过我。你叫什么名字？'","他低头在你的旁听证上签了个名：'凭这个，图书馆的典藏室对你开放半天。'"]
  1710	    },effects:{xp:20},onOk:{book:function(){const j=JOBS[S.job]; return j.books[0][1];}},onCrit:{flag:"professor_note"},go:"north_academy_inside"}
  1711	  ]
  1712	};
  1713	N["north_library"] = {
  1714	  place:"艾尔达魔法学院 · 图书馆", where:"白昼",
  1715	  text:[
  1716	    "图书馆是学院最安静的地方。高耸的书架像一排排沉默的森林，阳光从穹顶的彩窗漏下来，在书架间切出光与影的棋盘。",
  1717	    "你在登记处填了表。管理员是个戴圆眼镜的矮个子男人，姓罗，说话很轻：",
  1718	    "“新读者？借阅规则：普通区随意，禁书区需三级以上许可。复印免费，抄写自备笔墨。”",
  1719	    "你正低头填表，余光扫到书架尽头的走廊——一个戴金边眼镜的中年学者正从禁书区方向走出来，手里抱着厚厚一摞书，封面朝下。他看见你，温和地点头微笑：",
  1720	    "“新面孔。来查资料的？”",
  1721	    "他的声音很好听，像春天解冻的溪水。但你说不上为什么，总觉得他看你的目光里，有一层说不清的东西。",
  1722	    "他走后，管理员罗先生压着嗓子咕哝了一句：“奥利弗教授，又借这么多书……上周借的那批还没还呢。”"
  1723	  ],
  1724	  options:[
  1725	    {t:"借阅典籍，充实知识",check:{a:"INT",sk:"lore",label:"研读"},tier:{
  1726	      ok:["你在窗边读了一下午。阳光从彩窗漏进来，在书页上流动。你合上书时，窗外的钟声响了六下。","这些知识，会在你未来的路上，成为你最可靠的武器。"],
  1727	      fail:["你读得头昏脑胀。管理员罗先生看不过去，给你泡了杯提神的茶：“读书是慢功夫，急不得。”"],
  1728	      crit:["你不但读完了，还在书架缝隙里发现一本被遗忘的旧册。册子里夹着一张纸条，字迹工整：'第七节点的封印，裂缝在扩大。学院里，有眼睛盯着它。'","纸条没有署名。你默默收好，心跳快了一拍。"],
  1729	      critfail:["你从书架上抽书时，不小心碰倒了一摞。书哗啦啦散落一地，你弯腰去捡，发现其中一本的封皮下，露出一角乌黑的纸——和你在自由城邦见过的那些文书，纸质一模一样。","你还没来得及细看，管理员就赶过来帮你收拾。那张黑纸，混在书堆里，不知被谁收走了。"]
  1730	    },effects:{xp:25},onOk:{book:function(){const j=JOBS[S.job]; return j.books[0][1];}},onCrit:{flag:"seal_crack_note"},go:"north_library_2"},
  1731	    {t:"悄悄跟上去，看看奥利弗教授去了哪里",check:{a:"AGI",sk:"stealth",label:"跟踪"},tier:{
  1732	      ok:["你借口去洗手间，远远缀着奥利弗。他穿过回廊，拐进一栋不起眼的偏楼。你从窗缝里看见，他进了二楼尽头的一间办公室，门牌上写着：'梦境与灵魂研究'。","他关门前，你瞥见办公室里堆满了书籍和卷轴，墙上挂着一张地图——你眯着眼想看清，但他已经把门关严了。"],
  1733	      fail:["你跟到回廊拐角，一个清洁工挡住了你的路。等你再抬头，奥利弗已经不见了。"],
  1734	      crit:["你绕到偏楼后面，从后窗看见奥利弗的办公室。他背对着窗，正在看一张地图——你认出了几个地名：圣城、死亡沙漠、深渊神殿。地图上，几个点被朱笔圈着。","他忽然侧过头。你立刻缩回身。心跳如鼓。他好像察觉到了什么。"]
  1735	    },effects:{},onCrit:{flag:"oliver_map"},go:"north_library_2"},
  1736	    {t:"跟管理员罗先生闲聊，套套学院近况",check:{a:"CHA",sk:"persu",label:"闲聊"},tier:{
  1737	      ok:["罗先生是个话匣子，一边理书一边跟你聊：学院近半年走了三个教授，都是'自愿离职'；奥利弗教授是院长特聘的，背景'干净得查不出任何问题'；还有，'最近图书馆丢了好几本封印学的手抄本，查不出是谁借的'。","你把这些都记下。干净得查不出问题——这本身就是问题。"],
  1738	      fail:["罗先生话不多，只让你别乱翻禁书区：'净化令的风向，你懂的。'"],
  1739	      crit:["罗先生压低声音，像在倒苦水：'我跟你说，学院的水，深得很。半年前，有个学生夜探禁书区，第二天就退学了，走的时候，脸白得像纸。'他打了个寒颤：'那之后，我就再没在夜里待过图书馆。'"]
  1740	    },effects:{},onCrit:{flag:"library_rumor"},go:"north_library_2"}
  1741	  ]
  1742	};
  1743	N["north_library_2"] = {
  1744	  place:"艾尔达魔法学院 · 图书馆 · 典藏室", where:"暮色",
  1745	  text:[
  1746	    "暮色从穹顶漫下来，图书馆的灯一盏盏亮起。",
  1747	    "你拿着旁听教授签名的许可（或者靠自己的本事），进了典藏室。这里的书更旧，气味更重，每一本都像一位沉默的老人。",
  1748	    "你在角落的书架上，找到一本与你的职业有关的典籍。书皮磨得发亮，显然被人翻阅过很多次。",
  1749	    "翻开扉页，你看见一行批注，字迹沉稳有力：",
  1750	    "“此道艰险。慎行。若见深渊，勿凝视太久。”",
  1751	    "没有署名。但你知道，能在这间典藏室留下批注的人，绝非等闲。"
  1752	  ],
  1753	  options:[
  1754	    {t:"研读典籍（获取高阶知识）",check:{a:"INT",sk:"lore",label:"研读"},tier:{
  1755	      ok:["你读得很慢，像咀嚼硬面包。书里的知识艰深，但你啃下来了。合上书时，你觉得自己的道，又清晰了一分。"],
  1756	      fail:["书太深奥。你读到一半就卡住了，只得先记下纲要，日后再来。"],
  1757	      crit:["你读得入神，忽然在书页间发现一张夹着的便笺，墨迹很新：'有人在找七节点。学院里。小心那个戴金边眼镜的。'","字迹潦草，像是匆忙写下的。你捏着便笺，指尖发凉。"],
  1758	      critfail:["你读到某个段落时，忽然一阵耳鸣。书上的字像活了一样扭动，你恍惚看见一片无尽的黄沙，沙下埋着一座漆黑的神殿。殿门洞开。","你猛地合上书，冷汗涔涔。典藏室的灯，不知何时暗了一盏。"]
  1759	    },effects:{xp:30},onOk:{cond:"kno",mat:function(){const j=JOBS[S.job]; return j.mats[1];}},onCrit:{flag:"warn_note"},go:"north_mercury"},
  1760	    {t:"在典藏室找找封印相关的资料",check:{a:"INT",sk:"detect",label:"查索"},tier:{
  1761	      ok:["你在尘封的书架上找到一本《大陆封印考》。书中记载：古代艾尔达文明设下七处封印节点，镇压深渊。如今，'第七节点'在死亡沙漠深处，已失守多年。","'第一至第六节点，分布大陆各地。传说，节点之间互相呼应，一损俱损。'你默默记下这些。"],
  1762	      fail:["你找了半天，只找到几本无关的杂记。典藏室的封印类书目，被清理得很干净。"],
  1763	      crit:["你在书架最深处，摸到一本没有书脊的册子。翻开，是一份手抄的《七节点分布图》，旁边标注着各节点的状态：'节点七，失守。节点三，松动。节点一，疑似……被渗透。'","'节点一'旁边，画着一个问号，和一行小字：'圣城方向？'"]
  1764	    },effects:{xp:20},onCrit:{flag:"node_one_hint"},go:"north_mercury"}
  1765	  ]
  1766	};
  1767	N["north_mercury"] = {
  1768	  place:"艾尔达魔法学院 · 墨丘利教授的办公室", where:"傍晚",
  1769	  text:[
  1770	    "你敲开灵魂魔法教授墨丘利的办公室时，他正在给一盆花浇水。花盆里的植物没有叶子，茎秆却泛着银色的光。",
  1771	    "墨丘利是个温和的中年人，头发灰白，戴着一副旧眼镜。他听完你的来意，沉默了一会儿，说：",
  1772	    "“年轻人，你知道灵魂魔法在这个时代意味着什么吗？”",
  1773	    "“意味着被净化令烧死的概率，比其他职业高三倍。”他自问自答，语气平静，“也意味着，你能看见别人看不见的东西。”",
  1774	    "他放下水壶，看着你：",
  1775	    "“我在这里教了三十年书。三十年里，我见过太多聪明人，走到半路，不是被教会烧死，就是被自己的好奇心吞掉。”",
  1776	    "“你确定要往这条路上走？”"
  1777	  ],
  1778	  options:[
  1779	    {t:"坚定地表示：我要走下去",check:{a:"CHA",sk:"persu",label:"表态"},tier:{
  1780	      ok:["墨丘利看着你的眼睛，看了很久。然后他笑了，笑容里有欣慰，也有一丝你读不懂的苦涩。","'好。既然决定了，就记住一句话：先识己，后识人。'他转身，从书架深处取出一卷旧纸递给你：'这是我年轻时整理的笔记，关于[[MERC]]。送你。","'不要谢我。等你走到那一步，就会明白，我送你这些东西，不是帮你，是替这个世界多留一盏灯。'"],
  1781	      fail:["墨丘利没有立刻回答。他给你倒了杯茶，说：'不急。你还没有真正体会到这条路的重量。'他顿了顿：'等你在某个深夜，独自面对自己的时候，再想想今天的话。'","你走出办公室时，他补了一句：'茶凉了，记得回来续。'"],
  1782	      crit:["墨丘利深深看了你一眼，像看穿了你这些天的经历。他什么也没问，只说：'你身上有'看见过'的味道。'","他给了你两样东西：一卷旧笔记，和一句忠告：'学院里，有人盯着禁书区。别在夜里去。'","'那个人，连我都看不透。'"]
  1783	    },effects:{xp:20,rep:3},onOk:{flag:"mercury_ally"},onCrit:{flag:"mercury_ally",book:function(){const j=JOBS[S.job]; return j.books[1]?j.books[1][0]:null;}},go:"north_academy_night"},
  1784	    {t:"试探性地问墨丘利：学院里是不是有人不对劲",check:{a:"CHA",sk:"persu",label:"试探"},tier:{
  1785	      ok:["墨丘利的手顿了一下。他继续浇水，头也不抬：'学院里有没有人不对劲？每个学院都有。'他直起身，看着窗外渐暗的天色：'关键是，不对劲的人，是在守护，还是在窥探。'","他没有正面回答，但你注意到，他刚才那一下停顿，比任何回答都诚实。"],
  1786	      fail:["墨丘利笑了笑：'年轻人，疑心重是好事，但别把学院当阴谋窝。'他转移了话题，但你的直觉告诉你，他藏了话。"],
  1787	      crit:["墨丘利沉默了很久。他摘下眼镜，擦了擦，说：'既然你问到这个份上……'他压低声音：'最近半年，禁书区的借阅记录，被人动过手脚。有个人的借阅范围，广得不像一个学者。'","'他叫奥利弗。如果你要查他，小心。他这个人——'墨丘利顿了顿，'太干净了。'"]
  1788	    },effects:{},onCrit:{flag:"mercury_warn"},go:"north_academy_night"}
  1789	  ]
  1790	};
  1791	N["north_academy_night"] = {
  1792	  place:"艾尔达魔法学院 · 深夜", where:"夜",
  1793	  text:[
  1794	    "夜深了。学院的走廊空无一人，只有巡逻的符文灯在墙上一明一灭。",
  1795	    "你躺在床上（或者借宿的客房），却睡不着。墨丘利的话、典藏室的便笺、奥利弗的地图，在你脑中翻来覆去。",
  1796	    "窗外，月光照进庭院。你看见一个身影从回廊尽头走过——脚步很轻，方向是禁书区。",
  1797	    "那个身影戴着金边眼镜。月光下，镜片一闪。",
  1798	    "你屏住呼吸。要不要跟上去？"
  1799	  ],
  1800	  options:[
  1801	    {t:"跟上去，看看奥利弗深夜去禁书区做什么",check:{a:"AGI",sk:"stealth",label:"跟踪",note:"高风险"},tier:{
  1802	      ok:["你贴着墙壁的阴影，无声地缀在后面。奥利弗用一把铜钥匙打开禁书区的门，闪身进去。你从门缝里看见，他径直走向最深处的书架，抽出一本厚书，然后——他划破了自己的手指，把血滴在书页上。","书页像活了一样，泛起暗红色的光。他低声说了一句话，你听不懂的语言，但那个音节，你曾在自由城邦的下水道里听过。","你后背的汗瞬间下来了。"],
  1803	      fail:["你跟到拐角，脚下一滑，碰倒了一个花盆。啪。奥利弗猛地回头。你缩在阴影里，屏住呼吸。他看了几息，缓缓转回身，进了禁书区。","但他关门之前，你知道，他看见了你藏身的方向。"],
  1804	      crit:["你不但跟到了禁书区，还在他离开后，用一枚细铁片撬开了锁（如果你学过开锁）——门没锁严。你闪进去，在奥利弗翻过的那本书上，看见书页间夹着一张纸条：'第七节点，祭司已就位。静候降临。'","你抄下这行字，原样放回，退出禁书区。心口怦怦直跳。"],
  1805	      critfail:["你跟得太近。奥利弗忽然停步，转身——你没有退路，撞进他怀里。他扶住你，金边眼镜后的目光像一汪深潭：'……这么晚了，睡不着？'","他的声音温和，但你的直觉在尖叫。你编了个失眠的借口，他微笑着点点头，目送你离开。","走出很远，你才发现自己的后背，全湿了。"]
  1806	    },effects:{},onOk:{flag:"oliver_night"},onCrit:{flag:"oliver_night",item:"抄录的纸条"},onCritFail:{flag:"oliver_noticed"},go:"north_academy_2"},
  1807	    {t:"不跟。回房睡觉，养精蓄锐",effects:{xp:10,hp:15},tier:{ok:["你翻了个身，闭上眼。有些真相，不是今晚非要看清的。","睡眠是穷人的铠甲。你在铠甲里睡到天明。"]},go:"north_academy_2"},
  1808	    {t:"去守夜人那里举报'有人夜闯禁书区'",check:{a:"CHA",sk:"persu",label:"举报"},tier:{
  1809	      ok:["守夜人听了你的话，脸色一变，却摆摆手：'奥利弗教授？他有院长的特许，深夜借阅很正常。你多心了。'","你碰了个软钉子。但守夜人那一下脸色变化，你记下了——学院里，有人知道奥利弗的深夜行动，但选择了沉默。"],
  1810	      fail:["守夜人打着哈欠：'深更半夜的，别折腾。禁书区有结界，进不去的。'他显然不信你。"],
  1811	      crit:["守夜人沉默片刻，压低声音：'……你是第三个来举报的人了。前两个，一个是清洁工，一个是图书管理员。'他顿了顿：'第二天，一个被调去了分院，一个'自愿离职'了。'","'你要是还想在学院待下去，就当今晚什么都没看见。'"]
  1812	    },effects:{},onCrit:{flag:"north_whistle"},go:"north_academy_2"}
  1813	  ]
  1814	};
  1815	N["north_academy_2"] = {
  1816	  place:"艾尔达魔法学院 · 晨", where:"次日清晨",
  1817	  text:[
  1818	    "第二天清晨，学院来了几位不速之客。",
  1819	    "三辆黑色的马车停在学院门口，车门上烙着燃烧的十字——圣痕司。",
  1820	    "领头的审判官是个高瘦的男人，脸上的旧疤从额头划到下巴。他站在大厅中央，声音不大，却压住了所有杂音：",
  1821	    "“奉净化令，搜查奥术系与灵魂魔法涉疑人员的居所与资料。配合者，无事；阻挠者，同罪。”",
  1822	    "学生们噤若寒蝉。你看见艾莉丝抱着她那本火系魔法书，指节发白。",
  1823	    "你看见墨丘利站在二楼的走廊上，看着这一切，表情平静得像一潭死水。",
  1824	    "你还看见，奥利弗站在人群里，微微皱着眉，像一个忧心忡忡的普通学者。",
  1825	    "太像了。像得不像真的。"
  1826	  ],
  1827	  options:[
  1828	    {t:"事不关己，回住处收拾行囊，准备离开学院",effects:{xp:5},tier:{ok:["你在检查的风暴外围收拾好行囊。临行前，你在图书馆的还书处留下一张便笺：'第七节点，祭司已就位。静候降临。'","有些消息，该让该知道的人知道。"],crit:["你收拾行囊时，在枕头下发现一封没有署名的信。拆开，只有一行字：'往北，北境有故人。若无处可去，可去冰狼部落找'老狼'。'","字迹陌生。你默默收好信。"]},onCrit:{flag:"mystery_letter"},go:"north_leave"},
  1829	    {t:"趁乱，去查查圣痕司在学院翻什么",check:{a:"AGI",sk:"stealth",label:"潜入"},tier:{
  1830	      ok:["你混在搬书的学生里，靠近了搜查现场。圣痕司的人重点翻查的，是奥术系三份'涉疑人员'的档案，和——灵魂魔法系的借阅记录。","你注意到，借阅记录里，有一页被单独抽走了。抽走的那一页，恰好是典藏室最近三个月的记录。"],
  1831	      fail:["你刚靠近，就被一个黑袍执事拦下：'退后。'你只得退开，什么也没看见。"],
  1832	      crit:["你不但看清了他们翻什么，还认出了那个高瘦审判官胸前的徽章——圣痕司大审判长直属，'执灯人'序列。他们查的不是异端，是异端背后的东西。","你把这个细节记在心里。"]
  1833	    },effects:{},onCrit:{flag:"church_searching"},go:"north_leave"},
  1834	    {t:"去找墨丘利道别，顺便问最后一件事",check:{a:"CHA",sk:"persu",label:"道别"},tier:{
  1835	      ok:["墨丘利在办公室里等你，像早就知道你会来。他给了你一封信：'到北境城，交给冰狼部落的'老狼'。'他顿了顿：'他是我的旧识。这年头，多一个朋友，少一个敌人。'","'还有——'他犹豫了一下，'如果你在圣城见到一个叫'烛台'的旧书店，替我向掌柜问声好。'","你点头。他目送你出门，忽然又说：'年轻人，记住——先识己，后识人。'"],
  1836	      fail:["墨丘利正忙着整理被翻乱的资料，只匆匆说了句：'路上小心。'你站在门口，觉得他今天格外疲惫。"],
  1837	      crit:["墨丘利把信交给你，又补了一句：'学院的水，比你想象的深。你走得对。'他压低声音：'奥利弗那个人，离他远点。他研究的'梦境'，不是梦。'","'是别人睡着时的走廊。'"]
  1838	    },effects:{rep:3},onCrit:{flag:"mercury_letter"},go:"north_leave"}
  1839	  ]
  1840	};
  1841	N["north_leave"] = {
  1842	  place:"艾尔达城 · 北门", where:"上午",
  1843	  text:[
  1844	    "你离开艾尔达城时，圣痕司的黑色马车还停在学院门口。",
  1845	    "城门处，一队应征的新兵正在集合，胸口别着蓝色盾徽。你听见一个年轻士兵在跟同伴说：",
  1846	    "“铁门关丢得蹊跷。东军三万，一夜之间就过了关，关城上的烽火台，一个都没点着。”",
  1847	    "“有人说，那天晚上，关城上飘着黑烟。”",
  1848	    "你停下脚步。黑烟。你在自由城邦的下水道里，也见过类似的东西。",
  1849	    "北方的风刮过来，带着铁锈与硝烟的气味。",
  1850	    "你握紧行囊的肩带。下一个目的地，就在前方。"
  1851	  ],
  1852	  options:[
  1853	    {t:"去铁壁城，看看前线",run:function(){ travelTo("north_tiebi"); }},
  1854	    {t:"去北境城，找冰狼部落的'老狼'",run:function(){ travelTo("north_beijing"); }},
  1855	    {t:"先打开地图，规划路线",run:function(){ togglePanel("map"); }}
  1856	  ]
  1857	};
  1858	/* 铁壁城 · 前线线 */
  1859	N["tiebi_camp"] = {
  1860	  place:"铁壁城 · 军营", where:"白昼",
  1861	  text:[
  1862	    "军营的操场上，一队队新兵正在操练。铁靴踏地，声如闷雷。",
  1863	    "你凭冒险者凭证进了营区，看见军需官正对着账册发愁：铁料不够，弩矢不够，连军粮都开始限量。",
  1864	    "“东军占了铁门关，商路断了。南方的铁料运不过来，北方的粮道又被兽人骚扰。”军需官揉着太阳穴，“这仗还没打，先被后勤拖死了一半。”",
  1865	    "你正想细问，一个老兵提着酒壶从你身边走过。你认出他——城门口那个被叫做'老莱昂'的预备役老兵。",
  1866	    "他看了你一眼，咧嘴一笑：“小子，新来的？营里规矩：别问太多，活久点。”",
  1867	    "他顿了顿，又补了一句：“不过你要是真想知道铁门关怎么丢的，夜里来西营找我。我请你喝酒，你听我讲——讲那三天的怪事。”"
  1868	  ],
  1869	  options:[
  1870	    {t:"夜里赴约，听老莱昂讲铁门关的怪事",time:1,go:"tiebi_oldleon"},
  1871	    {t:"帮军需官跑一趟腿，赚点军需赏金",check:{a:"STR",sk:"athletic",label:"干活"},tier:{
  1872	      ok:["你帮军需官搬了一下午的军械，又清点了一库房的弩矢。他塞给你一笔赏金：“联盟现在缺人手，你能干，以后常来。”"],
  1873	      fail:["你搬了两趟就气喘吁吁。军需官摆摆手：“细胳膊细腿的，去干点轻省的活吧。”"],
  1874	      crit:["你不但搬完了军械，还帮军需官发现了一笔账目上的漏洞——一批'入库'的铁料，实际少了三成。军需官脸色铁青：“好，好得很。有人吃空饷吃到军需头上来了。”他多给了你一笔封口费。"]
  1875	    },effects:{gold:20,xp:25,rep:2},onCrit:{flag:"tiebi_audit"},go:"tiebi_camp"},
  1876	    {t:"去铁门关方向看看",go:"tiebi_warfield"}
  1877	  ]
  1878	};
  1879	N["tiebi_oldleon"] = {
  1880	  place:"铁壁城 · 西营 · 篝火旁", where:"夜",
  1881	  text:[
  1882	    "西营的篝火旁，老莱昂递给你一壶酒。酒很劣，呛喉，但暖。",
  1883	    "“铁门关，是上个月丢的。”他望着火，声音低沉，“那天晚上，我正好在关城上值夜。”",
  1884	    "“东军的三万人，像从地里冒出来的。没有火把，没有号角，只有——”他顿了顿，“黑烟。”",
  1885	    "“黑烟先是从关城北角的粮仓升起来的。我们以为是走水，冲过去一看，粮仓里没有火，只有烟。黑得像墨，不呛人，往人鼻孔里钻。”",
  1886	    "“然后，守关的兄弟，一个接一个地倒下了。不是受伤，是睡着了。站着，靠着墙，就睡着了。”",
  1887	    "他灌了一大口酒：“我砍了两个倒下的兄弟，他们又站起来了。眼睛是黑的。见人就咬。”",
  1888	    "“我跑出来的时候，关城上已经全是黑烟了。”",
  1889	    "篝火噼啪响了一声。老莱昂看着你：“小子，你说，这是打仗吗？”"
  1890	  ],
  1891	  options:[
  1892	    {t:"追问：那黑烟，后来怎么样了",check:{a:"INT",sk:"detect",label:"追问"},tier:{
  1893	      ok:["老莱昂摇摇头：“后来？后来东军入城，我们撤退。那黑烟，跟着我们追了三里地，然后——散了。像从来没存在过。”","“我后来打听过，东军那边，没有人承认放过什么烟。他们的前锋官说，他们只是'趁着夜色突击'。”","“可我知道我看见了什么。那黑烟，不是火，是活的东西。”"],
  1894	      fail:["老莱昂摇摇头：“后来？后来就撤了呗。我这条命，是捡回来的。”他显然不愿多谈细节。"],
  1895	      crit:["老莱昂压低声音：“撤下来之后，我偷偷回去看过一趟。关城北角的粮仓，还立在那里。可粮仓的地基，是新的——有人用新砖，把旧地基整个换了。”","“旧地基下面有什么，我不知道。但我知道，粮仓的位置，正好是关城阵法的一个节点。”","你默默记下。阵法节点。换地基。黑烟。这三件事连在一起，答案呼之欲出。"]
  1896	    },effects:{},onCrit:{flag:"tiebi_blacksmoke"},go:"tiebi_oldleon2"},
  1897	    {t:"问老莱昂：他的儿子怎么样（他提过儿子考上学院）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  1898	      ok:["老莱昂粗糙的脸上，罕见地露出一丝柔软：“我儿子，莱昂，考上了艾尔达魔法学院。学武技，说以后要当骑士。”他灌了口酒：“我跟他娘说，别让他学武，学点别的。可那小子，跟他老子一个脾气。”","他笑了笑：“他说，等他毕业，要回铁壁城守边。我说，你守你的边，我打我的仗，各干各的。”","火光映着他眼角的皱纹。你忽然觉得，这个老兵，比这座城还硬。也还脆。"],
  1899	      fail:["老莱昂摆摆手：“家务事，不提也罢。”他不想多说。"],
  1900	      crit:["老莱昂沉默了一会儿，从怀里摸出一块旧怀表，打开：表盖里夹着一张小小的画像，一个年轻姑娘。“我闺女，比他哥老实。”他轻轻合上表，“乱世里，当爹的，就盼孩子平平安安的。”","他把怀表收好，忽然说：“小子，你帮我个忙。要是你在学院见到我儿子莱昂，跟他说，他爹的仗，打得还不错。”"]
  1901	    },effects:{},onOk:{flag:"oldleon_family"},go:"tiebi_oldleon2"}
  1902	  ]
  1903	};
  1904	N["tiebi_oldleon2"] = {
  1905	  place:"铁壁城 · 西营 · 篝火旁", where:"夜",
  1906	  text:[
  1907	    "夜风把篝火吹得忽明忽暗。老莱昂又灌了一口酒，忽然说：",
  1908	    "“小子，我看你不像个普通人。你身上有股子——”他找了半天词，“见过世面的味道。”",
  1909	    "“铁门关的黑烟，不是东军的把戏。那东西，我在三十年前见过一次。”",
  1910	    "“三十年前，我还在北境当斥候。有一晚，草原上起了黑烟，跟铁门关一模一样。我们追过去，发现是暗蚀会的人，在草原上挖一个坑。”",
  1911	    "“坑里埋着——算了，那晚的事，我不愿意想。”他摆摆手，“我就告诉你一句：黑烟一起，就说明，那东西在找路。”",
  1912	    "“它在找通往地下的路。”",
  1913	    "篝火噼啪。他抬起眼，看着你，浑浊的眼睛里有一丝亮光：“你要查这条线，我劝你，先往北去。北境的冰狼部落，有个老萨满，比我知道的多。”",
  1914	    "“他叫'老狼'。”"
  1915	  ],
  1916	  options:[
  1917	    {t:"谢过老莱昂，记下'老狼'这个名字",effects:{rep:2},tier:{ok:["你与老莱昂碰了碰酒壶。酒很劣，但这份人情，很重。","'老狼。北境冰狼部落。'你把这个名字刻进记忆。"]},go:"tiebi_warfield"},
  1918	    {t:"问老莱昂：黑烟的事，他有没有告诉过别人",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  1919	      ok:["老莱昂嗤笑一声：“告诉过。跟营里的兄弟说过，跟军需官也提过一嘴。”他灌了口酒：“军需官说我是打仗打魔怔了。营里的兄弟说，老莱昂又开始说胡话了。”","“只有一个人当真了。一个南方来的账房先生，姓周，说他想听听细节。”老莱昂挠挠头，“我讲了半宿，他听得可认真了。”","你心头一跳。姓周的账房。银月商会。"],
  1920	      fail:["老莱昂摆摆手：“跟谁说？说了谁信？”他不想再谈这个。"],
  1921	      crit:["老莱昂压低声音：“那账房先生听完，给了我十个银币，让我'别跟别人提这茬'。我收了钱，也起了疑。”他眯起眼：“一个南方账房，对铁门关的黑烟这么上心，你说，他是哪边的人？”"]
  1922	    },effects:{},onCrit:{flag:"zhou_accountant"},go:"tiebi_warfield"}
  1923	  ]
  1924	};
  1925	N["tiebi_warfield"] = {
  1926	  place:"铁门关 · 古战场", where:"白昼",
  1927	  text:[
  1928	    "铁门关古战场在关城以东，绵延数百里的焦土。枯骨半埋半露，断裂的兵器插在土里，像一片歪斜的森林。",
  1929	    "这里的风很怪。呜呜地响，像是有人在很远的地方哭。",
  1930	    "你沿着战场边缘走，看见一队东军的斥候远远地策马而过，没有靠近。他们在巡逻，但看你的眼神，更像在忌惮这片土地。",
  1931	    "你在一处塌陷的土坡边停下。土坡下露出半截石砌的地基——与老莱昂说的'新砖换旧地基'，一模一样。",
  1932	    "你蹲下来，指尖抚过石砖。砖缝里渗出一丝若有若无的黑气，在阳光下几乎看不见。",
  1933	    "风忽然停了。四周静得可怕。"
  1934	  ],
  1935	  options:[
  1936	    {t:"挖开地基，看看下面有什么",check:{a:"STR",sk:"athletic",label:"挖掘"},tier:{
  1937	      ok:["你掘了半个时辰，挖开表层浮土。下面是一块平整的石板，刻着繁复的阵纹——与你在自由城邦下水道见过的仪式阵，同出一源。","石板中央有一个拳头大的凹槽，像是放什么东西的。凹槽边缘，有火烧过的痕迹。"],
  1938	      fail:["土太硬，你掘了半天，只挖出一堆碎砖。远处传来马蹄声，你只得先撤。"],
  1939	      crit:["你挖到石板后，又在旁边的浮土里摸到一件东西：一枚乌黑的铁牌，牌面刻着七道细纹环绕竖瞳——与自由城邦那枚，一模一样。","铁牌背面，多刻了一行小字：'祭品已备，七日为期。'你握着铁牌，手心发凉。"],
  1940	      critfail:["你挖开石板的一角，忽然一阵黑气从缝隙里喷出，直扑你的脸。你猛然后仰，黑气擦着你的鼻尖掠过，消散在空气里。","你退后两步，胸口气血翻涌。那片黑气经过的地方，脚下的草，瞬间枯黄了一圈。"]
  1941	    },effects:{xp:20},onCrit:{item:"乌黑铁牌（背面刻字）"},onCritFail:{hp:-10,san:-5},go:"tiebi_warfield2"},
  1942	    {t:"不挖。先记录位置和阵纹，撤离",check:{a:"INT",sk:"lore",label:"记录"},tier:{
  1943	      ok:["你借着一块焦木，把阵纹的走向拓印在布帛上。阵纹复杂，但你记得清楚。","收起拓印，你后退离开。身后，风又响了起来。"],
  1944	      fail:["阵纹太复杂，你描了几笔就乱了。只得放弃，记下大致位置。"],
  1945	      crit:["你不但拓下了阵纹，还在石板边缘发现一行极小的刻字，被泥土盖着：'第二次尝试。节点三。'","'第二次尝试'。这意味着，在此之前，有人在这里做过同样的事。"]
  1946	    },effects:{xp:25},onCrit:{flag:"node_three_attempt"},go:"tiebi_warfield2"}
  1947	  ]
  1948	};
  1949	N["tiebi_warfield2"] = {
  1950	  place:"铁门关 · 古战场 · 边缘", where:"暮色",
  1951	  text:[
  1952	    "暮色压下来，战场上的影子越拉越长。你正准备撤离，忽然听见身后传来马蹄声。",
  1953	    "不是一匹。是一队。",
  1954	    "你回头，看见一支黑甲骑兵从关城方向驰来，领头的骑士勒马停在你十丈外，居高临下地看着你：",
  1955	    "“东军前线，闲人免入。你是哪部分的？”",
  1956	    "他的目光扫过你，在你腰间（或背上的武器）停留了一瞬。",
  1957	    "你身后的土坡，那半截露出阵纹的石板，在暮色里静静地躺着。"
  1958	  ],
  1959	  options:[
  1960	    {t:"装成迷路的行商，糊弄过去",check:{a:"CHA",sk:"persu",label:"蒙混"},tier:{
  1961	      ok:["你立刻换上一副惶恐的表情，连声说自己是从河湾城贩粮的，走岔了路。领头的骑士打量你片刻，挥挥手：“往北走，十里外有官道。再往战场里钻，别怪我们不客气。”","你点头哈腰地退开，直到他们的身影消失在天际线，才长出一口气。"],
  1962	      fail:["你话说得磕巴。骑士眯起眼：“贩粮的？铁门关都封了，你贩给谁？”他手按上刀柄。你只得实说自己是冒险者，来捡战利品的。他冷哼一声：“捡死人钱？滚。”","你灰溜溜地离开。走出很远，还能感觉到他的目光钉在背上。"],
  1963	      crit:["你不但蒙混过关，还套出了一句情报：领头的骑士不耐烦地挥退手下时，嘟囔了一句：“上头说了，这几天夜里，谁都不许靠近战场西侧。”","'西侧。夜里。'你默默记下。"],
  1964	      critfail:["你话一出口就露了怯。骑士手一挥，两个骑兵下马搜身——你怀里的拓印布帛，被搜了出来。骑士抖开布帛，脸色骤变：“阵纹？你是什么人！”","你只得且战且退，最后是钻进一条土沟，又跑出三里地，才甩掉追兵。身上添了两道口子，胸口那道，最深。"]
  1965	    },effects:{},onCrit:{flag:"battlefield_west"},onCritFail:{hp:-15,flag:"east_wanted"},go:"tiebi_camp_back"},
  1966	    {t:"不硬碰，趁着暮色绕路撤离",check:{a:"AGI",sk:"stealth",label:"绕行"},tier:{
  1967	      ok:["你贴着战场边缘的沟壑，借着暮色与枯骨的掩护，绕开了那队骑兵。走出半里地，还能听见他们的马蹄声在远处回荡。"],
  1968	      fail:["你绕到一半，被一个落单的斥候发现。你只得拔腿狂奔，靠着一身蛮力（或敏捷）甩掉了追兵，代价是跑丢了半壶水。"],
  1969	      crit:["你绕路时，意外发现一处被浮土掩盖的凹坑。坑里有几具尸骸，穿着北境猎户的皮袄——不是士兵，是平民。尸骸旁散落着几枚银币和一张烧掉半边的纸。","你拾起纸，残存的字迹写着：'……人已灭口。阵纹无恙。勿再派平民。'" ,"你默默把纸收好，退离现场。"]
  1970	    },effects:{},onCrit:{flag:"farmers_slain"},go:"tiebi_camp_back"}
  1971	  ]
  1972	};
  1973	N["tiebi_camp_back"] = {
  1974	  place:"铁壁城 · 城门", where:"夜",
  1975	  text:[
  1976	    "你赶回铁壁城时，城门已经关了。守城的士兵认得你是白天在军营干过活的，从侧门放你进去。",
  1977	    "“前线这几天不安生，夜里宵禁。别乱跑。”",
  1978	    "你走在宵禁的街道上。路灯稀疏，脚步声在石板路上回响。",
  1979	    "远处，军营的方向灯火通明，隐约传来操练的号子声。联盟正在为一场大战做准备。",
  1980	    "你摸了摸怀里的拓印布帛和铁牌。铁门关的真相，已经浮出水面一角：不是东军的偷袭，是有人在关城阵法节点上，动了手脚。",
  1981	    "黑烟。阵纹。七纹竖瞳。银月商会。",
  1982	    "线索连成一条线，线的另一端，指向南方。"
  1983	  ],
  1984	  options:[
  1985	    {t:"在铁壁城再办点事（委托板）",go:"board_north"},
  1986	    {t:"南下，去南方商业城邦联盟追查银月商会",run:function(){ togglePanel("map"); }},
  1987	    {t:"北上，去北境城找'老狼'",run:function(){ travelTo("north_beijing"); }}
  1988	  ]
  1989	};
  1990	/* 北境城 · 兽人线 */
  1991	N["beijing_wolf"] = {
  1992	  place:"北境城 · 冰狼部落营寨", where:"白昼",
  1993	  text:[
  1994	    "冰狼部落的营寨在北境城以北的雪原上。灰白色的狼皮帐篷连绵成片，一只巨大的冰狼蹲在营门口，金色的眼睛懒洋洋地扫过你。",
  1995	    "部落的战士皮肤黧黑，眼神警惕。一个包着兽皮的老者从帐篷里走出来，他的脸上纹着图腾，灰白的辫子上系着狼牙。",
  1996	    "他看了你一眼，声音沙哑：",
  1997	    "“外乡人。来冰狼部落，是求药，还是求路？”",
  1998	    "“还是——替人带话？”",
  1999	    "你想起墨丘利（或老莱昂）提到的名字。"
  2000	  ],
  2001	  options:[
  2002	    {t:"说出'老狼'这个名字",check:{a:"CHA",sk:"persu",label:"表明来意"},tier:{
  2003	      ok:["老者的眼神一变。他上下打量你很久，缓缓开口：'老狼……好多年没人这么叫我了。'他转身，掀开帐篷的门帘：'进来吧。你带的是谁的话？'","你进了帐篷。炉火正旺，架上煮着一锅不知道是什么的肉汤，香气扑鼻。"],
  2004	      fail:["老者摇摇头：'老狼？冰狼部落没有叫老狼的。'他转身要走，你连忙说出墨丘利的名字，他才停住脚步，深深看你一眼：'……墨丘利让你来的？'"],
  2005	      crit:["老者盯着你看了三息，忽然笑了：'能叫出这个名号的，不是旧人，就是贵人。'他把你让进帐篷，亲自给你倒了一碗热汤：'喝。北境的风，喝不惯的，三碗内必倒下。'"]
  2006	    },effects:{rep:3},onOk:{flag:"oldwolf_met"},go:"beijing_oldwolf"},
  2007	    {t:"不提名字，先观察营寨",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  2008	      ok:["你注意到，营寨里的青壮年战士不多，大部分帐篷里住的是老人、妇女和孩子。一个部落战士正往雪橇上装干粮，旁边堆着刚从南边运来的铁器。","一个孩子追着狼崽跑过，被一个老妇人呵斥住。你听见她用部落语说：'别乱跑，大汗的使者快来了。'" ],
  2009	      fail:["你转了一圈，只看见积雪和狼影。"],
  2010	      crit:["你观察到更多细节：营寨北侧，有一排新搭的帐篷，旗帜是黑石部族的狼旗。几个黑石族的战士正跟冰狼部落的人争执，声音很大，你听清了几个词：'南下''盟誓''大汗的命令'。","你默默记下：黑石部族的使者，已经到冰狼部落了。"]
  2011	    },effects:{},onCrit:{flag:"heishi_envoys"},go:"beijing_oldwolf"}
  2012	  ]
  2013	};
  2014	N["beijing_oldwolf"] = {
  2015	  place:"北境 · 冰狼部落 · 老狼的帐篷", where:"白昼",
  2016	  text:[
  2017	    "帐篷里温暖而昏暗。老狼（自称'老萨满'）盘坐在火堆旁，手里捻着一串狼牙。",
  2018	    "他听完你的来意（墨丘利的信/老莱昂的引荐），沉默良久，说：",
  2019	    "“墨丘利让你来，是信得过你。老莱昂让你来，是信得过你的命。”",
  2020	    "“那我也不瞒你。草原上，出大事了。”",
  2021	    "他指了指帐篷外的北方：“黑石部族的萨满，三个月前开始'听祖灵说话'。他说，祖灵降下神谕：南下，夺回祖辈的牧场。”",
  2022	    "“可我知道，那不是祖灵的声音。”老狼的声音低下去，“祖灵说话，不是那个调子。”",
  2023	    "“那是另一种东西。借着'神谕'的壳，在草原上爬。”",
  2024	    "他抬起眼，目光浑浊而锐利：“三十年前，我也听过那个调子。在死亡沙漠的边上。”"
  2025	  ],
  2026	  options:[
  2027	    {t:"追问：那个'调子'，是什么",check:{a:"INT",sk:"lore",label:"追问"},tier:{
  2028	      ok:["老狼沉默了很久，从怀里摸出一块骨片。骨片焦黑，刻着扭曲的纹路——你一眼认出，那纹路与七纹竖瞳的变体相似。'三十年前，我在沙漠边缘捡到它。'他摩挲着骨片：'那时我还年轻，以为是古代遗物。后来我明白了——这东西，是活的。'","'它会把听到的话，变成你想听的话。'他抬眼：'黑石部族听到的'祖灵神谕'，十有八九，就是这东西在作祟。'"],
  2029	      fail:["老狼摇摇头：'说不清。说清了，怕你睡不着。'他不再多言。"],
  2030	      crit:["老狼压低声音：'三十年前，沙漠边缘的商队一夜失踪，只留下一地焦骨。我去看过——那些骨头上，都刻着这样的纹路。'他捻着骨片：'后来我听说，那天晚上，有人看见一队黑袍人，在沙漠里举行仪式。'","'从那以后，我就把这块骨片带在身上。它在，就能提醒我，这东西还没绝。'"]
  2031	    },effects:{xp:20},onCrit:{flag:"bone_talisman"},go:"beijing_oldwolf2"},
  2032	    {t:"问老狼：黑石部族的大汗，是什么样的人",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  2033	      ok:["老狼叹了口气：'大汗是个真汉子。年轻时跟我打过猎，喝过酒，是个直脾气。'他顿了顿：'可这半年，他变了一个人。说话越来越像'神谕'，眼神越来越远。'","'他信了那些'祖灵的话'。信得太深，深得……连我这样的老萨满，都见不到他了。'","你默默记下：黑石大汗，被'神谕'影响。"]
  2034	    },effects:{},go:"beijing_oldwolf2"},
  2035	    {t:"问老狼：那批黑石使者在营寨里做什么",check:{a:"INT",sk:"detect",label:"探问"},tier:{
  2036	      ok:["老狼压低声音：'他们来'劝说'我们冰狼部落加入南下。给了铁器，给了承诺，还带来了一块'祖灵圣物'。'他嗤笑一声：'那块圣物，我隔着帐篷看了一眼——黑气缠绕，不是好东西。'","'部落里的年轻人被说动了。他们血气方刚，觉得南下能抢回牧场。可我知道，这一去，是给那东西当枪使。'"]
  2037	    },effects:{},onOk:{flag:"heishi_pressure"},go:"beijing_oldwolf2"}
  2038	  ]
  2039	};
  2040	N["beijing_oldwolf2"] = {
  2041	  place:"北境 · 冰狼部落", where:"傍晚",
  2042	  text:[
  2043	    "傍晚时分，营寨外忽然传来骚动。",
  2044	    "你走出帐篷，看见一队黑石部族的战士正策马而来，为首的骑手举着一面黑旗，旗上绣着一只咆哮的狼头——黑石部族的战旗。",
  2045	    "老狼站在你身边，眯起眼：“来了。大汗的使者。”",
  2046	    "使者翻身下马，声音洪亮：“老萨满！大汗有令：三日之内，冰狼部落须起誓加入南下大军！否则——”他顿了顿，“大汗说，'狼群不分家。不走的狼，就是敌人的狼。'”",
  2047	    "营寨里安静了一瞬。老狼缓缓开口：“黑石部族，这是要拿冰狼开刀了。”",
  2048	    "他转头看向你，目光复杂：“外乡人，你来得正好。有些事，我一个老头子做不了，但你可以。”"
  2049	  ],
  2050	  options:[
  2051	    {t:"上前与使者交涉，拖延时间",check:{a:"CHA",sk:"persu",label:"交涉"},tier:{
  2052	      ok:["你上前一步，报出冒险者的名号，说你是受联盟委托来'调停'的，请使者宽限几日，容冰狼部落商议。使者打量你片刻，嗤笑一声：'联盟？联盟的人，现在自身难保。'但他还是松了口：'五日。五日之后，没有答复，我们兵临城下。'","他策马而去。老狼看着他的背影，低声道：'五日。够做很多事了。'"],
  2053	      fail:["使者根本不把你放在眼里：'一个外乡人，插什么嘴？'他扬鞭而去，只留下一句话：'三日，一天不多。'","老狼叹了口气：'三日，太紧了。'"],
  2054	      crit:["你不但稳住了使者，还从他话里套出一个关键信息：'大汗的'神谕'，最近越来越频繁。他身边的萨满，换了一批新人，都是'从南边来的'。'","你心头一跳。南边来的萨满。跟银月商会，是不是同一条线？","使者被你说服，答应五日之期，还答应传话给大汗：'有联盟的调停人，愿意谈谈。'"]
  2055	    },effects:{rep:5},onCrit:{flag:"south_shamans"},go:"beijing_decision"},
  2056	    {t:"趁乱，去黑石使者拴马的营地偷看'圣物'",check:{a:"AGI",sk:"stealth",label:"潜入"},tier:{
  2057	      ok:["你趁夜色摸到使者营帐。帐内无人，正中供着一块拳头大的黑石，石上纹路流转，像活物。你屏息靠近，那黑石忽然嗡地一震——你眼前一花，仿佛看见一片无边的黄沙，沙下埋着一座漆黑的神殿。","你咬破舌尖，清醒过来。退出帐篷时，你发现自己的手在抖。"],
  2058	      fail:["你刚靠近帐篷，就被一个巡逻的黑石战士喝住。你只得假装迷路，悻悻退回。那黑石的秘密，你终究没能看清。"],
  2059	      crit:["你不但看清了黑石，还在帐角发现一封没封口的信。信上字迹工整，用的是南方通用文：'圣物已至，冰狼部将入彀。七日后，北境大乱，可趁势南下。'落款处没有名字，只画着一个符号——一枚竖瞳。","你默默记下内容，把信放回原处，退出帐篷。心跳如鼓。"],
  2060	      critfail:["你摸进帐篷，指尖刚碰到黑石，那石头忽然发烫，烫得你缩手。与此同时，帐外传来脚步声——你只得从帐后溜走。","回到营寨，你才发现自己左手掌心里，多了一道淡黑色的灼痕，像一枚微缩的竖瞳。"]
  2061	    },effects:{xp:20,san:-3},onCrit:{flag:"south_letter"},onCritFail:{flag:"hand_mark",san:-5},go:"beijing_decision"}
  2062	  ]
  2063	};
  2064	N["beijing_decision"] = {
  2065	  place:"北境 · 冰狼部落 · 老狼的帐篷", where:"夜",
  2066	  text:[
  2067	    "夜里，老狼把你叫到帐篷。炉火很旺，他的脸色却很沉。",
  2068	    "“黑石部族的背后，有人在推。那人推的不是兽人，是整片草原的仇恨。”",
  2069	    "“这仇恨一旦烧起来，北境挡不住，联盟也挡不住。最后便宜的，只有躲在暗处的人。”",
  2070	    "他看着你：",
  2071	    "“外乡人，我给你两条路。”",
  2072	    "“第一条，留在这里，帮我们破掉那块'圣物'的局。破掉了，黑石部族的'神谕'就没了根，南下的事，还能再拖一拖。”",
  2073	    "“第二条，带着我的信，去南方。我听说，南方有个地方，专门查这种'神谕'背后的事——你去了，就知道是哪里。”",
  2074	    "“你选哪条？”"
  2075	  ],
  2076	  options:[
  2077	    {t:"留下，帮冰狼部落破'圣物'的局",go:"beijing_break"},
  2078	    {t:"接老狼的信，去南方追查",effects:{item:"老狼的信"},tier:{ok:["老狼把一封用蜡封好的信交给你：'到南方黄金城，找一个姓周的账房。他欠我一个人情。'他顿了顿：'小心。信在，人情在；信丢了，命也可能丢。'"]},go:"beijing_letter"},
  2079	    {t:"两条路都留个后手，先去办自己的事",check:{a:"INT",sk:"bargain",label:"权衡"},tier:{
  2080	      ok:["你权衡片刻，对老狼说：'破局的事，我人微言轻，但可以帮你们联络联盟的军队，牵制黑石部族。南边的事，我先托人带信过去。'","老狼沉吟片刻，点头：'也好。这年头，能两头下注的，都不是笨人。'他给你写了一封引荐信，又教了你一个冰狼部落的联络暗号。"]
  2081	    },go:"beijing_break"}
  2082	  ]
  2083	};
  2084	N["beijing_break"] = {
  2085	  place:"北境 · 冰狼部落 · 圣物帐篷外", where:"夜",
  2086	  text:[
  2087	    "破局的方法，老狼说得很直白：那块'圣物'，是一块深渊系的法器，靠吸收恐惧与信仰维持。要破它，要么毁掉它，要么把它'喂饱'到失控。",
  2088	    "老狼教你一个法子：冰狼部落的祖灵祭，是纯正的先祖信仰。如果在圣物旁边举行一场真正的祖灵祭，让纯粹的信仰冲刷它，那块黑石就会失去'神谕'的支撑。",
  2089	    "“但举行祖灵祭，需要一样东西：祖灵洞的圣火。”老狼说，“圣火在兽人圣山，黑石部族的腹地。取不来。”",
  2090	    "他沉默片刻：“除非——有一块足够强的'灵性材料'，能代替圣火，引动祖灵的力量。”",
  2091	    "他看着你，目光落在你的行囊上：“你身上，有那种材料的气息。”"
  2092	  ],
  2093	  options:[
  2094	    {t:"献出（或展示）一件灵性材料，助祭",check:{a:"SPR",sk:"soul",label:"引导",note:"需要材料"},tier:{
  2095	      ok:["你从行囊里取出一件蕴含灵性的材料（比如职业结晶或灵性物品），交到老狼手中。他捻着那材料，点点头：'够用了。'","当夜，祖灵祭在圣物帐篷外举行。篝火映着图腾，老狼唱着古老的祭歌，部落的老人们应和着。你站在人群里，感到一股温厚的、纯粹的信仰之力，缓缓汇入祭坛。","那块黑石，在祭歌中开始震颤。先是轻微的嗡鸣，然后越来越剧烈——最后，'啪'地一声，裂开一道缝。黑色的气息从裂缝里溢出，被祭火吞没，烧成青烟。"],
  2096	      fail:["你翻遍行囊，也没找到足够灵性的材料。老狼叹了口气：'罢了。是我老头子想当然了。'他摆摆手：'圣物的事，我另想办法。你该走就走吧。'"],
  2097	      crit:["你献出的材料出乎意料地纯粹。祭歌声中，那块黑石'啪'地裂成两半，里面的黑气还没冒出来，就被祭火烧得干干净净。","老狼愣了很久，才缓缓开口：'……成了。'他深深看你一眼：'外乡人，你帮了冰狼部落一个大忙。这份人情，部落记下了。'","远处的营帐里，黑石部族的使者半夜惊醒，发现'圣物'已碎，脸色惨白。"]
  2098	    },effects:{rep:8,xp:30},onCrit:{flag:"beijing_saved",infl:{north:5}},onFail:{},go:"beijing_after"},
  2099	    {t:"坦白：我没有那种材料，但有别的办法",check:{a:"INT",sk:"lore",label:"献计"},tier:{
  2100	      ok:["你提出一个替代方案：不用祖灵祭，改用'正面对峙'——在使者面前拆穿圣物的把戏。你凭借在自由城邦下水道见过的仪式知识，当众指出黑石上的纹路与深渊系法器同源，再让老狼以祖灵之名起誓作证。","使者脸色变了又变。最终，他带着黑石匆匆离去，说要回禀大汗。","老狼看着你，缓缓点头：'……胆大心细。好。'"],
  2101	      fail:["你的方案太冒险。老狼摇头：'当众拆穿？使者一句话就能翻过来。不行。'他最终自己决定，用最笨的办法：把圣物'埋回土里'，隔绝它的供养。","三天后，圣物在土里失去了光泽。但老狼说，这只是权宜之计。"],
  2102	      crit:["你不但当众拆穿了圣物的把戏，还借力打力，让使者在部落长老面前下不来台。使者灰溜溜地离开时，冰狼部落的长老们看你的眼神，已经带了敬意。","'这小子，不简单。'你听见有人低声说。"]
  2103	    },effects:{rep:5,xp:25},onCrit:{flag:"beijing_saved"},go:"beijing_after"}
  2104	  ]
  2105	};
  2106	N["beijing_after"] = {
  2107	  place:"北境 · 冰狼部落", where:"数日后",
  2108	  text:[
  2109	    "圣物的事，暂时压下了。黑石部族的使者连夜撤走，冰狼部落重新获得了一段喘息的时间。",
  2110	    "老狼在临别前，送你一件礼物：一枚冰狼牙，系着褪色的皮绳。",
  2111	    "“带着它。北境的狼认这个。”他顿了顿，“还有，替我转告墨丘利（或老莱昂）：草原上的风，越来越紧了。”",
  2112	    "你握着那枚狼牙，冰凉的触感从掌心传来。",
  2113	    "远处，雪原上传来一声悠长的狼嚎。"
  2114	  ],
  2115	  options:[
  2116	    {t:"北上或南下，继续你的旅程",run:function(){ togglePanel("map"); }},
  2117	    {t:"在北境再办点事（委托板）",go:"board_north"}
  2118	  ]
  2119	};
  2120	/* 其余北境城市支线 */
  2121	N["kuangshan_forge"] = {
  2122	  place:"矿山城 · 铁匠铺", text:["铁匠铺里，炉火通红。掌柜老铁匠一边打铁一边跟你聊行情：'联盟征购军械，铁价翻了倍。矮人那边的矿石，倒是好货，就是运不出来。'","他压低声音：'不过，我听说矿山深处，最近挖出点怪东西。矿工们不敢下井，说井下有'声音'。'"],options:[
  2123	    {t:"去矿口看看那'声音'是怎么回事",check:{a:"INT",sk:"detect",label:"探查"},tier:{ok:["你下到矿口，贴着岩壁听了一会儿。果然，深处传来若有若无的低响，像是什么东西在石层里蠕动。你问老矿工，他们说这声音是三个月前开始的，夜里有，白天没有。","你记下这个异常。矿脉深处，恐怕不止有矿。"]},go:"board_north"},
  2124	    {t:"在铁匠铺买点趁手的家伙",check:{a:"CHA",sk:"bargain",label:"砍价"},tier:{ok:["你挑了一件顺手的武器/工具，跟老铁匠磨了半天价。他最后叹了口气：'罢了，看你顺眼，少收你两成。这年头，多一个使唤得动兵器的活人，比多一袋铁料强。'"],crit:["你挑兵器时露了一手，老铁匠眼睛一亮：'有底子！'他多送你一柄淬火短刃：'路上用。'"]},effects:{gold:-15},onCrit:{item:"淬火短刃"},go:"board_north"}
  2125	  ]
  2126	};
  2127	N["kuangshan_mine"] = {
  2128	  place:"矿山城 · 矿口", text:["矿口的风，带着潮湿的土腥味。你跟着一队矿工下到巷道，看见壁上嵌着星星点点的矿石，在火光里闪着微光。","一个老矿工告诉你：'最近联盟征购铁料，矿工们连轴转。但深巷里那声音，谁也不敢去听。'" ],options:[
  2129	    {t:"下到深巷，采掘稀有矿材",check:{a:"STR",sk:"athletic",label:"采掘"},tier:{ok:["你在深巷的岩壁上，敲下几块成色不错的矿材。虽不是什么稀世之物，但卖相很好，能换几个钱。"],crit:["你运气不错，敲开一块矿石，里面裹着一小粒晶莹的结晶——正合你职业需要的那类材料。你小心收好。"],fail:["你敲了半天，只敲下一堆碎屑。老矿工在旁边笑：'新手的运气，都在头三下。'" ],critfail:["你往深巷走了几步，忽然听见那'声音'变得清晰——像有人在岩壁另一侧，缓缓呼吸。你心头一紧，快步退回。回头时，你仿佛看见巷道深处的阴影里，有什么东西动了一下。"]},effects:{gold:12},onCrit:{mat:function(){const j=JOBS[S.job]; return j.mats[1];}},go:"board_north"}
  2130	  ]
  2131	};
  2132	N["hewan_market"] = {
  2133	  place:"河湾城 · 集市", text:["河湾城的集市热闹而丰饶。粮摊、菜摊、布摊、铁器摊，连绵到街尾。你混在人群里，嗅着麦香与汗味。","一个粮商拉住你，压低声音：'客官，收粮不？官价的三成，好货。'你看着他的眼睛，里面藏着不安。"],options:[
  2134	    {t:"盘问：这粮是哪来的",check:{a:"CHA",sk:"persu",label:"盘问"},tier:{ok:["粮商支吾半天，才说是从'北边逃来的流民'手里收的，'他们不要钱，要粮食换命'。你默默记下：北边的情况，比铁壁城的公告还糟。","你买了几袋粮，又告诉他：'流民的粮，别压价。这年头，良心比金子贵。'" ],crit:["粮商压低声音：'客官是明白人，我跟你说句实话——东军占了铁门关后，北边的流民一批接一批。可前些天，有一批流民，夜里被一队穿黑袍的人接走了。'他打了个寒颤：'那队人，不像联盟的兵。'"]},effects:{gold:-5},go:"board_north"}
  2135	  ]
  2136	};
  2137	N["hewan_road"] = {
  2138	  place:"河湾城 · 河堤", text:["河堤上，船工们正在卸货。三河交汇的水面上，帆影往来。","一个老船工蹲在船头抽烟，跟你唠：'往南的船，最近查得严。圣痕司的人，见船就翻。'他压低声音：'不过，有银子，就有不查的船。'"],options:[
  2139	    {t:"打听：哪条船'不查'",check:{a:"CHA",sk:"bargain",label:"打听"},tier:{ok:["老船工吐出一口烟：'城南码头，第三根桩，挂白旗的船。'他顿了顿：'不过客官，我劝你没事别上那条船。那条船的货，从来不让人看。'","你默默记下。挂白旗的船。"]},go:"board_north"}
  2140	  ]
  2141	};
  2142	N["senlin_archery"] = {
  2143	  place:"森林城 · 靶场", text:["你在靶场租了一张弓。半精灵少女（白天那位）站在旁边，教你搭箭、开弓、撒放。","'呼吸要匀。手要稳。心要静。'她的声音清脆：'弓箭不会骗人。你心里乱，箭就偏。'" ],options:[
  2144	    {t:"练箭",check:{a:"AGI",sk:"athletic",label:"射术"},tier:{ok:["你练了一个时辰，箭矢从脱靶到上靶。半精灵少女点头：'有天赋。练上三年，能赶上巡林的。'她送你一壶箭：'路上用。'" ],crit:["你第十箭，正中靶心。半精灵少女吹了声口哨：'可以啊！'她想了想，送你一张旧弓：'我换下来的。比租的好用。'"]},effects:{xp:15},onCrit:{item:"旧猎弓"},go:"board_north"}
  2145	  ]
  2146	};
  2147	N["senlin_legend"] = {
  2148	  place:"森林城 · 酒馆", text:["森林城的酒馆里，一个老猎人正被围着讲森林深处的传说。你凑过去听了一耳朵。","'……精灵王国的边界，三百年前就封了。可去年，有人看见迷雾里亮起银光，像是有人在林子里点了一盏灯。'老猎人呷了口酒：'还有人听见，林子里有马队跑过的声音——可那地方，根本没有路。'"],options:[
  2149	    {t:"追问细节",check:{a:"INT",sk:"detect",label:"追问"},tier:{ok:["老猎人压低声音：'那银光，不是灯。我年轻时见过一次——是精灵的'银月术'。有人在大陆的精灵边界，用精灵族的法术。'他摇摇头：'可精灵王国闭关三百年，谁会在这里用银月术？'","你默默记下。"]},go:"board_north"}
  2150	  ]
  2151	};
  2152	N["haigang_ship"] = {
  2153	  place:"海港城 · 码头", text:["老水手蹲在船头，给你讲了那条失踪的船：'货船'白帆号'，半月前出海，往南。三天后，它回来了——空船，帆没破，桨没断，一个人都没有。'","'船上的货，一样没少。人，全没了。'他压低声音：'船头的木板上，刻着一个圈，圈里一只眼睛。'"],options:[
  2154	    {t:"去看看那条空船",check:{a:"INT",sk:"detect",label:"勘查"},tier:{ok:["你在港口角落找到那条'白帆号'。船上确实空无一人，货物原封不动。你检查船头，果然看到一个刻痕：一个圆圈，圈里一只竖瞳——与七纹竖瞳，如出一辙。","你心头一沉。这条线，已经从内陆，延伸到海上。"],crit:["你检查得更细。在船舱的隔板夹层里，你发现一本浸水的账册，纸张已经泡烂，但有几页还能看清：'……运往深渊神殿……祭品：水手12名……'","你把能看清的几页拓下来，收进怀里。"]},effects:{xp:20},onCrit:{flag:"ghost_ship"},go:"board_north"}
  2155	  ]
  2156	};
  2157	/* 北方委托板 */
  2158	const NORTH_BOARD = [
  2159	  {t:"护送军粮到铁壁城外围哨所",check:{a:"STR",sk:"martial",label:"护送"},ok:["你护送着军粮车队，一路平安抵达哨所。哨所的老兵塞给你一份赏金：'乱世里，能平安运到，就是本事。'"],fail:["你们半路遇上一伙流民抢粮。你拼力保住了大部分，但丢了两袋。军需官扣了你一半赏金。"],okEff:{gold:20,xp:25,rep:2},failEff:{gold:8,xp:10}},
  2160	  {t:"替北境城的猎人送一封急信到河湾城",check:{a:"AGI",sk:"athletic",label:"送信"},ok:["你日夜兼程，把信送到河湾城。收信的粮商看完信，脸色一变，多给了你一份赏金：'你送的不是信，是命。'"],fail:["你半路淋了雨，信纸湿了半边。收信人脸色不好看，只给了你半份赏金。"],okEff:{gold:15,xp:20,rep:1},failEff:{gold:5,xp:8}},
  2161	  {t:"清理铁门关外围的一窝野狼",check:{a:"STR",sk:"martial",label:"猎杀"},ok:["你摸到狼窝，三只野狼。你干净利落地解决了它们，割下狼耳回去领赏。猎人点头：'利索。'"],fail:["狼比你想象的凶。你挂了彩才脱身，只打死一只。猎人叹了口气，给了你半份赏金。"],okEff:{gold:18,xp:25},failEff:{gold:6,xp:10,hp:-8}},
  2162	  {t:"帮矿山城的老铁匠送一箱精铁到艾尔达城",check:{a:"INT",sk:"bargain",label:"押运"},ok:["你搭上北上的商队，一路平安。老铁匠收到货款，多给你两枚银币：'路上没少斤两，好样的。'"],fail:["路上被圣痕司的关卡扣了箱，说你'运输军需物资无批文'。你交了罚金才过关。老铁匠脸色铁青。"],okEff:{gold:16,xp:20,rep:1},failEff:{gold:4,xp:8,rep:-1}},
  2163	  {t:"替河湾城的酒馆老板娘打捞沉在河里的酒桶",check:{a:"STR",sk:"athletic",label:"打捞"},ok:["你扎进河里，把三桶酒都捞了上来。老板娘眉开眼笑，请了你一顿晚饭，还送了你一壶好酒。"],fail:["河水太浑，你捞了半天，只捞起一桶。老板娘撇撇嘴，给了你一点辛苦钱。"],okEff:{gold:10,xp:15,item:"一壶好酒"},failEff:{gold:4,xp:8}},
  2164	  {t:"护送一位老学者翻越霜狼山脉支脉",check:{a:"SPR",sk:"will",label:"向导"},ok:["老学者腿脚不便，你一路搀扶，翻过山梁。他在山腰停下来，望着远方，忽然说：'年轻人，山的那边，是深渊的方向。别去太深。'"],fail:["山路难行，你们半路遇上塌方，绕了一天。老学者累得直喘气，赏金少给了一半。"],okEff:{gold:14,xp:25,rep:2,book:function(){const j=JOBS[S.job];return j.books[1]?j.books[1][0]:null;}},failEff:{gold:5,xp:10}}
  2165	];
  2166	N["board_north"] = function(){
  2167	  const picks = shuffle(NORTH_BOARD).slice(0,3);
  2168	  return {
  2169	    place:"北方公国联盟 · 冒险者公会委托板", where:"白昼",
  2170	    text:["委托板前人头攒动。战争时期，活计比平时多了一倍，赏金也厚。你扫了一遍，挑了三个顺眼的。"],
  2171	    options: picks.map(b=>({
  2172	      t:b.t, check:b.check, tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},
  2173	      effects:b.okEff, onFail:b.failEff, go:"board_north_done"
  2174	    })).concat([{t:"不接了，办正事要紧",go:"north_leave"}])
  2175	  };
  2176	};
  2177	N["board_north_done"] = {
  2178	  place:"委托板", text:["你把委托交了，赏金落袋。这年头，力气和胆量，都是硬通货。"],
  2179	  options:[
  2180	    {t:"再接一单",go:"board_north"},
  2181	    {t:"继续赶路",run:function(){ togglePanel("map"); }}
  2182	  ]
  2183	};
  2184	function shuffle(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
  2185	/*==STORY_NORTH==*/
  2186	/* ================================================================
  2187	   南方商业城邦联盟
  2188	   ================================================================ */
  2189	N["arrive_south_huangjin"] = {
  2190	  place:"南方商业城邦联盟 · 黄金城", where:"途中",
  2191	  text:[
  2192	    "黄金城的空气里飘着铜臭味与纸墨香。这里没有城墙，取而代之的是一排排账房与交易所，屋檐下挂着各家商号的旗幡。",
  2193	    "金秤家族的徽记——一杆金色的天平——几乎挂满半座城。那是财富之神在人间的代行家族，也是整个南方联盟的金融心脏。",
  2194	    "你进城时，正赶上交易所开盘。人群涌向那块巨大的报价板，数字在木牌上翻飞，有人狂喜，有人面如死灰。",
  2195	    "一个穿灰袍的账房先生从你身边走过，步履匆匆。你注意到他的袍角，绣着一弯银色的新月——银月商会。",
  2196	    "他在你身后停了一下，回头看了你一眼。那目光很轻，却像秤砣一样，沉甸甸地压在你身上。"
  2197	  ],
  2198	  options:[
  2199	    {t:"先去银月商会的门面，探探虚实",go:"south_silver_front"},
  2200	    {t:"去金秤家族的总账房，打听行情",go:"south_goldscale"},
  2201	    {t:"先落脚，接点活计",go:"board_south"}
  2202	  ]
  2203	};
  2204	N["arrive_south_moxie"] = {
  2205	  place:"南方商业城邦联盟 · 魔械城", where:"途中",
  2206	  text:[
  2207	    "魔械城是一座会喘气的城。蒸汽从无数根烟囱里喷出来，齿轮的轰鸣声昼夜不息，街上的马车是铁壳的，连路灯都是符文与机械的混血。",
  2208	    "你抬头，看见一艘巨大的飞空艇正缓缓升空，气囊上绘着魔械学院的徽记，拖着长长的绳索与阴影。",
  2209	    "码头的管事看见你仰头的样子，笑了：",
  2210	    "“没见过飞空艇？魔械城造的。日行二百里，天上飞。就是贵——十枚金币一趟。”",
  2211	    "“不过你要是有本事的，倒是可以去发明家协会碰碰运气。他们最近，到处招人。”"
  2212	  ],
  2213	  options:[
  2214	    {t:"去发明家协会看看",go:"moxie_guild"},
  2215	    {t:"去炼金工坊学点手艺，淘点材料",go:"moxie_workshop"},
  2216	    {t:"先落脚，接点活计",go:"board_south"}
  2217	  ]
  2218	};
  2219	N["arrive_south_xueshu"] = {
  2220	  place:"南方商业城邦联盟 · 学术城", where:"途中",
  2221	  text:[
  2222	    "学术城的街道以学者命名，书店比酒馆还多。这里的空气里飘着油墨与咖啡的气味，争论声从每一扇窗子里溢出来。",
  2223	    "但最近，学术城的风向变了。城中心的广场上，贴着一张圣痕司的公告：净化令扩展，凡涉及奥术、灵魂、归墟研究的书籍，一律收缴。",
  2224	    "你路过一家书店，看见掌柜正把一摞书往地窖里搬。他看见你，苦笑：",
  2225	    "“藏几本书，跟藏几条命似的。这世道。”",
  2226	    "他压低声音：“不过，你要是真想找'禁书'，我知道个地方——城东的老磨坊，夜里有人卖。”"
  2227	  ],
  2228	  options:[
  2229	    {t:"去城东老磨坊，看看'禁书'黑市",go:"xueshu_mill"},
  2230	    {t:"在书店里淘几本正经书",go:"xueshu_bookshop"},
  2231	    {t:"先落脚",go:"board_south"}
  2232	  ]
  2233	};
  2234	N["arrive_south_shangzhan"] = {
  2235	  place:"南方商业城邦联盟 · 商栈城", where:"途中",
  2236	  text:[
  2237	    "商栈城是大陆最大的集市。这里的规则只有一条：没有买不到的东西，只有出不起的价。",
  2238	    "你走在绵延数里的摊位间，耳边全是吆喝声与讨价还价声。香料、丝绸、铁器、药草，还有来路不明的'奇物'，都在这条街上流动。",
  2239	    "一个蒙着半张脸的摊主拉住你，压着嗓子：",
  2240	    "“客官，有'好货'。北边来的，见过血的。要不要？”",
  2241	    "他掀开布角，露出一柄短刃。刃口泛着暗红的光，像是淬过什么。"
  2242	  ],
  2243	  options:[
  2244	    {t:"看看那把'见过血'的短刃",go:"shangzhan_knife"},
  2245	    {t:"在集市里逛逛，淘点材料",go:"shangzhan_market"},
  2246	    {t:"先落脚",go:"board_south"}
  2247	  ]
  2248	};
  2249	N["arrive_south_gangkou"] = {
  2250	  place:"南方商业城邦联盟 · 港口城", where:"途中",
  2251	  text:[
  2252	    "港口城的海风带着咸腥味。帆樯如林，泊位里停着各色船只，从灵巧的商船到臃肿的货船，再到几艘挂着战旗的武装船。",
  2253	    "你站在栈桥上，看见一艘船正缓缓进港——船身干净，帆没破，但码头上没有一个人迎接它。",
  2254	    "一个老港务官顺着你的目光看过去，叹了口气：",
  2255	    "“白帆号。半月前失踪的那艘，自己飘回来了。船上一个人都没有。”",
  2256	    "“这已经是这个月第三艘了。”"
  2257	  ],
  2258	  options:[
  2259	    {t:"打听失踪船只的详情",go:"gangkou_ships"},
  2260	    {t:"找艘去往他处的船，搭个顺风",go:"gangkou_berth"},
  2261	    {t:"先落脚",go:"board_south"}
  2262	  ]
  2263	};
  2264	/* 黄金城 · 银月商会线 */
  2265	N["south_silver_front"] = {
  2266	  place:"黄金城 · 银月商会门面", where:"白昼",
  2267	  text:[
  2268	    "银月商会的门面是黄金城里最气派的三层楼。门楣上的银色新月在阳光下熠熠生辉，进出的商人络绎不绝。",
  2269	    "你混在人群里进了大厅，看见柜台后的伙计们飞快地拨着算盘。墙上挂着一幅巨大的商路图，用朱笔标着各条线路。",
  2270	    "你注意到，银月商会的生意范围广得离谱：粮食、铁器、药材、奢侈品、甚至——'劳务'。",
  2271	    "你正看着，一个穿灰袍的账房先生从楼上走下来。他四十来岁，面容清癯，步子很稳。你认出他——码头那位。",
  2272	    "他走到你面前，微微一笑：",
  2273	    "“这位客人，面生。来银月商会，是办业务，还是——打听事？”",
  2274	    "他的笑容很客气，但你看得出，那双眼睛在称量你。"
  2275	  ],
  2276	  options:[
  2277	    {t:"说是来谈生意的，探探他们的底",check:{a:"CHA",sk:"bargain",label:"周旋"},tier:{
  2278	      ok:["你报了个假名号，说想走一批'北边的货'。账房先生听了，笑道：'北边的货，如今不好走。'他压低声音：'不过客人要是真有门路，商会倒是有兴趣。'他给你留了个地址：'今晚，城南码头，第三根桩。带样货来。'","你面上应着，心里却一凛：城南码头第三根桩——河湾城的老船工，也提过这个地方。"],
  2279	      fail:["你的话术不够圆滑。账房先生笑着摇头：'客人，商会有商会的规矩。没有介绍人，不谈大生意。'他客气地把你送出门，但你看得出，他已经把你这张脸记住了。"],
  2280	      crit:["你不但周旋住了，还反客为主，问出了关键一句：'银月商会走'劳务'，走的是什么劳务？'账房先生眼神一闪，笑道：'客人打听这个，是想入伙？'他没有正面回答，但那个'入伙'二字，像一颗种子，落在你心里。"],
  2281	      critfail:["你话里露了破绽——你提到'北边的货'时，说错了暗语。账房先生的笑容淡了下去：'客人，商会不做生人的生意。请回。'他转身离去，两个壮汉无声地出现在门口。","你走出银月商会大门时，感觉背后的目光，像针一样扎着。"]
  2282	    },effects:{},onCrit:{flag:"silver_hook"},onCritFail:{flag:"silver_suspicious"},go:"south_silver_back"},
  2283	    {t:"不进门，在对面茶楼盯着银月商会的进出",check:{a:"AGI",sk:"detect",label:"监视"},tier:{
  2284	      ok:["你在对面茶楼坐了一下午，把银月商会的进出人流看了个清楚：普通商人、搬运工、还有几顶轿子，轿帘压得极低，看不清里面的人。","你注意到，每天酉时，都会有一辆不起眼的马车从后门驶出，车辙很深，压着重货。车上的印记，是银月商会的——但车帘的颜色，比正门的货暗一层。"],
  2285	      fail:["你坐了一下午，只看见进进出出的商人。茶凉了三壶，什么也没看出来。"],
  2286	      crit:["你注意到一个细节：那辆酉时马车，每三天来一次，每次都停在后门，由同一个灰袍人接应。今天，你数了一下——从马车上搬下来的箱子，是十三个。昨天在码头，你数过同样形状的箱子，也是十三个。","十三个箱子。同样的数量，不同的日子。你在心里画了一个问号。"],
  2287	      critfail:["你盯得太久，茶楼的小二来续了三次水，看你的眼神越来越怪。最后，一个穿便服的壮汉走过来，客气地说：'这位客人，我们掌柜说，您要是对银月商会感兴趣，不如进门谈。'","你只得悻悻离开。你知道，你被发现了。"]
  2288	    },effects:{},onCrit:{flag:"silver_thirteen"},onCritFail:{flag:"silver_suspicious"},go:"south_silver_back"}
  2289	  ]
  2290	};
  2291	N["south_silver_back"] = {
  2292	  place:"黄金城 · 城南码头", where:"夜",
  2293	  text:[
  2294	    "夜里，你按约定来到城南码头。第三根桩，果然停着一艘船，船头挂着白旗。",
  2295	    "你靠近时，船上的伙计看了你一眼，没说话，只让开了一条跳板。",
  2296	    "你上了船，看见船舱里堆着木箱——与你在自由城邦下水道密室见过的，一模一样。",
  2297	    "你正要细看，一个声音从背后响起：",
  2298	    "“客人，看货，还是看人？”",
  2299	    "你回头。月光下，站着一个灰袍人。他掀开兜帽，露出一张清癯的脸——是码头那位账房先生。",
  2300	    "他微微一笑：“又见面了。我就说，你不是来做生意的。”",
  2301	    "他的目光越过你，落在舱口的阴影里。你顺着他的目光看去，看见阴影里站着两个人，手按在腰间。",
  2302	    "你被围住了。"
  2303	  ],
  2304	  options:[
  2305	    {t:"硬闯，先发制人",check:{a:"STR",sk:"martial",label:"突围"},tier:{
  2306	      ok:["你一脚踢翻最近的木箱，趁乱扑向舱门。灰袍人显然没料到你这么果断，他退后半步，那两个壮汉迎上来——你与他们过了几招，寻个破绽，翻身跳进水里。","冰冷的水漫过头顶。你潜出半里地，才从一处废弃的栈桥下爬上来。回头望去，那艘挂白旗的船，已经悄悄离岸。"],
  2307	      fail:["你刚动手，就被两个壮汉架住。灰袍人走近，居高临下地看着你：'客人，商会有商会的规矩。不守规矩的人——'他顿了顿，'我们一般请他喝三天的水。'","你被关在船舱里一夜，第二天清晨，被扔在码头边的淤泥里。身上值钱的东西，都被搜走了。"],
  2308	      crit:["你出手极快，一肘放倒一个壮汉，又借着木箱的掩护，绕到灰袍人身后。他没想到你的身法这么快，刚要喊人，你已经掐住了他的脉门。'带我去见你们的头。'你说。','你、你是什么人？'他声音发颤。'一个想做生意的人。'你说。"],
  2309	      critfail:["你冲得太急，一脚踩空，从跳板上摔进水里。呛了好几口水，才被壮汉们像捞鱼一样捞上来。灰袍人蹲在岸边，看着浑身滴水的你，笑了：'客人，这大半夜的，洗冷水澡？'","你被押走关了一夜。第二天清晨被放出来时，你发现怀里的乌黑铁牌，不见了。"]
  2310	    },effects:{},onFail:{gold:-20},onCritFail:{loseItem:"乌黑铁牌"},go:"south_after_escape"},
  2311	    {t:"稳住，先谈条件",check:{a:"CHA",sk:"persu",label:"谈判"},tier:{
  2312	      ok:["你举起双手，示意没有恶意：'我是冒险者，有人托我带句话。'灰袍人眯起眼：'谁？''一个姓周的账房，说欠他一个人情。'你报出老狼教你的暗号。","灰袍人的表情变了。他盯着你看了很久，然后缓缓挥手，让两个壮汉退下：'……进来谈。'"],
  2313	      fail:["灰袍人嗤笑一声：'带话？深更半夜上船，就为了带句话？'他摇摇头：'客人，你这话，连你自己都不信吧。'他挥挥手，壮汉们上前，把你'请'下了船。"],
  2314	      crit:["你不但报出了暗号，还加了一句：'三十年前，沙漠边缘的骨片。'——那是老狼告诉你的信物细节。灰袍人的瞳孔猛地一缩。他沉默了很久，声音低下去：'……老狼他还活着？'","他把你让进船舱，关上门。'说吧，他让你带什么话。'"]
  2315	    },effects:{rep:3},onCrit:{flag:"zhou_contact"},go:"south_zhou"},
  2316	    {t:"翻窗跳船，全身而退",check:{a:"AGI",sk:"stealth",label:"脱身"},tier:{
  2317	      ok:["你趁他们注意力在舱门，一翻身从船舷滑下去，贴着水面游开。夜色掩护着你，那艘船在月光下静静浮着，没人发现你少了一个人。","你游到对岸，拧干衣服，回头看了一眼。那艘白旗船，像一座浮在水上的谜。"],
  2318	      fail:["你翻窗时踩断了一根缆绳，声响惊动了船上的人。你只得跳进水里，身后传来喊声。你游出老远，才甩掉追兵，代价是丢了半袋干粮。"],
  2319	      crit:["你不但全身而退，还在船舷边顺手摸走了一样东西：一封信，压在缆绳桩下，用火漆封着。你游到对岸拆开——信上只有一行字：'十三箱已到。七日后，节点四。'","你捏着信纸，指尖发凉。节点四。这是你听到的第二个节点编号。"]
  2320	    },effects:{},onCrit:{flag:"node_four_letter"},go:"south_after_escape"}
  2321	  ]
  2322	};
  2323	N["south_zhou"] = {
  2324	  place:"黄金城 · 城南码头 · 船舱", where:"夜",
  2325	  text:[
  2326	    "船舱里点着一盏油灯。灰袍人——你终于知道，他就是老狼说的那个'姓周的账房'——给你倒了杯茶。",
  2327	    "“老狼让你来找我，是信得过你。”他开口，声音比在码头上低沉得多，“那我也不瞒你。”",
  2328	    "“我是银月商会的账房，周名。但这二十年，我真正的身份，是盯着银月商会的人。”",
  2329	    "“银月商会的背后，不是普通商人。是暗蚀会。”",
  2330	    "他指了指舱壁上的银月纹章：“这弯新月，不是月亮。是竖瞳的倒影。”",
  2331	    "“我在这条船上待了二十年，看着他们用商会的壳，往大陆各处运'不该运的东西'——铁器、药材、还有……人。”",
  2332	    "他抬起眼，目光很亮：“你既然走到了这一步，我就告诉你一句实话：他们的目标，在死亡沙漠。七号封印。”"
  2333	  ],
  2334	  options:[
  2335	    {t:"追问：暗蚀会的'货'，都是什么",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
  2336	      ok:["周账房沉默片刻，从舱板下取出一本账册，翻给你看：'三个月前，他们运了三百斤'灵材'到沙漠；两个月前，'劳务'一百二十人；一个月前——'他翻到最后一页：'十三个箱子，装上船，往南。'他合上账册：'十三个箱子，装的全是'活物'。'","你的心沉了下去。活物。祭品。"],
  2337	      fail:["周账房摇摇头：'有些东西，说出来怕吓着你。你只需要知道，那不是什么好东西。'"],
  2338	      crit:["周账房压低声音，告诉你更多：'暗蚀会内部，分五个部门：金、刃、眼、骨、智。'他指了指自己：'我盯的是'金'财务司。财务司的头，人称'玛门'，从前是自由城邦的首席财务大臣，金融天才。'","'银月商会，就是他的钱袋子。'"]
  2339	    },effects:{xp:20},onCrit:{flag:"mammon_info"},go:"south_goldscale"},
  2340	    {t:"问周账房：我能帮你做什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  2341	      ok:["周账房看着你，缓缓说：'我需要有人，把这本账册送到圣城。'他顿了顿：'圣城有个旧书店，叫'烛台'。掌柜是我的人。'","'账册里有银月商会近半年的运输记录，足够圣痕司（或者真正想查的人）顺藤摸瓜。'他苦笑：'但这本账册，要是落到暗蚀会手里——'他做了个割喉的手势。","你看着他，点头：'我送。'"],
  2342	      fail:["周账房摇摇头：'你现在还太弱，扛不住这本账册的分量。'他想了想：'你先去金秤家族那边转转，长长见识。等你够格了，再回来找我。'"],
  2343	      crit:["周账房深深看了你一眼：'你身上有股'见过深渊'的味道。'他把账册交给你，又加了一句：'记住，账册到圣城，只交'烛台'掌柜。其他人，一概不给。'","他顿了顿：'包括圣痕司。'"]
  2344	    },effects:{item:"银月商会账册",rep:5},onCrit:{flag:"ledger_task"},go:"south_goldscale"}
  2345	  ]
  2346	};
  2347	N["south_goldscale"] = {
  2348	  place:"黄金城 · 金秤家族总账房", where:"白昼",
  2349	  text:[
  2350	    "金秤家族的总账房是一座七层高塔，塔顶悬着一杆巨大的金色天平，在日光下缓缓转动。据说，那是财富之神赐下的圣器，能称量人心。",
  2351	    "你走进大厅，看见柜台上方挂着一行金字：",
  2352	    "“等价交换，万物有价。”",
  2353	    "一个戴着金丝眼镜的老者迎上来，笑容和蔼：",
  2354	    "“客人，来金秤家族，是存钱，是借贷，还是——鉴宝？”",
  2355	    "他听说你是冒险者，眼睛一亮：",
  2356	    "“哦？冒险者好。我们正缺人手——有笔账，需要人跑一趟'特殊的路'。报酬优厚。”"
  2357	  ],
  2358	  options:[
  2359	    {t:"接下金秤家族的'特殊差事'",check:{a:"INT",sk:"bargain",label:"谈酬"},tier:{
  2360	      ok:["老者的差事很简单：把一封信送到学术城的一位教授手里，'走不那么显眼的路'。报酬二十枚金币。你答应下来。","临走时，老者多看了你一眼，压低声音：'客人，金秤家族做的是正经生意。但世道不太平，正不正经，有时候也看人。'"],
  2361	      fail:["老者笑了笑：'客人，这差事要的是'可靠'二字。您刚进门，我们还不太了解。'他婉拒了你。"],
  2362	      crit:["你谈酬时露了一手行情，老者刮目相看：'懂行！'他不但给了差事，还多交给你一桩：'顺路，替老朽看看学术城的行情。有人问起，就说你是金秤家族的'临时外勤'。'","这等于给你发了一张金秤家族的临时身份。"]
  2363	    },effects:{gold:20,xp:15,rep:3},onCrit:{flag:"goldscale_token"},go:"south_goldscale2"},
  2364	    {t:"打听金秤家族对银月商会的看法",check:{a:"CHA",sk:"persu",label:"探口风"},tier:{
  2365	      ok:["老者听到'银月商会'四个字，脸上的笑容淡了一瞬，又恢复如常：'银月商会？生意做得大，账做得干净，是同行里的翘楚。'他顿了顿，补了一句：'只是翘楚得有些……过头了。'","'过头'二字，他咬得很轻。你听出了弦外之音。"],
  2366	      fail:["老者滴水不漏：'同行之间，不便评价。'你碰了个软钉子。"],
  2367	      crit:["老者压低声音：'年轻人，我多嘴一句：银月商会的生意，有一半，金秤家族看不透。'他竖起手指：'看不透的生意，要么是天才的手笔，要么是别的什么。'","他不再多言，但那个'别的什么'，已经在你心里扎了根。"]
  2368	    },effects:{},onCrit:{flag:"goldscale_doubt"},go:"south_goldscale2"}
  2369	  ]
  2370	};
  2371	N["south_goldscale2"] = {
  2372	  place:"黄金城 · 交易所", where:"午后",
  2373	  text:[
  2374	    "交易所是黄金城的心脏。报价板上的数字跳动着，像无数只无形的手在翻弄命运的牌。",
  2375	    "你站在人群边缘，看见一个穿黑袍的身影从贵宾通道走出，身后跟着四个随从。那人身形瘦削，手指修长，像一柄保养极好的算盘。",
  2376	    "一个交易员在你身边低声说：'那位？银月商会的总账房，玛门先生。'他咂咂嘴：'整个南方的钱，有一半在他手里过。'",
  2377	    "玛门走到门口，忽然停住，回头——他的目光扫过人群，在你身上停了一瞬。",
  2378	    "那目光很平静，像一杆秤在称一件不起眼的货物。",
  2379	    "然后他收回目光，上车离去。",
  2380	    "你站在原地，后颈的汗毛竖着。"
  2381	  ],
  2382	  options:[
  2383	    {t:"追上去，盯住玛门的去向",check:{a:"AGI",sk:"stealth",label:"跟踪"},tier:{
  2384	      ok:["你混进人群，远远缀着玛门的马车。马车没有去银月商会，而是拐进了一条僻静的巷子，停在一栋不起眼的宅院前。","你记下位置。那宅院的门楣上，没有挂任何商号的牌子，但门口的石狮子，眼睛是黑色的。"],
  2385	      fail:["你刚跟出两条街，就被玛门的随从发现。一个壮汉拦在你面前，客气地笑：'这位客人，玛门先生不喜欢被跟着。'你只得作罢。"],
  2386	      crit:["你跟踪的技巧炉火纯青。你看见玛门进了宅院，一刻钟后，另一个穿着黑袍的人从后门离开——那人身形矮小，脚步却极稳，像久经训练。你隐约看见，那人袍下露出一角卷轴，卷轴上画着七道细纹。"],
  2387	      critfail:["你跟得太近，在巷口与玛门的马车擦肩而过。车帘被风掀起一角——你看见玛门坐在车里，正低头看一张地图。他抬起头，目光正正地撞上你的眼睛。","车帘落下。马车驶过。你站在原地，心跳如鼓。你确定，他看见你了。"]
  2388	    },effects:{},onCrit:{flag:"mammon_house"},onCritFail:{flag:"mammon_noticed"},go:"south_moxie_go"},
  2389	    {t:"不跟。先记下这张脸，日后再说",effects:{},tier:{ok:["你把那张瘦削的脸刻进记忆。玛门。银月商会的总账房。南方一半金钱的过手人。","总有一天，你会再见到他。"]},go:"south_moxie_go"}
  2390	  ]
  2391	};
  2392	N["south_moxie_go"] = {
  2393	  place:"黄金城 · 城东", where:"傍晚",
  2394	  text:[
  2395	    "傍晚时分，你在城东的酒馆落脚。你把这些天的线索理了理：",
  2396	    "银月商会、暗蚀会、十三箱'活物'、节点四、玛门、七纹竖瞳。",
  2397	    "线头很多，但都指向同一个方向：死亡沙漠，七号封印。",
  2398	    "酒馆的墙上贴着一张通缉令：'悬赏：追查铁门关失守真相者，赏百金。北方公国联盟。'",
  2399	    "另一张告示写着：'魔械城飞空艇，新增航线：黄金城—魔械城。十金。'",
  2400	    "你摸了摸钱袋。是时候决定下一站了。"
  2401	  ],
  2402	  options:[
  2403	    {t:"去魔械城，看看飞空艇与炼金工坊",run:function(){ travelTo("south_moxie"); }},
  2404	    {t:"去学术城，看看净化令的风向",run:function(){ travelTo("south_xueshu"); }},
  2405	    {t:"先去商栈城淘点材料",run:function(){ travelTo("south_shangzhan"); }},
  2406	    {t:"在黄金城再接点活",go:"board_south"}
  2407	  ]
  2408	};
  2409	/* 魔械城 */
  2410	N["moxie_guild"] = {
  2411	  place:"魔械城 · 发明家协会", where:"白昼",
  2412	  text:[
  2413	    "发明家协会的大厅像一间巨大的工坊：齿轮、杠杆、符文板、烧瓶，堆得到处都是。空气里弥漫着机油与硫磺的气味。",
  2414	    "一个穿着皮围裙的矮胖匠人接待了你，他自称老巴，是协会的'总管'：",
  2415	    "“冒险者？好！协会正缺人手——不，缺'测试员'。”他眼睛发亮，“我们新造的'符文连弩'，需要人拿去实战测试。报酬好说。”",
  2416	    "他压低声音：“还有桩更来钱的：魔械城往南的航线，最近总有船失踪。飞空艇需要护卫。你敢不敢上？”"
  2417	  ],
  2418	  options:[
  2419	    {t:"接下'测试符文连弩'的活",check:{a:"STR",sk:"martial",label:"测试"},tier:{
  2420	      ok:["你带着符文连弩去城外的靶场试射。第一发，后坐力震得你虎口发麻；第十发，你已经能指哪打哪。老巴看了直点头：'好！就是你了！'他送了你一具连弩：'留着用。坏了拿回来修。'" ],
  2421	      fail:["你第一次用符文武器，差点炸膛。老巴吓得脸都白了：'哎哟我的天，你小心点！'他没收了连弩，改让你去帮忙搬器材。"],
  2422	      crit:["你不但学会了连弩，还发现了它一个设计缺陷——上弦的齿轮在连射时会卡。老巴又惊又喜：'居然有人能看出这个！'他连夜改进，多送了你三匣箭矢：'下次来，给你看改进版！'"]
  2423	    },effects:{gold:15,xp:25},onCrit:{item:"符文连弩"},go:"moxie_airship"},
  2424	    {t:"接下飞空艇护卫的活",check:{a:"SPR",sk:"will",label:"护航",note:"高空+灵界"},tier:{
  2425	      ok:["飞空艇升空的那一刻，你攥紧了扶手。脚下的大地铺展开来，河流像银线，山峦像褶皱。风灌进耳朵，冰冷而浩大。","航程中，你确实遇到了异常：一团不该出现在航线上的黑雾，贴着气囊飘过。你握紧武器，那黑雾盘旋片刻，缓缓散去。","降落后，艇长塞给你赏金：'有你在，我们踏实。'" ],
  2426	      fail:["你第一次上天，吐了个天昏地暗。艇长看着你苍白的脸，无奈地摇头：'护卫没当成，倒先成病号了。'他把你安排在货舱休息，赏金减半。"],
  2427	      crit:["你在黑雾出现时，没有退缩，反而迎上去查看。雾中，你隐约看见一张模糊的脸——像人，又不完全像人。它看见你，忽然散开。","你把这个细节告诉艇长。他脸色一变：'这是第三次了。每次都在这条航线上。'","你默默记下：这条航线，连接着魔械城与南方诸港。黑雾在这里出现，不是偶然。"]
  2428	    },effects:{gold:25,xp:30,rep:2},onCrit:{flag:"moxie_fog"},go:"moxie_airship"}
  2429	  ]
  2430	};
  2431	N["moxie_airship"] = {
  2432	  place:"魔械城 · 飞空艇码头", where:"白昼",
  2433	  text:[
  2434	    "你在飞空艇码头转了转，问清了航线：往南到港口城，往北到艾尔达城，往西到圣城。票价不菲，但胜在快。",
  2435	    "码头的告示板上贴着一则启事：'招募熟练工匠，参与新型飞空艇'魔械之翼'的建造。报酬丰厚，需签保密协议。'",
  2436	    "你正看着，一个穿蓝袍的工程师走过来，上下打量你：",
  2437	    "“懂机械吗？懂炼金？懂符文？”",
  2438	    "你（根据自己的职业）答了。他点点头：",
  2439	    "“好，跟我来。工坊正缺一个能看穿图纸的人。”"
  2440	  ],
  2441	  options:[
  2442	    {t:"去工坊看看，能不能学点手艺/淘点材料",check:{a:"INT",sk:"alchemy",label:"观摩"},tier:{
  2443	      ok:["你在工坊待了一下午，看工程师们装配齿轮、熔铸符文板。你搭了把手，也顺手收了几块边角料——成色不错的符文铁，和一小瓶催化剂。"],
  2444	      fail:["工坊的规矩严，你只能在外围看着。不过你还是学到了一点机械原理。"],
  2445	      crit:["你不但看懂了图纸，还指出了引擎一处冷却回路的设计问题。工程师们围过来，七嘴八舌地讨论后，采纳了你的意见。","工头拍着你的肩膀：'人才！以后魔械城的工坊，对你敞开大门。'他送了你一件小礼物：一枚符文扳手。"]
  2446	    },effects:{xp:25},onCrit:{item:"符文扳手"},onOk:{mat:function(){const j=JOBS[S.job];return j.mats[1];}},go:"south_after_moxie"},
  2447	    {t:"先不掺和，去打探黑雾的事",check:{a:"INT",sk:"detect",label:"查访"},tier:{
  2448	      ok:["你多方打听，得知黑雾最早出现在两个月前，恰好是银月商会包下固定航线之后。老码工们都说：'那雾，是跟着银月商会的船来的。'"],
  2449	      fail:["码工们三缄其口：'黑雾？没看见过。你别瞎打听。'"],
  2450	      crit:["你找到一个退休的老观测员。他告诉你：'那条航线上，黑雾出现的位置，每次都在同一个坐标。'他报出一个数字，你记下。'那个坐标正下方，是古代艾尔达文明的一处废墟。'"]
  2451	    },effects:{},onCrit:{flag:"fog_coord"},go:"south_after_moxie"}
  2452	  ]
  2453	};
  2454	N["south_after_moxie"] = {
  2455	  place:"魔械城", text:["你在魔械城待了几日，见识了齿轮与蒸汽的奇迹，也见识了这片繁荣之下的暗流。","临行前，你在码头遇到一个老工程师，他看着远去的飞空艇，忽然说：'年轻人，飞得再高，脚也要踩在地上。'他指了指大地：'有些东西，从地底来。你得小心。'","你谢过他。背上的行囊里，多了一份见识。",],
  2456	  options:[
  2457	    {t:"去学术城看看",run:function(){ travelTo("south_xueshu"); }},
  2458	    {t:"回黄金城继续追查银月商会",run:function(){ travelTo("south_huangjin"); }},
  2459	    {t:"在魔械城接点活",go:"board_south"}
  2460	  ]
  2461	};
  2462	/* 学术城 */
  2463	N["xueshu_mill"] = {
  2464	  place:"学术城 · 城东老磨坊", where:"夜",
  2465	  text:[
  2466	    "老磨坊已经废弃多年，风车残破，门板半掩。你推开门，听见里面传来压低的讨价还价声。",
  2467	    "一个蒙面人提着油灯，面前摆着一摞书。他看见你，警惕地打量：",
  2468	    "“买书的？还是探子？”",
  2469	    "“规矩：只收现金，不问来路，出了这门，就当没见过。”"
  2470	  ],
  2471	  options:[
  2472	    {t:"看看有没有合用的典籍",check:{a:"INT",sk:"bargain",label:"淘书"},tier:{
  2473	      ok:["你在那摞书里翻到一本合用的典籍。蒙面人要价不低，但你砍了砍价，成交。他把书用旧布裹好，塞给你：'收好。这年头，书比命值钱。'" ],
  2474	      fail:["那摞书里没有你需要的。你空手而归。"],
  2475	      crit:["你不但淘到了书，还在书页夹层里发现一张纸条——是上一任读者留下的：'圣城烛台书店，有'那方面'的书。'你默默记下。"],
  2476	      critfail:["你正挑书，门外忽然传来急促的脚步声。蒙面人脸色一变：'圣痕司！'他吹灭油灯，众人作鸟兽散。你从后窗翻出去，跑了半条街才甩掉追兵。"]
  2477	    },effects:{gold:-12},onOk:{book:function(){const j=JOBS[S.job];return j.books[1]?j.books[1][1]:null;}},onCrit:{flag:"candle_hint"},go:"xueshu_after"},
  2478	    {t:"问蒙面人：最近有没有'特别的货'",check:{a:"CHA",sk:"persu",label:"试探"},tier:{
  2479	      ok:["蒙面人沉默片刻：'特别的东西？有。'他压低声音：'有人要收'活物'，价高得离谱。'他比划了一下：'要会'走路的'那种。'","你心头一跳：'谁收？''不知道。中间人接的。'他顿了顿：'不过，收货的船，挂白旗，走夜航。'" ],
  2480	      fail:["蒙面人警惕地看着你：'打听这些做什么？你是圣痕司的？'你连忙否认，但已经问不出更多了。"],
  2481	      crit:["蒙面人告诉你一个细节：'收货的人，每次都给现金，成色是南方旧金币，上面刻着金秤的印记。'他咂咂嘴：'用金秤的旧币收货，却挂银月的旗。你说，这算哪门子生意？'"]
  2482	    },effects:{},onCrit:{flag:"coin_clue"},go:"xueshu_after"}
  2483	  ]
  2484	};
  2485	N["xueshu_bookshop"] = {
  2486	  place:"学术城 · 书店", text:["白天的书店安静而安全。掌柜的姓柳，是个和气的中年人。你在他店里淘了几本杂书，顺便聊了聊学术城的近况。","'净化令下来后，城里走了三分之一的书商。'柳掌柜叹气：'留下的，都在往地窖里藏书。'他压低声音：'不过，也有些人，越查越来劲——城北有家'真理学社'，专研究'禁书'。你要是胆子大，可以去看看。'"],options:[
  2487	    {t:"去真理学社看看",go:"xueshu_truth"},
  2488	    {t:"在书店里读读书，长点见识",check:{a:"INT",sk:"lore",label:"阅读"},tier:{ok:["你读了一下午杂书，虽无大用，但眼界开阔了不少。柳掌柜给你续了杯茶：'多读点，乱世里，脑子比拳头值钱。'"],crit:["你在一本旧地理志里，读到一段关于死亡沙漠的记载：'沙漠深处，有古文明废墟。其下七里，封印深渊。'书页边，有人用铅笔批注：'封印已失守。勿往。'"]},effects:{xp:15},onCrit:{flag:"desert_note"},go:"xueshu_after"}
  2489	  ]
  2490	};
  2491	N["xueshu_truth"] = {
  2492	  place:"学术城 · 真理学社", where:"黄昏",
  2493	  text:[
  2494	    "真理学社藏在一栋旧宅里，门脸不起眼，推门进去却别有洞天：满墙的书，满桌的卷轴，几个年轻人正围着一幅地图争论。",
  2495	    "一个戴圆眼镜的青年迎上来：'新朋友？欢迎。我们专研究'不该研究的'——净化令收缴的那些书。'他压低声音：'你要是带了好书来，我们可以换着看。'",
  2496	    "你注意到，墙角挂着一幅地图，上面标注着几个点——与你从黑袍人那里得到的情报，隐隐吻合。"
  2497	  ],
  2498	  options:[
  2499	    {t:"加入讨论，交换情报",check:{a:"INT",sk:"lore",label:"交流"},tier:{
  2500	      ok:["你把'节点'的线索抛了出来。青年们眼睛一亮：'你也发现了？'他们告诉你：根据古籍记载，大陆上有七处封印节点，对应深渊的七个出口。'第三节点在铁门关方向，第四节点……'他压低声音：'据说在南方某座古城的废墟下。'"],
  2501	      fail:["你话太少，青年们聊着聊着就把你晾在一边。不过你还是从他们的争论里，听到了'节点'二字。"],
  2502	      crit:["你不但交换了情报，还从他们的旧档里找到一份残缺的地图：七个节点，六个已标注，第七个，画着一只竖瞳。'这份地图，是我们从一位老学者手里收的。'青年说：'他说，第七节点，在死亡沙漠深处。'"]
  2503	    },effects:{xp:25},onCrit:{flag:"truth_map"},go:"xueshu_after"}
  2504	  ]
  2505	};
  2506	N["xueshu_after"] = {
  2507	  place:"学术城", text:["你在学术城盘桓几日，感受了思想与铁腕的拉锯。这里的空气中，飘着油墨与火药的味道。","临行前，柳掌柜送你到门口，忽然说：'年轻人，学术城教会你一件事：这世上最危险的书，不是写出来的，是烧不掉的。'","你谢过他，背起行囊。下一站，在等你。"],
  2508	  options:[
  2509	    {t:"去商栈城淘点材料",run:function(){ travelTo("south_shangzhan"); }},
  2510	    {t:"去港口城看看失踪船的事",run:function(){ travelTo("south_gangkou"); }},
  2511	    {t:"回黄金城继续追查",run:function(){ travelTo("south_huangjin"); }},
  2512	    {t:"接点活",go:"board_south"}
  2513	  ]
  2514	};
  2515	/* 商栈城 */
  2516	N["shangzhan_knife"] = {
  2517	  place:"商栈城 · 黑市摊位", text:["你掀开布角，拿起那柄短刃。刃口泛着暗红的光，像是淬过什么不寻常的东西。","摊主压低声音：'北边来的，见过血。正经货，来路'不太正经'，但好用。'他报了个价，不低。"],options:[
  2518	    {t:"买下它",check:{a:"INT",sk:"bargain",label:"验货"},tier:{ok:["你仔细验了验：钢口好，淬火手法不寻常。你付了钱，把短刃收好。","摊主又多嘴了一句：'客官，这刀上的血，不是人血。也不是兽血。'他咂咂嘴：'你说，不是人血不是兽血，能是什么血？'"],crit:["你验货时发现，刀柄的缠绳下刻着一行小字：'节点三，备用。'你心头一凛，面上不动声色地付了钱。","摊主浑然不觉。你走出几步，回头看了一眼——他正低头数钱，数得很仔细。"]},effects:{gold:-20},onCrit:{item:"暗红短刃",flag:"knife_note"},go:"shangzhan_after"},
  2519	    {t:"不买。问摊主：这刀从哪来的",check:{a:"CHA",sk:"persu",label:"盘问"},tier:{ok:["摊主警觉地看你一眼：'客官，做买卖不问来路。'但架不住你追问，他含糊道：'一个'南方来的'供货人，说是'沙漠边捡的'。'他摆摆手：'别问了，再问就不卖了。'"],crit:["摊主压低声音：'跟你实说吧——这批货，是从一支'失踪的商队'身上扒下来的。那商队，运的是银月商会的货。'他打了个寒颤：'整队人，死在一个绿洲边上，身上没伤，脸都是吓白的。'"]},effects:{},onCrit:{flag:"oasis_death"},go:"shangzhan_after"}
  2520	  ]
  2521	};
  2522	N["shangzhan_market"] = {
  2523	  place:"商栈城 · 集市", text:["你在集市里逛了一下午，眼花缭乱。香料、丝绸、药材、矿物，应有尽有。你在一家矿石摊前停下，摊主是个晒得黝黑的老头，面前摆着几块成色不错的矿石。"],options:[
  2524	    {t:"挑几块合用的材料",check:{a:"INT",sk:"bargain",label:"挑选"},tier:{ok:["你挑了两块成色不错的矿石，又配了些药材。老头收钱时，压低声音说：'客官，这几块料子，是我从死亡沙漠边缘捡的。'他顿了顿：'那个方向的东西，多少沾点'怪气'。你用的时候，当心点。'"],crit:["你在一堆矿石里，挑出一块不起眼的灰石——切开，里面裹着一粒晶莹的结晶，正合你职业所需。老头懊恼地拍大腿：'哎哟，看走眼了！'他愿赌服输，没收你加价。"]},effects:{gold:-15},onOk:{mat:function(){const j=JOBS[S.job];return j.mats[1];}},onCrit:{mat:function(){const j=JOBS[S.job];return j.mats[2];}},go:"shangzhan_after"}
  2525	  ]
  2526	};
  2527	N["shangzhan_after"] = {
  2528	  place:"商栈城", text:["商栈城的夜色，比白昼更热闹。灯红酒绿之下，什么都可以买，什么都可以卖。","你站在客栈的窗前，望着楼下的灯火。这座城没有秘密——所有秘密，都明码标价。","你摸了摸行囊里的收获。下一站，该去港口城，看看那些空船。"],
  2529	  options:[
  2530	    {t:"去港口城",run:function(){ travelTo("south_gangkou"); }},
  2531	    {t:"在商栈城接点活",go:"board_south"}
  2532	  ]
  2533	};
  2534	/* 港口城 */
  2535	N["gangkou_ships"] = {
  2536	  place:"港口城 · 港务局", text:["老港务官把你领进档案室，翻出一摞泛黄的记录：'近三个月，失踪的船有五条：白帆号、青鲤号、黑珍珠号……'他指着记录：'共同点：都在同一条航线失踪，都在半月后自己飘回来，船上空无一人。'","'船上的货，一样没少。人，全没了。'他压低声音：'最邪门的是——每条船船头，都刻着同一个记号。'他画给你看：一个圈，圈里一只竖瞳。"],options:[
  2537	    {t:"去泊位看看其中一条空船",check:{a:"INT",sk:"detect",label:"勘查"},tier:{ok:["你在泊位找到青鲤号。船上确实空无一人，货物完好。你检查船舱，在隔板夹层里发现几缕干涸的黑渍——像是某种液体，干透后留下的。你用指甲刮了一点，凑近闻——没有味道，但你的太阳穴突突地跳。","你退开几步，把那点黑渍用布包好收进怀里。"],crit:["你检查得更细，在船尾的排水孔里，摸到一枚卡住的东西：一枚乌黑的铁牌，与七纹竖瞳一致。铁牌边缘有磨损，像是从谁身上拽下来的。","你收好铁牌。这条线，和铁门关、自由城邦、银月商会，全都连上了。"]},effects:{xp:20},onCrit:{item:"乌黑铁牌（第三枚）"},go:"gangkou_after"},
  2538	    {t:"找码头的地头蛇打听内幕",check:{a:"CHA",sk:"persu",label:"打听"},tier:{ok:["你花了几枚银币，从地头蛇嘴里撬出话来：'那些船，都是往南走的。'他压低声音：'南边，沙漠那边，有人'收货'。'他咂咂嘴：'收的不是货，是人。'","'整船整船的人，往南送。送进去的，没一个回来的。'"],crit:["地头蛇告诉你更多：'有个老水手，从那趟'死亡航线'活着回来过。他在港口城的贫民窟里，天天做噩梦，嘴里念叨：'沙子底下，有门。门后面，有人说话。'","你默默记下这个地址。"]},effects:{gold:-5},onCrit:{flag:"sailor_alive"},go:"gangkou_after"}
  2539	  ]
  2540	};
  2541	N["gangkou_berth"] = {
  2542	  place:"港口城 · 码头", text:["你在码头转了一圈，打听往各处的船。往北的船有，往东的船有，往西的也有——唯独往南的，没人愿意接。","一个老船工告诉你：'往南？那是死亡航线。给再多的钱，也没人敢跑。'他顿了顿：'不过，你要是真有非去不可的理由——城南有个疯水手，姓韩，他说他敢跑。'","'就是不知道他是真疯，还是假疯。'"],options:[
  2543	    {t:"去找那个姓韩的疯水手",go:"gangkou_han"},
  2544	    {t:"算了，先办别的",go:"gangkou_after"}
  2545	  ]
  2546	};
  2547	N["gangkou_han"] = {
  2548	  place:"港口城 · 贫民窟", text:["你在贫民窟的角落找到韩水手。他蹲在墙角，面前放着一只缺口的碗，眼睛直勾勾地望着海的方向。","你蹲下来：'听说你敢跑南边的航线？'","他缓缓转过头，浑浊的眼睛里忽然有了光：'你也……听见了？'他压低声音：'沙子底下，有门。门后面，有人说话。'","'我一直想回去，看看那门后面是什么。'他咧嘴一笑，露出焦黄的牙：'你敢跟我去吗？'"],options:[
  2549	    {t:"记下这个人和他的话，日后再说",effects:{},tier:{ok:["你把韩水手的话记在心里。他望着海，不再看你。","'门后面有人说话。'这句话，你听过的次数，越来越多了。"]},go:"gangkou_after"},
  2550	    {t:"现在就跟他约好，日后同去死亡沙漠",check:{a:"CHA",sk:"persu",label:"约定"},tier:{ok:["韩水手盯着你看了很久，忽然笑了：'好，好！'他从怀里摸出一块磨得发亮的贝壳，塞给你：'拿着。到了沙漠边缘的绿洲，把它挂在旗杆上，我就能找到你。'","你收好贝壳。死亡沙漠的路，多了一个向导。"]},effects:{item:"磨亮的贝壳"},go:"gangkou_after"}
  2551	  ]
  2552	};
  2553	N["gangkou_after"] = {
  2554	  place:"港口城", text:["你在港口城盘桓了几日，看了潮起潮落，也看了空船归来。","海风咸腥，吹着你的衣角。你望着南方天际线，那里，黄沙与海雾相接的地方，是你此行的方向之一。","但在此之前，你还有别的地方要去。"]
  2555	  ,options:[
  2556	    {t:"回黄金城，把银月商会的线再挖深一层",run:function(){ travelTo("south_huangjin"); }},
  2557	    {t:"在港口城接点活",go:"board_south"}
  2558	  ]
  2559	};
  2560	/* 南方委托板 */
  2561	const SOUTH_BOARD = [
  2562	  {t:"护送一批魔械零件到商栈城",check:{a:"STR",sk:"martial",label:"护送"},ok:["你护送着零件车，一路平安。收货的匠人验了货，满意地多给了赏钱。"],fail:["半路遇上一伙想截货的，你拼力打退，但零件摔坏了一件。货主扣了赏金。"],okEff:{gold:22,xp:25,rep:2},failEff:{gold:8,xp:10}},
  2563	  {t:"替金秤家族送一封信到学术城（走'不那么显眼的路'）",check:{a:"AGI",sk:"stealth",label:"送信"},ok:["你绕开大路，把信安全送到。收信的老教授多给了你一份赏钱：'谨慎的人，值得加钱。'"],fail:["你半路被圣痕司的关卡盘问，信差点被搜走。你交了点罚金才脱身。"],okEff:{gold:20,xp:22,rep:2},failEff:{gold:5,xp:8}},
  2564	  {t:"帮炼金工坊采集一批'月光草'",check:{a:"SPR",sk:"survive",label:"采集"},ok:["你在城外的湿地找到月光草，采了满满一篮。工坊主很高兴，送你一瓶催化剂。"],fail:["月光草长在泥沼深处，你陷了半条腿才爬出来，只采到一小把。"],okEff:{gold:12,xp:18,item:"催化剂"},failEff:{gold:4,xp:8}},
  2565	  {t:"替港口城的船主清点'白帆号'的货物",check:{a:"INT",sk:"detect",label:"清点"},ok:["你清点了整船的货，发现账实相符，但有一批'药材'的封装方式，不像是药材。你记下了这一点。"],fail:["你清点到一半，被港务官叫停：'这船有检疫令，闲人免近。'"],okEff:{gold:16,xp:20,flag:"cargo_note"},failEff:{gold:5,xp:8}},
  2566	  {t:"给学术城的真理学社送一箱'旧纸'",check:{a:"CHA",sk:"persu",label:"运送"},ok:["你避开圣痕司的耳目，把一箱旧书送到真理学社。圆眼镜青年感激不尽，送你一份他们整理的《节点考》。"],fail:["你被巡兵拦下盘问，只得绕了大半个城才送到。"],okEff:{gold:14,xp:25,rep:2,book:function(){const j=JOBS[S.job];return j.books[2]?j.books[2][0]:null;}},failEff:{gold:5,xp:10}},
  2567	  {t:"帮商栈城的矿石贩子鉴定一批'沙漠料'",check:{a:"INT",sk:"lore",label:"鉴定"},ok:["你仔细甄别，从一堆'沙漠料'里挑出几块成色好的，也认出两块'沾了怪气'的。矿贩子很满意：'行家！'多给了赏钱。"],fail:["你看走了眼，把一块普通石头当成了好料。矿贩子摇摇头。"],okEff:{gold:18,xp:25,rep:1,mat:function(){const j=JOBS[S.job];return j.mats[2];}},failEff:{gold:6,xp:10}}
  2568	];
  2569	N["board_south"] = function(){
  2570	  const picks = shuffle(SOUTH_BOARD).slice(0,3);
  2571	  return {
  2572	    place:"南方商业城邦联盟 · 冒险者公会委托板", where:"白昼",
  2573	    text:["南方联盟的委托板比北方多了一倍，活计也五花八门：护送、送信、鉴定、采集。你扫了一遍，挑了三个。"],
  2574	    options: picks.map(b=>({
  2575	      t:b.t, check:b.check, tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},
  2576	      effects:b.okEff, onFail:b.failEff, go:"board_south_done"
  2577	    })).concat([{t:"不接了，办正事要紧",go:"south_moxie_go"}])
  2578	  };
  2579	};
  2580	N["board_south_done"] = {
  2581	  place:"委托板", text:["南方联盟的活计，来钱快，水也深。你把赏金收好，掂了掂分量。",],
  2582	  options:[
  2583	    {t:"再接一单",go:"board_south"},
  2584	    {t:"继续赶路",run:function(){ togglePanel("map"); }}
  2585	  ]
  2586	};
  2587	/*==STORY_SOUTH==*/
  2588	/*==STORY_ELF==*/
  2589	/* ================================================================
  2590	   精灵王国
  2591	   ================================================================ */
  2592	N["arrive_elf_wangting"] = function(){
  2593	  const hasGuide = S.flags.ivy_meet || S.flags.oldwolf_met || S.flags.senlin_legend;
  2594	  return {
  2595	    place:"精灵王国 · 迷雾边界", where:"途中",
  2596	    text:[
  2597	      "精灵森林的边界，是一片常年不散的银白色迷雾。传说三百年前，精灵女王下令封国，迷雾便从此升起，把整个王国与世界隔开。",
  2598	      "迷雾边缘，立着一块石碑，用古老的精灵文刻着：",
  2599	      "“止步。非我族类，勿入此林。”",
  2600	      "石碑下，坐着两个披着叶纹斗篷的精灵守卫。他们的弓箭横在膝上，目光如冰。",
  2601	      "你远远停下。硬闯，是行不通的。",
  2602	      hasGuide ? "你想起了自由城邦那个半精灵（或老狼的引荐、森林城的传说）——也许，有一条路能通进这片迷雾。" : "你望着那片迷雾，一时没有头绪。"
  2603	    ],
  2604	    options:[
  2605	      {t:"尝试与精灵守卫交涉，说明来意",check:{a:"CHA",sk:"persu",label:"交涉",mods:{"非我族类":-10}},tier:{
  2606	        ok:["精灵守卫听完你的来意，沉默片刻。其中一个开口，声音像风穿过树叶：'外来者，精灵王国不欢迎外人。但——'他顿了顿，'你提到了世界树的变化。这倒是……值得一听。'","他让开半步：'进林可以，不得带武器，不得离开道路。违者，逐。'"],
  2607	        fail:["精灵守卫冷冷地看着你：'外来者，迷雾之外，才是你的世界。'他的弓稍稍抬起。你只得退后。"],
  2608	        crit:["你报出了（伊芙琳的名字/老狼的名号/森林城的银月术传说），精灵守卫的眼神变了。他低声与同伴交谈几句，然后看向你：'……半精灵的血，也曾经是这片森林的血。'他侧身让路：'进来吧。女王会想见你的。'"],
  2609	        critfail:["你的话触犯了精灵的忌讳。守卫的箭尖指向你，声音冷得像冰：'外来者，再往前一步，我们不保证你的性命。'你只得缓缓后退，退出十丈，那箭尖才放下。"]
  2610	      },onOk:{flag:"elf_entry"},go:"elf_first"},
  2611	      {t:"趁着迷雾翻涌的间隙，尝试潜入",check:{a:"AGI",sk:"stealth",label:"潜入",note:"高风险"},tier:{
  2612	        ok:["你趁着迷雾最浓的一刻，贴着树干滑进林中。精灵守卫的视野被雾遮挡，你像一片影子，无声地穿过他们的警戒线。","林中安静得可怕。每棵树都像在看你。"],
  2613	        fail:["你刚摸进雾里，就撞上了一道无形的结界，整个人被弹了出来，摔在石碑前。精灵守卫冷眼旁观：'迷雾会记住闯入者的气息。下次，就不会这么客气了。'"],
  2614	        crit:["你不但潜入了，还在林中发现一条兽道——那是鹿群踩出来的小径，通向森林深处。顺着兽道走，可以避开大部分精灵哨站。","你记下这条路。它或许，比正门更有用。"],
  2615	        critfail:["你在雾中迷失了方向，走了半个时辰，发现自己绕回了原地。更糟的是，一支精灵巡林队发现了你，你被'请'出了森林，后背还被刻下了一道警示的箭痕。"]
  2616	      },onOk:{flag:"elf_entry",infl:{elf:5}},onCrit:{flag:"elf_animalpath"},onCritFail:{hp:-8},go:"elf_first"},
  2617	      {t:"暂时不进去，在森林边缘扎营观察",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  2618	        ok:["你在边缘扎营三日，观察精灵守卫的换班规律与迷雾的涨落。你发现，每日子夜，迷雾会有一刻钟的'薄窗'——那时，林中的银光会透出来。","你默默记下这个规律。"],
  2619	        fail:["你扎营两日，什么也没观察出来。迷雾始终如一，守卫也始终如一。"],
  2620	        crit:["你观察得更细：每七日，会有几个披着深色斗篷的精灵从林深处出来，押着一辆盖着黑布的车，往南方去。你数了数，那车辙，与银月商会的货运车辙，一模一样。","精灵王国，也在与南方做生意。偷偷地。"]
  2621	      },onCrit:{flag:"elf_smuggling"},go:"elf_first"}
  2622	    ]
  2623	  };
  2624	};
  2625	N["elf_first"] = {
  2626	  place:"精灵王国 · 林中大道", where:"白昼",
  2627	  text:[
  2628	    "穿过迷雾，精灵王国的真容在你眼前展开。",
  2629	    "这里的树，高得遮天蔽日。枝叶间漏下的光，是银绿色的。空气里有潮湿的草木香，和一种极淡的、古老的气息。",
  2630	    "道路是青石铺的，长着青苔，却干净得没有一片落叶。每隔百步，路边立着一盏石灯，灯芯燃着银色的火焰。",
  2631	    "你沿着大道走了半日，看见了一座城。",
  2632	    "不，是看见了一棵树。",
  2633	    "一棵巨大的、银白色的树，树冠撑开如穹顶，枝叶间垂着无数灯火。树根盘曲如龙，深深地扎进大地。",
  2634	    "那是世界树。精灵王国的中心。",
  2635	    "树下，是一座银色的王庭。"
  2636	  ],
  2637	  options:[
  2638	    {t:"走向王庭，求见精灵女王",go:"elf_court"},
  2639	    {t:"先混进精灵集市，听听风声",check:{a:"CHA",sk:"persu",label:"融入"},tier:{
  2640	      ok:["精灵集市安静而有序。你混在人群里，听他们交谈：'世界树的叶子，最近黄了几片。''长老会说，是地下的水出了问题。''女王已经三天没出王庭了。'","你默默记下这些低语。"],
  2641	      fail:["精灵们对你这个外来者保持着礼貌的疏离。你听不到什么实质消息。"],
  2642	      crit:["你从一个年迈的精灵园丁口中套出关键一句：'地下的水，变味了。'他压低声音：'老树根伸到的地方，据说有什么东西在'渗'。'他打了个寒颤：'长老们瞒着这事。'"]
  2643	    },onCrit:{flag:"worldtree_sick"},go:"elf_court"}
  2644	  ]
  2645	};
  2646	N["elf_court"] = {
  2647	  place:"精灵王庭 · 世界树下", where:"白昼",
  2648	  text:[
  2649	    "精灵王庭没有城墙，只有一圈圈盘旋的银树。你在引路精灵的带领下，穿过层层树廊，来到世界树下的殿堂。",
  2650	    "殿堂是露天的。银色的枝叶织成穹顶，垂下的气根如帘。精灵女王端坐在树根盘成的王座上，身披月白色的长袍，面容看不出年纪。",
  2651	    "她的眼睛是淡金色的，像两枚沉睡的琥珀。她看着你，开口，声音像泉水：",
  2652	    "“外来者。三百年了，你是少数被允许走到这里的人类。”",
  2653	    "“说出你的来意。”",
  2654	    "你注意到，她虽然端坐如常，但王座旁的侍女，正悄悄用银叶擦拭她袖口的一处暗渍——像是树液，又不太像。"
  2655	  ],
  2656	  options:[
  2657	    {t:"如实说明：你追查深渊线索，听说世界树有异",check:{a:"CHA",sk:"persu",label:"陈情"},tier:{
  2658	      ok:["女王沉默片刻，缓缓开口：'你倒诚实。'她抬起手，侍女们退下。殿堂里只剩下你们两人（与树影）。'三百年了，深渊一直想从树根下爬进来。'她看着你：'最近，它快成功了。'","她指尖轻点，王座旁的石台上，浮现出一幅光图：世界树的根系，深入地下七里，与一座古老封印相连。'那是第七节点的一部分。封印松动，树的根须，最先感觉到。'"],
  2659	      fail:["女王静静听完，不置可否：'外来者，深渊的线索，不该由一个人类来追查。'她挥手示意引路精灵送你出去。"],
  2660	      crit:["你不但陈述了来意，还提到了自由城邦下水道的仪式阵与铁门关的黑烟。女王的眼神终于动了：'……铁门关。'她低声道：'三年前，我的探子回报，东军帐中有'黑烟'。我以为是兽人的萨满术。'她看向你：'看来，我低估了这件事。'","她赠你一枚银叶：'持此叶，精灵的哨站不会拦你。'"]
  2661	    },onCrit:{flag:"queen_ally",item:"精灵银叶"},go:"elf_root"},
  2662	    {t:"试探地问：精灵王国为何与南方秘密通商",check:{a:"CHA",sk:"persu",label:"试探"},tier:{
  2663	      ok:["女王的眼皮微动。她平静地说：'精灵需要铁，南方需要木。通商，是生存之道。'她顿了顿：'至于你说'秘密'——精灵的事，从不需向外人解释。'","你碰了个软钉子，但她的反应，印证了你的猜测。"],
  2664	      fail:["女王淡声道：'外来者，你问得太多了。'气氛骤然变冷。"],
  2665	      crit:["你提到'盖黑布的车、往南方去'。女王沉默了很久，缓缓说：'……那是长老会的安排。我以为，只是木材生意。'她垂下眼帘：'看来，长老会有些事，瞒着我。'","你意识到，精灵王国内部，并非铁板一块。"]
  2666	    },onCrit:{flag:"queen_doubt"},go:"elf_root"}
  2667	  ]
  2668	};
  2669	N["elf_root"] = {
  2670	  place:"精灵王国 · 世界树根脉", where:"地底",
  2671	  text:[
  2672	    "女王（或长老会）允许你下到世界树的根脉区域。",
  2673	    "沿着螺旋的树梯下行，空气越来越潮湿，越来越冷。根须在头顶交错如巨蟒，银色的光点在其中游动，像无数只眼睛。",
  2674	    "下到最深处，你看见了一处巨大的洞穴。世界树的主根在此扎入岩层，根皮上，有一道道黑色的裂纹，像血管一样蔓延。",
  2675	    "裂纹里，渗出一种暗色的液体，缓慢地、一滴滴地，落进下方的地底暗河。",
  2676	    "你俯身细看。那液体，与你从港口城空船上刮下的黑渍，气味一模一样。",
  2677	    "风从暗河的方向吹来，带着一丝若有若无的低语。"
  2678	  ],
  2679	  options:[
  2680	    {t:"仔细检查树根裂纹，采集样本",check:{a:"INT",sk:"lore",label:"检查"},tier:{
  2681	      ok:["你小心地刮下一点黑色液体，装进陶瓶。又检查了裂纹的走向：它们从地底深处蔓延上来，像是被'泡'出来的。","你在地底暗河边的岩壁上，发现一行古老的精灵文，翻译过来是：'封印之下，勿掘。'"],
  2682	      fail:["裂纹太深，你够不到。只得作罢。"],
  2683	      crit:["你顺着裂纹的源头，在暗河下游的岩缝里，发现了一枚嵌在石中的乌黑铁牌——七纹竖瞳。铁牌周围，岩石发黑，像被灼烧过。","精灵的封印，被'锚'住了。有人用铁牌，在树根下钉了一颗'钉子'。"]
  2684	    },effects:{xp:25},onCrit:{item:"乌黑铁牌（第四枚）",flag:"elf_anchor"},onOk:{flag:"worldtree_sample"},go:"elf_after"},
  2685	    {t:"沿着暗河向下游探查",check:{a:"SPR",sk:"will",label:"探查",note:"深渊气息"},tier:{
  2686	      ok:["你沿着暗河走了半个时辰，越走越冷。河道两壁，黑色的裂纹越来越密集。最后，你在一处塌方前停下——塌方下，隐约可见一段石砌的拱门，门楣上刻着古老的符文。","那是封印的一部分。塌方，像是被'从里面'推开的。"],
  2687	      fail:["暗河的水忽然变得刺骨。你走了一刻钟，头痛欲裂，只得折返。那低语声，在你身后追了很久。"],
  2688	      crit:["你在塌方前蹲下，拨开碎石，看见拱门内侧刻着一行字，不是精灵文，是古代艾尔达文：'第七封印。守望者立。勿启。'","'守望者。'你想起某些传说。这个名字，与深渊守门人奥雷利安·晨曦有关。"],
  2689	      critfail:["你走到暗河深处，那低语声忽然放大，在你耳边轰然炸响。你眼前一黑，恍惚看见一片黄沙，沙下埋着一座漆黑的神殿。殿门洞开。","你猛地惊醒，发现自己跪在河边，双手掐着泥土。耳边的低语，渐渐远去。你跌跌撞撞地折返，后背全是冷汗。"]
  2690	    },effects:{xp:20},onCrit:{flag:"seal_arch"},onCritFail:{san:-8},go:"elf_after"}
  2691	  ]
  2692	};
  2693	N["elf_after"] = {
  2694	  place:"精灵王国 · 王庭", text:[
  2695	    "你回到王庭，把所见所闻（以及那枚铁牌）呈给女王（或长老会）。",
  2696	    "女王看着那枚铁牌，良久无言。最终，她开口：",
  2697	    "“三百年的闭关，没能挡住深渊。它不走门，走树根。”",
  2698	    "她看着你：'外来者，你帮精灵王国看清了一件我们不愿看清的事。'她顿了顿：'世界树的病，我会处理。但你既然要追这条线——'",
  2699	    "她示意侍女取来一卷古老的羊皮：'这是古代守望者留下的记录。里面提到，七处封印，同气连枝。若你要去死亡沙漠，这卷记录，或许有用。'",
  2700	    "你把羊皮卷收好。临别时，女王最后说了一句：",
  2701	    "“深渊最可怕的，不是它的力量。是它总能找到，你最信任的东西来当门。”"
  2702	  ],options:[
  2703	    {t:"谢过女王，离开精灵王国",effects:{item:"守望者羊皮卷",rep:8,infl:{elf:10}},tier:{ok:["你带着羊皮卷，穿过迷雾，回到尘世。身后的精灵森林，依旧被银雾笼罩，像什么都没发生过。","但你知道，那片森林的地下，有一道正在流血的伤口。"]},go:"elf_done"},
  2704	    {t:"在精灵王国再盘桓几日",go:"board_elf"}
  2705	  ]
  2706	};
  2707	N["elf_done"] = {
  2708	  place:"精灵王国边界", text:["你站在迷雾边界外，回望那片银白色的森林。","世界树在暮色里泛着微光，像一盏不肯熄灭的灯。","你摸了摸怀里的羊皮卷与铁牌。下一个方向，你已经有了眉目。"],
  2709	  options:[
  2710	    {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }},
  2711	    {t:"在精灵边境接点活",go:"board_elf"}
  2712	  ]
  2713	};
  2714	const ELF_BOARD = [
  2715	  {t:"替森林城（北方）的猎户送信给精灵边境的巡林人",check:{a:"CHA",sk:"persu",label:"送信"},ok:["巡林人收了信，看了你一眼：'人类的信，能送到这里，不容易。'他给了你赏钱，又送了你一枚木哨：'林子里迷路，吹它。'"],fail:["巡林人拒收人类捎来的信：'边境规矩。'你只得原路返回。"],okEff:{gold:12,xp:20,item:"木哨"},failEff:{gold:4,xp:8}},
  2716	  {t:"替精灵采药人采集'月露草'",check:{a:"SPR",sk:"survive",label:"采集"},ok:["月露草长在晨雾里，你采了半篮。采药人点点头：'手脚利落。'多给了赏钱。"],fail:["月露草开在悬崖边，你够不着。"],okEff:{gold:14,xp:18},failEff:{gold:4,xp:8}},
  2717	  {t:"护送一位老学者到迷雾边缘",check:{a:"STR",sk:"athletic",label:"护送"},ok:["老学者腿脚慢，你一路照料。分别时，他送你一本笔记：《精灵史略》。"],fail:["路途泥泞，你们多走了半日。"],okEff:{gold:10,xp:15,item:"《精灵史略》"},failEff:{gold:4,xp:8}}
  2718	];
  2719	N["board_elf"] = function(){
  2720	  const picks = shuffle(ELF_BOARD).slice(0,2);
  2721	  return {place:"精灵边境 · 委托板",text:["精灵边境的活计不多，但都干净。"],options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_elf_done"})).concat([{t:"离开",go:"elf_done"}])};
  2722	};
  2723	N["board_elf_done"] = {place:"委托板",text:["活计办妥，赏金落袋。"],options:[{t:"再接一单",go:"board_elf"},{t:"离开",go:"elf_done"}]};
  2724	/* ================================================================
  2725	   矮人王国
  2726	   ================================================================ */
  2727	N["arrive_dwarf_wangdu"] = {
  2728	  place:"矮人王国 · 石门", where:"途中",
  2729	  text:[
  2730	    "矮人山脉横亘在西部，像一道天然的城墙。唯一能通行的地方，是一扇巨大的石门——高十丈，宽五丈，门面上刻着锤与砧的徽记。",
  2731	    "守门的矮人战士身材敦实，手里拄着比你还高的战锤。他打量你，瓮声瓮气：",
  2732	    "“人类。来矮人王国，做什么？”",
  2733	    "“买铁？买酒？还是——”他眯起眼，“找活干？”",
  2734	    "你想起关于矮人的传说：矿脉枯竭，经济衰退，但他们的熔炉与锤声，从未停歇。"
  2735	  ],
  2736	  options:[
  2737	    {t:"说明来意：追查深渊线索，听说矿脉深处有异",check:{a:"CHA",sk:"persu",label:"陈情"},tier:{
  2738	      ok:["守门矮人听到'矿脉'二字，眼神微动。他沉默片刻，说：'矿脉……你倒是问到点子上了。'他侧身让路：'进去吧。去熔铁神殿，找至高王。他正为这事发愁。'"],
  2739	      fail:["守门矮人摆摆手：'深渊？矮人不掺和人类的深渊。'他拄着战锤，不再理会你。"],
  2740	      crit:["你提到了矿山城井下那'声音'。守门矮人的脸色变了：'……你也听见了？'他压低声音：'那声音，三个月前开始，从我们最深的老矿道里传出来。长老们说，是地脉在动。可老矿工们说，不像。'他侧身让路：'进去吧。找大锻造师。他懂。'"]
  2741	    },onOk:{flag:"dwarf_entry"},go:"dwarf_city"},
  2742	    {t:"先不亮明来意，以商人的身份进城",check:{a:"CHA",sk:"bargain",label:"商谈"},tier:{
  2743	      ok:["你报了个买铁料的名头。守门矮人点点头：'买铁？好。城里铁匠铺多的是。'他放你进城，还给你指了路：'顺街走，第三个路口右拐，老巴德的铺子，货最全。'"],
  2744	      fail:["守门矮人上下打量你：'买铁？就你这身板，扛得动铁料吗？'他虽这么说，还是放你进了城。"],
  2745	      crit:["你聊起锻造，守门矮人来了兴致，跟你多说了几句：'矮人的锤，认铁也认人。好铁配好锤，好锤配好汉。'他拍拍你的肩（力道让你趔趄）：'你这小子，看着像能吃苦的。进城吧！'"]
  2746	    },go:"dwarf_city"}
  2747	  ]
  2748	};
  2749	N["dwarf_city"] = {
  2750	  place:"矮人王国 · 王都", where:"白昼",
  2751	  text:[
  2752	    "矮人王都建在山腹里。穹顶是天然的岩层，被凿出无数盏石灯，灯光昏黄，把整座城市照得温暖而深沉。",
  2753	    "街道两侧，铁匠铺一家挨着一家，锤声此起彼伏，像一首永不终结的协奏曲。空气里飘着铁锈、煤烟与麦酒的气味。",
  2754	    "你路过一家铺子，一个老矮人正对着一柄断剑唉声叹气：",
  2755	    "“唉，好钢啊，好钢。可惜淬火的时候，炉子不稳……”",
  2756	    "他抬头看见你，眼睛一亮：",
  2757	    "“人类！会打铁吗？不会？那会拉风箱吗？也不会？那——”他塞给你一壶酒，“喝酒总行吧？来，陪我喝一壶，听我讲讲这柄断剑的故事。”"
  2758	  ],
  2759	  options:[
  2760	    {t:"陪老矮人喝酒，听故事",check:{a:"CHA",sk:"persu",label:"闲聊"},tier:{
  2761	      ok:["老矮人话匣子一开，就收不住了：这柄断剑，是五十年前打给北境一位骑士的，'剑是好剑，人是好人，可惜，战死了'。他喝着酒，讲了一堆陈年旧事，末了，叹了口气：'现在啊，矿脉枯了，好钢越来越少，锤子打得再响，也打不出当年的东西了。'"],
  2762	      fail:["老矮人见你酒量不行，两杯就脸红，摇摇头：'罢了罢了，跟不会喝酒的人讲故事，没意思。'"],
  2763	      crit:["你陪他喝到第三壶，老矮人已经把你当成了忘年交。他压低声音告诉你：'城里最近不对劲。大锻造师一个人闷在工坊里，三天没出来了。'他打了个酒嗝：'还有，最深的矿道，封了。谁都不让进。'"]
  2764	    },onCrit:{flag:"dwarf_secret"},go:"dwarf_forge"},
  2765	    {t:"去熔铁神殿，求见至高王",go:"dwarf_king"},
  2766	    {t:"去铁匠铺学点手艺，淘点材料",go:"dwarf_workshop"}
  2767	  ]
  2768	};
  2769	N["dwarf_king"] = {
  2770	  place:"矮人王国 · 熔铁神殿", where:"白昼",
  2771	  text:[
  2772	    "熔铁神殿是矮人的圣地。殿中央，一尊巨大的锻造之神雕像矗立着，左手持锤，右手握砧，火光照着他沉默的面容。",
  2773	    "矮人至高王索林·铁须端坐在殿前的石座上。他年事已高，胡须花白，但手臂依然粗壮，目光依然如铁。",
  2774	    "他听完你的来意，沉默良久，开口，声音像两块铁摩擦：",
  2775	    "“人类。你说，深渊在往地底渗。”",
  2776	    "“我信。”",
  2777	    "他站起身来，走到你面前（虽然只到你胸口高，气势却压得你后退半步）：",
  2778	    "“因为三个月前，我们最深的老矿道里，开始传出'声音'。”",
  2779	    "“老矿工们说，那是地脉在呻吟。可我知道——”他顿了顿，“地脉不会呻吟。只有被钉住的东西，才会。”"
  2780	  ],
  2781	  options:[
  2782	    {t:"追问：被钉住的东西，是什么",check:{a:"INT",sk:"lore",label:"追问"},tier:{
  2783	      ok:["至高王摇摇头：'不知道。老矿道封了三百年，那是上古矮人留下的禁地。'他顿了顿：'但大锻造师，三天前私自下了矿道。到现在，没出来。'","他看向你：'人类，你既然来了，帮我做件事：下矿道，把大锻造师带回来。'"],
  2784	      fail:["至高王摇摇头：'有些事，说了你也不懂。'他显然不愿多谈。"],
  2785	      crit:["至高王压低声音：'三百年前，上古矮人在最深的矿道里，封了一件东西。'他指了指脚下：'就在这神殿正下方。'他盯着你：'老祖宗们封它的时候说：'宁可山塌，不可门开。''"]
  2786	    },onCrit:{flag:"king_warning"},go:"dwarf_mine"},
  2787	    {t:"问至高王：矮人王国与南方的生意，做得怎么样",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  2788	      ok:["至高王哼了一声：'南方？买我们的铁，再卖给我们'便宜的南方货'。'他顿了顿：'前些日子，有批'南方铁料'，成色不错，价钱却低得离谱。'他眼神微沉：'好得不像话的东西，多半有问题。'"],
  2789	      fail:["至高王不太想谈生意：'矮人只管打铁，不管算账。'"],
  2790	      crit:["至高王压低声音：'那批便宜铁料，我让人查过。炼法不是南方的，倒像是……'他顿了顿：'沙漠里那种'古法'。'"]
  2791	    },onCrit:{flag:"cheap_iron"},go:"dwarf_mine"}
  2792	  ]
  2793	};
  2794	N["dwarf_mine"] = {
  2795	  place:"矮人王国 · 老矿道", where:"地底",
  2796	  text:[
  2797	    "老矿道在神殿地下三层。入口封着铁闸，你（凭至高王的令牌）打开了它。",
  2798	    "矿道很宽，足以并行三辆矿车，但空无一人。壁上嵌着的矿灯早已熄灭，你举着火把，光在黑暗中切出狭小的视野。",
  2799	    "空气越来越闷。你的脚步声在矿道里回荡，像有另一个人与你同行。",
  2800	    "走了半个时辰，你听见了那个'声音'。",
  2801	    "很低，很沉，像是从岩层深处传来的、某种巨大的心跳。",
  2802	    "你握紧了武器。前方，矿道拐弯处，隐约有光。"
  2803	  ],
  2804	  options:[
  2805	    {t:"循着光，继续深入",check:{a:"SPR",sk:"will",label:"深入",note:"对抗低语"},tier:{
  2806	      ok:["你压住心头的不适，继续前行。拐过弯，你看见：一个矮小的身影蹲在岩壁前，正用锤子轻轻敲击岩面——是大锻造师。他听见你的脚步声，头也不回：'来了？'他指指岩壁：'你听。'","你贴近岩壁。那'心跳'声，隔着石头传来，一声，又一声。","'这不是心跳。'大锻造师缓缓说：'是'门'在动。'"],
  2807	      fail:["那声音越来越大，你头痛欲裂，只得停步。缓了很久，才继续往前走。"],
  2808	      crit:["你不但深入了矿道，还在途中发现：岩壁的裂缝里，嵌着一枚乌黑的铁牌——七纹竖瞳。你把它撬下来，指尖发凉。","'锚。'你想起精灵树根下的那枚。有人在这条矿道里，也钉了一颗钉子。"],
  2809	      critfail:["你走到拐弯处，那'心跳'声忽然在你脑中炸开。你眼前一黑，看见一片黄沙，沙下埋着一座漆黑的神殿——又是它。","你扶着岩壁，呕出一口酸水，才缓过来。额角的冷汗，顺着脸颊淌下。"]
  2810	    },effects:{xp:25},onCrit:{item:"乌黑铁牌（第五枚）"},onCritFail:{san:-8},go:"dwarf_forger"},
  2811	    {t:"先检查矿道两壁，寻找异常",check:{a:"INT",sk:"detect",label:"勘查"},tier:{
  2812	      ok:["你仔细检查矿道。在距'心跳'声最近的位置，你发现岩壁上有新凿的痕迹——不是采矿，是刻阵。阵纹繁复，与你见过的深渊仪式阵，同出一源。","有人在矿道里，刻了一个阵。"],
  2813	      fail:["矿道太暗，你什么也没发现。"],
  2814	      crit:["你顺着阵纹的走向，找到了源头：一处被乱石封死的侧洞。你扒开几块石头，看见洞里堆着——祭祀用的器皿、几根白骨，和一枚乌黑的铁牌。","'祭品已备。'你几乎能想象，写下这几个字的人，脸上的表情。"]
  2815	    },effects:{xp:20},onCrit:{item:"乌黑铁牌（第五枚）",flag:"mine_altar"},go:"dwarf_forger"}
  2816	  ]
  2817	};
  2818	N["dwarf_forger"] = {
  2819	  place:"矮人王国 · 老矿道 · 尽头", where:"地底",
  2820	  text:[
  2821	    "大锻造师放下锤子，转过身来。他是个精瘦的老矮人，胡须焦黄，眼睛里却烧着火。",
  2822	    "“我在这里凿了三天。”他说，“凿开这层岩壁，后面就是那个'声音'的源头。”",
  2823	    "“老祖宗封它的地方。”",
  2824	    "他盯着你：“我老了，凿不动了。但你——”他指了指你的手，“有把子力气。”",
  2825	    "“帮我把这层岩壁凿开。我倒要看看，老祖宗们到底封了个什么东西。”",
  2826	    "你看着他。他的眼神里，没有恐惧，只有一种近乎狂热的好奇。"
  2827	  ],
  2828	  options:[
  2829	    {t:"帮他凿开岩壁",check:{a:"STR",sk:"athletic",label:"开凿"},tier:{
  2830	      ok:["你抡起锤子，凿了半个时辰。岩壁终于裂开一道缝——一道黑气，从缝隙里'嘶'地喷出来。你后退一步，那黑气在空气中扭动，像一条蛇，随即消散。","大锻造师凑近缝隙，看了一眼，脸色大变：'……是封印石。碎了。'"],
  2831	      fail:["岩壁太硬。你凿了半天，只崩下几块碎石。大锻造师叹了口气：'算了。也许是老祖宗的意思。'"],
  2832	      crit:["你凿开岩壁后，迅速封住了那道缝隙。大锻造师看着你的动作，点了点头：'有经验。'他蹲在缝隙前，看了很久，缓缓说：'封印石碎了。但碎得不彻底——有人想开，又有人想封。'他抬起头：'这里，来过两拨人。'"],
  2833	      critfail:["你凿开岩壁的瞬间，一股浓烈的黑气扑面而来。你来不及反应，被它扑了个正着。胸口剧痛，你踉跄后退，那黑气钻进了你的伤口。","大锻造师脸色大变，冲上来按住你的伤口，嘴里念着矮人的祷词。好一会儿，那黑气才散去。你脸色苍白，胸口的伤处，留下一道淡黑色的印记。"]
  2834	    },effects:{xp:25},onCrit:{flag:"two_factions"},onCritFail:{hp:-15,san:-5,flag:"hand_mark"},go:"dwarf_after"},
  2835	    {t:"劝大锻造师收手，回去禀报至高王",check:{a:"CHA",sk:"persu",label:"劝说"},tier:{
  2836	      ok:["你按住大锻造师的锤子：'这里的事，该让至高王知道。'他盯着你看了很久，最终松开手，长长叹了口气：'……你说得对。'","你们退出矿道，封好铁闸。大锻造师一路沉默，直到回到神殿，才开口：'老王，矿道下面，有东西要醒了。'"],
  2837	      fail:["大锻造师不理会你：'你懂什么？这是矮人的事！'他固执地继续凿着。"],
  2838	      crit:["你劝住了他，还在退出时，把矿道里的阵纹走向拓印了下来。至高王看完拓印，脸色铁青：'这是深渊的'开门阵'。'他看向你：'人类，你帮矮人王国，避过了一劫。'"]
  2839	    },effects:{rep:5},onCrit:{flag:"mine_saved",infl:{dwarf:5}},go:"dwarf_after"}
  2840	  ]
  2841	};
  2842	N["dwarf_after"] = {
  2843	  place:"矮人王国 · 熔铁神殿", text:[
  2844	    "至高王听完你们的汇报，沉默了很久。",
  2845	    "最终，他开口：'人类。矮人欠你一个人情。'他示意侍从取来一柄短锤：'这是矮人的谢礼。钢是好钢，锤是好锤。它能帮你敲开很多打不开的东西。'",
  2846	    "你收下短锤。临别时，大锻造师在你身后喊了一句：",
  2847	    "'人类！要是你哪天要打'斩深渊的兵器'，来找我！锤子管够！'",
  2848	    "你回头。他站在神殿门口，火光映着他焦黄的胡须，像一个不肯认输的老兵。"
  2849	  ],options:[
  2850	    {t:"谢过矮人，离开王国",effects:{item:"矮人短锤",rep:8,infl:{dwarf:10}},tier:{ok:["你揣着短锤，走出石门。身后，锻锤声依旧此起彼伏，像这座山的呼吸。","你知道，山腹深处，有一道裂缝正在愈合——也有人，正在往里看。"]},go:"dwarf_done"}
  2851	  ]
  2852	};
  2853	N["dwarf_done"] = {
  2854	  place:"矮人山脉 · 山口", text:["你站在矮人山脉的山口，回望那片沉默的群山。","风从山口灌进来，带着铁锈与煤烟的气味。你摸了摸怀里的短锤与铁牌。","下一个方向，你已经有了眉目。"],
  2855	  options:[
  2856	    {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }},
  2857	    {t:"在矮人地界接点活",go:"board_dwarf"}
  2858	  ]
  2859	};
  2860	const DWARF_BOARD = [
  2861	  {t:"帮铁匠铺的老巴德送一批'好钢'到矿山城",check:{a:"STR",sk:"athletic",label:"押运"},ok:["你押着好钢，翻山越岭送到矿山城。收货的铁匠验了钢，眼睛发亮：'好钢！'多给了赏钱。"],fail:["山路难行，你摔了一跤，钢料磕了角。铁匠脸色不好看。"],okEff:{gold:18,xp:22,rep:2},failEff:{gold:6,xp:10}},
  2862	  {t:"替老矿工送一壶酒到封矿道口（祭奠）",check:{a:"SPR",sk:"will",label:"送达"},ok:["你把酒放在矿道口的石台上，拜了拜。老矿工站在你身后，沉默许久，说：'祖宗们喝得到。'他给了你赏钱。"],fail:["矿道口有卫兵守着，你只得把酒放远了些。"],okEff:{gold:8,xp:15},failEff:{gold:3,xp:6}},
  2863	  {t:"帮大锻造师测试一柄新锻的战斧",check:{a:"STR",sk:"martial",label:"测试"},ok:["你挥舞战斧，劈断三根木桩。大锻造师看了直点头：'好腕力！'他送你一小块精钢。"],fail:["战斧太重，你抡了两下就脱了手。大锻造师摇摇头。"],okEff:{gold:12,xp:20,mat:function(){const j=JOBS[S.job];return j.mats[1];}},failEff:{gold:4,xp:8}},
  2864	  {t:"护送矮人商队到自由城邦",check:{a:"STR",sk:"martial",label:"护送"},ok:["矮人商队一路平安，抵达自由城邦。领队的矮人拍了拍你的肩（力道让你一个趔趄）：'人类，够义气！'"],fail:["半路遇上流民抢货，你拼力护住大部分。矮人领队叹了口气，给了半份赏金。"],okEff:{gold:20,xp:25,rep:2},failEff:{gold:8,xp:10}}
  2865	];
  2866	N["board_dwarf"] = function(){
  2867	  const picks = shuffle(DWARF_BOARD).slice(0,3);
  2868	  return {place:"矮人王国 · 委托板",text:["矮人的活计，都跟铁与力有关。你扫了一眼委托板。"],options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_dwarf_done"})).concat([{t:"离开",go:"dwarf_done"}])};
  2869	};
  2870	N["board_dwarf_done"] = {place:"委托板",text:["活计办妥，赏金落袋。"],options:[{t:"再接一单",go:"board_dwarf"},{t:"离开",go:"dwarf_done"}]};
  2871	/*==STORY_DWARF==*/
  2872	N["dwarf_workshop"] = {
  2873	  place:"矮人王国 · 铁匠铺", text:["你在铁匠铺里转了一圈。炉火通红，铁花四溅。一个中年矮人正在锻一把弯刀，手法极快，锤点如雨。","他头也不抬：'想学？站远点看。想买？等三天。'你看着他手中的铁，在锤下渐渐成型，像一件活物。"],options:[
  2874	    {t:"观摩锻打，学点皮毛",check:{a:"INT",sk:"lore",label:"观摩"},tier:{ok:["你看了一下午，记住了锤点、火候与淬水的时机。中年矮人瞥你一眼：'记性不错。'他扔给你一块废料：'拿去练手。'"],crit:["你不但看懂了，还指出他淬火时水凉了半度。中年矮人愣住，半晌，咧嘴一笑：'……有点意思。'他送你一柄他早年打的短匕：'留着。'"]},effects:{xp:20},onCrit:{item:"矮人短匕"},go:"dwarf_city"},
  2875	    {t:"淘点锻造材料",check:{a:"CHA",sk:"bargain",label:"采购"},tier:{ok:["你挑了几块成色不错的精钢与符文铁。付钱时，矮人掌柜多看了你一眼：'识货。'"],crit:["你在角落的废料堆里，翻出一块被遗忘的暗色矿石——切开，里面裹着一粒晶莹的结晶。矮人掌柜懊恼地直拍大腿。"]},effects:{gold:-12},onOk:{mat:function(){const j=JOBS[S.job];return j.mats[1];}},onCrit:{mat:function(){const j=JOBS[S.job];return j.mats[2];}},go:"dwarf_city"}
  2876	  ]
  2877	};
  2878	/* ================================================================
  2879	   兽人草原
  2880	   ================================================================ */
  2881	N["arrive_orc_heishi"] = function(){
  2882	  const saved = S.flags.beijing_saved;
  2883	  return {
  2884	    place:"兽人草原 · 黑石部族营地", where:"途中",
  2885	    text:[
  2886	      "兽人草原的风，带着草腥与铁锈的气味。你走了三天，终于看见地平线上立起一片连绵的帐篷——黑石部族的营地。",
  2887	      "营地中央，一根巨大的图腾柱矗立着，柱顶是一颗咆哮的狼头，黑石的图腾，黑旗如云。",
  2888	      "你还没靠近，就被一队骑手拦住了。领头的兽人战士骑着一匹黑马，居高临下，声音粗砺：",
  2889	      "“人类。草原上，人类只分两种：商人，和探子。”",
  2890	      "“你，是哪一种？”",
  2891	      saved ? "你想起了冰狼部落的事。你帮过他们，而黑石部族，正是那件事的另一方。" : "你想起北境的老狼说过的话：黑石部族的'神谕'，有问题。"
  2892	    ],
  2893	    options:[
  2894	      {t:"自称行商，请求入营交易",check:{a:"CHA",sk:"bargain",label:"交涉"},tier:{
  2895	        ok:["领头的兽人打量你片刻，咧嘴一笑（露出尖牙）：'行商？好。草原缺铁，缺药，缺一切值钱的东西。'他放你入营：'别惹事。惹事的人，喂狼。'"],
  2896	        fail:["兽人嗤笑：'行商？你连货都没有。'他挥手，骑手们围上来。你只得亮出武器（或赔笑解释），才被放行。"],
  2897	        crit:["你报出了（老狼教的暗号/冰狼部落的名头），领头的兽人脸色微变，沉默片刻，侧身让路：'……进去吧。大汗要见你。'"],
  2898	        critfail:["你说错了草原上的忌讳词。领头的兽人脸色一沉，手按上弯刀：'人类，你在找死。'你被扣了一夜，第二天才被放出营地，身上的干粮被搜走了一半。"]
  2899	      },onCrit:{flag:"orc_entry"},onCritFail:{gold:-10},go:"orc_camp"},
  2900	      {t:"不亮身份，先远远观察营地",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  2901	        ok:["你爬上远处的土丘，观察了一下午。营地规模很大，帐篷数千顶；但营地里，青壮年战士的比例高得异常——不像游牧部落，像一支正在集结的军队。","你注意到，营地中央的图腾柱下，有几个穿黑袍的身影——萨满。但他们与普通兽人萨满不同：他们戴着遮面的兜帽，像南方人。"],
  2902	        fail:["草原太平，你什么也没看出来。倒是被巡逻的骑手发现了，赶了一程。"],
  2903	        crit:["你观察到关键细节：营地东南角，有一排用黑布围起的帐篷，进出的人，都穿着南方式的袍子。一个兽人战士送饭时，你听见他嘀咕：'这些'顾问'，不吃肉，光喝汤。'","南方的顾问。你想起银月商会，想起那些'从南边来的萨满'。"]
  2904	      },onCrit:{flag:"south_advisors"},go:"orc_camp"}
  2905	    ]
  2906	  };
  2907	};
  2908	N["orc_camp"] = {
  2909	  place:"兽人草原 · 黑石营地", where:"白昼",
  2910	  text:[
  2911	    "黑石营地里，烤肉与马粪的气味混在一起。兽人们好奇地打量你这个人类，有的咧嘴笑，有的不怀好意。",
  2912	    "你在营地边缘的酒摊坐下，要了一碗浑浊的马奶酒。卖酒的老兽人收了钱，多看了你一眼：",
  2913	    "“人类，胆子不小。一个人敢来黑石营地。”",
  2914	    "“不过你来得巧——大汗今天召见各部的萨满，说是'神谕'又来了。”",
  2915	    "他压低声音：“那'神谕'，三个月前开始，一来就是半夜。每次来，大汗的脸色都不好。”",
  2916	    "远处，营地中央的图腾柱下，聚集的人群渐渐多了起来。"
  2917	  ],
  2918	  options:[
  2919	    {t:"混进人群，看看'神谕'是怎么回事",check:{a:"AGI",sk:"stealth",label:"潜入"},tier:{
  2920	      ok:["你混在人群外围，看见图腾柱下站着一个魁梧的兽人——黑石大汗。他面前，一个穿黑袍的萨满正在跳一种怪异的舞，嘴里念着你听不懂的音节。","你认出那音节的调子——自由城邦下水道、铁门关黑烟，同一种东西。","人群忽然安静下来。黑袍萨满猛地停下，指向天空，嘶哑地喊道：'祖灵降谕！南下！夺回祖辈的牧场！'","人群爆发出吼声。你站在吼声里，后背发凉。"],
  2921	      fail:["人群太挤，你被挤到外围，什么也看不见。只听见人群里爆发出吼声：'南下！南下！'"],
  2922	      crit:["你不但看清了仪式，还注意到：那黑袍萨满念咒时，袖口里露出的手腕上，纹着一枚黑色的竖瞳。","'南方的顾问。'你几乎可以确定，这'神谕'，是被人操纵的。"],
  2923	      critfail:["你刚靠近，就被一个眼尖的兽人战士认出来：'人类探子！'人群骚动起来。你只得转身就跑，跑了半里地才甩掉追兵。营地的大门，对你关上了。"]
  2924	    },effects:{xp:20},onCrit:{flag:"oracle_fake"},onCritFail:{flag:"orc_hostile"},go:"orc_sacred"},
  2925	    {t:"去找黑石大汗，当面谈",check:{a:"CHA",sk:"persu",label:"求见"},tier:{
  2926	      ok:["你报上（冒险者/商人/老狼引荐）的名号，请求面见大汗。出乎意料，大汗同意见你。","你被领进大帐。黑石大汗坐在狼皮座上，打量你：'人类，你胆子不小。'你直说来意：草原上的'神谕'，有问题。","大汗沉默了很久。他的眼神里，有愤怒，也有你说不清的东西。'你说，'他缓缓开口，'祖灵的声音，是假的？'"],
  2927	      fail:["大汗不见外人。你被卫兵挡在帐外，只得作罢。"],
  2928	      crit:["你不但见到了大汗，还当场指出了黑袍萨满手腕上的竖瞳纹身。大汗脸色骤变，喝令那萨满上前——萨满转身想逃，被两个兽人战士按住。","大帐里一片死寂。大汗缓缓抽出腰间的弯刀，刀尖指向那萨满：'……你说，祖灵降谕？'"]
  2929	    },effects:{rep:5},onCrit:{flag:"khan_aware"},go:"orc_sacred"}
  2930	  ]
  2931	};
  2932	N["orc_sacred"] = {
  2933	  place:"兽人草原 · 兽人圣山 · 祖灵洞", where:"白昼",
  2934	  text:[
  2935	    "兽人圣山是一座孤零零的黑色山峰，矗立在草原深处。山腰的祖灵洞，是兽人萨满的圣地，也是大萨满的居所。",
  2936	    "你（凭借大汗的许可/或绕开守卫）来到祖灵洞前。洞口很大，燃着长明火，火光把洞壁上的古老壁画照得忽明忽暗。",
  2937	    "洞内，一个佝偻的身影正坐在火堆旁。他披着兽皮，脸上纹着复杂的图腾，眼睛是浑浊的琥珀色。",
  2938	    "他看见你，没有惊讶，只是缓缓开口：",
  2939	    "“人类。你是这十年来，第一个走进祖灵洞的人类。”",
  2940	    "“你是来听祖灵说话的，还是——来问我，祖灵为什么'变了声音'？”",
  2941	    "你心头一跳。大萨满，早就知道了。"
  2942	  ],
  2943	  options:[
  2944	    {t:"直说：'神谕'是假的，有人在操纵草原",check:{a:"CHA",sk:"persu",label:"陈情"},tier:{
  2945	      ok:["大萨满沉默良久，缓缓点头：'我知道。'他叹息一声：'三个月前，祖灵的声音开始模糊。取而代之的，是一种……更冷的声音。'他抬起浑浊的眼睛：'我试图阻止，但大汗信了'新神谕'。部落的长老们，也信了。'","'我说的话，没人听了。'"],
  2946	      fail:["大萨满摇摇头：'你说神谕是假的？可千百个兽人，都听见了祖灵的声音。'他顿了顿：'人心一旦相信，真相就变得无关紧要了。'"],
  2947	      crit:["大萨满缓缓点头：'你比大汗看得清楚。'他告诉你一个秘密：'那'新神谕'，每次降临时，祖灵洞的圣火都会变暗。圣火是祖灵的眼睛。它变暗，说明——有别的眼睛，在看草原。'","他指给你看：圣火深处，有一缕极细的黑气，盘旋不去。"]
  2948	    },effects:{xp:25},onCrit:{flag:"grand_shaman"},go:"orc_after"},
  2949	    {t:"问大萨满：祖灵的'旧声音'，还说过什么",check:{a:"INT",sk:"lore",label:"询问"},tier:{
  2950	      ok:["大萨满闭上眼，仿佛在聆听什么。良久，他开口：'祖灵说过，草原的根，在地底。'他睁开眼：'三十年前，有商队在草原深处挖出过东西。祖灵说，那不是草原的东西，不要碰。'","'可有人，还是挖了。'"],
  2951	      fail:["大萨满没有回答，只是摇了摇头，仿佛在聆听什么你听不见的声音。"],
  2952	      crit:["大萨满压低声音：'祖灵还说了一句话——'他顿了顿，'七颗钉子，钉住了大地的七条筋脉。拔钉的人，和钉钉的人，是同一批。'","你心头一震。七颗钉子。七纹竖瞳。七处节点。"]
  2953	    },effects:{xp:20},onCrit:{flag:"seven_nails"},go:"orc_after"}
  2954	  ]
  2955	};
  2956	N["orc_after"] = {
  2957	  place:"兽人草原 · 祖灵洞外", text:[
  2958	    "你走出祖灵洞时，夕阳正把草原染成一片血红。",
  2959	    "大萨满在洞内喊住你，声音苍老而清晰：",
  2960	    "“人类。草原的刀，已经出鞘了一半。另一半，攥在那些'顾问'手里。”",
  2961	    "“你若要拦这把刀——去沙漠吧。那里，才是这把刀真正要砍的方向。”",
  2962	    "你回头。祖灵洞的圣火，在暮色里忽明忽暗，像一只疲惫的眼睛。"
  2963	  ],options:[
  2964	    {t:"谢过大萨满，离开草原",effects:{rep:8,infl:{orc:10}},tier:{ok:["你策马（或步行）离开草原。身后，黑石营地的战鼓声隐隐传来，像某种不可逆的节拍。","你想起大萨满的话。草原的刀，已经出鞘了一半。"]},go:"orc_done"}
  2965	  ]
  2966	};
  2967	N["orc_done"] = {
  2968	  place:"兽人草原 · 边界", text:["你站在草原与北境的交界处，回望那片苍茫的绿。","风里传来战鼓与马嘶。草原正在为一个决定积蓄力量——而那个决定，也许不在兽人自己手里。","你摸了摸怀里的铁牌。下一站，你已有了方向。"],
  2969	  options:[
  2970	    {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }},
  2971	    {t:"在草原边境接点活",go:"board_orc"}
  2972	  ]
  2973	};
  2974	const ORC_BOARD = [
  2975	  {t:"替商队与黑石营地牵线，卖一批铁器",check:{a:"CHA",sk:"bargain",label:"贸易"},ok:["你把铁器卖出好价。黑石的采购头目点头：'人类，够痛快！'多给了赏钱。"],fail:["黑石压价压得狠，你只赚了个辛苦钱。"],okEff:{gold:20,xp:20,rep:2},failEff:{gold:8,xp:8}},
  2976	  {t:"护送一位兽人老萨满到祖灵洞",check:{a:"SPR",sk:"will",label:"护送"},ok:["老萨满腿脚不便，你一路照料。到祖灵洞时，他送你一根兽骨杖：'路上辟邪。'"],fail:["草原上风沙大，你们多走了半日。"],okEff:{gold:10,xp:18,item:"兽骨杖"},failEff:{gold:4,xp:8}},
  2977	  {t:"替冰狼部落（或北境猎人）侦察黑石营地的动静",check:{a:"AGI",sk:"stealth",label:"侦察"},ok:["你摸到营地外围，记下兵力调动的情报，安全返回。委托人很满意：'眼睛好使！'"],fail:["你差点被巡逻队发现，仓促撤回，只记到一半情报。"],okEff:{gold:16,xp:25,rep:2},failEff:{gold:6,xp:10}}
  2978	];
  2979	N["board_orc"] = function(){
  2980	  const picks = shuffle(ORC_BOARD).slice(0,2);
  2981	  return {place:"兽人草原 · 边市",text:["草原边市上的活计，粗犷而直接。你扫了一眼。"],options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_orc_done"})).concat([{t:"离开",go:"orc_done"}])};
  2982	};
  2983	N["board_orc_done"] = {place:"边市",text:["活计办妥，赏金落袋。"],options:[{t:"再接一单",go:"board_orc"},{t:"离开",go:"orc_done"}]};
  2984	/* ================================================================
  2985	   东部王国
  2986	   ================================================================ */
  2987	N["arrive_east_chengtian"] = function(){
  2988	  const wanted = S.flags.east_wanted;
  2989	  return {
  2990	    place:"东部王国 · 承天城", where:"途中",
  2991	    text:[
  2992	      "承天城的城墙，比你见过的任何一座城都高。朱红的宫墙在日光下像凝固的血，飞檐上的琉璃瓦闪着金色的光。",
  2993	      "城门处盘查极严。士兵们检查每一张通关文牒，队伍排得老长。",
  2994	      "你听见前面的人低声议论：'特科科举下月开考，天下超凡者，云集帝京。''听说这一次，皇帝要选'国士'。'",
  2995	      wanted ? "你摸了摸怀里的通关文书（伪造的/贿赂来的）。你在铁门关惹过东军的眼线，这张脸，不知道有没有被记下。" : "你排队等着过关，盘算着用什么身份进城。"
  2996	    ],
  2997	    options:[
  2998	      {t:"以'游学旅人'的身份过关",check:{a:"CHA",sk:"persu",label:"过关"},tier:{
  2999	        ok:["你报了个游学旅人的名头，又递上几枚银币'茶水费'。守门校尉看了你一眼，挥手放行：'帝京不比别处，别惹事。'"],
  3000	        fail:["校尉盘问得极细：'游学？学什么？师从何人？'你答得磕巴，被扣下查了半日，才放行。"],
  3001	        crit:["你不但过了关，还从校尉口中套出情报：'特科科举，今年破例，不限出身。'他压低声音：'听说，考得好的，能直接面圣。'","你默默记下。特科科举，是进入帝京上层的一条路。"],
  3002	        critfail:["校尉认出了你（或者你的文牒有问题）。你被带进值房，查了两日。虽然最终放行，但你的名字，落在了东军的案卷上。"]
  3003	      },onCritFail:{flag:"east_wanted"},go:"east_city"},
  3004	      {t:"花重金买一张'商人牌'过关",effects:{gold:-30},tier:{ok:["你托人买了一张来路'正经'的商人牌。过关时，凭牌畅通无阻。","只是那张牌上写的姓名、籍贯，都是假的。你把它收好，心里有数。"]},go:"east_city"},
  3005	      {t:"先不去承天城，去铁门关方向看看",run:function(){ travelTo("east_tiemen"); }}
  3006	    ]
  3007	  };
  3008	};
  3009	N["east_city"] = {
  3010	  place:"东部王国 · 承天城 · 街市", where:"白昼",
  3011	  text:[
  3012	    "承天城的街市，秩序井然得近乎压抑。店铺挂着统一的幌子，行人走路都带着几分小心。",
  3013	    "你在一家茶楼坐下，要了一壶茶。隔壁桌的茶客正低声议论：",
  3014	    "“特科科举，大皇子力主广纳超凡者，二皇子却说要'以文取士'。听说两人在御前争了一回。”",
  3015	    "“还有铁门关的事——前线大捷，说是‘一夜破关’。可有人说，那晚关城上，飘着黑烟。”",
  3016	    "茶客们压低了声音。你端着茶盏，指尖微凉。",
  3017	    "窗外，一队兵士押着几个戴镣铐的人走过。路人纷纷低头，不敢直视。"
  3018	  ],
  3019	  options:[
  3020	    {t:"打听特科科举的事",go:"east_keju"},
  3021	    {t:"打听铁门关'黑烟'的事",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  3022	      ok:["茶客们你一言我一语：'黑烟？前线回来的伤兵都说见过。''官府说那是东军自己放的烟障。''可烟障哪有那样的——烟能追人。'一个老茶客压低声音：'我侄子在前线，他说那烟，会自己找路。'","你握着茶盏，想起铁壁城老莱昂的话。同一件事，隔了几千里，说法一模一样。"],
  3023	      fail:["茶客们警惕地看着你：'打听前线的事？你是哪边的？'你连忙岔开话题。"],
  3024	      crit:["你从茶楼掌柜那里套到更多：'黑烟'的事，官府已经下令禁谈。但有个从铁门关撤下来的老兵，在城东的旧庙里养伤，整天念叨'烟里有脸'。","你默默记下城东旧庙的位置。"]
  3025	    },onCrit:{flag:"east_smoke"},go:"east_city"},
  3026	    {t:"去城东旧庙，找那个老兵",go:"east_oldtemple"}
  3027	  ]
  3028	};
  3029	N["east_keju"] = {
  3030	  place:"东部王国 · 承天城 · 贡院", where:"白昼",
  3031	  text:[
  3032	    "贡院是特科科举的考场。朱红大门两侧，贴着告示：",
  3033	    "“特科取士，以术试才。分三场：策论、术试、面试。”",
  3034	    "你挤在人群里看榜，一个年轻的士子叹了口气：",
  3035	    "“术试要当众施展术法，由钦天监的官员评定。过不了术试，策论写得再好也白搭。”",
  3036	    "另一个士子压低声音：“听说今年，钦天监换了个新监正，眼光刁得很。”",
  3037	    "你正听着，一个穿官服的中年人从贡院走出来，目光扫过人群。他看见你，微微一顿，随即移开。",
  3038	    "你感觉那目光，不像在看一个普通旅人。"
  3039	  ],
  3040	  options:[
  3041	    {t:"报名参加特科科举",check:{a:"INT",sk:"lore",label:"应试"},tier:{
  3042	      ok:["你报了名，领了号牌。考试那日，你凭真本事答完策论，又当众施展术法（或展现技艺）。钦天监的官员们交头接耳，最终给了你一个'中上'的评语。","虽未高中，但你有了一个正式身份：'特科举子'。这个身份，让你在承天城的行动方便了许多。"],
  3043	      fail:["你的策论写得平平，术试也发挥失常。落榜。不过，你倒是借着考试，摸清了贡院的规矩。"],
  3044	      crit:["你文试武试俱佳，钦天监的新监正亲自评了你一个'上上'。你被列入'待选'名单，还获得了一次面见朝臣的机会。","你走出贡院时，感觉无数道目光落在你背上。有人欣赏，有人忌惮。"]
  3045	    },effects:{rep:5,xp:25},onOk:{flag:"keju_passed"},onCrit:{flag:"keju_top"},go:"east_palace"},
  3046	    {t:"不考。借'特科'的由头，摸清帝京的势力盘根",check:{a:"CHA",sk:"persu",label:"打探"},tier:{
  3047	      ok:["你在贡院外的茶馆坐了一下午，听士子们议论朝局：大皇子掌兵，二皇子掌文，皇帝的身子骨一日不如一日。'铁门关的事，是大皇子的功，也是大皇子的祸。'一个士子压低声音：'有人说，那晚的黑烟，不是东军放的。'"],
  3048	      fail:["士子们警惕外人，你听不到多少实质内容。"],
  3049	      crit:["你从一个老吏口中套出关键一句：'钦天监的新监正，是从南方调来的。'他压低声音：'他上任后，特科忽然扩招——专收'会术法'的人。'","你心头一凛。南方调来的钦天监。特科扩招。这与银月商会在南方的动作，是不是同一条线？"]
  3050	    },effects:{xp:20},onCrit:{flag:"east_scheme"},go:"east_city"}
  3051	  ]
  3052	};
  3053	N["east_oldtemple"] = {
  3054	  place:"东部王国 · 承天城 · 城东旧庙", where:"黄昏",
  3055	  text:[
  3056	    "旧庙破败，香火冷清。你找到那个老兵时，他正坐在庙前的石阶上，晒太阳。他的左臂空着袖管，脸上的伤疤结着暗红的痂。",
  3057	    "你递上一壶酒。他接过，灌了一口，浑浊的眼睛里终于有了点光：",
  3058	    "“……你是第一个请我喝酒的。”",
  3059	    "“你想问黑烟的事？行。我说。反正，说了也没人信。”",
  3060	    "他压低声音，开始讲。"
  3061	  ],
  3062	  options:[
  3063	    {t:"听他讲完黑烟的真相",check:{a:"SPR",sk:"will",label:"聆听",note:"承受真相"},tier:{
  3064	      ok:["老兵的声音沙哑：'那晚，关城上起了烟。烟里有……脸。人的脸。'他打了个寒颤：'烟从地底下冒出来，追着人跑。跑得慢的，被烟一裹，人就没了。'","'我亲眼看见，一个兄弟被烟裹住，再出来时——眼睛是黑的，见人就砍。'他灌了口酒：'我们砍了那些'变了的'兄弟。砍完了，烟也散了。'","'后来大军入城，说是'一夜破关'。可我知道，关城不是被攻破的。是里面的人，先自己打起来了。'","你沉默地听完。他的叙述，与铁壁城老莱昂的讲述，严丝合缝。"],
  3065	      fail:["老兵讲到一半，忽然剧烈地咳嗽起来，咳得弯下腰。你帮他顺气，他摆摆手：'……不讲了。讲多了，梦也多做几场。'"],
  3066	      crit:["老兵讲完后，从怀里摸出一块布包，递给你：'这是我在关城上捡的。'你打开——是一枚乌黑的铁牌，七纹竖瞳。'那烟散了以后，地上就剩这个。'他压低声音：'我没敢交给官府。'","你握着铁牌，指尖发凉。第六枚了。"]
  3067	    },effects:{xp:25},onCrit:{item:"乌黑铁牌（第六枚）"},onCritFail:{san:-5},go:"east_palace"}
  3068	  ]
  3069	};
  3070	N["east_palace"] = {
  3071	  place:"东部王国 · 承天城 · 宫墙外", where:"夜",
  3072	  text:[
  3073	    "入夜，承天城的宫墙在月光下像一道沉默的巨影。你站在宫墙外的街道上，望着那层层叠叠的飞檐。",
  3074	    "一队巡逻的禁军走过，甲胄森然。你退进阴影里。",
  3075	    "你此行想见的人，或者想查的事，都在这道墙之内。",
  3076	    "但你也知道，墙内是另一个世界。一个比草原、比沙漠，更讲究棋子的世界。",
  3077	    "你摸了摸怀里的铁牌与文书。也许，你该换个方式进去。"
  3078	  ],
  3079	  options:[
  3080	    {t:"以'特科举子'（若考中）的身份，求见朝臣",check:{a:"CHA",sk:"persu",label:"求见"},tier:{
  3081	      ok:["你以特科举子的身份递上拜帖。接见你的是一位中年侍郎，他听了你的来意（追查铁门关黑烟），沉默良久，说：'黑烟的事，宫里讳莫如深。'他压低声音：'钦天监新监正，对此事格外上心。你可以去钦天监看看。'"],
  3082	      fail:["你的拜帖被拒。侍郎府的管家说：'大人不见闲人。'"],
  3083	      crit:["侍郎不但接见了你，还透露了一个关键信息：'钦天监新监正，上任前在南方'修行'过三年。'他顿了顿：'他那三年在哪儿，没人查得清。'"]
  3084	    },onCrit:{flag:"east_astronomer"},go:"east_after"},
  3085	    {t:"夜探钦天监",check:{a:"AGI",sk:"stealth",label:"夜探",note:"宫城禁地"},tier:{
  3086	      ok:["你换上夜行衣，摸进钦天监的院子。监正的书房亮着灯，你从窗缝里看见：他正对着一幅地图，地图上标注着七个点——其中六个画着圈，第七个，在死亡沙漠。","他身后的案上，放着一枚乌黑的铁牌。","你屏住呼吸，退出院子。心跳如鼓。"],
  3087	      fail:["钦天监的守卫比想象中严密。你刚翻过院墙，就被巡逻的禁军发现。你且战且退，从宫墙的水渠里钻了出去。","代价是，你的肩膀被箭擦伤。"],
  3088	      crit:["你不但看清了地图，还看清了监正案上的一封信，火漆纹章是七纹竖瞳。信上字迹工整：'节点已定，待帝星动。'","'帝星动。'你默默记下这三个字。"],
  3089	      critfail:["你刚摸进院子，就被一只无声无息的手按住肩膀。一个沙哑的声音在你耳边响起：'……来钦天监，是想看星星，还是想看别的？'","你被关进一间黑屋，关了三天。出来时，你被警告：'承天城，不欢迎不守规矩的人。'你的脸上，被记了一笔。"]
  3090	    },effects:{xp:30},onCrit:{flag:"east_astronomer"},onCritFail:{hp:-10,flag:"east_wanted"},go:"east_after"}
  3091	  ]
  3092	};
  3093	N["east_after"] = {
  3094	  place:"东部王国 · 承天城", text:[
  3095	    "你在承天城盘桓数日，渐渐看清了这座帝京的棋局：大皇子与二皇子之争，钦天监的南方背景，铁门关的黑烟，特科科举的扩招——每一件事，都像棋盘上的一枚子。",
  3096	    "而你，隐约觉得自己已经被推上了棋盘。",
  3097	    "临行前，你在城门口遇到一个卖字画的老者。他看着你，忽然说：",
  3098	    "“年轻人，帝京的水，深得很。你要是在这里站久了，小心变成别人的棋子。”",
  3099	    "你谢过他，背起行囊。"
  3100	  ],options:[
  3101	    {t:"离开承天城，去铁门关方向",run:function(){ travelTo("east_tiemen"); }},
  3102	    {t:"在承天城接点活",go:"board_east"}
  3103	  ]
  3104	};
  3105	N["arrive_east_tiemen"] = {
  3106	  place:"东部王国 · 铁门关（东侧）", where:"途中",
  3107	  text:[
  3108	    "铁门关，你从北方那一侧听过它的故事；如今，你站在它的东侧。",
  3109	    "关城雄踞在两山之间，城砖上满是刀痕与火痕。关城内外，东军的营帐连绵，旗帜猎猎。",
  3110	    "你远远望着关城，想起老莱昂与老兵的话：那晚的黑烟，那扇'被换过地基'的粮仓，那枚铁牌。",
  3111	    "关城的城门紧闭。你看见城头有兵士巡逻，步伐整齐，像一台精密的机器。",
  3112	    "你也看见，关城东北角的城墙根下，有一段颜色明显偏新的砖——新的地基。"
  3113	  ],
  3114	  options:[
  3115	    {t:"趁夜靠近那段'新地基'，查看究竟",check:{a:"AGI",sk:"stealth",label:"探查",note:"前线禁地"},tier:{
  3116	      ok:["你趁着夜色与换岗的间隙，摸到那段新砖墙下。砖缝里，渗着一丝若有若无的黑气。你撬开一块砖——砖后，是一道黑黢黢的缝隙，直通地底。","一股陈腐的气味涌上来，带着你熟悉的、那种低语的味道。你后退两步，心跳如鼓。"],
  3117	      fail:["巡逻太密，你找不到机会。在墙根蹲了一夜，只得悻悻撤回。"],
  3118	      crit:["你不但确认了地基下的缝隙，还在缝隙边缘摸到一枚嵌着的乌黑铁牌——第七枚。你把铁牌撬下，收进怀里。","七枚铁牌。七处节点。你站在铁门关的夜色里，终于明白：这一切，是一条线。"],
  3119	      critfail:["你撬砖时弄出了声响。一队东军骑兵冲过来。你拔腿就跑，跑出三里地才甩掉追兵，肩膀被箭擦伤。","城头的烽火台，为你的惊扰，亮了一瞬。"]
  3120	    },effects:{xp:25},onCrit:{item:"乌黑铁牌（第七枚）",flag:"seven_marks_collected"},onCritFail:{hp:-10,flag:"east_wanted"},go:"east_tiemen_after"},
  3121	    {t:"不冒险。在关城外观察一番，记录情报",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  3122	      ok:["你花了半天，把铁门关的布防、兵力、换岗规律记了个大概。这些情报，无论卖给北方联盟还是留着自己用，都值钱。","你还注意到：关城北角的粮仓，地基确实与别处不同——新砖，压着旧痕。"],
  3123	      fail:["关城戒备森严，你观察不到太多。只确认了粮仓地基的颜色差异。"],
  3124	      crit:["你观察得更细：入夜后，有一小队人马从关城的侧门出发，往南，消失在夜色里。他们押着车，车上盖着黑布——车辙很深。","'往南。'你想起商栈城地头蛇的话：'整船整船的人，往南送。'"]
  3125	    },effects:{xp:20},onCrit:{flag:"tiemen_south"},go:"east_tiemen_after"}
  3126	  ]
  3127	};
  3128	N["east_tiemen_after"] = {
  3129	  place:"铁门关 · 外围", text:[
  3130	    "你离开铁门关，回头望了一眼那座雄关。",
  3131	    "你手中，已经有了七枚铁牌（或七条线索）。它们像七根线头，全部指向同一个方向：死亡沙漠，深渊神殿，七号封印。",
  3132	    "风从关城方向吹来，带着一丝若有若无的、陈腐的气息。",
  3133	    "你知道，该是去沙漠的时候了。"
  3134	  ],options:[
  3135	    {t:"回承天城再办点事",run:function(){ travelTo("east_chengtian"); }},
  3136	    {t:"在铁门关外围接点活",go:"board_east"}
  3137	  ]
  3138	};
  3139	const EAST_BOARD = [
  3140	  {t:"替承天城的商号送一批丝绸到港口城",check:{a:"CHA",sk:"bargain",label:"押运"},ok:["你押着丝绸，一路平安抵达港口城。收货的掌柜验了货，多给了赏钱。"],fail:["半路遇上官府盘查，你交了'路税'才过关。"],okEff:{gold:20,xp:20,rep:2},failEff:{gold:8,xp:8}},
  3141	  {t:"替钦天监（或其他衙门）送一封公文到城外驿站",check:{a:"AGI",sk:"athletic",label:"送信"},ok:["你脚程快，公文按时送到。驿丞赏了你几个钱：'利索！'"],fail:["路上耽搁了，驿丞脸色不好看。"],okEff:{gold:10,xp:15},failEff:{gold:4,xp:8}},
  3142	  {t:"护送一位老医师到铁门关外（治疗伤兵）",check:{a:"SPR",sk:"will",label:"护送"},ok:["老医师一路给伤兵诊治，你打下手。到地方时，他送你一卷《医理杂记》。"],fail:["路上遇到溃兵，你们绕了远路。"],okEff:{gold:12,xp:20,item:"《医理杂记》"},failEff:{gold:5,xp:10}},
  3143	  {t:"替茶楼掌柜收集前线的情报",check:{a:"INT",sk:"detect",label:"打听"},ok:["你混迹市井，把前线传闻整理成册，卖给茶楼掌柜。他掂了掂，很满意：'有货！'"],fail:["你打听的都是些旧闻，掌柜不太满意。"],okEff:{gold:14,xp:22,rep:1},failEff:{gold:5,xp:10}}
  3144	];
  3145	N["board_east"] = function(){
  3146	  const picks = shuffle(EAST_BOARD).slice(0,3);
  3147	  return {place:"东部王国 · 委托板",text:["东部的活计，规矩多，赏钱也准。你扫了一眼。"],options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_east_done"})).concat([{t:"离开",go:"east_after"}])};
  3148	};
  3149	N["board_east_done"] = {place:"委托板",text:["活计办妥，赏金落袋。"],options:[{t:"再接一单",go:"board_east"},{t:"离开",go:"east_after"}]};
  3150	/*==STORY_ORC==*/
  3151	/*==STORY_EAST==*/
  3152	/*==STORY_CHURCH==*/
  3153	N["south_after_escape"] = {
  3154	  place:"黄金城 · 城南码头 · 对岸", where:"夜",
  3155	  text:[
  3156	    "你浑身湿透地爬上岸，夜风一吹，打了个寒颤。远处，那艘挂白旗的船已经消失在海雾里。",
  3157	    "你蹲在岸边，把今晚的事在脑子里过了一遍：银月商会、暗黑的货舱、周姓账房、竖瞳纹章。",
  3158	    "线头越来越多。但你知道，这条线，已经咬上了钩。",
  3159	    "你拧干衣角的水，走进夜色里。"
  3160	  ],
  3161	  options:[
  3162	    {t:"先回城落脚，理理思路",go:"south_moxie_go"},
  3163	    {t:"去找金秤家族，打听银月商会的底细",go:"south_goldscale"}
  3164	  ]
  3165	};
  3166	/* ================================================================
  3167	   光明教会
  3168	   ================================================================ */
  3169	N["arrive_church_shengcheng"] = function(){
  3170	  const soul = S.job==="灵魂法师";
  3171	  const wanted = S.flags.soul_exposed || S.flags.church_wanted;
  3172	  return {
  3173	    place:"光明教会 · 圣城", where:"途中",
  3174	    text:[
  3175	      "圣城的白墙在日光下亮得刺眼。城市以光明大教堂为中心，街道呈放射状铺开，像一圈圈涟漪。",
  3176	      "城门处，圣痕司的执事们正在盘查入城的朝圣者。队伍很长，但没有人大声喧哗。",
  3177	      "你注意到，执事们查验的不仅是文牒——他们还会用一枚银色的徽章，在入城者的额前晃一晃，观察反应。",
  3178	      wanted ? "你的心跳快了半拍。灵魂法师（或你身上'深渊的气息'），在这座城里，是重罪。" : "你看着那枚银色徽章，隐约觉得，它照见的东西，比你文牒上的字要多。"
  3179	    ],
  3180	    options:[
  3181	      {t:"坦然入城，接受盘查",check:{a:"CHA",sk:"persu",label:"入城"},tier:{
  3182	        ok:["银徽章在你额前晃过，没有异样（或执事没有深究）。执事点头放行：'愿光明护佑你。'你穿过城门，圣城的钟声在头顶响起。"],
  3183	        fail:["银徽章晃过时，你的眉心一阵刺痛。执事多看了你一眼，但没有深究，挥手放行。你快步走进城中，背后那目光，追了你很久。"],
  3184	        crit:["你不但顺利入城，还从执事口中套出话：'最近圣痕司忙得很——净化令，加上'南方来的消息'。'他压低声音：'听说，教宗要亲自主持一场大弥撒。'"],
  3185	        critfail:["银徽章在你额前亮起一道刺眼的白光。执事们的神色骤然冷下来：'这位朝圣者，请随我们走一趟。'你被带进值房盘问了两个时辰，最终因'证据不足'被放行，但你的名字，落在了圣痕司的册子上。"]
  3186	      },onCritFail:{flag:"church_wanted"},go:"church_city"},
  3187	      {t:"绕开正门，从侧门/暗道进城",check:{a:"AGI",sk:"stealth",label:"潜入"},tier:{
  3188	        ok:["你跟着一队朝圣者，从侧门混进圣城。侧门的盘查松得多，你顺利入城。","你回头望了一眼正门的长队，心里默默记下：圣痕司对'灵魂气息'的查验，比传说中更严。"],
  3189	        fail:["侧门也有执事把守。你绕了两圈，还是被拦下，只得回去排队。"],
  3190	        crit:["你在城墙根发现一条排水暗渠，直通城内。你钻进去，摸黑走了半个时辰，从一口枯井里爬出来——正好落在城东的旧书店后巷。","你抬头，看见巷口挂着一块旧招牌：'烛台书店'。"]
  3191	      },onCrit:{flag:"candle_backdoor"},go:"church_candle"}
  3192	    ]
  3193	  };
  3194	};
  3195	N["church_city"] = {
  3196	  place:"光明教会 · 圣城 · 街市", where:"白昼",
  3197	  text:[
  3198	    "圣城的街市干净而安静。白袍的修士、灰袍的执事、穿盔甲的圣骑士，与虔诚的朝圣者擦肩而过。",
  3199	    "你在一家食肆坐下，要了一碗素面。隔壁桌的朝圣者在低声交谈：",
  3200	    "“教宗下月要主持大弥撒，据说要'净化'什么。”",
  3201	    "“圣痕司的大审判长，最近亲自出城好几次。听说，是在追查'异端'。”",
  3202	    "“什么异端？”",
  3203	    "“嘘——听说是，会'看见黑暗'的人。”",
  3204	    "你端着面碗，没有抬头。"
  3205	  ],
  3206	  options:[
  3207	    {t:"去光明大教堂，看看教宗（或大弥撒的准备）",go:"church_cathedral"},
  3208	    {t:"去圣痕司附近，打听'净化令'的动向",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  3209	      ok:["你混在人群中，听出些风声：净化令的清单，已经从'禁书'扩展到了'禁术'——凡是与灵魂、深渊沾边的修炼，都在清查之列。","'听说沙漠那边，圣痕司要派一队人过去。'一个修士压低声音：'说是净化，也有人说是……找东西。'"],
  3210	      fail:["圣痕司附近的人嘴都很严。你什么也没打听到。"],
  3211	      crit:["你从一个老修士口中套出关键信息：'大审判长手里，有一份名单。'他压低声音：'名单上的人，都是'见过黑暗'的。他一个都没抓。'老修士顿了顿：'他在等。等他们自己聚到一起。'","你心头一凛。等他们聚到一起。"]
  3212	    },onCrit:{flag:"judge_waiting"},go:"church_city"},
  3213	    {t:"去城东的'烛台书店'",go:"church_candle"}
  3214	  ]
  3215	};
  3216	N["church_cathedral"] = {
  3217	  place:"光明教会 · 光明大教堂", where:"白昼",
  3218	  text:[
  3219	    "光明大教堂的穹顶高得让人眩晕。彩绘玻璃把日光滤成七彩的光柱，落在肃立的人群身上。",
  3220	    "你站在人群里，远远看见圣坛上方，教宗的身影——他披着金白相间的圣袍，头戴三重冠，声音在穹顶下回荡，像来自天顶。",
  3221	    "他正在宣讲：",
  3222	    "“……黑暗从未离去，它只是学会了伪装。我们须以更纯净的光，照彻人心的每一道褶皱……”",
  3223	    "你听着，心里却想起那七枚铁牌，想起树根下的裂纹，想起沙漠里的低语。",
  3224	    "你身边，一个老妇人虔诚地划着十字。她的眼角，挂着一滴浑浊的泪。"
  3225	  ],
  3226	  options:[
  3227	    {t:"听完弥撒，然后去圣痕司求见大审判长",check:{a:"CHA",sk:"persu",label:"求见"},tier:{
  3228	      ok:["弥撒散场后，你递上名帖，求见大审判长。出乎意料，他同意见你——在圣痕司的偏厅。","大审判长是个瘦削的中年人，眉间有一道深痕。他看着你，第一句话是：'你身上，有黑暗的味道。'","你心头一震。他缓缓补充：'能走到圣城来，说明你没有躲。这很好。'"],
  3229	      fail:["大审判长不见外人。执事客客气气地把你送出门。"],
  3230	      crit:["大审判长不但见了你，还听完了你关于七枚铁牌的讲述。他沉默了很久，缓缓开口：'你说，沙漠里有一座神殿，封印着深渊。'他抬起眼：'我信。'","'因为二十年前，我的老师——上一任大审判长——就是从沙漠回来之后，'变了'。'他顿了顿：'他最终，选择了自我净化。'","你看着他眉间的深痕，忽然明白了什么。"]
  3231	    },onCrit:{flag:"judge_ally"},go:"church_candle"},
  3232	    {t:"不递名帖。只远远地看着，记住这座城",tier:{ok:["你在人群中站了很久。钟声响起时，你看见教宗在圣骑士的簇拥下离去，他的脚步很稳，像每一步都踩在既定的轨道上。","你默默记住这座城的模样。然后，转身离去。"]},go:"church_city"}
  3233	  ]
  3234	};
  3235	N["church_candle"] = {
  3236	  place:"圣城 · 城东 · 烛台书店", where:"白昼",
  3237	  text:[
  3238	    "烛台书店藏在城东一条窄巷里。招牌旧得发黑，门脸只容一人通过。",
  3239	    "你推门进去，风铃响了一声。书店不大，四面墙都是书，光线昏暗，空气里有纸墨与灰尘的气息。",
  3240	    "柜台后，坐着一个戴圆眼镜的老者，正低头补书。他没抬头：",
  3241	    "“要什么书？”",
  3242	    "“本店的书，都'正经'。”他顿了顿，“太正经的，不卖。”",
  3243	    "你听出了弦外之音。"
  3244	  ],
  3245	  options:[
  3246	    {t:"报上'熟人'的名号（伊芙琳/周账房）",check:{a:"CHA",sk:"persu",label:"接头"},tier:{
  3247	      ok:["你低声报出（伊芙琳交给你的信物/周账房的暗语'三十年前，沙漠边缘的骨片'）。老者推了推眼镜，缓缓放下手中的书。","他看你一眼：'……是老朋友介绍来的。'他起身，放下门闩：'进来谈。'","你们进了里间。他掩上门，压低声音：'说吧，什么事。'"],
  3248	      fail:["老者推了推眼镜：'客人，本店不卖'熟人'的书。'他低头继续补书。你碰了个软钉子。"],
  3249	      crit:["你不但报出了名号，还提到了烛台书店与'净化令'的关系。老者沉默片刻，压低声音：'这年头，敢提'净化令'三个字的人不多了。'他给你续了杯茶：'说吧。你想知道什么。'"]
  3250	    },onOk:{flag:"candle_contact"},go:"church_candle2"},
  3251	    {t:"不接头。就在店里翻翻书",check:{a:"INT",sk:"lore",label:"翻书"},tier:{
  3252	      ok:["你翻了一下午书，淘到几本有用的。付钱时，老者多看了你一眼：'书是好书。可惜，这年头，读书的人少了。'"],
  3253	      fail:["书店里的书大多不合用。你空手而归。"],
  3254	      crit:["你在一本旧地理志的夹页里，发现一张手绘地图：圣城—沙漠—深渊神殿的路线，标注得极细。'这是前任掌柜留下的。'老者忽然开口：'他说，总有一天，会有人需要它。'"]
  3255	    },effects:{xp:15},onCrit:{item:"沙漠路线图"},go:"church_city"}
  3256	  ]
  3257	};
  3258	N["church_candle2"] = {
  3259	  place:"圣城 · 烛台书店 · 里间", where:"白昼",
  3260	  text:[
  3261	    "里间比外间更暗。老者在书架的暗格里摸出一个铁盒，打开，里面是一叠信与卷宗。",
  3262	    "“你在追查银月商会？”他问，“我这里，有一些东西，应该对你有用。”",
  3263	    "他抽出其中一封信，递给你：",
  3264	    "“二十年前，银月商会的船第一次挂上'新月旗'。当时没人注意。但有一封从圣城寄往沙漠的信，提到了那面旗。”",
  3265	    "你接过信。信纸泛黄，字迹端正，落款处没有署名，只画着一枚竖瞳。",
  3266	    "“寄信的人，在圣城。”老者说，“具体是谁，我查了二十年，没有头绪。”",
  3267	    "他顿了顿：“但我知道，他每年都会寄一封信。收信人，在沙漠。”"
  3268	  ],
  3269	  options:[
  3270	    {t:"问老者：能不能查到'今年'的那封信",check:{a:"INT",sk:"detect",label:"追查"},tier:{
  3271	      ok:["老者翻出一本账册：'邮驿的留底。'他查到：今年的信，三个月前寄出，收信人写的是'沙漠驿站，转交深渊神殿'。","'深渊神殿。'老者念出这四个字，声音很轻：'他们，连名字都不避讳了。'"],
  3272	      fail:["老者摇摇头：'邮驿的留底，只保留半年。今年的信，查不到收件人。'"],
  3273	      crit:["你顺着邮驿留底，还查到一条关键信息：寄信人每次用的寄件地址，都不同，但字迹出自同一人。老者在旧信堆里翻出三封，你并排比对——字迹一致。","'一个人，换了二十年的地址，往沙漠寄信。'老者说：'要么是逃亡者，要么是——'他顿了顿：'潜伏者。'"]
  3274	    },effects:{xp:20},onCrit:{flag:"desert_letters"},go:"church_after"},
  3275	    {t:"把银月商会的账册交给老者保管",check:{a:"CHA",sk:"persu",label:"托付"},tier:{
  3276	      ok:["你把周账房托付的账册交给老者。他翻了几页，神色凝重：'这是暗蚀会的'金'脉账目。'他合上账册，收进铁盒：'放在我这里，比放在你身上安全。'","'等你从沙漠回来，再来取。'他顿了顿：'如果你能回来。'"],
  3277	      fail:["老者没有立刻收下：'这账册，是烫手的东西。你确定要放我这里？'你犹豫片刻，还是收了回来。"],
  3278	      crit:["老者收下账册，还告诉了你一件事：'暗蚀会分五部：金、刃、眼、骨、智。'他竖起手指：''金'管钱，'刃'管杀，'眼'管看，'骨'管祭，'智'管谋划。'他压低声音：'五部的头，各有一枚竖瞳铁牌。'","你心头一震。你怀里，已经有七枚铁牌了——那些，或许不是'锚'，而是某种更深的记号。"]
  3279	    },effects:{rep:5},onCrit:{flag:"five_departments"},go:"church_after"}
  3280	  ]
  3281	};
  3282	N["church_after"] = {
  3283	  place:"光明教会 · 圣城", text:[
  3284	    "你在圣城盘桓数日，见识了光明的盛大，也看见了光明背后的阴影。",
  3285	    "你站在圣城的城墙边，回望那座白墙之城。钟声在暮色里回荡，像某种恒久的节拍。",
  3286	    "你知道，圣城不是你的终点。你的终点，在更南的地方——那里黄沙漫天，那里有一座漆黑的神殿。",
  3287	    "你摸了摸怀里的铁牌与地图。该动身了。"
  3288	  ],options:[
  3289	    {t:"离开圣城，向死亡沙漠进发",run:function(){ travelTo("desert_bianyuan"); }},
  3290	    {t:"在圣城再盘桓几日，接点活",go:"board_church"}
  3291	  ]
  3292	};
  3293	const CHURCH_BOARD = [
  3294	  {t:"替烛台书店送一包'旧纸'到学术城",check:{a:"CHA",sk:"persu",label:"送书"},ok:["你避开圣痕司的耳目，把'旧纸'安全送到。收货的学者感激不尽。"],fail:["你在关卡被盘问，绕了大半个城才送到。"],okEff:{gold:12,xp:20,rep:2},failEff:{gold:5,xp:8}},
  3295	  {t:"护送一队朝圣者到圣城",check:{a:"STR",sk:"athletic",label:"护送"},ok:["朝圣者们平安抵达圣城。领队的老妇人送你一串念珠：'光明护佑你。'"],fail:["路上遇雨，你们耽搁了半日。"],okEff:{gold:10,xp:15,item:"木念珠"},failEff:{gold:4,xp:8}},
  3296	  {t:"替圣痕司（或教会）跑一趟城外的驿站",check:{a:"AGI",sk:"athletic",label:"跑腿"},ok:["你把公文送到城外驿站。驿丞赏了你几个钱：'利索！'"],fail:["公文太沉，你跑得慢了。"],okEff:{gold:8,xp:12},failEff:{gold:3,xp:6}}
  3297	];
  3298	N["board_church"] = function(){
  3299	  const picks = shuffle(CHURCH_BOARD).slice(0,2);
  3300	  return {place:"圣城 · 委托板",text:["圣城的活计，干净，赏钱也干净。你扫了一眼。"],options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_church_done"})).concat([{t:"离开",go:"church_after"}])};
  3301	};
  3302	N["board_church_done"] = {place:"委托板",text:["活计办妥，赏金落袋。"],options:[{t:"再接一单",go:"board_church"},{t:"离开",go:"church_after"}]};
  3303	/* ================================================================
  3304	   死亡沙漠
  3305	   ================================================================ */
  3306	N["arrive_desert_bianyuan"] = function(){
  3307	  const shell = S.items && S.items.indexOf("磨亮的贝壳")>=0;
  3308	  return {
  3309	    place:"死亡沙漠 · 边缘绿洲", where:"途中",
  3310	    text:[
  3311	      "死亡沙漠的风，是干的，热的，带着一丝说不清的腥味。",
  3312	      "你走了三天，终于在沙丘的阴影里，看见一片小小的绿洲——几棵枯瘦的棕榈，一口浑浊的水井，几顶破旧的帐篷。",
  3313	      "绿洲边缘，插着一根旗杆。旗杆上，挂着一串风干的骨片，在风里互相敲击，发出细碎的声响。",
  3314	      shell ? "你想起韩水手的话。你从怀里摸出那枚磨亮的贝壳，挂上旗杆。贝壳在风里轻轻晃动，像一只眼睛。": "你望着那串骨片，心里莫名发紧。你隐约觉得，这片绿洲，不像看上去那么荒凉。"
  3315	    ],
  3316	    options:[
  3317	      {t:"在绿洲扎营，打听沙漠里的消息",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  3318	        ok:["绿洲的驼队商人告诉你：'沙漠里，最近怪事多。'他压低声音：'往南走三天的路程，有一片'黑沙区'——沙子是黑的，踩上去发烫。没人敢靠近。'","'还有人说，那黑沙区中央，有一座神殿。'他打了个寒颤：'夜里能听见，地底下有声音。'"],
  3319	        fail:["驼队商人警惕地看着你：'打听沙漠的事？你不是去'找死'的吧？'他不再多言。"],
  3320	        crit:["驼队商人告诉你更多：'三个月前，有一支商队进了黑沙区，再没出来。'他顿了顿：'但上个月，有个疯子水手，说他要去找'门'，一个人进了沙漠。'他摇摇头：'那人八成是疯了。'","'疯子水手。'你想起韩水手。也许，他已经先你一步，进了沙漠。"]
  3321	      },onCrit:{flag:"han_ahead"},go:"desert_oasis"},
  3322	      {t:"不进绿洲，直接循着'黑沙区'的方向走",check:{a:"SPR",sk:"survive",label:"跋涉",note:"酷热+深渊气息"},tier:{
  3323	        ok:["你循着商人指的方向，走了两天。沙丘的颜色，渐渐变深，从金黄变成灰褐，最终——黑。","你站在黑沙区的边缘。脚下的沙，是纯黑的，触手发烫。风一吹，黑沙扬起，遮天蔽日，像一道移动的幕布。","你裹紧头巾，走进黑沙区。身后，风把足迹抹平，像要把你从这世上抹去。"],
  3324	        fail:["你在沙漠里迷了路，转了三天，水袋见底。幸好遇到一队驼队，把你捎回绿洲。你捡回一条命，也摸清了黑沙区的方向。"],
  3325	        crit:["你不但找到了黑沙区，还在途中发现一段半埋在沙里的石路——古老的、人工铺设的石路，通向黑沙区深处。","你蹲下，拂开沙，看见石路上刻着字：古代艾尔达文。'第七封印。守望者立。勿启。'","你心头一震。这条路，通往神殿。"],
  3326	        critfail:["你走得太急，在酷热中脱水，昏倒在沙丘上。醒来时，你躺在一顶帐篷里——一个蒙面的沙漠行者救了你。他递给你水，声音沙哑：'年轻人，沙漠不急着吃人。你不用急着喂它。'"]
  3327	      },effects:{xp:25},onCrit:{flag:"stone_road"},onCritFail:{hp:-15},go:"desert_oasis"}
  3328	    ]
  3329	  };
  3330	};
  3331	N["desert_oasis"] = {
  3332	  place:"死亡沙漠 · 绿洲营地", where:"夜",
  3333	  text:[
  3334	    "夜里，绿洲的风停了。篝火噼啪作响，驼队商人围火而坐，低声念着某种祷词。",
  3335	    "你躺在帐篷里，听着风穿过棕榈叶的声音。远处，沙漠深处，有什么东西在轻轻震动——像心跳，又像鼓点。",
  3336	    "你翻身坐起。火堆旁，那个蒙面的沙漠行者正望着南方的夜空。他头也不回，缓缓开口：",
  3337	    "“你听见了？”",
  3338	    "“那是'门'的呼吸。”",
  3339	    "“十年前，它只是偶尔响一声。三年前，它开始'说话'。三个月前——”他顿了顿，“它开始'应和'。”",
  3340	    "“谁在应和它？”你问。",
  3341	    "他没有回答。他指了指南方的夜空：",
  3342	    "“你看。那颗星，今晚特别亮。”",
  3343	    "你顺着他指的方向看去——南方的地平线上，有一颗暗红色的星，悬在黑沙区的上空。像一只睁开的眼睛。"
  3344	  ],
  3345	  options:[
  3346	    {t:"问蒙面行者：你是谁，为什么知道这些",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  3347	      ok:["蒙面行者沉默片刻，拉下兜帽——他有一张被风沙磨得粗粝的脸，年纪看不出来。'我？'他笑了笑：'一个欠了债，走不出去的人。'他顿了顿：'二十年前，我替人送过一封信，送到这座神殿。'他指了指南方：'信送到了，我就走不了了。'","'那封信，收信人还在殿里。'他低声道：'他等了二十年。'"],
  3348	      fail:["蒙面行者摇摇头：'我是谁不重要。重要的是，明天，你要往哪走。'"],
  3349	      crit:["蒙面行者告诉你更多：'送那封信的人，是圣城来的。'他顿了顿：'信上的火漆，是一只竖瞳。'他盯着你：'我后来才明白，那封信，是一封'指示信'。收信人，是神殿里的'先知'。'"]
  3350	    },onCrit:{flag:"prophet_letter"},go:"desert_approach"},
  3351	    {t:"问他：'门'后面是什么",check:{a:"INT",sk:"lore",label:"询问"},tier:{
  3352	      ok:["蒙面行者望着南方的夜空，缓缓说：'没人知道。'他顿了顿：'进去过的人，都没出来。'他压低声音：'但有人说，那门后面，是这个世界'以前'的样子。'","'世界以前的样子？'你重复道。'深渊。'他说：'或者说，被封印之前的，世界。'"],
  3353	      fail:["蒙面行者摇摇头：'有些问题，问出来，就收不回去了。'他不再开口。"],
  3354	      crit:["蒙面行者沉默了很久，说：'我听过最接近真相的说法是——那扇门，不是封印，是'锁'。'他盯着你：'锁住的东西，不是深渊。是'我们自己'。'","'你相信吗？'他问。你没有回答。"]
  3355	    },onCrit:{flag:"door_truth"},go:"desert_approach"}
  3356	  ]
  3357	};
  3358	N["desert_approach"] = {
  3359	  place:"死亡沙漠 · 黑沙区", where:"昼/夜",
  3360	  text:[
  3361	    "第二天清晨，你（与蒙面行者/独自）走进黑沙区。",
  3362	    "黑沙没过脚踝，触手滚烫。风停了，天地间死一般寂静，只有你的脚步踩在沙上的声音。",
  3363	    "走了半天，你看见那座神殿。",
  3364	    "它矗立在一座黑色沙丘上，通体漆黑，像是从沙子里长出来的。石柱、门楣、檐角，都刻着繁复的纹路——七纹竖瞳，到处都是。",
  3365	    "殿门洞开。门内，一片漆黑。",
  3366	    "你站在殿门前，风从门内吹出来，带着一股陈腐的、像被压了千年的气味。",
  3367	    "你听见，门内深处，有什么东西在轻轻震动。"
  3368	  ],
  3369	  options:[
  3370	    {t:"检查神殿外的纹路与石碑",check:{a:"INT",sk:"lore",label:"勘查"},tier:{
  3371	      ok:["你绕殿一周，在殿门两侧发现两行刻字：'守望者立此，镇第七封印。入者，承其责。'字迹古老，是古代艾尔达文。","你在殿门台阶的缝隙里，还发现一枚嵌着的铁牌槽位——形状，与你怀里的铁牌一致。","七枚铁牌，七处节点。这座神殿，就是第七处的'锁眼'。"],
  3372	      fail:["黑沙太深，殿基大半埋在沙里。你什么也没发现。"],
  3373	      crit:["你不但找到了铁牌槽位，还发现殿门的门轴是新换的——材质与殿身不同，是近年的工艺。","'有人进去过。'你心头一沉：'还有人，把门修好了，好让后来的人，能进去。'"]
  3374	    },effects:{xp:20},onCrit:{flag:"door_axis"},go:"desert_inside"},
  3375	    {t:"直接踏入殿门",check:{a:"SPR",sk:"will",label:"踏入",note:"深渊气息浓烈"},tier:{
  3376	      ok:["你深吸一口气，跨入殿门。黑暗吞没你的一瞬间，耳边响起无数重叠的低语声——像千百个人同时说话，又像一个人说了千百句。","你握紧武器，稳住心神。低语声渐渐退去，你的眼睛适应了黑暗。殿内，是一条向下的长阶。"],
  3377	      fail:["你刚跨入门槛，一股浓烈的压迫感扑面而来。你头晕目眩，踉跄退出，扶着殿门喘了很久。"],
  3378	      crit:["你踏入殿门时，那些低语声像潮水一样涌来。你闭上眼，不去听，不去应——低语声渐渐平息。你睁开眼，发现自己站在长阶顶端，而你的身后，殿门已经合上了。","'应和它，就会被吞噬。'你想起蒙面行者的话。你稳了稳呼吸，拾级而下。"],
  3379	      critfail:["你踏入殿门的瞬间，眼前一黑，看见无数景象：燃烧的圣城、黄沙下的白骨、七个发光的位置、一只巨大的竖瞳……你猛地清醒，发现自己跪在殿门前，额头磕在石阶上，渗出血来。","那低语声，在你耳边笑了很久。"]
  3380	    },effects:{xp:25},onCrit:{flag:"door_closed"},onCritFail:{san:-10,hp:-5},go:"desert_inside"}
  3381	  ]
  3382	};
  3383	N["desert_inside"] = {
  3384	  place:"深渊神殿 · 长阶", where:"地底",
  3385	  text:[
  3386	    "长阶向下，通往地底。墙壁上的纹路在黑暗中泛着微光，像无数条血管。",
  3387	    "你数着台阶，一级，一级。空气越来越冷，低语声越来越清晰。",
  3388	    "不知道走了多久，你来到一扇石门前。门上，刻着一幅浮雕：一只竖瞳，被七道锁链钉住。锁链上，各有一个槽位——与你怀里的铁牌，严丝合缝。",
  3389	    "门缝里，透出一线微光。",
  3390	    "门后，有人说话。",
  3391	    "一个声音，平静，缓慢，像在陈述一件与己无关的事：",
  3392	    "“……第七个祭品，已经到了。”",
  3393	    "另一个声音，更年轻，带着一丝颤抖：",
  3394	    "“……先知，门真的要开吗？”",
  3395	    "“门不是要开。是要‘回’。”那个声音说，“它从来都是开着的。我们只是，替它把锁，一道道取下来。”",
  3396	    "你站在门外，手按在石门上。门内，那微光静静亮着。"
  3397	  ],
  3398	  options:[
  3399	    {t:"推门而入，直面'先知'",check:{a:"SPR",sk:"will",label:"直面",note:"最终考验"},tier:{
  3400	      ok:["你推开门。门内是一座巨大的殿堂，中央立着一座漆黑的祭坛，祭坛上，放着一枚乌黑的铁牌——第七枚的槽位，已经插上了一枚。","祭坛旁，站着两个人：一个披着黑袍的老者——先知；一个年轻的祭司，正低着头。","先知缓缓转过身。他有一张普通得不能再普通的脸，像路边任何一个老人。他看着你，微微一笑：'来了。'","'二十年来，你是第一个走到这里的'守望者候选'。'他顿了顿：'其他的，都死在了路上。'"],
  3401	      fail:["你推开门的一瞬间，低语声轰然炸响。你扶着门框，头痛欲裂。先知的声音从殿内传来，平静如常：'还没准备好。先出去，等你准备好了，再来。'","你踉跄退出。身后，石门缓缓合上。"],
  3402	      crit:["你推开门，没有停顿，直接走向祭坛。先知看着你，眼中闪过一丝讶异：'……你不怕？'你回答：'怕。但怕，也得把门关上。'","先知沉默片刻，缓缓笑了：'好。这句话，我二十年没听过了。'"],
  3403	      critfail:["你推开门，看见祭坛的瞬间，那些低语声突然有了形状——它们从四面八方向你涌来，抓住你的四肢，拖着你向祭坛滑去。你挣扎着，抓住门框，指甲崩断。","先知的声音在你耳边响起：'别怕。很快，你就听不见它们了。'"]
  3404	    },effects:{xp:30},onCrit:{flag:"seer_test"},onCritFail:{hp:-20,san:-15},go:"desert_seer"}
  3405	  ]
  3406	};
  3407	N["desert_seer"] = {
  3408	  place:"深渊神殿 · 祭坛殿堂", where:"地底",
  3409	  text:[
  3410	    "你站在祭坛前。先知站在你对面，隔着十步。年轻的祭司退到阴影里，低着头，像一尊雕像。",
  3411	    "先知开口：",
  3412	    "“你手里，有几枚铁牌？”",
  3413	    "你（如实/谨慎地）回答了。",
  3414	    "先知点点头：“七枚铁牌，对应七处节点。你走过的每一处——铁门关、精灵树根、矮人矿道、南方水脉——我都知道。”",
  3415	    "“因为，钉钉子的人，和拔钉子的人，都是我。”",
  3416	    "他微微一笑：“或者说，都是'我们'。”",
  3417	    "“你这一路走来，见过玛门、见过圣痕司、见过精灵女王、见过矮人至高王——你以为你在追查我们。其实，是我们，在等你。”",
  3418	    "“等你走到这一步。”",
  3419	    "“因为第七号祭品，必须自己走到祭坛前。别人抬来的，不算。”",
  3420	    "殿内的低语声，忽然安静下来。整个殿堂，落针可闻。"
  3421	  ],
  3422	  options:[
  3423	    {t:"质问：你为什么要开这扇门",check:{a:"INT",sk:"lore",label:"质问"},tier:{
  3424	      ok:["先知沉默片刻，缓缓说：'因为门后面，是这个世界真正的样子。'他抬起眼：'你以为，这个世界——九大文明、七座城邦、超凡者、大师——是'本来'的吗？'他顿了顿：'不是。是封印撑起来的。'","'封印在，世界在。封印散，世界回。'他低声道：'我只是，想让它回。'"],
  3425	      fail:["先知不答反问：'你不该问为什么。你该问——你自己，为什么走到这里？'"],
  3426	      crit:["先知看着你，忽然说：'你身上，有七枚铁牌的气息。但你没有把它们插进槽位。'他顿了顿：'你这一路，拔了钉子，却没有开锁。'他微微一笑：'你不是祭品。你是……锁匠。'"]
  3427	    },effects:{xp:25},onCrit:{flag:"locksmith"},go:"desert_choice"},
  3428	    {t:"不与他多言，直接拔下祭坛上的铁牌",check:{a:"AGI",sk:"martial",label:"夺牌",note:"生死一瞬"},tier:{
  3429	      ok:["你身形暴起，扑向祭坛。先知没有阻拦——他只是站在那里，看着你。你一把抓住祭坛上的铁牌，用力一拔——","铁牌纹丝不动。你低头，看见铁牌与祭坛之间，缠着一缕缕黑色的丝线，像活物一样，缠住了你的手指。","'你拔不掉的。'先知的声音在你身后响起：'它已经'长'进祭坛了。'"],
  3430	      fail:["你刚靠近祭坛，就被一股无形的力量弹开，摔在地上。先知叹了口气：'急什么。门，又不急着开。'"],
  3431	      crit:["你出手极快，在先知话音未落时，已经握住了铁牌。你感觉到那些黑色丝线在收紧——你猛地一扯，指尖渗血，铁牌被你硬生生拔了出来。","先知脸上的笑容，第一次消失了。他盯着你手中的铁牌，缓缓说：'……你比我想的，更难缠。'"],
  3432	      critfail:["你扑向祭坛的瞬间，那些黑色丝线猛地缠住你的手腕，一股冰冷的力量顺着丝线涌入你的身体。你眼前一黑，恍惚听见先知说：'别急。第七个祭品，你很快就会习惯的。'"]
  3433	    },effects:{xp:25},onCrit:{item:"祭坛铁牌"},onCritFail:{hp:-20,san:-15,flag:"seized"},go:"desert_choice"}
  3434	  ]
  3435	};
  3436	N["desert_choice"] = {
  3437	  place:"深渊神殿 · 祭坛殿堂", where:"地底",
  3438	  text:[
  3439	    "殿堂里的低语声，又响了起来。这一次，更近，更清晰，像贴在你的耳边。",
  3440	    "先知望着你，缓缓举起手。他的掌心，一道黑色的纹路正缓缓亮起：",
  3441	    "“你已经走到这里了。往前走一步，门开，世界归位。往回走一步——”他顿了顿，“你永远不知道自己错过了什么。”",
  3442	    "“你的选择，是什么？”",
  3443	    "殿外的风，忽然停了。整个神殿，陷入一种奇异的寂静。",
  3444	    "你的手，按在（怀里七枚铁牌/腰间武器/胸口的伤疤）上。"
  3445	  ],
  3446	  options:[
  3447	    {t:"【坚守】拼尽全力，毁掉祭坛，阻止门开",check:{a:"SPR",sk:"will",label:"封印",note:"终极判定",mods:{}},tier:{
  3448	      ok:["你把七枚铁牌（或你收集的）掷向祭坛的七道锁链槽位——锁链猛然绷紧，发出刺耳的摩擦声。先知脸色一变：'你……！'","你没有停。你咬破指尖，以血为引，把体内（超凡之力/灵魂/生命）灌入铁牌。锁链一条条收紧，门缝里的微光，开始黯淡。","先知扑上来，被你的力量弹开。他嘶吼着：'你关不上的！门已经开了三百年！'","'那就再关三百年。'你说。","祭坛轰然碎裂。门缝里的光，彻底熄灭。低语声，像潮水一样退去。","你瘫倒在地，眼前发黑。隐约听见，先知的声音，在很远的地方响起：'……你关上了门。但门，从来不止一扇。'"],
  3449	      fail:["你拼尽全力，但封印的力量远超你的境界。祭坛纹丝不动，门缝里的微光，反而更亮了。先知叹了口气：'你尽力了。但——'他顿了顿：'时间，不站在你这边。'"],
  3450	      crit:["你不但毁掉了祭坛，还在最后一刻，看清了先知的真面目——他脸上的伪装剥落，露出一张你见过的脸（奥利弗·深思/某个熟悉的面容）。你心头剧震。","你手中的铁牌，第七枚，牢牢插进锁链的最后一环。门，轰然闭合。","你跪倒在地，听着门内的低语声渐渐远去。你赢了——至少，这一次。"]
  3451	    },effects:{xp:40},onOk:{flag:"seal_success"},onCrit:{flag:"seal_great"},onCritFail:{hp:-15},go:"desert_aftermath"},
  3452	    {t:"【坠落】接受'门后是世界本相'，走上前去",check:{a:"SPR",sk:"will",label:"抉择",note:"与低语对抗"},tier:{
  3453	      ok:["你站在原地，听着低语声，一遍遍重复着'门后是世界本相'。你闭上眼，再睁开——你走上前，把手按在祭坛上。","铁牌在你掌下嗡鸣。先知看着你，缓缓点头：'好。'","你闭上眼。低语声，忽然变得温和起来，像一只大手，轻轻抚过你的头顶。"],
  3454	      fail:["你走上前，却在最后一步停住。你的手，悬在祭坛上方，迟迟没有落下。先知叹了口气：'……还差一点。'"],
  3455	      crit:["你走上前，但没有按上祭坛。你看着先知，缓缓说：'你说，门后是世界本相。'你顿了顿：'可你自己，也没进去过。'","先知的表情，第一次出现裂痕。","'你凭什么，替所有人开门？'你问。","他没有回答。你转身，大步走出殿堂。"],
  3456	      critfail:["你走上前，把手按在祭坛上。铁牌嗡鸣，黑色丝线缠上你的手腕——你没有挣开。低语声，在你脑中轰然炸响。","先知的声音，从很远的地方传来：'第七个祭品，欢迎回家。'"]
  3457	    },effects:{xp:30},onOk:{flag:"fell"},onCrit:{flag:"refused_fell"},onCritFail:{hp:-20,san:-20,flag:"seized"},go:"desert_aftermath"}
  3458	  ]
  3459	};
  3460	N["desert_aftermath"] = {
  3461	  place:"深渊神殿 · 殿外", where:"黎明",
  3462	  text:[
  3463	    "你从神殿里走出来时，天边正泛起一线鱼肚白。",
  3464	    "黑沙区上空的暗红色星，已经淡了。风重新吹起来，带着清晨的凉意。",
  3465	    "你回头，那座漆黑的神殿，静静矗立在沙丘上，殿门半掩。",
  3466	    "（你封印了它/你留下了印记/你带着疑问离开了它）",
  3467	    "你站在黑沙区的边缘，望着远方。草原的战鼓、圣城的钟声、帝京的宫墙、黄金城的算盘声——整个世界，还在按它自己的节拍运转。",
  3468	    "你做的这一切，也许改变了什么，也许什么也没改变。",
  3469	    "但你知道了：这个世界的底牌，并不像它看上去的那样。",
  3470	    "你摸了摸怀里（七枚铁牌/伤痕/信物），转身，向有人的方向走去。"
  3471	  ],
  3472	  options:[
  3473	    {t:"回到文明世界，继续你的路",run:function(){ S.desert_done=true; S.flags.desert_visited=true; togglePanel("map"); }},
  3474	    {t:"【结束旅程】在此刻，回顾你走过的路",go:"ending_choose"}
  3475	  ]
  3476	};
  3477	/*==STORY_DESERT==*/
  3478	/* ================================================================
  3479	   旅行随机事件池（3号：随机事件 · 六档判定）
  3480	   ================================================================ */
  3481	const TRAVEL_EVENTS = [
  3482	  {cn:"拦路劫匪",base:55,ok:"道旁树影里扑出一伙人，钢刀映着日光。你反手应敌，刀光交错，你来我往。匪首见讨不了好，啐了一口，带着残部退进林子里。你摸了摸身上——分毫未少。",effOk:{xp:15,gold:8},
  3483	   fail:"匪徒们合围过来。你边打边退，杀出一条血路，腰侧却挨了一记闷棍，钱袋也被刮走一角。",effFail:{hp:-10,gold:-12}},
  3484	  {cn:"流民潮",base:50,ok:"一支逃难队伍拖在官道上，老人孩子灰扑扑的。你把干粮分出去一半。一个老妇人攥着你的手，眼泪混着灰土流下来。",effOk:{karma:3,rep:1},
  3485	   fail:"流民们围上来讨食。你推开人群挤过去，身后传来失望的叹息。你低着头，走得很快。",effFail:{karma:-2}},
  3486	  {cn:"商队同路",base:60,ok:"一支商队愿意与你同行。领队的中年人话多，一路说着各地的行情与传闻——顺路，你也听到了不少有用的消息。",effOk:{xp:12,rep:1},
  3487	   fail:"商队走得慢，你等不得，先行一步。错过了一段路，也错过了一些话。",effFail:{}},
  3488	  {cn:"骤雨泥泞",base:50,ok:"暴雨来得快去得也快。你寻了处岩壁避雨，等雨停继续上路，脚步轻快。",effOk:{fatigue:-1},
  3489	   fail:"暴雨浇透了行囊，道路变成泥沼。你深一脚浅一脚地走，鞋底沾满泥，一天的路走了两天。",effFail:{fatigue:2,hp:-4}},
  3490	  {cn:"古代遗迹",base:45,ok:"道旁塌了半截的石墙，看得出是古文明的手笔。你翻找了片刻，在碎石堆里摸出一点合用的材料。",effOk:{mat:function(){const j=JOBS[S.job];return j.mats[S.realm>0?Math.min(2,S.realm):0];}},
  3491	   fail:"遗迹早就被前人翻遍了。你只带回一身灰。",effFail:{}},
  3492	  {cn:"野兽袭击",base:55,ok:"一头饿狼（或沙地蜥蜴/山熊）拦在道上。你与它对峙，瞅准破绽一击命中。它呜咽着退走，你也加快了脚步。",effOk:{xp:15},
  3493	   fail:"那畜生的速度快得离谱。你仓促应战，胳膊上添了一道血口，才把它赶走。",effFail:{hp:-12}},
  3494	  {cn:"诡雾缠行",base:40,ok:"一团灰雾忽然漫过道路。你屏住呼吸，握紧武器，快步穿过。雾里没有东西——或者说，雾里那东西，没有拦你。你走出雾区，后颈全是冷汗。",effOk:{san:-4,xp:15},
  3495	   fail:"雾里有什么东西碰了你一下。不是风，不是枝条。你冲出雾区，胸口发闷，耳朵里嗡嗡响了很久。",effFail:{san:-8,hp:-6}},
  3496	  {cn:"同路旅人",base:60,ok:"一个蒙着斗篷的旅人跟你同行了一段路。他话不多，临别时丢下一句：'前面那座城，别在夜里靠近码头。'你还没问，他已经拐进岔路不见了。",effOk:{xp:20,flag:"stranger_hint"},
  3497	   fail:"那旅人沉默寡言，你俩各走各的。",effFail:{}},
  3498	  {cn:"驿站消息",base:55,ok:"驿站的茶棚里，来往客商议论纷纷。你听了一耳朵，对天下大势的了解又深了几分。",effOk:{xp:12,gold:-2},
  3499	   fail:"茶棚里都是些旧闻。你付了茶钱，继续赶路。",effFail:{gold:-2}},
  3500	  {cn:"林中迷途",base:50,ok:"岔路太多，你走岔了一段，又绕了回来。虽然多耗了点脚力，倒也没误事。",effOk:{fatigue:1},
  3501	   fail:"你在荒野里转了整整一天，才找回官道。人困马乏，狼狈不堪。",effFail:{fatigue:3,hp:-5}},
  3502	  {cn:"水道路劫",base:50,ok:"水路上飘来几条小船，船上的汉子亮了亮兵刃。你横刀而立，气势不让。他们掂量了一下，掉头走了。",effOk:{gold:12,xp:12},
  3503	   fail:"河道狭窄，避无可避。你交了过路钱，才被放行。",effFail:{gold:-18}},
  3504	  {cn:"风沙酷热",base:50,ok:"风沙裹着热浪扑来。你用头巾遮住口鼻，压低身子，硬生生挨了过去。",effOk:{fatigue:1},
  3505	   fail:"酷热让你头昏眼花。你不得不停下歇了半日，才缓过劲来。",effFail:{hp:-8}},
  3506	  {cn:"战场遗骸",base:45,ok:"路边的荒草里卧着一具遗骸，铠甲已经锈烂。你替他合上眼，从他怀里摸出一枚护符——有些年头了。你把它收好。",effOk:{gold:10,karma:-2},
  3507	   fail:"你从遗骸边走过，没有停留。风卷过荒草，沙沙作响，像在说什么。",effFail:{san:-4}},
  3508	  {cn:"好心的车夫",base:60,ok:"一个赶车的老车夫捎了你一程。他说他年轻时候也走江湖，如今只图个平安。分别时，他塞给你一个干粮包。",effOk:{fatigue:-2,gold:2},
  3509	   fail:"老车夫赶着空车，看了看你的脚程，摇了摇头：'路还远。'他没有停。",effFail:{}}
  3510	];
  3511	
  3512	/* ================================================================
  3513	   境界里程碑叙事（30号·47号 · 职业专属称号/仪式/锚点/作品）
  3514	   ================================================================ */
  3515	N["realm_4"] = function(){
  3516	  const j = JOBS[S.job];
  3517	  return {place:"境界里程碑 · 宗师",where:"修炼之地",
  3518	    text:[
  3519	      "破境后的第三日，你才敢正视自己的变化。",
  3520	      "感官像被重新打磨过：风里有三百种气味，地下有百步之外的脚步声。你握拳，掌心的力量沉稳如山，不再外溢。",
  3521	      "**宗师。**"+j.titles[4]+"。这个名字，放在大陆任何一座城，都有人买账。",
  3522	      "你想起设定这个境界的古老规矩："+j.criterion+"。此刻再读，句句都是骨头。",
  3523	      "夜里，你盘坐时听见体内有什么东西在轻轻回响——那是业力在记账。从此往后，一举一动，都有分量。"
  3524	    ],
  3525	    options:[
  3526	      {t:"回到落脚地，继续旅程",go:"arrive_generic"},
  3527	      {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }}
  3528	    ]};
  3529	};
  3530	N["realm_5"] = function(){
  3531	  const j = JOBS[S.job];
  3532	  return {place:"境界里程碑 · 大宗师",where:"修炼之地",
  3533	    text:[
  3534	      "大宗师。这个境界在大陆上，是有数的。",
  3535	      j.workDesc ? "你开始能隐约感觉到那件属于你的"+j.workDesc+"的轮廓——它还缺材料，缺火候，缺一次真正意义上的'印证'。" : "你开始能感觉到，某种'名字'在远处等你——那是一件与你性命相连的作品，还缺最后一块拼图。",
  3536	      "你翻开典籍，上面写着这个境界的锚点之法。"+j.anchor+"。你试着在心里描摹它的形状，却发现它需要你亲自去走过、经历过，才能'立'住。",
  3537	      (S.job==="thief") ? "你是盗贼。你比任何人都清楚：大宗师，已是这一行的巅峰。再往上，没有路——或者说，那条路，从来没有人走通过。" : "你隐约听说，大陆上这个境界的人，不过几十。每一个名字，都像一枚钉子，钉在大陆的记忆里。",
  3538	      "高处不胜寒。但高处，也确实看得远。"
  3539	    ],
  3540	    options:[
  3541	      {t:"回到落脚地，继续旅程",go:"arrive_generic"},
  3542	      {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }}
  3543	    ]};
  3544	};
  3545	N["realm_6"] = function(){
  3546	  const j = JOBS[S.job];
  3547	  return {place:"境界里程碑 · 传奇",where:"修炼之地",
  3548	    text:[
  3549	      "传奇。二十到二十五人之间，大陆才有这个境界的位置。",
  3550	      "你破境的消息，恐怕已经有人传出去了。吟游诗人的歌谣里，开始出现你的名字——虽然还只是一个模糊的影子。",
  3551	      "你知道，这一境，争的是'作品'。",
  3552	      j.workDesc ? "你的"+j.workDesc+"，已经在你心里有了完整的形状。它需要的，是材料、是契机、是把你走过的路都熔进炉火。" : "属于你的传奇作品，正等着被铸造。",
  3553	      "你想起那些传说：贤者之石、武神之心、贤者之魂……每一件作品背后，都是一条命，一段路，一次生死。",
  3554	      "你摸了摸胸口的旧疤。你的那件作品，会以什么为代价？"
  3555	    ],
  3556	    options:[
  3557	      {t:"回到落脚地，继续旅程",go:"arrive_generic"},
  3558	      {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }}
  3559	    ]};
  3560	};
  3561	N["realm_7"] = function(){
  3562	  const j = JOBS[S.job];
  3563	  return {place:"境界里程碑 · 半神",where:"修炼之地",
  3564	    text:[
  3565	      "半神。整个大陆，只有八到九个位置。",
  3566	      "破境的那一刻，你隐约看见了高处的景象：星辉学院的院长、那位镇压深渊的晨曦、北方那位传奇战神——他们的'光'，在极远处亮着，像星辰。",
  3567	      "你终于明白，为什么这个境界叫'半神'：你已经碰触到了法则的衣角，但你还穿着人的靴子。",
  3568	      (S.job==="thief") ? "盗贼的半神，传说中几乎不存在。你站在这里，本身就是一件离经叛道的事。前无古人，后，恐怕也难有来者。" : "你听见传说：半神争位，一怒而山河变色。你走到这里，脚下的路，已经不能回头。",
  3569	      "高处的位置，每一个都有人坐着。你若要坐上去——就得先让某个人，站起来。"
  3570	    ],
  3571	    options:[
  3572	      {t:"回到落脚地，继续旅程",go:"arrive_generic"},
  3573	      {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }}
  3574	    ]};
  3575	};
  3576	N["realm_8"] = function(){
  3577	  const j = JOBS[S.job];
  3578	  return {place:"境界里程碑 · 神话",where:"修炼之地",
  3579	    text:[
  3580	      "神话。",
  3581	      "这个境界的名字，已经不像境界，像一种审判。",
  3582	      "你破境的那一刻，天地安静了一瞬——然后，你听见了。",
  3583	      "大陆上所有封印节点的'声音'：铁门关地下的门、世界树的根、矮人的矿道、沙漠的神殿——它们在同一刻，安静下来。",
  3584	      "像是整片大陆，都在看你。",
  3585	      "你站在修炼之地，低头看自己的手。掌纹里的光，已经不再流动——它已经凝固成某种亘古不变的东西。",
  3586	      "从这一刻起，你不再是'超凡者'。你是一种法则。",
  3587	      "你知道，深渊的那道门，正在等你。"
  3588	    ],
  3589	    options:[
  3590	      {t:"回到落脚地，继续旅程",go:"arrive_generic"},
  3591	      {t:"打开地图，规划下一站",run:function(){ togglePanel("map"); }}
  3592	    ]};
  3593	};
  3594	
  3595	/* ================================================================
  3596	   世界事件落地剧情（52号五级体系 · 抵达时触发）
  3597	   ================================================================ */
  3598	N["world_purge"] = function(){ return {
  3599	  place:"天下大势 · 净化令",where:"圣痕司公告栏前",
  3600	  text:[
  3601	    "你进城时，正撞上圣痕司的执事们贴告示。",
  3602	    "告示上的字，墨迹还新：'净化令扩至全域。凡奥术、灵魂、归墟之学，一律查缴。窝藏者，同罪。'",
  3603	    "围观的人群鸦雀无声。一个妇人把怀里的书册往衣襟里藏了藏，指尖发白。",
  3604	    "你注意到，执事们手里多了一样东西：一枚银色的徽章，会往人脸上照。被照到的人，有的安然无恙，有的脸色骤变，被悄无声息地请走了。",
  3605	    (S.job==="灵魂法师") ? "你的心沉下去。灵魂法师，是这纸告示上点名要抓的头一等。你低头，混进人群，压了压帽檐。这座城的执事，已经比上次多了三倍。" : "你低头看了看自己的手。你身上的'气息'，经不经得起那枚银徽章一照？"
  3606	  ],
  3607	  options:[
  3608	    {t:"暂避锋芒，先落脚",check:{a:"CHA",sk:"stealth",label:"避风头"},tier:{
  3609	      ok:["你压着帽檐，绕开执事的视线，从侧街溜进一家客栈。掌柜收了钱，眼皮都没抬：'住几天？'你报了个假名。","这年头，假名比真名好使。"],
  3610	      fail:["你刚要溜，一个执事的目光扫过来。你僵在原地，直到他移开视线，才慢慢挪进人群。后背已经湿了一片。"],
  3611	      crit:["你不但避开了执事，还从一个跑腿的小伙计嘴里套到话：'圣痕司的大审判长，出城去了。'他压低声音：'去的是南方。'","南方。你想起学术城，想起那些'禁书'。"]
  3612	    },go:"world_continue"},
  3613	    {t:"凑近看看，那枚银徽章到底照什么",check:{a:"INT",sk:"detect",label:"观察"},tier:{
  3614	      ok:["你混在人群里观察：银徽章照过普通人，无波无澜；照过一两个脸色发白的人，执事们便不动声色地'请'人。你注意到，那徽章对'身上有深渊气息'的人，反应最烈。","你把这件事记在心里。"],
  3615	      fail:["你刚凑近，就被执事不耐烦地驱赶：'走开走开，别挡道！'"],
  3616	      crit:["你观察得更细：银徽章照过你时，你刻意收敛气息，它只闪了一下，执事没有深究。你顺势退开——但你也看清了：徽章背面，刻着一行小字。","'以光为界，照见归墟。'"]
  3617	    },go:"world_continue"}
  3618	  ]
  3619	  };
  3620	};
  3621	N["world_silver"] = {
  3622	  place:"天下大势 · 银穗商路危机",where:"粮市",
  3623	  text:[
  3624	    "城里的粮市，今天反常地安静。",
  3625	    "粮价牌上的数字，比上个月涨了三成。掌柜们守在粮垛前，一斗都不肯多卖。",
  3626	    "你打听之下才知道：东部王国提高了银穗商路的税收，铁门关方向战云密布，北方的麦子运不过来，南方的粮商趁机囤积居奇。",
  3627	    "一个老农蹲在粮铺门口，看着粮价牌，浑浊的眼睛里满是茫然。他身后，一个孩子扯着他的衣角，小声说：'爹，我饿。'",
  3628	    "你摸了摸钱袋。这世道，金币也在缩水。"
  3629	  ],
  3630	  options:[
  3631	    {t:"买些干粮囤着（防患未然）",check:{a:"CHA",sk:"bargain",label:"购粮"},tier:{
  3632	      ok:["你凭着嘴皮子，从囤粮的商贩手里抠出两袋平价粮。商贩肉痛地摆手：'行行行，拿走拿走，算你狠！'","粮价一天一个样，这两袋粮，也许能救急。"],
  3633	      fail:["粮价被商贩们咬得死死的。你多花了些钱，才买到一袋。"],
  3634	      crit:["你不但买到平价粮，还从商贩嘴里套出话：'银穗商路？那路啊，东边那位太子爷一句话的事。'他压低声音：'听说，是他让的。'","让的。谁让的？你默默记下。"],
  3635	      critfail:["你的讨价还价惹恼了商贩。他直接报了个天价，把你赶走了。"]
  3636	    },effects:{gold:-8,item:"干粮包"},go:"world_continue"},
  3637	    {t:"不囤粮。打听战局动向",check:{a:"INT",sk:"detect",label:"打听"},tier:{
  3638	      ok:["你多方打听，拼出前线的情报：铁门关失守后，东军并未深进，而是稳扎营寨。北方联盟的援军，正在集结。","战局僵持。僵持，意味着还会有变数。"],
  3639	      fail:["市井传言真假难辨。你听到的，都是些夸大的说法。"],
  3640	      crit:["你从一个贩夫口中套到关键一句：'东军的粮，不走银穗商路。'他压低声音：'他们的粮，从南边来。'","南边。又是南边。"]
  3641	    },go:"world_continue"}
  3642	  ]
  3643	};
  3644	N["world_seal"] = {
  3645	  place:"天下大势 · 深渊封印松动",where:"占星台外",
  3646	  text:[
  3647	    "城里新立了一座占星台。台前围满了人，都仰着头，看台上那位白袍占星师。",
  3648	    "他举着星盘，声音在风中发颤：",
  3649	    "“诸星偏移，地脉异动。有古老之物，正在苏醒。”",
  3650	    "“占星所得——第七封印，已在梦中哭泣。”",
  3651	    "人群骚动起来。有人信，有人骂，有人低头默默划着十字。",
  3652	    "你站在人群里，指尖发凉。你比他们更清楚，那'哭泣'的封印，是什么。"
  3653	  ],
  3654	  options:[
  3655	    {t:"上前细问占星师：封印在哪",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
  3656	      ok:["占星师压低声音：'方位在极南。'他顿了顿：'黄沙之下。'他看你一眼：'你身上，有'听过它哭'的气息。'","你心头一凛。他没有再多说，转身收拾星盘。人群散去，占星台上只剩风。"],
  3657	      fail:["占星师摇摇头：'天机不可尽泄。'他不再理会你。"],
  3658	      crit:["占星师悄悄递给你一张羊皮：'这是我三年来记下的星图。'他压低声音：'七处封印，同气连枝。你若真要往南——'他顿了顿：'带着它。'","你收好羊皮。上面标注的方位，与你收集的线索，严丝合缝。"]
  3659	    },onCrit:{item:"占星图"},go:"world_continue"},
  3660	    {t:"不信。离开人群",tier:{ok:["你转身离开。身后，占星师还在高声说着什么，声音被风扯碎。","但你知道，他说的是真的。你只是，还没准备好承认。"]},go:"world_continue"}
  3661	  ]
  3662	};
  3663	N["world_academy"] = {
  3664	  place:"天下大势 · 学院暗流",where:"酒馆",
  3665	  text:[
  3666	    "酒馆角落，一个戴着学者帽的旅人喝得酩酊，正对同桌的人絮叨：",
  3667	    "“……艾尔达学院，已经变了味道。”",
  3668	    "“访问学者？呵呵，一半是探子，一半是——别的什么。”他比划了个手势，“深夜的禁书区，有人点灯。点的是血灯。”",
  3669	    "同桌的人脸色发白，纷纷起身离开。旅人趴在桌上，还在嘟囔：",
  3670	    "“学院的风向变了……变了……”",
  3671	    "你坐在邻桌，端着酒杯，没有动。你想起了艾尔达学院，想起那间深夜的禁书区，想起那滴血。"
  3672	  ],
  3673	  options:[
  3674	    {t:"过去细问：'血灯'是什么",check:{a:"CHA",sk:"persu",label:"套话"},tier:{
  3675	      ok:["你坐过去，替他付了酒钱。旅人来了精神，压低声音：'那血灯，点的是活人的血。'他打了个寒颤：'我在学院借住那半年，亲眼见过三次。'他盯着你：'点灯的，是个年轻的访问学者——姓奥。'","姓奥。你心头一跳。奥利弗·深思。"],
  3676	      fail:["旅人醉得太厉害，话都说不利索了。你只听清了'禁书区'三个字。"],
  3677	      crit:["你不但问清了'血灯'，还从他口中得知：'那个姓奥的学者，前阵子被圣痕司请去问话，后来又放了。'他压低声音：'放他出来的，是学院的一位老教授。'","'放出来之后，姓奥的就消失了。有人说他去了南方，有人说他去了沙漠。'"]
  3678	    },onCrit:{flag:"oliver_gone"},go:"world_continue"},
  3679	    {t:"不多问。这消息，记下便是",tier:{ok:["你喝完杯中酒，起身离开。","姓奥的学者去了南方，或去了沙漠。这条线，迟早会用上。"]},go:"world_continue"}
  3680	  ]
  3681	};
  3682	N["world_orc"] = {
  3683	  place:"天下大势 · 兽人南下",where:"城门口",
  3684	  text:[
  3685	    "你进城时，城门边围着一群人，正看告示。",
  3686	    "告示上的字，墨迹淋漓：'北境急报：黑石大汗整合半数部族，狼旗南指。北境烽火已燃。'",
  3687	    "人群议论纷纷：",
  3688	    "“兽人真的要南下了？”",
  3689	    "“不是传说草原上'神谕'令他们统一吗？”",
  3690	    "“神谕？我看是人的谕令。”",
  3691	    "你站在人群里，想起草原上那些黑袍萨满，想起大汗帐中那柄出鞘一半的弯刀，想起大萨满浑浊的眼睛。",
  3692	    "你比他们更清楚：这把刀，不是兽人自己要拔的。"
  3693	  ],
  3694	  options:[
  3695	    {t:"打听北境战况，判断局势",check:{a:"INT",sk:"detect",label:"打听"},tier:{
  3696	      ok:["你多方打听，拼出局势：黑石部族的狼旗已推进到北境城外围。北方联盟调兵北援，腹地空虚。","而更让你在意的，是另一条消息：兽人军中，有'南方口音'的顾问随行。"],
  3697	      fail:["市井消息混杂，你听不出真假。"],
  3698	      crit:["你从一个北撤的商人嘴里套到关键信息：'那些南方顾问，不骑马，坐车。车帘压得死死的。'他压低声音：'有车夫说，车上拉的不是人，是'东西'。'","'东西'。你想起银月商会那些盖黑布的货车。"]
  3699	    },go:"world_continue"},
  3700	    {t:"去北方，亲眼看看",run:function(){ travelTo("north_beijing"); }}
  3701	  ]
  3702	};
  3703	N["world_continue"] = {
  3704	  place:"落脚地",text:["你把天下大势在心头过了一遍，又把它压回心底。","乱世里，先顾眼前的路。"] ,
  3705	  options:[
  3706	    {t:"继续原计划",run:function(){ curNode = S.afterWorld||"arrive_generic"; writeNext(); }},
  3707	    {t:"打开地图，重新规划",run:function(){ togglePanel("map"); }}
  3708	  ]
  3709	};
  3710	
  3711	/* ================================================================
  3712	   自由城邦 · 各城到达节点
  3713	   ================================================================ */
  3714	N["arrive_free_jiaohui"] = {
  3715	  place:"自由城邦 · 交汇城",where:"白日",
  3716	  text:[
  3717	    "回到交汇城，你还认得那些招牌：跛脚酒桶、默页书肆、联合冒险者公会。",
  3718	    "城还是那座城。只是你再看它时，眼里多了些东西——你看得出哪艘船的吃水太深，看得出哪个摊贩在替人盯梢。",
  3719	    "广场中央的布告栏换了新告示。圣痕司的、北方联盟的、银月商会的，一层压着一层。",
  3720	    "你站在人潮里，忽然觉得，这座城比三个月前，安静了一些。"
  3721	  ],
  3722	  options:[
  3723	    {t:"去跛脚酒桶坐坐",go:"fc_tavern"},
  3724	    {t:"去冒险者公会看看有什么活",go:"fc_guild"},
  3725	    {t:"找个落脚处休息",go:"act_rest"}
  3726	  ]
  3727	};
  3728	N["arrive_free_jishi"] = {
  3729	  place:"自由城邦 · 集市城",where:"白昼",
  3730	  text:[
  3731	    "集市城没有城墙，只有一排排参差的棚屋与摊位。白昼，这里是货物的海洋；入夜，这里是另一片海洋——更深，更暗。",
  3732	    "你走进集市，耳边全是吆喝声。一个卖旧书的摊主拉住你：'客官，北边来的书，看看？'你瞥了一眼书名——《深渊考》。",
  3733	    "你摇摇头，继续往前走。身后，摊主的声音追上来：'不识货！这年头，敢看这书的人可不多了！'"
  3734	  ],
  3735	  options:[
  3736	    {t:"在集市里逛逛",go:"act_rest"},
  3737	    {t:"去冒险者公会看看活计",go:"fc_guild"}
  3738	  ]
  3739	};
  3740	N["arrive_free_gonghui"] = {
  3741	  place:"自由城邦 · 冒险者之城",where:"白昼",
  3742	  text:[
  3743	    "冒险者之城是公会的心脏。酒馆、铁匠铺、委托板，围着公会大厅挤成一圈。",
  3744	    "你推开公会大厅的门，迎面是一面巨大的委托板，纸片贴了三层。一个扎着马尾的姑娘正在誊抄新委托，头也不抬：",
  3745	    "“新来的？左边接单，右边交任务，中间找会长。”",
  3746	    "“会长今天在。不过，他心情不太好——东边又黄了一单。”"
  3747	  ],
  3748	  options:[
  3749	    {t:"去找会长霍根聊聊",go:"fc_guild"},
  3750	    {t:"看看委托板",go:"board_free"}
  3751	  ]
  3752	};
  3753	N["arrive_free_huigang"] = {
  3754	  place:"自由城邦 · 灰港",where:"晨/昏",
  3755	  text:[
  3756	    "灰港的雾，似乎永远散不尽。你沿着石板路走到码头，桅杆在雾里起起伏伏，像一片沉默的森林。",
  3757	    "那艘挂着银月纹章的商船，还泊在老位置。搬运工们正在卸货——木箱沉得很。你远远看着，没有靠近。",
  3758	    "码头的税吏换了新人。他看了你一眼，又移开目光。这年头，多一事不如少一事。"
  3759	  ],
  3760	  options:[
  3761	    {t:"在码头边走走，看船来船往",go:"act_rest"},
  3762	    {t:"去交汇城办正事",run:function(){ travelTo("free_jiaohui"); }}
  3763	  ]
  3764	};
  3765	/* 精灵/兽人/沙漠的次级城市到达（简短叙事兜底） */
  3766	N["arrive_orc_shengshan"] = {
  3767	  place:"兽人草原 · 兽人圣山",where:"白昼",
  3768	  text:[
  3769	    "圣山孤零零地矗立在草原深处。山腰的祖灵洞，燃着长明火。",
  3770	    "你沿着山路走到洞口，看见大萨满佝偻的身影坐在火堆旁。他没有抬头，像早就知道你会来：",
  3771	    "“人类。祖灵说，你今天会来。”",
  3772	    "“祖灵还说了什么？”你问。",
  3773	    "“它说——门，快开了。”"
  3774	  ],
  3775	  options:[
  3776	    {t:"进洞拜会大萨满",go:"orc_sacred"},
  3777	    {t:"退出圣山，离开草原",run:function(){ travelTo("orc_heishi"); }}
  3778	  ]
  3779	};
  3780	N["arrive_desert_shendian"] = {
  3781	  place:"死亡沙漠 · 深渊神殿",where:"风沙",
  3782	  text:[
  3783	    "你站在神殿前。黑沙漫过脚踝，殿门洞开，门内一片漆黑。",
  3784	    "你这一路——自由城邦、铁门关、精灵树根、矮人矿道、南方水脉——的线头，全在这里收束。",
  3785	    "风从殿内吹出来，带着陈腐的、被压了千年的气味。",
  3786	    "你知道，门里的东西，在等你。"
  3787	  ],
  3788	  options:[
  3789	    {t:"踏入神殿",go:"desert_inside"},
  3790	    {t:"先退到沙漠边缘整备",run:function(){ travelTo("desert_bianyuan"); }}
  3791	  ]
  3792	};
  3793	
  3794	/* ================================================================
  3795	   补齐节点（north_tavern / beijing_rumor / beijing_letter /
  3796	   moxie_workshop / dwarf_forge / board_free）
  3797	   ================================================================ */
  3798	N["north_tavern"] = {
  3799	  place:"北方公国联盟 · 艾尔达城 · 旅鸮酒馆",where:"黄昏",
  3800	  text:[
  3801	    "旅鸮酒馆是艾尔达城最老的酒馆。炉火烧得旺，麦酒味混着木柴味，把人往暖处拽。",
  3802	    "你找了个角落坐下。邻桌是两个学院的学生，压着声音争论：",
  3803	    "“净化令都贴到学院门口了，他们还查奥术？”",
  3804	    "“查。不过学院有学院的规矩——今年破例对外招生，就是给‘查’打个对折。”",
  3805	    "“为什么？”",
  3806	    "“因为东边在打仗，北边在集结。这年头，多一个超凡者，就多一块砝码。”",
  3807	    "窗外，艾尔达魔法学院的尖顶在暮色里亮起灯火，像一只醒着的眼睛。"
  3808	  ],
  3809	  options:[
  3810	    {t:"去艾尔达魔法学院看看",go:"north_academy_gate"},
  3811	    {t:"去冒险者公会分会接点活",go:"board_north"},
  3812	    {t:"在酒馆多坐一会儿，听听更多风声",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  3813	      ok:["你要了第二杯麦酒，跟跑堂的闲聊。跑堂的压低声音：“你来得巧。这几天，有个南方来的商人，逢人就问‘归墟’两个字。”他咂咂嘴：“问归墟的，不是疯子的学生，就是疯子的朋友。”","你把这话记在心里。"],
  3814	      fail:["你刚开口，跑堂的就被人叫走了。这年头，没人愿意多嘴。"],
  3815	      crit:["跑堂的看你会来事，多说了几句：“那个南方商人，左耳缺了半截。他常去城西的旧书摊。”他顿了顿：“还有，他说，‘门快开了’。”","门快开了。这四个字，你今晚是第二次听见。"]
  3816	    },effects:{xp:10},go:"north_tavern2"}
  3817	  ]
  3818	};
  3819	N["north_tavern2"] = {
  3820	  place:"北方公国联盟 · 艾尔达城 · 旅鸮酒馆",where:"夜",
  3821	  text:[
  3822	    "夜深了，酒馆里的人散了大半。炉火低下去，影子在墙上拉长。",
  3823	    "你在心里把今晚听见的事捋了一遍：净化令、学院招生、东线战事、南方的怪商人、还有那句“门快开了”。",
  3824	    "大陆的线头，比表面上看着乱。",
  3825	    "你喝完最后一口酒，把杯子放回桌上。该动身了。"
  3826	  ],
  3827	  options:[
  3828	    {t:"去艾尔达魔法学院看看",go:"north_academy_gate"},
  3829	    {t:"去冒险者公会分会接点活",go:"board_north"}
  3830	  ]
  3831	};
  3832	N["beijing_rumor"] = {
  3833	  place:"北方公国联盟 · 北境城 · 酒馆",where:"白昼",
  3834	  text:[
  3835	    "你坐到猎人那一桌，要了一壶热酒。",
  3836	    "猎人打量你两眼，压着嗓子开口：",
  3837	    "“草原上的消息？行。黑石部族三个月前开始集结，狼旗连成片，望不到头。带头的，是个年轻大汗，人称黑石。”",
  3838	    "“这人不简单。他不信祖灵——或者说，他信的东西，跟祖灵不是一回事。”",
  3839	    "“他身边多了个黑袍萨满。神谕一道接一道，说冰狼部祖灵已死，该换主人了。”",
  3840	    "猎人冷笑：“祖灵死没死，我们不知道。但那个黑袍萨满的神谕，来得比北风还勤。”",
  3841	    "窗外，北风卷着雪粒，拍在窗棂上，像有人在敲门。"
  3842	  ],
  3843	  options:[
  3844	    {t:"去城头看看冰狼盟誓的营寨",go:"beijing_wolf"},
  3845	    {t:"先落脚，接点活计",go:"board_north"}
  3846	  ]
  3847	};
  3848	N["beijing_letter"] = {
  3849	  place:"北境 · 冰狼部落 · 营地口",where:"黎明",
  3850	  text:[
  3851	    "天刚蒙蒙亮。老狼把你送到营地口，递给你一皮袋干粮。",
  3852	    "“一路向南。别走商路，走小路。”",
  3853	    "“信在，人情在；信丢了，命也可能丢。”他重复了一遍昨晚的话，“那个姓周的账房，你若信不过，就当没这回事。”",
  3854	    "晨风吹过草原，草尖上的霜在光里闪。你紧了紧行囊，转身向南。",
  3855	    "南方。黄金城。一个姓周的账房。",
  3856	    "你摸了摸怀里的信。蜡封完好，像一只合上的眼睛。"
  3857	  ],
  3858	  options:[
  3859	    {t:"出发，前往南方黄金城",run:function(){ S.flags.letter_taken=true; travelTo("south_huangjin"); }},
  3860	    {t:"先回北境城整备，再从长计议",run:function(){ travelTo("north_beijing"); }}
  3861	  ]
  3862	};
  3863	N["moxie_workshop"] = {
  3864	  place:"南方商业城邦联盟 · 魔械城 · 炼金工坊",where:"白昼",
  3865	  text:[
  3866	    "炼金工坊开在魔械城的下城区。门面不大，里面却别有洞天——架子上摆满瓶瓶罐罐，墙上挂着各式机械臂，一台符文熔炉在角落里嗡嗡低鸣。",
  3867	    "坊主是个戴单眼镜的老妇人，正对着一炉溶液皱眉。见你进来，她头也不抬：",
  3868	    "“学手艺，十个银币一天。淘材料，自己挑，别碰那排红标签的。”",
  3869	    "“看你的样子，是刚入行的？那就从认材料开始。”"
  3870	  ],
  3871	  options:[
  3872	    {t:"花银币学一天手艺",check:{a:"INT",sk:"alchemy",label:"学艺"},tier:{
  3873	      ok:["老妇人教你怎么分辨结晶的成色，怎么在淬火时控制温度。你学得认真，她难得地点了点头：“还行，不是朽木。”临走，她塞给你一份入门配方。"],
  3874	      crit:["你上手极快。老妇人摘下单眼镜看了你半天：“有点意思。”她破例教你一个独门手法，还送你一份稀有的材料。"],
  3875	      fail:["你笨手笨脚，打翻了一瓶溶液。老妇人痛心疾首：“我的鹿血精！”她黑着脸把你赶去洗烧杯，一下午净干杂活。"],
  3876	      critfail:["你手一抖，把一瓶红标签的试剂碰倒了。溶液渗进桌面，冒起一股黑烟。老妇人脸色铁青：“出去。今天别来了。”"]
  3877	    },effects:{gold:-10},onCrit:{mat:function(){const j=JOBS[S.job];return j.mats[1];}},go:"south_after_moxie"},
  3878	    {t:"淘点合用的材料",check:{a:"CHA",sk:"bargain",label:"采购"},tier:{
  3879	      ok:["你挑了几块成色不错的结晶，付了钱。老妇人多看了你一眼：“识货。”"],
  3880	      crit:["你在角落的废料堆里翻出一块被遗忘的暗色结晶——切开，里面裹着一粒晶莹的核心。老妇人懊恼地直拍大腿。"],
  3881	      fail:["你看走了眼，把一块劣质结晶当成了好料。老妇人摇摇头，没多说什么。"],
  3882	      critfail:["你砍价太狠，老妇人直接把扫帚抡了过来：“滚！”"]
  3883	    },effects:{gold:-12},onCrit:{mat:function(){const j=JOBS[S.job];return j.mats[2];}},onOk:{mat:function(){const j=JOBS[S.job];return j.mats[1];}},go:"south_after_moxie"}
  3884	  ]
  3885	};
  3886	N["dwarf_forge"] = {
  3887	  place:"矮人王国 · 王都 · 老矮人的铺子",where:"白昼",
  3888	  text:[
  3889	    "老矮人拉着你进了铺子后院。那里有一座旧炉，炉火已经熄了，铁砧上蒙着一层薄灰。",
  3890	    "他搬出那柄断剑，在灯下给你看断口：",
  3891	    "“你看这茬口。好钢，淬透了。可惜当年砍在……那东西身上。”",
  3892	    "他没说那东西是什么。你也没问。",
  3893	    "“小子，我教你个规矩。”他指着断剑，“这行当，材料是死的，人是活的。炉火旺不旺，看人，不看炭。”",
  3894	    "他拍了拍你的肩：“去吧。要学手艺，找大锻造师；要听故事，我这儿随时有酒。”"
  3895	  ],
  3896	  options:[
  3897	    {t:"去铁匠铺学点手艺，淘点材料",go:"dwarf_workshop"},
  3898	    {t:"去熔铁神殿，求见至高王",go:"dwarf_king"},
  3899	    {t:"去矿道方向看看",go:"dwarf_mine"}
  3900	  ]
  3901	};
  3902	const FREE_BOARD = [
  3903	  {t:"帮集市城的粮商押送一车粮食到灰港",check:{a:"STR",sk:"athletic",label:"押运"},ok:["你押着粮车穿过集市，一路平安。粮商多给了几个铜板，还送了你一袋干粮。"],fail:["路上遇上一伙小贼。你费了点手脚才脱身，粮袋破了个口子。"],okEff:{gold:12,xp:20},failEff:{gold:4,xp:8}},
  3904	  {t:"替冒险者公会把一封信送到灰港码头",check:{a:"AGI",sk:"stealth",label:"送信"},ok:["信送到了。接信的是个沉默的汉子，只点了点头。公会的人多看了你一眼：“腿脚麻利。”"],fail:["你在灰港的雾里迷了路，绕了半天才找到地方。信送到了，人累得够呛。"],okEff:{gold:10,xp:15,rep:1},failEff:{gold:3,xp:6}},
  3905	  {t:"在集市城帮人看一天铺子，学学买卖",check:{a:"CHA",sk:"bargain",label:"看铺"},ok:["你学得很快，一天下来，帮掌柜多卖了三成。掌柜乐得合不拢嘴，多给了工钱。"],fail:["你嘴笨，一天没卖出几件。掌柜摆摆手，少给了工钱。"],okEff:{gold:14,xp:15},failEff:{gold:4,xp:6}}
  3906	];
  3907	N["board_free"] = {
  3908	  place:"自由城邦 · 冒险者之城 · 委托板",where:"白昼",
  3909	  text:[
  3910	    "委托板上贴满了纸片。风一吹，纸角哗哗地响。",
  3911	    "你扫了一圈，挑出几张还算靠谱的。"
  3912	  ],
  3913	  options:(function(){
  3914	    const picks = FREE_BOARD.slice().sort(function(){return Math.random()-0.5;}).slice(0,2);
  3915	    return picks.map(function(q,i){
  3916	      return {t:q.t,check:q.check,tier:{ok:q.ok,fail:q.fail},okEff:q.okEff,failEff:q.failEff,go:"board_free_after"};
  3917	    });
  3918	  })()
  3919	};
  3920	N["board_free_after"] = {
  3921	  place:"自由城邦 · 冒险者之城",where:"白昼",
  3922	  text:[
  3923	    "委托交了。报酬入袋，沉甸甸的。",
  3924	    "公会的墙上，贴着一张大陆全图。你的目光沿着商路，从自由城邦出发，扫过北方、南方、精灵、矮人、草原、东境、圣城、沙漠。",
  3925	    "路还长。"
  3926	  ],
  3927	  options:[
  3928	    {t:"继续在自由城邦转转",go:"arrive_free_gonghui"},
  3929	    {t:"打开地图，规划下一段旅途",run:function(){ togglePanel("map"); }}
  3930	  ]
  3931	};
  3932	
  3933	
  3934	/* ================================================================
  3935	   结局池（52号/37号 · 世界收束）
  3936	   ================================================================ */
  3937	const ENDINGS = {
  3938	  seal:{cn:"封门人",text:[
  3939	    "门，关上了。",
  3940	    "你站在深渊神殿的废墟前，望着那扇重新合拢的石门。风从沙漠深处吹来，带着清晨的凉意，把黑沙上的血迹慢慢抹平。",
  3941	    "先知的声音，还留在你耳底：'你关上了门。但门，从来不止一扇。'",
  3942	    "你知道他说的是真的。但你此刻能做的，只是把这一扇，守住。",
  3943	    "你把七枚铁牌系在腰间，迎着朝阳，向来路走去。",
  3944	    "身后的神殿，在晨光里沉默着。它还会沉默很多年。",
  3945	    "而你，从今往后，多了一个名字：守望者。",
  3946	    "大陆上没有人知道你的名字。但每一个安宁的清晨，都有你的一分功劳。"
  3947	  ]},
  3948	  hero:{cn:"群山回响",text:[
  3949	    "你没有走进那扇门。",
  3950	    "你带着你收集的线索与铁牌，回到了文明世界。",
  3951	    "草原的战鼓、圣城的钟声、帝京的宫墙——因为你的奔走，各方的目光，终于落在了同一件事上：那道正在松动的封印。",
  3952	    "兽人的刀收回了鞘（或至少，没有落向平民的头顶）。圣痕司的执事们，开始往南调。南方商会的账目，被翻出了水面。",
  3953	    "你做的每一件事，都像一颗石子投进湖里。涟漪会扩散，会传到很远的地方。",
  3954	    "你没有成为传说。但你让传说，有机会继续写下去。",
  3955	    "这世界欠你的，不是名字，是那些你替它守住的清晨。"
  3956	  ]},
  3957	  legend:{cn:"传奇之路",text:[
  3958	    "你走到了传奇的境界。",
  3959	    "大陆上，吟游诗人开始传唱你的名字。有人说是你守住了铁门关的真相，有人说你在沙漠里关了一扇门，有人说你只是一介散人，独来独往。",
  3960	    "众说纷纭。你懒得解释。",
  3961	    "你站在高处的风口，看着脚下的世界继续运转：商队、战争、朝圣、阴谋，日复一日。",
  3962	    "你不再是一枚棋子。你成了棋盘边，站着看棋的人。",
  3963	    "也许有一天，你会再出手。但不是今天。",
  3964	    "今天，风很好。"
  3965	  ]},
  3966	  myth:{cn:"神话",text:[
  3967	    "神话。",
  3968	    "你站在这片大陆的最高处，低头看——看铁门关的兵锋，看圣城的钟楼，看黄金城的灯火，看草原上的狼旗。",
  3969	    "世界在你脚下，像一幅铺开的画卷。",
  3970	    "你抬起手。指尖有光。",
  3971	    "深渊的门在你面前打开过，又在你手中关上。你听见门后的低语，成千上万的声音汇成一个：'你本可以。'",
  3972	    "你没有回答。",
  3973	    "你只是站在最高处，替这片大陆，守着天亮。",
  3974	    "从今往后，日月照常升落，人间照常悲欢。",
  3975	    "而你，是那个让这一切'照常'的人。"
  3976	  ]},
  3977	  merchant:{cn:"乱世棋手",text:[
  3978	    "你没有去沙漠。",
  3979	    "你把这一路收集的情报——铁牌、账册、地图、名单——整理成一桩桩'买卖'，卖给了愿意出价的人。",
  3980	    "北方联盟买走了东军的情报。银月商会的对头买走了账册的抄本。圣痕司的执事，买走了'深渊将至'的消息。",
  3981	    "你没有选边站。你在所有的边之间，走来走去。",
  3982	    "乱世里，信息是最硬的通货。而你，成了最大的庄家。",
  3983	    "多年以后，有人在你当年待过的酒馆里，听人说起一个'知道太多的人'。",
  3984	    "没有人知道你的名字。但所有的大人物，都欠你一个人情。",
  3985	    "这，也是一种活法。"
  3986	  ]},
  3987	  fell:{cn:"深渊的低语",text:[
  3988	    "低语声，终于安静了。",
  3989	    "你站在祭坛前，看着自己的手。掌心的纹路，已经变成黑色。",
  3990	    "先知站在你身边，像迎接一位迟归的故人：'欢迎回家。'",
  3991	    "你张了张嘴，想说什么，却发现自己已经想不起，要说什么了。",
  3992	    "你记得自己曾经追查过什么，曾经相信过什么。但那些记忆，像隔着一层水，越来越远。",
  3993	    "你转身，向殿外走去。沙漠的风灌进来，吹起你的衣角。",
  3994	    "身后，门开着。门后，有声音在轻轻唤你。",
  3995	    "你没有回头。",
  3996	    "你走向那扇门。世界，在门外。"
  3997	  ]},
  3998	  madness:{cn:"疯狂",text:[
  3999	    "你醒来时，不知道自己在哪。",
  4000	    "眼前是黄沙，还是城墙？你分不清。耳边有低语声，一直在说，一直在说，从未停过。",
  4001	    "你记得自己追查过什么——铁牌、封印、深渊。你记得那些名字：玛门、先知、守望者。",
  4002	    "但你记不清，自己为什么要追查了。",
  4003	    "你蹲在路边，用树枝在土里画着什么。画完，你又把它抹掉。",
  4004	    "路人绕着你走。有人往你碗里丢了一枚铜子。",
  4005	    "你抬头，想对他笑。却听见自己嘴里，发出的是另一种声音——",
  4006	    "低沉的、像从地底传来的声音：'……第七个，快到了。'",
  4007	    "你怔住了。然后，你继续低头，画那个你画了无数遍的图案：",
  4008	    "一个圈。圈里，一只竖瞳。"
  4009	  ]},
  4010	  returned:{cn:"黄沙归来",text:[
  4011	    "你从沙漠回来了。",
  4012	    "你走进神殿，又走了出来——带着疑问，也带着答案（或者，两者都没有）。",
  4013	    "先知还在殿里，等你回去，或者等下一个'第七个祭品'。",
  4014	    "你回到文明世界，把你在沙漠里的见闻，说给了（圣痕司/烛台书店/老狼/墨丘利/伊芙琳——你信得过的人）。",
  4015	    "他们沉默了很久。最终，有人说：'你做的，已经比大多数人多。'",
  4016	    "你点了点头。",
  4017	    "世界没有因为你的旅程而改变。但你知道，有些门，在你亲眼看过之后，就不会再是'传说'。",
  4018	    "你继续上路。路还很长。"
  4019	  ]},
  4020	  wanderer:{cn:"无名旅人",text:[
  4021	    "你的旅程，暂时停在这里。",
  4022	    "你走过自由城邦的雾、北境的雪、南方的账本、精灵的银林、矮人的炉火、草原的风、帝京的墙、圣城的钟——然后，你在某个黄昏，停住了脚步。",
  4023	    "你找了一间客栈，要了一壶酒，一盘卤肉。",
  4024	    "窗外，街市人来人往。有人在为明天的饭钱发愁，有人在为一句流言奔走，有人在对着一枚铜子忏悔。",
  4025	    "你喝了一口酒。",
  4026	    "世界很大。你的故事，还远没有写完。",
  4027	    "只是今天，你想歇一歇。",
  4028	    "于是你歇了。",
  4029	    "这，也是旅途的一部分。"
  4030	  ]}
  4031	};
  4032	function computeEnding(){
  4033	  const f = S.flags||{};
  4034	  if(f.fell || f.seized) return "fell";
  4035	  if(S.san<=0) return "madness";
  4036	  if(f.seal_great || f.seal_success) return "seal";
  4037	  if(S.realm>=7) return "myth";
  4038	  if(S.realm>=6) return "legend";
  4039	  if(S.rep>=40 && S.gold>=300 && !S.desert_done) return "merchant";
  4040	  if(S.desert_done) return "returned";
  4041	  return "wanderer";
  4042	}
  4043	function showEnding(id){
  4044	  if(S.ending) return;
  4045	  S.ending = id;
  4046	  const E = ENDINGS[id]||ENDINGS.wanderer;
  4047	  clearOptions();
  4048	  writePar("── 结局 · "+E.cn+" ──","noind flagline");
  4049	  E.text.forEach(p=>writePar(p));
  4050	  try{ const s=Object.assign({},S); s.choices=[]; s.curNode=curNode; localStorage.setItem(RULESET_ID+"-save",JSON.stringify(s)); }catch(e){}
  4051	  renderTop(); renderStats();
  4052	  const b = document.createElement("button"); b.className="opt";
  4053	  b.innerHTML = "<span class='od'>✦</span> 重开新旅";
  4054	  b.onclick = ()=>{ if(askConfirm("开启一段新的旅程？当前结局将被覆盖。")) newGame(); };
  4055	  $("options").appendChild(b);
  4056	}
  4057	N["ending_choose"] = {
  4058	  place:"旅途回望",where:"某个黄昏",
  4059	  text:[
  4060	    "你站在某个黄昏里，回望来路。",
  4061	    "自由城邦的雾、北境的雪、南方的账本、精灵的银林、矮人的炉火、草原的风、帝京的墙、圣城的钟、沙漠的黑沙——",
  4062	    "你走过的每一步，都还在你脚下。",
  4063	    "你摸了摸怀里的（铁牌/信物/伤痕）。",
  4064	    "此刻，你可以选择，把这段旅程，告一段落。",
  4065	    "或者，继续走下去。"
  4066	  ],
  4067	  options:[
  4068	    {t:"【就此停步】结束旅程，回望这一生",run:function(){ showEnding(computeEnding()); }},
  4069	    {t:"【继续漫游】路还长，接着走",run:function(){ togglePanel("map"); }}
  4070	  ]
  4071	};
  4072	/*==STORY_TRAVEL==*/
  4073	/*==STORY_REALM==*/
  4074	/*==STORY_WORLD==*/
  4075	/*==STORY_ENDING==*/
  4076	
  4077	/* ============ 通用到达节点 ============ */
  4078	N["arrive_generic"] = {
  4079	  place:"未知之地", text:["风尘仆仆。你踏上了这片土地。","远处有炊烟，近处有狗吠。世界照常运转，并不为你的到来多停一秒。"],
  4080	  options:[
  4081	    {t:"四处看看，找落脚处",go:"act_rest"},
  4082	    {t:"向路人打听此地的消息",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
  4083	      ok:["路人上下打量你，见你风尘仆仆却不狼狈，便说了几句实在话：此地近来的物价、教会查得严、哪里能接到活计，都清清楚楚。"],
  4084	      fail:["路人见你面生，含糊两句便走了。你只听得半截话，'……净化令，查得紧。'","没问到什么有用的，倒是记住了这一句。"],
  4085	      crit:["路人是个话篓子，压着嗓子倒出一箩筐：某商会的账房深夜不点灯、某座教堂的地下室常年锁着、某条商队最近总在夜里进城。这些你都记下了。"],
  4086	      critfail:["你问得太急，路人警惕起来，反倒把你当成了圣痕司的探子，扭头就走。街角的巡兵朝你多看了两眼。你只得低头快步离开。"]
  4087	    },effects:{rep:1},go:"act_rest"}
  4088	  ]
  4089	};
  4090	N["act_rest"] = {
  4091	  place:"落脚处", text:["你找了个便宜的客栈。跳蚤在褥子里蹦跳，隔壁传来鼾声与梦话。","睡一觉。明日的事，明日再说。"],
  4092	  options:[
  4093	    {t:"休息一日（恢复伤势与疲劳，消耗1日）",time:1,effects:{hp:30,fatigue:0,wound:-1},tier:{ok:["一觉到天明。梦里有人在你耳边数金币，醒来时，枕边的钱袋还在。"]},go:"arrive_generic"},
  4094	    {t:"逛集市，采买补给",check:{a:"CHA",sk:"bargain",label:"砍价"},tier:{
  4095	      ok:["你用几句俏皮话压下了价。干粮、绷带、一壶酒，都进了行囊。"],
  4096	      fail:["摊主油盐不进。你多付了些钱，东西倒是齐了。"],
  4097	      crit:["摊主看你顺眼，多塞给你一小包香料，说是路上驱邪用。"],
  4098	      critfail:["你砍价砍出了火气，摊主报了巡兵，说你扰乱市集。你赔了钱才脱身，还被记了一笔。"]
  4099	    },effects:{gold:-8,item:"干粮包"},go:"arrive_generic"},
  4100	    {t:"打坐修炼，沉淀此行见闻",check:{a:"INT",sk:"lore",label:"冥想"},tier:{
  4101	      ok:["行路中的见闻在脑中沉淀成经验。气机微动，修为略有进益。"],
  4102	      fail:["心浮气躁。今日的疲惫压过了灵光，你坐了一会儿便放弃了。"],
  4103	      crit:["冥想中你忽然想通了一处关节。这世间的道理，原是可以这样串起来的。"],
  4104	      critfail:["冥想时你听见耳边有低语，像是谁在叫你的名字。你猛地睁眼，房里空无一人。冷汗浸透了后背。"]
  4105	    },effects:{xp:15},go:"arrive_generic"}
  4106	  ]
  4107	};
  4108	
  4109	/* ============ 初始化 ============ */
  4110	function init(){
  4111	  $("btn-map").onclick=()=>togglePanel("map");
  4112	  $("btn-pack").onclick=()=>togglePanel("pack");
  4113	  $("btn-realm").onclick=()=>togglePanel("realm");
  4114	  $("btn-log").onclick=()=>togglePanel("log");
  4115	  $("btn-save").onclick=()=>saveGame();
  4116	  storyEl = $("story");
  4117	  // 读档或新建
  4118	  const saved = localStorage.getItem(RULESET_ID+"-save");
  4119	  if(saved){
  4120	    try{
  4121	      const d=JSON.parse(saved);
  4122	      if(d.ruleset===RULESET_ID && !d.ending){
  4123	        if(askConfirm("检测到存档（第"+d.day+"日，"+d.name+"）。是否继续？")){
  4124	          S=d; curNode = S.curNode||"fc_jiaohui_entry"; renderTop(); renderStats(); renderMapPanel(); writeNext(); return;
  4125	        }
  4126	      }
  4127	    }catch(e){}
  4128	  }
  4129	  S=emptyState();
  4130	  showCreation();
  4131	}
  4132	window.addEventListener("load",init);
  4133	</script>
  4134	</body>
  4135	</html>
