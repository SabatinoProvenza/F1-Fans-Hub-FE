import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

const AuthProvider = function ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLoggedUser = async function () {
    const token = localStorage.getItem("token")

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Utente non autenticato")
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem("token")
      console.error(error)
      setUser(null)
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

  useEffect(() => {}, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        fetchLoggedUser,
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
