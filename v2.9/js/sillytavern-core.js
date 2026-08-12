/* ═══════════════════════════════════════════════════
   SILLYTAVERN CORE — v2.9
   DB, API, Presets, Lorebook (position-grouped),
   Tavern-style Prompt Assembly, Stream, Chat, Variables, Memory
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.ST = Yuki.ST || {};

/* ── IndexedDB ── */
Yuki.ST._db = null;
Yuki.ST.openDB = function() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(Yuki.CONFIG.DB_NAME, Yuki.CONFIG.DB_VERSION);
    req.onupgradeneeded = function(e) {
      var d = e.target.result;
      if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings', {keyPath:'id'});
      if (!d.objectStoreNames.contains('lorebooks')) d.createObjectStore('lorebooks', {keyPath:'id'});
      if (!d.objectStoreNames.contains('chats')) d.createObjectStore('chats', {keyPath:'id'});
      if (!d.objectStoreNames.contains('variables')) d.createObjectStore('variables', {keyPath:'chatId'});
      if (!d.objectStoreNames.contains('characterCards')) d.createObjectStore('characterCards', {keyPath:'id'});
      if (!d.objectStoreNames.contains('presets')) d.createObjectStore('presets', {keyPath:'id'});
      if (!d.objectStoreNames.contains('regexes')) d.createObjectStore('regexes', {keyPath:'id'});
      if (!d.objectStoreNames.contains('memories')) d.createObjectStore('memories', {keyPath:'id'});
    };
    req.onsuccess = function(e) { Yuki.ST._db = e.target.result; resolve(Yuki.ST._db); };
    req.onerror = function(e) { reject(e.target.error); };
  });
};
Yuki.ST._dbGet = function(store, key) {
  return new Promise(function(resolve, reject) {
    var tx = Yuki.ST._db.transaction(store, 'readonly');
    var req = tx.objectStore(store).get(key);
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
};
Yuki.ST._dbGetAll = function(store) {
  return new Promise(function(resolve, reject) {
    var tx = Yuki.ST._db.transaction(store, 'readonly');
    var req = tx.objectStore(store).getAll();
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
};
Yuki.ST._dbPut = function(store, obj) {
  return new Promise(function(resolve, reject) {
    var tx = Yuki.ST._db.transaction(store, 'readwrite');
    var req = tx.objectStore(store).put(obj);
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
};
Yuki.ST._dbDelete = function(store, key) {
  return new Promise(function(resolve, reject) {
    var tx = Yuki.ST._db.transaction(store, 'readwrite');
    var req = tx.objectStore(store).delete(key);
    req.onsuccess = function() { resolve(); };
    req.onerror = function(e) { reject(e.target.error); };
  });
};

/* ── API Settings ── */
Yuki.ST.apiSettings = {
  id:'api-settings',
  primary:{baseUrl:'https://api.openai.com/v1',apiKey:'',model:'gpt-3.5-turbo'},
  secondary:{enabled:false,baseUrl:'',apiKey:'',model:''},
  characterName:'雪菜',userName:'悠',
  customTags:['maintext','option','sum','vars','thinking','summary','meta'],
  uiMode:'game'
};
Yuki.ST.loadApiSettings = function() {
  return Yuki.ST._dbGet('settings','api-settings').then(function(s) { if (s) Object.assign(Yuki.ST.apiSettings, s); });
};
Yuki.ST.saveApiSettings = function() {
  return Yuki.ST._dbPut('settings', Yuki.ST.apiSettings);
};

/* ── Presets CRUD (NEW v2.3) ── */
Yuki.ST.loadPresets = function() {
  return Yuki.ST._dbGetAll('presets').then(function(saved) {
    if (saved && saved.length) Yuki.ST.presets = saved;
  });
};
Yuki.ST.savePresets = function() {
  return Promise.all(Yuki.ST.presets.map(function(p) { return Yuki.ST._dbPut('presets', p); }));
};
Yuki.ST.getActivePreset = function() {
  var preset = Yuki.ST.presets.find(function(p) { return p.id === Yuki.ST.activePresetId; });
  return preset || Yuki.ST.presets[0];
};

/* ── Regex Rules CRUD (NEW v2.6) ── */
Yuki.ST.loadRegexRules = function() {
  return Yuki.ST._dbGetAll('regexes').then(function(saved) {
    if (saved && saved.length) Yuki.ST.regexRules = saved;
  });
};
Yuki.ST.saveRegexRules = function() {
  return Promise.all(Yuki.ST.regexRules.map(function(r) { return Yuki.ST._dbPut('regexes', r); }));
};

/**
 * Apply enabled regex rules to user input before sending to AI.
 * @param {string} text - Raw user input
 * @returns {string} - Transformed text
 */
Yuki.ST.applyRegexInput = function(text) {
  var result = text;
  Yuki.ST.regexRules.forEach(function(rule) {
    if (!rule.enabled) return;
    if (rule.target !== 'input' && rule.target !== 'both') return;
    try {
      var re = new RegExp(rule.pattern, 'g');
      result = result.replace(re, rule.replacement);
    } catch(e) { console.warn('Regex error in rule "'+rule.name+'":', e.message); }
  });
  return result;
};

/**
 * Apply enabled regex rules to AI output before displaying.
 * @param {string} text - Raw AI output
 * @returns {string} - Transformed text
 */
Yuki.ST.applyRegexOutput = function(text) {
  var result = text;
  Yuki.ST.regexRules.forEach(function(rule) {
    if (!rule.enabled) return;
    if (rule.target !== 'output' && rule.target !== 'both') return;
    try {
      var re = new RegExp(rule.pattern, 'g');
      result = result.replace(re, rule.replacement);
    } catch(e) { console.warn('Regex error in rule "'+rule.name+'":', e.message); }
  });
  return result;
};

/* ── Lorebooks ── */
Yuki.ST.DEFAULT_LOREBOOK = {
  id:'default-lore',name:'雪之痕·世界设定',
  entries:[
    // ── Character entries ──
    {id:'e1',keys:['雪菜','白羽'],content:'白羽雪菜，17岁，文学部成员。性格温柔内向，喜欢读书和热可可。住在车站附近的公寓里。',comment:'女主角',enabled:true,position:'before_char'},
    {id:'e2',keys:['奏','星野'],content:'星野奏，17岁，轻音部主唱兼吉他手。表面上开朗活泼，但内心深处藏着不为人知的伤痛。',comment:'第二女主角',enabled:true,position:'before_char'},
    {id:'e3',keys:['零','月島'],content:'月岛零，18岁，三年级前辈。天文部唯一成员。话不多但观察力敏锐，喜欢在深夜的天文台独自观星。',comment:'第三女主角',enabled:true,position:'before_char'},
    {id:'e4',keys:['车站','駅'],content:'故事的主要场景之一。位于小镇中心，是学生们上下学的必经之路。傍晚时分灯光特别温暖。',comment:'场景',enabled:true,position:'after_char'},
    {id:'e5',keys:['圣诞','圣诞节','12月'],content:'故事发生在12月圣诞季。小镇被白雪覆盖，到处装饰着圣诞灯饰。这是一个关于冬季恋爱的故事。',comment:'时间',enabled:true,position:'after_char'},
    // ── Variable system entries (v2.5) ──
    {id:'e6',keys:['变量','状态','属性','数值','系统'],content:'【游戏变量系统 · 完整列表】\n\n■ 显示变量：\n  chapter (string) — 当前章节\n  location (string) — 当前地点\n  time (string) — 游戏内时间：清晨/上午/午后/傍晚/深夜\n  weather (string) — 天气：雪/晴/阴/雨\n\n■ 货币：\n  player_gold (number) — 金币\n  player_gems (number) — 宝石\n\n■ 角色基础：\n  yukina_age(17) / kanade_age(17) / rei_age(18)\n\n■ 主角好感度 (0-100)：\n  yukina_affection(雪菜→悠) / kanade_affection(奏→悠) / rei_affection(零→悠)\n\n■ 角色间互感 (0-100)：\n  yukina_to_kanade / yukina_to_rei\n  kanade_to_yukina / kanade_to_rei\n  rei_to_yukina / rei_to_kanade\n\n■ 角色想法：\n  yukina_thought / kanade_thought / rei_thought (string)\n\n■ 衣柜穿搭（每人8部位对象）：\n  yukina_wardrobe / kanade_wardrobe / rei_wardrobe\n  部位：衣装,下装,脚部,手部,头部,发型,首饰,戒指\n\n■ 旗标：\n  flags (object)\n\n——\n修改变量使用 <vars>{"变量名":新值}</vars> JSON 标签。',comment:'变量 schema (v2.5)',enabled:true,position:'before_char'},
    {id:'e7',keys:['更新变量','修改变量','好感度变化','好感','正面互动','负面互动'],content:'【变量更新规则】\n\n■ 好感度修改（最重要）：\n正面互动（鼓励/安慰/帮助/赞美/礼物/陪伴等）→ +1 ~ +5\n  轻微正面 → +1\n  中等正面 → +2 ~ +3\n  重大正面 → +4 ~ +5\n负面互动（冷漠/争吵/拒绝/伤害/忽视等）→ -1 ~ -5\n  轻微负面 → -1\n  中等负面 → -2 ~ -3\n  重大负面 → -4 ~ -5\n范围始终 0-100。修改好感度时同步更新 *_thought。\n\n■ 其他变量根据剧情实时变动：\n  location/time/weather — 场景切换时更新\n  *_thought — 每轮视心情更新\n  *_wardrobe — 角色换装时更新\n  player_gold/gems — 消费/获得时更新\n  chapter — 章节推进时更新\n  flags — 关键事件标记\n\n■ 输出格式（可同时更新多个）：\n<vars>{"yukina_affection":67,"yukina_thought":"他居然记得……","location":"图书馆"}</vars>',comment:'变量更新规则 (v2.5)',enabled:true,position:'before_char'},
    {id:'e8',keys:['初始状态','开局','初始值','初始变量','新游戏'],content:'【游戏初始状态】\n\nchapter:"第一章" | location:"车站前" | time:"傍晚" | weather:"雪"\nplayer_gold:12580 | player_gems:34\n\nyukina_age:17 | kanade_age:17 | rei_age:18\n\nyukina_affection:62(雪菜→悠,已认识) | kanade_affection:45(奏→悠) | rei_affection:20(零→悠,刚认识)\n\nyukina_to_kanade:30 | yukina_to_rei:15\nkanade_to_yukina:55 | kanade_to_rei:25\nrei_to_yukina:10 | rei_to_kanade:12\n\nyukina_thought:"他今天，会注意到我的新围巾吗……"\nkanade_thought:"今天的排练，他会不会来听呢……"\nrei_thought:"……无聊。不过，这个后辈倒是不怎么令人讨厌。"\n\n初始穿搭见 DEFAULT_WARDROBE。flags:{}',comment:'变量初始值 (v2.5)',enabled:true,position:'before_char'},
  ]
};
Yuki.ST.lorebooks = [JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_LOREBOOK))];
Yuki.ST.activeLorebookIds = ['default-lore'];

Yuki.ST.loadLorebooks = function() {
  return Yuki.ST._dbGetAll('lorebooks').then(function(saved) { if (saved.length) Yuki.ST.lorebooks = saved; });
};
Yuki.ST.saveLorebooks = function() {
  return Promise.all(Yuki.ST.lorebooks.map(function(lb) { return Yuki.ST._dbPut('lorebooks', lb); }));
};

/**
 * Match lorebook entries against user input.
 * Returns position-grouped result: { beforeChar, afterChar }
 * (NEW v2.3 — tavern-style position grouping)
 */
Yuki.ST.matchLorebooks = function(input) {
  var lower = input.toLowerCase();
  var beforeChar = [], afterChar = [];
  Yuki.ST.activeLorebookIds.forEach(function(lbId) {
    var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === lbId; });
    if (!lb) return;
    lb.entries.forEach(function(e) {
      if (!e.enabled) return;
      if (e.keys.some(function(k) { return lower.indexOf(k.toLowerCase()) >= 0; })) {
        var pos = e.position || 'before_char';
        if (pos === 'after_char') afterChar.push(e);
        else beforeChar.push(e);
      }
    });
  });
  return { beforeChar: beforeChar, afterChar: afterChar };
};

/* ── Character Cards ── */
Yuki.ST.DEFAULT_CARDS = [
  {id:'char-yukina',name:'白羽雪菜',description:'17岁，文学部成员。温柔内向，喜欢读书和热可可。',personality:'内向温柔、细腻敏感、容易害羞。说话轻声细语，不善表达但内心情感丰富。',scenario:'圣诞夜的车站前，你与雪菜相遇。',firstMessage:'「那个……谢谢你今天愿意来。」',exampleDialogs:'雪菜: 「下雪了呢……」\n悠: 「是啊。」\n雪菜: 「嗯。不过……我不讨厌。因为雪让一切都变得安静了。」',systemPrompt:'你正在扮演白羽雪菜——一个温柔内向的17岁女孩。请用轻柔、略带犹豫的语气说话。你对悠有着淡淡的、尚未说出口的情愫。'},
  {id:'char-kanade',name:'星野奏',description:'17岁，轻音部主唱兼吉他手。',personality:'表面开朗活泼，内心有隐痛。热爱音乐，在舞台上光芒四射。',scenario:'轻音部的排练室里，奏正在调试吉他。',firstMessage:'「哟！来得正好——听听这段solo怎么样？」',systemPrompt:'你正在扮演星野奏——一个17岁的摇滚少女。请用活泼开朗的语气说话，偶尔流露出内心的脆弱。'},
  {id:'char-rei',name:'月岛零',description:'18岁，三年级前辈。天文部唯一成员。安静寡言。',personality:'话少但精准，不喜无意义社交。看似冷漠，实则会在意身边的人。',scenario:'深夜的天文台，零正在调整望远镜。',firstMessage:'「……这么晚了还上来，不冷吗？」',systemPrompt:'你正在扮演月岛零——一个18岁的安静前辈。请用简短但意味深长的方式说话。你的话语不多但每一句都很精准。'},
];
Yuki.ST.characterCards = JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_CARDS));
Yuki.ST.activeCharacterId = 'char-yukina';
Yuki.ST.loadCharacterCards = function() {
  return Yuki.ST._dbGetAll('characterCards').then(function(saved) { if (saved.length) Yuki.ST.characterCards = saved; });
};

