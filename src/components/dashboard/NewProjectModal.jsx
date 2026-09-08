import { useState } from "react";
import { METHODOLOGY_LABELS } from "../../data/projects";
import "./NewProjectModal.css";

const METHODOLOGY_OPTIONS = ["cascada", "agil", "hibrida"];

export default function NewProjectModal({ open, onClose, sponsors, departments, okrCatalog, onCreate }) {
  const [name, setName] = useState("");
  const [methodology, setMethodology] = useState("hibrida");
  const [sponsor, setSponsor] = useState(sponsors[0]?.name || "");
  const [department, setDepartment] = useState(departments[0] || "");
  const [selectedOkrIds, setSelectedOkrIds] = useState([]);

  if (!open) return null;

  function toggleOkr(id) {
    setSelectedOkrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function reset() {
    setName("");
    setMethodology("hibrida");
    setSponsor(sponsors[0]?.name || "");
    setDepartment(departments[0] || "");
    setSelectedOkrIds([]);
  }

  function handleCreate() {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      methodology,
      sponsor,
      department,
      contributesTo: selectedOkrIds,
    });
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Nuevo proyecto</h2>

        <div className="modal-field">
          <label>Nombre del proyecto</label>
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
            <label>Sponsor</label>
            <select value={sponsor} onChange={(e) => setSponsor(e.target.value)}>
              {sponsors.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
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
        </div>

        <div className="modal-field">
          <label>Contribuye a estos objetivos estratégicos (OKR)</label>
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

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" onClick={handleCreate}>
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
