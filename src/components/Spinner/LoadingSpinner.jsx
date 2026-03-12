const LoadingSpinner = ({ text = "Caricamento..." }) => {
  return (
    <div className="container my-5 py-5 d-flex flex-column justify-content-center align-items-center text-white">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
