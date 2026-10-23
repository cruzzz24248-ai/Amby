/* 1) Datos de AMBY (data.js) -> textos, enlaces, tarjetas y hero. Se ejecuta primero para que las animaciones los tomen. */
(() => {
  const D = window.AMBY; if (!D) return;
  const $ = s => document.querySelector(s), M = D.modelos;
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
  document.querySelectorAll('[data-precio]').forEach(e => { const m = M.find(x => x.id === e.dataset.precio); if (m) e.textContent = fmt(m.precio); });
  const get = p => p.split('.').reduce((o, k) => o && o[k], D);
  document.querySelectorAll('[data-d]').forEach(e => { const v = get(e.dataset.d); if (v == null) return; Array.isArray(v) ? e.innerHTML = v.join(e.dataset.j === 'br' ? '<br>' : ', ') : e.textContent = v; });
  document.querySelectorAll('[data-wa]').forEach(a => { const t = D.msgs[a.dataset.wa]; a.href = `https://wa.me/${D.wa}` + (t ? `?text=${encodeURIComponent(t)}` : ''); });
  document.querySelectorAll('[data-map]').forEach(a => a.href = D.empresa.mapa);
  const cards = $('#cards');
  if (cards) cards.innerHTML = M.map(m => `<a class="card rv" href="${m.url}"><div class="im"><img loading="lazy" src="${m.img}" alt="Casa modular ${m.nombre} de ${m.m2} m²" width="800" height="600"></div><div class="t"><h3>${m.nombre}</h3><span>${m.m2} m² · ${m.corto}</span><span class="from">Desde ${fmt(m.precio)}</span><em>Ver detalles y configurar</em></div></a>`).join('');

  const hz = $('#hz-svg'); if (!hz) return;
  $('#hz-l2').innerHTML = `${D.hero.l2} <b>${D.empresa.entrega} días</b>.`;
  $('#hz-stats').innerHTML = D.hero.stats.map(s => `<li><strong>${s[0]}</strong><span>${s[1]}</span></li>`).join('');
  const stage = $('#hz-stage'), house = $('#hz-house'), dm = $('#hz-dm'), dt = $('#hz-dt'), num = $('#hz-m2');
  const NS = 'http://www.w3.org/2000/svg', B = 15, W = 84, N = Math.max(...M.map(m => m.m2 / B));
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
    k = (i + M.length) % M.length; const m = M[k], n = m.m2 / B, x0 = (600 - n * W) / 2;
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
  fac(Math.max(0, D.fachadas.findIndex(f => f.id === 'madera'))); void hz.getBoundingClientRect(); go(0);
})();
/* 2) Proceso: escena guiada por el scroll */
(() => {
  const D = window.AMBY, svg = document.querySelector('#pz-svg'), box = document.querySelector('#proceso'); if (!D || !svg) return;
  const list = document.querySelector('#pz-list');
  list.innerHTML = D.proceso.map(s => `<li><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('');
  const li = [...list.children], NS = 'http://www.w3.org/2000/svg';
  const mk = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };
  const clamp = v => Math.min(Math.max(v, 0), 1), seg = (p, a, b) => clamp((p - a) / (b - a)), ez = t => 1 - Math.pow(1 - t, 3), lerp = (a, b, t) => a + (b - a) * t;
  mk('path', { class: 'pz-shed', d: 'M10 250V140Q130 90 250 140V250Z' }, svg);
  mk('rect', { class: 'pz-slab', x: 560, y: 244, width: 230, height: 6 }, svg);
  mk('line', { class: 'gr', x1: 0, x2: 800, y1: 250, y2: 250 }, svg);
  const road = mk('line', { class: 'pz-road', x1: 0, x2: 800, y1: 270, y2: 270 }, svg);
  [[130, 'Fábrica'], [675, 'Tu terreno']].forEach(([x, t]) => { mk('text', { class: 'dt', x, y: 294, 'text-anchor': 'middle' }, svg).textContent = t; });
  const cr = mk('g', { class: 'pz-cr' }, svg); mk('line', { x1: 548, x2: 548, y1: 250, y2: 38 }, cr); mk('line', { x1: 520, x2: 790, y1: 38, y2: 38 }, cr);
  const cable = mk('path', { class: 'pz-cb' }, svg);
  const tk = mk('g', { class: 'pz-tk' }, svg);
  mk('rect', { x: 0, y: 236, width: 234, height: 8 }, tk); mk('rect', { x: 238, y: 200, width: 46, height: 44, rx: 4 }, tk); mk('rect', { x: 262, y: 207, width: 16, height: 14, rx: 2, class: 'gl' }, tk);
  [30, 60, 200, 262].forEach(x => mk('circle', { cx: x, cy: 241, r: 9 }, tk));
  const mod = mk('g', {}, svg);
  const blocks = [0, 1, 2].map(i => {
    const g = mk('g', { transform: `translate(${i * 70} 0)` }, mod);
    mk('rect', { class: 'wl', width: 70, height: 90 }, g);
    for (let s = 1; s < 6; s++) mk('line', { class: 'sl', x1: s * 70 / 6, x2: s * 70 / 6, y1: 0, y2: 90 }, g);
    i ? mk('rect', { class: 'gl', x: 12, y: 20, width: 46, height: 48 }, g) : mk('rect', { class: 'gl', x: 10, y: 14, width: 28, height: 76 }, g);
    mk('rect', { class: 'rf', x: -3, y: -8, width: 76, height: 8 }, g); return g;
  });
  const tag = mk('g', { class: 'pz-tag' }, svg); mk('rect', { x: 598, y: 104, width: 164, height: 28, rx: 14 }, tag); mk('text', { x: 680, y: 123, 'text-anchor': 'middle' }, tag).textContent = 'Llave en mano ✓';
  const S = [0, .15, .3, .5, 1];
  const draw = p => {
    blocks.forEach((g, i) => {
      const fb = seg(p, .3 + i * .05, .4 + i * .05);
      g.style.opacity = seg(p, i * .04, i * .04 + .1); g.style.setProperty('--fo', .35 * seg(p, .15, .3) + .65 * fb);
      g.style.setProperty('--gl', fb > .99 ? .35 + .65 * seg(p, .94, 1) : 0); g.classList.toggle('sd', fb > .99);
    });
    const arr = ez(seg(p, .5, .56)), trav = ez(seg(p, .56, .76)), up = ez(seg(p, .76, .82)), out = seg(p, .8, .9), dn = ez(seg(p, .84, .94));
    const mx = 30 + 545 * trav, my = 160 - 14 * arr - 70 * up + 78 * dn;
    mod.style.transform = `translate(${mx}px,${my}px)`;
    tk.style.transform = `translate(${lerp(-320, 18, arr) + 545 * trav + out * 300}px,0)`; tk.style.opacity = arr > 0 ? 1 - out : 0;
    cr.style.opacity = seg(p, .7, .76);
    cable.setAttribute('d', `M${mx + 105} 38L${mx + 30} ${my - 9}M${mx + 105} 38L${mx + 180} ${my - 9}`); cable.style.opacity = seg(p, .74, .78) * (1 - seg(p, .93, .96));
    road.style.strokeDashoffset = -p * 1100; tag.style.opacity = seg(p, .96, 1);
    const a = p < .15 ? 0 : p < .3 ? 1 : p < .5 ? 2 : 3;
    li.forEach((e, i) => { e.classList.toggle('on', i === a); e.classList.toggle('done', i < a); e.style.setProperty('--sp', clamp((p - S[i]) / (S[i + 1] - S[i]))); i === a ? e.setAttribute('aria-current', 'step') : e.removeAttribute('aria-current'); });
  };
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches, DUR = 18000;
  let p = 0, t0 = 0, hold = 0, tw = null, raf = 0, vis = false;
  const frame = t => {
    const dt = Math.min(t - (t0 || t), 64); t0 = t;
    if (tw) { const k = clamp((t - tw.s) / tw.d); p = lerp(tw.a, tw.b, ez(k)); if (k >= 1) tw = null; }
    else if (hold > 0) { hold -= dt; if (hold <= 0) p = 0; }
    else { p += dt / DUR; if (p >= 1) { p = 1; hold = 2800; } }
    draw(p);
  };
  const loop = t => { frame(t); raf = requestAnimationFrame(loop); };
  const start = () => { if (!raf && !rm) { t0 = 0; raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const jump = i => { const b = S[i] + .001; hold = 0; if (rm) { p = b; draw(p); return; } tw = { a: p, b, s: performance.now(), d: 700 }; start(); };
  li.forEach((e, i) => { e.tabIndex = 0; e.setAttribute('role', 'button'); e.onclick = () => jump(i); e.onkeydown = ev => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), jump(i)); });
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
  burger.onclick = () => setMenu(!menu.classList.contains('open'));
  menu.onclick = e => e.target.closest('a') && setMenu(false);
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  const hi = $('.hero-img img')[0], st = $('.steps')[0];
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    top.classList.toggle('sc', y > 10);
    if (st) { const r = st.getBoundingClientRect(); st.style.setProperty('--sp', Math.min(Math.max((innerHeight * .85 - r.top) / (innerHeight * .5), 0), 1)); }
    const pv = h > 0 ? y / h : 0; bar.style.setProperty('--p', pv); if (upb) upb.style.setProperty('--p', pv);
    if (hi && !rm && y < innerHeight) hi.style.setProperty('--py', `${-y * .06}px`);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    const c = e.target.querySelector('[data-count]');
    if (c) count(c);
  }), { threshold: .15 });
  $('.rv').forEach((el, i) => { el.style.setProperty('--d', `${(i % 4) * .08}s`); io.observe(el); });
  $('.steps li').forEach((el, i) => { el.style.transitionDelay = `${i * .15}s`; io.observe(el); });

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
  const chips = [...document.querySelectorAll('.chip')], g = document.querySelector('.grid');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    const f = c.dataset.f; g.classList.add('flt');
    g.querySelectorAll('figure').forEach(fg => {
      const show = f === 'todos' || fg.dataset.c === f;
      fg.classList.toggle('out', !show);
      if (show) { fg.classList.remove('pop'); void fg.offsetWidth; fg.classList.add('pop'); }
    });
  }));
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
