export default function ConfirmModal({
  isOpen,
  title = "Confirmation",
  message = "Are you sure ?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalStyle = {
    background: "white",
    padding: "20px",
    width: "400px",
    borderRadius: "8px",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={onClose} disabled={loading}>
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ background: "red", color: "white" }}
          >
            {loading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}