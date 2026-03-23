import { TbEdit, TbXboxX } from "react-icons/tb"
import "./Community.scss"

const MAX_COMMENT_LENGTH = 150

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
    <div className="community-comment rounded p-3 border-0">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          <img
            src={comment.userImage}
            alt={comment.username}
            className="community-avatar community-avatar--sm rounded-circle"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
            }}
          />
          <div>
            <div className="community-comment-user fw-semibold">
              {comment.username}
            </div>
            <small className="community-date">
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
              className="community-icon-btn btn btn-sm btn-outline-light border-0 p-1"
              onClick={() => onStartEditing(comment)}
            >
              <TbEdit className="fs-5" />
            </button>

            <button
              type="button"
              className="community-icon-btn danger btn btn-sm btn-outline-danger border-0 p-1"
              onClick={() => onDelete(comment)}
              disabled={deletingCommentId === comment.id}
            >
              <TbXboxX className="fs-5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <fieldset disabled={updatingComment} className="border-0 p-0 m-0">
          <div>
            <textarea
              className="community-textarea form-control mb-2 text-white border-secondary"
              rows="2"
              maxLength={MAX_COMMENT_LENGTH}
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
            />

            <div className="text-end mb-3">
              <small className="text-muted">
                {editCommentContent.length}/{MAX_COMMENT_LENGTH}
              </small>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onCancelEditing}
              >
                Annulla
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={onUpdate}
                disabled={
                  updatingComment ||
                  !editCommentContent.trim() ||
                  editCommentContent.trim().length > MAX_COMMENT_LENGTH
                }
              >
                {updatingComment ? "Salvataggio..." : "Salva"}
              </button>
            </div>
          </div>
        </fieldset>
      ) : (
        <p className="mb-0 community-comment-content">{comment.content}</p>
      )}
    </div>
  )
}

export default CommentItem