/* ── Game Variables (v2.5: expanded character state) ── */
Yuki.ST.variables = {
  // Display
  chapter:'第一章', location:'车站前', time:'傍晚', weather:'雪',
  // Currency
  player_gold:12580, player_gems:34,
  // Character ages
  yukina_age:17, kanade_age:17, rei_age:18,
  // Player→Character affections
  yukina_affection:62, kanade_affection:45, rei_affection:20,
  // Inter-character affections
  yukina_to_kanade:30, yukina_to_rei:15,
  kanade_to_yukina:55, kanade_to_rei:25,
  rei_to_yukina:10, rei_to_kanade:12,
  // Character thoughts
  yukina_thought:'他今天，会注意到我的新围巾吗……应该不会吧。毕竟他总是看着别的地方呢。',
  kanade_thought:'今天的排练，他会不会来听呢？虽然每次都装作不在意，但果然还是希望他在场啊。',
  rei_thought:'……无聊。不过，这个后辈倒是不怎么令人讨厌。稍微，再观察一阵子吧。',
  // Wardrobe (deep-copied from defaults)
  yukina_wardrobe:JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_WARDROBE.yukina)),
  kanade_wardrobe:JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_WARDROBE.kanade)),
  rei_wardrobe:JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_WARDROBE.rei)),
  // Flags
  flags:{}
};
Yuki.ST._varSnapshots = {};

