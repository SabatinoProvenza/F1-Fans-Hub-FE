import "./newsSectionSkeleton.scss"

const NewsSectionSkeleton = () => {
  return (
    <section>
      <div className="container py-4">
        <h2 className="display-5 fw-bold mb-4">
          <div className="skeleton-title shimmer"></div>
        </h2>
      </div>

      {[...Array(6)].map((_, index) => {
        const isReverse = index % 2 === 1

        return (
          <div key={index} className="container mb-5">
            <div className="row align-items-center">
              {/* IMAGE */}
              <div className={`col-md-6 ${isReverse ? "order-md-2" : ""}`}>
                <div className="skeleton-image shimmer"></div>
              </div>

              {/* TEXT */}
              <div className={`col-md-6 ${isReverse ? "order-md-1" : ""}`}>
                <div className="skeleton-text">
                  <div className="skeleton-line title shimmer"></div>
                  <div className="skeleton-line shimmer"></div>
                  <div className="skeleton-line shimmer"></div>
                  <div className="skeleton-line short shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default NewsSectionSkeleton
