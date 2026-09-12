import { useState } from "react";
import { CheckIcon, ChevronDownIcon, PencilIcon } from "../icons/Icons";
import { ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";

function OutputRow({ output, stepKey, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(output.link);

  function startEdit() {
    setDraft(output.link);
    setEditing(true);
  }

  function saveLink() {
    onUpdate(stepKey, output.index, { link: draft.trim() });
    setEditing(false);
  }

  return (
    <div className="output-row">
      <input
        type="checkbox"
        checked={output.done}
        onChange={(e) => onUpdate(stepKey, output.index, { done: e.target.checked })}
      />
      <span className="output-label">{output.label}</span>

      {editing ? (
        <div className="output-edit" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            autoFocus
            value={draft}
            placeholder="https://..."
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveLink()}
          />
          <button className="output-save-btn" onClick={saveLink}>
            Guardar
          </button>
        </div>
      ) : (
        <div className="output-actions" onClick={(e) => e.stopPropagation()}>
          {output.link ? (
            <a href={output.link} target="_blank" rel="noreferrer" className="output-upload-btn output-upload-btn--set">
              Ver documento
            </a>
          ) : (
            <button className="output-upload-btn output-upload-btn--empty" onClick={startEdit}>
              No disponible
            </button>
          )}
          <button className="output-edit-btn" onClick={startEdit} title="Editar enlace">
            <PencilIcon size={12} color="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function RoadmapStep({ step, teamMembers, onToggle, onUpdate, onUpdateOutput }) {
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
                    className={`status-option ${active ? "status-option--active" : ""}`}
                    style={{
                      background: active ? def.bg : "#FFFFFF",
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

          {step.outputs.length > 0 && (
            <div>
              <label>Entregables</label>
              <div className="output-list">
                {step.outputs.map((output) => (
                  <OutputRow key={output.index} output={output} stepKey={step.key} onUpdate={onUpdateOutput} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
