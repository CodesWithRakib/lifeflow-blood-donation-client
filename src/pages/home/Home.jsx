import React from "react";
import Banner from "./Banner";
import FeaturedSection from "./FeaturedSection";
import ContactUs from "./ContactUs";
import FAQ from "./FAQ";
import useTitle from "../../hooks/useTitle";

const Home = () => {
  useTitle("Home | LifeFlow - Blood Donation");
  return (
    <div>
      <Banner />
      <FeaturedSection />
      <FAQ />
      <ContactUs />
    </div>
  );
};

export default Home;
