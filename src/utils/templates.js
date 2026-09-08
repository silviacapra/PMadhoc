import { ROADMAP_CONTENT } from "../data/roadmapContent";

export function getTaskOptions(phase) {
  return ROADMAP_CONTENT[phase] ? ROADMAP_CONTENT[phase].steps.map((s) => s.title) : [];
}

export function filterTemplates(templates, phase, task) {
  return templates.filter((t) => {
    const matchesPhase = phase === "todas" || t.phase === phase;
    const matchesTask = task === "todas" || t.task === task;
    return matchesPhase && matchesTask;
  });
}
