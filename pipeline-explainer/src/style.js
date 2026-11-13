// Tech Glow Explainer: "/pipeline-power-bi: messy files to a Power BI report" (20 s).
// Helpers (background, bloom, card, tile, pill, gtext, revealLine, eyebrow, connectors, pulses) are taken from the
// reference tech-glow style unchanged; the icons, layout and explainer() are new for this topic.
(function () {
  const E = H.ease, cl = H.clamp, lerp = H.lerp;
  const seg = (a, b, t) => cl((t - a) / (b - a));
  const eo = (a, b, t) => E.out(seg(a, b, t));
  const eio = (a, b, t) => E.inOut(seg(a, b, t));
  const ebk = (a, b, t) => (t <= a ? 0 : t >= b ? 1 : E.back(seg(a, b, t)));
  const fract = (x) => x - Math.floor(x);
  const rgb = (c, a) => H.rgba(c, a);
  const HEAD = '"Space Grotesk"', UI = '"Inter"';
  const F = (w, s, fam) => `${w} ${s}px ${fam || HEAD}`;
  const C = {
    cyan: '#3fe3ff', blue: '#3d7bff', violet: '#8f5bff', magenta: '#e04dff', indigo: '#4b3bff',
    red: '#ff4f7a', green: '#3cf0b4', white: '#eef2ff', muted: '#9aa3d8', amber: '#ffb547',
  };
  const GRAD_HEAD = ['#ffffff', '#c8f4ff', '#7fdcff', '#9a78ff'];
  const GRAD_NUM = ['#7ff0ff', '#5d9bff', '#a77bff'];
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const bump = (t, t0, k = 6) => (t < t0 ? 0 : Math.exp(-(t - t0) * k));

  // ---------------------------------------------------------------- icons (line art in a -1..1 box scaled by u)
  const dot = (c, x, y, r) => { c.moveTo(x + r, y); c.arc(x, y, r, 0, Math.PI * 2); };
  const ICONS = {
    check(c, u) { c.moveTo(-0.58 * u, 0.02 * u); c.lineTo(-0.16 * u, 0.44 * u); c.lineTo(0.62 * u, -0.42 * u); },
    cross(c, u) { c.moveTo(-0.45 * u, -0.45 * u); c.lineTo(0.45 * u, 0.45 * u); c.moveTo(0.45 * u, -0.45 * u); c.lineTo(-0.45 * u, 0.45 * u); },
    // CSV / text file: page with folded corner and separated value rows
    file(c, u) {
      c.moveTo(-0.56 * u, -0.82 * u); c.lineTo(0.22 * u, -0.82 * u); c.lineTo(0.6 * u, -0.44 * u); c.lineTo(0.6 * u, 0.82 * u); c.lineTo(-0.56 * u, 0.82 * u); c.closePath();
      c.moveTo(0.22 * u, -0.82 * u); c.lineTo(0.22 * u, -0.44 * u); c.lineTo(0.6 * u, -0.44 * u);
      for (const y of [-0.06, 0.2, 0.46]) { c.moveTo(-0.32 * u, y * u); c.lineTo(-0.1 * u, y * u); c.moveTo(0.04 * u, y * u); c.lineTo(0.36 * u, y * u); }
    },
    // workbook sheet: grid
    sheet(c, u) {
      c.roundRect(-0.76 * u, -0.66 * u, 1.52 * u, 1.32 * u, 0.12 * u);
      c.moveTo(-0.76 * u, -0.24 * u); c.lineTo(0.76 * u, -0.24 * u); c.moveTo(-0.76 * u, 0.2 * u); c.lineTo(0.76 * u, 0.2 * u);
      c.moveTo(-0.26 * u, -0.66 * u); c.lineTo(-0.26 * u, 0.66 * u); c.moveTo(0.24 * u, -0.66 * u); c.lineTo(0.24 * u, 0.66 * u);
    },
    // report / Power BI project: framed bar chart
    report(c, u) {
      c.roundRect(-0.8 * u, -0.72 * u, 1.6 * u, 1.44 * u, 0.14 * u);
      c.roundRect(-0.5 * u, 0.0 * u, 0.24 * u, 0.42 * u, 0.04 * u);
      c.roundRect(-0.12 * u, -0.3 * u, 0.24 * u, 0.72 * u, 0.04 * u);
      c.roundRect(0.26 * u, -0.48 * u, 0.24 * u, 0.9 * u, 0.04 * u);
    },
    // the pipeline: a funnel that turns many inputs into one clean stream
    funnel(c, u) {
      c.moveTo(-0.8 * u, -0.62 * u); c.lineTo(0.8 * u, -0.62 * u); c.lineTo(0.16 * u, 0.08 * u); c.lineTo(0.16 * u, 0.62 * u);
      c.lineTo(-0.16 * u, 0.8 * u); c.lineTo(-0.16 * u, 0.08 * u); c.closePath();
      c.moveTo(-0.5 * u, -0.36 * u); c.lineTo(0.5 * u, -0.36 * u);
    },
    user(c, u) {
      dot(c, 0, -0.32 * u, 0.32 * u);
      c.moveTo(-0.7 * u, 0.78 * u); c.bezierCurveTo(-0.7 * u, 0.12 * u, 0.7 * u, 0.12 * u, 0.7 * u, 0.78 * u);
    },
    calendar(c, u) {
      c.roundRect(-0.72 * u, -0.56 * u, 1.44 * u, 1.34 * u, 0.14 * u);
      c.moveTo(-0.72 * u, -0.18 * u); c.lineTo(0.72 * u, -0.18 * u);
      c.moveTo(-0.36 * u, -0.78 * u); c.lineTo(-0.36 * u, -0.4 * u); c.moveTo(0.36 * u, -0.78 * u); c.lineTo(0.36 * u, -0.4 * u);
      for (const y of [0.14, 0.46]) for (const x of [-0.38, 0, 0.38]) dot(c, x * u, y * u, 0.06 * u);
    },
    tag(c, u) {
      c.moveTo(-0.78 * u, -0.08 * u); c.lineTo(-0.08 * u, -0.78 * u); c.lineTo(0.72 * u, -0.78 * u); c.lineTo(0.72 * u, 0.02 * u);
      c.lineTo(0.02 * u, 0.72 * u); c.closePath(); dot(c, 0.38 * u, -0.44 * u, 0.1 * u);
    },
    // dashboard layout: KPI row + trend
    layout(c, u) {
      c.roundRect(-0.82 * u, -0.68 * u, 1.64 * u, 1.36 * u, 0.12 * u);
      for (const x of [-0.62, -0.16, 0.3]) c.roundRect(x * u, -0.48 * u, 0.32 * u, 0.26 * u, 0.05 * u);
      c.moveTo(-0.6 * u, 0.42 * u); c.lineTo(-0.24 * u, 0.1 * u); c.lineTo(0.08 * u, 0.28 * u); c.lineTo(0.6 * u, -0.06 * u);
    },
    // catalog: open book
    book(c, u) {
      c.moveTo(0, -0.52 * u); c.quadraticCurveTo(-0.4 * u, -0.74 * u, -0.82 * u, -0.6 * u); c.lineTo(-0.82 * u, 0.62 * u);
      c.quadraticCurveTo(-0.4 * u, 0.48 * u, 0, 0.68 * u); c.quadraticCurveTo(0.4 * u, 0.48 * u, 0.82 * u, 0.62 * u);
      c.lineTo(0.82 * u, -0.6 * u); c.quadraticCurveTo(0.4 * u, -0.74 * u, 0, -0.52 * u); c.lineTo(0, 0.68 * u);
      for (const y of [-0.26, 0.02]) { c.moveTo(-0.6 * u, y * u); c.lineTo(-0.2 * u, (y + 0.04) * u); c.moveTo(0.2 * u, (y + 0.04) * u); c.lineTo(0.6 * u, y * u); }
    },
    // governance: shield with lock
    shield(c, u) {
      c.moveTo(0, -0.82 * u); c.lineTo(0.66 * u, -0.56 * u); c.lineTo(0.66 * u, 0.02 * u);
      c.bezierCurveTo(0.66 * u, 0.48 * u, 0.32 * u, 0.7 * u, 0, 0.84 * u); c.bezierCurveTo(-0.32 * u, 0.7 * u, -0.66 * u, 0.48 * u, -0.66 * u, 0.02 * u);
      c.lineTo(-0.66 * u, -0.56 * u); c.closePath();
      c.roundRect(-0.24 * u, -0.04 * u, 0.48 * u, 0.4 * u, 0.06 * u);
      c.moveTo(-0.14 * u, -0.04 * u); c.arc(0, -0.04 * u, 0.14 * u, Math.PI, 0);
    },
    clock(c, u) {
      dot(c, 0, 0, 0.76 * u);
      c.moveTo(0, 0); c.lineTo(0, -0.46 * u); c.moveTo(0, 0); c.lineTo(0.34 * u, 0.2 * u);
    },
  };

  // ---------------------------------------------------------------- background (reference, unchanged)
  const GLOWS = [
    { c: C.blue, x: 0.16, y: 0.24, r: 520, a: 0.24 },
    { c: C.violet, x: 0.82, y: 0.18, r: 560, a: 0.3 },
    { c: C.cyan, x: 0.6, y: 0.95, r: 440, a: 0.17 },
    { c: C.magenta, x: 1.0, y: 0.72, r: 380, a: 0.17 },
    { c: C.indigo, x: 0.42, y: 0.62, r: 560, a: 0.12 },
  ];
  const PARTS = (() => { const r = H.rng(77); return Array.from({ length: 90 }, () => ({ x: r(), y: r(), s: r.range(0.6, 2.1), sp: r.range(0.004, 0.018), ph: r() * 6.28, c: r.pick([C.cyan, C.violet, '#ffffff', C.blue]), z: r.range(0.3, 1) })); })();

  function background(ctx, W, Hh, t, camX = 0, lvl = 1) {
    const g = ctx.createLinearGradient(0, 0, W * 0.5, Hh);
    g.addColorStop(0, '#03041a'); g.addColorStop(0.55, '#080a2d'); g.addColorStop(1, '#120b3c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    GLOWS.forEach((b, i) => {
      const x = (b.x + 0.05 * Math.sin(t * 0.21 + i * 1.9)) * W - camX * 0.1, y = (b.y + 0.06 * Math.cos(t * 0.17 + i * 2.7)) * Hh;
      const r = b.r * (1 + 0.07 * Math.sin(t * 0.3 + i)), rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, rgb(b.c, b.a * lvl)); rg.addColorStop(0.4, rgb(b.c, b.a * 0.38 * lvl)); rg.addColorStop(1, rgb(b.c, 0));
      ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    });
    ctx.restore();
    ctx.save();
    const ox = ((-camX * 0.3) % 40 + 40) % 40;
    for (let y = 20; y < Hh * 0.56; y += 40) {
      const a = 0.09 * lvl * (y / (Hh * 0.56));
      ctx.fillStyle = `rgba(150,170,255,${a})`;
      for (let x = ox; x < W; x += 40) ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    ctx.restore();
    const hy = Hh * 0.6, vx = W / 2 - camX * 0.25;
    ctx.save(); ctx.lineWidth = 1;
    const sg = ctx.createLinearGradient(0, hy, 0, Hh);
    sg.addColorStop(0, 'rgba(110,140,255,0)'); sg.addColorStop(0.3, `rgba(110,140,255,${0.07 * lvl})`); sg.addColorStop(1, `rgba(140,170,255,${0.22 * lvl})`);
    ctx.strokeStyle = sg; ctx.beginPath();
    const sh = fract(camX / 900) * 1;
    for (let i = -34; i <= 34; i++) { const k = i - sh; ctx.moveTo(vx + k * 12, hy); ctx.lineTo(vx + k * 190, Hh + 260); }
    const roll = fract(t * 0.35);
    for (let k = 0; k < 26; k++) { const d = k + 1 - roll, y = hy + 230 / d; if (y > Hh + 2) continue; ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    const hz = ctx.createLinearGradient(0, 0, W, 0);
    hz.addColorStop(0, 'rgba(90,140,255,0)'); hz.addColorStop(0.5, `rgba(120,180,255,${0.18 * lvl})`); hz.addColorStop(1, 'rgba(90,140,255,0)');
    ctx.fillStyle = hz; ctx.fillRect(0, hy - 1, W, 2);
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PARTS) {
      const x = fract(p.x + 0.006 * Math.sin(t * 0.5 + p.ph) - camX * 0.0003 * p.z) * W, y = fract(p.y - t * p.sp) * Hh;
      const a = (0.2 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.7 + p.ph * 3))) * lvl * p.z;
      if (p.s > 1.7) { const rg = ctx.createRadialGradient(x, y, 0, x, y, p.s * 6); rg.addColorStop(0, rgb(p.c, a * 0.35)); rg.addColorStop(1, rgb(p.c, 0)); ctx.fillStyle = rg; ctx.fillRect(x - p.s * 6, y - p.s * 6, p.s * 12, p.s * 12); }
      ctx.fillStyle = rgb(p.c, a); ctx.beginPath(); ctx.arc(x, y, p.s * 0.7, 0, 6.283); ctx.fill();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- bloom (reference, unchanged; one buffer set per canvas)
  const BLS = new WeakMap();
  function bloom(ctx, amt = 1) {
    const cv = ctx.canvas;
    let BL = BLS.get(cv);
    if (!BL) { BL = { a: H.layer(320, 180), b: H.layer(320, 180), c: H.layer(160, 90) }; BLS.set(cv, BL); }
    const a = BL.a.getContext('2d'), b = BL.b.getContext('2d'), c = BL.c.getContext('2d');
    a.globalCompositeOperation = 'copy'; a.filter = 'brightness(0.9) contrast(2.6) saturate(1.4)'; a.drawImage(cv, 0, 0, 320, 180); a.filter = 'none';
    b.globalCompositeOperation = 'copy'; b.filter = 'blur(2.5px)'; b.drawImage(BL.a, 0, 0); b.filter = 'none';
    c.globalCompositeOperation = 'copy'; c.filter = 'blur(4px)'; c.drawImage(BL.a, 0, 0, 160, 90); c.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.45 * amt; ctx.drawImage(BL.b, 0, 0, cv.width, cv.height);
    ctx.globalAlpha = 0.5 * amt; ctx.drawImage(BL.c, 0, 0, cv.width, cv.height);
    ctx.restore();
  }

  // ---------------------------------------------------------------- building blocks (reference)
  function glowDot(ctx, x, y, col, r, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgb('#ffffff', a)); g.addColorStop(0.16, rgb(col, 0.9 * a)); g.addColorStop(0.45, rgb(col, 0.22 * a)); g.addColorStop(1, rgb(col, 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  function ring(ctx, x, y, r, col, a, lw = 2) {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgb(col, a); ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); ctx.restore();
  }
  function card(ctx, x, y, w, h, o = {}) {
    const r = o.r ?? 22, acc = o.acc || [C.cyan, C.violet];
    ctx.save(); ctx.globalAlpha *= o.a ?? 1;
    ctx.shadowColor = 'rgba(0,0,12,0.6)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 18;
    const fg = ctx.createLinearGradient(x, y, x, y + h);
    fg.addColorStop(0, 'rgba(22,26,72,0.8)'); fg.addColorStop(1, 'rgba(8,9,32,0.86)');
    ctx.fillStyle = fg; rr(ctx, x, y, w, h, r); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    const ig = ctx.createRadialGradient(x + w * 0.25, y, 0, x + w * 0.25, y, Math.max(w, h) * 0.8);
    ig.addColorStop(0, rgb(acc[0], 0.17)); ig.addColorStop(1, rgb(acc[0], 0)); ctx.fillStyle = ig; ctx.fillRect(x, y, w, h);
    const ig2 = ctx.createRadialGradient(x + w, y + h, 0, x + w, y + h, Math.max(w, h) * 0.7);
    ig2.addColorStop(0, rgb(acc[1], 0.14)); ig2.addColorStop(1, rgb(acc[1], 0)); ctx.fillStyle = ig2; ctx.fillRect(x, y, w, h);
    ctx.restore();
    const bg = ctx.createLinearGradient(x, y, x + w, y + h);
    bg.addColorStop(0, rgb(acc[0], 0.95)); bg.addColorStop(0.4, rgb(acc[1], 0.4)); bg.addColorStop(0.72, 'rgba(255,255,255,0.07)'); bg.addColorStop(1, rgb(acc[1], 0.6));
    ctx.strokeStyle = bg; ctx.lineWidth = 1.5; rr(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r); ctx.stroke();
    const hl = ctx.createLinearGradient(x, 0, x + w, 0);
    hl.addColorStop(0, 'rgba(255,255,255,0)'); hl.addColorStop(0.3, 'rgba(200,240,255,0.5)'); hl.addColorStop(0.65, 'rgba(255,255,255,0)');
    ctx.strokeStyle = hl; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + r, y + 1.5); ctx.lineTo(x + w - r, y + 1.5); ctx.stroke();
    if (o.flash > 0.01) {
      ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgb(o.flashCol || C.cyan, o.flash); ctx.lineWidth = 3;
      rr(ctx, x + 1, y + 1, w - 2, h - 2, r); ctx.stroke();
      ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip(); ctx.fillStyle = rgb(o.flashCol || C.cyan, o.flash * 0.08); ctx.fillRect(x, y, w, h); ctx.restore();
    }
    ctx.restore();
  }
  function tile(ctx, cx, cy, s, icon, o = {}) {
    const a = o.a ?? 1, sc = o.sc ?? 1, col = o.col || [C.cyan, C.violet], glow = o.glow ?? 1, draw = o.draw ?? 1;
    if (a <= 0.003 || sc <= 0.003) return;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.globalAlpha *= a;
    const r = s * 0.26, h = s / 2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const hg = ctx.createRadialGradient(0, 0, s * 0.25, 0, 0, s * 1.15);
    hg.addColorStop(0, rgb(col[0], Math.min(0.5, 0.2 * glow))); hg.addColorStop(0.5, rgb(col[1], Math.min(0.25, 0.07 * glow))); hg.addColorStop(1, rgb(col[1], 0));
    ctx.fillStyle = hg; ctx.fillRect(-s * 1.15, -s * 1.15, s * 2.3, s * 2.3);
    ctx.restore();
    ctx.save(); ctx.shadowColor = 'rgba(0,0,10,0.55)'; ctx.shadowBlur = s * 0.3; ctx.shadowOffsetY = s * 0.1;
    const bg = ctx.createLinearGradient(0, -h, 0, h); bg.addColorStop(0, '#171b4d'); bg.addColorStop(1, '#090a28');
    ctx.fillStyle = bg; rr(ctx, -h, -h, s, s, r); ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, -h, -h, s, s, r); ctx.clip();
    const ig = ctx.createRadialGradient(-h * 0.5, -h * 0.7, 0, -h * 0.5, -h * 0.7, s);
    ig.addColorStop(0, rgb(col[0], 0.3)); ig.addColorStop(1, rgb(col[0], 0)); ctx.fillStyle = ig; ctx.fillRect(-h, -h, s, s);
    const ig2 = ctx.createRadialGradient(h * 0.6, h * 0.8, 0, h * 0.6, h * 0.8, s * 0.8);
    ig2.addColorStop(0, rgb(col[1], 0.26)); ig2.addColorStop(1, rgb(col[1], 0)); ctx.fillStyle = ig2; ctx.fillRect(-h, -h, s, s);
    if (glow > 1.05) { ctx.fillStyle = rgb(col[0], Math.min(0.25, (glow - 1) * 0.12)); ctx.fillRect(-h, -h, s, s); }
    ctx.restore();
    const sg = ctx.createLinearGradient(-h, -h, h, h); sg.addColorStop(0, H.rgba(H.mix(col[0], '#ffffff', 0.2), 1)); sg.addColorStop(1, col[1]);
    ctx.strokeStyle = sg; ctx.lineWidth = Math.max(1.6, s * 0.022); rr(ctx, -h + 1, -h + 1, s - 2, s - 2, r); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1; rr(ctx, -h + 6, -h + 6, s - 12, s - 12, r * 0.75); ctx.stroke();
    if (draw > 0) {
      const icg = ctx.createLinearGradient(-h * 0.5, -h * 0.5, h * 0.5, h * 0.5);
      icg.addColorStop(0, H.rgba(H.mix(col[0], '#ffffff', 0.45), 1)); icg.addColorStop(1, H.rgba(H.mix(col[1], '#ffffff', 0.15), 1));
      ctx.strokeStyle = icg; ctx.lineWidth = Math.max(1.8, s * 0.042); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (draw < 1) ctx.setLineDash([draw * s * 2.4, 1e4]);
      ctx.beginPath(); ICONS[icon](ctx, s * 0.3); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
  function pill(ctx, x, y, text, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    const size = o.size || 24, col = o.col || [C.cyan, C.violet];
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc ?? 1, o.sc ?? 1);
    ctx.font = F(o.w || 600, size, o.fam || UI); const tw = ctx.measureText(text).width, dotW = o.dot ? size * 0.75 : 0;
    const w = tw + size * 1.3 + dotW, h = size * 1.62;
    ctx.fillStyle = o.fill || 'rgba(10,12,42,0.88)'; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, rgb(col[0], 0.9)); g.addColorStop(1, rgb(col[1], 0.7));
    ctx.strokeStyle = g; ctx.lineWidth = 1.4; rr(ctx, -w / 2 + 0.7, -h / 2 + 0.7, w - 1.4, h - 1.4, h / 2); ctx.stroke();
    if (o.dot) { ctx.fillStyle = col[0]; ctx.beginPath(); ctx.arc(-w / 2 + size * 0.75, 0, size * 0.17, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = o.textCol || C.white; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillText(text, -w / 2 + size * 0.65 + dotW, size * 0.04);
    ctx.restore();
  }
  function gtext(ctx, s, x, y, size, o = {}) {
    ctx.font = F(o.w || 700, size, o.fam); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.letterSpacing = o.ls || '0px';
    const w = ctx.measureText(s).width, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    const cols = o.cols || GRAD_HEAD, g = ctx.createLinearGradient(x0, y - size, x0 + w, y);
    cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c));
    ctx.fillStyle = g; ctx.fillText(s, x0, y); ctx.letterSpacing = '0px';
    return w;
  }
  function revealLine(ctx, s, x, y, size, prog, o = {}) {
    ctx.font = F(o.w || 700, size, o.fam); ctx.letterSpacing = o.ls || '0px';
    const words = s.split(' '), full = ctx.measureText(s).width, x0 = o.align === 'center' ? x - full / 2 : x;
    const cols = o.cols || GRAD_HEAD, g = ctx.createLinearGradient(x0, y - size, x0 + full, y);
    cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c));
    ctx.save(); ctx.fillStyle = g; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    let cx = x0; const n = words.length;
    words.forEach((wd, i) => {
      const p = E.out(cl(prog * (n + 1.5) - i * 1.0, 0, 1)), ww = ctx.measureText(wd + (i < n - 1 ? ' ' : '')).width;
      if (p > 0) { ctx.globalAlpha = p * (o.a ?? 1); ctx.fillText(wd, cx, y + (1 - p) * size * 0.45); }
      cx += ww;
    });
    ctx.restore(); ctx.letterSpacing = '0px';
    return { x0, w: full };
  }
  function eyebrow(ctx, s, x, y, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    const size = o.size || 18, col = o.col || C.cyan;
    ctx.save(); ctx.globalAlpha *= a; ctx.font = F(600, size, UI); ctx.letterSpacing = '3px';
    const w = ctx.measureText(s).width + 22, x0 = o.align === 'center' ? x - w / 2 : x;
    ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, x0 + 5, y - size * 0.36, col, 12); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0 + 5, y - size * 0.36, 3.2, 0, 6.283); ctx.fill();
    ctx.fillStyle = rgb(H.mix(col, '#ffffff', 0.25), 1); ctx.textAlign = 'left'; ctx.fillText(s, x0 + 22, y);
    ctx.letterSpacing = '0px'; ctx.restore();
  }

  // ---------------------------------------------------------------- connectors + light pulses (reference)
  function bez(x0, y0, x1, y1, x2, y2, x3, y3, n = 48) {
    const P = []; let L = 0, px = x0, py = y0;
    for (let i = 0; i <= n; i++) {
      const u = i / n, m = 1 - u;
      const x = m * m * m * x0 + 3 * m * m * u * x1 + 3 * m * u * u * x2 + u * u * u * x3;
      const y = m * m * m * y0 + 3 * m * m * u * y1 + 3 * m * u * u * y2 + u * u * u * y3;
      if (i) L += Math.hypot(x - px, y - py);
      P.push({ x, y, l: L }); px = x; py = y;
    }
    P.L = L; return P;
  }
  const seg2 = (x0, y0, x1, y1) => bez(x0, y0, lerp(x0, x1, 0.33), lerp(y0, y1, 0.33), lerp(x0, x1, 0.66), lerp(y0, y1, 0.66), x1, y1, 8);
  const hcurve = (x0, y0, x1, y1, n = 32) => bez(x0, y0, lerp(x0, x1, 0.5), y0, lerp(x0, x1, 0.5), y1, x1, y1, n);
  function ptAt(P, f) {
    const tl = cl(f) * P.L;
    for (let i = 1; i < P.length; i++) if (P[i].l >= tl) { const a = P[i - 1], b = P[i], k = (tl - a.l) / Math.max(1e-6, b.l - a.l); return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) }; }
    return P[P.length - 1];
  }
  function sub(ctx, P, a, b) {
    a = cl(a); b = cl(b); ctx.beginPath(); if (b <= a) return;
    const s = ptAt(P, a); ctx.moveTo(s.x, s.y);
    const la = a * P.L, lb = b * P.L;
    for (const p of P) if (p.l > la && p.l < lb) ctx.lineTo(p.x, p.y);
    const e = ptAt(P, b); ctx.lineTo(e.x, e.y);
  }
  function pulseOn(ctx, P, p, col, len = 0.16, a = 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a0 = p - len * (i + 1) / n, a1 = p - len * i / n;
      if (a1 <= 0 || a0 >= 1) continue;
      ctx.strokeStyle = rgb(col, 0.85 * a * (1 - i / n)); ctx.lineWidth = 3.4 - i * 0.3; sub(ctx, P, a0, a1); ctx.stroke();
    }
    if (p >= 0 && p <= 1) { const h = ptAt(P, p); glowDot(ctx, h.x, h.y, col, 18, a); }
    ctx.restore();
  }
  function connector(ctx, P, o = {}) {
    const d = o.draw ?? 1, a = o.a ?? 1; if (d <= 0 || a <= 0.003) return;
    const c0 = (o.col || [])[0] || C.cyan, c1 = (o.col || [])[1] || C.violet;
    ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
    const s = P[0], e = P[P.length - 1], g = ctx.createLinearGradient(s.x, s.y, e.x, e.y);
    g.addColorStop(0, rgb(c0, 0.75)); g.addColorStop(1, rgb(c1, 0.75));
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgb(c0, 0.08); ctx.lineWidth = 9; sub(ctx, P, 0, d); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = g; ctx.lineWidth = o.lw || 1.8; sub(ctx, P, 0, d); ctx.stroke();
    if (!o.noEnds) {
      ctx.fillStyle = '#0b0d30'; ctx.strokeStyle = c0; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, 6.283); ctx.fill(); ctx.stroke();
      if (d >= 1) { ctx.strokeStyle = c1; ctx.beginPath(); ctx.arc(e.x, e.y, 4, 0, 6.283); ctx.fill(); ctx.stroke(); }
    }
    if (d < 1) { const hpt = ptAt(P, d); ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, hpt.x, hpt.y, c0, 16); }
    ctx.restore();
    for (const p of o.pulses || []) if (p > 0 && p - 0.16 < d) pulseOn(ctx, P, Math.min(p, d), o.pc || '#9ff0ff', o.pl || 0.16, a);
  }
  const pulses = (t, t0, rate, n, off = 0) => (t > t0 ? Array.from({ length: n }, (_, k) => fract((t - t0) * rate + off + k / n)) : []);

  // =====================================================================================================
  // EXPLAINER: "/pipeline-power-bi" (20 s)
  // =====================================================================================================
  const X = {
    D: 20,
    hubPop: [0.15, 0.7], title: [0.35, 1.2],
    shrink: [1.75, 2.45], hubFly: [1.85, 2.6],
    src: 2.0, lanes: [2.3, 2.85], chips: 2.55, hubPill: 2.75,
    issue0: 2.9, issueGap: 0.25, travel: 1.1,
    push: [4.85, 5.45],
    cardsIn: [5.15, 5.75], stepsIn: [5.35, 5.85],
    toggles: [6.1, 6.5, 6.9, 7.3, 7.7], youPill: 6.3,
    morph: [8.35, 8.95], dims: [8.85, 9.0, 9.15], dimLines: [9.0, 9.6],
    shrinkStar: [10.9, 11.5], skills: [11.3, 11.5, 11.7], handIn: [12.2, 12.6], items: [12.65, 12.85, 13.05], allDone: 13.3,
    pan: [13.75, 14.35], count: [14.4, 15.8], bars: [14.6, 14.8, 15.0], hit: 15.8,
    pull: [16.9, 17.4], tkTiles: [17.05, 17.2], tkText: [17.3, 17.75], underline: [17.8, 18.2],
  };

  // ---- beat 2 layout: three sources -> pipeline hub
  const HUB = { x: 1000, y: 445, s: 170 };
  const SRC = [
    { y: 275, icon: 'file', label: 'CSV', col: [C.cyan, C.blue] },
    { y: 440, icon: 'sheet', label: 'Excel', col: [C.cyan, C.green] },
    { y: 605, icon: 'report', label: '.pbip', col: [C.amber, C.violet] },
  ];
  const SRC_X = 150, SRC_S = 104;
  const LANES = SRC.map((s) => bez(SRC_X + 58, s.y, 420, s.y, 700, HUB.y + (s.y - HUB.y) * 0.35, HUB.x - 92, HUB.y + (s.y - HUB.y) * 0.12));
  const ISSUES = [
    { text: 'N/A', lane: 0 }, { text: '03-01-2025', lane: 1 }, { text: 'K002', lane: 0 }, { text: '1.234,50', lane: 2 }, { text: 'I alt', lane: 1 },
  ];

  // ---- chip rail (the skill's own stages)
  const CHIP_Y = 140, CHIP_W = 204;
  const CHIPS = [
    { x: 265, label: 'Profile', n: '1', win: [2.6, 4.9] },
    { x: 515, label: 'Clean', n: '2', win: [4.9, 8.3] },
    { x: 765, label: 'Model', n: '3', win: [8.3, 10.9] },
    { x: 1015, label: 'Extras', n: '4', win: [10.9, 13.3] },
  ];
  const CHIP_LINES = CHIPS.slice(1).map((c, i) => seg2(CHIPS[i].x + CHIP_W / 2, CHIP_Y, c.x - CHIP_W / 2, CHIP_Y));

  // ---- beat 3: orders.csv rows (from the skill's demo file) and the cleaning steps the user switches on
  const TBL = { x: 60, y: 200, w: 580, h: 440 };
  const STP = { x: 700, y: 200, w: 520, h: 440 };
  const COLX = [96, 300, 606];
  const ROW0 = 368, ROWH = 56;
  const ROWS = [
    { cells: [['03-01-2025', '2025-01-03', 0], ['K-001', null], ['1.234,50', '1,234.50', 2]] },
    { cells: [['15-01-2025', '2025-01-15', 0], ['K002', 'K-002', 1], ['99,95', '99.95', 2]] },
    { cells: [['15-01-2025', '2025-01-15', 0], ['K002', 'K-002', 1], ['99,95', '99.95', 2]], remove: 3 },
    { cells: [['31/01/2025', '2025-01-31', 0], ['K-004', null], ['2.000,00', '2,000.00', 2]] },
    { cells: [['I alt', null], ['', null], ['4.147,45', null]], remove: 4 },
  ];
  const STEPS = [
    { code: 'F08', text: 'Parse dates' },
    { code: 'F11', text: 'One id format' },
    { code: 'F09', text: 'Parse numbers' },
    { code: 'F12', text: 'Remove duplicates' },
    { code: 'F04', text: 'Remove total rows' },
  ];
  const STEP_Y0 = 318, STEP_H = 62;
  // a step's light pulse lands on the table rows it changes
  const STEP_LINES = STEPS.map((s, i) => hcurve(STP.x + 6, STEP_Y0 + i * STEP_H, TBL.x + TBL.w - 6, ROW0 - 10 + Math.min(i, 4) * ROWH * 0.8, 16));

  // ---- beat 4: star schema
  const FACT = { x: 510, y: 375, w: 260, h: 130 };
  const DIMS = [
    { x: 360, y: 285, icon: 'user', label: 'Customer', col: [C.cyan, C.blue], from: [FACT.x + 30, FACT.y + 8] },
    { x: 360, y: 595, icon: 'tag', label: 'Channel', col: [C.violet, C.magenta], from: [FACT.x + 30, FACT.y + FACT.h - 8] },
    { x: 920, y: 440, icon: 'calendar', label: 'Date', col: [C.cyan, C.green], from: [FACT.x + FACT.w, FACT.y + FACT.h / 2] },
  ];
  const DIM_S = 100;
  const DIM_LINES = DIMS.map((d) => {
    const [fx, fy] = d.from, tx = d.x + (d.x < 640 ? 0 : -DIM_S / 2 - 4), ty = d.y + (d.x < 640 ? (d.y < 440 ? DIM_S / 2 + 4 : -DIM_S / 2 - 4) : 0);
    return d.x < 640 ? bez(tx, ty, tx, lerp(ty, fy, 0.6), lerp(tx, fx, 0.5), fy, fx, fy, 32) : hcurve(tx, ty, fx, fy);
  });

  // ---- beat 5: hand-off to the other skills
  const SK_X = 560, SK_S = 96;
  const SKILLS = [
    { y: 270, icon: 'layout', name: 'pbip-layout', sub: 'Dashboard pages', col: [C.cyan, C.blue] },
    { y: 440, icon: 'book', name: 'pbip-catalog', sub: 'Catalog + lineage', col: [C.violet, C.magenta] },
    { y: 610, icon: 'shield', name: 'pbip-governance', sub: 'PII · RLS · wiki', col: [C.cyan, C.green] },
  ];
  const STAR_C = { x: 230, y: 440, k: 0.5 };
  const SK_IN = SKILLS.map((s) => hcurve(STAR_C.x + (920 - 640) * STAR_C.k + 30, 440, SK_X - SK_S / 2 - 4, s.y));
  const HAND = { x: 950, y: 230, w: 285, h: 410 };
  const SK_OUT = SKILLS.map((s) => hcurve(895, s.y + 14, HAND.x - 2, HAND.y + 110 + SKILLS.indexOf(s) * 100));
  const ITEMS = ['PBIP project', 'overview.html', 'checks.dax'];

  // ---- beat 6: run time
  const TC = { x: 90, y: 165, w: 1100, h: 470 };
  const RUNS = [
    { label: 'Fast', val: '≈ 8 min', lo: 8, hi: 8, col: [C.cyan, C.green] },
    { label: 'Quick', val: '10–12 min', lo: 10, hi: 12, col: [C.blue, C.cyan] },
    { label: 'Full', val: '20–30 min', lo: 20, hi: 30, col: [C.violet, C.magenta] },
  ];
  const AX = { x: 600, w: 540, max: 30 };

  function chip(ctx, c, active, done, a) {
    if (a <= 0.003) return;
    const w = CHIP_W, h = 58, x = c.x - w / 2, y = CHIP_Y - h / 2;
    ctx.save(); ctx.globalAlpha *= a;
    if (active > 0.01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(c.x, CHIP_Y, 0, c.x, CHIP_Y, 130); g.addColorStop(0, rgb(C.cyan, 0.3 * active)); g.addColorStop(1, rgb(C.cyan, 0));
      ctx.fillStyle = g; ctx.fillRect(c.x - 130, CHIP_Y - 130, 260, 260); ctx.restore();
    }
    const fg = ctx.createLinearGradient(x, 0, x + w, 0);
    fg.addColorStop(0, H.rgba(H.mix('#0c0e34', '#1d4fd8', active), 0.92)); fg.addColorStop(1, H.rgba(H.mix('#0c0e34', '#6a2fe0', active), 0.92));
    ctx.fillStyle = fg; rr(ctx, x, y, w, h, h / 2); ctx.fill();
    const c0 = H.mix(C.cyan, C.green, done), c1 = H.mix(C.violet, C.green, done * 0.7);
    const bg = ctx.createLinearGradient(x, 0, x + w, 0); bg.addColorStop(0, rgb(c0, 0.5 + 0.5 * Math.max(active, done))); bg.addColorStop(1, rgb(c1, 0.5 + 0.5 * active));
    ctx.strokeStyle = bg; ctx.lineWidth = 1.5 + active; rr(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, h / 2); ctx.stroke();
    ctx.fillStyle = H.rgba(H.mix(H.mix('#1a1f5c', '#0f5a4a', done), '#ffffff', active * 0.9), 1); ctx.beginPath(); ctx.arc(x + 31, CHIP_Y, 17, 0, 6.283); ctx.fill();
    if (done > 0.5 && active < 0.5) {
      ctx.strokeStyle = C.green; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.save(); ctx.translate(x + 31, CHIP_Y); ctx.beginPath(); ICONS.check(ctx, 12); ctx.stroke(); ctx.restore();
    } else {
      ctx.fillStyle = active > 0.5 ? '#1b2a8a' : C.white; ctx.font = F(700, 20, HEAD); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.n, x + 31, CHIP_Y + 1);
    }
    ctx.fillStyle = H.rgba(H.mix('#aab2e6', '#ffffff', Math.max(active, done * 0.6)), 1); ctx.font = F(600, 30, UI); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(c.label, x + 60, CHIP_Y + 1);
    ctx.restore();
  }
  const winAct = (t, [a, b]) => Math.max(0, Math.min(eo(a - 0.05, a + 0.15, t), 1 - eo(b - 0.1, b + 0.1, t)));

  function toggle(ctx, x, y, on, a) {
    const w = 56, h = 30;
    ctx.save(); ctx.globalAlpha *= a;
    const fill = H.mix('#1a1f4c', '#127a63', on);
    ctx.fillStyle = H.rgba(fill, 1); rr(ctx, x, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = rgb(H.mix('#5560a0', C.green, on), 0.9); ctx.lineWidth = 1.5; rr(ctx, x + 0.75, y - h / 2 + 0.75, w - 1.5, h - 1.5, h / 2); ctx.stroke();
    const kx = x + 15 + 26 * on;
    if (on > 0.05) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, kx, y, C.green, 26, 0.5 * on); ctx.restore(); }
    ctx.fillStyle = H.rgba(H.mix('#aab2e6', '#ffffff', on), 1); ctx.beginPath(); ctx.arc(kx, y, 11, 0, 6.283); ctx.fill();
    ctx.restore();
  }

  // the orders.csv table card and the cleaning steps card
  function cleanScene(ctx, t, rectT, contentA, stepsA, stepsDX) {
    // table card (rect animates into the fact card during the morph)
    const R = rectT;
    card(ctx, R.x, R.y, R.w, R.h, { acc: [C.cyan, C.violet], flash: R.flash || 0, flashCol: C.green });
    if (contentA > 0.003) {
      ctx.save(); ctx.globalAlpha *= contentA;
      eyebrow(ctx, 'ORDERS.CSV', TBL.x + 30, TBL.y + 52, { size: 28, col: C.amber });
      ctx.font = F(600, 28, UI); ctx.fillStyle = '#8f98cf'; ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left'; ctx.fillText('Dato', COLX[0], 304); ctx.fillText('KundeID', COLX[1], 304);
      ctx.textAlign = 'right'; ctx.fillText('Beløb', COLX[2], 304);
      ctx.strokeStyle = 'rgba(150,170,255,0.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(TBL.x + 24, 322); ctx.lineTo(TBL.x + TBL.w - 24, 322); ctx.stroke();
      // rows; removed rows strike, fade and collapse
      let yOff = 0;
      ROWS.forEach((row, ri) => {
        let ra = 1, strike = 0;
        if (row.remove != null) {
          const tt = X.toggles[row.remove];
          strike = eio(tt + 0.05, tt + 0.3, t); ra = 1 - eo(tt + 0.3, tt + 0.55, t);
          const col = eio(tt + 0.4, tt + 0.7, t);
          const y = ROW0 + ri * ROWH + yOff;
          yOff -= ROWH * col;
          if (ra <= 0.003) return;
          drawRow(ctx, row, y, t, ra, strike);
          return;
        }
        drawRow(ctx, row, ROW0 + ri * ROWH + yOff, t, ra, strike);
      });
      ctx.restore();
    }
    if (stepsA > 0.003) {
      ctx.save(); ctx.globalAlpha *= stepsA; ctx.translate(stepsDX, 0);
      card(ctx, STP.x, STP.y, STP.w, STP.h, { acc: [C.green, C.cyan], flash: 0.6 * bump(t, X.toggles[4] + 0.1, 3) });
      eyebrow(ctx, 'CLEANING STEPS', STP.x + 30, STP.y + 52, { size: 28, col: C.green });
      STEPS.forEach((s, i) => {
        const y = STEP_Y0 + i * STEP_H, on = eio(X.toggles[i], X.toggles[i] + 0.18, t);
        const ap = eo(X.stepsIn[0] + 0.1 + i * 0.06, X.stepsIn[1] + 0.1 + i * 0.06, t);
        toggle(ctx, STP.x + 30, y, on, ap);
        ctx.save(); ctx.globalAlpha *= ap;
        ctx.font = F(700, 28, HEAD); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillStyle = rgb(H.mix('#6f79b8', C.cyan, on), 1); ctx.fillText(s.code, STP.x + 104, y + 1);
        ctx.font = F(600, 28, UI); ctx.fillStyle = rgb(H.mix('#9aa3d8', '#ffffff', on), 1); ctx.fillText(s.text, STP.x + 168, y + 1);
        ctx.restore();
      });
      ctx.restore();
    }
  }
  function drawRow(ctx, row, y, t, a, strike) {
    ctx.save(); ctx.globalAlpha *= a;
    row.cells.forEach(([before, after, step], ci) => {
      const x = COLX[ci], align = ci === 2 ? 'right' : 'left';
      const messy = after != null || row.remove != null;
      const p = after != null ? eio(X.toggles[step] + 0.1, X.toggles[step] + 0.4, t) : 0;
      ctx.font = F(600, 28, UI); ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
      if (p < 1) { ctx.save(); ctx.globalAlpha *= 1 - p; ctx.fillStyle = messy ? '#ff8aa5' : '#dfe4ff'; ctx.fillText(before, x, y - p * 14); ctx.restore(); }
      if (p > 0) {
        const fl = bump(t, X.toggles[step] + 0.3, 4);
        ctx.save(); ctx.globalAlpha *= p; ctx.fillStyle = H.rgba(H.mix('#e6ecff', C.green, 0.25 + 0.6 * fl), 1); ctx.fillText(after, x, y + (1 - p) * 14); ctx.restore();
      }
    });
    if (strike > 0) {
      ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.lineCap = 'round';
      const x0 = TBL.x + 26, x1 = TBL.x + TBL.w - 26; ctx.beginPath(); ctx.moveTo(x0, y - 10); ctx.lineTo(lerp(x0, x1, strike), y - 10); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, lerp(x0, x1, strike), y - 10, C.red, 18, 1 - strike * 0.5);
      ctx.restore();
    }
    ctx.restore();
  }

  function starScene(ctx, t, fullA) {
    const m = eio(X.morph[0], X.morph[1], t);
    // connectors behind tiles
    DIM_LINES.forEach((P, i) => {
      const d = eio(X.dimLines[0] + i * 0.1, X.dimLines[1] + i * 0.1, t);
      connector(ctx, P, { draw: d, col: [DIMS[i].col[0], C.violet], pulses: pulses(t, X.dimLines[1] + 0.2, 0.6, 2, i * 0.3), lw: 2 });
    });
    DIMS.forEach((d, i) => {
      const p = ebk(X.dims[i], X.dims[i] + 0.45, t);
      tile(ctx, d.x, d.y, DIM_S, d.icon, { sc: p, a: cl(p * 2), col: d.col, glow: 1.2 + 1.4 * bump(t, X.dims[i] + 0.3, 5), draw: eo(X.dims[i] + 0.1, X.dims[i] + 0.7, t) });
      const la = eo(X.dims[i] + 0.3, X.dims[i] + 0.6, t) * fullA;
      if (d.x < 640) pill(ctx, d.x - 150, d.y, d.label, { a: la, size: 28, col: d.col, dot: true });
      else pill(ctx, d.x, d.y + 86, d.label, { a: la, size: 28, col: d.col, dot: true });
    });
    eyebrow(ctx, 'STAR SCHEMA', 640, 340, { a: eo(9.1, 9.4, t) * fullA, size: 28, align: 'center', col: C.violet });
  }

  function explainer(ctx, W, Hh, t) {
    const panE = eio(X.pan[0], X.pan[1], t);
    const camX = 60 * eo(2, 6, t) + 900 * panE + 40 * eo(16, 20, t);
    const lvl = 0.45 + 0.55 * eo(0, 0.8, t);
    background(ctx, W, Hh, t, camX, lvl);
    const sway = (k) => { ctx.translate(W / 2, Hh / 2); ctx.scale(k, k); ctx.translate(-W / 2 + 4 * Math.sin(t * 0.55), -Hh / 2 + 3 * Math.cos(t * 0.47)); };

    // ------------------------------------------------ beat 1: hook (pipeline tile + title)
    const shr = eio(X.shrink[0], X.shrink[1], t);
    const fly = eio(X.hubFly[0], X.hubFly[1], t);
    if (t < X.hubFly[1]) {
      ctx.save(); sway(1.04 - 0.04 * eo(0, 2.5, t));
      const pop = ebk(X.hubPop[0], X.hubPop[1], t);
      const hx = lerp(640, HUB.x, fly), hy = lerp(250, HUB.y, fly), hs = lerp(150, HUB.s, fly);
      for (let i = 0; i < 2; i++) { const q = fract((t - 0.5) * 0.8 + i * 0.5); if (t > 0.5) ring(ctx, hx, hy, hs * 0.6 + q * 120, i ? C.violet : C.cyan, 0.35 * (1 - q) * (1 - fly)); }
      tile(ctx, hx, hy, hs, 'funnel', { sc: pop, a: cl(pop * 2), glow: 1.5 + 1.8 * bump(t, 0.5, 4) + 0.4 * Math.sin(t * 3), draw: eo(0.3, 1.1, t) });
      eyebrow(ctx, '/PIPELINE-POWER-BI', 640, 385, { a: eo(0.45, 0.8, t) * (1 - eo(1.6, 1.9, t)), align: 'center', size: 28 });
      ctx.restore();
    }

    // ------------------------------------------------ beat 2: files stream into the pipeline (profile)
    const pushP = E.in(seg(X.push[0], X.push[1], t)), pA = 1 - seg(X.push[0] + 0.32, X.push[1] - 0.02, t);
    if (t >= X.src - 0.05 && t < X.push[1]) {
      ctx.save(); sway(1.03 + 0.03 * eo(2.5, 4.85, t));
      ctx.translate(HUB.x, HUB.y); ctx.scale(1 + 9 * pushP, 1 + 9 * pushP); ctx.translate(-HUB.x, -HUB.y);
      ctx.globalAlpha = pA;
      LANES.forEach((P, i) => {
        const d = eio(X.lanes[0] + i * 0.08, X.lanes[1] + i * 0.08, t);
        connector(ctx, P, { draw: d, col: [SRC[i].col[0], C.violet], pulses: pulses(t, 2.95, 0.7, 2, i * 0.21), lw: 2 });
      });
      SRC.forEach((s, i) => {
        const t0 = X.src + i * 0.12, p = ebk(t0, t0 + 0.45, t);
        tile(ctx, SRC_X, s.y, SRC_S, s.icon, { sc: p, a: cl(p * 2), col: s.col, glow: 1.3 + 1.5 * bump(t, t0 + 0.25, 5), draw: eo(t0 + 0.1, t0 + 0.7, t) });
        pill(ctx, SRC_X, s.y + 80, s.label, { size: 28, a: eo(t0 + 0.4, t0 + 0.7, t), col: s.col });
      });
      // messy values riding the lanes into the pipeline
      ISSUES.forEach((is, i) => {
        const s0 = X.issue0 + i * X.issueGap, f = (t - s0) / X.travel; if (f <= 0 || f >= 1) return;
        const u = lerp(0.12, 1, E.inOut(f) * 0.4 + f * 0.6), pt = ptAt(LANES[is.lane], u);
        const sc = (0.6 + 0.4 * E.out(cl(f / 0.2))) * (1 - 0.7 * E.in(cl((f - 0.75) / 0.25)));
        const a = cl(f / 0.08) * (1 - cl((f - 0.88) / 0.12)) * (1 - seg(X.push[0], X.push[0] + 0.2, t));
        pill(ctx, pt.x, pt.y, is.text, { a, sc, size: 28, col: [C.red, C.magenta], textCol: '#ffc2d2', dot: true });
      });
      let flash = 0; ISSUES.forEach((is, i) => { flash += bump(t, X.issue0 + i * X.issueGap + X.travel * 0.95, 7); });
      const hubGlow = 1.4 + Math.min(1.6, flash * 1.2) + 0.3 * Math.sin(t * 2.6);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const fg = ctx.createRadialGradient(HUB.x, HUB.y, 0, HUB.x, HUB.y, 260); fg.addColorStop(0, rgb(C.blue, 0.3 * fly)); fg.addColorStop(1, rgb(C.violet, 0));
      ctx.fillStyle = fg; ctx.fillRect(HUB.x - 260, HUB.y - 260, 520, 520); ctx.restore();
      for (let i = 0; i < 2; i++) { const q = fract((t - 2.7) * 0.6 + i * 0.5); ring(ctx, HUB.x, HUB.y, 96 + q * 90, i ? C.violet : C.cyan, 0.3 * (1 - q) * seg(2.7, 3.0, t)); }
      if (t >= X.hubFly[1]) tile(ctx, HUB.x, HUB.y, HUB.s, 'funnel', { glow: hubGlow });
      pill(ctx, HUB.x, HUB.y + 138, 'pipeline-power-bi', { size: 28, a: eo(X.hubPill, X.hubPill + 0.3, t), dot: true, col: [C.violet, C.magenta] });
      ctx.restore();
      // speed streaks while pushing through the pipeline
      const st = Math.sin(Math.PI * seg(X.push[0] + 0.05, X.push[1] + 0.1, t));
      if (st > 0.01) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = H.rng(5);
        for (let i = 0; i < 46; i++) {
          const ang = r() * 6.283, r0 = 60 + r() * 200 + pushP * 400, len = 80 + r() * 260 * (0.3 + pushP);
          const c = r.pick([C.cyan, C.violet, C.blue]);
          const g = ctx.createLinearGradient(HUB.x + Math.cos(ang) * r0, HUB.y + Math.sin(ang) * r0, HUB.x + Math.cos(ang) * (r0 + len), HUB.y + Math.sin(ang) * (r0 + len));
          g.addColorStop(0, rgb(c, 0)); g.addColorStop(1, rgb(c, 0.5 * st));
          ctx.strokeStyle = g; ctx.lineWidth = 1 + r() * 2; ctx.beginPath();
          ctx.moveTo(HUB.x + Math.cos(ang) * r0, HUB.y + Math.sin(ang) * r0); ctx.lineTo(HUB.x + Math.cos(ang) * (r0 + len), HUB.y + Math.sin(ang) * (r0 + len)); ctx.stroke();
        }
        const fl = Math.exp(-Math.pow((t - 5.28) / 0.12, 2));
        glowDot(ctx, HUB.x, HUB.y, C.cyan, 700, 0.5 * fl);
        ctx.restore();
      }
    }

    // ------------------------------------------------ beats 3-5: clean -> star schema -> hand-off (one continuous stage)
    const b5x = -1350 * panE;
    if (t >= X.cardsIn[0] && t < X.pan[1]) {
      ctx.save(); sway(1 + 0.015 * eo(5.5, 13.5, t)); ctx.translate(b5x, 0);
      // card emerges from the hub point, scaling up
      const cin = eo(X.cardsIn[0], X.cardsIn[1], t);
      const m = eio(X.morph[0], X.morph[1], t);
      const ss = eio(X.shrinkStar[0], X.shrinkStar[1], t);
      // star group transform (beat 5 shrinks it to the left)
      ctx.save();
      ctx.translate(lerp(640, STAR_C.x, ss), 440); ctx.scale(lerp(1, STAR_C.k, ss), lerp(1, STAR_C.k, ss)); ctx.translate(-640, -440);
      ctx.save();
      const ccx = 640, ccy = 420;
      ctx.translate(lerp(HUB.x, ccx, cin), lerp(HUB.y, ccy, cin)); ctx.scale(lerp(0.2, 1, cin), lerp(0.2, 1, cin)); ctx.translate(-ccx, -ccy);
      ctx.globalAlpha = seg(X.cardsIn[0], X.cardsIn[0] + 0.25, t);
      if (t > X.morph[0] - 0.1) starScene(ctx, t, 1 - ss);
      const rect = {
        x: lerp(TBL.x, FACT.x, m), y: lerp(TBL.y, FACT.y, m), w: lerp(TBL.w, FACT.w, m), h: lerp(TBL.h, FACT.h, m),
        flash: 0.8 * bump(t, X.morph[1], 3) + 0.5 * bump(t, X.allDone, 3),
      };
      const stepsA = eo(X.stepsIn[0], X.stepsIn[1], t) * (1 - eo(X.morph[0] - 0.05, X.morph[0] + 0.3, t));
      cleanScene(ctx, t, rect, 1 - eo(X.morph[0], X.morph[0] + 0.25, t), stepsA, 120 * eio(X.morph[0] - 0.05, X.morph[0] + 0.35, t));
      // fact text sits on top of the morphed card
      if (t > X.morph[1] - 0.2) {
        const fa = eo(X.morph[1] - 0.15, X.morph[1] + 0.25, t);
        ctx.save(); ctx.globalAlpha *= fa;
        gtext(ctx, 'Sales', FACT.x + FACT.w / 2, FACT.y + 66, 46, { align: 'center' });
        ctx.font = F(600, 28, UI); ctx.fillStyle = '#b8c0f0'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('fact table', FACT.x + FACT.w / 2, FACT.y + 106);
        ctx.restore();
      }
      // pulses from the steps that just switched on into the table
      if (stepsA > 0.05) STEP_LINES.forEach((P, i) => {
        const tt = X.toggles[i];
        if (t > tt && t < tt + 0.42) pulseOn(ctx, P, seg(tt, tt + 0.35, t) * 1.15, '#a6ffe0', 0.3, stepsA);
      });
      ctx.restore();
      ctx.restore();
      pill(ctx, 640, 676, 'You switch each step on or off', { size: 28, a: eo(X.youPill, X.youPill + 0.35, t) * (1 - eo(X.morph[0] - 0.1, X.morph[0] + 0.2, t)), col: [C.green, C.cyan], dot: true });

      // ---- beat 5: skills + hand-over
      if (t > X.skills[0] - 0.1) {
        SK_IN.forEach((P, i) => connector(ctx, P, { draw: eio(X.skills[i] - 0.05, X.skills[i] + 0.35, t), col: [C.violet, SKILLS[i].col[0]], lw: 2, pulses: pulses(t, X.skills[i] + 0.4, 0.7, 2, i * 0.27) }));
        SKILLS.forEach((s, i) => {
          const p = ebk(X.skills[i], X.skills[i] + 0.45, t);
          tile(ctx, SK_X, s.y, SK_S, s.icon, { sc: p, a: cl(p * 2), col: s.col, glow: 1.3 + 1.5 * bump(t, X.skills[i] + 0.3, 5), draw: eo(X.skills[i] + 0.1, X.skills[i] + 0.7, t) });
          const ta = eo(X.skills[i] + 0.15, X.skills[i] + 0.5, t), dx = (1 - ta) * 16;
          ctx.save(); ctx.globalAlpha *= ta; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          gtext(ctx, s.name, SK_X + 66 + dx, s.y - 4, 30);
          ctx.font = F(600, 28, UI); ctx.fillStyle = '#b8c0f0'; ctx.fillText(s.sub, SK_X + 66 + dx, s.y + 34);
          ctx.restore();
        });
        SK_OUT.forEach((P, i) => connector(ctx, P, { draw: eio(X.handIn[0] - 0.1 + i * 0.05, X.handIn[0] + 0.25 + i * 0.05, t), col: [SKILLS[i].col[0], C.green], noEnds: true, pulses: pulses(t, X.handIn[1], 0.8, 1, i * 0.33), pc: '#b8fff0' }));
        const hp = eo(X.handIn[0], X.handIn[1], t);
        if (hp > 0) {
          ctx.save(); ctx.globalAlpha *= hp; ctx.translate((1 - hp) * 40, 0);
          card(ctx, HAND.x, HAND.y, HAND.w, HAND.h, { acc: [C.green, C.cyan], flash: 0.9 * bump(t, X.allDone, 3), flashCol: C.green });
          eyebrow(ctx, 'HAND-OVER', HAND.x + 26, HAND.y + 54, { size: 28, col: C.green });
          ITEMS.forEach((it, i) => {
            const ip = ebk(X.items[i], X.items[i] + 0.3, t), y = HAND.y + 130 + i * 92;
            if (ip <= 0) return;
            ctx.save(); ctx.translate(HAND.x + 46, y); ctx.scale(ip, ip);
            ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, 0, 0, C.green, 34, 0.35); ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = H.rgba(H.mix(C.green, '#0a0b2a', 0.6), 1); ctx.beginPath(); ctx.arc(0, 0, 18, 0, 6.283); ctx.fill();
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ICONS.check(ctx, 13); ctx.stroke();
            ctx.restore();
            ctx.save(); ctx.globalAlpha *= cl(ip); ctx.font = F(600, 28, UI); ctx.fillStyle = '#eef2ff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(it, HAND.x + 78, y + 1); ctx.restore();
          });
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // ------------------------------------------------ beats 6-7: run time (pans in from the right), then pull back + takeaway
    if (t >= X.pan[0]) {
      const pull = eio(X.pull[0], X.pull[1], t);
      ctx.save(); sway(1 + 0.02 * eo(14.5, 16.9, t) - 0.02 * pull);
      ctx.translate(1350 * (1 - panE), 0);
      const hitB = bump(t, X.hit, 3.2);
      // pull-back: the card narrows to the run-time number and rises to the top
      const cs = lerp(1, 0.62, pull);
      ctx.save(); ctx.translate(640, lerp(400, 245, pull)); ctx.scale(cs, cs); ctx.translate(-640, -400);
      const up = (a, b) => lerp(a, b, pull);
      const cw = lerp(TC.w, 640, pull), cx0 = 640 - cw / 2;
      card(ctx, cx0, TC.y, cw, TC.h, { r: 26, flash: 0.9 * hitB, flashCol: C.cyan });
      const lx = lerp(TC.x + 50, 640 - 270, pull);
      eyebrow(ctx, 'RUN TIME', lx, up(235, 250), { size: up(28, 45) });
      const p = seg(X.count[0], X.count[1], t), val = Math.min(8, Math.floor(8 * E.out(p) + 1e-6));
      ctx.save(); ctx.translate(lx, 420); const sc = 1 + 0.1 * hitB; ctx.scale(sc, sc);
      if (hitB > 0.02) { ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, 140, -60, C.cyan, 260, 0.35 * hitB); ctx.globalCompositeOperation = 'source-over'; }
      ctx.font = F(700, 160, HEAD); const wN = ctx.measureText('8').width;
      gtext(ctx, '≈', 0, 0, 80, { cols: ['#9fe6ff', '#9a78ff'] });
      gtext(ctx, String(val), 70, 0, 160, { cols: hitB > 0.05 ? ['#ffffff', '#c4f8ff', '#a8ffe4'] : GRAD_NUM });
      gtext(ctx, 'min', 70 + wN + 18, 0, 64, { cols: ['#d8f6ff', '#9a78ff'] });
      ctx.restore();
      if (t > X.hit) for (let i = 0; i < 2; i++) { const q = 1 - bump(t, X.hit + i * 0.12, 2.5); ring(ctx, lx + 150, 360, 80 + q * 240, i ? C.violet : C.cyan, 0.7 * (1 - q), 3); }
      ctx.save(); ctx.font = F(600, up(28, 45), UI); ctx.fillStyle = rgb(H.mix('#c2c9f5', '#e3e7ff', pull), 1); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText('fastest run, with --fast', lx, up(492, 512));
      ctx.font = F(400, 28, UI); ctx.fillStyle = '#9aa3d8'; ctx.globalAlpha *= 1 - pull; ctx.fillText('estimates from the README', lx, 572);
      ctx.restore();
      // range bars
      const chA = 1 - eo(X.pull[0], X.pull[0] + 0.3, t);
      if (chA > 0.003) {
        ctx.save(); ctx.globalAlpha *= chA;
        const xs = (v) => AX.x + v / AX.max * AX.w;
        ctx.strokeStyle = 'rgba(150,170,255,0.14)'; ctx.lineWidth = 1; ctx.font = F(500, 28, UI); ctx.fillStyle = '#8890c4'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        [0, 10, 20, 30].forEach((v) => { ctx.beginPath(); ctx.moveTo(xs(v), 240); ctx.lineTo(xs(v), 560); ctx.stroke(); ctx.textAlign = v === 30 ? 'right' : 'center'; ctx.fillText(v === 30 ? '30 min' : String(v), v === 30 ? xs(v) + 14 : xs(v), 600); });
        RUNS.forEach((r, i) => {
          const y = 300 + i * 100, g = eo(X.bars[i], X.bars[i] + 0.7, t);
          ctx.font = F(600, 28, UI); ctx.textAlign = 'left'; ctx.fillStyle = '#e3e7ff'; ctx.globalAlpha = chA * eo(X.bars[i] - 0.1, X.bars[i] + 0.2, t);
          ctx.fillText(r.label, AX.x, y - 16);
          ctx.textAlign = 'right'; ctx.fillStyle = rgb(r.col[0], 1); ctx.fillText(r.val, AX.x + AX.w, y - 16);
          ctx.globalAlpha = chA;
          ctx.fillStyle = 'rgba(120,140,230,0.12)'; rr(ctx, xs(0), y, AX.w, 22, 11); ctx.fill();
          const end = xs(r.hi) * g + xs(0) * (1 - g);
          const bg = ctx.createLinearGradient(xs(0), 0, xs(r.hi), 0); bg.addColorStop(0, rgb(r.col[1], 0.35)); bg.addColorStop(1, rgb(r.col[0], 0.95));
          if (end - xs(0) > 4) { ctx.fillStyle = bg; rr(ctx, xs(0), y, end - xs(0), 22, 11); ctx.fill(); }
          if (r.hi > r.lo && g > 0.98) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(xs(r.lo), y - 4); ctx.lineTo(xs(r.lo), y + 26); ctx.stroke(); ctx.setLineDash([]); }
          if (g > 0.02) { ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, end, y + 11, r.col[0], i === 0 ? 30 + 40 * hitB : 22, 1); ctx.globalCompositeOperation = 'source-over'; }
        });
        ctx.restore();
      }
      ctx.restore();

      // takeaway
      if (t > X.pull[0]) {
        ctx.font = F(700, 64, HEAD);
        const sL = 'Messy files', sA = ' → ', sR = 'clean report';
        const wL = ctx.measureText(sL).width, wA = ctx.measureText(sA).width, wR = ctx.measureText(sR).width;
        const x0 = 640 - (wL + wA + wR) / 2, ty = 652;
        const lx2 = x0 + wL / 2, rx2 = x0 + wL + wA + wR / 2;
        const p1 = ebk(X.tkTiles[0], X.tkTiles[0] + 0.45, t), p2 = ebk(X.tkTiles[1], X.tkTiles[1] + 0.45, t);
        const TP = seg2(lx2 + 66, 500, rx2 - 66, 500);
        connector(ctx, TP, { draw: eio(X.tkTiles[0] + 0.2, X.tkTiles[1] + 0.35, t), col: [C.amber, C.green], lw: 2.4, pulses: pulses(t, 17.7, 0.8, 2), pc: '#b8fff0' });
        tile(ctx, lx2, 500, 120, 'file', { sc: p1, a: cl(p1 * 2), col: [C.amber, C.red], glow: 1.4 + 1.2 * bump(t, X.tkTiles[0] + 0.25, 4) });
        tile(ctx, rx2, 500, 120, 'report', { sc: p2, a: cl(p2 * 2), col: [C.cyan, C.green], glow: 1.5 + 1.6 * bump(t, 18.2, 3) + 0.3 * Math.sin(t * 3) });
        const pa = seg(X.tkText[0], X.tkText[1], t);
        const wp = (k) => E.out(cl(pa * 3 - k));
        ctx.save(); ctx.font = F(700, 64, HEAD); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
        const g = ctx.createLinearGradient(x0, ty - 64, x0 + wL + wA + wR, ty); g.addColorStop(0, '#ffe2b8'); g.addColorStop(0.3, '#ffffff'); g.addColorStop(0.6, '#9fe6ff'); g.addColorStop(1, '#8ff5d0');
        ctx.fillStyle = g;
        [[sL, x0, 0], [sA, x0 + wL, 1], [sR, x0 + wL + wA, 2]].forEach(([s, x, k]) => { const p = wp(k); if (p > 0) { ctx.globalAlpha = p; ctx.fillText(s, x, ty + (1 - p) * 26); } });
        ctx.restore();
        const ul = eio(X.underline[0], X.underline[1], t);
        if (ul > 0) {
          ctx.save(); const ug = ctx.createLinearGradient(x0, 0, x0 + wL + wA + wR, 0); ug.addColorStop(0, rgb(C.cyan, 0)); ug.addColorStop(0.3, C.cyan); ug.addColorStop(0.7, C.green); ug.addColorStop(1, rgb(C.green, 0));
          ctx.strokeStyle = ug; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); const cx = 640, hw = (wL + wA + wR) / 2 * ul; ctx.moveTo(cx - hw, ty + 22); ctx.lineTo(cx + hw, ty + 22); ctx.stroke();
          ctx.globalCompositeOperation = 'lighter'; glowDot(ctx, cx + hw, ty + 22, C.green, 20, 1 - ul * 0.6); glowDot(ctx, cx - hw, ty + 22, C.cyan, 20, 1 - ul * 0.6);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // ------------------------------------------------ HUD: chip rail (beats 2-5), outside the camera push
    const railA = 1 - eo(X.pan[0], X.pan[0] + 0.3, t);
    if (t > X.chips && railA > 0.003) {
      ctx.save(); ctx.globalAlpha = railA; ctx.translate(-300 * panE, 0);
      CHIP_LINES.forEach((P, i) => {
        const tt = CHIPS[i + 1].win[0], pul = t > tt - 0.3 && t < tt + 0.05 ? [seg(tt - 0.3, tt, t)] : [];
        connector(ctx, P, { draw: eio(X.chips + 0.2 + i * 0.1, X.chips + 0.5 + i * 0.1, t), pulses: pul, noEnds: true });
      });
      const allDone = eo(X.allDone, X.allDone + 0.3, t);
      CHIPS.forEach((c, i) => {
        const a = eo(X.chips + i * 0.08, X.chips + 0.35 + i * 0.08, t);
        const act = winAct(t, c.win), done = Math.max(t > c.win[1] ? eo(c.win[1], c.win[1] + 0.25, t) : 0, allDone);
        chip(ctx, c, act * (1 - allDone), done, a);
      });
      ctx.restore();
    }

    // ------------------------------------------------ title -> header (always on top, outside the camera)
    {
      const words = 'Messy files to Power BI';
      ctx.font = F(700, 80, HEAD); const w = ctx.measureText(words).width;
      const sx0 = 640 - w / 2, sy0 = 480;
      const k = lerp(1, 0.45, shr), x = lerp(sx0, 56, shr), y = lerp(sy0, 70, shr);
      ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
      revealLine(ctx, words, 0, 0, 80, seg(X.title[0], X.title[1], t));
      ctx.restore();
      if (shr > 0.5) {
        ctx.save(); ctx.globalAlpha = eo(X.shrink[1] - 0.2, X.shrink[1] + 0.2, t);
        const hg = ctx.createLinearGradient(56, 0, 56 + w * 0.45, 0); hg.addColorStop(0, C.cyan); hg.addColorStop(1, rgb(C.violet, 0));
        ctx.fillStyle = hg; ctx.fillRect(56, 86, w * 0.45 * eo(X.shrink[1] - 0.1, X.shrink[1] + 0.4, t), 2);
        ctx.restore();
      }
    }
    bloom(ctx, 1);
    H.vignette(ctx, W, Hh, 0.45, '2,3,16');
  }

  // =====================================================================================================
  // SOUND: clean motion-graphics design, timed from X
  // =====================================================================================================
  function scoreSound(k) {
    const D = X.D;
    const whoosh = (t, dur, g = 1, top = 1500, o = {}) => k.noise(t, { dur, color: 'pink', filter: 'bandpass', f: [[0, 260], [dur * 0.55, top], [dur, 420]], q: 0.8, gain: 0.16 * g, a: dur * 0.5, verb: 0.2, pan: o.pan || 0, minor: o.minor });
    const glass = (t, f, g = 1, o = {}) => {
      k.tone(t, { f, dur: 0.5, gain: 0.13 * g, a: 0.003, verb: 0.35, pan: o.pan || 0, minor: o.minor });
      k.tone(t, { f: f * 2, dur: 0.18, gain: 0.035 * g, a: 0.002, verb: 0.3, pan: o.pan || 0, minor: o.minor });
      k.tone(t, { f: f / 2, type: 'triangle', dur: 0.12, gain: 0.08 * g, a: 0.002, pan: o.pan || 0, minor: o.minor });
    };
    const tick = (t, g = 1, f = 1700, pan = 0.15) => {
      k.noise(t, { dur: 0.016, filter: 'bandpass', f, q: 3, gain: 0.36 * g, a: 0.001, pan, minor: true });
      k.tone(t, { f: f * 0.55, dur: 0.035, gain: 0.065 * g, a: 0.001, pan, minor: true });
    };
    const glide = (t, dur, f0, f1, g = 1) => k.tone(t, { f: [[0, f0], [dur, f1]], dur: dur + 0.08, gain: 0.05 * g, a: dur * 0.4, hold: dur * 0.3, filter: 'lowpass', f2: 1400, verb: 0.25, minor: true });
    const counter = (val, a, b, gap, g, f) => { let last = -1, prev = val(a); for (let t = a; t <= b; t += 0.002) { const v = val(t); if (v !== prev && t - last >= gap) { tick(t, g, f); last = t; } prev = v; } };

    // ambient pad: minor loop, resolves to a major chord under the takeaway
    k.music('pad', 0, 17.3, { bpm: 64, gain: 0.5, chords: [['A2', 'E3', 'B3', 'C4'], ['F2', 'C3', 'E3', 'A3'], ['D3', 'A3', 'C4', 'E4'], ['E2', 'B2', 'E3', 'G#3']] });
    k.music('pad', 17.3, D, { bpm: 64, gain: 0.5, chords: [['A2', 'E3', 'A3', 'C#4']] });

    // beat 1: pipeline tile pops, title rises, title shrinks to the header
    whoosh(0.08, 0.4, 0.6);
    glass(0.36, 'A4', 1.1);
    whoosh(0.42, 0.75, 0.8, 1300);
    k.noise(X.shrink[0], { dur: 0.7, color: 'pink', filter: 'lowpass', f: [[0, 300], [0.4, 900], [0.7, 300]], gain: 0.16, a: 0.3 });

    // beat 2: sources pop in, lanes trace, stage chips land, messy values slide into the pipeline
    ['E4', 'G4', 'B4'].forEach((n, i) => glass(X.src + 0.25 + i * 0.12, n, 0.8, { pan: -0.6 }));
    whoosh(X.lanes[0], 0.6, 0.5, 1100, { minor: true });
    [0, 1, 2, 3].forEach((i) => tick(X.chips + 0.15 + i * 0.08, 0.7, 1500 + i * 120, -0.3 + i * 0.2));
    glass(X.hubPill + 0.1, 'C5', 0.6, { pan: 0.5, minor: true });
    ISSUES.forEach((is, i) => { const ta = X.issue0 + i * X.issueGap + X.travel * 0.95; k.tone(ta, { f: i % 2 ? 'D#4' : 'C4', type: 'triangle', dur: 0.2, gain: 0.07, a: 0.004, filter: 'lowpass', f2: 1000, verb: 0.3, pan: 0.6, minor: true }); });

    // push through the pipeline
    whoosh(X.push[0] - 0.05, 0.75, 1.3, 1700);
    k.play('thud', 5.26, { f: 85, gain: 0.45 });

    // beat 3: cards land, each cleaning step clicks on and its values resolve
    glass(X.cardsIn[1] - 0.1, 'E4', 0.6, { pan: -0.4, minor: true });
    glass(X.stepsIn[1] - 0.05, 'A4', 0.6, { pan: 0.4, minor: true });
    glass(X.youPill + 0.15, 'B4', 0.4, { minor: true });
    const up = ['C5', 'D5', 'E5', 'G5', 'A5'];
    X.toggles.forEach((tt, i) => {
      k.play('click', tt, { pan: 0.35, gain: 0.9 });
      glide(tt + 0.02, 0.3, 500, 900, 0.7);
      glass(tt + 0.3, up[i], 0.7, { pan: -0.2 });
    });
    k.play('swish', X.toggles[3] + 0.05, { dur: 0.25, gain: 0.7, pan: -0.3 });
    k.play('swish', X.toggles[4] + 0.05, { dur: 0.25, gain: 0.7, pan: -0.3 });
    k.tone(X.toggles[4] + 0.45, { f: [[0, 120], [0.3, 70]], dur: 0.32, gain: 0.18 });

    // beat 4: table morphs into the fact table, dimensions pop, relationships trace
    whoosh(X.morph[0], 0.6, 0.9, 1300);
    glass(X.morph[1], 'E5', 0.9);
    ['A4', 'C5', 'E5'].forEach((n, i) => glass(X.dims[i] + 0.25, n, 0.7, { pan: [-0.5, -0.5, 0.5][i] }));
    DIM_LINES.forEach((P, i) => glide(X.dimLines[0] + i * 0.1, 0.5, 260, 520, 0.6));

    // beat 5: hand-off to the other skills, hand-over items tick in
    whoosh(X.shrinkStar[0], 0.55, 0.8, 1200, { pan: -0.4 });
    ['E4', 'A4', 'B4'].forEach((n, i) => glass(X.skills[i] + 0.25, n, 0.8, { pan: 0 }));
    whoosh(X.handIn[0], 0.4, 0.5, 1200, { pan: 0.6, minor: true });
    X.items.forEach((tt, i) => glass(tt + 0.1, ['C5', 'E5', 'G5'][i], 0.6, { pan: 0.6 }));
    k.play('success', X.allDone, { gain: 0.55 });

    // beat 6: pan to the run-time card, minutes count up, bars grow, the 8 lands
    whoosh(X.pan[0], 0.6, 1.1, 1500);
    counter((t) => Math.min(8, Math.floor(8 * E.out(seg(X.count[0], X.count[1], t)) + 1e-6)), X.count[0] + 0.02, X.count[1] - 0.05, 0.085, 0.8, 1600);
    X.bars.forEach((tt, i) => k.noise(tt, { dur: 0.5, filter: 'bandpass', f: [[0, 600 + i * 200], [0.5, 1600 + i * 300]], q: 1.2, gain: 0.05, a: 0.2, pan: 0.4, minor: true }));
    k.noise(X.hit - 0.85, { dur: 0.85, color: 'pink', filter: 'bandpass', f: [[0, 180], [0.85, 1300]], q: 1, gain: 0.2, a: 0.8, verb: 0.2 });
    k.tone(X.hit - 0.85, { f: [[0, 110], [0.85, 220]], type: 'triangle', dur: 0.85, gain: 0.05, a: 0.8, filter: 'lowpass', f2: 900 });
    k.tone(X.hit, { f: [[0, 72], [0.6, 38]], dur: 1.3, gain: 0.7, a: 0.004 });
    k.play('thud', X.hit, { f: 105, gain: 0.8 });
    k.noise(X.hit, { dur: 0.5, color: 'brown', filter: 'lowpass', f: 320, gain: 0.3 });
    ['E5', 'B5', 'E6', 'G#6'].forEach((n, i) => k.tone(X.hit + 0.03 + i * 0.045, { f: n, dur: 1.6, gain: 0.032, a: 0.02, verb: 0.55, pan: (i - 1.5) * 0.35 }));
    k.noise(X.hit + 0.02, { dur: 1.1, color: 'pink', filter: 'highpass', f: [[0, 3000], [1.1, 6000]], gain: 0.035, a: 0.06, verb: 0.4 });

    // beat 7: pull back, tiles land, takeaway resolves
    whoosh(X.pull[0], 0.5, 0.8, 1200);
    glass(X.tkTiles[0] + 0.2, 'E4', 0.8, { pan: -0.4 });
    glass(X.tkTiles[1] + 0.2, 'A4', 0.8, { pan: 0.4 });
    whoosh(X.tkText[0], 0.45, 0.6, 1300, { minor: true });
    ['A3', 'E4', 'A4', 'C#5'].forEach((n, i) => k.tone(X.tkText[0] + 0.32 + i * 0.03, { f: n, type: i ? 'sine' : 'triangle', dur: 1.7, gain: 0.085, a: 0.015, verb: 0.45, pan: (i - 1.5) * 0.25 }));
    k.noise(X.underline[0], { dur: 0.45, filter: 'bandpass', f: [[0, 900], [0.45, 1800]], q: 1.2, gain: 0.05, a: 0.2, minor: true });
  }

  window.explainer = explainer;
  window.scoreSound = scoreSound;
  window.DURATION = X.D;
  window.EXPLAINER_X = X;
  window.EXPLAINER_FONTS = ['700 80px "Space Grotesk"', '700 28px "Space Grotesk"', '600 28px "Inter"', '400 28px "Inter"', '500 28px "Inter"'];
})();
