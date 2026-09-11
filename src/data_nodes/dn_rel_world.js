/* /REL5inj:world/ REL-5 关系影响世界（v93）——好感回响节点
   纯数据对象式；零引擎改动；只用新 flag 键（rel_world_*_done）
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   触发：fc_innkeep（蜜尔娜≥60 / 阿岩≥60）、acad_life_y1_open（费尔曼≥60 / 塞西莉娅≥60 / 艾琳≥60） */

/* 蜜尔娜 ≥60 · 柜台下的暗语（情报商机） */
N["rel_world_milna"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"normal",text:[
"打烊后，蜜尔娜把你叫到柜台后，把灯芯拨暗了半寸：“商会这几天往码头搬了三批货，走的夜船，没打商会旗。我托人看了封皮——是铁料和药草。”她看着你，“你在城里有名头，有人想借你的手探路。我只提醒一句：货不干净，别沾。”",
"她说完，又像没事人似的把灯芯挑亮，给你倒了杯热麦酒：“喝了，暖暖。明天该干嘛干嘛。”"
],options:[
{t:"谢她提醒，问清码头方位（记下商机）",effects:{flag:"rel_world_milna_done",gold:5,xp:15,relation:{npc:"milna",v:1}},go:"fc_innkeep"},
{t:"说：我自有分寸，你别卷进来",effects:{flag:"rel_world_milna_done",relation:{npc:"milna",v:2}},go:"fc_innkeep"}
]};

/* 阿岩 ≥60 · 草原的消息（狼群南迁前兆） */
N["rel_world_ayan"]={tag:"branch",place:"自由城邦 · 交汇城 · 码头",pace:"normal",text:[
"阿岩蹲在码头边，正拿刀削一根木棍。见你来，他把木棍往地上一插，压着嗓子说：“我族里有信来——狼群今年南迁得早，比往年早了快一个月。族老说，天要变了。”",
"他顿了顿，抬头看你：“草原上的事，本来跟我们不相干。可你信我，这事迟早要吹到自由城来。”他递给你一根削好的木签，“留着。真到了那天，你拿着它，草原上的人认。”"
],options:[
{t:"收下木签，问他族里还要什么",effects:{flag:"rel_world_ayan_done",xp:15,relation:{npc:"ayan",v:1}},go:"fc_innkeep"},
{t:"说：真有那天，我跟你一起回草原",effects:{flag:"rel_world_ayan_done",relation:{npc:"ayan",v:2}},go:"fc_innkeep"}
]};

/* 费尔曼 ≥60 · 私下的指点（禁书区传闻深化） */
N["rel_world_ferman"]={tag:"branch",place:"北境 · 艾尔达学院 · 教授办公室",pace:"normal",text:[
"费尔曼把一张旧地图铺在桌上，是学院地下层的结构图。他指着一处被墨涂掉的地方：“这里，三十年前是禁书区。后来一场火，烧了大半，剩下的封了。”他抬头看你，“有人跟我说，近来夜里，那附近有脚步声。”",
"他把地图折起来，没有给你：“你好奇心重，我不拦你。只一句——地下三层的钟，响十二下之后，别一个人下去。”"
],options:[
{t:"记下他的话，问：你怎么知道有人夜里去",effects:{flag:"rel_world_ferman_done",xp:20,relation:{npc:"ferman",v:1}},go:"acad_life_y1_open"},
{t:"点头：我明白了，谢教授提点",effects:{flag:"rel_world_ferman_done",relation:{npc:"ferman",v:2}},go:"acad_life_y1_open"}
]};

/* 塞西莉娅 ≥60 · 学生会密谈（换届内幕） */
N["rel_world_cecy"]={tag:"branch",place:"北境 · 艾尔达学院 · 学生会长室",pace:"normal",text:[
"塞西莉娅关上门，给你倒了杯茶——这待遇可不常有。“学生会换届，我这边还差一票。对方是教会派来的那拨人，他们想拿学生会当幌子，查学院里‘来历不明’的学生。”她放下茶壶，看着你，“你算其中一个。”",
"她端起自己那杯，吹了吹热气：“我跟你把话说在前头——我要赢，不是为了权。是为了让学院还是学院。”"
],options:[
{t:"表态支持她，说：算我一票",effects:{flag:"rel_world_cecy_done",xp:15,relation:{npc:"cecy",v:2}},go:"acad_life_y1_open"},
{t:"提醒她：别为了赢，把自己也变成教会那样",effects:{flag:"rel_world_cecy_done",relation:{npc:"cecy",v:3}},go:"acad_life_y1_open"}
]};

/* 艾琳 ≥60 · 诗册新页（伏笔） */
N["rel_world_elin"]={tag:"branch",place:"北境 · 艾尔达学院 · 旧书摊",pace:"normal",text:[
"艾琳递给你一本薄册子，封面没有字。“我抄的，给你看。”她说完就低头翻书，耳朵尖却红了。",
"你翻开，里面是她抄的几首短诗，笔迹清秀。最后一页是新的，墨迹还没干透：“雪落在北境的塔顶/我把手伸进炉火/不是为了取暖/是为了记住/有人递过火种。”",
"她没抬头，声音很轻：“那页……是给你的。”"
],options:[
{t:"收下诗册，说：我也记着这火种",effects:{flag:"rel_world_elin_done",relation:{npc:"elin",v:2}},go:"acad_life_y1_open"},
{t:"认真看完，把册子还她：写得真好",effects:{flag:"rel_world_elin_done",relation:{npc:"elin",v:3}},go:"acad_life_y1_open"}
]};
