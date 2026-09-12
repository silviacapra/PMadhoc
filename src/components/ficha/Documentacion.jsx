import "./FichaProyecto.css";

export default function Documentacion({ documentacion }) {
  const { groups } = documentacion;

  return (
    <div className="section-card">
      <h3 className="section-heading">Documentación</h3>
      <p className="gate-subtitle">
        Se rellena sola: en cuanto marcas un entregable como hecho y le enlazas un documento en Fases del proyecto,
        aparece aquí agrupado por fase.
      </p>

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
  );
}