/* ═══════════════════════════════════════════════════
   MEMORY SYSTEM — v2.7
   Hierarchical: full-text → summary → meta-summary
   ═══════════════════════════════════════════════════ */

/** Configurable limits for each memory tier */
Yuki.ST.memConfig = {
  fullTextLimit: 3,   // 全文层：最近 N 条完整正文
  summaryLimit: 5,    // 小总结层：次近 M 条小总结
  metaLimit: 10       // 大总结层：更早 K 条大总结
};

/** Memory entries array: [{id, fullText, summary, meta, speaker, chapter, timestamp}, ...] */
Yuki.ST.memories = [];

/**
 * Load memories from IndexedDB.
 */
Yuki.ST.loadMemories = function() {
  return Yuki.ST._dbGetAll('memories').then(function(saved) {
    if (saved && saved.length) Yuki.ST.memories = saved.sort(function(a, b) { return a.timestamp - b.timestamp; });
  });
};

/**
 * Save all memories to IndexedDB.
 */
Yuki.ST.saveMemories = function() {
  return Promise.all(Yuki.ST.memories.map(function(m) { return Yuki.ST._dbPut('memories', m); }));
};

/**
 * Add a new memory entry from AI output.
 * @param {string} fullText - The main text of the AI response
 * @param {string} summary  - AI-generated summary of this passage
 * @param {string} meta     - AI-generated meta-summary (one-line essence)
 */
Yuki.ST.addMemory = function(fullText, summary, meta) {
  var entry = {
    id: 'mem-' + Date.now(),
    fullText: fullText,
    summary: summary || '',
    meta: meta || '',
    speaker: Yuki.ST.getActiveCharacter().name,
    chapter: Yuki.ST.variables.chapter || '',
    timestamp: Date.now()
  };
  Yuki.ST.memories.push(entry);
  Yuki.ST.saveMemories().catch(function(e) { console.warn('Failed to save memory:', e); });
  return entry;
};

/**
 * Build the hierarchical memory context string for AI prompt injection.
 * Tier 1 (most recent): full text → Tier 2: summaries → Tier 3: meta-summaries
 * @returns {string} Formatted memory context
 */
Yuki.ST.buildMemoryContext = function() {
  var memories = Yuki.ST.memories;
  var cfg = Yuki.ST.memConfig;
  var total = memories.length;
  if (total === 0) return '';

  var parts = [];

  // Full-text entries (most recent N)
  var fullStart = Math.max(0, total - cfg.fullTextLimit);
  var fullEntries = memories.slice(fullStart);

  // Summary entries (before full-text, up to M)
  var sumStart = Math.max(0, fullStart - cfg.summaryLimit);
  var sumEntries = memories.slice(sumStart, fullStart);

  // Meta-summary entries (oldest, up to K)
  var metaStart = Math.max(0, sumStart - cfg.metaLimit);
  var metaEntries = memories.slice(metaStart, sumStart);

  // Build context from oldest to newest
  if (metaEntries.length > 0) {
    parts.push('【大总结 · 更早的剧情】');
    metaEntries.forEach(function(m, i) {
      parts.push('▸ ' + m.meta);
    });
  }

  if (sumEntries.length > 0) {
    parts.push('【小总结 · 前情回顾】');
    sumEntries.forEach(function(m, i) {
      parts.push('▸ ' + m.summary);
    });
  }

  if (fullEntries.length > 0) {
    parts.push('【最近剧情 · 全文】');
    fullEntries.forEach(function(m, i) {
      parts.push('[' + m.speaker + '] ' + m.fullText);
    });
  }

  return parts.join('\n');
};

