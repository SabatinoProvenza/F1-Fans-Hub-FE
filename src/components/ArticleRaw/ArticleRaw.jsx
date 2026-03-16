import styles from "../ArticleRaw/ArticleRaw.module.scss"
import { Link } from "react-router-dom"

const ArticleRow = function ({ article, reverse = false }) {
  const truncate = function (text, length = 160) {
    if (!text) return ""
    return text.length > length ? text.slice(0, length) + "..." : text
  }

  return (
    <article className="container my-5">
      <div
        className={`row align-items-center g-4 ${reverse ? "flex-lg-row-reverse" : ""}`}
      >
        {/* Immagine */}
        <div className="col-12 col-lg-7 article-card">
          <div className={styles.imageWrap}>
            <img
              src={article.image}
              alt={article.title}
              className="w-100 h-100"
            />
          </div>
        </div>

        {/* Testo */}
        <div className="col-12 col-lg-5 article-card">
          <div className={styles.textBox}>
            <h3 className="mb-3">{article.title}</h3>

            <p className="text-muted fw-semibold mb-2">{article.source}</p>
            <p className="mb-0">{truncate(article.description)}</p>

            <Link to={`/news/${article.guid}`} className="btn btn-primary mt-3">
              Scopri di più
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleRow
