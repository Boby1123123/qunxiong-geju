/* /REL4inj:event/ REL-4 关系事件链（v93）——误会/争风/背叛·和解 三链闭环
   纯数据对象式；零引擎改动；只用新 flag 键（rel_event_*_done / rel_event_*_pick）
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   触发：fc_innkeep（误会链，蜜尔娜好感≥30）/ acad_life_y1_open（争风链）/ fc_innkeep（阿岩链） */

/* 链 A · 误会：深夜的密探（蜜尔娜） */
N["rel_event_mis_1"]={tag:"branch",place:"自由城邦 · 交汇城 · 夜巷",pace:"normal",text:[
"这夜你从码头往回走，巷子里撞见一个穿灰斗篷的人，正往商会账房后门塞什么。你闪身避让，那人却认出了你，喊了一声你的名字，说了句“你在城里的名声，传得比你想的快”，便隐进暗处。",
"你回酒馆时，柜台后的蜜尔娜正擦着杯子。她抬头看了你一眼，那一眼和平时不一样——像在打量一个陌生人。“这么晚，还跟商会的人走一路？”她问得很轻，话却砸得很重。"
],options:[
{t:"解释：只是路上撞见，没说话",go:"rel_event_mis_2a"},
{t:"不解释，说：你不信我，我说什么都没用",go:"rel_event_mis_2b"},
{t:"沉默，先回房",go:"rel_event_mis_2c"}
]};

N["rel_event_mis_2a"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"蜜尔娜把杯子放回架上，声音很平：“我见过太多人，在交汇城说‘只是撞见’。第二天，不是被人砍死在巷子里，就是帮人把账做平了。”她顿了顿，“你不一样，我以为。”"
],options:[
{t:"认真看着她：我确实不一样，你信我这一回",effects:{flag:"rel_event_mis_pick_a"},go:"rel_event_mis_3"},
{t:"（苦笑，上楼）",effects:{flag:"rel_event_mis_pick_b"},go:"rel_event_mis_3"}
]};

N["rel_event_mis_2b"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"蜜尔娜没接话，低头把抹布叠好，叠了三遍。再抬头时，脸上又挂回那副滴水不漏的笑：“行。你说得对，信不信是我的事。”她往柜台后走，脚步比平时重了一点。"
],options:[
{t:"（心里发堵，第二天买糖给她）",effects:{flag:"rel_event_mis_pick_c",gold:-2},go:"rel_event_mis_3"},
{t:"（算了，先睡）",effects:{flag:"rel_event_mis_pick_d"},go:"rel_event_mis_3"}
]};

N["rel_event_mis_2c"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"你没说话，径直上楼。楼梯拐角时你回头看了一眼——蜜尔娜还站在柜台后面，手里攥着那块抹布，没再擦杯子。灯照着她的侧脸，那副精明干练的样子底下，有一丝说不清的疲惫。"
],options:[
{t:"（回身下楼，坐到她对面）",effects:{flag:"rel_event_mis_pick_e"},go:"rel_event_mis_3"}
]};

N["rel_event_mis_3"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"normal",text:[
"第二天清早，蜜尔娜照常开门，照常摆面包。你下楼时，她没提昨晚的事，只在你那份面包旁多放了一颗煮鸡蛋。",
"你坐下来，把那颗鸡蛋推回她面前：“昨夜那个灰斗篷，是商会的密探。我跟他没交情，但他认出了我——他说我在城里的名声，传得比我想的快。”",
"蜜尔娜手上的动作停了一瞬。她看着你，那只看人的亮眼睛慢慢软下来：“你知道在这座城，肯把实话摆上桌的人，一天也遇不上一个。”她拿回鸡蛋，剥了壳放回你碗里，“吃吧。昨夜是我不对。”"
],options:[
{t:"接过鸡蛋，说：这就算和好了",effects:{flag:"rel_event_mis_done",relation:{npc:"milna",v:3}},go:"rel_event_mis_4a"},
{t:"说：昨晚我的话也重了，都过去了",effects:{flag:"rel_event_mis_done",relation:{npc:"milna",v:2}},go:"rel_event_mis_4b"},
{t:"什么也不说，把鸡蛋吃了",effects:{flag:"rel_event_mis_done",relation:{npc:"milna",v:1}},go:"rel_event_mis_4c"}
]};

