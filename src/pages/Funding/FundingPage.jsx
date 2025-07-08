// src/pages/FundingPage.jsx
import { useState } from "react";

const FundingPage = () => {
  const dummyFunds = [
    { id: 1, name: "Rakib Islam", amount: 500, date: "2025-07-01" },
    { id: 2, name: "Jane Doe", amount: 1000, date: "2025-07-02" },
    { id: 3, name: "John Smith", amount: 750, date: "2025-07-03" },
  ];

  const [funds, setFunds] = useState(dummyFunds);
  const [showModal, setShowModal] = useState(false);

  const handleFundSubmit = (amount) => {
    // In real app: call Stripe API + backend to record donation
    const newFund = {
      id: Date.now(),
      name: "Current User", // Replace with actual user's name
      amount,
      date: new Date().toISOString().split("T")[0],
    };
    setFunds([newFund, ...funds]);
    setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-600">Funding Records</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 transition"
        >
          + Give Fund
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <GiveFundModal onFundSubmit={handleFundSubmit} />
        </div>
      )}

      <FundingTable funds={funds} />
    </div>
  );
};

export default FundingPage;
