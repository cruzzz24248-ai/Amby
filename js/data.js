/* ÚNICO lugar para editar modelos, precios (USD de ejemplo), fachadas, terminaciones y extras.
   De acá se arman: hero, tarjetas del inicio, precios de las páginas de modelo y el configurador. */
window.AMBY = {
  wa: '5493512058609',
  empresa: {
    entrega: 60,
    tel: '+54 9 351 205 8609',
    horario: 'Lunes a viernes, de 9:30 a 18:00 hs',
    direccion: ['Colectora RP N° 5, Km 18', 'Villa Parque Santa Ana', 'Complejo PRETOR'],
    mapa: 'https://www.google.com/maps/search/?api=1&query=Complejo+PRETOR+Villa+Parque+Santa+Ana+Cordoba+Argentina'
  },
  msgs: {
    consulta: 'Hola Amby, quiero consultar por un proyecto',
    visita: 'Hola Amby, quiero coordinar una visita a la fábrica'
  },
  hero: {
    eyebrow: 'Construcción modular · Steel frame',
    l1: 'Tu casa,',
    l2: 'armada en',
    sub: 'Se fabrica en planta y se monta en tu terreno. Llave en mano, a cualquier punto del país.',
    stats: [['Steel frame', 'Acero galvanizado'], ['Fábrica propia', 'Villa Parque Santa Ana'], ['Todo el país', 'Traslado y montaje'], ['Llave en mano', 'Listo para usar']]
  },
  modelos: [
    { id: 'M30', nombre: 'Módulo 30', m2: 30, precio: 38000, corto: 'suite o estudio', desc: 'Suite o estudio con baño', url: 'modelo-m30.html', img: 'img/m30.jpg' },
    { id: 'M45', nombre: 'Módulo 45', m2: 45, precio: 54000, corto: '1 dormitorio', desc: '1 dormitorio, cocina comedor, baño', url: 'modelo-m45.html', img: 'img/m45.jpg' },
    { id: 'M60', nombre: 'Módulo 60', m2: 60, precio: 72000, corto: '2 dormitorios', desc: '2 dormitorios, estar comedor, baño', url: 'modelo-m60.html', img: 'img/m60.jpg' },
    { id: 'M90', nombre: 'Módulo 90', m2: 90, precio: 104000, corto: '3 dormitorios', desc: '3 dormitorios, living, 2 baños', url: 'modelo-m90.html', img: 'img/m90.jpg' }
  ],
  capas: [
    ['Revestimiento exterior', 'Madera o acero, según la fachada que elijas.', '#a9703a'],
    ['Barrera de agua y viento', 'Protege la estructura de la humedad y del viento.', '#6b7a8c'],
    ['Aislación', 'Frío y calor bajo control, y más silencio adentro.', '#e8c14f'],
    ['Estructura de acero galvanizado', 'Perfiles livianos, precisos y muy resistentes.', '#c9ced6'],
    ['Terminación interior', 'Detalles de diseño, listos para habitar.', '#ebe7df']
  ],
  proceso: [
    ['Idea', 'Nos contás qué querés: uso, terreno y estilo.'],
    ['Diseño', 'Proyecto a tu medida, con planos y materiales definidos con vos antes de fabricar.'],
    ['Fabricación', 'Estructura en steel frame y cada módulo terminado en planta, sin demoras de obra tradicional.'],
    ['Montaje', 'Trasladamos a cualquier punto del país, montamos en tu terreno con equipo propio y entregamos llave en mano.']
  ],
  fachadas: [
    { id: 'negro', nombre: 'Negro y madera', color: '#2a2a2a', usdM2: 0 },
    { id: 'madera', nombre: 'Madera natural', color: '#a9703a', usdM2: 45 },
    { id: 'blanco', nombre: 'Blanco y acero', color: '#e6e3dc', usdM2: 25 }
  ],
  terminaciones: [
    { id: 'confort', nombre: 'Confort', usdM2: 0, desc: 'Calidad de fábrica, listo para habitar' },
    { id: 'premium', nombre: 'Premium', usdM2: 220, desc: 'Diseño de autor y detalles superiores' }
  ],
  extras: [
    { id: 'deck', nombre: 'Deck de madera', precio: 4200 },
    { id: 'solar', nombre: 'Paneles solares', precio: 6800 },
    { id: 'cocina', nombre: 'Cocina equipada', precio: 5500 },
    { id: 'domotica', nombre: 'Domótica', precio: 3900 }
  ]
};
