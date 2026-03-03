import styles from "../Navbar/Navbar.module.scss"
import logo from "../../assets/F1.svg"

const Navbar = function () {
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbar}`}>
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

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto gap-lg-4">
            <a className={`nav-link ${styles.link}`} href="/favorites">
              Preferiti
            </a>
            <a className={`nav-link ${styles.link}`} href="/login">
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
