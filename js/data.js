/* ÚNICO lugar para editar modelos, líneas, precios, fachadas, extras y formas de pago.
   Fuente: Catálogo de tipologías 2026. De acá se arman: hero, tarjetas del inicio, líneas, precios de las páginas de modelo y el configurador.
   Los precios por modelo = m² x USD/m² de cada línea (coinciden con el catálogo). No incluyen IVA. */
window.AMBY = {
  wa: '5493512058609',
  iva: 10.5,
  empresa: {
    entrega: '60–90',
    tel: '+54 9 351 205-8609',
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
    l1: 'Construcción modular,',
    l2: 'pensada como <b>arquitectura</b>.',
    sub: 'Casas y espacios modulares con diseño de autor y terminaciones premium. Se fabrican en planta y se montan en tu terreno.',
    stats: [['Steel frame', 'Acero galvanizado + panel SIP'], ['Fábrica propia', 'Villa Parque Santa Ana, Córdoba'], ['Terminado en fábrica', 'Módulos listos para trasladar y montar'], ['Plazo estimado', '60 a 90 días de fabricación']]
  },
  lineas: [
    { id: 'premium', nombre: 'Línea Premium', usdM2: 1100, desc: 'Aberturas de aluminio con vidrio simple, cocina con bajo mesada y terminaciones de primera calidad.' },
    { id: 'plus', nombre: 'Línea Premium Plus', usdM2: 1250, desc: 'Doble vidrio hermético, porcelanato 60x60 en baño y cocina con alacena y purificador.' },
    { id: 'deluxe', nombre: 'Línea Deluxe', usdM2: 1400, desc: 'Revestimiento interior de machimbre, porcelanato 80x60 en baño, anafe de 4 hornallas y horno de embutir.' }
  ],
  /* Modelos reales del catálogo. precio = "desde" (Línea Premium), se calcula abajo. */
  modelos: [
    { id: 'A18', nombre: 'Modelo A18', m2: 18, hab: 0, banos: 1, corto: 'monoambiente', desc: 'Monoambiente con baño', url: 'modelo-a18.html', img: 'img/a18-card.jpg' },
    { id: 'A32', nombre: 'Modelo A32', m2: 32, hab: 1, banos: 1, corto: '1 dormitorio', desc: '1 dormitorio, cocina, estar comedor y baño', url: 'modelo-a32.html', img: 'img/a32-card.jpg' },
    { id: 'A57', nombre: 'Modelo A57', m2: 57, hab: 3, banos: 1, corto: '3 dormitorios', desc: '3 dormitorios, cocina, estar comedor y baño', url: 'modelo-a57.html', img: 'img/a57-card.jpg' }
  ],
  capas: [
    ['Revestimiento exterior', 'Siding o chapa, a elección.', '#a9703a'],
    ['Membrana hidrófuga y OSB', 'Placas OSB y membrana que protegen la estructura de la humedad.', '#6b7a8c'],
    ['Panel SIP con aislación', 'Aislación de EPS de 80 a 100 mm.', '#e8c14f'],
    ['Perfilería de acero galvanizado', 'Steel frame más caños estructurales.', '#c9ced6'],
    ['Terminación interior', 'Placas de yeso o machimbre.', '#ebe7df']
  ],
  proceso: [
    ['Idea', 'Nos contás qué querés: uso, terreno y estilo. Definimos el alcance y armamos la propuesta con plazos y presupuesto.'],
    ['Diseño', 'Proyecto a tu medida, pensado como arquitectura. Planos y materiales definidos con vos, con ajustes y aprobación antes de fabricar.'],
    ['Fabricación', 'En nuestra fábrica, con estructura en steel frame. Cada módulo se termina en planta, con control de calidad y sin demoras de obra tradicional.'],
    ['Entrega', 'El módulo sale terminado de fábrica. El traslado y el montaje en tu terreno se coordinan aparte, con el equipo que elijas.']
  ],
  fachadas: [
    { id: 'chapa', nombre: 'Chapa', color: '#2a2a2a', usdM2: 0 },
    { id: 'siding', nombre: 'Siding', color: '#a9703a', usdM2: 0 }
  ],
  /* El catálogo no informa precios de los opcionales: "Valores a cotizar según proyecto". */
  extras: [
    { id: 'pergola', nombre: 'Pérgola', desc: 'Estructura de caño y chapa prepintada, con iluminación led' },
    { id: 'cerramientos', nombre: 'Cerramientos de seguridad', desc: 'En aberturas' },
    { id: 'pilotes', nombre: 'Sistema de pilotes', desc: 'Para anclaje' }
  ],
  incluye: [
    'Estructura de steel frame y aislación de EPS de 80 a 100 mm',
    'Aberturas de aluminio (vidrio simple o DVH según la línea), instalaciones sanitaria, eléctrica y cloacal',
    'Baño completo y terminaciones interiores',
    'Cocina equipada y equipamiento según la línea (placares en dormitorios en Línea Deluxe)'
  ],
  noIncluye: [
    'Trabajos preliminares en terreno y bases de apoyo',
    'Acometidas de agua, electricidad y cloacas',
    'Traslado y montaje en destino (los coordina el cliente)',
    'Grúa para la descarga en destino'
  ],
  pagos: [
    '60% al firmar el contrato, 20% a los 30 días y 20% al finalizar la fabricación, antes del retiro del módulo.',
    'Pago contado: 5% de descuento.',
    '60% al firmar y saldo hasta en 6 cuotas mensuales consecutivas en pesos, con interés mensual del 5%.',
    'Financiación mediante convenio con Banco Hipotecario.',
    'Tomamos cheques a 30/60/90 días.'
  ],
  /* Comparativa por línea (orden: Premium, Premium Plus, Deluxe) */
  tabla: [
    ['Aberturas', 'Aluminio línea Módena negro + vidrio simple Float 5 mm', 'Aluminio línea Módena negro o blanco + doble vidrio hermético (DVH)', 'Aluminio línea Módena negro o blanco + doble vidrio hermético (DVH)'],
    ['Puertas interiores', 'Puerta de madera MDF + tratamiento impermeabilizante', 'Puerta placa Oblak línea Práctica, color blanco', 'Puerta placa Oblak línea Tekstura, color según stock'],
    ['Equipamiento de cocina', 'Anafe eléctrico de 2 hornallas', 'Anafe eléctrico de 2 hornallas de primera marca + purificador de cocina', 'Anafe eléctrico de 4 hornallas + purificador de cocina de primera marca + horno eléctrico de embutir'],
    ['Muebles de cocina', 'Bajo mesada en melamina Faplac, color a elección', 'Alacena y bajo mesada Faplac, color a elección', 'Alacena y bajo mesada en melamina Faplac + tira led. Bacha de acero inoxidable Johnson. Placard en dormitorio'],
    ['Mesada', 'Gris Mara', 'Gris Mara o Negro Boreal + zócalo', 'Negro Mara o Blanco Ceara'],
    ['Revestimiento exterior', 'Chapa o siding', 'Chapa o siding', 'Chapa o siding'],
    ['Revestimiento de baño', 'Cerámica de primera calidad, color blanco', 'Porcelanato 60x60 marca Cerro Negro, color según stock', 'Porcelanato 80x60 línea Vite, color a elección según stock'],
    ['Piso interior', 'Piso vinílico SPC 6 mm con manto, sistema click de alto tránsito, impermeable', 'Piso vinílico SPC 6 mm con manto, sistema click de alto tránsito, impermeable', 'Piso vinílico SPC 6 mm con manto, sistema click de alto tránsito, impermeable'],
    ['Instalación eléctrica', 'Plafones 24 W', 'Plafones 24 W + spot + apliques exteriores. Tablero eléctrico', 'Apliques led (spot) + AR111 + tira led en zócalo a cielorraso'],
    ['Sanitarios y grifería', 'Sanitarios Ferrum línea Andina. Receptáculo de ducha 70x70 + mampara. Grifería FV Arizona', 'Sanitarios Ferrum línea Andina. Receptáculo de ducha 70x70 + mampara. Grifería FV Arizona', 'Sanitarios Ferrum línea Bari. Receptáculo de ducha 70x120 + mampara. Grifería FV Pueblo'],
    ['Revestimiento interior y aislación', 'Placa de yeso + EPS de 80 a 100 mm', 'Placa de yeso + EPS de 80 a 100 mm', 'Machimbre de eucalipto de primera + EPS de 80 a 100 mm'],
    ['Estructura', 'Acero + panel SIP', 'Acero + panel SIP', 'Acero + panel SIP'],
    ['Techo', 'A un agua', 'A un agua', 'A una o dos aguas']
  ]
};
window.AMBY.modelos.forEach(m => { m.precio = m.m2 * window.AMBY.lineas[0].usdM2; });
