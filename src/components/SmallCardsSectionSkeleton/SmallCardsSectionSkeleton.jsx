import "./smallCardsSectionSkeleton.scss"

const SmallCardsSectionSkeleton = () => {
  return (
    <section className="page-enter container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="small-skeleton-title shimmer"></div>

        <div className="d-flex gap-2">
          <div className="small-skeleton-btn shimmer"></div>
          <div className="small-skeleton-btn shimmer"></div>
        </div>
      </div>

      <div className="row g-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 d-flex py-1">
            <div className="small-skeleton-card w-100">
              <div className="small-skeleton-image shimmer"></div>

              <div className="small-skeleton-content">
                <div className="small-skeleton-line small-title shimmer"></div>
                <div className="small-skeleton-line shimmer"></div>
                <div className="small-skeleton-line shimmer"></div>
                <div className="small-skeleton-line small-short shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SmallCardsSectionSkeleton
