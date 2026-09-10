import { ROADMAP_CONTENT, PHASE_ORDER } from "../../data/roadmapContent";
import "./FichaProyecto.css";

export default function Documentacion({ documentacion }) {
  const { items, form, updateField, add } = documentacion;
  const siempre = items.filter((d) => !d.fase);

  return (
    <div className="section-card">
      <h3 className="section-heading">Documentación</h3>
      <p className="gate-subtitle">Documentos del proyecto, organizados por la fase en la que se generaron.</p>

      <div className="doc-group">
        <span className="okr-year-label">Siempre disponibles</span>
        {siempre.length === 0 ? (
          <p className="registry-empty">Sin documentos.</p>
        ) : (
          siempre.map((d) => (
            <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="doc-row">
              {d.titulo}
            </a>
          ))
        )}
      </div>

      {PHASE_ORDER.map((faseId) => {
        const docs = items.filter((d) => d.fase === faseId);
        if (docs.length === 0) return null;
        return (
          <div key={faseId} className="doc-group">
            <span className="okr-year-label">{ROADMAP_CONTENT[faseId].label}</span>
            {docs.map((d) => (
              <a key={d.id} href={d.url} target="_blank" rel="noreferrer" className="doc-row">
                {d.titulo}
              </a>
            ))}
          </div>
        );
      })}

      <div className="registry-form">
        <input type="text" placeholder="Título del documento" value={form.titulo} onChange={(e) => updateField("titulo", e.target.value)} />
        <div className="registry-form-row">
          <select value={form.fase} onChange={(e) => updateField("fase", e.target.value)}>
            <option value="">Siempre disponible</option>
            {PHASE_ORDER.map((f) => (
              <option key={f} value={f}>
                {ROADMAP_CONTENT[f].label}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Enlace (URL)" value={form.url} onChange={(e) => updateField("url", e.target.value)} />
        </div>
        <button className="okr-add-btn" onClick={add}>
          Añadir documento
        </button>
      </div>
    </div>
  );
}
