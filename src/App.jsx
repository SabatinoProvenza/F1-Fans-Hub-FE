import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ArticleDetail from "./pages/ArticleDetail"
import AuthPage from "./pages/AuthPage"
import FavoritesPage from "./pages/FavoritesPage"
import MainLayout from "./layout/MainLayout"
import AuthLayout from "./layout/AuthLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route
            path="/community"
            element={
              <div className="container my-5 py-5 text-white">
                Community (coming soon)
              </div>
            }
          />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route
            path="/profile"
            element={
              <div className="container my-5 py-5 text-white">
                Profile (coming soon)
              </div>
            }
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
