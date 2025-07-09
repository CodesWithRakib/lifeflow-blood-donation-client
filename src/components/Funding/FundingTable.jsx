const FundingTable = ({ funds }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-700">
        <thead className="bg-amber-100 dark:bg-amber-700/30 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-6">Donor Name</th>
            <th className="py-3 px-6">Amount (৳)</th>
            <th className="py-3 px-6">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
          {funds.map((fund, idx) => (
            <tr
              key={fund.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                {fund.userName}
              </td>
              <td className="px-6 py-4 text-amber-600 dark:text-amber-400 font-semibold">
                ৳ {fund.amount}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {fund.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundingTable;
