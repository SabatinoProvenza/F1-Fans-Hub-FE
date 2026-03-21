import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ArticleDetail from "./pages/ArticleDetail"
import AuthPage from "./pages/AuthPage"
import FavoritesPage from "./pages/FavoritesPage"
import MainLayout from "./layout/MainLayout"
import AuthLayout from "./layout/AuthLayout"
import ProfilePage from "./pages/ProfilePage"
import NotFound from "./pages/NotFound"
import CommunityPage from "./pages/CommunityPage"
import BackofficePage from "./pages/BackOfficePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:guid" element={<ArticleDetail />} />
          <Route path="articles/:articleId" element={<ArticleDetail />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<BackofficePage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
