export const FAMILIAS = [
  { v: "tech", t: "Tecnología y digital", emoji: "💻" },
  { v: "construccion", t: "Construcción e infraestructura", emoji: "🏗️" },
  { v: "industria", t: "Ingeniería, industria y manufactura", emoji: "⚙️" },
  { v: "procesos", t: "Procesos, operaciones y organización", emoji: "🔄" },
  { v: "producto", t: "Producto, innovación e I+D", emoji: "💡" },
  { v: "marketing", t: "Marketing, comunicación y eventos", emoji: "📣" },
  { v: "publico", t: "Sector público, social y sostenibilidad", emoji: "🏛️" },
];

// Fuente: tipos_proyecto_metodologias.xlsx, simplificado para el onboarding, con la metodología
// habitual y el porqué tal como vienen en la hoja de referencia.
export const TIPOS_POR_FAMILIA = {
  tech: [
    {
      v: "sw_medida",
      t: "Una app, web o software a medida",
      meta: "Scrum, Kanban, XP",
      porque:
        "Los requisitos cambian al ver el producto funcionando: iterar en ciclos cortos reduce el riesgo de construir algo que nadie quiere.",
    },
    {
      v: "sw_escala",
      t: "Un software grande, con varios equipos a la vez",
      meta: "SAFe, LeSS, Disciplined Agile",
      porque: "Hace falta coordinar muchos equipos ágiles con una cadencia común y una lista de prioridades compartida.",
    },
    {
      v: "erp_crm",
      t: "Implantar un ERP o CRM",
      meta: "Híbrido: fases fijas con configuración iterativa",
      porque:
        "El presupuesto y la fecha de arranque son fijos, pero los ajustes se validan mejor en ciclos cortos con los usuarios reales.",
    },
    {
      v: "migracion_it",
      t: "Migrar infraestructura IT (nube, redes, servidores)",
      meta: "Predictivo, con ITIL para la transición",
      porque: "El alcance técnico está bien definido y hay ventanas de corte críticas: un error en producción sale muy caro.",
    },
    {
      v: "plataforma",
      t: "Mantener y mejorar una plataforma que ya funciona",
      meta: "DevOps, Kanban, SRE",
      porque: "El trabajo llega como flujo continuo, no como un proyecto con inicio y fin. Prima la entrega frecuente y la estabilidad.",
    },
    {
      v: "ciberseguridad",
      t: "Ciberseguridad o cumplimiento normativo IT",
      meta: "Predictivo con ciclo PDCA",
      porque: "Los requisitos normativos están cerrados y hay una auditoría final que valida el resultado.",
    },
    {
      v: "datos_ia",
      t: "Datos o inteligencia artificial",
      meta: "CRISP-DM, Scrum o Kanban",
      porque: "La exploración de datos es experimental: hay que poder descartar modelos rápido y volver atrás sin penalizar.",
    },
    {
      v: "sw_critico",
      t: "Software crítico o embebido (médico, automoción...)",
      meta: "Modelo en V, a veces con ciclos cortos internos",
      porque: "Cada requisito necesita su prueba asociada y trazabilidad documentada para poder certificarlo.",
    },
  ],
  construccion: [
    {
      v: "edificacion",
      t: "Construir un edificio (vivienda u oficinas)",
      meta: "Predictivo, Camino Crítico (CPM), Valor Ganado",
      porque: "El diseño se cierra antes de construir y el orden físico de las tareas no se puede alterar.",
    },
    {
      v: "obra_civil",
      t: "Obra civil (carreteras, puentes, ferrocarril)",
      meta: "Predictivo, CPM, FIDIC como marco contractual",
      porque: "Contratos a precio cerrado, licitación pública y control estricto de coste y plazo.",
    },
    {
      v: "obra_compleja",
      t: "Una obra grande con muchos proveedores a coordinar",
      meta: "Lean Construction, Last Planner, IPD",
      porque: "Reducen las esperas entre gremios y reparten el riesgo entre propiedad, arquitectura y constructora.",
    },
    {
      v: "bim",
      t: "Construcción con modelado digital (BIM)",
      meta: "Predictivo apoyado en BIM (ISO 19650)",
      porque: "El modelo digital detecta interferencias antes de empezar la obra y sirve de fuente única de información.",
    },
    {
      v: "reforma",
      t: "Una reforma o rehabilitación",
      meta: "Predictivo con margen amplio, algo adaptativo",
      porque: "Aparecen sorpresas al abrir paredes. Conviene planificar por fases y replanificar a menudo.",
    },
  ],
  industria: [
    {
      v: "planta",
      t: "Una planta industrial o de energía",
      meta: "Predictivo, Stage-Gate, cadena crítica (CCPM)",
      porque: "Inversiones muy grandes con puertas de aprobación antes de comprometer más capital.",
    },
    {
      v: "producto_fisico",
      t: "Diseñar un producto físico nuevo",
      meta: "Stage-Gate, APQP, algo ágil en el prototipado",
      porque: "Cada fase (concepto, diseño, prototipo, industrialización) termina con una decisión de seguir o parar.",
    },
    {
      v: "mejora_proceso",
      t: "Mejorar un proceso productivo que ya existe",
      meta: "Lean, Six Sigma (DMAIC), Kaizen",
      porque: "Se trata de eliminar desperdicio y reducir variabilidad con datos medibles.",
    },
    {
      v: "nuevo_proceso_ind",
      t: "Diseñar un proceso productivo desde cero",
      meta: "DMADV (Design for Six Sigma)",
      porque: "No existe un proceso previo que mejorar: hay que diseñarlo con objetivos de calidad desde el principio.",
    },
    {
      v: "parada_planta",
      t: "Una parada de planta o mantenimiento mayor",
      meta: "Predictivo muy detallado, CPM",
      porque: "La ventana de parada es corta y cada hora sin producir cuesta dinero: se planifica al minuto.",
    },
  ],
  procesos: [
    {
      v: "bpm_rpa",
      t: "Rediseñar o automatizar un proceso interno",
      meta: "BPM, Lean, Kanban",
      porque: "Se modela el proceso actual, se rediseña y se automatiza por partes.",
    },
    {
      v: "cambio_org",
      t: "Un cambio organizativo (cómo trabaja la gente)",
      meta: "ADKAR, modelo de Kotter, Prosci + plan predictivo",
      porque: "El reto principal es que la gente lo adopte, no la parte técnica.",
    },
    {
      v: "fusion",
      t: "Una fusión, adquisición o reestructuración",
      meta: "Predictivo con gestión de programas",
      porque: "Muchos proyectos interdependientes con hitos legales y financieros fijos.",
    },
    {
      v: "iso",
      t: "Implantar una norma ISO",
      meta: "Predictivo con PDCA",
      porque: "Los requisitos de la norma ya están definidos, con la auditoría de certificación como hito final.",
    },
    {
      v: "externalizacion",
      t: "Externalizar o traspasar un servicio",
      meta: "Predictivo, ITIL",
      porque: "Hay que garantizar que el servicio sigue funcionando durante todo el traspaso.",
    },
  ],
  producto: [
    {
      v: "startup",
      t: "Un producto nuevo sin mercado validado todavía",
      meta: "Lean Startup, Design Thinking, Scrum",
      porque:
        "La incertidumbre está en el cliente, no en la técnica: se experimenta con versiones mínimas antes de invertir fuerte.",
    },
    {
      v: "innovacion_corp",
      t: "Innovación dentro de una empresa ya establecida",
      meta: "Design Thinking, Design Sprint, Stage-Gate ágil",
      porque: "Combina exploración creativa con puertas de financiación que exige la dirección.",
    },
    {
      v: "investigacion",
      t: "Investigación científica o académica",
      meta: "Gestión por fases y entregables, Kanban en el día a día",
      porque: "Los financiadores piden paquetes de trabajo formales, aunque la investigación en sí sea exploratoria.",
    },
    {
      v: "farmaceutica",
      t: "Un ensayo clínico o desarrollo farmacéutico",
      meta: "Stage-Gate, predictivo regulado",
      porque: "Las fases clínicas las define el regulador, con documentación exhaustiva obligatoria.",
    },
    {
      v: "otro_producto",
      t: "Otro tipo dentro de Producto, innovación e I+D",
      meta: "Depende del caso",
      porque: "No todos los proyectos de innovación encajan en una categoría cerrada.",
    },
  ],
  marketing: [
    {
      v: "campana_digital",
      t: "Una campaña de marketing digital",
      meta: "Agile Marketing, Kanban, Scrumban",
      porque: "El resultado se mide en días y la campaña se ajusta según los datos.",
    },
    {
      v: "lanzamiento",
      t: "El lanzamiento de una marca o producto",
      meta: "Híbrido: fecha fija, trabajo creativo iterativo",
      porque: "El día del lanzamiento no se mueve, pero el contenido sí se va refinando.",
    },
    {
      v: "evento",
      t: "Un evento, congreso o feria",
      meta: "Predictivo, CPM, listas de verificación",
      porque: "La fecha es inamovible y hay muchas dependencias logísticas con proveedores.",
    },
    {
      v: "audiovisual",
      t: "Una producción audiovisual o editorial",
      meta: "Predictivo por fases (pre, producción, post)",
      porque: "Cada fase consume recursos caros que conviene reservar con antelación.",
    },
    {
      v: "otro_marketing",
      t: "Otro tipo dentro de Marketing, comunicación y eventos",
      meta: "Depende del caso",
      porque: "No todas las acciones de marketing encajan en una categoría cerrada.",
    },
  ],
  publico: [
    {
      v: "administracion",
      t: "Un proyecto de administración pública",
      meta: "PRINCE2, predictivo, contratación pública",
      porque: "Exige transparencia, justificación del gasto y control documental estricto.",
    },
    {
      v: "cooperacion",
      t: "Cooperación internacional o un proyecto de ONG",
      meta: "Marco Lógico, PMD Pro, Teoría del Cambio",
      porque: "Los donantes evalúan por indicadores de impacto y resultados medibles.",
    },
    {
      v: "sostenibilidad",
      t: "Un proyecto de sostenibilidad o ESG",
      meta: "PRiSM, P5 Standard, predictivo o híbrido",
      porque: "Integra impacto social, ambiental y económico en todo el ciclo de vida del proyecto.",
    },
    {
      v: "esg_csrd",
      t: "Reporting ESG o adaptación a CSRD",
      meta: "Predictivo con hitos regulatorios, iterativo en el análisis",
      porque: "Las fechas de reporte son obligatorias, pero los datos y la materialidad se refinan en varias rondas.",
    },
    {
      v: "formacion",
      t: "Diseñar formación o un curso (e-learning)",
      meta: "ADDIE, SAM",
      porque: "ADDIE sigue fases lineales; SAM prototipa y prueba con alumnos antes de cerrar el contenido.",
    },
  ],
};

