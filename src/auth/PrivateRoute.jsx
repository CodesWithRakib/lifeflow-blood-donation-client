import React from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (user && user.email) {
    return children;
  }

  return <Navigate to="/login" state={{ from: pathname }} />;
};

export default PrivateRoute;
