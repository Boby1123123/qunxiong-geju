/* ============================================================
 * dn_bio_herb100.js —— 万灵谱 · 超凡植物纲 · 百草卷（超大规模扩充）
 * 新增 92 种灵草灵木（基础 8 种 + 拓展 92 种 = 100 种）
 * 十卷：学院药圃 / 精灵月池 / 北境寒谷 / 兽人草原 / 西境荒原 /
 *       死亡沙漠 / 东境林野 / 南境湿地 / 深渊腐化 / 神话传说
 * 段位覆盖凡品→传奇，稀有度覆盖常见→唯一，药效/毒性/培育各异
 * 神话原型：希腊（曼德拉草/月桂/风信子/向日葵/仙馔/忘忧树/石榴）、
 *           凯尔特（槲寄生/德鲁伊橡/四叶草/卡美洛白花）、
 *           北欧（世界树苗/金苹果/女武神花/符文苔）、
 *           斯拉夫（蕨花/萨满火草）、圣经（圣杯玫瑰）、
 *           埃及（蓝睡莲/太阳泪/古莎草）、波斯（森莫夫草）、
 *           巫师/炼金草药学（银叶草/水银藤/狼毒乌头/颠茄）
 * 游戏参考：巫师3 草药图谱、魔兽草药学采集规则、宝可梦生态、
 *           凡人修仙传灵草年份价值、DND 施法材料
 * 铁律：只增不降；不触碰引擎；V66 文风；30 治理词避让
 * ============================================================ */

