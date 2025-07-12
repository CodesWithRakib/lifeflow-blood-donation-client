import { useState, useEffect } from "react";
import { X, Loader2, CreditCard, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "motion/react";
import useAxios from "../../hooks/useAxios";

const GiveFundModal = ({ onFundSubmit, onClose, user, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxios();

  // Animation variants
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modal = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Detect theme change
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: isDarkMode ? "#F3F4F6" : "#374151",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
        },
      },
      invalid: {
        color: "#EF4444",
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      toast.error("Please enter a valid amount (minimum $1)");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    setProcessing(true);
    let paymentSucceeded = false;

    try {
      // Step 1: Initialize payment
      const result = await onFundSubmit(numericAmount);
      if (!result?.clientSecret) {
        throw new Error("Payment initialization failed");
      }

      // Step 2: Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        result.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Anonymous Donor",
              email: user?.email,
            },
          },
        }
      );

      if (error) throw error;

      // Step 3: Record payment in database
      if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/api/funds", {
          userEmail: user?.email,
          userName: user?.displayName || "Anonymous",
          amount: numericAmount,
          currency: "usd",
          paymentIntentId: paymentIntent.id,
        });

        paymentSucceeded = true;
        toast.success("Donation successful! Thank you for your generosity.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      if (!paymentSucceeded) {
        // Only show error if payment didn't succeed
        toast.error(error.message || "Payment failed. Please try again.");
      }
    } finally {
      setProcessing(false);
      if (paymentSucceeded) {
        try {
          await onSuccess(); // Call onSuccess only after everything else is done
        } catch (successError) {
          console.error("Success callback error:", successError);
        }
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modal}
          className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 mb-3">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Support Our Cause
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your donation helps us continue our important work
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Donation Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="block w-full pl-8 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Details
                </label>
                <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <CardElement options={cardStyle} className="p-2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || !stripe}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-gray-800 transition-all ${
                  processing ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="-ml-1 mr-2 h-4 w-4" />
                    Donate Now
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
              <p>Secure payment powered by Stripe</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GiveFundModal;
