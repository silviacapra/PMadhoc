import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc, updateDoc, addDoc, deleteDoc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { askGemini } from "../gemini";
import { ROLE_PERMISSIONS, ROLE_LABELS, defaultViewForRole } from "../data/roles";
import { PHASE_ORDER, ROADMAP_CONTENT } from "../data/roadmapContent";
import { GATE_REQUIREMENTS } from "../data/roadmapGates";
import { TEAM_MEMBERS, INITIAL_STAKEHOLDERS } from "../data/team";
import { PHASE_FILTER_DEFS, METHODOLOGY_FILTER_DEFS, TYPE_FILTER_DEFS, ALL_TEMPLATES } from "../data/templates";
import { INITIAL_PROJECTS } from "../data/projects";
import { STATUS_REPORTS } from "../data/statusReport";
import { KB_CATEGORIES, ARTICLES } from "../data/knowledge";
import { INITIAL_MESSAGES } from "../data/chatbot";
import { INITIAL_COMPANY, INITIAL_OKR_CATALOG } from "../data/company";
import { getInitials, getFirstName } from "../utils/text";
import {
  buildPhases,
  buildRoadmapSteps,
  buildDocumentacionGroups,
  buildInitialTaskAssignments,
  getCurrentTaskStatus,
  nextPhase,
  phaseLabelToKey,
} from "../utils/roadmap";
import { filterTemplates } from "../utils/templates";
import { riskLevel, slugify } from "../utils/projects";

