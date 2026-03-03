import styles from "../ArticleRaw/ArticleRaw.module.scss"

const ArticleRow = function ({ article, reverse = false }) {
  return (
    <article className="container my-5">
      <div
        className={`row align-items-center g-4 ${reverse ? "flex-lg-row-reverse" : ""}`}
      >
        {/* Immagine */}
        <div className="col-12 col-lg-7">
          <div className={styles.imageWrap}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-100 h-100"
            />
          </div>
        </div>

        {/* Testo */}
        <div className="col-12 col-lg-5">
          <div className={styles.textBox}>
            <h3 className="mb-3">{article.title}</h3>

            <p className="text-muted fw-semibold mb-2">
              {article.source?.name}
            </p>
            <p className="mb-0">{article.excerpt}</p>

            <button className="btn btn-primary mt-3">Read More</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleRow
