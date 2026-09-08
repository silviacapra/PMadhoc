export const STATUS_REPORT = {
  projectName: "Migración de plataforma CRM",
  period: "1-8 sept 2026",
  preparedBy: "Silvia Capra",
  overallStatus: "atRisk",
  categories: [
    { label: "Alcance", status: "onTrack", note: "Sin cambios de scope este periodo." },
    { label: "Cronograma", status: "atRisk", note: "18 días para el cierre; margen ajustado." },
    { label: "Presupuesto", status: "onTrack", note: "Dentro de lo previsto, 58% ejecutado." },
    { label: "Equipo", status: "critical", note: "QA con disponibilidad limitada en sprint 6." },
  ],
  achievements: [
    "Migración de los módulos de contactos y oportunidades completada.",
    "Pruebas de integración con el ERP superadas sin incidencias.",
    "Kickoff del plan de comunicación de cambio con el equipo comercial.",
  ],
  nextSteps: [
    "Cerrar la migración de datos históricos antes del 15 de septiembre.",
    "Confirmar disponibilidad del equipo de QA para el sprint 6.",
    "Programar la sesión de formación para usuarios finales.",
  ],
  risks: [
    { desc: "Retraso en la migración de datos históricos", impact: "alto", owner: "Marco Rossi", status: "Mitigando" },
    { desc: "Dependencia de proveedor externo de API", impact: "medio", owner: "Laura Fernández", status: "En seguimiento" },
    { desc: "Disponibilidad del equipo de QA en sprint 6", impact: "medio", owner: "Silvia Capra", status: "Escalado" },
  ],
  budgetSpent: "46.400 €",
  budgetTotal: "80.000 €",
  budgetPct: 58,
};
