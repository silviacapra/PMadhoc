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
  notStarted: { label: "Sin empezar", dot: "#B7B7B7", bg: "var(--gray-light)", color: "var(--text-faint)" },
  green: { label: "En curso", dot: "var(--accent)", bg: "var(--status-ontrack-bg)", color: "var(--status-ontrack-color)" },
  yellow: { label: "Atención", dot: "var(--status-atrisk-dot)", bg: "var(--status-atrisk-bg)", color: "var(--status-atrisk-color)" },
  red: { label: "Crítico", dot: "var(--status-critical-dot)", bg: "var(--status-critical-bg)", color: "var(--status-critical-color)" },
  done: { label: "Completado", dot: "var(--status-done-dot)", bg: "var(--status-done-bg)", color: "var(--status-done-color)" },
};

export const TEMPLATE_CATEGORY_STYLES = {
  Fundamentos: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "📘" },
  Inicio: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "🚀" },
  Planificación: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "📋" },
  Ejecución: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "⚙️" },
  Controlar: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "🔍" },
  Cierre: { bg: "#F4F4F4", color: "#6B6B6B", emoji: "✅" },
};
