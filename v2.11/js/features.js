/* ═══════════════════════════════════════════════════
   FEATURES — Characters, Wardrobe, Gallery, Inventory,
              Save/Load, History, Settings
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.Features = {};

/* ── Character Tabs + Affection ── */
Yuki.Features.affectionData = {
  yukina: { yuu:62, kanade:30, rei:15 },
  kanade: { yuu:45, yukina:55, rei:25 },
  rei: { yuu:20, yukina:10, kanade:12 }
};

Yuki.Features.initCharacters = function() {
  document.querySelectorAll('.char-tab-avatar').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.char-tab-avatar').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.char-slide').forEach(s => s.classList.remove('active'));
      const slide = document.getElementById('char-slide-' + this.dataset.char);
      if (slide) slide.classList.add('active');
    });
  });
  // Affection tab switching — reads live from Yuki.ST.variables when target is 'yuu'
  document.querySelectorAll('.affection-target-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const char = this.dataset.char, target = this.dataset.target;
      this.parentElement.querySelectorAll('.affection-target-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      // Read from live variable for player affection; fallback to static data for inter-character
      var val;
      if (target === 'yuu' && Yuki.ST && Yuki.ST.variables) {
        var vKey = char + '_affection';
        val = Yuki.ST.variables[vKey] || 0;
      } else {
        val = (Yuki.Features.affectionData[char] || {})[target] || 0;
      }
      const slide = document.getElementById('char-slide-' + char);
      if (!slide) return;
      const bar = slide.querySelector('.affection-bar-fill.heart');
      const valEl = slide.querySelector('.affection-value');
      if (bar) bar.style.width = val + '%';
      if (valEl) valEl.textContent = val + '%';
    });
  });
};

/* ── Wardrobe ── */
Yuki.Features._wardrobeData = null; // loaded from wardrobe.js

