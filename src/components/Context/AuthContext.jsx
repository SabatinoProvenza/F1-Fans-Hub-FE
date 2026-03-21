import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

const AuthProvider = function ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  const fetchLoggedUser = async function () {
    const token = localStorage.getItem("token")

    if (!token) {
      setUser(null)
      setLoading(false)
      setToken(null)
      return
    }

    try {
      const response = await fetch(
        "https://considerable-ilise-me-stesso-f977c3cb.koyeb.app/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Utente non autenticato")
      }

      const userData = await response.json()
      setUser(userData)
      setToken(token)
    } catch (error) {
      localStorage.removeItem("token")
      console.error(error)
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(token) {
    localStorage.setItem("token", token)
    await fetchLoggedUser()
  }

  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  useEffect(() => {
    fetchLoggedUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchLoggedUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

export default AuthProvider
