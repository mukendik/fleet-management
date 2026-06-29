import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  console.log("PROTECTED ROUTE:", { user, loading, roles });

  // 🔥 IMPORTANT: attendre loading
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role?.toUpperCase())) {
    return <Navigate to="/login" replace />;
  }

  return children;
}