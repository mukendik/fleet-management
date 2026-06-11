import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const navigate = useNavigate();

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

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>

        <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  }}
>
  <thead>
    <tr>
      <th style={thStyle}>ID</th>
      <th style={thStyle}>Name</th>
      <th style={thStyle}>Brand</th>
      <th style={thStyle}>Model</th>
      <th style={thStyle}>Year</th>
      <th style={thStyle}>Plate Number</th>
      <th style={thStyle}>Status</th>
      <th style={thStyle}>Actions</th>
    </tr>
  </thead>

  <tbody>
    {vehicles.map((vehicle) => (
      <tr key={vehicle.id}>
        <td style={tdStyle}>{vehicle.id}</td>
        <td style={tdStyle}>{vehicle.name}</td>
        <td style={tdStyle}>{vehicle.brand || "-"}</td>
        <td style={tdStyle}>{vehicle.model || "-"}</td>
        <td style={tdStyle}>{vehicle.year || "-"}</td>
        <td style={tdStyle}>{vehicle.plate_number}</td>
        <td style={tdStyle}>{vehicle.status}</td>

        <td style={tdStyle}>
          <button style={btnStyle}>View</button>
          <button style={{ ...btnStyle, marginLeft: "5px" }}>Edit</button>
          <button style={{ ...btnStyle, marginLeft: "5px", background: "red", color: "white" }}>
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}