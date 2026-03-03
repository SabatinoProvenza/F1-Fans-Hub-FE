import styles from "../Hero/Hero.module.scss"
import heroImage from "../../assets/f1-image1.avif"

const Hero = function () {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Testo */}
          <div className="col-12 col-lg-6">
            <h1 className={styles.title}>Welcome to the Fast Lane</h1>

            <p className={styles.subtitle}>
              Stay updated with the latest Formula 1 news, race results, team
              insights and driver stories.
            </p>

            <button className="btn btn-primary mt-3">
              Dive Into The Action
            </button>
          </div>

          {/* Immagine */}
          <div className="col-12 col-lg-6">
            <div className={styles.imageWrapper}>
              <img
                src={heroImage}
                alt="Hero placeholder"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
