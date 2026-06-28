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

        <Route path="/login" element={<Login />} />

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

        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Drivers />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id/assignments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AssignmentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MaintenanceDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/intelligence/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <VehicleIntelligencePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <VehicleDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DriverDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/driver-portal"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DriverPortalPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </ToastProvider>
  );
}