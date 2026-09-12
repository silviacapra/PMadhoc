export const ROLE_LABELS = {
  sponsor: "Sponsor",
  pm: "Project manager",
  team: "Team",
  expert: "Experto",
};

export const ROLE_PERMISSIONS = {
  sponsor: ["dashboard", "empresa", "roadmap", "gantt", "riesgos", "documentacion", "lecciones", "statusreport", "stakeholders"],
  pm: [
    "dashboard",
    "empresa",
    "knowledge",
    "roadmap",
    "gantt",
    "templates",
    "riesgos",
    "documentacion",
    "lecciones",
    "chatbot",
    "statusreport",
    "stakeholders",
  ],
  team: [
    "dashboard",
    "roadmap",
    "gantt",
    "templates",
    "riesgos",
    "documentacion",
    "lecciones",
    "chatbot",
    "statusreport",
    "stakeholders",
  ],
  expert: ["knowledge", "templates", "chatbot"],
};

export function defaultViewForRole(role) {
  return ROLE_PERMISSIONS[role][0];
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "main" },
  { id: "roadmap", label: "Fases proyecto", icon: "roadmap", group: "main" },
  { id: "gantt", label: "Roadmap", icon: "gantt", group: "main" },
  { id: "riesgos", label: "Registro de riesgos", icon: "riesgos", group: "main" },
  { id: "documentacion", label: "Documentación", icon: "documentacion", group: "main" },
  { id: "lecciones", label: "Lecciones aprendidas", icon: "lecciones", group: "main" },
  { id: "statusreport", label: "Status Report", icon: "statusreport", group: "main" },
  { id: "empresa", label: "Empresa y OKR", icon: "empresa", group: "secondary" },
  { id: "templates", label: "Plantillas", icon: "templates", group: "secondary" },
  { id: "stakeholders", label: "Stakeholders", icon: "stakeholders", group: "secondary" },
  { id: "knowledge", label: "Base de conocimiento", icon: "knowledge", group: "secondary" },
  { id: "chatbot", label: "Pregunta al PM virtual", icon: "chatbot", group: "secondary" },
];
