import Hero from "../components/Hero/Hero"
import Navbar from "../components/Navbar/Navbar"
import NewsSection from "../components/NewsSection"
import TrendingSection from "../components/TrendingSection/TrendingSection"

const HomePage = function () {
  return (
    <>
      <Navbar />
      <Hero />
      <NewsSection />
      <TrendingSection />
    </>
  )
}

export default HomePage
