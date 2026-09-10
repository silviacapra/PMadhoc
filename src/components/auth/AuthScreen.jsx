import Logo from "../shared/Logo";
import "./AuthScreen.css";

export default function AuthScreen({ auth }) {
  const {
    mode,
    isSignup,
    isReset,
    form,
    error,
    busy,
    setMode,
    updateField,
    submit,
    resetSent,
    resetBusy,
    resetError,
    sendPasswordReset,
  } = auth;

  if (isReset) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-brand">
            <Logo variant="dark" size={50} />
          </div>

          <h2 className="auth-reset-title">Recuperar contraseña</h2>

          {resetSent ? (
            <>
              <p className="auth-reset-text">
                Te hemos enviado un enlace a <strong>{form.email}</strong> para crear una contraseña nueva. Revisa
                también la carpeta de spam.
              </p>
              <div className="auth-submit" onClick={() => setMode("login")}>
                Volver a iniciar sesión
              </div>
            </>
          ) : (
            <>
              <p className="auth-reset-text">Escribe tu correo y te enviaremos un enlace para crear una contraseña nueva.</p>
              <div className="auth-field">
                <label>Correo electrónico</label>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>
              {resetError && <p className="auth-error">{resetError}</p>}
              <div className={`auth-submit ${resetBusy ? "auth-submit--busy" : ""}`} onClick={resetBusy ? undefined : sendPasswordReset}>
                {resetBusy ? "Enviando..." : "Enviar enlace"}
              </div>
              <p className="auth-reset-back" onClick={() => setMode("login")}>
                ← Volver a iniciar sesión
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo variant="dark" size={50} />
        </div>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </div>
          <div
            className={`auth-tab ${mode === "signup" ? "auth-tab--active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Registrarse
          </div>
        </div>

        {isSignup && (
          <>
            <div className="auth-field">
              <label>Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
            <div className="auth-field">
              <label>Rol</label>
              <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
                <option value="sponsor">Sponsor</option>
                <option value="pm">Project manager</option>
                <option value="team">Team</option>
                <option value="expert">Experto</option>
              </select>
              <span className="auth-hint">Tu rol determina a qué secciones de la app tienes acceso.</span>
            </div>
          </>
        )}

        <div className="auth-field">
          <label>Correo electrónico</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="tu@email.com"
          />
        </div>

        <div className="auth-field auth-field--password">
          <label>Contraseña</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="••••••••"
          />
          {!isSignup && (
            <span className="auth-forgot" onClick={() => setMode("reset")}>
              ¿Olvidaste tu contraseña?
            </span>
          )}
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className={`auth-submit ${busy ? "auth-submit--busy" : ""}`} onClick={busy ? undefined : submit}>
          {busy ? "Un momento..." : isSignup ? "Crear cuenta" : "Iniciar sesión"}
        </div>

        <p className="auth-disclaimer">
          Los proyectos, la empresa y las plantillas son compartidos entre todo el equipo. Tu perfil y tus
          conversaciones con el PM virtual son solo tuyos.
        </p>
      </div>
    </div>
  );
}
