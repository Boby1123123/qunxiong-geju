/* ===== 群雄割据 M9 卷D 后四势力线（dn_faction2.js）=====
 * 东境承天/兽人诸部/矮人山国/精灵林邦 各 13 节点
 * schema：N["id"]={pace:"light",tag,place,where,pace,sceneTitle,text[],options[]}
 * 阵营互斥 run + 背叛出口 faction_traitor_1（与 M8 同构）
 * 文风：V66 古典白描；30 治理词禁；战斗四段式；中文引号成对
 */
/* ================= 势力五：东境承天 ================= */
N["faction_east_1"]={tag:"main",place:"东境 · 承天城 · 帝京门",where:"白昼",pace:"normal",sceneTitle:"阵营 · 东境承天",text:[
"战火烧到东境的时候，承天城的城门反而关得比往常更严。",
"城门口排着长队，盘查的禁军挨个看路引、验身契，动作慢得像在熬粥。一个穿青袍的主簿站在城门洞里，手里攥着一叠名册，见你走过来，上下打量：“北边来的？会写字吗？”",
"他见你点头，把名册往你手里一塞：“承天缺的不是刀，是能算账、能写字的人。你先把这叠名册誊清，誊得好，就留在官署当差。”",
"你低头看那叠名册——每一页，都是一个从北边逃来的名字。"
],options:[
{t:"（应下差事，留在承天官署）",effects:{xp:20,flag:"faction_join_east"},run:function(){if(S.faction&&S.faction!=="east"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.north=(S.infl.north||0)-8;S.infl.desert=(S.infl.desert||0)-6;}}S.faction="east";},go:"faction_east_2"},
{t:"（先四处看看，再决定留不留）",effects:{xp:12},go:"faction_east_2"},
{t:"（东境的水太深，不蹚）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_east_2"]={tag:"main",place:"东境 · 承天城 · 科举特科考场",where:"白昼",pace:"deep",text:[
"承天城开了一科特科——战时取士，不论出身，考中了就入官署。",
"考场设在城西的贡院，院子里坐满了人：有落魄书生，有退役老卒，还有一个赶了三天路、满脚泥的猎户。卷子发下来，题目只有一道：“战时，民以何为重。”",
"你提笔想了一阵，写了一句：“民以食为重，食以路为重。路通则粮通，粮通则民安。”",
"交卷的时候，主考的学士多看了你一眼。那一眼很淡，但你读得懂——承天城里，能写出这句话的人不多。", "承天城的灯火远了。夜风凉，你把心思收回来，专心赶路。"],options:[
{t:"（把卷子交上去，等放榜）",effects:{xp:24,infl:{east:8},flag:"faction_east_exam"},go:"faction_east_3"}
]};

N["faction_east_3"]={tag:"main",place:"东境 · 承天城 · 官署",where:"白昼",pace:"deep",text:[
"放榜那日，你的名字挂在丙等。不算高，但入了官署的册子。",
"青袍主簿把你领到户房，指着一屋子账册：“战时粮秣、军械、丁口，全在这里。你的差事，就是把它们理清楚。”",
"你翻了三天账，翻出一处对不上：有一批军粮，账上记着已发往北境，可押运的单据全是空白。你拿着账册去找主簿，他盯着那页纸看了很久，说：“这件事，你就当没看见。”",
"你合上账册。窗外的天阴着，像要下雪——承天城的天，从来都是这么阴着的。", "别过承天城，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（把账册放回去，先保住差事）",effects:{xp:18,infl:{east:8},flag:"faction_east_hush"},go:"faction_east_4"},
{t:"（暗地里查那批军粮的下落）",effects:{xp:26,infl:{east:4},flag:"faction_east_probe"},go:"faction_east_4"}
]};

N["faction_east_4"]={tag:"main",place:"东境 · 承天城 · 官署档房",where:"夜",pace:"deep",sceneTitle:"旧档 · 晨天故都",text:[
"承天官署的档房里，压着半屋子旧档。",
"你借着查军粮的机会，翻到一叠更老的东西：景和年间的东境档册，纸页发黄，字迹褪得几乎认不出。有一页上写着“晨天”两个字——那是几十年前一夜之间封城的故都。",
"你想起路上听过的传说：晨天城覆灭前一夜，井水变浑，城里的钟自己响了三声。档册上没有记载结局，只在这页的末尾，用朱笔画了一道线，线下写着一个字：弃。",
"你把档册合上，塞回原处。承天城把晨天故都从册子上抹掉了，可抹不掉的是那些还在找它的人。", "你与承天城作别，踏上旅途。尘土扑上靴面，像旧识。"],options:[
{t:"（把晨天故都的线索记在心里）",effects:{xp:24,infl:{east:6},flag:"faction_east_chen"},go:"faction_east_5"}
]};

N["faction_east_5"]={tag:"main",place:"东境 · 边关 · 军报驿",where:"白昼",pace:"normal",sceneTitle:"军报 · 边关的风",text:[
"战时军报一日三封，从边关送往承天。",
"你的差事多了一件：誊抄军报。北境吃紧、西境戒严、沙漠借道——每一条消息落在纸上，都是一笔人命。",
"有一天，军报里夹了一封私信，是边关传令兵写的，纸角已经磨破：“家母病重，求官署批三日假。”你看着那封信，笔悬在半空。",
"战时缺人，边关的传令兵，一个萝卜一个坑。批，还是不批。", "边关的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（批了：人命比军务重）",effects:{xp:22,infl:{east:4},flag:"faction_east_mercy"},go:"faction_east_6"},
{t:"（不批：战时无小事）",effects:{xp:16,infl:{east:8},flag:"faction_east_strict"},go:"faction_east_6"}
]};

N["faction_east_6"]={tag:"main",place:"东境 · 承天城 · 官署大堂",where:"白昼",pace:"deep",sceneTitle:"抉择 · 承天的秤",text:[
"传令兵的事过去不久，户房又来了一桩难断的案子。",
"一批赈济粮被查出掺了沙子。管粮仓的仓吏跪在堂下，说粮是底下人贪的，他不知情。可账册上分明记着，是他亲笔签收。",
"青袍主簿把案子交到你手里：“战时粮贵，一粒沙子就是一条命。你说，怎么断。”",
"堂上安静下来。仓吏的额头贴在地上，抖得像风里的叶子。你知道，这一断，断的不只是一个人的前程。", "出了承天城，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（按律重办：斩仓吏，震慑贪墨）",effects:{xp:24,infl:{east:10},flag:"faction_east_axe"},go:"faction_east_7"},
{t:"（查明掺沙是上头的指示，仓吏是顶罪的）",effects:{xp:30,infl:{east:6},flag:"faction_east_truth"},go:"faction_east_7"},
{t:"（各打五十大板，把案子压下去）",effects:{xp:14,infl:{east:4},flag:"faction_east_cover"},go:"faction_east_7"}
]};

