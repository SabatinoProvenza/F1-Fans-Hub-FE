import ArticleRow from "../components/ArticleRaw/ArticleRaw"
import { useEffect, useState } from "react"

export default function NewsSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("http://localhost:8080/api/news")
        if (!res.ok) throw new Error("Errore nel caricamento news")

        const data = await res.json()
        setArticles(data)
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading)
    return <p className="container py-5 text-white">Caricamento news...</p>
  if (error) return <p className="container py-5 text-white">Errore: {error}</p>

  return (
    <section>
      <div className="container">
        <h2 className="display-5 fw-bold mb-4">BREAKING NEWS IN F1</h2>
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
