import { useState, useEffect } from "react";
import { CheckIcon, ChevronDownIcon, PencilIcon, ExternalLinkIcon } from "../icons/Icons";
import { ROADMAP_STEP_STATUS_DEFS } from "../../data/statusStyles";

function EditableField({ value, onSave, placeholder, rows }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function startEdit() {
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    if (draft !== value) onSave(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <textarea
        autoFocus
        rows={rows || 3}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
    );
  }

  const lines = (value || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="bullet-field-display" onClick={startEdit}>
      {lines.length > 0 ? (
        <ul className="bullet-field-list">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : (
        <span className="pencil-field-text pencil-field-text--empty">{placeholder}</span>
      )}
    </div>
  );
}

function PencilEditField({ value, onSave, placeholder, multiline }) {
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

  if (!editing) {
    return (
      <div className="pencil-field-display" onClick={startEdit}>
        <span className={value ? "pencil-field-text" : "pencil-field-text pencil-field-text--empty"}>{value || placeholder}</span>
        <button className="output-edit-btn" onClick={startEdit} title="Editar">
          <PencilIcon size={12} color="currentColor" />
        </button>
      </div>
    );
  }

  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="output-edit">
      <Tag
        autoFocus
        rows={multiline ? 2 : undefined}
        type={multiline ? undefined : "text"}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => !multiline && e.key === "Enter" && save()}
      />
      <button className="output-save-btn" onClick={save}>
        Guardar
      </button>
    </div>
  );
}

const TAB_LINK_MARKER = "(enlace a pestaña)";

