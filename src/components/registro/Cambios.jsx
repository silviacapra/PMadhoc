import "../dashboard/NewProjectModal.css";
import "./Registro.css";

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Cambios({ cambios }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, canApprove, toggleAprobado } = cambios;
  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div>
      <h1 className="page-title">Registro de cambios</h1>

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
        ℹ️ Esta sección se rellena automáticamente con cada cambio que se hace en Fases del proyecto (estado, fechas, responsable,
        entregables...). El Patrocinador o el Gestor de proyecto puede marcar cada cambio como aprobado.
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para ver su registro de cambios.</p>
      ) : (
        <div className="section-card">
          {items.length === 0 ? (
            <p className="registry-empty">Todavía no se ha registrado ningún cambio en este proyecto.</p>
          ) : (
            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cambio</th>
                    <th>Solicitado por</th>
                    <th>Aprobación</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td className="registry-date-pill">{formatFecha(c.fecha)}</td>
                      <td className="registry-table-name">{c.descripcion}</td>
                      <td>{c.solicitadoPor}</td>
                      <td>
                        <label className="cambios-approve">
                          <input
                            type="checkbox"
                            checked={!!c.aprobado}
                            disabled={!canApprove}
                            onChange={(e) => toggleAprobado(c.id, e.target.checked)}
                          />
                          {c.aprobado ? `Aprobado por ${c.aprobadoPor || "—"}` : "Pendiente"}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