N["faction_east_7"]={tag:"main",place:"东境 · 承天城 · 官署",where:"夜",pace:"normal",sceneTitle:"晋升 · 主簿",text:[
"掺沙案了结后，青袍主簿把你叫到堂后。",
"他给你倒了一盏茶，说：“承天城的官，一半靠笔杆子，一半靠胆气。你两样都占一点。”他从抽屉里取出一方木印，“从今日起，你是户房主簿。”",
"木印沉甸甸的，压在掌心。你想起贡院里那句话——民以食为重，食以路为重。如今这杆秤，有一半在你手里了。",
"窗外又起了风。承天城的天，还是阴的。", "承天城在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（接下木印，做承天的秤）",effects:{xp:22,infl:{east:8},flag:"faction_east_zhubo"},go:"faction_east_8"}
]};

N["faction_east_8"]={tag:"main",place:"东境 · 铁门关 · 关城上",where:"白昼",pace:"deep",sceneTitle:"呼应 · 铁门关的风",text:[
"你以主簿身份随军到铁门关核粮，站在关城上，风从北边灌进来，带着雪沫子。",
"关城上的守将姓秦，是个沉默的中年人。他看着关外灰白的雪原，忽然开口：“三十年前，晨天城还在的时候，关外不是这样的。”",
"你没接话。秦守将也没有再说，只把一叠军报递给你：“北境的粮，东境的车，都从这道门过。门在，东境就在。”",
"你低头看那叠军报，第一页上写着：荒原诸部主力南下，前锋距铁门关七日路程。"
],options:[
{t:"（把军报连夜送回承天）",effects:{xp:24,infl:{east:8,north:6},flag:"faction_east_report"},go:"faction_east_9"}
]};

N["faction_east_9"]={tag:"main",place:"东境 · 承天城 · 帝京朝堂外",where:"白昼",pace:"deep",sceneTitle:"军议 · 承天的选择",text:[
"诸部主力南下的消息传到承天，朝堂上吵成一团。",
"主战派要倾国之力迎战，主和派要送银求和，还有人主张紧闭城门，坐山观虎斗。你站在堂外，听着里面的争执，隔着门都能闻见火气。",
"青袍主簿也来了，站在你身边，压着嗓子说：“朝堂上的话，十句有九句是空的。你手里有账，账里才有实话。”",
"他递给你一本册子：“东境的粮，只够撑四个月。你算算，这仗打不打得起。”"
],options:[
{t:"（算给朝堂听：打得起，但要速战）",effects:{xp:28,infl:{east:12},flag:"faction_east_war"},go:"faction_east_10"},
{t:"（算给朝堂听：打不起，先和谈拖时间）",effects:{xp:22,infl:{east:10},flag:"faction_east_peace"},go:"faction_east_10"}
]};

N["faction_east_10"]={tag:"main",place:"东境 · 承天城 · 官署",where:"夜",pace:"normal",text:[
"你的账，朝堂听进去了。",
"东境定了策：一面在铁门关布防，一面遣使往荒原诸部递信。你在官署连夜拟军需清单，笔尖在纸上沙沙地响。",
"写到后半夜，你抬头，看见窗外承天城的灯火——万家灯火，一城人的命，都押在你们这些人手里的账本和军报上。",
"你忽然明白，承天城的官，为什么眼里都熬着血丝。", "你与承天城作别，踏上旅途。尘土扑上靴面，像旧识。"],options:[
{t:"（把清单拟完，天亮了再睡）",effects:{xp:20,infl:{east:8},flag:"faction_east_night"},go:"faction_east_11"}
]};

N["faction_east_11"]={tag:"main",place:"东境 · 承天城 · 帝京",where:"白昼",pace:"deep",sceneTitle:"抉择 · 承天的路",text:[
"终战前，承天城面临最后一次选择。",
"荒原诸部的主力兵临铁门关，东境的军粮只够十天。朝堂上，有人递上一条密计：开闸放水，淹了关外的雪原，以水代兵。",
"密计送到你手里——你是主簿，闸口在你辖下。只要你在文书上盖印，一夜之间，关外千里雪原尽成泽国。",
"你握着那方木印，纸上写着五个字：水淹七百里。印下去，是七百里人命的重量；不印，是铁门关可能失守的代价。"
],options:[
{t:"（不印：另想别的办法守城）",effects:{xp:35,infl:{east:15},flag:"faction_east_final_mercy"},go:"faction_east_12"},
{t:"（印了：以水代兵，保东境不失）",effects:{xp:28,infl:{east:12},flag:"faction_east_final_flood"},go:"faction_east_12"},
{t:"（把密计卖给荒原诸部，换一条活路）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"},
{t:"（抽空去贡院墙外，看看那个落第书生）",effects:{xp:5},go:"east_lang_1"}
]};

N["faction_east_12"]={tag:"main",place:"东境 · 承天城 · 帝京门",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 承天的账",text:[
"终战的消息传到承天，城门开了。",
"关外的雪原没有变成泽国。你站在帝京门楼上，看着南下的粮队、北归的流民，像两条河一样在城门外汇合。",
"青袍主簿老了，扶着墙垛喘匀了气，说：“承天的官，换了一茬又一茬。你这一茬，算是没给城丢人。”",
"你没有接话。城楼下，一个逃难的孩子仰头看你，手里攥着一块干饼。你把怀里的干粮摸出来，扔了下去。"
],options:[
{t:"（留在承天，做那个记着民的人）",effects:{xp:25,flag:"faction_east_done"},go:"warphase_14"}
]};

N["faction_east_13"]={tag:"main",place:"东境 · 承天城 · 城隍庙",where:"夜",pace:"normal",sceneTitle:"余波 · 承天的夜",text:[
"战后第三夜，承天城办了场法事，超度战死的人。",
"城隍庙前的香火彻夜不断。你在人群里看见秦守将，他上了一炷香，转身就走，步子还是那么快。",
"有人在你耳边放轻声音说：“主簿，秦将军一直在查晨天故都的事。三十年了，没停过。”",
"你看着庙里的烛火，想起档房里那页写着“弃”字的旧档。有些事，承天城抹掉了，可还有人替它记着。", "你最后回望一眼承天城，转身穿过街口，往下一程赶路。"],options:[
{t:"（把秦守将的执念记在心里）",effects:{xp:18,infl:{east:6},flag:"faction_east_chen2"},go:"warphase_14"}
]};

