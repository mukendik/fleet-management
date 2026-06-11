import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import Dashboard from "./pages/Dashboard";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected SaaS */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Vehicles />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* default */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}