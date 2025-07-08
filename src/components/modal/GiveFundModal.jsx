import { useState } from "react";
import { X } from "lucide-react";

const GiveFundModal = ({ onFundSubmit, onClose }) => {
  const [amount, setAmount] = useState("");

  const handleFund = () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < 1) {
      alert("Please enter a valid amount (minimum ৳1)");
      return;
    }

    onFundSubmit(numericAmount);
    setAmount("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <h2 className="text-2xl font-semibold text-center text-amber-600 dark:text-amber-400 mb-4">
        Support Our Mission
      </h2>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
        Every contribution helps us continue serving those in need.
      </p>

      <input
        type="number"
        min="1"
        placeholder="Enter amount in ৳"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-5 transition"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleFund}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        Donate via Stripe
      </button>
    </div>
  );
};

export default GiveFundModal;
