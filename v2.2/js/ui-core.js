/* ═══════════════════════════════════════════════════
   UI CORE — Loading, Title, Dialog, Nav, Modal, Toast
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.UI = {};

/* ── Loading Screen ── */
Yuki.UI.initLoading = function() {
  const screen = document.getElementById('loading-screen');
  const bar = document.getElementById('loading-progress-bar');
  const status = document.getElementById('loading-status-text');
  let progress = 0;
  const stages = [
    { pct: 15, text: '正在准备……' },
    { pct: 35, text: '加载字体资源……' },
    { pct: 60, text: '初始化数据引擎……' },
    { pct: 85, text: '渲染游戏界面……' },
    { pct: 100, text: '准备就绪' },
  ];
  let stageIdx = 0;

  function setProgress(pct, txt) {
    function step() {
      if (progress < pct) { progress = Math.min(pct, progress + 1.2); bar.style.width = progress + '%'; requestAnimationFrame(step); }
      else bar.style.width = pct + '%';
    }
    step();
    if (txt) status.textContent = txt;
  }
  function advance() { if (stageIdx < stages.length) { const s = stages[stageIdx]; setProgress(s.pct, s.text); stageIdx++; } }
  advance();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { advance(); setTimeout(advance, 180); setTimeout(advance, 500); setTimeout(finish, 750); })
      .catch(() => { setTimeout(advance, 200); setTimeout(advance, 400); setTimeout(advance, 600); setTimeout(finish, 800); });
  } else {
    setTimeout(advance, 200); setTimeout(advance, 500); setTimeout(advance, 800); setTimeout(finish, 1000);
  }

  function finish() {
    setProgress(100, '准备就绪');
    setTimeout(() => { screen.classList.add('hidden'); }, 350);
  }
  setTimeout(() => { if (!screen.classList.contains('hidden')) { setProgress(100, '准备就绪'); setTimeout(() => screen.classList.add('hidden'), 200); } }, 5000);
};

/* ── Title Screen ── */
Yuki.UI.titleScreen = {
  hide: function() {
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-container').style.opacity = '1';
    document.getElementById('quick-save-fab').classList.add('visible');
    Yuki.UI.toast('故事开始了……', 'info', 2500);
  },
  show: function() {
    document.getElementById('title-screen').classList.remove('hidden');
    document.getElementById('game-container').style.opacity = '0';
    document.getElementById('quick-save-fab').classList.remove('visible');
  }
};

Yuki.UI.initTitle = function() {
  document.getElementById('game-container').style.opacity = '0';
  document.getElementById('quick-save-fab').classList.remove('visible');
  document.getElementById('title-new-game').addEventListener('click', () => { Yuki.UI.titleScreen.hide(); Yuki.UI.dialog.reset(); });
  document.getElementById('title-continue').addEventListener('click', () => {
    Yuki.UI.modal.open('save');
    setTimeout(() => { const t = document.querySelector('.save-tab[data-save-tab="load"]'); if (t) t.click(); }, 150);
  });
  document.getElementById('title-cg').addEventListener('click', () => Yuki.UI.modal.open('gallery'));
  document.getElementById('title-settings-btn').addEventListener('click', () => Yuki.UI.modal.open('settings'));
};

