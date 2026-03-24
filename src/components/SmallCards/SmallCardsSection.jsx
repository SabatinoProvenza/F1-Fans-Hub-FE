import { useEffect, useMemo, useState } from "react"
import SmallArticleCard from "../SmallCards/SmallArticleCard"

const SmallCardsSection = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 576) {
        setItemsPerPage(4)
      } else if (window.innerWidth < 992) {
        setItemsPerPage(4)
      } else {
        setItemsPerPage(9)
      }
    }

    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)

    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  const pages = useMemo(() => {
    if (!articles?.length) return []

    const chunked = []
    for (let i = 0; i < articles.length; i += itemsPerPage) {
      chunked.push(articles.slice(i, i + itemsPerPage))
    }
    return chunked
  }, [articles, itemsPerPage])

  const safeCurrentPage =
    pages.length > 0 ? Math.min(currentPage, pages.length - 1) : 0

  const changePage = (newPage) => {
    setIsAnimating(false)

    requestAnimationFrame(() => {
      setCurrentPage(newPage)
      setIsAnimating(true)
    })
  }

  const goPrev = () => {
    const prevPage =
      safeCurrentPage === 0 ? pages.length - 1 : safeCurrentPage - 1
    changePage(prevPage)
  }

  const goNext = () => {
    const nextPage = (safeCurrentPage + 1) % pages.length
    changePage(nextPage)
  }

  useEffect(() => {
    if (pages.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      const nextPage = (safeCurrentPage + 1) % pages.length
      changePage(nextPage)
    }, 7000)

    return () => clearInterval(interval)
  }, [pages.length, isHovered, safeCurrentPage])

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  if (!articles?.length) return null

  return (
    <section
      className="page-enter container my-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-5 fw-bold m-0">MORE NEWS</h2>

        {pages.length > 1 && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={goPrev}
              aria-label="Articoli precedenti"
            >
              ←
            </button>
            <button
              className="btn btn-outline-light"
              onClick={goNext}
              aria-label="Articoli successivi"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className={`small-cards-page ${isAnimating ? "is-visible" : ""}`}>
        <div className="row g-4">
          {pages[safeCurrentPage]?.map((article) => (
            <div key={article.guid} className="col-12 col-md-6 col-lg-4 d-flex">
              <SmallArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SmallCardsSection
