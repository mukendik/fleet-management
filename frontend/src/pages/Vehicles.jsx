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
            <th>ID</th>
            <th>Name</th>
            <th>Plate Number</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.plate_number}</td>
              <td>{vehicle.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}