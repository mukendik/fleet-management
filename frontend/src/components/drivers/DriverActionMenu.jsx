import { useState, useRef, useEffect } from "react";

export default function DriverActionMenu({
  onView,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styles = {
    wrapper: { position: "relative", display: "inline-block" },
    button: {
      width: 34,
      height: 34,
      borderRadius: 8,
      border: "none",
      background: "#f3f4f6",
      cursor: "pointer",
      fontSize: 18,
    },
    dropdown: {
      position: "absolute",
      right: 0,
      top: "110%",
      width: 150,
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      zIndex: 9999,
      overflow: "hidden",
    },
    item: {
      width: "100%",
      padding: "10px 12px",
      textAlign: "left",
      border: "none",
      background: "white",
      cursor: "pointer",
      fontSize: 13,
    },
    danger: {
      width: "100%",
      padding: "10px 12px",
      textAlign: "left",
      border: "none",
      background: "white",
      cursor: "pointer",
      fontSize: 13,
      color: "#dc2626",
    },
  };

  return (
    <div style={styles.wrapper} ref={menuRef}>
      <button style={styles.button} onClick={() => setOpen(!open)}>
        ⋮
      </button>

      {open && (
        <div style={styles.dropdown}>
          <button
            style={styles.item}
            onClick={() => {
              setOpen(false);
              onView?.();
            }}
          >
            👁 View
          </button>

          <button
            style={styles.item}
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
          >
            ✏️ Edit
          </button>

          <button
            style={styles.danger}
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}