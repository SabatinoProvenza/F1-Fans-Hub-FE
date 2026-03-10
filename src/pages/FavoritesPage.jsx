import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Devi effettuare il login")
      setLoading(false)
      return
    }

    async function loadFavorites() {
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

  if (loading) return <p className="text-white">Caricamento...</p>

  if (error) return <p className="text-danger">{error}</p>

  return (
    <>
      <Navbar />

      <div className=" container py-5 text-white ">
        <h1 className="my-5">I tuoi preferiti</h1>

        {favorites.length === 0 && <p>Nessun articolo salvato.</p>}

        <div className="row g-4">
          {favorites.map((article) => (
            <div className="col-md-4" key={article.id}>
              <div className="card h-100 text-white border-0">
                <img
                  src={article.image}
                  className="card-img-top"
                  alt={article.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{article.title}</h5>

                  <p className="card-text text-muted small">{article.source}</p>

                  <Link
                    to={`/articles/${article.id}`}
                    className="btn btn-secondary mt-auto"
                  >
                    Leggi articolo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default FavoritesPage
