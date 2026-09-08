import { useAppState } from "./hooks/useAppState";
import AuthScreen from "./components/auth/AuthScreen";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import EmpresaOkr from "./components/company/EmpresaOkr";
import Roadmap from "./components/roadmap/Roadmap";
import Templates from "./components/templates/Templates";
import StatusReport from "./components/statusReport/StatusReport";
import Knowledge from "./components/knowledge/Knowledge";
import Chatbot from "./components/chatbot/Chatbot";
import Profile from "./components/profile/Profile";
import "./components/layout/AppShell.css";

export default function App() {
  const state = useAppState();
  const { auth, session, permissions, nav } = state;

  if (!auth.loggedIn) {
    return <AuthScreen auth={auth} />;
  }

  const { view } = nav;
  const canShow = {
    dashboard: permissions.canDashboard,
    empresa: permissions.canEmpresa,
    roadmap: permissions.canRoadmap,
    templates: permissions.canTemplates,
    statusreport: permissions.canStatusReport,
    knowledge: permissions.canKnowledge,
    chatbot: permissions.canChatbot,
    profile: true,
  };

  return (
    <div className="app-shell">
      <Sidebar nav={nav} permissions={permissions} session={session} />
      <main className="content-area">
        {view === "dashboard" && canShow.dashboard && (
          <Dashboard dashboard={state.dashboard} permissions={permissions} session={session} nav={nav} />
        )}
        {view === "empresa" && canShow.empresa && <EmpresaOkr company={state.company} okr={state.okr} />}
        {view === "roadmap" && canShow.roadmap && <Roadmap roadmap={state.roadmap} />}
        {view === "templates" && canShow.templates && <Templates templates={state.templates} />}
        {view === "statusreport" && canShow.statusreport && <StatusReport statusReport={state.statusReport} />}
        {view === "knowledge" && canShow.knowledge && <Knowledge knowledge={state.knowledge} />}
        {view === "chatbot" && canShow.chatbot && <Chatbot chatbot={state.chatbot} />}
        {view === "profile" && <Profile profile={state.profile} />}
      </main>
    </div>
  );
}
