/* ═══════════════════════════════════════════════════
   CONFIG & DATA — v2.6
   All constants, default data, presets, and static assets
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};

Yuki.CONFIG = {
  MAX_SNOW: 80,
  MAX_TRAIL: 28,
  TOAST_DURATION: 3500,
  TYPEWRITER_SPEED: 35,
  DIALOG_HISTORY_LIMIT: 20,
  DB_NAME: 'yuki-no-kiseki-db',
  DB_VERSION: 3,
  VERSION: '2.6'
};

/* ── CG Data ── */
Yuki.CG_DATA = [
  { id:1,char:'yukina',title:'车站的初遇',chapter:'第一章',unlocked:true },
  { id:2,char:'yukina',title:'雪夜的约定',chapter:'第二章',unlocked:true },
  { id:3,char:'yukina',title:'图书馆的午后',chapter:'第三章',unlocked:true },
  { id:4,char:'yukina',title:'眼泪的温度',chapter:'第五章',unlocked:false },
  { id:5,char:'yukina',title:'告白',chapter:'第七章',unlocked:false },
  { id:6,char:'yukina',title:'最后的雪',chapter:'终章',unlocked:false },
  { id:7,char:'kanade',title:'屋顶上的旋律',chapter:'第二章',unlocked:true },
  { id:8,char:'kanade',title:'Live House 之夜',chapter:'第三章',unlocked:true },
  { id:9,char:'kanade',title:'夏天的回忆',chapter:'第四章',unlocked:false },
  { id:10,char:'kanade',title:'未寄出的信',chapter:'第六章',unlocked:false },
  { id:11,char:'kanade',title:'舞台上的她',chapter:'第七章',unlocked:false },
  { id:12,char:'rei',title:'天文台的侧脸',chapter:'第三章',unlocked:true },
  { id:13,char:'rei',title:'深夜的讯息',chapter:'第四章',unlocked:true },
  { id:14,char:'rei',title:'过去的碎片',chapter:'第五章',unlocked:false },
  { id:15,char:'rei',title:'没有星星的夜晚',chapter:'第六章',unlocked:false },
  { id:16,char:'other',title:'三人合照',chapter:'第四章',unlocked:true },
  { id:17,char:'other',title:'学园祭',chapter:'第四章',unlocked:false },
  { id:18,char:'other',title:'毕业日',chapter:'终章',unlocked:false },
  { id:19,char:'yukina',title:'清晨的咖啡',chapter:'第四章',unlocked:false },
  { id:20,char:'kanade',title:'雨中的吉他',chapter:'第五章',unlocked:false },
  { id:21,char:'rei',title:'月下的对话',chapter:'第六章',unlocked:false },
  { id:22,char:'other',title:'海边远足',chapter:'特别篇',unlocked:false },
  { id:23,char:'yukina',title:'樱花树下',chapter:'特别篇',unlocked:false },
  { id:24,char:'kanade',title:'录音室',chapter:'特别篇',unlocked:false },
];

/* ── Inventory Data ── */
Yuki.INV_DATA = [
  { id:1,name:'手工曲奇',category:'consumable',rarity:'common',qty:3,desc:'雪菜亲手烤制的曲奇饼干，带着淡淡的奶香。',effect:'回复少量体力' },
  { id:2,name:'热可可',category:'consumable',rarity:'common',qty:5,desc:'车站前自动贩卖机的热可可。',effect:'回复体力，略微提升心情' },
  { id:3,name:'文学部钥匙',category:'key',rarity:'rare',qty:1,desc:'雪菜交给你的活动室钥匙。',effect:'可进入文学部活动室' },
  { id:4,name:'旧吉他拨片',category:'key',rarity:'rare',qty:1,desc:'奏送的拨片，边缘有些磨损。',effect:'剧情关键物品' },
  { id:5,name:'星象仪门票',category:'key',rarity:'epic',qty:1,desc:'天文馆特别展览门票。',effect:'触发特殊剧情' },
  { id:6,name:'诗集《冬之痕》',category:'gift',rarity:'rare',qty:1,desc:'装帧精美的现代诗集。',effect:'赠送给雪菜可大幅提升好感度' },
  { id:7,name:'限定款拨片套装',category:'gift',rarity:'epic',qty:1,desc:'乐器店限定的手工拨片。',effect:'赠送给奏可大幅提升好感度' },
  { id:8,name:'星空投影灯',category:'gift',rarity:'epic',qty:1,desc:'能投射出真实星空的投影灯。',effect:'赠送给零可大幅提升好感度' },
  { id:9,name:'便当盒',category:'consumable',rarity:'common',qty:2,desc:'普通的便当盒。',effect:'回复体力' },
  { id:10,name:'围巾',category:'key',rarity:'common',qty:1,desc:'深蓝色羊毛围巾。',effect:'御寒（装饰品）' },
  { id:11,name:'音乐会邀请函',category:'key',rarity:'legendary',qty:1,desc:'奏亲手写的邀请函。',effect:'触发重要剧情分支' },
  { id:12,name:'手织手套',category:'gift',rarity:'rare',qty:1,desc:'手工编织的毛线手套。',effect:'赠送提升好感度' },
];

