import { useEffect, useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/vehicles")
      .then(res => setVehicles(res.data))
      .catch(() => navigate("/login"));
  }, []);

  return (
    <div>
      <h1>Vehicles</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>

      {vehicles.map(v => (
        <div key={v.id}>
          {v.name} - {v.plate_number}
        </div>
      ))}
    </div>
  );
}