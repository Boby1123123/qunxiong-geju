/* 艾尔达大陆·群雄割据 v42 分片：story_system（由 elda chunks 自动生成，勿手改） */
N["evt_rockfall_retreat"] = function(){return{
place:"事件·落石",
text:["前方传来沉闷的轰响，紧接着，碎石从山壁上方滚落下来，扬起一片烟尘。你脚下的地面都在微微震颤。", "你来不及多想，侧身闪进一块突出的岩壁下。几块拳头大的石头擦着你的身侧砸在地上，溅起碎石屑。", "烟尘散去后，你发现前方的路被一块巨石堵住了大半。这条路，走不通了。", "你检查了一下自己——没有受伤，只是衣服上沾了些灰。你拍了拍身上的土，绕道而行。落石是山神的脾气，而赶路人，从来都只能顺着它的脾气走。", "山石滚落的时候，你带着队伍，退了。退得不算狼狈，但也不体面。", "你是在前面探路的。你听见，头顶有动静——你抬头，看见几块碎石，正顺着坡，滚下来。你喊了一声：「退！」", "你们退到安全的地方，回头，看着那片山坡。轰隆隆的，一阵响，大块的山石，跟着滚了下来，扬起一片尘土。", "有人问你：「还走吗？」你看着那片尘土，想了很久：「绕路。」你说，「命，比时间值钱。」", "你们绕了一个大圈，多走了半天。扎营的时候，有人嘟囔了一句：「白走了半天。」你没有接话。你看着天上的星星，觉得，多走半天，挺好的。"] /*v45inj:evt_rockfall_retreat*/,
options:[
{t:"绕道而行", go:"world_continue"},
{t:"就地休整", go:"act_rest"}
]
}};


  

