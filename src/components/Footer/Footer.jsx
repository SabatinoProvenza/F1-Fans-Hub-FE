import styles from "./Footer.module.scss"
import { Link } from "react-router-dom"

const Footer = function () {
  const year = new Date().getFullYear()

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
            <Link to="/login" className={styles.link}>
              Login
            </Link>
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
