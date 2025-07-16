import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

const MainLayout = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen  flex flex-col  bg-white dark:bg-gray-900 dark:text-white text-gray-800 ">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-16 sm:pt-20 ">
        <div className="">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
