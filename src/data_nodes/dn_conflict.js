/* N-7 冲突事件层（v93n12_conflictPool：独立注入层，不碰 EVENT_POOL_EXT）
 * 事件按 day 区间 + 可选条件触发一次（S.flags[id] 防重），结算轻量 effects 后返回文本。
 * {id, dayFrom, dayTo, cond:{flag}, effects:{gold|hp|flag}, text}
 */
window.CONFLICT_POOL = [
  {id:"cf_brawl_1", dayFrom:20, dayTo:60, effects:{gold:-15,hp:-8},
   text:"夜里你在酒馆被一伙醉汉堵住。起因不重要——你打翻的那杯酒是某个佣兵团的信物。你挨了两拳，也还了两拳，最后双方都带着伤、各赔了半个银月的酒钱散了。"},
  {id:"cf_brawl_2", dayFrom:80, dayTo:120, effects:{gold:-30,hp:-12},
   text:"商路上有人设了套：说是护镖，实则是让你引开巡逻队。你发现时刀已经架在脖子上。你交了钱袋，留下了两颗牙——教训比钱贵。"},
  {id:"cf_fire_1", dayFrom:130, dayTo:170, cond:{flag:"academy_y2"}, effects:{gold:-20},
   text:"学院旧仓库半夜起火。你帮忙搬书到天亮，指尖全是烫伤。第二天院长宣布，救出一册禁书的，免一年学费——你救的是账册，火光照得人分不清。"},
  {id:"cf_plague_1", dayFrom:180, dayTo:220, cond:{flag:"academy_y3"}, effects:{gold:-25,hp:-5},
   text:"北境入冬后闹了一场寒症。药价翻了三倍，你把自己的药分给了隔壁床，自己靠硬扛过了七天。第七天夜里你烧得看见天花板在转。"},
  {id:"cf_sand_1", dayFrom:210, dayTo:250, cond:{flag:"desert_visited"}, effects:{gold:-40},
   text:"沙漠里那场沙暴来得没有预兆。驼队丢了半数的水囊，你把自己的那份让给了一个孩子。夜里渴得睡不着，听见风声里有人念经。"},
  {id:"cf_purge_1", dayFrom:55, dayTo:75, effects:{gold:-50},
   text:"净化令的风声传到自由城，教会的人进城查异端。你因为夜里在广场看星星，被盘问了半个时辰。出来时，巡逻队看你的眼神都带着钩子。"},
  {id:"cf_army_1", dayFrom:140, dayTo:180, cond:{flag:"frontier_visited"}, effects:{gold:-35,hp:-15},
   text:"第三哨的雪夜，哨兵失踪的传闻让军营人心浮动。你跟着巡逻队搜了一夜山，回来时靴子冻成了冰坨。队长塞给你半壶酒：“压压惊，也压压嘴。”"},
  {id:"cf_grave_1", dayFrom:160, dayTo:200, cond:{flag:"goldscale_touched"}, effects:{gold:-10},
   text:"墓园无字碑前有人夜祭。你撞见了，对方没说话，放下一枚铜子就走了。你低头看，铜子压在碑缝里，正面刻着一杆秤。你把铜子捡起来，又放了回去。"},
  {id:"cf_market_1", dayFrom:100, dayTo:130, effects:{gold:25},
   text:"银穗商路断货，南边的盐价翻番。你手里恰好有一批存货，转手赚了一笔。赚完你数了两遍——这钱烫手，可烫手也挡不住人用。"},
  {id:"cf_dwarf_1", dayFrom:190, dayTo:230, cond:{flag:"dwarf_visited"}, effects:{gold:-20},
   text:"矮人山国的集市上，有人拿假银月骗了你的钱。你追了两条街，把那人堵在巷子里。他赔了钱，还赔了一句实话：这假货，出自北境一个造币炉。"},
  {id:"cf_elf_1", dayFrom:170, dayTo:210, cond:{flag:"elf_visited"}, effects:{gold:-15,hp:-6},
   text:"迷雾森林的雾比传闻中更不讲理。你在林子里迷了两天，靠啃树皮出来。精灵巡林者在出口等你，递给你一块干饼：“雾认生，下次带个向导。”"},
  {id:"cf_orc_1", dayFrom:260, dayTo:300, cond:{flag:"orc_visited"}, effects:{gold:-30,hp:-18},
   text:"草原的狼旗南移那天，你在集市上撞见兽人斥候。双方都按着刀，最后谁也没动。你退了一步，他也退了一步——草原的规矩，不断人水源，也不先动手。"},
  {id:"cf_temple_1", dayFrom:230, dayTo:270, cond:{flag:"church_visited"}, effects:{gold:-40},
   text:"圣城的审判庭开庭那天，你被挤在人堆里看了一场异端审判。被审的是个老修士，罪名是藏了本旧历书。他在台上没辩白，只说自己年纪大了，记性好。"},
  {id:"cf_winter_1", dayFrom:280, dayTo:320, effects:{gold:-20,hp:-10},
   text:"这一年的冬天格外长。柴火、口粮、药品，样样都在涨价。你在客栈灶台边睡了一夜，第二天早上，老板娘往你碗里多舀了一勺粥，什么也没说。"}
];
