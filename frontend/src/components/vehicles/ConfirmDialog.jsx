export default function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  loading
}) {
  if (!open) return null;

  const overlay = {
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

  const box = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h3>{title}</h3>
        <p>{message}</p>

        <button onClick={onCancel}>Cancel</button>

        <button
          onClick={onConfirm}
          disabled={loading}
          style={{ background: "red", color: "white", marginLeft: 10 }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}