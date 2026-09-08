import { LogoIcon, LogoutIcon, NAV_ICON_MAP } from "../icons/Icons";
import { NAV_ITEMS } from "../../data/roles";
import "./Sidebar.css";

export default function Sidebar({ nav, permissions, session }) {
  const { view, setView } = nav;
  const canFor = {
    dashboard: permissions.canDashboard,
    roadmap: permissions.canRoadmap,
    templates: permissions.canTemplates,
    statusreport: permissions.canStatusReport,
    knowledge: permissions.canKnowledge,
    chatbot: permissions.canChatbot,
  };

  const mainItems = NAV_ITEMS.filter((item) => item.group === "main" && canFor[item.id]);
  const secondaryItems = NAV_ITEMS.filter((item) => item.group === "secondary" && canFor[item.id]);

  const renderNavItem = (item) => {
    const Icon = NAV_ICON_MAP[item.icon];
    const active = item.id === view;
    return (
      <div
        key={item.id}
        className={`nav-item ${active ? "nav-item--active" : ""}`}
        onClick={() => setView(item.id)}
      >
        <Icon size={20} color={active ? "#FFFFFF" : "rgba(255,255,255,0.55)"} />
        <span className={`nav-item-label ${active ? "nav-item-label--active" : ""}`}>{item.label}</span>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <LogoIcon size={28} color="var(--accent)" />
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">PM Ad Hoc</span>
          <span className="sidebar-brand-tagline">powered by PMI best practices</span>
        </div>
      </div>

      <div className="sidebar-nav">{mainItems.map(renderNavItem)}</div>

      <div className="sidebar-footer">
        {secondaryItems.length > 0 && <div className="sidebar-nav sidebar-nav--secondary">{secondaryItems.map(renderNavItem)}</div>}

        <div className="avatar-row" onClick={() => setView("profile")}>
          <div className="avatar-circle">{session.profile.initials}</div>
          <div className="avatar-info">
            <span className="avatar-name">{session.profile.name}</span>
            <span className="avatar-role">{session.roleLabel}</span>
          </div>
        </div>
        <div className="logout-btn" onClick={session.logout}>
          <LogoutIcon size={15} color="rgba(255,255,255,0.55)" />
          <span>Cerrar sesión</span>
        </div>
      </div>
    </div>
  );
}
