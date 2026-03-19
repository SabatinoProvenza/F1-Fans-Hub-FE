import { useEffect, useState, useRef } from "react"
import LoadingSpinner from "../components/Spinner/LoadingSpinner"
import { useAuth } from "../components/Context/AuthContext"
import { TbEdit, TbXboxX } from "react-icons/tb"
import { GrLike } from "react-icons/gr"
import { FaRegComment } from "react-icons/fa"
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../components/Community/communityService"
import DeleteConfirmModal from "../components/Community/DeleteConfirmModal"
import CreatePostForm from "../components/Community/CreatePostForm"
import CommentItem from "../components/Community/CommentItem"
import "../components/Community/Community.scss"

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

  const [commentsByPost, setCommentsByPost] = useState({})
  const [showCommentsByPost, setShowCommentsByPost] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [loadingCommentsByPost, setLoadingCommentsByPost] = useState({})
  const [postingCommentByPost, setPostingCommentByPost] = useState({})
  const [commentsPageByPost, setCommentsPageByPost] = useState({})
  const [commentsHasMoreByPost, setCommentsHasMoreByPost] = useState({})
  const [loadingMoreCommentsByPost, setLoadingMoreCommentsByPost] = useState({})

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentContent, setEditCommentContent] = useState("")
  const [updatingComment, setUpdatingComment] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState(null)

  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null)
  const [selectedCommentPostId, setSelectedCommentPostId] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)

  const token = localStorage.getItem("token")

  const openDeleteCommentModal = (postId, comment) => {
    setSelectedComment(comment)
    setSelectedCommentPostId(postId)
    setShowDeleteCommentModal(true)
  }

  const closeDeleteCommentModal = () => {
    setSelectedComment(null)
    setSelectedCommentPostId(null)
    setShowDeleteCommentModal(false)
  }

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

    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
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

    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
  }

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditCommentContent(comment.content)
  }

  const cancelEditingComment = () => {
    setEditingCommentId(null)
    setEditCommentContent("")
  }

  const handleLoadMoreComments = async (postId) => {
    const currentPage = commentsPageByPost[postId] ?? 0
    await loadComments(postId, currentPage + 1)
  }

  const handleUpdateComment = async (postId, commentId) => {
    if (!token) return
    if (!editCommentContent.trim()) return

    try {
      setUpdatingComment(true)

      const updatedComment = await updateComment(
        token,
        commentId,
        editCommentContent,
      )

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      }))

      cancelEditingComment()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setUpdatingComment(false)
    }
  }

  const handleDeleteComment = async () => {
    if (!token || !selectedComment || !selectedCommentPostId) return

    try {
      setDeletingCommentId(selectedComment.id)

      await deleteComment(token, selectedComment.id)

      setCommentsByPost((prev) => ({
        ...prev,
        [selectedCommentPostId]: (prev[selectedCommentPostId] || []).filter(
          (comment) => comment.id !== selectedComment.id,
        ),
      }))

      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedCommentPostId
            ? {
                ...post,
                commentsCount: Math.max(0, post.commentsCount - 1),
              }
            : post,
        ),
      )

      if (editingCommentId === selectedComment.id) {
        cancelEditingComment()
      }

      closeDeleteCommentModal()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setDeletingCommentId(null)
    }
  }

  const toggleComments = async (postId) => {
    const isOpen = showCommentsByPost[postId]

    if (isOpen) {
      setShowCommentsByPost((prev) => ({
        ...prev,
        [postId]: false,
      }))
      return
    }

    setShowCommentsByPost((prev) => ({
      ...prev,
      [postId]: true,
    }))

    if (!commentsByPost[postId]) {
      await loadComments(postId, 0)
    }
  }

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }))
  }

  const loadComments = async (postId, pageToLoad = 0) => {
    try {
      if (pageToLoad === 0) {
        setLoadingCommentsByPost((prev) => ({ ...prev, [postId]: true }))
      } else {
        setLoadingMoreCommentsByPost((prev) => ({ ...prev, [postId]: true }))
      }

      const data = await getComments(postId, pageToLoad, 5)

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]:
          pageToLoad === 0
            ? data.content
            : [...(prev[postId] || []), ...data.content],
      }))

      setCommentsPageByPost((prev) => ({
        ...prev,
        [postId]: data.number,
      }))

      setCommentsHasMoreByPost((prev) => ({
        ...prev,
        [postId]: !data.last,
      }))
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      if (pageToLoad === 0) {
        setLoadingCommentsByPost((prev) => ({ ...prev, [postId]: false }))
      } else {
        setLoadingMoreCommentsByPost((prev) => ({ ...prev, [postId]: false }))
      }
    }
  }

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getPosts(token, page, size)

      setPosts(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, size])

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

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
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

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImageFile(null)
    setPreviewUrl(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveEditImage = () => {
    if (editPreviewUrl && editPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(editPreviewUrl)
    }

    setEditImageFile(null)
    setEditPreviewUrl(null)
    setRemoveEditImage(true)

    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
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

      await createPost(token, formData)

      setContent("")
      setImageFile(null)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(null)
      setError(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      setPage(0)
      await loadPosts(0)
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

      const updatedPost = await updatePost(token, postId, formData)

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
      await deletePost(token, selectedPost.id)
      closeDeleteModal()
      setError(null)

      await loadPosts(page)
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  const handleToggleLike = async (post) => {
    if (!token) return

    try {
      const updatedPost = await toggleLike(token, post)

      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
      )
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  const handleCreateComment = async (postId) => {
    if (!token) return

    const content = commentInputs[postId]?.trim()

    if (!content) return

    try {
      setPostingCommentByPost((prev) => ({ ...prev, [postId]: true }))

      const newComment = await createComment(token, postId, content)

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])],
      }))

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post,
        ),
      )

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }))
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setPostingCommentByPost((prev) => ({ ...prev, [postId]: false }))
    }
  }

  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [error])

  if (loading) return <LoadingSpinner />

  return (
    <>
      <div className="community-page container py-5 text-white page-enter">
        <h1 className="community-title my-5 text-center">Community</h1>

        {error && <div className="community-toast">{error}</div>}
        <CreatePostForm
          user={user}
          content={content}
          setContent={setContent}
          imageFile={imageFile}
          previewUrl={previewUrl}
          posting={posting}
          token={token}
          fileInputRef={fileInputRef}
          onSubmit={handleCreatePost}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
        />

        {posts.length === 0 ? (
          <p className="community-empty">Nessun post disponibile.</p>
        ) : (
          <div className=" d-flex flex-column gap-4">
            {posts.map((post) => {
              const isEditing = editingPostId === post.id

              return (
                <div key={post.id} className="community-post card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={post.userImage}
                          alt={post.userUsername}
                          className="community-avatar community-avatar--md rounded-circle"
                        />

                        <div className="community-post-header">
                          <h6 className="mb-0">{post.userUsername}</h6>
                          <small className="community-date">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleString("it-IT")
                              : "Data non disponibile"}
                          </small>
                        </div>
                      </div>

                      {user?.id === post.userId && !isEditing && (
                        <div className="d-flex gap-0 align-items-center flex-shrink-0">
                          <button
                            type="button"
                            className="community-icon-btn btn btn-sm btn-outline-light border-0"
                            onClick={() => startEditing(post)}
                          >
                            <TbEdit className="fs-3" />
                          </button>

                          <button
                            type="button"
                            className="community-icon-btn danger btn btn-sm btn-outline-danger border-0"
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
                          className="community-textarea form-control mb-3"
                          rows="3"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />

                        {editPreviewUrl && (
                          <div className="community-preview position-relative mb-3">
                            <img
                              src={editPreviewUrl}
                              alt="preview modifica"
                              className="img-fluid community-preview-image"
                            />
                            <button
                              type="button"
                              className="community-remove-btn btn btn-danger btn-sm position-absolute top-0 end-0 m-2 border-0"
                              onClick={handleRemoveEditImage}
                            >
                              <TbXboxX className="fs-4" />
                            </button>
                          </div>
                        )}

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-2">
                          <div>
                            <label className="btn btn-outline-light">
                              Cambia foto
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={editFileInputRef}
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
                              className=" btn btn-primary"
                              onClick={cancelEditing}
                            >
                              Annulla
                            </button>

                            <button
                              className="btn btn-outline-light"
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
                        <p className="mb-3 community-post-content">
                          {post.content}
                        </p>

                        <div className="community-post-image-wrapper mb-3">
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl}
                              alt="immagine del post"
                              className="community-post-image"
                              onClick={() => setSelectedImage(post.imageUrl)}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </div>
                      </>
                    )}

                    <div className="community-actions d-flex gap-3 text-muted small align-items-center">
                      <button
                        type="button"
                        className={`community-action-btn btn d-flex align-items-center gap-2 ${
                          post.likedByCurrentUser
                            ? "is-liked"
                            : "btn-outline-light"
                        }`}
                        onClick={() => handleToggleLike(post)}
                        disabled={!token}
                      >
                        <GrLike /> <span>{post.likesCount}</span>
                      </button>

                      <button
                        type="button"
                        className="community-action-btn btn btn-outline-light d-flex align-items-center gap-2"
                        onClick={() => toggleComments(post.id)}
                      >
                        <FaRegComment /> <span>{post.commentsCount}</span>
                      </button>
                    </div>

                    {showCommentsByPost[post.id] && (
                      <div className="community-comments mt-3 pt-3">
                        {token && (
                          <div className="d-flex gap-2 mb-3">
                            <input
                              type="text"
                              className="community-input form-control text-white border-secondary"
                              placeholder="Scrivi un commento..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                handleCommentInputChange(
                                  post.id,
                                  e.target.value,
                                )
                              }
                            />

                            <button
                              type="button"
                              className="btn btn-outline-light "
                              onClick={() => handleCreateComment(post.id)}
                              disabled={
                                postingCommentByPost[post.id] ||
                                !commentInputs[post.id]?.trim()
                              }
                            >
                              {postingCommentByPost[post.id]
                                ? "Invio..."
                                : "Invia"}
                            </button>
                          </div>
                        )}

                        {!token && (
                          <p className="small community-muted-text">
                            Effettua il login per commentare.
                          </p>
                        )}

                        {loadingCommentsByPost[post.id] ? (
                          <p className="small community-muted-text">
                            Caricamento commenti...
                          </p>
                        ) : commentsByPost[post.id]?.length > 0 ? (
                          <>
                            <div className="d-flex flex-column gap-3">
                              {commentsByPost[post.id]?.map((comment) => {
                                const isEditingComment =
                                  editingCommentId === comment.id
                                const isOwner = user?.id === comment.userId

                                return (
                                  <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    isEditing={isEditingComment}
                                    isOwner={isOwner}
                                    editCommentContent={editCommentContent}
                                    setEditCommentContent={
                                      setEditCommentContent
                                    }
                                    updatingComment={updatingComment}
                                    deletingCommentId={deletingCommentId}
                                    onStartEditing={startEditingComment}
                                    onCancelEditing={cancelEditingComment}
                                    onUpdate={() =>
                                      handleUpdateComment(post.id, comment.id)
                                    }
                                    onDelete={() =>
                                      openDeleteCommentModal(post.id, comment)
                                    }
                                  />
                                )
                              })}
                            </div>

                            {commentsHasMoreByPost[post.id] && (
                              <div className="mt-3 text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-light"
                                  onClick={() =>
                                    handleLoadMoreComments(post.id)
                                  }
                                  disabled={loadingMoreCommentsByPost[post.id]}
                                >
                                  {loadingMoreCommentsByPost[post.id]
                                    ? "Caricamento..."
                                    : "Carica altri commenti"}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="small community-muted-text mb-0">
                            Nessun commento
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="community-pagination d-flex justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-outline-light"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 0}
          >
            Precedente
          </button>

          <span className="text-white">
            Pagina {page + 1} di {totalPages}
          </span>

          <button
            className="btn btn-outline-light"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages - 1}
          >
            Successiva
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="preview" />
        </div>
      )}

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={closeDeleteModal}
        onConfirm={handleDeletePost}
        title="Eliminare il post?"
        body="Sei sicuro di voler eliminare questo post?"
      />

      <DeleteConfirmModal
        show={showDeleteCommentModal}
        onHide={closeDeleteCommentModal}
        onConfirm={handleDeleteComment}
        title="Eliminare il commento?"
        body="Sei sicuro di voler eliminare questo commento?"
        loading={deletingCommentId === selectedComment?.id}
      />
    </>
  )
}

export default CommunityPage
