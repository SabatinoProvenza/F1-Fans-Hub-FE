import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const DeleteConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  body,
  loading = false,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="bg-dark text-white"
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        className="border-secondary"
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer className="border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>

        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? "Eliminazione..." : "Elimina"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmModal
