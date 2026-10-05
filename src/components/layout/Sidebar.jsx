import { useState } from "react";
import { NAV_ICON_MAP, ChevronRightIcon } from "../icons/Icons";
import { NAV_ITEMS } from "../../data/roles";
import "./Sidebar.css";

export default function Sidebar({ nav, permissions, projects = [], onOpenProject }) {
  const { view, setView } = nav;
  const [expanded, setExpanded] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
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
  };

  const mainItems = NAV_ITEMS.filter((item) => item.group === "main" && canFor[item.id]);
  const secondaryItems = NAV_ITEMS.filter((item) => item.group === "secondary" && canFor[item.id]);

  const renderNavItem = (item) => {
    const Icon = NAV_ICON_MAP[item.icon];
    const active = item.id === view;
    const isRoadmap = item.id === "roadmap";

    if (!isRoadmap) {
      return (
        <div
          key={item.id}
          className={`nav-item ${active ? "nav-item--active" : ""}`}
          onClick={() => {
            setView(item.id);
            setExpanded(true);
          }}
        >
          <Icon size={20} color="#FFFFFF" />
          <span className="nav-item-label">{item.label}</span>
        </div>
      );
    }

    return (
      <div key={item.id}>
        <div
          className={`nav-item ${active ? "nav-item--active" : ""}`}
          onClick={() => {
            setView(item.id);
            setExpanded(true);
            setProjectsOpen((prev) => (expanded ? !prev : true));
          }}
        >
          <Icon size={20} color="#FFFFFF" />
          <span className="nav-item-label">{item.label}</span>
          <span className="nav-item-caret">
            <ChevronRightIcon
              size={12}
              color="#FFFFFF"
              style={{ transform: projectsOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </span>
        </div>
        {expanded && projectsOpen && (
          <div className="nav-subitems">
            {projects.length === 0 ? (
              <div className="nav-subitem nav-subitem--empty">Sin proyectos todavía</div>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="nav-subitem"
                  onClick={() => {
                    setView("roadmap");
                    onOpenProject(p.id);
                  }}
                >
                  {p.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${expanded ? "sidebar--expanded" : ""}`}>
      <div className="sidebar-scroll">
        <div className="sidebar-nav">{mainItems.map(renderNavItem)}</div>
        {secondaryItems.length > 0 && <div className="sidebar-nav sidebar-nav--secondary">{secondaryItems.map(renderNavItem)}</div>}
      </div>
      <button
        className="sidebar-toggle"
        onClick={() => setExpanded((prev) => !prev)}
        title={expanded ? "Contraer menú" : "Expandir menú"}
      >
        <ChevronRightIcon size={13} color="#FFFFFF" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
    </div>
  );
}
