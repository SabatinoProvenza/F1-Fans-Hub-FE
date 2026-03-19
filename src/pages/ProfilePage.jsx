import { useEffect, useRef, useState } from "react"
import { useAuth } from "../components/Context/AuthContext"
import ProfileCard from "../components/Profile/ProfileCard"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
}

const INITIAL_PASSWORD_DATA = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ProfilePage = () => {
  const { user, loading, fetchLoggedUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [passwordData, setPasswordData] = useState(INITIAL_PASSWORD_DATA)
  const [savingField, setSavingField] = useState(null)
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const openDeleteModal = () => {
    resetMessages()
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (deletingAccount) return
    setShowDeleteModal(false)
  }

  useEffect(() => {
    if (!user) return

    setFormData({
      username: user.username || "",
      email: user.email || "",
    })
  }, [user])

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  useEffect(() => {
    if (!error && !success) return

    const timer = setTimeout(() => {
      setError("")
      setSuccess("")
    }, 3000)

    return () => clearTimeout(timer)
  }, [error, success])

  const resetMessages = () => {
    setError("")
    setSuccess("")
  }

  const resetFormData = () => {
    if (!user) return

    setFormData({
      username: user.username || "",
      email: user.email || "",
    })
  }

  const resetPasswordData = () => {
    setPasswordData(INITIAL_PASSWORD_DATA)
  }

  const getToken = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Sessione non valida. Effettua di nuovo il login.")
    }

    return token
  }

  const getErrorMessage = async (
    response,
    fallback = "Si è verificato un errore",
  ) => {
    try {
      const data = await response.json()

      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return data.errors[0]
      }

      return data?.message || fallback
    } catch {
      try {
        const text = await response.text()
        return text || fallback
      } catch {
        return fallback
      }
    }
  }

  const patchUserField = async (url, body, isFormData = false) => {
    const token = getToken()

    const options = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? body : JSON.stringify(body),
    }

    if (!isFormData) {
      options.headers["Content-Type"] = "application/json"
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("L'immagine è troppo grande!")
      }
      const message = await getErrorMessage(
        response,
        "Errore durante l'aggiornamento",
      )
      throw new Error(message)
    }

    return response
  }

  const handleChange = ({ target }) => {
    const { name, value } = target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = ({ target }) => {
    const { name, value } = target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditClick = (field) => {
    resetMessages()
    setEditingField(field)
  }

  const handleCancel = () => {
    resetMessages()
    setEditingField(null)
    resetFormData()
    resetPasswordData()
  }

  const fieldConfig = {
    username: {
      endpoint: "http://localhost:8080/users/me/username",
      payloadKey: "username",
      successMessage: "Username aggiornato con successo",
      validate: (value) => {
        if (!value) {
          throw new Error("Lo username non può essere vuoto")
        }
      },
    },
    email: {
      endpoint: "http://localhost:8080/users/me/email",
      payloadKey: "email",
      successMessage: "Email aggiornata con successo",
      validate: (value) => {
        if (!value) {
          throw new Error("L'email non può essere vuota")
        }

        if (!EMAIL_REGEX.test(value)) {
          throw new Error("Inserisci un'email valida")
        }
      },
    },
  }

  const handleSaveField = async (field) => {
    const config = fieldConfig[field]

    if (!config || !user) return

    setSavingField(field)
    resetMessages()

    try {
      const newValue = formData[field].trim()
      const currentValue = (user[field] || "").trim()

      config.validate(newValue)

      if (newValue === currentValue) {
        setSuccess("Nessuna modifica da salvare")
        setEditingField(null)
        return
      }

      await patchUserField(config.endpoint, {
        [config.payloadKey]: newValue,
      })

      await fetchLoggedUser()
      setSuccess(config.successMessage)
      setEditingField(null)
    } catch (err) {
      console.error(err)
      setError(err.message || "Errore durante il salvataggio")
    } finally {
      setSavingField(null)
    }
  }

  const handleSavePassword = async () => {
    setSavingPassword(true)
    resetMessages()

    try {
      const currentPassword = passwordData.currentPassword.trim()
      const newPassword = passwordData.newPassword.trim()
      const confirmPassword = passwordData.confirmPassword.trim()

      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Compila tutti i campi password")
      }

      if (newPassword.length < 6) {
        throw new Error("La nuova password deve contenere almeno 6 caratteri")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Le password non coincidono")
      }

      if (currentPassword === newPassword) {
        throw new Error(
          "La nuova password deve essere diversa da quella attuale",
        )
      }

      await patchUserField("http://localhost:8080/users/me/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      })

      setSuccess("Password aggiornata con successo")
      resetPasswordData()
      setEditingField(null)
    } catch (err) {
      console.error(err)
      setError(err.message || "Errore durante l'aggiornamento della password")
    } finally {
      setSavingPassword(false)
    }
  }

  const handleImageButtonClick = () => {
    resetMessages()
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setUploadingImage(true)
    resetMessages()

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Seleziona un file immagine valido")
      }

      const imageFormData = new FormData()
      imageFormData.append("image", file)

      await patchUserField(
        "http://localhost:8080/users/me/image",
        imageFormData,
        true,
      )

      await fetchLoggedUser()
      setSuccess("Immagine profilo aggiornata con successo")
    } catch (err) {
      console.error(err)
      setError(err.message || "Errore durante il caricamento dell'immagine")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)
    resetMessages()

    try {
      const token = getToken()

      const response = await fetch("http://localhost:8080/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Errore durante l'eliminazione dell'account",
        )
        throw new Error(message)
      }

      setShowDeleteModal(false)
      await logout()
      navigate("/")
    } catch (err) {
      console.error(err)
      setError(err.message || "Errore durante l'eliminazione dell'account")
      setShowDeleteModal(false)
    } finally {
      setDeletingAccount(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <p className="container text-danger text-center py-5 mt-5">
        Utente non autenticato
      </p>
    )
  }

  return (
    <div className="container py-5 page-enter">
      <h1 className="my-3 py-5 text-center">Il mio profilo</h1>

      <ProfileCard
        user={user}
        error={error}
        success={success}
        formData={formData}
        passwordData={passwordData}
        editingField={editingField}
        savingField={savingField}
        savingPassword={savingPassword}
        uploadingImage={uploadingImage}
        deletingAccount={deletingAccount}
        showDeleteModal={showDeleteModal}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        onChange={handleChange}
        onPasswordChange={handlePasswordChange}
        onEditClick={handleEditClick}
        onCancel={handleCancel}
        onSaveField={handleSaveField}
        onSavePassword={handleSavePassword}
        onImageButtonClick={handleImageButtonClick}
        onImageUpload={handleImageUpload}
        onOpenDeleteModal={openDeleteModal}
        onCloseDeleteModal={closeDeleteModal}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default ProfilePage
