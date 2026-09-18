import { NAV_ICON_MAP } from "../icons/Icons";
import { NAV_ITEMS } from "../../data/roles";
import "./Sidebar.css";

export default function Sidebar({ nav, permissions }) {
  const { view, setView } = nav;
  const canFor = {
    dashboard: permissions.canDashboard,
    empresa: permissions.canEmpresa,
    roadmap: permissions.canRoadmap,
    templates: permissions.canTemplates,
    riesgos: permissions.canRiesgos,
    documentacion: permissions.canDocumentacion,
    lecciones: permissions.canLecciones,
    statusreport: permissions.canStatusReport,
    stakeholders: permissions.canStakeholders,
    knowledge: permissions.canKnowledge,
    chatbot: permissions.canChatbot,
  };

  const mainItems = NAV_ITEMS.filter((item) => item.group === "main" && canFor[item.id]);
  const secondaryItems = NAV_ITEMS.filter((item) => item.group === "secondary" && canFor[item.id]);

  const renderNavItem = (item) => {
    const Icon = NAV_ICON_MAP[item.icon];
    const active = item.id === view;
    return (
      <div key={item.id} className={`nav-item ${active ? "nav-item--active" : ""}`} onClick={() => setView(item.id)}>
        <Icon size={20} color="#FFFFFF" />
        <span className="nav-item-label">{item.label}</span>
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">{mainItems.map(renderNavItem)}</div>
      {secondaryItems.length > 0 && <div className="sidebar-nav sidebar-nav--secondary">{secondaryItems.map(renderNavItem)}</div>}
    </div>
  );
}
