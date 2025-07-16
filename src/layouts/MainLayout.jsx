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
    <div className="min-h-screen max-w-screen-2xl mx-auto flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
