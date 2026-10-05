import Roadmap from "../roadmap/Roadmap";
import Documentacion from "./Documentacion";
import GanttChart from "../roadmap/GanttChart";
import { TriDotIcon } from "../icons/Icons";
import { METHODOLOGY_LABELS, METHODOLOGY_TINT } from "../../data/projects";
import { PHASE_ORDER, ROADMAP_CONTENT } from "../../data/roadmapContent";
import "../registro/Registro.css";
import "./FichaProyecto.css";

const TABS = [
  { id: "roadmap", label: "Fases del proyecto" },
  { id: "gantt", label: "Hoja de ruta" },
  { id: "documentacion", label: "Documentación" },
];

const PHASE_GROUP_LABELS = {
  preproyecto: "Pre-proyecto",
  iniciar: "Iniciados",
  planificar: "Planificados",
  ejecutar: "Ejecutados",
  controlar: "Controlados",
  cerrar: "Cerrados",
};

export default function FichaProyecto({ ficha, nav }) {
  const { projects, projectId, setProjectId, closeFicha, tab, setTab, roadmap, documentacion, gantt, openRiesgos, openLecciones } = ficha;

  if (!projectId) {
    const currentProject = [...projects].sort(
      (a, b) => new Date(b.lastModifiedAt || b.createdAt || 0) - new Date(a.lastModifiedAt || a.createdAt || 0)
    )[0];
    const phaseGroups = PHASE_ORDER.map((phaseId) => ({
      phaseId,
      label: ROADMAP_CONTENT[phaseId].label,
      projects: projects.filter((p) => p.phase === ROADMAP_CONTENT[phaseId].label),
    })).filter((g) => g.projects.length > 0);

    return (
      <div>
        <h1 className="page-title">Proyectos por fases</h1>
        {currentProject && (
          <div className="registro-project-picker">
            <label>Proyecto</label>
            <select value={currentProject.id} onChange={(e) => setProjectId(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {phaseGroups.map((group) => (
          <div key={group.phaseId} className="ficha-phase-group">
            <h3 className="ficha-phase-group-label">{PHASE_GROUP_LABELS[group.phaseId] || group.label}</h3>
            <div className="ficha-picker-grid">
              {group.projects.map((p) => (
                <div key={p.id} className="ficha-picker-card" onClick={() => setProjectId(p.id)}>
                  <div className="ficha-picker-preview" style={{ background: METHODOLOGY_TINT[p.methodology] || METHODOLOGY_TINT.hibrida }}>
                    <TriDotIcon size={40} color="rgba(255,255,255,0.55)" />
                  </div>
                  <div className="ficha-picker-body">
                    <h4>{p.name}</h4>
                    <div className="ficha-picker-tags">
                      <span className="ficha-picker-tag">{METHODOLOGY_LABELS[p.methodology]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const project = projects.find((p) => p.id === projectId);

  return (
    <div>
      <span className="ficha-back" onClick={closeFicha}>
        ← Todos los proyectos
      </span>
      <h1 className="page-title">{project?.name}</h1>

      <div className="ficha-tabs">
        {TABS.map((t) => (
          <span key={t.id} className={`ficha-tab ${tab === t.id ? "ficha-tab--active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </span>
        ))}
        <span className="ficha-tab" onClick={() => openRiesgos(projectId)}>
          Registro de riesgos
        </span>
        <span className="ficha-tab" onClick={() => openLecciones(projectId)}>
          Lecciones aprendidas
        </span>
      </div>

      {tab === "roadmap" && (
        <Roadmap
          roadmap={roadmap}
          onGoToKnowledge={() => nav?.setView("knowledge")}
          onGoToTemplates={() => nav?.setView("templates")}
          onGoToRiesgos={() => openRiesgos(projectId)}
        />
      )}
      {tab === "gantt" && <GanttChart phases={gantt.phases} />}
      {tab === "documentacion" && <Documentacion documentacion={documentacion} />}
    </div>
  );
}
