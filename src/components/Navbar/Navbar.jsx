import styles from "../Navbar/Navbar.module.scss"
import logo from "../../assets/F1.svg"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const Navbar = function () {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <nav className={`navbar navbar-expand-md navbar-dark ${styles.navbar}`}>
      <div className="container">
        <a className={`navbar-brand ${styles.brand}`} href="/">
          <div className={styles.logoWrapper}>
            <img src={logo} alt="F1 Logo" className={styles.logo} />
            <span className={styles.brandText}>Fans Hub</span>
          </div>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${styles.collapseMenu}`}
          id="mainNavbar"
        >
          <div className="navbar-nav ms-auto gap-lg-4">
            <Link className={`nav-link ${styles.link}`} to="/favorites">
              Preferiti
            </Link>

            <Link className={`nav-link ${styles.link}`} to="/community">
              Community
            </Link>

            {!loading &&
              (user ? (
                <>
                  <Link className={`nav-link ${styles.link}`} to="/profile">
                    {user.username}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={`nav-link ${styles.link}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link className={`nav-link ${styles.link}`} to="/login">
                  Login
                </Link>
              ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
