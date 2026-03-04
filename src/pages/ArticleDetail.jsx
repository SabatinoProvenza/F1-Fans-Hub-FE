import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

const ArticleDetail = function () {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:8080/api/news/${id}`)
        if (!res.ok) throw new Error("Articolo non trovato")
        const data = await res.json()
        setArticle(data)
      } catch (e) {
        setError(e.message)
      }
    }
    load()
  }, [id])

  if (error) {
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

  if (!article)
    return <p className="container py-5 text-white">Caricamento...</p>

  const dateLabel = new Date(article.pubDate).toLocaleDateString("it-IT", {
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
            {article.source} • {dateLabel}
          </p>

          <h1 className="display-5 fw-bold">{article.title}</h1>

          <div className="mt-4 ">
            <img
              src={article.image}
              alt={article.title}
              className="w-100 rounded-4"
              style={{ maxHeight: 520, objectFit: "cover" }}
            />
          </div>

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
            href={article.link}
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
