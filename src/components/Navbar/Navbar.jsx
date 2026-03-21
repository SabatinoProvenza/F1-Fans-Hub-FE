import styles from "../Navbar/Navbar.module.scss"
import logo from "../../assets/F1.svg"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const Navbar = function () {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [location])

  function handleLogout() {
    logout()
    navigate("/")
  }

  function toggleNavbar() {
    setIsOpen((prev) => !prev)
  }

  return (
    <nav className={`navbar navbar-expand-md navbar-dark ${styles.navbar}`}>
      <div className="container">
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          <div className={styles.logoWrapper}>
            <img src={logo} alt="F1 Logo" className={styles.logo} />
            <span className={styles.brandText}>Fans Hub</span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="mainNavbar"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""} ${styles.collapseMenu}`}
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
                  {user.role === "ADMIN" && (
                    <Link className={`nav-link ${styles.link}`} to="/admin">
                      Admin
                    </Link>
                  )}
                  <Link className={`nav-link ${styles.link}`} to="/profile">
                    {user.username}
                  </Link>

                  <button
                    type="button"
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
