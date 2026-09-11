/* ============================================================
 * 群雄割据 · M8 卷D 前四势力线（阵营系统）
 * dn_faction.js — faction_free / faction_north / faction_church / faction_desert
 * 每势力 9 节点：加入→差事→晋升→阵营抉择→战局影响→信任考验→地位→终极抉择→坐镇
 * 阵营互斥：加入一方后 S.faction 锁定，run 中降其他阵营声望（infl）
 * 背叛惩罚支线：faction_traitor_1~4（身份暴露→追杀→逃生→流亡）
 * S.faction 独立键（applyDefaults 兜底）；五主线判定零改动
 * 入口：warphase_14 后 / 各区域选项（M9 整合时挂全）
 * ============================================================ */

/* ================= 势力一：自由城商会 ================= */
N["faction_free_1"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"白昼",pace:"normal",sceneTitle:"阵营 · 自由城商会",text:[
"战火燎到北境的时候，自由城的商会反而成了最安稳的地方。李管事坐在大堂主位上，手里转着两个核桃，眼睛扫过在座的每一个商人。",
"他最后把目光落定在你身上：“你跑过驮队，懂行情，人也靠得住。商会缺你这样一个人。”他推过来一张帖子，“入会，交五十金龙，或者替商会跑成一件大事。你自己挑。”",
"窗外，码头上的船帆在风里扯得笔直。战乱里的钱，只有攥在自己人手里才踏实——这是商会的第一条规矩。", "商会大堂的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（缴五十金龙，正式入会）",effects:{gold:-50,xp:20,flag:"faction_join_free"},run:function(){if(S.faction&&S.faction.joined&&S.faction.joined!=="free_cities"){if(S.infl){S.infl.church=(S.infl.church||0)-10;S.infl.north=(S.infl.north||0)-8;S.infl.desert=(S.infl.desert||0)-8;}}if(window.v35_doJoin){v35_doJoin("free");}else{S.faction.joined="free_cities";}},go:"faction_free_2"},
{t:"（先替商会跑成一件大事，再谈入会）",effects:{xp:12},go:"faction_free_2"},
{t:"（再看看，乱世里不急着站队）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_free_2"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 北门",where:"白昼",pace:"normal",text:[
"你接的第一件差事，是押一支粮驮队去铁门关。战时的粮比命值钱，李管事只说了四个字：“人粮都要。”",
"驮队出了北门，官道上全是南下的流民。见你押着粮，有人停下来讨，有人拿眼睛盯着看。你让人把粮车围在中间，刀不出鞘，可谁也不敢真伸手。",
"第七天，驮队进了铁门关。交割完，守关的军需官多塞了你一袋钱：“路上听说商队被人截了，你们是全须全尾到的第一支。”你掂了掂那袋钱，没接：“账上怎么写的，就怎么算。”军需官愣了愣，笑了。"
],options:[
{t:"（把赏钱分给驮队的弟兄）",effects:{gold:20,xp:18,infl:{free:5}},go:"faction_free_3"},
{t:"（把钱收下，生意就是生意）",effects:{gold:35,xp:12},go:"faction_free_3"}
]};

N["faction_free_3"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"白昼",pace:"normal",text:[
"铁门关这一趟，让李管事对你刮目相看。他把你叫到堂上，扔给你一把钥匙：“北门外的旧货栈，归你管。栈里存什么、卖什么、跟谁做，你说了算。”",
"旧货栈的梁上落着灰，墙角的蜘蛛网结了三年。你扫了三天，总算把栈房收拾出个样子。",
"第二天，就有三拨人来敲门：一个卖铁的，一个收药的，还有一个压低声音问“军械收不收”。你把他请了出去，心里记下了这笔账——商会这碗饭，吃的是名声，倒的也是名声。"
],options:[
{t:"（把货栈做成正经生意，只收明路货）",effects:{xp:18,infl:{free:6}},go:"faction_free_4"},
{t:"（私下也接点灰色买卖，多挣些）",effects:{gold:40,xp:10},go:"faction_free_4"}
]};

N["faction_free_4"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"夜",pace:"deep",sceneTitle:"抉择 · 商会的立场",text:[
"战争打到拉锯的时候，李管事把商会管事的都叫到堂上，一人面前一碗茶。",
"他开口就直奔要害：“北边要粮，南边要盐，西边要铁。我们卖给谁，不卖给谁，这碗水端不平，商会的招牌就砸了。”",
"堂上吵成一团。有人说平价售粮是积德，有人说囤积居奇才是正理，还有人提议两头下注，谁也不得罪。",
"李管事把核桃往桌上一拍，看向你：“你管着北门货栈，你说，这碗水怎么端？”", "别过商会大堂，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（平价售粮，稳住城里的民心）",effects:{gold:-20,xp:25,infl:{free:10},flag:"faction_free_fair"},run:function(){if(S.infl)S.infl.church=(S.infl.church||0)+3;},go:"faction_free_5"},
{t:"（囤积居奇，趁乱把本钱做厚）",effects:{gold:60,xp:15,flag:"faction_free_hoard"},run:function(){if(S.infl)S.infl.church=(S.infl.church||0)-6;},go:"faction_free_5"},
{t:"（两头下注，谁也挑不出错处）",effects:{gold:25,xp:20,flag:"faction_free_double"},go:"faction_free_5"}
]};

