import { ROADMAP_CONTENT, PHASE_ORDER, DEFAULT_TASK_STATUS } from "../data/roadmapContent";

export function buildPhases(selectedPhase, currentPhase) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  return PHASE_ORDER.map((id, i) => {
    const isSelected = id === selectedPhase;
    const isPastOrCurrent = i <= currentIndex;
    return {
      id,
      name: ROADMAP_CONTENT[id].label,
      index: i,
      isSelected,
      isPastOrCurrent,
      showLine: i < PHASE_ORDER.length - 1,
      isLineFilled: i < currentIndex,
    };
  });
}

export function buildRoadmapSteps(selectedPhase, taskAssignments, expandedStepKey) {
  return ROADMAP_CONTENT[selectedPhase].steps.map((step, idx) => {
    const key = `${selectedPhase}__${idx}`;
    const defaults = DEFAULT_TASK_STATUS[key] || {};
    const meta = { ...defaults, ...(taskAssignments[key] || {}) };
    const status = meta.status || null;
    const isDone = status === "done";

    const metaParts = [];
    if (meta.assignee) metaParts.push(meta.assignee);
    if (meta.startDate || meta.endDate) metaParts.push(`${meta.startDate || "¿?"} → ${meta.endDate || "¿?"}`);
    if (meta.link) metaParts.push("enlace ↗");

    return {
      key,
      title: step.title,
      detail: step.detail,
      status,
      isDone,
      hasStatus: !!status && !isDone,
      expanded: expandedStepKey === key,
      hasMeta: metaParts.length > 0,
      metaSummary: metaParts.join(" · "),
      assignee: meta.assignee || "",
      startDate: meta.startDate || "",
      endDate: meta.endDate || "",
      link: meta.link || "",
      hasLink: !!meta.link,
    };
  });
}

export function nextPhase(phaseId) {
  const idx = PHASE_ORDER.indexOf(phaseId);
  return idx >= 0 && idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
}

const PHASE_LABEL_TO_KEY = {
  "Pre-proyecto": "preproyecto",
  Iniciar: "iniciar",
  Planificar: "planificar",
  Ejecutar: "ejecutar",
  Controlar: "controlar",
  Cerrar: "cerrar",
};

export function phaseLabelToKey(label) {
  return PHASE_LABEL_TO_KEY[label] || "preproyecto";
}
