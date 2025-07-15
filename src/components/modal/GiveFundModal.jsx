import { useState, useEffect } from "react";
import { X, Loader2, CreditCard, DollarSign } from "lucide-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";

const GiveFundModal = ({ onFundSubmit, onClose, user, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxios();

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
        color: isDarkMode ? "#F3F4F6" : "#1F2937",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "16px",
        "::placeholder": {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
        },
      },
      invalid: {
        color: "#DC2626",
      },
    },
    hidePostalCode: true,
  };

  const confirmDonation = async () => {
    return Swal.fire({
      title: "Confirm Your Donation",
      html: `You are about to donate <strong>$${amount}</strong>. Is this correct?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, donate",
      cancelButtonText: "Cancel",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#ffffff" : "#000000",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      Swal.fire({
        title: "Invalid Amount",
        text: "Please enter a valid amount (minimum $1)",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
      return;
    }

    const confirmation = await confirmDonation();
    if (!confirmation.isConfirmed) return;

    if (!stripe || !elements) {
      Swal.fire({
        title: "Payment Error",
        text: "Payment system is not ready. Please try again later.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
      return;
    }

    setProcessing(true);
    let paymentSucceeded = false;
    let paymentIntentData = null;

    try {
      const result = await onFundSubmit(numericAmount);
      if (!result?.clientSecret) {
        throw new Error("Failed to create payment intent");
      }

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

      if (paymentIntent.status === "succeeded") {
        try {
          const donationResponse = await axiosSecure.post("/funds", {
            userEmail: user?.email,
            userName: user?.displayName || "Anonymous",
            amount: numericAmount,
            currency: "usd",
            paymentIntentId: paymentIntent.id,
            status: "succeeded",
            metadata: {
              isAnonymous: false,
              campaign: "general",
            },
          });

          if (donationResponse.data.success) {
            paymentSucceeded = true;
            paymentIntentData = paymentIntent;

            await Swal.fire({
              title: "Thank You!",
              text: `Your donation of $${numericAmount} was successful.`,
              icon: "success",
              background: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            });
          }
        } catch (postError) {
          if (postError.response?.status === 409) {
            paymentSucceeded = true;
            paymentIntentData = paymentIntent;
            await Swal.fire({
              title: "Donation Recorded",
              text: "This donation has already been processed. Thank you!",
              icon: "info",
              background: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            });
          } else {
            throw postError;
          }
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      await Swal.fire({
        title: "Payment Failed",
        text: err.message || "Something went wrong with your payment.",
        icon: "error",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#ffffff" : "#000000",
      });
    } finally {
      setProcessing(false);
      if (paymentSucceeded) {
        onSuccess({
          amount: numericAmount,
          paymentIntent: paymentIntentData,
        });
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-3">
              <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Support Our Cause
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Every donation helps save lives.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Donation Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card Details
              </label>
              <div className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                <CardElement options={cardStyle} className="p-1" />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || !stripe}
              className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-gray-800 transition ${
                processing ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Donate Now
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveFundModal;