N["faction_free_5"]={tags:["faction:war"],tag:"main",place:"北境 · 雪原 · 盐道",where:"白昼",pace:"deep",text:[
"商会的决定传下去没几天，北境的盐路就断了。",
"不是被截的，是被堵的——铁门关卡住了所有北上的盐车，说盐要优先供军。南边的盐贩子趁机抬价，自由城的盐价一夜翻了三番。",
"李管事找到你：“盐路是你跑熟的。你去铁门关，把盐道谈通。谈不拢，商会在北境十年的根基就白打了。”",
"你带着商会的帖子上了路。铁门关的守将是个刀削脸的中年人，听完你的来意，只说了一句：“盐可以放，拿东西换——军饷缺三个月了。”", "你离了雪原，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（替商会垫付三个月军饷，换盐道畅通）",effects:{gold:-80,xp:30,infl:{free:12,north:8},flag:"faction_free_salt"},go:"faction_free_6"},
{t:"（拉上北境联军一起谈，让两家分利）",effects:{xp:24,infl:{free:8,north:10},flag:"faction_free_salt2"},go:"faction_free_6"},
{t:"（谈不拢就绕路，走西边的山路）",effects:{gold:-30,xp:15,flag:"faction_free_salt3"},go:"faction_free_6"}
]};

N["faction_free_6"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 北门货栈",where:"夜",pace:"normal",sceneTitle:"考验 · 货栈的暗门",text:[
"盐路通了，你的货栈也跟着红火起来。",
"红火的第二个月，来了个生面孔。他穿得像个行商，可手上的茧子不像握算盘的。他关上房门，压低声音：“北边有一批货，想从你的栈里过一道。价钱好说。”",
"他摊开手掌，掌心里躺着一枚军械营的标记。",
"你盯着那枚标记。这活儿接下来，钱是白花花的；可要是东窗事发，商会百年招牌，连带你这条命，都得搭进去。", "北门货栈在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（拒了这单，把话传回商会）",effects:{xp:28,infl:{free:10},flag:"faction_free_loyal"},go:"faction_free_7"},
{t:"（接下这单，赚一笔快钱）",effects:{gold:80,xp:12,flag:"faction_free_smuggle"},run:function(){if(S.infl)S.infl.north=(S.infl.north||0)-12;},go:"faction_free_7"}
]};

N["faction_free_7"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"白昼",pace:"normal",text:[
"入冬前，商会重排座次。李管事把你的名字提进了执事席：“北门货栈、盐道、驮队，三样都在你手里。商会该有你一把椅子了。”",
"执事席的椅子是酸枝木的，坐着比账房的条凳硬。散会后，老执事们三三两两地走，有人拍了拍你的肩，有人没看你。",
"你坐在那把椅子上，忽然明白了一件事：商会里，坐到多高都不算站稳，只有把每一件事都做干净，椅子才不会晃。"
],options:[
{t:"（在执事席上坐稳，把账做明白）",effects:{xp:20,infl:{free:8}},go:"faction_free_8"}
]};

N["faction_free_8"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"夜",pace:"deep",sceneTitle:"抉择 · 商会的忠诚",text:[
"终战前夜，李管事病倒了。他躺在榻上，把商会的印信交到你手里，喘着气说：“商会的路，你替我走完。”",
"第二天，军方的代表就进了大堂，话里话外只有一个意思：商会要“为战事效力”——说白了，是拿商会的家底去填军饷的无底洞。",
"堂下的人分成两派。一派说，乱世里跟紧了军方才有活路；一派说，商会就是商会，喂肥了军方，自己就成了刀下肉。",
"印信在你手心里发烫。这一步踏出去，商会的十年根基，是留在自由城，还是押上战场——全在你一念之间。"
],options:[
{t:"（忠于商会，婉拒军方，把根基留在自由城）",effects:{xp:35,infl:{free:15},flag:"faction_free_final_loyal"},go:"faction_free_9"},
{t:"（投靠军方，让商会成为战争的钱袋子）",effects:{gold:60,xp:25,flag:"faction_free_final_army"},run:function(){if(S.infl){S.infl.north=(S.infl.north||0)+10;S.infl.free=(S.infl.free||0)-10;}},go:"faction_free_9"},
{t:"（出卖商会的情报给对家，拿一笔买命钱）",effects:{gold:100,flag:"faction_traitor"},go:"faction_traitor_1"}
]};

N["faction_free_9"]={tags:["faction:war"],tag:"main",place:"自由城邦 · 商会大堂",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 自由城的生意",text:[
"终战的硝烟散尽后，自由城的商会重新开张。",
"你坐在大堂的主位上，手里转着两个核桃——那是李管事留给你的。货栈的账、盐道的契、驮队的路引，一摞一摞摆在案上。",
"有人问，商会在战乱里挣了多少。你只笑了笑。账本上那些数字是死的，可活下来的铺子、跑通的路、稳住的人心，才是商会真正挣下的东西。",
"窗外，码头的船又扬了帆。自由城还是那个自由城，只是你坐的位置，不一样了。", "你收拾停当，离开商会大堂，沿着来路踏上行程。"],options:[
{t:"（坐镇自由城，把商会的路继续走下去）",effects:{xp:25,flag:"faction_free_done"},go:"warphase_14"}
]};

