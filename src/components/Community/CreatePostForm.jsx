import { TbXboxX } from "react-icons/tb"

const CreatePostForm = ({
  user,
  content,
  setContent,
  imageFile,
  previewUrl,
  posting,
  token,
  fileInputRef,
  onSubmit,
  onImageChange,
  onRemoveImage,
}) => {
  return (
    <div className="card mb-5 text-white border-secondary">
      <div className="card-body">
        <form onSubmit={onSubmit}>
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
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 border-0"
                onClick={onRemoveImage}
              >
                <TbXboxX className="fs-4" />
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
                  ref={fileInputRef}
                  onChange={onImageChange}
                />
              </label>

              {imageFile && (
                <span className="ms-3 small text-muted">{imageFile.name}</span>
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
  )
}

export default CreatePostForm