Yuki.Features.wardrobe = {
  getData: function() { return Yuki.Features._wardrobeData || {}; },
  setData: function(d) { Yuki.Features._wardrobeData = d; },

  getIcon: function(slot) {
    var map = {'衣装':'apparel','下装':'skirt','脚部':'footprint','手部':'glove','头部':'headset','发型':'face','首饰':'diamond','戒指':'all_inclusive'};
    return map[slot] || 'checkroom';
  },

  /** Render a single slot card for the grid (no icon) */
  _renderSlotCard: function(slot, name, icon, set, isEmpty, charName, slotKey) {
    var cls = 'wb-slot' + (isEmpty ? ' wb-slot-empty' : '');
    var click = isEmpty ? '' : ' onclick="Yuki.Features.wardrobe.openDetailBySlot(\'' + charName + '\',\'' + slotKey + '\')"';
    return '<div class="' + cls + '"' + click + '>' +
      (set ? '<div class="wb-slot-set-tag">' + set + '</div>' : '') +
      '<span class="wb-slot-name">' + name + '</span>' +
      '<span class="wb-slot-label">' + slot + '</span>' +
    '</div>';
  },

  render: function(charName) {
    var items = this.getData()[charName];
    if (!items) return;
    var grid = document.getElementById('wardrobe-grid-' + charName);
    var bonusEl = document.getElementById('wardrobe-set-bonus-' + charName);
    if (!grid) return;
    var self = this;
    grid.innerHTML = items.map(function(item, i) {
      return self._renderSlotCard(item.slot, item.name, item.icon, item.set, item.name === '—', charName, item.slot);
    }).join('');
    // Set bonus panel
    var setCounts = {};
    items.forEach(function(item) { if (item.set) setCounts[item.set] = (setCounts[item.set] || 0) + 1; });
    var bonusHtml = Object.entries(setCounts).map(function(e) {
      var setName = e[0], count = e[1];
      var setItem = items.find(function(i) { return i.set === setName; });
      var total = items.filter(function(i) { return i.set === setName; }).length;
      var bonus = count >= total ? '套装效果已激活：全属性 +15%，魅力 +20%' : count >= 2 ? '套装效果已激活：好感度获取 +5%' : '收集 ' + total + ' 件中的更多部件以解锁加成';
      return '<div class="wb-set-row">' +
        '<div class="wb-set-header"><span class="material-symbols-rounded" style="font-size:1rem;color:var(--accent-gold)">auto_awesome</span><span class="wb-set-name">' + setName + '</span><span class="wb-set-progress">' + count + '/' + total + '</span></div>' +
        '<div class="wb-set-desc">' + (setItem ? setItem.setDesc : '') + '</div>' +
        '<div class="wb-set-bonus">' + bonus + '</div>' +
      '</div>';
    }).join('');
    bonusEl.innerHTML = bonusHtml || '<div class="wb-set-empty">暂无套装</div>';
  },

  /**
   * Render wardrobe grid from Yuki.ST.variables (reactive).
   * Cross-references static wardrobe data for icons and set info.
   */
  renderFromVars: function(charName) {
    var wardrobeVar = Yuki.ST.variables[charName + '_wardrobe'];
    if (!wardrobeVar) return;
    var grid = document.getElementById('wardrobe-grid-' + charName);
    if (!grid) return;
    var fullData = this.getData()[charName] || [];
    var self = this;
    var slotOrder = ['衣装','下装','脚部','手部','头部','发型','首饰','戒指'];
    var staticLookup = {};
    fullData.forEach(function(item) { staticLookup[item.slot] = item; });
    grid.innerHTML = slotOrder.map(function(slot) {
      var itemName = wardrobeVar[slot] || '—';
      var staticItem = staticLookup[slot];
      var icon = staticItem ? staticItem.icon : self.getIcon(slot);
      var set = staticItem ? staticItem.set : '';
      return self._renderSlotCard(slot, itemName, icon, set, itemName === '—', charName, slot);
    }).join('');
    // Bonus panel
    var setCounts = {};
    slotOrder.forEach(function(slot) {
      var si = staticLookup[slot];
      if (si && si.set) {
        var varName = wardrobeVar[slot];
        if (varName && varName !== '—' && si.name === varName) {
          setCounts[si.set] = (setCounts[si.set] || 0) + 1;
        }
      }
    });
    var bonusEl = document.getElementById('wardrobe-set-bonus-' + charName);
    if (bonusEl) {
      var bonusHtml = Object.entries(setCounts).map(function(e) {
        var setName = e[0], count = e[1];
        var setItems = fullData.filter(function(i) { return i.set === setName; });
        var total = setItems.length;
        var bonus = count >= total ? '套装效果已激活：全属性 +15%，魅力 +20%' : count >= 2 ? '套装效果已激活：好感度获取 +5%' : '再装备 ' + (total - count) + ' 件即可激活加成';
        return '<div class="wb-set-row">' +
          '<div class="wb-set-header"><span class="material-symbols-rounded" style="font-size:1rem;color:var(--accent-gold)">auto_awesome</span><span class="wb-set-name">' + setName + '</span><span class="wb-set-progress">' + count + '/' + total + '</span></div>' +
          '<div class="wb-set-desc">' + (setItems[0] ? setItems[0].setDesc : '') + '</div>' +
          '<div class="wb-set-bonus">' + bonus + '</div>' +
        '</div>';
      }).join('');
      bonusEl.innerHTML = bonusHtml || '<div class="wb-set-empty">暂无套装效果</div>';
    }
  },

  /** Open clothing detail popup (by slot name) */
  openDetailBySlot: function(charName, slot) {
    var fullData = this.getData()[charName] || [];
    var item = fullData.find(function(i) { return i.slot === slot; });
    if (!item) return;
    this._showDetailPopup(item);
  },

  /** Open clothing detail popup (by item index) */
  openDetail: function(charName, itemIndex) {
    var items = this.getData()[charName];
    if (!items || !items[itemIndex]) return;
    this._showDetailPopup(items[itemIndex]);
  },

  /** Populate and show the detail popup */
  _showDetailPopup: function(item) {
    document.getElementById('wb-detail-name').textContent = item.name;
    document.getElementById('wb-detail-slot').textContent = item.slot;
    document.getElementById('wb-detail-appearance').textContent = item.appearance || '暂无外观描述。';
    document.getElementById('wb-detail-origin').textContent = item.origin || '暂无来源信息。';
    document.getElementById('wb-detail-attr').textContent = item.attr || '无特殊属性。';

    if (item.set) {
      document.getElementById('wb-detail-set-name').textContent = item.set;
      document.getElementById('wb-detail-set-desc').textContent = item.setDesc || '';
      document.getElementById('wb-detail-set-row').style.display = '';
    } else {
      document.getElementById('wb-detail-set-name').textContent = '散件';
      document.getElementById('wb-detail-set-desc').textContent = '该服饰为独立散件，不属于任何套装。';
      document.getElementById('wb-detail-set-row').style.display = '';
    }

    document.getElementById('clothing-detail-popup').classList.add('active');
  },

  closeClothingDetail: function() {
    document.getElementById('clothing-detail-popup').classList.remove('active');
  },

  init: function() {
    var self = this;
    document.getElementById('clothing-detail-close-btn').addEventListener('click', function() { self.closeClothingDetail(); });
    document.getElementById('clothing-detail-popup').addEventListener('click', function(e) { if (e.target === e.currentTarget) self.closeClothingDetail(); });
    document.querySelectorAll('.wardrobe-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var cn = this.dataset.wardrobe;
        var panel = document.getElementById('wardrobe-panel-' + cn);
        if (!panel) return;
        if (panel.style.display !== 'none') {
          panel.style.display = 'none'; this.classList.remove('open');
          this.innerHTML = '<span class="material-symbols-rounded" style="font-size:1rem">visibility</span>展开衣柜';
        } else {
          self.render(cn);
          panel.style.display = 'block'; this.classList.add('open');
          this.innerHTML = '<span class="material-symbols-rounded" style="font-size:1rem">visibility_off</span>收起衣柜';
        }
      });
    });
  }
};

