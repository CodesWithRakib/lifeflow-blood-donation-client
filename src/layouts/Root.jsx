import React from "react";
import Navbar from "../components/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
