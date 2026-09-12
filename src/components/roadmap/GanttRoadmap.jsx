import { useMemo, useState } from "react";
import { ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";
import "./GanttRoadmap.css";

const MONTH_LABEL = { month: "short", year: "2-digit" };
const DAY_LABEL = { day: "numeric", month: "short", year: "numeric" };

function parseDate(d) {
  return d ? new Date(`${d}T00:00:00`) : null;
}

function formatDate(date) {
  return date ? date.toLocaleDateString("es-ES", DAY_LABEL) : "sin fecha";
}

function computeRange(phases) {
  const dates = [];
  phases.forEach((p) =>
    p.steps.forEach((s) => {
      if (s.startDate) dates.push(parseDate(s.startDate));
      if (s.endDate) dates.push(parseDate(s.endDate));
    })
  );
  if (dates.length === 0) return null;
  const minTime = Math.min(...dates.map((d) => d.getTime()));
  const maxTime = Math.max(...dates.map((d) => d.getTime()));
  const min = new Date(minTime);
  const max = new Date(maxTime);
  const start = new Date(min.getFullYear(), min.getMonth(), 1);
  const end = new Date(max.getFullYear(), max.getMonth() + 1, 0);
  return { start, end };
}

function buildMonthTicks(range) {
  const ticks = [];
  let cur = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
  while (cur <= range.end) {
    ticks.push(new Date(cur));
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return ticks;
}

function toPct(date, range) {
  const total = range.end.getTime() - range.start.getTime();
  if (total <= 0) return 0;
  return ((date.getTime() - range.start.getTime()) / total) * 100;
}

function GanttBar({ step, range }) {
  const def = ROADMAP_STEP_STATUS_DEFS[step.status] || ROADMAP_STEP_STATUS_DEFS.notStarted;
  const hasStart = !!step.startDate;
  const hasEnd = !!step.endDate;

  if (!hasStart && !hasEnd) {
    return <span className="gantt-no-dates">Sin fechas asignadas</span>;
  }

  const startDate = parseDate(step.startDate) || parseDate(step.endDate);
  const endDate = parseDate(step.endDate) || parseDate(step.startDate);
  const left = toPct(startDate, range);
  const width = Math.max(toPct(endDate, range) - left, 1.2);

  return (
    <div className="gantt-bar-wrap" style={{ left: `${left}%`, width: `${width}%` }}>
      <div className="gantt-bar" style={{ background: def.dot }} />
      <div className="gantt-tooltip">
        <strong>{step.title}</strong>
        <span>{def.label}</span>
        <span>
          {hasStart ? formatDate(startDate) : "—"} → {hasEnd ? formatDate(endDate) : "—"}
        </span>
      </div>
    </div>
  );
}

export default function GanttRoadmap({ ganttPage }) {
  const { projects, selectedProjectId, setSelectedProjectId, phases } = ganttPage;
  const project = projects.find((p) => p.id === selectedProjectId);
  const [legendOpen, setLegendOpen] = useState(true);

  const range = useMemo(() => computeRange(phases), [phases]);
  const monthTicks = useMemo(() => (range ? buildMonthTicks(range) : []), [range]);

  return (
    <div>
      <h1 className="page-title">Roadmap</h1>
      <p className="page-subtitle">
        Vista de calendario del roadmap: cuándo empieza y acaba cada paso de cada fase del proyecto elegido.
      </p>

      <div className="registro-project-picker">
        <label>Proyecto</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para ver su roadmap.</p>
      ) : !range ? (
        <div className="section-card">
          <p className="registry-empty">
            Todavía no hay fechas de inicio o fin en ningún paso de este proyecto. Añádelas en "Fases proyecto" (dentro de
            cada paso, al expandirlo) para ver aquí el diagrama.
          </p>
        </div>
      ) : (
        <div className="section-card gantt-card">
          <div className="gantt-legend" onClick={() => setLegendOpen((v) => !v)}>
            {legendOpen &&
              Object.entries(ROADMAP_STEP_STATUS_DEFS).map(([id, def]) => (
                <span key={id} className="gantt-legend-item">
                  <span className="gantt-legend-dot" style={{ background: def.dot }} />
                  {def.label}
                </span>
              ))}
          </div>

          <div className="gantt-chart">
            <div className="gantt-header-row">
              <div className="gantt-label-spacer" />
              <div className="gantt-timeline-header">
                {monthTicks.map((m) => (
                  <span key={m.toISOString()} className="gantt-month-label" style={{ left: `${toPct(m, range)}%` }}>
                    {m.toLocaleDateString("es-ES", MONTH_LABEL)}
                  </span>
                ))}
              </div>
            </div>

            <div className="gantt-body">
              {phases
                .filter((p) => p.steps.length > 0)
                .map((phase) => (
                  <div key={phase.phaseId} className="gantt-phase-group">
                    <div className="gantt-phase-label-row">
                      <span className="gantt-phase-label">{phase.phaseLabel}</span>
                    </div>
                    {phase.steps.map((step) => (
                      <div key={step.key} className="gantt-row">
                        <div className="gantt-row-label" title={step.title}>
                          {step.title}
                        </div>
                        <div className="gantt-row-track">
                          {monthTicks.map((m) => (
                            <span key={m.toISOString()} className="gantt-gridline" style={{ left: `${toPct(m, range)}%` }} />
                          ))}
                          <GanttBar step={step} range={range} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
