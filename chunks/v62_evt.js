/* /v62inj:chunk-evt/ 事件池分片（自动生成，勿手改） */
(function(){
  var nodes = {};
  nodes["evt_rockfall_retreat"] = function(){return{
place:"事件·落石",
text:["前方传来沉闷的轰响，紧接着，碎石从山壁上方滚落下来，扬起一片烟尘。你脚下的地面都在微微震颤。", "你来不及多想，侧身闪进一块突出的岩壁下。几块拳头大的石头擦着你的身侧砸在地上，溅起碎石屑。", "烟尘散去后，你发现前方的路被一块巨石堵住了大半。这条路，走不通了。", "你检查了一下自己——没有受伤，只是衣服上沾了些灰。你拍了拍身上的土，绕道而行。落石是山神的脾气，而赶路人，从来都只能顺着它的脾气走。", "山石滚落的时候，你带着队伍，退了。退得不算狼狈，但也不体面。", "你是在前面探路的。你听见，头顶有动静——你抬头，看见几块碎石，正顺着坡，滚下来。你喊了一声：「退！」", "你们退到安全的地方，回头，看着那片山坡。轰隆隆的，一阵响，大块的山石，跟着滚了下来，扬起一片尘土。", "有人问你：「还走吗？」你看着那片尘土，想了很久：「绕路。」你说，「命，比时间值钱。」", "你们绕了一个大圈，多走了半天。扎营的时候，有人嘟囔了一句：「白走了半天。」你没有接话。你看着天上的星星，觉得，多走半天，挺好的。"] /*v45inj:evt_rockfall_retreat*/,
options:[
{t:"绕道而行", go:"world_continue"},
{t:"就地休整", go:"act_rest"}
]
}};


  nodes["evt_rockfall_trigger"] = function(){return{place:"山道",where:"午后",text:function(){
  var t=[];
  t.push("山道很窄。左边是峭壁，右边是深渊。");
  t.push("你走得很小心，每一步都踩实了再迈下一步。山里很静，只有风吹过岩石的呜呜声，和你自己的脚步声。");
  t.push("然后你听到了——不对劲的声音。");
  t.push("不是风。是石头摩擦石头的声音。从头顶传来的。");
  t.push("你猛地抬头。峭壁上，一块脸盆大的石头正在松动，碎石簌簌往下掉。");
  t.push("要落石了。");
  return t;
},options:[
  {t:"纵身跃出落石区",check:{a:"AGI",sk:"athletic",label:"闪避"},go:"evt_rockfall_check",fail:"evt_rockfall_fail"},
  {t:"贴紧峭壁，等落石过去",check:{a:"STR",sk:"athletic",label:"体魄"},go:"evt_rockfall_hug",fail:"evt_rockfall_fail"},
  {t:"往回跑，退出危险区",check:{a:"AGI",sk:"stealth",label:"敏捷"},go:"evt_rockfall_retreat",fail:"evt_rockfall_fail"}
]}};


  nodes["evt_rockfall_check"] = function(){return{place:"山道",text:function(){
  var t=[];
  t.push("你蹬地，纵身跃出。");
  t.push("身体在空中的那一瞬，你听到了身后的巨响——轰隆！石头砸在你刚才站的位置，碎石四溅。");
  t.push("你落地，打了个滚，卸掉冲力。站起来的时候，膝盖在发抖，但人没事。");
  t.push("你回头看。落石区已经被碎石覆盖了，如果慢半拍——你不敢想。");
  t.push("山风还在吹。你拍了拍身上的灰，继续往前走。经过这件事，你对山路的危险有了更深的体会。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,fatigue:1,xp:15,flag:"evt_rockfall_survived"}},
  {t:"在安全处歇一会儿",go:"travel_resolve",effect:{time:1,fatigue:1,xp:15,hp:5}}
]}};


  nodes["evt_rockfall_hug"] = function(){return{place:"山道",text:function(){
  var t=[];
  t.push("你贴紧峭壁，双手抠住岩石的缝隙，把身体压成一张纸。");
  t.push("石头从你面前滚落，擦着你的鼻尖飞过去。你能感受到石头带起的风，和碎石打在脸上的刺痛。");
  t.push("轰隆声持续了十几秒。然后——安静了。");
  t.push("你慢慢松开手，从峭壁上滑下来。后背全是冷汗，但人没事。脸上被碎石划了几道小口子，不严重。");
  t.push("你深吸一口气。这种事，经历一次就够了。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,fatigue:1,hp:-3,flag:"evt_rockfall_survived"}}
]}};


  nodes["evt_rockfall_fail"] = function(){return{place:"山道",text:function(){
  var t=[];
  t.push("你慢了一步。");
  t.push("一块碎石砸中了你的腿。你踉跄着往前扑，勉强逃出了落石区，但腿已经使不上劲了。");
  t.push("你坐在地上，卷起裤腿。小腿肿了一大块，青紫青紫的。动一下就钻心地疼。");
  t.push("你从包里翻出绷带，简单包扎了一下。还好不是骨折，但接下来的路，有的受了。");
  t.push("你咬着牙站起来，一瘸一拐地继续走。山里的风似乎更冷了。");
  return t;
},options:[
  {t:"忍着疼继续赶路",go:"travel_resolve",effect:{time:2,hp:-15,fatigue:2,wound:"腿伤",flag:"evt_rockfall_injured"}},
  {t:"找个地方休息一天再走",go:"travel_resolve",effect:{time:2,hp:-8,fatigue:1,wound:"腿伤"}}
]}};


  nodes["evt_blizzard_trigger"] = function(){return{place:"山口",where:"黄昏",text:function(){
  var t=[];
  t.push("天说变就变。");
  t.push("刚才还好好的，突然就阴了。风里开始夹着雪粒，打在脸上生疼。");
  t.push("你站在山口，往前看是白茫茫的一片，往后看也是。雪越下越大，能见度不到十米。");
  t.push("你知道这种天气——在山里，暴风雪是会死人的。");
  t.push("你必须做出选择。");
  return t;
},options:[
  {t:"顶着风雪强行过山",check:{a:"CON",sk:"survival",label:"生存"},go:"evt_blizzard_push",fail:"evt_blizzard_lost"},
  {t:"找个背风处扎营，等雪停",check:{a:"INT",sk:"survival",label:"生存"},go:"evt_blizzard_camp",fail:"evt_blizzard_cold"},
  {t:"原路返回，等天气好转",go:"evt_blizzard_return",effect:{time:1}}
]}};


  nodes["evt_blizzard_push"] = function(){return{place:"暴风雪中",text:function(){
  var t=[];
  t.push("你用围巾遮住口鼻，低着头，一步一步往前挪。");
  t.push("风雪像刀子一样割在脸上。你几乎睁不开眼，只能凭着感觉往前走。脚下的雪越来越深，每一步都要费很大的劲才能拔出来。");
  t.push("不知道走了多久——也许是一个时辰，也许是三个。你终于看到了山口的轮廓。");
  t.push("你走出了暴风雪。");
  t.push("山的另一边，天是晴的。你回头看，身后的山口还在咆哮，但你已经出来了。");
  t.push("你靠在一块石头上，大口喘气。手脚都冻僵了，但你活着。");
  return t;
},options:[
  {t:"活动一下手脚，继续赶路",go:"travel_resolve",effect:{time:1,fatigue:3,hp:-5,xp:20,flag:"evt_blizzard_survived"}},
  {t:"生堆火，暖和一下再走",go:"travel_resolve",effect:{time:2,fatigue:2,hp:5,gold:-3}}
]}};


  nodes["evt_blizzard_lost"] = function(){return{place:"暴风雪中",text:function(){
  var t=[];
  t.push("你迷路了。");
  t.push("风雪太大，你根本分不清方向。走了半天，你发现自己在原地转圈——脚印绕了一圈又回到了原点。");
  t.push("干粮快吃完了。水也喝完了——你只能抓把雪塞进嘴里，等它融化。");
  t.push("第二天，雪终于停了。你找到了方向，但两天的路白走了，人也冻得半死。");
  t.push("你清点了一下物资：干粮少了一半，钱袋里的钱在慌乱中掉了几个，手指冻得发紫。");
  t.push("但至少——你还活着。");
  return t;
},options:[
  {t:"重新出发",go:"travel_resolve",effect:{time:3,hp:-12,fatigue:4,gold:-5,flag:"evt_blizzard_lost"}}
]}};


  nodes["evt_blizzard_camp"] = function(){return{place:"背风处",text:function(){
  var t=[];
  t.push("你找到了一处背风的岩壁，在下面搭了个简易的庇护所。");
  t.push("生了堆火——虽然湿柴很难点，但你有火石，费了半天劲终于点着了。火光照着岩壁，暖洋洋的。");
  t.push("你靠在火边，吃了点干粮，喝了口热水。风雪在外面咆哮，但庇护所里很安静。");
  t.push("你睡了一觉。醒来的时候，雪停了。");
  t.push("你收拾好东西，继续上路。虽然耽误了一天，但人精神饱满。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:2,fatigue:-1,hp:5,gold:-3,flag:"evt_blizzard_camped"}}
]}};


  nodes["evt_blizzard_cold"] = function(){return{place:"背风处",text:function(){
  var t=[];
  t.push("你找了个背风处，但——火没生起来。");
  t.push("柴太湿了，火石打了半天，只冒了点烟。你缩在岩壁下面，用毯子把自己裹紧，但还是冷。");
  t.push("那一夜，你几乎没睡。手脚冻得生疼，后来就麻了。你只能不停地搓手跺脚，让血液流动。");
  t.push("天亮的时候，雪停了。你站起来，发现手脚都生了冻疮，又痒又痛。");
  t.push("你咬着牙收拾东西，继续赶路。这一夜，你永远不会忘。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:2,hp:-8,fatigue:2,wound:"冻疮",flag:"evt_blizzard_frostbite"}}
]}};


  nodes["evt_blizzard_return"] = function(){return{place:"山脚下",text:function(){
  var t=[];
  t.push("你决定不冒险。");
  t.push("原路返回，在山脚下的小镇找了家客栈住下。客栈老板是个热心的矮人，给你端了热汤和面包。");
  t.push("「这种天气，」他说，「过山就是找死。等两天吧，雪停了再走。」");
  t.push("你在客栈待了两天。第三天，天放晴了。你结了房钱，重新出发。");
  t.push("虽然耽误了时间，但你养足了精神，而且——从客栈老板那里听到了不少山里的传闻。");
  return t;
},options:[
  {t:"重新出发",go:"travel_resolve",effect:{time:3,fatigue:-2,hp:10,gold:-8,xp:10,flag:"evt_blizzard_waited"}}
]}};


  nodes["evt_fugitive_trigger"] = function(){return{place:"林间小路",where:"傍晚",text:function(){
  var t=[];
  t.push("你走在林间小路上，突然——灌木丛里冲出来一个人。");
  t.push("是个男人，浑身是血，衣服破破烂烂的。他看到你，眼睛一亮，踉跄着跑过来，扑通一声跪下。");
  t.push("「求求你……救救我……」他的声音很虚弱，「有人在追我……他们要杀了我……」");
  t.push("你往他身后看。林子里，隐约有火把的光在晃动。还有人声——在喊什么。");
  t.push("你只有几秒钟的时间做决定。");
  return t;
},options:[
  {t:"帮他——给他包扎，给他指条活路",check:{a:"CHA",sk:"medicine",label:"医术"},go:"evt_fugitive_help",fail:"evt_fugitive_help_fail"},
  {t:"拒绝——你不想惹麻烦",go:"evt_fugitive_refuse",effect:{time:1}},
  {t:"抓住他，交给追他的人",check:{a:"STR",sk:"martial",label:"武技"},go:"evt_fugitive_capture",fail:"evt_fugitive_escape"}
]}};


  nodes["evt_fugitive_help"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("你蹲下来，快速检查他的伤口。刀伤，在腰侧，不算太深，但流血很多。");
  t.push("你从包里翻出绷带和草药，迅速给他包扎。他咬着牙，一声不吭，但额头上全是冷汗。");
  t.push("「往那边走。」你指了指林子深处的一条小路，「走半个时辰，有个猎户的小屋。你可以在那里躲几天。」");
  t.push("他感激地看着你。「谢谢……谢谢你。」他从怀里掏出一枚徽章，塞给你，「这个……给你。以后如果遇到麻烦，拿着它去自由城邦的『银鹰酒馆』，会有人帮你的。」");
  t.push("然后他站起来，踉跄着跑进了林子。");
  t.push("几分钟后，几个穿着骑士团制服的人追了过来。「你看到一个受伤的男人了吗？」");
  return t;
},options:[
  {t:"说没看到",check:{a:"CHA",sk:"persu",label:"说服"},go:"evt_fugitive_lie",fail:"evt_fugitive_suspected"},
  {t:"说看到了，往另一个方向跑了",check:{a:"CHA",sk:"persu",label:"说服"},go:"evt_fugitive_misdirect",fail:"evt_fugitive_suspected"}
]}};


  nodes["evt_fugitive_lie"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("「没看到。」你面不改色地说。");
  t.push("骑士团的人上下打量了你一番，然后点了点头。「打扰了。」他们转身，继续往另一个方向追去。");
  t.push("你松了一口气。");
  t.push("你低头看了看手里的徽章。银质的，上面刻着一只展翅的鹰。你不知道这是什么组织的标记，但——以后总会知道的。");
  t.push("你把徽章收好，继续赶路。心里有一种奇怪的感觉——你刚才做了一件好事，但也可能——惹上了一个大麻烦。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,karma:3,item:"银鹰徽章",flag:"helped_fugitive",flag2:"silver_eagle_contact"}}
]}};


  nodes["evt_fugitive_misdirect"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("「看到了。」你说，「他往东边跑了，浑身是血，跑得很快。」");
  t.push("骑士团的人道了声谢，急匆匆地往东追去。你看着他们的背影消失在林子里，然后松了口气。");
  t.push("你低头看了看手里的徽章。银鹰。你不知道这意味着什么，但那个逃犯的眼神——不像是个坏人。");
  t.push("也许有一天，你会知道真相。也许不会。但至少今天，你救了一个人。");
  t.push("你把徽章收好，继续赶路。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,karma:3,item:"银鹰徽章",flag:"helped_fugitive",flag2:"silver_eagle_contact"}}
]}};


  nodes["evt_fugitive_suspected"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("骑士团的人盯着你看了很久。");
  t.push("「你确定？」为首的那个说，「我们追踪他的血迹，就到这里。」");
  t.push("「也许他往别的方向跑了。」你尽量让自己的声音听起来平静。");
  t.push("他又看了你一会儿，然后哼了一声。「走吧。」他带着人继续往前搜，但你注意到——他留了一个人在后面，盯着你。");
  t.push("你被监视了。接下来的路，你得小心点。");
  t.push("不过至少——那个逃犯安全了。");
  return t;
},options:[
  {t:"甩掉跟踪的人，继续赶路",go:"travel_resolve",effect:{time:2,karma:2,item:"银鹰徽章",flag:"helped_fugitive",flag2:"knights_suspicious"}},
  {t:"和跟踪的人对峙",check:{a:"CHA",sk:"intimidate",label:"威吓"},go:"travel_resolve",fail:"travel_resolve",effect:{time:1,karma:1}}
]}};


  nodes["evt_fugitive_help_fail"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("你手忙脚乱地给他包扎，但——伤口比你想象的深。血止不住。");
  t.push("他的脸色越来越苍白。「没事……」他虚弱地笑了笑，「我这辈子……欠的债太多了……今天该还了……」");
  t.push("他从怀里掏出一枚徽章，塞给你。「拿着……去银鹰酒馆……告诉他们……老灰……死了……」");
  t.push("然后他的手垂了下去。");
  t.push("你愣在原地。一个人死在你面前，而你——没能救他。");
  t.push("追他的人越来越近了。你必须做出选择。");
  return t;
},options:[
  {t:"拿走徽章，离开这里",go:"travel_resolve",effect:{time:1,karma:1,san:-5,item:"银鹰徽章",flag:"fugitive_died",flag2:"silver_eagle_contact"}},
  {t:"留下来，告诉追他的人他死了",go:"travel_resolve",effect:{time:2,karma:2,san:-3,flag:"fugitive_died"}}
]}};


  nodes["evt_fugitive_refuse"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("「抱歉。」你说，「我帮不了你。」");
  t.push("他看着你，眼神里有失望，但没有怨恨。「我理解……」他说，「没人想惹麻烦。」");
  t.push("他挣扎着站起来，踉跄着跑进了林子。你站在原地，看着他的背影消失。");
  t.push("几分钟后，骑士团的人追了过来。「你看到一个受伤的男人了吗？」");
  t.push("你指了指他跑的方向。骑士团的人道了声谢，追了上去。");
  t.push("你继续赶路。但心里——有些不是滋味。你不知道他最后怎么样了。也许活下来了，也许没有。");
  t.push("但那是他的命，不是你的。你这样告诉自己。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,karma:-2,san:-2,flag:"refused_fugitive"}}
]}};


  nodes["evt_fugitive_capture"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("你冲上去，一把按住了他。");
  t.push("他太虚弱了，根本无力反抗。你把他的手反绑在背后，等追他的人过来。");
  t.push("骑士团的人赶到了。为首的那个看了看你，又看了看被绑的逃犯，点了点头。「干得好。这个人是教会通缉的要犯。」");
  t.push("他从钱袋里掏出几个金龙，递给你。「这是赏金。」");
  t.push("你接过钱。逃犯被架起来带走的时候，回头看了你一眼。那个眼神——你说不上来是什么。不是恨，也不是怨。像是——理解。");
  t.push("你握着手里的金龙，站在原地。风从林子里吹过来，带着血腥味。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,gold:20,karma:-3,church_rep:5,flag:"captured_fugitive"}}
]}};


  nodes["evt_fugitive_escape"] = function(){return{place:"林间小路",text:function(){
  var t=[];
  t.push("你冲上去想抓住他，但——他比你想象的灵活。");
  t.push("他侧身一闪，你扑了个空。然后他一脚踹在你膝盖上，你跪了下去。");
  t.push("「对不住了。」他说，然后转身跑进了林子。");
  t.push("你站起来的时候，骑士团的人刚好赶到。「人呢？」");
  t.push("「跑了。」你揉着膝盖说。");
  t.push("为首的骑士皱了皱眉，但没说什么，带着人追了上去。你站在原地，膝盖还在疼。");
  t.push("赏金没拿到，还挨了一脚。今天真是倒霉。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,hp:-5,karma:-1,flag:"fugitive_escaped"}}
]}};


  nodes["evt_elder_trigger"] = function(){return{place:"岔路口",where:"正午",text:function(){
  var t=[];
  t.push("岔路口的石头上，坐着一个老者。");
  t.push("白胡子，白眉毛，穿着一件洗得发白的灰袍。他闭着眼睛，像是在晒太阳，又像是在——等什么人。");
  t.push("你经过的时候，他突然开口了。");
  t.push("「年轻人。」他的声音很平静，像是从很远的地方传来的，「过来坐。」");
  t.push("你愣了一下。你不认识他，但——他的声音里有一种奇怪的力量，让你不由自主地走了过去。");
  return t;
},options:[
  {t:"坐下来，听他说什么",go:"evt_elder_listen",effect:{time:1}},
  {t:"礼貌地拒绝，继续赶路",go:"evt_elder_refuse",effect:{time:1}},
  {t:"警惕地观察他",check:{a:"INT",sk:"detect",label:"侦查"},go:"evt_elder_observe",fail:"evt_elder_listen"}
]}};


  nodes["evt_elder_listen"] = function(){return{place:"岔路口",text:function(){
  var t=[];
  t.push("你在他对面坐下。");
  t.push("他睁开眼睛。你愣住了——他的眼睛是全白的，没有瞳孔。是个盲人。");
  t.push("「我等了你很久。」他说，「或者说——等了一个像你这样的人。」");
  t.push("「你是谁？」");
  t.push("「一个活了太久的人。」他笑了笑，「久到已经忘了自己的名字。但我记得一些事——关于这个大陆的真相。关于七印。关于黄林晶。」");
  t.push("你的心跳漏了一拍。「你知道七印？」");
  t.push("「我知道的比你想象的多。」他从怀里掏出一枚古币，放在你面前的石头上，「这个给你。上面刻着第一道印的坐标——不，不是坐标，是『钥匙』。当你走到铁门关的时候，你会用到它。」");
  t.push("然后他站起来，拍了拍袍子上的灰。「时候到了，我该走了。」");
  return t;
},options:[
  {t:"问他更多关于七印的事",check:{a:"CHA",sk:"persu",label:"说服"},go:"evt_elder_more",fail:"evt_elder_leave"},
  {t:"拿起古币，谢过他",go:"evt_elder_leave",effect:{time:1,item:"神秘古币",xp:30,flag:"mysterious_elder",flag2:"seal1_key"}}
]}};


  nodes["evt_elder_more"] = function(){return{place:"岔路口",text:function(){
  var t=[];
  t.push("「七印不是封印。」老者说，「是枷锁。黄林晶用七道枷锁，把原初之物分成了七份，分别锁在大陆的七个地方。」");
  t.push("「但枷锁不是永久的。时间越长，枷锁越松。现在——第一道已经碎了，第二道在松动。剩下的五道，也撑不了多久了。」");
  t.push("「那怎么办？」");
  t.push("「修复枷锁，或者——打碎所有枷锁，让原初之物重归一体。」他的声音很轻，「前者是维持现状，后者是——赌一把。」");
  t.push("「赌什么？」");
  t.push("「赌原初之物不是怪物。」他看着你——虽然他看不见，但你觉得他在『看』你，「赌它们是宇宙的一部分，是——情感本身。」");
  t.push("然后他笑了。「好了，说太多了。你自己去看吧。」");
  return t;
},options:[
  {t:"拿起古币，告别老者",go:"evt_elder_leave",effect:{time:1,item:"神秘古币",xp:50,san:-5,flag:"mysterious_elder",flag2:"seal_truth_hint",flag3:"seal1_key"}}
]}};


  nodes["evt_elder_observe"] = function(){return{place:"岔路口",text:function(){
  var t=[];
  t.push("你没有立刻过去，而是站在远处观察他。");
  t.push("他的袍子很旧，但很干净。手指修长，指甲修剪得整整齐齐——不像是普通的流浪者。他的呼吸很均匀，很慢——像是某种高深的吐纳法。");
  t.push("然后你注意到了——他的影子。");
  t.push("正午的太阳下，他应该有影子。但——他没有。石头上只有他坐着的痕迹，没有影子。");
  t.push("你倒吸一口凉气。这个人——不是普通人。");
  t.push("「看够了？」他突然说，声音里带着笑意，「过来吧。我不会害你。」");
  return t;
},options:[
  {t:"走过去，听他说",go:"evt_elder_listen",effect:{time:1,flag:"elder_no_shadow"}},
  {t:"转身就跑",go:"travel_resolve",effect:{time:1,san:-3,flag:"elder_fled"}}
]}};


  nodes["evt_elder_refuse"] = function(){return{place:"岔路口",text:function(){
  var t=[];
  t.push("「抱歉，我赶时间。」你说。");
  t.push("他笑了笑。「没关系。该遇到的，总会遇到。」");
  t.push("你继续赶路。走了大约半个时辰，你突然觉得——好像忘了什么重要的事。");
  t.push("你回头看。岔路口空空荡荡的，那个老者已经不见了。石头上——什么都没有。好像他从来没有存在过一样。");
  t.push("你揉了揉眼睛。是幻觉吗？还是——真的遇到了什么？");
  t.push("你摇摇头，继续赶路。但那个老者的声音，一直在你脑海里回响。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,san:-2,flag:"elder_refused"}}
]}};


  nodes["evt_elder_leave"] = function(){return{place:"岔路口",text:function(){
  var t=[];
  t.push("你拿起古币。");
  t.push("古币很旧，铜质的，上面刻着奇怪的符号。你翻到背面——上面刻着一个数字：『壹』。");
  t.push("你抬头想再问他什么——但他已经不见了。");
  t.push("不是走了，是——消失了。就像从来没有存在过一样。石头上干干净净，连坐过的痕迹都没有。");
  t.push("你握着古币，站在原地。风从岔路口吹过，带着远方的气息。");
  t.push("你不知道这个老者是谁，也不知道他为什么给你这枚古币。但你有一种预感——这枚古币，会在未来的某一天，救你的命。");
  t.push("你把古币收好，继续赶路。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,item:"神秘古币",xp:30,flag:"mysterious_elder"}}
]}};


  nodes["evt_battlefield_trigger"] = function(){return{place:"荒野",where:"黄昏",text:function(){
  var t=[];
  t.push("你走到了一片荒地。");
  t.push("地上到处都是锈迹斑斑的兵器和铠甲碎片。有的还能看出形状——剑、盾、头盔，有的已经烂得不成样子了。");
  t.push("风从荒地上吹过，带着一股——说不上来的味道。像是铁锈，又像是——血。");
  t.push("你认出了这个地方。这是古战场——三百年前，自由城邦和北方公国在这里打了一场大仗，死了上万人。");
  t.push("当地人说，这里晚上会闹鬼。但现在是白天，应该——没事吧？");
  return t;
},options:[
  {t:"进去翻找，看有没有值钱的东西",check:{a:"INT",sk:"detect",label:"侦查"},go:"evt_battlefield_search",fail:"evt_battlefield_curse"},
  {t:"绕过去，不碰这些东西",go:"evt_battlefield_avoid",effect:{time:1}},
  {t:"在战场边缘默哀，然后离开",go:"evt_battlefield_mourn",effect:{time:1,karma:2}}
]}};


  nodes["evt_battlefield_search"] = function(){return{place:"古战场",text:function(){
  var t=[];
  t.push("你走进了古战场。");
  t.push("地上的东西比你想象的多。你翻找了一会儿，在一堆铠甲碎片下面，找到了一把短剑。");
  t.push("剑虽然锈了，但剑格上的宝石还在——一颗小指头大的红宝石，在夕阳下闪着光。");
  t.push("你把宝石抠下来，又找了一会儿，找到了几枚古币和一个还算完整的头盔。");
  t.push("这些东西，拿到城里应该能卖个好价钱。");
  t.push("你把东西装进包里，准备离开。但就在你转身的时候——你听到了一个声音。");
  t.push("很轻，像是有人在叹气。从地底下传来的。");
  return t;
},options:[
  {t:"不管它，赶紧离开",go:"travel_resolve",effect:{time:1,gold:15,item:"红宝石",item2:"古剑",flag:"battlefield_loot"}},
  {t:"停下来，仔细听",check:{a:"SPR",sk:"will",label:"意志"},go:"evt_battlefield_voice",fail:"evt_battlefield_curse"}]}};


  nodes["evt_battlefield_voice"] = function(){return{place:"古战场",text:function(){
  var t=[];
  t.push("你停下来，仔细听。");
  t.push("那个声音又响了。不是叹气——是说话。很轻，很远，像是从很深很深的地下传来的。");
  t.push("「……为什么……战争……」");
  t.push("你浑身一激灵。这是——亡灵的低语？");
  t.push("你握紧了武器，环顾四周。荒地上空空荡荡的，什么都没有。但那个声音还在继续。");
  t.push("「……死了……都死了……为什么……」");
  t.push("你深吸一口气。这是古战场的怨念——三百年了，还没有消散。");
  t.push("你闭上眼睛，在心里默念：「安息吧。战争已经结束了。」");
  t.push("那个声音停了。然后——你感到一阵微风拂过脸颊，像是有人在感谢你。");
  return t;
},options:[
  {t:"离开古战场",go:"travel_resolve",effect:{time:1,gold:15,item:"红宝石",san:5,karma:3,flag:"battlefield_ghost_peace"}}
]}};


  nodes["evt_battlefield_curse"] = function(){return{place:"古战场",text:function(){
  var t=[];
  t.push("你在古战场里翻找了半天，什么值钱的都没找到——倒是被一把锈剑划破了手。");
  t.push("你包扎了一下，准备离开。但就在你走出古战场的时候——你感到一阵寒意。");
  t.push("从后背窜上来的寒意。你回头看——什么都没有。但你总觉得，有什么东西在跟着你。");
  t.push("接下来的几天，你总是做噩梦。梦到古战场，梦到死人，梦到——你自己也躺在那些尸体中间。");
  t.push("你知道，你被古战场的怨念缠上了。需要找个牧师或者萨满净化一下。");
  t.push("但至少——你还活着。");
  return t;
},options:[
  {t:"继续赶路，找机会净化",go:"travel_resolve",effect:{time:1,hp:-5,san:-8,flag:"battlefield_cursed",wound:"怨念缠身"}}
]}};


  nodes["evt_battlefield_avoid"] = function(){return{place:"古战场边缘",text:function(){
  var t=[];
  t.push("你决定绕过去。");
  t.push("死人的东西，不碰为妙。这是老人们常说的话。");
  t.push("你绕了一个大圈，多走了半个时辰，但心里踏实。");
  t.push("走在路上，你回头看了一眼古战场。夕阳下，那些锈迹斑斑的兵器闪着暗红色的光，像是在——提醒你什么。");
  t.push("你摇了摇头，继续赶路。");
  return t;
},options:[
  {t:"继续赶路",go:"travel_resolve",effect:{time:1,fatigue:1,karma:1}}
]}};


  nodes["evt_battlefield_mourn"] = function(){return{place:"古战场边缘",text:function(){
  var t=[];
  t.push("你在古战场边缘站定，闭上眼睛，默哀了一分钟。");
  t.push("三百年前，上万人在这里死去。他们有家人，有朋友，有梦想。但一场战争，把一切都带走了。");
  t.push("你不知道他们是哪一方的，也不知道这场战争是为了什么。但你知道——他们都是人。和你一样的人。");
  t.push("默哀完毕，你睁开眼睛。");
  t.push("然后你看到了——古战场的中央，有什么东西在发光。很微弱，像是萤火虫的光。");
  t.push("你走过去，发现是一枚徽章。铁质的，锈得很厉害，但上面的图案还能辨认——一朵玫瑰。");
  t.push("你把它捡起来。徽章入手的一瞬间，你感到一阵温暖。像是——有人在感谢你。");
  return t;
},options:[
  {t:"收好徽章，继续赶路",go:"travel_resolve",effect:{time:1,karma:5,san:5,item:"玫瑰徽章",flag:"battlefield_blessed"}}
]}};


  Object.assign(window.N || {}, nodes);
  if (window.v62_chunk_loader) window.v62_chunk_loader.mark("evt");
})();