const INITIAL_AUTH_FORM = { name: "", email: "", password: "", role: "pm" };
const INITIAL_PASSWORD_FORM = { current: "", next: "", confirm: "" };
const INITIAL_REGISTRY_FORM = { desc: "", impact: "medio", owner: "", status: "" };
const INITIAL_LECCION_FORM = { texto: "" };
const DEFAULT_REPORT_CATEGORIES = [
  { label: "Alcance", status: "onTrack", note: "" },
  { label: "Cronograma", status: "onTrack", note: "" },
  { label: "Presupuesto", status: "onTrack", note: "" },
  { label: "Equipo", status: "onTrack", note: "" },
];

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Ese correo ya está registrado. Prueba a iniciar sesión.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No existe ninguna cuenta con ese correo.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento y vuelve a intentarlo.",
  "auth/requires-recent-login": "Por seguridad, vuelve a iniciar sesión antes de cambiar la contraseña.",
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
  const [resetSent, setResetSent] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");

  const [view, setView] = useState("dashboard");

  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", email: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const profileLoadedRef = useRef(false);
  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  const [templateFilterPhase, setTemplateFilterPhase] = useState("todas");
  const [templateFilterMethodology, setTemplateFilterMethodology] = useState("todas");
  const [templateFilterSostenible, setTemplateFilterSostenible] = useState(false);
  const [templateFilterDisponible, setTemplateFilterDisponible] = useState(false);
  const [templateFilterTipo, setTemplateFilterTipo] = useState("todos");
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [addTemplateOpen, setAddTemplateOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [companyInfo, setCompanyInfo] = useState(INITIAL_COMPANY);
  const [okrCatalog, setOkrCatalog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);

  // Ficha de proyecto: qué proyecto y qué pestaña se está viendo ahora mismo.
  const [fichaProjectId, setFichaProjectId] = useState(null);
  const [fichaTab, setFichaTab] = useState("roadmap");

  // Roadmap propio del proyecto abierto en la ficha.
  const [fichaRoadmapPhase, setFichaRoadmapPhase] = useState(null);
  const [fichaCurrentPhase, setFichaCurrentPhase] = useState(null);
  const [fichaGateChecks, setFichaGateChecks] = useState({});
  const [fichaTaskAssignments, setFichaTaskAssignments] = useState({});
  const [fichaExpandedStepKey, setFichaExpandedStepKey] = useState(null);

  const [stakeholders, setStakeholders] = useState([]);

  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const [sponsorFilter, setSponsorFilter] = useState("todos");
  const [departmentFilter, setDepartmentFilter] = useState("todos");
  const [riskFilter, setRiskFilter] = useState("todos");
  const [statusSelectedProjectId, setStatusSelectedProjectId] = useState("");
  const [statusReportDoc, setStatusReportDoc] = useState(null);
  const [statusRoadmapData, setStatusRoadmapData] = useState(null);

  const [riesgosSelectedProjectId, setRiesgosSelectedProjectId] = useState("");
  const [riesgosItems, setRiesgosItems] = useState([]);
  const [riesgosForm, setRiesgosForm] = useState(INITIAL_REGISTRY_FORM);

  const [leccionesSelectedProjectId, setLeccionesSelectedProjectId] = useState("");
  const [leccionesItems, setLeccionesItems] = useState([]);
  const [leccionesForm, setLeccionesForm] = useState(INITIAL_LECCION_FORM);

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
      await Promise.all(INITIAL_STAKEHOLDERS.map(({ id, ...rest }) => setDoc(doc(db, "stakeholders", id), rest)));
    })();
  }, [user]);

  // Pone al día las plantillas: crea las que falten, y sincroniza si están disponibles
  // (solo si hay un archivo real en /plantillas) sin tocar el historial de versiones.
  useEffect(() => {
    if (!user) return;
    (async () => {
      for (const t of ALL_TEMPLATES) {
        const id = slugify(t.title);
        const snap = await getDoc(doc(db, "templates", id));
        if (!snap.exists()) {
          await setDoc(doc(db, "templates", id), t);
        } else {
          const data = snap.data();
          if (data.disponible !== t.disponible || data.sostenible !== t.sostenible || data.file !== t.file || data.tipo !== t.tipo) {
            await updateDoc(doc(db, "templates", id), {
              disponible: t.disponible,
              sostenible: t.sostenible,
              file: t.file,
              tipo: t.tipo,
            });
          }
        }
      }
    })();
  }, [user]);

  // Crea los stakeholders que falten (por si la base de datos ya existía de antes).
  useEffect(() => {
    if (!user) return;
    (async () => {
      for (const s of INITIAL_STAKEHOLDERS) {
        const { id, ...rest } = s;
        const snap = await getDoc(doc(db, "stakeholders", id));
        if (!snap.exists()) await setDoc(doc(db, "stakeholders", id), rest);
      }
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
      onSnapshot(collection(db, "stakeholders"), (snap) => setStakeholders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
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

  // Elige un proyecto por defecto en Status Report, Riesgos y Lecciones en cuanto llegan los proyectos.
  useEffect(() => {
    if (projects.length === 0) return;
    if (!statusSelectedProjectId) setStatusSelectedProjectId(projects[0].id);
    if (!riesgosSelectedProjectId) setRiesgosSelectedProjectId(projects[0].id);
    if (!leccionesSelectedProjectId) setLeccionesSelectedProjectId(projects[0].id);
  }, [projects, statusSelectedProjectId, riesgosSelectedProjectId, leccionesSelectedProjectId]);

  // Informe de estado y roadmap (para los datos automáticos) del proyecto elegido en Status Report.
  useEffect(() => {
    if (!user || !statusSelectedProjectId) return;
    const unsubs = [
      onSnapshot(doc(db, "projects", statusSelectedProjectId, "statusReport", "main"), (snap) => {
        setStatusReportDoc(snap.exists() ? snap.data() : null);
      }),
      onSnapshot(doc(db, "projects", statusSelectedProjectId, "roadmap", "main"), (snap) => {
        setStatusRoadmapData(snap.exists() ? snap.data() : null);
      }),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, [user, statusSelectedProjectId]);

  // Registro de riesgos del proyecto elegido.
  useEffect(() => {
    if (!user || !riesgosSelectedProjectId) return;
    const unsub = onSnapshot(collection(db, "projects", riesgosSelectedProjectId, "riesgos"), (snap) =>
      setRiesgosItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user, riesgosSelectedProjectId]);

  // Lecciones aprendidas del proyecto elegido.
  useEffect(() => {
    if (!user || !leccionesSelectedProjectId) return;
    const unsub = onSnapshot(collection(db, "projects", leccionesSelectedProjectId, "lecciones"), (snap) =>
      setLeccionesItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user, leccionesSelectedProjectId]);

  // Al abrir la ficha de un proyecto: si es la primera vez, crea su roadmap con la fase
  // que ya tenía el proyecto; luego escucha en tiempo real su roadmap.
  useEffect(() => {
    if (!user || !fichaProjectId) return;

    (async () => {
      const roadmapRef = doc(db, "projects", fichaProjectId, "roadmap", "main");
      const snap = await getDoc(roadmapRef);
      if (!snap.exists()) {
        const project = projects.find((p) => p.id === fichaProjectId);
        await setDoc(roadmapRef, {
          currentPhase: phaseLabelToKey(project?.phase),
          gateChecks: {},
          taskAssignments: buildInitialTaskAssignments(),
        });
      }
    })();

    const unsub = onSnapshot(doc(db, "projects", fichaProjectId, "roadmap", "main"), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setFichaCurrentPhase(data.currentPhase || "preproyecto");
      setFichaGateChecks(data.gateChecks || {});
      setFichaTaskAssignments(data.taskAssignments || {});
      setFichaRoadmapPhase((prev) => prev || data.currentPhase || "preproyecto");
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fichaProjectId]);

  const role = profile && ROLE_PERMISSIONS[profile.role] ? profile.role : "pm";
  const permissions = ROLE_PERMISSIONS[role];
  const can = (section) => permissions.includes(section);
  const loggedIn = !!user && !!profile;

  function updateAuthField(field, value) {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    setAuthError("");
  }

  function changeAuthMode(mode) {
    setAuthMode(mode);
    setAuthError("");
    setResetSent(false);
    setResetError("");
  }

  async function sendPasswordReset() {
    const email = authForm.email.trim();
    if (!email) {
      setResetError("Escribe tu correo electrónico primero.");
      return;
    }
    setResetError("");
    setResetBusy(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setResetError(authErrorMessage(err.code));
    } finally {
      setResetBusy(false);
    }
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

  function openFicha(projectId, tab = "roadmap") {
    setFichaProjectId(projectId);
    setFichaTab(tab);
    setFichaRoadmapPhase(null);
    setFichaExpandedStepKey(null);
  }

  function closeFicha() {
    setFichaProjectId(null);
  }

  function toggleFichaStep(key) {
    setFichaExpandedStepKey((prev) => (prev === key ? null : key));
  }

  function updateFichaTaskMeta(key, patch) {
    const updates = {};
    Object.entries(patch).forEach(([field, value]) => {
      updates[`taskAssignments.${key}.${field}`] = value;
    });
    updateDoc(doc(db, "projects", fichaProjectId, "roadmap", "main"), updates);
  }

  function updateStepOutput(key, outputIndex, patch) {
    const updates = {};
    Object.entries(patch).forEach(([field, value]) => {
      updates[`taskAssignments.${key}.outputs.${outputIndex}.${field}`] = value;
    });
    updateDoc(doc(db, "projects", fichaProjectId, "roadmap", "main"), updates);
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

  function updatePasswordField(field, value) {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
    setPasswordSuccess(false);
  }

  async function changePassword() {
    if (!user) return;
    if (passwordForm.next.length < 6) {
      setPasswordError("La contraseña nueva debe tener al menos 6 caracteres.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("Las dos contraseñas nuevas no coinciden.");
      return;
    }
    setPasswordBusy(true);
    setPasswordError("");
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordForm.current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordForm.next);
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(authErrorMessage(err.code));
    } finally {
      setPasswordBusy(false);
    }
  }

  function pickPhaseFilter(phaseId) {
    setTemplateFilterPhase(phaseId);
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

  async function updateOkr(id, { objective, keyResults }) {
    await updateDoc(doc(db, "okrs", id), { objective, keyResults });
  }

  async function deleteOkr(id) {
    await deleteDoc(doc(db, "okrs", id));
  }

  async function addProject({ name, methodology, sponsor, pm, department, contributesTo, deadline, hitos, budget }) {
    const id = `${slugify(name)}-${Date.now()}`;
    let daysLeft = 90;
    if (deadline) {
      const diffMs = new Date(deadline).getTime() - Date.now();
      daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    await setDoc(doc(db, "projects", id), {
      name,
      phase: "Pre-proyecto",
      progress: 0,
      daysLeft,
      risks: 0,
      status: "onTrack",
      methodology,
      sponsor,
      pm,
      department,
      contributesTo,
      deadline: deadline || "",
      hitos: hitos || "",
      budgetTotal: Number(budget) || 0,
      budgetSpent: 0,
    });
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function updateRiesgoField(field, value) {
    setRiesgosForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addRiesgo() {
    if (!riesgosForm.desc.trim() || !riesgosSelectedProjectId) return;
    await addDoc(collection(db, "projects", riesgosSelectedProjectId, "riesgos"), {
      ...riesgosForm,
      desc: riesgosForm.desc.trim(),
      fecha: todayStr(),
    });
    setRiesgosForm(INITIAL_REGISTRY_FORM);
  }

  function updateLeccionField(field, value) {
    setLeccionesForm((prev) => ({ ...prev, [field]: value }));
  }

  async function addLeccion() {
    if (!leccionesForm.texto.trim() || !leccionesSelectedProjectId) return;
    await addDoc(collection(db, "projects", leccionesSelectedProjectId, "lecciones"), {
      texto: leccionesForm.texto.trim(),
      autor: profile?.name || "Usuario",
      fecha: todayStr(),
    });
    setLeccionesForm(INITIAL_LECCION_FORM);
  }

  function openRiesgos(projectId) {
    setRiesgosSelectedProjectId(projectId);
    setView("riesgos");
  }

  function openLecciones(projectId) {
    setLeccionesSelectedProjectId(projectId);
    setView("lecciones");
  }

  function updateStatusReportField(field, value) {
    setDoc(doc(db, "projects", statusSelectedProjectId, "statusReport", "main"), { [field]: value }, { merge: true });
  }

  function updateStatusReportCategory(index, patch) {
    const current = statusReportDoc?.categories || STATUS_REPORTS[statusSelectedProjectId]?.categories || DEFAULT_REPORT_CATEGORIES;
    const updated = current.map((c, i) => (i === index ? { ...c, ...patch } : c));
    updateStatusReportField("categories", updated);
  }

  function toggleFichaGateItem(index) {
    const updated = { ...(fichaGateChecks[fichaRoadmapPhase] || {}), [index]: !(fichaGateChecks[fichaRoadmapPhase] || {})[index] };
    updateDoc(doc(db, "projects", fichaProjectId, "roadmap", "main"), { [`gateChecks.${fichaRoadmapPhase}`]: updated });
  }

  const fichaGateItemsForCurrentPhase = GATE_REQUIREMENTS[fichaCurrentPhase] || [];
  const fichaGateCheckedForCurrentPhase = fichaGateChecks[fichaCurrentPhase] || {};
  const fichaCanAdvance =
    fichaGateItemsForCurrentPhase.length > 0 && fichaGateItemsForCurrentPhase.every((_, i) => fichaGateCheckedForCurrentPhase[i]);

  function advanceFichaPhase() {
    const next = nextPhase(fichaCurrentPhase);
    if (!fichaCanAdvance || !next) return;
    updateDoc(doc(db, "projects", fichaProjectId, "roadmap", "main"), { currentPhase: next });
    updateDoc(doc(db, "projects", fichaProjectId), { phase: ROADMAP_CONTENT[next].label });
    setFichaRoadmapPhase(next);
  }

  async function updateStakeholder(id, patch) {
    await updateDoc(doc(db, "stakeholders", id), patch);
  }

  async function deleteProject(id) {
    await deleteDoc(doc(db, "projects", id));
    setDeleteProjectId(null);
    if (fichaProjectId === id) closeFicha();
  }

  async function addTemplate({ title, desc, tipo, category, format, phase, methodologies, file }) {
    await addDoc(collection(db, "templates"), {
      title,
      desc,
      tipo,
      category,
      format,
      phase,
      methodologies,
      sostenible: false,
      disponible: !!file,
      file: file || null,
    });
    setAddTemplateOpen(false);
  }

  const filteredTemplates = filterTemplates(
    templatesList,
    templateFilterPhase,
    templateFilterMethodology,
    templateFilterSostenible,
    templateFilterDisponible,
    templateFilterTipo,
    templateSearchQuery
  );

  const filteredPortfolio = projects.filter((p) => {
    const matchesSponsor = sponsorFilter === "todos" || p.sponsor === sponsorFilter;
    const matchesDept = departmentFilter === "todos" || p.department === departmentFilter;
    const matchesRisk = riskFilter === "todos" || riskLevel(p.risks) === riskFilter;
    return matchesSponsor && matchesDept && matchesRisk;
  });

  const statusSelectedProject = projects.find((p) => p.id === statusSelectedProjectId) || projects[0];
  const seedReport = STATUS_REPORTS[statusSelectedProject?.id];
  const currentTask = getCurrentTaskStatus(
    statusRoadmapData?.currentPhase || phaseLabelToKey(statusSelectedProject?.phase),
    statusRoadmapData?.taskAssignments || {}
  );
  const budgetTotal = statusSelectedProject?.budgetTotal || 0;
  const budgetSpent = statusReportDoc?.budgetSpent ?? statusSelectedProject?.budgetSpent ?? 0;
  const report = {
    projectName: statusSelectedProject?.name || "",
    period: statusReportDoc?.period ?? seedReport?.period ?? "Este mes",
    preparedBy: statusReportDoc?.preparedBy ?? seedReport?.preparedBy ?? profile?.name ?? "",
    overallStatus: statusReportDoc?.overallStatus ?? seedReport?.overallStatus ?? statusSelectedProject?.status ?? "onTrack",
    categories: statusReportDoc?.categories ?? seedReport?.categories ?? DEFAULT_REPORT_CATEGORIES,
    achievements: statusReportDoc?.achievements ?? seedReport?.achievements ?? [],
    nextSteps: statusReportDoc?.nextSteps ?? seedReport?.nextSteps ?? [],
    budgetTotal,
    budgetSpent,
    budgetPct: budgetTotal > 0 ? Math.round((budgetSpent / budgetTotal) * 100) : 0,
    currentPhaseLabel: statusSelectedProject?.phase || "",
    currentTask,
  };

  return {
    auth: {
      authReady,
      loggedIn,
      mode: authMode,
      isSignup: authMode === "signup",
      isReset: authMode === "reset",
      form: authForm,
      error: authError,
      busy: authBusy,
      setMode: changeAuthMode,
      updateField: updateAuthField,
      submit: submitAuth,
      resetSent,
      resetBusy,
      resetError,
      sendPasswordReset,
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
      canRiesgos: can("riesgos"),
      canLecciones: can("lecciones"),
      canChatbot: can("chatbot"),
      canStatusReport: can("statusreport"),
      canStakeholders: can("stakeholders"),
    },
    nav: { view, setView },
    dashboard: {
      projects,
      addProject,
      okrCatalog,
      openFicha,
      deleteProjectId,
      setDeleteProjectId,
      deleteProject,
    },
    company: {
      info: companyInfo,
      updateField: updateCompanyField,
    },
    okr: {
      catalog: okrCatalog,
      addOkr,
      updateOkr,
      deleteOkr,
    },
    ficha: {
      projects,
      projectId: fichaProjectId,
      setProjectId: openFicha,
      closeFicha,
      tab: fichaTab,
      setTab: setFichaTab,
      openRiesgos,
      openLecciones,
      roadmap: {
        phases: buildPhases(fichaRoadmapPhase || fichaCurrentPhase || "preproyecto", fichaCurrentPhase || "preproyecto"),
        steps: buildRoadmapSteps(fichaRoadmapPhase || fichaCurrentPhase || "preproyecto", fichaTaskAssignments, fichaExpandedStepKey),
        selectedPhase: fichaRoadmapPhase || fichaCurrentPhase || "preproyecto",
        isCurrentPhase: (fichaRoadmapPhase || fichaCurrentPhase) === fichaCurrentPhase,
        isLastPhase: (fichaRoadmapPhase || fichaCurrentPhase) === PHASE_ORDER[PHASE_ORDER.length - 1],
        selectPhase: setFichaRoadmapPhase,
        toggleStep: toggleFichaStep,
        updateTaskMeta: updateFichaTaskMeta,
        updateStepOutput,
        teamMembers: TEAM_MEMBERS,
        gateItems: GATE_REQUIREMENTS[fichaRoadmapPhase || fichaCurrentPhase] || [],
        gateChecked: fichaGateChecks[fichaRoadmapPhase || fichaCurrentPhase] || {},
        toggleGateItem: toggleFichaGateItem,
        canAdvance: fichaCanAdvance,
        advancePhase: advanceFichaPhase,
      },
      documentacion: { groups: buildDocumentacionGroups(fichaTaskAssignments) },
    },
    stakeholders,
    updateStakeholder,
    templates: {
      phaseFilters: PHASE_FILTER_DEFS,
      methodologyFilters: METHODOLOGY_FILTER_DEFS,
      typeFilters: TYPE_FILTER_DEFS,
      activePhaseFilter: templateFilterPhase,
      activeMethodologyFilter: templateFilterMethodology,
      activeTypeFilter: templateFilterTipo,
      sostenibleOnly: templateFilterSostenible,
      disponibleOnly: templateFilterDisponible,
      searchQuery: templateSearchQuery,
      filteredTemplates,
      pickPhaseFilter,
      setMethodologyFilter: setTemplateFilterMethodology,
      setTypeFilter: setTemplateFilterTipo,
      setSostenibleOnly: setTemplateFilterSostenible,
      setDisponibleOnly: setTemplateFilterDisponible,
      setSearchQuery: setTemplateSearchQuery,
      addTemplateOpen,
      setAddTemplateOpen,
      addTemplate,
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
      updateOverallStatus: (status) => updateStatusReportField("overallStatus", status),
      updateCategory: updateStatusReportCategory,
      updateAchievements: (lines) => updateStatusReportField("achievements", lines),
      updateNextSteps: (lines) => updateStatusReportField("nextSteps", lines),
      updateBudgetSpent: (value) => updateStatusReportField("budgetSpent", Number(value) || 0),
      goToRiesgos: () => openRiesgos(statusSelectedProject?.id),
      goToLecciones: () => openLecciones(statusSelectedProject?.id),
    },
    riesgos: {
      projects,
      selectedProjectId: riesgosSelectedProjectId,
      setSelectedProjectId: setRiesgosSelectedProjectId,
      items: riesgosItems,
      form: riesgosForm,
      updateField: updateRiesgoField,
      add: addRiesgo,
    },
    lecciones: {
      projects,
      selectedProjectId: leccionesSelectedProjectId,
      setSelectedProjectId: setLeccionesSelectedProjectId,
      items: leccionesItems,
      form: leccionesForm,
      updateField: updateLeccionField,
      add: addLeccion,
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
      passwordForm,
      passwordError,
      passwordSuccess,
      passwordBusy,
      updatePasswordField,
      changePassword,
    },
  };
}
