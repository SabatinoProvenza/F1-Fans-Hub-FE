import { createRoot } from "react-dom/client"
import "./index.css"
import "./styles/main.scss"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import App from "./App.jsx"
import AuthProvider from "./components/Context/AuthContext.jsx"

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
