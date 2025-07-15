import React from "react";
import useAuth from "../../hooks/useAuth";
import AdminHome from "./Admin/AdminHome";
import DonorHome from "./Donor/DonorHome";

const Dashboard = () => {
  const { userRole } = useAuth();

  return (
    <>
      {(userRole === "admin" || userRole === "volunteer") && <AdminHome />}
      {userRole === "donor" && <DonorHome />}
    </>
  );
};

export default Dashboard;