function OutputRow({ output, stepKey, onUpdate, onGoToTemplates, onGoToStatusReport, onGoToLecciones }) {
  const [editingLink, setEditingLink] = useState(false);
  const [draftLink, setDraftLink] = useState(output.link);
  const [editingLabel, setEditingLabel] = useState(false);
  const [draftLabel, setDraftLabel] = useState(output.label);

  const isTabLink = output.label.includes(TAB_LINK_MARKER);
  const tabTarget = isTabLink ? (/lecciones aprendidas/i.test(output.label) ? onGoToLecciones : onGoToStatusReport) : null;

  function startEditLink() {
    setDraftLink(output.link);
    setEditingLink(true);
  }

  function saveLink() {
    onUpdate(stepKey, output.index, { link: draftLink.trim() });
    setEditingLink(false);
  }

  function startEditLabel() {
    setDraftLabel(output.label);
    setEditingLabel(true);
  }

  function saveLabel() {
    const trimmed = draftLabel.trim();
    if (trimmed && trimmed !== output.label) onUpdate(stepKey, output.index, { label: trimmed });
    setEditingLabel(false);
  }

  return (
    <div className="output-row">
      <input
        type="checkbox"
        checked={output.done}
        onChange={(e) => onUpdate(stepKey, output.index, { done: e.target.checked })}
      />

      {editingLabel ? (
        <input
          type="text"
          autoFocus
          className="output-label-input"
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value)}
          onBlur={saveLabel}
          onKeyDown={(e) => e.key === "Enter" && saveLabel()}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="output-label" onClick={(e) => { e.stopPropagation(); startEditLabel(); }}>
          {output.label}
        </span>
      )}
      <button className="output-edit-btn" onClick={(e) => { e.stopPropagation(); startEditLabel(); }} title="Editar nombre del entregable">
        <PencilIcon size={12} color="currentColor" />
      </button>

      {isTabLink ? (
        <div className="output-actions" onClick={(e) => e.stopPropagation()}>
          {tabTarget && (
            <button className="output-upload-btn output-upload-btn--set" onClick={tabTarget}>
              <ExternalLinkIcon size={12} color="currentColor" />
              Ir a la pestaña
            </button>
          )}
        </div>
      ) : editingLink ? (
        <div className="output-edit" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            autoFocus
            value={draftLink}
            placeholder="Pega aquí el enlace externo (Drive, Notion, Confluence...)"
            onChange={(e) => setDraftLink(e.target.value)}
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
              <ExternalLinkIcon size={12} color="currentColor" />
              Abrir
            </a>
          ) : (
            <button className="output-upload-btn output-upload-btn--empty" onClick={startEditLink}>
              Añadir enlace
            </button>
          )}
          <button className="output-edit-btn" onClick={startEditLink} title="Editar enlace">
            <PencilIcon size={12} color="currentColor" />
          </button>
          {onGoToTemplates && (
            <button
              className="output-upload-btn output-upload-btn--template"
              onClick={onGoToTemplates}
              title="¿Necesitas plantilla para este entregable?"
            >
              Plantillas
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapStep({
  step,
  teamMembers,
  onToggle,
  onUpdate,
  onUpdateOutput,
  onGoToKnowledge,
  onGoToTemplates,
  onGoToRiesgos,
  onGoToStatusReport,
  onGoToLecciones,
}) {
  const activeDef = step.status ? ROADMAP_STEP_STATUS_DEFS[step.status] : null;
  const dotBorder = step.isDone ? "var(--status-done-dot)" : activeDef ? activeDef.dot : "#DADADA";
  const dotFill = step.isDone ? "var(--status-done-dot)" : activeDef ? activeDef.dot : "var(--white)";
  const [showRiskPrompt, setShowRiskPrompt] = useState(false);

  function handleStatusClick(id) {
    onUpdate(step.key, { status: id });
    setShowRiskPrompt(id === "yellow" || id === "red");
  }

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
              color: step.isDone ? "#A0A0A0" : "#000000",
              textDecoration: step.isDone ? "line-through" : "none",
            }}
          >
            {step.title}
          </span>
          <span className="roadmap-step-detail">{step.detail}</span>
          {step.hasMeta && (
            <>
              {step.metaDateLine && <span className="roadmap-step-meta roadmap-step-meta--date">{step.metaDateLine}</span>}
              {step.metaEntregablesLine && (
                <span
                  className="roadmap-step-meta roadmap-step-meta--count"
                  style={{ color: step.entregablesDone ? "var(--accent)" : "var(--status-critical-color)" }}
                >
                  {step.metaEntregablesLine}
                </span>
              )}
            </>
          )}
        </div>
        {step.hasStatus && (
          <span className="roadmap-step-status-pill" style={{ background: activeDef.bg, color: activeDef.color }}>
            {activeDef.label.toUpperCase()}
          </span>
        )}
        <span className="roadmap-step-expand-btn" title={step.expanded ? "Contraer" : "Expandir"}>
          <ChevronDownIcon size={13} color="#FFFFFF" style={{ transform: step.expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
        </span>
      </div>

      {step.expanded && (
        <div className="roadmap-step-editor">
          {step.outputs.length > 0 && (
            <div className="editor-field editor-field--full">
              <label>Entregables recomendados</label>
              <div className="output-list">
                {step.outputs.map((output) => (
                  <OutputRow
                    key={output.index}
                    output={output}
                    stepKey={step.key}
                    onUpdate={onUpdateOutput}
                    onGoToTemplates={onGoToTemplates}
                    onGoToStatusReport={onGoToStatusReport}
                    onGoToLecciones={onGoToLecciones}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="editor-divider" />

          <div className="editor-field editor-field--full roadmap-step-id-title-row">
            <div className="roadmap-step-id-col">
              <label>ID</label>
              <div className="readonly-field">{step.workPackageId}</div>
            </div>
            <div className="roadmap-step-title-col">
              <label>Título de la tarea</label>
              <PencilEditField value={step.title} onSave={(v) => onUpdate(step.key, { title: v })} placeholder="Título" />
            </div>
          </div>
          {onGoToKnowledge && (
            <span className="roadmap-step-kb-link editor-field--full" onClick={onGoToKnowledge}>
              ¿Necesitas más información sobre este concepto? Consulta la base de conocimiento
            </span>
          )}

          <div className="editor-field editor-field--full">
            <label>Descripción</label>
            <PencilEditField
              value={step.detail}
              onSave={(v) => onUpdate(step.key, { detail: v })}
              placeholder="Descripción breve de esta tarea"
              multiline
            />
          </div>

          <div className="editor-divider" />

          <div className="editor-field editor-field--full">
            <label>Estado *</label>
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
                    onClick={() => handleStatusClick(id)}
                  >
                    <span className="status-option-dot" style={{ background: def.dot }} />
                    {def.label}
                  </span>
                );
              })}
            </div>
            {showRiskPrompt && onGoToRiesgos && (
              <div className="roadmap-step-risk-prompt">
                <span>¿Quieres actualizar el registro de riesgos?</span>
                <div className="roadmap-step-risk-prompt-actions">
                  <button className="roadmap-step-risk-prompt-btn" onClick={onGoToRiesgos}>
                    Sí, ir al registro
                  </button>
                  <span className="cancel-link" onClick={() => setShowRiskPrompt(false)}>
                    Ahora no
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="editor-field">
            <label>Responsable *</label>
            <select
              value={step.assignee}
              onChange={(e) => onUpdate(step.key, { assignee: e.target.value })}
              style={!step.assignee ? { borderColor: "var(--status-critical-color)" } : undefined}
            >
              <option value="">Sin asignar</option>
              {teamMembers.map((tm) => (
                <option key={tm.id} value={tm.name}>
                  {tm.name} · {tm.roleLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="editor-field roadmap-step-dates">
            <div>
              <label>Fecha inicio</label>
              <input type="date" value={step.startDate} onChange={(e) => onUpdate(step.key, { startDate: e.target.value })} />
            </div>
            <div>
              <label>Fecha fin (deadline) *</label>
              <input
                type="date"
                value={step.endDate}
                onChange={(e) => onUpdate(step.key, { endDate: e.target.value })}
                style={!step.endDate ? { borderColor: "var(--status-critical-color)" } : undefined}
              />
            </div>
          </div>

          <div className="editor-field">
            <label>Criterios de aceptación</label>
            <EditableField
              value={step.acceptanceCriteria}
              onSave={(v) => onUpdate(step.key, { acceptanceCriteria: v })}
              placeholder="Criterios que se usarán para aceptar esta tarea"
            />
          </div>

          <div className="editor-field">
            <label>Información técnica</label>
            <EditableField
              value={step.technicalInfo}
              onSave={(v) => onUpdate(step.key, { technicalInfo: v })}
              placeholder="Información técnica o referencia a documentación técnica"
            />
          </div>
        </div>
      )}
    </div>
  );
}