/* ================= 势力六：兽人诸部 ================= */
N["faction_orc_1"]={tag:"main",place:"兽人草原 · 诸部大帐",where:"白昼",pace:"normal",sceneTitle:"阵营 · 兽人诸部",text:[
"北境的战鼓传到草原，比风还快。",
"诸部的大帐里，头领们围坐成一圈，中间的火堆烧得很旺。一个叫阿岩的年轻猎手站起来，指着地图：“北边要打仗，草原也要选边。跟着联军打，还是各过各的？”",
"他看见你走进来，上下打量：“你在雪原上跟狼群照过面？敢来的，都是不怕死的。”他拍了拍身边的皮褥子，“坐。草原的规矩，坐下就是兄弟。”", "你最后回望一眼诸部大帐，转身穿过街口，往下一程赶路。"],options:[
{t:"（坐下，加入兽人诸部）",effects:{xp:20,flag:"faction_join_orc"},run:function(){if(S.faction&&S.faction!=="orc"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.north=(S.infl.north||0)-8;S.infl.east=(S.infl.east||0)-6;}}S.faction="orc";},go:"faction_orc_2"},
{t:"（先随猎手出去走一趟，看看草原）",effects:{xp:12},go:"faction_orc_2"},
{t:"（草原的风太野，不急着站队）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_orc_2"]={tag:"main",place:"兽人草原 · 狼群南迁地",where:"白昼",pace:"deep",text:[
"入部第一件事，是去看狼群。",
"阿岩领你爬上草原最高的土坡，指着远处灰蒙蒙的一片：“狼群开始南迁了。老辈人说，狼是草原的哨兵——它们往哪走，草原就在往哪变。”",
"风从北边来，带着雪和血腥气。你看着那片灰影缓缓移动，心里忽然发紧：狼群南迁，通常只有两个原因——北边没得吃了，或者，北边来了什么让狼都害怕的东西。",
"阿岩也盯着那片灰影，声音沉了沉：“我们诸部，得在狼群之前，先想好往哪走。”", "出了狼群南迁地，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（记下狼群南迁的方向）",effects:{xp:22,infl:{orc:8},flag:"faction_orc_wolves"},go:"faction_orc_3"}
]};

N["faction_orc_3"]={tag:"main",place:"兽人草原 · 神谕之地",where:"夜",pace:"deep",sceneTitle:"神谕 · 石林低语",text:[
"诸部的老萨满听说你来了，要见你。",
"神谕之地是一片石林，风穿过石缝，发出呜呜的声音，像无数人在低语。老萨满坐在最大的石柱下，面前摆着几根兽骨，骨面上刻着密密麻麻的符号。",
"他盯着你看了一会儿，说：“你在找一个东西。它不在草原上，也不在北方——它在地底下，等着有人把它拿出来。”",
"你想起矿洞里的铁门、圣痕司的旧案、沙漠遗迹的玉片。老萨满把一根兽骨递给你：“拿着。等你的路走到头，它会告诉你，该往哪放。”"
],options:[
{t:"（收下兽骨，记下神谕）",effects:{xp:24,infl:{orc:10},flag:"faction_orc_oracle"},go:"faction_orc_4"}
]};

N["faction_orc_4"]={tag:"main",place:"兽人草原 · 诸部大帐",where:"夜",pace:"deep",text:[
"神谕的事在诸部传开，大帐里吵得更凶了。",
"主战的头领拍着桌子：“北边抢我们的草场，烧我们的帐篷，这笔账必须算！”主和的头领冷笑：“算账？拿什么算？我们的刀比他们少一半！”",
"阿岩夹在中间，左右为难。他把你拽到帐外：“你说，草原该打还是该和？”",
"夜风里，火堆的光在他脸上跳。这个年轻猎手，第一次把诸部的路，压到了你肩上。", "诸部大帐已被抛在身后。路在脚下延伸，你不回头，行至前方。"],options:[
{t:"（主张和谈：先要粮，再要地）",effects:{xp:22,infl:{orc:8},flag:"faction_orc_peace"},go:"faction_orc_5"},
{t:"（主张备战：狼群南迁，迟早要打）",effects:{xp:24,infl:{orc:10},flag:"faction_orc_war"},go:"faction_orc_5"}
]};

N["faction_orc_5"]={tag:"main",place:"兽人草原 · 北境边界",where:"白昼",pace:"normal",sceneTitle:"抉择 · 草原的刀",text:[
"和与战的争执还没定，北边就递来了信。",
"铁门关的守将秦长风遣使到草原：愿意用粮换和平，条件是诸部退兵三十里，不得南望。",
"信使把盖着铁门关大印的文书摆在帐中。主战的头领一拳砸在桌上：“退兵三十里？那不如让我们把刀都磨了！”",
"阿岩把文书递给你：“你说，这粮，换不换。”", "你离了北境边界，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（换：先让部族吃饱，再谈别的）",effects:{gold:30,xp:22,infl:{orc:8,north:6},flag:"faction_orc_trade"},go:"faction_orc_6"},
{t:"（不换：草原的刀不能低头）",effects:{xp:24,infl:{orc:10},flag:"faction_orc_defy"},go:"faction_orc_6"},
{t:"（假意答应，拖时间备战）",effects:{xp:20,infl:{orc:6},flag:"faction_orc_trick"},go:"faction_orc_6"}
]};

N["faction_orc_6"]={tag:"main",place:"兽人草原 · 狩猎场",where:"白昼",pace:"deep",sceneTitle:"试炼 · 猎手之战",text:[
"和战之事定下后，阿岩拉你去参加诸部的猎手试炼——猎一头荒原上最凶的雪狼。",
"雪狼的巢在乱石堆里。你趴在下风口，看着那只比牛犊还壮的狼在巢边踱步。阿岩打了个手势：包抄。",
"你刚起身，雪狼就察觉了。它转身扑来，獠牙在月光下一闪。你侧身闪避，它的爪子从你肩头擦过，撕开一道口子，血顺着胳膊淌下来。",
"阿岩从侧面掷出飞索，套住狼的后腿。雪狼嘶吼着挣扎，你抓住空档，扑上去按住它的脖颈——刀抵在喉间，狼的眼睛死死盯着你。你松开刀，放它走了。",
"阿岩看你的眼神变了：“能杀不杀，草原上管这叫——够格当兄弟。”", "狩猎场在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（捂着肩头的伤，接受试炼）",effects:{xp:30,hp:-8,infl:{orc:10},flag:"faction_orc_hunt"},go:"faction_orc_7"}
]};

