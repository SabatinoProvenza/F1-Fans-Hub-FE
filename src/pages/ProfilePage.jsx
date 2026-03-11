import { useEffect, useRef, useState } from "react"
import { useAuth } from "../components/Context/AuthContext"
import ProfileCard from "../components/profile/ProfileCard"

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ProfilePage = () => {
  const { user, loading, fetchLoggedUser } = useAuth()

  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [savingField, setSavingField] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

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

  const handleChange = ({ target }) => {
    const { name, value } = target

    setFormData((prev) => ({
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
  }

  const patchUserField = async (url, body, isFormData = false) => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Token non trovato")
    }

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
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || "Errore durante l'aggiornamento")
    }

    return response
  }

  const fieldConfig = {
    username: {
      label: "Username",
      type: "text",
      endpoint: "http://localhost:8080/auth/me/username",
      payloadKey: "username",
      successMessage: "Username aggiornato con successo",
      validate: (value) => {
        if (!value) {
          throw new Error("Lo username non può essere vuoto")
        }
      },
    },
    email: {
      label: "Email",
      type: "email",
      endpoint: "http://localhost:8080/auth/me/email",
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
      const currentValue = user[field] || ""

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
      setError(err.message)
    } finally {
      setSavingField(null)
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
        "http://localhost:8080/auth/me/image",
        imageFormData,
        true,
      )

      await fetchLoggedUser()
      setSuccess("Immagine profilo aggiornata con successo")
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  if (loading) {
    return <p className="text-center mt-5">Caricamento profilo...</p>
  }

  if (!user) {
    return <p className="text-center mt-5">Utente non autenticato</p>
  }

  return (
    <div className="container py-5">
      <h1 className="my-3 py-5 text-center">Il mio profilo</h1>

      <ProfileCard
        user={user}
        error={error}
        success={success}
        formData={formData}
        editingField={editingField}
        savingField={savingField}
        uploadingImage={uploadingImage}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        onChange={handleChange}
        onEditClick={handleEditClick}
        onCancel={handleCancel}
        onSaveField={handleSaveField}
        onImageButtonClick={handleImageButtonClick}
        onImageUpload={handleImageUpload}
      />
    </div>
  )
}

export default ProfilePage
