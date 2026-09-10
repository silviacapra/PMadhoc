import Roadmap from "../roadmap/Roadmap";
import Registro from "./Registro";
import Lecciones from "./Lecciones";
import Documentacion from "./Documentacion";
import { METHODOLOGY_LABELS } from "../../data/projects";
import "./FichaProyecto.css";

const TABS = [
  { id: "roadmap", label: "Roadmap" },
  { id: "riesgos", label: "Riesgos" },
  { id: "problemas", label: "Problemas" },
  { id: "lecciones", label: "Lecciones aprendidas" },
  { id: "documentacion", label: "Documentación" },
];

export default function FichaProyecto({ ficha }) {
  const { projects, projectId, setProjectId, closeFicha, tab, setTab, roadmap, riesgos, problemas, lecciones, documentacion } = ficha;

  if (!projectId) {
    return (
      <div>
        <h1 className="page-title">Roadmap Proyecto</h1>
        <p className="page-subtitle">
          Elige un proyecto para ver su ficha completa: roadmap, riesgos, problemas, lecciones aprendidas y documentación.
        </p>
        <div className="ficha-picker-grid">
          {projects.map((p) => (
            <div key={p.id} className="ficha-picker-card" onClick={() => setProjectId(p.id)}>
              <h4>{p.name}</h4>
              <span>
                Fase: {p.phase} · {METHODOLOGY_LABELS[p.methodology]}
              </span>
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
      <p className="page-subtitle">
        {project ? `${project.phase} · ${METHODOLOGY_LABELS[project.methodology]}` : ""}
      </p>

      <div className="ficha-tabs">
        {TABS.map((t) => (
          <span key={t.id} className={`ficha-tab ${tab === t.id ? "ficha-tab--active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </span>
        ))}
      </div>

      {tab === "roadmap" && <Roadmap roadmap={roadmap} />}
      {tab === "riesgos" && (
        <Registro
          title="Registro de riesgos"
          subtitle="Riesgos identificados para este proyecto, siempre visibles independientemente de la fase."
          registry={riesgos}
        />
      )}
      {tab === "problemas" && (
        <Registro
          title="Registro de problemas"
          subtitle="Problemas ya materializados que hay que resolver."
          registry={problemas}
        />
      )}
      {tab === "lecciones" && <Lecciones lecciones={lecciones} />}
      {tab === "documentacion" && <Documentacion documentacion={documentacion} />}
    </div>
  );
}