N["faction_orc_7"]={tag:"main",place:"兽人草原 · 诸部大帐",where:"夜",pace:"normal",sceneTitle:"晋升 · 战狼",text:[
"试炼之后，诸部的大帐给你摆了一场酒。",
"阿岩把一碗酒端到你面前，单膝跪下：“从今日起，你是诸部的战狼。草原上，刀与酒都认你。”",
"你接过酒碗，一饮而尽。酒是烈的，烧得胸口发烫。帐里的人都吼起来，有人拔刀在火堆上比划，火星四溅。",
"你看着那些粗犷的面孔，忽然明白——草原人不是不怕死，是他们把死看得太轻，把兄弟看得太重。", "诸部大帐的灯火远了。夜风凉，你把心思收回来，专心赶路。"],options:[
{t:"（接下战狼的名号，与诸部共进退）",effects:{xp:22,infl:{orc:10},flag:"faction_orc_wolf"},go:"faction_orc_8"}
]};

N["faction_orc_8"]={tag:"main",place:"兽人草原 · 神谕石林",where:"夜",pace:"deep",sceneTitle:"呼应 · 骨上的符号",text:[
"战狼的名号传开，老萨满又把你叫去了石林。",
"这一次，他把那根兽骨翻过来，露出背面——骨面上刻着一道道符号，像锚，又像秤。你盯着那些符号，忽然想起七枚铁牌上的刻痕。",
"老萨满说：“草原的老辈人传下一句话：大地之下埋着七根柱子，柱子不倒，天就塌不下来。守柱子的，是一族姓金的守秤人。”",
"他顿了顿：“可那是很久以前的事了。现在，记得这句话的人，草原上不超过三个。”"
],options:[
{t:"（把守秤人的传说记在心里）",effects:{xp:26,infl:{orc:8},flag:"faction_orc_anchor"},go:"faction_orc_9"}
]};

N["faction_orc_9"]={tag:"main",place:"兽人草原 · 铁门关外",where:"白昼",pace:"deep",sceneTitle:"血仇 · 铁门关",text:[
"战局恶化，诸部的主力还是被卷进了铁门关之战。",
"那是草原人最惨烈的一仗。你带着战狼的兄弟们冲上关墙，火把和箭矢横飞，你身边的猎手一个接一个倒下。",
"混战中，一柄铁枪从侧面刺来，扎进你左肩。你咬牙折断枪杆，反手一刀劈翻偷袭的兵卒，血顺着手臂流到刀柄上，滑得几乎握不住。",
"阿岩在城下仰头喊你：“撤！关打不下来！”你看着关墙上的旗——那是铁门关的旗，也是三十年前晨天故都的旗。你攥紧刀柄，没有动。"
],options:[
{t:"（撤：留得青山在，草原还有以后）",effects:{xp:26,hp:-12,infl:{orc:10},flag:"faction_orc_retreat"},go:"faction_orc_10"},
{t:"（死战：这一仗，草原不能退）",effects:{xp:34,hp:-20,infl:{orc:12},flag:"faction_orc_fight"},go:"faction_orc_10"}
]};

N["faction_orc_10"]={tag:"main",place:"兽人草原 · 诸部大帐",where:"夜",pace:"normal",text:[
"铁门关一仗，诸部伤了元气。",
"大帐里的火堆比往常小了一半。阿岩的胳膊上缠着绷带，坐在角落里一声不吭。头领们也不吵了，都看着火堆发呆。",
"你走进帐里，把带回来的那面铁门关的旗角放在火堆边。没有人说话，但你知道，这一仗之后，诸部的路，必须重新选一次。",
"阿岩抬起头，看着你：“战狼，你说，草原下一步怎么走。”"
],options:[
{t:"（养精蓄锐，等联军先动）",effects:{xp:20,infl:{orc:8},flag:"faction_orc_wait"},go:"faction_orc_11"},
{t:"（趁联军也伤了元气，再压一次边）",effects:{xp:26,infl:{orc:10},flag:"faction_orc_press"},go:"faction_orc_11"}
]};

N["faction_orc_11"]={tag:"main",place:"兽人草原 · 诸部大帐",where:"白昼",pace:"deep",sceneTitle:"抉择 · 草原的路",text:[
"终战前夜，诸部的大帐里只剩一个问题：草原，往哪走。",
"南下抢一片草场，还是北上求和，或者干脆退回荒原深处，谁都不理。头领们吵了三天，最后把刀都拍在你面前：“战狼，你来说。”",
"你看着那些粗粝的面孔，想起狼群南迁时它们眼里的方向，想起老萨满的话，想起铁门关城下倒下的兄弟。",
"你开口时，帐里安静得能听见火堆的噼啪声。"
],options:[
{t:"（带诸部与北境休战，换粮换地）",effects:{xp:32,infl:{orc:12,north:8},flag:"faction_orc_final_peace"},go:"faction_orc_12"},
{t:"（带诸部南下，抢一片新的草场）",effects:{xp:28,infl:{orc:10},flag:"faction_orc_final_south"},go:"faction_orc_12"},
{t:"（把诸部北上的路线卖给联军，换笔财富）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"},
{t:"（抽空去河湾，陪阿岩坐坐）",effects:{xp:5},go:"orc_ayan_1"}
]};

N["faction_orc_12"]={tag:"main",place:"兽人草原 · 狼头峰",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 草原的风",text:[
"终战的消息传到草原，狼群开始北归。",
"你站在狼头峰上，看着灰白的狼群缓缓移动，方向与来时相反。阿岩站在你身边，说：“狼回去了。草原，也该回到它原来的样子。”",
"他顿了顿：“可有些东西回不去了——铁门关城下倒下的兄弟，回不来了。”",
"风从北方吹来，带着雪沫子。你没有接话，只把老萨满给的那根兽骨握在手里——它的尽头，还有一段路没走完。"
],options:[
{t:"（领着诸部，在战后的草原上重新扎根）",effects:{xp:25,flag:"faction_orc_done"},go:"warphase_14"}
]};

