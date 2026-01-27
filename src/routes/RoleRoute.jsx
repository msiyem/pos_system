import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function RoleRoute({ allow = [], children }) {
  const { userId, role, loading } = useAuth();

  if (loading) return null; // or Loader

  if (!userId) return <Navigate to="/login" />;

  if (!allow || allow.length === 0) {
    return children;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
