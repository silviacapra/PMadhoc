import { CheckIcon, ChevronDownIcon, ExternalLinkIcon } from "../icons/Icons";
import { ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";

export default function RoadmapStep({ step, teamMembers, onToggle, onUpdate }) {
  const activeDef = step.status ? ROADMAP_STEP_STATUS_DEFS[step.status] : null;
  const dotBorder = step.isDone ? "var(--status-done-dot)" : activeDef ? activeDef.dot : "#DADADA";
  const dotFill = step.isDone ? "var(--status-done-dot)" : activeDef ? activeDef.dot : "var(--white)";

  return (
    <div className="roadmap-step">
      <div className="roadmap-step-row" onClick={() => onToggle(step.key)}>
        <div className="roadmap-step-dot" style={{ borderColor: dotBorder, background: dotFill }}>
          {step.isDone && <CheckIcon size={12} color="#FFFFFF" />}
        </div>
        <div className="roadmap-step-body">
          <span
            className="roadmap-step-title"
            style={{
              color: step.isDone ? "#A0A0A0" : "var(--gray-dark)",
              textDecoration: step.isDone ? "line-through" : "none",
            }}
          >
            {step.title}
          </span>
          <span className="roadmap-step-detail">{step.detail}</span>
          {step.hasMeta && <span className="roadmap-step-meta">{step.metaSummary}</span>}
        </div>
        {step.hasStatus && (
          <span className="roadmap-step-status-pill" style={{ background: activeDef.bg, color: activeDef.color }}>
            {activeDef.label.toUpperCase()}
          </span>
        )}
        <ChevronDownIcon
          size={16}
          color="#B7B7B7"
          style={{ flexShrink: 0, marginTop: 2, transform: step.expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
        />
      </div>

      {step.expanded && (
        <div className="roadmap-step-editor">
          <div>
            <label>Estado</label>
            <div className="status-options">
              {Object.entries(ROADMAP_STEP_STATUS_DEFS).map(([id, def]) => {
                const active = step.status === id;
                return (
                  <span
                    key={id}
                    className="status-option"
                    style={{
                      background: active ? def.bg : "#FFFFFF",
                      color: active ? def.color : "#8a8a8a",
                      borderColor: active ? def.dot : "var(--border-light)",
                    }}
                    onClick={() => onUpdate(step.key, { status: id })}
                  >
                    <span className="status-option-dot" style={{ background: def.dot }} />
                    {def.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <label>Responsable</label>
            <select value={step.assignee} onChange={(e) => onUpdate(step.key, { assignee: e.target.value })}>
              <option value="">Sin asignar</option>
              {teamMembers.map((tm) => (
                <option key={tm.id} value={tm.name}>
                  {tm.name} · {tm.roleLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="roadmap-step-dates">
            <div>
              <label>Fecha inicio</label>
              <input type="date" value={step.startDate} onChange={(e) => onUpdate(step.key, { startDate: e.target.value })} />
            </div>
            <div>
              <label>Fecha fin (deadline)</label>
              <input type="date" value={step.endDate} onChange={(e) => onUpdate(step.key, { endDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Enlace al artefacto</label>
            <input
              type="text"
              value={step.link}
              onChange={(e) => onUpdate(step.key, { link: e.target.value })}
              placeholder="https://..."
            />
            {step.hasLink && (
              <a href={step.link} target="_blank" rel="noreferrer" className="roadmap-step-link">
                Abrir documento
                <ExternalLinkIcon size={11} color="currentColor" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
