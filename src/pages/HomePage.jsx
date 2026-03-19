import BackToTopButton from "../components/BackToTopButton/BackToTopButton"
import CommunityCTA from "../components/CommunityCTA/CommunityCTA"
import Hero from "../components/Hero/Hero"
import NewsSection from "../components/NewsSection"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"
import TrendingSection from "../components/TrendingSection/TrendingSection"
import SmallCardsSection from "../components/SmallCards/SmallCardsSection"
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

  const featured = articles.slice(0, 6)
  const middleArticles = articles.slice(6, articles.length - 3)
  const trending = articles.slice(-3)

  return (
    <>
      <Hero />

      <section id="news" className="section">
        {loading && <LoadingSpinner />}
        {error && <p className="container py-5 text-white">Errore: {error}</p>}
        {!loading && !error && <NewsSection articles={featured} />}
      </section>

      <section className="section">
        {loading && <LoadingSpinner />}
        {error && <p className="container py-5 text-white">Errore: {error}</p>}
        {!loading && !error && <SmallCardsSection articles={middleArticles} />}
      </section>

      <section className="section">
        {loading && <LoadingSpinner />}
        {error && <p className="container py-5 text-white">Errore: {error}</p>}
        {!loading && !error && <TrendingSection articles={trending} />}
      </section>

      <section className="section">
        <CommunityCTA />
      </section>

      <BackToTopButton />
    </>
  )
}

export default HomePage
