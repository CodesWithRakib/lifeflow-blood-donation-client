import React from "react";
import Banner from "./Banner";
import FeaturedSection from "./FeaturedSection";
import ContactUs from "./ContactUs";
import FAQ from "./FAQ";

const Home = () => {
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
