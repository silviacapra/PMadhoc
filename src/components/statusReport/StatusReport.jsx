import { useState } from "react";
import { CheckIcon, ArrowRightIcon, WarningIcon, DownloadIcon, PencilIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import { PROJECT_STATUS_STYLES, ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";
import "../registro/Registro.css";
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
          {editing ? (
            "Guardar"
          ) : (
            <>
              <PencilIcon size={11} color="currentColor" style={{ marginRight: 4, verticalAlign: -1 }} />
              Editar
            </>
          )}
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

function InlinePencilField({ label, value, onSave, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEdit() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    if (draft.trim() !== value) onSave(draft.trim());
    setEditing(false);
  }

  return (
    <div className="report-info-field">
      <span className="report-info-label">{label}</span>
      {editing ? (
        <div className="report-info-edit">
          <input
            autoFocus
            type="text"
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            onBlur={save}
          />
        </div>
      ) : (
        <span className="report-info-value" onClick={startEdit}>
          {value || placeholder || "—"}
          <PencilIcon size={11} color="currentColor" />
        </span>
      )}
    </div>
  );
}

function LastMonthGantt({ steps }) {
  if (steps.length === 0) {
    return <p className="registry-empty">No hay work packages con fechas en el último mes.</p>;
  }

  const dates = steps.flatMap((s) => [s.startDate, s.endDate].filter(Boolean)).map((d) => new Date(`${d}T00:00:00`).getTime());
  const minTime = Math.min(...dates);
  const maxTime = Math.max(...dates);
  const range = Math.max(maxTime - minTime, 1);

  return (
    <div className="mini-gantt">
      {steps.map((s) => {
        const def = ROADMAP_STEP_STATUS_DEFS[s.status] || ROADMAP_STEP_STATUS_DEFS.notStarted;
        const start = new Date(`${s.startDate || s.endDate}T00:00:00`).getTime();
        const end = new Date(`${s.endDate || s.startDate}T00:00:00`).getTime();
        const left = ((start - minTime) / range) * 100;
        const width = Math.max(((end - start) / range) * 100, 2);
        return (
          <div key={s.key} className="mini-gantt-row">
            <span className="mini-gantt-label" title={s.title}>
              {s.title}
            </span>
            <div className="mini-gantt-track">
              <div
                className="mini-gantt-bar"
                style={{ left: `${left}%`, width: `${width}%`, background: def.dot }}
                title={`${def.label} · ${s.startDate || "—"} → ${s.endDate || "—"}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StatusReport({ statusReport }) {
  const {
    portfolio,
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
    updateAchievements,
    updateNextSteps,
    updateBudgetSpent,
    updateComments,
    updatePeriod,
    updatePreparedBy,
    updateProjectField,
  } = statusReport;

  const [view, setView] = useState("portfolio");
  const [globalSelectedIds, setGlobalSelectedIds] = useState([]);

  function toggleGlobalSelected(id) {
    setGlobalSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const globalProjects = portfolio.filter((p) => globalSelectedIds.includes(p.id));

  const overallDef = PROJECT_STATUS_STYLES[report.overallStatus];
  const currentTaskDef = report.currentTask ? ROADMAP_STEP_STATUS_DEFS[report.currentTask.status] : null;

  if (view === "informe") {
    return (
      <div>
        <div className="status-report-toolbar">
          <span className="ficha-back" onClick={() => setView("portfolio")}>
            ← Volver al portafolio
          </span>
          <button className="report-export-btn" onClick={() => window.print()}>
            <DownloadIcon size={14} color="currentColor" />
            Exportar PDF
          </button>
        </div>
        <h1 className="page-title">Informe de estado del proyecto</h1>

        <div className="registro-project-picker">
          <label>Proyecto</label>
          <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            {portfolio.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="status-report-print-area status-report-a4">
        {/* Info básica del proyecto, arriba del todo */}
        <div className="section-card">
          <div className="report-info-grid">
            <InlinePencilField
              label="Gestor de proyecto"
              value={report.pm}
              placeholder="Sin asignar"
              onSave={(v) => updateProjectField("pm", v)}
            />
            <InlinePencilField
              label="Patrocinador"
              value={report.sponsor}
              placeholder="Sin asignar"
              onSave={(v) => updateProjectField("sponsor", v)}
            />
            <InlinePencilField
              label="Departamento"
              value={report.department}
              placeholder="Sin asignar"
              onSave={(v) => updateProjectField("department", v)}
            />
            <div className="report-info-field">
              <span className="report-info-label">Fecha límite</span>
              <input
                className="report-info-date"
                type="date"
                value={report.deadline}
                onChange={(e) => updateProjectField("deadline", e.target.value)}
              />
            </div>
            <InlinePencilField label="Periodo del informe" value={report.period} onSave={updatePeriod} />
            <InlinePencilField label="Preparado por" value={report.preparedBy} onSave={updatePreparedBy} />
          </div>
          {report.createdAt && (
            <span className="report-score-period">
              Creado por {report.createdBy || "—"} · {formatFecha(report.createdAt)}
            </span>
          )}
        </div>

        {/* Presupuesto, en la segunda línea del informe */}
        <h3 className="section-heading" style={{ marginTop: 22 }}>
          Presupuesto
        </h3>
        <div className="section-card" style={{ marginBottom: 26 }}>
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

        <div className="section-card report-glance-card report-glance-card--full" style={{ marginBottom: 26 }}>
          <h4>De un vistazo</h4>
          <div className="report-glance-cols">
            <div className="report-glance-col report-glance-col--score">
              <CircularStat value={report.progress} sublabel="avance" color={overallDef.dot} />
              <span
                className="report-overall-badge"
                style={{ background: overallDef.bg, color: overallDef.color, cursor: "pointer", width: "fit-content" }}
                onClick={() => updateOverallStatus(nextInCycle(CATEGORY_CYCLE, report.overallStatus))}
                title="Haz clic para cambiar el estado general"
              >
                {overallDef.label}
              </span>
            </div>
            <div className="report-glance-col">
              <div className="report-glance-item">
                <span className="report-glance-value">{report.currentPhaseLabel || "—"}</span>
                <span className="report-glance-label">Fase actual</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{report.risks}</span>
                <span className="report-glance-label">riesgos abiertos</span>
              </div>
            </div>
            <div className="report-glance-col">
              <div className="report-glance-item">
                <span className="report-glance-value">{report.daysLeft}</span>
                <span className="report-glance-label">días restantes</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{report.budgetPct}%</span>
                <span className="report-glance-label">presupuesto usado</span>
              </div>
            </div>
          </div>
          {report.currentTask && (
            <div className="report-glance-task">
              <span className="status-dot" style={{ background: currentTaskDef?.dot, marginRight: 6 }} />
              Tarea en curso: {report.currentTask.title} · {currentTaskDef?.label}
            </div>
          )}
        </div>

        {/* Cronograma del último mes, automático, igual que en Roadmap */}
        <h3 className="section-heading">Cronograma del último mes</h3>
        <div className="section-card" style={{ marginBottom: 26 }}>
          <LastMonthGantt steps={report.lastMonthSteps} />
        </div>

        {/* Riesgos del último mes, solo si hay */}
        {report.lastMonthRiesgos.length > 0 && (
          <>
            <h3 className="section-heading">Riesgos del último mes</h3>
            <div className="section-card" style={{ marginBottom: 26 }}>
              <div className="report-list">
                {report.lastMonthRiesgos.map((r) => (
                  <div key={r.id} className="report-list-item">
                    <WarningIcon size={14} color="var(--status-critical-color)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>
                      {r.nombre} · {r.estado} · {formatFecha(r.fecha)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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

        <h3 className="section-heading">Comentarios</h3>
        <div className="section-card">
          <textarea
            className="report-comments-textarea"
            rows={3}
            placeholder="Añade cualquier comentario adicional sobre este informe..."
            defaultValue={report.comments}
            onBlur={(e) => e.target.value !== report.comments && updateComments(e.target.value)}
          />
        </div>
        </div>
      </div>
    );
  }

  if (view === "global") {
    const totalProgress = globalProjects.length
      ? Math.round(globalProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / globalProjects.length)
      : 0;
    const totalRisks = globalProjects.reduce((sum, p) => sum + (p.risks || 0), 0);
    const totalBudgetSpent = globalProjects.reduce((sum, p) => sum + (p.budgetSpent || 0), 0);
    const totalBudgetTotal = globalProjects.reduce((sum, p) => sum + (p.budgetTotal || 0), 0);
    const budgetPct = totalBudgetTotal > 0 ? Math.round((totalBudgetSpent / totalBudgetTotal) * 100) : 0;
    const statusCounts = { onTrack: 0, atRisk: 0, critical: 0 };
    globalProjects.forEach((p) => {
      if (statusCounts[p.status] !== undefined) statusCounts[p.status] += 1;
    });

    return (
      <div>
        <div className="status-report-toolbar">
          <span className="ficha-back" onClick={() => setView("portfolio")}>
            ← Volver al portafolio
          </span>
          <button className="report-export-btn" onClick={() => window.print()}>
            <DownloadIcon size={14} color="currentColor" />
            Exportar PDF
          </button>
        </div>

        <h1 className="page-title">Informe global de programa</h1>
        <p className="page-subtitle">
          Resumen consolidado de {globalProjects.length} proyecto{globalProjects.length === 1 ? "" : "s"}: {globalProjects.map((p) => p.name).join(", ")}
        </p>

        <div className="status-report-print-area status-report-a4">
        <div className="report-top-grid">
          <div className="section-card report-score-card">
            <CircularStat value={totalProgress} sublabel="avance medio" color="var(--accent)" />
            <div className="report-score-meta">
              <span className="report-score-period">Periodo: Este mes</span>
              <span className="report-score-period">Preparado por {report.preparedBy || "—"}</span>
            </div>
          </div>

          <div className="section-card report-glance-card">
            <h4>De un vistazo</h4>
            <div className="report-glance-grid">
              <div className="report-glance-item">
                <span className="report-glance-value">{totalRisks}</span>
                <span className="report-glance-label">riesgos abiertos (total)</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{budgetPct}%</span>
                <span className="report-glance-label">presupuesto usado (total)</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{statusCounts.onTrack}</span>
                <span className="report-glance-label">proyectos en marcha</span>
              </div>
              <div className="report-glance-item">
                <span className="report-glance-value">{statusCounts.atRisk + statusCounts.critical}</span>
                <span className="report-glance-label">en riesgo o crítico</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="section-heading">Proyectos incluidos</h3>
        <div className="portfolio-table">
          <div className="portfolio-row portfolio-row--head portfolio-row--global">
            <span>PROYECTO</span>
            <span>FASE</span>
            <span>AVANCE</span>
            <span>RIESGOS</span>
            <span>PRESUPUESTO</span>
            <span>ESTADO</span>
          </div>
          {globalProjects.map((proj) => (
            <div key={proj.id} className="portfolio-row portfolio-row--global">
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
        </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Informe de estado del proyecto</h1>

      <div className="status-report-toolbar">
        <h3 className="section-heading" style={{ margin: 0 }}>
          Portafolio · vista general
        </h3>
        <button
          className="report-export-btn"
          disabled={globalSelectedIds.length === 0}
          onClick={() => setView("global")}
        >
          Crear informe global{globalSelectedIds.length > 0 ? ` (${globalSelectedIds.length})` : ""}
        </button>
      </div>

      <div className="portfolio-filters">
        <select value={sponsorFilter} onChange={(e) => setSponsorFilter(e.target.value)}>
          <option value="todos">Todos los patrocinadores</option>
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
          <span></span>
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
            <input
              type="checkbox"
              className="portfolio-row-checkbox"
              checked={globalSelectedIds.includes(proj.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleGlobalSelected(proj.id)}
            />
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
