import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import VehicleDetail from "./pages/VehicleDetail";
import DriverDetail from "./pages/DriverDetailPage";
import AssignmentsPage from "./pages/AssignmentsPage";

import DriverPortalPage from "./pages/drivers-portal/DriverPortalPage";

import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import VehicleIntelligencePage from "./pages/VehicleIntelligencePage";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastProvider } from "./components/ui/toast";

export default function App() {
  return (
    <ToastProvider>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* VEHICLES */}
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <Vehicles />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <VehicleDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles/:id/assignments"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <AssignmentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* DRIVERS */}
        <Route
          path="/drivers"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <Drivers />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <DriverDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* MAINTENANCE */}
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER", "MECHANIC"]}>
              <AppLayout>
                <MaintenanceDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* INTELLIGENCE */}
        <Route
          path="/intelligence/:id"
          element={
            <ProtectedRoute roles={["ADMIN", "FLEET_MANAGER"]}>
              <AppLayout>
                <VehicleIntelligencePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* DRIVER PORTAL */}
        <Route
          path="/driver-portal"
          element={
            <ProtectedRoute roles={["ADMIN", "DRIVER"]}>
              <AppLayout>
                <DriverPortalPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Login />} />

      </Routes>
    </ToastProvider>
  );
}