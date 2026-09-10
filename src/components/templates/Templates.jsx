import { useState } from "react";
import { DownloadIcon, ChevronDownIcon } from "../icons/Icons";
import { TEMPLATE_CATEGORY_STYLES } from "../../data/statusStyles";
import "./Templates.css";

function TemplateCard({ tpl, onMigrate }) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const badge = TEMPLATE_CATEGORY_STYLES[tpl.category] || { bg: "#F4F4F4", color: "#6B6B6B" };
  const hasNewerVersion = tpl.adoptedVersion !== tpl.latestVersion;

  return (
    <div className="template-card">
      <div className="template-card-header">
        <span className="template-badge" style={{ background: badge.bg, color: badge.color }}>
          {badge.emoji && <span className="template-badge-emoji">{badge.emoji}</span>}
          {tpl.category}
        </span>
        <span className="template-format">{tpl.format}</span>
      </div>
      <h4>{tpl.title}</h4>
      <p>{tpl.desc}</p>

      <div className="template-version-row">
        <span className="template-version-current">Versión adoptada: {tpl.adoptedVersion}</span>
      </div>

      {hasNewerVersion && (
        <div className="template-version-alert">
          <span>Hay una versión más nueva disponible: {tpl.latestVersion}</span>
          <button className="template-migrate-btn" onClick={() => onMigrate(tpl.id)}>
            Migrar
          </button>
        </div>
      )}

      <button className="template-history-toggle" onClick={() => setHistoryOpen((v) => !v)}>
        Historial de versiones
        <ChevronDownIcon size={13} color="currentColor" style={{ transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {historyOpen && (
        <div className="template-history-list">
          {[...tpl.versionHistory].reverse().map((v) => (
            <div key={v.version} className="template-history-item">
              <span className="template-history-version">{v.version}</span>
              <div>
                <span className="template-history-date">{v.date}</span>
                <p>{v.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tpl.disponible && tpl.file ? (
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
    activePhaseFilter,
    activeMethodologyFilter,
    sostenibleOnly,
    filteredTemplates,
    pickPhaseFilter,
    setMethodologyFilter,
    setSostenibleOnly,
    migrateTemplate,
  } = templates;

  return (
    <div>
      <h1 className="page-title">Repositorio de plantillas</h1>
      <p className="page-subtitle">Documentos y artefactos del PMI, listos para usar sin partir de cero.</p>

      <div className="template-filter-label">Fase</div>
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

      <div className="template-filter-label">Tipo de proyecto</div>
      <div className="phase-filter-row">
        {methodologyFilters.map((mf) => {
          const active = mf.id === activeMethodologyFilter;
          return (
            <span
              key={mf.id}
              className="phase-filter-pill"
              style={{ background: active ? "var(--accent)" : "var(--gray-light)", color: active ? "#FFFFFF" : "#6B6B6B" }}
              onClick={() => setMethodologyFilter(mf.id)}
            >
              {mf.label}
            </span>
          );
        })}
        <span
          className="phase-filter-pill"
          style={{ background: sostenibleOnly ? "var(--accent)" : "var(--gray-light)", color: sostenibleOnly ? "#FFFFFF" : "#6B6B6B" }}
          onClick={() => setSostenibleOnly(!sostenibleOnly)}
        >
          🌱 Proyectos sostenibles
        </span>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="template-grid">
          {filteredTemplates.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onMigrate={migrateTemplate} />
          ))}
        </div>
      ) : (
        <div className="template-empty">
          <span>No hay plantillas para este filtro todavía.</span>
        </div>
      )}
    </div>
  );
}
