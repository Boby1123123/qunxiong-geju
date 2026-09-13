/* ===== /v100inj:acd-life/ 方向三 · 学院生活沙盒（纯数据；引擎零改动） =====
 * 艾尔达学院日常：食堂三餐/宿舍夜谈/晨练/打工/学院祭/同学支线/深夜图书馆。
 * 挂载：academy_elda_hub 追加入口；go 回 academy_elda_hub。
 * 规范：V66 白描 / 治理词约束 / 四段式 / 引号成对。 */
(function () {
  if (typeof N === "undefined") return;
  N["acd_life_dining"] = {
    tag: "branch", place: "学院 · 食堂大厅", where: "白昼", pace: "normal",
    text: [
      "晚饭的钟声刚响过，食堂里已经排起三条长队。铁皮屋顶下全是碗碟的碰响和说话声，混着炖肉和烤面包的气味，热烘烘地压在每个人脸上。",
      "窗口挂了三块木牌：丰盛一餐，十五个铜星；普通一餐，五个铜星；干面包配凉水，一个铜星。掌勺的胖厨娘把大勺往锅里一插，头也不抬地喊：“下一位。”",
      "你排到窗口前，闻到那锅炖肉的味道，胃先替你做了决定。身后有人推了你一把：“同学，往前挪挪，后头还排着十几个呢。”",
      "钱袋在腰间晃了晃。你想起离家时带的盘缠，又想起这座学院里的日子还长——一顿饭怎么吃，其实也是一门功课。"
    ],
    options: [
      { t: "要一份丰盛的（15铜星）", go: "acd_life_dining_fine", timeCost: "1period", effects: { gold: -15, flag: "acd_dined_fine"} },
      { t: "普通一餐就好（5铜星）", go: "acd_life_dining_plain", timeCost: "1period", effects: { gold: -5, flag: "acd_dined_plain"} },
      { t: "干面包配凉水（1铜星）", go: "acd_life_dining_cheap", timeCost: "1period", effects: { gold: -1, flag: "acd_dined_cheap"} }
    ]
  };

  N["acd_life_dining_fine"] = {
    tag: "branch", place: "学院 · 食堂", where: "白昼", pace: "normal",
    text: [
      "盘子里的炖肉堆得冒尖，浇了厚厚一层肉汁，配两块烤得焦黄的白面包。你找了个靠窗的位子坐下，掰开面包，热气腾腾地冒上来。邻桌两个学生正压着嗓子说话——",
      "“……昨晚钟楼二楼的灯，又亮到半夜。”",
      "“嘘。别说了，上回议论这事的人，下个月就申请调去别院了。”",
      "他们看见你，立刻住了嘴，低头吃饭。窗外的暮色正一层层沉下去，钟楼在远处立着，安安静静的，像个什么都没听见的哑巴。你咬了一口面包，肉汁烫了舌头。"
    ],
    options: [
      { t: "凑过去打听钟楼的事", check: { a: "CHA", sk: "persu", label: "打听" }, tier: { ok: ["那两人对视一眼，其中一个压着嗓子：“你新来的吧？学院有条规矩——子夜之后，别往钟楼那边走。”你记住了这句话。"], fail: ["他们看你一眼，端着盘子走了。你只听到半句“……第三个了”。"] }, go: "acd_plot_clue_board", effects: { flag: "acd_tale_heard", san: -1 } },
      { t: "安安静静吃完这顿饭", go: "academy_elda_hub", timeCost: "1period", effects: { hp: 8, san: 4} },
      { t: "再打包一份带走", go: "academy_elda_hub", timeCost: "1period", effects: { gold: -2, item: "dried_meal"} }
    ]
  };

  N["acd_life_dining_plain"] = {
    tag: "branch", place: "学院 · 食堂", where: "白昼", pace: "light",
    text: [
      "土豆炖肉，一碗，配一块硬得能敲桌子的黑面包。你拿勺子戳开土豆，发现肉块比别桌少了一半——胖厨娘瞥了你一眼：“新来的？肉是按人头分的，别嫌少。”",
      "你把面包掰碎了泡进汤里。身后传来厨娘压低的声音：“……多给你舀一勺，吃快点，后头还排着队。”你回头，她已经在招呼下一位了，好像刚才那句话不是她说的。",
      "一碗热汤下肚，身上有了力气。食堂的喧闹渐渐远了，你抹了抹嘴，想着晚上还有一摞书要看。"
    ],
    options: [
      { t: "去道声谢再走", go: "academy_elda_hub", timeCost: "1period", effects: { san: 3, relation: {npc: "acd_cook", delta: 5}} },
      { t: "直接回宿舍看书", go: "acd_life_dorm_night", timeCost: "1period", effects: { hp: 4} }
    ]
  };

  N["acd_life_dining_cheap"] = {
    tag: "branch", place: "学院 · 食堂角落", where: "白昼", pace: "light",
    text: [
      "干面包，凉水。你坐在食堂最偏的角落里啃，面包屑掉在桌上，得用手拢着。旁边桌的炖肉香气一阵阵飘过来，你不去看它，只盯着手里那块越来越小的面包。",
      "一个穿旧袍子的学生端着碗在你对面坐下，也没说话，把自己碗里的土豆拨了两块到你盘子里。你抬头，他低着头吃饭，像什么都没发生。",
      "你看着那两块土豆，忽然就不觉得这顿饭有多难以下咽了。"
    ],
    options: [
      { t: "记下这个人的样子", go: "academy_elda_hub", timeCost: "1period", effects: { san: -2, flag: "acd_benefactor_seen"} },
      { t: "吃完饭去图书馆（看书能忘掉饿）", go: "acd_life_lib_night", timeCost: "1period", effects: { hp: 1} }
    ]
  };

  N["acd_life_dorm_night"] = {
    tag: "branch", place: "学院 · 宿舍", where: "黑夜", pace: "normal",
    text: [
      "宿舍的灯熄了，月光从窗台爬进来，在两张床之间划了一道白线。你的室友还没睡着，翻了个身，床板吱呀响了一声。",
      "“喂，”他开口，声音闷在枕头里，“你睡了吗？”",
      "窗外是学院的操场，再远一点，钟楼的尖顶戳在夜空里。夜风从窗缝钻进来，带着草叶和露水的味道。你盯着天花板，想起白天食堂里那两个人说的钟楼，想说点什么，又咽了回去。",
      "黑暗里，室友又说：“我刚来那会儿，听高年级的说——这楼里有个规矩。”他停了一下，“子夜之后，别数钟楼的钟声。”"
    ],
    options: [
      { t: "追问这个规矩", go: "acd_life_dorm_tale", timeCost: "1period" },
      { t: "聊起各自的家乡", go: "acd_life_dorm_story", timeCost: "1period" },
      { t: "翻个身，各自睡下", go: "academy_elda_hub", timeCost: "1period", effects: { san: 5, hp: 6} }
    ]
  };

  N["acd_life_dorm_story"] = {
    tag: "branch", place: "学院 · 宿舍", where: "黑夜", pace: "normal",
    text: [
      "“我老家在河湾镇，”室友说，“镇口有棵老槐树，树底下埋着我家一坛酒。我爹说，等我出息了，回去挖出来喝。”他笑了一声，“我估计等我出息了，那酒早就被雨水泡坏了。”",
      "你沉默了一会儿，也讲了一件家乡的事——讲的时候，手不自觉地按了按贴身藏着的那件旧物。黑暗里，这个动作没人看见。",
      "室友听完了，没评价，只“嗯”了一声。过了很久，他说：“能带在身上的东西，都是拿不下来的。”",
      "这句话砸在黑暗里，半天没人接。你睁着眼，听着他的呼吸渐渐均匀。窗外有风，钟楼的方向，好像有什么东西，响了一下。"
    ],
    options: [
      { t: "也问问他身上的旧物", go: "academy_elda_hub", timeCost: "1period", effects: { relation: {npc: "acd_roommate", delta: 12}} },
      { t: "把话记在心里，睡下", go: "academy_elda_hub", timeCost: "1period", effects: { san: 4, hp: 4} }
    ]
  };

  N["acd_life_dorm_tale"] = {
    tag: "branch", place: "学院 · 宿舍", where: "黑夜", pace: "normal",
    text: [
      "“学院的钟楼，白天敲半点，晚上敲整点，从来不多一下，也不少一下。”室友的声音压得很低，“可老生说，有一年冬天，有个学生在子夜听见钟响了十三下。”",
      "“第二天，那个学生就退学了。没人知道他听见了什么，也没人再提起他。”",
      "“后来每年都有人说，子夜听见了第十三下。每次说完这话的人，没过多久就调走、退学，或者——不见了。”",
      "他说完，宿舍里安静得能听见自己的心跳。月光在地板上挪了半寸。你忽然想起白天那两个人说的“第三个了”，后背一阵发凉。"
    ],
    options: [
      { t: "把这个怪谈记下来", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_tale_heard", xp: 1, san: -2} },
      { t: "嗤笑一声：“故事罢了。”", go: "academy_elda_hub", timeCost: "1period", effects: { san: 1} }
    ]
  };

  N["acd_life_morning"] = {
    tag: "branch", place: "学院 · 训练场", where: "白昼", pace: "normal",
    text: [
      "天刚蒙蒙亮，训练场上已经有人了。晨雾还没散，刀剑碰撞的声音一下一下，闷闷的，像有人在远处劈柴。",
      "靠墙的老教习坐在一条长凳上，面前摆着个缺了口的茶碗。他不看任何人，只时不时喊一句：“下盘！下盘又飘了！”声音不高，整个场子却都听得见。",
      "你走到场边，正看见两个高年级学生在切磋。一个使剑，一个使棍，你来我往了十几个回合，忽然那使棍的卖了个破绽，使剑的抢攻一步，棍影一翻，反而敲在他腕子上。剑脱了手，在地上弹了两下。",
      "“看明白了？”老教习不知什么时候站在你旁边，端着茶碗，“剑快了没用，得先学会让人家把破绽送给你。”他喝了口茶，走开了。"
    ],
    options: [
      { t: "跟着晨跑的人跑几圈", go: "academy_elda_hub", timeCost: "1period", effects: { hp: 3} },
      { t: "留下来看切磋，琢磨打法", go: "academy_elda_hub", timeCost: "1period", effects: { xp: 12} },
      { t: "去向老教习请教", go: "acd_life_morning_ask", timeCost: "1period" }
    ]
  };

  N["acd_life_morning_ask"] = {
    tag: "branch", place: "学院 · 训练场", where: "白昼", pace: "normal",
    text: [
      "老教习听了你的来意，上下打量你一眼，把茶碗往长凳上一放：“想学？先说你打算拿什么换。”",
      "你没说话，从怀里摸出那件贴身的旧物，想了想，又放了回去。他看在眼里，哼了一声：“行，有点意思。教你三招，够你在学院里撑到毕业——第一招，挨打要站直。”",
      "他做了个极慢的动作，你跟着学，才做一半就觉出不对——重心全偏了。他又示范一遍，这回你看清了：他的脚踝始终绷着，像一根压弯的弓。",
      "“剑也好，拳头也好，根在脚下。下盘稳了，挨打不疼，打人才疼。”他捡起茶碗，“明天还来，晚了没位置。”"
    ],
    options: [
      { t: "认真学，回去自己练", go: "academy_elda_hub", timeCost: "1period", effects: { skill: {s: "martial", v: 10}, relation: {npc: "acd_coach", delta: 8}} },
      { t: "谢过他，明天再来", go: "academy_elda_hub", timeCost: "1period", effects: { relation: {npc: "acd_coach", delta: 5}} }
    ]
  };

  N["acd_life_job_lib"] = {
    tag: "branch", place: "学院 · 图书馆", where: "白昼", pace: "normal",
    text: [
      "图书馆的兼职，说白了就是整理还回来的书，顺便把借阅卡归档。馆长是个戴圆眼镜的老头，交代完规矩，就缩回他那间小屋里去喝茶了。",
      "你抱着一摞书往书架上塞，忽然从一本《度量衡史》里滑出一张纸条。纸条对折着，边缘发黄，上面画着一个符号——像一杆秤，秤钩朝下，底下压着一行小字：“天平从不倾斜。除非有人加了砝码。”",
      "你捏着纸条，指腹能摸到纸上一道折痕，那是被人反复折过的痕迹。老馆长在小屋里咳了一声，你手一抖，纸条差点掉进书缝里。",
      "窗外的光照进来，把纸条上的墨迹照得发亮。那行字写得工整，一笔一划，像是怕人认不出——又像是，故意要人认出来。"
    ],
    options: [
      { t: "把纸条交给馆长", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_note_clean", relation: {npc: "acd_librarian", delta: 6}, gold: 4} },
      { t: "把纸条收进怀里", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_note_kept", gold: 4} },
      { t: "当作没看见，继续整理", go: "academy_elda_hub", timeCost: "1period", effects: { gold: 4, san: -1} }
    ]
  };

  N["acd_life_job_kitchen"] = {
    tag: "branch", place: "学院 · 后厨", where: "白昼", pace: "light",
    text: [
      "后厨比前厅热十倍。大锅里的水汽往上扑，墙角的木架子上码着一排排腌菜坛子。掌勺的胖厨娘把一块猪油丢进锅里，油星子溅起来，她眼都不眨。",
      "你负责削土豆。厨娘一边掌勺一边和帮工说话，声音被锅铲的响动盖着：“……昨儿夜里，又有人瞧见钟楼二楼亮灯了。”",
      "“嘘——”帮工压着嗓子，“你这嘴，上回要不是我兜着……”",
      "“行行行，不说了。反正啊，”厨娘把锅一颠，“这学院里的事，知道得越少，睡得越香。”她转身，往你面前放了一碗热汤，“土豆削完，把汤喝了再走。”"
    ],
    options: [
      { t: "把厨娘的话记在心里", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_kitchen_rumor", gold: 3, relation: {npc: "acd_cook", delta: 6}} },
      { t: "喝汤，谢过，离开", go: "academy_elda_hub", timeCost: "1period", effects: { gold: 3, san: 3} }
    ]
  };

  N["acd_life_job_apoth"] = {
    tag: "branch", place: "学院 · 炼金室", where: "白昼", pace: "normal",
    text: [
      "炼金室的活计是磨药。月光草晒干了，要在石臼里碾成粉，得碾足三百下，不能多也不能少。你磨到两百下的时候，手臂已经酸了。",
      "负责带你的学姐在一旁配药剂，头也不抬地说：“银月草只准白天磨，记住了。晚上磨出来的粉，会发青——那样的药，没人敢用。”",
      "你应了一声，余光扫到墙角一只柜子，上面挂了三把锁。学姐像是背后长了眼睛：“别看那个。看多了，教授会找你谈话。”",
      "石臼里的草粉渐渐细了，泛着淡淡的银光。你把粉倒进瓷瓶里，封好口，忽然想起白天听到的那些事，手顿了顿。"
    ],
    options: [
      { t: "问学姐柜子里是什么", go: "acd_life_job_apoth_ask", timeCost: "1period" },
      { t: "专心磨药，不问不该问的", go: "academy_elda_hub", timeCost: "1period", effects: { skill: {s: "alchemy", v: 10}, gold: 5} }
    ]
  };

  N["acd_life_job_apoth_ask"] = {
    tag: "branch", place: "学院 · 炼金室", where: "白昼", pace: "light",
    text: [
      "学姐听了你的问题，手里的滴管停了半拍。她没抬头，声音平平的：“那柜子里是教授年轻时收集的标本。有些药草，已经绝种了。”",
      "“只是标本？”你追问。她终于抬起头看你，眼神里有点说不清的东西：“你这人，怎么爱问不该问的。药磨好了就走吧，明儿还有一筐要磨。”",
      "你被她看得有些不自在，把瓷瓶放好，转身要走。身后传来她极轻的一声：“……别学上个月那个学生。”",
      "你回头，她已经低头配药了，像那句话不是她说的。"
    ],
    options: [
      { t: "把这句话记下", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_apoth_hint", gold: 3, san: -1} },
      { t: "只当没听见，回去休息", go: "academy_elda_hub", timeCost: "1period", effects: { gold: 3} }
    ]
  };

  N["acd_life_festival"] = {
    tag: "branch", place: "学院 · 中央广场", where: "黑夜", pace: "deep",
    text: [
      "学院祭是每年春祭后第一个满月的夜晚。广场上挂满了灯笼，红的、黄的、白的，风一过，整片光海晃动起来。摊位从食堂门口一路摆到钟楼脚下，烤肉、糖画、旧书、护符，什么都有。",
      "比武台那边围满了人，两个高年级学生正打得热闹，喝彩声一阵接一阵。烟花在钟楼顶炸开的时候，人群齐刷刷仰起头，火光在每一张脸上跳了跳，又落下去。",
      "你在人流里走着，忽然被人撞了一下。一个戴兜帽的学生擦肩而过，袍角带起一阵风——你好像看见他袖口里，露出一角折得整整齐齐的纸，边缘发黄，和图书馆里那张纸条一样。",
      "他走远了，汇进人群，像一滴水落进河里。你站在原地，灯笼的光晃了晃，烟花又炸开一朵，这一次，人群的欢呼声里，好像夹着一声很轻的、不像欢呼的声响。"
    ],
    options: [
      { t: "追上去看看那个人", go: "acd_plot_clue_shadow", timeCost: "1period" },
      { t: "去旧书摊逛逛", go: "acd_life_festival_stall", timeCost: "1period" },
      { t: "留在广场看烟火", go: "academy_elda_hub", timeCost: "1period", effects: { san: 6, relation: {npc: "acd_roommate", delta: 5}} }
    ]
  };

  N["acd_life_festival_stall"] = {
    tag: "branch", place: "学院 · 旧书摊", where: "黑夜", pace: "normal",
    text: [
      "旧书摊的老板是个精瘦的老头，面前铺一块油布，上面堆着几十本书，最便宜的三个铜星一本。你蹲下来翻，大多是些看旧了的课本和小说，角落里压着一本封皮都烂了的笔记。",
      "你抽出来一看，扉页上写着一行褪色的字：“赠吾友——钟楼一别，竟成永诀。”下面没有署名，只画了个小小的符号，像一杆秤。",
      "你翻了两页，里面夹着一张泛黄的纸，叠成四折。老板凑过来看了一眼，说：“这本是前几年收的，也不知道是谁的。你要是喜欢，八个铜星拿走。”",
      "烟花又在头顶炸开了。你捏着那本笔记，指尖能感觉到封皮下的硬纸板里，好像还夹着什么别的东西。"
    ],
    options: [
      { t: "买下这本笔记（8铜星）", go: "acd_plot_lab_record", timeCost: "1period", effects: { gold: -8, flag: "acd_plot_map_hint", item: "old_notebook"} },
      { t: "放回去，只看不买", go: "academy_elda_hub", timeCost: "1period" }
    ]
  };

  N["acd_life_classmate_celia"] = {
    tag: "branch", place: "学院 · 图书馆自习区", where: "白昼", pace: "normal",
    text: [
      "塞西莉亚·星辉坐在自习区最里面的位子上，面前摊着四本书、两沓笔记，一支羽毛笔在她指间转得飞快。她是这届新生里公认的天才——上课从不记笔记，考试从不出前三。",
      "你走近，她头也不抬：“笔记在桌上，自己抄，抄完放回原位。”她甚至没问你是谁。你低头一看，那沓笔记字迹工整得像印出来的，每一页边缘还有小字批注，都是课本上找不到的东西。",
      "你抄了两页，她忽然停下笔，抬头看了你一眼：“你手上有茧。练剑的？”没等你回答，她又低下头，“练剑的人来抄我的魔法笔记，有意思。”",
      "窗外的光落在她发梢上。她没再说话，但那支转着的笔，不知什么时候停了。"
    ],
    options: [
      { t: "请教一个不懂的问题", go: "acd_life_classmate_celia_ask", timeCost: "1period" },
      { t: "道谢，抄完就离开", go: "academy_elda_hub", timeCost: "1period", effects: { relation: {npc: "acd_celia", delta: 8}, xp: 1} },
      { t: "请她喝杯热茶", go: "academy_elda_hub", timeCost: "1period", effects: { gold: -3, relation: {npc: "acd_celia", delta: 6}} }
    ]
  };

  N["acd_life_classmate_celia_ask"] = {
    tag: "branch", place: "学院 · 图书馆自习区", where: "白昼", pace: "normal",
    text: [
      "你指着笔记里关于灵魂感知的一段，问了一个憋了一下午的问题。塞西莉亚停下笔，看了你两秒，忽然从书堆底下抽出一本更旧的书：“你问的这个，课本上写的是错的。”",
      "她翻开书，指着一行小字：“灵魂感知的媒介不是意识，是呼吸。你先稳住呼吸，再谈感知。”她讲得很慢，和传闻里那个冷淡的天才判若两人。",
      "你听懂了七八成，她讲完，又变回那副冷淡的样子：“行了，抄完走吧。再问下去，我得收你学费了。”",
      "你抱着笔记离开的时候，听见她在背后嘟囔了一句：“……练剑的，学魔法倒挺快。”声音很小，像是说给自己听的。"
    ],
    options: [
      { t: "回去照她说的练", go: "academy_elda_hub", timeCost: "1period", effects: { skill: {s: "soul", v: 10}, relation: {npc: "acd_celia", delta: 12}} },
      { t: "改天带点吃的谢她", go: "academy_elda_hub", timeCost: "1period", effects: { relation: {npc: "acd_celia", delta: 8}} }
    ]
  };

  N["acd_life_classmate_hao"] = {
    tag: "branch", place: "学院 · 廊道角落", where: "任意", pace: "light",
    text: [
      "耗子蹲在廊道拐角的阴影里，嘴里叼着一根草茎。他真名不叫耗子，但所有人都这么叫他——贫民窟出来的，消息比猫还灵，想找什么消息，找他就对了。",
      "你走近，他眼睛一亮，凑上来压着嗓子：“嘿，听说你最近老往图书馆跑？巧了，我也听说图书馆最近出了点事——借书的人少了，还书的人，也少了。”",
      "他吐掉草茎，伸出一只手：“消息不白给，三个铜星。或者——”他上下打量你，“你告诉我，你身上那件旧东西，到底是什么？好多人在打听呢。”",
      "他笑得很随意，但眼睛里的光，一点不像在开玩笑。"
    ],
    options: [
      { t: "花三个铜星买消息", go: "academy_elda_hub", timeCost: "1period", effects: { gold: -3, flag: "acd_hao_tip"} },
      { t: "反问他：谁在打听？", go: "acd_life_classmate_hao_ask", timeCost: "1period" },
      { t: "不理他，走开", go: "academy_elda_hub", timeCost: "1period" }
    ]
  };

  N["acd_life_classmate_hao_ask"] = {
    tag: "branch", place: "学院 · 廊道角落", where: "任意", pace: "normal",
    text: [
      "耗子听了你的反问，先是一愣，然后笑了，笑声里带着点别的味道：“你胆子不小啊。行，告诉你——”",
      "他凑到你耳边，声音压得几乎听不见：“打听你旧东西的人，不是学生。是穿着灰袍的，半夜在钟楼那边走动。我亲眼见过两回。”",
      "“钟楼那边不是封了吗？”你问。他摇头：“封的是门，又不是墙根底下的路。老话讲，钟楼下头有暗道，直通……”他忽然住了嘴，警觉地朝廊道那头看了一眼，“有人来了，改天再说。”",
      "他缩回阴影里，一眨眼就不见了。你站在原地，廊道里空荡荡的，只有风从尽头吹过来。"
    ],
    options: [
      { t: "把这件事记下", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_hao_hint", san: -1} },
      { t: "去找灰袍的线索", go: "acd_plot_clue_shadow", timeCost: "1period" }
    ]
  };

  N["acd_life_lib_night"] = {
    tag: "branch", place: "学院 · 图书馆 · 深夜", where: "黑夜", pace: "deep",
    text: [
      "深夜的图书馆比白天安静一百倍。长桌上一盏油灯，你一个人坐在灯下，书页翻动的声音响得吓人。老馆长早锁门去睡了，只给你留了一盏灯和一句“走的时候把门带上”。",
      "你读的是白天借的一本《元素编年史》，正翻到“封印”那一章，忽然听见书架深处传来一声响——像书页翻动，又像什么东西磕在木头上。",
      "你抬起头。书架尽头，灯照不到的地方，一片漆黑。你走过去，一排排书脊在黑暗里沉默地站着。没有人。只有一本《元素编年史》的副本，翻开着，停在和你看的同一页——“封印”。",
      "油灯的火苗晃了一下。你低头看那一页，有一段话被人用铅笔划了线：“……钟楼的第十三下钟声，是旧约的余响。听见者，不可声张。”你忽然觉得，这间图书馆，比白天大了很多。"
    ],
    options: [
      { t: "把那页书抄下来", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_seal_page", xp: 2, san: -2} },
      { t: "合上书，回宿舍", go: "academy_elda_hub", timeCost: "1period", effects: { san: -1} },
      { t: "循着声音找过去", go: "acd_plot_mercury_test", timeCost: "1period" }
    ]
  };
})();
