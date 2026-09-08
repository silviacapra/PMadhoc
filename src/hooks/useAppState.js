import { useState } from "react";
import { ROLE_PERMISSIONS, ROLE_LABELS, defaultViewForRole } from "../data/roles";
import { CURRENT_PROJECT_PHASE, PHASE_ORDER, ROADMAP_CONTENT } from "../data/roadmapContent";
import { GATE_REQUIREMENTS, INITIAL_EXCEPTIONS } from "../data/roadmapGates";
import { TEAM_MEMBERS } from "../data/team";
import { PHASE_FILTER_DEFS, ALL_TEMPLATES } from "../data/templates";
import { INITIAL_PROJECTS } from "../data/projects";
import { STATUS_REPORTS } from "../data/statusReport";
import { KB_CATEGORIES, ARTICLES } from "../data/knowledge";
import { INITIAL_MESSAGES, DEFAULT_BOT_REPLY } from "../data/chatbot";
import { INITIAL_COMPANY, INITIAL_OKR_CATALOG } from "../data/company";
import { getInitials, getFirstName } from "../utils/text";
import { buildPhases, buildRoadmapSteps, nextPhase } from "../utils/roadmap";
import { getTaskOptions, filterTemplates } from "../utils/templates";
import { riskLevel, slugify } from "../utils/projects";

const INITIAL_AUTH_FORM = { name: "", email: "", password: "", role: "pm" };
const INITIAL_PROFILE = { name: "Silvia Capra", email: "silvia@pmadhoc.com" };
const INITIAL_EXCEPTION_FORM = { motivo: "", autorizadoPor: "" };
const INITIAL_LESSONS_FORM = { queFunciono: "", queNoFunciono: "", recomendaciones: "" };

export function useAppState() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [userRole, setUserRole] = useState("pm");
  const [view, setView] = useState("dashboard");
  const [roadmapPhase, setRoadmapPhase] = useState(CURRENT_PROJECT_PHASE);
  const [currentPhase, setCurrentPhase] = useState(CURRENT_PROJECT_PHASE);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileDraft, setProfileDraft] = useState(INITIAL_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [templateFilterPhase, setTemplateFilterPhase] = useState("todas");
  const [templateFilterTask, setTemplateFilterTask] = useState("todas");
  const [expandedStepKey, setExpandedStepKey] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const [companyInfo, setCompanyInfo] = useState(INITIAL_COMPANY);
  const [okrCatalog, setOkrCatalog] = useState(INITIAL_OKR_CATALOG);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [templatesList, setTemplatesList] = useState(ALL_TEMPLATES);
  const [activeTemplateProjectId, setActiveTemplateProjectId] = useState(INITIAL_PROJECTS[0].id);

  const [gateChecks, setGateChecks] = useState({});
  const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
  const [exceptionForm, setExceptionForm] = useState(INITIAL_EXCEPTION_FORM);
  const [lessonsForm, setLessonsForm] = useState(INITIAL_LESSONS_FORM);
  const [lessonsSubmitted, setLessonsSubmitted] = useState(false);

  const [sponsorFilter, setSponsorFilter] = useState("todos");
  const [departmentFilter, setDepartmentFilter] = useState("todos");
  const [riskFilter, setRiskFilter] = useState("todos");
  const [statusSelectedProjectId, setStatusSelectedProjectId] = useState(INITIAL_PROJECTS[0].id);

  const role = ROLE_PERMISSIONS[userRole] ? userRole : "pm";
  const permissions = ROLE_PERMISSIONS[role];
  const can = (section) => permissions.includes(section);

  function updateAuthField(field, value) {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  }

  function submitAuth() {
    const isSignup = authMode === "signup";
    const name = authForm.name.trim();
    const newRole = isSignup ? authForm.role || "pm" : userRole;
    setLoggedIn(true);
    setUserRole(newRole);
    setView(defaultViewForRole(newRole));
    if (isSignup && name) {
      setProfile((prev) => ({ ...prev, name }));
      setProfileDraft((prev) => ({ ...prev, name }));
    }
    if (authForm.email) {
      setProfile((prev) => ({ ...prev, email: authForm.email }));
      setProfileDraft((prev) => ({ ...prev, email: authForm.email }));
    }
    setAuthForm((prev) => ({ ...prev, password: "" }));
  }

  function logout() {
    setLoggedIn(false);
    setView("dashboard");
    setAuthMode("login");
    setAuthForm((prev) => ({ ...prev, password: "" }));
  }

  function updateTaskMeta(key, patch) {
    setTaskAssignments((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }));
  }

  function toggleStep(key) {
    setExpandedStepKey((prev) => (prev === key ? null : key));
  }

  function saveProfile() {
    setProfile(profileDraft);
    setProfileSaved(true);
  }

  function updateProfileDraft(field, value) {
    setProfileDraft((prev) => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  }

  function pickPhaseFilter(phaseId) {
    setTemplateFilterPhase(phaseId);
    setTemplateFilterTask("todas");
  }

  function sendMessage() {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: DEFAULT_BOT_REPLY }]);
    setChatInput("");
  }

  function updateCompanyField(field, value) {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }));
  }

  function addOkr({ year, objective, keyResults }) {
    const id = `okr-${year}-${Date.now()}`;
    setOkrCatalog((prev) => [...prev, { id, year, objective, keyResults }]);
  }

  function addProject({ name, methodology, sponsor, department, contributesTo }) {
    const id = `${slugify(name)}-${Date.now()}`;
    setProjects((prev) => [
      ...prev,
      {
        id,
        name,
        phase: "Pre-proyecto",
        progress: 0,
        daysLeft: 90,
        risks: 0,
        status: "onTrack",
        methodology,
        sponsor,
        department,
        contributesTo,
        budgetTotal: 0,
        budgetSpent: 0,
      },
    ]);
  }

  function toggleGateItem(index) {
    setGateChecks((prev) => ({
      ...prev,
      [roadmapPhase]: { ...(prev[roadmapPhase] || {}), [index]: !(prev[roadmapPhase] || {})[index] },
    }));
  }

  const gateItemsForCurrentPhase = GATE_REQUIREMENTS[currentPhase] || [];
  const gateCheckedForCurrentPhase = gateChecks[currentPhase] || {};
  const canAdvance =
    gateItemsForCurrentPhase.length > 0 && gateItemsForCurrentPhase.every((_, i) => gateCheckedForCurrentPhase[i]);

  function advancePhase() {
    const next = nextPhase(currentPhase);
    if (!canAdvance || !next) return;
    setCurrentPhase(next);
    setRoadmapPhase(next);
  }

  function updateExceptionField(field, value) {
    setExceptionForm((prev) => ({ ...prev, [field]: value }));
  }

  function addException() {
    if (!exceptionForm.motivo.trim() || !exceptionForm.autorizadoPor.trim()) return;
    setExceptions((prev) => [
      ...prev,
      {
        id: `exc-${Date.now()}`,
        phase: ROADMAP_CONTENT[roadmapPhase]?.label || roadmapPhase,
        motivo: exceptionForm.motivo.trim(),
        autorizadoPor: exceptionForm.autorizadoPor.trim(),
        fecha: new Date().toISOString().slice(0, 10),
      },
    ]);
    setExceptionForm(INITIAL_EXCEPTION_FORM);
  }

  function updateLessonsField(field, value) {
    setLessonsForm((prev) => ({ ...prev, [field]: value }));
  }

  function submitLessons() {
    if (!lessonsForm.queFunciono.trim() || !lessonsForm.queNoFunciono.trim() || !lessonsForm.recomendaciones.trim()) return;
    setLessonsSubmitted(true);
  }

  function migrateTemplate(title) {
    setTemplatesList((prev) => prev.map((t) => (t.title === title ? { ...t, adoptedVersion: t.latestVersion } : t)));
  }

  const activeTemplateProject = projects.find((p) => p.id === activeTemplateProjectId) || projects[0];
  const filteredTemplates = filterTemplates(templatesList, templateFilterPhase, templateFilterTask, activeTemplateProject?.methodology);

  const filteredPortfolio = projects.filter((p) => {
    const matchesSponsor = sponsorFilter === "todos" || p.sponsor === sponsorFilter;
    const matchesDept = departmentFilter === "todos" || p.department === departmentFilter;
    const matchesRisk = riskFilter === "todos" || riskLevel(p.risks) === riskFilter;
    return matchesSponsor && matchesDept && matchesRisk;
  });

  const statusSelectedProject = projects.find((p) => p.id === statusSelectedProjectId) || projects[0];
  const report = STATUS_REPORTS[statusSelectedProject?.id] || STATUS_REPORTS[projects[0].id];

  return {
    auth: {
      loggedIn,
      mode: authMode,
      isSignup: authMode === "signup",
      form: authForm,
      setMode: setAuthMode,
      updateField: updateAuthField,
      submit: submitAuth,
    },
    session: {
      role,
      roleLabel: ROLE_LABELS[role],
      profile: {
        name: profile.name,
        email: profile.email,
        firstName: getFirstName(profile.name),
        initials: getInitials(profile.name),
      },
      logout,
    },
    permissions: {
      canDashboard: can("dashboard"),
      canEmpresa: can("empresa"),
      canKnowledge: can("knowledge"),
      canRoadmap: can("roadmap"),
      canTemplates: can("templates"),
      canChatbot: can("chatbot"),
      canStatusReport: can("statusreport"),
    },
    nav: { view, setView },
    dashboard: { projects, addProject, okrCatalog },
    company: {
      info: companyInfo,
      updateField: updateCompanyField,
    },
    okr: {
      catalog: okrCatalog,
      addOkr,
    },
    roadmap: {
      phases: buildPhases(roadmapPhase, currentPhase),
      steps: buildRoadmapSteps(roadmapPhase, taskAssignments, expandedStepKey),
      selectedPhase: roadmapPhase,
      isCurrentPhase: roadmapPhase === currentPhase,
      isLastPhase: roadmapPhase === PHASE_ORDER[PHASE_ORDER.length - 1],
      selectPhase: setRoadmapPhase,
      toggleStep,
      updateTaskMeta,
      teamMembers: TEAM_MEMBERS,
      gateItems: GATE_REQUIREMENTS[roadmapPhase] || [],
      gateChecked: gateChecks[roadmapPhase] || {},
      toggleGateItem,
      canAdvance,
      advancePhase,
      exceptions,
      exceptionForm,
      updateExceptionField,
      addException,
      lessonsForm,
      updateLessonsField,
      lessonsSubmitted,
      submitLessons,
    },
    templates: {
      phaseFilters: PHASE_FILTER_DEFS,
      activePhaseFilter: templateFilterPhase,
      activeTaskFilter: templateFilterTask,
      taskOptions: getTaskOptions(templateFilterPhase),
      filteredTemplates,
      pickPhaseFilter,
      setTaskFilter: setTemplateFilterTask,
      projects,
      activeProjectId: activeTemplateProjectId,
      setActiveProjectId: setActiveTemplateProjectId,
      migrateTemplate,
    },
    statusReport: {
      portfolio: projects,
      filteredPortfolio,
      sponsorFilter,
      setSponsorFilter,
      departmentFilter,
      setDepartmentFilter,
      riskFilter,
      setRiskFilter,
      sponsors: [...new Set(projects.map((p) => p.sponsor))],
      departments: [...new Set(projects.map((p) => p.department))],
      selectedProjectId: statusSelectedProject?.id,
      setSelectedProjectId: setStatusSelectedProjectId,
      report,
    },
    knowledge: { categories: KB_CATEGORIES, articles: ARTICLES },
    chatbot: { messages, chatInput, setChatInput, sendMessage },
    profile: {
      current: profile,
      draft: profileDraft,
      saved: profileSaved,
      initials: getInitials(profile.name),
      updateField: updateProfileDraft,
      save: saveProfile,
    },
  };
}
