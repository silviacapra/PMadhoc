export const PHASE_ORDER = ["preproyecto", "iniciar", "planificar", "ejecutar", "controlar", "cerrar"];

export const CURRENT_PROJECT_PHASE = "ejecutar";

export const ROADMAP_CONTENT = {
  preproyecto: {
    label: "Pre-proyecto",
    steps: [
      {
        title: "Identificación del problema u oportunidad",
        detail: "Entender el estado actual de la organización y definir qué se quiere resolver o aprovechar.",
        outputs: ["Caso de negocio (borrador)"],
      },
      {
        title: "Análisis de factibilidad",
        detail: "Evaluar si las soluciones propuestas son viables técnica, económica y operativamente.",
        outputs: ["Informe de factibilidad"],
      },
      {
        title: "Desarrollo del caso de negocio",
        detail: "Documentar la justificación financiera y estratégica para el proyecto.",
        outputs: ["Caso de negocio", "Plan de gestión de beneficios"],
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
        title: "Definir el objetivo del proyecto",
        detail: "Objetivos SMART a largo plazo, o KPIs a corto plazo.",
        outputs: ["Objetivos SMART / KPIs del proyecto"],
      },
      {
        title: "Mapear contactos clave y equipo",
        detail: "Patrocinador, clientes, usuario final, gestor de proyecto y roles del equipo.",
        outputs: ["Registro de contactos clave", "Matriz de asignación de responsabilidades (RACI)"],
      },
      {
        title: "Redactar el estatuto del proyecto",
        detail: "Formaliza alcance, entregables y KPI; requiere firma de aprobación.",
        outputs: ["Acta de constitución del proyecto", "Registro de supuestos"],
      },
    ],
  },
  planificar: {
    label: "Planificar",
    steps: [
      {
        title: "Reunión de arranque",
        detail: "Alinear a todo el equipo y contactos clave con una agenda clara.",
        outputs: ["Agenda de la reunión de arranque"],
      },
      {
        title: "Desglosar tareas e hitos (EDT)",
        detail: "Estructura de Desglose del Trabajo para definir la jerarquía del trabajo.",
        outputs: ["Estructura de Desglose del Trabajo (EDT)", "Lista de hitos"],
      },
      {
        title: "Preparar el presupuesto",
        detail: "Prever recursos, calcular una reserva del 5-10% y revisar tras cada hito.",
        outputs: ["Plan de gestión financiera", "Línea base de costos"],
      },
      {
        title: "Planificar la gestión de riesgos",
        detail: "Registro de riesgos, matriz probabilidad-impacto y plan de mitigación.",
        outputs: ["Registro de riesgos", "Plan de gestión de riesgos"],
      },
      {
        title: "Cerrar el plan de proyecto definitivo",
        detail: "Acta de constitución, plan de gestión de riesgos, RACI y plan de comunicación.",
        outputs: ["Plan de gestión del proyecto (definitivo)", "Plan de comunicación", "Línea base del alcance"],
      },
    ],
  },
  ejecutar: {
    label: "Ejecutar",
    steps: [
      {
        title: "Hacer seguimiento del avance",
        detail: "Gantt, hoja de ruta o gráfico de avance según el tipo de proyecto.",
        outputs: ["Informe de desempeño del trabajo", "Cronograma actualizado"],
      },
      {
        title: "Gestionar cambios y riesgos",
        detail: "Categorizar con ROAM y actualizar los informes de proyecto.",
        outputs: ["Registro de cambios", "Solicitudes de cambio aprobadas"],
      },
      {
        title: "Controlar la calidad",
        detail: "Asegurar la calidad antes del lanzamiento y controlarla después.",
        outputs: ["Informe de calidad", "Métricas de calidad"],
      },
      {
        title: "Mantener el contacto con el cliente",
        detail: "Encuestas de satisfacción y pruebas piloto antes del lanzamiento.",
        outputs: ["Resultados de encuesta de satisfacción"],
      },
    ],
  },
  controlar: {
    label: "Controlar",
    steps: [
      {
        title: "Impulsar la mejora continua",
        detail: "Retrospectivas tras cada hito para no repetir errores.",
        outputs: ["Acta de retrospectiva"],
      },
      {
        title: "Tomar decisiones basadas en datos",
        detail: "Métricas de productividad y de calidad del proyecto.",
        outputs: ["Panel de métricas"],
      },
      {
        title: "Analizar y visualizar los datos",
        detail: "Detectar sesgos y comunicar hallazgos con paneles e infografías.",
        outputs: ["Informe de análisis de datos"],
      },
    ],
  },
  cerrar: {
    label: "Cerrar",
    steps: [
      {
        title: "Revisar la lista de verificación de cierre",
        detail: "Confirmar que todas las tareas están completadas y aprobadas por los contactos clave.",
        outputs: ["Lista de verificación de cierre firmada"],
      },
      {
        title: "Documentar el cierre",
        detail: "Informe de impacto, retrospectiva formal e informe de cierre del proyecto.",
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
