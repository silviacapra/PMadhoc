import { useAppState } from "./hooks/useAppState";
import AuthScreen from "./components/auth/AuthScreen";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import EmpresaOkr from "./components/company/EmpresaOkr";
import FichaProyecto from "./components/ficha/FichaProyecto";
import GanttRoadmap from "./components/roadmap/GanttRoadmap";
import Templates from "./components/templates/Templates";
import Riesgos from "./components/registro/Riesgos";
import DocumentacionPage from "./components/registro/DocumentacionPage";
import Lecciones from "./components/registro/Lecciones";
import StatusReport from "./components/statusReport/StatusReport";
import Stakeholders from "./components/stakeholders/Stakeholders";
import Knowledge from "./components/knowledge/Knowledge";
import Chatbot from "./components/chatbot/Chatbot";
import Profile from "./components/profile/Profile";
import "./components/layout/AppShell.css";

export default function App() {
  const state = useAppState();
  const { auth, session, permissions, nav } = state;

  if (!auth.authReady) {
    return null;
  }

  if (!auth.loggedIn) {
    return <AuthScreen auth={auth} />;
  }

  const { view } = nav;
  const canShow = {
    dashboard: permissions.canDashboard,
    empresa: permissions.canEmpresa,
    roadmap: permissions.canRoadmap,
    templates: permissions.canTemplates,
    gantt: permissions.canGantt,
    riesgos: permissions.canRiesgos,
    documentacion: permissions.canDocumentacion,
    lecciones: permissions.canLecciones,
    statusreport: permissions.canStatusReport,
    stakeholders: permissions.canStakeholders,
    knowledge: permissions.canKnowledge,
    chatbot: permissions.canChatbot,
    profile: true,
  };

  return (
    <div className="app-shell">
      <Sidebar nav={nav} permissions={permissions} session={session} />
      <main className="content-area">
        {view === "dashboard" && canShow.dashboard && (
          <Dashboard dashboard={state.dashboard} permissions={permissions} session={session} nav={nav} statusReport={state.statusReport} />
        )}
        {view === "empresa" && canShow.empresa && <EmpresaOkr company={state.company} okr={state.okr} />}
        {view === "roadmap" && canShow.roadmap && <FichaProyecto ficha={state.ficha} />}
        {view === "gantt" && canShow.gantt && <GanttRoadmap ganttPage={state.ganttPage} />}
        {view === "templates" && canShow.templates && <Templates templates={state.templates} />}
        {view === "riesgos" && canShow.riesgos && <Riesgos riesgos={state.riesgos} />}
        {view === "documentacion" && canShow.documentacion && <DocumentacionPage documentacionPage={state.documentacionPage} />}
        {view === "lecciones" && canShow.lecciones && <Lecciones lecciones={state.lecciones} />}
        {view === "statusreport" && canShow.statusreport && <StatusReport statusReport={state.statusReport} />}
        {view === "stakeholders" && canShow.stakeholders && (
          <Stakeholders
            stakeholders={state.stakeholders}
            updateStakeholder={state.updateStakeholder}
            deleteStakeholder={state.deleteStakeholder}
          />
        )}
        {view === "knowledge" && canShow.knowledge && <Knowledge knowledge={state.knowledge} />}
        {view === "chatbot" && canShow.chatbot && <Chatbot chatbot={state.chatbot} />}
        {view === "profile" && <Profile profile={state.profile} />}
      </main>
    </div>
  );
}
