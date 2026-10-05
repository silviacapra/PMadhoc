import { useState } from "react";
import RoadmapStep from "./RoadmapStep";
import { CheckIcon } from "../icons/Icons";
import Confetti from "../shared/Confetti";
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
    advancePhase,
  } = roadmap;
  const selectedPhaseData = phases.find((p) => p.id === selectedPhase);
  const [confettiFire, setConfettiFire] = useState(0);

  function handleAdvance() {
    advancePhase();
    setConfettiFire((n) => n + 1);
  }

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
            <div className="phase-dot-wrap" onClick={() => selectPhase(phase.id)}>
              <div
                className="phase-dot"
                style={
                  phase.completed
                    ? { background: "var(--accent)", borderColor: "var(--accent)" }
                    : {
                        background: phase.isSelected ? healthColor : "var(--white)",
                        color: phase.isSelected ? "#FFFFFF" : phase.isPastOrCurrent ? healthColor : "#B7B7B7",
                        borderColor: phase.isSelected ? healthColor : phase.isPastOrCurrent ? healthColor : "#DADADA",
                      }
                }
              >
                {phase.completed ? <CheckIcon size={16} color="#FFFFFF" /> : phase.index}
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
          <button className="gate-advance-btn" onClick={handleAdvance}>
            Confirmar finalización de fase
          </button>
        </div>
      )}
      <Confetti fire={confettiFire} />
    </div>
  );
}
