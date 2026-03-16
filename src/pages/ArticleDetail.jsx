import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { BsHeart, BsHeartFill } from "react-icons/bs"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"

const ArticleDetail = function () {
  const { guid, articleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [article, setArticle] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token")

        let url = ""

        if (articleId) {
          url = `http://localhost:8080/users/me/articles/${articleId}`
        } else if (guid) {
          url = token
            ? `http://localhost:8080/users/me/news/${guid}`
            : `http://localhost:8080/api/news/${guid}`
        } else {
          throw new Error("Identificatore articolo mancante")
        }

        const res = await fetch(url, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        })

        if (res.status === 401) {
          throw new Error("Devi effettuare il login")
        }

        if (res.status === 403) {
          throw new Error("Non sei autorizzato")
        }

        if (res.status === 404) {
          throw new Error("Articolo non trovato")
        }

        if (!res.ok) {
          throw new Error("Errore nel caricamento dell'articolo")
        }

        const data = await res.json()
        setArticle(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [guid, articleId])

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login", {
        state: { from: location.pathname },
      })
      return
    }

    if (!article) return

    try {
      setFavoriteLoading(true)

      const res = await fetch("http://localhost:8080/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      })

      if (res.status === 401) {
        throw new Error("Non sei autenticato")
      }

      if (res.status === 403) {
        throw new Error("Non sei autorizzato")
      }

      if (!res.ok) {
        throw new Error("Errore nel salvataggio dei preferiti")
      }

      const savedArticle = await res.json()
      setArticle(savedArticle)
    } catch (e) {
      console.error(e.message)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const dateLabel = article?.pubDate
    ? new Date(article.pubDate).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className="container py-5 my-5 text-white page-enter">
      {loading && <LoadingSpinner />}

      {!loading && error && (
        <div>
          <h1>Articolo non trovato</h1>
          <p className="text-muted">L’articolo che hai cercato non esiste.</p>
          <Link className="btn btn-primary mt-3" to="/">
            Torna alla Home
          </Link>
        </div>
      )}

      {!loading && !error && article && (
        <div className="mt-4">
          <p className="text-muted fw-semibold mb-2">
            {article.source} • {dateLabel}
          </p>

          <h1 className="display-5 fw-bold">{article.title}</h1>

          <div className="mt-4 d-flex justify-content-center">
            <img
              src={article.image}
              alt={article.title}
              className="img-fluid rounded-4"
              style={{ maxHeight: 520, objectFit: "cover" }}
            />
          </div>

          <div className="mt-4 fs-5" style={{ lineHeight: 1.7 }}>
            {article.description
              .trim()
              .split("\n")
              .filter(Boolean)
              .map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
          </div>

          <div className="mt-4 d-flex gap-3 align-items-center">
            <button
              onClick={handleAddFavorite}
              disabled={favoriteLoading || article.isFavorite}
              className={`btn rounded-pill px-4 fw-semibold d-flex align-items-center gap-2 ${
                article.isFavorite ? "btn-light" : "btn-outline-light"
              }`}
            >
              {favoriteLoading ? (
                "Salvataggio..."
              ) : article.isFavorite ? (
                <>
                  <BsHeartFill className="text-primary" />
                  Nei preferiti
                </>
              ) : (
                <>
                  <BsHeart />
                  Salva nei preferiti
                </>
              )}
            </button>

            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light rounded-pill px-4"
            >
              Leggi alla fonte
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleDetail
