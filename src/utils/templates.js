export function filterTemplates(templates, phase, methodology, sostenibleOnly) {
  return templates.filter((t) => {
    const matchesPhase = phase === "todas" || t.phase === phase;
    const matchesMethodology = methodology === "todas" || t.methodologies.includes(methodology);
    const matchesSostenible = !sostenibleOnly || t.sostenible;
    return matchesPhase && matchesMethodology && matchesSostenible;
  });
}
