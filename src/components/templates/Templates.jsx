import { DownloadIcon, SearchIcon, PlusIcon } from "../icons/Icons";
import { TEMPLATE_CATEGORY_STYLES } from "../../data/statusStyles";
import { TYPE_LABELS } from "../../data/templates";
import AddTemplateModal from "./AddTemplateModal";
import FilterDropdown from "../shared/FilterDropdown";
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
    togglePhaseFilter,
    toggleMethodologyFilter,
    toggleTypeFilter,
    clearPhaseFilter,
    clearMethodologyFilter,
    clearTypeFilter,
    setSostenibleOnly,
    setDisponibleOnly,
    setSearchQuery,
    addTemplateOpen,
    setAddTemplateOpen,
    addTemplate,
  } = templates;

  const hasActiveFilters =
    activePhaseFilter.length > 0 ||
    activeMethodologyFilter.length > 0 ||
    activeTypeFilter.length > 0 ||
    sostenibleOnly ||
    disponibleOnly ||
    searchQuery.trim().length > 0;

  function resetAllFilters() {
    clearPhaseFilter();
    clearMethodologyFilter();
    clearTypeFilter();
    setSostenibleOnly(false);
    setDisponibleOnly(false);
    setSearchQuery("");
  }

  return (
    <div>
      <div className="template-page-header">
        <div>
          <h1 className="page-title">Repositorio de plantillas</h1>
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

      <div className="template-filter-row-dropdowns">
        <FilterDropdown
          label="Fase"
          options={phaseFilters.filter((pf) => pf.id !== "todas")}
          selected={activePhaseFilter}
          onToggle={togglePhaseFilter}
          onClear={clearPhaseFilter}
        />
        <FilterDropdown
          label="Tipo de proyecto"
          options={methodologyFilters.filter((mf) => mf.id !== "todas")}
          selected={activeMethodologyFilter}
          onToggle={toggleMethodologyFilter}
          onClear={clearMethodologyFilter}
        />
        <FilterDropdown
          label="Tipo de plantilla"
          options={typeFilters.filter((tf) => tf.id !== "todos")}
          selected={activeTypeFilter}
          onToggle={toggleTypeFilter}
          onClear={clearTypeFilter}
        />
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
        {hasActiveFilters && (
          <button className="template-reset-btn" onClick={resetAllFilters}>
            Restablecer filtros
          </button>
        )}
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
