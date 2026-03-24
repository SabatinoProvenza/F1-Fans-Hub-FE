import { useEffect, useState } from "react"
import styles from "./AuthForm.module.scss"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const AuthForm = function () {
  const [mode, setMode] = useState("login")
  const isRegister = mode === "register"

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { login } = useAuth()

  const initialForm = {
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (msg.type !== "success" || mode !== "register") return

    const timer = setTimeout(() => {
      setMode("login")
      clearMessages()
    }, 3000)

    return () => clearTimeout(timer)
  }, [msg, mode])

  const resetForm = function () {
    setForm(initialForm)
  }

  const clearMessages = function () {
    setMsg({ type: "", text: "" })
    setErrors([])
  }

  const normalizePersonName = (value) => {
    return value
      .replace(/\s+/g, " ")
      .trimStart()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleChange = function (e) {
    const { name, value } = e.target

    let normalizedValue = value

    if (name === "name" || name === "surname") {
      normalizedValue = normalizePersonName(value)
    }

    if (name === "username") {
      normalizedValue = value.toLowerCase()
    }

    if (name === "email") {
      normalizedValue = value.toLowerCase()
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: normalizedValue,
    }))
  }

  const toggleMode = function () {
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"))
    clearMessages()
    resetForm()
  }

  const validateRegisterForm = function () {
    if (!form.name) {
      return "Inserisci il nome."
    }

    if (!form.surname) {
      return "Inserisci il cognome."
    }

    if (!form.username) {
      return "Inserisci il tuo username."
    }

    if (form.password.length < 6) {
      return "La password deve avere almeno 6 caratteri."
    }

    if (form.password !== form.confirmPassword) {
      return "Le password non coincidono."
    }

    return null
  }

  const getEndpoint = function () {
    if (isRegister) {
      return "https://considerable-ilise-me-stesso-f977c3cb.koyeb.app/auth/register"
    }

    return "https://considerable-ilise-me-stesso-f977c3cb.koyeb.app/auth/login"
  }

  const getPayload = function () {
    if (isRegister) {
      return {
        name: form.name.trim(),
        surname: form.surname.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }
    }

    return {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }
  }

  const handleSubmit = async function (e) {
    e.preventDefault()

    clearMessages()

    if (isRegister) {
      const validationError = validateRegisterForm()

      if (validationError) {
        setMsg({ type: "error", text: validationError })
        return
      }
    }

    const endpoint = getEndpoint()
    const payload = getPayload()

    try {
      setLoading(true)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (isRegister && data?.errors && Array.isArray(data.errors)) {
          setErrors(data.errors)
        } else {
          setErrors([])
        }

        setMsg({
          type: "error",
          text: data?.message || "Errore: controlla i dati inseriti.",
        })
        return
      }

      if (isRegister) {
        setMsg({
          type: "success",
          text: "Registrazione completata con successo! Verrai reindirizzato al login...",
        })

        resetForm()
        setErrors([])
        return
      }

      if (data?.token) {
        await login(data.token)
      }

      setMsg({
        type: "success",
        text: "Login effettuato con successo!",
      })

      resetForm()
      setErrors([])
      navigate(from, { replace: true })
    } catch (e) {
      console.error(e)
      setMsg({
        type: "error",
        text: "Si è verificato un errore. Riprova.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.page} py-5`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5 col-xl-4">
            <div className={styles.card}>
              <h3 className={styles.title}>
                {isRegister ? "Registrati" : "Login"}
              </h3>

              <div className={styles.subtitle}>
                {isRegister
                  ? "Crea un nuovo account"
                  : "Accedi con le tue credenziali"}
              </div>

              {msg.text && (
                <div
                  className={[
                    msg.type === "success"
                      ? styles.alertSuccess
                      : styles.alertError,
                  ].join(" ")}
                  role="alert"
                >
                  <div>{msg.text}</div>

                  {errors.length > 0 && (
                    <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {isRegister && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="name" className={styles.label}>
                        Nome
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className={styles.input}
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Mario"
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="surname" className={styles.label}>
                        Cognome
                      </label>
                      <input
                        id="surname"
                        name="surname"
                        type="text"
                        className={styles.input}
                        value={form.surname}
                        onChange={handleChange}
                        placeholder="Rossi"
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="username" className={styles.label}>
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className={styles.input}
                        value={form.username}
                        onChange={handleChange}
                        placeholder="mario.rossi"
                        required
                      />
                    </div>
                  </>
                )}

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="mario@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>

                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={styles.input}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete={
                        isRegister ? "new-password" : "current-password"
                      }
                      placeholder="••••••••"
                      required
                    />

                    <button
                      type="button"
                      className={styles.showBtn}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {isRegister && (
                  <div className={styles.field}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                      Conferma password
                    </label>

                    <div className={styles.passwordWrapper}>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        className={styles.input}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />

                      <button
                        type="button"
                        className={styles.showBtn}
                        onClick={() => setShowConfirm((prev) => !prev)}
                      >
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.button}
                  disabled={loading}
                >
                  {loading
                    ? "Attendi..."
                    : isRegister
                      ? "Crea account"
                      : "Accedi"}
                </button>
              </form>

              <div className={styles.switch}>
                {isRegister ? "Hai già un account?" : "Non hai un account?"}{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={toggleMode}
                >
                  {isRegister ? "Login" : "Registrati"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