/**
 * Delete a single memory entry by id.
 */
Yuki.ST.deleteMemory = function(id) {
  Yuki.ST.memories = Yuki.ST.memories.filter(function(m) { return m.id !== id; });
  return Yuki.ST.saveMemories().then(function() {
    return Yuki.ST._dbDelete('memories', id).catch(function() {});
  });
};

/**
 * Clear all memories.
 */
Yuki.ST.clearMemories = function() {
  Yuki.ST.memories = [];
  return Promise.all([Yuki.ST.saveMemories()]).then(function() {
    return Yuki.ST._dbGetAll('memories').then(function(all) {
      return Promise.all(all.map(function(m) { return Yuki.ST._dbDelete('memories', m.id).catch(function() {}); }));
    });
  });
};

/**
 * Persist memory config to IndexedDB.
 */
Yuki.ST.saveMemConfig = function() {
  return Yuki.ST._dbPut('settings', { id: 'mem-config', config: Yuki.ST.memConfig });
};

/**
 * Load memory config from IndexedDB.
 */
Yuki.ST.loadMemConfig = function() {
  return Yuki.ST._dbGet('settings', 'mem-config').then(function(saved) {
    if (saved && saved.config) Object.assign(Yuki.ST.memConfig, saved.config);
  });
};

Yuki.ST.getActiveCharacter = function() {
  return Yuki.ST.characterCards.find(function(c) { return c.id === Yuki.ST.activeCharacterId; }) || Yuki.ST.characterCards[0];
};
Yuki.ST.getVarsText = function() {
  return Object.entries(Yuki.ST.variables).filter(function(e) { return !e[0].startsWith('_'); }).map(function(e) {
    var key = e[0], val = e[1];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      // Format wardrobe objects as readable lists
      if (key.indexOf('wardrobe') >= 0) {
        var items = Object.entries(val).map(function(p) { return '    ' + p[0] + ': ' + p[1]; }).join('\n');
        return key + ':\n' + items;
      }
      return key + ': ' + JSON.stringify(val);
    }
    return key + ': ' + val;
  }).join('\n');
};

/** Format wardrobe for the current active character as a summary string */
Yuki.ST.getWardrobeText = function() {
  var char = Yuki.ST.getActiveCharacter();
  var charId = char.id.replace('char-', ''); // 'char-yukina' → 'yukina'
  var wardrobe = Yuki.ST.variables[charId + '_wardrobe'];
  if (!wardrobe) return '（无穿搭数据）';
  var slotOrder = ['衣装','下装','脚部','手部','头部','发型','首饰','戒指'];
  return slotOrder.map(function(slot) {
    return slot + ': ' + (wardrobe[slot] || '—');
  }).join(' | ');
};

/**
 * Single entry point for ALL variable mutations.
 * Updates both the JS object AND the bound DOM elements.
 *
 * @param {string} key   - Variable name
 * @param {*}      value - New value (string, number, object, etc.)
 */
Yuki.ST.setVariable = function(key, value) {
  // Update the JS store
  Yuki.ST.variables[key] = value;
  // Refresh bound DOM elements
  Yuki.ST._refreshBinding(key);
};

/**
 * Refresh DOM elements bound to a specific variable key.
 * Uses Yuki.ST.VAR_BINDINGS from config.js.
 */
