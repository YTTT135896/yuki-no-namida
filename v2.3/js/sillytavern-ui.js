/* ═══════════════════════════════════════════════════
   SILLYTAVERN UI — API, Lorebook, Variables, Chat modals
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.ST_UI = {};

/* ── API Settings ── */
Yuki.ST_UI.openApi = function() {
  document.getElementById('api-primary-url').value = Yuki.ST.apiSettings.primary.baseUrl;
  document.getElementById('api-primary-key').value = Yuki.ST.apiSettings.primary.apiKey;
  document.getElementById('api-primary-model').value = Yuki.ST.apiSettings.primary.model;
  document.getElementById('api-secondary-url').value = Yuki.ST.apiSettings.secondary.baseUrl;
  document.getElementById('api-secondary-key').value = Yuki.ST.apiSettings.secondary.apiKey;
  document.getElementById('api-secondary-model').value = Yuki.ST.apiSettings.secondary.model;
  var tog = document.getElementById('api-secondary-toggle');
  if (Yuki.ST.apiSettings.secondary.enabled) { tog.classList.add('on'); tog.setAttribute('aria-checked','true'); }
  else { tog.classList.remove('on'); tog.setAttribute('aria-checked','false'); }
  Yuki.ST_UI._toggleSecondary(Yuki.ST.apiSettings.secondary.enabled);
  Yuki.UI.modal.open('api-settings');
};

Yuki.ST_UI._toggleSecondary = function(en) {
  ['api-secondary-url','api-secondary-key','api-secondary-model'].forEach(function(id) { document.getElementById(id).disabled = !en; });
};

Yuki.ST_UI.initApiSettings = function() {
  document.getElementById('api-secondary-toggle').addEventListener('click', function() {
    this.classList.toggle('on'); var en = this.classList.contains('on'); this.setAttribute('aria-checked', en); Yuki.ST_UI._toggleSecondary(en);
  });
  document.getElementById('api-save-btn').addEventListener('click', function() {
    Yuki.ST.apiSettings.primary.baseUrl = document.getElementById('api-primary-url').value || Yuki.ST.DEFAULT_API.primary.baseUrl;
    Yuki.ST.apiSettings.primary.apiKey = document.getElementById('api-primary-key').value;
    Yuki.ST.apiSettings.primary.model = document.getElementById('api-primary-model').value || Yuki.ST.DEFAULT_API.primary.model;
    Yuki.ST.apiSettings.secondary.enabled = document.getElementById('api-secondary-toggle').classList.contains('on');
    Yuki.ST.apiSettings.secondary.baseUrl = document.getElementById('api-secondary-url').value;
    Yuki.ST.apiSettings.secondary.apiKey = document.getElementById('api-secondary-key').value;
    Yuki.ST.apiSettings.secondary.model = document.getElementById('api-secondary-model').value;
    Yuki.ST.saveApiSettings().then(function() { Yuki.UI.modal.close('api-settings'); Yuki.UI.toast('API 设置已保存', 'success', 2500); });
  });
  document.getElementById('api-test-btn').addEventListener('click', function() {
    var url = document.getElementById('api-primary-url').value, key = document.getElementById('api-primary-key').value, model = document.getElementById('api-primary-model').value;
    if (!key) { Yuki.UI.toast('请先填写 API Key', 'warning', 3000); return; }
    Yuki.UI.toast('正在测试连接……', 'info', 2000);
    fetch(url+'/chat/completions', {method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:model,messages:[{role:'user',content:'你好'}],max_tokens:5})})
      .then(function(r) { return r.ok ? Yuki.UI.toast('连接成功！API 可用', 'success', 3000) : r.text().then(function(e) { Yuki.UI.toast('连接失败：'+r.status, 'error', 5000); }); })
      .catch(function(e) { Yuki.UI.toast('网络错误：'+e.message, 'error', 5000); });
  });
};

/* ── Lorebook ── */
Yuki.ST_UI._selBookId = null;

Yuki.ST_UI.openLorebook = function() {
  Yuki.UI.modal.open('lorebook');
  Yuki.ST_UI._renderBookList();
};

Yuki.ST_UI._renderBookList = function() {
  var list = document.getElementById('lb-book-list');
  list.innerHTML = Yuki.ST.lorebooks.map(function(lb) {
    var active = Yuki.ST.activeLorebookIds.indexOf(lb.id) >= 0;
    var sel = lb.id === Yuki.ST_UI._selBookId ? ' active' : '';
    return '<div class="lb-book-item'+(active?' has-active':'')+sel+'" data-lb-id="'+lb.id+'" onclick="Yuki.ST_UI._selectBook(\''+lb.id+'\')"><span class="active-dot"></span>'+lb.name+'</div>';
  }).join('');
};

Yuki.ST_UI._selectBook = function(id) {
  Yuki.ST_UI._selBookId = id;
  Yuki.ST_UI._renderBookList();
  var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === id; });
  if (!lb) { document.getElementById('lb-empty-state').style.display='flex'; document.getElementById('lb-editor').style.display='none'; return; }
  document.getElementById('lb-empty-state').style.display='none';
  document.getElementById('lb-editor').style.display='block';
  document.getElementById('lb-book-name').value = lb.name;
  document.getElementById('lb-active-check').checked = Yuki.ST.activeLorebookIds.indexOf(id) >= 0;
  Yuki.ST_UI._renderEntries(lb);
};

Yuki.ST_UI._renderEntries = function(lb) {
  document.getElementById('lb-entries-list').innerHTML = lb.entries.map(function(entry) {
    var posBefore = entry.position !== 'after_char';
    return '<div class="lb-entry-card"><div class="lb-entry-header"><button class="lb-entry-toggle'+(entry.enabled?' on':'')+'" onclick="Yuki.ST_UI._toggleEntry(\''+lb.id+'\',\''+entry.id+'\')"></button><div class="lb-entry-keywords"><input type="text" value="'+entry.keys.join(', ')+'" placeholder="关键词（逗号分隔）" onchange="Yuki.ST_UI._updateEntry(\''+lb.id+'\',\''+entry.id+'\',\'keys\',this.value)"></div><select class="inv-sort-select" style="font-size:.65rem;padding:2px 6px" onchange="Yuki.ST_UI._updateEntry(\''+lb.id+'\',\''+entry.id+'\',\'position\',this.value)"><option value="before_char"'+(posBefore?' selected':'')+'>角色前</option><option value="after_char"'+(!posBefore?' selected':'')+'>角色后</option></select><button class="lb-entry-delete" onclick="Yuki.ST_UI._deleteEntry(\''+lb.id+'\',\''+entry.id+'\')"><span class="material-symbols-rounded" style="font-size:1rem">close</span></button></div><div class="lb-entry-content"><textarea placeholder="条目内容" onchange="Yuki.ST_UI._updateEntry(\''+lb.id+'\',\''+entry.id+'\',\'content\',this.value)">'+entry.content+'</textarea></div><div class="lb-entry-comment">'+(entry.comment||'')+'</div></div>';
  }).join('');
};

Yuki.ST_UI._toggleEntry = function(lbId, eId) {
  var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === lbId; }); if (!lb) return;
  var e = lb.entries.find(function(x) { return x.id === eId; }); if (!e) return;
  e.enabled = !e.enabled; Yuki.ST.saveLorebooks(); Yuki.ST_UI._selectBook(lbId);
};

Yuki.ST_UI._updateEntry = function(lbId, eId, field, val) {
  var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === lbId; }); if (!lb) return;
  var e = lb.entries.find(function(x) { return x.id === eId; }); if (!e) return;
  if (field==='keys') e.keys = val.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  else if (field==='content') e.content = val;
  else if (field==='position') e.position = val;
  Yuki.ST.saveLorebooks();
};

Yuki.ST_UI._deleteEntry = function(lbId, eId) {
  var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === lbId; }); if (!lb) return;
  lb.entries = lb.entries.filter(function(e) { return e.id !== eId; });
  Yuki.ST.saveLorebooks(); Yuki.ST_UI._selectBook(lbId);
};

Yuki.ST_UI.initLorebook = function() {
  document.getElementById('lb-add-entry-btn').addEventListener('click', function() {
    var lb = Yuki.ST.lorebooks.find(function(l) { return l.id === Yuki.ST_UI._selBookId; }); if (!lb) return;
    lb.entries.push({id:'e'+Date.now(),keys:[],content:'',comment:'',enabled:true,position:'before_char'});
    Yuki.ST.saveLorebooks(); Yuki.ST_UI._selectBook(Yuki.ST_UI._selBookId);
  });
  document.getElementById('lb-new-book-btn').addEventListener('click', function() {
    var name = prompt('世界书名称：', '新世界书'); if (!name) return;
    var nl = {id:'lb-'+Date.now(),name:name,entries:[]};
    Yuki.ST.lorebooks.push(nl); Yuki.ST.activeLorebookIds.push(nl.id);
    Yuki.ST.saveLorebooks(); Yuki.ST_UI._selBookId = nl.id; Yuki.ST_UI._renderBookList(); Yuki.ST_UI._selectBook(nl.id);
  });
  document.getElementById('lb-delete-book-btn').addEventListener('click', function() {
    if (!Yuki.ST_UI._selBookId) return;
    if (!confirm('确定要删除此世界书吗？')) return;
    Yuki.ST.lorebooks = Yuki.ST.lorebooks.filter(function(l) { return l.id !== Yuki.ST_UI._selBookId; });
    Yuki.ST.activeLorebookIds = Yuki.ST.activeLorebookIds.filter(function(id) { return id !== Yuki.ST_UI._selBookId; });
    Yuki.ST.saveLorebooks(); Yuki.ST_UI._selBookId = null;
    document.getElementById('lb-empty-state').style.display='flex'; document.getElementById('lb-editor').style.display='none';
    Yuki.ST_UI._renderBookList(); Yuki.UI.toast('世界书已删除', 'warning', 2000);
  });
  document.getElementById('lb-active-check').addEventListener('change', function() {
    var id = Yuki.ST_UI._selBookId; if (!id) return;
    if (this.checked) { if (Yuki.ST.activeLorebookIds.indexOf(id) < 0) Yuki.ST.activeLorebookIds.push(id); }
    else Yuki.ST.activeLorebookIds = Yuki.ST.activeLorebookIds.filter(function(i) { return i !== id; });
    Yuki.ST.saveLorebooks(); Yuki.ST_UI._renderBookList();
  });
  document.getElementById('lb-import-btn').addEventListener('click', function() {
    var inp = document.createElement('input'); inp.type='file'; inp.accept='.json';
    inp.onchange = function(e) {
      var file = e.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try { var data = JSON.parse(ev.target.result);
          if (data.lorebooks) { data.lorebooks.forEach(function(lb) { var ex = Yuki.ST.lorebooks.find(function(l) { return l.id===lb.id; }); if (ex) Object.assign(ex, lb); else Yuki.ST.lorebooks.push(lb); }); }
          Yuki.ST.saveLorebooks(); Yuki.ST_UI._renderBookList(); Yuki.UI.toast('已导入世界书', 'success', 3000);
        } catch(ex) { Yuki.UI.toast('无效的 JSON', 'error', 3000); }
      };
      reader.readAsText(file);
    };
    inp.click();
  });
  document.getElementById('lb-export-btn').addEventListener('click', function() {
    var data = {lorebooks:Yuki.ST.lorebooks,activeLorebookIds:Yuki.ST.activeLorebookIds,exportedAt:new Date().toISOString()};
    var blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'yuki-lorebooks.json'; a.click();
    Yuki.UI.toast('世界书已导出', 'success', 2000);
  });
};

/* ── Variables ── */
Yuki.ST_UI.openVariables = function() {
  Yuki.UI.modal.open('variables');
  Yuki.ST_UI._renderVars();
};

Yuki.ST_UI._renderVars = function() {
  var list = document.getElementById('var-list');
  list.innerHTML = Object.entries(Yuki.ST.variables).filter(function(e) { return !e[0].startsWith('_') && typeof Yuki.ST.variables[e[0]] !== 'object'; }).map(function(e) {
    return '<div class="var-row"><span class="var-key">'+e[0]+'</span><input class="var-value" value="'+e[1]+'" data-var-key="'+e[0]+'" onchange="Yuki.ST_UI._updateVar(\''+e[0]+'\',this.value)"><button class="var-delete-btn" onclick="Yuki.ST_UI._deleteVar(\''+e[0]+'\')"><span class="material-symbols-rounded" style="font-size:1rem">close</span></button></div>';
  }).join('');
};

Yuki.ST_UI._updateVar = function(key, val) { var n = Number(val); Yuki.ST.variables[key] = isNaN(n) ? val : n; };
Yuki.ST_UI._deleteVar = function(key) {
  if (['chapter','location','time','weather'].indexOf(key) >= 0) { Yuki.UI.toast('核心变量不可删除', 'warning', 2000); return; }
  delete Yuki.ST.variables[key]; Yuki.ST_UI._renderVars();
};

