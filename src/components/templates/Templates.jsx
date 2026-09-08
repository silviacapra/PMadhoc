import { DownloadIcon } from "../icons/Icons";
import { TEMPLATE_CATEGORY_STYLES } from "../../data/statusStyles";
import "./Templates.css";

export default function Templates({ templates }) {
  const { phaseFilters, activePhaseFilter, activeTaskFilter, taskOptions, filteredTemplates, pickPhaseFilter, setTaskFilter } = templates;

  return (
    <div>
      <h1 className="page-title">Repositorio de plantillas</h1>
      <p className="page-subtitle">Documentos y artefactos del PMI, listos para usar sin partir de cero.</p>

      <div className="phase-filter-row">
        {phaseFilters.map((pf) => {
          const active = pf.id === activePhaseFilter;
          return (
            <span
              key={pf.id}
              className="phase-filter-pill"
              style={{ background: active ? "var(--accent)" : "var(--gray-light)", color: active ? "#FFFFFF" : "#6B6B6B" }}
              onClick={() => pickPhaseFilter(pf.id)}
            >
              {pf.label}
            </span>
          );
        })}
      </div>

      <div className="task-filter-row">
        <span>Tarea específica</span>
        <select value={activeTaskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
          <option value="todas">Todas las tareas</option>
          {taskOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="template-grid">
          {filteredTemplates.map((tpl) => {
            const badge = TEMPLATE_CATEGORY_STYLES[tpl.category] || { bg: "#F4F4F4", color: "#6B6B6B" };
            return (
              <div key={tpl.title} className="template-card">
                <div className="template-card-header">
                  <span className="template-badge" style={{ background: badge.bg, color: badge.color }}>
                    {tpl.category}
                  </span>
                  <span className="template-format">{tpl.format}</span>
                </div>
                <h4>{tpl.title}</h4>
                <p>{tpl.desc}</p>
                <button className="template-download-btn">
                  <DownloadIcon size={14} color="currentColor" />
                  Descargar
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="template-empty">
          <span>No hay plantillas para este filtro todavía.</span>
        </div>
      )}
    </div>
  );
}