/* ── CG Gallery ── */
Yuki.Features.gallery = {
  _currentId: null,

  render: function(filter) {
    filter = filter || 'all';
    var grid = document.getElementById('cg-grid');
    var filtered = filter === 'all' ? Yuki.CG_DATA : Yuki.CG_DATA.filter(function(cg) { return cg.char === filter; });
    var unlocked = Yuki.CG_DATA.filter(function(cg) { return cg.unlocked; }).length;
    document.getElementById('gallery-progress-text').textContent = unlocked + ' / ' + Yuki.CG_DATA.length;
    var self = this;
    grid.innerHTML = filtered.map(function(cg) {
      return cg.unlocked
        ? '<div class="cg-card" data-cg-id="' + cg.id + '" onclick="Yuki.Features.gallery.openViewer(' + cg.id + ')"><div class="cg-card-thumb" style="background:linear-gradient(135deg,rgba(180,170,200,.22),rgba(140,130,170,.12),rgba(100,90,140,.06))"><span style="font-family:var(--font-display);font-size:1.2rem;color:var(--text-dim)">' + cg.title.charAt(0) + '</span></div><div class="cg-card-label">' + cg.title + '</div></div>'
        : '<div class="cg-card locked"><div class="cg-card-thumb"><span class="material-symbols-rounded cg-card-lock-icon">lock</span></div><div class="cg-card-label">???</div></div>';
    }).join('');
  },

  openViewer: function(id) {
    var cg = Yuki.CG_DATA.find(function(c) { return c.id === id; });
    if (!cg || !cg.unlocked) return;
    this._currentId = id;
    document.getElementById('cg-viewer-title').textContent = cg.title;
    document.getElementById('cg-viewer-chapter').textContent = cg.chapter;
    document.getElementById('cg-viewer-overlay').classList.add('active');
    var unlocked = Yuki.CG_DATA.filter(function(c) { return c.unlocked; });
    var idx = unlocked.findIndex(function(c) { return c.id === id; });
    document.getElementById('cg-viewer-prev').style.visibility = idx > 0 ? 'visible' : 'hidden';
    document.getElementById('cg-viewer-next').style.visibility = idx < unlocked.length - 1 ? 'visible' : 'hidden';
  },

  closeViewer: function() {
    document.getElementById('cg-viewer-overlay').classList.remove('active');
    this._currentId = null;
  },

  init: function() {
    this.render();
    var self = this;
    document.querySelectorAll('.gallery-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.gallery-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        self.render(this.dataset.filter);
      });
    });
    document.getElementById('cg-viewer-close-btn').addEventListener('click', function() { self.closeViewer(); });
    document.getElementById('cg-viewer-overlay').addEventListener('click', function(e) { if (e.target === e.currentTarget) self.closeViewer(); });
    document.getElementById('cg-viewer-prev').addEventListener('click', function() {
      var unlocked = Yuki.CG_DATA.filter(function(c) { return c.unlocked; });
      var idx = unlocked.findIndex(function(c) { return c.id === self._currentId; });
      if (idx > 0) self.openViewer(unlocked[idx - 1].id);
    });
    document.getElementById('cg-viewer-next').addEventListener('click', function() {
      var unlocked = Yuki.CG_DATA.filter(function(c) { return c.unlocked; });
      var idx = unlocked.findIndex(function(c) { return c.id === self._currentId; });
      if (idx < unlocked.length - 1) self.openViewer(unlocked[idx + 1].id);
    });
    document.addEventListener('keydown', function(e) {
      if (!document.getElementById('cg-viewer-overlay').classList.contains('active')) return;
      if (e.key === 'ArrowLeft') document.getElementById('cg-viewer-prev').click();
      if (e.key === 'ArrowRight') document.getElementById('cg-viewer-next').click();
    });
  }
};

/* ── Inventory ── */
Yuki.Features.inventory = {
  _data: Yuki.INV_DATA,
  _multiSelect: false,
  _selected: new Set(),
  _filter: 'all',

  _rarityClass: function(r) { return ({common:'common',rare:'rare',epic:'epic',legendary:'legendary'})[r] || 'common'; },
  _rarityStars: function(r) { return ({common:1,rare:2,epic:3,legendary:4})[r] || 1; },

  render: function(filter, sortBy) {
    filter = filter || 'all'; sortBy = sortBy || 'default';
    this._filter = filter;
    var items = filter === 'all' ? this._data.slice() : this._data.filter(function(i) { return i.category === filter; });
    if (sortBy === 'name') items.sort(function(a,b) { return a.name.localeCompare(b.name, 'zh'); });
    else if (sortBy === 'rarity') { var o = {legendary:0,epic:1,rare:2,common:3}; items.sort(function(a,b) { return (o[a.rarity]||4) - (o[b.rarity]||4); }); }
    else if (sortBy === 'qty') items.sort(function(a,b) { return b.qty - a.qty; });
    var self = this;
    document.getElementById('inv-grid').innerHTML = items.map(function(item) {
      var stars = self._rarityStars(item.rarity);
      var starsHtml = Array.from({length:4}, function(_,i) { return '<span class="inv-rarity-star' + (i < stars ? ' filled' : '') + '">&#9733;</span>'; }).join('');
      var sel = self._selected.has(item.id);
      return '<div class="inv-item ' + (self._multiSelect ? 'multi-select' : '') + ' ' + (sel ? 'selected' : '') + '" data-item-id="' + item.id + '" onclick="Yuki.Features.inventory._click(' + item.id + ',event)">' +
        '<div class="inv-item-check">' + (sel ? '<span class="material-symbols-rounded" style="font-size:0.7rem;color:#fff">check</span>' : '') + '</div>' +
        '<div class="inv-item-icon ' + self._rarityClass(item.rarity) + '"><span class="material-symbols-rounded">' + (item.category==='consumable'?'restaurant':item.category==='key'?'vpn_key':'redeem') + '</span></div>' +
        '<div class="inv-item-name">' + item.name + '</div><div class="inv-item-rarity">' + starsHtml + '</div><div class="inv-item-qty">x' + item.qty + '</div></div>';
    }).join('');
  },

  _click: function(id, event) {
    event.stopPropagation();
    var item = this._data.find(function(i) { return i.id === id; });
    if (!item) return;
    if (this._multiSelect) {
      this._selected.has(id) ? this._selected.delete(id) : this._selected.add(id);
      this.render(this._filter, document.getElementById('inv-sort').value);
    } else {
      this._openDetail(id);
    }
  },

  _openDetail: function(id) {
    var item = this._data.find(function(i) { return i.id === id; });
    if (!item) return;
    this._currentDetailId = id;
    var rc = this._rarityClass(item.rarity), stars = this._rarityStars(item.rarity);
    var catLabels = {consumable:'消耗品',key:'关键物品',gift:'礼物'};
    var catIcons = {consumable:'restaurant',key:'vpn_key',gift:'redeem'};
    document.getElementById('item-detail-icon').className = 'item-detail-icon-wrap ' + rc;
    document.getElementById('item-detail-icon').innerHTML = '<span class="material-symbols-rounded">' + (catIcons[item.category] || 'inventory_2') + '</span>';
    document.getElementById('item-detail-name').textContent = item.name;
    document.getElementById('item-detail-rarity-stars').innerHTML = Array.from({length:4}, function(_,i) { return '<span class="star' + (i < stars ? ' filled' : '') + '">&#9733;</span>'; }).join('');
    document.getElementById('item-detail-category').textContent = catLabels[item.category] || item.category;
    document.getElementById('item-detail-qty').innerHTML = '<span class="material-symbols-rounded" style="font-size:0.9rem">inventory_2</span> 数量：' + item.qty;
    document.getElementById('item-detail-desc').textContent = item.desc;
    document.getElementById('item-detail-effect').textContent = '效果：' + item.effect;
    document.getElementById('item-detail-overlay').classList.add('active');
  },

  closeDetail: function() {
    document.getElementById('item-detail-overlay').classList.remove('active');
    this._currentDetailId = null;
  },

  _exitMulti: function() {
    this._multiSelect = false; this._selected.clear();
    var btn = document.getElementById('inv-batch-discard-btn');
    btn.classList.remove('danger-mode');
    btn.innerHTML = '<span class="material-symbols-rounded" style="font-size:1rem">delete</span>批量丢弃';
    this.render(this._filter, document.getElementById('inv-sort').value);
  },

  init: function() {
    this.render();
    var self = this;
    document.querySelectorAll('.inv-filter-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.inv-filter-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        self.render(this.dataset.invFilter, document.getElementById('inv-sort').value);
      });
    });
    document.getElementById('inv-sort').addEventListener('change', function() { self.render(self._filter, this.value); });
    document.getElementById('inv-sort-btn').addEventListener('click', function() {
      self._data.sort(function(a,b) { var o = {key:0,gift:1,consumable:2}; return (o[a.category]||3) - (o[b.category]||3); });
      self.render(self._filter, document.getElementById('inv-sort').value);
      Yuki.UI.toast('背包已整理完毕', 'success', 2000);
    });
    document.getElementById('inv-batch-discard-btn').addEventListener('click', function() {
      if (!self._multiSelect) {
        self._multiSelect = true; self._selected.clear();
        this.classList.add('danger-mode');
        this.innerHTML = '<span class="material-symbols-rounded" style="font-size:1rem">close</span>取消选择';
        self.render(self._filter, document.getElementById('inv-sort').value);
        Yuki.UI.toast('点击物品进行多选', 'warning', 3000);
      } else {
        if (self._selected.size > 0) {
          var sel = self._data.filter(function(i) { return self._selected.has(i.id); });
          document.getElementById('discard-item-list').innerHTML = sel.map(function(i) { return '<div style="padding:4px 0;display:flex;justify-content:space-between"><span>' + i.name + '</span><span style="color:var(--text-dim)">x' + i.qty + '</span></div>'; }).join('');
          document.getElementById('discard-confirm-overlay').classList.add('active');
        } else self._exitMulti();
      }
    });
    document.getElementById('discard-cancel-btn').addEventListener('click', function() { document.getElementById('discard-confirm-overlay').classList.remove('active'); });
    document.getElementById('discard-confirm-btn').addEventListener('click', function() {
      var count = self._selected.size;
      self._selected.forEach(function(id) { var idx = self._data.findIndex(function(i) { return i.id === id; }); if (idx >= 0) self._data.splice(idx, 1); });
      self._selected.clear(); document.getElementById('discard-confirm-overlay').classList.remove('active');
      self._exitMulti(); self.render(self._filter, document.getElementById('inv-sort').value);
      Yuki.UI.toast('已丢弃 ' + count + ' 件物品', 'success', 2500);
    });
    document.getElementById('discard-confirm-overlay').addEventListener('click', function(e) { if (e.target === e.currentTarget) e.currentTarget.classList.remove('active'); });
    // Item detail actions
    document.getElementById('item-detail-close-btn').addEventListener('click', function() { self.closeDetail(); });
    document.getElementById('item-detail-overlay').addEventListener('click', function(e) { if (e.target === e.currentTarget) self.closeDetail(); });
    document.getElementById('item-action-use').addEventListener('click', function() {
      var item = self._data.find(function(i) { return i.id === self._currentDetailId; });
      if (!item) return;
      self.closeDetail(); item.qty--;
      if (item.qty <= 0) { var idx = self._data.findIndex(function(i) { return i.id === item.id; }); if (idx >= 0) self._data.splice(idx, 1); }
      self.render(self._filter, document.getElementById('inv-sort').value);
      Yuki.UI.toast('使用了「' + item.name + '」—— ' + item.effect, 'success', 3000);
    });
    document.getElementById('item-action-gift').addEventListener('click', function() {
      self.closeDetail();
      Yuki.UI.toast('请选择赠送对象（在角色详情中选择目标角色）', 'affection', 3000);
      Yuki.UI.modal.close('inventory');
      setTimeout(function() { Yuki.UI.modal.open('characters'); }, 400);
    });
    document.getElementById('item-action-discard').addEventListener('click', function() {
      var item = self._data.find(function(i) { return i.id === self._currentDetailId; });
      if (!item) return;
      self.closeDetail();
      var idx = self._data.findIndex(function(i) { return i.id === item.id; });
      if (idx >= 0) self._data.splice(idx, 1);
      self.render(self._filter, document.getElementById('inv-sort').value);
      Yuki.UI.toast('已丢弃「' + item.name + '」', 'warning', 2500);
    });
  }
};

