import React from "react";
import useAuth from "../../hooks/useAuth";
import AdminHome from "./Admin/AdminHome";
import DonorHome from "./Donor/DonorHome";
import useTitle from "../../hooks/useTitle";

const Dashboard = () => {
  const { userRole } = useAuth();

  useTitle(`${userRole} Dashboard | LifeFlow - Blood Donation`);

  return (
    <>
      {(userRole === "admin" || userRole === "volunteer") && <AdminHome />}
      {userRole === "donor" && <DonorHome />}
    </>
  );
};

export default Dashboard;