/* ================= 势力二：北境联军 ================= */
N["faction_north_1"]={tags:["faction:war"],tag:"main",place:"北境 · 第三哨 · 校场",where:"白昼",pace:"normal",sceneTitle:"阵营 · 北境联军",text:[
"第三哨的校场上，北境联军的旗在风里抖得猎猎响。",
"联军的都尉是个老将，脸上横着一道旧刀疤。他绕着新兵队走了一圈，走到你面前停下来：“你在冻河滩挨过一枪？伤好了？”",
"你应了一声。都尉点点头：“伤好了就留下。北境联军的规矩，一不要逃兵，二不要孬种。你能挨枪不跑，够格。”",
"他扔给你一副甲：“穿上。从今天起，你是联军的人了。”", "你离了第三哨，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（披上联军甲，正式入伍）",effects:{xp:20,flag:"faction_join_north"},run:function(){if(S.faction&&S.faction.joined&&S.faction.joined!=="north"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.church=(S.infl.church||0)-8;S.infl.desert=(S.infl.desert||0)-6;}}if(window.v35_doJoin){v35_doJoin("north");}else{S.faction.joined="north";}},go:"faction_north_2"},
{t:"（先在校场上露两手，再谈入伍）",effects:{xp:12},go:"faction_north_2"},
{t:"（看看再说，联军未必是唯一的靠山）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_north_2"]={tags:["faction:war"],tag:"main",place:"北境 · 第三哨 · 城头",where:"夜",pace:"deep",text:[
"入伍第三天，你就上了城头值夜。",
"雪原的夜风像刀子，刮在脸上生疼。带你的老兵姓周，蹲在垛口下，叼着根草茎，给你讲联军的规矩：“仗怎么打，听都尉的；命怎么保，听自己的。”",
"下半夜，雪地里传来窸窣的响动。周老兵把草茎一吐，按住你的肩：“别动，看。”",
"不多时，雪里钻出两个人影，是摸城探路的斥候。周老兵打了个手势，你跟着他悄声摸过去，一人一个，按住背心捂了嘴，拖进城门洞。",
"审了一夜，问出对面营地的位置。都尉听完，看了你一眼：“头一回值夜就抓了活口，是个干斥候的料。”"
],options:[
{t:"（领了斥候的差，摸过河去探营）",effects:{xp:25,hp:-6,infl:{north:8},flag:"faction_north_scout"},go:"faction_north_3"},
{t:"（留在城头，先把城墙守明白）",effects:{xp:15,infl:{north:5}},go:"faction_north_3"}
]};

N["faction_north_3"]={tags:["faction:war"],tag:"main",place:"北境 · 雪原 · 敌营外",where:"夜",pace:"deep",text:[
"你摸过河的那一夜，雪下得正紧。",
"你裹着白布袍子，趴在敌营外冻了两个时辰，把营地里的兵力、粮堆、马栏的位置一样一样记在心里。回程时被一个游哨撞见，追了你三里地，箭矢贴着耳朵过去了两回。",
"你一头扎进冻河，顺流漂出半里才上岸。回到第三哨时，嘴唇冻得发紫，怀里那卷画着营地布防的羊皮纸却一点没湿。",
"都尉看完布防图，半晌没说话。末了他把羊皮纸收进怀里，拍了拍你的肩：“小子，你这张图，值一座城。”"
],options:[
{t:"（领了百夫长的衔，带一队斥候）",effects:{xp:30,infl:{north:12},flag:"faction_north_leader"},go:"faction_north_4"}
]};

N["faction_north_4"]={tags:["faction:war"],tag:"main",place:"北境 · 第三哨 · 军务厅",where:"白昼",pace:"deep",sceneTitle:"抉择 · 联军的打法",text:[
"围城之前，都尉把几个百夫长叫进军务厅，摊开一张北境地图。",
"他拿刀尖点着地图上的几处标记：“荒原诸部集结得快，硬拼我们拼不过。要么先发制人，烧他们的粮；要么固守待援，等铁门关的兵来；要么跟老萨满谈，看能不能拖几天。”",
"刀尖在地图上划过来划过去。都尉抬起头，目光从每个人脸上扫过：“你们说，这一仗怎么打。”",
"你盯着地图上那条冻河。怎么打，不只是打法的问题——这一仗怎么打，联军的血就往哪儿流。", "你最后回望一眼第三哨，转身穿过街口，往下一程赶路。"],options:[
{t:"（先发制人，连夜烧他们的粮草）",effects:{xp:30,hp:-8,infl:{north:10},flag:"faction_north_burn"},go:"faction_north_5"},
{t:"（固守待援，把城防加固到极限）",effects:{xp:20,infl:{north:8},flag:"faction_north_hold"},go:"faction_north_5"},
{t:"（派人去见老萨满，争取三天时间）",effects:{xp:24,infl:{north:6},flag:"faction_north_talk"},go:"faction_north_5"}
]};

N["faction_north_5"]={tags:["faction:war"],tag:"main",place:"北境 · 第三哨 · 城头",where:"夜",pace:"deep",text:[
"那一仗打完，第三哨的城墙上又多了几十道刀痕。",
"联军赢了，赢得很险。都尉在战后点兵，阵亡的名字念了半炷香。他念完，把名单折好，揣进怀里，声音哑着：“都记着。仗打完，一个都不许忘。”",
"你站在队列里，甲上还沾着干了的血。你忽然明白了联军的第二条规矩——这支军队打的每一仗，都是用名字换的。",
"都尉走过来，把一个铁牌塞进你手里：“从今天起，你是联军的旗手。旗在，人在。”", "你离了第三哨，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（接过铁牌，做联军的旗手）",effects:{xp:28,infl:{north:12},flag:"faction_north_banner"},go:"faction_north_6"}
]};

