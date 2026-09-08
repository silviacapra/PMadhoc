import RoadmapStep from "./RoadmapStep";
import "./Roadmap.css";

export default function Roadmap({ roadmap }) {
  const {
    phases,
    steps,
    selectedPhase,
    isCurrentPhase,
    isLastPhase,
    selectPhase,
    toggleStep,
    updateTaskMeta,
    teamMembers,
    gateItems,
    gateChecked,
    toggleGateItem,
    canAdvance,
    advancePhase,
    exceptions,
    exceptionForm,
    updateExceptionField,
    addException,
    lessonsForm,
    updateLessonsField,
    lessonsSubmitted,
    submitLessons,
  } = roadmap;
  const selectedPhaseData = phases.find((p) => p.id === selectedPhase);

  return (
    <div>
      <h1 className="page-title">Roadmap Proyecto</h1>
      <p className="page-subtitle">Las fases del proyecto según las mejores prácticas del PMI. Haz clic en una fase para ver sus pasos.</p>

      <div className="phase-timeline">
        {phases.map((phase, i) => (
          <div key={phase.id} className="phase-timeline-item">
            <div className="phase-dot-wrap" onClick={() => selectPhase(phase.id)}>
              <div
                className="phase-dot"
                style={{
                  background: phase.isSelected ? "var(--accent)" : "var(--white)",
                  color: phase.isSelected ? "#FFFFFF" : phase.isPastOrCurrent ? "var(--accent)" : "#B7B7B7",
                  borderColor: phase.isSelected ? "var(--accent)" : phase.isPastOrCurrent ? "var(--accent)" : "#DADADA",
                }}
              >
                {phase.index}
              </div>
              <span
                className="phase-label"
                style={{ color: phase.isSelected ? "var(--blue-primary)" : phase.isPastOrCurrent ? "#333333" : "#A0A0A0" }}
              >
                {phase.name}
              </span>
            </div>
            {phase.showLine && <div className="phase-line" style={{ background: phase.isLineFilled ? "var(--accent)" : "#E0E0E0" }} />}
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="roadmap-phase-header">
          <span
            className="phase-badge"
            style={{
              background: isCurrentPhase ? "var(--blue-primary)" : "#E8F6EF",
              color: isCurrentPhase ? "#FFFFFF" : "var(--accent)",
            }}
          >
            {isCurrentPhase ? "FASE ACTUAL" : "EN REVISIÓN"}
          </span>
          <h3>{selectedPhaseData?.name}</h3>
        </div>
        <div className="roadmap-steps">
          {steps.map((step) => (
            <RoadmapStep key={step.key} step={step} teamMembers={teamMembers} onToggle={toggleStep} onUpdate={updateTaskMeta} />
          ))}
        </div>
      </div>

      {isCurrentPhase && !isLastPhase && (
        <div className="section-card gate-card">
          <h3 className="section-heading">Gate review · requisitos para avanzar de fase</h3>
          <p className="gate-subtitle">Marca cada requisito antes de poder avanzar a la siguiente fase del roadmap.</p>
          <div className="gate-checklist">
            {gateItems.map((item, i) => (
              <label key={item} className="gate-checklist-item">
                <input type="checkbox" checked={!!gateChecked[i]} onChange={() => toggleGateItem(i)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <button className="gate-advance-btn" disabled={!canAdvance} onClick={advancePhase}>
            Avanzar a la siguiente fase
          </button>
        </div>
      )}

      <div className="section-card exceptions-card">
        <h3 className="section-heading">Registro de excepciones</h3>
        <p className="gate-subtitle">Si el equipo se salta el proceso estándar, anota aquí el motivo y quién lo autorizó.</p>
        <div className="exceptions-list">
          {exceptions.map((exc) => (
            <div key={exc.id} className="exception-row">
              <span className="exception-phase">{exc.phase}</span>
              <div>
                <p className="exception-motivo">{exc.motivo}</p>
                <span className="exception-meta">
                  Autorizado por {exc.autorizadoPor} · {exc.fecha}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="exception-form">
          <div className="exception-form-row">
            <input
              type="text"
              placeholder="Motivo de la excepción"
              value={exceptionForm.motivo}
              onChange={(e) => updateExceptionField("motivo", e.target.value)}
            />
            <input
              type="text"
              placeholder="Autorizado por"
              value={exceptionForm.autorizadoPor}
              onChange={(e) => updateExceptionField("autorizadoPor", e.target.value)}
            />
          </div>
          <button className="exception-add-btn" onClick={addException}>
            Registrar excepción
          </button>
        </div>
      </div>

      {selectedPhase === "cerrar" && (
        <div className="section-card lessons-card">
          <h3 className="section-heading">Lecciones aprendidas</h3>
          <p className="gate-subtitle">Obligatorio completarlo antes de cerrar formalmente el proyecto.</p>
          <div className="lessons-field">
            <label>¿Qué funcionó bien?</label>
            <textarea rows={2} value={lessonsForm.queFunciono} onChange={(e) => updateLessonsField("queFunciono", e.target.value)} disabled={lessonsSubmitted} />
          </div>
          <div className="lessons-field">
            <label>¿Qué no funcionó?</label>
            <textarea rows={2} value={lessonsForm.queNoFunciono} onChange={(e) => updateLessonsField("queNoFunciono", e.target.value)} disabled={lessonsSubmitted} />
          </div>
          <div className="lessons-field">
            <label>Recomendaciones para futuros proyectos</label>
            <textarea rows={2} value={lessonsForm.recomendaciones} onChange={(e) => updateLessonsField("recomendaciones", e.target.value)} disabled={lessonsSubmitted} />
          </div>
          {lessonsSubmitted ? (
            <p className="lessons-confirmed">Proyecto cerrado formalmente. Lecciones aprendidas registradas.</p>
          ) : (
            <button
              className="gate-advance-btn"
              disabled={!lessonsForm.queFunciono.trim() || !lessonsForm.queNoFunciono.trim() || !lessonsForm.recomendaciones.trim()}
              onClick={submitLessons}
            >
              Cerrar proyecto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
