import { LogoIcon } from "../icons/Icons";
import "./AuthScreen.css";

export default function AuthScreen({ auth }) {
  const { mode, isSignup, form, setMode, updateField, submit } = auth;

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <LogoIcon size={30} color="var(--accent)" />
          <span className="auth-brand-name">PM Ad Hoc</span>
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
        </div>

        <div className="auth-submit" onClick={submit}>
          {isSignup ? "Crear cuenta" : "Iniciar sesión"}
        </div>

        <p className="auth-disclaimer">
          Tus proyectos y tareas son privados: solo tú puedes verlos, siempre vinculados a tu cuenta.
        </p>
      </div>
    </div>
  );
}
