import CommunityCTA from "../components/CommunityCTA/CommunityCTA"
import Footer from "../components/Footer/Footer"
import Hero from "../components/Hero/Hero"
import Navbar from "../components/Navbar/Navbar"
import NewsSection from "../components/NewsSection"
import TrendingSection from "../components/TrendingSection/TrendingSection"

const HomePage = function () {
  return (
    <>
      <Navbar />
      <Hero />
      <section id="news" className="section">
        <NewsSection />
      </section>

      <section className="section">
        <TrendingSection />
      </section>

      <section className="section">
        <CommunityCTA />
      </section>

      <Footer />
    </>
  )
}

export default HomePage
