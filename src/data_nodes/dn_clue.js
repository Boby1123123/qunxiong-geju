/* ===== /v93n3:clue/ N-3 贯穿线索账（纯数据；图鉴"线索"页 + 结局回响共用） =====
 * CLUE_TRACKS：三条贯穿大陆的线索；probes 为关键 flag（命中越多线索进度越高）
 * ENDING_ECHO：结局节点渲染时，按玩家最近抉择回引 1-2 句（只读注入）
 */
window.CLUE_TRACKS = [
  {
    id:"clue_book", name:"旧书的下落", icon:"书",
    desc:"有人在找一本旧书，出的价够买一条街。从自由城的酒馆到学院的禁书区，这本书的影子一直贴着你的后背走。",
    probes:[
      {flag:"acad_life_y3_course", txt:"你选修过费尔曼的《古代封印史》"},
      {flag:"acad_ferman_pact", txt:"你答应过费尔曼，那张图纸将来用得着"},
      {flag:"acad_thesis_accepted", txt:"你接过笔，写下了那篇论文"},
      {flag:"acad_life_y4_course", txt:"你选了毕业论文的封印专题"}
    ]
  },
  {
    id:"clue_eye", name:"深渊之眼", icon:"眼",
    desc:"第七节点是深渊留在这片大陆上的一只眼睛，眼皮已经掀开。谁想封住它，谁想唤醒它，还有谁想把它挖出来——学院里的每一扇门后都站着一种答案。",
    probes:[
      {flag:"acad_ferman_pact", txt:"你成了那个“会闭嘴的人”"},
      {flag:"acad_life_y4_mid", txt:"那一夜，禁书区的灯亮到天明"},
      {flag:"led_anchor_01", txt:"你拿起了第一枚锚"},
      {flag:"led_anchor_07", txt:"七锚在你掌心汇齐"}
    ]
  },
  {
    id:"clue_goldscale", name:"金秤与晨天", icon:"秤",
    desc:"守门人世家、故都地下的档案、墓园里三代人的守望。金秤这两个字，从老人的口中传到你的耳朵里，越来越重。",
    probes:[
      {flag:"goldscale_know", txt:"你知道了金秤的来历"},
      {flag:"goldscale_final", txt:"你站在了使命的抉择前"},
      {flag:"led_b5_07", txt:"你赴了秦策之约"},
      {flag:"led_anchor_03", txt:"你在无字碑前停过脚"}
    ]
  }
];

/* 结局回响映射：S.choices 尾部命中前缀则注入回顾句 */
window.ENDING_ECHO = [
  {pre:"acad_", txt:"你想起学院里那几年：走廊尽头的门、禁书区的灯、费尔曼在窗边写字的背影。如今灯都熄了，路是你自己走完的。"},
  {pre:"frontier_", txt:"你想起第三哨的雪，老铁失踪那夜留在地上的脚印，还有铜钟在风里震出来的嗡鸣。"},
  {pre:"anchor_", txt:"你想起七枚锚先后在掌心发烫的温度。最后那一枚落定的时候，整片大陆的地脉跟着颤了一下。"},
  {pre:"grad_", txt:"你想起毕业那天，四面的路在脚下摊开。你选了现在这条，走了这么远，回头还能看见当初那个站在路口的人。"},
  {pre:"faction_", txt:"你想起自己站进那面旗帜下的那一天。旗子换了颜色，可你扛过的每一仗，都还压在这双肩上。"},
  {pre:"warphase_", txt:"你想起战争从摩擦到围城、从围城到终战的每一步。地图上的红圈越来越多，最后盖住了整块大陆。"},
  {pre:"fc_", txt:"你想起自由城那间酒馆的麦酒味，蜜尔娜擦杯子的姿势，还有你在那张桌子前做过的最初的决定。"},
  {pre:"origin_", txt:"你想起离开故乡那天的天气。那时的你还不知道，这条路会把你带到今天这个位置。"}
];
