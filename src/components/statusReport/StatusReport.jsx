import { useState } from "react";
import { CheckIcon, ArrowRightIcon, WarningIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import { PROJECT_STATUS_STYLES, ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";
import "./StatusReport.css";

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

function EditableList({ title, items, onSave }) {
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
    <div>
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
              {title.includes("Logros") ? (
                <CheckIcon size={14} color="var(--status-ontrack-dot)" style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <ArrowRightIcon size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              )}
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

  const overallDef = PROJECT_STATUS_STYLES[report.overallStatus];
  const currentTaskDef = report.currentTask ? ROADMAP_STEP_STATUS_DEFS[report.currentTask.status] : null;

  return (
    <div>
      <h1 className="page-title">Status Report</h1>
      <p className="page-subtitle">Vista PMO del portafolio, y el informe de estado detallado del proyecto activo.</p>

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
            onClick={() => setSelectedProjectId(proj.id)}
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

      <h3 className="section-heading">Informe de estado · {report.projectName}</h3>
      <div className="report-header">
        <div className="report-header-top">
          <div>
            <h2>{report.projectName}</h2>
            <span>
              Periodo del informe: {report.period} · Preparado por {report.preparedBy}
            </span>
          </div>
          <span
            className="report-overall-badge"
            style={{ background: overallDef.bg, color: overallDef.color, cursor: "pointer" }}
            onClick={() => updateOverallStatus(nextInCycle(CATEGORY_CYCLE, report.overallStatus))}
            title="Haz clic para cambiar el estado general"
          >
            {overallDef.label}
          </span>
        </div>
      </div>

      <div className="report-body">
        <h4>Datos automáticos</h4>
        <div className="report-auto-row">
          <div className="report-auto-item">
            <span className="report-auto-label">Fase actual</span>
            <span className="report-auto-value">{report.currentPhaseLabel || "—"}</span>
          </div>
          <div className="report-auto-item">
            <span className="report-auto-label">Tarea en curso de esta fase</span>
            {report.currentTask ? (
              <span className="report-auto-value">
                <span className="status-dot" style={{ background: currentTaskDef?.dot, marginRight: 6 }} />
                {report.currentTask.title} · {currentTaskDef?.label}
              </span>
            ) : (
              <span className="report-auto-value">—</span>
            )}
          </div>
        </div>

        <h4>Categorías del informe</h4>
        <div className="report-categories">
          {report.categories.map((cat, i) => {
            const def = PROJECT_STATUS_STYLES[cat.status];
            return (
              <div key={cat.label} className="report-category">
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

        <div className="report-columns">
          <EditableList title="Logros de este periodo" items={report.achievements} onSave={updateAchievements} />
          <EditableList title="Próximos pasos" items={report.nextSteps} onSave={updateNextSteps} />
        </div>

        <div className="report-risks-link" onClick={goToRiesgos}>
          <WarningIcon size={15} color="currentColor" />
          Ver el registro de riesgos de este proyecto
        </div>

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
