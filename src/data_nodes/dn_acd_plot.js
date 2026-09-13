/* ===== /v100inj:acd-plot/ 方向四 · 学院暗流与阴谋（纯数据；引擎零改动） =====
 * 学院暗流：失踪学生/第十三下钟声/影子学生/秤砣社（呼应 led_om_scale 天平母题）/
 * 墨丘利守望者考验/禁忌实验/钟楼密室真相。挂载：academy_elda_hub + 生活节点引线。
 * 规范：V66 白描 / 治理词约束 / 四段式 / 引号成对。 */
(function () {
  if (typeof N === "undefined") return;
  N["acd_plot_clue_board"] = {
    tag: "branch", place: "学院 · 公告栏", where: "白昼", pace: "normal",
    text: [
      "公告栏是学院的消息集散地：社团招新、寻物启事、旧书转让，贴得层层叠叠。你本来只是路过，却被角落里一张纸钉住了脚。",
      "那是一张寻人启事，撕了一半，只剩下半截：“炼金系二年级生·马尔科，三日前外出未归，知其下落者请告知教务处。”纸张边缘发黄，贴了有几天了。",
      "启事下面，不知谁用炭笔写了两行小字：“第三个了。”“别问。问了，你就是第四个。”字迹潦草，像是写完就跑。",
      "风把纸边吹得翘起来。你伸手摸了摸那两行炭笔字，指腹沾上一层黑灰。公告栏前面人来人往，没有一个人在这张启事前停留。"
    ],
    options: [
      { t: "撕下启事，收进怀里", go: "acd_plot_clue_clock", timeCost: "1period", effects: { flag: "acd_board_kept"} },
      { t: "拦住路过的学生打听", go: "acd_plot_clue_board_ask", timeCost: "1period" },
      { t: "记下名字，转身离开", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_board_seen", san: -1} }
    ]
  };

  N["acd_plot_clue_board_ask"] = {
    tag: "branch", place: "学院 · 公告栏", where: "白昼", pace: "light",
    text: [
      "你拦住一个抱着一摞书的学生，指了指那张寻人启事。他看了一眼，脸色就变了：“马尔科？他……”他压着嗓子，“他是炼金系的，上个月还好好的，突然就不来上课了。”",
      "“有人说他去了钟楼那边，有人说他退学了。教务处只说‘外出未归’，也没人再追问。”他把书抱紧了些，像在抱一件防身的东西，“劝你别管。上一个打听这事的人……”他住了嘴，“反正，现在没人见过他了。”",
      "他急匆匆走了，留下你站在公告栏前。午后的阳光照在那张泛黄的纸上，那两行炭笔字在光里格外清楚：“第三个了。”"
    ],
    options: [
      { t: "决定查下去", go: "acd_plot_clue_clock", timeCost: "1period", effects: { flag: "acd_board_kept", san: -1} },
      { t: "暂时按下，从长计议", go: "academy_elda_hub", timeCost: "1period" }
    ]
  };

  N["acd_plot_clue_clock"] = {
    tag: "branch", place: "学院 · 钟楼外", where: "黑夜", pace: "deep",
    text: [
      "子夜的学院安静得像一口井。你站在钟楼对面的回廊下，等着。",
      "钟楼是学院最老的建筑，石头缝里爬满青苔，尖顶刺破夜空。老生都说，它的钟声比学院的规矩还准——白天半点，夜里整点，从来不多一下。",
      "十二下。钟声一下一下，沉甸甸地落进夜色里，最后一下拖得很长，余音在空气里嗡嗡地转。你数着，数到十二，钟声停了。",
      "你松了口气，正要转身——钟声又响了。第十三下。",
      "这一下比前面十二下都轻，像有人按住了钟舌，只让钟身发出一声闷响。可它确实响了。你听得清清楚楚，后颈的汗毛一根根竖了起来。",
      "钟楼二楼的窗子，透出一线极淡的光，亮了一瞬，又灭了。"
    ],
    options: [
      { t: "走近钟楼看看", go: "acd_plot_truth_2", timeCost: "1period", effects: { flag: "acd_clock_heard", san: -2} },
      { t: "记下时间，退回宿舍", go: "acd_plot_clue_shadow", timeCost: "1period", effects: { flag: "acd_clock_heard", san: -1} }
    ]
  };

  N["acd_plot_clue_shadow"] = {
    tag: "branch", place: "学院 · 宿舍走廊", where: "黑夜", pace: "normal",
    text: [
      "你回到宿舍楼的时候，走廊里的灯已经灭了大半，只剩尽头一盏，昏黄地亮着。脚步声在木地板上响，每一下都有回音。",
      "拐过墙角，你看见一个人影——穿着灰袍，快步往走廊另一头走。袍角在灯光下一闪，沾着一片白花花的粉末，像是面粉，又比面粉粗，在暗处泛着一点银光。",
      "你从没见过这个人。学院里穿灰袍的不是没有，可这个人的步子太快了，快得不像在走路，倒像在逃。",
      "他走到走廊尽头，推开一扇门——那扇门白天是锁着的，你记得清楚——闪了进去，门合上了。走廊里重新安静下来，只有你的心跳。"
    ],
    options: [
      { t: "追上去", check: { a: "AGI", sk: "athletic", label: "追踪" }, tier: { ok: ["你快步追到那扇门前，推开门——里面是一间空的储藏室，落满灰尘。窗台上有一片白色的粉末，在月光下泛着银光。你捻起一点，是银月草粉。"], fail: ["你追过去，门已经关死了。你贴着门板听了一会儿，里面什么声音都没有。你只好记下这扇门的位置，回宿舍去了。"] }, go: "acd_plot_lab_record", timeCost: "1period", effects: { flag: "acd_shadow_seen", san: -2 }},
      { t: "记下这件事，回宿舍", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_shadow_seen", san: -2} },
      { t: "告诉自己：看花了眼", go: "academy_elda_hub", timeCost: "1period", effects: { san: 1} }
    ]
  };

  N["acd_plot_scales_recruit"] = {
    tag: "branch", place: "学院 · 图书馆还书处", where: "白昼", pace: "normal",
    text: [
      "你还书的时候，一本《度量衡史》里滑出一张纸条，落在地上，你弯腰捡起来。",
      "纸条对折，边缘发黄，和你白天在书堆里见过的那张一模一样的纸。展开，上面画着一杆秤，秤钩朝下，旁边一行字：“天平从不倾斜——除非有人加了砝码。”",
      "背面还有一行，字迹更小：“你带来的东西，还在吗？明日子时，旧仓库。只带那一样东西来。”",
      "你捏着纸条，忽然明白过来：这不是偶然夹错的书签。有人知道你身上藏着什么。你知道，在学院里，被人知道这件事，和被人看见深夜进钟楼，一样危险。"
    ],
    options: [
      { t: "赴约（带上你贴身的旧物）", go: "acd_plot_scales_test", timeCost: "1period" },
      { t: "把纸条烧掉", go: "academy_elda_hub", timeCost: "1period", effects: { san: -1, flag: "acd_scales_refused"} },
      { t: "收好纸条，再等等看", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_note_kept"} }
    ]
  };

  N["acd_plot_scales_test"] = {
    tag: "branch", place: "学院 · 旧仓库", where: "黑夜", pace: "deep",
    text: [
      "子时的旧仓库没有灯，月光从破了一半的屋顶漏下来，在地板上画出一块惨白的光斑。三个人站在阴影里，兜帽压得很低，看不清脸。",
      "中间那个人开口，声音很轻，却每个字都清楚：“你来了。东西，带来了吗？”",
      "你没说话，手按在怀里那件旧物上。空气像凝住了一样。",
      "“不用怕。”那人说，“我们只想知道——你带来的那件东西上，有没有一杆秤的记号？”他抬手，从衣领里扯出一枚铜别针，月光落在上面：一杆小秤，秤钩朝下。和你那件旧物上的记号，一模一样。",
      "“学院里每隔几年，就会来一个带着这种记号的人。”他放下别针，“我们都以为自己是独一个，直到发现，这记号会把人往同一个地方引。”"
    ],
    options: [
      { t: "出示你的旧物", go: "acd_plot_scales_first", timeCost: "1period", effects: { flag: "acd_scales_shown", relation: {npc: "acd_scales", delta: 10}} },
      { t: "反问：你们是谁？", check: { a: "CHA", sk: "persu", label: "试探" }, tier: { ok: ["那人沉默了一下：“秤砣社。学院里查旧案的学生——有些事，教授不做，教务处不做，我们做。”他语气里带着点自嘲，“听起来像少年人做梦，对吧。”"], fail: ["那人说：“这问题，等你先让我们信你，再问。”他语气平了，“东西拿不出来，那就走吧。”"] }, go: "acd_plot_scales_first", timeCost: "1period", effects: { flag: "acd_scales_shown", relation: { npc: "acd_scales", delta: 3 } }},
      { t: "转身离开", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_scales_refused", san: -1} }
    ]
  };

  N["acd_plot_scales_first"] = {
    tag: "branch", place: "学院 · 地下教室", where: "黑夜", pace: "deep",
    text: [
      "旧仓库的暗门通向一条石阶，往下走了两层，是一间废弃的地下教室。桌椅积着灰，墙上还挂着一块没擦干净的黑板，上面写着半道没解完的方程式。",
      "秤砣社的人不多——算上你，七个。中间那人自我介绍叫“秤砣”，说这是代号，谁也不知道谁的真名：“社团的规矩只有一条：天平从不倾斜。查案只查真相，不站队，不受贿，不替人遮掩。”",
      "他摊开一张泛黄的纸，上面是一份旧档案的抄件：“二十年前，学院有位教授，姓莫，教炼金。一个冬夜，他在钟楼自尽了。档案上这么写的。”",
      "“可我们查到，他死前一周，正在查一件事——那件事的卷宗，后来从教务处档案室消失了。和教授一起，消失了二十年。”",
      "“这几年，学院开始有人失踪。第一个，第三个，我们查了两年，线索都指向同一个地方。”他顿了顿，“钟楼。”",
      "窗外，不知哪里的钟声遥遥响了一下。黑板上的方程式，在烛光里投下一道长长的影子。"
    ],
    options: [
      { t: "答应加入秤砣社", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_scales_joined", relation: {npc: "acd_scales", delta: 15}} },
      { t: "只做线人，不正式加入", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_scales_informant", relation: {npc: "acd_scales", delta: 8}} },
      { t: "推辞，不掺和", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_scales_refused", san: -2} }
    ]
  };

  N["acd_plot_mercury_test"] = {
    tag: "branch", place: "学院 · 灵魂魔法塔顶层", where: "任意", pace: "deep",
    text: [
      "墨丘利的办公室在灵魂魔法塔顶层，窗子正对着钟楼。你敲门进去的时候，他正站在窗边，背对着你。",
      "“你身上有旧东西的味道。”他没回头，声音淡淡的，“从你进学院那天，我就闻到了。布料，金属，还有——一点旧年的尘土。”",
      "你站在原地，没动。他转过身，视线落在你胸口的位置：“我没兴趣打听你的身世。但最近，有人在打听。”",
      "他从桌上拿起一张纸条，和你见过的那张一样的纸：“秤砣社，对吧。一群学生查二十年前的旧案，勇气可嘉——但他们查的事，不是学生能碰的。”",
      "“我只要你做一件事：找到第三个失踪的学生。找到了，告诉我他在哪儿，别碰，别惊动。做得到，我告诉你这学院的钟楼底下，藏着什么。”",
      "窗外的钟楼立在暮色里，安安静静的。他看你的眼神很平，平得像一潭水，看不出深浅。"
    ],
    options: [
      { t: "接下这个任务", go: "acd_plot_lab_record", timeCost: "1period", effects: { flag: "acd_mercury_task", relation: {npc: "mercury", delta: 8}} },
      { t: "推辞：“我不替人查案。”", go: "academy_elda_hub", timeCost: "1period", effects: { relation: {npc: "mercury", delta: -5}} },
      { t: "问他：你知道钟楼底下有什么？", go: "acd_plot_mercury_test_ask", timeCost: "1period" }
    ]
  };

  N["acd_plot_mercury_test_ask"] = {
    tag: "branch", place: "学院 · 灵魂魔法塔顶层", where: "任意", pace: "normal",
    text: [
      "墨丘利听了你的问题，看了你很久。久到你觉得他要把你看穿了，他才说：“钟楼底下，有一间密室。二十年前，有人在那间密室里做实验——拿活人做的实验。”",
      "“莫教授发现了那件事。然后，他‘自尽’了。”他说最后两个字的时候，语气很轻，像在念一个笑话。",
      "“你信我吗？”他问。你还没回答，他又说，“你不必回答。去查，查到了，你就知道我说的，是真的还是假的。”",
      "他递给你一把钥匙，黄铜的，很旧：“钟楼一楼工具间，有个锁着的柜子。里面是我这些年收集的东西。需要的时候，自己拿。”",
      "钥匙在你手心里，沉甸甸的，带着一点陈年的铜锈味。"
    ],
    options: [
      { t: "收下钥匙，接下任务", go: "acd_plot_lab_record", timeCost: "1period", effects: { flag: "acd_mercury_task", item: "old_brass_key", relation: {npc: "mercury", delta: 10}} },
      { t: "收下钥匙，但不承诺", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_mercury_key", item: "old_brass_key"} }
    ]
  };

  N["acd_plot_lab_record"] = {
    tag: "branch", place: "学院 · 炼金室地下", where: "黑夜", pace: "deep",
    text: [
      "你顺着影子学生留下的银月草粉，一路找到炼金室地下一间废弃的药房。门没锁，锁孔里塞着一团布——有人来过，刚走不久。",
      "药房里一股陈年的药味，混着说不清的血腥气。桌上摊着一本实验记录，皮面发黑，页角卷着，有人反复翻过。你翻开来，字迹潦草得几乎认不出：",
      "“……第一阶成功。样本情绪稳定，无异常。但夜半总是惊醒，说钟楼里有声音叫他。”",
      "“……第二阶失败。样本开始拒绝进食，瞳孔对光无反应。按院方要求，记录封存。”",
      "“……第三阶，需要更多的血。院长已经批了。莫教授反对——他说这是拿学生当柴烧。他不懂，这一炉火，烧的是整个学院的将来。”",
      "记录到这里断了。最后一行字被人用力划掉，墨迹在纸上洇开一团，像一块干涸的疤。你翻到扉页，角落里有一个名字，被墨水涂了几遍，还是能看出轮廓——莫。"
    ],
    options: [
      { t: "带走这本记录", go: "acd_plot_truth_1", timeCost: "1period", effects: { flag: "acd_record_taken", item: "lab_record", san: -3} },
      { t: "只抄下关键几页", go: "acd_plot_truth_1", timeCost: "1period", effects: { flag: "acd_record_copied", san: -2} },
      { t: "原样放回，不动", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_record_seen", san: -3} }
    ]
  };

  N["acd_plot_truth_1"] = {
    tag: "branch", place: "学院 · 宿舍", where: "黑夜", pace: "deep",
    text: [
      "深夜，你把所有线索摊在桌上：图书馆的纸条、公告栏的启事、墨丘利的钥匙、炼金室地下那本实验记录。",
      "纸条上的秤钩、启事上的“第三个”、记录里的“需要更多的血”——三样东西，慢慢拼成一条线。失踪的学生，都去过钟楼。钟楼的第十三下钟声，是暗号。而炼金室的银月草粉，沾在一个灰袍人的袍角上。",
      "你忽然想起秤砣社说的：二十年前，莫教授在钟楼“自尽”，他死前正在查一件事，那件事的卷宗消失了。",
      "而实验记录里，莫教授反对的“那一炉火”，烧的是学生。他查到了不该查的，于是“自尽”了。如今，火又烧起来了。",
      "窗外，钟楼的黑影立在夜色里。你捏着墨丘利给的黄铜钥匙，指腹摩过钥匙齿上磨损的痕迹——这把钥匙，被人用过很多次。",
      "你吹灭灯，黑暗里，你听见自己的心跳，一下，一下，像在数着什么。"
    ],
    options: [
      { t: "去钟楼，用钥匙打开那扇门", go: "acd_plot_truth_2", timeCost: "1period" },
      { t: "先找秤砣社商量", go: "acd_plot_scales_first", timeCost: "1period" },
      { t: "把线索交给墨丘利", go: "acd_plot_payoff_mercury", timeCost: "1period" }
    ]
  };

  N["acd_plot_truth_2"] = {
    tag: "branch", place: "学院 · 钟楼地下", where: "黑夜", pace: "deep",
    text: [
      "钟楼底层的工具间里，锁着的柜子打开了。里面没有工具，只有一段向下的石阶，黑漆漆的，通向地底。",
      "你举着油灯走下去。石阶很旧，每一级都被人踩得发亮。尽头是一扇铁门，门上挂着一把大锁——锁孔的形状，和你那把黄铜钥匙严丝合缝。",
      "钥匙插进去，咔哒一声，锁开了。你推开门，一股陈年的灰尘和铁锈味扑出来。",
      "密室不大。墙上刻着一排名字，你数了数，七个。前六个下面都画着一道横线，第七个名字——“马尔科”——下面空着。",
      "墙角有一架铜天平，秤盘上落满灰。秤杆断了一截，断口很新。天平旁边的地上，有一封信，信封上没署名，只画着一杆秤。",
      "你拆开信，纸页泛黄，字迹工整：“吾友：我知我时日无多。他们让我‘自尽’，我便自尽——但真相不能随我入土。钟楼的钟，子夜会多响一下，那是我留的记号。听见者，请替我做完我未做完的事。——莫”"
    ],
    options: [
      { t: "读完信，把名字和信记下", go: "acd_plot_truth_3", timeCost: "1period", effects: { flag: "acd_professor_letter", san: -2} },
      { t: "带上断天平，原路返回", go: "acd_plot_truth_3", timeCost: "1period", effects: { flag: "acd_professor_letter", item: "broken_scale", san: -2} }
    ]
  };

  N["acd_plot_truth_3"] = {
    tag: "branch", place: "学院 · 钟楼地下", where: "黑夜", pace: "deep",
    text: [
      "你把信读完，又读了一遍。二十年前的事，终于拼全了——",
      "莫教授发现学院里有人在用学生做灵魂实验，反对无效，被人灭口，伪装成自尽。他的“遗书”被篡改，卷宗被销毁，名字从学院的史册上抹去。",
      "如今，实验重启了。失踪的学生，是新的样本。钟楼的第十三下钟声，是实验开始的暗号。马尔科——第三个失踪者——就是最新的样本。",
      "而这一切的幕后，指向一个你无法忽视的方向：学院的高层，有人和二十年前“那一炉火”有关。实验记录里那句“院长已经批了”，像一根刺，扎在你心里。",
      "油灯的火苗跳了跳。密室深处，传来一声极轻的响动——像是有人，在黑暗中呼吸。你猛地抬头，灯光照过去，墙角那架断天平后面，有什么东西，动了一下。"
    ],
    options: [
      { t: "握紧灯，走过去看看", go: "acd_plot_choice", timeCost: "1period", effects: { san: -2} },
      { t: "先退出去，从长计议", go: "acd_plot_choice", timeCost: "1period", effects: { san: -1} }
    ]
  };

  N["acd_plot_choice"] = {
    tag: "branch", place: "学院 · 钟楼", where: "黑夜", pace: "deep",
    text: [
      "你站在钟楼的阴影里，手里攥着那封信和实验记录。真相像一块烧红的铁，握在手里烫，放下来又不甘心。",
      "你知道，这件事一旦说出去，学院会像一锅被搅动的粥——失踪的学生、二十年前的旧案、实验记录里那句“院长已经批了”，每一件都能掀翻半个学院。",
      "你也知道，有些话，说给对的人听，是伸冤；说给错的人听，是送死。莫教授当年，大概也想过这个问题。",
      "风从钟楼的窗缝灌进来，吹得手里的信纸哗哗响。远处的宿舍楼亮着零星的灯，每一盏灯下，都睡着一个不知道自己可能成为“样本”的学生。",
      "你吐出一口气。这个决定，你做。"
    ],
    options: [
      { t: "把证据交给墨丘利（守望者线）", go: "acd_plot_payoff_mercury", timeCost: "1period", effects: { flag: "acd_choice_mercury"} },
      { t: "把证据交给秤砣社（社团线）", go: "acd_plot_payoff_scales", timeCost: "1period", effects: { flag: "acd_choice_scales"} },
      { t: "直接捅到院长面前（公开线）", go: "acd_plot_payoff_open", timeCost: "1period", effects: { flag: "acd_choice_open"} }
    ]
  };

  N["acd_plot_payoff_mercury"] = {
    tag: "ending", place: "学院 · 灵魂魔法塔顶层", where: "任意", pace: "deep",
    text: [
      "墨丘利接过那封信和实验记录，一页一页看完。他看得很慢，看完最后一页，他合上记录，放在桌上，沉默了很久。",
      "“二十年了。”他说，声音第一次没有了那种轻飘飘的从容，“莫教授写这封信的时候，我还在学院里教书。他是我朋友。”",
      "他起身，走到窗边，背对着你：“你做的这件事，我会记住。学院不会公开表彰你——但守望者会记住你。”",
      "他转过身，从抽屉里拿出一枚铜哨，递给你：“哨子。吹响它，学院里会有人来帮你——三次。三次之后，你是你，我们是我们。”",
      "你接过哨子，铜的，凉丝丝的，上面刻着一杆小秤。和秤砣社的别针、和你旧物上的记号，是一样的秤。",
      "“还有，”他最后说，“钟楼那间密室，我会处理。马尔科……”他顿了顿，“我会找到他。活要见人。”",
      "窗外，钟楼的尖顶在晨光里镀上一层金边。天快亮了。"
    ],
    options: [
      { t: "收好哨子，离开", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_mercury_done", item: "copper_whistle", relation: {npc: "mercury", delta: 20}, xp: 30, san: 5} }
    ]
  };

  N["acd_plot_payoff_scales"] = {
    tag: "ending", place: "学院 · 地下教室", where: "黑夜", pace: "deep",
    text: [
      "秤砣社的人传阅着那封信和实验记录，地下教室里安静得能听见烛花爆裂的声音。",
      "秤砣把信放在桌上，手指在纸上按了很久：“二十年。我们查了两年，只查到钟楼两个字。你一个人，查到了这封信。”",
      "他抬起头看你，兜帽下那双眼睛第一次没有藏起来：“秤砣社的规矩，天平从不倾斜。可这一次，天平的一端，压上了你。”",
      "他从怀里取出一枚铜天平别针，和领口那枚一样：“收下。以后秤砣社的门，为你开着——不是线人，是兄弟。”",
      "你接过别针，针尖在他拇指上扎了一下，他没缩手，反而笑了：“扎一下好。记住了——有些事，流血才记得住。”",
      "走出地下教室的时候，天已经蒙蒙亮。你摸着胸前的别针，想起莫教授信里那句“替我做完我未做完的事”。这件事，还远没有做完。"
    ],
    options: [
      { t: "收下别针，加入他们的路", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_scales_done", item: "scales_pin", relation: {npc: "acd_scales", delta: 25}, xp: 30, san: 4} }
    ]
  };

  N["acd_plot_payoff_open"] = {
    tag: "ending", place: "学院 · 院长办公室", where: "白昼", pace: "deep",
    text: [
      "你把信和实验记录放在院长桌上。院长是位头发花白的老人，他戴上眼镜，一页一页看完，摘了眼镜，擦了擦，又戴上，又看了一遍。",
      "“这封信，”他开口，声音有点哑，“二十年了。我当年接任的时候，教务处说莫教授是自尽。我信了。”",
      "他站起来，走到窗前，站了很久：“你出去以后，就当没来过。这件事，学院会查——但不会很快，不会声张。”他转过身，眼神里有你读不懂的东西，“有些账，不能一次算清。算急了，会连累不该连累的人。”",
      "你离开办公室的时候，门在你身后合上了。走廊里很安静，你听见自己的脚步声，一下一下，在空荡荡的走廊里回响。",
      "你知道，这件事没有结束——它只是从明处，转到了暗处。而暗处，从来都是另一场较量的开始。"
    ],
    options: [
      { t: "离开学院，让时间给出答案", go: "academy_elda_hub", timeCost: "1period", effects: { flag: "acd_open_done", rep: 15, san: 3, xp: 20} }
    ]
  };
})();
