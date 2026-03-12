import EditableField from "./EditableField"
import EditablePasswordField from "./EditablePasswordField"
import { Button, Modal } from "react-bootstrap"
import ProfileImageSection from "./ProfileImageSection"
import ProfileInfoBox from "./ProfileInfoBox"

const ProfileCard = ({
  user,
  error,
  success,
  formData,
  passwordData,
  editingField,
  savingField,
  savingPassword,
  uploadingImage,
  deletingAccount,
  showDeleteModal,
  inputRef,
  fileInputRef,
  onChange,
  onPasswordChange,
  onEditClick,
  onCancel,
  onSaveField,
  onSavePassword,
  onImageButtonClick,
  onImageUpload,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onDeleteAccount,
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

          <EditablePasswordField
            isEditing={editingField === "password"}
            isSaving={savingPassword}
            passwordData={passwordData}
            onChange={onPasswordChange}
            onEdit={() => onEditClick("password")}
            onSave={onSavePassword}
            onCancel={onCancel}
          />

          <div className="mt-4 pt-4 border-top text-start">
            <h5 className="text-danger mb-2">ZONA PERICOLOSA</h5>
            <p className="small mb-3">
              Eliminando l'account perderai definitivamente il profilo e i
              preferiti salvati.
            </p>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onOpenDeleteModal}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Eliminazione..." : "Elimina account"}
            </button>
          </div>
        </div>
        <Modal
          show={showDeleteModal}
          onHide={onCloseDeleteModal}
          centered
          contentClassName="bg-dark text-white"
        >
          <Modal.Header closeButton>
            <Modal.Title>Eliminare l'account?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Vuoi davvero eliminare il tuo account? Questa azione è irreversibile
            e rimuoverà anche i tuoi articoli preferiti salvati.
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={onCloseDeleteModal}
              disabled={deletingAccount}
            >
              Annulla
            </Button>

            <Button
              variant="danger"
              onClick={onDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Eliminazione..." : "Elimina account"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default ProfileCard
