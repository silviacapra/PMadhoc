export const PHASE_FILTER_DEFS = [
  { id: "todas", label: "Todas" },
  { id: "fundamentos", label: "Fundamentos" },
  { id: "preproyecto", label: "Pre-proyecto" },
  { id: "iniciar", label: "Iniciar" },
  { id: "planificar", label: "Planificar" },
  { id: "ejecutar", label: "Ejecutar" },
  { id: "controlar", label: "Controlar" },
  { id: "cerrar", label: "Cerrar" },
];

export const ALL_TEMPLATES = [
  { category: "Fundamentos", format: "DOCX", title: "Marco de project management", desc: "Las 5 fases del proyecto con sus elementos clave y documentos, en un único documento de referencia.", phase: "fundamentos", task: null },
  { category: "Fundamentos", format: "DOCX", title: "OKR de ejemplo: proyecto Muévete", desc: "Un caso de referencia para ver cómo se redactan objetivos y resultados clave medibles.", phase: "iniciar", task: "Definir el goal del proyecto" },
  { category: "Inicio", format: "DOCX", title: "Acta de constitución", desc: "Formaliza el arranque del proyecto y su alcance inicial.", phase: "iniciar", task: "Redactar el estatuto del proyecto (Charter)" },
  { category: "Inicio", format: "DOCX", title: "Estatuto del proyecto (plantilla en blanco)", desc: "Objetivo, entregables, caso de negocio, presupuesto, alcance y equipo, listos para rellenar.", phase: "iniciar", task: "Redactar el estatuto del proyecto (Charter)" },
  { category: "Planificación", format: "XLSX", title: "Registro de riesgos", desc: "Identifica, valora y da seguimiento a los riesgos del proyecto.", phase: "planificar", task: "Planificar la gestión de riesgos" },
  { category: "Planificación", format: "XLSX", title: "Matriz RACI", desc: "Define responsables, aprobadores, consultados e informados.", phase: "planificar", task: "Cerrar el plan de proyecto definitivo" },
  { category: "Planificación", format: "DOCX", title: "Agenda de kickoff meeting", desc: "Bloques, tiempos y contenidos para la reunión de arranque del proyecto (1 hora).", phase: "planificar", task: "Kickoff meeting" },
  { category: "Ejecución", format: "DOCX", title: "Plan de comunicación", desc: "Qué se comunica, a quién, con qué frecuencia y por qué canal.", phase: "planificar", task: "Cerrar el plan de proyecto definitivo" },
  { category: "Controlar", format: "XLSX", title: "Informe de estado semanal", desc: "Plantilla de seguimiento de avance, riesgos y bloqueos.", phase: "ejecutar", task: "Gestionar cambios y riesgos" },
  { category: "Cierre", format: "DOCX", title: "Acta de cierre y lecciones", desc: "Cierra formalmente el proyecto y documenta el aprendizaje.", phase: "cerrar", task: "Documentar el cierre" },
];
