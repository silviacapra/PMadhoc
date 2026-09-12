import { useState } from "react";
import { METHODOLOGY_LABELS } from "../../data/projects";
import "./NewProjectModal.css";

const METHODOLOGY_OPTIONS = ["cascada", "agil", "hibrida"];

export default function NewProjectModal({ open, onClose, sponsors, pms, departments, okrCatalog, onCreate }) {
  const [name, setName] = useState("");
  const [methodology, setMethodology] = useState("hibrida");
  const [sponsor, setSponsor] = useState(sponsors[0]?.name || "");
  const [pm, setPm] = useState(pms[0]?.name || "");
  const [department, setDepartment] = useState(departments[0] || "");
  const [selectedOkrIds, setSelectedOkrIds] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [hitos, setHitos] = useState("");

  if (!open) return null;

  function toggleOkr(id) {
    setSelectedOkrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function reset() {
    setName("");
    setMethodology("hibrida");
    setSponsor(sponsors[0]?.name || "");
    setPm(pms[0]?.name || "");
    setDepartment(departments[0] || "");
    setSelectedOkrIds([]);
    setDeadline("");
    setHitos("");
  }

  function handleCreate() {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      methodology,
      sponsor,
      pm,
      department,
      contributesTo: selectedOkrIds,
      deadline,
      hitos: hitos.trim(),
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
            <label>Gestor del proyecto (PM)</label>
            <select value={pm} onChange={(e) => setPm(e.target.value)}>
              {pms.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
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
            <label>Fecha límite prevista</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
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
