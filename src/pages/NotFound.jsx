import { Link } from "react-router-dom"

const NotFound = function () {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>404</h1>
      <p>Oops, questa pagina non esiste.</p>
      <Link to="/" className="btn btn-danger">
        Torna alla Home
      </Link>
    </div>
  )
}

export default NotFound
