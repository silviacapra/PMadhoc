export function filterTemplates(templates, phase, methodology, sostenibleOnly, disponibleOnly, tipo, searchQuery) {
  const query = (searchQuery || "").trim().toLowerCase();
  return templates.filter((t) => {
    const matchesPhase = phase === "todas" || t.phase === phase;
    const matchesMethodology = methodology === "todas" || t.methodologies.includes(methodology);
    const matchesSostenible = !sostenibleOnly || t.sostenible;
    const matchesDisponible = !disponibleOnly || t.disponible;
    const matchesTipo = !tipo || tipo === "todos" || t.tipo === tipo;
    const matchesQuery = !query || t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query);
    return matchesPhase && matchesMethodology && matchesSostenible && matchesDisponible && matchesTipo && matchesQuery;
  });
}
