export const GATE_REQUIREMENTS = {
  preproyecto: [
    "Caso de negocio aprobado por el sponsor",
    "Análisis de factibilidad completado",
    "Presupuesto preliminar validado",
  ],
  iniciar: [
    "Acta de constitución firmada",
    "Stakeholders y equipo del proyecto confirmados",
    "Objetivos SMART / OKR del proyecto definidos",
  ],
  planificar: [
    "Kickoff meeting realizado con el equipo y stakeholders",
    "WBS y cronograma aprobados",
    "Plan de gestión de riesgos completado",
    "Presupuesto definitivo aprobado por el sponsor",
  ],
  ejecutar: [
    "Entregables principales completados",
    "Pruebas de calidad (QA) superadas sin incidencias críticas",
    "Encuesta de satisfacción enviada al cliente",
  ],
  controlar: [
    "Retrospectiva final realizada con el equipo",
    "Métricas de cierre documentadas",
    "Checklist de cierre revisada y aprobada",
  ],
};

export const INITIAL_EXCEPTIONS = [
  {
    id: "exc-1",
    phase: "Planificar",
    motivo: "Se inició la contratación de un proveedor externo antes de cerrar el plan de riesgos definitivo, por una ventana de disponibilidad limitada del proveedor.",
    autorizadoPor: "Carlos Méndez (Sponsor)",
    fecha: "2026-07-14",
  },
];
