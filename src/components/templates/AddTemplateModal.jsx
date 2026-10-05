import { useState } from "react";
import { PHASE_FILTER_DEFS, TYPE_FILTER_DEFS } from "../../data/templates";
import "../dashboard/NewProjectModal.css";

const FORMAT_OPTIONS = ["DOCX", "XLSX", "PDF", "Enlace"];
const PHASE_TO_CATEGORY = {
  fundamentos: "Fundamentos",
  preproyecto: "Fundamentos",
  iniciar: "Inicio",
  planificar: "Planificación",
  ejecutar: "Ejecución",
  controlar: "Controlar",
  cerrar: "Cierre",
};

const SELECTABLE_PHASES = PHASE_FILTER_DEFS.filter((p) => p.id !== "todas");
const SELECTABLE_TYPES = TYPE_FILTER_DEFS.filter((t) => t.id !== "todos");

export default function AddTemplateModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tipo, setTipo] = useState(SELECTABLE_TYPES[0].id);
  const [phase, setPhase] = useState(SELECTABLE_PHASES[0].id);
  const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
  const [file, setFile] = useState("");

  if (!open) return null;

  function reset() {
    setTitle("");
    setDesc("");
    setTipo(SELECTABLE_TYPES[0].id);
    setPhase(SELECTABLE_PHASES[0].id);
    setFormat(FORMAT_OPTIONS[0]);
    setFile("");
  }

  function handleCreate() {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      desc: desc.trim(),
      tipo,
      category: PHASE_TO_CATEGORY[phase] || "Fundamentos",
      format,
      phase,
      file: file.trim(),
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
        <h2 className="modal-title">Añadir plantilla</h2>

        <div className="modal-field">
          <label>Título</label>
          <input type="text" placeholder="Ej: Plan de pruebas" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Descripción</label>
          <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div className="modal-field-row">
          <div className="modal-field">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {SELECTABLE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Fase</label>
            <select value={phase} onChange={(e) => setPhase(e.target.value)}>
              {SELECTABLE_PHASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-field-row">
          <div className="modal-field">
            <label>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Enlace al documento (opcional)</label>
            <input type="text" placeholder="https://..." value={file} onChange={(e) => setFile(e.target.value)} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" onClick={handleCreate}>
            Añadir plantilla
          </button>
        </div>
      </div>
    </div>
  );
}