Yuki.ST_UI.initVariables = function() {
  document.getElementById('var-add-btn').addEventListener('click', function() {
    var k = document.getElementById('var-new-key').value.trim(), v = document.getElementById('var-new-value').value.trim();
    if (!k) { Yuki.UI.toast('请输入变量名', 'warning', 2000); return; }
    var n = Number(v); Yuki.ST.variables[k] = isNaN(n) ? v : n;
    document.getElementById('var-new-key').value = ''; document.getElementById('var-new-value').value = '';
    Yuki.ST_UI._renderVars(); Yuki.UI.toast('变量 '+k+' 已添加', 'success', 2000);
  });
};

/* ── Chat Manager ── */
Yuki.ST_UI.openChatMgr = function() {
  Yuki.UI.modal.open('chat-manager');
  Yuki.ST_UI._renderChats();
};

Yuki.ST_UI._renderChats = function() {
  Yuki.ST._dbGetAll('chats').then(function(chats) {
    var list = document.getElementById('chat-list');
    if (!chats.length) { list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim)">暂无对话记录</div>'; return; }
    document.getElementById('chat-current-char').textContent = Yuki.ST.getActiveCharacter().name;
    list.innerHTML = chats.sort(function(a,b) { return b.createdAt - a.createdAt; }).map(function(chat) {
      var isActive = chat.id === Yuki.ST.currentChatId;
      return '<div class="chat-session-card'+(isActive?' active':'')+'"><div class="chat-session-info" onclick="Yuki.ST_UI._switchChat(\''+chat.id+'\')"><div class="chat-session-name">'+(chat.name||'未命名')+'</div><div class="chat-session-meta"><span>'+(chat.messages?chat.messages.length:0)+' 条</span><span>'+new Date(chat.createdAt).toLocaleString('zh-CN')+'</span></div></div><div class="chat-session-actions"><button class="chat-session-action" onclick="event.stopPropagation();Yuki.ST_UI._branchChat(\''+chat.id+'\')"><span class="material-symbols-rounded" style="font-size:1rem">call_split</span></button><button class="chat-session-action danger" onclick="event.stopPropagation();Yuki.ST_UI._removeChat(\''+chat.id+'\')"><span class="material-symbols-rounded" style="font-size:1rem">delete</span></button></div></div>';
    }).join('');
  });
};

Yuki.ST_UI._switchChat = function(chatId) {
  Yuki.ST._dbGet('chats', chatId).then(function(chat) {
    if (!chat) return;
    Yuki.ST.currentChatId = chat.id; Yuki.ST.chatHistory = chat.messages || [];
    Yuki.ST.activeCharacterId = chat.characterId || 'char-yukina';
    return Yuki.ST._dbGet('variables', chatId);
  }).then(function(vars) {
    if (vars) Yuki.ST.variables = vars.variables;
    Yuki.UI.modal.close('chat-manager');
    Yuki.UI.toast('已切换到对话', 'success', 2000);
    if (Yuki.ST.chatHistory.length) {
      var last = Yuki.ST.chatHistory[Yuki.ST.chatHistory.length-1];
      document.getElementById('dialog-speaker-tag').textContent = Yuki.ST.getActiveCharacter().name;
      document.getElementById('dialog-text').textContent = last.content;
      document.getElementById('dialog-text').style.opacity = '1';
    }
  });
};

Yuki.ST_UI._branchChat = function(chatId) {
  Yuki.ST._dbGet('chats', chatId).then(function(chat) {
    if (!chat) return;
    Yuki.ST.chatHistory = chat.messages || [];
    Yuki.ST.currentChatId = 'chat-'+Date.now();
    Yuki.ST._saveChat();
    Yuki.ST_UI._renderChats();
    Yuki.UI.toast('已创建分支对话', 'info', 2000);
  });
};

Yuki.ST_UI._removeChat = function(chatId) {
  if (!confirm('确定删除此对话？')) return;
  Yuki.ST._dbDelete('chats', chatId);
  Yuki.ST._dbDelete('variables', chatId);
  if (Yuki.ST.currentChatId === chatId) { Yuki.ST.currentChatId = null; Yuki.ST.chatHistory = []; }
  Yuki.ST_UI._renderChats();
  Yuki.UI.toast('对话已删除', 'warning', 2000);
};

Yuki.ST_UI.initChatMgr = function() {
  document.getElementById('chat-new-btn').addEventListener('click', function() {
    Yuki.ST.initChat();
    Yuki.UI.modal.close('chat-manager');
    Yuki.UI.toast('新对话已创建', 'success', 2000);
    document.getElementById('respond-hint').classList.add('visible');
  });
};