N["faction_orc_13"]={tag:"main",place:"兽人草原 · 石林",where:"夜",pace:"normal",sceneTitle:"余波 · 狼与骨",text:[
"战后，老萨满去世了。",
"诸部按草原的规矩，把他葬在石林最高的石柱下。你站在人群里，看着兽骨被埋进土里，风穿过石缝，呜呜地响了一整夜。",
"阿岩把老萨满留下的兽骨都收起来，其中一根交到你手里：“他临走前说，这根骨头，是留给那个守秤人的。”",
"你握着那根兽骨，骨面上的符号在月光下浮着一层幽光。你知道，这根骨头，迟早要回到它该去的地方。"
],options:[
{t:"（收好兽骨，等路走完）",effects:{xp:18,infl:{orc:6},flag:"faction_orc_bone"},go:"warphase_14"}
]};

/* ================= 势力七：矮人山国 ================= */
N["faction_dwarf_1"]={tag:"main",place:"矮人山国 · 山门",where:"白昼",pace:"normal",sceneTitle:"阵营 · 矮人山国",text:[
"北境的战争传进山里，矮人们还在打铁。",
"山门外的熔炉彻夜不熄，铁水映红了大半面山壁。一个胡子编成辫子的矮人老铁匠抬头看你：“北边要刀？要刀可以，拿铁来换，拿矿来换，拿酒来换。”",
"他敲了敲手里的锤子：“山里的规矩简单——能扛动锤子的，就是兄弟。”他把一柄铁锤扔到你面前，“试试？”", "你离了山门，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（抄起铁锤，加入矮人山国）",effects:{xp:20,flag:"faction_join_dwarf"},run:function(){if(S.faction&&S.faction!=="dwarf"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.north=(S.infl.north||0)-8;S.infl.orc=(S.infl.orc||0)-6;}}S.faction="dwarf";},go:"faction_dwarf_2"},
{t:"（先在锻造坊里看几天，学学手艺）",effects:{xp:12},go:"faction_dwarf_2"},
{t:"（山里的烟太呛，不急着入伙）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_dwarf_2"]={tag:"main",place:"矮人山国 · 锻造坊",where:"白昼",pace:"deep",text:[
"你留在锻造坊，跟着老铁匠学打铁。",
"铁锤落在砧上，叮叮当当，火星四溅。老铁匠一边锤铁一边骂：“刀要硬，先得把杂念捶出去！你心里装着事，打的刀就会裂！”",
"你学着把心思全放在铁上。三天后，你打出第一柄像样的短刀。老铁匠拿起来，对着光看了看刀刃，点点头：“能用了。离好刀，还差十年。”",
"他把短刀扔还给你：“拿着。山国的规矩，自己打的刀，自己用。”", "你最后回望一眼锻造坊，转身穿过街口，往下一程赶路。"],options:[
{t:"（收下短刀，留在锻造坊）",effects:{xp:22,infl:{dwarf:8},flag:"faction_dwarf_forge"},go:"faction_dwarf_3"}
]};

N["faction_dwarf_3"]={tag:"main",place:"矮人山国 · 南矿洞",where:"夜",pace:"deep",sceneTitle:"异响 · 南矿洞",text:[
"南矿洞出了怪事：夜里，洞深处传来沉闷的撞击声，像有什么东西在撞铁门。",
"你随老铁匠下到矿洞最深处。火把照见一道锈迹斑斑的铁门，门上铸着七道符印，其中一道已经裂开。撞击声，就从门后传来。",
"老铁匠摸着那道裂纹，脸色很难看：“这扇门，山国守了三百年。老祖宗说，门后关着不该出来的东西。”",
"他转头看你：“你听见了，也算半个守门人。记住：这道门，别开。”"
],options:[
{t:"（记下铁门的方位与符印）",effects:{xp:26,infl:{dwarf:10},flag:"faction_dwarf_seal"},go:"faction_dwarf_4"}
]};

N["faction_dwarf_4"]={tag:"main",place:"矮人山国 · 议事厅",where:"白昼",pace:"deep",text:[
"南矿洞的事传开后，矮人山国的长老们开了三次会。",
"有长老主张加固铁门，多铸七道新锁；有长老主张把矿洞填死，一了百了；还有长老冷笑：“老祖宗留下的门，谁敢动？”",
"老铁匠把你推进议事厅：“他在北边走过，见过世面，让他说。”",
"几道目光齐刷刷看过来。你站在厅中央，闻着满屋的炉灰味和酒味，知道这一句话，可能决定山国三百年的门，开还是不开。", "从议事厅出来，路上行人渐稀。你脚步不停，一路向前。"],options:[
{t:"（主张加固：不动门，但多铸锁）",effects:{xp:24,infl:{dwarf:10},flag:"faction_dwarf_fortify"},go:"faction_dwarf_5"},
{t:"（主张填洞：门后的东西，永远别出来）",effects:{xp:22,infl:{dwarf:8},flag:"faction_dwarf_fill"},go:"faction_dwarf_5"},
{t:"（主张查清：先知道门后是什么，再决定）",effects:{xp:28,infl:{dwarf:6},flag:"faction_dwarf_probe"},go:"faction_dwarf_5"}
]};

N["faction_dwarf_5"]={tag:"main",place:"矮人山国 · 军需坊",where:"白昼",pace:"normal",sceneTitle:"抉择 · 铁的去向",text:[
"北境的军需官进了山，要订一万柄刀。",
"矮人山国一年打的铁，也只够两万柄。长老们为这件事又吵起来：全接了，山国的铁库要见底；不接，北边联军拿什么打仗。",
"军需官把定金摆在桌上，黄澄澄的金条。老铁匠看也不看，只盯着你：“你是走过北边的人。你说，这批刀，接不接。”",
"你看着那堆金条，又看了看炉火里翻腾的铁水。"
],options:[
{t:"（接一半：留一半铁，守山国自己的门）",effects:{gold:40,xp:22,infl:{dwarf:8,north:6},flag:"faction_dwarf_half"},go:"faction_dwarf_6"},
{t:"（全接：山国的铁，就是北境的刀）",effects:{gold:60,xp:18,infl:{dwarf:4,north:8},flag:"faction_dwarf_all"},go:"faction_dwarf_6"},
{t:"（不接：山国的铁，只打山国的门）",effects:{xp:26,infl:{dwarf:10},flag:"faction_dwarf_refuse"},go:"faction_dwarf_6"}
]};

