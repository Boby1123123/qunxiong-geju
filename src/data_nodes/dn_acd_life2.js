/* ===== /v101inj:dn_acd_life2/ 学院生活沙盒·深化（批次C 30 节点）
 * 承接 v100 方向三框架（dn_acd_life.js）：食堂恩人/玛丽婶/宿舍/巡夜/晨练/老教习/巫拉/学院祭/灯笼谜/烟火/耗子/图书馆禁书区/编年史
 * 全部 go 目标已存在；flag 衔接 hub 条件项；好感 id 沿用既有表。
 */

N["acd_life_morning_enter"] = {
  tag:"branch", place:"学院 · 训练场 · 清晨", where:"白昼", pace:"normal",
  text:[
    "天还没亮透，训练场的沙地蒙着一层白霜。远处木桩上挂着几柄旧剑，剑鞘口结了薄冰。",
    "你哈出一口白气，活动手腕。晨练的人不多——两个低年级生在跑圈，一个高年级生独自在角落打桩，拳拳到肉，闷响在空旷的场地里荡开。",
    "老教习坐在场边的石墩上，左腿伸直，右腿蜷起，手里攥着一只缺了口的搪瓷缸。他看了你一眼，没说话，只把缸里的热茶吹了吹。",
    "晨雾正从学院东墙外漫进来，把钟楼的尖顶拦腰截断。你想起昨晚的事，心里盘着几桩待办——练一练，还是先问问人？"
  ],
  options:[
    {t:"找高年级生切磋一场", effects:{xp:10, timeCost:"1period"}, go:"acd_life_morning_spar"},
    {t:"去老教习身边坐下，听他说话", effects:{timeCost:"1period"}, go:"acd_life_morning_coach"},
    {t:"练完就回（今天先办正事）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_morning_spar"] = {
  tag:"branch", place:"学院 · 训练场 · 沙地", where:"白昼", pace:"deep",
  text:[
    "高年级生放下手里的木桩，抹了把汗，冲你点头：“想练？先说好，我不用真劲。”他叫科尔，三年级，西境人，家里行商，个头不高，步子却极稳。",
    "他随手从兵器架上抽了根齐眉棍，手腕一抖，棍尖在地上点了三下——这是请你先手。",
    "你上前，他侧身让过你第一拳，棍尾横扫，擦着你的肋下掠过。你退半步，他又跟上来，棍头一挑，直取你面门。你偏头，棍梢擦着耳廓过去，带起一阵风。",
    "第二回合你找到破绽，趁他收棍换势，抢进中门，一拳砸在他右肩。他闷哼一声，退了两步，右肩明显塌了一下——他使棍的力道全在右肩，这一下吃实了。",
    "“好拳。”他活动右肩，眉头皱了一下又松开，“我这肩是老伤，被你这拳一压，回去得敷两贴药。你也不轻松——”他指指你左臂，你低头，才发现袖口被棍尾扫出一道口子，小臂内侧擦红了一片，火辣辣地疼。",
    "他弯腰把棍放回架子，回头看了你一眼：“练得不错。以后早上这个点，我都在这儿。你要是想学棍，我教你——不过得带伤药来。”"
  ],
  options:[
    {t:"谢过科尔，答应改日再来", effects:{relation:{npc:"acd_coach", v:0}, hp:-3, xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"趁热打铁，问他学院里最近有什么怪事", effects:{xp:10, timeCost:"1period"}, go:"acd_life_morning_coach_ask"},
    {t:"（记下他右肩的旧伤，不再追问）", effects:{xp:5, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_morning_coach"] = {
  tag:"branch", place:"学院 · 训练场 · 石墩", where:"白昼", pace:"normal",
  text:[
    "老教习往旁边挪了挪，给你腾出半个石墩。他左腿始终伸着，裤管下沿露出半截木腿——那是一条假肢，铁打的，接在膝盖下面。",
    "“铁门关。”他忽然开口，像是自言自语，“第十年守关，雪地里站了三天三夜，冻掉了左脚。军医说保不住，就锯了。”他把搪瓷缸递过来，“喝口？茶是粗茶，暖身子。”",
    "你没接，他就自己喝了一口：“学院这份差事清闲，比守关强。就是这地方怪事多——”他顿了顿，望着晨雾里的钟楼，“这些年，失踪的学生，早上失踪前都去过钟楼。三个了。”",
    "他不再往下说，只拿拇指摩挲着搪瓷缸的缺口。风从训练场那头吹过来，把雾吹散了些，钟楼的尖顶露了出来。"
  ],
  options:[
    {t:"追问：那三个学生失踪前有什么共同点", effects:{timeCost:"1period"}, go:"acd_life_morning_coach_ask"},
    {t:"谢过老教习的茶，起身告辞", effects:{relation:{npc:"acd_coach", v:3}, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_morning_coach_ask"] = {
  tag:"branch", place:"学院 · 训练场 · 石墩", where:"白昼", pace:"normal",
  text:[
    "老教习把搪瓷缸放在膝上，想了一会儿：“头一个，埃尔文，十三年前，炼金系二年级，失踪前那几天逢人就问钟楼怎么上去。第二个，赛拉，七年前，也是炼金系二年级——她失踪前，有人看见她半夜站在钟楼下，仰着头，一动不动，站到后半夜。”",
    "“第三个，就是上个月的事，马尔科。”他压压着声音音，“他失踪前那晚，钟楼敲了十三下。”",
    "“子夜十三下？”你追问。他点头：“学院里人人都说是闹鬼，可我在铁门关守了十年，什么鬼没见过——鬼不会数数，更不会只挑炼金系二年级的学生数。”",
    "他站起身，拍拍裤腿：“年轻人，话我只能说到这儿。钟楼的钥匙在敲钟老头那儿，白天他都在。”说完他拄着假肢往兵器架走，走得很稳。"
  ],
  options:[
    {t:"（把老教习的话记在心里）", effects:{flag:"acd_coach_hint", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"去钟楼看看", effects:{timeCost:"1period"}, go:"acd_plot_bell_day"}
  ]
};

N["acd_life_job_hub"] = {
  tag:"branch", place:"学院 · 勤工处", where:"任意", pace:"normal",
  text:[
    "勤工处的告示板上钉着三张纸，纸角都被风吹卷了：图书馆招夜间整理员，工钱三个铜子一晚；食堂招帮厨，管饭；药房招盘货学徒，工钱五个铜子，但要会识字。",
    "看板的胖管事打了个哈欠：“都缺人。图书馆那位老馆长脾气怪，食堂玛丽婶嘴碎，药房那个薇拉姑娘——唉，你自己去看了就知道。”",
    "三份活计，三处门道。你捏着告示，盘算着去哪边。"
  ],
  options:[
    {t:"去图书馆当夜间整理员", effects:{timeCost:"1period"}, go:"acd_life_job_lib_deep"},
    {t:"去食堂帮厨", effects:{timeCost:"1period"}, go:"acd_life_job_kitchen_night"},
    {t:"去药房盘货", effects:{timeCost:"1period"}, go:"acd_life_job_apoth_senior"},
    {t:"（先不打工，回学院）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_job_lib_deep"] = {
  tag:"branch", place:"学院 · 图书馆 · 地下一层", where:"黑夜", pace:"deep",
  text:[
    "深夜的图书馆比白天安静得多，只有油灯的火苗在玻璃罩里用指腹跳。老馆长把一串钥匙系在腰带上，交给你一摞要归档的书：“地下一层，靠墙那排架子，书脊朝外，别放反了。”",
    "你抱着书下到地下一层。这里灯光更暗，书架间的走道只容一人侧身。你按字母归着书，忽然发现最里排书架后面有一道铁门，门上新挂了一把锁——锁扣很新，铜色还没氧化。",
    "你蹲下看了看锁，又看看地面：铁门前的灰尘里有一道拖痕，像是有什么重物被拖进去过，拖痕尽头是一小片暗色的渍迹。",
    "你把书放好，记下了铁门的位置。老馆长在上面喊你收工，你应了一声，心里却把那道铁门和那片暗渍一起记住了。"
  ],
  options:[
    {t:"（把铁门的事记下，回去再查）", effects:{flag:"acd_lib_work", xp:10, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"试着撬锁进去看看", check:{a:"AGI", sk:"stealth", label:"潜行"}, tier:{ok:["锁有点旧，你借着阴影撬了半炷香，锁开了——里面是一段往下的石阶，黑得看不清。"], fail:["锁太新，你撬了几下没开，还差点弄出声响。你只好先退开。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_life_lib_step"}
  ]
};

N["acd_life_job_lib_restricted"] = {
  tag:"branch", place:"学院 · 图书馆 · 禁书区", where:"任意", pace:"normal",
  text:[
    "老馆长看你手脚勤快，破例让你进禁书区整理书架：“只准碰书架，不准翻书。书里那些东西，看了要折寿。”他说得认真，不像开玩笑。",
    "禁书区光线很暗，书脊上的烫金字在油灯下泛着暗光。你整理到第三排，抽出一本《灵魂嫁接考》——书页间夹着一张字条，墨迹很新：",
    "“钟楼。第十三下。不可声张。”",
    "字条上没有署名，纸角却印着一个干涸的指印，指腹处有一道细小的烫痕——那是炼金学徒做坩埚实验才会留下的疤。"
  ],
  options:[
    {t:"把字条收好（这指印像某人的）", effects:{flag:"acd_lib_restricted_page", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"把字条放回原处，假装没看见", effects:{xp:5, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_job_lib_borrow"] = {
  tag:"branch", place:"学院 · 图书馆 · 借阅台", where:"任意", pace:"normal",
  text:[
    "收工时，老馆长坐在借阅台后翻一本旧册子。他翻到某一页，手指停住，半天没动。",
    "你凑过去看——那是三年前的借阅记录，最后一行写着：“莫教授，借《灵魂嫁接考》上册，未还。”",
    "“莫教授是学院里教炼金的，三年前死了。”老馆长声音很平，“有人说他是自尽，有人说不是。书到现在没还回来，我找了三年，整个图书馆翻遍了，没有。”他合上册子，“他死前一天，还来借过这本书。借得那么急，像是要赶着读什么。”",
    "你想起禁书区那张字条，忽然觉得后背发凉。"
  ],
  options:[
    {t:"（把借阅记录记下）", effects:{flag:"acd_borrow_card", relation:{npc:"acd_librarian", v:5}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问老馆长：莫教授死前还借过什么", effects:{timeCost:"1period"}, go:"acd_life_dining_cook_ask"}
  ]
};

N["acd_life_job_kitchen_night"] = {
  tag:"branch", place:"学院 · 食堂 · 后厨", where:"黑夜", pace:"normal",
  text:[
    "后厨的灶火烧得正旺，蒸汽把灯罩熏得发黄。玛丽婶系着围裙，正拿长柄勺搅一锅浓汤，头也不抬：“新来的？先把那筐土豆削了，削完把灶台擦一遍。”",
    "你削着土豆，玛丽婶忽然开口：“你昨晚没来帮厨，是去查那个马尔科的事了？”你手一顿。她哼了一声：“学院里这点事，瞒得过谁。马尔科那孩子我认识，隔三差五来后厨要热水，说是兑药——哪有人用热水兑药，都是拿凉水。”",
    "她把汤勺往锅里一敲：“他失踪前那晚，还来要过一壶热水。我说天晚了，让他别一个人走夜路。他说——”她学着马尔科的口气，“‘婶，钟楼那边晚上暖和，我去那儿待一会儿。’”",
    "她说完，又低头搅汤，不再看你。"
  ],
  options:[
    {t:"追问：那晚之后还有谁去过钟楼", effects:{timeCost:"1period"}, go:"acd_life_job_kitchen_helper"},
    {t:"谢过玛丽婶，把话记下", effects:{flag:"acd_meal_sent", relation:{npc:"acd_cook", v:5}, xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_job_kitchen_helper"] = {
  tag:"branch", place:"学院 · 食堂 · 后厨", where:"任意", pace:"light",
  text:[
    "帮厨的小子叫阿福，本地人，十五六岁，跑堂跑得飞快。你问他钟楼的事，他左右看看，压压着声音音：“那晚我送夜宵，看见温教员从钟楼那边过来，走得特别快，怀里抱着个食盒。”",
    "“食盒？什么样的？”你问。阿福比划了一下：“红漆的，盖子上画着个秤砣——不对，是秤。学院的秤砣社就爱用那玩意儿当标记。”",
    "“温教员平时人挺好的，总给学生带吃的。”阿福挠挠头，“可那晚他走得急，连我跟他打招呼都没理。”"
  ],
  options:[
    {t:"（记下：温教员 + 红漆食盒 + 秤形标记）", effects:{flag:"acd_kitchen_rumor", xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_job_apoth_senior"] = {
  tag:"branch", place:"学院 · 药房", where:"任意", pace:"normal",
  text:[
    "药房比图书馆还冷，一排排木柜贴着墙，抽屉上贴着药名，空气里弥漫着干草和硫磺的味道。盘货的学姐叫薇拉，戴一副单片眼镜，正拿鹅毛笔在账册上写着什么。",
    "“盘货？”她头也不抬，“仓库第三排，银月草、血根、蛇蜕，各点一遍，数目对得上就签个字。”",
    "你进仓库点货，发现银月草的罐子少了一罐——账册上记着二十三罐，实点二十二罐。罐口有新鲜的划痕，像是刚被人撬开过。",
    "你出来想跟薇拉说，却看见她正盯着柜台上一个空瓶子出神。那瓶子没有火漆封口，瓶口还有一圈药渍——是刚用过的。"
  ],
  options:[
    {t:"把银月草少一罐的事告诉薇拉", effects:{timeCost:"1period"}, go:"acd_life_job_apoth_stock"},
    {t:"（先不说，只记下数目）", effects:{flag:"acd_stock_odd", xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_job_apoth_stock"] = {
  tag:"branch", place:"学院 · 药房 · 柜台", where:"任意", pace:"normal",
  text:[
    "薇拉听你说完银月草少了一罐，眉头动了一下，把空瓶子收进抽屉：“知道了。这事你别往外说。”",
    "“银月草是做什么用的？”你问。她推了推眼镜：“止血、安神，也——”她停了一下，“也有些人拿来配别的。莫教授生前教过我，银月草配血根，能做出一种让人沉睡的药。睡得很沉，醒不来那种。”",
    "“莫教授是你老师？”你问。她沉默了一会儿：“他是我师父。他死那年，我才进药房。他死前三天，让我把药房所有的银月草都锁起来。”她顿了顿，“他说，‘钟楼那边的账，迟早要还的。’”",
    "她说完把账册合上，不再开口。窗外的风把药房的幌子吹得哗啦响。"
  ],
  options:[
    {t:"追问莫教授死的事", effects:{timeCost:"1period"}, go:"acd_life_dining_cook_ask"},
    {t:"（把薇拉的话记下）", effects:{flag:"acd_stock_told", relation:{npc:"acd_apoth_senior", v:5}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_social_hub"] = {
  tag:"branch", place:"学院 · 长廊", where:"任意", pace:"normal",
  text:[
    "午后的长廊很热闹，学生三三两两靠着柱子聊天。塞西莉亚坐在窗台上，膝盖上摊着一本书，却没看，眼睛望着窗外。",
    "耗子——大家都这么叫他，因为他瘦小，跑得快——正蹲在廊柱后面，拿一根树枝在泥地上画着什么。看见你，他立刻把树枝一丢，跳起来挥手：“哥！这儿！”",
    "两个人，两条线。你走过去，不知道该先找谁。"
  ],
  options:[
    {t:"找塞西莉亚说话", effects:{timeCost:"1period"}, go:"acd_life_celia_notes"},
    {t:"找耗子说话", effects:{timeCost:"1period"}, go:"acd_life_hao_letter"},
    {t:"（都不找，回学院）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_celia_notes"] = {
  tag:"branch", place:"学院 · 长廊 · 窗台", where:"白昼", pace:"normal",
  text:[
    "塞西莉亚抬头看你一眼，把书合上：“是你啊。”她顿了顿，从书页里抽出一张叠好的纸，“正想找你——这是我在图书馆捡到的。”",
    "纸上是一幅画，画的是钟楼，笔触很细。画的右下角写着一行小字：“第十三下，等他来。”",
    "“画得很用心。”塞西莉亚说，“我捡到的时候，纸还是温的——放画的人刚走。我追出去，只看见一个背影，穿灰袍，走得很快，往钟楼那边去了。”",
    "她把画递给你：“你要查马尔科的事，这画或许有用。别谢我，就当还你上次的人情。”"
  ],
  options:[
    {t:"收下画（灰袍背影 + 钟楼）", effects:{flag:"acd_celia_hint", relation:{npc:"acd_celia", v:5}, item:"old_notebook", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"约塞西莉亚改天一起去钟楼看看", effects:{relation:{npc:"acd_celia", v:8}, xp:10, timeCost:"1period"}, go:"acd_life_celia_walk"}
  ]
};

N["acd_life_celia_walk"] = {
  tag:"branch", place:"学院 · 钟楼 · 小径", where:"白昼", pace:"normal",
  text:[
    "钟楼前的石子小径上，塞西莉亚走在你旁边，步子比平时慢。她看着钟楼的尖顶：“我爸说，钟楼以前不是这个样子的。他说他小时候，钟楼顶上有个平台，学生可以在上面看星星。”",
    "“后来呢？”你问。“后来封了。”她说，“说是年久失修，怕出事。可我总觉得不是——”她停住，指着一楼侧墙，“你看那儿。”",
    "侧墙的砖缝里嵌着一截铁环，锈得发黑，像是什么东西被锁进去过又拆走了。塞西莉亚蹲下看了看：“这铁环的样式，跟我家老宅拴马桩上的一样——是拴重物用的。”",
    "她站起身，拍拍裙摆：“钟楼里拴过重物。重到要打铁环。”她没再多说，转身往回走，走了几步又回头，“你要是真去查，别一个人半夜去。”"
  ],
  options:[
    {t:"（把铁环的事记下）", effects:{flag:"acd_celia_gift", relation:{npc:"acd_celia", v:8}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_hao_letter"] = {
  tag:"branch", place:"学院 · 长廊 · 廊柱后", where:"任意", pace:"normal",
  text:[
    "耗子把你拉到廊柱后面，神神秘秘地掏出一封信：“哥，你帮我个忙——替我把这个送到钟楼那边的石台底下。”",
    "你接过信，信封上画着个简陋的记号，像是两片叶子。“这是给谁的？”你问。耗子挠头：“给温教员的。我、我欠他个人情——上回我翻墙被逮住，是他替我求的情。”",
    "“那你为什么不自己送？”耗子脸一红：“钟楼那地方，晚上我害怕。哥你胆子大，帮我这一回，回头我请你吃烤红薯。”",
    "他眼巴巴看着你，信封在你手里轻飘飘的，却像压着什么分量。"
  ],
  options:[
    {t:"答应帮耗子送信", effects:{flag:"acd_hao_errand", relation:{npc:"acd_hao", v:8}, xp:10, timeCost:"1period"}, go:"acd_life_hao_map"},
    {t:"婉拒：这事你自己办", effects:{relation:{npc:"acd_hao", v:-3}, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_hao_map"] = {
  tag:"branch", place:"学院 · 钟楼 · 石台", where:"任意", pace:"light",
  text:[
    "你替耗子把信塞进钟楼侧面的石台底下，正要起身，却摸到石台内侧刻着东西——是几道歪歪扭扭的刻痕，像是小刀划的。",
    "你凑近看：刻痕组成了一个小箭头，指向钟楼背面。箭头下面刻着两个字——“后门”。",
    "钟楼有后门？你绕到背面，果然在藤蔓后面找到一扇半人高的木门，门板发黑，锁孔里插着半截断钥匙。"
  ],
  options:[
    {t:"（把后门位置记下）", effects:{flag:"acd_clock_map", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"试着转动断钥匙", check:{a:"AGI", sk:"stealth", label:"撬锁"}, tier:{ok:["断钥匙转了一下，门轴发出涩响，门开了一条缝——里面是一股潮湿的、混着药味的风。"], fail:["断钥匙卡死了，你怕弄出动静，没敢再拧。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_clock_floor2"}
  ]
};

N["acd_life_lib_hub"] = {
  tag:"branch", place:"学院 · 图书馆 · 深夜", where:"黑夜", pace:"normal",
  text:[
    "深夜的图书馆只剩走廊尽头一盏灯。管理员趴在桌上打盹，呼噜打得有节奏。",
    "你放轻脚步进去。书架投下长长的影子，安静得能听见自己的心跳。今晚你想找点什么——或者，看看书架深处藏着什么。"
  ],
  options:[
    {t:"去地下一层，看那道铁门", effects:{timeCost:"1period"}, go:"acd_life_lib_step"},
    {t:"翻《钟楼编年史》", effects:{timeCost:"1period"}, go:"acd_life_lib_chron"},
    {t:"（不冒险，回学院）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_lib_step"] = {
  tag:"branch", place:"学院 · 图书馆 · 地下一层 · 铁门", where:"黑夜", pace:"deep",
  text:[
    "你摸到地下一层最里排书架后面。铁门上的锁还是那把新锁。你贴着门听了一会儿——门里很安静，但有一股风从门缝底下渗出来，带着潮湿的土腥味。",
    "你蹲下看门缝：铁门下沿磨得发亮，是经常有人进出的痕迹。门缝里卡着一小片布，灰绿色的——你拈起来，布边烧焦了一小块，像是被什么东西烫的。",
    "这把锁撬不开，但门缝里的布片，灰绿色、烧焦边——你在哪里见过这个颜色。你捏着布片，忽然想起：学院里穿灰袍的，只有一个地方。",
    "你把布片收好，退了出去。身后铁门里传来极轻的一声响，像是什么东西在暗处挪动了一下。"
  ],
  options:[
    {t:"（把灰绿色布片收好）", effects:{flag:"acd_lib_basement", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"再听一会儿，确认里面有没有人", check:{a:"SPR", sk:"detect", label:"感知"}, tier:{ok:["你贴着门听了很久，听见里面传来极轻的、规律的呼吸声——有人，而且不是一个人。"], fail:["你听了很久，什么也没听见。或许只是风。"]}, effects:{xp:10, san:-3, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_lib_chron"] = {
  tag:"branch", place:"学院 · 图书馆 · 编年史区", where:"黑夜", pace:"normal",
  text:[
    "《钟楼编年史》放在最底层的架子上，落满灰尘。你抽出来翻——前面几十页都是钟楼的建造、修缮记录，枯燥得很。",
    "翻到后半本，你发现有一页被撕掉了。撕口很新，是最近的事。被撕掉的那页前后是连着的记录：前一页写着“钟楼第二层，曾用作储藏室，二十年前改建”，后一页写着“钟楼地下，曾设暖房，供冬季取暖”——中间那页，正是写地下和二楼之间通道的。",
    "你合上书，指腹按在撕口上。有人不想让后来的人知道钟楼二楼和地下之间的通道。"
  ],
  options:[
    {t:"（记下：钟楼有二楼到地下的通道）", effects:{flag:"acd_chron_torn", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"把被撕页的事告诉老馆长", effects:{relation:{npc:"acd_librarian", v:5}, xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_festival2"] = {
  tag:"branch", place:"学院 · 学院祭 · 广场", where:"白昼", pace:"normal",
  text:[
    "学院祭的广场上支满了棚子，彩带从楼顶垂下来，在风里翻卷。卖糖画的、套圈的、猜灯谜的，吆喝声混成一片。",
    "广场中央搭了个比武台，围着一圈人，喝彩声一阵接一阵。东边是猜灯谜的棚子，挂着一串红灯笼，谜面写在纸条上，随风轻晃。",
    "烟火要到入夜才放。你站在人堆里，一时不知道先去哪儿。"
  ],
  options:[
    {t:"去比武台看热闹", effects:{timeCost:"1period"}, go:"acd_life_festival_fight"},
    {t:"去猜灯谜", effects:{timeCost:"1period"}, go:"acd_life_festival_lantern"},
    {t:"等晚上的烟火", effects:{timeCost:"1period"}, go:"acd_life_festival_meet"},
    {t:"（回学院）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_festival_fight"] = {
  tag:"branch", place:"学院 · 学院祭 · 比武台", where:"白昼", pace:"deep",
  text:[
    "比武台上正打得热闹。台上两人你来我往，台下叫好声震天。你挤到前排，忽然注意到一个站在人群边缘的人——",
    "那是个瘦高个，穿着洗得发白的旧袍子，右手腕上系着一根旧秤色的手绳——那颜色，你在秤砣社的徽记上见过。他盯着台上，神情却不像在看比武，眼神一直往钟楼的方向飘。",
    "你顺着他的视线看过去：钟楼的窗口，像有有个影子一闪而过。",
    "瘦高个察觉到你的视线，立刻收回视线，混进人群里，几步就不见了。他刚才站的地方，地上落着一样东西——你弯腰捡起来，是一截折下来的旧秤色手绳。"
  ],
  options:[
    {t:"（把旧秤色手绳收好）", effects:{flag:"acd_plot_clue_shadow", item:"broken_scale", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"追上去", check:{a:"AGI", sk:"athletic", label:"追踪"}, tier:{ok:["你在人群里挤过几条街，终于又看见那个瘦高个——他拐进了钟楼侧面的小路，一闪就不见了。"], fail:["人太多，你追出几步就丢了。他像条鱼一样滑进人堆里。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_clock_floor2"}
  ]
};

N["acd_life_festival_lantern"] = {
  tag:"branch", place:"学院 · 学院祭 · 灯谜棚", where:"白昼", pace:"normal",
  text:[
    "灯谜棚前围了不少人。摊主是个留着山羊胡的老头，眯着眼：“猜中一个，换一块酥糖；猜中三个，换一本旧书——书都是学院图书馆淘汰的，随便挑。”",
    "你抬眼看去，头一盏灯笼上写着谜面：“秤不离砣，砣不离秤——打一字。”",
    "第二盏：“水落石出——打一物。”",
    "第三盏：“两头平，中间空，称尽天下不公平——打一物。”",
    "你摸着下巴，谜面都跟“秤”有关。这个学院，怎么到处都是秤的影子。"
  ],
  options:[
    {t:"猜：砣（第一个谜底）", check:{a:"INT", sk:"lore", label:"学识"}, tier:{ok:["‘秤不离砣’——砣。老头眯眼一笑：“中了。”递给你一块酥糖。"], fail:["你答错了，老头摇摇头，周围人哄笑。"]}, effects:{timeCost:"1period"}, go:"acd_life_festival_lantern"},
    {t:"猜：秤（三个谜底都是秤）", check:{a:"INT", sk:"lore", label:"学识"}, tier:{ok:["“秤不离砣”是砣，“水落石出”是秤砣入水，“称尽天下不公平”是秤。你连猜中三个，老头捋着胡子递来一本旧书——封皮写着《金秤考》。“这本啊，是学院老早以前的书，讲一个家族的。”他说，“现在没人看了。”"], fail:["你只猜中两个，差一个。老头笑呵呵地给了你两块酥糖。"]}, effects:{xp:15, item:"old_notebook", flag:"acd_lantern_win", item:"old_notebook", timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_festival_meet"] = {
  tag:"branch", place:"学院 · 学院祭 · 烟火", where:"黑夜", pace:"normal",
  text:[
    "入夜，烟火在钟楼尖顶上炸开，金红的光把半个学院映得忽明忽暗。人群仰着头，齐声惊叹。",
    "你站在人群边上，忽然看见塞西莉亚——她没在看烟火，而是望着钟楼的方向。烟火的光映在她脸上，她轻声说：“你看钟楼二楼那个窗户。”",
    "你顺着她指的方向看去：钟楼二楼的窗户透出一点昏黄的光，一闪，又灭了。像有人在那扇窗后点了一支蜡烛，又立刻捂住了。",
    "“白天看，那窗户是封死的。”塞西莉亚说，“封死的窗户，怎么会透出光来？”烟火又炸开一朵，把她的脸照亮。她没再说下去，但你知道，她也注意到了。"
  ],
  options:[
    {t:"（记下：钟楼二楼封窗透光）", effects:{flag:"acd_roof_rule", relation:{npc:"acd_celia", v:8}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"跟塞西莉亚说：改天一起去看个究竟", effects:{relation:{npc:"acd_celia", v:8}, timeCost:"1period"}, go:"acd_life_celia_walk"}
  ]
};

N["acd_life_dining_benefactor"] = {
  tag:"branch", place:"学院 · 食堂 · 角落", where:"任意", pace:"deep",
  text:[
    "食堂角落坐着一个陌生的年轻人，面前摆着一碗粥，粥已经凉了，他也没动。他衣服的袖口磨得发白，手腕上有几道陈旧的伤疤，像是被什么东西抓过的痕迹。",
    "你在他对面坐下。他抬头看你一眼，又低下头：“你坐这儿干嘛？这儿没人坐。”",
    "“那你怎么一个人坐这儿？”你问。他沉默了一会儿：“我不习惯跟人一桌。”他顿了顿，又说，“你是新来的吧？这学院里，坐我这桌的，都是没人搭理的。”",
    "他叫洛根。西境人，家里遭了兽潮，爹娘都没了，他一个人逃出来，走了两个月，饿得只剩一把骨头，是学院收留了他。",
    "“我知道学院里有人说我是野种。”他捏着勺子，指节发白，“可我不偷不抢。食堂的活我抢着干，图书室的灰我擦得最干净。”他抬头，眼睛很亮，“我只是想让人知道，西境逃出来的，不全是废物。”",
    "你说不出话。他低头喝了一口凉粥，没再抬头。"
  ],
  options:[
    {t:"把自己的菜分他一半", effects:{flag:"acd_benefactor_known", relation:{npc:"acd_benefactor", v:12}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问他：西境兽潮那几年的事", effects:{timeCost:"1period"}, go:"acd_life_dining_benefactor"}
  ]
};

N["acd_life_dining_cook"] = {
  tag:"branch", place:"学院 · 食堂 · 后厨", where:"任意", pace:"normal",
  text:[
    "你掀开后厨的帘子，玛丽婶正拿长柄勺搅汤，见你进来，头也不抬：“又来了？这回是要问什么？”",
    "“想问莫教授的事。”你说。玛丽婶搅汤的手停了一下。",
    "“莫教授——”她重复了一遍，把勺子放下来，擦擦手，“那是个好人。学院里都说他自尽，我不信。他死前一天，还来食堂吃饭，把我做的粥喝了个干净，说‘婶，你做的粥是这学院里唯一热乎的东西’。”",
    "“他那天看着就不对劲，吃得特别慢，像在等什么。吃完他站起来，跟我说——”玛丽婶顿了顿，“‘婶，要是有人问起我，你就说我去钟楼了。’”",
    "“第二天，他死在钟楼下面。”玛丽婶重新拿起勺子，搅了搅汤，“钟楼。又是钟楼。你们一个个，怎么都往那儿跑。”"
  ],
  options:[
    {t:"追问：莫教授死前那几天，还见过谁", effects:{timeCost:"1period"}, go:"acd_life_dining_cook_ask"},
    {t:"谢过玛丽婶，把话记下", effects:{flag:"acd_cook_talked", relation:{npc:"acd_cook", v:8}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_dining_cook_ask"] = {
  tag:"branch", place:"学院 · 食堂 · 后厨", where:"任意", pace:"normal",
  text:[
    "玛丽婶想了想：“莫教授死前那几天，总有一个穿灰袍的人来找他。俩人在后厨外头的槐树下说话，声音压得极低，我一靠近他们就不说了。”",
    "“灰袍？学院的教员里，有几个穿灰袍的？”你问。玛丽婶说：“教炼金术的温教员就总穿灰袍。可那会儿温教员刚来学院没几年，跟莫教授也不熟——谁知道他们说什么呢。”",
    "“还有——”她压压着声音音，“莫教授死那天早上，我看见温教员从钟楼那边过来，袍子下摆沾着露水，像是走了很远的路。”",
    "她说完又去搅汤，汤锅咕嘟咕嘟响着。窗外的槐树叶子被风吹得沙沙响。"
  ],
  options:[
    {t:"（把灰袍人 + 温教员的事记下）", effects:{flag:"acd_warden_seen", xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_dorm_letter"] = {
  tag:"branch", place:"学院 · 宿舍", where:"任意", pace:"normal",
  text:[
    "傍晚回宿舍，门缝里塞着一封信。你拆开——是家里寄来的，信纸上还带着一股晒谷场的味道。",
    "“吾儿见字如面。家中安好，勿念。你爹的腿好些了，能下地走两步。村口的槐树开花了，你娘说你小时候最爱爬那棵树。钱够用吗？不够来信说一声，家里卖了两斗粮，给你攒着。”",
    "信的最后，娘添了一行字，笔迹比前面潦草：“听说学院里不太平，夜里别乱跑。你爹说，钟楼那种老地方，邪性。”",
    "你把信叠好，压在枕头底下。窗外，钟楼的影子斜斜地投在地上，像一根手指指着天。"
  ],
  options:[
    {t:"（把家信收好，记下娘的叮嘱）", effects:{xp:10, san:3, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"睡不着，出去走走", effects:{timeCost:"1period"}, go:"acd_life_dorm_nightguard"}
  ]
};

N["acd_life_dorm_nightguard"] = {
  tag:"branch", place:"学院 · 巡夜道", where:"黑夜", pace:"normal",
  text:[
    "夜里的学院很静，只有巡夜人的脚步声在石板路上响。你在回廊拐角撞上一个佝偻的身影——是个老兵，挎着旧刀，背有些驼。",
    "“学生？”他打量你一眼，“这么晚不睡，当心明天上课打瞌睡。”他说话带着北境口音，一开口就露了底。",
    "你问他怎么来学院的。他嗤了一声：“铁门关退下来的，没仗打了，学院雇我巡夜。清闲。”他顿了顿，“就是这地方比关外还邪性。”",
    "“怎么说？”你问。他压压着声音音：“我巡夜三年，每回钟楼敲十三下那天晚上，都看见有人往钟楼走。我追过去，人就不见了。三回了——回回都是炼金系的学生。”",
    "他拍拍你的肩：“小子，老话讲，半夜钟声十三响，不是报时，是叫人。你别去凑那个热闹。”"
  ],
  options:[
    {t:"追问：那些学生后来怎么样了", effects:{xp:5, timeCost:"1period"}, go:"acd_life_dorm_roof"},
    {t:"谢过老兵，回宿舍", effects:{flag:"acd_nightguard_tale", xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_life_dorm_roof"] = {
  tag:"branch", place:"学院 · 宿舍 · 天台", where:"黑夜", pace:"normal",
  text:[
    "宿舍天台的门常年锁着，但你发现锁芯松了——用指甲一拨就开。你推门出去，夜风灌了进来，吹得人清醒。",
    "天台正对着钟楼。满月下，钟楼的轮廓清清楚楚。你盯着二楼那扇窗户——忽然，窗里亮了一下。",
    "不是烛光，是那种幽幽的、偏青的光，亮了一瞬就灭了。隔了一会儿，又亮了一下。像是有人在窗后点了一盏青色的灯，又迅速遮住。",
    "你数了数时间——亮一下，隔很久，又亮一下。这个节奏，不像点灯，倒像——在打信号。"
  ],
  options:[
    {t:"（记下：满月夜钟楼二楼青光亮两下）", effects:{flag:"acd_roof_rule", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"现在就下天台，去钟楼看看", effects:{timeCost:"1period"}, go:"acd_plot_clock_wait2"}
  ]
};
