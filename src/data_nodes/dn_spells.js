/* /u1inj:data-nodes:dn_spells.js/ UPG-16 西幻法术体系（数据驱动）
 * MAGIC_SPELLS：四系法术配方表（元素/神圣/深渊/秘术）。
 * 每条 {id, school, name, manaCost, comps[], chant, effect}——纯展示+内容数据；
 * 施法选项由对应法术节点承载（check/effects 走既有引擎），面板只读展示。
 * 不触碰判定公式；法力以 S.mp 展示（战斗系统既有字段）。
 */
const MAGIC_SPELLS = [
  // 元素系
  { id: "sp_ember", school: "元素", name: "烬火", manaCost: 8, comps: ["硫磺粉", "火绒"], chant: "以火之名，烬而生焰。", effect: "投出一团灼热烬火，点燃目标。" },
  { id: "sp_gale", school: "元素", name: "烈风刃", manaCost: 10, comps: ["风羽", "银针"], chant: "风聚于刃，割裂长空。", effect: "凝聚风刃横扫，切割范围内敌人。" },
  { id: "sp_tide", school: "元素", name: "潮汐环", manaCost: 12, comps: ["海盐", "蓝晶"], chant: "潮起潮落，环守吾身。", effect: "召唤水环护体，化解近身冲击。" },
  // 神圣系
  { id: "sp_hallow", school: "神圣", name: "圣辉", manaCost: 9, comps: ["圣水", "银符"], chant: "光辉所至，暗影退散。", effect: "圣光绽放，驱散诅咒与亡者之力。" },
  { id: "sp_mend", school: "神圣", name: "愈伤", manaCost: 11, comps: ["草药", "圣灰"], chant: "以圣之名，血肉归位。", effect: "金色光芒渗入伤口，加速愈合。" },
  { id: "sp_judge", school: "神圣", name: "审判之矛", manaCost: 15, comps: ["圣徽", "银矛"], chant: "罪与罚，皆在圣裁之下。", effect: "掷出光矛，对不洁之物造成重创。" },
  // 深渊系
  { id: "sp_whisper", school: "深渊", name: "低语", manaCost: 7, comps: ["黑曜石", "暗血"], chant: "深渊低语，心念成影。", effect: "以低语扰乱心神，令敌迟疑。" },
  { id: "sp_fissure", school: "深渊", name: "裂隙", manaCost: 16, comps: ["裂晶", "骨灰"], chant: "大地裂开，渊气上涌。", effect: "撕开地表裂隙，涌出蚀骨渊气。" },
  { id: "sp_voidgaze", school: "深渊", name: "虚空凝视", manaCost: 13, comps: ["镜片", "暗纹"], chant: "凝视虚空者，终被虚空凝视。", effect: "以虚空之眼压制目标的意志。" },
  // 秘术系
  { id: "sp_ward", school: "秘术", name: "守护刻印", manaCost: 9, comps: ["秘银粉", "符文纸"], chant: "刻印为界，外邪莫入。", effect: "在地面刻下守护符文，抵御法术。" },
  { id: "sp_foresight", school: "秘术", name: "预见", manaCost: 12, comps: ["星尘", "水银"], chant: "因果微动，未来显影。", effect: "短暂窥见数息之后的轨迹。" },
  { id: "sp_anchorbind", school: "秘术", name: "锚定", manaCost: 14, comps: ["铁牌残片", "蓝绳"], chant: "以锚为凭，锁住此身。", effect: "将目标固定在原地，难以移动。" }
];
if (typeof window !== 'undefined') { window.MAGIC_SPELLS = MAGIC_SPELLS; }