N["faction_dwarf_6"]={tag:"main",place:"矮人山国 · 地底熔炉",where:"夜",pace:"deep",sceneTitle:"异象 · 地底回响",text:[
"铁的事定下后，地底忽然传来一声闷响，连锻造坊的炉火都抖了三抖。",
"老铁匠扔下锤子就往外跑：“不是矿洞！是地底！”他带着你钻进一条废弃的巷道，越走越深，最后停在壁上一道古老的刻痕前——刻痕是七枚连在一起的黑铁锚。",
"老铁匠用火把照着刻痕，声音发颤：“这是老祖宗的记号。他们说，山国地下压着七根柱子之一。柱子晃，山国就晃。”",
"他沉默了很久，说：“要变天了。”", "离开地底熔炉时天光正好，靴子踏上路面的声音很稳。一路向前。"],options:[
{t:"（把七锚刻痕拓下来，带回地面）",effects:{xp:28,infl:{dwarf:10},flag:"faction_dwarf_anchor"},go:"faction_dwarf_7"}
]};

N["faction_dwarf_7"]={tag:"main",place:"矮人山国 · 锻造坊",where:"白昼",pace:"normal",sceneTitle:"晋升 · 铁匠长",text:[
"地底异象之后，老铁匠把一柄淬过火的铁锤交到你手里。",
"他咳嗽了两声，说：“我锤了四十年铁，眼睛花了，手也抖了。这柄锤子，从今天起归你——你是山国的铁匠长。”",
"你握着那柄锤子，锤柄上磨得光滑，全是老铁匠的掌纹。他把手搭在你肩上，压着嗓门：“铁匠长，不光管打铁——还得管着山国那扇门。门在，山国在。”",
"炉火映着他花白的胡子。你知道，这柄锤子递过来的，不止是一份差事。", "你离了锻造坊，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（接下铁锤，做山国的守门人）",effects:{xp:22,infl:{dwarf:10},flag:"faction_dwarf_smith"},go:"faction_dwarf_8"}
]};

N["faction_dwarf_8"]={tag:"main",place:"矮人山国 · 南矿洞铁门",where:"夜",pace:"deep",sceneTitle:"呼应 · 铁门与铁牌",text:[
"铁匠长上任后的第一件事，是给南矿洞的铁门换锁。",
"你带着徒弟们铸了七道新锁。换锁的时候，你在门框的夹缝里摸到一样东西——一枚半截的铁牌，牌面上刻着锚形的纹路，与你在别处见过的，像是同一脉。",
"你盯着那枚铁牌，想起七枚铁牌的传说、圣痕司卷宗里“不该打的钥匙”、老萨满说的“守秤人”。这些碎片，正在慢慢拼成一张图。",
"你把铁牌收进怀里，没有声张。", "南矿洞铁门已被抛在身后。路在脚下延伸，你不回头，行至前方。"],options:[
{t:"（把铁牌与七锚的线索连起来）",effects:{xp:26,infl:{dwarf:8},flag:"faction_dwarf_plate"},go:"faction_dwarf_9"}
]};

N["faction_dwarf_9"]={tag:"main",place:"矮人山国 · 议事厅",where:"白昼",pace:"deep",sceneTitle:"军议 · 山国的选择",text:[
"终战前，山国接到两封请帖：北境联军请矮人出山助战，荒原诸部请矮人保持中立。",
"长老们分坐两排。主战的长老拍着桌子：“铁打了不打仗，那打铁还有什么用！”主和的长老敲着烟斗：“山国的铁，是守门的，不是杀人的。”",
"老铁匠已经退了位，坐在角落的阴影里，一声不吭。所有人的目光最后都落向你——新任铁匠长。",
"你站在议事厅中央，炉火在身后烧着。", "离开议事厅时天光正好，靴子踏上路面的声音很稳。一路向前。"],options:[
{t:"（出山：山国的铁，该上战场了）",effects:{xp:28,infl:{dwarf:10,north:8},flag:"faction_dwarf_war"},go:"faction_dwarf_10"},
{t:"（守山：任外面打翻天，山国不动）",effects:{xp:24,infl:{dwarf:12},flag:"faction_dwarf_stay"},go:"faction_dwarf_10"}
]};

N["faction_dwarf_10"]={tag:"main",place:"矮人山国 · 山门",where:"白昼",pace:"normal",text:[
"山国的决定，最终落在一柄新铸的刀上。",
"你把那柄刀插在山门外的石缝里，刀尖朝北。“出山。”你对长老们说，“但刀柄在山国手里——打多久、打到哪里，山国说了算。”",
"长老们沉默了一阵，最后都点了点头。老铁匠在人群里咳嗽了一声，说：“这柄锤子，没传错人。”",
"你转身看着山门外灰蒙蒙的天。铁已经淬好了，接下来，是它见血的时候。", "山门已被抛在身后。路在脚下延伸，你不回头，行至前方。"],options:[
{t:"（带着山国的铁，走向战场）",effects:{xp:22,infl:{dwarf:8,north:6},flag:"faction_dwarf_march"},go:"faction_dwarf_11"}
]};

N["faction_dwarf_11"]={tag:"main",place:"矮人山国 · 议事厅",where:"夜",pace:"deep",sceneTitle:"抉择 · 山国的秤",text:[
"终战后，山国面临最后一个选择。",
"北边的联军想在山里设一个军械库，常年屯铁；荒原诸部则想要山国开放矿道，互通有无。两边的使者都坐在议事厅里，等着山国的话。",
"长老们不吵了，都看着你。你手里转着老铁匠留下的那柄小锤子，锤柄上的掌纹已经磨得看不清了。",
"你放下锤子，开口。"
],options:[
{t:"（设军械库，但山国保有钥匙）",effects:{xp:30,infl:{dwarf:12,north:8},flag:"faction_dwarf_final_north"},go:"faction_dwarf_12"},
{t:"（开放矿道，与诸部互通）",effects:{xp:28,infl:{dwarf:10,orc:8},flag:"faction_dwarf_final_orc"},go:"faction_dwarf_12"},
{t:"（把山国的矿脉图卖给北境，换一笔厚利）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"},
{t:"（抽空回锻造坊，看看铜锤）",effects:{xp:5},go:"dwarf_bronze_1"}
]};

N["faction_dwarf_12"]={tag:"main",place:"矮人山国 · 铁王座",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 山国的火",text:[
"你站在铁王座前——那是山国锻造坊最老的一柄大锤，插在石座里，已经传了七代铁匠长。",
"你握住锤柄，把它从石座里拔了出来。铁王座空了一瞬，随即，满坊的炉火都旺了三分。",
"老铁匠已经走不动了，坐在门槛上，看着你举着那柄大锤，咧嘴笑了：“锤子认人。山国的火，还没灭。”",
"你举着锤子，面向山门外。炉火在你身后烧着，映红了半面山壁。", "别过铁王座，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（举起山国的锤，守着山国的门）",effects:{xp:25,flag:"faction_dwarf_done"},go:"warphase_14"}
]};

