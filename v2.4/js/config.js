/* ═══════════════════════════════════════════════════
   CONFIG & DATA — v2.4
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
  DB_VERSION: 2,
  VERSION: '2.3'
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
  chapter: [
    { el: 'chapter-indicator' }
  ],
  // location + time → combined "地点 · 时间" display
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
      // Also update the location since it shows weather context
      var el = document.getElementById('location-text');
      if (el) el.textContent = (vars.location||'') + ' · ' + (vars.time||'');
    }}
  ],
  player_gold: [
    { el: 'gold-amount', format: function(v) { return Number(v).toLocaleString(); } }
  ],
  player_gems: [
    { el: 'gem-amount', format: function(v) { return String(v); } }
  ],
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
  ]
};

/** Core variables that cannot be deleted from the UI */
Yuki.ST.PROTECTED_VARS = ['chapter', 'location', 'time', 'weather'];

/** Variable metadata — category, type, description for UI display */
Yuki.ST.VAR_META = {
  chapter:            { cat: 'display', type: 'string',  desc: '当前章节' },
  location:           { cat: 'display', type: 'string',  desc: '当前地点' },
  time:               { cat: 'display', type: 'string',  desc: '游戏内时间' },
  weather:            { cat: 'display', type: 'string',  desc: '当前天气' },
  yukina_affection:   { cat: 'affection', type: 'number', desc: '雪菜好感度 (0-100)' },
  kanade_affection:   { cat: 'affection', type: 'number', desc: '奏好感度 (0-100)' },
  rei_affection:      { cat: 'affection', type: 'number', desc: '零好感度 (0-100)' },
  player_gold:        { cat: 'currency', type: 'number', desc: '金币数量' },
  player_gems:        { cat: 'currency', type: 'number', desc: '宝石数量' },
  flags:              { cat: 'state',   type: 'object',  desc: '剧情标记旗标' }
};

/* ── Macros reference (for UI help) ── */
Yuki.ST.SUPPORTED_MACROS = [
  { name: '{{char}}',         desc: '当前AI角色名' },
  { name: '{{user}}',         desc: '玩家用户名' },
  { name: '{{char_card}}',    desc: '角色完整卡片（描述+性格+场景+开场白+例句）' },
  { name: '{{system_prompt}}',desc: '当前预设的系统提示词' },
  { name: '{{variables}}',    desc: '所有游戏变量的键值对' },
  { name: '{{lorebook_before}}', desc: '匹配的世界书条目（角色前位置）' },
  { name: '{{lorebook_after}}',  desc: '匹配的世界书条目（角色后位置）' },
  { name: '{{author_note}}',  desc: '当前预设的作者注记' },
  { name: '{{original}}',     desc: '用户原始输入文本' },
];
