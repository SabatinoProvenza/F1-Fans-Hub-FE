import styles from "./TrendingSection.module.scss"

const trendingTopics = [
  {
    id: 1,
    title: "Fan Reactions to Recent Races",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, totam aperiam harum nemo in ducimus sapiente architecto fuga earum quisquam maiores, nobis veniam soluta? Pariatur consequuntur nostrum ipsam quam maxime?",
  },
  {
    id: 2,
    title: "Controversial Decisions in Racing",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, totam aperiam harum nemo in ducimus sapiente architecto fuga earum quisquam maiores, nobis veniam soluta? Pariatur consequuntur nostrum ipsam quam maxime?",
  },
  {
    id: 3,
    title: "Innovations Shaping the Future",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, totam aperiam harum nemo in ducimus sapiente architecto fuga earum quisquam maiores, nobis veniam soluta? Pariatur consequuntur nostrum ipsam quam maxime?",
  },
]

const TrendingSection = function () {
  return (
    <section className={`container my-5 ${styles.section}`}>
      <h2 className="display-4 fw-bold mb-5 text-uppercase">
        Trending Topics in Formula 1
      </h2>

      <div className="row g-4">
        {trendingTopics.map((topic) => (
          <div key={topic.id} className="col-12 col-md-6 col-lg-4">
            <div className={styles.card}>
              <h4 className="mb-4">{topic.title}</h4>
              <p>{topic.text}</p>

              <button className={styles.arrowBtn}>→</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrendingSection
