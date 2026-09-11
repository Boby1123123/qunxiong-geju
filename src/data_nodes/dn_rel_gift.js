/* /REL1inj:gift/ REL-1 送礼系统（v93）
   纯数据对象式；pace 元数据；不触碰判定公式/writeNext/choose/存档语义
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   入口：fc_innkeep 挂「买点小东西」→ rel_gift_shop_free；学院挂 rel_gift_shop_acad
   GIFT_ITEMS_V93：礼物清单 {id,name,cost,desc}，好感增量写在 hand 节点选项 effects.relation */

window.GIFT_ITEMS_V93 = [
  {id:"candy",  name:"北地麦糖", cost:2, desc:"用粗纸包着的一小袋麦芽糖，北境货，甜得实在。"},
  {id:"totem",  name:"兽骨护符", cost:5, desc:"打磨光滑的兽骨片，刻着看不清的图腾，草原人的手艺。"},
  {id:"badge",  name:"学院徽章扣", cost:4, desc:"黄铜铸的学院纹章扣，在旧货摊上淘来的，边角有磨痕。"},
  {id:"poem",   name:"精灵诗册", cost:5, desc:"薄薄一卷手抄诗册，字迹娟秀，纸页泛黄，扉页有朵压干的七瓣花。"}
];

/* 自由城 · 送礼摊 */
N["rel_gift_shop_free"]={tag:"branch",place:"自由城邦 · 交汇城 · 东市口",pace:"light",text:[
"东市口有个常驻的小摊，摊主是个戴旧毡帽的老头，货摆得零碎：铁钉、顶针、旧书、从北境倒来的麦糖。他说自己专收各处旅人的闲货，再转卖给念旧的人。",
"你在摊前站定，老头抬了抬帽檐：“要捎带什么？都不是值钱货，胜在心意。”"
],options:[
{t:"买一小袋北地麦糖（2 银月）",effects:{gold:-2},go:"rel_gift_hand_candy"},
{t:"买一枚兽骨护符（5 银月）",effects:{gold:-5},go:"rel_gift_hand_totem"},
{t:"买一枚学院徽章扣（4 银月）",effects:{gold:-4},go:"rel_gift_hand_badge"},
{t:"买一卷精灵诗册（5 银月）",effects:{gold:-5},go:"rel_gift_hand_poem"},
{t:"（不买，转身离开）",go:"fc_innkeep"}
]};

/* 送出 · 麦糖 */
N["rel_gift_hand_candy"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"light",text:[
"你攥着那袋麦糖往回走，粗纸在手里沙沙响。送谁，怎么开口，都比买的时候难。"
],options:[
{t:"塞给酒馆的蜜尔娜，说是谢她昨夜照应",effects:{relation:{npc:"milna",v:3}},tier:{ok:["蜜尔娜接过去，拆开纸包捻了一颗放进嘴里，嚼了两下：“北境的货。甜是甜，就是糊嗓子。”她没推辞，把剩下半袋揣进围裙口袋，嘴角的弧度比平时大了一点。","你忽然觉得，这枚银月花得不亏。"]},go:"fc_innkeep"},
{t:"分一半给码头的李管事，说是顺路捎的",effects:{relation:{npc:"li",v:2}},tier:{ok:["李管事捏起一颗对着光看了看：“你倒有心。”他把糖放进嘴里，含含糊糊道，“账房后天结工钱，别迟了。”","他没再说别的，但收工后，他破天荒让账房多结了你两枚铜子。"]},go:"fc_innkeep"},
{t:"（糖留下，自己慢慢吃）",go:"fc_innkeep"}
]};

/* 送出 · 兽骨护符 */
N["rel_gift_hand_totem"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"light",text:[
"兽骨护符在掌心沉甸甸的，骨片边缘磨得光滑，是有人常年握过的样子。你不太懂上面的图腾，但记得草原上的老猎人说，这种符是护远行人的。"
],options:[
{t:"送给常在码头的阿岩，说看着像他家乡的东西",effects:{relation:{npc:"ayan",v:4}},tier:{ok:["阿岩接过护符，翻来覆去看了很久，拇指摩挲着图腾的刻痕：“这是风狼纹。我们草原人出门前，长辈会刻一块这个。”他顿了顿，声音低了些，“我离家那年，没来得及讨一块。”","他把护符系在腰带上，朝你点了点头。那一下点得很重。"]},go:"fc_innkeep"},
{t:"收起来，等见到懂它的人再送",go:"fc_innkeep"}
]};

/* 送出 · 学院徽章扣 */
N["rel_gift_hand_badge"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"light",text:[
"徽章扣是黄铜的，纹章线条已经磨浅了，但清理一下还能看出原本的样子。你把它擦干净，揣进怀里。"
],options:[
{t:"留着，等进了学院看谁顺眼再送",go:"fc_innkeep"},
{t:"送给打听消息时帮过你的老赵，说他像丢了点什么",effects:{relation:{npc:"laozhao",v:2}},tier:{ok:["老赵接过去，拇指在纹章上蹭了两下，忽然笑了：“我以前有个兄弟，在学院当门房，也戴这玩意儿。”他把它别在旧袄内衬上，“留着，见着他再还你这个人情。”"]},go:"fc_innkeep"}
]};

