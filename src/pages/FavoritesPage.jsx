import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const [sortBy, setSortBy] = useState("savedAt-desc")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(9)

  const token = localStorage.getItem("token")

  const openRemoveModal = (article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const closeRemoveModal = () => {
    setShowModal(false)
    setSelectedArticle(null)
  }

  const loadFavorites = async (page = currentPage) => {
    if (!token) {
      setError("Devi effettuare il login")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const [sort, direction] = sortBy.split("-")

    try {
      const res = await fetch(
        `https://considerable-ilise-me-stesso-f977c3cb.koyeb.app/favorites?page=${page}&size=${pageSize}&sort=${sort}&direction=${direction}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) throw new Error("Errore nel caricamento preferiti")

      const data = await res.json()

      setFavorites(data.content || [])
      setTotalPages(data.totalPages || 0)
      setCurrentPage(data.number || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, currentPage])

  const handleRemoveFavorite = async () => {
    if (!selectedArticle) return

    const articleGuid = selectedArticle.guid

    if (!token) return

    try {
      const res = await fetch(
        `https://considerable-ilise-me-stesso-f977c3cb.koyeb.app/${articleGuid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        throw new Error("Errore nella rimozione dai preferiti")
      }

      closeRemoveModal()

      if (favorites.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
      } else {
        loadFavorites(currentPage)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(0)
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) return <p className="container my-5 py-5 text-primary">{error}</p>

  return (
    <>
      <div className="container py-5 text-white page-enter">
        <div className="my-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <h1 className="m-0 text-center text-md-start">I tuoi preferiti</h1>

          {favorites.length > 0 && (
            <div>
              <Form.Select
                value={sortBy}
                onChange={handleSortChange}
                className="outline-primary"
              >
                <option value="savedAt-desc">Salvati più recentemente</option>
                <option value="savedAt-asc">Salvati meno recentemente</option>
                <option value="pubDate-desc">
                  Pubblicati più recentemente
                </option>
                <option value="pubDate-asc">
                  Pubblicati meno recentemente
                </option>
              </Form.Select>
            </div>
          )}
        </div>

        {favorites.length === 0 && (
          <p className="text-primary">Nessun articolo salvato.</p>
        )}

        <div className="row g-4">
          {favorites.map((article) => (
            <div className="col-md-6 col-lg-4" key={article.articleId}>
              <div className="card article-card h-100 text-white border-0 d-flex flex-column">
                <img
                  src={article.image}
                  className="card-img-top"
                  alt={article.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>

                  <p className="card-text text-muted small mb-1">
                    {article.source}
                  </p>

                  <p className="card-text text-muted small mb-1">
                    Pubblicato:{" "}
                    {new Date(article.pubDate).toLocaleDateString("it-IT")}
                  </p>

                  <p className="card-text text-muted small mb-3">
                    Salvato:{" "}
                    {new Date(article.savedAt).toLocaleDateString("it-IT")}
                  </p>

                  <div className="d-flex justify-content-between mt-auto">
                    <Link
                      to={`/articles/${article.articleId}`}
                      className="btn btn-outline-light mt-auto"
                    >
                      Leggi articolo
                    </Link>

                    <button
                      className="btn btn-primary"
                      onClick={() => openRemoveModal(article)}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
            <button
              className="btn btn-outline-light"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
            >
              Precedente
            </button>

            <span className="text-white">
              Pagina {currentPage + 1} di {totalPages}
            </span>

            <button
              className="btn btn-outline-light"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              Successiva
            </button>
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        onHide={closeRemoveModal}
        centered
        contentClassName="bg-dark text-white"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title>Rimuovere dai preferiti?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Vuoi davvero rimuovere l'articolo dai preferiti?
        </Modal.Body>

        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={closeRemoveModal}>
            Annulla
          </Button>

          <Button variant="primary" onClick={handleRemoveFavorite}>
            Rimuovi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FavoritesPage
