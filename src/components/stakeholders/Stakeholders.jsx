import { useState } from "react";
import { PencilIcon, TrashIcon } from "../icons/Icons";
import { ROLE_RESPONSIBILITIES } from "../../data/roleResponsibilities";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import "./Stakeholders.css";

const AVATAR_TINTS = [
  "linear-gradient(135deg, #002d62, #01458f)",
  "linear-gradient(135deg, #2f8f68, #4caf88)",
  "linear-gradient(135deg, #9a6300, #c08a00)",
  "linear-gradient(135deg, #4a2f7a, #7a5cc7)",
  "linear-gradient(135deg, #0a2733, #1a4d5c)",
];

function tintFor(name) {
  const hash = [...(name || "")].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

function StakeholderCard({ stakeholder, onUpdate, onDeleteRequest }) {
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

  const initials = stakeholder.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="stakeholder-card">
      <div className="stakeholder-preview" style={{ background: tintFor(stakeholder.name) }}>
        <div className="stakeholder-preview-initials">{initials}</div>
      </div>
      <div className="section-card stakeholder-card-body">
        <div className="stakeholder-card-head">
          <h4>{stakeholder.name}</h4>
          <div className="stakeholder-card-actions">
            <button className="stakeholder-icon-btn" onClick={() => (editing ? handleCancel() : setEditing(true))}>
              <PencilIcon size={14} color="currentColor" />
            </button>
            <button className="stakeholder-icon-btn stakeholder-icon-btn--danger" onClick={() => onDeleteRequest(stakeholder)}>
              <TrashIcon size={14} color="currentColor" />
            </button>
          </div>
        </div>

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
          <div className="stakeholder-tags">
            <span className="tag-pill tag-pill--blue">{stakeholder.rol}</span>
            {stakeholder.ubicacion && <span className="tag-pill tag-pill--neutral">{stakeholder.ubicacion}</span>}
          </div>

          <div className="stakeholder-field">
            <span className="stakeholder-label">Correo</span>
            <span>{stakeholder.email}</span>
          </div>
          <div className="stakeholder-field">
            <span className="stakeholder-label">Plan de comunicación</span>
            <span>{stakeholder.planComunicacion}</span>
          </div>
          {ROLE_RESPONSIBILITIES[stakeholder.rol] && (
            <div className="stakeholder-field">
              <span className="stakeholder-label">Responsabilidad del rol</span>
              <ul className="stakeholder-responsibilities">
                {ROLE_RESPONSIBILITIES[stakeholder.rol].map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}

export default function Stakeholders({ stakeholders, updateStakeholder, deleteStakeholder }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div>
      <h1 className="page-title">Contactos clave</h1>

      <div className="stakeholder-grid">
        {stakeholders.map((s) => (
          <StakeholderCard key={s.id} stakeholder={s} onUpdate={updateStakeholder} onDeleteRequest={setDeleteTarget} />
        ))}
      </div>

      <ConfirmDeleteModal
        item={deleteTarget}
        itemLabel="contacto clave"
        itemName={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => {
          deleteStakeholder(id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
