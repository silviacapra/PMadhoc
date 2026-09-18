import { useState } from "react";
import { PHASE_ORDER, ROADMAP_CONTENT } from "../../data/roadmapContent";
import { PencilIcon, TrashIcon } from "../icons/Icons";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import "../dashboard/NewProjectModal.css";
import "./Registro.css";

function faseLabel(fase) {
  if (fase === "generica" || !fase) return "Genérica";
  return ROADMAP_CONTENT[fase]?.label || fase;
}

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function EditLeccionModal({ leccion, onClose, onSave, teamMembers }) {
  const [draft, setDraft] = useState(leccion);

  if (!leccion) return null;

  function set(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!draft.texto.trim()) return;
    onSave(leccion.id, { ...draft, texto: draft.texto.trim() });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar lección</h2>

        <div className="modal-field">
          <label>¿Qué ha pasado, y qué harías diferente la próxima vez?</label>
          <textarea rows={3} value={draft.texto} onChange={(e) => set("texto", e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Fase</label>
          <select value={draft.fase} onChange={(e) => set("fase", e.target.value)}>
            <option value="generica">Genérica (ej: cómo mejorar las reuniones)</option>
            {PHASE_ORDER.map((f) => (
              <option key={f} value={f}>
                {ROADMAP_CONTENT[f].label}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Autor</label>
          <select value={draft.autor} onChange={(e) => set("autor", e.target.value)}>
            {teamMembers.map((tm) => (
              <option key={tm.id} value={tm.name}>
                {tm.name} · {tm.roleLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" onClick={handleSave}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Lecciones({ lecciones }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, form, updateField, add, update, delete: deleteLeccion, currentUserUid, teamMembers } =
    lecciones;
  const project = projects.find((p) => p.id === selectedProjectId);
  const [editingLeccion, setEditingLeccion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div>
      <h1 className="page-title">Lecciones aprendidas</h1>

      <div className="doc-disclaimer">
        ℹ️ Cualquiera puede añadir lecciones, pero solo quien creó cada lección puede editarla o eliminarla.
      </div>

      <div className="registro-project-picker">
        <label>Proyecto</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para poder registrar sus lecciones.</p>
      ) : (
        <div className="section-card">
          {items.length === 0 ? (
            <p className="registry-empty">Todavía no hay lecciones registradas para este proyecto.</p>
          ) : (
            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Lección</th>
                    <th>Fase</th>
                    <th>Autor</th>
                    <th>Creado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((l) => {
                    const isOwner = l.creadoPorUid && l.creadoPorUid === currentUserUid;
                    return (
                      <tr key={l.id}>
                        <td className="registry-table-name">{l.texto}</td>
                        <td>
                          <span className="tag-pill tag-pill--blue">{faseLabel(l.fase)}</span>
                        </td>
                        <td>{l.autor}</td>
                        <td className="registry-date-pill">{formatFecha(l.fecha)}</td>
                        <td>
                          {isOwner && (
                            <div className="registry-row-actions">
                              <button className="registry-icon-btn" title="Editar" onClick={() => setEditingLeccion(l)}>
                                <PencilIcon size={13} color="currentColor" />
                              </button>
                              <button
                                className="registry-icon-btn registry-icon-btn--danger"
                                title="Eliminar"
                                onClick={() => setDeleteTarget(l)}
                              >
                                <TrashIcon size={13} color="currentColor" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="registry-form">
            <textarea
              rows={3}
              placeholder="¿Qué ha pasado, y qué harías diferente la próxima vez?"
              value={form.texto}
              onChange={(e) => updateField("texto", e.target.value)}
            />
            <div className="registry-form-row registry-form-row--two">
              <select value={form.fase} onChange={(e) => updateField("fase", e.target.value)}>
                <option value="generica">Genérica (ej: cómo mejorar las reuniones)</option>
                {PHASE_ORDER.map((f) => (
                  <option key={f} value={f}>
                    {ROADMAP_CONTENT[f].label}
                  </option>
                ))}
              </select>
              <select value={form.autor} onChange={(e) => updateField("autor", e.target.value)}>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.name}>
                    {tm.name} · {tm.roleLabel}
                  </option>
                ))}
              </select>
            </div>
            <button className="okr-add-btn" onClick={add}>
              Añadir lección
            </button>
          </div>
        </div>
      )}

      {editingLeccion && (
        <EditLeccionModal
          key={editingLeccion.id}
          leccion={editingLeccion}
          teamMembers={teamMembers}
          onClose={() => setEditingLeccion(null)}
          onSave={(id, patch) => {
            update(id, patch);
            setEditingLeccion(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        item={deleteTarget}
        itemLabel="lección"
        itemName={deleteTarget?.texto?.slice(0, 40)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => {
          deleteLeccion(id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
