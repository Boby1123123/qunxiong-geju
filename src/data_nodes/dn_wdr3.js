/* /WDR3inj:home/ WDR-3 玩家据点（v93）——城东小院
   纯数据对象式；零引擎改动；只用新 flag 键（home_fc / wdr3_home_*）
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   入口：fc_innkeep「打听城东的小院」→ wdr3_home_buy → wdr3_home hub */

N["wdr3_home_buy"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东",pace:"normal",text:[
"城东靠河有一处小院，两间瓦房带个灶间，院里有棵老槐，墙头爬满常春藤。房主是个要回老家的皮货商，急着脱手，只要五十银月。",
"他领你看了一圈，指着院角说：“水井是好的，房梁是前年换的。就是荒了一年，院里草长得齐腰。”他搓搓手，“你要是要，今天就能搬进来——家具我留给你，算是添头。”"
],options:[
{t:"买下这处小院（五十银月）",check:{a:"CHA",sk:"bargain",label:"议价"},
 tier:{ok:["你跟他磨了半天价，最后四十五银月成交。他走时留了把钥匙，说：“院里的草，记得除。”","你攥着钥匙，在门口站了一会儿——这算是你在这座城里，第一处自己的地方。"],
       fail:["你没磨下价来，但房主急着走，还是按四十五银月成了交。他把钥匙交给你，补了句：“小伙子，会讲价的都成不了大事，你挺好。”","你攥着钥匙，在门口站了一会儿——这算是你在这座城里，第一处自己的地方。"]},
 effects:{flag:"home_fc",gold:-45},go:"wdr3_home"},
{t:"再看看，不急着买",go:"fc_innkeep"}
]};

N["wdr3_home"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"normal",text:[
"钥匙转开铜锁，院里那股草木气扑面而来。老槐的叶子落了满地，灶间里积着灰，但水井是好的，房梁是新的，墙角的农具擦一擦还能用。",
"你关上门，把门闩落下。城里那些响动——码头的吆喝、商会的算盘、城楼的更鼓——都被挡在墙外了。这院子不大，却是你的。"
],options:[
{t:"歇一歇，烧壶水",go:"wdr3_home_rest"},
{t:"拾掇拾掇院子（花十银月买木料瓦片）",effects:{flag:"wdr3_home_fixed",gold:-10},go:"wdr3_home_fix"},
{t:"邀请蜜尔娜来坐坐",req:function(){return (S.npcRelations["milna"]||0)>=50;},go:"wdr3_home_invite_milna"},
{t:"邀请阿岩来坐坐",req:function(){return (S.npcRelations["ayan"]||0)>=50;},go:"wdr3_home_invite_ayan"},
{t:"把值钱的东西收进箱子里",go:"wdr3_home_store"},
{t:"（锁门，回城里）",go:"fc_innkeep"}
]};

N["wdr3_home_rest"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"light",text:[
"你生火烧水，就着炉膛的光，把灶台擦了一遍。老槐的叶子在风里沙沙响，远处码头的灯火亮着，却远得像另一个世界。",
"水开了，你给自己倒了一碗。坐在门槛上慢慢喝，忽然想起离开家乡那天——原来一个人有了落脚处，连走路都稳当些。"
],options:[
{t:"（休息片刻，精神见好）",effects:{xp:10},go:"wdr3_home"}
]};

N["wdr3_home_fix"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"light",text:[
"你花了半天工夫，把院里的草除了，把漏风的窗框补上，又用买来的木料在灶间搭了个架子。老槐的枝丫伸到屋檐下，你顺手系了根绳子，晾衣裳用。",
"日头偏西时，你直起腰，看着这个焕然的小院——窗明几净，水缸满着，灶间的架子上整整齐齐。你忽然觉得，在这座城里，你不再是个过客了。"
],options:[
{t:"（小院像个家了）",effects:{xp:15},go:"wdr3_home"}
]};

N["wdr3_home_invite_milna"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"normal",text:[
"打烊后，蜜尔娜提着两壶酒和半只烧鸡来敲门。她进门先转了一圈，把灶间、水井、老槐都看了一遍，点评：“墙该刷了，井台倒是干净。你这院子，比我想的像样。”",
"你们坐在院里，就着烧鸡喝酒。她难得话多，讲起当年初到自由城，睡在桥洞下的日子。讲着讲着，她自己笑了：“那时候哪敢想，能有一间自己的屋子。”",
"她举杯碰了碰你的：“这院子买得好。往后打烊了，我还能有个地方坐坐。”"
],options:[
{t:"（给她留一把院门钥匙）",effects:{flag:"wdr3_home_milna_key",relation:{npc:"milna",v:2}},go:"wdr3_home"},
{t:"（不递钥匙，只说：随时来）",effects:{flag:"wdr3_home_milna_key",relation:{npc:"milna",v:1}},go:"wdr3_home"}
]};

N["wdr3_home_invite_ayan"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"normal",text:[
"阿岩扛着一袋面来的，说是码头上拿的便宜货。他进门也不客气，放下袋子，蹲在井边打了桶水，洗了把脸，又给院里那棵老槐浇了水。",
"他直起腰，看着院子，忽然说：“这地方好。有树，有井，有墙。”他顿了顿，“草原上的帐子，要是也能这么定下来，就好了。”",
"他没再多说，帮你把面扛进灶间。出来时，他在门框上比了个身量，笑了一下——那笑意里，有一点你不太看得懂的东西。"
],options:[
{t:"（说：你随时来，这里也有你的位置）",effects:{flag:"wdr3_home_ayan_key",relation:{npc:"ayan",v:2}},go:"wdr3_home"},
{t:"（不接话，给他倒水）",effects:{flag:"wdr3_home_ayan_key",relation:{npc:"ayan",v:1}},go:"wdr3_home"}
]};

N["wdr3_home_store"]={tag:"branch",place:"自由城邦 · 交汇城 · 城东小院",pace:"light",text:[
"你把值钱的东西归拢到一个旧木箱里：几枚银月、一封没寄出的信、阿岩刻的那根木签、艾琳诗册里夹的干花。箱子上了锁，塞进床底。",
"你拍了拍手上的灰，看着那把锁。这些零零碎碎的东西，加起来没多少，却都是你在这片大陆上走过的证据。"
],options:[
{t:"（收好，锁门出去）",effects:{xp:5},go:"wdr3_home"}
]};
