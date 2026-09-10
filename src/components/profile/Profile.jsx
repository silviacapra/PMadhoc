import { useState } from "react";
import { PencilIcon } from "../icons/Icons";
import "./Profile.css";

export default function Profile({ profile }) {
  const {
    current,
    draft,
    saved,
    initials,
    updateField,
    save,
    passwordForm,
    passwordError,
    passwordSuccess,
    passwordBusy,
    updatePasswordField,
    changePassword,
  } = profile;

  const [editingInfo, setEditingInfo] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  function handleSave() {
    save();
    setEditingInfo(false);
  }

  return (
    <div className="profile-page">
      <h1 className="page-title">Configuración de perfil</h1>
      <p className="page-subtitle">Actualiza tu nombre y tu correo electrónico.</p>

      <div className="profile-card">
        <div className="profile-summary">
          <div className="profile-avatar">{initials}</div>
          <div>
            <span className="profile-name">{current.name}</span>
            <span className="profile-email">{current.email}</span>
          </div>
        </div>

        <div className="profile-section-head section-head-row">
          <h3>Datos personales</h3>
          {!editingInfo && (
            <button className="edit-toggle-btn" onClick={() => setEditingInfo(true)}>
              <PencilIcon size={14} color="currentColor" />
              Editar
            </button>
          )}
        </div>

        {editingInfo ? (
          <>
            <div className="profile-field">
              <label>Nombre</label>
              <input type="text" value={draft.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>

            <div className="profile-field profile-field--email">
              <label>Correo electrónico</label>
              <input type="text" value={draft.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>

            <div className="profile-actions">
              <button onClick={handleSave}>Guardar cambios</button>
              <span className="cancel-link" onClick={() => setEditingInfo(false)}>
                Cancelar
              </span>
              {saved && <span className="profile-saved">Cambios guardados</span>}
            </div>
          </>
        ) : (
          <p className="profile-readonly-hint">Pulsa "Editar" para cambiar tu nombre o tu correo.</p>
        )}
      </div>

      <div className="profile-card profile-password-card">
        <div className="profile-section-head section-head-row">
          <h3>Contraseña</h3>
          {!changingPassword && (
            <button className="edit-toggle-btn" onClick={() => setChangingPassword(true)}>
              <PencilIcon size={14} color="currentColor" />
              Cambiar contraseña
            </button>
          )}
        </div>

        {changingPassword && (
          <>
            <div className="profile-field">
              <label>Contraseña actual</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => updatePasswordField("current", e.target.value)}
              />
            </div>
            <div className="profile-field">
              <label>Contraseña nueva</label>
              <input
                type="password"
                value={passwordForm.next}
                onChange={(e) => updatePasswordField("next", e.target.value)}
              />
            </div>
            <div className="profile-field profile-field--email">
              <label>Confirmar contraseña nueva</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => updatePasswordField("confirm", e.target.value)}
              />
            </div>

            {passwordError && <p className="profile-password-error">{passwordError}</p>}

            <div className="profile-actions">
              <button disabled={passwordBusy} onClick={changePassword}>
                {passwordBusy ? "Guardando..." : "Guardar contraseña"}
              </button>
              <span className="cancel-link" onClick={() => setChangingPassword(false)}>
                Cancelar
              </span>
              {passwordSuccess && <span className="profile-saved">Contraseña actualizada</span>}
            </div>
          </>
        )}
      </div>

      <p className="profile-disclaimer">
        Tus proyectos y tareas están vinculados únicamente a esta cuenta y no son visibles para otros usuarios.
      </p>
    </div>
  );
}
