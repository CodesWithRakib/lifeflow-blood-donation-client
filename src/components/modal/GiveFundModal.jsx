import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";

const GiveFundModal = ({ onFundSubmit, onClose, user }) => {
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxios();

  // Detect theme change (tailwind "dark" class)
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
        fontSize: "16px",
        color: isDarkMode ? "#F3F4F6" : "#374151",
        "::placeholder": {
          color: isDarkMode ? "#9CA3AF" : "#6B7280",
        },
      },
      invalid: {
        color: "#EF4444",
      },
    },
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      toast.error("Please enter a valid amount (minimum $1)");
      return;
    }

    setProcessing(true);

    const { clientSecret } = await onFundSubmit(numericAmount);
    if (!clientSecret || !stripe || !elements) {
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: user?.email,
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      toast.success("Donation successful! Thank you for your generosity.");

      try {
        await axiosSecure.post("/api/funds", {
          userEmail: user?.email,
          userName: user?.displayName,
          amount: numericAmount,
          currency: "usd",
          paymentIntentId: result.paymentIntent.id,
        });
      } catch (err) {
        console.error("Failed to save donation record:", err);
      }

      onClose();
    }

    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md relative shadow-xl transition-all duration-300 transform">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              Make a Donation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Support our cause with your generous contribution
            </p>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Details
            </label>
            <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
              <CardElement options={cardStyle} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={processing || !stripe}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              processing ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Donate Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiveFundModal;
