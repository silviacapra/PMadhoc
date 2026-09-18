export function filterTemplates(templates, phases, methodologies, sostenibleOnly, disponibleOnly, tipos, searchQuery) {
  const query = (searchQuery || "").trim().toLowerCase();
  return templates
    .filter((t) => {
      const matchesPhase = !phases || phases.length === 0 || phases.includes(t.phase);
      const matchesMethodology = !methodologies || methodologies.length === 0 || t.methodologies.some((m) => methodologies.includes(m));
      const matchesSostenible = !sostenibleOnly || t.sostenible;
      const matchesDisponible = !disponibleOnly || t.disponible;
      const matchesTipo = !tipos || tipos.length === 0 || tipos.includes(t.tipo);
      const matchesQuery = !query || t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query);
      return matchesPhase && matchesMethodology && matchesSostenible && matchesDisponible && matchesTipo && matchesQuery;
    })
    .sort((a, b) => (b.disponible === true) - (a.disponible === true));
}
