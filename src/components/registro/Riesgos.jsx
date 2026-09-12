import { RISK_CATEGORIES, PROBABILIDAD_OPTIONS, ANALISIS_OPTIONS, RIESGO_ESTADO_OPTIONS } from "../../data/riesgos";
import { IMPACT_STYLES } from "../../data/statusStyles";
import "./Registro.css";

export default function Riesgos({ riesgos }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, form, updateField, add, teamMembers } = riesgos;
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
                  <span className="registry-impact" style={{ color: IMPACT_STYLES[r.impacto]?.color }}>
                    {IMPACT_STYLES[r.impacto]?.label || r.impacto}
                  </span>
                  <div>
                    <p className="registry-desc">
                      {r.nombre} <span className="registry-priority">Prioridad {r.prioridad || "—"}</span>
                    </p>
                    <p className="registry-note">{r.desc}</p>
                    {r.mitigacion && <p className="registry-note">Plan de acción: {r.mitigacion}</p>}
                    <span className="registry-meta">
                      {r.categoria} · {r.probabilidad} · {r.propietario || "Sin propietario"} · {r.estado} · {r.fecha}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="registry-form">
            <input type="text" placeholder="Nombre del riesgo" value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} />
            <textarea
              rows={2}
              placeholder="Descripción del riesgo"
              value={form.desc}
              onChange={(e) => updateField("desc", e.target.value)}
            />
            <div className="registry-form-row">
              <select value={form.categoria} onChange={(e) => updateField("categoria", e.target.value)}>
                {RISK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select value={form.probabilidad} onChange={(e) => updateField("probabilidad", e.target.value)}>
                {PROBABILIDAD_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select value={form.impacto} onChange={(e) => updateField("impacto", e.target.value)}>
                {ANALISIS_OPTIONS.map((a) => (
                  <option key={a.id} value={a.id}>
                    Análisis: {a.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="Mitigación / plan de acción"
              value={form.mitigacion}
              onChange={(e) => updateField("mitigacion", e.target.value)}
            />
            <div className="registry-form-row">
              <input
                type="number"
                min="1"
                placeholder="Prioridad"
                value={form.prioridad}
                onChange={(e) => updateField("prioridad", e.target.value)}
              />
              <select value={form.propietario} onChange={(e) => updateField("propietario", e.target.value)}>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.name}>
                    {tm.name} · {tm.roleLabel}
                  </option>
                ))}
              </select>
              <select value={form.estado} onChange={(e) => updateField("estado", e.target.value)}>
                {RIESGO_ESTADO_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
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