/* ── Toast ── */
Yuki.UI.toast = function(msg, type, duration) {
  type = type || 'info'; duration = duration || Yuki.CONFIG.TOAST_DURATION;
  const cfg = { info:{icon:'info'}, success:{icon:'check_circle'}, warning:{icon:'warning'}, error:{icon:'error'}, affection:{icon:'favorite'} };
  const c = cfg[type] || cfg.info;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span class="material-symbols-rounded toast-icon">${c.icon}</span><span class="toast-msg">${msg}</span><button class="toast-close" aria-label="关闭">&times;</button>`;
  document.getElementById('toast-container').appendChild(el);
  if (document.getElementById('toast-container').children.length > 5) {
    const old = document.getElementById('toast-container').firstElementChild;
    if (old) { clearTimeout(old._t); old.classList.add('removing'); old.addEventListener('animationend', () => { if (old.parentNode) old.remove(); }, { once: true }); }
  }
  const timer = setTimeout(() => { el.classList.add('removing'); el.addEventListener('animationend', () => { if (el.parentNode) el.remove(); }, { once: true }); }, duration);
  el._t = timer;
  el.querySelector('.toast-close').addEventListener('click', () => { clearTimeout(timer); el.classList.add('removing'); el.addEventListener('animationend', () => { if (el.parentNode) el.remove(); }, { once: true }); });
};

/* ── Modal Manager ── */
Yuki.UI.modal = {
  _active: null,
  open: function(name) {
    if (this._active) this.close(this._active);
    const overlay = document.getElementById('modal-' + name);
    if (!overlay) return;
    overlay.classList.add('active'); this._active = name;
    document.body.style.overflow = 'hidden';
  },
  close: function(name) {
    const overlay = document.getElementById('modal-' + name);
    if (!overlay) return;
    overlay.classList.remove('active');
    if (this._active === name) this._active = null;
    document.body.style.overflow = '';
  },
  closeAll: function() {
    document.querySelectorAll('.modal-overlay.active').forEach(o => o.classList.remove('active'));
    this._active = null; document.body.style.overflow = '';
  }
};

Yuki.UI.initModals = function() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => { const t = btn.dataset.close; if (t) Yuki.UI.modal.close(t); });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { const n = overlay.id.replace('modal-', ''); Yuki.UI.modal.close(n); } });
  });
};

/* ── Navigation ── */
Yuki.UI.nav = {
  open: function() {
    document.getElementById('nav-drawer').classList.add('active');
    document.getElementById('nav-overlay').classList.add('active');
  },
  close: function() {
    document.getElementById('nav-drawer').classList.remove('active');
    document.getElementById('nav-overlay').classList.remove('active');
  }
};

Yuki.UI.initNav = function() {
  document.getElementById('nav-toggle-btn').addEventListener('click', Yuki.UI.nav.open);
  document.getElementById('nav-overlay').addEventListener('click', Yuki.UI.nav.close);
  document.querySelectorAll('.nav-item[data-target]').forEach(item => {
    item.addEventListener('click', () => {
      Yuki.UI.nav.close(); Yuki.UI.modal.open(item.dataset.target);
      document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
      item.classList.add('active');
    });
  });
  // Back to title
  document.getElementById('nav-back-to-title').addEventListener('click', () => {
    Yuki.UI.nav.close(); Yuki.UI.modal.closeAll();
    if (document.getElementById('cg-viewer-overlay').classList.contains('active')) Yuki.UI.gallery.closeViewer();
    if (document.getElementById('history-panel').classList.contains('active')) Yuki.UI.history.close();
    Yuki.UI.titleScreen.show();
    Yuki.UI.toast('已返回主界面', 'info', 2000);
  });
};

/* ── Dialog System ── */
Yuki.UI.dialog = {
  _script: [...Yuki.DIALOG_SCRIPT],
  _index: 0,
  _timer: null,
  _typing: false,
  _complete: false,

  reset: function() { this._index = 0; this._script = [...Yuki.DIALOG_SCRIPT]; this.show(this._index); },

  show: function(idx) {
    if (idx >= this._script.length) { this._index = this._script.length - 1; this._complete = true; this._showRespondHint(); return; }
    const line = this._script[idx];
    document.getElementById('dialog-speaker-tag').textContent = line.speaker;
    document.getElementById('dialog-advance-hint').style.opacity = '0';
    this._typewrite(document.getElementById('dialog-text'), line.text, Yuki.CONFIG.TYPEWRITER_SPEED, () => {
      if (idx < this._script.length - 1) document.getElementById('dialog-advance-hint').style.opacity = '1';
      else this._showRespondHint();
    });
  },

  _typewrite: function(el, text, speed, cb) {
    clearTimeout(this._timer); this._typing = true; this._complete = false;
    this._hideRespondHint(); this._hideLlmInput();
    el.textContent = ''; el.style.opacity = '0.6';
    let i = 0;
    const type = () => {
      if (i < text.length) { el.textContent += text.charAt(i); i++; this._timer = setTimeout(type, speed); }
      else { el.style.opacity = '1'; this._typing = false; this._complete = true; if (cb) cb(); }
    };
    type();
  },

  _showRespondHint: function() {
    document.getElementById('respond-hint').classList.add('visible');
    document.getElementById('dialog-advance-hint').style.opacity = '0';
  },
  _hideRespondHint: function() { document.getElementById('respond-hint').classList.remove('visible'); },
  _showLlmInput: function() {
    document.getElementById('llm-input-area').classList.add('visible');
    this._hideRespondHint();
    setTimeout(() => document.getElementById('llm-input').focus(), 400);
  },
  _hideLlmInput: function() { document.getElementById('llm-input-area').classList.remove('visible'); },

  _onDialogClick: function(e) {
    if (e.target.closest('.dialog-controls') || e.target.closest('.dialog-ctrl-btn')) return;
    if (this._typing) {
      clearTimeout(this._timer);
      document.getElementById('dialog-text').textContent = this._script[this._index].text;
      document.getElementById('dialog-text').style.opacity = '1';
      this._typing = false; this._complete = true;
      if (this._index >= this._script.length - 1) this._showRespondHint();
      else document.getElementById('dialog-advance-hint').style.opacity = '1';
    } else if (this._complete && this._index >= this._script.length - 1) {
      this._showLlmInput();
    } else { this._index++; this.show(this._index); }
  }
};

Yuki.UI.initDialog = function() {
  document.getElementById('dialog-box').addEventListener('click', (e) => Yuki.UI.dialog._onDialogClick(e));
  document.getElementById('respond-hint').addEventListener('click', (e) => { e.stopPropagation(); if (Yuki.UI.dialog._complete) Yuki.UI.dialog._showLlmInput(); });
  document.getElementById('skip-btn').addEventListener('click', function() { this.classList.toggle('active'); Yuki.UI.toast(this.classList.contains('active') ? '快进：开启' : '快进：关闭', 'info', 1500); });
  document.getElementById('auto-btn').addEventListener('click', function() { this.classList.toggle('active'); Yuki.UI.toast(this.classList.contains('active') ? '自动：开启' : '自动：关闭', 'info', 1500); });
  Yuki.UI.dialog.show(0);
};

/* ── LLM Input ── */
Yuki.UI.initLlmInput = function() {
  const input = document.getElementById('llm-input');
  document.getElementById('llm-send-btn').addEventListener('click', () => Yuki.UI._sendLlm());
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') Yuki.UI._sendLlm(); });
};

Yuki.UI._sendLlm = function() {
  const input = document.getElementById('llm-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  Yuki.UI.dialog._hideLlmInput();
  if (Yuki.ST && Yuki.ST.sendToAI) {
    Yuki.UI.toast('正在生成回复……', 'info', 1500);
    Yuki.ST.sendToAI(msg);
  } else {
    Yuki.UI.toast('消息已发送（模拟 · 请配置API Key）', 'info', 3000);
    Yuki.UI.dialog._script.push({ speaker:'悠', text:msg });
    const responses = [
      { speaker:'雪菜', text:'「嗯……你说得对呢。」她微微侧头，似乎在思考着什么。「我会……好好考虑的。」' },
      { speaker:'雪菜', text:'她沉默了片刻，然后轻轻点头。「原来你是这样想的啊。谢谢你告诉我。」' },
    ];
    Yuki.UI.dialog._script.push(responses[Math.floor(Math.random() * responses.length)]);
    Yuki.UI.dialog._index = Yuki.UI.dialog._script.length - 2;
    Yuki.UI.dialog.show(Yuki.UI.dialog._index);
  }
};

/* ── Keyboard Handler ── */
Yuki.UI.initKeyboard = function() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('cg-viewer-overlay').classList.contains('active')) { Yuki.UI.gallery.closeViewer(); return; }
      if (document.getElementById('item-detail-overlay').classList.contains('active')) { Yuki.UI.inventory.closeDetail(); return; }
      if (document.getElementById('clothing-detail-popup').classList.contains('active')) { Yuki.Features.wardrobe.closeClothingDetail(); return; }
      if (document.getElementById('history-panel').classList.contains('active')) { Yuki.UI.history.close(); return; }
      if (document.getElementById('nav-drawer').classList.contains('active')) { Yuki.UI.nav.close(); return; }
      Yuki.UI.modal.closeAll();
    }
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.ctrlKey && e.key.toLowerCase() === 's') { e.preventDefault(); document.getElementById('quick-save-fab').click(); }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); Yuki.UI.modal.open('save'); }
    if (e.ctrlKey && e.key.toLowerCase() === 'h') { e.preventDefault(); Yuki.UI.history.open(); }
  });
  document.getElementById('game-container').addEventListener('contextmenu', e => e.preventDefault());
};
