import { TbEdit, TbXboxX } from "react-icons/tb"

const CommentItem = ({
  comment,
  isEditing,
  isOwner,
  editCommentContent,
  setEditCommentContent,
  updatingComment,
  deletingCommentId,
  onStartEditing,
  onCancelEditing,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="bg-black rounded p-3 border border-secondary">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={comment.userImage}
            alt={comment.username}
            className="rounded-circle"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
            }}
          />
          <div>
            <div className="fw-semibold">{comment.username}</div>
            <small className="text-muted">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleString("it-IT")
                : "Data non disponibile"}
            </small>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="d-flex gap-2 align-items-center flex-shrink-0">
            <button
              type="button"
              className="btn btn-sm btn-outline-light border-0 p-1"
              onClick={() => onStartEditing(comment)}
            >
              <TbEdit className="fs-5" />
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger border-0 p-1"
              onClick={() => onDelete(comment)}
              disabled={deletingCommentId === comment.id}
            >
              <TbXboxX className="fs-5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            className="form-control mb-2 bg-dark text-white border-secondary"
            rows="2"
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
          />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onCancelEditing}
            >
              Annulla
            </button>

            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={onUpdate}
              disabled={updatingComment || !editCommentContent.trim()}
            >
              {updatingComment ? "Salvataggio..." : "Salva"}
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-0">{comment.content}</p>
      )}
    </div>
  )
}

export default CommentItem
