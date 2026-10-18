import { useState } from "react";
import Roadmap from "../roadmap/Roadmap";
import Documentacion from "./Documentacion";
import GanttChart from "../roadmap/GanttChart";
import { TriDotIcon } from "../icons/Icons";
import { PROJECT_CARD_TINT } from "../../data/projects";
import "../registro/Registro.css";
import "./FichaProyecto.css";

const TABS = [
  { id: "roadmap", label: "Fases del proyecto" },
  { id: "gantt", label: "Hoja de ruta" },
  { id: "documentacion", label: "Documentación" },
];

const SIN_PORTFOLIO = "Sin portfolio asignado";

function formatFechaCorta(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function PortfolioAssignField({ project, portfolioCatalog, okrCatalog, onAssign, onCreatePortfolio }) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(project.portfolioId || "");
  const [newName, setNewName] = useState("");
  const [newOkrId, setNewOkrId] = useState("");

  const current = portfolioCatalog.find((pf) => pf.id === project.portfolioId);

  function startOpen() {
    setSelected(project.portfolioId || "");
    setCreating(false);
    setNewName("");
    setNewOkrId("");
    setOpen(true);
  }

  function handleSelectChange(value) {
    if (value === "__new__") {
      setCreating(true);
      return;
    }
    setSelected(value);
  }

  async function handleSave() {
    if (creating) {
      if (!newName.trim()) return;
      const id = await onCreatePortfolio({ name: newName.trim(), okrId: newOkrId });
      onAssign(id);
    } else {
      onAssign(selected);
    }
    setOpen(false);
  }

  if (!open) {
    return (
      <div className="ficha-info-field">
        <span className="ficha-info-label">Portfolio</span>
        <span className="ficha-info-value">
          {current ? current.name : SIN_PORTFOLIO}
          <button className="ficha-info-edit-link" onClick={startOpen}>
            {current ? "Cambiar" : "Asignar"}
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="ficha-info-field">
      <span className="ficha-info-label">Portfolio</span>
      {!creating ? (
        <div className="ficha-portfolio-edit-row">
          <select value={selected} onChange={(e) => handleSelectChange(e.target.value)}>
            <option value="">Sin portfolio asignado</option>
            {portfolioCatalog.map((pf) => (
              <option key={pf.id} value={pf.id}>
                {pf.name}
              </option>
            ))}
            <option value="__new__">+ Crear nuevo portfolio</option>
          </select>
          <button className="ficha-info-save-btn" onClick={handleSave}>
            Guardar
          </button>
          <span className="cancel-link" onClick={() => setOpen(false)}>
            Cancelar
          </span>
        </div>
      ) : (
        <div className="ficha-portfolio-create">
          <input
            type="text"
            autoFocus
            placeholder="Nombre del nuevo portfolio"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select value={newOkrId} onChange={(e) => setNewOkrId(e.target.value)}>
            <option value="">Sin vincular a un objetivo</option>
            {okrCatalog.map((o) => (
              <option key={o.id} value={o.id}>
                {o.objective} · {o.year}
              </option>
            ))}
          </select>
          <div className="ficha-portfolio-create-actions">
            <button className="ficha-info-save-btn" onClick={handleSave}>
              Crear y asignar
            </button>
            <span className="cancel-link" onClick={() => setCreating(false)}>
              Volver
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FichaProyecto({ ficha, nav }) {
  const {
    projects,
    okrCatalog,
    portfolioCatalog,
    projectId,
    setProjectId,
    closeFicha,
    tab,
    setTab,
    roadmap,
    documentacion,
    gantt,
    openRiesgos,
    openLecciones,
    openStatusReport,
    updateProjectPortfolio,
    addPortfolio,
  } = ficha;

  if (!projectId) {
    const currentProject = [...projects].sort(
      (a, b) => new Date(b.lastModifiedAt || b.createdAt || 0) - new Date(a.lastModifiedAt || a.createdAt || 0)
    )[0];

    const portfolioGroups = portfolioCatalog
      .map((pf) => ({
        key: pf.id,
        label: pf.name,
        okrLabel: okrCatalog.find((o) => o.id === pf.okrId)?.objective || "",
        projects: projects.filter((p) => p.portfolioId === pf.id),
      }))
      .filter((g) => g.projects.length > 0);

    const unassignedProjects = projects.filter((p) => !p.portfolioId || !portfolioCatalog.some((pf) => pf.id === p.portfolioId));
    if (unassignedProjects.length > 0) {
      portfolioGroups.push({ key: "sin-portfolio", label: SIN_PORTFOLIO, okrLabel: "", projects: unassignedProjects });
    }

    return (
      <div>
        <h1 className="page-title">Proyectos por portfolio</h1>
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

        {portfolioGroups.map((group) => (
          <div key={group.key} className="ficha-group">
            <h3 className="ficha-group-label">
              {group.label}
              {group.okrLabel && <span className="ficha-group-okr"> · {group.okrLabel}</span>}
            </h3>
            <div className="ficha-picker-grid">
              {group.projects.map((p) => (
                <div key={p.id} className="ficha-picker-card" onClick={() => setProjectId(p.id)}>
                  <div className="ficha-picker-preview" style={{ background: PROJECT_CARD_TINT }}>
                    <TriDotIcon size={40} color="rgba(255,255,255,0.55)" />
                  </div>
                  <div className="ficha-picker-body">
                    <h4>{p.name}</h4>
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
  const daysLeft = daysUntil(project?.deadline);

  return (
    <div>
      <span className="ficha-back" onClick={closeFicha}>
        ← Todos los proyectos
      </span>
      <h1 className="page-title">{project?.name}</h1>

      {project && (
        <div className="ficha-info-row">
          <div className="ficha-info-field">
            <span className="ficha-info-label">Gestor de proyecto</span>
            <span className="ficha-info-value">{project.pm || "Sin asignar"}</span>
          </div>
          <div className="ficha-info-field">
            <span className="ficha-info-label">Patrocinador</span>
            <span className="ficha-info-value">{project.sponsor || "Sin asignar"}</span>
          </div>
          <div className="ficha-info-field">
            <span className="ficha-info-label">Fecha de inicio</span>
            <span className="ficha-info-value">{project.startDate ? formatFechaCorta(project.startDate) : "Sin definir"}</span>
          </div>
          <div className="ficha-info-field">
            <span className="ficha-info-label">Fecha fin prevista</span>
            <span className="ficha-info-value">{project.deadline ? formatFechaCorta(project.deadline) : "Sin definir"}</span>
          </div>
          <div className="ficha-info-field">
            <span className="ficha-info-label">Cuenta atrás</span>
            <span className={`ficha-info-value ${daysLeft !== null && daysLeft < 0 ? "ficha-info-value--overdue" : ""}`}>
              {daysLeft === null
                ? "Sin fecha fin"
                : daysLeft >= 0
                ? `${daysLeft} día${daysLeft === 1 ? "" : "s"} restante${daysLeft === 1 ? "" : "s"}`
                : `Vencido hace ${Math.abs(daysLeft)} día${Math.abs(daysLeft) === 1 ? "" : "s"}`}
            </span>
          </div>
          <PortfolioAssignField
            project={project}
            portfolioCatalog={portfolioCatalog}
            okrCatalog={okrCatalog}
            onAssign={(id) => updateProjectPortfolio(projectId, id)}
            onCreatePortfolio={addPortfolio}
          />
        </div>
      )}

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
          onGoToStatusReport={() => openStatusReport(projectId)}
          onGoToLecciones={() => openLecciones(projectId)}
        />
      )}
      {tab === "gantt" && <GanttChart phases={gantt.phases} />}
      {tab === "documentacion" && <Documentacion documentacion={documentacion} />}
    </div>
  );
}
