import { useState } from "react";
import { CheckIcon, ArrowRightIcon, WarningIcon, DownloadIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import { PROJECT_STATUS_STYLES, ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";
import "./StatusReport.css";

function formatFecha(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function riskLevel(risks) {
  if (risks >= 4) return "alto";
  if (risks >= 2) return "medio";
  return "bajo";
}

const CATEGORY_CYCLE = ["onTrack", "atRisk", "critical"];

function nextInCycle(cycle, current) {
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}

function CircularStat({ value, sublabel, color }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  return (
    <svg viewBox="0 0 100 100" width="108" height="108">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--gray-light)" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--gray-dark)">
        {value}%
      </text>
      <text x="50" y="64" textAnchor="middle" fontSize="8" fill="var(--text-faint)">
        {sublabel}
      </text>
    </svg>
  );
}

function EditableList({ title, items, onSave, icon }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items.join("\n"));

  function handleSave() {
    onSave(
      draft
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    );
    setEditing(false);
  }

  return (
    <div className="section-card report-list-card">
      <div className="report-list-head">
        <h4>{title}</h4>
        <span className="cancel-link" onClick={() => (editing ? handleSave() : (setDraft(items.join("\n")), setEditing(true)))}>
          {editing ? "Guardar" : "Editar"}
        </span>
      </div>
      {editing ? (
        <textarea className="report-list-edit" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
      ) : (
        <div className="report-list">
          {items.length === 0 && <span className="registry-empty">Sin elementos todavía.</span>}
          {items.map((item, i) => (
            <div key={i} className="report-list-item">
              {icon}
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatusReport({ statusReport }) {
  const {
    filteredPortfolio,
    sponsorFilter,
    setSponsorFilter,
    departmentFilter,
    setDepartmentFilter,
    riskFilter,
    setRiskFilter,
    sponsors,
    departments,
    selectedProjectId,
    setSelectedProjectId,
    report,
    updateOverallStatus,
    updateCategory,
    updateAchievements,
    updateNextSteps,
    updateBudgetSpent,
    goToRiesgos,
  } = statusReport;

  const [view, setView] = useState("portfolio");

  const overallDef = PROJECT_STATUS_STYLES[report.overallStatus];
  const currentTaskDef = report.currentTask ? ROADMAP_STEP_STATUS_DEFS[report.currentTask.status] : null;

  if (view === "informe") {
    return (
      <div className="status-report-print-area">
        <div className="status-report-toolbar">
          <span className="ficha-back" onClick={() => setView("portfolio")}>
            ← Volver al portafolio
          </span>
          <button className="report-export-btn" onClick={() => window.print()}>
            <DownloadIcon size={14} color="currentColor" />
            Exportar PDF
          </button>
        </div>
        <h1 className="page-title">{report.projectName}</h1>

        <div className="report-top-grid">
          <div className="section-card report-score-card">
            <CircularStat value={report.progress} sublabel="avance" color={overallDef.dot} />
            <div className="report-score-meta">
              <span
                className="report-overall-badge"
                style={{ background: overallDef.bg, color: overallDef.color, cursor: "pointer", width: "fit-content" }}
                onClick={() => updateOverallStatus(nextInCycle(CATEGORY_CYCLE, report.overallStatus))}
                title="Haz clic para cambiar el estado general"
              >
                {overallDef.label}
              </span>
              <span className="report-score-period">Periodo: {report.period}</span>
              <span className="report-score-period">Preparado por {report.preparedBy}</span>
              {report.createdAt && (
                <span className="report-score-period">
                  Creado por {report.createdBy || "—"} · {formatFecha(report.createdAt)}
                </span>
              )}
            </div>
          </div>

          <div className="section-card report-glance-card">
            <h4>De un vistazo</h4>
            <div className="report-glance-grid">
              <div className="report-glance-item">
                <span className="report-glance-value">{report.currentPhaseLabel || "—"}</span>
                <span className="report-glance-label">Fase actual</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{report.risks}</span>
                <span className="report-glance-label">riesgos abiertos</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{report.daysLeft}</span>
                <span className="report-glance-label">días restantes</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{report.budgetPct}%</span>
                <span className="report-glance-label">presupuesto usado</span>
              </div>
            </div>
            {report.currentTask && (
              <div className="report-glance-task">
                <span className="status-dot" style={{ background: currentTaskDef?.dot, marginRight: 6 }} />
                Tarea en curso: {report.currentTask.title} · {currentTaskDef?.label}
              </div>
            )}
          </div>
        </div>

        <h3 className="section-heading">Categorías del informe</h3>
        <div className="report-categories">
          {report.categories.map((cat, i) => {
            const def = PROJECT_STATUS_STYLES[cat.status];
            return (
              <div key={cat.label} className="report-category" style={{ borderTop: `3px solid ${def?.dot}` }}>
                <div className="report-category-head">
                  <span
                    className="status-dot"
                    style={{ background: def?.dot, cursor: "pointer" }}
                    onClick={() => updateCategory(i, { status: nextInCycle(CATEGORY_CYCLE, cat.status) })}
                    title="Haz clic para cambiar el estado"
                  />
                  <span>{cat.label}</span>
                </div>
                <input
                  className="report-category-note-input"
                  type="text"
                  placeholder="Nota..."
                  value={cat.note}
                  onChange={(e) => updateCategory(i, { note: e.target.value })}
                />
              </div>
            );
          })}
        </div>

        <div className="report-columns-cards">
          <EditableList
            title="Logros de este periodo"
            items={report.achievements}
            onSave={updateAchievements}
            icon={<CheckIcon size={14} color="var(--status-ontrack-dot)" style={{ flexShrink: 0, marginTop: 2 }} />}
          />
          <EditableList
            title="Próximos pasos"
            items={report.nextSteps}
            onSave={updateNextSteps}
            icon={<ArrowRightIcon size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />}
          />
        </div>

        <div className="report-risks-link" onClick={goToRiesgos}>
          <WarningIcon size={15} color="currentColor" />
          Ver el registro de riesgos de este proyecto
        </div>

        <div className="section-card">
          <h4>Presupuesto</h4>
          <div className="budget-row">
            <div className="budget-track">
              <div className="budget-fill" style={{ width: `${Math.min(report.budgetPct, 100)}%` }} />
            </div>
            <span className="budget-label">
              <input
                className="budget-input"
                type="number"
                min="0"
                value={report.budgetSpent}
                onChange={(e) => updateBudgetSpent(e.target.value)}
              />
              € de {report.budgetTotal.toLocaleString("es-ES")} € ({report.budgetPct}%)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Status Report</h1>

      <h3 className="section-heading">Portafolio · vista general</h3>

      <div className="portfolio-filters">
        <select value={sponsorFilter} onChange={(e) => setSponsorFilter(e.target.value)}>
          <option value="todos">Todos los sponsors</option>
          {sponsors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="todos">Todos los departamentos</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="todos">Cualquier nivel de riesgo</option>
          <option value="bajo">Riesgo bajo</option>
          <option value="medio">Riesgo medio</option>
          <option value="alto">Riesgo alto</option>
        </select>
      </div>

      <div className="portfolio-table">
        <div className="portfolio-row portfolio-row--head">
          <span>PROYECTO</span>
          <span>FASE</span>
          <span>AVANCE</span>
          <span>RIESGOS</span>
          <span>PRESUPUESTO</span>
          <span>ESTADO</span>
        </div>
        {filteredPortfolio.map((proj) => (
          <div
            key={proj.id}
            className={`portfolio-row portfolio-row--clickable ${proj.id === selectedProjectId ? "portfolio-row--active" : ""}`}
            onClick={() => {
              setSelectedProjectId(proj.id);
              setView("informe");
            }}
          >
            <span className="portfolio-name">{proj.name}</span>
            <span className="portfolio-cell">{proj.phase}</span>
            <span className="portfolio-cell">{proj.progress}%</span>
            <span className="portfolio-cell">
              {proj.risks} · {riskLevel(proj.risks)}
            </span>
            <span className="portfolio-cell">
              {(proj.budgetSpent || 0).toLocaleString("es-ES")} € / {(proj.budgetTotal || 0).toLocaleString("es-ES")} €
            </span>
            <StatusBadge status={proj.status} style={{ width: "fit-content" }} />
          </div>
        ))}
        {filteredPortfolio.length === 0 && (
          <div className="portfolio-row">
            <span className="portfolio-cell">No hay proyectos que coincidan con estos filtros.</span>
          </div>
        )}
      </div>
    </div>
  );
}
