export const ROLE_LABELS = {
  sponsor: "Patrocinador",
  pm: "Gestor de proyecto",
  team: "Equipo",
  expert: "Experto",
};

export const ROLE_PERMISSIONS = {
  sponsor: ["dashboard", "empresa", "roadmap", "riesgos", "documentacion", "lecciones", "cambios", "statusreport", "stakeholders"],
  pm: [
    "dashboard",
    "empresa",
    "knowledge",
    "roadmap",
    "templates",
    "riesgos",
    "documentacion",
    "lecciones",
    "cambios",
    "chatbot",
    "statusreport",
    "stakeholders",
  ],
  team: [
    "dashboard",
    "roadmap",
    "templates",
    "riesgos",
    "documentacion",
    "lecciones",
    "cambios",
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
  { id: "dashboard", label: "Panel", icon: "dashboard", group: "main" },
  { id: "roadmap", label: "Proyectos por fases", icon: "roadmap", group: "main" },
  { id: "documentacion", label: "Repositorio documental", icon: "documentacion", group: "main" },
  { id: "riesgos", label: "Registro de riesgos", icon: "riesgos", group: "main" },
  { id: "lecciones", label: "Lecciones aprendidas", icon: "lecciones", group: "main" },
  { id: "cambios", label: "Registro de cambios", icon: "cambios", group: "main" },
  { id: "statusreport", label: "Informes de proyecto", icon: "statusreport", group: "main" },
  { id: "templates", label: "Mis Plantillas", icon: "templates", group: "secondary" },
  { id: "knowledge", label: "Base de conocimiento", icon: "knowledge", group: "secondary" },
  { id: "stakeholders", label: "Contactos clave", icon: "stakeholders", group: "secondary" },
  { id: "empresa", label: "Objetivos de Empresa", icon: "empresa", group: "secondary" },
  { id: "chatbot", label: "Pregunta al PM virtual", icon: "chatbot", group: "secondary" },
];
