import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && user.email) {
    return children;
  }

  return <Navigate to="/login" state={{ from: pathname }} />;
};

export default PrivateRoute;
