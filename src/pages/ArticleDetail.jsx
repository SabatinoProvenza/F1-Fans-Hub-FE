import { Link, useParams } from "react-router-dom"
import { mockArticles } from "../mockArticles"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

const ArticleDetail = function () {
  const { id } = useParams()
  const article = mockArticles.find((a) => a.id === id)

  if (!article) {
    return (
      <div className="container py-5 text-white">
        <h1>Articolo non trovato</h1>
        <p className="text-muted">L’articolo con id {id} non esiste.</p>
        <Link className="btn btn-primary mt-3" to="/">
          Torna alla Home
        </Link>
      </div>
    )
  }

  const dateLabel = new Date(article.publishedAt).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <>
      <Navbar />
      <div className="container py-5 my-5 text-white">
        <Link to="/" className="btn btn-primary rounded-pill px-4 mb-4 fw-bold">
          ← Torna alla Home
        </Link>

        <div className="mt-4">
          <p className="text-muted fw-semibold mb-2">
            {article.source?.name} • {dateLabel}
          </p>

          <h1 className="display-5 fw-bold">{article.title}</h1>

          <div className="mt-4">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-100 rounded-4"
              style={{ maxHeight: 520, objectFit: "cover" }}
            />
          </div>

          <p className="mt-4 fs-5 text-white-50">{article.excerpt}</p>

          <div className="mt-4 fs-5" style={{ lineHeight: 1.7 }}>
            {article.content
              .trim()
              .split("\n")
              .filter(Boolean)
              .map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-light mt-3"
          >
            Leggi alla fonte
          </a>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ArticleDetail