/* ── Save Slots ── */
Yuki.SAVE_SLOTS = [
  { id:1,filled:true,date:'2026-12-24',time:'17:05',chapter:'第一章 · 雪之始',playtime:'0:32' },
  { id:2,filled:true,date:'2026-12-24',time:'17:18',chapter:'第一章 · 车站的初遇',playtime:'0:45' },
  { id:3,filled:true,date:'2026-12-24',time:'17:28',chapter:'第一章 · 雪菜的请求',playtime:'0:58' },
  { id:4,filled:false },{ id:5,filled:false },{ id:6,filled:false },
  { id:7,filled:true,date:'2026-12-25',time:'09:12',chapter:'第二章 · 新的清晨',playtime:'1:22' },
  { id:8,filled:false },{ id:9,filled:false },{ id:10,filled:false },{ id:11,filled:false },{ id:12,filled:false },
];

/* ── Dialog Script ── */
Yuki.DIALOG_SCRIPT = [
  { speaker:'雪菜', text:'车站前的灯光，在暮色中晕开一圈圈暖色。雪花静静地落下，落在她微微颤抖的肩膀上。已经等了多久了呢——我想。' },
  { speaker:'悠', text:'「抱歉，等很久了吗？」' },
  { speaker:'雪菜', text:'她转过头来，睫毛上沾着细碎的雪花。然后，轻轻地摇了摇头。' },
  { speaker:'雪菜', text:'「……没有。刚到而已。」声音像落在水面上的雪，安静得几乎听不见。' },
  { speaker:'悠', text:'说谎。围巾上积了薄薄一层雪。但不知为何，我并没有点破。或许是因为——她那样说着「刚到而已」的表情，太过温柔了。' },
  { speaker:'雪菜', text:'「今天……谢谢你愿意来。」她垂下目光，手指绞着围巾的流苏。「我知道你很忙。但是……今天是……」' },
  { speaker:'悠', text:'「圣诞夜，对吧。」我接过话。「怎么可能忘记。」' },
  { speaker:'雪菜', text:'她抬起头，眼中映着车站暖黄的灯光。然后，笑了——那是这个冬天里，我见过的最温柔的笑容。' },
];

/* ── History Data ── */
Yuki.HISTORY_DATA = [
  { speaker:'悠', text:'脚步不自觉地放慢了。车站前的广场上，圣诞树已经亮起了灯。' },
  { speaker:'雪菜', text:'「啊……」她忽然停下脚步，仰头望着树顶的星星装饰。「好漂亮。」' },
  { speaker:'悠', text:'我顺着她的目光看去。确实很漂亮——但不是因为灯，而是因为她映着灯光的侧脸。' },
  { speaker:'雪菜', text:'「小时候，每年圣诞都会和家里人一起来这里。」她的声音很轻，像是在对自己说。' },
  { speaker:'悠', text:'「现在呢？」' },
  { speaker:'雪菜', text:'「现在啊……」她转过头，看着我，眼睛里带着一种难以形容的情绪。「现在觉得，有些东西比树更高。」' },
  { speaker:'悠', text:'想问的——你指的是什么。但有些问题的答案，也许不知道比较好。' },
];

/* ═══════════════════════════════════════════════════
   PRESETS — Tavern-compatible preset system
   ═══════════════════════════════════════════════════ */

Yuki.ST = Yuki.ST || {};

/** Default tavern-style format template with macro placeholders */
Yuki.ST.DEFAULT_FORMAT_TEMPLATE = [
  '[System Prompt]',
  '{{system_prompt}}',
  '',
  '[角色卡]',
  '{{char_card}}',
  '',
  '[用户信息]',
  '当前扮演：{{user}}',
  '',
  '[游戏状态]',
  '{{variables}}',
  '',
  '[当前穿搭]',
  '{{wardrobe}}',
  '',
  '[参考信息 · 角色前]',
  '{{lorebook_before}}',
  '',
  '[格式要求]',
  '请严格按照以下XML标签输出回复：',
  '<thinking>思考过程（可选）</thinking>',
  '<maintext>剧情正文</maintext>',
  '<option>选项A',
  '选项B</option>',
  '<sum>简短总结</sum>',
  '<vars>{"变量名":新值}</vars>',
  '',
  '[参考信息 · 角色后]',
  '{{lorebook_after}}',
  '',
  '[Author\'s Note]',
  '{{author_note}}'
].join('\n');

/** Default presets — SillyTavern-compatible parameter naming */
Yuki.ST.DEFAULT_PRESETS = [
  {
    id: 'preset-narrative',
    name: '默认叙事',
    description: '均衡的叙事参数，适合大多数剧情场景',
    systemPrompt: '你是一个专业的视觉小说叙述引擎。请以优美的文学笔触推进剧情，注重人物心理描写和环境氛围渲染。',
    formatTemplate: Yuki.ST.DEFAULT_FORMAT_TEMPLATE,
    authorNote: '',
    params: {
      temperature: 0.8,
      max_tokens: 1024,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'preset-literary',
    name: '文学风格',
    description: '低温参数，输出更细腻、富有诗意的文学语言',
    systemPrompt: '你是一个文学向视觉小说的叙述者。请使用细腻、富有诗意的笔触，注重文字的韵律感和意象营造。多用比喻、拟人等修辞手法。',
    formatTemplate: Yuki.ST.DEFAULT_FORMAT_TEMPLATE,
    authorNote: '请使用更具文学色彩的叙述方式，适当融入内心独白和环境描写。',
    params: {
      temperature: 0.55,
      max_tokens: 1536,
      top_p: 0.88,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: true
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'preset-fast',
    name: '快速模式',
    description: '高温度参数，输出简洁、更快节奏的叙述',
    systemPrompt: '你是一个快节奏视觉小说的叙述引擎。请以简洁明快的语言推进剧情，减少冗长描写，更注重对话和动作。',
    formatTemplate: Yuki.ST.DEFAULT_FORMAT_TEMPLATE,
    authorNote: '请保持简洁，每段正文不超过3行。减少环境描写，增加对话比例。',
    params: {
      temperature: 1.0,
      max_tokens: 768,
      top_p: 0.98,
      frequency_penalty: 0.05,
      presence_penalty: 0.05,
      stream: true
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

/** Runtime state — initialized in sillytavern-core.js */
Yuki.ST.presets = JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_PRESETS));
Yuki.ST.activePresetId = 'preset-narrative';

/* ═══════════════════════════════════════════════════
   VARIABLE SYSTEM — v2.4
   Reactive DOM bindings for game variables
   ═══════════════════════════════════════════════════ */

/**
 * Variable → DOM binding table.
 * Each entry maps a variable key to one or more DOM update actions.
 *
 * Field types:
 *   el      — element ID to set textContent
 *   html    — element ID to set innerHTML (for time with colon)
 *   style   — { el: element ID, prop: CSS property, suffix: value suffix }
 *   custom  — function(variables) called to handle complex updates
 */
Yuki.ST.VAR_BINDINGS = {
  /* ── HUD display ── */
  chapter: [
    { el: 'chapter-indicator' }
  ],
  location: [
    { custom: function(vars) {
      var el = document.getElementById('location-text');
      if (el) el.textContent = (vars.location||'') + ' · ' + (vars.time||'');
    }}
  ],
  time: [
    { custom: function(vars) {
      var el = document.getElementById('location-text');
      if (el) el.textContent = (vars.location||'') + ' · ' + (vars.time||'');
    }}
  ],
  weather: [
    { el: 'weather-text' },
    { custom: function(vars) {
      var el = document.getElementById('location-text');
      if (el) el.textContent = (vars.location||'') + ' · ' + (vars.time||'');
    }}
  ],
  /* ── Currency ── */
  player_gold: [
    { el: 'gold-amount', format: function(v) { return Number(v).toLocaleString(); } }
  ],
  player_gems: [
    { el: 'gem-amount', format: function(v) { return String(v); } }
  ],
  /* ── Character base info ── */
  yukina_age: [
    { sel: { el: 'char-slide-yukina', sel: '.var-age-val' } }
  ],
  kanade_age: [
    { sel: { el: 'char-slide-kanade', sel: '.var-age-val' } }
  ],
  rei_age: [
    { sel: { el: 'char-slide-rei', sel: '.var-age-val' } }
  ],
  /* ── Player → Character affections ── */
  yukina_affection: [
    { style: { el: 'char-slide-yukina', sel: '.affection-bar-fill.heart', prop: 'width', suffix: '%' } },
    { sel: { el: 'char-slide-yukina', sel: '.affection-value' }, format: function(v) { return v + '%'; } }
  ],
  kanade_affection: [
    { style: { el: 'char-slide-kanade', sel: '.affection-bar-fill.heart', prop: 'width', suffix: '%' } },
    { sel: { el: 'char-slide-kanade', sel: '.affection-value' }, format: function(v) { return v + '%'; } }
  ],
  rei_affection: [
    { style: { el: 'char-slide-rei', sel: '.affection-bar-fill.heart', prop: 'width', suffix: '%' } },
    { sel: { el: 'char-slide-rei', sel: '.affection-value' }, format: function(v) { return v + '%'; } }
  ],
  /* ── Inter-character affections ── */
  yukina_to_kanade: [
    { sel: { el: 'char-slide-yukina', sel: '.var-aff-kanade' }, format: function(v) { return v + '%'; } }
  ],
  yukina_to_rei: [
    { sel: { el: 'char-slide-yukina', sel: '.var-aff-rei' }, format: function(v) { return v + '%'; } }
  ],
  kanade_to_yukina: [
    { sel: { el: 'char-slide-kanade', sel: '.var-aff-yukina' }, format: function(v) { return v + '%'; } }
  ],
  kanade_to_rei: [
    { sel: { el: 'char-slide-kanade', sel: '.var-aff-rei' }, format: function(v) { return v + '%'; } }
  ],
  rei_to_yukina: [
    { sel: { el: 'char-slide-rei', sel: '.var-aff-yukina' }, format: function(v) { return v + '%'; } }
  ],
  rei_to_kanade: [
    { sel: { el: 'char-slide-rei', sel: '.var-aff-kanade' }, format: function(v) { return v + '%'; } }
  ],
  /* ── Character thoughts ── */
  yukina_thought: [
    { sel: { el: 'char-slide-yukina', sel: '.char-thought-text' } }
  ],
  kanade_thought: [
    { sel: { el: 'char-slide-kanade', sel: '.char-thought-text' } }
  ],
  rei_thought: [
    { sel: { el: 'char-slide-rei', sel: '.char-thought-text' } }
  ],
  /* ── Wardrobe: refresh entire slider when wardrobe object changes ── */
  yukina_wardrobe: [
    { custom: function() { if (Yuki.Features && Yuki.Features.wardrobe) Yuki.Features.wardrobe.renderFromVars('yukina'); } }
  ],
  kanade_wardrobe: [
    { custom: function() { if (Yuki.Features && Yuki.Features.wardrobe) Yuki.Features.wardrobe.renderFromVars('kanade'); } }
  ],
  rei_wardrobe: [
    { custom: function() { if (Yuki.Features && Yuki.Features.wardrobe) Yuki.Features.wardrobe.renderFromVars('rei'); } }
  ]
};

/** Core variables that cannot be deleted from the UI */
Yuki.ST.PROTECTED_VARS = [
  'chapter','location','time','weather',
  'yukina_affection','kanade_affection','rei_affection',
  'yukina_age','kanade_age','rei_age',
  'yukina_wardrobe','kanade_wardrobe','rei_wardrobe',
  'player_gold','player_gems'
];

/** Variable metadata — category, type, description for UI display */
Yuki.ST.VAR_META = {
  /* Display */
  chapter:            { cat: 'display',   type: 'string', desc: '当前章节' },
  location:           { cat: 'display',   type: 'string', desc: '当前地点' },
  time:               { cat: 'display',   type: 'string', desc: '游戏内时间（清晨/上午/午后/傍晚/深夜）' },
  weather:            { cat: 'display',   type: 'string', desc: '当前天气（雪/晴/阴/雨）' },
  /* Currency */
  player_gold:        { cat: 'currency',  type: 'number', desc: '金币' },
  player_gems:        { cat: 'currency',  type: 'number', desc: '宝石' },
  /* Character ages */
  yukina_age:         { cat: 'char',      type: 'number', desc: '雪菜年龄' },
  kanade_age:         { cat: 'char',      type: 'number', desc: '奏年龄' },
  rei_age:            { cat: 'char',      type: 'number', desc: '零年龄' },
  /* Player→Character affections */
  yukina_affection:   { cat: 'affection', type: 'number', desc: '雪菜对悠的好感度 (0-100)' },
  kanade_affection:   { cat: 'affection', type: 'number', desc: '奏对悠的好感度 (0-100)' },
  rei_affection:      { cat: 'affection', type: 'number', desc: '零对悠的好感度 (0-100)' },
  /* Inter-character affections */
  yukina_to_kanade:   { cat: 'affection', type: 'number', desc: '雪菜→奏 (0-100)' },
  yukina_to_rei:      { cat: 'affection', type: 'number', desc: '雪菜→零 (0-100)' },
  kanade_to_yukina:   { cat: 'affection', type: 'number', desc: '奏→雪菜 (0-100)' },
  kanade_to_rei:      { cat: 'affection', type: 'number', desc: '奏→零 (0-100)' },
  rei_to_yukina:      { cat: 'affection', type: 'number', desc: '零→雪菜 (0-100)' },
  rei_to_kanade:      { cat: 'affection', type: 'number', desc: '零→奏 (0-100)' },
  /* Character thoughts */
  yukina_thought:     { cat: 'char',      type: 'string', desc: '雪菜此刻的内心想法' },
  kanade_thought:     { cat: 'char',      type: 'string', desc: '奏此刻的内心想法' },
  rei_thought:        { cat: 'char',      type: 'string', desc: '零此刻的内心想法' },
  /* Wardrobe objects */
  yukina_wardrobe:    { cat: 'state',     type: 'object', desc: '雪菜当前穿搭（8部位）' },
  kanade_wardrobe:    { cat: 'state',     type: 'object', desc: '奏当前穿搭（8部位）' },
  rei_wardrobe:       { cat: 'state',     type: 'object', desc: '零当前穿搭（8部位）' },
  /* Game state */
  flags:              { cat: 'state',     type: 'object', desc: '剧情标记旗标（如 {"met_rei":true}）' }
};

/* ── Default Wardrobe (synced to variables) ── */
Yuki.ST.DEFAULT_WARDROBE = {
  yukina: {
    衣装:'冬の白コート', 下装:'紺色プリーツスカート', 脚部:'白いレースアップブーツ',
    手部:'手編みのミトン', 头部:'赤いベレー帽', 发型:'ロングストレート',
    首饰:'雪の結晶ネックレス', 戒指:'—'
  },
  kanade: {
    衣装:'レザージャケット', 下装:'ダメージデニム', 脚部:'ハイカットスニーカー',
    手部:'リストバンド', 头部:'—', 发型:'ショートボブ',
    首饰:'クロスのピアス', 戒指:'サムリング'
  },
  rei: {
    衣装:'天体観測コート', 下装:'スラックス', 脚部:'静音シューズ',
    手部:'天体観測用手袋', 头部:'—', 发型:'ロングストレート',
    首饰:'星のブローチ', 戒指:'—'
  }
};

/* ── Macros reference (for UI help) ── */
Yuki.ST.SUPPORTED_MACROS = [
  { name: '{{char}}',         desc: '当前AI角色名' },
  { name: '{{user}}',         desc: '玩家用户名' },
  { name: '{{char_card}}',    desc: '角色完整卡片（描述+性格+场景+开场白+例句）' },
  { name: '{{system_prompt}}',desc: '当前预设的系统提示词' },
  { name: '{{variables}}',    desc: '所有游戏变量（含好感/衣柜/想法/货币/时间地点）' },
  { name: '{{wardrobe}}',     desc: '当前角色穿搭摘要（各部位服饰名）' },
  { name: '{{lorebook_before}}', desc: '匹配的世界书条目（角色前位置）' },
  { name: '{{lorebook_after}}',  desc: '匹配的世界书条目（角色后位置）' },
  { name: '{{author_note}}',  desc: '当前预设的作者注记' },
  { name: '{{original}}',     desc: '用户原始输入文本' },
];

/* ═══════════════════════════════════════════════════
   WORLD BOOK ENTRIES — Variable System Documentation
   Injected into AI context when triggered by keywords
   ═══════════════════════════════════════════════════ */

/** Full variable schema entry — tells AI what variables exist */
Yuki.ST.WB_VAR_SCHEMA = {
  id: 'wb-var-schema',
  keys: ['变量','状态','属性','数值','系统'],
  content: [
    '【游戏变量系统 · 完整列表】',
    '',
    '■ 显示变量：',
    '  chapter (string) — 当前章节，如"第一章"',
    '  location (string) — 当前地点，如"车站前"、"图书馆"、"天文台"',
    '  time (string) — 游戏内时间：清晨/上午/午后/傍晚/深夜',
    '  weather (string) — 天气：雪/晴/阴/雨',
    '',
    '■ 货币：',
    '  player_gold (number) — 金币',
    '  player_gems (number) — 宝石',
    '',
    '■ 角色基础信息：',
    '  yukina_age (number) — 白羽雪菜年龄，固定17',
    '  kanade_age (number) — 星野奏年龄，固定17',
    '  rei_age (number) — 月岛零年龄，固定18',
    '',
    '■ 主角好感度（角色对悠的好感，0-100）：',
    '  yukina_affection — 雪菜→悠',
    '  kanade_affection — 奏→悠',
    '  rei_affection — 零→悠',
    '',
    '■ 角色间互感（0-100）：',
    '  yukina_to_kanade — 雪菜→奏',
    '  yukina_to_rei — 雪菜→零',
    '  kanade_to_yukina — 奏→雪菜',
    '  kanade_to_rei — 奏→零',
    '  rei_to_yukina — 零→雪菜',
    '  rei_to_kanade — 零→奏',
    '',
    '■ 角色内心想法：',
    '  yukina_thought (string) — 雪菜此刻的内心独白',
    '  kanade_thought (string) — 奏此刻的内心独白',
    '  rei_thought (string) — 零此刻的内心独白',
    '',
    '■ 衣柜穿搭（各角色当前8部位服饰）：',
    '  yukina_wardrobe: {衣装,下装,脚部,手部,头部,发型,首饰,戒指}',
    '  kanade_wardrobe: {衣装,下装,脚部,手部,头部,发型,首饰,戒指}',
    '  rei_wardrobe: {衣装,下装,脚部,手部,头部,发型,首饰,戒指}',
    '',
    '■ 旗标：',
    '  flags (object) — 剧情标记，如 {"met_rei":true, "concert_invited":false}',
    '',
    '——',
    '当前生效的变量值通过 {{variables}} 宏注入每轮对话。',
    '修改变量请使用 <vars>{"变量名":新值}</vars> JSON 标签。'
  ].join('\n'),
  comment: '变量系统完整 schema',
  enabled: true,
  position: 'before_char'
};

/** Variable update rules entry — tells AI how to update */
Yuki.ST.WB_VAR_RULES = {
  id: 'wb-var-rules',
  keys: ['更新变量','修改变量','好感度变化','好感度','增加好感','减少好感'],
  content: [
    '【变量更新规则】',
    '',
    '■ 好感度修改规则（最重要）：',
    '  • 正面互动（鼓励、安慰、帮助、赞美、赠送礼物、陪伴等）→ +1 ~ +5',
    '    - 轻微正面（普通关心、友好对话）→ +1',
    '    - 中等正面（真诚帮助、赠送小礼物）→ +2 ~ +3',
    '    - 重大正面（关键时刻支持、拯救、重要礼物、情感表达）→ +4 ~ +5',
    '  • 负面互动（冷漠、争吵、拒绝、伤害、忽视等）→ -1 ~ -5',
    '    - 轻微负面（语气冷淡、略不耐烦）→ -1',
    '    - 中等负面（明确拒绝、当众忽视）→ -2 ~ -3',
    '    - 重大负面（背叛、欺骗、恶意伤害）→ -4 ~ -5',
    '  • 好感度范围始终限定在 0-100 之间',
    '  • 修改好感度时，同时更新对应角色的 *_thought 反映最新心情',
    '  • 主角对某角色好感变化 >5 时，适度调整该角色对其他角色的互感',
    '',
    '■ 随时更新的变量：',
    '  • location / time / weather — 根据剧情推进实时变更',
    '  • yukina_thought / kanade_thought / rei_thought — 每轮对话后视情况更新',
    '  • yukina_wardrobe / kanade_wardrobe / rei_wardrobe — 角色换装时更新',
    '  • player_gold / player_gems — 消费或获得时更新',
    '  • chapter — 章节推进时更新',
    '  • flags — 触发关键事件时添加标记',
    '',
    '■ 输出格式：',
    '  在 <vars> 标签中放入 JSON，可同时更新多个变量：',
    '  <vars>{"yukina_affection":67, "yukina_thought":"他今天居然记得……", "location":"图书馆"}</vars>',
    '  嵌套对象支持深度合并（不会覆盖未提及的字段）：',
    '  <vars>{"yukina_wardrobe":{"衣装":"夏のワンピース"}}</vars>',
    '',
    '——',
    '每轮 AI 回复结束前，检查是否需要更新变量。',
    '不必每轮都更新所有变量，只需更新有实际变化的。'
  ].join('\n'),
  comment: '变量更新规则',
  enabled: true,
  position: 'before_char'
};

/** Variable initial values entry — tells AI the starting state */
Yuki.ST.WB_VAR_INITIAL = {
  id: 'wb-var-initial',
  keys: ['初始状态','开局','初始值','初始变量','新游戏'],
  content: [
    '【游戏初始状态】',
    '',
    'chapter: "第一章"',
    'location: "车站前"',
    'time: "傍晚"',
    'weather: "雪"',
    'player_gold: 12580',
    'player_gems: 34',
    '',
    'yukina_age: 17, kanade_age: 17, rei_age: 18',
    '',
    'yukina_affection: 62 (雪菜→悠，初始好感较高，两人已认识)',
    'kanade_affection: 45 (奏→悠，普通朋友水平)',
    'rei_affection: 20 (零→悠，刚认识不久)',
    '',
    'yukina_to_kanade: 30, yukina_to_rei: 15',
    'kanade_to_yukina: 55, kanade_to_rei: 25',
    'rei_to_yukina: 10, rei_to_kanade: 12',
    '',
    'yukina_thought: "他今天，会注意到我的新围巾吗……"',
    'kanade_thought: "今天的排练，他会不会来听呢……"',
    'rei_thought: "……无聊。不过，这个后辈倒是不怎么令人讨厌。"',
    '',
    '初始穿搭同 DEFAULT_WARDROBE。',
    'flags: {}'
  ].join('\n'),
  comment: '游戏初始变量值',
  enabled: true,
  position: 'before_char'
};

/* ═══════════════════════════════════════════════════
   REGEX RULES — v2.6
   SillyTavern-style regex find/replace engine
   ═══════════════════════════════════════════════════ */

/** Default regex rules */
Yuki.ST.DEFAULT_REGEX_RULES = [
  {
    id: 'rx-clean-blanklines',
    name: '清理多余空行',
    pattern: '\\n{3,}',
    replacement: '\\n\\n',
    target: 'output',
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'rx-en-to-cn-punct',
    name: '英文标点转中文',
    pattern: '(?<=[^\\d])\\.(?=\\s|$)',
    replacement: '。',
    target: 'output',
    enabled: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'rx-strip-markdown',
    name: '移除Markdown残留',
    pattern: '[*_~`#]{1,3}',
    replacement: '',
    target: 'output',
    enabled: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

/** Runtime state */
Yuki.ST.regexRules = JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_REGEX_RULES));
