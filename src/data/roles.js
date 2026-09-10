export const ROLE_LABELS = {
  sponsor: "Sponsor",
  pm: "Project manager",
  team: "Team",
  expert: "Experto",
};

export const ROLE_PERMISSIONS = {
  sponsor: ["dashboard", "empresa", "roadmap", "statusreport", "stakeholders"],
  pm: ["dashboard", "empresa", "knowledge", "roadmap", "templates", "chatbot", "statusreport", "stakeholders"],
  team: ["dashboard", "roadmap", "templates", "chatbot", "statusreport", "stakeholders"],
  expert: ["knowledge", "templates", "chatbot"],
};

export function defaultViewForRole(role) {
  return ROLE_PERMISSIONS[role][0];
}

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", group: "main" },
  { id: "roadmap", label: "Roadmap Proyecto", icon: "roadmap", group: "main" },
  { id: "templates", label: "Plantillas", icon: "templates", group: "main" },
  { id: "statusreport", label: "Status Report", icon: "statusreport", group: "main" },
  { id: "stakeholders", label: "Stakeholders", icon: "stakeholders", group: "main" },
  { id: "empresa", label: "Empresa y OKR", icon: "empresa", group: "secondary" },
  { id: "knowledge", label: "Base de conocimiento", icon: "knowledge", group: "secondary" },
  { id: "chatbot", label: "Pregunta al PM virtual", icon: "chatbot", group: "secondary" },
];
