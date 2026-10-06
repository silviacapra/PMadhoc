import { useState } from "react";
import { CheckIcon } from "../icons/Icons";
import Confetti from "../shared/Confetti";
import { FAMILIAS, TIPOS_POR_FAMILIA, STEPS, QUESTIONS, RESULTS, TIPOS_ELEGIBLES } from "../../data/projectOnboarding";
import "./NewProjectOnboarding.css";

const BLANK_PROJECT_INFO = { nombre: "", pm: "", sponsor: "", departamento: "", fecha: "", presupuesto: "" };
const BLANK_ANSWERS = {};

function familiaLabel(familia) {
  return (FAMILIAS.find((f) => f.v === familia) || {}).t || "";
}

function tipoProyectoLabels(answers) {
  const lista = TIPOS_POR_FAMILIA[answers.familia] || [];
  const elegidos = Array.isArray(answers.tipo_proyecto) ? answers.tipo_proyecto : [];
  return elegidos.map((v) => (lista.find((t) => t.v === v) || {}).t).filter(Boolean);
}

function nextStepId(current, answers) {
  if (current === "familia") return "tipo_proyecto";
  if (current === "tipo_proyecto") return "tamano";
  if (current === "tamano") return "patrocinio";
  if (current === "patrocinio") return answers.patrocinio === "ninguno" ? "RESULT" : "financiacion";
  if (current === "financiacion") return "camino";
  if (current === "camino") return "fecha";
  if (current === "fecha") return "interesados";
  if (current === "interesados") return "RESULT";
  return "RESULT";
}

function computeResult(answers) {
  if (answers.patrocinio === "ninguno") return { tipo: "sin_patrocinador" };
  const fechaFija = answers.fecha === "si";
  const gobiernoLabels = ["ligero", "medio", "alto"];
  let nivel = answers.interesados === "a" ? 0 : answers.interesados === "b" ? 1 : 2;
  const gobiernoSubido = answers.patrocinio === "poco" && nivel < 2;
  if (gobiernoSubido) nivel += 1;
  return {
    tipo: answers.camino,
    fechaFija,
    gobierno: gobiernoLabels[nivel],
    gobiernoSubido,
    faseInicio: answers.financiacion === "aprobado" ? "Iniciar" : "Pre-proyecto",
    familiaLabel: familiaLabel(answers.familia),
    tipoProyectoLabels: tipoProyectoLabels(answers),
  };
}

