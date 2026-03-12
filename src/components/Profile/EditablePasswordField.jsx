import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"

const EditablePasswordField = ({
  isEditing,
  isSaving,
  passwordData,
  onChange,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave()
    }

    if (e.key === "Escape") {
      onCancel()
    }
  }

  return (
    <div className="text-start mb-4">
      <label className="form-label fw-bold">Password</label>

      {isEditing ? (
        <>
          <div className="position-relative mb-3">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              className="form-control pe-5"
              value={passwordData.currentPassword}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Password attuale"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="btn border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-2 p-0"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
            >
              {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="position-relative mb-3">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              className="form-control pe-5"
              value={passwordData.newPassword}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Nuova password"
              autoComplete="new-password"
            />

            <button
              type="button"
              className="btn border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-2 p-0"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="position-relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control pe-5"
              value={passwordData.confirmPassword}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Conferma nuova password"
              autoComplete="new-password"
            />

            <button
              type="button"
              className="btn border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-2 p-0"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? "Salvataggio..." : "Salva"}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onCancel}
              disabled={isSaving}
            >
              Annulla
            </button>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>••••••••</span>
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={onEdit}
          >
            Modifica
          </button>
        </div>
      )}
    </div>
  )
}

export default EditablePasswordField
