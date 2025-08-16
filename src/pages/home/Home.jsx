import React from "react";
import Banner from "./Banner";
import FeaturedSection from "./FeaturedSection";
import ContactUs from "./ContactUs";
import FAQ from "./FAQ";
import DonationProcess from "./DonationProcess";
import ImpactStories from "./ImpactStories";
import UpcomingEvents from "./UpcomingEvents";
import Testimonials from "./Testimonials";
import CallToAction from "./CallToAction";
import BloodTypes from "./BloodTypes";
import useTitle from "../../hooks/useTitle";

const Home = () => {
  useTitle("Home | LifeFlow - Blood Donation");

  return (
    <div>
      <Banner />
      <FeaturedSection />
      <DonationProcess />
      <BloodTypes />
      <ImpactStories />
      <UpcomingEvents />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <ContactUs />
    </div>
  );
};

export default Home;
