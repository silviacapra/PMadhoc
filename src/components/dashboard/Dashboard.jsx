import { PlusIcon, RoadmapIcon, StatusReportIcon, KnowledgeIcon, ChatbotIcon } from "../icons/Icons";
import StatusBadge from "../shared/StatusBadge";
import "./Dashboard.css";

const QUICK_LINKS = [
  { id: "roadmap", label: "Roadmap", icon: RoadmapIcon, permission: "canRoadmap", view: "roadmap" },
  { id: "statusreport", label: "Status Report", icon: StatusReportIcon, permission: "canStatusReport", view: "statusreport" },
  { id: "knowledge", label: "Base de conocimiento", icon: KnowledgeIcon, permission: "canKnowledge", view: "knowledge" },
  { id: "chatbot", label: "PM virtual", icon: ChatbotIcon, permission: "canChatbot", view: "chatbot" },
];

export default function Dashboard({ dashboard, permissions, session, nav }) {
  const visibleLinks = QUICK_LINKS.filter((link) => permissions[link.permission]);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Overview de proyectos</h1>
          <p className="page-subtitle">Buenos días, {session.profile.firstName}. Así está el estado general de tus proyectos.</p>
        </div>
        <button className="new-project-btn">
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
              </div>
            </div>
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
          </div>
        ))}
      </div>

      {visibleLinks.length > 0 && (
        <div className="quick-links-card">
          <h3>Accesos rápidos</h3>
          <div className="quick-links-grid">
            {visibleLinks.map((link) => (
              <div key={link.id} className="quick-link" onClick={() => nav.setView(link.view)}>
                <link.icon size={18} color="var(--accent)" />
                <span>{link.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