N["rel_event_mis_4a"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"蜜尔娜难得笑了，那笑不像柜台后的笑，倒像卸了甲的笑：“和好了。你这个人情，我记一辈子。”她转身去开酒桶，“今天请你喝一杯，北境陈酿——我压箱底的东西。”",
"你吃着鸡蛋，觉得这个早晨，比前些天都亮堂。"
],options:[
{t:"（今日无事，记下这份情）",go:"fc_innkeep"}
]};

N["rel_event_mis_4b"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"蜜尔娜摇摇头：“昨晚我话也说得绝。这座城教会我的，是话要留三分；对你，我该留十分。”她给你倒上麦酒，“往后夜里出去，跟我说一声，免得我瞎琢磨。”",
"你点头。柜台后的灯影里，她低头擦杯子的动作，又恢复了从前的从容。"
],options:[
{t:"（应下，回柜台前喝酒）",go:"fc_innkeep"}
]};

N["rel_event_mis_4c"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"你把鸡蛋吃了，没说话。蜜尔娜也没再说。有些事，说破了反而生分；这一颗鸡蛋，你俩都懂。",
"往后几日，她给你的麦酒总是满的，只是不再问你去哪。那层薄薄的客气，在两人之间横着，谁也没先捅破。"
],options:[
{t:"（日子照过，心里记着这事）",go:"fc_innkeep"}
]};

/* 链 B · 争风：图书馆的传闻（塞西莉娅 × 艾琳） */
N["rel_event_riv_1"]={tag:"branch",place:"北境 · 艾尔达学院 · 图书馆",pace:"normal",text:[
"图书馆里本该安静，今天却有些不对劲。你坐下不久，便发觉两道视线在你身上交错——塞西莉娅坐在窗边，面前的贵族史摊开着，半天没翻页；艾琳在书架间穿梭，每次经过你身边，都像要说什么又咽回去。",
"你起身去还书，塞西莉娅忽然开口：“你昨天，跟她一起在旧书摊待到关门？”她问的是艾琳，语气听着很平常，尾音却压得有点低。"
],options:[
{t:"承认：是，聊了会古籍",go:"rel_event_riv_2a"},
{t:"反问：这跟你有什么关系",go:"rel_event_riv_2b"},
{t:"岔开话题：你们俩都来图书馆，巧啊",go:"rel_event_riv_2c"}
]};

N["rel_event_riv_2a"]={tag:"branch",place:"北境 · 艾尔达学院 · 图书馆",pace:"light",text:[
"塞西莉娅合上书，站起来，声音不大但字字清楚：“学院里闲话传得快。你跟她走得近，明天就会有二十个版本的故事。”她顿了顿，“我没别的意思，提醒你一句。”",
"书架那头，艾琳抱着一摞书经过，脚步明显放慢了。她没看你，却把你和塞西莉娅的话听了个清楚。"
],options:[
{t:"对塞西莉娅：我交朋友，不看别人怎么说",effects:{flag:"rel_event_riv_pick_a"},go:"rel_event_riv_3"},
{t:"对两人都说：你们都是我朋友，别猜来猜去",effects:{flag:"rel_event_riv_pick_b"},go:"rel_event_riv_3"}
]};

N["rel_event_riv_2b"]={tag:"branch",place:"北境 · 艾尔达学院 · 图书馆",pace:"light",text:[
"塞西莉娅挑眉，抱臂看着你：“跟我有什么关系？”她重复了一遍，像是没料到你会这么回，“学生会下个月换届，我是候选人之一。你跟她走太近，别人会以为你站队——而她的导师，跟我导师不对付。”",
"她说完，头也不回地走了，鞋跟敲在石地上，一声比一声重。"
],options:[
{t:"（追上去，把话说开）",effects:{flag:"rel_event_riv_pick_c"},go:"rel_event_riv_3"},
{t:"（不追，由她去）",effects:{flag:"rel_event_riv_pick_d"},go:"rel_event_riv_3"}
]};

