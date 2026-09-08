export const PHASE_ORDER = ["preproyecto", "iniciar", "planificar", "ejecutar", "controlar", "cerrar"];

export const CURRENT_PROJECT_PHASE = "ejecutar";

export const ROADMAP_CONTENT = {
  preproyecto: {
    label: "Pre-proyecto",
    steps: [
      { title: "Identificación del problema u oportunidad", detail: "Entender el estado actual de la organización y definir qué se quiere resolver o aprovechar." },
      { title: "Análisis de factibilidad", detail: "Evaluar si las soluciones propuestas son viables técnica, económica y operativamente." },
      { title: "Desarrollo del caso de negocio (Business Case)", detail: "Documentar la justificación financiera y estratégica para el proyecto." },
      { title: "Definición de requisitos de alto nivel", detail: "Establecer a grandes rasgos qué capacidades debe tener la solución." },
    ],
  },
  iniciar: {
    label: "Iniciar",
    steps: [
      { title: "Investigar la organización y su cultura", detail: "Entender la estructura de la empresa antes de arrancar el proyecto." },
      { title: "Definir el goal del proyecto", detail: "Objetivos SMART a largo plazo, u OKR a corto plazo." },
      { title: "Mapear stakeholders y equipo", detail: "Sponsor, clientes, usuario final, PM y roles del equipo." },
      { title: "Redactar el estatuto del proyecto (Charter)", detail: "Formaliza alcance, entregables y KPI; requiere firma de aprobación." },
    ],
  },
  planificar: {
    label: "Planificar",
    steps: [
      { title: "Kickoff meeting", detail: "Alinear a todo el equipo y stakeholders con una agenda clara." },
      { title: "Desglosar tareas y milestones (WBS)", detail: "Work Breakdown Structure para definir la jerarquía del trabajo." },
      { title: "Preparar el presupuesto", detail: "Prever recursos, calcular una reserva del 5-10% y revisar tras cada milestone." },
      { title: "Planificar la gestión de riesgos", detail: "Registro de riesgos, matriz probabilidad-impacto y plan de mitigación." },
      { title: "Cerrar el plan de proyecto definitivo", detail: "Charter, Risk Management Plan, RACI y plan de comunicación." },
    ],
  },
  ejecutar: {
    label: "Ejecutar",
    steps: [
      { title: "Hacer seguimiento del avance", detail: "Gantt, roadmap o burndown chart según el tipo de proyecto." },
      { title: "Gestionar cambios y riesgos", detail: "Categorizar con ROAM y actualizar el project status report." },
      { title: "Controlar la calidad", detail: "Asegurar calidad (QA) antes del lanzamiento y controlarla (QC) después." },
      { title: "Mantener el contacto con el cliente", detail: "Encuestas de satisfacción y beta testing antes del lanzamiento." },
    ],
  },
  controlar: {
    label: "Controlar",
    steps: [
      { title: "Impulsar la mejora continua", detail: "Retrospectivas tras cada milestone para no repetir errores." },
      { title: "Tomar decisiones basadas en datos", detail: "Métricas de productividad y de calidad del proyecto." },
      { title: "Analizar y visualizar los datos", detail: "Detectar sesgos y comunicar hallazgos con dashboards e infografías." },
    ],
  },
  cerrar: {
    label: "Cerrar",
    steps: [
      { title: "Revisar la checklist de cierre", detail: "Confirmar que todas las tareas están completadas y aprobadas por los SH." },
      { title: "Documentar el cierre", detail: "Impact report, retrospectiva formal y project closeout report." },
      { title: "Entregar y agradecer", detail: "Poner a disposición herramientas, formación y documentación al cliente." },
    ],
  },
};

export const DEFAULT_TASK_STATUS = {
  preproyecto__0: { status: "done" },
  preproyecto__1: { status: "done" },
  preproyecto__2: { status: "done" },
  preproyecto__3: { status: "done" },
  iniciar__0: { status: "done" },
  iniciar__1: { status: "done" },
  iniciar__2: { status: "done" },
  iniciar__3: { status: "done" },
  planificar__0: { status: "done" },
  planificar__1: { status: "done" },
  planificar__2: { status: "done" },
  planificar__3: { status: "done" },
  planificar__4: { status: "done" },
  ejecutar__0: { status: "done" },
  ejecutar__1: { status: "green" },
  ejecutar__2: { status: "yellow" },
};
