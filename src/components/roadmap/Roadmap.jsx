import RoadmapStep from "./RoadmapStep";
import { LockIcon } from "../icons/Icons";
import "./Roadmap.css";

export default function Roadmap({ roadmap, onGoToKnowledge, onGoToTemplates, onGoToRiesgos }) {
  const {
    phases,
    steps,
    selectedPhase,
    isCurrentPhase,
    isLastPhase,
    selectPhase,
    toggleStep,
    updateTaskMeta,
    updateStepOutput,
    teamMembers,
    gateItems,
    gateChecked,
    toggleGateItem,
    canAdvance,
    advancePhase,
  } = roadmap;
  const selectedPhaseData = phases.find((p) => p.id === selectedPhase);

  return (
    <div>
      <div className="phase-timeline">
        {phases.map((phase, i) => {
          const healthColor =
            phase.health === "red"
              ? "var(--status-critical-dot)"
              : phase.health === "yellow"
              ? "var(--status-atrisk-dot)"
              : "var(--accent)";
          return (
          <div key={phase.id} className="phase-timeline-item">
            <div
              className={`phase-dot-wrap ${phase.locked ? "phase-dot-wrap--locked" : ""}`}
              onClick={() => !phase.locked && selectPhase(phase.id)}
              title={phase.locked ? "Completa las fases anteriores para desbloquear esta" : undefined}
            >
              <div
                className="phase-dot"
                style={{
                  background: phase.isSelected ? healthColor : "var(--white)",
                  color: phase.isSelected ? "#FFFFFF" : phase.isPastOrCurrent ? healthColor : "#B7B7B7",
                  borderColor: phase.isSelected ? healthColor : phase.isPastOrCurrent ? healthColor : "#DADADA",
                }}
              >
                {phase.locked ? <LockIcon size={13} color="#B7B7B7" /> : phase.index}
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
          );
        })}
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
            <RoadmapStep
              key={step.key}
              step={step}
              teamMembers={teamMembers}
              onToggle={toggleStep}
              onUpdate={updateTaskMeta}
              onUpdateOutput={updateStepOutput}
              onGoToKnowledge={onGoToKnowledge}
              onGoToTemplates={onGoToTemplates}
              onGoToRiesgos={onGoToRiesgos}
            />
          ))}
        </div>
      </div>

      {isCurrentPhase && !isLastPhase && (
        <div className="section-card gate-card">
          <h3 className="section-heading">Punto de control · requisitos para confirmar el cierre de la fase</h3>
          <p className="gate-subtitle">Marca cada requisito para confirmar que esta fase está completada.</p>
          <div className="gate-checklist">
            {gateItems.map((item, i) => (
              <label key={item} className="gate-checklist-item">
                <input type="checkbox" checked={!!gateChecked[i]} onChange={() => toggleGateItem(i)} />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <button className="gate-advance-btn" disabled={!canAdvance} onClick={advancePhase}>
            Confirmar finalización de fase
          </button>
        </div>
      )}
    </div>
  );
}
