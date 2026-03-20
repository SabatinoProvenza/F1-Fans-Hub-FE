import { Link } from "react-router-dom"
import styles from "./SmallArticleCard.module.scss"

const SmallArticleCard = function ({ article }) {
  const truncate = (text, length = 110) => {
    if (!text) return ""
    return text.length > length ? text.slice(0, length) + "..." : text
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
    })
  }

  return (
    <Link to={`/news/${article.guid}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={article.image} alt={article.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.source}>{article.source}</span>
          <span className={styles.date}>{formatDate(article.pubDate)}</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>

        <p className={styles.description}>{truncate(article.description)}</p>
      </div>
    </Link>
  )
}

export default SmallArticleCard