/* ── Preset Manager ── */
Yuki.ST_UI._selPresetId = null;

Yuki.ST_UI.openPresets = function() {
  Yuki.UI.modal.open('presets');
  Yuki.ST_UI._renderPresetList();
};

Yuki.ST_UI._renderPresetList = function() {
  var list = document.getElementById('preset-list');
  var activePid = Yuki.ST.apiSettings.activePresetId || 'preset-default';
  list.innerHTML = Yuki.ST.presets.map(function(p) {
    var isActive = p.id === activePid;
    var isSel = p.id === Yuki.ST_UI._selPresetId;
    return '<div class="preset-card' + (isActive ? ' active' : '') + (isSel ? ' selected' : '') + '" onclick="Yuki.ST_UI._selectPreset(\'' + p.id + '\')"><div class="preset-card-info"><div class="preset-card-name">' + p.name + (isActive ? ' <span style="color:var(--accent-gold);font-size:.65rem">当前</span>' : '') + '</div><div class="preset-card-meta"><span>T:' + p.temperature + '</span><span>Max:' + p.maxTokens + '</span></div></div><div class="preset-card-actions"><button class="chat-session-action" onclick="event.stopPropagation();Yuki.ST_UI._activatePreset(\'' + p.id + '\')" title="激活"><span class="material-symbols-rounded" style="font-size:1rem">check_circle</span></button></div></div>';
  }).join('');
};

Yuki.ST_UI._selectPreset = function(id) {
  Yuki.ST_UI._selPresetId = id;
  Yuki.ST_UI._renderPresetList();
  var p = Yuki.ST.presets.find(function(x) { return x.id === id; });
  if (!p) { document.getElementById('preset-empty-state').style.display='flex'; document.getElementById('preset-editor').style.display='none'; return; }
  document.getElementById('preset-empty-state').style.display='none';
  document.getElementById('preset-editor').style.display='block';
  document.getElementById('preset-edit-name').value = p.name;
  document.getElementById('preset-edit-system-prompt').value = p.systemPrompt || '';
  document.getElementById('preset-edit-template').value = p.formatTemplate || '';
  document.getElementById('preset-edit-author-note').value = Yuki.ST.authorNote || '';
  document.getElementById('preset-edit-temp').value = p.temperature;
  document.getElementById('preset-edit-max-tokens').value = p.maxTokens;
  document.getElementById('preset-edit-top-p').value = p.topP;
  document.getElementById('preset-edit-freq-pen').value = p.frequencyPenalty;
  document.getElementById('preset-edit-pres-pen').value = p.presencePenalty;
  document.getElementById('preset-temp-val').textContent = p.temperature;
};

Yuki.ST_UI._activatePreset = function(id) {
  Yuki.ST.apiSettings.activePresetId = id;
  Yuki.ST.saveApiSettings();
  Yuki.ST_UI._renderPresetList();
  Yuki.UI.toast('已激活预设：' + (Yuki.ST.presets.find(function(p) { return p.id===id; })||{}).name, 'success', 2000);
};