N["evt_rockfall_trigger"] = function(){return{place:"山道",where:"午后",text:function(){
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


  

N["evt_rockfall_check"] = function(){return{place:"山道",text:function(){
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


  

N["evt_rockfall_hug"] = function(){return{place:"山道",text:function(){
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


  

N["evt_rockfall_fail"] = function(){return{place:"山道",text:function(){
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


  

N["evt_blizzard_trigger"] = function(){return{place:"山口",where:"黄昏",text:function(){
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


  

N["evt_blizzard_push"] = function(){return{place:"暴风雪中",text:function(){
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


  

N["evt_blizzard_lost"] = function(){return{place:"暴风雪中",text:function(){
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


  

N["evt_blizzard_camp"] = function(){return{place:"背风处",text:function(){
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


  

N["evt_blizzard_cold"] = function(){return{place:"背风处",text:function(){
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


  

N["evt_blizzard_return"] = function(){return{place:"山脚下",text:function(){
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


  

N["evt_fugitive_trigger"] = function(){return{place:"林间小路",where:"傍晚",text:function(){
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


  

N["evt_fugitive_help"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_lie"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_misdirect"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_suspected"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_help_fail"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_refuse"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_capture"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_fugitive_escape"] = function(){return{place:"林间小路",text:function(){
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


  

N["evt_elder_trigger"] = function(){return{place:"岔路口",where:"正午",text:function(){
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


  

N["evt_elder_listen"] = function(){return{place:"岔路口",text:function(){
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


  

N["evt_elder_more"] = function(){return{place:"岔路口",text:function(){
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


  

N["evt_elder_observe"] = function(){return{place:"岔路口",text:function(){
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


  

N["evt_elder_refuse"] = function(){return{place:"岔路口",text:function(){
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


  

N["evt_elder_leave"] = function(){return{place:"岔路口",text:function(){
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


  

N["evt_battlefield_trigger"] = function(){return{place:"荒野",where:"黄昏",text:function(){
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


  

N["evt_battlefield_search"] = function(){return{place:"古战场",text:function(){
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


  

N["evt_battlefield_voice"] = function(){return{place:"古战场",text:function(){
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


  

N["evt_battlefield_curse"] = function(){return{place:"古战场",text:function(){
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


  

N["evt_battlefield_avoid"] = function(){return{place:"古战场边缘",text:function(){
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


  

N["evt_battlefield_mourn"] = function(){return{place:"古战场边缘",text:function(){
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


  

N["npc_aurelian_teahouse"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "茶馆在一条窄巷的尽头。门脸很小，挂着一块褪色的木牌，上面写着\"苦茶\"两个字。",
    "你推门进去时，铃铛响了一声。店里只有一个客人——坐在靠窗的位置，面前摆着一杯茶，茶面已经凉了。",
    "他抬起头看了你一眼。那眼神很奇怪，像在看你，又像在看你身后的什么东西。",
    "\"坐。\"他说，\"这位置阳光好。"
  ],
  options:[
    {t:"坐下，点一壶茶", effect:{gold:-2,time:1}, go:"npc_aurelian_chat"},
    {t:"你认识他——艾尔达里翁·埃翁", check:{a:"INT",sk:"lore",label:"认出身份"},
  tier:{
    crit:function(){return[pickV(["你在门口站了一瞬。那张脸，那双手，还有桌面上敲手指的节奏——你在学院的旧档案里见过。艾尔达里翁·埃翁，时空系天才，二十年前一夜之间销声匿迹。你没有声张，只是走过去，在他对面坐下，轻声说：'埃翁先生。'他的手指停了。'你认得我？'他的语气里没有惊讶，只有一种'终于来了'的平静。","你一眼就认出了他——不仅因为他的脸，还因为他面前那杯凉茶。茶面上浮着一层极薄的霜，那是时空系魔力外泄的痕迹。普通人看不出来，但你看得一清二楚。你走过去坐下：'埃翁先生，你的茶，凉得不太正常。'他看了你一眼，嘴角动了动：'多少年了，你是第一个看出来的。'"],"aurelian_rec_crit")]},
    ok:function(){return[pickV(["你认出了他。艾尔达里翁·埃翁——没落的王族后裔，据说在时空系魔法上有惊人的天赋。你走过去坐下。他似乎察觉到了你的目光：'你知道我？'","你觉得这个人很眼熟，想了一会儿，记起了他的名字——艾尔达里翁·埃翁。你走过去坐下。"],"aurelian_rec_ok")]},
    fail:function(){return[pickV(["你觉得这个人有点眼熟，但想不起来在哪里见过。你犹豫了一下，最终还是走过去坐下——不管他是谁，这茶馆只有这一个空位。他看了你一眼，没有说话。","你完全不认识他。只是觉得这茶馆的气氛有点怪。你找了个位置坐下。"],"aurelian_rec_fail")]},
    critfail:function(){return[pickV(["你盯着他看了太久，他察觉到了。'看什么？'他的语气冷了下来。你慌忙移开目光，找了个角落坐下。但你总觉得，从那以后，他一直在用余光盯着你。茶馆里的茶，更苦了。"],"aurelian_rec_cf")]}
  },
  onCrit:{flag:"aurelian_recognized_deep",aurelian_bond:5},
  onOk:{flag:"aurelian_recognized"},
  onFail:{},
  onCritFail:{aurelian_bond:-3,flag:"aurelian_suspicious"},
  go:"npc_aurelian_recognize"},
    {t:"不打扰，换个位置", go:"arrive_generic"}
  ]
};};


  

N["npc_aurelian_chat"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:["你们聊了一些有的没的。", "他说他年轻时在南边跑过船，见过海里的东西——「不是鱼。」他补了一句，又不说下去了。", "你说你来自交汇城。他哦了一声：「那地方，我熟。城底下埋着的东西，比城还老。」他看了你一眼，「你最好别去挖。」", "「为什么？」你问。", "「因为挖出来的，不一定是你想找的。」他端起茶杯，「也可能，是你想找的东西，不想被你找到。」", "他说完，自己笑了：「老了，说话绕。你别往心里去。」", "茶很苦。你喝了一口，眉头皱起来。", "他笑了一下，很浅。\"第一次喝都这样。喝多了，就尝出甜味来了。\"", "\"你是外地人？\"他问。没等你回答，他又说：\"从北边来的？铁门关那边的事，我听说了。\"", "他的手指在桌面上轻轻敲着，节奏很怪——像在数什么，又像在等什么。", "他给你续了一杯茶。茶是新的，可味道和刚才一样——他泡茶的功夫很稳，像练了很多年。", "「我年轻的时候，话比现在多。」他说，「后来发现，话说多了，容易把自己绕进去。」", "「现在呢？」你问。", "「现在我挑着说。」他说，「能说的说，不能说的，等它能说的那天再说。」", "你喝茶，他也喝茶。窗外的天色一点点暗下去。", "临别的时候，他叫住你：「小子。」你回头。他张了张嘴，又摆摆手：「算了。路上小心。」", "你走出门，回头看了一眼。他已经低下头，重新看他的茶了。你总觉得，他刚才想说的，不是「路上小心」。"] /*v45inj:npc_aurelian_chat*/,
  options:[
    {t:"问他在等什么", go:"npc_aurelian_waiting"},
    {t:"问他铁门关的事", go:"npc_aurelian_irongate"},
    {t:"喝完茶，告辞", go:"arrive_generic"}
  ]
};};


  

N["npc_aurelian_recognize"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "你认出了他。艾尔达里翁·埃翁——没落的王族后裔，据说在时空系魔法上有惊人的天赋。",
    "但那是很多年前的事了。现在的他，只是一个在茶馆里喝凉茶的人。",
    "他似乎察觉到了你的目光。\"你知道我？\"他问，语气里没有惊讶，只有一种淡淡的疲惫。",
    "\"知道我的人，要么是老人，要么是别有用心的人。你是哪一种？\""
  ],
  options:[
    {t:"\"我只是听过你的名字。\"", go:"npc_aurelian_chat"},
    {t:"\"我想知道，你为什么不再研究时空魔法了。\"", check:{a:"CHA",sk:"speech",label:"追问"},
  tier:{
    crit:function(){return[pickV(["你没有直接问原因，而是说：'我听说，二十年前的时空裂隙事件之后，所有相关的研究资料都被教会封存了。但我还听说，有一个人在那之后还在私下研究——直到他亲眼看到了什么。'他的手猛地攥紧了茶杯。'你知道得不少。'他的声音低了下来，'你想知道我看到了什么？'你点点头。他沉默了很久，然后说：'跟我来。'","你说：'埃翁先生，我不是来打听隐私的。我只是想知道——一个能在时空系上达到宗师境界的人，为什么会选择在茶馆里喝凉茶。这不合理。'他看了你很久，然后笑了——这次是真的笑了：'合理？你跟我谈合理？'他凑近了一些，'你知道时间的尽头是什么吗？'"],"aurelian_ask_crit")]},
    ok:function(){return[pickV(["你问他为什么不再研究时空魔法了。他的眼神变了。不是愤怒，是一种很深的、很旧的东西浮上来。'因为我看到了。'他说。","你问了那个问题。他沉默了一会儿，然后开始讲述。"],"aurelian_ask_ok")]},
    fail:function(){return[pickV(["你问得太直接了。他的脸色一沉：'这是我的事。与你无关。'茶馆里的气氛冷了下来。你意识到自己冒犯了他。","你的问题让他不舒服了。他端起茶，不再说话。"],"aurelian_ask_fail")]},
    critfail:function(){return[pickV(["你追问得太紧了，甚至提到了一些不该提到的细节——关于二十年前的那场事故，关于他的老师。他的手猛地拍在桌子上，茶杯跳了起来。'你是谁派来的？！'他的声音不大，但每个字都像冰锥，'教会？还是暗蚀会？'他站起身，丢下一块银币，转身就走。你再去找他的时候，茶馆里已经空了——连那杯凉茶都不见了。"],"aurelian_ask_cf")]}
  },
  onCrit:{aurelian_bond:8,flag:"aurelian_trust_deep"},
  onOk:{aurelian_bond:3},
  onFail:{aurelian_bond:-2},
  onCritFail:{aurelian_bond:-10,flag:"aurelian_angered",sanLoss:2},
  go:"npc_aurelian_secret"}
  ]
};};


  

N["npc_aurelian_waiting"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "他的手指停了。",
    "\"等一个时间。\"他说，\"不是几点几分的那种时间。是——\"他顿了顿，似乎在找一个合适的词，\"是一个节点。像河水里的漩涡，到了那个点，一切都会转一个方向。\"",
    "\"你不懂没关系。\"他端起凉茶，喝了一口，\"我自己也不一定懂。\"",
    "窗外的阳光移了一寸。他看了一眼，嘴角动了动，像在对谁微笑。"
  ],
  options:[
    {t:"\"那个节点什么时候到？\"", go:"npc_aurelian_node"},
    {t:"不再追问，换个话题", go:"npc_aurelian_chat"}
  ]
};};


  

N["npc_aurelian_node"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "他看了你很久。",
    "\"快了。\"他终于说，\"快到了。到时候，你会知道的——所有人都会知道。\"",
    "他站起身，从口袋里掏出一块旧怀表，放在桌上。怀表的指针停在三点十七分。",
    "\"如果我不在了，\"他说，\"把这个交给一个叫罗兰的人。他在北方。\"",
    "然后他走了。铃铛响了一声，茶香还在，人已经没了。"
  ],
  options:[
    {t:"收起怀表", effect:{item:"停摆的旧怀表",flag:"aurelian_watch"}, go:"arrive_generic"},
    {t:"追出去", check:{a:"AGI",sk:"stealth",label:"追踪"},
  tier:{
    crit:function(){return[pickV(["你追出茶馆的瞬间就注意到了——地上的脚印很淡，但方向明确。你没有直接跟，而是绕了一条平行的巷子，保持着距离。他走得不快，但路线很怪——三次拐弯，两次折返，像是在确认有没有人跟踪。你始终没有被发现。最后，他在一个十字路口停了下来，抬头看了看天，然后——消失了。不是走了，是真的消失了，像被空气吞没了一样。你走到那个位置，地上有一枚旧怀表，和他留给你的那块一模一样。","你追出去的时候，他已经走出了十几步。你没有急着靠近，而是远远地缀着。他的步伐很有特点——每走七步，会微微停顿一下，像是在数什么。你记住了这个节奏。在一个拐角处，他突然消失了。但你在地上发现了一样东西——一根银白色的头发，发梢泛着淡淡的蓝光。那是时空系魔力残留的痕迹。"],"aurelian_follow_crit")]},
    ok:function(){return[pickV(["你追出茶馆。巷子里空无一人。地上有一行脚印，很淡，朝着城门的方向。你跟着走了两条街，脚印在一个十字路口消失了。风卷着一片枯叶，从你脚边滚过去。","你追了出去，但很快就跟丢了。他走得太快了，或者说——他用了某种你不懂的方式离开了。"],"aurelian_follow_ok")]},
    fail:function(){return[pickV(["你追出茶馆，但巷子岔路太多，你选错了方向。等你反应过来，已经找不到他的踪迹了。你站在陌生的巷子里，手里攥着那块怀表，心里有些失落。","你追了，但跟丢了。巷子里人来人往，你根本分不清哪个是他。"],"aurelian_follow_fail")]},
    critfail:function(){return[pickV(["你追出茶馆，急匆匆地跑过两条街，撞上了一个路人。你道歉之后继续追，但等你再抬头，哪里还有他的影子。更糟的是，你回到茶馆的时候，发现他留给你的那块怀表不见了——大概是刚才撞人的时候被偷了。你站在空荡荡的茶馆里，心里空落落的。"],"aurelian_follow_cf")]}
  },
  onCrit:{flag:"aurelian_followed_deep",item:"时空残发",skillUp:"stealth"},
  onOk:{},
  onFail:{},
  onCritFail:{item_lose:"停摆的旧怀表",flag:"aurelian_watch_lost"},
  go:"npc_aurelian_follow"}
  ]
};};


  

N["npc_aurelian_follow"] = function(){ return {
  place:"自由城邦 · 街巷", where:"",
  text:["十字路口的风很急，把枯叶卷成一个旋。你站在原地，盯着那行消失的脚印，心里那点不甘，像被风吹旺的火。", "你蹲下来，摸了摸地面。脚印消失的地方，石板是凉的——不是普通的凉，是那种，像冰窖里捞出来的凉。", "你抬头看了一圈。茶馆的幌子在风里晃着，卖烟的小贩缩在墙角打盹，一切如常。可你知道，刚刚有个人，在这里凭空消失了。", "你摸了摸怀表。表壳的凉意贴着掌心，像在提醒你什么。", "你追出茶馆。巷子里空无一人。", "地上有一行脚印，很淡，朝着城门的方向。你跟着走了两条街，脚印在一个十字路口消失了——像那个人凭空蒸发了一样。", "风卷着一片枯叶，从你脚边滚过去。", "你握紧了手里的怀表。表壳很凉，像一块从很深的地方捞出来的石头。", "你沿着十字路口又绕了一圈，没有找到任何痕迹。那行脚印，就像从来没有存在过。", "你回到茶馆。掌柜的正在擦桌子，看见你回来，眼皮都没抬：「找着人了？」", "你摇了摇头。掌柜的哼了一声：「这城里，有些人不是你能追的。追上了，你也不知道该拿他怎么办。」", "你在他对面坐下，要了一碗茶。茶很烫，你端起来，透过热气看他：「那你告诉我，他是什么人？」", "掌柜的沉默了一会儿，压低声音：「我只能告诉你——他不是这城里的人。他是从『外面』进来的。而『外面』，比你想的要大，也要黑。」", "你放下茶碗，没有再问。可你知道，这件事，你记下了。"] /*v45inj:npc_aurelian_follow*/,
  options:[{t:"回到城里", go:"arrive_generic"}]
};};


  

N["npc_aurelian_secret"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "他的眼神变了。不是愤怒，是一种很深的、很旧的东西浮上来。",
    "\"因为我看到了。\"他说，声音很轻，\"我看到了时间的尽头。那里什么都没有——没有光，没有暗，连\"没有\"都不存在。\"",
    "\"你试过把一个杯子摔碎，再把它拼回去吗？拼回去的杯子，永远有裂痕。我就是那个杯子。\"",
    "他端起茶，手很稳。但你看见，他的指尖在微微发抖。"
  ],
  options:[
    {t:"\"裂痕里，有什么？\"", check:{a:"SPR",sk:"will",label:"承受真相"},
  tier:{
    crit:function(){return[pickV(["你问出那句话的时候，茶馆里的光线似乎暗了一瞬。他看着你，目光像两把刀，要剖开你的灵魂看看里面装着什么。但你没有退缩——你直视着他的眼睛，一字一句地说：'我想知道。不管那是什么。'他看了你很久，然后长长地吐出一口气：'你有一双不怕的眼睛。上一个有这种眼睛的人，是我老师。他死了。'他开始讲述——关于时间的尽头，关于深渊，关于那扇打开了就关不上的门。你听着，手心在出汗，但你没有打断他。讲完之后，他说：'你比我想象的坚强。'","你问出那句话之后，他的表情变了。他开始讲述一些极其可怕的事情——关于时间的本质，关于深渊的真相。每一个字都像一根针，扎进你的意识里。你感到头痛欲裂，眼前出现了幻觉——一片无边无际的黑暗，黑暗中有什么东西在蠕动。但你咬紧牙关，没有移开目光，也没有尖叫。等他讲完，你发现自己的衣服已经被汗水浸透了。'你撑过来了。'他说，语气里有一丝敬意，'很多人听到一半就疯了。'"],"aurelian_truth_crit")]},
    ok:function(){return[pickV(["你问了。他看着你，看了很久。'你有一双不怕的眼睛。'他说，然后开始讲述。关于时间的尽头，关于深渊。你听着，虽然有些地方让你头皮发麻，但你撑过来了。","你问了那个问题。他讲了一些很可怕的事情。你听完之后，沉默了很久。但你没有后悔。"],"aurelian_truth_ok")]},
    fail:function(){return[pickV(["你问了，但他讲到一半的时候，你实在撑不住了——那些关于深渊和时间尽头的描述，让你的意识开始模糊。你打断了他：'够了……别说了。'他停了下来，看着你，眼神里有失望，也有理解：'没关系。能听到这里，已经比大多数人强了。'但你知道，你错过了一些很重要的东西。","你听了一部分，但后面的内容太可怕了，你不得不移开目光。他注意到了，没有继续说下去。"],"aurelian_truth_fail")]},
    critfail:function(){return[pickV(["你问出那句话之后，他开始讲述。但那些内容太可怕了——时间的尽头，深渊的真相，还有一些你根本无法理解的东西。你的意识开始崩溃，眼前出现了幻觉：无数只眼睛在黑暗中睁开，盯着你看。你尖叫起来，打翻了茶杯，从椅子上摔了下去。等你恢复神智，你发现自己躺在茶馆的地板上，他站在你旁边，表情复杂：'我警告过你的。'你的头很痛，脑海里多了一些不属于你的记忆碎片——碎片里，有一扇门，门后是无尽的黑暗。从那以后，你经常做同一个噩梦。"],"aurelian_truth_cf")]}
  },
  onCrit:{aurelian_bond:10,sanLoss:2,flag:"aurelian_truth_fully_known",skillUp:"will"},
  onOk:{aurelian_bond:5,sanLoss:1,flag:"aurelian_truth_known"},
  onFail:{aurelian_bond:2,sanLoss:3},
  onCritFail:{aurelian_bond:-5,sanLoss:10,wound:"SAN创伤",flag:"aurelian_truth_trauma"},
  go:"npc_aurelian_truth"},
    {t:"\"对不起，我不该问。\"", go:"npc_aurelian_chat"}
  ]
};};


  

N["npc_aurelian_truth"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:["你在他对面坐下。他没有看你，只是低头看着自己面前那杯凉透的茶。", "「你老师，是怎么死的？」你问。", "他端起茶杯，又放下。杯子碰着桌面，发出一声很轻的响：「他打开了那扇门。门里没有他想找的东西——只有他自己。」", "他抬起头，第一次直视你的眼睛：「你也在找什么。对不对？」", "你没有回答。他替你回答了：「你不用说出来。每个走到这里的人，眼睛里都写着同一个问题。你们自己看不见。」", "他站起来，从怀里掏出一张纸，放在桌上：「这是我写的。最后一首。」纸上只有四行字，你扫了一眼，没看清，他就把纸推到你面前。", "「想看清，就留着。」他说，「不想看清，就烧了。它不咬人——到目前为止，它不咬人。」", "他看着你，看了很久。", "\"你有一双不怕的眼睛。\"他说，\"上一个有这种眼睛的人，是我老师。他死了。死在他自己打开的门里。\"", "\"裂痕里——\"他凑近了一些，声音压得更低，\"是深渊。不是比喻。是真的深渊。时间的尽头，和深渊是连着的。\"", "\"所以我不研究了。我喝茶。我等。我写诗然后烧掉。\"他靠回椅背，\"因为有些门，打开了就关不上。\"", "你把那张纸折好，收进怀里。他没有再说话，只是重新坐下，给自己续了一杯茶。", "你问他：「你在这里等了多久？」", "他吹了吹茶上的热气：「等得够久了。久到我把这茶馆的每一块砖都数过一遍。」", "「数清楚了吗？」你问。", "「数清楚了。」他说，「七百四十三块。第八十三块，是后补的，颜色不一样。」他顿了顿，「可我不知道，这茶馆原来有多少块。」", "你听不懂他在说什么。可你记住了。", "你走出茶馆的时候，天已经黑了。你回头看了一眼——他坐在窗边，还端着那杯茶，像一尊落了灰的雕像。"] /*v45inj:npc_aurelian_truth*/,
  options:[
    {t:"\"如果有人必须打开那扇门呢？\"", effect:{karma:1,flag:"aurelian_truth_known"}, go:"arrive_generic"},
    {t:"沉默，喝完这杯茶", go:"arrive_generic"}
  ]
};};


  

N["npc_aurelian_irongate"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "\"铁门关。\"他重复了一遍这个名字，像在品尝什么苦味的东西。",
    "\"那道门，本来不该破。守城的将领叫什么来着——哦，对，克雷芒。他是个好人。但好人挡不住深渊。\"",
    "\"你知道吗，铁门关破的那天，时间在那里乱了三个时辰。日升日落了两次，然后一切才恢复正常。\"",
    "\"没人提这件事。因为提了，也没人信。\""
  ],
  options:[
    {t:"\"时间乱了？什么意思？\"", go:"npc_aurelian_waiting"},
    {t:"\"克雷芒将军后来怎么样了？\"", go:"npc_aurelian_cremence"}
  ]
};};


  

N["npc_aurelian_cremence"] = function(){ return {
  place:"自由城邦 · 旧茶馆", where:"",
  text:[
    "\"死了。\"他说，语气平淡得像在说今天的天气。",
    "\"城破的时候他没死。他带着残兵退到了自由城邦，然后——\"他顿了顿，\"然后在一个早上，被发现死在自己的住处。胸口插着一把匕首，匕首是他自己的。\"",
    "\"官方说是自尽。但我见过他的尸体。他的表情不是自尽的人该有的表情——他像是看到了什么，非常非常可怕的东西。\"",
    "\"所以你看，\"他端起凉茶，\"活下来的人，不一定比死了的人幸运。\""
  ],
  options:[{t:"沉默，告辞", effect:{flag:"cremence_death_known"}, go:"arrive_generic"}]
};};


  

N["npc_skadi_hunt"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "庄园在北境的边缘，再往北就是冰原。",
    "你到的时候，一个女人正在院子里磨刀。她的动作很慢，很稳，磨刀石上溅出细碎的火花。",
    "她抬头看了你一眼。眼睛是冰蓝色的，像封在冰层下的天空。",
    "\"找我？\"她问，声音不高，但每个字都像冰粒砸在石头上。"
  ],
  options:[
    {t:"\"我听说你是北境最好的猎手。\"", go:"npc_skadi_hunter"},
    {t:"\"我是来求医的——你父亲的病。\"", check:{a:"CHA",sk:"speech",label:"来意"},
  tier:{
    crit:function(){return[pickV(["你没有直接说'求医'，而是说：'我在南边听说，北境有一位老向导，得了一种大夫都看不好的病。我还听说，他的女儿是北境最好的猎手，一个人撑起了整个庄园。'她的磨刀动作停了。'你打听这些干什么？'你说：'因为我也认识一些被深渊侵蚀的人。也许我能帮上忙。'她盯着你看了很久，然后放下了刀：'进来吧。'","你说：'我不是来求医的——我是来还债的。'她皱起眉：'还债？'你说：'三年前，有一位北境向导在暴风雪里救了一支商队。商队里有一个年轻人，是我的朋友。他一直想报答，但找不到人。我是替他来的。'这是你编的，但编得天衣无缝——连细节都有。她的眼神软了下来：'你说的那个人……是我父亲。'"],"skadi_intent_crit")]},
    ok:function(){return[pickV(["你说你是来求医的——你父亲的病。她的手停了，磨刀石上的火花灭了。'你怎么知道我父亲的事？'你解释了一路上听来的消息。她听着，最终松开了按在刀柄上的手：'进来吧。'","你说明了来意。她虽然警惕，但还是让你进了屋。"],"skadi_intent_ok")]},
    fail:function(){return[pickV(["你说你是来求医的，但你的语气太急切了，反而引起了她的怀疑。'你怎么知道我父亲的事？北境的事，南边的人不该知道这么多。'她的手按上了刀柄。你费了好大力气才解释清楚。","你的来意说得不够清楚，她警惕了很久才让你进屋。"],"skadi_intent_fail")]},
    critfail:function(){return[pickV(["你情急之下说了一句'我听说你父亲被暗蚀会的人盯上了'，想表达你知道内情。但这句话像一根针扎在了她的神经上。'暗蚀会？！'她猛地站起来，刀已经出鞘了一半，'你是暗蚀会派来的？！'你连连摆手，但她根本不听。'滚！'她的声音像冰裂，'再让我看到你，我就把你挂在庄园门口的旗杆上！'你被赶出了庄园。雪地里，你听到她在身后把门重重地关上了。"],"skadi_intent_cf")]}
  },
  onCrit:{skadi_bond:8,flag:"skadi_trust_high"},
  onOk:{skadi_bond:3},
  onFail:{skadi_bond:-2},
  onCritFail:{skadi_bond:-15,flag:"skadi_kicked_out"},
  go:"npc_skadi_father"},
    {t:"\"路过，讨杯水喝。\"", go:"npc_skadi_water"}
  ]
};};


  

N["npc_skadi_hunter"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "\"最好的猎手？\"她重复了一遍，嘴角动了动，不知道是不是笑。",
    "\"北境的猎手都死得差不多了。剩下的，不是最好的，是最命硬的。\"",
    "她把刀举起来，对着阳光看了看刃口。\"你想学打猎？还是想雇我？\"",
    "\"先说清楚——我不杀人。至少，不杀不该杀的人。\""
  ],
  options:[
    {t:"\"我想跟你学追踪。\"", check:{a:"AGI",sk:"stealth",label:"求教"},
  tier:{
    crit:function(){return[pickV(["你说想学追踪。她上下打量了你一眼：'学追踪？先让我看看你的底子。'她指了指院子角落的一串脚印：'这是什么时候留下的？什么人？往哪去了？'你蹲下来仔细看——脚印很浅，是早上的露水干之前留下的；步幅均匀，是个训练有素的人；方向朝北，而且故意踩在石头上减少痕迹。你一一说出。她挑了挑眉：'有点意思。行，我教你。'","你没有直接说'教我'，而是说：'我在南边追过一个人，追了三天，跟丢了。他的脚印在一条河边消失了——我知道他没有过河，但我找不到他上岸的痕迹。你能告诉我我错在哪里吗？'她的眼睛亮了——这是一个真正的问题，而不是客套的求教。'你错在只看脚印。'她说，'你应该看河边的泥——他上岸的时候，泥会被蹭掉一块。走，我带你去看。'"],"skadi_teach_crit")]},
    ok:function(){return[pickV(["你说想跟她学追踪。她看了你一眼：'行。但我只教两天，学不学得会看你自己。'接下来的两天，她带你在庄园周围走了一圈，教你看脚印之间的东西。","你请求学习追踪。她同意了，虽然态度有些冷淡。"],"skadi_teach_ok")]},
    fail:function(){return[pickV(["你说想学追踪，但她看了看你的体格和步伐，摇了摇头：'你不适合。追踪要的不是快，是静。你走路像在敲鼓。'她虽然还是教了你，但明显没什么耐心。两天下来，你只学到了一点皮毛。","你的求教方式太笨拙了，她敷衍地教了你一些基础。"],"skadi_teach_fail")]},
    critfail:function(){return[pickV(["你说想学追踪，还吹嘘自己在南边'追过很多人'。她冷笑一声：'追过很多人？那你告诉我，我昨天去了哪里？'你愣住了——你根本没注意到她的鞋子上沾着松针和泥点。'连这个都看不出来，还说学追踪？'她转身就走，'别浪费我的时间。'你站在院子里，脸上火辣辣的。"],"skadi_teach_cf")]}
  },
  onCrit:{skadi_bond:5,skillUp:"stealth",time:2},
  onOk:{skillUp:"stealth",time:2},
  onFail:{time:2},
  onCritFail:{skadi_bond:-5,time:1},
  effect:{time:2}, go:"npc_skadi_teach"},
    {t:"\"冰原里有什么？\"", go:"npc_skadi_icefield"},
    {t:"\"不打扰了。\"", go:"arrive_generic"}
  ]
};};


  

N["npc_skadi_father"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "她的手停了。磨刀石上的火花灭了。",
    "\"你怎么知道我父亲的事？\"她的声音冷了一度，\"北境的事，南边的人不该知道这么多。\"",
    "她站起身。比你想象的高，肩膀很宽，是常年在野外生存的人的体格。",
    "\"你是谁派来的？教会？商会？还是——\"她的手按上了刀柄，\"暗蚀会？\""
  ],
  options:[
    {t:"\"我只是个旅人，听说了这件事。\"", check:{a:"CHA",sk:"speech",label:"解释"},
  tier:{
    crit:function(){return[pickV(["你没有急着辩解，而是摊开手，让她看你的掌心：'旅人。你看这双手——有握剑的茧，有握笔的茧，但没有握刀柄的茧。我不是战士，不是探子，更不是暗蚀会的人。我只是在路上听人说起，北境有一位老向导得了怪病，而他的女儿在独自支撑。我想来看看，能不能帮上忙。'她盯着你的手看了很久，然后松开了刀柄：'你的眼睛没有说谎。进来吧。'","你说：'我不是探子。探子不会一个人走三天雪地，不会在门口先问'你父亲怎么样了'，更不会——'你指了指她腰间的刀，'把后背对着一个拿刀的人。'她愣了一下，然后笑了——很淡，但确实是笑了：'你胆子不小。行，进来吧。'"],"skadi_explain_crit")]},
    ok:function(){return[pickV(["你解释说自己只是个旅人，在路上听说了这件事。她盯着你看了几秒，然后松开了刀柄：'你的眼睛没有说谎。进来吧。'","你解释了一番。她虽然还有些警惕，但最终让你进了屋。"],"skadi_explain_ok")]},
    fail:function(){return[pickV(["你解释得磕磕巴巴的，她越听眉头皱得越紧。'你说你是旅人，但你连从哪条路来的都说不清楚。'她的手还按在刀柄上，'你最好说真话。'你费了好大劲才让她相信你。","你的解释不够有说服力，她盘问了你很久才让你进屋。"],"skadi_explain_fail")]},
    critfail:function(){return[pickV(["你越解释越乱，最后居然说漏了嘴——提到了一些只有暗蚀会内部才知道的细节（你是在路上偷听来的，但你忘了这一点）。她的刀'唰'地出鞘了：'你果然是暗蚀会的人！'你转身就跑，她在后面追。你跑出庄园，在雪地里摔了两跤，才把她甩掉。等你停下来，发现自己的背包在逃跑的时候丢了——里面有你一半的干粮和钱。"],"skadi_explain_cf")]}
  },
  onCrit:{skadi_bond:5,flag:"skadi_trust"},
  onOk:{skadi_bond:2},
  onFail:{skadi_bond:-1},
  onCritFail:{skadi_bond:-12,gold:-30,hp:-5,flag:"skadi_chased_out"},
  go:"npc_skadi_explain"},
    {t:"\"暗蚀会？他们也在找你父亲？\"", check:{a:"INT",sk:"lore",label:"敏锐"},
  tier:{
    crit:function(){return[pickV(["你没有被她的威胁吓住，反而抓住了关键词：'暗蚀会？你提到了暗蚀会——他们也在找你父亲？为什么？'她的手僵在刀柄上。你继续说：'你父亲是北境最好的向导，他带过很多人穿过冰原。如果暗蚀会在找他，那一定是因为他知道冰原深处的什么东西——比如，深渊的入口。'她的脸色变了：'你……你怎么知道？'你说：'因为铁门关破了之后，暗蚀会的活动越来越频繁。他们在找所有能通往深渊的路。'她沉默了很久，然后说：'你跟我来。'","你敏锐地抓住了'暗蚀会'这个词。你说：'你提到暗蚀会的时候，手按刀柄的力度变了——不是因为害怕，是因为愤怒。他们伤害过你父亲，对吗？'她的手松了。'你很敏锐。'她说，'比我想象的敏锐。进来吧，我告诉你发生了什么。'"],"skadi_acute_crit")]},
    ok:function(){return[pickV(["你抓住了关键词：'暗蚀会？他们也在找你父亲？'她的表情变了。沉默了一会儿之后，她开始讲述——关于暗蚀会，关于她父亲，关于冰原深处的东西。","你注意到了'暗蚀会'这个不寻常的词，并追问了下去。她最终告诉了你一些内情。"],"skadi_acute_ok")]},
    fail:function(){return[pickV(["你问了'暗蚀会？他们也在找你父亲？'但语气太直接了，她反而警惕起来：'你问这个干什么？你跟暗蚀会有什么关系？'你花了好大力气才解释清楚。","你虽然抓住了关键词，但追问的方式不对，她没有多说什么。"],"skadi_acute_fail")]},
    critfail:function(){return[pickV(["你问'暗蚀会？他们也在找你父亲？'但你用的语气太像在套话了——而且你不小心提到了一些不该知道的细节。她的刀立刻出鞘：'你到底是谁？！你怎么知道这些？！'你来不及解释，她已经一刀劈了过来。你侧身躲开，刀风擦着你的耳朵过去，削掉了一缕头发。你转身就跑，她在后面追。你在雪地里跑了整整一里地，才把她甩掉。从那以后，你再也不敢靠近弗罗斯特庄园了。"],"skadi_acute_cf")]}
  },
  onCrit:{skadi_bond:8,flag:"skadi_darkcult_known_deep",skillUp:"lore"},
  onOk:{skadi_bond:3,flag:"skadi_darkcult_known"},
  onFail:{skadi_bond:-1},
  onCritFail:{skadi_bond:-15,hp:-10,wound:"刀伤",flag:"skadi_banned"},
  go:"npc_skadi_darkcult"}
  ]
};};


  

N["npc_skadi_explain"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "她盯着你看了几秒。然后松开了刀柄。",
    "\"你的眼睛没有说谎。\"她说，\"但北境不相信眼睛——相信脚印。你在雪地里走了三天，脚印很稳，没有绕路。你不是探子。\"",
    "\"进来吧。\"她转身往屋里走，\"父亲在里屋。他今天精神好一点。\"",
    "屋里很暖。壁炉里烧着松木，空气里有药草和松脂的味道。一个老人躺在床上，瘦得像一把枯柴，但眼睛还亮着。"
  ],
  options:[
    {t:"上前问候老人", effect:{time:1}, go:"npc_skadi_father_room"},
    {t:"在屋里四处看看", check:{a:"INT",sk:"lore",label:"观察"},
  tier:{
    crit:function(){return[pickV(["你在屋里四处看了看，但不是随便看——你注意到了几个细节：墙上的白狐皮，捕猎手法干净利落，是高手所为；角落里的木雕架子，雕工细腻，说明这家人有耐心；床头柜上的民谣集，书页卷边，说明经常被翻阅；刀鞘上的弗罗斯特家族纹章——冰原玫瑰，这是北境最古老的家族之一。你把这些信息在脑子里拼起来：这是一个没落的贵族家庭，以狩猎和木雕为生，家族成员有文化修养。'你在看什么？'斯卡迪问。你说：'在看一个家族的历史。'她愣了一下，然后说：'你比我想象的细心。'","你观察了屋里的陈设，注意到一个不寻常的细节——壁炉旁边的墙上，有一道浅浅的痕迹，像是曾经挂过什么东西，后来被取下来了。痕迹的形状是一把剑，而且是一把双手剑的形状。'你们家以前有人用双手剑？'你问。斯卡迪的表情变了：'那是我母亲的。她……去世之后，我们就把剑收起来了。'你意识到自己触碰到了一个敏感的话题，但她没有生气——反而因为你的细心，对你多了一分信任。"],"skadi_observe_crit")]},
    ok:function(){return[pickV(["你在屋里四处看了看。墙上挂着几张兽皮，角落里有一个木雕架子，床头柜上放着一本民谣集和一把刀。斯卡迪注意到你的目光：'我雕的。'她说，语气有点不自然。","你观察了屋里的陈设，注意到了一些细节——兽皮、木雕、民谣集。"],"skadi_observe_ok")]},
    fail:function(){return[pickV(["你在屋里四处看了看，但没看出什么特别的东西——就是普通的北方人家的陈设。斯卡迪看了你一眼，没说什么。","你看了一圈，但什么有价值的信息都没发现。"],"skadi_observe_fail")]},
    critfail:function(){return[pickV(["你在屋里四处看的时候，不小心碰倒了床头柜上的民谣集。书掉在地上，翻开的那一页夹着一张照片——一个女人的照片，年轻，美丽，眼睛和斯卡迪一模一样。斯卡迪冲过来，一把把照片抢回去，脸色铁青：'谁让你乱翻东西的？！'她的声音在发抖，'出去！'你被赶出了内室。后来你才知道，那张照片是她母亲的——她母亲在她十岁那年去世了。"],"skadi_observe_cf")]}
  },
  onCrit:{skadi_bond:5,flag:"skadi_family_observed"},
  onOk:{},
  onFail:{},
  onCritFail:{skadi_bond:-8,flag:"skadi_privacy_violated"},
  go:"npc_skadi_room_observe"}
  ]
};};


  

N["npc_skadi_father_room"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:[
    "老人看着你，嘴角动了动，像是想笑。",
    "\"又一个……远方的客人。\"他的声音很轻，像从很远的地方传来，\"斯卡迪，给客人……倒杯蜜酒。\"",
    "斯卡迪倒了酒，递给你。她的动作很轻，像怕吵醒什么。",
    "\"我父亲以前是北境最好的向导。\"她说，语气里有一丝你没预料到的温柔，\"他带过很多人穿过冰原。包括——一些不该穿过冰原的人。\""
  ],
  options:[
    {t:"\"不该穿过冰原的人？\"", go:"npc_skadi_icefield"},
    {t:"\"他的病，是怎么回事？\"", check:{a:"INT",sk:"medicine",label:"诊断"},
  tier:{
    crit:function(){return[pickV(["你仔细看了看老人的脸色。苍白，但不是普通的虚白——皮肤底下隐隐有一层青灰色，像霜在血管里结了冰。你又摸了摸他的脉搏——很慢，很弱，但每一次跳动之间，有一个极短的停顿，像是心脏在犹豫要不要继续跳。'这不是病。'你说。斯卡迪的眼神锐利起来：'你看出来了？'你说：'是诅咒。或者更准确地说，是深渊的侵蚀。他的灵魂被什么东西拉扯着，一点一点地被拖走。'你顿了顿，'他接触过什么东西？从冰原里带出来的？'斯卡迪沉默了很久，然后从柜子里拿出一块蓝色的冰。","你不仅看出了这是深渊侵蚀，还判断出了侵蚀的阶段——已经到了第三期，灵魂的核心开始出现裂痕。'最多还有两年。'你说，'如果不找到侵蚀的源头并切断它，他会在两年内彻底变成空壳。'斯卡迪的手攥紧了：'两年……'她的声音在发抖，'你能救他吗？'你说：'我需要知道他接触过什么。'"],"skadi_diagnose_crit")]},
    ok:function(){return[pickV(["你仔细看了看老人的脸色。苍白，但不是普通的虚白——皮肤底下隐隐有一层青灰色。'这不是病。'你说，'是诅咒。或者——更准确地说，是深渊的侵蚀。'斯卡迪沉默了很久，然后拿出了那块蓝色的冰。","你诊断出这不是普通的病，而是某种超自然的侵蚀。斯卡迪告诉了你关于那块冰的事。"],"skadi_diagnose_ok")]},
    fail:function(){return[pickV(["你看了看老人的脸色，觉得像是某种寒症，但具体是什么，你说不上来。'我不是大夫。'你坦白说。斯卡迪的眼神暗了下去：'没关系。很多大夫都来看过，都说不出所以然。'","你尝试诊断，但你的医学知识不够，只能看出这不是普通的病。"],"skadi_diagnose_fail")]},
    critfail:function(){return[pickV(["你看了看老人，然后随口说了一句'大概是风寒吧，吃点药就好了'。话刚出口，你就意识到不对——老人的症状根本不是风寒。但斯卡迪已经听到了。她的眼神瞬间冷了下来：'风寒？'她的声音像冰碴子，'你知不知道，已经有七个大夫说过同样的话？然后呢？我父亲越来越糟。'她站起来，指着门：'如果你只是来敷衍的，那就走吧。我不需要第七个说「风寒」的人。'你被赶出了内室。你知道，你说错话了——而且错得很离谱。"],"skadi_diagnose_cf")]}
  },
  onCrit:{skadi_bond:8,flag:"skadi_disease_diagnosed_deep",skillUp:"medicine"},
  onOk:{skadi_bond:4,flag:"skadi_disease_diagnosed"},
  onFail:{skadi_bond:-1},
  onCritFail:{skadi_bond:-10,flag:"skadi_dismissed_as_doctor"},
  go:"npc_skadi_disease"}
  ]
};};


  

N["npc_skadi_disease"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:[
    "你仔细看了看老人的脸色。苍白，但不是普通的虚白——皮肤底下隐隐有一层青灰色，像霜在血管里结了冰。",
    "\"这不是病。\"你说。",
    "斯卡迪的眼神锐利起来。\"你看出来了？\"",
    "\"是诅咒。或者——更准确地说，是深渊的侵蚀。\"你说，\"他接触过什么东西？从冰原里带出来的？\"",
    "斯卡迪沉默了很久。然后她从柜子里拿出一块蓝色的冰。冰里封着一朵花。",
    "\"他从冰原深处带回来的。\"她说，\"然后就变成这样了。\""
  ],
  options:[
    {t:"研究这块冰", check:{a:"INT",sk:"arcana",label:"研究"},
  tier:{
    crit:function(){return[pickV(["你把冰对着光看。冰里的那朵花，花瓣是黑色的——不是没有颜色的黑，是像能把光吸进去的那种黑。你不仅认出了这是深渊之花，还注意到一个关键细节：花瓣的数量是七瓣。'七瓣。'你喃喃道。斯卡迪问：'七瓣怎么了？'你说：'深渊之花的花瓣数量，对应着深渊七印。七瓣的花，意味着它的根扎在第七印——也就是死亡沙漠的深渊神殿。这朵花，是从深渊神殿附近长出来的。'斯卡迪的脸色白了：'你是说……我父亲去过深渊神殿？'你说：'至少，他去过离神殿很近的地方。'","你研究了这块冰，发现了一个不寻常的现象——冰的温度在缓慢上升。不是因为室温，而是因为花在吸收冰的能量。'这朵花还活着。'你说，'它在冰里休眠，但没有死。如果冰完全化了，它会重新开花——到时候，闻到花香的人都会被侵蚀。'斯卡迪的手在发抖：'那……那怎么办？'你说：'必须在冰化掉之前毁掉它。而且要用火——普通的火不行，要用圣火或者炼金术的蓝焰。'"],"skadi_research_crit")]},
    ok:function(){return[pickV(["你把冰对着光看。冰里的那朵花，花瓣是黑色的——像能把光吸进去的那种黑。你想起来了。在某本古旧的典籍里，你见过这种花的记载。深渊之花。生长在深渊与人间的交界处。'这不是病。'你说，'是深渊在拉他。'","你研究了这块冰，认出了里面的花是深渊之花。你告诉了斯卡迪它的危险性。"],"skadi_research_ok")]},
    fail:function(){return[pickV(["你研究了这块冰，但除了觉得'这花很奇怪'之外，说不出更多的东西。'我需要更多的资料。'你说。斯卡迪的眼神暗了下去：'没关系。很多人研究过，都说不出所以然。'","你尝试研究，但你的神秘学知识不够，只能看出这花不简单。"],"skadi_research_fail")]},
    critfail:function(){return[pickV(["你研究这块冰的时候，忍不住把它凑近了闻——你想知道冰里有没有香味。冰确实化了一点点，有一股极淡的香味飘出来。你吸了一口。然后，你看到了幻觉——一片无边无际的黑色花海，花海里有什么东西在蠕动。你猛地把冰扔出去，大口喘气。斯卡迪冲过来扶住你：'你怎么了？！'你说不出话——你的脑海里，那片花海还在。从那以后，你偶尔会闻到那股香味，即使周围根本没有花。你知道，你被轻微侵蚀了。"],"skadi_research_cf")]}
  },
  onCrit:{skadi_bond:5,flag:"skadi_ice_researched_deep",skillUp:"arcana"},
  onOk:{skadi_bond:2,flag:"skadi_ice_researched"},
  onFail:{},
  onCritFail:{sanLoss:8,wound:"轻微深渊侵蚀",flag:"player_abyss_tainted"},
  effect:{time:1}, go:"npc_skadi_ice_research"},
    {t:"\"把冰扔掉。\"", go:"npc_skadi_ice_discard"}
  ]
};};


  

N["npc_skadi_ice_research"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:[
    "你把冰对着光看。冰里的那朵花，花瓣是黑色的——不是没有颜色的黑，是像能把光吸进去的那种黑。",
    "你想起来了。在某本古旧的典籍里，你见过这种花的记载。",
    "深渊之花。生长在深渊与人间的交界处。它的根扎在深渊里，花开在人间。闻到它花香的人，会被一点一点拖进深渊。",
    "\"你父亲闻过这朵花的香味？\"你问。",
    "斯卡迪点头。\"冰刚拿回来的时候，化过一点。化的时候，有香味。\"",
    "\"那就对了。\"你说，\"这不是病。是深渊在拉他。\""
  ],
  options:[
    {t:"\"冰必须毁掉。花也要毁掉。\"", effect:{flag:"skadi_abyss_flower_known",karma:1}, go:"npc_skadi_ice_discard"},
    {t:"\"也许可以用这朵花做文章——找到深渊的入口。\"", check:{a:"SPR",sk:"will",label:"冒险"},
  tier:{
    crit:function(){return[pickV(["你说出那句话的时候，斯卡迪看着你，像在看一个疯子。但你继续说：'这朵花的根扎在深渊里。如果我们能顺着根的方向追溯，就能找到深渊与人间的交界处。这不是冒险——这是唯一能彻底救你父亲的方法。'你的声音很稳，眼神很坚定。斯卡迪看了你很久，然后说：'你知道你在说什么吗？去过那里的人，没有一个完整地回来。'你说：'我知道。但如果不去，你父亲最多还有两年。'她沉默了很久，最后说：'冰原最深处有一道裂缝。从那里下去，就是深渊。'","你不仅提出了冒险的想法，还给出了具体的方案：'这朵花可以作为锚点。我们用炼金术把它的根须显化出来，然后顺着根须的方向走。虽然危险，但比盲目进入冰原要安全得多。'斯卡迪被你的冷静和周密打动了：'你不是在冲动。你是真的想好了。'她点了点头，'好。我告诉你我知道的一切。'"],"skadi_risk_crit")]},
    ok:function(){return[pickV(["你提出可以用这朵花找到深渊的入口。斯卡迪看着你，眼神复杂：'你疯了。'但她还是告诉了你——冰原最深处有一道裂缝，从那里下去就是深渊。","你提出了冒险的想法。她虽然觉得你疯了，但还是告诉了你一些信息。"],"skadi_risk_ok")]},
    fail:function(){return[pickV(["你提出了这个想法，但你的语气太犹豫了——连你自己都不确定这是不是个好主意。斯卡迪看出来了：'你自己都不信，就别拉我下水。'她没有多说什么。","你的想法不够有说服力，她没有认真对待。"],"skadi_risk_fail")]},
    critfail:function(){return[pickV(["你提出用这朵花找深渊入口的时候，眼睛里闪烁着兴奋的光芒——那是一种对未知的渴望，一种不计后果的狂热。斯卡迪后退了一步：'你……你跟那些人一样。'她的声音在发抖，'你跟暗蚀会的人一样——你们都对深渊着迷。'她抓起那块冰，锁进柜子里：'你走。我不想再看到你。'你被赶出了庄园。你站在雪地里，意识到自己刚才的表情确实很危险——那不是一个正常人该有的表情。"],"skadi_risk_cf")]}
  },
  onCrit:{skadi_bond:5,flag:"skadi_abyss_path_accepted",karma:-1},
  onOk:{karma:-1},
  onFail:{},
  onCritFail:{skadi_bond:-12,flag:"skadi_sees_abyss_obsession",sanLoss:3},
  go:"npc_skadi_abyss_path"}
  ]
};};


  

N["npc_skadi_ice_discard"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "斯卡迪把冰放进壁炉。火舌舔上去，冰没有化——反而发出一声尖锐的嘶鸣，像什么活物在叫。",
    "然后冰裂了。黑色的花瓣从裂缝里伸出来，在空中抓了两下，才被火吞没。",
    "屋里的温度骤然降了十度。壁炉里的火变成了蓝色，烧了整整一刻钟，才恢复正常。",
    "那天晚上，老人的呼吸平稳了一些。斯卡迪坐在床边，握着他的手，坐了一夜。",
    "第二天早上，她给你一包干粮和一张北境的地图。\"路上小心。\"她说，\"冰原里的东西，比这朵花可怕的，还有很多。\""
  ],
  options:[{t:"离开庄园", effect:{rep:3,item:"北境地图"}, go:"arrive_generic"}]
};};


  

N["npc_skadi_abyss_path"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:[
    "斯卡迪看着你，眼神复杂。",
    "\"你疯了。\"她说，但语气里没有责备，\"不过——北境的老人说，冰原最深处有一道裂缝。从那里下去，就是深渊。\"",
    "\"我父亲去过那里。他说，裂缝旁边有一块石碑，石碑上刻着字，但没人看得懂。\"",
    "她把蓝冰放回柜子里。\"如果你真要去，等春天。冬天的冰原，连风都会杀人。\"",
    "\"但我劝你别去。\"她的声音低下来，\"去过那里的人，没有一个完整地回来。\""
  ],
  options:[
    {t:"记下这个信息", effect:{flag:"abyss_rift_north_known",karma:-1}, go:"arrive_generic"},
    {t:"\"你父亲是怎么回来的？\"", go:"npc_skadi_father_return"}
  ]
};};


  

N["npc_skadi_father_return"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:["那天傍晚，斯卡迪坐在屋前的石阶上，手里攥着一封信。", "你没有走过去。你站在院子门口，等她自己开口。", "过了很久，她说：「我爹来信了。」她低头看着那封信，「他说他今年冬天回来。」", "「好事。」你说。", "「是啊，好事。」她重复了一遍，声音没什么起伏，「他走了十二年。我娘等了他十年，没等到，走了。」", "她站起来，把信折好，收进怀里：「他说他回来。可我不知道，他回来，我该跟他说什么。」", "她没有哭。北境人不轻易哭。她只是站在那里，看着远方的山，站了很久。", "\"他不是自己回来的。\"斯卡迪说，\"是被一支商队捡回来的。在冰原边缘，已经冻僵了，但还有气。", "\"他身上没有伤。只是手里攥着这块冰。攥得很紧，手指都冻在了冰上，是商队的人用温水一点点化开的。\"", "\"他醒过来之后，什么都不记得了。不记得去过哪里，不见过什么人。只反复说一句话——", "她顿了顿，学父亲的语气：\"\"门要开了。门要开了。\"\"", "屋里很静。壁炉里的火噼啪响了一声。", "太阳落山了。风开始变冷，她终于转身，往屋里走。", "路过你身边时，她停了一下：「你听过一首歌吗？北境的，叫《等雪的人》。」", "你摇头。她说：「那你别听。听了，就忘不掉了。」", "她进了屋。门没有关。你站在院子里，听见屋里传来极轻的声音——不是哭，是她在哼一首曲子。", "你听不懂那曲子，可你听懂了它的调子：等人的人，把日子过成了钟，一响，就是一年。", "你第二天走的时候，没有提那封信。她也什么都没有说。你们像什么都没发生过一样，说了再见。"] /*v45inj:npc_skadi_father_return*/,
  options:[{t:"告辞，把这些信息记在心里", effect:{flag:"abyss_rift_north_known"}, go:"arrive_generic"}]
};};


  

N["npc_skadi_icefield"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:["冰原的风，像刀子一样。", "斯卡迪走在前面，皮靴踩在冰面上，发出咯吱咯吱的响。她走得很稳，每一步都踩实了才迈下一步——这是北境人走了几辈子的路，练出来的习惯。", "「你在看什么？」她没有回头，却知道你在看。", "「看你走路。」你说。", "「走路有什么好看。」她说，「北境人都会走。」她顿了顿，「活着的人，都会走。」", "冰原很空，空到你能听见自己的心跳。她的声音在风里断断续续：「我小时候，我爹教我：走冰原，别看远方，看脚下。看远方的，都摔了。」", "\"冰原里有什么？\"她重复了一遍你的问题，然后沉默了很久。", "\"有风。有雪。有冰。还有——\"她的声音低下来，\"有声音。", "\"你在冰原里走，走到第三天或者第四天，会听到有人在叫你的名字。从雪底下，从冰缝里，从天上。到处都是。", "\"老猎手说，那是冰原在留人。它叫你的名字，你应了，就走不出来了。", "\"所以进冰原的人，都用代号。真名不能说——说了，冰原就记住你了。\"", "她停下来，指着前方一处冰裂缝：「看见没有？那种裂缝，雪盖着，看不出来。一脚踩空，人就没了。」", "「那你为什么走那么快？」你问。", "「因为我认得路。」她说，「这条路，我走了二十年。哪里的雪是虚的，我踩一脚就知道。」", "她走了几步，又停下：「你不一样。你不认得路。所以——你跟着我走，踩我的脚印。」", "她继续往前走。你跟着她的脚印，一步一步，踩在她踩过的地方。冰很滑，可她的脚印很稳，像一排刻在冰上的字。", "你忽然明白，她让你踩她的脚印，不是客气。在北境，这是最重的一句话。"] /*v45inj:npc_skadi_icefield*/,
  options:[
    {t:"\"你进去过吗？\"", go:"npc_skadi_been_inside"},
    {t:"\"谢谢提醒。\"", go:"arrive_generic"}
  ]
};};


  

N["npc_skadi_been_inside"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "\"进去过一次。\"她说，\"十六岁那年，跟着父亲进去找一种药草。",
    "\"走到第三天，我听到了。有人叫我的名字。不是父亲的声音——是我母亲的。我母亲在我十岁那年就死了。",
    "\"我差点应了。是父亲捂住了我的嘴。他的手在抖——我父亲的手，从来没抖过。",
    "\"我们退出来了。药草没找到。但命保住了。",
    "她摸了摸腰间的刀。\"从那以后，我再也没进去过。直到——我父亲带着那块冰回来。\""
  ],
  options:[{t:"沉默，告辞", effect:{flag:"skadi_icefield_story"}, go:"arrive_generic"}]
};};


  

N["npc_skadi_teach"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园外", where:"",
  text:[
    "她带你在庄园周围走了一圈。",
    "\"追踪不是看脚印。\"她说，\"是看脚印之间的东西。被压弯的草叶方向，树皮上的擦痕高度，雪地上的气味——对，气味。雪会保留气味，尤其是冷的时候。",
    "她蹲下来，指着地上的一道痕迹。\"这是兔子的。你看，后脚深，前脚浅，方向是那边——它在跑，因为旁边有狐狸的脚印。",
    "\"学这个，要先学会安静。\"她站起来，\"不是不说话的安静——是把自己变成环境的一部分的安静。",
    "你练了两天。第三天早上，你在雪地里蹲了一个时辰，一只狐狸走到离你三步远的地方，才发现你。",
    "斯卡迪点了点头。\"还行。\"她说——这在她嘴里，已经是很高的评价了。"
  ],
  options:[{t:"谢过她，离开", effect:{skillUp:"stealth",rep:2}, go:"arrive_generic"}]
};};


  

N["npc_skadi_water"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:["斯卡迪递给你一碗水，你接过来，发现碗是陶的，碗沿有一道细小的缺口。", "「这碗跟我十年了。」她说，「北境的冬天，水凉得扎牙。可再凉，也得喝——喝了，才有力气活下去。」", "你喝了一口。水确实凉，可有一种干净的甜味，像刚从雪山下流下来的。", "她看着你喝水，忽然说：「你喝水的样子，像我弟弟。」", "你没问后来呢。她也没说。北境人说话，从来不说满。", "她看了你一眼，没说话，转身进了屋。", "出来时端着一碗水，水里漂着几片薄荷叶。", "\"北境的水，比南边的硬。\"她说，\"喝不惯的话，别勉强。", "你喝了一口。水很凉，带着松针和泥土的味道。", "她靠在门框上，看着你喝水。\"你从南边来？\"她问，\"南边现在怎么样了？", "你们沉默着坐了一会儿。窗外的雪开始下，细密的，无声的，像有人在天空筛面粉。", "斯卡迪起身，往炉子里添了几根柴。火苗腾起来，把她的影子投在墙上，又长又直。", "「你明天走？」她问。你点头。她没有挽留，只说：「北境的规矩，送人不送远。我就送你到门口。」", "炉火噼啪地响。你忽然觉得，这间屋子里，有一种很安静的东西——不是冷，是那种，经历过很多冬天的人，才有的从容。", "「路上带点干粮。」她补了一句，像叮嘱一个要出远门的弟弟，「北边的路，饿着肚子走，容易走不动。」"] /*v45inj:npc_skadi_water*/,
  options:[
    {t:"跟她聊聊南边的局势", go:"npc_skadi_south_news"},
    {t:"喝完水，道谢离开", go:"arrive_generic"}
  ]
};};


  

N["npc_skadi_south_news"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "你跟她说了南边的事。银穗商路的动荡，教会的增税，自由城邦的难民。",
    "她听得很认真，偶尔问一两句。问到铁门关的时候，她的眉头皱了起来。",
    "\"铁门关破了，北境就是下一道防线。\"她说，\"但北境的公国们还在吵架。谁都不想多出兵，谁都不想多出钱。",
    "\"等深渊真的打过来，他们就知道了——但那时候，可能已经晚了。",
    "她抬头看了看天。北境的天很低，云压在山顶上，像要塌下来。",
    "\"我父亲常说，\"她轻声说，\"北境的山，是大陆的脊梁。脊梁断了，整座大陆都站不起来。\""
  ],
  options:[{t:"记下她的话，告辞", effect:{flag:"skadi_north_warning"}, go:"arrive_generic"}]
};};


  

N["npc_skadi_room_observe"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:[
    "你在屋里四处看了看。",
    "墙上挂着几张兽皮，其中一张是白狐的，皮毛纯白。角落里有一个木雕架子，上面摆着几只未完成的木雕——有鸟，有鹿，还有一个人的轮廓，雕到一半。",
    "床头柜上放着一本书，书页卷了边，是一本民谣集。旁边有一把刀，刀鞘上刻着弗罗斯特家族的纹章——一朵冰原玫瑰。",
    "斯卡迪注意到你的目光。\"我雕的。\"她说，语气有点不自然，\"闲着的时候雕的。"
  ],
  options:[
    {t:"\"雕得很好。\"", go:"npc_skadi_carving"},
    {t:"拿起那本民谣集看看", check:{a:"INT",sk:"lore",label:"翻阅"},
  tier:{
    crit:function(){return[pickV(["你拿起那本民谣集，翻开第一页。扉页上有一行手写的字：'送给我的小斯卡迪，愿你永远像冰原玫瑰一样坚韧。——妈妈'你的心微微一动。你继续翻，发现书页的空白处有很多批注——是一个孩子的笔迹，歪歪扭扭的，写着'妈妈唱过这首歌''妈妈说这是北境最好听的歌'。你明白了——这本民谣集是斯卡迪母亲的遗物，她一直在读，一直在想她的母亲。你把书轻轻放回原处，没有说话。斯卡迪看着你，眼神软了下来：'你看到了？'你点点头。她说：'她去世之后，我每天晚上都读一首。已经读了十二年了。'","你翻阅民谣集的时候，注意到其中一页的边角特别卷——那是被反复翻阅的痕迹。那一页的歌名是《冰原玫瑰》，歌词写的是一个母亲在雪夜里唱歌哄女儿睡觉的故事。你抬头看了斯卡迪一眼，她的眼眶红了。'那是我妈妈最喜欢的歌。'她说，'她……她走的那天晚上，还在唱这首歌。'你没有说话，只是把那一页轻轻抚平。她看了你很久，然后说：'谢谢你。没有问'你妈妈怎么了'。'"],"skadi_ballad_crit")]},
    ok:function(){return[pickV(["你拿起那本民谣集翻了翻。都是北境的民谣——关于雪、关于风、关于在冰原里失踪的人。书页卷了边，看得出经常被翻阅。斯卡迪在旁边看着你，没有说话。","你翻阅了民谣集，看到了一些北境的民谣。"],"skadi_ballad_ok")]},
    fail:function(){return[pickV(["你翻了翻民谣集，但对北境的民谣没什么兴趣，看了几页就放下了。斯卡迪的眼神暗了一下——她大概以为你会感兴趣。","你随便翻了翻，没看出什么特别的。"],"skadi_ballad_fail")]},
    critfail:function(){return[pickV(["你翻阅民谣集的时候，不小心把书掉到了地上。更糟的是，你踩了一脚——书页上留下了一个泥脚印。斯卡迪的脸色瞬间变了。她冲过来，一把把书抢回去，用袖子小心翼翼地擦那个脚印。'你……'她的声音在发抖，'你知不知道这本书对我意味着什么？'她的眼睛红了，'这是我妈妈留给我的唯一的东西！'你站在那里，手足无措。她把书抱在怀里，转身走出了内室。从那以后，她再也没有跟你说过一句话。"],"skadi_ballad_cf")]}
  },
  onCrit:{skadi_bond:8,flag:"skadi_mother_known"},
  onOk:{skadi_bond:2},
  onFail:{skadi_bond:-1},
  onCritFail:{skadi_bond:-12,flag:"skadi_book_damaged"},
  go:"npc_skadi_ballad"}
  ]
};};


  

N["npc_skadi_carving"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:["斯卡迪的刀很稳。", "她坐在窗边，手里一块木头，一柄刻刀，一刀一刀地削着。木屑落在她膝上，像细小的雪。", "你没有打扰她，只是看着。她刻的是一匹马——不是站着的，是奔跑的，四蹄腾空，鬃毛飞扬，好像下一秒就要从木头上冲出去。", "「北境的马，」她说，没有抬头，「跑起来的时候，是听不见风声的。它们只听得见自己的心跳。」", "她刻完最后一刀，吹掉木屑，把马放在窗台上。夕阳透过窗纸，照在那匹马上，木头的纹理像被点燃了。", "她的脸红了一下——很淡，像冰面上闪过的一丝暖意。", "\"我父亲教我的。\"她说，\"他说，猎手的手不能只会拿刀。也要会做一些……没用的东西。", "\"他说，没用的东西，才是让人活下来的东西。", "她拿起那个未完成的人像木雕。\"这个是他。\"她说，\"雕到一半，他就病了。我再也没雕完。", "屋里很静。老人在床上轻轻呼吸着，像一盏快要燃尽的灯。", "她把那匹木马递给你：「送你的。」", "你接过，木马很小，躺在掌心里，却有一种说不清的重量。你忽然明白，那不是木头——是她在北境的那些冬天。", "「为什么送我这个？」你问。", "她想了想，说：「因为你要走的路，和它一样——要跑起来，才听不见风声。」", "你攥着那匹木马，没再说话。窗外的雪还在下，可你知道，这趟路上，你会带着这匹木马，跑得比风还快。"] /*v45inj:npc_skadi_carving*/,
  options:[{t:"\"等他好了，再雕完。\"", effect:{rep:2}, go:"arrive_generic"}]
};};


  

N["npc_skadi_ballad"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园 · 内室", where:"",
  text:["斯卡迪看着你手里的民谣集，没有阻止你继续翻。她只是走到窗边，背对着你，声音很轻。", "「我母亲死的那年，我才七岁。」她说，「北境的冬天，雪下得很大。她是在雪地里唱完最后一首歌，才倒下的。」", "「村里人说，她是被冻死的。可我知道不是。」她顿了顿，「她是唱到那首歌的最后一个音，才肯倒下的。她想把歌，唱完。」", "「后来我学木雕。雕的都是她唱过的歌。」她转过身，看着你，「我知道这很傻——歌是声音，怎么雕得出来？」", "「可我就是想试试。好像只要雕出来了，她就还在。」", "你翻开民谣集。书页上有手写的批注，字迹娟秀——是斯卡迪的字。", "其中一首歌被折了角。你看了看歌词，是一首挽歌。", "\"那是我母亲的歌。\"斯卡迪说，\"她生前常唱。她死后，我就再也没唱过。", "\"直到最近。\"她的声音低下来，\"我开始唱了。在打猎的时候，在木雕的时候，在——睡不着的时候。", "\"北境的老人说，唱挽歌的人，是在跟死人告别。但我觉得——我是在跟她说话。", "窗外的风灌进来，吹得烛火晃了晃。斯卡迪走过来，在你对面坐下，从你手里拿回那本民谣集。", "她没有合上，而是翻到那首挽歌，轻轻哼了几句。声音很低，低得几乎听不见，可你知道，那是她唱给某个已经不在这世上的人听的。", "哼完，她合上书，指尖在封皮上停了一下：「谢谢你，愿意听。」", "你摇了摇头：「该谢谢你，愿意唱。」", "她愣了一下，然后笑了——那笑容很淡，像北境三月里，第一片化开的雪。", "「北境的规矩，听歌的人，要请唱歌的人喝一杯。」她说，「下次来，我请你喝我酿的麦酒。」"] /*v45inj:npc_skadi_ballad*/,
  options:[{t:"合上书本，不再多问", effect:{rep:1}, go:"arrive_generic"}]
};};


  

N["npc_skadi_darkcult"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "她的眼神变了。刀柄在她手里转了半圈。",
    "\"你知道暗蚀会？\"她的声音压得很低，\"他们来过。三个月前。两个人，说是商会的客商，但我在他们的行李里找到了密眼司的徽章。",
    "\"我没杀他们。我把他们绑了，扔在冰原边缘。让冰原来决定他们的死活。",
    "\"但他们来找我父亲——不是找我。他们问了很多关于冰原的事。关于那道裂缝。",
    "她走近一步。\"你到底是谁？为什么会提到暗蚀会？"
  ],
  options:[
    {t:"如实相告你和暗蚀会的遭遇", effect:{flag:"skadi_darkcult_ally",rep:2}, go:"npc_skadi_ally"},
    {t:"\"我只是听说过这个组织。\"", check:{a:"CHA",sk:"speech",label:"掩饰"},
      tier:{
        crit:function(){return[pickV(["你说'我只是听说过这个组织'，然后补充了一句：'在灰港的时候，听酒馆里的人说过。说是一个邪教组织，专门在暗地里搞破坏。'你的语气很自然，像在说一件无关紧要的事。斯卡迪盯着你看了几秒，然后点了点头：'灰港……那里确实是他们的一个据点。'她没有再追问，但你注意到，她的手从刀柄上移开了——她相信了你。而且，因为你提到了灰港，她反而觉得你是个消息灵通的旅人，对你多了几分信任。","你说'我只是听说过这个组织'，然后故意露出一丝犹豫的表情：'其实……我在南边的时候，遇到过一个奇怪的人。他说了一些关于暗蚀会的话，但我当时没太在意。现在想想，可能是真的。'斯卡迪的眼睛亮了：'南边？你在南边遇到了他们的人？'你点了点头，把一些你确实知道的零碎信息告诉了她——但隐去了最关键的部分。她听完，皱起了眉头：'看来他们的活动范围比我想象的大。'她没有怀疑你，反而因为你提供了信息，对你更加信任了。"],"skadi_hide_crit")]},
        ok:function(){return[pickV(["你说'我只是听说过这个组织'。斯卡迪盯着你看了几秒，然后点了点头：'听说过就好。小心点，这个组织很危险。'她没有再追问，但你能感觉到，她还有些怀疑——只是没有证据。","你掩饰过去了。她虽然还有些怀疑，但没有继续追问。"],"skadi_hide_ok")]},
        fail:function(){return[pickV(["你说'我只是听说过这个组织'，但你的眼神闪烁了一下——你不太擅长撒谎。斯卡迪是什么人？她是北境最好的猎人，最擅长的就是辨别谎言。她冷笑一声：'听说过？你的眼神告诉我，你不止是听说过。'她走近一步，刀柄在她手里转了半圈：'说吧，你到底跟暗蚀会有什么关系？'你没办法，只能含糊其辞地解释了几句。她虽然没有完全相信，但也没有再逼问——只是对你的信任度降低了不少。","你掩饰得不好。她看出了你在撒谎，但没有拆穿你——只是对你多了几分戒心。"],"skadi_hide_fail")]},
        critfail:function(){return[pickV(["你说'我只是听说过这个组织'，然后又加了一句'我跟他们没有任何关系'。话刚出口，你就知道糟了——'此地无银三百两'。斯卡迪的眼神瞬间冷了下来：'没有任何关系？我没问你跟他们有没有关系。你为什么要特意强调？'她的手按上了刀柄：'你到底在隐瞒什么？'你结结巴巴地解释，但越解释越乱。她后退一步，拉开了距离：'我不管你跟暗蚀会有什么关系。但你记住——如果你敢把他们引到北境来，我会亲手杀了你。'她转身走进了屋子，把门重重地关上。你站在院子里，知道自己搞砸了。从那以后，斯卡迪对你始终保持着距离，再也没有像以前那样信任你了。"],"skadi_hide_cf")]}
      },
      onCrit:{skadi_bond:3,flag:"skadi_believes_cover"},
      onOk:{},
      onFail:{skadi_bond:-2,flag:"skadi_suspicious"},
      onCritFail:{skadi_bond:-8,flag:"skadi_distrusts_player",sanLoss:2},
      go:"npc_skadi_explain"}
  ]
};};


  

N["npc_skadi_ally"] = function(){ return {
  place:"北方公国 · 弗罗斯特庄园", where:"",
  text:[
    "你跟她说了灰港后巷的遭遇。那个灰袍人，那枚密眼徽章。",
    "她听完，沉默了很久。",
    "\"看来他们不止在北境活动。\"她说，\"整个大陆，都有他们的影子。",
    "\"你要小心。\"她认真地看着你，\"暗蚀会的人，杀不完。你杀了一个，会来十个。你杀了十个，会来一百个。",
    "\"但如果你真的要跟他们斗——\"她从墙上取下一把短刀，递给你，\"拿着。北境的铁，比南边的硬。",
    "\"还有，\"她补充道，\"如果有一天你需要帮手，来北境找我。我不杀人，但暗蚀会的人——不算人。"
  ],
  options:[{t:"收下短刀，谢过她", effect:{item:"北境短刀",flag:"skadi_ally"}, go:"arrive_generic"}]
};};


  

N["npc_roland_blacksmith"] = function(){ return {
  place:"北方公国 · 铁壁城铁匠铺", where:"",
  text:[
    "铁匠铺的炉火很旺。一个年轻人站在炉前，赤着上身，肌肉线条像刀刻的一样。",
    "他在打一把剑。每一下都很重，火星四溅。",
    "你注意到他的脸——很年轻，不超过二十五岁，但眼神很沉，像见过很多死人。",
    "他注意到你在看，停下锤子。\"看什么？\"他问，声音很低，像从胸腔里挤出来的。",
    "\"看你打铁。\"你说，\"你在打什么？",
    "\"一把剑。\"他说，\"打给我弟弟的。他喜欢弹琴，不喜欢舞刀弄剑。但我得让他带着——北边不太平。"
  ],
  options:[
    {t:"\"你是罗兰·德·艾恩沃尔？\"", check:{a:"INT",sk:"lore",label:"认出"},
  tier:{
    crit:function(){return[pickV(["你看着他打铁的动作——每一下都很重，但落点精准，而且，他的左手始终比右手低半寸——这是铁壁公国'破山锤法'的特征。你说：'罗兰·德·艾恩沃尔。铁壁公国的继承人。北境最年轻的宗师级武者。'他的手顿了一下——锤子停在半空，火星落下来，烫在他的手臂上，他没躲。'你认识我？'他问。你说：'不仅认识。我还知道，你三年前在铁门关，一个人守住了北门三个时辰。后来因为反对公国的投降政策，被剥夺了继承权，来到这里打铁。'他的身体震了一下：'你……你怎么知道这些？'你说：'因为我也在铁门关。我见过你战斗。'他沉默了很久，然后说：'进来吧。我们谈谈。'","你不仅认出了他的身份，还注意到了一个细节——他打的那把剑，剑脊上有一道极细的血槽。这是铁壁公国王室的锻造手法，专门用来对付深渊生物的——血槽可以让深渊生物的血液流得更快，加速它们的死亡。'你在打一把杀深渊的剑。'你说。他的手停了：'你看得出来？'你说：'这道血槽的角度，是专门针对深渊生物的生理结构设计的。普通人看不出来，但我见过这种手法。'他放下锤子，认真地看着你：'你不简单。坐吧。我们聊聊。'"],"roland_rec_crit")]},
    ok:function(){return[pickV(["你认出了他——罗兰·德·艾恩沃尔，铁壁公国的继承人，北境最年轻的宗师级武者。他的手顿了一下：'你认识我？'你说：'铁壁公国的继承人。北境最年轻的宗师级武者。'他哼了一声，把锤子放下：'都是过去的事了。现在的我，只是个打铁的。'","你认出了罗兰的身份。他虽然有些意外，但还是平静地承认了。"],"roland_rec_ok")]},
    fail:function(){return[pickV(["你觉得这个人有点眼熟，但想不起来在哪里见过。你犹豫了一下，说：'你是……罗兰？'他看了你一眼：'你认识我？'你支支吾吾，说不出更多的信息。他哼了一声：'又是一个听了点传闻就来套近乎的。'他继续打铁，不再理你。","你尝试认出他，但只记得名字，说不出更多细节。他对你有些冷淡。"],"roland_rec_fail")]},
    critfail:function(){return[pickV(["你看着他，然后脱口而出：'你是那个打输了的废物吧？铁门关的逃兵？'话刚出口，你就后悔了——他的锤子停了。他慢慢转过身，看着你。他的眼睛里没有愤怒，只有一种很深的、很旧的疲惫。'逃兵？'他重复了一遍，语气很平，'我带着三百人守北门，杀了三天三夜，最后只剩下我一个人。你叫我逃兵？'他放下锤子，走到你面前。他比你高一个头，肌肉像铁块一样鼓着。'你知道什么是铁门关吗？你知道那些东西从城墙下面钻出来的时候，是什么样子吗？'他的声音越来越大，'你什么都不知道！就敢叫我逃兵？！'他一把抓住你的衣领，把你提了起来。你双脚离地，呼吸困难。他盯着你看了几秒，然后把你扔在地上：'滚。不要再让我看到你。'你狼狈地爬起来，跑出了铁匠铺。从那以后，铁壁城的铁匠铺，都不欢迎你。"],"roland_rec_cf")]}
  },
  onCrit:{roland_bond:5,flag:"roland_recognized_deep"},
  onOk:{roland_bond:2,flag:"roland_recognized"},
  onFail:{roland_bond:-1},
  onCritFail:{roland_bond:-10,hp:-8,wound:"瘀伤",flag:"roland_insulted"},
  go:"npc_roland_recognize"},
    {t:"\"你弟弟呢？\"", go:"npc_roland_brother"}
  ]
};};

  

N["npc_roland_recognize"] = function(){ return {
  place:"北方公国 · 铁壁城铁匠铺", where:"",
  text:[
    "他的手顿了一下。锤子停在半空，火星落下来，烫在他的手臂上，他没躲。",
    "\"你认识我？\"他问。",
    "\"铁壁公国的继承人。\"你说，\"北境最年轻的宗师级武者。",
    "他哼了一声，把锤子放下。\"都是过去的事了。现在的我，只是个打铁的。",
    "\"为什么？\"你问。",
    "他沉默了很久。炉火映着他的脸，一半亮，一半暗。",
    "\"因为我发现，\"他说，\"枪和剑，挡不住所有的东西。有些东西，比铁硬，比刀快。",
    "\"比如？\"",
    "\"比如深渊。\"他说。"
  ],
  options:[
    {t:"\"你跟深渊交过手？\"", check:{a:"CHA",sk:"speech",label:"追问"},
  tier:{
    crit:function(){return[pickV(["你没有直接问'你跟深渊交过手'，而是说：'你打的这把剑，剑脊上有血槽。这是专门对付深渊生物的手法。你在为对付深渊做准备。'他的手停了。他看着你，看了很久，然后说：'你看得很仔细。'你说：'因为我也跟深渊交过手。我知道它们的弱点——血槽可以让它们的血液流得更快。'他的眼睛亮了——那是一种遇到同类的光芒。'你也……'他的声音有些发抖，'你也在铁门关？'你说：'没有。但我在别的地方，跟它们打过。'他沉默了一会儿，然后走到角落，从铁箱里取出一把断枪：'铁门关破的那天，我在那里。我跟它们的首领交过手——一个穿黑袍的人，只用了一根手指，就把我的枪断成了两截。'他开始讲述——关于铁门关，关于深渊，关于那个黑袍人。你认真地听着，偶尔问一两个切中要害的问题。他越讲越深入，把很多从未对人说过的细节都告诉了你。","你说：'我不问你为什么离开骑士团。我只想知道——深渊的东西，最怕什么？'他愣了一下，然后笑了——很苦的那种笑：'你是第一个问这个问题的人。其他人要么问'你为什么走'，要么问'你后不后悔'。没有人问我'深渊最怕什么'。'他放下锤子，坐在你对面：'深渊最怕的，是光。不是普通的光——是圣光。教会的圣光，可以净化它们。但还有一样东西，比圣光更有效——星辰之力。陨铁，就是带着星辰之力的金属。陨铁打造的武器，可以直接伤害深渊生物的本体。'他告诉你很多关于深渊的弱点和战斗技巧。这些都是用命换来的经验。"],"roland_ask_crit")]},
    ok:function(){return[pickV(["你问他是不是跟深渊交过手。他沉默了很久，然后从铁箱里取出一把断枪：'铁门关破的那天，我在那里。'他开始讲述——关于北门的战斗，关于那个黑袍人，关于那句'凡人，你挡不住的'。你认真地听着。","你追问了他跟深渊交手的经历。他虽然有些犹豫，但最终告诉了你铁门关的真相。"],"roland_ask_ok")]},
    fail:function(){return[pickV(["你问他是不是跟深渊交过手，但语气太直接了，像在审问。他的脸色冷了下来：'这是我的事。与你无关。'你意识到自己冒犯了他——那是他不愿触碰的伤口。你想道歉，但他已经转过身，继续打铁了。","你追问了，但方式不对。他不愿意多说，你只得到了一些含糊的回答。"],"roland_ask_fail")]},
    critfail:function(){return[pickV(["你问他是不是跟深渊交过手，然后又加了一句'听说你被一根手指就打败了？真的假的？'话刚出口，铁匠铺里的温度骤然下降。他慢慢转过身，脸上没有表情，但你能感觉到——他在压抑着什么。'一根手指。'他重复了一遍，声音很轻，'你说得对。一根手指。我苦练了二十年的枪法，在他面前，连一根手指都挡不住。'他的手在发抖——不是害怕，是愤怒和无力。'你知道那种感觉吗？'他的声音突然变大了，'你知道你拼尽全力，却被人一根手指就打败了，是什么感觉吗？！'他抓起一把烧红的铁锭，狠狠砸在铁砧上——铁锭飞溅，火星四溅。你吓得后退了一步。他喘着粗气，过了很久才平静下来：'滚。'你不敢再说什么，灰溜溜地离开了铁匠铺。从那以后，你再也不敢在他面前提'铁门关'三个字。"],"roland_ask_cf")]}
  },
  onCrit:{roland_bond:8,flag:"roland_irongate_story_deep",flag:"abyss_weakness_known",karma:1},
  onOk:{roland_bond:3,flag:"roland_irongate_story",karma:1},
  onFail:{roland_bond:-1},
  onCritFail:{roland_bond:-12,sanLoss:3,flag:"roland_trauma_triggered"},
  go:"npc_roland_abyss"},
    {t:"\"对不起，我不该问。\"", go:"arrive_generic"}
  ]
};};

  

N["npc_roland_abyss"] = function(){ return {
  place:"北方公国 · 铁壁城铁匠铺", where:"",
  text:[
    "罗兰走到铁匠铺的角落，从一个铁箱里取出一件东西——一把断枪。",
    "枪头断了，断口很整齐，像被什么东西一刀两断。",
    "\"铁门关破的那天，\"他说，\"我在那里。",
    "\"我带着三百人，守北门。我们杀了很多——那些东西。但杀不完。它们从城墙下面钻出来，从城门缝里挤进来，从天上掉下来。",
    "\"我跟它们的首领交过手。一个穿黑袍的人，手里没有武器——他只用了一根手指，就把我的枪断成了两截。",
    "\"然后他看着我，说了一句话。",
    "\"什么话？\"",
    "罗兰的声音低下来：\"他说，\'凡人，你挡不住的。回去吧。告诉你的国王，准备投降。\'",
    "他把断枪放回铁箱，锁好。",
    "\"所以我回来了。\"他说，\"回来打铁。因为我知道，我挡不住。但至少，我能给我弟弟打一把剑——让他能自保。"
  ],
  options:[{t:"记下这些，告辞", effect:{flag:"roland_irongate_story",karma:1}, go:"arrive_generic"}]
};};

  

N["npc_roland_brother"] = function(){ return {
  place:"北方公国 · 铁壁城铁匠铺", where:"",
  text:[
    "\"我弟弟？\"罗兰的表情柔和了一点，\"他在后面弹琴。",
    "他指了指内室。你听到了——隐约有琴声传出来，很轻，很慢，像雪落在地上。",
    "\"他叫卢卡。\"罗兰说，\"十六岁。弹琴的天赋比我打铁的天赋高多了。",
    "\"但北边不太平。我不想让他一辈子待在铁壁城——这里迟早会打仗。我想送他去南方，去精灵王国，那里安全。",
    "\"但他不肯。\"罗兰苦笑了一下，\"他说，哥哥在哪里，他就在哪里。",
    "琴声停了。一个少年从内室探出头来，金发碧眼，跟罗兰长得很像，但比他清秀得多。",
    "\"哥，\"少年说，\"该吃饭了。"
  ],
  options:[{t:"告辞，不打扰他们", effect:{flag:"roland_brother_met"}, go:"arrive_generic"}]
};};

  

N["npc_silvia_ball"] = function(){ return {
  place:"南方城邦 · 银月庄园", where:"",
  text:[
    "银月庄园的舞厅很华丽。水晶灯从穹顶垂下来，把每个人的脸都照得很亮。",
    "西尔维娅站在舞厅中央，穿着一件深蓝色的长裙，脖子上戴着一串珍珠。她在跟一个商人说话，脸上带着恰到好处的微笑。",
    "你注意到她的眼神——她在笑，但眼睛没在笑。她的目光一直在扫过舞厅的各个角落，像在找什么人。",
    "一曲终了。她看到了你，眼睛亮了一下，然后朝你走过来。",
    "\"旅人，\"她说，\"你来得正好。我正缺一个舞伴。"
  ],
  options:[
    {t:"邀她跳舞", check:{a:"CHA",sk:"speech",label:"共舞"},
  tier:{
    crit:function(){return[pickV(["你走过去，没有直接邀舞，而是先观察了一下——她的舞步很轻，重心偏左，说明她习惯用左手发力。而且，她的眼神一直在扫过舞厅的各个角落——她在找人，或者说，在确认某些人的位置。你走过去，微微鞠躬：'西尔维娅小姐，我注意到你在找一个安全的舞伴——一个不会在跳舞的时候问你生意问题的人。'她愣了一下，然后笑了——这次是真的笑：'你很敏锐。'她伸出手，'那就跳一支吧。'音乐响起，你带着她旋转。她的手很凉，像一块玉。'你知道吗，'她在你耳边轻声说，'这个舞厅里，有三个人是暗蚀会的。'你差点踩错步子。'别紧张。'她笑了，'我知道他们是谁，他们也知道我知道。我们在玩一场游戏。'","你走过去，没有说'能请你跳支舞吗'——而是说：'西尔维娅小姐，我知道你今天晚上很累了。跟三个商会的代表谈过话，又应付了两个追求者。现在，你需要一个不需要说话的舞伴。'她的眼睛亮了——你说的全对。'你怎么知道？'她问。你说：'因为我一直在观察。而且，我注意到你的酒杯已经空了一刻钟了——你在等一个借口离开那个角落。'她笑了，伸出手：'你很有趣。跳一支吧。'在舞池里，她告诉你了一些重要的信息——关于暗蚀会在南方的渗透。"],"silvia_dance_crit")]},
    ok:function(){return[pickV(["你走过去，微微鞠躬：'西尔维娅小姐，能请你跳支舞吗？'她看了你一眼，然后伸出手：'好啊。'音乐响起，你带着她旋转。她的手很凉。'你知道吗，'她在你耳边说，'这个舞厅里，有三个人是暗蚀会的。'你差点踩错步子。","你邀她跳舞，她同意了。在舞池里，她告诉了你一些关于暗蚀会的秘密。"],"silvia_dance_ok")]},
    fail:function(){return[pickV(["你走过去邀舞，但你的姿势太僵硬了——鞠躬的时候差点摔倒，说话也结结巴巴的。她看了你一眼，嘴角动了动，不知道是不是在笑：'好吧。'她伸出手，但你能感觉到，她对你没什么兴趣。跳舞的时候，她一直在看别的地方，没有跟你说几句话。一支舞结束，她礼貌地说了声'谢谢'，就转身走了。你什么信息都没得到。","你邀舞成功了，但表现不佳。她对你没什么兴趣，没有透露太多信息。"],"silvia_dance_fail")]},
    critfail:function(){return[pickV(["你走过去邀舞，但太紧张了——你踩了她的脚。'哎呀！'她叫了一声，后退了一步。你赶紧道歉，但已经晚了——整个舞厅的人都看了过来。她的脸涨得通红，又羞又怒：'你！'你结结巴巴地道歉，但她根本不听——她提起裙子，转身就走，连头都不回。你站在舞池中央，所有人都在看着你，有人在偷笑，有人在指指点点。你恨不得找个地缝钻进去。更糟的是，你踩的那一脚，正好踩在她的脚背上——她的脚肿了好几天，连路都走不了。从那以后，西尔维娅对你的印象差到了极点。银月家族的人，也都知道了'那个踩了小姐脚的蠢人'。你在南方城邦的社交圈，彻底社死了。"],"silvia_dance_cf")]}
  },
  onCrit:{silvia_bond:8,flag:"silvia_impressed_deep",flag:"darkcult_in_south_ballroom"},
  onOk:{silvia_bond:3,flag:"silvia_impressed"},
  onFail:{silvia_bond:-2},
  onCritFail:{silvia_bond:-10,flag:"silvia_humiliated",rep_south:-5},
  effect:{time:1}, go:"npc_silvia_dance"},
    {t:"\"我不是来跳舞的。\"", go:"npc_silvia_business"}
  ]
};};

  

N["npc_silvia_dance"] = function(){ return {
  place:"南方城邦 · 银月庄园舞厅", where:"",
  text:[
    "你伸出手，她搭上来。她的手很凉，像一块玉。",
    "音乐响起。是一支慢舞，你带着她在舞池里旋转。她的舞步很轻，像踩在云上。",
    "\"你知道吗，\"她在你耳边轻声说，\"这个舞厅里，有三个人是暗蚀会的。",
    "你差点踩错步子。",
    "\"别紧张。\"她笑了，\"我知道他们是谁，他们也知道我知道。我们在玩一场游戏——谁先动手，谁就输。",
    "\"你呢？\"她看着你的眼睛，\"你是哪一边的？"
  ],
  options:[
    {t:"\"我哪边都不是。我只是个旅人。\"", go:"npc_silvia_neutral"},
    {t:"\"我是来阻止他们的。\"", effect:{flag:"silvia_ally_offer"}, go:"npc_silvia_ally"}
  ]
};};

  

N["npc_silvia_business"] = function(){ return {
  place:"南方城邦 · 银月庄园", where:"",
  text:["夜风从南边吹来，带着咸味和一种说不上来的腥气。西尔维娅靠在栏杆上，姿势很放松，像一只晒太阳的猫。", "「你不问，我也知道你想问什么。」她忽然说，「每个来找我的人，问的都是这三件事之一。银穗商路，暗蚀会，或者我。」", "她转过头，目光在月光下显得很浅：「先告诉你一个规矩：在我这里，问问题，要拿东西换。故事、情报、消息——什么都行，只要你拿得出手。」", "「你拿什么换？」你问。", "她笑了一下：「我拿『真话』换。」她顿了顿，「这年头，真话比金子贵。你想要我的真话，就得先证明，你给得起你的。」", "西尔维娅挑了挑眉。", "\"不是来跳舞的？\"她说，\"那是来做生意的？还是来——打探消息的？", "她带你走到舞厅的阳台上。夜风从南边吹过来，带着海水的咸味。", "\"说吧。\"她靠在栏杆上，\"你想知道什么？银穗商路？暗蚀会？还是——我？", "她的语气很轻松，但你知道，她在试探你。", "她带你走回舞厅。音乐声重新淹没了你们，人们旋转着，没有人注意阳台边这两个人。", "她在一个侍者耳边说了句什么。侍者很快端来两杯酒，颜色一深一浅。她推给你深的那杯：「喝吧。这杯没掺东西。」", "你端起酒杯，没有立刻喝。她看着你，笑：「谨慎是好事。在南边，谨慎的人活得长。」", "你自己喝了一口。酒很烈，一路烧到胃里。她把浅的那杯一饮而尽，放下杯子：「说吧。你挑一个问题。我只答一次，答完，我们两清。」", "你放下杯子，看着她的眼睛：「我想知道，暗蚀会在南边，到底渗透到了哪一层。」", "她端着空杯子，沉默了很久。舞厅的音乐换了一曲，人群转了半个圈。她终于开口：「你确定要问这个？问了这个——你就回不去了。」"] /*v45inj:npc_silvia_business*/,
  options:[
    {t:"\"银穗商路的事，你知道多少？\"", go:"npc_silvia_silverroad"},
    {t:"\"暗蚀会在南方的渗透，你知道多少？\"", go:"npc_silvia_darkcult"}
  ]
};};

  

N["npc_silvia_silverroad"] = function(){ return {
  place:"南方城邦 · 银月庄园阳台", where:"",
  text:[
    "西尔维娅的表情冷了一度。",
    "\"银穗商路。\"她说，\"我损失了三支商队，六十个人，价值三千金龙的货物。",
    "\"我查了三个月。查到了一些东西——那些袭击商队的人，不是普通的强盗。他们有制式的武器，有统一的暗号，还有——非常充足的资金。",
    "\"谁在资助他们？\"你问。",
    "她看了你一眼。\"你觉得呢？",
    "\"暗蚀会。\"你说。",
    "她点了点头。\"金库司。他们在用钱养着这些强盗，截断商路，然后低价收购撑不下去的商会。等他们控制了南方的商业，整个大陆的经济命脉就握在他们手里了。",
    "\"我在反击。\"她说，\"但一个人，力量有限。"
  ],
  options:[
    {t:"\"我可以帮你。\"", effect:{flag:"silvia_ally_offer",rep:2}, go:"arrive_generic"},
    {t:"记下这些，告辞", effect:{flag:"silvia_silverroad_intel"}, go:"arrive_generic"}
  ]
};};

  

N["npc_silvia_darkcult"] = function(){ return {
  place:"南方城邦 · 银月庄园阳台", where:"",
  text:[
    "西尔维娅沉默了一会儿。",
    "\"暗蚀会在南方的渗透，比你想象的深。\"她说，\"五大城邦里，有两个城邦的议长已经被他们收买了。",
    "\"商会里，有三分之一的高层跟他们有利益往来。甚至——银月家族内部，都有他们的人。",
    "\"你怎么知道这些？\"你问。",
    "\"因为我是商人。\"她笑了，\"商人最擅长的，就是算账。谁的钱来路不明，谁的支出对不上收入——一算就知道。",
    "\"但我不敢动他们。\"她的声音低下来，\"因为我一动，他们就会动我弟弟。我弟弟在东部王国读书，他不知道这些事。",
    "\"所以我在等。等一个能帮我的人。",
    "她看着你。月光照在她脸上，你第一次在她脸上看到了——脆弱。"
  ],
  options:[
    {t:"\"我可以帮你。\"", effect:{flag:"silvia_ally_offer",rep:2}, go:"arrive_generic"},
    {t:"\"你弟弟叫什么？我可以去看看他。\"", effect:{flag:"silvia_brother_info"}, go:"arrive_generic"}
  ]
};};

  

N["npc_silvia_neutral"] = function(){ return {
  place:"南方城邦 · 银月庄园舞厅", where:"",
  text:[
    "西尔维娅看了你一眼，笑了。",
    "\"哪边都不是？\"她说，\"在这个时代，哪边都不是的人，活不长。",
    "\"但你很有趣。\"她继续说，\"大多数人要么投靠教会，要么投靠暗蚀会，要么投靠某个国王。你说你哪边都不是——要么是你太天真，要么是你太强大。",
    "\"我希望是后者。\"她松开你的手，退后一步，\"因为这个大陆，需要一个不站任何一边的人。",
    "音乐停了。她朝你行了一个礼，然后转身走进了人群。",
    "你站在舞池中央，手里还残留着她指尖的温度。"
  ],
  options:[{t:"离开舞厅", effect:{flag:"silvia_impressed"}, go:"arrive_generic"}]
};};

  

N["npc_silvia_ally"] = function(){ return {
  place:"南方城邦 · 银月庄园舞厅", where:"",
  text:[
    "西尔维娅盯着你看了很久。",
    "\"你知道你在说什么吗？\"她问，\"跟暗蚀会作对，是会死的。",
    "\"我知道。\"你说。",
    "她沉默了一会儿，然后从脖子上摘下那串珍珠，塞到你手里。",
    "\"这串珍珠，\"她说，\"里面有一颗是空心的，藏着一份名单——南方所有跟暗蚀会有勾结的人的名单。",
    "\"拿着它。如果你真的要阻止他们，这份名单会有用。",
    "\"还有——\"她凑近你，声音压得极低，\"如果有一天你需要帮助，带着这串珍珠来银月庄园。我会帮你。",
    "她转身走了。深蓝色的裙摆消失在人群里，像一片深海。"
  ],
  options:[{t:"收下珍珠，离开", effect:{item:"银月珍珠项链",flag:"silvia_ally",flag:"south_darkcult_list"}, go:"arrive_generic"}]
};};





  

N["npc_overview"] = function(){ return {
  place:"NPC剧情",
  text:["关键人物。","在艾尔达大陆上，有一些人，他们的名字和命运，和整个世界的走向纠缠在一起。","你坐在油灯下，翻看着那本从守望者密室里带出来的《人物志》。书页已经泛黄了，边角被反复摩挲得发毛。","墨丘利·星辰之眼——前守望者执灯人，灵魂魔法教授，塞拉芬的挚爱。他的眼睛能看到灵魂的流动，他的灵魂能和死者对话。三百年前，他因为塞拉芬的事，离开了守望者，成了艾尔达魔法学院的教授。","奥雷利安·晨曦——守望者首席守护者，半神，活了三千年。他是黄林晶时代最后的见证者，是七印的守护者，是守望者的灵魂。他的眼睛里，藏着三千年的秘密。","亚历山大·金秤——美第奇商会的管事，金秤家族的养子。他的真实身份，是美第奇家族的后裔。他的一生，都在为复兴美第奇家族而努力。","你合上书，吹灭了油灯。黑暗中，你能听到自己的心跳声。","这些人，你都见过。他们有的是你的导师，有的是你的朋友，有的是你的敌人。","但你知道，他们每个人的背后，都有一个故事。一个关于爱、关于恨、关于背叛、关于救赎的故事。","而你的故事，已经和他们的故事，纠缠在了一起。","窗外，夜风吹过，带来了远处的钟声。你拉紧被子，闭上了眼睛。","明天，又是新的一天。你的道路，还在继续。而这些人的故事，也还在继续。","你不知道的是，在你睡着之后，你的窗外，站着一个人。他穿着灰色的斗篷，脸上戴着面具。他看了你很久，然后消失在了夜色里。","他的手里，握着一封信。信封上，写着你的名字。"],
  options:[
    {t:"墨丘利的故事", effect:{time:0}, go:"npc_mercury_intro"},
    {t:"奥雷利安的故事", effect:{time:0}, go:"npc_aurelian_intro"},
    {t:"亚历山大的故事", effect:{time:0}, go:"npc_alexander_intro"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


  

N["npc_mercury_intro"] = function(){ return {
  place:"墨丘利·星辰之眼",
  text:["墨丘利·星辰之眼。","你第一次见到墨丘利，是在艾尔达魔法学院的第一堂灵魂魔法课上。","那天，你走进教室，看到一个男人站在讲台上。他看起来三十多岁，身材修长，穿着一件深蓝色的长袍，袍子上绣着星星和月亮的图案。他的头发是银白色的，梳理得一丝不苟，脸上带着一种温和的、但又有些疏离的笑容。","他的眼睛是浅灰色的，像是蒙了一层雾。但你能感觉到，那双眼睛正在仔细地打量你——不只是打量你的外表，而是在打量你的灵魂。","「我是墨丘利。」他说，声音温和而清晰，在教室里回荡，「你们的灵魂魔法教授。」","「在我的课上，你们会学到如何感知灵魂，如何和灵魂对话，如何引导灵魂前往死后的世界。」","「但我要先警告你们——灵魂魔法是一把双刃剑。它能让你看到别人看不到的东西，也能让你被别人看不到的东西看到。」","「每一个灵魂法师，都在光明和黑暗之间行走。一步走错，就会坠入深渊。」","他的目光扫过教室，最后停在了你的身上。他的眼睛里，闪过一丝惊讶。","「你。」他指着你，「下课后来我办公室一趟。」","下课后，你来到了墨丘利的办公室。办公室在学院塔楼的最高层，窗户面对着整个交汇城。","墨丘利坐在书桌后面，桌上摆着一杯茶，茶还冒着热气。","「坐吧。」他说，指了指对面的椅子。","你坐了下来。他看着你，沉默了很久，然后开口了。","「你的灵魂，很特别。」他说，「我活了三百多年，见过无数的灵魂。但你的灵魂，是我见过的最……复杂的。」","「复杂？」你问。","「你的灵魂里，有很多东西。」墨丘利说，他的手指轻轻敲着桌面，「有过去，有现在，有未来。有光明，有黑暗。有……命运。」","「命运？」","「是的。」墨丘利说，他的表情变得严肃了，「你是被命运选中的人。你的未来，会和整个大陆的命运纠缠在一起。」","「我观察你很久了。从你入学的那天起，我就在观察你。」","他站起来，走到窗前，看着外面的城市。夕阳把他的影子拉得很长，投在地板上，像是一个巨大的十字架。","「我会教你灵魂魔法。」他说，背对着你，「但我也要警告你——你的道路，会比任何人都艰难。你会看到很多可怕的东西，会经历很多痛苦的事情。」","「你准备好了吗？」","你看着他的背影。夕阳的光从窗户照进来，把他的银白色头发染成了金色。","「我准备好了。」你说。","墨丘利转过身，看着你，笑了。那笑容里，有欣赏，有担忧，还有一丝……你看不懂的情绪。","「很好。」他说，「从今天起，你就是我的学生了。」","你不知道的是，在你离开办公室之后，墨丘利站在窗前，看着你远去的背影，喃喃道：「塞拉芬，你看到了吗？他来了。那个我们等了三百年的人。」","风吹过塔楼，带来了远处的钟声。墨丘利的眼睛里，有泪光在闪烁。"],
  options:[
    {t:"和墨丘利交谈", check:{a:"CHA",sk:"口才",label:"魅力·交谈",target:55},
      tier:{
        crit:function(){return[pickV(["你和墨丘利聊了很久，他告诉你一些关于守望者和灵魂魔法的秘密。墨丘利好感+10，线索+2。","墨丘利对你敞开心扉，告诉了你他和塞拉芬的故事。墨丘利好感+15，SAN-3。"],"mercury_talk_crit")]},
        ok:function(){return[pickV(["你和墨丘利聊了一会儿，了解了一些灵魂魔法的知识。墨丘利好感+5。","墨丘利对你的印象不错。"],"mercury_talk_ok")]},
        fail:function(){return[pickV(["墨丘利心不在焉，没怎么理你。","你没能和墨丘利深入交谈。"],"mercury_talk_fail")]},
        critfail:function(){return[pickV(["你问了不该问的问题，墨丘利生气了，叫你离开。墨丘利好感-10。","你不小心提到了塞拉芬，墨丘利的表情变得非常可怕。墨丘利好感-15，SAN-5。"],"mercury_talk_critfail")]}
      },
      effect:{time:1}, go:"npc_mercury_story"},
    {t:"偷偷观察他的研究室", check:{a:"AGI",sk:"潜行",label:"敏捷·窥探",target:65},
      tier:{
        crit:function(){return[pickV(["你偷偷潜入了墨丘利的研究室，发现了一些惊人的东西——他在研究如何复活死者。线索+3，SAN-5。","你在研究室里找到了墨丘利的日记，里面记录了他和塞拉芬的故事，以及守望者的秘密。线索+3，墨丘利好感-5（如果被发现）。"],"mercury_spy_crit")]},
        ok:function(){return[pickV(["你看到了一些研究资料，但没有发现什么特别的。线索+1。","你了解了一些墨丘利的研究方向。"],"mercury_spy_ok")]},
        fail:function(){return[pickV(["你被墨丘利发现了，他叫你离开。墨丘利好感-5。","你没能潜入研究室。"],"mercury_spy_fail")]},
        critfail:function(){return[pickV(["你触发了研究室的防御机制，被灵魂之力攻击了。HP-15，SAN-10，墨丘利好感-10。","你被墨丘利当场抓住，他非常生气。墨丘利好感-20，你被赶出了学院。"],"mercury_spy_critfail")]}
      },
      effect:{time:1}, go:"npc_mercury_story"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_mercury_story"] = function(){ return {
  place:"墨丘利的故事",
  text:["墨丘利·故事。","那是你跟着墨丘利学习的第三年。","那天晚上，你在图书馆里查资料，无意间发现了一本旧日记。日记的封面是黑色的，没有署名。你翻开第一页，上面的字迹很潦草，像是在很匆忙的情况下写的。","你读了起来。越读，你的心跳越快。","那是墨丘利的日记。","日记里记录了他的过去——他的童年，他的觉醒，他加入守望者，他遇到塞拉芬，他和塞拉芬的爱情，他和塞拉芬的决裂，塞拉芬的失踪，他离开守望者。","你读到了一段让你震惊的内容。","「三百年前。塞拉芬发现了守望者的秘密——他们在用灵魂之眼和深渊沟通。不是为了消灭深渊，而是为了和深渊做交易。」","「她想阻止他们。她带着灵魂之眼，走进了地下图书馆的最深处，想销毁那些实验资料。」","「但守望者发现了。他们把她封印在了地下图书馆的最深处。对外，他们说她失踪了。」","「我去找奥雷利安理论。他告诉我——这是必要的牺牲。为了守护七印，为了守护世界，有些事情必须做。」","「必要的牺牲？」我笑了，笑得眼泪都流了出来，「她是我爱的人。她不是牺牲品。」","「我离开了守望者。我发誓，总有一天，我会救她出来。」","「三百年了。我一直在等。等一个能帮我救她出来的人。」","你合上书，手在发抖。","原来如此。墨丘利教你灵魂魔法，不只是因为你有天赋——他是在等你变强，等你能帮他救塞拉芬。","你拿着日记，找到了墨丘利。","他正在办公室里喝茶。看到你手里的日记，他的表情变了。","「你看到了。」他说，不是问句。","「为什么不告诉我？」你问。","墨丘利沉默了很久，然后说：「因为我不想把你卷进来。塞拉芬的事，是我的事。我不想让你冒险。」","「但你一直在等我变强。」你说，「你在等我帮你救她。」","墨丘利看着你，眼中闪过一丝痛苦：「是的。我承认。我一直在等。等了三百年。」","「但我不想强迫你。这是我的事，不是你的。你可以选择帮我，也可以选择不帮。」","你看着他。这个活了三百年的男人，这个你尊敬的导师，这个你视为朋友的人——他的眼睛里，有三百年的痛苦和等待。","「我帮你。」你说。","墨丘利的眼睛亮了。然后，他笑了——那是你第一次看到他真正地笑。","「谢谢你。」他说，声音在发抖，「三百年了。终于有人愿意帮我了。」","他从书桌的抽屉里拿出一张地图，铺在桌上。地图上画着交汇城的地下，标注着守望者秘密图书馆的位置。","「地下图书馆的最深处，有一个封印。塞拉芬就在那里。」墨丘利说，他的手指点在地图的一个位置上，「但封印很强大，需要灵魂魔法才能打开。」","「你准备好了吗？」","你看着地图，看着墨丘利充满期待的眼睛，点了点头。","「准备好了。」","从那天起，你的道路，和墨丘利的等待，和塞拉芬的命运，纠缠在了一起。","而三百年的秘密，即将被揭开。"],
  options:[
    {t:"「我帮你找塞拉芬。」", effect:{time:1,墨丘利_bond:20,flag:"help_find_seraphine"}, go:"relic_soul_eye"},
    {t:"「守望者的秘密是什么？」", check:{a:"CHA",sk:"口才",label:"魅力·追问",target:70},
      tier:{
        crit:function(){return[pickV(["墨丘利告诉你真相：守望者一直在用灵魂之眼和深渊沟通，试图和深渊做交易。「他们不是在守护世界，」他说，「他们是在利用世界。」线索+3，SAN-10。","墨丘利告诉你，守望者的创始人黄林晶，可能根本就不是英雄。「他留下七印，不是为了封印深渊，而是为了控制深渊。」线索+3，SAN-15。"],"mercury_secret_crit")]},
        ok:function(){return[pickV(["墨丘利告诉了你一些守望者的秘密，但核心部分他没有说。线索+1。","墨丘利对守望者的事讳莫如深。"],"mercury_secret_ok")]},
        fail:function(){return[pickV(["墨丘利不愿意谈论守望者的秘密。","他转移了话题。"],"mercury_secret_fail")]},
        critfail:function(){return[pickV(["你的追问让墨丘利警惕起来，他认为你是守望者派来的探子。墨丘利好感-15。","墨丘利叫你不要再问了，然后把你赶了出去。"],"mercury_secret_critfail")]}
      },
      effect:{time:1}, go:"npc_mercury_climax"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_mercury_climax"] = function(){ return {
  place:"墨丘利的抉择",
  text:["墨丘利·高潮。","你和墨丘利潜入了交汇城的地下，来到了守望者秘密图书馆的最深处。","一路上，你们避开了守望者的守卫，破解了无数的陷阱和封印。墨丘利对这里很熟悉——三百年前，他就是守望者的执灯人，这里的每一条走廊，每一个房间，他都记得清清楚楚。","最后，你们来到了一扇门前。","门是用黑色的石头做的，上面刻满了灵魂符文。符文在黑暗中泛着暗红色的光，发出低沉的嗡鸣声。","「就是这里。」墨丘利说，他的声音在发抖，「塞拉芬就在门后面。」","他伸出手，放在门上。灵魂力量涌入符文，符文开始发光，开始变化。","门开了。","门后面是一个小房间。房间的中央，有一个封印阵，封印阵里，有一个女人的灵魂。","她穿着银白色的长袍，长发飘逸，面容美丽而疲惫。她的眼睛是纯银色的，没有瞳孔，像是两汪月光。","塞拉芬。","墨丘利冲了进去，跪在封印阵前。","「塞拉芬！」他喊道，声音嘶哑，「我来了！我来救你了！」","塞拉芬睁开眼睛，看着墨丘利。她的眼睛里，有惊讶，有痛苦，还有……三百年的思念。","「墨丘利。」她说，声音很轻，像是从很远的地方传来，「你怎么来了？」","「我来救你出去。」墨丘利说，他开始尝试解开封印，「三百年了。我等了三百年了。」","「不要。」塞拉芬说，她的声音里有一丝急切，「这个封印，不能解开。」","「为什么？」","「因为封印的不只是我。」塞拉芬说，她的眼神变得严肃了，「还有……深渊之主的一部分意识。」","「我当年发现守望者在和深渊做交易，我带着灵魂之眼来到这里，想销毁实验资料。但我发现，守望者已经把深渊之主的一部分意识，封印在了这里。」","「如果我离开，封印就会减弱，深渊之主的意识就会苏醒。」","墨丘利愣住了。他看着塞拉芬，眼中充满了痛苦和挣扎。","「那怎么办？」他问，「我不能让你永远待在这里。」","「有一个办法。」塞拉芬说，她看向你，「用你的灵魂魔法，把深渊之主的意识，从我的灵魂里抽出来，封印在别的地方。」","「这样，我就能自由了。而深渊之主的意识，也不会苏醒。」","你看着塞拉芬，又看了看墨丘利。墨丘利的眼睛里，有期待，有担忧，还有一丝……恐惧。","「我来。」你说。","你走到封印阵前，伸出手。灵魂力量涌入封印，包裹住了塞拉芬的灵魂。你能感觉到——在她的灵魂深处，有一股黑暗的、强大的、充满恶意的力量。","那是深渊之主的意识。","你用尽全力，把那股力量从塞拉芬的灵魂里抽了出来。它在咆哮，在挣扎，在试图吞噬你。","但你没有退缩。你用你的灵魂，用你的意志，把它封印在了你随身携带的一颗水晶里。","封印阵消失了。塞拉芬的灵魂变得透明，然后——她有了身体。","她站了起来，走到墨丘利面前。","墨丘利看着她，眼泪流了下来。他伸出手，碰了碰她的脸——是温热的。她真的活过来了。","「塞拉芬。」他说，声音在发抖。","「墨丘利。」她说，微笑着，「我回来了。」","他们拥抱在了一起。三百年的等待，三百年的痛苦，在这一刻，终于有了回报。","你站在一旁，看着他们，心里有一种说不出的感动。","但你也知道——你手里的水晶里，封印着深渊之主的一部分意识。这只是开始。真正的战斗，还在后面。","地下图书馆的深处，黑暗中，有什么东西在注视着你们。","那是守望者的眼睛。"],
  options:[
    {t:"阻止他，劝他放弃", check:{a:"CHA",sk:"口才",label:"魅力·劝说",target:70},
      tier:{
        crit:function(){return[pickV(["你的话打动了墨丘利，他流下了眼泪。「你说得对。」他说，「塞拉芬不会希望我变成这样的。」他放弃了复活的计划。墨丘利好感+20，业力+15，SAN+10。","你用塞拉芬的记忆说服了墨丘利，他终于放下了执念。「谢谢你。」他说，「你让我重新找回了自己。」墨丘利好感+25，业力+20。"],"mercury_stop_crit")]},
        ok:function(){return[pickV(["你的劝说有一些效果，墨丘利暂时冷静了下来。墨丘利好感+5。","他答应你会好好考虑。"],"mercury_stop_ok")]},
        fail:function(){return[pickV(["墨丘利没有听你的劝告，他已经走火入魔了。","你的劝说没有任何效果。"],"mercury_stop_fail")]},
        critfail:function(){return[pickV(["你的话激怒了墨丘利，他认为你不理解他。「你什么都不懂！」他大喊，然后把你赶了出去。墨丘利好感-20，SAN-5。","墨丘利差点对你动手，你不得不赶紧逃跑。HP-10，墨丘利好感-15。"],"mercury_stop_critfail")]}
      },
      effect:{time:1}, go:"npc_mercury_resolution"},
    {t:"帮助他，哪怕是错的", effect:{time:1,墨丘利_bond:10,karma:-15,flag:"help_mercury_revive"}, go:"npc_mercury_resolution"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_mercury_resolution"] = function(){ return {
  place:"墨丘利的结局",
  text:["墨丘利·结局。","你和墨丘利、塞拉芬，一起离开了地下图书馆。","外面的天已经亮了。阳光洒在交汇城的街道上，温暖而明亮。塞拉芬站在阳光下，闭上眼睛，深深地吸了一口气。","「三百年了。」她说，「我终于又看到了太阳。」","墨丘利站在她身边，看着她，眼中满是温柔。三百年的等待，三百年的痛苦，都在这一刻，化作了幸福。","「接下来，你打算怎么办？」你问墨丘利。","墨丘利想了想，然后说：「我要带塞拉芬离开交汇城。去一个没有人认识我们的地方，安安静静地生活。」","「守望者那边——」","「守望者那边，我会处理。」墨丘利说，他的眼神变得坚定了，「我已经不是守望者了。他们没有权利管我。」","塞拉芬拉了拉墨丘利的手，笑了笑：「别惹事。我们安安静静地生活，就好。」","墨丘利看着她，笑了：「好。都听你的。」","你看着他们，心里有一种说不出的感觉。你为他们高兴——三百年的等待，终于有了结果。但你也有一丝不舍——你的导师，你的朋友，就要离开了。","「谢谢你。」墨丘利对你说，他的眼睛里有泪光，「如果没有你，我可能还要等很多年。」","「不用谢。」你说，「你是我的导师。帮助你，是应该的。」","墨丘利从怀里拿出一本书，递给你。","「这是我三百年的灵魂魔法心得。」他说，「送给你。也许对你有用。」","你接过书，手在发抖。这本书，是墨丘利三百年的心血。","「保重。」你说。","「你也是。」墨丘利说，「你的道路，还很长。记住——不管遇到什么，都不要放弃。」","他和塞拉芬转身，朝城外走去。阳光洒在他们身上，把他们的影子拉得很长。","你站在原地，看着他们远去的背影，直到他们消失在街道的尽头。","你低头看了看手里的书。书的封面是深蓝色的，上面绣着星星和月亮的图案。","你翻开第一页，上面写着一行字：「献给我的学生。愿你的灵魂，永远光明。」","你的眼睛湿润了。","风吹过街道，带来了远方的气息。你把书收进怀里，朝相反的方向走去。","你的道路，还在继续。而墨丘利和塞拉芬的故事，终于有了一个幸福的结局。","但你知道，这不是结束。守望者不会善罢甘休，深渊还在逼近，七印还在破碎。","你的战斗，才刚刚开始。"],
  options:[
    {t:"继续探索其他NPC的故事", effect:{time:1}, go:"npc_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


  

N["npc_aurelian_intro"] = function(){ return {
  place:"奥雷利安·晨曦",
  text:["奥雷利安·晨曦。","你第一次见到奥雷利安，是在守望者的秘密基地里。","那天，墨丘利带你去了一个地方——交汇城地下的一个秘密基地。基地的入口隐藏在一个普通的仓库里，穿过一条长长的走廊，你来到了一个巨大的地下空间。","空间的中央，有一个老人坐在椅子上。","他看起来很老了——老得你看不出他的年龄。他的头发全白了，脸上的皱纹深得像是刀刻的，他的手背上全是老人斑。他穿着一件灰色的长袍，袍子上绣着守望者的徽记——一盏灯。","但他的眼睛很亮。那是一种你从未见过的亮——像是两颗星星，藏在他的眼眶里，看穿了时间，看穿了空间，看穿了你的灵魂。","「你来了。」老人说，声音很苍老，但很清晰，在地下空间里回荡，「我等你很久了。」","「你是……」你问。","「奥雷利安·晨曦。」老人说，「守望者首席守护者。半神。活了三千年的老怪物。」","他笑了笑，那笑容里有一丝自嘲。","你的心跳加速了。奥雷利安——传说中的守望者首席，黄林晶时代最后的见证者，活了三千年的半神。","「坐吧。」奥雷利安说，指了指对面的椅子，「墨丘利应该跟你说了我的事。」","你坐了下来。他看着你，沉默了很久，然后开口了。","「三千年了。」他说，声音里有一丝疲惫，「我看着黄林晶加固七印，看着他消失，看着守望者成立，看着一代又一代的守望者死去。」","「我看着大陆变迁，看着王朝更迭，看着种族兴衰。三千年了，我什么都见过了。」","「但我还在等。等一个人。一个能改变未来的人。」","他看着你，眼睛里的光芒更亮了。","「那个人，就是你。」","你愣住了。","「我？」你问，「为什么是我？」","「因为你的灵魂。」奥雷利安说，「墨丘利跟我说了你的情况。你的灵魂很复杂，有过去，有现在，有未来。你是被命运选中的人。」","「三千年了，我一直在等这样的人。等一个能继承守望者意志的人，等一个能拯救世界的人。」","他站起来，走到你面前。他很老了，背已经驼了，但他站在你面前的时候，你能感觉到——一股强大的、古老的、温暖的力量，从他的身体里散发出来。","那是半神的力量。","「我会教你。」奥雷利安说，「教你守望者的知识，教你七印的秘密，教你如何对抗深渊。」","「但我也要警告你——这条道路，比你想象的更艰难。你会看到很多可怕的真相，会经历很多痛苦的事情。你可能会失去你爱的人，可能会失去你自己。」","「你准备好了吗？」","你看着他的眼睛。那双眼睛里，有三千年的智慧，三千年的痛苦，三千年的期待。","「我准备好了。」你说。","奥雷利安笑了。那笑容里，有欣慰，有担忧，还有一丝……你看不懂的情绪。","「很好。」他说，「从今天起，你就是守望者的候选者了。」","你不知道的是，在你离开之后，奥雷利安站在地下空间里，看着你远去的方向，喃喃道：「黄林晶，你看到了吗？他来了。那个能改变一切的人。」","「希望这一次，我们能成功。」","地下空间里，灯火摇曳。奥雷利安的影子，投在墙上，像是一个巨大的十字架。"],
  options:[
    {t:"和奥雷利安交谈", check:{a:"CHA",sk:"口才",label:"魅力·交谈",target:60},
      tier:{
        crit:function(){return[pickV(["奥雷利安对你很感兴趣，他告诉你一些关于三千年历史的秘密。奥雷利安好感+10，线索+3。","奥雷利安认为你是一个特别的人，他告诉了你守望者的真相。奥雷利安好感+15，SAN-5。"],"aurelian_talk_crit")]},
        ok:function(){return[pickV(["你和奥雷利安聊了一会儿，了解了一些历史知识。奥雷利安好感+5。","奥雷利安对你的印象不错。"],"aurelian_talk_ok")]},
        fail:function(){return[pickV(["奥雷利安很疲惫，没怎么理你。","你没能和奥雷利安深入交谈。"],"aurelian_talk_fail")]},
        critfail:function(){return[pickV(["你问了不该问的问题，奥雷利安的眼神变得锐利起来。「有些事，不是你该知道的。」奥雷利安好感-10。","你不小心冒犯了奥雷利安，他叫你离开。奥雷利安好感-15。"],"aurelian_talk_critfail")]}
      },
      effect:{time:1}, go:"npc_aurelian_story"},
    {t:"询问关于黄林晶的事", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:65},
      tier:{
        crit:function(){return[pickV(["奥雷利安告诉你他和黄林晶的故事，以及黄林晶失踪的真相。「他不是失踪了。」奥雷利安说，「他是被我们封印了。」线索+3，SAN-15。","奥雷利安告诉你，黄林晶可能还活着，就在第七印的下面。「他在那里，和深渊之主在一起。」线索+3，SAN-20。"],"aurelian_hlj_crit")]},
        ok:function(){return[pickV(["奥雷利安告诉了你一些黄林晶的故事，但关键部分他没有说。线索+1。","奥雷利安对黄林晶的事讳莫如深。"],"aurelian_hlj_ok")]},
        fail:function(){return[pickV(["奥雷利安不愿意谈论黄林晶。","他转移了话题。"],"aurelian_hlj_fail")]},
        critfail:function(){return[pickV(["你的问题让奥雷利安非常生气，他认为你在亵渎英雄。奥雷利安好感-15。","奥雷利安叫你不要再问了，然后把你赶了出去。"],"aurelian_hlj_critfail")]}
      },
      effect:{time:1}, go:"npc_aurelian_story"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_aurelian_story"] = function(){ return {
  place:"奥雷利安的故事",
  text:["奥雷利安·故事。","那是你跟着奥雷利安学习的第二年。","那天，奥雷利安给了你一个任务——去守望者的档案室，找一份三千年的文件。","档案室在地下空间的最深处，里面摆满了书架，书架上全是古老的文件和记录。你找了很久，终于在一个角落里，找到了那份文件。","文件的封面写着：『黄林晶失踪事件·绝密档案』。","你打开文件，读了起来。越读，你的心跳越快。","文件里记录了三千年前黄林晶失踪的真相——不是失踪，而是……被封印。","「艾尔达历1037年，黄林晶加固七印后，身体出现异常。经检查，黄林晶的身体里，有深渊之主的灵魂。」","「黄林晶在和深渊之主的战斗中，为了击败深渊之主，将其灵魂吸入了自己的身体。他本想用自己的意志压制深渊之主，但失败了。」","「为了不让深渊之主苏醒，黄林晶要求守望者将他封印。七印，就是封印他的枷锁。」","「黄林晶被封印后，守望者的使命，从『守护七印』变成了『守护秘密』。确保没有人知道真相，确保七印不被破坏。」","你合上书，手在发抖。","原来如此。七印不是用来封印深渊的——是用来封印黄林晶的。黄林晶不是英雄——他是深渊之主的容器。守望者不是守护者——他们是真相的掩盖者。","你拿着文件，找到了奥雷利安。","他正在地下空间的中央，坐在椅子上，看着一盏灯。那盏灯是守望者的圣物——『长明灯』，据说已经燃烧了三千年，从未熄灭。","「你看到了。」奥雷利安说，不是问句。","「为什么不告诉我？」你问，声音在发抖。","奥雷利安沉默了很久，然后说：「因为我怕你接受不了。」","「三千年了，这个秘密，只有守望者的首席守护者知道。我是第三任首席。在我之前，有两任首席，都因为这个秘密，疯了。」","「黄林晶是我的朋友。三千年前，我们一起战斗，一起加固七印。我亲眼看着他把深渊之主的灵魂吸入自己的身体，亲眼看着他请求我们封印他。」","「他说：『奥雷利安，封印我。不要让我苏醒。如果我苏醒了，深渊之主就会降临，世界就会毁灭。』」","「我亲手封印了他。」奥雷利安说，他的声音在发抖，「我亲手把我的朋友，关进了一个永远无法逃脱的牢笼。」","「三千年了。我每天都在问自己——我做的对吗？」","他看着你，眼睛里有泪光。","「你说，我做的对吗？」","你看着他。这个活了三千年的老人，这个半神，这个守望者的首席——他的眼睛里，有三千年的痛苦和愧疚。","「你做的对。」你说，「如果不封印他，世界就会毁灭。」","「但他是我的朋友。」奥雷利安说，眼泪流了下来，「我亲手封印了我的朋友。」","你走过去，拍了拍他的肩膀。","「会有办法的。」你说，「我们会找到办法，救他出来的。」","奥雷利安看着你，眼中闪过一丝希望：「真的吗？」","「真的。」你说，「我答应你。」","从那天起，你的道路，和奥雷利安的痛苦，和黄林晶的命运，纠缠在了一起。","而三千年的秘密，已经揭开了一角。"],
  options:[
    {t:"「你可以放下责任，去过自己的生活。」", check:{a:"CHA",sk:"口才",label:"魅力·劝说",target:70},
      tier:{
        crit:function(){return[pickV(["你的话让奥雷利安沉默了很久。「也许你说得对。」他说，「也许是时候了。」他决定寻找继承人，然后退休。奥雷利安好感+20，业力+10。","你说服了奥雷利安，他终于愿意放下重担。「谢谢你。」他说，「三千年了，终于有人对我说这句话。」奥雷利安好感+25，获得：奥雷利安的祝福。"],"aurelian_persuade_crit")]},
        ok:function(){return[pickV(["你的话有一些效果，奥雷利安开始考虑退休的事。奥雷利安好感+5。","他答应你会好好考虑。"],"aurelian_persuade_ok")]},
        fail:function(){return[pickV(["奥雷利安苦笑了一下：「你不懂。有些责任，是放不下的。」","你的劝说没有任何效果。"],"aurelian_persuade_fail")]},
        critfail:function(){return[pickV(["你的话激怒了奥雷利安，他认为你不理解他的牺牲。「你什么都不懂！」他大喊，「如果我放下责任，这个世界就完了！」奥雷利安好感-15。","奥雷利安差点对你动手，你不得不赶紧道歉。奥雷利安好感-10。"],"aurelian_persuade_critfail")]}
      },
      effect:{time:1}, go:"npc_aurelian_climax"},
    {t:"「我愿意继承你的责任。」", check:{a:"SPR",sk:"意志",label:"灵性·担当",target:75},
      tier:{
        crit:function(){return[pickV(["奥雷利安看着你，眼中闪过一丝光芒。「你真的愿意？」他说，「这意味着你将失去普通人的生活。」你点头。他开始传授你守望者的知识。奥雷利安好感+20，获得：守望者传承，声望+20。","奥雷利安非常感动，他决定把全部的知识都传授给你。「你就是我等了三千年的人。」奥雷利安好感+30，获得：半神之力（部分）。"],"aurelian_inherit_crit")]},
        ok:function(){return[pickV(["奥雷利安认为你还需要更多的磨练，但他开始关注你了。奥雷利安好感+10。","他答应会考虑让你做继承人。"],"aurelian_inherit_ok")]},
        fail:function(){return[pickV(["奥雷利安摇摇头：「你还太年轻了。」","他认为你还不够资格。"],"aurelian_inherit_fail")]},
        critfail:function(){return[pickV(["奥雷利安认为你在说大话，非常生气。「你根本不知道这意味着什么！」奥雷利安好感-15。","你的话让奥雷利安想起了一些不愉快的往事，他叫你离开。奥雷利安好感-10。"],"aurelian_inherit_critfail")]}
      },
      effect:{time:1}, go:"npc_aurelian_climax"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_aurelian_climax"] = function(){ return {
  place:"奥雷利安的抉择",
  text:["奥雷利安·高潮。","那是你跟着奥雷利安学习的第五年。","七印的情况越来越糟。第一印已经碎了，第二印在松动，第三印和第四印在变弱，第五印和第六印出现了异常。","奥雷利安知道，时间不多了。","那天，他把你叫到了地下空间的最深处。","那里有一扇门。门上刻着黄林晶的名字，还有一行字：『凡入此门者，当放弃一切希望。』","「这是什么地方？」你问。","「黄林晶的封印之地。」奥雷利安说，他的声音很沉重，「七印的核心。黄林晶的灵魂，就在这里沉睡。」","他推开门。","门后面是一个巨大的洞穴。洞穴的中央，有一个石棺。石棺上刻着七印的图案，图案在黑暗中泛着暗红色的光。","你们走到石棺前。奥雷利安把手放在石棺上，闭上眼睛。","「黄林晶。」他说，声音在洞穴里回荡，「我来看你了。」","石棺上的图案亮了一下。然后，一个声音从石棺里传了出来——古老的，疲惫的，充满了痛苦的声音。","「奥雷利安。」那个声音说，「三千年了。你还是来了。」","「我来了。」奥雷利安说，他的眼睛里有泪光，「我带了一个人来。他说，他能救你出去。」","「救我？」黄林晶的声音里有一丝苦涩，「没有人能救我。我的身体里，有深渊之主的灵魂。如果我出去了，深渊之主就会苏醒。」","「不。」你说，走到石棺前，「有办法。贤者之石。用贤者之石，把深渊之主的灵魂从你的身体里抽出来，封印在石头里。」","「贤者之石？」黄林晶的声音里有一丝惊讶，「你炼成了贤者之石？」","「还没有。」你说，「但我会炼成的。」","黄林晶沉默了很久。然后，他笑了——那笑声里，有欣慰，有感慨，还有一丝……希望。","「三千年了。」他说，「终于有人，想到了这个办法。」","「奥雷利安，你教出了一个好学生。」","奥雷利安擦了擦眼泪，笑了：「他不是我的学生。他是……命运选中的人。」","「命运？」黄林晶说，他的声音变得严肃了，「命运是最不可靠的东西。三千年了，我见过太多被命运背叛的人。」","「但你不同。」他说，「你让我看到了希望。」","石棺上的图案亮了起来。一道光从石棺里射出来，照在你的身上。你感觉到——一股力量，从石棺里涌入了你的身体。","那是黄林晶的力量。他的一部分力量，传给了你。","「这是我能给你的。」黄林晶说，「三千年的修为，全部传给你。」","「用它，炼成贤者之石。用它，拯救这个世界。」","你感觉到——你的力量在暴涨。启灵，凝元，化意，宗师，大宗师——你的境界在飞速提升。","最后，你达到了——半神。","光芒散去。你站在石棺前，浑身散发着强大的气息。","「谢谢你。」你说。","「不用谢。」黄林晶说，他的声音变得虚弱了，「我把力量传给了你，我剩下的时间……不多了。」","「在我彻底沉睡之前，我要告诉你一个秘密。」","「什么秘密？」","「七印的核心，不只是封印我。」黄林晶说，他的声音越来越低，「七印的核心，还有一个……后门。一个能让我彻底消亡，也能让深渊之主彻底消亡的后门。」","「后门的钥匙，就在第十二件神器——铸印里。」","「找到铸印。用铸印，打开后门。然后……一切就都结束了。」","他的声音消失了。石棺上的图案暗了下去。","奥雷利安看着石棺，眼泪流了下来。","「黄林晶。」他喃喃道，「你放心。我们会找到铸印的。我们会结束这一切的。」","你站在一旁，心里有一种说不出的感觉。黄林晶的力量在你体内流转，温暖而强大。","你的道路，从今天起，和黄林晶的遗愿，和七印的命运，纠缠在了一起。","而真正的战斗，才刚刚开始。"],
  options:[
    {t:"「我和你一起战斗。」", effect:{time:1,奥雷利安_bond:20,flag:"fight_with_aurelian"}, go:"npc_aurelian_resolution"},
    {t:"「你不会死的。」", check:{a:"CHA",sk:"口才",label:"魅力·安慰",target:65},
      tier:{
        crit:function(){return[pickV(["你的安慰让奥雷利安很感动。「谢谢你。」他说，「有你这句话，我就满足了。」奥雷利安好感+15，SAN+5。","你用真诚的话语打动了奥雷利安，他重新燃起了生的希望。「也许，我真的能活下来。」奥雷利安好感+20。"],"aurelian_comfort_crit")]},
        ok:function(){return[pickV(["你的安慰有一些效果，奥雷利安的心情好了一些。奥雷利安好感+5。","他感谢你的关心。"],"aurelian_comfort_ok")]},
        fail:function(){return[pickV(["奥雷利安只是笑了笑，没有说话。","你的安慰没有什么效果。"],"aurelian_comfort_fail")]},
        critfail:function(){return[pickV(["你的话让奥雷利安想起了一些悲伤的往事，他的心情更差了。奥雷利安好感-5。","你说错了话，奥雷利安叫你离开。"],"aurelian_comfort_critfail")]}
      },
      effect:{time:1}, go:"npc_aurelian_resolution"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_aurelian_resolution"] = function(){ return {
  place:"奥雷利安的结局",
  text:["奥雷利安·结局。","你离开了黄林晶的封印之地，和奥雷利安一起，回到了地下空间的中央。","奥雷利安坐在椅子上，看着那盏长明灯。灯火摇曳，把他的影子投在墙上，像是一个巨大的十字架。","「三千年了。」他说，声音里有一丝释然，「三千年的等待，三千年的痛苦，终于……要结束了。」","「黄林晶把力量传给了你。他相信你能拯救这个世界。」","他转过头，看着你。他的眼睛里，有三千年的智慧，三千年的痛苦，还有……三千年的期待。","「接下来，就看你的了。」他说，「我老了。三千年了，我已经没有力气再战斗了。」","「守望者的未来，就交给你了。」","你看着他。这个活了三千年的老人，这个半神，这个守望者的首席——他的背更驼了，他的皱纹更深了，他的头发更白了。","三千年的时间，终于在他身上留下了痕迹。","「你打算怎么办？」你问。","「我？」奥雷利安笑了笑，「我想休息了。三千年了，我从来没有休息过。」","「我想找一个安静的地方，种一些花，养一些鸟，安安静静地度过余生。」","「守望者那边——」","「守望者那边，我已经安排好了。」奥雷利安说，「新的首席守护者，已经选好了。他会带领守望者，继续守护七印的秘密。」","「而你——」他看着你，眼中闪过一丝光芒，「你不需要加入守望者。你有你自己的道路。」","他从怀里拿出一个东西，递给你。那是一盏小灯——和长明灯一模一样，只是小了很多。","「这是长明灯的火种。」他说，「送给你。不管你走到哪里，只要这盏灯还亮着，守望者就会支持你。」","你接过小灯。灯里的火焰在跳动，温暖而明亮。","「谢谢你。」你说。","「不用谢。」奥雷利安说，他站了起来，走到你面前，拍了拍你的肩膀，「是我要谢谢你。谢谢你，让我看到了希望。」","「三千年了，我第一次觉得，这个世界还有救。」","他转身，朝地下空间的出口走去。他的背很驼，他的脚步很慢，但他的背影，依然挺直。","「奥雷利安。」你喊道。","他停下脚步，回过头。","「保重。」你说。","他笑了笑：「你也是。」","然后他继续往前走，消失在了走廊的尽头。","你站在原地，手里握着那盏小灯。灯火在你的手心里跳动，温暖而明亮。","三千年的守望，终于结束了。奥雷利安可以休息了。","但你的道路，还在继续。黄林晶的遗愿，七印的命运，深渊的威胁——这些都在等着你。","你把小灯收进怀里，朝出口走去。","风吹过走廊，带来了远方的气息。你深吸一口气，加快了脚步。","你的传奇，才刚刚开始。而守望者的火种，永远与你同在。"],
  options:[
    {t:"继续探索其他NPC的故事", effect:{time:1}, go:"npc_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


  

N["npc_alexander_intro"] = function(){ return {
  place:"亚历山大·金秤",
  text:["亚历山大·金秤。","你第一次见到亚历山大，是在美第奇商会的大厅里。","那天，你去美第奇商会谈生意。大厅里人来人往，全是谈生意的商人。你站在柜台前，等着办事员处理你的文件。","然后，一个穿华贵衣服的年轻人走了过来。","他大概二十出头，身材修长，穿着一件深蓝色的丝绒长袍，袍子上绣着金色的花纹。他的头发是深棕色的，梳理得一丝不苟，脸上带着一种恰到好处的微笑——既不冷淡，也不过分热情。","他的眼睛是浅褐色的，带着商人特有的精明和审视。你能感觉到，他在看你的同时，已经在心里估算了你的身价、背景和利用价值。","「欢迎来到美第奇商会。」他说，声音温和而有磁性，「我是亚历山大·金秤。商会的……算是半个管事吧。」","他说『半个管事』的时候，嘴角微微上扬，像是在说一个只有自己知道的笑话。","「你是来谈生意的？」他问，微微歪头，看着你。","你点了点头，说明了来意。亚历山大听着，时不时地点点头，偶尔问一两个问题。他的问题很精准——总是能问到关键点上，让你不得不认真回答。","最后，你们达成了协议。亚历山大伸出手，和你握了握。","「合作愉快。」他说，他的手很有力，握得很稳。","「合作愉快。」你说。","你转身要走，亚历山大突然叫住了你。","「等等。」他说，他的表情变得严肃了一些，「你……是不是对美第奇家族感兴趣？」","你愣了一下。你确实在调查美第奇家族的事——四十年前的清洗，家族的遗产，还有那些被掩盖的真相。","「你怎么知道？」你问。","亚历山大笑了笑，但那笑容里没有温度：「因为我也是。」","他左右看了一眼，然后压低声音：「这里不是说话的地方。如果你想知道美第奇家族的真相，明天晚上，来码头的第三个仓库找我。」","说完，他转身走了。他的背影很挺拔，深蓝色的丝绒长袍在人群中格外显眼。","你站在原地，看着他远去的背影，心里有一种说不出的感觉。","亚历山大·金秤——美第奇商会的管事，金秤家族的养子。他为什么也在调查美第奇家族？他和那个被清洗的家族，有什么关系？","你想起了他右手无名指上的戒指——天平与蛇的徽章，但天平的一端是空的，没有蛇。","那不是美第奇家族的正式徽章。那是金秤家族的徽章。","少了的那一条蛇，去了哪里？","你拉紧了斗篷，走出了美第奇商会。夕阳把你的影子拉得很长，投在大理石地面上。","明天晚上，码头的第三个仓库。你会去的。","因为你知道，美第奇家族的真相，就藏在那里。"],
  options:[
    {t:"和亚历山大交谈", check:{a:"CHA",sk:"口才",label:"魅力·交谈",target:55},
      tier:{
        crit:function(){return[pickV(["你和亚历山大聊得很投缘，他告诉你一些商业上的秘密。亚历山大好感+10，金币+20（他给了你一个赚钱的建议）。","亚历山大对你非常欣赏，他邀请你加入金秤家族的核心圈子。亚历山大好感+15，声望+10。"],"alexander_talk_crit")]},
        ok:function(){return[pickV(["你和亚历山大聊了一会儿，了解了一些商业知识。亚历山大好感+5。","亚历山大对你的印象不错。"],"alexander_talk_ok")]},
        fail:function(){return[pickV(["亚历山大很忙，没怎么理你。","你没能和亚历山大深入交谈。"],"alexander_talk_fail")]},
        critfail:function(){return[pickV(["你问了不该问的问题，亚历山大警惕起来。亚历山大好感-10。","你不小心冒犯了亚历山大，他叫人送客。亚历山大好感-15。"],"alexander_talk_critfail")]}
      },
      effect:{time:1}, go:"npc_alexander_story"},
    {t:"询问关于美第奇家族的事", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:65},
      tier:{
        crit:function(){return[pickV(["亚历山大告诉你他的身世，以及他一直在调查美第奇家族被清洗的真相。「我怀疑，那场清洗背后有更大的阴谋。」线索+3。","亚历山大告诉你，他一直在寻找美第奇家族的其他幸存者。「如果你有任何线索，请告诉我。」线索+2，亚历山大好感+10。"],"alexander_medici_crit")]},
        ok:function(){return[pickV(["亚历山大告诉了你一些美第奇家族的历史。线索+1。","亚历山大对美第奇家族的事有所保留。"],"alexander_medici_ok")]},
        fail:function(){return[pickV(["亚历山大不愿意谈论美第奇家族。","他转移了话题。"],"alexander_medici_fail")]},
        critfail:function(){return[pickV(["你的问题让亚历山大警惕起来，他认为你是教会的探子。亚历山大好感-15。","亚历山大叫你不要再问了，然后把你赶了出去。"],"alexander_medici_critfail")]}
      },
      effect:{time:1}, go:"npc_alexander_story"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_alexander_story"] = function(){ return {
  place:"亚历山大的故事",
  text:["亚历山大·故事。","第二天晚上，你来到了码头的第三个仓库。","仓库里很暗，只有一盏油灯发出微弱的光。亚历山大站在仓库的中央，背对着你，手里拿着一个东西。","你来了。」他说，没有回头。","「你说你也在调查美第奇家族。」你说，「为什么？」","亚历山大转过身。他的手里，拿着一枚徽章——天平与蛇，美第奇家族的正式徽章。","「因为我是美第奇家族的人。」他说，他的声音很轻，但每个字都像是一块石头砸在你心上，「我的真名，是亚历山大·德·美第奇。」","你的心跳加速了。","「四十年前，教会清洗美第奇家族的时候，我才五岁。」亚历山大说，他的眼睛里有一丝痛苦，「我的父亲，洛伦佐·德·美第奇，把我托孤给了金秤家族。然后，他被教会抓走了，再也没有回来。」","「我的母亲，伊莎贝拉·金秤，也被抓走了。他们说她是异端，用火刑烧死了她。」","「我被金秤家族收养，改了名字，改了身份。我在金秤家长大，学习商业，学习政治，学习……复仇。」","「四十年了。我等了四十年，就是为了复兴美第奇家族，为我的父母报仇。」","他把徽章收进怀里，看着你。","「你呢？你为什么调查美第奇家族？」","你沉默了一会儿，然后告诉了他你的理由——你在调查七印的真相，而美第奇家族的清洗，似乎和七印有关。","亚历山大听着，眉头越皱越紧。","「七印？」他说，「我调查了四十年，从来没有听说过七印和美第奇家族有关。」","「那是因为教会掩盖了真相。」你说，「美第奇家族被清洗，不是因为异端。是因为他们知道了七印的秘密。」","亚历山大愣住了。然后，他的眼睛里闪过一丝光芒——不是愤怒，不是仇恨，而是……恍然大悟。","「原来如此。」他喃喃道，「我一直以为，教会清洗美第奇家族，是因为我们的财富和权力。但现在看来，不是。」","「是因为我们知道了不该知道的东西。」","他走到你面前，看着你，眼中充满了期待。","「你愿意帮我吗？」他问，「帮我查清美第奇家族被清洗的真相，帮我复兴美第奇家族。」","你看着他。这个你曾经视为同行的商人，这个你曾经欣赏的对手——现在，他的命运，和你的命运，纠缠在了一起。","「我愿意。」你说。","亚历山大笑了。那笑容里，有释然，有感激，还有一丝……复仇的火焰。","「好。」他说，「从今天起，我们就是盟友了。」","他伸出手，和你握了握。这一次，他的手握得更紧了。","从那天起，你和亚历山大结成了同盟。你们一起调查美第奇家族的真相，一起对抗教会的阴谋，一起寻找复兴的道路。","而四十年的仇恨，终于有了宣泄的出口。"],
  options:[
    {t:"「我愿意帮你。」", effect:{time:1,亚历山大_bond:20,flag:"help_alexander"}, go:"npc_alexander_climax"},
    {t:"「这件事太危险了，我不想卷入。」", effect:{time:1,亚历山大_bond:-5}, go:"npc_alexander_resolution"},
    {t:"「先告诉我，你查到了什么？」", check:{a:"CHA",sk:"口才",label:"魅力·追问",target:60},
      tier:{
        crit:function(){return[pickV(["亚历山大告诉你他查到的一切：美第奇家族被清洗，是因为他们发现了教会和深渊的秘密交易。「他们不是异端。」亚历山大说，「他们是知道了真相的人。」线索+3，SAN-10。","亚历山大告诉你，他已经找到了幕后黑手的线索——一个红衣主教。「但我没有证据。」他说，「我需要你帮我找到证据。」线索+3。"],"alexander_truth_crit")]},
        ok:function(){return[pickV(["亚历山大告诉了你一些他查到的情况，但关键证据他还没有。线索+1。","亚历山大对他的调查有所保留。"],"alexander_truth_ok")]},
        fail:function(){return[pickV(["亚历山大不愿意透露太多，他说等你加入了再说。","他转移了话题。"],"alexander_truth_fail")]},
        critfail:function(){return[pickV(["你的追问让亚历山大警惕起来，他认为你是来打探消息的。亚历山大好感-10。","亚历山大叫你不要再问了。"],"alexander_truth_critfail")]}
      },
      effect:{time:1}, go:"npc_alexander_climax"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_alexander_climax"] = function(){ return {
  place:"亚历山大的抉择",
  text:["亚历山大·高潮。","那是你和亚历山大结盟的第三年。","三年来，你们一起调查了美第奇家族被清洗的真相。你们发现了教会的阴谋，发现了暗蚀会的渗透，发现了一个惊人的事实——美第奇家族的清洗，是教会和暗蚀会联手策划的。","教会想掩盖七印的秘密，暗蚀会想夺取美第奇家族的财富。他们一拍即合，制造了那场清洗。","而更让你震惊的是——亚历山大的母亲，伊莎贝拉·金秤，没有死。","她被暗蚀会囚禁了，关在一个秘密的地方。暗蚀会想用她来要挟美第奇家族的残余势力。","那天，你和亚历山大，带着一群人，突袭了暗蚀会的秘密据点。","据点在死亡沙漠的边缘，一个废弃的神庙里。你们杀了进去，和暗蚀会的守卫展开了激烈的战斗。","亚历山大冲在最前面。他的手里握着一把剑——那是美第奇家族的传家宝，『天平之剑』。他的眼睛里，燃烧着复仇的火焰。","你们一路杀到了据点的最深处。那里有一间牢房，牢房里，关着一个女人。","她看起来五十多岁，头发全白了，脸上全是皱纹，身上的衣服破烂不堪。但她的眼睛很亮——和亚历山大的眼睛一模一样，浅褐色的，带着商人特有的精明。","「母亲！」亚历山大喊道，冲了过去。","女人抬起头，看着亚历山大。她的眼睛里，先是惊讶，然后是不敢置信，然后是——泪水。","「亚历山大？」她颤抖着说，「我的孩子？」","「是我！母亲！」亚历山大一剑劈开了牢门，冲进去抱住了她，「我来救你了！」","母子相拥而泣。四十年的分离，四十年的痛苦，在这一刻，终于有了回报。","你站在一旁，看着他们，心里有一种说不出的感动。","但你也知道——这不是结束。暗蚀会的大部队，随时可能赶来。","「我们走。」你说，「这里不安全。」","亚历山大擦了擦眼泪，点了点头。他扶着母亲，朝外面走去。","就在这时，一个声音从门口传来。","「想走？没那么容易。」","你转过头。一个穿黑袍的人站在门口，脸上戴着面具。他的手里，握着一把黑色的剑。","「暗蚀会五司长之一，行动司司长。」他说，「你们以为，能轻易从我的地盘上逃走？」","亚历山大把母亲护在身后，举起了天平之剑。","「那就试试看。」他说。","战斗爆发了。你和亚历山大联手，对抗行动司司长。他很强——比你们遇到的任何敌人都强。","但你们没有退缩。因为你们知道，退了，就前功尽弃了。","最后，你们合力，击败了行动司司长。他倒在地上，面具碎了，露出了一张你意想不到的脸。","「是你？」亚历山大惊呼道。","那个人，是金秤家族的族长——亚历山大的养父。","「对不起，亚历山大。」养父说，他的声音里有一丝痛苦，「我也是被逼的。暗蚀会抓了你的母亲，我不得不为他们做事。」","「但现在，一切都结束了。」","他闭上了眼睛。","亚历山大站在原地，看着养父的尸体，沉默了很久。","「走吧。」你说，拍了拍他的肩膀。","他点了点头，扶着母亲，走出了神庙。","夕阳洒在沙漠上，把一切都染成了金红色。亚历山大扶着母亲，走在你身边。","四十年的仇恨，终于有了结果。母亲救出来了，仇人也死了。","但你知道，这不是结束。暗蚀会还在，教会还在，深渊还在逼近。","你们的战斗，才刚刚开始。"],
  options:[
    {t:"「我愿意和你一起，哪怕是死。」", effect:{time:1,亚历山大_bond:30,flag:"alexander_plan"}, go:"npc_alexander_resolution"},
    {t:"「这个计划太冒险了，我们应该从长计议。」", check:{a:"INT",sk:"谋略",label:"智力·建议",target:65},
      tier:{
        crit:function(){return[pickV(["你提出了一个更稳妥的计划，亚历山大非常佩服。「你说得对。」他说，「我们应该先收集足够的证据，再一举揭发。」亚历山大好感+20，获得：谋略+1。","你的建议让亚历山大避免了一场灾难，他对你刮目相看。「你比我想象的更聪明。」亚历山大好感+25，声望+10。"],"alexander_advice_crit")]},
        ok:function(){return[pickV(["你的建议有一些道理，亚历山大决定重新考虑计划。亚历山大好感+5。","他答应会好好考虑。"],"alexander_advice_ok")]},
        fail:function(){return[pickV(["亚历山大没有采纳你的建议，他已经下定决心了。","你的建议没有什么效果。"],"alexander_advice_fail")]},
        critfail:function(){return[pickV(["你的建议让亚历山大很不满，他认为你在质疑他的能力。亚历山大好感-10。","亚历山大叫你不要再说了。"],"alexander_advice_critfail")]}
      },
      effect:{time:1}, go:"npc_alexander_resolution"},
    {t:"离开", effect:{time:0}, go:"npc_overview"}
  ]
};}


  

N["npc_alexander_resolution"] = function(){ return {
  place:"亚历山大的结局",
  text:["亚历山大·结局。","你和亚历山大，带着伊莎贝拉，回到了交汇城。","伊莎贝拉被囚禁了四十年，身体很虚弱。亚历山大请了最好的医生，日夜照顾她。","一个月后，伊莎贝拉的身体渐渐恢复了。她坐在美第奇商会的花园里，晒着太阳，看着亚历山大忙前忙后。","「孩子。」她说，「你已经做得够多了。美第奇家族的复兴，不急在一时。」","亚历山大走到母亲身边，蹲下来，握住她的手：「母亲，我答应过父亲，要复兴美第奇家族。我一定会做到的。」","伊莎贝拉笑了，她摸了摸亚历山大的头：「你父亲如果看到你现在的样子，一定会很骄傲。」","你站在花园的门口，看着他们母子，心里有一种说不出的温暖。","亚历山大转过头，看到了你，笑了笑：「进来坐吧。站在门口干什么？」","你走进去，在他们对面坐下。伊莎贝拉看着你，眼中满是感激：「谢谢你。如果没有你，亚历山大可能救不出我。」","「不用谢。」你说，「我们是盟友。」","「盟友？」伊莎贝拉笑了，「不只是盟友吧。我看得出来，亚历山大把你当成了真正的朋友。」","亚历山大的脸红了一下：「母亲！」","伊莎贝拉笑了，然后她的表情变得严肃了。","「美第奇家族的复兴，不只是恢复财富和地位。」她说，「更重要的是，要洗清我们家族的冤屈。四十年前的清洗，是教会和暗蚀会的阴谋。我们要让全世界知道真相。」","「我会的。」亚历山大说，他的眼神很坚定。","「还有——」伊莎贝拉看着你，「七印的事。你说的那些，是真的吗？」","你点了点头。","伊莎贝拉沉默了一会儿，然后说：「美第奇家族的祖先，留下了一些东西。关于七印，关于黄林晶，关于……深渊。」","「那些东西，藏在美第奇家族的祖宅里。祖宅在自由城邦的一个小镇上，四十年前被教会查封了。」","「如果你们能拿到那些东西，也许……能找到拯救世界的方法。」","你和亚历山大对视了一眼。","「我们去。」亚历山大说。","「好。」你说。","从那天起，你和亚历山大，开始了新的冒险。你们要去美第奇家族的祖宅，找到祖先留下的东西，找到拯救世界的方法。","你的道路，和美第奇家族的命运，和七印的秘密，纠缠在了一起。","而亚历山大的故事，终于有了一个新的开始。","风吹过花园，带来了远方的气息。你站起来，朝门口走去。","「明天出发。」你说。","「好。」亚历山大说，他扶着母亲，站了起来。","夕阳洒在花园里，把三个人的影子拉得很长。","你的传奇，才刚刚开始。而美第奇家族的复兴，也才刚刚开始。"],
  options:[
    {t:"继续探索其他NPC的故事", effect:{time:1}, go:"npc_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}



  

N["npc_parallel_hub"] = function(){return{place:"大陆",text:function(){
  var t=[];
  t.push("世界不会因为你停下，就停下。");
  t.push("当你在大陆上冒险的时候，你认识的人——也在过他们自己的生活。他们在学习，在工作，在恋爱，在战斗，在——朝着他们自己的目标前进。");
  t.push("你想知道，他们最近在做什么吗？");
  return t;
},options:[
  {t:"查看墨丘利的近况",go:"npc_parallel_view",effect:{flag:"npc_view_mercury"}},
  {t:"查看艾伦的近况",go:"npc_parallel_view",effect:{flag:"npc_view_allen"}},
  {t:"查看蕾克斯的近况",go:"npc_parallel_view",effect:{flag:"npc_view_rexa"}},
  {t:"查看塞西莉亚的近况",go:"npc_parallel_view",effect:{flag:"npc_view_cecilia"}},
  {t:"查看马库斯的近况",go:"npc_parallel_view",effect:{flag:"npc_view_marcus"}},
  {t:"查看艾拉拉的近况",go:"npc_parallel_view",effect:{flag:"npc_view_elara"}},
  {t:"查看索林的近况",go:"npc_parallel_view",effect:{flag:"npc_view_thorin"}},
  {t:"查看露娜的近况",go:"npc_parallel_view",effect:{flag:"npc_view_luna"}},
  {t:"查看凯的近况",go:"npc_parallel_view",effect:{flag:"npc_view_kai"}},
  {t:"查看索菲亚的近况",go:"npc_parallel_view",effect:{flag:"npc_view_sophia"}},
  {t:"查看菲利克斯的近况",go:"npc_parallel_view",effect:{flag:"npc_view_felix"}},
  {t:"查看艾莉亚的近况",go:"npc_parallel_view",effect:{flag:"npc_view_aria"}},
  {t:"离开",go:"fc_jiaohui_entry"}
]}};


  

N["npc_parallel_view"] = function(){return{place:"大陆",text:function(){
  var key = "";
  if(S.flags.npc_view_mercury) key="mercury";
  else if(S.flags.npc_view_allen) key="allen";
  else if(S.flags.npc_view_rexa) key="rexa";
  else if(S.flags.npc_view_cecilia) key="cecilia";
  else if(S.flags.npc_view_marcus) key="marcus";
  else if(S.flags.npc_view_elara) key="elara";
  else if(S.flags.npc_view_thorin) key="thorin";
  else if(S.flags.npc_view_luna) key="luna";
  else if(S.flags.npc_view_kai) key="kai";
  else if(S.flags.npc_view_sophia) key="sophia";
  else if(S.flags.npc_view_felix) key="felix";
  else if(S.flags.npc_view_aria) key="aria";
  var npc = NPC_PARALLEL[key];
  var action = npc.actions[Math.floor(Math.random()*npc.actions.length)];
  var t=[];
  t.push("你收到了一封信——或者，是一个消息。");
  t.push(npc.cn+"，最近在"+npc.location+"。");
  t.push("据说，他/她最近在——"+action+"。");
  t.push("你想起了跟他/她在一起的日子。那些日子，好像就在昨天，又好像——已经过了很久。");
  t.push("你知道，等你们再见面的时候，他/她一定会不一样了。因为——每个人都在往前走，没有人会在原地等你。");
  return t;
},options:[
  {t:"继续",go:"npc_parallel_hub"}
]}};


  

N["npc_deep_talk"] = function(){
  return {
    place: "深度对话",
    text: ["你看着对方，决定用一种特别的方式和他交谈。",
           "你可以：试探他的反应、观察他的细节、施加压力、或者共情他的处境。",
           "每一种方式都会揭示不同的东西——但也可能让对方关上心门。"],
    options: [
      { t:"试探（洞察 SPR）", check:{a:"SPR", label:"试探"}, go:"npc_deep_result", fail:"npc_deep_result",
        tier:{ crit:["你小心翼翼地试探，对方的眼神闪烁了一下——他有秘密。"], ok:["你问了一个巧妙的问题，对方犹豫了一下，但没有透露太多。"], fail:["你的试探太明显了，对方警觉起来。"], critfail:["你问了一个冒犯的问题，对方生气了。"] } },
      { t:"观察（智力 INT）", check:{a:"INT", label:"观察"}, go:"npc_deep_result", fail:"npc_deep_result",
        tier:{ crit:["你注意到了一个关键细节——他的随身物品里有不该有的东西。"], ok:["你观察到了一些不寻常的地方，但不确定意味着什么。"], fail:["你看了半天，什么特别的都没发现。"], critfail:["你盯着人家看太久了，对方很不舒服。"] } },
      { t:"施压（魅力 CHA）", check:{a:"CHA", label:"施压"}, go:"npc_deep_result", fail:"npc_deep_result",
        tier:{ crit:["你直接点破了他的秘密，他的脸色变了——但他开始说实话了。"], ok:["你施加了一些压力，对方松了口，但只说了一部分。"], fail:["你的施压让对方关上了心门，他什么都不肯说了。"], critfail:["你逼得太紧了，对方拂袖而去。"] } },
      { t:"共情（魅力 CHA）", check:{a:"CHA", label:"共情"}, go:"npc_deep_result", fail:"npc_deep_result",
        tier:{ crit:["你表达了对他处境的理解，他沉默了很久，然后给你讲了一个从未告诉过别人的故事。"], ok:["你的共情让他放松了一些，他透露了一些个人的感受。"], fail:["他不太愿意谈论自己的感受，话题被岔开了。"], critfail:["你的共情被误解了，他觉得你在可怜他。"] } },
      { t:"离开", go:"fc_jiaohui_entry" }
    ]
  };
};


  

N["npc_deep_result"] = function(){
  return {
    place: "对话余波",
    text: function(){
      const arr = [];
      arr.push("对话结束了。你回味着刚才的每一个细节——他的眼神、他的语气、他没有说出口的话。");
      arr.push("每个人都有秘密。有些秘密是羞耻，有些是痛苦，有些是危险。");
      arr.push("你不知道你刚才揭开的是哪一种——但你知道，你已经不是刚才的你了。知道一些事情之后，就再也回不到不知道的状态了。");
      return arr;
    },
    options: [
      { t:"继续探索", go:"fc_jiaohui_entry" }
    ]
  };
};


  

N["npc_schedule_view"] = function(){
  initTimeV26();
  return {
    place: "NPC日程",
    text: function(){
      const arr = [];
      arr.push("【你知道的NPC日程】");
      arr.push("");
      arr.push("当前时段：" + TIME_PERIODS_V26[S.time.period].name);
      arr.push("");
      for (const id in NPC_SCHEDULES_V26) {
        const npc = NPC_SCHEDULES_V26[id];
        const current = npc[S.time.period];
        arr.push("【" + npc.name + "】");
        arr.push("  清晨：" + npc.morning.location + "（" + npc.morning.activity + "）");
        arr.push("  正午：" + npc.noon.location + "（" + npc.noon.activity + "）");
        arr.push("  黄昏：" + npc.dusk.location + "（" + npc.dusk.activity + "）");
        if (typeof npc.night.accessible === "string") {
          arr.push("  深夜：" + npc.night.location + "（" + npc.night.activity + "）[" + npc.night.accessible + "]");
        } else if (npc.night.accessible) {
          arr.push("  深夜：" + npc.night.location + "（" + npc.night.activity + "）");
        } else {
          arr.push("  深夜：" + npc.night.location + "（" + npc.night.activity + "）[不可接近]");
        }
        arr.push("  当前位置：" + current.location + "（" + current.activity + "）");
        arr.push("");
      }
      arr.push("（深夜日程是隐藏的，需要调查或跟踪才能发现。）");
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};


  

N["npc_track"] = function(){
  initTimeV26();
  return {
    place: "跟踪",
    text: function(){
      const arr = [];
      arr.push("你决定跟踪一个NPC。这需要一个时段，而且可能被发现。");
      arr.push("");
      arr.push("跟踪是了解NPC深夜秘密的最好方式——但也是最危险的方式。");
      arr.push("如果被发现，NPC对你的态度会改变。如果被暗蚀会成员发现，你可能有生命危险。");
      arr.push("");
      arr.push("（消耗1时段，AGI/潜行判定，成功则发现NPC的秘密，失败则被发现）");
      return arr;
    },
    options: [
      { t:"跟踪墨丘利", go:"fc_jiaohui_entry", effect:{timeCost:"1period", check:"AGI", tier:{
        crit:{t:"你跟踪墨丘利到了学院地下的一个秘密房间。他在和一个穿黑袍的人说话——是守望者的人。你听到了一些不该听到的事。", effect:{knowledge:1, flag:"tracked_mercury", relation:"mercury:-5"}},
        ok:{t:"你跟着墨丘利走了一段路，但他进了一个你进不去的地方。你只知道他去了图书馆的禁书区方向。", effect:{flag:"mercury_dusk_library"}},
        fail:{t:"墨丘利突然回头看了你一眼。你赶紧躲起来，但你不确定他有没有看到你。", effect:{relation:"mercury:-3", san:-2}},
        critfail:{t:"墨丘利发现了你。他没有生气，只是说了一句：「有些事，知道得太早不是好事。」然后走了。", effect:{relation:"mercury:-10", san:-5, flag:"mercury_knows_you_track"}}
      }}},
      { t:"跟踪马库斯", go:"fc_jiaohui_entry", effect:{timeCost:"1period", check:"AGI", tier:{
        crit:{t:"你跟着马库斯到了城市的边缘。他在和一个暗蚀会的人见面！他们在交换什么东西。你拍下了（记在了心里）这个画面。", effect:{knowledge:1, flag:"tracked_marcus_eclipse", relation:"marcus:-5"}},
        ok:{t:"马库斯去了酒馆，和几个陌生人喝酒。你听不清他们在说什么，但气氛很紧张。", effect:{flag:"marcus_tavern_meeting"}},
        fail:{t:"你跟丢了。人太多，马库斯消失在人群里。", effect:{}},
        critfail:{t:"马库斯发现了你。他笑着走过来，拍了拍你的肩膀：「兄弟，跟踪我？有什么事直接问嘛。」他什么都没说，但你知道他起了疑心。", effect:{relation:"marcus:-10"}}
      }}},
      { t:"放弃跟踪", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


  

N["npc_rel_hub"] = function(){return{
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


  

N["npc_rel_mercury_1"] = function(){return{
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


  

N["npc_rel_mercury_2"] = function(){return{
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


  

N["npc_rel_mercury_3"] = function(){return{
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


  

N["npc_rel_cecilia_1"] = function(){return{
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


  

N["npc_rel_cecilia_2"] = function(){return{
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


  

N["npc_rel_cecilia_3"] = function(){return{
place:"学院·图书馆",
text:["你谢过她，没有多说。她也没有追问，只是点点头，重新把目光落回书页上。", "你起身要走，她忽然叫住你：「等一下。」她从怀里摸出一个油纸包，递给你：「食堂的南瓜饼，我多买了一份。你最近老熬夜，吃点甜的。」", "你接过油纸包，还带着体温。她低头看书，没有抬头：「走吧。别回头看了——我又不会跑。」", "你走出图书馆，手里握着那个油纸包，隔着纸还能感到温度。你撕开一角，咬了一口——是甜的。你站在原地，嚼了很久，才把它吃完。", "塞西莉亚的关系，是算出来的。她跟你说过，她交朋友，像做算术：「先观察，再判断，最后决定值不值得深交。」她说这话的时候，很坦率。", "你觉得她这种说法有点冷。但相处久了，你发现她其实比谁都认真——她答应的事，一定做到；她算清楚的事，从不算错。", "有一次，你问她：「那我在你的算盘上，是哪一档？」她抬起头，看了你一会儿，说：「你不用知道。」然后低下头继续看书。", "你注意到，她说完那句话之后，耳根红了一下。只有一下。", "后来，你发现她帮你做过很多小事——帮你占图书馆的位子，帮你改过一遍论文里的错字，你受伤的那次，她往你桌上放了一瓶药，没有留名字。", "她从来没有承认过那些事。但你心里，已经把那笔账，算得很清了。"] /*v45inj:npc_rel_cecilia_3*/,
options:[
{t:"把这份甜记在心里", go:"pol_hub"}
]
}};


  

N["npc_rel_gray_1"] = function(){return{
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


  

N["npc_rel_gray_2"] = function(){return{
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


  

N["npc_rel_edmund_1"] = function(){return{
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


  

N["npc_rel_edmund_2"] = function(){return{
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


  

N["npc_rel_edmund_3"] = function(){return{
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


  

N["npc_rel_qinte_1"] = function(){return{
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


  

N["npc_rel_marcus_1"] = function(){return{
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


  

N["npc_rel_valen_1"] = function(){return{
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


  

N["npc_rel_lolin_1"] = function(){return{
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


  

N["npc_rel_memory_1"] = function(){return{
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


  

N["npc_rel_memory_2"] = function(){return{
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


  

N["npc_rel_parting"] = function(){return{
place:"学院·站台",
text:["分别的时候，没有煽情。", "他站在路口，你的行囊已经背好了。风把你们的衣摆都吹起来，路边的草在风里伏倒又立起。", "「走了。」你说。", "「嗯。」他说，「路上小心。」", "你走出去几步，他忽然叫住你：「喂。」你回头。他张了张嘴，最后只说：「……算了。你走吧。」", "你走了。走出很远，回头看了一眼——他还站在路口，像一棵种在那里的树。", "你转回身，继续走。风很大，你走得很稳。", "你又要出发了。这一次，送行的人多了一些——塞西莉亚站在人群里，朝你挥了挥手；灰翎靠在塔楼的窗边，没有挥手，只是朝你点了点头；埃德蒙没来，但你知道，塔楼的灯，会亮一整夜。", "洛琳塞给你一包干粮：「路上吃。别饿着——你饿着的样子，看着可怜。」昆特远远站着，没有靠近，只是朝你举了举刀，像敬一个礼。", "你背着行囊，走出校门。身后，学院的钟楼敲响整点。你没有回头，但你知道——这座学院里，有人在等你回来。", "这种感觉，比任何武器都让人安心。", "后来你们各自走了很远的路，偶尔会在信里提到那一晚。", "他写信说，那天他其实想说的是「留下来」——但他知道，说出口，你就走不成了。", "你回信说，那天你其实听懂了。你只是假装没听懂。", "信寄出去之后，你们都没有再提这件事。", "有些话，说一半就够了。剩下的，留给时间慢慢磨。"] /*v45inj:npc_rel_parting*/,
options:[
{t:"出发", go:"west_hub"}
]
}};


  

N["npc_rel_debt"] = function(){return{
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




  

N["relic_intro"] = function(){ return {
  text:["黄林晶的遗产。","十二件神器，分散在大陆各处。",
    "每一件都承载着黄林晶的一段记忆——不只是力量，还有真相。",
    "你已经收集了 "+Object.keys(HLJ_RELICS_FULL).filter(function(k){return HLJ_RELICS_FULL[k].obtained;}).length+" / 12 件。",
    "从哪件开始？"],
  options:[
    {t:"时光沙漏（东部王国）", go:"relic_hourglass", effect:{time:1}},
    {t:"空间法杖（自由城邦禁书区）", go:"relic_staff", effect:{time:1}},
    {t:"灵魂之眼（精灵王国）", go:"relic_soul_eye", effect:{time:1}},
    {t:"元素之心（兽人草原）", go:"relic_element_heart", effect:{time:1}},
    {t:"炼金熔炉（矮人王国）", go:"relic_alchemy_furnace", effect:{time:1}},
    {t:"神圣圣杯（教会区）", go:"relic_holy_grail", effect:{time:1}},
    {t:"查看全部遗产列表", go:"relic_list", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:0}}
  ]
};}


  

N["relic_list"] = function(){ return {
  text:function(){var base=["十二神器一览："];
  for(var k in HLJ_RELICS_FULL) {
    var r=HLJ_RELICS_FULL[k];
    base.push((r.obtained?"✓ ":"✗ ")+r.name+" — "+r.location+"："+r.desc);
  }
  return base;},
  options:[
    {t:"返回", go:"relic_intro", effect:{time:0}}
  ]
};}




  

N["relic_staff"] = function(){ return {
  text:["艾尔达魔法学院禁书区深处。",
    "空间法杖插在一个空间迷宫的中心——周围的空间在不断折叠、扭曲。",
    "墨丘利站在迷宫边缘，他看着你，眼神复杂：「这根法杖……黄林晶用它走遍了大陆。」",
    "「但你要小心——空间迷宫会吞噬迷路的人。」"],
  options:[
    {t:"穿越空间迷宫（智力）", check:{attr:"INT", label:"智力·空间", target:65},
      tier:{ok:function(){return[pickV(["你破解了空间迷宫，拿到了空间法杖。◆获得：空间法杖！","你在迷宫中找到了捷径——那是黄林晶留下的后门。◆获得：空间法杖+捷径知识"],"staff_ok")]},
      fail:function(){return[pickV(["你在迷宫中迷路了，差点出不来。◆未获得，SAN-3","迷宫把你传送到了学院外面。◆未获得，时间+3"],"staff_fail")]}},
      go:"relic_memory", effect:{time:3}},
    {t:"请墨丘利帮忙（魅力）", check:{attr:"CHA", label:"魅力·请求", target:60},
      go:"relic_memory", effect:{time:2}},
    {t:"离开", go:"relic_intro", effect:{time:0}}
  ]
};}




  

N["relic_memory"] = function(){ return {
  text:function(){var m=HLJ_MEMORIES[Math.floor(Math.random()*HLJ_MEMORIES.length)];
  return ["你触发了黄林晶的记忆碎片：", "「"+m+"」",
    "这段记忆在你脑海中回荡——黄林晶到底是个什么样的人？英雄？罪人？还是……一个背负了太多的普通人？"];},
  options:[
    {t:"继续寻找其他遗产", go:"relic_intro", effect:{time:0}},
    {t:"离开", go:"city_free", effect:{time:1}}
  ]
};}


  

N["relic_overview"] = function(){ return {
  place:"黄林晶遗产",
  text:["黄林晶。","这个名字，在艾尔达大陆上被传颂了三千年。","他是封印深渊的英雄，是七印的建立者，是十二件神器的铸造者。有人说他是神，有人说他是凡人，还有人说……他根本就没有死。","三千年过去了，黄林晶的故事变成了传说，传说变成了神话。而他留下的十二件神器，散落在大陆各处，成为了无数冒险者追寻的目标。","你坐在油灯下，翻看着那本从守望者密室里带出来的手札。手札的最后几页，画着十二件神器的图样，每一件旁边都写着一行小字——那是神器的名字和最后出现的地点。","时光沙漏——承天山·时光裂隙。","空间法杖——自由城邦·交汇城地下。","灵魂之眼——守望者秘密图书馆·最深处。","元素之心——南方商业城邦·活火山。","炼金熔炉——矮人王国·铁峰堡。","神圣圣杯——光明教会·圣城。","暗影斗篷——死亡沙漠·深渊神殿。","深渊之钥——未知。","守护之盾——北方公国·铁门关废墟。","智慧之书——精灵王国·世界树图书馆。","命运之线——兽人草原·萨满圣地。","铸印——未知。","你合上手札，指尖微微发凉。","有人说，集齐十二件神器，就能找到黄林晶的下落。","也有人说，集齐十二件神器，就能打开时光神殿，改变历史。","还有人说——集齐十二件神器的人，会成为新的黄林晶。","你不知道哪种说法是真的。但你知道，每一件神器，都藏着一段黄林晶的记忆。那些记忆里，可能有深渊的真相，可能有七印的秘密，也可能有……黄林晶真正的结局。","油灯的火苗跳了一下，在手札上投下摇曳的影子。你看着那十二件神器的图样，心里有一种说不清的感觉——像是召唤，又像是警告。","你目前拥有的神器：0/12。","窗外，夜风吹过，带来了远处的钟声。那是交汇城大教堂的钟声，在夜里格外清晰。","你深吸一口气，把手札收了起来。","十二件神器。十二段记忆。十二个真相。","你准备好了吗？"],
  options:[
    {t:"寻找时光沙漏", effect:{time:0}, go:"relic_hourglass"},
    {t:"寻找灵魂之眼", effect:{time:0}, go:"relic_soul_eye"},
    {t:"寻找元素之心", effect:{time:0}, go:"relic_element_heart"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


  

N["relic_hourglass"] = function( /*v58eng:aifresh:misc*/){ return {
  place:"东部王国·承天山",
  text:["时光沙漏。","你站在承天山的山脚下，仰头看着这座云雾缭绕的山峰。","承天山是东部王国最高的山，山顶终年积雪，云雾缭绕。传说中，这里是离天最近的地方，也是时间最不稳定的地方——第六印时光裂隙就在山顶。","你能感觉到空气中有一种扭曲的气息。不是物理上的扭曲，而是某种更深层的东西——时间在这里流得不一样。你看了一眼自己的手，发现手指的影子在晃动，像是有两个时间在同时流动。","山上有一条石阶路，蜿蜒着通向山顶。石阶已经很古老了，有些地方已经开裂，缝隙里长出了野草。石阶的两旁是茂密的竹林，风一吹过，竹叶沙沙作响，像是无数人在低语。","半山腰有一座废弃的道观。道观的山门已经倒塌了一半，门上的匾额掉在地上，上面的字已经模糊不清，只能隐约看出一个『承』字。道观的围墙也塌了不少，院子里长满了杂草，有半人高。","据说，时光沙漏就藏在这座道观里。","你走进院子，脚下的杂草发出沙沙的声响。院子的正中有一个炼丹炉，炉身已经锈迹斑斑，里面堆满了落叶和泥土。炼丹炉的旁边有一口井，井口被石板盖着，石板上刻着奇怪的符文。","你能感觉到——时光沙漏就在这座道观的某个地方。","但你也能感觉到，这里不只有你一个人。","风停了。竹林里的沙沙声消失了。整个道观陷入了一种诡异的寂静。","你回头看了一眼。山门外面，什么都没有。但你总觉得，有什么东西在看着你。","那种感觉，就像是……有人在另一个时间里，正在观察你。","你打了个寒颤，握紧了手里的武器。","时光沙漏。传说中，黄林晶用这件神器暂停了时间，在一天之内走完了一千里路。也有人说，他用时光沙漏看到了未来——然后被未来吓疯了。","你不知道哪种说法是真的。但你知道，你必须找到它。","因为十二件神器中，时光沙漏可能是最重要的一件。","它能让你看到未来。也能让你改变未来。","你深吸一口气，朝道观的深处走去。脚下的石板发出咯吱的声响，在寂静的道观里格外清晰。","你不知道的是，在你身后的竹林里，一双眼睛正在看着你。那双眼睛没有实体，只是空气中的一个扭曲——像是时间本身在凝视你。"],
  options:[
    {t:"上山探索道观", check:{a:"AGI",sk:"潜行",label:"敏捷·探索",target:55},
      tier:{
        crit:function(){return[pickV(["你巧妙地避开了山上的陷阱，找到了道观的密室。密室中央，一个金色的沙漏在流动——但沙子是往上流的。你拿到了时光沙漏！神器+1，黄林晶记忆+1。","你发现了一条隐秘的通道，直通道观的地下。在那里，你找到了时光沙漏，还有黄林晶留下的一封信。神器+1，线索+2。"],"hourglass_search_crit")]},
        ok:function(){return[pickV(["你在道观里找到了一些线索，指向了沙漏的位置。但沙漏本身被人取走了。线索+2。","你探索了道观，找到了一些黄林晶的研究笔记。虽然没有找到沙漏，但了解了不少。知识+2。"],"hourglass_search_ok")]},
        fail:function(){return[pickV(["你在山上转了半天，什么都没找到。道观里空空如也。","你触发了一个陷阱，不得不撤退。HP-5。"],"hourglass_search_fail")]},
        critfail:function(){return[pickV(["你在时光裂隙附近迷失了，时间在你身上变得混乱。你感觉自己老了十岁。SAN-10，HP-10。","你触发了一个时间陷阱，被困在一个时间循环里，花了好几个小时才逃出来。SAN-15，HP-8。"],"hourglass_search_critfail")]}
      },
      effect:{time:2}, go:"relic_hourglass_memory"},
    {t:"询问当地居民", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:50},
      tier:{
        crit:function(){return[pickV(["一个老道士告诉你，时光沙漏确实在承天山，但它被一个时间守护灵看管着。「只有真正理解时间的人，才能拿到它。」线索+2。","老道士告诉你一个秘密：承天山的道观里，有一个黄林晶留下的谜题。解开谜题，就能拿到沙漏。线索+2。"],"hourglass_ask_crit")]},
        ok:function(){return[pickV(["居民告诉你一些关于承天山的传说，虽然不是什么具体线索，但也挺有用。线索+1。","你了解了一些当地的风土人情，知道了上山的路线。知识+1。"],"hourglass_ask_ok")]},
        fail:function(){return[pickV(["居民们对时光沙漏的事一无所知，他们只把那当作传说。","你问了几个人，他们都只是摇头。"],"hourglass_ask_fail")]},
        critfail:function(){return[pickV(["你问了不该问的人，他以为你是来盗墓的，叫了一群人把你赶走了。声望-3。","你的问题引起了当地盗贼的注意，他们在你回客栈的路上抢劫了你。金币-20，HP-5。"],"hourglass_ask_critfail")]}
      },
      effect:{time:1}, go:"relic_hourglass_memory"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_hourglass_memory"] = function(){ return {
  place:"承天山·道观",
  text:["你触碰到时光沙漏的那一刻，世界静止了。","风停了。竹叶不摇了。你的呼吸悬在半空中，吐不出来，也咽不下去。","然后，一段记忆涌入了你的脑海。","不是你的记忆。是黄林晶的。","你看到了他。","他站在承天山的山顶，穿着一件白色的长袍，长发被风吹得散乱。他看起来很年轻，大概三十岁出头，但他的眼睛里有一种不属于这个年龄的沧桑——像是已经活了一千年。","他的手中握着时光沙漏。沙漏是金色的，里面的沙子不是普通的沙，而是一种发光的、像是碎星一样的东西。沙子在往上流，而不是往下。","他看着面前的时光裂隙。那是一道巨大的裂缝，横亘在天空中，裂缝的另一边是一片混沌——你看不清那是什么，但你能感觉到，那是时间的尽头。","「时间，是最强大的力量，也是最危险的力量。」他说。他的声音很平静，但你能听出里面的疲惫。","「我用沙漏暂停了时间，救下了无数人。在深渊降临的那一天，我暂停了时间，把七印一个个加固，把幸存者一个个转移。」","「但我也因此……看到了一些不该看的东西。」","他的表情变得痛苦。他的手在发抖，沙漏里的沙子流得更快了。","「未来。」","「我看到了深渊降临的那一天。我看到了大陆的毁灭。我看到了城市被黑色的火焰吞噬，看到了人们在街头互相残杀，看到了七印一一破碎，看到了……」","他停了下来，喉结动了动，像是在咽什么苦涩的东西。","「我看到了自己的结局。」","「我死了。不是被深渊杀死的，是被……」他没有说下去。他低下头，看着手中的沙漏，沙子还在往上流，发出细碎的光芒。","「所以我留下了十二件神器。」他抬起头，看着你——他好像知道你在看他。他的眼睛直视着你，穿过了三千年的时光，「如果有人能集齐它们，也许……能改变那个未来。」","「也许。」","记忆消散了。风又吹了起来，竹叶又开始沙沙作响。你发现自己跪在地上，双手握着时光沙漏，手心全是汗。","沙漏里的沙子还在往上流，发出微弱的光芒。","你站起来，腿有些发软。黄林晶的话还在你耳边回响。","「我看到了自己的结局。」","他是怎么死的？被谁杀死的？为什么他不说？","还有——他说『也许能改变那个未来』。『也许』。","连黄林晶都不确定的未来，你能改变吗？","你把时光沙漏收进怀里。它贴着你的胸口，冰凉，却有一种奇怪的安心感。","你不知道未来是什么样子。但你知道，从今天起，你已经走在了改变未来的路上。","身后，道观的门吱呀一声响了。你猛地回头——什么都没有。只有风，吹过空荡荡的院子。","但你总觉得，有什么东西，刚刚离开了。"],
  options:[
    {t:"继续寻找其他神器", effect:{time:1,item:"时光沙漏",flag:"relic_hourglass_obtained"}, go:"relic_overview"},
    {t:"离开", effect:{time:0}, go:"fc_jiaohui_entry"}
  ]
};}


  

N["relic_soul_eye"] = function(){ return {
  place:"自由城邦·交汇城地下",
  text:["灵魂之眼。","传说中，黄林晶用这件神器看到了死者的世界，和亡者对话。","它的最后出现地点，是交汇城的地下——守望者的秘密图书馆附近。","你站在交汇城的下水道入口，能感觉到下面有一股阴冷的气息。","灵魂之眼，可能就在下面。"],
  options:[
    {t:"进入地下探索", check:{a:"SPR",sk:"灵魂感知",label:"灵性·探索",target:60},
      tier:{
        crit:function(){return[pickV(["你的灵魂感知引导你穿过了复杂的地下通道，找到了一个隐秘的房间。房间中央，一只悬浮的眼睛在缓缓转动——那就是灵魂之眼。你拿到了灵魂之眼！神器+1，黄林晶记忆+1，SAN-3。","你在地下找到了守望者的秘密图书馆，在图书馆的深处，你找到了灵魂之眼。它被放在一个祭坛上，周围有无数的灵魂在低语。神器+1，线索+2。"],"souleye_search_crit")]},
        ok:function(){return[pickV(["你在地下找到了一些线索，灵魂之眼似乎被人转移了。线索+2。","你探索了地下通道，找到了一些守望者留下的笔记。知识+2。"],"souleye_search_ok")]},
        fail:function(){return[pickV(["你在地下迷路了，转了半天才走出来。什么都没找到。","地下的阴气太重了，你不得不撤退。SAN-2。"],"souleye_search_fail")]},
        critfail:function(){return[pickV(["你被地下的怨灵攻击了，受了重伤。HP-15，SAN-10。","你触发了守望者的防御机制，被传送到了城外。HP-10，SAN-5。"],"souleye_search_critfail")]}
      },
      effect:{time:2}, go:"relic_soul_eye_memory"},
    {t:"找墨丘利打听", effect:{time:1}, go:"relic_soul_eye_mercury"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_soul_eye_mercury"] = function(){ return {
  place:"艾尔达魔法学院·墨丘利研究室",
  text:["墨丘利听了你的问题，沉默了很久。","「灵魂之眼？」他说，「那是守望者的圣物。」","「黄林晶把它留给了守望者，代代相传。」","「但在三百年前，灵魂之眼失踪了。」他的表情变得复杂，「和塞拉芬一起失踪的。」","「塞拉芬……是守望者历史上最强大的灵魂法师。也是……我曾经的挚爱。」","「她带着灵魂之眼，走进了地下图书馆的最深处，然后就再也没有出来。」"],
  options:[
    {t:"「塞拉芬为什么要带走灵魂之眼？」", check:{a:"CHA",sk:"口才",label:"魅力·追问",target:60},
      tier:{
        crit:function(){return[pickV(["墨丘利告诉你真相：塞拉芬发现了守望者的一个秘密——他们一直在用灵魂之眼做某种禁忌实验。她带走灵魂之眼，是为了阻止他们。「她走进地下图书馆，是为了销毁那些实验资料。」墨丘利的声音颤抖了，「但她再也没有回来。」线索+3，SAN-3。","墨丘利告诉你，塞拉芬发现了深渊的真相，她想用灵魂之眼深入深渊，找到彻底消灭深渊的方法。「她太勇敢了。」墨丘利说，「也太鲁莽了。」线索+3。"],"mercury_truth_crit")]},
        ok:function(){return[pickV(["墨丘利告诉了你一些塞拉芬的事，但关键部分他没有说。「有些事，我不想再回忆。」线索+1。","墨丘利透露了一些信息，但他显然隐瞒了什么。线索+1。"],"mercury_truth_ok")]},
        fail:function(){return[pickV(["墨丘利不愿意谈论塞拉芬，他只是说：「那是过去的事了。」","墨丘利转移了话题，没有回答你的问题。"],"mercury_truth_fail")]},
        critfail:function(){return[pickV(["你的问题让墨丘利情绪失控了，他叫你离开。墨丘利好感-10。","你追问得太紧了，墨丘利以为你在调查守望者的秘密，对你产生了警惕。墨丘利好感-5。"],"mercury_truth_critfail")]}
      },
      effect:{time:1}, go:"relic_soul_eye_memory"},
    {t:"「我会找到她的。」", effect:{time:1,mercury_bond:10,flag:"find_seraphine"}, go:"relic_soul_eye_memory"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_soul_eye_memory"] = function(){ return {
  place:"地下图书馆深处",
  text:["你最终在地下图书馆的最深处找到了灵魂之眼。","它悬浮在一个封印阵中，旁边有一具干枯的尸体——那是塞拉芬。","她的手里还握着一本笔记。","你拿起笔记，上面记录着她最后的发现：","「守望者的实验是真的。他们在用灵魂之眼和深渊沟通。」","「不是为了消灭深渊，而是为了和深渊做交易。」","「我阻止不了他们。我只能把灵魂之眼藏在这里，等一个真正值得信任的人来。」","「如果你读到这段话……请小心守望者。」","「也小心黄林晶。」","你合上笔记，心跳得很快。"],
  options:[
    {t:"拿走灵魂之眼和笔记", effect:{time:1,item:"灵魂之眼",item2:"塞拉芬的笔记",flag:"relic_soul_eye_obtained",flag2:"watchers_conspiracy"}, go:"relic_overview"},
    {t:"只拿走灵魂之眼", effect:{time:1,item:"灵魂之眼",flag:"relic_soul_eye_obtained"}, go:"relic_overview"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_element_heart"] = function(){ return {
  place:"南方商业城邦·火山区",
  text:["元素之心。","传说中，黄林晶用这件神器控制了四大元素，创造了第一个元素傀儡。","它的最后出现地点，是南方商业城邦附近的一座活火山。","你站在火山口边缘，能感觉到灼热的气息和元素的狂暴。","元素之心，可能就在火山的深处。"],
  options:[
    {t:"进入火山探索", check:{a:"CON",sk:"生存",label:"体质·探索",target:65},
      tier:{
        crit:function(){return[pickV(["你忍受着灼热，深入火山，找到了一个天然的洞穴。洞穴中央，一颗彩色的宝石在跳动——那就是元素之心。你拿到了元素之心！神器+1，黄林晶记忆+1。","你在火山深处找到了一个古老的祭坛，元素之心就在祭坛上。祭坛上还有黄林晶留下的铭文。神器+1，线索+2。"],"element_search_crit")]},
        ok:function(){return[pickV(["你在火山里找到了一些元素结晶，虽然不是元素之心，但也很有价值。获得：元素结晶×3。","你探索了火山的外围，了解了一些元素之力的运作方式。知识+1。"],"element_search_ok")]},
        fail:function(){return[pickV(["火山里太热了，你坚持不住，不得不撤退。HP-5。","你在火山里转了半天，什么都没找到。"],"element_search_fail")]},
        critfail:function(){return[pickV(["火山突然喷发了！你被岩浆烧伤，好不容易才逃出来。HP-20，SAN-5。","你触发了火山的元素陷阱，被四大元素同时攻击。HP-25，SAN-8。"],"element_search_critfail")]}
      },
      effect:{time:2}, go:"relic_element_heart_memory"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_element_heart_memory"] = function(){ return {
  place:"火山深处",
  text:["你触碰到元素之心的那一刻，四大元素的力量涌入了你的身体。","你看到了黄林晶的记忆。","他站在火山口，手中握着元素之心，四大元素在他周围旋转。","「元素，是世界的基石。」他说，「掌握了元素，就掌握了创造的力量。」","「但创造和毁灭，只有一线之隔。」","「我用元素之心创造了生命——第一个元素傀儡。但它很快就失控了，杀了很多人。」","「所以我把元素之心藏在这里。」他说，「如果有一天，有人能真正驾驭元素的力量……再把它拿走吧。」","「你，准备好了吗？」"],
  options:[
    {t:"「我准备好了。」", effect:{time:1,item:"元素之心",flag:"relic_element_heart_obtained",skillUp:"元素魔法"}, go:"relic_overview"},
    {t:"「我还需要更多修炼。」", effect:{time:1,item:"元素之心",flag:"relic_element_heart_obtained"}, go:"relic_overview"},
    {t:"离开", effect:{time:0}, go:"relic_overview"}
  ]
};}


  

N["relic_alchemy_furnace"] = function(){return{
place:"遗物·炼金熔炉",
text:["这件遗物是一座巴掌大的炼金熔炉，炉壁刻着细密的符文，炉底有一圈焦黑的痕迹——像是被使用过很多次。", "你小心翼翼地端详它。根据铭文推断，它能提纯药材和矿石，但每次使用都会消耗使用者的少量灵力。", "你试着用它提纯了一株普通的药草。炉火亮起时，一股温热的气流包裹住药草，片刻后，药草变得通体剔透，药性明显增强。", "你把熔炉收好。这东西放在行囊里沉甸甸的——但你知道，关键时刻，它也许比一把剑更有用。", "那口炼金熔炉，是你在这座学院里，见过的最老的物件之一。它立在炼金室的角落里，炉壁黑得发亮。", "你问教授，这炉子，有多少年了。教授想了想：「我来的时候，它就在了。」他顿了顿，「我老师来的时候，它也在。」", "你走近，看炉壁上刻着的字——已经模糊了。你辨认了很久，认出几个字：「……火不熄……则……不灭……」", "你问教授，那些字，是什么时候刻的。教授摇摇头：「没人知道。」他说，「可能，比这座学院，还老。」", "你伸手，摸了摸炉壁。炉壁是温的——明明没有生火，却有一种，说不上来的暖。你收回手，心里，记住了那几个字。"] /*v45inj:relic_alchemy_furnace*/,
options:[
{t:"收好熔炉", go:"quest_hub"},
{t:"研究它的来历", go:"quest_hub"}
]
}};


  

N["relic_holy_grail"] = function(){return{
place:"遗物·圣杯",
text:["这只圣杯由暗银打造，杯口镶着一圈铭文，在光线下泛着柔和的光泽。传说它曾盛过圣水，能净化污秽——但传说毕竟是传说。", "你捧着圣杯试了试。当你注入灵力时，杯中的清水泛起涟漪，原本浑浊的水竟变得清澈了些。", "你收起灵力，圣杯的光芒随之暗淡。你发现，它的净化能力有限，而且似乎只对某些特定的「污秽」有效——普通的灰尘和污渍，它反倒没有反应。", "你把它包好收进行囊。也许有一天，你会遇见它真正该净化的东西。", "你听到了一些，关于圣杯的传闻。传闻有好几个版本，每个版本，都不一样。", "第一个版本说，圣杯是圣城地下的宝物，能治百病。第二个版本说，圣杯根本不存在，只是教会的传说。第三个版本——说这话的人，压低了声音——圣杯里，装的东西，最好不要知道。", "你问第三个版本的人，为什么。他没有正面回答，只是说：「我爷爷，见过圣杯。」他顿了顿，「他见过之后，再也没提过它。」", "你问他，他爷爷还说了什么。他想了想：「他说，圣杯，不是拿来喝的。」他说完，自己打了个寒颤，「我也不知道，他是什么意思。」", "你走出酒馆，天已经黑了。你站在夜风里，想着那句「不是拿来喝的」。你想不明白，但你记住了。"] /*v45inj:relic_holy_grail*/,
options:[
{t:"收好圣杯", go:"quest_hub"},
{t:"研究铭文", go:"quest_hub"}
]
}};


  

N["relic_forge_intro"] = function(){return{
place:"遗物·锻造锤",
text:["这柄锻造锤入手沉重，锤头布满细密的锻痕，柄上刻着一行矮人文铭文：「千锤百炼，方成器。」", "你握着它掂了掂，试着在铁砧上敲了一记——声音沉闷而有力，震得虎口微微发麻。这锤子的重心极稳，看得出是名家手笔。", "你想起铁峰堡的老铁匠说过：好锤子会认人。你手上的这柄，似乎正在试探你的力气和手法。", "你用它在炉边打了件小物件，虽然生疏，但成品的质量竟比平时高出几分。你收起锤子，心说：往后锻造，可以带上它。", "铁峰堡的锻造坊，是每一个矮人学徒，最初的起点。你走进去的时候，一股热浪，扑面而来。", "炉火通红。叮叮当当的锤声，此起彼伏。你看见一个矮人学徒，正抡着锤子，一下，一下，砸一块烧红的铁。他砸得很认真，额头上全是汗。", "旁边，一个老匠人，在旁边看着。他时不时，开口指点两句：「力道。不是蛮力。」他走过去，接过锤子，示范了一下——同样的动作，但铁块在他手里，像听话的面团。", "老匠人把锤子还给学徒，转过身，看见了你：「人类？来学锻造？」你说，想看看。他点点头：「看可以。」他指了指墙上的规矩，「看完，把火，添上。」", "你站在那里，看着炉火。你忽然觉得，那一锤一锤的声音里，有一种，你在别处听不到的踏实。"] /*v45inj:relic_forge_intro*/,
options:[
{t:"收好锻造锤", go:"quest_hub"},
{t:"研究铭文", go:"quest_hub"}
]
}};


  

N["relic_cloak_intro"] = function(){return{
place:"遗物·暗影斗篷",
text:["这件斗篷由一种不知名的暗色布料织成，入手轻若无物，却异常坚韧。披上它时，你感觉自己像是融进了周围的阴影里。", "你试着在黄昏时披着它穿过街巷。行人从你身边走过，竟没有一个多看你一眼——仿佛你只是墙角的一团影子。", "斗篷的兜帽内侧，绣着一行细小的符文，像是某种匿踪术的印记。但你知道，这斗篷的来历绝不简单——能织出这种布料的工艺，早就失传了。", "你脱下斗篷，仔细叠好。它是一张底牌，该亮的时候才能亮。", "那件斗篷，挂在旧货铺的角落里，灰扑扑的，像一块旧抹布。", "你本来没在意。但你经过的时候，它忽然动了一下——没有风，窗也关着。你停住，回头，看着它。它安安静静地挂着，像什么都没发生。", "你走过去，伸手，摸了摸。料子很旧，但摸上去，有一种奇怪的凉。你问铺主，这斗篷，哪来的。铺主想了想：「一个旅人，当在这里的。」他顿了顿，「他说，等他回来取。但他，一直没回来。」", "你问，那旅人长什么样。铺主说：「记不清了。」他想了想，「只记得，他走的时候，说了一句话——他说，这斗篷，会自己找主人。」", "你看着那件斗篷。你忽然觉得，它在等你，把它带走。你犹豫了一下，还是，把它买了下来。"] /*v45inj:relic_cloak_intro*/,
options:[
{t:"收好斗篷", go:"quest_hub"},
{t:"继续赶路", go:"world_continue"}
]
}};


  

N["relic_key_intro"] = function(){return{
place:"遗物·古铜钥匙",
text:["这把钥匙比寻常的钥匙大一圈，铜质，通体布满绿锈，齿形古怪，和你见过的任何锁都不匹配。", "你翻来覆去看了半天，看不出它属于哪扇门。钥匙柄上有一个模糊的印记——像是某种徽记，但磨损得太厉害，已经认不出了。", "你试着用灵力探入钥匙，隐约感到一丝微弱的共鸣——它似乎在回应什么，但很快又沉寂下去。", "你把钥匙系在腰间。有些东西，现在用不上，不代表永远用不上。你有一种感觉：总有一天，你会找到那扇它等着的门。", "那把钥匙，是你在一堆旧杂物里，翻出来的。它又旧又沉，像一把，开了很多年的锁。", "你把它拿在手里，掂了掂。钥匙的齿，磨得很圆，像是被用了很久很久。你翻过来，在钥匙柄上，看到一行小字，刻得歪歪扭扭：「第五把。」", "你问杂物摊的摊主，这把钥匙，是开什么的。摊主摇摇头：「不知道。」他说，「收来的时候，就在一堆东西里。」他想了想，「但收来的人说，这钥匙，不是这个时代的。」", "你拿着钥匙，走了。你走了一段路，把它拿出来，又看了看。你忽然觉得，这把钥匙，像是在等一把锁——一把，你还不知道在哪里的锁。", "你把它，挂在脖子上。钥匙贴着胸口，凉凉的。你走路的步子，不自觉地，放慢了一些。"] /*v45inj:relic_key_intro*/,
options:[
{t:"收好钥匙", go:"quest_hub"},
{t:"打听钥匙的来历", go:"quest_hub"}
]
}};


  

N["relic_shield_intro"] = function(){return{
place:"遗物·古旧圆盾",
text:["这面圆盾由暗沉的铁木打造，边缘包着一圈铜，盾面上刻着一只展翅的鹰——鹰眼处镶着两枚黑曜石，在光线下闪着幽光。", "你举起盾试了试。它比看上去轻，握在手里很稳。你用剑敲了一下盾面，发出的不是沉闷的「咚」，而是一声清越的「嗡」——像有什么东西在盾里回响。", "你仔细端详鹰眼处的黑曜石，总觉得那两枚石头在注视着你。老猎人说，猎物的眼睛会记得猎人的样子——这面盾，大概也记得它见过的东西。", "你把盾背在身后。有它在，你走夜路时，心里会踏实些。", "那面盾，立在铁匠铺的门口，像一扇小门。盾面上，坑坑洼洼的，全是旧痕。", "你走近，摸了摸盾面。你数了数那些坑洼——有的深，有的浅。你忽然觉得，每一道痕，都是一次，挡在谁身前。", "铁匠走出来，看见你在看盾：「好眼光。」他说，「这盾，跟了我师父一辈子。」他顿了顿，「他死的那天，盾上，又多了一道。」", "你问他，这盾，卖不卖。铁匠摇摇头：「不卖。」他说，「我师父说，这盾，要等一个，配得上它的人。」他打量了你一眼，「你，还差点。」", "你站在那里，看着那面盾。你没有生气。你在想，要等到什么时候，你才配得上，一面这样的盾。"] /*v45inj:relic_shield_intro*/,
options:[
{t:"收好圆盾", go:"quest_hub"},
{t:"继续赶路", go:"world_continue"}
]
}};


  

N["relic_book_intro"] = function(){return{
place:"遗物·无名古书",
text:[
"这本古书没有书名，封面是某种深色皮革，边角磨得发白，书脊的线绳也断了一处。翻开时，一股陈旧的纸墨味扑面而来。",
"书里的文字你看不懂——不是已知的任何一种大陆文字，笔画繁复，像是某种更古老的书写体系。书页间夹着一张干枯的叶片，已经看不出原样。",
"你小心翼翼地翻到最后一页，发现页角有一行批注，用的是通用语，字迹潦草：「勿要轻易诵读。它会在你耳边说话。」",
"你合上书，指尖还残留着皮革的凉意。你把书用布包好，收进行囊深处——你决定，等找到一个懂得这种文字的人，再打开它。"
],
options:[
{t:"收好古书", go:"quest_hub"},
{t:"寻找能读懂它的人", go:"quest_hub"}
]
}};


  

N["relic_thread_intro"] = function(){return{
place:"遗物·银丝线轴",
text:["这卷银线细细的，却结实得出奇。你试着用力拽了拽，线没有断，反而把你的手指勒出一道浅浅的印子。", "线轴上没有铭文，只在轴心刻着一个小小的「织」字。你想起旅途上听过的一个传说：有位织匠用一根银线缝补过天穹的裂口。", "你小心地抽出几寸线，在指间绕了绕。银线在光下泛着冷光，像月光凝成的丝。你忽然想，如果用这线缝补衣物，大概连刀剑都划不破。", "你把线轴收好。它也许有别的用处——但具体怎么用，你还需要再想想。", "那根线，是你从一个老裁缝手里，得到的。他把它卷在一根木轴上，像卷着一件宝贝。", "你问他，这是什么线。老裁缝说：「不知道。」他顿了顿，「但它是从我师父手里传下来的。我师父说，它断过一回，后来，又自己接上了。」", "你问，线有什么特别的。老裁缝想了想：「你摸。」你伸手，摸了一下——线的触感，很奇怪，说不上是软是硬，像摸着一段温度。", "他把它，送给了你。他说：「我这辈子，用不上它了。」他顿了顿，「但你不一样。你还要，走很远的路。」", "你把那根线，小心地收好。你走出裁缝铺的时候，把它拿出来，对着光，看了看。线在光里，泛着一种，很细的银光。"] /*v45inj:relic_thread_intro*/,
options:[
{t:"收好线轴", go:"quest_hub"},
{t:"继续赶路", go:"world_continue"}
]
}};


  

N["relic_seal_intro"] = function(){return{
place:"遗物·封印印记",
text:["这枚印记只有指甲盖大小，材质非金非玉，通体温润，表面刻着一个复杂的法阵。你把它放在掌心，能感觉到它在微微发热。", "你试着把灵力注入印记，法阵的纹路亮起一瞬，随即又暗淡下去。你隐约辨认出几个符文——都和「封印」有关。", "你想起学院图书馆里看过的一则记载：某些封印器具会自行寻找「合适的主人」。你低头看着掌心的印记，不知道它选择你，是幸运还是别的什么。", "你把它系在颈间，贴着胸口。它安静地待在那里，像一枚温热的、无声的心跳。", "那枚印，是你在一个旧货摊上看到的。它躺在摊角，灰蒙蒙的，像一枚，普通的石头章子。", "你拿起来，翻过来，看印面。印面上刻着的，不是文字，是一道一道的纹路，像缠绕在一起的线。你看着那些纹路，忽然觉得，有一阵恍惚。", "你定了定神，问摊主，这是什么。摊主说：「不知道。收来的时候，就有了。」他顿了顿，「不过，收来的人说，别把它，当普通章子用。」", "你问他，为什么。摊主说：「他说，盖过它的人，都会记得——记得清清楚楚。」他压低声音，「是好事，还是坏事，就说不清了。」", "你拿着那枚印，想了很久。你最终，还是把它放回了摊上。你走出几步，又回头，看了一眼。它躺在那里，灰蒙蒙的。"] /*v45inj:relic_seal_intro*/,
options:[
{t:"随身携带印记", go:"quest_hub"},
{t:"研究它的法阵", go:"quest_hub"}
]
}};


  

N["relic_overview2"] = function(){return{place:"大陆",text:function(){
  var t=[];
  t.push("黄林晶留下的十二件遗产，散落在大陆的各个角落。");
  t.push("你已经找到了三件——时光沙漏、空间法杖、灵魂之眼。但还有九件，在等待着被发现。");
  t.push("每一件遗产，都藏着一段黄林晶的记忆。每一段记忆，都在拼凑一个真相——一个关于七印、关于深渊、关于黄林晶本人的真相。");
  t.push("你要去找哪一件？");
  return t;
},options:[
  {t:"元素之心（北方公国·冰风谷）",go:"relic_element_intro"},
  {t:"炼金熔炉（矮人王国·废弃矿坑）",go:"relic_forge_intro"},
  {t:"神圣圣杯（光明教会·地下墓穴）",go:"relic_grail_intro"},
  {t:"暗影斗篷（南方城邦·黑市）",go:"relic_cloak_intro"},
  {t:"深渊之钥（死亡沙漠·深渊神殿外围）",go:"relic_key_intro"},
  {t:"守护之盾（铁门关·战争废墟）",go:"relic_shield_intro"},
  {t:"智慧之书（承天书院·禁地藏书阁）",go:"relic_book_intro"},
  {t:"命运之线（精灵王国·世界树根部）",go:"relic_thread_intro"},
  {t:"铸印（兽人草原·萨满圣地）",go:"relic_seal_intro"},
  {t:"离开",go:"fc_jiaohui_entry"}
]}};


  

N["relic_element_intro"] = function(){return{place:"北方公国·冰风谷",text:function(){
  var t=[];
  t.push("冰风谷的风，像刀子一样。");
  t.push("你裹紧了斗篷，踩着齐膝的雪，一步步往前走。山谷里到处是冰柱——有的比人还高，在阳光下闪着幽蓝的光。风穿过冰柱，发出呜呜的声响，像是谁在哭。");
  t.push("根据你收集到的线索，元素之心就藏在冰风谷的最深处——一个被称为「元素祭坛」的地方。");
  t.push("传说，黄林晶当年在这里，用四种元素的力量，锻造了元素之心。它能操控天地间的一切元素——火、水、土、风，甚至——更稀有的元素。");
  t.push("但你不是第一个来找它的人。雪地上有脚印——很多脚印，通向山谷深处。有人比你先来。");
  return t;
},options:[
  {t:"顺着脚印追上去",check:{a:"AGI",sk:"track",label:"追踪"},go:"relic_element_search",tier:{crit:[{t:"你顺着脚印，悄无声息地跟了上去。脚印的主人是一群佣兵——大概五个人，装备精良，行动有序。他们显然也是来找元素之心的。你跟在他们后面，没有被发现。",effect:{time:1,flag:"element_follow"}}],ok:[{t:"你顺着脚印往前走。脚印很新，说明前面的人走得不远。你加快了脚步，但没有刻意隐藏——在这种雪地里，隐藏也没什么用。",effect:{time:1}}],fail:[{t:"你顺着脚印往前走，但雪太大了，脚印很快就被覆盖了。你失去了方向，在冰风谷里转了很久，才找到正确的路。",effect:{time:2,hp:-5}}],critfail:[{t:"你顺着脚印往前走，却踩空了——雪下面是一个冰裂缝。你掉了下去，好在不深，但你扭伤了脚踝。等你爬出来，脚印已经完全消失了。",effect:{time:2,hp:-15,injury:"脚踝扭伤"}}]}},
  {t:"绕开脚印，走另一条路",go:"relic_element_search",effect:{time:2}}
]}};


  

N["relic_element_search"] = function(){return{place:"北方公国·元素祭坛",text:function(){
  var t=[];
  t.push("你终于走到了冰风谷的最深处。");
  t.push("眼前是一个巨大的冰洞。洞口有四根冰柱，每根冰柱上都刻着一个符号——火、水、土、风。冰洞里面，有蓝色的光在闪烁，像是有什么东西在呼吸。");
  if(S.flags.element_follow){
    t.push("那五个佣兵已经到了。他们站在冰洞门口，正在争论什么。");
    t.push("「我说了，先让法师去探路！」一个大胡子说。「不行！」另一个瘦高个说，「万一里面有陷阱呢？让那个盗贼去！」");
    t.push("他们没有注意到你。你可以趁他们争论的时候，偷偷溜进去。");
  } else {
    t.push("冰洞门口没有人。你是第一个到的。");
    t.push("但你能感觉到——冰洞里有一股强大的力量。那股力量在拉扯你，像是在召唤你，又像是在警告你。");
  }
  t.push("元素之心，就在里面。");
  return t;
},options:[
  {t:"走进冰洞",check:{a:"SPR",sk:"magic",label:"魔法感知"},go:"relic_element_puzzle",tier:{crit:[{t:"你走进冰洞，立刻感觉到了四种元素的力量。它们在冰洞里旋转、交织，形成了一个巨大的漩涡。你能感觉到漩涡的中心——元素之心就在那里。你甚至能感觉到它的「呼吸」——每一次呼吸，四种元素就涨落一次。",effect:{flag:"element_understood"}}],ok:[{t:"你走进冰洞。里面很冷，但你的身体里有一股暖流在流动——那是你自己的魔法在回应元素之心的力量。你看到了冰洞的中央，有一个石台，石台上放着一颗水晶——四种颜色的水晶，在缓缓旋转。",effect:{}}],fail:[{t:"你走进冰洞，立刻被一股寒气逼了回来。你的眉毛上结了霜，手指冻得发僵。你不得不退出来，搓了搓手，哈了口气，才重新走进去。",effect:{hp:-5,time:1}}],critfail:[{t:"你走进冰洞，脚下一滑——冰面上有一层看不见的薄冰。你摔了一跤，头撞在冰柱上，眼冒金星。等你爬起来，你发现——你迷路了。冰洞里到处都是一模一样的冰柱，你分不清方向。",effect:{hp:-10,sanLoss:3,time:1}}]}},
  {t:"先观察一下",go:"relic_element_puzzle",effect:{time:1}}
]}};


  

N["relic_element_puzzle"] = function(){return{place:"北方公国·元素祭坛",text:function(){
  var t=[];
  t.push("冰洞的中央，有一个石台。");
  t.push("石台上刻着一个复杂的法阵——四个圆环，分别代表火、水、土、风，交织在一起。法阵的中央，有一个凹槽——刚好能放下一颗水晶。");
  t.push("但凹槽是空的。元素之心不在石台上。");
  if(S.flags.element_understood){
    t.push("你闭上眼睛，感受着冰洞里四种元素的力量。你明白了——元素之心不是被放在石台上的，它是被「封印」在四种元素的漩涡里的。");
    t.push("要拿到它，你必须用自己的魔法，引导四种元素，让它们达到平衡。只有平衡的瞬间，元素之心才会显现。");
  } else {
    t.push("你绕着石台走了一圈，发现石台的侧面有一行字——很古老的字，是黄林晶的笔迹。");
    t.push("「四元素归一，心自现。」");
    t.push("你不太明白这是什么意思。但你能感觉到——冰洞里的四种元素，正在以某种规律旋转。也许，你需要做些什么，让它们「归一」。");
  }
  return t;
},options:[
  {t:"用魔法引导四种元素达到平衡",check:{a:"SPR",sk:"magic",label:"元素操控"},go:"relic_element_boss",tier:{crit:[{t:"你闭上眼睛，伸出双手。你感觉到了火的热、水的凉、土的沉、风的轻。你把它们一一引导，让它们在你的掌心交汇——热中有凉，沉中有轻，四种元素完美地融合在一起。冰洞里的漩涡突然静止了。然后，一颗水晶从虚空中浮现，缓缓落在石台上。元素之心。",effect:{flag:"element_balanced",item:"元素之心"}}],ok:[{t:"你伸出双手，尝试引导四种元素。它们很不听话——火想往上窜，水想往下流，土想沉下去，风想飘走。你花了很大的力气，才让它们勉强达到平衡。漩涡慢了下来，然后——一颗水晶从虚空中浮现，落在石台上。你的手在抖，但你做到了。",effect:{item:"元素之心",hp:-10}}],fail:[{t:"你伸出双手，尝试引导四种元素。但它们太强大了——你的魔法根本控制不住。火元素失控了，一团火球向你砸来。你躲开了，但冰洞的冰柱被融化了一片，冰水浇了你一身。",effect:{hp:-15,time:1}}],critfail:[{t:"你伸出双手，尝试引导四种元素。但你犯了一个错误——你把水元素和风元素搞混了。四种元素瞬间失控，冰洞里刮起了一场元素风暴。你被卷了进去，像一片落叶一样被甩来甩去。等风暴停下来，你躺在地上，浑身是伤，元素之心——不见了。",effect:{hp:-30,sanLoss:5,flag:"element_lost"}}]}},
  {t:"仔细研究法阵",check:{a:"INT",sk:"arcana",label:"奥术"},go:"relic_element_boss",effect:{time:1}}
]}};


  

N["relic_element_boss"] = function(){return{place:"北方公国·元素祭坛",text:function(){
  var t=[];
  if(S.flags.element_lost){
    t.push("元素之心不见了。");
    t.push("你躺在地上，喘着粗气，看着空荡荡的石台。四种元素的漩涡已经消失了，冰洞里只剩下冰冷的寂静。");
    t.push("你失败了。元素之心——可能永远消失了。");
    t.push("但你注意到，石台上的法阵，在微微发光。也许——还有办法。也许，你可以重新召唤它。");
    t.push("但那需要更强大的力量，更深厚的魔法造诣。现在的你，还做不到。");
    t.push("你站起来，拍了拍身上的冰碴。「总有一天，」你对自己说，「我会回来的。」");
  } else {
    t.push("元素之心在你的手心里。");
    t.push("它很小——只有拳头那么大，但很重。它的表面有四种颜色在流动——红的火、蓝的水、黄的土、绿的风。它在你的手心里微微发热，像是一颗活着的心脏。");
    t.push("你感觉到了——黄林晶的记忆。");
    t.push("那是三千年前的画面。年轻的黄林晶站在这个冰洞里，身边站着一个人——一个你看不清脸的人。他们一起锻造了元素之心。黄林晶说，「有了它，我们就能控制大陆的天气。有了它，我们就能让沙漠变成绿洲，让荒原变成良田。」");
    t.push("那个人说，「也能让绿洲变成沙漠。」");
    t.push("黄林晶没有回答。但你看到了——他的眼神里，有一丝犹豫。");
    t.push("记忆结束了。你站在冰洞里，手里握着元素之心，心里想着那个人的话。");
  }
  return t;
},options:[
  {t:"离开冰风谷",go:"relic_overview2",effect:{time:3,karma:1}}
]}};


  

N["relic_grail_intro"] = function(){return{place:"光明教会·圣城地下",text:function(){
  var t=[];
  t.push("圣城的地下，有一个被遗忘的墓穴。");
  t.push("你从教会图书馆的一本禁书里找到了线索——神圣圣杯，黄林晶留给光明神的遗产，就藏在圣城地下的初代教皇墓穴里。");
  t.push("但教会严禁任何人进入地下墓穴。那里是圣地，是禁区。被抓住的人，会被当作异端烧死。");
  t.push("你趁着夜色，从教堂的侧门溜了进去。地下墓穴的入口，在祭坛的下面——一块可以移动的石板。");
  t.push("石板下面，是一条向下的阶梯。阶梯很窄，很暗，空气中弥漫着古老的灰尘和——淡淡的血腥味。");
  t.push("你点燃了火把。火光在墙壁上跳动，映出了墙上的壁画——描绘着光明神的神迹，和初代教皇的生平。");
  return t;
},options:[
  {t:"沿着阶梯往下走",check:{a:"AGI",sk:"stealth",label:"潜行"},go:"relic_grail_search",tier:{crit:[{t:"你像猫一样，悄无声息地走下阶梯。你的每一步都踩在石阶的边缘，避免发出声音。你听到了远处有巡逻的脚步声——是教会的守卫。你贴在墙上，等他们走过去，才继续往下走。",effect:{flag:"grail_stealth"}}],ok:[{t:"你小心翼翼地走下阶梯。阶梯很滑，你差点摔了一跤，但你扶住了墙。你听到了远处有脚步声，但你躲在了一个壁龛里，等脚步声远去了才继续。",effect:{time:1}}],fail:[{t:"你走下阶梯，但你的脚踩到了一块松动的石头，「咔哒」一声，在寂静的墓穴里格外响亮。你屏住呼吸，等了很久——没有人来。但你知道，你必须快点了。",effect:{time:1,flag:"grail_alert"}}],critfail:[{t:"你走下阶梯，但你的火把引燃了墙上的蜘蛛网——火势瞬间蔓延开来。你手忙脚乱地把火扑灭，但动静已经惊动了守卫。你听到了远处传来的喊叫声和脚步声。",effect:{hp:-5,flag:"grail_chased",time:1}}]}},
  {t:"先研究墙上的壁画",go:"relic_grail_search",effect:{time:1,flag:"grail_lore"}}
]}};


  

N["relic_grail_search"] = function(){return{place:"光明教会·初代教皇墓穴",text:function(){
  var t=[];
  t.push("阶梯的尽头，是一个巨大的墓室。");
  t.push("墓室的中央，有一口石棺。石棺上刻着初代教皇的雕像——一个穿着长袍的老人，双手捧着一个杯子，仰望天空。");
  t.push("墓室的四周，有四根柱子，每根柱子上都刻着一段祷文。空气中弥漫着一股神圣的气息——让你觉得，自己的灵魂被净化了。");
  if(S.flags.grail_lore){
    t.push("你仔细看了壁画。壁画上描绘了一个故事——黄林晶把神圣圣杯交给了初代教皇。教皇问他，「这杯子有什么用？」黄林晶说，「它能治愈一切伤痛，能净化一切邪恶。但——」");
    t.push("壁画到这里就断了。黄林晶的「但」后面，似乎还有话，但被人刮掉了。");
    t.push("你觉得，这里面有问题。");
  }
  if(S.flags.grail_chased){
    t.push("你听到了身后传来的脚步声——守卫追来了。你必须快点。");
  }
  t.push("神圣圣杯，应该就在石棺里。");
  return t;
},options:[
  {t:"打开石棺",check:{a:"STR",sk:"athletics",label:"力量"},go:"relic_grail_puzzle",tier:{crit:[{t:"你推开石棺的盖子——它比你想象的要轻。石棺里没有尸体，只有一个杯子——金色的杯子，上面镶嵌着宝石，在火把的光线下闪闪发光。神圣圣杯。你伸手去拿——",effect:{flag:"grail_opened"}}],ok:[{t:"你用力推石棺的盖子。它很重，但你还是推开了一条缝。你从缝里看进去——石棺里没有尸体，只有一个杯子。你再用力一点，盖子完全打开了。",effect:{flag:"grail_opened",hp:-5}}],fail:[{t:"你用力推石棺的盖子，但它纹丝不动。你换了个角度，再推——还是不动。你花了很长时间，才找到一个可以借力的位置，把盖子推开了一条缝。",effect:{time:2,hp:-5,flag:"grail_opened"}}],critfail:[{t:"你用力推石棺的盖子，但你脚下一滑——整个人撞在了石棺上。石棺没开，你的肩膀却撞得生疼。更糟糕的是，石棺上的雕像被你撞掉了一只手——「轰隆」一声，在墓室里回荡。",effect:{hp:-15,flag:"grail_noise"}}]}},
  {t:"先检查四根柱子上的祷文",check:{a:"INT",sk:"lore",label:"学识"},go:"relic_grail_puzzle",effect:{time:1,flag:"grail_prayer"}}
]}};


  

N["relic_grail_puzzle"] = function(){return{place:"光明教会·初代教皇墓穴",text:function(){
  var t=[];
  if(S.flags.grail_prayer){
    t.push("你仔细读了四根柱子上的祷文。");
    t.push("前三根柱子上的祷文，都是正常的——赞美光明神，祈求庇佑。但第四根柱子上的祷文，不一样。");
    t.push("它写的是——「光明的背面，是阴影。神圣的尽头，是深渊。」");
    t.push("你觉得脊背发凉。这不像教会的祷文——这像是——警告。");
  }
  if(S.flags.grail_opened){
    t.push("石棺里，神圣圣杯静静地躺着。");
    t.push("你伸手去拿——但就在你的手指碰到杯子的一瞬间，墓室里的灯突然亮了。");
    t.push("不是火把的光——是金色的、神圣的光。光从四根柱子上射出来，汇聚在石棺上方，形成了一个人影——一个穿着长袍的老人的虚影。");
    t.push("「你是谁？」虚影说，声音像雷鸣，「为什么打扰我的安眠？」");
    t.push("是初代教皇的灵魂。他在守护神圣圣杯。");
  } else {
    t.push("石棺还没有打开。你需要想办法打开它。");
  }
  return t;
},options:[
  {t:"「我是来寻找黄林晶遗产的人。」",check:{a:"CHA",sk:"persu",label:"说服"},go:"relic_grail_boss",tier:{crit:[{t:"「黄林晶……」虚影沉默了，「他是一个复杂的人。他给了我圣杯，却也警告我——不要滥用它的力量。」虚影看着你，「你想要圣杯？你能保证，不滥用它的力量吗？」你点了点头。虚影叹了口气，「好吧。黄林晶说过，有一天会有人来取走它。也许——就是你。」金光散去，圣杯静静地躺在石棺里。",effect:{item:"神圣圣杯",flag:"grail_obtained"}}],ok:[{t:"「黄林晶的遗产……」虚影沉吟了一下，「他确实说过，有一天会有人来。但他也说过——来的人，必须通过考验。」虚影举起手，「你准备好了吗？」",effect:{flag:"grail_trial"}}],fail:[{t:"「黄林晶？」虚影的声音变冷了，「那个骗子！他给了我圣杯，却骗了我！」虚影愤怒了，「你是他的同伙？滚出去！」金光向你袭来——",effect:{hp:-20,sanLoss:5}}],critfail:[{t:"「黄林晶的遗产？」虚影突然大笑起来，「哈哈哈！你知道黄林晶是什么人吗？他是——」虚影的话突然停住了，像是被什么东西封住了嘴。然后他的表情变得扭曲，「不……不能说……」金光暴走了，整个墓室都在震动。",effect:{hp:-25,sanLoss:10,flag:"grail_secret"}}]}},
  {t:"拿起圣杯就跑",go:"relic_grail_boss",effect:{flag:"grail_grab"}}
]}};


  

N["relic_grail_boss"] = function( /*v58eng:aifresh:misc*/){return{place:"光明教会·初代教皇墓穴",text:function(){
  var t=[];
  if(S.flags.grail_obtained){
    t.push("神圣圣杯在你的手里。");
    t.push("它很轻——比你想象的要轻。杯子是金色的，但不是普通的金——是一种你从未见过的、发着光的金属。杯壁上刻着细密的符文，在你手心里发热。");
    t.push("你感觉到了——黄林晶的记忆。");
    t.push("三千年前，黄林晶站在这个墓室里，把圣杯交给初代教皇。教皇问他，「这杯子有什么用？」黄林晶说，「它能治愈一切伤痛，能净化一切邪恶。」");
    t.push("然后他顿了顿，说，「但它也有代价。每治愈一个人，使用者的寿命就会缩短一年。每净化一次邪恶，使用者的灵魂就会被污染一分。」");
    t.push("教皇愣住了。「那你为什么要把它给我？」");
    t.push("黄林晶说，「因为光明教会的人，最懂得牺牲。」");
    t.push("记忆结束了。你站在墓室里，手里握着圣杯，心里想着黄林晶的话。");
    t.push("你听到了远处传来的脚步声——守卫追来了。你必须走了。");
  } else if(S.flags.grail_grab){
    t.push("你一把抓起圣杯，转身就跑。");
    t.push("身后传来虚影的怒吼——「小偷！把圣杯还给我！」");
    t.push("金光在你身后炸开，你感觉到后背一阵灼痛。但你没有停——你沿着阶梯往上跑，火把掉了也不管。");
    t.push("你冲出了教堂，消失在夜色里。圣杯在你怀里发烫——像是在抗议，又像是在哭泣。");
  } else {
    t.push("你站在墓室里，面对着初代教皇的灵魂。");
    t.push("接下来会发生什么，取决于你的选择。");
  }
  return t;
},options:[
  {t:"离开墓穴",go:"relic_overview2",effect:{time:2,karma:1}}
]}};


  

N["board_north"] = function(){
  const picks = shuffle(NORTH_BOARD).slice(0,3);
  return {
    place:"北方公国联盟 · 冒险者公会委托板", where:"白昼",
    text:["委托板前人头攒动。战争时期，活计比平时多了一倍，赏金也厚。你扫了一遍，挑了三个顺眼的。", "出了冒险者公会委托板，风迎面扑来。你认了认方向，启程。"],pace:"light",
    options: picks.map(b=>({
      t:b.t, check:b.check, tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},
      effects:b.okEff, onFail:b.failEff, go:"board_north_done"
    })).concat([{t:"不接了，办正事要紧",go:"north_leave"}])
  };
};

N["board_north_done"] = {tag:"branch",
  place:"委托板", text:["你把委托交了，赏金落袋。这年头，力气和胆量，都是硬通货。","你把委托交了，赏金落袋。铁门关的委托板钉在兵营外墙，纸上沾着灰尘和几点暗色的旧渍——不知是酒还是别的什么。","","旁边一个老兵正往板上钉新告示：“北边雪原闹狼群，猎队缺人手，酬金面议。”他钉完，转头看你：“小子，要是缺钱，这单不错。就是路远，风大。”","","你谢过他。风从关外灌进来，带着雪和铁的味道。你掂了掂钱袋——这年头的安稳日子，都是用脚走出来的。","", "你与委托板作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"light",
  options:[
    {t:"再接一单",go:"board_north"},
    {t:"继续赶路",run:function(){ togglePanel("map"); }}
  ]
};

N["board_south"] = function(){
  const picks = shuffle(SOUTH_BOARD).slice(0,3);
  return {
    place:"南方商业城邦联盟 · 冒险者公会委托板", where:"白昼",
    text:["南方联盟的委托板比北方多了一倍，活计也五花八门：护送、送信、鉴定、采集。你扫了一遍，挑了三个。", "冒险者公会委托板已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"light",
    options: picks.map(b=>({
      t:b.t, check:b.check, tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},
      effects:b.okEff, onFail:b.failEff, go:"board_south_done"
    })).concat([{t:"不接了，办正事要紧",go:"south_moxie_go"}])
  };
};

N["board_south_done"] = {tag:"branch",
  place:"委托板", text:["南方联盟的活计，来钱快，水也深。你把赏金收好，掂了掂分量。", "委托板已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"light",
  options:[
    {t:"再接一单",go:"board_south"},
    {t:"继续赶路",run:function(){ togglePanel("map"); }}
  ]
};

N["board_elf"] = function(){
  const picks = shuffle(ELF_BOARD).slice(0,2);
  return {place:"精灵边境 · 委托板",text:["精灵边境的活计不多，但都干净。", "委托板的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_elf_done"})).concat([{t:"离开",go:"elf_done"}])};
};

N["board_elf_done"] = {place:"委托板",text:["活计办妥，赏金落袋。", "委托板已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"light",options:[{t:"再接一单",go:"board_elf"},{t:"离开",go:"elf_done"}]};

N["board_dwarf"] = function(){
  const picks = shuffle(DWARF_BOARD).slice(0,3);
  return {place:"矮人王国 · 委托板",text:["矮人的活计，都跟铁与力有关。你扫了一眼委托板。", "你离了委托板，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_dwarf_done"})).concat([{t:"离开",go:"dwarf_done"}])};
};

N["board_dwarf_done"] = {place:"委托板",text:["活计办妥，赏金落袋。", "委托板的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",options:[{t:"再接一单",go:"board_dwarf"},{t:"离开",go:"dwarf_done"}]};

N["board_orc"] = function(){
  const picks = shuffle(ORC_BOARD).slice(0,2);
  return {place:"兽人草原 · 边市",text:["草原边市上的活计，粗犷而直接。你扫了一眼。", "你与边市作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"light",options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_orc_done"})).concat([{t:"离开",go:"orc_done"}])};
};

N["board_orc_done"] = {place:"边市",text:["活计办妥，赏金落袋。", "从边市出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"light",options:[{t:"再接一单",go:"board_orc"},{t:"离开",go:"orc_done"}]};

N["board_east"] = function(){
  const picks = shuffle(EAST_BOARD).slice(0,3);
  return {place:"东部王国 · 委托板",text:["东部的活计，规矩多，赏钱也准。你扫了一眼。", "别过委托板，你沿官道走出里许，回头已看不清来处。"],pace:"light",options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_east_done"})).concat([{t:"离开",go:"east_after"}])};
};

N["board_east_done"] = {place:"委托板",text:["活计办妥，赏金落袋。","委托板上，那张泛黄的纸被取下，露出下面一排新的告示。赏金袋在手里沉甸甸的，铜星碰着银角，叮当作响。","","你把袋子收进怀里。板子旁边的木柱上，用炭笔写着几行小字，是别的佣兵留的：“东境粮价又涨了——跑商的人说，边关在囤货。”","","你记下这句话，转身走进市集。叫卖声迎面扑来，热腾腾的炊饼气味混着铁器的腥味。这座城，从来不缺活计，也不缺消息。","", "委托板的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",options:[{t:"再接一单",go:"board_east"},{t:"离开",go:"east_after"}]};

N["board_church"] = function(){
  const picks = shuffle(CHURCH_BOARD).slice(0,2);
  return {place:"圣城 · 委托板",text:["圣城的活计，干净，赏钱也干净。你扫了一眼。", "委托板在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",options:picks.map(b=>({t:b.t,check:b.check,tier:{ok:b.ok,fail:b.fail,crit:b.ok,critfail:b.fail},effects:b.okEff,onFail:b.failEff,go:"board_church_done"})).concat([{t:"离开",go:"church_after"}])};
};

N["board_church_done"] = {tag:"branch",place:"委托板",text:["活计办妥，赏金落袋。","委托板钉在教堂侧门的廊柱上，纸页被烛火熏得微黄。你交了活计，赏金袋落进掌心，铜钱带着圣城特有的、被香火熏过的温热。","","一个修士从你身边走过，看了你一眼，欲言又止。他最终还是开口：“最近别接那些‘关于圣物的委托’——教会那边，最近查得严。”","","你点头谢过他，把赏金收好。圣城的钟声正好响起，一声接一声，把市集的喧闹盖了过去。","", "离开委托板时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"light",options:[{t:"再接一单",go:"board_church"},{t:"离开",go:"church_after"}]};

N["board_free"] = {
  place:"自由城邦 · 冒险者之城 · 委托板",where:"白昼",
  text:[
    "委托板上贴满了纸片。风一吹，纸角哗哗地响。",
    "你扫了一圈，挑出几张还算靠谱的。", "冒险者之城的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"light",
  options:(function(){
    const picks = FREE_BOARD.slice().sort(function(){return Math.random()-0.5;}).slice(0,2);
    return picks.map(function(q,i){
      return {t:q.t,check:q.check,tier:{ok:q.ok,fail:q.fail},okEff:q.okEff,failEff:q.failEff,go:"board_free_after"};
    });
  })()
};

N["board_free_after"] = {
  place:"自由城邦 · 冒险者之城",where:"白昼",
  text:[
    "委托交了。报酬入袋，沉甸甸的。",
    "公会的墙上，贴着一张大陆全图。你的视线沿着商路，从自由城邦出发，扫过北方、南方、精灵、矮人、草原、东境、圣城、沙漠。",
    "路还长。"
  ],pace:"light",
  options:[
    {t:"继续在自由城邦转转",go:"arrive_free_gonghui"},
    {t:"打开地图，规划下一段旅途",run:function(){ togglePanel("map"); }}
  ]
};



N["quest_bandit_camp"] = function(){ return {tag:"branch",
  place:"自由城邦 · 北郊山贼营地", where:"",
  text:[
    "你按照告示板上的描述，找到了山贼的营地。",
    "在一片小树林里，几个帐篷，一堆篝火，火上烤着什么东西，散发着油腻的香味。",
    "两个山贼在营地门口站岗，手里拿着长矛，矛尖已经锈了。",
    "你数了数，营地里大概有五六个人。不算多，但也不算少。"
  ],pace:"light",
  options:[
    {t:"潜行靠近，逐个解决", check:{a:"AGI",sk:"stealth",label:"潜行"},
  tier:{
    crit:function(){return[pickV(["你绕到营地的侧面，借着树木的掩护，一点点靠近。风很配合，把你的气味带走了。你摸到第一个山贼身后——他正在打哈欠，嘴张得很大。你捂住他的嘴，一刀抹了脖子。第二个山贼听到动静，转过头来，你已经到了他身后。第三个、第四个——你像影子一样，在营地里穿梭，每个山贼都在毫无察觉的情况下被解决。最后一个山贼是在睡梦中被你解决的。整个过程，没有发出一点声音。你擦了擦刀上的血，看着营地——五具尸体，安静地躺着，像睡着了一样。","你潜行的时候，注意到山贼们的站位有漏洞——两个站岗的山贼，视线的交汇点有一个三秒的盲区。你算准时间，在盲区里移动，逐个解决。第一个山贼被你从后面勒住脖子，无声无息。第二个山贼转身的时候，你已经躲在了帐篷后面。你用了不到一刻钟，就解决了所有山贼。最妙的是，你在解决最后一个山贼的时候，他甚至还在说梦话——'别抢我的酒……'"],"bandit_stealth_crit")]},
    ok:function(){return[pickV(["你绕到营地侧面，借着树木掩护靠近。你摸到第一个山贼身后，捂住他的嘴，一刀抹了脖子。第二个山贼听到了动静，转过头来——你及时解决了他。虽然有些惊险，但你成功地逐个解决了山贼。","你潜行靠近，逐个解决山贼。过程中差点被发现，但最终成功了。"],"bandit_stealth_ok")]},
    fail:function(){return[pickV(["你潜行靠近，但踩到了一根树枝——'咔嚓'一声，在安静的树林里格外响亮。'谁？！'一个山贼喊了一声，拿起长矛朝你这边走过来。你屏住呼吸，躲在树后面。他走过来查看，你趁他不注意，一刀捅了过去。但动静已经惊动了其他人——剩下的山贼都拿起了武器，朝你围了过来。你不得不正面迎战。","你潜行时被发现了，不得不正面战斗。虽然最终赢了，但受了些伤。"],"bandit_stealth_fail")]},
    critfail:function(){return[pickV(["你潜行靠近，但太紧张了——你的手在抖，刀鞘撞到了树干上，发出'当'的一声。'有人！'山贼们立刻警觉起来，火把亮了，长矛对准了你藏身的方向。'出来！'一个山贼喊，'我看到你了！'你知道自己暴露了，转身就跑。但一支长矛从后面飞过来，扎进了你的大腿。你惨叫一声，摔倒在地。山贼们围上来，把你绑了。'又是一个想当英雄的。'山贼头子冷笑，'搜他的身。'他们把你的钱袋、武器、甚至靴子都抢走了。最后把你扔在树林里，光着脚，大腿上还插着半截矛杆。你花了整整一天才爬回城里。","你潜行时不仅被发现了，还被山贼们包围了。你试图反抗，但寡不敌众，被打倒在地。他们把你揍了一顿，抢走了所有值钱的东西，然后把你扔在树林里。你浑身是伤，钱也没了，武器也没了——这趟委托，亏大了。"],"bandit_stealth_cf")]}
  },
  onCrit:{flag:"bandit_camp_clean_stealth",skillUp:"stealth",rep_free:3},
  onOk:{rep_free:1},
  onFail:{hp:-10,wound:"刀伤"},
  onCritFail:{hp:-25,gold:-50,wound:"矛伤+瘀伤",flag:"bandit_camp_robbed",item_lose:true},
  go:"quest_bandit_stealth"},
    {t:"正面冲进去", run:function(){ startCombat("bandit","山贼营地","quest_bandit_camp_after"); }},
    {t:"在营地外面放火，把他们逼出来", check:{a:"INT",sk:"survival",label:"火攻"},
  tier:{
    crit:function(){return[pickV(["你在营地的上风头堆了干草和枯枝，然后点着了。但你没有只点一堆——你在三个不同的位置同时点火，形成了一个半包围的火墙。风把烟吹进营地，山贼们咳嗽着冲出来。但他们冲出来的方向，正是你预设的伏击点。你趁乱摸进营地，找到了钱箱——一个铁盒子，沉甸甸的。然后你又趁乱出来，整个过程没有被任何人发现。火还在烧，山贼们在救火，根本没人注意到你。'完美。'你心里说。","你放火的时候，注意到了风向——风是从西北往东南吹的。你在上风头堆了干草，还特意加了一些潮湿的树枝——这样烟会更浓，更呛人。火点着之后，浓烟滚滚，灌进营地。山贼们咳嗽着、叫骂着冲出来。你趁乱摸进去，不仅找到了钱箱，还在山贼头子的帐篷里找到了一封信——封蜡上印着暗蚀会的标记。你把信和钱箱一起带走了。这把火，放得值。"],"bandit_fire_crit")]},
    ok:function(){return[pickV(["你在上风头堆了干草和枯枝，点着了。火很快烧起来，烟顺着风飘进营地。山贼们咳嗽着冲出来，乱成一团。你趁乱摸进营地，找到了钱箱。","你用火攻把山贼逼出来，趁乱拿走了钱箱。计划成功了。"],"bandit_fire_ok")]},
    fail:function(){return[pickV(["你放火了，但风向突然变了——烟朝你这边吹过来。你被烟呛得直咳嗽，眼泪直流。山贼们发现了火，也发现了你——'有人放火！抓住他！'你转身就跑，虽然最终逃脱了，但火攻没有达到预期的效果——山贼们没有乱，反而组织起来救火了。你什么都没拿到。","你放火了，但火势不够大，山贼们很快就控制住了。你不得不撤退，什么都没拿到。"],"bandit_fire_fail")]},
    critfail:function(){return[pickV(["你放火了，但你犯了一个致命的错误——你在下风头点的火。风把火和烟全吹回了你身上。你的衣服烧着了，头发也焦了。你在地上打滚灭火，惨叫声引来了山贼。'放火的家伙在那里！'山贼们冲过来，把你按在地上。'胆子不小啊。'山贼头子冷笑，'敢烧我的营地？'他们把你打了一顿，然后把你绑在营地的柱子上，'让你看着我们怎么收拾你。'幸好，到了晚上，你趁他们喝醉了，咬断绳子逃了出来。但你浑身是伤，钱也被抢了，头发也烧没了一半——这趟委托，简直是灾难。","你放火的时候，不小心把自己也烧着了。你在地上打滚，惨叫声引来了山贼。他们把你抓住，揍了一顿，抢走了所有东西。最后把你扔在火边——'让你跟火作伴。'你好不容易才爬出来，半边脸都烧伤了。"],"bandit_fire_cf")]}
  },
  onCrit:{gold:15,flag:"bandit_camp_fire_perfect",item:"山贼钱箱",flag:"darkcult_bandit_letter"},
  onOk:{gold:15,item:"山贼钱箱"},
  onFail:{hp:-8,wound:"烟熏"},
  onCritFail:{hp:-20,gold:-30,wound:"烧伤",flag:"bandit_camp_fire_disaster"},
  go:"quest_bandit_fire"}
  ]
};};


N["quest_bandit_stealth"] = function(){ return {tag:"branch",
  place:"自由城邦 · 北郊山贼营地", where:"",
  text:[
    "你绕到营地的侧面，借着树木的掩护，一点点靠近。",
    "风很配合，吹向营地的方向，把你的气味带走了。",
    "你摸到第一个山贼身后。他正在打哈欠，嘴张得很大——你捂住他的嘴，一刀抹了脖子。他哼都没哼一声，就软了下去。",
    "第二个山贼听到了动静，转过头来。他的眼睛瞪得很大，但已经来不及了。"
  ],pace:"light",
  options:[
    {t:"（成功）无声解决两个，继续潜入", req:function(){return lastLvl==="normal"||lastLvl==="hard"||lastLvl==="extreme"||lastLvl==="crit";}, run:function(){ startCombat("bandit","潜入被发现","quest_bandit_camp_after"); }},
    {t:"（失败）踩到树枝，被发现了", req:function(){return lastLvl==="fail"||lastLvl==="critfail";}, run:function(){ startCombat("bandit","潜行暴露","quest_bandit_camp_after"); }}
  ]
};};


N["quest_bandit_fire"] = function(){ return {tag:"branch",
  place:"自由城邦 · 北郊山贼营地", where:"",
  text:[
    "你在营地的上风头堆了一些干草和枯枝，然后点着了。",
    "火很快烧起来。烟顺着风飘进营地，山贼们开始咳嗽、叫骂。",
    "“着火了！着火了！”有人喊。",
    "山贼们从帐篷里冲出来，乱成一团。你趁乱摸进营地，找到了他们的钱箱——一个铁盒子，沉甸甸的。"
  ],pace:"light",
  options:[
    {t:"拿了钱箱就跑", effect:{gold:15,item:"山贼钱箱"}, go:"quest_bandit_camp_after"},
    {t:"趁乱再杀几个", run:function(){ startCombat("bandit","火攻混乱中","quest_bandit_camp_after"); }}
  ]
};};


N["quest_bandit_camp_after"] = function(){ return {tag:"branch",
  place:"自由城邦 · 北郊山贼营地", where:"",
  text:[
    "营地安静了。",
    "你搜了搜，找到一些钱和物资。还有一封信，封蜡上印着一只闭着的眼睛——暗蚀会的标记。",
    "信的内容很简单：“继续截断商路。三个月内，让自由城邦的粮价翻三倍。”",
    "你把信收好。原来这些山贼，不是普通的山贼。他们是暗蚀会的棋子。", "从北郊山贼营地出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"light",
  options:[
    {t:"回城里交委托", effect:{gold:10,rep:2,flag:"bandit_camp_cleared",flag:"darkcult_bandit_letter"}, go:"arrive_generic"},
    {t:"仔细研究这封信", check:{a:"INT",sk:"lore",label:"分析"},
  tier:{
    crit:function(){return[pickV(["你把信翻来覆去看了几遍。信纸的质地很特别——不是普通的纸，是一种很薄的羊皮，上面有极细的纹路。你认出来了，这是教会专用的信纸。而且，你还注意到一个细节——信纸的角落有一个极小的水印，是教会文书处的标记。'暗蚀会在用教会的信纸。'你喃喃道，'而且是教会内部专用的信纸——这种纸，只有红衣主教以上级别的人才能使用。'这意味着什么？要么暗蚀会渗透进了教会的最高层，要么——教会的最高层，有人在跟暗蚀会合作。你把信烧掉了，但你记住了这个发现。这个秘密，比一百金龙还值钱。","你分析这封信的时候，不仅认出了信纸是教会专用的，还破译了信末的署名——'密眼司·第三联络人'。密眼司是暗蚀会的第五部门，专司监视与情报。第三联络人，意味着在自由城邦地区，至少还有两个联络人。而且，信的内容里有一个暗语——'让粮价翻三倍'。这不是普通的截断商路，这是经济战——暗蚀会想通过制造饥荒来动摇自由城邦的稳定。你把这些信息都记在了心里。"],"bandit_letter_crit")]},
    ok:function(){return[pickV(["你把信翻来覆去看了几遍。信纸是教会专用的羊皮纸。暗蚀会在用教会的信纸——这意味着暗蚀会渗透进了教会，或者教会里有人在给暗蚀会提供物资。你把信烧掉了，但记住了信末的署名。","你分析出这封信是用教会专用信纸写的，暗蚀会与教会内部有勾结。你记住了这个重要发现。"],"bandit_letter_ok")]},
    fail:function(){return[pickV(["你看了这封信，但除了'继续截断商路'和'密眼司'之外，看不出更多的东西。信纸的质地你也说不上来——就是觉得有点特别。你把信收起来，打算以后找人问问。","你分析了信，但知识不够，只看出这是暗蚀会的命令，看不出更深的含义。"],"bandit_letter_fail")]},
    critfail:function(){return[pickV(["你研究这封信的时候，忍不住念出了声——'密眼司·第三联络人……'话刚出口，你就感觉到了——空气里有什么东西动了一下。你猛地抬头，营地外面的树林里，有一双眼睛在看着你。不是动物的眼睛——是人的。你立刻把信塞进怀里，拔出武器。但那双眼睛消失了——像从来没有存在过一样。你站在原地，心跳如擂鼓。你知道，你被盯上了。暗蚀会的人，一直在监视这个营地。而你刚才念出了他们的联络人代号——他们知道你看懂了这封信。从那以后，你总觉得背后有人在跟着你。夜里也经常做同一个噩梦——一双眼睛，在黑暗中盯着你。"],"bandit_letter_cf")]}
  },
  onCrit:{flag:"darkcult_church_link_deep",skillUp:"lore",flag:"darkcult_bandit_letter"},
  onOk:{flag:"darkcult_church_link",flag:"darkcult_bandit_letter"},
  onFail:{flag:"darkcult_bandit_letter"},
  onCritFail:{sanLoss:8,flag:"darkcult_watching",wound:"被监视的偏执"},
  go:"quest_bandit_letter"}
  ]
};};


N["quest_bandit_letter"]={tag:"branch",
  place:"自由城邦 · 北郊山贼营地", where:"",
  text:[
    "你把信翻来覆去看了几遍。",
    "信纸的质地很特别——不是普通的纸，是一种很薄的羊皮，上面有极细的纹路。你认出来了，这是教会专用的信纸。",
    "暗蚀会在用教会的信纸。这意味着什么？",
    "要么，暗蚀会渗透进了教会。要么——教会里有人，在给暗蚀会提供物资。",
    "你把信烧掉了。灰烬被风吹散，像一群黑色的蝴蝶。",
    "但你记住了信末的署名：“密眼司·第三联络人。”"
  ],pace:"normal",
  options:[{t:"回城，把这个秘密藏在心里", effect:{flag:"darkcult_church_link"}, go:"arrive_generic"}]
};


N["quest_research"] = function(){ return {tag:"branch",
  text:["你帮一位教授整理研究资料。工作枯燥，但你在资料中发现了一些有趣的东西。"],pace:"light",
  options:[
    {t:"认真整理（智力）", check:{attr:"INT", label:"智力·整理", target:50},
      tier:{ok:function(){return[pickV(["你整理得又快又好，教授很满意。◆金币+10，教授好感+5","你在资料中发现了一个错误，教授对你刮目相看。◆金币+10，教授好感+10，获得知识"],"research_ok")]},
      fail:function(){return[pickV(["你整理得马马虎虎，教授不太满意。◆金币+5","你不小心弄丢了一份重要资料，教授很生气。◆金币+0，教授好感-5"],"research_fail")]}},
      go:"academy_quests", effect:{time:5}},
    {t:"偷懒应付", effect:{gold:5, flag:"quest_lazy"}, go:"academy_quests", effect:{time:2}}
  ]
};}


N["quest_classmate"]=function(){return{tag:"branch",
place:"委托·同窗",
text:["你答应帮同窗一个忙——他最近在整理一份旧档案，缺几卷资料，那些资料只有学院图书馆的深处才有。", "你来到图书馆的旧藏区，顺着索引找到那排书架。灰尘很厚，你抽出一卷，封面上印着泛黄的日期——那是很多年前的事了。", "你翻开卷宗，本想着快点找到需要的资料，却渐渐被内容吸引——上面记录着一些旧事，其中几页提到的人名和事件，你似乎在别的地方见过。", "你把那几页折了个角，记下位置，然后找到同窗要的资料，一并带了出来。有些忙，帮到最后，往往会帮出些意外收获。", "你帮同窗，做了一件，他自己做不了的事。这件事，你没有告诉他，全部的真相。", "他托你，去取一样东西。你去了。你取到东西，回来的路上，你发现，那样东西，比他想的多了一重——它背后，还连着另一件事。", "你站在路口，想了很久。你最终，没有告诉他那件事。你把东西，原样，交给了他。", "他接过东西，很高兴。他连声道谢。你看着他高兴的样子，笑了笑，说：「没什么。」", "你走出门，回头，看了一眼。他还在摆弄那样东西。你转回身，走了。你在想，那件没有说的事，你将来，会不会，后悔。", "出了同窗，风迎面扑来。你认了认方向，启程。"],pace:"normal" /*v45inj:quest_classmate*/,
options:[
{t:"把资料交给同窗", go:"quest_hub"},
{t:"先自己研究一下", go:"quest_hub"}
]
}};


N["quest_tutor"]=function(){return{tag:"branch",
place:"委托·师长",
text:["导师交给你一个任务：整理他手头一批散乱的笔记，把其中关于封印术的部分单独摘出来，编成一本小册子。", "你花了两天时间，把那些字迹潦草的笔记一页页梳理清楚。导师的字很难认，但内容却很有意思——有几段记录了他年轻时参与的一次封印行动，细节生动，像冒险小说。", "你在整理中发现，笔记里有一页被撕掉了，只剩半张残页，上面写着半句话：「如果封印再次松动，唯一的办法是——」后面的字被撕掉了。", "你犹豫了一下，把那半张残页的事记在心里，没有多问。有些事，导师不说，自然有他不说的理由。", "导师给你布置了一项任务。任务本身不难，难的是，完成它的方式。", "「去把这个东西，送到城南的旧书铺。」他递给你一个包裹，「记住——不要打听，不要拆开，送到就回。」", "你接过包裹，掂了掂，很轻。你问他，这是什么。他说：「你不用知道。」他顿了顿，「你只需要知道，它该到哪去。」", "你带着包裹，出了门。你走在路上，好几次，想拆开看看。你都忍住了。你把它送到城南旧书铺，交到那个老板手里。老板接过，没有问，只点了点头。", "你转身，走出书铺。你走在回去的路上，心里，忽然有一种很奇怪的感觉——不是好奇了，是踏实。你发现，有些事，不去知道答案，反而，是对的。"],pace:"normal" /*v45inj:quest_tutor*/,
options:[
{t:"把整理好的册子交给导师", go:"quest_hub"},
{t:"追问残页的事", go:"quest_hub"}
]
}};


N["quest_event"]=function(){return{tag:"branch",
place:"委托·事件",
text:["你接下的这个委托，比看上去要复杂得多。委托人说丢了件祖传的信物，求你帮忙找回来——但你调查后发现，那件信物牵涉的旧事，远比「祖传」两个字复杂。", "你顺着线索查下去，发现信物几经转手，每一任持有者都有一段故事：有商人，有盗贼，还有一个已经去世多年的老妇人。", "你在老妇人的旧居里，找到一封没有寄出的信。信里写着信物的来历——它确实珍贵，但珍贵的不是它的价值，而是它见证过的一段约定。", "你握着那封信，站在老妇人空荡荡的院子里，忽然觉得，这委托的答案，也许不在信物本身，而在这些被遗忘的人和事里。", "你赶上了一场，正在发生的事。事情不小，你正好，在场。", "你一开始，只是想看看。但事情的发展，比你预想的快。你还没来得及决定，你已经被卷进去了。", "你帮了一把手。你做的事，不大，但恰好，改变了一点什么。有人注意到你了。他朝你，点了点头。", "事后，他找到你：「你刚才，做得不错。」他说，「有没有兴趣，跟着我干？」你问他，干什么。他说：「干点，对的事。」", "你站在那里，想了很久。你最后，没有立刻答应。你说：「让我想想。」他点了点头：「行。想好了，来找我。」他走了。你站在原地，想了很久，很久。", "你离了事件，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:quest_event*/,
options:[
{t:"把信物交还委托人", go:"quest_hub"},
{t:"继续深挖旧事", go:"quest_hub"}
]
}};


N["quest_secret"]=function(){return{tag:"branch",
place:"委托·秘密",
text:["你在一次委托中，无意间触碰了一个秘密。那是一个尘封多年的名字，出现在一份不该存在的名单上。", "你盯着那个名字看了很久。它和某件你一直在调查的事，隐隐有着联系——但你还不确定，这联系是巧合，还是有人在刻意安排。", "你把名单抄了一份，原件放回原处。走出那间屋子时，你留心观察了四周——确认没有人跟踪，才松了口气。", "你走在夜色里，反复琢磨那个名字。有些秘密，知道了就是知道了，装不知道，反而更危险。你决定，把它查清楚。", "你接下了一件，不能说的差事。接下它的那一刻，你就知道，这件事，会改变一些什么。", "给你差事的人，只说了三句话。第一句：「这事，只有你能做。」第二句：「做了，别说。」第三句：「做完，忘了。」", "你问他，为什么是你。他说：「因为，你正好，出现在了，它该发生的时候。」你不太明白。他没有解释。", "你做了那件事。你做得，比你想的顺利。你做完，像他说的，没有说，也没有再想。", "但有些事，不是你说忘，就能忘的。那天夜里，你翻来覆去，睡不着。你在想，那三句话里的，每一个字。", "秘密在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"normal" /*v45inj:quest_secret*/,
options:[
{t:"追查名单上的名字", go:"quest_hub"},
{t:"暂时按兵不动", go:"act_rest"}
]
}};


N["shop_generic"]=function(){return{
place:"商店",
text:["你走进了当地的商店。", "商店里摆满了各种各样的商品——武器、盔甲、药水、魔法物品、食物、日用品。店主是一个精明的中年人，看到你进来，脸上立刻堆起了笑容。", "「欢迎光临！」他说，「您需要点什么？我们这里什么都有，价格公道，童叟无欺！」", "你浏览了一下货架，看到了很多有趣的东西。", "（此节点为v38通用商店节点，后续将根据具体城市补充完整商品列表和叙事内容。）", "你走进铺子。门上挂着的铃铛，叮当一声，响了一下。", "掌柜的抬起头，打量了你一眼：「要点什么？」他放下手里的账本，走了过来。", "货架上，摆着一些常用的东西。你看着，盘算着，这一趟，该买些什么。", "你挑了几样，递过去。掌柜的接过来，称了称，报了价。你付了钱，他把东西，用纸包好，递给你。", "你接过东西，走出门。铃铛又在身后，叮当一声。你回头，看了一眼，他已经坐回柜台后，继续看账本了。"],pace:"normal" /*v45inj:shop_generic*/,
options:[
{t:"购买物品", go:"shop_buy_generic"},
{t:"出售物品", go:"shop_sell_generic"},
{t:"随便看看就走", go:"arrive_generic"}
]}};


N["shop_buy_generic"]=function(){return{
place:"商店 · 购买",
text:["你浏览了商店的商品，挑选了一些你需要的东西。", "店主笑眯眯地给你报价，你和他讨价还价了一番，最终以一个双方都满意的价格成交。", "你把买好的东西放进包里，然后离开了商店。", "（此节点为v38通用购买节点，后续将补充完整的商品列表和交易系统。）", "你挑好了东西，拿到柜台前。掌柜的看了一眼：「就这些？」你点了点头。", "他拿起算盘，噼里啪啦地，打了一阵，报了个数。你数出钱，递过去。他接过来，点了点，收进钱匣。", "他把东西，用纸，一件一件地，包好。他包得很仔细，像包一件，贵重的东西。", "「拿好。」他把纸包递给你，「回头客，下次，给你算便宜点。」", "你接过纸包，道了谢，走出门。你掂了掂手里的东西，觉得，这趟，没白来。", "购买的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal" /*v45inj:shop_buy_generic*/,
options:[
{t:"继续购物", go:"shop_generic"},
{t:"离开商店", go:"arrive_generic"}
]}};


N["shop_sell_generic"]=function(){return{
place:"商店 · 出售",
text:["你把一些不需要的东西拿出来，准备卖给店主。", "店主仔细检查了你的物品，然后给你报了一个价格。你和他讨价还价了一番，最终以一个双方都满意的价格成交。", "你把卖东西得来的钱放进包里，然后离开了商店。", "（此节点为v38通用出售节点，后续将补充完整的物品估价和交易系统。）", "你把手里的东西，放在柜台上。掌柜的拿起来，翻来覆去，看了看。", "「这东西，」他开口，「你想卖多少？」你说了个数。他想了想，摇了摇头：「高了。」", "你们来来回回，磨了一会儿。最后，以一个，你们都能接受的价格，成交了。", "他数了钱，递给你。你接过钱，数了数，收好。", "你走出门，回头，看了一眼。他已经把你的东西，摆到了货架上。你忽然觉得，有些东西，一旦卖了，就再也，拿不回来了。", "你离了出售，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal" /*v45inj:shop_sell_generic*/,
options:[
{t:"继续卖东西", go:"shop_generic"},
{t:"离开商店", go:"arrive_generic"}
]}};


N["time_window_missed_demo"] = function(){
  return {
    place: "错过的时间窗口",
    text: function(){
      const arr = [];
      arr.push("你回到学院时，墨丘利的办公室已经空了。");
      arr.push("桌上的茶杯还温着，书页翻到一半，椅子上还留着他的体温。");
      arr.push("但他走了。");
      arr.push("你问其他教授，他们支支吾吾。你问学生，他们说「墨丘利教授前几天还在啊」。");
      arr.push("你知道——你错过了。你在大陆游历的时候，墨丘利在等你。等你回来，一起做一件事。但你没回来。");
      arr.push("现在他走了。去了哪里？不知道。还会不会回来？不知道。");
      arr.push("你站在空办公室里，看着那杯温茶。");
      arr.push("世界不等你。");
      return arr;
    },
    options: [
      { t:"追查墨丘利的下落", go:"fc_jiaohui_entry", effect:{flag:"mercury_missing", karma:"regret"} },
      { t:"算了，也许他有自己的理由", go:"fc_jiaohui_entry", effect:{flag:"let_mercury_go", san:-3} }
    ]
  };
};


N["timeline_overview"] = function(){
  worldClockInit();
  return {
    place: "时间线",
    text: function(){
      const arr = [];
      arr.push("【时间线】");
      arr.push("");
      arr.push(getTimeline());
      arr.push("");
      arr.push("序章长度：7-14天（取决于出身/事件/选择）");
      arr.push("学院长度：3-5年（取决于成绩/事件/是否被开除）");
      arr.push("大陆节奏：玩家自由决定，但世界事件在你慢的时候会恶化");
      arr.push("终局时机：深渊进度到100%时强制终局");
      arr.push("");
      if (S.worldClock.missedStories.length > 0) {
        arr.push("【错过的剧情】");
        for (const ms of S.worldClock.missedStories) {
          const tw = TIME_WINDOWS.find(t => t.id === ms);
          if (tw) arr.push("· " + tw.name + "：" + tw.missedConsequence);
        }
      }
      arr.push("");
      arr.push("世界不等你。有些剧情，错过了就永远错过了。");
      arr.push("你与时间线作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


N["time_pressure_abyss"] = function(){
  return {
    place: "时间压力·深渊倒计时",
    text: function(){
      const arr = [];
      arr.push("你做了一个梦。");
      arr.push("梦里，你站在死亡沙漠的中心。第七印在你面前碎裂。原初之物——色欲——从封印中走出来。");
      arr.push("它看着你，微笑。「你太慢了。」");
      arr.push("你惊醒。");
      arr.push("");
      arr.push("你看了看深渊进度——已经75%了。");
      arr.push("你还有时间。但不多了。");
      arr.push("你可以继续慢慢游历，收集线索，建立关系。但每多花一天，深渊就多靠近一步。");
      arr.push("你也可以直奔第七印，尽快结束这一切。但你准备好了吗？");
      arr.push("");
      arr.push("（深渊进度达到100%时，强制进入终局。你可以通过修复七印/理解原初之物来延缓，也可以通过破坏七印来加速。）");
      arr.push("别过深渊倒计时，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"加快速度，直奔第七印", go:"fc_jiaohui_entry", effect:{flag:"rush_to_abyss", time:5} },
      { t:"继续慢慢游历，做好准备", go:"fc_jiaohui_entry", effect:{flag:"prepare_slowly", abyssDelta:5} }
    ]
  };
};


N["time_morning_arrival"] = function(){
  initTimeV26();
  return {
    place: "清晨",
    text: function(){
      const arr = [];
      const w = WEATHER_TABLE_V26[S.time.weather];
      arr.push("雾气还没散。");
      arr.push("");
      if (S.time.weather === "clear") {
        arr.push("晨光从东边的天际线漫过来，把屋檐染成暖金色。炊烟从家家户户的烟囱里升起，混着面包和粥的香气。");
      } else if (S.time.weather === "rain") {
        arr.push("雨下了一整夜，到清晨也没停。屋檐滴水，石板路泛着冷光，行人都缩着脖子赶路。");
      } else if (S.time.weather === "snow") {
        arr.push("雪积了半尺厚。世界是白的，安静得像被捂住了嘴。呼吸成雾，每一步都咯吱作响。");
      } else if (S.time.weather === "fog") {
        arr.push("浓雾把整个城市吞了。三步之外看不见人，只能听到脚步声、车轮声、还有不知从哪传来的钟声。");
      } else {
        arr.push("新的一天开始了。");
      }
      arr.push("");
      arr.push("集市正在开张，摊主们支起棚子，摆出新鲜的货物。清晨的东西最新鲜，价格也最公道。");
      arr.push("");
      // 时间压力提示
      if (S.time.timePressure > 60) {
        arr.push("你心里有一种隐隐的不安——有些事情，正在逼近。");
      }
      // 并行事件提示
      const recentParallel = S.parallelEvents.filter(e => e.revealed && e.dayHappened >= S.time.totalDays - 1);
      if (recentParallel.length > 0) {
        arr.push("你听说——" + recentParallel[0].description);
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options: [
      { t:"开始今天的行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


N["time_noon_arrival"] = function(){
  initTimeV26();
  return {
    place: "正午",
    text: function(){
      const arr = [];
      arr.push("太阳升到了最高处。");
      arr.push("");
      if (S.time.weather === "clear" || S.time.weather === "heatwave") {
        arr.push("阳光白得刺眼，热浪从石板路上蒸腾起来。集市最热闹的时候，人声鼎沸，讨价还价声混在一起。");
      } else if (S.time.weather === "rain") {
        arr.push("雨小了些，但没停。人们挤在屋檐下躲雨，商贩卖力地吆喝，想在收摊前多卖一点。");
      } else {
        arr.push("正午是一天中最繁忙的时候。每个人都在赶路，每个人都有目的地。");
      }
      arr.push("");
      arr.push("正午的物价最高——需求最旺。但也是信息最多的时候，酒馆里坐满了人，消息在酒杯之间流转。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options: [
      { t:"继续行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


N["time_dusk_arrival"] = function(){
  initTimeV26();
  return {
    place: "黄昏",
    text: function(){
      const arr = [];
      arr.push("太阳沉下去了。");
      arr.push("");
      arr.push("影子被拉得很长，长到像另一个世界。归人匆匆，脚步比清晨快了几分——家里有热饭，或者有等待的人。");
      arr.push("");
      arr.push("集市在收摊。摊主们甩卖剩下的货物——黄昏的东西最便宜，但也最不新鲜。");
      arr.push("");
      arr.push("黄昏是秘密的时刻。白天不方便说的话，在暮色的掩护下，可以说了。白天不方便见的人，在拉长的影子里，可以见了。");
      arr.push("");
      if (S.san < 50) {
        arr.push("你觉得有些冷。不是天气的冷，是从骨头里渗出来的那种。黄昏的影子里，好像有什么东西在看你。");
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("黄昏已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"继续行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


N["time_night_arrival"] = function(){
  initTimeV26();
  return {
    place: "深夜",
    text: function(){
      const arr = [];
      arr.push("世界沉入了黑暗。");
      arr.push("");
      arr.push("灯火是唯一的温暖——也是最危险的诱惑。每一扇亮着的窗后面，都有一个故事。每一扇黑着的窗后面，可能也有。");
      arr.push("");
      arr.push("集市关了，大多数商店关了。但酒馆还亮着，黑市刚刚开张，暗蚀会在行动，守望者在巡逻，审判骑士在搜查。");
      arr.push("");
      arr.push("深夜是灵魂法师的时刻——灵魂魔法在深夜最强。深夜也是深渊的时刻——深渊进度在深夜加速。深夜是秘密的时刻——所有见不得光的事，都在这个时候发生。");
      arr.push("");
      if (S.san < 40) {
        arr.push("你听到了一些声音。不是耳朵听到的，是从脑子里冒出来的。低语，呢喃，还有一个名字——你的名字。");
        arr.push("你不确定这是幻觉，还是……别的什么。");
      } else {
        arr.push("夜很深了。你应该休息——不睡觉的话，明天会很疲惫。");
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("深夜的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"继续行动（深夜有风险）", go:"fc_jiaohui_entry", effect:{san:-2} },
      { t:"找地方休息", go:"sleep_normal", effect:{} }
    ]
  };
};


N["time_system_overview"] = function(){
  initTimeV26();
  return {
    place: "时间系统",
    text: function(){
      const arr = [];
      arr.push("【时间系统总览】");
      arr.push("");
      arr.push(getTimeStringV26());
      arr.push("");
      arr.push("时间压力：" + S.time.timePressure + "/100");
      if (S.time.timePressure < 30) arr.push("（平静——世界正常运转）");
      else if (S.time.timePressure < 60) arr.push("（紧张——物价/NPC/事件开始异变）");
      else if (S.time.timePressure < 80) arr.push("（危急——多个倒计时同时临界）");
      else arr.push("（失控——战争/深渊/天灾全面爆发）");
      arr.push("");
      arr.push("疲劳度：" + (S.fatigue ? S.fatigue.level : 0) + "/100");
      arr.push("连续未眠：" + S.time.daysSinceSleep + "天");
      arr.push("");
      arr.push("【倒计时】");
      if (S.worldTimers && S.worldTimers.length > 0) {
        for (const t of S.worldTimers) {
          if (!t.triggered) {
            const color = t.daysLeft <= 3 ? "🔴" : t.daysLeft <= 10 ? "🟡" : "⚪";
            arr.push(color + " " + t.name + "：还有" + t.daysLeft + "天");
          }
        }
      } else {
        arr.push("（暂无活跃倒计时）");
      }
      arr.push("");
      arr.push("【日记】已记录" + S.time.dailyLog.length + "天");
      arr.push("【周报】已生成" + S.time.weeklyReport.length + "份");
      arr.push("【月度回顾】已生成" + S.time.monthlyReview.length + "份");
      arr.push("");
      arr.push("时间是这个世界最公平的东西——每个人每天都只有四个时段。");
      arr.push("你怎么花它，决定了你成为什么样的人。");
      return arr;
    },
    options: [
      { t:"查看日记", go:"time_diary_view", effect:{} },
      { t:"查看日历", go:"time_calendar_view", effect:{} },
      { t:"返回", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};


N["time_diary_view"] = function(){
  initTimeV26();
  return {
    place: "日记",
    text: function(){
      const arr = [];
      arr.push("【你的日记】");
      arr.push("");
      const recent = S.time.dailyLog.slice(-7).reverse();
      if (recent.length === 0) {
        arr.push("日记本是空的。你还没有开始记录你的旅程。");
      } else {
        for (const log of recent) {
          arr.push("——第" + log.day + "天 " + TIME_PERIODS_V26[log.period].name + "——");
          if (log.actions.length > 0) {
            arr.push("做了：");
            for (const a of log.actions) arr.push("  · " + a);
          }
          if (log.events.length > 0) {
            arr.push("发生了：");
            for (const e of log.events) arr.push("  · " + e);
          }
          if (log.parallelEvents.length > 0) {
            arr.push("听说：");
            for (const p of log.parallelEvents) arr.push("  · " + p);
          }
          arr.push("");
        }
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};


N["shop_status_view"] = function(){
  initTimeV26();
  return {
    place: "商店状态",
    text: function(){
      const arr = [];
      arr.push("【当前商店状态】");
      arr.push("");
      arr.push("当前时段：" + TIME_PERIODS_V26[S.time.period].name);
      arr.push("");
      for (const id in SHOPS_V26) {
        const shop = SHOPS_V26[id];
        const isOpen = isShopOpenV26(id);
        const priceMod = shop.priceMod[S.time.period] || 0;
        const status = isOpen ? "🟢 营业中" : "🔴 已关门";
        const price = priceMod > 0 ? "（物价×" + priceMod + "）" : "";
        arr.push(status + " " + shop.name + " " + price);
        arr.push("  " + shop.desc);
        arr.push("");
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};


N["time_calendar_view"] = function(){
  initTimeV26();
  return {
    place: "日历",
    text: function(){
      const arr = [];
      arr.push("【艾尔达历】");
      arr.push("");
      arr.push("第" + S.time.year + "年 " + SEASONS_V26[S.time.season].name + " " + S.time.month + "月");
      arr.push("今天：" + S.time.day + "日 星期" + S.time.dayOfWeek);
      arr.push("");
      // 简易月历
      arr.push("日 一 二 三 四 五 六");
      let weekStart = 1;
      for (let w = 0; w < 5; w++) {
        let line = "";
        for (let d = 0; d < 7; d++) {
          const dayNum = w * 7 + d + 1 - (weekStart - 1);
          if (dayNum < 1 || dayNum > 30) {
            line += "   ";
          } else if (dayNum === S.time.day) {
            line += "[" + (dayNum < 10 ? "0" + dayNum : dayNum) + "]";
          } else {
            line += (dayNum < 10 ? " " + dayNum : dayNum) + " ";
          }
        }
        arr.push(line);
      }
      arr.push("");
      arr.push("【本月倒计时】");
      if (S.worldTimers && S.worldTimers.length > 0) {
        for (const t of S.worldTimers) {
          if (!t.triggered) {
            const phase = t.daysLeft <= 3 ? "🔴临界" : t.daysLeft <= 10 ? "🟡紧张" : "⚪平静";
            arr.push(phase + " " + t.name + "：还有" + t.daysLeft + "天");
          }
        }
      } else {
        arr.push("（暂无）");
      }
      arr.push("");
      arr.push("【本周趋势】");
      if (S.time.weeklyReport.length > 0) {
        const latest = S.time.weeklyReport[S.time.weeklyReport.length - 1];
        arr.push("物价：" + latest.trends.prices + " / 治安：" + latest.trends.security);
      } else {
        arr.push("（第一周还没结束）");
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};


