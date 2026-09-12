import { useState, useEffect } from "react";
import { METHODOLOGY_LABELS } from "../../data/projects";
import "./NewProjectModal.css";

const METHODOLOGY_OPTIONS = ["cascada", "agil", "hibrida"];

const BLANK = { name: "", methodology: "hibrida", sponsor: "", pm: "", department: "", contributesTo: [], deadline: "", hitos: "", budget: "" };

export default function ProjectModal({ open, onClose, sponsors, pms, departments, okrCatalog, onCreate, onSave, project }) {
  const isEdit = !!project;
  const [name, setName] = useState(BLANK.name);
  const [methodology, setMethodology] = useState(BLANK.methodology);
  const [sponsor, setSponsor] = useState("");
  const [pm, setPm] = useState("");
  const [department, setDepartment] = useState(departments[0] || "");
  const [selectedOkrIds, setSelectedOkrIds] = useState(BLANK.contributesTo);
  const [deadline, setDeadline] = useState(BLANK.deadline);
  const [hitos, setHitos] = useState(BLANK.hitos);
  const [budget, setBudget] = useState(BLANK.budget);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (project) {
      setName(project.name || "");
      setMethodology(project.methodology || "hibrida");
      setSponsor(project.sponsor || "");
      setPm(project.pm || "");
      setDepartment(project.department || departments[0] || "");
      setSelectedOkrIds(project.contributesTo || []);
      setDeadline(project.deadline || "");
      setHitos(project.hitos || "");
      setBudget(project.budgetTotal ? String(project.budgetTotal) : "");
    } else {
      setName(BLANK.name);
      setMethodology(BLANK.methodology);
      setSponsor("");
      setPm("");
      setDepartment(departments[0] || "");
      setSelectedOkrIds(BLANK.contributesTo);
      setDeadline(BLANK.deadline);
      setHitos(BLANK.hitos);
      setBudget(BLANK.budget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, project]);

  if (!open) return null;

  function toggleOkr(id) {
    setSelectedOkrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSubmit() {
    const missing = [];
    if (!name.trim()) missing.push("nombre del proyecto");
    if (!pm) missing.push("gestor del proyecto (PM)");
    if (!sponsor) missing.push("sponsor");
    if (!deadline) missing.push("fecha límite prevista");
    if (!budget) missing.push("presupuesto");
    if (selectedOkrIds.length === 0) missing.push("al menos un objetivo (OKR)");

    if (missing.length > 0) {
      setError(`Faltan campos obligatorios: ${missing.join(", ")}.`);
      return;
    }
    setError("");

    const payload = {
      name: name.trim(),
      methodology,
      sponsor,
      pm,
      department,
      contributesTo: selectedOkrIds,
      deadline,
      hitos: hitos.trim(),
      budget,
    };
    if (isEdit) {
      onSave(project.id, payload);
    } else {
      onCreate(payload);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Editar proyecto" : "Nuevo proyecto"}</h2>

        <div className="modal-field">
          <label>Nombre del proyecto *</label>
          <input type="text" placeholder="Ej: Implementación de ERP" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Metodología</label>
          <div className="methodology-options">
            {METHODOLOGY_OPTIONS.map((m) => (
              <span
                key={m}
                className={`methodology-option ${methodology === m ? "methodology-option--active" : ""}`}
                onClick={() => setMethodology(m)}
              >
                {METHODOLOGY_LABELS[m]}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-field-row">
          <div className="modal-field">
            <label>Gestor del proyecto (PM) *</label>
            <select value={pm} onChange={(e) => setPm(e.target.value)}>
              <option value="">Selecciona un PM</option>
              {pms.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Sponsor *</label>
            <select value={sponsor} onChange={(e) => setSponsor(e.target.value)}>
              <option value="">Selecciona un sponsor</option>
              {sponsors.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-field-row">
          <div className="modal-field">
            <label>Departamento</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Fecha límite prevista *</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>

        <div className="modal-field">
          <label>Presupuesto (€) *</label>
          <input type="number" min="0" placeholder="Ej: 50000" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Hitos importantes (opcional)</label>
          <textarea
            rows={2}
            placeholder="Ej: Demo interna en marzo, lanzamiento piloto en junio..."
            value={hitos}
            onChange={(e) => setHitos(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <label>Contribuye a estos objetivos estratégicos (OKR) *</label>
          <div className="okr-checklist">
            {okrCatalog.map((o) => (
              <label key={o.id} className="okr-checklist-item">
                <input type="checkbox" checked={selectedOkrIds.includes(o.id)} onChange={() => toggleOkr(o.id)} />
                <span>
                  {o.objective} <span className="okr-checklist-year">· {o.year}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" onClick={handleSubmit}>
            {isEdit ? "Guardar cambios" : "Crear proyecto"}
          </button>
        </div>
      </div>
    </div>
  );
}
