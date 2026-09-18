import Logo from "../shared/Logo";
import { LogoutIcon } from "../icons/Icons";
import "./Header.css";

export default function Header({ session, nav }) {
  return (
    <header className="app-header">
      <div className="app-header-brand" onClick={() => nav.setView("dashboard")}>
        <Logo variant="light" size={32} textSize={14} />
      </div>
      <div className="app-header-account">
        <div className="app-header-profile" onClick={() => nav.setView("profile")}>
          <div className="app-header-avatar">{session.profile.initials}</div>
          <div className="app-header-profile-info">
            <span className="app-header-name">{session.profile.name}</span>
            <span className="app-header-role">{session.roleLabel}</span>
          </div>
        </div>
        <button className="app-header-logout" onClick={session.logout} title="Cerrar sesión">
          <LogoutIcon size={16} color="#FFFFFF" />
        </button>
      </div>
    </header>
  );
}