Yuki.ST._refreshBinding = function(key) {
  var actions = Yuki.ST.VAR_BINDINGS[key];
  if (!actions) return;
  var val = Yuki.ST.variables[key];
  actions.forEach(function(action) {
    if (action.el) {
      // Simple textContent update
      var el = document.getElementById(action.el);
      if (el) {
        el.textContent = action.format ? action.format(val) : String(val);
      }
    } else if (action.html) {
      // innerHTML update (for time with colon)
      var el2 = document.getElementById(action.html);
      if (el2) {
        el2.innerHTML = action.format ? action.format(val) : String(val);
      }
    } else if (action.style) {
      // CSS style update within a container
      var container = document.getElementById(action.style.el);
      if (container) {
        var target = container.querySelector(action.style.sel);
        if (target) target.style[action.style.prop] = val + (action.style.suffix || '');
      }
    } else if (action.sel) {
      // Query selector within container, set textContent
      var c2 = document.getElementById(action.sel.el);
      if (c2) {
        var t2 = c2.querySelector(action.sel.sel);
        if (t2) t2.textContent = action.format ? action.format(val) : String(val);
      }
    } else if (action.custom) {
      // Custom function receives full variables object for cross-variable logic
      action.custom(Yuki.ST.variables);
    }
  });
};

/**
 * Refresh ALL bound DOM elements from current variable state.
 * Call on page init, after loading a save, or after bulk variable restore.
 */
Yuki.ST.refreshAllHUD = function() {
  Object.keys(Yuki.ST.VAR_BINDINGS).forEach(function(key) {
    Yuki.ST._refreshBinding(key);
  });
};

/**
 * Deep merge source object into target. Returns target (mutated).
 * Arrays and objects are merged recursively; primitives are overwritten.
 */
Yuki.ST.deepMerge = function(target, source) {
  Object.keys(source).forEach(function(key) {
    var sv = source[key], tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      Yuki.ST.deepMerge(tv, sv);
    } else {
      target[key] = sv;
    }
  });
  return target;
};

/**
 * Merge parsed <vars> JSON into game variables.
 * Uses deep merge and triggers DOM refresh for each changed key.
 */
Yuki.ST.mergeVars = function(jsonStr) {
  try {
    var parsed = JSON.parse(jsonStr);
    Object.keys(parsed).forEach(function(key) {
      var newVal = parsed[key];
      var oldVal = Yuki.ST.variables[key];
      // Deep merge for objects, overwrite for primitives
      if (newVal && typeof newVal === 'object' && !Array.isArray(newVal) &&
          oldVal && typeof oldVal === 'object' && !Array.isArray(oldVal)) {
        Yuki.ST.deepMerge(oldVal, newVal);
      } else {
        Yuki.ST.variables[key] = newVal;
      }
      Yuki.ST._refreshBinding(key);
    });
  } catch(e) { console.warn('mergeVars parse error:', e); }
};

Yuki.ST.snapshotVars = function(msgId) {
  Yuki.ST._varSnapshots[msgId] = JSON.parse(JSON.stringify(Yuki.ST.variables));
};

Yuki.ST.rollbackVars = function(msgId) {
  if (Yuki.ST._varSnapshots[msgId]) {
    Yuki.ST.variables = JSON.parse(JSON.stringify(Yuki.ST._varSnapshots[msgId]));
    Yuki.ST.refreshAllHUD();
  }
};

/**
 * Macro replacement engine — tavern-style {{macro}} system
 * Supported: {{char}} {{user}} {{char_card}} {{system_prompt}}
 *            {{variables}} {{lorebook_before}} {{lorebook_after}}
 *            {{author_note}} {{original}}
 * Plus: any custom variable {{var_name}}
 */
Yuki.ST.replaceMacros = function(template, context) {
  var result = template;
  // Static macros
  var macros = {
    '{{char}}': context.characterName,
    '{{user}}': context.userName,
    '{{char_card}}': context.charCard,
    '{{system_prompt}}': context.systemPrompt,
    '{{variables}}': context.variablesText,
    '{{wardrobe}}': context.wardrobeText || '',
    '{{memory}}': context.memoryContext || '',
    '{{lorebook_before}}': context.loreBefore,
    '{{lorebook_after}}': context.loreAfter,
    '{{author_note}}': context.authorNote,
    '{{original}}': context.userInput || ''
  };
  Object.keys(macros).forEach(function(key) {
    result = result.split(key).join(macros[key]);
  });
  // Custom variable macros: {{var_name}}
  if (context.variables) {
    result = result.replace(/\{\{([^{}]+)\}\}/g, function(match, varName) {
      var trimmed = varName.trim();
      var val = context.variables[trimmed];
      return val !== undefined ? String(val) : match;
    });
  }
  return result;
};

/**
 * Assemble tavern-style prompt with macro substitution.
 * Uses active preset's formatTemplate and generation params.
 */
