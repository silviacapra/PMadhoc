import { useState, useEffect } from "react";
import "../dashboard/NewProjectModal.css";

function flattenArticle(article) {
  if (!article) return "";
  if (article.body) return article.body.join("\n\n");
  const parts = [];
  if (article.intro) parts.push(article.intro);
  (article.points || []).forEach((p) => {
    parts.push(`${p.term}: ${p.text}`);
    (p.subitems || []).forEach((s) => parts.push(`- ${s}`));
  });
  if (article.closing) parts.push(article.closing);
  return parts.join("\n\n");
}

export default function ArticleModal({ open, onClose, categories, onCreate, onSave, article }) {
  const isEdit = !!article;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.label || "");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open) return;
    if (article) {
      setTitle(article.title || "");
      setCategory(article.category || categories[0]?.label || "");
      setContent(flattenArticle(article));
    } else {
      setTitle("");
      setCategory(categories[0]?.label || "");
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, article]);

  if (!open) return null;

  function handleSubmit() {
    const body = content
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!title.trim() || body.length === 0) return;
    if (isEdit) {
      onSave(article.id, { title: title.trim(), category, body });
    } else {
      onCreate({ title: title.trim(), category, body });
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? "Editar artículo" : "Añadir artículo"}</h2>

        <div className="modal-field">
          <label>Título</label>
          <input type="text" placeholder="Ej: Reserva de contingencia" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label>Contenido</label>
          <textarea
            rows={10}
            placeholder="Escribe el artículo. Deja una línea en blanco entre párrafos."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn modal-btn--primary" onClick={handleSubmit}>
            {isEdit ? "Guardar cambios" : "Publicar artículo"}
          </button>
        </div>
      </div>
    </div>
  );
}
