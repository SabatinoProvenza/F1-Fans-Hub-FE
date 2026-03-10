import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const openRemoveModal = (article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const closeRemoveModal = () => {
    setShowModal(false)
    setSelectedArticle(null)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Devi effettuare il login")
      setLoading(false)
      return
    }

    const loadFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8080/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Errore nel caricamento preferiti")

        const data = await res.json()

        setFavorites(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const handleRemoveFavorite = async () => {
    const articleId = selectedArticle.id
    const token = localStorage.getItem("token")

    if (!token || !selectedArticle) return

    try {
      const res = await fetch(`http://localhost:8080/favorites/${articleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Errore nella rimozione dai preferiti")
      }

      // aggiorna la lista locale
      setFavorites((prev) => prev.filter((article) => article.id !== articleId))
      closeRemoveModal()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading)
    return <p className="container my-5 py-5  text-white">Caricamento...</p>

  if (error) return <p className="container my-5 py-5 text-primary">{error}</p>

  return (
    <>
      <div className=" container py-5 text-white ">
        <h1 className="my-5">I tuoi preferiti</h1>

        {favorites.length === 0 && (
          <p className="text-primary">Nessun articolo salvato.</p>
        )}

        <div className="row g-4">
          {favorites.map((article) => (
            <div className="col-md-4" key={article.id}>
              <div className="card h-100 text-white border-0 d-flex flex-column">
                <img
                  src={article.image}
                  className="card-img-top"
                  alt={article.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column ">
                  <h5 className="card-title">{article.title}</h5>

                  <p className="card-text text-muted small">{article.source}</p>

                  <div className="d-flex justify-content-between mt-auto">
                    <Link
                      to={`/articles/${article.id}`}
                      className="btn bg-dark text-white mt-auto"
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
      </div>
      <Modal
        show={showModal}
        onHide={closeRemoveModal}
        centered
        contentClassName="bg-dark text-white"
      >
        <Modal.Header closeButton>
          <Modal.Title>Rimuovere dai preferiti?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Vuoi davvero rimuovere l'articolo dai preferiti?
        </Modal.Body>

        <Modal.Footer>
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
