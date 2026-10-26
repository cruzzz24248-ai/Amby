(() => {
  const D = window.AMBY, $ = s => document.querySelector(s);
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const q = new URLSearchParams(location.search);
  const S = { modelo: null, fachada: D.fachadas[0], linea: D.lineas.find(l => l.id === q.get('linea')) || D.lineas[0], extras: new Set(), nombre: '', tel: '', ubic: '', plazo: '', msg: '' };
  S.modelo = D.modelos.find(m => m.id === q.get('modelo')) || null;
  const steps = ['Modelo', 'Línea', 'Fachada', 'Extras', 'Tus datos'];
  let step = S.modelo ? 1 : 0, shown = 0, tk = 0;
  const panel = $('#panel'), stp = $('#stp');
  const m2 = () => S.modelo ? S.modelo.m2 : 0;
  const precioLinea = l => m2() * l.usdM2;
  const extras = () => [...S.extras].map(id => D.extras.find(e => e.id === id));
  const total = () => S.modelo ? precioLinea(S.linea) : 0;
  const pr = t => `<em class="pr">${t}</em>`;

  const opts = (arr, sel, inner) => `<div class="opts">${arr.map(o => `<button type="button" class="opt" data-id="${o.id}" aria-pressed="${sel(o)}">${inner(o)}</button>`).join('')}</div>`;
  const views = [
    () => opts(D.modelos, o => S.modelo?.id === o.id, o => `<h3>${o.nombre}</h3><strong>${o.m2} m²</strong><small>${o.desc}</small>${pr('Desde ' + fmt(o.precio))}`),
    () => opts(D.lineas, o => S.linea.id === o.id, o => `<h3>${o.nombre}</h3><small>${o.desc}</small>${pr(S.modelo ? fmt(precioLinea(o)) : 'USD ' + o.usdM2.toLocaleString('es-AR') + ' /m²')}<small>USD ${o.usdM2.toLocaleString('es-AR')} por m²</small>`),
    () => opts(D.fachadas, o => S.fachada.id === o.id, o => `<span class="sw" style="background:${o.color}"></span><h3>${o.nombre}</h3>${pr('A elección')}`),
    () => opts(D.extras, o => S.extras.has(o.id), o => `<h3>${o.nombre}</h3><small>${o.desc}</small>${pr(S.extras.has(o.id) ? 'Agregado · a cotizar' : 'A cotizar según proyecto')}`),
    () => `<form class="fm" id="fm" novalidate><label>Nombre<input name="n" autocomplete="name" value="${esc(S.nombre)}"></label><label>Teléfono<input name="t" type="tel" autocomplete="tel" value="${esc(S.tel)}"></label><label>Ubicación del terreno<input name="u" autocomplete="address-level2" placeholder="Dónde se va a montar" value="${esc(S.ubic)}"></label><label>Plazo<input name="p" placeholder="¿Para cuándo lo querés?" value="${esc(S.plazo)}"></label><label>Comentarios<textarea name="m">${esc(S.msg)}</textarea></label><p class="err" role="alert" hidden>Ingresá tu nombre para enviar.</p><p class="note">Te contestamos a la brevedad.</p></form>`
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
    const m = S.modelo, w = m ? 110 + m.m2 * 2.2 : 150, x = 200 - w / 2, t = total();
    const row = (k, v, p) => `<dt>${k}</dt><dd>${v}${p ? `<small>${p}</small>` : ''}</dd>`;
    const roof = { premium: '#8a8a8a', plus: '#c9a063', deluxe: '#f2a01e' }[S.linea.id];
    const pergola = S.extras.has('pergola') ? `<rect x="${x + w - 6}" y="104" width="46" height="5" fill="#2a2a2a"/><rect x="${x + w + 36}" y="104" width="4" height="86" fill="#2a2a2a"/>` : '';
    const pilotes = S.extras.has('pilotes') ? [0, .33, .66, 1].map(k => `<rect x="${x + 4 + k * (w - 12)}" y="190" width="5" height="12" fill="#c9ced6"/>`).join('') : '';
    const cerr = S.extras.has('cerramientos') ? `<rect x="${x + w * .3}" y="115" width="${w * .4}" height="75" fill="none" stroke="#141414" stroke-width="2" stroke-dasharray="5 4"/>` : '';
    $('#sum').innerHTML = `<svg viewBox="0 0 400 220" role="img" aria-label="Vista previa del módulo"><rect x="0" y="190" width="400" height="30" fill="#fff" opacity=".1"/><g style="transform-origin:200px 190px;transform:scale(${m ? 1 : .85});transition:transform .6s"><rect class="wall" x="${x}" y="90" width="${w}" height="100" fill="${S.fachada.color}"/><polygon class="roof" points="${x - 10},92 200,40 ${x + w + 10},92" fill="${roof}"/><rect x="${x + w * .3}" y="115" width="${w * .4}" height="75" fill="#ffd98a" opacity=".85"/>${cerr}${pergola}${pilotes}</g></svg>
    <dl>${row('Modelo', m ? `${m.nombre} · ${m.m2} m²` : 'Sin elegir', '')}${row('Línea', S.linea.nombre, m ? fmt(precioLinea(S.linea)) : `USD ${S.linea.usdM2.toLocaleString('es-AR')} /m²`)}${row('Fachada', S.fachada.nombre, '')}${extras().length ? extras().map(e => row('Extra', e.nombre, 'A cotizar')).join('') : row('Extras', 'Ninguno', '')}</dl>
    <div class="tot"><span>Estimado orientativo</span><strong id="tot">${m ? fmt(shown) : '—'}</strong><small>Valores de referencia por m² cubierto, sin IVA (${String(D.iva).replace('.', ',')}%), traslado, montaje ni trabajos en terreno. Los extras se cotizan según proyecto. Pago contado: 5% de descuento. La cotización final la confirma nuestro equipo.</small></div>`;
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
    if (step === 1) S.linea = D.lineas.find(o => o.id === id);
    if (step === 2) S.fachada = D.fachadas.find(o => o.id === id);
    if (step === 3) S.extras.has(id) ? S.extras.delete(id) : S.extras.add(id);
    render(true); panel.querySelector(`[data-id="${id}"]`)?.focus({ preventScroll: true });
  });
  $('#back').onclick = () => { save(); step--; render(); };
  $('#next').onclick = () => {
    save();
    if (step < 4) { step++; render(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (!S.nombre.trim()) { $('.err').hidden = false; $('#fm').n.focus(); return; }
    const l = [`Hola Amby, soy ${S.nombre.trim()}${S.tel ? ` (${S.tel})` : ''}. Armé este proyecto en la web:`, `• Modelo: ${S.modelo.nombre} (${S.modelo.m2} m²)`, `• Línea: ${S.linea.nombre}`, `• Fachada: ${S.fachada.nombre}`, `• Extras: ${extras().map(e => e.nombre).join(', ') || 'ninguno'}`, `• Estimado orientativo: ${fmt(total())} + IVA`];
    if (S.ubic.trim()) l.push(`• Ubicación: ${S.ubic.trim()}`);
    if (S.plazo.trim()) l.push(`• Plazo: ${S.plazo.trim()}`);
    if (S.msg.trim()) l.push(`• Comentarios: ${S.msg.trim()}`);
    open(`https://wa.me/${D.wa}?text=${encodeURIComponent(l.join('\n'))}`, '_blank', 'noopener');
  };
  function save() { const f = $('#fm'); if (f) { S.nombre = f.n.value; S.tel = f.t.value; S.ubic = f.u.value; S.plazo = f.p.value; S.msg = f.m.value; } }
  render();
})();
