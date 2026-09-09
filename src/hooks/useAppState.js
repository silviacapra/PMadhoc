import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, updateDoc, addDoc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { askGemini } from "../gemini";
import { ROLE_PERMISSIONS, ROLE_LABELS, defaultViewForRole } from "../data/roles";
import { CURRENT_PROJECT_PHASE, PHASE_ORDER, ROADMAP_CONTENT } from "../data/roadmapContent";
import { GATE_REQUIREMENTS, INITIAL_EXCEPTIONS } from "../data/roadmapGates";
import { TEAM_MEMBERS } from "../data/team";
import { PHASE_FILTER_DEFS, ALL_TEMPLATES } from "../data/templates";
import { INITIAL_PROJECTS } from "../data/projects";
import { STATUS_REPORTS } from "../data/statusReport";
import { KB_CATEGORIES, ARTICLES } from "../data/knowledge";
import { INITIAL_MESSAGES } from "../data/chatbot";
import { INITIAL_COMPANY, INITIAL_OKR_CATALOG } from "../data/company";
import { getInitials, getFirstName } from "../utils/text";
import { buildPhases, buildRoadmapSteps, nextPhase } from "../utils/roadmap";
import { getTaskOptions, filterTemplates } from "../utils/templates";
import { riskLevel, slugify } from "../utils/projects";

const INITIAL_AUTH_FORM = { name: "", email: "", password: "", role: "pm" };
const INITIAL_EXCEPTION_FORM = { motivo: "", autorizadoPor: "" };
const INITIAL_LESSONS_FORM = { queFunciono: "", queNoFunciono: "", recomendaciones: "" };

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Ese correo ya está registrado. Prueba a iniciar sesión.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No existe ninguna cuenta con ese correo.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento y vuelve a intentarlo.",
};

function authErrorMessage(code) {
  return AUTH_ERROR_MESSAGES[code] || "Ha ocurrido un error. Inténtalo de nuevo.";
}

