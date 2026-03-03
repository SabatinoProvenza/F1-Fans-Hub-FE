import { Link } from "react-router-dom"
import styles from "./CommunityCTA.module.scss"

const CommunityCTA = function () {
  return (
    <section className="container my-5">
      <div className={styles.wrapper}>
        <p className={styles.kicker}>Formula 1 Fans Hub</p>

        <h2 className={styles.title}>
          Join the conversation and <br />
          share your thoughts!
        </h2>

        <Link to="/community" className={`btn btn-primary ${styles.ctaBtn}`}>
          DICCI LA TUA
        </Link>
      </div>
    </section>
  )
}

export default CommunityCTA
