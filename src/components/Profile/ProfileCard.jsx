import ProfileImageSection from "./ProfileImageSection"
import ProfileInfoBox from "./ProfileInfoBox"
import EditableField from "./EditableField"

const ProfileCard = ({
  user,
  error,
  success,
  formData,
  editingField,
  savingField,
  uploadingImage,
  inputRef,
  fileInputRef,
  onChange,
  onEditClick,
  onCancel,
  onSaveField,
  onImageButtonClick,
  onImageUpload,
}) => {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow border-0 rounded-4 p-4 text-center">
          <ProfileImageSection
            user={user}
            uploadingImage={uploadingImage}
            fileInputRef={fileInputRef}
            onImageButtonClick={onImageButtonClick}
            onImageUpload={onImageUpload}
          />

          {error && (
            <div className="alert alert-primary fade show">{error}</div>
          )}
          {success && (
            <div className="alert alert-dark fade show">{success}</div>
          )}

          <ProfileInfoBox user={user} />

          <EditableField
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            displayValue={user.username}
            isEditing={editingField === "username"}
            isSaving={savingField === "username"}
            inputRef={inputRef}
            onChange={onChange}
            onEdit={() => onEditClick("username")}
            onSave={() => onSaveField("username")}
            onCancel={onCancel}
          />

          <EditableField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            displayValue={user.email}
            isEditing={editingField === "email"}
            isSaving={savingField === "email"}
            inputRef={inputRef}
            onChange={onChange}
            onEdit={() => onEditClick("email")}
            onSave={() => onSaveField("email")}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
