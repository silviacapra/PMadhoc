export const PROJECT_STATUS_STYLES = {
  onTrack: { label: "EN MARCHA", dot: "var(--status-ontrack-dot)", bg: "var(--status-ontrack-bg)", color: "var(--status-ontrack-color)" },
  atRisk: { label: "EN RIESGO", dot: "var(--status-atrisk-dot)", bg: "var(--status-atrisk-bg)", color: "var(--status-atrisk-color)" },
  critical: { label: "CRÍTICO", dot: "var(--status-critical-dot)", bg: "var(--status-critical-bg)", color: "var(--status-critical-color)" },
};

export const IMPACT_STYLES = {
  alto: { label: "ALTO", color: "var(--status-critical-dot)" },
  medio: { label: "MEDIO", color: "var(--status-atrisk-color)" },
  bajo: { label: "BAJO", color: "var(--status-ontrack-dot)" },
};

export const ROADMAP_STEP_STATUS_DEFS = {
  green: { label: "En curso", dot: "var(--status-ontrack-dot)", bg: "var(--status-ontrack-bg)", color: "var(--status-ontrack-color)" },
  yellow: { label: "Atención", dot: "var(--status-atrisk-dot)", bg: "var(--status-atrisk-bg)", color: "var(--status-atrisk-color)" },
  red: { label: "Crítico", dot: "var(--status-critical-dot)", bg: "var(--status-critical-bg)", color: "var(--status-critical-color)" },
  done: { label: "Completado", dot: "var(--status-done-dot)", bg: "var(--status-done-bg)", color: "var(--status-done-color)" },
};

export const TEMPLATE_CATEGORY_STYLES = {
  Fundamentos: { bg: "#E8F6EF", color: "#4CAF88" },
  Inicio: { bg: "#E4F0FB", color: "#002D62" },
  Planificación: { bg: "#FFF4E0", color: "#9A6300" },
  Ejecución: { bg: "#E9F7EF", color: "#1E7A45" },
  Controlar: { bg: "#F1E9FB", color: "#5B3A9E" },
  Cierre: { bg: "#FDECEC", color: "#B3261E" },
};