N["rel_event_riv_2c"]={tag:"branch",place:"北境 · 艾尔达学院 · 图书馆",pace:"light",text:[
"塞西莉娅没接你的话，只盯着你看了几息，然后笑了笑——那种把情绪都收进袖子里的笑：“巧不巧的，你自己心里有数。”她起身走了。",
"艾琳这时才从书架后走出来，抱着书，脸有点红：“她……是不是生气了？我是不是连累你了？”"
],options:[
{t:"安慰她：没有的事，你别多心",effects:{flag:"rel_event_riv_pick_e"},go:"rel_event_riv_3"},
{t:"诚实说：她确实有点在意，我去说清楚",effects:{flag:"rel_event_riv_pick_f"},go:"rel_event_riv_3"}
]};

N["rel_event_riv_3"]={tag:"branch",place:"北境 · 艾尔达学院 · 回廊",pace:"normal",text:[
"当夜，你分别给两人写了纸条，约在回廊尽头的老槐树下。北境的夜风冷，月亮被云遮了一半。",
"塞西莉娅先到，抱着臂，一脸“看你还能说什么”的表情。艾琳后到，攥着衣角，低头看鞋尖。",
"你把话说开了：你跟她俩都是朋友，不存在站队，谁要编排，让编排的人来找你。说完，你看着她们：“现在，你俩还有什么要问的？”"
],options:[
{t:"（说完就走，留她俩自己消化）",effects:{flag:"rel_event_riv_done",relation:{npc:"cecy",v:2}},go:"rel_event_riv_4a"},
{t:"补一句：下次一起去旧书摊，我请客",effects:{flag:"rel_event_riv_done",relation:{npc:"elin",v:3}},go:"rel_event_riv_4b"}
]};

N["rel_event_riv_4a"]={tag:"branch",place:"北境 · 艾尔达学院 · 回廊",pace:"light",text:[
"你转身离开时，听见身后塞西莉娅“哼”了一声，又听见艾琳“噗”地笑了出来。",
"第二天，图书馆里再没有那两道交错的视线。塞西莉娅路过你时，用只有你听得见的声音说：“算你有点胆。”艾琳则往你桌上放了一朵压干的七瓣花——和诗册扉页那朵一模一样。"
],options:[
{t:"（收下花，继续过学院的日子）",go:"acad_life_y1_open"}
]};

N["rel_event_riv_4b"]={tag:"branch",place:"北境 · 艾尔达学院 · 旧书摊",pace:"light",text:[
"隔日午后，旧书摊前多了两张脸。塞西莉娅嘴上说“就来看看”，却在摊前翻了半个时辰的贵族史；艾琳抱来一摞古籍，说要跟摊主换两本。",
"你请她们喝北地麦茶，塞西莉娅喝了一口，评价是“太甜”，然后喝完了整杯。艾琳则悄悄在你书页里夹了一朵干花。",
"传闻还是传了几天，但传着传着，就传成了另一个版本——说你们仨是旧书摊的常客，交情铁得很。"
],options:[
{t:"（这结局，挺好）",go:"acad_life_y1_open"}
]};

/* 链 C · 背叛·和解：夜出城的阿岩 */
N["rel_event_bet_1"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"normal",text:[
"半夜你睡不着，去码头透气，却撞见一道熟悉的身影——阿岩。他背着行囊，正往一艘夜船的方向走，看见你，整个人僵了一下。",
"月光下，他的脸色很难看，像做了亏心事被抓个正着：“你……怎么在这儿。”他声音发紧，“你别问。就当没看见我。”",
"夜船的船工在催了。他转身要走，又停住，回头看了你一眼，那一眼里有挣扎。"
],options:[
{t:"拦住他：你到底要去哪",go:"rel_event_bet_2a"},
{t:"让他走，说：我当你没来过",go:"rel_event_bet_2b"},
{t:"说：要走一起走，我不问",go:"rel_event_bet_2c"}
]};

N["rel_event_bet_2a"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"light",text:[
"阿岩握紧行囊带子，指节发白：“我阿爷病重，托人捎了信来。草原那边……有人要借我这件事，让我回去‘站队’。”他咬着后槽牙，“我不想卷进去，可阿爷的病不能等。”",
"你这才明白他为什么瞒着——他怕你知道他背后有人，觉得他靠不住。"
],options:[
{t:"把自己的盘缠分他一半：先救阿爷，账回来再说",effects:{flag:"rel_event_bet_pick_a",gold:-5},go:"rel_event_bet_3"},
{t:"问他：你回去站哪边",effects:{flag:"rel_event_bet_pick_b"},go:"rel_event_bet_3"}
]};

N["rel_event_bet_2b"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"light",text:[
"阿岩松了口气，又像泄了气。他低头站了一会儿，说：“兄弟，对不住。有些事不是不信你，是说出来，连我自己都嫌脏。”",
"他上了船。船离岸时，他站在船尾，朝你喊了一句：“那枚护符，我系在腰上，睡觉也不摘。”",
"夜船消失在黑黢黢的河面上。你站在原地，心里说不清是什么滋味。"
],options:[
{t:"（回酒馆，等他回来）",effects:{flag:"rel_event_bet_pick_c"},go:"rel_event_bet_3"}
]};

N["rel_event_bet_2c"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"light",text:[
"阿岩愣住，盯着你看了好几息，像在分辨你是认真还是客气。末了他笑了，那笑里带着点鼻音：“好。你够意思。”他往旁边挪了挪，给你让出半个船位，“上来吧，船钱我出。”",
"船工又催了一声。你踏上去时，他凑近补了一句：“到了那边，你只管看，别掺和。水太深。”"
],options:[
{t:"（同船北上，照他说的做）",effects:{flag:"rel_event_bet_pick_d"},go:"rel_event_bet_3"}
]};

N["rel_event_bet_3"]={tag:"branch",place:"草原 · 边境驿站",pace:"normal",text:[
"半月后，阿岩回来了。不是一个人——他牵着一匹瘦马，马背上驮着个包袱。他在驿站门口看见你，站住了，半晌没说话。",
"然后他开口，声音有点哑：“阿爷……走了。走之前，他说我交了个真朋友，让我别学草原上那些人的弯弯绕。”他顿了顿，“我答应他了。”",
"他解下包袱，里面是一把带鞘的弯刀，刀鞘上刻着风狼纹：“我阿爷的刀。他说，送给能陪你走夜路的人。”"
],options:[
{t:"接过刀，说：以后的路，一起走",effects:{flag:"rel_event_bet_done",relation:{npc:"ayan",v:4}},go:"rel_event_bet_4a"},
{t:"推回去：这刀你留着，我陪你走就行",effects:{flag:"rel_event_bet_done",relation:{npc:"ayan",v:3}},go:"rel_event_bet_4b"}
]};

N["rel_event_bet_4a"]={tag:"branch",place:"草原 · 边境驿站",pace:"light",text:[
"你把弯刀接过来，沉甸甸的，刀鞘上的风狼纹被握得发亮。阿岩看着你，笑了——这次的笑，跟码头那次不一样，松快得很。",
"“走吧，”他说，“草原的风大，我教你认路。”",
"你们并肩走出驿站。天边正泛起鱼肚白，草原的路在晨光里伸向远方。"
],options:[
{t:"（新的路，从这日开始）",go:"fc_innkeep"}
]};

N["rel_event_bet_4b"]={tag:"branch",place:"草原 · 边境驿站",pace:"light",text:[
"阿岩把刀推回你手里：“拿着。我阿爷的话，我转达了，你不收，就是看不起我。”他说得认真，眼里却带着笑。",
"你把刀收下。他拍拍你的肩，转身去牵马：“走吧，驿站的小二说，前头有家店的奶茶不错——我请客，就当你陪我去草原的定金。”",
"晨光里，两道人影一前一后，走出驿站。"
],options:[
{t:"（情义这东西，有时比刀还重）",go:"fc_innkeep"}
]};
