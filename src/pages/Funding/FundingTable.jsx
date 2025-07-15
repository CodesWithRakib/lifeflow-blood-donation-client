import { Loader2, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const FundingTable = ({ funds, loading, isAdmin }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy - hh:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Donor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Date
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Details
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading donations...</span>
                  </div>
                </td>
              </tr>
            ) : funds.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No donations found
                </td>
              </tr>
            ) : (
              funds.map((fund) => (
                <tr
                  key={fund._id}
                  className="hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300 font-semibold">
                        {fund.userName?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {fund.userName || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {fund.userEmail || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                      ৳{fund.amount?.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(fund.createdAt)}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        title="View details"
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingTable;
