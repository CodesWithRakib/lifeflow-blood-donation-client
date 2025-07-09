import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import FundingPage from "./FundingPage";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  return (
    <Elements stripe={stripePromise}>
      <FundingPage />
    </Elements>
  );
};

export default Funding;
