export const PHASE_ORDER = ["preproyecto", "iniciar", "planificar", "ejecutar", "controlar", "cerrar"];

export const CURRENT_PROJECT_PHASE = "ejecutar";

export const ROADMAP_CONTENT = {
  preproyecto: {
    label: "Pre-proyecto",
    steps: [
      {
        title: "Identificación del problema u oportunidad",
        detail: "Entender el estado actual de la organización y definir qué se quiere resolver o aprovechar.",
        outputs: ["Business case (borrador)"],
      },
      {
        title: "Análisis de factibilidad",
        detail: "Evaluar si las soluciones propuestas son viables técnica, económica y operativamente.",
        outputs: ["Informe de factibilidad"],
      },
      {
        title: "Desarrollo del caso de negocio (Business Case)",
        detail: "Documentar la justificación financiera y estratégica para el proyecto.",
        outputs: ["Business case", "Plan de gestión de beneficios"],
      },
      {
        title: "Definición de requisitos de alto nivel",
        detail: "Establecer a grandes rasgos qué capacidades debe tener la solución.",
        outputs: ["Documento de requisitos de alto nivel"],
      },
    ],
  },
  iniciar: {
    label: "Iniciar",
    steps: [
      {
        title: "Definir el goal del proyecto",
        detail: "Objetivos SMART a largo plazo, u OKR a corto plazo.",
        outputs: ["Objetivos SMART / OKR del proyecto"],
      },
      {
        title: "Mapear stakeholders y equipo",
        detail: "Sponsor, clientes, usuario final, PM y roles del equipo.",
        outputs: ["Registro de stakeholders", "Matriz de asignación de responsabilidades (RACI)"],
      },
      {
        title: "Redactar el estatuto del proyecto (Charter)",
        detail: "Formaliza alcance, entregables y KPI; requiere firma de aprobación.",
        outputs: ["Acta de constitución del proyecto (Project Charter)", "Registro de supuestos (Assumption log)"],
      },
    ],
  },
  planificar: {
    label: "Planificar",
    steps: [
      {
        title: "Kickoff meeting",
        detail: "Alinear a todo el equipo y stakeholders con una agenda clara.",
        outputs: ["Agenda de kickoff meeting"],
      },
      {
        title: "Desglosar tareas y milestones (WBS)",
        detail: "Work Breakdown Structure para definir la jerarquía del trabajo.",
        outputs: ["Work Breakdown Structure (WBS)", "Lista de hitos"],
      },
      {
        title: "Preparar el presupuesto",
        detail: "Prever recursos, calcular una reserva del 5-10% y revisar tras cada milestone.",
        outputs: ["Plan de gestión financiera", "Línea base de costos"],
      },
      {
        title: "Planificar la gestión de riesgos",
        detail: "Registro de riesgos, matriz probabilidad-impacto y plan de mitigación.",
        outputs: ["Registro de riesgos", "Plan de gestión de riesgos"],
      },
      {
        title: "Cerrar el plan de proyecto definitivo",
        detail: "Charter, Risk Management Plan, RACI y plan de comunicación.",
        outputs: ["Plan de gestión del proyecto (definitivo)", "Plan de comunicación", "Línea base del alcance"],
      },
    ],
  },
  ejecutar: {
    label: "Ejecutar",
    steps: [
      {
        title: "Hacer seguimiento del avance",
        detail: "Gantt, roadmap o burndown chart según el tipo de proyecto.",
        outputs: ["Informe de desempeño del trabajo", "Cronograma actualizado"],
      },
      {
        title: "Gestionar cambios y riesgos",
        detail: "Categorizar con ROAM y actualizar el project status report.",
        outputs: ["Registro de cambios", "Solicitudes de cambio aprobadas"],
      },
      {
        title: "Controlar la calidad",
        detail: "Asegurar calidad (QA) antes del lanzamiento y controlarla (QC) después.",
        outputs: ["Informe de calidad", "Métricas de calidad"],
      },
      {
        title: "Mantener el contacto con el cliente",
        detail: "Encuestas de satisfacción y beta testing antes del lanzamiento.",
        outputs: ["Resultados de encuesta de satisfacción"],
      },
    ],
  },
  controlar: {
    label: "Controlar",
    steps: [
      {
        title: "Impulsar la mejora continua",
        detail: "Retrospectivas tras cada milestone para no repetir errores.",
        outputs: ["Acta de retrospectiva"],
      },
      {
        title: "Tomar decisiones basadas en datos",
        detail: "Métricas de productividad y de calidad del proyecto.",
        outputs: ["Dashboard de métricas"],
      },
      {
        title: "Analizar y visualizar los datos",
        detail: "Detectar sesgos y comunicar hallazgos con dashboards e infografías.",
        outputs: ["Informe de análisis de datos"],
      },
    ],
  },
  cerrar: {
    label: "Cerrar",
    steps: [
      {
        title: "Revisar la checklist de cierre",
        detail: "Confirmar que todas las tareas están completadas y aprobadas por los SH.",
        outputs: ["Checklist de cierre firmada"],
      },
      {
        title: "Documentar el cierre",
        detail: "Impact report, retrospectiva formal y project closeout report.",
        outputs: ["Informe final del proyecto", "Registro de lecciones aprendidas"],
      },
      {
        title: "Entregar y agradecer",
        detail: "Poner a disposición herramientas, formación y documentación al cliente.",
        outputs: ["Acta de transición del producto/servicio final"],
      },
    ],
  },
};

export const DEFAULT_TASK_STATUS = {
  preproyecto__0: { status: "done" },
  preproyecto__1: { status: "done" },
  preproyecto__2: { status: "done" },
  preproyecto__3: { status: "done" },
  iniciar__0: {
    status: "done",
    outputs: { 0: { done: true, link: "https://pmoadhoc.com/plantillas/plantilla_okr_ejemplo.docx" } },
  },
  iniciar__1: { status: "done" },
  iniciar__2: {
    status: "done",
    outputs: { 0: { done: true, link: "https://pmoadhoc.com/plantillas/plantilla_estatuto_proyecto.docx" } },
  },
  planificar__0: {
    status: "done",
    outputs: { 0: { done: true, link: "https://pmoadhoc.com/plantillas/plantilla_agenda_kickoff.docx" } },
  },
  planificar__1: { status: "done" },
  planificar__2: { status: "done" },
  planificar__3: { status: "done" },
  planificar__4: { status: "done" },
  ejecutar__0: { status: "done" },
  ejecutar__1: { status: "green" },
  ejecutar__2: { status: "yellow" },
};
