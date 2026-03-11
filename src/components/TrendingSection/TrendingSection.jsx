import { Link } from "react-router-dom"
import styles from "./TrendingSection.module.scss"

const TrendingSection = function ({ articles }) {
  return (
    <section className={`container my-5 ${styles.section}`}>
      <h2 className="display-4 fw-bold mb-5 text-uppercase">Trending Topics</h2>

      <div className="row g-4">
        {articles.map((topic) => (
          <div key={topic.id} className="col-12 col-md-6 col-lg-4">
            <div className={styles.card}>
              <h4 className={`mb-4 ${styles.cardTitle}`}>{topic.title}</h4>
              <p className={styles.cardDescription}>{topic.description}</p>

              <Link to={`/articles/${topic.id}`} className={styles.arrowBtn}>
                →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrendingSection
