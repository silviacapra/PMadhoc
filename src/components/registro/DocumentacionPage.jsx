import { ExternalLinkIcon } from "../icons/Icons";
import "./Registro.css";
import "../ficha/FichaProyecto.css";

export default function DocumentacionPage({ documentacionPage }) {
  const { projects, selectedProjectId, setSelectedProjectId, groups } = documentacionPage;
  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div>
      <h1 className="page-title">Repositorio documental</h1>

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

      <div className="doc-disclaimer">
        ℹ️ Esta sección se rellena automáticamente desde el apartado <strong>Roadmap Proyecto</strong>: en cuanto marcas un
        entregable como hecho y le añades un enlace en Fases del proyecto, aparece aquí agrupado por fase.
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para poder ver su documentación.</p>
      ) : (
        <div className="section-card">
          {groups.length === 0 ? (
            <p className="registry-empty">Todavía no hay ningún entregable marcado como hecho con un documento enlazado.</p>
          ) : (
            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Paso</th>
                    <th>Documento</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) =>
                    g.docs.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <span className="tag-pill tag-pill--blue">{g.phaseLabel}</span>
                        </td>
                        <td>{d.stepTitle}</td>
                        <td className="registry-table-name">{d.titulo}</td>
                        <td>
                          <a href={d.url} target="_blank" rel="noreferrer" className="doc-row">
                            <ExternalLinkIcon size={13} color="currentColor" />
                            Abrir
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
