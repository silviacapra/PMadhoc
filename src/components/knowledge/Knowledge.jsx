import { useState } from "react";
import { KnowledgeIcon, ChevronRightIcon } from "../icons/Icons";
import { TripleRestriccionDiagram, RiesgosMatrixDiagram, RaciDiagram, StakeholderMatrixDiagram, MoscowDiagram } from "./Diagrams";
import "./Knowledge.css";

const DIAGRAMS = {
  "triple-restriccion": TripleRestriccionDiagram,
  "riesgos-matriz": RiesgosMatrixDiagram,
  raci: RaciDiagram,
  "stakeholder-matriz": StakeholderMatrixDiagram,
  moscow: MoscowDiagram,
};

function ArticlePost({ article, onBack }) {
  const Diagram = DIAGRAMS[article.diagram];

  return (
    <div>
      <span className="kb-back" onClick={onBack}>
        ← Volver a la base de conocimiento
      </span>
      <h1 className="page-title">{article.title}</h1>
      <p className="page-subtitle">
        {article.category} · {article.readTime} de lectura
      </p>
      <div className="section-card kb-post">
        <div className="kb-reference">📖 {article.reference}</div>

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
      </div>
    </div>
  );
}

export default function Knowledge({ knowledge }) {
  const { categories, articles } = knowledge;
  const [openArticle, setOpenArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  if (openArticle) {
    return <ArticlePost article={openArticle} onBack={() => setOpenArticle(null)} />;
  }

  const visibleArticles = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;

  return (
    <div>
      <h1 className="page-title">Base de conocimiento</h1>
      <p className="page-subtitle">
        Conceptos, procesos y buenas prácticas de project management, explicados sin la densidad de un manual de certificación.
      </p>

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
          <div key={art.title} className="kb-article" onClick={() => setOpenArticle(art)}>
            <div className="kb-article-main">
              <div className="kb-article-icon">
                <KnowledgeIcon size={18} color="var(--blue-primary)" />
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
    </div>
  );
}
