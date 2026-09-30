import { useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "../icons/Icons";
import "./EmpresaOkr.css";

const SMART_VERBS = ["Aumentar", "Reducir", "Mejorar", "Incrementar", "Disminuir", "Alcanzar", "Mantener", "Lanzar", "Completar"];

const BLANK_SMART_PARTS = { verbo: "", sujeto: "", numero: "", paraCuando: "" };

function buildSmartText({ verbo, sujeto, numero, paraCuando }) {
  const core = [verbo, sujeto, numero]
    .filter((p) => p && p.trim())
    .join(" ")
    .trim();
  if (!core) return "";
  return paraCuando && paraCuando.trim() ? `${core} para ${paraCuando.trim()}` : core;
}

function SmartFormula({ parts, onChange, subjectPlaceholder }) {
  function set(field, value) {
    onChange({ ...parts, [field]: value });
  }
  const preview = buildSmartText(parts);

  return (
    <div className="smart-formula">
      <div className="smart-formula-row">
        <div className="okr-field">
          <label>Verbo</label>
          <select value={parts.verbo} onChange={(e) => set("verbo", e.target.value)}>
            <option value="">Elige un verbo</option>
            {SMART_VERBS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="okr-field">
          <label>Qué quieres mejorar</label>
          <input
            type="text"
            placeholder={subjectPlaceholder || "Ej: la retención de clientes"}
            value={parts.sujeto}
            onChange={(e) => set("sujeto", e.target.value)}
          />
        </div>
        <div className="okr-field">
          <label>Cuánto (número o %)</label>
          <input type="text" placeholder="Ej: del 80% al 90%" value={parts.numero} onChange={(e) => set("numero", e.target.value)} />
        </div>
        <div className="okr-field">
          <label>Para cuándo</label>
          <input
            type="text"
            placeholder="Ej: diciembre de 2026"
            value={parts.paraCuando}
            onChange={(e) => set("paraCuando", e.target.value)}
          />
        </div>
      </div>
      {preview && <p className="smart-formula-preview">"{preview}."</p>}
    </div>
  );
}

function OkrCard({ okr, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [objective, setObjective] = useState(okr.objective);
  const [keyResultsText, setKeyResultsText] = useState(okr.keyResults.join("\n"));

  function handleSave() {
    const keyResults = keyResultsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!objective.trim() || keyResults.length === 0) return;
    onUpdate(okr.id, { objective: objective.trim(), keyResults });
    setEditing(false);
  }

  function handleCancel() {
    setObjective(okr.objective);
    setKeyResultsText(okr.keyResults.join("\n"));
    setEditing(false);
  }

  return (
    <div className="section-card okr-card">
      <div className="okr-card-head">
        {editing ? (
          <input className="okr-card-edit-title" type="text" value={objective} onChange={(e) => setObjective(e.target.value)} />
        ) : (
          <h4>{okr.objective}</h4>
        )}
        <div className="okr-card-actions">
          <button className="okr-icon-btn" onClick={() => setEditing((v) => !v)}>
            <PencilIcon size={14} color="currentColor" />
          </button>
          <button className="okr-icon-btn" onClick={() => setConfirmingDelete((v) => !v)}>
            <TrashIcon size={14} color="currentColor" />
          </button>
        </div>
      </div>

      {editing ? (
        <>
          <textarea
            className="okr-card-edit-kr"
            rows={3}
            value={keyResultsText}
            onChange={(e) => setKeyResultsText(e.target.value)}
          />
          <div className="okr-card-edit-actions">
            <button className="okr-add-btn" onClick={handleSave}>
              Guardar
            </button>
            <span className="cancel-link" onClick={handleCancel}>
              Cancelar
            </span>
          </div>
        </>
      ) : (
        <ul className="okr-key-results">
          {okr.keyResults.map((kr) => (
            <li key={kr}>{kr}</li>
          ))}
        </ul>
      )}

      {confirmingDelete && (
        <div className="okr-confirm-delete">
          <span>¿Eliminar este objetivo?</span>
          <button
            className="okr-confirm-yes"
            onClick={() => {
              onDelete(okr.id);
              setConfirmingDelete(false);
            }}
          >
            Sí, eliminar
          </button>
          <span className="cancel-link" onClick={() => setConfirmingDelete(false)}>
            Cancelar
          </span>
        </div>
      )}
    </div>
  );
}

export default function EmpresaOkr({ company, okr }) {
  const { info, updateField } = company;
  const { catalog, addOkr, updateOkr, deleteOkr } = okr;

  const [editingCompany, setEditingCompany] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [objParts, setObjParts] = useState(BLANK_SMART_PARTS);
  const [krPartsList, setKrPartsList] = useState([BLANK_SMART_PARTS]);

  const years = [...new Set(catalog.map((o) => o.year))].sort((a, b) => b - a);

  function updateKrPart(index, parts) {
    setKrPartsList((prev) => prev.map((p, i) => (i === index ? parts : p)));
  }

  function addKrRow() {
    setKrPartsList((prev) => [...prev, BLANK_SMART_PARTS]);
  }

  function removeKrRow(index) {
    setKrPartsList((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAdd() {
    const objective = buildSmartText(objParts);
    const keyResults = krPartsList.map(buildSmartText).filter(Boolean);
    if (!objective || !year || keyResults.length === 0) return;
    addOkr({ year: Number(year), objective, keyResults });
    setObjParts(BLANK_SMART_PARTS);
    setKrPartsList([BLANK_SMART_PARTS]);
    setAddOpen(false);
  }

  return (
    <div>
      <h1 className="page-title">Objetivos de Empresa</h1>

      <div className="section-card okr-company-card">
        <div className="section-head-row">
          <h3 className="section-heading" style={{ margin: 0 }}>
            Datos de la empresa
          </h3>
          {!editingCompany && (
            <button className="edit-toggle-btn" onClick={() => setEditingCompany(true)}>
              <PencilIcon size={14} color="currentColor" />
              Editar
            </button>
          )}
        </div>

        {editingCompany ? (
          <>
            <div className="okr-company-fields">
              <div className="okr-field">
                <label>Nombre</label>
                <input type="text" value={info.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="okr-field">
                <label>Sector</label>
                <input type="text" value={info.sector} onChange={(e) => updateField("sector", e.target.value)} />
              </div>
              <div className="okr-field">
                <label>Tamaño</label>
                <input type="text" value={info.size} onChange={(e) => updateField("size", e.target.value)} />
              </div>
            </div>
            <span className="cancel-link" onClick={() => setEditingCompany(false)}>
              Listo
            </span>
          </>
        ) : (
          <div className="okr-company-readonly">
            <div>
              <span className="okr-company-readonly-label">Nombre</span>
              <span>{info.name}</span>
            </div>
            <div>
              <span className="okr-company-readonly-label">Sector</span>
              <span>{info.sector}</span>
            </div>
            <div>
              <span className="okr-company-readonly-label">Tamaño</span>
              <span>{info.size}</span>
            </div>
          </div>
        )}
      </div>

      <h3 className="section-heading okr-catalog-heading">Catálogo de objetivos estratégicos (KPIs)</h3>
      {years.map((y) => (
        <div key={y} className="okr-year-group">
          <span className="okr-year-label">{y}</span>
          <div className="okr-list">
            {catalog
              .filter((o) => o.year === y)
              .map((o) => (
                <OkrCard key={o.id} okr={o} onUpdate={updateOkr} onDelete={deleteOkr} />
              ))}
          </div>
        </div>
      ))}

      {addOpen ? (
        <div className="section-card okr-add-card">
          <div className="section-head-row">
            <h3 className="section-heading" style={{ margin: 0 }}>
              Añadir nuevo objetivo al catálogo
            </h3>
            <span className="cancel-link" onClick={() => setAddOpen(false)}>
              Cancelar
            </span>
          </div>

          <div className="okr-field okr-field--year">
            <label>Año</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>

          <p className="smart-section-label">Objetivo SMART</p>
          <SmartFormula parts={objParts} onChange={setObjParts} subjectPlaceholder="Ej: la retención de clientes" />

          {krPartsList.map((parts, i) => (
            <div key={i} className="kr-smart-row">
              <p className="smart-section-label" style={{ marginTop: 20 }}>
                #{i + 1} Resultados clave (KPI)
              </p>
              <SmartFormula parts={parts} onChange={(p) => updateKrPart(i, p)} subjectPlaceholder="Ej: la tasa de cancelación" />
              {krPartsList.length > 1 && (
                <span className="cancel-link kr-smart-remove" onClick={() => removeKrRow(i)}>
                  Quitar este resultado
                </span>
              )}
            </div>
          ))}
          <div className="okr-add-actions">
            <span className="okr-add-kr-link" onClick={addKrRow}>
              + Añadir otro resultado clave
            </span>

            <button className="okr-add-btn" onClick={handleAdd}>
              Añadir objetivo
            </button>
          </div>
        </div>
      ) : (
        <button className="new-project-btn" onClick={() => setAddOpen(true)}>
          <PlusIcon size={16} color="currentColor" />
          Añadir objetivo
        </button>
      )}
    </div>
  );
}
