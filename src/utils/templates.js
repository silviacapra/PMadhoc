export function filterTemplates(templates, phase, methodology, sostenibleOnly, disponibleOnly) {
  return templates.filter((t) => {
    const matchesPhase = phase === "todas" || t.phase === phase;
    const matchesMethodology = methodology === "todas" || t.methodologies.includes(methodology);
    const matchesSostenible = !sostenibleOnly || t.sostenible;
    const matchesDisponible = !disponibleOnly || t.disponible;
    return matchesPhase && matchesMethodology && matchesSostenible && matchesDisponible;
  });
}
