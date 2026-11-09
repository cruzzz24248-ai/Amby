/* 1) Datos de AMBY (data.js) -> textos, enlaces, tarjetas y hero. Se ejecuta primero para que las animaciones los tomen. */
(() => {
  const D = window.AMBY; if (!D) return;
  const $ = s => document.querySelector(s), M = D.modelos;
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
  document.querySelectorAll('[data-precio]').forEach(e => { const [id, ln] = e.dataset.precio.split(':'), m = M.find(x => x.id === id), l = D.lineas.find(x => x.id === ln); if (m) e.textContent = fmt(l ? m.m2 * l.usdM2 : m.precio); });
  const get = p => p.split('.').reduce((o, k) => o && o[k], D);
  document.querySelectorAll('[data-d]').forEach(e => { const v = get(e.dataset.d); if (v == null) return; Array.isArray(v) ? e.innerHTML = v.join(e.dataset.j === 'br' ? '<br>' : ', ') : e.textContent = v; });
  document.querySelectorAll('[data-wa]').forEach(a => { const t = D.msgs[a.dataset.wa]; a.href = `https://wa.me/${D.wa}` + (t ? `?text=${encodeURIComponent(t)}` : ''); });
  document.querySelectorAll('[data-map]').forEach(a => a.href = D.empresa.mapa);

  /* Secciones nuevas: líneas, comparativa, qué incluye, formas de pago (todo desde data.js) */
  const lc = $('#lineas-cards');
  if (lc) lc.innerHTML = D.lineas.map((l, i) => `<article class="ln ln${i} rv"><h3>${l.nombre}</h3><p class="ln-p"><small>desde</small><strong>USD ${l.usdM2.toLocaleString('es-AR')}</strong><span>/m²</span></p><p class="ln-d">${l.desc}</p></article>`).join('');
  const tb = $('#tabla-body');
  if (tb) tb.innerHTML = D.tabla.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
  const li = (id, a) => { const e = $(id); if (e) e.innerHTML = a.map(t => `<li>${t}</li>`).join(''); };
  li('#incluye', D.incluye); li('#noincluye', D.noIncluye); li('#pagos-lista', D.pagos);
  const cards = $('#cards');
  if (cards) cards.innerHTML = M.map(m => `<a class="card rv" href="${m.url}"><div class="im"><img loading="lazy" src="${m.img}" alt="Casa modular ${m.nombre} de ${m.m2} m²" width="900" height="1200"></div><div class="t"><h3>${m.nombre}</h3><span>${m.m2} m² · ${m.corto}</span><span class="from">Desde ${fmt(m.precio)}</span><em>Ver detalles y configurar</em></div></a>`).join('');

  const hz = $('#hz-svg'); if (!hz) return;
  $('#hz-l2').innerHTML = D.hero.l2;
  $('#hz-stats').innerHTML = D.hero.stats.map(s => `<li><strong>${s[0]}</strong><span>${s[1]}</span></li>`).join('');
  const stage = $('#hz-stage'), house = $('#hz-house'), dm = $('#hz-dm'), dt = $('#hz-dt'), num = $('#hz-m2');
  const NS = 'http://www.w3.org/2000/svg', B = 19, W = 120, nb = m => Math.max(1, Math.round(m.m2 / B)), N = Math.max(...M.map(nb));
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const slots = Array.from({ length: N }, (_, i) => {
    const g = mk('g', { class: 'bk' }, house);
    mk('rect', { class: 'wl', width: W, height: 108 }, g);
    for (let s = 1; s < 6; s++) mk('line', { class: 'sl', x1: s * W / 6, x2: s * W / 6, y1: 0, y2: 108 }, g);
    i ? mk('rect', { class: 'gl', x: 14, y: 24, width: W - 28, height: 58 }, g) : mk('rect', { class: 'gl', x: 12, y: 18, width: 34, height: 90 }, g);
    mk('rect', { class: 'rf', x: -4, y: -9, width: W + 8, height: 9 }, g);
    g.style.transform = 'translate(300px,40px)'; g.style.opacity = 0; return g;
  });
  $('#hz-pills').innerHTML = M.map(m => `<button type="button" aria-pressed="false">${m.id}</button>`).join('');
  $('#hz-fac').innerHTML = D.fachadas.map(f => `<button type="button" style="--c:${f.color}" aria-label="Fachada ${f.nombre}" title="${f.nombre}" aria-pressed="false"></button>`).join('');
  const pb = [...$('#hz-pills').children], fb = [...$('#hz-fac').children];
  let k = 0, shown = 0, tk = 0, auto = !rm, hold = false;
  const fac = i => { hz.style.setProperty('--wall', D.fachadas[i].color); fb.forEach((b, j) => b.setAttribute('aria-pressed', j === i)); };
  const tween = to => {
    const from = shown, t0 = performance.now(), id = ++tk; shown = to;
    const f = t => { if (id !== tk) return; const p = Math.min((t - t0) / 800, 1); num.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); p < 1 && requestAnimationFrame(f); };
    rm ? num.textContent = to : requestAnimationFrame(f);
  };
  const go = i => {
    k = (i + M.length) % M.length; const m = M[k], n = nb(m), x0 = (600 - n * W) / 2;
    slots.forEach((g, j) => { const on = j < n; g.style.transitionDelay = on ? `${j * 70}ms` : '0ms'; g.style.transform = `translate(${x0 + j * W}px,${on ? 142 : 40}px)`; g.style.opacity = on ? 1 : 0; });
    dm.style.transform = `translate(${x0}px,272px) scaleX(${n * W})`; dt.textContent = `${m.m2} m²`;
    pb.forEach((b, j) => b.setAttribute('aria-pressed', j === k));
    $('#hz-name').textContent = m.nombre; $('#hz-spec').textContent = m.corto;
    $('#hz-price').textContent = 'Desde ' + fmt(m.precio); $('#hz-link').href = m.url; tween(m.m2);
  };
  pb.forEach((b, i) => b.onclick = () => { auto = false; go(i); });
  fb.forEach((b, i) => b.onclick = () => fac(i));
  stage.addEventListener('pointerenter', () => hold = true); stage.addEventListener('pointerleave', () => hold = false);
  stage.addEventListener('focusin', () => hold = true); stage.addEventListener('focusout', () => hold = false);
  setInterval(() => auto && !hold && !document.hidden && go(k + 1), 4800);
  if (!rm && matchMedia('(hover:hover)').matches) {
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); stage.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 8}deg`); stage.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 5}deg`); });
    stage.addEventListener('pointerleave', () => { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
  }
  fac(Math.max(0, D.fachadas.findIndex(f => f.id === 'siding'))); void hz.getBoundingClientRect(); go(0);
})();
/* 2) Proceso: escena guiada por el scroll (todo ocurre en la fábrica) */
(() => {
  const D = window.AMBY, svg = document.querySelector('#pz-svg'), box = document.querySelector('#proceso'); if (!D || !svg) return;
  const list = document.querySelector('#pz-list');
  list.innerHTML = D.proceso.map(s => `<li><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('');
  const li = [...list.children], NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const clamp = v => Math.min(Math.max(v, 0), 1), seg = (p, a, b) => clamp((p - a) / (b - a)), ez = t => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
  mk('path', { class: 'pz-shed', d: 'M170 250V118Q400 58 630 118V250Z' }, svg);
  mk('line', { class: 'gr', x1: 0, x2: 800, y1: 250, y2: 250 }, svg);
  mk('text', { class: 'dt', x: 400, y: 294, 'text-anchor': 'middle' }, svg).textContent = 'Nuestra fábrica · Villa Parque Santa Ana';
  const mod = mk('g', { transform: 'translate(295 160)' }, svg);
  const blocks = [0, 1, 2].map(i => {
    const g = mk('g', { transform: `translate(${i * 70} 0)` }, mod);
    mk('rect', { class: 'wl', width: 70, height: 90 }, g);
    for (let s = 1; s < 6; s++) mk('line', { class: 'sl', x1: s * 70 / 6, x2: s * 70 / 6, y1: 0, y2: 90 }, g);
    i ? mk('rect', { class: 'gl', x: 12, y: 20, width: 46, height: 48 }, g) : mk('rect', { class: 'gl', x: 10, y: 14, width: 28, height: 76 }, g);
    mk('rect', { class: 'rf', x: -3, y: -8, width: 76, height: 8 }, g); return g;
  });
  const tag = mk('g', { class: 'pz-tag' }, svg); mk('rect', { x: 290, y: 12, width: 220, height: 28, rx: 14 }, tag); mk('text', { x: 400, y: 31, 'text-anchor': 'middle' }, tag).textContent = 'Terminado en fábrica ✓';
  const S = [0, .25, .5, .75, 1];
  const draw = p => {
    blocks.forEach((g, i) => {
      const fb = seg(p, .5 + i * .06, .62 + i * .06);
      g.style.opacity = seg(p, i * .05, i * .05 + .12); g.style.setProperty('--fo', .35 * seg(p, .25, .4) + .65 * fb);
      g.style.setProperty('--gl', fb > .99 ? .35 + .65 * seg(p, .8, .92) : 0); g.classList.toggle('sd', fb > .99);
    });
    tag.style.opacity = seg(p, .9, .97);
    const a = p < .25 ? 0 : p < .5 ? 1 : p < .75 ? 2 : 3;
    li.forEach((e, i) => { e.classList.toggle('on', i === a); e.classList.toggle('done', i < a); e.style.setProperty('--sp', clamp((p - S[i]) / (S[i + 1] - S[i]))); i === a ? e.setAttribute('aria-current', 'step') : e.removeAttribute('aria-current'); });
  };
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches, DUR = 28000, pp = document.querySelector('#pz-pp');
  let p = 0, t0 = 0, hold = 0, tw = null, raf = 0, vis = false, manual = false, hov = false;
  const label = () => { if (pp) { pp.textContent = manual ? 'Reanudar' : 'Pausar'; pp.setAttribute('aria-pressed', manual); } };
  const frame = t => {
    const dt = Math.min(t - (t0 || t), 64); t0 = t;
    if (tw) { const k = clamp((t - tw.s) / tw.d); p = lerp(tw.a, tw.b, ez(k)); if (k >= 1) tw = null; }
    else if (manual || hov) { /* el visitante está leyendo */ }
    else if (hold > 0) { hold -= dt; if (hold <= 0) p = 0; }
    else { p += dt / DUR; if (p >= 1) { p = 1; hold = 4000; } }
    draw(p);
  };
  const loop = t => { frame(t); raf = requestAnimationFrame(loop); };
  const start = () => { if (!raf && !rm) { t0 = 0; raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const jump = i => { const b = S[i] + .001; hold = 0; manual = true; label(); if (rm) { p = b; draw(p); return; } tw = { a: p, b, s: performance.now(), d: 700 }; start(); };
  li.forEach((e, i) => { e.tabIndex = 0; e.setAttribute('role', 'button'); e.onclick = () => jump(i); e.onkeydown = ev => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), jump(i)); });
  if (pp) {
    pp.parentElement.hidden = rm;
    pp.onclick = () => { manual = !manual; label(); if (!manual) { hold = 0; if (p >= 1) p = 0; start(); } };
  }
  if (matchMedia('(hover:hover)').matches) [list, svg].forEach(el => { el.addEventListener('pointerenter', () => hov = true); el.addEventListener('pointerleave', () => hov = false); });
  list.addEventListener('focusin', () => hov = true); list.addEventListener('focusout', () => hov = false);
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; vis && !document.hidden ? start() : stop(); }), { threshold: .25 }).observe(box);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : vis && start());
  p = rm ? .97 : 0; draw(p);
})();
/* 3) Steel frame en capas, logo de WhatsApp y galería de proyectos */
(() => {
  const D = window.AMBY, svg = document.querySelector('#sf-svg'), box = document.querySelector('#sistema'); if (!D || !svg) return;
  const list = document.querySelector('#sf-list'); list.innerHTML = D.capas.map(c => `<li><h3>${c[0]}</h3><p>${c[1]}</p></li>`).join('');
  const li = [...list.children], NS = 'http://www.w3.org/2000/svg', rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const X = 90, Wd = 360, H = 50, SK = 70, th = [14, 8, 26, 34, 10], Y = [20, 85, 150, 215, 285], n = th.length;
  let run = 90; const off = th.map((t, i) => { const o = run - Y[i]; run += t + 1; return o; });
  const layers = [];
  for (let i = n - 1; i >= 0; i--) {
    const g = mk('g', { class: 'ly' }, svg), y = Y[i], t = th[i], c = D.capas[i][2];
    mk('polygon', { class: 'fr', fill: c, points: `${X},${y + H} ${X + Wd},${y + H} ${X + Wd},${y + H + t} ${X},${y + H + t}` }, g);
    mk('polygon', { class: 'sd', fill: c, points: `${X + Wd},${y + H} ${X + Wd + SK},${y} ${X + Wd + SK},${y + t} ${X + Wd},${y + H + t}` }, g);
    const tp = mk('polygon', { class: 'tp', fill: c, points: `${X + SK},${y} ${X + SK + Wd},${y} ${X + Wd},${y + H} ${X},${y + H}` }, g);
    if (i === 3) { tp.setAttribute('fill-opacity', '.15'); for (let k = 0; k < 7; k++) { const u = k * Wd / 6; mk('line', { class: 'stud', x1: X + SK + u, y1: y, x2: X + u, y2: y + H }, g); } }
    layers[i] = g;
  }
  let sel = -1, auto = !rm, timer = 0;
  const set = s => { sel = s; layers.forEach((g, i) => { g.classList.toggle('on', i === s); g.style.opacity = s < 0 || i === s ? 1 : .3; }); li.forEach((e, i) => e.classList.toggle('on', i === s)); };
  const explode = on => layers.forEach((g, i) => g.style.transform = `translateY(${on ? 0 : off[i]}px)`);
  const pick = i => { auto = false; set(i); };
  layers.forEach((g, i) => g.onclick = () => pick(i));
  li.forEach((e, i) => { e.tabIndex = 0; e.setAttribute('role', 'button'); e.onclick = () => pick(i); e.onkeydown = ev => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), pick(i)); });
  explode(false); set(-1);
  new IntersectionObserver(es => es.forEach(e => {
    clearInterval(timer);
    if (e.isIntersecting) { explode(true); set(rm ? -1 : 0); if (!rm) timer = setInterval(() => auto && !document.hidden && set((sel + 1) % n), 3200); }
    else { explode(false); set(-1); auto = !rm; }
  }), { threshold: .35 }).observe(svg);
})();
(() => {
  const WA = '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  document.querySelectorAll('.wa,a[data-wa][aria-label="WhatsApp"]').forEach(a => a.innerHTML = WA);
  document.querySelectorAll('a.btn[data-wa]').forEach(a => a.insertAdjacentHTML('afterbegin', WA.replace('<svg', '<svg class="wi"')));
  const fs = [...document.querySelectorAll('#proyectos figure')];
  fs.forEach(f => f.addEventListener('click', () => { const o = f.classList.contains('open'); fs.forEach(x => x.classList.remove('open')); !o && f.classList.add('open'); }));
})();
/* 3b) Botón flotante de WhatsApp: posición fija; solo se oculta cerca del pie/CTA */
(() => {
  const wa = document.querySelector('.wa'); if (!wa) return;
  const seen = new Set(), n2 = document.querySelector('.nav2');
  const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); wa.classList.toggle('off', seen.size > 0); n2 && n2.classList.toggle('off', seen.size > 0); });
  document.querySelectorAll('footer,.cta,#fabrica').forEach(e => io.observe(e));
})();
/* 4) Interacciones generales */
(() => {
  const $ = (s, c = document) => [...c.querySelectorAll(s)];
  const top = $('.top')[0], bar = $('.bar')[0], upb = $('.up')[0], burger = $('.burger')[0], menu = $('#menu')[0];
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú'); };
  matchMedia('(min-width:1024px)').addEventListener('change', e => e.matches && setMenu(false));
  addEventListener('click', e => menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target) && setMenu(false));
  burger.onclick = () => setMenu(!menu.classList.contains('open'));
  menu.onclick = e => e.target.closest('a') && setMenu(false);
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    top.classList.toggle('sc', y > 10);
    const pv = h > 0 ? y / h : 0; bar.style.setProperty('--p', pv); if (upb) upb.style.setProperty('--p', pv);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const c = e.target.querySelector('[data-count]');
    if (c) count(c);
  }), { threshold: .15 });
  $('.rv').forEach((el, i) => { el.style.setProperty('--d', `${(i % 4) * .08}s`); io.observe(el); });

  function count(el) {
    const to = +el.dataset.count, t0 = performance.now();
    const f = t => { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); k < 1 && requestAnimationFrame(f); };
    rm ? el.textContent = to : requestAnimationFrame(f);
  }

  if (!rm && matchMedia('(hover:hover)').matches) {
    $('.card').forEach(c => {
      c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${(e.clientX - r.left) / r.width * 100}%`); c.style.setProperty('--my', `${(e.clientY - r.top) / r.height * 100}%`); c.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 4}deg`); c.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 4}deg`); });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', 0); c.style.setProperty('--ry', 0); });
    });
    $('.btn').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
  }
  const y = $('#y')[0]; if (y) y.textContent = new Date().getFullYear();
})();
(() => {
  const bad = i => { i.style.opacity = 0; i.parentElement.classList.add('ph'); };
  const ok = i => { i.style.opacity = ''; i.parentElement.classList.remove('ph'); };
  document.querySelectorAll('img').forEach(i => {
    i.addEventListener('error', () => bad(i)); i.addEventListener('load', () => ok(i));
    if (i.complete && !i.naturalWidth && i.getAttribute('loading') !== 'lazy') bad(i);
  });
})();
(() => {
  const up = document.querySelector('.up');
  if (up) up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();
/* 5) Pantalla de entrada (camión con la casa): una vez por sesión; con ?intro se fuerza */
(() => {
  const intro = document.getElementById('intro'); if (!intro) return;
  const root = document.documentElement;
  if (root.classList.contains('no-intro')) { intro.remove(); return; }
  let closed = false;
  const done = () => {
    if (closed) return; closed = true;
    try { sessionStorage.setItem('amby-intro', '1'); } catch (e) {}
    root.classList.remove('intro-on'); intro.remove();
  };
  intro.addEventListener('animationend', e => { if (e.target === intro && e.animationName === 'inout') done(); });
  const skip = () => intro.classList.add('skipping');
  intro.addEventListener('click', skip);
  addEventListener('keydown', e => { if (['Escape', 'Enter', ' '].includes(e.key)) skip(); });
  setTimeout(done, 5500);
})();
