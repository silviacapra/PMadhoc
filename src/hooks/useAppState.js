import { useState } from "react";
import { ROLE_PERMISSIONS, ROLE_LABELS, defaultViewForRole } from "../data/roles";
import { CURRENT_PROJECT_PHASE } from "../data/roadmapContent";
import { TEAM_MEMBERS } from "../data/team";
import { PHASE_FILTER_DEFS, ALL_TEMPLATES } from "../data/templates";
import { PROJECTS } from "../data/projects";
import { STATUS_REPORT } from "../data/statusReport";
import { KB_CATEGORIES, ARTICLES } from "../data/knowledge";
import { INITIAL_MESSAGES, DEFAULT_BOT_REPLY } from "../data/chatbot";
import { getInitials, getFirstName } from "../utils/text";
import { buildPhases, buildRoadmapSteps } from "../utils/roadmap";
import { getTaskOptions, filterTemplates } from "../utils/templates";

const INITIAL_AUTH_FORM = { name: "", email: "", password: "", role: "pm" };
const INITIAL_PROFILE = { name: "Silvia Capra", email: "silvia@pmadhoc.com" };

export function useAppState() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [userRole, setUserRole] = useState("pm");
  const [view, setView] = useState("dashboard");
  const [roadmapPhase, setRoadmapPhase] = useState(CURRENT_PROJECT_PHASE);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileDraft, setProfileDraft] = useState(INITIAL_PROFILE);
  const [profileSaved, setProfileSaved] = useState(false);
  const [templateFilterPhase, setTemplateFilterPhase] = useState("todas");
  const [templateFilterTask, setTemplateFilterTask] = useState("todas");
  const [expandedStepKey, setExpandedStepKey] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

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

  const filteredTemplates = filterTemplates(ALL_TEMPLATES, templateFilterPhase, templateFilterTask);

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
      canKnowledge: can("knowledge"),
      canRoadmap: can("roadmap"),
      canTemplates: can("templates"),
      canChatbot: can("chatbot"),
      canStatusReport: can("statusreport"),
    },
    nav: { view, setView },
    dashboard: { projects: PROJECTS },
    roadmap: {
      phases: buildPhases(roadmapPhase),
      steps: buildRoadmapSteps(roadmapPhase, taskAssignments, expandedStepKey),
      selectedPhase: roadmapPhase,
      isCurrentPhase: roadmapPhase === CURRENT_PROJECT_PHASE,
      selectPhase: setRoadmapPhase,
      toggleStep,
      updateTaskMeta,
      teamMembers: TEAM_MEMBERS,
    },
    templates: {
      phaseFilters: PHASE_FILTER_DEFS,
      activePhaseFilter: templateFilterPhase,
      activeTaskFilter: templateFilterTask,
      taskOptions: getTaskOptions(templateFilterPhase),
      filteredTemplates,
      pickPhaseFilter,
      setTaskFilter: setTemplateFilterTask,
    },
    statusReport: { portfolio: PROJECTS, report: STATUS_REPORT },
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