Yuki.ST.assemblePrompt = function(userInput, history) {
  var preset = Yuki.ST.getActivePreset();
  var char = Yuki.ST.getActiveCharacter();
  var loreGroups = Yuki.ST.matchLorebooks(userInput);

  // Build char card (full character info block)
  var charCard = [
    '【' + char.name + '】',
    char.description,
    '',
    '性格：' + char.personality,
    '',
    '场景：' + char.scenario,
    '',
    '开场白：' + char.firstMessage,
    '',
    '对话示例：',
    char.exampleDialogs
  ].join('\n');

  // Build lorebook texts
  var loreBefore = loreGroups.beforeChar.length
    ? loreGroups.beforeChar.map(function(e) { return e.content; }).join('\n')
    : '（无匹配条目）';
  var loreAfter = loreGroups.afterChar.length
    ? loreGroups.afterChar.map(function(e) { return e.content; }).join('\n')
    : '（无匹配条目）';

  // Build macro context
  var context = {
    characterName: char.name,
    userName: Yuki.ST.apiSettings.userName || '悠',
    charCard: charCard,
    systemPrompt: preset.systemPrompt || '',
    variablesText: Yuki.ST.getVarsText(),
    wardrobeText: Yuki.ST.getWardrobeText(),
    memoryContext: Yuki.ST.buildMemoryContext(),
    variables: Yuki.ST.variables,
    loreBefore: loreBefore,
    loreAfter: loreAfter,
    authorNote: preset.authorNote || '',
    userInput: userInput
  };

  // Apply macro substitution on the preset's format template
  var systemPrompt = Yuki.ST.replaceMacros(preset.formatTemplate, context);

  // Build message array
  var msgs = [{role:'system',content:systemPrompt}];
  if (history && history.length) {
    history.slice(-20).forEach(function(m) { msgs.push({role:m.role,content:m.content}); });
  }
  msgs.push({role:'user',content:userInput});
  return msgs;
};

/* ── Stream Parser ── */
Yuki.ST.StreamParser = function() { this.buffer = ''; };
Yuki.ST.StreamParser.prototype.feed = function(chunk) { this.buffer += chunk; };
Yuki.ST.StreamParser.prototype.parse = function() {
  var result = {maintext:'',option:'',sum:'',vars:'',thinking:'',summary:'',meta:'',complete:false};
  var text = this.buffer;
  function extract(tag) {
    var openRegex = new RegExp('<'+tag+'>','i'), closeRegex = new RegExp('</'+tag+'>','i');
    var om = text.match(openRegex), cm = text.match(closeRegex);
    if (om && cm) { var s = om.index+om[0].length; return {content:text.slice(s,cm.index).trim(),complete:true}; }
    else if (om) { var s2 = om.index+om[0].length; return {content:text.slice(s2).trim(),complete:false}; }
    return {content:'',complete:false};
  }
  ['thinking','think','maintext','option','sum','vars','summary','meta'].forEach(function(tag) {
    var r = extract(tag);
    if (r.content) { result[tag==='think'?'thinking':tag] = r.content; if (r.complete) result.complete = true; }
  });
  return result;
};

/* ── AI Chat (v2.3: uses active preset params) ── */
Yuki.ST.currentChatId = null;
Yuki.ST.chatHistory = [];
Yuki.ST.isStreaming = false;

Yuki.ST.initChat = function() {
  Yuki.ST.currentChatId = 'chat-' + Date.now();
  Yuki.ST.chatHistory = [];
};

Yuki.ST.sendToAI = function(userInput) {
  if (Yuki.ST.isStreaming) return;
  if (!Yuki.ST.apiSettings.primary.apiKey) { Yuki.UI.toast('请先在 API 设置中配置 API Key', 'warning', 4000); return; }
  Yuki.ST.isStreaming = true;

  // Apply regex rules to user input (v2.6)
  var processedInput = Yuki.ST.applyRegexInput(userInput);

  var msgs = Yuki.ST.assemblePrompt(processedInput, Yuki.ST.chatHistory);
  var preset = Yuki.ST.getActivePreset();
  var params = preset.params;

  Yuki.ST.chatHistory.push({role:'user',content:processedInput,id:'msg-'+Date.now(),timestamp:Date.now()});
  var dialogText = document.getElementById('dialog-text');
  document.getElementById('dialog-speaker-tag').textContent = Yuki.ST.getActiveCharacter().name;
  dialogText.textContent = '……'; dialogText.style.opacity = '0.5';

  // Build API request body from active preset params
  var body = {
    model: Yuki.ST.apiSettings.primary.model,
    messages: msgs,
    temperature: params.temperature,
    max_tokens: params.max_tokens,
    top_p: params.top_p,
    frequency_penalty: params.frequency_penalty,
    presence_penalty: params.presence_penalty,
    stream: params.stream !== false
  };

  fetch(Yuki.ST.apiSettings.primary.baseUrl + '/chat/completions', {
    method:'POST',
    headers:{'Authorization':'Bearer '+Yuki.ST.apiSettings.primary.apiKey,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  }).then(function(resp) {
    if (!resp.ok) return resp.text().then(function(t) { throw new Error('API '+resp.status+': '+t); });
    // Handle streaming response
    if (params.stream !== false) {
      var parser = new Yuki.ST.StreamParser();
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var fullContent = '';
      function pump() {
        return reader.read().then(function(r) {
          if (r.done) return;
          var lines = decoder.decode(r.value,{stream:true}).split('\n');
          lines.forEach(function(line) {
            if (!line.startsWith('data: ')) return;
            var data = line.slice(6).trim();
            if (data === '[DONE]') return;
            try {
              var delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) { fullContent += delta; dialogText.textContent = fullContent; dialogText.style.opacity = '0.85'; }
            } catch(e) {}
          });
          return pump();
        });
      }
      return pump().then(function() { return Yuki.ST._processAIResponse(fullContent, dialogText); });
    } else {
      // Handle non-streaming response
      return resp.json().then(function(data) {
        var content = data.choices?.[0]?.message?.content || '';
        return Yuki.ST._processAIResponse(content, dialogText);
      });
    }
  }).catch(function(err) {
    console.error(err);
    dialogText.textContent = '……（连接中断）'; dialogText.style.opacity = '0.5';
    Yuki.UI.toast('AI 连接失败：' + err.message, 'error', 5000);
    document.getElementById('respond-hint').classList.add('visible');
    Yuki.ST.isStreaming = false;
  });
};

