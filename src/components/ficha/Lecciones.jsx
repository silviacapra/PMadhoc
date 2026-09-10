import "./FichaProyecto.css";

export default function Lecciones({ lecciones }) {
  const { items, form, updateField, add } = lecciones;

  return (
    <div className="section-card">
      <h3 className="section-heading">Lecciones aprendidas</h3>
      <p className="gate-subtitle">Un registro abierto: añade una lección cuando quieras, no solo al cerrar el proyecto.</p>

      {items.length === 0 ? (
        <p className="registry-empty">Todavía no hay lecciones registradas.</p>
      ) : (
        <div className="registry-list">
          {[...items].reverse().map((it) => (
            <div key={it.id} className="registry-row">
              <div className="registry-body">
                <p className="registry-desc">{it.texto}</p>
                <span className="registry-meta">
                  {it.autor} · {it.fecha}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="registry-form">
        <textarea rows={2} placeholder="¿Qué has aprendido?" value={form.texto} onChange={(e) => updateField("texto", e.target.value)} />
        <button className="okr-add-btn" onClick={add}>
          Añadir lección
        </button>
      </div>
    </div>
  );
}
