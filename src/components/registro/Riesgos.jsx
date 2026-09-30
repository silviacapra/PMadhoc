import { useState } from "react";
import { RISK_CATEGORIES, PROBABILIDAD_OPTIONS, ANALISIS_OPTIONS, RIESGO_ESTADO_OPTIONS } from "../../data/riesgos";
import { IMPACT_STYLES } from "../../data/statusStyles";
import { PencilIcon, TrashIcon } from "../icons/Icons";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import "../dashboard/NewProjectModal.css";
import "./Registro.css";

function probabilidadVariant(p) {
  if (p === "Muy probable") return "red";
  if (p === "Probable") return "amber";
  return "green";
}

function analisisVariant(a) {
  if (a === "alto") return "red";
  if (a === "medio") return "amber";
  return "green";
}

function estadoVariant(e) {
  if (e === "Cerrado") return "neutral";
  if (e === "Mitigado") return "green";
  if (e === "Escalado") return "red";
  return "blue";
}

function formatFecha(iso) {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

function EditRiesgoModal({ riesgo, onClose, onSave, teamMembers }) {
  const [draft, setDraft] = useState(riesgo);

  if (!riesgo) return null;

  function set(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!draft.nombre.trim()) return;
    onSave(riesgo.id, { ...draft, nombre: draft.nombre.trim(), desc: draft.desc.trim() });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Editar riesgo</h2>

        <div className="modal-field">
          <label>Nombre del riesgo</label>
          <input type="text" value={draft.nombre} onChange={(e) => set("nombre", e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Descripción</label>
          <textarea rows={2} value={draft.desc} onChange={(e) => set("desc", e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Categoría</label>
          <select value={draft.categoria} onChange={(e) => set("categoria", e.target.value)}>
            {RISK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Probabilidad</label>
          <select value={draft.probabilidad} onChange={(e) => set("probabilidad", e.target.value)}>
            {PROBABILIDAD_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Análisis</label>
          <select value={draft.impacto} onChange={(e) => set("impacto", e.target.value)}>
            {ANALISIS_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Mitigación / plan de acción</label>
          <textarea rows={2} value={draft.mitigacion} onChange={(e) => set("mitigacion", e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Prioridad</label>
          <input type="number" min="1" value={draft.prioridad} onChange={(e) => set("prioridad", e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Propietario</label>
          <select value={draft.propietario} onChange={(e) => set("propietario", e.target.value)}>
            {teamMembers.map((tm) => (
              <option key={tm.id} value={tm.name}>
                {tm.name} · {tm.roleLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label>Estado</label>
          <select value={draft.estado} onChange={(e) => set("estado", e.target.value)}>
            {RIESGO_ESTADO_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
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

export default function Riesgos({ riesgos }) {
  const { projects, selectedProjectId, setSelectedProjectId, items, form, updateField, add, update, delete: deleteRiesgo, currentUserUid, teamMembers } =
    riesgos;
  const project = projects.find((p) => p.id === selectedProjectId);
  const [editingRiesgo, setEditingRiesgo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div>
      <h1 className="page-title">Registro de riesgos</h1>

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

      <div className="doc-disclaimer">
        ℹ️ Cualquiera puede añadir riesgos, pero solo quien creó cada riesgo puede editarlo o eliminarlo.
      </div>

      {!project ? (
        <p className="registry-empty">Crea un proyecto primero para poder registrar sus riesgos.</p>
      ) : (
        <div className="section-card">
          {items.length === 0 ? (
            <p className="registry-empty">Todavía no hay riesgos registrados para este proyecto.</p>
          ) : (
            <div className="registry-table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Riesgo</th>
                    <th>Categoría</th>
                    <th>Probabilidad</th>
                    <th>Análisis</th>
                    <th>Prioridad</th>
                    <th>Propietario</th>
                    <th>Estado</th>
                    <th>Creado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => {
                    const isOwner = r.creadoPorUid && r.creadoPorUid === currentUserUid;
                    return (
                      <tr key={r.id}>
                        <td className="registry-table-name">
                          {r.nombre}
                          {r.desc && <div className="registry-table-desc">{r.desc}</div>}
                          {r.mitigacion && <div className="registry-table-desc">Plan de acción: {r.mitigacion}</div>}
                        </td>
                        <td>
                          <span className="tag-pill tag-pill--neutral">{r.categoria}</span>
                        </td>
                        <td>
                          <span className={`tag-pill tag-pill--${probabilidadVariant(r.probabilidad)}`}>{r.probabilidad}</span>
                        </td>
                        <td>
                          <span className={`tag-pill tag-pill--${analisisVariant(r.impacto)}`}>
                            {IMPACT_STYLES[r.impacto]?.label || r.impacto}
                          </span>
                        </td>
                        <td>{r.prioridad || "—"}</td>
                        <td>{r.propietario || "Sin propietario"}</td>
                        <td>
                          <span className={`tag-pill tag-pill--${estadoVariant(r.estado)}`}>{r.estado}</span>
                        </td>
                        <td className="registry-date-pill">{formatFecha(r.fecha)}</td>
                        <td>
                          {isOwner && (
                            <div className="registry-row-actions">
                              <button className="registry-icon-btn" title="Editar" onClick={() => setEditingRiesgo(r)}>
                                <PencilIcon size={13} color="currentColor" />
                              </button>
                              <button
                                className="registry-icon-btn registry-icon-btn--danger"
                                title="Eliminar"
                                onClick={() => setDeleteTarget(r)}
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
            <input type="text" placeholder="Nombre del riesgo" value={form.nombre} onChange={(e) => updateField("nombre", e.target.value)} />
            <textarea
              rows={2}
              placeholder="Descripción del riesgo"
              value={form.desc}
              onChange={(e) => updateField("desc", e.target.value)}
            />
            <div className="registry-form-row">
              <select value={form.categoria} onChange={(e) => updateField("categoria", e.target.value)}>
                {RISK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select value={form.probabilidad} onChange={(e) => updateField("probabilidad", e.target.value)}>
                {PROBABILIDAD_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select value={form.impacto} onChange={(e) => updateField("impacto", e.target.value)}>
                {ANALISIS_OPTIONS.map((a) => (
                  <option key={a.id} value={a.id}>
                    Análisis: {a.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="Mitigación / plan de acción"
              value={form.mitigacion}
              onChange={(e) => updateField("mitigacion", e.target.value)}
            />
            <div className="registry-form-row">
              <input
                type="number"
                min="1"
                placeholder="Prioridad"
                value={form.prioridad}
                onChange={(e) => updateField("prioridad", e.target.value)}
              />
              <select value={form.propietario} onChange={(e) => updateField("propietario", e.target.value)}>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.name}>
                    {tm.name} · {tm.roleLabel}
                  </option>
                ))}
              </select>
              <select value={form.estado} onChange={(e) => updateField("estado", e.target.value)}>
                {RIESGO_ESTADO_OPTIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <button className="okr-add-btn" onClick={add}>
              Añadir riesgo
            </button>
          </div>
        </div>
      )}

      {editingRiesgo && (
        <EditRiesgoModal
          key={editingRiesgo.id}
          riesgo={editingRiesgo}
          teamMembers={teamMembers}
          onClose={() => setEditingRiesgo(null)}
          onSave={(id, patch) => {
            update(id, patch);
            setEditingRiesgo(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        item={deleteTarget}
        itemLabel="riesgo"
        itemName={deleteTarget?.nombre}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => {
          deleteRiesgo(id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
