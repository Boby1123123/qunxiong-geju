/* ===== /v101inj:dn_acd_plot2/ 学院暗流·深化（批次C 25 节点）
 * 承接 v100 方向四框架（dn_acd_plot.js）：马尔科失踪调查纵深
 * 三线 payoff 变体（ifFlag 按 acd_plot_choice 值），全部 flag/go 衔接 hub 与既有账本。
 */

N["acd_plot_investigate"] = {
  tag:"branch", place:"学院 · 公告栏", where:"任意", pace:"normal",
  text:[
    "公告栏上的寻人启事被风吹得只剩半张，纸角卷着。上面的字已经模糊，只看得清一行：“马尔科·韦恩，炼金系二年级，失踪于上月二十日，知其下落者请告知学院教务处。”",
    "你撕下那半张纸，翻过来——纸背有人用炭笔写着一行小字：“别查。查下去，你会变成下一个。”",
    "你把纸收好，心里盘算着从哪儿下手：他的宿舍、他的朋友、学院的档案、那座钟楼。"
  ],
  options:[
    {t:"去马尔科的宿舍看看", effects:{flag:"acd_malco_powder", timeCost:"1period"}, go:"acd_plot_malco_room"},
    {t:"去找他的朋友安德鲁", effects:{timeCost:"1period"}, go:"acd_plot_malco_friend"},
    {t:"去教务处的失踪档案", effects:{timeCost:"1period"}, go:"acd_plot_missing_old"},
    {t:"去钟楼附近转转", effects:{timeCost:"1period"}, go:"acd_plot_bell_day"},
    {t:"（先回学院，从长计议）", effects:{timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_malco_room"] = {
  tag:"branch", place:"学院 · 宿舍 · 马尔科的房间", where:"任意", pace:"deep",
  text:[
    "马尔科的宿舍在二楼走廊尽头，门没锁——锁是坏的，一推就开。房间很整洁，床铺叠得整齐，桌上摆着几本炼金课本和一只没洗的坩埚。",
    "你翻他的抽屉，在底层找到一只小布袋，里面是半包银月草粉——药房那种罐子装的，但袋口有新鲜的折痕，像是刚被人打开看过。",
    "布袋边上放着一枚指甲，圆形的，像是从某只戒指上脱落的。你凑近看，指甲内侧刻着一个小小的记号——两片叶子，像是某种徽记。",
    "你正要放回去，忽然听见走廊上有脚步声。你屏住呼吸——脚步声在你门口停了一下，又走远了。"
  ],
  options:[
    {t:"（把银月草粉和指甲记号记下）", effects:{flag:"acd_malco_powder", item:"old_notebook", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"搜得更细一点，找找有没有日记之类", check:{a:"INT", sk:"detect", label:"搜索"}, tier:{ok:["你在床板夹层里摸到一本硬皮本——是马尔科的日记。"], fail:["你翻了半天，没找到更多东西。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_malco_diary"}
  ]
};

N["acd_plot_malco_diary"] = {
  tag:"branch", place:"学院 · 宿舍 · 马尔科的房间", where:"任意", pace:"deep",
  text:[
    "日记本很旧，封面磨得发白。你翻到最后一页，上面的字迹比前面潦草得多——",
    "“月十五日。钟楼里有声音叫我的名字。不是敲钟的声音，是人的声音，很轻，像从地底下传上来的。我数过，它叫了三声。第三声的时候，我的银月草粉罐子自己打开了。”",
    "“月十七日。我把钥匙放在床板下第三块板砖下面。如果我不在了，希望有人能找到它——它开钟楼二楼的门。”",
    "“月十九日。我不该去档案室。我知道得太多了。明天晚上，我会去钟楼。如果天亮我没回来——别来找我。”",
    "最后一行字，墨水洇开了一小片，像被什么打湿过。你合上日记，手指按在‘钟楼二楼’四个字上。"
  ],
  options:[
    {t:"（把日记收好，记住钥匙位置）", effects:{flag:"acd_malco_diary_key", item:"old_notebook", xp:15, timeCost:"1period"}, go:"acd_plot_malco_room"},
    {t:"（只记内容，把日记放回原位）", effects:{flag:"acd_diary_kept", xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_malco_friend"] = {
  tag:"branch", place:"学院 · 教室 · 安德鲁", where:"任意", pace:"normal",
  text:[
    "安德鲁是马尔科的同桌，也是学院里跟他最要好的人。你找到他时，他正盯着窗外发呆，面前的书一页没翻。",
    "听说你也在查马尔科的事，他沉默了很久，忽然说：“他失踪前一周，天天跟我说同一句话——”",
    "“他说，‘天平从来不会自己倒。除非，有人动了砝码。’”安德鲁声音很哑，“他总在半夜醒来，说钟楼在叫他。我说那是钟声，他说不是——‘是人的声音，在叫我的名字，叫我上去。’”",
    "“我劝他别去。他说他必须去——‘他们已经在做了，安德鲁。再做下去，就晚了。’”安德鲁低下头，“那是他跟我说的最后一句话。”",
    "他抬起头，眼睛红着：“你要是查到了什么，告诉我。马尔科他——不是那种会自己走掉的人。”"
  ],
  options:[
    {t:"（把安德鲁的话记下）", effects:{flag:"acd_malco_friend_tale", relation:{npc:"acd_malco_friend", v:10}, xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问他：马尔科有没有提到过‘他们’是谁", effects:{relation:{npc:"acd_malco_friend", v:5}, xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_missing_old"] = {
  tag:"branch", place:"学院 · 教务处 · 档案室", where:"任意", pace:"deep",
  text:[
    "教务处的档案室白天有人看着，你等傍晚管理员去打水的时候溜了进去。失踪记录在靠墙的铁柜里，你抽出那本厚册子，翻到失踪学生一栏——",
    "埃尔文·索尔，十三年前，炼金系二年级，失踪。备注：已按惯例处理。",
    "赛拉·布朗，七年前，炼金系二年级，失踪。备注：已按惯例处理。",
    "马尔科·韦恩，上月，炼金系二年级，失踪。备注：已按惯例处理。",
    "三行记录，三个名字，同一句话——“已按惯例处理”。你盯着那行字，觉得这六个字比任何鬼故事都冷。",
    "你再往前翻——更早的记录被撕掉了好几页，撕口参差不齐。档案室的窗户外，天已经黑了。"
  ],
  options:[
    {t:"（记下三个名字和‘已按惯例处理’）", effects:{flag:"acd_missing_archive", xp:15, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"偷走这几页记录", check:{a:"AGI", sk:"stealth", label:"潜行"}, tier:{ok:["你把三页记录撕下来叠好，塞进怀里。"], fail:["门口传来脚步声，你来不及撕页，只记下了名字。"]}, effects:{flag:"acd_missing_archive", xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_bell_day"] = {
  tag:"branch", place:"学院 · 钟楼 · 白昼", where:"白昼", pace:"deep",
  text:[
    "钟楼白天是锁着的，但守钟的老头住在楼下的耳房里。你找到他时，他正坐在门槛上晒太阳，一只眼睛半瞎，另一只眼睛浑浊地盯着你。",
    "“学生？”他嗓子里像含着一口痰，“钟楼不让进。规矩。”",
    "你塞给他几个铜子，他掂了掂，揣进怀里：“你想知道什么？问吧。”",
    "“钟楼晚上会敲十三下吗？”你问。老头的脸抽了一下：“二十年了。每回有人失踪，那晚钟楼就敲十三下。”",
    "“不是钟自己敲的。”他压压着声音音，浑浊的眼睛里有一丝亮光，“二十年前，钟舌上绑了块布，把钟声闷住了——可那之后，钟还是会在半夜响。我上去看过——钟舌上的布，换了新的。有人动过。”",
    "他顿了顿：“钟不会自己响。会响，是有人在拉。”"
  ],
  options:[
    {t:"追问：谁在拉钟", effects:{flag:"acd_bell_day", timeCost:"1period"}, go:"acd_plot_clock_bell"},
    {t:"（记下钟舌绑布的事）", effects:{flag:"acd_bell_day", xp:15, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_clock_bell"] = {
  tag:"branch", place:"学院 · 钟楼 · 内部", where:"白昼", pace:"deep",
  text:[
    "老头领你从侧门进了钟楼底层。里面光线很暗，一口巨大的铜钟悬在头顶，钟舌上果然绑着一块灰布——布是新的，边缘整齐，像是刚换过。",
    "“你看这儿。”老头举起油灯，照向钟楼内壁。你看到一道几乎看不清的痕迹：一根麻绳从钟楼顶部垂下来，沿着内壁往下走，穿过一道铁环，通向二楼的方向。麻绳上缠着铜丝，铜丝末端磨得发亮——有人经常拉它。",
    "“这绳是后来加装的。”老头说，“二十年前修钟楼的人里，有个是我同乡，他跟我说，钟楼改建的时候，二楼加了一道暗门，专门用来上下运东西——绳子就是那时候装的。”",
    "“运什么东西，要半夜用绳子？”老头没接话，只是把油灯压低，照向二楼的方向。"
  ],
  options:[
    {t:"（记下麻绳+铜丝通二楼）", effects:{flag:"acd_clock_rig", xp:15, timeCost:"1period"}, go:"acd_plot_clock_floor2"},
    {t:"现在就顺着绳子爬上二楼", check:{a:"AGI", sk:"athletic", label:"攀爬"}, tier:{ok:["你攥紧麻绳，借力攀上二楼——二楼的暗门虚掩着，门后透出一股药味。"], fail:["绳子太旧，你一用力就听到纤维崩裂的声音，只好先放手。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_clock_floor2"}
  ]
};

N["acd_plot_clock_floor2"] = {
  tag:"branch", place:"学院 · 钟楼 · 二楼", where:"任意", pace:"deep",
  text:[
    "钟楼二楼的房间不大，窗户封着，透不进多少光。空气里有一股浓重的药味，混着某种说不清的甜腥。",
    "屋角摆着一张桌子，桌上放着一只石碗，碗里盛着半碗银月草粉——和药房那种罐子里的完全一样。石碗旁边压着一张纸，纸上写着字：",
    "“第三阶·周期十四日。受试者：韦恩。观察：夜间惊醒，自称闻钟声，食欲下降，体重减轻。体征：瞳孔放大，对光反应迟钝。记录人：——”",
    "名字被涂掉了，但涂痕下面像有透出两个字母的轮廓。你凑近看，像是“W·”。",
    "墙角还堆着几只空食盒——红漆的，盖子上画着一个秤形标记。你数了数，有七只。"
  ],
  options:[
    {t:"（把实验日程表记下）", effects:{flag:"acd_clock_schedule", item:"lab_record", xp:20, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"在这间房里等——等到天黑，看谁来", effects:{timeCost:"1period"}, go:"acd_plot_clock_wait2"}
  ]
};

N["acd_plot_clock_wait2"] = {
  tag:"branch", place:"学院 · 钟楼 · 二楼", where:"黑夜", pace:"deep",
  text:[
    "你躲在二楼房间的阴影里，从门缝看着楼下。夜色一点点沉下来，钟楼的影子拉得老长。",
    "子夜时分，钟楼底层传来脚步声。一个穿灰袍的人提着一只食盒走上来——他走得很慢，每一步都踩得很稳。他推开二楼的门，把食盒放在墙角，又蹲下，从怀里摸出一只小瓷瓶，把瓶里的粉末撒进食盒里。",
    "灯光照不到他的脸，但你看见他袍子下摆露出的手腕——手腕上有一道红痕，像是被什么东西勒过，又像是被抓的。",
    "他把食盒放下，压着嗓子说了一句什么。你没听清，只听到最后两个字——“……活着。”",
    "他转身下楼，脚步声渐渐远了。食盒在墙角，盖子上的秤形标记在黑暗中像一只眼睛。"
  ],
  options:[
    {t:"（记下：灰袍人 + 手腕红痕 + 食盒撒粉）", effects:{flag:"acd_warden_seen", item:"lab_record", xp:20, timeCost:"1period"}, go:"acd_plot_shadow_trail"},
    {t:"追上去看看他的脸", check:{a:"AGI", sk:"stealth", label:"跟踪"}, tier:{ok:["你跟着他出了钟楼，在小路上看清了他的侧脸——温教员。"], fail:["你跟出几步，他忽然停下回头，你赶紧闪进阴影里，没看清。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_shadow_face"}
  ]
};

N["acd_plot_shadow_trail"] = {
  tag:"branch", place:"学院 · 钟楼 · 走廊", where:"黑夜", pace:"deep",
  text:[
    "你回到钟楼底层，蹲下看地面——灰袍人刚才走过的地上，落着一线细粉，在月光下泛着的白。是银月草粉，从食盒边缘漏出来的。",
    "你沿着粉线走，它从钟楼底层延伸出去，穿过侧门，绕过食堂后墙，一直通向——药房的后门。",
    "粉线在药房后门口消失了。门缝里透出一点光。你凑近听，里面传来水声，像是有人在洗手。洗了很久。",
    "你低头看，门前的泥地上有一串脚印，新鲜的水迹——而那脚印旁边的地上，有一小片暗色的、发黑的东西。你蹲下捻了一点，是干涸的血，混着银月草粉。"
  ],
  options:[
    {t:"（把药房后门的脚印和血迹记下）", effects:{flag:"acd_shadow_trail_kept", xp:15, timeCost:"1period"}, go:"acd_plot_shadow_face"},
    {t:"现在就推门进去", check:{a:"AGI", sk:"stealth", label:"潜行"}, tier:{ok:["你推开门——药房空着，但柜台上放着一只红漆食盒，还没来得及收。"], fail:["门轴一响，里面的水声停了。你赶紧退开。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_scales_task"}
  ]
};

N["acd_plot_shadow_face"] = {
  tag:"branch", place:"学院 · 药房 · 后门", where:"黑夜", pace:"deep",
  text:[
    "你等在药房后门外的阴影里。天快亮的时候，门开了——温教员走出来，还是那件灰袍，手里提着一只空食盒。",
    "他看见你，脚步顿了一下：“这么早？”语气平淡，听不出情绪。",
    "“钟楼里那只食盒，是你放的。”你说。温教员沉默了一会儿，把食盒放在脚边：“是。”",
    "“你在里面撒了银月草粉。”温教员看着你，忽然撸起左手的袖子——手腕上那道红痕，在晨光里看得很清楚，不是勒痕，是抓痕，像是被什么尖锐的东西抓过，伤口还没结痂。",
    "“这痕迹，是钟楼地下那个东西抓的。”他说，“它快醒了。马尔科是第三个——前两个，都在‘第三阶’没撑过去。”",
    "“我放银月草粉，是让它在安睡里撑得久一点。”他盯着你，“你要是真想帮他，就别声张。一闹大，教务处会‘按惯例处理’——你知道那是什么意思。”",
    "他说完，提着食盒走了。晨光把钟楼的影子拉得很长。"
  ],
  options:[
    {t:"（记下温教员的话和手腕抓痕）", effects:{flag:"acd_warden_warned", xp:20, timeCost:"1period"}, go:"acd_plot_scales_task"},
    {t:"追问：地下的‘那个东西’是什么", effects:{timeCost:"1period"}, go:"acd_plot_mercury_past"}
  ]
};

N["acd_plot_scales_task"] = {
  tag:"branch", place:"学院 · 秤砣社 · 集会室", where:"任意", pace:"normal",
  text:[
    "秤砣社是学院里一个不大不小的社团，徽记是一只秤。你找上门时，社长正坐在集会室里擦一枚铜秤砣，擦得很慢，像在擦一件宝贝。",
    "“马尔科的事？”他放下秤砣，打量你，“学院里传开了，说你到处问。你想查，我不拦你，但有个条件——”",
    "“教务处有一份莫教授的旧卷宗，上头的人不想让它被人看见。你去把它调出来——不是偷，是调包。把这份换进去。”他推给你一个封好的牛皮纸袋。",
    "“办成了，我把秤砣社知道的事告诉你。办不成——”他掂了掂手里的铜秤砣，“你最好没来过这儿。”",
    "你捏着牛皮纸袋，纸袋很轻，里面的东西却像有分量。"
  ],
  options:[
    {t:"答应去调包", effects:{flag:"acd_scales_task", relation:{npc:"acd_scales", v:5}, xp:10, timeCost:"1period"}, go:"acd_plot_scales_archive"},
    {t:"拒绝：不替人做这种手脚", effects:{relation:{npc:"acd_scales", v:-5}, xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_scales_archive"] = {
  tag:"branch", place:"学院 · 教务处 · 档案室", where:"任意", pace:"deep",
  text:[
    "你按秤砣社说的，趁管理员午休溜进档案室。莫教授的卷宗在第三排铁柜最底层，落着灰——但奇怪的是，卷宗的封条是新的。",
    "你拆开封条，抽出里面的纸——不是卷宗，是一叠复印件。复印件边缘有手写的批注，笔迹很老：",
    "“钟楼地下的密室，教务处不是不知道。二十年前就知道。知道了，为什么不管？”",
    "“——因为管了，就盖不住了。”",
    "“莫教授发现了那间密室，所以他死了。下一个发现的人，会是谁？”",
    "你翻到最后一页，上面贴着一张纸条，纸条上的字很新，像是最近写的：“卷宗原件在秤砣社。你找的东西，在钟楼地下。”",
    "你捏着纸条，忽然明白过来：秤砣社让你来调包，不是想掩盖什么——他们想让你看见这份东西。"
  ],
  options:[
    {t:"（把复印件和批注收好）", effects:{flag:"acd_scales_copy", item:"lab_record", xp:20, timeCost:"1period"}, go:"acd_plot_scales_member"},
    {t:"把复印件放回去，只记下内容", effects:{flag:"acd_scales_copy_pos", xp:15, timeCost:"1period"}, go:"acd_plot_scales_member"}
  ]
};

N["acd_plot_scales_member"] = {
  tag:"branch", place:"学院 · 秤砣社 · 集会室", where:"任意", pace:"normal",
  text:[
    "你回到秤砣社，把牛皮纸袋和复印件摆在桌上。社长看着复印件上的批注，沉默了很久。",
    "“你看到了。”他说，“那批注，是我爹写的。他二十年前在教务处当差——莫教授死那晚，是他值的夜。”",
    "“我爹说，那晚有人从钟楼方向过来，往教务处送了一封信。第二天，莫教授的死就被定为自尽，卷宗封存。”他顿了顿，“我爹后来死了——病死的。死前他跟我说，钟楼地下的密室，别碰。”",
    "“我碰了。”他苦笑，“所以我查到了马尔科。查到了——”他压压着声音音，“十三年前那个埃尔文，七年前那个赛拉。全是炼金系二年级。全是第三阶。”",
    "他站起身，从柜子里取出一本账册，推到你面前：“这是秤砣社的账。你看看最后一页。”"
  ],
  options:[
    {t:"翻看账册最后一页", effects:{timeCost:"1period"}, go:"acd_plot_scales_ledger"},
    {t:"问他：赛拉是你什么人", effects:{flag:"acd_scales_resolve", relation:{npc:"acd_scales", v:5}, xp:10, timeCost:"1period"}, go:"acd_plot_scales_ledger"}
  ]
};

N["acd_plot_scales_ledger"] = {
  tag:"branch", place:"学院 · 秤砣社 · 集会室", where:"任意", pace:"deep",
  text:[
    "账册最后一页记着一笔支出，与社团日常的进项格格不入：",
    "“特殊项目，年度预算——三千银月。项目内容：不填。核准人：院长办公室。”",
    "“三千银月，够一个学生三年的学费加伙食。”社长说，“每年都在拨，拨了二十年。账上写的是‘特殊项目’，可整个学院没人知道这个项目是什么——除了钟楼地下。”",
    "“马尔科失踪前，从教务处偷抄过一份预算表，他给我看过——那年拨给钟楼的，是三千。”他盯着你，“一个失踪的学生，值三千银月。你说，他们是在养什么？”",
    "窗外，钟楼的影子斜斜地投进屋里。你忽然觉得那影子比白天长了很多。"
  ],
  options:[
    {t:"（记下：院长办公室核准 + 每年三千银月）", effects:{flag:"acd_scales_resolve", item:"scales_pin", xp:20, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"把铜哨交给社长，请他收下", effects:{relation:{npc:"acd_scales", v:10}, timeCost:"1period"}, go:"acd_plot_scales_follow"}
  ]
};

N["acd_plot_mercury_drawer"] = {
  tag:"branch", place:"学院 · 灵魂魔法塔 · 墨丘利办公室", where:"任意", pace:"deep",
  text:[
    "墨丘利的办公室在灵魂魔法塔顶层，桌上永远摊着一本翻旧的手抄本。你问起马尔科的事，他没有立刻回答，只是翻着手抄本，翻到某一页，停下来。",
    "“二十年前，莫教授来找我，说他发现了一个秘密，在钟楼地下。”墨丘利声音很淡，“他预言了三件事——”",
    "“第一，钟楼会每年吞掉一个炼金系的学生。第二，他们会用‘意外’和‘惯例’盖住每一桩失踪。第三——”他抬眼，“第三，除非有人把钟楼的钟敲碎，否则这个循环不会停。”",
    "“莫教授说完这三件事的第二天，死了。”墨丘利合上手抄本，“他是我的学生。我看着他死，却什么都没做——因为预言第一句，已经应验了。”",
    "“你问我要不要查？”他看着你，视线很静，“查可以。但你得想清楚——预言第三句，需要有人去敲碎那口钟。”"
  ],
  options:[
    {t:"（记下莫教授的三条预言）", effects:{flag:"acd_missing_archive", xp:20, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问墨丘利：钟楼地下到底是什么", effects:{timeCost:"1period"}, go:"acd_plot_mercury_past"}
  ]
};

N["acd_plot_mercury_past"] = {
  tag:"branch", place:"学院 · 灵魂魔法塔 · 墨丘利办公室", where:"任意", pace:"deep",
  text:[
    "墨丘利站起身，走到窗边，看着远处的钟楼：“地下是什么？二十年前，莫教授跟我说，钟楼地下有一间密室，里面养着一样东西。”",
    "“养着——‘东西’？”你问。墨丘利点头：“它靠吸食炼金系学生的生命力维持。银月草粉、血根、睡药——都是为了让它安睡。它一旦完全醒来——”他没说完。",
    "“学院为什么不处理它？”墨丘利笑了一下，笑里没有温度：“因为那间密室，是学院的第一任院长建的。建它的时候，用的是学院的经费——所以账上每年都有一笔‘特殊项目’。”",
    "“院长办公室不是不知道。他们是最清楚的人。”他转身看着你，“你知道这意味着什么吗？这意味着——查下去，你查的不是怪物，是学院自己。”",
    "他坐回椅子里，翻着手抄本，不再说话。窗外的钟楼在暮色里显得很安静，安静得让人心里发毛。"
  ],
  options:[
    {t:"（记下：密室是第一任院长建的）", effects:{flag:"acd_mercury_known", xp:20, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问墨丘利：有没有办法阻止它", effects:{timeCost:"1period"}, go:"acd_plot_lab_page2"}
  ]
};

N["acd_plot_lab_page2"] = {
  tag:"branch", place:"学院 · 炼金实验室 · 莫教授遗物", where:"任意", pace:"deep",
  text:[
    "炼金实验室的角落里锁着一只旧柜子，锁是新的——但柜子边沿的灰尘被擦掉了一小块，像是最近有人开过。你撬开锁，里面是一叠实验记录。",
    "前半本是莫教授的笔迹，记录着银月草粉的配方和实验数据。后半本换了一种笔迹，像是后来的人续写的——",
    "“受试者名录：第一批，六人。完成第三阶：一人。存活：零。”",
    "“第二批，四人。完成第三阶：二人。存活：一。”",
    "“第三批（当前），一人：韦恩。第三阶进行中。存活：——”",
    "“待续。”",
    "你在最后两页之间，摸到一张折着的纸。展开——是一份名单，上面列着二十年来所有‘特殊项目’的受试者名字，每个名字后面都画着一个小小的十字。只有最后一个名字后面没有十字：马尔科·韦恩。"
  ],
  options:[
    {t:"（把实验记录和名单收好）", effects:{flag:"acd_lab_list", item:"lab_record", xp:20, timeCost:"1period"}, go:"acd_plot_lab_second"},
    {t:"只记下内容，把记录放回柜子", effects:{flag:"acd_lab_schedule", xp:15, timeCost:"1period"}, go:"acd_plot_lab_second"}
  ]
};

N["acd_plot_lab_second"] = {
  tag:"branch", place:"学院 · 钟楼地下 · 第二间密室", where:"黑夜", pace:"deep",
  text:[
    "深夜，你带着马尔科日记里说的钥匙，从钟楼后门摸进地下。石阶一路向下，空气越来越潮，混着药味和一股说不清的甜腥。",
    "地下的第二间密室——你推开锈铁门，屋里只点着一盏油灯。墙角摆着一张铁床，床单是温的——有人刚躺过。床头放着一只陶碗，碗底残留着暗红色的粉末，混着银月草粉。",
    "你伸手摸了摸床单的褶皱，从形状看，躺过的人个子不高，很瘦。你蹲下看陶碗——碗沿有牙印，很浅，像是睡着的人无意识咬的。",
    "铁床的床头栏杆上，拴着一截断开的绳子——绳头烧焦了。你想起图书馆铁门下沿卡着的那片烧焦的灰绿布片。",
    "这间密室里，刚躺过一个人。他走了，或者——被带走了。"
  ],
  options:[
    {t:"（记下铁床、陶碗、断绳）", effects:{flag:"acd_lab_bowl", xp:20, timeCost:"1period"}, go:"acd_plot_truth_malco"},
    {t:"顺着断绳的方向追出去", check:{a:"AGI", sk:"athletic", label:"追踪"}, tier:{ok:["你沿着绳子的走向追出去，穿过一条窄道，前面透出光——还有声音。"], fail:["窄道太黑，你撞了一跤，再抬头，声音已经远了。"]}, effects:{xp:10, timeCost:"1period"}, go:"acd_plot_truth_malco"}
  ]
};

N["acd_plot_lab_helper"] = {
  tag:"branch", place:"学院 · 钟楼地下 · 密室", where:"黑夜", pace:"normal",
  text:[
    "你正要推开第三间密室的门，门却从里面开了。一个穿着旧围裙的人站在门口，手里端着一只碗——碗里是暗红色的糊状物。",
    "是药房的薇拉。她看见你，手没抖，碗也没放下：“你查到这里了。”她说，“马尔科还活着——在最里面那间。但他撑不了多久。”",
    "“这个——”她看着手里的碗，“是他要的东西。银月草粉和血根熬的，能让那个东西安静。你们都说它在吃人——可它不吃，马尔科会更早死。他体内的‘第三阶’，已经开始了。”",
    "她侧身让你进去：“你自己看。但我得提醒你——”她看着你的眼睛，“看过之后，你就回不了头了。”"
  ],
  options:[
    {t:"进去看", effects:{timeCost:"1period"}, go:"acd_plot_truth_malco"},
    {t:"问薇拉：你也参与了？", effects:{flag:"acd_lab_helper_ask", xp:10, timeCost:"1period"}, go:"acd_plot_truth_malco"}
  ]
};

N["acd_plot_truth_malco"] = {
  tag:"branch", place:"学院 · 钟楼地下 · 最里间", where:"黑夜", pace:"epic",
  text:[
    "最里间的密室比前面两间都小。铁栏后面，一个人蜷在角落里——很瘦，脸色苍白，手腕上拴着铁链。他听到脚步声，抬起头。",
    "“马尔科？”你叫他的名字。他眼睛亮了一下，又暗下去：“你……是来救我的，还是来登记的？”",
    "“登记？”你问。他扯了扯唇边，笑得很苦：“‘已按惯例处理。’你没在档案室见过这句话吗？”",
    "“我知道——他们拿我试药。钟楼地下养的那个东西，靠吸人的生命力。前两个——埃尔文、赛拉——都死在‘第三阶’。”他抬手，露出手腕上的针孔，“我是第三个。他们算准了日子，十四天一个周期。今晚就是第三阶的最后一晚。”",
    "“钥匙。”他从怀里摸出一把铜钥匙，隔着铁栏递给你，“开这道门。但——”他忽然攥紧钥匙，“你想好了吗？放了我，就等于跟整个学院作对。他们会说你是疯子，说你编造故事，然后——”他停住，声音低下去，“‘按惯例处理。’”",
    "铁栏外传来脚步声。马尔科把钥匙塞进你手里，压着嗓子说：“小心！”"
  ],
  options:[
    {t:"用钥匙开门，救他出去", effects:{flag:"acd_malco_found", item:"old_brass_key", xp:30, timeCost:"1period"}, go:"acd_plot_choice_ripple"},
    {t:"先退出去，别让人发现", effects:{flag:"acd_warden_malco", xp:20, timeCost:"1period"}, go:"acd_plot_choice_ripple"}
  ]
};

N["acd_plot_choice_ripple"] = {
  tag:"branch", place:"学院 · 钟楼 · 岔路口", where:"黑夜", pace:"deep",
  text:{
    default:[
      "钟楼的夜风灌进走廊，你站在岔路口。马尔科的钥匙还在你手里发烫，秤砣社的秤砣徽记在黑暗中像有反着光。",
      "你查到的每一条线，都指向同一个地方。现在，该你选了。"
    ],
    ifFlag:{
      "acd_malco_found":[
        "你带着马尔科从钟楼后门出来，夜风一吹，他打了个哆嗦。他抬头看着你：“你把我救出来，等于把你自己也搭进去了。”他顿了顿，“不过——谢了。”",
        "远处传来一声钟响。只响了一声。马尔科的脸色变了：“他们在拉钟了——它在醒。你要么现在走，要么……”"
      ]
    }
  },
  options:[
    {t:"去找墨丘利——他说过，除非敲碎那口钟，否则循环不会停", effects:{flag:"acd_plot_choice_mercury", timeCost:"1period"}, go:"acd_plot_mercury_follow"},
    {t:"回秤砣社——把账册和名单交出去，让他们把这事捅到明面上", effects:{flag:"acd_plot_choice_scales", timeCost:"1period"}, go:"acd_plot_scales_follow"},
    {t:"去找温教员——他说过，别声张。可马尔科还活着，这事不能就这么算了", effects:{flag:"acd_plot_choice_open", timeCost:"1period"}, go:"acd_plot_open_follow"}
  ]
};

N["acd_plot_mercury_follow"] = {
  tag:"branch", place:"学院 · 灵魂魔法塔", where:"黑夜", pace:"deep",
  text:[
    "墨丘利听完你的话，放下手里的笔，看了你很久：“你决定敲钟了。”",
    "“钟楼那口钟，是学院的根。”他站起身，从书架顶层取下一只蒙尘的匣子，打开——里面是一柄短锤，锤头包着旧布，“这锤子，是莫教授留下的。他说过，如果有一天有人走到这一步，就把这个交给他。”",
    "他把短锤递给你：“敲钟，不是把钟敲碎——是把钟舌上的布扯下来，让钟声真正响起来。钟声一响，整个学院都会听见。藏了二十年的东西，就藏不住了。”",
    "“去吧。”他说，“我老了，走不动了。但你得知道——敲响它的人，会变成学院的头号敌人。”",
    "你握着短锤，锤头的旧布上有一股淡淡的药味。那是莫教授的味道。"
  ],
  options:[
    {t:"（收下短锤，去敲钟）", effects:{item:"copper_whistle", flag:"acd_mercury_known", relation:{npc:"mercury", v:10}, xp:30, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"（先记下，从长计议）", effects:{xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_scales_follow"] = {
  tag:"branch", place:"学院 · 秤砣社 · 集会室", where:"黑夜", pace:"deep",
  text:[
    "秤砣社的灯还亮着。社长听你说完，把账册合上，又打开，反复两次：“你知道你带来的东西，够把半个学院掀翻吗？”",
    "“三千银月，二十年，一个‘特殊项目’。”他站起来，“光凭这本账，院长办公室脱不了干系。可——”他停了一下，“你证得动吗？账册可以说是我伪造的，名单可以说是你编的。教务处的封条，是新的。学院最擅长的，就是把活人变成‘已按惯例处理’。”",
    "他想了很久，从柜子里取出一枚秤砣社的徽章——一枚铜质的小天平：“明天，学院会有一场议会。我会带着账册和名单去。你去不去？”",
    "“去，就站我旁边。不去——”他把天平别在胸前，“你就当今晚没来过。”",
    "窗外的钟楼在夜色里沉默着。你看着那枚铜天平，它很小，却像有千钧重。"
  ],
  options:[
    {t:"答应明天一起去议会", effects:{flag:"acd_scales_resolve", relation:{npc:"acd_scales", v:15}, item:"scales_pin", xp:30, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"（先不答应，回宿舍想想）", effects:{xp:10, timeCost:"1period"}, go:"academy_elda_hub"}
  ]
};

N["acd_plot_open_follow"] = {
  tag:"branch", place:"学院 · 温教员办公室", where:"黑夜", pace:"deep",
  text:[
    "温教员的办公室还亮着灯。你推门进去时，他正对着墙上的一幅画——画的是钟楼，笔触很细，和塞西莉亚捡到的那张一模一样。",
    "“你来了。”他没有回头，“马尔科呢？”",
    "“我把他带出来了。”你说。温教员沉默了很久，肩膀慢慢塌下去：“好。好。”他转过身，眼圈有点红，“我替他爹娘谢谢你。”",
    "“马尔科他爹娘——”你问。温教员低下头：“都是炼金系的学生。二十年前，也死在钟楼。”他顿了顿，“我也是炼金系的学生。我也是从钟楼地下爬出来的——那一批，只活了两个。一个是我，一个是……”他没说完。",
    "“你想怎么做？”他问你，“捅出去？学院会否认。砸钟？钟楼是学院的脸面。你做什么，都会有人拦着。”",
    "“但——”他忽然笑了笑，“今晚，我陪你。你想做什么，就做。大不了，这教员我不当了。”"
  ],
  options:[
    {t:"（和温教员一起，把马尔科的证词和实验记录整理成册）", effects:{flag:"acd_warden_malco", xp:30, timeCost:"1period"}, go:"academy_elda_hub"},
    {t:"问他：当年活下来的另一个是谁", effects:{xp:10, timeCost:"1period"}, go:"acd_plot_truth_malco"}
  ]
};
