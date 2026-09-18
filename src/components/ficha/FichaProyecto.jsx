import Roadmap from "../roadmap/Roadmap";
import Documentacion from "./Documentacion";
import GanttChart from "../roadmap/GanttChart";
import { WarningIcon, LightbulbIcon, TriDotIcon } from "../icons/Icons";
import { METHODOLOGY_LABELS, METHODOLOGY_TINT } from "../../data/projects";
import "./FichaProyecto.css";

const TABS = [
  { id: "roadmap", label: "Fases del proyecto" },
  { id: "gantt", label: "Roadmap" },
  { id: "documentacion", label: "Documentación" },
];

export default function FichaProyecto({ ficha }) {
  const { projects, projectId, setProjectId, closeFicha, tab, setTab, roadmap, documentacion, gantt, openRiesgos, openLecciones } = ficha;

  if (!projectId) {
    return (
      <div>
        <h1 className="page-title">Roadmap Proyectos</h1>
        <div className="ficha-picker-grid">
          {projects.map((p) => (
            <div key={p.id} className="ficha-picker-card" onClick={() => setProjectId(p.id)}>
              <div className="ficha-picker-preview" style={{ background: METHODOLOGY_TINT[p.methodology] || METHODOLOGY_TINT.hibrida }}>
                <TriDotIcon size={40} color="rgba(255,255,255,0.55)" />
              </div>
              <div className="ficha-picker-body">
                <h4>{p.name}</h4>
                <div className="ficha-picker-tags">
                  <span className="ficha-picker-tag">{p.phase}</span>
                  <span className="ficha-picker-tag">{METHODOLOGY_LABELS[p.methodology]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          <WarningIcon size={13} color="currentColor" style={{ marginRight: 5, verticalAlign: -2 }} />
          Registro de riesgos
        </span>
        <span className="ficha-tab" onClick={() => openLecciones(projectId)}>
          <LightbulbIcon size={13} color="currentColor" style={{ marginRight: 5, verticalAlign: -2 }} />
          Lecciones aprendidas
        </span>
      </div>

      {tab === "roadmap" && <Roadmap roadmap={roadmap} />}
      {tab === "gantt" && <GanttChart phases={gantt.phases} />}
      {tab === "documentacion" && <Documentacion documentacion={documentacion} />}
    </div>
  );
}
