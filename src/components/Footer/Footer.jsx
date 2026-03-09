import styles from "./Footer.module.scss"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const Footer = function () {
  const year = new Date().getFullYear()
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={styles.brand}>F1 Fans Hub</span>
          </div>

          <div className={styles.center}>
            <Link to="/favorites" className={styles.link}>
              Preferiti
            </Link>
            <Link to="/community" className={styles.link}>
              Community
            </Link>
            {!loading &&
              (user ? (
                <>
                  <Link className={styles.link} to="/profile">
                    {user.username}
                  </Link>

                  <button onClick={handleLogout} className={styles.buttonLink}>
                    Logout
                  </button>
                </>
              ) : (
                <Link className={styles.link} to="/login">
                  Login
                </Link>
              ))}
          </div>

          <div className={styles.right}>
            <span className={styles.copy}>© {year}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
