import { DownloadIcon, SearchIcon, PlusIcon } from "../icons/Icons";
import { TEMPLATE_CATEGORY_STYLES } from "../../data/statusStyles";
import { TYPE_LABELS } from "../../data/templates";
import AddTemplateModal from "./AddTemplateModal";
import "./Templates.css";

function TemplateCard({ tpl }) {
  const badge = TEMPLATE_CATEGORY_STYLES[tpl.category] || { bg: "#F4F4F4", color: "#6B6B6B" };
  const isAvailable = tpl.disponible && tpl.file;

  return (
    <div className="template-card">
      <div className="template-card-header">
        <span className="template-badge" style={{ background: badge.bg, color: badge.color }}>
          {badge.emoji && <span className="template-badge-emoji">{badge.emoji}</span>}
          {tpl.category}
        </span>
        <span className="template-format">{tpl.format}</span>
      </div>
      {tpl.tipo && <span className="template-type-tag">{TYPE_LABELS[tpl.tipo] || tpl.tipo}</span>}
      <h4>{tpl.title}</h4>
      <p>{tpl.desc}</p>

      {isAvailable ? (
        <a className="template-download-btn" href={tpl.file} download>
          <DownloadIcon size={14} color="currentColor" />
          Descargar
        </a>
      ) : (
        <button className="template-download-btn template-download-btn--disabled" disabled>
          <DownloadIcon size={14} color="currentColor" />
          No disponible todavía
        </button>
      )}
    </div>
  );
}

export default function Templates({ templates }) {
  const {
    phaseFilters,
    methodologyFilters,
    typeFilters,
    activePhaseFilter,
    activeMethodologyFilter,
    activeTypeFilter,
    sostenibleOnly,
    disponibleOnly,
    searchQuery,
    filteredTemplates,
    pickPhaseFilter,
    setMethodologyFilter,
    setTypeFilter,
    setSostenibleOnly,
    setDisponibleOnly,
    setSearchQuery,
    addTemplateOpen,
    setAddTemplateOpen,
    addTemplate,
  } = templates;

  return (
    <div>
      <div className="template-page-header">
        <div>
          <h1 className="page-title">Repositorio de plantillas</h1>
          <p className="page-subtitle">Documentos y artefactos del PMI, listos para usar sin partir de cero.</p>
        </div>
        <button className="new-project-btn" onClick={() => setAddTemplateOpen(true)}>
          <PlusIcon size={16} color="currentColor" />
          Añadir plantilla
        </button>
      </div>

      <div className="template-search-row">
        <SearchIcon size={16} color="#8A8A8A" />
        <input
          type="text"
          placeholder="Buscar plantillas por nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="template-filter-label">Fase</div>
      <div className="phase-filter-row">
        {phaseFilters.map((pf) => {
          const active = pf.id === activePhaseFilter;
          return (
            <span
              key={pf.id}
              className={`phase-filter-pill ${active ? "phase-filter-pill--active" : ""}`}
              onClick={() => pickPhaseFilter(pf.id)}
            >
              {pf.label}
            </span>
          );
        })}
      </div>

      <div className="template-filter-label">Tipo de proyecto</div>
      <div className="phase-filter-row">
        {methodologyFilters.map((mf) => {
          const active = mf.id === activeMethodologyFilter;
          return (
            <span
              key={mf.id}
              className={`phase-filter-pill ${active ? "phase-filter-pill--active" : ""}`}
              onClick={() => setMethodologyFilter(mf.id)}
            >
              {mf.label}
            </span>
          );
        })}
      </div>

      <div className="template-filter-label">Tipo de plantilla</div>
      <div className="phase-filter-row">
        {typeFilters.map((tf) => {
          const active = tf.id === activeTypeFilter;
          return (
            <span
              key={tf.id}
              className={`phase-filter-pill ${active ? "phase-filter-pill--active" : ""}`}
              onClick={() => setTypeFilter(tf.id)}
            >
              {tf.label}
            </span>
          );
        })}
      </div>

      <div className="template-filter-label">Otros</div>
      <div className="phase-filter-row">
        <span
          className={`phase-filter-pill ${sostenibleOnly ? "phase-filter-pill--active" : ""}`}
          onClick={() => setSostenibleOnly(!sostenibleOnly)}
        >
          🌱 Proyectos sostenibles
        </span>
        <span
          className={`phase-filter-pill ${disponibleOnly ? "phase-filter-pill--active" : ""}`}
          onClick={() => setDisponibleOnly(!disponibleOnly)}
        >
          ✅ Solo disponibles
        </span>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="template-grid">
          {filteredTemplates.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} />
          ))}
        </div>
      ) : (
        <div className="template-empty">
          <span>No hay plantillas para este filtro todavía.</span>
        </div>
      )}

      <AddTemplateModal open={addTemplateOpen} onClose={() => setAddTemplateOpen(false)} onCreate={addTemplate} />
    </div>
  );
}
