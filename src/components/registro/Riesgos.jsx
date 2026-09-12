import { IMPACT_STYLES } from "../../data/statusStyles";
import "./Registro.css";

const IMPACT_OPTIONS = ["bajo", "medio", "alto"];

export default function Riesgos({ riesgos }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, form, updateField, add } = riesgos;
  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div>
      <h1 className="page-title">Registro de riesgos</h1>
      <p className="page-subtitle">Riesgos identificados para el proyecto elegido, siempre visibles sin importar la fase.</p>

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
        <p className="registry-empty">Crea un proyecto primero para poder registrar sus riesgos.</p>
      ) : (
        <div className="section-card">
          {items.length === 0 ? (
            <p className="registry-empty">Todavía no hay riesgos registrados para este proyecto.</p>
          ) : (
            <div className="registry-list">
              {items.map((r) => (
                <div key={r.id} className="registry-row">
                  <span className="registry-impact" style={{ color: IMPACT_STYLES[r.impact]?.color }}>
                    {IMPACT_STYLES[r.impact]?.label || r.impact}
                  </span>
                  <div>
                    <p className="registry-desc">{r.desc}</p>
                    <span className="registry-meta">
                      {r.owner || "Sin propietario"} {r.status && `· ${r.status}`} · {r.fecha}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="registry-form">
            <textarea
              rows={2}
              placeholder="Descripción del riesgo"
              value={form.desc}
              onChange={(e) => updateField("desc", e.target.value)}
            />
            <div className="registry-form-row">
              <select value={form.impact} onChange={(e) => updateField("impact", e.target.value)}>
                {IMPACT_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    Impacto {i}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Propietario" value={form.owner} onChange={(e) => updateField("owner", e.target.value)} />
              <input
                type="text"
                placeholder="Estado (ej: En seguimiento)"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              />
            </div>
            <button className="okr-add-btn" onClick={add}>
              Añadir riesgo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
