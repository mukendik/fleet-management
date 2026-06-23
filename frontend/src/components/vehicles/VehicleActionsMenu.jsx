import { useState, useRef, useEffect } from "react";

export default function VehicleActionsMenu({
  onView,
  onEdit,
  onAssign,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>

      {/* 🔥 BUTTON ⋯ DESIGN MODERNE */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid #e5e7eb",
          background: "white",
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f3f4f6";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "white";
        }}
      >
        ⋮
      </button>

      {/* 🔥 DROPDOWN VERTICAL CLEAN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            width: 160,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            overflow: "hidden",
            zIndex: 999,
          }}
        >

          <MenuItem label="View" onClick={onView} />
          <MenuItem label="Edit" onClick={onEdit} />
          <MenuItem label="Assign" onClick={onAssign} />
          
          <div style={{ height: 1, background: "#f3f4f6" }} />

          <MenuItem
            label="Delete"
            onClick={onDelete}
            danger
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick, danger }) {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        fontSize: 13,
        color: danger ? "#dc2626" : "#111827",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = "#f9fafb";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "white";
      }}
    >
      {label}
    </div>
  );
}