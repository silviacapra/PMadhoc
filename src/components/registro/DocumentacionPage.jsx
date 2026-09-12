import "./Registro.css";
import "../ficha/FichaProyecto.css";

export default function DocumentacionPage({ documentacionPage }) {
  const { projects, selectedProjectId, setSelectedProjectId, groups } = documentacionPage;
  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div>
      <h1 className="page-title">Documentación</h1>
      <p className="page-subtitle">
        Se rellena sola con los entregables que se marcan como hechos y se enlazan en el Roadmap de cada proyecto.
      </p>

      <div className="registro-project-picker">
        <label>Proyecto</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para poder ver su documentación.</p>
      ) : (
        <div className="section-card">
          {groups.length === 0 ? (
            <p className="registry-empty">Todavía no hay ningún entregable marcado como hecho con un documento enlazado.</p>
          ) : (
            groups.map((g) => (
              <div key={g.phaseId} className="doc-group">
                <span className="okr-year-label">{g.phaseLabel}</span>
                {g.docs.map((d) => (
                  <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="doc-row">
                    {d.titulo}
                  </a>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
