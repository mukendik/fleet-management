import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Vehicles() {const overlayStyle = {
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
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    plate_number: "",
    status: "active",
  });
  const handleCreate = async () => {
      try {
        setLoading(true);

        await client.post("/vehicles", form);

        setIsModalOpen(false);

        const res = await client.get("/vehicles");
        setVehicles(res.data.items);

        setForm({
          name: "",
          brand: "",
          model: "",
          year: "",
          plate_number: "",
          status: "active",
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
  const openEditModal = (vehicle) => {
    setIsEditMode(true);
    setSelectedVehicleId(vehicle.id);

    setForm({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      plate_number: vehicle.plate_number || "",
      status: vehicle.status || "active",
    });

    setIsModalOpen(true);
  };

 useEffect(() => {
  client.get("/vehicles")
    .then(res => {
    setVehicles(res.data.items);
    setTotal(res.data.total);
    setPages(res.data.pages);
  })
    .catch(err => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("API error", err);
        }
      });
}, []);
      const thStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        background: "#f5f5f5",
        textAlign: "left",
      };

      const tdStyle = {
        border: "1px solid #ddd",
        padding: "10px",
      };

      const btnStyle = {
        padding: "5px 10px",
        cursor: "pointer",
      };

  return (
  <div style={{ padding: "20px" }}>
    <h1>Vehicles ({vehicles.length})</h1>

    <button onClick={() => setIsModalOpen(true)}>
      + Create Vehicle
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
    >
      Logout
    </button>

    {/* TABLE */}
    <table style={{ width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Year</th>
          <th>Plate Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td>{vehicle.id}</td>
            <td>{vehicle.name}</td>
            <td>{vehicle.brand || "-"}</td>
            <td>{vehicle.model || "-"}</td>
            <td>{vehicle.year || "-"}</td>
            <td>{vehicle.plate_number}</td>
            <td>{vehicle.status}</td>
            <td>
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {isModalOpen && (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2>Create Vehicle</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />

          <input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <input
            placeholder="Plate number"
            value={form.plate_number}
            onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div style={{ marginTop: "10px" }}>
            <button onClick={handleCreate} disabled={loading}>
              {loading ? (
                  <span>⏳ Saving...</span>
                ) : (
                  "Save"
                )}
            </button>
            <button onClick={() => !loading && setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

  
}