/* ── Save / Load ── */
Yuki.Features.saveLoad = {
  _slots: Yuki.SAVE_SLOTS,
  _tab: 'save',

  render: function(tab) {
    tab = tab || 'save'; this._tab = tab;
    var slots = tab === 'auto' ? this._slots.filter(function(s) { return s.id <= 3; }).map(function(s) { return Object.assign({}, s, {filled:true,date:'2026-12-24',playtime:'0:1'+(s.id+4)}); }) : this._slots;
    var self = this;
    document.getElementById('save-grid').innerHTML = slots.map(function(slot) {
      return slot.filled
        ? '<div class="save-slot filled" onclick="Yuki.Features.saveLoad._click(' + slot.id + ')"><span class="save-slot-number">存档 ' + String(slot.id).padStart(2,'0') + '</span><button class="save-slot-delete" onclick="event.stopPropagation();Yuki.Features.saveLoad._delete(' + slot.id + ')" title="删除"><span class="material-symbols-rounded" style="font-size:0.9rem">close</span></button><div class="save-slot-info"><div class="save-slot-date"><span class="material-symbols-rounded" style="font-size:0.7rem">calendar_today</span>' + slot.date + '<span style="margin-left:8px;font-family:var(--font-mono)">' + slot.playtime + '</span></div><div class="save-slot-chapter">' + slot.chapter + '</div></div></div>'
        : '<div class="save-slot" onclick="Yuki.Features.saveLoad._click(' + slot.id + ')"><span class="save-slot-number">存档 ' + String(slot.id).padStart(2,'0') + '</span><span class="save-slot-empty-label">空存档位</span></div>';
    }).join('');
  },

  _click: function(id) {
    var slot = this._slots.find(function(s) { return s.id === id; });
    if (this._tab === 'save') {
      var now = new Date();
      if (!slot.filled) {
        slot.filled = true;
        slot.date = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        slot.chapter = document.getElementById('chapter-indicator').textContent;
        slot.playtime = '0:34';
      }
      this.render('save');
      Yuki.UI.toast('已保存至存档 ' + String(id).padStart(2,'0'), 'success', 2000);
    } else if (this._tab === 'load') {
      if (slot.filled) {
        Yuki.UI.toast('已载入存档 ' + String(id).padStart(2,'0') + ' — ' + slot.chapter, 'success', 2500);
        Yuki.UI.modal.close('save');
        document.getElementById('chapter-indicator').textContent = slot.chapter;
        // Directly enter the game
        Yuki.UI.titleScreen.hide();
      }
    }
  },

  _delete: function(id) {
    var slot = this._slots.find(function(s) { return s.id === id; });
    if (slot) { slot.filled = false; delete slot.date; delete slot.chapter; delete slot.playtime; this.render(this._tab); Yuki.UI.toast('存档 ' + String(id).padStart(2,'0') + ' 已删除', 'warning', 2000); }
  },

  init: function() {
    this.render();
    var self = this;
    document.querySelectorAll('.save-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.save-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        self._tab = this.dataset.saveTab;
        self.render(self._tab);
      });
    });
    document.getElementById('quick-save-fab').addEventListener('click', function() {
      var empty = self._slots.find(function(s) { return !s.filled; });
      if (empty) { self._tab = 'save'; self._click(empty.id); }
      else Yuki.UI.toast('所有存档位已满', 'warning', 2500);
    });
  }
};

