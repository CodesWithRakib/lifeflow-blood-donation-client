import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (user && userRole === "admin") return children;

  return <Navigate to="/" replace />;
};

export default AdminRoute;
