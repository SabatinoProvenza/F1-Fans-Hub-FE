import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../components/Context/AuthContext"
import "../components/BackOfficePage/BackOfficePage.scss"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"
import { FiX } from "react-icons/fi"

const API_BASE_URL = "https://considerable-ilise-me-stesso-f977c3cb.koyeb.app"

const formatDate = (dateString) => {
  if (!dateString) return "-"

  const date = new Date(dateString)

  return date.toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

const BackofficePage = () => {
  const { user, token, loading } = useAuth()

  const commentsSectionRef = useRef(null)

  const [posts, setPosts] = useState([])
  const [postsPage, setPostsPage] = useState(0)
  const [postsTotalPages, setPostsTotalPages] = useState(0)
  const [postsLoading, setPostsLoading] = useState(false)

  const [usernameFilter, setUsernameFilter] = useState("")
  const [appliedUsernameFilter, setAppliedUsernameFilter] = useState("")

  const [selectedPost, setSelectedPost] = useState(null)

  const [comments, setComments] = useState([])
  const [commentsPage, setCommentsPage] = useState(0)
  const [commentsTotalPages, setCommentsTotalPages] = useState(0)
  const [commentsLoading, setCommentsLoading] = useState(false)

  const [commentUsernameFilter, setCommentUsernameFilter] = useState("")
  const [appliedCommentUsernameFilter, setAppliedCommentUsernameFilter] =
    useState("")

  const [deletingPostId, setDeletingPostId] = useState(null)
  const [deletingCommentId, setDeletingCommentId] = useState(null)

  const [error, setError] = useState("")

  const postsSize = 10
  const commentsSize = 5

  const fetchPosts = async (page = 0, username = appliedUsernameFilter) => {
    setPostsLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: postsSize.toString(),
      })

      if (username.trim()) {
        params.append("username", username.trim())
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/posts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Errore nel recupero dei post")
      }

      const data = await response.json()

      setPosts(data.content || [])
      setPostsPage(data.number || 0)
      setPostsTotalPages(data.totalPages || 0)
    } catch (err) {
      setError(err.message || "Si è verificato un errore")
    } finally {
      setPostsLoading(false)
    }
  }

  const fetchCommentsByPost = async (
    postId,
    page = 0,
    username = appliedCommentUsernameFilter,
  ) => {
    setCommentsLoading(true)
    setError("")

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: commentsSize.toString(),
      })

      if (username.trim()) {
        params.append("username", username.trim())
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/posts/${postId}/comments?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Errore nel recupero dei commenti")
      }

      const data = await response.json()

      setComments(data.content || [])
      setCommentsPage(data.number || 0)
      setCommentsTotalPages(data.totalPages || 0)
    } catch (err) {
      setError(err.message || "Si è verificato un errore")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Vuoi davvero eliminare questo post?")
    if (!confirmed) return

    setDeletingPostId(postId)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione del post")
      }

      if (selectedPost?.id === postId) {
        setSelectedPost(null)
        setComments([])
        setCommentsPage(0)
        setCommentsTotalPages(0)
      }

      if (posts.length === 1 && postsPage > 0) {
        setPostsPage((prev) => prev - 1)
      } else {
        fetchPosts(postsPage, appliedUsernameFilter)
      }
    } catch (err) {
      setError(err.message || "Si è verificato un errore")
    } finally {
      setDeletingPostId(null)
    }
  }

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Vuoi davvero eliminare questo commento?")
    if (!confirmed) return

    setDeletingCommentId(commentId)
    setError("")

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione del commento")
      }

      let newPage = commentsPage

      if (comments.length === 1 && commentsPage > 0) {
        newPage = commentsPage - 1
        setCommentsPage(newPage)
      }

      if (selectedPost) {
        fetchCommentsByPost(
          selectedPost.id,
          newPage,
          appliedCommentUsernameFilter,
        )
      }

      fetchPosts(postsPage, appliedUsernameFilter)
    } catch (err) {
      setError(err.message || "Si è verificato un errore")
    } finally {
      setDeletingCommentId(null)
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    setAppliedUsernameFilter(usernameFilter)
    setPostsPage(0)
    setSelectedPost(null)
    setComments([])
    setCommentsPage(0)
    setCommentsTotalPages(0)
  }

  const handleResetFilter = () => {
    setUsernameFilter("")
    setAppliedUsernameFilter("")
    setPostsPage(0)
    setSelectedPost(null)
    setComments([])
    setCommentsPage(0)
    setCommentsTotalPages(0)
  }

  const handleShowComments = async (post) => {
    setSelectedPost(post)
    setComments([])
    setCommentsPage(0)
    setCommentsTotalPages(0)
    setCommentUsernameFilter("")
    setAppliedCommentUsernameFilter("")

    await fetchCommentsByPost(post.id, 0, "")
  }

  const handleCommentFilterSubmit = (e) => {
    e.preventDefault()
    setAppliedCommentUsernameFilter(commentUsernameFilter)
    setCommentsPage(0)
  }

  const handleResetCommentFilter = () => {
    setCommentUsernameFilter("")
    setAppliedCommentUsernameFilter("")
    setCommentsPage(0)
  }

  const handleCloseComments = () => {
    setSelectedPost(null)
    setComments([])
    setCommentsPage(0)
    setCommentsTotalPages(0)
    setCommentUsernameFilter("")
    setAppliedCommentUsernameFilter("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (user && user.role === "ADMIN" && token) {
      fetchPosts(postsPage, appliedUsernameFilter)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsPage, appliedUsernameFilter, user, token])

  useEffect(() => {
    if (selectedPost && user && user.role === "ADMIN" && token) {
      fetchCommentsByPost(
        selectedPost.id,
        commentsPage,
        appliedCommentUsernameFilter,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsPage, appliedCommentUsernameFilter])

  useEffect(() => {
    if (selectedPost && commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [selectedPost])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="backoffice-page page-enter container py-5 mt-5">
      <div className="mb-4">
        <h1 className="backoffice-title">Admin Page</h1>
        <p className="backoffice-subtitle">Gestione post e commenti</p>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4" role="alert">
          {error}
        </div>
      )}

      <div className="admin-panel mb-4">
        <div className="admin-panel__body">
          <div className="admin-panel__header">
            <div>
              <h2 className="admin-panel__title">Lista Post</h2>
              <p className="admin-panel__subtitle">
                Visualizza tutti i post e filtra per username
              </p>
            </div>
          </div>

          <form onSubmit={handleFilterSubmit} className="admin-filter-bar">
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label htmlFor="usernameFilter" className="form-label">
                  Filtra per utente
                </label>
                <input
                  type="text"
                  id="usernameFilter"
                  className="form-control"
                  placeholder="Inserisci username"
                  value={usernameFilter}
                  onChange={(e) => setUsernameFilter(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4 d-flex justify-content-end align-items-end gap-3">
                <button type="submit" className="btn btn-outline-light ">
                  Cerca
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResetFilter}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>

          {postsLoading ? (
            <div className="admin-empty-state">
              <div className="spinner-border text-light" role="status"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="admin-empty-state">Nessun post trovato</div>
          ) : (
            <div className="admin-post-list">
              {posts.map((post) => (
                <div key={post.id} className="admin-post-card">
                  <div className="admin-post-card__header">
                    <div className="admin-post-card__user">
                      <img
                        src={post.userImage}
                        alt={post.userUsername}
                        className="admin-post-card__avatar"
                      />
                      <div>
                        <h5 className="admin-post-card__username">
                          {post.userUsername}
                        </h5>
                        <small className="admin-post-card__date">
                          Creato il {formatDate(post.createdAt)}
                        </small>
                      </div>
                    </div>

                    <div className="admin-stats">
                      <span className="admin-stat-badge">
                        Like: {post.likesCount}
                      </span>
                      <span className="admin-stat-badge">
                        Commenti: {post.commentsCount}
                      </span>
                    </div>
                  </div>

                  <p className="admin-post-card__content">{post.content}</p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Immagine del post"
                      className="admin-post-card__image"
                    />
                  )}

                  <div className="admin-post-card__actions">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => handleShowComments(post)}
                    >
                      Vedi commenti
                    </button>

                    <button
                      className="btn  btn-danger "
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                    >
                      {deletingPostId === post.id
                        ? "Eliminazione..."
                        : "Elimina"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="admin-pagination comments-pagination">
            <button
              className="btn btn-outline-light"
              onClick={() => setPostsPage((prev) => prev - 1)}
              disabled={postsPage === 0 || postsLoading}
            >
              Precedente
            </button>

            <span className="admin-page-badge comments-page-indicator">
              Pagina {postsTotalPages > 0 ? postsPage + 1 : 0} di{" "}
              {postsTotalPages}
            </span>

            <button
              className="btn btn-outline-light"
              onClick={() => setPostsPage((prev) => prev + 1)}
              disabled={
                postsPage >= postsTotalPages - 1 ||
                postsLoading ||
                postsTotalPages === 0
              }
            >
              Successiva
            </button>
          </div>
        </div>
      </div>

      {selectedPost && (
        <div ref={commentsSectionRef} className="admin-panel">
          <div className="admin-panel__body">
            <div className="admin-panel__header comments-header">
              <div>
                <h2 className="admin-panel__title">Commenti del post</h2>
                <p className="admin-panel__subtitle">
                  Post di{" "}
                  <span className="text-light fw-semibold">
                    {selectedPost.userUsername}
                  </span>
                </p>
              </div>

              <button
                type="button"
                className="comments-close-btn"
                onClick={handleCloseComments}
                title="Chiudi commenti"
                aria-label="Chiudi commenti"
              >
                <FiX />
              </button>
            </div>

            <div className="admin-selected-post">
              <p>{selectedPost.content}</p>
            </div>

            <form
              onSubmit={handleCommentFilterSubmit}
              className="admin-filter-bar"
            >
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="commentUsernameFilter" className="form-label">
                    Filtra commenti per utente
                  </label>
                  <input
                    type="text"
                    id="commentUsernameFilter"
                    className="form-control"
                    placeholder="Inserisci username"
                    value={commentUsernameFilter}
                    onChange={(e) => setCommentUsernameFilter(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4 d-flex justify-content-end align-items-end gap-3">
                  <button type="submit" className="btn btn-outline-light">
                    Cerca
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetCommentFilter}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>

            {commentsLoading ? (
              <div className="admin-empty-state">
                <div className="spinner-border text-light" role="status"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="admin-empty-state">
                Nessun commento trovato per questo post
              </div>
            ) : (
              <div className="admin-comment-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="admin-comment-card">
                    <div className="admin-comment-card__top">
                      <div className="admin-comment-card__user">
                        <img
                          src={comment.userImage}
                          alt={comment.username}
                          className="admin-comment-card__avatar"
                        />
                        <div>
                          <h6 className="admin-comment-card__username">
                            @{comment.username}
                          </h6>
                          <small className="admin-comment-card__date">
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                      </div>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingCommentId === comment.id}
                      >
                        {deletingCommentId === comment.id
                          ? "Eliminazione..."
                          : "Elimina"}
                      </button>
                    </div>

                    <p className="admin-comment-card__content">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="admin-pagination comments-pagination">
              <button
                className="btn btn-outline-light"
                onClick={() => setCommentsPage((prev) => prev - 1)}
                disabled={commentsPage === 0 || commentsLoading}
              >
                Precedente
              </button>

              <span className="admin-page-badge comments-page-indicator">
                Pagina {commentsTotalPages > 0 ? commentsPage + 1 : 0} di{" "}
                {commentsTotalPages}
              </span>

              <button
                className="btn btn-outline-light"
                onClick={() => setCommentsPage((prev) => prev + 1)}
                disabled={
                  commentsPage >= commentsTotalPages - 1 ||
                  commentsLoading ||
                  commentsTotalPages === 0
                }
              >
                Successiva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BackofficePage
