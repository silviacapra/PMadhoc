import { KnowledgeIcon, ChevronRightIcon } from "../icons/Icons";
import "./Knowledge.css";

export default function Knowledge({ knowledge }) {
  const { categories, articles } = knowledge;

  return (
    <div>
      <h1 className="page-title">Base de conocimiento</h1>
      <p className="page-subtitle">
        Conceptos, procesos y buenas prácticas de project management, explicados sin la densidad de un manual de certificación.
      </p>

      <div className="kb-categories">
        {categories.map((cat) => (
          <span key={cat.label} className="kb-category-pill" style={{ background: cat.bg, color: cat.color }}>
            {cat.label}
          </span>
        ))}
      </div>

      <div className="kb-articles">
        {articles.map((art) => (
          <div key={art.title} className="kb-article">
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
      </div>
    </div>
  );
}
