import ArticleRow from "../components/ArticleRaw/ArticleRaw"
import { mockArticles } from "../mockArticles"

export default function NewsSection() {
  return (
    <section>
      <div className="container">
        <h2 className="display-5 fw-bold mb-4">BREAKING NEWS IN F1</h2>
      </div>

      {mockArticles.map((a, index) => (
        <ArticleRow
          key={a.id}
          article={a}
          reverse={index % 2 === 1} // alterna: 0 normale, 1 reverse, 2 normale...
        />
      ))}
    </section>
  )
}
