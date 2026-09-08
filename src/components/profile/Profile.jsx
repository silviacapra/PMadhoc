import "./Profile.css";

export default function Profile({ profile }) {
  const { current, draft, saved, initials, updateField, save } = profile;

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

        <div className="profile-field">
          <label>Nombre</label>
          <input type="text" value={draft.name} onChange={(e) => updateField("name", e.target.value)} />
        </div>

        <div className="profile-field profile-field--email">
          <label>Correo electrónico</label>
          <input type="text" value={draft.email} onChange={(e) => updateField("email", e.target.value)} />
        </div>

        <div className="profile-actions">
          <button onClick={save}>Guardar cambios</button>
          {saved && <span className="profile-saved">Cambios guardados</span>}
        </div>
      </div>

      <p className="profile-disclaimer">
        Tus proyectos y tareas están vinculados únicamente a esta cuenta y no son visibles para otros usuarios.
      </p>
    </div>
  );
}
