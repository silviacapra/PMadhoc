import { useState } from "react";
import { GraduationCapIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon } from "../icons/Icons";
import { TripleRestriccionDiagram, RiesgosMatrixDiagram, RaciDiagram, StakeholderMatrixDiagram, MoscowDiagram } from "./Diagrams";
import ArticleModal from "./ArticleModal";
import ConfirmDeleteModal from "../shared/ConfirmDeleteModal";
import "./Knowledge.css";

const DIAGRAMS = {
  "triple-restriccion": TripleRestriccionDiagram,
  "riesgos-matriz": RiesgosMatrixDiagram,
  raci: RaciDiagram,
  "stakeholder-matriz": StakeholderMatrixDiagram,
  moscow: MoscowDiagram,
};

function ArticlePost({ article, onBack, onEdit, onDeleteRequest }) {
  const Diagram = DIAGRAMS[article.diagram];
  const isCustom = !article.points;

  return (
    <div>
      <div className="kb-post-header">
        <span className="kb-back" onClick={onBack}>
          ← Volver a la base de conocimiento
        </span>
        <div className="kb-post-actions">
          <span className="kb-edit-link" onClick={onEdit}>
            <PencilIcon size={13} color="currentColor" />
            Editar
          </span>
          <span className="kb-edit-link kb-edit-link--danger" onClick={() => onDeleteRequest(article)}>
            <TrashIcon size={13} color="currentColor" />
            Eliminar
          </span>
        </div>
      </div>
      <h1 className="page-title">{article.title}</h1>
      <p className="page-subtitle">
        {article.category} · {article.readTime} de lectura{article.autor ? ` · Editado por ${article.autor}` : ""}
      </p>
      <div className="section-card kb-post">
        {article.reference && <div className="kb-reference">📖 {article.reference}</div>}

        {isCustom ? (
          article.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)
        ) : (
          <>
            <p>{article.intro}</p>

            {Diagram && (
              <div className="kb-diagram-wrap">
                <Diagram />
              </div>
            )}

            <ul className="kb-points">
              {article.points.map((point) => (
                <li key={point.term}>
                  <span className="kb-point-term">{point.term}:</span> {point.text}
                  {point.subitems && (
                    <ul className="kb-subpoints">
                      {point.subitems.map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {article.closing && <p>{article.closing}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default function Knowledge({ knowledge }) {
  const { categories, articles, addArticleOpen, setAddArticleOpen, addArticle, updateArticle, deleteArticle } = knowledge;
  const [openArticle, setOpenArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (openArticle) {
    const liveArticle = articles.find((a) => a.id === openArticle.id) || openArticle;
    return (
      <>
        <ArticlePost
          article={liveArticle}
          onBack={() => setOpenArticle(null)}
          onEdit={() => setEditingArticle(liveArticle)}
          onDeleteRequest={setDeleteTarget}
        />
        <ArticleModal
          open={!!editingArticle}
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          categories={categories}
          onSave={(id, patch) => {
            updateArticle(id, patch);
            setEditingArticle(null);
          }}
        />
        <ConfirmDeleteModal
          item={deleteTarget}
          itemLabel="artículo"
          itemName={deleteTarget?.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={(id) => {
            deleteArticle(id);
            setDeleteTarget(null);
            setOpenArticle(null);
          }}
        />
      </>
    );
  }

  const visibleArticles = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;

  return (
    <div>
      <div className="kb-header-row">
        <div>
          <h1 className="page-title">Base de conocimiento</h1>
          <p className="page-subtitle">
            Conceptos, procesos y buenas prácticas de project management, explicados sin la densidad de un manual de certificación.
          </p>
        </div>
        <button className="new-project-btn" onClick={() => setAddArticleOpen(true)}>
          <PlusIcon size={16} color="currentColor" />
          Añadir artículo
        </button>
      </div>

      <div className="kb-categories">
        {categories.map((cat) => {
          const active = activeCategory === cat.label;
          return (
            <span
              key={cat.label}
              className={`kb-category-pill ${active ? "kb-category-pill--active" : ""}`}
              onClick={() => setActiveCategory(active ? null : cat.label)}
            >
              <span className="kb-category-emoji">{cat.emoji}</span>
              {cat.label}
            </span>
          );
        })}
      </div>

      <div className="kb-articles">
        {visibleArticles.map((art) => (
          <div key={art.id || art.title} className="kb-article" onClick={() => setOpenArticle(art)}>
            <div className="kb-article-main">
              <div className="kb-article-icon">
                <GraduationCapIcon size={18} color="var(--blue-primary)" />
              </div>
              <div>
                <span className="kb-article-title">{art.title}</span>
                <span className="kb-article-meta">
                  {art.category} · {art.readTime}
                </span>
              </div>
            </div>
            <ChevronRightIcon size={18} color="#B7B7B7" />
          </div>
        ))}
        {visibleArticles.length === 0 && <p className="kb-empty">No hay artículos en esta categoría todavía.</p>}
      </div>

      <ArticleModal open={addArticleOpen} onClose={() => setAddArticleOpen(false)} categories={categories} onCreate={addArticle} />
    </div>
  );
}
