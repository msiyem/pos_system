import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PageLoader from "../ui/PageLoader";

export default function IndexRedirect() {
  const { role, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (role === "admin") {
    return <Navigate to="/deshboard" replace />;
  }


  // staff or others
  return <Navigate to="/product" replace />;
}
