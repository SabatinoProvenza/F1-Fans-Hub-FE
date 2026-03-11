const PROFILE_IMAGE_STYLE = {
  width: "130px",
  height: "130px",
  objectFit: "cover",
  border: "4px solid #f8f9fa",
}

const ProfileImageSection = ({
  user,
  uploadingImage,
  fileInputRef,
  onImageButtonClick,
  onImageUpload,
}) => {
  return (
    <div className="mb-4">
      <img
        src={user.image}
        alt={user.username}
        className="rounded-circle shadow-sm"
        style={PROFILE_IMAGE_STYLE}
      />

      <div className="mt-3">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={onImageButtonClick}
          disabled={uploadingImage}
        >
          {uploadingImage ? "Caricamento immagine..." : "Modifica immagine"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={onImageUpload}
        />
      </div>
    </div>
  )
}

export default ProfileImageSection