Yuki.ST_UI.initPresets = function() {
  document.getElementById('preset-new-btn').addEventListener('click', function() {
    var name = prompt('预设名称：', '新预设');
    if (!name) return;
    var np = {id:'preset-'+Date.now(),name:name,systemPrompt:'',formatTemplate:Yuki.ST.DEFAULT_PRESETS[0].formatTemplate,temperature:0.8,maxTokens:1024,topP:1,frequencyPenalty:0,presencePenalty:0};
    Yuki.ST.presets.push(np);
    Yuki.ST.savePresets();
    Yuki.ST_UI._selPresetId = np.id;
    Yuki.ST_UI._renderPresetList();
    Yuki.ST_UI._selectPreset(np.id);
  });
  document.getElementById('preset-save-btn').addEventListener('click', function() {
    if (!Yuki.ST_UI._selPresetId) return;
    var p = Yuki.ST.presets.find(function(x) { return x.id === Yuki.ST_UI._selPresetId; });
    if (!p) return;
    p.name = document.getElementById('preset-edit-name').value;
    p.systemPrompt = document.getElementById('preset-edit-system-prompt').value;
    p.formatTemplate = document.getElementById('preset-edit-template').value;
    p.temperature = parseFloat(document.getElementById('preset-edit-temp').value);
    p.maxTokens = parseInt(document.getElementById('preset-edit-max-tokens').value);
    p.topP = parseFloat(document.getElementById('preset-edit-top-p').value);
    p.frequencyPenalty = parseFloat(document.getElementById('preset-edit-freq-pen').value);
    p.presencePenalty = parseFloat(document.getElementById('preset-edit-pres-pen').value);
    Yuki.ST.authorNote = document.getElementById('preset-edit-author-note').value;
    Yuki.ST.savePresets();
    Yuki.ST_UI._renderPresetList();
    Yuki.UI.toast('预设「' + p.name + '」已保存', 'success', 2000);
  });
  document.getElementById('preset-delete-btn').addEventListener('click', function() {
    if (!Yuki.ST_UI._selPresetId) return;
    if (Yuki.ST.presets.length <= 1) { Yuki.UI.toast('至少保留一个预设', 'warning', 2000); return; }
    if (!confirm('删除此预设？')) return;
    Yuki.ST.presets = Yuki.ST.presets.filter(function(p) { return p.id !== Yuki.ST_UI._selPresetId; });
    if (Yuki.ST.apiSettings.activePresetId === Yuki.ST_UI._selPresetId) Yuki.ST.apiSettings.activePresetId = Yuki.ST.presets[0].id;
    Yuki.ST.savePresets(); Yuki.ST.saveApiSettings();
    Yuki.ST_UI._selPresetId = null;
    document.getElementById('preset-empty-state').style.display='flex';
    document.getElementById('preset-editor').style.display='none';
    Yuki.ST_UI._renderPresetList();
    Yuki.UI.toast('预设已删除', 'warning', 2000);
  });
  document.getElementById('preset-edit-temp').addEventListener('input', function() {
    document.getElementById('preset-temp-val').textContent = this.value;
  });
  document.getElementById('preset-import-btn').addEventListener('click', function() {
    var inp = document.createElement('input'); inp.type='file'; inp.accept='.json';
    inp.onchange = function(e) {
      var file = e.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try { var data = JSON.parse(ev.target.result);
          if (Array.isArray(data)) { data.forEach(function(p) { if (!p.id) p.id = 'preset-'+Date.now()+Math.random(); Yuki.ST.presets.push(p); }); }
          else if (data.presets) { data.presets.forEach(function(p) { Yuki.ST.presets.push(p); }); }
          Yuki.ST.savePresets(); Yuki.ST_UI._renderPresetList();
          Yuki.UI.toast('预设已导入', 'success', 3000);
        } catch(ex) { Yuki.UI.toast('无效的 JSON', 'error', 3000); }
      };
      reader.readAsText(file);
    };
    inp.click();
  });
};

/* ── Nav wiring ── */
Yuki.ST_UI.initNav = function() {
  var navItems = document.querySelector('.nav-items');
  var backDiv = document.querySelector('#nav-back-to-title').previousElementSibling;
  function addItem(id, icon, label, handler) {
    var d = document.createElement('div'); d.className = 'nav-item'; d.id = id;
    d.innerHTML = '<span class="material-symbols-rounded">'+icon+'</span>'+label;
    d.addEventListener('click', function() { Yuki.UI.nav.close(); handler(); });
    backDiv.before(d);
  }
  addItem('nav-api-settings', 'api', 'API 设置', Yuki.ST_UI.openApi);
  addItem('nav-lorebook', 'menu_book', '世界书', Yuki.ST_UI.openLorebook);
  addItem('nav-variables', 'database', '游戏变量', Yuki.ST_UI.openVariables);
  addItem('nav-presets', 'tune', '预设管理', Yuki.ST_UI.openPresets);
  addItem('nav-chat-history', 'chat_bubble', '对话管理', Yuki.ST_UI.openChatMgr);
  var div = document.createElement('div'); div.className = 'nav-divider'; backDiv.before(div);

  // Listen for nav-characters to trigger gallery too
  document.getElementById('nav-characters').addEventListener('click', function() { /* handled by data-target */ });
};

/* ── Init all ST UI ── */
Yuki.ST_UI.init = function() {
  Yuki.ST_UI.initApiSettings();
  Yuki.ST_UI.initLorebook();
  Yuki.ST_UI.initVariables();
  Yuki.ST_UI.initChatMgr();
  Yuki.ST_UI.initPresets();
  Yuki.ST_UI.initNav();
  console.log('%cSillyTavern UI %cloaded', 'color:#c4a15a;', 'color:#928ca0;');
};
