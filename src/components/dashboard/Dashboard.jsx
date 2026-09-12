import { useState } from "react";
import { PlusIcon, RoadmapIcon, StatusReportIcon, TrashIcon, PencilIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import ProjectModal from "./ProjectModal";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import { METHODOLOGY_LABELS } from "../../data/projects";
import { TEAM_MEMBERS, DEPARTMENTS } from "../../data/team";
import "./Dashboard.css";

const SPONSORS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Sponsor");
const PMS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Project manager");

export default function Dashboard({ dashboard, permissions, session, nav, statusReport }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    return d.toLocaleString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function objectiveLabel(contributesTo) {
    if (!contributesTo || contributesTo.length === 0) return "Sin objetivo estratégico asignado";
    return contributesTo
      .map((id) => dashboard.okrCatalog.find((o) => o.id === id)?.objective)
      .filter(Boolean)
      .join(" · ");
  }

  function goToRoadmap(proj) {
    dashboard.openFicha(proj.id, "roadmap");
    nav.setView("roadmap");
  }

  function goToStatusReport(proj) {
    statusReport.setSelectedProjectId(proj.id);
    nav.setView("statusreport");
  }

  const deletingProject = dashboard.projects.find((p) => p.id === dashboard.deleteProjectId) || null;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Overview de proyectos</h1>
          <p className="page-subtitle">Buenos días, {session.profile.firstName}. Así está el estado general de tus proyectos.</p>
        </div>
        <button className="new-project-btn" onClick={() => setModalOpen(true)}>
          <PlusIcon size={16} color="currentColor" />
          Nuevo proyecto
        </button>
      </div>

      <div className="project-cards">
        {dashboard.projects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-header">
              <div className="project-card-title">
                <span className={`status-dot status-dot--${proj.status}`} />
                <h2>{proj.name}</h2>
              </div>
              <div className="project-card-badges">
                <StatusBadge status={proj.status} />
                <span className="phase-pill">Fase: {proj.phase}</span>
                <span className="phase-pill">{METHODOLOGY_LABELS[proj.methodology]}</span>
                <button className="project-card-icon-btn" title="Editar proyecto" onClick={() => setEditingProject(proj)}>
                  <PencilIcon size={14} color="currentColor" />
                </button>
                <button className="project-card-icon-btn" title="Ir al roadmap" onClick={() => goToRoadmap(proj)}>
                  <RoadmapIcon size={15} color="currentColor" />
                </button>
                <button className="project-card-icon-btn" title="Ir al status report" onClick={() => goToStatusReport(proj)}>
                  <StatusReportIcon size={15} color="currentColor" />
                </button>
                <button
                  className="project-card-icon-btn project-card-icon-btn--danger"
                  title="Eliminar proyecto"
                  onClick={() => dashboard.setDeleteProjectId(proj.id)}
                >
                  <TrashIcon size={15} color="currentColor" />
                </button>
              </div>
            </div>
            <p className="project-card-objective">{objectiveLabel(proj.contributesTo)}</p>
            {(proj.budgetTotal > 0 || proj.deadline || proj.hitos) && (
              <div className="project-card-meta">
                {proj.budgetTotal > 0 && <span>💰 {proj.budgetTotal.toLocaleString("es-ES")} €</span>}
                {proj.deadline && <span>📅 {formatDate(proj.deadline)}</span>}
                {proj.hitos && <span>🏁 {proj.hitos}</span>}
              </div>
            )}
            <div className="project-card-stats">
              <div>
                <span className="stat-value">{proj.progress}%</span>
                <span className="stat-label">avance</span>
              </div>
              <div>
                <span className="stat-value">{proj.daysLeft}</span>
                <span className="stat-label">días restantes</span>
              </div>
              <div>
                <span className="stat-value">{proj.risks}</span>
                <span className="stat-label">riesgos abiertos</span>
              </div>
            </div>
            <div className="project-progress-track">
              <div className="project-progress-fill" style={{ width: `${proj.progress}%` }} />
            </div>
            {proj.createdAt && (
              <p className="project-card-audit">
                Creado{proj.createdBy ? ` por ${proj.createdBy}` : ""} · {formatDateTime(proj.createdAt)}
              </p>
            )}
            {proj.lastModifiedBy && (
              <p className="project-card-audit">
                Editado por {proj.lastModifiedBy} · {formatDateTime(proj.lastModifiedAt)}
              </p>
            )}
          </div>
        ))}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sponsors={SPONSORS}
        pms={PMS}
        departments={DEPARTMENTS}
        okrCatalog={dashboard.okrCatalog}
        onCreate={(project) => {
          dashboard.addProject(project);
          setModalOpen(false);
        }}
      />

      <ProjectModal
        open={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        sponsors={SPONSORS}
        pms={PMS}
        departments={DEPARTMENTS}
        okrCatalog={dashboard.okrCatalog}
        onSave={(id, patch) => {
          dashboard.updateProject(id, patch);
          setEditingProject(null);
        }}
      />

      <ConfirmDeleteModal
        item={deletingProject}
        itemLabel="proyecto"
        itemName={deletingProject?.name}
        onClose={() => dashboard.setDeleteProjectId(null)}
        onConfirm={dashboard.deleteProject}
      />
    </div>
  );
}
