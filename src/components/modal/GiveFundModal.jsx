import { useState } from "react";

const GiveFundModal = ({ onFundSubmit }) => {
  const [amount, setAmount] = useState("");

  const handleFund = () => {
    if (!amount) return alert("Enter a valid amount");
    // This is where Stripe Payment Modal/Checkout will be triggered
    onFundSubmit(parseFloat(amount));
    setAmount("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-amber-600">Support Us</h2>
      <input
        type="number"
        placeholder="Enter amount"
        className="border rounded w-full px-4 py-2 mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handleFund}
        className="bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 transition"
      >
        Donate via Stripe
      </button>
    </div>
  );
};

export default GiveFundModal;