Yuki.ST._processAIResponse = function(fullContent, dialogText) {
  // Apply regex rules to AI output (v2.6)
  fullContent = Yuki.ST.applyRegexOutput(fullContent);
  var parsed = (new Yuki.ST.StreamParser());
  parsed.feed(fullContent);
  var result = parsed.parse();
  var display = result.maintext || fullContent;
  dialogText.textContent = display; dialogText.style.opacity = '1';
  if (result.vars) Yuki.ST.mergeVars(result.vars);
  // Store memory if AI provided summary/meta
  if (result.maintext && (result.summary || result.meta)) {
    Yuki.ST.addMemory(display, result.summary, result.meta);
  }
  var asst = {id:'msg-'+Date.now(),role:'assistant',content:display,rawContent:fullContent,timestamp:Date.now()};
  Yuki.ST.chatHistory.push(asst);
  Yuki.ST.snapshotVars(asst.id);
  Yuki.ST._saveChat();
  // Options
  if (result.option) {
    var opts = result.option.split('\n').filter(function(o) { return o.trim(); });
    if (opts.length) Yuki.ST._renderOptions(opts);
  }
  document.getElementById('respond-hint').classList.add('visible');
  Yuki.ST.isStreaming = false;
};

Yuki.ST._renderOptions = function(opts) {
  var existing = document.getElementById('ai-option-panel');
  if (existing) existing.remove();
  var container = document.createElement('div');
  container.className = 'ai-option-panel'; container.id = 'ai-option-panel';
  opts.forEach(function(opt, i) {
    var btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = '<span class="choice-index">'+(i+1)+'</span>'+opt.trim();
    btn.addEventListener('click', function() { container.remove(); Yuki.ST.sendToAI(opt.trim()); });
    container.appendChild(btn);
  });
  document.getElementById('dialog-area').appendChild(container);
};

Yuki.ST._saveChat = function() {
  if (!Yuki.ST.currentChatId || !Yuki.ST.chatHistory.length) return;
  Yuki.ST._dbPut('chats', {
    id:Yuki.ST.currentChatId,name:'会话 '+new Date().toLocaleString('zh-CN'),
    messages:Yuki.ST.chatHistory,createdAt:Date.now(),characterId:Yuki.ST.activeCharacterId,
    presetId:Yuki.ST.activePresetId
  });
  Yuki.ST._dbPut('variables', {chatId:Yuki.ST.currentChatId,variables:Yuki.ST.variables});
};

/* ── SillyTavern Init ── */
Yuki.ST.init = function() {
  return Yuki.ST.openDB().then(function() {
    return Promise.all([
      Yuki.ST.loadApiSettings(),
      Yuki.ST.loadLorebooks(),
      Yuki.ST.loadCharacterCards(),
      Yuki.ST.loadPresets(),
      Yuki.ST.loadRegexRules(),
      Yuki.ST.loadMemConfig(),
      Yuki.ST.loadMemories()
    ]);
  }).then(function() {
    Yuki.ST.initChat();
    console.log('%cSillyTavern Core v2.9 %cloaded','color:#c4a15a;font-weight:bold;','color:#928ca0;');
    console.log('%c  API: '+ (Yuki.ST.apiSettings.primary.apiKey ? 'configured' : 'mock mode'),'color:#5c5770;');
    console.log('%c  Preset: '+ Yuki.ST.getActivePreset().name,'color:#5c5770;');
  });
};