N["faction_north_6"]={tags:["faction:war"],tag:"main",place:"北境 · 雪原 · 行军路上",where:"白昼",pace:"normal",sceneTitle:"考验 · 军令与人心",text:[
"终战前，联军接了一道军令：把雪原上所有村庄的存粮征走，充作军粮。",
"你带兵到第一个村子时，村长跪在雪地里，身后是挤成一团的村民：“军爷，粮征走了，这一村人冬天吃什么？”",
"士兵们等着你的话。军令是死的，可眼前这些人，是活的。",
"你看着村长身后的孩子，一张张小脸冻得通红。手里的军令纸，忽然比刀还重。", "别过雪原，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（照令征粮，军令如山）",effects:{xp:30,infl:{north:14},flag:"faction_north_order"},go:"faction_north_7"},
{t:"（留下一半粮，拿自己的军饷补上缺额）",effects:{gold:-40,xp:26,infl:{north:6},flag:"faction_north_mercy"},run:function(){if(S.infl)S.infl.free=(S.infl.free||0)+4;},go:"faction_north_7"}
]};

N["faction_north_7"]={tags:["faction:war"],tag:"main",place:"北境 · 联军大营",where:"夜",pace:"normal",text:[
"征粮的事传回大营，都尉没有多说，只在你军牌上多刻了一道痕。",
"那是联军的老规矩：一道痕，一次大功。你的军牌上已经有了四道。",
"夜里，都尉把你叫到帐里，难得地给自己倒了碗酒：“打完这仗，你想过没有，你要什么？”",
"你没接话。帐外的风把火堆吹得忽明忽暗，像极了这场战争的走向。"
],options:[
{t:"（要一支自己的兵，打最硬的仗）",effects:{xp:25,infl:{north:10},flag:"faction_north_want_army"},go:"faction_north_8"},
{t:"（要这仗早点打完，让雪原的人喘口气）",effects:{xp:22,infl:{north:8},flag:"faction_north_want_peace"},go:"faction_north_8"}
]};

N["faction_north_8"]={tags:["faction:war"],tag:"main",place:"北境 · 联军大营",where:"夜",pace:"deep",sceneTitle:"抉择 · 军人的路",text:[
"终战的决战前夜，都尉把联军的三位将领叫进大帐，摊开最后的作战图。",
"帐帘掀开又落下，火把的光把每个人的影子拉得很长。都尉看了你一眼：“你的斥候探明了路，你的旗在城头立了三年。今夜，这最后一仗，你说，怎么打。”",
"你盯着作战图。打赢这仗，联军就是北境之主；可赢的方式，决定了联军以后是兵还是匪。",
"帐外，士兵们围在火堆旁，小声唱着家乡的调子。你听着那歌声，把手按在图上。", "你离了联军大营，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（稳扎稳打，用最小的伤亡换最大的胜）",effects:{xp:35,infl:{north:15},flag:"faction_north_final_stable"},go:"faction_north_9"},
{t:"（孤注一掷，倾巢而出，速战速决）",effects:{xp:40,hp:-12,infl:{north:10},flag:"faction_north_final_dare"},go:"faction_north_9"},
{t:"（带着联军的布防图，投了荒原诸部）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"}
]};

N["faction_north_9"]={tags:["faction:war"],tag:"main",place:"北境 · 第三哨 · 城头",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 北境之旗",text:[
"终战之后，都尉把联军的帅旗交到你手里：“我老了，打不动了。北境这副担子，你挑。”",
"你站在第三哨的城头上，手里的帅旗在风里展开。雪原上，联军的大营正在拔营——仗打完了，兵要回乡。",
"你看着那面旗，想起冻河滩的夜、围城的雪、终战的号角，想起那些念了名字的人。",
"北境从此有了新的旗手。你知道，这面旗不是立给谁看的——它是立给雪原上每一个活下来的人的。", "出了第三哨，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（接过帅旗，镇守北境）",effects:{xp:25,flag:"faction_north_done"},go:"warphase_14"}
]};
/* ================= 势力三：光明教会 ================= */
N["faction_church_1"]={tags:["faction:war"],tag:"main",place:"圣城 · 大教堂 · 回廊",where:"白昼",pace:"normal",sceneTitle:"阵营 · 光明教会",text:[
"战争打起来以后，圣城的教堂反而比平时更挤。",
"逃难的人把教堂的条凳坐满，教士们端着粥桶在人群中穿梭。你帮忙抬了两天伤员，一个穿灰袍的老执事拦住了你：“你的手很稳。留下来，教会需要这样的人。”",
"他领你走进大教堂的回廊，壁画上的圣光洒下来，落在地上像一层水。老执事回头看了你一眼：“教会不问出身，只问心。你可愿侍奉光明？”", "大教堂的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（受洗入教，成为教会的人）",effects:{xp:20,flag:"faction_join_church"},run:function(){if(S.faction&&S.faction.joined&&S.faction.joined!=="light_church"){if(S.infl){S.infl.free=(S.infl.free||0)-8;S.infl.north=(S.infl.north||0)-8;S.infl.desert=(S.infl.desert||0)-6;}}if(window.v35_doJoin){v35_doJoin("church");}else{S.faction.joined="light_church";}},go:"faction_church_2"},
{t:"（先帮教堂做几件事，再看看）",effects:{xp:12},go:"faction_church_2"},
{t:"（道不同，谢过老执事的好意）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_church_2"]={tags:["faction:war"],tag:"main",place:"圣城 · 教会医院",where:"夜",pace:"deep",text:[
"你在教会医院帮了半个月忙。",
"伤员一批批地抬进来：冻伤的、中箭的、被马踩断骨头的。你学着教士的样子换药、包扎、夜里替重伤的人守灵。有一个断腿的老兵，疼得整夜整夜地哼，你守了他三夜，他攥着你的手说：“小兄弟，你是好人。”",
"老执事把你叫到一边：“你的心肠够。可教会要的不只是心肠——战争里，心肠是刀，还得有人握得住它。”",
"他把一枚圣徽递到你手里：“明日随我去审判庭。那里有一桩案子，需要一双看得见人的眼睛。”", "出了教会医院，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（接过圣徽，随老执事去审判庭）",effects:{xp:24,infl:{church:8},flag:"faction_church_judge"},go:"faction_church_3"}
]};

N["faction_church_3"]={tags:["faction:war"],tag:"main",place:"圣城 · 审判庭",where:"白昼",pace:"deep",text:[
"审判庭的案子，是一桩通敌案。",
"被告是个年轻的边民，被人告发向荒原诸部卖过粮食。堂上，原告说得头头是道，人证物证俱全。被告跪在堂下，嘴唇哆嗦着，说不出话。",
"你站在老执事身后，看着那年轻人的眼睛。那双眼睛里没有狡猾，只有一种被吓坏了的茫然。",
"老执事没说话，只偏过头看了你一眼。那一眼的意思很清楚：你来判。", "审判庭的灯火远了。夜风凉，你把心思收回来，专心赶路。"],options:[
{t:"（细查账册，发现粮食是教会支的赈济粮）",effects:{xp:30,infl:{church:12},flag:"faction_church_truth"},go:"faction_church_4"},
{t:"（按人证物证定罪，杀一儆百）",effects:{xp:18,infl:{church:6},flag:"faction_church_strict"},go:"faction_church_4"},
{t:"（拖一拖，等风头过了再放人）",effects:{xp:15,flag:"faction_church_delay"},go:"faction_church_4"}
]};

N["faction_church_4"]={tags:["faction:war"],tag:"main",place:"圣城 · 大教堂",where:"夜",pace:"deep",sceneTitle:"抉择 · 教会的刀",text:[
"通敌案之后，老执事把你正式引荐给了圣痕司。",
"圣痕司的长老是个瘦高的女人，眼窝深陷，说话像在诵经：“战争里，教会要做的不是救人，是审判——审判谁该活，谁该死。这差事，你干不干？”",
"她把手边的铁匣子推过来，匣子里是一排刻着名字的牌子：“这些是通敌、渎神、违背教义的名单。教会要你一件一件查实。”",
"你看着那排牌子。每一块牌子后面，都是一条命。", "大教堂的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（接下差事，只查实据，不冤枉人）",effects:{xp:30,infl:{church:12},flag:"faction_church_just"},go:"faction_church_5"},
{t:"（接下差事，也替教会办几件脏事）",effects:{gold:40,xp:20,flag:"faction_church_dirty"},go:"faction_church_5"},
{t:"（推了差事，留在医院救人）",effects:{xp:20,infl:{church:6},flag:"faction_church_heal"},go:"faction_church_5"}
]};

N["faction_church_5"]={tags:["faction:war"],tag:"main",place:"圣城 · 圣痕司 · 卷宗房",where:"白昼",pace:"deep",text:[
"圣痕司的卷宗房，是圣城最冷的地方。",
"架上堆着几百年来的案卷，落满灰。你翻了三天，翻出一桩旧案：二十年前，教会曾以渎神罪烧死过一个铁匠——卷宗里说，铁匠在打一把“不该打的钥匙”。",
"你盯着那行字，想起第三哨的铜钟、矿洞里的钥匙、学院里那把锈钥匙。这些事，像是被同一根线穿着。",
"你把卷宗合上，没有告诉任何人。有些线，得等到它自己亮出来。", "圣痕司的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],options:[
{t:"（把旧案记在心里，继续查眼前的案子）",effects:{xp:26,infl:{church:8},flag:"faction_church_oldcase"},go:"faction_church_6"}
]};

N["faction_church_6"]={tags:["faction:war"],tag:"main",place:"圣城 · 教会医院",where:"夜",pace:"normal",sceneTitle:"考验 · 名单上的人",text:[
"终战前，圣痕司的名单上添了一个新名字：艾琳。",
"这个名字你认得——学院里那个研究异端符号的学姐，后来去了圣城。名单上的罪名写着“异端研究”。",
"老执事把名单递给你时，手顿了一下：“这个案子，你来办。”",
"你接过名单，纸页在手里发起热来。办，还是不办——这名字后面，不只是一个人，还有你在学院里听过的一整个秘密。", "从教会医院出来，路上行人渐稀。你脚步不停，一路向前。"],options:[
{t:"（先去找艾琳，把话问清楚）",effects:{xp:28,infl:{church:6},flag:"faction_church_alice"},go:"faction_church_7"},
{t:"（按名单行事，把案子报上去）",effects:{xp:20,infl:{church:10},flag:"faction_church_report"},go:"faction_church_7"}
]};

N["faction_church_7"]={tags:["faction:war"],tag:"main",place:"圣城 · 圣痕司",where:"夜",pace:"normal",text:[
"艾琳的案子，最后以“查无实据”结了。",
"是你压下去的。你把卷宗里那几页“证据”翻来覆去看了三遍，每一遍都看出同一个漏洞：证词是抄的，笔迹对不上。",
"老执事什么都没问。他只在你的名字后面，用炭笔划了一道。",
"你知道那道划痕的意思：教会记住了你。可你更清楚，自己记住的是什么——那卷宗里的漏洞，是有人故意留的。", "圣痕司已被抛在身后。路在脚下延伸，你不回头，行至前方。"],options:[
{t:"（在圣痕司站稳，守住心里那把秤）",effects:{xp:24,infl:{church:10},flag:"faction_church_stand"},go:"faction_church_8"}
]};

