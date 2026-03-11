import ArticleRow from "../components/ArticleRaw/ArticleRaw"

const NewsSection = function ({ articles }) {
  return (
    <section>
      <div className="container">
        <h2 className="display-5 fw-bold mb-4">BREAKING NEWS </h2>
      </div>

      {articles.map((a, index) => (
        <ArticleRow
          key={a.id}
          article={a}
          reverse={index % 2 === 1} // alterna: 0 normale, 1 reverse, 2 normale...
        />
      ))}
    </section>
  )
}

export default NewsSection
