import styles from "../Hero/Hero.module.scss"
import heroImage from "../../assets/f1-image1.avif"

const Hero = function () {
  return (
    <section className={styles.hero}>
      <div className="container page-enter">
        <div className="row align-items-center g-5">
          {/* Testo */}
          <div className="col-12 col-lg-6">
            <h1 className={styles.title}>Benvenuti nella Fast Lane</h1>

            <p className={styles.subtitle}>
              Tutta l’adrenalina della Formula 1 in un unico hub. News,
              risultati e discussioni per chi vive la velocità curva dopo curva.
            </p>

            <a
              href="#news"
              className="btn btn-primary rounded-pill px-4 mt-3 fw-bold"
            >
              Salta all'azione
            </a>
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
