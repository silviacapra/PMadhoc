import "./Stakeholders.css";

export default function Stakeholders({ stakeholders }) {
  return (
    <div>
      <h1 className="page-title">Stakeholders</h1>
      <p className="page-subtitle">Ficha de cada persona del equipo, con sus datos de contacto y su plan de comunicación.</p>

      <div className="stakeholder-grid">
        {stakeholders.map((s) => (
          <div key={s.id} className="section-card stakeholder-card">
            <div className="stakeholder-avatar">
              {s.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <h4>{s.name}</h4>
            <span className="stakeholder-role">{s.rol}</span>

            <div className="stakeholder-field">
              <span className="stakeholder-label">Correo</span>
              <span>{s.email}</span>
            </div>
            <div className="stakeholder-field">
              <span className="stakeholder-label">Ubicación</span>
              <span>{s.ubicacion}</span>
            </div>
            <div className="stakeholder-field">
              <span className="stakeholder-label">Plan de comunicación</span>
              <span>{s.planComunicacion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
