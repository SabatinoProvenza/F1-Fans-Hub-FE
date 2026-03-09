import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ArticleDetail from "./pages/ArticleDetail"
import AuthPage from "./pages/AuthPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route
          path="/community"
          element={
            <div className="container py-5 text-white">
              Community (coming soon)
            </div>
          }
        />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/favorites"
          element={
            <div className="container py-5 text-white">
              Favorites (coming soon)
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div className="container py-5 text-white">
              Profile (coming soon)
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