/* 送出 · 精灵诗册 */
N["rel_gift_hand_poem"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"light",text:[
"诗册的纸页泛黄，扉页那朵干花薄得像一层蝉翼。你翻了两页，字迹娟秀，是精灵文，边上缀着几行批注，墨迹淡得快看不见。"
],options:[
{t:"送给蜜尔娜，说这册子上的歌，唱的大概就是她这样的老板娘",effects:{relation:{npc:"milna",v:4}},tier:{ok:["蜜尔娜接过诗册，没有马上翻。她拿拇指来回蹭了蹭扉页的干花，好一会儿才说：“我年轻的时候，也想过读点书。”她把诗册放进柜台下那只上了锁的抽屉里，“你这个人情，我记下了。”","那之后，她给你的酒里，麦酒总是满的。"]},go:"fc_innkeep"},
{t:"自己留着，夜里就着油灯读几页",go:"fc_innkeep"}
]};

/* 学院 · 送礼摊（教学区旧书摊） */
N["rel_gift_shop_acad"]={tag:"branch",place:"北境 · 艾尔达学院 · 教学区旧书摊",pace:"light",text:[
"教学区拐角有个旧书摊，摊主是学院退下来的老文书，专卖学生不要的旧讲义和闲书，偶尔也收些杂货转卖。",
"他看你一眼：“买给同窗的？买给导师的？说一声，我给你挑顺手的。”"
],options:[
{t:"买一小袋北地麦糖（2 银月）",effects:{gold:-2},go:"rel_gift_acad_candy"},
{t:"买一枚兽骨护符（5 银月）",effects:{gold:-5},go:"rel_gift_acad_totem"},
{t:"买一枚学院徽章扣（4 银月）",effects:{gold:-4},go:"rel_gift_acad_badge"},
{t:"买一卷精灵诗册（5 银月）",effects:{gold:-5},go:"rel_gift_acad_poem"},
{t:"（不买，回教学区）",go:"acad_life_y1_open"}
]};

N["rel_gift_acad_candy"]={tag:"branch",place:"北境 · 艾尔达学院",pace:"light",text:[
"麦糖的纸包在怀里捂得有些软。你琢磨着，学院里谁最吃这一套。"
],options:[
{t:"塞给总是冷着脸的费尔曼教授，说课上讲的听不懂，糖是赔罪的",effects:{relation:{npc:"ferman",v:2}},tier:{ok:["费尔曼捻起一颗糖，没吃，捏在指间转了转：“课上听不懂的，课下多翻讲义，比送糖有用。”他顿了顿，把糖放进抽屉，“不过，收了你的糖，下次提问我点你之前会多等三息。”"]},go:"acad_life_y1_open"},
{t:"分给同窗的洛克，说见你熬夜熬得狠",effects:{relation:{npc:"loka",v:2}},tier:{ok:["洛克拆开纸包，一口气塞了两颗进嘴，腮帮子鼓着说：“好甜。你早该这么会来事。”他含含糊糊道，“下次药剂课抄笔记，算你一份。”"]},go:"acad_life_y1_open"}
]};

N["rel_gift_acad_totem"]={tag:"branch",place:"北境 · 艾尔达学院",pace:"light",text:[
"兽骨护符的图腾在灯下看不真切，但握在手里有种暖意。你想起阿岩系着风狼纹护符的样子。"
],options:[
{t:"送给常去北境演武场的同学阿塔，说见你总摸护身符",effects:{relation:{npc:"ata",v:3}},tier:{ok:["阿塔接过护符，拇指按着图腾好一会儿：“风狼纹。你从哪弄来的？”他没等你答，把护符戴到脖子上，“这份情我记着——哪天你被人堵在巷子里，喊一声就行。”"]},go:"acad_life_y1_open"},
{t:"留着，出远门时系在行囊上",go:"acad_life_y1_open"}
]};

N["rel_gift_acad_badge"]={tag:"branch",place:"北境 · 艾尔达学院",pace:"light",text:[
"黄铜徽章扣擦得锃亮，在学院里这种小物件不算稀罕，但胜在心意。"
],options:[
{t:"送给总想当学生会长的塞西莉娅，说这扣子配你",effects:{relation:{npc:"cecy",v:3}},tier:{ok:["塞西莉娅接过徽章扣，掂了掂，忽然笑了：“眼光不错。不过我要是别着旧货上台发言，会被那群少爷小姐笑话三年。”她话这么说，还是把它别在了内衬领口，“留着了。下次学生会招人，给你留个名额。”"]},go:"acad_life_y1_open"},
{t:"自己别在领口，权当个念想",go:"acad_life_y1_open"}
]};

N["rel_gift_acad_poem"]={tag:"branch",place:"北境 · 艾尔达学院",pace:"light",text:[
"精灵诗册在学院里算得上稀罕物，懂得读的人不多。你翻开扉页，那朵干花还好好地夹在纸页间。"
],options:[
{t:"送给图书馆的艾琳，说见你整理古籍时翻到过类似的手迹",effects:{relation:{npc:"elin",v:4}},tier:{ok:["艾琳接过诗册，指尖在扉页的干花上停了停，眼睛亮了一下：“这是精灵文的十四行诗……批注的人字迹很老练，像是哪位巡游学者留下的。”她小心地合上册子，“我誊一份抄本放图书馆，原册还你。这个人情，我记下了。”"]},go:"acad_life_y1_open"},
{t:"留着，夜里就着灯读几页，想家的时候也读",go:"acad_life_y1_open"}
]};
