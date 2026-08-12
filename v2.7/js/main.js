/* ═══════════════════════════════════════════════════
   MAIN — Application Entry Point
   Load order: config → effects → ui-core → features
             → wardrobe-data → sillytavern-core → sillytavern-ui
   ═══════════════════════════════════════════════════ */
(function() {
  'use strict';

  console.log('%c 雪之痕 — Yuki no Kiseki %cv' + Yuki.CONFIG.VERSION,
    'font-family:"Noto Serif SC",serif;font-size:1.2em;color:#b8923a;',
    'color:#8a8598;');

  // Phase 1: Loading screen (starts immediately)
  Yuki.UI.initLoading();

  // Phase 2: Visual effects
  Yuki.Effects.initSnow();
  Yuki.Effects.initTrail();
  Yuki.Effects.initRipple();
  Yuki.Effects.initClock();

  // Phase 3: UI foundations
  Yuki.UI.initModals();
  Yuki.UI.initNav();
  Yuki.UI.initDialog();
  Yuki.UI.initLlmInput();
  Yuki.UI.initKeyboard();
  Yuki.UI.initTitle();

  // Phase 4: Feature modules
  Yuki.Features.initCharacters();
  Yuki.Features.wardrobe.init();
  Yuki.Features.gallery.init();
  Yuki.Features.inventory.init();
  Yuki.Features.saveLoad.init();
  Yuki.Features.history.init();
  Yuki.Features.settings.init();

  // Phase 5: SillyTavern (async) — v2.7 with reactive variable system
  Yuki.ST.init().then(function() {
    Yuki.ST_UI.init();
    // Sync all HUD elements from loaded/saved variables
    Yuki.ST.refreshAllHUD();
  });

  // Welcome toast (after loading)
  setTimeout(function() { Yuki.UI.toast('欢迎来到《雪之痕》 v2.7', 'info', 4000); }, 2000);

  console.log('%cAll systems initialized %c✓', 'color:#5a8a6a;', '');
})();
