import { useState } from "react";
import { PencilIcon } from "../icons/Icons";
import "./Stakeholders.css";

function StakeholderCard({ stakeholder, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [rol, setRol] = useState(stakeholder.rol);
  const [ubicacion, setUbicacion] = useState(stakeholder.ubicacion);
  const [planComunicacion, setPlanComunicacion] = useState(stakeholder.planComunicacion);

  function handleSave() {
    onUpdate(stakeholder.id, { rol: rol.trim(), ubicacion: ubicacion.trim(), planComunicacion: planComunicacion.trim() });
    setEditing(false);
  }

  function handleCancel() {
    setRol(stakeholder.rol);
    setUbicacion(stakeholder.ubicacion);
    setPlanComunicacion(stakeholder.planComunicacion);
    setEditing(false);
  }

  return (
    <div className="section-card stakeholder-card">
      <div className="stakeholder-card-head">
        <div className="stakeholder-avatar">
          {stakeholder.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
        <button className="stakeholder-icon-btn" onClick={() => (editing ? handleCancel() : setEditing(true))}>
          <PencilIcon size={14} color="currentColor" />
        </button>
      </div>
      <h4>{stakeholder.name}</h4>

      {editing ? (
        <div className="stakeholder-edit">
          <div>
            <span className="stakeholder-label">Rol</span>
            <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} />
          </div>
          <div>
            <span className="stakeholder-label">Ubicación</span>
            <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
          </div>
          <div>
            <span className="stakeholder-label">Plan de comunicación</span>
            <textarea rows={3} value={planComunicacion} onChange={(e) => setPlanComunicacion(e.target.value)} />
          </div>
          <div className="stakeholder-edit-actions">
            <button className="stakeholder-save-btn" onClick={handleSave}>
              Guardar
            </button>
            <span className="cancel-link" onClick={handleCancel}>
              Cancelar
            </span>
          </div>
        </div>
      ) : (
        <>
          <span className="stakeholder-role">{stakeholder.rol}</span>

          <div className="stakeholder-field">
            <span className="stakeholder-label">Correo</span>
            <span>{stakeholder.email}</span>
          </div>
          <div className="stakeholder-field">
            <span className="stakeholder-label">Ubicación</span>
            <span>{stakeholder.ubicacion}</span>
          </div>
          <div className="stakeholder-field">
            <span className="stakeholder-label">Plan de comunicación</span>
            <span>{stakeholder.planComunicacion}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Stakeholders({ stakeholders, updateStakeholder }) {
  return (
    <div>
      <h1 className="page-title">Stakeholders</h1>
      <p className="page-subtitle">Ficha de cada persona del equipo, con sus datos de contacto y su plan de comunicación.</p>

      <div className="stakeholder-grid">
        {stakeholders.map((s) => (
          <StakeholderCard key={s.id} stakeholder={s} onUpdate={updateStakeholder} />
        ))}
      </div>
    </div>
  );
}
