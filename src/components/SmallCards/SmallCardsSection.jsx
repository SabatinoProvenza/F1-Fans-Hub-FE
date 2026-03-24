import { useEffect, useMemo, useState } from "react"
import SmallArticleCard from "../SmallCards/SmallArticleCard"
import "./SmallCardsSection.scss"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const SmallCardsSection = ({ articles }) => {
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isHovered, setIsHovered] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSliding, setIsSliding] = useState(false)

  // Responsive + reset index corretto
  useEffect(() => {
    const updateItemsPerPage = () => {
      const mobile = window.innerWidth < 576
      const nextItemsPerPage = mobile ? 4 : window.innerWidth < 992 ? 6 : 9

      setIsMobile(mobile)

      setItemsPerPage((prev) => {
        if (prev !== nextItemsPerPage) {
          setCurrentIndex(1)
          setIsTransitioning(true)
          setIsSliding(false)
        }
        return nextItemsPerPage
      })
    }

    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)

    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  // Pagine
  const pages = useMemo(() => {
    if (!articles?.length) return []

    const chunked = []
    for (let i = 0; i < articles.length; i += itemsPerPage) {
      chunked.push(articles.slice(i, i + itemsPerPage))
    }
    return chunked
  }, [articles, itemsPerPage])

  // Infinite loop
  const extendedPages = useMemo(() => {
    if (pages.length <= 1) return pages
    return [pages[pages.length - 1], ...pages, pages[0]]
  }, [pages])

  // Autoplay (NO mobile)
  useEffect(() => {
    if (pages.length <= 1 || isHovered || isMobile || isSliding) return

    const interval = setInterval(() => {
      setIsSliding(true)
      setCurrentIndex((prev) => prev + 1)
      setIsTransitioning(true)
    }, 7000)

    return () => clearInterval(interval)
  }, [pages.length, isHovered, isMobile, isSliding])

  const goNext = () => {
    if (pages.length <= 1 || isSliding) return
    setIsSliding(true)
    setCurrentIndex((prev) => prev + 1)
    setIsTransitioning(true)
  }

  const goPrev = () => {
    if (pages.length <= 1 || isSliding) return
    setIsSliding(true)
    setCurrentIndex((prev) => prev - 1)
    setIsTransitioning(true)
  }

  // Gestione infinite loop
  const handleTransitionEnd = () => {
    if (pages.length <= 1) return

    if (currentIndex === extendedPages.length - 1) {
      setIsTransitioning(false)
      setCurrentIndex(1)
      return
    }

    if (currentIndex === 0) {
      setIsTransitioning(false)
      setCurrentIndex(pages.length)
      return
    }

    setIsSliding(false)
  }

  // Riattiva transition dopo reset invisibile
  useEffect(() => {
    if (isTransitioning) return

    const id = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        setIsTransitioning(true)
        setIsSliding(false)
      })
      return () => cancelAnimationFrame(id2)
    })

    return () => cancelAnimationFrame(id)
  }, [isTransitioning])

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
              className="btn btn-outline-light carousel-btn"
              onClick={goPrev}
              disabled={isSliding}
              aria-label="Articoli precedenti"
            >
              <FiChevronLeft />
            </button>

            <button
              className="btn btn-outline-light carousel-btn"
              onClick={goNext}
              disabled={isSliding}
              aria-label="Articoli successivi"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="small-cards-viewport">
        <div
          className={`small-cards-track ${
            !isTransitioning ? "no-transition" : ""
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedPages.map((page, pageIndex) => (
            <div className="small-cards-slide" key={pageIndex}>
              <div className="small-cards-slide-inner">
                <div className="row g-4">
                  {page.map((article, articleIndex) => (
                    <div
                      key={`${article.guid}-${pageIndex}-${articleIndex}`}
                      className="col-12 col-md-6 col-lg-4 d-flex"
                    >
                      <SmallArticleCard article={article} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SmallCardsSection