N["faction_church_8"]={tags:["faction:war"],tag:"main",place:"圣城 · 大教堂 · 圣坛前",where:"夜",pace:"deep",sceneTitle:"抉择 · 光明与权力",text:[
"终战之后，教会内部爆发了一场争论：战后的圣城，是该开仓济民，还是该借乱扩权。",
"长老们分坐两排，谁也说服不了谁。老执事把你叫到圣坛前，指着两边的火烛：“你是从战场上下来的人。你来说，光明应该是什么样子。”",
"圣坛上的烛火跳动着，把你的影子投在壁画上。你抬头看那幅画——画上，光明的主神握着天平。你忽然想起腰间的金秤。",
"你开口之前，堂上安静得能听见烛芯燃烧的声音。", "你最后回望一眼大教堂，转身穿过街口，往下一程赶路。"],options:[
{t:"（主张开仓济民，让光明照进粮仓）",effects:{xp:35,infl:{church:15},flag:"faction_church_final_mercy"},go:"faction_church_9"},
{t:"（主张借乱扩权，让教会庇佑万民）",effects:{xp:28,infl:{church:10},flag:"faction_church_final_power"},go:"faction_church_9"},
{t:"（把教会的密档交给对家，换一条退路）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"}
]};

N["faction_church_9"]={tags:["faction:war"],tag:"main",place:"圣城 · 大教堂 · 钟楼",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 圣城的钟声",text:[
"教会的争论有了结果。你站在大教堂的钟楼上，看着圣城的屋顶在晨光里一片片亮起来。",
"老执事在你身后站了很久，最后说：“教会这两百年，一直在等一个能把天平端平的人。你来得不早不晚。”",
"你没有接话。钟楼下的街道上，粥棚支起来了，难民排着长队，热气从锅边升起来，模糊了晨光。",
"你伸手握住钟绳，拉了一下。钟声沉沉地荡开，盖过整座圣城——这一声，是给活人的。", "你最后回望一眼大教堂，转身穿过街口，往下一程赶路。"],options:[
{t:"（留在圣城，做那个端天平的人）",effects:{xp:25,flag:"faction_church_done"},go:"warphase_14"}
]};

/* ================= 势力四：沙漠诸部 ================= */
N["faction_desert_1"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 绿洲集市城",where:"白昼",pace:"normal",sceneTitle:"阵营 · 沙漠诸部",text:[
"战争的消息传到沙漠，比风还快。",
"绿洲集市城的驼队头领扎克，是个满脸风霜的汉子。他在沙地上盘腿坐着，面前摆着一壶茶：“北边打起来了，沙漠也要站队。诸部的大帐里吵了三天，谁也不想先低头。”",
"他抬眼打量你：“你走过沙漠，懂沙子的脾气。诸部缺一个能从沙子里看出路的人。”",
"他把一碗茶推到你面前：“喝了这碗茶，你就是诸部的兄弟。”", "别过绿洲集市城，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（喝下那碗茶，加入沙漠诸部）",effects:{xp:20,flag:"faction_join_desert"},run:function(){if(S.faction&&S.faction.joined&&S.faction.joined!=="desert"){if(S.infl){S.infl.free=(S.infl.free||0)-6;S.infl.north=(S.infl.north||0)-6;S.infl.church=(S.infl.church||0)-8;}}if(window.v35_doJoin){v35_doJoin("desert");}else{S.faction.joined="desert";}},go:"faction_desert_2"},
{t:"（先随驼队走一趟，看看诸部的底细）",effects:{xp:12},go:"faction_desert_2"},
{t:"（沙漠的水太浑，不急着蹚）",effects:{xp:5},go:"warphase_14"}
]};

N["faction_desert_2"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 驼道",where:"白昼",pace:"deep",text:[
"入部第一趟差事，是押一支驼队穿过风暴眼。",
"扎克说，沙漠里有三样东西能要人命：太阳、风、人心。第一样，他教你在沙丘背阴处挖洞避晒；第二样，他教你看云识风；第三样，他没教，让你自己看。",
"走到第三天，风暴来了。天地间一片昏黄，沙子打在脸上像刀割。驼队乱了，有驮子翻了，货撒了一地。你顶着风跑过去，把翻倒的驮子扶起来，用绳子重新捆紧。",
"风暴过去，扎克清点完货物，看了你一眼：“别人都躲，你冲上去扶驮子。你这个人，心里有杆秤。”"
],options:[
{t:"（在驼队里站稳，学着认沙漠的路）",effects:{xp:24,infl:{desert:8},flag:"faction_desert_caravan"},go:"faction_desert_3"}
]};

