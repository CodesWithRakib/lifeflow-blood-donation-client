import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "motion/react";
import { format } from "date-fns";
import RequestCardSkeleton from "./RequestCardSkeleton";

const DonationRequestsPublic = () => {
  const axiosSecure = useAxios();

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/donations?status=pending");
      return data.data;
    },
  });

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-red-800 dark:text-red-200 mb-2">
            Failed to load requests
          </h3>
          <p className="text-red-600 dark:text-red-300">
            Please try again later or refresh the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
        >
          Urgent Blood Donation Requests
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          These patients urgently need your help. Your donation can save lives.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <RequestCardSkeleton key={index} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center"
        >
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 mb-4">
            <FaHeartbeat className="h-12 w-12 text-amber-500 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No Active Requests
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Currently there are no pending blood donation requests.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests?.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/20 rounded-lg p-3">
                    <FaHeartbeat className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {req.recipientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Needs{" "}
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {req.bloodGroup}
                      </span>{" "}
                      blood
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>
                      {req.recipientUpazila}, {req.recipientDistrict}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{format(new Date(req.date), "MMM dd, yyyy")}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaClock className="flex-shrink-0 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{req.time}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/donation-request/${req._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequestsPublic;
