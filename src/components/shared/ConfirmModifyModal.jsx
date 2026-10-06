import { useState } from "react";
import "../dashboard/NewProjectModal.css";

export default function ConfirmModifyModal({ item, itemLabel, itemName, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState("");

  if (!item) return null;

  function handleClose() {
    setConfirmText("");
    onClose();
  }

  function handleConfirm() {
    if (confirmText !== "Modify") return;
    onConfirm(item);
    setConfirmText("");
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Modificar {itemLabel}</h2>
        <p className="delete-modal-text">
          Vas a modificar <strong>{itemName}</strong>. Para confirmar, escribe la palabra <strong>Modify</strong>{" "}
          abajo.
        </p>
        <div className="modal-field">
          <input type="text" placeholder="Modify" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" disabled={confirmText !== "Modify"} onClick={handleConfirm}>
            Modificar
          </button>
        </div>
      </div>
    </div>
  );
}
