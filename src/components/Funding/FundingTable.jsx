const FundingTable = ({ funds }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-amber-100 text-gray-700 uppercase">
          <tr>
            <th className="py-3 px-6">Donor Name</th>
            <th className="py-3 px-6">Amount (৳)</th>
            <th className="py-3 px-6">Date</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund, idx) => (
            <tr key={fund.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{fund.name}</td>
              <td className="px-6 py-4">{fund.amount}</td>
              <td className="px-6 py-4">{fund.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundingTable;
