import { CheckIcon, ArrowRightIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import { PROJECT_STATUS_STYLES, IMPACT_STYLES } from "../../data/statusStyles";
import "./StatusReport.css";

function riskLevel(risks) {
  if (risks >= 4) return "alto";
  if (risks >= 2) return "medio";
  return "bajo";
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
  } = statusReport;

  const overallDef = PROJECT_STATUS_STYLES[report.overallStatus];

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
            <span className="portfolio-cell">{proj.budgetSpent.toLocaleString("es-ES")} € / {proj.budgetTotal.toLocaleString("es-ES")} €</span>
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
          <span className="report-overall-badge" style={{ background: overallDef.bg, color: overallDef.color }}>
            {overallDef.label}
          </span>
        </div>
      </div>

      <div className="report-body">
        <h4>Evolución en los últimos periodos</h4>
        <div className="report-evolution">
          {report.evolution.map((e, i) => {
            const def = PROJECT_STATUS_STYLES[e.status];
            return (
              <div key={e.period} className="report-evolution-item">
                <span className="report-evolution-dot" style={{ background: def.dot }} />
                <span className="report-evolution-label">{e.period}</span>
                {i < report.evolution.length - 1 && <span className="report-evolution-line" />}
              </div>
            );
          })}
        </div>

        <div className="report-categories">
          {report.categories.map((cat) => (
            <div key={cat.label} className="report-category">
              <div className="report-category-head">
                <span className={`status-dot status-dot--${cat.status}`} />
                <span>{cat.label}</span>
              </div>
              <span className="report-category-note">{cat.note}</span>
            </div>
          ))}
        </div>

        <div className="report-columns">
          <div>
            <h4>Logros de este periodo</h4>
            <div className="report-list">
              {report.achievements.map((a) => (
                <div key={a} className="report-list-item">
                  <CheckIcon size={14} color="var(--status-ontrack-dot)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4>Próximos pasos</h4>
            <div className="report-list">
              {report.nextSteps.map((n) => (
                <div key={n} className="report-list-item">
                  <ArrowRightIcon size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4>Riesgos y problemas</h4>
        <div className="risk-table">
          <div className="risk-row risk-row--head">
            <span>DESCRIPCIÓN</span>
            <span>IMPACTO</span>
            <span>PROPIETARIO</span>
            <span>ESTADO</span>
          </div>
          {report.risks.map((r) => (
            <div key={r.desc} className="risk-row">
              <span className="risk-desc">{r.desc}</span>
              <span className="risk-impact" style={{ color: IMPACT_STYLES[r.impact].color }}>
                {IMPACT_STYLES[r.impact].label}
              </span>
              <span className="risk-owner">{r.owner}</span>
              <span className="risk-status">{r.status}</span>
            </div>
          ))}
        </div>

        <h4>Presupuesto</h4>
        <div className="budget-row">
          <div className="budget-track">
            <div className="budget-fill" style={{ width: `${report.budgetPct}%` }} />
          </div>
          <span className="budget-label">
            {report.budgetSpent} de {report.budgetTotal} ({report.budgetPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
