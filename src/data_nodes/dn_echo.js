/* ============================================================
 * dn_echo.js —— CON-2 决策回响节点（30 个重大 flag 回响）
 * 实现：ifFlag 变体（v91_resolveText 三形态，零引擎改动）
 * 挂载：F 节点 go → echo_xxx → 原目标 Y；无 flag 显示轻过渡，有 flag 显示回响
 * 铁律：不触碰判定公式 / writeNext / choose / 存档结构；saveVersion=48 不变
 * 全部节点带 pace；中文引号成对；无 30 治理词
 * ============================================================ */
(function () {
  var N = window.N || (window.N = {});
  /* 铁门关外 · 北坡烽火台（bandit_leader_killed / eclipse_infiltrator 共用链） */
  N["echo_bandit_leader_killed"] = { tag: "main", place: "东部王国 · 铁门关外 · 北坡烽火台", where: "白昼", pace: "normal",
    text: { default: ["烽火台下，风把旗角的响声送来，断断续续。"],
      ifFlag: { "bandit_leader_killed": ["你翻过北坡乱石堆时，一个赶骡子的老卒在路边歇脚，认出你来，往你怀里塞了半块干饼：“你就是剁了匪首头的那位？前些日子官道上还有人立了块木牌，写着你的名字，说是给路上遭劫的人壮胆。”", "你捏着那块干饼，没说话。杀名这种东西，传到第三个人嘴里，就不像你当初动手时那样简单了。老卒见你不接话，也不多问，挥了挥鞭子赶骡子走了。"] } },
    options: [{ t: "（把干饼收进怀里，继续走）", go: "echo_eclipse_infiltrator" }] };
  N["echo_eclipse_infiltrator"] = { tag: "main", place: "东部王国 · 铁门关外 · 北坡烽火台", where: "白昼", pace: "normal",
    text: { default: ["烽火台下的阴影里，碎石堆成一道矮墙，像被什么反复翻过。"],
      ifFlag: { "eclipse_infiltrator": ["你混进暗蚀会那几个月的事，铁门关这边没人知道。只有烽火台下的老鸦认得你——你曾蹲在这片阴影里，把一枚刻着鸦羽的铜牌埋进碎石底下。", "后来铜牌被谁挖走了，地上留了个浅坑。你蹲下去看了看，又用靴底把土抹平。有些事做过就做过了，埋好，就当没发生过。"] } },
    options: [{ t: "（起身，走向铁门关外的废墟）", go: "tm_ruins" }] };
  /* 铁门关外 · 军情驿站（let_mercury_go） */
  N["echo_let_mercury_go"] = { tag: "main", place: "东部王国 · 铁门关外 · 军情驿站", where: "白昼", pace: "normal",
    text: { default: ["驿站门口，驿卒正往马背上挂水囊，缰绳系得松松的。"],
      ifFlag: { "let_mercury_go": ["你在这驿站歇脚时，驿卒给你倒了一碗茶，顺嘴说：“前阵子有个戴兜帽的怪人，在我们这儿换过一匹马，往南边去了。他说若是遇见一个不肯收他信物的人，替他带句话——那笔账，他记着。”", "你端着茶碗，想起那夜你放走信使时他看你的眼神。记着就记着吧。你喝完茶，把碗放回桌上。"] } },
    options: [{ t: "（整了整行装，继续赶路）", go: "tm_courier" }] };
  /* 铁门关外 · 关南难民营（gave_all_to_refugees / medici_blackmailed 共用链） */
  N["echo_gave_all_to_refugees"] = { tag: "main", place: "东部王国 · 铁门关外 · 关南难民营", where: "白昼", pace: "normal",
    text: { default: ["难民营的栅栏边，几个孩子蹲在地上分一张饼。"],
      ifFlag: { "gave_all_to_refugees": ["你进营门时，一个瘸腿的老妇迎面拦住你，把一只补了又补的布包往你手里塞：“恩人，你那年把整袋银币分给我们，老婆子没处还，这几年攒了些干粮，你带着路上吃。”", "布包沉甸甸的，装的是炒面。你推回去，她又塞回来，眼眶发红，转身就钻进棚子里去了。炒面还温着。"] } },
    options: [{ t: "（把布包系在行囊上，走进营中）", go: "echo_medici_blackmailed" }] };
  N["echo_medici_blackmailed"] = { tag: "main", place: "东部王国 · 铁门关外 · 关南难民营", where: "白昼", pace: "normal",
    text: { default: ["难民营西角搭着几顶破帐篷，炊烟细得几乎看不见。"],
      ifFlag: { "medici_blackmailed": ["你勒索美第奇家那件事，在难民营里传成了另一个版本——说有个外乡人攥住了自由城邦最有钱家族的把柄，却只换了几车粮食，全运到了关南。", "棚子里的老人给你递了碗稀粥，压低嗓子说：“外乡人，这年头拿刀的多，拿把柄的少。你办的这事，粥棚里的人记着。”粥很稀，话很重。"] } },
    options: [{ t: "（喝下那碗粥，起身离开）", go: "tm_refugee" }] };
  /* 铁门关外 · 北坡烽火台（father_truth_denied） */
  N["echo_father_truth_denied"] = { tag: "main", place: "东部王国 · 铁门关外 · 北坡烽火台", where: "白昼", pace: "normal",
    text: { default: ["烽火台高处的望台上，两个兵卒正换着班，铁盔碰得叮当响。"],
      ifFlag: { "father_truth_denied": ["你登上望台时，正赶上北风。当年父亲托人捎来的那封信，你到最后也没拆开看。此刻站在这里，风把衣襟吹得翻飞，你忽然想：那封信里写的，会不会就是这铁门关外的风。", "你把信的事又按回心底。不看有不看的道理，走有走的路。"] } },
    options: [{ t: "（扶着垛口，望向关外）", go: "tm_watchtower" }] };
  /* 铁门关外 · 两军之间的空场（aquan_liberated / beijing_saved 共用链） */
  N["echo_aquan_liberated"] = { tag: "main", place: "东部王国 · 铁门关外 · 两军之间的空场", where: "白昼", pace: "normal",
    text: { default: ["空场上，两军的旗帜各据一头，中间的土路被踩得结结实实。"],
      ifFlag: { "aquan_liberated": ["你踏上这片空场时，有个东军的老兵远远看了你半天，忽然行了个军礼。后来他身边的士兵告诉你：水岸被围那年，就是他老家。你带人打通水路那天，他在阵前把刀往地上一插，喊了一嗓子，说这辈子欠你一条命。", "那个军礼，他没有解释。你也没有问。"] } },
    options: [{ t: "（回了一礼，走向和谈的帐篷）", go: "echo_beijing_saved" }] };
  N["echo_beijing_saved"] = { tag: "main", place: "东部王国 · 铁门关外 · 两军之间的空场", where: "白昼", pace: "normal",
    text: { default: ["空场北头搭着一顶灰色帐篷，帐帘在风里一掀一落。"],
      ifFlag: { "beijing_saved": ["和谈帐篷外，一个操着北地口音的传令兵认出了你，私下拽了拽你的袖子：“北境那几镇的人，到现在还念叨你。去年雪灾，要不是你把那批粮硬送到城下，怕是要冻死一镇子人。”", "他声音压得低，说完就松开手，恢复了那副冷面孔。你走进帐篷前，回头看了他一眼——他已经回到队伍里，站得笔直，像什么都没说过。"] } },
    options: [{ t: "（挑开帐帘，走进和谈场）", go: "tm_negotiate" }] };
  /* 东部王国 · 铁门关（东侧）（council_* / dragon_companion / purge_intensified 共用链） */
  N["echo_council_support_purification"] = { tag: "main", place: "东部王国 · 铁门关（东侧）", where: "白昼", pace: "normal",
    text: { default: ["铁门关东侧的城门前，进出的人流排成长队，守卒挨个查验文牒。"],
      ifFlag: { "council_support_purification": ["你支持净化令那天的表决，后来在铁门关的茶摊上被人反复提起。有人赞你果断，也有人在你背后啐了一口，说你手里的圣光沾了血。", "城门下，一个抱着孩子的妇人排在你前头。她的包袱角露出半卷盖着教会火漆的文牒。你看了一眼，没有多话。"] } },
    options: [{ t: "（移开视线，排队入城）", go: "echo_purge_intensified" }] };
  N["echo_purge_intensified"] = { tag: "main", place: "东部王国 · 铁门关（东侧）", where: "白昼", pace: "normal",
    text: { default: ["铁门关城头上，旗子换了一面新的，颜色比旧的更深。"],
      ifFlag: { "purge_intensified": ["净化令加码之后，铁门关的宵禁提前了一个时辰。你入城那夜，正撞上一队白袍押着人往南去，锁链拖在石板路上，响得刺耳。", "客栈掌柜给你留的房间里，窗纸糊了三层。他压着嗓子说：“外乡人，这几日城里风声紧，灯别点太亮。”你吹熄油灯，在黑暗里坐了很久。"] } },
    options: [{ t: "（和衣躺下，明日再探消息）", go: "echo_dragon_companion" }] };
  N["echo_dragon_companion"] = { tag: "main", place: "东部王国 · 铁门关（东侧）", where: "白昼", pace: "normal",
    text: { default: ["铁门关内城墙上，钉着一排铁钩，挂着几面褪色的军旗。"],
      ifFlag: { "dragon_companion": ["那头与你同行的幼龙，铁门关的人私下都传开了。有个守城的老卒偷偷问你：“那东西……真不咬人？”你还没答，幼龙从你斗篷底下探出半颗脑袋，打了个哈欠。老卒吓得退了两步，又忍不住凑回来，伸手想摸又不敢。", "后来你进城，幼龙蜷在你怀里睡了一路。城门兵盘查时，它闭着眼，尾巴尖轻轻晃了一下，像在打呼。"] } },
    options: [{ t: "（替它拢了拢斗篷，继续赶路）", go: "tm_frontline" }] };
  N["echo_council_oppose_purification"] = { tag: "main", place: "东部王国 · 铁门关（东侧）", where: "白昼", pace: "normal",
    text: { default: ["铁门关外的官道边，几株老槐树落尽了叶子，枝桠伸向天空。"],
      ifFlag: { "council_oppose_purification": ["你在表决台上反对净化令那天的话，被铁门关的脚夫们编成了顺口溜，在茶棚里传唱。有人为这话拍过桌子，也有人因此再没给你好脸色。", "槐树下，一个卖饼的老头认出你，多给你夹了一勺酱，说：“那句话，说得像个活人说的。”你没解释那场表决里你担过什么，接过饼，咬了一口。"] } },
    options: [{ t: "（道过谢，沿官道继续走）", go: "tm_frontline" }] };
  N["echo_council_compromise_purification"] = { tag: "main", place: "东部王国 · 铁门关（东侧）", where: "白昼", pace: "normal",
    text: { default: ["铁门关的集市上，卖布的伙计正把一匹靛蓝的布展开，往架子上晾。"],
      ifFlag: { "council_compromise_purification": ["你那次在表决台上提出折中方案，两边都没落好。教会嫌你留了余地，反对方嫌你不够决绝。可铁门关的商人却记你的好——那场净化令，到底没把城里的铺子全查个底朝天。", "布摊的老板给你让了个座，说：“外乡人，这城里的买卖人，谢你那句‘先查账、后抓人’。”你接过他递来的热茶，没说那折中方案其实是你半夜改了三遍才定下的。"] } },
    options: [{ t: "（喝完茶，起身入城）", go: "tm_frontline" }] };
  /* 铁门关外 · 废墟（bandit 链已用 tm_watchtower；此处直达） */
  /* 精灵王国 · 银月祭坛（betrayed_classmate / seal3_queen_freed 共用链） */
  N["echo_betrayed_classmate"] = { tag: "main", place: "精灵王国 · 银月祭坛", where: "白昼", pace: "normal",
    text: { default: ["祭坛周围的月桂树在风里沙沙响，银色的树皮泛着柔光。"],
      ifFlag: { "betrayed_classmate": ["你背叛同窗那件事，在精灵长老会的案卷里记了一笔。可你走到祭坛边时，一个守卫却拦住了你，压着嗓子说：“那边那个整理书卷的精灵，替你说过话。”", "你顺着他指的方向看去——是当年与你同窗的精灵，正低头誊抄书卷，听见脚步声也没抬头。你站了一会儿，没有上前。有些话，说出口不如不说。"] } },
    options: [{ t: "（绕过书案，走向祭坛深处）", go: "elf_deep_council" }] };
  N["echo_seal3_queen_freed"] = { tag: "main", place: "精灵王国 · 银月祭坛", where: "白昼", pace: "normal",
    text: { default: ["祭坛中央的月池映着天光，水面平得像一面镜子。"],
      ifFlag: { "seal3_queen_freed": ["女王艾萨拉获得自由的事，精灵们嘴上不说，眉眼却松快了许多。祭坛边，一个年轻的精灵祭司在池边放下三枚银币，说是替一位远行的人求的平安。", "你没问那银币为谁而放。月池的水波荡了荡，又平了。"] } },
    options: [{ t: "（在池边站了一会儿，转身离开）", go: "elf_deep_council" }] };
  /* 矮人王国 · 王都（spared_robber / giant_helper 共用链） */
  N["echo_spared_robber"] = { tag: "main", place: "矮人王国 · 王都", where: "白昼", pace: "normal",
    text: { default: ["矮人王都的城门洞又高又深，铁闸门上的铆钉比拳头还大。"],
      ifFlag: { "spared_robber": ["城门洞下，一个卖炭的老汉忽然抬头冲你笑，露出一口黄牙：“恩公，可算又见着你了。”", "你愣了愣，才认出这是当年山道上那个劫匪。他如今推着炭车，脸上没了当年的凶相，只有风霜。“那夜你放我走，我在矮人王都讨了三年生活，攒下两间炭铺。”他弯下腰，给你磕了个头。"] } },
    options: [{ t: "（受下这一礼，扶他起来）", go: "dwarf_deep_bard" }] };
  N["echo_giant_helper"] = { tag: "main", place: "矮人王国 · 王都 · 铁砧议会厅", where: "白昼", pace: "normal",
    text: { default: ["铁砧议会厅的门楣上刻着锤与砧的纹章，经年的烟火把石头熏成了深色。"],
      ifFlag: { "giant_helper": ["你帮过那个巨人的事，在矮人王都传成了段子：说有个外乡人跟山岭巨人在矿道上称兄道弟，还替他扛过一整车的矿石。", "铁砧议会厅门口，一个矮人铁匠冲你比了个拇指，瓮声瓮气地说：“那大家伙现在逢人就说你讲义气，连铁匠行会想请他搬料，都得先提你的名字。”你没忍住笑了一声。"] } },
    options: [{ t: "（谢过铁匠，走进议会厅）", go: "dwarf_deep_hall" }] };
  /* 东部王国 · 承天城（east_wanted） */
  N["echo_east_wanted"] = { tag: "main", place: "东部王国 · 承天城 · 街市", where: "白昼", pace: "normal",
    text: { default: ["承天城的街市上，卖糖人的摊子前围着一圈孩子，糖锅里冒起甜丝丝的热气。"],
      ifFlag: { "east_wanted": ["你在东境被通缉的事，承天城的衙门口贴过你的画像。可画像画得不像，街市上的贩夫走卒看你几眼，又移开目光，照常卖他们的货。", "有个卖馄饨的老头在你碗里多搁了一勺虾皮，用下巴朝衙门口的方向抬了抬，什么也没说。你吃完馄饨，把铜板压在碗下，走了。"] } },
    options: [{ t: "（低头拢了拢领口，拐进巷子）", go: "east_gov" }] };
  /* 东部王国 · 银穗河 · 码头（gold_scale_blacklisted） */
  N["echo_gold_scale_blacklisted"] = { tag: "main", place: "东部王国 · 银穗河 · 码头", where: "白昼", pace: "normal",
    text: { default: ["银穗河码头上，船工们正往船上扛货，跳板压得咯吱响。"],
      ifFlag: { "gold_scale_blacklisted": ["你被金秤家族列进黑名单的事，在银穗河码头上只有一个人知道。那是当年给你递过消息的老账房，他如今在码头边上摆了个修秤的小摊。", "你路过时，他抬头看了你一眼，把手里那杆秤的秤砣正了正，声音压得很低：“金秤那头的事，我一个字没往外说。秤还在，人也在，就还有得称。”你点点头，走了。"] } },
    options: [{ t: "（沿码头往东，走向故都方向）", go: "east_chengtian_old" }] };
  /* 交汇城（mercury_ally / mercury_disappointed / floating_tower_* 共用链） */
  N["echo_mercury_disappointed"] = { tag: "main", place: "自由城邦 · 交汇城", where: "白昼", pace: "normal",
    text: { default: ["交汇城的钟楼在午时敲过一轮，余音在街巷里滚了又滚。"],
      ifFlag: { "mercury_disappointed": ["你回到交汇城那日，先去了一趟墨丘利常待的药剂铺。铺子换了伙计，说那位戴单片眼镜的先生三个月前搬走了，走时留下一个空瓶子，瓶底压着一张字条：“账，我记下了。”", "你拿起那只空瓶，对着光看了看。瓶子里什么也没有，可你总觉得，有什么东西确实被带走了一部分。"] } },
    options: [{ t: "（把空瓶放回柜台，转身离开）", go: "echo_mercury_ally" }] };
  N["echo_mercury_ally"] = { tag: "main", place: "自由城邦 · 交汇城", where: "白昼", pace: "normal",
    text: { default: ["交汇城的钟楼下，一个卖地图的摊子刚开张，摊主正往木板上钉图钉。"],
      ifFlag: { "mercury_ally": ["你进交汇城时，钟楼下有人朝你吹了声口哨。回头一看，墨丘利靠在墙边，手里转着一枚银币：“听说你回来了。南边的事办得利索，行会那边欠我个人情，正好还你。”", "他把那枚银币弹给你，银币在空中翻了两个跟头，落在你掌心，还带着体温。“拿着，将来要撬锁、要查账、要找什么人，报我的名字。”他说完，转身没入人群，衣摆上沾着药剂的味道。"] } },
    options: [{ t: "（收好银币，走进交汇城）", go: "echo_floating_tower_banished" }] };
  N["echo_floating_tower_banished"] = { tag: "main", place: "自由城邦 · 交汇城", where: "白昼", pace: "normal",
    text: { default: ["交汇城北头立着半截石塔基座，野藤爬满了残墙。"],
      ifFlag: { "floating_tower_banished": ["你放逐浮空塔那件事，交汇城的老人们至今还会在茶摊上提起。塔飘走那天，全城的人站在屋顶上看，看那座塔越飞越高，最后缩成天边一个黑点。", "石塔基座上，有人用刀尖刻了一行小字：“塔走了，地还在。”你蹲下去摸了摸那行字，刀口已经磨得发亮，像是被许多人摸过。"] } },
    options: [{ t: "（直起身，往酒馆方向走）", go: "fc_tavern" }] };
  N["echo_floating_tower_blessed"] = { tag: "main", place: "自由城邦 · 交汇城", where: "白昼", pace: "normal",
    text: { default: ["交汇城的酒馆门口，风灯在檐下晃着，光晕一圈一圈。"],
      ifFlag: { "floating_tower_blessed": ["你从浮空塔上讨来的那道祝福，交汇城的占卜师们各有说法。有人说那是塔灵认了主，有人说不过是塔上法师的客套话。", "可你夜里进城时，路过那座半截塔基，塔基上落着一只灰鸽子，见你走近也不飞，歪头看了你半晌，才扑棱棱飞走。酒馆掌柜后来打趣：“那鸽子是塔上送信的吧？可惜不会说人话。”你没接话，只觉得袖口里那道祝福的印子，隔着衣料透出些暖意。"] } },
    options: [{ t: "（推开酒馆的门，走了进去）", go: "fc_tavern" }] };
  /* 交汇城 · 街道（watchmen_invited） */
  N["echo_watchmen_invited"] = { tag: "main", place: "交汇城 · 街道", where: "黑夜", pace: "normal",
    text: { default: ["入夜后的交汇城街道，更夫的梆子声从远处传来，一下，又一下。"],
      ifFlag: { "watchmen_invited": ["守夜人邀你入伙那夜之后，你在交汇城的巷子里再没见过那些戴面具的人。可你总觉得有双眼睛在暗处跟着你——不是恶意，更像是在替你看着什么。", "有一回你深夜归城，城门口的值夜兵多看了你两眼，什么都没说就放行了。你摸到腰间那枚守夜人的铜哨，还留着。哨子没吹响过，但你知道，吹响的时候，会有人来。"] } },
    options: [{ t: "（把铜哨贴着掌心收好，继续走）", go: "fc_streets" }] };
  /* 交汇城 · 贫民窟（thieves_guild_member） */
  N["echo_thieves_guild_member"] = { tag: "main", place: "交汇城 · 贫民窟", where: "白昼", pace: "normal",
    text: { default: ["贫民窟的巷子又窄又深，晾衣绳横七竖八地搭在头顶，水滴答滴答。"],
      ifFlag: { "thieves_guild_member": ["你入盗贼公会那阵子的事，贫民窟的老住户们看在眼里。有人见了你绕道走，也有人冲你点头——点头的，多半也是从这行当里挣过饭吃的。", "巷口补鞋的哑巴老头忽然拦你，在你靴底抹了道灰印，又指了指巷子深处。你顺着看过去，墙根下画着个极淡的记号，只有行里人才认得。你冲他抱了抱拳，他没理你，低头继续补他的鞋。"] } },
    options: [{ t: "（记下记号的位置，离开贫民窟）", go: "fc_slums_generic" }] };
  /* 学院山门（seraphine_substitute_promise / skip_academy 共用链） */
  N["echo_seraphine_substitute_promise"] = { tag: "main", place: "艾尔达魔法学院 · 山门", where: "白昼", pace: "normal",
    text: { default: ["学院的石门在雪后泛着青光，门楣上的星徽被擦得锃亮。"],
      ifFlag: { "seraphine_substitute_promise": ["你替塞拉芬应下那个替身承诺之后，学院里的流言传了几轮。有人说你疯了，也有人把你当成某种殉道者。只有你清楚，那承诺的重量压在心里，像一块没焐热的铁。", "山门前，扫雪的杂役看见你，停下来行了个礼。他没问你在外头遇见了什么，只说：“先生，雪天路滑，进门时小心些。”你点点头，跨过门槛，雪在靴底咯吱作响。"] } },
    options: [{ t: "（踏着雪，走进学院大门）", go: "north_academy_gate" }] };
  N["echo_skip_academy"] = { tag: "main", place: "艾尔达魔法学院 · 山门", where: "白昼", pace: "normal",
    text: { default: ["学院山门外的石阶上，积雪被人扫出一条窄道，露出下面的青石板。"],
      ifFlag: { "skip_academy": ["你当年绕过学院、直接踏上大陆那件事，如今回头走回学院门口，竟有些恍惚。门房换了人，不认识你，照例问你找谁。", "你站在门口，没报当年的名字，只说路过。门房点点头，又缩回炉子边烤火去了。你在山门外站了一会儿，风从北面吹来，带着雪的味道。到底还是来了。"] } },
    options: [{ t: "（迈进学院，权当补上一课）", go: "north_academy_gate" }] };
  /* 兽人草原（prophecy_defied / khan_aware / oracle_fake 共用链） */
  N["echo_prophecy_defied"] = { tag: "main", place: "兽人草原 · 圣山脚下 · 猎人小道", where: "白昼", pace: "normal",
    text: { default: ["圣山脚下的猎人小道，兽蹄印和靴印混在一起，深深浅浅地延伸向山顶。"],
      ifFlag: { "prophecy_defied": ["你违抗预言那件事，在草原上传得比风还快。有人骂你触怒祖灵，也有人偷偷在自家帐篷门口挂了一块辟邪的骨片，说是照你的法子求的。", "小道边的石头上，不知谁用炭笔画了只歪歪扭扭的白狼。你蹲下去看了看，画痕很新，炭灰还没被风吹散。"] } },
    options: [{ t: "（沿着小道，往图腾林走）", go: "orc_deep_totem" }] };
  N["echo_khan_aware"] = { tag: "main", place: "兽人草原 · 圣山 · 图腾林", where: "白昼", pace: "normal",
    text: { default: ["图腾林里，彩绘的木柱一排排立着，风穿过柱间，发出呜呜的响声。"],
      ifFlag: { "khan_aware": ["大汗知道你来草原的事之后，图腾林边多了几双眼睛——不是敌意，是打量。你走到哪，总有牧人的孩子远远跟着，看你像看一件从南边运来的稀罕物。", "一个老牧人拦住你，用生硬的通用语问你：“外乡人，你替我们跟大汗说了那话，图什么？”你没答，他反倒笑了，往你马鞍上挂了一袋奶干。"] } },
    options: [{ t: "（谢过老牧人，走向黑石部族营地）", go: "orc_deep_gate" }] };
  N["echo_oracle_fake"] = { tag: "main", place: "兽人草原 · 黑石部族营地 · 兽人集市", where: "白昼", pace: "normal",
    text: { default: ["兽人集市上，皮货、盐巴和铁器摆了一地，讨价还价的声音此起彼伏。"],
      ifFlag: { "oracle_fake": ["你揭穿假神谕那件事，在集市上传成了好几版。有人信你，说巫医帐里的骨头确实做过手脚；也有人骂你，说外乡人凭什么碰草原的神。", "卖盐的老萨满摊前，一个半大兽人孩子趁大人不注意，偷偷问你：“那神谕……真的是假的？”你还没答，孩子就被他娘拎着耳朵拽走了。老萨满往你手里塞了包盐，说：“盐是真的，话是不是真的，你自己尝。”"] } },
    options: [{ t: "（把盐收好，走向巫医帐）", go: "orc_deep_witch" }] };
  /* 大陆 · 多方战线（war_after 等场景的 purge 链已在 tm_frontline） */
}());
