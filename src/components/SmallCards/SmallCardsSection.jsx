import SmallArticleCard from "../SmallCards/SmallArticleCard"

const SmallCardsSection = function ({ articles }) {
  if (!articles?.length) return null

  return (
    <section className="page-enter container my-5">
      <h2 className="display-5 fw-bold mb-5">MORE NEWS</h2>

      <div className="row g-4">
        {articles.map((article) => (
          <div key={article.guid} className="col-12 col-md-6 d-flex">
            <SmallArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SmallCardsSection