export const STEPS = ["familia", "tipo_proyecto", "tamano", "patrocinio", "financiacion", "camino", "fecha", "interesados"];

export const QUESTIONS = {
  familia: {
    q: "¿A qué industria se parece más esta empresa o este proyecto?",
    opts: FAMILIAS.map((f) => ({ v: f.v, t: `${f.emoji} ${f.t}` })),
    aside: "Esto no cambia el diagnóstico final, pero nos deja preguntarte por el tipo de proyecto concreto en vez de hablar en abstracto.",
  },
  tipo_proyecto: {
    q: (st) => `Dentro de ${(FAMILIAS.find((f) => f.v === st.familia) || {}).t || "esta industria"}, ¿qué tipos de proyecto soléis (o querríais) desarrollar?`,
    multi: true,
    max: 3,
    opts: (st) => (TIPOS_POR_FAMILIA[st.familia] || []).map((t) => ({ v: t.v, t: t.t })),
    aside: "Esto es solo referencia. Más adelante decides tú cómo se gestiona de verdad, nadie te lo impone por el sector.",
  },
  tamano: {
    q: "Si esto lo gestionara una sola persona, ¿cuánto tardaría?",
    opts: [
      { v: "semanas", t: "Unas semanas" },
      { v: "meses", t: "Varios meses" },
      { v: "mas_ano", t: "Más de 1 año" },
    ],
    aside: "La duración da una primera idea de la complejidad real: no es lo mismo sostener algo unas semanas que mantenerlo vivo más de un año.",
  },
  patrocinio: {
    q: "¿Ya tienes patrocinador/a identificado y disponible?",
    disclaimer:
      "El patrocinador/a (o sponsor) es quien tiene autoridad real para decidir y asignar presupuesto. No gestiona el día a día (eso lo hace el PM), pero sin su visto bueno el proyecto no tiene mandato para avanzar.",
    opts: [
      { v: "claro", t: "Sí, claro y con tiempo" },
      { v: "poco", t: "Sí, pero poco disponible", d: "existe, pero cuesta pillarlo/a para decidir" },
      { v: "ninguno", t: "Todavía no hay uno/a claro/a" },
    ],
    aside: "Por eso esta pregunta puede terminar el onboarding aquí mismo: sin alguien que lo respalde, no tiene sentido seguir configurando un proyecto que nadie puede autorizar.",
  },
  financiacion: {
    q: "¿Cómo está el presupuesto?",
    opts: [
      { v: "aprobado", t: "Aprobado y asignado" },
      { v: "disponible", t: "Disponible pero no aprobado", d: "existe el dinero, pero falta el visto bueno formal" },
      { v: "pendiente", t: "Hay que justificarlo o pedirlo todavía" },
    ],
    aside: "Esto decide dónde arranca la hoja de ruta: solo con el presupuesto aprobado del todo se salta directo a ponerlo en marcha; si falta justificarlo o falta el visto bueno formal, se empieza por el caso de negocio.",
  },
  camino: {
    q: "¿Cómo vais a llegar hasta el resultado?",
    opts: [
      { v: "e2e", t: "El camino está claro", d: "y no debería cambiar por el camino" },
      { v: "desc", t: "Se va a definir sobre la marcha", d: "en bloques cortos, ajustando según se aprende" },
      { v: "agil", t: "Es un producto digital", d: "que va a seguir mejorando después de la primera entrega" },
      { v: "proceso", t: "No es un entregable", d: "es cambiar cómo trabajamos de ahí en adelante" },
    ],
    aside: "Esta es la decisión que más cambia cómo se gestiona: entre planificarlo todo de una vez, avanzar en ciclos cortos, iterar sin un cierre único, o medir adopción en vez de una entrega.",
  },
  fecha: {
    q: "¿Hay una fecha que no se puede mover pase lo que pase?",
    opts: [
      { v: "si", t: "Sí, es innegociable", d: "ley, evento, contrato..." },
      { v: "no", t: "No, hay margen" },
    ],
    aside: "Con fecha fija se planifica hacia atrás desde esa fecha, no hacia delante desde hoy: cambia qué se revisa primero.",
  },
  interesados: {
    q: "¿Cuánta gente fuera de tu equipo depende de que esto salga bien?",
    opts: [
      { v: "a", t: "Solo mi equipo" },
      { v: "b", t: "Varios equipos o departamentos" },
      { v: "c", t: "Toda la empresa, o gente fuera de ella", d: "clientes, reguladores..." },
    ],
    aside: "Más interesados implica más puntos de control, no por burocracia, sino porque el coste de un malentendido crece con cada persona que depende del resultado.",
  },
};

export const RESULTS = {
  sin_patrocinador: {
    warn: true,
    kicker: "Fin del onboarding",
    title: "Todavía no hay patrocinador/a",
    why: "Sin alguien con autoridad real para decidir y asignar presupuesto, el proyecto no tiene mandato para avanzar, y eso no lo arregla ninguna hoja de ruta.",
    config: [
      "Identifica quién tiene autoridad real para decidir y liberar presupuesto en esto.",
      "Vuelve a pasar este onboarding en cuanto tengas a esa persona confirmada.",
    ],
  },
  e2e: {
    kicker: "Diagnóstico",
    title: "Proyecto cerrado",
    why: "Entrega algo concreto, de una sola vez, y el camino para llegar ya está bastante claro.",
    config: [
      "Hoja de ruta completa: Pre-proyecto → Iniciar → Planificar → Ejecutar → Controlar → Cerrar.",
      "Punto de control al cerrar cada fase antes de avanzar a la siguiente.",
      "Entregables documentados por fase, no solo al final.",
    ],
  },
  desc: {
    kicker: "Diagnóstico",
    title: "Proyecto cerrado, con alcance en descubrimiento",
    why: "Entrega algo concreto, pero todavía no sabéis el cómo exacto: el riesgo está al principio, no al final.",
    config: [
      'Misma hoja de ruta completa, pero con Pre-proyecto / Iniciar más largos de lo habitual.',
      'Punto de control de "alcance validado" antes de pasar a Planificar: no se planifica en firme sobre una base que aún se mueve.',
      "El resto de fases, como un proyecto cerrado estándar.",
    ],
  },
  proceso: {
    kicker: "Diagnóstico",
    title: "Nuevo proceso",
    why: "No se entrega un artefacto único: se cambia cómo el equipo trabaja de ahí en adelante.",
    config: [
      "Hoja de ruta simplificada: diseño del proceso, piloto y despliegue.",
      'El cierre no es "se entregó", es "se mide adopción": define ya qué % de uso cuenta como éxito.',
      "Plan de comunicación con más peso: un proceso que nadie explica, nadie lo sigue.",
    ],
  },
  agil: {
    kicker: "Diagnóstico",
    title: "Proyecto ágil de software",
    why: "El producto se va a seguir mejorando después de la primera entrega: no hay un cierre único, hay entregas continuas.",
    config: [
      "Lista de tareas priorizada, en ciclos cortos, en vez de fases secuenciales.",
      "Seguimiento por ritmo de cada ciclo, no por % de avance lineal.",
      "Objetivo de cada ciclo en vez de una fecha de cierre de proyecto.",
    ],
  },
};

export const TIPOS_ELEGIBLES = ["e2e", "desc", "agil", "proceso"];
