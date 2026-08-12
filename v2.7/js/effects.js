/* ═══════════════════════════════════════════════════
   VISUAL EFFECTS — Snow, Cursor Trail, Click Ripple, Clock
   ═══════════════════════════════════════════════════ */
window.Yuki = window.Yuki || {};
Yuki.Effects = {};

/* ── Snow Particles ── */
Yuki.Effects.initSnow = function() {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); initParts(); });

  function initParts() {
    particles = [];
    const count = Math.min(Yuki.CONFIG.MAX_SNOW, Math.floor((canvas.width * canvas.height) / 12000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3, speed: Math.random() * 0.4 + 0.15,
        wind: Math.random() * 0.3 - 0.15, opacity: Math.random() * 0.35 + 0.18,
        wobble: Math.random() * Math.PI * 2
      });
    }
  }
  initParts();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.wobble += 0.005; p.y += p.speed; p.x += p.wind + Math.sin(p.wobble) * 0.15;
      if (p.y > canvas.height + 5) { p.y = -5; p.x = Math.random() * canvas.width; }
      if (p.x > canvas.width + 5) p.x = -5;
      if (p.x < -5) p.x = canvas.width + 5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,185,200,${p.opacity})`; ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
};

/* ── Cursor Trail ── */
Yuki.Effects.initTrail = function() {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  let points = [], mx = -100, my = -100;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.push({ x: mx, y: my, life: 1 });
    if (points.length > Yuki.CONFIG.MAX_TRAIL) points.shift();
    for (let i = 0; i < points.length; i++) {
      const p = points[i]; p.life -= 0.025;
      if (p.life <= 0) continue;
      const r = 3.5 + (i / points.length) * 6;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,150,180,${p.life * 0.22})`; ctx.fill();
    }
    points = points.filter(p => p.life > 0);
    requestAnimationFrame(animate);
  }
  animate();
};

/* ── Click Ripple ── */
Yuki.Effects.initRipple = function() {
  document.addEventListener('click', function(e) {
    const target = e.target.closest('button, .cg-card:not(.locked), .save-slot, .inv-item, .nav-item, .gallery-tab, .inv-filter-tab, .save-tab, .settings-radio, .char-tab-avatar, #dialog-box, .title-menu-btn');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 0.9;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
};

/* ── Clock ── */
Yuki.Effects.initClock = function() {
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time-text').innerHTML = `${h}<span class="time-colon">:</span>${m}`;
  }
  update();
  setInterval(update, 30000);
};
