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
    <div>
      <h1>Vehicles ({total})</h1>

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
      <p>Page 1 / {pages}</p>
    </div>
  );
}