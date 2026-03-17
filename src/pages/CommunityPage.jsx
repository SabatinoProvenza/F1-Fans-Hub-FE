import { useEffect, useState } from "react"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"
import { useAuth } from "../components/Context/AuthContext"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import { TbXboxX } from "react-icons/tb"

const CommunityPage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [posting, setPosting] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const [editingPostId, setEditingPostId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const [editImageFile, setEditImageFile] = useState(null)
  const [editPreviewUrl, setEditPreviewUrl] = useState(null)
  const [removeEditImage, setRemoveEditImage] = useState(false)
  const [updating, setUpdating] = useState(false)

  const token = localStorage.getItem("token")

  const openDeleteModal = (post) => {
    setSelectedPost(post)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSelectedPost(null)
    setShowDeleteModal(false)
  }

  const startEditing = (post) => {
    setEditingPostId(post.id)
    setEditContent(post.content || "")
    setEditImageFile(null)
    setEditPreviewUrl(post.imageUrl || null)
    setRemoveEditImage(false)
  }

  const cancelEditing = () => {
    if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editPreviewUrl)
    }

    setEditingPostId(null)
    setEditContent("")
    setEditImageFile(null)
    setEditPreviewUrl(null)
    setRemoveEditImage(false)
  }

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/post")

        if (!res.ok) {
          throw new Error("Errore nel caricamento dei post")
        }

        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(editPreviewUrl)
      }
    }
  }, [previewUrl, editPreviewUrl])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setImageFile(null)
      setPreviewUrl(null)
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editPreviewUrl)
    }

    setEditImageFile(file)
    setEditPreviewUrl(URL.createObjectURL(file))
    setRemoveEditImage(false)
  }

  const handleRemoveEditImage = () => {
    if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editPreviewUrl)
    }

    setEditImageFile(null)
    setEditPreviewUrl(null)
    setRemoveEditImage(true)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()

    if (!user) return
    if (!content.trim()) return

    try {
      setPosting(true)
      const formData = new FormData()
      formData.append("content", content)

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const res = await fetch("http://localhost:8080/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Errore nella creazione del post")

      const newPost = await res.json()

      setPosts((prev) => [newPost, ...prev])
      setContent("")
      setImageFile(null)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  const handleEditPost = async (postId) => {
    if (!token || !postId) return
    if (!editContent.trim()) return

    try {
      setUpdating(true)

      const formData = new FormData()
      formData.append("content", editContent)
      formData.append("removeImage", removeEditImage)

      if (editImageFile) {
        formData.append("image", editImageFile)
      }

      const res = await fetch(`http://localhost:8080/post/${postId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Errore durante la modifica del post")
      }

      const updatedPost = await res.json()

      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
      )

      setError(null)
      cancelEditing()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost || !token) return

    try {
      const res = await fetch(`http://localhost:8080/post/${selectedPost.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Errore durante l'eliminazione del post")
      }

      setPosts((prev) => prev.filter((post) => post.id !== selectedPost.id))
      closeDeleteModal()
      setError(null)
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return <p className="container my-5 py-5 text-primary">{error}</p>
  }

  return (
    <>
      <div className="container py-5 text-white page-enter">
        <h1 className="my-5 text-center">Community</h1>

        <div className="card mb-5 text-white border-secondary">
          <div className="card-body">
            <form onSubmit={handleCreatePost}>
              <textarea
                className="form-control mb-3 bg-dark text-white border-secondary"
                rows="3"
                placeholder={
                  user
                    ? "Cosa vuoi condividere con la community?"
                    : "Effettua il login per pubblicare un post"
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {previewUrl && (
                <div className="position-relative mb-3">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "300px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                    onClick={() => {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl)
                      }
                      setImageFile(null)
                      setPreviewUrl(null)
                    }}
                  >
                    X
                  </button>
                </div>
              )}

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <label className="btn btn-outline-light m-0">
                    Aggiungi foto
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>

                  {imageFile && (
                    <span className="ms-3 small text-muted">
                      {imageFile.name}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-light"
                  disabled={posting || !content.trim() || !token}
                >
                  {posting ? "Pubblicazione..." : "Pubblica"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && <p className="text-primary mb-4">{error}</p>}

        {posts.length === 0 ? (
          <p className="text-primary">Nessun post disponibile.</p>
        ) : (
          <div className="d-flex flex-column gap-4">
            {posts.map((post) => {
              const isEditing = editingPostId === post.id

              return (
                <div
                  key={post.id}
                  className="card bg-dark text-white border-secondary shadow-sm"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={post.userImage}
                          alt={post.userUsername}
                          className="rounded-circle"
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                          }}
                        />

                        <div>
                          <h6 className="mb-0">{post.userUsername}</h6>
                          <small className="text-muted">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleString("it-IT")
                              : "Data non disponibile"}
                          </small>
                        </div>
                      </div>

                      {user?.id === post.userId && !isEditing && (
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light rounded-3"
                            onClick={() => startEditing(post)}
                          >
                            Modifica
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => openDeleteModal(post)}
                          >
                            <TbXboxX className="fs-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <>
                        <textarea
                          className="form-control mb-3 bg-dark text-white border-secondary"
                          rows="3"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />

                        {editPreviewUrl && (
                          <div className="position-relative mb-3">
                            <img
                              src={editPreviewUrl}
                              alt="preview modifica"
                              className="img-fluid rounded"
                              style={{
                                maxHeight: "300px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                              onClick={handleRemoveEditImage}
                            >
                              X
                            </button>
                          </div>
                        )}

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                          <div>
                            <label className="btn btn-outline-light m-0">
                              Cambia foto
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleEditImageChange}
                              />
                            </label>

                            {editImageFile && (
                              <span className="ms-3 small text-muted">
                                {editImageFile.name}
                              </span>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={cancelEditing}
                            >
                              Annulla
                            </button>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEditPost(post.id)}
                              disabled={updating || !editContent.trim()}
                            >
                              {updating ? "Salvataggio..." : "Salva"}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-3">{post.content}</p>

                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt="immagine del post"
                            className="img-fluid rounded mb-3"
                            style={{
                              maxHeight: "400px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        )}
                      </>
                    )}

                    <div className="d-flex gap-4 text-muted small mt-3">
                      <span>👍 {post.likesCount} like</span>
                      <span>💬 {post.commentsCount} commenti</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        show={showDeleteModal}
        onHide={closeDeleteModal}
        centered
        contentClassName="bg-dark text-white"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title>Eliminare il post?</Modal.Title>
        </Modal.Header>

        <Modal.Body>Sei sicuro di voler eliminare questo post?</Modal.Body>

        <Modal.Footer className="border-secondary">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Annulla
          </Button>

          <Button variant="primary" onClick={handleDeletePost}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CommunityPage
