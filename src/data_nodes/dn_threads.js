/* /pn1inj:threads:dn_threads.js/ P-N1 并行叙事线程注册表（纯数据；引擎只读 window.THREADS）
 * —— 学习 inkle/ink 的 threads 模式：多条叙事线并行推进，各自记住进度；
 *    引擎钩子 v92_threadTick 在 writeNext 渲染时按节点 id 前缀自动登记到 S.threads
 *    （{pos 最近节点, updatedDay 最近活跃日, seen 已读节点数}），玩家可随时回看各线状态。
 * 新增线程 = 本表加一条 {id,name,desc,prefix[],entry}，零引擎改动。
 * entry 为"该线起点"参考（须为真实节点 id；无则 null）。
 */
const THREADS = {
  origin:  {name:"序章 · 自由城", desc:"出生地与自由城汇流，一切的开端。", prefix:["origin_","fc_","prologue_"], entry:"fc_jiaohui_entry"},
  academy: {name:"学院线", desc:"五学年求学、同窗情谊与毕业四去向。", prefix:["acad_","alumni_","grad_","branch_academy_"], entry:"branch_academy_join"},
  dark:    {name:"禁书区暗线", desc:"费尔曼教授、灰楼夜火与金库失窃的层层暗流。", prefix:["acad_story_","acad_secret_"], entry:"acad_story_vault"},
  frontier:{name:"北境要塞线", desc:"第三哨铜钟、钥匙寻踪与七锚之约的第一环。", prefix:["frontier_","anchor_","grad_army_"], entry:"frontier_entry"},
  war:     {name:"战争阵营线", desc:"七阶段战争与八势力阵营的抉择与背叛。", prefix:["warphase_","faction_","warfront_","war_after_","war_epilogue_"], entry:"warphase_1"},
  east:    {name:"东境 · 晨天线", desc:"承天城、科举特科与晨天故都的旧日阴影。", prefix:["east_","chen_","court_","messenger_"], entry:"east_gov"}
};
if (typeof window !== 'undefined') { window.THREADS = THREADS; }
