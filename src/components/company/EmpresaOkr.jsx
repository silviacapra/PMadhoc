import { useState } from "react";
import "./EmpresaOkr.css";

export default function EmpresaOkr({ company, okr }) {
  const { info, updateField } = company;
  const { catalog, addOkr } = okr;

  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [objective, setObjective] = useState("");
  const [keyResultsText, setKeyResultsText] = useState("");

  const years = [...new Set(catalog.map((o) => o.year))].sort((a, b) => b - a);

  function handleAdd() {
    const keyResults = keyResultsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!objective.trim() || !year || keyResults.length === 0) return;
    addOkr({ year: Number(year), objective: objective.trim(), keyResults });
    setObjective("");
    setKeyResultsText("");
  }

  return (
    <div>
      <h1 className="page-title">Empresa y OKR</h1>
      <p className="page-subtitle">Datos generales de la empresa y catálogo de objetivos estratégicos. Cada proyecto se vincula a uno o varios de estos objetivos.</p>

      <div className="section-card okr-company-card">
        <h3 className="section-heading">Datos de la empresa</h3>
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
      </div>

      <h3 className="section-heading okr-catalog-heading">Catálogo de objetivos estratégicos (OKR)</h3>
      {years.map((y) => (
        <div key={y} className="okr-year-group">
          <span className="okr-year-label">{y}</span>
          <div className="okr-list">
            {catalog
              .filter((o) => o.year === y)
              .map((o) => (
                <div key={o.id} className="section-card okr-card">
                  <h4>{o.objective}</h4>
                  <ul className="okr-key-results">
                    {o.keyResults.map((kr) => (
                      <li key={kr}>{kr}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="section-card okr-add-card">
        <h3 className="section-heading">Añadir nuevo objetivo al catálogo</h3>
        <div className="okr-add-fields">
          <div className="okr-field okr-field--year">
            <label>Año</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="okr-field">
            <label>Objetivo</label>
            <input type="text" placeholder="Ej: Mejorar la retención de clientes" value={objective} onChange={(e) => setObjective(e.target.value)} />
          </div>
        </div>
        <div className="okr-field">
          <label>Resultados clave (uno por línea)</label>
          <textarea
            rows={3}
            placeholder={"Ej: Subir la retención del 80% al 90%\nReducir las cancelaciones en un 10%"}
            value={keyResultsText}
            onChange={(e) => setKeyResultsText(e.target.value)}
          />
        </div>
        <button className="okr-add-btn" onClick={handleAdd}>
          Añadir objetivo
        </button>
      </div>
    </div>
  );
}
