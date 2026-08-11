/* ═══════════════════════════════════════════════════
   SILLYTAVERN CORE — DB, API, Lorebook, Prompt, Stream, Chat, Variables
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.ST = {};

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
Yuki.ST.DEFAULT_API = {
  id:'api-settings',
  primary:{baseUrl:'https://api.openai.com/v1',apiKey:'',model:'gpt-3.5-turbo'},
  secondary:{enabled:false,baseUrl:'',apiKey:'',model:''},
  characterName:'雪菜',userName:'悠',
  customTags:['maintext','option','sum','vars','thinking'],
  uiMode:'game',
  formatPromptTemplate: '[角色设定]\n{{character}}\n\n[当前状态]\n{{variables}}\n\n[世界信息]\n{{lorebooks}}\n\n[格式要求]\n请严格按照以下XML标签输出回复：\n<thinking>思考过程（可选）</thinking>\n<maintext>剧情正文</maintext>\n<option>选项A\n选项B</option>\n<sum>简短总结</sum>\n<vars>{"变量名":新值}</vars>'
};
Yuki.ST.apiSettings = JSON.parse(JSON.stringify(Yuki.ST.DEFAULT_API));
Yuki.ST.loadApiSettings = function() {
  return Yuki.ST._dbGet('settings','api-settings').then(function(s) { if (s) Object.assign(Yuki.ST.apiSettings, s); });
};
Yuki.ST.saveApiSettings = function() {
  return Yuki.ST._dbPut('settings', Yuki.ST.apiSettings);
};

/* ── Lorebooks ── */
Yuki.ST.DEFAULT_LOREBOOK = {
  id:'default-lore',name:'雪之痕·世界设定',
  entries:[
    {id:'e1',keys:['雪菜','白羽'],content:'白羽雪菜，17岁，文学部成员。性格温柔内向，喜欢读书和热可可。住在车站附近的公寓里。',comment:'女主角',enabled:true,position:'before_char'},
    {id:'e2',keys:['奏','星野'],content:'星野奏，17岁，轻音部主唱兼吉他手。表面上开朗活泼，但内心深处藏着不为人知的伤痛。',comment:'第二女主角',enabled:true,position:'before_char'},
    {id:'e3',keys:['零','月島'],content:'月岛零，18岁，三年级前辈。天文部唯一成员。话不多但观察力敏锐，喜欢在深夜的天文台独自观星。',comment:'第三女主角',enabled:true,position:'before_char'},
    {id:'e4',keys:['车站','駅'],content:'故事的主要场景之一。位于小镇中心，是学生们上下学的必经之路。傍晚时分灯光特别温暖。',comment:'场景',enabled:true,position:'before_char'},
    {id:'e5',keys:['圣诞','圣诞节','12月'],content:'故事发生在12月圣诞季。小镇被白雪覆盖，到处装饰着圣诞灯饰。这是一个关于冬季恋爱的故事。',comment:'时间',enabled:true,position:'before_char'},
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
Yuki.ST.matchLorebooks = function(input) {
  var lower = input.toLowerCase(), activated = [];
  Yuki.ST.activeLorebookIds.forEach(function(lbId) {
    var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === lbId; });
    if (!lb) return;
    lb.entries.forEach(function(e) {
      if (!e.enabled) return;
      if (e.keys.some(function(k) { return lower.indexOf(k.toLowerCase()) >= 0; })) activated.push(e);
    });
  });
  return activated;
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

/* ── Game Variables ── */
Yuki.ST.variables = {
  chapter:'第一章',location:'车站前',time:'傍晚',weather:'雪',
  yukina_affection:62,kanade_affection:45,rei_affection:20,
  player_gold:12580,player_gems:34,flags:{}
};
Yuki.ST._varSnapshots = {};

Yuki.ST.getActiveCharacter = function() {
  return Yuki.ST.characterCards.find(function(c) { return c.id === Yuki.ST.activeCharacterId; }) || Yuki.ST.characterCards[0];
};
Yuki.ST.getVarsText = function() {
  return Object.entries(Yuki.ST.variables).filter(function(e) { return !e[0].startsWith('_'); }).map(function(e) { return e[0] + ': ' + (typeof e[1] === 'object' ? JSON.stringify(e[1]) : e[1]); }).join('\n');
};
Yuki.ST.mergeVars = function(jsonStr) {
  try { Object.assign(Yuki.ST.variables, JSON.parse(jsonStr)); } catch(e) {}
};
Yuki.ST.snapshotVars = function(msgId) {
  Yuki.ST._varSnapshots[msgId] = JSON.parse(JSON.stringify(Yuki.ST.variables));
};
Yuki.ST.rollbackVars = function(msgId) {
  if (Yuki.ST._varSnapshots[msgId]) Yuki.ST.variables = JSON.parse(JSON.stringify(Yuki.ST._varSnapshots[msgId]));
};

/* ── Prompt Assembler ── */
Yuki.ST.assemblePrompt = function(userInput, history) {
  var char = Yuki.ST.getActiveCharacter();
  var loreEntries = Yuki.ST.matchLorebooks(userInput);
  var loreText = loreEntries.map(function(e) { return e.content; }).join('\n');
  var prompt = Yuki.ST.apiSettings.formatPromptTemplate
    .replace('{{character}}', '【' + char.name + '】\n' + char.description + '\n性格：' + char.personality + '\n\n' + char.systemPrompt)
    .replace('{{variables}}', Yuki.ST.getVarsText())
    .replace('{{lorebooks}}', loreText || '（无激活的世界书条目）');
  var msgs = [{role:'system',content:prompt}];
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
  var result = {maintext:'',option:'',sum:'',vars:'',thinking:'',complete:false};
  var text = this.buffer;
  function extract(tag) {
    var openRegex = new RegExp('<'+tag+'>','i'), closeRegex = new RegExp('</'+tag+'>','i');
    var om = text.match(openRegex), cm = text.match(closeRegex);
    if (om && cm) { var s = om.index+om[0].length; return {content:text.slice(s,cm.index).trim(),complete:true}; }
    else if (om) { var s2 = om.index+om[0].length; return {content:text.slice(s2).trim(),complete:false}; }
    return {content:'',complete:false};
  }
  ['thinking','think','maintext','option','sum','vars'].forEach(function(tag) {
    var r = extract(tag);
    if (r.content) { result[tag==='think'?'thinking':tag] = r.content; if (r.complete) result.complete = true; }
  });
  return result;
};

/* ── AI Chat ── */
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
  var msgs = Yuki.ST.assemblePrompt(userInput, Yuki.ST.chatHistory);
  Yuki.ST.chatHistory.push({role:'user',content:userInput,id:'msg-'+Date.now(),timestamp:Date.now()});
  var dialogText = document.getElementById('dialog-text');
  document.getElementById('dialog-speaker-tag').textContent = Yuki.ST.getActiveCharacter().name;
  dialogText.textContent = '……'; dialogText.style.opacity = '0.5';

  fetch(Yuki.ST.apiSettings.primary.baseUrl + '/chat/completions', {
    method:'POST',
    headers:{'Authorization':'Bearer '+Yuki.ST.apiSettings.primary.apiKey,'Content-Type':'application/json'},
    body:JSON.stringify({model:Yuki.ST.apiSettings.primary.model,messages:msgs,temperature:0.8,max_tokens:1024,stream:true})
  }).then(function(resp) {
    if (!resp.ok) return resp.text().then(function(t) { throw new Error('API '+resp.status+': '+t); });
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
    return pump().then(function() {
      var parsed = (new Yuki.ST.StreamParser());
      parsed.feed(fullContent);
      var result = parsed.parse();
      var display = result.maintext || fullContent;
      dialogText.textContent = display; dialogText.style.opacity = '1';
      if (result.vars) Yuki.ST.mergeVars(result.vars);
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
    });
  }).catch(function(err) {
    console.error(err);
    dialogText.textContent = '……（连接中断）'; dialogText.style.opacity = '0.5';
    Yuki.UI.toast('AI 连接失败：' + err.message, 'error', 5000);
    document.getElementById('respond-hint').classList.add('visible');
    Yuki.ST.isStreaming = false;
  });
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
    messages:Yuki.ST.chatHistory,createdAt:Date.now(),characterId:Yuki.ST.activeCharacterId
  });
  Yuki.ST._dbPut('variables', {chatId:Yuki.ST.currentChatId,variables:Yuki.ST.variables});
};

/* ── SillyTavern Init ── */
Yuki.ST.init = function() {
  return Yuki.ST.openDB().then(function() {
    return Promise.all([Yuki.ST.loadApiSettings(), Yuki.ST.loadLorebooks(), Yuki.ST.loadCharacterCards()]);
  }).then(function() {
    Yuki.ST.initChat();
    console.log('%cSillyTavern Core %cloaded','color:#c4a15a;font-weight:bold;','color:#928ca0;');
    console.log('%c  API: '+ (Yuki.ST.apiSettings.primary.apiKey ? 'configured' : 'mock mode'),'color:#5c5770;');
  });
};