N["faction_dwarf_13"]={tag:"main",place:"矮人山国 · 地底刻痕前",where:"夜",pace:"normal",sceneTitle:"余波 · 柱子的回响",text:[
"战后，你独自下到地底，站在那七枚黑铁锚的刻痕前。",
"刻痕比上次来的时候亮了一些——像是有什么东西，正在地底下慢慢醒过来。你把手指按在刻痕上，指尖一阵发麻。",
"你想起老铁匠的话：柱子晃，山国就晃。现在柱子不只是晃了——它在地底下，发出低沉的、持续的回响。",
"你收回手，转身离开。有些话，不必对山里的人说。", "地底刻痕前在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（把柱子的回响记在心里）",effects:{xp:18,infl:{dwarf:6},flag:"faction_dwarf_echo"},go:"warphase_14"}
]};

/* ================= 势力八：精灵林邦 ================= */
N["faction_elf_1"]={tag:"main",place:"精灵林邦 · 林缘",where:"白昼",pace:"normal",sceneTitle:"阵营 · 精灵林邦",text:[
"北境的战鼓传进林海，比风慢，却比风沉。",
"林缘的哨台上，一个精灵巡林长放下长弓，看着你：“你身上带着学院的气息。学院的人，林子一向放行。”他顿了顿，“可现在是战时。林邦不问来路，只问一件事——你是来砍树的，还是来护树的？”",
"他把一支哨箭递到你面前：“吹响它，林邦就认你是自己人。”", "林缘的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（接过哨箭，加入精灵林邦）",effects:{xp:20,flag:"faction_join_elf"},run:function(){if(S.faction&&S.faction!=="elf"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.church=(S.infl.church||0)-6;S.infl.dwarf=(S.infl.dwarf||0)-6;}}S.faction="elf";},go:"faction_elf_2"},
{t:"（先随巡林长走一趟林海，看看再说）",effects:{xp:12},go:"faction_elf_2"},
{t:"（林子的路太静，不急着入伙）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_elf_2"]={tag:"main",place:"精灵林邦 · 世界树下",where:"夜",pace:"deep",sceneTitle:"古树 · 世界树",text:[
"入邦第一夜，巡林长带你去看世界树。",
"那棵树大得超出想象——树干要几十个人合抱，枝叶遮住了半片星空。风过树梢，整座林海都在低低地响。",
"巡林长把手掌贴在树干上，说：“林邦的规矩，是树教的：树不争，所以活千年；树不躲，所以立得稳。”",
"他看着你：“战争来了。林邦不想打仗，可林邦也不怕打仗。你说，树该怎么做？”", "世界树下在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（学树：立住根，不争不躲）",effects:{xp:22,infl:{elf:8},flag:"faction_elf_tree"},go:"faction_elf_3"}
]};

N["faction_elf_3"]={tag:"main",place:"精灵林邦 · 圣痕司分所",where:"白昼",pace:"deep",sceneTitle:"旧识 · 艾琳的留痕",text:[
"林邦的边地有一座圣痕司分所，战时废弃了。",
"巡林长让你去清点遗物。你在积灰的案卷里，翻到一本手抄笔记——扉页上写着一个名字：艾琳。",
"笔记里夹着一页纸，纸上画着几个符号，旁边批注：“与学院禁书区第三架所见一致。疑同源。”你认得那个笔迹——学院里，那个研究异端符号的学姐。",
"你合上笔记。艾琳的线索，从学院一路延伸到圣城，又在这里露出一角。她到底在查什么。"
],options:[
{t:"（把艾琳的笔记收好）",effects:{xp:24,infl:{elf:8},flag:"faction_elf_alice"},go:"faction_elf_4"}
]};

N["faction_elf_4"]={tag:"main",place:"精灵林邦 · 林界",where:"白昼",pace:"deep",text:[
"战火烧到林邦边缘：一支军队想借林海行军，砍树开路。",
"巡林长带着人拦在林界上。对面的军官说：“战时军务，误了军机，你们担得起？”巡林长没有让开：“林子是林邦的命。你砍一棵树，林邦就多记你一笔。”",
"两边僵持着，箭在弦上。巡林长回头看了你一眼——你是学院出来的人，见过世面。",
"风穿过林梢，一片叶子落在你肩头。"
],options:[
{t:"（主张借路，但限定路线，不许砍树）",effects:{xp:22,infl:{elf:8,north:6},flag:"faction_elf_pass"},go:"faction_elf_5"},
{t:"（主张封路：林邦的林子，谁也别动）",effects:{xp:26,infl:{elf:10},flag:"faction_elf_block"},go:"faction_elf_5"}
]};

N["faction_elf_5"]={tag:"main",place:"精灵林邦 · 林间议会",where:"夜",pace:"normal",sceneTitle:"议会 · 林邦的声音",text:[
"借路的事平息后，林邦的议会开了一场会。",
"长老们围坐在世界树下，火把插在四周。议题只有一个：林邦，要不要卷入这场战争。",
"主战的长老说：“刀已经架到林子边上了。”主和的长老说：“树活千年，靠的不是刀。”",
"巡林长让你坐到长老席边上——林邦少有的例外。他放轻声音：“他们信树，也信一个见过外面的人。”", "从林间议会出来，路上行人渐稀。你脚步不停，一路向前。"],options:[
{t:"（主张守林：林邦不参战，但收留难民）",effects:{xp:24,infl:{elf:10},flag:"faction_elf_haven"},go:"faction_elf_6"},
{t:"（主张参战：树也有根，根不能断）",effects:{xp:26,infl:{elf:8,north:6},flag:"faction_elf_joinwar"},go:"faction_elf_6"}
]};

N["faction_elf_6"]={tag:"main",place:"精灵林邦 · 古树低语处",where:"夜",pace:"deep",sceneTitle:"异象 · 古树低语",text:[
"议会之后，世界树忽然在夜里低语。",
"不是风声——是树根深处传来的一种沉闷的震动，像有什么东西在树底一下一下地撞。巡林长脸色大变，带着你连夜下到树根的空腔里。",
"空腔深处的岩壁上，嵌着一枚碧绿的玉石，像一滴凝固的泪。巡林长说：“这是晨星之泪。老祖宗说，世界树靠它镇着根底的封印。”",
"他凑近看，玉石表面多了一道细纹。他倒吸一口气：“封印在松动。”", "别过古树低语处，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（记下晨星之泪的位置与裂纹）",effects:{xp:28,infl:{elf:10},flag:"faction_elf_tear"},go:"faction_elf_7"}
]};

