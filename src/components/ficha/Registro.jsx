import { IMPACT_STYLES } from "../../data/statusStyles";
import "./FichaProyecto.css";

export default function Registro({ title, subtitle, registry }) {
  const { items, form, updateField, add } = registry;

  return (
    <div className="section-card">
      <h3 className="section-heading">{title}</h3>
      <p className="gate-subtitle">{subtitle}</p>

      {items.length === 0 ? (
        <p className="registry-empty">Todavía no hay elementos registrados.</p>
      ) : (
        <div className="registry-list">
          {items.map((it) => (
            <div key={it.id} className="registry-row">
              <span className="registry-impact" style={{ color: IMPACT_STYLES[it.impact]?.color }}>
                {IMPACT_STYLES[it.impact]?.label}
              </span>
              <div className="registry-body">
                <p className="registry-desc">{it.desc}</p>
                <span className="registry-meta">
                  {it.owner || "Sin asignar"} · {it.status || "Sin estado"} · {it.fecha}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="registry-form">
        <input type="text" placeholder="Descripción" value={form.desc} onChange={(e) => updateField("desc", e.target.value)} />
        <div className="registry-form-row">
          <select value={form.impact} onChange={(e) => updateField("impact", e.target.value)}>
            <option value="bajo">Impacto bajo</option>
            <option value="medio">Impacto medio</option>
            <option value="alto">Impacto alto</option>
          </select>
          <input type="text" placeholder="Responsable" value={form.owner} onChange={(e) => updateField("owner", e.target.value)} />
          <input
            type="text"
            placeholder="Estado (ej: En seguimiento)"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          />
        </div>
        <button className="okr-add-btn" onClick={add}>
          Añadir
        </button>
      </div>
    </div>
  );
}
