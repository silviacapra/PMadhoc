import { ExternalLinkIcon } from "../icons/Icons";
import "./FichaProyecto.css";
import "../registro/Registro.css";

export default function Documentacion({ documentacion }) {
  const { groups } = documentacion;

  return (
    <div className="section-card">
      <h3 className="section-heading">Documentación</h3>
      <div className="doc-disclaimer">
        ℹ️ Esta sección se rellena automáticamente desde el apartado <strong>Roadmap Proyecto</strong>: en cuanto marcas un
        entregable como hecho y le añades un enlace en Fases del proyecto, aparece aquí agrupado por fase.
      </div>

      {groups.length === 0 ? (
        <p className="registry-empty">Todavía no hay ningún entregable marcado como hecho con un documento enlazado.</p>
      ) : (
        <div className="registry-table-wrap">
          <table className="registry-table">
            <thead>
              <tr>
                <th>Fase</th>
                <th>Paso</th>
                <th>Documento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) =>
                g.docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <span className="tag-pill tag-pill--blue">{g.phaseLabel}</span>
                    </td>
                    <td>{d.stepTitle}</td>
                    <td className="registry-table-name">{d.titulo}</td>
                    <td>
                      <a href={d.url} target="_blank" rel="noreferrer" className="doc-row">
                        <ExternalLinkIcon size={13} color="currentColor" />
                        Abrir
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