/* ---- HERB_ENCYCLOPEDIA_EXT 九十二种（数据表，全量） ---- */
window.HERB_ENCYCLOPEDIA_EXT = [
  /* ===== 卷一 · 学院药圃（9 种新） ===== */
  { id:"herb_mandrake", name:"曼德拉草", area:"学院 · 药圃暗室", tier:"化意", rarity:"史诗", parts:"人形根（拔起时会尖叫，声能震碎耳膜）", habit:"只在无光处长，根形如人，百年成形", gather:"先堵耳，再浇血酒，最后连土拔根——尖叫会要命", lore:"希腊传说：拔它的人会死，后来人用饿狗刨根——它的根是刀枪不入符咒的料" },
  { id:"herb_alchemyrose", name:"炼金玫瑰", area:"学院 · 炼金温室", tier:"凝元", rarity:"稀有", parts:"花瓣（七色，按炉火温度变色）", habit:"吸炉灰长，花期跟着炼金炉走", gather:"用银剪剪，铁器碰过即蔫", lore:"炼金师的试纸花——颜色能告诉你好坏" },
  { id:"herb_truthmoss", name:"真言苔", area:"学院 · 审讯室墙根", tier:"启灵", rarity:"少见", parts:"苔体（干后磨粉，掺茶饮之吐真言）", habit:"只在有人说过实话的地方长", gather:"阴干，不可见日光", lore:"教会与学院都在收——它的名声比审讯椅还硬" },
  { id:"herb_silverleaf", name:"银叶草", area:"学院 · 朝阳坡", tier:"启灵", rarity:"常见", parts:"叶片（银白色，碾碎出银浆）", habit:"向阳而生，叶背聚露", gather:"晨露时摘，叶片完整才值钱", lore:"巫师草药学的入门货——也是银浆涂料的主料" },
  { id:"herb_quicksilver", name:"水银藤", area:"学院 · 炼金下水道", tier:"凝元", rarity:"稀有", parts:"藤汁（流动如液态银）", habit:"沿水管爬，喜潮湿", gather:"戴手套割，藤汁沾皮即毒", lore:"流动的银——炼金师拿它做刻度计" },
  { id:"herb_philosopher", name:"哲人之花", area:"学院 · 图书馆顶层", tier:"化意", rarity:"传说", parts:"花（七日一开，开时无香）", habit:"只在读透万卷的地方开", gather:"问它一个问题，答对才肯谢", lore:"传说炼成贤者之石的人，窗前开过这花" },
  { id:"herb_parchmentfern", name:"羊皮纸蕨", area:"学院 · 文书库", tier:"凡品", rarity:"常见", parts:"叶（晒干即羊皮纸）", habit:"吸墨水生，叶上自动长字", gather:"采带字叶，字越旧越值钱", lore:"抄经人最爱的纸——它自己会写" },
  { id:"herb_glassherb", name:"玻璃草", area:"学院 · 温室", tier:"凡品", rarity:"常见", parts:"茎（透明如玻璃，折之脆响）", habit:"喜暖，一冷就碎", gather:"趁热采，装棉盒", lore:"魔法灯笼的灯芯料" },
  { id:"herb_formulaweed", name:"配方草", area:"学院 · 炼金台边", tier:"启灵", rarity:"少见", parts:"籽（炒熟后念出配方）", habit:"长在炼金台边，吸失败药渣", gather:"炒籽时堵耳——念出的可能是失败方", lore:"炼金学徒的福星——也是灾星" },

  /* ===== 卷二 · 精灵月池（8 种新） ===== */
  { id:"herb_mistletoe", name:"槲寄生", area:"精灵 · 圣橡树冠", tier:"化意", rarity:"传说", parts:"白果（冬至采，药力最纯）", habit:"寄生圣橡之上，不落地", gather:"金镰割，落地即失效——德鲁伊的规矩", lore:"凯尔特传说：巴尔达死于槲寄生——它能杀神，也能救神" },
  { id:"herb_moontear", name:"月泪花", area:"精灵 · 月池畔", tier:"凝元", rarity:"稀有", parts:"花瓣（叶上凝月泪，入药即月华露）", habit:"只在满月开，开一夜", gather:"月落前采，晨光一照即谢", lore:"银月草的表亲——月池水汽养的" },
  { id:"herb_elfking_mush", name:"精灵王菌", area:"精灵 · 古树根", tier:"化意", rarity:"传说", parts:"菌盖（夜发淡光，如星）", habit:"只在精灵王古树根上生", gather:"精灵亲自采，外人碰了树根会挨箭", lore:"精灵的圣物——长老说它记着树的一千年" },
  { id:"herb_starlightfern", name:"星光蕨", area:"精灵 · 林间空地", tier:"启灵", rarity:"少见", parts:"叶（夜里浮星光）", habit:"仰面朝星长，无星不展叶", gather:"夜里采，装黑匣", lore:"精灵孩子枕着它睡觉，梦见星图" },
  { id:"herb_pixiedust", name:"皮克西尘花", area:"精灵 · 蘑菇圈", tier:"启灵", rarity:"少见", parts:"花粉（随风飘，沾上会迷路三天）", habit:"只在蘑菇圈中央开", gather:"逆风采，戴面纱", lore:"皮克西精灵的花——采了会挨恶作剧" },
  { id:"herb_selkieseaw", name:"海豹草", area:"精灵 · 西海礁岩", tier:"凝元", rarity:"稀有", parts:"根（晒干后泡水，人可变海豹）", habit:"长在潮线，随潮涨落", gather:"退潮时采，涨潮前离开", lore:"凯尔特海豹人的传说——它们的皮和草，都关乎变身" },
  { id:"herb_oaksapling", name:"古橡苗", area:"精灵 · 德鲁伊林", tier:"化意", rarity:"史诗", parts:"苗（百年长一寸）", habit:"吸地脉灵气，苗叶常年不落", gather:"德鲁伊亲授才可移栽", lore:"德鲁伊的圣树苗——种下它，你就有了一座林子的信" },
  { id:"herb_bansheegrass", name:"女妖草", area:"精灵 · 西界荒坟", tier:"凝元", rarity:"稀有", parts:"叶（夜里会哭）", habit:"只在坟头长，根扎进棺材", gather:"带黑狗血铲，挖出根就跑", lore:"凯尔特女妖的草——它哭，是因为认得死人" },

  /* ===== 卷三 · 北境寒谷（9 种新） ===== */
  { id:"herb_worldtree", name:"世界树苗", area:"北境 · 世界树根须", tier:"传奇", rarity:"唯一", parts:"苗（一株，叶上刻着九界纹）", habit:"世界树的种子发的芽，叶脉是九界的图", gather:"它自己选主人——拔不动的苗，谁也带不走", lore:"北欧传说：世界树撑起九界——它的苗，是下一棵树的开始" },
  { id:"herb_goldapple", name:"金苹果", area:"北境 · 伊顿果园", tier:"传奇", rarity:"唯一", parts:"果（纯金，食之长生）", habit:"千年一熟，熟时枝头放金光", gather:"守园神兽看守——偷摘的人会挨雷劈", lore:"北欧神话：女神伊顿的金苹果，众神吃了才不老" },
  { id:"herb_frostlily", name:"霜百合", area:"北境 · 雪线", tier:"凝元", rarity:"稀有", parts:"花（冰雕一般，不谢）", habit:"花冻不谢，越冷越香", gather:"正午采，冰花见日即化", lore:"北境新娘的捧花——象征不死的情" },
  { id:"herb_iceheart", name:"冰心草", area:"北境 · 冰川底", tier:"化意", rarity:"史诗", parts:"芯（透明如冰，含在嘴里人不会冻死）", habit:"长在冰川最厚处，千尺之下", gather:"凿冰三丈，挖出即入暖匣", lore:"冰原猎人的护身符——比皮袄管用" },
  { id:"herb_northwind", name:"北风草", area:"北境 · 风口", tier:"启灵", rarity:"少见", parts:"叶（风一吹就响，如哨）", habit:"顺风长，叶朝南", gather:"逆风割，叶响时药力最足", lore:"风笛匠的料——北风的声音在里面" },
  { id:"herb_snowpearl", name:"雪珍珠菌", area:"北境 · 雪洞", tier:"凝元", rarity:"稀有", parts:"菌（圆白如珠，碾碎出寒露）", habit:"只长在雪洞深处，无光", gather:"戴手套摘，体温一碰即化", lore:"冰系法杖的镶嵌料" },
  { id:"herb_valkyrie", name:"女武神花", area:"北境 · 战场遗址", tier:"化意", rarity:"史诗", parts:"花（血红，开在战死处）", habit:"只在血流过的地方开", gather:"清晨采，花瓣还带着战场的露", lore:"北欧传说：女武神把战死的勇士接去英灵殿——这花开在接走之后" },
  { id:"herb_runemoss", name:"符文苔", area:"北境 · 古碑", tier:"凝元", rarity:"稀有", parts:"苔（形如符文，拓下来是真符）", habit:"只在古碑北面长", gather:"用蜡拓，不可刮", lore:"矮人刻符文的老师——先看苔，再刻石" },
  { id:"herb_yetifungus", name:"雪人菌", area:"北境 · 冰洞", tier:"启灵", rarity:"少见", parts:"菌（灰白，味腥）", habit:"雪人当食物，人吃了发热", gather:"趁雪人不在挖——它在，你也在锅里", lore:"猎人说雪人菌能治冻伤——雪人自己不用治" },

  /* ===== 卷四 · 兽人草原（9 种新） ===== */
  { id:"herb_fernflower", name:"蕨花", area:"兽人草原 · 圣火谷", tier:"传说", rarity:"唯一", parts:"花（六月夜开一夜，火红如焰）", habit:"只在圣火谷的库帕拉之夜开，传说见它者懂兽语", gather:"一夜只开几朵，摘了要快跑", lore:"斯拉夫传说：蕨花是森林的钥匙——采到它，万物都听你的" },
  { id:"herb_wolfbane", name:"狼毒乌头", area:"兽人草原 · 山阴", tier:"凝元", rarity:"稀有", parts:"根（剧毒，狼人闻之退避）", habit:"背阴而生，花蓝紫", gather:"戴皮手套挖，根汁沾血即麻", lore:"传说狼人见了它绕道——猎狼人揣一株在身上" },
  { id:"herb_thundergrass", name:"雷草", area:"兽人草原 · 雷蹄原", tier:"启灵", rarity:"少见", parts:"叶（带电，摸一下手麻）", habit:"长在雷角公牛啃过的地方", gather:"用木夹采，装木盒", lore:"雷鬃马的主食——吃了跑得快" },
  { id:"herb_spiritstep", name:"灵步草", area:"兽人草原 · 风坡", tier:"启灵", rarity:"少见", parts:"叶（泡水洗脚，踏草无声）", habit:"贴地长，茎韧", gather:"连根拔，根断则效失", lore:"斥候的宝贝——猎户进林前都泡一壶" },
  { id:"herb_totembark", name:"图腾树皮", area:"兽人草原 · 圣山", tier:"化意", rarity:"史诗", parts:"皮（纹如图腾，兽人祭天用）", habit:"圣山神木的皮，百年剥一次", gather:"萨满亲剥，外人剥了会遭狼群", lore:"兽人部族的圣物——神谕就刻在这种皮上" },
  { id:"herb_boneflower", name:"骨花", area:"兽人草原 · 旧战场", tier:"凝元", rarity:"稀有", parts:"花（白色，根穿骨而过）", habit:"根长进战死者的骨里", gather:"连骨一起挖，骨花才完整", lore:"血根的姊妹花——一种补血，一种安魂" },
  { id:"herb_skyherb", name:"天药", area:"兽人草原 · 天穹坡", tier:"化意", rarity:"传说", parts:"整株（传说吃它的人会飞）", habit:"只在云影掠过的地方长", gather:"云来之前采，云走之后谢", lore:"斯拉夫传说：长生不老药的主料——萨满说它见过天" },
  { id:"herb_warhorn", name:"战号菌", area:"兽人草原 · 部族祭场", tier:"凝元", rarity:"稀有", parts:"菌（吹之如号角，声震十里）", habit:"长在祭场石缝，吸战鼓声", gather:"霜降后采，菌体才硬", lore:"兽人出征前吹它——声音里是祖辈的号令" },
  { id:"herb_shamanfire", name:"萨满火草", area:"兽人草原 · 圣火谷", tier:"化意", rarity:"史诗", parts:"草（点着不灭，萨满通灵用）", habit:"长在圣火边，火越旺草越青", gather:"萨满亲采，外人摘了草会自燃", lore:"兽人萨满的命根——通灵的火，就烧这种草" },

  /* ===== 卷五 · 西境荒原（10 种新） ===== */
  { id:"herb_stormeye", name:"风暴眼晶花", area:"西境 · 风暴眼", tier:"凝元", rarity:"史诗", parts:"花（花心凝一枚风晶）", habit:"只在风暴眼中心开，风停即谢", gather:"风眼里采，命悬一线", lore:"风法师的至宝——花心里的风晶是法杖核心" },
  { id:"herb_windblade", name:"风刃草", area:"西境 · 风口", tier:"凡品", rarity:"常见", parts:"叶（边缘如刃，割手）", habit:"顺风长，叶朝风", gather:"逆风割，戴手套", lore:"牧民拿它编篱笆——牲口不敢靠" },
  { id:"herb_lightningreed", name:"雷光苇", area:"西境 · 雷泽", tier:"启灵", rarity:"少见", parts:"秆（吸雷光，夜里发蓝）", habit:"长在雷泽边，雷落时发光", gather:"雷雨后采，秆内雷光未散", lore:"雷鬃马啃它——马吃了蹄生电" },
  { id:"herb_ashflower", name:"灰烬花", area:"西境 · 火祭场", tier:"凝元", rarity:"稀有", parts:"花（灰黑色，火中不燃）", habit:"长在烧尽的灰里", gather:"火灭后采，花心有一粒火种", lore:"灰烬不死鸟落过的地方开的——不死鸟的印记" },
  { id:"herb_miragelotus", name:"幻象莲", area:"西境 · 蜃楼谷", tier:"凝元", rarity:"稀有", parts:"莲（看着有，摸着无）", habit:"长在蜃楼里，真身在沙下", gather:"破幻术，挖沙三丈", lore:"幻影狮守的莲——迷幻药的根子" },
  { id:"herb_dustwillow", name:"尘柳", area:"西境 · 古道", tier:"凡品", rarity:"常见", parts:"枝（垂尘如帘）", habit:"吸尘长，过路风一吹满街灰", gather:"春天采新枝", lore:"商队靠它认路——尘柳密的地方，离绿洲近" },
  { id:"herb_embervine", name:"余烬藤", area:"西境 · 火石滩", tier:"凝元", rarity:"稀有", parts:"藤（芯里有炭火，烧不烂）", habit:"沿火石爬，越烫越旺", gather:"铁钳夹，装铁盒", lore:"火法杖的缠柄料——火系炼金离不了" },
  { id:"herb_tornadobamboo", name:"龙卷竹", area:"西境 · 风谷", tier:"化意", rarity:"史诗", parts:"竹（节里有旋气，砍断如放风）", habit:"长在风谷，随风摇", gather:"风停时砍，节眼朝上", lore:"龙卷蛇蜕皮的地方长的——风法师做杖骨" },
  { id:"herb_skywell", name:"天井草", area:"西境 · 云海", tier:"启灵", rarity:"少见", parts:"叶（根扎云里，叶垂天井）", habit:"长在云海的空洞边", gather:"乘飞兽采，云洞深不见底", lore:"天母水母的食物——飘在云海里的草" },
  { id:"herb_sandclock", name:"沙漏仙人掌", area:"西境 · 沙漠边缘", tier:"启灵", rarity:"少见", parts:"果（果肉是沙，倒着流）", habit:"长在沙与石的界线", gather:"倒着摘，正摘果肉漏光", lore:"沙漠商队的计时器——果肉流完，就是一天" },

  /* ===== 卷六 · 死亡沙漠（10 种新） ===== */
  { id:"herb_deathbloom", name:"死亡之花", area:"死亡沙漠 · 古城", tier:"化意", rarity:"史诗", parts:"花（黑红，香如腐肉）", habit:"开在古墓入口，花香引尸虫", gather:"戴面纱采，香即毒", lore:"盗墓人叫它冥府引路花——它开的地方，地下有东西" },
  { id:"herb_sphinxfern", name:"斯芬克斯蕨", area:"死亡沙漠 · 遗迹", tier:"凝元", rarity:"稀有", parts:"叶（折成谜语形状）", habit:"长在遗迹阶前，叶形如谜", gather:"对着它念谜语，答对才肯让采", lore:"斯芬克斯的草——它记着每一道问过的谜" },
  { id:"herb_suntear", name:"太阳泪", area:"死亡沙漠 · 日神殿", tier:"化意", rarity:"史诗", parts:"花（金色，晨开暮合）", habit:"面朝太阳，根吸日火", gather:"正午采，花心一滴金色露", lore:"埃及太阳神的泪——一滴能点一盏不灭灯" },
  { id:"herb_bluelotus", name:"蓝睡莲", area:"死亡沙漠 · 绿洲", tier:"凝元", rarity:"史诗", parts:"花（蓝紫色，入药安神入梦）", habit:"只在绿洲静水开", gather:"夜采，花闭时采药力全", lore:"埃及法老的圣花——梦里能见古国" },
  { id:"herb_scorpiontail", name:"蝎尾草", area:"死亡沙漠 · 蝎窟外", tier:"凝元", rarity:"稀有", parts:"穗（形如蝎尾，带毒刺）", habit:"长在蝎巢边，吸蝎毒", gather:"戴厚手套，从根部剪", lore:"曼提科尔的尾针淬的就是这草的汁" },
  { id:"herb_oasispearl", name:"绿洲珍珠", area:"死亡沙漠 · 隐绿洲", tier:"启灵", rarity:"少见", parts:"果（透明圆润，含水）", habit:"只在蜃楼马现身的绿洲结果", gather:"蜃楼马离开后采", lore:"沙漠行者的宝贝——一颗管三天水" },
  { id:"herb_papyrus", name:"古莎草", area:"死亡沙漠 · 尼罗支流", tier:"启灵", rarity:"稀有", parts:"秆（晒干即古纸，能记咒）", habit:"沿古水道长", gather:"秋采，秆越老越值钱", lore:"埃及抄经纸——祭司的咒文写在这种纸上" },
  { id:"herb_mummywheat", name:"木乃伊麦", area:"死亡沙漠 · 古陵", tier:"凝元", rarity:"稀有", parts:"穗（金色，磨粉可防腐）", habit:"长在古陵墙缝", gather:"陵门开时采，麦穗遇生人即落", lore:"法老墓里的麦——传说种它的人不会腐烂" },
  { id:"herb_dunerose", name:"沙丘玫瑰", area:"死亡沙漠 · 沙丘脊", tier:"启灵", rarity:"少见", parts:"花（石质，玫瑰形）", habit:"沙风塑形，石花不谢", gather:"风停后挖", lore:"沙蝎在花心里做窝——采花先赶蝎" },
  { id:"herb_snakegourd", name:"蛇瓜", area:"死亡沙漠 · 绿洲边", tier:"凡品", rarity:"常见", parts:"瓜（形如盘蛇）", habit:"藤缠沙柳长", gather:"连藤摘，瓜断藤则苦", lore:"沙鳞蛇爱啃它——商队拿它引蛇" },

  /* ===== 卷七 · 东境林野（10 种新） ===== */
  { id:"herb_camelot", name:"卡美洛白花", area:"东境 · 旧王庭", tier:"凝元", rarity:"史诗", parts:"花（纯白，夜发微光）", habit:"长在旧王庭石缝，只在骑士宣誓日开", gather:"骑士见证下采，花才不谢", lore:"亚瑟王传说：卡美洛的白花——圆桌骑士的誓约花" },
  { id:"herb_grailrose", name:"圣杯玫瑰", area:"东境 · 圣泉", tier:"传奇", rarity:"唯一", parts:"花（一朵，五百年一开，杯形）", habit:"只在圣泉边开，花开时泉水变酒", gather:"心诚者才看得见——不诚的人走过，它隐身", lore:"圣杯的印记——传说找到它，就找到了杯的下落" },
  { id:"herb_druidoak", name:"德鲁伊橡", area:"东境 · 德鲁伊林", tier:"化意", rarity:"史诗", parts:"橡实（一颗，种下有灵）", habit:"老橡千年结一颗实", gather:"德鲁伊亲授，偷摘者遭雷击", lore:"凯尔特德鲁伊的圣树——橡实是林子的继承人" },
  { id:"herb_fourleaf", name:"四叶草", area:"东境 · 草坡", tier:"启灵", rarity:"传说", parts:"整株（四叶，稀有中的稀有）", habit:"万株三叶出一株四叶", gather:"看见时先许愿，再弯腰", lore:"凯尔特传说：四叶草一叶一愿——它只让知足的人找到" },
  { id:"herb_questherb", name:"追猎香草", area:"东境 · 旧王猎径", tier:"启灵", rarity:"少见", parts:"草（碾碎涂身，兽群不嗅你）", habit:"长在追猎兽走过的路", gather:"趁雾采，草沾露才有效", lore:"猎人涂它追兽——追猎兽的气味盖过你" },
  { id:"herb_oldkingfern", name:"老国王蕨", area:"东境 · 故都废墟", tier:"化意", rarity:"史诗", parts:"蕨（叶如王冠）", habit:"长在故都王座残基上", gather:"王座前采，弯腰如见王", lore:"晨天故都的遗物——老国王的蕨，认得旧臣" },
  { id:"herb_whisperleaf", name:"耳语叶", area:"东境 · 雾林", tier:"凝元", rarity:"稀有", parts:"叶（风掠过会说出旧事）", habit:"只长在雾林，吸雾气", gather:"风起时采，叶里的旧事要听", lore:"耳语鹿的食物——它听见的，人也能听见" },
  { id:"herb_imperialtea", name:"御茶", area:"东境 · 御茶园", tier:"启灵", rarity:"史诗", parts:"芽（晨采，泡开如旧朝烟雨）", habit:"故都御茶园遗址，没人打理却常青", gather:"采芽三片，不可多", lore:"晨天帝的御茶——旧朝亡了，茶还活着" },
  { id:"herb_phoenixfeather", name:"凤羽草", area:"东境 · 高崖", tier:"化意", rarity:"史诗", parts:"草（叶如凤羽，火红）", habit:"长在凤凰飞过的崖上", gather:"崖顶采，风大命悬", lore:"凤凰羽落过的地方——草得了它的颜色" },
  { id:"herb_memoryrose", name:"记忆蔷薇", area:"东境 · 老宅", tier:"凝元", rarity:"稀有", parts:"花（香能唤起旧忆）", habit:"只长在老宅檐下", gather:"黄昏采，香才不散", lore:"迷迭香的远亲——书生用它写回忆录" },

  /* ===== 卷八 · 南境湿地（10 种新） ===== */
  { id:"herb_swampfire", name:"沼泽鬼火菇", area:"南境 · 死水潭", tier:"启灵", rarity:"少见", parts:"菇（夜里发蓝火）", habit:"漂在死水潭上", gather:"用木勺捞，铁器一碰就灭", lore:"沼泽鬼火的家——灯匠拿它做夜灯" },
  { id:"herb_frogking_lily", name:"蛙王莲", area:"南境 · 荷塘", tier:"凝元", rarity:"史诗", parts:"莲（叶大如席，蛙王坐其上）", habit:"只在蛙王守的荷塘开", gather:"蛙王点头才可采", lore:"蛙王的王座——采莲的人，蛙王记得" },
  { id:"herb_plagueherb", name:"瘟疫草", area:"南境 · 荒村", tier:"凝元", rarity:"稀有", parts:"茎（毒堇，煮汤可毒人也可救人）", habit:"长在荒废的村子", gather:"戴双层手套，根汁剧毒", lore:"希腊毒堇——苏格拉底喝的就是它" },
  { id:"herb_bloodmoss", name:"血苔", area:"南境 · 战场沼泽", tier:"凝元", rarity:"稀有", parts:"苔（暗红，吸过血）", habit:"长在血浸过的泥上", gather:"清晨采，苔还湿", lore:"血根的水生兄弟——止血奇效，但用多了人嗜血" },
  { id:"herb_sirenreed", name:"塞壬苇", area:"南境 · 礁岛", tier:"化意", rarity:"史诗", parts:"苇（风掠过如歌声）", habit:"长在塞壬鸟停过的礁上", gather:"堵耳采，苇声会引你下水", lore:"塞壬的苇笛——吹它的人能学海妖的歌" },
  { id:"herb_croctear", name:"鳄泪草", area:"南境 · 大泽", tier:"启灵", rarity:"少见", parts:"草（叶尖挂露如泪）", habit:"长在日鳄晒太阳的泥岸", gather:"日鳄下水后采", lore:"鳄泪是假的，草是真的——炼金师拿它做迷药" },
  { id:"herb_willowwisp", name:"柳鬼花", area:"南境 · 老柳树", tier:"启灵", rarity:"少见", parts:"花（柳絮状，夜里飘）", habit:"老柳空心处长", gather:"月光下采，装纱袋", lore:"柳树精的花——挂在门口，夜路有灯" },
  { id:"herb_blackiris", name:"黑鸢尾", area:"南境 · 深沼", tier:"凝元", rarity:"稀有", parts:"花（纯黑，香极淡）", habit:"长在深沼中心", gather:"撑船采，水深过顶", lore:"死神的信使花——它开的地方，有人要走" },
  { id:"herb_snailtrail", name:"蜗迹苔", area:"南境 · 湿石", tier:"凡品", rarity:"常见", parts:"苔（沿蜗牛爬过的路长）", habit:"巨蜗爬过的石头", gather:"连石皮铲", lore:"巨蜗的黏液养出来的——药铺收它做胶" },
  { id:"herb_heronflower", name:"鹭花", area:"南境 · 银湖", tier:"启灵", rarity:"少见", parts:"花（白，开在月鹭栖的苇上）", habit:"月鹭守的花", gather:"月鹭飞走才可采", lore:"月鹭衔它筑巢——精灵说鹭花里住着湖的魂" },

  /* ===== 卷九 · 深渊腐化（9 种新） ===== */
  { id:"herb_corruption", name:"腐蚀藤", area:"深渊裂隙 · 魔物巢", tier:"凝元", rarity:"稀有", parts:"藤（汁滴地即枯）", habit:"贴魔物巢长", gather:"铁剪剪，藤汁沾肤即烂", lore:"深渊魔物养的藤——它过处，几年缓不过来" },
  { id:"herb_abysslotus", name:"深渊莲", area:"深渊裂隙 · 黑水", tier:"化意", rarity:"史诗", parts:"莲（黑色，夜开）", habit:"只开在深渊黑水里", gather:"银钩采，黑水沾身蚀骨", lore:"深渊教会的圣花——他们拿它祭献" },
  { id:"herb_bloodpearl", name:"血珍珠菌", area:"深渊裂隙 · 血池", tier:"凝元", rarity:"稀有", parts:"菌（圆红如血珠）", habit:"血池边成串生", gather:"银铲采，菌破血溅", lore:"炼金师说它是血根的地上果——补血极猛" },
  { id:"herb_shadowmoss", name:"影苔", area:"深渊裂隙 · 影域", tier:"凝元", rarity:"稀有", parts:"苔（灰黑，沾上隐入影中）", habit:"长在影豹出没处", gather:"影豹不在时采", lore:"影豹的草——涂它，影子会替你挡一刀" },
  { id:"herb_voidbell", name:"虚空铃", area:"深渊裂隙 · 无光层", tier:"化意", rarity:"史诗", parts:"花（铃形，无风自响）", habit:"长在无光层，吃光", gather:"戴眼罩采，见光即枯", lore:"虚空蠕虫的食物——铃响时，虫在附近" },
  { id:"herb_blackmandrake", name:"黑曼德拉", area:"深渊裂隙 · 腐泥", tier:"化意", rarity:"史诗", parts:"根（人形，黑如炭，拔时无声尖叫）", habit:"曼德拉草的深渊变种", gather:"银剪断根，封进铅盒", lore:"深渊教会炼魂的料——它拔起时，会吞掉光" },
  { id:"herb_rottenstar", name:"腐星花", area:"深渊裂隙 · 裂隙口", tier:"凝元", rarity:"稀有", parts:"花（黑紫，香如烂果）", habit:"长在裂隙口，吸腐气", gather:"风向对了才可采", lore:"腐气最重的地方开的——治腐毒的解药引子" },
  { id:"herb_abyssfennel", name:"深渊茴香", area:"深渊裂隙 · 岩缝", tier:"凝元", rarity:"稀有", parts:"秆（黑纹，嚼之生幻觉）", habit:"长在岩缝，根扎进暗河", gather:"连根拔，根断则幻觉更猛", lore:"深渊教会入迷药的主料——闻一下，见旧事" },
  { id:"herb_souleater", name:"噬魂花", area:"深渊裂隙 · 最深处", tier:"化意", rarity:"史诗", parts:"花（紫黑，花心一只眼）", habit:"花心睁眼时，附近的人会丢记忆", gather:"闭眼采，花谢才睁眼", lore:"深渊魔魂的伴生花——它吃的不是蜜，是念想" },

  /* ===== 卷十 · 神话传说（8 种新） ===== */
  { id:"herb_ambrosia", name:"仙馔", area:"全境 · 神山传说", tier:"传奇", rarity:"唯一", parts:"穗（金色，食之补神）", habit:"只在神山云顶结果", gather:"云梯尽处采——凡人登上者，神山自有答案", lore:"希腊传说：众神吃的食物——凡人吃了，半只脚踏进神的门槛" },
  { id:"herb_nectar", name:"仙酿花", area:"全境 · 神山传说", tier:"传奇", rarity:"唯一", parts:"花（蜜如琼浆）", habit:"仙馔旁边生，共生", gather:"与仙馔同采", lore:"希腊众神的酒——一滴，醉三天" },
  { id:"herb_pomegranate", name:"冥石榴", area:"全境 · 冥界裂隙", tier:"化意", rarity:"史诗", parts:"籽（红如血，食之知生死）", habit:"只在冥界入口结果", gather:"带冥币采，籽落即入土", lore:"珀耳塞福涅的石榴——吃了它的人，一半属于冥界" },
  { id:"herb_lotustree", name:"忘忧树", area:"全境 · 雾海孤岛", tier:"化意", rarity:"史诗", parts:"果（食之忘忧）", habit:"只在雾海孤岛结果", gather:"上岛者难归——忘忧的人，不想走", lore:"奥德修斯的故事：吃忘忧果的船员忘了回家——果实是恩赐，也是陷阱" },
  { id:"herb_laurel", name:"月桂", area:"东境 · 神庙", tier:"凝元", rarity:"史诗", parts:"枝（编冠，诗人与冠军的冠）", habit:"神庙前成排", gather:"神庙祭司亲剪，冠成不谢", lore:"希腊传说：达芙妮化成的树——阿波罗的桂冠，用它的枝编" },
  { id:"herb_hyacinth", name:"风信子", area:"东境 · 河畔", tier:"启灵", rarity:"稀有", parts:"花（蓝紫，香记少年）", habit:"河边成丛", gather:"清晨采，花语是回忆", lore:"希腊传说：雅辛托斯之血化的花——美少年的花，阿波罗为它停过箭" },
  { id:"herb_heliotrope", name:"向日葵", area:"全境 · 日晒之地", tier:"启灵", rarity:"少见", parts:"花（永远朝太阳）", habit:"东境田埂常见", gather:"日中采，花心朝南", lore:"希腊传说：克吕提厄化作的花——她看了太阳九日，从此永远望着它" },
  { id:"herb_simurghfern", name:"森莫夫草", area:"东境 · 智慧之树", tier:"化意", rarity:"传说", parts:"草（叶如羽，通晓旧事）", habit:"长在智慧之树根边", gather:"森莫夫不反对才可采", lore:"波斯智慧鸟森莫夫栖的树——它的草，知道万物" }
];
