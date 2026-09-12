import { PHASE_ORDER, ROADMAP_CONTENT } from "../../data/roadmapContent";
import "./Registro.css";

function faseLabel(fase) {
  if (fase === "generica" || !fase) return "Genérica";
  return ROADMAP_CONTENT[fase]?.label || fase;
}

export default function Lecciones({ lecciones }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, form, updateField, add, teamMembers } = lecciones;
  const project = projects.find((p) => p.id === selectedProjectId);

  return (
    <div>
      <h1 className="page-title">Lecciones aprendidas</h1>
      <p className="page-subtitle">
        Registro abierto del proyecto elegido: añade una lección en cualquier fase, no solo al cerrar.
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
        <p className="registry-empty">Crea un proyecto primero para poder registrar sus lecciones.</p>
      ) : (
        <div className="section-card">
          {items.length === 0 ? (
            <p className="registry-empty">Todavía no hay lecciones registradas para este proyecto.</p>
          ) : (
            <div className="registry-list">
              {items.map((l) => (
                <div key={l.id} className="registry-row">
                  <div>
                    <p className="registry-desc">{l.texto}</p>
                    <span className="registry-meta">
                      {faseLabel(l.fase)} · {l.autor} · {l.fecha}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="registry-form">
            <textarea
              rows={3}
              placeholder="¿Qué ha pasado, y qué harías diferente la próxima vez?"
              value={form.texto}
              onChange={(e) => updateField("texto", e.target.value)}
            />
            <div className="registry-form-row registry-form-row--two">
              <select value={form.fase} onChange={(e) => updateField("fase", e.target.value)}>
                <option value="generica">Genérica (ej: cómo mejorar las reuniones)</option>
                {PHASE_ORDER.map((f) => (
                  <option key={f} value={f}>
                    {ROADMAP_CONTENT[f].label}
                  </option>
                ))}
              </select>
              <select value={form.autor} onChange={(e) => updateField("autor", e.target.value)}>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.name}>
                    {tm.name} · {tm.roleLabel}
                  </option>
                ))}
              </select>
            </div>
            <button className="okr-add-btn" onClick={add}>
              Añadir lección
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
