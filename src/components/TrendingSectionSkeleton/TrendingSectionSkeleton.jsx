import "./trendingSectionSkeleton.scss"

const TrendingSectionSkeleton = () => {
  return (
    <section className="page-enter container my-5">
      <div className="trending-skeleton-title shimmer mb-5"></div>

      <div className="row g-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="trending-skeleton-card">
              <div className="trending-skeleton-line title shimmer"></div>
              <div className="trending-skeleton-line shimmer"></div>
              <div className="trending-skeleton-line shimmer"></div>
              <div className="trending-skeleton-line short shimmer"></div>

              <div className="trending-skeleton-arrow shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrendingSectionSkeleton
