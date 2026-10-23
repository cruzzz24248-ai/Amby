(() => {
  const D = window.AMBY, $ = s => document.querySelector(s);
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const S = { modelo: null, fachada: D.fachadas[0], term: D.terminaciones[0], extras: new Set(), nombre: '', tel: '', msg: '' };
  S.modelo = D.modelos.find(m => m.id === new URLSearchParams(location.search).get('modelo')) || null;
  const steps = ['Modelo', 'Fachada', 'Terminación', 'Extras', 'Tus datos'];
  let step = S.modelo ? 1 : 0, shown = 0, tk = 0;
  const panel = $('#panel'), stp = $('#stp');
  const m2 = () => S.modelo ? S.modelo.m2 : 0;
  const delta = o => o.usdM2 * m2();
  const extras = () => [...S.extras].map(id => D.extras.find(e => e.id === id));
  const total = () => S.modelo ? S.modelo.precio + delta(S.fachada) + delta(S.term) + extras().reduce((a, e) => a + e.precio, 0) : 0;
  const dl = o => o.usdM2 ? '+ ' + fmt(delta(o)) : 'Incluida';
  const pr = t => `<em class="pr">${t}</em>`;

  const opts = (arr, sel, inner) => `<div class="opts">${arr.map(o => `<button type="button" class="opt" data-id="${o.id}" aria-pressed="${sel(o)}">${inner(o)}</button>`).join('')}</div>`;
  const views = [
    () => opts(D.modelos, o => S.modelo?.id === o.id, o => `<h3>${o.nombre}</h3><strong>${o.m2} m²</strong><small>${o.desc}</small>${pr('Desde ' + fmt(o.precio))}`),
    () => opts(D.fachadas, o => S.fachada.id === o.id, o => `<span class="sw" style="background:${o.color}"></span><h3>${o.nombre}</h3>${pr(dl(o))}`),
    () => opts(D.terminaciones, o => S.term.id === o.id, o => `<h3>${o.nombre}</h3><small>${o.desc}</small>${pr(dl(o))}`),
    () => opts(D.extras, o => S.extras.has(o.id), o => `<h3>${o.nombre}</h3>${pr('+ ' + fmt(o.precio))}<small>${S.extras.has(o.id) ? 'Agregado' : 'Tocá para agregar'}</small>`),
    () => `<form class="fm" id="fm" novalidate><label>Nombre<input name="n" autocomplete="name" value="${esc(S.nombre)}"></label><label>Teléfono<input name="t" type="tel" autocomplete="tel" value="${esc(S.tel)}"></label><label>Comentarios<textarea name="m">${esc(S.msg)}</textarea></label><p class="err" role="alert" hidden>Ingresá tu nombre para enviar.</p></form>`
  ];

  function render(still) {
    stp.innerHTML = steps.map((s, i) => `<li class="${i <= step ? 'on' : ''}">${i + 1}. ${s}</li>`).join('');
    $('#stl').textContent = `Paso ${step + 1} de ${steps.length} · ${steps[step]}`;
    panel.innerHTML = `<div class="panel${still ? ' still' : ''}"><h2>${steps[step]}</h2>${views[step]()}</div>`;
    $('#back').hidden = !step;
    $('#next').textContent = step === 4 ? 'Enviar por WhatsApp' : 'Continuar';
    $('#next').disabled = step === 0 && !S.modelo;
    summary();
  }
  function summary() {
    const m = S.modelo, w = m ? 120 + m.m2 * 1.1 : 150, x = 200 - w / 2, t = total();
    const row = (k, v, p) => `<dt>${k}</dt><dd>${v}${p ? `<small>${p}</small>` : ''}</dd>`;
    $('#sum').innerHTML = `<svg viewBox="0 0 400 220" role="img" aria-label="Vista previa del módulo"><rect x="0" y="190" width="400" height="30" fill="#fff" opacity=".1"/><g style="transform-origin:200px 190px;transform:scale(${m ? 1 : .85});transition:transform .6s"><rect class="wall" x="${x}" y="90" width="${w}" height="100" fill="${S.fachada.color}"/><polygon class="roof" points="${x - 10},92 200,40 ${x + w + 10},92" fill="${S.term.id === 'premium' ? '#f2a01e' : '#8a8a8a'}"/><rect x="${x + w * .3}" y="115" width="${w * .4}" height="75" fill="#ffd98a" opacity=".85"/>${S.extras.has('deck') ? `<rect x="${x - 20}" y="184" width="${w + 40}" height="8" fill="#a9703a"/>` : ''}</g></svg>
    <dl>${row('Modelo', m ? `${m.nombre} · ${m.m2} m²` : 'Sin elegir', m ? fmt(m.precio) : '')}${row('Fachada', S.fachada.nombre, m ? dl(S.fachada) : '')}${row('Terminación', S.term.nombre, m ? dl(S.term) : '')}${extras().length ? extras().map(e => row('Extra', e.nombre, '+ ' + fmt(e.precio))).join('') : row('Extras', 'Ninguno', '')}</dl>
    <div class="tot"><span>Estimado orientativo</span><strong id="tot">${m ? fmt(shown) : '—'}</strong><small>Valores de referencia, sin flete ni terreno. La cotización final la confirma nuestro equipo.</small></div>`;
    $('#mini').innerHTML = m ? `Estimado <strong>${fmt(t)}</strong>` : '';
    if (!m) { shown = 0; return; }
    const el = $('#tot'), from = shown, id = ++tk, t0 = performance.now(); shown = t;
    if (rm) { el.textContent = fmt(t); return; }
    const f = now => { if (id !== tk) return; const k = Math.min((now - t0) / 700, 1); el.textContent = fmt(from + (t - from) * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  panel.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const id = b.dataset.id;
    if (step === 0) S.modelo = D.modelos.find(o => o.id === id);
    if (step === 1) S.fachada = D.fachadas.find(o => o.id === id);
    if (step === 2) S.term = D.terminaciones.find(o => o.id === id);
    if (step === 3) S.extras.has(id) ? S.extras.delete(id) : S.extras.add(id);
    render(true); panel.querySelector(`[data-id="${id}"]`)?.focus({ preventScroll: true });
  });
  $('#back').onclick = () => { save(); step--; render(); };
  $('#next').onclick = () => {
    save();
    if (step < 4) { step++; render(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (!S.nombre.trim()) { $('.err').hidden = false; $('#fm').n.focus(); return; }
    const l = [`Hola Amby, soy ${S.nombre.trim()}${S.tel ? ` (${S.tel})` : ''}. Armé este proyecto en la web:`, `• Modelo: ${S.modelo.nombre} (${S.modelo.m2} m²)`, `• Fachada: ${S.fachada.nombre}`, `• Terminación: ${S.term.nombre}`, `• Extras: ${extras().map(e => e.nombre).join(', ') || 'ninguno'}`, `• Estimado orientativo: ${fmt(total())}`];
    if (S.msg.trim()) l.push(`• Comentarios: ${S.msg.trim()}`);
    open(`https://wa.me/${D.wa}?text=${encodeURIComponent(l.join('\n'))}`, '_blank', 'noopener');
  };
  function save() { const f = $('#fm'); if (f) { S.nombre = f.n.value; S.tel = f.t.value; S.msg = f.m.value; } }
  render();
})();