export function useAppState() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(INITIAL_AUTH_FORM);
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const [view, setView] = useState("dashboard");
  const [roadmapPhase, setRoadmapPhase] = useState(CURRENT_PROJECT_PHASE);

  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", email: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const profileLoadedRef = useRef(false);

  const [templateFilterPhase, setTemplateFilterPhase] = useState("todas");
  const [templateFilterTask, setTemplateFilterTask] = useState("todas");
  const [expandedStepKey, setExpandedStepKey] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [companyInfo, setCompanyInfo] = useState(INITIAL_COMPANY);
  const [okrCatalog, setOkrCatalog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);
  const [activeTemplateProjectId, setActiveTemplateProjectId] = useState("");

  const [currentPhase, setCurrentPhase] = useState(CURRENT_PROJECT_PHASE);
  const [gateChecks, setGateChecks] = useState({});
  const [taskAssignments, setTaskAssignments] = useState({});
  const [exceptions, setExceptions] = useState([]);
  const [exceptionForm, setExceptionForm] = useState(INITIAL_EXCEPTION_FORM);
  const [lessonsForm, setLessonsForm] = useState(INITIAL_LESSONS_FORM);
  const [lessonsData, setLessonsData] = useState(null);

  const [sponsorFilter, setSponsorFilter] = useState("todos");
  const [departmentFilter, setDepartmentFilter] = useState("todos");
  const [riskFilter, setRiskFilter] = useState("todos");
  const [statusSelectedProjectId, setStatusSelectedProjectId] = useState("");

  // Sesión: se queda escuchando si hay alguien conectado (y sigue conectado tras recargar la página).
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
      if (!u) profileLoadedRef.current = false;
    });
    return unsub;
  }, []);

  // Primer arranque: si la base de datos está vacía, la rellena con los datos de ejemplo.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const companySnap = await getDoc(doc(db, "company", "main"));
      if (companySnap.exists()) return;
      await setDoc(doc(db, "company", "main"), INITIAL_COMPANY);
      await Promise.all(
        INITIAL_OKR_CATALOG.map((o) => setDoc(doc(db, "okrs", o.id), { year: o.year, objective: o.objective, keyResults: o.keyResults }))
      );
      await Promise.all(INITIAL_PROJECTS.map(({ id, ...rest }) => setDoc(doc(db, "projects", id), rest)));
      await Promise.all(ALL_TEMPLATES.map((t) => setDoc(doc(db, "templates", slugify(t.title)), t)));
      await setDoc(doc(db, "roadmap", "main"), { currentPhase: CURRENT_PROJECT_PHASE, gateChecks: {}, taskAssignments: {} });
      await Promise.all(INITIAL_EXCEPTIONS.map(({ id, ...rest }) => setDoc(doc(db, "exceptions", id), rest)));
    })();
  }, [user]);

  // Escucha en tiempo real los datos compartidos y el perfil/chat de este usuario.
  useEffect(() => {
    if (!user) return;

    const unsubs = [
      onSnapshot(doc(db, "company", "main"), (snap) => {
        if (snap.exists()) setCompanyInfo(snap.data());
      }),
      onSnapshot(collection(db, "okrs"), (snap) => setOkrCatalog(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "projects"), (snap) => setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "templates"), (snap) => setTemplatesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(doc(db, "roadmap", "main"), (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        setCurrentPhase(data.currentPhase || CURRENT_PROJECT_PHASE);
        setGateChecks(data.gateChecks || {});
        setTaskAssignments(data.taskAssignments || {});
      }),
      onSnapshot(collection(db, "exceptions"), (snap) => setExceptions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(doc(db, "roadmap", "lessonsLearned"), (snap) => setLessonsData(snap.exists() ? snap.data() : null)),
      onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) setProfile(snap.data());
      }),
      onSnapshot(doc(db, "users", user.uid, "chat", "history"), (snap) => {
        setMessages(snap.exists() ? snap.data().messages : INITIAL_MESSAGES);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [user]);

  // Primera vez que llega el perfil tras iniciar sesión: prepara el borrador y abre la sección por defecto de su rol.
  useEffect(() => {
    if (profile && !profileLoadedRef.current) {
      setProfileDraft(profile);
      const roleForView = ROLE_PERMISSIONS[profile.role] ? profile.role : "pm";
      setView(defaultViewForRole(roleForView));
      profileLoadedRef.current = true;
    }
  }, [profile]);

  // Elige un proyecto por defecto en Plantillas y Status Report en cuanto llegan los proyectos.
  useEffect(() => {
    if (projects.length === 0) return;
    if (!activeTemplateProjectId) setActiveTemplateProjectId(projects[0].id);
    if (!statusSelectedProjectId) setStatusSelectedProjectId(projects[0].id);
  }, [projects, activeTemplateProjectId, statusSelectedProjectId]);

  const role = profile && ROLE_PERMISSIONS[profile.role] ? profile.role : "pm";
  const permissions = ROLE_PERMISSIONS[role];
  const can = (section) => permissions.includes(section);
  const loggedIn = !!user && !!profile;

  function updateAuthField(field, value) {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    setAuthError("");
  }

  async function submitAuth() {
    setAuthError("");
    setAuthBusy(true);
    try {
      const email = authForm.email.trim();
      if (authMode === "signup") {
        const name = authForm.name.trim();
        const roleField = authForm.role || "pm";
        const cred = await createUserWithEmailAndPassword(auth, email, authForm.password);
        await setDoc(doc(db, "users", cred.user.uid), { name, email, role: roleField });
      } else {
        await signInWithEmailAndPassword(auth, email, authForm.password);
      }
      setAuthForm(INITIAL_AUTH_FORM);
    } catch (err) {
      setAuthError(authErrorMessage(err.code));
    } finally {
      setAuthBusy(false);
    }
  }

  function logout() {
    signOut(auth);
    setAuthMode("login");
  }

  function toggleStep(key) {
    setExpandedStepKey((prev) => (prev === key ? null : key));
  }

  function updateTaskMeta(key, patch) {
    const merged = { ...(taskAssignments[key] || {}), ...patch };
    updateDoc(doc(db, "roadmap", "main"), { [`taskAssignments.${key}`]: merged });
  }

  async function saveProfile() {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), profileDraft);
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

  async function sendMessage() {
    const text = chatInput.trim();
    if (!text || chatLoading || !user) return;
    const history = messages;
    const withUserMsg = [...history, { from: "user", text }];
    setChatInput("");
    setChatError("");
    setMessages(withUserMsg);
    setChatLoading(true);
    try {
      const reply = await askGemini(history, text);
      const finalHistory = [...withUserMsg, { from: "bot", text: reply }];
      setMessages(finalHistory);
      await setDoc(doc(db, "users", user.uid, "chat", "history"), { messages: finalHistory });
    } catch (err) {
      setChatError("No se pudo contactar con la IA. Inténtalo de nuevo en unos segundos.");
    } finally {
      setChatLoading(false);
    }
  }

  function updateCompanyField(field, value) {
    setDoc(doc(db, "company", "main"), { [field]: value }, { merge: true });
  }

  async function addOkr({ year, objective, keyResults }) {
    const id = `okr-${year}-${Date.now()}`;
    await setDoc(doc(db, "okrs", id), { year, objective, keyResults });
  }

  async function addProject({ name, methodology, sponsor, department, contributesTo }) {
    const id = `${slugify(name)}-${Date.now()}`;
    await setDoc(doc(db, "projects", id), {
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
    });
  }

  function toggleGateItem(index) {
    const updated = { ...(gateChecks[roadmapPhase] || {}), [index]: !(gateChecks[roadmapPhase] || {})[index] };
    updateDoc(doc(db, "roadmap", "main"), { [`gateChecks.${roadmapPhase}`]: updated });
  }

  const gateItemsForCurrentPhase = GATE_REQUIREMENTS[currentPhase] || [];
  const gateCheckedForCurrentPhase = gateChecks[currentPhase] || {};
  const canAdvance =
    gateItemsForCurrentPhase.length > 0 && gateItemsForCurrentPhase.every((_, i) => gateCheckedForCurrentPhase[i]);

  function advancePhase() {
    const next = nextPhase(currentPhase);
    if (!canAdvance || !next) return;
    updateDoc(doc(db, "roadmap", "main"), { currentPhase: next });
    setRoadmapPhase(next);
  }

  function updateExceptionField(field, value) {
    setExceptionForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addException() {
    if (!exceptionForm.motivo.trim() || !exceptionForm.autorizadoPor.trim()) return;
    await addDoc(collection(db, "exceptions"), {
      phase: ROADMAP_CONTENT[roadmapPhase]?.label || roadmapPhase,
      motivo: exceptionForm.motivo.trim(),
      autorizadoPor: exceptionForm.autorizadoPor.trim(),
      fecha: new Date().toISOString().slice(0, 10),
    });
    setExceptionForm(INITIAL_EXCEPTION_FORM);
  }

  function updateLessonsField(field, value) {
    setLessonsForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submitLessons() {
    if (!lessonsForm.queFunciono.trim() || !lessonsForm.queNoFunciono.trim() || !lessonsForm.recomendaciones.trim()) return;
    await setDoc(doc(db, "roadmap", "lessonsLearned"), { ...lessonsForm });
  }

  function migrateTemplate(templateId) {
    const tpl = templatesList.find((t) => t.id === templateId);
    if (!tpl) return;
    updateDoc(doc(db, "templates", templateId), { adoptedVersion: tpl.latestVersion });
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
  const report = STATUS_REPORTS[statusSelectedProject?.id] || STATUS_REPORTS[projects[0]?.id];

  return {
    auth: {
      authReady,
      loggedIn,
      mode: authMode,
      isSignup: authMode === "signup",
      form: authForm,
      error: authError,
      busy: authBusy,
      setMode: setAuthMode,
      updateField: updateAuthField,
      submit: submitAuth,
    },
    session: {
      role,
      roleLabel: ROLE_LABELS[role],
      profile: {
        name: profile?.name || "",
        email: profile?.email || "",
        firstName: getFirstName(profile?.name || ""),
        initials: getInitials(profile?.name || ""),
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
      lessonsSubmitted: !!lessonsData,
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
    chatbot: { messages, chatInput, setChatInput, sendMessage, loading: chatLoading, error: chatError },
    profile: {
      current: profile || { name: "", email: "" },
      draft: profileDraft,
      saved: profileSaved,
      initials: getInitials(profile?.name || ""),
      updateField: updateProfileDraft,
      save: saveProfile,
    },
  };
}