export default function NewProjectOnboarding({ open, onClose, sponsors, pms, departments, okrCatalog, onCreate }) {
  const [step, setStep] = useState(STEPS[0]);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState(BLANK_ANSWERS);
  const [activeConfig, setActiveConfig] = useState(null);
  const [manualPicked, setManualPicked] = useState(null);
  const [projectInfo, setProjectInfo] = useState(BLANK_PROJECT_INFO);
  const [selectedOkrIds, setSelectedOkrIds] = useState([]);
  const [formError, setFormError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const [confettiFire, setConfettiFire] = useState(0);
  const [createdProject, setCreatedProject] = useState(null);

  function resetAll() {
    setStep(STEPS[0]);
    setHistory([]);
    setAnswers(BLANK_ANSWERS);
    setActiveConfig(null);
    setManualPicked(null);
    setProjectInfo(BLANK_PROJECT_INFO);
    setSelectedOkrIds([]);
    setFormError("");
    setConfirmClose(false);
    setCreatedProject(null);
  }

  if (!open) return null;

  function goTo(next) {
    setHistory((h) => [...h, step]);
    setStep(next);
  }

  function goBack() {
    setHistory((h) => {
      if (h.length === 0) return h;
      setStep(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }

  function handleAnswer(stepId, value) {
    setAnswers((prev) => {
      const next = { ...prev, [stepId]: value };
      if (stepId === "familia") delete next.tipo_proyecto;
      return next;
    });
  }

  function handleContinue() {
    const nxt = nextStepId(step, answers);
    if (nxt === "RESULT") {
      setActiveConfig(computeResult(answers));
      goTo("result");
      return;
    }
    goTo(nxt);
  }

  function handleRequestClose() {
    if (step === "done") {
      finishClose();
    } else {
      setConfirmClose(true);
    }
  }

  function finishClose() {
    setConfirmClose(false);
    onClose();
    resetAll();
  }

  function handleRestart() {
    setAnswers(BLANK_ANSWERS);
    setActiveConfig(null);
    setManualPicked(null);
    setProjectInfo(BLANK_PROJECT_INFO);
    setSelectedOkrIds([]);
    setFormError("");
    setCreatedProject(null);
    setHistory([]);
    setStep(STEPS[0]);
  }

  function toggleOkr(id) {
    setSelectedOkrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleGoManual() {
    const preset = activeConfig || { tipo: null, fechaFija: false, gobierno: "ligero", faseInicio: "Pre-proyecto" };
    setManualPicked({ tipo: preset.tipo, fechaFija: preset.fechaFija, gobierno: preset.gobierno, faseInicio: preset.faseInicio });
    goTo("manual");
  }

  function handleManualContinue() {
    setActiveConfig({
      tipo: manualPicked.tipo,
      fechaFija: manualPicked.fechaFija,
      gobierno: manualPicked.gobierno,
      faseInicio: manualPicked.faseInicio,
      familiaLabel: familiaLabel(answers.familia),
      tipoProyectoLabels: tipoProyectoLabels(answers),
    });
    goTo("form");
  }

  function handleSubmitForm() {
    const missing = [];
    if (!projectInfo.nombre.trim()) missing.push("nombre");
    if (!projectInfo.pm) missing.push("gestor/a del proyecto");
    if (!projectInfo.sponsor) missing.push("patrocinador/a");
    if (selectedOkrIds.length === 0) missing.push("al menos un objetivo estratégico (KPI)");
    if (missing.length > 0) {
      setFormError(`Faltan campos obligatorios: ${missing.join(", ")}.`);
      return;
    }
    setFormError("");
    const payload = {
      name: projectInfo.nombre.trim(),
      pm: projectInfo.pm,
      sponsor: projectInfo.sponsor,
      department: projectInfo.departamento,
      deadline: projectInfo.fecha,
      budget: projectInfo.presupuesto,
      contributesTo: selectedOkrIds,
      phase: activeConfig.faseInicio,
    };
    onCreate(payload);
    setCreatedProject(payload);
    setConfettiFire((n) => n + 1);
    goTo("done");
  }

  const progressPct = ["result", "manual", "form", "done"].includes(step)
    ? 100
    : (STEPS.indexOf(step) / STEPS.length) * 100;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-shell">
        <header className="onboarding-top">
          <div className="onboarding-top-row">
            <button
              className={`onboarding-icon-btn ${history.length > 0 ? "show" : ""}`}
              title="Atrás"
              aria-label="Atrás"
              onClick={goBack}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="onboarding-eyebrow">Nuevo proyecto · onboarding</span>
            <button className="onboarding-icon-btn onboarding-icon-btn--close" title="Cerrar" aria-label="Cerrar" onClick={handleRequestClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="onboarding-track">
            <i style={{ width: `${progressPct}%` }} />
          </div>
        </header>

        <main className="onboarding-main">
          {STEPS.includes(step) && (
            <QuestionStep stepId={step} answers={answers} onAnswer={handleAnswer} onContinue={handleContinue} />
          )}
          {step === "result" && (
            <ResultStep
              config={activeConfig}
              onCreateFromResult={() => goTo("form")}
              onGoManual={handleGoManual}
              onRestart={handleRestart}
            />
          )}
          {step === "manual" && (
            <ManualStep picked={manualPicked} setPicked={setManualPicked} onContinue={handleManualContinue} />
          )}
          {step === "form" && (
            <FormStep
              config={activeConfig}
              projectInfo={projectInfo}
              setProjectInfo={setProjectInfo}
              pms={pms}
              sponsors={sponsors}
              departments={departments}
              okrCatalog={okrCatalog}
              selectedOkrIds={selectedOkrIds}
              onToggleOkr={toggleOkr}
              error={formError}
              onChangeConfig={handleGoManual}
              onSubmit={handleSubmitForm}
            />
          )}
          {step === "done" && <DoneStep config={activeConfig} projectInfo={createdProject || projectInfo} onRestart={handleRestart} onClose={finishClose} />}
        </main>
      </div>

      {confirmClose && (
        <div className="onboarding-confirm-overlay">
          <div className="onboarding-confirm-card">
            <p>¿Estás seguro de que quieres cerrar el onboarding? Se perderá lo que has rellenado.</p>
            <div className="onboarding-confirm-row">
              <button className="onboarding-confirm-cancel" onClick={() => setConfirmClose(false)}>
                Seguir aquí
              </button>
              <button className="onboarding-confirm-ok" onClick={finishClose}>
                Cerrar onboarding
              </button>
            </div>
          </div>
        </div>
      )}
      <Confetti fire={confettiFire} />
    </div>
  );
}

function QuestionStep({ stepId, answers, onAnswer, onContinue }) {
  const cfg = QUESTIONS[stepId];
  const q = typeof cfg.q === "function" ? cfg.q(answers) : cfg.q;
  const opts = typeof cfg.opts === "function" ? cfg.opts(answers) : cfg.opts;
  const max = cfg.max || 5;

  if (cfg.multi) {
    const selected = Array.isArray(answers[stepId]) ? answers[stepId] : [];
    function toggle(v) {
      const pos = selected.indexOf(v);
      let next;
      if (pos >= 0) {
        next = selected.filter((x) => x !== v);
      } else {
        if (selected.length >= max) return;
        next = [...selected, v];
      }
      onAnswer(stepId, next);
    }
    return (
      <div>
        <h1 className="onboarding-question">{q}</h1>
        <p className="onboarding-subhead">
          Elige hasta {max} · {selected.length}/{max}
        </p>
        <div className="onboarding-options">
          {opts.map((o) => {
            const picked = selected.includes(o.v);
            return (
              <button
                key={o.v}
                className={`onboarding-opt onboarding-opt-multi ${picked ? "onboarding-opt--picked" : ""}`}
                onClick={() => toggle(o.v)}
              >
                <span className="onboarding-chk">{picked && <CheckIcon size={12} color="#FFFFFF" />}</span>
                <span className="onboarding-opt-label">
                  {o.t}
                  {o.d && <span className="d">{o.d}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <div className="onboarding-aside">
          <p>{cfg.aside}</p>
        </div>
        <button className="onboarding-cta" disabled={selected.length === 0} onClick={onContinue}>
          Continuar
        </button>
      </div>
    );
  }

  const current = answers[stepId];
  return (
    <div>
      <h1 className="onboarding-question">{q}</h1>
      {cfg.disclaimer && <p className="onboarding-subhead">{cfg.disclaimer}</p>}
      <div className="onboarding-options">
        {opts.map((o) => {
          const picked = current === o.v;
          return (
            <button
              key={o.v}
              className={`onboarding-opt ${picked ? "onboarding-opt--picked" : ""}`}
              onClick={() => onAnswer(stepId, o.v)}
            >
              {o.t}
              {o.d && <span className="d">{o.d}</span>}
            </button>
          );
        })}
      </div>
      {current && (
        <div className="onboarding-aside">
          <p>{cfg.aside}</p>
        </div>
      )}
      <button className="onboarding-cta" disabled={!current} onClick={onContinue}>
        Continuar
      </button>
    </div>
  );
}

function ResultStep({ config, onCreateFromResult, onGoManual, onRestart }) {
  const data = RESULTS[config.tipo];
  const isWarn = !!data.warn;
  const flags = [];
  if (!isWarn) {
    flags.push(`industria: ${config.familiaLabel}`);
    flags.push(`arranca en: ${config.faseInicio}`);
    flags.push(`gobierno: ${config.gobierno}`);
    flags.push(`fecha fija: ${config.fechaFija ? "sí" : "no"}`);
  }
  const faseNota =
    config.faseInicio === "Pre-proyecto"
      ? 'Empieza en la fase "Pre-proyecto": primero hay que cerrar el caso de negocio, antes de comprometer nada.'
      : 'Se salta "Pre-proyecto" y arranca directo en "Iniciar": el presupuesto ya está resuelto, no hace falta justificarlo otra vez.';
  const gobiernoNota = config.gobiernoSubido
    ? "El gobierno sube un escalón respecto a lo que diría solo el número de interesados, porque el patrocinador/a tiene poca disponibilidad para decidir en caliente."
    : null;
  const configFull = isWarn ? data.config : [faseNota, ...data.config, ...(gobiernoNota ? [gobiernoNota] : [])];

  return (
    <div>
      <div className={`onboarding-result-kicker ${isWarn ? "onboarding-result-kicker--warn" : ""}`}>{data.kicker}</div>
      <h1 className={`onboarding-result-title ${isWarn ? "onboarding-result-title--warn" : ""}`}>{data.title}</h1>
      <p className="onboarding-result-why">{data.why}</p>
      {flags.length > 0 && (
        <div className="onboarding-flags">
          {flags.map((f) => (
            <span key={f} className="onboarding-flag">
              {f}
            </span>
          ))}
        </div>
      )}
      <ul className="onboarding-config-list">
        {configFull.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {!isWarn && (
        <>
          <button className="onboarding-cta" onClick={onCreateFromResult} disabled={config.tipo !== "e2e"}>
            Crear proyecto con esta configuración{config.tipo !== "e2e" ? " (Coming soon)" : ""}
          </button>
          <button className="onboarding-cta-secondary" onClick={onGoManual}>
            Elegir las características yo mismo/a
          </button>
        </>
      )}
      <div style={{ marginTop: 14 }}>
        <button className="onboarding-ghost-link" onClick={onRestart}>
          Empezar otro onboarding
        </button>
      </div>
    </div>
  );
}

function ManualStep({ picked, setPicked, onContinue }) {
  function set(field, value) {
    setPicked((prev) => ({ ...prev, [field]: value }));
  }
  return (
    <div>
      <h1 className="onboarding-question">Elige tú las características</h1>
      <p className="onboarding-subhead">
        No hace falta que sigas el diagnóstico. Decide cómo quieres configurar este proyecto, con toda la información necesaria.
      </p>
      <div className="onboarding-micro-label">Enfoque de gestión</div>
      <div className="onboarding-options">
        {TIPOS_ELEGIBLES.map((t) => (
          <button
            key={t}
            className={`onboarding-opt ${picked.tipo === t ? "onboarding-opt--picked" : ""}`}
            onClick={() => set("tipo", t)}
          >
            {RESULTS[t].title}
            <span className="d">{RESULTS[t].why}</span>
          </button>
        ))}
      </div>

      <div className="onboarding-micro-label">Fase de arranque</div>
      <div className="onboarding-pill-group">
        {["Pre-proyecto", "Iniciar"].map((v) => (
          <button
            key={v}
            className={`onboarding-pill ${picked.faseInicio === v ? "onboarding-pill--picked" : ""}`}
            onClick={() => set("faseInicio", v)}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="onboarding-micro-label">¿Fecha fija?</div>
      <div className="onboarding-pill-group">
        <button className={`onboarding-pill ${!picked.fechaFija ? "onboarding-pill--picked" : ""}`} onClick={() => set("fechaFija", false)}>
          No, hay margen
        </button>
        <button className={`onboarding-pill ${picked.fechaFija ? "onboarding-pill--picked" : ""}`} onClick={() => set("fechaFija", true)}>
          Sí, es innegociable
        </button>
      </div>

      <div className="onboarding-micro-label">Nivel de gobierno</div>
      <div className="onboarding-pill-group">
        {["ligero", "medio", "alto"].map((v) => (
          <button
            key={v}
            className={`onboarding-pill ${picked.gobierno === v ? "onboarding-pill--picked" : ""}`}
            onClick={() => set("gobierno", v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <button className="onboarding-cta" disabled={!picked.tipo} onClick={onContinue} style={{ marginTop: 28 }}>
        Continuar
      </button>
    </div>
  );
}

function FormStep({
  config,
  projectInfo,
  setProjectInfo,
  pms,
  sponsors,
  departments,
  okrCatalog,
  selectedOkrIds,
  onToggleOkr,
  error,
  onChangeConfig,
  onSubmit,
}) {
  const data = RESULTS[config.tipo];
  function set(field, value) {
    setProjectInfo((prev) => ({ ...prev, [field]: value }));
  }
  return (
    <div>
      <h1 className="onboarding-question">Los últimos datos</h1>
      <div className="onboarding-summary-row">
        <span className="onboarding-flag">industria: {config.familiaLabel}</span>
        <span className="onboarding-flag">{data.title}</span>
        <span className="onboarding-flag">arranca en: {config.faseInicio}</span>
        <span className="onboarding-flag">gobierno: {config.gobierno}</span>
        <span className="onboarding-flag">fecha fija: {config.fechaFija ? "sí" : "no"}</span>
        <button className="onboarding-change-link" onClick={onChangeConfig}>
          Cambiar
        </button>
      </div>

      <div className="onboarding-field">
        <label>
          Nombre del proyecto <span className="onboarding-opt-tag">· obligatorio</span>
        </label>
        <input type="text" placeholder="Ej: Implementación de ERP" value={projectInfo.nombre} onChange={(e) => set("nombre", e.target.value)} />
      </div>

      <div className="onboarding-field-row">
        <div className="onboarding-field">
          <label>
            Gestor/a del proyecto <span className="onboarding-opt-tag">· obligatorio</span>
          </label>
          <select value={projectInfo.pm} onChange={(e) => set("pm", e.target.value)}>
            <option value="">Selecciona un gestor de proyecto</option>
            {pms.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="onboarding-field">
          <label>
            Patrocinador/a <span className="onboarding-opt-tag">· obligatorio</span>
          </label>
          <select value={projectInfo.sponsor} onChange={(e) => set("sponsor", e.target.value)}>
            <option value="">Selecciona un patrocinador</option>
            {sponsors.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="onboarding-field-row">
        <div className="onboarding-field">
          <label>
            Departamento <span className="onboarding-opt-tag">· opcional</span>
          </label>
          <select value={projectInfo.departamento} onChange={(e) => set("departamento", e.target.value)}>
            <option value="">Sin especificar</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="onboarding-field">
          <label>
            Fecha límite <span className="onboarding-opt-tag">· opcional</span>
          </label>
          <input type="date" value={projectInfo.fecha} onChange={(e) => set("fecha", e.target.value)} />
        </div>
      </div>

      <div className="onboarding-field">
        <label>
          Presupuesto (€) <span className="onboarding-opt-tag">· opcional</span>
        </label>
        <input type="number" min="0" placeholder="Ej: 50000" value={projectInfo.presupuesto} onChange={(e) => set("presupuesto", e.target.value)} />
      </div>

      <div className="onboarding-field">
        <label>
          Contribuye a estos objetivos estratégicos (KPIs) <span className="onboarding-opt-tag">· obligatorio</span>
        </label>
        <div className="okr-checklist">
          {okrCatalog.map((o) => (
            <label key={o.id} className="okr-checklist-item">
              <input type="checkbox" checked={selectedOkrIds.includes(o.id)} onChange={() => onToggleOkr(o.id)} />
              <span>
                {o.objective} <span className="okr-checklist-year">· {o.year}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="onboarding-form-error">{error}</p>}
      <button className="onboarding-cta" onClick={onSubmit}>
        Crear proyecto
      </button>
    </div>
  );
}

function DoneStep({ config, projectInfo, onRestart, onClose }) {
  const data = RESULTS[config.tipo];
  return (
    <div>
      <div className="onboarding-done-check">
        <CheckIcon size={18} color="currentColor" />
        Proyecto creado
      </div>
      <h1 className="onboarding-result-title">{projectInfo.name || projectInfo.nombre}</h1>
      <p className="onboarding-result-why">
        Listo para empezar en fase "{config.faseInicio}", configurado como {data.title.toLowerCase()}.
      </p>
      <div className="onboarding-done-card">
        <div className="onboarding-done-row">
          <span>Industria</span>
          <span>{config.familiaLabel || "Sin especificar"}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Tipo de proyecto</span>
          <span>{config.tipoProyectoLabels.join(", ") || "Sin especificar"}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Enfoque de gestión</span>
          <span>{data.title}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Fase de arranque</span>
          <span>{config.faseInicio}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Gestor/a del proyecto</span>
          <span>{projectInfo.pm}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Patrocinador/a</span>
          <span>{projectInfo.sponsor}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Departamento</span>
          <span>{projectInfo.department || projectInfo.departamento || "Sin especificar"}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Fecha límite</span>
          <span>{projectInfo.deadline || projectInfo.fecha || "Sin especificar"}</span>
        </div>
        <div className="onboarding-done-row">
          <span>Gobierno</span>
          <span>
            {config.gobierno} · fecha fija: {config.fechaFija ? "sí" : "no"}
          </span>
        </div>
      </div>
      <button className="onboarding-cta" onClick={onClose}>
        Ir al panel
      </button>
      <div style={{ marginTop: 14 }}>
        <button className="onboarding-ghost-link" onClick={onRestart}>
          Crear otro proyecto
        </button>
      </div>
    </div>
  );
}
