import "./BackToTopButton.scss"
import { useState, useEffect } from "react"
import { FaArrowUp } from "react-icons/fa"

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!visible) return null

  return (
    <button className="back-to-top-btn" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  )
}

export default BackToTopButton
