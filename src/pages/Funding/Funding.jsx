import { loadStripe } from "@stripe/stripe-js";
import FundingPage from "./FundingPage";
import { Elements } from "@stripe/react-stripe-js";
import useTitle from "../../hooks/useTitle";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  useTitle("Funding | LifeFlow - Blood Donation");
  return (
    <Elements stripe={stripePromise}>
      <FundingPage />
    </Elements>
  );
};

export default Funding;
