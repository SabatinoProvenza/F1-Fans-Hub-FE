import { Link } from "react-router-dom"
import styles from "./SmallArticleCard.module.scss"

const SmallArticleCard = function ({ article }) {
  const truncate = function (text, length = 100) {
    if (!text) return ""
    return text.length > length ? text.slice(0, length) + "..." : text
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={article.image} alt={article.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <p className={styles.source}>{article.source}</p>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.description}>{truncate(article.description)}</p>

        <Link to={`/news/${article.guid}`} className="btn btn-primary mt-auto">
          Leggi articolo
        </Link>
      </div>
    </article>
  )
}

export default SmallArticleCard
