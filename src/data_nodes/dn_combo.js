/* N-7 天赋连锁隐藏线（五维组合 → 隐藏 flag；纯置位，不参与判定）
 * v93n7_comboCheck 建号后遍历匹配，命中置 S.comboFlags[id]=true（applyDefaults 兜底）。
 * combo 键：job / ideal / hobby / talent / subrace（≥3 键命中即触发）。
 */
window.COMBO_TRAITS = [
  {id:"c_merchant_hunter", title:"猎商双修", combo:{job:"merchant",hobby:"hunt",talent:"good"},
   desc:"既是账房里的算盘，又是林间的猎弓。两种身份在你身上打架，也让你比谁都明白：猎物和货款一样，都讲究时机。"},
  {id:"c_guard_healer", title:"守护士", combo:{ideal:"guard",hobby:"herb",talent:"good"},
   desc:"你救人，也守人。药篓和盾牌放在一起，从不觉得矛盾。"},
  {id:"c_revenge_forge", title:"复仇铁匠", combo:{ideal:"revenge",hobby:"forge",subrace:"nordic"},
   desc:"北境的铁匠铺里挂着你的仇人名单。你把仇恨打进了刀里，刀越磨越亮，名字越记越深。"},
  {id:"c_truth_wanderer", title:"求真的浪人", combo:{ideal:"truth",hobby:"read",subrace:"midland"},
   desc:"中境的读书人，总想知道墙后面是什么。你带着书上路，也带着问题。"},
  {id:"c_god_choir", title:"神眷歌者", combo:{ideal:"god",hobby:"music",talent:"gen"},
   desc:"你的歌声里有圣光。教会的修士说，这是天赋；你更愿意相信，是某位存在先听见了你。"},
  {id:"c_fame_gambler", title:"赌徒的桂冠", combo:{ideal:"fame",hobby:"gamble",subrace:"southland"},
   desc:"南境人信命，更信运气。你把每一次冒险都当作下注，赢了，就离名满天下近一步。"},
  {id:"c_free_climber", title:"自由的攀岩者", combo:{ideal:"free",hobby:"climb",subrace:"plateau"},
   desc:"高原的风把你吹大，你从不往下看。自由对你来说，就是永远有更高处可以爬。"},
  {id:"c_might_fisher", title:"沉默的力士", combo:{ideal:"might",hobby:"fish",talent:"prod"},
   desc:"你力气大，话少。钓鱼教会你耐心，也教会你：真正的力量，从不急着显摆。"},
  {id:"c_wealth_chess", title:"算尽人心", combo:{ideal:"wealth",hobby:"chess",subrace:"eastland"},
   desc:"东境的棋盘上有九条路，你每一步都算到三步之后。富甲天下，不过是把棋盘下得再大些。"},
  {id:"c_elf_herb_muse", title:"林语药者", combo:{subrace:"islander",hobby:"herb",talent:"gen"},
   desc:"岛上的草药在你手里会说话。你知道哪片叶子治伤，哪片叶子伤人，也知道哪片叶子，能让人说真话。"}
];
