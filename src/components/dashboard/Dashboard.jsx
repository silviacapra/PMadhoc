import { useState } from "react";
import { PlusIcon, StatusReportIcon, TrashIcon, PencilIcon, ArrowRightIcon, TriDotIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import ProjectModal from "./ProjectModal";
import NewProjectOnboarding from "./NewProjectOnboarding";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import ConfirmModifyModal from "../shared/ConfirmModifyModal";
import { PROJECT_CARD_TINT } from "../../data/projects";
import { TEAM_MEMBERS, DEPARTMENTS } from "../../data/team";
import "./Dashboard.css";

const SPONSORS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Patrocinador");
const PMS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Gestor de proyecto");

export default function Dashboard({ dashboard, permissions, session, nav, statusReport }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [modifyTarget, setModifyTarget] = useState(null);

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
      <p className="dashboard-greeting">
        Hola {session.profile.firstName}, bienvenido a tu espacio de gestión de proyectos.
      </p>

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Panel</h1>
        </div>
        {permissions?.canCreateProject && (
          <button className="new-project-btn" onClick={() => setModalOpen(true)}>
            <PlusIcon size={16} color="currentColor" />
            Nuevo proyecto
          </button>
        )}
      </div>

      <div className="project-cards">
        {dashboard.projects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-banner" style={{ background: PROJECT_CARD_TINT }}>
              <StatusBadge status={proj.status} style={{ position: "relative", zIndex: 1 }} />
              <TriDotIcon size={40} color="rgba(255,255,255,0.5)" style={{ position: "absolute", right: 18, bottom: 14 }} />
            </div>

            <div className="project-card-body">
              <div className="project-card-top">
                <h2 className="project-card-name">{proj.name}</h2>
                <div className="project-card-icons">
                  <button className="project-card-icon-btn" title="Editar proyecto" onClick={() => setModifyTarget(proj)}>
                    <PencilIcon size={14} color="currentColor" />
                  </button>
                  <button className="project-card-icon-btn" title="Ir a los informes de proyecto" onClick={() => goToStatusReport(proj)}>
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

              <div className="project-card-badges">
                <span className="phase-pill">Fase: {proj.phase}</span>
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

              <button className="project-card-cta" onClick={() => goToRoadmap(proj)}>
                Ver roadmap
                <ArrowRightIcon size={14} color="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <NewProjectOnboarding
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sponsors={SPONSORS}
        pms={PMS}
        departments={DEPARTMENTS}
        okrCatalog={dashboard.okrCatalog}
        onCreate={(project) => dashboard.addProject(project)}
      />

      <ConfirmModifyModal
        item={modifyTarget}
        itemLabel="proyecto"
        itemName={modifyTarget?.name}
        onClose={() => setModifyTarget(null)}
        onConfirm={(proj) => {
          setEditingProject(proj);
          setModifyTarget(null);
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
