import { ROADMAP_CONTENT, PHASE_ORDER, DEFAULT_TASK_STATUS } from "../data/roadmapContent";

// Los estados de ejemplo (done/green/yellow) solo son reales para los 3
// proyectos de muestra originales. Cualquier otro proyecto (incluidos los que
// crea el usuario) debe partir siempre de "notStarted", nunca heredar el
// avance de la demo.
const DEMO_SEED_PROJECT_IDS = new Set(["crm-migration", "client-portal", "sales-crm"]);

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
      locked: i > currentIndex,
      showLine: i < PHASE_ORDER.length - 1,
      isLineFilled: i < currentIndex,
    };
  });
}

export function buildRoadmapSteps(selectedPhase, taskAssignments, expandedStepKey, projectId) {
  const useDemoDefaults = DEMO_SEED_PROJECT_IDS.has(projectId);
  return ROADMAP_CONTENT[selectedPhase].steps.map((step, idx) => {
    const key = `${selectedPhase}__${idx}`;
    const defaults = (useDemoDefaults && DEFAULT_TASK_STATUS[key]) || {};
    const meta = { ...defaults, ...(taskAssignments[key] || {}) };
    const status = meta.status || (useDemoDefaults ? null : "notStarted");
    const isDone = status === "done";
    const outputsMeta = meta.outputs || {};
    const outputs = (step.outputs || []).map((label, outIdx) => ({
      index: outIdx,
      label,
      done: !!outputsMeta[outIdx]?.done,
      link: outputsMeta[outIdx]?.link || "",
    }));

    const metaParts = [];
    if (meta.assignee) metaParts.push(meta.assignee);
    if (meta.startDate || meta.endDate) metaParts.push(`${meta.startDate || "¿?"} → ${meta.endDate || "¿?"}`);
    const doneOutputs = outputs.filter((o) => o.done).length;
    if (outputs.length > 0) metaParts.push(`${doneOutputs}/${outputs.length} entregables`);

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
      outputs,
    };
  });
}

export function buildGanttRows(taskAssignments, projectId) {
  const useDemoDefaults = DEMO_SEED_PROJECT_IDS.has(projectId);
  return PHASE_ORDER.map((phaseId) => ({
    phaseId,
    phaseLabel: ROADMAP_CONTENT[phaseId].label,
    steps: ROADMAP_CONTENT[phaseId].steps.map((step, idx) => {
      const key = `${phaseId}__${idx}`;
      const defaults = (useDemoDefaults && DEFAULT_TASK_STATUS[key]) || {};
      const meta = { ...defaults, ...(taskAssignments[key] || {}) };
      return {
        key,
        title: step.title,
        status: meta.status || (useDemoDefaults ? null : "notStarted"),
        startDate: meta.startDate || "",
        endDate: meta.endDate || "",
      };
    }),
  }));
}

export function buildDocumentacionGroups(taskAssignments) {
  return PHASE_ORDER.map((phaseId) => {
    const docs = [];
    ROADMAP_CONTENT[phaseId].steps.forEach((step, idx) => {
      const key = `${phaseId}__${idx}`;
      const outputsMeta = taskAssignments[key]?.outputs || {};
      (step.outputs || []).forEach((label, outIdx) => {
        const meta = outputsMeta[outIdx];
        if (meta?.done && meta?.link) {
          docs.push({ id: `${key}__${outIdx}`, titulo: label, url: meta.link, stepTitle: step.title });
        }
      });
    });
    return { phaseId, phaseLabel: ROADMAP_CONTENT[phaseId].label, docs };
  }).filter((g) => g.docs.length > 0);
}

export function buildInitialTaskAssignments() {
  const assignments = {};
  PHASE_ORDER.forEach((phaseId) => {
    ROADMAP_CONTENT[phaseId].steps.forEach((step, idx) => {
      assignments[`${phaseId}__${idx}`] = { status: "notStarted" };
    });
  });
  return assignments;
}

export function getCurrentTaskStatus(currentPhase, taskAssignments, projectId) {
  if (!currentPhase || !ROADMAP_CONTENT[currentPhase]) return null;
  const steps = ROADMAP_CONTENT[currentPhase].steps;
  if (steps.length === 0) return null;
  const useDemoDefaults = DEMO_SEED_PROJECT_IDS.has(projectId);

  const statusOf = (idx) => {
    const key = `${currentPhase}__${idx}`;
    const defaults = (useDemoDefaults && DEFAULT_TASK_STATUS[key]) || {};
    const meta = { ...defaults, ...(taskAssignments[key] || {}) };
    return meta.status || "notStarted";
  };

  // Prefer the first not-done step (the one actually in progress); fall back
  // to the last step if the whole phase is already done.
  for (let idx = 0; idx < steps.length; idx++) {
    const status = statusOf(idx);
    if (status !== "done") return { title: steps[idx].title, status };
  }
  return { title: steps[steps.length - 1].title, status: statusOf(steps.length - 1) };
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
