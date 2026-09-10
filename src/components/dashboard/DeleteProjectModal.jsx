import { useState } from "react";
import "./NewProjectModal.css";

export default function DeleteProjectModal({ project, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState("");

  if (!project) return null;

  function handleClose() {
    setConfirmText("");
    onClose();
  }

  function handleConfirm() {
    if (confirmText !== "Delete") return;
    onConfirm(project.id);
    setConfirmText("");
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Eliminar proyecto</h2>
        <p className="delete-modal-text">
          Vas a eliminar <strong>{project.name}</strong>. Esta acción no se puede deshacer. Para confirmar, escribe la
          palabra <strong>Delete</strong> abajo.
        </p>
        <div className="modal-field">
          <input type="text" placeholder="Delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button className="modal-btn delete-modal-confirm" disabled={confirmText !== "Delete"} onClick={handleConfirm}>
            Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
