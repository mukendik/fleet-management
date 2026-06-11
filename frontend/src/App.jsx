import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}