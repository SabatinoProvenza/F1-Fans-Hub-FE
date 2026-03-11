import CommunityCTA from "../components/CommunityCTA/CommunityCTA"

import Hero from "../components/Hero/Hero"

import NewsSection from "../components/NewsSection"
import TrendingSection from "../components/TrendingSection/TrendingSection"
import { useState, useEffect } from "react"

const HomePage = function () {
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

  const breaking = articles.slice(0, 30)
  const trending = articles.slice(37, 40)

  return (
    <>
      <Hero />
      <section id="news" className="section">
        {loading && (
          <p className="container py-5 text-white">Caricamento news...</p>
        )}
        {error && <p className="container py-5 text-white">Errore: {error}</p>}
        {!loading && !error && <NewsSection articles={breaking} />}
      </section>

      <section className="section">
        {!loading && !error ? <TrendingSection articles={trending} /> : null}
      </section>

      <section className="section">
        <CommunityCTA />
      </section>
    </>
  )
}

export default HomePage
