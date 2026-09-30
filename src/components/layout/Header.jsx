import { useState } from "react";
import Logo from "../shared/Logo";
import Confetti from "../shared/Confetti";
import { LogoutIcon, PlusIcon } from "../icons/Icons";
import ProjectModal from "../dashboard/ProjectModal";
import { TEAM_MEMBERS, DEPARTMENTS } from "../../data/team";
import "./Header.css";

const SPONSORS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Patrocinador");
const PMS = TEAM_MEMBERS.filter((t) => t.roleLabel === "Gestor de proyecto");

export default function Header({ session, nav, dashboard, permissions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confettiFire, setConfettiFire] = useState(0);

  return (
    <header className="app-header">
      <div className="app-header-brand" onClick={() => nav.setView("dashboard")}>
        <Logo variant="light" size={32} textSize={14} />
      </div>
      <div className="app-header-account">
        {permissions?.canCreateProject && (
          <button className="app-header-new-project-btn" onClick={() => setModalOpen(true)}>
            <PlusIcon size={15} color="currentColor" />
            Nuevo proyecto
          </button>
        )}
        <div className="app-header-profile" onClick={() => nav.setView("profile")}>
          <div className="app-header-avatar">{session.profile.initials}</div>
          <div className="app-header-profile-info">
            <span className="app-header-name">{session.profile.name}</span>
            <span className="app-header-role">{session.roleLabel}</span>
          </div>
        </div>
        <button className="app-header-logout" onClick={session.logout} title="Cerrar sesión">
          <LogoutIcon size={16} color="#FFFFFF" />
        </button>
      </div>

      {dashboard && (
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
            nav.setView("dashboard");
            setConfettiFire((n) => n + 1);
          }}
        />
      )}
      <Confetti fire={confettiFire} />
    </header>
  );
}
