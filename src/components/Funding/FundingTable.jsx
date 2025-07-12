import { motion } from "motion/react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

const FundingTable = ({ funds, loading, isAdmin }) => {
  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy - hh:mm a");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Donor
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              {isAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
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
                  <div className="flex justify-center items-center space-x-2 text-gray-500 dark:text-gray-400">
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
              funds.map((fund, index) => (
                <motion.tr
                  key={fund._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  whileHover={{ backgroundColor: "rgba(251, 191, 36, 0.05)" }}
                  className="transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {fund.userName?.charAt(0)?.toUpperCase() || "A"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {fund.userName || "Anonymous"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {fund.userEmail || "No email provided"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                      ৳{fund.amount?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(fund.createdAt)}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingTable;