N["faction_desert_3"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 诸部大帐",where:"夜",pace:"deep",text:[
"诸部的大帐，是沙漠里最热闹也最凶险的地方。",
"五个部族的头领围坐在火堆旁，为一件小事吵得面红耳赤：一块水草地的归属。有人拍案，有人拔刀，火堆被搅得火星四溅。",
"扎克把你推到人前：“这是走过风暴的兄弟，让他说两句。”",
"几双眼睛一齐看过来，像几把刀。你知道，这一句话说得不好，自己在沙漠里的路就断了。", "你收拾停当，离开诸部大帐，沿着来路踏上行程。"],options:[
{t:"（主张按规矩抽签，谁也不偏）",effects:{xp:26,infl:{desert:10},flag:"faction_desert_fair"},go:"faction_desert_4"},
{t:"（站到水草地多的一方，卖个人情）",effects:{xp:18,infl:{desert:6},flag:"faction_desert_lean"},go:"faction_desert_4"},
{t:"（提议两族共管，先把水草用起来）",effects:{xp:22,infl:{desert:12},flag:"faction_desert_share"},go:"faction_desert_4"}
]};

N["faction_desert_4"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 绿洲集市城",where:"白昼",pace:"normal",sceneTitle:"抉择 · 诸部的刀口",text:[
"水草地的事解决后，诸部把你当成了自己人。扎克喝多了茶，跟你说了一桩心事。",
"“北边打仗，要粮。南边运粮，要过沙漠。有人找上诸部，说只要放粮队过去，给三成利。”他放下茶碗，“可也有人说，扣下粮队，能跟北边换更好的价。”",
"他盯着你：“这买卖，你说做不做。”",
"茶碗里的水汽袅袅地往上飘。你知道，这一句话，决定诸部站哪一边。", "别过绿洲集市城，你沿官道走出里许，回头已看不清来处。"],options:[
{t:"（放粮队过去，赚个安稳钱）",effects:{gold:30,xp:22,infl:{desert:8,north:4},flag:"faction_desert_let"},go:"faction_desert_5"},
{t:"（扣下粮队，跟北边谈个好价）",effects:{gold:60,xp:16,infl:{desert:4},flag:"faction_desert_take"},go:"faction_desert_5"},
{t:"（两边都不得罪，收过路费放行）",effects:{gold:45,xp:20,flag:"faction_desert_toll"},go:"faction_desert_5"}
]};

N["faction_desert_5"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 古代遗迹",where:"夜",pace:"deep",text:[
"粮队的事过去不久，一个牧羊人在遗迹群里发现了一道新裂开的地缝。",
"你带人下去探了一回。地缝深处的石壁上，刻着连串的符号——和你在学院禁书区见过的那些，像是一家人。",
"你在石缝里捡到一枚碎掉的玉片，玉片上有一道刻痕，像半个锚。你把它收进怀里，没有声张。",
"回城路上，扎克问你看见了什么。你只说：“沙子下面，有些东西比战争更老。”", "你离了古代遗迹，脚步声在空旷处格外清晰。赶路要紧。"],options:[
{t:"（把玉片收好，留待以后查证）",effects:{xp:26,infl:{desert:8},flag:"faction_desert_jade"},go:"faction_desert_6"}
]};

N["faction_desert_6"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 绿洲集市城",where:"白昼",pace:"normal",sceneTitle:"考验 · 驼铃与刀",text:[
"终战前，诸部的大帐收到一封北边的信：北境联军要借沙漠的道，运一批铁器。",
"信在头领们手里转了一圈。有人拍桌子说借，有人冷笑说不借——铁器进了沙漠，就是进了诸部的喉咙。",
"扎克把信递给你：“你是走过两条路的人。你说，这铁器，借不借？”",
"信纸在风里抖着。你知道，这道口子一开，诸部就再也不是局外人。"
],options:[
{t:"（借道，但收一笔买路钱）",effects:{gold:40,xp:24,infl:{desert:6,north:6},flag:"faction_desert_pass"},go:"faction_desert_7"},
{t:"（不借，沙漠不管北边的闲事）",effects:{xp:22,infl:{desert:8},flag:"faction_desert_refuse"},go:"faction_desert_7"},
{t:"（借道，但让联军拿种子和药来换）",effects:{xp:28,infl:{desert:12,north:8},flag:"faction_desert_seed"},go:"faction_desert_7"}
]};

N["faction_desert_7"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 诸部大帐",where:"夜",pace:"normal",text:[
"借道的事定下来后，扎克在诸部大帐里替你摆了一碗酒。",
"他端起碗，声音不高不低：“这位兄弟替诸部走过风暴、断过水草、探过遗迹。今天起，他是诸部的执事。”",
"几个头领都端起了碗。酒是烈的，入喉像吞了一团火。你喝下去，火从胃里烧到眼眶。",
"你知道，这碗酒喝下去，沙漠就把你拴住了。可拴住你的不是酒，是那些在沙子里跟你一起扛过命的人。"
],options:[
{t:"（接执事的位子，替诸部走到底）",effects:{xp:24,infl:{desert:10},flag:"faction_desert_elder"},go:"faction_desert_8"}
]};

N["faction_desert_8"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 诸部大帐",where:"夜",pace:"deep",sceneTitle:"抉择 · 沙海的船",text:[
"终战结束的消息传到沙漠，比水还慢。",
"诸部的大帐里，头领们为战后的路吵了三天三夜：有人要跟北边结盟，有人要跟教会结盟，有人要谁都不靠，关起门来过日子。",
"扎克病倒了，躺在帐里，把一枚驼铃塞进你手里：“诸部的路，你替我走。往哪走，你说了算。”",
"驼铃在你手心里，沉甸甸的。帐外，沙漠的风呜呜地响，像无数个声音在问同一个问题。", "诸部大帐在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],options:[
{t:"（带着诸部并入北境联军，求个长治久安）",effects:{xp:32,infl:{desert:10,north:10},flag:"faction_desert_final_north"},go:"faction_desert_9"},
{t:"（带着诸部保持独立，只做买卖不结盟）",effects:{xp:28,infl:{desert:14},flag:"faction_desert_final_free"},go:"faction_desert_9"},
{t:"（把诸部的沙道情报卖给教廷，换笔安稳钱）",effects:{gold:80,flag:"faction_traitor"},go:"faction_traitor_1"}
]};

N["faction_desert_9"]={tags:["faction:war"],tag:"main",place:"死亡沙漠 · 绿洲集市城 · 望沙台",where:"白昼",pace:"normal",sceneTitle:"坐镇 · 沙漠的路",text:[
"你站在望沙台上，看太阳从沙海尽头升起来。",
"驼队的铃声响了，一队一队地往南走。扎克的病好了一半，坐在台下的阴凉里，看着你笑：“路是你选的，可沙子还是那片沙子。”",
"你捏着那枚驼铃，没有回话。战争结束了，沙漠还在。诸部要在这片沙海里活多久，就看你把路引向何方。",
"风把沙粒吹上望沙台，落在你肩头。你抖了抖衣襟，走下台去——该启程了。"
],options:[
{t:"（领着诸部，在战后的沙漠里走出一条路）",effects:{xp:25,flag:"faction_desert_done"},go:"warphase_14"}
]};

/* ================= 背叛惩罚支线（阵营通用） ================= */
N["faction_traitor_1"]={tags:["faction:war"],tag:"main",place:"大陆 · 亡命路上",where:"夜",pace:"deep",sceneTitle:"背叛 · 亡命",text:[
"你递出去的那份东西，第三天就东窗事发了。",
"消息传得比你跑得快。你前脚出城，后脚就有三路人马在找你：原阵营的人要清理门户，对家要灭口，还有一路是闻着赏金来的。",
"你在一条野路上歇脚时，一枚箭矢钉在身边的树干上，箭尾绑着一封信：“七天内，把东西还回来。否则，提头来见。”",
"你把信捏成一团，塞进怀里。从这一刻起，你的名字在整片大陆上，比战争的硝烟还臭。"
],options:[
{t:"（弃了原来的名字，往更远的地方跑）",effects:{xp:20,flag:"traitor_onrun"},go:"faction_traitor_2"},
{t:"（反身回去，把东西抢回来，将功折罪）",effects:{xp:30,hp:-15,flag:"traitor_turnback"},go:"faction_traitor_3"}
]};

N["faction_traitor_2"]={tags:["faction:war"],tag:"main",place:"大陆 · 边境 · 无名渡口",where:"夜",pace:"deep",text:[
"你逃到边境的无名渡口，只剩最后一枚银币。",
"渡口的艄公认出你腰间那块军牌：“你从北边来？北边的人，现在都欠着三条命。”他掂了掂银币，没有收，“上船吧。到了对岸，别再提你从前的事。”",
"船到江心，艄公忽然开口：“我年轻时也背过一回名声。背上它，就再也卸不下来了。”",
"你看着对岸的灯火，江水在船底哗哗地响。你忽然明白，背叛这回事，逃得再远，也逃不出自己心里那杆秤。", "你收拾停当，离开边境，沿着来路踏上行程。"],options:[
{t:"（渡过江去，从此隐姓埋名）",effects:{xp:25,flag:"traitor_exile"},go:"faction_traitor_4"},
{t:"（在船到对岸前转身，回去把账了结）",effects:{xp:30,hp:-10,flag:"traitor_redemption"},go:"faction_traitor_3"}
]};

N["faction_traitor_3"]={tags:["faction:war"],tag:"main",place:"原阵营 · 议事堂外",where:"白昼",pace:"deep",sceneTitle:"了结 · 回去还账",text:[
"你回去了。",
"议事堂外，守卫拦住了你。你没有硬闯，把带来的东西放在地上，退后三步：“东西在这儿。要杀要剐，给个痛快。”",
"堂门开了。老执事——或者都尉、李管事、扎克，看你的人——走出来，看着地上的东西，看了很久。",
"他最终没有让人动手。“东西还回来，账就清一半。”他抬头看你，“剩下的一半，你拿命去还，还是拿日子去还？”", "出了议事堂外，风迎面扑来。你认了认方向，启程。"],options:[
{t:"（拿命去还：替原阵营办一件最险的事）",effects:{xp:40,hp:-20,flag:"traitor_pay_life"},go:"faction_traitor_4"},
{t:"（拿日子去还：留在原阵营，做最苦的活）",effects:{xp:25,flag:"traitor_pay_days"},go:"faction_traitor_4"}
]};

N["faction_traitor_4"]={tags:["faction:war"],tag:"main",place:"大陆 · 各处",where:"白昼",pace:"normal",sceneTitle:"流亡 · 名声的代价",text:[
"背叛的代价，你一分一分地尝完了。",
"名字没了，声望没了，从前那些笑脸也没了。你走在路上，有人认得你，远远地啐一口。",
"可你还活着。夜里躺在野地里看星星的时候，你想明白了一件事：名声是别人给的，日子是自己过的。只要心里那杆秤还在，就还能从头再来。",
"你把腰间那块旧军牌解下来，扔进河里。水花溅起又落下，牌子沉了底。你站起来，拍了拍身上的土，朝前走去。", "你收拾停当，离开各处，沿着来路踏上行程。"],options:[
{t:"（带着一身旧账，重新开始）",effects:{xp:20,flag:"traitor_done"},go:"warphase_14"}
]};
