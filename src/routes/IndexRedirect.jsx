import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function IndexRedirect() {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }


  // staff or others
  return <Navigate to="/product" replace />;
}
