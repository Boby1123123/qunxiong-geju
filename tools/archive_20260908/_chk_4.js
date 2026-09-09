
/* ================================================================
   机制卷 MECH_JS —— 霜脊堡成熟机制 · 艾尔达大陆移植
   依赖：ENGINE_JS（S / N / applyEffects / effTarget / advanceDays
        / choose / writeNext / renderTop / renderStats / showEnding）
   ================================================================ */

/* ---------- 一、大陆活的世界：势力指标 / NPC 行动 / 里程碑 ---------- */
const WORLD_LIVE = {
  church:{cn:"教会净化令",start:6,rate:1,
    events:{30:"各地教堂开始盘查往来旅人的信仰凭证。异端审判庭的影子，第一次出现在大路上。",
            60:"异端审判庭的车队驶进圣城外的集镇。火刑柱的焦味，压在所有人心头。",
            90:"教会军封锁了圣城周边道路。任何质疑教义的声音，都被当作异端。",
            100:"净化令已近疯狂——审判庭开始焚烧『有罪』的图书馆与药铺。"}},
  silver:{cn:"银月商路",start:8,rate:1,
    events:{30:"银月商会的分号，已经开到第三座城。银穗商路上的旗子，比公国的还多。",
            60:"银月商会在南方推行『商会税』，商人们敢怒不敢言。",
            90:"南方城邦联盟的经济命脉，攥在了商会手里。",
            100:"银月商会的手，伸向了北境的铁与精灵的晶。"}},
  abyss:{cn:"深渊侵蚀",start:2,rate:1,
    events:{25:"夜里，有人在城外的荒野看见发光的裂缝。",
            50:"暗蚀会的影子，开始在各城的地下活动。失踪的人，比往年多了三成。",
            75:"深渊的低语从封印之地传出，连圣城的钟声都压不住。",
            90:"封印松动，异象频现——黑色的雨，无头的影。",
            100:"深渊之门裂开了一道缝。风从缝里灌出来，带着腐肉与盐的气息。"}},
  east:{cn:"东部军情",start:10,rate:2,
    events:{40:"东境边防军加征了一轮税，矛头对准草原。",
            70:"兽人部族的集结令传遍草原，铁蹄声隐约可闻。",
            90:"兽人南下的狼烟，已经在东境升起。",
            100:"东境告急。东部王国的信使，昼夜不停地向西狂奔。"}}
};
const NPC_ACTS = [
  {n:"普路托斯·美第奇",every:9,lines:["据说美第奇家的那位继承人在南方城邦露面了，身后跟着一整队佣兵。",
    "有人看见普路托斯在灰港的赌场里一掷千金，输赢都是笑脸。",
    "美第奇家族的船队，昨夜停进了银月商会的码头。两家在谈什么，没人知道。"]},
  {n:"伊芙琳·卡斯蒂利亚",every:8,lines:["北境公国联盟的铁匠铺子，最近挂出了卡斯蒂利亚家族的徽记。",
    "伊芙琳·卡斯蒂利亚在铁门关设宴，请了南北两边的商人。席间谈了什么，宴罢便没人记得。",
    "一支打着卡斯蒂利亚旗号的车队，往矮人王国去了，车上压着成箱的铁锭。"]},
  {n:"霍根·铁炉",every:10,lines:["自由城邦的冒险者公会说，霍根·铁炉最近不收学徒了。有人看见他半夜在炉前独自打铁。",
    "霍根打了一柄没有开刃的剑，挂在公会墙上。没人知道那是什么意思。"]},
  {n:"墨丘利",every:7,lines:["墨丘利的新悬赏贴满了南方各城的布告栏，赏金比上一次翻了一番。",
    "有人看见墨丘利在酒馆里把一枚铜币抛起来，接住，又抛起来——整整一晚，没有落地。"]},
  {n:"费尔南多",every:11,lines:["南方城邦联盟的元老院又吵了一夜。费尔南多主持的会议，散场时没有一个人满意。",
    "费尔南多的马车深夜出入银月商会总号，帘子拉得严严实实。"]},
  {n:"卡珊德拉·圣光",every:12,lines:["圣城的钟声敲了十三下。卡珊德拉主持的弥撒，到场的信徒比上月少了三成。",
    "异端审判庭的名单上，据说多了一个谁都想不到的名字。卡珊德拉压下了那道命令。"]},
  {n:"奥雷利安·霜语",every:13,lines:["精灵王国的边境林道上，有人见过一队灰袍的精灵巡林者，为首者腰间悬着一柄霜色长剑。",
    "奥雷利安拒绝了银月商会进入精灵内境的提议。消息传出来时，商会的船已经停在港口。"]},
  {n:"洛·霜歌",every:9,lines:["北境的酒馆里，有人在打听一个背着双刀的女剑客——洛·霜歌。她最近在铁门关一带出没。",
    "霜歌在废矿里救了一支迷路的商队。她说她只是顺路。"]}
];
const MILESTONES = {
  free:{15:"集市城的老人们开始对你点头致意。",30:"冒险者公会长老记住了你的名字。",50:"你走在集市城，有人主动请你喝酒。"},
  north:{15:"北境公国的哨兵认出了你，省去了盘查。",30:"铁门关的守将请你喝了一碗热酒。",50:"北境人把你当作自己人。"},
  south:{15:"南方城邦的商人们愿意跟你谈生意。",30:"费尔南多提过你一次，有人记下了。",50:"银月商会的分号，请你走贵宾通道。"},
  church:{15:"圣城的修士向你行礼。",30:"教堂的司祭愿意听你说话。",50:"你在圣城，有自己的长明灯。"},
  elf:{15:"精灵巡林者向你颔首。",30:"精灵王国的边境，向你开放了三条林道。",50:"奥雷利安记得你的名字。"},
  dwarf:{15:"矮人铁匠愿意让你碰他们的炉子。",30:"矮人王国的矿道，向你敞开。",50:"矮人长老用你的名字给一柄新锤命名。"},
  orc:{15:"草原上的部族不再向你扔石子。",30:"兽人勇士愿意与你掰腕子。",50:"草原各部，称你为『可信的远客』。"},
  east:{15:"东部王国的税吏对你客气了几分。",30:"东境边防军放你过了三道关卡。",50:"东部王国请你列席军议。"}
};

/* ---------- 二、大陆文物图鉴（收集 + 提示 + 集齐奖励） ---------- */
const ITEM_GALLERY = {
  "精铁块":{ic:"🪨",area:"自由城邦 · 公会铁匠铺",how:"修好霍根的锻锤，或锻造时获得",desc:"一块千锤百炼的精铁，带着炉火的余温。握在手里，沉甸甸的。"},
  "干粮包":{ic:"🥖",area:"各地市集",how:"采买补给或商队馈赠",desc:"粗面烤成的干粮，硬得能敲核桃。行路之人，靠它续命。"},
  "旧商队账册":{ic:"📜",area:"南方城邦 · 银月商路",how:"调查银月商会或商路危机",desc:"一笔一笔记着货物的流向与利润。最后一页被撕去了，只剩渗血的指印。"},
  "净化令文书":{ic:"📜",area:"光明教会辖区",how:"深入教会线调查",desc:"盖着圣痕司火漆的教令，措辞庄严，字里行间却透着焦味。"},
  "深渊封印石":{ic:"🔮",area:"死亡沙漠 · 深渊神殿",how:"参与封印或调查深渊",desc:"漆黑如墨的石头，表面刻着早已失传的符文。靠近它，耳边有极轻的低语。"},
  "黄林晶":{ic:"💎",area:"矮人王国 · 深层矿脉",how:"采矿或矮人线获得",desc:"传说中黄林时代的遗物，通体澄黄，在暗处自行发光。矮人说它『记着旧世界的话』。"},
  "暗蚀会文书":{ic:"🕯",area:"各城地下",how:"调查暗蚀会线索",desc:"字迹工整，落款只有一个倒悬的钟。信里称『门』为『母亲』。"},
  "精灵林间晶露":{ic:"🧪",area:"精灵王国 · 林间",how:"精灵线或晶露采集",desc:"精灵收集百年的晨露，封在薄薄的晶瓶里。据说喝下它能看见森林的记忆。"},
  "兽人部族令":{ic:"🗡",area:"兽人草原",how:"草原线调查",desc:"刻着部族图腾的骨令。草原上的规矩：持令者，可借一路的营火。"},
  "铁门关军报":{ic:"🛡",area:"北境 · 铁门关",how:"打听铁门关战事或军情线",desc:"战报上写着『无战事』，页角的墨迹却是新的。有人不想让战事被人知道。"},
  "银月商会券":{ic:"🏛",area:"南方城邦",how:"银月商会线",desc:"一张轻飘飘的纸券，能换十枚金龙。它背后撬动的，是整条商路的流向。"},
  "圣城长明灯芯":{ic:"🕊",area:"光明教会 · 圣城",how:"教会线深入",desc:"一段烧了三百年的灯芯。圣城的修士说，灯不灭，则城不陷。"},
  "废矿深处的护符":{ic:"🔑",area:"北境废矿",how:"探索废矿",desc:"锈迹斑斑的铁护符，刻着一个几乎磨平的名字。它替某个矿工挡过一刀。"},
  "黑曜石刀片":{ic:"🪓",area:"死亡沙漠",how:"沙漠线或矿石",desc:"沙漠深处的黑曜石，被打磨成刀刃。锋利得能划开月光。"},
  "火晶尘":{ic:"✨",area:"元素学院 · 风炉间",how:"上完元素课清扫炉膛，或市场杂货",desc:"火晶磨成的细尘，捏在指间会发热，像攥着一小撮没烧完的夏天。"},
  "旧纸人":{ic:"📄",area:"学院杂物间 · 旧物柜",how:"清理旧柜或向咒法课前辈讨要",desc:"一张画了又擦、擦了又画的纸人，腿脚处补了三次。"},
  "静默墨":{ic:"🖋",area:"图书馆 · 抄本室",how:"帮抄写员校对旧卷，或换取",desc:"一种干了之后仍会渗墨的墨水。蘸它写字，笔尖不响。"},
  "骨灰":{ic:"🕯",area:"后山坟场 · 老槐树下",how:"清明时节坟场扫墓，或守望者处求得",desc:"一撮灰白的细灰，装在小陶罐里。倒出来，风都绕开它走。"},
  "旧钟绳":{ic:"🔔",area:"学院钟楼 · 顶层",how:"替守钟人换钟绳时讨来一截",desc:"摩挲得发亮的麻绳，断口处缠着褪色的红布。"},
  "烛泪":{ic:"🕯",area:"教堂 · 烛台",how:"清晨收烛台时刮下的",desc:"白蜡凝成的泪珠，指尖一捏就碎，带着一丝烧过的焦甜。"},
  "契约纸":{ic:"📜",area:"城西 · 文书铺",how:"向文书匠买一页或替人写契时留一张",desc:"裁得方方正正的羊皮纸，边角压着一道火漆印。"},
  "银液":{ic:"🧪",area:"术士工坊 · 蒸馏台",how:"自己蒸馏，或向炼金同业会购得",desc:"一种倒不完的银色液体，瓶口永远悬着一滴，不落。"},
  "黄铜齿轮":{ic:"⚙️",area:"东境工坊 · 废料箱",how:"在机修铺做工，或旧机械上拆下",desc:"齿缝里嵌着黑油的小齿轮，转起来咔咔响，像在数着什么。"},
  "兽血":{ic:"🩸",area:"猎场 · 屠宰棚",how:"狩猎后向猎户讨一小瓶",desc:"装在小皮囊里的暗红液体，隔着一层皮，还是温的。"},
  "狂兽之牙":{ic:"🦷",area:"兽人草原 · 猎场",how:"击败狂兽，或草原集市以物易物",desc:"根部还带着干涸血痕的獠牙，握在手里，沉得不像牙。"},
  "旧剑刃":{ic:"🗡",area:"武库 · 报废架",how:"替武库清点报废武器时留下",desc:"断了半截的旧剑刃，锈迹斑斑，但刃口还留着一点寒光。"},
  "铁钉":{ic:"🔩",area:"铁匠铺 · 废渣堆",how:"帮铁匠打下手，或从旧盾上拔下",desc:"一枚弯了又直、直了又弯的铁钉，钉帽上有一道旧捶痕。"},
  "旧军旗":{ic:"🚩",area:"学院军需库",how:"替军需官整理旧物资时收下",desc:"褪成灰白的军旗，边角烧了一个洞，洞沿是焦的。"},
  "圣水":{ic:"💧",area:"教堂 · 圣坛",how:"清晨做弥撒前取一小瓶",desc:"盛在铜瓶里的清水，隔着瓶壁，凉得透心。"},
  "驿道图":{ic:"🗺",area:"驿站 · 旧图柜",how:"向驿丞讨要废弃的旧图",desc:"一张标满岔路的旧驿道图，墨线被雨水洇过，像蛛网。"},
  "兽骨":{ic:"🦴",area:"猎场边缘 · 溪谷",how:"沿溪谷拾取，或兽群营地",desc:"一节被溪水冲得光洁的兽骨，风一吹，发出哨子般的响声。"},
  "夜枭羽":{ic:"🪶",area:"钟楼顶 · 夜",how:"夜半在钟楼顶守候，或向驯鸟人讨要",desc:"一根漆黑的枭羽，边缘泛着暗紫的光，摸着像缎子。"},
  "旧铜锁":{ic:"🔒",area:"城西 · 杂货摊",how:"旧货摊上花几枚铜币，或替人开锁时留下",desc:"锁芯磨得发亮的旧铜锁，钥匙早丢了，锁舌还倔强地咬着。"},
  "无面蜡":{ic:"🕯",area:"澡堂 · 更衣间",how:"向面具匠讨要刮下的蜡，或梳妆台角落",desc:"一小团没有颜色的蜡，捏着能塑成任何形状，就是捏不成一张脸。"},
  "药草":{ic:"🌿",area:"学院后山 · 向阳坡",how:"课后采药，或向医师领一束",desc:"一束晾干的药草，叶背泛白，揉碎了有股醒脑的苦。"},
  "圣徽":{ic:"☀",area:"教堂 · 圣物柜",how:"替教会整理圣物时请得",desc:"一枚磨得发亮的铜圣徽，正面刻着太阳，背面刻着一行小字。"},
  "苦修石":{ic:"🪨",area:"教堂后园 · 苦修室",how:"河滩上拣一块顺手的，或向老修士讨",desc:"一块被跪了多年的灰石头，表面光滑得像被眼泪洗过。"},
  "拍卖槌":{ic:"🔨",area:"学院礼堂 · 拍卖台",how:"替拍卖会收场时留下，或向主持借",desc:"一柄小木槌，槌头磕出了毛边，敲在桌上，声音又脆又闷。"},
    "禁运货单":{ic:"📦",area:"码头 · 旧货舱",how:"替船夫搬货时夹带出来",desc:"一张油渍斑斑的货单，货名被划了三道，底下写着另一种货名。"},
  "缚魂丝":{ic:"🕸",area:"暗蚀会据点 · 密室",how:"暗蚀会线深入，或废弃祭坛拾取",desc:"一根暗紫色的丝线，捏着像捏着一缕凉。传闻它拴过某人的魂，那人至今还在梦里喊疼。"},
  "亵渎铁":{ic:"⚫",area:"废矿 · 被污染矿层",how:"深挖被深渊浸透的矿脉",desc:"一块本该是铁、却黑得发蓝的疙瘩。贴着手心，冰得不像铁。"},
  "血魔之血":{ic:"🩸",area:"地下祭坛 · 石槽",how:"深夜祭坛残留，或堕落者遗物",desc:"比兽血更浓的黑红色液体，装在陶瓶里，瓶壁却结着一层霜。"},
  "腐化獠牙":{ic:"🦷",area:"猎场深处 · 枯木",how:"深渊侵蚀过的野兽遗骸",desc:"一颗根部发黑的獠牙，牙尖有一道极细的裂缝，像有什么东西从里面钻出来过。"},
  "影丝":{ic:"🌑",area:"钟楼影子 · 无月夜",how:"无月夜在钟楼顶收取",desc:"一缕不像光的丝，白天看不见，夜里才从影子边沿垂下。"},
  "倒悬钟印":{ic:"⏳",area:"暗蚀会文书 · 火漆",how:"从暗蚀会文书的落款处揭下",desc:"一枚倒着敲的钟印，火漆是黑的，边缘卷起，像被烤过。"},
  "黑币":{ic:"🪙",area:"地下市场 · 黑市主",how:"黑市交易，或暗蚀会赏金",desc:"一枚不该流通的硬币，正面没有王冠，只有一圈光秃秃的齿。"},
};
const GALLERY_BONUS = {need:10,bonus:{INT:2,desc:"图鉴集齐十件：大陆的脉络在你眼中清晰起来。"}};

/* ---------- 三、词缀 / 锻造 / 采矿 ---------- */
const AFFIX = {
  frost:{cn:"寒霜之息",fam:"冰霜",desc:"持有者灵台清明，法术愈发冷冽。",bonus:{INT:2}},
  hawk:{cn:"鹰目",fam:"冰霜",desc:"目光如隼，纤毫毕现。",bonus:{INT:1,AGI:1}},
  arcane:{cn:"奥术刻印",fam:"奥术",desc:"知识的纹路在器物上流转。",bonus:{SPR:2}},
  abyss:{cn:"深渊低语",fam:"奥术",desc:"强大的代价——它一直在说话。",bonus:{SPR:3},risk:true},
  holy:{cn:"圣辉祝福",fam:"圣辉",desc:"温暖的光，从不拒绝任何祈求。",bonus:{CHA:2}},
  sun:{cn:"晨光",fam:"圣辉",desc:"清晨第一缕光的余温。",bonus:{SPR:1,CHA:1}},
  coin:{cn:"商契徽记",fam:"商贸",desc:"契约在身，言出必践。",bonus:{CHA:2,INT:1}},
  moon:{cn:"银月徽记",fam:"商贸",desc:"在夜里，它比星子更亮。",bonus:{CHA:1,INT:2}},
  vein:{cn:"锻脉刚印",fam:"锻脉",desc:"铁与火的意志。",bonus:{STR:2,CON:1}},
  stone:{cn:"磐石",fam:"锻脉",desc:"不动如山。",bonus:{CON:2}}
};
const FORGE_RECIPES = [
  {cn:"淬火利剑",slot:"weapon",cost:{gold:20},mats:{精铁块:1,铁矿石:1},desc:"一柄普通的剑，等待它的词缀。"},
  {cn:"符文法杖",slot:"weapon",cost:{gold:25},mats:{灵木:1,晶露:1},desc:"刻槽的法杖，等待铭刻。"},
  {cn:"嵌晶护符",slot:"charm",cost:{gold:15},mats:{黄林晶碎片:1},desc:"嵌着碎晶的护符。"},
  {cn:"兽皮甲",slot:"armor",cost:{gold:15},mats:{兽皮:1,铁矿石:1},desc:"硝过的硬皮甲。"}
];
const MINE_SPOTS = {
  north:{cn:"北境废矿",ore:["铁矿石","银矿石"],desc:"废弃的矿道深处，仍有矿脉在暗中发亮。"},
  dwarf:{cn:"矮人矿脉",ore:["精铁矿","黄林晶碎片"],desc:"矮人的矿道又深又窄，风里有铁与硫磺的气味。"},
  desert:{cn:"死亡沙海盐矿",ore:["盐晶","黑曜石"],desc:"盐矿的边缘，露出黑曜石的棱角。"},
  elf:{cn:"精灵林间晶露",ore:["晶露","灵木"],desc:"精灵的林地从不允许外人采掘——除非他们欠你人情。"},
  east:{cn:"东部矿场",ore:["铁矿石","铜矿石"],desc:"东部王国的大矿场，日夜不停。"}
};
const FORGE_NAMES = ["铁匠铺","煅造坊","熔炉间"];

/* ---------- 四、夜间随机事件池（去重轮换） ---------- */
const PATROL_POOL = [
  {cn:"夜盗摸包",chk:{a:"AGI",sk:"stealth",label:"夜巡"},ok:{txt:"暗巷里一只手伸向你的钱袋。你反手扣住他的腕子，他疼得龇牙。你搜出他的赃物，又放他走了——三教九流，都有用处。",eff:{gold:15,rep:1}},fail:{txt:"你的钱袋被人摸走了。你追了两条街，只看见一截消失在夜色里的衣角。",eff:{gold:-15}}},
  {cn:"可疑的灯",chk:{a:"SPR",sk:"detect",label:"探查"},ok:{txt:"一扇窗里透出惨绿的灯光。你贴着墙根靠近——窗台上摆着一盏雕着倒悬钟的油灯。你记住了这户人家。",eff:{xp:25,flag:"abyss_hint"}},fail:{txt:"那盏灯在你走近时灭了。你敲了门，没人应。你总觉得背后有人看着你。",eff:{san:-4}}},
  {cn:"醉汉的呓语",chk:{a:"CHA",sk:"persu",label:"套话"},ok:{txt:"酒馆后门的醉汉拽着你说胡话——『银月…他们要换掉…码头的秤…』他睡过去了，话却留了下来。",eff:{rep:1,flag:"silver_hint"}},fail:{txt:"醉汉吐了你一身，什么有用的都没说。你骂了一句，回去换衣裳。",eff:{hp:-2}}},
  {cn:"巡逻队的盘查",chk:{a:"CHA",sk:"persu",label:"应付"},ok:{txt:"巡兵拦下你，你三言两语糊弄过去。他摆摆手放行，还提醒你夜里少走暗巷。",eff:{}},fail:{txt:"巡兵看你不像好人，搜了你的身，扣了你几个铜子才放行。你记下了这口气。",eff:{gold:-5,rep:-1}}},
  {cn:"废墟里的响动",chk:{a:"STR",sk:"martial",label:"戒备"},ok:{txt:"废墟深处传来窸窣声。你握紧武器缓步靠近——一只野狗叼着半截腊肉，看见你，扭头跑了。你笑了笑，把绷紧的肩松下来。",eff:{xp:12}},fail:{txt:"野狗群扑了上来。你边打边退，衣摆被撕去一截，胳膊上添了几道抓痕。",eff:{hp:-8}}},
  {cn:"夜市的余温",chk:{a:"INT",sk:"bargain",label:"捡漏"},ok:{txt:"收摊的夜市还亮着几盏灯。你用几枚铜子，从急着回家的摊主手里淘到一件小东西。",eff:{item:"旧商队账册"}},fail:{txt:"夜市早收摊了。你只捡到半块馕，硬得像石头。",eff:{}}},
  {cn:"桥下的影子",chk:{a:"SPR",sk:"soul",label:"感知"},ok:{txt:"桥下的水面没有倒影——或者说，倒影里多了一个不该有的轮廓。你移开视线，快步走过。有些东西，看见了就要假装没看见。",eff:{san:-5,xp:20}},fail:{txt:"你盯着水面看了太久。那个轮廓朝你转过了头。你跑回客栈，被子蒙头，一夜没睡。",eff:{san:-10,hp:-4}}}
];
const PATROL_FAIL_BONUS = {san:-2,txt:"大失败：你撞上了最不该撞上的东西——一张戴着钟形吊坠的脸。他看了你一眼，转身走进黑暗。你逃回住处，把那一眼的寒意，烙进了梦里。"};

/* ---------- 五、后日谈信笺（结局动画后的来信） ---------- */
const LETTERS = {
  seal:"『守望者：\\n门关上后，沙漠又安静了。商队重新走起南线，牧人夜里敢点灯了。\\n有人问起那个在神殿前站了一夜的人是谁。\\n没有人回答。但所有在清晨醒来的人，都欠你一声谢。\\n\\n—— 一个被你的背影挡住灾难的旅人』",
  legend:"『致大陆新晋的传奇：\\n你的名字，已经印进各城的酒馆故事。吟游诗人唱你时，总要多加一段——\\n他们说，你在最黑暗的那一夜，没有低头。\\n\\n—— 一个听过你传说的赶路人』",
  myth:"『神座之上的人：\\n凡人抬头看你时，眼里有光，也有畏惧。\\n你踏上那条路时，可曾想过——\\n神位之下，是万丈深渊；神位之上，是永夜孤寂。\\n\\n—— 一个还在人间行走的老友』",
  merchant:"『亲爱的朋友：\\n商路又通了。银月商会的人提到你时，语气恭敬得不像话。\\n你在灰港码头留下的那笔账，我替你记着——\\n利滚利，够你在任意一座城，买下一整条街。\\n\\n—— 你的合伙人』",
  returned:"『风尘仆仆的你：\\n你说过，要亲眼看看这片大陆的真相。\\n你看完了。\\n现在你回来了，带着满身的沙与尘，和一双什么都藏不住的眼睛。\\n\\n—— 替你留灯的人』",
  hero:"『守护者：\\n那场灾祸之后，镇子上的孩子学会了唱你的名字。\\n你离开的那天，老人往你口袋里塞了一把炒豆子，说：\\n『路远，带着。』\\n\\n—— 你救过的所有人』",
  wanderer:"『自由的风：\\n没有名字也不要紧。\\n大陆这么大，每一条路都通向下一段故事。\\n你还在走，这就够了。\\n\\n—— 一个在下一个路口等你的陌生人』",
  fell:"『……\\n这封信没有署名。\\n如果你还能读到它，说明你终于站在了那扇门里。\\n回头看看——\\n你丢下的那些名字，还在人间。\\n\\n—— 你曾经的自己』",
  madness:"『记不得名字的你：\\n醒来时，你在城外的荒地里。身上没有伤，口袋里有七枚铁牌。\\n人们说你是从沙漠那边回来的。\\n你点了点头。\\n你不知道自己在点头。\\n\\n—— 一个路过的医者』"
};

/* ---------- 六、状态初始化 ---------- */
function mechInit(s){
  if(!s) return;
  if(!s.world) s.world = {};
  if(s.world.live===undefined) s.world.live = {church:6, silver:8, abyss:2, east:10};
  if(s.world.liveHit===undefined) s.world.liveHit = {};
  if(s.world.hour===undefined) s.world.hour = 8;
  if(s.world.actions===undefined) s.world.actions = 4;
  if(s.world.actionsMax===undefined) s.world.actionsMax = 4;
  if(s.world.gallery===undefined) s.world.gallery = {};
  if(s.world.worldLogs===undefined) s.world.worldLogs = [];
  if(s.world.patrolSeen===undefined) s.world.patrolSeen = [];
  if(s.world.boardDone===undefined) s.world.boardDone = {};
  if(s.world.npcLog===undefined) s.world.npcLog = [];
  if(s.world.stealthOn===undefined) s.world.stealthOn = false;
  if(s.world.ngBless===undefined) s.world.ngBless = 0;
  if(s.equip===undefined) s.equip = {weapon:null,armor:null,charm:null};
  if(s.equipAffix===undefined) s.equipAffix = {weapon:null,armor:null,charm:null};
  if(s.affixRolls===undefined) s.affixRolls = {};
  if(s.notoriety===undefined) s.notoriety = 0;
  if(s.injuries===undefined) s.injuries = {};
  // 多周目传承：图鉴与词缀跨周目保留
  const lg = legacyLoad();
  if(lg.gallery){
    for(const k in lg.gallery){ if(!s.world.gallery[k]) s.world.gallery[k]=lg.gallery[k]; }
  }
  if(s.world.ngBless<=0 && lg.endCount){ s.world.ngBless = Math.min(5, lg.endCount); }
}
function ensureMechInit(){ if(S && S.world && S.world.live===undefined){ mechInit(S); } }

/* ---------- 七、昼夜 / 时辰 ---------- */
const SHICHEN = [["子时","🌙"],["丑时","🌙"],["寅时","🌙"],["卯时","🌅"],["辰时","☀"],["巳时","☀"],["午时","☀"],["未时","☀"],["申时","☀"],["酉时","🌇"],["戌时","🌆"],["亥时","🌙"]];
function isNightH(h){ return (h>=19 || h<6); }
function shichenName(h){ const s=SHICHEN[((h%12)+12)%12]; return s?s[0]:"子时"; }
function clockHtml(){
  const h = (S&&S.world)?(S.world.hour||8):8;
  const night = isNightH(h);
  return "<span id='tb-clock' class='stat'>时钟 <span class='dot "+(night?"night":"day")+"'></span><b>"+shichenName(h)+"</b></span>";
}
function hourLine(h){
  const hh = h%24;
  if(hh>=19||hh<6) return "夜色正浓，星子低垂。";
  if(hh>=6&&hh<9) return "晨光初透，街巷渐醒。";
  if(hh>=9&&hh<15) return "日头正高，行人匆匆。";
  if(hh>=15&&hh<19) return "暮色渐起，灯火次第亮起。";
  return "";
}

/* ---------- 八、行动系统 ---------- */
function actCost(acts){ return acts; }
function actsLeft(){ return (S&&S.world)?(S.world.actions||0):0; }
function actsMax(){ return (S&&S.world)?(S.world.actionsMax||4):4; }
function spendAct(n){
  if(!S||!S.world) return false;
  if((S.world.actions||0) < n) return false;
  S.world.actions -= n;
  return true;
}
function mechClockAdvance(hours){
  if(!S||!S.world) return;
  S.world.hour = ((S.world.hour||8) + hours) % 24;
}
function openActs(){
  const acts = actsLeft(), maxA = actsMax();
  const night = isNightH((S&&S.world)?(S.world.hour||8):8);
  const region = S.region||"free";
  const mine = MINE_SPOTS[region];
  let h = "<div style='padding:4px 2px'>";
  h += "<div style='margin-bottom:8px;color:var(--gold2)'><b>行动</b> · 今日余 <b>"+acts+"/"+maxA+"</b> 点 · "+shichenName((S.world?S.world.hour:8))+"</div>";
  h += "<div class='v44-act-group'><div class='v44-act-title'>✦ 探索</div><div class='mech-row'>";
  h += "<button class='btn act' data-a='explore'>探索城区（1点）</button>";
  h += "<button class='btn act' data-a='hear'>打听消息（1点）</button>";
  if(night) h += "<button class='btn act' data-a='patrol' style='border-color:#6b8fd6'>夜巡（2点）</button>";
  h += "</div></div>";
  h += "<div class='v44-act-group'><div class='v44-act-title'>✦ 修炼</div><div class='mech-row'>";
  h += "<button class='btn act' data-a='train'>打坐修炼（1点）</button>";
  h += "</div></div>";
  h += "<div class='v44-act-group'><div class='v44-act-title'>✦ 事务</div><div class='mech-row'>";
  if(mine) h += "<button class='btn act' data-a='mine'>采矿（1点）</button>";
  h += "<button class='btn act' data-a='forge'>锻造（1点）</button>";
  h += "<button class='btn act' data-a='board'>告示板</button>";
  h += "</div></div>";
  h += "<div class='v44-act-group'><div class='v44-act-title'>✦ 系统</div><div class='mech-row'>";
  h += "<button class='btn act' data-a='rest'>休整至天明（推进1日）</button>";
  h += "</div></div>";
  h += "<div id='act-out' style='margin-top:8px;font-size:13px'></div>";
  h += "</div>";
  openModal(elFromHtml(h));
  document.querySelectorAll(".act").forEach(b=>{
    b.onclick=()=>mechAct(b.dataset.a);
  });
}
function elFromHtml(html){
  const d=document.createElement("div"); d.innerHTML=html; return d;
}
function actOut(html){ const o=document.getElementById("act-out"); if(o) o.innerHTML=html; }
function mechAct(a){
  const acts = actsLeft();
  if(a==="rest"){
    closeModal();
    writePar("你在落脚处沉沉睡去。醒来时，天光已新。","res");
    advanceDays(1);
    if(S.world){ S.world.hour=8; S.world.actions=S.world.actionsMax; }
    var dreamChance = (S.san<60)?35:(S.san<80)?20:10;
    if(rnd(100)<dreamChance && typeof DREAM_EVENTS!=="undefined" && DREAM_EVENTS.length){
      var d = DREAM_EVENTS[rnd(DREAM_EVENTS.length)];
      writePar("── 梦境 · "+d.cn+" ──","noind flagline");
      writePar(d.text);
      if(d.eff){ var r2=applyEffects(d.eff,null); if(r2) writePar(r2,"res"); }
      if((d.sanLoss||0)>0) writePar("醒来时，枕上一片冷汗。","warn");
      else writePar("醒来时，心境平和了许多。","hint");
    }
    renderTop(); renderStats();
    return;
  }
  if(a==="board"){ openBoardModal(); return; }
  const cost = (a==="patrol")?2:1;
  if(acts < cost){ actOut("<span style='color:#d88'>今日行动已尽，宜休整。</span>"); sfxFail(); return; }
  if(a==="explore"){
    spendAct(1); mechClockAdvance(2);
    mechExplore();
  } else if(a==="hear"){
    spendAct(1); mechClockAdvance(1);
    mechHear();
  } else if(a==="train"){
    spendAct(1); mechClockAdvance(2);
    mechTrain();
  } else if(a==="mine"){
    spendAct(1); mechClockAdvance(3);
    mechMine();
  } else if(a==="forge"){
    spendAct(1); mechClockAdvance(2);
    mechForge();
  } else if(a==="patrol"){
    spendAct(2); mechClockAdvance(3);
    mechPatrol();
  }
  renderTop(); renderStats();
}

/* ============ 城市六动作 ============ */
/* 接委托：各势力告示板（赏金/护送/调查/押运） */
const QUESTS = [
  {cn:"剿匪·西郊马匪",need:"martial",pay:18,xp:25,rep:2,days:3,faction:"free",fail:"匪首识得厉害，带着残部遁入山林。你追了半日，只缴回几把锈刀。"},
  {cn:"护送·商队往学术城",need:"athletic",pay:22,xp:22,rep:2,days:4,faction:"south",fail:"商队在半路遇了劫匪，你拼杀一场，货损了三成。东家虽没怪罪，酬金也打了折扣。"},
  {cn:"调查·夜半钟声",need:"detect",pay:16,xp:30,rep:3,days:2,faction:"church",fail:"你守了半夜，只有风声。钟声再响时，已是三日之后——那座废弃钟楼里，多了一具新尸。"},
  {cn:"押运·铁器往铁门关",need:"STR",pay:30,xp:35,rep:3,days:5,faction:"north",fail:"铁门关方向战云密布，商队被巡军扣下盘查了三日。你护送着空车返回，只拿到半程酬金。"},
  {cn:"寻物·失落的徽记",need:"lore",pay:20,xp:28,rep:2,days:2,faction:"elf",fail:"你把藏书室翻了个底朝天，只找到几页残卷。徽记的线索，指向更深处——那不是你能去的地方。"},
  {cn:"驱兽·粮仓鼠患",need:"survive",pay:12,xp:15,rep:1,days:1,faction:"dwarf",fail:"那窝山鼠成了精，连夜打洞逃了。你只堵住三个洞口，剩下的，来年再见。"},
  {cn:"探秘·地宫入口",need:"stealth",pay:26,xp:40,rep:4,days:3,faction:"orc",fail:"地宫入口的机关你没能解开，还触发了警报。你退出来时，背后的石门上多了一道深深的爪痕。"}
];
let questIndex = 0;
function mechQuest(){
  if(!S.world) S.world={};
  const seen = S.world.questSeen || (S.world.questSeen={});
  const R = REGIONS[S.region];
  const pool = QUESTS.filter(q=>q.faction===S.region);
  const all = pool.length?pool:QUESTS;
  const q = all[questIndex % all.length];
  questIndex++;
  if(seen[q.cn] && seen[q.cn]>=2 && all.length>1){ questIndex++; return mechQuest(); }
  seen[q.cn] = (seen[q.cn]||0)+1;
  const isAttr = ["STR","AGI","INT","CHA","CON","SPR"].indexOf(q.need)>=0;
  const t = effTarget(isAttr?{check:{a:q.need,label:"本领"}}:{check:{a:JOBS[S.job]&&JOBS[S.job].attr||"STR",sk:q.need,label:q.need==="STR"?"力量":q.need}});
  writePar("你走向告示板。层层告示压在一起，墨迹新旧交叠，最上面一张的边角被风掀起。","noind");
  writePar("你揭下它："+q.cn+"。","noind");
  writePar("（酬金 "+q.pay+" 金，需 "+q.days+" 日。考验"+(isAttr?q.need:skillCn(q.need))+"）","noind");
  const roll = rollD100(); const lvl = tierOf(roll,t);
  S.dice.push({node:"quest",opt:q.cn,roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"){
    writePar("你接了这单活。");
    writePar("办得比预想的顺利。你甚至在过程中多看了一步——雇主没说的那一步，你替他想到了。","noind");
    writePar("雇主验了货，数出酬金，又额外看了你一眼。那一眼里有意外，也有掂量。","noind");
    advanceDays(Math.max(1,Math.floor(q.days*0.7)));
    const res = applyEffects({gold:q.pay+Math.floor(q.pay*0.3),xp:q.xp+10,rep:q.rep+1},null); if(res) writePar(res,"res");
    if(S.infl[q.faction]!==undefined) S.infl[q.faction]=Math.min(100,S.infl[q.faction]+3);
    writePar("（超额完成。雇主记住了你。）","hint");
    sfxOk();
  } else if(lvl==="extreme"){
    writePar("你接了这单活。风餐露宿，刀口舔蜜。");
    writePar("办得干净利落。雇主验了货，数出酬金，又额外赞了你一句。","noind");
    advanceDays(q.days);
    const res = applyEffects({gold:q.pay,xp:q.xp,rep:q.rep},null); if(res) writePar(res,"res");
    if(S.infl[q.faction]!==undefined) S.infl[q.faction]=Math.min(100,S.infl[q.faction]+2);
    sfxOk();
  } else if(lvl==="hard"){
    writePar("你接了这单活。过程比预想的曲折，有几次险些失手。");
    writePar("最终还是办成了。雇主皱着眉验了货，没多说什么，酬金照付。","noind");
    advanceDays(q.days+1);
    const res = applyEffects({gold:q.pay,xp:Math.floor(q.xp*0.7),rep:q.rep},null); if(res) writePar(res,"res");
    if(S.infl[q.faction]!==undefined) S.infl[q.faction]=Math.min(100,S.infl[q.faction]+1);
    sfxOk();
  } else if(lvl==="normal"){
    writePar("你接了这单活。中规中矩地办完了。");
    writePar("雇主点了点头，把酬金推过来。没有多的话，也没有少的钱。","noind");
    advanceDays(q.days);
    const res = applyEffects({gold:q.pay,xp:Math.floor(q.xp*0.5)},null); if(res) writePar(res,"res");
  } else if(lvl==="fail"){
    writePar(q.fail);
    writePar("任务没办好。雇主的脸色很难看，但还没到翻脸的地步。","noind");
    const r2=applyEffects({xp:6,rep:-1},null); if(r2) writePar(r2,"res");
    advanceDays(q.days);
    writePar("（补救：可以再接一单将功补过，或者花些钱赔礼——名声这东西，掉得快，补得慢。）","hint");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar(q.fail);
    writePar("大失败：事情搞砸了，而且砸得很难看。雇主放了话——在这座城里，你以后接活怕是要难了。","risky");
    const r2=applyEffects({xp:3,rep:-4,gold:-Math.floor(q.pay*0.5)},null); if(r2) writePar(r2,"res");
    advanceDays(q.days+2);
    if(S.infl[q.faction]!==undefined) S.infl[q.faction]=Math.max(0,S.infl[q.faction]-5);
    writePar("补救：①花双倍酬金赔礼；②离开这座城，去别处发展；③接一桩更难的活，用实力翻盘。路没有断。","hint");
    sfxFail();
  }
  writeNext();
}

/* 交易：按货币体系采买补给/卖物 */
function mechTrade(){
  const R = REGIONS[S.region];
  let h = "<h2>"+R.cn+" · 集市</h2>";
  h += "<div class='mini'>市价随行就市。银月与铜星通用，金龙兑银月一比二十。</div>";
  h += "<button class='opt' onclick='closeModal(); buySupplies()'><span class='od'>🫓</span> 采买粮水（10日份，5银月）</button>";
  h += "<button class='opt' onclick='closeModal(); buyMedicine()'><span class='od'>⚗️</span> 买疗伤药（1金龙，可治轻伤）</button>";
  h += "<button class='opt' onclick='closeModal(); sellJunk()'><span class='od'>💰</span> 变卖杂物（换些路费）</button>";
  h += "<button class='opt' onclick='closeModal(); tradeGamble()'><span class='od'>🎲</span> 赌一把行情（靠交易本事）</button>";
  h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 离开</button>";
  const box=document.createElement("div"); box.className="box"; box.innerHTML=h;
  openModal(box);
}
function buySupplies(){
  if(S.silver>=5){ S.silver-=5; writePar("你买了十日的干粮与水，装进背囊。","res"); }
  else if(S.gold>=1){ S.gold-=1; S.silver+=15; writePar("你兑出一枚金龙，买齐了粮水，剩下的银月也收进钱袋。","res"); }
  else { writePar("钱袋见底。摊主摇摇头，把干粮收了回去。","risky"); }
  writeNext();
}
function buyMedicine(){
  if(S.gold>=1){ S.gold-=1; if(S.wound>0) S.wound--; S.disease=false; writePar("疗伤药灌下去，一股暖流化开。伤处发痒，是血肉在重新生长。","res"); }
  else { writePar("你付不起这药钱。药铺伙计的眉眼，冷得像深秋的河。","risky"); }
  writeNext();
}
function sellJunk(){
  const got = Math.max(1, Math.floor(S.gold*0.05) + (S.items.length>0?8:0));
  const junk = S.items.splice(0, Math.min(2,S.items.length));
  S.gold+=got;
  writePar(junk.length?("你把"+junk.join("、")+"连同几件用不上的旧物，一起送进了当铺。"):"你把路上捡的旧物、多余的绑带，一起送进了当铺。");
  writePar("换得 "+money(got)+" 枚金币。","res");
  writeNext();
}
function tradeGamble(){
  const t = effTarget({check:{a:"CHA",sk:"bargain",label:"商道"}});
  writePar("你蹲在市场边上，听了一上午的行情，押了一注。");
  const roll = rollD100(); const lvl = tierOf(roll,t);
  S.dice.push({node:"trade",opt:"押注行情",roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    const g = 8 + (lvl==="crit"?30:(lvl==="extreme"?20:(lvl==="hard"?12:0)));
    writePar("你赌对了。粮价午后回落，你低买高卖，净赚一笔。");
    const r=applyEffects({gold:g},null); if(r) writePar(r,"res"); sfxOk();
  } else {
    writePar("行情跟你开了个玩笑。货砸在手里，亏了一笔。");
    const r=applyEffects({gold:-6},null); if(r) writePar(r,"res"); sfxFail();
    if(lvl==="critfail"){ writePar("大失败：你押注的货主连夜跑了，本钱血本无归。","risky"); applyEffects({gold:-12},null); }
  }
  writeNext();
}
/* 拜访势力：好感里程碑 */
function mechVisit(){
  const R = REGIONS[S.region];
  const cur = S.infl[S.region]||0;
  writePar("你递上名帖，求见"+R.cn+"的管事人。门房接过帖子，看了一眼你的衣着，又看了一眼你的手——手上有没有茧，指甲干不干净，他都看在眼里。","noind");
  const t = effTarget({check:{a:"CHA",sk:"persu",label:"拜会"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  S.dice.push({node:"visit",opt:"拜访"+R.cn,roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"){
    writePar("名帖递进去不到一炷香，管事人亲自迎了出来。");
    writePar("他打量你片刻，忽然笑了：『原来是你。请，里面请。』","noind");
    writePar("一席话说完，他让人给你上了一盏好茶——不是待客的那种，是他自己喝的那种。","noind");
    S.infl[S.region]=Math.min(100,cur+8);
    const r=applyEffects({rep:2},null); if(r) writePar(r,"res");
    writePar("（"+R.cn+"好感 +8，当前 "+S.infl[S.region]+"。被引为上宾。）","res");
    sfxOk();
  } else if(lvl==="extreme"){
    writePar("管事人亲自出来见了你。他收了名帖，与你说了几句不咸不淡的体面话——但每一句都在掂量你的分量。");
    writePar("末了，他让人给你上了一盏热茶。","noind");
    S.infl[S.region]=Math.min(100,cur+5);
    const r=applyEffects({rep:1},null); if(r) writePar(r,"res");
    writePar("（"+R.cn+"好感 +5，当前 "+S.infl[S.region]+"）","res");
    sfxOk();
  } else if(lvl==="hard"){
    writePar("等了小半个时辰，管事人才出来。他收了名帖，说了几句场面话，话里话外都在试探你的来路。");
    writePar("你应对得还算得体。他点了点头，让人上了茶——是待客的那种。","noind");
    S.infl[S.region]=Math.min(100,cur+3);
    const r=applyEffects({rep:1},null); if(r) writePar(r,"res");
    writePar("（"+R.cn+"好感 +3，当前 "+S.infl[S.region]+"）","res");
    sfxOk();
  } else if(lvl==="normal"){
    writePar("管事人没出来。一个副手收了名帖，与你说了几句不咸不淡的话，末了让人上了盏温茶。");
    S.infl[S.region]=Math.min(100,cur+1);
    writePar("（"+R.cn+"好感 +1，当前 "+S.infl[S.region]+"。混了个脸熟。）","res");
  } else if(lvl==="fail"){
    writePar("门房挡了驾。『管事人今日不见客。』他说这话时，眼睛看着你的鞋。");
    writePar("你没有硬闯。有些门，硬闯进去了，也坐不稳。","noind");
    writePar("（补救：换身行头再来，或者找个引荐人，或者——先在城里做出点名声，让他们主动来请你。）","hint");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar("你递名帖时，门房的脸色变了。");
    writePar("『原来是你。』他把名帖退了回来，『管事人说了，不见。』","risky");
    writePar("你不知道自己哪里得罪了人——但你知道，在这座城里，"+R.cn+"的门，暂时对你关上了。","noind");
    S.infl[S.region]=Math.max(0,cur-5);
    applyEffects({rep:-2},null);
    writePar("大失败：补救——①花重金送礼赔罪；②找一位与"+R.cn+"有交情的人居中斡旋；③暂时离开，等风头过去再回来。门关上了，但没有锁死。","hint");
    sfxFail();
  }
  writeNext();
}

/* 打探秘密：地标/传闻，与暗蚀会五部门渗透衔接 */
let secretIndex = 0;
function mechSecret(){
  const R = REGIONS[S.region];
  const spots = (CITY_SPOTS[S.loc]||[]);
  const sec = SECRETS[(secretIndex % SECRETS.length)];
  secretIndex++;
  writePar("你在"+R.cn+"的街巷间穿行，专挑那些没人愿意久留的角落走。墙皮剥落的巷尾、半掩的后门、废弃的地窖口——秘密喜欢藏在这些地方。","noind");
  const t = effTarget({check:{a:"INT",sk:"detect",label:"探秘"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  S.dice.push({node:"secret",opt:sec.cn,roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"){
    writePar(sec.ok);
    writePar("你甚至看出了这秘密背后的影子——有人在操纵这一切，而那个人，你似乎在哪里见过。","hint");
    const r=applyEffects({xp:25},null); if(r) writePar(r,"res");
    if(sec.flag){ S.flags[sec.flag]=true; writePar("（线索："+sec.flag+"）","res"); }
    abyssWhisper();
    sfxOk();
  } else if(lvl==="extreme"){
    writePar(sec.ok);
    const r=applyEffects({xp:18},null); if(r) writePar(r,"res");
    if(sec.flag){ S.flags[sec.flag]=true; writePar("（线索："+sec.flag+"）","res"); }
    abyssWhisper();
    sfxOk();
  } else if(lvl==="hard"){
    writePar(sec.ok);
    writePar("你摸到了一些边，但全貌还藏在雾里。","noind");
    const r=applyEffects({xp:12},null); if(r) writePar(r,"res");
    if(sec.flag){ S.flags[sec.flag]=true; writePar("（线索："+sec.flag+"）","res"); }
    sfxOk();
  } else if(lvl==="normal"){
    writePar("你找到了一些不对劲的地方，但说不上来哪里不对。像拼图少了几块，你只能看见轮廓。");
    const r=applyEffects({xp:6},null); if(r) writePar(r,"res");
  } else if(lvl==="fail"){
    writePar("你转了半天，什么也没发现。那些角落比你想象的更干净——干净得像是有人刚清理过。");
    writePar("（补救：换个时辰再来，或者——等这座城发生点什么，秘密自己会浮出来。）","hint");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar("你发现了秘密——但秘密也发现了你。");
    writePar("一道目光从暗处投过来，不重，却让你脊背发凉。你没有回头，径直走出了巷子。","risky");
    writePar("大失败：你被秘密的主人盯上了。补救——①立刻离开这座城；②花些钱让某些人闭嘴；③装作什么都没发现，继续过你的日子——但要小心。","hint");
    S.san=Math.max(0,(S.san||0)-5);
    applyEffects({rep:-1},null);
    S.flags.watched = true;
    sfxFail();
  }
  writeNext();
}

/* 暗蚀会五部门渗透（43号：金库/黑铁/密眼/教仪/禁书——按信息控制规则逐步披露） */
const ABYSS_SECTORS = [
  {cn:"「金」财务司",alias:"金库",line:"账房里那个永远在算账的中年人，出手阔绰得不像账房。有人私下叫他'金库'。"},
  {cn:"「刃」军务司",alias:"黑铁",line:"码头搬货的那队壮汉，膀子上都纹着同一枚黑铁印记。他们接的活，从来不用问价。"},
  {cn:"「眼」情报司",alias:"密眼",line:"酒馆角落那个卖消息的瞎子，眼睛看不见，却能报出你昨天夜里在哪儿睡的觉。他自称'密眼'的伙计。"},
  {cn:"「骨」教仪司",alias:"教仪",line:"城郊那座废弃教堂，夜里总有烛火。进去的人出来时，手腕上都多了一道细疤——教仪，在做某种'仪式'。"},
  {cn:"「智」研究司",alias:"禁书",line:"学院的禁书区，最近总有人借着修书的由头出入。出来的人袖口沾着一种奇特的墨迹——禁书司的手艺。"}
];
let abyssIdx = 0;
function abyssWhisper(){
  if(!S.world) S.world={};
  const known = S.world.abyssKnown || (S.world.abyssKnown={});
  const unk = ABYSS_SECTORS.filter(s=>!known[s.cn]);
  if(!unk.length) return;
  const s = unk[abyssIdx % unk.length];
  abyssIdx++;
  known[s.cn]=true;
  writePar("◇ 市井传闻："+s.line,"warn");
  if(S.infl.abyss!==undefined) S.infl.abyss=Math.min(100,S.infl.abyss+1);
}

/* 探索：随机事件池去重轮换（复用 TRAVEL_EVENTS 作为城市事件池） */
function mechExplore(){
  if(!S.world) return;
  const R = REGIONS[S.region];
  const seen = S.world.patrolSeen || [];
  let eventPool = (typeof CITY_DAILY_EVENTS!=="undefined" && CITY_DAILY_EVENTS.length) ? CITY_DAILY_EVENTS : TRAVEL_EVENTS;
  let pool = eventPool.filter(ev=>seen.indexOf(ev.cn)<0);
  if(!pool.length){ seen.length=0; pool=eventPool.slice(); }
  const ev = pool[rnd(pool.length)];
  seen.push(ev.cn); if(seen.length>6) seen.shift();
  const t = effTarget({check:{a:"SPR",sk:"survive",label:"行路"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  S.dice.push({node:"explore",opt:ev.cn,roll,target:t,lvl});
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    writePar("你在"+R.cn+"的街巷里漫无目的地走。墙根的苔、檐下的风铃、拐角处半掩的门——这座城把它的秘密藏在这些不起眼的地方。");
    writePar("然后你撞见了："+ (ev.ok||""));
    if(ev.effOk){ const r2=applyEffects(ev.effOk,null); if(r2) writePar(r2,"res"); }
    if(lvl==="crit"){ writePar("你甚至多看了一眼，看出了旁人看不出的门道。","hint"); applyEffects({xp:10},null); }
    sfxOk();
  } else if(lvl==="fail"){
    writePar("今天不宜出门。"+ (ev.fail||""));
    if(ev.effFail){ const r2=applyEffects(ev.effFail,null); if(r2) writePar(r2,"res"); }
    writePar("你回到住处，把今天的路在脑子里又走了一遍——有些地方，明天换个时辰再去。","hint");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar("你撞见了麻烦。"+ (ev.fail||""));
    if(ev.effFail){ const r2=applyEffects(ev.effFail,null); if(r2) writePar(r2,"res"); }
    writePar("大失败：你在错误的时间出现在了错误的地方。有人看见了你，或者，有什么东西记住了你。","risky");
    writePar("补救：花些钱打点，或者换身行头，或者——离开这座城几天，等风头过去。","hint");
    S.san=Math.max(0,(S.san||0)-4);
    sfxFail();
  }
  writeNext();
}

/* 打听消息：判定得线索 */
function mechHear(){
  const R = REGIONS[S.region];
  const t = effTarget({check:{a:"CHA",sk:"persu",label:"打听"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  S.dice.push({node:"hear",opt:"打探"+R.cn,roll,target:t,lvl});
  // 情报池：每条只含一个信息点，通过具体人物/场景带出，不罗列
  const tips = [
    {who:"茶棚里一个裹着旧棉袄的脚夫", what:"银月商会的车队最近夜里也在赶路，车上蒙着黑布，押车的都佩了刀。"},
    {who:"驿站马夫一边给马添料一边嘟囔", what:"北境铁门关的守军，这两个月换了三茬。新来的那些，口音不像本地人。"},
    {who:"卖炭的老汉把秤砣压得很低", what:"沙漠那边，夜里能看见光——绿莹莹的，贴着地平线走，像鬼火，又比鬼火整齐。"},
    {who:"酒馆老板娘擦杯子的手停了一下", what:"地下有人出高价收『旧钟』。什么钟，她没说，只说收钟的人，手指都是凉的。"},
    {who:"一个精灵行商压低了兜帽", what:"精灵边境的林子，最近总有灰袍人进出。守林的不问，也不敢问。"},
    {who:"码头的卸货工头啐了一口", what:"南方来的船，吃水越来越深。舱里装的不是货——是兵。"}
  ];
  const tip = tips[rnd(tips.length)];
  if(lvl==="crit"){
    writePar("你没有急着问。你先给对方添了盏茶，听他说了三句废话，才在第四句上轻轻一搭。");
    writePar(tip.who+"看了你一眼，忽然把声音压得更低："+tip.what);
    writePar("他说完就起身走了，茶钱都没要。你坐在原处，指尖还留着茶杯的余温。","noind");
    const r=applyEffects({rep:2,xp:15},null); if(r) writePar(r,"res");
    writePar("（线索已记下。日后到了相关地界，或许用得上。）","hint");
    sfxOk();
  } else if(lvl==="extreme"){
    writePar("你挑了个不惹人注意的角落坐下，要了壶最便宜的茶，听了半个时辰。");
    writePar(tip.who+"说漏了嘴："+tip.what);
    const r=applyEffects({rep:1,xp:10},null); if(r) writePar(r,"res");
    sfxOk();
  } else if(lvl==="hard"){
    writePar("你旁敲侧击了几句。对方起初含糊，被你绕了两圈，终于漏了半句。");
    writePar(tip.who+"含糊道："+tip.what+"——话说到一半，他自己先闭了嘴。");
    const r=applyEffects({xp:6},null); if(r) writePar(r,"res");
    sfxOk();
  } else if(lvl==="normal"){
    writePar("你问了几句，得到的都是些坊间传闻。真假掺半，听个热闹。");
    writePar(tip.who+"说了些道听途说的话，你记下了，也没全信。");
    const r=applyEffects({xp:3},null); if(r) writePar(r,"res");
  } else if(lvl==="fail"){
    writePar("人们看见你凑过来，都把话头收了。茶棚里忽然安静了一瞬，又恢复了嘈杂——但你知道，刚才那阵安静是冲你来的。");
    writePar("你没有再追问。有些地方，问得太急，反而什么都问不到。","noind");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar("你问到了不该问的人。");
    writePar(tip.who+"冷冷地看了你一眼，没有回答，转身走进巷子。你后颈发凉——那一眼里没有好奇，只有确认。","risky");
    writePar("你被人记住了。在这座城里，接下来的几天，最好少露面，或者——花点钱，让某些人忘记你的脸。","hint");
    applyEffects({rep:-2},null);
    S.flags.watched = true;
    sfxFail();
  }
  writeNext();
}

/* 修炼：xp + 破境检查 */
function mechTrain(){
  const job = S.job?JOBS[S.job]:null;
  const jobName = job?job.cn:"修士";
  const t = effTarget({check:{a:"INT",sk:"lore",label:"冥想"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  S.dice.push({node:"train",opt:"修炼",roll,target:t,lvl});
  if(lvl==="crit"){
    writePar("你盘膝而坐，烛火在眼前跳了一下，然后定住了。");
    writePar("气机沉入丹田，像一滴水落进深井。你听见了井底的回声——那是你自己的呼吸，又不完全是。","noind");
    writePar("这一坐，抵得上平日数日之功。你睁开眼时，烛火已经烧到了根，而你浑然不觉。","noind");
    const r=applyEffects({xp:40},null); if(r) writePar(r,"res");
    writePar("（顿悟：对"+jobName+"之道的理解又深了一层。）","hint");
    sfxOk(); tryAdvance();
  } else if(lvl==="extreme"){
    writePar("你收摄心神，气息渐渐绵长。杂念像水底的沙，沉了下去。");
    writePar("气机在经脉里走了一个完整的周天，没有滞涩。你收功时，指尖微微发麻——那是真气充盈的征兆。","noind");
    const r=applyEffects({xp:30},null); if(r) writePar(r,"res");
    sfxOk(); tryAdvance();
  } else if(lvl==="hard"){
    writePar("你静坐了一个时辰。起初心浮，后来慢慢沉了下去。");
    writePar("有所得，但不多。像在暗室里摸到了墙的轮廓，还没找到门。","noind");
    const r=applyEffects({xp:22},null); if(r) writePar(r,"res");
    sfxOk(); tryAdvance();
  } else if(lvl==="normal"){
    writePar("你盘膝吐纳，气机平稳。没有突破，也没有走火。");
    writePar("修行大多是这样的日子——平平无奇，却一日不可少。","noind");
    const r=applyEffects({xp:15},null); if(r) writePar(r,"res");
    tryAdvance();
  } else if(lvl==="fail"){
    writePar("心浮气躁。杂念像水底的泥沙，一搅就浑。");
    writePar("你试着收束，越收越乱。最后长叹一声，睁开了眼——窗外的天，已经暗了。","noind");
    writePar("（今日无所得。或许该先处理些俗务，心静了再练。）","hint");
    sfxFail();
  } else if(lvl==="critfail") {
    writePar("入定未深，耳边骤然响起一声冷笑。");
    writePar("不是外面的声音。是你自己心里的——那个你一直不愿面对的部分。","risky");
    writePar("你惊得气血翻涌，喉头一甜，险些岔气。连忙收功，额上全是冷汗。","noind");
    applyEffects({hp:-6},null); S.san=Math.max(0,(S.san||0)-3);
    writePar("大失败：心魔窥隙。补救：休息几日，或找一处清净之地，或服一颗安神的药——不要在这种状态下继续修炼。","hint");
    sfxFail();
  }
  writeNext();
}

/* 采矿 */
function mechMine(){
  const spot = MINE_SPOTS[S.region];
  if(!spot){ actOut("此地无矿脉可采。"); return; }
  const t = effTarget({check:{a:"STR",sk:"athletic",label:"挖掘"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    const ore = spot.ore[rnd(spot.ore.length)];
    writePar("你钻进"+spot.cn+"。镐头起落，石屑飞溅。你从岩缝里抠出一块东西——"+ore+"。");
    const r=applyEffects({mat:ore},null); if(r) writePar(r,"res");
    collectGallery(ore);
    sfxOk();
  } else {
    writePar("矿道又深又闷。你敲了半天，只敲下一地碎石，磨出一手血泡。");
    if(lvl==="critfail"){ writePar("大失败：矿道顶部的碎石簌簌落下，你险险避开，却被塌方埋了半截身子。你挣扎出来，灰头土脸，镐头折了。","risky"); applyEffects({hp:-10},null); }
    sfxFail();
  }
}
/* 锻造：词缀洗练 */
function mechForge(){
  const region=S.region||"free";
  let mats = FORGE_RECIPES.filter(r=>r.mats && Object.keys(r.mats).every(m=>(S.mats[m]||0)>=r.mats[m]));
  if(!mats.length){
    actOut("你身无合用的材料。铁匠瞥了你一眼：『没料子，就别耽误炉火。』<br>（需要精铁块/铁矿石/灵木/晶露/黄林晶碎片等）");
    sfxFail();
    return;
  }
  const rc = mats[0];
  const t = effTarget({check:{a:"INT",sk:"alchemy",label:"锻造"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    // 消耗材料
    for(const m in rc.mats){ S.mats[m]=Math.max(0,(S.mats[m]||0)-rc.mats[m]); }
    if(rc.cost&&rc.cost.gold) S.gold=Math.max(0,S.gold-rc.cost.gold);
    const keys = Object.keys(AFFIX);
    const w = 1 + (lvl==="crit"?1:0);
    let affixId = keys[rnd(keys.length)];
    for(let i=1;i<w;i++){ const k2=keys[rnd(keys.length)]; if(AFFIX[k2].fam!==AFFIX[affixId].fam) affixId=k2; }
    S.equipAffix[rc.slot] = affixId;
    S.affixRolls[affixId]=(S.affixRolls[affixId]||0)+1;
    const a=AFFIX[affixId];
    writePar("炉火腾起。你把"+rc.cn+"放进锻炉，捶打、淬火、铭刻——"+(lvl==="crit"?"收锤时，炉火骤然一亮，仿佛有灵。":"收锤时，铁器发出一声悠长的嗡鸣。"));
    writePar("你为它铭上词缀：**"+a.cn+"**（"+a.fam+"系）· "+a.desc, "res");
    if(a.risk) writePar("那词缀在暗处泛着微光。你总觉得它……在低语。","risky");
    sfxOk();
  } else {
    writePar("火候不对。铁胚在炉里变了形，你只得作罢——好在材料还能再用。");
    if(lvl==="critfail"){ writePar("大失败：你失手把材料掉进了炉膛深处，只捞出一团焦黑的铁渣。","risky"); S.gold=Math.max(0,S.gold-8); }
    sfxFail();
  }
}
/* 夜巡：高风险高回报 */
function mechPatrol(){
  const seen = S.world.patrolSeen || [];
  let pool = PATROL_POOL.filter(p=>seen.indexOf(p.cn)<0);
  if(!pool.length){ seen.length=0; pool=PATROL_POOL.slice(); }
  const ev = pool[rnd(pool.length)];
  seen.push(ev.cn); if(seen.length>5) seen.shift();
  const t = effTarget({check:ev.chk});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    writePar("夜色里，"+ev.cn+"。"+ev.ok.txt);
    const r=applyEffects(ev.ok.eff||{},null); if(r) writePar(r,"res");
    sfxOk();
  } else if(lvl==="fail"){
    writePar("夜色里，"+ev.cn+"。"+ev.fail.txt);
    const r=applyEffects(ev.fail.eff||{},null); if(r) writePar(r,"res");
    sfxFail();
  } else {
    writePar("夜色里，"+ev.cn+"。"+PATROL_FAIL_BONUS.txt,"risky");
    applyEffects({san:-2},null);
    if(ev.fail&&ev.fail.eff) applyEffects(ev.fail.eff,null);
    sfxFail();
  }
}

/* ---------- 九、告示板（跨地区委托） ---------- */
function boardOf(region){
  return {free:FREE_BOARD, north:NORTH_BOARD, south:SOUTH_BOARD, elf:ELF_BOARD, dwarf:DWARF_BOARD, orc:ORC_BOARD, east:EAST_BOARD, church:CHURCH_BOARD}[region] || FREE_BOARD;
}
function openBoardModal(){
  const region=S.region||"free";
  const list = boardOf(region);
  const picks = list.slice().sort(()=>Math.random()-0.5).slice(0,2);
  let h = "<div style='padding:4px 2px'>";
  h += "<div style='color:var(--gold2);margin-bottom:8px'><b>告示板</b> · "+regionCn(region)+"的委托</div>";
  picks.forEach((q,i)=>{
    h += "<div class='board-job'><div class='jb-t'>"+esc(q.t)+"</div>";
    h += "<div class='jb-r'>判定："+(q.check?ATTR_CN[q.check.a]+"+"+(SKILLS[q.check.sk]?SKILLS[q.check.sk].cn:q.check.sk):"无")+" · 报酬见分晓</div>";
    h += "<button class='btn' data-b='"+i+"'>接下委托</button></div>";
  });
  h += "<div id='bout' style='margin-top:6px;font-size:13px'></div>";
  h += "</div>";
  openModal(elFromHtml(h));
  document.querySelectorAll("[data-b]").forEach((b,i)=>{
    b.onclick=()=>boardDo(picks[+b.dataset.b]);
  });
}
function boardDo(q){
  const t = effTarget({check:q.check});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  const ok = (lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal");
  writePar(ok?choice(q.ok):choice(q.fail));
  const eff = ok?(q.okEff||{}):(q.failEff||{});
  const r=applyEffects(eff,null); if(r) writePar(r,"res");
  if(ok){ sfxOk(); S.world.boardDone[q.t]=(S.world.boardDone[q.t]||0)+1; }
  else sfxFail();
}

/* ---------- 十、图鉴 ---------- */
function collectGallery(key){
  if(!S||!S.world||!key) return;
  if(!ITEM_GALLERY[key]) return;
  if(!S.world.gallery) S.world.gallery={};
  if(S.world.gallery[key]) return;
  S.world.gallery[key]=1;
  const g=ITEM_GALLERY[key];
  flashMsg("图鉴收录："+g.ic+" "+key);
  const n=Object.keys(S.world.gallery).length;
  if(n===GALLERY_BONUS.need){
    flashMsg("图鉴集齐 "+n+" 件：大陆脉络 +2 智力");
    if(!S.flags.gallery_bonus){ S.flags.gallery_bonus=true; S.attrs.INT=Math.min(80,S.attrs.INT+2); }
  }
  if(S.attrs) renderStats();
}
function galleryCount(){ return S&&S.world?Object.keys(S.world.gallery||{}).length:0; }
function openGallery(){
  // v44: tab 化图鉴（图鉴 / 关系网 / 编年史 / 结局）
  openModal(elFromHtml(v44_renderAtlas()));
}

/* ---------- 十一、潜行 / 恶名 ---------- */
function toggleStealth(){
  if(!S||!S.world) return;
  S.world.stealthOn=!S.world.stealthOn;
  flashMsg(S.world.stealthOn?"进入潜行模式：暗处如鱼得水，明处易暴露":"退出潜行模式");
  renderStats(); sfxClick();
}

/* ---------- 十二、多周目 ---------- */
function legacyLoad(){ try{ return JSON.parse(localStorage.getItem("elda-legacy-v2")||"{}"); }catch(e){ return {}; } }
function legacySave(){
  try{
    const old = legacyLoad();
    const now = {endings:Object.assign({},old.endings), gallery:Object.assign({},old.gallery||{},(S.world?S.world.gallery:{})), affix:Object.assign({},old.affix||{},S.affixRolls||{}), maxRep:Math.max(old.maxRep||0,S.rep||0)};
    if(S.ending) now.endings[S.ending]=1;
    const n=Object.keys(now.endings).length; now.endCount=n;
    localStorage.setItem("elda-legacy-v2",JSON.stringify(now));
  }catch(e){}
}

/* ---------- 十三、世界推进：势力恶化 / NPC 行动 / 里程碑 ---------- */

/* ========== NPC离线生活回调（13号：痕迹展示，只展示结果不展示过程） ========== */
function npcLifeCheck(){
  if(typeof NPC_LIFE==="undefined") return;
  if(!S.world) return;
  if(!S.world.npcStates) S.world.npcStates = {};
  const city = S.region;
  const today = S.world.day || 1;
  let triggered = false;
  for(const id in NPC_LIFE){
    const npc = NPC_LIFE[id];
    if(npc.city !== city) continue;
    const st = S.world.npcStates[id] || {lastVisit:0, seen:[]};
    if(st.lastVisit > 0 && today > st.lastVisit){
      const days = today - st.lastVisit;
      const cands = npc.events.filter(function(e){
        return days>=e.min && days<=e.max && st.seen.indexOf(e.text)<0;
      });
      if(cands.length){
        const ev = cands[Math.floor(Math.random()*cands.length)];
        if(!triggered){
          writePar("── 你走后的这些天 ──","noind flagline");
          triggered = true;
        }
        writePar(npc.cn+"：","noind");
        writePar(ev.text, "noind");
        if(ev.trace) writePar("【痕迹】"+ev.trace,"hint");
        if(ev.effect){ const r = applyEffects(ev.effect, null); if(r) writePar(r,"res"); }
        st.seen.push(ev.text);
      }
    }
    st.lastVisit = today;
    S.world.npcStates[id] = st;
  }
}

function worldTick(days){
  if(!S||!S.world||!days) return;
  if(!S.world.live) S.world.live={};
  if(!S.world.liveHit) S.world.liveHit={};
  if(!S.world.npcLog) S.world.npcLog={};
  if(!S.world.worldLogs) S.world.worldLogs=[];
  if(!S.world.actionsMax) S.world.actionsMax=3;
  const live=S.world.live, hit=S.world.liveHit;
  for(const k in WORLD_LIVE){
    const cfg=WORLD_LIVE[k];
    live[k]=(live[k]||cfg.start)+cfg.rate*days;
    for(const th in cfg.events){
      if(live[k]>=+th && !hit[k+"_"+th]){
        hit[k+"_"+th]=true;
        const msg="世界恶化 · "+cfg.cn+"："+cfg.events[th];
        S.world.worldLogs.push({day:S.day,k,msg});
        logMsg(msg,"warn");
        flashMsg(msg);
      }
    }
  }
  // NPC 并行行动（每 N 天一条见闻）
  for(const n of NPC_ACTS){
    const key=n.n+"_last";
    const last=S.world.npcLog[key]||0;
    if(S.day-last>=n.every && S.day>1){
      S.world.npcLog[key]=S.day;
      const line=choice(n.lines);
      S.world.worldLogs.push({day:S.day,n:n.n,msg:"【"+n.n+"】"+line});
    }
  }
  // 行动点刷新
  S.world.actions=S.world.actionsMax;
  renderTop(); renderStats();
}
function checkMilestones(){
  if(!S||!S.world) return;
  const done=S.world.milestonesDone||(S.world.milestonesDone={});
  for(const f in MILESTONES){
    const v=S.infl[f]||0;
    for(const th in MILESTONES[f]){
      if(v>=+th && !done[f+"_"+th]){
        done[f+"_"+th]=true;
        flashMsg(regionCn(f)+"好感里程碑："+MILESTONES[f][th]);
      }
    }
  }
}

/* ---------- 十四、环境音效（WebAudio 合成，无外部资源） ---------- */
let AC=null, sfxOn=true, ambNodes=[];
function acInit(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC&&AC.state==="suspended"){ AC.resume(); } }
function beep(freq,dur,type,vol){ if(!sfxOn||!AC) return; try{ const o=AC.createOscillator(),g=AC.createGain(); o.type=type||"sine"; o.frequency.value=freq; g.gain.setValueAtTime(vol||0.05,AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+dur); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur); }catch(e){} }
function sfxClick(){ beep(520,0.06,"triangle",0.035); }
function sfxOk(){ beep(660,0.12,"sine",0.05); setTimeout(()=>beep(880,0.16,"sine",0.05),90); }
function sfxFail(){ beep(210,0.28,"sawtooth",0.035); }
function sfxLevel(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.18,"sine",0.05),i*110)); }
function ambNight(){
  if(!AC||!sfxOn||ambNodes.length) return;
  try{
    const dur=8, buf=AC.createBuffer(1,AC.sampleRate*dur,AC.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++){ d[i]=(Math.random()*2-1)*0.3*(0.35+0.65*Math.sin(i/3900)); }
    const src=AC.createBufferSource(); src.buffer=buf; src.loop=true;
    const g=AC.createGain(); g.gain.value=0.045;
    src.connect(g); g.connect(AC.destination); src.start();
    ambNodes=[src,g];
  }catch(e){}
}
function ambStop(){ ambNodes.forEach(n=>{try{ n.stop&&n.stop(); }catch(e){}}); ambNodes=[]; }
function syncAmbient(){
  if(!S||!S.world) return;
  if(isNightH(S.world.hour||8)) ambNight(); else ambStop();
}

/* ---------- 十五、包装：与 v2 引擎对接 ---------- */
/* 保存原始函数 */
const _orig_applyEffects = applyEffects;
const _orig_effTarget = effTarget;
const _orig_advanceDays = advanceDays;
const _orig_choose = choose;
const _orig_writeNext = writeNext;
const _orig_renderTop = renderTop;
const _orig_renderStats = renderStats;
const _orig_showEnding = showEnding;
const _orig_newGame = newGame;
const _orig_loadGame = loadGame;

applyEffects = function(eff,label){
  const res = _orig_applyEffects(eff,label);
  // 图鉴收集（物品/材料）
  if(S && eff){
    if(eff.item) collectGallery(eff.item);
    if(eff.mat && typeof eff.mat==="string") collectGallery(eff.mat);
  }
  // 好感里程碑
  if(eff && eff.infl){ checkMilestones(); }
  return res;
}
effTarget = function(opt){
  const base = _orig_effTarget(opt);
  if(!S || !opt || !opt.check) return base;
  let m = 0;
  // 词缀加成（属性）
  if(S.equipAffix){
    for(const sl in S.equipAffix){
      const id=S.equipAffix[sl]; if(!id) continue;
      const a=AFFIX[id]; if(!a) continue;
      if(a.bonus && a.bonus[opt.check.a]) m += a.bonus[opt.check.a];
    }
  }
  // 传承祝福
  if(S.world && S.world.ngBless) m += S.world.ngBless;
  // 图鉴集齐
  if(S.flags && S.flags.gallery_bonus && (opt.check.sk==="lore"||opt.check.sk==="detect")) m += 2;
  // 潜行模式：暗处+5 / 明处-5
  if(S.world && S.world.stealthOn){
    const loc=curLocName()+((N[curNode]&&N[curNode].place)||"");
    if(/(暗巷|码头|黑市|酒馆|地下|酒馆|market|alley|port|tavern)/.test(loc)) m += 5;
    else if(/(教堂|广场|税署|驿站|钟楼|圣城|church|station)/.test(loc)) m -= 5;
  }
  // 恶名：暗处如鱼得水 / 明处被警惕
  if((S.notoriety||0)>=40){
    const loc=curLocName()+((N[curNode]&&N[curNode].place)||"");
    if(/(暗巷|码头|黑市|酒馆|地下|赌|market|alley|port|tavern)/.test(loc)) m += 4;
    else if(/(教堂|广场|税署|驿站|钟楼|圣城|church|station|审判)/.test(loc)) m -= 4;
  }
  // 昼夜：夜间黑暗难行
  if(S.world){
    const h=S.world.hour||8;
    if(h>=19||h<6) m -= 5;
  }
  if(m) base.target = Math.max(5, Math.min(95, base.target + m));
  return base;
}
advanceDays = function(n){
  const before = S?S.day:0;
  _orig_advanceDays(n);
  worldTick(n||(S?S.day-before:1));
  if(S&&S.world){ S.world.actions=S.world.actionsMax; syncAmbient(); }
}
choose = function(opt){
  // 音效：先判定后给反馈——注入钩子在结算后
  _orig_choose(opt);
  // 判定音效（依据最近一次骰子）
  if(S && S.dice && S.dice.length){
    const d=S.dice[S.dice.length-1];
    if(d && d.node===curNode){ /* 仅当本次判定属于本节点 */ }
    if(d && d.lvl==="crit"||(d&&d.lvl==="extreme")) sfxOk();
    else if(d && (d.lvl==="fail"||d.lvl==="critfail")) sfxFail();
  }
}
writeNext = function(){
  ensureMechInit();
  _orig_writeNext();
}
renderTop = function(){
  ensureMechInit();
  _orig_renderTop();
  // 时钟注入
  const el=document.getElementById("tb-clock");
  if(el && S) el.outerHTML = clockHtml();
  if(!document.getElementById("tb-clock") && S){
    const dateEl=document.getElementById("tb-date");
    if(dateEl) dateEl.insertAdjacentHTML("afterend", clockHtml());
  }
  // 昼夜背景
  if(S&&S.world){
    document.body.classList.toggle("night", isNightH(S.world.hour||8));
  }
}
renderStats = function(){
  ensureMechInit();
  _orig_renderStats();
  const el=document.getElementById("stats");
  if(!el||!S) return;
  const acts=actsLeft();
  let add="";
  add += "<div class='row'><span>行动点</span><b>"+acts+"/"+actsMax()+" · "+shichenName(S.world?S.world.hour:8)+"</b></div>";
  add += "<div class='row'><span>图鉴</span><b>"+galleryCount()+"/"+Object.keys(ITEM_GALLERY).length+"</b></div>";
  if(S.world&&S.world.stealthOn) add += "<div class='row'><span>状态</span><b style='color:#6b8fd6'>潜行中</b></div>";
  if(S.world&&S.world.ngBless) add += "<div class='row'><span>传承</span><b style='color:var(--gold2)'>+"+S.world.ngBless+" 祝福</b></div>";
  if(S.notoriety>0) add += "<div class='row'><span>恶名</span><b style='color:#a55'>"+S.notoriety+"</b></div>";
  el.insertAdjacentHTML("beforeend", add);
}
showEnding = function(id){
  _orig_showEnding(id);
  // 结局动画
  const end=document.getElementById("ending");
  if(end){ end.classList.add("show-anim"); }
  // 后日谈信笺
  const L=LETTERS[id];
  if(L){
    const box=document.getElementById("ending");
    if(box){
      const div=document.createElement("div");
      div.className="letter";
      div.innerHTML="<div style='color:var(--gold2);margin-bottom:6px'>✉ 后日谈 · 信笺</div>"+esc(L).replace(/\\n/g,"<br>")+"<div class='sig'>—— 艾尔达历 4037 年</div>";
      box.appendChild(div);
    }
  }
  legacySave();
}
newGame = function(){
  ensureMechInit();
  _orig_newGame();
}
loadGame = function(){
  const ok=_orig_loadGame();
  if(S) mechInit(S);
  return ok;
}

/* ---------- 十六、UI 绑定 ---------- */
function mechBindUI(){
  // 行动 / 图鉴 / 潜行 / 音效按钮
  const nav=document.querySelector("#topbar .nav");
  if(nav){
    if(!document.getElementById("btn-acts")){
      const b=document.createElement("button"); b.id="btn-acts"; b.className="btn"; b.textContent="行动";
      b.onclick=()=>{ acInit(); openActs(); sfxClick(); };
      nav.insertBefore(b, document.getElementById("btn-map"));
    }
    if(!document.getElementById("btn-gallery")){
      const b=document.createElement("button"); b.id="btn-gallery"; b.className="btn"; b.textContent="图鉴";
      b.onclick=()=>{ acInit(); openGallery(); sfxClick(); };
      nav.insertBefore(b, document.getElementById("btn-log"));
    }
    if(!document.getElementById("btn-stealth")){
      const b=document.createElement("button"); b.id="btn-stealth"; b.className="btn"; b.textContent="潜行";
      b.onclick=()=>toggleStealth();
      nav.appendChild(b);
    }
    if(!document.getElementById("btn-sound")){
      const b=document.createElement("button"); b.id="btn-sound"; b.className="btn sound-toggle"; b.textContent="🔊";
      b.title="音效开关";
      b.onclick=()=>{ acInit(); sfxOn=!sfxOn; b.textContent=sfxOn?"🔊":"🔇"; b.classList.toggle("off",!sfxOn); if(!sfxOn) ambStop(); else syncAmbient(); };
      nav.appendChild(b);
    }
  }
  // 初始音效环境
  if(S&&S.world) syncAmbient();
}
window.addEventListener("load",function(){
  mechBindUI();
  // 若已在游戏中（读档或新建后），刷新
  if(S){ ensureMechInit(); renderTop(); renderStats(); }
});

function v35_arch_init() {
  // 注册核心模块
  V35_ModuleManager.register('core', {
    name: '核心引擎',
    version: '1.0',
    onLoad() { V35_EventBus.emit('core:loaded'); },
    onInit() { V35_EventBus.emit('core:initialized'); }
  });
  
  V35_ModuleManager.register('ui', {
    name: 'UI系统',
    version: '2.0',
    dependencies: ['core'],
    onLoad() { V35_EventBus.emit('ui:loaded'); }
  });
  
  V35_ModuleManager.register('save', {
    name: '存档系统',
    version: '1.0',
    dependencies: ['core'],
    onLoad() { V35_EventBus.emit('save:loaded'); }
  });
  
  // 加载核心模块
  V35_ModuleManager.load('core');
  V35_ModuleManager.load('ui');
  V35_ModuleManager.load('save');
  V35_ModuleManager.init('core');
  
  // 初始化开发者控制台
  V35_DevConsole.init();
  
  console.log('[V35] 技术架构基础已加载');
  if (typeof v35_initMagic === 'function') v35_initMagic();
  if (typeof v35_initFaction === 'function') v35_initFaction();






  console.log('[V35] 按 ~ 键打开开发者控制台');
}

/* ============================================================
   v35 战斗系统核心
   回合制 / 技能 / 状态效果 / 敌人AI / BOSS战
   ============================================================ */

// ========== 状态效果 ==========
const V35_STATUS_EFFECTS = {
  burn: {name:"燃烧", type:"dot", element:"fire", damagePer:0.08, duration:3, icon:"🔥", desc:"每回合损失8%最大HP"},
  poison: {name:"中毒", type:"dot", element:"earth", damagePer:0.06, duration:4, icon:"☠️", desc:"每回合损失6%最大HP"},
  freeze: {name:"冰冻", type:"control", element:"water", effect:"skip_turn", duration:2, icon:"❄️", desc:"无法行动2回合"},
  stun: {name:"眩晕", type:"control", effect:"skip_turn", duration:1, icon:"💫", desc:"无法行动1回合"},
  slow: {name:"减速", type:"debuff", stat:"spd", value:-30, duration:3, icon:"🐌", desc:"速度降低30%"},
  defense_up: {name:"防御提升", type:"buff", stat:"def", value:50, duration:2, icon:"🛡️", desc:"防御提升50%"},
  attack_up: {name:"攻击提升", type:"buff", stat:"atk", value:30, duration:3, icon:"⚔️", desc:"攻击提升30%"},
  taunt: {name:"嘲讽", type:"control", effect:"target_self", duration:3, icon:"😤", desc:"吸引敌人攻击"},
  silence: {name:"沉默", type:"control", effect:"no_magic", duration:2, icon:"🤫", desc:"无法使用魔法"},
  berserk: {name:"狂暴", type:"buff", stat:"atk", value:50, effect:"no_skills", duration:3, icon:"😡", desc:"攻击+50%但只能普通攻击"},
  bleed: {name:"流血", type:"dot", damagePer:0.05, duration:3, icon:"🩸", desc:"每回合损失5%最大HP"},
  regen: {name:"再生", type:"hot", healPer:0.05, duration:3, icon:"💚", desc:"每回合恢复5%最大HP"},
  shield: {name:"护盾", type:"buff", effect:"absorb", value:50, duration:2, icon:"🔰", desc:"吸收50点伤害"},
  blind: {name:"致盲", type:"debuff", stat:"hit", value:-40, duration:2, icon:"👁️", desc:"命中率降低40%"},
  root: {name:"定身", type:"control", effect:"no_move", duration:2, icon:"🌿", desc:"无法移动/逃跑"}
};

// ========== 元素反应 ==========
const V35_ELEMENT_REACTIONS = {
  fire_water: {name:"蒸汽", multiplier:1.2, aoe:true, extra:{blind:1}, desc:"火+水=蒸汽，范围伤害+致盲"},
  fire_wind: {name:"烈焰风暴", multiplier:1.8, extra:{burn:3}, desc:"火+风=烈焰风暴，高伤害+燃烧"},
  fire_earth: {name:"熔岩", multiplier:1.4, extra:{burn:2}, desc:"火+土=熔岩，伤害+燃烧"},
  water_wind: {name:"冰暴", multiplier:1.4, extra:{slow:3}, desc:"水+风=冰暴，伤害+减速"},
  water_earth: {name:"泥沼", multiplier:0.8, extra:{root:2}, desc:"水+土=泥沼，低伤害+定身"},
  wind_earth: {name:"沙尘暴", multiplier:1.1, aoe:true, extra:{blind:2}, desc:"风+土=沙尘暴，范围+致盲"},
  light_dark: {name:"湮灭", multiplier:2.5, selfDamage:0.3, desc:"光+暗=湮灭，极高伤害但自伤30%"},
  light_fire: {name:"圣焰", multiplier:1.6, extra:{burn:2}, desc:"光+火=圣焰，神圣伤害+燃烧"},
  dark_water: {name:"腐蚀", multiplier:1.3, extra:{poison:3}, desc:"暗+水=腐蚀，伤害+中毒"},
  soul_any: {name:"灵魂冲击", multiplier:2.0, ignoreDef:true, desc:"灵魂系=灵魂冲击，无视防御"}
};

// ========== 技能数据 ==========
const V35_SKILLS = {
  // 战士技能
  warrior_slash: {id:"warrior_slash", name:"斩击", type:"physical", element:"none", mp:0, cooldown:0, power:1.0, target:"single", desc:"基础近战攻击", job:["warrior","paladin","berserker"]},
  warrior_heavy: {id:"warrior_heavy", name:"重击", type:"physical", element:"none", mp:5, cooldown:1, power:1.8, target:"single", desc:"蓄力重击，1.8倍伤害", job:["warrior","paladin","berserker"]},
  warrior_whirlwind: {id:"warrior_whirlwind", name:"旋风斩", type:"physical", element:"none", mp:10, cooldown:2, power:1.2, target:"all", desc:"旋转攻击所有敌人", job:["warrior","berserker"]},
  warrior_taunt: {id:"warrior_taunt", name:"嘲讽", type:"support", element:"none", mp:5, cooldown:2, effect:{taunt:3}, target:"self", desc:"吸引敌人攻击3回合", job:["warrior","paladin"]},
  warrior_guard: {id:"warrior_guard", name:"铁壁", type:"support", element:"none", mp:8, cooldown:3, effect:{defense_up:2}, target:"self", desc:"防御提升50%，持续2回合", job:["warrior","paladin"]},
  warrior_cleave: {id:"warrior_cleave", name:"顺劈", type:"physical", element:"none", mp:8, cooldown:1, power:1.3, target:"all", desc:"顺劈所有敌人", job:["warrior","berserker"]},
  // 法师基础技能
  mage_fireball: {id:"mage_fireball", name:"火球术", type:"magic", element:"fire", mp:15, cooldown:0, power:1.5, target:"single", desc:"发射火球造成火焰伤害", job:["mage","sorcerer","warlock"]},
  mage_ice_lance: {id:"mage_ice_lance", name:"冰锥术", type:"magic", element:"water", mp:12, cooldown:0, power:1.3, effect:{slow:2}, target:"single", desc:"冰锥伤害+减速2回合", job:["mage","sorcerer"]},
  mage_lightning: {id:"mage_lightning", name:"闪电术", type:"magic", element:"wind", mp:14, cooldown:0, power:1.4, target:"single", desc:"闪电造成风属性伤害", job:["mage","sorcerer"]},
  mage_heal: {id:"mage_heal", name:"治疗术", type:"magic", element:"water", mp:15, cooldown:1, power:1.5, target:"ally", effect:"heal", desc:"恢复目标1.5倍INT的HP", job:["mage","priest","paladin"]},
  mage_shield: {id:"mage_shield", name:"魔法盾", type:"support", element:"none", mp:10, cooldown:2, effect:{shield:2}, target:"self", desc:"获得护盾吸收伤害", job:["mage","priest"]},
  // 牧师技能
  priest_holy_light: {id:"priest_holy_light", name:"圣光术", type:"magic", element:"light", mp:18, cooldown:0, power:1.6, target:"single", desc:"神圣光芒造成光属性伤害", job:["priest","paladin"]},
  priest_blessing: {id:"priest_blessing", name:"祝福", type:"support", element:"light", mp:12, cooldown:2, effect:{attack_up:3}, target:"ally", desc:"目标攻击提升30%，3回合", job:["priest"]},
  priest_smite: {id:"priest_smite", name:"惩击", type:"magic", element:"light", mp:20, cooldown:1, power:2.0, target:"single", desc:"强力神圣伤害", job:["priest","paladin"]},
  // 通用
  basic_attack: {id:"basic_attack", name:"普通攻击", type:"physical", element:"none", mp:0, cooldown:0, power:1.0, target:"single", desc:"基础攻击", job:["all"]},
  defend: {id:"defend", name:"防御", type:"support", element:"none", mp:0, cooldown:0, effect:{defense_up:1}, target:"self", desc:"本回合防御提升50%", job:["all"]}
};

// ========== 敌人数据 ==========
const V35_ENEMIES = {
  goblin: {id:"goblin", name:"哥布林", hp:30, mp:10, atk:8, def:3, spd:10, exp:15, gold:5, skills:["basic_attack","warrior_slash"], ai:"aggressive", drops:["goblin_ear"], desc:"矮小但狡猾的绿皮生物"},
  wolf: {id:"wolf", name:"深渊狼", hp:45, mp:0, atk:12, def:5, spd:15, exp:25, gold:8, skills:["basic_attack","warrior_heavy"], ai:"aggressive", drops:["wolf_pelt"], desc:"被深渊侵蚀的野狼"},
  dark_mage: {id:"dark_mage", name:"暗蚀会法师", hp:60, mp:50, atk:6, def:4, spd:8, exp:50, gold:30, skills:["mage_fireball","mage_ice_lance","basic_attack"], ai:"strategic", drops:["magic_crystal"], desc:"暗蚀会的低阶法师"},
  bandit: {id:"bandit", name:"强盗", hp:40, mp:5, atk:10, def:4, spd:12, exp:20, gold:25, skills:["basic_attack","warrior_slash"], ai:"balanced", drops:["gold_pouch"], desc:"拦路抢劫的亡命之徒"},
  skeleton: {id:"skeleton", name:"骷髅兵", hp:35, mp:0, atk:9, def:6, spd:6, exp:18, gold:3, skills:["basic_attack"], ai:"aggressive", drops:["bone"], desc:"不死的骷髅战士，弱光"},
  slime: {id:"slime", name:"史莱姆", hp:25, mp:5, atk:5, def:8, spd:4, exp:10, gold:2, skills:["basic_attack"], ai:"balanced", drops:["slime_gel"], desc:"黏糊糊的软体生物"},
  orc_warrior: {id:"orc_warrior", name:"兽人战士", hp:70, mp:0, atk:15, def:8, spd:8, exp:40, gold:15, skills:["basic_attack","warrior_heavy","warrior_whirlwind"], ai:"aggressive", drops:["orc_tusk"], desc:"强壮的兽人战士"},
  eclipse_knight: {id:"eclipse_knight", name:"暗蚀骑士", hp:100, mp:20, atk:18, def:12, spd:10, exp:80, gold:50, skills:["basic_attack","warrior_heavy","warrior_guard"], ai:"balanced", drops:["eclipse_badge"], desc:"暗蚀会的精锐骑士"}
};

// ========== BOSS数据 ==========
const V35_BOSSES = {
  eclipse_captain: {
    id:"eclipse_captain", name:"暗蚀会队长", hp:250, mp:80, atk:20, def:12, spd:12,
    phases:[
      {hpThreshold:250, skills:["basic_attack","warrior_slash"], ai:"balanced"},
      {hpThreshold:150, skills:["basic_attack","warrior_heavy","warrior_whirlwind"], ai:"aggressive", buff:"attack_up"},
      {hpThreshold:70, skills:["warrior_heavy","warrior_whirlwind"], ai:"desperate", buff:"berserk"}
    ],
    weakness:"light", exp:300, gold:200, drops:["eclipse_captain_badge","dark_essence"],
    desc:"暗蚀会的队长，多阶段战斗"
  },
  abyss_hound: {
    id:"abyss_hound", name:"深渊猎犬", hp:180, mp:30, atk:25, def:8, spd:18,
    phases:[
      {hpThreshold:180, skills:["basic_attack","warrior_slash"], ai:"aggressive"},
      {hpThreshold:90, skills:["basic_attack","warrior_heavy","warrior_cleave"], ai:"aggressive", buff:"attack_up"}
    ],
    weakness:"light", exp:250, gold:100, drops:["abyss_fang","soul_fragment"],
    desc:"从深渊召唤的恐怖猎犬"
  }
};

// ========== 战斗状态 ==========
let V35_BATTLE = {
  active: false,
  turn: 0,
  phase: "player",
  enemies: [],
  allies: [],
  turnOrder: [],
  currentActor: 0,
  selectedSkill: null,
  selectingTarget: false,
  log: [],
  rewards: null,
  playerDefending: false,
  enemyElements: {},  // 记录敌人最近受到的元素
  battleContext: null
};

// ========== 战斗核心函数 ==========
function v35_initBattle(enemyId, nextVictory, nextDefeat, nextFlee) {
  V35_BATTLE.nextVictory = nextVictory || 'battle_generic_victory';
  V35_BATTLE.nextDefeat = nextDefeat || 'battle_generic_defeat';
  V35_BATTLE.nextFlee = nextFlee || nextDefeat || 'battle_generic_defeat';
  const enemyData = V35_ENEMIES[enemyId] || V35_BOSSES[enemyId];
  if (!enemyData) { console.error('[V35] Enemy not found:', enemyId); return; }
  
  V35_BATTLE = {
    active: true,
    turn: 1,
    phase: "player",
    enemies: [],
    allies: [],
    turnOrder: [],
    currentActor: 0,
    selectedSkill: null,
    selectingTarget: false,
    log: [],
    rewards: null,
    playerDefending: false,
    enemyElements: {},
    battleContext: context
  };
  
  // 创建敌人（1-3个）
  const enemyCount = context.enemyCount || (Math.random() < 0.3 ? 2 : 1);
  for (let i = 0; i < enemyCount; i++) {
    V35_BATTLE.enemies.push({
      ...JSON.parse(JSON.stringify(enemyData)),
      maxHp: enemyData.hp,
      maxMp: enemyData.mp,
      status: [],
      cooldowns: {},
      currentPhase: 0,
      uid: "enemy_" + i
    });
  }
  
  // 创建玩家角色
  const player = {
    name: S.name || "冒险者",
    hp: S.hp || 100,
    maxHp: S.maxHp || 100,
    mp: S.mp || 50,
    maxMp: S.maxMp || 50,
    atk: (S.attrs && S.attrs.STR ? S.attrs.STR * 0.5 : 10),
    def: (S.attrs && S.attrs.CON ? S.attrs.CON * 0.3 : 5),
    spd: (S.attrs && S.attrs.AGI ? S.attrs.AGI * 0.5 : 10),
    int: (S.attrs && S.attrs.INT ? S.attrs.INT : 10),
    spr: (S.attrs && S.attrs.SPR ? S.attrs.SPR : 10),
    status: [],
    cooldowns: {},
    isPlayer: true,
    uid: "player"
  };
  V35_BATTLE.allies.push(player);
  
  // 计算行动顺序
  v35_calcTurnOrder();
  
  // 显示战斗界面
  v35_showBattleUI();
  v35_battleLog("战斗开始！遭遇 " + V35_BATTLE.enemies.map(e => e.name).join("、"), "system");
  
  V35_EventBus.emit('battle:start', { enemy: enemyId, context });
  
  // 开始第一回合
  setTimeout(() => v35_nextTurn(), 500);
}

function v35_calcTurnOrder() {
  const all = [...V35_BATTLE.allies, ...V35_BATTLE.enemies].filter(c => c.hp > 0);
  all.sort((a, b) => {
    let spdA = a.spd, spdB = b.spd;
    a.status.forEach(s => { if (V35_STATUS_EFFECTS[s.id]?.stat === 'spd') spdA *= (1 + V35_STATUS_EFFECTS[s.id].value/100); });
    b.status.forEach(s => { if (V35_STATUS_EFFECTS[s.id]?.stat === 'spd') spdB *= (1 + V35_STATUS_EFFECTS[s.id].value/100); });
    return spdB - spdA;
  });
  V35_BATTLE.turnOrder = all;
  V35_BATTLE.currentActor = 0;
}

function v35_nextTurn() {
  if (!V35_BATTLE.active) return;
  
  // 检查战斗结束
  if (v35_checkBattleEnd()) return;
  
  // 处理当前行动者
  const actor = V35_BATTLE.turnOrder[V35_BATTLE.currentActor];
  if (!actor || actor.hp <= 0) {
    V35_BATTLE.currentActor++;
    if (V35_BATTLE.currentActor >= V35_BATTLE.turnOrder.length) {
      V35_BATTLE.turn++;
      v35_processRoundEnd();
      v35_calcTurnOrder();
    }
    setTimeout(() => v35_nextTurn(), 200);
    return;
  }
  
  // 检查状态效果（冰冻/眩晕跳过回合）
  const skipStatus = actor.status.find(s => V35_STATUS_EFFECTS[s.id]?.effect === 'skip_turn');
  if (skipStatus) {
    v35_battleLog(`${actor.name} 被${V35_STATUS_EFFECTS[skipStatus.id].name}，无法行动！`, "system");
    v35_updateBattleUI();
    V35_BATTLE.currentActor++;
    if (V35_BATTLE.currentActor >= V35_BATTLE.turnOrder.length) {
      V35_BATTLE.turn++;
      v35_processRoundEnd();
      v35_calcTurnOrder();
    }
    setTimeout(() => v35_nextTurn(), 800);
    return;
  }
  
  V35_BATTLE.phase = actor.isPlayer ? "player" : "enemy";
  v35_updateBattleUI();
  
  if (actor.isPlayer) {
    // 玩家回合，显示行动按钮
    V35_BATTLE.playerDefending = false;
  } else {
    // 敌人AI行动
    setTimeout(() => v35_enemyAI(actor), 600);
  }
}

function v35_playerAction(actionType, skillId = null) {
  if (V35_BATTLE.phase !== "player") return;
  const player = V35_BATTLE.allies[0];
  
  if (actionType === "attack") {
    V35_BATTLE.selectedSkill = V35_SKILLS.basic_attack;
    V35_BATTLE.selectingTarget = true;
    v35_battleLog("选择攻击目标...", "system");
    v35_updateBattleUI();
  } else if (actionType === "skill") {
    v35_showSkillPanel();
  } else if (actionType === "defend") {
    V35_BATTLE.playerDefending = true;
    v35_applyStatus(player, "defense_up", 1);
    v35_battleLog(`${player.name} 进入防御姿态！`, "player");
    v35_endPlayerTurn();
  } else if (actionType === "flee") {
    v35_tryFlee();
  }
}

function v35_selectSkill(skillId) {
  const skill = V35_SKILLS[skillId];
  const player = V35_BATTLE.allies[0];
  if (!skill) return;
  if (player.mp < skill.mp) {
    v35_battleLog("MP不足！", "system");
    return;
  }
  if (player.cooldowns[skillId] > 0) {
    v35_battleLog("技能冷却中！", "system");
    return;
  }
  // 检查沉默
  if (player.status.find(s => s.id === 'silence') && skill.type === 'magic') {
    v35_battleLog("被沉默，无法使用魔法！", "system");
    return;
  }
  
  V35_BATTLE.selectedSkill = skill;
  v35_hideSkillPanel();
  
  if (skill.target === "self" || skill.target === "ally") {
    // 自身/友方目标
    v35_executeSkill(player, skill, player);
  } else {
    // 敌方目标
    V35_BATTLE.selectingTarget = true;
    v35_battleLog(`选择${skill.name}的目标...`, "system");
    v35_updateBattleUI();
  }
}

function v35_selectTarget(enemyIndex) {
  if (!V35_BATTLE.selectingTarget) return;
  const enemy = V35_BATTLE.enemies[enemyIndex];
  if (!enemy || enemy.hp <= 0) return;
  
  const player = V35_BATTLE.allies[0];
  const skill = V35_BATTLE.selectedSkill;
  V35_BATTLE.selectingTarget = false;
  
  v35_executeSkill(player, skill, enemy);
}

function v35_executeSkill(caster, skill, target) {
  // 消耗MP
  caster.mp = Math.max(0, caster.mp - skill.mp);
  if (skill.cooldown > 0) caster.cooldowns[skill.id] = skill.cooldown;
  
  const isPlayer = caster.isPlayer;
  const logType = isPlayer ? "player" : "enemy";
  
  if (skill.type === "support") {
    // 辅助技能
    if (skill.effect) {
      for (const [statusId, duration] of Object.entries(skill.effect)) {
        v35_applyStatus(target, statusId, duration);
      }
    }
    v35_battleLog(`${caster.name} 使用了 ${skill.name}！`, logType);
  } else if (skill.effect === "heal") {
    // 治疗
    const healAmount = Math.floor(caster.int * skill.power);
    target.hp = Math.min(target.maxHp, target.hp + healAmount);
    v35_battleLog(`${caster.name} 使用 ${skill.name}，恢复 ${healAmount} HP！`, "heal");
    v35_showDamagePopup(target, "+" + healAmount, "heal");
  } else {
    // 伤害技能
    const damage = v35_calcDamage(caster, target, skill);
    target.hp = Math.max(0, target.hp - damage.final);
    
    let logMsg = `${caster.name} 使用 ${skill.name}，造成 ${damage.final} 点伤害`;
    if (damage.crit) logMsg += "（暴击！）";
    if (damage.reaction) logMsg += `【${damage.reaction}】`;
    v35_battleLog(logMsg, logType);
    v35_showDamagePopup(target, damage.final, damage.crit ? "crit" : "damage");
    
    // 记录元素（用于元素反应）
    if (skill.element && skill.element !== "none") {
      if (!V35_BATTLE.enemyElements[target.uid]) V35_BATTLE.enemyElements[target.uid] = [];
      V35_BATTLE.enemyElements[target.uid].push(skill.element);
      if (V35_BATTLE.enemyElements[target.uid].length > 2) {
        V35_BATTLE.enemyElements[target.uid].shift();
      }
    }
    
    // 应用状态效果
    if (skill.effect) {
      for (const [statusId, duration] of Object.entries(skill.effect)) {
        if (V35_STATUS_EFFECTS[statusId]) {
          v35_applyStatus(target, statusId, duration);
        }
      }
    }
    
    // AOE伤害
    if (skill.target === "all") {
      V35_BATTLE.enemies.forEach((e, i) => {
        if (e.uid !== target.uid && e.hp > 0) {
          const aoeDmg = v35_calcDamage(caster, e, skill, true);
          e.hp = Math.max(0, e.hp - aoeDmg.final);
          v35_showDamagePopup(e, aoeDmg.final, "damage");
        }
      });
    }
  }
  
  v35_updateBattleUI();
  
  if (isPlayer) {
    v35_endPlayerTurn();
  } else {
    V35_BATTLE.currentActor++;
    if (V35_BATTLE.currentActor >= V35_BATTLE.turnOrder.length) {
      V35_BATTLE.turn++;
      v35_processRoundEnd();
      v35_calcTurnOrder();
    }
    setTimeout(() => v35_nextTurn(), 600);
  }
}

function v35_calcDamage(attacker, defender, skill, isAoe = false) {
  let baseDamage;
  if (skill.type === "physical") {
    baseDamage = attacker.atk * skill.power;
  } else {
    baseDamage = attacker.int * skill.power;
  }
  
  // 防御
  let defense = defender.def;
  if (V35_BATTLE.playerDefending && defender.isPlayer) defense *= 1.5;
  defender.status.forEach(s => {
    if (V35_STATUS_EFFECTS[s.id]?.stat === 'def') defense *= (1 + V35_STATUS_EFFECTS[s.id].value/100);
  });
  
  // 护盾
  let shield = 0;
  defender.status.forEach(s => {
    if (s.id === 'shield') shield += s.value || 50;
  });
  
  // 暴击
  const critChance = 0.1 + (attacker.spd || 10) * 0.002;
  const isCrit = Math.random() < critChance;
  let critMult = isCrit ? 1.5 : 1.0;
  
  // 元素反应
  let reactionMult = 1.0;
  let reactionName = null;
  if (skill.element && skill.element !== "none" && !isAoe) {
    const prevElements = V35_BATTLE.enemyElements[defender.uid] || [];
    for (const prev of prevElements) {
      const reactionKey1 = prev + "_" + skill.element;
      const reactionKey2 = skill.element + "_" + prev;
      const reaction = V35_ELEMENT_REACTIONS[reactionKey1] || V35_ELEMENT_REACTIONS[reactionKey2];
      if (reaction) {
        reactionMult = reaction.multiplier;
        reactionName = reaction.name;
        if (reaction.extra) {
          for (const [statusId, duration] of Object.entries(reaction.extra)) {
            v35_applyStatus(defender, statusId, duration);
          }
        }
        break;
      }
    }
    // 灵魂系特殊反应
    if (skill.element === "soul") {
      const soulReaction = V35_ELEMENT_REACTIONS.soul_any;
      reactionMult = soulReaction.multiplier;
      reactionName = soulReaction.name;
    }
  }
  
  // 弱点/抗性
  let elementMult = 1.0;
  if (defender.weakness && skill.element === defender.weakness) elementMult = 1.5;
  
  // 最终伤害
  let finalDamage = Math.floor((baseDamage * critMult * reactionMult * elementMult - defense * 0.5) * (isAoe ? 0.7 : 1));
  finalDamage = Math.max(1, finalDamage);
  
  // 护盾吸收
  if (shield > 0) {
    const absorbed = Math.min(shield, finalDamage);
    finalDamage -= absorbed;
  }
  
  return {
    base: Math.floor(baseDamage),
    final: finalDamage,
    crit: isCrit,
    reaction: reactionName
  };
}

function v35_applyStatus(target, statusId, duration) {
  const status = V35_STATUS_EFFECTS[statusId];
  if (!status) return;
  
  // 检查是否已有同名状态，刷新持续时间
  const existing = target.status.find(s => s.id === statusId);
  if (existing) {
    existing.duration = Math.max(existing.duration, duration);
  } else {
    target.status.push({ id: statusId, duration: duration });
  }
}

function v35_processStatusEffects(character) {
  const expired = [];
  character.status.forEach(s => {
    const status = V35_STATUS_EFFECTS[s.id];
    if (!status) { expired.push(s); return; }
    
    if (status.type === "dot") {
      const dmg = Math.floor(character.maxHp * status.damagePer);
      character.hp = Math.max(0, character.hp - dmg);
      v35_battleLog(`${character.name} 受到${status.name}伤害 ${dmg}！`, "damage");
    }
    if (status.type === "hot") {
      const heal = Math.floor(character.maxHp * status.healPer);
      character.hp = Math.min(character.maxHp, character.hp + heal);
      v35_battleLog(`${character.name} 恢复${heal} HP（${status.name}）`, "heal");
    }
    
    s.duration--;
    if (s.duration <= 0) expired.push(s);
  });
  character.status = character.status.filter(s => !expired.includes(s));
}

function v35_processRoundEnd() {
  // 处理所有角色的状态效果
  [...V35_BATTLE.allies, ...V35_BATTLE.enemies].forEach(c => {
    if (c.hp > 0) v35_processStatusEffects(c);
  });
  
  // 减少冷却
  [...V35_BATTLE.allies, ...V35_BATTLE.enemies].forEach(c => {
    for (const skillId in c.cooldowns) {
      if (c.cooldowns[skillId] > 0) c.cooldowns[skillId]--;
    }
  });
  
  // BOSS阶段检查
  V35_BATTLE.enemies.forEach(enemy => {
    if (enemy.phases) {
      for (let i = enemy.currentPhase; i < enemy.phases.length; i++) {
        if (enemy.hp <= enemy.phases[i].hpThreshold && enemy.hp > 0) {
          if (i > enemy.currentPhase) {
            enemy.currentPhase = i;
            enemy.skills = enemy.phases[i].skills;
            enemy.ai = enemy.phases[i].ai;
            if (enemy.phases[i].buff) {
              v35_applyStatus(enemy, enemy.phases[i].buff, 99);
            }
            v35_battleLog(`${enemy.name} 进入了新的阶段！`, "system");
            V35_EventBus.emit('battle:boss_phase', { enemy, phase: i });
          }
          break;
        }
      }
    }
  });
  
  v35_battleLog(`—— 第 ${V35_BATTLE.turn} 回合 ——`, "system");
}

function v35_enemyAI(enemy) {
  if (enemy.hp <= 0) {
    V35_BATTLE.currentActor++;
    v35_nextTurn();
    return;
  }
  
  const player = V35_BATTLE.allies[0];
  let chosenSkill = V35_SKILLS.basic_attack;
  
  // 根据AI类型选择技能
  const availableSkills = (enemy.skills || ["basic_attack"])
    .map(id => V35_SKILLS[id])
    .filter(s => s && enemy.mp >= s.mp && (!enemy.cooldowns[s.id] || enemy.cooldowns[s.id] <= 0));
  
  if (enemy.ai === "aggressive") {
    // 猛攻：优先高伤害技能
    const damageSkills = availableSkills.filter(s => s.type !== "support" && s.effect !== "heal");
    if (damageSkills.length > 0) {
      chosenSkill = damageSkills.reduce((a, b) => (a.power || 1) > (b.power || 1) ? a : b);
    }
  } else if (enemy.ai === "strategic") {
    // 策略：低血量时治疗/防御，否则用控制技能
    if (enemy.hp < enemy.maxHp * 0.3) {
      const healSkill = availableSkills.find(s => s.effect === "heal");
      if (healSkill) chosenSkill = healSkill;
    } else {
      const controlSkills = availableSkills.filter(s => s.effect && Object.keys(s.effect).some(k => V35_STATUS_EFFECTS[k]?.type === "control"));
      if (controlSkills.length > 0 && Math.random() < 0.5) {
        chosenSkill = controlSkills[Math.floor(Math.random() * controlSkills.length)];
      } else if (availableSkills.length > 0) {
        chosenSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      }
    }
  } else if (enemy.ai === "desperate") {
    // 绝望：只用最高伤害技能
    const damageSkills = availableSkills.filter(s => s.type !== "support");
    if (damageSkills.length > 0) {
      chosenSkill = damageSkills.reduce((a, b) => (a.power || 1) > (b.power || 1) ? a : b);
    }
  } else {
    // balanced：随机选择
    if (availableSkills.length > 0) {
      chosenSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    }
  }
  
  // 执行技能
  if (chosenSkill.target === "self") {
    v35_executeSkill(enemy, chosenSkill, enemy);
  } else if (chosenSkill.target === "ally") {
    const allies = V35_BATTLE.enemies.filter(e => e.hp > 0);
    const target = allies[Math.floor(Math.random() * allies.length)];
    v35_executeSkill(enemy, chosenSkill, target);
  } else {
    // 攻击玩家
    v35_executeSkill(enemy, chosenSkill, player);
  }
}

function v35_endPlayerTurn() {
  V35_BATTLE.currentActor++;
  if (V35_BATTLE.currentActor >= V35_BATTLE.turnOrder.length) {
    V35_BATTLE.turn++;
    v35_processRoundEnd();
    v35_calcTurnOrder();
  }
  v35_updateBattleUI();
  setTimeout(() => v35_nextTurn(), 600);
}

function v35_tryFlee() {
  const player = V35_BATTLE.allies[0];
  const fleeChance = 0.3 + (player.spd - 10) * 0.02;
  if (Math.random() < fleeChance) {
    v35_battleLog("成功逃跑！", "system");
    V35_BATTLE.active = false;
    setTimeout(() => {
      v35_hideBattleUI();
      // 回到剧情
      if (V35_BATTLE.battleContext.fleeNode) {
        curNode = V35_BATTLE.battleContext.fleeNode;
        writeNext();
      }
    }, 1000);
  } else {
    v35_battleLog("逃跑失败！", "system");
    v35_endPlayerTurn();
  }
}

function v35_checkBattleEnd() {
  const player = V35_BATTLE.allies[0];
  const allEnemiesDead = V35_BATTLE.enemies.every(e => e.hp <= 0);
  
  if (player.hp <= 0) {
    // 玩家战败
    V35_BATTLE.active = false;
    v35_showBattleResult("defeat");
    return true;
  }
  
  if (allEnemiesDead) {
    // 玩家胜利
    V35_BATTLE.active = false;
    v35_calcRewards();
    v35_showBattleResult("victory");
    return true;
  }
  
  return false;
}

function v35_calcRewards() {
  let totalExp = 0, totalGold = 0;
  const drops = [];
  V35_BATTLE.enemies.forEach(enemy => {
    totalExp += enemy.exp || 0;
    totalGold += enemy.gold || 0;
    if (enemy.drops) {
      enemy.drops.forEach(drop => {
        if (Math.random() < 0.5) drops.push(drop);
      });
    }
  });
  
  // 战斗评价
  const turns = V35_BATTLE.turn;
  let rating = "C";
  if (turns <= 3) rating = "S";
  else if (turns <= 5) rating = "A";
  else if (turns <= 8) rating = "B";
  
  // S评价额外奖励
  if (rating === "S") totalExp = Math.floor(totalExp * 1.5);
  
  V35_BATTLE.rewards = { exp: totalExp, gold: totalGold, drops, rating, turns };
  
  // 应用奖励
  S.exp = (S.exp || 0) + totalExp;
  S.gold = (S.gold || 0) + totalGold;
  S.hp = player.hp;
  S.mp = player.mp;
  
  V35_EventBus.emit('battle:victory', V35_BATTLE.rewards);
}

function v35_showBattleResult(result) {
  const overlay = document.getElementById('v35-battle-result');
  if (!overlay) return;
  
  const titleEl = overlay.querySelector('.battle-result-title');
  const ratingEl = overlay.querySelector('.battle-result-rating');
  const rewardsEl = overlay.querySelector('.battle-result-rewards');
  
  if (result === "victory") {
    titleEl.textContent = "胜利！";
    titleEl.className = "battle-result-title victory";
    ratingEl.textContent = V35_BATTLE.rewards.rating + " 评价";
    rewardsEl.innerHTML = `
      <div class="battle-result-reward-item gain">+${V35_BATTLE.rewards.exp} 经验值</div>
      <div class="battle-result-reward-item gain">+${V35_BATTLE.rewards.gold} 金币</div>
      ${V35_BATTLE.rewards.drops.length > 0 ? `<div class="battle-result-reward-item gain">获得: ${V35_BATTLE.rewards.drops.join(", ")}</div>` : ""}
      <div class="battle-result-reward-item">战斗回合: ${V35_BATTLE.rewards.turns}</div>
    `;
  } else {
    titleEl.textContent = "战败...";
    titleEl.className = "battle-result-title defeat";
    ratingEl.textContent = "";
    rewardsEl.innerHTML = `<div class="battle-result-reward-item loss">你倒下了...</div>`;
  }
  
  overlay.classList.add('active');
}

function v35_closeBattleResult() {
  const overlay = document.getElementById('v35-battle-result');
  if (overlay) overlay.classList.remove('active');
  v35_hideBattleUI();
  // 战斗消耗时间：普通战斗1时段，BOSS战1天
  if (V35_BATTLE.enemy && (V35_BATTLE.enemy.hp > 150 || V35_BATTLE.enemy.id.indexOf('boss') >= 0 || V35_BATTLE.enemy.id.indexOf('seal') >= 0)) {
    if (typeof advanceTime === 'function') advanceTime(4); // BOSS战消耗1天（4时段）
  } else {
    if (typeof advanceTime === 'function') advanceTime(1); // 普通战斗消耗1时段
  }
  // 跳转到战后节点
  var nextNode = V35_BATTLE.nextVictory;
  if (V35_BATTLE.result === "defeat") nextNode = V35_BATTLE.nextDefeat;
  if (V35_BATTLE.result === "flee") nextNode = V35_BATTLE.nextFlee;
  if (nextNode && N[nextNode]) {
    curNode = nextNode;
    document.getElementById('story').innerHTML = '';
    writeNext();
  }
}

function v35_showBattleUI() {
  let overlay = document.getElementById('v35-battle-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'v35-battle-overlay';
    overlay.className = 'battle-overlay';
    overlay.innerHTML = `
      <div class="battle-header">
        <span class="battle-turn" id="v35-battle-turn">第1回合</span>
        <span class="battle-objective" id="v35-battle-objective">目标：击败敌人</span>
        <div class="turn-order" id="v35-turn-order"></div>
      </div>
      <div class="battle-field">
        <div class="enemy-side" id="v35-enemy-side"></div>
        <div class="battle-log" id="v35-battle-log"></div>
        <div class="ally-side" id="v35-ally-side"></div>
      </div>
      <div class="battle-actions" id="v35-battle-actions">
        <button class="battle-btn attack" onclick="v35_playerAction('attack')">⚔️ 攻击</button>
        <button class="battle-btn skill" onclick="v35_playerAction('skill')">✨ 技能</button>
        <button class="battle-btn defend" onclick="v35_playerAction('defend')">🛡️ 防御</button>
        <button class="battle-btn flee" onclick="v35_playerAction('flee')">🏃 逃跑</button>
      </div>
      <div class="skill-panel" id="v35-skill-panel"></div>
      <div class="item-panel" id="v35-item-panel"></div>
      <div class="magic-chanting-overlay" id="v35-chanting-overlay">
    <div class="magic-chanting-box">
      <div class="magic-chanting-circle"></div>
      <div class="magic-chanting-text">正在吟唱...</div>
      <div class="magic-chanting-progress"><div class="magic-chanting-fill" style="width:0%"></div></div>
    </div>
  </div>
  <div class="battle-result-overlay" id="v35-battle-result">
        <div class="battle-result-box">
          <div class="battle-result-title"></div>
          <div class="battle-result-rating"></div>
          <div class="battle-result-rewards"></div>
          <button class="battle-btn" onclick="v35_closeBattleResult()">继续</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.classList.add('active');
  v35_updateBattleUI();
}

function v35_hideBattleUI() {
  const overlay = document.getElementById('v35-battle-overlay');
  if (overlay) overlay.classList.remove('active');
}

function v35_updateBattleUI() {
  // 回合数
  const turnEl = document.getElementById('v35-battle-turn');
  if (turnEl) turnEl.textContent = `第${V35_BATTLE.turn}回合`;
  
  // 行动顺序
  const orderEl = document.getElementById('v35-turn-order');
  if (orderEl) {
    orderEl.innerHTML = V35_BATTLE.turnOrder.slice(0, 5).map((c, i) => 
      `<div class="turn-order-icon ${i === V35_BATTLE.currentActor ? 'current' : ''}" title="${c.name}">${c.name.substring(0, 1)}</div>`
    ).join('');
  }
  
  // 敌人
  const enemySide = document.getElementById('v35-enemy-side');
  if (enemySide) {
    enemySide.innerHTML = V35_BATTLE.enemies.map((enemy, i) => `
      <div class="enemy-card ${enemy.hp <= 0 ? 'dead' : ''} ${V35_BATTLE.selectingTarget ? 'targetable' : ''}" 
           onclick="v35_selectTarget(${i})" data-index="${i}">
        <div class="enemy-name">${enemy.name}</div>
        <div class="enemy-hp-bar"><div class="enemy-hp-fill" style="width:${(enemy.hp/enemy.maxHp*100)}%"></div></div>
        <div class="enemy-hp-text">${enemy.hp}/${enemy.maxHp}</div>
        <div class="enemy-status">${enemy.status.map(s => `<span class="status-icon" title="${V35_STATUS_EFFECTS[s.id]?.name || s.id} ${s.duration}回合">${V35_STATUS_EFFECTS[s.id]?.icon || '?'}</span>`).join('')}</div>
      </div>
    `).join('');
  }
  
  // 我方
  const allySide = document.getElementById('v35-ally-side');
  if (allySide) {
    allySide.innerHTML = V35_BATTLE.allies.map((ally, i) => `
      <div class="ally-card ${V35_BATTLE.phase === 'player' && i === 0 ? 'active' : ''}">
        <div class="ally-name">${ally.name}</div>
        <div class="ally-bar"><div class="ally-hp-fill" style="width:${(ally.hp/ally.maxHp*100)}%"></div></div>
        <div class="ally-bar-text"><span>HP</span><span>${ally.hp}/${ally.maxHp}</span></div>
        <div class="ally-bar"><div class="ally-mp-fill" style="width:${(ally.mp/ally.maxMp*100)}%"></div></div>
        <div class="ally-bar-text"><span>MP</span><span>${ally.mp}/${ally.maxMp}</span></div>
        <div class="enemy-status">${ally.status.map(s => `<span class="status-icon" title="${V35_STATUS_EFFECTS[s.id]?.name || s.id}">${V35_STATUS_EFFECTS[s.id]?.icon || '?'}</span>`).join('')}</div>
      </div>
    `).join('');
  }
  
  // 行动按钮状态
  const actions = document.getElementById('v35-battle-actions');
  if (actions) {
    const isPlayerTurn = V35_BATTLE.phase === "player";
    actions.querySelectorAll('.battle-btn').forEach(btn => {
      btn.disabled = !isPlayerTurn || V35_BATTLE.selectingTarget;
    });
  }
}

function v35_showSkillPanel() {
  const panel = document.getElementById('v35-skill-panel');
  if (!panel) return;
  
  const player = V35_BATTLE.allies[0];
  const playerJob = S.job || "warrior";
  const availableSkills = Object.values(V35_SKILLS).filter(s => 
    s.job.includes("all") || s.job.includes(playerJob)
  ).concat(
    Object.values(V35_SPELLS).filter(s => 
      V35_MAGIC.knownSpells.includes(s.id) && 
      (s.job.includes("all") || s.job.includes(playerJob))
    )
  );
  
  panel.innerHTML = `
    <div style="color:#f0d68a;font-weight:bold;margin-bottom:10px;">选择技能</div>
    ${availableSkills.map(skill => {
      const canUse = player.mp >= skill.mp && (!player.cooldowns[skill.id] || player.cooldowns[skill.id] <= 0);
      const silenced = player.status.find(s => s.id === 'silence') && skill.type === 'magic';
      return `
        <div class="skill-item ${(!canUse || silenced) ? 'disabled' : ''}" 
             onclick="${canUse && !silenced ? `v35_selectSkill('${skill.id}')` : ''}">
          <div class="skill-name">${skill.name} ${skill.cooldown > 0 && player.cooldowns[skill.id] > 0 ? `(冷却${player.cooldowns[skill.id]})` : ''}</div>
          <div class="skill-info">${skill.desc} | <span class="skill-mp">MP ${skill.mp}</span></div>
        </div>
      `;
    }).join('')}
    <button class="battle-btn" style="margin-top:10px;width:100%;" onclick="v35_hideSkillPanel()">取消</button>
  `;
  panel.classList.add('active');
}

function v35_hideSkillPanel() {
  const panel = document.getElementById('v35-skill-panel');
  if (panel) panel.classList.remove('active');
}

function v35_battleLog(text, type = "info") {
  V35_BATTLE.log.push({ text, type });
  const logEl = document.getElementById('v35-battle-log');
  if (logEl) {
    const line = document.createElement('div');
    line.className = 'log-' + type;
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }
}

function v35_showDamagePopup(target, amount, type) {
  const enemyCards = document.querySelectorAll('.enemy-card');
  const allyCards = document.querySelectorAll('.ally-card');
  let card = null;
  
  if (target.isPlayer) {
    card = allyCards[0];
  } else {
    const idx = V35_BATTLE.enemies.findIndex(e => e.uid === target.uid);
    if (idx >= 0) card = enemyCards[idx];
  }
  
  if (card) {
    const popup = document.createElement('div');
    popup.className = 'battle-damage-popup ' + type;
    popup.textContent = amount;
    popup.style.left = '50%';
    popup.style.top = '30%';
    card.style.position = 'relative';
    card.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }
}

// 注册战斗模块
V35_ModuleManager.register('battle', {
  name: '战斗系统',
  version: '1.0',
  dependencies: ['core'],
  onLoad() { V35_EventBus.emit('battle:loaded'); }
});
V35_ModuleManager.load('battle');

console.log('[V35] 战斗系统核心已加载');

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', v35_arch_init);
} else {
  v35_arch_init();
}


/* ============================================================
   v35 魔法体系核心
   七系魔法 / 组合 / 吟唱 / 材料 / 禁术 / 反噬
   ============================================================ */

// ========== 七系魔法定义 ==========
const V35_MAGIC_SCHOOLS = {
  fire: {id:"fire", name:"火系", color:"#ff6a3a", desc:"掌控火焰与热量，高伤害但消耗大", stat:"INT"},
  water: {id:"water", name:"水系", color:"#3a8aff", desc:"掌控水与冰，控制+治疗", stat:"INT"},
  wind: {id:"wind", name:"风系", color:"#8affc8", desc:"掌控风与雷，高速+多段伤害", stat:"AGI"},
  earth: {id:"earth", name:"土系", color:"#a07a3a", desc:"掌控土与石，防御+控制", stat:"CON"},
  light: {id:"light", name:"光系", color:"#ffd700", desc:"掌控光与神圣，治疗+净化", stat:"SPR"},
  dark: {id:"dark", name:"暗系", color:"#8a3aff", desc:"掌控暗与影，高伤害+诅咒", stat:"SPR"},
  soul: {id:"soul", name:"灵魂系", color:"#ff8aff", desc:"掌控灵魂与精神，最神秘也最危险", stat:"SPR"}
};

// ========== 魔法数据 ==========
const V35_SPELLS = {
  // 火系
  fire_spark: {id:"fire_spark", name:"火花术", school:"fire", tier:1, mp:5, castTime:0, power:0.8, element:"fire", target:"single", desc:"基础火焰攻击", components:[], job:["mage","sorcerer","warlock","all"]},
  fire_fireball: {id:"fire_fireball", name:"火球术", school:"fire", tier:1, mp:15, castTime:0, power:1.5, element:"fire", target:"single", desc:"发射火球造成火焰伤害", components:["fire_crystal"], job:["mage","sorcerer","warlock"]},
  fire_flame_wave: {id:"fire_flame_wave", name:"烈焰波", school:"fire", tier:2, mp:25, castTime:1, power:1.8, element:"fire", target:"all", effect:{burn:2}, desc:"烈焰波攻击所有敌人，可能燃烧", components:["fire_crystal"], job:["mage","sorcerer"]},
  fire_meteor: {id:"fire_meteor", name:"陨石术", school:"fire", tier:3, mp:50, castTime:2, power:3.0, element:"fire", target:"all", effect:{burn:3}, desc:"召唤陨石轰击所有敌人", components:["fire_crystal","earth_essence"], job:["mage","sorcerer"]},
  fire_shield: {id:"fire_shield", name:"火焰护盾", school:"fire", tier:2, mp:20, castTime:0, power:0, element:"fire", target:"self", effect:{shield:3}, desc:"火焰护盾吸收伤害", components:["fire_crystal"], job:["mage","sorcerer"]},
  // 水系
  water_bolt: {id:"water_bolt", name:"水弹术", school:"water", tier:1, mp:5, castTime:0, power:0.8, element:"water", target:"single", desc:"基础水属性攻击", components:[], job:["mage","priest","all"]},
  water_ice_lance: {id:"water_ice_lance", name:"冰锥术", school:"water", tier:1, mp:12, castTime:0, power:1.3, element:"water", target:"single", effect:{slow:2}, desc:"冰锥伤害+减速2回合", components:["water_crystal"], job:["mage","sorcerer"]},
  water_heal: {id:"water_heal", name:"治疗术", school:"water", tier:1, mp:15, castTime:0, power:1.5, element:"water", target:"ally", effect:"heal", desc:"恢复目标HP", components:["water_crystal"], job:["mage","priest","paladin"]},
  water_blizzard: {id:"water_blizzard", name:"暴风雪", school:"water", tier:3, mp:45, castTime:2, power:2.0, element:"water", target:"all", effect:{freeze:1}, desc:"暴风雪造成伤害并可能冰冻", components:["water_crystal","wind_essence"], job:["mage","sorcerer"]},
  water_tidal: {id:"water_tidal", name:"潮汐术", school:"water", tier:2, mp:30, castTime:1, power:1.6, element:"water", target:"all", desc:"潮汐冲击所有敌人", components:["water_crystal"], job:["mage","sorcerer"]},
  // 风系
  wind_gust: {id:"wind_gust", name:"风刃术", school:"wind", tier:1, mp:5, castTime:0, power:0.9, element:"wind", target:"single", desc:"基础风属性攻击", components:[], job:["mage","ranger","all"]},
  wind_lightning: {id:"wind_lightning", name:"闪电术", school:"wind", tier:1, mp:14, castTime:0, power:1.4, element:"wind", target:"single", desc:"闪电造成风属性伤害", components:["wind_crystal"], job:["mage","sorcerer"]},
  wind_tornado: {id:"wind_tornado", name:"龙卷风", school:"wind", tier:2, mp:28, castTime:1, power:1.7, element:"wind", target:"all", effect:{blind:1}, desc:"龙卷风攻击所有敌人，可能致盲", components:["wind_crystal"], job:["mage","sorcerer"]},
  wind_thunderstorm: {id:"wind_thunderstorm", name:"雷暴术", school:"wind", tier:3, mp:48, castTime:2, power:2.2, element:"wind", target:"all", effect:{stun:1}, desc:"雷暴造成伤害并可能眩晕", components:["wind_crystal","water_essence"], job:["mage","sorcerer"]},
  wind_step: {id:"wind_step", name:"风步术", school:"wind", tier:1, mp:8, castTime:0, power:0, element:"wind", target:"self", effect:{speed_up:2}, desc:"提升速度2回合", components:[], job:["mage","ranger","assassin"]},
  // 土系
  earth_shot: {id:"earth_shot", name:"石弹术", school:"earth", tier:1, mp:5, castTime:0, power:0.9, element:"earth", target:"single", desc:"基础土属性攻击", components:[], job:["mage","all"]},
  earth_wall: {id:"earth_wall", name:"土墙术", school:"earth", tier:1, mp:12, castTime:0, power:0, element:"earth", target:"self", effect:{shield:2}, desc:"土墙提供护盾", components:["earth_crystal"], job:["mage","paladin"]},
  earth_stone_skin: {id:"earth_stone_skin", name:"石肤术", school:"earth", tier:2, mp:20, castTime:0, power:0, element:"earth", target:"self", effect:{defense_up:3}, desc:"防御提升50%，3回合", components:["earth_crystal"], job:["mage","paladin","warrior"]},
  earth_earthquake: {id:"earth_earthquake", name:"地震术", school:"earth", tier:3, mp:50, castTime:2, power:2.0, element:"earth", target:"all", effect:{stun:1}, desc:"地震造成伤害并可能眩晕", components:["earth_crystal","fire_essence"], job:["mage","sorcerer"]},
  earth_petrify: {id:"earth_petrify", name:"石化术", school:"earth", tier:3, mp:40, castTime:1, power:0, element:"earth", target:"single", effect:{freeze:3}, desc:"将目标石化3回合", components:["earth_crystal"], job:["mage","sorcerer"]},
  // 光系
  light_ray: {id:"light_ray", name:"光线术", school:"light", tier:1, mp:8, castTime:0, power:1.0, element:"light", target:"single", desc:"基础光属性攻击", components:[], job:["priest","paladin","all"]},
  light_holy: {id:"light_holy", name:"圣光术", school:"light", tier:2, mp:18, castTime:0, power:1.6, element:"light", target:"single", desc:"神圣光芒造成光属性伤害", components:["light_crystal"], job:["priest","paladin"]},
  light_blessing: {id:"light_blessing", name:"祝福术", school:"light", tier:1, mp:12, castTime:0, power:0, element:"light", target:"ally", effect:{attack_up:3}, desc:"目标攻击提升30%，3回合", components:[], job:["priest","paladin"]},
  light_smite: {id:"light_smite", name:"惩击术", school:"light", tier:2, mp:25, castTime:1, power:2.0, element:"light", target:"single", desc:"强力神圣伤害", components:["light_crystal"], job:["priest","paladin"]},
  light_resurrection: {id:"light_resurrection", name:"复活术", school:"light", tier:3, mp:80, castTime:2, power:0, element:"light", target:"ally", effect:"revive", desc:"复活倒下的队友", components:["light_crystal","soul_essence"], job:["priest"]},
  // 暗系
  dark_bolt: {id:"dark_bolt", name:"暗影弹", school:"dark", tier:1, mp:8, castTime:0, power:1.1, element:"dark", target:"single", desc:"基础暗属性攻击", components:[], job:["warlock","sorcerer","all"]},
  dark_curse: {id:"dark_curse", name:"诅咒术", school:"dark", tier:1, mp:15, castTime:0, power:0, element:"dark", target:"single", effect:{attack_down:3}, desc:"目标攻击降低30%，3回合", components:["dark_crystal"], job:["warlock","sorcerer"]},
  dark_shadow_strike: {id:"dark_shadow_strike", name:"暗影突袭", school:"dark", tier:2, mp:22, castTime:0, power:1.8, element:"dark", target:"single", desc:"暗影造成高伤害", components:["dark_crystal"], job:["warlock","assassin"]},
  dark_soul_drain: {id:"dark_soul_drain", name:"吸魂术", school:"dark", tier:2, mp:25, castTime:1, power:1.5, element:"dark", target:"single", effect:"lifesteal", desc:"造成伤害并恢复自身HP", components:["dark_crystal"], job:["warlock","sorcerer"]},
  dark_nightmare: {id:"dark_nightmare", name:"噩梦术", school:"dark", tier:3, mp:40, castTime:1, power:0, element:"dark", target:"single", effect:{stun:2, san_damage:20}, desc:"使目标陷入噩梦，眩晕并损失SAN", components:["dark_crystal","soul_essence"], job:["warlock"]},
  // 灵魂系
  soul_sight: {id:"soul_sight", name:"灵魂视觉", school:"soul", tier:1, mp:10, castTime:0, power:0, element:"soul", target:"self", effect:"see_souls", desc:"看到灵魂和隐藏事物", components:[], job:["soul_mage","priest"]},
  soul_mind_read: {id:"soul_mind_read", name:"读心术", school:"soul", tier:2, mp:20, castTime:1, power:0, element:"soul", target:"single", effect:"read_mind", desc:"读取目标思想", components:["soul_crystal"], job:["soul_mage"]},
  soul_bind: {id:"soul_bind", name:"灵魂绑定", school:"soul", tier:2, mp:30, castTime:1, power:0, element:"soul", target:"single", effect:"bind", desc:"绑定目标灵魂，无法逃跑", components:["soul_crystal"], job:["soul_mage","warlock"]},
  soul_astral: {id:"soul_astral", name:"星界投射", school:"soul", tier:3, mp:50, castTime:2, power:0, element:"soul", target:"self", effect:"astral", desc:"灵魂出窍，可穿透障碍", components:["soul_crystal","light_essence"], job:["soul_mage"]},
  soul_memory_edit: {id:"soul_memory_edit", name:"记忆修改", school:"soul", tier:3, mp:60, castTime:2, power:0, element:"soul", target:"single", effect:"edit_memory", desc:"修改目标记忆", components:["soul_crystal","dark_essence"], job:["soul_mage"]}
};

// ========== 禁术 ==========
const V35_FORBIDDEN_SPELLS = {
  fire_world_fire: {id:"fire_world_fire", name:"焚世之火", school:"fire", mp:100, castTime:3, power:5.0, element:"fire", target:"all", backlash:{hp:-50, san:-20}, forbiddenBy:["light_church","elf_kingdom"], desc:"召唤足以焚烧世界的火焰"},
  water_absolute_zero: {id:"water_absolute_zero", name:"绝对零度", school:"water", mp:90, castTime:3, power:4.0, element:"water", target:"all", effect:{freeze:5}, backlash:{hp:-30, san:-15}, forbiddenBy:["light_church","dwarf_kingdom"], desc:"将一切冻结到绝对零度"},
  light_judgment: {id:"light_judgment", name:"神圣审判", school:"light", mp:120, castTime:3, power:6.0, element:"light", target:"all", backlash:{san:-30}, forbiddenBy:[], desc:"只有教皇才能使用的终极神圣魔法"},
  dark_abyss_gate: {id:"dark_abyss_gate", name:"深渊之门", school:"dark", mp:80, castTime:2, power:0, element:"dark", target:"self", effect:"summon_abyss", backlash:{abyss_corruption:20, san:-25}, forbiddenBy:["light_church","empire","elf_kingdom","dwarf_kingdom"], desc:"打开深渊之门，召唤深渊生物"},
  soul_destroy: {id:"soul_destroy", name:"灭魂术", school:"soul", mp:100, castTime:2, power:10.0, element:"soul", target:"single", effect:"instant_kill", backlash:{san:-40, hp:-30}, forbiddenBy:["light_church","watchers","empire"], desc:"彻底毁灭目标灵魂"},
  soul_reality_rewrite: {id:"soul_reality_rewrite", name:"现实改写", school:"soul", mp:200, castTime:5, power:0, element:"soul", target:"self", effect:"rewrite_reality", backlash:{san:-50, hp:-50, permanent_loss:1}, forbiddenBy:["all"], desc:"传说中的禁忌魔法，可改写现实"}
};

// ========== 魔法材料 ==========
const V35_MAGIC_MATERIALS = {
  fire_crystal: {id:"fire_crystal", name:"火晶石", element:"fire", rarity:"common", price:10, desc:"蕴含火焰力量的水晶"},
  water_crystal: {id:"water_crystal", name:"水晶石", element:"water", rarity:"common", price:10, desc:"蕴含水之力量的水晶"},
  wind_crystal: {id:"wind_crystal", name:"风晶石", element:"wind", rarity:"common", price:10, desc:"蕴含风之力量的水晶"},
  earth_crystal: {id:"earth_crystal", name:"土晶石", element:"earth", rarity:"common", price:10, desc:"蕴含土之力量的水晶"},
  light_crystal: {id:"light_crystal", name:"光晶石", element:"light", rarity:"uncommon", price:25, desc:"蕴含光明力量的水晶"},
  dark_crystal: {id:"dark_crystal", name:"暗晶石", element:"dark", rarity:"uncommon", price:25, desc:"蕴含暗影力量的水晶"},
  soul_crystal: {id:"soul_crystal", name:"灵魂晶石", element:"soul", rarity:"rare", price:50, desc:"蕴含灵魂力量的稀有水晶"},
  fire_essence: {id:"fire_essence", name:"火焰精华", element:"fire", rarity:"rare", price:40, desc:"浓缩的火焰精华"},
  water_essence: {id:"water_essence", name:"水之精华", element:"water", rarity:"rare", price:40, desc:"浓缩的水之精华"},
  wind_essence: {id:"wind_essence", name:"风之精华", element:"wind", rarity:"rare", price:40, desc:"浓缩的风之精华"},
  earth_essence: {id:"earth_essence", name:"土之精华", element:"earth", rarity:"rare", price:40, desc:"浓缩的土之精华"},
  light_essence: {id:"light_essence", name:"光明精华", element:"light", rarity:"epic", price:80, desc:"浓缩的光明精华"},
  dark_essence: {id:"dark_essence", name:"暗影精华", element:"dark", rarity:"epic", price:80, desc:"浓缩的暗影精华"},
  soul_essence: {id:"soul_essence", name:"灵魂精华", element:"soul", rarity:"legendary", price:150, desc:"极其稀有的灵魂精华"}
};

// ========== 魔法状态 ==========
let V35_MAGIC = {
  knownSpells: [],
  magicLevel: {fire:0, water:0, wind:0, earth:0, light:0, dark:0, soul:0},
  magicExp: {fire:0, water:0, wind:0, earth:0, light:0, dark:0, soul:0},
  materials: {},
  forbiddenKnown: [],
  forbiddenUsed: [],
  currentSchool: "fire",
  chanting: null
};

// ========== 魔法核心函数 ==========
function v35_initMagic() {
  if (typeof S === 'undefined' || S === null) return;
  if (!S.magic) {
    S.magic = {
      knownSpells: [],
      magicLevel: {fire:1, water:1, wind:1, earth:1, light:1, dark:0, soul:0},
      magicExp: {fire:0, water:0, wind:0, earth:0, light:0, dark:0, soul:0},
      materials: {fire_crystal:3, water_crystal:3},
      forbiddenKnown: [],
      forbiddenUsed: []
    };
  }
  V35_MAGIC = { ...V35_MAGIC, ...S.magic };
  console.log('[V35] 魔法系统已初始化');
}

function v35_learnSpell(spellId) {
  const spell = V35_SPELLS[spellId] || V35_FORBIDDEN_SPELLS[spellId];
  if (!spell) return false;
  if (V35_MAGIC.knownSpells.includes(spellId)) return false;
  
  // 检查魔法等级
  if (V35_MAGIC.magicLevel[spell.school] < spell.tier) {
    v35_battleLog(`需要${V35_MAGIC_SCHOOLS[spell.school].name}等级${spell.tier}才能学习`, "system");
    return false;
  }
  
  V35_MAGIC.knownSpells.push(spellId);
  S.magic.knownSpells = [...V35_MAGIC.knownSpells];
  
  if (V35_FORBIDDEN_SPELLS[spellId]) {
    V35_MAGIC.forbiddenKnown.push(spellId);
    S.magic.forbiddenKnown = [...V35_MAGIC.forbiddenKnown];
  }
  
  V35_EventBus.emit('magic:learn', { spellId });
  return true;
}

function v35_canCastSpell(spellId) {
  const spell = V35_SPELLS[spellId] || V35_FORBIDDEN_SPELLS[spellId];
  if (!spell) return {can:false, reason:"魔法不存在"};
  if (!V35_MAGIC.knownSpells.includes(spellId)) return {can:false, reason:"未学习该魔法"};
  
  const player = V35_BATTLE.allies ? V35_BATTLE.allies[0] : {mp:S.mp||50};
  if (player.mp < spell.mp) return {can:false, reason:"MP不足"};
  
  // 检查材料
  if (spell.components) {
    for (const mat of spell.components) {
      if (!V35_MAGIC.materials[mat] || V35_MAGIC.materials[mat] <= 0) {
        return {can:false, reason:`缺少材料: ${V35_MAGIC_MATERIALS[mat]?.name || mat}`};
      }
    }
  }
  
  // 检查沉默
  if (V35_BATTLE.active && V35_BATTLE.allies[0].status.find(s => s.id === 'silence')) {
    return {can:false, reason:"被沉默"};
  }
  
  return {can:true};
}

function v35_castSpell(spellId, target = null) {
  const spell = V35_SPELLS[spellId] || V35_FORBIDDEN_SPELLS[spellId];
  if (!spell) return null;
  
  const check = v35_canCastSpell(spellId);
  if (!check.can) {
    v35_battleLog(`无法施放: ${check.reason}`, "system");
    return null;
  }
  
  // 吟唱
  if (spell.castTime > 0) {
    v35_startChanting(spell, target);
    return null;
  }
  
  return v35_executeSpell(spell, target);
}

function v35_executeSpell(spell, target) {
  const player = V35_BATTLE.active ? V35_BATTLE.allies[0] : {mp:S.mp, maxMp:S.maxMp, int:S.attrs?.INT||10};
  
  // 消耗MP
  player.mp = Math.max(0, player.mp - spell.mp);
  if (V35_BATTLE.active) S.mp = player.mp;
  
  // 消耗材料
  if (spell.components) {
    for (const mat of spell.components) {
      V35_MAGIC.materials[mat] = (V35_MAGIC.materials[mat] || 0) - 1;
    }
    S.magic.materials = {...V35_MAGIC.materials};
  }
  
  // 增加魔法经验
  V35_MAGIC.magicExp[spell.school] = (V35_MAGIC.magicExp[spell.school] || 0) + 10;
  v35_checkMagicLevelUp(spell.school);
  
  // 禁术反噬
  if (V35_FORBIDDEN_SPELLS[spell.id]) {
    v35_magicBacklash(spell);
    V35_MAGIC.forbiddenUsed.push(spell.id);
    S.magic.forbiddenUsed = [...V35_MAGIC.forbiddenUsed];
  }
  
  // 战斗中使用
  if (V35_BATTLE.active && target) {
    v35_executeSkill(player, {...spell, id:spell.id, name:spell.name, type:"magic"}, target);
  }
  
  V35_EventBus.emit('magic:cast', { spellId: spell.id, target });
  return spell;
}

function v35_startChanting(spell, target) {
  V35_MAGIC.chanting = { spell, target, progress: 0, total: spell.castTime };
  
  const overlay = document.getElementById('v35-chanting-overlay');
  if (overlay) {
    overlay.classList.add('active');
    const text = overlay.querySelector('.magic-chanting-text');
    if (text) text.textContent = `正在吟唱 ${spell.name}...`;
  }
  
  // 模拟吟唱进度（v42：rAF 驱动，无 rAF 时降级 setTimeout）
  let progress = 0;
  const STEPS = 10;
  const STEP_MS = spell.castTime * 300;
  let _lastTs = null;
  const _raf = window.requestAnimationFrame || function(cb){ return setTimeout(function(){ cb(Date.now()); }, 33); };
  function chantTick(ts){
    if(_lastTs === null) _lastTs = ts;
    if(ts - _lastTs >= STEP_MS){
      _lastTs = ts;
      progress += 1 / STEPS;
      const fill = document.querySelector('.magic-chanting-fill');
      if (fill) fill.style.width = (progress * 100) + '%';
      if (progress >= 1) {
        if (overlay) overlay.classList.remove('active');
        v35_executeSpell(spell, target);
        return;
      }
    }
    _raf(chantTick);
  }
  _raf(chantTick);
}

function v35_interruptChant() {
  if (V35_MAGIC.chanting) {
    const spell = V35_MAGIC.chanting.spell;
    V35_MAGIC.chanting = null;
    const overlay = document.getElementById('v35-chanting-overlay');
    if (overlay) overlay.classList.remove('active');
    v35_battleLog(`吟唱被打断！损失 ${Math.floor(spell.mp/2)} MP`, "system");
    const player = V35_BATTLE.allies[0];
    player.mp = Math.max(0, player.mp - Math.floor(spell.mp/2));
    return true;
  }
  return false;
}

function v35_magicBacklash(spell) {
  if (!spell.backlash) return;
  
  const player = V35_BATTLE.active ? V35_BATTLE.allies[0] : {hp:S.hp, maxHp:S.maxHp};
  
  if (spell.backlash.hp) {
    const dmg = Math.abs(spell.backlash.hp);
    player.hp = Math.max(1, player.hp - dmg);
    if (V35_BATTLE.active) S.hp = player.hp;
    v35_battleLog(`禁术反噬！损失 ${dmg} HP`, "damage");
  }
  if (spell.backlash.san) {
    S.san = Math.max(0, (S.san || 100) - Math.abs(spell.backlash.san));
    v35_battleLog(`禁术反噬！损失 ${Math.abs(spell.backlash.san)} SAN`, "damage");
  }
  if (spell.backlash.abyss_corruption) {
    S.abyssCorruption = (S.abyssCorruption || 0) + spell.backlash.abyss_corruption;
    v35_battleLog(`深渊侵蚀增加 ${spell.backlash.abyss_corruption}%！`, "damage");
  }
  
  V35_EventBus.emit('magic:backlash', { spellId: spell.id, backlash: spell.backlash });
}

function v35_checkMagicLevelUp(school) {
  const exp = V35_MAGIC.magicExp[school] || 0;
  const level = V35_MAGIC.magicLevel[school] || 0;
  const expNeeded = level * 50;
  
  if (exp >= expNeeded && level < 10) {
    V35_MAGIC.magicLevel[school] = level + 1;
    V35_MAGIC.magicExp[school] = exp - expNeeded;
    S.magic.magicLevel = {...V35_MAGIC.magicLevel};
    v35_battleLog(`${V35_MAGIC_SCHOOLS[school].name}等级提升到 ${level+1}！`, "system");
    V35_EventBus.emit('magic:levelup', { school, level: level+1 });
  }
}

function v35_getSpellsBySchool(school) {
  return Object.values(V35_SPELLS).filter(s => s.school === school);
}

function v35_openMagicPanel() {
  v35_initMagic();
  
  let panel = document.getElementById('v35-magic-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'v35-magic-panel';
    panel.className = 'magic-panel';
    document.body.appendChild(panel);
  }
  
  v35_renderMagicPanel();
  panel.classList.add('active');
}

function v35_closeMagicPanel() {
  const panel = document.getElementById('v35-magic-panel');
  if (panel) panel.classList.remove('active');
}

function v35_renderMagicPanel() {
  const panel = document.getElementById('v35-magic-panel');
  if (!panel) return;
  
  const school = V35_MAGIC.currentSchool;
  const schoolData = V35_MAGIC_SCHOOLS[school];
  const spells = v35_getSpellsBySchool(school);
  
  panel.innerHTML = `
    <div class="magic-panel-header">
      <span class="magic-panel-title">✨ 魔法书</span>
      <button class="magic-panel-close" onclick="v35_closeMagicPanel()">✕</button>
    </div>
    <div class="magic-school-tabs">
      ${Object.values(V35_MAGIC_SCHOOLS).map(s => 
        `<div class="magic-school-tab ${s.id} ${s.id === school ? 'active' : ''}" onclick="V35_MAGIC.currentSchool='${s.id}'; v35_renderMagicPanel()">${s.name} Lv.${V35_MAGIC.magicLevel[s.id]||0}</div>`
      ).join('')}
    </div>
    <div class="magic-level-bar">
      <span class="magic-level-label">${schoolData.name}</span>
      <div class="magic-level-track"><div class="magic-level-fill ${school}" style="width:${Math.min(100, (V35_MAGIC.magicExp[school]||0)/((V35_MAGIC.magicLevel[school]||1)*50)*100)}%"></div></div>
      <span style="color:#8a9bb0;font-size:12px;">${V35_MAGIC.magicExp[school]||0}/${(V35_MAGIC.magicLevel[school]||1)*50}</span>
    </div>
    <div class="magic-spell-list">
      ${spells.map(spell => {
        const known = V35_MAGIC.knownSpells.includes(spell.id);
        const canLearn = (V35_MAGIC.magicLevel[school]||0) >= spell.tier;
        return `
          <div class="magic-spell-card ${!known ? 'locked' : ''}" onclick="${known ? `v35_closeMagicPanel(); v35_selectSpell('${spell.id}')` : (canLearn ? `v35_learnSpell('${spell.id}'); v35_renderMagicPanel()` : '')}">
            <div class="magic-spell-name ${school}">${spell.name} ${known ? '✓' : (canLearn ? '(可学习)' : '(需要等级'+spell.tier+')')}</div>
            <div class="magic-spell-info">
              <span>MP: ${spell.mp}</span>
              <span>威力: ${spell.power || '-'}</span>
              <span>吟唱: ${spell.castTime}回合</span>
              ${spell.components ? `<span>材料: ${spell.components.map(c=>V35_MAGIC_MATERIALS[c]?.name||c).join(',')}</span>` : ''}
            </div>
            <div class="magic-spell-desc">${spell.desc}</div>
          </div>
        `;
      }).join('')}
    </div>
    ${V35_MAGIC.forbiddenKnown.length > 0 ? `
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid #8a3a3a;">
        <div style="color:#ff8a8a;font-weight:bold;margin-bottom:8px;">⚠️ 禁术</div>
        ${V35_MAGIC.forbiddenKnown.map(id => {
          const spell = V35_FORBIDDEN_SPELLS[id];
          return `<div class="magic-spell-card forbidden" onclick="v35_closeMagicPanel(); v35_selectSpell('${id}')">
            <div class="magic-spell-name ${spell.school}">${spell.name}</div>
            <div class="magic-spell-desc">${spell.desc}</div>
          </div>`;
        }).join('')}
      </div>
    ` : ''}
  `;
}

function v35_selectSpell(spellId) {
  if (V35_BATTLE.active) {
    v35_selectSkill(spellId);
  } else {
    v35_battleLog(`准备施放: ${V35_SPELLS[spellId]?.name || V35_FORBIDDEN_SPELLS[spellId]?.name}`, "system");
  }
}

// 注册魔法模块
V35_ModuleManager.register('magic', {
  name: '魔法系统',
  version: '1.0',
  dependencies: ['core', 'battle'],
  onLoad() { V35_EventBus.emit('magic:loaded'); }
});
V35_ModuleManager.load('magic');

console.log('[V35] 魔法体系核心已加载');


/* ============================================================
   v35 政治势力核心
   9大势力 / 加入 / 任务 / 声望 / 晋升 / 战争 / 外交
   ============================================================ */

// ========== 9大势力定义 ==========
const V35_FACTIONS = {
  light_church: {
    id:"light_church", name:"光明教会", type:"religion", capital:"圣城",
    leader:"教皇", ideology:"秩序/光明",
    initialRep:0,
    joinRequirement:{faith:30, no_dark_magic:true},
    ranks:["信徒","助祭","神父","主教","大主教","枢机","教皇"],
    skills:["priest_holy_light","priest_blessing","priest_smite"],
    enemies:["eclipse_society","abyss_cult"],
    allies:["empire"],
    description:"大陆最大的宗教组织，信奉光明神，掌握净化令和审判骑士团。",
    color:"#ffd700"
  },
  eclipse_society: {
    id:"eclipse_society", name:"暗蚀会", type:"secret", capital:"未知",
    leader:"暗蚀之主", ideology:"自由/深渊",
    initialRep:-20,
    joinRequirement:{chaos:20},
    ranks:["外围","成员","骨干","执事","司长","副主","暗蚀之主"],
    skills:["dark_shadow_strike","dark_soul_drain","dark_nightmare"],
    enemies:["light_church","watchers"],
    allies:["abyss_cult"],
    description:"追求深渊力量的秘密组织，认为七印是枷锁，原初之物应该被解放。",
    color:"#8a3aff"
  },
  watchers: {
    id:"watchers", name:"守望者", type:"secret", capital:"未知",
    leader:"守望者之长", ideology:"平衡/守护",
    initialRep:0,
    joinRequirement:{karma:30, watcher_approval:true},
    ranks:["观察者","记录者","守护者","裁决者","守望者"],
    skills:["soul_sight","soul_mind_read"],
    enemies:["eclipse_society"],
    allies:[],
    description:"超越势力的神秘组织，记录历史，维护七印平衡，成员身份保密。",
    color:"#7ab8ff"
  },
  empire: {
    id:"empire", name:"东部王国", type:"nation", capital:"承天山",
    leader:"皇帝", ideology:"秩序/武力",
    initialRep:0,
    joinRequirement:{military:20},
    ranks:["士兵","队长","百夫长","千夫长","将军","元帅","大元帅"],
    skills:["warrior_heavy","warrior_whirlwind","warrior_guard"],
    enemies:["orc_horde"],
    allies:["light_church"],
    description:"大陆东部的军事强国，军队训练有素，皇帝集权统治。",
    color:"#ff6a3a"
  },
  free_cities: {
    id:"free_cities", name:"自由城邦联盟", type:"nation", capital:"交汇城",
    leader:"议会", ideology:"自由/商业",
    initialRep:10,
    joinRequirement:{gold:100},
    ranks:["市民","商人","行会成员","议员","议长"],
    skills:["wind_step"],
    enemies:[],
    allies:["dwarf_kingdom"],
    description:"以交汇城为中心的商业联盟，崇尚自由和财富，商会势力强大。",
    color:"#8affc8"
  },
  elf_kingdom: {
    id:"elf_kingdom", name:"精灵王国", type:"nation", capital:"银叶城",
    leader:"精灵王", ideology:"自然/传统",
    initialRep:0,
    joinRequirement:{nature:20},
    ranks:["平民","战士","法师","长老","王室"],
    skills:["water_heal","wind_lightning"],
    enemies:["orc_horde"],
    allies:[],
    description:"古老的精灵王国，与世界树共生，长寿且保守，不信任外族。",
    color:"#7fd68f"
  },
  dwarf_kingdom: {
    id:"dwarf_kingdom", name:"矮人王国", type:"nation", capital:"铁峰堡",
    leader:"矮人王", ideology:"工艺/荣誉",
    initialRep:0,
    joinRequirement:{craft:20},
    ranks:["学徒","工匠","大师","匠师","长老","国王"],
    skills:["earth_stone_skin","earth_wall"],
    enemies:[],
    allies:["free_cities"],
    description:"地下的锻造王国，矮人以工艺和战斗闻名，永恒熔炉是他们的心脏。",
    color:"#a07a3a"
  },
  orc_horde: {
    id:"orc_horde", name:"兽人王庭", type:"nation", capital:"兽人王庭",
    leader:"大汗", ideology:"力量/荣耀",
    initialRep:-10,
    joinRequirement:{strength:30},
    ranks:["战士","勇士","百夫长","千夫长","将军","大汗"],
    skills:["warrior_cleave","warrior_heavy"],
    enemies:["empire","elf_kingdom"],
    allies:["abyss_cult"],
    description:"草原上的游牧战士联盟，以力量为尊，萨满传承古老的灵魂魔法。",
    color:"#ff8a5a"
  },
  abyss_cult: {
    id:"abyss_cult", name:"深渊教派", type:"cult", capital:"死亡沙漠",
    leader:"深渊先知", ideology:"混沌/毁灭",
    initialRep:-30,
    joinRequirement:{abyss_power:30},
    ranks:["信众","狂信徒","祭司","深渊使者","先知"],
    skills:["dark_abyss_gate","dark_curse"],
    enemies:["light_church","watchers"],
    allies:["eclipse_society","orc_horde"],
    description:"崇拜深渊力量的邪教，认为世界应该被深渊吞噬，成员多有变异。",
    color:"#ff3a3a"
  }
};

// ========== 势力任务 ==========
const V35_FACTION_QUESTS = {
  light_church: [
    {id:"lc_1", name:"净化令执行", rankReq:1, type:"combat", reward:{rep:15, gold:50}, desc:"抓捕隐藏的灵魂法师"},
    {id:"lc_2", name:"朝圣之旅", rankReq:0, type:"travel", reward:{rep:15, faith:10}, desc:"前往圣城朝圣"},
    {id:"lc_3", name:"教会税收", rankReq:2, type:"diplomacy", reward:{rep:20, gold:100}, desc:"协助教会收取什一税"},
    {id:"lc_4", name:"异端审判", rankReq:3, type:"combat", reward:{rep:25, gold:80}, desc:"审判被指控的异端"},
    {id:"lc_5", name:"圣物寻回", rankReq:4, type:"exploration", reward:{rep:30, item:"holy_relic"}, desc:"寻找失落的圣物"}
  ],
  eclipse_society: [
    {id:"es_1", name:"情报收集", rankReq:0, type:"stealth", reward:{rep:15, gold:40}, desc:"收集教会的情报"},
    {id:"es_2", name:"物资走私", rankReq:1, type:"trade", reward:{rep:15, gold:80}, desc:"走私违禁魔法物品"},
    {id:"es_3", name:"暗杀任务", rankReq:2, type:"combat", reward:{rep:25, gold:100}, desc:"暗杀教会的关键人物"},
    {id:"es_4", name:"深渊仪式", rankReq:3, type:"ritual", reward:{rep:30, abyss_power:10}, desc:"协助进行深渊召唤仪式"},
    {id:"es_5", name:"策反主教", rankReq:4, type:"diplomacy", reward:{rep:40, gold:200}, desc:"策反教会的主教"}
  ],
  empire: [
    {id:"em_1", name:"边境巡逻", rankReq:0, type:"combat", reward:{rep:10, gold:30}, desc:"在边境巡逻，抵御兽人"},
    {id:"em_2", name:"军需运输", rankReq:1, type:"escort", reward:{rep:15, gold:60}, desc:"护送军需物资到前线"},
    {id:"em_3", name:"兽人突袭", rankReq:2, type:"combat", reward:{rep:20, gold:80}, desc:"突袭兽人前哨"},
    {id:"em_4", name:"守城战", rankReq:3, type:"combat", reward:{rep:30, gold:120}, desc:"参与守城战"},
    {id:"em_5", name:"远征将军", rankReq:4, type:"command", reward:{rep:40, gold:200}, desc:"指挥军队远征"}
  ],
  free_cities: [
    {id:"fc_1", name:"商队护卫", rankReq:0, type:"escort", reward:{rep:10, gold:50}, desc:"护卫商队安全抵达"},
    {id:"fc_2", name:"市场调查", rankReq:1, type:"investigation", reward:{rep:15, gold:40}, desc:"调查市场价格波动"},
    {id:"fc_3", name:"商业谈判", rankReq:2, type:"diplomacy", reward:{rep:20, gold:100}, desc:"与外族商人谈判"},
    {id:"fc_4", name:"打击海盗", rankReq:3, type:"combat", reward:{rep:25, gold:150}, desc:"清剿南方海域的海盗"},
    {id:"fc_5", name:"商会会长", rankReq:4, type:"management", reward:{rep:40, gold:300}, desc:"管理商会的日常运营"}
  ],
  watchers: [
    {id:"wt_1", name:"历史记录", rankReq:0, type:"investigation", reward:{rep:10, knowledge:5}, desc:"记录当前的历史事件"},
    {id:"wt_2", name:"七印监测", rankReq:1, type:"exploration", reward:{rep:15, knowledge:10}, desc:"监测七印的状态"},
    {id:"wt_3", name:"暗蚀会追踪", rankReq:2, type:"stealth", reward:{rep:20, gold:60}, desc:"追踪暗蚀会的行动"},
    {id:"wt_4", name:"平衡维护", rankReq:3, type:"diplomacy", reward:{rep:30}, desc:"维护势力间的平衡"},
    {id:"wt_5", name:"深渊调查", rankReq:4, type:"exploration", reward:{rep:40, knowledge:20}, desc:"深入调查深渊的真相"}
  ]
};

// ========== 战争事件 ==========
const V35_WARS = {
  empire_orc_war: {
    id:"empire_orc_war", name:"帝国-兽人战争",
    participants:["empire","orc_horde"],
    trigger:{year:2, season:"spring"},
    phases:["宣战","边境冲突","主力决战","停战"],
    playerChoices:["join_empire","join_orc","mediate","profit","neutral"]
  },
  church_eclipse_war: {
    id:"church_eclipse_war", name:"教会-暗蚀会暗战",
    participants:["light_church","eclipse_society"],
    trigger:{year:1, season:"autumn"},
    phases:["暗中对抗","公开冲突","全面清洗","转入地下"],
    playerChoices:["join_church","join_eclipse","mediate","neutral"]
  }
};

// ========== 势力状态 ==========
let V35_FACTION_STATE = {
  joined: null,
  rank: 0,
  reputation: {},
  quests: [],
  completedQuests: [],
  territoryOwned: [],
  politicalCapital: 0,
  wars: [],
  alliances: [],
  enemies: [],
  factionRelations: {}
};

// ========== 势力核心函数 ==========
function v35_initFaction() {
  if (typeof S === 'undefined' || S === null) return;
  if (!S.faction) {
    S.faction = {
      joined: null,
      rank: 0,
      reputation: {},
      quests: [],
      completedQuests: [],
      territoryOwned: [],
      politicalCapital: 0,
      wars: [],
      alliances: [],
      enemies: []
    };
    // 初始化各势力声望
    for (const fid in V35_FACTIONS) {
      S.faction.reputation[fid] = V35_FACTIONS[fid].initialRep;
    }
  }
  V35_FACTION_STATE = { ...V35_FACTION_STATE, ...S.faction };
  console.log('[V35] 势力系统已初始化');
}

function v35_getRep(factionId) {
  return V35_FACTION_STATE.reputation[factionId] || 0;
}

function v35_changeRep(factionId, amount) {
  const current = v35_getRep(factionId);
  const newRep = Math.max(-100, Math.min(100, current + amount));
  V35_FACTION_STATE.reputation[factionId] = newRep;
  S.faction.reputation[factionId] = newRep;
  
  // 声望等级变化
  const oldLevel = v35_getRepLevel(current);
  const newLevel = v35_getRepLevel(newRep);
  if (oldLevel !== newLevel) {
    V35_EventBus.emit('faction:rep_change', { factionId, oldLevel, newLevel });
  }
  
  return newRep;
}

function v35_getRepLevel(rep) {
  if (rep >= 80) return "崇敬";
  if (rep >= 50) return "尊敬";
  if (rep >= 20) return "友好";
  if (rep >= -20) return "中立";
  if (rep >= -50) return "冷淡";
  if (rep >= -80) return "敌对";
  return "仇恨";
}

function v35_joinFaction(factionId) {
  const faction = V35_FACTIONS[factionId];
  if (!faction) return false;
  if (V35_FACTION_STATE.joined) return false;
  
  // 检查加入条件
  const req = faction.joinRequirement;
  if (req.faith && (S.attrs?.SPR || 0) < req.faith) return false;
  if (req.gold && (S.gold || 0) < req.gold) return false;
  
  V35_FACTION_STATE.joined = factionId;
  V35_FACTION_STATE.rank = 0;
  S.faction.joined = factionId;
  S.faction.rank = 0;
  
  v35_changeRep(factionId, 20);
  
  V35_EventBus.emit('faction:join', { factionId });
  return true;
}

function v35_leaveFaction(reason = "自愿离开") {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  v35_changeRep(factionId, -30);
  V35_FACTION_STATE.joined = null;
  V35_FACTION_STATE.rank = 0;
  S.faction.joined = null;
  S.faction.rank = 0;
  
  V35_EventBus.emit('faction:leave', { factionId, reason });
  return true;
}

function v35_promoteRank() {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  const faction = V35_FACTIONS[factionId];
  const currentRank = V35_FACTION_STATE.rank;
  if (currentRank >= faction.ranks.length - 1) return false;
  
  // 晋升条件：声望+政治资本
  const repNeeded = (currentRank + 1) * 25;
  const capitalNeeded = (currentRank + 1) * 10;
  
  if (v35_getRep(factionId) < repNeeded) return false;
  if (V35_FACTION_STATE.politicalCapital < capitalNeeded) return false;
  
  V35_FACTION_STATE.politicalCapital -= capitalNeeded;
  V35_FACTION_STATE.rank = currentRank + 1;
  S.faction.rank = currentRank + 1;
  S.faction.politicalCapital = V35_FACTION_STATE.politicalCapital;
  
  V35_EventBus.emit('faction:promote', { factionId, newRank: currentRank + 1 });
  return true;
}

function v35_acceptQuest(questId) {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  const quests = V35_FACTION_QUESTS[factionId] || [];
  const quest = quests.find(q => q.id === questId);
  if (!quest) return false;
  if (quest.rankReq > V35_FACTION_STATE.rank) return false;
  
  V35_FACTION_STATE.quests.push(questId);
  S.faction.quests = [...V35_FACTION_STATE.quests];
  
  // 设置任务截止日期（7-30天，根据任务类型）
  if (!S.questDeadlines) S.questDeadlines = {};
  var deadline = 7 + Math.floor(Math.random() * 23); // 7-30天
  if (quest.type === 'combat') deadline = 10 + Math.floor(Math.random() * 10);
  if (quest.type === 'diplomacy') deadline = 15 + Math.floor(Math.random() * 15);
  S.questDeadlines[questId] = { acceptedDay: S.time ? S.time.totalDays : 0, deadlineDays: deadline };
  
  V35_EventBus.emit('faction:quest_accept', { questId, deadline });
  return true;
}

function v35_completeQuest(questId, success = true) {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  const idx = V35_FACTION_STATE.quests.indexOf(questId);
  if (idx < 0) return false;
  
  V35_FACTION_STATE.quests.splice(idx, 1);
  V35_FACTION_STATE.completedQuests.push(questId);
  S.faction.quests = [...V35_FACTION_STATE.quests];
  S.faction.completedQuests = [...V35_FACTION_STATE.completedQuests];
  
  if (success) {
    const quests = V35_FACTION_QUESTS[factionId] || [];
    const quest = quests.find(q => q.id === questId);
    if (quest && quest.reward) {
      if (quest.reward.rep) v35_changeRep(factionId, quest.reward.rep);
      if (quest.reward.gold) S.gold = (S.gold || 0) + quest.reward.gold;
      if (quest.reward.politicalCapital) {
        V35_FACTION_STATE.politicalCapital += quest.reward.politicalCapital;
        S.faction.politicalCapital = V35_FACTION_STATE.politicalCapital;
      }
    }
  }
  
  V35_EventBus.emit('faction:quest_complete', { questId, success });
  return true;
}

function v35_getAvailableQuests() {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return [];
  
  const quests = V35_FACTION_QUESTS[factionId] || [];
  return quests.filter(q => 
    q.rankReq <= V35_FACTION_STATE.rank && 
    !V35_FACTION_STATE.quests.includes(q.id) &&
    !V35_FACTION_STATE.completedQuests.includes(q.id)
  );
}

function v35_startWar(warId, side) {
  const war = V35_WARS[warId];
  if (!war) return false;
  
  V35_FACTION_STATE.wars.push({ warId, side, phase: 0 });
  S.faction.wars = [...V35_FACTION_STATE.wars];
  
  // 加入一方会影响声望
  if (side === "join_empire") {
    v35_changeRep("empire", 30);
    v35_changeRep("orc_horde", -30);
  } else if (side === "join_orc") {
    v35_changeRep("orc_horde", 30);
    v35_changeRep("empire", -30);
  } else if (side === "join_church") {
    v35_changeRep("light_church", 30);
    v35_changeRep("eclipse_society", -30);
  } else if (side === "join_eclipse") {
    v35_changeRep("eclipse_society", 30);
    v35_changeRep("light_church", -30);
  }
  
  V35_EventBus.emit('faction:war_start', { warId, side });
  return true;
}

function v35_advanceWarPhase(warId) {
  const warState = V35_FACTION_STATE.wars.find(w => w.warId === warId);
  if (!warState) return false;
  
  const war = V35_WARS[warId];
  if (warState.phase < war.phases.length - 1) {
    warState.phase++;
    S.faction.wars = [...V35_FACTION_STATE.wars];
    V35_EventBus.emit('faction:war_phase', { warId, phase: warState.phase });
    return true;
  }
  return false;
}

function v35_diplomacyAction(action, targetFaction) {
  if (!V35_FACTION_STATE.joined) return false;
  if (V35_FACTION_STATE.rank < 3) return false; // 需要高阶职位
  
  const myFaction = V35_FACTION_STATE.joined;
  
  if (action === "ally") {
    if (!V35_FACTION_STATE.alliances.includes(targetFaction)) {
      V35_FACTION_STATE.alliances.push(targetFaction);
      S.faction.alliances = [...V35_FACTION_STATE.alliances];
      v35_changeRep(targetFaction, 20);
      V35_EventBus.emit('faction:ally', { myFaction, targetFaction });
      return true;
    }
  } else if (action === "declare_war") {
    if (!V35_FACTION_STATE.enemies.includes(targetFaction)) {
      V35_FACTION_STATE.enemies.push(targetFaction);
      S.faction.enemies = [...V35_FACTION_STATE.enemies];
      v35_changeRep(targetFaction, -50);
      V35_EventBus.emit('faction:declare_war', { myFaction, targetFaction });
      return true;
    }
  } else if (action === "peace") {
    const idx = V35_FACTION_STATE.enemies.indexOf(targetFaction);
    if (idx >= 0) {
      V35_FACTION_STATE.enemies.splice(idx, 1);
      S.faction.enemies = [...V35_FACTION_STATE.enemies];
      v35_changeRep(targetFaction, 10);
      V35_EventBus.emit('faction:peace', { myFaction, targetFaction });
      return true;
    }
  }
  
  return false;
}

// ========== 势力面板 ==========
function v35_openFactionPanel() {
  v35_initFaction();
  
  let panel = document.getElementById('v35-faction-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'v35-faction-panel';
    panel.className = 'faction-panel';
    document.body.appendChild(panel);
  }
  
  v35_renderFactionPanel('overview');
  panel.classList.add('active');
}

function v35_closeFactionPanel() {
  const panel = document.getElementById('v35-faction-panel');
  if (panel) panel.classList.remove('active');
}

function v35_renderFactionPanel(tab = 'overview') {
  const panel = document.getElementById('v35-faction-panel');
  if (!panel) return;
  
  const myFaction = V35_FACTION_STATE.joined ? V35_FACTIONS[V35_FACTION_STATE.joined] : null;
  
  panel.innerHTML = `
    <div class="faction-header">
      <span class="faction-title">🏛️ 势力与政治</span>
      <button class="faction-close" onclick="v35_closeFactionPanel()">✕</button>
    </div>
    <div class="faction-tabs">
      <button class="faction-tab ${tab==='overview'?'active':''}" onclick="v35_renderFactionPanel('overview')">总览</button>
      <button class="faction-tab ${tab==='factions'?'active':''}" onclick="v35_renderFactionPanel('factions')">势力列表</button>
      ${myFaction ? `<button class="faction-tab ${tab==='quests'?'active':''}" onclick="v35_renderFactionPanel('quests')">势力任务</button>` : ''}
      ${myFaction ? `<button class="faction-tab ${tab==='diplomacy'?'active':''}" onclick="v35_renderFactionPanel('diplomacy')">外交</button>` : ''}
      <button class="faction-tab ${tab==='wars'?'active':''}" onclick="v35_renderFactionPanel('wars')">战争</button>
    </div>
    <div id="faction-tab-content">
      ${v35_renderFactionTab(tab)}
    </div>
  `;
}

function v35_renderFactionTab(tab) {
  if (tab === 'overview') {
    const myFaction = V35_FACTION_STATE.joined ? V35_FACTIONS[V35_FACTION_STATE.joined] : null;
    return `
      <div style="text-align:center;padding:20px;">
        ${myFaction ? `
          <div style="font-size:24px;color:${myFaction.color};font-weight:bold;margin-bottom:10px;">${myFaction.name}</div>
          <div style="color:#f0d68a;margin-bottom:10px;">职位: <span class="faction-rank">${myFaction.ranks[V35_FACTION_STATE.rank]}</span></div>
          <div style="color:#b8c5d6;font-size:14px;margin-bottom:20px;">${myFaction.description}</div>
          <div style="display:flex;gap:20px;justify-content:center;margin-bottom:20px;">
            <div><span style="color:#8a9bb0;">政治资本:</span> <span style="color:#f0d68a;">${V35_FACTION_STATE.politicalCapital}</span></div>
            <div><span style="color:#8a9bb0;">已完成任务:</span> <span style="color:#7fd68f;">${V35_FACTION_STATE.completedQuests.length}</span></div>
          </div>
          <button class="battle-btn" onclick="if(v35_promoteRank()){v35_renderFactionPanel('overview')}">晋升职位</button>
        ` : `
          <div style="color:#b8c5d6;font-size:16px;margin-bottom:20px;">你尚未加入任何势力</div>
          <div style="color:#8a9bb0;font-size:13px;">在"势力列表"中查看并加入势力</div>
        `}
      </div>
    `;
  }
  
  if (tab === 'factions') {
    return `
      <div class="faction-list">
        ${Object.values(V35_FACTIONS).map(f => {
          const rep = v35_getRep(f.id);
          const isJoined = V35_FACTION_STATE.joined === f.id;
          const isEnemy = V35_FACTION_STATE.enemies.includes(f.id);
          return `
            <div class="faction-card ${isJoined?'joined':''} ${isEnemy?'enemy':''}">
              <div class="faction-name">
                <span style="color:${f.color};">${f.name}</span>
                ${isJoined ? '<span class="faction-rank">已加入</span>' : ''}
                ${isEnemy ? '<span style="color:#ff8a8a;font-size:12px;">敌对</span>' : ''}
              </div>
              <div class="faction-rep-bar">
                <span class="faction-rep-label">声望</span>
                <div class="faction-rep-track"><div class="faction-rep-fill ${rep>=0?'positive':'negative'}" style="width:${Math.abs(rep)}%"></div></div>
                <span class="faction-rep-value">${rep} (${v35_getRepLevel(rep)})</span>
              </div>
              <div class="faction-desc">${f.description}</div>
              <div style="margin-top:8px;font-size:12px;color:#8a9bb0;">
                盟友: ${f.allies.map(a=>V35_FACTIONS[a]?.name||a).join(', ') || '无'} | 
                敌对: ${f.enemies.map(e=>V35_FACTIONS[e]?.name||e).join(', ') || '无'}
              </div>
              ${!isJoined && !V35_FACTION_STATE.joined ? `
                <button class="battle-btn" style="margin-top:8px;padding:6px 16px;font-size:13px;" onclick="if(v35_joinFaction('${f.id}')){v35_renderFactionPanel('factions')}">加入势力</button>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  if (tab === 'quests' && V35_FACTION_STATE.joined) {
    const available = v35_getAvailableQuests();
    const active = V35_FACTION_STATE.quests;
    return `
      <div style="margin-bottom:16px;">
        <div style="color:#f0d68a;font-weight:bold;margin-bottom:8px;">进行中的任务</div>
        ${active.length > 0 ? active.map(qid => {
          const faction = V35_FACTIONS[V35_FACTION_STATE.joined];
          const quest = (V35_FACTION_QUESTS[V35_FACTION_STATE.joined]||[]).find(q=>q.id===qid);
          var deadlineText = '';
          if (S.questDeadlines && S.questDeadlines[qid]) {
            var d = S.questDeadlines[qid];
            var passed = (S.time ? S.time.totalDays : 0) - d.acceptedDay;
            var remaining = d.deadlineDays - passed;
            if (remaining > 0) deadlineText = '<span style="color:#7fd68f;">剩余' + remaining + '天</span>';
            else deadlineText = '<span style="color:#ff8a8a;">已过期！</span>';
          }
          return quest ? `
            <div class="faction-quest-item">
              <div class="faction-quest-title">${quest.name} ${deadlineText}</div>
              <div class="faction-quest-desc">${quest.desc}</div>
              <button class="battle-btn" style="margin-top:6px;padding:4px 12px;font-size:12px;" onclick="if(v35_completeQuest('${qid}')){v35_renderFactionPanel('quests')}">完成任务</button>
            </div>
          ` : '';
        }).join('') : '<div style="color:#8a9bb0;">暂无进行中的任务</div>'}
      </div>
      <div>
        <div style="color:#f0d68a;font-weight:bold;margin-bottom:8px;">可接任务</div>
        ${available.length > 0 ? available.map(quest => `
          <div class="faction-quest-item">
            <div class="faction-quest-title">${quest.name}</div>
            <div class="faction-quest-desc">${quest.desc}</div>
            <div class="faction-quest-reward">奖励: 声望+${quest.reward?.rep||0} ${quest.reward?.gold?`金币+${quest.reward.gold}`:''}</div>
            <button class="battle-btn" style="margin-top:6px;padding:4px 12px;font-size:12px;" onclick="if(v35_acceptQuest('${quest.id}')){v35_renderFactionPanel('quests')}">接取任务</button>
          </div>
        `).join('') : '<div style="color:#8a9bb0;">暂无可接任务</div>'}
      </div>
    `;
  }
  
  if (tab === 'diplomacy' && V35_FACTION_STATE.joined) {
    return `
      <div style="color:#8a9bb0;font-size:13px;margin-bottom:12px;">需要职位达到"${V35_FACTIONS[V35_FACTION_STATE.joined].ranks[3]||'高阶'}"才能进行外交</div>
      <div>
        ${Object.values(V35_FACTIONS).filter(f=>f.id!==V35_FACTION_STATE.joined).map(f => {
          const isAlly = V35_FACTION_STATE.alliances.includes(f.id);
          const isEnemy = V35_FACTION_STATE.enemies.includes(f.id);
          return `
            <div class="faction-diplomacy-item">
              <span class="faction-diplomacy-name">${f.name}</span>
              <span class="faction-diplomacy-status ${isAlly?'alliance':isEnemy?'enemy':'neutral'}">
                ${isAlly?'盟友':isEnemy?'敌对':'中立'}
              </span>
              <div style="display:flex;gap:4px;">
                ${!isAlly && !isEnemy ? `<button class="battle-btn" style="padding:2px 8px;font-size:11px;" onclick="v35_diplomacyAction('ally','${f.id}')">结盟</button>` : ''}
                ${!isEnemy ? `<button class="battle-btn" style="padding:2px 8px;font-size:11px;" onclick="v35_diplomacyAction('declare_war','${f.id}')">宣战</button>` : ''}
                ${isEnemy ? `<button class="battle-btn" style="padding:2px 8px;font-size:11px;" onclick="v35_diplomacyAction('peace','${f.id}')">议和</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  if (tab === 'wars') {
    return `
      ${V35_FACTION_STATE.wars.length > 0 ? V35_FACTION_STATE.wars.map(w => {
        const war = V35_WARS[w.warId];
        return war ? `
          <div class="faction-war-banner">
            <div class="faction-war-title">⚔️ ${war.name}</div>
            <div class="faction-war-phase">当前阶段: ${war.phases[w.phase]} | 阵营: ${w.side}</div>
            <button class="battle-btn" style="margin-top:8px;padding:6px 16px;font-size:13px;" onclick="if(v35_advanceWarPhase('${w.warId}')){v35_renderFactionPanel('wars')}">推进战争</button>
          </div>
        ` : '';
      }).join('') : '<div style="color:#8a9bb0;text-align:center;padding:20px;">当前没有进行中的战争</div>'}
      <div style="margin-top:20px;">
        <div style="color:#f0d68a;font-weight:bold;margin-bottom:8px;">可参与的战争</div>
        ${Object.values(V35_WARS).filter(w=>!V35_FACTION_STATE.wars.find(sw=>sw.warId===w.id)).map(war => `
          <div class="faction-quest-item">
            <div class="faction-quest-title">${war.name}</div>
            <div class="faction-quest-desc">参与方: ${war.participants.map(p=>V35_FACTIONS[p]?.name||p).join(' vs ')}</div>
            <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
              ${war.playerChoices.map(choice => `
                <button class="battle-btn" style="padding:4px 10px;font-size:11px;" onclick="if(v35_startWar('${war.id}','${choice}')){v35_renderFactionPanel('wars')}">${choice}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  return '<div style="color:#8a9bb0;">暂无内容</div>';
}

// 注册势力模块
V35_ModuleManager.register('faction', {
  name: '势力系统',
  version: '1.0',
  dependencies: ['core'],
  onLoad() { V35_EventBus.emit('faction:loaded'); }
});
V35_ModuleManager.load('faction');

console.log('[V35] 政治势力核心已加载');


N["city_free"] = function(){ return {
  text:function(){
    var base = ["交汇城的街道上人来人往，商会的旗帜在风中猎猎作响。这里是自由城邦的心脏——一切交易、情报和阴谋的交汇点。"];
    if(S.flags && S.flags.hlj_clue_found) base.push("◆黄林晶遗产线索已开启");
    if(S.faction && S.faction.joined === "free_cities") base.push("◆你是自由城邦的一员");
    base.push("交汇城的中心广场，永远有人。");base.push("杂耍艺人抛着火球，算命先生摇着签筒，几个商贩扯着嗓子叫卖。你从人群里挤过去，肩膀被撞了好几下，没人道歉，也没人计较——在这里，这就是打招呼的方式。");base.push("你在一家馄饨摊前停下来。老板是个满脸油光的胖子，见你站住，头也不抬：「大碗还是小碗？」");base.push("「大碗。」你说。他利落地下了锅，又补了一句：「加辣不加？」");base.push("你吃着馄饨，看着广场上的人。有人笑着，有人皱着眉，有人攥着口袋里的铜板，不知道明天在哪。这座城市，把所有的活法和死法，都摆在明面上，让每个人自己挑。");base.push("你喝完最后一口汤，放下碗。老板收了碗，忽然压低声音：「小子，最近城里有人查『来历不明的东西』。你要是有什么不该带的东西——趁早处理。」");base.push("你谢过他，走进人流。那句话，像一根刺，扎在你心里，跟着你走过了整条街。");return base;
  } /*v45inj:city_free*/,
  place:"交汇城",
  options:[{t:"前往集市", go:"arrive_free_jishi", effect:{time:1}},
    {t:"前往教会区", go:"arrive_free_jiaohui", effect:{time:1}},
    {t:"前往工会区", go:"arrive_free_gonghui", effect:{time:1}},
    {t:"前往灰港", go:"arrive_free_huigang", effect:{time:1}},
    {t:"查看冒险日志", go:"adventure_log", effect:{time:0}},
    {t:"势力招募（加入各大势力）", go:"faction_recruit_hub", effect:{time:0}},
    {t:"离开交汇城", go:"slow_travel_start", effect:{time:0}}, {"t": "去逛夜市", "go": "city_free_night_market"}]
} /*v45opt:city_free*/;}


N["travel"] = function(){ return {
  text:function(){
    return ["你站在路口，前方是通往大陆各处的道路。海风从南方吹来，带着盐的气息；北方的山脉在远处若隐若现。"];
  },
  place:"旅途",
  options:[
    {t:"前往北方（铁门关）", go:"travel_north_start", effect:{time:0}},
    {t:"前往南方（港城）", go:"travel_south_start", effect:{time:0}},
    {t:"前往东方（承天山）", go:"travel_east_start", effect:{time:0}},
    {t:"前往西方（西海岸）", go:"travel_west_start", effect:{time:0}},
    {t:"乘坐飞空艇", go:"airship_travel", effect:{time:0}},
    {t:"慢旅行（沉浸式）", go:"slow_travel_start", effect:{time:0}}
  ]
};}


/* ============================================================
   v36 补充敌人数据（七印守护者/暗蚀会/学院/势力/随机遭遇/终局BOSS）
   ============================================================ */
const V36_ENEMIES = {
  // ===== 七印守护者 =====
  seal_1_guardian: {id:"seal_1_guardian", name:"第一印守护者·石巨人", hp:120, maxHp:120, mp:30, atk:18, def:15, spd:8, skills:["heavy_smash","earth_quake","stone_skin"], status:[], aiType:"balanced", expReward:80, goldReward:50, loot:["earth_crystal"], desc:"沉睡千年的石巨人，守护着第一印的封印"},
  seal_2_corruptor: {id:"seal_2_corruptor", name:"第二印·深渊侵蚀者", hp:100, maxHp:100, mp:60, atk:22, def:10, spd:14, skills:["corruption_blast","dark_curse","life_drain"], status:[], aiType:"aggressive", expReward:90, goldReward:60, loot:["dark_crystal"], desc:"被深渊侵蚀的存在，身体不断扭曲变形"},
  seal_3_renegade: {id:"seal_3_renegade", name:"第三印·精灵叛逃者", hp:90, maxHp:90, mp:80, atk:16, def:12, spd:20, skills:["wind_blade","nature_wrath","heal_self"], status:[], aiType:"strategic", expReward:100, goldReward:70, loot:["wind_crystal","water_crystal"], desc:"背叛精灵族的古老法师，掌握着自然与风的力量"},
  seal_4_golem: {id:"seal_4_golem", name:"第四印·熔炉魔像", hp:150, maxHp:150, mp:20, atk:25, def:25, spd:5, skills:["lava_spew","molten_fist","overheat"], status:[], aiType:"aggressive", expReward:110, goldReward:80, loot:["fire_crystal","earth_essence"], desc:"永恒熔炉中诞生的魔像，全身流淌着岩浆"},
  seal_5_kraken: {id:"seal_5_kraken", name:"第五印·深海巨妖", hp:140, maxHp:140, mp:50, atk:20, def:18, spd:10, skills:["tentacle_whip","water_cannon","ink_cloud"], status:[], aiType:"balanced", expReward:120, goldReward:90, loot:["water_crystal","water_essence"], desc:"从深海苏醒的巨妖，触手足以撕裂战船"},
  seal_6_guardian: {id:"seal_6_guardian", name:"第六印·时光守卫", hp:110, maxHp:110, mp:100, atk:15, def:14, spd:25, skills:["time_stop","temporal_blade","rewind"], status:[], aiType:"strategic", expReward:130, goldReward:100, loot:["soul_crystal"], desc:"存在于时间夹缝中的守卫，能操控时间流速"},
  seal_7_projection: {id:"seal_7_projection", name:"第七印·原初之物投影", hp:200, maxHp:200, mp:150, atk:30, def:20, spd:15, skills:["primal_blast","reality_warp","cosmic_horror","annihilation"], status:[], aiType:"desperate", expReward:200, goldReward:200, loot:["soul_essence","light_essence","dark_essence"], desc:"原初之物在世间的投影，仅仅是存在就足以扭曲现实"},
  // ===== 暗蚀会敌人 =====
  eclipse_thug: {id:"eclipse_thug", name:"暗蚀会外围成员", hp:50, maxHp:50, mp:10, atk:12, def:8, spd:10, skills:["basic_attack","dirty_fight"], status:[], aiType:"aggressive", expReward:20, goldReward:15, loot:[], desc:"暗蚀会的底层打手，手段肮脏"},
  eclipse_officer: {id:"eclipse_officer", name:"暗蚀会骨干", hp:70, maxHp:70, mp:30, atk:16, def:10, spd:14, skills:["shadow_strike","dark_bolt","smoke_bomb"], status:[], aiType:"balanced", expReward:40, goldReward:30, loot:["dark_crystal"], desc:"暗蚀会的中层骨干，精通暗影魔法"},
  eclipse_director: {id:"eclipse_director", name:"暗蚀会司长", hp:100, maxHp:100, mp:60, atk:20, def:14, spd:16, skills:["shadow_assault","soul_drain","dark_nightmare","escape"], status:[], aiType:"strategic", expReward:80, goldReward:60, loot:["dark_crystal","dark_essence"], desc:"暗蚀会五司长之一，每一位都有着恐怖的实力"},
  eclipse_traitor: {id:"eclipse_traitor", name:"背叛者", hp:80, maxHp:80, mp:40, atk:18, def:12, spd:18, skills:["backstab","poison_blade","vanish"], status:[], aiType:"aggressive", expReward:60, goldReward:50, loot:[], desc:"曾经的同伴，如今刀刃相向"},
  eclipse_pope: {id:"eclipse_pope", name:"暗蚀之主", hp:250, maxHp:250, mp:200, atk:35, def:22, spd:18, skills:["abyss_gate","soul_destroy","dark_wave","eclipse_final"], status:[], aiType:"desperate", expReward:300, goldReward:500, loot:["dark_essence","soul_essence"], desc:"暗蚀会的创立者，追求深渊力量的极致"},
  // ===== 学院敌人 =====
  academy_duel: {id:"academy_duel", name:"同学（决斗）", hp:60, maxHp:60, mp:20, atk:14, def:10, spd:12, skills:["basic_attack","student_spell"], status:[], aiType:"balanced", expReward:15, goldReward:0, loot:[], desc:"学院中的同学，因矛盾而决斗"},
  library_guard: {id:"library_guard", name:"禁书区守卫", hp:80, maxHp:80, mp:10, atk:16, def:18, spd:8, skills:["heavy_smash","guard_stance"], status:[], aiType:"balanced", expReward:30, goldReward:20, loot:[], desc:"禁书区的魔法守卫，忠诚地执行着守护职责"},
  spy_professor: {id:"spy_professor", name:"卧底教授", hp:90, maxHp:90, mp:70, atk:18, def:14, spd:14, skills:["dark_bolt","shadow_strike","teleport","counter_spell"], status:[], aiType:"strategic", expReward:70, goldReward:80, loot:["dark_crystal"], desc:"隐藏在学院中的暗蚀会卧底，暴露后孤注一掷"},
  graduation_boss: {id:"graduation_boss", name:"毕业试炼·幻象", hp:120, maxHp:120, mp:80, atk:22, def:16, spd:16, skills:["illusion_strike","mind_break","reality_shatter"], status:[], aiType:"desperate", expReward:100, goldReward:100, loot:["soul_crystal"], desc:"毕业试炼中的终极幻象，考验学生的全部实力"},
  // ===== 势力敌人 =====
  inquisitor: {id:"inquisitor", name:"审判骑士", hp:90, maxHp:90, mp:30, atk:20, def:16, spd:12, skills:["holy_smite","shield_bash","purify"], status:[], aiType:"aggressive", expReward:50, goldReward:40, loot:["light_crystal"], desc:"教会的审判骑士，执行净化令的执行者"},
  orc_warrior: {id:"orc_warrior", name:"兽人战士", hp:100, maxHp:100, mp:5, atk:24, def:12, spd:10, skills:["war_cry","heavy_axe","berserk"], status:[], aiType:"aggressive", expReward:40, goldReward:25, loot:[], desc:"草原上的兽人战士，力量惊人"},
  empire_soldier: {id:"empire_soldier", name:"帝国士兵", hp:70, maxHp:70, mp:5, atk:15, def:14, spd:10, skills:["spear_thrust","shield_wall","formation"], status:[], aiType:"balanced", expReward:25, goldReward:20, loot:[], desc:"东部王国的正规军，训练有素"},
  dwarf_guard: {id:"dwarf_guard", name:"矮人守卫", hp:110, maxHp:110, mp:5, atk:18, def:22, spd:6, skills:["hammer_smash","stone_stance","defend"], status:[], aiType:"balanced", expReward:35, goldReward:30, loot:["earth_crystal"], desc:"铁峰堡的矮人守卫，坚不可摧"},
  elf_ranger: {id:"elf_ranger", name:"精灵游侠", hp:65, maxHp:65, mp:30, atk:17, def:10, spd:22, skills:["arrow_shot","wind_step","entangle"], status:[], aiType:"strategic", expReward:45, goldReward:35, loot:["wind_crystal"], desc:"银叶城的精灵游侠，箭无虚发"},
  abyss_cultist: {id:"abyss_cultist", name:"深渊狂信徒", hp:60, maxHp:60, mp:50, atk:14, def:8, spd:14, skills:["abyss_blast","mad_laughter","self_mutilate"], status:[], aiType:"desperate", expReward:35, goldReward:20, loot:["dark_crystal"], desc:"崇拜深渊的狂信徒，不惜以自身为祭品"},
  // ===== 随机遭遇敌人 =====
  bandit: {id:"bandit", name:"强盗", hp:45, maxHp:45, mp:0, atk:12, def:7, spd:12, skills:["basic_attack","steal"], status:[], aiType:"aggressive", expReward:15, goldReward:20, loot:[], desc:"拦路抢劫的强盗"},
  wolf: {id:"wolf", name:"野狼", hp:35, maxHp:35, mp:0, atk:10, def:5, spd:18, skills:["bite","howl"], status:[], aiType:"aggressive", expReward:10, goldReward:0, loot:[], desc:"荒野中的野狼"},
  giant_spider: {id:"giant_spider", name:"巨型蜘蛛", hp:50, maxHp:50, mp:10, atk:14, def:8, spd:16, skills:["poison_bite","web_shot"], status:[], aiType:"aggressive", expReward:20, goldReward:5, loot:[], desc:"洞穴中的巨型蜘蛛，带有剧毒"},
  skeleton: {id:"skeleton", name:"骷髅兵", hp:40, maxHp:40, mp:0, atk:11, def:10, spd:8, skills:["bone_strike","rusty_sword"], status:[], aiType:"balanced", expReward:15, goldReward:10, loot:[], desc:"古墓中复活的骷髅兵"},
  ghost: {id:"ghost", name:"怨灵", hp:55, maxHp:55, mp:40, atk:13, def:6, spd:20, skills:["soul_drain","haunt","phase"], status:[], aiType:"strategic", expReward:25, goldReward:15, loot:["soul_crystal"], desc:"徘徊不去的怨灵"},
  goblin: {id:"goblin", name:"哥布林", hp:30, maxHp:30, mp:5, atk:9, def:5, spd:14, skills:["basic_attack","sneak_attack"], status:[], aiType:"aggressive", expReward:8, goldReward:10, loot:[], desc:"狡猾的小型生物"},
  troll: {id:"troll", name:"巨魔", hp:120, maxHp:120, mp:0, atk:22, def:14, spd:6, skills:["smash","regenerate"], status:[], aiType:"aggressive", expReward:50, goldReward:30, loot:[], desc:"拥有再生能力的巨魔"},
  dark_knight: {id:"dark_knight", name:"暗黑骑士", hp:100, maxHp:100, mp:20, atk:22, def:18, spd:12, skills:["dark_slash","aura_of_dread","lifesteal"], status:[], aiType:"balanced", expReward:60, goldReward:50, loot:["dark_crystal"], desc:"堕落的骑士，被黑暗吞噬"},
  mimic: {id:"mimic", name:"宝箱怪", hp:70, maxHp:70, mp:10, atk:18, def:20, spd:4, skills:["bite","trap","treasure_lure"], status:[], aiType:"strategic", expReward:40, goldReward:80, loot:[], desc:"伪装成宝箱的怪物"},
  slime: {id:"slime", name:"史莱姆", hp:25, maxHp:25, mp:5, atk:6, def:8, spd:5, skills:["acid_splash","divide"], status:[], aiType:"balanced", expReward:5, goldReward:3, loot:[], desc:"最常见的低级怪物"},
  // ===== 终局BOSS =====
  final_boss_seal: {id:"final_boss_seal", name:"七印崩坏·混沌之主", hp:300, maxHp:300, mp:200, atk:40, def:25, spd:18, skills:["chaos_blast","seal_break","reality_collapse","final_judgment"], status:[], aiType:"desperate", expReward:500, goldReward:1000, loot:["soul_essence","light_essence","dark_essence"], desc:"七印全部崩坏后诞生的混沌之主"},
  final_boss_eclipse: {id:"final_boss_eclipse", name:"暗蚀之主·完全体", hp:280, maxHp:280, mp:250, atk:38, def:22, spd:20, skills:["abyss_empowered","soul_annihilate","dark_dimension","eclipse_end"], status:[], aiType:"desperate", expReward:500, goldReward:800, loot:["dark_essence","soul_essence"], desc:"与深渊完全融合的暗蚀之主"},
  final_boss_coexist: {id:"final_boss_coexist", name:"共存试炼·自我", hp:250, maxHp:250, mp:200, atk:35, def:24, spd:22, skills:["mirror_strike","self_doubt","inner_demon","transcendence"], status:[], aiType:"strategic", expReward:500, goldReward:600, loot:["soul_essence"], desc:"共存路线的最终试炼——战胜另一个自己"}
};

// 合并到v35敌人池
for (const eid in V36_ENEMIES) {
  if (!V35_ENEMIES[eid]) V35_ENEMIES[eid] = V36_ENEMIES[eid];
}
console.log('[V36] 补充敌人数据: ' + Object.keys(V36_ENEMIES).length + ' 个');


/* ============================================================
   v36 战斗触发节点（战前/战后叙事）
   ============================================================ */

// 通用战斗结果处理：根据v35战斗结果跳转
function v36_battleResult(nextVictory, nextDefeat, nextFlee) {
  if (!V35_BATTLE.result) return nextDefeat;
  if (V35_BATTLE.result === "victory") return nextVictory;
  if (V35_BATTLE.result === "flee") return nextFlee || nextDefeat;
  return nextDefeat;
}

// ===== 七印线战斗 =====
N["battle_seal1_intro"] = function(){ return {
  text:function(){return [
    "第一印的封印之地在地下深处。当你踏入最内层的石室时，地面开始震动。",
    "石巨人从沉睡中苏醒。它的身体由千年的岩石和符文构成，每一步都让大地颤抖。",
    "「入侵者……封印……不可……触碰……」它的声音像是山石摩擦，缓慢而沉重。",
    "你握紧了武器。这一战，无法避免。"
  ];},
  place:"第一印封印地",
  options:[
    {t:"正面迎战", go:"battle_seal1_fight", effect:{}},
    {t:"尝试沟通（需高SPR）", go:"battle_seal1_talk", effect:{}},
    {t:"寻找弱点（需高INT）", go:"battle_seal1_analyze", effect:{}}
  ]
};}

N["battle_seal1_fight"] = function(){ return {
  text:function(){return ["你深吸一口气，向石巨人发起了冲锋！"];},
  options:[{t:"开始战斗", go:"battle_start_seal1_guardian", effect:{}}]
};}

N["battle_start_seal1_guardian"] = function(){
  v35_initBattle("seal_1_guardian","battle_seal1_victory","battle_seal1_defeat","battle_seal1_defeat");
  return {text:"战斗开始！", options:[]};
};

N["battle_seal1_victory"] = function(){ return {
  text:function(){return [
    "石巨人的身体出现了无数裂痕，符文一个个熄灭。",
    "它缓缓跪下，石头的脸上似乎露出了一丝解脱。",
    "「千年……的守护……终于……可以……休息了……」",
    "随着最后一声轰鸣，石巨人化为一堆碎石。第一印的封印完全暴露在你面前。",
    "◆获得经验+80，金币+50，土晶石×1"
  ];},
  place:"第一印封印地",
  options:[
    {t:"查看第一印", go:"seal_1_explore", effect:{exp:80, gold:50, time:1}},
    {t:"先恢复状态", go:"battle_seal1_rest", effect:{}}
  ]
};}

N["battle_seal1_defeat"] = function(){ return {
  text:function(){return [
    "石巨人的拳头砸在你身上，你感觉骨头都要碎了。",
    "意识模糊之际，你似乎看到一个身影冲了进来，将你拖离了战场。",
    "醒来时，你已经在封印地之外。身上的伤口被简单处理过，但第一印的探索不得不暂缓。",
    "◆HP降至10，损失部分金币"
  ];},
  place:"第一印封印地外",
  options:[
    {t:"养好伤再来", go:"city_free", effect:{hp:10, gold:-20, time:3}},
    {t:"不甘心，再试一次", go:"battle_seal1_intro", effect:{time:1}}
  ]
};}

N["battle_seal1_talk"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    if(spr >= 15){
      return [
        "你静下心来，用灵魂感知去触碰石巨人的意识。",
        "它不是敌人，而是一个被诅咒守护了千年的灵魂。它累了，却无法停止。",
        "「你……能听到……我？」它的声音里带着不可思议。",
        "你点头。石巨人沉默了很久。",
        "「那……帮我……解脱吧……但不是用战斗……用你的……灵魂之力……」",
        "◆石巨人愿意让开道路，无需战斗"
      ];
    }
    return [
      "你试图与石巨人沟通，但它的意识太过古老和混沌，你无法理解它在说什么。",
      "它把你的接近视为威胁，举起了拳头。"
    ];
  },
  options:[
    {t:"用灵魂之力帮它解脱（需灵魂魔法）", go:"seal_1_explore", effect:{san:-10, time:1}},
    {t:"还是战斗吧", go:"battle_seal1_fight", effect:{}}
  ]
};}

N["battle_seal1_analyze"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    if(int >= 15){
      return [
        "你仔细观察石巨人的行动模式。它的力量虽然强大，但动作缓慢。",
        "更重要的是，你发现它胸口的符文是力量核心——如果能击中那里……",
        "◆发现弱点：下次战斗伤害+50%"
      ];
    }
    return ["你观察了半天，但没发现什么明显的弱点。"];
  },
  options:[{t:"开始战斗", go:"battle_seal1_fight", effect:{}}]
};}

N["battle_seal1_rest"] = function(){ return {
  text:function(){return [
    "你靠在石壁上，服用了恢复药剂。伤口慢慢愈合，体力逐渐恢复。",
    "石室里很安静，只有符文微弱的光芒在闪烁。"
  ];},
  options:[{t:"继续探索第一印", go:"seal_1_explore", effect:{hp:30, mp:20, time:1}}]
};}

// ===== 暗蚀会战斗 =====
N["battle_eclipse_intro"] = function(){ return {
  text:function(){return [
    "暗巷里，三个身影拦住了你的去路。",
    "灰袍，面具，腰间的短刀泛着幽光——暗蚀会的人。",
    "「有人出了大价钱要买你的消息。」为首的人声音沙哑，「乖乖跟我们走，或者……」",
    "他亮出了刀。"
  ];},
  place:"暗巷",
  options:[
    {t:"拔刀迎战", go:"battle_eclipse_fight", effect:{}},
    {t:"试图谈判（需高CHA）", go:"battle_eclipse_talk", effect:{}},
    {t:"转身逃跑", go:"battle_eclipse_flee", effect:{}}
  ]
};}

N["battle_eclipse_fight"] = function(){ return {
  text:function(){return ["你拔出武器，三个暗蚀会成员同时扑了上来！"];},
  options:[{t:"开始战斗", go:"battle_start_eclipse_thug", effect:{}}]
};}

N["battle_start_eclipse_thug"] = function(){
  v35_initBattle("eclipse_thug","battle_eclipse_victory","battle_eclipse_defeat","battle_eclipse_defeat");
  return {text:"战斗开始！", options:[]};
};

N["battle_eclipse_victory"] = function(){ return {
  text:function(){return [
    "三个暗蚀会成员倒在地上，两个昏了过去，一个捂着伤口瞪着你。",
    "「你等着……暗蚀会不会放过你……」他撂下狠话，连滚带爬地跑了。",
    "你搜了搜昏倒两人的身，找到了一些金币和一封密信。",
    "◆获得经验+20，金币+15，暗蚀会密信×1"
  ];},
  options:[
    {t:"查看密信", go:"eclipse_intro", effect:{exp:20, gold:15, flag:"eclipse_encountered", time:1}},
    {t:"离开这里", go:"city_free", effect:{exp:20, gold:15, time:1}}
  ]
};}

N["battle_eclipse_defeat"] = function(){ return {
  text:function(){return [
    "寡不敌众，你被击倒在地。",
    "他们搜走了你身上的金币，又打了你一顿，才扬长而去。",
    "「算你命大。下次就不是这么简单了。」",
    "你躺在冰冷的巷子里，过了很久才勉强爬起来。",
    "◆HP降至5，金币-30，暗蚀会声望-10"
  ];},
  options:[{t:"艰难地离开", go:"city_free", effect:{hp:5, gold:-30, time:2}}]
};}

N["battle_eclipse_talk"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    if(cha >= 15){
      return [
        "你举起双手，表示没有敌意。",
        "「各位，我们或许可以谈谈。你们要的是钱，我这里有比金币更有价值的东西。」",
        "你抛出了一些半真半假的情报。为首的人犹豫了。",
        "「……你很聪明。这次算了，但下次——」他挥了挥手，三人消失在暗处。",
        "◆避免了战斗，暗蚀会对你产生了兴趣"
      ];
    }
    return ["你的谈判没有奏效，他们只认刀子。"];
  },
  options:[
    {t:"趁机离开", go:"city_free", effect:{flag:"eclipse_interested", time:1}},
    {t:"还是打吧", go:"battle_eclipse_fight", effect:{}}
  ]
};}

N["battle_eclipse_flee"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    if(agi >= 14){
      return ["你转身就跑，凭借敏捷的身手甩掉了追兵。虽然有些狼狈，但至少没受伤。"];
    }
    return ["你试图逃跑，但他们比你想象的更快。一把刀架在了你的脖子上。"];
  },
  options:[
    {t:"甩掉了追兵（成功）", go:"city_free", effect:{time:1}},
    {t:"被抓住了", go:"battle_eclipse_fight", effect:{}}
  ]
};}

// ===== 学院决斗 =====
N["battle_academy_duel_intro"] = function(){ return {
  text:function(){return [
    "学院的决斗场上，围满了看热闹的学生。",
    "你的对手是一个高年级学生，因为一些矛盾向你发起了决斗挑战。",
    "「新生，别以为有点天赋就可以嚣张。今天我就让你知道什么叫规矩。」",
    "他活动着手腕，魔力在掌心凝聚。"
  ];},
  place:"学院决斗场",
  options:[
    {t:"接受决斗", go:"battle_academy_duel_fight", effect:{}},
    {t:"道歉认输", go:"battle_academy_duel_lose", effect:{}}
  ]
};}

N["battle_academy_duel_fight"] = function(){ return {
  text:function(){return ["裁判举起了手——「决斗开始！」"];},
  options:[{t:"开始战斗", go:"battle_start_academy_duel", effect:{}}]
};}

N["battle_start_academy_duel"] = function(){
  v35_initBattle("academy_duel","battle_academy_duel_victory","battle_academy_duel_defeat","battle_academy_duel_defeat");
  return {text:"战斗开始！", options:[]};
};

N["battle_academy_duel_victory"] = function(){ return {
  text:function(){return [
    "你的对手倒在决斗场上，难以置信地看着你。",
    "围观的学生爆发出欢呼声。一个新生击败了高年级学生——这在学院可不常见。",
    "「……你赢了。」他爬起来，拍了拍身上的灰，「我记住你了。」",
    "他的语气里没有怨恨，反而有一丝认可。",
    "◆获得经验+15，学院声望+10"
  ];},
  options:[{t:"离开决斗场", go:"academy_main", effect:{exp:15, rep_academy:10, time:1}}]
};}

N["battle_academy_duel_defeat"] = function(){ return {
  text:function(){return [
    "你被击倒在地，对手的魔法在你面前停下。",
    "「差远了，新生。」他转身离开，围观的学生发出嘘声。",
    "虽然输了，但你从这场战斗中学到了不少。",
    "◆获得经验+5，学院声望-5"
  ];},
  options:[{t:"离开决斗场", go:"academy_main", effect:{exp:5, rep_academy:-5, hp:20, time:1}}]
};}

N["battle_academy_duel_lose"] = function(){ return {
  text:function(){return [
    "你选择了道歉。对手冷哼一声，觉得没意思，带着人走了。",
    "围观的学生有些失望地散开了。虽然没丢面子，但也没赢得尊重。",
    "◆学院声望-3"
  ];},
  options:[{t:"离开", go:"academy_main", effect:{rep_academy:-3, time:0}}]
};}

// ===== 通用战斗入口（从剧情节点调用） =====
N["battle_encounter_bandit"] = function(){ return {
  text:function(){return [
    "路边的树丛里突然跳出几个强盗，挥舞着武器拦住了你的去路。",
    "「此路是我开！留下买路财！」"
  ];},
  options:[
    {t:"战斗", go:"battle_start_bandit", effect:{}},
    {t:"给钱消灾（-20金币）", go:"city_free", effect:{gold:-20, time:1}},
    {t:"试图逃跑", go:"battle_flee_check", effect:{}}
  ]
};}

N["battle_start_bandit"] = function(){
  v35_initBattle("bandit","battle_generic_victory","battle_generic_defeat","city_free");
  return {text:"战斗开始！", options:[]};
};

N["battle_flee_check"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    if(Math.random()*100 < agi*3){
      return ["你凭借敏捷的身手甩掉了强盗，虽然跑得有些气喘。"];
    }
    return ["你没跑掉，强盗追上了你！"];
  },
  options:[
    {t:"成功逃脱", go:"city_free", effect:{time:1}},
    {t:"被迫战斗", go:"battle_start_bandit", effect:{}}
  ]
};}

N["battle_generic_victory"] = function(){ return {
  text:function(){return [
    "敌人倒下了。你喘着粗气，检查了一下自己的伤势。",
    "战斗结束，世界重新安静下来。"
  ];},
  options:[{t:"继续", go:"city_free", effect:{time:1}}]
};}

N["battle_generic_defeat"] = function(){ return {
  text:function(){return [
    "你被击败了。意识模糊之际，似乎有人把你拖到了安全的地方。",
    "醒来时，你发现自己躺在路边，身上的金币少了一些。",
    "◆HP降至10，金币-15"
  ];},
  options:[{t:"继续前行", go:"city_free", effect:{hp:10, gold:-15, time:2}}]
};}

console.log('[V36] 战斗触发节点已加载（七印/暗蚀会/学院/随机遭遇）');


/* ============================================================
   v36 魔法学习途径节点
   ============================================================ */

// ===== 学院魔法课程枢纽 =====
N["academy_magic_class"] = function(){ return {
  text:function(){return [
    "学院的魔法课程在元素塔中进行。七系魔法各有专属的教室，每间教室都配备了防护结界和练习用的假人。",
    "你站在元素塔的大厅里，看着各系教室的门牌。今天可以选择旁听或正式上课。"
  ];},
  place:"艾尔达大陆学院·元素塔",
  options:[
    {t:"火系魔法教室", go:"class_fire_intro", effect:{time:1}},
    {t:"水系魔法教室", go:"class_water_intro", effect:{time:1}},
    {t:"风系魔法教室", go:"class_wind_intro", effect:{time:1}},
    {t:"土系魔法教室", go:"class_earth_intro", effect:{time:1}},
    {t:"光系神学教室", go:"class_light_intro", effect:{time:1}},
    {t:"暗系理论教室（禁书区旁）", go:"class_dark_intro", effect:{time:1, san:-5}},
    {t:"灵魂魔法研究室（墨丘利专属）", go:"class_soul_intro", effect:{time:1}},
    {t:"离开元素塔", go:"academy_main", effect:{}}
  ]
};}

// ===== 火系课程 =====
N["class_fire_intro"] = function(){ return {
  text:function(){return [
    "火系教室像一个巨大的壁炉。墙壁上刻满了火焰符文，温度比外面高了不少。",
    "授课的是一位头发花白的老教授，他的指尖跳动着一团火焰。",
    "「火系魔法的核心，是让你的魔力与火焰共鸣。感受它的热情，它的毁灭欲——然后控制它。」",
    "他看向你：「新来的？上来试试。」"
  ];},
  options:[
    {t:"尝试凝聚火球（INT×3判定）", go:"class_fire_learn", effect:{}},
    {t:"认真听讲，做笔记", go:"class_fire_study", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_fire_learn"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    var target = int*3;
    if(roll <= target){
      v35_learnSpell("fire_spark");
      v35_learnSpell("fire_fireball");
      return [
        "你闭上眼睛，感受体内的魔力。它像一股暖流，顺着手臂涌向指尖。",
        "「就是这样！」教授喊道。",
        "一团火焰在你掌心绽放，虽然不大，但确实是真正的火焰。",
        "教授满意地点头：「不错，不错。你已经掌握了火花术和火球术的基础。」",
        "◆学会魔法：火花术、火球术",
        "◆火系魔法经验+10"
      ];
    } else if(roll <= target+20){
      return [
        "你努力尝试，但魔力总是在最后一刻散开。",
        "教授皱了皱眉：「魔力控制还不够。多练习，下次再来。」",
        "虽然没学会，但你对火系魔法有了更深的理解。",
        "◆火系魔法经验+5"
      ];
    } else {
      return [
        "你太急躁了，魔力失控，一团黑烟从你指尖冒出，呛得你直咳嗽。",
        "同学们发出笑声。教授无奈地摇头：「控制，控制！火系魔法最忌急躁。」",
        "◆HP-5，SAN-3"
      ];
    }
  },
  options:[
    {t:"继续练习", go:"class_fire_study", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{time:1}}
  ]
};}

N["class_fire_study"] = function(){ return {
  text:function(){return [
    "你认真地听教授讲解火系魔法的原理，做了满满几页笔记。",
    "「火焰的本质是能量的释放。每一个火球术，都是将魔力转化为热能的过程……」",
    "下课后，你感觉对火系魔法的理解加深了。",
    "◆火系魔法经验+10"
  ];},
  options:[{t:"返回元素塔大厅", go:"academy_magic_class", effect:{}}]
};}

// ===== 水系课程 =====
N["class_water_intro"] = function(){ return {
  text:function(){return [
    "水系教室弥漫着潮湿的气息。墙壁上有水流顺着符文缓缓流动，形成了一个微型瀑布。",
    "授课的是一位气质温和的女教授，她的声音像溪水一样清澈。",
    "「水系魔法的核心，是柔韧。水可以滋养万物，也可以穿透岩石。不要抗拒，要引导。」"
  ];},
  options:[
    {t:"尝试凝聚水弹（INT×3判定）", go:"class_water_learn", effect:{}},
    {t:"学习治疗术", go:"class_water_heal", effect:{time:1}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_water_learn"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= int*3){
      v35_learnSpell("water_bolt");
      v35_learnSpell("water_heal");
      return [
        "你将魔力注入空气中的水分子，它们开始聚集，在你掌心形成了一个水球。",
        "「很好！」女教授微笑，「你已经掌握了水弹术。再试试将水注入伤口——这就是治疗术的基础。」",
        "你试着将水球贴在手上的小伤口上，清凉的感觉传来，伤口真的在愈合。",
        "◆学会魔法：水弹术、治疗术",
        "◆水系魔法经验+10"
      ];
    }
    return ["你尝试了很久，但水分子总是不听话。教授说：「别急，水系魔法需要耐心。」", "◆水系魔法经验+5"];
  },
  options:[{t:"返回元素塔大厅", go:"academy_magic_class", effect:{time:1}}]
};}

N["class_water_heal"] = function(){ return {
  text:function(){return [
    "教授详细讲解了治疗术的原理：将水属性魔力注入伤口，加速细胞再生。",
    "「记住，治疗术不能治愈一切。灵魂的创伤、诅咒、深渊侵蚀——这些都需要更高级的魔法。」",
    "你认真练习，感觉治疗术的掌握更熟练了。",
    "◆水系魔法经验+10"
  ];},
  options:[{t:"返回", go:"academy_magic_class", effect:{}}]
};}

// ===== 风系课程 =====
N["class_wind_intro"] = function(){ return {
  text:function(){return [
    "风系教室在元素塔的最高层，窗户大开，风呼呼地吹进来。",
    "授课的是一位身形瘦削的教授，他说话时语速极快，像风一样。",
    "「风系魔法的核心，是速度。风无处不在，你要做的就是成为风的一部分。」"
  ];},
  options:[
    {t:"尝试风刃术（AGI×3判定）", go:"class_wind_learn", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_wind_learn"] = function(){ return {
  text:function(){
    var agi = S.attrs ? S.attrs.AGI : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= agi*3){
      v35_learnSpell("wind_gust");
      v35_learnSpell("wind_lightning");
      return [
        "你深吸一口气，将魔力与周围的风融合。",
        "几道风刃从你掌心射出，在墙壁上留下了浅浅的刻痕。",
        "教授吹了声口哨：「不错！风刃术已经成型了。再试试引动雷元素——风与雷本是一家。」",
        "一道细小的闪电在你指尖跳跃。",
        "◆学会魔法：风刃术、闪电术",
        "◆风系魔法经验+10"
      ];
    }
    return ["风吹得你睁不开眼，魔力完全无法凝聚。教授说：「感受风，不要对抗风。」", "◆风系魔法经验+5"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 土系课程 =====
N["class_earth_intro"] = function(){ return {
  text:function(){return [
    "土系教室在地下一层，墙壁是裸露的岩石，地面上散落着各种矿石。",
    "授课的是一位身材魁梧的教授，声音像石头一样厚重。",
    "「土系魔法的核心，是稳固。脚下的大地永远不会欺骗你——只要你足够坚定。」"
  ];},
  options:[
    {t:"尝试石弹术（CON×3判定）", go:"class_earth_learn", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_earth_learn"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= con*3){
      v35_learnSpell("earth_shot");
      v35_learnSpell("earth_wall");
      return [
        "你将手按在地面上，感受大地的脉动。",
        "一颗石弹从地面升起，悬浮在你面前。你一挥手，它飞了出去，砸在墙上碎成粉末。",
        "教授点头：「很好。再试试土墙——防御是土系的根本。」",
        "一面石墙从地面升起，虽然粗糙，但确实挡住了教授的测试攻击。",
        "◆学会魔法：石弹术、土墙术",
        "◆土系魔法经验+10"
      ];
    }
    return ["大地的脉动太沉重了，你无法跟上。教授说：「站稳，深呼吸，感受大地。」", "◆土系魔法经验+5"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 光系课程 =====
N["class_light_intro"] = function(){ return {
  text:function(){return [
    "光系教室充满了柔和的金色光芒。墙上挂着光明神的圣像，空气中弥漫着焚香的味道。",
    "授课的是一位教会派来的神父教授，他的态度庄重而严格。",
    "「光系魔法的核心，是信仰。只有内心纯净之人，才能引导光明的力量。」",
    "他看了看你：「你……有信仰吗？」"
  ];},
  options:[
    {t:"我信仰光明神（SPR×3判定）", go:"class_light_learn", effect:{}},
    {t:"我只是来学魔法的", go:"class_light_skeptic", effect:{}},
    {t:"离开教室", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_light_learn"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      v35_learnSpell("light_ray");
      v35_learnSpell("light_blessing");
      return [
        "你闭上眼睛祈祷。一股温暖的力量从上方注入你的身体。",
        "金色的光芒在你掌心凝聚，圣洁而温暖。",
        "神父教授露出了微笑：「光明神眷顾你。你已经掌握了光线术和祝福术。」",
        "◆学会魔法：光线术、祝福术",
        "◆光系魔法经验+10，教会声望+5"
      ];
    }
    return ["你的祈祷没有得到回应。神父教授摇头：「信仰不够坚定。」", "◆光系魔法经验+3"];
  },
  options:[{t:"返回", go:"academy_magic_class", effect:{time:1}}]
};}

N["class_light_skeptic"] = function(){ return {
  text:function(){return [
    "神父教授的脸色沉了下来。",
    "「没有信仰，就没有光明。你走吧，这里不欢迎无神论者。」",
    "他挥了挥手，示意你离开。虽然被赶了出来，但你注意到他的书桌上有一本被锁起来的古籍——封面上写着《光与暗的真相》。",
    "◆光系魔法学习被拒绝，但发现了可疑的古籍"
  ];},
  options:[
    {t:"找机会偷那本古籍", go:"academy_forbidden_section", effect:{time:1, flag:"light_secret_found"}},
    {t:"离开", go:"academy_magic_class", effect:{}}
  ]
};}

// ===== 暗系课程 =====
N["class_dark_intro"] = function(){ return {
  text:function(){return [
    "暗系教室在禁书区旁边，门是黑色的，上面刻着各种诡异的符文。",
    "教室里没有点灯，只有几支蜡烛发出幽绿的光。",
    "授课的是一位总是戴着兜帽的教授，你看不清他的脸。",
    "「暗系魔法……不被教会认可，但它是最真实的魔法。光明会撒谎，黑暗不会。」",
    "他的声音低沉而沙哑：「想学？做好付出代价的准备了吗？」"
  ];},
  options:[
    {t:"我准备好了（SPR×3判定，有SAN代价）", go:"class_dark_learn", effect:{}},
    {t:"这太危险了，离开", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_dark_learn"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      v35_learnSpell("dark_bolt");
      v35_learnSpell("dark_curse");
      return [
        "你将魔力注入黑暗。黑暗开始蠕动，像活物一样缠绕上你的手臂。",
        "一股寒意从脊椎升起。你看到了……一些不该看到的东西。",
        "兜帽教授点头：「很好。暗影弹和诅咒术——这只是开始。」",
        "「记住，暗系魔法的代价是你的理智。每一次使用，都在向深渊靠近一步。」",
        "◆学会魔法：暗影弹、诅咒术",
        "◆暗系魔法经验+10，SAN-10，暗蚀会声望+5"
      ];
    }
    return ["黑暗吞噬了你的魔力，你感到一阵眩晕。教授说：「意志不够坚定。下次再来。」", "◆SAN-5，暗系魔法经验+3"];
  },
  options:[{t:"离开（需要新鲜空气）", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 灵魂魔法（墨丘利私授）=====
N["class_soul_intro"] = function(){ return {
  text:function(){return [
    "灵魂魔法研究室在元素塔的最顶层，门上刻着墨丘利的私人印记。",
    "你敲了敲门。门开了，墨丘利站在里面，手里拿着一本古老的书籍。",
    "「你来了。」他推了推眼镜，「灵魂魔法是最危险也最强大的魔法。它不操控元素，它操控——灵魂本身。」",
    "「你确定要学吗？这不是普通学生能接触的东西。」"
  ];},
  options:[
    {t:"我确定（需墨丘利好感≥50）", go:"class_soul_learn", effect:{}},
    {t:"我再想想", go:"academy_magic_class", effect:{}}
  ]
};}

N["class_soul_learn"] = function(){ return {
  text:function(){
    var mercuryRel = S.relations ? (S.relations.mercury || 0) : 0;
    if(mercuryRel < 50){
      return [
        "墨丘利看了你一眼，摇了摇头。",
        "「我们还不够熟。灵魂魔法需要绝对的信任——我不能把这么危险的东西交给一个不够了解的人。」",
        "「先多来聊聊，等我们更熟悉了再说。」",
        "◆墨丘利好感不足（需要≥50）"
      ];
    }
    v35_learnSpell("soul_sight");
    return [
      "墨丘利沉默了片刻，然后点了点头。",
      "「好。我教你最基础的——灵魂视觉。它能让你看到事物的灵魂本质。」",
      "他将手按在你的额头上。一股清凉的力量注入你的意识。",
      "世界在你眼中变了。你看到了墨丘利的灵魂——它被层层迷雾包裹，深处有什么东西在闪烁。",
      "「不要看得太深。」他收回手，「有些真相，知道了就无法回头。」",
      "◆学会魔法：灵魂视觉",
      "◆灵魂系魔法经验+10，SAN-5"
    ];
  },
  options:[{t:"离开研究室", go:"academy_magic_class", effect:{time:1}}]
};}

// ===== 秘籍学习 =====
N["magic_scroll_study"] = function(){ return {
  text:function(){return [
    "你展开了一张古老的魔法卷轴。羊皮纸上的符文闪烁着微光，散发着古老的魔力。",
    "卷轴上记载着一个失传的魔法。你需要集中精神，解读这些符文。"
  ];},
  options:[
    {t:"专注解读（INT×4判定）", go:"magic_scroll_result", effect:{time:2}},
    {t:"放弃，太难了", go:"city_free", effect:{}}
  ]
};}

N["magic_scroll_result"] = function(){ return {
  text:function(){
    var int = S.attrs ? S.attrs.INT : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= int*4){
      v35_learnSpell("fire_meteor");
      return [
        "符文在你眼前重组，它们的含义逐渐清晰。",
        "这是一个高阶火系魔法——陨石术。你将魔力按照符文的引导释放，天空中真的出现了一颗燃烧的陨石！",
        "虽然只是小型的，但这确实是陨石术的雏形。",
        "◆学会魔法：陨石术",
        "◆卷轴化为灰烬"
      ];
    }
    return ["符文太复杂了，你解读了两天也只看懂了三分之一。卷轴的魔力正在消散。", "◆卷轴失效，INT经验+5"];
  },
  options:[{t:"继续", go:"city_free", effect:{time:1}}]
};}

console.log('[V36] 魔法学习途径节点已加载（学院七系课程+导师+秘籍）');


/* ============================================================
   v36 9大势力加入剧情线
   ============================================================ */

// ===== 势力招募枢纽 =====
N["faction_recruit_hub"] = function(){ return {
  text:function(){return [
    "大陆上的各大势力都在招募有天赋的年轻人。你可以选择加入其中一个，为自己的未来铺路。",
    "但要记住——加入一个势力，就意味着与它的敌人为敌。"
  ];},
  options:[
    {t:"光明教会（圣城）", go:"faction_lc_intro", effect:{}},
    {t:"暗蚀会（秘密）", go:"faction_es_intro", effect:{}},
    {t:"守望者（神秘）", go:"faction_wt_intro", effect:{}},
    {t:"东部王国（承天山）", go:"faction_em_intro", effect:{}},
    {t:"自由城邦（交汇城）", go:"faction_fc_intro", effect:{}},
    {t:"精灵王国（银叶城）", go:"faction_elf_intro", effect:{}},
    {t:"矮人王国（铁峰堡）", go:"faction_dwarf_intro", effect:{}},
    {t:"兽人王庭（草原）", go:"faction_orc_intro", effect:{}},
    {t:"深渊教派（隐藏）", go:"faction_abyss_intro", effect:{san:-10}},
    {t:"离开", go:"city_free", effect:{}}
  ]
};}

// ===== 光明教会 =====
N["faction_lc_intro"] = function(){ return {
  text:function(){return [
    "圣城的大教堂巍峨耸立，金色的穹顶在阳光下闪闪发光。",
    "一位身穿白袍的神父向你走来，他的眼神温和而锐利。",
    "「年轻人，我感受到了你身上的光明气息。你愿意为光明神效力吗？教会需要像你这样有天赋的人。」",
    "他递过来一份招募文书：「加入教会，你将获得神的庇佑，以及在大陆上最强大的后盾。」"
  ];},
  options:[
    {t:"我愿意加入", go:"faction_lc_test", effect:{}},
    {t:"我需要考虑一下", go:"faction_recruit_hub", effect:{}},
    {t:"教会的净化令害了不少人，我不感兴趣", go:"faction_lc_refuse", effect:{}}
  ]
};}

N["faction_lc_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      return [
        "神父带你进入大教堂的内殿，让你跪在圣像前祈祷。",
        "你闭上眼睛，一股温暖的力量从上方注入你的身体。圣像的眼睛似乎亮了一下。",
        "神父露出了微笑：「光明神认可了你。你的信仰是真诚的。」"
      ];
    }
    return [
      "神父让你祈祷，但你什么也没感受到。",
      "神父皱了皱眉：「你的信仰还不够坚定。不过，教会也需要能战斗的人。你可以从助祭做起。」"
    ];
  },
  options:[{t:"进行宣誓仪式", go:"faction_lc_oath", effect:{time:1}}]
};}

N["faction_lc_oath"] = function(){ return {
  text:function(){return [
    "大教堂内，烛光摇曳。你跪在圣像前，手按圣经。",
    "「我宣誓，效忠光明神，效忠教会，驱逐黑暗，净化邪恶，保护无辜。」",
    "神父将一枚银色的徽章别在你胸前：「从今天起，你就是光明教会的助祭了。」",
    "「愿光明神保佑你。」",
    "◆加入光明教会，获得教会徽章，教会声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_lc_joined", effect:{}}]
};}

N["faction_lc_joined"] = function(){
  v35_joinFaction("light_church");
  return {
    text:function(){return [
      "你走出大教堂，胸前的徽章在阳光下闪烁。",
      "路过的信徒向你点头致意。一个修女递给你一本祈祷书和一套教会法袍。",
      "「欢迎加入教会，助祭。明天清晨来大教堂报到，你的第一个任务在等你。」",
      "◆获得：教会法袍、祈祷书、初始教会任务"
    ];},
    options:[{t:"开始教会生活", go:"city_free", effect:{flag:"joined_light_church", time:1}}]
  };
}

N["faction_lc_refuse"] = function(){ return {
  text:function(){return [
    "神父的脸色沉了下来。",
    "「净化令是为了保护无辜者。灵魂法师的力量太危险了——你以后会明白的。」",
    "他转身离开，但你注意到他在离开前看了你的档案一眼。",
    "◆教会对你产生了戒心"
  ];},
  options:[{t:"离开", go:"faction_recruit_hub", effect:{rep_light_church:-10}}]
};}

// ===== 暗蚀会 =====
N["faction_es_intro"] = function(){ return {
  text:function(){return [
    "深夜，你在小巷里被一个戴面具的人拦住了去路。",
    "「别紧张。」他的声音经过伪装，「我是暗蚀会的人。我们注意你很久了——你有天赋，也有野心。」",
    "「教会说我们是邪教，但他们才是真正的压迫者。七印是枷锁，原初之物应该被解放。」",
    "他递过来一枚黑色的徽章：「加入我们，你将获得真正的力量——以及自由。」"
  ];},
  options:[
    {t:"我加入", go:"faction_es_test", effect:{}},
    {t:"你们是邪教，我要举报你", go:"faction_es_report", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_test"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    return [
      "面具人带你来到一个地下室。里面坐着几个同样戴面具的人。",
      "「想加入暗蚀会，需要证明你的忠诚。」为首的人说，「看到那边那个商人了吗？他欠了我们一大笔钱。去，把他的手指砍下来一根。」",
      "他递给你一把刀。",
      "这是一个测试——你愿意为了力量做到什么程度？"
    ];
  },
  options:[
    {t:"照做（砍手指）", go:"faction_es_oath", effect:{san:-15, karma:-10}},
    {t:"拒绝，但表示愿意用其他方式证明", go:"faction_es_alt_test", effect:{}},
    {t:"转身离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_alt_test"] = function(){ return {
  text:function(){
    var cha = S.attrs ? S.attrs.CHA : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= cha*3){
      return [
        "你放下刀，直视为首的人：「我不需要用这种方式证明忠诚。我可以为你们做更有价值的事——情报、谈判、潜入。」",
        "房间里沉默了几秒。然后为首的人笑了：「有意思。你比我想的聪明。」",
        "「好，我们给你一个机会。」"
      ];
    }
    return ["为首的人冷哼一声：「不够狠，也不够聪明。滚吧。」", "你被赶出了地下室。"];
  },
  options:[
    {t:"进行入会仪式", go:"faction_es_oath", effect:{}},
    {t:"离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_es_oath"] = function(){ return {
  text:function(){return [
    "地下室里，蜡烛排成了一个诡异的阵法。你站在阵中，面具人围在四周。",
    "「以深渊之名，以原初之物之名，你愿意将灵魂的一部分献给暗蚀会吗？」",
    "你点头。一阵寒意从脚底升起，你感觉有什么东西进入了你的身体。",
    "「欢迎加入暗蚀会。」为首的人将一枚黑色徽章递给你，「从今天起，你是我们的一员了。」",
    "◆加入暗蚀会，获得暗蚀会徽章，暗蚀会声望+20，SAN-10"
  ];},
  options:[{t:"接受徽章", go:"faction_es_joined", effect:{}}]
};}

N["faction_es_joined"] = function(){
  v35_joinFaction("eclipse_society");
  return {
    text:function(){return [
      "你走出地下室，夜风吹过。你摸了摸胸前的黑色徽章，它微微发热。",
      "一个声音在你脑海深处响起——也许是错觉，也许不是。",
      "「你的第一个任务：去交汇城的商会，找一个叫老约翰的人。他知道太多了。」",
      "◆获得：暗蚀会法袍、第一个暗杀任务"
    ];},
    options:[{t:"开始暗蚀会生活", go:"city_free", effect:{flag:"joined_eclipse_society", time:1}}]
  };
}

N["faction_es_report"] = function(){ return {
  text:function(){return [
    "你转身跑向最近的教会哨所，报告了暗蚀会的据点。",
    "但当审判骑士赶到时，地下室已经空了。他们只找到了一些来不及带走的文件。",
    "「干得好，年轻人。」审判骑士队长拍了拍你的肩，「教会会记住你的贡献。」",
    "但你知道——暗蚀会不会忘记这件事。",
    "◆教会声望+15，暗蚀会声望-30，被暗蚀会标记为敌人"
  ];},
  options:[{t:"离开", go:"city_free", effect:{rep_light_church:15, rep_eclipse_society:-30}}]
};}

// ===== 守望者 =====
N["faction_wt_intro"] = function(){ return {
  text:function(){return [
    "你总觉得有人在看你。",
    "今天，那种感觉特别强烈。你回头，看到一个穿灰袍的人站在街角。他的脸藏在兜帽里，但你能感觉到他在注视你。",
    "你走过去。他没有逃。",
    "「你终于注意到我了。」他的声音很平静，「我是守望者。我们观察、记录、维护平衡。我们已经观察你一段时间了。」",
    "「你有天赋，也有选择的权利。我们想邀请你——成为守望者的一员。」"
  ];},
  options:[
    {t:"守望者是什么？", go:"faction_wt_explain", effect:{}},
    {t:"我加入", go:"faction_wt_test", effect:{}},
    {t:"我不喜欢被监视，离开", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_wt_explain"] = function(){ return {
  text:function(){return [
    "灰袍人缓缓道来：",
    "「守望者是大陆上最古老的组织之一。我们不效忠任何势力，只效忠真相和平衡。」",
    "「我们记录历史，监测七印，在光明与黑暗之间维持天平。教会说我们是异端，暗蚀会说我们是叛徒——但我们只是旁观者。」",
    "「加入我们，你将获得接触真相的权利。但你也必须承诺：永不将记录用于私利。」",
    "他看着你：「你愿意吗？」"
  ];},
  options:[
    {t:"我愿意", go:"faction_wt_test", effect:{}},
    {t:"这太沉重了，我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_wt_test"] = function(){ return {
  text:function(){
    return [
      "灰袍人带你来到一个隐秘的房间。房间里有一张桌子，桌上放着一个袋子。",
      "「袋子里有一千金币。」他说，「现在，房间里只有你和我。如果你拿走这些金币，我不会阻止你，也不会告诉任何人。」",
      "「但如果你拿走了，你就不能成为守望者。」",
      "「这是测试——不是测试你的诚实，是测试你对真相的渴望是否超过了对利益的渴望。」"
    ];
  },
  options:[
    {t:"不拿金币，选择真相", go:"faction_wt_oath", effect:{}},
    {t:"拿走金币", go:"faction_wt_fail", effect:{gold:1000}}
  ]
};}

N["faction_wt_oath"] = function(){ return {
  text:function(){return [
    "灰袍人点了点头。他从怀里取出一枚银色的眼睛形状的徽章。",
    "「守望者的誓言：我将观察，不干预；我将记录，不篡改；我将守护平衡，不偏向任何一方。」",
    "你复述了誓言。他将徽章别在你胸前。",
    "「欢迎加入守望者。你的编号是第7342位。从今天起，你将看到一个不同的世界。」",
    "◆加入守望者，获得守望者徽章，守望者声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_wt_joined", effect:{}}]
};}

N["faction_wt_joined"] = function(){
  v35_joinFaction("watchers");
  return {
    text:function(){return [
      "你走出房间，世界似乎变得清晰了一些。",
      "灰袍人递给你一本空白的笔记本和一支特殊的笔。",
      "「记录你看到的一切。每个月，将你的记录送到交汇城的老书店。店主会知道该怎么做。」",
      "「你的第一个观察任务：暗蚀会最近在交汇城活动频繁。去调查一下。」",
      "◆获得：守望者笔记本、观察任务"
    ];},
    options:[{t:"开始守望者生活", go:"city_free", effect:{flag:"joined_watchers", time:1}}]
  };
}

N["faction_wt_fail"] = function(){ return {
  text:function(){return [
    "你拿起了金币袋。灰袍人没有阻止你。",
    "「我理解。」他的声音里没有失望，只有平静，「每个人都有选择的权利。」",
    "「但记住——你今天拿走的，将来可能会以另一种方式还回来。」",
    "他转身消失在街角。你手里握着金币袋，但心里有种说不出的滋味。",
    "◆获得1000金币，守望者声望-20"
  ];},
  options:[{t:"离开", go:"city_free", effect:{gold:1000, rep_watchers:-20}}]
};}

// ===== 东部王国 =====
N["faction_em_intro"] = function(){ return {
  text:function(){return [
    "承天山的军营里，士兵们正在操练。口号声震天动地。",
    "一个穿铠甲的军官向你走来，胸前的勋章显示他是个千夫长。",
    "「年轻人，看你的身板，是块当兵的料！」他声音洪亮，「东部王国的军队是大陆上最精锐的！加入我们，军功、爵位、土地——应有尽有！」",
    "他拍了拍你的肩膀：「怎么样，要不要为皇帝陛下效力？」"
  ];},
  options:[
    {t:"我愿意参军", go:"faction_em_test", effect:{}},
    {t:"军队太苦了，我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_em_test"] = function(){ return {
  text:function(){
    var str = S.attrs ? S.attrs.STR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= str*3){
      return [
        "千夫长带你来到校场，让你和一个新兵对练。",
        "你三下五除二就把对手放倒了。围观的士兵们发出叫好声。",
        "千夫长哈哈大笑：「好！好身手！就你了！」"
      ];
    }
    return [
      "你和新兵对练，虽然赢了，但打得很艰难。",
      "千夫长摸了摸下巴：「身手一般，但意志不错。军队需要各种人才——你可以做个文书或者后勤。」"
    ];
  },
  options:[{t:"进行入伍宣誓", go:"faction_em_oath", effect:{time:1}}]
};}

N["faction_em_oath"] = function(){ return {
  text:function(){return [
    "军营的广场上，你和其他新兵一起列队。千夫长站在前面。",
    "「我宣誓，效忠东部王国皇帝陛下，服从军令，守卫疆土，奋勇杀敌！」",
    "你跟着复述。千夫长将一枚军衔徽章别在你胸前。",
    "「从今天起，你是东部王国陆军的一名士兵了！明天开始训练！」",
    "◆加入东部王国，获得士兵徽章，帝国声望+20"
  ];},
  options:[{t:"接受军衔", go:"faction_em_joined", effect:{}}]
};}

N["faction_em_joined"] = function(){
  v35_joinFaction("empire");
  return {
    text:function(){return [
      "你领到了一套军装和一把制式长剑。",
      "同队的老兵拍了拍你的肩：「新兵，好好干。跟着我，保你不死。」",
      "「你的第一个任务：跟着小队去边境巡逻。兽人最近不老实。」",
      "◆获得：帝国军装、制式长剑、巡逻任务"
    ];},
    options:[{t:"开始军旅生活", go:"city_free", effect:{flag:"joined_empire", time:1}}]
  };
}

// ===== 自由城邦 =====
N["faction_fc_intro"] = function(){ return {
  text:function(){return [
    "交汇城的商会大楼里，商人们忙碌地穿梭。空气中弥漫着金币和账本的味道。",
    "一个穿丝绸长袍的胖子向你走来，他的手指上戴满了宝石戒指。",
    "「年轻人，我观察你很久了。」他笑眯眯地说，「你有商业头脑，也有行动力。加入自由城邦商会吧——我们给你资源，你给我们利润。」",
    "「在自由城邦，金币就是力量。你说呢？」"
  ];},
  options:[
    {t:"我加入商会", go:"faction_fc_test", effect:{}},
    {t:"我没有本金", go:"faction_fc_poor", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_fc_test"] = function(){ return {
  text:function(){
    return [
      "胖子商人带你来到一个房间，桌上放着三样东西：一把剑、一袋金币、一封信。",
      "「商会的入会测试很简单。」他说，「这三样东西，你只能选一样。选完之后告诉我为什么。」",
      "「剑代表武力，金币代表资本，信代表人脉。你选哪个？」"
    ];
  },
  options:[
    {t:"选剑（武力）", go:"faction_fc_oath", effect:{}},
    {t:"选金币（资本）", go:"faction_fc_oath", effect:{}},
    {t:"选信（人脉）", go:"faction_fc_oath", effect:{}}
  ]
};}

N["faction_fc_oath"] = function(){ return {
  text:function(){return [
    "胖子商人听了你的理由，哈哈大笑。",
    "「好！不管选哪个，只要你知道自己为什么选，就是商会需要的人才！」",
    "他在一份契约上盖了章：「从今天起，你是自由城邦商会的正式成员了。做生意，我们五五分成——当然，本钱我出。」",
    "◆加入自由城邦，获得商会徽章，自由城邦声望+20"
  ];},
  options:[{t:"接受契约", go:"faction_fc_joined", effect:{}}]
};}

N["faction_fc_joined"] = function(){
  v35_joinFaction("free_cities");
  return {
    text:function(){return [
      "你拿到了商会的徽章和第一笔启动资金。",
      "胖子商人递给你一份商路图：「你的第一个任务：把这批货运到铁门关，卖掉之后把利润带回来。」",
      "「路上小心，强盗最近很猖獗。」",
      "◆获得：商会徽章、启动资金100金币、商路图"
    ];},
    options:[{t:"开始商会生活", go:"city_free", effect:{flag:"joined_free_cities", gold:100, time:1}}]
  };
}

N["faction_fc_poor"] = function(){ return {
  text:function(){return [
    "胖子商人摆摆手：「没钱不要紧，商会给你本钱！我们看中的是你的能力，不是你的口袋。」",
    "「怎么样，现在愿意加入了吗？」"
  ];},
  options:[
    {t:"愿意", go:"faction_fc_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 精灵王国 =====
N["faction_elf_intro"] = function(){ return {
  text:function(){return[
    "银叶城的世界树高耸入云，阳光透过树叶洒下斑驳的光影。",
    "一个精灵长老向你走来，他的面容年轻，但眼睛里透着千年的沧桑。",
    "「外族的年轻人。」他的声音像风吹过树叶，「精灵王国很少接纳外族。但你身上……有自然的气息。」",
    "「世界树在低语，说你是可以信任的人。你愿意为精灵王国效力吗？」"
  , "银叶城的王庭，建在世界树的枝桠之间。你走上去的时候，整座王庭都在轻轻晃动，像站在一艘巨大的船上。", "精灵女王没有戴冠冕，只是坐在一张藤椅上，手里捻着一片枯叶。她看着你，目光平静得没有一丝波澜——可你知道，那种平静，是用很多很多年练出来的。", "「人类的孩子，」她的声音像风穿过竹林，「你身上有树的痕迹。你去过世界树的根部。」", "你没有否认。她捻着枯叶，慢慢说：「你听见它说话了，对吗？」", "你点头。她沉默了很久，久到你以为她不会再开口。然后她说：「我们也听见了。听了三百年。只是——我们不知道该怎么回答它。」", "她把那片枯叶放进你手里：「带着它。如果有一天，你知道该怎么回答那棵树——就回来，把它放在树根下。」", "你低头看着那片枯叶。它很轻，可你知道，你接过了一个精灵王国藏了三百年的问题。"];} /*v45inj:faction_elf_intro*/,
  options:[
    {t:"我愿意", go:"faction_elf_test", effect:{}},
    {t:"外族在精灵王国不会被歧视吗？", go:"faction_elf_doubt", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_elf_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*3){
      return [
        "长老带你来到世界树下，让你把手放在树干上。",
        "你闭上眼睛，感受到了一股古老而温暖的力量。世界树的低语在你脑海中响起。",
        "长老露出了微笑：「世界树认可了你。很少有外族能做到这一点。」"
      ];
    }
    return [
      "你把手放在世界树上，但什么也没感受到。",
      "长老微微皱眉：「你的心还不够平静。不过，精灵王国也需要能战斗的盟友。你可以作为客卿加入。」"
    ];
  },
  options:[{t:"进行效忠仪式", go:"faction_elf_oath", effect:{time:1}}]
};}

N["faction_elf_oath"] = function(){ return {
  text:function(){return [
    "世界树下，长老用精灵语念诵着古老的誓言。你跟着复述，虽然不太懂意思，但能感受到其中的庄严。",
    "长老将一枚用树叶和银丝编织的徽章别在你胸前。",
    "「从今天起，你是精灵王国的朋友和盟友。世界树会保佑你。」",
    "◆加入精灵王国，获得精灵徽章，精灵声望+20"
  ];},
  options:[{t:"接受徽章", go:"faction_elf_joined", effect:{}}]
};}

N["faction_elf_joined"] = function(){
  v35_joinFaction("elf_kingdom");
  return {
    text:function(){return [
      "你走出世界树的阴影，几个精灵孩子好奇地看着你。",
      "长老递给你一把精灵短弓和一瓶治疗药水：「你的第一个任务：去调查世界树边缘的异常——最近有黑暗的气息在蔓延。」",
      "「小心，外族的朋友。」",
      "◆获得：精灵短弓、治疗药水、调查任务"
    ];},
    options:[{t:"开始精灵盟友生活", go:"city_free", effect:{flag:"joined_elf_kingdom", time:1}}]
  };
}

N["faction_elf_doubt"] = function(){ return {
  text:function(){return [
    "长老沉默了片刻。",
    "「歧视？不，我们只是谨慎。精灵寿命很长，我们见过太多外族的背叛。」",
    "「但如果你能用行动证明自己，精灵会是你最忠诚的朋友。」",
    "他看着你：「你愿意试试吗？」"
  ];},
  options:[
    {t:"我愿意试试", go:"faction_elf_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 矮人王国 =====
N["faction_dwarf_intro"] = function(){ return {
  text:function(){return[
    "铁峰堡的地下大厅里，炉火熊熊，铁锤声不绝于耳。",
    "一个留着大胡子的矮人向你走来，他的胳膊比你的腰还粗。",
    "「外族的！」他声音像打雷，「看你的手，是干过活的人！矮人王国最看重手艺和勇气！」",
    "「加入我们！有酒喝，有肉吃，有锻造炉用！怎么样？」"
  , "铁峰堡的王厅，没有金碧辉煌的装饰，只有一整面刻满名字的石墙。", "矮人王坐在石阶上，手里握着一把锤子——不是武器，是王权的象征。他看着你，目光像两块烧红的炭：「人类，你来铁峰堡，想求什么？」", "「求学。」你说，「也想看看，山的心里装着什么。」", "他笑了，笑声在石厅里滚动：「山的心？有意思。三百年来，你是第一个这么说的。」", "他站起来，把锤子往地上一顿，整个石厅都震了一下：「好。矮人不收会说漂亮话的人。你既然想看山的心——先去矿道里，给我凿一百斤铁回来。」", "他把一把矿镐丢给你。镐柄是温的，像是被人握了很久。你握紧它，忽然明白，这把镐，就是矮人递给你的第一句真话。"];} /*v45inj:faction_dwarf_intro*/,
  options:[
    {t:"我加入", go:"faction_dwarf_test", effect:{}},
    {t:"我不会锻造", go:"faction_dwarf_cant", effect:{}},
    {t:"我再想想", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_dwarf_test"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    return [
      "矮人带你来到一个锻造炉前，递给你一把铁锤和一块生铁。",
      "「入会测试很简单！」他大吼，「把这块铁打成一把匕首！三个小时内完成！」",
      "炉火烤得你满脸通红。你深吸一口气，举起了铁锤。"
    ];
  },
  options:[{t:"开始锻造（CON判定）", go:"faction_dwarf_oath", effect:{time:3}}]
};}

N["faction_dwarf_oath"] = function(){ return {
  text:function(){
    var con = S.attrs ? S.attrs.CON : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= con*3){
      return [
        "三个小时后，你将一把虽然粗糙但确实成型的匕首放在矮人面前。",
        "他拿起匕首看了看，然后哈哈大笑：「好！虽然丑了点，但结实！矮人就喜欢结实的东西！」",
        "「通过了！」"
      ];
    }
    return [
      "三个小时后，你只打出了一块歪歪扭扭的铁疙瘩。",
      "矮人看了看，叹了口气：「手艺不行……但你没放弃，这很矮人！」",
      "「算了，你可以做个战士或者矿工！通过了！」"
    ];
  },
  options:[{t:"进行入会仪式", go:"faction_dwarf_joined", effect:{}}]
};}

N["faction_dwarf_joined"] = function(){
  v35_joinFaction("dwarf_kingdom");
  return {
    text:function(){return [
      "矮人带你去了地下酒馆，给你倒了一大杯麦酒。",
      "「欢迎加入矮人王国！」他举杯，「从今天起，你是我们的兄弟！有困难找矮人，矮人一定帮！」",
      "他递给你一把矮人战斧和一个酒壶：「你的第一个任务：去矿洞深处清理一批钻出来的地底生物。」",
      "◆加入矮人王国，获得矮人战斧、麦酒壶，矮人声望+20"
    ];},
    options:[{t:"喝了这杯酒", go:"city_free", effect:{flag:"joined_dwarf_kingdom", time:1}}]
  };
}

N["faction_dwarf_cant"] = function(){ return {
  text:function(){return [
    "矮人摆摆手：「不会锻造不要紧！矮人王国也需要战士、矿工、商人！」",
    "「只要你诚实、勇敢，矮人就欢迎你！怎么样？」"
  ];},
  options:[
    {t:"那我加入", go:"faction_dwarf_test", effect:{}},
    {t:"还是算了", go:"faction_recruit_hub", effect:{}}
  ]
};}

// ===== 兽人王庭 =====
N["faction_orc_intro"] = function(){ return {
  text:function(){return [
    "兽人王庭的帐篷里，篝火熊熊，兽人们围坐在一起喝酒吃肉。",
    "一个浑身伤疤的兽人战士向你走来，他的左眼上有一道深深的刀疤。",
    "「外族的。」他的声音低沉，「你看起来能打。兽人王庭只尊重力量。」",
    "「想加入？先证明你有资格坐在我们的篝火旁。」",
    "他指了指帐篷中央的格斗场：「打赢我的战士，你就是兄弟。打输了，就滚。」"
  ];},
  options:[
    {t:"接受挑战", go:"faction_orc_test", effect:{}},
    {t:"兽人都是野蛮人，我走了", go:"faction_recruit_hub", effect:{}}
  ]
};}

N["faction_orc_test"] = function(){ return {
  text:function(){return [
    "你走进格斗场。一个比你高两个头的兽人战士咆哮着冲了过来。",
    "周围的兽人们疯狂地呐喊，敲打着盾牌。",
    "这是一场纯粹的力量对决——没有魔法，没有诡计，只有拳头和意志。"
  ];},
  options:[{t:"开始战斗", go:"battle_start_orc_warrior", effect:{}}]
};}

N["faction_orc_oath"] = function(){ return {
  text:function(){return [
    "你击败了兽人战士。他倒在地上，喘着粗气，然后突然大笑起来。",
    "「好！好样的！」他爬起来，拍了拍你的背，差点把你拍趴下，「你是个真正的战士！」",
    "疤脸兽人站起来，将一个用狼牙和皮革制作的项链戴在你脖子上。",
    "「从今天起，你是兽人王庭的战士！血为盟，骨为证！」",
    "◆加入兽人王庭，获得兽人项链，兽人声望+20"
  ];},
  options:[{t:"接受项链", go:"faction_orc_joined", effect:{}}]
};}

N["faction_orc_joined"] = function(){
  v35_joinFaction("orc_horde");
  return {
    text:function(){return [
      "兽人们给你端来一大块烤肉和一碗发酵马奶酒。",
      "「你的第一个任务！」疤脸兽人说，「跟着狩猎队去草原深处猎一头巨狼！」",
      "「记住，在草原上，只有强者能活下去。但我们是兄弟——兄弟不会让兄弟死。」",
      "◆获得：兽人战斧、烤肉、狩猎任务"
    ];},
    options:[{t:"开始兽人战士生活", go:"city_free", effect:{flag:"joined_orc_horde", time:1}}]
  };
}

// ===== 深渊教派 =====
N["faction_abyss_intro"] = function(){ return {
  text:function(){return[
    "你在死亡沙漠的边缘迷路了。夜幕降临时，你看到远处有诡异的绿光在闪烁。",
    "你走过去，发现是一个地下洞穴的入口。洞穴里传来低沉的吟唱声。",
    "一个穿黑袍的人从洞穴里走出来，他的眼睛是纯黑色的，没有眼白。",
    "「你来了。」他的声音像是从地底传来，「深渊在呼唤你。你听到了吗？」",
    "你的头开始疼。某种东西确实在呼唤你——来自地底深处。",
    "「加入深渊教派，你将获得超越凡人的力量。代价是……你的一部分人性。」"
  , "吟唱声从洞穴深处传来，像千百个人在同时念同一句话。你站在洞口，感觉到脚下的沙子在一粒一粒往下滑——不是风，是地底有什么东西在吸气。", "黑袍人的眼睛纯黑，没有眼白，可你总觉得，那双眼睛里有什么东西在看你——不是他，是他眼睛后面的什么。", "「你在害怕。」他说，声音平静，「好。害怕的人，才听得见真相。」", "他往洞穴深处走了一步，又停住：「深渊不骗人。它给力量，就明明白白地收代价。它不像教会，不像商会，不像那些嘴上说着爱，手里拿着秤的东西。」", "风从洞里灌出来，带着一股说不清的、又冷又热的气流。你的头发被吹起来，你忽然觉得，那句话里，有什么东西是真的。", "「我不急。」他说，「深渊等得起。你也等得起——在你把人性当回事的那些年里。」", "他转身没入黑暗。洞口重新安静下来，只剩下风，和沙。"];} /*v45inj:faction_abyss_intro*/,
  options:[
    {t:"我愿意付出代价", go:"faction_abyss_test", effect:{san:-15}},
    {t:"这太危险了，离开", go:"faction_recruit_hub", effect:{san:-5}}
  ]
};}

N["faction_abyss_test"] = function(){ return {
  text:function(){
    var spr = S.attrs ? S.attrs.SPR : 10;
    var roll = Math.floor(Math.random()*100)+1;
    if(roll <= spr*2){
      return [
        "黑袍人带你进入洞穴深处。一个巨大的深渊裂缝在洞底张开，紫色的能量从中涌出。",
        "「将手伸入裂缝。」他说，「让深渊进入你的身体。如果你的意志足够强，你将获得力量。如果不够……你将成为深渊的一部分。」",
        "你颤抖着将手伸入裂缝。剧痛传来，但你咬紧牙关，没有尖叫。",
        "「你的意志很强。」黑袍人点头，「通过了。」"
      ];
    }
    return [
      "你将手伸入裂缝，剧痛让你几乎昏厥。你抽回手，发现手背上多了一个紫色的印记。",
      "「虽然不够强，但深渊已经标记了你。」黑袍人说，「你可以加入——但要小心，深渊的呼唤会越来越强。」"
    ];
  },
  options:[{t:"进行深渊契约", go:"faction_abyss_oath", effect:{san:-20}}]
};}

N["faction_abyss_oath"] = function(){ return {
  text:function(){return[
    "黑袍人用一把黑曜石匕首在你手心划了一道口子，将你的血滴入深渊裂缝。",
    "「以深渊之名，以原初之物之名，你愿意将灵魂的一部分献给深渊吗？」",
    "你点头。裂缝中涌出一股能量，注入你的身体。你感觉自己变得更强了，但也……更空了。",
    "「欢迎加入深渊教派。」黑袍人递给你一枚紫色的徽章，「从今天起，深渊与你同在。」",
    "◆加入深渊教派，获得深渊徽章，深渊侵蚀+10%，SAN-20"
  , "宣誓的时候，没有烛火，没有圣像。", "房间里只有一盏灯，灯下放着一碗水。领誓人让你把手按在水面上，说：「以你之名，以水为证。你的名字，将沉入深水，不再浮起。」", "你按着那碗水，水很凉。你念完誓词，领誓人端起碗，把水倒进一个石槽。水顺着石槽流进黑暗里，看不见了。", "「好了。」他说，「从今以后，你的名字，在那本名录上。可那本名录，不在任何人手里。」", "你没有问那本名录在哪里。你只是忽然觉得，那只按过水的手，凉了很久。"];} /*v45inj:faction_abyss_oath*/,
  options:[{t:"接受徽章", go:"faction_abyss_joined", effect:{}}]
};}

N["faction_abyss_joined"] = function(){
  v35_joinFaction("abyss_cult");
  return {
    text:function(){return[
      "你走出洞穴，夜空似乎比平时更暗了。",
      "黑袍人递给你一本用人皮装订的书：「你的第一个任务：去交汇城传播深渊的福音。找到那些对现实绝望的人，让他们听到深渊的呼唤。」",
      "「记住——深渊终将吞噬一切。而我们，将是新世界的主人。」",
      "◆获得：深渊教义、传教任务"
    , "你跟着黑袍人走进洞穴。吟唱声越来越近，越来越清晰——你渐渐听懂了，那不是吟唱，是一句话，被千百个声音反复念着：「我们记得。」", "洞穴深处是一面巨大的石壁，石壁上刻满了发光的符文，像活的。黑袍人站在石壁前，回头看你：「最后一问：你怕死吗？」", "你想了想，说：「怕。」", "他点了点头：「诚实。深渊不要不怕死的人——不怕死的人，用起来不踏实。怕死，才会珍惜深渊给的东西。」", "他划破自己的掌心，让血滴在石壁上。符文亮了一瞬，又暗下去。他把手伸向你：「该你了。一滴血，一个名字。从今往后，深渊记得你。」", "你看着那面石壁。那些符文像眼睛，一眨不眨地看着你。你伸出手，划破掌心。血滴落下去的那一刻，你听见整个洞穴，轻轻地、齐齐地吸了一口气。"];} /*v45inj:faction_abyss_joined*/,
    options:[{t:"开始深渊教派生活", go:"city_free", effect:{flag:"joined_abyss_cult", abyss_corruption:10, time:1}}]
  };
}

console.log('[V36] 9大势力加入剧情线已加载');


/* ============================================================
   v36 序章伏笔回收节点（学院线）
   ============================================================ */

// ===== 黄林晶的信·学院线回收 =====
N["foreshadow_hlj_letter_academy"] = function(){ return {
  text:function(){return [
    "你在学院图书馆的禁书区翻阅时，一本古老的书籍从书架上掉落。",
    "你捡起来，发现书页中夹着一张泛黄的信纸。信纸上的字迹潦草而急切——和你序章中捡到的那半张残页，是同一个人的笔迹。",
    "信上写着：",
    "「……七印不是封印，是枷锁。原初之物不是恶魔，是被囚禁的神。墨丘利，如果你看到这封信，说明我已经失败了。但你必须继续——找到第七印，找到真相……」",
    "署名是：黄林晶。",
    "你想起了序章中那个从沙漠走出的人，他死前交给你的那封信。原来，这一切早就开始了。"
  ];},
  options:[
    {t:"把信交给墨丘利", go:"foreshadow_hlj_to_mercury", effect:{time:1}},
    {t:"自己藏起来继续调查", go:"foreshadow_hlj_investigate", effect:{time:1, san:-5}},
    {t:"烧掉这封信", go:"foreshadow_hlj_burn", effect:{time:1}}
  ]
};}

N["foreshadow_hlj_to_mercury"] = function(){ return {
  text:function(){return [
    "你找到墨丘利，把信交给他。",
    "他看完信后，沉默了很久。他的手在微微颤抖。",
    "「黄林晶……是我的老师。」他终于开口，「三十年前，他去调查第七印，然后就消失了。所有人都说他死了。」",
    "他抬起头看着你，眼神复杂：「谢谢你把这封信交给我。有些真相……我需要时间来消化。」",
    "「但你要小心。知道这件事的人，都会被盯上。」",
    "◆墨丘利好感+15，获得线索：黄林晶的调查笔记位置"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_hlj_investigate"] = function(){ return {
  text:function(){return [
    "你把信藏好，开始在图书馆中搜索关于黄林晶的记录。",
    "你发现，三十年前，黄林晶是学院最天才的学生。他在毕业前突然退学，然后就消失了。",
    "他的研究笔记被列为禁书，存放在禁书区的最深处。",
    "你决定找机会去看看那些笔记。",
    "◆获得线索：黄林晶的研究笔记在禁书区第三层"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_hlj_burn"] = function(){ return {
  text:function(){return [
    "你点燃了信纸。火焰吞噬了那些文字。",
    "但在信被完全烧掉之前，你看到了最后一行字：",
    "「……不要相信墨丘利……」",
    "信烧成了灰烬。你不知道这句话是什么意思，但它让你脊背发凉。",
    "◆SAN-5，获得线索：不要相信墨丘利？"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 守望者密探·学院线回收 =====
N["foreshadow_watcher_academy"] = function(){ return {
  text:function(){return [
    "你总觉得有人在看你。",
    "今天，那种感觉特别强烈。你回头，看到一个穿灰袍的人站在林荫大道的尽头。",
    "你走过去。他没有逃。",
    "「我们又见面了。」他的声音很平静，「序章时，我就在观察你。现在，我有一个问题要问你。」",
    "「你在序章中做的那些选择——你后悔吗？」"
  ];},
  options:[
    {t:"我不后悔", go:"foreshadow_watcher_proud", effect:{}},
    {t:"有些选择我确实后悔了", go:"foreshadow_watcher_regret", effect:{}},
    {t:"你是谁？为什么一直在观察我？", go:"foreshadow_watcher_identity", effect:{}}
  ]
};}

N["foreshadow_watcher_proud"] = function(){ return {
  text:function(){return [
    "灰袍人点了点头。",
    "「不后悔的人，要么是真正的英雄，要么是真正的恶魔。」他说，「我还不确定你是哪一种。」",
    "「但守望者会继续观察你。做出更多选择吧——你的每一个选择，都在书写历史。」",
    "他转身消失在人群中。你摸了摸胸口，那里有一枚你序章时获得的、不知道什么材质的徽章。",
    "◆守望者声望+10"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_watcher_regret"] = function(){ return {
  text:function(){return [
    "灰袍人沉默了片刻。",
    "「后悔是人之常情。」他说，「但后悔也是一种力量——它让你在未来做出更好的选择。」",
    "「守望者记录历史，但我们也相信，人可以改变历史。你的过去已经无法改变，但你的未来还在你手中。」",
    "他递给你一枚小小的银色眼睛徽章：「如果你想了解更多关于守望者的事，拿着这个去交汇城的老书店。」",
    "◆获得守望者徽章，守望者声望+15"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_watcher_identity"] = function(){ return {
  text:function(){return [
    "灰袍人微微一笑。",
    "「我是守望者。我们观察、记录、维护平衡。我们已经观察这个世界三千年了。」",
    "「至于为什么观察你——因为你是特殊的。你的命运线，和七印、和原初之物、和这个世界的未来，都交织在一起。」",
    "「你序章中做的每一个选择，都在影响这个世界的走向。我们需要知道，你会把世界带向何方。」",
    "他转身离开：「想加入我们的话，去交汇城找老书店的店主。」",
    "◆获得线索：守望者招募地点"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 序章道德选择·学院线回收 =====
N["foreshadow_moral_academy"] = function(){ return {
  text:function(){return [
    "学院的食堂里，你听到旁边的学生在议论什么。",
    "「听说了吗？交汇城有个面包店老板，最近在找一个人。他说几年前有人偷了他的面包，但他不恨那个人——他说那个人一定是饿坏了。」",
    "另一个学生说：「还有个难民，说是被一个好心人救过，现在发达了，到处找那个恩人报恩。」",
    "你心里一动。这些事……似乎和你序章中的某些选择有关。"
  ];},
  options:[
    {t:"去打听更多", go:"foreshadow_moral_investigate", effect:{time:1}},
    {t:"装作没听见", go:"academy_elda_hub", effect:{time:1}}
  ]
};}

N["foreshadow_moral_investigate"] = function(){ return {
  text:function(){
    var moral = S.moralChoices ? S.moralChoices : {};
    var text = ["你开始打听这些事的细节。"];
    if(moral.bread_steal === true){
      text.push("面包店老板确实在找你。他说：「那个偷面包的孩子，如果他现在还饿，我愿意再给他一个。」");
      text.push("你没有承认。但你心里有种说不出的滋味。");
    }
    if(moral.refugee_help === true){
      text.push("那个难民真的发达了。他现在是一个小商会的会长，在到处找当年给他钱的人。");
      text.push("他说：「没有那个人，我早就死了。我要报答他。」");
    }
    if(moral.bread_steal !== true && moral.refugee_help !== true){
      text.push("你打听了一圈，但这些事似乎和你没有直接关系。也许只是巧合。");
    }
    text.push("◆序章的选择，正在以你意想不到的方式影响着现在。");
    return text;
  },
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 第一印碎块·学院线回收 =====
N["foreshadow_seal_fragment_academy"] = function(){ return {
  text:function(){return [
    "你在学院的灵魂魔法塔中修炼时，胸口突然传来一阵灼热。",
    "你序章中接触第一印碎片时获得的那个印记，正在发光。",
    "一段不属于你的记忆涌入你的脑海：",
    "「……第一印不是封印，是门。门的后面，是原初之物的沉睡之地。不要打开门——至少，不要在你准备好之前……」",
    "记忆消失了。你发现自己出了一身冷汗。",
    "墨丘利不知何时站在你身后，他看着你胸口的印记，脸色凝重。",
    "「你……接触过第一印的碎片？」"
  ];},
  options:[
    {t:"如实告诉他", go:"foreshadow_seal_tell", effect:{}},
    {t:"否认", go:"foreshadow_seal_deny", effect:{}}
  ]
};}

N["foreshadow_seal_tell"] = function(){ return {
  text:function(){return [
    "你如实告诉了墨丘利序章中发生的事。",
    "他听完后，沉默了很久。",
    "「第一印的碎片……已经有三百年没有人接触过了。」他说，「你能活下来，说明你和七印有某种特殊的联系。」",
    "「这种联系，可能是你的幸运，也可能是你的诅咒。」",
    "「跟我来。我有一些东西要给你看。」",
    "◆墨丘利好感+10，获得线索：第一印的真相"
  ];},
  options:[{t:"跟他走", go:"academy_elda_soul_tower", effect:{time:1}}]
};}

N["foreshadow_seal_deny"] = function(){ return {
  text:function(){return [
    "你摇了摇头：「没有，我不知道你在说什么。」",
    "墨丘利看了你很久，然后叹了口气。",
    "「每个人都有自己的秘密。」他说，「但记住——七印的秘密，不是你一个人能承担的。当你准备好的时候，来找我。」",
    "他转身离开。你摸了摸胸口的印记，它还在微微发热。",
    "◆墨丘利好感-5，但你保守了自己的秘密"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

console.log('[V36] 序章伏笔回收节点已加载（黄林晶信/守望者/道德选择/第一印碎块）');


/* ============================================================
   v36 结局线联动补充
   ============================================================ */

// ===== 终局前·选择回顾（确保所有选择影响结局）=====


// ============================================================
// v37 序章深度化 - 连续叙事工程
// 9条出身线各补充15-20个连续叙事节点
// ============================================================

// ========== 出身线1：自由城邦（交汇城）· 市井中的暗流 ==========

N["origin_free_daily_1"]=function(){return{
place:"交汇城 · 贫民窟",
text:["天还没亮，商会的仓库门口就亮起了灯。", "你打着哈欠赶到的时候，李管事已经在清点货物了。他头也不抬：「今天的货，送到东市的绸缎庄，三箱。路上别耽搁。」", "你应了一声，搬起箱子往车上装。箱子不算重，但有个箱子特别沉，你掂了掂，里面像是装了铁器。", "李管事瞥了你一眼：「不该问的别问。」", "你闭上嘴，把箱子码好。晨光里，车辙碾过石板路，发出吱呀吱呀的响声，像这座城还没睡醒的梦话。", "天还没亮，交汇城的贫民窟就已经醒了。", "你躺在阁楼的硬板床上，听着楼下传来的声音——张婶在剁肉馅，刀落在砧板上，一下一下，像某种古老的节拍。隔壁的酒鬼又在骂他的老婆，骂声穿过薄得像纸的墙壁，带着一股廉价麦酒的酸臭味。", "空气里弥漫着煤烟、泔水和远处港口飘来的鱼腥气。这是交汇城的味道——繁华与腐烂交织，富人在山巅的别墅里喝着精灵葡萄酒，穷人在山脚的贫民窟里抢着发霉的面包。", "你翻身坐起来，木板床发出吱呀的呻吟。阁楼矮得你直不起腰，只能弓着身子摸到墙角的水盆。水是昨天接的雨水，上面漂着一层灰。你洗了把脸，冰冷的水让你彻底清醒。", "今天是你给商会跑腿的第三天。再干两天，就能拿到这个月的工钱——五个银币。够买半袋粗粮，还能给隔壁瞎眼的李婆婆送两个铜板。", "你穿上那件打了七个补丁的短褂，推开阁楼的小窗。", "窗外，交汇城正在苏醒。", "你赶着车穿过市集的时候，卖菜的王婶叫住你：「小跑腿的，听说北边又打仗了？你叔那边有消息没有？」", "你摇了摇头。王婶叹了口气，塞给你一个热乎乎的饼：「拿着，路上吃。打仗归打仗，日子还得过。」", "你咬了一口饼，麦香混着葱花的味道，烫得你直吸气。你忽然觉得，这饼比什么都实在。", "东市的绸缎庄前，你卸完货，掌柜数了铜板给你。你数了数，多了两个——「跑腿辛苦，拿去喝茶。」", "你攥着那两枚多出来的铜板，站在人来人往的街口，忽然觉得，这一天，好像也没那么糟。"] /*v45inj:origin_free_daily_1*/,
options:[
{t:"下楼开始今天的跑腿工作", go:"origin_free_daily_2"},
{t:"先去看看李婆婆", go:"origin_free_daily_li"},
{t:"在窗边多看看这座城市", go:"origin_free_daily_look"}
]}};

N["origin_free_daily_li"]=function(){return{
place:"交汇城 · 李婆婆家",
text:[
"你轻手轻脚地下了楼，绕过楼道里堆积的杂物，敲响了李婆婆家的门。",
"门吱呀一声开了，露出一张布满皱纹的脸。李婆婆的眼睛早就瞎了，但她的耳朵比谁都灵。",
"「是小崽子吧？」她的声音沙哑，像砂纸磨过木头，「今天又来给我送吃的？」",
"你从怀里掏出昨天剩下的半个硬面包，塞到她手里。她的手瘦得像鸡爪，皮肤冰凉，指节肿大。",
"「你自己都吃不饱，还惦记我这个老不死的。」她嘟囔着，但手却紧紧攥着面包，「你娘要是还在，看到你这样，该心疼了。」",
"你心里一酸。你娘在你八岁那年就走了，病死的。要是当时有十个银币请个牧师，她也许还能活。但你们家连一个银币都拿不出来。",
"「婆婆，我去干活了。晚上给你带热汤回来。」你转身要走。",
"「等等。」李婆婆突然抓住你的袖子，她的手在发抖，「最近城里不太平。你跑腿的时候，别去码头那边的仓库。听到了吗？」",
"「怎么了？」",
"「前天晚上，有三个人在码头仓库附近失踪了。都是像你这样的年轻人。」她的声音压得很低，「有人说，是暗蚀会的人在抓活人做实验。也有人说，是守望者在清理叛徒。总之，别去那边。」",
"你心里咯噔一下。暗蚀会——这个名字你听过，是大陆上最神秘的邪教组织，据说他们用活人做灵魂实验。守望者——你也听过，是一群自称「守护世界平衡」的神秘人，据说他们比暗蚀会还要危险。",
"「知道了，婆婆。我会小心的。」"
],
options:[
{t:"答应婆婆，不去码头仓库", go:"origin_free_daily_2", effect:{flags:["li_warning"]}},
{t:"嘴上答应，心里却想去看看", go:"origin_free_daily_2", effect:{flags:["curious_warehouse"]}}
]}};

N["origin_free_daily_look"]=function(){return{
place:"交汇城 · 阁楼窗边",
text:[
"你靠在窗边，看着这座你生活了十六年的城市。",
"交汇城，大陆的中心，自由城邦的心脏。它建在一座小山的山脚下，从山脚到山顶，层层叠叠地铺满了建筑。",
"山脚是贫民窟和码头，永远弥漫着鱼腥和煤烟。山腰是商业区，商铺林立，人声鼎沸。山顶是贵族区，别墅林立，绿树成荫，那里的空气永远是甜的——因为富人用魔法净化了他们的空气。",
"你看着山顶那座最高的钟楼，那是交汇城的标志。每天清晨和傍晚，钟楼都会敲响，钟声传遍整座城市。你小时候总觉得，那钟声像是某种召唤，在呼唤你离开这个贫民窟，去看看外面的世界。",
"但你知道，那只是奢望。在这个世界，出身决定了一切。你是贫民窟的孩子，你的未来大概就是在商会跑一辈子腿，然后在四十岁那年病死，像你娘一样。",
"除非——有什么奇迹发生。",
"你正想着，突然看到远处的天空闪过一道诡异的紫光。那光只持续了一瞬间，但你敢发誓，你看到了。",
"那是什么？是魔法？还是某种不祥的征兆？",
"你揉了揉眼睛，再看时，天空已经恢复了正常。也许是你眼花了。",
"但你心里有种奇怪的感觉——从今天起，有什么东西不一样了。"
],
options:[
{t:"下楼开始工作", go:"origin_free_daily_2", effect:{flags:["saw_purple_light"]}},
{t:"再等等看，也许还会有异常", go:"origin_free_daily_wait"}
]}};

N["origin_free_daily_wait"]=function(){return{
place:"交汇城 · 阁楼窗边",
text:[
"你决定再等等看。",
"时间一分一秒地过去，太阳慢慢升起来了，金色的阳光洒在交汇城的屋顶上，把那些破旧的瓦片照得发亮。",
"你等了大约一刻钟，什么也没发生。也许真的是你眼花了。",
"就在你准备转身离开的时候，你突然听到楼下传来一阵急促的脚步声。然后是一个女人的尖叫声。",
"「杀人了！杀人了！」",
"你的心猛地一跳。你探出头往楼下看，只见一个穿着商会制服的男人倒在巷子里，胸口插着一把匕首，鲜血染红了他身下的青石板。",
"周围围了一圈人，但没有人敢上前。在交汇城，多管闲事的人往往活不长。",
"你认出了那个男人——他是王会长的贴身护卫，昨天你去商会交差的时候还见过他。他叫什么来着？好像叫老赵。",
"老赵死了。被人当街杀死了。",
"你心里一阵发冷。王会长是交汇城最大的商会会长，他的护卫被人当街杀死，这意味着什么？意味着有人在挑战王会长的权威。或者——意味着王会长自己出了问题。",
"你正想着，突然看到巷子的阴影里闪过一个人影。那个人穿着黑色的斗篷，动作快得像猫，一转眼就消失在了巷子的尽头。",
"你敢发誓，你看到那个人的斗篷上绣着一个诡异的符号——一个被七道锁链缠绕的眼睛。",
"那个符号，你在李婆婆家的旧书上看到过。那是——暗蚀会的标志。"
],
options:[
{t:"下楼去看看老赵的尸体", go:"origin_free_abnormal_1", effect:{flags:["saw_eclipse_symbol"]}},
{t:"假装没看到，赶紧离开", go:"origin_free_daily_2", effect:{flags:["avoided_murder"]}},
{t:"跟踪那个黑衣人", go:"origin_free_abnormal_follow"}
]}};



// ========== 自由城邦·异常卷 ==========

N["origin_free_abnormal_1"]=function(){return{
place:"交汇城 · 码头仓库区",
text:[
"你最终还是去了码头仓库区。",
"不是因为好奇，而是因为王会长给你的任务——把一个密封的木箱送到码头仓库的三号库。",
"「记住，」王会长把木箱交给你的时候，眼神很奇怪，「别打开箱子，别问里面是什么，送到就走。」",
"你抱着木箱，感觉它比看起来要重。而且，你能感觉到箱子里有什么东西在跳动——像心跳，又像某种古老的脉搏。",
"码头仓库区在交汇城的最东边，紧邻着港口。这里是整个城市最混乱的地方——走私犯、海盗、奴隶贩子、暗蚀会的外围成员，各色人等都在这里活动。",
"你走在仓库之间的窄巷里，空气里弥漫着海盐、鱼腥和某种说不清的腐臭味。巷子很暗，两边的仓库像巨大的怪兽，沉默地矗立着。",
"你走到三号库门口，正准备敲门，突然听到里面传来一个声音。",
"「……第七个了。再找三个，仪式就能开始了。」",
"另一个声音响了起来，带着某种疯狂的兴奋：「太好了。等仪式完成，我们就能获得深渊的力量，到时候，整个交汇城都将臣服于暗蚀会！」",
"你的心猛地一跳。暗蚀会！他们在三号库里！而且，他们在抓人——「第七个了」，意味着已经有七个人被他们抓了。",
"你抱着木箱，站在门口，进退两难。",
"如果敲门，你可能也会被他们抓起来，成为第八个祭品。",
"如果离开，王会长那边没法交代——而且，那些被抓的人怎么办？",
"你正犹豫着，怀里的木箱突然剧烈地跳动起来。然后，箱子的缝隙里透出一道诡异的紫光。",
"「什么人？！」仓库里的人听到了动静，大声喝道。",
"你知道，你暴露了。"
],
options:[
{t:"放下箱子，赶紧跑", go:"origin_free_abnormal_run", effect:{flags:["escaped_eclipse"]}},
{t:"敲门，假装是送货的", go:"origin_free_abnormal_knock", effect:{flags:["entered_eclipse_warehouse"]}},
{t:"大声喊「有人吗？我是商会送货的！」", go:"origin_free_abnormal_shout"}
]}};

N["origin_free_abnormal_run"]=function(){return{
place:"交汇城 · 码头仓库区",
text:[
"你放下木箱，转身就跑。",
"身后传来仓库门被撞开的声音，然后是一阵急促的脚步声。",
"「别让他跑了！」",
"你拼命地跑，穿过迷宫一样的仓库巷子。你的心跳得像擂鼓，肺像要炸开一样。",
"你对这片区域很熟——你小时候经常在这里捉迷藏。你钻进一条只有你知道的窄巷，翻过一堵矮墙，躲进了一个废弃的仓库里。",
"你蜷缩在仓库的角落里，听着外面的脚步声越来越近，然后又越来越远。",
"他们没有找到你。",
"你松了一口气，瘫坐在地上。你的衣服全湿透了，手心全是冷汗。",
"你在仓库里躲了大约半个时辰，直到外面彻底安静下来，才敢探出头去。",
"码头仓库区已经恢复了平静，好像什么都没发生过一样。但你知道，在那平静的表象下，有什么邪恶的东西正在酝酿。",
"你回到商会，王会长看到你一个人回来，脸色变了。",
"「箱子呢？」",
"「我……我遇到了暗蚀会的人，箱子丢了。」你撒了个谎。",
"王会长盯着你看了很久，眼神复杂。然后他叹了口气。",
"「算了，丢了就丢了。你走吧，今天的工钱照付。」",
"你接过王会长递来的五个银币，心里却沉甸甸的。",
"你知道，这件事还没完。"
],
options:[
{t:"回家，今天太累了", go:"origin_free_choice_1"},
{t:"去李婆婆家，告诉她发生了什么", go:"origin_free_choice_li"},
{t:"去城里的守卫队报案", go:"origin_free_choice_guard"}
]}};

// ========== 自由城邦·抉择卷 ==========

N["origin_free_choice_1"]=function(){return{
place:"交汇城 · 贫民窟阁楼",
text:[
"你回到了贫民窟的阁楼，瘫坐在硬板床上。",
"今天发生的事情像放电影一样在你脑海里反复播放——暗蚀会的仓库、被抓的七个人、诡异的紫光、王会长复杂的眼神。",
"你隐隐觉得，王会长和暗蚀会有勾结。那个木箱里装的，可能就是暗蚀会需要的东西。",
"但你能怎么办？你只是一个贫民窟的穷小子，无权无势，连自己都养不活，怎么可能和暗蚀会对抗？",
"也许，你应该装作什么都不知道，继续过你的日子。",
"但你一想到那些被抓的人——他们可能和你一样，都是穷人，都是为了生存才在码头打工——你心里就像被针扎了一样。",
"你正想着，突然听到楼下传来一阵敲门声。",
"「小崽子，在家吗？」是李婆婆的声音，很急促。",
"你下楼打开门，李婆婆站在门口，脸色苍白。",
"「出事了。」她的声音在发抖，「今天下午，守卫队去码头仓库搜查，结果……结果七具尸体。都是年轻人，和你差不多大。」",
"你的心猛地一沉。",
"「暗蚀会干的？」",
"「除了他们还能有谁。」李婆婆叹了口气，「守卫队说，那些人的灵魂都被抽走了，尸体成了空壳。」",
"你靠在墙上，感觉浑身发冷。",
"如果你当时没有跑，如果你被他们抓了，现在的第八具尸体，可能就是你。",
"「小崽子，」李婆婆看着你，眼神很认真，「我知道你今天去过码头。我也知道，你看到了什么。」",
"你惊讶地看着她。",
"「婆婆，你怎么……」",
"「我老了，但我不瞎。」她打断你，「现在，你有两个选择。第一，装作什么都不知道，继续过你的日子。第二，做点什么。」",
"「做点什么？我能做什么？」",
"「守望者。」李婆婆吐出这三个字，声音压得很低，「守望者一直在和暗蚀会对抗。如果你去找他们，也许……也许能为那些死去的人做点什么。」",
"你沉默了。",
"守望者——这个名字你听过，但你一直以为那只是传说。",
"「婆婆，你怎么知道这些？」",
"李婆婆没有回答，只是从怀里掏出一枚旧得发黑的徽章，塞到你手里。",
"「如果你决定去找守望者，就拿着这个。去城西的旧钟楼，在午夜时分，敲三下钟，然后说「眼睛在看着」。会有人来找你的。」",
"你握着那枚徽章，感觉它沉甸甸的。",
"「婆婆，你到底是什么人？」",
"李婆婆笑了，笑容里带着一丝苦涩。",
"「我只是一个瞎了眼的老太婆。但年轻的时候……我也曾是守望者的一员。」"
],
options:[
{t:"决定去找守望者", go:"origin_free_choice_watcher", effect:{flags:["joined_watcher_path"], items:["watcher_badge"]}},
{t:"决定装作什么都不知道", go:"origin_free_choice_ignore", effect:{flags:["ignored_eclipse"]}},
{t:"先不做决定，再想想", go:"origin_free_choice_wait"}
]}};

// ========== 自由城邦·离别卷 ==========

N["origin_free_leave_1"]=function(){return{
place:"交汇城 · 贫民窟阁楼",
text:[
"三天后，你收到了一封信。",
"信是用精灵纸写的，散发着淡淡的墨香。信封上没有寄信人的名字，只有一个火漆印章——七颗星星环绕着一本打开的书。",
"你认出了那个印章。那是艾尔达大陆学院的校徽。",
"你拆开信，里面是一张录取通知书，还有一张船票。",
"「兹录取你为艾尔达大陆学院第4037届新生。请于本月十五日前，乘坐信中所附船票，前往交汇城码头，学院将有专人接待。」",
"你拿着录取通知书，手在发抖。",
"艾尔达大陆学院——大陆最顶尖的学院，无数人挤破头都想进去的地方。你从来没想过，自己会收到它的录取通知书。",
"你是怎么被录取的？你既没有钱交学费，也没有贵族推荐，更没有什么惊人的天赋。",
"你突然想起了三天前发生的事情——暗蚀会的仓库、守望者的徽章、李婆婆的话。",
"难道……是守望者推荐了你？",
"你正想着，李婆婆敲门走了进来。",
"「收到了？」她看着你手里的通知书，笑了。",
"「婆婆，这是怎么回事？」",
"「守望者的推荐。」李婆婆简单地说，「他们一直在观察你。你有他们需要的品质——善良、勇敢、还有一颗不肯向黑暗低头的心。」",
"「可是……我没钱交学费。」",
"「守望者已经替你交了第一年的学费。」李婆婆说，「以后的学费，要靠你自己了。学院有奖学金，也有勤工俭学的机会。以你的能力，应该没问题。」",
"你沉默了很久。",
"「婆婆，我走了，你怎么办？」",
"「我一个瞎老太婆，怎么都能活。」李婆婆摆摆手，「倒是你，到了学院，要好好学。别给我这个老太婆丢脸。」",
"你看着李婆婆布满皱纹的脸，眼眶一热。",
"这个瞎眼的老太婆，在你娘死后一直照顾你，给你吃的，给你穿的，现在又给你争取到了一个改变命运的机会。",
"「婆婆，」你跪了下来，「我一定会回来的。等我学成了，我就回来接你，让你过上好日子。」",
"李婆婆扶起你，拍了拍你的肩膀。",
"「傻孩子，我不需要你接我。我只需要你记住——不管你将来成为什么样的人，都不要忘记你从哪里来，不要忘记你是谁。」",
"你用力地点了点头。"
],
options:[
{t:"开始收拾行李", go:"origin_free_leave_2"},
{t:"再去城里转转，最后看看这座城市", go:"origin_free_leave_walk"},
{t:"去和朋友们告别", go:"origin_free_leave_friends"}
]}};

N["origin_free_leave_2"]=function(){return{
place:"交汇城 · 贫民窟阁楼",
text:[
"你开始收拾行李。",
"其实也没什么好收拾的——几件换洗衣服，一双快要磨破的鞋，一把你娘留给你的旧匕首，还有李婆婆给你的守望者徽章。",
"你把这些东西塞进一个旧布包里，布包是你娘生前用的，上面还绣着一朵已经褪色的花。",
"你坐在硬板床上，看着这间你住了十六年的阁楼。",
"阁楼很小，很矮，很暗。墙上的墙皮已经剥落了，露出里面的青砖。墙角有一个蜘蛛网，蜘蛛已经不在了，只剩下一张破旧的网。",
"你在这里出生，在这里长大，在这里失去了母亲，在这里度过了无数个饥寒交迫的夜晚。",
"你对这里没有什么美好的回忆，但你知道，你永远不会忘记这里。",
"因为这里是你的家。",
"你正出神，突然听到楼下传来一阵喧闹声。",
"你探出头往楼下看，只见一群人围在巷子口，中间是一个穿着华丽衣服的男人——是王会长。",
"王会长站在巷子口，手里拿着一个纸袋，大声喊着你的名字。",
"「小崽子！在家吗？我给你送东西来了！」",
"你心里一惊。王会长怎么会来这里？他来找你干什么？",
"你犹豫了一下，还是下了楼。",
"王会长看到你，脸上堆起笑容。",
"「小崽子，听说你被艾尔达大陆学院录取了？」",
"你心里一紧。他怎么知道的？",
"「王会长，你怎么……」",
"「交汇城就这么大，有什么事能瞒得过我？」王会长把手里的纸袋塞给你，「这里是五十个金币，算是我给你的路费。到了学院，好好学，别给我丢脸。」",
"你看着手里的纸袋，愣住了。五十个金币——这相当于你跑腿十年的工钱。",
"「王会长，这……我不能要。」",
"「让你拿着你就拿着。」王会长的脸色突然严肃起来，「小崽子，我知道你在想什么。你在想，我和暗蚀会有勾结，对不对？」",
"你没说话，但你的眼神已经说明了一切。",
"王会长叹了口气。",
"「有些事情，不是你想的那么简单。」他的声音很低，「我确实和暗蚀会有生意往来，但我不是他们的人。我只是……在这个混乱的世界里，想活下去而已。」",
"「那些被抓的人……」",
"「我知道。」王会长的眼神里闪过一丝痛苦，「我救不了他们。但我可以救你。小崽子，你和他们不一样。你有机会离开这里，有机会成为不一样的人。」",
"他拍了拍你的肩膀。",
"「去吧。到了学院，好好学。等你有能力了，再来改变这个世界。」",
"说完，他转身走了，华丽的衣服在贫民窟的巷子里显得格格不入。",
"你站在原地，手里攥着那袋金币，心里五味杂陈。",
"这个世界，从来不是非黑即白的。"
],
options:[
{t:"收下金币，继续收拾行李", go:"origin_free_leave_3", effect:{gold:50}},
{t:"把金币还回去", go:"origin_free_leave_3", effect:{flags:["refused_wang_money"]}}
]}};



// ========== 出身线2：北方公国（铁门关）· 风雪中的坚守 ==========

N["origin_north_daily_1"]=function(){return{
place:"铁门关 · 军营",
text:[
"铁门关的冬天，是从九月开始的。",
"你站在军营的操场上，寒风像刀子一样刮在脸上，把你的耳朵冻得生疼。呼出的气在空气中凝成白雾，一转眼就被风吹散了。",
"操场上，几百个士兵正在操练。他们穿着厚重的皮甲，手持长矛，在军官的口令下整齐地刺出、收回。长矛划破空气的声音，混合着士兵们的喘息声和军官的骂声，构成了铁门关最熟悉的旋律。",
"你是其中的一员。不，准确地说，你是一个杂役——负责给士兵们做饭、洗衣服、打扫马厩。你还没有资格上战场，因为你只有十六岁，而且你是个孤儿。",
"三年前，深渊生物袭击了你所在的村庄。你的父母、你的妹妹、你的邻居，所有人都死了。只有你，因为那天去山上砍柴，逃过了一劫。",
"你回到村庄的时候，看到的是一片火海。房子烧光了，人烧成了焦炭，连村口的那棵老槐树都烧成了一根黑炭。",
"你在废墟里坐了三天三夜，没有哭，也没有说话。直到撤退的军队经过，一个老兵把你拉了起来。",
"「孩子，跟我走吧。留在这儿，你也活不了。」",
"于是你跟着军队来到了铁门关，成了军营里的一个杂役。",
"三年来，你每天天不亮就起床，挑水、劈柴、做饭、洗衣服、打扫马厩，一直忙到深夜。你没有抱怨过，因为你知道，比起那些死去的人，你已经很幸运了。",
"但你心里一直有一团火。",
"你想上战场。你想杀深渊生物。你想为你的父母、你的妹妹、你的村庄报仇。",
"「发什么呆？！」一个粗哑的声音在你耳边响起，紧接着是一脚踹在你的屁股上。",
"你踉跄了一下，回头看到了炊事班的班长——一个满脸横肉的中年男人，大家都叫他王胖子。",
"「柴劈完了吗？水挑满了吗？马厩打扫了吗？！」王胖子唾沫横飞地骂道，「一天到晚发呆，我看你是想挨鞭子了！」",
"「对不起，班长。我马上去。」你低着头，转身往柴房走去。",
"王胖子在你身后骂骂咧咧了几句，然后走了。",
"你走到柴房，拿起斧头，开始劈柴。斧头落在木头上，发出沉闷的声响。一下，一下，又一下。",
"你把所有的愤怒、所有的悲伤、所有的不甘，都倾注在了这把斧头上。",
"木头在你的斧下纷纷裂开，露出里面白色的木纹。",
"你正劈着，突然听到军营的方向传来一阵急促的号角声。",
"那是——敌袭的号角。",
"你的心猛地一跳。"
],
options:[
{t:"放下斧头，往军营跑去", go:"origin_north_abnormal_1"},
{t:"躲在柴房里，不敢出去", go:"origin_north_abnormal_hide"},
{t:"拿起斧头，准备战斗", go:"origin_north_abnormal_fight", effect:{flags:["picked_axe"]}}
]}};

N["origin_north_abnormal_1"]=function(){return{
place:"铁门关 · 城墙",
text:[
"你放下斧头，拼命地往军营跑去。",
"路上，你看到士兵们纷纷从营房里冲出来，有的在穿盔甲，有的在拿武器，有的在往城墙的方向跑。空气中弥漫着紧张的气氛，每个人的脸上都写满了凝重。",
"你跟着人群跑到了城墙上。",
"城墙外，是一片白色的雪原。但现在，那片白色的雪原上，出现了无数黑色的影子。",
"深渊生物。",
"你数不清有多少只——几百只？几千只？它们像潮水一样从北方涌来，黑压压的一片，把整个雪原都覆盖了。",
"你认出了其中的一些——有像狼一样的影狼，有像熊一样的暗影熊，有像人一样但长着四只手臂的深渊战士，还有一些你叫不出名字的、奇形怪状的生物。",
"它们的眼睛都是红色的，在白色的雪原上像无数盏鬼火。",
"你的腿在发抖。你从来没有见过这么多深渊生物。三年前袭击你村庄的，只有十几只，就已经把整个村庄毁灭了。现在，眼前有几百只、几千只。",
"「全体戒备！」一个洪亮的声音在城墙上响起。",
"你转过头，看到了铁门关的守将——李将军。他是一个五十多岁的老兵，脸上有一道从额头延伸到下巴的伤疤，那是十年前和深渊生物战斗时留下的。",
"李将军站在城墙的最高处，身披重甲，手持长剑，眼神锐利得像鹰。",
"「弓箭手准备！」他大声下令，「等它们进入射程，再放箭！」",
"城墙上的弓箭手们纷纷拉开了弓，箭头对准了城外的深渊生物群。",
"你站在城墙的角落里，看着这一切，感觉自己像一只蚂蚁，在一场即将到来的风暴面前，渺小得微不足道。",
"「你！」一个声音在你身边响起。",
"你转过头，看到了一个老兵——就是三年前把你从废墟里拉起来的那个老兵。大家都叫他老赵。",
"老赵的脸上有一道新的伤口，血还在流。他看到你，皱了皱眉。",
"「你怎么在这儿？这不是你该来的地方！」",
"「赵叔，我想帮忙。」你说。",
"「帮忙？你能帮什么忙？」老赵苦笑了一下，「你连武器都没有。」",
"就在这时，城外的深渊生物群突然发出了一阵震耳欲聋的嘶吼。然后，它们开始冲锋了。",
"像黑色的潮水一样，它们朝着城墙涌来。大地在它们的脚下颤抖，积雪被它们的蹄子扬起，形成了一片白色的雾。",
"「放箭！」李将军大声下令。",
"箭如雨下。",
"无数支箭从城墙上射出，划破空气，朝着深渊生物群飞去。冲在最前面的影狼纷纷中箭，倒在了雪地上。但后面的深渊生物踩着它们的尸体，继续往前冲。",
"「它们太多了！」一个士兵惊恐地喊道，「我们守不住的！」",
"「闭嘴！」李将军厉声喝道，「铁门关守了三十年，从来没有被攻破过！今天也不会！」",
"你站在城墙的角落里，看着这场惨烈的战斗，心里突然涌起了一股强烈的冲动。",
"你想战斗。你想杀深渊生物。你想报仇。",
"你看到脚边有一把掉落的长矛——应该是某个士兵慌乱中掉的。",
"你弯腰，捡起了那把长矛。",
"长矛很沉，你的手在发抖。但你紧紧地握着它，指节都发白了。",
"「你干什么？！」老赵看到你捡起长矛，脸色一变，「放下！你疯了？！」",
"「赵叔，」你看着他，声音在发抖，但眼神很坚定，「我等这一天，等了三年了。」"
],
options:[
{t:"拿着长矛，加入战斗", go:"origin_north_choice_1", effect:{flags:["joined_battle"]}},
{t:"放下长矛，去后方帮忙救治伤员", go:"origin_north_choice_heal", effect:{flags:["became_medic"]}},
{t:"逃离城墙，找个安全的地方躲起来", go:"origin_north_choice_flee"}
]}};

// ========== 出身线3：南方商业城邦（南方港城）· 海浪下的秘密 ==========

N["origin_south_daily_1"]=function(){return{
place:"南方港城 · 码头",
text:[
"南方港城的夏天，是从四月开始的。",
"你站在码头的礁石上，看着眼前的大海。海水是深蓝色的，在阳光下泛着金色的光芒。海风带着咸味和湿热的气息，吹在你脸上，让你感觉浑身黏糊糊的。",
"码头上人来人往，商人、水手、搬运工、妓女，各色人等忙忙碌碌。空气里弥漫着海盐、鱼腥、香料和汗水的味道。远处，几艘巨大的商船正在卸货，搬运工们扛着沉重的货箱，在跳板上来回穿梭。",
"你是「海鸥号」商船上的一个学徒水手。说是学徒，其实就是个杂役——擦甲板、洗缆绳、搬货物、给船长端茶倒水，什么脏活累活都干。",
"你今年十六岁，在这艘船上已经干了三年了。三年前，你爹病死了，你娘改了嫁，继父嫌你是个累赘，把你卖给了商船的船长。",
"「十个银币，这孩子归你了。」继父数着银币，脸上笑开了花。",
"你娘站在旁边，低着头，没有说话。你看着她，她也看着你，眼里有泪，但她什么都没说。",
"于是你就上了「海鸥号」，成了一名学徒水手。",
"三年来，你跟着商船跑遍了南方的海岸线。你见过最美丽的日落，也见过最可怕的风暴。你喝过最甜的椰子酒，也吃过最恶心的硬饼干。",
"你喜欢大海。大海是自由的，没有陆地那么多的规矩和束缚。在海上，你只需要听船长的命令，其他的，都可以自己做主。",
"但你也恨大海。大海是无情的，它可以在一瞬间吞噬一切。你见过最好的朋友被海浪卷走，连尸体都找不到。你见过整艘船在风暴中沉没，几十条人命，就这样没了。",
"「发什么呆？！」一个粗哑的声音在你身后响起，紧接着是一巴掌拍在你的后脑勺上。",
"你踉跄了一下，回头看到了大副——一个满脸横肉的中年男人，左边的耳朵缺了一块，据说是被海盗砍的。大家都叫他缺耳张。",
"「缆绳洗完了吗？甲板擦了吗？货舱打扫了吗？！」缺耳张唾沫横飞地骂道，「一天到晚发呆，我看你是想挨鞭子了！」",
"「对不起，大副。我马上去。」你低着头，转身往船上走去。",
"缺耳张在你身后骂骂咧咧了几句，然后走了。",
"你走上「海鸥号」的甲板，拿起拖把，开始擦甲板。甲板是木头做的，被海水泡得发白，上面有很多已经发黑的血迹——那是以前的水手们留下的，有的是打架打的，有的是被鞭子抽的，有的……是被海盗砍的。",
"你正擦着，突然看到码头的方向跑来一个人。",
"那是一个穿着华丽衣服的男人，大约四十岁左右，手里拿着一个信封，一边跑一边喊着什么。",
"你认出了他——那是南方港城最大的商会「金帆商会」的会长，姓陈，大家都叫他陈会长。",
"陈会长跑到「海鸥号」的码头边，对着船上的船长大声喊着什么。",
"你停下手里的拖把，侧耳倾听。",
"「……货被劫了！我的货被海盗劫了！」陈会长的声音带着哭腔，「三船香料，全没了！全没了啊！」",
"船长站在船头，皱着眉，一言不发。",
"你心里一动。海盗？最近南方海域的海盗越来越猖獗了，据说有一个叫「黑鲨」的海盗团，在南方海域横行霸道，已经劫了十几艘商船了。",
"「陈会长，」船长终于开口了，声音很平静，「你的货被劫了，和我有什么关系？」",
"「船长！」陈会长急了，「我知道你认识「黑鲨」的人！我求你，帮我把货要回来！我给你钱！我给你一百个金币！不，两百个！」",
"船长沉默了一会儿，然后笑了。",
"「陈会长，你太看得起我了。我只是一个跑船的，哪认识什么海盗。」他顿了顿，「不过……我倒是听说，「黑鲨」最近在招人手。如果你愿意，可以去试试。」",
"陈会长的脸色一下子变得惨白。",
"你站在甲板上，听着他们的对话，心里隐隐觉得，有什么事情要发生了。"
],
options:[
{t:"继续擦甲板，装作没听到", go:"origin_south_daily_2"},
{t:"凑过去，听听他们还说什么", go:"origin_south_abnormal_eavesdrop"},
{t:"去找其他水手，问问「黑鲨」的事", go:"origin_south_abnormal_ask"}
]}};

// ========== 出身线4：光明教会（圣城）· 圣光下的阴影 ==========



// ========== 出身线5：精灵王国（银叶城）· 古树中的低语 ==========

N["origin_elf_daily_1"]=function(){return{
place:"银叶城 · 世界树下",
text:[
"银叶城的时间，是用世界树的叶子来计算的。",
"你坐在世界树的一根粗壮的树枝上，看着脚下的银叶城。这座城市建在世界树的树冠之中，无数房屋用藤蔓和树枝编织而成，像鸟巢一样悬挂在枝叶之间。",
"世界树很高，高到你站在树冠上，可以看到远方的地平线。世界树也很老，老到它的树皮上长满了青苔，老到它的树根已经深入了大地的心脏，老到它已经忘记了自己是从什么时候开始存在的。",
"你是一个精灵。一个只有一百二十岁的精灵——在人类的眼里，你已经是一个老人了，但在精灵的眼里，你还只是一个孩子。",
"精灵的寿命很长，平均可以活到八百岁。在这漫长的生命里，精灵们有足够的时间去学习、去思考、去感受。他们学习魔法，学习艺术，学习历史，学习一切人类没有时间去学习的东西。",
"但你不喜欢这种漫长的生命。",
"对你来说，一百年太长了。一百年，足以让你看着你最好的人类朋友从一个朝气蓬勃的少年变成一个白发苍苍的老人，然后死去。一百年，足以让你看着你亲手种下的树长成参天大树，然后被雷劈中，烧成灰烬。一百年，足以让你对这个世界感到厌倦。",
"你羡慕人类。人类的生命虽然短暂，但他们活得热烈，活得精彩，活得有意义。他们在短短的几十年里，做了精灵几百年都做不完的事情。",
"「又在发呆？」一个温柔的声音在你身后响起。",
"你转过头，看到了你的母亲——一个已经五百岁的精灵，但看起来还像人类二十岁的样子。她穿着用花瓣编织的裙子，头发上插着一朵银色的花，那是银叶城的市花——银星花。",
"「母亲。」你站起身，行了一个精灵礼。",
"母亲笑了，她的笑容像春天的阳光一样温暖。",
"「跟你说过多少次了，在我面前不用行礼。」她走到你身边，和你一起看着脚下的银叶城，「又在想人类的事情？」",
"你没说话，但你的眼神已经说明了一切。",
"母亲叹了口气。",
"「孩子，我知道你不喜欢精灵的生活。但你要明白，我们和人类不一样。我们的生命很长，所以我们做任何事情都要慢慢来。我们不能像人类那样急躁，那样冲动，那样……那样短暂。」",
"「但短暂也有短暂的好处。」你说，「人类知道他们的生命有限，所以他们会珍惜每一天，每一刻。而我们呢？我们知道我们还有几百年的时间，所以我们什么都不着急，什么都可以等。等到最后，我们什么都没做，就老了，就死了。」",
"母亲沉默了很久。",
"「也许你是对的。」她终于说，「也许……我们真的应该向人类学习。」",
"就在这时，世界树突然颤抖了一下。",
"你和母亲都愣住了。",
"世界树已经有三千年没有颤抖过了。上一次它颤抖，还是在深渊之主被封印的时候。",
"然后，你听到了一个声音。",
"那个声音不是从外面传来的，而是从你的心里传来的。它很古老，很疲惫，像一个已经活了太久太久的老人。",
"「……第七道封印……松动了……」",
"「世界树……快撑不住了……」",
"「……孩子……去人类的世界……找到……守望者……」",
"声音消失了。",
"你站在世界树的树枝上，浑身发抖。",
"母亲看着你，脸色苍白。",
"「你……你也听到了？」她的声音在发抖。",
"你点了点头。",
"母亲沉默了很久，然后从脖子上摘下一个吊坠，塞到你手里。",
"那是一个用世界树的木头雕刻的吊坠，上面刻着一只眼睛——守望者的标志。",
"「这是你外祖母留给我的。」母亲说，「她是守望者的一员。她临终前告诉我，如果有一天世界树说话了，就让我把这个吊坠交给你，让你去人类的世界，找到守望者。」",
"你握着那个吊坠，感觉它沉甸甸的。",
"「母亲，我……」",
"「去吧。」母亲打断你，她的眼里有泪，但她在笑，「去人类的世界，去看看他们是怎么生活的，去找到守望者，去……去做你想做的事情。」",
"「那你呢？」",
"「我在这里等你。」母亲说，「精灵的生命很长，我等得起。」",
"你看着母亲，看着她眼里的泪水和笑容，心里涌起了一股强烈的冲动。",
"你想去人类的世界。你想去看看那个短暂但热烈的世界。你想去找到守望者，去弄清楚世界树为什么会说话，第七道封印为什么会松动。",
"「母亲，」你跪了下来，「我一定会回来的。」",
"母亲扶起你，拍了拍你的肩膀。",
"「去吧，孩子。」她说，「世界树在看着你。」"
],
options:[
{t:"收拾行李，准备出发", go:"origin_elf_leave_1", effect:{flags:["origin_elf_complete"], items:["watcher_pendant"]}},
{t:"再在银叶城待几天，和朋友们告别", go:"origin_elf_leave_friends"},
{t:"去世界树的根部，看看能不能找到更多线索", go:"origin_elf_worldtree_root"}
]}};

// ========== 出身线6：矮人王国（铁峰堡）· 熔炉中的心跳 ==========

N["origin_dwarf_daily_1"]=function(){return{
place:"铁峰堡 · 锻造坊",
text:[
"铁峰堡的地下，是没有白天和黑夜的。",
"你站在锻造坊里，看着眼前的熔炉。熔炉里的火焰是橙红色的，把整个锻造坊照得通明。热浪从熔炉里涌出来，烤得你脸上发烫，汗水顺着你的额头流下来，滴在滚烫的地面上，「滋」的一声就蒸发了。",
"空气里弥漫着煤烟、铁锈和汗水的味道。锻造坊里很吵，铁锤敲打铁块的声音、风箱拉动的声音、淬火时的「滋滋」声，各种声音混合在一起，构成了铁峰堡最熟悉的旋律。",
"你是一个矮人。一个只有五十岁的矮人——在人类的眼里，你已经是一个中年人了，但在矮人的眼里，你还只是一个学徒。",
"矮人的寿命也很长，平均可以活到五百岁。但和精灵不同，矮人不喜欢漫长的生命里慢慢悠悠地做事情。矮人喜欢锻造，喜欢喝酒，喜欢打架，喜欢一切热烈的、喧嚣的、有力量的事情。",
"你是铁峰堡最有名的锻造师——铁锤·铜须的学徒。你已经在他的锻造坊里当了三十年的学徒了。三十年，你每天天不亮就起床，拉煤、烧火、打铁、淬火，一直忙到深夜。",
"你的师傅铁锤·铜须是一个脾气暴躁的老头，已经三百岁了，但还是每天都在锻造坊里打铁。他对你很严厉，动不动就骂你，有时候还会用铁锤敲你的脑袋。但你知道，他是为了你好。",
"「发什么呆？！」一个雷鸣般的声音在你耳边响起，紧接着是一巴掌拍在你的后脑勺上。",
"你踉跄了一下，回头看到了你的师傅——铁锤·铜须。他是一个矮壮的矮人，身高只有一米四，但体重有两百斤。他的胡子是红色的，编成了两条粗辫子，垂在胸前。他的手里拿着一把比他还高的铁锤，那是他的武器，也是他的工具。",
"「铁块烧红了吗？风箱拉了吗？淬火的水换了吗？！」铁锤唾沫横飞地骂道，「一天到晚发呆，我看你是想挨锤子了！」",
"「对不起，师傅。我马上去。」你低着头，转身往风箱走去。",
"铁锤在你身后骂骂咧咧了几句，然后走到熔炉边，开始检查铁块的温度。",
"你走到风箱边，开始拉动风箱。风箱很大，你需要用全身的力气才能拉动。一下，一下，又一下。空气被风箱吹进熔炉里，火焰「呼」地一下窜了起来，变得更旺了。",
"你正拉着风箱，突然听到熔炉的深处传来了一个声音。",
"那个声音很沉闷，很有节奏，像……像心跳。",
"「咚……咚……咚……」",
"你停下了手里的风箱，侧耳倾听。",
"没错，是从熔炉的深处传来的。铁峰堡的熔炉已经有三千年的历史了，据说它是建在一座远古火山的山口上的。三千年来，熔炉里的火焰从来没有熄灭过。",
"但你从来没有听过熔炉里有心跳声。",
"「师傅，」你喊道，「你听到了吗？熔炉里有声音。」",
"铁锤停下手里的动作，皱着眉听了一会儿。",
"「什么声音？我怎么没听到？」他说，「你是不是听错了？」",
"「没有，师傅。我真的听到了。像心跳一样，「咚、咚、咚」的。」",
"铁锤走到熔炉边，把耳朵贴在熔炉的石壁上，听了很久。",
"然后，他的脸色变了。",
"「……真的有。」他的声音很低，带着一丝恐惧，「这是……永恒熔炉的心跳。」",
"「永恒熔炉？」你愣住了，「那不是传说吗？」",
"永恒熔炉是矮人传说中的神器。据说，在世界诞生之初，创世神用永恒熔炉锻造了世界。后来，永恒熔炉被藏在了铁峰堡的地下深处，只有矮人的国王才能找到它。",
"但那只是传说。你一直以为，永恒熔炉只是一个故事。",
"「不是传说。」铁锤的脸色很严肃，「永恒熔炉是真实存在的。它就在铁峰堡的最深处，在这座火山的心脏里。三千年来，它一直在燃烧，一直在跳动。但它的心跳声，只有在……在世界发生巨变的时候，才能被听到。」",
"「世界发生巨变？」你心里一紧，「什么巨变？」",
"铁锤沉默了很久。",
"「我不知道。」他终于说，「但我知道，永恒熔炉的心跳声响起，意味着有什么大事要发生了。」",
"他走到你面前，从脖子上摘下一个吊坠，塞到你手里。",
"那是一个用铁铸造的吊坠，上面刻着一把锤子——矮人的神圣符号。",
"「这是我们铜须家族世代相传的东西。」铁锤说，「我祖父告诉我，如果有一天永恒熔炉的心跳声响起，就让我把这个吊坠交给我最信任的学徒，让他去人类的世界，找到艾尔达大陆学院，找到一个叫墨丘利的人。」",
"「墨丘利？」",
"「他是守望者的一员。」铁锤说，「他会告诉你该怎么做。」",
"你握着那个吊坠，感觉它沉甸甸的，还带着铁锤的体温。",
"「师傅，我……」",
"「去吧。」铁锤打断你，他的眼里有不舍，但更多的是坚定，「你是我最好的学徒。我相信，你能完成这个任务。」",
"「那锻造坊呢？」",
"「锻造坊有我呢。」铁锤笑了，笑容里带着一丝豪迈，「我这把老骨头，还能再打三十年铁！」",
"你看着师傅，看着他布满皱纹的脸和粗壮的手臂，心里涌起了一股强烈的冲动。",
"你想去人类的世界。你想去找到墨丘利，去弄清楚永恒熔炉为什么会心跳，世界为什么会发生巨变。",
"「师傅，」你跪了下来，「我一定会回来的。等我回来了，我要成为铁峰堡最伟大的锻造师。」",
"铁锤扶起你，拍了拍你的肩膀。",
"「去吧，小子。」他说，「永恒熔炉在看着你。」"
],
options:[
{t:"收拾行李，准备出发", go:"origin_dwarf_leave_1", effect:{flags:["origin_dwarf_complete"], items:["copperbeard_pendant"]}},
{t:"再在铁峰堡待几天，和朋友们喝酒告别", go:"origin_dwarf_leave_friends"},
{t:"去铁峰堡的最深处，看看能不能找到永恒熔炉", go:"origin_dwarf_eternal_forge"}
]}};

// ========== 出身线7：兽人草原（兽人王庭）· 草原上的战歌 ==========



// ========== 出身线8：东部王国（承天山）· 山巅上的时光 ==========

N["origin_east_daily_1"]=function(){return{
place:"承天山 · 山脚小镇",
text:[
"承天山的雪，是从十月开始下的。",
"你站在小镇的街口，看着眼前的承天山。这座山很高，高到它的山顶永远被云雾笼罩着，没有人知道山顶上有什么。这座山也很老，老到它已经在这里矗立了上万年，老到它见证了无数王朝的兴衰，老到它已经忘记了自己是从什么时候开始存在的。",
"小镇在承天山的山脚下，是一个只有几百户人家的小镇。镇上的人大多靠采药和打猎为生，生活虽然清贫，但也平静。",
"你是一个孤儿。你不知道你的父母是谁，也不知道你是从哪里来的。你只知道，在你五岁那年，一个穿着道袍的老人把你放在了小镇的道观门口，然后就消失了。",
"道观的道长——玄机子——收养了你。他是一个看起来很老的老人，没有人知道他到底有多少岁。他的头发和胡子都是白的，脸上布满了皱纹，但他的眼睛却很亮，像两颗星星一样。",
"玄机子教你读书，教你写字，教你采药，教你一些奇怪的道术。他说，你是一个有天赋的孩子，将来一定会有大作为。",
"但你不知道你有什么天赋。你只是一个普通的孩子，每天的生活就是读书、写字、采药、打扫道观。",
"今天是你十六岁的生日。玄机子说，要给你一个特别的礼物。",
"你站在道观的院子里，等着玄机子。院子里有一棵老槐树，据说已经有几百年的历史了。槐树上挂着很多红布条，那是镇上的人来许愿时挂的。",
"「来了？」一个苍老的声音在你身后响起。",
"你转过头，看到了玄机子。他穿着一件洗得发白的道袍，手里拿着一个木盒子，脸上带着一丝神秘的笑容。",
"「师父。」你行了一个礼。",
"玄机子笑了，把手里的木盒子递给你。",
"「这是给你的生日礼物。」他说，「打开看看。」",
"你接过木盒子，打开了它。",
"盒子里放着一面铜镜。铜镜很旧，上面布满了铜绿，但镜面却很亮，亮得像新的一样。",
"「这是……」你愣住了。",
"「这是「时光镜」。」玄机子说，「是我年轻的时候，在承天山的一个古洞里找到的。据说，这面镜子可以看到过去和未来。」",
"「过去和未来？」你惊讶地看着那面铜镜，「真的吗？」",
"「我不知道。」玄机子说，「我试过很多次，但什么都看不到。也许……它在等一个对的人。」",
"你看着那面铜镜，心里涌起了一股奇怪的冲动。你想试试，你想看看这面镜子到底能不能看到过去和未来。",
"你把铜镜举到面前，看着镜面。",
"镜面里映出了你的脸。然后，镜面开始变得模糊，像被雾气笼罩了一样。",
"接着，你看到了一些画面。",
"你看到了一个穿着金甲的将军，站在一座城楼上，看着远方。他的脸上有一道伤疤，眼神里满是疲惫和坚定。",
"你看到了一个穿着白袍的女人，站在一片废墟上，手里抱着一个婴儿。她的眼里有泪，但她在笑。",
"你看到了一片火海，无数的人在火海中挣扎、尖叫。",
"你看到了一片冰原，一个人独自走在冰原上，身后是一串长长的脚印。",
"最后，你看到了一个穿着道袍的老人，站在承天山的山顶上，看着远方。他的背影很孤独，也很坚定。",
"那个老人……是玄机子？",
"镜面突然变得清晰了，又变回了你的脸。",
"你放下铜镜，浑身发抖。",
"「师父，」你的声音在发抖，「我看到了……我看到了很多东西。」",
"玄机子看着你，眼里闪过一丝惊讶，然后是一丝释然。",
"「你看到了什么？」他问。",
"你把你看到的画面告诉了玄机子。",
"玄机子沉默了很久。",
"「看来，」他终于说，「你就是那个对的人。」",
"「什么对的人？」",
"「时光镜在等的人。」玄机子说，「也是……承天山在等的人。」",
"他走到院子里的老槐树下，从树根下挖出了一个铁盒子。",
"铁盒子里放着一封信，和一块玉佩。",
"「这是你父亲留给你的。」玄机子说，「十六年前，他把你放在道观门口的时候，留下了这封信和这块玉佩。他说，如果有一天你能看到时光镜里的画面，就把这些东西交给你。」",
"你接过信和玉佩，手在发抖。",
"「我父亲……他是谁？」",
"「他是承天山的守山人。」玄机子说，「也是……守望者的一员。」",
"守望者！",
"你愣住了。你听过守望者的传说——他们是一群自称「守护世界平衡」的神秘人，据说他们已经存在了几千年，一直在暗中守护着这个世界。",
"「十六年前，」玄机子继续说，「你父亲发现了一个惊天的秘密——第七道封印松动了。他想把这个消息告诉守望者的其他人，但他被人追杀了。他把你放在这里，是因为他知道，这里是最安全的地方。」",
"「那他现在……」",
"「我不知道。」玄机子说，「他把你放在这里之后，就去引开追兵了。从那以后，我再也没有见过他。」",
"你握着那封信和那块玉佩，感觉心里像被什么东西堵住了一样。",
"「师父，我……」",
"「你要去找他。」玄机子打断你，「你要去艾尔达大陆学院，找到一个叫墨丘利的人。他是守望者的一员，他会告诉你该怎么做。」",
"「那你呢？」",
"「我在这里等你。」玄机子笑了，笑容里带着一丝苦涩，「我已经等了十六年了，再等几年也没关系。」",
"你看着玄机子，看着他布满皱纹的脸和明亮的眼睛，心里涌起了一股强烈的冲动。",
"你想去找到你的父亲。你想去弄清楚第七道封印为什么会松动。你想去看看这个世界到底发生了什么。",
"「师父，」你跪了下来，「我一定会回来的。等我回来了，我要和你一起在承天山看日出。」",
"玄机子扶起你，拍了拍你的肩膀。",
"「去吧，孩子。」他说，「承天山在看着你。」"
],
options:[
{t:"收拾行李，准备出发", go:"origin_east_leave_1", effect:{flags:["origin_east_complete"], items:["time_mirror","father_letter","jade_pendant"]}},
{t:"再在道观待几天，和师父告别", go:"origin_east_leave_master"},
{t:"去承天山的古洞看看，也许能找到更多线索", go:"origin_east_ancient_cave"}
]}};

// ========== 出身线9：沙漠边境（死亡沙漠边缘）· 黄沙中的遗物 ==========



// ============================================================
// v37 学院线连续化 - 五年年度主线
// ============================================================

// ========== 第一年·入学危机 ==========

N["academy_year1_intro"]=function(){return{
place:"艾尔达大陆学院 · 校门",
text:[
"你站在艾尔达大陆学院的校门前，抬头看着这座传说中的学院。",
"学院建在一座小山的山顶上，四周被古老的橡树环绕着。校门是用白色的大理石建造的，上面刻着学院的校训——「知识即力量，真理即自由」。校门的两侧各有一座雕像，左边是光明神的雕像，右边是智慧女神的雕像。",
"校门前面是一个巨大的广场，广场上挤满了人。有和你一样的新生，有送孩子上学的家长，有来做生意的小贩，还有维持秩序的学院守卫。空气里弥漫着各种气味——香水、汗味、烤面包的香味、马粪的臭味，混杂在一起，构成了学院开学日特有的味道。",
"你深吸一口气，感觉心里既兴奋又紧张。",
"兴奋的是，你终于来到了这座大陆最顶尖的学院。从今天起，你将在这里学习魔法、历史、哲学、战斗，以及一切你想学习的东西。",
"紧张的是，你不知道自己能不能在这里生存下去。学院里的学生都是从大陆各地选拔出来的天才，而你……你只是一个普通的孩子，没有显赫的家世，没有惊人的天赋，甚至连学费都是别人替你交的。",
"「发什么呆？」一个声音在你身边响起。",
"你转过头，看到了一个和你差不多大的少年。他穿着一件崭新的学院制服，脸上带着一丝傲慢的笑容。",
"「你也是新生？」少年上下打量了你一眼，看到你身上那件打了补丁的旧衣服，眼里闪过一丝轻蔑，「哪个出身的？」",
"「自由城邦。」你老实说。",
"「自由城邦？」少年挑了挑眉，「贫民窟出来的？」",
"你没说话，但你的拳头握紧了。",
"少年看到你的反应，笑了。",
"「别紧张，我没有恶意。」他说，「我叫亚历山大·美第奇，来自南方商业城邦。我父亲是美第奇商会的会长。」",
"美第奇！你心里一惊。美第奇商会是大陆最大的商会，据说他们的财富可以买下整个自由城邦。而亚历山大·美第奇，就是美第奇商会的继承人。",
"「你……你好。」你有些不知所措地说。",
"亚历山大笑了，拍了拍你的肩膀。",
"「别这么拘束。」他说，「从今天起，我们就是同学了。走吧，一起进去报到。」",
"你看着亚历山大的背影，心里涌起了一股奇怪的感觉。",
"这个美第奇家的继承人，看起来并不像你想象中的那么傲慢。但你总觉得，他的笑容背后，藏着什么你看不透的东西。",
"你摇了摇头，把这些想法抛到脑后，跟着亚历山大走进了学院的大门。",
"从今天起，你的学院生活，正式开始了。"
],
options:[
{t:"跟着亚历山大去报到", go:"academy_year1_registration"},
{t:"自己一个人去报到", go:"academy_year1_registration", effect:{flags:["alone_registration"]}},
{t:"先在学院里转转，熟悉环境", go:"academy_year1_explore"}
]}};

N["academy_year1_registration"]=function(){return{
place:"艾尔达大陆学院 · 报到处",
text:[
"报到处设在学院的主教学楼——智慧塔的一楼大厅里。",
"大厅里挤满了新生，大家排着长长的队伍，等待着办理入学手续。大厅的天花板很高，上面画着一幅巨大的壁画——描绘的是三千年前，光明神和深渊之主的最终决战。壁画的色彩很鲜艳，即使过了三千年，依然栩栩如生。",
"你排了大约半个时辰的队，终于轮到了你。",
"办理入学手续的是一个戴着眼镜的中年女人，她看起来很疲惫，面前堆着厚厚的一摞文件。",
"「名字？」她头也不抬地问。",
"你告诉了她你的名字。",
"「出身？」",
"「自由城邦。」",
"「职业倾向？」",
"你愣住了。职业倾向？你还没有想过这个问题。",
"「我……我还不确定。」你老实说。",
"女人抬起头，看了你一眼，眼里闪过一丝不耐烦。",
"「不确定？」她说，「每个人都必须选择一个职业。这是学院的规定。职业一旦选定，终身不可更改。你明白吗？」",
"你点了点头。你当然明白。在这个世界上，职业决定了一个人的命运。战士、法师、牧师、盗贼、猎人、术士、灵魂法师——七大职业，每一个都有自己的道路和规则。",
"「那……我可以都了解一下吗？」你问。",
"女人叹了口气，从抽屉里拿出一本小册子，递给你。",
"「这是职业指南。」她说，「你可以看看，但要快点决定。后面还有很多人在排队。」",
"你接过小册子，走到一边，开始翻阅。",
"小册子里详细介绍了七大职业的特点、优势、劣势，以及未来的发展方向。你看得很认真，因为你知道，这个选择将决定你的一生。",
"战士：近战物理攻击，高血量，高防御，适合喜欢正面战斗的人。",
"法师：远程魔法攻击，高伤害，低血量，适合喜欢远程输出的人。",
"牧师：治疗和辅助，可以治愈伤口，增强队友，适合喜欢支援的人。",
"盗贼：潜行和暗杀，高敏捷，高暴击，适合喜欢偷袭的人。",
"猎人：远程物理攻击，可以驯服野兽，适合喜欢远程和宠物的人。",
"术士：诅咒和召唤，可以诅咒敌人，召唤恶魔，适合喜欢黑暗魔法的人。",
"灵魂法师：最神秘的职业，可以操纵灵魂，读取记忆，甚至……复活死者。但这个职业被教会视为异端，学习灵魂魔法的人，会被教会追杀。",
"你看着灵魂法师的介绍，心里涌起了一股奇怪的冲动。",
"你想起了序章中发生的事情——暗蚀会、守望者、七道封印、深渊之主。你总觉得，这些事情和灵魂魔法有着某种联系。",
"但你也知道，选择灵魂法师，意味着你将成为教会的敌人，意味着你将走上一条危险而孤独的道路。",
"你合上小册子，深吸了一口气。",
"是时候做出选择了。"
],
options:[
{t:"选择战士", go:"academy_year1_class_choose", effect:{job:"warrior"}},
{t:"选择法师", go:"academy_year1_class_choose", effect:{job:"mage"}},
{t:"选择牧师", go:"academy_year1_class_choose", effect:{job:"priest"}},
{t:"选择盗贼", go:"academy_year1_class_choose", effect:{job:"rogue"}},
{t:"选择猎人", go:"academy_year1_class_choose", effect:{job:"hunter"}},
{t:"选择术士", go:"academy_year1_class_choose", effect:{job:"warlock"}},
{t:"选择灵魂法师（危险）", go:"academy_year1_class_soul", effect:{job:"soul_mage", flags:["soul_mage_chosen"]}}
]}};

// ========== 第二年·院际大赛 ==========

N["academy_year2_intro"]=function(){return{
place:"艾尔达大陆学院 · 大礼堂",
text:[
"第二年的开学日，学院的大礼堂里座无虚席。",
"你坐在人群中，看着台上的校长——一个白发苍苍的老人，名叫奥古斯都。他已经当了三十年的校长，据说他年轻的时候是大陆最强大的法师之一。",
"「同学们，」奥古斯都校长的声音在大礼堂里回荡，「新的一年开始了。在过去的一年里，你们学习了基础知识，掌握了基本技能。但在新的一年里，你们将面临更大的挑战。」",
"他顿了顿，环视了一下全场。",
"「我宣布，第二十七届院际大赛，正式开始！」",
"大礼堂里爆发出雷鸣般的掌声和欢呼声。",
"院际大赛，是学院每年最重要的活动。五大学院——战士学院、法师学院、牧师学院、盗贼学院、综合学院——各自派出代表队，进行为期一个月的比赛。比赛项目包括个人战斗、团队战斗、魔法竞赛、知识竞赛、生存挑战等等。",
"获得冠军的学院，将获得一年的资源优先权，以及学院最高荣誉——「金杯」。",
"你坐在人群中，心里涌起了一股强烈的兴奋感。",
"去年一年，你努力学习，刻苦训练，实力已经有了很大的提升。你渴望在院际大赛上证明自己，让所有人都看到你的实力。",
"「喂，」一个声音在你身边响起，「你觉得我们学院今年能拿冠军吗？」",
"你转过头，看到了你的室友——一个叫马库斯的北方公国少年。他是战士学院的学生，性格豪爽，力大无穷，是你在学院里最好的朋友。",
"「当然能。」你笑着说，「有你在，我们肯定能赢。」",
"马库斯挠了挠头，有些不好意思地笑了。",
"「别这么说。」他说，「我只是力气大而已。真正的主力，还是你啊。」",
"你正想说话，突然感觉到一道目光落在了你身上。",
"你转过头，看到了坐在不远处的一个少年——亚历山大·美第奇。他正看着你，脸上带着一丝意味深长的笑容。",
"你心里一动。去年一年，你和亚历山大的关系很微妙。你们有时候是朋友，有时候是对手。他总是在你需要帮助的时候出现，但你总觉得，他的帮助背后，藏着什么目的。",
"亚历山大看到你在看他，举起手中的酒杯，对你示意了一下，然后一饮而尽。",
"你皱了皱眉，转过头，没有理他。",
"「怎么了？」马库斯注意到了你的反应，「你和亚历山大又闹矛盾了？」",
"「没有。」你说，「只是觉得他这个人，看不透。」",
"马库斯耸了耸肩。",
"「美第奇家的人，都是这样的。」他说，「他们的脑子里，永远在盘算着什么。不过，只要他不害我们，就随他去吧。」",
"你点了点头，但心里的不安，却越来越强烈了。",
"你有一种预感——今年的院际大赛，不会那么平静。"
],
options:[
{t:"报名参加个人战斗比赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_individual_tournament"]}},
{t:"报名参加团队战斗比赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_team_tournament"]}},
{t:"报名参加知识竞赛", go:"academy_year2_tournament_signup", effect:{flags:["joined_knowledge_tournament"]}},
{t:"不参加比赛，当观众", go:"academy_year2_audience", effect:{flags:["tournament_audience"]}} /*v489inj:y2*/,{t:"夜里翻来覆去，想听一听职业的低语", go:"sub_path_hub"}
]}};

// ========== 第三年·实习外出 ==========

N["academy_year3_intro"]=function(){return{
place:"艾尔达大陆学院 · 教务处",
text:[
"第三年的开学日，你站在教务处的门口，手里拿着一张实习分配表。",
"按照学院的规定，第三年的学生，必须进行为期一年的外出实习。实习的地点有很多选择——可以去军队，可以去教会，可以去商会，可以去冒险者公会，也可以去大陆各地的魔法塔。",
"不同的实习地点，有不同的收获。去军队，可以学习战斗技巧和军团指挥；去教会，可以学习神术和教会的运作方式；去商会，可以学习商业和人脉；去冒险者公会，可以积累实战经验和声望；去魔法塔，可以深入研究魔法理论。",
"你看着实习分配表，心里犹豫不决。",
"这一年的实习，将对你未来的发展产生深远的影响。你必须慎重选择。",
"「想好了吗？」教务处的老师——一个戴着眼镜的中年男人——不耐烦地问，「后面还有很多人在等着。」",
"你深吸一口气，做出了选择。"
],
options:[{t:"选择去军队实习", go:"academy_year3_military", effect:{flags:["military_internship"]}},
{t:"选择去教会实习", go:"academy_year3_church", effect:{flags:["church_internship"]}},
{t:"选择去商会实习", go:"academy_year3_merchant", effect:{flags:["merchant_internship"]}},
{t:"选择去冒险者公会实习", go:"academy_year3_adventurer", effect:{flags:["adventurer_internship"]}},
{t:"选择去魔法塔实习", go:"academy_year3_magic_tower", effect:{flags:["magic_tower_internship"]}}, {"t": "驿站收到一封家书", "go": "academy_y3_road_letter"}]} /*v45opt:academy_year3_intro*/};

// ========== 第四年·政治风暴 ==========

N["academy_year4_intro"]=function(){return{
place:"艾尔达大陆学院 · 学院广场",
text:["第四年的开学日，学院的气氛和往年完全不同。", "你站在学院广场上，看着周围来来往往的学生，感觉到了一股压抑的氛围。每个人的脸上都写满了紧张和不安，没有人像往年那样嬉笑打闹。", "广场的中央，站着一群穿着白色长袍的人——那是光明教会的审判骑士。他们正在检查每一个进出学院的人，眼神锐利得像鹰一样。", "「发生什么事了？」你拉住一个路过的同学，低声问。", "那个同学看了一眼不远处的审判骑士，压低了声音。", "「你还不知道？」他说，「三天前，教会发布了「净化令」。他们说，学院里有暗蚀会的卧底，要进行全面搜查。」", "「暗蚀会的卧底？」你心里一惊，「在我们学院？」", "「没错。」同学点了点头，「据说，已经有三个教授被带走了。还有十几个学生，被怀疑是暗蚀会的成员，现在正在接受审讯。」", "你倒吸了一口凉气。", "暗蚀会——这个名字你并不陌生。序章的时候，你就和他们打过交道。你知道，他们是一群危险的人，为了获得深渊的力量，不惜一切代价。", "但你没有想到，他们竟然渗透到了学院里，而且还渗透得这么深。", "「那……学院是什么态度？」你问。", "「学院？」同学苦笑了一下，「学院能有什么态度？教会的势力那么大，学院敢说什么？校长虽然表面上在抗议，但实际上，也只能配合搜查。」", "你沉默了。", "你有一种预感——今年，将是你在学院里最不平静的一年。", "就在这时，你看到了一个熟悉的身影。", "是墨丘利教授。他站在教学楼的角落里，看着广场上的审判骑士，脸色凝重。", "你心里一动。墨丘利教授——你知道，他是守望者的一员。也许，他知道一些别人不知道的事情。", "你犹豫了一下，然后朝着墨丘利教授走了过去。", "第四年开学，学院的气氛不太一样了。布告栏上多了几张告示：净化令的通告、学生会的声明、一封措辞含糊的致家长信。", "广场上，有人戴着教会的银徽章，站成一排。他们不拦人，也不说话，只是站着。路过的人绕开他们走，像绕开几根柱子。", "宿舍里，室友把窗帘拉了一半。他压低声音说：「今年不太平。听说教会要派人来查。」他说完，又补了一句：「你说话小心点。」", "你坐在床边，看着窗帘缝里漏进来的光。去年你还会为了一门课熬夜，今年，你开始数日子了。", "窗外，钟楼的钟照常响起。钟声还是那个钟声，但听在耳朵里，分量不一样了。", "你从柜子里翻出那本旧笔记，翻到中间某一页，看了很久。然后你合上，把它放回原处。有些东西，该收起来了。"] /*v45inj:academy_year4_intro*/,
options:[
{t:"去找墨丘利教授，问问情况", go:"academy_year4_mercury", effect:{flags:["asked_mercury_about_purge"]}},
{t:"先回宿舍，看看室友们怎么样了", go:"academy_year4_dorm", effect:{flags:["checked_on_roommates"]}},
{t:"去图书馆，查查暗蚀会的资料", go:"academy_year4_library", effect:{flags:["researched_eclipse"]}},
{t:"躲起来，不要惹麻烦", go:"academy_year4_hide", effect:{flags:["hid_during_purge"]}}
]}};

// ========== 第五年·毕业抉择 ==========

N["academy_year5_intro"]=function(){return{
place:"艾尔达大陆学院 · 毕业礼堂",
text:[
"第五年的毕业日，学院的毕业礼堂里弥漫着一股离别的伤感。",
"你坐在毕业生的席位上，看着台上的校长，心里百感交集。",
"五年了。你在这座学院里度过了五年的时光。五年里，你学习了知识，掌握了技能，结交了朋友，也树立了敌人。你经历了入学的兴奋，院际大赛的热血，实习的艰辛，政治风暴的考验。",
"现在，你终于要毕业了。",
"「同学们，」奥古斯都校长的声音在毕业礼堂里回荡，「五年前，你们还是一群懵懂的少年。五年后的今天，你们已经成长为大陆的栋梁。在未来的日子里，你们将走向大陆的各个角落，用你们所学的知识和技能，去改变这个世界。」",
"他顿了顿，环视了一下全场。",
"「但我也要提醒你们——这个世界，并不太平。七道封印正在松动，深渊之主正在苏醒。暗蚀会在暗中活动，守望者在默默守护。大陆的局势，越来越紧张了。」",
"全场安静了下来。",
"「你们是大陆的希望。」奥古斯都校长说，「我希望，你们能够记住学院的校训——知识即力量，真理即自由。无论你们将来走到哪里，无论你们将来做什么，都不要忘记，你们是艾尔达大陆学院的毕业生。」",
"他举起手中的酒杯。",
"「为了学院！为了真理！为了自由！」",
"全场的毕业生都举起了酒杯。",
"「为了学院！为了真理！为了自由！」",
"你也举起了酒杯，但你的心里，却在想着别的事情。",
"五年的学院生活结束了。但你知道，这不是结束，而是开始。",
"真正的挑战，还在后面。",
"「喂，」一个声音在你身边响起，「在想什么？」",
"你转过头，看到了马库斯。他穿着毕业礼服，脸上带着一丝离别的伤感。",
"「没什么。」你说，「只是觉得，时间过得真快。」",
"「是啊。」马库斯叹了口气，「五年，就这么过去了。」",
"他沉默了一会儿，然后说：「你毕业后，打算去哪里？」",
"你愣住了。",
"是啊，毕业后，你打算去哪里？",
"这五年里，你学习了很多，成长了很多。但你从来没有认真想过，毕业后，你要做什么。",
"是去军队，成为一名将军？",
"是去教会，成为一名牧师？",
"是去商会，成为一名商人？",
"是去冒险者公会，成为一名冒险者？",
"还是……去寻找七道封印的真相，去阻止深渊之主的苏醒？",
"你看着窗外的天空，心里涌起了一股强烈的冲动。",
"你知道，你应该选择后者。",
"因为，从序章开始，你的命运，就已经和这个世界的命运，紧紧地联系在一起了。"
],
options:[{t:"选择去军队，成为一名将军", go:"academy_year5_graduate_military", effect:{flags:["graduate_military"]}},
{t:"选择去教会，成为一名牧师", go:"academy_year5_graduate_church", effect:{flags:["graduate_church"]}},
{t:"选择去商会，成为一名商人", go:"academy_year5_graduate_merchant", effect:{flags:["graduate_merchant"]}},
{t:"选择去冒险者公会，成为一名冒险者", go:"academy_year5_graduate_adventurer", effect:{flags:["graduate_adventurer"]}},
{t:"选择去寻找七道封印的真相", go:"academy_year5_graduate_seals", effect:{flags:["graduate_seals"]}},
{t:"还没有想好，先休息一段时间", go:"academy_year5_graduate_rest", effect:{flags:["graduate_rest"]}}, {"t": "去上最后一堂课", "go": "academy_y5_last_class"}]} /*v45opt:academy_year5_intro*/};

N["origin_desert_daily_1"]=function(){return{
place:"死亡沙漠边缘 · 绿洲小镇",
text:[
"死亡沙漠的风，是带着沙子的。",
"你站在小镇的城墙上，看着眼前的死亡沙漠。这片沙漠很大，大到你站在城墙上，看不到它的尽头。这片沙漠也很可怕，据说进去的人，十个里面有九个出不来。剩下的一个，也会变成疯子。",
"小镇在死亡沙漠的边缘，是一个只有几十户人家的小镇。镇上的人大多靠给商队当向导为生，生活虽然危险，但也还过得去。",
"你是一个孤儿。你不知道你的父母是谁，也不知道你是从哪里来的。你只知道，在你十岁那年，一个商队从死亡沙漠里出来，把你放在了小镇的酒馆门口，然后就走了。",
"商队的人说，他们在沙漠里发现你的时候，你正坐在一具尸体旁边，手里攥着一封信。那具尸体已经变成了干尸，没有人知道他是谁。",
"酒馆的老板娘——一个胖女人，大家都叫她胖婶——收养了你。她虽然脾气暴躁，但心地善良，对你很好。",
"你在小镇上长大了。每天的生活就是帮胖婶打扫酒馆、端盘子、听商人们讲沙漠里的故事。",
"你对死亡沙漠充满了好奇。你想知道沙漠里到底有什么，想知道那具干尸是谁，想知道你手里的那封信里写了什么。",
"但你不敢打开那封信。因为胖婶说，那封信是你唯一的线索，也许有一天，会有人来认领它。",
"今天，你十六岁了。胖婶说，你已经长大了，可以自己决定要不要打开那封信了。",
"你坐在酒馆的角落里，手里攥着那封信。信已经很旧了，信封是用一种奇怪的布料做的，上面写着几个字——「致墨丘利」。",
"墨丘利。这个名字你听过很多次。商人们说，墨丘利是艾尔达大陆学院的教授，也是一个很神秘的人。",
"你深吸一口气，拆开了信封。",
"信里是一张泛黄的纸，上面写着密密麻麻的字。字迹很潦草，像是在很匆忙的情况下写的。",
"你开始读信。",
"「墨丘利：",
"如果你看到这封信，说明我已经死了。",
"我在死亡沙漠的最深处，找到了那个地方。那个传说中的地方——「黄林晶的遗迹」。",
"我没有骗你。黄林晶真的存在过。他不是传说，他是一个真实的人。三千年前，他封印了深渊之主，然后消失在了死亡沙漠里。",
"我在遗迹里找到了他的日记。日记里写了很多东西——关于七道封印，关于原初之物，关于守望者，关于……关于这个世界的真相。",
"但我也发现了一个可怕的事实——第七道封印松动了。深渊之主正在苏醒。",
"我必须把这个消息带出去。但我知道，我可能走不出这片沙漠了。暗蚀会的人一直在追杀我，他们想得到黄林晶的日记。",
"如果你看到这封信，请你一定要找到黄林晶的日记，把它交给守望者的其他人。",
"还有……如果你看到一个孩子，请你照顾他。他是我的儿子。他的名字叫……」",
"信到这里就断了。后面的字被血迹遮住了，看不清楚。",
"你握着那封信，浑身发抖。",
"黄林晶。七道封印。深渊之主。守望者。暗蚀会。",
"这些名字，你以前只在商人们的故事里听过。你从来没有想过，它们会和你有关系。",
"那个干尸……是你的父亲？",
"你是黄林晶的……什么人？",
"「孩子，」一个声音在你身边响起。",
"你抬起头，看到了胖婶。她站在你身边，看着你手里的信，眼里满是担忧。",
"「胖婶，」你的声音在发抖，「我……我想知道，我到底是谁。」",
"胖婶沉默了很久。",
"「我不知道你是谁。」她终于说，「但我知道，你不是一个普通的孩子。从你来到这个小镇的第一天起，我就知道。」",
"「为什么？」",
"「因为你的眼睛。」胖婶说，「你的眼睛和普通人不一样。有时候，我能从你的眼睛里看到……星星。」",
"你愣住了。你从来没有注意过你的眼睛有什么不一样。",
"「胖婶，我……我想去艾尔达大陆学院。」你说，「我想找到墨丘利教授。我想知道我到底是谁。我想知道……我父亲到底发生了什么。」",
"胖婶看着你，眼里有不舍，但更多的是坚定。",
"「去吧。」她说，「我就知道，你迟早会走的。这个小镇太小了，装不下你的命运。」",
"她从柜台下面拿出一个布包，塞到你手里。",
"「这里是五十个金币，还有一些干粮和水。」胖婶说，「路上小心。沙漠里不太平，暗蚀会的人到处都是。」",
"你握着那个布包，感觉心里像被什么东西堵住了一样。",
"「胖婶，」你跪了下来，「我一定会回来的。等我回来了，我要让你过上好日子。」",
"胖婶扶起你，拍了拍你的肩膀。",
"「傻孩子，」她的眼里有泪，但她在笑，「我不需要你让我过上好日子。我只需要你……活着回来。」",
"你看着胖婶，看着她布满皱纹的脸和温暖的笑容，心里涌起了一股强烈的冲动。",
"你想去找到墨丘利。你想去弄清楚你到底是谁。你想去找到黄林晶的遗迹，找到你父亲的日记。",
"「胖婶，」你说，「我走了。」",
"「去吧。」胖婶挥了挥手，「死亡沙漠在看着你。」",
"你转过身，朝着小镇的出口走去。",
"风在你耳边呼啸，沙子打在你脸上。你走啊走，一直走，直到小镇的轮廓消失在了远方。",
"在你身后，死亡沙漠像一头沉睡的巨兽，静静地等待着你的到来。"
],
options:[
{t:"朝着艾尔达大陆学院的方向出发", go:"origin_desert_leave_1", effect:{flags:["origin_desert_complete"], items:["huang_letter","father_diary_clue"]}},
{t:"先去死亡沙漠的边缘看看，也许能找到更多线索", go:"origin_desert_edge_explore"},
{t:"在小镇再待几天，和胖婶告别", go:"origin_desert_leave_aunt"}
]}};

N["origin_orc_daily_1"]=function(){return{
place:"兽人王庭 · 草原",
text:[
"兽人草原的风，是带着血腥味的。",
"你站在草原上，看着眼前的一切。草原很辽阔，一望无际，绿色的草在风中摇曳，像一片绿色的海洋。远处，一群野马在奔跑，扬起了一片尘土。天空很蓝，蓝得像被水洗过一样。",
"但你知道，这片美丽的草原下，埋藏着无数的尸骨。",
"兽人是一个好战的种族。在兽人王庭，只有最强壮的战士才能活下去。兽人之间经常发生战斗，部落和部落之间，家族和家族之间，甚至兄弟和兄弟之间，都会为了权力、为了土地、为了女人而战斗。",
"你是一个兽人。一个只有十八岁的兽人——在兽人的眼里，你已经是一个成年人了，是一个可以上战场的战士了。",
"你的父亲是「血牙」部落的酋长。他是一个强壮的兽人，身高两米五，体重三百斤，一拳可以打死一头野牛。他在兽人王庭里很有名，因为他曾经在一次部落战争中，一个人杀死了对方部落的三十个战士。",
"但你不像你的父亲。",
"你很瘦，至少在兽人里算瘦的。你只有两米高，体重只有两百斤。你不喜欢打架，不喜欢喝酒，不喜欢一切兽人喜欢的事情。你喜欢一个人坐在草原上，看着天空，想着一些奇怪的事情。",
"因为这个，你在部落里经常被其他兽人嘲笑。他们叫你「瘦猴」，叫你「娘娘腔」，叫你「不配做血牙部落的人」。",
"你的父亲对你也很失望。他经常说，他怎么会生出你这样一个儿子。",
"但你不在乎。你有你自己的世界。",
"「又在发呆？」一个粗哑的声音在你身后响起。",
"你转过头，看到了你的父亲——血牙·碎骨。他穿着用兽皮缝制的铠甲，腰间别着一把巨大的战斧，脸上有一道从额头延伸到下巴的伤疤，那是他在一次战斗中留下的。",
"「父亲。」你站起身，行了一个兽人礼。",
"血牙皱着眉看着你，眼里满是失望。",
"「明天就是成年仪式了。」他说，「你准备好了吗？」",
"成年仪式是兽人最重要的仪式。每一个兽人在十八岁的时候，都要参加成年仪式。在仪式上，他们要和一头野牛搏斗，只有杀死野牛的人，才能成为真正的战士，才能在部落里有地位。",
"「我……我准备好了。」你说，但你的声音在发抖。",
"你知道，你根本不可能杀死一头野牛。你太瘦了，太弱了，你连一把战斧都挥不动。",
"血牙看着你，叹了口气。",
"「儿子，」他说，这是他第一次用这么温柔的语气和你说话，「我知道你不像其他兽人。我知道你不喜欢打架，不喜欢喝酒。但你要明白，我们是兽人。在这个世界上，只有强者才能活下去。如果你不能成为一个强者，你就会被淘汰。」",
"「我知道，父亲。」",
"「你不知道。」血牙说，「你从来都不知道。」",
"他沉默了一会儿，然后从怀里掏出一个东西，塞到你手里。",
"那是一个用骨头雕刻的吊坠，上面刻着一只狼——兽人萨满的神圣符号。",
"「这是你母亲留给你的。」血牙说，「她是一个萨满。她临终前告诉我，如果有一天你遇到了困难，就让你拿着这个吊坠，去草原的最东边，找到「先知」萨满。他会告诉你该怎么做。」",
"你握着那个吊坠，感觉它冷冰冰的，还带着一丝诡异的气息。",
"「母亲……」你喃喃道。",
"你的母亲在你五岁的时候就死了。她是一个萨满，在一次仪式中，被恶魔附身，然后被你的父亲亲手杀死了。",
"你对母亲的记忆很模糊，你只记得她有一双温柔的眼睛，和一副好听的嗓子。她经常给你唱歌，唱一些古老的、悲伤的歌。",
"「明天的成年仪式，」血牙说，「你尽力就好。如果你真的杀不死野牛……」",
"他没有说下去，但你知道他的意思。如果你杀不死野牛，你就会被部落里的人嘲笑一辈子，你就永远都抬不起头来。",
"就在这时，远处的草原上突然传来了一阵号角声。",
"那是——敌袭的号角。",
"你和血牙都愣住了。",
"然后，你看到远处的草原上扬起了一片尘土。在尘土中，无数的人影正在朝这边冲过来。",
"是「黑骨」部落的人。",
"黑骨部落是血牙部落的世仇。两个部落已经打了几十年的仗了，死了无数的人。",
"「全体戒备！」血牙大声喊道，「黑骨部落的人来了！」",
"部落里的兽人纷纷从帐篷里冲出来，有的在穿铠甲，有的在拿武器，有的在往部落的入口跑。空气中弥漫着紧张的气氛，每个人的脸上都写满了愤怒和战意。",
"你站在草原上，看着冲过来的黑骨部落的人，心里突然涌起了一股奇怪的感觉。",
"你不害怕。你也不愤怒。你只是觉得……悲哀。",
"为什么兽人要和兽人战斗？为什么不能和平共处？为什么一定要用流血和死亡来解决问题？",
"「儿子！」血牙的声音把你从沉思中拉了回来，「快躲到帐篷后面去！这里危险！」",
"你看着你的父亲，看着他手里的战斧，看着他脸上的伤疤，心里涌起了一股强烈的冲动。",
"你不想再这样下去了。你不想再看到兽人和兽人互相残杀。你想找到一种方法，让兽人能够和平共处。",
"你想起了母亲留给你的吊坠，想起了父亲说的「先知」萨满。",
"也许，「先知」萨满能告诉你答案。",
"「父亲，」你说，「我要走了。」",
"血牙愣住了。",
"「走？去哪儿？」",
"「去草原的最东边。」你说，「去找「先知」萨满。我想知道，为什么我们兽人一定要战斗。我想找到一种方法，让我们能够和平共处。」",
"血牙沉默了很久。",
"然后，他笑了。笑容里带着一丝苦涩，也带着一丝骄傲。",
"「你果然是你母亲的儿子。」他说，「去吧，儿子。去找到答案。如果有人能改变兽人的命运，那个人一定是你。」",
"「那你呢？」",
"「我在这里。」血牙举起战斧，朝着冲过来的黑骨部落的人大声喊道，「我是血牙部落的酋长！我要和我的部落共存亡！」",
"你看着你的父亲，看着他高大的背影，看着他挥舞着战斧冲向敌人，眼眶一热。",
"「父亲，」你喃喃道，「我一定会回来的。等我回来了，我要让所有的兽人都不再战斗。」",
"你转过身，朝着草原的最东边跑去。",
"风在你耳边呼啸，草在你脚下摇曳。你跑啊跑，一直跑，直到血牙部落的帐篷和战斗的声音都消失在了远方。"
],
options:[
{t:"朝着草原的最东边跑去", go:"origin_orc_leave_1", effect:{flags:["origin_orc_complete"], items:["shaman_pendant"]}},
{t:"先找个地方躲起来，等战斗结束再走", go:"origin_orc_leave_hide"},
{t:"回去帮父亲战斗", go:"origin_orc_leave_fight", effect:{flags:["fought_in_battle"]}}
]}};

N["origin_church_daily_1"]=function(){return{
place:"圣城 · 大教堂",
text:[
"圣城的清晨，是从钟声开始的。",
"你站在大教堂的唱诗班席位上，听着头顶的钟楼传来十二下沉重的钟声。钟声在大教堂的穹顶下回荡，像某种古老的召唤，把你的灵魂从沉睡中唤醒。",
"大教堂里很暗，只有几十根蜡烛在燃烧，发出微弱的黄光。烛光在墙壁上投下摇曳的影子，把那些圣徒的雕像照得忽明忽暗，看起来像是活的一样。",
"空气里弥漫着熏香的味道——那是教会特制的圣香，据说可以净化灵魂。味道很甜，带着一丝辛辣，吸进肺里，让你感觉有点眩晕。",
"你是大教堂唱诗班的一员。说是唱诗班，其实就是个打杂的——打扫教堂、擦拭圣像、准备弥撒用的葡萄酒和面包、在弥撒上唱歌，什么都干。",
"你今年十六岁，在大教堂里已经待了十年了。十年前，你娘得了重病，家里没钱请牧师，你爹就把你送到了大教堂，说是「献给光明神」，实际上就是卖了——大教堂给了你爹五个银币，你就成了大教堂的人。",
"你娘在你走后的第三个月就死了。你爹在你娘死后没多久，就娶了另一个女人，再也没有来看过你。",
"你在大教堂里长大，每天的生活就是祈祷、唱歌、干活。你没有朋友，因为其他唱诗班的孩子都看不起你——他们要么是贵族的私生子，要么是牧师的亲戚，只有你，是被亲生父亲卖掉的。",
"但你并不觉得孤独。因为你有光明神。",
"你虔诚地信仰光明神。你相信，光明神是万能的，是仁慈的，是会拯救所有受苦受难的人的。你每天都在祈祷，祈祷光明神能让你娘在天堂里过得好，祈祷光明神能原谅你爹的罪过，祈祷光明神能给你一个光明的未来。",
"「发什么呆？！」一个尖细的声音在你耳边响起，紧接着是一巴掌拍在你的后脑勺上。",
"你踉跄了一下，回头看到了唱诗班的指挥——一个瘦高的中年男人，脸白得像纸，手指细长，说话尖声尖气，大家都叫他白公公。",
"「今天的赞美诗练好了吗？弥撒的时候要是唱错了一个音，看我怎么罚你！」白公公用他那尖细的声音骂道，「还有，圣像擦了吗？烛台换了吗？葡萄酒温了吗？！」",
"「对不起，指挥。我马上去。」你低着头，转身往圣器室走去。",
"白公公在你身后骂骂咧咧了几句，然后扭着腰走了。",
"你走进圣器室，拿起一块抹布，开始擦拭圣像。圣器室里很暗，只有一扇小窗户，透进一丝微弱的光。空气中弥漫着熏香和旧木头的味道。",
"你擦拭的是光明神的圣像——一个穿着白袍、手持圣剑、头顶光环的男人。据说，光明神在三千年前降临人间，用圣剑斩杀了深渊之主，把人类从黑暗中拯救了出来。",
"你一边擦拭，一边在心里祈祷。",
"「光明神啊，请保佑我娘在天堂里过得好。请原谅我爹的罪过。请给我一个光明的未来。」",
"你正祈祷着，突然听到圣器室的门外传来一阵脚步声。",
"脚步声很轻，很急促，像是有人在偷偷摸摸地走路。",
"你停下手里的动作，侧耳倾听。",
"「……东西带来了吗？」一个低沉的男声在门外响起。",
"「带来了。」另一个声音响了起来，是个女人的声音，很沙哑，「但你要保证，不会有人发现。」",
"「放心，今晚是弥撒日，所有人都在大教堂里，没人会来圣器室。」",
"你心里一惊。有人在圣器室外面秘密会面？他们在说什么？「东西」是什么东西？",
"你屏住呼吸，悄悄地走到门边，透过门缝往外看。",
"门外的走廊里站着两个人。一个是穿着牧师袍的中年男人，你认出了他——他是大教堂的副主教，姓刘，大家都叫他刘副主教。另一个是穿着黑色斗篷的女人，脸藏在斗篷的阴影里，看不清楚长相。",
"刘副主教从怀里掏出一个小瓶子，递给了那个女人。瓶子里装着一种暗红色的液体，在烛光下泛着诡异的光。",
"「这是……」女人的声音在发抖。",
"「灵魂之血。」刘副主教的声音压得很低，「从三个「罪人」身上抽出来的。有了它，仪式就能成功了。」",
"你的心猛地一跳。灵魂之血？「罪人」？仪式？",
"你突然想起了最近大教堂里发生的怪事——最近一个月，已经有三个流浪汉在大教堂附近失踪了。守卫队找了很久，都没有找到他们的下落。",
"难道……他们被当成了「罪人」，被抽走了灵魂之血？",
"「刘副主教，」女人的声音带着恐惧，「我们这样做……光明神会原谅我们吗？」",
"「光明神？」刘副主教突然笑了，笑声里带着一丝疯狂，「你还真的相信那个狗屁光明神？我告诉你，这个世界上，根本没有什么神。有的，只是力量。而深渊，能给我们力量。」",
"深渊？！",
"你吓得后退了一步，撞翻了身后的烛台。",
"「什么人？！」刘副主教大声喝道。",
"你知道，你暴露了。"
],
options:[
{t:"推开圣器室的门，冲出去", go:"origin_church_abnormal_run", effect:{flags:["escaped_church"]}},
{t:"躲在圣器室里，装作什么都没听到", go:"origin_church_abnormal_hide", effect:{flags:["hid_in_church"]}},
{t:"推开窗户，从窗户跳出去", go:"origin_church_abnormal_jump", effect:{flags:["jumped_from_window"]}}
]}};

N["origin_free_leave_3"]=function(){return{
place:"交汇城 · 码头",
text:[
"出发的那天，天还没亮。",
"你背着布包，走出了贫民窟的巷子。李婆婆站在巷口，目送你离开。她没有说什么，只是挥了挥手。",
"你也挥了挥手，然后转身，没有回头。",
"你怕一回头，就会忍不住留下来。",
"码头在城市的东边，你走了大约一个时辰才到。天已经亮了，金色的阳光洒在海面上，波光粼粼。",
"码头上人来人往，商人、水手、旅客、搬运工，各色人等忙忙碌碌。空气里弥漫着海盐、鱼腥和各种香料的味道。",
"你找到了学院的接待船——一艘白色的帆船，船帆上印着艾尔达大陆学院的校徽。",
"船边站着一个穿着学院制服的男人，大约三十岁左右，戴着一副眼镜，看起来很斯文。",
"「你是新生吗？」他看到你，走了过来。",
"「是的。」你递上录取通知书。",
"男人看了一眼通知书，又看了一眼你身上那件打了七个补丁的短褂，眼里闪过一丝惊讶，但很快就恢复了平静。",
"「欢迎来到艾尔达大陆学院。我是你的接待老师，墨丘利。」他伸出手，「上船吧，我们马上就要出发了。」",
"你握了握他的手。他的手很白，很软，和你粗糙的手形成了鲜明的对比。",
"你上了船，站在甲板上，看着码头上的人群越来越小，看着交汇城的轮廓慢慢消失在地平线上。",
"海风吹在你脸上，带着咸味。你深吸一口气，感觉心里既兴奋又不安。",
"你不知道前方等待你的是什么。但你知道，从今天起，你的人生将彻底改变。",
"「在想什么？」墨丘利老师走到你身边。",
"「在想……我是不是在做梦。」你老实说。",
"墨丘利笑了。",
"「不是梦。是真实的。」他看着远方的海平面，「而且，我有一种预感——你会成为这一届最特别的学生。」",
"「为什么？」",
"「因为你的眼睛。」墨丘利看着你的眼睛，「你的眼睛里，有和别人不一样的东西。有愤怒，有悲伤，有不甘，但也有希望。这种眼睛，我只在一个人身上看到过。」",
"「谁？」",
"「一个已经死了的人。」墨丘利的眼神暗了下来，「他叫黄林晶。曾经是学院最天才的学生，也是……守望者最优秀的成员。」",
"你心里一动。黄林晶——这个名字，你好像在哪里听过。",
"「好了，不说这些了。」墨丘利恢复了笑容，「去船舱里休息一下吧。到学院还有三天的航程。」",
"你点了点头，转身往船舱走去。",
"但你没有看到，在你转身之后，墨丘利从怀里掏出一枚旧得发黑的徽章——和李婆婆给你的那枚，一模一样。",
"他看着那枚徽章，低声说了一句：",
"「老伙计，你终于找到继承人了。」"
],
options:[
{t:"进入船舱休息", go:"academy_elda_hub", effect:{flags:["origin_free_complete"], origin:"free_city"}},
{t:"在甲板上再待一会儿，看看大海", go:"origin_free_sea_deck"}
]}};

N["origin_free_daily_2"]=function(){return{
place:"交汇城 · 商会",
text:[
"你下了楼，穿过迷宫一样的巷子，往商会走去。",
"路上，你看到了很多熟悉的面孔——卖油条的张大叔，擦皮鞋的小豆子，站街的春花姐。他们都在为了生存而忙碌，没有人注意到你，也没有人注意到这个城市正在发生的变化。",
"商会在山腰的商业区，一栋三层的石头建筑。门口站着两个护卫，腰间别着短刀，眼神警惕地扫视着过往的行人。",
"你走过去，其中一个护卫拦住了你。",
"「干什么的？」他的声音粗哑，像砂纸磨过铁皮。",
"「我是来跑腿的。王会长让我今天来领任务。」",
"护卫上下打量了你一眼，看到你身上那件打了七个补丁的短褂，眼里闪过一丝轻蔑。",
"「进去吧。王会长在二楼。」他挥了挥手，「别乱碰东西，碰坏了你赔不起。」",
"你没说话，低着头走进了商会。",
"商会一楼是交易大厅，摆满了各种货物——香料、丝绸、瓷器、武器，甚至还有几个关在笼子里的兽人奴隶。空气里弥漫着各种气味，混杂在一起，让人头晕。",
"你沿着楼梯上了二楼。二楼是办公室区域，走廊很安静，铺着厚厚的地毯，踩上去没有声音。",
"你走到王会长的办公室门口，正准备敲门，突然听到里面传来一个低沉的声音。",
"「……货已经到了，就在码头仓库。今晚子时，一手交钱一手交货。」",
"另一个声音响了起来，冰冷得像冬天的河水：「王会长，你最好别耍花样。你知道我们的手段。」",
"「放心，我王某人做生意，一向讲信用。」",
"你心里咯噔一下。码头仓库？李婆婆不是说，最近码头仓库不太平吗？还有，那个冰冷的声音是谁？",
"你正犹豫着要不要敲门，办公室的门突然开了。",
"一个穿着黑色斗篷的人走了出来，差点和你撞个满怀。他抬起头，露出一张苍白的脸，眼睛是诡异的紫色。",
"你吓得后退了一步。",
"黑衣人盯着你看了几秒，嘴角勾起一抹诡异的笑容。然后他转身走了，黑色的斗篷在走廊里拖出一道阴影。",
"你站在原地，心跳得像擂鼓。",
"「进来吧。」王会长的声音从办公室里传出来，带着一丝不易察觉的紧张。"
],
options:[
{t:"走进办公室", go:"origin_free_daily_3"},
{t:"假装有事，先离开", go:"origin_free_abnormal_1", effect:{flags:["avoided_office"]}}
]}};

N["ending_v36_review"] = function(){ return {
  text:function(){
    var arr = [];
    arr.push("【终局将至】");
    arr.push("");
    arr.push("你站在命运的十字路口。回望过去，你做过的每一个选择，都在塑造这个结局。");
    arr.push("");
    
    // 势力回顾
    if(S.flags && S.flags.joined_light_church) arr.push("◆你加入了光明教会——教会将在终局中为你提供审判骑士的支援。");
    if(S.flags && S.flags.joined_eclipse_society) arr.push("◆你加入了暗蚀会——暗蚀会将在终局中成为你的盟友或敌人。");
    if(S.flags && S.flags.joined_watchers) arr.push("◆你加入了守望者——守望者将在终局中为你提供真相和情报。");
    if(S.flags && S.flags.joined_empire) arr.push("◆你加入了东部王国——帝国军队将在终局中支援你。");
    if(S.flags && S.flags.joined_free_cities) arr.push("◆你加入了自由城邦——商会将在终局中为你提供资金和物资。");
    if(S.flags && S.flags.joined_elf_kingdom) arr.push("◆你加入了精灵王国——精灵弓箭手将在终局中支援你。");
    if(S.flags && S.flags.joined_dwarf_kingdom) arr.push("◆你加入了矮人王国——矮人战士和锻造师将在终局中支援你。");
    if(S.flags && S.flags.joined_orc_horde) arr.push("◆你加入了兽人王庭——兽人战士将在终局中与你并肩作战。");
    if(S.flags && S.flags.joined_abyss_cult) arr.push("◆你加入了深渊教派——深渊的力量将在终局中流淌在你的血脉中。");
    
    arr.push("");
    
    // 伏笔回顾
    if(S.foreshadowing && S.foreshadowing.hlj_letter) arr.push("◆黄林晶的信——你知道了七印的真相。");
    if(S.foreshadowing && S.foreshadowing.watcher_spy) arr.push("◆守望者的观察——你被守望者标记为关键人物。");
    if(S.foreshadowing && S.foreshadowing.seal_fragment) arr.push("◆第一印的碎块——你与七印有了特殊的联系。");
    
    arr.push("");
    arr.push("你的选择，决定了这个世界的未来。");
    arr.push("");
    arr.push("你准备好了吗？");
    
    arr.push("风从废墟间穿过，呜呜地响，像什么东西在远处哭。空气里浮着灰烬和旧时代的味道——铁锈、焦土、还有一缕若有若无的、甜腻得反常的气息。");arr.push("你站在高处，看着远方的天际线。七道封印的光柱横亘在天地之间，其中三道已经黯淡得像将熄的烛火，明灭不定。你曾经觉得那些光柱是这个世界最坚固的东西，现在才知道，它们也会累。");arr.push("你低头看着自己的手。这双手做过太多选择，有些是对的，有些……你到现在也不敢说。但那些选择都还活着，像埋进土里的种子，无论好坏，都在某个看不见的地方发了芽。");arr.push("身后传来脚步声。你没有回头，但你知道那是谁——一路走到这里的人，脚步声你都认得出。");arr.push("「想好了吗？」那人问。");arr.push("你看着那三道将熄的光柱，握紧了拳。");return arr;
  } /*v45inj:ending_v36_review*/,
  options:[
    {t:"我准备好了，迎接终局", go:"final_battle", effect:{}},
    {t:"再看一眼这个世界", go:"city_free", effect:{}}
  ]
};}

// ===== 势力结局·光明教会 =====
N["ending_v36_church"] = function(){ return {
  text:function(){return [
    "【结局：圣光永存】",
    "",
    "你带领光明教会的审判骑士，净化了深渊的侵蚀。七印被修复，原初之物重新沉睡。",
    "教会将你封为圣徒，你的事迹被写入圣经。每年的这一天，信徒们都会点燃蜡烛，纪念你的功绩。",
    "但你知道——光明的背后，总有阴影。而你，将永远守护这道光。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入光明教会：审判骑士在终战中发挥了关键作用",
    "◆信仰坚定：你的祈祷在最黑暗的时刻带来了光明",
    "",
    "【世界状态】",
    "七印：修复 ✓",
    "深渊：被净化 ✓",
    "教会：成为大陆最强大的势力",
    "你的名声：圣徒，永远被铭记"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 势力结局·暗蚀会 =====
N["ending_v36_eclipse"] = function(){ return {
  text:function(){return [
    "【结局：暗蚀降临】",
    "",
    "你和暗蚀会一起，打破了七印的枷锁。原初之物苏醒了——它们不是恶魔，是被囚禁了万年的古神。",
    "世界陷入了混乱，但也获得了真正的自由。教会的统治崩塌了，新的时代开始了。",
    "你成为了暗蚀会的领袖，站在原初之物的身旁。有人说你是救世主，有人说你是灭世者。",
    "但你知道——你只是给了这个世界一个选择的机会。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入暗蚀会：你获得了打破七印的力量和情报",
    "◆接受深渊之力：你能与原初之物沟通",
    "",
    "【世界状态】",
    "七印：破碎 ✓",
    "原初之物：苏醒 ✓",
    "教会：衰落",
    "你的名声：暗蚀之主，争议中的救世主"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 势力结局·守望者 =====
N["ending_v36_watcher"] = function(){ return {
  text:function(){return [
    "【结局：永恒的观察者】",
    "",
    "你没有选择封印，也没有选择解放。你选择了第三条路——理解。",
    "你理解了七印的真相，理解了原初之物的悲哀，理解了教会的虚伪和暗蚀会的极端。",
    "你成为了新的守望者领袖，在光明与黑暗之间维持平衡。世界没有完美的结局，但你让它避免了最坏的结局。",
    "你将继续观察、记录、守护——直到时间的尽头。",
    "",
    "【你的选择塑造了这个结局】",
    "◆加入守望者：你获得了三千年的真相和智慧",
    "◆拒绝极端：你在所有势力之间保持了独立",
    "",
    "【世界状态】",
    "七印：维持现状（缓慢修复）",
    "深渊：被监控",
    "所有势力：平衡共存",
    "你的名声：守望者之主，被遗忘的守护者"
  ];},
  options:[{t:"结束游戏", go:"game_over", effect:{}}]
};}

// ===== 游戏结束 =====
N["game_over"] = function(){ return {
  text:function(){return [
    "【游戏结束】",
    "",
    "感谢你游玩《艾尔达大陆：群雄割据》。",
    "",
    "你的故事已经结束，但这个世界还在继续。也许，在另一个平行世界里，另一个你会做出不同的选择，经历不同的故事。",
    "",
    "【你可以】",
    "◆开始新游戏，体验不同的出身、不同的选择、不同的结局",
    "◆查看编年史，回顾你在这个世界留下的痕迹",
    "",
    "——艾尔达大陆，永远等待着新的冒险者。"
  ];},
  options:[
    {t:"开始新游戏", go:"title_screen", effect:{}},
    {t:"查看编年史", go:"chronicle_main", effect:{}}
  ]
};}

console.log('[V36] 结局线联动补充已加载（选择回顾+3势力结局+游戏结束）');



// ============================================================
// v39 方向一：学院政治暗流（36节点）
// ============================================================

N["pol_intro"]=function(){return{
place:"学院·学生会门口",
text:["学院的食堂，是消息最流通的地方。", "你端着餐盘坐下，邻桌几个高年级学生正在低声议论什么。你竖起耳朵，只听见零星的几个词：「副院长」「调令」「光明派」「查账」。", "一个三年级学生注意到你，压低声音：「新生？劝你一句，学院的水，深得很。别急着站队——站了，就下不来了。」", "你问他学院里都有什么派系。他左右看了一眼，用勺子敲了敲餐盘：「明面上，三股。光明派、自由派、还有一股——谁都说不上来名字的。你只需要知道，别在食堂大声念任何一个名字。」", "他站起来收拾餐盘，又补了一句：「还有，别信任何人说的『我不站队』。在这学院里，不站队，也是一种站队。」", "他走了。你坐在餐桌前，看着盘子里剩下的饭，忽然觉得，学院的食堂，和市井的茶馆，也没什么两样。", "学院的消息一向传得快。今天早上，你在公告栏前停下，一张烫金的请柬从信封里滑出来——学生会主席的署名，邀你明晚参加一场「内部茶会」。", "请柬背面用铅笔写了行小字：「不来也没关系。但有些事，知道了总比不知道好。」字迹潦草，像写完又犹豫过。", "旁边一个二年级生瞟了一眼，压低声音：「学生会的水深得很。你最好想清楚再蹚。」他说完就匆匆走了，留下你捏着那张请柬，站在人来人往的走廊里。", "晚风从窗缝灌进来，带着食堂的油烟味和一点说不清道不明的铁锈气。", "下午的课结束后，你路过公告栏。", "公告栏上贴着几张新通知：课程调整、图书馆开放时间变更、还有一个不起眼的角落，贴着一张白纸，上面只写着一句话：「有人想聊聊吗？旧钟楼，日落。」", "没有署名。没有落款。你站在公告栏前看了一会儿，把那张白纸上的字记住了。", "周围人来人往，没有人在那张白纸前停留。可你注意到，一个穿着旧灰袍的教授路过时，脚步明显顿了一下。", "你离开公告栏，走进黄昏的光里。你忽然觉得，这张白纸，可能比公告栏上所有的通知，都更重要。"] /*v45inj:pol_intro*/,
options:[
{t:"赴约，参加茶会", go:"pol_faction_map"},
{t:"先打听学生会的情况", go:"pol_rumor_hall"},
{t:"把请柬收起来，不去", go:"pol_ignore"}
]
}};

N["pol_rumor_hall"]=function(){return{
place:"学院·公共休息室",
text:["学院东楼的走廊尽头，有一间永远开着的空教室。", "学生们管它叫「谣言厅」——不是因为它传谣言，而是因为在这里，什么都能聊，聊完出门就都不认账。", "你推门进去。屋里坐着五六个人，有人在下棋，有人在看书，有人趴在桌上打盹。角落里一个戴眼镜的女生抬头看了你一眼：「新面孔。坐。」", "你坐下。她推过来一张纸：「规矩：在这里说的话，出门就不算数。想问什么，现在问。」", "你想了想，问：「老鸦，是谁？」", "屋里安静了一瞬。下棋的人停下手，看书的人抬起头。眼镜女生推了推镜框，声音低了几分：「你查他？那你是刚来的。他失踪之前，是学院里最会挖墙角的人。」", "「挖什么墙角？」你问。", "她没有回答，只是把纸收了回去：「今天先聊到这。你下次来，带点真东西来换。」", "你找了个靠窗的位子坐下，故意把请柬压在茶杯底下。对面坐着个正在补笔记的三年级学姐，头也不抬：「不用藏了，整个学院都知道你收到了。」", "她合上笔记，露出一张晒得微黑的脸：「学生会每年都招新血。去年是炼金系的瓦伦，今年轮到你——要么你有用，要么你有背景，要么……」她顿了顿，「你身上有他们想要的东西。」", "「茶会不是聊天，是摸底。」学姐把笔记本往怀里一收，起身前丢下一句，「记住，学生会里三个派系——光明派唱高调，自由派讲利益，还有一拨人，你永远不知道他们是谁的棋子。」", "她走后，窗外的钟楼敲了四下。你低头看那杯茶，水面起了细细的涟漪。", "你走出谣言厅，在走廊里慢慢走着。", "暮色从窗户外漫进来，把走廊染成琥珀色。你路过一扇半开的门，里面传来低低的对话声——你放慢脚步，听见了半句：「……那个新生，在查老鸦。」", "你脚步不停，继续走。可你的心跳，快了一拍。", "你回到宿舍，躺在床上，看着天花板。你今天什么都没打听到，可你忽然觉得，整个学院，都在看着你。", "你闭上眼。老鸦、银羽毛、地下室地图、谣言厅——这些碎片在你脑子里转着，像一盘还没开始的棋。", "你不知道谁是棋手，谁是棋子。你只知道，你已经坐在棋盘上了。"] /*v45inj:pol_rumor_hall*/,
options:[
{t:"去参加茶会", go:"pol_faction_map"},
{t:"再找学姐多问几句", go:"pol_rumor_more"}
]
}};

N["pol_rumor_more"]=function(){return{
place:"学院·走廊",
text:["「你要听真话还是假话？」那个学生压低声音，「假话，是学院一切安好；真话——是教委会的人，上个月来过三次了。」", "「来查什么？」你问。", "「查账。查档案。查——禁书区。」他说，「听说，他们要找一份名单。」他顿了顿，「一份早年毕业生的名单。」", "你端着杯子，没有接话。他也没有再往下说，只是拿起酒杯，把最后一口喝完，抹了抹嘴：「你当我没说。反正，这些话，出了这个门，我是不认的。」", "他站起来，拍了拍你的肩，走了。你坐在那里，看着杯子里剩下的一点酒，想着「名单」两个字。", "学姐走得不快，你几步追上。她侧过头，眉头微皱：「还有事？」", "「你说的『他们』——是谁的棋子？」你问。", "她盯着你看了两秒，忽然笑了，笑里没什么温度：「问这种问题的人，通常活不过第一个学期。我说的是政治上的活法，别想歪。」", "她压低声音：「学院每年拨给学生会一千金币的活动经费，实际到账的只有六百。剩下四百去哪了？查账的人换了两届，没人查出结果——不是查不到，是不敢查。」", "走廊尽头的灯忽明忽灭。她没再回头，声音飘过来：「茶会，最好还是去。至少看看水面下藏着什么。」", "邻桌又有人聊起来。这次声音更低，你只能断断续续地听见几个词。", "「……地下三层……」「……钥匙在谁手里……」「……听说有人看见过，那扇门开着……」", "你侧耳想听清，说话的人却忽然停了。其中一个转过头，看了你一眼——那目光很平，像在看一件无关紧要的东西。你移开视线，低头喝自己的酒。", "过了片刻，他们换了话题，开始聊天气。好像刚才那些话，从来没有存在过。", "你记住了「地下三层」和「钥匙」这两个词。酒馆的灯又晃了一下，你忽然觉得，这杯酒的味道，有点变了。"] /*v45inj:pol_rumor_more*/,
options:[
{t:"去参加茶会", go:"pol_faction_map"},
{t:"暗中调查经费去向", go:"pol_gold_trail"}
]
}};

N["pol_gold_trail"]=function(){return{
place:"学院·财务室门口",
text:["财务室的门虚掩着。你借着整理鞋带的工夫往里扫了一眼——墙上挂着历届学生会账目，最新的那本摊在桌上，墨迹还很新。", "你还没看清数字，一只手从背后按住你的肩膀。", "「同学，财务室不欢迎闲人。」门卫老休恩面无表情，他在这干了二十年，脸上的皱纹像刀刻的。他把你往外推了推，语气忽然软了一点，「要看账？去找学生会书记要，公开账目每个季度都有副本。」", "他顿了顿，又补了一句，声音低得像自言自语：「不过你要真查到了什么，别声张。上一个较真的，转学了。走的时候，什么都没带走。」", "老休恩说完就回了门房，留你站在原地，看着那扇半掩的门。里面那本账册，还摊在桌上。", "关于那批黄金的去向，你追查了很久，终于摸到了一条线。", "线索的起点，是一张货单。货单上记的，是一批「矿石」，数量很大，日期却对不上——那批矿，早在半年前，就报过「枯竭」了。", "你顺着货单，找到了一家不起眼的商行。商行门面很小，但你发现，它背后的账，通着一座你认识的大宅。", "你在商行对面的茶馆，坐了一下午。你看着进出的人，记着他们的脸。太阳落山的时候，你合上本子，心里已经有了一个大概。", "你走出茶馆，天已经黑了。你回头，看了一眼那家商行——灯还亮着。你在想，那批「矿石」，现在，应该在路上了。"] /*v45inj:pol_gold_trail*/,
options:[
{t:"去找学生会书记要公开账目", go:"pol_gold_ledger"},
{t:"晚上再来，偷偷看那本账", go:"pol_gold_night"},
{t:"先放一放，去参加茶会", go:"pol_faction_map"}
]
}};

N["pol_gold_ledger"]=function(){return{
place:"学院·学生会办公室",
text:["账本上那笔数字，你查了三遍。", "每一遍，结果都一样。那笔钱，名义上是「修缮旧礼堂」，可旧礼堂的修缮账目，在另一本账上——金额对不上，差了一倍还多。", "你把账本合上，靠在椅背上，看着天花板。你知道，这件事不该你管。可你已经看见了，就放不下了。", "你想起小时候，你娘教你：别人的东西，别动；看见不平的事，能帮就帮一把。她没说，看见不平的事，该怎么办。", "你坐了很久，终于把账本放回原处，站起来。你告诉自己：再看看吧。等你看清楚了，再说。", "学生会书记是个戴圆框眼镜的男生，叫柏图，说话慢条斯理。听你说明来意，他从抽屉里取出一本厚厚的账册，封皮磨得发白。", "「公开账目，随便看。」他推过来，又补了句，「不过——你最好看看去年和今年的对比。」", "你翻开账册。去年活动经费实收八百，今年六百。去年赞助收入三笔，今年只有一笔，落款是「商会」。柏图看你的表情，摘下眼镜擦了擦：", "「看出来了？赞助少了两家。那两家去年都点名要冠名『春季炼金大赛』，今年名额给了圣光神学院的交流团。」他声音不大，「你说，谁有本事把学院里的钱，挪到学院外去？」", "他重新戴上眼镜，语气平平：「账目没问题，每一笔都合规。可合在一起，就是问题。」", "后来的几天，你开始留意旧礼堂。", "它确实在修。工匠们搭着架子，叮叮当当地敲。你路过的时候，看了一眼——修的活儿，做得不差，用料也实在。", "可你知道，账上多出来的那一倍钱，没有变成这些砖瓦。它去了哪里，你暂时还不知道。", "你开始留意别的地方。食堂的账，图书馆的账，马厩的账——你看得越多，越发现，那笔钱的影子，在好几处账本里，若隐若现，像一条藏在水底的鱼。", "你没有声张。你只是开始记——记在一个只有你自己看得懂的地方。你也不知道记下来有什么用，可你总觉得，总有一天，会有用的。"] /*v45inj:pol_gold_ledger*/,
options:[
{t:"问他怀疑谁", go:"pol_ledger_suspect"},
{t:"记下这个线索，去茶会", go:"pol_faction_map"}
]
}};

N["pol_ledger_suspect"]=function(){return{
place:"学院·学生会办公室",
text:["账本的第三页，有一处被涂改过的痕迹。", "墨水涂得很重，可你对着光，还是能看出底下原本的数字——和上面记着的，差着不少。", "你翻到下一页，对照日期，又翻了翻前面的记录。那几天的进出账，数目都对不上——不是差一点，是差了很多。", "你合上账本，坐了一会儿。这账本不是你的，你只是路过，随手翻开。可你现在知道了，这账本里，藏着一件事。", "你忽然明白，有些秘密，不是你去挖出来的——是它们自己，走到你面前的。", "柏图左右看了一眼，办公室没别人，他还是压低了声音：「我没说怀疑谁，只是提醒你一个现象。」", "「什么现象？」", "「学生会主席，今年已经是第三届连任了。学院规定最多两届。」他推了推眼镜，「可他总说『筹备期不算正式任期』，每届到一半就『改组重选』——重选的时候，光明派永远刚好差一票，自由派永远刚好够不着。」", "窗外有人经过，他立刻住嘴，等脚步声远了才继续说：「你说巧不巧？永远刚刚好。」", "他把账册收回去，像什么都没发生过一样：「茶会是七点，别迟到。迟到的人，会错过很重要的东西。」", "你把账本放回原处，装作什么都没看见。", "可你记住了那个日期，那处涂改，那个对不上的数字。你甚至没有刻意去记——它自己刻在了脑子里。", "晚上你躺在宿舍床上，想起白天的事。你翻了个身，又翻了个身。你知道，从你看见那页纸开始，有些事，就已经和你有关了。", "你闭上眼睛，眼前还是那处涂改的痕迹。墨迹底下压着的数字，像一只闭着的眼睛。", "那一夜，你做了个梦。梦里有一本很大的账本，每一页都在哗哗地翻。你伸手想按住，它却越翻越快，最后一页，是空白的。"] /*v45inj:pol_ledger_suspect*/,
options:[
{t:"准时赴约", go:"pol_faction_map"},
{t:"故意迟到，看看会发生什么", go:"pol_late_arrive"}
]
}};

N["pol_late_arrive"]=function(){return{
place:"学院·学生会活动室",
text:[
"你故意晚了一刻钟。活动室里灯火通明，长桌旁坐满了人，你推门时，所有目光同时转过来——那种整齐划一的注视，让你后背一紧。",
"主席瓦伦坐在主位，他比你想象中年轻，二十出头，笑容温和得滴水：「来了就好。坐吧，我们刚说到你。」",
"「说到我什么？」你落座，端起面前的热茶。",
"「说到你很有好奇心。」瓦伦笑了笑，「好奇心是好事，学院就缺有好奇心的学生。不过——」他话锋一转，目光落在你身上，「好奇心过了头，就容易看见不该看的东西。上一届有个学生，就是好奇心太盛，后来转学了。」",
"满座寂静。一个角落里的灰袍女生低头喝茶，杯沿挡住了半张脸。你注意到，她的袖口绣着一枚极小的银色羽毛——那是守望者的标记，还是暗蚀会的？你没能看清。",
"瓦伦举起茶杯：「不管怎样，欢迎来到学生会。这里的规矩很简单——看清风向，站好位置，别站错。」"
],
options:[
{t:"问他是谁在操控经费流向", go:"pol_open_question"},
{t:"先蛰伏，观察派系格局", go:"pol_faction_map2"},
{t:"盯住那个灰袍女生", go:"pol_gray_girl"}
]
}};

N["pol_open_question"]=function(){return{
place:"学院·学生会活动室",
text:[
"你放下茶杯，直视瓦伦：「主席，我想问个问题。学院每年六百金币的实收经费，有一半流向了对外的『交流项目』。这些项目，是谁批的？」",
"满座寂静。有人咳嗽了一声。瓦伦的笑容不变，但他放在桌上的手指轻轻敲了两下桌面——那是压怒气的动作。",
"「问得好。」他说，「经费流向，由财务委员会审核，我只是执行。你要是感兴趣，可以加入财务委员会，亲自看着每一枚金币怎么花。」",
"他这话说得滴水不漏，但桌上其他人交换的眼神，你全看在眼里——有人低头，有人绷紧嘴角，有人飞快扫了你一眼又移开。",
"散会时，灰袍女生从你身边经过，脚步极轻，丢下一句话，像羽毛落地：「想查真相，就别站在灯底下问。灯下的问题，永远只有一个答案——『合规』。」",
"你还没来得及追问，她已经消失在走廊拐角。"
],
options:[
{t:"跟上灰袍女生", go:"pol_gray_follow"},
{t:"加入财务委员会，从内部查", go:"pol_finance_join"},
{t:"去找自由派打听", go:"pol_free_meet"}
]
}};

N["pol_gray_follow"]=function(){return{
place:"学院·东侧走廊",
text:[
"灰袍女生走得很快，步幅不大，但没有多余的动作。你跟到东侧走廊拐角时，她忽然停下，背对着你说：「跟了三条街，够了吧。」",
"你僵在原地。她转过身，月光从高窗洒下来，照亮她的脸——年轻，眉眼冷冽，看着你的眼神没什么情绪。",
"「我叫灰翎，三年级，占星系。」她说，「你今晚问的问题，我三年前问过一模一样的。」",
"「结果呢？」",
"「结果？我找到了答案，然后被调去了一个没人去的档案馆整理旧卷宗，一整理就是两年。」她抬起手，袖口的银色羽毛在月光下一闪，「羽毛是真的，但我的立场，从来只有我自己。」",
"她往前走两步，又停住：「你要真想知道那四百金币去哪了——去查『西海岸贸易协会』。他们每年捐一笔钱给学院，但从不参加任何公开活动。你猜，钱为什么捐得这么干净？」",
"她说完便走，这次没有回头。"
],
options:[
{t:"去查西海岸贸易协会", go:"pol_trade_west"},
{t:"先参加茶会摸清局势", go:"pol_faction_map2"}
]
}};

N["pol_trade_west"]=function(){return{
place:"学院·档案馆",
text:[
"你在档案馆翻了一下午旧卷宗，指尖被纸页磨得发白。终于在一本落灰的捐赠记录里找到线索：西海岸贸易协会，连续七年向学院捐款，总额三千二百金币。",
"但奇怪的是——捐款用途栏写的都是「学术交流」，可这七年里，学院与西海岸相关的交流项目，你数了数，只有两个。",
"那剩下的钱去哪了？",
"你正想继续翻，档案室的门被推开了。门口站着学生会副主席塞德，他手里捧着一摞新卷宗，看见你时脚步顿了顿，然后若无其事地走进来：",
"「查资料？占星系的论文季确实到了。」他笑着把卷宗放到架子上，「提醒你一句，档案馆晚上八点闭馆。别待太晚——这楼老，入夜之后，总有些说不清的声音。」",
"他说完就走了。你低头看那本捐赠记录，扉页上有个铅笔写的数字：十四。不知道是什么意思。"
],
options:[
{t:"调查数字14的含义", go:"pol_number14"},
{t:"把线索记下，先离开", go:"pol_faction_map2"}
]
}};

N["pol_number14"]=function(){return{
place:"学院·档案馆",
text:[
"你沿着「14」这个数字查了半晚。在档案室的旧书架第三排，一本《学院百年校志》里，夹着一张泛黄的便签——「第十四任院长，任期与其余额对不上。」",
"便签纸角撕了一半，像是仓促留下的。你翻到校志关于第十四任院长的记录：任期七年，学术成就平平，但在他任内，学院西侧加建了一座塔楼。",
"塔楼。你抬头看向窗外——夜色里，那座灰塔就矗立在学院西侧，常年上锁，据说里面存放旧教材。",
"你正要合上校志，封底滑出一张照片。照片上，第十四任院长站在塔楼前，身边站着个年轻人——那张脸，你好像在什么地方见过。",
"你想起来了。学生会主席瓦伦。这张照片里的年轻人，和瓦伦有七分相似。",
"你盯着照片，档案室的灯忽然闪了一下。远处，传来钟楼敲响九点的声音。"
],
options:[
{t:"深夜去西塔楼看看", go:"pol_tower_night"},
{t:"把照片收好，明天再查", go:"pol_faction_map2"}
]
}};

N["pol_tower_night"]=function(){return{
place:"学院·西塔楼",
text:[
"西塔楼的门锁是旧的铜锁，锈得发绿。你正琢磨怎么开锁，手刚搭上锁扣——锁就开了。锁芯里插着一把钥匙，像是有人提前放在那里。",
"你推门进去，一股陈年灰尘的气味扑面而来。楼梯盘旋而上，木阶在脚下吱呀作响。越往上走，墙上的挂画越多，全是历任院长的画像。",
"最顶层的房间门虚掩着。你推开一条缝，看见里面亮着烛光——一个人背对你站着，正在翻一摞发黄的文件。",
"听见动静，那人缓缓转过身。烛光映出他的脸——是副院长埃德蒙，学院里公认的「老好人」，永远笑眯眯的。此刻他脸上没有笑。",
"「来了。」他说，语气平静得像早就知道你会来，「我等你三届了。每一届都有像你这样的学生走到这里，然后——」他顿了顿，「然后他们选择了忘记。」",
"他放下文件：「你也可以现在离开。我保证，今晚的事，没人会知道。」"
],
options:[
{t:"留下来，听他说完", go:"pol_edmund_truth"},
{t:"转身离开，当没来过", go:"pol_leave_tower"}
]
}};

N["pol_edmund_truth"]=function(){return{
place:"学院·西塔楼顶层",
text:[
"你留下来。埃德蒙叹了口气，把一摞文件推到你面前。烛光下，你看见那是一份份「转学申请」——每一份的姓名栏都被涂掉了，但日期都在每学期期末。",
"「十四任院长，每一任都留下一份这样的东西。」他说，「有的学生查账查到一半『转学』，有的学生发现了塔楼『转学』，有的学生——」他看向你，「今晚也走到了这一步。」",
"「这到底是怎么回事？」你问。",
"「学院的钱，养着学院看不见的东西。」埃德蒙的声音很低，「西海岸贸易协会、圣光神学院的交流团、帝国军事学院的联合研究——这些项目的背后，是同一个金主。他们资助学院，条件是学院每年输送『观察员』。」",
"「观察员？观察什么？」",
"埃德蒙没有回答。他只是把烛火吹低了一点：「你确定，你想知道吗？」",
"窗外，远处传来狗吠。塔楼里的烛光晃了晃，他等着你的回答。"
],
options:[
{t:"我要知道真相", go:"pol_truth_deep"},
{t:"先退一步，把消息带给灰翎", go:"pol_gray_girl2"}
]
}};

N["pol_truth_deep"]=function(){return{
place:"学院·西塔楼顶层",
text:["埃德蒙看了你很久，然后从怀里掏出一枚徽章——银质，刻着一只展翅的鹰，鹰爪下握着天平。这是守望者的徽记。", "「我是守望者驻学院的联络人。」他说，「十四年了，我们一直在查同一件事：那笔钱流向哪里，『观察员』被送去干什么。每一届都有人查到门口，然后被学院用『转学』的方式送走。」", "「所以——守望者需要我？」", "「我们需要一个，能站在灯下提问，又不会被打倒的人。」埃德蒙把徽章收回怀里，「你不用现在就答应。回去想想，想清楚了，明晚还来塔楼。」", "他熄了烛火，黑暗里只剩他的声音：「记住，学院政治的水下，没有干净的答案。但水下，才是真相所在的地方。」", "你走出塔楼时，夜风很凉。月光把灰塔的影子拉得很长，一直拖到学生会的窗下。", "你终于，把真相挖到了底。挖到的那一刻，你没有预想中的释然，只有一种说不清的冷。", "真相，不是你想象的任何一种。它比你想的，更平常——也更残忍。因为，它牵扯的人，比你认识的人，多得多。", "你坐在房间里，把那张写满真相的纸，看了一遍，又一遍。你把它，看了很久，然后，划燃火柴，把它烧了。", "你看着纸在火里卷曲、变黑、成灰。你看着那团灰烬，在心里，把那个真相，重新吞了回去。", "你站起来，把灰烬扫干净，倒进窗外的风里。你关上门，走回人群。你脸上，看不出任何变化。只有你自己知道，你心里，压着的东西，又重了一点。"] /*v45inj:pol_truth_deep*/,
options:[
{t:"答应守望者，继续调查", go:"pol_watcher_accept"},
{t:"再想想，先回宿舍", go:"pol_back_dorm"}
]
}};

N["pol_watcher_accept"]=function(){return{
place:"学院·西塔楼",
text:[
"第二晚，你再次登上塔楼。埃德蒙已经在等你了，桌上点着两盏灯，一盏白，一盏黄。",
"「守望者的规矩很简单：不暴露身份，不牵连学院，每一份情报都要有来源。」他把一枚普通的学生徽章递给你——看起来与任何学生佩戴的毫无二致，「这是联络信物。翻过背面，有一道极细的刻痕，只在特定角度能看到。」",
"你收下徽章，指尖摩挲着背面，果然摸到一道若有若无的凹痕。",
"「第一件事。」埃德蒙说，「三天后，圣光神学院的交流团要来。名义上是学术交流，但他们的名单里有个『图书管理员』——从来不出席任何活动。我想知道，他真正去见谁。」",
"他顿了顿：「学院里有些人，表面上是教授，骨子里是别的身份。查出来，告诉我。」",
"窗外，夜色正浓。塔楼下的石板路上，一个提着灯笼的身影匆匆走过——看身形，像是那个灰袍女生。"
],
options:[
{t:"开始调查交流团", go:"pol_exchange_probe"},
{t:"先去找灰翎，确认她的立场", go:"pol_gray_girl2"}
]
}};

N["pol_gray_girl2"]=function(){return{
place:"学院·占星塔天台",
text:[
"你在占星塔天台找到灰翎。她正对着星图写写画画，听见脚步声也没回头：「你查到塔楼了。」",
"你还没说话，她先开口：「昨晚塔楼的灯亮到后半夜。这三年，塔楼的灯只亮过两次——一次是副院长进去，一次是昨晚。」",
"「你也在查。」你说。",
"「我说过，我的立场只有我自己。」她搁下笔，转过身来，月光下她的眼神很亮，「但我不介意告诉你一件事——圣光交流团里那个『图书管理员』，三年前也来过。他走的第二天，财务室里负责印章的老师傅就辞了职，再没人见过他。」",
"「所以这次——」",
"「这次，」她打断你，「我想亲眼看看他到底见谁。」她递给你一张纸条，上面写着一个时间：明晚，亥时，图书馆地下二层。",
"她说完又转回去看星图，声音淡淡的：「去不去，随你。」"
],
options:[
{t:"明晚去图书馆地下二层", go:"pol_library_b2"},
{t:"把线索报告给埃德蒙", go:"pol_report_edmund"}
]
}};

N["pol_report_edmund"]=function(){return{
place:"学院·西塔楼",
text:["埃德蒙听你说完，沉默了很久。", "他坐在书桌后面，手指交叉，抵着下巴。桌上的烛火跳了跳，把他的影子投在墙上，拉得很长。", "「你知道，」他终于开口，「你刚才说的这些话，足够让你被请去教委会，喝三天茶。」", "「我知道。」你说。", "「那你还说？」他问。", "「因为我觉得，应该让你知道。」你说。", "他看着你，目光很复杂。过了很久，他站起来，绕过书桌，在你面前停下：「你说得对，应该让我知道。」他顿了顿，「但下次——别在学院里说。去城南那家茶馆，找老板要一壶『云雾』。」", "你记住了。他没有再解释，只是拍了拍你的肩：「去吧。今晚的事，就当没发生。」", "你把灰翎的情报告诉埃德蒙。他听完，眉头慢慢拧起来：「图书馆地下二层？那里我查过三次，只有一间废弃的期刊库，早就封了。」", "他沉吟片刻：「除非——那间期刊库不是废弃，是伪装。」他从柜子里取出一串旧钥匙，「这是三年前收缴的，据说能开学院里所有的锁。你拿去，明晚亥时，我和你在图书馆侧门碰头。」", "他顿了顿，语气难得地凝重：「灰翎这姑娘，我观察她两年了。她不站任何一方，但她的直觉，从没错过。」", "「那她——可以信任吗？」你问。", "「可以信任她的判断，别信任她的立场。」埃德蒙说，「守望者的第一条训诫：情报有价值，但提供情报的人，永远有自己的目的。」", "他把钥匙交到你手里，铜钥匙在灯光下泛着冷光。", "你走出他的书房，走廊里很静。", "你走出几步，忽然听见身后有声音。你回头——没有。走廊空空的，只有你的影子，被远处一盏灯拉得老长。", "你继续走。走了几步，你又停下来，回头。这一次，你看见了——走廊尽头的转角，有一角袍角，一闪，不见了。", "你没有追。你只是记住了那个转角。", "回到宿舍，你在黑暗里躺了很久。你想起埃德蒙说的「云雾」——城南茶馆，一壶云雾。", "你翻了个身，看着天花板。你知道，从今晚开始，你走进了一个比学院更深的地方。那个地方没有门牌，没有路标，只有一句一句、说了一半的话。"] /*v45inj:pol_report_edmund*/,
options:[
{t:"明晚赴约", go:"pol_library_b2"}
]
}};

N["pol_library_b2"]=function(){return{
place:"学院·图书馆地下二层",
text:[
"亥时，图书馆早已闭馆。你从侧门溜进去，走廊里只有应急灯发出昏暗的光。埃德蒙已经到了，站在一扇积灰的铁门前。",
"他用那把旧钥匙试了两把锁，铁门吱呀一声开了。门后是一条向下的阶梯，空气里弥漫着霉味和纸张的气息——但最底下透出来一丝光。",
"「有人。」埃德蒙压低声音，示意你熄掉灯笼。你们摸黑走下去，阶梯尽头，一扇半掩的门缝里漏出烛光。",
"你从门缝看进去——一个穿圣光神学院制服的秃顶男人，正把一沓文件递给一个背对门口的人。那人接过文件，翻开第一页，烛光照亮他的手——指节粗大，虎口有老茧。",
"是战士系教授昆特。学院的战斗课教头，谁都知道他和圣光神学院关系不好。",
"「数目对了吗？」秃顶男人问。",
"「少了三百。」昆特的声音很冷，「告诉他们，再拖下去，合作就到此为止。」",
"门缝里，烛火跳了一下。你屏住呼吸，心跳声在寂静的地下格外清晰。"
],
options:[
{t:"继续偷听", go:"pol_listen_more"},
{t:"让埃德蒙决定怎么办", go:"pol_edmund_decision"}
]
}};

N["pol_listen_more"]=function(){return{
place:"学院·图书馆地下",
text:["这一次，你听到了更多。", "不是因为他们说得更大声，而是你学会了听——知道哪些话是说给你听的，哪些话是故意说给所有人听的，哪些话，是说的时候，自己在心里打了个突的。", "「……老院长在位的时候，图书馆的钥匙，是一人一把的。」「现在呢？」「现在——钥匙在一个人手里。」", "「谁？」「不知道。但那个人，一定就住在学院里。」", "你端着杯子，没有动。这些话像水一样流过去，可你记住了。", "你贴着墙，继续听。", "「三百金币的缺口，不是我们能决定的。」秃顶男人语气为难，「上面说，最近守望者盯得紧，资金周转要慢一些。」", "「守望者？」昆特冷笑一声，「那个缩在塔楼里的老家伙，连只苍蝇都盯不住。你回去告诉上面——学院这边的线，我还能压住。但西海岸那边再断粮，就别怪我把他们的人供出去。」", "他这话说得狠，但声音里有不易察觉的颤——他在害怕。", "烛火忽然一晃，门缝里，昆特猛地转头，看向你藏身的角落：「谁？！」", "埃德蒙一把按住你的肩膀，低声：「走！」", "你们拔腿就跑。身后传来椅子倒地的声音，还有昆特压低的怒喝。楼梯在脚下吱呀作响，你冲出图书馆侧门时，夜风灌进肺里，又冷又疼。", "散场的时候，一个年老的教师从你身边走过。他走得很慢，像是腿脚不好。经过你身边时，他停了一下——只是那么一下。", "「年轻人，」他没有看你，声音很轻，「夜里走路，别踩别人的影子。」", "他说完，继续走了。你站在原地，看着他的背影消失在走廊尽头。", "那句话，你想了很久。后来你在学院里再没见过他——有人说他退休了，有人说他调走了。可你总觉得，他还在，只是换了个地方，继续看。", "你后来养成了一个习惯：夜里走路的时候，会留意脚下。不踩别人的影子。"] /*v45inj:pol_listen_more*/,
options:[
{t:"甩掉追踪，回塔楼商量", go:"pol_after_chase"}
]
}};

N["pol_after_chase"]=function(){return{
place:"学院·西塔楼",
text:[
"你们一路绕回塔楼，把门栓死。埃德蒙靠在墙上喘气，好一会儿才开口：",
"「昆特——战士系教头——圣光神学院的暗线。」他苦笑一声，「我查了三年，以为源头在学院外，没想到就在眼皮底下。」",
"「那三百金币的缺口……」",
"「有人在中间截流。」埃德蒙说，「西海岸给圣光的钱，经过学院中转，有人在每一笔里抽走一部分。抽钱的人，既不是学院的人，也不是圣光的人——是第三方。」",
"他走到窗边，望着夜色里的学生会大楼：「第三方的钱，能流向哪里？教会、暗蚀会、帝国军部——都有可能。我们查了十四年，第一次摸到这条线的中段。」",
"他转过身，目光沉下来：「接下来会危险。昆特知道你撞破了他的事，他一定会查你是谁。从明天起，你在学院里要加倍小心——尤其是那些『巧合』。」",
"窗外，学生会的灯还亮着。有人影在窗边晃动，不知道是值班的人，还是别的什么。"
],
options:[
{t:"把发现报告守望者高层", go:"pol_watcher_report"},
{t:"继续追查第三方资金", go:"pol_third_party"},
{t:"先稳住，等昆特找上门再应对", go:"pol_wait_qinte"}
]
}};

N["pol_watcher_report"]=function(){return{
place:"学院·西塔楼密室",
text:[
"埃德蒙带你进了塔楼最深处的一间密室。墙上的暗格里没有武器，只有一枚枚铜印——每一枚都对应一个学院，盖满红泥。",
"「我以守望者联络人的身份，把你查到的记录在案。」他执笔蘸墨，在一本羊皮簿上写下几行字，字迹工整：「战士系教授昆特，涉嫌与圣光神学院暗线交易，中转资金存在第三方截流。」",
"他放下笔，看着你：「你的名字，我不会写上去。守望者有一条铁律——情报可以记录，但提供情报的人，要保护。」",
"「为什么？」",
"「因为写上去，你就是名单上的人。名单上的人，十四个都『转学』了。」他把羊皮簿合上，锁进暗格，「从现在起，你的任务只有一件：活着毕业。在学院政治这潭水里，活得久，比赢得快有用。」",
"他拍拍你的肩，力道不重：「回去睡吧。明天，学院会很热闹——圣光交流团抵达，院长要亲自致辞。热闹的地方，往往藏着真正的暗流。」"
],
options:[
{t:"去迎接圣光交流团", go:"pol_exchange_arrive"},
{t:"先休息，恢复精力", go:"pol_rest_politics"}
]
}};

N["pol_exchange_arrive"]=function(){return{
place:"学院·正门广场",
text:[
"圣光交流团的马车队从正门驶入时，广场上已经站满了人。白袍的圣光学生鱼贯而下，为首的是一位银发老者——克莱门特主教，圣光神学院的副院长。",
"你注意到，队伍末尾有个穿普通灰袍的人，低头跟着队伍走，始终没抬头。他没有圣光学生的白袍，也没有随行人员的标识——像是混在队伍里的影子。",
"院长迎上前，与克莱门特握手寒暄。两人笑容满面，但你的目光落在他们交握的手上——克莱门特的手指，轻轻在院长掌心划了两下，像是某种暗号。",
"周围的学生都在鼓掌，没人注意这个小动作。只有你，因为站在前排，看得清清楚楚。",
"灰袍人跟着队伍走向会客厅。经过你身边时，他的脚步顿了一下，极轻，几乎听不见——但你的余光捕捉到，他侧头看了你一眼。只一眼，然后若无其事地继续走。",
"那一眼里，有一种让你后背发凉的东西。像是猎人，在看一只已经标记过的猎物。"
],
options:[
{t:"跟上去，看灰袍人去哪", go:"pol_graypriest_follow"},
{t:"把暗号的事告诉埃德蒙", go:"pol_signal_report"}
]
}};

N["pol_graypriest_follow"]=function(){return{
place:"学院·会客厅走廊",
text:[
"你隔着一段距离跟着灰袍人。他没去会客厅，而是拐进一条通往教职工宿舍的侧廊。你正想跟近，一只手忽然从旁边伸出来，把你拉进墙角的阴影里。",
"是灰翎。她竖起食指压在唇上，示意你噤声。",
"「别跟了。」她压低声音，「他不是圣光的人。他是『观察员』。」",
"「观察员？」这个词你第二次听见。第一次，是在塔楼里埃德蒙口中。",
"「每年交流团都会夹带一两个这样的人，名义上是随行，实际是来『评估』学院的。」灰翎的目光落在那人消失的拐角，「他们看的东西，是学院的秘密——禁书区、地下遗迹、还有那些不该存在的实验室。」",
"「那他刚才看我——」",
"「他在标记你。」灰翎的语气很平，「你在塔楼待了两晚，又查了财务。在观察员眼里，你已经是学院里『知道太多』的人。他们评估完学院，会顺带评估你——值不值得收编，或者，值不值得清除。」",
"她说完，松开你的胳膊：「接下来几天，尽量别一个人走夜路。」"
],
options:[
{t:"问灰翎怎么应对观察员", go:"pol_deal_observer"},
{t:"主动接触观察员，探他底细", go:"pol_touch_observer"}
]
}};

N["pol_deal_observer"]=function(){return{
place:"学院·回廊",
text:["那个自称「过路人」的人，在茶馆等你。", "他坐在靠窗的位置，面前一壶茶，两只杯子——一只他自己的，一只空的，摆在对面。像是知道你会来。", "「坐。」他说。你坐下。他给你斟了一杯茶：「你的茶钱，我付过了。」", "「为什么？」你问。", "「因为我想跟你说话。」他说，「说一段话，换一杯茶。公平。」", "你端起茶，没有喝：「你想说什么？」", "他看着你，目光很平静：「我想说——你最近，看了很多不该看的东西。」他顿了顿，「我不是来警告你的。我是来提醒你的：你看的那些东西，我也在看。我们看的是同一本账。」", "你握着茶杯，没有动。窗外的阳光照进来，把你们中间的茶烟照得发亮。", "灰翎想了想，说：「观察员是流水席，每年换人。他们不恋战，评估完就走——所以关键不是对付他，是别让他带走东西。」", "「带走什么？」", "「学院的秘密名单。」她声音更低，「禁书区里藏着一份手稿，记录了学院历年『观察员』的名单和去向。如果观察员拿到那份手稿，他就知道哪些学生被送去了哪里、生死如何——那份名单一旦落到圣光手里，学院就彻底被拿捏了。」", "「手稿在哪？」", "「禁书区第三层，书架背面，夹在两本《元素理论》之间。」灰翎说完，转身要走，又停住，「但禁书区第三层有结界，只有教务长的手令能进。你——想好怎么进去再说。」", "她消失在回廊尽头。你站在原地，手心有点发凉。", "「我凭什么信你？」你问。", "他没有回答。他从怀里掏出一张纸，放在桌上，推到你面前。纸上画着一棵树——不是普通的树，是一棵你见过的树。", "你的手，在桌下攥紧了。那是你在世界树根部，见过的那棵树的形状。", "「你见过这棵树。」他说，不是问句。他收回纸，折好，放回怀里：「我也是。」", "他站起来，留下那杯没喝完的茶：「茶钱付过了。下次见面，我请你喝更好的。」他走到门口，停了一下，「记住：你不是一个人在看那本账。」", "他走了。你坐在窗边，看着那杯茶。茶还热着。你端起它，喝了一口——很苦。可你知道，这杯茶，不是他白请的。"] /*v45inj:pol_deal_observer*/,
options:[
{t:"想办法拿到教务长手令", go:"pol_dean_permit"},
{t:"先摸清观察员的行动规律", go:"pol_observer_pattern"}
]
}};

N["pol_dean_permit"]=function(){return{
place:"学院·教务处",
text:[
"教务长办公室的门半掩着。你正要敲门，听见里面传来对话声：",
"「……手令的事，我说了不算。」是教务长的声音，带着疲惫，「禁书区钥匙在院长手里，全院只有他能批。」",
"「那就去跟院长说。」另一个声音——冷淡，带着不容置疑的压迫感，「观察员明天就要提交报告了。如果报告里写『学院拒绝配合调查』，你觉得圣光那边会怎么想？」",
"你听出来了。那是克莱门特主教的声音。",
"门里沉默了一会儿。教务长低声说：「我明白了。今晚之前，手令会送到您手上。」",
"脚步声朝门口走来。你赶紧退到走廊拐角，屏住呼吸。门开了，克莱门特主教走出来，脸上挂着温和的笑容——和刚才判若两人。他看见你，笑着点点头，像遇见普通学生一样走了过去。",
"你心跳如鼓。手令——他们也要手令。观察员要拿到那份手稿了。"
],
options:[
{t:"抢先一步，赶在他们之前拿到手稿", go:"pol_grab_manuscript"},
{t:"去找埃德蒙，报告这个紧急情况", go:"pol_urgent_report"}
]
}};

N["pol_grab_manuscript"]=function(){return{
place:"学院·禁书区",
text:[
"你用埃德蒙给的旧钥匙撬开了禁书区的侧门。三层结界嗡嗡作响，像是蜂群在耳边振翅。你贴着书架往里走，灰尘呛得你几乎睁不开眼。",
"书架背面——灰翎说的位置。你的手指探进两本《元素理论》之间，摸到一卷发黄的手稿。",
"你刚要抽出来，身后传来脚步声。很轻，但在这寂静的禁书区里格外清晰。",
"「放下。」一个平静的声音说。",
"你转过身。克莱门特主教站在书架尽头，手里不知何时多了一根银白色的法杖。他的脸上没有表情：「那份手稿，不属于你。也不属于这座学院。」",
"他的杖尖亮起微光：「放下它，我可以当今晚什么都没发生。你依然是学院里一个『好奇心重』的学生。」",
"手稿在你手里，纸页冰凉。书架间的阴影里，似乎还有别的人在动——是观察员？还是灰翎？"
],
options:[
{t:"把手稿交出去", go:"pol_handover_manuscript"},
{t:"撕下关键几页，再交出去", go:"pol_tear_manuscript"},
{t:"把结界引向他，趁机逃跑", go:"pol_escape_trap"}
]
}};

N["pol_handover_manuscript"]=function(){return{
place:"学院·禁书区",
text:[
"你把双手平举，手稿轻轻放在书架前的桌上。克莱门特没有立刻去拿，他看了你两秒，忽然笑了——那笑容温和，却让你想起夜里的猫。",
"「聪明的选择。」他走过去，指尖刚碰到手稿——",
"书架忽然震动，头顶的灰尘簌簌落下。你身后传来一声闷响，像是什么重物撞在结界上。",
"克莱门特脸色一变，迅速抓起手稿塞进怀里：「今晚的事，你最好忘掉。」他话音未落，整个人化作一道白影，消失在书架深处。",
"你站在原地，手心全是汗。刚才的震动——是巧合，还是有人故意引开他？",
"你低头，看见脚下落着一片银色的羽毛。灰翎的。",
"她来过。她做了什么，你不知道。但你突然明白，这片羽毛不是标记，是信号——她在告诉你：手稿不能落在克莱门特手里，至少，不能是完整的手稿。"
],
options:[
{t:"找到灰翎，问她做了什么", go:"pol_gray_aftermath"},
{t:"回塔楼，把情况报告埃德蒙", go:"pol_report_aftermath"}
]
}};

N["pol_gray_aftermath"]=function(){return{
place:"学院·占星塔",
text:[
"灰翎在天台等你，像早就知道你会来。她手里捏着一卷发黄的纸——你认得，那是手稿的残页。",
"「你撕的？」她问。",
"「我交出去的，是完整的。」你说。",
"她低头看了一眼残页，忽然笑了，笑意很浅：「那这卷东西，就不是你交出去的那卷。」她把残页递给你，上面是密密麻麻的名字——历届『观察员』，每一个都标注了去向。",
"「我看了一眼，就明白了。」她说，「你交出去的只是抄本。真本——早在我上次进禁书区的时候，就已经换走了。」",
"她仰头看星星：「三年前我进禁书区整理卷宗，顺手把真本带了出来。因为我总觉得，这份名单上的人，不该被这样记着——像货物一样，标注着『完好』『损坏』『转送』。」",
"你低头看那卷残页。最后一个名字旁，标注着两个字：「失踪」。",
"风从塔顶吹过，灰翎的声音很轻：「学院政治这潭水，我蹚了三年。你才刚开始——记住，别让自己变成名单上的下一个。」"
],
options:[
{t:"收好残页，问她下一步", go:"pol_next_step"},
{t:"把残页交给埃德蒙", go:"pol_report_aftermath"}
]
}};

N["pol_next_step"]=function(){return{
place:"学院·占星塔",
text:[
"灰翎靠在栏杆上，指尖轻叩着石栏：「观察员明天走。手稿真本在我们手里，他拿到的只是抄本——但他不会知道这一点。明天，他会带着抄本离开，向上面报告『学院情况正常』。」",
"「所以——我们安全了？」",
"「暂时。」她侧过头，「但抄本会引来第二波调查。圣光那边发现内容是假的，会派更厉害的人来。到那时候，学院的暗线会重新洗牌，而你我——已经在这牌局上亮了相。」",
"她沉默了一下，忽然说：「我打算申请去西海岸的交流项目。学院每年有一个名额，表面上是考察贸易航线，实际上——」她看向你，「是去查那笔钱真正的流向。西海岸贸易协会，总得有人去看看。」",
"「什么时候走？」你问。",
"「学期末。」她顿了顿，「如果你也想查下去——学院里有个留级生，叫马修，外号『账本』，他知道学院十年来每一笔账的出入。去找他，他能帮你。」",
"她说完，转身走下天台。风里飘来她最后的话：「别死在路上。」"
],
options:[
{t:"去找马修·账本", go:"pol_math_book"},
{t:"先休息，明天再说", go:"pol_rest_politics"}
]
}};

N["pol_math_book"]=function(){return{
place:"学院·旧食堂后厨",
text:[
"马修在后厨洗碗。一个留级四年的老生，头发乱糟糟，围裙上全是油渍。你找到他时，他正哼着不成调的歌，把盘子码得整整齐齐。",
"「灰翎让你来的？」他头也不抬，「她每年都给我送一个『想知道真相』的学生。上一个，是个姑娘，后来去圣城了，再没消息。」",
"他擦干手，从围裙口袋里摸出一本巴掌大的册子，油渍斑斑：「学院十年的账，出入我都记在这里。你想问哪一笔？」",
"你说了西海岸贸易协会。他翻开册子，指尖滑过几行：「七年前，协会第一笔捐款，五百金币。经办人——」他顿住，「教务处时任助理，埃德蒙。」",
"你愣住了。埃德蒙——守望者联络人——当年经手了第一笔钱。",
"马修合上册子，看着你：「小子，在这潭水里，别轻信任何人。包括——」他顿了顿，「包括让你来找我的人。」"
],
options:[
{t:"追问埃德蒙的过去", go:"pol_edmund_past"},
{t:"自己查证埃德蒙的背景", go:"pol_verify_edmund"}
]
}};

N["pol_edmund_past"]=function(){return{
place:"学院·旧食堂后厨",
text:[
"马修擦着杯子，慢慢说：「埃德蒙年轻的时候，是学院的风云人物。那时候他叫埃德蒙·西格，炼金系首席，差一点就当上学生会主席。」",
"「差一点？」",
"「那年的选举，爆出了贿选丑闻。埃德蒙的竞选经费来源不明——正好是西海岸贸易协会捐的。他因此退选，沉寂了几年，然后以『教务处助理』的身份回来，再一步步熬成副院长。」",
"马修放下杯子，直视你：「所以你看，他经手第一笔捐款，不奇怪——那本来就是给他准备的。他是守望者，但守望者不是生下来就是守望者。他曾经，也是这牌局上的一枚棋子。」",
"「那他现在是……」",
"「我不知道。」马修打断你，「没人知道。他可能真的洗白了，也可能——他一直是那笔钱的一部分，只是换了个身份在等。等你这样的人，把真话送到他手里。」",
"窗外传来钟声。马修低头继续洗碗，声音平平：「账本上最后一行，是空的。留给那个能查到底的人。你，会是那个人吗？」"
],
options:[
{t:"继续深挖埃德蒙", go:"pol_edmund_probe"},
{t:"先不查埃德蒙，专注追资金流向", go:"pol_third_party"}
]
}};

N["pol_edmund_probe"]=function(){return{
place:"学院·教职工档案室",
text:["你趁教务处没人，翻出埃德蒙的人事档案。履历干净得像被擦拭过：入学、任职、晋升，每一步都合规。", "但档案袋的封口处，有一道极细的二次粘贴痕迹——有人拆开过，又重新封上了。", "你小心掀开封口，在档案夹层里摸到一张发黄的便条。上面只有一行字，笔迹与埃德蒙现在的字完全不像：", "「西格已入会。着其长期潜伏学院，观察名单变动。— T.」", "署名只有一个字母：T。", "你盯着那个字母，后背一阵发凉。T——是谁？总不会是……守望者高层。", "你把便条放回原处，重新封好档案。走出档案室时，走廊尽头，埃德蒙正站在那里，手里端着一杯茶，微笑着看你：「查资料？辛苦。」", "他笑得和平时一样温和。但你忽然看不清，那双眼睛里，到底藏着什么。", "你试探了埃德蒙一次。你想知道他，到底站在哪边。", "你故意，在他面前，提了一个敏感的名字。他听了，表情没有变化，只是手里那杯茶，停了一下。", "「你问这个做什么？」他说。你说，只是好奇。他放下茶杯，看着你：「好奇，是好事。」他顿了顿，「但好奇，也是会死人的。」", "你心里一紧。他没有再说下去。他端起茶杯，喝了一口，像什么都没发生过。你也没有再问。", "你走出门的时候，回头看了一眼。他坐在那里，还端着那杯茶，像一尊，不会动的雕像。你忽然觉得，你试探的这个人，深得，看不见底。"] /*v45inj:pol_edmund_probe*/,
options:[
{t:"若无其事地回应，回去想清楚", go:"pol_think_edmund"},
{t:"直接试探埃德蒙", go:"pol_test_edmund"}
]
}};

N["pol_think_edmund"]=function(){return{
place:"学院·宿舍",
text:["你在宿舍里坐了一夜。蜡烛烧到根部，蜡油在桌面凝成一小滩。", "埃德蒙的便条、灰翎的羽毛、马修的账本、克莱门特的手令——所有的线，最后都指向同一个问题：这笔钱，从西海岸流向圣光，经学院中转，被第三方截流，而最早经手的人，是守望者的联络人。", "如果埃德蒙真的是卧底，那灰翎的手稿残页、他给我的钥匙、他让我查的一切——都是安排好的剧本？", "可如果是剧本，为什么他会把守望者的徽章给我看？", "你吹熄蜡烛。黑暗里，你听见自己的心跳声，还有远处钟楼敲响的整点声。", "天亮之前，你做了一个决定：不管埃德蒙是真是假，你自己得掌握足够的牌。而学院政治这场牌局，最先赢的人，往往是最后出牌的人。", "埃德蒙的话，你回去想了很久。越想，越觉得，他说的，不全对，也不全错。", "他说：「政治没有对错，只有立场。」你当时不以为然。但你后来发现，学院里那些你看着「对」的事，换个角度看，都带着立场。", "你又想起他说：「你以为你站在中间，其实你只是还没被拉过去。」你躺在床上，盯着帐顶，把这句话，翻来覆去，想了半夜。", "你不得不承认，他说得有几分道理。但你也不想承认，你只是想站中间，不想选边。", "天快亮的时候，你翻了个身，闭上眼。你在心里，对自己说：先不想了。等你真的遇到要选的那天，再说。"] /*v45inj:pol_think_edmund*/,
options:[
{t:"去图书馆查守望者的历史记录", go:"pol_watcher_history"},
{t:"去找马修，核对埃德蒙的履历", go:"pol_math_book2"}
]
}};

N["pol_watcher_history"]=function(){return{
place:"学院·图书馆密档室",
text:[
"图书馆的密档室存放着学院与各大组织的往来记录。你以『研究守望者历史』的名义借阅，管理员看了你半天，才从最底层柜子里取出一卷落灰的档案。",
"档案显示：守望者组织在学院的活动，始于二十年前。第一任联络人，代号「T」。",
"你翻到T的档案页——姓名栏被墨迹涂掉了，但边角处，一个模糊的签名轮廓依稀可辨。你眯起眼辨认，那笔迹的起笔和收笔……",
"和埃德蒙便条上的「T」，一模一样。",
"你合上档案，手有点抖。二十年前的第一任联络人T，和现在便条上署名的T，是同一个「T」？那埃德蒙收到的便条，是二十年前发出来的？",
"不。你冷静下来，重新推理：便条可能是旧物，被人故意塞进档案夹层。也可能是——守望者内部，有一个代号「T」的人，始终在幕后操纵这条线，从二十年前到现在。",
"档案室的光线昏暗。你把这卷档案抄录了关键几页，放回原处。走出图书馆时，天空阴沉，像要下雨。"
],
options:[
{t:"把发现告诉灰翎", go:"pol_tell_gray"},
{t:"直接去问埃德蒙：T是谁", go:"pol_ask_T"}
]
}};

N["pol_tell_gray"]=function(){return{
place:"学院·占星塔",
text:["灰翎听完你的发现，沉默了很久。她摩挲着袖口的银羽毛，终于开口：「T——如果他从二十年前就在，那他经手的学生名单，比我想象的更长。」", "「你认识代号T的人吗？」你问。", "「守望者内部，有代号的人不超过十个。」她抬起头，「但有一个人的代号，这三年来我从没听任何人提起过——就像被从记录里抹掉了一样。」", "「谁？」", "「上一任驻学院联络人。守望者内部叫他『老鸦』，失踪于三年前。档案上写『任务中失踪』——但据我所知，他是主动失踪的。他失踪前，最后见的人——」", "她看着你，一字一顿：「是埃德蒙。」", "风穿过塔顶，把星图吹得猎猎作响。你忽然想起那晚在塔楼里，埃德蒙说过的话：「我等你三届了。」三届——正好三年。老鸦失踪的三年。", "你选择，把你知道的，告诉那个灰袍人。你开口之前，犹豫了很久。", "你告诉他的时候，他听得很认真，没有打断你。你说完，他沉默了一会儿，问：「你确定？」你说是。他点了点头。", "他没有道谢。他只是站起来，把你说的话，在心里过了一遍，然后说：「这件事，你不要再跟第二个人说。」他顿了顿，「你说了，我也保不住你。」", "你站在那里，看着他。你想问，你是谁。你最终，没有问出口。你只是点了点头，转身，走了。", "你走出那条巷子，阳光照在你脸上。你回头，看了一眼——巷子里，已经没有人了。你转回身，继续走。你把那个秘密，咽回了肚子里。"] /*v45inj:pol_tell_gray*/,
options:[
{t:"查老鸦失踪的真相", go:"pol_oldcrow"},
{t:"把老鸦的事报告给埃德蒙", go:"pol_report_edmund2"}
]
}};

N["pol_oldcrow"]=function(){return{
place:"学院·旧宿舍楼地下室",
text:["埃德蒙站在门口，背着光，看不清表情。他没有走近，也没有离开，只是站在那儿，像一截钉在门框里的影子。", "你捏着铁盒，指尖微微发凉。地下室的光线很暗，灰尘在空气里浮着，你们两个人隔着半间屋子，谁都没有先开口。", "「老鸦的东西，」埃德蒙终于说，「我找了他三个月。」他的声音很平静，平静得不像在找人，倒像在找一件早就知道会找到的东西。", "「你认识他？」你问。", "埃德蒙沉默了一会儿：「他是第一个教我『学院不是家』的人。」", "他往门边让了半步，让出门口：「今天的事，我不会说出去。但那张地图——你最好想清楚，再决定要不要看。」", "他没有再多说，转身走了。脚步声在楼道里越来越远，最后消失了。", "老鸦失踪前的住处，在旧宿舍楼地下室——如今堆满杂物，门锁锈死。你撬开锁，里面霉味扑鼻。杂物之间，一张铁架床，一张桌子，桌上落满灰尘。", "你翻找良久，在床板夹层里摸到一个铁盒。盒子里没有钱，没有信——只有一枚银羽毛徽章，和一张字条：", "「如果有人在查T，让他来这里。」", "字条背面，画着一幅粗糙的地图。你认出来，那是学院地下——标注着一个X：图书馆正下方，更深的地方。", "你正要细看，地下室门口传来脚步声。你迅速把铁盒塞进怀里，转身——门口站着一个人影，背着光，看不清脸。", "「找到你要找的东西了吗？」那声音很平静。", "是埃德蒙。", "你站在原地，听着脚步声彻底消失，才重新打开铁盒。", "银羽毛徽章躺在掌心里，很轻，边缘有些磨损，像是被人握了很多年。你翻过徽章——背面刻着一行极小的字：「第七年，冬。我看清了。」", "你不知道这行字是什么意思。可你把它记在了心里。", "你又展开那张地图。地图上标注的X，在图书馆正下方——比任何已知的地下室都深。你看着那个X，忽然想起老鸦失踪前，最后说过的一句话。", "「学院的地基，比你想的要深。」", "你把地图和徽章收好。你知道，从今晚起，你心里也有一张地图了。"] /*v45inj:pol_oldcrow*/,
options:[
{t:"摊牌，把铁盒给他看", go:"pol_show_box"},
{t:"否认，等他走了再研究地图", go:"pol_hide_box"}
]
}};

N["pol_show_box"]=function(){return{
place:"学院·旧宿舍楼地下室",
text:[
"你把铁盒放在桌上，推到埃德蒙面前。他没有立刻接，看着那枚银羽毛徽章，很久，才叹了口气：",
"「老鸦的东西。」他说，「他失踪前，把这枚徽章留给了我。告诉我：如果有一天，有个学生拿着它来找你，你要告诉他真相。」",
"「你早就知道我会来？」",
"「我知道有人会来，但不知道是你。」他苦笑，「三年来，每个查账的学生我都留意过，但他们要么停在门口，要么被吓走。只有你——」他看向你，「走到了这一步。」",
"「所以老鸦失踪的真相是？」",
"埃德蒙沉默了片刻：「他没失踪。他改名换姓，去了西海岸——以贸易协会财务顾问的身份。他是守望者打入协会内部的最后一个钉子。三年来，他一直在查那笔钱真正的终点。」",
"他抬起头，眼睛里有一种说不清的疲惫：「而我——留在这里，守着学院这条线，替他吸引注意力。让所有人以为，守望者还在学院里查，查不到西海岸去。」",
"地下室的光线昏暗。你忽然明白，这盘棋，从二十年前就在下。而你，只是棋盘上最新的一颗棋子。"
],
options:[
{t:"问埃德蒙：我该怎么做", go:"pol_edmund_advice"},
{t:"拿着徽章，自己去西海岸找老鸦", go:"pol_go_west"}
]
}};

N["pol_edmund_advice"]=function(){return{
place:"学院·旧宿舍楼地下室",
text:["埃德蒙看着你，认真地说：「你现在有三个选择。」", "「第一，把手里的线索交给守望者高层，让组织接手。你会得到嘉奖，但你的调查到此为止——名单上的事，不是你该知道的。」", "「第二，继续在学院里查，把T揪出来。但这条路最危险——因为你不知道T在守望者内部有多高的位置。你查他，就是查组织。」", "「第三——」他顿了顿，「跟我合作。你把线索给我，我把老鸦传回来的情报分你一份。我们各查各的，但情报共享。」", "他伸出手：「选哪个，你决定。但记住——无论选哪个，你都已经在这盘棋上了。下棋的人，没有全身而退的选项。」", "地下室安静得能听见灰尘落下的声音。他的手掌摊在昏暗的光里，等你握住，或者转身。", "埃德蒙给了你一条忠告。他说话的时候，语气很淡，但你知道，这忠告，值钱。", "「在学院里，」他说，「最危险的位置，不是站在谁的对立面。」他顿了顿，「是站在所有人中间。」他看你一眼，「你以为中间安全。中间，是最容易被两边一起踩的。」", "你问他，那该站在哪。他想了想：「站边。」他说，「选一条边，站稳。哪怕选错了，也比不选强。」他补了一句，「因为，不选的人，没有人会为你说话。」", "你听着，没有接话。你心里清楚，他说的是实话——但实话，不一定是你想听的。", "你谢过他，走出门。你站在走廊里，看着两边延伸出去的通道，想起他说的「站边」。你在想，等你真要站的那天，你会选哪边。"] /*v45inj:pol_edmund_advice*/,
options:[
{t:"选择一：交给守望者高层", go:"pol_choice_org"},
{t:"选择二：自己继续查T", go:"pol_choice_solo"},
{t:"选择三：与埃德蒙合作", go:"pol_choice_partner"}
]
}};

N["pol_choice_org"]=function(){return{
place:"学院·守望者联络室",
text:[
"你把线索整理成报告，交给埃德蒙转呈守望者高层。他接过报告时，神色复杂：「你确定？」",
"「确定。这潭水太深，我一个人蹚不动。」",
"他点点头，把报告锁进暗格：「明智的选择。守望者会接手调查——你安全了。」",
"但那天晚上，你躺在床上，却怎么都睡不着。你想起灰翎的话：「名单上的人，都『转学』了。」",
"三天后，学院公告栏贴出一则通知：占星系三年级学生灰翎，因家庭原因，申请转学。手续已办妥。",
"你盯着那则通知，忽然明白——守望者接手调查，第一步就是切断所有知情人的线索。灰翎的『转学』，就是切断。",
"你冲去找埃德蒙，他正在塔楼里擦那枚旧钥匙：「她安全，比真相重要。」他说，「你交出去的报告里，没有她的名字——这是你唯一能为她做的事。」",
"窗外，占星塔的天台空无一人。风把星图吹得哗哗作响，像在替什么人叹息。"
],
options:[
{t:"接受这个结果，继续学业", go:"pol_after_org"}
]
}};

N["pol_choice_solo"]=function(){return{
place:"学院·宿舍",
text:[
"你决定自己查下去。埃德蒙听完你的决定，没有劝你，只是从怀里取出那枚旧钥匙：「塔楼的门，随时为你开着。如果你需要帮忙——」他没有说完，把钥匙放在桌上，转身走了。",
"你开始独自追查T的线索。图书馆密档、人事档案、旧校志——每一个角落，你都翻了一遍。",
"三周后的一个深夜，你在档案馆的夹层里找到一本日记。封皮没有名字，但笔迹你认得——是老鸦的。",
"日记最后一页写着：「T不是一个人。T是一个代号，代代相传。每一任联络人，上任时都会收到一枚银羽毛徽章——那是T的信物。但只有一个人知道，真正的T，从来不在守望者内部。」",
"「T在学院里。他一直看着每一个查账的人，看他们走到哪一步会停。」",
"你合上日记，手心冰凉。你抬起头，档案室的窗外，深夜的学院灯火阑珊。其中一扇窗后——是埃德蒙的办公室。",
"他站在窗边，正在看着你所在的档案馆。"
],
options:[
{t:"直面埃德蒙，摊开所有牌", go:"pol_final_showdown"}
]
}};

N["pol_final_showdown"]=function(){return{
place:"学院·西塔楼",
text:[
"你带着老鸦的日记，登上塔楼。埃德蒙背对着你，正在给窗台上的盆栽浇水。他没有回头：「你查到了。」",
"「T是你。」你说，「或者说，T这个代号，一直由学院内的联络人兼着。老鸦、你——你们既是守望者，又是T。」",
"埃德蒙放下水壶，转过身来。他的脸上没有惊讶，只有一种近乎释然的平静：「你猜对了一半。」",
"「T确实代代相传。但T的真实身份，不是联络人——是学院的看门人。每一任看门人，都知道学院地下藏着什么，也知道那份钱养的是什么。T的职责，是确保——」他顿了顿，「确保地下那个东西，永远不会被放出来。」",
"「那笔钱——养的是地下那个东西？」你问。",
"埃德蒙没有回答。他只是看着你，目光里有一种说不清的东西：「你已经走到这一步了。再往下，就是学院最深的秘密。你确定，要打开那扇门吗？」",
"窗外，月亮被云遮住了。塔楼里，烛火静静地燃烧。"
],
options:[
{t:"打开那扇门，看学院最深的秘密", go:"pol_deepest_secret"},
{t:"合上日记，到此为止", go:"pol_stop_here"}
]
}};

N["pol_deepest_secret"]=function(){return{
place:"学院·地下最深密室",
text:[
"埃德蒙带你穿过图书馆地下、绕过废弃水道，最后停在一扇青铜门前。门上的纹路你认得——和禁书区结界上的符文一模一样。",
"他念了一句咒语，青铜门缓缓打开。门后是一间圆形密室，中央放着一口石棺。棺盖上刻着七道封印，其中四道已经黯淡，只剩三道还在流转着微弱的光。",
"「这就是学院真正的秘密。」埃德蒙的声音在密室里回荡，「石棺里封着的东西——是第七印的碎片。二十年前，守望者从一处遗迹里把它带出来，藏在学院地下。那笔钱，养的不是人——是维持这三道封印的材料。」",
"你盯着石棺，呼吸都轻了。七道封印，四道黯淡——意味着封印在松动。",
"「所以，西海岸贸易协会、圣光交流团、第三方截流——都是在争这个？」你问。",
"「都在争。」埃德蒙说，「圣光想得到它，暗蚀会想释放它，帝国军部想利用它。而我们——」他看向你，「只想守住它。」",
"他伸出手，掌心躺着一枚银羽毛徽章：「你是这二十年来，第一个走到这扇门前，还站着没倒的学生。这枚徽章——接不接，由你。」",
"石棺上的封印，微弱地明灭着。密室里，静得能听见封印流转的声音。"
],
options:[
{t:"接过徽章，成为守印人", go:"pol_guardian"},
{t:"拒绝，把秘密留在心底", go:"pol_refuse_guardian"}
]
}};

N["pol_guardian"]=function(){return{
place:"学院·地下密室",
text:[
"你接过银羽毛徽章。冰凉的金属贴上掌心，一瞬间，你仿佛听见封印后面传来一声极轻的叹息——像是什么东西，在石棺里翻了个身。",
"埃德蒙看着你把徽章收好，微微颔首：「从今天起，你是守望者在学院的第二联络人。你的职责只有一件：确保第七印碎片不会落入任何一方之手。」",
"「如果——封印继续松动呢？」你问。",
"「那就找齐材料，重新加固。」他顿了顿，「材料清单在老鸦的日记里。他三年没回来，是因为他找材料的路，比想象中长。」",
"你们走出密室，青铜门在身后缓缓合拢。你低头看掌心的徽章，银羽毛在月光下泛着冷光——和灰翎袖口的那枚，一模一样。",
"你忽然想起灰翎说过的话：「我三年前问过一模一样的问题。」原来她袖口的羽毛，从来都是同一枚。她也是守印人——只是她用『转学』，去执行了另一条线。",
"次日清晨，学院公告栏贴出新通知：占星系学生灰翎，转学手续撤销，恢复学籍。无人知晓原因。",
"你站在公告栏前，晨光里，占星塔的天台上，一个灰袍的身影正背对着你整理星图。她没回头，但你听见她淡淡地说了一句：「欢迎入局。」"
],
options:[
{t:"继续学院的学业，暗中守印", go:"pol_hub"}
]
}};

N["pol_refuse_guardian"]=function(){return{
place:"学院·地下密室",
text:[
"你摇了摇头：「这个责任太重了。我只是个学生，我想过普通的日子。」",
"埃德蒙没有强求，把徽章收回怀里：「也好。能走到这扇门前，又主动离开的人，反而让我更放心。」",
"「为什么？」",
"「因为守住秘密的，不一定是握着徽章的人，也可能是——选择不看的人。」他把青铜门合上，「今晚的事，忘了吧。明天，你还是学院里那个『好奇心重』的学生。」",
"你走出塔楼时，天快亮了。晨光熹微，学院里的学生开始三三两两地往食堂走，有人冲你打招呼，你笑着回应——就像什么都没发生过。",
"但只有你知道，每当深夜路过西塔楼时，你总会放慢脚步，听一听——那座灰塔的深处，封印流转的声音，有没有变得更响。",
"有些秘密，选择不看，不等于不存在。你把它放在心底最深处，像一枚永远不会掏出来的银羽毛徽章。"
],
options:[
{t:"回归平静的学院生活", go:"pol_hub"}
]
}};

N["pol_choice_partner"]=function(){return{
place:"学院·旧宿舍楼地下室",
text:[
"你握住埃德蒙的手：「合作。」",
"他的力道很稳：「好。从现在起，我查学院内，你查学院外。老鸦在西海岸的情报，会通过我转给你。你负责——找出T。」",
"接下来几周，你们建立了默契。埃德蒙给你送情报，你负责梳理线索、追踪资金流向。你发现，T的痕迹比想象中更深——他不仅操纵学院线，还在圣光、帝国军部之间都有布局。",
"一个雨夜，埃德蒙把一封密信交给你：「老鸦传来的。西海岸贸易协会的账本，有个反常的细节——每年都有一笔固定金额，以『保养费』名义支付给一家名为『磐石』的铸造坊。」",
"「铸造坊？」",
"「对。而这家铸造坊的注册地址——」埃德蒙顿了顿，「在学院地下街。」",
"学院地下街，是学生们都知道的隐秘集市，卖些管制材料。你从没想过，那笔钱的终点，竟然就在学院脚下。",
"雨声敲打着窗棂。你看着那封密信，忽然觉得，这盘棋比想象中下得更大——大到棋盘本身，就是整座学院。"
],
options:[
{t:"去地下街查磐石铸造坊", go:"pol_forge_shop"}
]
}};

N["pol_forge_shop"]=function(){return{
place:"学院·地下街",
text:[
"地下街在学院最底层，常年弥漫着煤油灯的气味。你在弯弯绕绕的巷子尽头找到了「磐石铸造坊」——门脸破旧，铁门上挂着一把铜锁，但锁孔周围没有锈迹——有人常来。",
"你刚凑近，门里传来一个嘶哑的声音：「买货的？」",
"「看看。」你答。",
"门开了一条缝，一个驼背老头打量你：「学院的学生？这里不卖教材。」",
"「听说这里能买到管制材料。」你试探。",
"老头盯着你看了几秒，把门开大些：「进来吧。」",
"店里堆满铁锭和模具，但角落里一块蒙着油布的东西引起了你的注意——你掀开一角，下面是一块半成品法阵基座，纹路精细得不像民间手艺。",
"老头注意到你的目光，不动声色地盖回去：「那是给人定做的。客人不喜人看。」",
"「谁定的？」你问。",
"老头摇头，但你的余光捕捉到，他下意识看了一眼柜台下的暗格——那里露着一张纸条的一角。你没动声色，买了一块普通铁锭，转身离开。",
"出门后，你绕到店后，透过窗缝看见老头正在往纸条上添字。你眯起眼辨认——纸条上是一串数字，还有两个名字：昆特，和……教务长。"
],
options:[
{t:"把发现报告埃德蒙", go:"pol_forge_report"},
{t:"夜里潜入铸造坊，看暗格里有什么", go:"pol_forge_night"}
]
}};

N["pol_forge_night"]=function(){return{
place:"学院·磐石铸造坊",
text:[
"入夜后，你撬开铸造坊的后窗。店里一片漆黑，只有炉膛的余烬泛着暗红的光。你摸到柜台，小心打开那个暗格——",
"里面只有一张纸条：",
"「下月十五，交货。地点照旧。提醒客户：钥匙已备好，勿误。」",
"你翻遍暗格，没有其他线索。正要离开，你忽然注意到铁砧下面压着一块刻痕——是学院的校徽，但背面刻着一串小字：",
"「仓库钥匙，第三排第七格。」",
"仓库——学院的哪个仓库？你刚把刻痕记在心里，门外忽然传来脚步声。你迅速闪到货架后，屏住呼吸。",
"门开了，一个高大的身影走进来，提着一盏风灯。灯光照亮他的脸——是战士系教授昆特。他径直走到柜台前，从暗格里取出那张纸条，看了几秒，低声骂了一句什么，又塞回去，转身离开。",
"他走后，你从货架后出来，心跳如擂。仓库钥匙——昆特和铸造坊之间，还隔着一道仓库。那道仓库里，到底存着什么？"
],
options:[
{t:"查学院的仓库记录", go:"pol_warehouse"}
]
}};

N["pol_warehouse"]=function(){return{
place:"学院·后勤仓库",
text:[
"学院的仓库登记在后勤处，厚厚一本，落满灰尘。你翻到「第三排第七格」对应的记录：租用方——「磐石铸造坊」。租用物——「定期寄存」。",
"寄存什么，记录栏是空的。但旁边有一行小字备注，几乎看不清：「涉及学院机密，登记免填。」备注栏签名处，是教务长的印鉴。",
"你合上登记簿，心里已经有数：教务长、昆特、铸造坊、仓库——这条线上的每一环，都指向同一个终点。那笔钱真正养的东西，就存在那个仓库里。",
"你正要离开后勤处，迎面撞上一个人——是学生会副主席塞德。他看见你，笑得无害：「查仓库记录？需要帮忙吗？」",
"你还没回答，他已经凑近，压低声音：「第三排第七格，对吧？那格的东西，上周刚被调走——调去了教务处的地下室。你要是真想知道里面是什么，别去仓库了。」",
"他说完，像什么都没发生一样，拍着你的肩膀走了。你站在原地，看着他消失在走廊尽头——一个副主席，怎么会知道仓库格号？",
"除非——他就是那个「第三方」。"
],
options:[
{t:"去教务处地下室看个究竟", go:"pol_basement"}
]
}};

N["pol_basement"]=function(){return{
place:"学院·教务处地下室",
text:[
"教务处地下室的门常年上锁，你花了两晚才找到钥匙孔的位置。深夜，你撬开门，一股冷气扑面而来——地下室比想象中深，石阶向下延伸，墙上挂着一盏盏煤油灯，像是一条通往地心的路。",
"最深处是一间石室。你推开门，瞳孔骤缩——",
"石室中央，放着一口铜棺。棺身刻满符文，和禁书区结界上的如出一辙。铜棺旁，立着一块木牌，上面写着：",
"「第八印碎片——待处理。」",
"第八印。你只知道学院里有七印的传说，从没听过第八印。你走近铜棺，透过棺盖的缝隙往里看——里面不是碎片，是一卷卷的羊皮纸，整齐地码放着。",
"你伸手想掀开棺盖，身后忽然传来一个声音：",
"「我劝你，别碰。」",
"你猛地转身。塞德站在石室门口，脸上没有笑容。他手里托着一盏灯，灯光照亮他平静的脸：「第八印是假的。那口棺材里，装的是学院二十年来所有『失踪』学生的档案。」",
"「你——」",
"「我是第三方。」他打断你，「但第三方不只有我一个人。我只是其中一个，负责整理这些档案的人。」他走进石室，灯影晃动，「你查的那笔钱，一半流向西海岸，一半流向这里——用来买这些学生的命。买他们的沉默，买他们的消失。」",
"他看向你，目光平静得可怕：「现在，你也在这口棺材的名单上了。除非——你加入我们。」"
],
options:[
{t:"加入塞德的组织", go:"pol_join_third"},
{t:"拒绝，并立刻把情报带出去", go:"pol_resist_third"}
]
}};

N["pol_join_third"]=function(){return{
place:"学院·教务处地下室",
text:[
"塞德看着你，没有立刻说话。良久，他开口：「你知道我为什么选你吗？」",
"「因为我查到了这里？」",
"「因为你查到了这里，还活着。」他说，「大多数查到一半的人，要么被吓退，要么被『转学』。但你——你一路走到了这口棺材前，还能站着和我说话。组织需要这样的人。」",
"他递给你一枚铜章，上面刻着一只闭眼的天平：「拿着。从今以后，学院里的暗流，你会看得更清楚。作为回报——你的名字，从棺材的名单上划掉。」",
"你接过铜章。指尖触到冰凉的金属，你忽然想起老鸦日记里的那句话：「T不是一个人。T是一个代号。」",
"你握紧铜章，抬头看着塞德：「组织——叫什么名字？」",
"他笑了，那笑容里有一点说不清的意味：「我们没有名字。因为不存在的东西，不会被查。」",
"他转身走向石室深处，声音飘回来：「明晚，学生会办公室，有人会来找你。到时候，你会知道第一件事该做什么。」",
"铜棺里的档案静静躺着，像二十年的沉默。你低头看掌心的铜章，闭眼的天平在灯下泛着微光。"
],
options:[
{t:"开始执行组织的任务", go:"pol_hub"}
]
}};

N["pol_resist_third"]=function(){return{
place:"学院·教务处地下室",
text:[
"你后退一步，把手里的铜棺木板放回原处：「不。我不加入你们。」",
"塞德没有生气，甚至笑了一下：「有骨气。但你知道吗——每一个走到这里的人，都说过同样的话。」",
"他侧过身，让出门口：「你走吧。今晚的事，我当没看见。但你要记住——你走出了这扇门，就再也回不了头。这口棺材里的名单，明天会多一个名字。」",
"你大步走出地下室，一路没回头。回到宿舍，你锁上门，喘着气，心脏在胸腔里擂鼓。",
"你摸出那枚银羽毛徽章——守望者的信物。现在，它在你手里，微微发烫。",
"第二天，学院公告栏贴出一则通知：「占星系学生灰翎，申请转学，手续办理中。」",
"你盯着那则通知，猛地冲出门——灰翎的宿舍已经空了。桌上压着一张纸条，只有一行字：",
"「他们动手了。你也快走。— 灰翎」",
"你攥着纸条，站在空荡荡的宿舍里，晨光从窗外照进来，把影子拉得很长。你忽然明白，这盘棋的规则很简单：知道的太多，就要付出代价。但有些代价——你愿意付。"
],
options:[
{t:"带着情报去找埃德蒙，准备离开", go:"pol_escape_plan"}
]
}};

N["pol_escape_plan"]=function(){return{
place:"学院·西塔楼",
text:[
"你把地下室的发现原原本本告诉埃德蒙。他听完，脸上第一次出现了凝重的神色：「第八印是假的，棺材里是失踪学生的档案——他们用这个，控制知情者。」",
"「那笔钱，一半养西海岸的线，一半——买这些档案里的命。」你说。",
"埃德蒙沉默了很久，从柜子里取出一枚铜钥匙：「这是我备了三年的退路。地下街尽头有一扇暗门，通向城外。拿着它，天亮前离开学院。」",
"「那你呢？」你问。",
"「我走不了。我一走，这条线就断了——守望者在学院的二十年经营，就全完了。」他看着你，「你带着情报走，去西海岸找老鸦。他会告诉你，这盘棋该怎么继续下。」",
"他把钥匙放进你手心，又补了一句：「如果老鸦也不在了——去圣城。找圣光神学院的图书管理员。他欠我一条命，会帮你。」",
"窗外，夜色正浓。远处传来钟楼的整点声，一声接一声，像在倒计时。"
],
options:[
{t:"带着钥匙离开学院", go:"pol_leave_academy"}
]
}};

N["pol_leave_academy"]=function(){return{
place:"学院·地下街暗门",
text:[
"你沿着地下街摸到尽头，在堆积的旧木箱后面找到那扇暗门。铜钥匙插进锁孔，咔哒一声，门开了。",
"门后是一条通往城外的地道，潮湿的泥土气息扑面而来。你最后回头看了一眼——地下街的煤油灯在身后明明灭灭，像整座学院睁着的眼睛。",
"你弯腰钻进门里，把门从里面锁死。地道很长，你走了大约半个时辰，终于看到尽头透进来的微光。",
"推开出口的木板，晨雾扑面而来。你站在学院外的山坡上，回头望去——晨光里，学院的灰塔、图书馆的尖顶、占星塔的天台，都笼罩在一层薄雾里。",
"你摸了摸怀里的银羽毛徽章，又摸了摸那枚铜钥匙。身后是整座学院的秘密，身前是未知的西海岸。",
"你深吸一口气，迈步走向雾里。晨雾深处，隐约传来马车的铃铛声——那是往西海岸去的商队。",
"你追着铃声走去。身后的学院，在雾里渐渐模糊，像一个不愿醒来的梦。"
],
options:[
{t:"搭上商队，前往西海岸", go:"west_hub"}
]
}};

N["pol_hub"]=function(){return{
place:"学院·学生会活动室",
text:[
"政治的风浪终于平息了一轮。你站在学生会活动室的窗前，看着楼下三三两两的学生——他们谈论着课程、食堂和周末的舞会，没人知道这座学院的水面下，藏着多少暗流。",
"你现在是学院政治这潭水里的一个熟面孔了：有人叫你「那个查账的」，有人叫你「塔楼常客」，还有人低声叫你——「知情者」。",
"你推开活动室的门，里面正在开会。瓦伦坐在主位，看见你进来，笑容温和：「来得正好。下个议题——春季炼金大赛的赞助分配，大家有什么看法？」",
"满座的目光同时转向你。你知道，他们看的不是你的脸，是你背后的那些线。",
"你拉开椅子坐下，端起茶杯，水温刚好。你环顾四周——光明派在左，自由派在右，暗处还有几双看不清的眼睛。",
"你忽然想起灰翎说过的话：「看清风向，站好位置，别站错。」",
"你放下茶杯，笑了笑：「我有个提议。赞助分配之前，先查一查去年的账。」",
"活动室里，安静了一瞬。然后，有人笑了，有人低头，有人——暗暗握紧了拳头。",
"你看着这满室的暗流，心里清楚：这只是开始。"
],
options:[
{t:"继续参与学院政治", go:"pol_hub", effect:{world:[{force:"watcher",inf:1},{force:"eclipse",inf:-1}]}},
{t:"离开学生会，去探索地下城", go:"dungeon_intro"}
]
}};

N["pol_ignore"]=function(){return{
place:"学院·宿舍",
text:[
"你把请柬压在抽屉最底层，决定不去蹚这趟浑水。",
"日子照常过：上课、吃饭、睡觉。偶尔路过学生会门口，你能看见里面灯火通明，人影晃动，讨论着与你无关的事。",
"但奇怪的是——你总觉得有人在看你。食堂排队时、图书馆借书时、晚上回宿舍的路上。那种目光若有若无，像影子一样贴着你的后背。",
"一周后的夜里，你回宿舍时发现门上夹着一封信，没有署名。信里只有一行字：",
"「你躲得很好。但躲，也是一种立场。想好站哪边了吗？」",
"你烧掉信，躺在床上，盯着天花板，一夜无眠。窗外，学院的钟楼敲了十二下。",
"你翻了个身，把那封请柬从抽屉底层又取了出来。展开，烫金的字迹在月光下泛着微光——「内部茶会」，时间已经过了。但你看着它，忽然觉得，那扇门，也许不是想躲就能躲开的。"
],
options:[
{t:"主动去找学生会，加入局面", go:"pol_faction_map"},
{t:"仍然选择置身事外", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向一补充：学院政治分支节点（25节点）
// ============================================================

N["pol_faction_map"]=function(){return{
place:"学院·学生会活动室",
text:[
"茶会在活动室举行。长桌旁坐着学生会核心成员，烛光把每个人的脸照得半明半暗。主席瓦伦起身，向众人介绍你：",
"「这位是今年的新成员。炼金系的，脑子快，手脚干净。」他笑着拍了拍你的肩，「先带他看看咱们学院的风景。」",
"散会后，一个红发女生拦住你，她叫洛琳，自由派的活跃分子：「别听他瞎说。学院的政治格局，说白了就三块——」她竖起三根手指：",
"「光明派，唱高调，占着学生会主席和教务处的关系，成天把『学院荣誉』挂嘴边；自由派，务实，管着财务和社团，谁给钱就帮谁；还有第三块——」她压低声音，「那群人从不公开露面，但每次选举、每次人事变动，都有他们的影子。我们管他们叫『暗账房』。」",
"「暗账房？」",
"「嗯。不知道头目是谁，不知道成员有谁，只知道——学院里最不能得罪的，就是他们。」洛琳说完，朝你眨眨眼，「想入伙哪边，趁早选。年底的学生会选举，就是分水岭。」",
"窗外，钟楼敲响九点。活动室里的烛光晃了晃，有人在阴影里起身离开，脚步很轻。"
],
options:[
{t:"深入了解光明派", go:"pol_light_meet"},
{t:"深入了解自由派", go:"pol_free_meet"},
{t:"打探暗账房", go:"pol_dark_ledger"}
]
}};

N["pol_light_meet"]=function(){return{
place:"学院·光明派活动室",
text:[
"光明派的活动室在礼堂东侧，墙上挂着历任主席的画像，每一幅都画得端正庄严。负责人是个戴银边眼镜的男生，叫本内特，说话一字一顿，像念章程。",
"「光明派的核心纲领，是维护学院秩序与传统。」他推了推眼镜，「我们相信，学院之所以是学院，是因为规则。规则不乱，学院不乱。」",
"「那——经费的事呢？」你试探。",
"本内特沉默了一瞬，然后说：「经费的事，有财务委员会管。我们只负责——让委员会里的人，都是可信的人。」他顿了顿，「换句话说，我们的责任，是确保查账的人，是『自己人』。」",
"他说完，把一份章程递给你：「想加入，先签这个。每年会费五十金币，用于——」他微笑，「用于维护学院秩序。」",
"你接过章程，纸页雪白，印着学院校徽，烫金压线，一丝不苟。"
],
options:[
{t:"加入光明派", go:"pol_join_light"},
{t:"再考虑考虑", go:"pol_faction_map2"}
]
}};

N["pol_join_light"]=function(){return{
place:"学院·光明派活动室",
text:[
"你在章程上签了字。本内特点点头，把章程锁进抽屉：「欢迎加入。从现在起，你代表的是光明派——记住，你的言行，会影响学院对光明派的看法。」",
"他给你分配的第一个任务：整理学生会的公开账目副本，归档。「这是最简单也最重要的差事。」他说，「因为账目，是学院政治的镜子。谁在镜子里照得最清楚，谁就最干净。」",
"你抱着厚厚一摞账本回到宿舍，翻开第一页——去年学生会的支出明细，每一笔都工工整整。但你的目光停在了一处：",
"「春季舞会，布置费用，三百金币。经办人：瓦伦。」",
"春季舞会。你想起去年舞会的布置——彩带、灯笼、几块帷幔。这些东西，撑死花一百金币。剩下两百，去哪了？",
"你合上账本，窗外月光明亮。你忽然明白，本内特那句「谁最干净」，恐怕是说反了——最干净的账本，往往藏着最深的泥。"
],
options:[
{t:"继续追查这笔费用", go:"pol_dance_cost"},
{t:"先按兵不动，收集更多证据", go:"pol_faction_map2"}
]
}};

N["pol_dance_cost"]=function(){return{
place:"学院·后勤仓库",
text:[
"你查了春季舞会的物资清单。布料的采购单写着「丝绸，三百码」，但实物——你在仓库角落里翻到的那卷帷幔，手感粗糙，是普通棉布。",
"你拍下采购单和实物照片，正要离开，仓库管理员老休恩推门进来，看见你手里的帷幔，脸色变了一下：",
"「这卷东西——怎么还在？去年舞会结束就该扔了。」",
"「这不是丝绸。」你说。",
"老休恩沉默了几秒，忽然压低声音：「你查这个干嘛？舞会的布料，是瓦伦主席亲自指定采购的。他说要『配得上学院的格调』——至于实际买的是什么，没人敢问。」",
"「那剩下的钱——」",
"「不知道。」老休恩打断你，语气里有一丝不易察觉的紧张，「我不知道。你也别知道。有些账，查清了，人就没了。」他说完就快步离开，留下你站在昏暗的仓库里，手里的棉布帷幔沉甸甸的。"
],
options:[
{t:"查布料供应商", go:"pol_cloth_supplier"},
{t:"把证据交给自由派", go:"pol_free_meet"}
]
}};

N["pol_cloth_supplier"]=function(){return{
place:"学院·档案室",
text:[
"你在采购档案里找到布料供应商的登记：城南织坊，老板姓孙。你出校门找到那家织坊，门脸不大，堆满各色布匹。",
"孙老板是个精瘦的中年人，听你问丝绸的事，警惕地打量你：「丝绸？学院今年没在我这儿订过丝绸。」",
"你亮出采购单。他看了一眼，脸色微变：「这单子是假的。我这儿开出去的发票，抬头都是『城南织坊』，但编号对不上——这单号，不是我开的。」",
"「那它是谁开的？」",
"孙老板摇头，把采购单推回来：「我不知道。但你回去可以问问——学院里，谁有本事开出盖着『城南织坊』印鉴的假单子，谁就经手了那笔钱。」他顿了顿，补了一句，「城南织坊的印鉴，只有我有一枚。除非——有人仿制。」",
"你走出织坊，日头正烈。你低头看手里的采购单，印鉴鲜红，仿得几乎以假乱真。能仿到这种程度的人，必然见过真章——而真章，在孙老板手里。谁见过？",
"你想起一个人：教务处助理，埃德蒙。他经手学院所有印章——包括织坊的采购往来。"
],
options:[
{t:"去试探埃德蒙", go:"pol_edmund_probe"},
{t:"先把证据收好，回去再说", go:"pol_faction_map2"}
]
}};

N["pol_free_meet"]=function(){return{
place:"学院·自由派聚集地（旧食堂）",
text:[
"自由派在旧食堂二楼扎营——几张旧沙发，一圈烟灰缸，墙上贴着历年财务表的复印件。洛琳坐在最中间的沙发上，翘着腿，看见你来了，往旁边让了让。",
"「光明派那边，是不是给你派了个『整理账目』的活？」她笑着问，没等你回答就接着说，「每年都这样。新人进来，先让查账——查着查着，要么成了自己人，要么——」她做了个抹脖子的手势，随即哈哈大笑，「开玩笑的。学院里不兴这个。」",
"她收敛笑容：「自由派的规矩简单：利益分明，账目清楚。我们不谈理想，只谈——谁的钱，流向哪，换来了什么。」她拍了拍沙发边的一摞文件，「学院十年来所有社团的经费申请和批复，我都有副本。你想查什么？」",
"你说了春季舞会的事。洛琳吹了声口哨：「瓦伦的手笔？他每年舞会都『超支』，每年超支的数额——差不多能买一匹好马。你要查，我帮你，但有个条件：查到的第一手情报，先给我一份。」",
"她伸出手，笑吟吟地看着你。"
],
options:[
{t:"与她合作，交换情报", go:"pol_free_ally"},
{t:"拒绝，自己单独查", go:"pol_faction_map2"}
]
}};

N["pol_free_ally"]=function(){return{
place:"学院·旧食堂二楼",
text:[
"你和洛琳击掌为盟。她从沙发底下拖出一只铁皮箱，打开——里面是几十份复印件，按年份排列，最旧的一份已经泛黄。",
"「这些是学院历年的财务记录，我从三个渠道凑齐的。」她抽出一份递给你，「你看这个——五年前，『西海岸贸易协会』捐了八百金币，名义是资助『跨海学术交流』。但当年学院根本没有跨海项目。」",
"你心头一跳：又是西海岸贸易协会。",
"洛琳注意到你的表情：「你也查到了？他们每年捐钱，从不参加活动——学院里有人说他们傻，有人说他们图名。但依我看——」她压低声音，「他们图的东西，不在明面上。」",
"「你觉得他们图什么？」",
"「不知道。但我知道一件事——」她指了指那份记录，「西海岸贸易协会的会长，姓埃德蒙。对，就是咱们副院长那个埃德蒙。他是协会的挂名顾问，每年拿一笔顾问费。」",
"旧食堂的灯泡嗡嗡响着。你盯着那份泛黄的文件，忽然觉得，这张网——比想象中织得更大，更早。"
],
options:[
{t:"顺着埃德蒙这条线查", go:"pol_edmund_past"},
{t:"把西海岸协会的线索报告守望者", go:"pol_watcher_report"}
]
}};

N["pol_dark_ledger"]=function(){return{
place:"学院·地下酒窖",
text:[
"「暗账房」不好找。你在学院里打听了一周，只得到一个模糊的说法：他们在酒窖聚会。",
"深夜，你摸进地下酒窖。这里堆满落灰的酒桶，空气中弥漫着陈年橡木的气息。你绕到最里面，发现一扇伪装成酒桶架的暗门——推开，里面是一间亮着灯的小室。",
"室内只有一个人：一个头发花白的老人，正对着一摞账本用放大镜看。他听见动静，没有抬头：「能摸到这里，你比大多数人强。坐。」",
"你坐下。老人合上账本，看着你：「暗账房，没有名字，没有章程，只有一本总账。我们做的只有一件事——记住学院里每一笔钱的来处和去处。不干涉，不评论，只是记住。」",
"「记住来干什么？」",
"「等有人需要的时候，告诉他。」老人把一本泛黄的账册推到你面前，「比如现在——你查的西海岸贸易协会，五年前第一笔捐款的签收人，是当时的学生会财务干事。你猜他现在是谁？」",
"你翻开账册，那个名字旁边标注着现任职务。你瞳孔微缩：那人现在是——教务长。"
],
options:[
{t:"追问暗账房的来历", go:"pol_dark_origin"},
{t:"请求查看完整账目", go:"pol_dark_full"}
]
}};

N["pol_dark_origin"]=function(){return{
place:"学院·地下酒窖",
text:[
"老人倒了杯酒，慢慢说：「暗账房的来历，比学院还要早。第一任院长建校时，就立下规矩——学院的钱，要有一本『不进库房』的账。因为总有些钱，见不得光，但必须有人记得。」",
"「那你们——」",
"「我们是一代代传下来的看账人。」老人抿了口酒，「不站队，不掺和，只记账。光明派也好，自由派也好，暗蚀会也好——谁的钱从哪来、往哪去，我们都记着。等有一天，有一个人能把这些账串起来，看清整盘棋——那就是我们等的日子。」",
"他看着你，目光浑浊而深沉：「你查账的本事，像极了二十年前来的那个人。他也查西海岸，也查学生会——后来他失踪了。他的名字，我们记在总账最后一页。」",
"他翻开总账最后一页，上面只有一个字：「鸦。」",
"老鸦。你心头一震——灰翎提过的那个人，守望者驻学院的前任联络人，失踪三年。他的名字，竟然出现在暗账房的账本上。"
],
options:[
{t:"问老鸦查到了什么", go:"pol_dark_oldcrow"},
{t:"告辞，回去消化这些信息", go:"pol_faction_map2"}
]
}};

N["pol_dark_oldcrow"]=function(){return{
place:"学院·地下酒窖",
text:[
"老人放下酒杯，从账本夹层里取出一张泛黄的纸条：「他失踪前，留了这个，托我们收着。说将来若有人问起西海岸的钱——把这个给他。」",
"纸条上只有一行字，笔迹潦草：",
"「钱不养人，养印。第七印。学院地下。」",
"「养印？」你问。",
"「七印，是上古封魔之物，大陆上传说已久。学院地下藏着其中一枚碎片——老鸦查了三年，确认西海岸贸易协会捐的钱，全部用于维持封印的材料。」老人叹了口气，「但封印快撑不住了。材料越来越贵，而盯着这枚碎片的人，越来越多。」",
"他看向你：「老鸦说，若有人拿到这张纸条，要么接过看守的担子，要么——在封印破开之前，找齐重铸的材料。」",
"你攥着那张纸条，纸页冰凉。地下酒窖的灯光昏黄，像是这间小室在黑暗里守了太久，终于等到了下一个该知道真相的人。"
],
options:[
{t:"接续看守的职责", go:"pol_guardian"},
{t:"先回去，好好想想", go:"pol_faction_map2"}
]
}};

N["pol_dark_full"]=function(){return{
place:"学院·地下酒窖",
text:[
"老人看着你，摇了摇头：「总账不能给你看。不是不信你——是规矩。看账人只记账，不散账。一旦总账泄露，学院里那些见不得光的钱，就会全部重新洗牌，到时候，血流成河。」",
"他顿了顿：「但你可以记住一条：学院政治的水底，只有一件东西值得那么多钱去养。其他的——都是掩护。」",
"「什么东西？」",
"「我不知道它具体是什么。但老鸦留下的记录里，提过两个字——」他压低声音，「七印。」",
"七印。你心头一凛——大陆上七印的传说，你早有耳闻，但从未想过，它可能就藏在学院地下。",
"老人说完，不再开口，只是又倒了一杯酒，慢慢喝着。你起身告辞，走出酒窖时，夜风扑面，你回头看了一眼那扇伪装成酒桶架的暗门——像一只合上的眼睛，守着一个说不出口的秘密。"
],
options:[
{t:"去查七印与学院的关联", go:"pol_seven_seal"},
{t:"先回宿舍消化信息", go:"pol_faction_map2"}
]
}};

N["pol_seven_seal"]=function(){return{
place:"学院·图书馆",
text:[
"你在图书馆古籍区泡了三天，终于在一本落灰的《大陆封印考》里找到一段记载：",
"「七印，上古先贤封印深渊之物。各印藏于大陆七处，由守望者世代看守。其中第七印，曾于百余年前遗失，下落不明。」",
"书页边角，有人用铅笔写下一行批注：「第七印下落：交汇城。疑藏于学院地下。」笔迹与你见过的老鸦笔记，有七分相似。",
"你合上书，心里已经理出一条线：西海岸贸易协会捐钱→养封印材料→封印藏于学院地下→守望者（埃德蒙、老鸦）看守→各方势力争夺。",
"而瓦伦的舞会账目、昆特的暗线、塞德的第三方——所有人在学院政治里搅动的水花，底下都是同一个东西：第七印碎片。",
"你站起身，把书放回原处。走出图书馆时，正午的阳光刺眼，你眯起眼，忽然觉得这座学院——从来就不只是一座学院。"
],
options:[
{t:"去找埃德蒙求证", go:"pol_edmund_truth"},
{t:"去找灰翎商量", go:"pol_gray_girl2"}
]
}};

N["pol_faction_map2"]=function(){return{
place:"学院·学生会活动室",
text:["你在学院政治的水面上浮沉了几周，渐渐摸清了脉络。光明派、自由派、暗账房——三条线各自延伸，又在某些看不见的节点上交汇。", "你桌上摊着一份自己画的势力关系图：瓦伦连着账目，昆特连着圣光，塞德连着第三方，埃德蒙连着守望者，灰翎连着占星塔。而所有这些线，最后都指向同一个地方——学院地下。", "你在地图上画了一个圈，把「学院地下」圈住。笔尖在纸上顿了顿，留下一个浅浅的墨点。", "窗外，钟楼敲响整点。你收起地图，把它锁进抽屉最深处。有些棋，要看清楚才能下；而有些棋，下得太早，就会成为别人的棋子。", "你决定——先把手头的线索再整理一遍，等一个合适的时机，再走下一步。", "你花了很多天，把学院里的派系关系，画成了一张图。", "图上画着几个圆圈，圆与圆之间，用线连着。有的线是实线——盟友；有的是虚线——交易；有的是波浪线——表面客气，暗地里较劲。", "你画到最后，发现一件有意思的事：有一个圆圈，和所有圆圈之间，都没有线。它孤零零地，挂在图的角落里，像一座孤岛。", "你问过很多人，那个派系是什么。大多数人摇头，只有一个人，压低声音说了一句：「别问。问了，你也会被画进那个圈里。」", "你看着那个孤零零的圆圈，看了很久。你最后，没有把它从图上擦掉。你只是，在它旁边，画了一个问号。"] /*v45inj:pol_faction_map2*/,
options:[
{t:"继续深挖一条线索", go:"pol_math_book"},
{t:"去探索学院的地下（地下城方向）", go:"dungeon_intro"},
{t:"回归日常，等待时机", go:"pol_hub"}
]
}};

N["pol_third_party"]=function(){return{
place:"学院·学生会的深夜",
text:[
"你决定追查那个「第三方」——在学院与圣光之间截流资金的人。你翻遍账目，发现一个规律：每一笔流向圣光的资金，都会在到账前被划走一小部分，去向是一家名为「磐石」的账户。",
"「磐石」在学院没有任何记录——没有办公室，没有负责人，只有一个账户编号。你顺着账户编号查下去，发现它的开户人签名：塞德·沃德，学生会副主席。",
"你心里已经有数了。但你不确定的是：塞德是第三方的主脑，还是只是第三方推到台前的人？",
"深夜，你站在学生会办公室门外。门缝里漏出灯光，里面传来压低的声音：「……那笔钱，圣光那边催了。告诉他们，再等等——等选举结束，一起结清。」",
"是塞德的声音。他说的选举——是指学生会选举？还是别的什么？",
"你正要离开，门忽然开了。塞德站在门口，手里端着两杯茶，表情平静得像早就知道你在外面：「来了就进来吧。我正想找你聊聊——关于『磐石』的事。」"
],
options:[
{t:"进去，摊开谈", go:"pol_join_third"},
{t:"借口离开，先保全自己", go:"pol_faction_map2"}
]
}};

N["pol_rest_politics"]=function(){return{
place:"学院·宿舍",
text:["你难得睡了个整觉。清晨，阳光从窗帘缝隙漏进来，落在枕边。你伸了个懒腰，觉得浑身的弦松了不少。", "学院政治的暗流，偶尔也需要喘口气。你洗了把脸，把那些账本、纸条、羽毛徽章收进抽屉深处——今天，你只想做个普通学生。", "食堂的粥还热着，窗边的位置空着，阳光正好。你坐下来，慢慢喝粥，听旁边桌的学生讨论下午的炼金课。", "平凡的日子，像一杯温水。但只有你自己知道，那杯温水底下，藏着整片海的暗涌。你喝完粥，把碗放回回收处，阳光落在你手上，暖洋洋的。", "休息够了。该继续了。", "学院的政事，比你想的复杂。表面上，院长说了算；实际上，各派系的教授各管一摊，学生里也有自己的圈子。", "你听说，光明派的教授主张严管，禁书区要再加三道锁；自由派的教授反对，说学院的精神就是「让该知道的都知道」。两边在会上吵了一下午，谁也没说服谁。", "你问一个高年级学长，这种事常见吗。他见怪不怪：「常见。每年开学都吵一次。」他压低声音，「不过今年不一样——听说，上面要来检查。」", "「检查什么？」你问。", "他四下看了看：「检查「思想」。看有没有人，教不该教的东西。」他拍了拍你的肩，「反正，你少去图书馆顶楼。那种地方，查起来第一个遭殃。」", "他走了。你站在原地，想起前几天在图书馆听见的翻书声。你抬头看了看图书馆的方向，顶楼的窗户，黑着。"] /*v45inj:pol_rest_politics*/,
options:[
{t:"夜里做了一个奇怪的梦", go:"fsh_dream_gate"},
{t:"继续查学院政治", go:"pol_faction_map2"},
{t:"去探索地下城", go:"dungeon_intro"},
{t:"去见见学院里的人", go:"npc_rel_hub"},
{t:"整理随身行囊", go:"item_hub"},
{t:"翻看夜读笔记", go:"hook_hub"},
{t:"梳理任务清单", go:"quest_hub"},
{t:"想想毕业后的打算", go:"grad_hub"}
]
}};

N["pol_report_aftermath"]=function(){return{
place:"学院·西塔楼",
text:[
"你回到塔楼，把禁书区发生的事一五一十告诉埃德蒙。他听完，沉默了很久，才开口：",
"「克莱门特拿走了手稿的抄本。真本在灰翎手里——这是今晚最好的结果。」他顿了顿，「但抄本到了圣光手里，他们很快就会知道内容是假的。到时候，他们会派更专业的人来。」",
"「那怎么办？」",
"「凉拌。」他难得开了个玩笑，随即正色，「抄本是假的，但假得不高明——有心人翻几页就能看出破绽。所以留给我们的时间，不多了。他们再派人来之前，我们必须把手稿真本里的名单，全部转移。」",
"他看向窗外：「灰翎拿了真本，下一步就是离开学院。她不能带着名单走——太危险。名单要化整为零，分散到各个联络点。」",
"窗外，夜色正浓。你听着他的话，忽然明白，这场与圣光的博弈，才刚刚开始。"
],
options:[
{t:"协助转移名单", go:"pol_list_move"},
{t:"先休息，明天再行动", go:"pol_rest_politics"}
]
}};

N["pol_list_move"]=function(){return{
place:"学院·各联络点",
text:["名单上的第三个名字，是你认识的。", "你盯着那个名字，看了很久。名字下面，备注栏里写着三个字：「已离院」。", "可你知道，他昨天还出现在食堂。你亲眼看见他，端着一碗汤，坐在窗边。", "你放下名单，又拿起来，再看了一遍。字是工整的馆阁体，一笔一划，没有任何犹豫——写这份名单的人，很清楚自己在写什么。", "你忽然觉得后背有些发凉。不是害怕，是那种——忽然发现，自己脚下站的地方，可能不是你以为的那块地的感觉。", "你把这页纸折好，收进怀里。你知道，从这一刻起，你也成了名单上——看不见的那个名字。", "接下来的三天，你和埃德蒙把名单上的名字拆散，分头送往学院各处的秘密联络点：图书馆的夹层、占星塔的星图柜、旧食堂的灶台砖、地下酒窖的暗格。", "每一个名字，都是一条命。你亲手把那些泛黄的纸页藏进砖缝、夹层和暗格里，指尖摩挲过纸面，能摸到当年写名字的人用力过猛的笔痕。", "最后一页，是老鸦的名字。你犹豫了一下，把它折好，塞进占星塔天台的石缝里，用星图压住。", "做完这一切，你站在天台上，夜风猎猎。你忽然想：这些名字，什么时候能重见天日？", "也许，等学院政治这潭水清了的那一天。也许，永远等不到。但你至少让它们——没有被毁掉。", "你走下天台时，回头看了一眼。星图在风里哗哗作响，像在替那些名字，轻声说着什么。", "那天晚上，你去了食堂。", "他还在。坐在窗边，还是那个位置，端着一碗汤。你端着餐盘，在他对面坐下。", "他抬起头，冲你笑了笑：「今天来得晚。」", "「嗯，有点事。」你说。你低头吃饭，没有提名单的事。他也什么都没问，安静地喝他的汤。", "你们就这么坐着，吃了顿饭，说了几句无关紧要的话。可你知道，有些事情，已经不一样了——不是他变了，是你变了。", "你吃完饭，端着盘子站起来。他叫住你：「哎。」你回头。他张了张嘴，最后说：「……早点睡。」", "你点点头，走了。走出食堂，你回头看了一眼——他还坐在窗边，汤碗已经空了。他望着窗外，不知道在看什么。"] /*v45inj:pol_list_move*/,
options:[
{t:"回塔楼复命", go:"pol_hub"}
]
}};

N["pol_gold_night"]=function(){return{
place:"学院·财务室",
text:[
"深夜，你摸回财务室。门没锁——白天那本账册还摊在桌上，像专门等你来翻。",
"你借着月光翻开账册，一页页看下去。前面的记录都是常规收支，直到你翻到倒数第三页——一笔「紧急修缮费」，数额八百金币，备注栏空白。",
"你正要细看，门外传来脚步声。你迅速合上账册，闪身躲进窗帘后。门开了，一个人走进来，径直走到桌边，翻开账册——是学生会副主席塞德。",
"他看了一眼账册，从怀里掏出一支笔，在「紧急修缮费」的备注栏里添了一行字：「批准。用于西塔楼地基加固。」",
"西塔楼。你心头一跳——那不是副院长埃德蒙常待的地方吗？",
"塞德签完字，合上账册，转身离开。你从窗帘后出来，盯着那行新添的字。八百金币——加固西塔楼地基？你低头看地面，脚下这栋财务室，墙皮完好，地板平整。而西塔楼，你上去过，虽然旧，但不至于要八百金币加固。",
"这笔钱，名义上修塔，实际上——去了哪？",
"月光照在账册上，「西塔楼地基加固」几个字，墨迹未干，泛着湿润的光。"
],
options:[
{t:"去西塔楼检查地基", go:"pol_tower_base"},
{t:"把这件事告诉埃德蒙", go:"pol_report_edmund"}
]
}};

N["pol_tower_base"]=function(){return{
place:"学院·西塔楼地基",
text:[
"你趁夜色绕到西塔楼后面。地基处的石砖确实有修补痕迹，但都是旧伤——最近的新痕迹，在墙根一处不起眼的角落里，泥土有翻动过的迹象。",
"你蹲下来，拨开浮土，露出一块石板。撬开石板——下面是一个深坑，坑里空空如也，但坑壁边缘有整齐的凿痕，像是曾经存放过什么东西，最近被取走了。",
"你用手电照了照坑底，角落里卡着一片东西——你捡起来，是一枚铜质的徽章残片，边缘有烧灼痕迹，只留下半个图案：一只闭眼的……天平。",
"和塞德给你的那枚铜章，一模一样。",
"你握着残片，忽然明白：西塔楼的地基下，曾经存放着「第三方」的什么东西。而现在——它被转移了。塞德批准的那八百金币，名义上是加固地基，实际上是——转移的费用。",
"你收好残片，把石板盖回去，拂掉浮土，退进夜色里。身后，西塔楼的阴影沉默地矗立着，像什么也没发生过。"
],
options:[
{t:"把残片给埃德蒙看", go:"pol_report_edmund"},
{t:"自己顺着残片查下去", go:"pol_third_party"}
]
}};

N["pol_gray_girl"]=function(){return{
place:"学院·占星塔",
text:[
"散会后的那个灰袍女生，你记住了。她叫灰翎，占星系三年级——学院的边缘人物，几乎不参加任何公开活动。",
"你在占星塔找到她时，她正对着星图写写算算，头也不抬：「你打听我？」",
"「你袖口的羽毛，是守望者的标记吧。」你直接说。",
"她手里的笔顿了一下，然后若无其事地继续写：「守望者不标记学生。你看错了。」",
"「那你在茶会上，为什么一直盯着我？」你追问。",
"她终于放下笔，转过身来。月光下，她的眼睛很亮：「因为我好奇——一个敢在学生会里问『经费流向』的人，能活多久。」她顿了顿，「上一个问这个问题的人，三个月后『转学』了。希望你能活得久一点。」",
"她说完，又转回去看星图，但补了一句：「你要是真想查——图书馆地下二层，有一间废弃的期刊库。里面有些旧文件，够你看一夜的。」",
"她没再说别的。你走出占星塔时，回头看了一眼——她仍坐在月光里，像一座沉默的塔。"
],
options:[
{t:"去图书馆地下二层看看", go:"pol_library_b2"},
{t:"先回去，明天再来", go:"pol_faction_map2"}
]
}};

N["pol_finance_join"]=function(){return{
place:"学院·财务委员会",
text:[
"你申请加入财务委员会。申请递上去一周，批下来了——签字的是教务长，批语只有两个字：「准予。」",
"委员会每周二开会。你第一次参会，发现流程异常规范：先念章程，再对账目，最后表决。账目确实清楚，每一笔都有票据。",
"但你注意到一个细节：每次对到「学术交流」类目时，委员会主席——那个总是笑眯眯的中年教授——都会把那一页翻得特别快，像是不想让人细看。",
"你记下了这个细节。会后，你借口整理资料，把近三年的「学术交流」账目复印了一份。回到宿舍，你逐条比对，发现一个规律：每一笔交流经费，都对应着一个「交流对象」——但那些交流对象，学院档案里查无此人。",
"换句话说，这些钱，付给了不存在的人。",
"你盯着那摞复印纸，窗外月明星稀。你忽然明白，财务委员会的门，从来不是给你查账用的——是给「会查账」的人，准备的笼子。你进了笼子，就以为自己在查账。其实——你只是在看他们想让你看的那几页。"
],
options:[
{t:"暗中收集更多证据", go:"pol_finance_evidence"},
{t:"退出委员会，换条路查", go:"pol_faction_map2"}
]
}};

N["pol_finance_evidence"]=function(){return{
place:"学院·宿舍",
text:[
"你开始把近五年的「学术交流」账目全部复印，逐条标注异常。每晚挑灯夜战，桌上堆起厚厚一摞。",
"第三周，你终于找到了那个「不存在的人」的破绽：三年前，一笔「与北地学者交流」的经费，签收人是「马库斯·贝尔」。你翻遍学院档案，没有这个人——但你在旧校刊上，看到了一张照片：北地交流团合影，角落里站着个年轻人，与三年前的战士系学生马库斯·温特，有七分相似。",
"马库斯·温特——这个名字你熟悉。他是学院有名的「怪人」，从不参加集体活动，独来独往。",
"「马库斯·贝尔」与「马库斯·温特」，只差一个姓。是笔误，还是——刻意留下的记号？",
"你合上账本，心里有了一个大胆的猜想：那些「不存在的人」，也许真的存在过——只是他们的名字，被换掉了。换成一个不会被人记住的名字，用来接收那笔钱。",
"而换名字的人，必须同时掌握学院档案和学生名册——这样的人，只有教务处。",
"你抬头看向窗外，教务处大楼的灯光，还亮着。"
],
options:[
{t:"去教务处查档案", go:"pol_edmund_probe"},
{t:"去找马库斯·温特本人", go:"pol_marcus_meet"}
]
}};

N["pol_marcus_meet"]=function(){return{
place:"学院·战士系训练场",
text:[
"马库斯·温特正在训练场练剑。他看见你走来，收了剑，用毛巾擦汗，没说话——但眼神里带着询问。",
"你直接问：「三年前，北地交流团的名单里，有个『马库斯·贝尔』，和你什么关系？」",
"他的动作顿了一下。然后他放下毛巾，看着你，声音很平：「你怎么知道这个名字的？」",
"「查账查到的。」",
"他沉默了很久，才说：「那是我弟弟。他三年前参加了北地交流，然后——没回来。学院说他是『自愿留在北地』，但我查过，北地没有他的任何记录。」",
"「学院付给他的交流经费——」你说。",
"「那笔钱，从来没有到他手里。」马库斯打断你，声音里有一丝不易察觉的颤，「我查过。他走后，钱进了学院的账，然后——消失了。」",
"他看着你：「如果你真的在查这件事——小心。我弟弟就是查了太多，才『被自愿』留在北地的。」",
"他说完，重新拿起剑，背对着你：「你是这三年第一个来问这件事的人。别成为第二个『马库斯·贝尔』。」"
],
options:[
{t:"把线索告诉埃德蒙", go:"pol_report_edmund"},
{t:"自己继续查北地交流团的真相", go:"pol_third_party"}
]
}};

N["pol_leave_tower"]=function(){return{
place:"学院·西塔楼下",
text:["你走下钟楼的时候，天色已经暗了。", "台阶很陡，每一步都踩出回响。你数着台阶，一级，两级——数到一半，你忽然想，这座钟楼，每天都有人这样上上下下，可没有人知道，它肚子里装着多少秘密。", "你走到底层，推开门。晚风灌进来，带着学院花园里泥土和草叶的气味。你深吸了一口气，觉得胸口的闷气，散了一些。", "你回头看了一眼钟楼。它在暮色里立着，像一个沉默的巨人，什么也不说。", "你转身走回宿舍。走到半路，你忽然停下来——你想起来，刚才在钟楼上，你看见塔顶的钟，停在了下午三点。", "可你上去的时候，明明是黄昏。", "你转身走下塔楼，脚步尽量放轻。身后，埃德蒙没有追出来，但你总觉得，那道目光一直黏在你的后背上，直到你拐过走廊转角。", "夜风很凉。你回到宿舍，锁上门，在桌前坐了很久。塔楼顶层那些发黄的文件、埃德蒙那句「我等你三届了」、还有那盏忽明忽暗的烛火——一幕幕在脑海里翻来覆去。", "你最终没有把这件事告诉任何人。有些门，推开过，再关上，也不是什么都没发生——你知道自己已经站在了门的另一边，哪怕只有一瞬。", "你吹熄蜡烛，躺下。黑暗中，你听见自己的心跳，慢慢平复下来。但你知道，塔楼的那个秘密，从此会像一根刺，扎在心底最深处，不疼，但一直在。", "第二天一早，你特意绕到钟楼下，抬头看那口钟。", "它走着。指针指着上午九点，不紧不慢，和这座学院里每一口钟一样。", "你站了一会儿，没有上去。你告诉自己，大概是昨天看花了眼。可你知道，你没有看花。", "那口钟，昨天下午，确实停过。", "你转身离开。走远了，你回头——那口钟还在走，嘀嗒，嘀嗒，像什么都没有发生过。你忽然想：这世上，有多少事，是像这口钟一样——停了，又自己走起来，让人以为什么都没发生。"] /*v45inj:pol_leave_tower*/,
options:[
{t:"回归平静，当作没看见", go:"pol_hub"},
{t:"还是放心不下，再查下去", go:"pol_faction_map2"}
]
}};

N["pol_back_dorm"]=function(){return{
place:"学院·宿舍",
text:["你推开宿舍的门，屋里一片漆黑。", "舍友们都睡了。有人打着呼噜，有人在梦里翻了个身，嘟囔了一句听不清的话。你站在门口，听着这些声音，忽然觉得——安全。", "你轻手轻脚地洗漱，躺上床。床板吱呀一声，在黑暗里响得很清楚。", "你睁着眼睛，看着天花板。白天的事，一件一件，从眼前过。名单，钟楼，账本，那句「别踩别人的影子」。", "你闭上眼睛，又睁开。过了很久，你翻了个身，把被子拉过头顶。", "你终于睡着了。梦里，你又走过那条回廊——这一次，回廊尽头站着一个人。你看不清他的脸，可你知道，他在等你。", "你回到宿舍，把门锁好，在桌前坐下。塔楼里的对话还在耳边回响——埃德蒙的坦白、守望者的徽章、还有那句「你确定想知道吗」。", "你摊开纸，想把这些信息整理出来，但笔尖悬在纸上，半天落不下去。知道得太多的感觉，像背着一块石头。", "窗外，月亮被云遮住又露出来，反反复复。你终于放下笔，把纸揉成一团，丢进废纸篓。", "有些答案，知道了，就再也没法装作不知道。但今晚——你选择先睡一觉。明天，太阳照常升起，学院照常运转，而你，还是那个「好奇心重」的学生。", "你吹熄蜡烛，躺进被子里。黑暗中，你盯着天花板，慢慢呼吸。学院政治的暗流在脚下涌动，但你决定，先让它们流一夜。", "第二天早上，你醒得很早。", "天刚蒙蒙亮。窗外有鸟叫，一声一声，叫得很清亮。你坐起来，在床边坐了一会儿，才想起昨晚的事。", "你洗漱完，下楼吃早饭。食堂里人不多，你端着粥，坐在老位置。阳光从窗子照进来，落在桌上，温温热热的。", "你喝了一口粥，忽然觉得，昨晚那些事，好像也没有那么可怕了——天亮了，人还活着，粥还是热的。", "你慢慢把粥喝完。放下碗的时候，你做了一个决定：有些事，看见了，就当看见了；但路，该走，还是得走。", "你站起来，走出食堂。外面的阳光，比刚才更亮了。"] /*v45inj:pol_back_dorm*/,
options:[
{t:"继续平静的生活", go:"pol_hub"},
{t:"还是放心不下，继续查", go:"pol_faction_map2"}
]
}};



// ============================================================
// v39 方向一补全：学院政治分支（23节点）
// ============================================================

N["pol_exchange_probe"]=function(){return{
place:"学院·交流团驻地",
text:[
"你开始暗中观察圣光交流团。白天他们按部就班地参加学术活动——听课、参观、座谈，一切正常得过分。",
"但那个「图书管理员」始终没有露面。你查了交流团的名单，他的名字叫「赫尔曼」，职务栏写的是「随行图书管理员」。",
"第三天午后，你看见赫尔曼从驻地侧门溜出来，往图书馆方向走。他脚步不快，但路线绕开了所有巡逻的学生，显然对学院地形很熟。",
"你远远跟着他。他没有进图书馆正门，而是绕到图书馆侧面，推开一扇通往地下室的铁门——那扇门，平时挂着「维修中」的牌子。",
"你记住了门的位置，没有跟进去。回到宿舍，你把观察到的路线画在纸上：交流团驻地→侧门→图书馆地下铁门。",
"这条路线，和你查到的账目流向，几乎平行。你盯着纸上的两条线，忽然觉得——圣光的「学术交流」，也许从来都是幌子。"
],
options:[
{t:"夜里潜入图书馆地下室", go:"pol_library_b2"},
{t:"报告埃德蒙", go:"pol_report_edmund"}
]
}};

N["pol_edmund_decision"]=function(){return{
place:"学院·图书馆地下",
text:[
"埃德蒙按住你的肩，声音压到最低：「走。现在。」",
"你们沿着来路摸黑撤退。身后，地下室里传来昆特的声音，在空荡的石室里回荡：「搜！他跑不远！」",
"你们冲出图书馆侧门时，夜风灌进来，你听见门后传来急促的脚步声。埃德蒙拉着你拐进一条窄巷，贴着墙根蹲下，屏住呼吸。",
"脚步声从巷口经过，没有停留，一路朝学生宿舍方向追去。",
"等脚步声远了，埃德蒙才松口气：「昆特不敢声张——他也不敢让学院知道他和圣光的暗线。所以他只会私下搜，不会报警。」",
"「那我们安全了？」",
"「暂时。」他站起身，拍了拍膝盖上的土，「但你今晚看到的，够他把我们当眼中钉了。从明天起，昆特的课，你尽量别上；他的训练场，你绕远路走。」",
"他顿了顿：「今晚的事，烂在肚子里。对任何人都不要说——包括你信得过的朋友。学院政治这潭水，能信的人，越少越安全。」",
"你们借着夜色分头离开。你回到宿舍时，天边已经泛白。"
],
options:[
{t:"继续追查昆特的暗线", go:"pol_third_party"},
{t:"先稳住，观察几天", go:"pol_wait_qinte"}
]
}};

N["pol_wait_qinte"]=function(){return{
place:"学院·训练场",
text:["你在回廊里等他。", "夕阳从彩窗漏进来，在地上拉出一长条一长条的光带。灰尘在光里浮着，慢悠悠地，像一群没有心事的小虫。", "你数着光带，数到第七根的时候，他来了。步子不快不慢，鞋跟磕在石板上，笃，笃，笃——像一口钟，在敲自己的时间。", "「等多久了？」他问。", "「不久。」你说。其实你等得够久了，可你知道，跟这种人，不能说「等久了」——他会把你的急，当成把柄。", "他笑了一下，像是看穿了你的话，却没有戳破：「走吧。边走边说。」", "接下来的几天，你刻意避开了战士系的训练场。昆特似乎也在观望——他照常上课，照常训练，像什么都没发生过。", "但你的直觉告诉你，平静只是表面。第四天，你收到一封没有署名的信，压在你宿舍门缝下：", "「今晚亥时，旧训练场，恭候大驾。有些误会，当面说清比较好。」", "信纸背面，画着一个简单的图案——一把剑穿过天平。昆特的信物。", "你盯着那封信，指尖摩挲着纸面。去，还是不去？去了，可能是陷阱；不去，昆特会一直盯上你。", "窗外，暮色渐沉。钟楼敲响六下，你还有四个时辰做决定。", "他走在前面，你落后半步。这个距离，是他自己保持的——不快不慢，不远不近。", "「你来找我，是为了什么？」他没有回头。", "「想请教一件事。」你说，「关于——禁书区。」", "他的脚步顿了一下，很轻微，你没有看漏。「禁书区？」他重复了一遍，「那地方，知道的人不多。」", "「所以我来了。」你说。", "他沉默着走了十几步，然后开口：「明天酉时，钟楼下。带一样东西来——一件你从家乡带来的、不值钱的东西。」", "「为什么？」你问。", "「因为值钱的东西会说谎。不值钱的不会。」他说完，拐过转角，不见了。你站在原地，想着他那句话，忽然觉得，这学院里，聪明人比你想象的多。"] /*v45inj:pol_wait_qinte*/,
options:[
{t:"赴约，当面会会昆特", go:"pol_qinte_meet"},
{t:"不去，请埃德蒙出面调停", go:"pol_edmund_mediator"}
]
}};

N["pol_qinte_meet"]=function(){return{
place:"学院·旧训练场",
text:[
"亥时，旧训练场空无一人，月光把沙地照得惨白。你站在场地中央，等了约一盏茶的工夫，昆特从暗处走出来。",
"他没有带武器，两手空空，站在十步之外打量你：「胆子不小。真的来了。」",
"「你找我，什么事？」",
"「那天晚上的事——」他顿了顿，「我当没发生过。你既然查到了，就该知道有些东西碰不得。我放你一马，条件是：你从此不再碰圣光那条线。」",
"「为什么？」你问。",
"昆特沉默片刻，开口时声音低了几分：「因为我女儿，在圣光神学院读书。他们拿她当人质，逼我传递学院的情报。你以为我想当暗线？我当了三年，每天晚上都恨不得剁了这双手。」",
"他抬起头，月光下，这个凶名在外的教头，脸上满是疲惫：「你要查，就查他们——查圣光，查西海岸，查那些真正在幕后操纵的人。别查我。我只是——」他苦笑，「我只是个想把女儿接回来的父亲。」",
"风穿过训练场，扬起沙尘。你看着这个高大的男人，忽然不知道该怎么接话。"
],
options:[
{t:"相信他，帮他救女儿", go:"pol_qinte_ally"},
{t:"保持怀疑，继续观察", go:"pol_faction_map2"}
]
}};

N["pol_qinte_ally"]=function(){return{
place:"学院·旧训练场",
text:[
"你上前一步：「你女儿叫什么名字？我能怎么帮你？」",
"昆特看着你，眼神里有一瞬间的动容，随即又恢复冷静：「她叫昆蒂娜，在圣光神学院读神学系。三年前他们扣住她，逼我做事——每年给他们传一份学院的内部文件。」",
"「今年的文件——」",
"「已经传了。」他说，「但明年，我不想再传了。我想把女儿接回来——我需要一个外援，一个学院里能信任的人。」",
"「你怎么知道我能信任？」",
"「因为你是这三年第一个查到我头上的学生。」他苦笑，「查到我头上的人，要么是圣光的眼线，要么是真正想查真相的人。你如果是圣光的眼线，早就把我卖了——可你没有。」",
"他向你伸出手：「帮我把女儿接回来。作为回报——我把这些年传给圣光的情报清单，全部给你。包括他们从学院拿走的每一样东西。」",
"月光下，他的手掌粗糙，布满老茧。你看着那只手，知道握住它，就握住了另一条通往真相的线。"
],
options:[
{t:"握住他的手，结成同盟", go:"pol_qinte_ally2"},
{t:"先回去想想", go:"pol_faction_map2"}
]
}};

N["pol_qinte_ally2"]=function(){return{
place:"学院·旧训练场",
text:[
"你握住昆特的手。他的力道很重，像要把什么承诺捏进骨头里。",
"「谢谢你。」他松开手，声音有些哑，「我女儿的事，不急在这一时——圣光每年学期末才放人回来探亲，那时候是唯一的接人机会。还有四个月，够我们准备。」",
"他从怀里掏出一卷羊皮纸递给你：「这是我三年传给圣光的文件清单。每一份，我都抄了底。你看看——他们会从学院拿走什么，你就知道他们想要什么。」",
"你展开羊皮纸，逐行看下去：课程表、教授名单、学生名册、实验室登记……最后一行，让你的目光顿住：",
"「地下三层，封印状态观察记录。」",
"地下三层。你抬头看昆特：「你传过学院地下层的记录？」",
"昆特点头：「圣光点名要的。我不知道地下三层有什么，但每次传这份记录，他们给的报酬最高——三千金币。」",
"你攥着羊皮纸，指节发白。三千金币——为了观察一份「封印状态」。圣光要的，正是那枚第七印碎片。"
],
options:[
{t:"把羊皮纸给埃德蒙看", go:"pol_report_edmund"},
{t:"自己去地下三层看看", go:"pol_deepest_secret"}
]
}};

N["pol_signal_report"]=function(){return{
place:"学院·西塔楼",
text:[
"你把你看到的暗号告诉埃德蒙——克莱门特与院长握手时，指尖在院长掌心划了两下。",
"埃德蒙听完，脸色沉下来：「那不是暗号，是手语。守望者内部有一套联络手语——克莱门特划的那两下，意思是『确认目标，准备行动』。」",
"「行动？什么行动？」",
"「目标。」他看向你，「学院里，有人被圣光盯上了。克莱门特这次来，表面是学术交流，实际是来『确认』那个人——确认他的身份、位置、和学院的关系。」",
"「那个人是谁？」你问。",
"埃德蒙没有直接回答，而是说：「你最近查账、进塔楼、混禁书区——在圣光眼里，你已经是学院里『活动最频繁』的学生之一。克莱门特来之前，名单上第一个名字，可能就是你。」",
"窗外，交流团的马车还停在广场上。你看着那些白袍的身影，忽然觉得，他们看你的每一眼，都带着测度。"
],
options:[
{t:"问埃德蒙怎么应对", go:"pol_deal_observer"},
{t:"主动接触克莱门特，试探他", go:"pol_touch_observer"}
]
}};

N["pol_touch_observer"]=function(){return{
place:"学院·学术报告厅",
text:[
"第二天，圣光交流团在报告厅举办学术讲座。你特意坐在第一排，等讲座结束后，你上前向克莱门特主教请教问题。",
"他笑着听完你的问题，回答得耐心而详尽——像一个真正的学者。你注意到，他说话时右手食指不自觉地摩挲着左手腕，那里戴着一串银链，链坠是一枚十字星。",
"「主教阁下，」你试探地问，「听说圣光神学院也研究古代封印术？」",
"他的动作顿了一下，随即笑容不变：「略有涉猎。怎么，你对封印术感兴趣？」",
"「我听说学院地下有间旧实验室，墙上有古代符文——不知道圣光的学者有没有兴趣去看看？」你盯着他的眼睛。",
"克莱门特的笑容没有变化，但你注意到，他摩挲银链的手指，停了。片刻后，他说：「古代符文？那倒是值得一看。不过——」他微微倾身，压低声音，「地下的事，最好让地下的人去管。地上的学生，还是多看看地上的风景比较好。」",
"他说完，直起身，恢复了温和的笑容：「感谢你的提问，同学。愿圣光照亮你的前路。」",
"你看着他的背影消失在走廊尽头，心里已经有了答案：克莱门特知道地下的事。他这次来，不只是交流——他是来踩点的。"
],
options:[
{t:"把试探结果告诉埃德蒙", go:"pol_signal_report"},
{t:"严密监视交流团动向", go:"pol_observer_pattern"}
]
}};

N["pol_observer_pattern"]=function(){return{
place:"学院·交流团驻地外",
text:[
"你开始记录交流团的日常动线。三天下来，你发现规律：每天清晨，赫尔曼（图书管理员）都会独自去图书馆地下一次；每三天，克莱门特会去一趟院长办公室，停留约半个时辰；而每次克莱门特从院长办公室出来，赫尔曼第二天去地下室的次数，就会多一次。",
"你把这个规律画成图表：克莱门特→院长→（密谈）→赫尔曼→地下。",
"这是一条完整的传递链。院长把学院的底交出去，赫尔曼负责勘查，克莱门特负责决策。而链条的终点，是图书馆地下——你曾经在那里撞见过昆特交易的地方。",
"你合上笔记本，心里越来越清楚：圣光交流团不是来交流的，是来接管这条线的。昆特的暗线、西海岸的资金、地下三层的封印——圣光想一次性地，全部收进手里。",
"你抬头看向驻地，窗后似乎有一双眼睛也在看着你。你低下头，装作看书的模样，快步离开。"
],
options:[
{t:"把观察报告交给埃德蒙", go:"pol_urgent_report"},
{t:"继续蹲守，抓现行", go:"pol_library_b2"}
]
}};

N["pol_urgent_report"]=function(){return{
place:"学院·西塔楼",
text:[
"你把克莱门特要拿手令的事报告埃德蒙。他听完，脸色骤变：「他们要手令——禁书区第三层的手令。那里放着一份手稿，记录了历届『观察员』的名单。」",
"「如果观察员拿到手稿——」",
"「他就知道哪些学生被送去了哪里，生死如何。」埃德蒙打断你，「那份名单一旦落到圣光手里，学院就彻底被拿捏了——他们可以拿名单上的每一个人，威胁学院做任何事。」",
"他站起身，在房间里踱了几步：「教务长说了『今晚之前』。也就是说，最迟今晚，手令就会送到克莱门特手上。我们必须赶在他们之前，把真本转移。」",
"「手稿真本在哪？」你问。",
"「禁书区三层，书架背面。」他看着你，「你有钥匙能进禁书区——但克莱门特的人可能已经守在门口了。这一趟，会很危险。」",
"窗外，暮色渐沉。钟楼敲响五下，离「今晚」还有两个时辰。"
],
options:[
{t:"立刻出发，抢在他们前面", go:"pol_grab_manuscript"},
{t:"找灰翎一起行动", go:"pol_gray_girl2"}
]
}};

N["pol_tear_manuscript"]=function(){return{
place:"学院·禁书区",
text:[
"你飞快地翻动手稿，撕下最后几页——那是名单的结尾部分，记录着近三年『观察员』的去向。你把撕下的纸页塞进怀里，把剩余的手稿放回书架。",
"克莱门特缓步走过来，拿起手稿，掂了掂：「分量不对。」他翻开手稿，目光在结尾处停住——那里有明显的撕痕。",
"他抬起头，看着你，笑容温和但眼神冰冷：「聪明的孩子。但你撕走的，是最近三年的记录——那正是我最需要的部分。」",
"他抬起法杖，杖尖亮起：「交出来，我可以当今晚的事是个小小的误会。」",
"你后退一步，手心里全是汗。书架间的阴影里，你瞥见一个灰色身影一闪而过——是灰翎，她朝你比了个手势：往左跑。",
"你猛地转身，撞向左边书架——哗啦一声，成排的书倒下来，扬起漫天灰尘。克莱门特挥杖挡开飞来的书，趁这一瞬，你冲进灰尘里，消失在他的视线中。"
],
options:[
{t:"从侧门逃出禁书区", go:"pol_after_chase"},
{t:"躲进书架夹层", go:"pol_hide_shelf"}
]
}};

N["pol_hide_shelf"]=function(){return{
place:"学院·禁书区",
text:[
"你闪身钻进书架夹层，紧贴墙壁，屏住呼吸。灰尘呛得喉咙发痒，你捂住嘴，不敢咳出声。",
"克莱门特的脚步声由远及近，在夹层外停住。你听见他低声说：「小家伙，跑得挺快。」然后是一阵窸窣声——他在施法搜索。",
"一道冰冷的气息贴着书架掠过，像一条无形的蛇，在你藏身处附近逡巡。你的心提到了嗓子眼。",
"气息扫过你藏身的位置时，忽然停住。你的心脏几乎停止跳动——",
"就在这时，禁书区另一头传来一声巨响——像是书架倒塌的声音。克莱门特的气息猛地收回，脚步声迅速朝声音来源方向追去。",
"你趁机从夹层钻出，贴着墙根，飞快地溜向侧门。门缝里透进月光——你推开一条缝，钻了出去，夜风扑面，你大口喘着气。",
"远处，禁书区里传来克莱门特的声音：「声东击西？有意思。」你来不及细想是谁帮你引开了他——是灰翎，还是别的什么人。你攥紧怀里的残页，消失在夜色中。"
],
options:[
{t:"回塔楼整理残页", go:"pol_report_aftermath"},
{t:"去找灰翎确认", go:"pol_gray_aftermath"}
]
}};

N["pol_escape_trap"]=function(){return{
place:"学院·禁书区",
text:[
"你退后一步，手掌猛地按在书架侧面——那里有一处松动的符文节点，是你之前观察到的结界薄弱点。",
"「你确定要这样吗？」你盯着克莱门特，「这里的结界要是破了，整个禁书区的封印都会失控——你拿到的，就不只是手稿，还有满楼乱窜的禁书。」",
"克莱门特的杖尖顿住了。他显然没料到你会拿结界威胁他。",
"「有意思。」他收起法杖，笑容重新挂回脸上，「你在威胁一个圣光主教。」",
"「我只是陈述事实。」你松开手，退向门口，「手稿你可以拿走——抄本而已，真本早就不在这层书架上了。」",
"克莱门特的表情终于有了一丝波动：「抄本？」他拿起手稿，翻了两页，脸色微变——纸页上的字迹洇开，像是被什么处理过，内容模糊难辨。",
"「谁换的？」他问，声音第一次有了温度。",
"「你猜。」你退到门口，转身就跑。身后没有追来的脚步声——克莱门特站在原地，盯着那卷被做过手脚的抄本，神色阴晴不定。"
],
options:[
{t:"逃出禁书区，去找灰翎", go:"pol_gray_aftermath"},
{t:"回塔楼向埃德蒙报告", go:"pol_report_aftermath"}
]
}};

N["pol_verify_edmund"]=function(){return{
place:"学院·教务处档案室",
text:[
"你决定自己查证埃德蒙的底细。借着整理档案的名义，你翻遍了教务处的人事记录，把埃德蒙·西格的履历逐条核对。",
"履历本身没有问题：入学、毕业、留校任职，每一步都合情合理。但你注意到一个细节——埃德蒙入职教务处的日期，和他从炼金系「毕业」的日期，只隔了三天。",
"三天。正常留校任职，至少要等一个学期。除非——有人专门为他安排了这份差事。",
"你顺着这个线索查下去，在当年的校务会议记录里找到一行字：「教务助理一职，经院长特批，即时到任。」签字人：院长。",
"院长特批。一个刚毕业的学生，凭什么让院长特批？",
"你合上档案，心里的疑云越来越重。你想起马修的话：「他曾经，也是这牌局上的一枚棋子。」埃德蒙入职教务处的那个学期——正是西海岸贸易协会第一次向学院捐款的学期。",
"时间对得上。你握紧档案夹，指尖发凉。"
],
options:[
{t:"直接试探埃德蒙", go:"pol_test_edmund"},
{t:"先按兵不动，继续观察", go:"pol_faction_map2"}
]
}};

N["pol_test_edmund"]=function(){return{
place:"学院·副院长办公室",
text:[
"你敲开埃德蒙的办公室，说要请教一个学术问题。他放下手中的文件，笑着示意你坐下。",
"你坐下，没有问学术问题，而是直接说：「副院长，我想请教——您当年是怎么进教务处的？听说还是院长特批的。」",
"埃德蒙的笑容没有变化，但他整理文件的动作，顿了一瞬：「陈年旧事了。那时候教务处缺人，院长看我成绩不错，就特批了。」",
"「那您知道——当年西海岸贸易协会，第一次向学院捐款，经办人是谁吗？」你盯着他的眼睛。",
"办公室里安静了几秒。埃德蒙放下文件，抬起头，脸上的笑容淡了几分：「你查到那里了。」",
"他没有否认，也没有辩解。他只是看着你，说：「那笔钱，是我经手的。我入职教务处，也是有人安排的——安排我进来，盯着那笔钱的流向。」",
"「谁安排的？」你问。",
"他沉默了很久，才开口：「守望者。二十年前，我就是守望者的眼线——安插在学院里，盯着那笔钱。只是没想到，这一盯，就是二十年。」",
"窗外，钟楼敲响。他苦笑一声：「现在你知道了。想告发我，还是想——跟我一起，把这条线查到底？」"
],
options:[
{t:"选择相信他，合作", go:"pol_choice_partner"},
{t:"保持距离，自己单干", go:"pol_choice_solo"}
]
}};

N["pol_math_book2"]=function(){return{
place:"学院·旧食堂后厨",
text:[
"你再次找到马修。他正在剁菜，菜刀在砧板上笃笃作响，头也不抬：「又来了？这次想问什么？」",
"你问了埃德蒙的履历。他放下菜刀，擦擦手：「履历是真的，但履历之外的事，才是关键。」他压低声音，「埃德蒙入职教务处的第一年，西海岸贸易协会就改了章程——新增了一个『学术顾问』职位，挂名者正是埃德蒙·西格。」",
"「他一边当学院教务处助理，一边给贸易协会当顾问？」",
"「听起来像吃两家饭，对吧？」马修擦了擦砧板，「但有意思的是——那个『顾问』职位，埃德蒙每年只领一枚金币的顾问费。一枚金币。你觉得，一个贸易协会，会花一枚金币请一个副院长当顾问吗？」",
"「不会。」你下意识说。",
"「所以，那一枚金币不是报酬，是信物。」马修把菜刀插回刀架，「证明埃德蒙和贸易协会，始终有一根线连着。至于这根线是栓着他，还是他攥着——那就只有他自己知道了。」",
"你走出后厨时，天已经黑了。食堂的灯光从身后透出来，把影子拉得很长。"
],
options:[
{t:"把发现告诉埃德蒙，看他反应", go:"pol_test_edmund"},
{t:"自己继续查贸易协会", go:"pol_third_party"}
]
}};

N["pol_ask_T"]=function(){return{
place:"学院·西塔楼",
text:[
"你直接上了塔楼，把便条拍在埃德蒙桌上：「T是谁？」",
"埃德蒙低头看了一眼便条，没有惊讶，甚至像是等了很久：「你查到了。」他拿起便条，指尖拂过那个「T」字，「T，是守望者内部对『学院观察员』的代号。每一任驻学院联络人，都会收到这样一张便条——通知他，学院这条线，由『T』总负责。」",
"「你是T？」",
"「不。」他摇头，「我只是传话人。真正的T，在守望者高层——一个我不认识、没见过、只知道代号的人。二十年来，我只收到过三张这样的便条，每一张的笔迹都不一样。」",
"「那这个人——」",
"「他在暗处。」埃德蒙把便条还给你，「我怀疑，T不止一个。T可能是组织里专门负责学院事务的小组代号——他们轮流署名，让你永远查不到同一个人。」",
"你盯着那个「T」字，忽然明白了什么：「如果T是一个小组——那老鸦失踪前查的『T』，也许不是一个人，而是一条线。一条贯穿守望者高层的线。」",
"埃德蒙没有回答，但他沉默的样子，像是默认了你的猜测。"
],
options:[
{t:"追问T小组的成员", go:"pol_edmund_past"},
{t:"不再深究，专注手头的事", go:"pol_faction_map2"}
]
}};

N["pol_report_edmund2"]=function(){return{
place:"学院·西塔楼",
text:[
"你回到塔楼，把老鸦的事告诉埃德蒙。他听完，脸上看不出什么表情，但握着茶杯的手指，微微收紧了。",
"「老鸦……」他念了一遍这个名字，声音很低，「他失踪前，最后见的人是我。那天晚上，他说他查到了『T』的线索，要亲自去验证。第二天，他就没来上班。」",
"「他查到了什么？」你问。",
"「他说，T可能不是一个人。」埃德蒙放下茶杯，「他说他怀疑，T是一个代号，一个在守望者内部传承了二十年的代号——而每一任持有这个代号的人，都失踪了。」",
"「你信吗？」",
"埃德蒙沉默了很久，说：「我不信，但我查不了。因为查T，就是查组织内部——我一旦动，组织就会怀疑我。」他看向你，「所以这些年，我一直希望有一个人，能代替我去查。」",
"他顿了顿：「你，或许就是那个人。」",
"窗外，风把烛火吹得摇晃。你听着他的话，忽然觉得，肩膀上有什么东西，沉了下来。"
],
options:[
{t:"接下这个调查任务", go:"pol_choice_solo"},
{t:"婉拒，专注学院学业", go:"pol_hub"}
]
}};

N["pol_hide_box"]=function(){return{
place:"学院·旧宿舍楼地下室",
text:[
"你迅速把铁盒塞回怀里，故作镇定：「副院长？您怎么在这儿——我来找点旧教材，听说这里存了一批。」",
"埃德蒙站在门口，背着光，看不清表情：「旧教材在二楼，一楼是杂物间，没什么教材。」",
"空气安静了两秒。你正要找话搪塞，他先开口了：「你怀里，是铁盒吧。老鸦的东西。」",
"你僵住了。他叹了口气：「那盒子，是我三年前放的。我知道有一天会有人找到它——只是没想到，这么快。」",
"他从门口走进来，在昏暗中站定：「盒子里是地图，对吧？图书馆正下方那个X——那是我标给你的。学院地下，最深的秘密，就在那里。」",
"你慢慢掏出铁盒，看着他：「你为什么不自己去看？」",
"「因为我不能。」他苦笑，「我在这学院里，眼睛太多。但你可以——你只是个学生，一个『好奇心重』的学生。有些路，只有学生能走。」",
"他拍拍你的肩，转身离开地下室，声音飘回来：「地图上的X，你自己决定要不要去。但去了，就没有回头路了。」"
],
options:[
{t:"按地图去图书馆地下", go:"pol_deepest_secret"},
{t:"先收好地图，从长计议", go:"pol_faction_map2"}
]
}};

N["pol_go_west"]=function(){return{
place:"学院·西塔楼",
text:["往西走的那条路，你以前没走过。", "出了学院西门，是一片荒地，再往前，是一片小树林。你听人说，树林那边，有一个废弃的磨坊。", "你走在林间小道上，脚下是落叶，踩上去沙沙地响。风从树梢间穿过，呜呜的，像有人在远处吹一支走调的笛子。", "你走了大约一顿饭的工夫，看见了那座磨坊。它确实废弃了——屋顶塌了一半，风车歪着，像一只折断的翅膀。", "你绕着磨坊走了一圈。门板是虚掩的，一推就开。里面很暗，一股霉味和灰尘的味道。你站在门口，犹豫了一下，还是走了进去。", "你决定带着线索去西海岸找老鸦。埃德蒙听完，没有劝阻，只是从柜子里取出一封信：「把这封信交给老鸦。他会明白的。」", "「这信里写了什么？」你问。", "「二十年的账。」他说，「学院这条线，我守了二十年。该交代的，都写在里面了。」他把信递给你时，手指微微用力，「老鸦如果还活着，他会接应你；如果他——不在了，你就把信烧掉，别让任何人看到。」", "你接过信，信纸不厚，但摸着沉甸甸的。", "「路上小心。」他最后说，「学院政治这潭水，你蹚到了底，就别再回头看了。西海岸那边，有另一潭水，等你。」", "你走出塔楼时，天快亮了。晨光熹微，你回头看了一眼那座灰塔，窗后的身影还立在那里，像一棵守了二十年的老树。", "磨坊里很空。地上散着几捆发霉的稻草，墙角有一架破旧的梯子，通向塌了一半的二楼。", "你走到梯子跟前，正要往上爬，忽然停住了——梯子旁边的地上，有一串脚印。脚印很新，不是你的。", "你蹲下来看了看。脚印的鞋底纹路很特别，不是普通的鞋子——是军靴。你站起来，四周看了看，什么都没有。", "你爬上二楼。二楼更暗，只有一角漏着光。光柱里，灰尘浮动着。你看见墙角放着一个木箱，箱子上没有锁，盖子微微开着一条缝。", "你走过去，打开箱子——里面是空的。可箱子底上，有一道很深的划痕，像是有人用刀，在木头上刻了一个符号。", "你不认识那个符号。可你把它记住了。你合上箱子，下楼，走出磨坊。外面的阳光照得你眯起眼。你回头看了一眼——磨坊还是那副破败的样子，像什么都没有发生过。"] /*v45inj:pol_go_west*/,
options:[
{t:"动身前往西海岸", go:"pol_leave_academy"},
{t:"先做准备，择日出发", go:"pol_rest_politics"}
]
}};

N["pol_after_org"]=function(){return{
place:"学院·学生会活动室",
text:[
"灰翎转学后的日子，学院平静得让人不习惯。你照常上课、照常生活，偶尔路过占星塔，天台上空无一人，星图被风翻动。",
"你交出去的那份报告，没有激起任何波澜——守望者高层接手后，一切都悄无声息。你不知道他们在查什么，查到了什么。你只知道，灰翎的「转学」，是你亲手交出的报告换来的。",
"夜里，你偶尔会想起她说的最后一句话：「你交出去的报告里，没有她的名字——这是你唯一能为她做的事。」",
"你有时会想：如果当时选择自己查下去，结局会不会不同？但没有答案。选择就是选择，落子无悔。",
"学期末，你收到一封没有署名的信，地址是西海岸。信里只有一句话：",
"「我很好。星图这边也能看。— 翎」",
"你把信收进抽屉，和那枚银羽毛徽章放在一起。窗外，占星塔的尖顶在暮色里静静矗立。你忽然觉得，这座学院虽然安静了，但有些东西，从未真正平息。"
],
options:[
{t:"继续学业，向前看", go:"pol_hub"}
]
}};

N["pol_stop_here"]=function(){return{
place:"学院·西塔楼",
text:[
"你合上老鸦的日记，摇了摇头：「到此为止吧。我知道得够多了，再往下，我怕我守不住。」",
"埃德蒙没有强求，甚至像是松了口气：「也好。知道秘密的人越少，秘密越安全。」他走到窗边，把窗台上的盆栽轻轻转了个方向，「你能走到这里，又主动停下——这本身，就是一种守护。」",
"「什么意思？」",
"「意思是，」他回过头，目光平静，「不是所有知道秘密的人都会保守秘密。但选择不看的人，往往比发誓保密的人，更值得信任。」",
"你走出塔楼时，月色正好。你回头看了一眼——灰塔在月光下安静地矗立着，像一个沉默的守夜人。",
"从那以后，你再也没有走进塔楼顶层。每当路过，你只是放慢脚步，听一听风里的声音。有些秘密，你知道它在，就够了。",
"日子一天天过去。学院的生活照常继续：上课、考试、和同学拌嘴、在食堂抢最后的红烧肉。偶尔夜深人静，你会想起塔楼里的烛光、青铜门后的石棺、还有那枚没有接下的银羽毛徽章。",
"你把它当作一段梦。只是偶尔，梦里会有封印流转的声音，轻轻地响着。"
],
options:[
{t:"回归学院生活", go:"pol_hub"}
]
}};

N["pol_forge_report"]=function(){return{
place:"学院·西塔楼",
text:[
"你把磐石铸造坊的发现报告埃德蒙。他听完，眉头紧锁：「磐石铸造坊——这个名字，我在老鸦传回来的情报里见过。他提到过，西海岸贸易协会有一笔固定支出，流向一家『磐石』相关的机构。」",
"「老鸦查到那是什么了吗？」你问。",
"埃德蒙摇头：「他只查到一半——磐石名义上是铸造坊，实际是第三方资金的『清洗站』。钱从西海岸来，经磐石中转，再流向——」他顿了顿，「流向地下。」",
"「地下？」",
"「老鸦的最后一封情报，只写了四个字：『钱养地下』。然后就断了。」埃德蒙走到窗边，望着夜色里的学院，「结合你查到的情况——昆特、教务长、铸造坊、仓库——这条线，很可能通向学院地下那个『不能说的东西』。」",
"「我们要去查吗？」你问。",
"埃德蒙沉默片刻：「要。但要小心——我们可能是这二十年来，离真相最近的一批人。最近，也最危险。」",
"窗外，风穿过灰塔，发出呜咽般的声音。"
],
options:[
{t:"去仓库查个究竟", go:"pol_warehouse"},
{t:"先稳住，等老鸦的下一步情报", go:"pol_faction_map2"}
]
}};



// ============================================================
// v39 方向二：地下城与BOSS战（6副本+枢纽，42节点）
// ============================================================

// v39 方向二：BOSS敌人定义
Object.assign(ENEMIES, {
"dun_books_boss": {"cn":"墨噬","realm":2,"power":42,"hp":60,"atk":9,"def":5,"skills":["墨浪","字缚","旧页噬咬"],"loot":{"gold":40,"xp":60,"mat":"禁书残页"},"desc":"由禁书区积攒百年的墨气凝聚而成的怪物，通体漆黑，行动时像翻动的书页。"},
"dun_ruins_boss": {"cn":"石魇","realm":2,"power":45,"hp":70,"atk":10,"def":7,"skills":["岩崩","地陷","石化凝视"],"loot":{"gold":45,"xp":65,"mat":"遗迹符文石"},"desc":"地下遗迹的守护者，人身石肤，眼窝里燃烧着暗红色的火。它已经在这里站了不知道多少年。"},
"dun_tower_boss": {"cn":"魂缚者","realm":2,"power":48,"hp":65,"atk":11,"def":4,"skills":["摄魂","怨灵缠绕","灵魂鞭笞"],"loot":{"gold":50,"xp":70,"mat":"灵魂碎片"},"desc":"灵魂魔法塔的看守，曾经是这里的法师，如今只剩下半张人脸和满身的怨魂。"},
"dun_mine_boss": {"cn":"熔岩之心","realm":2,"power":50,"hp":80,"atk":12,"def":6,"skills":["熔岩喷发","热浪","地火缠身"],"loot":{"gold":55,"xp":75,"mat":"火曜矿晶"},"desc":"矿洞深处的古老存在，形如熔岩凝成的巨人，胸口的心脏每一次跳动，都让矿壁震颤。"},
"dun_arena_boss": {"cn":"战魂守卫","realm":3,"power":58,"hp":90,"atk":13,"def":8,"skills":["战神之怒","碎甲击","战吼"],"loot":{"gold":65,"xp":90,"mat":"战魂印记"},"desc":"试炼场历代战死者的英魂凝聚体，披着锈迹斑斑的铠甲，持一柄断刃长枪，沉默如铁。"},
"dun_tree_boss": {"cn":"腐根精","realm":3,"power":55,"hp":85,"atk":12,"def":7,"skills":["根须绞杀","腐液喷射","枯木毒雾"],"loot":{"gold":60,"xp":85,"mat":"枯荣之核"},"desc":"世界树根系深处孕育的扭曲生命，树皮般的皮肤下蠕动着暗色的根须，散发着腐朽与生机交织的气息。"}
});

N["dungeon_intro"]=function(){return{
place:"学院·地下入口",
text:[
"地下城——学院最深的秘密之一。历代学生口口相传，在学院地底，埋藏着古代遗迹、禁忌实验室、还有被封印的东西。",
"据说入口有三处：图书馆地下室的铁门、旧食堂后厨的储物间暗门、以及西塔楼地基下那道被石砖封死的拱门。每一处都被学院列为禁区，但——禁区之所以是禁区，从来不是因为危险，而是因为藏着不想让人看见的东西。",
"你在图书馆地下室那扇铁门前站定。门上挂着「维修中」的牌子，锁是新的，但锁孔边缘有新鲜的划痕——最近有人开过它。",
"你掏出埃德蒙给的旧钥匙，在锁孔前比了比。钥匙齿对得上——这把钥匙，本来就能开这扇门。",
"你深吸一口气，转动钥匙。咔哒一声，门开了。门后是一条向下的石阶，潮气扑面而来，带着泥土和古老石料的气味。",
"你站在门口，身后是灯火通明的学院，身前是漆黑幽深的地下。夜风从门缝灌进来，吹得你后颈发凉。"
],
options:[
{t:"进入地下，探索禁书区三层", go:"dun_books_enter"},
{t:"先关上门，改天再来", go:"pol_hub"}
]
}};

N["dungeon_hub"]=function(){return{
place:"学院·地下城入口",
text:[
"地下城的入口像一个沉默的咽喉。你站在这里，能听见头顶学院里隐隐约约的钟声、脚步声、笑声——那是地上世界的声音，已经和你隔了一层石阶。",
"你摊开地图，在你已知的地下区域上标注：图书馆正下方的禁书区三层、更深处的地下遗迹、灵魂魔法塔的残骸、矿洞的废弃入口。每一处都像一个未拆封的秘密。",
"地下探索的规矩，是前辈们用命换来的：一，永远别独自深入不熟悉的地方；二，遇到刻着符文的门，先确认封印是否完好；三——如果在最深处听见心跳声，立刻回头，别好奇那是谁的。",
"你收起地图，握紧手中的武器。地下城不会因为你是学生就手下留情。但你既然站在这里——就已经做好了准备。"
],
options:[
{t:"探索禁书区三层", go:"dun_books_enter"},
{t:"探索地下遗迹", go:"dun_ruins_enter"},
{t:"探索灵魂魔法塔残骸", go:"dun_tower_enter"},
{t:"探索废弃矿洞", go:"dun_mine_enter"},
{t:"探索兽人试炼场", go:"dun_arena_enter"},
{t:"探索世界树根系", go:"dun_tree_enter"},
{t:"返回地面", go:"pol_hub"}
]
}};

N["dun_books_enter"]=function(){return{
place:"学院·禁书区三层",
text:[
"禁书区三层，是学院图书馆最深处——连图书管理员都很少下来的地方。楼梯尽头是扇青铜门，门上的符文已经黯淡，但依然残留着封印的余威。",
"你推开门，一股旧纸和墨水的气味扑面而来。三层比想象中大得多——书架一望无际，层层叠叠，像一座用书砌成的迷宫。烛火在墙壁上跳跃，照亮那些布满灰尘的书脊。",
"你走进去，脚步声在空旷中回荡。书架上，有些书脊上的名字让你心头一跳：《深渊低语集》《封印破裂纪事》《第七印考》……",
"这里的每一本书，都是学院的禁忌。而你脚下，正是那个「不该存在」的地方。",
"忽然，你听见一声极轻的响动——像书页被翻动的声音。你猛地转身，身后只有一排放满书的书架。没有风。没有老鼠。那声音，像是书自己在翻。"
],
options:[
{t:"朝声音来源走去", go:"dun_books_1"},
{t:"先查看《第七印考》", go:"dun_books_2"}
]
}};

N["dun_books_1"]=function(){return{
place:"学院·禁书区三层",
text:["你没有退。你盯着那本书，问：「你是谁？」", "书页上的字，慢慢重新排列：「我是这本书。我是这层书架。我是——你们说的『禁书』。」", "「禁书也会说话？」你问。", "「禁的不是书。」那行字顿了顿，又写道，「禁的是，书里藏着的东西。」", "书页翻回第一页。你看见扉页上，用极小的字写着一行批注：「此书可读，不可信。若它开始跟你说话——合上它，离开。」", "你看着那行批注，又看了看正在等待的书页。你忽然觉得，这层书架，比整座学院都深。", "你循着翻书声走向书架深处。越走越深，烛火渐渐稀疏，黑暗如潮水般涌来。翻书声越来越近——终于，你在最里层的一架书架前停住。", "声音消失了。你站定，屏住呼吸，仔细听——寂静中，你听见极细微的沙沙声，像有东西在纸张之间游动。", "你伸手抽出一本书。书页哗啦一声翻开——不是风吹的，书页自己翻动着，像有什么东西在书页间挣扎。你低头看，书页上的文字正在蠕动、重组，拼成一行新字：", "「你来了。我等你等了六十年。」", "你手一抖，书差点脱手。书架深处，黑暗中传来一声低沉的叹息——像书海深处，有什么东西醒了。", "你没有合上书。你把那本书翻到最后一页，看见一行字：「你做了一个选择。我会记住的。」", "你合上书，把它放回书架。可你知道，那行字没有消失——它只是藏起来了，藏在这层书架深处的某个地方，等着你。", "你退出书架区。翻书声在你身后响起——很轻，很规律，像书海深处，有谁在继续翻着下一页。", "你走出禁书区，阳光照在脸上。你忽然觉得，刚才那几分钟，你好像走过了很长很长的一段路。", "你没有回头看。可你知道，那层书架，会在某个夜里，等你再来。"] /*v45inj:dun_books_1*/,
options:[
{t:"质问它是谁", go:"dun_books_3"},
{t:"立刻后退，离开这片书架", go:"dun_books_flee"}
]
}};

N["dun_books_2"]=function(){return{
place:"学院·禁书区三层",
text:[
"你找到那本《第七印考》。书皮是暗红色的，没有书名标题，只有烫金的第七印图案——七道锁链环绕一颗心脏。",
"你翻开书页。泛黄的纸页上，记载着第七印的来历：百余年前，深渊力量在一处遗迹凝聚成「第七印碎片」，被守望者带回大陆，藏于一处「与知识为邻」的地方——字里行间，指的正是学院。",
"「与知识为邻」……你抬头环顾四周。这座禁书区，正是学院里「知识」最浓的地方。而第七印碎片，就藏在某面书架之后。",
"你正要继续读下去，书页忽然发烫。你低头——书页上的文字正在融化，像被火灼烧，重组为一行潦草的字：",
"「找它的人很多。你是第一个读到这一页，还能活着合上书的人。」",
"书页上的字迹缓缓淡去，像什么都没发生过。但你握着书的手，还残留着灼烫感。"
],
options:[
{t:"继续翻找第七印的线索", go:"dun_books_3"},
{t:"把书放回原处，小心为上", go:"dun_books_flee"}
]
}};

N["dun_books_3"]=function(){return{
place:"学院·禁书区三层",
text:[
"你硬着头皮，朝书架深处走。黑暗越来越浓，烛火已经照不亮脚下的路。你点燃一支火折子，微光在书脊上游走。",
"忽然，你脚下的地板震颤了一下。书架上的书哗啦啦地响——不是一本，是整排整排的书同时颤动，书页翻动的声音汇成一片，像成千上万只翅膀在扑腾。",
"黑暗中，一团墨黑色的东西从书架尽头涌出来——它没有固定形状，像无数书页叠成的漩涡，中间隐约有一张苍白的脸，没有五官，只有一张嘴，缓缓张开。",
"「读了不该读的书，就要付出代价。」一个沙哑的声音从它体内传来，像无数纸张摩擦的声响，「你，准备好还债了吗？」",
"墨浪翻涌，向你扑来。你拔出武器——书架之间，一场恶战避无可避。"
],
options:[
{t:"迎战墨噬！", run:function(){ startCombat("dun_books_boss","墨噬","dun_books_treasure"); }},
{t:"想办法逃出去", go:"dun_books_flee"}
]
}};

N["dun_books_boss_go"]=function(){return{
place:"学院·禁书区三层",
text:[
"墨浪扑到面前，你挥出武器——一场恶战在书架间展开。",
"墨噬的战斗方式诡异：它没有实体，攻击会从意想不到的角度袭来。你必须在翻涌的墨浪中找到它的核心，才能击败它。"
],
options:[
{t:"继续战斗", go:"dun_books_boss"}
]
}};

N["dun_books_boss"]=function(){return{
place:"学院·禁书区三层",
text:[
"你与墨噬缠斗。墨浪如潮，书架在冲击下摇摇欲坠。你抓住一个空隙，一剑刺向墨浪中央那张苍白的脸——",
"「嗷——！」墨噬发出刺耳的尖叫，墨浪猛地收缩，又猛地炸开。你被冲击波掀飞，撞在书架上，书页如雪片般落下。",
"墨噬的形态开始不稳定，那张苍白的脸扭曲着：「你——不是来偷书的——你是谁？！」",
"你爬起来，擦掉嘴角的血：「我是来搞清楚，这里到底藏了什么的。」",
"墨噬沉默了一瞬，忽然发出一声像是笑声的声响：「六十年了，你是第一个不是为了书而来的人。好——那我告诉你：书后那面墙，藏着你想要的东西。但你要先——活下来！」",
"它再次扑来，这次更快、更猛。书架在震颤，书页在狂舞，一场真正的死战，才刚刚开始。"
],
options:[
{t:"全力以赴，击败墨噬！", run:function(){ startCombat("dun_books_boss","禁书化身·墨噬","dun_books_treasure"); }}
]
}};

N["dun_books_treasure"]=function(){return{
place:"学院·禁书区三层·密墙",
text:[
"墨噬终于消散。它溃散时，化作了漫天飞舞的书页，最后汇聚成一卷旧书卷，落在地上——没有烧焦，没有破损，就像它只是把积攒的力量还给了纸张。",
"你捡起那卷书卷。展开——是一幅地图，标注着学院地下的全貌：禁书区、遗迹、矿洞、灵魂塔……还有一处你没有见过的标记：一个骷髅，压在「第七印碎片」的位置上。",
"书卷最后一页，写着一行字：",
"「封印在松动。找齐四件材料：火曜矿晶、灵魂碎片、枯荣之核、战魂印记。然后——去世界树根系，那里有重铸的办法。」",
"你把书卷收进怀里。书架的震颤已经停止，禁书区恢复了死一般的寂静。但你知道，你在这里得到的，不只是地图——你知道了这座学院地下真正藏着的东西。",
"你转身离开时，身后传来一声极轻的叹息。像一本书，终于合上了。"
],
options:[
{t:"离开禁书区，前往下一个地点", go:"dungeon_hub"},
{t:"回地面休息", go:"pol_rest_politics"}
]
}};

N["dun_books_flee"]=function(){return{
place:"学院·禁书区三层",
text:[
"你扭头就跑。身后，墨浪翻涌的声音越来越近，书架在它面前像纸糊的一样被掀开。你冲出禁书区，猛地关上门，背靠铁门大口喘气。",
"门后，墨浪撞击铁门的声音沉闷而有力。一下、两下、三下——然后，忽然停了。",
"你贴着门听了一会儿，门后一片寂静。你松开手，手心全是冷汗。",
"你低头，发现手里不知何时攥着一页书纸——是逃跑时无意间撕下的。纸页上只有一行字：",
"「它会记住你。下次见面，记得带够药。」",
"你苦笑一声，把纸页折好放进口袋。禁书区三层——你记住了这个名字。总有一天，你会再回来。"
],
options:[
{t:"回地面休息", go:"pol_rest_politics"},
{t:"从长计议，改日再探", go:"dungeon_hub"}
]
}};

N["dun_ruins_enter"]=function(){return{
place:"学院·地下遗迹入口",
text:[
"地下遗迹在学院地底更深的地方。沿着一道废弃的水道往下走，尽头是一扇半塌的石门，门楣上刻着远古的文字——你认不出，但那种笔画，和禁书区结界上的符文是同一体系。",
"你侧身挤过石门缝隙，眼前豁然开朗——一座巨大的地下殿堂，穹顶高不可测，石柱林立，柱身上刻满浮雕：人们围着一道从天而降的光柱膜拜，光柱中央，是一颗心脏的形状。",
"空气中弥漫着陈年的灰尘和一股说不清的气味——像铁锈，又像血液干涸后的腥味。你的脚步声在殿堂里回荡，空旷得让人心里发毛。",
"殿堂中央，有一方石台，台上放着一只石匣。石匣周围的地面上，画着一个复杂的法阵，符文流转着微弱的光——那光芒，和西塔楼地下密室石棺上的封印，一模一样。"
],
options:[
{t:"上前查看石匣", go:"dun_ruins_1"},
{t:"先观察法阵和浮雕", go:"dun_ruins_2"}
]
}};

N["dun_ruins_1"]=function(){return{
place:"学院·地下遗迹殿堂",
text:[
"你走近石台。石匣表面刻着七道锁链的纹样——与《第七印考》封面上的图案一致。匣盖微启，露出一条缝隙，里面透出幽幽的蓝光。",
"你伸手，指尖刚触到石匣边缘——法阵猛地亮起，嗡的一声，整个殿堂都震了一下。石柱上的浮雕仿佛活了过来，那些膜拜光柱的人像，眼睛齐齐转向你。",
"「外来者。」一个低沉的声音从殿堂深处传来，像巨石摩擦，「此处供奉之物，非汝可染指。」",
"你后退一步，手按上剑柄。殿堂深处，一尊石像缓缓动了——它一直蹲在暗处，与石柱融为一体，此刻才显出真身：人身石肤，眼窝里燃着暗红色的火。",
"石魇。你想起地下探索的规矩——遇到会动的东西，先跑，或者先打。它已经站了起来，堵在你和出口之间。"
],
options:[
{t:"与石魇战斗！", run:function(){ startCombat("dun_ruins_boss","石魇","dun_ruins_treasure"); }},
{t:"尝试说服它放行", go:"dun_ruins_3"}
]
}};

N["dun_ruins_2"]=function(){return{
place:"学院·地下遗迹殿堂",
text:[
"你蹲下来，仔细观察地上的法阵。符文排布与禁书区结界同源，但更古老——有些符号你从未见过，笔画粗犷，像是更早时代的文字。",
"你数了数：法阵一共七层，由外向内逐渐缩小，最内层刻着七个符号，对应七道锁链。其中四个符号黯淡无光，三个还在流转微光。",
"你想起西塔楼地下密室石棺上的七道封印——四道黯淡，三道明亮。与这里的法阵，分毫不差。",
"「这地方……和学院地下石棺是同一套封印系统。」你低声自语。",
"就在这时，殿堂深处的石像动了。你猛地抬头——一尊与石柱融为一体的石像正缓缓站起，眼窝里燃起暗红色的火，喉咙里发出沉闷的声响：",
"「汝既识得此阵——当知此处不可久留。走，或战。」"
],
options:[
{t:"与石魇战斗！", run:function(){ startCombat("dun_ruins_boss","石魇","dun_ruins_treasure"); }},
{t:"套问它守护什么", go:"dun_ruins_3"}
]
}};

N["dun_ruins_3"]=function(){return{
place:"学院·地下遗迹殿堂",
text:[
"你举起双手，示意没有恶意：「我无意冒犯。我只是想知道——这里供奉的是什么？为什么和学院地下那口石棺的封印一模一样？」",
"石魇沉默了片刻。殿堂里只有火苗燃烧的声音。然后，它开口，声音里多了一丝说不清的东西：",
"「此地供奉者——七印之契的拓本。百年前，封印第七印时，先贤在此刻下契文，作为重铸封印的依据。」它顿了顿，「那口石棺——学院地下那口——封着第七印的碎片。此处的契文，是唯一能重铸它的钥匙。」",
"「那西海岸的钱、圣光的争夺——都是为了这份契文？」你追问。",
"石魇没有回答，只是缓缓抬起手臂：「契文不会交给你。除非——你证明你配得上守护它。战，或走。」",
"它的眼窝里，暗红色的火燃烧得更旺了。"
],
options:[
{t:"接受挑战，与石魇一战", go:"dun_ruins_boss"},
{t:"先离开，改日再来", go:"dungeon_hub"}
]
}};

N["dun_ruins_boss"]=function(){return{
place:"学院·地下遗迹殿堂",
text:[
"你拔出武器。石魇缓缓站直，石肤上浮现出一道道符文，像沉睡的力量被唤醒。它没有武器——它的拳头，就是武器。",
"「百年来，你是第二个敢站在这里的活人。」它说，「第一个，是个灰袍的老人，自称『老鸦』。他赢了我半招，取走了一份契文拓本——然后，再没有回来过。」",
"老鸦！你心头一震——原来他也来过这里。",
"「既然你认识这个名字——」石魇的眼火闪了闪，「那我便用全力。」",
"它猛地踏地，整个殿堂都在震颤。石柱上的浮雕发出刺目的光，法阵的符文疯狂流转——石魇的身影在光芒中拔高、膨胀，像一尊真正的神像，带着千年的重量，向你压来。"
],
options:[
{t:"全力以赴，击败石魇！", run:function(){ startCombat("dun_ruins_boss","遗迹守卫·石魇","dun_ruins_treasure"); }}
]
}};

N["dun_ruins_treasure"]=function(){return{
place:"学院·地下遗迹殿堂",
text:[
"石魇轰然倒下，石肤寸寸碎裂，露出内里——一颗跳动的石心，然后石心也化作齑粉。烟尘散去后，殿堂中央的石台上，石匣自行打开，一卷泛黄的帛书漂浮起来，缓缓落进你手心。",
"帛书上，是七印之契的完整拓本——七道锁链的符文、重铸的方法、材料的配比，一应俱全。帛书末尾，有一行小字，笔迹你认得：",
"「契文已取，勿忘归途。若见后来人，替我告诉他——西海岸的风，很腥。— 鸦」",
"你握着帛书，指节微微用力。老鸦来过这里，取走了拓本，去了西海岸——然后音讯全无。你收起帛书，对着石台深深鞠了一躬。",
"殿堂恢复了寂静。你转身离开时，石台中央的石匣，缓缓合上了盖子，像一场仪式结束。"
],
options:[
{t:"带着拓本返回", go:"dungeon_hub"},
{t:"回地面整理收获", go:"pol_rest_politics"}
]
}};

N["dun_tower_enter"]=function(){return{
place:"学院·灵魂魔法塔残骸",
text:[
"灵魂魔法塔在学院西侧，早已废弃——外墙爬满藤蔓，塔顶坍塌了大半。传说这里曾是学院研究灵魂魔法的场所，后来「出了事」，整座塔被封闭，连地基都用铁链锁住。",
"你从塔底的侧门进去。门轴锈得吱呀作响，一股陈腐的气息扑面而来。塔内一片狼藉——倾倒的书架、碎裂的玻璃瓶、墙上残留的焦黑痕迹。",
"你沿着旋转楼梯往上走。越往上，空气越冷，像有什么东西吸走了温度。二层、三层……每一层都空空荡荡，只有墙上的焦痕越来越多。",
"到第四层时，你停住了。楼梯尽头，一扇半掩的门里，传出极轻的声音——像是有人在哭，又像是在唱一首断断续续的歌。",
"你推开那扇门。门后是一间圆形房间，中央站着一个身影——灰袍，兜帽低垂，背对着你。它没有动，但你听见那歌声，正是从它身上传来的。"
],
options:[
{t:"出声询问", go:"dun_tower_1"},
{t:"悄悄退出去", go:"dun_tower_flee"}
]
}};

N["dun_tower_1"]=function(){return{
place:"学院·灵魂魔法塔四层",
text:[
"「你是谁？」你的声音在房间里回荡。",
"灰袍身影的歌声停了。它缓缓转过身——兜帽下，是一张半人半雾的脸：右半边是人的面孔，苍白憔悴，左半边却是虚无，像被什么啃食掉了。",
"「我是……塔里的看守。」它的声音像是从很远的地方传来，「也是塔里唯一剩下的……活人。半个人。」",
"「这里发生了什么？」你问。",
"它沉默了很久，说：「百年前，这里的法师们研究灵魂魔法，试图触碰『生死的边界』。他们成功了——然后，他们打开了不该打开的东西。一夜之间，塔里的法师全部消失了，只剩下我——因为我在最后一刻，把灵魂分成了两半，一半留在了人的世界，一半——被拖进了那边。」",
"它抬起手，指着塔顶：「上面，还留着那个洞。他们打开的洞。六十年来，我守着它，不让更多的东西从洞里爬出来。」",
"「那你——需要帮忙吗？」你问。",
"它看着你，半张脸上浮现出一个悲伤的笑容：「帮我？孩子，你是第一个这么问的。但——那个洞，不是人力能封的。除非……」它顿了顿，「除非有人愿意，替我守一夜。」"
],
options:[
{t:"替它守夜", go:"dun_tower_2"},
{t:"问清楚守夜的危险", go:"dun_tower_3"}
]
}};

N["dun_tower_2"]=function(){return{
place:"学院·灵魂魔法塔四层",
text:["塔里的楼梯是螺旋的，越往上越窄。墙壁上每隔几级，就有一个拳头大的孔洞——风从孔洞里灌进来，发出呜咽般的声音。", "你数到一百七十二级台阶，塔顶的门出现在面前。门是铁皮的，锈得发红，门缝里透出一线光。", "你推开门。塔顶是一间小室，四面墙都是窗。风很大，把屋里的纸页吹得哗哗响。", "屋中央有一张桌子，桌上摊着一本打开的日记。你走近，看见最新一页写着：「第三年。我还在数。这座塔，每天多一级台阶。」", "你合上日记，走到窗前。塔很高，能看见整座学院的轮廓——教学楼、图书馆、钟楼、操场。你忽然发现，从这个角度看，学院的布局，像一个……符号。", "你看了很久。风把你的头发吹乱，你没有动。你知道，你看见的东西，不会有人信，可它就在那里。", "你答应了。灰袍看守让开位置，你站在它刚才站的地方——那扇门正对的，是一道通往塔顶的楼梯。", "「入夜后，它们会来。」它说，「那些从洞里爬出来的东西。它们想回洞里，但洞口有封印，它们进不去，就会来找守夜人。」", "它顿了顿：「你只要撑到天亮就行。天亮，洞口会自动闭合一天。」", "你握紧武器，点点头。看守退到墙角，像一尊雕塑，不再说话。", "夜幕降临。塔外的光线一点点暗下去，塔内完全陷入黑暗。你听见——头顶传来细微的爬行声，像是有什么东西，正从塔顶的洞口，沿着墙壁往下爬。", "你抬头。黑暗中，一双双苍白的手，从楼梯拐角处伸了出来。", "你在塔顶待了很久，直到太阳西斜。", "你把那本日记放回桌上，原样压好。你没有带走它——日记的主人，也许还会回来继续数。", "你下楼时，又数了一遍台阶。一百七十三级。和上楼时，多了一级。", "你在楼梯中间停下来，回头看了一眼。塔顶的门，关着。可你知道，那本日记的下一页，正在等着被写下。", "你走出塔，天已经暗了。钟楼的灯亮起来，昏黄的，像一只困倦的眼睛。", "你走在回宿舍的路上，忽然想：这座学院，到底有多少塔，多少楼，多少级台阶，是「每天多一级」的？"] /*v45inj:dun_tower_2*/,
options:[
{t:"迎战！", go:"dun_tower_boss"}
]
}};

N["dun_tower_3"]=function(){return{
place:"学院·灵魂魔法塔四层",
text:[
"「守夜有什么危险？」你问。",
"看守低头想了想：「它们会从洞里爬出来，寻找『活的温度』。守夜人站在这里，对它们来说，就像黑暗里的一盏灯。它们会扑过来，撕咬，拖拽——想把守夜人拖进洞里。」",
"「那你守了六十年——」",
"「我只有一半灵魂，它们拖不动。」它苦笑，「但你——你是完整的。它们会特别喜欢你。」",
"「……听起来很危险。」",
"「所以，你可以选择走。」它说，「没有人会怪你。这座塔的守夜，本就不该由活人来承担。」",
"你沉默了一会儿，然后握紧武器：「我留下。我见过太多人守着秘密到死，这一次——我想试试，替他们守一夜。」",
"看守看着你，半张脸上浮现出复杂的神情。最后它只是说：「谢谢你。孩子。」",
"夜幕降临。黑暗中，头顶传来细微的爬行声。一双双苍白的手，从楼梯拐角处伸了出来。"
],
options:[
{t:"迎战！", go:"dun_tower_boss"}
]
}};

N["dun_tower_boss"]=function(){return{
place:"学院·灵魂魔法塔",
text:[
"黑暗中的手越来越多，密密麻麻，从楼梯上、墙壁上、天花板上涌下来。它们没有实体，只有惨白的轮廓，像无数个被抽走灵魂的躯壳，本能地寻找「活的温度」。",
"你挥剑劈砍，剑刃却像划过水面，没有着力感。那些手穿过你的剑，抓向你的肩膀、手臂、衣领——冰凉刺骨，像冬夜的井水浇在身上。",
"你感觉自己的体温在流失，眼皮越来越重。一个声音在你耳边低语：「进来吧……里面暖和……里面不用再守了……」",
"你猛地咬破舌尖，腥甜味在嘴里散开，意识清醒了一瞬。你看见——黑暗深处，一个比所有手都高大的身影正在凝聚：半张人脸，半张虚无，像那个看守，又比它狰狞百倍。",
"魂缚者。塔里真正的看守者——或者说，是那个洞里爬出来的、模仿看守模样的东西。它张开双臂，向你扑来：",
"「要么进来，要么——留下！」"
],
options:[
{t:"全力以赴，击败魂缚者！", run:function(){ startCombat("dun_tower_boss","灵魂看守·魂缚者","dun_tower_treasure"); }}
]
}};

N["dun_tower_treasure"]=function(){return{
place:"学院·灵魂魔法塔顶层",
text:[
"魂缚者溃散成漫天光点。那些苍白的手也随之消融，像雪遇见朝阳。塔里重新安静下来，只有你粗重的喘息声。",
"你抬头——楼梯尽头，塔顶的洞口还在，但洞口边缘的封印，此刻泛着微光，比之前亮了一些。你的战斗，似乎为封印注入了力量。",
"你登上塔顶。洞口边，放着一只积灰的木匣。你打开——里面是一枚泛着蓝光的晶石，和一卷手札。",
"手札是那位灰袍看守留下的，字迹工整：「此石为『灵魂碎片』，可作重铸七印之契的材料。六十年来，我守着洞口，也守着它——等一个愿意替我守夜的人。」",
"你收起灵魂碎片，把手札放回原处。走出塔时，天已微亮。晨光里，塔顶的洞口像一只合拢的眼睛，封印的光，在晨光中渐渐隐去。",
"你回头看了一眼那座废弃的塔。某个瞬间，你仿佛看见塔顶的窗口，那个半张脸的看守，正朝你微微颔首。"
],
options:[
{t:"带着灵魂碎片返回", go:"dungeon_hub"},
{t:"回地面休息", go:"pol_rest_politics"}
]
}};

N["dun_tower_flee"]=function(){return{
place:"学院·灵魂魔法塔",
text:[
"你轻轻退后，准备离开。灰袍身影没有动，但那歌声又响了起来——断断续续，像是挽留，又像是告别。",
"你退到楼梯口，正要转身下楼——脚下忽然一空，你踩空了一级台阶，整个人向后仰去。你本能地抓住扶手，哗啦一声，扶手锈断，你滚下楼梯，摔在二层的地板上。",
"你爬起来，浑身疼痛，手肘擦破了皮。头顶，那歌声停了。黑暗中，仿佛有一声叹息。",
"你揉着摔疼的胳膊，决定今天不是探索灵魂塔的好日子。你拍拍身上的灰，从侧门退了出去。",
"走出塔时，日头正好。你回头看了一眼那座废塔——它安静地矗立着，像什么都没发生过。但你手肘的擦伤，还在隐隐作痛，提醒你刚才那一步，踩空得不寻常。"
],
options:[
{t:"回地面休息", go:"pol_rest_politics"},
{t:"改日再探灵魂塔", go:"dungeon_hub"}
]
}};

N["dun_mine_enter"]=function(){return{
place:"学院·废弃矿洞入口",
text:[
"学院东北角的废弃矿洞，早已被铁栅栏封死，挂着一块「坍塌危险」的木牌。但你打听到，前几年还有学生偷偷进去淘过「旧矿晶」，出来时一个个都发了笔小财——然后没几个月，都转学了。",
"你撬开铁栅栏的锁，弯腰钻进矿洞。洞内比想象中宽阔，墙壁上残留着矿工的凿痕，轨道上还停着一辆锈迹斑斑的矿车。",
"你沿着轨道往里走。越往里，温度越高，空气里弥漫着一股硫磺和铁锈的气味。远处，隐约有暗红色的光，一闪一闪——像地底的心脏在跳动。",
"你想起那条地下探索的规矩：「如果在最深处听见心跳声，立刻回头，别好奇那是谁的。」",
"你停下脚步。那暗红色的光，确实在一下一下地搏动，像心跳。",
"但你已经走到了这里。回头，还是继续？"
],
options:[
{t:"继续深入", go:"dun_mine_1"},
{t:"遵守规矩，回头离开", go:"dun_mine_flee"}
]
}};

N["dun_mine_1"]=function(){return{
place:"学院·废弃矿洞深处",
text:[
"你继续往里走。轨道尽头是一处巨大的矿腔，穹顶高不可测，四周岩壁上嵌着暗红色的矿脉，发着幽幽的光——就像这座矿腔的血管。",
"矿腔中央，一块巨大的矿石矗立着，形状像一颗心脏，表面布满裂纹，裂纹里透出熔岩般的光芒，正一下一下地搏动。",
"你走近那块矿石。它在呼吸——矿腔里的空气随着它的搏动而震颤，你脚下的碎石都在轻轻跳动。",
"「好奇的孩子。」一个声音从矿石内部传来，低沉如滚雷，「你踩在了我的脉搏上。」",
"矿石表面的裂纹骤然亮起，熔岩般的光芒喷涌而出——矿壁震颤，碎石簌簌落下。矿腔深处，一个由熔岩凝成的巨大身影缓缓站起，胸口一颗火红的心脏剧烈跳动。",
"熔岩之心。它低头看着你，声音像岩浆流动：「要么离开，要么——成为我的燃料。」"
],
options:[
{t:"与熔岩之心战斗！", run:function(){ startCombat("dun_mine_boss","熔岩之心","dun_mine_3"); }},
{t:"尝试与它对话", go:"dun_mine_2"}
]
}};

N["dun_mine_2"]=function(){return{
place:"学院·废弃矿洞深处",
text:[
"「等等！」你举起双手，「我不是来挖矿的。我是来找一种叫『火曜矿晶』的东西——用它来重铸封印。」",
"熔岩之心的搏动顿了一下。那低沉的声音再次响起：「火曜矿晶……你知道那是什么吗？」",
"「不知道。但我知道有人需要它。」",
"「哼。」矿石内部发出一声闷响，像是冷笑，「火曜矿晶，是我的心脏。百年前，一位灰袍老人来求它，我给了他一颗——作为交换，他答应找到让矿脉『不再痛苦』的办法。但他再也没有回来。」",
"「老鸦？」你脱口而出。",
"熔岩之心的光芒剧烈跳动了一下：「你认识他？」",
"「他——」你顿了顿，「他是守望者。他失踪了，我正在找他。」",
"矿腔里沉默了很久。然后，熔岩之心缓缓开口：「既然你认识他——我可以给你一颗矿晶。但代价是：你要告诉我，他到底有没有找到那个办法。」",
"它的声音里，有一丝你从未在怪物身上听过的——期盼。"
],
options:[
{t:"如实告诉它老鸦失踪的事", go:"dun_mine_3"},
{t:"承诺会继续寻找答案", go:"dun_mine_3"}
]
}};

N["dun_mine_3"]=function(){return{
place:"学院·废弃矿洞深处",
text:[
"你深吸一口气：「他失踪了三年。我查到的线索显示，他去了西海岸，查一笔钱的去向——之后音讯全无。我不知道他有没有找到『让矿脉不再痛苦』的办法，但我知道，他一直在找。」",
"矿腔里安静了很久。熔岩之心的搏动渐渐慢下来，像心跳趋于平稳。",
"「三百年了。」它终于开口，「我是矿脉的意志。矿工挖走了我的血肉，留下了我的痛苦。老鸦是第一个问我『痛不痛』的人。」它的声音顿了顿，「你和他，很像。」",
"一块火红的晶石从它胸口分离出来，缓缓飘向你，落进你手心——滚烫，但灼而不伤。",
"「拿去吧。重铸封印，需要它。」熔岩之心说，「若你找到老鸦——告诉他，矿脉记得他。若他没找到那个办法——」它顿了顿，「那就告诉他，矿脉等他回来，再问一次。」",
"你握着火曜矿晶，掌心一片滚烫。你朝熔岩之心深深鞠了一躬，转身离开矿腔。身后，那暗红色的搏动，一下一下，像一颗等了三百年的心。"
],
options:[
{t:"带着矿晶返回", go:"dungeon_hub"},
{t:"回地面休息", go:"pol_rest_politics"}
]
}};

N["dun_mine_flee"]=function(){return{
place:"学院·废弃矿洞",
text:[
"你遵守规矩，转身往外走。身后，那暗红色的搏动声越来越远，越来越轻，像一颗心跳慢慢沉入地底。",
"你钻出矿洞，铁栅栏在身后哐当一声关合。你站在阳光下，深吸一口气——洞里的硫磺味散尽了，肺里的空气重新变得干净。",
"你低头看自己的手。刚才在洞里，你攥紧了拳头——现在，掌心里有四个指痕，是你自己掐出来的。",
"你知道，矿洞深处那块搏动的矿石，会在你以后的梦里出现。但至少今天——你活着走出了洞口。",
"有些好奇，不必满足。有些心跳，不必探听。你拍拍身上的灰，朝学院走去。日光很好，把影子拉得很短。"
],
options:[
{t:"回学院休息", go:"pol_rest_politics"},
{t:"改日做好准备再来", go:"dungeon_hub"}
]
}};

N["dun_arena_enter"]=function(){return{
place:"学院·地下试炼场",
text:[
"地下试炼场藏在学院最东边的一间旧仓库下面——那是兽人交换生带来的传统，每年秋天，各族学生在这里举行一场「无声的试炼」，胜者得到战魂印记，败者留下伤痕。",
"你掀开旧仓库的地板暗门，沿石阶而下。试炼场比想象中宏大——圆形石台，四周看台层层叠叠，石壁上刻满兽人符文，透着一股肃杀之气。",
"石台中央，立着一柄断刃长枪，枪尖插进石板。枪旁，一个身影盘坐——披着锈迹斑斑的铠甲，像一座铁铸的雕塑。",
"你走近时，它睁开眼。眼窝里没有瞳孔，只有两团燃烧的火焰。",
"「试炼者。」它的声音像铁器摩擦，「留下名字，或者留下血。」"
],
options:[
{t:"报上名号，接受试炼", go:"dun_arena_1"},
{t:"先了解试炼的规则", go:"dun_arena_2"}
]
}};

N["dun_arena_1"]=function(){return{
place:"学院·地下试炼场",
text:["地下竞技场的石阶，被多少年的血浸成了暗红色。你踩上去，脚下微微发滑。", "场中央，两个斗士正在交手。没有护具，没有裁判，只有一圈沉默的看客。铁器相撞的声音，在穹顶下回荡，像某种古老的钟。", "一个看客递给你一杯浑浊的酒：「新来的？喝一杯，壮壮胆。」你接过，没有喝。他笑了笑：「聪明。这酒里掺了东西——不是毒，是『忘了怕』。」", "场上，一个斗士倒下了。他没有爬起来。看客们沉默了一瞬，然后，有人鼓掌，有人离席。", "你问身边那个看客：「他们为什么打？」", "他喝了口酒，说：「为了钱。为了名。为了——证明自己还活着。」他顿了顿，「你猜，哪种最不值？」", "你报上名字。战魂守卫缓缓起身，拔出插在石板里的断刃长枪，枪尖在地面划出一道火花。", "「规则很简单：十招之内，你让我退一步，算你赢。」它说，「否则——你留下一样东西，名字也好，血也好，尊严也好。」", "看台上，不知何时燃起了一圈火把，照亮那些空荡荡的座位——仿佛有无数观众在注视着这场试炼。风穿过石台，火把猎猎作响。", "战魂守卫摆出起手式，长枪横在身前，枪尖对着你的眉心。它没有急着进攻，只是站在那里，像一座等待了百年的山。", "你拔出武器。空气凝滞，只有火把燃烧的声音，和你自己的心跳。", "你走出竞技场。通道里，一个老妪坐在墙角，面前摆着一只碗。你路过时，她忽然开口：「后生，你是第一个没喝那杯酒的人。」", "你停下脚步。她抬起头，露出一张布满皱纹的脸：「那酒，掺的不是『忘了怕』——是『忘了自己是谁』。」", "「你喝了二十年，才看清？」你问。", "她笑了笑，笑声像干裂的树皮：「我喝了二十年，才想起来问。」她把碗往前推了推，「不用给我钱。给我一句话——你下辈子，还想当人吗？」", "你看着她，说：「我想当人。」", "她点了点头，闭上眼睛：「那你就走吧。这地方，人待久了，会忘。」"] /*v45inj:dun_arena_1*/,
options:[
{t:"发起攻击！", go:"dun_arena_boss"},
{t:"先观察它的破绽", go:"dun_arena_3"}
]
}};

N["dun_arena_2"]=function(){return{
place:"学院·地下试炼场",
text:[
"「试炼的规则？」战魂守卫重复了一遍，声音里听不出情绪，「百年前，战神学院有一条规定：凡通过试炼者，可向战魂守卫提一个问题。而战魂守卫——必须如实回答。」",
"「问题没有限制？」你问。",
"「没有限制。生死、胜负、秘密——皆可问。」它顿了顿，「但战魂守卫只会回答一次。问过之后，试炼结束，无论输赢。」",
"它握紧长枪：「所以，历代试炼者都把这个机会留到最后——留到他们最想知道答案的时候。你，想现在用，还是——先打一场？」"
],
options:[
{t:"先打一场", go:"dun_arena_boss"},
{t:"现在就问问题", go:"dun_arena_ask"}
]
}};

N["dun_arena_3"]=function(){return{
place:"学院·地下试炼场",
text:[
"你绕着战魂守卫走了半圈，观察它的站姿。它像一尊雕像，纹丝不动，长枪的枪尖始终对着你的眉心——无论你走到哪个方向。",
"「没用的。」它开口，「我守在这里三百年，见过三千种步法。你的步子，像刚学会握剑的学生。」",
"它没有嘲笑的意思，只是陈述：「但我记得，三百年前，也有一个学生像你这样绕着圈观察我。他叫——」它顿了顿，「他没有留下名字。他只是在我出手的前一瞬，找到了我的破绽。他赢了。」",
"「然后呢？」",
"「然后他走了，带着战魂印记。后来，他成了守望者的一员。」它说，「他的代号，叫『鸦』。」",
"你心头一震——又是老鸦。这座试炼场，他也来过。",
"「既然你是他的后辈——」战魂守卫握紧长枪，「我便用全力。让我看看，你配不配得上那个名字。」"
],
options:[
{t:"全力以赴！", go:"dun_arena_boss"}
]
}};

N["dun_arena_ask"]=function(){return{
place:"学院·地下试炼场",
text:[
"你深吸一口气：「我想问——三年前，一个自称『老鸦』的人，有没有来过这里？」",
"战魂守卫的火焰眼睛闪了闪：「老鸦。他来过。三年前，他带着一个问题来试炼——他赢了，问了我一个问题。」",
"「什么问题？」",
"「他问：『第七印碎片，重铸之后，能不能彻底消灭？』」守卫停顿了一下，「我的回答是：不能。封印只能延迟，不能消灭。真正的解法，在源头。」",
"「源头是指——」",
"「他听完就走了。」守卫打断你，「他没有问源头在哪。他只是说：『那我就要去找到那个源头。』然后他去了——西海岸。」",
"「他为什么去西海岸？」你追问。",
"守卫沉默片刻：「因为那个源头，就在西海岸。我能告诉你的，只有这么多。」",
"你站在石台上，风穿过看台。你忽然明白——老鸦的失踪，从来不是被动消失。他是主动去找那个「源头」了。而西海岸——正是你下一站该去的地方。"
],
options:[
{t:"谢过守卫，离开试炼场", go:"dungeon_hub"},
{t:"还是先打一场", go:"dun_arena_boss"}
]
}};

N["dun_arena_boss"]=function(){return{
place:"学院·地下试炼场",
text:[
"你发起攻击。战魂守卫纹丝不动，直到你的剑尖逼近它身前三寸，它才动了——长枪横扫，势大力沉，带着三百年的风霜。你侧身避开，枪风擦着你的脸颊掠过，刮得生疼。",
"「太慢。」它说。第二枪已经刺到，你举剑格挡，虎口震得发麻。它的力量远超你的想象——那不是血肉之力，是三百年的战魂，在每一寸铁里燃烧。",
"你连退七步，它步步紧逼，长枪如龙。石台上的火把被枪风卷得狂舞，看台上仿佛有无数喝彩声在回荡——那是历代战死者的英魂，在看这场试炼。",
"你抓住一个空隙，长剑斜挑，直取它的咽喉——它侧头避开，枪杆反震，把你整个人甩了出去。你摔在石台边缘，剑脱手飞出。",
"战魂守卫没有追击，它站在原地，长枪拄地：「第七招。你还能再战吗？」",
"你爬起来，捡起剑，擦掉嘴角的血。石台上，火把猎猎作响。你握紧剑柄：「能。」",
"战魂守卫的火焰眼睛，似乎亮了一瞬。它重新举起长枪：「好。那——来最后一招。」"
],
options:[
{t:"拼尽全力，最后一击！", run:function(){ startCombat("dun_arena_boss","战魂守卫","dun_arena_treasure"); }}
]
}};

N["dun_arena_treasure"]=function(){return{
place:"学院·地下试炼场",
text:[
"你的最后一击，与战魂守卫的长枪撞在一起——金石交鸣，震耳欲聋。烟尘散去后，战魂守卫退后半步，枪尖拄地，堪堪稳住身形。",
"「一步。」它低头看了看脚下的划痕，声音里多了一丝罕见的起伏，「三百年来，你是第三个让我退步的人。」",
"它收起长枪，从铠甲内取出一枚锈迹斑斑的印记，抛向你——战魂印记，巴掌大，边缘磨损，但中央的图腾依然清晰。",
"「拿去吧。重铸封印，需要它。」它顿了顿，「另外——回答你先前的问题：老鸦临走前，让我转告后来者一句话。」",
"你握紧印记：「什么话？」",
"「他说：『如果后来者问起我，告诉他——西海岸的风很腥，但海是蓝的。』」战魂守卫说完，缓缓退回石台中央，重新坐下，像一座铁铸的雕塑。",
"你握着战魂印记，把它放进怀里。你走出试炼场时，身后传来一声极轻的响动——像是长枪，轻轻敲了一下石板，算作送别。"
],
options:[
{t:"带着印记返回", go:"dungeon_hub"},
{t:"回地面休息", go:"pol_rest_politics"}
]
}};

N["dun_tree_enter"]=function(){return{
place:"学院·地下根系密林",
text:[
"世界树根系——学院最深处的地带。传说学院建校时，选址在一株古老的世界树旁，而世界树的根系，一直延伸到学院地底，形成一个庞大的地下根系网络。",
"你沿着最深的一条水道前行，尽头是一处巨大的地下洞窟——无数粗壮的树根从穹顶垂下，交织成一片密林。根须上泛着幽幽的绿光，像血管里流动的荧光。",
"空气中弥漫着泥土、苔藓和一种说不清的气味——像腐朽，又像新生。你踩在盘根错节的根系上，脚下传来空洞的回响。",
"你走了大约一盏茶的工夫，忽然听见——密林深处，传来一声极轻的呜咽，像是什么东西在哭泣。",
"你拨开垂落的根须，循声望去。远处，一团暗色的影子蜷缩在树根之间，浑身长满瘤状的突起，正一下一下地颤动。"
],
options:[
{t:"上前查看", go:"dun_tree_1"},
{t:"保持距离，观察", go:"dun_tree_2"}
]
}};

N["dun_tree_1"]=function(){return{
place:"学院·地下根系密林",
text:[
"你拨开根须走近。那团影子抬起头——它有一张类似人脸的面孔，但皮肤是树皮质地，布满瘤节，眼窝里没有眼珠，只有两团浑浊的绿光。",
"它看见你，身体缩了缩，发出一声像动物受惊的呜咽。它似乎想逃走，但根须缠住了它的下肢，它只能徒劳地挣扎。",
"你注意到，它身上缠着一些发光的东西——是种子，一粒粒嵌在它的树皮皮肤里，泛着微弱的光。那些种子正在生根，像要把它吸干。",
"你犹豫了一下，蹲下身：「别怕。我不是来伤害你的。」",
"它浑浊的绿光眼睛看着你，呜咽声渐渐低下去。它伸出满是瘤节的手，朝你递来一样东西——一粒泛着金光的种子，比它身上的其他种子都要明亮。"
],
options:[
{t:"接过种子", go:"dun_tree_3"},
{t:"先帮它解开根须", go:"dun_tree_3b"}
]
}};

N["dun_tree_2"]=function(){return{
place:"学院·地下根系密林",
text:[
"你停在原地，没有靠近。那团影子在根须间蜷缩着，一下一下地颤动，像在忍受什么痛苦。",
"你仔细观察——它身上的瘤节在缓慢地蠕动，像有东西在皮下游走。每一粒嵌在皮肤里的种子，都在缓缓生根，根须渗进它的身体，汲取它的养分。",
"它发出一声更弱的呜咽。你忽然意识到：那些种子不是长在它身上的——是有人故意种在它身上的。它在被当作「苗床」。",
"你后退一步，心里发紧。这地方，比想象中复杂得多——不是每个哭泣的东西都值得同情，也不是每粒发光的种子都值得靠近。",
"你决定先离开，记住这个位置。等你弄清楚这些种子的来历，再回来。"
],
options:[
{t:"先离开，改日再来", go:"dungeon_hub"},
{t:"还是上前看看", go:"dun_tree_1"}
]
}};

N["dun_tree_3"]=function(){return{
place:"学院·地下根系密林",
text:[
"你接过那粒金色种子。它在你手心微微发热，像一颗小小的太阳。",
"那团影子——腐根精，发出一声近似满足的叹息，缓缓缩回根须之间。你正要问它种子是什么，忽然，整个洞窟震颤起来。",
"穹顶的根须疯狂地扭动，像被惊动的蛇群。腐根精猛地抬头，浑浊的绿光眼睛骤然亮起——它发出一声凄厉的尖啸，身体骤然膨胀，瘤节爆裂，无数根须从它体内喷涌而出，朝你扑来！",
"你瞬间明白：它递给你种子，是为了拖延时间——那些根须，才是它的真面目。它一直在这里，等的就是一个「愿意靠近」的活物，好寄生、吞噬。",
"你后退一步，拔出武器。洞窟里，根须如潮，腐根精的身影在根须间膨胀变形，发出刺耳的嘶鸣："
],
options:[
{t:"与腐根精战斗！", run:function(){ startCombat("dun_tree_boss","腐根精","dun_tree_treasure"); }}
]
}};

N["dun_tree_3b"]=function(){return{
place:"学院·地下根系密林",
text:[
"你上前一步：「先别急，我帮你解开这些根须。」",
"你伸手去扯缠住它下肢的根须——根须应声而断，但断口处喷出一股暗绿色的汁液，溅在你手背上，火辣辣地疼。",
"你咬牙，继续扯。腐根精安静下来，浑浊的绿光眼睛注视着你。它抬起手，把一粒泛着金光的种子放在你手心，然后轻轻合上你的手指。",
"「谢……谢。」它发出含糊的声音，像很久没有说过话。",
"你还没来得及回应，脚下的根须猛地收紧——不是缠它，是缠你！你低头，无数根须正沿着你的脚踝往上爬。腐根精的身体骤然膨胀，瘤节爆裂，尖啸声震耳欲聋：",
"「对不起——它们饿太久了——」",
"它浑浊的绿光眼睛里，竟有一丝愧疚。但根须已经把你缠到了腰际——它递种子给你，是为了让你放松警惕。它饿了三百年，你——是它等到的第一餐。"
],
options:[
{t:"挣开根须，与它一战！", run:function(){ startCombat("dun_tree_boss","腐根精","dun_tree_treasure"); }}
]
}};

N["dun_tree_boss"]=function(){return{
place:"学院·地下根系密林",
text:[
"根须如潮水般涌来。你挥剑斩断缠身的根须，向后跃开——但更多根须从四面八方涌来，密林已经变成一座活的囚笼。",
"腐根精的身影在根须间游走，它的身形不断膨胀，树皮般的皮肤下蠕动着暗色的根须，无数瘤节同时爆裂，喷出腐蚀性的汁液。",
"「对不起……对不起……」它一边攻击，一边含糊地重复着，「它们饿太久了……我也……饿太久了……」",
"你一边格挡，一边寻找它的核心。终于，你注意到——它胸口处，有一团比别处更亮的绿光，那是它所有根须的源头，也是它最脆弱的地方。",
"你握紧剑，深吸一口气。密林里，根须在狂舞，汁液在飞溅，一场生死之战，到了最紧要的关头。"
],
options:[
{t:"刺向它的核心！", run:function(){ startCombat("dun_tree_boss","腐根精","dun_tree_treasure"); }}
]
}};

N["dun_tree_treasure"]=function(){return{
place:"学院·地下根系密林",
text:[
"你的剑刺穿腐根精的胸口。那团明亮的绿光骤然熄灭，它的身体开始溃散——树皮皮肤寸寸剥落，根须枯萎、卷曲，露出内里一根枯死的树干。",
"它倒下去时，发出一声长长的叹息，像终于卸下了三百年的重担。",
"「谢……谢。」它气若游丝，「种在我身上的种子……是有人要我孕育的东西……我不知道那是什么……但它们从我体内长出来的时候……我就知道……那不是好东西……」",
"它颤抖着，从溃散的树皮中滚出一粒黯淡的种子——比金色种子小得多，颜色灰黑，像一颗死去的果实。",
"「这个……是那个人的……种子。他每个月都来……把新种子……种在我身上……」它看着你，「别让他……找到你……」",
"它彻底溃散，化作一捧枯木屑，散落在根须之间。你捡起那粒灰黑的种子，它冰凉，没有一丝生机，但你隐约能感觉到——它内部，有什么东西在沉睡。",
"你把它收进一只密封的铁盒，放进口袋。你抬头看穹顶——那些垂落的根须，已经停止了蠕动，恢复了寂静。",
"你捡起地上的金色种子，也一并收好。走出洞窟时，你回头看了一眼——密林深处，枯木屑静静躺在地上，像一座小小的坟。"
],
options:[
{t:"带着种子返回", go:"dungeon_hub"},
{t:"回地面休息", go:"pol_rest_politics"}
]
}};



// ============================================================
// v39 补：pol_edmund_mediator
// ============================================================

N["pol_edmund_mediator"]=function(){return{
place:"学院·西塔楼",
text:[
"你没有赴昆特的约。第二天一早，你去找埃德蒙，把昆特的事原原本本告诉了他——包括那封信，和他女儿被圣光扣住的事。",
"埃德蒙听完，沉吟了很久：「昆特的事，我早有所知——他是圣光安插在学院的暗线，但这段日子，他传出去的情报越来越『软』，像是故意在打折扣。」",
"「他女儿的事，是真的？」你问。",
"「是真的。」埃德蒙点头，「昆蒂娜在圣光神学院读神学系，三年前被扣住，成了圣光拿捏昆特的把柄。学院里有几位教授都知道，但没人敢管——圣光的手，伸得太长了。」",
"他站起身：「我去见见他。有些话，我这个副院长出面，比你去说管用。」",
"当天下午，埃德蒙在办公室单独见了昆特。没人知道他们谈了什么——但当晚，昆特托人给你带了一句话：「替我谢谢那位副院长。他让我想起，学院里还有人记得我们这些『暗线』，也是人。」",
"你站在宿舍窗前，看着训练场的方向。夜风里，那个总是凶巴巴的教头，第一次让你觉得，他也不过是个想救女儿的父亲。"
],
options:[
{t:"继续经营这条关系", go:"pol_qinte_ally"},
{t:"回学生会看看", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向三：伏笔回收系统（30节点）
// ============================================================

N["fsh_dream_gate"]=function(){return{
place:"梦境",
text:[
"你睡着了。梦里，你站在一片雾蒙蒙的旷野上，脚下的路分出很多条，每一条都通向一个模糊的影像——像是一段被遗忘的过往，正在等你想起来。",
"雾中，有什么东西在低语：「你带来了一些东西，又留下了一些东西。现在，是时候回去看看了。」",
"你在雾里辨认那些影像：一封信、一双眼睛、一个街角、一句没说完的话……每一个，都像一枚沉在水底的石子，如今被夜风翻了出来。",
"你知道，这不仅仅是个梦。这是那些被你带进学院、带进地下、带进每一次选择里的伏笔——在提醒你，它们还活着。"
],
options:[
{t:"去追寻那封信的影像", go:"fsh_hlj_letter1"},
{t:"去追寻那双眼睛的影像", go:"fsh_watcher1"},
{t:"去追寻那个街角的影像", go:"fsh_eclipse1"},
{t:"去追寻那道裂痕的影像", go:"fsh_seal1"},
{t:"去追寻那个同学的影像", go:"fsh_classmate1"},
{t:"去追寻那句没说完的话", go:"fsh_unsaid1"},
{t:"从梦里醒来", go:"pol_hub"}
]
}};

N["fsh_hlj_letter1"]=function(){return{
place:"梦境·那封信",
text:[
"梦里，你回到了第一次展开那封信的瞬间。信纸泛黄，墨迹有些洇开，落款是「黄林晶」——一个你从没听过的名字。",
"你在学院的地下室里又翻出了那封信的抄本。这一次，你把它举到灯下，换了个角度——信纸的右下角，隐着一行极淡的字迹，平时根本看不见，只有逆光时才会浮现：",
"「若你能读到这行字——说明你活到了第二个春天。拿着信，去圣城的旧钟楼，报我的名字。」",
"你放下信纸，指尖微微发凉。这封信，比你想象的埋得更深——它不是一封信，是一把钥匙。而钥匙指向的地方，是你从未去过的圣城。",
"你忽然明白，为什么这封信会穿过那么远的路、那么多双手，最后落到你手里。有些东西，从写下它的那一天起，就在等一个能读懂它的人。"
],
options:[
{t:"记下这个线索，继续睡", go:"fsh_dream_gate"},
{t:"醒来后，把这行字抄进笔记", go:"pol_hub"}
]
}};

N["fsh_hlj_letter2"]=function(){return{
place:"圣城·旧钟楼",
text:[
"你站在圣城的旧钟楼下。钟楼已经废弃多年，楼梯积满灰尘，越往上走，光线越暗。顶层有一间小室，门上刻着一个名字：黄林晶。",
"你推开门。室里只有一张桌、一把椅、一扇朝西的窗。桌上放着一封信，落款日期是三十年前——信封上没有邮票，只有一行字：",
"「给第一个找到这扇门的人。」",
"你拆开信。信里是黄林晶的笔迹：「如果你读到这里，说明第七印的碎片还封在学院地下。三十年前，我发现了那笔钱的秘密，也发现了守望者的秘密。我本想带着真相离开，但有人比我更快——他把我关进了这里，锁了三十年。」",
"「他叫——」信的最后一行被墨水洇开，只留下一个模糊的轮廓，像是「T」。",
"你握着信纸，站在西窗前。窗外，圣城的钟声恰好响起——一声，又一声，像三十年的回音，终于落到了地上。"
],
options:[
{t:"收好信，离开钟楼", go:"pol_hub"}
]
}};

N["fsh_watcher1"]=function(){return{
place:"学院·回廊",
text:[
"梦里，你又看见了那双眼睛——从序章开始，就一直若有若无地跟着你的那双眼睛。你始终不确定它是真是假：是错觉，还是真有人在远处看着你。",
"这一次，你在梦里追了上去。那个身影转过街角，你加快脚步——它停住了，没有回头，声音顺着风飘过来：",
"「你终于注意到我了。」",
"「你是谁？为什么一直跟着我？」你问。",
"「我在等。」它说，「等你有资格知道答案的那一天。现在——你进了学生会，下了地下城，查了账目。差不多，是时候了。」",
"它转身，月光照亮它的脸——那是一张你见过的脸：学生会副主席，塞德。",
"你猛地从梦里惊醒，后背全是冷汗。塞德……那个总在笑的人……他到底跟了你多久？"
],
options:[
{t:"记下这个梦，警觉起来", go:"pol_third_party"},
{t:"醒来，把这当作巧合", go:"pol_hub"}
]
}};

N["fsh_watcher2"]=function(){return{
place:"学院·暗处",
text:[
"你终于确认了那双眼睛的主人。不是塞德——是另一个人，一个你在序章里见过、却始终没记住脸的人：守望者的外围眼线。他跟踪你，不是为了监视，是为了保护。",
"「你查了账，下了地下，进了塔楼——早就被各方盯上了。」他递给你一张纸条，「组织让我看着你，确保你不会『意外转学』。」",
"「是埃德蒙安排的？」你问。",
"他摇头：「不是他。是更高一层的人。他说，你像极了三十年前的一个人——一个本该成为守望者、却选择了另一条路的人。」",
"他顿了顿：「他让我告诉你：那封信（黄林晶的信），他当年也收到过。他看了，然后烧了。他希望你——别走他走过的路。」",
"他说完，转身消失在人群里。你站在原地，攥着那张纸条，心里翻涌着说不清的滋味。原来从序章开始，你就在别人的注视里——不是监视，是守望。"
],
options:[
{t:"把纸条收好，继续前行", go:"pol_hub"}
]
}};

N["fsh_eclipse1"]=function(){return{
place:"梦境·那个街角",
text:[
"梦里，你回到了序章的那个街角——你曾经帮过一个小混混，或者害过他，或者在那一刻选择了转身离开。他的脸，你几乎要忘了。",
"但梦里的他，穿着灰袍，站在一条昏暗的巷子里，胸口别着一枚暗色的徽记——暗蚀会的外围成员。他冲你笑了笑，笑容里没有恶意，只有一点说不清的复杂：",
"「当年你帮我的时候，我就说过——我会记住的。」他晃了晃胸口的徽记，「现在我混出了点名堂。你要是哪天需要『消息』，来灰巷找我。报我的名字——疤脸阿莫。」",
"你从梦里醒来，耳边还回响着他的话。疤脸阿莫——那个你几乎忘记名字的人，如今是暗蚀会的外围了。你当年种下的那颗种子，长成了一棵你认不出的树。"
],
options:[
{t:"记下这个联系", go:"pol_hub"},
{t:"去灰巷找他", go:"fsh_eclipse2"}
]
}};

N["fsh_eclipse2"]=function(){return{
place:"灰巷",
text:[
"你去了灰巷。巷子深处有一家不起眼的铁匠铺，招牌上画着一只独眼猫。你报上疤脸阿莫的名字，铺子里的人打量你片刻，带你进了后屋。",
"阿莫比当年壮了一圈，脸上多了一道疤——他笑的时候，那道疤会跟着弯：「你还真来了。」",
"「你当年——」你斟酌着开口，「你加入暗蚀会，是因为我当年没帮你？」",
"阿莫的笑淡了：「不是。我加入，是因为他们给了我一个『可能』——一个改变命运的可能。你当年帮我的时候，是第一个把我当人看的人。所以我记住你，不是记仇，是记恩。」",
"他压低声音：「暗蚀会外围，不是你想的那样全是疯子。我们当中有很多人，只是想要一个『向上爬』的机会。但核心层——」他顿了顿，「核心层的事，我不碰，你也别碰。」",
"他递给你一块铁牌：「拿着这个，灰巷以后对你开放。但要记住——别让人知道你和我有关系。」",
"你接过铁牌，沉甸甸的，带着炉火的余温。"
],
options:[
{t:"收好铁牌，离开灰巷", go:"pol_hub"}
]
}};

N["fsh_seal1"]=function(){return{
place:"梦境·那道裂痕",
text:[
"梦里，你站在一道巨大的裂痕前——它横亘在大地上，边缘泛着暗红色的光，像一道被撕开的伤口。你听见裂痕深处传来心跳声，一下，一下，与你在矿洞里听见的搏动一模一样。",
"你低头看自己的手——手上有一道细小的裂痕，从虎口延伸到手腕，正泛着同样暗红色的微光。你伸手去摸，裂痕微微发烫。",
"「七印的征兆，会落在每一个靠近它的人身上。」一个声音在梦里响起，像是一个老者的低语，「你见过碎片，碰过封印——它记住了你的温度。」",
"你猛地醒来，低头看自己的手。虎口处，果然有一道浅浅的纹路，像是被什么烫过，平时看不出来，此刻在月光下，隐隐泛着红。",
"你坐起身，盯着那道纹路，心里涌起一阵说不清的不安。七印——它开始记住你了。"
],
options:[
{t:"警惕起来，留意这个征兆", go:"pol_hub"}
]
}};

N["fsh_seal2"]=function(){return{
place:"学院·西塔楼",
text:[
"你再次站在西塔楼地下密室的石棺前。棺盖上的七道封印，如今只剩下两道还在流转微光——四道黯淡的，又暗了一道。",
"你低头看自己的手，虎口的纹路比上次更深了，像是有什么东西在皮肤下缓慢生长。",
"你伸手，指尖轻轻触碰石棺——棺盖上的封印忽然亮了一下，像是回应。那一瞬，你仿佛听见棺内传来一声极轻的叹息。",
"「封印在松动，而你也在变。」埃德蒙的声音从身后传来，他不知何时站在了门口，「靠近它的人，会慢慢被它改变。七印的征兆，不是警告——是邀请。」",
"「邀请？」",
"「它在选人。」埃德蒙看着你，「选一个能守住它，或者——能释放它的人。你身上的纹路越深，它的『邀请』就越重。」",
"你收回手。封印的光缓缓暗淡下去。你低头看着掌心的纹路，一时无言。"
],
options:[
{t:"把这件事放在心里", go:"pol_hub"}
]
}};

N["fsh_classmate1"]=function(){return{
place:"梦境·那个同学",
text:[
"梦里，你回到了序章——那个你在出身地遇见的同龄人。他（她）当时的态度、那句话、那个眼神，如今在梦里格外清晰。",
"你后来在学院里见过他——他（她）是新生里的熟面孔，你们在走廊里擦肩而过时，他（她）多看了你一眼。那一眼里，有认出你的意思，也有不确定。",
"梦里，他（她）的声音很轻：「你也来了。我还以为——当年的事，会让你离这里远远的。」",
"你醒来时，天还没亮。你躺在床上，想着他（她）那句话。当年的事——你几乎忘了是什么事，但他（她）记得。你们之间的那颗种子，还埋在土里，等着某个时刻破土。"
],
options:[
{t:"在学院里找到他，重新认识", go:"fsh_classmate2"},
{t:"顺其自然，等命运安排", go:"pol_hub"}
]
}};

N["fsh_classmate2"]=function(){return{
place:"学院·食堂",
text:[
"你在食堂找到了他（她）——正在角落一个人吃饭。你端着餐盘走过去，在他（她）对面坐下。他（她）抬头，看见是你，愣了一下，然后笑了：",
"「真是你。我还以为认错人了。」",
"你们聊起当年的事——他（她）说，当年你离开出身地那天，他（她）其实在巷口看着，「我没敢出来送你。那时候我觉得，你要去的地方，跟我不是一个世界。」",
"「那现在呢？」你问。",
"「现在？」他（她）低头扒了一口饭，「现在，我们坐同一张桌子吃饭。世界，好像也没那么远。」",
"你们相视一笑。窗外，阳光正好。当年那颗种子，终于在这一刻——破土了。"
],
options:[
{t:"继续这段友谊", go:"pol_hub"}
]
}};

N["fsh_karma1"]=function(){return{
place:"梦境·那些小事",
text:[
"梦里，你回到了序章那些不起眼的选择——帮小贩搬货、偷了一个面包、放过一个抢你东西的人、对陌生人撒了一个谎。这些小事，当时做完就忘了。",
"但梦里的画面，一帧一帧地闪过：小贩后来笑着跟你打招呼、被你偷了面包的店主追了你三条街、被你放过的人后来帮你挡了一刀、被你骗过的人后来在某个场合认出了你……",
"梦的最后一幕，是一双手——你曾经递出过帮助的那双手，如今反过来，在你最需要的时候，扶了你一把。",
"「因果不是债，是回声。」梦里的声音说，「你喊过什么，山谷就会回什么。只是回声有时来得慢——慢到你以为，它永远不会回来了。」",
"你醒来，枕边有点潮。你分不清是泪，还是梦里的露水。"
],
options:[
{t:"记住这些回声", go:"pol_hub"}
]
}};

N["fsh_karma2"]=function(){return{
place:"学院·门口",
text:[
"一个下雨天，你从学院门口出来，看见一个老头正艰难地推着满载货物的板车上坡。你犹豫了一下，上前搭了把手。",
"老头喘着气，连声道谢。他看着你的脸，忽然眯起眼：「小伙子，我是不是在哪儿见过你？」",
"「可能吧。」你笑了笑，「我帮很多人推过车。」",
"「不对。」老头摇头，仔细打量你，「三年前——交汇城的集市口，有个小孩帮我追回过被风吹跑的布匹。那小孩……是你吧？」",
"你愣住了。三年前？那是你序章时候的事。你几乎忘了。",
"老头从怀里摸出一样东西，塞进你手里：「我一直想还你点什么。这是当年那批布里的，我留着当念想——给你吧。」",
"你低头看，是一枚小小的铜扣，磨得发亮。你握着它，忽然觉得，三年前那个下午，隔着这么远的时间，轻轻落回了你的手心。"
],
options:[
{t:"收下铜扣", go:"pol_hub"}
]
}};

N["fsh_primal1"]=function(){return{
place:"梦境·那个声音",
text:[
"梦里，你又听见了那个声音——从序章开始，就偶尔出现的、像幻听一样的声音。它在你耳边低语，说的内容你总是记不清，只记得那种感觉：像是有什么古老的、巨大的东西，在远处慢慢睁开眼睛。",
"这一次，你在梦里抓住了它。你停下脚步，闭上眼睛，仔细听——那声音终于清晰起来：",
"「饥饿……愤怒……傲慢……贪婪……嫉妒……懒惰……色欲……」它一个一个数着，「七张嘴，七个胃口。我们等着……等着被喂饱的那一天。」",
"你猛地醒来，心跳如擂。你记得——七原罪。它们对应着七印，对应着深渊里的七个原初之物。而你，从序章开始，就在听它们说话。",
"它们不是幻听。它们——一直在看着你。"
],
options:[
{t:"把这个声音记在心里", go:"pol_hub"}
]
}};

N["fsh_primal2"]=function(){return{
place:"地下·深渊边缘",
text:[
"你站在地下城最深处，前方是一道望不见底的裂缝——深渊的边缘。裂缝里传来风声，还有那个声音，这一次格外清晰：",
"「你终于走到这里了。」它说，「我等这一天，等了很久——等你把封印一块一块地削弱，等你把钥匙一把一把地凑齐。」",
"「我没有削弱封印。」你反驳。",
"「你没有吗？」它轻笑，「你查了账，让资金断流——那是维持封印的材料钱。你下了地下城，带走了一颗矿晶、一枚印记——那些都是封印的锚点。你以为你在『收集材料重铸封印』，可你每取走一样，封印就松一分。」",
"你僵在原地。它继续说：「或者——你其实一直知道。只是你告诉自己，你在做对的事。」",
"裂缝里的风声更大了。你站在深渊边缘，第一次觉得，脚下的黑暗，比想象中更懂得人心。"
],
options:[
{t:"记住这个警告", go:"pol_hub"}
]
}};

N["fsh_origin1"]=function(){return{
place:"梦境·母亲的旧物",
text:[
"梦里，你看见一件旧物——属于你母亲的旧物。你记不清它是什么了，只记得它在你很小的时候，一直被母亲收在一个木匣子里，从不让人碰。",
"梦里的你，还是个小孩子。你趁母亲不在，偷偷打开过那个木匣——里面是一枚徽章，银质的，刻着一只展翅的鹰，鹰爪下握着天平。",
"你当时不知道那是什么，只觉得好看。后来母亲发现你动过木匣，难得地发了火。从那以后，你再没见过那枚徽章。",
"但你现在知道了——那只鹰和天平，是守望者的徽记。",
"你从梦里醒来，坐在黑暗里，心跳得很慢。你母亲——守望者？她从来只是一个普通的女人，在小镇上过着普通的日子。直到她病逝，你都没听她提起过任何一个与「组织」有关的字。"
],
options:[
{t:"把这个发现放在心底", go:"pol_hub"}
]
}};

N["fsh_origin2"]=function(){return{
place:"学院·档案室",
text:[
"你在学院档案室的旧学生名册里，翻到一个名字——你母亲的名字。她曾经在这所学院读过书，比你早二十多年。",
"名册旁边的备注栏，写着一行小字：「成绩优异，毕业后未留档，去向不明。」",
"你指尖划过那行字。你母亲——来过这座学院。她在这里读书、毕业，然后去了一个小镇，嫁人，生子，过普通的日子——直到病逝。",
"你想起梦里那枚守望者的徽章。她在这里，是不是也遇见了什么？是不是也像你一样，卷进了某些事，然后选择了离开、隐姓埋名？",
"你合上名册，把它放回原处。走出档案室时，阳光很好。你抬头看了看天，忽然觉得，你走过的每一步路，也许都有你母亲当年走过的影子。"
],
options:[
{t:"带着这个答案继续前行", go:"pol_hub"}
]
}};

N["fsh_prophecy1"]=function(){return{
place:"梦境·那句预言",
text:[
"梦里，你听见了那句预言——你在序章听到过的，那个版本因出身而异的预言。你当时只当是老人的胡话，如今再听，字字清晰：",
"「当第七印的锁链断尽，持印者将从海边归来，带着灰烬与黎明。他不是救世主，也不是毁灭者——他只是那个，在所有人都转身之后，还站在原地看着的人。」",
"你听出最后几个字的时候，梦里的画面开始晃动。你低头——你站在一片焦土上，手里握着一枚暗淡的碎片，身后是海。",
"你醒来，那句话还在耳边回响：「在所有人都转身之后，还站在原地看着的人。」",
"你坐起身，看着窗外初升的太阳，忽然觉得，那句预言——好像在说一个你认识的人。也许，就是你自己。"
],
options:[
{t:"把预言记在心里", go:"pol_hub"}
]
}};

N["fsh_prophecy2"]=function(){return{
place:"圣城·大教堂",
text:[
"你在圣城的旧档案里，找到了那句预言的完整版本——它被刻在一块石碑上，藏在教堂地窖的角落里，字迹已经被岁月磨得模糊：",
"「当第七印的锁链断尽，持印者将从海边归来，带着灰烬与黎明。他不是救世主，也不是毁灭者——他只是那个，在所有人都转身之后，还站在原地看着的人。他会用一只手合上封印，用另一只手，松开自己的过去。」",
"你蹲在石碑前，看了很久。最后一行字，是你从未听过的版本——「松开自己的过去」。",
"你伸手，指尖轻轻抚过那行字。风从地窖的缝隙灌进来，吹动烛火。你忽然明白，预言不是关于「命运」的——是关于「选择」的。而选择，从来都只属于站在路口的那个人。"
],
options:[
{t:"记住完整版预言", go:"pol_hub"}
]
}};

N["fsh_firstseal1"]=function(){return{
place:"梦境·那枚碎片",
text:[
"梦里，你回到了序章那个无意识的瞬间——你接触过第一印的碎片，获得了一段模糊的记忆。如今，那段记忆在梦里重新浮现：",
"你看见一间古老的石室，一个披着斗篷的人背对着你，正在擦拭一枚碎片。碎片上刻着复杂的纹路，泛着暗金色的光。",
"「第一印，贪欲之印。」那人开口，声音像砂纸磨过铁器，「持有它的人，会听见心底最渴望的声音。你——听见了吗？」",
"他缓缓转过身。斗篷下，是一张没有五官的脸——只有一张嘴，无声地张合：",
"「你渴望什么？」",
"你从梦里惊醒，胸口剧烈起伏。你低头看自己的手——虎口的纹路旁边，多了一枚极小的印记，像一枚烧过的烙印，形状与梦里的碎片一模一样。"
],
options:[
{t:"留意这个印记", go:"pol_hub"}
]
}};

N["fsh_firstseal2"]=function(){return{
place:"学院·地下",
text:[
"你在地下的石壁上，找到了一幅与梦里一模一样的纹路——第一印的刻痕。它被刻在一扇隐藏的石门上方，边缘已经风化，但纹路依然清晰。",
"你伸手触碰那些刻痕，指尖微微发麻。那一瞬，你仿佛又听见那个声音：「你渴望什么？」",
"这一次，你在心里回答了它：",
"「我渴望——知道真相。」",
"刻痕忽然亮了一下，又暗下去。石门后传来一声极轻的响动，像是什么东西被打开了。你推开石门——门后是一间小室，墙上挂着一幅画。",
"画上是一个披斗篷的人，站在海边，手里握着一枚碎片。画的右下角，题着一行字：",
"「第一印的持有者，看见的从来不是别人——是他自己。」",
"你站在画前，看了很久。然后你伸出手，轻轻拂去画框上的灰尘，把画取了下来，卷好，带走了。"
],
options:[
{t:"带着画离开", go:"pol_hub"}
]
}};

N["fsh_time1"]=function(){return{
place:"梦境·似曾相识",
text:[
"梦里，你经历了一个「似曾相识」的瞬间——一个你明明第一次经历、却觉得已经发生过无数次的场景。你在梦里停下来，仔细看周围：走廊、烛台、窗外的月光，每一处都熟悉得让人心慌。",
"「你感觉到了？」一个声音在梦里响起，像一个老朋友，「这是时间在打结。第六印的影响——它让某些时刻，重复、重叠、交错。」",
"「为什么会这样？」你问。",
"「因为有人动了时间。」那声音说，「承天山下的时光裂隙，你还记得吗？那里漏出来的风，会吹乱所有人的时间感。而你——」它顿了顿，「你离那道裂隙，比你以为的更近。」",
"你醒来时，太阳已经升高了。你坐在床边，看着窗外正常的风景——一切都对，一切都合理。但你心里知道，那个「似曾相识」的瞬间，不是错觉。"
],
options:[
{t:"记住这个异常", go:"pol_hub"}
]
}};

N["fsh_time2"]=function(){return{
place:"学院·钟楼",
text:[
"你在学院的旧钟楼上，找到了那个「似曾相识」的根源——钟楼的齿轮里，卡着一枚极小的碎片，泛着幽蓝的光。你把它取出来时，指尖一麻，周围的空气仿佛静止了一瞬。",
"那一瞬，你看见了无数个自己：在序章的街角、在学院的回廊、在地下城的入口、在未来的某个海边——每一个你都在做着不同的选择。然后，时间重新流动，那些影像像水泡一样碎掉。",
"你低头看那枚碎片——它冰冷，泛着幽蓝的光，与第六印的传说描述一致。",
"你把它收进怀里。钟楼的齿轮重新转动，发出咔嗒咔嗒的声音，恢复正常。你走下钟楼时，阳光正好，一切都和来时一样——只有你知道，这枚碎片，是「时间」本身的一小块。"
],
options:[
{t:"收好碎片", go:"pol_hub"}
]
}};

N["fsh_abyss1"]=function(){return{
place:"梦境·那道印记",
text:[
"梦里，你挽起袖子，看见自己的手臂内侧——一道暗色的纹路，从手腕蜿蜒到肘弯，像一条细蛇。你记不清它是什么时候出现的。",
"你试着回想：是序章那个事件之后？是第一次接触封印之后？还是更早——早在你第一次听见那个低语的时候，它就已经种下了？",
"「深渊的标记，不会主动消失。」那个声音又响起来，「它会跟着你，像一个影子。你越靠近深渊，它越清晰。」",
"你猛地醒来，挽起袖子——手臂内侧，果然有一道暗色的纹路，比梦里看起来浅一些，但确实存在。",
"你放下袖子，心跳很慢。这个标记，你带了很久——只是你一直没有发现它，或者，一直不想发现它。"
, "后来你才知道，这种纹路，老人们叫它「深渊标记」。他们说这个词的时候，声音会压低，眼神会避开——仿佛念出名字，就会引来什么。", "你把袖子放下来，遮住那道纹路。你告诉自己，不过是条旧疤。可你知道，疤不会自己长。"/*v46txt:abyss1*/],
options:[
{t:"留意这个标记", go:"pol_hub"}
]
}};

N["fsh_abyss2"]=function(){return{
place:"学院·占星塔",
text:[
"你去找灰翎，让她帮你看手臂上的标记。她举着放大镜看了很久，放下时，脸色少见地严肃：",
"「这不是纹身，是『契约纹』。」她说，「它一旦出现，就说明——你已经和深渊里的某个存在，建立了联系。」",
"「我什么都没做。」你说。",
"「不需要你做什么。」灰翎说，「你只要在深渊气息浓烈的地方待过足够久，它就会自己找上你。接触封印、深入地下、听那些低语——每一样，都在为它铺路。」",
"她想了想，从柜子里取出一只瓷瓶：「这是圣水，涂抹在纹路上，可以暂时压制它。但治标不治本——真正的解法，是远离深渊。」",
"「如果我做不到呢？」你问。",
"灰翎看着你，很久，才说：「那就记住——契约纹亮起来的时候，别听它的话。」",
"你接过瓷瓶，指尖微凉。"
],
options:[
{t:"收好圣水", go:"pol_hub"}
]
}};

N["fsh_lie1"]=function(){return{
place:"梦境·那句谎话",
text:[
"梦里，你回到了序章那个「好心人」身边——他（她）当时对你说了一番很温柔的话，你信了，照着做了。如今在梦里，你重新听见那句话，忽然品出了不一样的味道：",
"每一个字都是对的，但连在一起，是一句精心编造的谎言——它把你引向一个方向，让你远离另一个方向。",
"「他（她）骗了你。」梦里的声音说，「但那个谎言，是为了保护你，还是为了利用你——取决于你后来走了哪条路。」",
"你醒来，坐在床边，努力回想那个好心人的脸。你记不清他（她）的样子了——只记得那番话，像一颗种子，在你还不会分辨的时候，就种进了你的心里。"
],
options:[
{t:"回忆那个谎言，重新审视", go:"fsh_lie2"}
]
}};

N["fsh_lie2"]=function(){return{
place:"学院·图书馆",
text:[
"你在图书馆里，查到了一段记录——关于那个「好心人」。他（她）不是普通的路人，他（她）曾经是某个组织的成员，后来「消失」了。",
"记录里，他（她）消失的时间，恰好是你离开出身地前后。",
"你合上记录，忽然明白了：他（她）对你说的那番话，不是临时起意——是精心准备的说辞。他（她）来到你面前，就是为了对你说那番话，然后离开。",
"至于那句话引你走向的方向——你回头看看自己走过的路：进了学院、查了账、下了地下、碰到了封印。每一步，都像在一条看不见的轨道上。",
"你忽然想：那条轨道，是那个「好心人」铺的，还是你自己走出来的？",
"你合上书，这个问题没有答案。但你知道——那句谎言，你信了很多年。而现在，你终于开始怀疑它了。"
],
options:[
{t:"把这段记录收好", go:"pol_hub"}
]
}};

N["fsh_lost1"]=function(){return{
place:"梦境·那样东西",
text:[
"梦里，你看见那样东西——你在序章里丢了、或者送了人的那样东西。它不大，不值钱，但你记得它曾经在你手里待过。",
"梦里，它出现在另一双手里——那双手的主人你不认识，但他（她）捧着它，像是捧着什么珍贵的东西。",
"「你遗失的东西，去了别人手里。」梦里的声音说，「物品会流转，像水会流动。你永远不会知道，它最后会停在谁那里——除非，你顺着水流去找。」",
"你醒来，努力回想那样东西是什么。你记不清了——但它丢的时候，你记得自己心疼了一下，然后告诉自己「算了，不重要」。",
"也许，它比你以为的更重要。"
],
options:[
{t:"试着回想那样东西", go:"fsh_lost2"}
]
}};

N["fsh_lost2"]=function(){return{
place:"学院·旧货摊",
text:[
"你在学院的旧货摊上，看到了那样东西——一枚旧怀表，表壳磨得发亮。你一眼就认出了它：那是你序章时，从一个人手里收到的，后来在慌乱中弄丢了。",
"摊主是个学生，见你盯着怀表，说：「这表是收来的，卖十枚金币。你要是喜欢——」",
"你拿起怀表，打开表盖。表盘后面，刻着一行小字，是你当年没注意到的：",
"「致吾友——愿你永远用不到这个号码。若你读到这里，说明命运的齿轮，已经转到了该转的地方。」下面是一串数字，像是某个地址。",
"你握着怀表，指尖微微用力。当年给你怀表的那个人，到底是谁？他（她）为什么会留给你这样一行字？",
"你付了十枚金币，把怀表买了回来。它比想象中沉——像装着一段你还没读完的故事。"
],
options:[
{t:"收好怀表", go:"pol_hub"}
]
}};

N["fsh_unsaid1"]=function(){return{
place:"梦境·那句话",
text:[
"梦里，你回到了那个时刻——你本来可以对某人说一句话，但你选择了沉默。那句话卡在喉咙里，像一枚没咽下去的石头。",
"你看见那人转身离开的背影。你张了张嘴，最终没有出声。那句话，从此再没有机会说出口。",
"「未说出口的话，不会消失。」梦里的声音说，「它会变成一个影子，跟着你，也跟着那个人。等某一天，你们再见面——它会替你说。」",
"你醒来，那句话还在喉咙里，像一枚温热的石头。你不知道，还有没有机会再说出口。"
],
options:[
{t:"记住那句话", go:"fsh_unsaid2"}
]
}};

N["fsh_unsaid2"]=function(){return{
place:"学院·重逢",
text:[
"你在学院里，遇见了那个人——当年你没能说出那句话的人。他（她）看起来没什么变化，只是眉眼间多了一点风霜。",
"你们站在走廊里，中间隔着几步路。阳光从窗子照进来，落在他（她）肩上。",
"你张了张嘴，那句话终于到了嘴边——这一次，你没有咽下去。",
"「我当年——一直想跟你说句话。」你说，「谢谢。还有，对不起。」",
"他（她）愣了一下，然后笑了，笑容里有释然，也有说不清的复杂：「我等这句话，等了很久。久到我以为，你永远不会说了。」",
"你们站在那里，阳光很好。那句话，终于从一枚温热的石头，变成了一声轻轻的叹息，落进了风里。"
],
options:[
{t:"把这句话说完了", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向四：西部区域完整开发（36节点）
// ============================================================

N["west_hub"]=function(){return{
place:"西海岸·海风港",
text:[
"海风港是西海岸最大的港口，也是最乱的地方。咸腥的海风裹着鱼市和酒馆的气味，从码头一路灌进街巷。桅杆如林，帆布补丁摞着补丁，水手们光着膀子，在货箱和缆绳之间穿行。",
"你站在港口的石阶上，第一次感受到大陆边缘的呼吸——这里没有学院的钟声，只有海鸥的嘶鸣、号角的呜咽、还有码头工人喊着号子搬运货物的闷响。",
"你想起老鸦的话——「西海岸的风很腥，但海是蓝的。」你抬头，远处的海面在暮色里泛着暗蓝的光，一望无际。",
"你摊开从学院带出来的地图。西海岸的势力分布简单而粗暴：游侠学院管着北段的防线，游侠要塞守着山口，海风港是中段的贸易中心，而南段的迷雾森林和走私通道——是没人管的灰色地带。",
"你收起地图，找了个客栈住下。老板娘给你端上热汤时，多看了你一眼：「外地来的？西海岸这地方，三教九流都有。记住——别轻易跟人提你的来处，也别轻易信人说的话。」",
"汤很咸，带着海风的味道。"
],
options:[
{t:"去港口打听消息", go:"west_port_1"},
{t:"去游侠学院看看", go:"west_ranger_academy"},
{t:"去游侠要塞", go:"west_fort"},
{t:"探索迷雾森林", go:"west_mist_1"},
{t:"打探走私通道", go:"west_smuggle_1"},
{t:"调查磐石铸造坊", go:"west_forge"},
{t:"返回学院", go:"pol_hub"}
]
}};

N["west_port_1"]=function(){return{
place:"海风港·码头",
text:[
"码头边的鱼市从凌晨热闹到深夜。你挤进人群，贴着货摊走，一路听各种口音的吆喝。一个卖贝壳饰品的独眼老头拦住你：",
"「小伙子，买个平安符吧？海上的风浪，信这个的人多。」他压低声音，「当然——你要是打听事，我这也有『信得过的耳朵』。」",
"你在他摊前蹲下，挑了一串贝壳：「最近码头有什么新鲜事？」",
"老头一边给你包贝壳，一边絮叨：「新鲜事？多得很——南边走私通道最近不太平，听说来了个『新东家』，出手阔绰，把原来的几伙人都收了。北边游侠学院的学生，前几天在海上救了一船人——那船人的来历，没人说得清。还有……」他顿了顿，声音更低，「昨晚，有个穿灰袍的外乡人，在酒馆里打听『磐石』这个名字。问完之后，就没人再见过他。」",
"灰袍人。磐石。你心头一跳——那会不会是老鸦的人，或者，就是老鸦自己？",
"你谢过老头，把贝壳挂上手腕，朝酒馆的方向走去。"
],
options:[
{t:"去酒馆打听灰袍人", go:"west_tavern"},
{t:"先回客栈整理信息", go:"west_hub"}
]
}};

N["west_tavern"]=function(){return{
place:"海风港·咸鱼酒馆",
text:[
"咸鱼酒馆是海风港最大的消息集散地。你推门进去，一股混杂着酒气、烟味和汗味的热浪扑面而来。吧台后，老板娘正擦着杯子，见你坐下，扬了扬下巴：「喝什么？」",
"「来杯麦酒。再打听个人——昨晚那个灰袍外乡人，你见过吗？」",
"老板娘手上的动作没停，眼皮都没抬：「西海岸每天都有外乡人。灰袍的，白袍的，不穿袍的——你要找的是哪一种？」",
"你正要细说，吧台另一头，一个一直低头喝酒的驼背人忽然开口：「灰袍，六十上下，左手缺一根小指——对不对？」",
"你看向他。他抬起头，露出一张沟壑纵横的脸：「他问我『磐石』的事，我告诉他——磐石在码头西段第七个仓库。然后他就走了。就这些。」",
"「他现在在哪？」你追问。",
"驼背人又低下头，盯着杯里的酒：「不知道。但你要真想找他——」他顿了顿，「码头西段第七个仓库，你自己去，比找他要快。」",
"酒馆里，笑声、骂声、碰杯声混成一片。你放下麦酒，起身离开。老板娘在你背后喊了一声：「麦酒钱——下次来记得结！」"
],
options:[
{t:"去码头西段第七个仓库", go:"west_warehouse"},
{t:"先回客栈，明早再去", go:"west_hub"}
]
}};

N["west_warehouse"]=function(){return{
place:"海风港·码头西段",
text:[
"码头西段第七个仓库，铁门半掩，门缝里漏出昏黄的光。你侧身闪进去——仓库里堆满麻袋和木箱，空气中弥漫着海盐和麻绳的气味。",
"你绕到货堆后面，发现一个身影正蹲在地上，借着油灯的光，翻着一摞账本。他身形瘦削，灰袍的下摆沾着海泥，左手缺一根小指。",
"你还没出声，他先开口了，声音沙哑：「跟了一路，也该进来了。坐吧——」他抬起头，油灯照亮他的脸。一张你只在字条和传闻里听过的脸：老鸦。",
"「你就是老鸦。」你说。",
"他愣了一下，然后笑了：「看来学院那边，还有人记得我。」他放下账本，打量你，「埃德蒙让你来的？还是——你自己找来的？」",
"「都有。」你说，「我在查那笔钱。查到了磐石，查到了你。」",
"老鸦沉默片刻，把账本推到你面前：「那你来得正好。我查了三年，就差最后一步了——这账本上，有一笔账，我始终对不上。你帮我看看。」",
"油灯昏黄，海风从门缝灌进来，吹得火苗摇晃。你在他对面坐下，翻开那本泛黄的账本。"
],
options:[
{t:"帮他核对账目", go:"west_ledger"},
{t:"先问他这三年经历了什么", go:"west_oldcrow_story"}
]
}};

N["west_ledger"]=function(){return{
place:"海风港·第七仓库",
text:[
"你翻开账本。老鸦用铅笔在页边做了大量批注，字迹越来越潦草，看得出他查了很久。你的目光停在一处他画了三个圈的地方：",
"「第十九页：向磐石铸造坊支付『维护费』，每季三百金币。收款人签名：R。」",
"「R是谁？」你问。",
"「我查了三年，查不到。」老鸦摇头，「磐石铸造坊的注册人是个死人，账户经手人是假的，签名每次都是同一个字母——R。但钱确实被提走了，提款人每次都蒙着脸。」",
"你盯着那个「R」字，脑海里忽然闪过一个念头——你想起学院档案馆里那张便条，署名也是「T」。R……T……难道西海岸的线，和学院守望者的线，用的是同一套代号体系？",
"「如果是组织代号呢？」你说，「学院那条线，管事的人代号T。西海岸这条线，管事的人代号R——会不会是同一个组织，两套班子？」",
"老鸦的眼睛亮了一下，又暗下去：「如果是这样——那查R，就等于查T。而我们查了这么多年，连T的影子都没摸到。」",
"他合上账本，声音有些疲惫：「但这至少是个方向。谢了，小子。你这趟来，帮了大忙。」"
],
options:[
{t:"把学院的线索告诉他", go:"west_exchange"},
{t:"帮他一起查R", go:"west_oldcrow_story"}
]
}};

N["west_exchange"]=function(){return{
place:"海风港·第七仓库",
text:[
"你把学院的线索原原本本告诉老鸦：埃德蒙的身份、塔楼里的密室、第七印碎片、克莱门特的手令、暗账房的老头、战魂守卫的话。",
"老鸦听完，沉默了很久。他摩挲着缺了小指的左手，开口时声音很轻：",
"「埃德蒙——他还在守塔楼。」他说，「我以为他早该退了。二十年前，我们一起进守望者。他选了学院，我选了西海岸。现在想想——」他苦笑，「他守的是封印，我查的是钱。到头来，是一件事。」",
"「第七印碎片——你也知道？」你问。",
"「知道。那笔钱养封印的事，我二十年前就知道了。」老鸦说，「但我查的，是钱的另一端——如果维持封印的材料一直靠西海岸的钱供养，那断了钱的人，就是想让封印松动的（人）。所以我才查磐石，查R——我想知道，是谁在暗中断这条命脉。」",
"他站起身，走到仓库门口，望着夜色中的海面：「你回去告诉埃德蒙——封印的事，我不会忘。但我得先弄清楚R是谁。如果连供养封印的钱都被操控了，那学院地下那口石棺，迟早会守不住。」",
"海风从门外灌进来，吹动他的灰袍。你看着他的背影，忽然觉得，这个老人比传闻中更固执——也更孤独。"
],
options:[
{t:"帮他一起查R的下落", go:"west_oldcrow_story"},
{t:"先了解西海岸的其他势力", go:"west_hub"}
]
}};

N["west_oldcrow_story"]=function(){return{
place:"海风港·第七仓库",
text:[
"你问起老鸦这三年的事。他靠着货堆坐下，点了一袋烟，烟雾在油灯下缓缓上升：",
"「三年前，我查到了磐石的账目异常——有一笔钱，不是流向材料商，而是流向一艘船。那艘船每月十五号离港，目的地不明。我托人混上船查了一次——」他顿了顿，烟灰落在衣摆上，「船上装的不是货，是人。一船一船的人，被送去一个叫『白崖』的地方。」",
"「白崖？」",
"「西海岸以南，地图上没有的岛。」老鸦说，「我查了两年，终于确认：那笔钱，除了养封印，还在养一艘运人的船。而船上的人——都是从大陆各处『失踪』的学生。」",
"你心头一震：「失踪的学生？」",
"「学院里那些『转学』的学生——」老鸦看着你，「他们的档案上写着转学，实际被送去了白崖。白崖上有什么，我不知道。但我知道——」他压低声音，「那个地方，和磐石背后的R，脱不了干系。」",
"油灯噼啪响了一声。仓库外，海潮声一波接一波，像无数被送走的人，在海里低声说话。"
],
options:[
{t:"问白崖的具体位置", go:"west_white_cliff"},
{t:"先把消息带回学院", go:"west_return"}
]
}};

N["west_white_cliff"]=function(){return{
place:"海风港·码头",
text:[
"老鸦给你画了一张白崖的海图——西海岸以南，绕过一片礁石群，一座地图上没有标注的岛。图上用红笔圈着：「白崖。航程一日夜。」",
"「你想去？」老鸦看着你的表情，问。",
"「那些失踪的学生——」你说，「如果他们真的在那里，总得有人去看看。」",
"老鸦没有立刻接话。他沉默了很久，说：「我老了，不能再跑远海了。你要去，我不拦你——但你要记住三件事：一，别在白天靠近，白崖周围的巡逻船很密；二，船上如果遇到穿灰袍的人，别信他说的任何话；三——」他顿了顿，「如果你回不来，至少把这里的线索带回学院。」",
"他递给你一卷羊皮纸：「这是我这三年查到的所有账目副本。你带回去，交给埃德蒙——或者，交给你信得过的人。」",
"你接过羊皮纸，沉甸甸的，像一个老人三年的重量。",
"「白崖的航路，我托船老大老丁带你过去。他欠我一条命。」老鸦说，「明早涨潮，码头东段，他的船『海燕号』。」"
],
options:[
{t:"明早出海，去白崖", go:"west_sea_journey"},
{t:"先安顿好线索，改日再去", go:"west_hub"}
]
}};

N["west_sea_journey"]=function(){return{
place:"海上·海燕号",
text:[
"天没亮，你就在码头东段找到了「海燕号」——一艘吃水很深的渔船，船头漆着一只褪色的海燕。船长老丁是个黑脸汉子，听你报了老鸦的名字，点点头，没多问，只说：「风浪大，抓稳。」",
"船驶出港湾，海面由浑浊的绿渐渐变成深蓝。清晨的阳光洒在海面上，碎成千万片金鳞。你站在船头，第一次真正理解老鸦那句话——「海是蓝的」。",
"航行了半日，海面开始变得不平静。远处，一片礁石群像獠牙一样露出水面，浪花在礁石上撞成白沫。老丁压低声音：「过了这片礁石，就是白崖的地界。他们的巡逻船，专挑白天抓人。」",
"他调转船头，钻进礁石群之间的水道。浪打在船舷上，溅起咸涩的水花。你紧紧抓着船舷，听见自己心跳的声音，被浪声盖过。",
"绕过最后一块礁石时，你看见了——海天交界处，一座灰白色的悬崖拔海而起，崖顶隐约可见几座建筑。白崖。",
"老丁把船靠进一片隐蔽的礁石湾：「我只能送你到这。夜里涨潮前，我在这儿等你。记住——别让人看见你。」",
"你跳下船，踩上潮湿的礁石。回头看了一眼海燕号，然后朝白崖的方向，摸了过去。"
],
options:[
{t:"潜入白崖", go:"west_cliff_1"}
]
}};

N["west_cliff_1"]=function(){return{
place:"白崖·崖底",
text:[
"白崖的崖壁近乎垂直，只有一条窄窄的石阶蜿蜒而上，入口处立着两个打盹的守卫。你绕到崖侧，抓住藤蔓，一点点往上攀。海风在耳边呼啸，崖下的浪花像白色的獠牙。",
"你攀到一半，头顶忽然传来脚步声——你紧贴崖壁，屏住呼吸。两个穿灰袍的人从你上方走过，其中一人说：「今晚又有一批，三十个。老规矩，先关水牢，明天送下去。」",
"另一人打了个哈欠：「送下去干什么？那地方到底有什么？」",
"「不该问的别问。」前一人压低声，「上面的规矩——知道了，你也会被送下去。」",
"脚步声远去。你继续往上爬，翻上崖顶。崖顶是一个院子，正中是一座石砌的建筑，大门紧闭，门口挂着灯笼，写着两个字：「客舍」。",
"客舍。你看着那两个字，心里发凉——被送到这里的人，被当作「客人」。你贴着墙根，绕向建筑侧面。一扇半开的窗户里，传来低低的哭声。"
],
options:[
{t:"从窗户看看里面", go:"west_cliff_2"},
{t:"先找入口潜入建筑", go:"west_cliff_3"}
]
}};

N["west_cliff_2"]=function(){return{
place:"白崖·客舍",
text:[
"你凑近那扇半开的窗户。屋里光线昏暗，靠墙坐着几个人影——穿着学院制服的年轻人，有的抱着膝盖发呆，有的低声啜泣。一个穿灰袍的人站在门口，手里端着一碗粥，语气不耐烦：「吃不吃？不吃饿死。」",
"一个女生抬起头，声音沙哑：「放我们回去。我们是学院的学生，家里会找来的——」",
"「找来的都送下去了。」灰袍人打断她，「老老实实待着，还能多活几天。闹腾的，今晚就送。」",
"他放下粥，转身离开。屋里重新陷入沉默。你数了数——屋里大约七八个人，身上穿着不同学院的制服：有艾尔达的，有圣光的，还有几件你认不出校徽的。",
"你心里翻涌。这些人——都是「转学」的学生。你想起学院公告栏上一张张「转学」通知，原来它们的终点，是这里。",
"你正想翻窗进去，走廊尽头传来脚步声。你迅速缩回墙根。一个披着斗篷的身影从走廊走过，脚步很轻——他停在关着学生的房间门口，低声对守卫说：「今晚这批，先挑两个送下去。老规矩——签字画押，按『自愿』办。」",
"斗篷下，你隐约看见他的手——左手，缺一根小指。",
"你整个人僵住了。老鸦？不——老鸦的手，缺的是小指。这个人，也缺小指？还是说——你猛地想起来，老鸦说他的左手缺一根小指，是你亲眼确认过的。而眼前这个人……",
"你看着那只缺了小指的手，心里第一次，对「老鸦」这个名字，产生了动摇。"
],
options:[
{t:"跟上那个斗篷人", go:"west_cliff_3"},
{t:"先救学生，再查斗篷人", go:"west_cliff_rescue"}
]
}};

N["west_cliff_3"]=function(){return{
place:"白崖·客舍走廊",
text:[
"你贴着墙根，远远跟着那个斗篷人。他穿过走廊，下了一段石阶，来到一扇铁门前。守卫见他，立刻行礼：「大人。」",
"斗篷人没有停，推门进去。门内是一间陈设简单的房间——桌上摊着账本，墙边立着一排铁柜。他摘下兜帽，坐在桌前，翻开账本，开始写字。",
"你从门缝里看进去，烛光照亮他的脸——一张陌生的脸，不是你见过的老鸦。但你注意到，他的左手缺一根小指，与老鸦一模一样。",
"他写了一会儿，忽然停下，低声自言自语：「老鸦那老东西，还在查。查吧——查到白崖来，正好送他下去。」",
"他抬起头，目光恰好朝门缝的方向扫过来。你迅速缩回身，心跳如擂。他没有追出来，只是冷笑着说了一声：「外面那位，进来吧。门没锁。」",
"你僵在门外。他的声音隔着门传来：「你是老鸦派来的，还是学院派来的？不管是哪边——你既然看见了，就别想活着离开了。」"
],
options:[
{t:"推门进去，会会他", go:"west_cliff_face"},
{t:"转身就跑", go:"west_cliff_flee"}
]
}};

N["west_cliff_face"]=function(){return{
place:"白崖·斗篷人的房间",
text:[
"你推门进去。斗篷人坐在桌前，没有起身，只是打量你，像看一只误入的猎物。",
"「胆子不小。」他说，「敢一个人摸上白崖。」",
"「你是谁？」你问。",
"「白崖的管事。你可以叫我——R。」他笑了笑，笑容没什么温度，「你查的那个R，就是我。」",
"你心里一沉。R——不是组织代号，是一个人。",
"「那些学生——」你压着声音，「是你送走的？」",
"「送走？」R嗤笑一声，「我这是『安置』。大陆上那些学院，每年都有『多余』的学生——成绩太差的、知道太多的、得罪了不该得罪的人的。他们无处可去，我给他们一条活路。白崖给他们吃住，教他们手艺——条件是，签一份『自愿协议』，终身留在岛上。」",
"「自愿？」你握紧了拳头，「你管这叫自愿？」",
"R放下笔，站起身：「叫什么都行。重要的是——这个流程，已经运转了三十年。你改变不了它，我也不想改变它。但你要是想活着离开白崖——」他顿了顿，「最好，别做多余的事。」",
"烛火跳了跳。房间里，账本摊开，墨迹未干。你站在桌前，与R隔着几步路，一明一暗。"
],
options:[
{t:"直接动手", go:"west_cliff_fight"},
{t:"先稳住，套出更多信息", go:"west_cliff_more"}
]
}};

N["west_cliff_fight"]=function(){return{
place:"白崖·斗篷人的房间",
text:[
"你拔剑出鞘。R没有躲，反而笑了：「我就知道。」他抬手一挥，墙边的铁柜猛地炸开——里面没有武器，飞出的是十几条铁链，像活蛇一样朝你缠来。",
"你挥剑格挡，铁链发出刺耳的碰撞声。R站在铁链后面，声音平静：「白崖的每一任管事，都学过『万铁术』。你以为我是文职？我杀过的人，比你见过的学生还多。」",
"铁链越缠越紧，你被逼到墙角。你抓住一个空隙，一剑削断缠住脚踝的铁链，借力跃起，剑尖直刺R的胸口——",
"他侧身避开，但你的剑锋还是划破了他的斗篷。斗篷裂开，露出里面的衣物——一件学院的旧制服，胸口绣着一枚你熟悉的校徽：艾尔达大陆学院。",
"你的动作顿住了。R低头看了一眼撕裂的斗篷，苦笑：「看出来了？我也是艾尔达的。三十年前毕业的。」",
"他抬起头，看着你：「你现在，还觉得你能改变什么吗？」"
],
options:[
{t:"继续战斗", go:"west_cliff_boss"},
{t:"放下剑，听他说完", go:"west_cliff_more"}
]
}};

N["west_cliff_more"]=function(){return{
place:"白崖·斗篷人的房间",
text:[
"你放下剑。R也收起了铁链。他坐回桌前，重新翻起账本，像什么都没发生过：",
"「想听故事？好，给你讲一个。」他说，「三十年前，我也是个像你一样的学生——查账、查真相、觉得自己能改变世界。我查到了磐石，查到了白崖，一路查到了R面前。然后R告诉我：这个世界的问题，不是钱，不是权力——是人太多。」",
"「他说：大陆上每一年，都会产生成千上万个『多余的人』。学院也好，教会也好，都在用各种方式处理他们——转学、失踪、意外。白崖不是罪恶，白崖是『解决方案』。它给这些人一个体面的去处，让他们不会成为乱世的柴薪。」",
"「你信了？」你问。",
"「我用了十年去验证。」R说，「这十年里，我看到的每一件事，都在证明他是对的。所以我接了他的班，成了新的R。」他看着你，「你也可以走同样的路——或者，走你自己的路。但不管哪条路，你都得先明白：这个世界，没有干净的答案。」",
"窗外，海风呼啸。你站在桌前，看着这个穿着学院旧制服的白崖管事，一时说不出话。"
],
options:[
{t:"拒绝他的说法，坚持救人", go:"west_cliff_boss"},
{t:"先退出去，从长计议", go:"west_cliff_flee"}
]
}};

N["west_cliff_boss"]=function(){return{
place:"白崖·客舍前院",
text:[
"你拒绝了他的说辞。R叹了口气，像是惋惜，又像是早有预料。他抬起手，铁链再次腾起，这一次更快、更狠。",
"你们在房间里交手，铁链与剑刃碰撞，火花四溅。你渐渐摸清他的路数——万铁术依赖铁链的数量，而房间的空间有限。你把他引向墙角，一剑劈开缠住他的铁链，直取中路——",
"R侧身，但慢了半拍，你的剑尖抵住了他的咽喉。他停下动作，铁链纷纷落地。",
"「好身手。」他说，语气里没有恐惧，「杀了我，白崖会换一个管事。那些学生还在。你救不了所有人——但你可以救今晚这一批。」",
"他抬手，从怀里摸出一把钥匙，扔给你：「水牢的钥匙。西边走廊尽头，下两层。你带他们走——从崖后的小路，能到海边。老丁的船，应该还在等。」",
"你接过钥匙，看着他。他没有再动，只是说：「走吧。趁我还没改变主意。」",
"你攥紧钥匙，转身冲出房间。身后，R的声音飘来：「记住——白崖不是终点。真正送学生来这里的，是大陆上的那些人。」"
],
options:[
{t:"去水牢救人", go:"west_cliff_rescue"}
]
}};

N["west_cliff_rescue"]=function(){return{
place:"白崖·水牢",
text:[
"你顺着走廊下到水牢。潮湿的霉味扑面而来，石壁上挂着火把，映出水里关着的人影——铁栅栏后，十几个年轻人泡在齐腰深的海水里，脸色苍白。",
"你打开牢门，压低声音：「我是来救你们的。别出声，跟我走。」",
"学生们愣了一瞬，然后互相搀扶着爬起来。你带着他们，沿R说的崖后小路，绕向海边。海风很冷，有人在发抖，但没有人出声。",
"你们摸到礁石湾时，海燕号的轮廓在夜色里静静泊着。老丁看见你们，二话不说，放下跳板。学生们一个接一个上船，你站在岸边，最后回头看了一眼白崖——崖顶的灯火，在夜色里明灭不定。",
"船离岸时，你听见崖上传来一声极轻的叹息。不知道是风，还是R的。",
"海燕号驶入夜色。船舱里，一个获救的女生拉着你的袖子，声音发抖：「谢谢你……我们以为，这辈子都回不去了。」",
"你拍拍她的手背：「回家了。睡一觉，就到了。」",
"海面上，月光碎成一片银鳞。你站在船头，想着R最后那句话——「真正送学生来这里的，是大陆上的那些人。」那又是谁？"
],
options:[
{t:"带着学生们回海风港", go:"west_return"}
]
}};

N["west_cliff_flee"]=function(){return{
place:"白崖·崖边",
text:[
"你转身就跑。身后没有追兵——R没有追来，甚至没有喊人。你冲到崖边，抓住藤蔓，飞速下滑。海风灌进衣领，你手心里全是冷汗。",
"你落回礁石湾时，腿还在发软。回头看去，崖顶的灯火依然明灭，像什么都没发生过。",
"你跳上海燕号。老丁见你脸色不对，没有多问，只说了句：「坐稳了。」船驶离礁石群，白崖在夜色里渐渐缩小，变成海天之间一道灰白色的影子。",
"你靠船舷坐下，脑海里反复回放那间房间里的画面——铁柜、账本、缺了小指的斗篷人。R说，他三十年前也是查真相的学生。而你，会不会有一天，也变成他？",
"海浪拍着船舷，你闭上眼睛。答案没有浮上来，只有咸涩的风，一遍遍掠过。"
],
options:[
{t:"回海风港整理思绪", go:"west_hub"}
]
}};

N["west_ranger_academy"]=function(){return{
place:"西海岸·游侠学院",
text:["游侠学院的校舍，比想象中要朴素。", "几排石屋，一个练武场，没有围墙——游侠们说，围墙是给需要安全感的人准备的。他们不需要。", "一个戴旧皮帽的中年人接待了你。他说话的时候不看你的眼睛，看你的手：「手上有茧，握过家伙。在城里跑过腿，还是干过活？」", "你如实说了。他点了点头：「行。游侠不收娇客。你能吃苦，就能留下——不能，就走。」", "他带你在学院里转了一圈。练武场上，有人在练刀，有人在练箭，还有一个人，蹲在角落里，一下一下地磨一把已经磨得很亮的刀。", "「他在磨什么？」你问。", "「磨他的耐心。」皮帽中年人说，「游侠的刀，一半在手上，一半在心上。」", "游侠学院建在海风港北段的悬崖上，院墙是就地取材的灰石，门楣上刻着一句古语：「风不等人，剑不回头。」", "这里的学生大多晒得黝黑，穿着皮甲，腰挎短剑，走路带风。你在门口站了一会儿，一个扎马尾的女生走过来，上下打量你：「外地来的？来借住，还是来求学？」", "「随便看看。」你说。", "「随便看看的人，一般不看这里。」她挑眉，「游侠学院不收闲人——除非你能证明自己有用。会看风向吗？会修桅杆吗？会打架吗？」", "你还没回答，她忽然抽出短剑，剑尖指着你：「会打架的话——来，比划比划。输了，请我喝酒。」", "风从悬崖边灌过来，吹动她的马尾。周围的游侠学生纷纷停下脚步，饶有兴致地看过来。", "他带你到学院后面的悬崖边。崖下是海，海浪拍着礁石，溅起白沫。", "「我们收留的人，什么来路都有。」他说，「逃兵的、破产的、被通缉的、还有不想回家乡的。他们来这里，不是要当英雄——是想学会，怎么在乱世里，把自己的日子过下去。」", "他转过头，第一次直视你的眼睛：「你也是一样。你不欠这个世界什么，可你得学会，怎么不让自己被它吞掉。」", "海风把他的旧皮帽吹得猎猎作响。你站在崖边，看着那片无边的海，忽然觉得，他说的，和你心里想的，是同一件事。", "你点了点头。没有说更多的话。"] /*v45inj:west_ranger_academy*/,
options:[
{t:"接受挑战", go:"west_ranger_fight"},
{t:"婉拒，问些学院的事", go:"west_ranger_talk"}
]
}};

N["west_ranger_talk"]=function(){return{
place:"西海岸·游侠学院",
text:[
"你笑着摆手：「打架就算了。我是来找人的——一个灰袍老人，左手缺一根小指，常年在西海岸走动。你们见过吗？」",
"扎马尾的女生收起短剑，眼神变了一瞬：「老鸦？你找他？」",
"「你认识他？」",
"「西海岸的人，谁不认识老鸦。」她抱臂靠在墙边，「他救过我们院长一命，是我们学院的挂名顾问。前些天他还来过——在课堂上给我们讲了三天『如何分辨走私船和渔船』。老爷子精神得很。」",
"「那他最近在哪？」你追问。",
"「几天前去了海风港，说要查一笔账。」她想了想，「他说，这笔账查完，就回学院养老——『船跑不动了，就让年轻人去跑。』」",
"你心里一动。老鸦——他果然还活着，还在查。你谢过她，准备离开。她在背后喊了一句：「见到他，替我们带句话——游侠学院的酒，还欠他一顿！」"
],
options:[
{t:"回海风港找老鸦", go:"west_warehouse"},
{t:"再逛逛游侠学院", go:"west_ranger_more"}
]
}};

N["west_ranger_more"]=function(){return{
place:"西海岸·游侠学院训练场",
text:[
"你走进游侠学院的训练场。这里没有学院的围墙和钟楼，只有海风、沙袋、和绑在木桩上的靶子。学生们三人一组对练，短剑碰撞声清脆利落。",
"一个独眼教官看见你，走过来：「新来的？武器带了吗？」",
"「我不是来求学的。」你说。",
"「那你是来看热闹的？」他哼了一声，「游侠学院没有热闹可看——只有沙、汗、和血。你要真想学点什么，那边有个沙袋，打两拳我看看。」",
"你走到沙袋前，试着打了两拳。独眼教官看着你的姿势，点评道：「架子还行，力道不够。学过剑？」",
"「在学院里学过一点。」",
"「学院里的剑，是礼仪剑。西海岸的剑，是吃饭的剑。」他拍拍沙袋，「你要是想在西海岸活得好，就得学会——剑比嘴快，眼比手快。」",
"他说完，转身走向训练场深处。你站在沙袋前，想着他的话，又打了两拳。"
],
options:[
{t:"回海风港", go:"west_hub"},
{t:"去游侠要塞", go:"west_fort"}
]
}};

N["west_ranger_fight"]=function(){return{
place:"西海岸·游侠学院训练场",
text:[
"你拔出武器。扎马尾的女生眼睛一亮，摆出起手式——她的姿势很低，重心压得很稳，一看就是常年在船上和悬崖边练出来的身法。",
"她先动手，短剑又快又刁，专挑你的下盘和侧腰招呼。你格挡了几招，渐渐摸清她的路子——她打得很「野」，没有学院里的章法，但每一剑都冲着实用去。",
"你抓住她一个换气的空隙，剑尖虚晃，逼她侧身，然后一个扫腿——她没料到你会用腿，脚下一绊，向后仰去。你伸手拉住她的手腕，把她扶住。",
"她站稳，愣了一下，然后哈哈大笑：「行啊！还留了一手。」她收起短剑，拍了拍你的肩，「输了，我请喝酒。走，训练场后头有家馆子，烤鱼一绝。」",
"你跟着她往训练场后走。风从海面吹来，带着咸味和烤鱼的香气。这个西海岸的游侠学院，比你想象中——更有人情味。"
],
options:[
{t:"跟她去吃烤鱼，顺便打听消息", go:"west_ranger_tavern"}
]
}};

N["west_ranger_tavern"]=function(){return{
place:"西海岸·游侠学院后巷",
text:[
"烤鱼馆子就在训练场后头，露天的棚子，炭火烤得滋滋响。扎马尾的女生叫简，是游侠学院的三年级生。她给你倒了一碗劣酒，自己先干为敬：",
"「你这身手，在学院里混过？」她问。",
"「混过。」你含糊地说。",
"「学院里的事，我不打听。」她撕了一条烤鱼，「不过西海岸这边，有件事你可能感兴趣——最近走私通道那边，来了个『新东家』，出手特别阔绰。有人说，他背后是教会的人；也有人说是帝国军部。但最怪的是——」她压低声音，「他收的『货』，不全是走私品。有些是……人。」",
"「人？」你心里一紧。",
"「嗯。半夜运的那种，用麻袋装着，往南边送。」简喝了口酒，「我们学院的人盯过几次，但对方人手多，跟丢了。」她看着你，「你如果要对这条线有兴趣——小心点。南边那片迷雾森林，进去的人，十个里能出来三个就不错了。」",
"炭火噼啪响。烤鱼的香气混着海风，你嚼着鱼肉，把「走私通道」这个名字，记进了心里。"
],
options:[
{t:"去迷雾森林看看", go:"west_mist_1"},
{t:"回海风港", go:"west_hub"}
]
}};

N["west_fort"]=function(){return{
place:"西海岸·游侠要塞",
text:[
"游侠要塞建在山口，扼守着进入西海岸内陆的咽喉。城墙厚重，垛口密布，瞭望塔上的哨兵远看像一只只黑色的鸟。",
"你走近城门时，守卫拦住你：「口令。」",
"「我不是游侠，是过路的。」你说。",
"守卫打量你片刻：「过路的？最近西海岸不太平，要塞不接待闲人。你要进城，去找要塞的军需官登记——他在东门市场。不过——」他顿了顿，「最近来要塞登记的人，十个里有八个，后来都去了白崖。」",
"白崖。你心里一紧。这个名字，又一次出现了。",
"「白崖是什么地方？」你装作不经意地问。",
"守卫上下看你一眼，没有回答，只是挥挥手：「快走快走。有些名字，别乱打听。」",
"你走进城门。要塞里秩序井然，兵士列队巡逻，铁匠铺叮当作响。你沿着街道走，心里却在想那个名字——白崖。"
],
options:[
{t:"去东门市场找军需官", go:"west_fort_market"},
{t:"在要塞里转转", go:"west_fort_walk"}
]
}};

N["west_fort_market"]=function(){return{
place:"游侠要塞·东门市场",
text:["要塞的市场不大，半个时辰就能逛完。可东西很杂——北边的皮毛、南边的盐、东边的布、还有海货，腥气冲天。", "你在一个卖旧货的摊子前停下来。摊上摆着一堆杂物：生锈的罗盘、缺角的陶碗、几本泡过水又晒干的书。", "摊主是个独眼的老头，见你翻书，懒洋洋地说：「两铜板一本，不还价。都是海上捞的，或者死人身上扒的——你要是不忌讳，随便挑。」", "你挑了一本封面最旧的。翻开，扉页上写着一行字，墨迹已经晕开了：「致我的女儿——无论你在哪里，爹都爱你。」", "你合上书，付了两个铜板。老头看了你一眼，难得地没有吭声。", "东门市场比海风港的鱼市小，但更整齐。军需官的摊位在角落，一个精瘦的中年人，正往账本上记着什么。你走过去，他头也不抬：「要什么？箭矢、干粮、还是防潮的火绒？」", "「我想打听点事。」你说，「关于白崖。」", "军需官的笔停了。他抬起头，目光在你脸上扫了一圈：「白崖的事，要塞里没人敢提。你要真想问——」他压低声音，「去找北城门的守夜人老霍。他年轻时在白崖当过差，后来逃出来了。」", "「他不会告诉我吧？」", "「他欠我一条命。」军需官说，「你提我的名字——老崔。他会跟你说的。」", "你谢过他，转身往北城门走。身后，军需官的声音飘来：「小子，白崖的水，深得很。打听归打听，别往里蹚。」", "你拿着那本书，在市场的角落里坐下来，慢慢地翻。书里夹着一张干枯的纸，折得很小——是一张画，画着一个扎辫子的小姑娘，抱着一只猫，笑得眼睛弯弯的。", "你看了很久，把那张画重新夹回去，合上书。", "你把书放进怀里。它不是你要找的东西，可你决定带着它。", "你站起来，走回要塞。路过那行「此门只进不退」的门楣时，你停了一下，摸了摸怀里的书。", "你想：有些东西，不该被海风泡烂。"] /*v45inj:west_fort_market*/,
options:[
{t:"去找守夜人老霍", go:"west_fort_watch"},
{t:"先回海风港", go:"west_hub"}
]
}};

N["west_fort_watch"]=function(){return{
place:"游侠要塞·北城门",
text:[
"北城门的守夜人老霍，是个头发花白的老兵，正坐在墙根晒太阳。听你提了军需官老崔的名字，他沉默了一会儿，才说：",
"「白崖……」他眯起眼，望着远处的海面，「我在那儿干了五年。每天做的事，就是看着船靠岸，看着船上的人被带下来，送进崖上的『客舍』。」",
"「那些人是干什么的？」你问。",
"「干什么的？」老霍嗤笑一声，「干活的。白崖底下有个矿洞，常年需要人手。那些学生——都是送去挖矿的。挖出来的矿，运回大陆，卖给各大势力。」",
"「什么矿？」",
"「不知道名字。但我知道——那矿的颜色，发蓝，夜里会发光。管事们叫它『星尘矿』。」老霍顿了顿，声音低下去，「有一次，我看见一个学生挖矿挖到吐血，管事说：『没事，死了换一批。大陆上多余的人，多的是。』」",
"他吐了口唾沫：「我干不下去，就逃了。逃了三年，才逃到要塞。」他看着你，「你要查白崖——先想清楚，你能不能承受那些东西。」",
"日头很晒。你站在墙根下，看着老霍沟壑纵横的脸，一时没有说话。"
],
options:[
{t:"记下星尘矿的线索", go:"west_hub"},
{t:"继续打听白崖的底细", go:"west_fort_more"}
]
}};

N["west_fort_more"]=function(){return{
place:"游侠要塞·城墙",
text:[
"你请老霍喝了顿酒，他打开了话匣子：",
"「白崖的底细，我知道的不多，但有一点可以肯定——它背后不是一个人，是一个组织。每个季度，白崖都会向大陆的某个势力『供货』。我见过一次接货的人——穿着圣光的白袍。」",
"「圣光教会？」你追问。",
"「我不敢确定。但那身白袍，我认得。」老霍又喝了口酒，「还有，白崖的管事换过好几任，每一任都姓『R』——不是名字，是代号。管事之间互相不认识，只认信物。」",
"「什么信物？」",
"「一枚铁牌，上面刻着字母。」老霍比划了一下，「我见过一次，是个『T』字。」",
"T。你心头剧震——又是T。白崖的管事信物，是T；守望者高层的神秘代号，也是T。这两者之间，到底是什么关系？",
"你付了酒钱，告别老霍。走出酒馆时，夕阳正把要塞的城墙染成暗红色。你站在街上，把「T」和「R」这两个字母，在脑子里翻来覆去地拼。"
],
options:[
{t:"回海风港整理", go:"west_hub"}
]
}};

N["west_fort_walk"]=function(){return{
place:"游侠要塞·街道",
text:["你退下垛口，沿着城墙根慢慢走。要塞的石头缝里，长着一些不知名的草，被海风吹得伏在地上，却还活着。", "墙根下蹲着几个卸货的苦力，正在啃干粮。他们看见你，也不打招呼，只是把你从头到脚打量了一遍，又低下头去。", "你走到要塞的东门。门洞很宽，能并排过两辆大车。门楣上刻着一行字，被海风蚀得模糊，你凑近才看清：「此门只进不退。」", "你站在那行字下，看了很久。海风从门外灌进来，带着咸味和远处船工的号子声。", "你忽然明白，这座要塞为什么没有谈笑声了——住在这里的人，都听过太多「只进不退」的故事。", "你在要塞里走了半圈。这里的气氛与学院截然不同——没有谈笑声，没有悠闲的学生，只有来来往往的兵士和商人，人人行色匆匆。", "城墙上，每隔一段就有一个瞭望口，面朝大海。你站在一个瞭望口前，看见远处的海面上，有一艘船正缓缓驶向南方——船舷吃水很深，像是满载货物。", "你目送那艘船消失在视野尽头。它去的方向，正是白崖的方向。", "一个哨兵注意到你，喊了一声：「喂！别站在垛口，危险！」你退后几步，朝他点点头。哨兵又补了一句：「看船看什么？南方那片海，没什么好看的——都是送人的船。」", "你心里一沉，没有多问，转身走开。但「送人的船」这几个字，像一根刺，扎在了你心里。", "你出了东门，沿着海边的小路走了一段。潮水正在退，露出大片湿漉漉的礁石，上面爬满贝壳。", "一个老渔民蹲在礁石上，收拾渔网。你走过去，他抬头看了你一眼：「找船？」", "你摇头，问他：「『送人的船』，是什么意思？」", "他沉默了一会儿，手里的梭子没有停：「海那头有个地方，叫白崖。犯了事的人，或者……不想活的人，会被送上船，去白崖。」", "「去了白崖的人，」他顿了顿，「没有一个回来的。」", "你望着南方的海面。天边，那艘船已经只剩下一个黑点。你忽然觉得，那个黑点，像一颗沉进海里的、不会再浮起来的东西。"] /*v45inj:west_fort_walk*/,
options:[
{t:"回海风港", go:"west_hub"}
]
}};

N["west_mist_1"]=function(){return{
place:"西海岸·迷雾森林边缘",
text:["海上的雾，是一堵墙。", "你站在船头，看着雾从海面漫过来，像一层薄薄的、灰色的水，先是没过远处的浪尖，然后没过整片海。", "船老大压低了声音：「进雾了。都别说话，别点灯，别敲东西。」", "船在雾里行得很慢，像在摸索着走路。你什么都看不见，只能听见水声，还有船身轻微的吱呀声。", "雾里很安静。安静得不像海。", "你忽然听见，雾的深处，有什么东西在唱歌——很轻，很远，像一首哄孩子睡觉的歌。", "迷雾森林在海风港以南，常年笼罩在浓雾里，太阳都晒不透。树影在雾中影影绰绰，脚下的路被落叶和苔藓覆盖，每一步都踩得虚浮。", "你沿着一条半隐的小路走进森林。雾气越来越浓，能见度不足十步。耳边只有自己的脚步声，和远处不知名的鸟鸣。", "你走了约半个时辰，忽然听见前方传来窸窣声——像有什么东西在雾里移动。你停住脚步，握紧武器，屏住呼吸。", "雾里，一个佝偻的身影缓缓出现——是个裹着破布的老妇人，背着一捆柴，看见你，先是一惊，然后笑了：「吓我一跳，还以为是『雾里鬼』。」", "「雾里鬼？」你问。", "「这片林子里的东西。」老妇人摆摆手，「专挑落单的人下手。你一个人进来——胆子不小。」她打量你两眼，「找路？还是找人？」", "那歌声一响，船老大的脸色就变了。他几步冲过来，压低声音：「捂住耳朵！别看！」", "你捂住耳朵，可那歌声还是往脑子里钻——不是从耳朵进去的，是贴着骨头，一寸一寸地往里渗。", "你看见船上的几个水手，眼神开始发直，有人已经扶着船舷，往雾里探出半个身子。", "船老大一脚一个，把他们踹翻在地：「都他妈给我醒醒！」他转过头，盯着你，「你，别看海面！看船板！」", "你死死盯着脚下的船板。木头的纹理在你眼前打转，那歌声越来越远，最后像被雾吞掉了一样，消失了。", "雾散去的时候，你才发现自己的后背，已经被冷汗浸透了。"] /*v45inj:west_mist_1*/,
options:[
{t:"问路，打听走私通道", go:"west_mist_2"},
{t:"谢过她，继续深入", go:"west_mist_3"}
]
}};

N["west_mist_2"]=function(){return{
place:"西海岸·迷雾森林",
text:[
"「打听走私通道？」老妇人听了你的问题，摇摇头，「那条路啊——以前是猎户和货郎走的小道，现在被那伙人占了，成了运货的路。你要走那条路，得绕开他们的岗哨。」",
"她在柴堆里摸出一块黑布：「这是我儿子留下的——他是猎户，进山打猎用的。绑在手上，雾里人能认出你是『自己人』，不拦你。」",
"「你儿子呢？」你问。",
"老妇人低下头，半晌才说：「半年前进山，再没回来。有人说他被那伙人带走了，也有人说他掉进『雾里鬼』的窝了。我不知道哪个是真的。」她抬头，勉强笑了笑，「你要是哪天在山里见着一个脸上有疤的年轻人——替我问一声，他娘还在等他回家吃饭。」",
"你接过黑布，绑在手腕上。布条粗糙，带着柴火的烟气。你朝老妇人点点头，转身走进雾里。身后，她的声音飘来：「山路不好走，小心脚下。」"
],
options:[
{t:"沿走私通道前行", go:"west_smuggle_1"}
]
}};

N["west_mist_3"]=function(){return{
place:"西海岸·迷雾森林深处",
text:[
"你告别老妇人，继续深入森林。雾更浓了，连脚下的路都看不清。你只能凭感觉走，踩过腐叶，绕过枯木。",
"忽然，你听见一阵极轻的歌声——像是有人在雾里哼唱。你循声走了几步，雾里隐约浮现出一个轮廓：一个人影坐在树根上，背对着你，正低头哼着歌。",
"你正想开口，那人忽然停住歌声，缓缓侧过头——雾太浓，你看不清他的脸，只能看见一双灰白色的眼睛，没有瞳孔。",
"「外来者。」他的声音很轻，像雾一样飘忽，「你身上，带着海的气味，还有——」他吸了吸鼻子，「还有封存的气味。你碰过封印。」",
"你后退一步。他站起身，没有追，只是说：「这片林子里的『雾里鬼』，就是我这种人——被雾吃掉了一半的人。你身上有封印的气息，它们会来找你。趁还能走，离开这里。」",
"他说完，转身消失在雾里。你站在原地，后背发凉。你低头看自己的手——虎口的纹路，在雾里微微发亮。"
],
options:[
{t:"听从劝告，离开森林", go:"west_hub"},
{t:"继续深入，找走私通道", go:"west_smuggle_1"}
]
}};

N["west_smuggle_1"]=function(){return{
place:"西海岸·走私通道入口",
text:[
"走私通道藏在迷雾森林南端的一处断崖下——一条被人踩出来的窄路，从崖缝里穿过，通往海边。路口立着一块木牌，上面画着一个骷髅，和一行字：「生人勿近」。",
"你绑着老妇人给的黑布，压低身形，沿窄路往里走。崖壁在两侧收紧，头顶只剩一线天。走了约一炷香，前方豁然开朗——一处隐蔽的海湾，泊着几艘吃水很深的船。",
"岸边堆满货箱，几个赤膊的汉子正往船上搬货。你藏在岩石后观察了一会儿，注意到一个细节：货箱上都有一个标记——一只闭眼的猫头鹰。",
"你想起「磐石」铸造坊门上的那只独眼猫招牌。同一个意象。磐石——走私通道——白崖，果然是同一条线。",
"你正要靠近，一个汉子忽然抬头，朝你的方向看过来：「谁在那？」"
],
options:[
{t:"现身，用黑布搪塞", go:"west_smuggle_2"},
{t:"转身撤退", go:"west_smuggle_3"}
]
}};

N["west_smuggle_2"]=function(){return{
place:"西海岸·走私湾",
text:[
"你从岩石后走出来，抬起绑着黑布的手腕：「自己人。我娘是山里的猎户，让我来捎句话——说你们这批货，走得太慢了，山道那边查得紧。」",
"汉子打量了你几秒，目光在你手腕的黑布上停了停，然后挥挥手：「行，知道了。回去告诉你娘，货今晚就走。」他顿了顿，补了一句，「下次捎话，别走正路。正路上，都是『雾里鬼』的耳目。」",
"他没有多疑，转身继续搬货。你趁他不注意，飞快扫了一眼货箱——箱缝里露出一角，是一张纸，上面印着「圣光神学院」的字样。",
"圣光的货物，走西海岸的走私通道。你心里一沉，记下了这个细节。你没有久留，转身沿原路退出。走出断崖时，暮色已经漫上来了，你解开手腕上的黑布，叠好，收进口袋——那是老妇人儿子的东西，你打算有机会还给她。"
],
options:[
{t:"回海风港整理信息", go:"west_hub"}
]
}};

N["west_smuggle_3"]=function(){return{
place:"西海岸·走私通道",
text:[
"你趁那汉子还没看清，转身钻进来时的窄路，快步往回走。身后传来脚步声——他追了，但雾已经漫上来，你拐了几个弯，甩掉了追踪。",
"你靠着崖壁喘气，手心全是汗。那条走私通道，你看到了不该看的东西：船、货箱、闭眼猫头鹰的标记。每一件，都指向同一个答案。",
"你低头，发现自己手里攥着一片东西——是刚才仓促间，从货箱边缘蹭下来的纸角。上面印着半行字：「……神学院，第十七批，签收人……」字迹被撕断，但「神学院」三个字，清晰可辨。",
"你收好纸角，走出断崖。暮色里，迷雾森林的边缘，雾正慢慢升起。你回头看了一眼那片灰蒙蒙的林海，快步朝海风港的方向走去。"
],
options:[
{t:"回海风港", go:"west_hub"}
]
}};

N["west_forge"]=function(){return{
place:"海风港·磐石铸造坊",
text:[
"磐石铸造坊在海风港南段，门脸不大，招牌上画着一只独眼猫。你推门进去，一股炭火和铁锈的气味扑面而来。一个赤膊的壮汉正在打铁，头也不抬：「打什么？」",
"「不打铁。打听点事。」你说，「听说你们这里——接受『特殊订单』？」",
"壮汉的锤子停了一瞬，又继续落下：「什么特殊订单？」",
"「星尘矿的。」你盯着他，「有人告诉我，白崖挖出来的矿，在这里加工。」",
"锤声停了。壮汉放下锤子，缓缓直起身，目光在你脸上扫过：「你是——老鸦派来的？」",
"你还没回答，他已经转身，从柜台下摸出一把短刀，语气不善：「老鸦的人，三天两头来。老子说过了——矿的事，去找R，别来找我。再来，别怪我不客气。」",
"你举起手，示意没有恶意：「我不是老鸦的人。我只是想打听——那些矿，最终送到哪去了？」",
"壮汉盯着你，半晌，把短刀收回柜台：「送去圣城。教会的人收。」他说完，重新拿起锤子，「就这么多。再多，我也不知道了。你要真想知道——自己去圣城问。」",
"锤声重新响起，一下一下，像在赶客。你退出铸造坊，站在门口，望着南来北往的人群。星尘矿——圣城。这条线，终于露出了一个明确的终点。"
],
options:[
{t:"回海风港整理信息", go:"west_hub"}
]
}};

N["west_return"]=function(){return{
place:"西海岸·海风港",
text:[
"你回到海风港时，夕阳正把海面染成一片暗金。你在码头边站了很久，看着船来船往，想着这些天查到的一切：",
"白崖囚禁学生挖矿，矿运回大陆，经磐石加工，最终送往圣城；老鸦在查这笔账，R在白崖管事，T的代号贯穿始终——这条线，像一条看不见的河流，从学院地下，一直流到西海岸，流到圣城。",
"你从怀里摸出老鸦给你的账本副本，又摸了摸白崖带回来的纸角。你决定——把这些线索带回去。学院那边，埃德蒙在等；地下城那边，封印在等。而你，是这些线索之间，唯一的连接点。",
"海风猎猎。你转身走向客栈，收拾行囊。老板娘看见你，照例端来一碗热汤：「要走了？」",
"「嗯。回去。」",
"「回去好。」她擦了擦手，「西海岸这地方，适合看看，不适合久留。风太大，容易把人吹散。」",
"你喝完汤，付了钱，走出客栈。海鸥在码头盘旋，鸣声尖利。你最后看了一眼那片蓝得发暗的海，然后转身，朝东——朝学院的方向，迈步走去。"
],
options:[
{t:"返回学院", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向五：NPC深度关系系统（20节点）
// ============================================================

N["npc_rel_hub"]=function(){return{
place:"学院·人际关系",
text:["你翻着一本自己整理的册子，上面记着学院里每一个与你打过交道的人——他们的名字、性格、说过的话、帮过你或欠过你的事。", "窗外，学院的钟楼敲响。你看着那些名字，忽然发现，这些人已经不只是「NPC」了——他们有自己的日子、自己的秘密、自己的选择。而你与他们之间的每一段关系，都像一条细细的线，把你和他们，拴在了一起。", "有些线是恩，有些线是债，有些线是说不清的东西。你合上册子，决定——该去见见他们了。", "你在学院里认识的人，慢慢多起来了。有人常来找你，有人只是点头之交，有人还欠着你人情，有人……在躲着你。", "你发现，关系这东西，像织布。你投出去的每一针，都会织进同一个图案里，只是当时看不出来。", "亚瑟每次见你都笑，但你已经知道，他的笑后面，有一个沉甸甸的王国。莉莉丝跟你说话总是带刺，但你们都知道，那些刺下面，藏着别的什么。", "马库斯不常说话。但你每次深夜回宿舍，都会看见他床头的灯还亮着。他不知道在写什么。你也不问。", "你有时候想，这些关系，会在什么时候派上用场？在你最需要的时候？还是在你最不需要的时候，突然找上门来？", "你暂时没有答案。但你知道，你在这里的每一天，都在织那张网。网眼是大是小，全看你投出去的每一针。"] /*v45inj:npc_rel_hub*/,
options:[
{t:"去见墨丘利教授", go:"npc_rel_mercury_1"},
{t:"去见塞西莉亚", go:"npc_rel_cecilia_1"},
{t:"去见灰翎", go:"npc_rel_gray_1"},
{t:"去见埃德蒙", go:"npc_rel_edmund_1"},
{t:"去见昆特教头", go:"npc_rel_qinte_1"},
{t:"去见马库斯", go:"npc_rel_marcus_1"},
{t:"去见瓦伦", go:"npc_rel_valen_1"},
{t:"去见洛琳", go:"npc_rel_lolin_1"},
{t:"回学生会", go:"pol_hub"}
]
}};

N["npc_rel_mercury_1"]=function(){return{
place:"学院·墨丘利办公室",
text:[
"墨丘利的办公室永远堆满书和卷轴，他埋首其中，像一只住在纸山里的鼹鼠。你敲门进去时，他正对着一个炼金瓶皱眉，听见脚步声，头也不抬：「泡茶的水在窗台，茶叶在左边第二个罐子。」",
"你轻车熟路地泡了茶，放在他手边。他这才抬起头，透过厚厚的镜片看你：「你最近——在学院里搞了些动静。」",
"「您知道了？」",
"「整个教务处的茶余饭后都是你。」他喝了口茶，「查账、进塔楼、下地下城——我教了三十年书，没见过哪个学生一年级就这么折腾。」",
"他放下茶杯，难得认真地看着你：「我不是要拦你。我只是想告诉你——学院里的水，深归深，但水底下，也有石头。你踩得稳，水就奈何不了你。」他顿了顿，「你踩不稳的时候——来找我。我这张老脸，在学院里还能换几分薄面。」",
"你看着他，心里一暖。这个总在纸山里埋头的老人，其实一直在看着你。"
],
options:[
{t:"谢谢他，把最近的事讲给他听", go:"npc_rel_mercury_2"},
{t:"请他指点地下城的符文", go:"npc_rel_mercury_3"}
]
}};

N["npc_rel_mercury_2"]=function(){return{
place:"学院·墨丘利办公室",
text:[
"你把最近的事——查账、塔楼、地下城、封印——拣能说的，讲给墨丘利听。他听完，没有追问细节，只是摘下眼镜，擦了擦：",
"「你说到『封印』的时候，眼神不一样。」他忽然说，「你见过它了，对吧？」",
"你心里一紧。他摆摆手：「我不是要打听。我只是提醒你——见过封印的人，身上会留下痕迹。你最近有没有觉得，自己的梦，变得不一样了？」",
"你想起了那些伏笔的梦。他看你的表情，点点头：「果然。封印会读心。你梦见的那些东西，一半是你的记忆，一半——是它在试探你。」",
"他起身，从书堆深处翻出一本旧书，递给你：「这是我年轻时收集的《封印发微》，讲封印与人的互相影响。你拿去读，比你自己瞎猜强。」",
"你接过书，封皮已经磨损，但保存得很好——像有人一直等着把它交给某个需要它的人。你谢过他。他重新戴上眼镜，继续摆弄他的炼金瓶：「去吧。书里有夹页——那是我年轻时记的笔记，可能对你有用。」"
],
options:[
{t:"回去研读书籍", go:"pol_hub"}
]
}};

N["npc_rel_mercury_3"]=function(){return{
place:"学院·墨丘利办公室",
text:[
"你拿出在地下遗迹拓下的符文，请墨丘利辨认。他戴上镜片，凑近看了很久，眉头慢慢拧紧：",
"「这是封印契文的变体。」他说，「但比我见过的任何版本都古老——这些符号，至少是两千年前的文字体系。」他指着其中一组符号，「这组，对应的意思是『重铸』。旁边这组，是『材料』。你从哪拓来的？」",
"你说了地下遗迹的事。他沉吟片刻：「遗迹、契文、材料——如果我没猜错，有人在收集重铸封印的东西。」他看向你，「你也在收集？」",
"「我只是——遇上了。」",
"墨丘利看了你几秒，没有追问，只是从抽屉里取出一张纸，画了一串符号递给你：「这是我研究多年的『封印符文对照表』。你以后遇到不认识的符文，拿来对一下。别谢我——」他顿了顿，「我年轻时，也见过一次封印。我知道那东西，会缠人一辈子。」",
"他低下头，继续摆弄炼金瓶，像什么都没说过。你握着那张纸，纸页上，是他很多年前就写好的字迹。"
],
options:[
{t:"收好对照表", go:"pol_hub"}
]
}};

N["npc_rel_cecilia_1"]=function(){return{
place:"学院·图书馆",
text:[
"你在图书馆的角落找到塞西莉亚。她坐在窗边，膝头摊着一本书，却没在看——目光落在窗外，不知道在想什么。",
"你走过去，在她对面坐下。她回过神，看见你，微微弯了弯嘴角：「你最近很忙。学生会、地下城、还有——」她顿了顿，「还有那些夜里的事。」",
"「你知道多少？」你问。",
"「我知道的不多。」她低下头，指尖划过书页，「但我认识你，比他们认识得早。你变了——不是变坏了，是变得……」她寻找着词，「变得远了。」",
"窗外的阳光落在她发梢。她抬起头，认真地看着你：「我不打听你的事。我只想让你知道——不管你卷进了什么，如果你需要一个人，不问你做了什么，只听你说——」她笑了笑，「我在这里。」",
"你心里一动。这个从序章起就认识的人，她看着你的眼神，始终没有变过。"
],
options:[
{t:"告诉她一部分真相", go:"npc_rel_cecilia_2"},
{t:"谢谢她，但什么都不说", go:"npc_rel_cecilia_3"}
]
}};

N["npc_rel_cecilia_2"]=function(){return{
place:"学院·图书馆",
text:[
"你挑着能说的，把查账、地下城、封印的事，告诉了塞西莉亚。她听得很安静，没有打断，也没有追问细节。",
"等你说完，她沉默了一会儿，说：「你做的这些事，听起来很危险。」",
"「嗯。」",
"「那你——还会继续做吗？」",
"你没有回答。她看着你，忽然笑了笑：「我知道了。」她低头，从书页里抽出一张书签递给你——是一片压干的银叶，叶脉清晰。",
"「这是我小时候，在学院后山捡的。」她说，「那时候我总想着，长大以后要当一个很厉害的人，去很远的地方。后来发现，长大以后，人反而会越来越近地待在一个地方——守着一些小事，和一些重要的人。」她看着你，「你要去很远的地方的话，带着它。看见它，就像——我还在你身边。」",
"你接过银叶书签，薄薄的，带着干花的香气。你把它收进怀里，贴着心口的位置。"
],
options:[
{t:"收好书签", go:"pol_hub"}
]
}};

N["npc_rel_cecilia_3"]=function(){return{
place:"学院·图书馆",
text:["你谢过她，没有多说。她也没有追问，只是点点头，重新把目光落回书页上。", "你起身要走，她忽然叫住你：「等一下。」她从怀里摸出一个油纸包，递给你：「食堂的南瓜饼，我多买了一份。你最近老熬夜，吃点甜的。」", "你接过油纸包，还带着体温。她低头看书，没有抬头：「走吧。别回头看了——我又不会跑。」", "你走出图书馆，手里握着那个油纸包，隔着纸还能感到温度。你撕开一角，咬了一口——是甜的。你站在原地，嚼了很久，才把它吃完。", "塞西莉亚的关系，是算出来的。她跟你说过，她交朋友，像做算术：「先观察，再判断，最后决定值不值得深交。」她说这话的时候，很坦率。", "你觉得她这种说法有点冷。但相处久了，你发现她其实比谁都认真——她答应的事，一定做到；她算清楚的事，从不算错。", "有一次，你问她：「那我在你的算盘上，是哪一档？」她抬起头，看了你一会儿，说：「你不用知道。」然后低下头继续看书。", "你注意到，她说完那句话之后，耳根红了一下。只有一下。", "后来，你发现她帮你做过很多小事——帮你占图书馆的位子，帮你改过一遍论文里的错字，你受伤的那次，她往你桌上放了一瓶药，没有留名字。", "她从来没有承认过那些事。但你心里，已经把那笔账，算得很清了。"] /*v45inj:npc_rel_cecilia_3*/,
options:[
{t:"把这份甜记在心里", go:"pol_hub"}
]
}};

N["npc_rel_gray_1"]=function(){return{
place:"学院·占星塔",
text:[
"灰翎在占星塔天台等你，像你每次来一样。她面前摊着星图，手里的笔在某个星位画了个圈：「你来得正好。帮我看看这个。」",
"你凑过去。她指着那个星位：「天狼星，近日运行异常，光度忽明忽暗。按古占星术，这是『大变之兆』——但具体是什么变，我看不出来。」她抬起头看你，「你身上，最近是不是发生了什么大事？」",
"你说了封印的事。她听完，没有惊讶，只是点点头：「难怪。封印松动，会影响天上的星象——它们是同一条河里的水。」",
"她合上星图，难得认真地看着你：「你查的这些事，我帮不上大忙，但我能帮你『看见』。下次你进地下城——叫上我。我的星象术，能在黑暗里找到方向。」",
"风从塔顶吹过，吹动她的灰袍。你看着她，忽然觉得，这个总在月亮底下看星星的人，像一盏不会灭的灯。"
],
options:[
{t:"答应她，下次一起探索", go:"npc_rel_gray_2"},
{t:"谢谢她，先各自行动", go:"pol_hub"}
]
}};

N["npc_rel_gray_2"]=function(){return{
place:"学院·占星塔",
text:[
"你答应了灰翎。她点点头，从怀里取出一枚铜罗盘递给你：「拿着。这是我师父留给我的——里面刻了『引路符』，能在迷宫里找到出口。我用不上了，你带着。」",
"你接过罗盘，铜面磨得发亮，边角有一道细痕——像是曾经磕在什么硬物上。你摩挲着那道痕，问：「你师父——」",
"「走了。」灰翎淡淡地说，「三年前，他去西海岸查一件事，再没回来。有人说他死了，也有人说他在某个岛上活着。」她低头，摩挲着袖口的银羽毛，「我把星象学完，就是为了有一天，能算出他在哪。」",
"你握着罗盘，忽然觉得它比看起来沉。你想起老鸦——也是去了西海岸，也是下落不明。这片大陆上，有多少人，在沉默地找着另一个人？",
"你把罗盘收好。灰翎转回星图前，声音淡淡的：「你走吧。下次要进地下城，来这儿叫我。」"
],
options:[
{t:"收好罗盘", go:"pol_hub"}
]
}};

N["npc_rel_edmund_1"]=function(){return{
place:"学院·西塔楼",
text:[
"你上塔楼时，埃德蒙正在给窗台的盆栽浇水。他听见你的脚步声，没有回头：「回来了。」",
"「嗯。西海岸那边——」你把老鸦的发现、白崖的事，一五一十告诉了他。他听完，浇水的手没有停，但水壶倾斜的角度，有一瞬间偏了。",
"「白崖……」他放下水壶，走到窗边，望着远方的天际线，「二十年前，我听说过这个名字。当时只当是谣传——大陆上哪有囚禁学生挖矿的地方。」他苦笑，「现在你告诉我，它是真的。」",
"他转过身，看着你：「你打算怎么办？」",
"「我想把那些学生救出来。」你说。",
"埃德蒙没有立刻回答。他沉默了很久，说：「救他们，需要人手、路线、接应。你一个人——做不到。但你可以先去确认一件事：那些学生里，有没有你认识的名字。如果有——」他顿了顿，「那我这条老命，也豁得出去。」",
"窗外，风穿过灰塔。你看着他，这个守了二十年塔楼的老人，第一次让你觉得，他也有没熄灭的火。"
],
options:[
{t:"回应他这份决心", go:"npc_rel_edmund_2"},
{t:"把老鸦的账本副本交给他", go:"npc_rel_edmund_3"}
]
}};

N["npc_rel_edmund_2"]=function(){return{
place:"学院·西塔楼",
text:[
"「如果学生里有我认识的人——」你说，「你这条老命先留着。救人，得活着的人去救。」",
"埃德蒙愣了一下，然后笑了——很少见他这样笑：「你小子，学会教训我了。」他摇摇头，「行，听你的。不过你要记住——」他正色道，「白崖那种地方，不是一个人能闯的。你要去，得有个计划，有接应，有退路。别学老鸦，一头扎进去，三年没消息。」",
"「老鸦——他其实还活着。」你说。",
"埃德蒙的动作顿住了。他缓缓转过头，看着你，声音有些发紧：「你见到他了？」",
"「见到了。他还在查。他说，查完那笔账，就回学院养老。」",
"埃德蒙没有接话。他站在窗边，背对着你，很久，才开口，声音有些哑：「好。好——他还活着就好。」他抬手，像是擦了一下眼角，「你回去休息吧。白崖的事，我们慢慢合计。」",
"你走下塔楼时，回头看了一眼。那个老人还站在窗边，像一棵终于等到消息的老树。"
],
options:[
{t:"留下他，继续商量救人计划", go:"pol_hub"}
]
}};

N["npc_rel_edmund_3"]=function(){return{
place:"学院·西塔楼",
text:[
"你把老鸦的账本副本递给埃德蒙。他接过去，戴上眼镜，一页一页翻得很慢。翻到某一页时，他的手指停住了，在纸面上摩挲了一下：",
"「这笔『维护费』——」他指着那行字，「二十年前，我刚当上教务处助理那会儿，就见过同样的一笔。当时的经办人，也是磐石。」他摘下眼镜，「也就是说，这条线，至少运转了二十年。二十年来，每一任经办人，都默契地没有声张。」",
"他合上账本，看着你：「你带来的这些东西，比白崖更让我在意——它说明，学院地下那口石棺，被人盯着不是一天两天了。而盯着它的人，藏在比圣光、比暗蚀会更深的暗处。」",
"「那我们怎么办？」你问。",
"埃德蒙把账本锁进柜子：「先不动。把线头都收在手里，等它们自己浮出来。你继续做你的事——学生、地下城、表面上的查账。暗处的事，交给我。」他顿了顿，声音沉下去，「但你要记住：你查到的每一条线索，都可能有双眼睛跟着。活着，比真相重要。」",
"你点点头。走出塔楼时，天色已晚，塔楼的灯亮了起来——像一只夜里的眼睛，守着这座学院的秘密。"
],
options:[
{t:"继续日常", go:"pol_hub"}
]
}};

N["npc_rel_qinte_1"]=function(){return{
place:"学院·训练场",
text:[
"你找到昆特时，他正在独自练刀。没有学生，没有喊杀声，只有刀刃破风的闷响。他见你走近，收了刀，用毛巾擦了把汗：「来了。」",
"「你女儿的事——」你开口。",
"「有眉目了。」他打断你，声音里有一丝不易察觉的起伏，「我托人往圣城递了话。那边松了口，说学期末可以放人回来探亲。」他顿了顿，握紧了刀柄，「探亲——呵。谁知道放回来的，是不是真的她。」",
"「我可以帮你。」你说。",
"昆特看着你，沉默了一会儿：「你帮我——图什么？」",
"「不图什么。」你说，「就是觉得，该帮。」",
"他低下头，看着自己的刀，很久没说话。最后，他声音有些沙哑地说：「谢了。等学期末——如果真需要帮手，我会找你。」他把刀入鞘，转身要走，又停住，「小子，你记住——这世上肯不问代价帮人的，越来越少。你这份心，别让这学院的水，泡凉了。」",
"他大步走远。你站在训练场上，看着他宽厚的背影，心里有什么东西，被轻轻撞了一下。"
],
options:[
{t:"把这事记在心上", go:"pol_hub"}
]
}};

N["npc_rel_marcus_1"]=function(){return{
place:"学院·战士系训练场",
text:[
"马库斯还在训练场。他看见你，放下剑，擦了擦汗：「又来了。这次想问什么？」",
"「不问了。」你说，「来练两手。」",
"他愣了一下，然后笑了——难得的笑容：「行。」他抛给你一把木剑，摆好架势，「先说好，我不放水。」",
"你们对练了半个时辰。他的剑路大开大合，你起初招架得吃力，后来渐渐摸到他的节奏。最后一回合，你一个侧身，剑尖点到他的肋下。他停住，低头看了一眼，点头：「进步了。」",
"他放下剑，和你并排坐在训练场的台阶上，望着远处的操场：「我弟弟——他以前也喜欢在这儿练剑。」他说，「他总说，练好了剑，就能保护想保护的人。」他沉默了一下，「我练剑，也是为了这个。但我没保护好他。」",
"「那不是你的错。」你说。",
"「我知道。」他望着远处，「但我得做点什么——不能让他白消失。」他转过头看你，「你要是查到了什么，算我一份。」",
"风从训练场吹过。你看着他，点了点头。"
],
options:[
{t:"答应他", go:"pol_hub"}
]
}};

N["npc_rel_valen_1"]=function(){return{
place:"学院·学生会活动室",
text:[
"瓦伦坐在主位上，面前摊着一摞文件。你推门进去，他抬起头，笑容依然温和：「稀客。坐，茶刚泡好。」",
"你坐下，没有喝茶，直接说：「主席，春季舞会的账目，我查过了。」",
"瓦伦的笑容没有变，他端起茶杯，吹了吹热气：「哦？查出了什么？」",
"「布料的采购单和实物对不上。三百金币的『丝绸』，实际是棉布。」你看着他的眼睛。",
"活动室里安静了几秒。瓦伦放下茶杯，笑容收敛了一些：「你很能干。」他站起身，走到窗边，「但我劝你——有些账，查清了，对谁都没好处。」他转过身，看着你，「我不是在威胁你。我只是在告诉你一个事实：学生会的水，比你想的深。你踩到底，会淹到的。」",
"你站起身：「那也得有人蹚一蹚，才知道深浅。」",
"瓦伦看着你，目光复杂。片刻后，他忽然笑了：「有意思。学院好几年没出过你这样的人了。」他走回桌边，抽出一份文件递给你，「春季舞会的账目——说实话，那三百金币，确实有猫腻。但不是我的。是有人借我的名，走的账。你想查，我帮你查——但查出什么，你得先告诉我。」",
"你接过文件，与他四目相对。这个人——你始终看不透他。"
],
options:[
{t:"接受他的提议", go:"pol_hub"}
]
}};

N["npc_rel_lolin_1"]=function(){return{
place:"学院·旧食堂二楼",
text:[
"洛琳还是老样子，瘫在旧沙发上，脚翘在茶几上，手里转着一支笔。见你进来，她把笔一收：「哟，大忙人来了。听说你去西海岸转了一圈？」",
"「消息挺灵通。」",
"「学院里没有我不知道的事。」她拍拍身边的沙发，「坐。说说，西海岸那边，有什么有意思的？」",
"你挑了些能说的告诉她——白崖、走私通道、星尘矿。她听完，吹了声口哨：「行啊你，出去一趟，捅了个马蜂窝回来。」她收敛笑容，「白崖的事，我听说过一点——学院里有几个『转学』的学生，我私下查过，他们的去向，都断在同一个地方：西海岸。」",
"「你查过？」你有些意外。",
"「我这个人，记性好，心眼小。」洛琳说，「谁欺负过我朋友，我都记着。那几个『转学』的，里面有个姑娘，是自由派的老成员。她走之前，偷偷塞给我一张纸条——上面只写了一个字：『崖』。」",
"「崖——白崖。」你接话。",
"「对。」洛琳坐直身子，「所以你要是查白崖——算我一个。自由派别的本事没有，消息灵通，门路广。查事这种事，交给我，比你一个人跑快得多。」她伸出手，「合作？」",
"你握住她的手：「合作。」"
],
options:[
{t:"与她结盟", go:"pol_hub"}
]
}};

N["npc_rel_memory_1"]=function(){return{
place:"学院·正门",
text:[
"你离开学院一段时间后，再次回来。站在正门口，看着那些熟悉的建筑、熟悉的人来人往，心里忽然有一种说不清的感觉。",
"走进校门时，门房的老休恩喊住你：「哎——是你啊。回来啦？」",
"你愣了一下：「您还记得我？」",
"「记得，怎么不记得。」老休恩摆摆手，「你头一回翻墙出去，还是我帮你打掩护的。年轻人，出去见见世面是好事，但别把家忘了。」他压低声音，「对了——你走这段时间，有个灰袍老头来学院找过你。说是什么『老鸦』，让我给你带句话。」",
"你心头一跳：「什么话？」",
"「他说：『账查完了，等你回来对。』」老休恩挠挠头，「就这句。也不知道是啥意思。」",
"你站在校门口，阳光正好。那句「等你回来对」，像一枚石子，轻轻落进你心里。"
],
options:[
{t:"去见老鸦", go:"west_warehouse"},
{t:"先回宿舍安顿", go:"pol_hub"}
]
}};

N["npc_rel_memory_2"]=function(){return{
place:"学院·图书馆",
text:[
"你在图书馆遇到塞西莉亚。她看见你，愣了一下，然后弯起眼睛笑了：「你回来了。」",
"「回来了。」你说，「这段时间——」",
"「我知道你忙。」她打断你，从书页里抽出一张叠好的纸递给你，「你走之后，我闲着没事，把你以前问过我的那几个问题，整理成了笔记。想着你回来能用上。」",
"你展开纸——上面是她工整的字迹，写着几个问题的解答，还有几处她用铅笔标注的「不确定，你再查查」。纸页的边缘，画了一朵小花。",
"你握着那张纸，忽然觉得，这就是「被人记住」的样子——不是惊天动地的大事，只是有人把你随口问过的问题，认认真真地记了下来。",
"「谢谢。」你说。",
"她摆摆手：「客气什么。下次出门——记得带干粮。食堂的南瓜饼，冷了就不好吃了。」"
],
options:[
{t:"收好这份心意", go:"pol_hub"}
]
}};

N["npc_rel_parting"]=function(){return{
place:"学院·站台",
text:["分别的时候，没有煽情。", "他站在路口，你的行囊已经背好了。风把你们的衣摆都吹起来，路边的草在风里伏倒又立起。", "「走了。」你说。", "「嗯。」他说，「路上小心。」", "你走出去几步，他忽然叫住你：「喂。」你回头。他张了张嘴，最后只说：「……算了。你走吧。」", "你走了。走出很远，回头看了一眼——他还站在路口，像一棵种在那里的树。", "你转回身，继续走。风很大，你走得很稳。", "你又要出发了。这一次，送行的人多了一些——塞西莉亚站在人群里，朝你挥了挥手；灰翎靠在塔楼的窗边，没有挥手，只是朝你点了点头；埃德蒙没来，但你知道，塔楼的灯，会亮一整夜。", "洛琳塞给你一包干粮：「路上吃。别饿着——你饿着的样子，看着可怜。」昆特远远站着，没有靠近，只是朝你举了举刀，像敬一个礼。", "你背着行囊，走出校门。身后，学院的钟楼敲响整点。你没有回头，但你知道——这座学院里，有人在等你回来。", "这种感觉，比任何武器都让人安心。", "后来你们各自走了很远的路，偶尔会在信里提到那一晚。", "他写信说，那天他其实想说的是「留下来」——但他知道，说出口，你就走不成了。", "你回信说，那天你其实听懂了。你只是假装没听懂。", "信寄出去之后，你们都没有再提这件事。", "有些话，说一半就够了。剩下的，留给时间慢慢磨。"] /*v45inj:npc_rel_parting*/,
options:[
{t:"出发", go:"west_hub"}
]
}};

N["npc_rel_debt"]=function(){return{
place:"学院·食堂",
text:[
"你在食堂吃饭时，一个低年级的学生端着餐盘走过来，在你对面坐下：「学长，我找你很久了。」",
"「找我？」你有些意外。",
"「嗯。我听说——是你把那些『转学』的学生救回来的。」他压低声音，「我有个姐姐，三年前『转学』了。家里一直不知道她去了哪。前些天，她托人捎了封信回来——说她在西海岸被人救了，现在过得还行。」他眼圈有些红，「谢谢你。」",
"你放下筷子，一时不知道该说什么。你救人的时候，没有想过会有人记得。但此刻，看着这个低年级学生发红的眼眶，你忽然觉得——那些夜里冒过的险，都值了。",
"「不用谢。」你说，「你姐姐——她叫什么？」",
"他说了名字。你记下了。吃完饭，你走出食堂，阳光很好。你抬头看了看天，心里想：这世上欠下的恩，和种下的因，都会在某个时刻，以你意想不到的方式，回到你身边。"
],
options:[
{t:"把这份感动留在心里", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向六：道具因果链系统（19节点）
// ============================================================

N["item_hub"]=function(){return{
place:"随身行囊",
text:[
"你整理行囊时，把一路积攒的物件摊在桌上。每一件，都不是普通的东西——它们带着来路，带着代价，带着一段没讲完的故事。",
"你一件一件看过去：黄林晶的信、旧怀表、银叶书签、铜罗盘、铁牌、银羽毛徽章、两粒种子、圣水、那枚铜扣……",
"你忽然发现，这些东西之间，隐约有一条看不见的线——它们来自不同的人、不同的地方，却都指向同一个方向：那条通往真相的路。",
"你拿起其中一件，摩挲着它的纹路。物件不说话，但它们记得——记得自己从哪来，被谁握过，最后又到了你手里。"
],
options:[
{t:"细看黄林晶的信", go:"item_letter_1"},
{t:"细看旧怀表", go:"item_watch_1"},
{t:"细看银叶书签", go:"item_leaf_1"},
{t:"细看铜罗盘", go:"item_compass_1"},
{t:"细看铁牌", go:"item_plate_1"},
{t:"细看银羽毛徽章", go:"item_feather_1"},
{t:"细看两粒种子", go:"item_seed_1"},
{t:"细看圣水", go:"item_holywater_1"},
{t:"细看那枚铜扣", go:"item_button_1"},
{t:"收好行囊", go:"pol_hub"}
]
}};

N["item_letter_1"]=function(){return{
place:"行囊·那封信",
text:[
"你展开黄林晶的信。纸页泛黄，墨迹在边缘洇开，像被潮气浸过。你读了无数遍，这一次，你的目光停在信的落款日期上——那是在三十年前的秋天写的。",
"三十年。一封信，等了三十年，穿过沙漠、驿路、一双双手，最后到了你手里。你忽然想：写信的人，当年写它的时候，是什么样的心情？",
"「若你能读到这行字——说明你活到了第二个春天。」你轻声念出那句暗纹。",
"信纸在你手里，轻得像一片羽毛，又重得像一块碑。你把它折好，放回贴身的口袋里——它已经不只是信了，是一条路，指向你还没走完的地方。"
],
options:[
{t:"收起信", go:"item_letter_2"}
]
}};

N["item_letter_2"]=function(){return{
place:"行囊·信的启示",
text:[
"夜里，你又读了一遍那封信。这一次，你注意到一个之前忽略的细节：信的边缘，有一道极浅的折痕，像是曾被夹在某本书里。折痕的形状，与学院图书馆某本书的装订线吻合。",
"你翻出那本书——是墨丘利给你的《封印发微》。你比了比折痕，严丝合缝。",
"黄林晶的信，曾经夹在这本书里。而这本书，墨丘利珍藏了多年。",
"你心里涌起一个念头：墨丘利和黄林晶——他们认识？还是说，这本书曾经经过黄林晶的手，带着它从圣城一路来到了学院？",
"你合上书，把信夹回书页之间。有些联系，你还没有理清，但你知道——它们一定存在，只是藏得比想象中深。"
],
options:[
{t:"把这个发现记下", go:"pol_hub"}
]
}};

N["item_watch_1"]=function(){return{
place:"行囊·旧怀表",
text:[
"你打开旧怀表的表盖。表盘后面的小字，你已经读了很多遍：「致吾友——愿你永远用不到这个号码。」下面那串数字，你尝试着查过——它对应着圣城某条街道的门牌。",
"你一直没想明白：给你怀表的那个人，为什么要留一个「用不到」的号码？",
"你合上表盖，手指摩挲着表壳。表针还在走，发出细碎的滴答声——一块走了很多年的表，还在为你记着时间。",
"你忽然想：也许那个号码，不是给你的——是给「读到这行字的人」的。你只是刚好，成了那个人。",
"你把它放回怀里，贴着胸口。表针的滴答声，像一个沉默的同伴，一路陪着你。"
],
options:[
{t:"收好怀表", go:"item_watch_2"}
]
}};

N["item_watch_2"]=function(){return{
place:"行囊·怀表的线索",
text:[
"你决定顺着怀表里的地址，去圣城看一看。那条街道的尽头，是一扇常年紧闭的门，门牌与怀表上的数字一致。",
"你敲门，无人应答。你推开虚掩的门——屋里积满灰尘，像是很久没人住。桌上放着一封信，落款日期是十几年前：",
"「吾友：若你读到这行字，说明我已经不在了。怀表里那个号码，是我留给你的最后的线索。圣城地下，有一条旧水道，通往一座废弃的教堂。教堂的讲坛下面，埋着我查了一辈子的东西——第七印的第一手记录。你若有心，去取吧。— 你的朋友」",
"你握着信纸，站在积灰的屋里，窗外的阳光照进来，尘埃在光柱里浮沉。给你怀表的那个人，你始终不知道他（她）的名字——但他（她）留给你的，是一条通往真相的路。"
],
options:[
{t:"记下圣城水道的线索", go:"pol_hub"}
]
}};

N["item_leaf_1"]=function(){return{
place:"行囊·银叶书签",
text:[
"你取出塞西莉亚给你的银叶书签。压干的叶子薄如蝉翼，叶脉清晰，在光下泛着银色的光泽。",
"你想起她说过的话：「你要去很远的地方的话，带着它。看见它，就像——我还在你身边。」",
"你指尖轻抚叶脉。这张书签，是她小时候在后山捡的——一片普通的叶子，被她珍惜了很多年，然后送给了你。",
"你把它夹进墨丘利给你的《封印发微》里，正好夹在封印与人心那一段。你看书时，每次翻到这里，都会看到那片银叶——像一个小小的坐标，提醒你：有人在家里等你。"
],
options:[
{t:"收好书签", go:"item_leaf_2"}
]
}};

N["item_leaf_2"]=function(){return{
place:"行囊·书签的回响",
text:[
"你在旅途中，遇到过一次险境——那时你几乎撑不住了。你摸到怀里的书签，指尖触到那片银叶时，忽然想起塞西莉亚说这句话时的眼神。",
"你咬着牙，又撑了下去。",
"后来你回到学院，她问你路上怎么样。你只说了句「还行」。她看了你一会儿，没有追问，只是把一块热腾腾的南瓜饼塞进你手里：「那就好。」",
"你咬了一口，是甜的。你忽然觉得，那片银叶书签，不只是书签——它是这世上，有人惦记着你的证据。"
],
options:[
{t:"把这份惦记留在心里", go:"pol_hub"}
]
}};

N["item_compass_1"]=function(){return{
place:"行囊·铜罗盘",
text:[
"你取出灰翎给你的铜罗盘。铜面磨得发亮，边角的细痕，像一段没讲完的故事。罗盘中央的指针，总是稳稳地指着北方——无论你在哪里。",
"你想起灰翎的话：「里面刻了『引路符』，能在迷宫里找到出口。我用不上了，你带着。」",
"她说「用不上了」的时候，声音很平。但你记得，她师父留给她的东西，她一定珍惜了很久——然后她把这份珍惜，给了你。",
"你握着罗盘，指针轻轻颤动，像在回应你。你把它系在腰间，从此无论走到多深的地下，你都知道——有一枚指针，永远指着回家的方向。"
],
options:[
{t:"系好罗盘", go:"item_compass_2"}
]
}};

N["item_compass_2"]=function(){return{
place:"行囊·罗盘的方向",
text:[
"你带着罗盘进了地下城。在迷宫般的遗迹深处，其他方向都乱了——只有罗盘的指针，依然稳稳地指着北方。",
"你顺着指针的方向走，果然找到了一条出口。走出地下时，月光正好。你低头看罗盘，铜面上映着月亮的影子。",
"你忽然明白：灰翎把它给你，不只是因为「用不上」——是因为她知道，你比她更需要一个方向。",
"你回到学院，把罗盘给灰翎看。她看了一眼，只说：「它认你了。」然后她转回星图前，声音淡淡的，「带它走吧。它在你这儿，比在我这儿有用。」",
"你系好罗盘，没有再多说。有些话，不用说出口，指针知道。"
],
options:[
{t:"继续前行", go:"pol_hub"}
]
}};

N["item_plate_1"]=function(){return{
place:"行囊·铁牌",
text:[
"你取出疤脸阿莫给你的铁牌。铁牌沉甸甸的，带着炉火的余温，边缘被打磨得圆润——显然被摩挲过很多次。",
"你想起他说的话：「拿着这个，灰巷以后对你开放。但要记住——别让人知道你和我有关系。」",
"一块铁牌，一条路的通行证。它来自一个你几乎忘记名字的人——一个你当年顺手帮过、如今在暗蚀会外围站稳了脚跟的人。",
"你握着铁牌，忽然觉得，当年那个街角的「顺手一帮」，如今长出了一条路。因果这东西，有时候，比想象中更绵长。"
],
options:[
{t:"收好铁牌", go:"item_plate_2"}
]
}};

N["item_plate_2"]=function(){return{
place:"行囊·铁牌的重量",
text:[
"你用铁牌进过几次灰巷。每一次，都有人给你让路——不是因为你，是因为这块铁牌背后，是阿莫的面子。",
"有一次，你在灰巷听到两个暗蚀会外围的人低声说话：「阿莫那小子，当年就是个街边的小混混，现在混到外围管事，全靠运气。」",
"「运气？」另一人嗤笑，「他是靠『报恩』混的——据说他发达以后，一直在找一个当年帮过他的人。找了三年。你说这人傻不傻？」",
"你握着口袋里的铁牌，指尖微微用力。阿莫找了你三年——而你，直到今天才知道。",
"你走出灰巷时，天已经黑了。你回头看了一眼巷口，灯火昏黄。你决定：下次见到阿莫，当面跟他说一声「谢谢」。"
],
options:[
{t:"去找阿莫", go:"fsh_eclipse2"}
]
}};

N["item_feather_1"]=function(){return{
place:"行囊·银羽毛徽章",
text:[
"你取出银羽毛徽章。金属冰凉，羽毛的纹路细密，在光下泛着冷光——与灰翎袖口的那枚，一模一样。",
"它曾经属于守望者，属于守印人，属于那些在暗处守着秘密的人。如今，它在你的手里。",
"你想起埃德蒙把徽章递给你时的眼神——那不是托付，是接力。二十年前，他从上一任守印人手里接过它；现在，他把它交给了你。",
"你握着徽章，能感觉到它比看起来沉——每一枚银羽毛里，都住着一段没有名字的守望。你把它贴着心口放好。从这一刻起，你也是守印人了。"
],
options:[
{t:"收好徽章", go:"item_feather_2"}
]
}};

N["item_feather_2"]=function(){return{
place:"行囊·徽章的传承",
text:[
"夜里，你梦见了一双手——一双布满老茧的手，把一枚银羽毛徽章，交到另一双年轻的手里。那双手的主人，是埃德蒙；而接过的年轻的手，是他年轻时的样子。",
"梦里，年轻时的埃德蒙问：「守印人——要守到什么时候？」",
"那个给他徽章的人说：「守到有下一个人接住它的时候。」",
"你从梦里醒来，摸了摸胸口的徽章，它还带着体温。你忽然明白——你接过的不只是一枚徽章，是一段没有终点的守望。而总有一天，你也会把它，交给下一个人。",
"你把它放回贴身的口袋。窗外，天快亮了。你知道，这枚徽章，会陪你走很远的路——直到你找到那个该接住它的人。"
],
options:[
{t:"继续守印之路", go:"pol_hub"}
]
}};

N["item_seed_1"]=function(){return{
place:"行囊·两粒种子",
text:[
"你取出那两粒种子——一粒金色，泛着温暖的光；一粒灰黑，像一颗死去的果实。它们来自地下根系密林，来自那个被当作「苗床」的腐根精。",
"金色种子，是腐根精递给你的；灰黑种子，是它溃散前滚出来的——它说，那是「那个人」种在它身上的东西。",
"你摊开两粒种子，并排放在掌心里。一明一暗，像两面镜子。金色种子散发着生机，灰黑种子冰冷沉静——但你隐约能感觉到，灰黑种子内部，有什么东西在沉睡。",
"你想起腐根精最后的话：「别让他……找到你……」",
"那个「他」——是谁？他把种子种在腐根精身上，是为了让它孕育什么？你把两粒种子分别收好，心里多了一个待解的谜。"
],
options:[
{t:"收好种子", go:"item_seed_2"}
]
}};

N["item_seed_2"]=function(){return{
place:"行囊·种子的秘密",
text:[
"你带着两粒种子，去请教墨丘利。他把两粒种子放在灯下，看了很久，眉头越皱越紧：",
"「金色这粒，是『回春种』——上古植物，能治愈枯竭之地，但极难存活。这种子千年难遇，你从哪弄来的？」",
"「一个……意外。」你含糊地说。",
"他放下金色种子，拿起灰黑的那粒，脸色忽然变了：「这粒——」他凑近灯下，又看了一会儿，声音沉下去，「这是『噬魂种』。传说上古时期，有人用活物做苗床，培育这种种子，用来……汲取生命力。」",
"「汲取生命力？」",
"「对。」墨丘利放下种子，摘下眼镜，「种下它的人，会把苗床的生命力吸干，然后收获种子里的『成果』——至于成果是什么，古籍没有记载。」他看着你，「你最好告诉我，这两粒种子，是从哪来的。」",
"你说了地下根系密林的事。墨丘利听完，沉默了很久：「那片密林……原来如此。」他压低声音，「有人在那里培育噬魂种。你拿走的那粒，可能是他们十几年心血的一部分——他们会找你的。」",
"他想了想，递给你一只铅盒：「把噬魂种放这里。它隔绝气息，他们找不到。回春种你留着——它认你，将来会有大用。」",
"你依言收好。走出办公室时，你摸了摸怀里的铅盒，沉甸甸的——你知道，你带出来的，不只是一粒种子，是一个麻烦，也是一个伏笔。"
],
options:[
{t:"收好铅盒", go:"pol_hub"}
]
}};

N["item_holywater_1"]=function(){return{
place:"行囊·圣水",
text:[
"你取出灰翎给你的瓷瓶。瓶身白釉，泛着温润的光，里面的圣水随着你的动作轻轻晃动。",
"你挽起袖子，看了一眼手臂上的契约纹——暗色的纹路，比上次更深了一些。你拧开瓶盖，蘸了一点圣水，涂在纹路上。",
"圣水接触皮肤的一瞬，纹路微微发烫，然后，暗色淡了一些。你感觉一股清凉从手臂蔓延到心头，像是紧绷了很久的弦，松了一松。",
"你合上瓶盖。灰翎说过，圣水只能压制，不能根治——但至少，它能让你在靠近深渊的时候，多一分清醒。你把瓷瓶放回怀里，贴着放好。有些东西，不是用来治病的，是用来提醒你的。"
],
options:[
{t:"收好圣水", go:"item_holywater_2"}
]
}};

N["item_holywater_2"]=function(){return{
place:"行囊·圣水的回响",
text:[
"你带着圣水进过一次地下。在深渊边缘，那个低语声又响了起来——这一次，你感觉手臂上的契约纹在发烫，像要回应它。",
"你摸到怀里的瓷瓶，拧开盖，沾了一点圣水涂在纹路上。清凉感传来，低语声骤然远去，像被什么隔开了一层。",
"你靠着石壁，喘着气。你忽然明白，灰翎把圣水给你，不只是「压制」——她是想让你，在靠近黑暗的时候，永远有一个拉自己回来的办法。",
"你走出地下时，月亮正圆。你低头看手臂，纹路淡了许多。你摸了摸怀里的瓷瓶，想着那个在天台上看星星的人——她大概，也在用她自己的方式，守着某个她拉不回来的东西。"
],
options:[
{t:"继续前行", go:"pol_hub"}
]
}};

N["item_button_1"]=function(){return{
place:"行囊·铜扣",
text:[
"你取出那枚铜扣——是那个推板车的老头还你的。铜扣磨得发亮，边缘圆润，像是被摩挲了很多年。",
"你想起老头的话：「这是当年那批布里的，我留着当念想——给你吧。」",
"一枚铜扣，来自三年前的集市口——你当年帮一个小孩追回过被风吹跑的布匹。那件事，你几乎忘了。但那枚铜扣，在老头手里留了三年，然后回到了你手里。",
"你握着铜扣，忽然觉得，这世上有些「还」，比「给」更重。你把它系在腰带上，与罗盘并排。两件小物，一枚指着方向，一枚记着来路。"
],
options:[
{t:"系好铜扣", go:"item_button_2"}
]
}};

N["item_button_2"]=function(){return{
place:"行囊·铜扣的来历",
text:[
"你后来在学院门口，又遇到了那个老头。他这次拉着一车蔬果，看见你，咧嘴笑了：「小伙子，又见面了。那枚铜扣——还戴着呢？」",
"「戴着。」你拍了拍腰间的铜扣。",
"「好，好。」老头点点头，「那枚铜扣，其实不是布的——是我当年当兵时，铠甲上掉下来的。我留了几十年，舍不得扔。那天还给你，是觉得——你这个人，值得留点念想。」",
"他推着车走了。你站在原地，低头看着那枚铜扣——原来它来自一件铠甲，来自一段你永远不会知道的往事。但你忽然明白：有些东西的价值，不在于它本身，而在于愿意把它给你的人。",
"你握了握铜扣，继续赶路。风从街角吹来，带着秋日的气息。"
],
options:[
{t:"继续赶路", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向七：每章钩子机制（7节点）
// ============================================================

N["hook_hub"]=function(){return{
place:"学院·夜读笔记",
text:[
"夜深人静，你翻开自己一路写下的笔记。每一条线索的末尾，你都留着一句没写完的话——像是给未来的自己，埋下的钩子。",
"你看着那些未完成的句子，心里有一种奇异的感觉：你的人生，正在被一段一段地翻页。每一章的结尾，都有一只手，轻轻按住了书页，等着你翻向下一页。",
"你拿起笔，在最新的空白处，写下了一句新的开头。窗外，钟楼敲响，夜色正浓。有些故事，翻过一页，就再也回不去了。"
],
options:[
{t:"回顾学院政治章", go:"hook_politics"},
{t:"回顾地下城章", go:"hook_dungeon"},
{t:"回顾伏笔章", go:"hook_foreshadow"},
{t:"回顾西部章", go:"hook_west"},
{t:"回顾同伴章", go:"hook_npc"},
{t:"回顾道具章", go:"hook_item"},
{t:"合上笔记", go:"pol_hub"}
]
}};

N["hook_politics"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到学院政治那一章。结尾处，你写着一句没完成的话：",
"「瓦伦说，那三百金币不是他的。他帮我查，但条件是我查到什么要先告诉他——他说这话的时候，笑容滴水不漏。我忽然觉得，也许他……」，句子在这里断了。",
"你盯着那行字，想起瓦伦递给你文件时的眼神。一个总在笑的人，什么时候是真的？你放下笔，窗外的夜色里，学生会的灯还亮着。",
"你合上笔记，心里有一个声音在说：瓦伦藏着的，也许比那三百金币，大得多。"
],
options:[
{t:"继续读下一章", go:"hook_hub"}
]
}};

N["hook_dungeon"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到地下城那一章。结尾处写着：",
"「我在试炼场赢了战魂守卫半步。它说，三百年来我是第三个让它退步的人。它还说，老鸦临走前让它转告后来者——『西海岸的风很腥，但海是蓝的』。我站在石台上，忽然想到：老鸦说这句话的时候，是不是已经知道自己回不来了？」，句子又断了。",
"你盯着那行字。火曜矿晶、灵魂碎片、战魂印记、枯荣之核——重铸封印的四件材料，你已得其三。而最后一件，指向世界树根系。",
"你合上笔记。你知道，地下城的故事没有结束——最深的那扇门，你还没有推开。"
],
options:[
{t:"继续读下一章", go:"hook_hub"}
]
}};

N["hook_foreshadow"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到伏笔那一章。你罗列着那些「还没回收的钩子」：黄林晶的信、那双一直看着你的眼睛、那句没说完的话、那枚灰黑的种子……",
"你数了数——还有七条线，悬在半空。它们像七根线头，只要你轻轻一拉，就会牵出你不知道的东西。",
"你忽然想起梦里那个声音：「你带来了一些东西，又留下了一些东西。」你带来的，是你自己；你留下的，是那些还没揭开的谜。",
"你合上笔记，窗外月光正好。你知道，那些线头不会自己消失——它们会在你最意想不到的时刻，自己浮上来。"
],
options:[
{t:"继续读下一章", go:"hook_hub"}
]
}};

N["hook_west"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到西部那一章。结尾处写着：",
"「白崖的管事R，穿着艾尔达的旧制服。他说他三十年前也像我一样，查账、查真相、觉得自己能改变世界。他说这句话的时候，铁链在他身后像蛇一样盘着。我拿着他给的钥匙，救了那些学生——但我一直在想：三十年后，我会不会也变成他？」，句子在这里断了。",
"你盯着那行字，心里沉甸甸的。R最后那句话还在耳边：「真正送学生来这里的，是大陆上的那些人。」那些「人」——是谁？",
"你合上笔记。西海岸的风，还在你记忆里吹着。白崖的灯火，还在你眼前明灭。"
],
options:[
{t:"继续读下一章", go:"hook_hub"}
]
}};

N["hook_npc"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到同伴那一章。你记着每个人的近况：塞西莉亚的南瓜饼、灰翎的铜罗盘、埃德蒙的塔楼、昆特的女儿、马库斯的弟弟、洛琳的纸条、阿莫的铁牌……",
"你忽然发现，这些人，已经不只是「NPC」了。他们有名字，有牵挂，有自己放不下的人和事。而你，在他们的故事里，也有了一个位置。",
"你在页边写下：『也许真正的羁绊，不是谁欠谁，而是——我们都记得对方。』",
"你合上笔记，心里有一种说不上来的暖意，和一点说不上来的惆怅。"
],
options:[
{t:"继续读下一章", go:"hook_hub"}
]
}};

N["hook_item"]=function(){return{
place:"学院·夜读笔记",
text:[
"你翻到道具那一章。你列着那些物件的来路与去向：黄林晶的信、旧怀表、银叶书签、铜罗盘、铁牌、银羽毛徽章、两粒种子、圣水、铜扣……",
"每一件，都有一个人，一段故事。你忽然觉得，行囊里的东西，像一张网——每一样，都连着一个人，牵着一根线，指向一个方向。",
"你在页边写下：『物件不会说话，但它们记得。』",
"你合上笔记，摸了摸怀里的信和徽章。它们贴着你，像一群沉默的老朋友。"
],
options:[
{t:"合上笔记", go:"pol_hub"}
]
}};



// ============================================================
// v39 方向八：任务系统网络化（18节点）
// ============================================================

N["quest_hub"]=function(){return{
place:"学院·任务清单",
text:[
"你在灯下铺开一张自己画的「任务网」。每一条任务，不是孤立的线——它们彼此交叉、牵连、互为因果。",
"你在纸上画了四个圈：查账（资金流向）、救人（白崖学生）、守印（第七印碎片）、寻人（老鸦与身世）。四个圈彼此重叠，中间交叉的部分，写着同一个词：真相。",
"你看着这张网，忽然明白——你接下的每一个任务，都不是终点，而是网上的一个节点。拉一根线，整张网都会动。",
"你收起纸，决定从最紧的那根线开始拉。"
],
options:[
{t:"推进查账任务", go:"quest_ledger_1"},
{t:"推进救人任务", go:"quest_rescue_1"},
{t:"推进守印任务", go:"quest_seal_1", effect:{world:[{force:"watcher",inf:1}]}},
{t:"推进寻人任务", go:"quest_find_1"},
{t:"检查有没有被忽略的线索", go:"quest_hidden_1"},
{t:"回想失败过的任务", go:"quest_fail_1"},
{t:"回学生会", go:"pol_hub"}
]
}};

N["quest_ledger_1"]=function(){return{
place:"任务·查账",
text:[
"查账的任务，你已经追到了西海岸——白崖、磐石、星尘矿，线头越来越多。你重新翻出老鸦的账本，逐条比对，发现一个之前忽略的规律：",
"每一笔流向磐石的「维护费」，都对应着一个学院「转学」学生的名字。数量对得上。也就是说——那笔钱的每一个铜板，都蘸着一个失踪学生的分量。",
"你合上账本，心里发沉。你想起马库斯的话、老霍的话、灰翎的话——所有线索，在这一刻汇成同一条河：学院的「转学」名单，就是白崖的「进货单」。",
"你把账本锁回箱子。这个任务，已经不是「查账」了——是「查人」。而查人的路，你已经踏上了。"
],
options:[
{t:"继续深挖名单", go:"quest_ledger_2"},
{t:"先去救人", go:"quest_rescue_1"}
]
}};

N["quest_ledger_2"]=function(){return{
place:"任务·查账：名单",
text:[
"你把学院历年的「转学」名单与白崖的船期做了比对——你发现，名单上的人，与白崖每月十五号的船，几乎是同一天消失的。",
"这条线，已经清晰地指向一个结论：学院内部，有人负责「筛选」，有人负责「交接」。筛选的人，可能是教务长；交接的人，可能是塞德——而最终经手的人，是白崖的R。",
"你把这些线索整理成一份报告。你没有交给任何人——你决定，先把它藏在一个只有你知道的地方。因为你不知道，这份报告如果落在错误的人手里，会牵连多少人。",
"你把它折好，藏进西塔楼地基那块石板下——那个曾经放过「第三方」东西的地方。做完这一切，你站起身，拍了拍手上的土。有些证据，要用在最关键的时刻。"
],
options:[
{t:"去救人", go:"quest_rescue_1"}
]
}};

N["quest_rescue_1"]=function(){return{
place:"任务·救人",
text:[
"白崖的救援，需要一个计划。你在灯下摊开地图，标出白崖的岗哨、水牢、崖后小路——这些是你上次亲眼看到的。",
"但你知道，光靠你一个人，救不出所有人。你需要：一艘船（老丁的海燕号，可用）、一条不惊动守卫的路（崖后小路，可用）、以及——一个让R「睁一只眼闭一只眼」的理由。",
"你想起R说过的话：「你可以走同样的路——或者，走你自己的路。」你决定，走自己的路。",
"你在计划书末尾写道：『目标：救出全部学生。风险：极高。退路：海燕号。』你合上计划书，吹熄蜡烛。有些事，想清楚了，就该做了。"
],
options:[
{t:"联络帮手", go:"quest_rescue_2"},
{t:"先去探一次白崖", go:"west_white_cliff"}
]
}};

N["quest_rescue_2"]=function(){return{
place:"任务·救人：帮手",
text:[
"你开始联络帮手。洛琳爽快地应了：「查消息，我熟。你要白崖的船期表？三天后给你。」昆特沉默了一会儿，说：「我欠你一次。要打架，算我一个。」马库斯只说了两个字：「我去。」",
"灰翎没有答应，也没有拒绝。你去找她时，她正在星图前算着什么。你说完计划，她头也没抬：「白崖那座岛，我算过——它周围的洋流，每月初一到初三会转向。那时候船速最快，巡逻船最少。」她顿了顿，「你选在那几天动手。」",
"你心里一暖。她嘴上没说帮忙，但连日子都替你算好了。",
"你走出占星塔时，手里已经有了一串名字：洛琳、昆特、马库斯、老丁，还有灰翎的洋流计算。你握紧拳，第一次觉得——白崖，不是不可撼动的。"
],
options:[
{t:"制定最终计划", go:"quest_rescue_3"}
]
}};

N["quest_rescue_3"]=function(){return{
place:"任务·救人：计划",
text:[
"你整合了所有人的资源：老丁的船、灰翎的洋流、洛琳的船期表、昆特的武力、马库斯的接应。最终计划定在初二深夜动手——趁巡逻船最少，从崖后小路潜入，先开水牢，再走海路撤退。",
"你把计划讲给每个人听。洛琳听完，吹了声口哨：「像样。比学院那些社团活动刺激多了。」昆特只说了一句：「什么时候动手，叫我。」马库斯背对着你，点了点头。",
"行动前夜，你站在码头，看着海面。月亮只剩一弯，海风很凉。你摸了摸怀里的银羽毛徽章，又摸了摸腰间的铜罗盘。",
"明天晚上，就是动手的时候。你深吸一口气，海风灌进肺里，又咸又冷。你知道，这一夜之后，很多事都会不一样。"
],
options:[
{t:"行动开始", go:"quest_rescue_action"}
]
}};

N["quest_rescue_action"]=function(){return{
place:"白崖·行动夜",
text:[
"初二深夜，海燕号贴着礁石群摸进白崖海域。月亮被云遮住，海面漆黑一片。你带路，洛琳和昆特跟在后面，从崖后小路摸上崖顶。",
"巡逻的守卫比预想中少——灰翎算的洋流，果然准。你们绕开水牢的守卫，打开牢门。铁链哗啦作响，学生们惊醒，看见你们，先是愣住，然后有人哭了出来。",
"「别出声。」你压低声音，「跟我走。」",
"你们带着学生沿崖后小路撤退。走到一半，前方忽然亮起火光——一队守卫拦住了去路。为首的正是白天见过的那个灰袍管事：「我说今晚怎么这么安静——原来是有老鼠摸上来了。」",
"昆特拔刀上前，挡在你身前：「带人先走。这里交给我。」",
"你犹豫了一瞬，然后咬咬牙：「小心。」你带着学生，从侧面的礁石滩绕向海燕号。身后，刀剑碰撞声和火把的噼啪声混成一片。"
],
options:[
{t:"把学生送上船，回头支援昆特", go:"quest_rescue_end"}
]
}};

N["quest_rescue_end"]=function(){return{
place:"白崖·海边",
text:[
"你护送学生上船。老丁数了数人头，压低声音：「三十七个，齐了。你呢？那个大个子还没回来。」",
"你回头看了一眼崖顶——火光已经烧起来了。你攥紧拳，跳下船：「等我。」你拔腿往回跑，沿着来路冲回崖顶。",
"你赶到时，昆特正背靠着石壁，刀撑在地上，身上有伤，但面前倒了三个守卫。他看见你，咧嘴一笑：「不是让你走吗？」",
"「走不了。」你架住他，「走。」",
"你们且战且退，一路撤到海边。跳上船时，海燕号已经起锚。身后，白崖的灯火在夜色里晃动，传来模糊的喊叫声，但没有船追来——灰翎算的洋流，正把海燕号送向深海。",
"船舱里，获救的学生们挤在一起，有人在哭，有人抱着膝盖发抖。昆特靠着船舷，喘着气，忽然开口：「小子——」",
"「嗯？」",
"「这一趟，值。」他顿了顿，「我闺女要是知道她爹干了回人事，应该……会高兴。」",
"海风吹过，船尾划出一道白浪。白崖在夜色里越来越小，最后消失在海天交界处。你靠着船舷，月亮从云后露出半张脸，海面碎成一片银光。"
],
options:[
{t:"带着他们回海风港", go:"west_return"}
]
}};

N["quest_seal_1"]=function(){return{
place:"任务·守印",
text:[
"守印的任务，像一块压在心里的石头。重铸封印需要四件材料：火曜矿晶、灵魂碎片、枯荣之核、战魂印记——你已得其三，只差枯荣之核。",
"你摊开从禁书区得到的书卷。上面记载：枯荣之核，生于「枯荣之地」——一个生机与死气交汇的地方。你想起地下根系密林——世界树根系深处，正是枯与荣交织的地方。",
"你把书卷收好。看来，最后一站，是那片你救过腐根精的密林。你握紧拳——这次回去，不只是找材料，还要弄明白：是谁把噬魂种种在腐根精身上的。"
],
options:[
{t:"去世界树根系深处", go:"dun_tree_enter", effect:{world:[{force:"watcher",inf:2}]}},
{t:"先做准备", go:"quest_seal_2"}
]
}};

N["quest_seal_2"]=function(){return{
place:"任务·守印：准备",
text:[
"你为深入世界树根系做准备：墨丘利给了你两瓶防瘴气的药水，灰翎的罗盘能指引方向，怀里的圣水能压制契约纹的躁动。",
"你检查行囊：武器、火折子、圣水、罗盘、药水。你一样一样点过去，像战士检查铠甲。",
"临行前，你去了西塔楼。埃德蒙听完你的打算，没有劝阻，只递给你一卷旧布：「这是当年守印人留下的《根系图》——世界树根系的走向，标注得很细。你拿着，别走岔了。」",
"你接过《根系图》，展开一看——图上果然画着密密麻麻的根须走向，在密林深处，有一个红笔标注的叉，旁边写着两个字：「核心」。",
"你收起图，走下塔楼。月光下，你的影子被拉得很长。你知道，这一趟，可能比白崖更凶险——因为你要面对的东西，在地下，在黑暗里，在你自己的心里。"
],
options:[
{t:"出发", go:"dun_tree_enter"}
]
}};

N["quest_find_1"]=function(){return{
place:"任务·寻人",
text:[
"寻人的任务，有两根线：老鸦的下落，和你自己的身世。它们在你的追查中，渐渐缠成了同一根。",
"老鸦——你在西海岸找到了他。他还活着，还在查。而你的身世——你在学院档案里，翻到了你母亲的名字。她在这里读过书，毕业后去了一个小镇，然后隐姓埋名。",
"你站在档案室门口，阳光照在走廊上。你忽然想：母亲当年在这座学院里，经历了什么？她为什么选择离开、隐姓埋名？她留下的那枚守望者徽章——为什么从来没有提起过？",
"你合上档案，心里多了一个新的问题。而这个问题的答案，也许就在学院地下，或者——就在圣城。"
],
options:[
{t:"查母亲的档案", go:"quest_find_2"},
{t:"去找老鸦问", go:"west_warehouse"}
]
}};

N["quest_find_2"]=function(){return{
place:"任务·寻人：母亲的痕迹",
text:[
"你再次潜入学院档案室，找到母亲的学籍档案。她的成绩单、导师评语、社团记录——你一样一样翻过去，指尖拂过那些泛黄的纸页。",
"她的导师评语写着：「勤奋、敏锐，但心事重。常独自去图书馆，借阅书目集中在封印与古文字。」",
"你心里一动。封印与古文字——母亲也在研究这些？你顺着她的借阅记录查下去，最后一条记录，停留在一个日期——那正是她毕业前的那个学期。之后，她再没有借阅过任何书。",
"借阅记录的末尾，有一行铅笔小字，笔迹与母亲的不同：「她把不该带走的东西，带走了。」",
"你盯着那行字，指尖微微发凉。母亲带走了什么？你翻遍她的档案，没有找到任何线索——但那行字，像一根刺，扎进了你心里。",
"你合上档案，把它放回原处。走出档案室时，你忽然明白了：母亲的秘密，也许不是她带走了什么——而是她知道了什么，然后选择带走自己，远离这一切。"
],
options:[
{t:"顺着这个方向查下去", go:"quest_find_3"}
]
}};

N["quest_find_3"]=function(){return{
place:"任务·寻人：母与子",
text:[
"你把母亲的档案，和你在学院查到的所有线索放在一起。你忽然发现一个惊人的巧合：母亲的借阅记录中，有一本书——《封印发微》。",
"和墨丘利给你的一模一样。",
"你翻出墨丘利给你的《封印发微》，翻到夹着银叶书签的那一页。你忽然想：这本书，是不是曾经属于你母亲？墨丘利是不是认识她？",
"你合上书，心跳有些快。你决定——去问墨丘利。有些问题，你憋了很久：他为什么把这本书给你？他是不是从一开始，就知道你是谁？",
"你站起身，朝墨丘利的办公室走去。阳光从走廊的窗户照进来，你的影子在光里拉得很长。"
],
options:[
{t:"去找墨丘利", go:"quest_find_4"}
]
}};

N["quest_find_4"]=function(){return{
place:"任务·寻人：问墨丘利",
text:[
"你推开墨丘利办公室的门。他正在给炼金瓶加热，听见脚步声，头也不抬：「泡茶的水在窗台。」",
"你没有泡茶。你走到他桌前，把那本《封印发微》放在他面前：「这本书——是我母亲的书，对吗？」",
"墨丘利的手顿住了。他慢慢放下镊子，抬起头，透过厚厚的镜片看你。办公室安静了很久，他才开口：「你查到了。」",
"「她是谁？」你问，「她在这座学院，经历了什么？」",
"墨丘利摘下眼镜，擦了擦，声音有些涩：「你母亲——她是我最好的学生。三十年前，她和你一样，查到了封印的事。她查得比你还深——深到，有人开始注意她。」他顿了顿，「后来，她走了。她说她要去过普通的日子——」他看向你，「她把你，也带去过普通的日子。」",
"你站在原地，心里翻涌着说不清的情绪。你母亲——一个曾经和你一样、追查真相到底的人，最后选择离开一切，过普通的日子。",
"墨丘利把眼镜戴回去，声音恢复了平淡：「她走的时候，把这本书留给了我。她说：『如果有一天，有个孩子拿着它来找你——告诉他，妈妈只是累了。』」",
"你握着那本书，指节发白。窗外的阳光，照在你身上，暖洋洋的。你站在原地，很久没有说话。"
],
options:[
{t:"谢谢他，把书收好", go:"pol_hub"}
]
}};

N["quest_hidden_1"]=function(){return{
place:"任务·被忽略的线索",
text:[
"你在灯下复盘一路的线索，忽然发现几处被你忽略的细节：",
"第一，西塔楼地基下的石板——你藏报告时，发现石板内侧有一道旧划痕，像是一个「T」字，被人用小刀刻过。",
"第二，禁书区书卷的最后一页——除了材料清单，页脚还有一行极小的字：「若寻枯荣之核，先问枯荣之心。」你当时没在意，现在再看，像是某种提示。",
"第三，灰翎的铜罗盘——你发现罗盘的背面，刻着一串极小的刻度，不是罗盘用的，像是一组坐标。",
"你把这三条线索记下来。它们像是三扇被忽略的侧门，等你哪天回头，推开来看看。"
],
options:[
{t:"调查西塔楼的T字划痕", go:"quest_hidden_2"},
{t:"研究罗盘背面的坐标", go:"quest_hidden_3"},
{t:"先搁置，做主要任务", go:"quest_hub"}
]
}};

N["quest_hidden_2"]=function(){return{
place:"任务·塔楼的T字",
text:[
"你深夜又去了西塔楼，撬开那块石板。石板内侧的「T」字划痕，在月光下清晰可见。你伸手摩挲——划痕边缘圆润，不像新刻的，至少有好几年了。",
"你翻过石板。背面除了「T」字，还有一行更淡的字，几乎与石纹融为一体：「钥匙在第七块砖后。」",
"第七块砖——你数着塔楼地基的砖块，从墙角数起，第七块。你撬开那块砖，砖后是空的，里面躺着一把黄铜钥匙，已经锈迹斑斑。",
"你拿起钥匙。它是开什么的？你试了塔楼所有的门——都配不上。你握着钥匙，忽然想起地下城最深处的青铜门。那扇门，你见过，但没有钥匙。",
"你收好钥匙，把石板盖回去。有些门，钥匙到了手，离推开就不远了。"
],
options:[
{t:"记住这把钥匙", go:"quest_hub"}
]
}};

N["quest_hidden_3"]=function(){return{
place:"任务·罗盘的坐标",
text:[
"你对照灰翎给你的铜罗盘背面刻着的坐标，查了学院地图——那组坐标，指向学院东南角一片废弃的苗圃。",
"你去了那片苗圃。杂草丛生，篱笆倒了一半。你按坐标走到苗圃正中央，蹲下来，拨开浮土——土里埋着一只铁盒，已经生锈。",
"你撬开铁盒。里面是一卷油布包裹的手稿，封皮上写着：《根系观测录》。翻开——是灰翎的笔迹，记录着学院地下世界树根系的每一次异动，日期从三年前开始，一直没有间断。",
"你合上手稿，心里明白了：灰翎一直在记录根系的变化——她说她「用不上」罗盘了，是因为她的方向，从来不在罗盘上，而在她自己的记录里。",
"你把铁盒埋回去，恢复了原样。你站起身，拍了拍手上的土，朝占星塔的方向看了一眼——有些人的守护，从来不说出口。"
],
options:[
{t:"把发现留在心里", go:"quest_hub"}
]
}};

N["quest_fail_1"]=function(){return{
place:"任务·失败的回响",
text:[
"你翻开笔记里那些「失败」的记录——那些你没能做成、做错、或者做了一半放弃的事。你原以为它们已经翻篇了，但此刻回看，你发现每一件失败的事，都在后续留下了回响：",
"你当年在序章里放过的那个抢劫你的人——后来听说他在你走后，被商队收留，改邪归正，如今在铁门关当了一名守夜人。",
"你当年没帮的那个小贩——后来听说他破产了，但他在落魄时，把你随口告诉他的一句「去圣城试试」，记在了心里。他去了，如今在圣城支了个摊。",
"你忽然明白：失败不是句号，是逗号。你以为翻过去的篇章，其实一直在后面，用你看不见的方式，继续写着。"
],
options:[
{t:"继续向前", go:"quest_hub"}
]
}};



// ============================================================
// v39 方向九：毕业与大陆连接深化（12节点）
// ============================================================

N["grad_hub"]=function(){return{
place:"学院·毕业季",
text:[
"毕业季到了。学院的空气里弥漫着一种奇怪的味道——紫藤花的香气、旧书的霉味、还有离别的酸涩。",
"毕业生们三三两两地站在走廊里，有人合影，有人沉默。食堂的阿姨难得多给了一勺菜，门房的老休恩逢人就说「常回来看看」。",
"你也站在这个队伍里。五年的学院生活——或者说，那些查账、下地下城、守封印的日子——即将画上一个句号。但你知道，句号之后，还有一段更长的路。",
"教务处贴出了毕业安排：毕业考试、答辩、典礼、离校。每一行字，都像倒计时。"
],
options:[
{t:"准备毕业考试", go:"grad_exam"},
{t:"想想毕业后的去向", go:"grad_choice"},
{t:"去见见想见的人", go:"grad_farewell"},
{t:"了解大陆局势", go:"grad_alumni_1"}
]
}};

N["grad_exam"]=function(){return{
place:"学院·毕业考场",
text:[
"毕业考场设在礼堂。监考的正是墨丘利，他坐在讲台上，面前摊着一摞卷子，目光扫过全场，最后在你身上停了一瞬。",
"卷子上的题目，大多是五年所学——炼金、符文、古代史、封印学。你答得顺畅，只有最后一道题，让你停了笔：",
"「请论述：知识应当被珍藏，还是被分享？结合所学，给出你的答案。」",
"你盯着那道题，想起禁书区的书、塔楼里的秘密、那些「不该知道」的事。你提笔写道：",
"「知识像水。珍藏，是为了不让它泛滥；分享，是为了不让它腐臭。真正难的不是选一边，而是知道——什么时候该关上闸门，什么时候该开渠引水。」",
"你交卷时，墨丘利接过卷子，看了一眼你的答案，没有评价，只是点了点头，像是满意，又像是别的什么。"
],
options:[
{t:"走出考场", go:"grad_ceremony"}
]
}};

N["grad_ceremony"]=function(){return{
place:"学院·毕业典礼",
text:[
"毕业典礼那天，天很蓝。全校师生站在礼堂前的广场上，院长致辞、教授发言、优秀毕业生代表讲话——一切都按部就班，像一场排练了无数遍的仪式。",
"你站在毕业生的人群里，听着那些祝词。阳光很好，照在每个人的脸上。你忽然想起五年前入学那天——也是这样的阳光，也是这样的人群，只是那时候，你谁也不认识。",
"典礼的最后，全体毕业生向教授鞠躬。你弯下腰时，余光看见墨丘利站在台上，镜片反着光，看不清表情。但你感觉——他在看你。",
"礼成。帽子抛向天空，欢呼声四起。你站在人群里，没有欢呼，只是抬起头，看着那些帽子在蓝天下划出弧线，然后落下。五年，就这样过去了。"
],
options:[
{t:"领取毕业证书", go:"grad_choice"}
]
}};

N["grad_choice"]=function(){return{
place:"学院·毕业去向",
text:[
"毕业证书发到你手里，羊皮纸卷轴，烫金校徽，系着蓝丝带。你展开看了一眼，又卷好，收进怀里。",
"接下来的选择，比任何考试都难——去哪里？做什么？",
"你面前的桌上，摆着几封邀请信：",
"一封来自守望者——埃德蒙代转的，措辞克制：「你已证明自己。守望者需要你。」",
"一封来自西海岸——老鸦托人带来的，只有一句话：「海还是蓝的。想跑船了，来找我。」",
"一封来自圣城——克莱门特主教的亲笔：「圣光神学院愿聘你为特聘研究员，研究古代封印。」",
"一封来自自由城邦商会——洛琳牵的线：「来商会吧，我缺个会查账的搭档。」",
"你看着那几封信，心里清楚：这不是去向的选择——是人生道路的选择。"
],
options:[
{t:"加入守望者", go:"grad_watcher"},
{t:"去西海岸找老鸦", go:"grad_west"},
{t:"去圣城研究封印", go:"grad_holy"},
{t:"去自由城邦商会", go:"grad_free"},
{t:"先不急，再想想", go:"grad_farewell"}
]
}};

N["grad_watcher"]=function(){return{
place:"学院·毕业去向：守望者",
text:[
"你拿起守望者的信。埃德蒙的字迹，你认得——工整、克制，像他本人。",
"你想起这五年来，那座塔楼的灯，永远在深夜亮着。你想起银羽毛徽章贴着心口的温度。你想起埃德蒙说的那句：「守到有下一个人接住它的时候。」",
"你在信上，落笔写下一个「好」字。",
"当晚，你去了西塔楼。埃德蒙正在浇花，听见脚步声，没有回头：「决定了？」",
"「决定了。」",
"他放下水壶，转过身来。月光从窗外照进来，他看了你很久，然后说：「守望者这条路，不好走。但——」他顿了顿，「总得有人走。」他伸出手，手里躺着一枚新的银羽毛徽章，「欢迎入列。」",
"你接过徽章。两枚银羽毛，一枚旧的，一枚新的，在你手心里并排躺着，月光下泛着相同的冷光。"
],
options:[
{t:"接下使命", go:"grad_first_journey"}
]
}};

N["grad_west"]=function(){return{
place:"学院·毕业去向：西海岸",
text:[
"你拿起老鸦的信。只有一句话，像他本人——简洁，不废话。",
"你想起西海岸的海风、白崖的灯火、还有那个缺了一根小指、还在查账的老人。你想了想，在信上画了个圈，圈住那个「海还是蓝的」。",
"收拾行囊时，你把这几年收集的材料分门别类：火曜矿晶、灵魂碎片、战魂印记、铅盒里的噬魂种、灰黑种子——你决定，带着它们去西海岸。老鸦在查钱，你在查封印——你们俩合起来，就是一条完整的线。",
"临行前，你最后看了一眼学院的钟楼。晨光里，塔楼的灯刚刚熄灭——那是埃德蒙一夜未眠的证明。你朝塔楼的方向，挥了挥手，然后转身，朝西走去。"
],
options:[
{t:"出发去西海岸", go:"grad_first_journey"}
]
}};

N["grad_holy"]=function(){return{
place:"学院·毕业去向：圣城",
text:[
"你拿起克莱门特的信。措辞得体、客气——但你知道，圣光神学院不会无缘无故请人研究「古代封印」。",
"你想起克莱门特在禁书区里的笑容，想起他指尖在院长掌心划下的暗号。这个人，比表面复杂得多。但圣城——那里有黄林晶的信指向的旧钟楼，有你母亲走过的路，有「第二行字」等你验证的线索。",
"你在信上写下「承蒙厚爱，愿往」。有些地方，明知水深，也要去蹚——因为你需要的东西，在水底。",
"临行前，你去找了墨丘利。他听完你的决定，沉默了一会儿，只说了句：「圣城的水，比学院的深。你记住——那里的每一句『愿圣光照亮你』，都可能有第二层意思。」",
"你点点头。走出学院大门时，你回头看了一眼，然后朝着圣城的方向，迈步走去。"
],
options:[
{t:"出发去圣城", go:"grad_first_journey"}
]
}};

N["grad_free"]=function(){return{
place:"学院·毕业去向：自由城邦",
text:[
"你拿起商会的信。洛琳的字迹龙飞凤舞，像她本人——张扬，但靠谱。",
"你想起自由城邦的市井烟火，想起序章时那个在商会跑腿的自己。五年前，你从那里出发，去了学院；五年后，你带着一身的秘密，准备回去。",
"你在信上写下：「搭档的位置，给我留着。」",
"临行前，你去找了灰翎。她正在收拾占星塔的星图，听说你要去自由城邦，只「嗯」了一声。你转身要走，她叫住你：「城邦的水深，人心也深。你查账的本事够用，但——」她顿了顿，「偶尔，也信一信人。」",
"你笑了笑：「知道了。」",
"走出占星塔时，风从塔顶吹下来，带着星图纸页的气息。你回头看了一眼——她还站在塔楼的窗边，像一盏不肯熄的灯。"
],
options:[
{t:"出发去自由城邦", go:"grad_first_journey"}
]
}};

N["grad_farewell"]=function(){return{
place:"学院·告别",
text:[
"离校前的最后几天，你走遍了学院每一个角落：图书馆你常坐的窗边、占星塔的天台、西塔楼的台阶、旧食堂的二楼、训练场的沙地。",
"塞西莉亚在食堂门口等你，递给你一个油纸包：「路上吃。」你没有打开，但隔着纸都能闻到南瓜饼的甜香。她看着你，笑了笑：「记得写信。」",
"灰翎没有送你。但你回宿舍时，门上夹着一片银叶——新的，还带着晨露。",
"埃德蒙在塔楼里，递给你一包东西：「老鸦托人捎来的。他说，海还是蓝的。」",
"你走出校门那天，没有回头。但你心里知道——这座学院，这段日子，这些名字，会跟着你，走到很远很远的地方。"
],
options:[
{t:"踏上新旅程", go:"grad_first_journey"}
]
}};

N["grad_first_journey"]=function(){return{
place:"旅途·第一段路",
text:[
"你背着行囊，走上毕业后的第一段路。晨光洒在路面上，你的影子被拉得很长。",
"身后，学院的尖塔在晨雾里渐渐模糊；身前，大陆的轮廓在朝阳中缓缓展开。你走了一段，在路边停下，回头看了一眼——雾里的学院，像一个慢慢合上的梦。",
"你摸了摸怀里的毕业证书，又摸了摸贴着胸口的银羽毛徽章。然后你转身，继续走。",
"路还很长。但你不再是一个人了——你带着那些名字、那些物件、那些未完成的线头，一起走。每一件，都是你的一部分。",
"晨风拂过脸颊，带着田野的气息。你深吸一口气，加快脚步。前方，大陆的版图正缓缓展开——你毕业了，但你的故事，才刚刚开始。"
],
options:[
{t:"继续前行", go:"grad_alumni_1"}
]
}};

N["grad_alumni_1"]=function(){return{
place:"大陆·校友网络",
text:[
"毕业后，你渐渐发现——「校友」这两个字，比想象中更有分量。",
"在自由城邦，你遇到一个自称「同届」的商人，他帮你免了三成关税，只因为「学院的学弟，能帮就帮」；在铁门关，一个老兵认出了你的校徽，给你腾了半间营房；在西海岸，游侠学院的学生听说是艾尔达毕业的，主动给你指了条避开风暴的航路。",
"你渐渐明白：学院给你的，不止是知识和秘密——还有一张网。这张网上，系着几百年来每一个从这座学院走出去的人。他们散落在大陆各处，做着不同的事，但当「校友」两个字响起时，他们会抬起头，互相看一眼。",
"你走在路上，忽然觉得，自己不是一个人。这张网，会陪你走很远——而你，也会成为这张网上，新的一个结。"
],
options:[
{t:"继续旅程", go:"grad_alumni_2"}
]
}};

N["grad_alumni_2"]=function(){return{
place:"大陆·校友的回响",
text:[
"一次，你在边境的酒馆里，听到一个年迈的说书人讲古：",
"「……说到那座学院，当年出过不少人物。有个人，查清了学院的一笔烂账，救回了三十七个被卖到海外的学生；有个人，年纪轻轻接了守印人的担子，守着一口石棺，守了很多年；还有个人——」说书人顿了顿，压低声音，「据说，他母亲也是那所学院的。母子俩，都查过那笔账。」",
"你坐在酒馆角落，端着酒杯，没有出声。说书人讲的，是你，也不是你——故事在流传中变了形，添了油，加了醋。但核心的东西，还在：查账、救人、守印。",
"你喝完酒，放下几枚铜板，走出酒馆。夜色里，边境的星星很亮。你忽然觉得，你做的事，已经不只是你一个人的事了——它成了故事，成了传说，成了后来人茶余饭后的谈资。",
"而你，还要继续走。因为故事没有写完——那口石棺的封印，还没有重铸；黄林晶的信，还没有读完；那张网，还等着你，结上更多的结。"
],
options:[
{t:"继续你未完成的路", go:"pol_hub"}
]
}};



// ============================================================
// v40 占位节点重写·第一批（15个核心枢纽）
// ============================================================




// ============================================================
// v40 占位节点重写·第二批（20个区域关键节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第三批（21个学院/结局/势力节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第四批（24个区域/功能节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第五批（31个seal4主线节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第六批（20个学院/设施/假期/任务节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第七批（29个学院/任务/势力/遗物节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第八批（24个遗物/特殊节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第九批（24个 seal2 第二印·愤怒之印线路节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十批（16个 seal3 第三印·傲慢之印第一幕节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十一批（13个 seal3 傲慢之印第二~四幕节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十二批（13个 seal5 深渊之水·海族主线节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十三批（23个 seal5 扩展分支节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十四批（18个 seal6 懒惰之印节点）
// ============================================================




// ============================================================
// v40 占位节点重写·第十五批（26个 seal7/日蚀分支/seal1收尾/结局检查）
// ============================================================




// v41 占位重写·第一批（38个 出身序章）



// v41 占位重写·第二批（21个 旅行路线）



// v41 占位重写·第三批（48个 城市探索）



// v41 占位重写·第四批（22个 学院年度）



// v41 占位重写·第五批（24个 同学支线）


/* ============================================================
   v42 技术层：基础设施（StorageKit / ErrorLog / RenderBatch /
   ChunkLoader / renderPerf / DebugPanel / PWA注册）
   全部独立命名空间，不污染 S 对象。
   ============================================================ */

/* ---- 批量渲染缓冲：DocumentFragment + rAF ---- */
const RenderBatch = (function(){
  let buf = [];
  let pending = false;
  function flush(){
    pending = false;
    if(!buf.length) return;
    const el = typeof storyEl !== "undefined" ? storyEl : null;
    if(!el){ buf = []; return; }
    const frag = document.createDocumentFragment();
    const appended = [];
    for(let i=0;i<buf.length;i++){ frag.appendChild(buf[i]); appended.push(buf[i]); }
    buf = [];
    el.appendChild(frag);
    try{ if(typeof v34_afterFlush === 'function') v34_afterFlush(appended); }catch(e){}
    try{ el.scrollTop = el.scrollHeight; }catch(e){}
  }
  return {
    push: function(el){
      buf.push(el);
      if(pending) return;
      pending = true;
      if(window.requestAnimationFrame) window.requestAnimationFrame(function(){ flush(); });
      else setTimeout(flush, 16);
    },
    flush: flush
  };
})();

/* ---- 渲染性能探针 ---- */
const renderPerf = (function(){
  const samples = [];
  return {
    record: function(ms){
      samples.push(ms);
      if(samples.length > 100) samples.shift();
    },
    stats: function(){
      if(!samples.length) return {avg:0, max:0, count:0, last:[]};
      let sum=0, max=0;
      for(const s of samples){ sum+=s; if(s>max) max=s; }
      return {avg:Math.round(sum/samples.length), max:Math.round(max), count:samples.length, last:samples.slice(-10).map(function(x){return Math.round(x);})};
    }
  };
})();

/* ---- StorageKit：三层存储（localStorage 同步 + IndexedDB 异步 + 导出/导入灾备） ---- */
const StorageKit = (function(){
  const MAIN_KEY = (typeof RULESET_ID !== "undefined" ? RULESET_ID : "elda-qunxiong-v3") + "-save";
  const DB_NAME = "elda-saves";
  const STORE = "saves";
  let db = null;
  function openDB(cb){
    if(!window.indexedDB){ if(cb) cb(null); return; }
    try{
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function(){
        if(!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = function(){ db = req.result; if(cb) cb(db); };
      req.onerror = function(){ db = null; if(cb) cb(null); };
    }catch(e){ if(cb) cb(null); }
  }
  function lsKey(slot){
    return slot === "slot1" ? MAIN_KEY : "elda-save-slot-" + slot;
  }
  function saveToLS(slot, data){
    try{
      localStorage.setItem(lsKey(slot), JSON.stringify(data));
      return true;
    }catch(e){
      if(e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014)){
        try{ if(typeof flashMsg === "function") flashMsg("⚠ 本地存储空间不足：请立即导出存档备份！"); }catch(_){}
      } else {
        try{ if(typeof flashMsg === "function") flashMsg("存档写入异常：" + e.message); }catch(_){}
      }
      return false;
    }
  }
  function readFromLS(slot){
    try{
      const raw = localStorage.getItem(lsKey(slot));
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }
  function saveToIDB(slot, data){
    if(!window.indexedDB) return;
    openDB(function(dbx){
      if(!dbx) return;
      try{
        const tx = dbx.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(data, slot);
      }catch(e){}
    });
  }
  function readFromIDB(slot, cb){
    if(!window.indexedDB){ if(cb) cb(null); return; }
    openDB(function(dbx){
      if(!dbx){ if(cb) cb(null); return; }
      try{
        const req = dbx.transaction(STORE).objectStore(STORE).get(slot);
        req.onsuccess = function(){ if(cb) cb(req.result || null); };
        req.onerror = function(){ if(cb) cb(null); };
      }catch(e){ if(cb) cb(null); }
    });
  }
  return {
    save: function(data){
      const slot = data.slotId || "slot1";
      const okLS = saveToLS(slot, data);
      saveToIDB(slot, data);
      return okLS;
    },
    load: function(slot){
      return readFromLS(slot || "slot1");
    },
    loadIDB: function(slot, cb){ readFromIDB(slot || "slot1", cb); },
    deleteSlot: function(slot){
      try{
        localStorage.removeItem(lsKey(slot));
        if(window.indexedDB) openDB(function(dbx){
          if(!dbx) return;
          try{ dbx.transaction(STORE, "readwrite").objectStore(STORE).delete(slot); }catch(e){}
        });
      }catch(e){}
    },
    exportJSON: function(){
      if(typeof S === "undefined" || !S){ try{ flashMsg("当前没有可导出的角色"); }catch(e){} return false; }
      const data = JSON.parse(JSON.stringify(S));
      data.saveVersion = 42;
      data.ruleset = (typeof RULESET_ID !== "undefined") ? RULESET_ID : "elda-qunxiong-v3";
      const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const d = new Date();
      a.download = "elda-save-day" + (S.day||1) + "-" + d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0"+d.getDate()).slice(-2) + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return true;
    },
    importJSON: function(file, cb){
      const fr = new FileReader();
      fr.onload = function(){
        try{
          const d = JSON.parse(fr.result);
          if(d.ruleset !== (typeof RULESET_ID !== "undefined" ? RULESET_ID : "elda-qunxiong-v3")){
            if(cb) cb({ok:false, msg:"存档规则集不匹配"}); return;
          }
          if(cb) cb({ok:true, data:d});
        }catch(e){ if(cb) cb({ok:false, msg:"存档文件解析失败"}); }
      };
      fr.onerror = function(){ if(cb) cb({ok:false, msg:"读取文件失败"}); };
      fr.readAsText(file);
    }
  };
})();

/* ---- ErrorLog：全局错误捕获（window.onerror + unhandledrejection） ---- */
const ErrorLog = (function(){
  const KEY = "elda-error-log";
  let mem = [];
  function loadAll(){
    try{ const a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; }catch(e){ return []; }
  }
  function push(rec){
    mem.push(rec);
    if(mem.length > 50) mem.shift();
    try{
      const all = loadAll();
      all.push(rec);
      while(all.length > 200) all.shift();
      localStorage.setItem(KEY, JSON.stringify(all));
    }catch(e){}
  }
  function fmt(rec){
    return "[" + (rec.time||"") + "] " + (rec.msg||"") +
      (rec.node ? " @节点:" + rec.node : "") +
      (rec.src ? " (" + rec.src + ")" : "");
  }
  return {
    init: function(){
      try{
        window.addEventListener("error", function(e){
          push({
            time: new Date().toLocaleTimeString(),
            msg: e.message || "未知错误",
            src: e.filename ? e.filename.replace(/^.*[\\\/]/,"") + ":" + (e.lineno||0) : "",
            node: (typeof curNode !== "undefined") ? curNode : ""
          });
        });
        window.addEventListener("unhandledrejection", function(e){
          let m = "Promise错误";
          try{ m = "Promise: " + ((e.reason && e.reason.message) ? e.reason.message : String(e.reason || "")); }catch(_){}
          push({ time: new Date().toLocaleTimeString(), msg: m, node: (typeof curNode !== "undefined") ? curNode : "" });
        });
      }catch(e){}
    },
    push: push,
    list: function(){ return mem.slice(); },
    all: function(){ return loadAll(); },
    text: function(){
      const all = loadAll();
      return all.map(fmt).join("\n") || "暂无错误记录";
    },
    clear: function(){
      mem = [];
      try{ localStorage.removeItem(KEY); }catch(e){}
    }
  };
})();

/* ---- ChunkLoader：剧情分片按需加载（file:// 下动态 script 注入，禁 fetch/Worker/SW） ---- */
const ChunkLoader = (function(){
  const loaded = {};
  let chunkSeq = 0;
  const isChunked = (typeof NODE_MAP !== "undefined" && NODE_MAP !== null);
  function normName(n){ return String(n).replace(/\.js$/,""); }
  function doLoad(name, cb){
    name = normName(name);
    if(loaded[name]){ if(cb) cb(); return; }
    if(!isChunked){ loaded[name] = true; if(cb) cb(); return; }
    const s = document.createElement("script");
    s.src = "chunks/" + name + ".js";
    s.onload = function(){ loaded[name] = true; if(cb) cb(); };
    s.onerror = function(){
      if(!s._retried){
        s._retried = true;
        const s2 = document.createElement("script");
        s2.src = "chunks/" + name + ".js";
        s2.onload = function(){ loaded[name] = true; if(cb) cb(); };
        s2.onerror = function(){
          try{ writePar("【分片加载失败：" + name + "，请确认 chunks 目录完整】","noind flagline"); }catch(e){}
          if(cb) cb();
        };
        document.head.appendChild(s2);
      } else {
        try{ writePar("【分片加载失败：" + name + "，请确认 chunks 目录完整】","noind flagline"); }catch(e){}
        if(cb) cb();
      }
    };
    document.head.appendChild(s);
  }
  return {
    loadChunk: function(name, cb){ doLoad(name, cb); },
    ensureNodeLoaded: function(nodeId, cb){
      if(!isChunked || N[nodeId]){ if(cb) cb(); return; }
      if(typeof NODE_MAP === "undefined" || !NODE_MAP[nodeId]){ if(cb) cb(); return; }
      const chunk = NODE_MAP[nodeId];
      if(loaded[chunk]){ if(cb) cb(); return; }
      const seq = ++chunkSeq;
      try{
        const d = document.createElement("p");
        d.className = "noind flagline v44-ph";
        d.id = "v44-ph-" + seq;
        d.textContent = "⏳ 正在翻越书页…";
        if(typeof storyEl !== "undefined" && storyEl) storyEl.appendChild(d);
      }catch(e){}
      doLoad(chunk, function(){
        try{ const ph = document.getElementById("v44-ph-" + seq); if(ph && ph.parentNode) ph.parentNode.removeChild(ph); }catch(e){}
        if(seq === chunkSeq && cb) cb();
      });
    },
    preloadNext: function(names){
      if(!isChunked) return;
      try{
        (names||[]).forEach(function(n){
          n = normName(n);
          if(loaded[n]) return;
          const s = document.createElement("script");
          s.src = "chunks/" + n + ".js";
          s.onload = function(){ loaded[n] = true; };
          document.head.appendChild(s);
        });
      }catch(e){}
    },
    loadedList: function(){ return Object.keys(loaded); },
    isChunked: isChunked
  };
})();

/* ---- DebugPanel：上帝调试面板（Ctrl+Shift+D / 连点标题5次） ---- */
const DebugPanel = (function(){
  let open = false;
  let clicks = 0, clickTimer = null;
  function build(){
    const s = renderPerf.stats();
    const nodes = (typeof N === "object" && N) ? Object.keys(N).length : 0;
    const chunks = ChunkLoader.loadedList();
    const st = (typeof S !== "undefined" && S) ? S : null;
    let summary = "无角色";
    if(st) summary = (st.name||"未命名") + " · 第" + (st.day||1) + "日 · " + (st.job||"?") + " · 槽位" + (st.slotId||"slot1") + " · 金币" + (st.gold||0);
    let jsonText = "";
    if(st){
      try{ jsonText = JSON.stringify(st, null, 1); }catch(e){ jsonText = "(序列化失败)"; }
      if(jsonText.length > 6000) jsonText = jsonText.slice(0, 6000) + "\n…(截断，深度有限)";
    }
    let h = '<h2>🔧 调试面板 <span class="dbg-tag">DEBUG</span></h2>';
    h += '<h4>节点跳转</h4>';
    h += '<div class="dbg-row"><input type="text" id="v42-dbg-node" placeholder="输入节点ID，如 fc_jiaohui_entry" /><button class="btn" onclick="DebugPanel.jump()">跳转</button></div>';
    h += '<div class="dbg-row" id="v42-dbg-jumpmsg" style="font-size:12px;color:var(--dim)"></div>';
    h += '<h4>当前状态</h4>';
    h += '<div class="dbg-row" style="font-size:13px">当前节点：<b class="dbg-k">' + (typeof curNode!=="undefined"?curNode:"—") + '</b> ｜ ' + summary + '</div>';
    h += '<div class="dbg-row" style="font-size:12px;color:var(--dim)">已加载分片：' + (chunks.length ? chunks.join("、") : (ChunkLoader.isChunked ? "无" : "单文件版（全部内联）")) + '</div>';
    h += '<h4>S 状态（JSON 摘要，深度截断）</h4>';
    h += '<div class="dbg-json">' + jsonText.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div>';
    h += '<h4>存档工具</h4>';
    h += '<div class="dbg-row"><button class="btn" onclick="saveGame()">保存当前槽位</button><button class="btn" onclick="v34_exportSave()">导出JSON</button><button class="btn" onclick="v34_importSave()">导入JSON</button><button class="btn" onclick="v34_openSavePanel()">存档管理</button></div>';
    h += '<h4>性能</h4>';
    h += '<div class="dbg-row" style="font-size:13px">writeNext 耗时：平均 <b class="dbg-v">' + s.avg + '</b>ms / 最大 <b class="dbg-v">' + s.max + '</b>ms（采样' + s.count + '次）</div>';
    h += '<div class="dbg-row" style="font-size:12px;color:var(--dim)">最近10次：' + (s.last.join("、")||"—") + ' ms ｜ 节点总数：' + nodes + '</div>';
    h += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="DebugPanel.toggle()">关闭面板</button></div>';
    return h;
  }
  function openPanel(){
    open = true;
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = build();
    openModal(box);
  }
  function closePanel(){
    open = false;
    const modal = document.getElementById('modal');
    if(modal) modal.classList.remove('show');
  }
  return {
    init: function(){
      try{
        document.addEventListener("keydown", function(e){
          if(e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")){
            e.preventDefault();
            toggle();
          }
        });
        const tb = document.getElementById("topbar");
        if(tb) tb.addEventListener("click", function(){
          clicks++;
          clearTimeout(clickTimer);
          clickTimer = setTimeout(function(){ clicks = 0; }, 1500);
          if(clicks >= 5){ clicks = 0; toggle(); }
        });
      }catch(e){}
    },
    toggle: function(){
      const modal = document.getElementById('modal');
      if(open && modal && modal.classList.contains('show')){ closePanel(); }
      else openPanel();
    },
    jump: function(){
      const inp = document.getElementById('v42-dbg-node');
      const msg = document.getElementById('v42-dbg-jumpmsg');
      if(!inp) return;
      const id = inp.value.trim();
      if(!id){ if(msg) msg.textContent = "请输入节点ID"; return; }
      if(typeof N === "undefined" || !N[id]){
        if(msg) msg.innerHTML = '<span style="color:var(--bad)">节点不存在：' + id + '</span>';
        return;
      }
      if(msg) msg.innerHTML = '<span style="color:var(--ok)">已跳转：' + id + '</span>';
      closePanel();
      curNode = id;
      writeNext();
    }
  };
})();

/* ---- PWA 注册（file:// 静默跳过，仅 http/https 生效） ---- */
(function(){
  try{
    if('serviceWorker' in navigator){
      if(location.protocol === 'http:' || location.protocol === 'https:'){
        navigator.serviceWorker.register('sw.js').catch(function(){});
      }
    }
  }catch(e){}
})();

/* ---- v42 初始化 ---- */
(function(){
  try{
    ErrorLog.init();
    DebugPanel.init();
  }catch(e){}
})();


/* ============================================================
   v42 补充：v34 面板函数有效定义
   （历史 v34 JS 被埋在 <style> 区被浏览器当作 CSS 忽略，
    此处重新定义，确保设置/存档管理/错误日志面板可用）
   ============================================================ */
if(typeof V34 === "undefined" || !V34){
  var V34 = {
    textSettings: { typewriterEnabled:false, typewriterSpeed:40, textEffects:false, autoScroll:true },
    sceneAtmosphere: { theme:"city", time:"noon", weather:"clear", particlesEnabled:false },
    diceSettings: { animationEnabled:true },
    audioSettings: { audioEnabled:false, sfxVolume:0.5 },
    uiSettings: { compactMode:false }
  };
}

function v34_settingRow(label, desc, key, type, min, max){
  var val = false;
  try{
    if(typeof S !== "undefined" && S && S.settings && S.settings[key] !== undefined) val = S.settings[key];
    else if(V34.textSettings[key] !== undefined) val = V34.textSettings[key];
    else if(V34.sceneAtmosphere[key] !== undefined) val = V34.sceneAtmosphere[key];
    else if(V34.diceSettings[key] !== undefined) val = V34.diceSettings[key];
    else if(V34.audioSettings[key] !== undefined) val = V34.audioSettings[key];
    else if(V34.uiSettings[key] !== undefined) val = V34.uiSettings[key];
  }catch(e){}
  var control = '';
  if(type === 'checkbox'){
    control = '<input type="checkbox" class="v34-checkbox" ' + (val?'checked':'') + ' onchange="v34_toggleSetting(\'' + key + '\', this.checked)">';
  } else if(type === 'slider'){
    control = '<input type="range" class="v34-slider" min="' + (min||0) + '" max="' + (max||100) + '" value="' + val + '" onchange="v34_setSettingValue(\'' + key + '\', this.value)">';
  }
  return '<div class="v34-setting-row">' +
    '<div><div class="v34-setting-label">' + label + '</div>' +
    '<div class="v34-setting-desc">' + desc + '</div></div>' +
    control + '</div>';
}

function v34_toggleSetting(key, value){
  try{
    if(typeof S === "undefined" || !S) S = {};
    if(!S.settings) S.settings = {};
    S.settings[key] = value;
    if(key === 'compactMode' && typeof v34_setCompactMode === 'function') v34_setCompactMode(value);
  }catch(e){}
}

function v34_setSettingValue(key, value){
  try{
    if(typeof S === "undefined" || !S) S = {};
    if(!S.settings) S.settings = {};
    S.settings[key] = (key === 'sfxVolume') ? value/100 : parseInt(value);
  }catch(e){}
}

function v34_renderSettings(){
  var html = '<h2>游戏设置</h2>';
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">文字演出</h4>';
  html += v34_settingRow('打字机效果', '剧情文字逐字显示', 'typewriterEnabled', 'checkbox');
  html += v34_settingRow('打字机速度', '文字显示速度', 'typewriterSpeed', 'slider', 10, 80);
  html += v34_settingRow('自动滚动', '新内容自动滚动到底部', 'autoScroll', 'checkbox');
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">界面</h4>';
  html += v34_settingRow('简洁模式', '关闭所有动画效果', 'compactMode', 'checkbox');
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">显示</h4>';
  html += '<div class="v34-setting-row"><div><div class="v34-setting-label">字号</div><div class="v34-setting-desc">故事正文大小</div></div><div class="v44-seg" id="v44-fontsize-seg"></div></div>';
  html += '<div class="v34-setting-row"><div><div class="v34-setting-label">主题</div><div class="v34-setting-desc">界面配色方案</div></div><div class="v44-seg" id="v44-theme-seg"></div></div>';
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">数据与调试</h4>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">';
  html += '<button class="btn" onclick="v34_openSavePanel()" style="flex:1 1 120px">📦 存档管理</button>';
  html += '<button class="btn" onclick="v34_openErrorLog()" style="flex:1 1 120px">🧾 错误日志</button>';
  html += '<button class="btn" onclick="DebugPanel.toggle()" style="flex:1 1 120px">🔧 调试面板</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim)">快捷键 Ctrl+Shift+D 或连点顶部标题栏5次可随时打开调试面板</div>';
  html += '<div style="text-align:center;margin-top:20px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_openSettings(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSettings();
  openModal(box);
  try{ v44_initSegs(); }catch(e){}
}

function v34_renderSaveSlots(){
  var html = '<h2>📦 存档管理</h2>';
  html += '<div style="text-align:center;font-size:12px;color:var(--dim);margin-bottom:10px">槽位1为主存档位，旧版存档自动兼容 · 写入自动双备份（本地+IndexedDB）</div>';
  for(var i=1;i<=5;i++){
    var saved = localStorage.getItem(i===1 ? RULESET_ID+"-save" : 'elda-save-slot-slot'+i);
    var empty = !saved;
    var nm='空存档槽', loc='-', day='-', pr=0, cl='';
    if(saved){
      try{
        var data = JSON.parse(saved);
        nm = data.name || ('第'+(data.day||1)+'日存档');
        loc = data.loc || (data.homeland || '未知');
        day = '第' + (data.day||1) + '日';
        pr = Math.min(100, Math.max(0, (data.day||0) % 100));
        cl = ' style="border-color:var(--gold)"';
      }catch(e){ nm='存档损坏'; }
    }
    var icon = empty ? '📁' : '⚔️';
    html += '<div class="save-slot-v34"' + cl + ' style="' + (empty?'opacity:.6;':'') + 'border-color:var(--line)">';
    html += '<div class="save-slot-thumb">' + icon + '</div>';
    html += '<div class="save-slot-info">';
    html += '<div class="save-slot-name">槽位' + i + ' · ' + nm + '</div>';
    html += '<div class="save-slot-meta"><span>📍 ' + loc + '</span><span>📅 ' + day + '</span></div>';
    html += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">';
    html += '<button class="btn" onclick="v34_saveToSlot(' + i + ')">💾 保存到此槽</button>';
    html += '<button class="btn" ' + (empty?'disabled':'') + ' onclick="v34_loadFromSlot(' + i + ')">📖 读取</button>';
    html += '<button class="btn btn-danger" ' + (empty?'disabled':'') + ' onclick="v34_deleteSlot(' + i + ')">🗑 删除</button>';
    html += '</div></div></div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">';
  html += '<button class="btn btn-gold" onclick="v34_exportSave()" style="flex:1">⬇ 导出存档(JSON)</button>';
  html += '<button class="btn" onclick="v34_importSave()" style="flex:1">⬆ 导入存档(JSON)</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim);margin-top:8px;text-align:center">导出=备份到本地文件；导入=从文件恢复，导入前会二次确认覆盖</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_saveToSlot(i){
  if(typeof S === "undefined" || !S || !S.name){ flashMsg("当前没有可保存的角色"); return; }
  try{
    S.choices=[]; S.curNode = curNode; S.saveVersion = 46;
    S.slotId = "slot" + i; S.saveTime = Date.now();
    StorageKit.save(S);
    closeModal(); flashMsg("已保存到槽位" + i);
    v34_openSavePanel();
  }catch(e){ flashMsg("保存失败：" + e.message); }
}

function v34_loadFromSlot(i){
  try{
    const d = StorageKit.load("slot" + i);
    if(!d){ flashMsg("槽位" + i + "没有存档"); return; }
    if(d.ruleset!==RULESET_ID){ flashMsg("存档版本不匹配"); return; }
    S = applyDefaults(d);
    S.saveVersion = S.saveVersion || 48;
    S.slotId = "slot" + i;
    closeModal(); logMsg("已读取槽位" + i + "存档（第"+S.day+"日）","g"); flashMsg("已读取槽位" + i);
    if(S.ending){ showEnding(S.ending); return; }
    curNode = S.curNode || "fc_jiaohui_entry";
    renderTop(); renderStats(); writeNext();
  }catch(e){ flashMsg("读档失败：" + e.message); }
}

function v34_deleteSlot(i){
  if(!confirm("确定删除槽位" + i + "的存档？此操作不可恢复。")) return;
  StorageKit.deleteSlot("slot" + i);
  closeModal(); flashMsg("已删除槽位" + i); v34_openSavePanel();
}

function v34_exportSave(){
  try{
    const ok = StorageKit.exportJSON();
    if(ok) flashMsg("存档已导出（JSON文件）");
  }catch(e){ flashMsg("导出失败：" + e.message); }
}

function v34_importSave(){
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.onchange = function(){
    const f = inp.files && inp.files[0];
    if(!f){ inp.remove(); return; }
    StorageKit.importJSON(f, function(res){
      inp.remove();
      if(!res.ok){ flashMsg(res.msg); return; }
      if(!confirm("将用存档文件覆盖当前进度，确定？")) return;
      try{
        S = applyDefaults(res.data);
        S.saveVersion = S.saveVersion || 48;
        S.slotId = S.slotId || "slot1";
        curNode = S.curNode || "fc_jiaohui_entry";
        saveGame();
        closeModal(); flashMsg("存档导入成功");
        if(S.ending){ showEnding(S.ending); return; }
        renderTop(); renderStats(); writeNext();
      }catch(e){ flashMsg("导入失败：" + e.message); }
    });
  };
  inp.click();
}

function v34_openSavePanel(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSaveSlots();
  openModal(box);
}

function v34_openErrorLog(){
  var logs = ErrorLog.text();
  var html = '<h2>🧾 错误日志</h2>';
  html += '<div class="dbg-json" id="v42-errorlog-body" style="max-height:50vh;white-space:pre-wrap;font-size:12px">' + logs.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div>';
  html += '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">';
  html += '<button class="btn" onclick="v42_copyErrorLog()" style="flex:1">复制全部</button>';
  html += '<button class="btn" onclick="v42_exportErrorLog()" style="flex:1">导出 txt</button>';
  html += '<button class="btn btn-danger" onclick="v42_clearErrorLog()" style="flex:1">清空日志</button>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = html;
  openModal(box);
}

function v42_copyErrorLog(){
  try{
    const txt = ErrorLog.text();
    if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ flashMsg("已复制错误日志"); }); }
    else{ const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); flashMsg("已复制错误日志"); }
  }catch(e){ flashMsg("复制失败"); }
}

function v42_exportErrorLog(){
  try{
    const blob = new Blob([ErrorLog.text()], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'elda-error-log.txt';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    flashMsg("错误日志已导出");
  }catch(e){ flashMsg("导出失败：" + e.message); }
}

function v42_clearErrorLog(){
  ErrorLog.clear();
  v34_openErrorLog();
  flashMsg("错误日志已清空");
}

function v34_openAchievements(){
  try{
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = '<h2>🏆 成就</h2><div style="color:var(--dim);font-size:13px;text-align:center;padding:20px 0">成就系统数据由图鉴面板呈现</div><div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
    openModal(box);
  }catch(e){}
}


/* ===== v43 恢复 v34 沉浸演出（自 style 区迁移） ===== */
/* ===== v34 UI沉浸感系统 ===== */

// 全局状态
var V34 = {
  sceneAtmosphere: {theme:"city", time:"noon", weather:"clear", abyssCorruption:0, particlesEnabled:true},
  textSettings: {typewriterEnabled:true, typewriterSpeed:8, autoScroll:true, textEffects:true},
  diceSettings: {animationEnabled:true, showNumbers:true, sfxEnabled:false},
  uiSettings: {panelStyle:"parchment", glassEffect:true, animations:true, compactMode:false},
  audioSettings: {enabled:false, bgmVolume:0.3, sfxVolume:0.3, ambientVolume:0.2, currentBgm:null, currentAmbient:null},
  codex: {achievements:{}, bestiary:{}, items:{}, locations:{}, characters:{}},
  combo: {success:0, fail:0},
  typewriter: {active:false, currentEl:null, fullText:"", timer:null}
};

// ========== 方向一：场景氛围动态系统 ==========
function v34_initAtmosphere(){
  // 创建氛围叠加层
  if(!document.getElementById('atmosphere-overlay')){
    var overlay = document.createElement('div');
    overlay.id = 'atmosphere-overlay';
    document.body.appendChild(overlay);
  }
  v34_applyAtmosphere();
}

function v34_setTheme(theme){
  V34.sceneAtmosphere.theme = theme;
  v34_applyAtmosphere();
}

function v34_setTime(time){
  V34.sceneAtmosphere.time = time;
  document.body.classList.remove('time-morning','time-noon','time-dusk','time-night');
  document.body.classList.add('time-' + time);
}

function v34_setWeather(weather){
  V34.sceneAtmosphere.weather = weather;
  document.body.classList.remove('weather-rain','weather-snow','weather-fog','weather-clear');
  document.body.classList.add('weather-' + weather);
  v34_updateParticles();
}

function v34_setAbyssCorruption(level){
  V34.sceneAtmosphere.abyssCorruption = level;
  document.body.classList.remove('abyss-high','abyss-critical');
  if(level >= 60) document.body.classList.add('abyss-high');
  if(level >= 90) document.body.classList.add('abyss-critical');
}

function v34_applyAtmosphere(){
  document.body.classList.remove('time-morning','time-noon','time-dusk','time-night');
  document.body.classList.add('time-' + V34.sceneAtmosphere.time);
  document.body.classList.remove('weather-rain','weather-snow','weather-fog','weather-clear');
  document.body.classList.add('weather-' + V34.sceneAtmosphere.weather);
  v34_updateParticles();
}

function v34_updateParticles(){
  // 清除旧粒子
  var old = document.querySelectorAll('.v34-particle');
  for(var i=0;i<old.length;i++) old[i].remove();
  if(!V34.sceneAtmosphere.particlesEnabled) return;
  var weather = V34.sceneAtmosphere.weather;
  var count = 0;
  if(weather === 'rain') count = 40;
  else if(weather === 'snow') count = 25;
  else if(weather === 'fog') count = 8;
  for(var j=0;j<count;j++){
    var p = document.createElement('div');
    p.className = 'v34-particle particle ' + (weather==='rain'?'rain-drop':'snow-flake');
    p.style.left = Math.random()*100 + '%';
    p.style.animationDelay = (Math.random()*3) + 's';
    p.style.animationDuration = (weather==='rain'?(0.3+Math.random()*0.3):(3+Math.random()*3)) + 's';
    if(weather==='snow'){ p.style.width = (3+Math.random()*4)+'px'; p.style.height = p.style.width; }
    document.body.appendChild(p);
  }
}

function v34_toggleParticles(enabled){
  V34.sceneAtmosphere.particlesEnabled = enabled;
  v34_updateParticles();
}

// ========== 方向二：文字演出与动效升级 ==========
function v34_typewriter(element, text, speed){
  if(!V34.textSettings.typewriterEnabled){
    element.innerHTML = text;
    return;
  }
  speed = speed || V34.textSettings.typewriterSpeed;
  V34.typewriter.active = true;
  V34.typewriter.currentEl = element;
  V34.typewriter.fullText = text;
  element.innerHTML = '';
  var cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  element.appendChild(cursor);
  var i = 0;
  function typeNext(){
    if(i < text.length){
      cursor.insertAdjacentText('beforebegin', text[i]);
      i++;
      V34.typewriter.timer = setTimeout(typeNext, speed);
    } else {
      cursor.remove();
      V34.typewriter.active = false;
    }
  }
  typeNext();
}

function v34_skipTypewriter(){
  if(V34.typewriter.active && V34.typewriter.currentEl){
    clearTimeout(V34.typewriter.timer);
    V34.typewriter.currentEl.innerHTML = V34.typewriter.fullText;
    V34.typewriter.active = false;
  }
}

function v34_applyTextEffect(text, effect){
  var effects = {
    whisper:'tx-whisper', shout:'tx-shout', ancient:'tx-ancient',
    abyss:'tx-abyss', thought:'tx-thought', important:'tx-important',
    fear:'tx-fear', memory:'tx-memory'
  };
  var cls = effects[effect] || '';
  if(cls) return '<span class="' + cls + '">' + text + '</span>';
  return text;
}

function v34_animateOptions(){
  var opts = document.querySelectorAll('#options .opt');
  for(var i=0;i<opts.length;i++){
    opts[i].classList.add('option-enter');
    opts[i].style.animationDelay = (i*0.08) + 's';
  }
}

function v34_markOptionChosen(optEl){
  optEl.classList.add('option-chosen');
}

function v34_sceneTransition(callback){
  var story = document.getElementById('story');
  if(story){
    story.classList.add('scene-transition');
    setTimeout(function(){
      if(callback) callback();
      story.classList.remove('scene-transition');
    }, 300);
  } else if(callback){ callback(); }
}

function v34_autoScroll(){
  if(V34.textSettings.autoScroll){
    var story = document.getElementById('story');
    if(story) story.scrollTop = story.scrollHeight;
  }
}

// ========== 方向三：判定演出系统 ==========
var V34_DICE_TIERS = {
  crit:{name:"大成功", cls:"dice-crit", texts:["完美！","神来之笔！","天助我也！","不可思议！","有如神助！"]},
  extreme:{name:"极难成功", cls:"dice-extreme", texts:["险胜！","勉强成功！","差一点！","好险！"]},
  hard:{name:"困难成功", cls:"dice-hard", texts:["成功。","还好。","勉强通过。"]},
  normal:{name:"成功", cls:"dice-normal", texts:["成功。","通过。","没问题。"]},
  fail:{name:"失败", cls:"dice-fail", texts:["失败……","差一点……","可惜……","没能成功……"]},
  critfail:{name:"大失败", cls:"dice-critfail", texts:["糟糕！","完蛋了！","大祸临头！","怎会如此！"]}
};

function v34_rollDice(target, rolled, tier, callback){
  if(!V34.diceSettings.animationEnabled){
    if(callback) callback();
    return;
  }
  var tierData = V34_DICE_TIERS[tier] || V34_DICE_TIERS.normal;
  var flavor = tierData.texts[Math.floor(Math.random()*tierData.texts.length)];
  
  // 创建遮罩
  var overlay = document.createElement('div');
  overlay.className = 'dice-overlay';
  overlay.id = 'v34-dice-overlay';
  overlay.innerHTML = 
    '<div class="dice-container">' +
    '<div class="dice-3d" id="v34-dice-num">?</div>' +
    '<div class="dice-result-banner ' + tierData.cls + '" id="v34-dice-banner" style="display:none">' + tierData.name + '</div>' +
    '<div class="dice-numbers" id="v34-dice-nums" style="display:none">' +
    '目标值：<span class="target">' + target + '</span> | 掷出：<span class="rolled ' + (tier==='fail'||tier==='critfail'?'fail':'success') + '">' + rolled + '</span>' +
    '</div>' +
    '<div class="dice-flavor" id="v34-dice-flavor" style="display:none">' + flavor + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  
  // 骰子旋转后显示结果
  setTimeout(function(){
    document.getElementById('v34-dice-num').textContent = rolled;
  }, 600);
  setTimeout(function(){
    document.getElementById('v34-dice-banner').style.display = 'block';
    document.getElementById('v34-dice-nums').style.display = 'block';
    document.getElementById('v34-dice-flavor').style.display = 'block';
  }, 800);
  
  // 点击或1.8s后关闭
  var closed = false;
  function closeDice(){
    if(closed) return;
    closed = true;
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .3s';
    setTimeout(function(){ overlay.remove(); }, 300);
    if(callback) callback();
  }
  overlay.addEventListener('click', closeDice);
  setTimeout(closeDice, 2000);
  
  // 更新连击
  if(tier === 'crit' || tier === 'extreme' || tier === 'hard' || tier === 'normal'){
    V34.combo.success++;
    V34.combo.fail = 0;
    if(V34.combo.success >= 2) v34_showCombo(V34.combo.success, 'success');
  } else {
    V34.combo.fail++;
    V34.combo.success = 0;
    if(V34.combo.fail >= 2) v34_showCombo(V34.combo.fail, 'fail');
  }
}

function v34_showCombo(count, type){
  var old = document.getElementById('v34-combo');
  if(old) old.remove();
  var combo = document.createElement('div');
  combo.className = 'combo-counter';
  combo.id = 'v34-combo';
  combo.textContent = (type==='success'?'连击 ':'厄运累积 ') + 'x' + count;
  combo.style.color = type==='success' ? '#2a5a2a' : '#6a2a1a';
  document.body.appendChild(combo);
  setTimeout(function(){ combo.remove(); }, 2000);
}

function v34_showGainLoss(gains, losses){
  var html = '<div style="margin:10px 0;padding:10px 14px;background:rgba(180,160,120,.1);border-radius:6px;border-left:3px solid #7a5a10">';
  if(gains){
    for(var i=0;i<gains.length;i++){
      html += '<div class="gain-loss-item gain-item" style="animation-delay:' + (i*0.1) + 's">+ ' + gains[i] + '</div>';
    }
  }
  if(losses){
    for(var j=0;j<losses.length;j++){
      html += '<div class="gain-loss-item loss-item" style="animation-delay:' + ((gains?gains.length:0)+j)*0.1 + 's">- ' + losses[j] + '</div>';
    }
  }
  html += '</div>';
  return html;
}

// ========== 方向五：面板质感与光影 ==========
function v34_applyPanelStyle(el, style){
  if(!el) return;
  el.classList.add('panel-v34');
  if(style === 'ornate') el.classList.add('panel-v34-ornate');
}

function v34_numberPop(el){
  if(!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // 触发重排
  el.style.animation = 'comboPop .3s ease-out';
}

function v34_animateProgressBar(bar, newValue){
  if(!bar) return;
  bar.style.width = newValue + '%';
}

function v34_setCompactMode(enabled){
  V34.uiSettings.compactMode = enabled;
  document.body.classList.toggle('simple-mode', enabled);
}

// ========== 方向四：交互地图 ==========
var V34_MAP_LOCATIONS = {
  free_city:{id:"free_city",name:"交汇城",type:"city",x:45,y:55,icon:"🏰",explored:true,danger:1,desc:"自由城邦的中心，大陆最繁华的贸易城市。"},
  iron_pass:{id:"iron_pass",name:"铁门关",type:"fortress",x:20,y:30,icon:"⚔️",explored:true,danger:3,desc:"北方公国的边境要塞，抵御深渊生物的前线。"},
  south_port:{id:"south_port",name:"南方港城",type:"city",x:60,y:75,icon:"⚓",explored:true,danger:2,desc:"南方商业城邦的港口，海上贸易的枢纽。"},
  holy_city:{id:"holy_city",name:"圣城",type:"holy",x:75,y:40,icon:"✨",explored:false,danger:2,desc:"光明教会的中心，朝圣者的圣地。"},
  silver_leaf:{id:"silver_leaf",name:"银叶城",type:"elf",x:30,y:65,icon:"🌿",explored:false,danger:1,desc:"精灵王国的都城，世界树的所在地。"},
  ironpeak:{id:"ironpeak",name:"铁峰堡",type:"dwarf",x:15,y:50,icon:"⛏️",explored:false,danger:2,desc:"矮人王国的首都，永恒熔炉所在。"},
  orc_homeland:{id:"orc_homeland",name:"兽人王庭",type:"orc",x:85,y:25,icon:"🗡️",explored:false,danger:3,desc:"兽人草原的王庭，战士的故乡。"},
  death_desert:{id:"death_desert",name:"死亡沙漠",type:"danger",x:50,y:85,icon:"🏜️",explored:false,danger:5,desc:"大陆南部的死亡沙漠，传说中有古国遗迹。"},
  elda_academy:{id:"elda_academy",name:"艾尔达学院",type:"academy",x:42,y:48,icon:"📚",explored:true,danger:1,desc:"大陆最古老的魔法学院，七印研究的中心。"}
};

function v34_openMap(){
  try{
  var box = document.createElement('div');
  box.className = 'box';
  var html = '<h2>大陆地图</h2>';
  html += '<div class="map-container-v34" id="v34-map">';
  html += '<div class="map-controls"><button class="map-zoom-btn" onclick="v34_zoomMap(1)">+</button><button class="map-zoom-btn" onclick="v34_zoomMap(-1)">−</button></div>';
  html += '<div class="map-fog"></div>';
  
  // 渲染地点
  for(var id in V34_MAP_LOCATIONS){
    var loc = V34_MAP_LOCATIONS[id];
    var current = (S && S.loc === id) ? ' current' : '';
    var undiscovered = !loc.explored ? ' undiscovered' : '';
    html += '<div class="map-location' + current + undiscovered + '" style="left:' + loc.x + '%;top:' + loc.y + '%" onclick="v34_selectLocation(\'' + id + '\')">';
    html += '<div class="map-location-icon">' + (loc.explored ? loc.icon : '❓') + '</div>';
    if(loc.explored) html += '<div class="map-location-name">' + loc.name + '</div>';
    html += '</div>';
  }
  
  html += '<div class="map-info-card" id="v34-map-info" style="display:none">';
  html += '<div id="v34-map-info-content"></div>';
  html += '</div>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  
  box.innerHTML = html;
  openModal(box);
  }catch(e){}
}

function v34_selectLocation(id){
  var loc = V34_MAP_LOCATIONS[id];
  if(!loc) return;
  var info = document.getElementById('v34-map-info');
  var content = document.getElementById('v34-map-info-content');
  if(!info || !content) return;
  
  var dangerStars = '';
  for(var i=0;i<loc.danger;i++) dangerStars += '⚠️';
  
  content.innerHTML = 
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
    '<span style="font-size:18px;font-weight:900;color:#241a08">' + loc.icon + ' ' + loc.name + '</span>' +
    '<span style="font-size:12px;color:#6a2a1a">' + dangerStars + '</span>' +
    '</div>' +
    '<div style="font-size:13px;color:#3a2e10;line-height:1.6;margin-bottom:10px">' + loc.desc + '</div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="btn btn-3d btn-3d-gold" onclick="v34_travelTo(\'' + id + '\')">前往</button>' +
    '<button class="btn btn-3d" onclick="document.getElementById(\'v34-map-info\').style.display=\'none\'">关闭</button>' +
    '</div>';
  info.style.display = 'block';
}

function v34_travelTo(id){
  var loc = V34_MAP_LOCATIONS[id];
  if(!loc) return;
  closeModal();
  if(typeof writePar === 'function'){
    writePar('你决定前往' + loc.name + '。');
  }
  // 这里可以接入实际的旅行系统
}

function v34_zoomMap(dir){
  var map = document.getElementById('v34-map');
  if(!map) return;
  var current = parseFloat(map.dataset.zoom) || 1;
  var next = Math.max(0.8, Math.min(2, current + dir*0.2));
  map.dataset.zoom = next;
  map.style.transform = 'scale(' + next + ')';
  map.style.transformOrigin = 'center center';
}

// ========== 方向六：音效与音乐系统 ==========
var V34_AUDIO = {
  ctx: null,
  bgmAudio: null,
  ambientAudio: null
};

function v34_initAudio(){
  try{
    V34_AUDIO.ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e){
    console.log('Audio not supported');
  }
}

function v34_toggleAudio(){
  V34.audioSettings.enabled = !V34.audioSettings.enabled;
  var btn = document.querySelector('.audio-toggle');
  if(btn){
    btn.textContent = V34.audioSettings.enabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !V34.audioSettings.enabled);
  }
  if(V34.audioSettings.enabled){
    v34_initAudio();
    v34_playSfx('click');
  } else {
    v34_stopBgm();
    v34_stopAmbient();
  }
}

function v34_playSfx(type){
  if(!V34.audioSettings.enabled || !V34_AUDIO.ctx) return;
  // v44: 扩展音效池（Web Audio 合成，无外部资源）
  var ctx = V34_AUDIO.ctx;
  var vol = V34.audioSettings.sfxVolume;
  function tone(freq, dur, type2, when, gv){
    try{
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = type2||'sine';
      osc.frequency.value = freq;
      var t0 = (when===undefined?ctx.currentTime:when);
      var g = (gv===undefined?vol:gv);
      gain.gain.setValueAtTime(g, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + dur);
    }catch(e){}
  }
  function seq(steps){
    for(var i=0;i<steps.length;i++){
      var s=steps[i];
      tone(s[0], s[1], s[2], ctx.currentTime + (s[3]||0), s[4]);
    }
  }
  switch(type){
    case 'click': tone(800, 0.05, 'square'); break;
    case 'hover': tone(600, 0.03); break;
    case 'success': tone(880, 0.15); break;
    case 'fail': tone(220, 0.2, 'sawtooth'); break;
    case 'crit': seq([[1047,0.12,'sine',0],[1319,0.2,'sine',0.1]]); break;
    case 'critfail': tone(150, 0.4, 'sawtooth'); break;
    case 'item': tone(1200, 0.1); break;
    case 'levelup': seq([[523,0.15,'sine',0],[659,0.15,'sine',0.12],[784,0.3,'sine',0.24]]); break;
    case 'buy': seq([[660,0.08,'sine',0],[990,0.12,'sine',0.07]]); break;
    case 'equip': seq([[500,0.08,'triangle',0],[750,0.1,'triangle',0.08]]); break;
    case 'eat': tone(300,0.1,'triangle'); break;
    case 'page': tone(1000,0.04,'sine'); break;
    case 'coin': seq([[1200,0.05,'square',0],[1600,0.1,'square',0.05]]); break;
    case 'morning': seq([[880,0.1,'sine',0],[1175,0.18,'sine',0.1]]); break;
    case 'night': tone(196,0.3,'sine',undefined,vol*0.5); break;
    case 'quest': seq([[784,0.1,'sine',0],[988,0.16,'sine',0.1]]); break;
    case 'heal': seq([[660,0.12,'sine',0],[880,0.2,'sine',0.1]]); break;
    case 'hurt': tone(180,0.2,'sawtooth'); break;
    case 'breakthrough': seq([[523,0.12,'sine',0],[659,0.12,'sine',0.1],[784,0.12,'sine',0.2],[1047,0.4,'sine',0.3]]); break;
    default: tone(440, 0.1); break;
  }
}

function v34_playBgm(type){
  if(!V34.audioSettings.enabled) return;
  // BGM需要音频文件，这里预留接口
  V34.audioSettings.currentBgm = type;
}

function v34_stopBgm(){
  V34.audioSettings.currentBgm = null;
}

var V44_AMBIENT = { nodes:[], master:null };
function v44_ambientStop(){
  try{
    var arr=V44_AMBIENT.nodes||[];
    for(var i=0;i<arr.length;i++){
      try{ if(arr[i].stop) arr[i].stop(); }catch(e){}
      try{ if(arr[i].disconnect) arr[i].disconnect(); }catch(e){}
    }
    V44_AMBIENT.nodes=[];
    try{ if(V44_AMBIENT.master&&V44_AMBIENT.master.disconnect) V44_AMBIENT.master.disconnect(); }catch(e){}
    V44_AMBIENT.master=null;
  }catch(e){}
}
function v34_playAmbient(type){
  if(!V34.audioSettings.enabled || !V34_AUDIO.ctx){ V34.audioSettings.currentAmbient=type; return; }
  v44_ambientStop();
  V34.audioSettings.currentAmbient = type;
  var ctx=V34_AUDIO.ctx;
  if(type==='silence') return;
  var master=ctx.createGain();
  master.gain.value = V34.audioSettings.ambientVolume||0.2;
  master.connect(ctx.destination);
  V44_AMBIENT.master=master;
  var t0=ctx.currentTime;
  function noiseBuf(){
    var len=ctx.sampleRate*2, buf=ctx.createBuffer(1,len,ctx.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<len;i++) d[i]=Math.random()*2-1;
    return buf;
  }
  function loopNoise(filterFreq, gainV, lfoRate, typeF){
    var src=ctx.createBufferSource(); src.buffer=noiseBuf(); src.loop=true;
    var f=ctx.createBiquadFilter(); f.type=typeF||'lowpass'; f.frequency.value=filterFreq;
    var g=ctx.createGain(); g.gain.value=gainV;
    var lfo=ctx.createOscillator(); lfo.frequency.value=lfoRate;
    var lg=ctx.createGain(); lg.gain.value=gainV*0.3;
    lfo.connect(lg); lg.connect(g.gain);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); lfo.start(t0);
    return [src,f,g,lfo,lg];
  }
  if(type==='rain'){ V44_AMBIENT.nodes=loopNoise(900,0.5,0.5); }
  else if(type==='wind'){ V44_AMBIENT.nodes=loopNoise(300,0.35,0.12); }
  else if(type==='night'){
    V44_AMBIENT.nodes=loopNoise(200,0.25,0.06);
    var osc=ctx.createOscillator(); osc.frequency.value=55;
    var og=ctx.createGain(); og.gain.value=0.12;
    osc.connect(og); og.connect(master); osc.start(t0);
    V44_AMBIENT.nodes.push(osc,og);
  }
  else if(type==='tavern'){
    V44_AMBIENT.nodes=loopNoise(500,0.18,0.3);
    for(var ti=0;ti<3;ti++){
      (function(delay){
        setTimeout(function(){
          try{
            var c=ctx.createOscillator(); c.frequency.value=700+Math.random()*500;
            var cg=ctx.createGain(); cg.gain.value=0.08;
            c.connect(cg); cg.connect(master); c.start(); c.stop(ctx.currentTime+0.08);
          }catch(e){}
        }, delay);
      })(ti*1700+Math.random()*800);
    }
  }
  else if(type==='church'){
    V44_AMBIENT.nodes=loopNoise(400,0.12,0.2);
    var chords=[[196,247,294],[220,262,330],[175,220,262],[147,196,247]];
    var ci=0;
    function pad(){
      try{
        if(V34.audioSettings.currentAmbient!=='church') return;
        var ch=chords[ci%chords.length]; ci++;
        var t=ctx.currentTime;
        for(var j=0;j<ch.length;j++){
          var o=ctx.createOscillator(); o.frequency.value=ch[j];
          var g=ctx.createGain(); g.gain.setValueAtTime(0.001,t);
          g.gain.linearRampToValueAtTime(0.06,t+1.5);
          g.gain.linearRampToValueAtTime(0.001,t+4);
          o.connect(g); g.connect(master); o.start(t); o.stop(t+4.2);
        }
        setTimeout(pad, 4500);
      }catch(e){}
    }
    pad();
  }
}

function v34_stopAmbient(){
  v44_ambientStop();
  V34.audioSettings.currentAmbient = null;
}

function v34_setVolume(type, value){
  if(type === 'bgm') V34.audioSettings.bgmVolume = value;
  else if(type === 'sfx') V34.audioSettings.sfxVolume = value;
  else if(type === 'ambient') V34.audioSettings.ambientVolume = value;
}

// ========== 方向七：存档与图鉴可视化 ==========
function v34_renderSaveSlots(){
  var html = '<h2>📦 存档管理</h2>';
  html += '<div style="text-align:center;font-size:12px;color:var(--dim);margin-bottom:10px">槽位1为主存档位，旧版存档自动兼容 · 写入自动双备份（本地+IndexedDB）</div>';
  for(var i=1;i<=5;i++){
    var saved = localStorage.getItem(i===1 ? RULESET_ID+"-save" : 'elda-save-slot-slot'+i);
    var empty = !saved;
    var nm='空存档槽', loc='-', day='-', pr=0, cl='';
    if(saved){
      try{
        var data = JSON.parse(saved);
        nm = data.name || ('第'+(data.day||1)+'日存档');
        loc = data.loc || (data.homeland || '未知');
        day = '第' + (data.day||1) + '日';
        pr = Math.min(100, Math.max(0, (data.day||0) % 100));
        cl = ' style="border-color:var(--gold)"';
      }catch(e){ nm='存档损坏'; }
    }
    var icon = empty ? '📁' : '⚔️';
    html += '<div class="save-slot-v34"' + cl + ' style="' + (empty?'opacity:.6;':'') + 'border-color:var(--line)">';
    html += '<div class="save-slot-thumb">' + icon + '</div>';
    html += '<div class="save-slot-info">';
    html += '<div class="save-slot-name">槽位' + i + ' · ' + nm + '</div>';
    html += '<div class="save-slot-meta"><span>📍 ' + loc + '</span><span>📅 ' + day + '</span></div>';
    html += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">';
    html += '<button class="btn" onclick="v34_saveToSlot(' + i + ')">💾 保存到此槽</button>';
    html += '<button class="btn" ' + (empty?'disabled':'') + ' onclick="v34_loadFromSlot(' + i + ')">📖 读取</button>';
    html += '<button class="btn btn-danger" ' + (empty?'disabled':'') + ' onclick="v34_deleteSlot(' + i + ')">🗑 删除</button>';
    html += '</div></div></div>';
  }
  html += '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">';
  html += '<button class="btn btn-gold" onclick="v34_exportSave()" style="flex:1">⬇ 导出存档(JSON)</button>';
  html += '<button class="btn" onclick="v34_importSave()" style="flex:1">⬆ 导入存档(JSON)</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim);margin-top:8px;text-align:center">导出=备份到本地文件；导入=从文件恢复，导入前会二次确认覆盖</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_saveToSlot(i){
  if(typeof S === "undefined" || !S || !S.name){ flashMsg("当前没有可保存的角色"); return; }
  try{
    S.choices=[]; S.curNode = curNode; S.saveVersion = 46;
    S.slotId = "slot" + i; S.saveTime = Date.now();
    StorageKit.save(S);
    closeModal(); flashMsg("已保存到槽位" + i);
    v34_renderSaveSlots();
    v34_openSavePanel();
  }catch(e){ flashMsg("保存失败：" + e.message); }
}

function v34_loadFromSlot(i){
  try{
    const d = StorageKit.load("slot" + i);
    if(!d){ flashMsg("槽位" + i + "没有存档"); return; }
    if(d.ruleset!==RULESET_ID){ flashMsg("存档版本不匹配"); return; }
    S = applyDefaults(d);
    S.saveVersion = S.saveVersion || 48;
    S.slotId = "slot" + i;
    closeModal(); logMsg("已读取槽位" + i + "存档（第"+S.day+"日）","g"); flashMsg("已读取槽位" + i);
    if(S.ending){ showEnding(S.ending); return; }
    curNode = S.curNode || "fc_jiaohui_entry";
    renderTop(); renderStats(); writeNext();
  }catch(e){ flashMsg("读档失败：" + e.message); }
}

function v34_deleteSlot(i){
  if(!confirm("确定删除槽位" + i + "的存档？此操作不可恢复。")) return;
  StorageKit.deleteSlot("slot" + i);
  closeModal(); flashMsg("已删除槽位" + i); v34_openSavePanel();
}

function v34_exportSave(){
  try{
    const ok = StorageKit.exportJSON();
    if(ok) flashMsg("存档已导出（JSON文件）");
  }catch(e){ flashMsg("导出失败：" + e.message); }
}

function v34_importSave(){
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.onchange = function(){
    const f = inp.files && inp.files[0];
    if(!f){ inp.remove(); return; }
    StorageKit.importJSON(f, function(res){
      inp.remove();
      if(!res.ok){ flashMsg(res.msg); return; }
      if(!confirm("将用存档文件覆盖当前进度，确定？")) return;
      try{
        S = applyDefaults(res.data);
        S.saveVersion = S.saveVersion || 48;
        S.slotId = S.slotId || "slot1";
        curNode = S.curNode || "fc_jiaohui_entry";
        saveGame();
        closeModal(); flashMsg("存档导入成功");
        if(S.ending){ showEnding(S.ending); return; }
        renderTop(); renderStats(); writeNext();
      }catch(e){ flashMsg("导入失败：" + e.message); }
    });
  };
  inp.click();
}

function v34_openErrorLog(){
  var logs = ErrorLog.text();
  var html = '<h2>🧾 错误日志</h2>';
  html += '<div class="dbg-json" id="v42-errorlog-body" style="max-height:50vh;white-space:pre-wrap;font-size:12px">' + logs.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div>';
  html += '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">';
  html += '<button class="btn" onclick="v42_copyErrorLog()" style="flex:1">复制全部</button>';
  html += '<button class="btn" onclick="v42_exportErrorLog()" style="flex:1">导出 txt</button>';
  html += '<button class="btn btn-danger" onclick="v42_clearErrorLog()" style="flex:1">清空日志</button>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = html;
  openModal(box);
}

function v42_copyErrorLog(){
  try{
    const txt = ErrorLog.text();
    if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ flashMsg("已复制错误日志"); }); }
    else{ const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); flashMsg("已复制错误日志"); }
  }catch(e){ flashMsg("复制失败"); }
}

function v42_exportErrorLog(){
  try{
    const blob = new Blob([ErrorLog.text()], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'elda-error-log.txt';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    flashMsg("错误日志已导出");
  }catch(e){ flashMsg("导出失败：" + e.message); }
}

function v42_clearErrorLog(){
  ErrorLog.clear();
  v34_openErrorLog();
  flashMsg("错误日志已清空");
}

var V34_ACHIEVEMENTS = {
  first_step:{id:"first_step",name:"第一步",desc:"完成序章",icon:"👣",rarity:"common"},
  academy_grad:{id:"academy_grad",name:"毕业",desc:"从学院毕业",icon:"🎓",rarity:"rare"},
  seal_master:{id:"seal_master",name:"七印之主",desc:"修复全部七印",icon:"🔮",rarity:"legendary"},
  abyss_lord:{id:"abyss_lord",name:"深渊之主",desc:"解放深渊",icon:"👁️",rarity:"legendary"},
  peacemaker:{id:"peacemaker",name:"和平使者",desc:"阻止大陆战争",icon:"🕊️",rarity:"epic"},
  rich:{id:"rich",name:"富甲一方",desc:"拥有1000金币",icon:"💰",rarity:"rare"},
  warrior:{id:"warrior",name:"百战百胜",desc:"赢得50场战斗",icon:"⚔️",rarity:"epic"},
  scholar:{id:"scholar",name:"博学者",desc:"阅读50本书籍",icon:"📖",rarity:"rare"},
  loved:{id:"loved",name:"万人迷",desc:"与5人达成挚友关系",icon:"❤️",rarity:"epic"},
  survivor:{id:"survivor",name:"幸存者",desc:"从大失败中恢复",icon:"🛡️",rarity:"common"}
};

function v34_renderAchievements(){
  var html = '<h2>成就墙</h2>';
  var unlocked = 0, total = 0;
  html += '<div class="achievement-grid">';
  for(var id in V34_ACHIEVEMENTS){
    var ach = V34_ACHIEVEMENTS[id];
    total++;
    var isUnlocked = V34.codex.achievements[id] || false;
    if(isUnlocked) unlocked++;
    html += '<div class="achievement-card ' + (isUnlocked?'unlocked':'locked') + ' achievement-rarity-' + ach.rarity + '">';
    html += '<div class="achievement-icon">' + (isUnlocked ? ach.icon : '❓') + '</div>';
    html += '<div class="achievement-name">' + (isUnlocked ? ach.name : '???') + '</div>';
    html += '<div class="achievement-desc">' + (isUnlocked ? ach.desc : '未解锁') + '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '<div style="text-align:center;margin:14px 0;font-size:14px;color:#5a4a30">已解锁：' + unlocked + ' / ' + total + '</div>';
  html += '<div style="text-align:center"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_unlockAchievement(id){
  if(V34.codex.achievements[id]) return;
  V34.codex.achievements[id] = true;
  v34_playSfx('levelup');
  // 可以添加成就解锁通知
}

function v34_addToCodex(type, id){
  if(!V34.codex[type]) V34.codex[type] = {};
  V34.codex[type][id] = true;
}


// ========== v34 设置面板 ==========
function v34_renderSettings(){
  var html = '<h2>游戏设置</h2>';
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">文字演出</h4>';
  html += v34_settingRow('打字机效果', '剧情文字逐字显示', 'typewriterEnabled', 'checkbox');
  html += v34_settingRow('打字机速度', '文字显示速度', 'typewriterSpeed', 'slider', 10, 80);
  html += v34_settingRow('文字特效', '低语/呐喊/古老等特效', 'textEffects', 'checkbox');
  html += v34_settingRow('自动滚动', '新内容自动滚动到底部', 'autoScroll', 'checkbox');
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">场景氛围</h4>';
  html += v34_settingRow('粒子效果', '雨/雪/雾等天气粒子', 'particlesEnabled', 'checkbox');
  html += v34_settingRow('判定动画', '掷骰子动画演出', 'diceAnimation', 'checkbox');
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">音效</h4>';
  html += v34_settingRow('启用音效', '开启游戏音效', 'audioEnabled', 'checkbox');
  html += v34_settingRow('音效音量', 'UI/判定音效', 'sfxVolume', 'slider', 0, 100);
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">界面</h4>';
  html += v34_settingRow('简洁模式', '关闭所有动画效果', 'compactMode', 'checkbox');
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">显示</h4>';
  html += '<div class="v34-setting-row"><div><div class="v34-setting-label">字号</div><div class="v34-setting-desc">故事正文大小</div></div><div class="v44-seg" id="v44-fontsize-seg"></div></div>';
  html += '<div class="v34-setting-row"><div><div class="v34-setting-label">主题</div><div class="v34-setting-desc">界面配色方案</div></div><div class="v44-seg" id="v44-theme-seg"></div></div>';
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">数据与调试</h4>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">';
  html += '<button class="btn" onclick="v34_openSavePanel()" style="flex:1 1 120px">📦 存档管理</button>';
  html += '<button class="btn" onclick="v34_openErrorLog()" style="flex:1 1 120px">🧾 错误日志</button>';
  html += '<button class="btn" onclick="DebugPanel.toggle()" style="flex:1 1 120px">🔧 调试面板</button>';
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--dim)">快捷键 Ctrl+Shift+D 或连点顶部标题栏5次可随时打开调试面板</div>';
  
  html += '<div style="text-align:center;margin-top:20px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_settingRow(label, desc, key, type, min, max){
  var val = V34.textSettings[key] !== undefined ? V34.textSettings[key] :
            V34.sceneAtmosphere[key] !== undefined ? V34.sceneAtmosphere[key] :
            V34.diceSettings[key] !== undefined ? V34.diceSettings[key] :
            V34.audioSettings[key] !== undefined ? V34.audioSettings[key] :
            V34.uiSettings[key] !== undefined ? V34.uiSettings[key] : false;
  
  var control = '';
  if(type === 'checkbox'){
    control = '<input type="checkbox" class="v34-checkbox" ' + (val?'checked':'') + ' onchange="v34_toggleSetting(\'' + key + '\', this.checked)">';
  } else if(type === 'slider'){
    var pct = type==='slider' && key==='typewriterSpeed' ? val : (val*100);
    control = '<input type="range" class="v34-slider" min="' + (min||0) + '" max="' + (max||100) + '" value="' + val + '" onchange="v34_setSettingValue(\'' + key + '\', this.value)">';
  }
  
  return '<div class="v34-setting-row">' +
    '<div><div class="v34-setting-label">' + label + '</div>' +
    '<div class="v34-setting-desc">' + desc + '</div></div>' +
    control + '</div>';
}

function v34_toggleSetting(key, value){
  if(key === 'typewriterEnabled') V34.textSettings.typewriterEnabled = value;
  else if(key === 'textEffects') V34.textSettings.textEffects = value;
  else if(key === 'autoScroll') V34.textSettings.autoScroll = value;
  else if(key === 'particlesEnabled') v34_toggleParticles(value);
  else if(key === 'diceAnimation') V34.diceSettings.animationEnabled = value;
  else if(key === 'audioEnabled') v34_toggleAudio();
  else if(key === 'compactMode') v34_setCompactMode(value);
}

function v34_setSettingValue(key, value){
  if(key === 'typewriterSpeed') V34.textSettings.typewriterSpeed = parseInt(value);
  else if(key === 'sfxVolume') V34.audioSettings.sfxVolume = value/100;
}

function v34_openAchievements(){
  try{
    var box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = v34_renderAchievements();
    openModal(box);
  }catch(e){}
}

function v34_openSavePanel(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSaveSlots();
  openModal(box);
}

function v34_openSettings(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSettings();
  openModal(box);
  try{ v44_initSegs(); }catch(e){}
}

// ========== v34 初始化 ==========
function v34_init(){
  v34_initAtmosphere();

  console.log('v34 UI沉浸感系统已初始化');
}

// 页面加载完成后初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', v34_init);
} else {
  v34_init();
}




/* ===== v43 沉浸演出接入层（引擎钩子） ===== */
(function(){
  // 段落渲染后: 渐显动画 + 纯文本段落打字机
  window.v34_afterFlush = function(appended){
    try{
      if(typeof V34 === 'undefined' || !V34 || !appended || !appended.length) return;
      var lastPlain = null;
      for(var i=0;i<appended.length;i++){
        var el = appended[i];
        if(!el || el.nodeType !== 1) continue;
        var txt = el.textContent || '';
        if(!el.childElementCount && txt.length >= 8 && txt.length <= 500){
          if(lastPlain && lastPlain.classList) lastPlain.classList.add('par-enter');
          lastPlain = el;  // 纯文本段落候选(最后一个用于打字机)
        } else if(el.classList){
          el.classList.add('par-enter');
          el.style.animationDelay = (i*0.05) + 's';
        }
      }
      // 打字机: 只对最后一个纯文本段落逐字显示
      if(lastPlain && V34.textSettings.typewriterEnabled){
        var full = lastPlain.textContent || '';
        lastPlain.innerHTML = '';
        V34.typewriter.active = true;
        V34.typewriter.currentEl = lastPlain;
        V34.typewriter.fullText = full;
        var pos = 0;
        (function step(){
          if(pos >= full.length){
            V34.typewriter.active = false;
            V34.typewriter.currentEl = null;
            return;
          }
          lastPlain.textContent = full.slice(0, pos+1);
          pos++;
          V34.typewriter.timer = setTimeout(step, V34.textSettings.typewriterSpeed || 8);
        })();
      } else {
        V34.typewriter.active = false;
      }
    }catch(e){}
  };

  // writeNext 完成后: 更新场景氛围(时段/天气/粒子/选项动画)
  window.v34_immerseAfterWrite = function(){
    try{
      if(typeof V34 === 'undefined' || !V34) return;
      var period = (typeof S !== 'undefined' && S && S.time && S.time.period) ? S.time.period : null;
      var weather = (typeof S !== 'undefined' && S && S.time && S.time.weather) ? S.time.weather : null;
      var tmap = {morning:'morning', noon:'noon', dusk:'dusk', night:'night'};
      var wmap = {clear:'clear', rain:'rain', snow:'snow', fog:'fog', storm:'rain', cloudy:'clear', overcast:'fog'};
      if(period && tmap[period] && typeof v34_setTime === 'function') v34_setTime(tmap[period]);
      if(weather && wmap[weather] && typeof v34_setWeather === 'function') v34_setWeather(wmap[weather]);
      if(typeof v34_animateOptions === 'function'){ try{ v34_animateOptions(); }catch(e){} }
    }catch(e){}
  };

  // 判定演出: 音效 + 骰子动画
  window.v34_immerseDice = function(roll, target, tierLabel){
    try{
      if(typeof V34 === 'undefined' || !V34) return;
      var sfx = 'success';
      if(tierLabel === 'crit') sfx = 'crit';
      else if(tierLabel === 'critfail') sfx = 'critfail';
      else if(tierLabel === 'fail') sfx = 'fail';
      if(typeof v34_playSfx === 'function'){ try{ v34_playSfx(sfx); }catch(e){} }
      if(V34.diceSettings.animationEnabled && typeof v34_rollDice === 'function'){
        try{ v34_rollDice(target, roll, tierLabel, function(){}); }catch(e){}
      }
    }catch(e){}
  };

  // 包装 writeNext
  if(typeof writeNext === 'function'){
    var __v43_wn = writeNext;
    window.writeNext = function(){
      var r = __v43_wn.apply(this, arguments);
      try{ if(typeof v34_immerseAfterWrite === 'function') v34_immerseAfterWrite(); }catch(e){}
      return r;
    };
  }
  // 包装 writeDice
  if(typeof writeDice === 'function'){
    var __v43_wd = writeDice;
    window.writeDice = function(roll, target, tierLabel){
      try{ if(typeof v34_immerseDice === 'function') v34_immerseDice(roll, target, tierLabel); }catch(e){}
      return __v43_wd.apply(this, arguments);
    };
  }
  // 点击任意处跳过打字机
  document.addEventListener('click', function(){
    try{ if(typeof v34_skipTypewriter === 'function') v34_skipTypewriter(); }catch(e){}
  });
})();