/* ── History ── */
Yuki.Features.history = {
  _el: document.getElementById('history-panel'),
  _limit: 50,
  open: function() { this.render(); this._el.classList.add('active'); },
  close: function() { this._el.classList.remove('active'); },
  render: function() {
    var list = document.getElementById('history-list-content');
    // Use actual chat history, fall back to static data
    var source = (Yuki.ST && Yuki.ST.chatHistory && Yuki.ST.chatHistory.length)
      ? Yuki.ST.chatHistory : Yuki.HISTORY_DATA;
    // Limit to last N entries
    var entries = source.slice(-this._limit);
    var self = this;
    if (entries.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim)">暂无对话记录</div>';
      return;
    }
    var countNote = source.length > this._limit
      ? '<div style="text-align:center;padding:6px;font-size:.7rem;color:var(--text-muted)">仅显示最近 ' + this._limit + ' 条，共 ' + source.length + ' 条</div>'
      : '';
    list.innerHTML = countNote + entries.map(function(e, i) {
      var speaker = e.speaker || (e.role === 'user' ? '悠' : (Yuki.ST && Yuki.ST.getActiveCharacter ? Yuki.ST.getActiveCharacter().name : '雪菜'));
      var text = e.text || e.content || '';
      return '<div class="history-entry" data-idx="' + i + '"><div class="history-speaker">' + speaker + '<span class="material-symbols-rounded voice-replay" title="回放">volume_up</span></div><div class="history-text">' + text + '</div></div>';
    }).join('');
    list.querySelectorAll('.voice-replay').forEach(function(btn) {
      btn.addEventListener('click', function(ev) { ev.stopPropagation(); Yuki.UI.toast('语音回放（模拟）', 'info', 1500); });
    });
    list.querySelectorAll('.history-entry').forEach(function(entry) {
      entry.addEventListener('click', function() { Yuki.UI.toast('已跳转（模拟）', 'info', 2000); Yuki.Features.history.close(); });
    });
  },
  init: function() {
    this.render();
    var self = this;
    document.getElementById('nav-history-toggle').addEventListener('click', function() { Yuki.UI.nav.close(); self.open(); });
    document.getElementById('history-close-btn').addEventListener('click', function() { self.close(); });
  }
};

/* ── Settings ── */
Yuki.Features.settings = {
  init: function() {
    document.querySelectorAll('.settings-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function() { this.classList.toggle('on'); this.setAttribute('aria-checked', this.classList.contains('on')); });
    });
    document.querySelectorAll('.settings-radio-group').forEach(function(group) {
      group.addEventListener('click', function(e) { var r = e.target.closest('.settings-radio'); if (!r) return; group.querySelectorAll('.settings-radio').forEach(function(x) { x.classList.remove('active'); }); r.classList.add('active'); });
    });
  }
};
