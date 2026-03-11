const EditableField = ({
  label,
  name,
  type,
  value,
  displayValue,
  isEditing,
  isSaving,
  inputRef,
  onChange,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="text-start mb-4">
      <label className="form-label fw-bold">{label}</label>

      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type={type}
            name={name}
            className="form-control mb-3"
            value={value}
            onChange={onChange}
          />

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
          <span>{displayValue}</span>
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

export default EditableField
