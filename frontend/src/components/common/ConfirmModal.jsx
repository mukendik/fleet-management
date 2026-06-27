export default function ConfirmModal({
  open,
  title = "Confirmation",
  message = "Are you sure ?",
  onCancel,
  onConfirm,
  confirmText = "Delete",
}) {
  if (!open) return null;

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const box = {
    width: 400,
    background: "#fff",
    borderRadius: 12,
    padding: 20,
  };

  const actions = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h3>{title}</h3>
        <p style={{ color: "#6b7280" }}>{message}</p>

        <div style={actions}>
          <button onClick={onCancel}>Cancel</button>

          <button
            onClick={onConfirm}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}