/* /REL3inj:letter/ REL-3 跨城书信系统（v93）
   纯数据对象式；零引擎改动；S 零新增字段（只用新 flag 键）
   flag 键：rel_letter_sent_<npc> / rel_letter_read_<npc>
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   入口：fc_innkeep 挂「去驿站写封信」→ rel_letter_post；回信在 fc_innkeep / acad_life_y1_open 触发 */

N["rel_letter_post"]={tag:"branch",place:"自由城邦 · 交汇城 · 驿站",pace:"normal",text:[
"驿站在城门口，一间低矮的屋子，墙上钉着半面木板，写着各地驿程：北境七日，草原半月，东境十二日。管事的瘸腿老汉收钱、贴签、把信扔进一只大麻袋，动作一气呵成。",
"他抬头看你一眼：“捎给谁？写好封口，地址留清楚。丢了的，驿路不赔。”"
],options:[
{t:"写封信给蜜尔娜，问她店里近来可好",effects:{flag:"rel_letter_sent_milna",gold:-1},go:"rel_letter_sent_milna"},
{t:"写封信给阿岩，问他还记不记得草原的事",effects:{flag:"rel_letter_sent_ayan",gold:-1},go:"rel_letter_sent_ayan"},
{t:"写封信给学院的费尔曼教授，请教一个问题",effects:{flag:"rel_letter_sent_ferman",gold:-1},go:"rel_letter_sent_ferman"},
{t:"写封信给家里，报个平安",effects:{flag:"rel_letter_sent_home",gold:-1},go:"rel_letter_sent_home"},
{t:"（不写了，离开驿站）",go:"fc_innkeep"}
]};

N["rel_letter_sent_milna"]={tag:"branch",place:"自由城邦 · 交汇城 · 驿站",pace:"light",text:[
"你在驿站柜台借了张粗纸，就着窗口的光，把字写得尽量端正。信不长——问酒馆近来生意可好，问那条窄巷夜里还安生不安生，末了写了句“道谢的话没来得及说，改日回去当面讲”。",
"你封好口，贴上驿签。瘸腿老汉眯眼看了看地址，往麻袋里一扔：“北境七日。丢不了。”"
],options:[
{t:"（寄出，回酒馆）",go:"fc_innkeep"}
]};

N["rel_letter_sent_ayan"]={tag:"branch",place:"自由城邦 · 交汇城 · 驿站",pace:"light",text:[
"给阿岩的信你写了又撕，撕了又写。想说的太多，落在纸上反而都成了废话。最后只留了一句：“我应过陪你回草原，这话不作废。等我。”",
"你封好口，贴上驿签。瘸腿老汉看了一眼收信人的名字，嘟囔道：“草原上的信，走得慢。人要是也像信这么慢，就什么也追不上了。”"
],options:[
{t:"（寄出，回酒馆）",go:"fc_innkeep"}
]};

N["rel_letter_sent_ferman"]={tag:"branch",place:"自由城邦 · 交汇城 · 驿站",pace:"light",text:[
"给费尔曼教授的信，你斟酌了很久措辞——问的其实是你后来才想明白的一个问题：他在课上讲过的那句“力量有代价”，到底是说给谁听的。",
"你没法把这个问题写得太直白，只好绕着圈问。信封好，你忽然觉得，那位教授大概能看懂。"
],options:[
{t:"（寄出，回酒馆）",go:"fc_innkeep"}
]};

N["rel_letter_sent_home"]={tag:"branch",place:"自由城邦 · 交汇城 · 驿站",pace:"light",text:[
"给家里的信，你写得很慢。写到一半你才发现，离家这段日子，能报的平安寥寥，能写的事却堵在胸口。最后只落了几行：吃住都好，银钱够用，勿念。",
"你封好口，把信交给瘸腿老汉。他接过信，难得没催你：“家书抵万金。慢点寄，也行。”"
],options:[
{t:"（寄出，回酒馆）",go:"fc_innkeep"}
]};

/* 回信 · 蜜尔娜（fc_innkeep 触发） */
N["rel_letter_reply_milna"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶柜台",pace:"normal",text:[
"半月后，蜜尔娜把一封信拍在柜台上，信封角上带着酒渍：“驿站送来的，给你的。字倒写得端正。”",
"你拆开信，是她那手利落的字迹：酒馆生意照旧，巷子夜里还是不安生，前日又有一拨人半夜从巷口过。末了她写：“你走以后，柜台空了半边。北地的路难走，留神脚下的冰。改了主意想回来，跛脚酒桶的钥匙还在。”",
"她把信翻过来，背面还有一行小字：“麦糖吃完了。下回捎。”"
],options:[
{t:"把信收进怀里",effects:{flag:"rel_letter_read_milna",relation:{npc:"milna",v:2}},go:"fc_innkeep"},
{t:"回她一封短信，说会回去的",effects:{flag:"rel_letter_read_milna",relation:{npc:"milna",v:3}},go:"fc_innkeep"}
]};

/* 回信 · 阿岩（fc_innkeep 触发） */
N["rel_letter_reply_ayan"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"normal",text:[
"阿岩的回信是托商队捎来的，信纸皱巴巴的，像是揣在怀里走了很远的路。字迹歪歪扭扭，一笔一画写得很用力。",
"信上只有几行：“信收到了。你说的话，我记着。草原的风大的时候，我站在码头往北看，能看见山。”",
"信的末尾画了一根草茎的简笔画，草茎旁边歪歪扭扭写了两个字：“等你。”",
"你把信折好，忽然觉得那根草茎画得有点好看。"
],options:[
{t:"把信收进怀里",effects:{flag:"rel_letter_read_ayan",relation:{npc:"ayan",v:2}},go:"fc_innkeep"},
{t:"回信说：风大的时候，我也往北看过",effects:{flag:"rel_letter_read_ayan",relation:{npc:"ayan",v:3}},go:"fc_innkeep"}
]};

/* 回信 · 费尔曼（学院触发） */
N["rel_letter_reply_ferman"]={tag:"branch",place:"北境 · 艾尔达学院 · 教授办公室",pace:"normal",text:[
"学院的回信比驿站快的多——同在北境，驿马跑一天就到了。费尔曼的回信只有一句，写在信纸正中，字迹像刻的：“力量没有代价。有代价的，是选择。你问的问题，等你弄明白答案那天，来找我。”",
"你盯着那行字看了很久。他什么都没说，又好像什么都说了。"
],options:[
{t:"把信收好",effects:{flag:"rel_letter_read_ferman",relation:{npc:"ferman",v:2}},go:"acad_life_y1_open"},
{t:"折好信，去找费尔曼当面问",effects:{flag:"rel_letter_read_ferman",relation:{npc:"ferman",v:3}},go:"acad_life_y1_open"}
]};
