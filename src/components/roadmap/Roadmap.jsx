import RoadmapStep from "./RoadmapStep";
import "./Roadmap.css";

export default function Roadmap({ roadmap }) {
  const { phases, steps, selectedPhase, isCurrentPhase, selectPhase, toggleStep, updateTaskMeta, teamMembers } = roadmap;
  const selectedPhaseData = phases.find((p) => p.id === selectedPhase);

  return (
    <div>
      <h1 className="page-title">Roadmap Proyecto</h1>
      <p className="page-subtitle">Las 5 fases del proyecto según las mejores prácticas del PMI. Haz clic en una fase para ver sus pasos.</p>

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
    </div>
  );
}