N["faction_elf_7"]={tag:"main",place:"精灵林邦 · 巡林队",where:"白昼",pace:"normal",sceneTitle:"晋升 · 巡林长",text:[
"晨星之泪的事后，巡林长把一张角弓交到你手里。",
"他拍了拍你的肩：“你在林界上挡过军队，在树根下守过封印。从今日起，你是林邦的副巡林长。”",
"角弓沉甸甸的，弓弦是新换的，还带着松脂的味道。巡林长压着嗓门：“副巡林长，不光管林子——还得管树底下的东西。封印若有异动，先护住晨星之泪。”",
"你握着角弓，抬头看世界树巨大的树冠，枝叶间漏下细碎的光。", "你收拾停当，离开巡林队，沿着来路踏上行程。"],options:[
{t:"（接下角弓，守着林邦的根）",effects:{xp:22,infl:{elf:10},flag:"faction_elf_ranger"},go:"faction_elf_8"}
]};

N["faction_elf_8"]={tag:"main",place:"精灵林邦 · 树根封印",where:"夜",pace:"deep",sceneTitle:"呼应 · 根底的封印",text:[
"封印的裂纹没有停下。",
"你带着巡林队守在世界树根底，看着那道细纹一天天变长。月光从树冠漏下来，照在碧绿的晨星之泪上，泪石表面泛着幽幽的光。",
"你想起北方那道深渊的封印、南矿洞的铁门、老萨满的话。这片大陆的地底下，像埋着一串锁，一处处都在松动。",
"巡林长站在你身边，声音放轻：“林邦守了世界树三百年。可这一次，怕是守不住了——除非，有人能把它重新镇住。”", "树根封印在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（把各处的封印记成一张图）",effects:{xp:26,infl:{elf:8},flag:"faction_elf_map"},go:"faction_elf_9"}
]};

N["faction_elf_9"]={tag:"main",place:"精灵林邦 · 林界哨台",where:"白昼",pace:"deep",sceneTitle:"军议 · 林邦的选择",text:[
"终战前，两边的使者都进了林邦。",
"北境联军要林邦出弓手；荒原诸部要林邦保持中立，让林海成为双方的缓冲。使者们坐在世界树下，等着林邦的话。",
"长老们看着你。巡林长站在你身后，轻声说：“你是副巡林长。树怎么选，你来说。”",
"你站在世界树下，抬头看那遮天蔽日的树冠。风过树梢，整座林海都在等你的回答。"
],options:[
{t:"（出弓手：林子立了根，也该亮一次箭）",effects:{xp:28,infl:{elf:10,north:8},flag:"faction_elf_archers"},go:"faction_elf_10"},
{t:"（守中立：林海是缓冲，不是战场）",effects:{xp:24,infl:{elf:12},flag:"faction_elf_neutral"},go:"faction_elf_10"}
]};

N["faction_elf_10"]={tag:"main",place:"精灵林邦 · 林间小径",where:"白昼",pace:"normal",text:[
"林邦的决定，是派出一队弓手，守在林界上。",
"不是帮谁，是守住林子。弓手们站在树影里，箭搭在弦上，箭尖朝北。巡林长站在队首，回头看了你一眼：“箭搭上弦，就不算中立了。可林子的根，比箭更硬。”",
"你站在他身边，握着那张角弓。风穿过林梢，把弓弦吹出一声细响，像林海在低语。"
],options:[
{t:"（与弓手们一起，守在林界上）",effects:{xp:22,infl:{elf:8},flag:"faction_elf_stand"},go:"faction_elf_11"}
]};

N["faction_elf_11"]={tag:"main",place:"精灵林邦 · 世界树下",where:"夜",pace:"deep",sceneTitle:"抉择 · 树的回答",text:[
"终战后，世界树的低语停了。",
"可晨星之泪的裂纹还在。长老们围在树根下，争论着该怎么办：有人主张用新的晨星之泪替换，有人主张封印树根，还有人说，也许该问问那个走过整片大陆的人。",
"巡林长把一支哨箭递到你手里：“林邦的哨箭，一生只吹一次。你吹响它，林邦就听你的。”",
"你握着那支哨箭，站在世界树下。树冠之上，星光漏下来，落了一肩。"
],options:[
{t:"（吹响哨箭：建议以晨星之泪镇根，封死树底）",effects:{xp:32,infl:{elf:12},flag:"faction_elf_final_seal"},go:"faction_elf_12"},
{t:"（吹响哨箭：建议开树底封印，取出真相）",effects:{xp:28,infl:{elf:10},flag:"faction_elf_final_open"},go:"faction_elf_12"},
{t:"（把晨星之泪的位置卖给圣痕司，换笔厚利）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"},
{t:"（抽空去药庐，看看青叶）",effects:{xp:5},go:"elf_leaf_1"}
]};

N["faction_elf_12"]={tag:"main",place:"精灵林邦 · 世界树冠",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 林海的根",text:[
"你爬上世界树最高的枝丫，站在树冠上。",
"林海在脚下铺到天边，绿得像一片海。风从北方来，带着战后的烟火气，也带着新生的青草味。",
"巡林长站在另一根枝丫上，望着远方：“树活千年，靠的是根。你替林邦选了根的方向——剩下的事，交给时间。”",
"你扶着树干，感受着粗粝的树皮底下，那股沉沉的、持续的搏动。像心跳。", "世界树冠的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（留在林邦，做那棵树的守夜人）",effects:{xp:25,flag:"faction_elf_done"},go:"warphase_14"}
]};

N["faction_elf_13"]={tag:"main",place:"精灵林邦 · 晨星之泪",where:"夜",pace:"normal",sceneTitle:"余波 · 泪石的光",text:[
"战后第一场春雨落进林海，你在树根空腔里，看见晨星之泪上的裂纹停了。",
"那道细纹停在半途，没有再延伸。玉石表面的幽光柔和了一些，像一滴泪，终于不再流了。",
"巡林长说：“树底的东西，暂时安稳了。可你我都知道——安稳，只是暂时的。”",
"你把手掌贴在泪石上，凉意透进掌心。你想起老萨满的兽骨、矮人矿洞的铁门、深渊的封印。这片大陆的锁，还没有全部锁上。", "出了晨星之泪，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（带着晨星之泪的凉意，继续走）",effects:{xp:18,infl:{elf:6},flag:"faction_elf_tear2"},go:"warphase_14"}
]};
